import fs from 'fs';
let content = fs.readFileSync('astro.config.mjs', 'utf8');

const savePostLogic = `        } else if (req.url === '/api/save-post' && req.method === 'POST') {`;
const deletePostLogic = `        } else if (req.url === '/api/delete-post' && req.method === 'POST') {
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
`;

if (!content.includes('/api/delete-post')) {
  content = content.replace(savePostLogic, deletePostLogic + savePostLogic);
  fs.writeFileSync('astro.config.mjs', content);
}
