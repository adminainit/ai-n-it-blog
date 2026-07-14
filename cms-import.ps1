Write-Host "Importing VS Code Markdown files to local database..." -ForegroundColor Cyan
npm run cms:import
Write-Host "Import complete. Restart your dev server or run build to see changes." -ForegroundColor Green
