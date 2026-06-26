import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Phone, Scissors, ArrowLeft, RotateCcw } from 'lucide-react';
import { useLocation } from "react-router-dom";
import { formatTime12Hour } from '../helper/formatTime12Hour';

const BookingConfirmed = () => {
const location = useLocation();
const bookingDetails = location.state?.booking;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 110, damping: 16 } 
    }
  };

  const checkmarkVariants = {
    hidden: { pathLength: 0, strokeDasharray: 100 },
    visible: { 
      pathLength: 1, 
      transition: { duration: 0.5, ease: "easeInOut", delay: 0.2 } 
    }
  };

  const circleVariants = {
    hidden: { scale: 0.85, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1, 
      transition: { type: "spring", stiffness: 180, damping: 14 } 
    }
  };
if (!bookingDetails) {
  return (
    <div className="text-white p-10">
      Booking information not found. 
    </div>
  );
}
  return (
   
    <div className="h-auto w-full bg-[#0f0f10] text-[#f3f4f6] flex flex-col justify-start items-center p-4 sm:p-6 md:p-8 lg:p-12 selection:bg-[#ff2e74] selection:text-white font-sans antialiased overflow-visible relative box-border">
      
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-[-10%] w-[40%] h-[40%] bg-[#ff2e74]/10 rounded-full blur-[80px] sm:blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-[#ff2e74]/5 rounded-full blur-[100px] sm:blur-[140px]" />
      </div>

      <div className="h-16 sm:h-20 md:h-24 lg:h-28 w-full block shrink-0 pointer-events-none z-0" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-xs sm:max-w-md md:max-w-xl lg:max-w-2xl xl:max-w-3xl flex flex-col items-center text-center z-10 mt-2 mb-6 sm:mt-4 sm:mb-10 md:mt-6 md:mb-12"
      >
        <motion.div variants={circleVariants} className="relative mb-5 sm:mb-6 md:mb-8 lg:mb-10 group">
          <div className="absolute inset-0 bg-[#ff2e74]/20 rounded-full blur-xl group-hover:bg-[#ff2e74]/30 transition-all duration-500" />
          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full bg-gradient-to-tr from-[#1a1a1c] to-[#27272a] border border-[#ff2e74]/30 flex items-center justify-center relative shadow-[0_0_30px_rgba(255,46,116,0.15)]">
            <svg className="w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11 lg:w-14 lg:h-14 text-[#ff2e74]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <motion.path 
                variants={checkmarkVariants}
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
        </motion.div>

        <motion.h1 
          variants={itemVariants}
          className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight bg-gradient-to-b from-white to-[#d1d5db] bg-clip-text text-transparent mb-2 sm:mb-3"
        >
          Appointment Confirmed!
        </motion.h1>
        
        <motion.p 
          variants={itemVariants}
          className="text-[11px] sm:text-xs md:text-sm lg:text-base text-gray-400 max-w-[280px] sm:max-w-sm md:max-w-md lg:max-w-xl mb-6 sm:mb-8 md:mb-10 lg:mb-12 font-medium leading-relaxed"
        >
          Your slot has been successfully booked. We're looking forward to giving you a premium experience.
        </motion.p>

        <motion.div 
          variants={itemVariants}
          className="w-full bg-gradient-to-b from-[#1a1a1c] to-[#141416] border border-[#27272a] rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 text-left shadow-[0_20px_50px_rgba(0,0,0,0.4)] relative group hover:border-[#ff2e74]/20 transition-all duration-500 overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#ff2e74]/40 to-transparent" />
          
      
          <div className="flex flex-row justify-between items-center border-b border-[#27272a]/70 pb-3 sm:pb-4 md:pb-5 mb-4 sm:mb-6 lg:mb-8">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg bg-[#27272a]/50 text-[#ff2e74]">
                <Scissors size={16} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
              </div>
              <span className="text-xs sm:text-sm md:text-base font-semibold tracking-wide uppercase text-gray-300">Receipt Details</span>
            </div>
            <div className="text-right">
              <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-500 font-medium uppercase tracking-wider mb-0.5 sm:mb-1">Booking ID</p>
              <p className="text-[10px] sm:text-xs md:text-sm font-mono font-bold text-[#ff2e74] bg-[#ff2e74]/5 px-2 py-0.5 sm:px-2.5 rounded border border-[#ff2e74]/10">#{bookingDetails.id}</p>
            </div>
          </div>

     
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-5 md:gap-6 lg:gap-8">
            <div className="space-y-0.5 sm:space-y-1">
              <span className="text-[10px] sm:text-[11px] md:text-xs text-gray-500 font-medium tracking-wider uppercase block">Selected Service</span>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white tracking-wide">{bookingDetails?.service.name}</p>
            </div>

            <div className="space-y-0.5 sm:space-y-1">
              <span className="text-[10px] sm:text-[11px] md:text-xs text-gray-500 font-medium tracking-wider uppercase block">Scheduled Date</span>
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm md:text-base lg:text-lg text-gray-200 font-semibold">
                <Calendar size={13} className="text-gray-400 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                <span>{bookingDetails.date}</span>
              </div>
            </div>

            <div className="space-y-0.5 sm:space-y-1">
              <span className="text-[10px] sm:text-[11px] md:text-xs text-gray-500 font-medium tracking-wider uppercase block">Booking Time</span>
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm md:text-base lg:text-lg text-gray-200 font-semibold">
                <Clock size={13} className="text-gray-400 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                <span>{formatTime12Hour(bookingDetails.time)}</span>
              </div>
            </div>

            <div className="space-y-0.5 sm:space-y-1">
              <span className="text-[10px] sm:text-[11px] md:text-xs text-gray-500 font-medium tracking-wider uppercase block">Client Guest</span>
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm md:text-base lg:text-lg text-gray-200 font-semibold">
                <User size={13} className="text-gray-400 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                <span>{bookingDetails?.customer?.name}</span>
              </div>
            </div>

            <div className="sm:col-span-2 space-y-0.5 sm:space-y-1 pt-2 md:pt-3 border-t border-[#27272a]/40">
              <span className="text-[10px] sm:text-[11px] md:text-xs text-gray-500 font-medium tracking-wider uppercase block">Contact Number</span>
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm md:text-base lg:text-lg text-gray-300 font-medium">
                <Phone size={13} className="text-gray-500 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                <span>{bookingDetails?.customer?.phone}</span>
              </div>
            </div>
          </div>
        </motion.div>

    
        <motion.p 
          variants={itemVariants}
          className="text-[10px] sm:text-xs md:text-sm text-[#ff2e74] font-semibold tracking-wide bg-[#ff2e74]/5 border border-[#ff2e74]/10 rounded-full px-4 py-1.5 sm:px-5 sm:py-2 mt-6 sm:mt-8 md:mt-10 shadow-inner animate-pulse"
        >
          Please arrive 10 minutes early.
        </motion.p>

     
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-8 sm:mt-10 lg:mt-12 w-full"
        >
          <button className="w-full sm:w-auto sm:min-w-[160px] md:min-w-[180px] lg:min-w-[200px] px-5 py-3 sm:py-3.5 md:py-4 rounded-xl border border-[#27272a] bg-[#141416] text-gray-300 hover:text-white hover:bg-[#1a1a1c] hover:border-gray-500 font-semibold text-xs sm:text-sm lg:text-base tracking-wide transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer group active:scale-[0.98]">
            <ArrowLeft size={15} className="text-gray-400 group-hover:text-[#ff2e74] lg:w-5 lg:h-5 transition-colors duration-300" />
            Back Home
          </button>
          
          <button className="w-full sm:w-auto sm:min-w-[160px] md:min-w-[180px] lg:min-w-[200px] px-5 py-3 sm:py-3.5 md:py-4 rounded-xl bg-gradient-to-r from-[#ff2e74] to-[#e01a5c] text-white font-bold text-xs sm:text-sm lg:text-base tracking-wide shadow-[0_10px_25px_rgba(255,46,116,0.3)] hover:shadow-[0_15px_30px_rgba(255,46,116,0.45)] hover:brightness-110 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]">
            <RotateCcw size={15} className="lg:w-5 lg:h-5" />
            Book Again
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default BookingConfirmed;