#!/usr/bin/env python3
"""Start development server."""
from dotenv import load_dotenv
import os

# Load environment variables first
load_dotenv()

from app import create_app

if __name__ == '__main__':
    app = create_app()
    print('Starting Flask backend on port 5003...')
    app.run(host='0.0.0.0', port=5003, debug=False)  # Disable debug to avoid restart issues