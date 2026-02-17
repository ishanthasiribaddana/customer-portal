#!/bin/bash
# Build and Deploy Script for Temco Customer Portal
# This script builds the React app and deploys static files to Nginx

set -e

echo "=== Temco Customer Portal Build & Deploy ==="

# Configuration
BUILD_DIR="dist"
DEPLOY_DIR="/var/www/customer-portal"
NGINX_CONF="/etc/nginx/sites-available/customer-portal.conf"

# Step 1: Install dependencies (if needed)
echo "Installing dependencies..."
npm install --legacy-peer-deps

# Step 2: Build the React app
echo "Building React application..."
npm run build

# Step 3: Create deployment directory if it doesn't exist
echo "Preparing deployment directory..."
sudo mkdir -p $DEPLOY_DIR

# Step 4: Copy built files to deployment directory
echo "Deploying static files..."
sudo rm -rf $DEPLOY_DIR/*
sudo cp -r $BUILD_DIR/* $DEPLOY_DIR/

# Step 5: Set proper permissions
echo "Setting permissions..."
sudo chown -R www-data:www-data $DEPLOY_DIR
sudo chmod -R 755 $DEPLOY_DIR

# Step 6: Copy Nginx configuration if not exists
if [ ! -f "$NGINX_CONF" ]; then
    echo "Installing Nginx configuration..."
    sudo cp nginx/customer-portal.conf $NGINX_CONF
    sudo ln -sf $NGINX_CONF /etc/nginx/sites-enabled/
fi

# Step 7: Test Nginx configuration
echo "Testing Nginx configuration..."
sudo nginx -t

# Step 8: Reload Nginx
echo "Reloading Nginx..."
sudo systemctl reload nginx

echo "=== Deployment Complete ==="
echo "Customer portal is now available at http://portal.temco.lk"
