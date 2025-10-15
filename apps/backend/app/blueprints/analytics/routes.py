"""Analytics dashboard routes."""
from datetime import datetime, timedelta
from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func, and_, or_

from . import analytics_bp
from app.extensions import db
from app.models.task import Task
from app.models.project import Project
from app.models.team import Team, TeamMember
from app.models.user import User
from app.models.task_comment import TaskComment


@analytics_bp.route('/project/<int:project_id>', methods=['GET'])
@jwt_required()
def get_project_analytics(project_id):
    """Get analytics for a specific project."""
    user_id = int(get_jwt_identity())
    
    # Verify user has access to the project
    project = db.session.query(Project).join(Team).join(TeamMember).filter(
        Project.id == project_id,
        TeamMember.user_id == user_id
    ).first()
    
    if not project:
        return jsonify({'error': 'Project not found or access denied'}), 404
    
    # Task statistics
    total_tasks = Task.query.filter_by(project_id=project_id).count()
    completed_tasks = Task.query.filter_by(project_id=project_id, status='completed').count()
    in_progress_tasks = Task.query.filter_by(project_id=project_id, status='in_progress').count()
    pending_tasks = Task.query.filter_by(project_id=project_id, status='pending').count()
    cancelled_tasks = Task.query.filter_by(project_id=project_id, status='cancelled').count()
    
    # Overdue tasks
    overdue_tasks = Task.query.filter(
        Task.project_id == project_id,
        Task.due_date < datetime.utcnow(),
        Task.status != 'completed'
    ).count()
    
    # Task completion rate over time (last 30 days)
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    completion_timeline = db.session.query(
        func.date(Task.completed_at).label('date'),
        func.count(Task.id).label('count')
    ).filter(
        Task.project_id == project_id,
        Task.completed_at >= thirty_days_ago
    ).group_by(func.date(Task.completed_at)).all()
    
    # Average task completion time
    completed_tasks_with_time = Task.query.filter_by(
        project_id=project_id,
        status='completed'
    ).filter(Task.completed_at.isnot(None)).all()
    
    avg_completion_time = None
    if completed_tasks_with_time:
        total_time = sum([(t.completed_at - t.created_at).total_seconds() for t in completed_tasks_with_time])
        avg_completion_time = total_time / len(completed_tasks_with_time) / 86400  # Convert to days
    
    # Task distribution by priority
    priority_distribution = db.session.query(
        Task.priority,
        func.count(Task.id).label('count')
    ).filter_by(project_id=project_id).group_by(Task.priority).all()
    
    # Task distribution by assignee
    assignee_distribution = db.session.query(
        User.username,
        func.count(Task.id).label('count')
    ).join(Task, Task.assigned_to == User.id).filter(
        Task.project_id == project_id
    ).group_by(User.username).all()
    
    # Team productivity (tasks completed per team member)
    team_productivity = db.session.query(
        User.username,
        func.count(Task.id).label('completed_count')
    ).join(Task, Task.assigned_to == User.id).filter(
        Task.project_id == project_id,
        Task.status == 'completed'
    ).group_by(User.username).all()
    
    # Comment activity
    total_comments = TaskComment.query.join(Task).filter(Task.project_id == project_id).count()
    
    # Milestone progress (if applicable)
    from app.models.project_template import ProjectMilestone
    milestones = ProjectMilestone.query.filter_by(project_id=project_id).all()
    milestone_data = []
    for milestone in milestones:
        milestone_data.append({
            'name': milestone.name,
            'target_date': milestone.target_date.isoformat() if milestone.target_date else None,
            'status': milestone.status,
            'progress': milestone.progress_percentage
        })
    
    return jsonify({
        'project': project.to_dict(),
        'overview': {
            'total_tasks': total_tasks,
            'completed_tasks': completed_tasks,
            'in_progress_tasks': in_progress_tasks,
            'pending_tasks': pending_tasks,
            'cancelled_tasks': cancelled_tasks,
            'overdue_tasks': overdue_tasks,
            'completion_rate': round((completed_tasks / total_tasks * 100) if total_tasks > 0 else 0, 1),
            'avg_completion_days': round(avg_completion_time, 1) if avg_completion_time else None,
            'total_comments': total_comments
        },
        'completion_timeline': [
            {'date': str(item.date), 'count': item.count} for item in completion_timeline
        ],
        'priority_distribution': [
            {'priority': item.priority, 'count': item.count} for item in priority_distribution
        ],
        'assignee_distribution': [
            {'assignee': item.username, 'count': item.count} for item in assignee_distribution
        ],
        'team_productivity': [
            {'member': item.username, 'completed': item.completed_count} for item in team_productivity
        ],
        'milestones': milestone_data
    })


