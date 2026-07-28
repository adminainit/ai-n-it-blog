import React, { ReactNode } from 'react';
import { siteConfig } from '../../site.config';

import ThemeToggle from './ThemeToggle';

function Header() {
  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-10 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-200">
      <div className="flex items-center gap-3">
        {siteConfig.branding.logoImage ? (
          <img src={siteConfig.branding.logoImage} alt="Logo" className="max-h-12 max-w-[200px] w-auto object-contain" />
        ) : (
          <div className="w-8 h-8 bg-accent rounded-sm flex items-center justify-center font-display font-bold text-lg text-white">
            {siteConfig.branding.logoText.charAt(0)}
          </div>
        )}
        <span className="font-display font-bold text-xl tracking-tight text-slate-900 dark:text-white">
          {siteConfig.branding.logoText}
        </span>
      </div>
      <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-600 dark:text-slate-300">
        <a href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors duration-300">
          Public Site
        </a>
        <a href="/admin" className="text-slate-900 dark:text-white px-3 py-2 border-b-2 border-accent">
          Admin Portal
        </a>
        <div className="pl-4 border-l border-slate-200 dark:border-slate-700">
          <ThemeToggle />
        </div>
      </nav>
      
      {/* Mobile menu toggle (placeholder for responsiveness) */}
      <div className="md:hidden flex items-center gap-4 text-slate-600 dark:text-slate-300">
        <ThemeToggle />
        <button className="hover:text-slate-900 dark:hover:text-white p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-primary-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-slate-700 dark:text-slate-300">
            {siteConfig.branding.logoText}
          </span>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} All rights reserved. <span className="ml-2 px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-xs font-mono">v{siteConfig.version || '1.0.0'}</span>
          </span>
        </div>
        <div className="flex space-x-6 text-sm text-slate-500 dark:text-slate-400">
          <a href="#" className="hover:text-primary transition-colors">Privacy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms</a>
          <a href="#" className="hover:text-primary transition-colors">Support</a>
        </div>
      </div>
    </footer>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    
      <div className="min-h-screen flex flex-col font-sans bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <Header />
        <main className="flex-grow flex flex-col">
          {children}
        </main>
        <Footer />
      </div>
    
  );
}
