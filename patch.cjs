const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf-8');

const replacement = `function GithubDeployer() {
  const [pat, setPat] = useState('');
  const [username, setUsername] = useState('');
  const [repo, setRepo] = useState('');
  const [deploying, setDeploying] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [saveConfig, setSaveConfig] = useState(true);

  React.useEffect(() => {
    fetch('/api/deploy-config')
      .then(res => res.json())
      .then(data => {
        if (data.username) setUsername(data.username);
        if (data.repo) setRepo(data.repo);
        if (data.pat) setPat(data.pat);
      })
      .catch(() => {});
  }, []);

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
`;

code = code.replace(`function GithubDeployer() {
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
`, replacement);

const checkboxCode = `        </div>
        <div className="flex items-center gap-2 mt-2">
          <input 
            type="checkbox" 
            id="saveConfig"
            checked={saveConfig}
            onChange={(e) => setSaveConfig(e.target.checked)}
            className="rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="saveConfig" className="text-sm text-slate-700 dark:text-slate-300">
            Save deployment credentials for future use
          </label>
        </div>
      </div>`;

code = code.replace(`        </div>
      </div>`, checkboxCode);

fs.writeFileSync('src/components/AdminDashboard.tsx', code);
