"""Recurring task routes."""
from datetime import datetime, timedelta
from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import or_

from . import recurring_bp
from app.extensions import db
from app.models.recurring_task import RecurringTask
from app.models.task import Task
from app.models.team import Team, TeamMember
from app.models.project import Project


@recurring_bp.route('/', methods=['GET'])
@jwt_required()
def list_recurring_tasks():
    """List recurring tasks for the current user."""
    user_id = int(get_jwt_identity())
    
    # Get user's teams
    user_teams = TeamMember.query.filter_by(user_id=user_id).all()
    team_ids = [tm.team_id for tm in user_teams]
    
    # Get projects from user's teams
    projects = Project.query.filter(Project.team_id.in_(team_ids)).all()
    project_ids = [p.id for p in projects]
    
    # Query recurring tasks
    query = RecurringTask.query.filter(
        or_(
            RecurringTask.project_id.in_(project_ids),
            RecurringTask.assigned_to == user_id,
            RecurringTask.created_by == user_id
        )
    )
    
    # Apply filters
    is_active = request.args.get('is_active')
    if is_active is not None:
        query = query.filter(RecurringTask.is_active == (is_active.lower() == 'true'))
    
    recurring_tasks = query.all()
    
    return jsonify({
        'recurring_tasks': [rt.to_dict() for rt in recurring_tasks]
    })


@recurring_bp.route('/', methods=['POST'])
@jwt_required()
def create_recurring_task():
    """Create a new recurring task template."""
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}
    
    # Validate required fields
    title = data.get('title', '').strip()
    if not title:
        return jsonify({'error': 'Title is required'}), 400
    
    recurrence_type = data.get('recurrence_type')
    if recurrence_type not in ['daily', 'weekly', 'monthly', 'yearly']:
        return jsonify({'error': 'Invalid recurrence type'}), 400
    
    project_id = data.get('project_id')
    if project_id:
        # Verify user has access to the project
        project = db.session.query(Project).join(Team).join(TeamMember).filter(
            Project.id == project_id,
            TeamMember.user_id == user_id
        ).first()
        
        if not project:
            return jsonify({'error': 'Access denied to this project'}), 403
    
    # Calculate initial next_due_date
    next_due_date = data.get('next_due_date')
    if next_due_date:
        next_due_date = datetime.fromisoformat(next_due_date)
    else:
        next_due_date = datetime.utcnow() + timedelta(days=1)
    
    # Create recurring task
    recurring_task = RecurringTask(
        title=title,
        description=data.get('description', ''),
        priority=data.get('priority', 'medium'),
        recurrence_type=recurrence_type,
        recurrence_interval=data.get('recurrence_interval', 1),
        recurrence_days=data.get('recurrence_days', []),
        recurrence_day_of_month=data.get('recurrence_day_of_month'),
        recurrence_end_date=datetime.fromisoformat(data['recurrence_end_date']) if data.get('recurrence_end_date') else None,
        assigned_to=data.get('assigned_to'),
        project_id=project_id,
        created_by=user_id,
        department_id=data.get('department_id'),
        next_due_date=next_due_date,
        is_active=True
    )
    
    db.session.add(recurring_task)
    db.session.commit()
    
    return jsonify(recurring_task.to_dict()), 201


@recurring_bp.route('/<int:recurring_task_id>', methods=['GET'])
@jwt_required()
def get_recurring_task(recurring_task_id):
    """Get a specific recurring task."""
    user_id = int(get_jwt_identity())
    
    recurring_task = RecurringTask.query.get(recurring_task_id)
    if not recurring_task:
        return jsonify({'error': 'Recurring task not found'}), 404
    
    # Check access
    if recurring_task.project_id:
        project = db.session.query(Project).join(Team).join(TeamMember).filter(
            Project.id == recurring_task.project_id,
            TeamMember.user_id == user_id
        ).first()
        if not project:
            return jsonify({'error': 'Access denied'}), 403
    elif recurring_task.assigned_to != user_id and recurring_task.created_by != user_id:
        return jsonify({'error': 'Access denied'}), 403
    
    return jsonify(recurring_task.to_dict())


