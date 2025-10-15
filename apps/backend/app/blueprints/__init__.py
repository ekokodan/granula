"""Blueprint registration."""
from flask import Flask


def register_blueprints(app: Flask):
    """Register all application blueprints."""
    print("REGISTERING BLUEPRINTS - START", flush=True)
    
    try:
        from app.blueprints.admin import admin_bp
        from app.blueprints.auth import auth_bp
        from app.blueprints.users import users_bp
        from app.blueprints.projects import projects_bp
        from app.blueprints.teams import teams_bp
        from app.blueprints.tasks import tasks_bp
        from app.blueprints.chat import chat_bp
        from app.blueprints.insights import insights_bp
        from app.blueprints.waitlist import waitlist_bp
        from app.blueprints.comments import comments_bp
        from app.blueprints.recurring import recurring_bp
        from app.blueprints.kanban import kanban_bp
        from app.blueprints.analytics import analytics_bp
        from app.blueprints.templates import templates_bp
        from app.blueprints.schedules.routes import schedules_bp
        import sys
        import os
        sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
        from health import health_bp
        print("BLUEPRINT IMPORTS: SUCCESS", flush=True)
        
        blueprints = [
            (health_bp, None),
            (admin_bp, '/api/admin'),
            (auth_bp, '/api/auth'),
            (users_bp, '/api/users'),
            (projects_bp, '/api/projects'),
            (teams_bp, '/api/teams'),
            (tasks_bp, '/api/tasks'),
            (chat_bp, '/api/chat'),
            (insights_bp, '/api/insights'),
            (waitlist_bp, '/api/waitlist'),
            (comments_bp, '/api/comments'),
            (recurring_bp, '/api/recurring-tasks'),
            (kanban_bp, '/api/kanban'),
            (analytics_bp, '/api/analytics'),
            (templates_bp, '/api/templates'),
            (schedules_bp, '/api/schedules')
        ]
        
        for blueprint, prefix in blueprints:
            if prefix:
                app.register_blueprint(blueprint, url_prefix=prefix)
                print(f"REGISTERED: {blueprint.name} at {prefix}", flush=True)
            else:
                app.register_blueprint(blueprint)
                print(f"REGISTERED: {blueprint.name} (no prefix)", flush=True)
                
        print("REGISTERING BLUEPRINTS - COMPLETE", flush=True)
        
    except Exception as e:
        print(f"BLUEPRINT REGISTRATION ERROR: {e}", flush=True)
        import traceback
        print(f"Traceback: {traceback.format_exc()}", flush=True)
        raise