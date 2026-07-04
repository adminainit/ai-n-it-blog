import fs from 'fs';

let content = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

content = content.replace(
  /const deletePost = \(id: string\) => \{([\s\S]*?)\};/,
  `const deletePost = (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      if (onDeletePost) onDeletePost(id);
    }
  };`
);

fs.writeFileSync('src/components/AdminDashboard.tsx', content);
