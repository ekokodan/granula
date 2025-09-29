"""Flask extensions initialization."""
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_caching import Cache
from authlib.integrations.flask_client import OAuth

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
mail = Mail()
limiter = Limiter(key_func=get_remote_address)
cache = Cache()
oauth = OAuth()


def init_extensions(app):
    """Initialize Flask extensions."""
    print(f"Initializing extensions for app: {app.name}", flush=True)
    db.init_app(app)
    migrate.init_app(app, db)
    
    # Test database connection
    with app.app_context():
        try:
            from sqlalchemy import text
            result = db.session.execute(text('SELECT 1'))
            print(f"DATABASE CONNECTION: SUCCESS - {result.fetchone()}", flush=True)
        except Exception as db_error:
            print(f"DATABASE CONNECTION FAILED: {db_error}", flush=True)
    jwt.init_app(app)
    print(f"JWT initialized with config: {app.config.get('JWT_SECRET_KEY', 'NOT_SET')[:10]}...", flush=True)
    
    # Add JWT error handlers with debugging
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        print(f"JWT EXPIRED TOKEN: {jwt_payload}", flush=True)
        return {'error': 'Token has expired'}, 401
    
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        print(f"JWT INVALID TOKEN: {error}", flush=True)
        return {'error': 'Invalid token'}, 422
    
    @jwt.unauthorized_loader
    def missing_token_callback(error):
        print(f"JWT MISSING TOKEN: {error}", flush=True)
        return {'error': 'Authorization token is required'}, 401
    
    @jwt.token_verification_failed_loader
    def token_verification_failed_callback(jwt_header, jwt_payload):
        print(f"JWT VERIFICATION FAILED: Header={jwt_header}, Payload={jwt_payload}", flush=True)
        return {'error': 'Token verification failed'}, 422
    
    @jwt.revoked_token_loader
    def revoked_token_callback(jwt_header, jwt_payload):
        print(f"JWT REVOKED TOKEN: {jwt_payload}", flush=True)
        return {'error': 'Token has been revoked'}, 401
    mail.init_app(app)
    limiter.init_app(app)
    if app.config.get('USE_REDIS'):
        cache.init_app(app, config={'CACHE_TYPE': 'redis', 'CACHE_REDIS_URL': app.config.get('REDIS_URL')})
    else:
        cache.init_app(app, config={'CACHE_TYPE': 'simple'})
    oauth.init_app(app)

    # Register Google OAuth client if configured
    if app.config.get('GOOGLE_CLIENT_ID') and app.config.get('GOOGLE_CLIENT_SECRET'):
        # Determine redirect URI
        redirect_uri = app.config.get('OAUTH_REDIRECT_URI') or (
            app.config.get('BASE_URL', '').rstrip('/') + '/api/auth/oauth/google/callback'
        )
        oauth.register(
            name='google',
            client_id=app.config['GOOGLE_CLIENT_ID'],
            client_secret=app.config['GOOGLE_CLIENT_SECRET'],
            server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
            client_kwargs={'scope': 'openid email profile'},
            redirect_uri=redirect_uri,
        )
