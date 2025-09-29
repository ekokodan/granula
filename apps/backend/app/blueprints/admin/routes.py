"""Admin routes for route inventory, test execution, and utilities."""
from __future__ import annotations

import os
import subprocess
from pathlib import Path
from typing import List, Dict, Any

from flask import current_app, jsonify, request
from flask_jwt_extended import get_jwt_identity
from app.models.user import User
from app.extensions import db
from app.services.email_service import EmailService

from . import admin_bp
from app.security import roles_required


@admin_bp.route("/routes", methods=["GET"])
@roles_required('admin')
def list_backend_routes():
    """List all registered backend routes and methods."""
    routes: List[Dict[str, Any]] = []
    app = current_app
    for rule in app.url_map.iter_rules():
        # Skip static route and admin list itself optional filtering
        if rule.endpoint == "static":
            continue
        methods = sorted(m for m in rule.methods if m not in {"HEAD", "OPTIONS"})
        routes.append(
            {
                "rule": str(rule),
                "endpoint": rule.endpoint,
                "methods": methods,
            }
        )
    routes.sort(key=lambda r: r["rule"])  # deterministic ordering
    return jsonify({"routes": routes})


@admin_bp.route("/frontend/pages", methods=["GET"])
@roles_required('admin')
def list_frontend_pages():
    """List frontend pages by scanning the src/pages directory."""
    # current_app.root_path -> .../apps/backend/app
    # parents[2] -> .../granula
    base_dir = Path(current_app.root_path).parents[2]
    pages_dir = base_dir / "apps" / "frontend" / "src" / "pages"
    results: List[Dict[str, str]] = []
    if pages_dir.exists():
        for entry in sorted(pages_dir.glob("*.tsx")):
            results.append({
                "file": str(entry.relative_to(base_dir)),
                "name": entry.stem,
                "route_hint": f"/{entry.stem.lower()}"
            })
    return jsonify({"pages": results})


@admin_bp.route("/tests/run", methods=["POST"])  # optionally GET for convenience
@roles_required('admin')
def run_backend_tests():
    """Run backend tests (pytest or unittest) and return summarized output.

    Supports query/body params:
      - path: subpath under apps/backend/tests to target
    """
    backend_root = Path(current_app.root_path).parents[1]  # apps/backend
    tests_path = backend_root / "tests"
    requested_path = request.json.get("path") if request.is_json else request.args.get("path")
    target = tests_path / requested_path if requested_path else tests_path

    # Prefer pytest if present; otherwise, use python -m unittest
    cmd: List[str]
    if (backend_root / "pytest.ini").exists() or (backend_root / "pyproject.toml").exists():
        cmd = ["pytest", "-q", str(target)]
    else:
        # Fall back to unittest discovery
        cmd = [
            "python3",
            "-m",
            "unittest",
            "discover",
            "-s",
            str(target),
            "-p",
            "test_*.py",
        ]

    try:
        completed = subprocess.run(
            cmd,
            cwd=str(backend_root),
            capture_output=True,
            text=True,
            timeout=60 * 5,
        )
        return jsonify(
            {
                "command": " ".join(cmd),
                "returncode": completed.returncode,
                "stdout": completed.stdout[-10000:],  # limit size
                "stderr": completed.stderr[-10000:],
                "success": completed.returncode == 0,
            }
        ), (200 if completed.returncode == 0 else 500)
    except subprocess.TimeoutExpired:
        return jsonify({"error": "Test run timed out"}), 504
    except FileNotFoundError:
        return jsonify({"error": "Test runner not found. Ensure dependencies installed."}), 500


@admin_bp.route("/waitlist/export-url", methods=["GET"])
@roles_required('admin')
def waitlist_export_url():
    """Convenience endpoint to surface existing CSV export route."""
    return jsonify({"url": "/api/waitlist/export"})


@admin_bp.route('/users', methods=['GET'])
@roles_required('admin')
def list_users():
    """List users with pagination and filtering."""
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 50, type=int)
    q = (request.args.get('q') or '').strip().lower()
    role = (request.args.get('role') or '').strip().lower()

    per_page = min(per_page, 100)
    query = User.query
    if q:
        query = query.filter(User.email.ilike(f'%{q}%'))
    if role in ('admin', 'user'):
        query = query.filter(User.role == role)
    users = query.order_by(User.created_at.desc()).paginate(page=page, per_page=per_page, error_out=False)
    return jsonify({
        'items': [u.to_dict() for u in users.items],
        'total': users.total,
        'pages': users.pages,
        'page': page,
        'per_page': per_page,
        'has_next': users.has_next,
        'has_prev': users.has_prev,
    })


@admin_bp.route('/users/<int:user_id>/role', methods=['PATCH'])
@roles_required('admin')
def update_user_role(user_id: int):
    """Update a user's role. Prevent demoting the last admin or self-demote if last admin."""
    data = request.get_json() or {}
    new_role = (data.get('role') or '').strip().lower()
    if new_role not in ('admin', 'user'):
        return jsonify({'error': 'Invalid role'}), 400
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    current_user_id = get_jwt_identity()

    if user.role == 'admin' and new_role != 'admin':
        # Prevent demoting the last admin
        admin_count = User.query.filter_by(role='admin', is_active=True).count()
        if admin_count <= 1:
            return jsonify({'error': 'Cannot demote the last active admin'}), 400
        # Prevent self-demotion if last admin
        if user.id == current_user_id:
            return jsonify({'error': 'Cannot demote yourself if you are the last admin'}), 400

    user.role = new_role
    db.session.commit()
    return jsonify({'user': user.to_dict()}), 200


@admin_bp.route('/users/<int:user_id>/resend-verification', methods=['POST'])
@roles_required('admin')
def admin_resend_verification(user_id: int):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    if user.is_verified:
        return jsonify({'message': 'User already verified'}), 200
    try:
        EmailService.send_verification_email(user.email)
    except Exception as e:
        current_app.logger.warning(f'Admin resend verification failed for {user.email}: {e}')
    return jsonify({'message': 'Verification email sent (if possible)'}), 200
