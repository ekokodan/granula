"""Authentication routes."""
from datetime import datetime, timedelta

from flask import jsonify, request, current_app, redirect, make_response, url_for
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
    set_refresh_cookies,
    unset_jwt_cookies,
    get_jwt,
)
from werkzeug.security import generate_password_hash, check_password_hash

from . import auth_bp
from app.extensions import limiter, db, oauth
from app.models.user import User
from app.services.email_service import EmailService
from app.services.token_service import verify_token
from app.security import revoke_token
from app.extensions import cache
import random


def _user_payload(user: User) -> dict:
    return {
        'id': user.id,
        'email': user.email,
        'role': user.role,
        'is_verified': user.is_verified,
        'onboarding_complete': user.onboarding_complete,
    }


@auth_bp.route('/register', methods=['POST'])
@limiter.limit("5 per hour")
def register():
    """Register a new user with email + password; send verification email."""
    data = request.get_json() or {}
    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    # Basic email format check
    if '@' not in email or '.' not in email:
        return jsonify({"error": "Invalid email format"}), 400

    existing = User.query.filter_by(email=email).first()
    if existing:
        return jsonify({"error": "Email already registered"}), 409

    user = User(
        email=email,
        password_hash=generate_password_hash(password),
        is_active=True,
        is_verified=False,
        role='user',
    )
    db.session.add(user)
    db.session.commit()

    # Send verification email (best effort)
    try:
        EmailService.send_verification_email(email)
    except Exception as e:
        current_app.logger.warning(f"Failed sending verification email to {email}: {e}")

    return jsonify({
        "message": "Account created. Please check your email to verify your account.",
    }), 201


@auth_bp.route('/verify-email', methods=['GET'])
def verify_email():
    """Verify user's email from a signed token and redirect to frontend."""
    token = request.args.get('token', '')
    if not token:
        return jsonify({"error": "Missing token"}), 400

    ok, data, reason = verify_token(token, purpose="verify_email", max_age=timedelta(hours=24))
    if not ok:
        # Redirect to frontend with failure
        url = f"{current_app.config.get('FRONTEND_URL')}/login?verified=0&reason={reason or 'invalid'}"
        return redirect(url)

    email = (data.get('email') or '').lower()
    user = User.query.filter_by(email=email).first()
    if not user:
        url = f"{current_app.config.get('FRONTEND_URL')}/login?verified=0&reason=not_found"
        return redirect(url)

    if not user.is_verified:
        user.is_verified = True
        db.session.commit()
        try:
            EmailService.send_verified_welcome(email)
        except Exception as e:
            current_app.logger.warning(f"Failed sending verified welcome to {email}: {e}")

    # Redirect to login with a next param so user signs in and continues onboarding
    fe = current_app.config.get('FRONTEND_URL')
    next_path = '/onboarding/plan-selection'
    url = f"{fe}/login?verified=1&next={next_path}"
    return redirect(url)


