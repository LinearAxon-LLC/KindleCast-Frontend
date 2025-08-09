#!/bin/bash

# KindleCast Frontend Monitoring Script

# Configuration
VPS_USER="root"
VPS_IP="143.110.233.187"
VPS_PASSWORD="22222WaminZ"
APP_NAME="kindlecast-frontend"

# Function to run commands on remote server
run_remote() {
    sshpass -p "$VPS_PASSWORD" ssh -o StrictHostKeyChecking=no "$VPS_USER@$VPS_IP" "$1"
}

case "$1" in
    "status")
        echo "📊 Checking app status..."
        run_remote "pm2 status $APP_NAME"
        ;;
    "logs")
        echo "📋 Viewing app logs..."
        run_remote "pm2 logs $APP_NAME --lines 50"
        ;;
    "restart")
        echo "🔄 Restarting app..."
        run_remote "pm2 restart $APP_NAME"
        echo "✅ App restarted!"
        ;;
    "stop")
        echo "🛑 Stopping app..."
        run_remote "pm2 stop $APP_NAME"
        echo "✅ App stopped!"
        ;;
    "start")
        echo "🚀 Starting app..."
        run_remote "pm2 start $APP_NAME"
        echo "✅ App started!"
        ;;
    "monitor")
        echo "📈 Live monitoring (Press Ctrl+C to exit)..."
        run_remote "pm2 monit"
        ;;
    "test")
        echo "🌐 Testing app connectivity..."
        if curl -f -s "http://$VPS_IP:3000" > /dev/null; then
            echo "✅ App is responding at http://$VPS_IP:3000"
        else
            echo "❌ App is not responding"
        fi
        ;;
    *)
        echo "🛠️  KindleCast Frontend Monitor"
        echo ""
        echo "Usage: $0 {status|logs|restart|stop|start|monitor|test}"
        echo ""
        echo "Commands:"
        echo "  status   - Show PM2 process status"
        echo "  logs     - Show recent application logs"
        echo "  restart  - Restart the application"
        echo "  stop     - Stop the application"
        echo "  start    - Start the application"
        echo "  monitor  - Live monitoring dashboard"
        echo "  test     - Test if app is responding"
        exit 1
        ;;
esac
