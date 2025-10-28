# Multi-stage build for React app
FROM node:20-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy application code
COPY . .

# Specify the build-time environment variables you need
ARG VITE_API_URL

# Use the variables during build - Build the app
RUN VITE_API_URL=${VITE_API_URL} npm run build

# Production stage with Nginx
FROM nginx:alpine

# Install gettext for envsubst (to substitute environment variables)
RUN apk add --no-cache gettext

WORKDIR /usr/share/nginx/html

# Remove default Nginx static assets
RUN rm -rf ./*

# Copy built assets from build stage
COPY --from=build /app/dist .

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port (Railway will provide this)
EXPOSE 8080

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]