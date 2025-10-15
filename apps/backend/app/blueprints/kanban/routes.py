"""Kanban board routes."""
from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import or_, and_, func

from . import kanban_bp
from app.extensions import db
from app.models.task import Task
from app.models.project import Project
from app.models.team import Team, TeamMember
from app.models.user import User


@kanban_bp.route('/project/<int:project_id>/board', methods=['GET'])
@jwt_required()
def get_project_kanban_board(project_id):
    """Get Kanban board view for a project."""
    user_id = int(get_jwt_identity())
    
    # Verify user has access to the project
    project = db.session.query(Project).join(Team).join(TeamMember).filter(
        Project.id == project_id,
        TeamMember.user_id == user_id
    ).first()
    
    if not project:
        return jsonify({'error': 'Project not found or access denied'}), 404
    
    # Get all tasks for the project grouped by status
    tasks_by_status = {
        'pending': [],
        'in_progress': [],
        'completed': [],
        'cancelled': [],
        'pending_approval': []
    }
    
    # Query tasks
    tasks = Task.query.filter_by(project_id=project_id).all()
    
    for task in tasks:
        task_dict = task.to_dict()
        
        # Add additional info for kanban card
        task_dict['comments_count'] = len(task.comments.all()) if hasattr(task, 'comments') else 0
        
        # Determine column based on status and approval
        if task.approval_status == 'pending_approval':
            tasks_by_status['pending_approval'].append(task_dict)
        elif task.status in tasks_by_status:
            tasks_by_status[task.status].append(task_dict)
        else:
            tasks_by_status['pending'].append(task_dict)
    
    # Calculate statistics
    total_tasks = len(tasks)
    completed_tasks = len([t for t in tasks if t.status == 'completed'])
    in_progress_tasks = len([t for t in tasks if t.status == 'in_progress'])
    overdue_tasks = len([t for t in tasks if t.due_date and t.due_date < db.func.now() and t.status != 'completed'])
    
    return jsonify({
        'project': project.to_dict(),
        'columns': [
            {
                'id': 'pending',
                'title': 'To Do',
                'tasks': tasks_by_status['pending'],
                'color': '#gray'
            },
            {
                'id': 'in_progress',
                'title': 'In Progress',
                'tasks': tasks_by_status['in_progress'],
                'color': '#blue'
            },
            {
                'id': 'pending_approval',
                'title': 'Pending Approval',
                'tasks': tasks_by_status['pending_approval'],
                'color': '#yellow'
            },
            {
                'id': 'completed',
                'title': 'Done',
                'tasks': tasks_by_status['completed'],
                'color': '#green'
            },
            {
                'id': 'cancelled',
                'title': 'Cancelled',
                'tasks': tasks_by_status['cancelled'],
                'color': '#red'
            }
        ],
        'statistics': {
            'total': total_tasks,
            'completed': completed_tasks,
            'in_progress': in_progress_tasks,
            'overdue': overdue_tasks,
            'completion_rate': round((completed_tasks / total_tasks * 100) if total_tasks > 0 else 0, 1)
        }
    })


@kanban_bp.route('/task/<int:task_id>/move', methods=['PATCH'])
@jwt_required()
def move_task_on_board(task_id):
    """Move a task to a different column on the Kanban board."""
    user_id = int(get_jwt_identity())
    
    # Get the task
    task = Task.query.join(Task.project).join(Team).join(TeamMember).filter(
        Task.id == task_id,
        or_(
            TeamMember.user_id == user_id,
            Task.assigned_to == user_id,
            Task.created_by == user_id
        )
    ).first()
    
    if not task:
        return jsonify({'error': 'Task not found or access denied'}), 404
    
    data = request.get_json() or {}
    new_column = data.get('column')
    position = data.get('position', 0)  # Position within the column
    
    # Map column to status
    column_to_status = {
        'pending': 'pending',
        'in_progress': 'in_progress',
        'completed': 'completed',
        'cancelled': 'cancelled',
        'pending_approval': 'completed'  # Special case
    }
    
    if new_column not in column_to_status:
        return jsonify({'error': 'Invalid column'}), 400
    
    new_status = column_to_status[new_column]
    
    # Handle special cases
    if new_column == 'pending_approval':
        task.approval_status = 'pending_approval'
        task.status = 'completed'
    elif new_column == 'completed' and task.requires_approval and task.approval_status != 'approved':
        # Require approval first
        return jsonify({'error': 'Task requires approval before marking as completed'}), 400
    else:
        task.status = new_status
        if new_status == 'completed':
            task.completed_at = db.func.now()
        else:
            task.completed_at = None
    
    db.session.commit()
    
    return jsonify({
        'message': 'Task moved successfully',
        'task': task.to_dict()
    })


