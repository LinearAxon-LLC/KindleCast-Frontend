# ScreenCast Deployment Guide

This directory contains scripts for deploying and monitoring the ScreenCast application on your VPS.

## 🚀 Quick Start

### First Time Setup (HTTPS + Deployment)
```bash
cd deployment

# 1. Check DNS configuration
./check-dns.sh

# 2. Setup HTTPS with SSL certificate
./setup-https.sh

# 3. Deploy the application
./deploy.sh
```

### Subsequent Deployments
```bash
./deploy.sh
```

### Monitor Application
```bash
./monitor.sh status    # Check status
./monitor.sh logs      # View logs
./monitor.sh monitor   # Live monitoring
```

## 📋 Scripts Overview

### `deploy.sh` - Main Deployment Script
- **Purpose**: Automated deployment with zero-downtime
- **Features**:
  - Builds application locally
  - Sets up VPS environment (Node.js, PM2, Nginx)
  - Deploys with resource optimization
  - Health checks and rollback capability
  - Backup management

**Usage:**
```bash
./deploy.sh           # Deploy application
./deploy.sh --rollback # Rollback to previous version
./deploy.sh --help    # Show help
```

### `monitor.sh` - Monitoring Script
- **Purpose**: Monitor application health and performance
- **Features**:
  - Application status checks
  - Resource monitoring (CPU, Memory, Disk)
  - Log viewing
  - Application restart
  - Live performance monitoring

**Usage:**
```bash
./monitor.sh status   # Check application status
./monitor.sh logs     # View application logs
./monitor.sh restart  # Restart application
./monitor.sh monitor  # Live performance monitoring
```

### `setup-https.sh` - HTTPS Setup Script
- **Purpose**: Configure SSL certificate and secure Nginx proxy
- **Features**:
  - System updates (apt update & upgrade)
  - Installs Nginx, Certbot, UFW firewall
  - Obtains Let's Encrypt SSL certificate
  - Configures secure Nginx proxy with security headers
  - Sets up automatic certificate renewal
  - Configures firewall rules

**Usage:**
```bash
./setup-https.sh      # Setup HTTPS for kindlecast.com
./setup-https.sh --help # Show help
```

### `check-dns.sh` - DNS Verification Script
- **Purpose**: Verify DNS configuration before HTTPS setup
- **Features**:
  - Checks A records for domain and www subdomain
  - Verifies DNS propagation across multiple servers
  - Tests domain accessibility
  - Provides DNS setup instructions

**Usage:**
```bash
./check-dns.sh        # Check DNS configuration
./check-dns.sh --help # Show help
```

## 🔧 VPS Configuration

### Server Details
- **Host**: 143.198.50.21
- **Domain**: kindlecast.com
- **User**: root
- **Password**: 22222WaminZ

### Installed Components
- **Node.js 18**: JavaScript runtime
- **PM2**: Process manager for Node.js applications
- **Nginx**: Reverse proxy and web server with SSL
- **Certbot**: Let's Encrypt SSL certificate management
- **UFW**: Uncomplicated Firewall
- **Application**: Runs on port 3000 (internal)
- **Web Access**: Port 443 (HTTPS), Port 80 (HTTP redirect)

### Resource Optimization
- **Memory Limit**: 200MB per process
- **Node.js Heap**: 256MB max
- **PM2 Cluster**: Single instance (resource-efficient)
- **Nginx Gzip**: Enabled for compression
- **Static Caching**: Optimized cache headers

### SSL/Security Configuration
- **SSL Certificate**: Let's Encrypt (auto-renewal enabled)
- **TLS Versions**: TLSv1.2 and TLSv1.3 only
- **Security Headers**: HSTS, CSP, X-Frame-Options, etc.
- **Rate Limiting**: API and general request limiting
- **Firewall**: UFW configured (SSH, HTTP, HTTPS only)
- **HTTP Redirect**: All HTTP traffic redirects to HTTPS

## 📊 Monitoring & Maintenance

### Health Checks
The deployment script automatically performs health checks:
- Application responsiveness test
- PM2 process status
- Memory usage validation

