<#
.SYNOPSIS
    Starts the local development server including the Admin Portal.
#>
$ErrorActionPreference = "Stop"

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host " Starting Local Admin & Development Server " -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

Write-Host "Checking and installing dependencies..." -ForegroundColor Yellow
# Using standard npm install.
# Note: Do NOT run 'npm install dev'. The correct command to start the server is 'npm run dev'.
npm install

Write-Host "Starting local server..." -ForegroundColor Green
Write-Host " - Public Site: http://localhost:3000/" -ForegroundColor Green
Write-Host " - Admin Portal: http://localhost:3000/admin/" -ForegroundColor Green
Write-Host ""

# Run the Astro dev server
npm run dev
