import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, ShieldAlert, Sparkles, Lock } from "lucide-react";
import { toast } from "react-toastify";
import { generateSlots } from "../../helper/generateSlots";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../../firebase";

export default function BlockSlotModal({ isOpen, onClose, settings }) {
  const [formData, setFormData] = useState({
    date: "2026-05-27",
    startTime: "09:00",
    endTime: "10:00",
  });
  const [isBlocking, setIsBlocking] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsBlocking(true);
      const { openingTime, closingTime } = settings;

      if (formData.startTime < openingTime) {
        toast.error("Block start time cannot be before salon opening time");
        return;
      }

      if (formData.endTime > closingTime) {
        toast.error("Block end time cannot be after salon closing time");
        return;
      }

      if (formData.startTime >= formData.endTime) {
        toast.error("End time must be greater than start time");
        return;
      }

      const slots = generateSlots(
        formData.startTime,
        formData.endTime,
        settings?.slotDuration,
      );

      for (const slotTime of slots) {
        const docId = `${formData.date}_${slotTime}`;

        await setDoc(doc(db, "blockedSlots", docId), {
          date: formData.date,
          slotTime,
          createdAt: serverTimestamp(),
        });
      }
      onClose();
      toast.success(``);
    } catch (error) {
      toast.error("Unable to block slot");
    } finally {
      setIsBlocking(false);
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3, ease: "linear" } },
  };

  // Modal Card scale & slide entrance
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.96, y: 8 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
    },
    exit: {
      opacity: 0,
      scale: 0.97,
      y: 4,
      transition: { duration: 0.25, ease: "easeIn" },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-x-hidden overflow-y-auto">
          {/* BACKGROUND DIM LAYER */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
            className="fixed inset-0 bg-black/60 pointer-events-auto"
          />

          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-md sm:max-w-lg md:max-w-xl bg-[#141416] border border-stone-800/90 rounded-2xl sm:rounded-3xl shadow-2xl shadow-black/90 overflow-hidden z-10 flex flex-col my-auto"
          >
            {/* Ambient Header Glow Stripe */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E11D48] to-transparent opacity-60" />

            {/* MODAL HEADER BLOCK */}
            <div className="p-5 sm:p-6 md:p-8 border-b border-stone-900/80 flex items-start justify-between gap-4">
              <div className="space-y-1.5 sm:space-y-2">
                <div className="inline-flex items-center gap-2 bg-stone-900/80 px-2.5 py-1 rounded-lg border border-stone-800/60">
                  <Sparkles className="w-3 h-3 text-[#E11D48]" />
                  <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                    System Override
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-tight">
                  Block Operational Window
                </h3>
                <p className="text-xs md:text-sm text-zinc-500 font-medium">
                  Manually isolate custom timeline ranges across system
                  terminals.
                </p>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-zinc-900/60 hover:bg-zinc-800 text-zinc-500 hover:text-white border border-stone-800/80 transition-all cursor-pointer shrink-0 group"
              >
                <X className="w-4 h-4 sm:w-4 sm:h-4 group-hover:rotate-90 transition-transform duration-200" />
              </button>
            </div>

            {/* FORM BODY ELEMENTS */}
            <form
              onSubmit={handleSubmit}
              className="p-5 sm:p-6 md:p-8 space-y-5 sm:space-y-6 flex-1"
            >
              {/* FIELD 1: DATE SELECTOR */}
              <div className="space-y-2 group">
                <label className="block text-[11px] sm:text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Target Date Template
                </label>
                <div className="relative flex items-center w-full focus-within:border-[#E11D48]/80 rounded-xl border border-stone-800/80 bg-[#111112] transition-colors shadow-inner">
                  <Calendar className="absolute left-3.5 w-4 h-4 text-[#E11D48] pointer-events-none" />
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent font-bold tracking-wide text-white focus:outline-none transition-all cursor-pointer pl-11 pr-4 py-3 sm:py-3.5 text-xs sm:text-sm"
                  />
                </div>
              </div>

              {/* TIMELINE MATRIX SPLIT ROW (START & END TIMINGS) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* FIELD 2: START TIMING */}
                <div className="space-y-2">
                  <label className="block text-[11px] sm:text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    Opening Window Limit
                  </label>
                  <div className="relative flex items-center w-full focus-within:border-[#E11D48]/80 rounded-xl border border-stone-800/80 bg-[#111112] transition-colors shadow-inner">
                    <Clock className="absolute left-3.5 w-4 h-4 text-zinc-500" />
                    <input
                      type="time"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent font-bold tracking-wide text-white focus:outline-none transition-all cursor-pointer pl-11 pr-4 py-3 sm:py-3.5 text-xs sm:text-sm"
                    />
                  </div>
                </div>

                {/* FIELD 3: END TIMING */}
                <div className="space-y-2">
                  <label className="block text-[11px] sm:text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    Closing Window Limit
                  </label>
                  <div className="relative flex items-center w-full focus-within:border-[#E11D48]/80 rounded-xl border border-stone-800/80 bg-[#111112] transition-colors shadow-inner">
                    <Clock className="absolute left-3.5 w-4 h-4 text-zinc-500" />
                    <input
                      type="time"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent font-bold tracking-wide text-white focus:outline-none transition-all cursor-pointer pl-11 pr-4 py-3 sm:py-3.5 text-xs sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* LIVE NOTIFICATION WARNING BANNER */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-[#E11D48]/5 border border-[#E11D48]/10">
                <ShieldAlert className="w-4 h-4 text-[#E11D48] shrink-0 mt-0.5 sm:mt-1" />
                <p className="text-[11px] sm:text-xs text-zinc-500 leading-relaxed font-medium">
                  Altering the live runtime matrix grid flags and restricts
                  online public terminal transactions for this selected sequence
                  duration automatically.
                </p>
              </div>

              {/* ACTION DIALOG FOOTER PANELS */}
              <div className="pt-4 border-t border-stone-900/80 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 w-full">
                {/* BUTTON: DISMISS/CANCEL */}
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-transparent border border-stone-800 hover:border-stone-700 font-bold text-zinc-400 hover:text-white text-xs sm:text-sm transition-all cursor-pointer text-center"
                >
                  Cancel
                </button>

                {/* BUTTON: CONFIRM OVERRIDE / BLOCK */}
                <motion.button
                  whileHover={
                    !isBlocking
                      ? { scale: 1.012, backgroundColor: "#BE123C" }
                      : {}
                  }
                  whileTap={!isBlocking ? { scale: 0.988 } : {}}
                  disabled={isBlocking}
                  type="submit"
                  className={`w-full sm:w-auto px-6 py-3 rounded-xl text-white font-black
  inline-flex items-center justify-center gap-2 text-xs sm:text-sm
  shadow-xl transition-all
  ${
    isBlocking
      ? "bg-rose-800 cursor-not-allowed opacity-80"
      : "bg-[#E11D48] cursor-pointer shadow-rose-950/20"
  }`}
                >
                  {isBlocking ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Blocking Slots...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Block Time Slot</span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
