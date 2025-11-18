# Automated Deployment to AWS EC2

This project uses GitHub Actions to automatically deploy to AWS EC2 whenever code is pushed to the `main` branch.

## Prerequisites

1. **AWS EC2 Instance**: You need a running EC2 instance with:
   - Ubuntu 20.04 or later
   - Docker and Docker Compose installed
   - Security groups allowing inbound traffic on ports 80, 443, and 8080
   - SSH access enabled

2. **GitHub Repository Secrets**: Configure the following secrets in your GitHub repository

## Setting Up GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

Add the following secrets:

### Required Secrets

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `EC2_IP` | Your EC2 instance public IP address | `1.2.3.4` |
| `EC2_SSH_KEY` | Your EC2 SSH private key (entire content) | Contents of your `.pem` file |
| `GOOGLE_AI_API_KEY` | Google AI API key for the backend | `AIzaSyD...` |

### How to Add Secrets

#### 1. EC2_IP
```
Value: YOUR_EC2_IP_ADDRESS
```

#### 2. EC2_SSH_KEY
Copy the entire contents of your `.pem` file:
```bash
cat /path/to/your-key.pem
```

Then paste the entire output (including `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----`) into the secret value.

#### 3. GOOGLE_AI_API_KEY
```
Value: YOUR_GOOGLE_AI_API_KEY
```

## Initial EC2 Setup

Before the first deployment, you need to set up your EC2 instance:

### 1. SSH into your EC2 instance
```bash
ssh -i /path/to/your-key.pem ubuntu@YOUR_EC2_IP
```

### 2. Install Docker
```bash
# Update package list
sudo apt-get update -y

# Install Docker
sudo apt-get install -y docker.io

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add ubuntu user to docker group
sudo usermod -a -G docker ubuntu

# Log out and log back in for group changes to take effect
exit
```

### 3. Install Docker Compose
```bash
# SSH back into EC2
ssh -i /path/to/your-key.pem ubuntu@YOUR_EC2_IP

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

### 4. Copy nginx configuration (if not already present)
```bash
# Exit EC2
exit

# From your local machine, copy nginx.conf to EC2
scp -i /path/to/your-key.pem dpi-assistant/nginx.conf ubuntu@YOUR_EC2_IP:/home/ubuntu/
```

### 5. Set up nginx.conf on EC2
```bash
# SSH back in
ssh -i /path/to/your-key.pem ubuntu@YOUR_EC2_IP

# Create dpi-assistant directory
mkdir -p /home/ubuntu/dpi-assistant

# Move nginx.conf to the app directory
mv /home/ubuntu/nginx.conf /home/ubuntu/dpi-assistant/
```

## How Deployment Works

### Pull Request Validation
When you open or update a pull request targeting `main`, GitHub Actions will:

1. Build all Docker images (Qdrant, Backend, Frontend)
2. Validate that builds complete successfully
3. **Does NOT deploy** - only validates builds

This catches build errors before merging, ensuring the main branch stays healthy.

### Automatic Deployment (Merge to Main)
When a pull request is merged to `main`, GitHub Actions will:

1. Build Docker images for:
   - Qdrant (vector database)
   - Backend (Node.js API)
   - Frontend (React/Vite)

2. Compress and upload images to EC2

3. SSH into EC2 and:
   - Load the new Docker images
   - Stop existing containers
   - Start new containers with updated code
   - Verify deployment

### Manual Deployment
You can also trigger deployment manually:

1. Go to your GitHub repository
2. Click on "Actions" tab
3. Select "Deploy to AWS EC2" workflow
4. Click "Run workflow"
5. Select the `main` branch
6. Click "Run workflow"

## Monitoring Deployment

### View GitHub Actions Logs
1. Go to the "Actions" tab in your repository
2. Click on the latest workflow run
3. Click on the "Build and Deploy to EC2" job to see detailed logs

### Check Deployment on EC2
```bash
# SSH into EC2
ssh -i /path/to/your-key.pem ubuntu@YOUR_EC2_IP

# Check running containers
cd /home/ubuntu/dpi-assistant
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# View specific service logs
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
```

## Cost Optimization

This deployment setup is designed to be **low to no cost**:

### GitHub Actions Free Tier
- **Public repositories**: Unlimited minutes
- **Private repositories**: 2,000 minutes/month free

### Cost-Saving Features
1. **Docker layer caching**: Reduces build time significantly after the first build
2. **Efficient builds**: Only changed layers are rebuilt
3. **Compressed image transfer**: Gzip compression for faster uploads

### Estimated GitHub Actions Usage
- **PR validation** (build only): ~5-8 minutes per PR
- **First deployment**: ~10-15 minutes
- **Subsequent deployments**: ~5-8 minutes (thanks to caching)
- **Example monthly usage**:
  - 8 PRs × 6 minutes = 48 minutes
  - 4 deployments × 6 minutes = 24 minutes
  - **Total: ~72 minutes/month**
- **Well within free tier limits** (2,000 minutes for private repos, unlimited for public repos)

## Troubleshooting

### PR Build Validation Fails
If the build fails on a pull request:
- Check the GitHub Actions logs for specific build errors
- Common issues:
  - Missing dependencies in package.json
  - TypeScript compilation errors
  - Docker build context issues
- Fix the errors and push again - the validation will re-run automatically

### Deployment Fails with SSH Connection Error
- Verify EC2_IP secret is correct
- Ensure EC2_SSH_KEY secret contains the complete private key
- Check EC2 security groups allow SSH (port 22) from GitHub Actions IPs

### Deployment Succeeds but Application Not Accessible
- Check EC2 security groups allow inbound traffic on ports 80, 443, and 8080
- Verify containers are running: `docker-compose -f docker-compose.prod.yml ps`
- Check container logs for errors

### Vector Database Not Populated
The first deployment will attempt to populate the vector database. If it fails:

```bash
# SSH into EC2
ssh -i /path/to/your-key.pem ubuntu@YOUR_EC2_IP

# Manually populate vectors
cd /home/ubuntu/dpi-assistant
docker-compose -f docker-compose.prod.yml exec backend npm run populate-vectors
```

### Need to Redeploy Without Code Changes
Use the manual deployment option (workflow_dispatch) from the Actions tab.

## Security Best Practices

1. **Never commit secrets**: Always use GitHub Secrets for sensitive data
2. **Rotate SSH keys**: Periodically update your EC2 SSH key
3. **Limit SSH access**: Configure EC2 security groups to allow SSH only from necessary IPs
4. **Use HTTPS**: Set up SSL certificates for production (see SSL setup below)

## SSL/HTTPS Setup (Optional)

For production use with a domain name:

### 1. Point your domain to EC2
Update your DNS records to point your domain (e.g., `assistant.yourdomain.com`) to your EC2 IP address.

### 2. Install Certbot on EC2
```bash
ssh -i /path/to/your-key.pem ubuntu@YOUR_EC2_IP

# Install Certbot
sudo apt-get update
sudo apt-get install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d assistant.yourdomain.com

# Follow the prompts to obtain the certificate
```

### 3. Update nginx.conf
The nginx.conf in the repository is already configured for SSL. Once Certbot is installed and certificates are obtained, the deployment will automatically use HTTPS.

### 4. Auto-renewal
Certbot automatically sets up certificate renewal. Verify:
```bash
sudo certbot renew --dry-run
```

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Documentation](https://docs.docker.com/)
- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
