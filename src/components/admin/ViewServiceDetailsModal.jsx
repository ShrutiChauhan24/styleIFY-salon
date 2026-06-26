import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, Tag, ShieldCheck, HelpCircle, Eye } from "lucide-react";

export default function ViewServiceDetailsModal({
  isOpen,
  onClose,
  serviceData,
}) {
  const [activeData,setActiveData] = useState(serviceData)

  useEffect(()=>{
     if(serviceData){
       setActiveData(serviceData)
     }
  },[serviceData])

  const effectiveStatus = !activeData?.categoryActive
    ? "Category Disabled"
    : activeData?.status;
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 md:p-6 overflow-x-hidden overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 cursor-pointer"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: "spring", duration: 0.45, bounce: 0.12 }}
            className="relative w-full max-w-[92vw] sm:max-w-md md:max-w-xl bg-[#141414] border border-zinc-800/80 rounded-2xl md:rounded-3xl shadow-2xl shadow-black/90 z-10 overflow-hidden max-h-[90vh] md:max-h-[85vh] flex flex-col text-left transition-all duration-300"
          >
            <div className="p-4 sm:p-5 md:p-6 border-b border-zinc-900 flex items-center justify-between shrink-0 bg-[#1a1a1a]/40">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="p-2 rounded-xl bg-[#E31A53]/10 text-[#E31A53]">
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg md:text-xl font-bold text-zinc-50 tracking-tight">
                    Service Details
                  </h2>
                  <p className="text-[10px] sm:text-xs text-zinc-400 mt-0.5">
                    Read-only technical structural blueprint configuration
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 sm:p-2 text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-all duration-200 cursor-pointer"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-5 md:p-6 overflow-y-auto space-y-4 sm:space-y-5 md:space-y-6 flex-1 text-zinc-200">
              <div className="space-y-2">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-zinc-500 block">
                  Service Presentation Cover
                </span>
                <div className="relative w-full h-36 sm:h-44 md:h-48 rounded-xl overflow-hidden border border-zinc-800 group bg-zinc-950">
                  <img
                    src={activeData?.imageUrl}
                    alt={activeData?.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  <div className="absolute bottom-3 right-3 bg-black/70 px-3 py-1.5 rounded-lg border border-zinc-800 font-bold text-sm sm:text-base text-zinc-50">
                    ₹{activeData?.price}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                <div className="space-y-1 sm:col-span-2 bg-zinc-900/30 border border-zinc-800/40 p-3 rounded-xl">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-zinc-500">
                    Service ID
                  </span>

                  <div className="text-xs text-zinc-400 break-all font-mono">
                    {activeData?.id || "N/A"}
                  </div>
                </div>

                <div className="space-y-1 sm:col-span-2 bg-zinc-900/30 border border-zinc-800/40 p-3 rounded-xl">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-zinc-500 block">
                    Service Name
                  </span>
                  <div className="text-xs sm:text-sm md:text-base font-semibold text-zinc-100 mt-0.5 select-all">
                    {activeData?.name}
                  </div>
                </div>

                <div className="space-y-1 bg-zinc-900/30 border border-zinc-800/40 p-3 rounded-xl flex flex-col justify-center">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-1.5">
                    <Tag className="w-3 h-3 text-zinc-500" /> Category
                  </span>
                  <div className="mt-1.5">
                    <span className="text-[11px] sm:text-xs font-medium bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded-lg border border-zinc-700/60">
                      {activeData?.categoryName}
                    </span>
                  </div>
                </div>

                <div className="space-y-1 bg-zinc-900/30 border border-zinc-800/40 p-3 rounded-xl">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-zinc-500">
                    Category Status
                  </span>

                  <div className="mt-1.5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                        activeData?.categoryActive
                          ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
                          : "bg-orange-500/5 border-orange-500/20 text-orange-400"
                      }`}
                    >
                      {effectiveStatus}
                    </span>
                  </div>
                </div>

                <div className="space-y-1 bg-zinc-900/30 border border-zinc-800/40 p-3 rounded-xl flex flex-col justify-center">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-zinc-500" /> Allocation
                    Window
                  </span>
                  <div className="text-xs sm:text-sm font-semibold text-zinc-200 mt-1">
                    {activeData?.duration} mins
                  </div>
                </div>

                <div className="space-y-1 bg-zinc-900/30 border border-zinc-800/40 p-3 rounded-xl flex flex-col justify-center">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-zinc-500 block">
                    Base Ledger Price
                  </span>
                  <div className="text-sm sm:text-lg font-bold text-zinc-50 mt-0.5 tracking-wide">
                    ₹{activeData?.price}{" "}
                    <span className="text-[10px] font-medium text-zinc-500 ml-0.5">
                      INR
                    </span>
                  </div>
                </div>

                <div className="space-y-1 bg-zinc-900/30 border border-zinc-800/40 p-3 rounded-xl flex flex-col justify-center">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-1.5">
                    <ShieldCheck className="w-3 h-3 text-zinc-500" /> Booking
                    Status
                  </span>
                  <div className="mt-1.5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-medium border ${
                        effectiveStatus === "Category Disabled"
                          ? "bg-orange-500/5 border-orange-500/20 text-orange-400"
                          : effectiveStatus === "Active"
                            ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
                            : "bg-zinc-500/5 border-zinc-500/20 text-zinc-400"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${activeData?.status === "Active" ? "bg-emerald-400" : "bg-zinc-400"}`}
                      />
                      {!activeData?.categoryActive
                        ? "Category Disabled"
                        : activeData?.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-1 bg-zinc-900/30 border border-zinc-800/40 p-3 rounded-xl">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-zinc-500">
                    Created
                  </span>

                  <div className="text-xs sm:text-sm text-zinc-200">
                    {activeData?.createdAt?.toDate?.().toLocaleString() || "-"}
                  </div>
                </div>

                <div className="space-y-1 bg-zinc-900/30 border border-zinc-800/40 p-3 rounded-xl">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-zinc-500">
                    Updated
                  </span>

                  <div className="text-xs sm:text-sm text-zinc-200">
                    {activeData?.updatedAt?.toDate?.().toLocaleString() || "-"}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-zinc-900/10 border border-zinc-800/30 rounded-xl p-3 text-zinc-500 text-[10px] sm:text-xs">
                <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#E31A53]/70 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  This panel serves as a system verification view. To modify
                  text parameters, pricing tags, or display asset vectors,
                  navigate back to the workspace and toggle the{" "}
                  <strong className="text-zinc-400 font-medium">
                    Edit Service
                  </strong>{" "}
                  dropdown action.
                </p>
              </div>
            </div>

            <div className="p-4 sm:p-5 md:p-6 border-t border-zinc-900 flex items-center justify-end shrink-0 bg-[#1a1a1a]/40">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800/80 hover:border-zinc-700 transition-all duration-150 cursor-pointer text-center"
              >
                Close View
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
