import fs from 'fs';
let content = fs.readFileSync('site.config.js', 'utf8');

content = content.replace("version: '1.0.0'", "version: '1.1.0'");
fs.writeFileSync('site.config.js', content);
