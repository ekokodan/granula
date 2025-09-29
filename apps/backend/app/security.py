"""JWT security helpers: token blocklist and revocation."""
from datetime import datetime, timezone
from flask_jwt_extended import JWTManager, jwt_required, get_jwt
from flask import current_app, jsonify
from functools import wraps
from app.extensions import cache, jwt


@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload: dict) -> bool:
    print(f"CHECKING TOKEN REVOCATION: Header={jwt_header}, Payload={jwt_payload}", flush=True)
    jti = jwt_payload.get('jti')
    if not jti:
        print(f"TOKEN MISSING JTI - REJECTING", flush=True)
        return True
    is_revoked = cache.get(f'jwt_blocklist:{jti}') is not None
    print(f"TOKEN JTI {jti} - REVOKED: {is_revoked}", flush=True)
    return is_revoked


def revoke_token(jti: str, exp_timestamp: int):
    """Add the token's jti to blocklist until it would naturally expire."""
    try:
        now = datetime.now(timezone.utc)
        exp = datetime.fromtimestamp(exp_timestamp, tz=timezone.utc)
        seconds = max(int((exp - now).total_seconds()), 0)
    except Exception:
        seconds = 3600
    cache.set(f'jwt_blocklist:{jti}', 'revoked', timeout=seconds)


def roles_required(*roles: str):
    """Decorator to require a role from JWT claims."""
    def decorator(fn):
        @wraps(fn)
        @jwt_required()
        def wrapper(*args, **kwargs):
            claims = get_jwt() or {}
            if claims.get('role') not in roles:
                return jsonify({"error": "Forbidden"}), 403
            return fn(*args, **kwargs)
        return wrapper
    return decorator
