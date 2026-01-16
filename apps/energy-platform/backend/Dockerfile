# Backend Dockerfile
FROM node:18-alpine AS base

# Install dependencies for building
FROM base AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files and install ALL dependencies (including dev for building)
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install

# Generate Prisma client
RUN npx prisma generate

# Copy source and build
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 api
RUN adduser --system --uid 1001 api

# Copy only what's needed for production
COPY --from=builder --chown=api:api /app/dist ./dist
COPY --from=builder --chown=api:api /app/node_modules ./node_modules
COPY --from=builder --chown=api:api /app/package.json ./
COPY --from=builder --chown=api:api /app/prisma ./prisma

USER api

EXPOSE 5000

CMD ["npm", "start"]
