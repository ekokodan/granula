"""Recurring task model."""
from datetime import datetime, timedelta
from app.extensions import db
from app.models.task import Task


class RecurringTask(db.Model):
    """Model for recurring task templates."""
    
    __tablename__ = 'recurring_tasks'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    priority = db.Column(db.String(20), default='medium', nullable=False)
    
    # Recurrence settings
    recurrence_type = db.Column(db.String(20), nullable=False)  # daily, weekly, monthly, yearly, custom
    recurrence_interval = db.Column(db.Integer, default=1)  # Every X days/weeks/months
    recurrence_days = db.Column(db.JSON, default=list)  # For weekly: [1,3,5] = Mon, Wed, Fri
    recurrence_day_of_month = db.Column(db.Integer, nullable=True)  # For monthly: day of the month
    recurrence_end_date = db.Column(db.DateTime, nullable=True)  # When to stop recurring
    
    # Task details
    assigned_to = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=True)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    department_id = db.Column(db.Integer, db.ForeignKey('departments.id'), nullable=True)
    
    # Track generation
    last_generated_date = db.Column(db.DateTime, nullable=True)
    next_due_date = db.Column(db.DateTime, nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    assignee = db.relationship('User', foreign_keys=[assigned_to], backref='recurring_assigned_tasks')
    creator = db.relationship('User', foreign_keys=[created_by], backref='recurring_created_tasks')
    project = db.relationship('Project', backref='recurring_tasks')
    department = db.relationship('Department', backref='recurring_tasks')
    generated_tasks = db.relationship('Task', backref='recurring_template', foreign_keys='Task.recurring_task_id')
    
    def calculate_next_due_date(self, from_date=None):
        """Calculate the next due date based on recurrence settings."""
        base_date = from_date or self.next_due_date or datetime.utcnow()
        
        if self.recurrence_type == 'daily':
            return base_date + timedelta(days=self.recurrence_interval)
        elif self.recurrence_type == 'weekly':
            return base_date + timedelta(weeks=self.recurrence_interval)
        elif self.recurrence_type == 'monthly':
            # Add months (approximate with 30 days, can be refined)
            return base_date + timedelta(days=30 * self.recurrence_interval)
        elif self.recurrence_type == 'yearly':
            return base_date + timedelta(days=365 * self.recurrence_interval)
        
        return base_date + timedelta(days=1)  # Default to daily
    
    def generate_task(self):
        """Generate a new task instance from this recurring template."""
        if not self.is_active:
            return None
            
        if self.recurrence_end_date and datetime.utcnow() > self.recurrence_end_date:
            self.is_active = False
            db.session.commit()
            return None
        
        task = Task(
            title=self.title,
            description=self.description,
            priority=self.priority,
            status='pending',
            due_date=self.next_due_date,
            assigned_to=self.assigned_to,
            project_id=self.project_id,
            created_by=self.created_by,
            department_id=self.department_id,
            recurring_task_id=self.id
        )
        
        self.last_generated_date = datetime.utcnow()
        self.next_due_date = self.calculate_next_due_date()
        
        return task
    
    def to_dict(self) -> dict:
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'priority': self.priority,
            'recurrence_type': self.recurrence_type,
            'recurrence_interval': self.recurrence_interval,
            'recurrence_days': self.recurrence_days,
            'recurrence_day_of_month': self.recurrence_day_of_month,
            'recurrence_end_date': self.recurrence_end_date.isoformat() if self.recurrence_end_date else None,
            'assigned_to': self.assigned_to,
            'project_id': self.project_id,
            'created_by': self.created_by,
            'department_id': self.department_id,
            'last_generated_date': self.last_generated_date.isoformat() if self.last_generated_date else None,
            'next_due_date': self.next_due_date.isoformat() if self.next_due_date else None,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
    
    def __repr__(self):
        return f'<RecurringTask {self.title}>'