#!/bin/bash
set -e

echo "🚀 Starting Granula deployment..."

# Configuration
ENVIRONMENT=${1:-production}
BACKUP_BEFORE_DEPLOY=${BACKUP_BEFORE_DEPLOY:-true}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    command -v docker >/dev/null 2>&1 || { log_error "Docker is required but not installed."; exit 1; }
    command -v docker-compose >/dev/null 2>&1 || { log_error "Docker Compose is required but not installed."; exit 1; }
    
    log_info "Prerequisites check passed ✓"
}

# Backup database
backup_database() {
    if [ "$BACKUP_BEFORE_DEPLOY" = true ]; then
        log_info "Backing up database..."
        timestamp=$(date +%Y%m%d_%H%M%S)
        docker-compose exec -T postgres pg_dump -U granula granula > "backup_${timestamp}.sql"
        log_info "Database backed up to backup_${timestamp}.sql ✓"
    fi
}

# Deploy application
deploy() {
    log_info "Deploying Granula (${ENVIRONMENT})..."
    
    # Pull latest changes
    log_info "Pulling latest changes..."
    git pull origin main
    
    # Build and start services
    log_info "Building Docker images..."
    docker-compose build --no-cache
    
    log_info "Starting services..."
    docker-compose up -d
    
    # Run migrations
    log_info "Running database migrations..."
    docker-compose exec api flask db upgrade
    
    # Health check
    log_info "Performing health check..."
    sleep 5
    curl -f http://localhost/health || { log_error "Health check failed"; exit 1; }
    
    log_info "Deployment completed successfully! ✓"
}

# Main execution
main() {
    check_prerequisites
    backup_database
    deploy
    
    log_info "Granula is now running!"
    log_info "Web: http://localhost"
    log_info "API: http://localhost/api"
}

# Run main function
main