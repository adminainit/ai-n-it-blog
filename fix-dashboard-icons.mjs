import fs from 'fs';
let content = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');
content = content.replace("Settings, Eye,", "Settings, Eye, EyeOff,");
content = content.replace("{post.draft ? <Eye size={16} /> : <Eye size={16} className=\"opacity-50\" />}", "{post.draft ? <Eye size={16} /> : <EyeOff size={16} />}");
fs.writeFileSync('src/components/AdminDashboard.tsx', content);
