import fs from 'fs';
let content = fs.readFileSync('README.md', 'utf8');

const oldDeploy = `## 6. Automated Deployment via GitHub Pages
To persist this project and publish the **Public Site** to the internet for free using GitHub Pages, follow these exact steps:

**Step 1: Initialize Git**
If you haven't already, run these commands in your terminal to track your files:
\`\`\`bash
git init
git add .
git commit -m "Initial commit"
\`\`\`

**Step 2: Connect to GitHub (including publishing to a different account)**
1. Log in to your target [GitHub](https://github.com/) account and click the "+" icon in the top right to **Create a new repository**.
2. Give it a name, choose "Public", and click **Create repository** (do not add a README, .gitignore, or license yet).
3. Copy the URL of your new repository.
4. Run these commands in your terminal to link and upload your code. If you are pushing to a different GitHub account than your default, you may need to use an SSH key or Personal Access Token (PAT) for authentication when prompted.
\`\`\`bash
git remote add origin https://github.com/TARGET_USERNAME/TARGET_REPOSITORY.git
git branch -M main
git push -u origin main
\`\`\`
*Note for multi-account users: If \`git push\` fails due to permissions, configure a new SSH key for the target account or use \`https://<PAT>@github.com/TARGET_USERNAME/TARGET_REPOSITORY.git\` as the remote origin.*`;

const newDeploy = `## 6. Automated Deployment via GitHub Pages (GUI)
To persist this project and publish the **Public Site** to the internet for free using GitHub Pages, you can now use the built-in GUI deployment tool inside the Admin Portal!

**Prerequisite: Get a GitHub Personal Access Token (PAT)**
1. Log in to your [GitHub](https://github.com/) account.
2. Go to **Settings** -> **Developer settings** -> **Personal access tokens** -> **Tokens (classic)**.
3. Click **Generate new token (classic)**.
4. Give it a note (e.g. "Blog Deploy"), and select the **repo** and **workflow** scopes.
5. Generate the token and copy it.

**Step 1: Create a GitHub Repository**
1. On GitHub, click the "+" icon in the top right to **Create a new repository**.
2. Give it a name, choose "Public", and click **Create repository** (do not add a README, .gitignore, or license yet).

**Step 2: Deploy via Admin Portal**
1. Open the **Admin Portal** (\`http://localhost:3000/admin/\`).
2. Navigate to the **GitHub Deploy** tab.
3. Enter your GitHub Username, the Repository Name you just created, and paste your PAT.
4. Click **Deploy to GitHub**. You will see live status and error logging directly in the terminal UI!`;

if (content.includes(oldDeploy)) {
  content = content.replace(oldDeploy, newDeploy);
}

const themeSettingsOld = `3. You can visually edit:
   - **Site Title** & **Description**
   - **Logo Text**
   - **Primary, Secondary, and Accent Colors** (using the built-in color picker).`;
   
const themeSettingsNew = `3. You can visually edit:
   - **Site Title** & **Description**
   - **Logo Text**
   - **Home Page Hero Welcome Text & Button settings**
   - **Primary, Secondary, and Accent Colors** (using the built-in color picker).`;

if (content.includes(themeSettingsOld)) {
  content = content.replace(themeSettingsOld, themeSettingsNew);
}

fs.writeFileSync('README.md', content);