@analytics_bp.route('/team/<int:team_id>', methods=['GET'])
@jwt_required()
def get_team_analytics(team_id):
    """Get analytics for a team across all projects."""
    user_id = int(get_jwt_identity())
    
    # Verify user is a team member
    membership = TeamMember.query.filter_by(
        user_id=user_id,
        team_id=team_id
    ).first()
    
    if not membership:
        return jsonify({'error': 'Access denied to this team'}), 403
    
    # Get all team projects
    projects = Project.query.filter_by(team_id=team_id).all()
    project_ids = [p.id for p in projects]
    
    # Overall statistics
    total_projects = len(projects)
    active_projects = len([p for p in projects if p.status == 'active'])
    
    # Task statistics across all projects
    total_tasks = Task.query.filter(Task.project_id.in_(project_ids)).count()
    completed_tasks = Task.query.filter(
        Task.project_id.in_(project_ids),
        Task.status == 'completed'
    ).count()
    
    # Team member statistics
    team_members = TeamMember.query.filter_by(team_id=team_id).all()
    member_stats = []
    
    for member in team_members:
        member_user = User.query.get(member.user_id)
        if member_user:
            assigned_count = Task.query.filter(
                Task.project_id.in_(project_ids),
                Task.assigned_to == member.user_id
            ).count()
            
            completed_count = Task.query.filter(
                Task.project_id.in_(project_ids),
                Task.assigned_to == member.user_id,
                Task.status == 'completed'
            ).count()
            
            member_stats.append({
                'username': member_user.username,
                'role': member.role,
                'assigned_tasks': assigned_count,
                'completed_tasks': completed_count,
                'completion_rate': round((completed_count / assigned_count * 100) if assigned_count > 0 else 0, 1)
            })
    
    # Project performance
    project_performance = []
    for project in projects:
        p_total = Task.query.filter_by(project_id=project.id).count()
        p_completed = Task.query.filter_by(project_id=project.id, status='completed').count()
        p_overdue = Task.query.filter(
            Task.project_id == project.id,
            Task.due_date < datetime.utcnow(),
            Task.status != 'completed'
        ).count()
        
        project_performance.append({
            'name': project.name,
            'status': project.status,
            'total_tasks': p_total,
            'completed_tasks': p_completed,
            'overdue_tasks': p_overdue,
            'completion_rate': round((p_completed / p_total * 100) if p_total > 0 else 0, 1)
        })
    
    # Activity timeline (last 7 days)
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    activity_timeline = db.session.query(
        func.date(Task.created_at).label('date'),
        func.count(Task.id).label('created'),
        func.sum(func.case([(Task.status == 'completed', 1)], else_=0)).label('completed')
    ).filter(
        Task.project_id.in_(project_ids),
        Task.created_at >= seven_days_ago
    ).group_by(func.date(Task.created_at)).all()
    
    return jsonify({
        'team_id': team_id,
        'overview': {
            'total_projects': total_projects,
            'active_projects': active_projects,
            'total_tasks': total_tasks,
            'completed_tasks': completed_tasks,
            'team_members': len(team_members),
            'overall_completion_rate': round((completed_tasks / total_tasks * 100) if total_tasks > 0 else 0, 1)
        },
        'member_statistics': member_stats,
        'project_performance': project_performance,
        'activity_timeline': [
            {
                'date': str(item.date),
                'created': item.created,
                'completed': int(item.completed) if item.completed else 0
            } for item in activity_timeline
        ]
    })