### Backup Strategy
- Automatic backup before each deployment
- Keeps last 3 backups
- Quick rollback capability

### Log Management
- Application logs: `/var/log/screencast.log`
- Error logs: `/var/log/screencast-error.log`
- Output logs: `/var/log/screencast-out.log`

## 🚨 Troubleshooting

### Common Issues

**1. DNS Not Configured**
```bash
# Check DNS configuration
./check-dns.sh

# If DNS is wrong, update your domain registrar settings
# Wait 5-15 minutes for propagation
```

**2. SSL Certificate Issues**
```bash
# Check certificate status
ssh root@143.198.50.21 'certbot certificates'

# Renew certificate manually
ssh root@143.198.50.21 'certbot renew --force-renewal'

# Check Nginx configuration
ssh root@143.198.50.21 'nginx -t'
```

**3. Deployment Fails**
```bash
# Check VPS connection
ssh root@143.198.50.21

# Check application status
./monitor.sh status

# View logs
./monitor.sh logs
```

**4. Application Not Responding**
```bash
# Restart application
./monitor.sh restart

# If still failing, rollback
./deploy.sh --rollback
```

**5. High Memory Usage**
```bash
# Monitor resources
./monitor.sh monitor

# Restart if needed
./monitor.sh restart
```

**6. Build Failures**
```bash
# Clean local build
rm -rf .next node_modules
npm install
npm run build
```

### Manual VPS Access
```bash
# SSH into VPS
ssh root@143.198.50.21

# Check PM2 status
pm2 status

# View PM2 logs
pm2 logs screencast

# Restart application
pm2 restart screencast

# Check Nginx status
systemctl status nginx

# Check system resources
htop
```

## 🔒 Security Considerations

### Current Setup
- Basic authentication with password
- Nginx security headers enabled
- Application runs in production mode
- PM2 process isolation

### Recommended Improvements
1. **SSH Key Authentication**: Replace password with SSH keys
2. **Firewall**: Configure UFW to limit access
3. **SSL Certificate**: Add HTTPS with Let's Encrypt
4. **Environment Variables**: Move sensitive data to env files

## 📈 Performance Optimization

### Current Optimizations
- **Gzip Compression**: Reduces bandwidth usage
- **Static File Caching**: Browser caching for assets
- **Memory Limits**: Prevents memory leaks
- **Single Process**: Efficient for small VPS

### Monitoring Metrics
- **Memory Usage**: Should stay under 200MB
- **CPU Usage**: Monitor for spikes
- **Response Time**: Should be under 500ms
- **Disk Space**: Monitor `/var/www/screencast`

## 🔄 CI/CD Workflow

### Development to Production
1. **Develop**: Make changes locally
2. **Test**: Ensure application builds and runs
3. **Deploy**: Run `./deploy.sh`
4. **Monitor**: Check status with `./monitor.sh status`
5. **Verify**: Test application functionality

### Rollback Process
If issues occur after deployment:
```bash
./deploy.sh --rollback
```

This will restore the previous working version automatically.

## 📞 Support

### Quick Commands Reference
```bash
# DNS and HTTPS Setup (First Time)
./check-dns.sh         # Check DNS configuration
./setup-https.sh        # Setup SSL certificate

# Deployment
./deploy.sh             # Deploy application
./deploy.sh --rollback  # Rollback to previous version

# Monitoring
./monitor.sh status     # Check status
./monitor.sh logs       # View logs
./monitor.sh restart    # Restart app
./monitor.sh monitor    # Live monitoring

# Manual VPS Commands
ssh root@143.198.50.21 'certbot certificates'  # Check SSL
ssh root@143.198.50.21 'nginx -t'              # Test Nginx config
ssh root@143.198.50.21 'systemctl status nginx' # Nginx status
```

### Log Locations
- **Deployment Logs**: Terminal output
- **Application Logs**: `/var/log/screencast.log`
- **Nginx Logs**: `/var/log/nginx/`
- **System Logs**: `/var/log/syslog`

---

**Note**: Always test deployments during low-traffic periods and have a rollback plan ready.
