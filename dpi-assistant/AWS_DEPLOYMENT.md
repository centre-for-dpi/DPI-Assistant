# DPI Assistant - AWS EC2 Deployment Guide

This guide explains how to deploy the DPI Assistant frontend and backend to AWS EC2, replacing the existing Studio frontend.

## Overview

The DPI Assistant deployment consists of:
- **Frontend**: React + Vite application served via Nginx (port 80/443)
- **Backend**: Node.js/Express API without authentication (port 8080)
- Both services deployed as Docker containers on EC2

## Key Changes from Studio

1. **Frontend**: New React/Vite UI (dpi-assistant) replaces Next.js Studio frontend
2. **Backend**: Authentication removed - API endpoints are publicly accessible
3. **SSL**: Configured for existing Let's Encrypt certificates at assistant.cdpi.dev
4. **Ports**: Same as Studio - Frontend on 80/443, Backend on 8080

## Prerequisites

- AWS EC2 instance (Ubuntu, t3.medium or higher recommended)
- SSH access to EC2 instance
- Docker installed on local machine
- EC2 Security Group configured:
  - Port 22 (SSH)
  - Port 80 (HTTP)
  - Port 443 (HTTPS)
  - Port 8080 (Backend API)
- Google AI API Key
- Domain pointing to EC2 IP: assistant.cdpi.dev
- Existing SSL certificates at /etc/letsencrypt/

## Configuration

### 1. Environment Variables

Edit the `.env` file in the `dpi-assistant` directory:

```bash
# API Configuration (leave empty for nginx proxy)
VITE_API_BASE_URL=

# Backend Environment Variables
GOOGLE_AI_API_KEY=your_google_ai_api_key_here
AWS_REGION=ap-south-1
```

**Important**: The backend no longer requires `COGNITO_USER_POOL_ID` as authentication has been removed.

### 2. Nginx Configuration

The `nginx.conf` file is configured for:
- HTTPS with SSL certificates at `/etc/letsencrypt/live/assistant.cdpi.dev/`
- HTTP to HTTPS redirect
- API proxy from `/api/chat` to `backend:8080/chat`
- API proxy from `/api/feedback` to `backend:8080/feedback`
- Static asset caching and gzip compression
- Health check endpoint at `/health`

## Deployment Methods

### Method 1: Automated Deployment (Recommended)

Use the deployment script to automate the entire process:

```bash
cd /Users/antoine/codeplay/cdpi_projects/DPI-Sage/dpi-assistant

# Make script executable (if not already)
chmod +x deploy-aws.sh

# Run deployment
./deploy-aws.sh
```

The script will:
1. Load environment variables from `.env`
2. Prompt for EC2 IP and SSH key path
3. Build Docker images for linux/amd64
4. Save and compress images
5. Upload to EC2
6. Install Docker and Docker Compose on EC2
7. Load images and start containers

### Method 2: Manual Deployment

#### Step 1: Build Images Locally

```bash
cd /Users/antoine/codeplay/cdpi_projects/DPI-Sage/dpi-assistant

# Build frontend
docker build --platform linux/amd64 -t dpi-assistant-frontend .

# Build backend (no auth)
docker build --platform linux/amd64 -t dpi-assistant-backend ./backend

# Save images
docker save dpi-assistant-frontend | gzip > dpi-assistant-frontend.tar.gz
docker save dpi-assistant-backend | gzip > dpi-assistant-backend.tar.gz
```

#### Step 2: Upload to EC2

```bash
# Set variables
EC2_IP="your.ec2.ip.address"
SSH_KEY="/path/to/your/key.pem"

# Upload files
scp -i $SSH_KEY dpi-assistant-frontend.tar.gz ubuntu@$EC2_IP:/home/ubuntu/
scp -i $SSH_KEY dpi-assistant-backend.tar.gz ubuntu@$EC2_IP:/home/ubuntu/
scp -i $SSH_KEY docker-compose.prod.yml ubuntu@$EC2_IP:/home/ubuntu/
scp -i $SSH_KEY nginx.conf ubuntu@$EC2_IP:/home/ubuntu/
scp -i $SSH_KEY .env ubuntu@$EC2_IP:/home/ubuntu/
```

#### Step 3: Deploy on EC2

SSH into your EC2 instance:

```bash
ssh -i $SSH_KEY ubuntu@$EC2_IP
```

Then run these commands on the EC2 instance:

```bash
# Install Docker (if not already installed)
sudo apt-get update
sudo apt-get install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -a -G docker ubuntu

# Install Docker Compose (if not already installed)
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Create app directory
mkdir -p /home/ubuntu/dpi-assistant
mv /home/ubuntu/*.tar.gz /home/ubuntu/dpi-assistant/
mv /home/ubuntu/docker-compose.prod.yml /home/ubuntu/dpi-assistant/
mv /home/ubuntu/nginx.conf /home/ubuntu/dpi-assistant/
mv /home/ubuntu/.env /home/ubuntu/dpi-assistant/

cd /home/ubuntu/dpi-assistant

# Stop existing containers (if any)
docker-compose -f docker-compose.prod.yml down

# Load Docker images
docker load < dpi-assistant-frontend.tar.gz
docker load < dpi-assistant-backend.tar.gz

# Start services
docker-compose -f docker-compose.prod.yml up -d
```

## Verification

### Check Container Status

```bash
cd /home/ubuntu/dpi-assistant
docker-compose -f docker-compose.prod.yml ps
```

