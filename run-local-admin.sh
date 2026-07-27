#!/bin/bash
# Exit immediately if a command exits with a non-zero status
set -e

echo "========================================="
echo " Starting Local Admin & Development Server"
echo "========================================="

echo "Checking and installing dependencies..."
# Using standard npm install. 
# Note: Do NOT run 'npm install dev'. The correct command to start the server is 'npm run dev'.
npm install

echo "Starting local server on http://localhost:3000..."
echo " - Public Site: http://localhost:3000/"
echo " - Admin Portal: http://localhost:3000/admin/"
echo ""

# Run the Astro dev server
npm run dev