@kanban_bp.route('/team/<int:team_id>/board', methods=['GET'])
@jwt_required()
def get_team_kanban_board(team_id):
    """Get Kanban board view for all team projects."""
    user_id = int(get_jwt_identity())
    
    # Verify user is a team member
    membership = TeamMember.query.filter_by(
        user_id=user_id,
        team_id=team_id
    ).first()
    
    if not membership:
        return jsonify({'error': 'Access denied to this team'}), 403
    
    # Get all projects for the team
    projects = Project.query.filter_by(team_id=team_id).all()
    project_ids = [p.id for p in projects]
    
    # Get all tasks for team projects grouped by project and status
    boards = []
    
    for project in projects:
        tasks = Task.query.filter_by(project_id=project.id).all()
        
        if not tasks:
            continue
        
        tasks_by_status = {
            'pending': [],
            'in_progress': [],
            'completed': [],
            'cancelled': []
        }
        
        for task in tasks:
            task_dict = task.to_dict()
            if task.status in tasks_by_status:
                tasks_by_status[task.status].append(task_dict)
        
        boards.append({
            'project': project.to_dict(),
            'columns': tasks_by_status,
            'task_count': len(tasks)
        })
    
    return jsonify({
        'team_id': team_id,
        'boards': boards
    })


@kanban_bp.route('/personal', methods=['GET'])
@jwt_required()
def get_personal_kanban_board():
    """Get personal Kanban board for the current user."""
    user_id = int(get_jwt_identity())
    
    # Get all tasks assigned to or created by the user
    tasks = Task.query.filter(
        or_(
            Task.assigned_to == user_id,
            Task.created_by == user_id
        )
    ).all()
    
    # Group by status
    tasks_by_status = {
        'pending': [],
        'in_progress': [],
        'completed': [],
        'cancelled': []
    }
    
    for task in tasks:
        task_dict = task.to_dict()
        task_dict['project_name'] = task.project.name if task.project else 'No Project'
        
        if task.status in tasks_by_status:
            tasks_by_status[task.status].append(task_dict)
    
    # Get user's upcoming tasks
    from datetime import datetime, timedelta
    upcoming_deadline = datetime.utcnow() + timedelta(days=7)
    upcoming_tasks = Task.query.filter(
        Task.assigned_to == user_id,
        Task.due_date <= upcoming_deadline,
        Task.due_date >= datetime.utcnow(),
        Task.status != 'completed'
    ).order_by(Task.due_date).limit(5).all()
    
    return jsonify({
        'columns': [
            {
                'id': 'pending',
                'title': 'To Do',
                'tasks': tasks_by_status['pending']
            },
            {
                'id': 'in_progress', 
                'title': 'In Progress',
                'tasks': tasks_by_status['in_progress']
            },
            {
                'id': 'completed',
                'title': 'Done',
                'tasks': tasks_by_status['completed']
            },
            {
                'id': 'cancelled',
                'title': 'Cancelled',
                'tasks': tasks_by_status['cancelled']
            }
        ],
        'upcoming_tasks': [task.to_dict() for task in upcoming_tasks],
        'statistics': {
            'total': len(tasks),
            'pending': len(tasks_by_status['pending']),
            'in_progress': len(tasks_by_status['in_progress']),
            'completed': len(tasks_by_status['completed'])
        }
    })