import fs from 'fs';

let content = fs.readFileSync('src/content.config.ts', 'utf8');
content = content.replace("      import fs from 'fs';\n", "");
content = "import fs from 'fs';\n" + content;
fs.writeFileSync('src/content.config.ts', content);

let content2 = fs.readFileSync('astro.config.mjs', 'utf8');
content2 = content2.replace("import Database from 'better-sqlite3';\n", "import Database from 'better-sqlite3';\nimport { createRequire } from 'module';\nconst require = createRequire(import.meta.url);\n");
fs.writeFileSync('astro.config.mjs', content2);
