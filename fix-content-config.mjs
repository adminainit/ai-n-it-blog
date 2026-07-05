import fs from 'fs';

let content = fs.readFileSync('src/content.config.ts', 'utf8');

content = content.replace(
  "import Database from 'better-sqlite3';",
  ""
);

content = content.replace(
  "const db = new Database('./data/local.db');",
  "const Database = (await import('better-sqlite3')).default || (await import('better-sqlite3'));\n      const db = new (Database.default || Database)('./data/local.db');"
);

fs.writeFileSync('src/content.config.ts', content);