@auth_bp.route('/resend-verification', methods=['POST'])
@limiter.limit("5 per hour")
def resend_verification():
    data = request.get_json() or {}
    email = (data.get('email') or '').strip().lower()
    if not email:
        return jsonify({"error": "Email is required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"message": "If the email exists, a link has been sent"}), 200

    if user.is_verified:
        return jsonify({"message": "Account already verified"}), 200

    try:
        EmailService.send_verification_email(email)
    except Exception as e:
        current_app.logger.warning(f"Failed resend verification to {email}: {e}")
    return jsonify({"message": "Verification email sent"}), 200


@auth_bp.route('/oauth/google/start', methods=['GET'])
def oauth_google_start():
    """Begin Google OAuth flow."""
    if not current_app.config.get('GOOGLE_CLIENT_ID'):
        return jsonify({"error": "Google OAuth not configured"}), 501
    redirect_uri = url_for('auth.oauth_google_callback', _external=True)
    return oauth.google.authorize_redirect(redirect_uri)


@auth_bp.route('/oauth/google/callback', methods=['GET'])
def oauth_google_callback():
    """Handle Google OAuth callback, create/login user, set refresh cookie, and redirect to frontend."""
    if not current_app.config.get('GOOGLE_CLIENT_ID'):
        return jsonify({"error": "Google OAuth not configured"}), 501
    try:
        token = oauth.google.authorize_access_token()
        userinfo = token.get('userinfo')
        if not userinfo:
            # Try fetching userinfo explicitly via userinfo endpoint
            try:
                resp = oauth.google.get('userinfo')
                if resp is not None and resp.ok:
                    userinfo = resp.json()
            except Exception:
                userinfo = None
        if not userinfo:
            # Fallback to ID token parse
            try:
                userinfo = oauth.google.parse_id_token(token) or {}
            except Exception:
                userinfo = {}
        email = (userinfo.get('email') or '').lower()
        if not email:
            return redirect(f"{current_app.config.get('FRONTEND_URL')}/login?oauth=failed")

        user = User.query.filter_by(email=email).first()
        created = False
        if not user:
            user = User(email=email, password_hash='oauth', is_active=True, is_verified=True, role='user')
            db.session.add(user)
            db.session.commit()
            created = True
        else:
            if not user.is_verified:
                user.is_verified = True
            user.last_login_at = datetime.utcnow()
            db.session.commit()

        claims = {'role': user.role, 'email': user.email, 'is_verified': user.is_verified}
        access_token = create_access_token(identity=str(user.id), additional_claims=claims)
        refresh_token = create_refresh_token(identity=str(user.id), additional_claims=claims)
        resp = make_response(redirect(_post_oauth_redirect_url(user, access_token)))
        set_refresh_cookies(resp, refresh_token)
        return resp
    except Exception as e:
        current_app.logger.exception(f"Google OAuth error: {e}")
        return redirect(f"{current_app.config.get('FRONTEND_URL')}/login?oauth=failed")


def _post_oauth_redirect_url(user: User, access_token: str) -> str:
    """Decide where to send the user after OAuth."""
    fe = current_app.config.get('FRONTEND_URL')
    if not user.onboarding_complete:
        return f"{fe}/onboarding/plan-selection#access_token={access_token}"
    return f"{fe}/dashboard#access_token={access_token}"


@auth_bp.route('/login', methods=['POST'])
@limiter.limit("10 per hour")
def login():
    """Authenticate user and return access token + set refresh cookie."""
    data = request.get_json() or {}
    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid email or password"}), 401

    if not user.is_active:
        return jsonify({"error": "Account disabled"}), 403

    if not user.is_verified:
        return jsonify({"error": "Please verify your email before logging in"}), 403

    user.last_login_at = datetime.utcnow()
    db.session.commit()

    additional_claims = {
        'role': user.role,
        'email': user.email,
        'is_verified': user.is_verified,
    }
    access_token = create_access_token(identity=str(user.id), additional_claims=additional_claims)
    refresh_token = create_refresh_token(identity=str(user.id), additional_claims=additional_claims)

    resp = make_response(jsonify({
        'access_token': access_token,
        'user': _user_payload(user)
    }))
    set_refresh_cookies(resp, refresh_token)
    return resp, 200


@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token using refresh cookie."""
    identity = get_jwt_identity()
    user = User.query.get(int(identity))  # Convert string back to int for database query
    if not user or not user.is_active:
        return jsonify({"error": "Invalid user"}), 401

    additional_claims = {
        'role': user.role,
        'email': user.email,
        'is_verified': user.is_verified,
    }
    # rotate refresh token: revoke old refresh jti and set a new cookie
    old_jwt = get_jwt()
    try:
        revoke_token(old_jwt['jti'], old_jwt['exp'])
    except Exception:
        pass
    access_token = create_access_token(identity=str(identity), additional_claims=additional_claims)
    new_refresh = create_refresh_token(identity=str(identity), additional_claims=additional_claims)
    resp = make_response(jsonify(access_token=access_token))
    set_refresh_cookies(resp, new_refresh)
    return resp, 200


@auth_bp.route('/logout', methods=['POST'])
@jwt_required(refresh=True)
def logout():
    """Logout user by revoking refresh token and clearing cookies."""
    try:
        jwt_data = get_jwt()
        revoke_token(jwt_data['jti'], jwt_data['exp'])
    except Exception:
        pass
    resp = make_response(jsonify({"message": "Successfully logged out"}))
    unset_jwt_cookies(resp)
    return resp, 200


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    """Return current user profile."""
    identity = get_jwt_identity()
    user = User.query.get(int(identity))  # Convert string back to int for database query
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user=_user_payload(user)), 200


@auth_bp.route('/otp/request', methods=['POST'])
@limiter.limit("3 per hour")
def otp_request():
    data = request.get_json() or {}
    email = (data.get('email') or '').strip().lower()
    if not email:
        return jsonify({"error": "Email is required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"message": "If the email exists, an OTP has been sent"}), 200
    if not user.is_verified:
        return jsonify({"error": "Please verify your email first"}), 403

    code = f"{random.randrange(100000, 999999)}"
    cache.set(f'otp:{email}', code, timeout=300)
    try:
        EmailService.send_login_otp(email=email, code=code)
    except Exception as e:
        current_app.logger.warning(f"Failed to send OTP to {email}: {e}")
    return jsonify({"message": "OTP sent if the email exists"}), 200


@auth_bp.route('/otp/verify', methods=['POST'])
@limiter.limit("10 per hour")
def otp_verify():
    data = request.get_json() or {}
    email = (data.get('email') or '').strip().lower()
    code = (data.get('code') or '').strip()
    if not email or not code:
        return jsonify({"error": "Email and code are required"}), 400

    expected = cache.get(f'otp:{email}')
    if not expected:
        return jsonify({"error": "Invalid or expired OTP"}), 400
    if isinstance(expected, (bytes, bytearray)):
        try:
            expected = expected.decode()
        except Exception:
            pass
    if expected != code:
        return jsonify({"error": "Invalid or expired OTP"}), 400

    # clear OTP
    cache.delete(f'otp:{email}')
    user = User.query.filter_by(email=email).first()
    if not user or not user.is_active or not user.is_verified:
        return jsonify({"error": "Invalid user"}), 401

    user.last_login_at = datetime.utcnow()
    db.session.commit()

    additional_claims = {
        'role': user.role,
        'email': user.email,
        'is_verified': user.is_verified,
    }
    access_token = create_access_token(identity=str(user.id), additional_claims=additional_claims)
    refresh_token = create_refresh_token(identity=str(user.id), additional_claims=additional_claims)
    resp = make_response(jsonify({ 'access_token': access_token, 'user': _user_payload(user) }))
    set_refresh_cookies(resp, refresh_token)
    return resp, 200


@auth_bp.route('/password/forgot', methods=['POST'])
@limiter.limit("5 per hour")
def password_forgot():
    data = request.get_json() or {}
    email = (data.get('email') or '').strip().lower()
    if not email:
        return jsonify({"error": "Email is required"}), 400
    user = User.query.filter_by(email=email).first()
    if user and user.is_verified:
        try:
            EmailService.send_password_reset(email)
        except Exception as e:
            current_app.logger.warning(f"Failed to send reset email to {email}: {e}")
    return jsonify({"message": "If the email exists, a reset link has been sent"}), 200


@auth_bp.route('/password/reset', methods=['POST'])
def password_reset():
    data = request.get_json() or {}
    token = (data.get('token') or '').strip()
    new_password = data.get('password') or ''
    if not token or not new_password:
        return jsonify({"error": "Token and new password are required"}), 400
    ok, data, reason = verify_token(token, purpose='reset_password', max_age=timedelta(hours=1))
    if not ok:
        return jsonify({"error": f"Invalid or expired token ({reason})"}), 400
    email = (data.get('email') or '').lower()
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "User not found"}), 404
    user.password_hash = generate_password_hash(new_password)
    db.session.commit()
    return jsonify({"message": "Password has been reset"}), 200
