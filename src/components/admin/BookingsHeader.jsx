import React from 'react';
import { motion } from 'framer-motion';
import { CalendarRange, Plus, Sparkles } from 'lucide-react';

const BookingsHeader = ({ onAddWalkIn }) => {
  const containerVariants = {
    hidden: { opacity: 0, y: -12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 140,
        damping: 18,
        staggerChildren: 0.06,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -8 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 180, damping: 16 } }
  };

  return (
    <motion.header
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      // CHANGED: Kept flex-col up to lg screens, adjusted gaps and padding for tablet layouts
      className="w-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 lg:gap-8 p-2 sm:p-4 lg:p-6 select-none"
    >
      {/* LEFT SECTION: TYPOGRAPHY HIERARCHY */}
      <div className="flex items-center sm:items-start gap-3 sm:gap-4">
        
        {/* Calendar Icon - Hidden on mobile, beautifully sized on tablets and desktops */}
        <motion.div 
          variants={itemVariants}
          className="hidden sm:flex p-2.5 lg:p-3 rounded-xl bg-[#141617] border border-[#1a1c1d] text-rose-500 items-center justify-center shrink-0 shadow-sm"
        >
          <CalendarRange className="w-5 h-5 lg:w-6 lg:h-6" />
        </motion.div>

        <div className="space-y-1 lg:space-y-1.5">
          {/* Status Badges */}
          <motion.div variants={itemVariants} className="flex items-center gap-2 flex-wrap">
            <span className="text-[9px] sm:text-[10px] lg:text-xs font-bold uppercase tracking-widest text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
              Live Console
            </span>
            <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] lg:text-xs text-stone-500 font-medium">
              <Sparkles className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-stone-600" />
              Updated Just Now
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1 variants={itemVariants} className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
            Bookings
          </motion.h1>

          {/* Subtext */}
          <motion.p variants={itemVariants} className="text-xs lg:text-sm text-stone-400 font-medium">
            Manage all salon appointments
          </motion.p>
        </div>
      </div>

      {/* RIGHT SECTION: PREMIUM CALL TO ACTION BUTTON */}
      {/* CHANGED: Made it full-width on mobile/tablet, auto-width on large desktop viewports */}
      <motion.div variants={itemVariants} className="w-full lg:w-auto shrink-0">
        <button
          onClick={onAddWalkIn}
          className="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 lg:px-5 lg:py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-xs sm:text-sm lg:text-base font-semibold text-white shadow-lg shadow-rose-900/20 border border-rose-500/20 transition-all duration-300 transform active:scale-[0.98] cursor-pointer group"
        >
          <Plus className="w-4 h-4 lg:w-5 lg:h-5 text-white/90 group-hover:rotate-90 transition-transform duration-300 ease-out" />
          <span className="tracking-wide">Add Walk-in Booking</span>
        </button>
      </motion.div>
    </motion.header>
  );
};

export default BookingsHeader;