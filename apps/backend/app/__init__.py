"""Flask application factory and configuration."""
from flask import Flask
from flask_cors import CORS

from app.config import config_by_name
from app.extensions import init_extensions
from app.blueprints import register_blueprints


def create_app(config_name='development'):
    """Create and configure Flask application."""
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(config_by_name[config_name])
    
    # Initialize extensions
    init_extensions(app)
    
    # Enable CORS
    CORS(app, resources={r"/api/*": {"origins": app.config.get('CORS_ORIGINS', '*')}})
    
    # Register blueprints
    register_blueprints(app)
    
    return app