const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf-8');

const replacement = `function DeploymentSettings() {
  const [pat, setPat] = useState('');
  const [username, setUsername] = useState('');
  const [repo, setRepo] = useState('');
  const [deploying, setDeploying] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [saveConfig, setSaveConfig] = useState(true);
  
  const [validating, setValidating] = useState(false);
  const [validationSuccess, setValidationSuccess] = useState<boolean | null>(null);
  
  const [workflowRuns, setWorkflowRuns] = useState<any[]>([]);
  const [fetchingLogs, setFetchingLogs] = useState(false);
  const [logsError, setLogsError] = useState('');

  React.useEffect(() => {
    fetch('/api/deploy-config')
      .then(res => res.json())
      .then(data => {
        if (data.username) setUsername(data.username);
        if (data.repo) setRepo(data.repo);
        if (data.pat) {
          setPat(data.pat);
          // Auto-fetch logs if we have credentials
          if (data.username && data.repo) {
            fetchWorkflowRuns(data.username, data.repo, data.pat);
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleValidate = async () => {
    if (!pat || !username || !repo) {
      setError('Please fill in all fields to validate.');
      return;
    }
    setValidating(true);
    setError('');
    setValidationSuccess(null);
    try {
      const response = await fetch(\`https://api.github.com/repos/\${username}/\${repo}\`, {
        headers: {
          Authorization: \`token \${pat}\`,
          Accept: 'application/vnd.github.v3+json'
        }
      });
      if (response.ok) {
        setValidationSuccess(true);
        fetchWorkflowRuns(username, repo, pat);
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Validation failed');
      }
    } catch (err: any) {
      setError(\`Validation failed: \${err.message}\`);
      setValidationSuccess(false);
    } finally {
      setValidating(false);
    }
  };
  
  const fetchWorkflowRuns = async (u: string, r: string, p: string) => {
    setFetchingLogs(true);
    setLogsError('');
    try {
      const response = await fetch(\`https://api.github.com/repos/\${u}/\${r}/actions/runs?per_page=5\`, {
        headers: {
          Authorization: \`token \${p}\`,
          Accept: 'application/vnd.github.v3+json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setWorkflowRuns(data.workflow_runs || []);
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to fetch logs');
      }
    } catch (err: any) {
      setLogsError(\`Could not fetch deployment logs: \${err.message}\`);
    } finally {
      setFetchingLogs(false);
    }
  };

  const handleDeploy = async () => {
    if (!pat || !username || !repo) {
      setError('Please fill in all fields.');
      return;
    }
    setDeploying(true);
    setLogs(['Starting deployment...']);
    setError('');

    try {
      if (saveConfig) {
        await fetch('/api/deploy-config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, repo, pat })
        });
      }
      
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
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Automated GitHub Pages Deployment</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          Deploy your site directly to GitHub Pages from this interface. This will securely build the static site and force push ONLY the compiled \`dist\` directory to the \`main\` branch, keeping your source code and admin portal private.
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
          
          <div className="flex items-center gap-2 mt-4 mb-2">
            <input 
              type="checkbox" 
              id="saveConfig"
              checked={saveConfig}
              onChange={(e) => setSaveConfig(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="saveConfig" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Save credentials securely in local database
            </label>
          </div>
          
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}
          {validationSuccess && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
              <CheckCircle size={16} />
              Credentials validated successfully!
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleValidate}
              disabled={validating}
              className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-bold transition-all flex items-center gap-2"
            >
              {validating ? <RefreshCw size={16} className="animate-spin" /> : <Check size={16} />}
              {validating ? 'Checking...' : 'Check Status'}
            </button>
            <button
              onClick={handleDeploy}
              disabled={deploying}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-sm font-bold transition-all shadow-sm flex items-center gap-2"
            >
              <Rocket size={16} />
              {deploying ? 'Deploying...' : 'Deploy to GitHub'}
            </button>
          </div>
        </div>

        {logs.length > 0 && (
          <div className="bg-slate-950 rounded-lg p-4 font-mono text-xs text-slate-300 overflow-x-auto h-64 overflow-y-auto mb-6">
            {logs.map((log, i) => (
              <div key={i} className="whitespace-pre-wrap">{log}</div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity size={20} />
            GitHub Actions Deployment Logs
          </h2>
          <button 
            onClick={() => fetchWorkflowRuns(username, repo, pat)}
            disabled={fetchingLogs || !username || !repo || !pat}
            className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors disabled:opacity-50"
            title="Refresh logs"
          >
            <RefreshCw size={16} className={fetchingLogs ? "animate-spin" : ""} />
          </button>
        </div>

        {logsError && (
          <div className="p-3 mb-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-sm text-yellow-700 dark:text-yellow-400">
            {logsError}
          </div>
        )}

        {workflowRuns.length === 0 && !fetchingLogs && !logsError ? (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400 text-sm">
            No recent workflow runs found, or credentials not provided.
          </div>
        ) : (
          <div className="space-y-3">
            {workflowRuns.map((run) => (
              <div key={run.id} className="flex items-start justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {run.status === 'completed' ? (
                      run.conclusion === 'success' ? (
                        <CheckCircle size={18} className="text-green-500" />
                      ) : (
                        <XCircle size={18} className="text-red-500" />
                      )
                    ) : (
                      <RefreshCw size={18} className="text-blue-500 animate-spin" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                      {run.name || 'Deployment Workflow'}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {run.display_title || 'Push to main'}
                    </p>
                    <div className="flex gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400">
                      <span>{new Date(run.created_at).toLocaleString()}</span>
                      <span>•</span>
                      <span>{run.status === 'completed' ? run.conclusion : run.status}</span>
                    </div>
                    {run.conclusion === 'failure' && (
                      <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/50 rounded-lg text-xs text-red-700 dark:text-red-300">
                        <strong>Action Required:</strong> Check if this failure is related to Node.js version errors. Make sure your <code>.github/workflows/deploy.yml</code> uses <code>node-version: "22"</code> as documented in the Documentation tab.
                      </div>
                    )}
                  </div>
                </div>
                <a 
                  href={run.html_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  View Details
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}`;

const startIdx = code.indexOf('function DeploymentSettings() {');
const endIdx = code.indexOf('export default function AdminDashboard');
if (startIdx !== -1 && endIdx !== -1) {
  code = code.substring(0, startIdx) + replacement + '\n\n' + code.substring(endIdx);
  fs.writeFileSync('src/components/AdminDashboard.tsx', code);
}
