"""Project template model."""
from datetime import datetime
from app.extensions import db


class ProjectTemplate(db.Model):
    """Template model for creating standardized projects."""
    
    __tablename__ = 'project_templates'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    category = db.Column(db.String(100), nullable=True)  # e.g., 'Software Development', 'Marketing', 'Sales'
    
    # Template structure
    default_tasks = db.Column(db.JSON, default=list)  # List of task templates
    default_milestones = db.Column(db.JSON, default=list)  # List of milestone templates
    default_duration_days = db.Column(db.Integer, nullable=True)  # Expected project duration
    
    # Access control
    is_public = db.Column(db.Boolean, default=False)  # Available to all teams
    team_id = db.Column(db.Integer, db.ForeignKey('teams.id'), nullable=True)  # Private to specific team
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Usage tracking
    usage_count = db.Column(db.Integer, default=0)
    last_used_at = db.Column(db.DateTime, nullable=True)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    team = db.relationship('Team', backref='project_templates')
    creator = db.relationship('User', backref='created_project_templates')
    
    def to_dict(self) -> dict:
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'category': self.category,
            'default_tasks': self.default_tasks,
            'default_milestones': self.default_milestones,
            'default_duration_days': self.default_duration_days,
            'is_public': self.is_public,
            'team_id': self.team_id,
            'created_by': self.created_by,
            'usage_count': self.usage_count,
            'last_used_at': self.last_used_at.isoformat() if self.last_used_at else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
    
    def __repr__(self):
        return f'<ProjectTemplate {self.name}>'


class ProjectMilestone(db.Model):
    """Milestone model for project timeline tracking."""
    
    __tablename__ = 'project_milestones'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id', ondelete='CASCADE'), nullable=False)
    
    # Timeline
    target_date = db.Column(db.DateTime, nullable=False)
    completed_date = db.Column(db.DateTime, nullable=True)
    status = db.Column(db.String(20), default='pending')  # pending, in_progress, completed, delayed
    
    # Progress tracking
    progress_percentage = db.Column(db.Integer, default=0)
    
    # Dependencies
    depends_on = db.Column(db.JSON, default=list)  # List of milestone IDs this depends on
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    project = db.relationship('Project', backref=db.backref('milestones', lazy='dynamic', cascade='all, delete-orphan'))
    
    def to_dict(self) -> dict:
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'project_id': self.project_id,
            'target_date': self.target_date.isoformat() if self.target_date else None,
            'completed_date': self.completed_date.isoformat() if self.completed_date else None,
            'status': self.status,
            'progress_percentage': self.progress_percentage,
            'depends_on': self.depends_on,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
    
    def __repr__(self):
        return f'<ProjectMilestone {self.name}>'