import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, MapPin, Clock, Send, MessageSquare } from 'lucide-react';
import { sendContactEmail } from '../../helper/sendContactEmail';
import {toast}  from "react-toastify";
import {formatTime12Hour} from "../../helper/formatTime12Hour"

const ContactForm = ({settings}) => {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' ,message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
      const success = await sendContactEmail(formData);

  if (success) {
    toast.success("Message sent successfully!");

    setFormData({
      name: "",
      phone: "",
      email: "",
      message: "",
    });
  } else {
    toast.error("Failed to send message");
  }
  };

  // Orchestrated Parent Stagger Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  // Individual Element Entry Spring Animations
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 95, damping: 15 } 
    }
  };

  return (
    <section className="w-full bg-[#0f0f10] text-[#f3f4f6] flex items-center justify-center px-4 py-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 selection:bg-[#ff2e74] selection:text-white font-sans antialiased relative overflow-hidden">
      
      {/* Background Radial Ambient Glow Overlays - Sandboxed from causing scroll leaks */}
      <div className="absolute top-[-15%] right-[-10%] w-[60vw] h-[60vw] sm:w-[40vw] sm:h-[40vw] bg-[#ff2e74]/10 rounded-full blur-[100px] sm:blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] left-[-15%] w-[55vw] h-[55vw] sm:w-[35vw] sm:h-[35vw] bg-[#ff2e74]/5 rounded-full blur-[120px] sm:blur-[150px] pointer-events-none z-0" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-7xl flex flex-col z-10 mx-auto"
      >
        {/* Section Heading & Subtext */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12">
          <motion.h1 
            variants={itemVariants}
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black tracking-tight bg-gradient-to-b from-white to-[#d1d5db] bg-clip-text text-transparent uppercase"
          >
            Contact Us
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="text-[11px] sm:text-xs md:text-sm lg:text-base text-gray-400 mt-1.5 max-w-[260px] sm:max-w-md mx-auto font-medium tracking-wide leading-relaxed"
          >
            Have questions or need assistance? We’re here to help.
          </motion.p>
        </div>

        {/* Core Content Block: Fluid Grid System Layout */}
        <div className="w-full mb-6 sm:mb-8 md:mb-10 flex flex-col items-stretch">
          
          {/* Main Premium Input Form Module - Balanced sizing across viewport tiers */}
          <motion.div 
            variants={itemVariants}
            className="w-full max-w-3xl mx-auto bg-[#141416] border border-[#27272a] rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.5)] relative"
          >
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
            
            <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white tracking-wide mb-4 sm:mb-6 flex items-center gap-2 sm:gap-2.5">
              <MessageSquare className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-[#ff2e74]" />
              Start a Conversation
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
              {/* Name Field Input Box */}
              <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
                <label className="text-[9px] sm:text-[10px] md:text-xs font-bold tracking-wider text-gray-400 uppercase">Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#1a1a1c] border border-[#27272a] rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm font-medium text-white placeholder-gray-600 focus:outline-none focus:border-[#ff2e74] focus:ring-1 focus:ring-[#ff2e74]/30 transition-all duration-300 shadow-inner"
                />
              </div>

              {/* Phone Field Input Box */}
              <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
                <label className="text-[9px] sm:text-[10px] md:text-xs font-bold tracking-wider text-gray-400 uppercase">Phone Number</label>
                <input 
                  type="tel" 
                  required
                  placeholder="Your phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#1a1a1c] border border-[#27272a] rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm font-medium text-white placeholder-gray-600 focus:outline-none focus:border-[#ff2e74] focus:ring-1 focus:ring-[#ff2e74]/30 transition-all duration-300 shadow-inner"
                />
              </div>

              {/* email Field Input Box */}
              <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
                <label className="text-[9px] sm:text-[10px] md:text-xs font-bold tracking-wider text-gray-400 uppercase">Phone Number</label>
                <input 
                  type="email"
                  required
                  placeholder="Enter Your Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#1a1a1c] border border-[#27272a] rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm font-medium text-white placeholder-gray-600 focus:outline-none focus:border-[#ff2e74] focus:ring-1 focus:ring-[#ff2e74]/30 transition-all duration-300 shadow-inner"
                />
              </div>

 

              {/* Message Field Textarea Box */}
              <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
                <label className="text-[9px] sm:text-[10px] md:text-xs font-bold tracking-wider text-gray-400 uppercase">Message</label>
                <textarea 
                  rows={4}
                  required
                  placeholder="Tell us about your requested service details..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-[#1a1a1c] border border-[#27272a] rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm font-medium text-white placeholder-gray-600 focus:outline-none focus:border-[#ff2e74] focus:ring-1 focus:ring-[#ff2e74]/30 transition-all duration-300 resize-none shadow-inner"
                />
              </div>

              {/* Form Action Submit Button */}
              <div className="w-full flex justify-start pt-1">
                <button 
                  type="submit" 
                  className="w-full sm:w-auto px-5 py-2.5 sm:px-6 sm:py-3 lg:px-7 lg:py-3.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-[#ff2e74] to-[#e01a5c] text-white font-bold text-xs sm:text-sm tracking-wide shadow-[0_10px_20px_rgba(255,46,116,0.2)] hover:shadow-[0_15px_30px_rgba(255,46,116,0.35)] hover:brightness-110 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                >
                  <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Send Message
                </button>
              </div>
            </form>
          </motion.div>
        </div>

        {/* Footer Info Cards Trio Grid Container */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-5 w-full">
          
          {/* Card 1: Phone Contact Metadata */}
          <motion.div 
            variants={itemVariants}
            className="bg-[#141416]/90 border border-[#27272a] rounded-xl p-3.5 sm:p-4 lg:p-5 flex items-center gap-3 sm:gap-3.5 hover:border-gray-700 transition-all duration-300 shadow-lg group"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg bg-[#27272a]/70 text-gray-400 group-hover:text-[#ff2e74] group-hover:bg-[#ff2e74]/5 flex items-center justify-center transition-colors duration-300 shrink-0">
              <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5 lg:w-5 lg:h-5" />
            </div>
            <div className="space-y-0.5 overflow-hidden">
              <span className="text-[8px] sm:text-[9px] md:text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Phone Contact</span>
              <p className="text-xs md:text-sm font-semibold text-white tracking-wide truncate">+91 {settings?.salonPhone}</p>
            </div>
          </motion.div>

          {/* Card 2: Physical Salon Studio Address */}
          <motion.div 
            variants={itemVariants}
            className="bg-[#141416]/90 border border-[#27272a] rounded-xl p-3.5 sm:p-4 lg:p-5 flex items-center gap-3 sm:gap-3.5 hover:border-gray-700 transition-all duration-300 shadow-lg group"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg bg-[#27272a]/70 text-gray-400 group-hover:text-[#ff2e74] group-hover:bg-[#ff2e74]/5 flex items-center justify-center transition-colors duration-300 shrink-0">
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5 lg:w-5 lg:h-5" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[8px] sm:text-[9px] md:text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Address Details</span>
              <p className="text-xs md:text-sm font-semibold text-white tracking-wide whitespace-normal break-words">{settings?.salonAddress}</p>
            </div>
          </motion.div>

          {/* Card 3: Dynamic Salon Weekly Working Hours */}
          <motion.div 
            variants={itemVariants}
            className="bg-[#141416]/90 border border-[#27272a] rounded-xl p-3.5 sm:p-4 lg:p-5 flex items-center gap-3 sm:gap-3.5 hover:border-gray-700 transition-all duration-300 shadow-lg group"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg bg-[#27272a]/70 text-gray-400 group-hover:text-[#ff2e74] group-hover:bg-[#ff2e74]/5 flex items-center justify-center transition-colors duration-300 shrink-0">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5 lg:w-5 lg:h-5" />
            </div>
            <div className="space-y-0.5 overflow-hidden">
              <span className="text-[8px] sm:text-[9px] md:text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Working Hours</span>
              <p className="text-xs md:text-sm font-semibold text-white tracking-wide truncate">
                {settings?.openingTime && settings?.closingTime
    ? `Mon–Sat: ${formatTime12Hour(settings.openingTime)} - ${formatTime12Hour(settings.closingTime)}`
    : "Loading..."}
                </p>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
};

export default ContactForm;