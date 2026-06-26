import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, Image, UploadCloud, Save, X, Sparkles, Sliders, RefreshCw } from 'lucide-react';

export default function SalonBrandingCard({settings,loading,refreshSettings}) {
  const [isEditing, setIsEditing] = useState(false);
  
  // State management for production image assets
  const [brandingData, setBrandingData] = useState({
    logo: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=150&auto=format&fit=crop&q=80', // Replace with fallback brand asset
    banner: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&auto=format&fit=crop&q=80' // Replace with fallback brand asset
  });

  // Transient state for modifications prior to save commit
  const [tempData, setTempData] = useState({ ...brandingData });

  const logoInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  const handleEditInit = () => {
    setTempData({ ...brandingData });
    setIsEditing(true);
  };

  const handleSave = () => {
    setBrandingData({ ...tempData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  // Process selected files into local ObjectURLs for lightning-fast presentation previews
  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setTempData(prev => ({ ...prev, [field]: localUrl }));
    }
  };

  // Micro-interaction presets
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
                Visual Settings
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Salon Branding
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
                <span>Customize Assets</span>
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
                {/* Visual Identity Billboard Block */}
                <div className="lg:col-span-4 bg-gradient-to-b from-[#161619] to-[#0f0f11] border border-stone-900 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4 relative group overflow-hidden">
                  <div className="absolute inset-0 bg-[#e61e53]/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-stone-950 border border-stone-800 p-1.5 shadow-xl shadow-black/80 flex items-center justify-center relative overflow-hidden group-hover:border-[#e61e53]/30 transition-colors duration-300">
                    <img 
                      src={brandingData.logo} 
                      alt="Salon Logo" 
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-400 tracking-wider uppercase">Active Brand Logo</h3>
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-950/20 border border-emerald-900/30 px-2 py-0.5 rounded-md mt-2">
                      <Sparkles className="w-2.5 h-2.5" /> High Resolution
                    </span>
                  </div>
                </div>

                {/* Hero Banner Presenter Screen */}
                <div className="lg:col-span-8 bg-[#161619]/40 border border-stone-900/60 p-4 sm:p-5 rounded-xl flex flex-col space-y-3 justify-center">
                  <p className="text-[10px] text-stone-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Image className="w-3.5 h-3.5 text-stone-600" /> Hero Banner Window
                  </p>
                  <div className="w-full h-40 sm:h-48 md:h-52 rounded-xl overflow-hidden border border-stone-900 relative shadow-inner shadow-black">
                    <img 
                      src={brandingData.banner} 
                      alt="Salon Hero Banner" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                      <p className="text-xs text-stone-400 font-medium">Displayed across client booking workflows</p>
                    </div>
                  </div>
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
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  
                  {/* Interactive Upload Block: Logo Workspace */}
                  <div className="md:col-span-4 space-y-2 flex flex-col">
                    <label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-stone-400">
                      Logo Upload
                    </label>
                    <input 
                      type="file" 
                      ref={logoInputRef} 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => handleFileChange(e, 'logo')}
                    />
                    <div 
                      onClick={() => logoInputRef.current.click()}
                      className="flex-1 bg-[#161619] border-2 border-dashed border-stone-800 hover:border-[#e61e53]/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all group relative min-h-[180px]"
                    >
                      {/* Active Profile Preview Mask Layer */}
                      <div className="w-20 h-20 rounded-full overflow-hidden border border-stone-800 shadow-md mb-3 relative group-hover:scale-95 transition-transform">
                        <img src={tempData.logo} alt="Temp Logo" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <RefreshCw className="w-5 h-5 text-white animate-spin-slow" />
                        </div>
                      </div>
                      <span className="text-xs font-bold text-stone-300 group-hover:text-white transition-colors">Replace Logo</span>
                      <span className="text-[10px] text-stone-500 mt-1">Square image recommended</span>
                    </div>
                  </div>

                  {/* Interactive Upload Block: Hero Banner Workspace */}
                  <div className="md:col-span-8 space-y-2 flex flex-col">
                    <label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-stone-400">
                      Hero Banner Upload
                    </label>
                    <input 
                      type="file" 
                      ref={bannerInputRef} 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => handleFileChange(e, 'banner')}
                    />
                    <div 
                      onClick={() => bannerInputRef.current.click()}
                      className="flex-1 bg-[#161619] border-2 border-dashed border-stone-800 hover:border-[#e61e53]/50 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all group relative min-h-[180px] overflow-hidden"
                    >
                      {/* Full Container Canvas Preview Underlay */}
                      <div className="absolute inset-2 rounded-xl overflow-hidden border border-stone-900 opacity-20 group-hover:opacity-10 transition-opacity">
                        <img src={tempData.banner} alt="Temp Banner" className="w-full h-full object-cover filter blur-[2px]" />
                      </div>
                      
                      <div className="relative z-10 space-y-2 flex flex-col items-center">
                        <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-stone-400 group-hover:text-[#e61e53] group-hover:border-[#e61e53]/30 transition-all shadow-md">
                          <UploadCloud className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-stone-300 group-hover:text-white transition-colors">Upload New Hero Banner Image</span>
                          <p className="text-[10px] text-stone-500 mt-1">Recommended scale aspect ratio: 16:9 or ultra-wide panorama</p>
                        </div>
                      </div>
                    </div>
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
                    <span>Save Branding</span>
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