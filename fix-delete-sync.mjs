import fs from 'fs';
let content = fs.readFileSync('src/hooks/usePostsSync.ts', 'utf8');

const oldDelete = `  const deletePostLocal = useCallback(async (id: string) => {
    await dbService.deletePost(id);
    setPosts(prev => prev.filter(p => p.id !== id));
    // Note: also need an endpoint to delete from backend if we want full sync
  }, []);`;

const newDelete = `  const deletePostLocal = useCallback(async (id: string) => {
    await dbService.deletePost(id);
    setPosts(prev => prev.filter(p => p.id !== id));
    
    // Also delete from backend
    try {
      await fetch('/api/delete-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: id }),
      });
    } catch (e) {
      console.error('Failed to delete from backend:', e);
    }
  }, []);`;

content = content.replace(oldDelete, newDelete);
fs.writeFileSync('src/hooks/usePostsSync.ts', content);
