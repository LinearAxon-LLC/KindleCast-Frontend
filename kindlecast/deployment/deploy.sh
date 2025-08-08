#!/bin/bash

# KindleCast Simple Deployment Script
# Copy app, build on server, serve with PM2

set -euo pipefail

# Configuration
VPS_IP="143.198.50.21"
VPS_USER="root"
VPS_PASSWORD="22222WaminZ"
REMOTE_DIR="/var/www/kindlecast"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date '+%H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date '+%H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

# Check dependencies
if ! command -v sshpass &> /dev/null; then
    error "sshpass required. Install with: brew install sshpass"
fi

log "Starting deployment..."

# Copy app to server (respecting .gitignore)
log "Copying app to server..."
cd ..
sshpass -p "$VPS_PASSWORD" rsync -avz --delete \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude '.next' \
    --exclude 'deployment' \
    --exclude '*.log' \
    ./ "$VPS_USER@$VPS_IP:$REMOTE_DIR/"

# Build and deploy on server
log "Building and deploying..."
sshpass -p "$VPS_PASSWORD" ssh -o StrictHostKeyChecking=no "$VPS_USER@$VPS_IP" "
    cd $REMOTE_DIR

    # Install dependencies
    npm install

    # Build the app
    npm run build

    # Copy static files for nginx to serve directly
    rm -rf /var/www/kindlecast-static
    mkdir -p /var/www/kindlecast-static/_next
    cp -r .next/static /var/www/kindlecast-static/_next/
    cp -r public/* /var/www/kindlecast-static/ 2>/dev/null || true
    chown -R www-data:www-data /var/www/kindlecast-static

    # Start with PM2
    pm2 delete kindlecast 2>/dev/null || true
    pm2 start 'node .next/standalone/server.js' --name kindlecast
    pm2 save
"

# Health check
log "Testing deployment..."
sleep 5
if sshpass -p "$VPS_PASSWORD" ssh -o StrictHostKeyChecking=no "$VPS_USER@$VPS_IP" "curl -f https://kindlecast.com > /dev/null 2>&1"; then
    log "✅ KindleCast is live at https://kindlecast.com"
else
    error "❌ Health check failed"
fi

log "🎉 Deployment completed!"
