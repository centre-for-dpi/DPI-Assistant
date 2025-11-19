# DPI Assistant - Docker Deployment Guide

This guide explains how to deploy the DPI Assistant using Docker.

## Overview

The DPI Assistant is a full-stack application consisting of a React frontend built with Vite and an Express.js backend. This Docker setup:
- Serves the frontend on port 3000
- Serves the backend API on port 8080
- Provides nginx proxy for API requests
- Maintains all security headers and compression settings

## Prerequisites

- Docker and Docker Compose installed
- Google AI API key
- AWS Cognito configuration (User Pool ID)

## Configuration

1. Copy the environment template:
```bash
cp .env.example .env
```

2. Edit `.env` and set the required values:
```bash
# Google AI Configuration (REQUIRED)
GOOGLE_AI_API_KEY=your_actual_google_ai_api_key

# AWS Cognito Configuration (REQUIRED)
AWS_REGION=ap-south-1
COGNITO_USER_POOL_ID=your_actual_cognito_user_pool_id
```

## Deployment

### Build and Start Services

From the `dpi-assistant` directory:

```bash
# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Check service status
docker-compose ps
```

### Accessing the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- Health checks:
  - Frontend: http://localhost:3000/health
  - Backend: http://localhost:8080/health

## Architecture

### Services

1. **Frontend Service**
   - Built from the DPI Assistant React/Vite application
   - Served via nginx on port 80 (mapped to host port 3000)
   - Proxies `/api/*` requests to the backend service
   - Includes health check endpoint at `/health`

2. **Backend Service**
   - Express.js backend with Google Generative AI integration
   - Runs on port 8080
   - Provides `/chat` and `/feedback` endpoints
   - Requires Google AI API key and AWS Cognito configuration

### Network

Both services communicate via the `dpi-sage-network` Docker bridge network.

## API Proxy Configuration

The nginx configuration proxies API requests:
- Frontend: `http://localhost:3000/api/chat` → Backend: `http://backend:8080/chat`
- Frontend: `http://localhost:3000/api/feedback` → Backend: `http://backend:8080/feedback`

This allows the frontend to make API calls to the same origin, avoiding CORS issues.

## Managing Services

### Stop Services
```bash
docker-compose down
```

### Rebuild After Changes
```bash
docker-compose up -d --build
```

### View Logs
```bash
# All services
docker-compose logs -f

# Frontend only
docker-compose logs -f frontend

# Backend only
docker-compose logs -f backend
```

### Restart Services
```bash
# All services
docker-compose restart

# Specific service
docker-compose restart frontend
```

## Troubleshooting

### Frontend Not Loading
1. Check if the service is running: `docker-compose ps`
2. Check logs: `docker-compose logs frontend`
3. Verify health check: `curl http://localhost:3000/health`

### API Requests Failing
1. Check backend is running: `docker-compose ps`
2. Check backend logs: `docker-compose logs backend`
3. Verify backend health: `curl http://localhost:8080/health`
4. Ensure environment variables are set correctly in `.env`

### Port Conflicts
If port 3000 or 8080 is already in use:
1. Stop any existing services using these ports
2. Or modify the port mappings in `docker-compose.yml`

## Security Notes

- Never commit the `.env` file with actual credentials
- Use strong, unique values for all API keys and credentials
- Regularly update dependencies for security patches
- Consider using Docker secrets for production deployments

## Production Considerations

For production deployments:
1. Use environment-specific `.env` files
2. Enable HTTPS with proper SSL certificates
3. Configure proper CORS policies
4. Set up log rotation and monitoring
5. Use Docker secrets for sensitive data
6. Consider using a reverse proxy (e.g., Traefik, Nginx) in front of the services
7. Implement backup and disaster recovery procedures
