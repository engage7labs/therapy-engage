FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files
COPY apps/gateway/package*.json ./
RUN npm ci

# Copy source code
COPY apps/gateway/ ./

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /app

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Install production dependencies only
RUN npm ci --only=production && npm cache clean --force

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main.js"]
