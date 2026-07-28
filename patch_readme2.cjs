const fs = require('fs');
let lines = fs.readFileSync('README.md', 'utf-8').split('\n');

const startIndex = lines.findIndex(line => line.startsWith('## 11. Publishing to GitHub Pages'));
const endIndex = lines.findIndex((line, idx) => idx > startIndex && line.startsWith('---'));

if (startIndex !== -1 && endIndex !== -1) {
  const replacementStr = `## 11. Publishing to GitHub Pages (Detailed Guide)

There are two ways to deploy your blog to GitHub Pages.

### Method A: Admin Portal GUI Deployment (Recommended)
This method is the easiest. It builds the site locally and securely pushes ONLY the compiled static HTML to GitHub. Your source code and database remain entirely private.

**Prerequisites: Get a GitHub Personal Access Token (PAT)**
1. Go to GitHub **Settings** -> **Developer settings** -> **Personal access tokens** -> **Tokens (classic)**.
2. Generate a new token with **\`repo\`** and **\`workflow\`** scopes. Save it securely.

**Step 1: Create an Empty GitHub Repository**
1. Create a new **Public** repository (e.g., \`my-awesome-blog\`). Leave it entirely empty (no README, no .gitignore).

**Step 2: Deploy from the Admin Portal**
1. Go to \`http://localhost:3000/admin/\` and open the **Deployment** tab.
2. Enter your GitHub Username, Repository Name, and PAT. You can choose to securely save these credentials in your local database for future 1-click deployments!
3. Click **Deploy to GitHub**. This will build the site and push the \`dist/\` folder to your repo.

**Step 3: Enable GitHub Pages**
1. Go to your repository on GitHub -> **Settings** -> **Pages**.
2. Under **Source**, select **Deploy from a branch**.
3. Select the **main** branch and click **Save**.
4. GitHub will now serve your static files. Your site is live!

---

### Method B: Full Source Deployment via GitHub Actions
If you prefer to host your entire source code on GitHub (e.g. for collaboration or CI/CD pipelines), you can use the included GitHub Actions workflow.

*Note: Since the local database (\`data/local.db\`) is ignored by \`.gitignore\`, pushing your source code will trigger a build with an empty database. Astro will automatically generate a placeholder "Welcome" post so the build succeeds. If you want your local posts to be published this way, you must first run \`npm run cms:export\` and commit the resulting Markdown files.*

**Step 1: Push Source Code**
1. Initialize git in your project root, add your files, and push to your GitHub repository:
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/USERNAME/REPO.git
   git push -u origin main
   \`\`\`

**Step 2: Enable GitHub Pages for Actions**
1. Go to your repository on GitHub -> **Settings** -> **Pages**.
2. Under **Source**, change the dropdown to **GitHub Actions**.
3. The included \`.github/workflows/deploy.yml\` will automatically trigger on every push to the \`main\` branch. It installs dependencies using Node.js 24 and securely builds the site.
4. Go to the **Actions** tab to view the build logs. It will securely strip the Admin Portal code during the build process before publishing.

---

### Step 4 (Optional): Set up a Custom Domain
If you own a domain name (like \`myblog.com\`):
1. In the GitHub Pages settings (Settings -> Pages), scroll down to **Custom domain**.
2. Type in your domain name (e.g., \`myblog.com\`) and click **Save**.
3. **Configure DNS**: Go to your domain registrar (GoDaddy, Namecheap, etc.) and edit your DNS records:
   - Create 4 **A Records** pointing to GitHub's IPs: \`185.199.108.153\`, \`185.199.109.153\`, \`185.199.110.153\`, \`185.199.111.153\`
   - Create a **CNAME Record** for host \`www\` pointing to \`your-username.github.io\`.
4. Check the **Enforce HTTPS** box to get a free SSL certificate.
`;

  lines.splice(startIndex, endIndex - startIndex, replacementStr);
  fs.writeFileSync('README.md', lines.join('\n'));
} else {
  console.log("Could not find section boundaries");
}
