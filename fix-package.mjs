import fs from 'fs';
let content = fs.readFileSync('package.json', 'utf8');
content = content.replace('"lint": "tsc --noEmit"', '"lint": "tsc --noEmit",\n    "seed": "node seed.mjs"');
fs.writeFileSync('package.json', content);

let readme = fs.readFileSync('README.md', 'utf8');
readme = readme.replace('node seed-db.js', 'npm run seed').replace('node seed-db.js', 'npm run seed');
fs.writeFileSync('README.md', readme);
