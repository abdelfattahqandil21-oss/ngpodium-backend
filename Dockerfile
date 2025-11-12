# Use Node.js 18 Alpine as base image
FROM node:18-alpine AS base

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (including dev dependencies for build)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Generate Prisma client
RUN pnpm prisma:generate

# Build the application
RUN pnpm build

# List dist directory to verify build
RUN ls -la dist/

# Production stage
FROM node:18-alpine AS production

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files and prisma schema
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma

# Install production dependencies and prisma (without postinstall)
RUN pnpm install --frozen-lockfile --prod --ignore-scripts
RUN pnpm add prisma --ignore-scripts

# Generate Prisma client
RUN pnpm prisma generate

# Copy built application from base stage
COPY --from=base /app/dist ./dist

# Verify copied files
RUN ls -la dist/

# Create uploads directory
RUN mkdir -p uploads/profile uploads/cover

# Expose port
EXPOSE 3000

# Start the application with migrations
CMD ["pnpm", "railway:start"]
