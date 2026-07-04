#!/bin/bash
# Sync changes from GitHub, ignoring all local file modifications

set -e

echo "========================================="
echo " Syncing from GitHub (Discarding Local Changes)"
echo "========================================="

# Fetch the latest from remote
git fetch --all

# Get the current branch name
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$BRANCH" == "HEAD" ]; then
    BRANCH="main"
fi

echo "Resetting local branch '$BRANCH' to match remote..."

# Discard all local changes and commits
git reset --hard origin/$BRANCH

# Clean up untracked files and directories
git clean -fd

echo "========================================="
echo " Sync Complete! The machine now exactly matches GitHub."
echo "========================================="
