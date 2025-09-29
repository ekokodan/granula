"""Task management routes."""
from datetime import datetime
from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from sqlalchemy import or_, and_

from . import tasks_bp
from app.extensions import db
from app.models.task import Task
from app.models.team import Team, TeamMember
from app.models.user import User
from app.models.project import Project


def _get_user_teams(user_id):
    """Get list of team IDs where user is a member."""
    memberships = TeamMember.query.filter_by(user_id=user_id).all()
    return [m.team_id for m in memberships]


@tasks_bp.route('/', methods=['GET'])
@jwt_required()
def list_tasks():
    """List tasks for the current user with filtering."""
    user_id = get_jwt_identity()
    user_teams = _get_user_teams(user_id)
    
    # Query parameters
    priority = request.args.get('priority')
    status = request.args.get('status')
    assigned_to_me = request.args.get('assigned_to_me', 'false').lower() == 'true'
    project_id = request.args.get('project_id', type=int)
    department_id = request.args.get('department_id', type=int)
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 50, type=int), 100)
    
    # Base query: tasks from user's teams or assigned to user
    query = Task.query.join(Task.project).join(Team).filter(
        or_(
            Team.id.in_(user_teams),
            Task.assigned_to == user_id,
            Task.created_by == user_id
        )
    )
    
    # Apply filters
    if priority:
        query = query.filter(Task.priority == priority)
    if status:
        query = query.filter(Task.status == status)
    if assigned_to_me:
        query = query.filter(Task.assigned_to == user_id)
    if project_id:
        query = query.filter(Task.project_id == project_id)
    if department_id:
        query = query.filter(Task.department_id == department_id)
    
    # Paginate
    tasks = query.order_by(Task.created_at.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )
    
    return jsonify({
        'tasks': [task.to_dict() for task in tasks.items],
        'total': tasks.total,
        'pages': tasks.pages,
        'page': page,
        'per_page': per_page,
        'has_next': tasks.has_next,
        'has_prev': tasks.has_prev,
    })


@tasks_bp.route('/', methods=['POST'])
@jwt_required()
def create_task():
    """Create a new task."""
    user_id = get_jwt_identity()
    data = request.get_json() or {}
    
    # Validate required fields
    title = data.get('title', '').strip()
    if not title:
        return jsonify({'error': 'Title is required'}), 400
    
    project_id = data.get('project_id')
    if not project_id:
        return jsonify({'error': 'Project ID is required'}), 400
    
    # Verify user has access to the project
    project = db.session.query(Project).join(Team).join(TeamMember).filter(
        Project.id == project_id,
        TeamMember.user_id == user_id
    ).first()
    
    if not project:
        return jsonify({'error': 'Access denied to this project'}), 403
    
    # Create task
    task = Task(
        title=title,
        description=data.get('description', ''),
        priority=data.get('priority', 'medium'),
        status=data.get('status', 'pending'),
        project_id=project_id,
        created_by=user_id,
        assigned_to=data.get('assigned_to'),
        department_id=data.get('department_id'),
        due_date=datetime.fromisoformat(data['due_date']) if data.get('due_date') else None
    )
    
    db.session.add(task)
    db.session.commit()
    
    return jsonify(task.to_dict()), 201


@tasks_bp.route('/<int:task_id>', methods=['GET'])
@jwt_required()
def get_task(task_id):
    """Get a specific task."""
    user_id = get_jwt_identity()
    user_teams = _get_user_teams(user_id)
    
    task = Task.query.join(Task.project).join(Team).filter(
        Task.id == task_id,
        or_(
            Team.id.in_(user_teams),
            Task.assigned_to == user_id,
            Task.created_by == user_id
        )
    ).first()
    
    if not task:
        return jsonify({'error': 'Task not found'}), 404
    
    return jsonify(task.to_dict())


@tasks_bp.route('/<int:task_id>', methods=['PUT'])
@jwt_required()
def update_task(task_id):
    """Update a task."""
    user_id = get_jwt_identity()
    user_teams = _get_user_teams(user_id)
    
    task = Task.query.join(Task.project).join(Team).filter(
        Task.id == task_id,
        or_(
            Team.id.in_(user_teams),
            Task.created_by == user_id
        )
    ).first()
    
    if not task:
        return jsonify({'error': 'Task not found'}), 404
    
    data = request.get_json() or {}
    
    # Update fields
    if 'title' in data:
        task.title = data['title'].strip()
    if 'description' in data:
        task.description = data['description']
    if 'priority' in data:
        task.priority = data['priority']
    if 'status' in data:
        task.status = data['status']
        if data['status'] == 'completed' and not task.completed_at:
            task.completed_at = datetime.utcnow()
        elif data['status'] != 'completed':
            task.completed_at = None
    if 'assigned_to' in data:
        task.assigned_to = data['assigned_to']
    if 'department_id' in data:
        task.department_id = data['department_id']
    if 'due_date' in data:
        task.due_date = datetime.fromisoformat(data['due_date']) if data['due_date'] else None
    
    db.session.commit()
    return jsonify(task.to_dict())


@tasks_bp.route('/<int:task_id>', methods=['DELETE'])
@jwt_required()
def delete_task(task_id):
    """Delete a task."""
    user_id = get_jwt_identity()
    user_teams = _get_user_teams(user_id)
    
    task = Task.query.join(Task.project).join(Team).filter(
        Task.id == task_id,
        or_(
            Team.id.in_(user_teams),
            Task.created_by == user_id
        )
    ).first()
    
    if not task:
        return jsonify({'error': 'Task not found'}), 404
    
    db.session.delete(task)
    db.session.commit()
    
    return jsonify({'message': 'Task deleted successfully'})


@tasks_bp.route('/<int:task_id>/assign', methods=['PATCH'])
@jwt_required()
def assign_task(task_id):
    """Assign task to a team member."""
    user_id = get_jwt_identity()
    user_teams = _get_user_teams(user_id)
    
    task = Task.query.join(Task.project).join(Team).filter(
        Task.id == task_id,
        or_(
            Team.id.in_(user_teams),
            Task.created_by == user_id
        )
    ).first()
    
    if not task:
        return jsonify({'error': 'Task not found'}), 404
    
    data = request.get_json() or {}
    assigned_to = data.get('assigned_to')
    
    if assigned_to:
        # Verify the user is a team member
        is_member = TeamMember.query.join(Team).filter(
            TeamMember.user_id == assigned_to,
            Team.id == task.project.team_id
        ).first()
        
        if not is_member:
            return jsonify({'error': 'User is not a team member'}), 400
    
    task.assigned_to = assigned_to
    db.session.commit()
    
    return jsonify(task.to_dict())


@tasks_bp.route('/<int:task_id>/status', methods=['PATCH'])
@jwt_required()
def update_task_status(task_id):
    """Update task status."""
    user_id = get_jwt_identity()
    user_teams = _get_user_teams(user_id)
    
    task = Task.query.join(Task.project).join(Team).filter(
        Task.id == task_id,
        or_(
            Team.id.in_(user_teams),
            Task.assigned_to == user_id,
            Task.created_by == user_id
        )
    ).first()
    
    if not task:
        return jsonify({'error': 'Task not found'}), 404
    
    data = request.get_json() or {}
    status = data.get('status')
    
    if not status:
        return jsonify({'error': 'Status is required'}), 400
    
    task.status = status
    if status == 'completed' and not task.completed_at:
        task.completed_at = datetime.utcnow()
    elif status != 'completed':
        task.completed_at = None
    
    db.session.commit()
    return jsonify(task.to_dict())
