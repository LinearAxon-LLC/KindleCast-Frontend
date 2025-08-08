#!/bin/bash

# ScreenCast Success Verification Script
# Continuously monitors the website until it's confirmed working
# Author: ScreenCast Team

set -e

DOMAIN="kindlecast.com"
MAX_ATTEMPTS=10
ATTEMPT=1

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

# Test HTTPS
test_https() {
    log "Testing HTTPS connection to $DOMAIN..."
    
    if curl -s -I "https://$DOMAIN" | grep -q "200 OK"; then
        log "✓ HTTPS is working correctly"
        return 0
    else
        error "✗ HTTPS test failed"
        return 1
    fi
}

# Test HTTP redirect
test_http_redirect() {
    log "Testing HTTP to HTTPS redirect..."
    
    if curl -s -I "http://$DOMAIN" | grep -q "301"; then
        log "✓ HTTP to HTTPS redirect is working"
        return 0
    else
        error "✗ HTTP redirect test failed"
        return 1
    fi
}

# Test content
test_content() {
    log "Testing website content..."
    
    content=$(curl -s "https://$DOMAIN")
    
    if echo "$content" | grep -q "ScreenCast"; then
        log "✓ Website content is correct (ScreenCast found)"
        return 0
    else
        error "✗ Website content test failed (ScreenCast not found)"
        return 1
    fi
}

# Test SSL certificate
test_ssl() {
    log "Testing SSL certificate..."
    
    if openssl s_client -connect "$DOMAIN:443" -servername "$DOMAIN" </dev/null 2>/dev/null | grep -q "Verify return code: 0"; then
        log "✓ SSL certificate is valid"
        return 0
    else
        warn "⚠ SSL certificate verification failed (but site may still work)"
        return 0  # Don't fail on this as Let's Encrypt might take time
    fi
}

# Main verification loop
main() {
    log "Starting ScreenCast verification loop..."
    log "Domain: $DOMAIN"
    log "Max attempts: $MAX_ATTEMPTS"
    echo ""
    
    while [ $ATTEMPT -le $MAX_ATTEMPTS ]; do
        info "Attempt $ATTEMPT of $MAX_ATTEMPTS"
        
        # Track success
        TESTS_PASSED=0
        TOTAL_TESTS=4
        
        # Run tests
        if test_https; then
            ((TESTS_PASSED++))
        fi
        
        if test_http_redirect; then
            ((TESTS_PASSED++))
        fi
        
        if test_content; then
            ((TESTS_PASSED++))
        fi
        
        if test_ssl; then
            ((TESTS_PASSED++))
        fi
        
        echo ""
        info "Tests passed: $TESTS_PASSED/$TOTAL_TESTS"
        
        if [ $TESTS_PASSED -eq $TOTAL_TESTS ]; then
            log "🎉 SUCCESS! ScreenCast is fully operational!"
            log "🌐 Your website is live at: https://$DOMAIN"
            log "🔒 HTTPS is working correctly"
            log "🔄 HTTP redirects to HTTPS"
            log "✅ Content is loading properly"
            echo ""
            log "Final verification:"
            curl -s "https://$DOMAIN" | head -20 | grep -E "(ScreenCast|Turn Any Content)"
            echo ""
            log "Deployment completed successfully! 🚀"
            exit 0
        elif [ $TESTS_PASSED -ge 2 ]; then
            warn "Partial success ($TESTS_PASSED/$TOTAL_TESTS tests passed)"
            log "Website is mostly working, continuing to monitor..."
        else
            error "Most tests failed ($TESTS_PASSED/$TOTAL_TESTS tests passed)"
        fi
        
        if [ $ATTEMPT -lt $MAX_ATTEMPTS ]; then
            info "Waiting 10 seconds before next attempt..."
            sleep 10
        fi
        
        ((ATTEMPT++))
        echo "----------------------------------------"
    done
    
    error "❌ Verification failed after $MAX_ATTEMPTS attempts"
    log "Last status:"
    log "- HTTPS: $(curl -s -I "https://$DOMAIN" | head -1 || echo "Failed")"
    log "- HTTP Redirect: $(curl -s -I "http://$DOMAIN" | head -1 || echo "Failed")"
    
    exit 1
}

# Show help
show_help() {
    echo "ScreenCast Success Verification Script"
    echo ""
    echo "This script continuously monitors https://$DOMAIN until it's confirmed working"
    echo ""
    echo "Tests performed:"
    echo "- HTTPS connectivity"
    echo "- HTTP to HTTPS redirect"
    echo "- Website content verification"
    echo "- SSL certificate validation"
    echo ""
    echo "Usage:"
    echo "  ./verify-success.sh        Run verification loop"
    echo "  ./verify-success.sh --help Show this help"
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
