"""Team invitation model."""
from datetime import datetime, timedelta
from app.extensions import db


class TeamInvitation(db.Model):
    """Model for team invitations sent via email."""
    
    __tablename__ = 'team_invitations'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), nullable=False, index=True)
    team_id = db.Column(db.Integer, db.ForeignKey('teams.id'), nullable=False)
    role = db.Column(db.String(50), default='member', nullable=False)  # owner, admin, member
    token = db.Column(db.String(255), unique=True, nullable=False, index=True)
    status = db.Column(db.String(20), default='pending', nullable=False)  # pending, accepted, expired, revoked
    
    # Who sent the invitation
    invited_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    expires_at = db.Column(db.DateTime, nullable=False)
    accepted_at = db.Column(db.DateTime, nullable=True)
    
    # Relationships
    team = db.relationship('Team', backref='invitations')
    inviter = db.relationship('User', backref='sent_invitations')
    
    # Unique constraint to prevent duplicate pending invitations
    __table_args__ = (
        db.UniqueConstraint('email', 'team_id', 'status', name='unique_pending_invitation'),
        db.Index('idx_invitation_email_status', 'email', 'status'),
        db.Index('idx_invitation_token_status', 'token', 'status'),
    )
    
    def __init__(self, **kwargs):
        # Set default expiration to 7 days from now
        if 'expires_at' not in kwargs:
            kwargs['expires_at'] = datetime.utcnow() + timedelta(days=7)
        super().__init__(**kwargs)
    
    @property
    def is_expired(self):
        """Check if invitation has expired."""
        return datetime.utcnow() > self.expires_at
    
    @property
    def is_pending(self):
        """Check if invitation is still pending."""
        return self.status == 'pending' and not self.is_expired
    
    def mark_accepted(self):
        """Mark invitation as accepted."""
        self.status = 'accepted'
        self.accepted_at = datetime.utcnow()
    
    def mark_expired(self):
        """Mark invitation as expired."""
        self.status = 'expired'
    
    def mark_revoked(self):
        """Mark invitation as revoked."""
        self.status = 'revoked'
    
    def to_dict(self) -> dict:
        return {
            'id': self.id,
            'email': self.email,
            'team_id': self.team_id,
            'role': self.role,
            'status': self.status,
            'invited_by': self.invited_by,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'expires_at': self.expires_at.isoformat() if self.expires_at else None,
            'accepted_at': self.accepted_at.isoformat() if self.accepted_at else None,
            'is_expired': self.is_expired,
            'team': self.team.to_dict() if self.team else None,
            'inviter': self.inviter.to_dict() if self.inviter else None,
        }
    
    def __repr__(self):
        return f'<TeamInvitation {self.email} to {self.team_id}>'