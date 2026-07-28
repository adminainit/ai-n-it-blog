
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
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
          req.on('end', async () => {
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
        } else if (req.url === '/api/deploy-github' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => body += chunk);
          req.on('end', async () => {
            try {
              const { pat, username, repo } = JSON.parse(body);
              if (!pat || !username || !repo) throw new Error('Missing PAT, username, or repo.');

              const { exec } = require('child_process');
              const { promisify } = require('util');
              const execAsync = promisify(exec);
              const path = require('path');
              
              const logs = [];
              const runCmd = async (cmd, cwd = process.cwd()) => {
                logs.push('> ' + cmd.replace(pat, '***PAT***'));
                try {
                  const { stdout, stderr } = await execAsync(cmd, { cwd });
                  if (stdout) logs.push(stdout);
                  if (stderr) logs.push(stderr);
                } catch(e) {
                  logs.push(e.message.replace(pat, '***PAT***'));
                  throw e;
                }
              };

              try {
                const rootDir = process.cwd();
                logs.push("Preparing to push source code to GitHub...");
                
                // Ensure git is initialized
                if (!fs.existsSync(path.join(rootDir, '.git'))) {
                  await runCmd('git init', rootDir);
                }
                
                // Add and commit all changes locally
                await runCmd('git config user.name "Auto Deploy"', rootDir);
                await runCmd('git config user.email "deploy@example.com"', rootDir);
                
                // Add all files
                await runCmd('git add .', rootDir);
                
                // Commit changes (will fail if nothing to commit, which is fine)
                try {
                  await runCmd('git commit -m "Automated Source Code Sync"', rootDir);
                } catch(e) {
                  logs.push("No new changes to commit.");
                }
                
                const remoteUrl = `https://${pat}@github.com/${username}/${repo}.git`;
                
                // Configure remote
                try {
                  await runCmd('git remote remove origin', rootDir);
                } catch(e) {}
                await runCmd(`git remote add origin ${remoteUrl}`, rootDir);
                
                // Rename branch to main
                await runCmd('git branch -M main', rootDir);
                
                // Fetch and pull latest changes (rebase to avoid merge commits)
                logs.push("Pulling latest updates from GitHub...");
                try {
                  await runCmd('git pull origin main --rebase', rootDir);
                } catch (e) {
                  logs.push("Could not pull changes or branch does not exist yet.");
                }
                
                // Push
                logs.push("Pushing source code to GitHub...");
                await runCmd('git push -u origin main', rootDir);
                
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, logs }));
              } catch (cmdError) {
                logs.push('ERROR: ' + cmdError.message.replace(pat, '***PAT***'));
                res.statusCode = 500;
                res.end(JSON.stringify({ error: cmdError.message.replace(pat, '***PAT***'), logs }));
              }
            } catch(e) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: e.message }));
            }
          });
        } else if (req.url === '/api/deploy-config' && req.method === 'GET') {
          try {
            if (!fs.existsSync('./data')) fs.mkdirSync('./data', { recursive: true });
            const Database = require('better-sqlite3');
            const db = new Database('./data/local.db');
            db.exec('CREATE TABLE IF NOT EXISTS deploy_config (id TEXT PRIMARY KEY, config TEXT)');
            const row = db.prepare('SELECT config FROM deploy_config WHERE id = ?').get('github');
            db.close();
            res.setHeader('Content-Type', 'application/json');
            res.end(row ? row.config : JSON.stringify({}));
          } catch(e) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: e.message }));
          }
        } else if (req.url === '/api/deploy-config' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => body += chunk);
          req.on('end', async () => {
            try {
              const config = JSON.parse(body);
              if (!fs.existsSync('./data')) fs.mkdirSync('./data', { recursive: true });
              const Database = require('better-sqlite3');
              const db = new Database('./data/local.db');
              db.exec('CREATE TABLE IF NOT EXISTS deploy_config (id TEXT PRIMARY KEY, config TEXT)');
              const insertConfig = db.prepare('INSERT OR REPLACE INTO deploy_config (id, config) VALUES (?, ?)');
              insertConfig.run('github', JSON.stringify(config));
              db.close();
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true }));
            } catch(e) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: e.message }));
            }
          });
        } else if (req.url === '/api/delete-post' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => body += chunk);
          req.on('end', async () => {
            try {
              const { filename } = JSON.parse(body);
              if (!fs.existsSync('./data')) fs.mkdirSync('./data', { recursive: true });
              const Database = require('better-sqlite3');
              const db = new Database('./data/local.db');
              db.exec('CREATE TABLE IF NOT EXISTS posts (id TEXT PRIMARY KEY, content TEXT)');
              const delPost = db.prepare('DELETE FROM posts WHERE id = ?');
              delPost.run(filename);
              db.close();
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
          req.on('end', async () => {
            try {
              const { filename, content } = JSON.parse(body);
              
              // Save to SQLite database
              if (!fs.existsSync('./data')) fs.mkdirSync('./data', { recursive: true });
              const Database = require('better-sqlite3');
              const db = new Database('./data/local.db');
              db.exec(`
                CREATE TABLE IF NOT EXISTS posts (
                  id TEXT PRIMARY KEY,
                  content TEXT
                )
              `);
              const insertPost = db.prepare('INSERT OR REPLACE INTO posts (id, content) VALUES (?, ?)');
              insertPost.run(filename, content);
              db.close();

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
    ssr: { external: ['better-sqlite3'] },
    optimizeDeps: { exclude: ['better-sqlite3'] },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          }
        }
      }
    },
    plugins: [configApiPlugin()]
  }
});
