import fs from 'fs';

let content = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

// Ensure props are received
content = content.replace(
  "export default function AdminDashboard({ posts, onEditPost, onDeletePost, syncStatus, isSyncing, syncToBackend }: any) {",
  "export default function AdminDashboard({ posts, onEditPost, onDeletePost, syncStatus, isSyncing, syncToBackend, savePostLocal }: any) {"
);

// Update header to show sync indicator
content = content.replace(
  /<div className="flex justify-between items-end mb-8">/g,
  `<div className="flex justify-between items-end mb-8">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {isSyncing && <span className="text-sm text-indigo-500 font-bold flex items-center gap-2"><div className="w-3 h-3 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div> Syncing...</span>}
            {!isSyncing && syncStatus === 'success' && <span className="text-sm text-green-600 font-bold">✓ Synced</span>}
            {!isSyncing && syncStatus === 'error' && <span className="text-sm text-red-600 font-bold">✗ Sync Failed</span>}
          </div>
        </div>`
);

// Update handleSavePost to use local db
content = content.replace(
  /const handleSavePost = async \(\) => \{([\s\S]*?)\};/,
  `const handleSavePost = async () => {
    if (!convertedMarkdown) return;
    setIsSaving(true);
    try {
      const titleMatch = convertedMarkdown.match(/title:\\s*"(.*?)"/);
      let fileName = editingPostId || (titleMatch ? titleMatch[1].toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.mdx' : 'new-post.mdx');
      if (!fileName.endsWith('.mdx')) {
         fileName += '.mdx';
      }
      
      const newPost = {
        id: fileName,
        title: titleMatch ? titleMatch[1] : 'Untitled',
        date: new Date().toISOString(),
        draft: false,
        rawContent: convertedMarkdown
      };
      
      if (savePostLocal) await savePostLocal(newPost);
      if (syncToBackend) await syncToBackend(newPost);

      alert('Post saved and synced successfully!');
      closeModal();
    } catch (err) {
      console.error(err);
      alert('An error occurred while saving the post.');
    } finally {
      setIsSaving(false);
    }
  };`
);

fs.writeFileSync('src/components/AdminDashboard.tsx', content);
