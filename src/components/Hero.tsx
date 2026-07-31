import { motion, Variants } from 'framer-motion';
import { siteConfig } from '../../site.config';
import { sitePath } from '../utils/urls';

export default function Hero() {
  const configuredLink = siteConfig.homePage?.heroButtonLink || '/blog';
  const heroLink = sitePath(configuredLink);

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
    <section className="flex flex-col items-center justify-center gap-4 h-full w-full py-10 md:py-16">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-6 items-center text-center w-full max-w-3xl"
      >
        <motion.span 
           variants={itemVariants}
           className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 w-max uppercase tracking-wider shadow-sm ring-1 ring-indigo-500/20"
        >
          {siteConfig.homePage?.heroWelcomeText || 'Welcome'}
        </motion.span>

        <motion.h1 
           variants={itemVariants}
           className="text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight text-slate-900 dark:text-white"
        >
          {siteConfig.title}
        </motion.h1>
        
        <motion.p 
           variants={itemVariants}
           className="text-slate-500 dark:text-slate-400 text-lg md:text-xl leading-relaxed max-w-[600px] mt-2"
        >
          {siteConfig.description}
        </motion.p>
        
        <motion.div 
           variants={itemVariants}
           className="flex flex-col sm:flex-row items-center gap-4 pt-6 w-full sm:w-auto"
        >
          <a 
            href={heroLink} 
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all shadow-xl shadow-indigo-200 dark:shadow-indigo-900/20 w-full sm:w-auto text-center border border-indigo-500 hover:scale-105 active:scale-95"
          >
            {siteConfig.homePage?.heroButtonText || 'Read the Blog'}
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
