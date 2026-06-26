import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, Bell, Mail, MessageSquare, Volume2, Save, X, ShieldCheck } from 'lucide-react';

export default function SalonNotificationsCard({settings,loading,refreshSettings}) {
  const [isEditing, setIsEditing] = useState(false);
  
 const [preferences, setPreferences] = useState({
  emailAlerts: false,
  whatsappAlerts: false
});

const [tempPreferences, setTempPreferences] = useState({
  emailAlerts: false,
  whatsappAlerts: false
});

useEffect(() => {
  if (settings) {
    const firestorePreferences = {
      emailAlerts: settings.sendEmailBookingConfirmation ?? false,
      whatsappAlerts: settings.sendWhatsappBookingConfirmation ?? false,
    };

    setPreferences(firestorePreferences);
    setTempPreferences(firestorePreferences);
  }
}, [settings]);
  

  const handleEditInit = () => {
    setTempPreferences({ ...preferences });
    setIsEditing(true);
  };

  const handleSave = () => {
    setPreferences({ ...tempPreferences });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const toggleTempPreference = (key) => {
    setTempPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Micro-interaction springs
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

  return (
    <motion.div
      variants={panelVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-[1100px] mx-auto bg-[#121214]/80 border border-stone-900/80 rounded-2xl md:rounded-3xl shadow-2xl shadow-black/60 overflow-hidden selection:bg-[#e61e53]/30"
    >
      {/* Top Ambient Glow Ribbon Accent */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#e61e53] to-transparent opacity-80" />

      <div className="p-5 sm:p-7 md:p-10 lg:p-12 space-y-6 md:space-y-8">
        
        {/* --- HEADER BLOCK --- */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-900 pb-5 md:pb-6">
          <motion.div variants={fadeElementVariants} className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#e61e53]" />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#e61e53]">
                System Alerts
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Notifications
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
                className="inline-flex items-center justify-center gap-2 self-start sm:self-center px-4 py-2 bg-[#161619] border border-stone-800 rounded-xl text-xs sm:text-sm font-bold text-stone-300 hover:text-white shadow-md cursor-pointer transition-all"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#e61e53]" />
                <span>Change Settings</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* --- CORE CONTENT MATRIX CONTROLLER --- */}
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
                {/* Visual Identity Status Block */}
                <div className="lg:col-span-4 bg-gradient-to-b from-[#161619] to-[#0f0f11] border border-stone-900 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4 relative group overflow-hidden">
                  <div className="absolute inset-0 bg-[#e61e53]/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#e61e53]/20 to-stone-900 border border-[#e61e53]/30 flex items-center justify-center shadow-lg shadow-[#e61e53]/5 group-hover:scale-105 transition-transform duration-300">
                    <Bell className="w-8 h-8 sm:w-10 sm:h-10 text-[#e61e53]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-400 tracking-wider uppercase">Alert Dispatcher</h3>
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-950/20 border border-emerald-900/30 px-2 py-0.5 rounded-md mt-2">
                      <ShieldCheck className="w-2.5 h-2.5" /> Engine Active
                    </span>
                  </div>
                </div>

                {/* Preferences Status Presentation Panel */}
                <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: 'Email Booking Alerts', isActive: preferences.emailAlerts, icon: Mail },
                    { label: 'WhatsApp Confirmation Alerts', isActive: preferences.whatsappAlerts, icon: MessageSquare },
                    
                  ].map((item, idx) => (
                    <div 
                      key={idx} 
                      className="bg-[#161619]/40 border border-stone-900/60 p-5 rounded-xl flex flex-col justify-between items-start space-y-4"
                    >
                      <div className="p-2.5 bg-stone-950 rounded-lg border border-stone-900 text-stone-500">
                        <item.icon className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs sm:text-sm text-stone-200 font-semibold tracking-tight leading-snug">
                          {item.label}
                        </p>
                        <span className={`inline-block text-[10px] font-bold uppercase tracking-wider ${item.isActive ? 'text-[#e61e53]' : 'text-stone-600'}`}>
                          {item.isActive ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
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
                {/* Switch Controls Stack */}
                <div className="space-y-3.5 md:space-y-4">
                  {[
                    { id: 'emailAlerts', label: 'Email Booking Alerts', desc: 'Dispatches automated summaries immediately following scheduled service changes.', icon: Mail },
                    { id: 'whatsappAlerts', label: 'WhatsApp Confirmation Alerts', desc: 'Sends direct transactional delivery messages to client phone accounts.', icon: MessageSquare },
                  ].map((switchItem) => (
                    <div 
                      key={switchItem.id}
                      onClick={() => toggleTempPreference(switchItem.id)}
                      className="w-full bg-[#161619] border border-stone-900 hover:border-stone-800 rounded-xl p-4 sm:p-5 flex items-center justify-between gap-6 cursor-pointer select-none transition-all group"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className={`p-2.5 rounded-xl border mt-0.5 hidden sm:block transition-colors ${tempPreferences[switchItem.id] ? 'bg-[#e61e53]/10 border-[#e61e53]/20 text-[#e61e53]' : 'bg-stone-950 border-stone-900 text-stone-600 group-hover:text-stone-500'}`}>
                          <switchItem.icon className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                          <label className="text-xs sm:text-sm font-bold tracking-tight text-white block cursor-pointer">
                            {switchItem.label}
                          </label>
                          <p className="text-[11px] sm:text-xs text-stone-500 font-medium max-w-xl leading-normal">
                            {switchItem.desc}
                          </p>
                        </div>
                      </div>

                      {/* Premium Custom Toggle Base */}
                      <div className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-300 relative shrink-0 ${tempPreferences[switchItem.id] ? 'bg-[#e61e53]' : 'bg-stone-950 border border-stone-900'}`}>
                        <motion.div 
                          layout
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          className={`w-4 h-4 rounded-full shadow-md bg-white ${tempPreferences[switchItem.id] ? 'ml-5' : 'ml-0'}`}
                        />
                      </div>
                    </div>
                  ))}
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
                    <span>Save Preferences</span>
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