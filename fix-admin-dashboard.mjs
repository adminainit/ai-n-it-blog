import fs from 'fs';

let content = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');
content = content.replace(
  "  const toggleDraftStatus = (id: string) => {\n    alert('Please edit the post to change draft status.');\n  };",
  `  const toggleDraftStatus = async (post: Post) => {
    try {
      const updatedPost = { ...post, draft: !post.draft };
      
      // We need to update the rawContent as well, it has the draft field.
      if (updatedPost.rawContent) {
        let newRaw = updatedPost.rawContent;
        if (newRaw.includes('draft: true')) {
          newRaw = newRaw.replace('draft: true', 'draft: false');
        } else if (newRaw.includes('draft: false')) {
          newRaw = newRaw.replace('draft: false', 'draft: true');
        } else {
          // If draft not found in frontmatter, maybe add it
          newRaw = newRaw.replace('---\\n', '---\\ndraft: ' + updatedPost.draft + '\\n');
        }
        updatedPost.rawContent = newRaw;
      }
      
      if (savePostLocal) await savePostLocal(updatedPost);
      if (syncToBackend) await syncToBackend(updatedPost);
    } catch (err) {
      console.error(err);
      alert('Failed to update draft status.');
    }
  };`
);

content = content.replace(
  `<button onClick={() => editPost(post)} className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" title="Edit Post">`,
  `<button onClick={() => toggleDraftStatus(post)} className="p-1.5 text-slate-400 hover:text-green-600 dark:hover:text-green-400 transition-colors" title={post.draft ? "Publish" : "Unpublish"}>
                            {post.draft ? <Eye size={16} /> : <Eye size={16} className="opacity-50" />}
                          </button>
                          <button onClick={() => editPost(post)} className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" title="Edit Post">`
);

fs.writeFileSync('src/components/AdminDashboard.tsx', content);
