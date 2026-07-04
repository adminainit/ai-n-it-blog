import fs from 'fs';
const raw = fs.readFileSync('src/pages/admin/index.astro', 'utf-8');
console.log(raw);
