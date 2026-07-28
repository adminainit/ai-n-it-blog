const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf-8');

const target = `          <p className="text-xs text-slate-500 mt-1">Needs \`repo\` and \`workflow\` scopes.</p>
        </div>
        
        {error && (`

const replacement = `          <p className="text-xs text-slate-500 mt-1">Needs \`repo\` and \`workflow\` scopes.</p>
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
        
        {error && (`

code = code.replace(target, replacement);
fs.writeFileSync('src/components/AdminDashboard.tsx', code);
