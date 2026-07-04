import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface DraftPost {
  id: string;
  title: string;
  slug: string;
  content: string; // Markdown content
  date: string;
}

interface BlogManagerContextType {
  drafts: DraftPost[];
  addDraft: (draft: Omit<DraftPost, 'id' | 'date' | 'slug'> & { slug?: string }) => string;
  updateDraft: (id: string, updates: Partial<DraftPost>) => void;
  deleteDraft: (id: string) => void;
  deleteMultipleDrafts: (ids: string[]) => void;
  clearDrafts: () => void;
  getDraft: (id: string) => DraftPost | undefined;
}

const BlogManagerContext = createContext<BlogManagerContextType | undefined>(undefined);

export function BlogManagerProvider({ children }: { children: ReactNode }) {
  const [drafts, setDrafts] = useState<DraftPost[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load drafts from local storage on mount
    const savedDrafts = localStorage.getItem('blog_drafts');
    if (savedDrafts) {
      try {
        setDrafts(JSON.parse(savedDrafts));
      } catch (e) {
        console.error('Failed to parse saved drafts', e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    // Save drafts to local storage whenever they change
    if (isLoaded) {
      localStorage.setItem('blog_drafts', JSON.stringify(drafts));
    }
  }, [drafts, isLoaded]);

  const addDraft = (draft: Omit<DraftPost, 'id' | 'date' | 'slug'> & { slug?: string }) => {
    const newDraft: DraftPost = {
      ...draft,
      slug: draft.slug || draft.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    };
    setDrafts((prev) => [newDraft, ...prev]);
    return newDraft.id;
  };

  const updateDraft = (id: string, updates: Partial<DraftPost>) => {
    setDrafts((prev) =>
      prev.map((draft) => (draft.id === id ? { ...draft, ...updates } : draft))
    );
  };

  const deleteDraft = (id: string) => {
    setDrafts((prev) => prev.filter((draft) => draft.id !== id));
  };

  const deleteMultipleDrafts = (ids: string[]) => {
    setDrafts((prev) => prev.filter((draft) => !ids.includes(draft.id)));
  };

  const clearDrafts = () => {
    setDrafts([]);
  };

  const getDraft = (id: string) => {
    return drafts.find((draft) => draft.id === id);
  };

  return (
    <BlogManagerContext.Provider value={{ drafts, addDraft, updateDraft, deleteDraft, deleteMultipleDrafts, clearDrafts, getDraft }}>
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
