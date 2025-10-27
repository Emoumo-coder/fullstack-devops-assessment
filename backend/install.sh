#!/bin/bash

echo "Installing Form Builder Backend..."

# Copy environment file
if [ ! -f .env ]; then
    cp .env.example .env
    echo ".env file created"
fi

# Install PHP dependencies
composer install --no-dev --optimize-autoloader

# Generate application key
php artisan key:generate

# Wait for database to be ready
echo "Waiting for database to be ready..."
sleep 30

# Run database migrations
php artisan migrate --force

# Seed database
php artisan db:seed --force

echo "Backend installation completed!"