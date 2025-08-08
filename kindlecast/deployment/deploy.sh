#!/bin/bash

# ScreenCast Deployment Script
# Efficient deployment to VPS with resource optimization
# Author: ScreenCast Team
# Version: 1.0.0

set -e  # Exit on any error

# Configuration
VPS_HOST="143.198.50.21"
VPS_USER="root"
VPS_PASSWORD="22222WaminZ"
APP_NAME="screencast"
REMOTE_DIR="/var/www/screencast"
LOCAL_DIR="$(cd .. && pwd)"
BUILD_DIR="$LOCAL_DIR/.next"
NODE_VERSION="18"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

# Check if sshpass is installed
check_dependencies() {
    log "Checking dependencies..."
    
    if ! command -v sshpass &> /dev/null; then
        warn "sshpass not found. Installing..."
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            if command -v brew &> /dev/null; then
                brew install hudochenkov/sshpass/sshpass
            else
                error "Please install Homebrew first: https://brew.sh/"
            fi
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            # Linux
            sudo apt-get update && sudo apt-get install -y sshpass
        else
            error "Unsupported OS. Please install sshpass manually."
        fi
    fi
    
    log "Dependencies check completed ✓"
}

# Test VPS connection
test_connection() {
    log "Testing VPS connection..."
    
    if sshpass -p "$VPS_PASSWORD" ssh -o StrictHostKeyChecking=no -o ConnectTimeout=10 "$VPS_USER@$VPS_HOST" "echo 'Connection successful'" &> /dev/null; then
        log "VPS connection successful ✓"
    else
        error "Cannot connect to VPS. Please check credentials and network."
    fi
}

# Build the application locally with optimizations
build_app() {
    log "Building ScreenCast application..."

    # Change to project root
    cd "$LOCAL_DIR"

    # Clean previous builds
    rm -rf .next
    rm -rf out

    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        log "Installing dependencies..."
        npm ci --production=false
    fi

    # Build with optimizations
    log "Building for production..."
    NODE_ENV=production npm run build

    # Verify build
    if [ ! -d ".next" ]; then
        error "Build failed - .next directory not found"
    fi

    log "Build verification successful - .next directory found"

    log "Build completed successfully ✓"
}

# Setup VPS environment
setup_vps() {
    log "Setting up VPS environment..."
    
    sshpass -p "$VPS_PASSWORD" ssh -o StrictHostKeyChecking=no "$VPS_USER@$VPS_HOST" << 'EOF'
        # Update system
        apt-get update -y
        
        # Install Node.js 18 if not present
        if ! command -v node &> /dev/null || [[ $(node -v | cut -d'v' -f2 | cut -d'.' -f1) -lt 18 ]]; then
            echo "Installing Node.js 18..."
            curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
            apt-get install -y nodejs
        fi
        
        # Install PM2 globally if not present
        if ! command -v pm2 &> /dev/null; then
            echo "Installing PM2..."
            npm install -g pm2
        fi
        
        # Create app directory
        mkdir -p /var/www/screencast
        
        # Create nginx config if not exists
        if [ ! -f /etc/nginx/sites-available/screencast ]; then
            echo "Setting up Nginx..."
            apt-get install -y nginx
            
            cat > /etc/nginx/sites-available/screencast << 'NGINX_EOF'
server {
    listen 80;
    server_name _;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Static files caching
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
    
    # Favicon and other static assets
    location ~* \.(ico|css|js|gif|jpe?g|png|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=86400";
    }
}
NGINX_EOF
            
            # Enable site
            ln -sf /etc/nginx/sites-available/screencast /etc/nginx/sites-enabled/
            rm -f /etc/nginx/sites-enabled/default
            nginx -t && systemctl reload nginx
            systemctl enable nginx
        fi
        
        echo "VPS setup completed"
EOF
    
    log "VPS environment setup completed ✓"
}

