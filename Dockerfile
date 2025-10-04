###############################################
# Dockerfile for NestJS (pnpm, multi-stage)
# - Small alpine image
# - Installs dev deps in builder, prod deps in runner
# - Runs as non-root user
###############################################

# ----- Builder -----
FROM node:20-alpine AS builder

WORKDIR /app

# System deps for native modules (e.g., bcrypt)
RUN apk add --no-cache python3 make g++

# Install pnpm globally
RUN npm i -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (including dev dependencies for build)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# ----- Runner -----
FROM node:20-alpine AS runner

WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# JWT Configuration
ENV JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
ENV JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key-change-this-in-production
ENV JWT_EXPIRES_IN=15m
ENV JWT_REFRESH_EXPIRES_IN=7d

# Database Configuration (default values)
ENV DB_HOST=localhost
ENV DB_PORT=5432
ENV DB_USERNAME=postgres
ENV DB_PASSWORD=password
ENV DB_DATABASE=auth_db

# Mail Configuration (default values)
ENV MAIL_HOST=smtp.gmail.com
ENV MAIL_PORT=587
ENV MAIL_USER=your-email@gmail.com
ENV MAIL_PASS=your-app-password

# Install minimal tools for proper signal handling and healthcheck
RUN apk add --no-cache dumb-init curl

# Install pnpm globally
RUN npm i -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile && pnpm store prune

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Change ownership of the app directory
RUN chown -R nestjs:nodejs /app
USER nestjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:${PORT}/health || exit 1

# Start the application
CMD ["dumb-init", "node", "dist/src/main.js"]
