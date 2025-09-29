"""Department and UserDepartment models."""
from datetime import datetime
from app.extensions import db


class Department(db.Model):
    """Department model for organizing team members."""
    
    __tablename__ = 'departments'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    
    # Relationships
    team_id = db.Column(db.Integer, db.ForeignKey('teams.id'), nullable=False)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )
    
    # Relationships
    members = db.relationship('UserDepartment', backref='department', cascade='all, delete-orphan')
    
    def to_dict(self) -> dict:
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'team_id': self.team_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'member_count': len(self.members),
        }
    
    def __repr__(self):
        return f'<Department {self.name}>'


class UserDepartment(db.Model):
    """Association table for user-department assignments."""
    
    __tablename__ = 'user_departments'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    department_id = db.Column(db.Integer, db.ForeignKey('departments.id'), nullable=False)
    
    # Timestamps
    assigned_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    user = db.relationship('User', backref='department_assignments')
    
    # Unique constraint
    __table_args__ = (db.UniqueConstraint('user_id', 'department_id', name='unique_user_department'),)
    
    def to_dict(self) -> dict:
        return {
            'id': self.id,
            'user_id': self.user_id,
            'department_id': self.department_id,
            'assigned_at': self.assigned_at.isoformat() if self.assigned_at else None,
            'user': self.user.to_dict() if self.user else None,
        }
    
    def __repr__(self):
        return f'<UserDepartment {self.user_id} in {self.department_id}>'