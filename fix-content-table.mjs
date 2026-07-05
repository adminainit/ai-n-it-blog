import fs from 'fs';
let content = fs.readFileSync('src/content.config.ts', 'utf8');
content = content.replace(
  "      const db = new Database('./data/local.db');",
  "      const db = new Database('./data/local.db');\n      db.exec('CREATE TABLE IF NOT EXISTS posts (id TEXT PRIMARY KEY, content TEXT)');"
);
fs.writeFileSync('src/content.config.ts', content);
