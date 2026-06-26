import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  Scissors, 
  CheckCircle2, 
  MoreVertical, 
  Eye, 
  Calendar,
  ChevronRight
} from 'lucide-react';
import DashBookingDetailsModal from './DashBookingDetailsModal';
import { formatTime12Hour } from '../../helper/formatTime12Hour';

const TodaysBookings = ({bookings,fetchBookings}) => {
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const today = new Date().toLocaleDateString("en-CA");

const todaysBookings = bookings?.filter(
  booking =>
    booking.date === today &&
    booking.bookingStatus !== "cancelled"
)

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 120, damping: 14 } }
  };

  const toggleDropdown = (id) => {
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const handleOpenDetails = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
    setActiveMenuId(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedBooking(null), 200); 
  };

  return (
    <div className="w-full bg-[#141414] rounded-2xl border border-stone-800/40 shadow-2xl p-4 sm:p-5 lg:p-6 xl:p-8">
      
      {/* --- SECTION HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 lg:mb-6 pb-4 border-b border-stone-900/80">
        <div className="space-y-0.5">
          <h2 className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold tracking-tight text-stone-100 font-sans">
            Today's Bookings
          </h2>
          <p className="text-[10px] sm:text-xs text-stone-400 font-medium tracking-wide">
            Live schedule for upcoming client treatments.
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-stone-900 border border-stone-800/60 px-2.5 py-1.5 rounded-xl text-[10px] sm:text-xs font-medium text-stone-400 self-start sm:self-center">
          <Calendar className="w-3.5 h-3.5 text-[#E11D48]" />
          <span>{today}</span>
        </div>
      </div>

      {/* --- LIST LAYOUT (LARGE DESKTOPS ONLY: XL & UP) --- */}
      <div className="hidden xl:block overflow-visible">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-stone-900 text-xs font-semibold uppercase tracking-wider text-stone-500">
              <th className="pb-3.5 pl-3 font-medium">Time</th>
              <th className="pb-3.5 font-medium">Customer</th>
              <th className="pb-3.5 font-medium">Service</th>
              <th className="pb-3.5 font-medium">Status</th>
              <th className="pb-3.5 pr-3 text-right font-medium">Action</th>
            </tr>
          </thead>
          
          <motion.tbody 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="divide-y divide-stone-900/60"
          >
            {todaysBookings?.map((booking) => (
              <motion.tr 
                key={booking.id}
                variants={itemVariants}
                className="group hover:bg-[#1C1C1C]/40 transition-colors duration-200"
              >
                <td className="py-4 pl-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#E11D48] tracking-wide whitespace-nowrap">
                    <Clock className="w-4 h-4 text-[#E11D48]/70 flex-shrink-0" />
                    <span>{formatTime12Hour(booking.startTime)}</span>
                  </div>
                </td>

                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-stone-200 font-sans group-hover:text-stone-100 transition-colors">
                      {booking?.customer.name}
                    </span>
                  </div>
                </td>

                <td className="py-4">
                  <div className="flex items-center gap-2 text-sm text-stone-400 font-normal">
                    <Scissors className="w-3.5 h-3.5 text-stone-600 group-hover:text-[#E11D48] transition-colors duration-300 flex-shrink-0" />
                    <span>{booking?.service.name}</span>
                  </div>
                </td>

                <td className="py-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/30 border border-emerald-900/40 text-emerald-400 whitespace-nowrap">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                    {booking?.bookingStatus}
                  </span>
                </td>

                <td className="py-4 pr-3 text-right relative">
                  <button 
                    onClick={() => toggleDropdown(booking.id)}
                    className="p-2 rounded-lg bg-stone-900/0 hover:bg-stone-900 border border-transparent hover:border-stone-800 text-stone-400 hover:text-stone-100 transition-all duration-200 cursor-pointer inline-flex items-center"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  <AnimatePresence>
                    {activeMenuId === booking.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setActiveMenuId(null)} />
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-3 mt-1.5 w-40 rounded-xl bg-[#1A1A1A] border border-stone-800 shadow-2xl z-20 py-1.5 text-left"
                        >
                          <button 
                            onClick={() => handleOpenDetails(booking)}
                            className="flex items-center gap-2.5 w-full px-3.5 py-2 text-xs text-stone-300 hover:text-white hover:bg-stone-900 transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#E11D48]" />
                            <span>View Details</span>
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </div>

      {/* --- CARDS GRID STACK LAYOUT (MOBILE & MEDIUM/TABLETS: BELOW XL) --- */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 xl:hidden gap-3.5"
      >
        {todaysBookings?.map((booking) => (
          <motion.div 
            key={booking.id}
            variants={itemVariants}
            className="w-full bg-[#1A1A1A]/50 border border-stone-800/60 rounded-xl p-4 flex flex-col justify-between gap-4"
          >
            {/* Top Row: Time & Badge Status */}
            <div className="flex items-center justify-between w-full gap-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#E11D48] tracking-wide">
                <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{formatTime12Hour(booking.startTime)}</span>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/30 border border-emerald-900/30 text-emerald-400 whitespace-nowrap">
                <CheckCircle2 className="w-2.5 h-2.5 flex-shrink-0" />
                <span>{booking?.bookingStatus}</span>
              </span>
            </div>

            {/* Middle Row: Client Profile & Service Treatment */}
            <div className="flex items-center gap-3">
              <div className="space-y-0.5 min-w-0 flex-1">
                <h4 className="text-xs sm:text-sm font-semibold text-stone-200 truncate">{booking?.customer.name}</h4>
                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-stone-400 font-medium">
                  <Scissors className="w-3 h-3 text-[#E11D48]/70 flex-shrink-0" />
                  <span className="truncate">{booking?.service.name}</span>
                </div>
              </div>
            </div>

            {/* Bottom Row: View Action Button */}
            <button 
              onClick={() => handleOpenDetails(booking)}
              className="w-full py-2 px-3 rounded-lg bg-stone-900 hover:bg-stone-850 border border-stone-800 text-xs font-medium text-stone-300 hover:text-white flex items-center justify-center gap-2 transition-all cursor-pointer group"
            >
              <Eye className="w-3.5 h-3.5 text-[#E11D48]" />
              <span>View Appointment</span>
              <ChevronRight className="w-3.5 h-3.5 ml-auto text-stone-600 group-hover:text-stone-400 transition-colors" />
            </button>
          </motion.div>
        ))}
      </motion.div>

      {/* --- BACKDROP APP DETAILS MODAL --- */}
      <DashBookingDetailsModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        booking={selectedBooking ? selectedBooking : undefined}
        fetchBookings={fetchBookings}
      />

    </div>
  );
};

export default TodaysBookings;