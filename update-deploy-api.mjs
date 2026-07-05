import fs from 'fs';

let content = fs.readFileSync('astro.config.mjs', 'utf8');

const deployApiCode = `        } else if (req.url === '/api/deploy-github' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => body += chunk);
          req.on('end', async () => {
            try {
              const { pat, username, repo } = JSON.parse(body);
              if (!pat || !username || !repo) throw new Error('Missing PAT, username, or repo.');

              const { exec } = require('child_process');
              const { promisify } = require('util');
              const execAsync = promisify(exec);
              
              const logs = [];
              const runCmd = async (cmd) => {
                logs.push('> ' + cmd.replace(pat, '***PAT***'));
                const { stdout, stderr } = await execAsync(cmd);
                if (stdout) logs.push(stdout);
                if (stderr) logs.push(stderr);
              };

              try {
                // Initialize git if not already
                if (!fs.existsSync('.git')) {
                  await runCmd('git init');
                }
                
                // Add and commit
                await runCmd('git add .');
                await runCmd('git commit -m "Automated GUI Deployment" || echo "No changes to commit"');
                
                // Configure remote (remove existing if needed)
                await runCmd('git remote remove origin || echo "No origin to remove"');
                const remoteUrl = \`https://\${pat}@github.com/\${username}/\${repo}.git\`;
                await runCmd(\`git remote add origin \${remoteUrl}\`);
                
                // Rename branch to main
                await runCmd('git branch -M main');
                
                // Push
                await runCmd('git push -u origin main --force');
                
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
`;

if (!content.includes('/api/deploy-github')) {
  content = content.replace("        } else if (req.url === '/api/delete-post'", deployApiCode + "        } else if (req.url === '/api/delete-post'");
  fs.writeFileSync('astro.config.mjs', content);
}
