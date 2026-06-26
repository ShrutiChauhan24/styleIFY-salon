import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';

const HomeCTA = () => {
  const containerRef = useRef(null);

  // Setup Motion values for smooth mouse parallax positioning
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Configuration settings matching the original duration and easing properties
  const springConfig = { damping: 25, stiffness: 120, mass: 0.8 };
  const parallaxX = useSpring(mouseX, springConfig);
  const parallaxY = useSpring(mouseY, springConfig);

  // Subtle Parallax/Sway tied to Mouse movement over the section (Desktop Only)
  const handleMouseMove = (e) => {
    if (!containerRef.current || window.innerWidth < 1024) return;

    const { clientX, clientY } = e;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();

    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;

    // Scale values to match your original shift metrics
    mouseX.set(x * 30);
    mouseY.set(y * 30);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Motion animation parameters matching your design configuration specs
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const childVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 1, ease: [0.215, 0.610, 0.355, 1.000] } // Power3.out equivalent
    }
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="bg-[#1a1a1a] text-white relative overflow-hidden py-20 sm:py-24 md:py-32 xl:py-40 px-4 sm:px-8 md:px-12 w-full flex items-center justify-center border-b border-[#e91e63]/5"
    >
      {/* BACKGROUND GRAPHICS SECTION */}
      <motion.div 
        style={{ x: parallaxX, y: parallaxY }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 select-none overflow-hidden"
      >
        {/* Core Vibrant Radial Glow */}
        <div className="absolute w-[220px] h-[220px] sm:w-[350px] sm:h-[350px] md:w-[450px] md:h-[450px] bg-gradient-to-tr from-[#e91e63]/10 to-transparent rounded-full blur-3xl opacity-60" />
        
        {/* Concentric Circle 1 (Innermost) */}
        <motion.div 
          animate={{ scale: 1.05, opacity: 0.3 }}
          transition={{ duration: 4, repeat: Infinity, yoyo: true, ease: "easeInOut", repeatType: "mirror" }}
          className="cta-ring absolute w-[260px] h-[260px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] xl:w-[550px] xl:h-[550px] rounded-full border border-[#e91e63]/10 opacity-20" 
        />
        
        {/* Concentric Circle 2 */}
        <motion.div 
          animate={{ scale: 0.95, opacity: 0.15 }}
          transition={{ duration: 5.5, delay: 0.4, repeat: Infinity, yoyo: true, ease: "easeInOut", repeatType: "mirror" }}
          className="cta-ring absolute w-[380px] h-[380px] sm:w-[580px] sm:h-[580px] md:w-[720px] md:h-[720px] xl:w-[800px] xl:h-[800px] rounded-full border border-stone-800/40 opacity-30" 
        />
        
        {/* Concentric Circle 3 (Outermost Spec) */}
        <motion.div 
          animate={{ scale: 1.05, opacity: 0.3 }}
          transition={{ duration: 7, delay: 0.8, repeat: Infinity, yoyo: true, ease: "easeInOut", repeatType: "mirror" }}
          className="cta-ring absolute w-[520px] h-[520px] sm:w-[760px] sm:h-[760px] md:w-[950px] md:h-[950px] xl:w-[1100px] xl:h-[1100px] rounded-full border border-stone-900/30 opacity-40" 
        />
      </motion.div>

      {/* FOREGROUND CONTENT LAYER */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center gap-4 sm:gap-6 md:gap-8"
      >
        {/* Tagline Badge Detail */}
        <motion.div variants={childVariants}>
          <span className="text-[10px] sm:text-xs tracking-[0.25em] uppercase text-[#e91e63] font-semibold bg-[#e91e63]/5 border border-[#e91e63]/20 px-4 py-1.5 rounded-full backdrop-blur-md inline-block">
            Elevate Your Look
          </span>
        </motion.div>

        {/* Main Header Copy */}
        <motion.h2 variants={childVariants} className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-stone-100 max-w-3xl leading-[1.2] sm:leading-[1.15]">
          Ready for your <br className="hidden sm:inline" />
          <span className="font-normal text-white relative inline-block sm:inline">
            next appointment?
            <span className="absolute left-0 bottom-1 w-full h-[1.5px] sm:h-[2px] bg-[#e91e63]/30 rounded-full" />
          </span>
        </motion.h2>

        {/* Supporting Context Copy */}
        <motion.p variants={childVariants} className="text-stone-400 text-xs sm:text-sm md:text-base lg:text-lg max-w-md font-light leading-relaxed px-2 sm:px-4">
          Book your session today with our expert stylists and experience a premium standard of luxury care.
        </motion.p>

        {/* Premium Action Trigger */}
        <motion.div variants={childVariants} className="mt-2 sm:mt-4 w-full sm:w-auto">
          <Link to="/book-appointment">
            <button 
              type="button"
              className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#e91e63] hover:bg-[#d81b60] text-white font-semibold text-xs sm:text-sm tracking-widest uppercase px-8 py-3.5 sm:px-10 sm:py-4 rounded-xl overflow-hidden transition-all duration-300 shadow-[0_4px_15px_rgba(233,30,99,0.2)] hover:shadow-[0_8px_25px_rgba(233,30,99,0.4)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              {/* Gloss Highlight Overlay Layer */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              
              {/* Button Label Content */}
              <span className="relative z-10 flex items-center justify-center gap-2">
                <span className="transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true">➡️</span> 
                <span>Book Appointment</span>
              </span>
            </button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Global CSS Shimmer Keyframe definition injected directly for safety */}
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </section>
  );
}

export default HomeCTA;