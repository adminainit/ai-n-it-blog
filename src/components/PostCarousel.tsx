import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { sitePath } from '../utils/urls';

export default function PostCarousel({ posts }) {
  const baseUrl = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : import.meta.env.BASE_URL + '/';
  const postUrl = (id: string) => baseUrl + 'blog/' + id;
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!posts || posts.length === 0) return null;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % posts.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + posts.length) % posts.length);
  };

  const currentPost = posts[currentIndex];
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="relative w-full h-full group">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="flex flex-col md:flex-row bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden h-full min-h-[340px]"
        >
          {/* Image Side */}
          <div className="md:w-3/5 relative h-48 md:h-full overflow-hidden bg-slate-200 dark:bg-slate-800">
            {currentPost.data.image ? (
              <img
                src={sitePath(currentPost.data.image)}
                alt={currentPost.data.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-bold uppercase">
                No image
              </div>
            )}
          </div>
          
          {/* Content Side */}
          <div className="md:w-2/5 p-6 lg:p-8 flex flex-col justify-center gap-3">
            <div className="flex gap-2 font-mono text-[10px] text-indigo-600 dark:text-indigo-400 uppercase font-bold mb-1">
              {currentPost.data.tags?.slice(0, 2).map((tag) => (
                <span key={tag}>#{tag}</span>
              ))}
            </div>
            
            <a href={postUrl(currentPost.id)} className="block">
              <h3 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white leading-snug hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-2">
                {currentPost.data.title}
              </h3>
            </a>
            
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {currentPost.data.description}
            </p>
            
            <div className="mt-4 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase">
                {formatDate(currentPost.data.date)}
              </span>
              <a href={postUrl(currentPost.id)} className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                Read Article
              </a>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {posts.length > 1 && (
        <div className="absolute bottom-4 right-4 lg:bottom-6 lg:right-6 flex gap-2">
          <button 
            onClick={prevSlide}
            className="w-8 h-8 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md shadow-sm flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700 focus:outline-none"
            aria-label="Previous slide"
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            onClick={nextSlide}
            className="w-8 h-8 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md shadow-sm flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700 focus:outline-none"
            aria-label="Next slide"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
