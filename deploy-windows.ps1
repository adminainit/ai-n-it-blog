<#
.SYNOPSIS
    Automated Deployment Build Script for Windows
.DESCRIPTION
    This script installs dependencies, cleans previous builds, and generates the static production build for the application.
#>

$ErrorActionPreference = "Stop"

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host " Starting Windows Deployment Build Process " -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

Write-Host "[1/4] Checking prerequisites..." -ForegroundColor Yellow
if (-not (Get-Command "node" -ErrorAction SilentlyContinue)) {
    Write-Error "Node.js is not installed. Please install Node.js v18+."
    exit 1
}

if (-not (Get-Command "npm" -ErrorAction SilentlyContinue)) {
    Write-Error "npm is not installed."
    exit 1
}

$nodeVersion = node -v
$npmVersion = npm -v
Write-Host "Node version: $nodeVersion"
Write-Host "NPM version: $npmVersion"

Write-Host "[2/4] Installing dependencies..." -ForegroundColor Yellow
if (Test-Path "package-lock.json") {
    npm ci
} else {
    npm install
}

Write-Host "[3/4] Securing Public Build (Removing Admin Portal)..." -ForegroundColor Yellow
if (Test-Path "src\pages\admin") {
    Remove-Item -Recurse -Force "src\pages\admin"
}
npm run clean

Write-Host "[4/4] Building the application..." -ForegroundColor Yellow
npm run build

Write-Host "=========================================" -ForegroundColor Green
Write-Host " Build Complete!" -ForegroundColor Green
Write-Host " The static files are located in the 'dist' directory." -ForegroundColor Green
Write-Host " You can now serve the 'dist' folder using IIS or any static file server." -ForegroundColor Green
Write-Host " Example (using npx serve): npx serve dist -p 8080" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
