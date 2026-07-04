import fs from 'fs';
let content = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');
content = content.replace(
  /const toggleDraftStatus = \(id: string\) => \{([\s\S]*?)\};/,
  `const toggleDraftStatus = (id: string) => {
    alert('Please edit the post to change draft status.');
  };`
);
fs.writeFileSync('src/components/AdminDashboard.tsx', content);
