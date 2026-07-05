import fs from 'fs';
let content = fs.readFileSync('README.md', 'utf8');

const additionalNotes = `
## Database & Storage Setup (better-sqlite3)
This blog uses \`better-sqlite3\` for local persistence to enable editing and previewing posts through the Admin Portal, and to save published content to the server.

### Configuration
- The database is stored in the \`data/local.db\` file, which is created automatically if it doesn't exist.
- When saving a post in the Admin Portal, it runs through an internal API route which stores the content in the database.
- The Astro static site generation pulls posts from this local SQLite database instead of local Markdown files.

### Seeding Dummy Data
If your database is empty, the build process may fail because it expects at least one post. You can run the seed script to create a dummy post:
\`\`\`bash
node seed-db.js
\`\`\`

### Troubleshooting \`better-sqlite3\` Installation
If you run into installation issues with \`better-sqlite3\` (like missing binaries):
- Ensure you have a C/C++ compiler installed on your system (e.g. \`build-essential\` on Linux, Xcode Command Line Tools on macOS, or Visual Studio Build Tools on Windows).
- Run \`npm rebuild better-sqlite3\` to recompile the native bindings for your architecture.
- If you see an error like "The collection 'posts' does not exist", make sure to run \`node seed-db.js\`!
`;

content = content + additionalNotes;
fs.writeFileSync('README.md', content);
