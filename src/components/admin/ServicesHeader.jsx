import React from 'react';
import { motion } from 'framer-motion';

const ServicesHeader = ({onAddClick}) => {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full bg-[#121212] border-b border-zinc-800/50 px-4 py-5 sm:px-5 md:px-6 lg:px-8 lg:py-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 select-none"
    >
      <div className="flex items-center gap-3.5 md:gap-4">
        <div className="relative flex-shrink-0 w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800/80 text-[#E31A53] shadow-inner shadow-black/50 group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#E31A53]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth="1.5" 
            stroke="currentColor" 
            className="w-5 h-5 md:w-5.5 md:h-5.5 relative z-10 transition-transform duration-300 group-hover:scale-110"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
          </svg>
        </div>

        <div className="space-y-0.5">
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-50 font-sans">
              Services
            </h1>
            

            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#E31A53]/10 border border-[#E31A53]/20 text-[10px] font-semibold tracking-wide text-[#E31A53] uppercase backdrop-blur-sm">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E31A53] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#E31A53]"></span>
              </span>
              Live Console
            </div>
          </div>
          
          <p className="text-xs sm:text-sm text-zinc-400 font-medium tracking-wide">
            Manage salon services and categories
          </p>
        </div>
      </div>

      {/* Right Column: CTA Button */}
      {/* Kept auto-width adjustments clean so it doesn't span awkwardly on larger viewports */}
      <div className="flex items-center lg:self-center">
        <button 
          type="button"
          onClick={onAddClick}
          className="group relative w-full lg:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold tracking-wide text-white bg-gradient-to-r from-[#E31A53] to-[#C21243] hover:from-[#f02861] hover:to-[#d6184d] active:scale-[0.98] transition-all duration-200 shadow-[0_4px_20px_rgba(227,26,83,0.2)] hover:shadow-[0_6px_24px_rgba(227,26,83,0.35)] cursor-pointer border border-[#ff4073]/15 overflow-hidden"
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
          
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth="2.5" 
            stroke="currentColor" 
            className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-90"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span>Add Service</span>
        </button>
      </div>
    </motion.header>
  );
};

export default ServicesHeader;