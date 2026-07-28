import { useState, useEffect, useCallback } from 'react';
import { dbService, Post } from '../services/dbService';

export function usePostsSync(initialPosts: Post[] = []) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');

  // Load from IndexedDB on mount
  useEffect(() => {
    const loadPosts = async () => {
      let localPosts = await dbService.getAllPosts();
      
      // If local is empty, seed from initialPosts
      if (localPosts.length === 0 && initialPosts.length > 0) {
        for (const p of initialPosts) {
          const postWithSync = { ...p, synced: true };
          await dbService.savePost(postWithSync);
        }
        localPosts = await dbService.getAllPosts();
      }

      // Merge initialPosts with localPosts if necessary (e.g. backend has new posts)
      // For simplicity, we just trust local posts, but we should make sure we pick up newly added backend posts
      const localIds = new Set(localPosts.map(p => p.id));
      let addedFromInitial = false;
      for (const p of initialPosts) {
        if (!localIds.has(p.id)) {
          const postWithSync = { ...p, synced: true };
          await dbService.savePost(postWithSync);
          localPosts.push(postWithSync);
          addedFromInitial = true;
        }
      }
      
      if (addedFromInitial) {
         localPosts = await dbService.getAllPosts();
      }

      setPosts(localPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    };

    loadPosts();
  }, [initialPosts]);

  const savePostLocal = useCallback(async (post: Post) => {
    const updatedPost = { ...post, synced: false };
    await dbService.savePost(updatedPost);
    setPosts(prev => {
      const existing = prev.findIndex(p => p.id === post.id);
      if (existing !== -1) {
        const next = [...prev];
        next[existing] = updatedPost;
        return next;
      }
      return [updatedPost, ...prev];
    });
    return updatedPost;
  }, []);

  const syncToBackend = useCallback(async (post: Post) => {
    setIsSyncing(true);
    setSyncStatus('syncing');
    try {
      const response = await fetch('/api/save-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: post.id, content: post.rawContent }),
      });

      if (!response.ok) throw new Error('Failed to sync to backend');

      const syncedPost = { ...post, synced: true };
      await dbService.savePost(syncedPost);
      
      setPosts(prev => {
        const existing = prev.findIndex(p => p.id === post.id);
        if (existing !== -1) {
          const next = [...prev];
          next[existing] = syncedPost;
          return next;
        }
        return prev;
      });
      setSyncStatus('success');
      setTimeout(() => setSyncStatus('idle'), 3000);
    } catch (error) {
      console.error('Sync error:', error);
      setSyncStatus('error');
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const deletePostLocal = useCallback(async (id: string) => {
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
  }, []);

  return {
    posts,
    isSyncing,
    syncStatus,
    savePostLocal,
    syncToBackend,
    deletePostLocal
  };
}
