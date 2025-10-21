#!/bin/bash

# Health Check Script for DPI Sage Deployment
set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
EC2_IP=${1:-"localhost"}
FRONTEND_PORT=80
BACKEND_PORT=8080

echo -e "${YELLOW}🔍 Checking DPI Sage deployment health...${NC}"
echo "Target: $EC2_IP"
echo ""

# Check frontend health
echo -n "Frontend (port $FRONTEND_PORT): "
if curl -f -s "http://$EC2_IP:$FRONTEND_PORT/health" > /dev/null; then
    echo -e "${GREEN}✅ Healthy${NC}"
    FRONTEND_STATUS="OK"
else
    echo -e "${RED}❌ Unhealthy${NC}"
    FRONTEND_STATUS="FAIL"
fi

# Check backend health
echo -n "Backend (port $BACKEND_PORT): "
if curl -f -s "http://$EC2_IP:$BACKEND_PORT/health" > /dev/null; then
    echo -e "${GREEN}✅ Healthy${NC}"
    BACKEND_STATUS="OK"
else
    echo -e "${RED}❌ Unhealthy${NC}"
    BACKEND_STATUS="FAIL"
fi

echo ""
echo -e "${YELLOW}📊 Summary:${NC}"
echo "  Frontend: $FRONTEND_STATUS"
echo "  Backend: $BACKEND_STATUS"

if [ "$FRONTEND_STATUS" = "OK" ] && [ "$BACKEND_STATUS" = "OK" ]; then
    echo ""
    echo -e "${GREEN}🎉 All services are healthy!${NC}"
    echo "  Application URL: http://$EC2_IP"
    echo "  API URL: http://$EC2_IP:$BACKEND_PORT"
    exit 0
else
    echo ""
    echo -e "${RED}⚠️  Some services are unhealthy. Check the logs for details.${NC}"
    exit 1
fi