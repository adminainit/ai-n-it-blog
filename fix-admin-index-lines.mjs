import fs from 'fs';

let content = fs.readFileSync('src/pages/admin/index.astro', 'utf8');
content = content.replace("import { createRequire } from 'module';\nconst require = createRequire(import.meta.url);\n", "");

content = content.replace(
  "import AdminApp from '../../components/AdminApp';",
  "import { createRequire } from 'module';\nconst require = createRequire(import.meta.url);\nimport AdminApp from '../../components/AdminApp';"
);
fs.writeFileSync('src/pages/admin/index.astro', content);
