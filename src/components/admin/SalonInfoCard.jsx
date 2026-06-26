import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, Store, Phone, Mail, MapPin, Save, X, Sparkles } from 'lucide-react';

export default function SalonInfoCard({settings,loading,refreshSettings}) {
  const [isEditing, setIsEditing] = useState(false);
  const [salonData, setSalonData] = useState({
    name: 'Amerisalon One Stop Shop',
    phone: '+1 (555) 832-4012',
    email: 'contact@amerisalon.com',
    address: '742 Evergreen Terrace, New York, NY 10001'
  });
  const [tempData, setTempData] = useState({ ...salonData });

  const handleEditInit = () => {
    setTempData({ ...salonData });
    setIsEditing(true);
  };

  const handleSave = () => {
    setSalonData({ ...tempData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  // Premium orchestrations for panel appearance
  const panelVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 120, damping: 20, staggerChildren: 0.05 }
    }
  };

  const fadeElementVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 150, damping: 18 } }
  };

    if (loading) return <p>Loading...</p>;
  return (
    <motion.div
      variants={panelVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-[1100px] mx-auto bg-[#121214]/80 border border-stone-900/80 rounded-2xl md:rounded-3xl shadow-2xl shadow-black/60 overflow-hidden selection:bg-[#e61e53]/30"
    >
      {/* Top Ambient Glow Bar */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#e61e53] to-transparent opacity-80" />

      <div className="p-5 sm:p-7 md:p-10 lg:p-12 space-y-6 md:space-y-8">
        
        {/* --- HEADER BLOCK --- */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-900 pb-5 md:pb-6">
          <motion.div variants={fadeElementVariants} className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#e61e53]" />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#e61e53]">
                Profile Management
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Salon Information
            </h2>
          </motion.div>

          <AnimatePresence mode="wait">
            {!isEditing && (
              <motion.button
                key="edit-btn"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -2, backgroundColor: '#1c1c21', borderColor: 'rgba(230, 30, 83, 0.4)' }}
                whileTap={{ scale: 0.97 }}
                onClick={handleEditInit}
                className="inline-flex items-center justify-center gap-2 self-start sm:self-center px-4 py-2 bg-[#161619] border border-stone-800 rounded-xl text-xs sm:text-sm font-bold text-stone-300 hover:text-white shadow-md cursor-pointer transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#e61e53]" />
                <span>Edit Profile</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* --- CORE CONTENT LAYOUT SWITCHER --- */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {!isEditing ? (
              /* --- VIEW MODE --- */
              <motion.div
                key="view-mode"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch"
              >
                {/* Visual Identity Billboard Block */}
                <div className="lg:col-span-4 bg-gradient-to-b from-[#161619] to-[#0f0f11] border border-stone-900 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4 relative group overflow-hidden">
                  <div className="absolute inset-0 bg-[#e61e53]/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#e61e53]/20 to-stone-900 border border-[#e61e53]/30 flex items-center justify-center shadow-lg shadow-[#e61e53]/5 group-hover:scale-105 transition-transform duration-300">
                    <Store className="w-8 h-8 sm:w-10 sm:h-10 text-[#e61e53]" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-white tracking-tight">{salonData.name}</h3>
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-950/20 border border-emerald-900/30 px-2 py-0.5 rounded-md mt-2">
                      <Sparkles className="w-2.5 h-2.5" /> Premium Venue
                    </span>
                  </div>
                </div>

                {/* Info Fields Presentation Stack */}
                <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                  {[
                    { label: 'Salon Name', val: settings?.salonName, icon: Store },
                    { label: 'Business Whatsapp Number', val: settings?.salonPhone, icon: Phone, mono: true },
                    { label: 'Business Email', val: settings?.salonEmail, icon: Mail },
                    { label: 'Salon Address', val: settings?.salonAddress, icon: MapPin, fullWidth: true }
                  ].map((field, idx) => (
                    <div 
                      key={idx} 
                      className={`bg-[#161619]/40 border border-stone-900/60 p-4 sm:p-5 rounded-xl space-y-2 flex flex-col justify-center ${field.fullWidth ? 'sm:col-span-2' : ''}`}
                    >
                      <p className="text-[10px] text-stone-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <field.icon className="w-3.5 h-3.5 text-stone-600" /> {field.label}
                      </p>
                      <p className={`text-xs sm:text-sm text-stone-200 font-semibold tracking-tight ${field.mono ? 'font-mono' : ''}`}>
                        {field.val}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              /* --- EDIT MODE --- */
              <motion.div
                key="edit-mode"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6 md:space-y-8"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Input Element: Salon Name */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-stone-400 block">
                      Salon Name
                    </label>
                    <input
                      type="text"
                      value={tempData.name}
                      onChange={(e) => setTempData({ ...tempData, name: e.target.value })}
                      className="w-full bg-[#161619] border border-stone-800 rounded-xl px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-white placeholder-stone-600 focus:outline-none focus:border-[#e61e53] focus:ring-1 focus:ring-[#e61e53]/30 transition-all font-medium"
                    />
                  </div>

                  {/* Input Element: Business Phone */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-stone-400 block">
                      Business Phone
                    </label>
                    <input
                      type="text"
                      value={tempData.phone}
                      onChange={(e) => setTempData({ ...tempData, phone: e.target.value })}
                      className="w-full bg-[#161619] border border-stone-800 rounded-xl px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-white placeholder-stone-600 focus:outline-none focus:border-[#e61e53] focus:ring-1 focus:ring-[#e61e53]/30 transition-all font-mono font-medium"
                    />
                  </div>

                  {/* Input Element: Business Email */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-stone-400 block">
                      Business Email
                    </label>
                    <input
                      type="email"
                      value={tempData.email}
                      onChange={(e) => setTempData({ ...tempData, email: e.target.value })}
                      className="w-full bg-[#161619] border border-stone-800 rounded-xl px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-white placeholder-stone-600 focus:outline-none focus:border-[#e61e53] focus:ring-1 focus:ring-[#e61e53]/30 transition-all font-medium"
                    />
                  </div>

                  {/* Input Element: Salon Address */}
                  <div className="space-y-1.5 sm:space-y-2 sm:col-span-2">
                    <label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-stone-400 block">
                      Salon Address
                    </label>
                    <input
                      type="text"
                      value={tempData.address}
                      onChange={(e) => setTempData({ ...tempData, address: e.target.value })}
                      className="w-full bg-[#161619] border border-stone-800 rounded-xl px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-white placeholder-stone-600 focus:outline-none focus:border-[#e61e53] focus:ring-1 focus:ring-[#e61e53]/30 transition-all font-medium"
                    />
                  </div>
                </div>

                {/* --- INTERACTIVE ACTION STRIP --- */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-900">
                  <motion.button
                    whileHover={{ backgroundColor: '#1c1c21', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCancel}
                    className="px-4 py-2 sm:px-5 sm:py-2.5 border border-stone-800 text-stone-400 hover:text-stone-200 text-xs sm:text-sm font-bold tracking-wide rounded-xl inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Cancel</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.01, backgroundColor: '#f92c63', boxShadow: '0 8px 20px -6px rgba(230, 30, 83, 0.4)' }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handleSave}
                    className="px-4 py-2 sm:px-5 sm:py-2.5 bg-[#e61e53] border border-[#ff4171]/20 text-white text-xs sm:text-sm font-bold tracking-wide rounded-xl inline-flex items-center justify-center gap-1.5 shadow-lg shadow-[#e61e53]/10 cursor-pointer transition-all"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Information</span>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </motion.div>
  );
}