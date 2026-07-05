import fs from 'fs';

let content = fs.readFileSync('astro.config.mjs', 'utf8');

// We leave the import inside the config block, but maybe restore top level import
content = content.replace(
  "if (!fs.existsSync('./data')) fs.mkdirSync('./data', { recursive: true });\n              const Database = (await import('better-sqlite3')).default || (await import('better-sqlite3'));\n              const db = new (Database.default || Database)('./data/local.db');",
  "if (!fs.existsSync('./data')) fs.mkdirSync('./data', { recursive: true });\n              const db = new Database('./data/local.db');"
);

content = "import Database from 'better-sqlite3';\n" + content;

content = content.replace(
  "vite: {",
  "vite: {\n    ssr: { external: ['better-sqlite3'] },\n    optimizeDeps: { exclude: ['better-sqlite3'] },"
);

fs.writeFileSync('astro.config.mjs', content);
