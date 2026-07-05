import fs from 'fs';
let content = fs.readFileSync('README.md', 'utf8');

const oldText = `### Step 3: Publish to your site
1. When you are ready to publish, click **Download .mdx File** or simply copy your Markdown code.
2. In your project folder, go to \`src/content/posts/\` and create a new file ending in \`.mdx\` (e.g., \`my-new-post.mdx\`).
3. Paste your content into this file and save it. 
4. The post will immediately appear on your public site, and its featured image will be dynamically optimized by Astro's asset pipeline!`;

const newText = `### Step 3: Publish to your site
1. When you are ready to publish, ensure the \`draft: false\` flag is set in the frontmatter.
2. Click **Save File** in the editor toolbar.
3. The post will be saved securely into the local SQLite database.
4. The post will immediately appear on your public site on the next build, and its featured image will be dynamically optimized by Astro's asset pipeline!`;

content = content.replace(oldText, newText);

fs.writeFileSync('README.md', content);
