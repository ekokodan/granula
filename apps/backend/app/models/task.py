"""Task model."""
from datetime import datetime
from typing import Optional
from app.extensions import db


class Task(db.Model):
    """Task model for project management."""
    
    __tablename__ = 'tasks'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    priority = db.Column(db.String(20), default='medium', nullable=False)  # high, medium, low
    status = db.Column(db.String(20), default='pending', nullable=False)  # pending, in_progress, completed, cancelled
    due_date = db.Column(db.DateTime, nullable=True)
    
    # Relationships
    assigned_to = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=True)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    department_id = db.Column(db.Integer, db.ForeignKey('departments.id'), nullable=True)
    
    # Approval workflow
    requires_approval = db.Column(db.Boolean, default=False)
    approved_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    approved_at = db.Column(db.DateTime, nullable=True)
    approval_status = db.Column(db.String(20), nullable=True)  # pending_approval, approved, rejected
    approval_notes = db.Column(db.Text, nullable=True)
    
    # Recurring task reference
    recurring_task_id = db.Column(db.Integer, db.ForeignKey('recurring_tasks.id'), nullable=True)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )
    completed_at = db.Column(db.DateTime, nullable=True)
    
    # Relationships
    assignee = db.relationship('User', foreign_keys=[assigned_to], backref='assigned_tasks')
    creator = db.relationship('User', foreign_keys=[created_by], backref='created_tasks')
    approver = db.relationship('User', foreign_keys=[approved_by], backref='approved_tasks')
    project = db.relationship('Project', backref='tasks')
    department = db.relationship('Department', backref='tasks')
    
    def to_dict(self) -> dict:
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'priority': self.priority,
            'status': self.status,
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'assigned_to': self.assigned_to,
            'project_id': self.project_id,
            'created_by': self.created_by,
            'department_id': self.department_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'requires_approval': self.requires_approval,
            'approved_by': self.approved_by,
            'approved_at': self.approved_at.isoformat() if self.approved_at else None,
            'approval_status': self.approval_status,
            'approval_notes': self.approval_notes,
            'recurring_task_id': self.recurring_task_id,
            'assignee': self.assignee.to_dict() if self.assignee else None,
            'creator': self.creator.to_dict() if self.creator else None,
            'approver': self.approver.to_dict() if self.approver else None,
        }
    
    def __repr__(self):
        return f'<Task {self.title}>'