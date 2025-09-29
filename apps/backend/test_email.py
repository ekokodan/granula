#!/usr/bin/env python3
"""Test script for email functionality."""
import os
from datetime import datetime
from dotenv import load_dotenv
from app import create_app
from app.services.email_service import EmailService

# Load environment variables
load_dotenv()

def test_email_functionality():
    """Test email sending functionality."""
    # Create Flask app context
    app = create_app('development')
    
    with app.app_context():
        print("🧪 Testing Email Functionality")
        print("=" * 50)
        
        # Test email configuration
        print(f"Mail Server: {app.config.get('MAIL_SERVER')}")
        print(f"Mail Port: {app.config.get('MAIL_PORT')}")
        print(f"Mail Sender: {app.config.get('MAIL_DEFAULT_SENDER')}")
        print(f"Mail Suppress Send: {app.config.get('MAIL_SUPPRESS_SEND')}")
        print()
        
        # Test welcome email
        print("📧 Testing Welcome Email...")
        test_email = "test@example.com"
        success = EmailService.send_waitlist_welcome(
            email=test_email,
            signed_up_at=datetime.utcnow()
        )
        print(f"✅ Welcome email: {'Success' if success else 'Failed'}")
        
        # Test admin notification
        print("\n📧 Testing Admin Notification...")
        admin_email = app.config.get('ADMIN_EMAIL')
        if admin_email:
            success = EmailService.send_admin_signup_notification(
                user_email=test_email,
                signed_up_at=datetime.utcnow(),
                ip_address="127.0.0.1",
                user_agent="Test Browser 1.0",
                referrer="https://google.com",
                total_signups=42,
                recent_signups=7
            )
            print(f"✅ Admin notification: {'Success' if success else 'Failed'}")
        else:
            print("⚠️ No admin email configured - skipping admin notification test")
        
        print("\n🎉 Email testing complete!")
        
        if app.config.get('MAIL_SUPPRESS_SEND'):
            print("📝 Note: MAIL_SUPPRESS_SEND is enabled - emails were not actually sent")
        else:
            print("📧 Emails were sent to the configured SMTP server")

if __name__ == '__main__':
    test_email_functionality()