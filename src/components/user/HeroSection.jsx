import React from "react";
import { motion } from "framer-motion";
import heroBg from "../../assets/heroBg.webp";
import { Link } from "react-router-dom";

const HeroSection = ({startAnimation}) => {
  // Parent container variant to handle staggered orchestration of child elements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // Smooth delay sequence between each structural layer
        delayChildren: 0.2,    // Wait slightly for the background reveal to establish
      },
    },
  };

  // Shared fluid entry animation configuration for copy block elements
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.85,
        ease: [0.16, 1, 0.3, 1], // Custom ultra-smooth cubic-bezier easing
      },
    },
  };

  return (
    <section className="relative w-full h-screen flex items-center justify-center bg-black overflow-hidden">
      
      {/* Background Image - Cinematic zoom-out initialization */}
      <motion.div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
        initial={{ scale: 1.12 }}
animate={startAnimation ? { scale: 1 } : { scale: 1.12 }}
        transition={{ duration: 4.5, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Dark Overlay for enhanced contrast stability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content Layout Mask */}
      <motion.div 
        className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center"
        variants={containerVariants}
        initial="hidden"
animate={startAnimation ? "visible" : "hidden"}
      >
        
        {/* Top Tagline */}
        <motion.span 
          variants={itemVariants}
          className="text-xs sm:text-sm md:text-base font-semibold tracking-widest text-[#E5336D] uppercase mb-3 sm:mb-4 block"
        >
          Experience Perfection
        </motion.span>

        {/* Main Heading */}
        <motion.h1 
          variants={itemVariants}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-3xl"
        >
          Book Your Salon Appointment <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-[#E5336D]">
            Online in Seconds
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p 
          variants={itemVariants}
          className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 max-w-2xl font-light leading-relaxed"
        >
          Choose your service, pick your time, and visit without waiting.
        </motion.p>

        {/* Call to Action Interactive Elements */}
        <motion.div 
          variants={itemVariants}
          className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center items-center"
        >
          <Link to="/book-appointment">
          <motion.button 
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-[#E5336D] text-white font-medium text-sm sm:text-base rounded-full shadow-lg hover:bg-pink-500 transition-colors duration-300"
          >
            Book Now
          </motion.button>
          </Link>

          <Link to="/services">
          <motion.button 
  whileHover={{ 
    scale: 1.02, 
    y: -2, 
    borderColor: "rgb(229, 51, 109)", // Crisp solid brand border on hover
    boxShadow: "0 10px 25px -5px rgba(229, 51, 109, 0.25)", // Soft high-end glow effect
  }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: "spring", stiffness: 400, damping: 25 }}
  className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-transparent text-white border border-white/20 font-medium text-sm sm:text-base rounded-full tracking-wide transition-colors duration-300 relative overflow-hidden group"
>
  {/* Elegant slide-in background color block */}
  <span className="absolute inset-0 w-full h-full bg-[#E5336D]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
  
  {/* Button Copy */}
  <span className="relative z-10">View Services</span>
</motion.button>
</Link>
        </motion.div>

      </motion.div>
    </section>
  );
};

export default HeroSection;








