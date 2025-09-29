#!/usr/bin/env python3
"""Flask application entry point."""
import os
from dotenv import load_dotenv
from app import create_app

# Load environment variables from .env file
load_dotenv()

# Create Flask app
app = create_app(os.getenv('FLASK_ENV', 'development'))

if __name__ == '__main__':
    # Run the development server
    app.run(
        host='0.0.0.0',
        port=int(os.getenv('PORT', 5002)),
        debug=os.getenv('FLASK_ENV') == 'development'
    )