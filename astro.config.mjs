import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import pagefind from 'astro-pagefind';
import fs from 'fs';
import path from 'path';
import { siteConfig } from './site.config.js';

function configApiPlugin() {
  return {
    name: 'config-api-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/api/config' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => body += chunk);
          req.on('end', () => {
            try {
              const { siteConfig, tailwindConfigColors, logoImageBase64 } = JSON.parse(body);
              
              if (logoImageBase64) {
                const base64Data = logoImageBase64.replace(/^data:image\/[^;]+;base64,/, '');
                const buffer = Buffer.from(base64Data, 'base64');
                const publicDir = path.resolve('./public');
                if (!fs.existsSync(publicDir)) {
                  fs.mkdirSync(publicDir, { recursive: true });
                }
                const extMatch = logoImageBase64.match(/^data:image\/([^;]+);base64,/);
                let ext = extMatch ? extMatch[1] : 'png';
                if (ext === 'svg+xml') ext = 'svg';
                const logoFileName = `logo-custom.${ext}`;
                fs.writeFileSync(path.join(publicDir, logoFileName), buffer);
                siteConfig.branding.logoImage = `/${logoFileName}`;
              }

              // Write site.config.js
              const siteConfigPath = path.resolve('./site.config.js');
              const siteContent = `export const siteConfig = ${JSON.stringify(siteConfig, null, 2)};\n`;
              fs.writeFileSync(siteConfigPath, siteContent);
              
              // Update tailwind.config.mjs
              const tailwindPath = path.resolve('./tailwind.config.mjs');
              let twContent = fs.readFileSync(tailwindPath, 'utf-8');
              
              // Replace colors
              if (tailwindConfigColors) {
                if (tailwindConfigColors.primary) {
                  twContent = twContent.replace(/DEFAULT:\s*'#[0-9a-fA-F]+',?\s*\/\/\s*primary/g, `DEFAULT: '${tailwindConfigColors.primary}', // primary`);
                  // Also we can just replace the DEFAULT value under primary. Let's do a more robust replace for primary DEFAULT
                  twContent = twContent.replace(/primary: \{[\s\S]*?DEFAULT:\s*'[^']+'/m, (match) => {
                     return match.replace(/DEFAULT:\s*'[^']+'/, `DEFAULT: '${tailwindConfigColors.primary}'`);
                  });
                }
                if (tailwindConfigColors.secondary) {
                  twContent = twContent.replace(/secondary: \{[\s\S]*?DEFAULT:\s*'[^']+'/m, (match) => {
                     return match.replace(/DEFAULT:\s*'[^']+'/, `DEFAULT: '${tailwindConfigColors.secondary}'`);
                  });
                }
                if (tailwindConfigColors.accent) {
                  twContent = twContent.replace(/accent: \{[\s\S]*?DEFAULT:\s*'[^']+'/m, (match) => {
                     return match.replace(/DEFAULT:\s*'[^']+'/, `DEFAULT: '${tailwindConfigColors.accent}'`);
                  });
                }
                fs.writeFileSync(tailwindPath, twContent);
              }
              
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true }));
            } catch(e) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: e.message }));
            }
          });

        } else if (req.url === '/api/save-post' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => body += chunk);
          req.on('end', () => {
            try {
              const { filename, content } = JSON.parse(body);
              const postsDir = path.resolve('./src/content/posts');
              if (!fs.existsSync(postsDir)) {
                fs.mkdirSync(postsDir, { recursive: true });
              }
              fs.writeFileSync(path.join(postsDir, filename), content);
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true }));
            } catch(e) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: e.message }));
            }
          });
        } else {
          next();
        }
      });
    }
  }
}

// https://astro.build/config
export default defineConfig({
  site: siteConfig.url || 'https://example.com',
  server: {
    port: 3000,
    host: '0.0.0.0'
  },
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
    mdx(),
    sitemap(),
    pagefind()
  ],
  vite: {
    plugins: [configApiPlugin()]
  }
});
