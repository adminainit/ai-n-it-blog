import React, { createContext, useContext, ReactNode } from 'react';
import { usePostsSync } from '../hooks/usePostsSync';
import { Post } from '../services/dbService';

interface BlogManagerContextType {
  drafts: any[];
  posts: Post[];
  isSyncing: boolean;
  syncStatus: string;
  addDraft: (draft: any) => string;
  updateDraft: (id: string, updates: any) => void;
  deleteDraft: (id: string) => void;
  deleteMultipleDrafts: (ids: string[]) => void;
  clearDrafts: () => void;
  getDraft: (id: string) => any;
  savePostLocal: (post: Post) => Promise<Post>;
  syncToBackend: (post: Post) => Promise<void>;
  deletePostLocal: (id: string) => Promise<void>;
}

const BlogManagerContext = createContext<BlogManagerContextType | undefined>(undefined);

export function BlogManagerProvider({ children, initialPosts = [] }: { children: ReactNode, initialPosts?: Post[] }) {
  const { posts, isSyncing, syncStatus, savePostLocal, syncToBackend, deletePostLocal } = usePostsSync(initialPosts);

  const addDraft = (draft: any) => {
    const newId = draft.id || draft.slug || draft.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || crypto.randomUUID();
    const newDraft = {
      id: newId,
      title: draft.title || 'Untitled',
      date: draft.date || new Date().toISOString(),
      draft: true,
      rawContent: draft.content || draft.rawContent || '',
      synced: false,
      ...draft
    };
    savePostLocal(newDraft);
    return newDraft.id;
  };

  const updateDraft = (id: string, updates: any) => {
    const existing = posts.find(p => p.id === id);
    if (existing) {
      if (updates.content !== undefined) {
        updates.rawContent = updates.content;
      }
      savePostLocal({ ...existing, ...updates, synced: false });
    }
  };

  const deleteDraft = (id: string) => {
    deletePostLocal(id);
  };

  const deleteMultipleDrafts = (ids: string[]) => {
    ids.forEach(id => deletePostLocal(id));
  };

  const clearDrafts = () => {
    posts.forEach(p => deletePostLocal(p.id));
  };

  const getDraft = (id: string) => {
    const p = posts.find((draft) => draft.id === id);
    if (p) {
      return { ...p, content: p.rawContent, slug: p.id };
    }
    return undefined;
  };

  return (
    <BlogManagerContext.Provider value={{ 
      drafts: posts.filter(p => p.draft).map(p => ({ ...p, content: p.rawContent, slug: p.id })), 
      posts, 
      isSyncing, 
      syncStatus,
      addDraft, 
      updateDraft, 
      deleteDraft, 
      deleteMultipleDrafts, 
      clearDrafts, 
      getDraft,
      savePostLocal,
      syncToBackend,
      deletePostLocal
    }}>
      {children}
    </BlogManagerContext.Provider>
  );
}

export function useBlogManager() {
  const context = useContext(BlogManagerContext);
  if (context === undefined) {
    throw new Error('useBlogManager must be used within a BlogManagerProvider');
  }
  return context;
}
