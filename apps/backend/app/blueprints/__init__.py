"""Blueprint registration."""
from flask import Flask


def register_blueprints(app: Flask):
    """Register all application blueprints."""
    from app.blueprints.admin import admin_bp
    from app.blueprints.auth import auth_bp
    from app.blueprints.users import users_bp
    from app.blueprints.projects import projects_bp
    from app.blueprints.teams import teams_bp
    from app.blueprints.tasks import tasks_bp
    from app.blueprints.chat import chat_bp
    from app.blueprints.insights import insights_bp
    from app.blueprints.waitlist import waitlist_bp
    
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(projects_bp, url_prefix='/api/projects')
    app.register_blueprint(teams_bp, url_prefix='/api/teams')
    app.register_blueprint(tasks_bp, url_prefix='/api/tasks')
    app.register_blueprint(chat_bp, url_prefix='/api/chat')
    app.register_blueprint(insights_bp, url_prefix='/api/insights')
    app.register_blueprint(waitlist_bp, url_prefix='/api/waitlist')