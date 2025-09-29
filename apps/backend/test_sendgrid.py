#!/usr/bin/env python3
"""Test SendGrid configuration specifically."""
import os
from dotenv import load_dotenv

# Load environment variables first
load_dotenv()

from app import create_app
from app.services.email_service import EmailService

def test_sendgrid_config():
    """Test SendGrid configuration and send a simple email."""
    print("🧪 Testing SendGrid Configuration")
    print("=" * 50)
    
    # Check environment variables
    print("Environment Variables:")
    print(f"MAIL_SERVER: {os.getenv('MAIL_SERVER')}")
    print(f"MAIL_PORT: {os.getenv('MAIL_PORT')}")
    print(f"MAIL_USERNAME: {os.getenv('MAIL_USERNAME')}")
    print(f"MAIL_PASSWORD: {os.getenv('MAIL_PASSWORD')[:20]}..." if os.getenv('MAIL_PASSWORD') else "None")
    print(f"MAIL_DEFAULT_SENDER: {os.getenv('MAIL_DEFAULT_SENDER')}")
    print()
    
    # Create Flask app
    app = create_app('development')
    
    with app.app_context():
        print("Flask App Configuration:")
        print(f"MAIL_SERVER: {app.config.get('MAIL_SERVER')}")
        print(f"MAIL_PORT: {app.config.get('MAIL_PORT')}")
        print(f"MAIL_USERNAME: {app.config.get('MAIL_USERNAME')}")
        print(f"MAIL_DEFAULT_SENDER: {app.config.get('MAIL_DEFAULT_SENDER')}")
        print(f"MAIL_SUPPRESS_SEND: {app.config.get('MAIL_SUPPRESS_SEND')}")
        print()
        
        # Test sending a simple email
        print("📧 Sending Test Email...")
        success = EmailService.send_email(
            to=['test@example.com'],
            subject='SendGrid Test Email',
            template='verify_email',  # Use existing template
            template_data={'email': 'test@example.com', 'verify_url': 'http://test.com'}
        )
        
        print(f"✅ Email send result: {'Success' if success else 'Failed'}")

if __name__ == '__main__':
    test_sendgrid_config()