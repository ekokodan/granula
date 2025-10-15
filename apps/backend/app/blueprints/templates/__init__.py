"""Project templates blueprint."""
from flask import Blueprint

templates_bp = Blueprint('templates', __name__, url_prefix='/api/templates')

from . import routes  # noqa: E402, F401