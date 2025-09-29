#!/usr/bin/env python3
"""Test script to verify email templates render correctly."""
import os
import sys
from datetime import datetime

# Add the app directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from jinja2 import Environment, FileSystemLoader
    
    def test_email_templates():
        """Test email template rendering."""
        print("🧪 Testing Email Template Rendering")
        print("=" * 50)
        
        # Set up Jinja2 environment
        template_dir = os.path.join(os.path.dirname(__file__), 'app', 'templates')
        env = Environment(loader=FileSystemLoader(template_dir))
        
        # Test data
        test_data = {
            'email': 'test@example.com',
            'signed_up_at': 'January 10, 2025 at 01:00 AM UTC',
            'ip_address': '127.0.0.1',
            'user_agent': 'Mozilla/5.0 (Test Browser)',
            'referrer': 'https://google.com',
            'total_signups': 42,
            'recent_signups': 7,
            'admin_url': 'http://localhost:5000/admin/waitlist'
        }
        
        # Test welcome email templates
        try:
            html_template = env.get_template('email/waitlist_welcome.html')
            txt_template = env.get_template('email/waitlist_welcome.txt')
            
            html_content = html_template.render(**test_data)
            txt_content = txt_template.render(**test_data)
            
            print("✅ Welcome email HTML template: OK")
            print("✅ Welcome email text template: OK")
            print(f"📏 HTML length: {len(html_content)} chars")
            print(f"📏 Text length: {len(txt_content)} chars")
            
        except Exception as e:
            print(f"❌ Welcome email templates: {e}")
        
        # Test admin notification templates
        try:
            html_template = env.get_template('email/admin_new_signup.html')
            txt_template = env.get_template('email/admin_new_signup.txt')
            
            html_content = html_template.render(**test_data)
            txt_content = txt_template.render(**test_data)
            
            print("✅ Admin notification HTML template: OK")
            print("✅ Admin notification text template: OK")
            print(f"📏 HTML length: {len(html_content)} chars")
            print(f"📏 Text length: {len(txt_content)} chars")
            
        except Exception as e:
            print(f"❌ Admin notification templates: {e}")
        
        print("\n🎉 Template testing complete!")
        
        # Show a sample of rendered content
        print("\n📄 Sample Welcome Email (first 200 chars):")
        print("-" * 50)
        if 'html_content' in locals():
            # Extract text content from HTML for preview
            import re
            text_preview = re.sub(r'<[^>]+>', '', html_content)[:200]
            print(text_preview + "...")

except ImportError:
    print("❌ Jinja2 not installed. Please install it with: pip install jinja2")
    
if __name__ == '__main__':
    test_email_templates()