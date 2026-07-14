# Corporate Insights Blog

A polished, corporate-themed static blog built with Astro, React, and Tailwind CSS. It features a custom Markdown editor with live preview, a complete Markdown/MDX workflow, and white-label branding configurations. 

This project is fully compatible with both **x86-64** and **ARM** architectures natively, ensuring seamless development and deployment on any modern Windows, macOS, or Linux device (including Apple Silicon M-series chips and Raspberry Pi).

## Features

- **Light/Dark Mode Theme**: Built-in responsive theme toggle leveraging Tailwind's `dark` mode and React state.
- **Admin Portal & Editor**: A split-pane React-based Markdown editor with real-time preview, local storage persistence, and smooth Framer Motion entry animations.
- **Visual Theme Configurator**: A GUI-driven settings panel inside the Admin Portal to instantly update the site title, description, logo, and core color palette (Primary, Secondary, Accent) without writing code.
- **Lightning Fast Static Search**: Integrated with **Pagefind** to provide instant, offline-capable, and bandwidth-friendly static search capabilities.
- **Automated RSS & Sitemaps**: Automatically generates `rss.xml` and `sitemap-index.xml` upon build, ensuring top-tier SEO and feed reader compatibility.
- **Dynamic Image Optimization**: Astro's native asset optimization is built-in. Use local images or remote URLs for post thumbnails and get automatically resized and optimized webp outputs.
- **Corporate Branding**: Configurable white-label branding, typography, and color palette optimized for professional audiences.
- **Static Site Generation**: Fast performance driven by Astro, outputting static HTML/CSS/JS ready for deployment.

---

## 1. Prerequisites (Zero Knowledge Setup)

Before you can run or deploy this application locally, you must install the following core tools. If you already have these, you can skip to Step 2.