# Deploy application
deploy_app() {
    log "Deploying ScreenCast to VPS..."

    # Change to project root
    cd "$LOCAL_DIR"

    # Create deployment package
    log "Creating deployment package..."
    tar -czf screencast-deploy.tar.gz \
        --exclude='.next/cache' \
        .next \
        public \
        package.json \
        package-lock.json \
        next.config.ts
    
    # Upload to VPS
    log "Uploading files to VPS..."
    sshpass -p "$VPS_PASSWORD" scp -o StrictHostKeyChecking=no screencast-deploy.tar.gz "$VPS_USER@$VPS_HOST:/tmp/"
    
    # Extract and setup on VPS
    sshpass -p "$VPS_PASSWORD" ssh -o StrictHostKeyChecking=no "$VPS_USER@$VPS_HOST" << EOF
        cd /var/www/screencast
        
        # Backup current deployment
        if [ -d ".next" ]; then
            echo "Creating backup..."
            tar -czf backup-\$(date +%Y%m%d-%H%M%S).tar.gz .next public package.json || true
            # Keep only last 3 backups
            ls -t backup-*.tar.gz | tail -n +4 | xargs rm -f || true
        fi
        
        # Extract new deployment
        echo "Extracting new deployment..."
        tar -xzf /tmp/screencast-deploy.tar.gz
        rm /tmp/screencast-deploy.tar.gz
        
        # Install production dependencies
        echo "Installing production dependencies..."
        npm ci --production --silent
        
        # Start/restart application with PM2
        echo "Starting application..."
        
        # PM2 ecosystem file
        cat > ecosystem.config.js << 'PM2_EOF'
module.exports = {
  apps: [{
    name: 'screencast',
    script: '.next/standalone/server.js',
    instances: 1,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      HOSTNAME: '0.0.0.0'
    },
    max_memory_restart: '200M',
    node_args: '--max-old-space-size=256',
    error_file: '/var/log/screencast-error.log',
    out_file: '/var/log/screencast-out.log',
    log_file: '/var/log/screencast.log',
    time: true
  }]
};
PM2_EOF
        
        # Start with PM2
        pm2 delete screencast 2>/dev/null || true
        pm2 start ecosystem.config.js
        pm2 save
        pm2 startup systemd -u root --hp /root
        
        echo "Deployment completed successfully"
EOF
    
    # Cleanup local files
    rm -f screencast-deploy.tar.gz
    
    log "Application deployed successfully ✓"
}

# Health check
health_check() {
    log "Performing health check..."
    
    sleep 5  # Wait for app to start
    
    # Check if app is responding
    if sshpass -p "$VPS_PASSWORD" ssh -o StrictHostKeyChecking=no "$VPS_USER@$VPS_HOST" "curl -f http://localhost:3000 > /dev/null 2>&1"; then
        log "Health check passed ✓"
        log "ScreenCast is now live at http://$VPS_HOST"
    else
        error "Health check failed. Please check the application logs."
    fi
}

# Rollback function
rollback() {
    warn "Rolling back to previous version..."
    
    sshpass -p "$VPS_PASSWORD" ssh -o StrictHostKeyChecking=no "$VPS_USER@$VPS_HOST" << 'EOF'
        cd /var/www/screencast
        
        # Find latest backup
        LATEST_BACKUP=$(ls -t backup-*.tar.gz 2>/dev/null | head -n1)
        
        if [ -n "$LATEST_BACKUP" ]; then
            echo "Restoring from $LATEST_BACKUP..."
            tar -xzf "$LATEST_BACKUP"
            pm2 restart screencast
            echo "Rollback completed"
        else
            echo "No backup found for rollback"
            exit 1
        fi
EOF
}

# Main deployment function
main() {
    log "Starting ScreenCast deployment..."
    log "Target: $VPS_HOST"
    
    # Trap for cleanup on error
    trap 'error "Deployment failed. Run with --rollback to restore previous version."' ERR
    
    if [ "$1" = "--rollback" ]; then
        rollback
        exit 0
    fi
    
    check_dependencies
    test_connection
    build_app
    setup_vps
    deploy_app
    health_check
    
    log "🎉 ScreenCast deployment completed successfully!"
    log "🌐 Your app is live at: http://$VPS_HOST"
    log "📊 Monitor with: ssh root@$VPS_HOST 'pm2 monit'"
    log "📝 View logs with: ssh root@$VPS_HOST 'pm2 logs screencast'"
}

# Help function
show_help() {
    echo "ScreenCast Deployment Script"
    echo ""
    echo "Usage:"
    echo "  ./deploy.sh           Deploy the application"
    echo "  ./deploy.sh --rollback Roll back to previous version"
    echo "  ./deploy.sh --help     Show this help message"
    echo ""
    echo "VPS Details:"
    echo "  Host: $VPS_HOST"
    echo "  User: $VPS_USER"
    echo ""
}

# Parse arguments
case "${1:-}" in
    --help|-h)
        show_help
        exit 0
        ;;
    --rollback)
        main --rollback
        ;;
    "")
        main
        ;;
    *)
        echo "Unknown option: $1"
        show_help
        exit 1
        ;;
esac
