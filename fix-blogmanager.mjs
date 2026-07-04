import fs from 'fs';

let content = fs.readFileSync('src/components/BlogManager.tsx', 'utf8');

// Update addDraft signature and usage
content = content.replace(
  /const addDraft = \(draft: Partial<Post>\) => \{([\s\S]*?)\};/,
  `const addDraft = (draft: any) => {
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
  };`
);

// Update updateDraft signature and usage
content = content.replace(
  /const updateDraft = \(id: string, updates: Partial<Post>\) => \{([\s\S]*?)\};/,
  `const updateDraft = (id: string, updates: any) => {
    const existing = posts.find(p => p.id === id);
    if (existing) {
      if (updates.content !== undefined) {
        updates.rawContent = updates.content;
      }
      savePostLocal({ ...existing, ...updates, synced: false });
    }
  };`
);

// Update getDraft to return mapped draft if needed (rawContent -> content)
content = content.replace(
  /const getDraft = \(id: string\) => \{([\s\S]*?)\};/,
  `const getDraft = (id: string) => {
    const p = posts.find((draft) => draft.id === id);
    if (p) {
      return { ...p, content: p.rawContent, slug: p.id };
    }
    return undefined;
  };`
);

// Update drafts mapping
content = content.replace(
  "drafts: posts.filter(p => p.draft),",
  "drafts: posts.filter(p => p.draft).map(p => ({ ...p, content: p.rawContent, slug: p.id })),"
);

fs.writeFileSync('src/components/BlogManager.tsx', content);
