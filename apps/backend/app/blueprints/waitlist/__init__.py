"""Waitlist blueprint."""
from flask import Blueprint

waitlist_bp = Blueprint('waitlist', __name__, url_prefix='/api/waitlist')

from . import routes