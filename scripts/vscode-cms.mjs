import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import matter from 'gray-matter';

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
  console.log('📥 Importing VS Code files to database (with Auto-Frontmatter)...');
  const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
  const insertPost = db.prepare('INSERT OR REPLACE INTO posts (id, content) VALUES (?, ?)');
  
  let count = 0;
  files.forEach(file => {
    const filePath = path.join(contentDir, file);
    let rawContent = fs.readFileSync(filePath, 'utf8');
    
    try {
      const parsed = matter(rawContent);
      let needsUpdate = false;
      
      // Auto-fill missing frontmatter fields
      if (!parsed.data.title) {
        // use filename without extension, capitalizing words
        parsed.data.title = file.replace(/\.mdx?$/, '').split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        needsUpdate = true;
      }
      if (!parsed.data.date) {
        parsed.data.date = new Date().toISOString().split('T')[0];
        needsUpdate = true;
      }
      if (!parsed.data.description) {
        parsed.data.description = "Auto-generated description for " + parsed.data.title;
        needsUpdate = true;
      }
      if (parsed.data.draft === undefined) {
        parsed.data.draft = false;
        needsUpdate = true;
      }
      if (!parsed.data.tags) {
        parsed.data.tags = ["post"];
        needsUpdate = true;
      }
      
      // If we added fields, rebuild the string
      if (needsUpdate) {
        rawContent = matter.stringify(parsed.content, parsed.data);
        // Save it back to the file so the user sees the added frontmatter
        fs.writeFileSync(filePath, rawContent, 'utf8');
        console.log(`  ✨ Auto-injected missing frontmatter for: ${file}`);
      }
      
      insertPost.run(file, rawContent);
      console.log(`  ✓ Imported: ${file}`);
      count++;
    } catch(err) {
      console.error(`  ❌ Failed to parse/import ${file}: ${err.message}`);
    }
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
