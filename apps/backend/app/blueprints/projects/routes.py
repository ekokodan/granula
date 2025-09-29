"""Project management routes."""
from datetime import datetime
import logging
from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import or_

# Configure logging
logger = logging.getLogger(__name__)

from . import projects_bp
from app.extensions import db
from app.models.project import Project
from app.models.team import Team, TeamMember


def _user_can_access_team(user_id, team_id):
    """Check if user can access team."""
    return TeamMember.query.filter_by(
        user_id=user_id,
        team_id=team_id
    ).first() is not None


def _user_can_manage_team(user_id, team_id):
    """Check if user can manage team (owner or admin)."""
    membership = TeamMember.query.filter_by(
        user_id=user_id,
        team_id=team_id
    ).first()
    
    if not membership:
        return False
    
    team = Team.query.get(team_id)
    return (team and team.created_by == user_id) or membership.role in ['owner', 'admin']


@projects_bp.route('/', methods=['GET'])
@jwt_required()
def list_projects():
    """List projects for the current user."""
    try:
        print("=== PROJECTS LIST START ===", flush=True)
        logger.info("=== PROJECTS LIST START ===")
        user_id = int(get_jwt_identity())  # Convert string back to int for database queries
        print(f"JWT Identity: {user_id} (type: {type(user_id)})", flush=True)
        logger.info(f"JWT Identity: {user_id} (type: {type(user_id)})")
        
        # Check if user exists in database
        from app.models.user import User
        user = User.query.get(user_id)
        print(f"User lookup result: {user}", flush=True)
        logger.info(f"User lookup result: {user}")
        if not user:
            print(f"ERROR: User with ID {user_id} not found in database!", flush=True)
            logger.error(f"User with ID {user_id} not found in database!")
            return jsonify({"error": "User not found"}), 422
        
        # Get projects from teams where user is a member
        logger.info("Fetching user projects")
        projects = Project.query.join(Team).join(TeamMember).filter(
            TeamMember.user_id == user_id
        ).all()
        logger.info(f"Found {len(projects)} projects for user")
        
        return jsonify({
            'projects': [project.to_dict() for project in projects]
        })
        
    except Exception as e:
        print(f"PROJECTS ERROR: {e}", flush=True)
        import traceback
        print(f"Traceback: {traceback.format_exc()}", flush=True)
        logger.error(f"Projects list error: {e}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        return jsonify({"error": f"Projects error: {str(e)}"}), 422


@projects_bp.route('/', methods=['POST'])
@jwt_required()
def create_project():
    """Create a new project."""
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}
    
    name = data.get('name', '').strip()
    team_id = data.get('team_id')
    
    if not name:
        return jsonify({'error': 'Project name is required'}), 400
    
    if not team_id:
        return jsonify({'error': 'Team ID is required'}), 400
    
    # Check if user can manage the team
    if not _user_can_manage_team(user_id, team_id):
        return jsonify({'error': 'Access denied to this team'}), 403
    
    # Create project
    project = Project(
        name=name,
        description=data.get('description', ''),
        status=data.get('status', 'active'),
        team_id=team_id,
        created_by=user_id,
        due_date=datetime.fromisoformat(data['due_date']) if data.get('due_date') else None
    )
    
    db.session.add(project)
    db.session.commit()
    
    return jsonify(project.to_dict()), 201


@projects_bp.route('/<int:project_id>', methods=['GET'])
@jwt_required()
def get_project(project_id):
    """Get a specific project."""
    user_id = int(get_jwt_identity())
    
    project = Project.query.join(Team).join(TeamMember).filter(
        Project.id == project_id,
        TeamMember.user_id == user_id
    ).first()
    
    if not project:
        return jsonify({'error': 'Project not found'}), 404
    
    # Include task count
    project_dict = project.to_dict()
    project_dict['task_count'] = len(project.tasks) if hasattr(project, 'tasks') else 0
    
    return jsonify(project_dict)


@projects_bp.route('/<int:project_id>', methods=['PUT'])
@jwt_required()
def update_project(project_id):
    """Update a project."""
    user_id = int(get_jwt_identity())
    
    project = Project.query.join(Team).join(TeamMember).filter(
        Project.id == project_id,
        TeamMember.user_id == user_id
    ).first()
    
    if not project:
        return jsonify({'error': 'Project not found'}), 404
    
    # Check if user can manage the team
    if not _user_can_manage_team(user_id, project.team_id):
        return jsonify({'error': 'Access denied'}), 403
    
    data = request.get_json() or {}
    
    if 'name' in data:
        name = data['name'].strip()
        if not name:
            return jsonify({'error': 'Project name is required'}), 400
        project.name = name
    
    if 'description' in data:
        project.description = data['description']
    
    if 'status' in data:
        project.status = data['status']
        if data['status'] == 'completed' and not project.completed_at:
            project.completed_at = datetime.utcnow()
        elif data['status'] != 'completed':
            project.completed_at = None
    
    if 'due_date' in data:
        project.due_date = datetime.fromisoformat(data['due_date']) if data['due_date'] else None
    
    db.session.commit()
    return jsonify(project.to_dict())


@projects_bp.route('/<int:project_id>', methods=['DELETE'])
@jwt_required()
def delete_project(project_id):
    """Delete a project."""
    user_id = int(get_jwt_identity())
    
    project = Project.query.join(Team).join(TeamMember).filter(
        Project.id == project_id,
        TeamMember.user_id == user_id
    ).first()
    
    if not project:
        return jsonify({'error': 'Project not found'}), 404
    
    # Check if user can manage the team
    if not _user_can_manage_team(user_id, project.team_id):
        return jsonify({'error': 'Access denied'}), 403
    
    db.session.delete(project)
    db.session.commit()
    
    return jsonify({'message': 'Project deleted successfully'})


@projects_bp.route('/team/<int:team_id>', methods=['GET'])
@jwt_required()
def list_team_projects(team_id):
    """List projects for a specific team."""
    user_id = int(get_jwt_identity())
    
    if not _user_can_access_team(user_id, team_id):
        return jsonify({'error': 'Access denied to this team'}), 403
    
    projects = Project.query.filter_by(team_id=team_id).all()
    
    return jsonify({
        'projects': [project.to_dict() for project in projects]
    })
