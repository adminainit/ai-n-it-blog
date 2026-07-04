import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';

const dbPath = path.resolve('./data/local.db');
// create directory if it doesn't exist
const dir = path.dirname(dbPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    content TEXT
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS config (
    key TEXT PRIMARY KEY,
    value TEXT
  )
`);

const insertPost = db.prepare('INSERT OR REPLACE INTO posts (id, content) VALUES (?, ?)');

const postsDir = path.resolve('./src/content/posts');
if (fs.existsSync(postsDir)) {
  const files = fs.readdirSync(postsDir);
  for (const file of files) {
    if (file.endsWith('.mdx') || file.endsWith('.md')) {
      const content = fs.readFileSync(path.join(postsDir, file), 'utf-8');
      insertPost.run(file, content);
      console.log(`Seeded post: ${file}`);
    }
  }
}

console.log("Database seeded successfully!");
