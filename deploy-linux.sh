#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "========================================="
echo " Starting Linux Deployment Build Process "
echo "========================================="

echo "[1/4] Checking prerequisites..."
if ! command -v node &> /dev/null
then
    echo "Error: Node.js is not installed. Please install Node.js v18+."
    exit 1
fi

if ! command -v npm &> /dev/null
then
    echo "Error: npm is not installed."
    exit 1
fi

echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

echo "[2/4] Installing dependencies..."
# Use ci for reliable, clean installs based on package-lock.json if available
if [ -f "package-lock.json" ]; then
    npm ci
else
    npm install
fi

echo "[3/4] Securing Public Build (Removing Admin Portal)..."
rm -rf src/pages/admin
npm run clean

echo "[4/4] Building the application..."
npm run build

echo "========================================="
echo " Build Complete!"
echo " The static files are located in the 'dist' directory."
echo " You can now serve the 'dist' folder using Nginx, Apache, or any static file server."
echo " Example (using npx serve): npx serve dist -p 8080"
echo "========================================="
