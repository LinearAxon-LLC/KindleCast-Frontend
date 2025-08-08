#!/bin/bash

# Simple HTTPS Setup Script for ScreenCast
# Sets up SSL certificate with Certbot for kindlecast.com only
# Author: ScreenCast Team

set -e

# Configuration
VPS_HOST="143.198.50.21"
VPS_USER="root"
VPS_PASSWORD="22222WaminZ"
DOMAIN="kindlecast.com"
APP_PORT="3000"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

# Setup HTTPS for main domain only
setup_https_simple() {
    log "Setting up HTTPS for $DOMAIN (main domain only)..."
    
    sshpass -p "$VPS_PASSWORD" ssh -o StrictHostKeyChecking=no "$VPS_USER@$VPS_HOST" << EOF
        set -e
        
        # Stop nginx temporarily
        systemctl stop nginx
        
        # Get SSL certificate for main domain only
        echo "Obtaining SSL certificate for $DOMAIN..."
        certbot certonly \
            --standalone \
            --email admin@$DOMAIN \
            --agree-tos \
            --no-eff-email \
            --non-interactive \
            -d $DOMAIN
        
        # Create optimized nginx config with SSL
        cat > /etc/nginx/sites-available/$DOMAIN << 'NGINX_SSL_CONFIG'
# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name $DOMAIN;
    return 301 https://\$server_name\$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name $DOMAIN;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    
    # SSL Security Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Main application proxy
    location / {
        proxy_pass http://127.0.0.1:$APP_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Static files caching
    location /_next/static/ {
        proxy_pass http://127.0.0.1:$APP_PORT;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
    
    location ~* \.(ico|css|js|gif|jpe?g|png|svg|woff|woff2|ttf|eot|webp|avif)\$ {
        proxy_pass http://127.0.0.1:$APP_PORT;
        add_header Cache-Control "public, max-age=86400";
    }
}
NGINX_SSL_CONFIG

        # Test nginx configuration
        nginx -t
        
        # Start nginx with new SSL config
        systemctl start nginx
        systemctl enable nginx
        
        # Setup automatic certificate renewal
        echo "Setting up automatic certificate renewal..."
        
        # Create renewal script
        cat > /etc/cron.d/certbot-renew << 'CRON_CONFIG'
# Renew Let's Encrypt certificates twice daily
0 */12 * * * root certbot renew --quiet --post-hook "systemctl reload nginx"
CRON_CONFIG
        
        echo "HTTPS setup completed successfully!"
        echo "SSL certificate obtained for: $DOMAIN"
        
        # Show certificate info
        certbot certificates
        
        # Show nginx status
        systemctl status nginx --no-pager -l
EOF
    
    log "HTTPS setup completed successfully ✓"
}

# Main function
main() {
    log "Starting simple HTTPS setup for ScreenCast..."
    log "Domain: $DOMAIN"
    log "Target: $VPS_HOST"
    
    setup_https_simple
    
    log "🎉 HTTPS setup completed successfully!"
    log "🔒 Your site is now secure: https://$DOMAIN"
    log "🔄 HTTP traffic automatically redirects to HTTPS"
    log "🔄 Certificate auto-renewal is configured"
}

main
