import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useBlogManager } from './BlogManager';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, Eye, Layout, Bold, Italic, Link as LinkIcon, Save } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  date: string;
  draft: boolean;
  rawContent?: string;
}

interface PostEditorProps {
  initialPost?: Post | null;
}


function parseFrontmatter(rawContent) {
  if (!rawContent) return { data: {} as Record<string, any>, content: '' };
  const match = rawContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (match) {
    const frontmatterRaw = match[1];
    const markdown = match[2];
    
    const data: Record<string, any> = {};
    const lines = frontmatterRaw.split('\n');
    for (const line of lines) {
      const splitIndex = line.indexOf(':');
      if (splitIndex > -1) {
        const key = line.slice(0, splitIndex).trim();
        let value = line.slice(splitIndex + 1).trim();
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        } else if (value.startsWith("'") && value.endsWith("'")) {
          value = value.slice(1, -1);
        }
        data[key] = value;
      }
    }
    return { data, content: markdown };
  }
  return { data: {} as Record<string, any>, content: rawContent };
}

export default function PostEditor({ initialPost }: PostEditorProps = {}) {
  const { drafts, addDraft, updateDraft, deleteDraft, deleteMultipleDrafts, clearDrafts, syncToBackend, savePostLocal } = useBlogManager();
  const [activeDraftId, setActiveDraftId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'split' | 'edit' | 'preview'>('split');
  const [isSaving, setIsSaving] = useState(false);
  const [isManageMode, setIsManageMode] = useState(false);
  const [selectedDrafts, setSelectedDrafts] = useState<Set<string>>(new Set());
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  
  const initializedPostIdRef = React.useRef<string | null>(null);

  // Create a new draft on initial load if none exist or when initialPost changes
  useEffect(() => {
    if (initialPost && initializedPostIdRef.current !== initialPost.id) {
      initializedPostIdRef.current = initialPost.id;
      
      const expectedSlug = initialPost.id.replace(/\.mdx?$/, '');
      const existingDraft = drafts.find(d => d.slug === expectedSlug);
      
      if (existingDraft) {
        setActiveDraftId(existingDraft.id);
      } else {
        const newDraftId = addDraft({
          title: initialPost.title,
          slug: expectedSlug,
          content: initialPost.rawContent || '',
        });
        setActiveDraftId(newDraftId);
      }
    } else if (!initialPost && drafts.length === 0 && initializedPostIdRef.current !== 'empty') {
      initializedPostIdRef.current = 'empty';
      const newDraftId = addDraft({ title: 'New Post', slug: 'new-post', content: '# Welcome to the Editor\n\nStart typing here...' });
      setActiveDraftId(newDraftId);
    }
  }, [initialPost, drafts, addDraft]);

  // Set the first draft as active if none is selected
  useEffect(() => {
    if (!activeDraftId && drafts.length > 0) {
      setActiveDraftId(drafts[0].id);
    }
  }, [activeDraftId, drafts]);

  const activeDraft = drafts.find(d => d.id === activeDraftId) || drafts[0];


  const [localDraft, setLocalDraft] = useState<any>(null);

  // Sync localDraft with activeDraft when switching drafts
  useEffect(() => {
    if (activeDraft) {
      setLocalDraft({ ...activeDraft });
    }
  }, [activeDraftId, drafts.length]); // Need drafts.length in case of new draft

  // Auto-save effect
  useEffect(() => {
    if (!localDraft || !activeDraft) return;
    
    const hasChanges = localDraft.title !== activeDraft.title || 
                       localDraft.slug !== activeDraft.slug || 
                       localDraft.content !== activeDraft.content;
                       
    if (hasChanges) {
      const timer = setTimeout(() => {
        updateDraft(activeDraft.id, { 
          title: localDraft.title, 
          slug: localDraft.slug, 
          content: localDraft.content 
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [localDraft, activeDraft, updateDraft]);

  if (!activeDraft) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-8 text-center text-slate-500 font-medium"
        >
          Loading editor...
        </motion.div>
      </div>
    );
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (localDraft) setLocalDraft({ ...localDraft, title: e.target.value });
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (localDraft) setLocalDraft({ ...localDraft, slug: e.target.value });
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (localDraft) setLocalDraft({ ...localDraft, content: e.target.value });
  };

  const handleCreateNew = () => {
    addDraft({ title: 'Untitled Draft', slug: 'untitled-draft', content: '' });
  };

  const handleFormat = (type: 'bold' | 'italic' | 'link') => {
    if (!textareaRef.current || !localDraft) return;
    
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const text = localDraft.content || '';
    const selected = text.substring(start, end);
    let inserted = '';
    
    if (type === 'bold') {
      inserted = `**${selected || 'bold text'}**`;
    } else if (type === 'italic') {
      inserted = `*${selected || 'italic text'}*`;
    } else if (type === 'link') {
      inserted = `[${selected || 'link text'}](url)`;
    }
    
    const newContent = text.substring(0, start) + inserted + text.substring(end);
    if (localDraft) setLocalDraft({ ...localDraft, content: newContent });
    
    // Focus back and set selection
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newPos = start + inserted.length;
        if (!selected && type === 'link') {
          textareaRef.current.setSelectionRange(start + inserted.length - 4, start + inserted.length - 1);
        } else if (!selected) {
           textareaRef.current.setSelectionRange(start + 2, start + inserted.length - 2);
        } else {
          textareaRef.current.setSelectionRange(newPos, newPos);
        }
      }
    }, 10);
  };

  const handleSavePost = async () => {
    if (!activeDraft) return;
    setIsSaving(true);
    try {
      let fileName = `${localDraft.slug || 'new-post'}.mdx`;
      
      const newPost = {
        id: fileName,
        title: localDraft.title || 'Untitled',
        date: activeDraft.date || new Date().toISOString(),
        draft: false,
        rawContent: localDraft.content
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
  };

  const handleDeleteSelected = () => {
    if (selectedDrafts.size === 0) return;
    deleteMultipleDrafts(Array.from(selectedDrafts));
    setSelectedDrafts(new Set());
    setIsManageMode(false);
    if (activeDraftId && selectedDrafts.has(activeDraftId)) {
      setActiveDraftId(null);
    }
  };

  const handleClearAll = () => {
    clearDrafts();
    setSelectedDrafts(new Set());
    setIsManageMode(false);
    setActiveDraftId(null);
  };

  const toggleDraftSelection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelection = new Set(selectedDrafts);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedDrafts(newSelection);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex h-[calc(100vh-64px)] overflow-hidden"
    >
      {/* Sidebar for drafts list */}
      <div className="w-72 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 overflow-y-auto flex flex-col z-10 shadow-[2px_0_10px_rgba(0,0,0,0.02)]">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col gap-3 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm sticky top-0">
          <div className="flex justify-between items-center">
            <h2 className="font-display font-bold text-xs tracking-widest uppercase text-slate-500">Drafts</h2>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setIsManageMode(!isManageMode)}
                className={`text-xs font-bold px-2 py-1 rounded transition-colors ${isManageMode ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800'}`}
              >
                {isManageMode ? 'Done' : 'Manage'}
              </button>
              <button 
                onClick={handleCreateNew}
                className="text-accent hover:text-blue-700 w-7 h-7 flex items-center justify-center text-lg font-bold rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                title="New Draft"
              >
                +
              </button>
            </div>
          </div>
          
          {/* Management Controls */}
          <AnimatePresence>
            {isManageMode && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-col gap-2 overflow-hidden"
              >
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (selectedDrafts.size === drafts.length) {
                        setSelectedDrafts(new Set());
                      } else {
                        setSelectedDrafts(new Set(drafts.map(d => d.id)));
                      }
                    }}
                    className="flex-1 text-xs px-2 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded transition-colors"
                  >
                    {selectedDrafts.size === drafts.length ? 'Deselect All' : 'Select All'}
                  </button>
                  <button
                    onClick={handleDeleteSelected}
                    disabled={selectedDrafts.size === 0}
                    className="flex-1 text-xs px-2 py-1.5 bg-red-100 hover:bg-red-200 dark:bg-red-900/40 dark:hover:bg-red-900/60 text-red-700 dark:text-red-300 rounded transition-colors disabled:opacity-50"
                  >
                    Delete ({selectedDrafts.size})
                  </button>
                </div>
                <button
                  onClick={handleClearAll}
                  className="w-full text-xs px-2 py-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                >
                  Clear All Drafts
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex-1 p-3 space-y-2">
          <AnimatePresence>
            {drafts.map((draft, index) => (
              <motion.div 
                key={draft.id} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                className={`p-3 rounded-xl cursor-pointer group flex items-center gap-3 transition-all duration-200 shadow-sm ${activeDraftId === draft.id ? 'bg-primary text-white shadow-md' : 'bg-white dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 border border-transparent dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600'}`}
                onClick={() => {
                  if (isManageMode) {
                    toggleDraftSelection(draft.id, { stopPropagation: () => {} } as any);
                  } else {
                    setActiveDraftId(draft.id);
                  }
                }}
              >
                {isManageMode && (
                  <div className="flex-shrink-0" onClick={(e) => toggleDraftSelection(draft.id, e)}>
                    <input 
                      type="checkbox" 
                      checked={selectedDrafts.has(draft.id)} 
                      onChange={() => {}}
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0 pr-2">
                  <div className="truncate text-sm font-bold">
                    {draft.title || 'Untitled'}
                  </div>
                  <div className={`text-[10px] mt-0.5 truncate ${activeDraftId === draft.id ? 'text-primary-200' : 'text-slate-400 dark:text-slate-500'}`}>
                    {new Date(draft.date).toLocaleDateString()}
                  </div>
                </div>
                {!isManageMode && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteDraft(draft.id);
                      if (activeDraftId === draft.id) setActiveDraftId(null);
                    }}
                    className={`opacity-0 group-hover:opacity-100 flex-shrink-0 p-1.5 rounded-md text-xs transition-opacity ${activeDraftId === draft.id ? 'text-primary-100 hover:text-white hover:bg-primary-600' : 'text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'}`}
                    title="Delete Draft"
                  >
                    ×
                  </button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Editor Main Area */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={activeDraft.id}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
          className="flex-1 flex flex-col min-w-0 bg-white dark:bg-slate-950"
        >
          <div className="border-b border-slate-200 dark:border-slate-800 p-6 bg-white dark:bg-slate-950">
            <input
              type="text"
              value={localDraft?.title ?? ''}
              onChange={handleTitleChange}
              placeholder="Post Title"
              className="w-full text-4xl font-display font-bold bg-transparent outline-none placeholder:text-slate-300 dark:placeholder:text-slate-700 text-slate-900 dark:text-white transition-colors"
            />
            <div className="mt-2 flex items-center">
              <span className="text-slate-400 dark:text-slate-500 text-sm mr-2 font-mono">/blog/</span>
              <input
                type="text"
                value={localDraft?.slug ?? ''}
                onChange={handleSlugChange}
                placeholder="post-slug"
                className="text-sm font-mono bg-transparent outline-none placeholder:text-slate-300 dark:placeholder:text-slate-700 text-slate-600 dark:text-slate-400 border-b border-transparent hover:border-slate-200 focus:border-slate-300 dark:hover:border-slate-700 dark:focus:border-slate-600 transition-colors py-0.5"
              />
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="text-xs font-medium text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Last updated: {new Date(activeDraft.date).toLocaleString()}
              </div>
              
              {/* View Toggle */}
              <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('edit')}
                  className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 text-xs font-bold transition-colors ${viewMode === 'edit' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  <Edit3 size={14} /> Edit
                </button>
                <button
                  onClick={() => setViewMode('split')}
                  className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 text-xs font-bold transition-colors ${viewMode === 'split' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  <Layout size={14} /> Split
                </button>
                <button
                  onClick={() => setViewMode('preview')}
                  className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 text-xs font-bold transition-colors ${viewMode === 'preview' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  <Eye size={14} /> Preview
                </button>
              </div>
            </div>
          </div>

          {/* Split Pane */}
          <div className="flex-1 flex flex-col md:flex-row min-h-0 bg-slate-50/50 dark:bg-slate-950">
            {/* Editor */}
            {(viewMode === 'edit' || viewMode === 'split') && (
              <div className={`flex-1 flex flex-col border-b md:border-b-0 ${viewMode === 'split' ? 'md:border-r border-slate-200 dark:border-slate-800' : ''}`}>
                <div className="flex justify-between items-center bg-slate-100 dark:bg-slate-800/50 p-2 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => handleFormat('bold')}
                      className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                      title="Bold"
                    >
                      <Bold size={16} />
                    </button>
                    <button 
                      onClick={() => handleFormat('italic')}
                      className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                      title="Italic"
                    >
                      <Italic size={16} />
                    </button>
                    <button 
                      onClick={() => handleFormat('link')}
                      className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                      title="Link"
                    >
                      <LinkIcon size={16} />
                    </button>
                  </div>
                  <button 
                    onClick={handleSavePost}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-md text-xs font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    {isSaving ? (
                       <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                       <Save size={14} />
                    )}
                    {isSaving ? 'Saving...' : 'Save File'}
                  </button>
                </div>
                <textarea
                  ref={textareaRef}
                  value={localDraft?.content ?? ''}
                  onChange={handleContentChange}
                  placeholder="Start writing in Markdown..."
                  className="w-full flex-grow resize-none bg-transparent outline-none font-mono text-sm leading-relaxed text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-600 p-6"
                />
              </div>
            )}

            {/* Preview */}
            {(viewMode === 'preview' || viewMode === 'split') && (
              <div className="flex-1 p-8 overflow-y-auto bg-white dark:bg-slate-900 shadow-inner">
                {(() => {
                  const { data, content: mdContent } = parseFrontmatter(localDraft?.content ?? '');
                  return (
                    <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-display prose-a:text-accent">
                      {data.image && (
                        <img src={data.image} alt="Hero" className="w-full h-64 object-cover rounded-xl mb-8" />
                      )}
                      {data.title && (
                        <h1 className="mb-2">{data.title}</h1>
                      )}
                      {data.description && (
                        <p className="text-xl text-slate-500 dark:text-slate-400 mt-0 mb-8">{data.description}</p>
                      )}
                      <ReactMarkdown>{mdContent}</ReactMarkdown>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
