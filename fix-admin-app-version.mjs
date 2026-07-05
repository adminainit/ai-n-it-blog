import fs from 'fs';
let content = fs.readFileSync('src/components/AdminApp.tsx', 'utf8');

const oldHeader = `                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
                    Admin Dashboard
                  </h1>`;

const newHeader = `                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                      Admin Dashboard
                    </h1>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                      v{import.meta.env.VITE_APP_VERSION || '1.0.0'}
                    </span>
                  </div>`;

if (!content.includes('v{import.meta.env.VITE_APP_VERSION')) {
  content = content.replace(oldHeader, newHeader);
  // Actually, we can just import siteConfig and use siteConfig.version.
  if (!content.includes('import { siteConfig }')) {
     content = "import { siteConfig } from '../../site.config';\n" + content;
  }
  content = content.replace("v{import.meta.env.VITE_APP_VERSION || '1.0.0'}", "v{siteConfig.version || '1.0.0'}");
  fs.writeFileSync('src/components/AdminApp.tsx', content);
}
