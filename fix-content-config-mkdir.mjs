import fs from 'fs';

let content = fs.readFileSync('src/content.config.ts', 'utf8');

content = content.replace(
  "const Database = (await import('better-sqlite3')).default || (await import('better-sqlite3'));",
  "import fs from 'fs';\n      if (!fs.existsSync('./data')) fs.mkdirSync('./data', { recursive: true });\n      const Database = (await import('better-sqlite3')).default || (await import('better-sqlite3'));"
);

fs.writeFileSync('src/content.config.ts', content);
