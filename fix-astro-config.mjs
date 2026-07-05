import fs from 'fs';

let content = fs.readFileSync('astro.config.mjs', 'utf8');

// Remove the top-level import
content = content.replace("import Database from 'better-sqlite3';", "");

// Inside the handler, dynamically import
content = content.replace(
  "const db = new Database('./data/local.db');",
  "const Database = (await import('better-sqlite3')).default || (await import('better-sqlite3'));\n              const db = new (Database.default || Database)('./data/local.db');"
);

fs.writeFileSync('astro.config.mjs', content);
