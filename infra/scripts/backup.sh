#!/bin/bash
set -e

# Configuration
BACKUP_DIR=${BACKUP_DIR:-./backups}
RETENTION_DAYS=${RETENTION_DAYS:-30}
S3_BUCKET=${S3_BUCKET:-}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p "$BACKUP_DIR"

echo "📦 Starting backup process..."

# Backup database
echo "Backing up PostgreSQL database..."
docker-compose exec -T postgres pg_dump -U granula granula | gzip > "${BACKUP_DIR}/db_${TIMESTAMP}.sql.gz"

# Backup uploaded files (if any)
if [ -d "../apps/backend/uploads" ]; then
    echo "Backing up uploaded files..."
    tar -czf "${BACKUP_DIR}/uploads_${TIMESTAMP}.tar.gz" -C ../apps/backend uploads/
fi

# Upload to S3 if configured
if [ -n "$S3_BUCKET" ]; then
    echo "Uploading to S3..."
    aws s3 cp "${BACKUP_DIR}/db_${TIMESTAMP}.sql.gz" "s3://${S3_BUCKET}/backups/"
    [ -f "${BACKUP_DIR}/uploads_${TIMESTAMP}.tar.gz" ] && aws s3 cp "${BACKUP_DIR}/uploads_${TIMESTAMP}.tar.gz" "s3://${S3_BUCKET}/backups/"
fi

# Clean old backups
echo "Cleaning old backups (older than ${RETENTION_DAYS} days)..."
find "$BACKUP_DIR" -type f -mtime +${RETENTION_DAYS} -delete

echo "✅ Backup completed successfully!"
echo "Database backup: ${BACKUP_DIR}/db_${TIMESTAMP}.sql.gz"