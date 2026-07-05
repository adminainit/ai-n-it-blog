import fs from 'fs';
let content = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

const settingsTabCode = `        {activeTab === 'settings' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ThemeConfigurator />
          </motion.div>
        )}`;

const GithubDeployerCode = `function GithubDeployer() {
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
        Deploy your site directly to GitHub Pages from this interface. This will initialize git, commit all files, and force push to the \`main\` branch of your repository.
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
          <p className="text-xs text-slate-500 mt-1">Needs \`repo\` and \`workflow\` scopes.</p>
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
`;

const deployTabCode = `        {activeTab === 'deploy' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GithubDeployer />
          </motion.div>
        )}`;

// Check if GithubDeployer is already injected
if (!content.includes('GithubDeployer')) {
  // Inject component before default export
  content = content.replace("export default function AdminDashboard", GithubDeployerCode + "\nexport default function AdminDashboard");
  // Inject tab render
  content = content.replace(settingsTabCode, settingsTabCode + "\n" + deployTabCode);
  fs.writeFileSync('src/components/AdminDashboard.tsx', content);
}
