import fs from 'fs';

let content = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

content = content.replace(
  '<h2 className="text-xl font-bold text-slate-900 dark:text-white">All Posts</h2>',
  `<h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-4">
    All Posts
    {isSyncing && <span className="text-sm text-indigo-500 font-bold flex items-center gap-2"><div className="w-3 h-3 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div> Syncing...</span>}
    {!isSyncing && syncStatus === 'success' && <span className="text-sm text-green-600 font-bold flex items-center gap-1">✓ Synced</span>}
    {!isSyncing && syncStatus === 'error' && <span className="text-sm text-red-600 font-bold flex items-center gap-1">✗ Sync Failed</span>}
  </h2>`
);

fs.writeFileSync('src/components/AdminDashboard.tsx', content);
