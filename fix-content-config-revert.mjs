import fs from 'fs';

let content = fs.readFileSync('src/content.config.ts', 'utf8');

content = content.replace(
  "import fs from 'fs';\n      if (!fs.existsSync('./data')) fs.mkdirSync('./data', { recursive: true });\n      const Database = (await import('better-sqlite3')).default || (await import('better-sqlite3'));\n      const db = new (Database.default || Database)('./data/local.db');",
  "import fs from 'fs';\n      if (!fs.existsSync('./data')) fs.mkdirSync('./data', { recursive: true });\n      const db = new Database('./data/local.db');"
);

content = "import Database from 'better-sqlite3';\n" + content;

fs.writeFileSync('src/content.config.ts', content);
