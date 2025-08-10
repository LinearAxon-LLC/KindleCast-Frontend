#!/bin/bash

# Efficient KindleCast deployment - build locally, deploy minimal

VPS_USER="root"
VPS_IP="143.110.233.187"
VPS_PASSWORD="22222WaminZ"
REMOTE_DIR="/home/kindlecast-frontend"

echo "🚀 Building locally and deploying..."

# Step 1: Build locally
echo "🏗️ Building production locally..."
cd "$(dirname "$0")/.."
npm run build -- --no-lint

# Step 2: Create minimal deployment package
echo "📦 Creating deployment package..."
tar -czf deploy.tar.gz .next package.json public --exclude=".next/cache"
echo "📏 Package size: $(du -h deploy.tar.gz | cut -f1)"

# Step 3: Clean server and upload
echo "🧹 Cleaning server and uploading..."
sshpass -p "$VPS_PASSWORD" ssh -o StrictHostKeyChecking=no "$VPS_USER@$VPS_IP" "
    pm2 delete all || true
    pkill -f node || true
    rm -rf $REMOTE_DIR
    mkdir -p $REMOTE_DIR
"

echo "📤 Uploading deployment package with rsync (fast parallel transfer)..."
sshpass -p "$VPS_PASSWORD" rsync -avz --progress --compress-level=6 \
    -e "ssh -o StrictHostKeyChecking=no" \
    deploy.tar.gz "$VPS_USER@$VPS_IP:$REMOTE_DIR/"
rm deploy.tar.gz

# Step 4: Extract and run
echo "🚀 Starting server..."
sshpass -p "$VPS_PASSWORD" ssh -o StrictHostKeyChecking=no "$VPS_USER@$VPS_IP" "
    cd $REMOTE_DIR
    tar -xzf deploy.tar.gz
    npm install --production --verbose --no-audit --no-fund --prefer-offline
    PORT=3000 pm2 start npm --name kindlecast -- start
    pm2 save
"

echo "✅ Deployment complete!"
