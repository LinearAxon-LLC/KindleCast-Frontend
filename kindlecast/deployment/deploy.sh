#!/bin/bash

# Simple KindleCast deployment

VPS_USER="root"
VPS_IP="143.110.233.187"
VPS_PASSWORD="22222WaminZ"
REMOTE_DIR="/home/kindlecast-frontend"

echo "🚀 Deploying KindleCast..."

# Copy source files only
echo "📤 Uploading source..."
sshpass -p "$VPS_PASSWORD" rsync -avz --delete \
    --exclude 'node_modules' \
    --exclude '.next' \
    --exclude '.git' \
    --exclude 'deployment' \
    "$(dirname "$0")/../" "$VPS_USER@$VPS_IP:$REMOTE_DIR/"

# Start dev server
echo "🔧 Starting dev server..."
sshpass -p "$VPS_PASSWORD" ssh -o StrictHostKeyChecking=no "$VPS_USER@$VPS_IP" "
    cd $REMOTE_DIR &&
    npm install --verbose &&
    pm2 delete kindlecast-frontend 2>/dev/null || true &&
    pm2 start npm --name kindlecast-frontend -- run dev &&
    pm2 save
"

echo "✅ Done! Site: https://kindlecast.com"
