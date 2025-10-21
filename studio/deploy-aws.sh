#!/bin/bash

# DPI Sage AWS EC2 Deployment Script
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="dpi-sage"
AWS_REGION="${AWS_REGION:-us-east-1}"
INSTANCE_TYPE="${EC2_INSTANCE_TYPE:-t3.medium}"
KEY_PAIR_NAME="${EC2_KEY_PAIR_NAME}"
SECURITY_GROUP_ID="${SECURITY_GROUP_ID}"
SUBNET_ID="${SUBNET_ID}"

echo -e "${GREEN}🚀 Starting DPI Sage deployment to AWS EC2${NC}"

# Load .env file if it exists
if [ -f .env ]; then
    echo -e "${YELLOW}📋 Loading environment variables from .env file...${NC}"
    set -a
    source .env
    set +a
fi

# Check required environment variables
MISSING_VARS=()

if [ -z "$GOOGLE_AI_API_KEY" ]; then
    MISSING_VARS+=("GOOGLE_AI_API_KEY")
fi

if [ -z "$COGNITO_USER_POOL_ID" ]; then
    MISSING_VARS+=("COGNITO_USER_POOL_ID")
fi

if [ -z "$KEY_PAIR_NAME" ]; then
    MISSING_VARS+=("EC2_KEY_PAIR_NAME")
fi

if [ -z "$SECURITY_GROUP_ID" ]; then
    MISSING_VARS+=("SECURITY_GROUP_ID")
fi

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    echo -e "${RED}❌ Missing required environment variables:${NC}"
    for var in "${MISSING_VARS[@]}"; do
        echo "  - $var"
    done
    echo ""
    echo "Please set these in your .env file or export them."
    exit 1
fi

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI is not installed. Please install it first.${NC}"
    exit 1
fi

# Check AWS credentials
echo -e "${YELLOW}🔍 Checking AWS credentials...${NC}"
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}❌ AWS credentials not configured. Please run 'aws configure'.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ AWS credentials verified${NC}"

# Build Docker images
echo -e "${YELLOW}🔨 Building Docker images...${NC}"
docker build -t $APP_NAME-frontend .
docker build -f Dockerfile.backend -t $APP_NAME-backend .

# Tag images for ECR (if using ECR)
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_REGISTRY="$ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"

echo -e "${YELLOW}🏷️  Tagging images for ECR...${NC}"
docker tag $APP_NAME-frontend:latest $ECR_REGISTRY/$APP_NAME-frontend:latest
docker tag $APP_NAME-backend:latest $ECR_REGISTRY/$APP_NAME-backend:latest

# Create ECR repositories if they don't exist
echo -e "${YELLOW}📦 Creating ECR repositories...${NC}"
aws ecr describe-repositories --repository-names $APP_NAME-frontend --region $AWS_REGION 2>/dev/null || \
    aws ecr create-repository --repository-name $APP_NAME-frontend --region $AWS_REGION

aws ecr describe-repositories --repository-names $APP_NAME-backend --region $AWS_REGION 2>/dev/null || \
    aws ecr create-repository --repository-name $APP_NAME-backend --region $AWS_REGION

# Login to ECR
echo -e "${YELLOW}🔐 Logging in to ECR...${NC}"
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REGISTRY

# Push images to ECR
echo -e "${YELLOW}📤 Pushing images to ECR...${NC}"
docker push $ECR_REGISTRY/$APP_NAME-frontend:latest
docker push $ECR_REGISTRY/$APP_NAME-backend:latest

# Create user data script for EC2
cat > user-data.sh << 'EOF'
#!/bin/bash
yum update -y
yum install -y docker

# Start Docker service
systemctl start docker
systemctl enable docker
usermod -a -G docker ec2-user

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

# Install AWS CLI v2
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
./aws/install

# Create application directory
mkdir -p /home/ec2-user/dpi-sage
cd /home/ec2-user/dpi-sage

# Download docker-compose file
cat > docker-compose.prod.yml << 'COMPOSE_EOF'
version: '3.8'

services:
  frontend:
    image: ACCOUNT_ID.dkr.ecr.AWS_REGION.amazonaws.com/dpi-sage-frontend:latest
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  backend:
    image: ACCOUNT_ID.dkr.ecr.AWS_REGION.amazonaws.com/dpi-sage-backend:latest
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=production
      - PORT=8080
      - GOOGLE_AI_API_KEY=GOOGLE_AI_API_KEY_VALUE
      - AWS_REGION=AWS_REGION_VALUE
      - COGNITO_USER_POOL_ID=COGNITO_USER_POOL_ID_VALUE
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3

networks:
  default:
    name: dpi-sage-network
COMPOSE_EOF

# Set proper ownership
chown -R ec2-user:ec2-user /home/ec2-user/dpi-sage

EOF

# Replace placeholders in user data
sed -i "s/ACCOUNT_ID/$ACCOUNT_ID/g" user-data.sh
sed -i "s/AWS_REGION_VALUE/$AWS_REGION/g" user-data.sh
sed -i "s/GOOGLE_AI_API_KEY_VALUE/${GOOGLE_AI_API_KEY}/g" user-data.sh
sed -i "s/COGNITO_USER_POOL_ID_VALUE/${COGNITO_USER_POOL_ID}/g" user-data.sh

# Launch EC2 instance
echo -e "${YELLOW}🖥️  Launching EC2 instance...${NC}"

SUBNET_PARAM=""
if [ -n "$SUBNET_ID" ]; then
    SUBNET_PARAM="--subnet-id $SUBNET_ID"
fi

INSTANCE_ID=$(aws ec2 run-instances \
    --image-id ami-0abcdef1234567890 \
    --count 1 \
    --instance-type $INSTANCE_TYPE \
    --key-name $KEY_PAIR_NAME \
    --security-group-ids $SECURITY_GROUP_ID \
    $SUBNET_PARAM \
    --associate-public-ip-address \
    --user-data file://user-data.sh \
    --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=$APP_NAME-instance},{Key=Application,Value=$APP_NAME}]" \
    --query 'Instances[0].InstanceId' \
    --output text \
    --region $AWS_REGION)

echo -e "${GREEN}✅ EC2 instance launched: $INSTANCE_ID${NC}"

# Wait for instance to be running
echo -e "${YELLOW}⏳ Waiting for instance to be running...${NC}"
aws ec2 wait instance-running --instance-ids $INSTANCE_ID --region $AWS_REGION

# Get public IP
PUBLIC_IP=$(aws ec2 describe-instances \
    --instance-ids $INSTANCE_ID \
    --query 'Reservations[0].Instances[0].PublicIpAddress' \
    --output text \
    --region $AWS_REGION)

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo ""
echo -e "${GREEN}📋 Deployment Summary:${NC}"
echo "  Instance ID: $INSTANCE_ID"
echo "  Public IP: $PUBLIC_IP"
echo "  Application URL: http://$PUBLIC_IP"
echo "  API URL: http://$PUBLIC_IP:8080"
echo ""
echo -e "${YELLOW}⚠️  Note: It may take a few minutes for the application to start.${NC}"
echo -e "${YELLOW}   You can check the startup progress by SSHing into the instance:${NC}"
echo "   ssh -i your-key.pem ec2-user@$PUBLIC_IP"
echo ""

# Cleanup
rm -f user-data.sh

echo -e "${GREEN}🚀 Deployment script completed!${NC}"