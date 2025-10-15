"""Recurring tasks blueprint."""
from flask import Blueprint

recurring_bp = Blueprint('recurring', __name__, url_prefix='/api/recurring-tasks')

from . import routes  # noqa: E402, F401