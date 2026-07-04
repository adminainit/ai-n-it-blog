import fs from 'fs';

let content = fs.readFileSync('src/components/Layout.tsx', 'utf8');
content = content.replace("import { BlogManagerProvider } from './BlogManager';", "");
content = content.replace("<BlogManagerProvider>", "");
content = content.replace("</BlogManagerProvider>", "");

fs.writeFileSync('src/components/Layout.tsx', content);
