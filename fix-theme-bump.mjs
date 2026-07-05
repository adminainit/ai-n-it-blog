import fs from 'fs';
let content = fs.readFileSync('src/components/ThemeConfigurator.tsx', 'utf8');

const saveLogicOld = `      const newSiteConfig = {
        ...siteConfig,`;

const saveLogicNew = `      // Bump version logic
      let currentVersion = siteConfig.version || '1.0.0';
      const parts = currentVersion.split('.');
      if (parts.length === 3) {
        parts[2] = parseInt(parts[2]) + 1;
        currentVersion = parts.join('.');
      }
      
      const newSiteConfig = {
        ...siteConfig,
        version: currentVersion,`;

if (!content.includes('Bump version logic')) {
  content = content.replace(saveLogicOld, saveLogicNew);
  fs.writeFileSync('src/components/ThemeConfigurator.tsx', content);
}
