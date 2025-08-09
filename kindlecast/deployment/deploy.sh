#!/bin/bash

# KindleCast Frontend Deployment Script
# Simple deployment to VPS

set -e  # Exit on any error

# Configuration
VPS_USER="root"
VPS_IP="143.110.233.187"
VPS_PASSWORD="22222WaminZ"
REMOTE_DIR="/home/kindlecast-frontend"
LOCAL_DIR="$(cd "$(dirname "$0")/.." && pwd)"
APP_NAME="kindlecast-frontend"

echo "🚀 Starting KindleCast Frontend Deployment..."
echo "📁 Local directory: $LOCAL_DIR"
echo "🖥️  Remote directory: $REMOTE_DIR"
echo "🌐 VPS: $VPS_IP"

# Function to run commands on remote server
run_remote() {
    sshpass -p "$VPS_PASSWORD" ssh -o StrictHostKeyChecking=no "$VPS_USER@$VPS_IP" "$1"
}

# Function to copy files to remote server
copy_to_remote() {
    sshpass -p "$VPS_PASSWORD" rsync -avz --delete \
        --exclude 'node_modules' \
        --exclude '.git' \
        --exclude 'deployment' \
        --exclude '*.log' \
        "$LOCAL_DIR/" "$VPS_USER@$VPS_IP:$REMOTE_DIR/"
}

echo "📦 Building project locally..."
cd "$LOCAL_DIR"
npm run build

echo "🔄 Copying files to VPS..."
copy_to_remote

echo "🛠️  Setting up on VPS..."
run_remote "
    echo '🔧 Installing Node.js if not exists...' &&
    if ! command -v node &> /dev/null; then
        curl -fsSL https://deb.nodesource.com/setup_20.x | bash - &&
        apt-get install -y nodejs
    fi &&
    export PATH=/usr/bin:/usr/local/bin:\$PATH &&
    cd $REMOTE_DIR &&
    echo '📦 Installing dependencies...' &&
    npm install &&
    echo '🔧 Installing TypeScript...' &&
    npm install typescript @types/node --save-dev &&
    echo '🔧 Installing PM2 globally if not exists...' &&
    npm list -g pm2 || npm install -g pm2 &&
    echo '🛑 Stopping existing app...' &&
    pm2 stop $APP_NAME || true &&
    pm2 delete $APP_NAME || true &&
    echo '🚀 Starting app with PM2...' &&
    pm2 start npm --name '$APP_NAME' -- start &&
    pm2 save &&
    echo '✅ Deployment completed!'
"

echo "🔍 Checking app status..."
run_remote "export PATH=/usr/bin:/usr/local/bin:\$PATH && pm2 status $APP_NAME"

echo "🌐 Testing app..."
sleep 5
if curl -f -s "http://$VPS_IP:3000" > /dev/null; then
    echo "✅ App is running successfully at http://$VPS_IP:3000"
    echo "🌍 Your site should be accessible at https://kindlecast.com"
else
    echo "❌ App might not be responding. Check logs with: ./monitor.sh logs"
fi

echo "🎉 Deployment completed!"
echo ""
echo "📋 Useful commands:"
echo "   ./monitor.sh status  - Check app status"
echo "   ./monitor.sh logs    - View app logs"
echo "   ./monitor.sh restart - Restart app"
