# Safe Sync changes from GitHub
Write-Host "========================================="
Write-Host " Safe Sync from GitHub (Preserving Local Data)"
Write-Host "========================================="
Write-Host "This script safely updates your project from GitHub."
Write-Host "It will automatically save your local configuration changes (like Site Settings)"
Write-Host "and then pull down the newest code without erasing your data."

Write-Host ""
Write-Host "1. Saving local changes (site.config.js, etc.)..."
git add .
try {
    git commit -m "Auto-save local changes before sync"
} catch {
    Write-Host "No local changes to commit."
}

Write-Host ""
Write-Host "2. Pulling latest code from GitHub..."
$branch = git rev-parse --abbrev-ref HEAD
if ($branch -eq "HEAD" -or [string]::IsNullOrWhiteSpace($branch)) {
    $branch = "main"
}

try {
    git pull origin $branch --rebase
} catch {
    Write-Host ""
    Write-Host "Warning: There was a conflict during pull."
    Write-Host "Please resolve it in your GUI tool (like SourceTree) or editor."
    exit 1
}

Write-Host "========================================="
Write-Host " Sync Complete! Your data and settings are safe."
Write-Host "========================================="
