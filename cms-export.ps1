Write-Host "Exporting database posts to VS Code Markdown files..." -ForegroundColor Cyan
npm run cms:export
Write-Host "Export complete. You can now edit files in src/content/vscode-cms/" -ForegroundColor Green
