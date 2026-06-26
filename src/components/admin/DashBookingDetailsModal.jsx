import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  Scissors, 
  Calendar, 
  Clock, 
  Hourglass, 
  CheckCircle2, 
  Copy, 
  Check, 
  ArrowUpRight 
} from 'lucide-react';
import {toast} from "react-toastify";
import { formatTime12Hour } from '../../helper/formatTime12Hour';
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const DashBookingDetailsModal = ({ isOpen, onClose, booking, fetchBookings }) => {
  const [copied, setCopied] = React.useState(false);

  // Lock body scroll when modal sheet is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleCopyPhone = async () => {
    try {
      await navigator.clipboard.writeText(booking?.customer.phone);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  // Motion Configuration Variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3, ease: "easeOut" } }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.94, y: 15 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 260, damping: 24, staggerChildren: 0.04, delayChildren: 0.1 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 150, damping: 15 } }
  };

  const canMarkCompleted =
  booking?.bookingStatus?.toLowerCase() === "confirmed";

  const handleMarkCompleted = async () => {
  try {
    if (booking?.bookingStatus !== "confirmed") {
      toast.error(
        booking?.bookingStatus === "completed"
          ? "Booking is already completed"
          : "Cancelled bookings cannot be completed"
      );
      return;
    }

    await updateDoc(doc(db, "bookings", booking.id), {
      bookingStatus: "completed",
      updatedAt: serverTimestamp(),
    });

    toast.success("Booking marked as completed");

    fetchBookings();

  } catch (error) {
    console.error(error);
    toast.error("Failed to update booking");
  }
};

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-x-hidden overflow-y-auto">
          
          {/* --- BACKDROP COVER LAYER --- */}
          <motion.div 
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
            className="fixed inset-0 bg-black/60 cursor-pointer"
          />

          {/* --- MODAL SURFACE CONTAINER --- */}
          {/* Fluid scale across sizes: max-w-[90%] (Mobile) -> sm:max-w-md (Tablet) -> md:max-w-lg (Laptop) -> lg:max-w-xl (Desktop) */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="relative w-full max-w-[92%] sm:max-w-md md:max-w-lg lg:max-w-xl bg-[#141414] border border-stone-800/60 rounded-2xl shadow-2xl overflow-hidden z-10 select-none transition-all duration-300"
          >
            {/* Top Premium Neon Line Accent Frame */}
            <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#E11D48] via-[#E11D48]/40 to-transparent" />

            {/* --- MODAL HEADER ROW --- */}
            <div className="flex items-center justify-between p-4 sm:p-5 md:p-6 border-b border-stone-900/80">
              <div className="space-y-0.5">
                <span className="text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#E11D48]">
                  Appointment File
                </span>
                <h3 className="text-sm sm:text-base md:text-lg font-bold tracking-tight text-stone-100 font-sans">
                  Booking Specifications
                </h3>
              </div>
              <button 
                onClick={onClose}
                className="p-1.5 sm:p-2 rounded-xl bg-stone-900/40 hover:bg-stone-900 border border-stone-800/40 hover:border-stone-800 text-stone-400 hover:text-stone-100 transition-all duration-200 cursor-pointer"
              >
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5" />
              </button>
            </div>

            {/* --- MODAL CORE DATA SHEET --- */}
            <div className="p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5 md:space-y-6">
              
              {/* SECTION: CLIENT IDENTITY CARD */}
              <motion.div variants={itemVariants} className="flex items-center justify-between p-3 sm:p-3.5 md:p-4 bg-[#1A1A1A]/40 border border-stone-800/30 rounded-xl gap-2">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-gradient-to-tr from-[#E11D48]/20 to-stone-900 border border-stone-800 flex items-center justify-center text-[#E11D48] font-bold text-xs sm:text-sm md:text-base flex-shrink-0">
                    {booking?.customer.name.charAt(0)}
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-[9px] sm:text-[10px] md:text-xs text-stone-500 font-medium">Client Account</p>
                    <h4 className="text-xs sm:text-sm md:text-base font-semibold text-stone-200 tracking-tight truncate">{booking?.customer.name}</h4>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] md:text-xs font-bold bg-emerald-950/30 border border-emerald-900/40 text-emerald-400 flex-shrink-0">
                  <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  {booking?.bookingStatus}
                </span>
              </motion.div>

              {/* SECTION: STRUCTURAL METADATA GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 md:gap-4">
                
                {/* CONTACT: PHONE */}
                <motion.div variants={itemVariants} className="p-3 sm:p-3.5 bg-[#1C1C1C]/30 border border-stone-900/60 rounded-xl space-y-1 sm:space-y-1.5 group relative">
                  <div className="flex items-center gap-2 text-stone-500">
                    <Phone className="w-3.5 h-3.5 text-stone-600 group-hover:text-[#E11D48] transition-colors" />
                    <span className="text-[9px] sm:text-[10px] md:text-xs font-medium uppercase tracking-wider">Phone Link</span>
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs md:text-sm font-semibold text-stone-300 tracking-wide truncate">{booking?.customer.phone}</span>
                    <button 
                      onClick={handleCopyPhone}
                      className="p-1 sm:p-1.5 rounded-md text-stone-500 hover:text-stone-300 hover:bg-stone-900/60 transition-all cursor-pointer flex-shrink-0"
                      title="Copy Number"
                    >
                      {copied ? <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" /> : <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                    </button>
                  </div>
                </motion.div>

                {/* CONTACT: EMAIL */}
                <motion.div variants={itemVariants} className="p-3 sm:p-3.5 bg-[#1C1C1C]/30 border border-stone-900/60 rounded-xl space-y-1 sm:space-y-1.5 group">
                  <div className="flex items-center gap-2 text-stone-500">
                    <Mail className="w-3.5 h-3.5 text-stone-600 group-hover:text-[#E11D48] transition-colors" />
                    <span className="text-[9px] sm:text-[10px] md:text-xs font-medium uppercase tracking-wider">Email Address</span>
                  </div>
                  <span className="block text-xs md:text-sm font-semibold text-stone-300 truncate tracking-normal">
                    {booking?.customer.email}
                  </span>
                </motion.div>

                {/* RESERVATION: SERVICE SELECT */}
                <motion.div variants={itemVariants} className="p-3 sm:p-3.5 bg-[#1C1C1C]/30 border border-stone-900/60 rounded-xl space-y-1 sm:space-y-1.5 group sm:col-span-2">
                  <div className="flex items-center gap-2 text-stone-500">
                    <Scissors className="w-3.5 h-3.5 text-stone-600 group-hover:text-[#E11D48] transition-colors" />
                    <span className="text-[9px] sm:text-[10px] md:text-xs font-medium uppercase tracking-wider">Requested Treatment</span>
                  </div>
                  <span className="block text-xs md:text-sm font-bold text-stone-200 tracking-tight truncate">
                    {booking?.service.id}
                  </span>
                </motion.div>

                {/* LOGISTICS: DATE */}
                <motion.div variants={itemVariants} className="p-3 sm:p-3.5 bg-[#1C1C1C]/30 border border-stone-900/60 rounded-xl space-y-1 sm:space-y-1.5 group">
                  <div className="flex items-center gap-2 text-stone-500">
                    <Calendar className="w-3.5 h-3.5 text-stone-600 group-hover:text-[#E11D48] transition-colors" />
                    <span className="text-[9px] sm:text-[10px] md:text-xs font-medium uppercase tracking-wider">Target Date</span>
                  </div>
                  <span className="block text-xs md:text-sm font-semibold text-stone-300 tracking-wide truncate">
                    {booking?.date}
                  </span>
                </motion.div>

                {/* LOGISTICS: TIMING & TIMEFRAME */}
                <motion.div variants={itemVariants} className="p-3 sm:p-3.5 bg-[#1C1C1C]/30 border border-stone-900/60 rounded-xl space-y-1 sm:space-y-1.5 group">
                  <div className="flex items-center gap-2 text-stone-500">
                    <Clock className="w-3.5 h-3.5 text-stone-600 group-hover:text-[#E11D48] transition-colors" />
                    <span className="text-[9px] sm:text-[10px] md:text-xs font-medium uppercase tracking-wider">Scheduled Window</span>
                  </div>
                  <div className="flex items-center justify-between gap-1.5 flex-wrap">
                    <span className="text-xs md:text-sm font-bold text-[#E11D48] tracking-wide whitespace-nowrap">
                      {formatTime12Hour(booking.startTime)}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] md:text-xs text-stone-500 font-medium bg-stone-900 px-1.5 py-0.5 rounded-md border border-stone-800/40 whitespace-nowrap">
                      <Hourglass className="w-2.5 h-2.5 text-stone-600" />
                      {booking?.service.duration} mins
                    </span>
                  </div>
                </motion.div>

              </div>
            </div>

            {/* --- MODAL ACTIONS FOOTER --- */}
            <div className="p-4 sm:p-5 md:p-6 bg-[#181818]/50 border-t border-stone-900 flex flex-col sm:flex-row items-center justify-end gap-2.5 sm:gap-3">
              
              <button 
                disabled={!canMarkCompleted}
                onClick={handleMarkCompleted}
                className={`w-full sm:w-auto order-2 sm:order-1 px-4 md:px-5 py-2 md:py-2.5 rounded-xl text-[11px] md:text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all duration-200
    ${
      canMarkCompleted
        ? "bg-emerald-950/20 hover:bg-emerald-950/40 text-emerald-400 border-emerald-900/50 hover:border-emerald-800 cursor-pointer"
        : "bg-stone-900/30 text-stone-600 border-stone-800 cursor-not-allowed"
    }
  `}      >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark Completed</span>
              </button>

              <button 
                onClick={() => { 
                  alert(`Redirecting dashboard view to details layout for ${booking?.customer.name}`); 
                }}
                className="w-full sm:w-auto order-1 sm:order-2 px-4 md:px-5 py-2 md:py-2.5 rounded-xl bg-stone-900 hover:bg-stone-850 border border-stone-800 text-[11px] md:text-xs font-semibold text-stone-200 hover:text-white flex items-center justify-center gap-1.5 shadow-lg transition-all duration-200 cursor-pointer group"
              >
                <span>Go to Booking</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-stone-500 group-hover:text-stone-300 transition-colors" />
              </button>
              
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DashBookingDetailsModal;