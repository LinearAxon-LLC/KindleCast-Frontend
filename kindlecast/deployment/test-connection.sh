#!/bin/bash

# Test VPS connection script

VPS_USER="root"
VPS_IP="143.110.233.187"
VPS_PASSWORD="22222WaminZ"

echo "🔍 Testing connection to VPS..."
echo "🖥️  Server: $VPS_IP"
echo "👤 User: $VPS_USER"

# Test basic connectivity
echo ""
echo "📡 Testing network connectivity..."
if ping -c 3 "$VPS_IP" > /dev/null 2>&1; then
    echo "✅ Network connectivity: OK"
else
    echo "❌ Network connectivity: FAILED"
    exit 1
fi

# Test SSH connection
echo ""
echo "🔐 Testing SSH connection..."
if sshpass -p "$VPS_PASSWORD" ssh -o StrictHostKeyChecking=no -o ConnectTimeout=10 "$VPS_USER@$VPS_IP" "echo 'SSH connection successful'" 2>/dev/null; then
    echo "✅ SSH connection: OK"
else
    echo "❌ SSH connection: FAILED"
    echo "Please check your credentials and network connection"
    exit 1
fi

# Check server info
echo ""
echo "🖥️  Server information:"
sshpass -p "$VPS_PASSWORD" ssh -o StrictHostKeyChecking=no "$VPS_USER@$VPS_IP" "
    echo '📋 OS: '$(cat /etc/os-release | grep PRETTY_NAME | cut -d'=' -f2 | tr -d '\"')
    echo '💾 Disk usage: '$(df -h / | awk 'NR==2{print \$3\"/\"\$2\" (\"\$5\" used)\"}')
    echo '🧠 Memory: '$(free -h | awk 'NR==2{print \$3\"/\"\$2\" used\"}')
    echo '⚡ Node.js: '$(node --version 2>/dev/null || echo 'Not installed')
    echo '📦 NPM: '$(npm --version 2>/dev/null || echo 'Not installed')
    echo '🔧 PM2: '$(pm2 --version 2>/dev/null || echo 'Not installed')
"

echo ""
echo "✅ Connection test completed successfully!"
echo "🚀 You can now run ./deploy.sh to deploy your application"
