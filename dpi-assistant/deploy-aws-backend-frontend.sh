#!/bin/bash

# DPI Assistant AWS EC2 Deployment Script - Backend & Frontend Only
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Deploying Backend & Frontend to AWS EC2${NC}"

# Check for required environment variables
if [ -z "$GOOGLE_AI_API_KEY" ]; then
    echo -e "${RED}❌ GOOGLE_AI_API_KEY environment variable is required${NC}"
    echo "Please set it in your .env file or export it:"
    echo "  export GOOGLE_AI_API_KEY=your_key_here"
    exit 1
fi

# Load .env file if it exists
if [ -f .env ]; then
    echo -e "${YELLOW}📋 Loading environment variables from .env file...${NC}"
    set -a
    source .env
    set +a
fi

# Get the EC2 instance IP from user input
read -p "Enter your EC2 instance IP address: " EC2_IP
read -p "Enter your SSH key file path: " SSH_KEY_PATH

if [ -z "$EC2_IP" ] || [ -z "$SSH_KEY_PATH" ]; then
    echo -e "${RED}❌ EC2 IP and SSH key path are required${NC}"
    exit 1
fi

# Check if SSH key exists
if [ ! -f "$SSH_KEY_PATH" ]; then
    echo -e "${RED}❌ SSH key file not found: $SSH_KEY_PATH${NC}"
    exit 1
fi

echo -e "${YELLOW}🔨 Building Backend and Frontend Docker images for amd64 architecture (no cache)...${NC}"

# Build backend from dpi-assistant/backend
echo -e "${YELLOW}Building backend (with vector search)...${NC}"
docker build --no-cache --platform linux/amd64 -t dpi-assistant-backend ./backend

# Build frontend from dpi-assistant
echo -e "${YELLOW}Building frontend...${NC}"
docker build --no-cache --platform linux/amd64 -t dpi-assistant-frontend .

echo -e "${YELLOW}💾 Saving Docker images...${NC}"
docker save dpi-assistant-backend | gzip > dpi-assistant-backend.tar.gz
docker save dpi-assistant-frontend | gzip > dpi-assistant-frontend.tar.gz

echo -e "${YELLOW}📤 Uploading files to EC2...${NC}"

# Create .env file for EC2
cat > .env.prod << EOF
GOOGLE_AI_API_KEY=${GOOGLE_AI_API_KEY}
NODE_ENV=production
PORT=8080
EOF

# Create update script for EC2
cat > update-backend-frontend.sh << 'UPDATE_EOF'
#!/bin/bash
set -e

echo "🔧 Updating Backend and Frontend on EC2..."

# Move files to app directory
cd /home/ubuntu/dpi-assistant || exit 1

# Load new images
echo "📦 Loading new Docker images..."
docker load < /home/ubuntu/dpi-assistant-backend.tar.gz
docker load < /home/ubuntu/dpi-assistant-frontend.tar.gz

# Update environment variables if provided
if [ -f /home/ubuntu/.env.prod ]; then
    mv /home/ubuntu/.env.prod /home/ubuntu/dpi-assistant/.env
fi

echo "🔄 Restarting backend and frontend services..."
docker-compose -f docker-compose.prod.yml stop backend frontend
docker-compose -f docker-compose.prod.yml rm -f backend frontend
docker-compose -f docker-compose.prod.yml up -d backend frontend

echo "⏳ Waiting for services to be healthy..."
sleep 20

echo "📊 Checking service status..."
docker-compose -f docker-compose.prod.yml ps

echo "✅ Backend and Frontend update completed!"
echo "🌐 Application should be available at: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"
UPDATE_EOF

chmod +x update-backend-frontend.sh

# Upload files to EC2 with compression and keep-alive
echo -e "${YELLOW}📂 Copying files to EC2...${NC}"
scp -o ServerAliveInterval=60 -o ServerAliveCountMax=120 -o Compression=yes -i "$SSH_KEY_PATH" dpi-assistant-backend.tar.gz ubuntu@$EC2_IP:/home/ubuntu/
scp -o ServerAliveInterval=60 -o ServerAliveCountMax=120 -o Compression=yes -i "$SSH_KEY_PATH" dpi-assistant-frontend.tar.gz ubuntu@$EC2_IP:/home/ubuntu/
scp -o ServerAliveInterval=60 -i "$SSH_KEY_PATH" .env.prod ubuntu@$EC2_IP:/home/ubuntu/
scp -o ServerAliveInterval=60 -i "$SSH_KEY_PATH" update-backend-frontend.sh ubuntu@$EC2_IP:/home/ubuntu/

# Run update on EC2
echo -e "${YELLOW}⚙️  Running update on EC2...${NC}"
ssh -o ServerAliveInterval=60 -i "$SSH_KEY_PATH" ubuntu@$EC2_IP 'bash update-backend-frontend.sh'

# Cleanup local files
echo -e "${YELLOW}🧹 Cleaning up local files...${NC}"
rm -f dpi-assistant-backend.tar.gz dpi-assistant-frontend.tar.gz update-backend-frontend.sh .env.prod

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo ""
echo -e "${GREEN}📋 Deployment Summary:${NC}"
echo "  EC2 Instance: $EC2_IP"
echo "  Application URL: http://$EC2_IP"
echo "  API URL: http://$EC2_IP:8080"
echo ""
echo -e "${YELLOW}ℹ️  To check the application status:${NC}"
echo "  ssh -i $SSH_KEY_PATH ubuntu@$EC2_IP 'cd /home/ubuntu/dpi-assistant && docker-compose -f docker-compose.prod.yml ps'"
echo ""
echo -e "${YELLOW}ℹ️  To view logs:${NC}"
echo "  ssh -i $SSH_KEY_PATH ubuntu@$EC2_IP 'cd /home/ubuntu/dpi-assistant && docker-compose -f docker-compose.prod.yml logs -f backend frontend'"
