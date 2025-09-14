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

# Install deps
COPY package.json pnpm-lock.yaml ./
RUN npm i -g pnpm && pnpm install --frozen-lockfile

# Build
COPY . .
RUN pnpm build


# ----- Runner -----
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Minimal tools for proper signal handling and healthcheck
RUN apk add --no-cache dumb-init wget

# Install only production deps
COPY package.json pnpm-lock.yaml ./
RUN npm i -g pnpm \
 && pnpm install --prod --frozen-lockfile \
 && pnpm store prune

# Copy build output
COPY --from=builder /app/dist ./dist

# Use non-root user provided by the node image
USER node

EXPOSE 3000

# Optional healthcheck (expects /health endpoint)
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/health || exit 1

CMD ["dumb-init", "node", "dist/main"]
