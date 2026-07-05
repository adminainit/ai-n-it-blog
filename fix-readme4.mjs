import fs from 'fs';
let content = fs.readFileSync('README.md', 'utf8');

const regex = /## 6\. Automated Deployment via GitHub Pages[\s\S]*?\*Note for multi-account users: If `git push` fails due to permissions, configure a new SSH key for the target account or use `https:\/\/<PAT>@github\.com\/TARGET_USERNAME\/TARGET_REPOSITORY\.git` as the remote origin\.\*/;

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

if (content.match(regex)) {
  content = content.replace(regex, newDeploy);
  fs.writeFileSync('README.md', content);
}
