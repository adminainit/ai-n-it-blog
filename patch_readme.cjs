const fs = require('fs');
let content = fs.readFileSync('README.md', 'utf-8');

const targetStr = `## 11. Publishing to GitHub Pages (Detailed Guide)
You can publish the public-facing blog to GitHub Pages entirely for free. The automated GitHub Actions workflow will strip out the Admin Portal, compile the static HTML, and publish it securely.

### Prerequisites: Get a GitHub Personal Access Token (PAT)
1. Go to [github.com](https://github.com/) and log in.
2. In the top right corner, click your profile picture and go to **Settings**.
3. Scroll down the left sidebar and click **< > Developer settings**.
4. Click **Personal access tokens** -> **Tokens (classic)**.
5. Click **Generate new token (classic)** (you may be asked to re-enter your password).
6. Give it a **Note** (e.g., "Blog Deploy Token").
7. **Important Scopes**: Check the boxes for **\`repo\`** (Full control of private repositories) and **\`workflow\`** (Update GitHub Action workflows).
8. Scroll to the bottom and click **Generate token**.
9. **Copy this token immediately** and save it somewhere secure. You won't be able to see it again!

### Step 1: Create the GitHub Repository
1. Go back to the main GitHub page and click the **+** icon in the top right -> **New repository**.
2. Name your repository (e.g., \`my-awesome-blog\`).
3. Make it **Public** (required for free GitHub Pages).
4. **DO NOT** check "Add a README file" or add a .gitignore/license. Leave it completely empty.
5. Click **Create repository**.

### Step 2: Deploy from the Admin Portal
1. Start your local dev server (\`npm run dev\`) and open \`http://localhost:3000/admin/\`.
2. Click the **Deployment** tab on the left sidebar.
3. Fill out the form:
   - **GitHub Username**: Your exact GitHub username.
   - **Repository Name**: The name of the empty repository you just created (e.g., \`my-awesome-blog\`).
   - **Personal Access Token**: Paste the token you generated earlier.
4. Click **Deploy to GitHub**.
5. Wait for the terminal output to finish. It will automatically build the site, initialize Git in the dist folder, and push ONLY the compiled static files to your repository.

### Step 3: Enable GitHub Pages Settings
1. Go to your repository on GitHub.
2. Click the **Settings** tab near the top.
3. On the left sidebar, click **Pages**.
4. Under **Build and deployment**, look for the **Source** dropdown. Change it to **Deploy from a branch** and select the **main** branch.
5. GitHub will now serve the static files pushed directly to the main branch.
6. Click the **Actions** tab at the top of your repository to watch the build progress. Once it turns green, your site is live!

### Step 4 (Optional): Set up a Custom Domain
If you own a domain name (like \`myblog.com\`):
1. In the GitHub Pages settings (Settings -> Pages), scroll down to **Custom domain**.
2. Type in your domain name (e.g., \`myblog.com\`) and click **Save**.
3. **Configure DNS**: Go to your domain registrar (GoDaddy, Namecheap, etc.) and edit your DNS records:
   - Create 4 **A Records** pointing to GitHub's IPs:
     - \`185.199.108.153\`
     - \`185.199.109.153\`
     - \`185.199.110.153\`
     - \`185.199.111.153\`
   - Create a **CNAME Record** for host \`www\` pointing to \`your-username.github.io\`.
4. Wait for DNS to propagate (can take a few hours).
5. Back in the GitHub Pages settings, check the **Enforce HTTPS** box to get a free SSL certificate.`;

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
3. The included \`.github/workflows/deploy.yml\` will automatically trigger on every push to the \`main\` branch.
4. Go to the **Actions** tab to view the build logs. It will securely strip the Admin Portal code during the build process before publishing.

---

### Step 4 (Optional): Set up a Custom Domain
If you own a domain name (like \`myblog.com\`):
1. In the GitHub Pages settings (Settings -> Pages), scroll down to **Custom domain**.
2. Type in your domain name (e.g., \`myblog.com\`) and click **Save**.
3. **Configure DNS**: Go to your domain registrar (GoDaddy, Namecheap, etc.) and edit your DNS records:
   - Create 4 **A Records** pointing to GitHub's IPs: \`185.199.108.153\`, \`185.199.109.153\`, \`185.199.110.153\`, \`185.199.111.153\`
   - Create a **CNAME Record** for host \`www\` pointing to \`your-username.github.io\`.
4. Check the **Enforce HTTPS** box to get a free SSL certificate.`;

content = content.replace(targetStr, replacementStr);
fs.writeFileSync('README.md', content);
