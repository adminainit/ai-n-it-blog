import fs from 'fs';

let content = fs.readFileSync('src/components/AdminApp.tsx', 'utf8');

content = content.replace("import { usePostsSync } from '../hooks/usePostsSync';", "import { BlogManagerProvider, useBlogManager } from './BlogManager';");

content = content.replace(
  "export default function AdminApp({ initialPosts }: AdminAppProps) {\n  const { posts, isSyncing, syncStatus, savePostLocal, syncToBackend, deletePostLocal } = usePostsSync(initialPosts);",
  `function AdminAppContent() {
  const { posts, isSyncing, syncStatus, savePostLocal, syncToBackend, deletePostLocal } = useBlogManager();`
);

content = content.replace(
  "return (\n    <Layout>",
  "return (\n    <Layout>"
);

content += `\n\nexport default function AdminApp({ initialPosts }: AdminAppProps) {
  return (
    <BlogManagerProvider initialPosts={initialPosts}>
      <AdminAppContent />
    </BlogManagerProvider>
  );
}\n`;

fs.writeFileSync('src/components/AdminApp.tsx', content);
