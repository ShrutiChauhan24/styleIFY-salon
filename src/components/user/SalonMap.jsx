import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Compass, ShieldCheck } from 'lucide-react';

const SalonMap = ({settings}) => {
  
  // Staggered Container Animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 }
    }
  };

  // Smooth Spring Upward Animation
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 90, damping: 16 } 
    }
  };

  return (
    <section className="w-full bg-[#0f0f10] text-[#f3f4f6] flex items-center justify-center px-4 py-6 sm:px-6 md:px-8 lg:px-16 selection:bg-[#ff2e74] selection:text-white font-sans antialiased relative overflow-hidden">
      
      {/* Structural Ambient Glow Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[55vw] h-[55vw] sm:w-[45vw] sm:h-[45vw] bg-[#ff2e74]/5 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-5%] w-[60vw] h-[60vw] sm:w-[50vw] sm:h-[50vw] bg-[#ff2e74]/8 rounded-full blur-[110px] sm:blur-[130px] pointer-events-none" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-7xl flex flex-col z-10 mx-auto"
      >
        
        {/* Section Heading & Copy Block */}
        <div className="text-center mb-8 sm:mb-12 md:mb-14 lg:mb-16">
          <motion.h1 
            variants={itemVariants}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight bg-gradient-to-b from-white to-[#d1d5db] bg-clip-text text-transparent uppercase"
          >
            Visit Our Salon
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="text-[11px] sm:text-xs md:text-sm lg:text-base text-gray-400 mt-2 max-w-[290px] sm:max-w-md md:max-w-lg mx-auto font-medium tracking-wide leading-relaxed"
          >
            Find us easily and experience premium beauty services at our salon center.
          </motion.p>
        </div>

        {/* Core Multi-Column Structural Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 md:gap-8 items-stretch">
          
          {/* Left Panel: Luxury Brand Info Accent Card */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-4 bg-gradient-to-b from-[#141416] to-[#111113] border border-[#27272a] rounded-2xl p-5 sm:p-7 md:p-8 lg:p-10 flex flex-col justify-between shadow-[0_25px_60px_rgba(0,0,0,0.5)] relative overflow-hidden group min-h-[280px] sm:min-h-[320px] lg:min-h-full"
          >
            {/* Soft inner neon highlights */}
            <div className="absolute inset-0 bg-radial from-[#ff2e74]/10 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#ff2e74]/30 to-transparent" />

            <div className="space-y-4 sm:space-y-5 lg:space-y-6 relative z-10">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-[#ff2e74]/10 border border-[#ff2e74]/20 flex items-center justify-center text-[#ff2e74]">
                <Compass className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 animate-pulse" />
              </div>
              
              <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
                <span className="text-[9px] sm:text-[10px] md:text-xs font-bold tracking-widest uppercase text-[#ff2e74]">Prime Location</span>
                <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-white tracking-wide leading-snug">Elite Sanctuary</h2>
              </div>
              
              <p className="text-[11px] sm:text-xs md:text-sm text-gray-400 font-medium leading-relaxed">
                Situated in the heart of the design district, our premium salon center features state-of-the-art facilities, private luxury styling suites, and complimentary premium valet access.
              </p>
            </div>

            <div className="pt-5 mt-6 sm:pt-6 sm:mt-8 md:pt-8 border-t border-[#27272a]/70 relative z-10 space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2.5 sm:gap-3 text-[11px] sm:text-xs text-gray-300 font-medium">
                <ShieldCheck className="w-4 h-4 text-[#ff2e74] shrink-0" />
                <span>Sanitized & Ultra-hygienic environment</span>
              </div>
              <a 
                href="https://www.google.com/maps/search/?api=1&query=Pune" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-bold tracking-wider uppercase text-white bg-[#1a1a1c] border border-[#27272a] hover:border-[#ff2e74] px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl transition-all duration-300 group/btn"
              >
                <span>Get Directions</span>
                <Navigation className="w-3 h-3 text-[#ff2e74] group-hover/btn:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </motion.div>

          {/* Right Panel: Embedded Map and Interactive Location Ribbon Block */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-8 flex flex-col bg-[#141416] border border-[#27272a] rounded-2xl p-3.5 sm:p-4 md:p-5 shadow-[0_25px_60px_rgba(0,0,0,0.5)] relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
            
            {/* Google Map Embed Container */}
            <div className="w-full h-[240px] sm:h-[320px] md:h-[380px] lg:h-[400px] xl:h-[460px] rounded-xl overflow-hidden border border-[#27272a]/80 relative group">
              <iframe
  title="Salon Location Map"
  src="https://maps.google.com/maps?q=Pune&t=&z=13&ie=UTF8&iwloc=&output=embed"
  className="w-full h-full"
  loading="lazy"
/>
            </div>

            {/* Bottom Floating Location Info Ribbon */}
            <div className="mt-3.5 sm:mt-4 p-3 sm:p-4 rounded-xl bg-[#1a1a1c] border border-[#27272a]/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group/ribbon hover:border-gray-700 transition-colors duration-300">
              <div className="flex items-center gap-2.5 sm:gap-3 w-full overflow-hidden">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#ff2e74]/10 border border-[#ff2e74]/20 flex items-center justify-center text-[#ff2e74] shrink-0">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <p className="text-xs sm:text-sm font-semibold tracking-wide text-gray-200 truncate">
                 {settings?.salonAddress}
                </p>
              </div>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-[#ff2e74] shrink-0 px-2.5 py-1 rounded-md bg-[#ff2e74]/5 border border-[#ff2e74]/10 hidden sm:inline-block">
                Open Daily
              </span>
            </div>

          </motion.div>
        </div>

      </motion.div>
    </section>
  );
};

export default SalonMap;