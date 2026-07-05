import fs from 'fs';
let content = fs.readFileSync('src/components/Layout.tsx', 'utf8');

const oldFooter = `<span className="font-display font-bold text-slate-700 dark:text-slate-300">
            {siteConfig.branding.logoText}
          </span>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} All rights reserved.
          </span>`;

const newFooter = `<span className="font-display font-bold text-slate-700 dark:text-slate-300">
            {siteConfig.branding.logoText}
          </span>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} All rights reserved. <span className="ml-2 px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-xs font-mono">v{siteConfig.version || '1.0.0'}</span>
          </span>`;

if (!content.includes("v{siteConfig.version")) {
  content = content.replace(oldFooter, newFooter);
  fs.writeFileSync('src/components/Layout.tsx', content);
}
