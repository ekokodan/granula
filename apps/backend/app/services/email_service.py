"""Email service for sending various types of emails."""
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
from flask import current_app, render_template
from flask_mail import Message
from app.extensions import mail
from .token_service import generate_token


class EmailService:
    """Service for handling email operations."""
    
    @staticmethod
    def send_email(
        to: List[str], 
        subject: str, 
        template: str, 
        template_data: Dict[str, Any] = None,
        from_email: Optional[str] = None
    ) -> bool:
        """
        Send an email using Flask-Mail.
        
        Args:
            to: List of recipient email addresses
            subject: Email subject
            template: Template name (without .html/.txt extension)
            template_data: Data to pass to the template
            from_email: Sender email (defaults to MAIL_DEFAULT_SENDER)
            
        Returns:
            bool: True if email sent successfully, False otherwise
        """
        if template_data is None:
            template_data = {}
            
        try:
            # Use default sender if not specified
            sender = from_email or current_app.config['MAIL_DEFAULT_SENDER']
            
            # Create message
            msg = Message(
                subject=subject,
                recipients=to,
                sender=sender
            )
            
            # Render templates
            try:
                msg.html = render_template(f'email/{template}.html', **template_data)
            except Exception as e:
                current_app.logger.warning(f"Could not render HTML template {template}.html: {e}")
                
            try:
                msg.body = render_template(f'email/{template}.txt', **template_data)
            except Exception as e:
                current_app.logger.warning(f"Could not render text template {template}.txt: {e}")
                
            # Send email
            if current_app.config.get('MAIL_SUPPRESS_SEND', False):
                current_app.logger.info(f"Email suppressed (development mode): {subject} to {to}")
                return True
                
            mail.send(msg)
            current_app.logger.info(f"Email sent successfully: {subject} to {to}")
            return True
            
        except Exception as e:
            current_app.logger.error(f"Failed to send email: {e}")
            return False
    
    @staticmethod
    def send_waitlist_welcome(email: str, signed_up_at: datetime) -> bool:
        """
        Send welcome email to new waitlist signup.
        
        Args:
            email: User's email address
            signed_up_at: When they signed up
            
        Returns:
            bool: True if sent successfully
        """
        template_data = {
            'email': email,
            'signed_up_at': signed_up_at.strftime('%B %d, %Y at %I:%M %p UTC')
        }
        
        return EmailService.send_email(
            to=[email],
            subject="🎉 Welcome to the Granula waitlist!",
            template="waitlist_welcome",
            template_data=template_data
        )
    
    @staticmethod
    def send_admin_signup_notification(
        user_email: str, 
        signed_up_at: datetime,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
        referrer: Optional[str] = None,
        total_signups: int = 0,
        recent_signups: int = 0
    ) -> bool:
        """
        Send notification to admin about new waitlist signup.
        
        Args:
            user_email: New user's email
            signed_up_at: When they signed up
            ip_address: User's IP address
            user_agent: User's browser/device info
            referrer: Where they came from
            total_signups: Total waitlist count
            recent_signups: Recent signups count
            
        Returns:
            bool: True if sent successfully
        """
        admin_email = current_app.config.get('ADMIN_EMAIL')
        if not admin_email:
            current_app.logger.warning("No admin email configured for notifications")
            return False
            
        template_data = {
            'email': user_email,
            'signed_up_at': signed_up_at.strftime('%B %d, %Y at %I:%M %p UTC'),
            'ip_address': ip_address,
            'user_agent': user_agent,
            'referrer': referrer,
            'total_signups': total_signups,
            'recent_signups': recent_signups,
            'admin_url': current_app.config.get('BASE_URL', 'https://granula.app') + '/admin/waitlist'
        }
        
        return EmailService.send_email(
            to=[admin_email],
            subject=f"🎯 New Granula waitlist signup: {user_email}",
            template="admin_new_signup",
            template_data=template_data
        )

    @staticmethod
    def send_verification_email(email: str) -> bool:
        """Send an email verification link to a newly registered user."""
        token = generate_token({"email": email}, purpose="verify_email", expires_in=timedelta(hours=24))
        verify_url = f"{current_app.config.get('BASE_URL', 'http://localhost:5000')}/api/auth/verify-email?token={token}"
        template_data = {'email': email, 'verify_url': verify_url}
        return EmailService.send_email(
            to=[email],
            subject="Verify your Granula account",
            template="verify_email",
            template_data=template_data
        )

    @staticmethod
    def send_verified_welcome(email: str) -> bool:
        """Send a welcome email after verification."""
        return EmailService.send_email(
            to=[email],
            subject="Welcome to Granula 🎉",
            template="welcome_verified",
            template_data={'email': email}
        )

    @staticmethod
    def send_login_otp(email: str, code: str) -> bool:
        """Send a one-time passcode to the user's email."""
        return EmailService.send_email(
            to=[email],
            subject="Your Granula login code",
            template="otp_code",
            template_data={'email': email, 'code': code}
        )

    @staticmethod
    def send_password_reset(email: str) -> bool:
        """Send a password reset link to the user."""
        token = generate_token({"email": email}, purpose="reset_password", expires_in=timedelta(hours=1))
        reset_url = f"{current_app.config.get('FRONTEND_URL', 'http://localhost:3000')}/reset-password?token={token}"
        return EmailService.send_email(
            to=[email],
            subject="Reset your Granula password",
            template="password_reset",
            template_data={'email': email, 'reset_url': reset_url}
        )
    
    @staticmethod
    def send_team_invitation(
        email: str,
        team_name: str,
        team_description: str,
        role: str,
        inviter_email: str,
        accept_url: str,
        expires_at: datetime
    ) -> bool:
        """
        Send a team invitation email.
        
        Args:
            email: Invitee's email address
            team_name: Name of the team
            team_description: Team description (optional)
            role: Role being offered (member, admin, etc.)
            inviter_email: Email of the person sending the invitation
            accept_url: URL to accept the invitation
            expires_at: When the invitation expires
            
        Returns:
            bool: True if sent successfully
        """
        template_data = {
            'email': email,
            'team_name': team_name,
            'team_description': team_description,
            'role': role,
            'inviter_email': inviter_email,
            'accept_url': accept_url,
            'expires_at': expires_at,
            'base_url': current_app.config.get('BASE_URL', 'https://granula.app')
        }
        
        return EmailService.send_email(
            to=[email],
            subject=f"You're invited to join {team_name} on Granula",
            template="team_invitation",
            template_data=template_data
        )

    @staticmethod
    def send_bulk_email(
        recipients: List[str],
        subject: str,
        template: str,
        template_data: Dict[str, Any] = None,
        batch_size: int = 50
    ) -> Dict[str, int]:
        """
        Send bulk emails in batches.
        
        Args:
            recipients: List of email addresses
            subject: Email subject
            template: Template name
            template_data: Template data
            batch_size: Number of emails per batch
            
        Returns:
            dict: Statistics about sending (sent, failed counts)
        """
        sent = 0
        failed = 0
        
        # Process in batches
        for i in range(0, len(recipients), batch_size):
            batch = recipients[i:i + batch_size]
            
            for email in batch:
                success = EmailService.send_email(
                    to=[email],
                    subject=subject,
                    template=template,
                    template_data=template_data or {}
                )
                
                if success:
                    sent += 1
                else:
                    failed += 1
        
        current_app.logger.info(f"Bulk email completed: {sent} sent, {failed} failed")
        return {"sent": sent, "failed": failed}
