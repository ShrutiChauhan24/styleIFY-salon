import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  ChevronRight,
  Clock,
  ShieldAlert,
  User,
  XCircle,
  Lock,
  Unlock,
  Sparkles,
} from "lucide-react";
import { collection, deleteDoc, doc, getDocs, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { db } from "../../firebase";
import { generateSlots } from "../../helper/generateSlots";
import { buildSlotsStatus } from "../../helper/buildSlotsStatus";
import { formatTime12Hour } from "../../helper/formatTime12Hour";
import {addMinutes} from "../../helper/addMinutes";

export default function SlotsManagement({ settings }) {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [slotsData, setSlotsData] = useState([]);

  useEffect(() => {
    fetchSlotsStatus();
  }, [selectedDate, settings]);

   const fetchSlotsStatus = async () => {
      const blockedQuery = query(
        collection(db, "blockedSlots"),
        where("date", "==", selectedDate),
      );

      const snapshot = await getDocs(blockedQuery);

      const blockedDocs = snapshot.docs.map((doc) => doc.data());
      
      const blockedTimes = blockedDocs.map((slot) => slot.slotTime);

      
      
      const bookedTimes = new Set();

      const bookedQuery = query(
        collection(db, "bookings"),
        where("date", "==", selectedDate),
      );

      const snapshotBookings = await getDocs(bookedQuery);

   const bookedDocs = snapshotBookings.docs
  .map((doc) => doc.data())
  .filter((booking) =>
    ["confirmed", "completed"].includes(
      booking.bookingStatus?.toLowerCase()
    )
  );

bookedDocs.forEach((booking) => {
  let current = booking.startTime;

  while (current < booking.endTime) {
    bookedTimes.add(current);

    current = addMinutes(
      current,
      settings.slotDuration
    );
  }
});

      const allSlots = generateSlots(
        settings?.openingTime,
        settings?.closingTime,
        settings?.slotDuration,
      );

      const slotsStatus = buildSlotsStatus({
       date: selectedDate,
       allSlots,
       blockedTimes,
       bookedTimes: [...bookedTimes],
});
      setSlotsData(slotsStatus);
    };

  const handleSlotClick = (slot) => {
    setSelectedSlot(slot);
    setIsDrawerOpen(true);
  };

  const updateSlotStatus = (id, newStatus) => {
    setSlotsData((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s)),
    );
    setIsDrawerOpen(false);
    setSelectedSlot(null);
  };

  const statusStyles = {
    available: {
      bg: "bg-emerald-950/20 border-emerald-900/40 text-emerald-400",
      pill: "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]",
      label: "Available",
    },
    booked: {
      bg: "bg-rose-950/15 border-rose-950/40 text-rose-400",
      pill: "bg-[#E11D48] shadow-[0_0_10px_rgba(225,29,72,0.4)]",
      label: "Booked",
    },
    blocked: {
      bg: "bg-stone-900/60 border-stone-800 text-stone-400",
      pill: "bg-stone-600",
      label: "Blocked",
    },
  };

  const handleBlockSlot = async () => {
  const docId = `${selectedDate}_${selectedSlot.time}`;

  await setDoc(
    doc(db, "blockedSlots", docId),
    {
      date: selectedDate,
      slotTime: selectedSlot.time,
      createdAt: serverTimestamp(),
    }
  );

  setIsDrawerOpen(false);

  fetchSlotsStatus();
};

const handleUnblockSlot = async () => {
  const docId = `${selectedDate}_${selectedSlot.time}`;

  await deleteDoc(
    doc(db, "blockedSlots", docId)
  );

  setIsDrawerOpen(false);

  fetchSlotsStatus();
};

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.04,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <>
      {/* =========================================================================
          MAIN CONTENT FRAMEWORK
          ========================================================================= */}
      <motion.div
        animate={{
          opacity: isDrawerOpen ? 0.35 : 1,
          filter: isDrawerOpen ? "brightness(0.5)" : "brightness(1)",
          scale: isDrawerOpen ? 0.995 : 1,
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full space-y-6 md:space-y-8 lg:space-y-10 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto py-6"
      >
        {/* SECTION 1: Header Dashboard Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-stone-900">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
              Daily Distribution Slots
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 font-medium max-w-2xl">
              Monitor reservation states, manipulate block windows, and track
              system load timelines.
            </p>
          </div>

          <div className="relative flex items-center w-full sm:max-w-xs group">
            <Calendar className="absolute left-3.5 w-4 h-4 text-[#E11D48] pointer-events-none transition-transform group-hover:scale-110" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-[#141416] border border-stone-800/80 rounded-xl font-bold tracking-wide text-white focus:outline-none focus:border-[#E11D48] transition-all cursor-pointer pl-11 pr-4 py-2.5 lg:py-3 text-xs sm:text-sm"
            />
          </div>
        </div>

        {/* SECTION 2: Responsive Slots Matrix Grid Frame */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-5 gap-4 lg:gap-5"
        >
          {slotsData.map((slot) => {
            const currentStatus = statusStyles[slot.status];
            const isSelectable = slot.status !== "booked";

            return (
              <motion.div
                key={slot.time}
                variants={itemVariants}
                whileHover={
                  isSelectable
                    ? { y: -4, scale: 1.012, borderColor: "#be123c" }
                    : {}
                }
                whileTap={isSelectable ? { scale: 0.988 } : {}}
                onClick={() => isSelectable && handleSlotClick(slot)}
                className={`relative overflow-hidden border p-4 sm:p-5 rounded-xl sm:rounded-2xl flex flex-col justify-between transition-all group h-full min-h-[170px]
                  ${isSelectable ? "cursor-pointer bg-[#141416] hover:bg-[#18181b]" : "cursor-not-allowed bg-[#111112]/40 opacity-80"} 
                  ${slot.status === "booked" ? "border-rose-950/20" : "border-stone-800/60"}`}
              >
                {isSelectable && (
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#E11D48]/0 via-[#E11D48]/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}

                {/* Card Top Row: Proportional Typography Transitions */}
                <div className="flex items-start justify-between w-full gap-2 mb-4">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Clock className="w-3.5 h-3.5 text-zinc-500" />
                    <div className="flex flex-col">
                      <span className="font-extrabold text-white tracking-tight text-xs sm:text-sm md:text-base">
                        {formatTime12Hour(slot.time)}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-medium">
                        {slot.time}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-bold tracking-wider uppercase shrink-0 ${currentStatus.bg}`}
                  >
                    <span
                      className={`w-1 h-1 rounded-full ${currentStatus.pill}`}
                    />
                    {currentStatus.label}
                  </div>
                </div>

                {/* Card Bottom Row: Perfectly Scaled Content Inner Blocks */}
                <div className="mt-auto pt-2.5 border-t border-stone-900/60 flex items-center justify-between text-zinc-500 w-full min-w-0">
                  {slot.status === "booked" ? (
                    <div className="w-full">
                      <p className="text-[11px] font-semibold text-rose-400 leading-relaxed">
                        This slot has an active booking and cannot be modified.
                      </p>
                    </div>
                  ) : (
                    <div className="w-full flex items-center justify-between text-[10px] sm:text-xs font-bold text-zinc-600 uppercase tracking-wider group-hover:text-zinc-400 transition-colors">
                      <span>Click to Action</span>
                      <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform text-zinc-600 group-hover:text-[#E11D48]" />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>

      {/* =========================================================================
          3. SIDE ACTION DRAWER SHEET
          ========================================================================= */}
      <AnimatePresence>
        {isDrawerOpen && selectedSlot && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs cursor-default"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 240 }}
              className="fixed top-0 right-0 h-full z-50 bg-[#141416] border-l border-stone-800 shadow-2xl shadow-black/80 flex flex-col justify-between w-full sm:w-[440px] md:w-[480px]"
            >
              <div className="p-5 sm:p-6 md:p-7 border-b border-stone-900 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 bg-stone-900/60 px-3 py-1.5 rounded-xl border border-stone-800">
                    <Sparkles className="w-3.5 h-3.5 text-[#E11D48]" />
                    <span className="text-[10px] sm:text-xs font-bold tracking-widest text-zinc-400 uppercase">
                      Slot Modifications
                    </span>
                  </div>
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-500 hover:text-white border border-stone-800 transition-all cursor-pointer"
                  >
                    <XCircle className="w-4 h-4 sm:w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-zinc-900 border border-stone-800 text-[#E11D48]">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      {formatTime12Hour(selectedSlot.time)}
                    </h3>

                    <p className="text-xs text-zinc-500 font-medium">
                      Raw Time: {selectedSlot.time}
                    </p>
                    <p className="text-xs text-zinc-500 font-medium">
                      Currently registered operational parameter
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1 p-5 sm:p-6 md:p-7 space-y-5 overflow-y-auto">
                <div className="p-4 rounded-xl bg-zinc-900/30 border border-stone-900 space-y-3">
                  <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                    Current Matrix Configuration
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-stone-400 font-medium">
                      Availability Status
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-md border text-xs font-bold ${statusStyles[selectedSlot.status].bg}`}
                    >
                      {statusStyles[selectedSlot.status].label}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-4 rounded-xl bg-zinc-900/10 border border-stone-900">
                  <ShieldAlert className="w-4 h-4 text-[#E11D48] shrink-0 mt-0.5" />
                  <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                    Adjusting live operational grid arrays immediately flags the
                    selected hour template window across live consumer frontend
                    terminals.
                  </p>
                </div>
              </div>

              <div className="p-5 sm:p-6 md:p-7 border-t border-stone-900 bg-[#0D0D0E]/60 backdrop-blur-sm">
                {selectedSlot.status === "available" ? (
                  <motion.button
                    whileHover={{ scale: 1.015, backgroundColor: "#BE123C" }}
                    whileTap={{ scale: 0.985 }}
                    onClick={handleBlockSlot}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#E11D48] text-white font-bold p-3.5 sm:p-4 rounded-xl text-xs sm:text-sm shadow-xl shadow-rose-950/30 transition-all cursor-pointer"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Block This Time Slot</span>
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={handleUnblockSlot}
                    className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-3.5 sm:p-4 rounded-xl text-xs sm:text-sm shadow-xl shadow-emerald-950/20 transition-all cursor-pointer"
                  >
                    <Unlock className="w-4 h-4" />
                    <span>Unblock / Activate Slot</span>
                  </motion.button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