Expected output shows both frontend and backend as "Up".

### Check Logs

```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Frontend only
docker-compose -f docker-compose.prod.yml logs -f frontend

# Backend only
docker-compose -f docker-compose.prod.yml logs -f backend
```

### Test Endpoints

```bash
# Health checks
curl http://localhost/health          # Frontend health
curl http://localhost:8080/health     # Backend health

# From external machine
curl https://assistant.cdpi.dev/health
curl https://assistant.cdpi.dev/api/chat -X POST \
  -H "Content-Type: application/json" \
  -d '{"message":"What is DPI?"}'
```

## SSL Certificate Management

The deployment uses existing SSL certificates at:
- Certificate: `/etc/letsencrypt/live/assistant.cdpi.dev/fullchain.pem`
- Private Key: `/etc/letsencrypt/live/assistant.cdpi.dev/privkey.pem`

### Certificate Renewal

Certificates should auto-renew via cron. To manually renew:

```bash
sudo certbot renew
docker-compose -f /home/ubuntu/dpi-assistant/docker-compose.prod.yml restart frontend
```

## Updating the Deployment

To update with new changes:

```bash
# On local machine
cd /Users/antoine/codeplay/cdpi_projects/DPI-Sage/dpi-assistant
./deploy-aws.sh

# Or manually rebuild and redeploy
docker build --platform linux/amd64 -t dpi-assistant-frontend .
docker build --platform linux/amd64 -t dpi-assistant-backend ./backend
# ... follow manual deployment steps
```

## Troubleshooting

### Frontend Not Accessible

1. Check container status: `docker-compose -f docker-compose.prod.yml ps`
2. Check logs: `docker-compose -f docker-compose.prod.yml logs frontend`
3. Verify nginx config: `docker exec -it dpi-assistant-frontend-1 cat /etc/nginx/conf.d/default.conf`
4. Check SSL certificates: `ls -la /etc/letsencrypt/live/assistant.cdpi.dev/`

### Backend API Errors

1. Check backend logs: `docker-compose -f docker-compose.prod.yml logs backend`
2. Verify Google AI API key: `docker exec -it dpi-assistant-backend-1 env | grep GOOGLE`
3. Test backend directly: `curl http://localhost:8080/health`
4. Check backend is running: `docker-compose -f docker-compose.prod.yml ps backend`

### Authentication Errors (Removed)

The backend no longer requires authentication. All API endpoints are publicly accessible. If you see authentication errors, ensure you're using the new backend image without auth middleware.

### SSL Certificate Issues

1. Verify certificates exist: `sudo ls -la /etc/letsencrypt/live/assistant.cdpi.dev/`
2. Check certificate validity: `sudo certbot certificates`
3. Ensure nginx can access certificates: Check volume mount in docker-compose.prod.yml
4. Test HTTPS: `curl -I https://assistant.cdpi.dev`

### Port Conflicts

If ports are already in use:
```bash
# Check what's using the ports
sudo netstat -tlnp | grep -E ':(80|443|8080)'

# Stop conflicting services
sudo systemctl stop nginx  # If nginx is running on host
docker stop $(docker ps -q)  # Stop all Docker containers
```

## Architecture

### Network Flow

```
Internet
  ↓
HTTPS (443) / HTTP (80)
  ↓
Nginx (Frontend Container)
  ↓
/api/* requests → Backend Container (8080)
  ↓
Google Gemini AI API
```

### File Structure on EC2

```
/home/ubuntu/dpi-assistant/
├── docker-compose.prod.yml
├── nginx.conf
├── .env
├── dpi-assistant-frontend.tar.gz
└── dpi-assistant-backend.tar.gz

/etc/letsencrypt/
└── live/assistant.cdpi.dev/
    ├── fullchain.pem
    └── privkey.pem
```

## Security Considerations

⚠️ **Important Security Notes:**

1. **No Authentication**: The backend API is publicly accessible without authentication
2. **API Key Protection**: Ensure GOOGLE_AI_API_KEY is kept secure
3. **Rate Limiting**: Consider implementing rate limiting for production
4. **HTTPS**: All traffic should use HTTPS (HTTP redirects to HTTPS)
5. **Firewall**: Ensure security groups restrict access appropriately

## Monitoring and Maintenance

### View Resource Usage

```bash
docker stats
```

### Cleanup Old Images

```bash
docker system prune -a
```

### Backup Environment

```bash
# Backup .env and docker-compose files
scp -i $SSH_KEY ubuntu@$EC2_IP:/home/ubuntu/dpi-assistant/.env ./backup/
scp -i $SSH_KEY ubuntu@$EC2_IP:/home/ubuntu/dpi-assistant/docker-compose.prod.yml ./backup/
```

## Cost Optimization

- Use spot instances for dev/staging
- Stop instances when not in use
- Use CloudWatch for monitoring
- Set up auto-scaling for production loads

## Support

For issues or questions:
1. Check logs: `docker-compose logs -f`
2. Verify configuration: Review `.env` and `nginx.conf`
3. Test connectivity: Use curl to test endpoints
4. Review this documentation

## Quick Reference

```bash
# Start services
docker-compose -f docker-compose.prod.yml up -d

# Stop services
docker-compose -f docker-compose.prod.yml down

# Restart services
docker-compose -f docker-compose.prod.yml restart

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Update and restart
./deploy-aws.sh

# Access URLs
# Frontend: https://assistant.cdpi.dev
# Backend: http://YOUR-EC2-IP:8080
```
