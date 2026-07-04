# Sync changes from GitHub, ignoring all local file modifications EXCEPT local data
$ErrorActionPreference = "Stop"

Write-Host "========================================="
Write-Host " Syncing from GitHub (Preserving Local Data DB)"
Write-Host "========================================="

Write-Host "1. Fetching latest from GitHub..."
git fetch --all

$branch = git rev-parse --abbrev-ref HEAD
if ($branch -eq "HEAD" -or [string]::IsNullOrWhiteSpace($branch)) {
    $branch = "main"
}

Write-Host "2. Resetting local branch '$branch' to match remote..."
git reset --hard origin/$branch

Write-Host "3. Cleaning up untracked files (Preserving data/ folder)..."
git clean -fd -e data/ -e public/logo-custom.* -e site.config.js -e tailwind.config.mjs

Write-Host "========================================="
Write-Host " Sync Complete! The core app is updated, and your local data database was retained."
Write-Host "========================================="
