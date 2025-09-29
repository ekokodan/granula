"""Admin blueprint package."""
from flask import Blueprint


admin_bp = Blueprint("admin", __name__)


# Ensure routes are registered
from . import routes  # noqa: E402,F401





