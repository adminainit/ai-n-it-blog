const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf-8');

code = code.replace(/import \{ ([^}]+) \} from 'lucide-react';/, "import { $1, BookOpen } from 'lucide-react';");

code = code.replace('function GithubDeployer() {', 'function DeploymentSettings() {');
code = code.replace(/<GithubDeployer \/>/g, '<DeploymentSettings />');

code = code.replace("useState<'posts' | 'settings' | 'deploy'>('posts');", "useState<'posts' | 'settings' | 'deploy' | 'docs'>('posts');");

const docsTab = `          <button 
            onClick={() => setActiveTab('docs')}
            className={\`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all \${activeTab === 'docs' ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200 dark:shadow-none' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}\`}
          >
            <BookOpen size={18} />
            Documentation
          </button>
        </nav>`;

code = code.replace('        </nav>', docsTab);

const docsComponentRender = `        {activeTab === 'deploy' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <DeploymentSettings />
          </motion.div>
        )}
        {activeTab === 'docs' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Documentation />
          </motion.div>
        )}
      </div>`;

code = code.replace(`        {activeTab === 'deploy' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <DeploymentSettings />
          </motion.div>
        )}
      </div>`, docsComponentRender);


const docsComponentCode = `

function Documentation() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">GitHub Actions Deployment Guide</h2>
      <div className="space-y-6 text-slate-700 dark:text-slate-300">
        
        <section>
          <h3 className="text-xl font-semibold mb-3">1. Update Node.js Version</h3>
          <p className="mb-2">The default GitHub Actions runner has deprecated Node 20. Update your <code>.github/workflows/deploy.yml</code> file to use Node 24.</p>
          <div className="bg-slate-100 dark:bg-slate-950 p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <pre>
{ \`    steps:
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "24"
          cache: "npm"\` }
            </pre>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-3">2. Generating a Personal Access Token (PAT)</h3>
          <p className="mb-2">To automate deployments, you need a PAT with the correct permissions.</p>
          <ol className="list-decimal list-inside space-y-2 ml-4">
            <li>Go to GitHub <strong>Settings &gt; Developer settings &gt; Personal access tokens &gt; Tokens (classic)</strong>.</li>
            <li>Click <strong>Generate new token (classic)</strong>.</li>
            <li>Select the scopes: <strong><code>repo</code></strong> and <strong><code>workflow</code></strong>.</li>
            <li>Copy the token and save it securely.</li>
          </ol>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-3">3. Configuring Environment Secrets</h3>
          <p className="mb-2">In your repository, you need to add your PAT as a secret so GitHub Actions can use it.</p>
          <ol className="list-decimal list-inside space-y-2 ml-4">
            <li>Go to your repository on GitHub.</li>
            <li>Navigate to <strong>Settings &gt; Secrets and variables &gt; Actions</strong>.</li>
            <li>Click <strong>New repository secret</strong>.</li>
            <li>Set the Name to <code>PAT</code> (or as configured in your workflow).</li>
            <li>Paste your token into the Secret field and click <strong>Add secret</strong>.</li>
          </ol>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-3">4. Triggering the Workflow</h3>
          <p className="mb-2">Once secrets are configured and Node version is updated, the deployment workflow will run automatically whenever you push to the <code>main</code> branch.</p>
        </section>
      </div>
    </div>
  );
}

`;

code = code.replace('function DeploymentSettings() {', docsComponentCode + 'function DeploymentSettings() {');

fs.writeFileSync('src/components/AdminDashboard.tsx', code);
