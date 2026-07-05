import fs from 'fs';
let content = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

content = content.replace(
  "const [activeTab, setActiveTab] = useState<'posts' | 'settings'>('posts');",
  "const [activeTab, setActiveTab] = useState<'posts' | 'settings' | 'deploy'>('posts');"
);

const tabsHtmlOld = `          <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('posts')}
              className={\`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all \${activeTab === 'posts' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}\`}
            >
              Drafts & Posts
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={\`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all \${activeTab === 'settings' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}\`}
            >
              Site Settings
            </button>
          </div>`;

const tabsHtmlNew = `          <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1 rounded-xl overflow-x-auto">
            <button
              onClick={() => setActiveTab('posts')}
              className={\`whitespace-nowrap px-6 py-2.5 rounded-lg text-sm font-semibold transition-all \${activeTab === 'posts' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}\`}
            >
              Drafts & Posts
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={\`whitespace-nowrap px-6 py-2.5 rounded-lg text-sm font-semibold transition-all \${activeTab === 'settings' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}\`}
            >
              Site Settings
            </button>
            <button
              onClick={() => setActiveTab('deploy')}
              className={\`whitespace-nowrap px-6 py-2.5 rounded-lg text-sm font-semibold transition-all \${activeTab === 'deploy' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}\`}
            >
              GitHub Deploy
            </button>
          </div>`;

content = content.replace(tabsHtmlOld, tabsHtmlNew);
fs.writeFileSync('src/components/AdminDashboard.tsx', content);
