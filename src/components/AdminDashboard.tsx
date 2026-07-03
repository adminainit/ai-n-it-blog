import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, Trash2, Plus, Settings, Eye, FileText, Upload, X, Palette } from 'lucide-react';
import { siteConfig } from '../../site.config';
import mammoth from 'mammoth';
import TurndownService from 'turndown';
import ThemeConfigurator from './ThemeConfigurator';

interface Post {
  id: string;
  title: string;
  date: string;
  draft: boolean;
}

interface AdminDashboardProps {
  posts: Post[];
}

export default function AdminDashboard({ posts: initialPosts }: AdminDashboardProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [activeTab, setActiveTab] = useState<'posts' | 'settings'>('posts');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creationMode, setCreationMode] = useState<'choose' | 'write' | 'import'>('choose');
  const [isConverting, setIsConverting] = useState(false);
  const [convertedMarkdown, setConvertedMarkdown] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).toUpperCase();
  };

  const toggleDraftStatus = (id: string) => {
    setPosts(posts.map(post => 
      post.id === id ? { ...post, draft: !post.draft } : post
    ));
    alert('Draft status toggled! Note: As this is a static site, you must also update the markdown frontmatter (draft: true/false) to apply this change permanently.');
  };

  const deletePost = (id: string) => {
    if (confirm('Are you sure you want to hide this post from the dashboard?')) {
      setPosts(posts.filter(post => post.id !== id));
      alert('Post removed from view! Note: You must manually delete the markdown file from src/content/posts/ to remove it permanently.');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsConverting(true);
    try {
      let markdown = '';
      let title = file.name.replace(/\.[^/.]+$/, "");

      if (file.name.endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        const html = result.value;
        const turndownService = new TurndownService({ headingStyle: 'atx' });
        markdown = turndownService.turndown(html);
      } else if (file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        markdown = await file.text();
      } else {
        alert('Unsupported file format. Please upload .docx, .txt, or .md files.');
        setIsConverting(false);
        return;
      }
      
      const frontmatter = `---
title: "${title}"
description: "Generated from ${file.name}"
date: "${new Date().toISOString().split('T')[0]}"
image: "https://picsum.photos/seed/${title.replace(/[^a-zA-Z0-9]/g, '')}/800/600"
tags: ["imported"]
draft: true
---

`;
      setConvertedMarkdown(frontmatter + markdown);
      setCreationMode('write');
    } catch (error) {
      console.error("Error converting document:", error);
      alert("Failed to convert document.");
    } finally {
      setIsConverting(false);
    }
  };

  const startFromScratch = () => {
    const template = `---
title: "New Post Title"
description: "A brief description of your post."
date: "${new Date().toISOString().split('T')[0]}"
image: "https://picsum.photos/seed/newpost/800/600"
tags: ["blog"]
draft: true
---

Write your markdown content here...
`;
    setConvertedMarkdown(template);
    setCreationMode('write');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCreationMode('choose');
    setConvertedMarkdown('');
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 flex-shrink-0">
        <nav className="flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab('posts')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'posts' ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200 dark:shadow-none' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <FileText size={18} />
            Posts
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'settings' ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200 dark:shadow-none' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <Settings size={18} />
            Settings
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow">
        {activeTab === 'posts' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm"
          >
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">All Posts</h2>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-xs font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
              >
                <Plus size={16} />
                New Post
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Title</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Date</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-sm text-slate-900 dark:text-white">{post.title}</div>
                        <div className="text-[11px] text-slate-500 mt-1 font-mono">{post.id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${post.draft ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                          {post.draft ? 'Draft' : 'Published'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                        {formatDate(post.date)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" title="View">
                            <Eye size={16} />
                          </button>
                          <button onClick={() => toggleDraftStatus(post.id)} className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" title="Toggle Draft">
                            <Edit3 size={16} />
                          </button>
                          <button onClick={() => deletePost(post.id)} className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors" title="Delete">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {posts.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-500">
                        No posts found. Create your first post!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ThemeConfigurator />
          </motion.div>
        )}
      </div>

      {/* New Post Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Plus size={18} />
                  Create New Post
                </h3>
                <button 
                  onClick={closeModal}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-grow flex flex-col gap-6">
                {creationMode === 'choose' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button 
                      onClick={startFromScratch}
                      className="flex flex-col items-center justify-center border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 rounded-xl p-8 text-center bg-white dark:bg-slate-800 transition-all hover:shadow-md"
                    >
                      <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mb-4">
                        <Edit3 size={24} />
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Write Post</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Start from a blank template with a Markdown editor.</p>
                    </button>
                    
                    <button 
                      onClick={() => setCreationMode('import')}
                      className="flex flex-col items-center justify-center border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 rounded-xl p-8 text-center bg-white dark:bg-slate-800 transition-all hover:shadow-md"
                    >
                      <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mb-4">
                        <Upload size={24} />
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Import File</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Upload a .docx, .md, or .txt file to convert automatically.</p>
                    </button>
                  </div>
                )}

                {creationMode === 'import' && (
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-10 text-center bg-slate-50 dark:bg-slate-800/50">
                    <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mb-4">
                      {isConverting ? (
                        <div className="w-6 h-6 border-2 border-indigo-600 dark:border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Upload size={28} />
                      )}
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                      {isConverting ? 'Converting Document...' : 'Import Document'}
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-sm">
                      Upload a Microsoft Word (.docx), Text (.txt), or Markdown (.md) document. We'll automatically convert its contents.
                    </p>
                    <input 
                      type="file" 
                      accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.txt,.md" 
                      className="hidden" 
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      disabled={isConverting}
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isConverting}
                      className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                      Select File
                    </button>
                  </div>
                )}
                
                {creationMode === 'write' && (
                  <div className="flex flex-col gap-2 h-full min-h-[400px]">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Markdown Editor</label>
                      <button 
                        onClick={() => navigator.clipboard.writeText(convertedMarkdown)}
                        className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
                      >
                        Copy to Clipboard
                      </button>
                    </div>
                    <textarea 
                      value={convertedMarkdown}
                      onChange={(e) => setConvertedMarkdown(e.target.value)}
                      className="w-full flex-grow px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-mono focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors resize-none"
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                      Review and edit your markdown. Once ready, download the .mdx file and save it in your `src/content/posts/` directory.
                    </p>
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-end gap-3">
                <button 
                  onClick={closeModal}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-sm font-bold transition-colors"
                >
                  Cancel
                </button>
                {creationMode === 'write' && convertedMarkdown && (
                  <button 
                    onClick={() => {
                      const element = document.createElement("a");
                      const file = new Blob([convertedMarkdown], {type: 'text/markdown'});
                      element.href = URL.createObjectURL(file);
                      // try to extract title from frontmatter
                      const titleMatch = convertedMarkdown.match(/title:\s*"(.*?)"/);
                      const fileName = titleMatch ? titleMatch[1].toLowerCase().replace(/\s+/g, '-') + '.mdx' : 'new-post.mdx';
                      element.download = fileName;
                      document.body.appendChild(element);
                      element.click();
                      document.body.removeChild(element);
                    }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-sm shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-colors"
                  >
                    Download .mdx File
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
