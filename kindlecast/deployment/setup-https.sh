#!/bin/bash

# ScreenCast HTTPS Setup Script
# Sets up SSL certificate with Certbot for kindlecast.com
# Configures Nginx with proper proxy settings
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
BLUE='\033[0;34m'
NC='\033[0m'

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

# Check dependencies
check_dependencies() {
    log "Checking dependencies..."
    
    if ! command -v sshpass &> /dev/null; then
        warn "sshpass not found. Installing..."
        if [[ "$OSTYPE" == "darwin"* ]]; then
            if command -v brew &> /dev/null; then
                brew install hudochenkov/sshpass/sshpass
            else
                error "Please install Homebrew first: https://brew.sh/"
            fi
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            sudo apt-get update && sudo apt-get install -y sshpass
        else
            error "Unsupported OS. Please install sshpass manually."
        fi
    fi
    
    log "Dependencies check completed ✓"
}

# Test connection
test_connection() {
    log "Testing VPS connection..."
    
    if sshpass -p "$VPS_PASSWORD" ssh -o StrictHostKeyChecking=no -o ConnectTimeout=10 "$VPS_USER@$VPS_HOST" "echo 'Connection successful'" &> /dev/null; then
        log "VPS connection successful ✓"
    else
        error "Cannot connect to VPS. Please check credentials and network."
    fi
}

# Setup HTTPS and Nginx
setup_https() {
    log "Setting up HTTPS for $DOMAIN..."
    
    sshpass -p "$VPS_PASSWORD" ssh -o StrictHostKeyChecking=no "$VPS_USER@$VPS_HOST" << EOF
        set -e
        
        # Update system
        echo "Updating system packages..."
        export DEBIAN_FRONTEND=noninteractive
        apt-get update -y
        apt-get upgrade -y
        
        # Install required packages
        echo "Installing required packages..."
        apt-get install -y nginx certbot python3-certbot-nginx ufw curl wget
        
        # Configure firewall
        echo "Configuring firewall..."
        ufw --force enable
        ufw allow ssh
        ufw allow 'Nginx Full'
        ufw allow 80
        ufw allow 443
        
        # Stop nginx temporarily for certbot
        systemctl stop nginx
        
        # Create initial nginx config for domain verification
        cat > /etc/nginx/sites-available/$DOMAIN << 'NGINX_CONFIG'
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    
    # Let's Encrypt verification
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }
    
    # Temporary redirect to HTTPS (will be updated after SSL)
    location / {
        return 301 https://\$server_name\$request_uri;
    }
}
NGINX_CONFIG

        # Enable the site
        ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
        rm -f /etc/nginx/sites-enabled/default
        
        # Test nginx config
        nginx -t
        
        # Start nginx
        systemctl start nginx
        systemctl enable nginx
        
        # Create web root for Let's Encrypt
        mkdir -p /var/www/html
        
        # Get SSL certificate with automatic yes responses
        echo "Obtaining SSL certificate for $DOMAIN..."
        certbot certonly \
            --webroot \
            --webroot-path=/var/www/html \
            --email admin@$DOMAIN \
            --agree-tos \
            --no-eff-email \
            --non-interactive \
            -d $DOMAIN \
            -d www.$DOMAIN
        
        # Create optimized nginx config with SSL
        cat > /etc/nginx/sites-available/$DOMAIN << 'NGINX_SSL_CONFIG'
# Rate limiting
limit_req_zone \$binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone \$binary_remote_addr zone=login:10m rate=1r/s;

# Upstream for load balancing (future-proof)
upstream screencast_app {
    server 127.0.0.1:$APP_PORT;
    keepalive 32;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    
    # Let's Encrypt verification
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }
    
    # Redirect all HTTP to HTTPS
    location / {
        return 301 https://\$server_name\$request_uri;
    }
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    
    # SSL Security Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_stapling on;
    ssl_stapling_verify on;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self';" always;
    
    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json
        image/svg+xml;
    
    # Client settings
    client_max_body_size 10M;
    client_body_timeout 60s;
    client_header_timeout 60s;
    
    # Proxy settings
    proxy_buffering on;
    proxy_buffer_size 128k;
    proxy_buffers 4 256k;
    proxy_busy_buffers_size 256k;
    
    # Main application proxy
    location / {
        # Rate limiting
        limit_req zone=api burst=20 nodelay;
        
        proxy_pass http://screencast_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header X-Forwarded-Host \$server_name;
        proxy_cache_bypass \$http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # WebSocket support
        proxy_set_header Sec-WebSocket-Extensions \$http_sec_websocket_extensions;
        proxy_set_header Sec-WebSocket-Key \$http_sec_websocket_key;
        proxy_set_header Sec-WebSocket-Version \$http_sec_websocket_version;
    }
    
    # Next.js static files with long-term caching
    location /_next/static/ {
        proxy_pass http://screencast_app;
        add_header Cache-Control "public, max-age=31536000, immutable";
        expires 1y;
    }
    
    # API routes with stricter rate limiting
    location /api/ {
        limit_req zone=api burst=10 nodelay;
        
        proxy_pass http://screencast_app;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # API-specific timeouts
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }
    
    # Static assets caching
    location ~* \.(ico|css|js|gif|jpe?g|png|svg|woff|woff2|ttf|eot|webp|avif)\$ {
        proxy_pass http://screencast_app;
        add_header Cache-Control "public, max-age=86400";
        expires 1d;
    }
    
    # Favicon
    location = /favicon.ico {
        proxy_pass http://screencast_app;
        add_header Cache-Control "public, max-age=86400";
        expires 1d;
        log_not_found off;
        access_log off;
    }
    
    # Robots and sitemap
    location = /robots.txt {
        proxy_pass http://screencast_app;
        add_header Cache-Control "public, max-age=86400";
        expires 1d;
        log_not_found off;
    }
    
    location = /sitemap.xml {
        proxy_pass http://screencast_app;
        add_header Cache-Control "public, max-age=3600";
        expires 1h;
    }
    
    # Security: Block access to sensitive files
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    location ~ ~\$ {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    # Health check endpoint
    location /health {
        proxy_pass http://screencast_app;
        access_log off;
    }
}
NGINX_SSL_CONFIG

        # Test nginx configuration
        nginx -t
        
        # Reload nginx with new SSL config
        systemctl reload nginx
        
        # Setup automatic certificate renewal
        echo "Setting up automatic certificate renewal..."
        
        # Create renewal script
        cat > /etc/cron.d/certbot-renew << 'CRON_CONFIG'
