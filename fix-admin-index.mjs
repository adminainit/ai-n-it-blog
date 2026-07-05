import fs from 'fs';

let content = fs.readFileSync('src/pages/admin/index.astro', 'utf8');

content = content.replace(
  "import Database from 'better-sqlite3';",
  ""
);

content = content.replace(
  "const db = new Database(dbPath);",
  "const Database = (await import('better-sqlite3')).default || (await import('better-sqlite3'));\n    const db = new (Database.default || Database)(dbPath);"
);

fs.writeFileSync('src/pages/admin/index.astro', content);
