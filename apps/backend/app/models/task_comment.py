"""Task comment model."""
from datetime import datetime
from app.extensions import db


class TaskComment(db.Model):
    """Comment model for task discussions."""
    
    __tablename__ = 'task_comments'
    
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    task_id = db.Column(db.Integer, db.ForeignKey('tasks.id', ondelete='CASCADE'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    parent_comment_id = db.Column(db.Integer, db.ForeignKey('task_comments.id'), nullable=True)
    
    # For mentions/tags
    mentioned_users = db.Column(db.JSON, default=list)  # List of user IDs mentioned in comment
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    edited = db.Column(db.Boolean, default=False)
    
    # Relationships
    task = db.relationship('Task', backref=db.backref('comments', lazy='dynamic', cascade='all, delete-orphan'))
    user = db.relationship('User', backref='task_comments')
    replies = db.relationship('TaskComment', backref=db.backref('parent', remote_side=[id]), lazy='dynamic')
    
    def to_dict(self) -> dict:
        return {
            'id': self.id,
            'content': self.content,
            'task_id': self.task_id,
            'user_id': self.user_id,
            'user': self.user.to_dict() if self.user else None,
            'parent_comment_id': self.parent_comment_id,
            'mentioned_users': self.mentioned_users,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'edited': self.edited,
            'replies_count': self.replies.count() if self.replies else 0
        }
    
    def __repr__(self):
        return f'<TaskComment {self.id}>'