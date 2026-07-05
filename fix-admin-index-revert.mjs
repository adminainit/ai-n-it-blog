import fs from 'fs';

let content = fs.readFileSync('src/pages/admin/index.astro', 'utf8');

content = content.replace(
  "const Database = (await import('better-sqlite3')).default || (await import('better-sqlite3'));\n    const db = new (Database.default || Database)(dbPath);",
  "const db = new Database(dbPath);"
);

content = content.replace(
  "import ThemeManager from '../../components/ThemeManager.astro';",
  "import ThemeManager from '../../components/ThemeManager.astro';\nimport Database from 'better-sqlite3';"
);

fs.writeFileSync('src/pages/admin/index.astro', content);
