import fs from 'fs';
let content = fs.readFileSync('site.config.js', 'utf8');

if (!content.includes('version:')) {
  content = content.replace("export const siteConfig = {", "export const siteConfig = {\n  version: '1.0.0',");
  fs.writeFileSync('site.config.js', content);
}