@recurring_bp.route('/<int:recurring_task_id>', methods=['PUT'])
@jwt_required()
def update_recurring_task(recurring_task_id):
    """Update a recurring task template."""
    user_id = int(get_jwt_identity())
    
    recurring_task = RecurringTask.query.filter_by(
        id=recurring_task_id,
        created_by=user_id
    ).first()
    
    if not recurring_task:
        return jsonify({'error': 'Recurring task not found or access denied'}), 404
    
    data = request.get_json() or {}
    
    # Update fields
    if 'title' in data:
        recurring_task.title = data['title'].strip()
    if 'description' in data:
        recurring_task.description = data['description']
    if 'priority' in data:
        recurring_task.priority = data['priority']
    if 'recurrence_type' in data:
        recurring_task.recurrence_type = data['recurrence_type']
    if 'recurrence_interval' in data:
        recurring_task.recurrence_interval = data['recurrence_interval']
    if 'recurrence_days' in data:
        recurring_task.recurrence_days = data['recurrence_days']
    if 'recurrence_day_of_month' in data:
        recurring_task.recurrence_day_of_month = data['recurrence_day_of_month']
    if 'recurrence_end_date' in data:
        recurring_task.recurrence_end_date = datetime.fromisoformat(data['recurrence_end_date']) if data['recurrence_end_date'] else None
    if 'assigned_to' in data:
        recurring_task.assigned_to = data['assigned_to']
    if 'is_active' in data:
        recurring_task.is_active = data['is_active']
    if 'next_due_date' in data:
        recurring_task.next_due_date = datetime.fromisoformat(data['next_due_date'])
    
    db.session.commit()
    return jsonify(recurring_task.to_dict())


@recurring_bp.route('/<int:recurring_task_id>', methods=['DELETE'])
@jwt_required()
def delete_recurring_task(recurring_task_id):
    """Delete a recurring task template."""
    user_id = int(get_jwt_identity())
    
    recurring_task = RecurringTask.query.filter_by(
        id=recurring_task_id,
        created_by=user_id
    ).first()
    
    if not recurring_task:
        return jsonify({'error': 'Recurring task not found or access denied'}), 404
    
    db.session.delete(recurring_task)
    db.session.commit()
    
    return jsonify({'message': 'Recurring task deleted successfully'})


@recurring_bp.route('/<int:recurring_task_id>/pause', methods=['POST'])
@jwt_required()
def pause_recurring_task(recurring_task_id):
    """Pause a recurring task."""
    user_id = int(get_jwt_identity())
    
    recurring_task = RecurringTask.query.filter_by(
        id=recurring_task_id,
        created_by=user_id
    ).first()
    
    if not recurring_task:
        return jsonify({'error': 'Recurring task not found or access denied'}), 404
    
    recurring_task.is_active = False
    db.session.commit()
    
    return jsonify({
        'message': 'Recurring task paused',
        'recurring_task': recurring_task.to_dict()
    })


@recurring_bp.route('/<int:recurring_task_id>/resume', methods=['POST'])
@jwt_required()
def resume_recurring_task(recurring_task_id):
    """Resume a paused recurring task."""
    user_id = int(get_jwt_identity())
    
    recurring_task = RecurringTask.query.filter_by(
        id=recurring_task_id,
        created_by=user_id
    ).first()
    
    if not recurring_task:
        return jsonify({'error': 'Recurring task not found or access denied'}), 404
    
    recurring_task.is_active = True
    db.session.commit()
    
    return jsonify({
        'message': 'Recurring task resumed',
        'recurring_task': recurring_task.to_dict()
    })


@recurring_bp.route('/generate', methods=['POST'])
@jwt_required()
def generate_recurring_tasks():
    """Generate tasks from active recurring task templates."""
    # This endpoint would typically be called by a scheduled job
    # but can also be triggered manually by admins
    
    user_id = int(get_jwt_identity())
    
    # Check if user is admin (you may want to adjust this logic)
    from app.models.user import User
    user = User.query.get(user_id)
    if not user or user.email not in ['admin@granula.com']:  # Add your admin check here
        return jsonify({'error': 'Admin access required'}), 403
    
    # Find all active recurring tasks that are due
    now = datetime.utcnow()
    due_recurring_tasks = RecurringTask.query.filter(
        RecurringTask.is_active == True,
        RecurringTask.next_due_date <= now
    ).all()
    
    generated_tasks = []
    
    for recurring in due_recurring_tasks:
        task = recurring.generate_task()
        if task:
            db.session.add(task)
            generated_tasks.append(task)
    
    db.session.commit()
    
    return jsonify({
        'message': f'Generated {len(generated_tasks)} tasks',
        'tasks': [task.to_dict() for task in generated_tasks]
    })