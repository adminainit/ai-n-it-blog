const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf-8');

const lucideImportMatch = code.match(/import \{ ([^}]+) \} from 'lucide-react';/);
if (lucideImportMatch) {
  if (!lucideImportMatch[1].includes('Copy')) {
    code = code.replace(lucideImportMatch[0], "import { " + lucideImportMatch[1] + ", Copy, Check, Activity, CheckCircle, XCircle, RefreshCw } from 'lucide-react';");
  }
}

const docsCode = `
function Documentation() {
  const [copiedId, setCopiedId] = useState('');

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(''), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">GitHub Deployment Documentation</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Node Version */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">1. Fix Node.js Version Error</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
            Astro 7.0.4 requires Node.js &gt;= 22.12.0. The default GitHub Actions runner deprecates Node 20. Update your <code>.github/workflows/deploy.yml</code>:
          </p>
          <div className="relative bg-slate-900 rounded-lg overflow-hidden group">
            <button 
              onClick={() => copyToClipboard('          node-version: "22"', 'node')}
              className="absolute right-2 top-2 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
              title="Copy"
            >
              {copiedId === 'node' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
            </button>
            <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto">
{ \`    steps:
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "22"
          cache: "npm"\` }
            </pre>
          </div>
        </div>

        {/* Card 2: Generate PAT */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">2. Generate Personal Access Token</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
            To automate deployments or fetch logs via API, you need a Personal Access Token (PAT).
          </p>
          <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700 dark:text-slate-300 ml-2">
            <li>Go to GitHub <strong>Settings &gt; Developer settings &gt; Personal access tokens &gt; Tokens (classic)</strong>.</li>
            <li>Click <strong>Generate new token (classic)</strong>.</li>
            <li>Select the scopes: <strong><code>repo</code></strong> and <strong><code>workflow</code></strong>.</li>
            <li>Generate and copy the token securely.</li>
          </ol>
        </div>

        {/* Card 3: Save PAT */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">3. Save Credentials</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
            Navigate to the <strong>Deployment</strong> tab in this dashboard. Enter your GitHub username, repository, and your new PAT. 
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Check the "Save credentials securely in local database" box. This ensures future deployments and log fetching work seamlessly without re-entering the PAT.
          </p>
        </div>

        {/* Card 4: Action Secrets */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">4. Repository Secrets (Optional)</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
            If you're relying entirely on GitHub Actions (pushing code to trigger builds), add the PAT as a secret in your repo.
          </p>
          <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700 dark:text-slate-300 ml-2">
            <li>Go to repo <strong>Settings &gt; Secrets and variables &gt; Actions</strong>.</li>
            <li>Click <strong>New repository secret</strong>.</li>
            <li>Name it <code>PAT</code>.</li>
            <li>Paste your token and save.</li>
          </ol>
        </div>

      </div>
    </div>
  );
}
`;

const oldDocsRegex = /function Documentation\(\) \{[\s\S]*?\}\s*function DeploymentSettings\(\) \{/m;
code = code.replace(oldDocsRegex, docsCode + '\nfunction DeploymentSettings() {');

fs.writeFileSync('src/components/AdminDashboard.tsx', code);