1. **Node.js (v18.x or later)**: This is the runtime environment required to run JavaScript locally.
   - **How to install**: Go to [nodejs.org](https://nodejs.org/), download the "LTS" (Long Term Support) version for your operating system, and run the installer.
   - **Verification**: Open your terminal (Command Prompt on Windows, Terminal on Mac/Linux) and type `node -v`. It should print a version number like `v18.17.0` or higher.
2. **Git**: A version control system used to save your code and sync it with GitHub.
   - **How to install**: Go to [git-scm.com](https://git-scm.com/downloads) and download the installer for your OS.
   - **Verification**: In your terminal, type `git --version`.

---

## 2. Running the App Locally (Admin Portal & Public Site)

**Prerequisite:** You must have [Node.js](https://nodejs.org/) installed on your computer. 
> **Troubleshooting `npm is not recognized`:** If you run the setup steps or scripts below and see an error saying `npm : The term 'npm' is not recognized as the name of a cmdlet...`, it means Node.js is not installed or your terminal hasn't been restarted. **Download and install Node.js**, then completely close and restart your terminal (or VS Code) before trying again.

The local development server allows you to see the website exactly as it will appear online, and gives you access to the private **Admin Portal** to create blog posts.

**Step 1:** Open your terminal and navigate to the project folder.
**Step 2:** Install all the required packages (this downloads the tools the project needs):
```bash
npm install
```
**Step 3:** Start the local development server:

**On Linux/macOS:**
```bash
chmod +x run-local-admin.sh
./run-local-admin.sh
```

**On Windows:**
Open PowerShell and run:
```powershell
.\run-local-admin.ps1
```
*(Note: If you receive a "running scripts is disabled on this system" error, run this command first: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` and type `Y` to confirm. Then run the script again.)*

*(Alternatively, you can just run `npm run dev` in your terminal).*

**Step 4:** View the site in your browser:
- **Public Site**: Open `http://localhost:3000/`
- **Admin Portal (Editor)**: Open `http://localhost:3000/admin/`

---

## 3. The Admin Portal: Visual Theme Configurator

The Admin Portal now includes a **Site Settings & Theme Configurator** directly inside the web UI.

1. Open the **Admin Portal** (`http://localhost:3000/admin/`).
2. On the Dashboard view, you will see the **Site Branding & Theme Settings** panel.
3. You can visually edit:
   - **Site Title** & **Description**
   - **Logo Text**
   - **Home Page Hero Welcome Text & Button settings**
   - **Primary, Secondary, and Accent Colors** (using the built-in color picker).
4. Click **Save Settings**. This leverages a custom backend API to automatically update `site.config.js` and `tailwind.config.mjs` on your local filesystem!
5. *Note: You may need to refresh your browser or restart the dev server to see the tailwind color changes fully propagate.*

---

## 4. Writing and Publishing Content

### Step 1: Draft your Post
1. Open the **Admin Portal** (`http://localhost:3000/admin/`) and click **Go to Editor**.
2. Click the **"+"** button to create a new draft. Type your Markdown content on the left, and see the live preview on the right.
3. Your drafts are automatically saved to your browser's local storage.

### Step 2: Add Frontmatter (Metadata)
At the top of your markdown content, ensure you have standard Astro YAML frontmatter. This determines how your post is listed and how its images are optimized:

```yaml
---
title: "Your Post Title Here"
date: 2026-07-04
description: "A short excerpt about the post for the summary cards."
image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0" # Can be a URL or a local path
draft: false
tags: ["corporate", "strategy"]
---

Your markdown text goes here...
```

### Step 3: Publish to your site
1. When you are ready to publish, ensure the `draft: false` flag is set in the frontmatter.
2. Click **Save File** in the editor toolbar.
3. The post will be saved securely into the local SQLite database.
4. The post will immediately appear on your public site on the next build, and its featured image will be dynamically optimized by Astro's asset pipeline!

---

## 5. Secure Split Deployment Strategy

This project ensures your drafts and admin portal remain strictly private.
1. **Public Site (Home & Blog)**: Deployed automatically via GitHub Actions to GitHub Pages.
2. **Admin Portal**: Runs *only* on your local machine. The automated build scripts explicitly delete the Admin Portal before generating the public files.

---

## 6. Automated Deployment via GitHub Pages (GUI)
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
1. Open the **Admin Portal** (`http://localhost:3000/admin/`).
2. Navigate to the **GitHub Deploy** tab.
3. Enter your GitHub Username, the Repository Name you just created, and paste your PAT.
4. Click **Deploy to GitHub**. You will see live status and error logging directly in the terminal UI!

**Step 3: Enable GitHub Pages & Custom Domain (ai-n-it.com)**
1. On your GitHub repository page, click **Settings** (top tab).
2. Click **Pages** on the left sidebar.
3. Under **Build and deployment**, set the **Source** dropdown to **GitHub Actions**.
4. Your site will now build and deploy automatically. You can check the progress in the **Actions** tab.
5. **Set up Custom Domain**: Under the **Custom domain** section on the Pages settings screen, enter `ai-n-it.com` and click **Save**.
6. **Configure DNS Records**: Log in to your domain registrar (where you bought `ai-n-it.com`) and add the following records:
   - **A Records** pointing to GitHub IPs:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - **CNAME Record**: Host `www`, pointing to `TARGET_USERNAME.github.io`.
7. **Enable SSL (HTTPS)**: Once DNS propagates (can take up to 24 hours), go back to GitHub Pages settings and check the **Enforce HTTPS** box. GitHub automatically provisions a free TLS/SSL certificate via Let's Encrypt for your domain.

*Note: The included GitHub workflow securely deletes the `/admin` route before publishing to ensure it is never exposed online.*

---

## 7. Manual Public Deployment (Optional)

If you prefer to deploy to another static host (like Vercel, Netlify, AWS S3, or Nginx), we have provided automated build scripts that strip the Admin Portal and generate the public site files into a `dist/` folder.

**Linux / macOS Manual Deployment:**
Make the script executable and run it:
```bash
chmod +x deploy-linux.sh
./deploy-linux.sh
```

**Windows Manual Deployment:**
Open PowerShell as an Administrator and run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\deploy-windows.ps1
```

Once the script finishes, simply upload the contents of the generated `dist/` folder to your web hosting provider.

---

## 8. Advanced Features (Search, RSS, Sitemaps)

**Search Engine (Pagefind)**
The integrated search runs seamlessly without any external database. 
To test it locally, you must first build the site (since it relies on the built static HTML):
```bash
npm run build
npm run preview
```
Open `http://localhost:3000` and test the search bar in the header!

**RSS & Sitemaps**
These are automatically generated at build-time.
- RSS Feed: `/rss.xml`
- Sitemap: `/sitemap-index.xml`

---

## 9. Safe Syncing from GitHub
If you pull updates from GitHub via GUI tools like SourceTree, you might encounter "merge conflicts" or errors saying your local files would be overwritten. This happens because the **Admin Portal** modifies local configuration files (`site.config.js`, `tailwind.config.mjs`) when you change themes.

To easily sync your code without losing any local settings or data, we have provided **Safe Sync** scripts. These scripts will automatically commit your local changes and seamlessly pull the latest code.

**Linux / macOS Sync:**
Make the script executable and run it:
```bash
chmod +x sync-from-github.sh
./sync-from-github.sh
```

**Windows Sync:**
Open PowerShell and run:
```powershell
.\sync-from-github.ps1
```
*(Note: If you receive a "running scripts is disabled on this system" error, run this command first: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` and type `Y` to confirm. Then run the script again.)*

These scripts guarantee that your `data/local.db` is preserved and any theme changes you made locally are cleanly committed.

## Database & Storage Setup (better-sqlite3)
This blog uses `better-sqlite3` for local persistence to enable editing and previewing posts through the Admin Portal, and to save published content to the server.

### Configuration
- The database is stored in the `data/local.db` file, which is created automatically if it doesn't exist.
- When saving a post in the Admin Portal, it runs through an internal API route which stores the content in the database.
- The Astro static site generation pulls posts from this local SQLite database instead of local Markdown files.

### Seeding Dummy Data
If your database is empty, the build process may fail because it expects at least one post. You can run the seed script to create a dummy post:
```bash
npm run seed
```

### Troubleshooting `better-sqlite3` Installation
If you run into installation issues with `better-sqlite3` (like missing binaries):
- Ensure you have a C/C++ compiler installed on your system (e.g. `build-essential` on Linux, Xcode Command Line Tools on macOS, or Visual Studio Build Tools on Windows).
- Run `npm rebuild better-sqlite3` to recompile the native bindings for your architecture.
- If you see an error like "The collection 'posts' does not exist", make sure to run `npm run seed`!

---

---

## 10. Detailed VS Code CMS Integration

You can treat VS Code as your local CMS to manage and edit your blog posts natively. This provides a great developer experience with syntax highlighting, GitHub Copilot (if you use it), and version control.

### Step 1: Install Recommended VS Code Extensions
For the best authoring experience, install the following extensions from the VS Code Marketplace:
1. **MDX** (by unified) - Provides syntax highlighting for MDX and Markdown files.
2. **Prettier - Code formatter** - Keeps your Markdown clean and properly spaced.
3. **Tailwind CSS IntelliSense** - If you want to use Tailwind utility classes directly inside your markdown files.

### Step 2: Export Database Posts to VS Code
All blog posts are securely stored in the local SQLite database. To edit them in VS Code, you first need to extract them into standard Markdown files.

Open your integrated terminal in VS Code and run:
```bash
npm run cms:export
```
- This script exports all database posts to the `src/content/vscode-cms/` directory.
- Each post is saved as a `.md` file (e.g. `hello-world.md`).

### Step 3: Write and Edit Content
1. In the VS Code Explorer, open the `src/content/vscode-cms/` folder.
2. You can **edit existing files** or **create new `.md` or `.mdx` files** for new blog posts.
3. **YAML Frontmatter (Auto-Injected!)**: 
   Astro requires frontmatter (metadata) at the top of your markdown files. The standard format looks like this:
   ```yaml
   ---
   title: "Your Post Title Here"
   date: 2026-07-04
   description: "A short excerpt about the post for the summary cards."
   image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0" # Optional URL or path
   draft: false
   tags: ["corporate", "strategy"]
   ---
   ```
   *Don't worry if you forget!* If you create a new file without frontmatter, our sync tool will **automatically detect it and inject the required frontmatter** based on the filename and current date.

### Step 4: Import Posts Back to the Database
Once you are done writing or editing, you need to sync the files back into the database so the Admin Portal and public site can read them.

Run the following command:
```bash
npm run cms:import
```
- This will scan `src/content/vscode-cms/`, automatically fix any missing frontmatter, and push the content back to your local SQLite database.

### Step 5: Preview Your Changes
To see your updated content on the live site:
1. Run the dev server if it isn't running:
   ```bash
   npm run dev
   ```
2. Check the blog section in your browser. If you prefer to test the built static version, run `npm run build && npm run preview`.

---

## 11. Publishing to GitHub Pages (Detailed Guide)

You can publish the public-facing blog to GitHub Pages entirely for free. The automated GitHub Actions workflow will strip out the Admin Portal, compile the static HTML, and publish it securely.

### Prerequisites: Get a GitHub Personal Access Token (PAT)
1. Go to [github.com](https://github.com/) and log in.
2. In the top right corner, click your profile picture and go to **Settings**.
3. Scroll down the left sidebar and click **< > Developer settings**.
4. Click **Personal access tokens** -> **Tokens (classic)**.
5. Click **Generate new token (classic)** (you may be asked to re-enter your password).
6. Give it a **Note** (e.g., "Blog Deploy Token").
7. **Important Scopes**: Check the boxes for **`repo`** (Full control of private repositories) and **`workflow`** (Update GitHub Action workflows).
8. Scroll to the bottom and click **Generate token**.
9. **Copy this token immediately** and save it somewhere secure. You won't be able to see it again!

### Step 1: Create the GitHub Repository
1. Go back to the main GitHub page and click the **+** icon in the top right -> **New repository**.
2. Name your repository (e.g., `my-awesome-blog`).
3. Make it **Public** (required for free GitHub Pages).
4. **DO NOT** check "Add a README file" or add a .gitignore/license. Leave it completely empty.
5. Click **Create repository**.

### Step 2: Deploy from the Admin Portal
1. Start your local dev server (`npm run dev`) and open `http://localhost:3000/admin/`.
2. Click the **GitHub Deploy** tab on the left sidebar.
3. Fill out the form:
   - **GitHub Username**: Your exact GitHub username.
   - **Repository Name**: The name of the empty repository you just created (e.g., `my-awesome-blog`).
   - **Personal Access Token**: Paste the token you generated earlier.
4. Click **Deploy to GitHub**.
5. Wait for the terminal output to finish. It will automatically initialize Git, commit your code, and push it forcefully to your repository.

### Step 3: Enable GitHub Pages Settings
1. Go to your repository on GitHub.
2. Click the **Settings** tab near the top.
3. On the left sidebar, click **Pages**.
4. Under **Build and deployment**, look for the **Source** dropdown. Change it to **GitHub Actions**.
5. GitHub will now detect the `deploy.yml` file included in this project and start building your site.
6. Click the **Actions** tab at the top of your repository to watch the build progress. Once it turns green, your site is live!

### Step 4 (Optional): Set up a Custom Domain
If you own a domain name (like `myblog.com`):
1. In the GitHub Pages settings (Settings -> Pages), scroll down to **Custom domain**.
2. Type in your domain name (e.g., `myblog.com`) and click **Save**.
3. **Configure DNS**: Go to your domain registrar (GoDaddy, Namecheap, etc.) and edit your DNS records:
   - Create 4 **A Records** pointing to GitHub's IPs:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - Create a **CNAME Record** for host `www` pointing to `your-username.github.io`.
4. Wait for DNS to propagate (can take a few hours).
5. Back in the GitHub Pages settings, check the **Enforce HTTPS** box to get a free SSL certificate.