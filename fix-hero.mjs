import fs from 'fs';
let content = fs.readFileSync('src/components/Hero.tsx', 'utf8');

content = content.replace(
  `        <motion.span 
           variants={itemVariants}
           className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 w-max uppercase tracking-wider"
        >
          Welcome
        </motion.span>`,
  `        <motion.span 
           variants={itemVariants}
           className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 w-max uppercase tracking-wider shadow-sm"
        >
          {siteConfig.homePage?.heroWelcomeText || 'Welcome'}
        </motion.span>`
);

content = content.replace(
  `          <a 
            href="/blog" 
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold transition-all shadow-sm shadow-indigo-200 dark:shadow-none w-full sm:w-auto text-center"
          >
            Read the Blog
          </a>`,
  `          <a 
            href={siteConfig.homePage?.heroButtonLink || "/blog"} 
            className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 w-full sm:w-auto text-center"
          >
            {siteConfig.homePage?.heroButtonText || 'Read the Blog'}
          </a>`
);

// We want to center the Hero if it's rendered as centered in index.astro
content = content.replace(`className="flex flex-col gap-4 items-start text-left"`, `className="flex flex-col gap-5 items-center text-center"`);
content = content.replace(`className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-[280px]"`, `className="text-slate-500 dark:text-slate-400 text-base md:text-lg leading-relaxed max-w-[600px] mt-2"`);

fs.writeFileSync('src/components/Hero.tsx', content);
