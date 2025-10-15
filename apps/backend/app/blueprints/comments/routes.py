"""Task comment routes."""
from datetime import datetime
from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import or_
import re

from . import comments_bp
from app.extensions import db
from app.models.task_comment import TaskComment
from app.models.task import Task
from app.models.team import Team, TeamMember
from app.models.user import User
from app.services.email_service import EmailService


def extract_mentions(content):
    """Extract @username mentions from comment content."""
    mentions = re.findall(r'@(\w+)', content)
    return mentions


def notify_mentioned_users(comment, mentioned_usernames):
    """Send notifications to mentioned users."""
    if not mentioned_usernames:
        return
    
    mentioned_users = User.query.filter(User.username.in_(mentioned_usernames)).all()
    task = comment.task
    commenter = comment.user
    
    for user in mentioned_users:
        if user.id != comment.user_id:  # Don't notify the commenter
            EmailService.send_email(
                to=[user.email],
                subject=f"You were mentioned in a task: {task.title}",
                template='task_mention',
                template_data={
                    'task_title': task.title,
                    'task_id': task.id,
                    'commenter_name': commenter.username,
                    'comment_content': comment.content[:200],
                    'user_name': user.username
                }
            )
    
    return [user.id for user in mentioned_users]


@comments_bp.route('/task/<int:task_id>', methods=['GET'])
@jwt_required()
def list_task_comments(task_id):
    """List all comments for a task."""
    user_id = int(get_jwt_identity())
    
    # Verify user has access to the task
    task = Task.query.join(Task.project).join(Team).join(TeamMember).filter(
        Task.id == task_id,
        or_(
            TeamMember.user_id == user_id,
            Task.assigned_to == user_id,
            Task.created_by == user_id
        )
    ).first()
    
    if not task:
        return jsonify({'error': 'Task not found'}), 404
    
    # Get comments with pagination
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 50, type=int), 100)
    parent_only = request.args.get('parent_only', 'false').lower() == 'true'
    
    query = TaskComment.query.filter_by(task_id=task_id)
    
    if parent_only:
        query = query.filter_by(parent_comment_id=None)
    
    comments = query.order_by(TaskComment.created_at.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )
    
    return jsonify({
        'comments': [comment.to_dict() for comment in comments.items],
        'total': comments.total,
        'pages': comments.pages,
        'page': page,
        'per_page': per_page,
        'has_next': comments.has_next,
        'has_prev': comments.has_prev,
    })


@comments_bp.route('/task/<int:task_id>', methods=['POST'])
@jwt_required()
def create_comment(task_id):
    """Create a new comment on a task."""
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}
    
    # Verify user has access to the task
    task = Task.query.join(Task.project).join(Team).join(TeamMember).filter(
        Task.id == task_id,
        or_(
            TeamMember.user_id == user_id,
            Task.assigned_to == user_id,
            Task.created_by == user_id
        )
    ).first()
    
    if not task:
        return jsonify({'error': 'Task not found'}), 404
    
    content = data.get('content', '').strip()
    if not content:
        return jsonify({'error': 'Comment content is required'}), 400
    
    # Extract mentions
    mentioned_usernames = extract_mentions(content)
    
    # Create comment
    comment = TaskComment(
        content=content,
        task_id=task_id,
        user_id=user_id,
        parent_comment_id=data.get('parent_comment_id')
    )
    
    # Handle mentions
    if mentioned_usernames:
        mentioned_user_ids = notify_mentioned_users(comment, mentioned_usernames)
        comment.mentioned_users = mentioned_user_ids
    
    db.session.add(comment)
    db.session.commit()
    
    # Send notification to task assignee and creator
    if task.assigned_to and task.assigned_to != user_id:
        assignee = User.query.get(task.assigned_to)
        if assignee:
            EmailService.send_email(
                to=[assignee.email],
                subject=f"New comment on task: {task.title}",
                template='task_comment',
                template_data={
                    'task_title': task.title,
                    'task_id': task.id,
                    'commenter_name': comment.user.username,
                    'comment_content': content[:200],
                    'user_name': assignee.username
                }
            )
    
    return jsonify(comment.to_dict()), 201


@comments_bp.route('/<int:comment_id>', methods=['PUT'])
@jwt_required()
def update_comment(comment_id):
    """Update a comment."""
    user_id = int(get_jwt_identity())
    
    comment = TaskComment.query.filter_by(
        id=comment_id,
        user_id=user_id  # Only comment author can edit
    ).first()
    
    if not comment:
        return jsonify({'error': 'Comment not found or access denied'}), 404
    
    data = request.get_json() or {}
    content = data.get('content', '').strip()
    
    if not content:
        return jsonify({'error': 'Comment content is required'}), 400
    
    # Extract new mentions
    mentioned_usernames = extract_mentions(content)
    
    comment.content = content
    comment.edited = True
    comment.updated_at = datetime.utcnow()
    
    # Update mentions
    if mentioned_usernames:
        mentioned_user_ids = notify_mentioned_users(comment, mentioned_usernames)
        comment.mentioned_users = mentioned_user_ids
    else:
        comment.mentioned_users = []
    
    db.session.commit()
    return jsonify(comment.to_dict())


@comments_bp.route('/<int:comment_id>', methods=['DELETE'])
@jwt_required()
def delete_comment(comment_id):
    """Delete a comment."""
    user_id = int(get_jwt_identity())
    
    comment = TaskComment.query.filter_by(
        id=comment_id,
        user_id=user_id  # Only comment author can delete
    ).first()
    
    if not comment:
        return jsonify({'error': 'Comment not found or access denied'}), 404
    
    db.session.delete(comment)
    db.session.commit()
    
    return jsonify({'message': 'Comment deleted successfully'})


@comments_bp.route('/<int:comment_id>/replies', methods=['GET'])
@jwt_required()
def get_comment_replies(comment_id):
    """Get replies to a specific comment."""
    user_id = int(get_jwt_identity())
    
    # Verify parent comment exists and user has access
    parent = TaskComment.query.get(comment_id)
    if not parent:
        return jsonify({'error': 'Comment not found'}), 404
    
    # Verify user has access to the task
    task = Task.query.join(Task.project).join(Team).join(TeamMember).filter(
        Task.id == parent.task_id,
        or_(
            TeamMember.user_id == user_id,
            Task.assigned_to == user_id,
            Task.created_by == user_id
        )
    ).first()
    
    if not task:
        return jsonify({'error': 'Access denied'}), 403
    
    replies = TaskComment.query.filter_by(parent_comment_id=comment_id).order_by(TaskComment.created_at).all()
    
    return jsonify({
        'replies': [reply.to_dict() for reply in replies]
    })