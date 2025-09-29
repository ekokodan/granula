"""Health check endpoints for monitoring and deployment."""
from flask import Blueprint, jsonify
import os

health_bp = Blueprint('health', __name__)

@health_bp.route('/health', methods=['GET'])
def health_check():
    """Basic health check endpoint for Railway and monitoring."""
    return jsonify({
        'status': 'healthy',
        'service': 'granula-backend',
        'version': '1.0.0',
        'environment': os.environ.get('FLASK_ENV', 'development')
    }), 200

@health_bp.route('/ready', methods=['GET'])
def readiness_check():
    """Readiness check - ensures app is ready to receive traffic."""
    try:
        # Add database connectivity check here if needed
        from app.extensions import db
        db.engine.execute('SELECT 1')
        
        return jsonify({
            'status': 'ready',
            'database': 'connected'
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'not ready',
            'error': str(e)
        }), 503