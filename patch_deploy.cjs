const fs = require('fs');
let code = fs.readFileSync('astro.config.mjs', 'utf-8');

const oldDeployLogic = /try \{\s*\/\/ Temporarily remove admin portal[\s\S]*?res\.setHeader\('Content-Type', 'application\/json'\);\s*res\.end\(JSON\.stringify\(\{ success: true, logs \}\)\);\s*\} catch \(cmdError\)/;

const newDeployLogic = `try {
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
                
                const remoteUrl = \`https://\${pat}@github.com/\${username}/\${repo}.git\`;
                
                // Configure remote
                try {
                  await runCmd('git remote remove origin', rootDir);
                } catch(e) {}
                await runCmd(\`git remote add origin \${remoteUrl}\`, rootDir);
                
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
              } catch (cmdError)`;

code = code.replace(oldDeployLogic, newDeployLogic);
fs.writeFileSync('astro.config.mjs', code);
