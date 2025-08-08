#!/bin/bash

# Test VPS connection before deployment
# This script tests the connection without making any changes

set -e

VPS_HOST="143.198.50.21"
VPS_USER="root"
VPS_PASSWORD="22222WaminZ"

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

# Check if sshpass is available
if ! command -v sshpass &> /dev/null; then
    warn "sshpass not found. Installing..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        if command -v brew &> /dev/null; then
            brew install hudochenkov/sshpass/sshpass
        else
            error "Please install Homebrew first: https://brew.sh/"
        fi
    else
        error "Please install sshpass manually"
    fi
fi

log "Testing connection to VPS..."

# Test basic connection
if sshpass -p "$VPS_PASSWORD" ssh -o StrictHostKeyChecking=no -o ConnectTimeout=10 "$VPS_USER@$VPS_HOST" "echo 'Connection successful'" 2>/dev/null; then
    log "✓ SSH connection successful"
else
    error "✗ Cannot connect to VPS. Please check credentials and network."
fi

# Test system information
log "Gathering system information..."

sshpass -p "$VPS_PASSWORD" ssh -o StrictHostKeyChecking=no "$VPS_USER@$VPS_HOST" << 'EOF'
echo "=== System Information ==="
echo "OS: $(lsb_release -d 2>/dev/null | cut -f2 || echo "Unknown")"
echo "Kernel: $(uname -r)"
echo "Architecture: $(uname -m)"

echo -e "\n=== Resources ==="
echo "Memory:"
free -h | grep -E "(Mem|Swap)"

echo -e "\nDisk Space:"
df -h / | tail -1

echo -e "\nCPU Info:"
nproc | xargs echo "CPU Cores:"
cat /proc/loadavg | awk '{print "Load Average: " $1 " " $2 " " $3}'

echo -e "\n=== Network ==="
echo "Public IP: $(curl -s ifconfig.me 2>/dev/null || echo "Unable to detect")"

echo -e "\n=== Installed Software ==="
echo "Node.js: $(node -v 2>/dev/null || echo "Not installed")"
echo "NPM: $(npm -v 2>/dev/null || echo "Not installed")"
echo "PM2: $(pm2 -v 2>/dev/null || echo "Not installed")"
echo "Nginx: $(nginx -v 2>&1 | head -1 || echo "Not installed")"

echo -e "\n=== Current Services ==="
if command -v systemctl &> /dev/null; then
    echo "Nginx: $(systemctl is-active nginx 2>/dev/null || echo "inactive")"
fi

if command -v pm2 &> /dev/null; then
    echo "PM2 processes:"
    pm2 list 2>/dev/null || echo "No PM2 processes"
fi

echo -e "\n=== Directory Check ==="
if [ -d "/var/www/screencast" ]; then
    echo "App directory exists: /var/www/screencast"
    ls -la /var/www/screencast 2>/dev/null || echo "Directory empty or no permissions"
else
    echo "App directory does not exist: /var/www/screencast"
fi
EOF

log "✓ Connection test completed successfully!"
log "Your VPS is ready for deployment."
log ""
log "Next steps:"
log "1. Run './deploy.sh' to deploy ScreenCast"
log "2. Use './monitor.sh status' to check application status"
