import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, Trash2, Plus, Settings, Eye, EyeOff, FileText, Upload, X, Palette, Bold, Italic, Link as LinkIcon, Save, Rocket } from 'lucide-react';
import { siteConfig } from '../../site.config';
import mammoth from 'mammoth';
import TurndownService from 'turndown';
import ThemeConfigurator from './ThemeConfigurator';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface Post {
  id: string;
  title: string;
  date: string;
  draft: boolean;
  rawContent?: string;
}

interface AdminDashboardProps {
  posts: Post[];
  onEditPost?: (post: Post) => void;
}

function GithubDeployer() {
  const [pat, setPat] = useState('');
  const [username, setUsername] = useState('');
  const [repo, setRepo] = useState('');
  const [deploying, setDeploying] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState('');

  const handleDeploy = async () => {
    if (!pat || !username || !repo) {
      setError('Please fill in all fields.');
      return;
    }
    setDeploying(true);
    setLogs(['Starting deployment...']);
    setError('');

    try {
      const res = await fetch('/api/deploy-github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pat, username, repo })
      });
      const data = await res.json();
      if (data.logs) setLogs(prev => [...prev, ...data.logs]);
      if (!res.ok) {
        throw new Error(data.error || 'Deployment failed');
      }
      setLogs(prev => [...prev, 'Deployment successful!']);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeploying(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Automated GitHub Pages Deployment</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        Deploy your site directly to GitHub Pages from this interface. This will initialize git, commit all files, and force push to the `main` branch of your repository.
      </p>
      
      <div className="space-y-4 max-w-xl mb-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">GitHub Username</label>
          <input 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. johndoe"
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Repository Name</label>
          <input 
            type="text" 
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            placeholder="e.g. my-blog"
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Personal Access Token (Classic)</label>
          <input 
            type="password" 
            value={pat}
            onChange={(e) => setPat(e.target.value)}
            placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
          />
          <p className="text-xs text-slate-500 mt-1">Needs `repo` and `workflow` scopes.</p>
        </div>
        
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <button
          onClick={handleDeploy}
          disabled={deploying}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-sm font-bold transition-all shadow-sm flex items-center gap-2"
        >
          {deploying ? 'Deploying...' : 'Deploy to GitHub'}
        </button>
      </div>

      {logs.length > 0 && (
        <div className="bg-slate-950 rounded-lg p-4 font-mono text-xs text-slate-300 overflow-x-auto h-64 overflow-y-auto">
          {logs.map((log, i) => (
            <div key={i} className="whitespace-pre-wrap">{log}</div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard({ posts, onEditPost, onDeletePost, syncStatus, isSyncing, syncToBackend, savePostLocal }: any) {
  const [activeTab, setActiveTab] = useState<'posts' | 'settings' | 'deploy'>('posts');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creationMode, setCreationMode] = useState<'choose' | 'write' | 'import'>('choose');
  const [isConverting, setIsConverting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [convertedMarkdown, setConvertedMarkdown] = useState('');
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).toUpperCase();
  };

  const toggleDraftStatus = async (post: Post) => {
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
          newRaw = newRaw.replace('---\n', '---\ndraft: ' + updatedPost.draft + '\n');
        }
        updatedPost.rawContent = newRaw;
      }
      
      if (savePostLocal) await savePostLocal(updatedPost);
      if (syncToBackend) await syncToBackend(updatedPost);
    } catch (err) {
      console.error(err);
      alert('Failed to update draft status.');
    }
  };

  const deletePost = (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      if (onDeletePost) onDeletePost(id);
    }
  };

  const editPost = (post: Post) => {
    if (onEditPost) {
      onEditPost(post);
    } else {
      setEditingPostId(post.id);
      setConvertedMarkdown(post.rawContent || '');
      setCreationMode('write');
      setIsModalOpen(true);
    }
  };

  const handleFormat = (type: 'bold' | 'italic' | 'link') => {
    if (!textareaRef.current) return;
    
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const text = convertedMarkdown;
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
    setConvertedMarkdown(newContent);
    
    // Focus back and set selection
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newPos = start + inserted.length;
        if (!selected && type === 'link') {
          // select "url"
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
    if (!convertedMarkdown) return;
    setIsSaving(true);
    try {
      const titleMatch = convertedMarkdown.match(/title:\s*"(.*?)"/);
      let fileName = editingPostId || (titleMatch ? titleMatch[1].toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.mdx' : 'new-post.mdx');
      if (!fileName.endsWith('.mdx')) {
         fileName += '.mdx';
      }
      
      const newPost = {
        id: fileName,
        title: titleMatch ? titleMatch[1] : 'Untitled',
        date: new Date().toISOString(),
        draft: false,
        rawContent: convertedMarkdown
      };
      
      if (savePostLocal) await savePostLocal(newPost);
      if (syncToBackend) await syncToBackend(newPost);

      alert('Post saved and synced successfully!');
      closeModal();
    } catch (err) {
      console.error(err);
      alert('An error occurred while saving the post.');
    } finally {
      setIsSaving(false);
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
    setEditingPostId(null);
  };

  const chartData = useMemo(() => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (29 - i));
      return d.toISOString().split('T')[0];
    });

    return last30Days.map(date => {
      const count = posts.filter((post: Post) => {
        if (!post.date) return false;
        try {
          return new Date(post.date).toISOString().startsWith(date);
        } catch(e) {
          return String(post.date).startsWith(date);
        }
      }).length;
      return {
        date: new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        posts: count
      };
    });
  }, [posts]);

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
          <button 
            onClick={() => setActiveTab('deploy')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'deploy' ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200 dark:shadow-none' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <Rocket size={18} />
            Deployment
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow">
        {activeTab === 'posts' && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-indigo-50 dark:bg-indigo-900/20 blur-2xl group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 transition-colors pointer-events-none"></div>
                <div className="relative flex flex-col gap-4">
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center">
                    <FileText size={24} />
                  </div>
                  <div>
                    <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{posts.length}</p>
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">Total Posts</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-green-50 dark:bg-green-900/20 blur-2xl group-hover:bg-green-100 dark:group-hover:bg-green-900/30 transition-colors pointer-events-none"></div>
                <div className="relative flex flex-col gap-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center">
                    <Eye size={24} />
                  </div>
                  <div>
                    <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{posts.filter(p => !p.draft).length}</p>
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">Published</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-amber-50 dark:bg-amber-900/20 blur-2xl group-hover:bg-amber-100 dark:group-hover:bg-amber-900/30 transition-colors pointer-events-none"></div>
                <div className="relative flex flex-col gap-4">
                  <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center">
                    <EyeOff size={24} />
                  </div>
                  <div>
                    <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{posts.filter(p => p.draft).length}</p>
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">Drafts</p>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm"
            >
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Post Activity (Last 30 Days)</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      cursor={{ fill: '#f1f5f9', opacity: 0.1 }}
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                      itemStyle={{ color: '#818cf8' }}
                    />
                    <Bar dataKey="posts" fill="#4f46e5" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl p-5"
            >
              <h3 className="font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-2 mb-2">
                <FileText size={18} />
                How to manage posts
              </h3>
              <ul className="text-sm text-indigo-800 dark:text-indigo-400 space-y-1 ml-6 list-disc">
                <li><strong>Drafts vs. Posts:</strong> The editor saves drafts automatically to your browser storage. These are invisible to the website until saved as a post file.</li>
                <li><strong>Save:</strong> Click the "Save File" button in the editor. This converts your draft into a `.mdx` file in the <code>src/content/posts/</code> folder on the server.</li>
                <li><strong>Publish:</strong> Once saved to the server, ensure <code>draft: false</code> is set in the top frontmatter of the file to make it public on the website.</li>
                <li><strong>Build:</strong> The application may need a re-build (or will hot-reload in dev) to see newly published posts online.</li>
              </ul>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm"
            >
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-4">
    All Posts
    {isSyncing && <span className="text-sm text-indigo-500 font-bold flex items-center gap-2"><div className="w-3 h-3 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div> Syncing...</span>}
    {!isSyncing && syncStatus === 'success' && <span className="text-sm text-green-600 font-bold flex items-center gap-1">✓ Synced</span>}
    {!isSyncing && syncStatus === 'error' && <span className="text-sm text-red-600 font-bold flex items-center gap-1">✗ Sync Failed</span>}
  </h2>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-grow md:flex-grow-0 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-xs font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shrink-0"
                  >
                    <Plus size={16} />
                    New Post
                  </button>
                </div>
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
                  {posts.filter((post: Post) => post.title.toLowerCase().includes(searchQuery.toLowerCase()) || post.id.toLowerCase().includes(searchQuery.toLowerCase())).map((post: Post) => (
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
                          <button onClick={() => toggleDraftStatus(post)} className="p-1.5 text-slate-400 hover:text-green-600 dark:hover:text-green-400 transition-colors" title={post.draft ? "Publish" : "Unpublish"}>
                            {post.draft ? <Eye size={16} /> : <EyeOff size={16} />}
                          </button>
                          <button onClick={() => editPost(post)} className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" title="Edit Post">
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
          </div>
        )}

        {activeTab === 'settings' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ThemeConfigurator />
          </motion.div>
        )}
        {activeTab === 'deploy' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GithubDeployer />
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
                  <Edit3 size={18} />
                  {creationMode === 'choose' ? 'Create New Post' : 'Edit Post'}
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
                    <div className="flex justify-between items-center bg-slate-100 dark:bg-slate-800 p-2 rounded-t-lg border-b border-slate-200 dark:border-slate-700">
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
                        onClick={() => navigator.clipboard.writeText(convertedMarkdown)}
                        className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors mr-2"
                      >
                        Copy to Clipboard
                      </button>
                    </div>
                    <textarea 
                      ref={textareaRef}
                      value={convertedMarkdown}
                      onChange={(e) => setConvertedMarkdown(e.target.value)}
                      className="w-full flex-grow px-4 py-3 rounded-b-lg border border-t-0 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 text-sm font-mono focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors resize-none"
                      placeholder="Write your markdown here..."
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                      Review and edit your markdown. Click "Save & Publish" to update the site.
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
                    onClick={handleSavePost}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-sm shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    {isSaving ? (
                       <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                       <Save size={16} />
                    )}
                    {isSaving ? 'Saving...' : 'Save Post'}
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
