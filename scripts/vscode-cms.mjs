import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';

const dbPath = path.resolve(process.cwd(), './data/local.db');
const contentDir = path.resolve(process.cwd(), './src/content/vscode-cms');

const action = process.argv[2];

if (!fs.existsSync(contentDir)) {
  fs.mkdirSync(contentDir, { recursive: true });
}

// Ensure DB exists
if (!fs.existsSync(path.dirname(dbPath))) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
}

const db = new Database(dbPath);

// Ensure table exists just in case
db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    content TEXT
  )
`);

if (action === 'export') {
  console.log('📦 Exporting database posts to VS Code...');
  const posts = db.prepare('SELECT id, content FROM posts').all();
  let count = 0;
  posts.forEach(post => {
    let filename = post.id;
    if (!filename.endsWith('.md') && !filename.endsWith('.mdx')) {
      filename += '.md';
    }
    const filePath = path.join(contentDir, filename);
    fs.writeFileSync(filePath, post.content || '');
    console.log(`  ✓ Exported: ${filename}`);
    count++;
  });
  console.log(`\n✅ Successfully exported ${count} posts!`);
  console.log(`📂 You can now edit your files in: src/content/vscode-cms/`);
  console.log(`   (Don't forget to run 'npm run cms:import' when you are done)`);

} else if (action === 'import') {
  console.log('📥 Importing VS Code files to database...');
  const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
  const insertPost = db.prepare('INSERT OR REPLACE INTO posts (id, content) VALUES (?, ?)');
  
  let count = 0;
  files.forEach(file => {
    const filePath = path.join(contentDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    insertPost.run(file, content);
    console.log(`  ✓ Imported: ${file}`);
    count++;
  });
  console.log(`\n✅ Successfully imported ${count} posts!`);
  console.log(`🔄 The database is updated. Run 'npm run build' or check your dev server to see changes.`);

} else {
  console.log('VS Code CMS Sync Tool');
  console.log('---------------------');
  console.log('Usage:');
  console.log('  npm run cms:export  - Exports DB posts to Markdown files for VS Code editing');
  console.log('  npm run cms:import  - Imports modified Markdown files back into the DB');
}

db.close();
