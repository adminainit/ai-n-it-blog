#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "========================================="
echo " Starting Local Admin & Development Server"
echo "========================================="

echo "Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

echo "Starting local server on http://localhost:3000..."
echo " - Public Site: http://localhost:3000/"
echo " - Admin Portal: http://localhost:3000/admin/"
echo ""

# Run the Astro dev server
npm run dev
