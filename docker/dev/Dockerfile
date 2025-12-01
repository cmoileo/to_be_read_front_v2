# ================================
# Development Dockerfile for Next.js
# ================================
FROM node:20-alpine

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy package files for monorepo
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

# Copy all package.json files
COPY apps/web/package.json ./apps/web/
COPY packages/api-client/package.json ./packages/api-client/
COPY packages/services/package.json ./packages/services/
COPY packages/types/package.json ./packages/types/
COPY packages/ui/package.json ./packages/ui/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start development server
CMD ["pnpm", "dev", "--filter", "web"]
