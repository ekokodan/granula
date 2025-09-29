"""Waitlist model."""
from datetime import datetime
from app.extensions import db


class WaitlistEntry(db.Model):
    """Waitlist signup model."""
    
    __tablename__ = 'waitlist_entries'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), nullable=False, unique=True, index=True)
    signed_up_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    ip_address = db.Column(db.String(45), nullable=True)  # Support both IPv4 and IPv6
    user_agent = db.Column(db.Text, nullable=True)
    referrer = db.Column(db.String(500), nullable=True)
    
    # Email status tracking
    confirmation_sent = db.Column(db.Boolean, default=False)
    confirmation_sent_at = db.Column(db.DateTime, nullable=True)
    
    # Admin notes
    notes = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(50), default='pending')  # pending, confirmed, invalid, etc.
    
    def __repr__(self):
        return f'<WaitlistEntry {self.email}>'
    
    def to_dict(self):
        """Convert to dictionary for JSON serialization."""
        return {
            'id': self.id,
            'email': self.email,
            'signed_up_at': self.signed_up_at.isoformat() if self.signed_up_at else None,
            'status': self.status,
            'confirmation_sent': self.confirmation_sent
        }