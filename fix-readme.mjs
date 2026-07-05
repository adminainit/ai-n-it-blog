import fs from 'fs';
let content = fs.readFileSync('README.md', 'utf8');

const regex = /## 9\. Force Syncing from GitHub \(Discard Local Changes\)[\s\S]*?one-way\./;

const newSection = `## 9. Safe Syncing from GitHub
If you pull updates from GitHub via GUI tools like SourceTree, you might encounter "merge conflicts" or errors saying your local files would be overwritten. This happens because the **Admin Portal** modifies local configuration files (\`site.config.js\`, \`tailwind.config.mjs\`) when you change themes.

To easily sync your code without losing any local settings or data, we have provided **Safe Sync** scripts. These scripts will automatically commit your local changes and seamlessly pull the latest code.

**Linux / macOS Sync:**
Make the script executable and run it:
\`\`\`bash
chmod +x sync-from-github.sh
./sync-from-github.sh
\`\`\`

**Windows Sync:**
Open PowerShell and run:
\`\`\`powershell
.\\sync-from-github.ps1
\`\`\`
*(Note: If you receive a "running scripts is disabled on this system" error, run this command first: \`Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser\` and type \`Y\` to confirm. Then run the script again.)*

These scripts guarantee that your \`data/local.db\` is preserved and any theme changes you made locally are cleanly committed.`;

if (content.match(regex)) {
  content = content.replace(regex, newSection);
  fs.writeFileSync('README.md', content);
}
