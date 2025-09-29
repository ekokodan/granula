"""Token utilities for email verification and password reset."""
from datetime import timedelta
from typing import Optional, Tuple

from flask import current_app
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired


def _get_serializer(purpose: str) -> URLSafeTimedSerializer:
    secret_key = current_app.config['SECRET_KEY']
    salt = current_app.config.get('SECURITY_PASSWORD_SALT', 'salt') + f':{purpose}'
    return URLSafeTimedSerializer(secret_key=secret_key, salt=salt)


def generate_token(data: dict, purpose: str, expires_in: timedelta) -> str:
    s = _get_serializer(purpose)
    # itsdangerous encodes payload; expiration enforced at loads time
    return s.dumps(data)


def verify_token(token: str, purpose: str, max_age: timedelta) -> Tuple[bool, Optional[dict], Optional[str]]:
    s = _get_serializer(purpose)
    try:
        data = s.loads(token, max_age=int(max_age.total_seconds()))
        return True, data, None
    except SignatureExpired:
        return False, None, 'expired'
    except BadSignature:
        return False, None, 'invalid'

