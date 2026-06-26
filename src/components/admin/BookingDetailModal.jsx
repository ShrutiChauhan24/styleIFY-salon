import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Phone,
  Mail,
  Scissors,
  Calendar,
  Clock,
  Hourglass,
  CheckCircle2,
  Copy,
  Check,
  Edit3,
  Trash2,
  Hash,
  CreditCard,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { formatTime12Hour } from '../../helper/formatTime12Hour';

const BookingDetailModal = ({ 
  isOpen, 
  onClose, 
  onEditClick, 
  booking
}) => {
  const [copied, setCopied] = useState(false);

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
      await navigator.clipboard.writeText(booking.phone);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const getPaymentBadge = (status = '') => {
    const normStatus = status.toLowerCase();
    
    switch (normStatus) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/30 border border-emerald-900/40 text-emerald-400 shrink-0">
            <CreditCard className="w-2.5 h-2.5" />
            Paid
          </span>
        );
      case 'partial':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/30 border border-amber-900/40 text-amber-400 shrink-0">
            <AlertCircle className="w-2.5 h-2.5" />
            Partial
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-950/30 border border-rose-900/40 text-rose-400 shrink-0">
            <HelpCircle className="w-2.5 h-2.5" />
            Pending
          </span>
        );
    }
  };

  // --- RESTORED FRAMER MOTION CONFIGURATIONS ---
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.25, ease: "easeOut" } }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 15 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 280, damping: 26, staggerChildren: 0.04, delayChildren: 0.05 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 160, damping: 16 } }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-hidden">
          
          {/* --- BACKDROP COVER LAYER - Less bright, blur removed --- */}
          <motion.div 
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
            className="fixed inset-0 bg-black/60 cursor-pointer"
          />

          {/* --- MODAL SURFACE CONTAINER - Scaled responsively for small, medium, and large screens --- */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="relative w-full max-w-[92vw] sm:max-w-md md:max-w-lg lg:max-w-xl max-h-[90vh] md:max-h-[85vh] bg-[#141414] border border-stone-800/60 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col select-none transition-all duration-300"
          >
            {/* Top Premium Neon Line Accent Frame */}
            <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#E11D48] via-[#E11D48]/40 to-transparent z-20" />

            {/* --- MODAL HEADER ROW --- */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-stone-900/80 shrink-0 bg-[#141414]">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#E11D48]">
                    Appointment File
                  </span>
                  <span className="inline-flex items-center gap-0.5 text-[10px] bg-stone-900 border border-stone-800 text-stone-400 px-1.5 py-0.5 rounded font-mono font-medium">
                    <Hash className="w-2.5 h-2.5 text-stone-500" />
                    {booking.id}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold tracking-tight text-stone-100 font-sans">
                  Booking Specifications
                </h3>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-xl bg-stone-900/40 hover:bg-stone-900 border border-stone-800/40 hover:border-stone-800 text-stone-400 hover:text-stone-100 transition-all duration-200 cursor-pointer"
              >
                <X className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </button>
            </div>

            {/* --- MODAL CORE DATA SHEET --- */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 sm:space-y-5 custom-scrollbar flex-1">
              {/* Client Profile Row */}
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-[#1A1A1A]/40 border border-stone-800/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#E11D48]/20 to-stone-900 border border-stone-800 flex items-center justify-center text-[#E11D48] font-bold text-sm sm:text-base shrink-0">
                    {booking.customer?.name
  ? booking.customer.name.charAt(0).toUpperCase()
  : "U"}
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-[10px] sm:text-xs text-stone-500 font-medium">Client Account</p>
                    <h4 className="text-sm sm:text-base font-semibold text-stone-200 tracking-tight truncate">{booking?.customer.name}</h4>
                  </div>
                </div>
                
                {/* Status Badges Group */}
                <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-emerald-950/30 border border-emerald-900/40 text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" />
                    {booking.bookingStatus}
                  </span>
                </div>
              </motion.div>

              {/* Payment Status */}
<motion.div
  variants={itemVariants}
  className="p-3.5 bg-[#1C1C1C]/30 border border-stone-900/60 rounded-xl space-y-1.5 group"
>
  <div className="flex items-center gap-2 text-stone-500">
    <CreditCard className="w-3.5 h-3.5 text-stone-600 group-hover:text-[#E11D48] transition-colors" />
    <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider">
      Payment Status
    </span>
  </div>

  {getPaymentBadge(booking.paymentStatus)}
</motion.div>

              {/* Data Cards Grid Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Phone */}
                <motion.div variants={itemVariants} className="p-3.5 bg-[#1C1C1C]/30 border border-stone-900/60 rounded-xl space-y-1.5 group relative">
                  <div className="flex items-center gap-2 text-stone-500">
                    <Phone className="w-3.5 h-3.5 text-stone-600 group-hover:text-[#E11D48] transition-colors" />
                    <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider">Phone Link</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs sm:text-sm font-semibold text-stone-300 tracking-wide truncate">{booking.customer.phone}</span>
                    <button 
                      type="button"
                      onClick={handleCopyPhone}
                      className="p-1.5 rounded-md text-stone-500 hover:text-stone-300 hover:bg-stone-900/60 transition-all cursor-pointer shrink-0"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </motion.div>

                {/* Email */}
                <motion.div variants={itemVariants} className="p-3.5 bg-[#1C1C1C]/30 border border-stone-900/60 rounded-xl space-y-1.5 group">
                  <div className="flex items-center gap-2 text-stone-500">
                    <Mail className="w-3.5 h-3.5 text-stone-600 group-hover:text-[#E11D48] transition-colors" />
                    <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider">Email Address</span>
                  </div>
                  <span className="block text-xs sm:text-sm font-semibold text-stone-300 truncate">{booking.customer.email || 'N/A'}</span>
                </motion.div>

                {/* Service */}
                <motion.div variants={itemVariants} className="p-3.5 bg-[#1C1C1C]/30 border border-stone-900/60 rounded-xl space-y-1.5 group sm:col-span-2">
                  <div className="flex items-center gap-2 text-stone-500">
                    <Scissors className="w-3.5 h-3.5 text-stone-600 group-hover:text-[#E11D48] transition-colors" />
                    <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider">Requested Treatment</span>
                  </div>
                  <span className="block text-xs sm:text-sm font-bold text-stone-200 tracking-tight">{booking.service.name}</span>
                </motion.div>

                {/* Date */}
                <motion.div variants={itemVariants} className="p-3.5 bg-[#1C1C1C]/30 border border-stone-900/60 rounded-xl space-y-1.5 group">
                  <div className="flex items-center gap-2 text-stone-500">
                    <Calendar className="w-3.5 h-3.5 text-stone-600 group-hover:text-[#E11D48] transition-colors" />
                    <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider">Target Date</span>
                  </div>
                  <span className="block text-xs sm:text-sm font-semibold text-stone-300 tracking-wide">{booking.date}</span>
                </motion.div>

                {/* Time */}
                {/* Time */}
<motion.div
  variants={itemVariants}
  className="p-3.5 bg-[#1C1C1C]/30 border border-stone-900/60 rounded-xl space-y-1.5 group"
>
  <div className="flex items-center gap-2 text-stone-500">
    <Clock className="w-3.5 h-3.5 text-stone-600 group-hover:text-[#E11D48] transition-colors" />
    <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider">
      Scheduled Window
    </span>
  </div>

  <div className="flex flex-col gap-1">
    <span className="text-xs sm:text-sm font-bold text-[#E11D48]">
      {formatTime12Hour(booking.startTime)}
    </span>

    <span className="text-xs sm:text-sm font-semibold text-stone-300">
      Ends: {formatTime12Hour(booking.endTime)}
    </span>

    <span className="inline-flex w-fit items-center gap-1 text-[10px] sm:text-xs text-stone-500 font-medium bg-stone-900 px-2 py-0.5 rounded-md border border-stone-800/40">
      <Hourglass className="w-3 h-3 text-stone-600" />
      {booking.service?.duration} mins
    </span>
  </div>
</motion.div>
              </div>
            </div>

            {/* --- MODAL ACTIONS FOOTER --- */}
            <div className="p-4 sm:p-5 bg-[#181818]/70 border-t border-stone-900 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button 
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2 sm:py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 bg-red-950/10 hover:bg-red-950/30 border border-red-900/30 hover:border-red-900/60 transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 order-last sm:order-first"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Cancel Appointment</span>
              </button>

              <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                {/* CONNECTED EDIT BUTTON */}
                <button 
                  type="button"
                  onClick={onEditClick}
                  className="w-full sm:w-auto px-4 py-2 sm:py-2.5 rounded-xl bg-stone-900 hover:bg-stone-850 border border-stone-800 text-xs font-semibold text-stone-300 hover:text-white flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer group"
                >
                  <Edit3 className="w-3.5 h-3.5 text-stone-500 group-hover:text-stone-400 transition-colors" />
                  <span>Edit Details</span>
                </button>

                <button 
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-emerald-950/20 hover:bg-emerald-950/40 text-xs font-semibold text-emerald-400 border border-emerald-900/50 hover:border-emerald-800 transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 shadow-lg"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark Completed</span>
                </button>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BookingDetailModal;