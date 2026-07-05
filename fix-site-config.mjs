import fs from 'fs';
let content = fs.readFileSync('site.config.js', 'utf8');

const homePageConfig = `
  homePage: {
    heroWelcomeText: 'Welcome to our blog',
    heroButtonText: 'Read the Blog',
    heroButtonLink: '/blog'
  },`;

if (!content.includes('homePage')) {
  content = content.replace("theme:", "homePage: {\n    heroWelcomeText: 'Welcome',\n    heroButtonText: 'Read the Blog',\n    heroButtonLink: '/blog'\n  },\n  theme:");
  fs.writeFileSync('site.config.js', content);
}
