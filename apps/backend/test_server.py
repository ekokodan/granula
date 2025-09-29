#!/usr/bin/env python3
"""Test server with error handling."""
from dotenv import load_dotenv
import os
import traceback

# Load environment variables first
load_dotenv()
print(f'DATABASE_URL: {os.environ.get("DATABASE_URL")}')

from app import create_app

if __name__ == '__main__':
    try:
        app = create_app()
        print('✅ Flask app created successfully')
        
        # Test a simple route
        with app.app_context():
            from app.models.waitlist import WaitlistEntry
            count = WaitlistEntry.query.count()
            print(f'✅ Database connection working. Current waitlist entries: {count}')
        
        print('Starting Flask backend on port 5002...')
        app.run(host='0.0.0.0', port=5002, debug=True)
        
    except Exception as e:
        print(f'❌ Error starting server: {e}')
        print('Traceback:')
        traceback.print_exc()