# KindleCast Deployment

Automated deployment using GitHub Actions.

## How it works

Every push to `main` or `master` branch automatically triggers deployment to the VPS.

## GitHub Actions Workflow

The workflow (`.github/workflows/deploy.yml`) does:

1. **Checkout code** from the repository
2. **Setup Node.js** environment
3. **Install dependencies** locally for validation
4. **Deploy to VPS**:
   - Copy source code (excluding node_modules, .next, etc.)
   - Install fresh dependencies on server
   - Restart the dev server using PM2
5. **Health check** to ensure deployment succeeded

## VPS Configuration

- **Server**: 143.198.50.21
- **Directory**: /var/www/kindlecast
- **Process Manager**: PM2
- **Mode**: Development server (`npm run dev`)

## Manual Operations

If you need to manually check the server:

```bash
# SSH into VPS
ssh root@143.198.50.21

# Check PM2 status
pm2 status

# View logs
pm2 logs kindlecast

# Restart if needed
pm2 restart kindlecast
```

## No Manual Deployment Needed

Just push to main/master and GitHub Actions handles everything automatically!
