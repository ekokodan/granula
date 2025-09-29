"""chat routes."""
from flask import jsonify
from . import chat_bp


@chat_bp.route('/')
def index():
    """chat index endpoint."""
    return jsonify({'message': 'chat API endpoint'})
