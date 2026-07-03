import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus('loading');
    
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setEmail('');
      
      // Reset after 3 seconds
      setTimeout(() => {
        setStatus('idle');
      }, 3000);
    }, 1500);
  };

  return (
    <section className="w-full max-w-[1200px] mx-auto px-6 md:px-10 py-12">
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        
        <div className="relative z-10 flex-1 text-center md:text-left">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
            Subscribe to the Newsletter
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto md:mx-0">
            Get the latest articles, tutorials, and insights delivered straight to your inbox. No spam, ever.
          </p>
        </div>
        
        <div className="relative z-10 w-full md:w-auto">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3 bg-white dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm w-full md:w-auto">
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email for weekly updates..." 
              required
              disabled={status !== 'idle'}
              className="bg-transparent text-[13px] px-3 py-2 sm:py-0 w-full sm:w-64 focus:outline-none text-slate-900 dark:text-white placeholder-slate-400"
            />
            <button 
              type="submit" 
              disabled={status !== 'idle'}
              className="px-4 py-2 w-full sm:w-auto bg-indigo-600 text-white text-[11px] font-bold rounded-lg shadow-sm shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-colors disabled:opacity-70 whitespace-nowrap"
            >
              {status === 'loading' ? 'Sending...' : status === 'success' ? 'Subscribed!' : 'Sign Up'}
            </button>
          </form>
          {status === 'success' && (
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-green-600 dark:text-green-400 text-xs mt-3 font-medium text-center md:text-left"
            >
              Thanks for subscribing! Check your inbox.
            </motion.p>
          )}
        </div>
      </div>
    </section>
  );
}
