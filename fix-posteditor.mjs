import fs from 'fs';

let content = fs.readFileSync('src/components/PostEditor.tsx', 'utf8');

// Update useBlogManager to get syncToBackend
content = content.replace(
  "const { drafts, addDraft, updateDraft, deleteDraft, deleteMultipleDrafts, clearDrafts } = useBlogManager();",
  "const { drafts, addDraft, updateDraft, deleteDraft, deleteMultipleDrafts, clearDrafts, syncToBackend, savePostLocal } = useBlogManager();"
);

// Update handleSavePost
content = content.replace(
  /const handleSavePost = async \(\) => \{([\s\S]*?)\};/,
  `const handleSavePost = async () => {
    if (!activeDraft) return;
    setIsSaving(true);
    try {
      let fileName = \`\${activeDraft.slug || 'new-post'}.mdx\`;
      
      const newPost = {
        id: fileName,
        title: activeDraft.title || 'Untitled',
        date: activeDraft.date || new Date().toISOString(),
        draft: false,
        rawContent: activeDraft.content
      };
      
      if (savePostLocal) await savePostLocal(newPost);
      if (syncToBackend) await syncToBackend(newPost);
      
      // Keep it in drafts but updated
      updateDraft(activeDraft.id, { title: newPost.title, content: newPost.rawContent });
      alert('File saved and synced successfully!');
    } catch (err) {
      console.error(err);
      alert('An error occurred while saving the post.');
    } finally {
      setIsSaving(false);
    }
  };`
);

fs.writeFileSync('src/components/PostEditor.tsx', content);
