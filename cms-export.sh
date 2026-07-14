#!/bin/bash
echo "Exporting database posts to VS Code Markdown files..."
npm run cms:export
echo "Export complete. You can now edit files in src/content/vscode-cms/"
