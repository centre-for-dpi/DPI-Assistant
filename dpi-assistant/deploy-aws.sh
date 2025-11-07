#!/bin/bash

# DPI Assistant AWS EC2 Deployment Script
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Simple DPI Assistant deployment to AWS EC2${NC}"

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

echo -e "${YELLOW}🔨 Building Docker images for amd64 architecture (no cache)...${NC}"

# Build frontend from dpi-assistant
echo -e "${YELLOW}Building frontend...${NC}"
docker build --no-cache --platform linux/amd64 -t dpi-assistant-frontend .

# Build backend from dpi-assistant/backend (no auth required)
echo -e "${YELLOW}Building backend (no authentication)...${NC}"
docker build --no-cache --platform linux/amd64 -t dpi-assistant-backend ./backend

echo -e "${YELLOW}💾 Saving Docker images...${NC}"
docker save dpi-assistant-frontend | gzip > dpi-assistant-frontend.tar.gz
docker save dpi-assistant-backend | gzip > dpi-assistant-backend.tar.gz

echo -e "${YELLOW}📤 Uploading files to EC2...${NC}"

# Create .env file for EC2
cat > .env.prod << EOF
GOOGLE_AI_API_KEY=${GOOGLE_AI_API_KEY}
NODE_ENV=production
PORT=8080
EOF

# Create setup script for EC2
cat > setup-ec2.sh << 'SETUP_EOF'
#!/bin/bash
set -e

echo "🔧 Setting up DPI Assistant on EC2..."

# Update system
sudo apt-get update -y

# Install Docker if not already installed
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    sudo apt-get install -y docker.io
    sudo systemctl start docker
    sudo systemctl enable docker
    sudo usermod -a -G docker ubuntu
fi

# Install Docker Compose if not already installed
if ! command -v docker-compose &> /dev/null; then
    echo "Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# Create app directory
sudo mkdir -p /home/ubuntu/dpi-assistant
sudo chown -R ubuntu:ubuntu /home/ubuntu/dpi-assistant

# Move files to app directory
mv /home/ubuntu/dpi-assistant-*.tar.gz /home/ubuntu/dpi-assistant/ || true
mv /home/ubuntu/docker-compose.prod.yml /home/ubuntu/dpi-assistant/ || true
mv /home/ubuntu/.env.prod /home/ubuntu/dpi-assistant/.env || true
mv /home/ubuntu/nginx.conf /home/ubuntu/dpi-assistant/ || true
cd /home/ubuntu/dpi-assistant

# Stop existing containers
docker-compose -f docker-compose.prod.yml down 2>/dev/null || true

echo "📦 Loading Docker images..."
docker load < dpi-assistant-frontend.tar.gz
docker load < dpi-assistant-backend.tar.gz

echo "🚀 Starting application..."
docker-compose -f docker-compose.prod.yml up -d

echo "✅ DPI Assistant deployment completed!"
echo "🌐 Application should be available at: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"
echo ""
echo "Note: For HTTPS, you need to set up SSL certificates. See the documentation for details."
SETUP_EOF

chmod +x setup-ec2.sh

# Upload files to EC2
echo -e "${YELLOW}📂 Copying files to EC2...${NC}"
scp -i "$SSH_KEY_PATH" dpi-assistant-frontend.tar.gz ubuntu@$EC2_IP:/home/ubuntu/
scp -i "$SSH_KEY_PATH" dpi-assistant-backend.tar.gz ubuntu@$EC2_IP:/home/ubuntu/
scp -i "$SSH_KEY_PATH" docker-compose.prod.yml ubuntu@$EC2_IP:/home/ubuntu/
scp -i "$SSH_KEY_PATH" .env.prod ubuntu@$EC2_IP:/home/ubuntu/
scp -i "$SSH_KEY_PATH" nginx.conf ubuntu@$EC2_IP:/home/ubuntu/
scp -i "$SSH_KEY_PATH" setup-ec2.sh ubuntu@$EC2_IP:/home/ubuntu/

# Run setup on EC2
echo -e "${YELLOW}⚙️  Running setup on EC2...${NC}"
ssh -i "$SSH_KEY_PATH" ubuntu@$EC2_IP 'bash setup-ec2.sh'

# Cleanup local files
echo -e "${YELLOW}🧹 Cleaning up local files...${NC}"
rm -f dpi-assistant-frontend.tar.gz dpi-assistant-backend.tar.gz setup-ec2.sh .env.prod

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
echo "  ssh -i $SSH_KEY_PATH ubuntu@$EC2_IP 'cd /home/ubuntu/dpi-assistant && docker-compose -f docker-compose.prod.yml logs -f'"
echo ""
echo -e "${YELLOW}⚠️  For HTTPS setup (SSL certificates):${NC}"
echo "  1. Point your domain (assistant.cdpi.dev) to $EC2_IP"
echo "  2. SSH into the server and run: sudo certbot --nginx -d assistant.cdpi.dev"
echo "  3. Follow the prompts to obtain SSL certificates"
echo "  4. The nginx.conf is already configured for SSL"