# Renew Let's Encrypt certificates twice daily
0 */12 * * * root certbot renew --quiet --post-hook "systemctl reload nginx"
CRON_CONFIG
        
        # Test certificate renewal
        certbot renew --dry-run
        
        # Create nginx log rotation
        cat > /etc/logrotate.d/nginx-screencast << 'LOGROTATE_CONFIG'
/var/log/nginx/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0644 www-data www-data
    postrotate
        systemctl reload nginx
    endscript
}
LOGROTATE_CONFIG
        
        echo "HTTPS setup completed successfully!"
        echo "SSL certificate obtained for: $DOMAIN, www.$DOMAIN"
        echo "Nginx configured with security headers and optimizations"
        echo "Automatic certificate renewal configured"
        
        # Show certificate info
        certbot certificates
        
        # Show nginx status
        systemctl status nginx --no-pager -l
        
        echo "Setup completed! Your site should now be accessible at:"
        echo "https://$DOMAIN"
        echo "https://www.$DOMAIN"
EOF
    
    log "HTTPS setup completed successfully ✓"
}

# Verify setup
verify_setup() {
    log "Verifying HTTPS setup..."
    
    # Test HTTPS connection
    if curl -s -I "https://$DOMAIN" | grep -q "200 OK"; then
        log "✓ HTTPS is working correctly"
    else
        warn "HTTPS verification failed - please check manually"
    fi
    
    # Test HTTP redirect
    if curl -s -I "http://$DOMAIN" | grep -q "301"; then
        log "✓ HTTP to HTTPS redirect is working"
    else
        warn "HTTP redirect verification failed"
    fi
    
    log "Verification completed"
}

# Show final status
show_status() {
    log "Getting final status from server..."
    
    sshpass -p "$VPS_PASSWORD" ssh -o StrictHostKeyChecking=no "$VPS_USER@$VPS_HOST" << 'EOF'
        echo "=== SSL Certificate Status ==="
        certbot certificates
        
        echo -e "\n=== Nginx Status ==="
        systemctl status nginx --no-pager -l
        
        echo -e "\n=== Firewall Status ==="
        ufw status
        
        echo -e "\n=== Certificate Expiry ==="
        openssl x509 -in /etc/letsencrypt/live/kindlecast.com/cert.pem -noout -dates
        
        echo -e "\n=== Nginx Configuration Test ==="
        nginx -t
EOF
}

# Main function
main() {
    log "Starting HTTPS setup for ScreenCast..."
    log "Domain: $DOMAIN"
    log "Target: $VPS_HOST"
    
    check_dependencies
    test_connection
    setup_https
    verify_setup
    show_status
    
    log "🎉 HTTPS setup completed successfully!"
    log "🔒 Your site is now secure: https://$DOMAIN"
    log "🔄 HTTP traffic automatically redirects to HTTPS"
    log "🔄 Certificate auto-renewal is configured"
    log ""
    log "Next steps:"
    log "1. Update your DNS to point $DOMAIN to $VPS_HOST"
    log "2. Test your site: https://$DOMAIN"
    log "3. Deploy your app: ./deploy.sh"
}

# Help function
show_help() {
    echo "ScreenCast HTTPS Setup Script"
    echo ""
    echo "This script will:"
    echo "- Update and upgrade the VPS"
    echo "- Install Nginx and Certbot"
    echo "- Configure firewall (UFW)"
    echo "- Obtain SSL certificate for $DOMAIN"
    echo "- Configure Nginx with security headers"
    echo "- Setup automatic certificate renewal"
    echo ""
    echo "Usage:"
    echo "  ./setup-https.sh        Setup HTTPS"
    echo "  ./setup-https.sh --help Show this help"
    echo ""
    echo "Requirements:"
    echo "- Domain $DOMAIN must point to $VPS_HOST"
    echo "- VPS must be accessible via SSH"
    echo ""
}

# Parse arguments
case "${1:-}" in
    --help|-h)
        show_help
        exit 0
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
