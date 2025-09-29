"""Team and TeamMember models."""
from datetime import datetime
from app.extensions import db


class Team(db.Model):
    """Team model for organizing users."""
    
    __tablename__ = 'teams'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    
    # Relationships
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )
    
    # Relationships
    creator = db.relationship('User', backref='owned_teams')
    members = db.relationship('TeamMember', backref='team', cascade='all, delete-orphan')
    departments = db.relationship('Department', backref='team', cascade='all, delete-orphan')
    projects = db.relationship('Project', backref='team', cascade='all, delete-orphan')
    
    def to_dict(self) -> dict:
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'created_by': self.created_by,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'member_count': len(self.members),
            'department_count': len(self.departments),
        }
    
    def __repr__(self):
        return f'<Team {self.name}>'


class TeamMember(db.Model):
    """Association table for team membership with roles."""
    
    __tablename__ = 'team_members'
    
    id = db.Column(db.Integer, primary_key=True)
    team_id = db.Column(db.Integer, db.ForeignKey('teams.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    role = db.Column(db.String(50), default='member', nullable=False)  # owner, admin, member
    
    # Timestamps
    joined_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    user = db.relationship('User', backref='team_memberships')
    
    # Unique constraint
    __table_args__ = (db.UniqueConstraint('team_id', 'user_id', name='unique_team_membership'),)
    
    def to_dict(self) -> dict:
        return {
            'id': self.id,
            'team_id': self.team_id,
            'user_id': self.user_id,
            'role': self.role,
            'joined_at': self.joined_at.isoformat() if self.joined_at else None,
            'user': self.user.to_dict() if self.user else None,
        }
    
    def __repr__(self):
        return f'<TeamMember {self.user_id} in {self.team_id}>'