#!/bin/bash
set -e

# Ensure storage directories exist with proper permissions
mkdir -p storage/framework/sessions storage/framework/views storage/framework/cache storage/logs bootstrap/cache
chmod -R 775 storage bootstrap/cache

# Run database migrations (ignore errors if tables already exist)
echo "Running database migrations..."
php artisan migrate --force || echo "Migrations completed"

# Start Laravel server
echo "Starting Laravel server..."
exec php artisan serve --host=0.0.0.0 --port=$PORT