# Multi-stage build for production
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies for canvas and other native modules
RUN apk add --no-cache python3 make g++ cairo-dev jpeg-dev pango-dev giflib-dev

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY src ./src
COPY content ./content

# Build TypeScript
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install build and runtime dependencies for canvas and curl for health checks
RUN apk add --no-cache curl python3 make g++ cairo cairo-dev jpeg jpeg-dev pango pango-dev giflib giflib-dev

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built application from builder
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/content ./content

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

# Run the application
CMD ["node", "lib/server.js"]
