import React, { useState } from 'react';
import { BlogManagerProvider, useBlogManager } from './BlogManager';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from './Layout';
import AdminDashboard from './AdminDashboard';
import PostEditor from './PostEditor';
import { ArrowLeft } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  date: string;
  draft: boolean;
  rawContent?: string;
}

interface AdminAppProps {
  initialPosts: Post[];
}

function AdminAppContent() {
  const { posts, isSyncing, syncStatus, savePostLocal, syncToBackend, deletePostLocal } = useBlogManager();
  const [view, setView] = useState<'dashboard' | 'editor'>('dashboard');
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setView('editor');
  };

  const handleCreateNew = () => {
    setEditingPost(null);
    setView('editor');
  };

  return (
    <Layout>
      <AnimatePresence mode="wait">
        {view === 'dashboard' ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1"
          >
            <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-12 md:py-20">
              <header className="mb-12 border-b border-slate-200 dark:border-slate-800 pb-8 flex items-center justify-between">
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
                    Admin Dashboard
                  </h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Manage your blog posts, media, and site settings.
                  </p>
                </div>
                <button
                  onClick={handleCreateNew}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors shadow-sm"
                >
                  Go to Editor
                </button>
              </header>

              <AdminDashboard 
    posts={posts} 
    onEditPost={handleEditPost}
    onDeletePost={deletePostLocal}
    syncStatus={syncStatus}
    isSyncing={isSyncing}
    syncToBackend={syncToBackend}
    savePostLocal={savePostLocal}
  />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="editor"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col"
          >
            <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-3 flex items-center justify-between">
              <button
                onClick={() => {
                  setView('dashboard');
                  setEditingPost(null);
                }}
                className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft size={16} />
                Back to Dashboard
              </button>
            </div>
            <PostEditor initialPost={editingPost} />
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}


export default function AdminApp({ initialPosts }: AdminAppProps) {
  return (
    <BlogManagerProvider initialPosts={initialPosts}>
      <AdminAppContent />
    </BlogManagerProvider>
  );
}
