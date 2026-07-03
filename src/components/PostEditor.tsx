import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useBlogManager } from './BlogManager';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, Eye, Layout } from 'lucide-react';

export default function PostEditor() {
  const { drafts, addDraft, updateDraft, deleteDraft } = useBlogManager();
  const [activeDraftId, setActiveDraftId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'split' | 'edit' | 'preview'>('split');
  
  // Create a new draft on initial load if none exist
  useEffect(() => {
    if (drafts.length === 0) {
      addDraft({ title: 'New Post', slug: 'new-post', content: '# Welcome to the Editor\n\nStart typing here...' });
    }
  }, [drafts.length, addDraft]);

  // Set the first draft as active if none is selected
  useEffect(() => {
    if (!activeDraftId && drafts.length > 0) {
      setActiveDraftId(drafts[0].id);
    }
  }, [activeDraftId, drafts]);

  const activeDraft = drafts.find(d => d.id === activeDraftId) || drafts[0];

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
    updateDraft(activeDraft.id, { title: e.target.value });
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateDraft(activeDraft.id, { slug: e.target.value });
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateDraft(activeDraft.id, { content: e.target.value });
  };

  const handleCreateNew = () => {
    addDraft({ title: 'Untitled Draft', slug: 'untitled-draft', content: '' });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex h-[calc(100vh-64px)] overflow-hidden"
    >
      {/* Sidebar for drafts list */}
      <div className="w-64 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 overflow-y-auto flex flex-col z-10 shadow-[2px_0_10px_rgba(0,0,0,0.02)]">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm sticky top-0">
          <h2 className="font-display font-bold text-xs tracking-widest uppercase text-slate-500">Drafts</h2>
          <button 
            onClick={handleCreateNew}
            className="text-accent hover:text-blue-700 w-8 h-8 flex items-center justify-center text-lg font-bold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            +
          </button>
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
                className={`p-3 rounded-xl cursor-pointer group flex justify-between items-center transition-all duration-200 shadow-sm ${activeDraftId === draft.id ? 'bg-primary text-white shadow-md' : 'bg-white dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 border border-transparent dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600'}`}
                onClick={() => setActiveDraftId(draft.id)}
              >
                <div className="flex-1 min-w-0 pr-2">
                  <div className="truncate text-sm font-bold">
                    {draft.title || 'Untitled'}
                  </div>
                  <div className={`text-[10px] mt-0.5 truncate ${activeDraftId === draft.id ? 'text-primary-200' : 'text-slate-400 dark:text-slate-500'}`}>
                    {new Date(draft.date).toLocaleDateString()}
                  </div>
                </div>
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
              value={activeDraft.title}
              onChange={handleTitleChange}
              placeholder="Post Title"
              className="w-full text-4xl font-display font-bold bg-transparent outline-none placeholder:text-slate-300 dark:placeholder:text-slate-700 text-slate-900 dark:text-white transition-colors"
            />
            <div className="mt-2 flex items-center">
              <span className="text-slate-400 dark:text-slate-500 text-sm mr-2 font-mono">/blog/</span>
              <input
                type="text"
                value={activeDraft.slug || ''}
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
                  className={`p-1.5 rounded-md flex items-center justify-center transition-colors ${viewMode === 'edit' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                  title="Edit Mode"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  onClick={() => setViewMode('split')}
                  className={`p-1.5 rounded-md flex items-center justify-center transition-colors ${viewMode === 'split' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                  title="Split Mode"
                >
                  <Layout size={16} />
                </button>
                <button
                  onClick={() => setViewMode('preview')}
                  className={`p-1.5 rounded-md flex items-center justify-center transition-colors ${viewMode === 'preview' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                  title="Preview Mode"
                >
                  <Eye size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Split Pane */}
          <div className="flex-1 flex flex-col md:flex-row min-h-0 bg-slate-50/50 dark:bg-slate-950">
            {/* Editor */}
            {(viewMode === 'edit' || viewMode === 'split') && (
              <div className={`flex-1 border-b md:border-b-0 ${viewMode === 'split' ? 'md:border-r border-slate-200 dark:border-slate-800' : ''} p-6`}>
                <textarea
                  value={activeDraft.content}
                  onChange={handleContentChange}
                  placeholder="Start writing in Markdown..."
                  className="w-full h-full resize-none bg-transparent outline-none font-mono text-sm leading-relaxed text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                />
              </div>
            )}

            {/* Preview */}
            {(viewMode === 'preview' || viewMode === 'split') && (
              <div className="flex-1 p-8 overflow-y-auto bg-white dark:bg-slate-900 shadow-inner">
                <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-display prose-a:text-accent">
                  <ReactMarkdown>{activeDraft.content}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
