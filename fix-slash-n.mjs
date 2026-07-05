import fs from 'fs';
let content = fs.readFileSync('src/components/PostEditor.tsx', 'utf8');
content = content.replace(/\\nexport default function PostEditor/g, '\nexport default function PostEditor');
fs.writeFileSync('src/components/PostEditor.tsx', content);
