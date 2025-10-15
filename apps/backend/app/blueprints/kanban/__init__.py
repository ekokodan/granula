"""Kanban board blueprint."""
from flask import Blueprint

kanban_bp = Blueprint('kanban', __name__, url_prefix='/api/kanban')

from . import routes  # noqa: E402, F401