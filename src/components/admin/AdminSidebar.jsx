import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom'; 
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Scissors, 
  Clock, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Sparkles
} from 'lucide-react';
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";

const AdminSidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation(); 
  const navigate = useNavigate();

  // Map path parameters directly to routing configurations
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { name: 'Bookings', icon: CalendarDays, path: '/admin/all-bookings' },
    { name: 'Services', icon: Scissors, path: '/admin/services' },
    { name: 'Time Slots', icon: Clock, path: '/admin/slots' },
    { name: 'Customers', icon: Users, path: '/admin/customers' },
    { name: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  const sidebarVariants = {
    hidden: { x: -60, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { 
        duration: 0.6, 
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.05 
      }
    }
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { duration: 0.4, ease: 'easeOut' }
    }
  };

   const handleLogout = async () => {
  try {
    await signOut(auth);

    navigate("/admin/login");
  } catch (error) {
    console.log(error);
  }
};

  const SidebarContent = () => (
    <div className="flex flex-col h-full justify-between p-6">
      {/* Brand Header */}
      <motion.div 
        variants={itemVariants}
        className="flex items-center gap-3 px-2 py-2"
      >
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-[#E11D48] to-[#BE123C] shadow-lg shadow-rose-900/30 shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-base font-bold tracking-wider uppercase text-stone-100 font-sans leading-tight">
            style<span className="text-[#FF1B6B]">IFY</span>
          </h2>
          <span className="text-[10px] font-semibold tracking-widest text-[#E11D48] uppercase block mt-0.5">
            Management Panel
          </span>
        </div>
      </motion.div>

      {/* Main Navigation Items */}
      <nav className="flex-1 mt-10 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          // Match route exact paths dynamically 
          const isActive = location.pathname === item.path;

          return (
            <motion.div
              key={item.name}
              variants={itemVariants}
              whileHover={{ x: isActive ? 0 : 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`relative flex items-center w-full gap-4 px-4 py-3.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300 group overflow-hidden ${
                  isActive ? 'text-white font-bold' : 'text-zinc-400 hover:text-zinc-100'
                }`}
              >
                {/* Active Indicator Layer */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute inset-0 bg-[#E11D48] rounded-xl z-0 shadow-md shadow-rose-900/10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}

                {/* Hover States Layer */}
                {!isActive && (
                  <div className="absolute inset-0 bg-zinc-800/0 group-hover:bg-zinc-900/50 transition-colors duration-300 z-0" />
                )}

                {/* Left Edge Neon Line Accent Frame */}
                {isActive && (
                  <motion.div 
                    layoutId="activeLine"
                    className="absolute left-0 top-3 bottom-3 w-1 bg-white rounded-r-md z-10"
                  />
                )}

                {/* Content Layout */}
                <div className="relative z-10 flex items-center gap-3.5 w-full">
                  <Icon className={`w-4 h-4 transition-transform duration-300 group-hover:scale-105 ${
                    isActive ? 'text-white' : 'text-zinc-400 group-hover:text-[#E11D48]'
                  }`} />
                  <span className="font-sans font-medium tracking-wide">{item.name}</span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Footer / Logout Action */}
      <motion.div 
        variants={itemVariants}
        className="pt-4 border-t border-zinc-800/60"
      >
       <button
  onClick={handleLogout}
  className="flex items-center w-full gap-4 px-4 py-3.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 transition-all duration-300 group cursor-pointer"
>
  <LogOut className="w-4 h-4 text-rose-400 group-hover:translate-x-[-2px] transition-transform duration-300" />
  <span className="font-sans font-medium tracking-wide">
    Logout
  </span>
</button>
      </motion.div>
    </div>
  );

  return (
    <>
      {/* --- MOBILE TOP NAVIGATION BAR --- */}
      <div className="md:hidden flex items-center justify-between bg-[#121214] border-b border-zinc-800/50 px-5 py-4 w-full fixed top-0 left-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#E11D48] to-[#BE123C] flex items-center justify-center shadow-md">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-bold tracking-wider text-stone-100 uppercase font-sans">
            style<span className="text-[#FF1B6B]">IFY</span>
          </span>
        </div>
        <button 
          type="button"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 -mr-2 text-zinc-400 hover:text-zinc-100 active:scale-95 transition-all cursor-pointer bg-zinc-900/50 border border-zinc-800/60 rounded-xl"
        >
          {isMobileOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-zinc-300" />}
        </button>
      </div>

      {/* --- DESKTOP VIEW SIDEBAR --- */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={sidebarVariants}
        className="hidden md:flex flex-col w-64 lg:w-72 h-screen fixed left-0 top-0 bg-[#121214] border-r border-zinc-800/40 z-30 shadow-xl"
      >
        <SidebarContent />
      </motion.div>

      {/* --- MOBILE DRAWER SLIDEOUT --- */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-md z-40 md:hidden"
            />
            
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 240 }}
              className="fixed inset-y-0 left-0 w-72 bg-[#121214] shadow-2xl z-40 md:hidden flex flex-col pt-20 border-r border-zinc-800/50"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- RESPONSIVE WORKSPACE PADDING ADJUSTMENTS --- */}
      <div className="hidden md:block md:w-64 lg:w-72 shrink-0" />
    </>
  );
};

export default AdminSidebar;