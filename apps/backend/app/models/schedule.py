"""Schedule and Meeting models."""
from datetime import datetime
from typing import Optional
from app.extensions import db


class Schedule(db.Model):
    """Schedule model for calendar events and meetings."""
    
    __tablename__ = 'schedules'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    
    # Date and time
    date = db.Column(db.Date, nullable=False)
    start_time = db.Column(db.Time, nullable=False)
    end_time = db.Column(db.Time, nullable=False)
    timezone = db.Column(db.String(50), default='UTC', nullable=False)
    
    # Meeting details
    meeting_type = db.Column(db.String(20), default='in_person', nullable=False)  # in_person, google_meet, zoom, teams
    meeting_link = db.Column(db.String(500), nullable=True)
    location = db.Column(db.String(255), nullable=True)
    
    # Status and metadata
    status = db.Column(db.String(20), default='scheduled', nullable=False)  # scheduled, ongoing, completed, cancelled
    is_recurring = db.Column(db.Boolean, default=False)
    recurring_pattern = db.Column(db.String(50), nullable=True)  # daily, weekly, monthly
    
    # Relationships
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=True)
    team_id = db.Column(db.Integer, db.ForeignKey('teams.id'), nullable=True)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )
    
    # Relationships
    creator = db.relationship('User', foreign_keys=[created_by], backref='created_schedules')
    project = db.relationship('Project', backref='schedules')
    team = db.relationship('Team', backref='schedules')
    
    def to_dict(self) -> dict:
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'date': self.date.isoformat() if self.date else None,
            'start_time': self.start_time.strftime('%H:%M') if self.start_time else None,
            'end_time': self.end_time.strftime('%H:%M') if self.end_time else None,
            'timezone': self.timezone,
            'meeting_type': self.meeting_type,
            'meeting_link': self.meeting_link,
            'location': self.location,
            'status': self.status,
            'is_recurring': self.is_recurring,
            'recurring_pattern': self.recurring_pattern,
            'created_by': self.created_by,
            'project_id': self.project_id,
            'team_id': self.team_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'creator': self.creator.to_dict() if self.creator else None,
            'project': self.project.to_dict() if self.project else None,
            'team': self.team.to_dict() if self.team else None,
            'participants': [p.to_dict() for p in self.participants] if hasattr(self, 'participants') else []
        }
    
    def __repr__(self):
        return f'<Schedule {self.title} on {self.date}>'


class ScheduleParticipant(db.Model):
    """Model for tracking participants in scheduled events."""
    
    __tablename__ = 'schedule_participants'
    
    id = db.Column(db.Integer, primary_key=True)
    schedule_id = db.Column(db.Integer, db.ForeignKey('schedules.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    email = db.Column(db.String(255), nullable=True)  # For external participants
    name = db.Column(db.String(255), nullable=True)  # For external participants
    
    # Participant status
    response_status = db.Column(db.String(20), default='pending', nullable=False)  # pending, accepted, declined, tentative
    is_organizer = db.Column(db.Boolean, default=False)
    
    # Timestamps
    invited_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    responded_at = db.Column(db.DateTime, nullable=True)
    
    # Relationships
    schedule = db.relationship('Schedule', backref='participants')
    user = db.relationship('User', backref='schedule_participations')
    
    def to_dict(self) -> dict:
        return {
            'id': self.id,
            'schedule_id': self.schedule_id,
            'user_id': self.user_id,
            'email': self.email,
            'name': self.name or (self.user.full_name if self.user else None),
            'response_status': self.response_status,
            'is_organizer': self.is_organizer,
            'invited_at': self.invited_at.isoformat() if self.invited_at else None,
            'responded_at': self.responded_at.isoformat() if self.responded_at else None,
            'user': self.user.to_dict() if self.user else None
        }
    
    def __repr__(self):
        participant_name = self.name or (self.user.full_name if self.user else self.email)
        return f'<ScheduleParticipant {participant_name} in {self.schedule.title}>'