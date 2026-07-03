import { motion, Variants } from 'framer-motion';
import { siteConfig } from '../../site.config';

export default function Hero() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <section className="flex flex-col justify-center gap-4 h-full">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-4 items-start text-left"
      >
        <motion.span
           variants={itemVariants}
           className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 w-max uppercase tracking-wider"
        >
          Welcome
        </motion.span>

        <motion.h1 
          variants={itemVariants}
          className="text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-slate-900 dark:text-white"
        >
          {siteConfig.title}
        </motion.h1>
        
        <motion.p 
          variants={itemVariants}
          className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-[280px]"
        >
          {siteConfig.description}
        </motion.p>
        
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center gap-4 pt-2"
        >
          <a 
            href="/blog" 
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold transition-all shadow-sm shadow-indigo-200 dark:shadow-none w-full sm:w-auto text-center"
          >
            Read the Blog
          </a>
          <a 
            href={siteConfig.socialLinks.find(link => link.name === 'GitHub')?.url || 'https://github.com'} 
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-sm font-bold transition-all w-full sm:w-auto text-center"
          >
            View Source
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
