#!/bin/bash
set -e

echo "🚀 Starting Granula deployment on Railway..."

# Navigate to backend directory
cd apps/backend

# Install dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Run database migrations
echo "🗄️ Running database migrations..."
flask db upgrade

# Start the application
echo "🌟 Starting Granula backend..."
exec gunicorn --bind 0.0.0.0:$PORT --workers 4 --timeout 120 run:app