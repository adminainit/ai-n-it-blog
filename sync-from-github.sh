#!/bin/bash
echo "========================================="
echo " Safe Sync from GitHub (Preserving Local Data)"
echo "========================================="

echo "This script safely updates your project from GitHub."
echo "It will automatically save your local configuration changes (like Site Settings)"
echo "and then pull down the newest code without erasing your data."
echo ""

echo "1. Saving local changes (site.config.js, etc.)..."
git add .
git commit -m "Auto-save local changes before sync" || echo "No local changes to commit."

echo ""
echo "2. Pulling latest code from GitHub..."
BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "main")
if [ "$BRANCH" == "HEAD" ]; then
    BRANCH="main"
fi

# Pull with rebase to keep local commits neatly on top of the fetched updates
git pull origin $BRANCH --rebase || {
    echo ""
    echo "Warning: There was a conflict during pull."
    echo "Please resolve it in your GUI tool (like SourceTree) or editor."
    exit 1
}

echo ""
echo "3. Updating dependencies..."
npm install

echo "========================================="
echo " Sync Complete! Your data and settings are safe."
echo "========================================="
