#!/bin/bash
echo "Importing VS Code Markdown files to local database..."
npm run cms:import
echo "Import complete. Restart your dev server or run build to see changes."
