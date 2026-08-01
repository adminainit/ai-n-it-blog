import { motion, Variants } from 'framer-motion';
import { siteConfig } from '../../site.config';
import { sitePath } from '../utils/urls';

interface HeroProps {
  postCount?: number;
}

export default function Hero({ postCount = 0 }: HeroProps) {
  const configuredLink = siteConfig.homePage?.heroButtonLink || '/blog';
  const heroLink = sitePath(configuredLink);
  const secondaryLink = sitePath(siteConfig.homePage?.heroSecondaryButtonLink || '#latest-insights');
  const logoImage = siteConfig.branding?.logoImage || '';
  const heroImage = siteConfig.homePage?.heroImage || '';

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' } },
  };

  return (
    <section className="surface-grid relative isolate w-full overflow-hidden rounded-[2rem] bg-[var(--site-primary)] px-6 py-10 text-white shadow-[0_35px_100px_rgba(7,26,43,0.24)] sm:px-10 md:rounded-[2.75rem] md:px-12 md:py-14 lg:px-16 lg:py-16">
      <div className="absolute -left-28 top-16 -z-10 h-72 w-72 rounded-full bg-teal-400/15 blur-3xl" />
      <div className="absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full bg-orange-400/15 blur-3xl" />
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`grid w-full items-center gap-12 ${heroImage ? 'lg:grid-cols-[.9fr_1.1fr] lg:gap-16' : 'max-w-4xl'}`}
      >
        <div className="flex flex-col items-start">
          <motion.span variants={itemVariants} className="mb-7 inline-flex w-max items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-teal-200 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--site-accent)] shadow-[0_0_0_4px_rgba(255,130,92,.15)]" />
            {siteConfig.homePage?.heroWelcomeText || 'Intelligence for meaningful change'}
          </motion.span>

          <motion.h1 variants={itemVariants} className="max-w-2xl text-balance font-display text-5xl font-semibold leading-[.94] tracking-[-0.04em] text-[#f5f0e8] sm:text-6xl md:text-7xl lg:text-[5.4rem]">
            {siteConfig.homePage?.heroTitle || 'Where intelligence meets'}{' '}
            <span className="text-[var(--site-secondary)]">{siteConfig.homePage?.heroHighlight || 'execution.'}</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="mt-7 max-w-xl text-base leading-7 text-slate-300 md:text-lg md:leading-8">
            {siteConfig.description}
          </motion.p>

          <motion.div variants={itemVariants} className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <a href={heroLink} className="inline-flex items-center justify-center gap-3 rounded-full bg-[var(--site-accent)] px-7 py-3.5 text-sm font-extrabold text-[var(--site-primary)] transition duration-300 hover:-translate-y-0.5 hover:brightness-110">
              {siteConfig.homePage?.heroButtonText || 'Explore the insights'}
              <span aria-hidden="true">→</span>
            </a>
            <a href={secondaryLink} className="inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-3.5 text-sm font-bold text-white transition hover:border-white/50 hover:bg-white/5">
              {siteConfig.homePage?.heroSecondaryButtonText || 'View latest stories'}
            </a>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/10 pt-6 text-xs text-slate-400">
            <span><strong className="mr-2 text-lg text-white">{postCount}</strong> {siteConfig.homePage?.postCountLabel || 'published insights'}</span>
            <span><strong className="mr-2 text-lg text-white">{siteConfig.homePage?.trustValue || '100%'}</strong> {siteConfig.homePage?.trustLabel || 'independent'}</span>
          </motion.div>
        </div>

        {heroImage && <motion.div variants={itemVariants} className="relative mx-auto w-full max-w-[42rem] lg:max-w-none">
          <div className="absolute inset-10 rounded-full bg-teal-300/15 blur-3xl" />
          <img src={sitePath(heroImage)} alt={siteConfig.homePage?.heroImageAlt || ''} className="relative z-10 h-auto w-full drop-shadow-2xl" />
          <div className="absolute bottom-[8%] left-[4%] z-20 flex items-center gap-3 rounded-2xl border border-white/15 bg-[var(--site-primary)]/90 px-4 py-3 shadow-2xl backdrop-blur md:left-[8%]">
            {logoImage && <img src={sitePath(logoImage)} alt="" className="h-9 w-9 object-contain" />}
            <div>
              <span className="block font-mono text-[9px] uppercase tracking-[0.16em] text-white/70">{siteConfig.homePage?.visualEyebrow || 'Perspective'}</span>
              <strong className="text-xs text-white">{siteConfig.homePage?.visualTopics || 'AI · Automation · Digital work'}</strong>
            </div>
          </div>
        </motion.div>}
      </motion.div>
    </section>
  );
}
