import fs from 'fs';

let content = fs.readFileSync('astro.config.mjs', 'utf8');
content = content.replace("import Database from 'better-sqlite3';", "");
content = content.replace(
  "const db = new Database('./data/local.db');",
  "const Database = require('better-sqlite3');\n              const db = new Database('./data/local.db');"
);
fs.writeFileSync('astro.config.mjs', content);

let content2 = fs.readFileSync('src/content.config.ts', 'utf8');
content2 = content2.replace("import Database from 'better-sqlite3';", "");
content2 = "import { createRequire } from 'module';\nconst require = createRequire(import.meta.url);\n" + content2;
content2 = content2.replace(
  "const db = new Database('./data/local.db');",
  "const Database = require('better-sqlite3');\n      const db = new Database('./data/local.db');"
);
fs.writeFileSync('src/content.config.ts', content2);

let content3 = fs.readFileSync('src/pages/admin/index.astro', 'utf8');
content3 = content3.replace("import Database from 'better-sqlite3';", "");
content3 = "import { createRequire } from 'module';\nconst require = createRequire(import.meta.url);\n" + content3;
content3 = content3.replace(
  "const db = new Database(dbPath);",
  "const Database = require('better-sqlite3');\n    const db = new Database(dbPath);"
);
fs.writeFileSync('src/pages/admin/index.astro', content3);

