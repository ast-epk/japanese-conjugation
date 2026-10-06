# --- Stage 1: Build static assets ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files first to leverage Docker layer caching
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy remaining source code
COPY . .

# Build production assets (outputs static files to /dist)
RUN npm run build

# --- Stage 2: Serve static files with Nginx ---
FROM nginx:alpine-slim

# Copy built assets from builder stage to Nginx default public directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]