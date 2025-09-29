"""User routes."""
from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from . import users_bp
from app.extensions import db
from app.models.user import User


@users_bp.route('/')
def index():
    """Users index endpoint."""
    return jsonify({'message': 'Users API endpoint'})


@users_bp.route('/me', methods=['PATCH'])
@jwt_required()
def update_me():
    """Update current user fields like onboarding_complete and basic profile fields."""
    uid = get_jwt_identity()
    user = User.query.get(uid)
    if not user:
        return jsonify({"error": "User not found"}), 404
    data = request.get_json() or {}

    # Allow setting onboarding_complete and role only if safe (role changes not allowed here)
    if 'onboarding_complete' in data:
        user.onboarding_complete = bool(data['onboarding_complete'])

    # Potential future profile fields (first_name, last_name, etc.) can be added here safely

    db.session.commit()
    return jsonify({"user": user.to_dict()}), 200