@analytics_bp.route('/personal', methods=['GET'])
@jwt_required()
def get_personal_analytics():
    """Get personal analytics for the current user."""
    user_id = int(get_jwt_identity())
    
    # Time range
    days = request.args.get('days', 30, type=int)
    start_date = datetime.utcnow() - timedelta(days=days)
    
    # My assigned tasks
    assigned_tasks = Task.query.filter_by(assigned_to=user_id).count()
    completed_by_me = Task.query.filter_by(
        assigned_to=user_id,
        status='completed'
    ).count()
    
    # Tasks I created
    created_tasks = Task.query.filter_by(created_by=user_id).count()
    
    # My current workload
    my_pending = Task.query.filter_by(
        assigned_to=user_id,
        status='pending'
    ).count()
    my_in_progress = Task.query.filter_by(
        assigned_to=user_id,
        status='in_progress'
    ).count()
    
    # My overdue tasks
    my_overdue = Task.query.filter(
        Task.assigned_to == user_id,
        Task.due_date < datetime.utcnow(),
        Task.status != 'completed'
    ).count()
    
    # Productivity over time
    productivity_timeline = db.session.query(
        func.date(Task.completed_at).label('date'),
        func.count(Task.id).label('count')
    ).filter(
        Task.assigned_to == user_id,
        Task.completed_at >= start_date
    ).group_by(func.date(Task.completed_at)).all()
    
    # Task priority breakdown
    my_priority_breakdown = db.session.query(
        Task.priority,
        func.count(Task.id).label('count')
    ).filter(
        Task.assigned_to == user_id,
        Task.status != 'completed'
    ).group_by(Task.priority).all()
    
    # Projects I'm working on
    my_projects = db.session.query(
        Project.name,
        func.count(Task.id).label('task_count')
    ).join(Task).filter(
        Task.assigned_to == user_id
    ).group_by(Project.name).all()
    
    # Comment activity
    my_comments = TaskComment.query.filter_by(user_id=user_id).count()
    comments_last_week = TaskComment.query.filter(
        TaskComment.user_id == user_id,
        TaskComment.created_at >= datetime.utcnow() - timedelta(days=7)
    ).count()
    
    # Average completion time
    my_completed_tasks = Task.query.filter_by(
        assigned_to=user_id,
        status='completed'
    ).filter(Task.completed_at.isnot(None)).all()
    
    avg_completion_time = None
    if my_completed_tasks:
        total_time = sum([(t.completed_at - t.created_at).total_seconds() for t in my_completed_tasks])
        avg_completion_time = total_time / len(my_completed_tasks) / 86400  # Convert to days
    
    return jsonify({
        'overview': {
            'assigned_tasks': assigned_tasks,
            'completed_tasks': completed_by_me,
            'created_tasks': created_tasks,
            'pending_tasks': my_pending,
            'in_progress_tasks': my_in_progress,
            'overdue_tasks': my_overdue,
            'completion_rate': round((completed_by_me / assigned_tasks * 100) if assigned_tasks > 0 else 0, 1),
            'avg_completion_days': round(avg_completion_time, 1) if avg_completion_time else None,
            'total_comments': my_comments,
            'comments_last_week': comments_last_week
        },
        'productivity_timeline': [
            {'date': str(item.date), 'completed': item.count} for item in productivity_timeline
        ],
        'priority_breakdown': [
            {'priority': item.priority, 'count': item.count} for item in my_priority_breakdown
        ],
        'projects': [
            {'name': item.name, 'tasks': item.task_count} for item in my_projects
        ]
    })


@analytics_bp.route('/daily-summary/<int:user_id>', methods=['GET'])
@jwt_required()
def get_daily_task_summary(user_id):
    """Get daily task summary for a user."""
    requesting_user_id = int(get_jwt_identity())
    
    # Users can only see their own daily summary unless they're a manager
    if requesting_user_id != user_id:
        # Check if requester is a manager of any team where target user is a member
        shared_teams = db.session.query(TeamMember).filter(
            TeamMember.user_id == user_id
        ).all()
        
        is_manager = False
        for team_member in shared_teams:
            requester_membership = TeamMember.query.filter_by(
                team_id=team_member.team_id,
                user_id=requesting_user_id
            ).first()
            if requester_membership and requester_membership.role in ['owner', 'admin']:
                is_manager = True
                break
        
        if not is_manager:
            return jsonify({'error': 'Access denied'}), 403
    
    # Today's date range
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    today_end = today_start + timedelta(days=1)
    
    # Tasks completed today
    completed_today = Task.query.filter(
        Task.assigned_to == user_id,
        Task.completed_at >= today_start,
        Task.completed_at < today_end
    ).all()
    
    # Tasks due today
    due_today = Task.query.filter(
        Task.assigned_to == user_id,
        Task.due_date >= today_start,
        Task.due_date < today_end
    ).all()
    
    # Tasks in progress
    in_progress = Task.query.filter_by(
        assigned_to=user_id,
        status='in_progress'
    ).all()
    
    # Overdue tasks
    overdue = Task.query.filter(
        Task.assigned_to == user_id,
        Task.due_date < today_start,
        Task.status != 'completed'
    ).all()
    
    # Comments made today
    comments_today = TaskComment.query.filter(
        TaskComment.user_id == user_id,
        TaskComment.created_at >= today_start,
        TaskComment.created_at < today_end
    ).count()
    
    user = User.query.get(user_id)
    
    return jsonify({
        'user': user.to_dict() if user else None,
        'date': today_start.isoformat(),
        'summary': {
            'completed_today': len(completed_today),
            'due_today': len(due_today),
            'in_progress': len(in_progress),
            'overdue': len(overdue),
            'comments_made': comments_today
        },
        'tasks': {
            'completed_today': [task.to_dict() for task in completed_today],
            'due_today': [task.to_dict() for task in due_today],
            'in_progress': [task.to_dict() for task in in_progress][:5],  # Limit to 5
            'overdue': [task.to_dict() for task in overdue][:5]  # Limit to 5
        }
    })