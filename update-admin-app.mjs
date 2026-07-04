import fs from 'fs';

let content = fs.readFileSync('src/components/AdminApp.tsx', 'utf8');

content = content.replace(
  "import React, { useState } from 'react';",
  "import React, { useState } from 'react';\nimport { usePostsSync } from '../hooks/usePostsSync';"
);

content = content.replace(
  "export default function AdminApp({ initialPosts }: AdminAppProps) {",
  `export default function AdminApp({ initialPosts }: AdminAppProps) {
  const { posts, isSyncing, syncStatus, savePostLocal, syncToBackend, deletePostLocal } = usePostsSync(initialPosts);`
);

content = content.replace(
  "<AdminDashboard posts={initialPosts} onEditPost={handleEditPost} />",
  `<AdminDashboard 
    posts={posts} 
    onEditPost={handleEditPost}
    onDeletePost={deletePostLocal}
    syncStatus={syncStatus}
    isSyncing={isSyncing}
    syncToBackend={syncToBackend}
    savePostLocal={savePostLocal}
  />`
);

content = content.replace(
  "<PostEditor initialPost={editingPost} />",
  `<PostEditor 
    initialPost={editingPost} 
    savePostLocal={savePostLocal}
    syncToBackend={syncToBackend}
  />`
);

fs.writeFileSync('src/components/AdminApp.tsx', content);
