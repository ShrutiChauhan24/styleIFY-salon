import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar } from 'lucide-react';

const BookingTabsComponent = ({activeTab, setActiveTab,searchQuery, setSearchQuery,selectedDate, setSelectedDate}) => {

  const tabs = ['All', 'Today', 'Upcoming', 'Completed', 'Cancelled'];
  const isDateFilterActive = !!selectedDate;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      // Fluid margins and gaps according to screen size
      className="w-full flex flex-col gap-4 sm:gap-5 lg:gap-6 p-2 sm:p-4 lg:p-6"
    >
      {/* Management Portal Badge Header */}
      <motion.div variants={itemVariants} className="text-left">
        <span className="text-[9px] sm:text-[10px] lg:text-xs tracking-[0.2em] uppercase font-bold text-rose-500 bg-rose-500/10 px-2.5 py-1 sm:px-3 rounded-full border border-rose-500/10">
          Management Portal
        </span>
      </motion.div>

      {/* Segmented Control Filter Bar */}
      {/* CHANGED: Switched to grid layout for reliable column distribution across different viewports */}
      <motion.div 
        variants={itemVariants}
        className="bg-[#141617] p-1 rounded-xl grid grid-cols-2 sm:flex sm:flex-wrap lg:flex-nowrap gap-1 items-center border border-[#1a1c1d]"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              disabled={
    isDateFilterActive &&
    (tab === "Today" || tab === "Upcoming")
  }
              onClick={() => setActiveTab(tab)}
              // Dynamic padding and typography scaling prevent overlapping content on smaller viewports
              className={`relative flex-1 text-center py-1.5 px-2.5 sm:py-2 sm:px-3 lg:py-2.5 lg:px-4 text-[11px] sm:text-xs lg:text-sm font-semibold tracking-wide rounded-lg transition-colors duration-200 focus:outline-none z-10 cursor-pointer ${
  isDateFilterActive &&
  (tab === "Today" || tab === "Upcoming")
    ? "opacity-40 cursor-not-allowed text-neutral-600"
    : "cursor-pointer"
} ${
                isActive ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'
              } ${tab === 'Cancelled' && 'col-span-2 sm:col-span-1' /* Keeps layout clean when grid splits */}`}
            >
              {isActive &&
 !(isDateFilterActive &&
   (tab === "Today" || tab === "Upcoming")) && (
  <motion.div
    layoutId="activeTabIndicator"
    className="absolute inset-0 bg-rose-600 rounded-lg shadow-md"
    transition={{
      type: "spring",
      stiffness: 400,
      damping: 32,
    }}
  />
)}
              <span className="relative z-20 whitespace-nowrap">{tab}</span>
            </button>
          );
        })}
      </motion.div>

      {/* Search Input and Date Pickers row */}
      {/* CHANGED: Reconfigured the column weights for mid-sized tablets like the iPad Mini */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-12 gap-3 lg:gap-4 items-center">
        
        {/* Search Input Field Container */}
        <div className="relative md:col-span-7 lg:col-span-8 group">
          <Search className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-500 group-focus-within:text-rose-500 transition-colors" />
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#141617] text-white text-xs sm:text-sm pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 rounded-xl border border-[#1a1c1d] focus:border-rose-500/50 focus:outline-none focus:ring-1 focus:ring-rose-500/30 placeholder-neutral-500 transition-all font-medium"
          />
        </div>

        {/* Date Selector Container */}
        <div className="relative md:col-span-5 lg:col-span-4 group">
          <Calendar className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-500 group-focus-within:text-rose-500 transition-colors pointer-events-none" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full bg-[#141617] text-white text-xs sm:text-sm pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 rounded-xl border border-[#1a1c1d] focus:border-rose-500/50 focus:outline-none focus:ring-1 focus:ring-rose-500/30 placeholder-neutral-500 transition-all font-medium appearance-none [color-scheme:dark]"
          />
        </div>

      </motion.div>
    </motion.div>
  );
};

export default BookingTabsComponent;