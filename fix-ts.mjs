import fs from 'fs';
let content = fs.readFileSync('src/components/ThemeConfigurator.tsx', 'utf8');

content = content.replace("parts[2] = parseInt(parts[2]) + 1;", "parts[2] = (parseInt(parts[2]) + 1).toString();");

fs.writeFileSync('src/components/ThemeConfigurator.tsx', content);
