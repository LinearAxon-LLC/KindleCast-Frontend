#!/bin/bash

# ScreenCast Monitoring Script
# Monitor application health and performance on VPS
# Author: ScreenCast Team

set -e

# Configuration
VPS_HOST="143.198.50.21"
VPS_USER="root"
VPS_PASSWORD="22222WaminZ"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

# Check application status
check_status() {
    log "Checking ScreenCast application status..."
    
    sshpass -p "$VPS_PASSWORD" ssh -o StrictHostKeyChecking=no "$VPS_USER@$VPS_HOST" << 'EOF'
        echo "=== PM2 Status ==="
        pm2 status screencast
        
        echo -e "\n=== System Resources ==="
        echo "Memory Usage:"
        free -h
        
        echo -e "\nDisk Usage:"
        df -h /var/www/screencast
        
        echo -e "\nCPU Usage:"
        top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1
        
        echo -e "\n=== Application Health ==="
        if curl -f http://localhost:3000 > /dev/null 2>&1; then
            echo "✓ Application is responding"
        else
            echo "✗ Application is not responding"
        fi
        
        echo -e "\n=== Recent Logs (last 20 lines) ==="
        pm2 logs screencast --lines 20 --nostream
EOF
}

# View logs
view_logs() {
    log "Viewing ScreenCast logs..."
    
    sshpass -p "$VPS_PASSWORD" ssh -o StrictHostKeyChecking=no "$VPS_USER@$VPS_HOST" "pm2 logs screencast"
}

# Restart application
restart_app() {
    log "Restarting ScreenCast application..."
    
    sshpass -p "$VPS_PASSWORD" ssh -o StrictHostKeyChecking=no "$VPS_USER@$VPS_HOST" << 'EOF'
        pm2 restart screencast
        echo "Application restarted"
        
        # Wait and check health
        sleep 5
        if curl -f http://localhost:3000 > /dev/null 2>&1; then
            echo "✓ Application is healthy after restart"
        else
            echo "✗ Application health check failed after restart"
        fi
EOF
}

# Performance monitoring
performance_monitor() {
    log "Starting performance monitoring (Press Ctrl+C to stop)..."
    
    sshpass -p "$VPS_PASSWORD" ssh -o StrictHostKeyChecking=no "$VPS_USER@$VPS_HOST" << 'EOF'
        echo "Monitoring ScreenCast performance..."
        echo "Press Ctrl+C to stop"
        
        while true; do
            clear
            echo "=== ScreenCast Performance Monitor ==="
            echo "Time: $(date)"
            echo ""
            
            echo "=== PM2 Status ==="
            pm2 status screencast
            
            echo -e "\n=== System Resources ==="
            echo "Memory:"
            free -h | grep -E "(Mem|Swap)"
            
            echo -e "\nDisk:"
            df -h / | tail -1
            
            echo -e "\nLoad Average:"
            uptime
            
            echo -e "\n=== Network Connections ==="
            netstat -an | grep :3000 | wc -l | xargs echo "Active connections:"
            
            sleep 5
        done
EOF
}

# Show help
show_help() {
    echo "ScreenCast Monitoring Script"
    echo ""
    echo "Usage:"
    echo "  ./monitor.sh status     Check application status"
    echo "  ./monitor.sh logs       View application logs"
    echo "  ./monitor.sh restart    Restart the application"
    echo "  ./monitor.sh monitor    Start performance monitoring"
    echo "  ./monitor.sh --help     Show this help message"
    echo ""
}

# Main function
case "${1:-status}" in
    status)
        check_status
        ;;
    logs)
        view_logs
        ;;
    restart)
        restart_app
        ;;
    monitor)
        performance_monitor
        ;;
    --help|-h)
        show_help
        ;;
    *)
        echo "Unknown command: $1"
        show_help
        exit 1
        ;;
esac
