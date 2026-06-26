import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  CalendarMinus, 
  Edit2, 
  AlertCircle
} from 'lucide-react';

const TimeSlotHeader = ({ onBlockCustomSlotClick,settings }) => {
  const [isEditing, setIsEditing] = useState(false);

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' }
    }
  };
const formatTime12Hour = (time24) => {
  if (!time24) return "";

  const [hours, minutes] = time24.split(":");
  let h = parseInt(hours, 10);

  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;

  return `${h}:${minutes} ${ampm}`;
};


  return (
    <div className="w-full space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-12">
      {/* =========================================================================
          1. HEADER SECTION
         ========================================================================= */}
      <motion.div 
        variants={itemVariants}
        className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between 
          gap-4 sm:gap-6 md:gap-8 
          pb-4 sm:pb-5 md:pb-6 lg:pb-7 
          border-b border-stone-900"
      >
        <div className="space-y-1 md:space-y-1.5 max-w-xl lg:max-w-2xl">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-[#E11D48] animate-pulse" />
            <span className="font-bold uppercase tracking-widest text-zinc-500 text-[9px] sm:text-[10px] md:text-xs">
              System Configuration
            </span>
          </div>
          <h1 className="font-extrabold tracking-tight text-white font-sans leading-tight text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">
            Time Slot Management
          </h1>
          <p className="font-medium text-zinc-400 leading-relaxed text-[11px] sm:text-xs md:text-sm lg:text-base">
            Manage booking availability, setup operational parameters, and block custom timings.
          </p>
        </div>

        <motion.button
          onClick={onBlockCustomSlotClick}
          whileHover={{ scale: 1.015, backgroundColor: '#BE123C' }}
          whileTap={{ scale: 0.985 }}
          className="inline-flex items-center justify-center font-bold text-white shadow-lg shadow-rose-950/30 transition-all cursor-pointer group self-start sm:self-auto shrink-0
            gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl px-3.5 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3 text-[11px] sm:text-xs md:text-sm bg-[#E11D48]"
        >
          <CalendarMinus className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:rotate-6" />
          <span>Block Custom Slot</span>
        </motion.button>
      </motion.div>

      {/* =========================================================================
          2. WORKING HOURS CARD
         ========================================================================= */}
      <motion.div 
        variants={itemVariants}
        className="relative overflow-hidden w-full border border-stone-800/60 bg-[#141416] shadow-xl shadow-black/40 group
          p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 rounded-xl sm:rounded-2xl md:rounded-3xl"
      >
        {/* Neon Rose Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#E11D48] via-[#E11D48]/30 to-transparent" />

        {/* Card Header Row */}
        <div className="flex flex-row items-center justify-between pb-3.5 sm:pb-4 md:pb-5 lg:pb-6 border-b border-stone-900">
          <div className="flex items-center gap-2.5 sm:gap-3 md:gap-4">
            <div className="flex items-center justify-center bg-zinc-900 border border-stone-800 text-[#E11D48] shrink-0 w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-11 lg:h-11 rounded-lg sm:rounded-xl">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
            </div>
            <div className="space-y-0.5">
              <h3 className="font-bold text-white tracking-wide text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">
                Operational Working Hours
              </h3>
              <p className="font-medium text-zinc-500 text-[10px] sm:text-[11px] md:text-xs lg:text-sm">
                Standard schedule applied across routine booking templates
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center font-bold bg-zinc-900 hover:bg-zinc-850 border border-stone-800 text-zinc-300 hover:text-white transition-all cursor-pointer shrink-0 gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:px-3.5 sm:py-2 md:px-4 md:py-2.5 rounded-lg sm:rounded-xl text-[10px] sm:text-[11px] md:text-xs lg:text-sm"
          >
            <Edit2 className="w-2.5 h-2.5 sm:w-3 h-3 text-zinc-500" />
            <span>{isEditing ? 'Save' : 'Edit Hours'}</span>
          </motion.button>
        </div>

        {/* Information Fields Data Sheet Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 pt-4 sm:pt-5 md:pt-6 lg:pt-8">
          {/* Field Component 1: Opening Time */}
          <div className="bg-zinc-900/20 border border-stone-900/60 rounded-xl transition-colors group-hover:border-stone-800/40 p-3 sm:p-3.5 md:p-4 lg:p-5 space-y-1 md:space-y-1.5">
            <p className="font-bold text-zinc-500 uppercase tracking-wider text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs">
              Opening Window
            </p>
            <div className="flex items-baseline justify-between">
              <span className="font-black tracking-wide text-stone-200 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">
                {formatTime12Hour(settings?.openingTime)}
              </span>
              <span className="font-extrabold text-[#E11D48] bg-rose-950/20 border border-rose-900/20 px-1 sm:px-1.5 py-0.5 rounded sm:rounded-md text-[9px] sm:text-[10px] md:text-xs">
                AM
              </span>
            </div>
          </div>

          {/* Field Component 2: Closing Time */}
          <div className="bg-zinc-900/20 border border-stone-900/60 rounded-xl transition-colors group-hover:border-stone-800/40 p-3 sm:p-3.5 md:p-4 lg:p-5 space-y-1 md:space-y-1.5">
            <p className="font-bold text-zinc-500 uppercase tracking-wider text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs">
              Closing Window
            </p>
            <div className="flex items-baseline justify-between">
              <span className="font-black tracking-wide text-stone-200 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">
               {formatTime12Hour(settings?.closingTime)}
              </span>
              <span className="font-extrabold text-zinc-400 bg-zinc-900 border border-stone-800 px-1 sm:px-1.5 py-0.5 rounded sm:rounded-md text-[9px] sm:text-[10px] md:text-xs">
                PM
              </span>
            </div>
          </div>

          {/* Field Component 3: Slot Step Duration */}
          <div className="bg-zinc-900/20 border border-stone-900/60 rounded-xl transition-colors group-hover:border-stone-800/40 p-3 sm:p-3.5 md:p-4 lg:p-5 space-y-1 md:space-y-1.5">
            <p className="font-bold text-zinc-500 uppercase tracking-wider text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs">
              Slot Time Increment
            </p>
            <div className="flex items-baseline justify-between">
              <span className="font-black tracking-tight text-white text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">
                {settings?.slotDuration}
              </span>
              <span className="font-semibold text-zinc-500 text-[10px] sm:text-xs md:text-sm">
                minutes
              </span>
            </div>
          </div>
        </div>

        {/* Informative Alert Footer Panel */}
        <div className="border border-stone-900/80 bg-zinc-900/30 mt-4 sm:mt-5 md:mt-6 lg:mt-8 p-2.5 sm:p-3 md:p-3.5 lg:p-4 rounded-xl md:rounded-2xl flex items-start sm:items-center gap-2 sm:gap-2.5">
          <AlertCircle className="text-[#E11D48] shrink-0 w-3.5 h-3.5 md:w-4 md:h-4 lg:w-4.5 lg:h-4.5" />
          <p className="font-medium text-zinc-500 leading-normal text-[10px] sm:text-[11px] md:text-xs lg:text-sm">
            Altering operational cycles instantly adjusts global client booking screens down to the chosen increment window.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default TimeSlotHeader;