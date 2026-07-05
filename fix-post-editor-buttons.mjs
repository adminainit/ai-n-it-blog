import fs from 'fs';
let content = fs.readFileSync('src/components/PostEditor.tsx', 'utf8');

// Replace the icon-only buttons with text+icon buttons
content = content.replace(
  `                <button
                  onClick={() => setViewMode('edit')}
                  className={\`p-1.5 rounded-md flex items-center justify-center transition-colors \${viewMode === 'edit' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}\`}
                  title="Edit Mode"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  onClick={() => setViewMode('split')}
                  className={\`p-1.5 rounded-md flex items-center justify-center transition-colors \${viewMode === 'split' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}\`}
                  title="Split Mode"
                >
                  <Layout size={16} />
                </button>
                <button
                  onClick={() => setViewMode('preview')}
                  className={\`p-1.5 rounded-md flex items-center justify-center transition-colors \${viewMode === 'preview' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}\`}
                  title="Preview Mode"
                >
                  <Eye size={16} />
                </button>`,
  `                <button
                  onClick={() => setViewMode('edit')}
                  className={\`px-3 py-1.5 rounded-md flex items-center gap-1.5 text-xs font-bold transition-colors \${viewMode === 'edit' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}\`}
                >
                  <Edit3 size={14} /> Edit
                </button>
                <button
                  onClick={() => setViewMode('split')}
                  className={\`px-3 py-1.5 rounded-md flex items-center gap-1.5 text-xs font-bold transition-colors \${viewMode === 'split' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}\`}
                >
                  <Layout size={14} /> Split
                </button>
                <button
                  onClick={() => setViewMode('preview')}
                  className={\`px-3 py-1.5 rounded-md flex items-center gap-1.5 text-xs font-bold transition-colors \${viewMode === 'preview' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}\`}
                >
                  <Eye size={14} /> Preview
                </button>`
);

fs.writeFileSync('src/components/PostEditor.tsx', content);
