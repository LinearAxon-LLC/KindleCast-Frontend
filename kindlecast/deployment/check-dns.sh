#!/bin/bash

# DNS Verification Script for ScreenCast
# Checks if kindlecast.com is properly configured before HTTPS setup
# Author: ScreenCast Team

set -e

DOMAIN="kindlecast.com"
VPS_IP="143.198.50.21"

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
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1${NC}"
}

# Check DNS resolution
check_dns() {
    log "Checking DNS configuration for $DOMAIN..."
    
    # Check A record for main domain
    echo "Checking A record for $DOMAIN..."
    MAIN_IP=$(dig +short A $DOMAIN | tail -1)
    
    if [ -n "$MAIN_IP" ]; then
        if [ "$MAIN_IP" = "$VPS_IP" ]; then
            log "✓ $DOMAIN correctly points to $VPS_IP"
        else
            error "✗ $DOMAIN points to $MAIN_IP, but should point to $VPS_IP"
            echo "Please update your DNS A record to point to $VPS_IP"
            return 1
        fi
    else
        error "✗ No A record found for $DOMAIN"
        echo "Please create an A record pointing to $VPS_IP"
        return 1
    fi
    
    # Check A record for www subdomain
    echo "Checking A record for www.$DOMAIN..."
    WWW_IP=$(dig +short A www.$DOMAIN | tail -1)
    
    if [ -n "$WWW_IP" ]; then
        if [ "$WWW_IP" = "$VPS_IP" ]; then
            log "✓ www.$DOMAIN correctly points to $VPS_IP"
        else
            warn "⚠ www.$DOMAIN points to $WWW_IP, but should point to $VPS_IP"
            echo "Consider updating your DNS A record for www subdomain"
        fi
    else
        warn "⚠ No A record found for www.$DOMAIN"
        echo "Consider creating an A record for www.$DOMAIN pointing to $VPS_IP"
    fi
    
    # Check CNAME for www (alternative to A record)
    WWW_CNAME=$(dig +short CNAME www.$DOMAIN | tail -1)
    if [ -n "$WWW_CNAME" ]; then
        info "www.$DOMAIN has CNAME record pointing to $WWW_CNAME"
    fi
}

# Check DNS propagation
check_propagation() {
    log "Checking DNS propagation across different servers..."
    
    # List of public DNS servers to check
    DNS_SERVERS=(
        "8.8.8.8"          # Google
        "1.1.1.1"          # Cloudflare
        "208.67.222.222"   # OpenDNS
        "9.9.9.9"          # Quad9
    )
    
    for dns_server in "${DNS_SERVERS[@]}"; do
        echo "Checking via $dns_server..."
        result=$(dig @$dns_server +short A $DOMAIN | tail -1)
        
        if [ -n "$result" ]; then
            if [ "$result" = "$VPS_IP" ]; then
                echo "  ✓ $dns_server: $result (correct)"
            else
                echo "  ✗ $dns_server: $result (incorrect, should be $VPS_IP)"
            fi
        else
            echo "  ✗ $dns_server: No result"
        fi
    done
}

# Check domain accessibility
check_accessibility() {
    log "Checking domain accessibility..."
    
    # Check if domain is reachable via HTTP
    if curl -s -I --connect-timeout 10 "http://$DOMAIN" &> /dev/null; then
        log "✓ $DOMAIN is accessible via HTTP"
    else
        warn "⚠ $DOMAIN is not accessible via HTTP (this is normal if no web server is running yet)"
    fi
    
    # Check if VPS IP is reachable
    if curl -s -I --connect-timeout 10 "http://$VPS_IP" &> /dev/null; then
        log "✓ VPS IP $VPS_IP is accessible via HTTP"
    else
        warn "⚠ VPS IP $VPS_IP is not accessible via HTTP (web server may not be running)"
    fi
}

# Show DNS information
show_dns_info() {
    log "DNS Information Summary:"
    
    echo "Domain: $DOMAIN"
    echo "Target IP: $VPS_IP"
    echo ""
    
    echo "=== A Records ==="
    dig +short A $DOMAIN | while read ip; do
        echo "$DOMAIN -> $ip"
    done
    
    dig +short A www.$DOMAIN | while read ip; do
        echo "www.$DOMAIN -> $ip"
    done
    
    echo ""
    echo "=== CNAME Records ==="
    dig +short CNAME www.$DOMAIN | while read cname; do
        echo "www.$DOMAIN -> $cname"
    done
    
    echo ""
    echo "=== MX Records ==="
    dig +short MX $DOMAIN | while read mx; do
        echo "$DOMAIN MX -> $mx"
    done
    
    echo ""
    echo "=== NS Records ==="
    dig +short NS $DOMAIN | while read ns; do
        echo "$DOMAIN NS -> $ns"
    done
}

# Provide DNS setup instructions
show_dns_instructions() {
    echo ""
    echo "=== DNS Setup Instructions ==="
    echo ""
    echo "To properly configure DNS for $DOMAIN, add these records:"
    echo ""
    echo "A Record:"
    echo "  Name: @"
    echo "  Value: $VPS_IP"
    echo "  TTL: 300 (or default)"
    echo ""
    echo "A Record (for www):"
    echo "  Name: www"
    echo "  Value: $VPS_IP"
    echo "  TTL: 300 (or default)"
    echo ""
    echo "Alternative for www (CNAME):"
    echo "  Name: www"
    echo "  Value: $DOMAIN"
    echo "  TTL: 300 (or default)"
    echo ""
    echo "Common DNS Providers:"
    echo "- Cloudflare: https://dash.cloudflare.com/"
    echo "- Namecheap: https://ap.www.namecheap.com/domains/list/"
    echo "- GoDaddy: https://dcc.godaddy.com/manage/"
    echo "- Google Domains: https://domains.google.com/"
    echo ""
    echo "Note: DNS changes can take up to 48 hours to propagate globally,"
    echo "but usually take effect within 5-15 minutes."
}

# Main function
main() {
    log "Starting DNS verification for ScreenCast..."
    log "Domain: $DOMAIN"
    log "Target IP: $VPS_IP"
    echo ""
    
    # Check if dig is available
    if ! command -v dig &> /dev/null; then
        error "dig command not found. Please install dnsutils:"
        echo "  macOS: brew install bind"
        echo "  Ubuntu/Debian: sudo apt-get install dnsutils"
        echo "  CentOS/RHEL: sudo yum install bind-utils"
        exit 1
    fi
    
    # Perform checks
    DNS_OK=true
    
    if ! check_dns; then
        DNS_OK=false
    fi
    
    echo ""
    check_propagation
    echo ""
    check_accessibility
    echo ""
    show_dns_info
    
    echo ""
    if [ "$DNS_OK" = true ]; then
        log "🎉 DNS configuration looks good!"
        log "You can now run: ./setup-https.sh"
    else
        error "❌ DNS configuration needs to be fixed"
        show_dns_instructions
        echo ""
        echo "After updating DNS, wait 5-15 minutes and run this script again."
        exit 1
    fi
}

# Help function
show_help() {
    echo "DNS Verification Script for ScreenCast"
    echo ""
    echo "This script checks if $DOMAIN is properly configured to point to $VPS_IP"
    echo ""
    echo "Usage:"
    echo "  ./check-dns.sh        Check DNS configuration"
    echo "  ./check-dns.sh --help Show this help"
    echo ""
    echo "What this script checks:"
    echo "- A record for $DOMAIN"
    echo "- A record for www.$DOMAIN"
    echo "- DNS propagation across multiple servers"
    echo "- Domain accessibility"
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
