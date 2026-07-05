import fs from 'fs';
let content = fs.readFileSync('src/components/ThemeConfigurator.tsx', 'utf8');

const stateCode = `  const [formData, setFormData] = useState({
    title: siteConfig.title,
    description: siteConfig.description,
    logoText: siteConfig.branding.logoText,
    logoImageBase64: '',
    primaryColor: siteConfig.theme?.hexColors?.primary || '#0f172a',
    secondaryColor: siteConfig.theme?.hexColors?.secondary || '#475569',
    accentColor: siteConfig.theme?.hexColors?.accent || '#3b82f6',
    heroWelcomeText: siteConfig.homePage?.heroWelcomeText || 'Welcome',
    heroButtonText: siteConfig.homePage?.heroButtonText || 'Read the Blog',
    heroButtonLink: siteConfig.homePage?.heroButtonLink || '/blog',
  });`;

content = content.replace(/  const \[formData, setFormData\] = useState\(\{[\s\S]*?\}\);/, stateCode);

const newSiteConfigCode = `      const newSiteConfig = {
        ...siteConfig,
        title: formData.title,
        description: formData.description,
        branding: {
          ...siteConfig.branding,
          logoText: formData.logoText,
        },
        homePage: {
          heroWelcomeText: formData.heroWelcomeText,
          heroButtonText: formData.heroButtonText,
          heroButtonLink: formData.heroButtonLink,
        },
        theme: {`;

content = content.replace(/      const newSiteConfig = \{[\s\S]*?theme: \{/, newSiteConfigCode);

const uiCode = `          <h3 className="font-semibold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 pb-2 mt-6">Home Page Hero</h3>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Welcome Text</label>
            <input 
              type="text" 
              value={formData.heroWelcomeText}
              onChange={(e) => setFormData({...formData, heroWelcomeText: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Button Text</label>
            <input 
              type="text" 
              value={formData.heroButtonText}
              onChange={(e) => setFormData({...formData, heroButtonText: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
            />
          </div>
        </div>`;

content = content.replace(/        <\/div>\s*<div className="space-y-4">/, uiCode + `\n        <div className="space-y-4">`);

fs.writeFileSync('src/components/ThemeConfigurator.tsx', content);
