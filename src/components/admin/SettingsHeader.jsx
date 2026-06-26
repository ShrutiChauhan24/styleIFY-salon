import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sliders } from 'lucide-react';


export default function SettingsHeader() {

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: 'spring',
        stiffness: 140,
        damping: 22,
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 160, damping: 20 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full bg-[#121214]/60 backdrop-blur-md border border-stone-900/80 rounded-2xl p-5 sm:p-6 md:p-8 shadow-2xl shadow-black/40 selection:bg-[#e61e53]/30"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 md:gap-6">
        
        {/* Left Side Section: Typography Stack */}
        <motion.div variants={itemVariants} className="space-y-1.5 md:space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-[#e61e53]/10 border border-[#e61e53]/20 rounded-lg text-[#e61e53] shrink-0">
              <Sliders className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#e61e53]">
              System Configuration
            </span>
          </div>
          
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
            Settings
          </h1>
          
          <p className="text-xs sm:text-sm text-stone-400 font-medium leading-relaxed">
            Manage salon preferences, branding, and administrator controls.
          </p>
        </motion.div>

      </div>
    </motion.div>
  );
}