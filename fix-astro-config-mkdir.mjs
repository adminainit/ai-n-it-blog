import fs from 'fs';

let content = fs.readFileSync('astro.config.mjs', 'utf8');

content = content.replace(
  "const Database = (await import('better-sqlite3')).default || (await import('better-sqlite3'));",
  "if (!fs.existsSync('./data')) fs.mkdirSync('./data', { recursive: true });\n              const Database = (await import('better-sqlite3')).default || (await import('better-sqlite3'));"
);

fs.writeFileSync('astro.config.mjs', content);
