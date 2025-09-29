"""Flask application factory and configuration."""
import logging
from flask import Flask
from flask_cors import CORS

from app.config import config_by_name
from app.extensions import init_extensions
from app.blueprints import register_blueprints


def create_app(config_name='development'):
    """Create and configure Flask application."""
    app = Flask(__name__)
    
    # Configure logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s %(levelname)s %(name)s: %(message)s'
    )
    
    # Load configuration
    app.config.from_object(config_by_name[config_name])
    
    # Initialize extensions
    init_extensions(app)
    # Register JWT blocklist callbacks without rebinding local `app`
    from app import security as _security  # noqa: F401
    
    # Enable CORS with credentials for API routes
    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": app.config.get('CORS_ORIGINS', '*'),
                "methods": ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
                "allow_headers": ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With']
            }
        },
        supports_credentials=app.config.get('CORS_SUPPORTS_CREDENTIALS', True),
    )
    
    # Add request logging
    @app.before_request
    def log_request():
        from flask import request
        print(f"REQUEST: {request.method} {request.path} - Headers: {dict(request.headers)}", flush=True)
        
        # Log JWT token details if present
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
            print(f"JWT TOKEN PRESENT: {token[:50]}...", flush=True)
            
            # Try to decode the token without verification to see what's inside
            try:
                import jwt as pyjwt
                decoded = pyjwt.decode(token, options={"verify_signature": False})
                print(f"JWT PAYLOAD (unverified): {decoded}", flush=True)
            except Exception as decode_error:
                print(f"JWT DECODE ERROR: {decode_error}", flush=True)
    
    # Register blueprints
    register_blueprints(app)
    
    # Add global error handlers for debugging
    @app.errorhandler(422)
    def handle_unprocessable_entity(e):
        import logging
        import traceback
        from flask import request
        print(f"GLOBAL 422 ERROR HANDLER: {e}", flush=True)
        print(f"Request: {request.method} {request.path}", flush=True)
        print(f"Request headers: {dict(request.headers)}", flush=True)
        print(f"Error traceback: {traceback.format_exc()}", flush=True)
        logger = logging.getLogger(__name__)
        logger.error(f"422 Unprocessable Entity: {e}")
        return e
    
    @app.errorhandler(Exception)
    def handle_exception(e):
        import logging
        import traceback
        print(f"GLOBAL EXCEPTION HANDLER: {e}", flush=True)
        print(f"Exception type: {type(e)}", flush=True)
        print(f"Traceback: {traceback.format_exc()}", flush=True)
        logger = logging.getLogger(__name__)
        logger.error(f"Unhandled exception: {e}")
        logger.error(f"Exception type: {type(e)}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        # Return the original error response
        return {"error": "Internal server error"}, 500
    
    return app
