# Multi-stage build for production optimization
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci --silent

# Copy application files
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS production

# Add metadata labels
LABEL maintainer="${MAINTAINER_EMAIL:-your-email@example.com}"
LABEL project="${APP_NAME:-astro-app}"
LABEL version="${VERSION:-1.0.0}"
LABEL description="Astro fyrstikken application"

# Install necessary packages and create non-root user
RUN apk add --no-cache wget curl && \
    addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

# Set working directory
WORKDIR /app

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm ci --only=production --silent

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/astro.config.mjs ./
COPY --from=builder /app/sanity.config.ts ./

# Change ownership to non-root user
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose port (Astro preview runs on 4321 by default)
EXPOSE ${APP_PORT:-4321}

# Add health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:${APP_PORT:-4321} || exit 1

# Default command - run Astro preview
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "${APP_PORT:-4321}"]