import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, User, Mail, Lock, Save, X, ShieldCheck, Sparkles } from 'lucide-react';
import { getAuth, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

export default function AdminAccountCard() {
  const [isEditing, setIsEditing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
const [isVerified, setIsVerified] = useState(false);
const [verifying, setVerifying] = useState(false);
  const [adminData, setAdminData] = useState({
  email: '',
  password: '••••••••••••'
});

const [tempData, setTempData] = useState({
  email: '',
  password: ''
});

  const handleEditInit = () => {
    // Clear the password field during initialization to prompt intentional input
    setTempData({ ...adminData, password: '' });
    setIsEditing(true);
  };

  const handleSave = () => {
    // Commit adjustments to primary state tracker
    setAdminData({
      email: tempData.email,
      password: tempData.password.trim() !== '' ? '••••••••••••' : adminData.password
    });
    setIsEditing(false);
  };

  useEffect(() => {
  const auth = getAuth();

  const unsubscribe = auth.onAuthStateChanged((user) => {
    if (user) {
      setAdminData({
        email: user.email || '',
        password: '••••••••••••'
      });

      setTempData({
        email: user.email || '',
        password: ''
      });
    }
  });

  return unsubscribe;
}, []);

const verifyCurrentPassword = async () => {
  try {
    setVerifying(true);

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user || !user.email) return;

    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );

    await reauthenticateWithCredential(user, credential);

    setIsVerified(true);
    alert("Password verified successfully");
  } catch (error) {
    setIsVerified(false);
    alert("Incorrect password");
  } finally {
    setVerifying(false);
  }
};

  const handleCancel = () => {
    setIsEditing(false);
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
                Identity Management
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Administrator
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
                <span>Edit Credentials</span>
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
                {/* Visual Identity Block */}
                <div className="lg:col-span-4 bg-gradient-to-b from-[#161619] to-[#0f0f11] border border-stone-900 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4 relative group overflow-hidden">
                  <div className="absolute inset-0 bg-[#e61e53]/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#e61e53]/20 to-stone-900 border border-[#e61e53]/30 flex items-center justify-center shadow-lg shadow-[#e61e53]/5 group-hover:scale-105 transition-transform duration-300">
                    <User className="w-8 h-8 sm:w-10 sm:h-10 text-[#e61e53]" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-white tracking-tight">{adminData.name}</h3>
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-950/20 border border-emerald-900/30 px-2 py-0.5 rounded-md mt-2">
                      <ShieldCheck className="w-2.5 h-2.5" /> Root operator
                    </span>
                  </div>
                </div>

                {/* Account Settings Fields Presentation Stack */}
                <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                  {[
                    { label: 'Admin Email', val: adminData.email, icon: Mail },
                    { label: 'Security Password', val: adminData.password, icon: Lock, fullWidth: true, protectText: true }
                  ].map((field, idx) => (
                    <div 
                      key={idx} 
                      className={`bg-[#161619]/40 border border-stone-900/60 p-4 sm:p-5 rounded-xl space-y-2 flex flex-col justify-center ${field.protectText ? 'tracking-widest font-mono' : ''} ${field.fullWidth ? 'sm:col-span-2' : ''}`}
                    >
                      <p className="text-[10px] text-stone-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <field.icon className="w-3.5 h-3.5 text-stone-600" /> {field.label}
                      </p>
                      <p className="text-xs sm:text-sm text-stone-200 font-semibold tracking-tight">
                        {field.val}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              /* --- EDIT MODE --- */
              <div className="space-y-5">

  {/* Current Password Verification */}
  <div className="space-y-2">
    <label className="text-xs font-bold uppercase tracking-wider text-stone-400">
      Current Password
    </label>

    <div className="flex gap-3">
      <input
        type="password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        placeholder="Enter current password"
        className="flex-1 bg-[#161619] border border-stone-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#e61e53]"
      />

      <button
        onClick={verifyCurrentPassword}
        disabled={verifying}
        className="px-4 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white text-sm font-semibold"
      >
        {verifying ? "Checking..." : "Verify"}
      </button>
    </div>

    {isVerified && (
      <p className="text-emerald-400 text-xs">
        ✓ Password verified
      </p>
    )}
  </div>

  {/* Email */}
  <div className="space-y-2">
    <label className="text-xs font-bold uppercase tracking-wider text-stone-400">
      Admin Email
    </label>

    <input
      disabled={!isVerified}
      type="email"
      value={tempData.email}
      onChange={(e) =>
        setTempData({ ...tempData, email: e.target.value })
      }
      className={`w-full rounded-xl px-4 py-3 text-sm border ${
        isVerified
          ? "bg-[#161619] border-stone-800 text-white"
          : "bg-stone-900 border-stone-800 text-stone-500 cursor-not-allowed"
      }`}
    />
  </div>

  {/* New Password */}
  <div className="space-y-2">
    <label className="text-xs font-bold uppercase tracking-wider text-stone-400">
      New Password
    </label>

    <input
      disabled={!isVerified}
      type="password"
      value={tempData.password}
      onChange={(e) =>
        setTempData({ ...tempData, password: e.target.value })
      }
      placeholder="Enter new password"
      className={`w-full rounded-xl px-4 py-3 text-sm border ${
        isVerified
          ? "bg-[#161619] border-stone-800 text-white"
          : "bg-stone-900 border-stone-800 text-stone-500 cursor-not-allowed"
      }`}
    />
  </div>

  <motion.button
  whileHover={
    isVerified
      ? {
          scale: 1.01,
          backgroundColor: '#f92c63',
          boxShadow: '0 8px 20px -6px rgba(230, 30, 83, 0.4)',
        }
      : {}
  }
  whileTap={isVerified ? { scale: 0.99 } : {}}
  onClick={handleSave}
  disabled={!isVerified}
  className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold tracking-wide transition-all
    ${
      isVerified
        ? 'bg-[#e61e53] text-white shadow-lg shadow-[#e61e53]/10 cursor-pointer'
        : 'bg-stone-800 text-stone-500 cursor-not-allowed opacity-60'
    }
  `}
>
  <Save className="w-3.5 h-3.5" />
  <span>Update Credentials</span>
</motion.button>

</div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </motion.div>
  );
}