# Backend API Server for DPI Assistant (No Authentication)
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy backend package.json
COPY package*.json ./
RUN npm ci

# Build stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build TypeScript to JavaScript
RUN npm run build

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Copy built application and dependencies
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/node_modules ./node_modules

# Copy content from studio functions
COPY --from=builder /app/content ./content

USER nodejs

EXPOSE 8080

CMD ["node", "lib/server.js"]
