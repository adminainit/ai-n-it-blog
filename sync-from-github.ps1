# Sync changes from GitHub, ignoring all local file modifications
$ErrorActionPreference = "Stop"

Write-Host "========================================="
Write-Host " Syncing from GitHub (Discarding Local Changes)"
Write-Host "========================================="

# Fetch the latest from remote
git fetch --all

# Get the current branch name
$branch = git rev-parse --abbrev-ref HEAD
if ($branch -eq "HEAD") {
    $branch = "main"
}

Write-Host "Resetting local branch '$branch' to match remote..."

# Discard all local changes and commits
git reset --hard origin/$branch

# Clean up untracked files and directories
git clean -fd

Write-Host "========================================="
Write-Host " Sync Complete! The machine now exactly matches GitHub."
Write-Host "========================================="
