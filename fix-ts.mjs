import fs from 'fs';
let content = fs.readFileSync('src/components/PostEditor.tsx', 'utf8');

content = content.replace("const data = {};", "const data: Record<string, any> = {};");
content = content.replace("return { data: {}, content: rawContent };", "return { data: {} as Record<string, any>, content: rawContent };");
content = content.replace("if (!rawContent) return { data: {}, content: '' };", "if (!rawContent) return { data: {} as Record<string, any>, content: '' };");

fs.writeFileSync('src/components/PostEditor.tsx', content);
