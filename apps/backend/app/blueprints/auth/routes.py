"""Authentication routes."""
from flask import jsonify, request
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity

from . import auth_bp
from app.extensions import limiter


@auth_bp.route('/register', methods=['POST'])
@limiter.limit("5 per hour")
def register():
    """Register a new user."""
    # TODO: Implement user registration
    return jsonify({"message": "User registration endpoint"}), 200


@auth_bp.route('/login', methods=['POST'])
@limiter.limit("10 per hour")
def login():
    """Authenticate user and return tokens."""
    # TODO: Implement user login
    return jsonify({"message": "User login endpoint"}), 200


@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token."""
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity)
    return jsonify(access_token=access_token), 200


@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """Logout user."""
    # TODO: Implement token revocation
    return jsonify({"message": "Successfully logged out"}), 200