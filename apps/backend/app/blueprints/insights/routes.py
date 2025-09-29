"""Analytics and insights routes."""
from datetime import datetime, timedelta
import logging
from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func, and_, or_

from . import insights_bp
from app.extensions import db
from app.models.task import Task
from app.models.team import Team, TeamMember
from app.models.user import User
from app.models.project import Project

# Configure logging
logger = logging.getLogger(__name__)


def _get_user_teams(user_id):
    """Get list of team IDs where user is a member."""
    memberships = TeamMember.query.filter_by(user_id=user_id).all()
    return [m.team_id for m in memberships]


@insights_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def dashboard_metrics():
    print("DASHBOARD ROUTE: JWT_REQUIRED PASSED - ENTERING ROUTE", flush=True)
    """Get dashboard metrics for the current user."""
    try:
        print("=== DASHBOARD METRICS START ===", flush=True)
        logger.info("=== DASHBOARD METRICS START ===")
        user_id = int(get_jwt_identity())  # Convert string back to int for database queries
        print(f"JWT Identity: {user_id} (type: {type(user_id)})", flush=True)
        logger.info(f"JWT Identity: {user_id} (type: {type(user_id)})")
        
        # Check if user exists in database
        try:
            user = User.query.get(user_id)
            print(f"User lookup result: {user}", flush=True)
            logger.info(f"User lookup result: {user}")
            if not user:
                print(f"ERROR: User with ID {user_id} not found in database!", flush=True)
                logger.error(f"User with ID {user_id} not found in database!")
                return jsonify({"error": "User not found"}), 422
        except Exception as user_lookup_error:
            print(f"ERROR looking up user: {user_lookup_error}", flush=True)
            logger.error(f"Error looking up user: {user_lookup_error}")
            return jsonify({"error": "Database error during user lookup"}), 422
            
        user_teams = _get_user_teams(user_id)
        print(f"User teams: {user_teams}", flush=True)
        logger.info(f"User teams: {user_teams}")
        
        if not user_teams:
            logger.info("User has no teams, returning empty metrics")
            return jsonify({
                'tasks_completed': 0,
                'tasks_pending': 0,
                'completion_rate': 0,
                'high_priority_count': 0,
                'medium_priority_count': 0,
                'low_priority_count': 0,
                'tasks_by_priority': {
                    'high': [],
                    'medium': [],
                    'low': []
                }
            })
        
        # Base query for user's accessible tasks
        logger.info("Building base query for tasks")
        try:
            base_query = Task.query.join(Task.project).join(Team).filter(
                or_(
                    Team.id.in_(user_teams),
                    Task.assigned_to == user_id,
                    Task.created_by == user_id
                )
            )
            logger.info("Base query built successfully")
        except Exception as query_error:
            logger.error(f"Error building base query: {query_error}")
            return jsonify({"error": "Database query error"}), 422
        
        # Task counts by status
        logger.info("Executing task count queries")
        completed_count = base_query.filter(Task.status == 'completed').count()
        pending_count = base_query.filter(Task.status.in_(['pending', 'in_progress'])).count()
        logger.info(f"Task counts - completed: {completed_count}, pending: {pending_count}")
        
        # Completion rate
        total_tasks = completed_count + pending_count
        completion_rate = (completed_count / total_tasks * 100) if total_tasks > 0 else 0
        
        # Task counts by priority
        high_priority_count = base_query.filter(Task.priority == 'high').count()
        medium_priority_count = base_query.filter(Task.priority == 'medium').count()
        low_priority_count = base_query.filter(Task.priority == 'low').count()
        logger.info(f"Priority counts - high: {high_priority_count}, medium: {medium_priority_count}, low: {low_priority_count}")
        
        # Get tasks grouped by priority (for the dashboard display)
        logger.info("Fetching priority task lists")
        high_priority_tasks = base_query.filter(
            Task.priority == 'high',
            Task.status.in_(['pending', 'in_progress'])
        ).limit(10).all()
        
        medium_priority_tasks = base_query.filter(
            Task.priority == 'medium',
            Task.status.in_(['pending', 'in_progress'])
        ).limit(10).all()
        
        low_priority_tasks = base_query.filter(
            Task.priority == 'low',
            Task.status.in_(['pending', 'in_progress'])
        ).limit(10).all()
        
        logger.info("Dashboard metrics completed successfully")
        return jsonify({
            'tasks_completed': completed_count,
            'tasks_pending': pending_count,
            'completion_rate': round(completion_rate, 1),
            'high_priority_count': high_priority_count,
            'medium_priority_count': medium_priority_count,
            'low_priority_count': low_priority_count,
            'tasks_by_priority': {
                'high': [task.to_dict() for task in high_priority_tasks],
                'medium': [task.to_dict() for task in medium_priority_tasks],
                'low': [task.to_dict() for task in low_priority_tasks]
            }
        })
    
    except Exception as e:
        print(f"DASHBOARD ERROR: {e}", flush=True)
        print(f"Error type: {type(e)}", flush=True)
        import traceback
        print(f"Traceback: {traceback.format_exc()}", flush=True)
        logger.error(f"Dashboard metrics error: {e}")
        logger.error(f"Error type: {type(e)}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        return jsonify({"error": f"Dashboard error: {str(e)}"}), 422


@insights_bp.route('/team-activity', methods=['GET'])
@jwt_required()
def team_activity():
    """Get team activity and membership data."""
    user_id = int(get_jwt_identity())  # Convert string back to int for database queries
    user_teams = _get_user_teams(user_id)
    
    if not user_teams:
        return jsonify({
            'teams': [],
            'total_members': 0,
            'recent_activity': []
        })
    
    # Get team information
    teams = Team.query.filter(Team.id.in_(user_teams)).all()
    team_data = []
    total_members = 0
    
    for team in teams:
        member_count = TeamMember.query.filter_by(team_id=team.id).count()
        total_members += member_count
        
        # Get recent tasks for this team
        recent_tasks = Task.query.join(Task.project).filter(
            Project.team_id == team.id
        ).order_by(Task.updated_at.desc()).limit(5).all()
        
        team_data.append({
            'id': team.id,
            'name': team.name,
            'member_count': member_count,
            'recent_tasks': [task.to_dict() for task in recent_tasks]
        })
    
    # Get recent activity across all teams
    recent_activity = Task.query.join(Task.project).join(Team).filter(
        Team.id.in_(user_teams)
    ).order_by(Task.updated_at.desc()).limit(20).all()
    
    return jsonify({
        'teams': team_data,
        'total_members': total_members,
        'recent_activity': [task.to_dict() for task in recent_activity]
    })


@insights_bp.route('/performance-summary', methods=['GET'])
@jwt_required()
def performance_summary():
    """Get weekly performance summary."""
    user_id = int(get_jwt_identity())  # Convert string back to int for database queries
    user_teams = _get_user_teams(user_id)
    
    # Get date range for the past week
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=7)
    
    if not user_teams:
        return jsonify({
            'period': f"{start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')}",
            'tasks_completed': 0,
            'tasks_created': 0,
            'completion_rate': 0,
            'team_performance': []
        })
    
    # Base query for user's accessible tasks
    base_query = Task.query.join(Task.project).join(Team).filter(
        or_(
            Team.id.in_(user_teams),
            Task.assigned_to == user_id,
            Task.created_by == user_id
        )
    )
    
    # Tasks completed this week
    completed_this_week = base_query.filter(
        and_(
            Task.completed_at >= start_date,
            Task.completed_at <= end_date
        )
    ).count()
    
    # Tasks created this week
    created_this_week = base_query.filter(
        and_(
            Task.created_at >= start_date,
            Task.created_at <= end_date
        )
    ).count()
    
    # Team-specific performance
    team_performance = []
    for team_id in user_teams:
        team = Team.query.get(team_id)
        if not team:
            continue
            
        team_tasks_completed = Task.query.join(Task.project).filter(
            Project.team_id == team_id,
            Task.completed_at >= start_date,
            Task.completed_at <= end_date
        ).count()
        
        team_tasks_created = Task.query.join(Task.project).filter(
            Project.team_id == team_id,
            Task.created_at >= start_date,
            Task.created_at <= end_date
        ).count()
        
        team_performance.append({
            'team_id': team.id,
            'team_name': team.name,
            'tasks_completed': team_tasks_completed,
            'tasks_created': team_tasks_created
        })
    
    return jsonify({
        'period': f"{start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')}",
        'tasks_completed': completed_this_week,
        'tasks_created': created_this_week,
        'completion_rate': round((completed_this_week / created_this_week * 100) if created_this_week > 0 else 0, 1),
        'team_performance': team_performance
    })


