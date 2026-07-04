#!/bin/bash
# Sync changes from GitHub, ignoring all local file modifications EXCEPT local data

set -e

echo "========================================="
echo " Syncing from GitHub (Preserving Local Data DB)"
echo "========================================="

# Fetch the latest from remote
echo "1. Fetching latest from GitHub..."
git fetch --all

# Get the current branch name
BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "main")
if [ "$BRANCH" == "HEAD" ]; then
    BRANCH="main"
fi

echo "2. Resetting local branch '$BRANCH' to match remote..."
git reset --hard origin/$BRANCH

echo "3. Cleaning up untracked files (Preserving data/ folder)..."
git clean -fd -e data/ -e public/logo-custom.* -e site.config.js -e tailwind.config.mjs

echo "========================================="
echo " Sync Complete! The core app is updated, and your local data database was retained."
echo "========================================="
