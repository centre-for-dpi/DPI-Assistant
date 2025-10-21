#!/bin/bash

# Simple DPI Sage AWS EC2 Deployment Script (without ECR)
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Simple DPI Sage deployment to AWS EC2${NC}"

# Check for required environment variables
if [ -z "$GOOGLE_AI_API_KEY" ]; then
    echo -e "${RED}❌ GOOGLE_AI_API_KEY environment variable is required${NC}"
    echo "Please set it in your .env file or export it:"
    echo "  export GOOGLE_AI_API_KEY=your_key_here"
    exit 1
fi

if [ -z "$COGNITO_USER_POOL_ID" ]; then
    echo -e "${RED}❌ COGNITO_USER_POOL_ID environment variable is required${NC}"
    echo "Please set it in your .env file or export it:"
    echo "  export COGNITO_USER_POOL_ID=your_pool_id"
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
docker build --no-cache --platform linux/amd64 -t dpi-sage-frontend .
docker build --no-cache --platform linux/amd64 -f Dockerfile.backend -t dpi-sage-backend .

echo -e "${YELLOW}💾 Saving Docker images...${NC}"
docker save dpi-sage-frontend | gzip > dpi-sage-frontend.tar.gz
docker save dpi-sage-backend | gzip > dpi-sage-backend.tar.gz

echo -e "${YELLOW}📤 Uploading files to EC2...${NC}"

# Create deployment package
cat > docker-compose.prod.yml << 'EOF'
version: '3.8'

services:
  frontend:
    image: dpi-sage-frontend:latest
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    depends_on:
      - backend

  backend:
    image: dpi-sage-backend:latest
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=production
      - PORT=8080
      - GOOGLE_AI_API_KEY=\${GOOGLE_AI_API_KEY}
      - AWS_REGION=\${AWS_REGION:-ap-south-1}
      - COGNITO_USER_POOL_ID=\${COGNITO_USER_POOL_ID}
    restart: unless-stopped

networks:
  default:
    name: dpi-sage-network
EOF

# Create setup script for EC2
cat > setup-ec2.sh << 'EOF'
#!/bin/bash
set -e

echo "🔧 Setting up DPI Sage on EC2..."

# Update system
sudo apt-get update -y

# Install Docker
sudo apt-get install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -a -G docker ubuntu

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Move files to app directory
mkdir -p /home/ubuntu/dpi-sage
mv /home/ubuntu/dpi-sage-*.tar.gz /home/ubuntu/dpi-sage/
mv /home/ubuntu/docker-compose.prod.yml /home/ubuntu/dpi-sage/
cd /home/ubuntu/dpi-sage

echo "📦 Loading Docker images..."
docker load < dpi-sage-frontend.tar.gz
docker load < dpi-sage-backend.tar.gz

echo "🚀 Starting application..."
docker-compose -f docker-compose.prod.yml up -d

echo "✅ DPI Sage deployment completed!"
echo "🌐 Application should be available at: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"
EOF

chmod +x setup-ec2.sh

# Upload files to EC2
echo -e "${YELLOW}📂 Copying files to EC2...${NC}"
scp -i "$SSH_KEY_PATH" dpi-sage-frontend.tar.gz ubuntu@$EC2_IP:/home/ubuntu/
scp -i "$SSH_KEY_PATH" dpi-sage-backend.tar.gz ubuntu@$EC2_IP:/home/ubuntu/
scp -i "$SSH_KEY_PATH" docker-compose.prod.yml ubuntu@$EC2_IP:/home/ubuntu/
scp -i "$SSH_KEY_PATH" setup-ec2.sh ubuntu@$EC2_IP:/home/ubuntu/

# Run setup on EC2
echo -e "${YELLOW}⚙️  Running setup on EC2...${NC}"
ssh -i "$SSH_KEY_PATH" ubuntu@$EC2_IP 'bash setup-ec2.sh'

# Cleanup local files
echo -e "${YELLOW}🧹 Cleaning up local files...${NC}"
rm -f dpi-sage-frontend.tar.gz dpi-sage-backend.tar.gz setup-ec2.sh docker-compose.prod.yml

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo ""
echo -e "${GREEN}📋 Deployment Summary:${NC}"
echo "  EC2 Instance: $EC2_IP"
echo "  Application URL: http://$EC2_IP"
echo "  API URL: http://$EC2_IP:8080"
echo ""
echo -e "${YELLOW}ℹ️  To check the application status:${NC}"
echo "  ssh -i $SSH_KEY_PATH ec2-user@$EC2_IP 'docker-compose -f /home/ec2-user/dpi-sage/docker-compose.prod.yml ps'"
echo ""
echo -e "${YELLOW}ℹ️  To view logs:${NC}"
echo "  ssh -i $SSH_KEY_PATH ec2-user@$EC2_IP 'docker-compose -f /home/ec2-user/dpi-sage/docker-compose.prod.yml logs -f'"