@insights_bp.route('/task-stats', methods=['GET'])
@jwt_required()
def task_statistics():
    """Get detailed task statistics."""
    user_id = int(get_jwt_identity())  # Convert string back to int for database queries
    user_teams = _get_user_teams(user_id)
    
    if not user_teams:
        return jsonify({
            'by_status': {},
            'by_priority': {},
            'by_team': {},
            'overdue_count': 0
        })
    
    # Base query for user's accessible tasks
    base_query = Task.query.join(Task.project).join(Team).filter(
        or_(
            Team.id.in_(user_teams),
            Task.assigned_to == user_id,
            Task.created_by == user_id
        )
    )
    
    # Group by status
    status_stats = db.session.query(
        Task.status,
        func.count(Task.id)
    ).join(Task.project).join(Team).filter(
        or_(
            Team.id.in_(user_teams),
            Task.assigned_to == user_id,
            Task.created_by == user_id
        )
    ).group_by(Task.status).all()
    
    # Group by priority
    priority_stats = db.session.query(
        Task.priority,
        func.count(Task.id)
    ).join(Task.project).join(Team).filter(
        or_(
            Team.id.in_(user_teams),
            Task.assigned_to == user_id,
            Task.created_by == user_id
        )
    ).group_by(Task.priority).all()
    
    # Group by team
    team_stats = db.session.query(
        Team.name,
        func.count(Task.id)
    ).join(Project).join(Task).filter(
        Team.id.in_(user_teams)
    ).group_by(Team.name).all()
    
    # Overdue tasks
    overdue_count = base_query.filter(
        Task.due_date < datetime.utcnow(),
        Task.status != 'completed'
    ).count()
    
    return jsonify({
        'by_status': {status: count for status, count in status_stats},
        'by_priority': {priority: count for priority, count in priority_stats},
        'by_team': {team_name: count for team_name, count in team_stats},
        'overdue_count': overdue_count
    })
