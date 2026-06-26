import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

const ChatCTA = () => {
  return (
    <section className="relative w-full min-h-[25vh] sm:min-h-[30vh] md:min-h-[35vh] flex items-center justify-center overflow-hidden bg-[#121212] px-4 py-12 sm:px-6 lg:px-8">
      
      {/* Visual Richness: Premium Background Elements */}
      {/* 1. Subtle Radial Glow to mimic organic light feel */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(218,30,94,0.12)_0%,transparent_70%)] pointer-events-none" />
      
      {/* 2. Abstract Organic Vector Line Bloom Overlays */}
      <div className="absolute -bottom-10 -left-10 w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-[25vw] lg:h-[25vw] rounded-full bg-[#da1e5e]/5 blur-[60px] sm:blur-[80px] lg:blur-[100px] pointer-events-none" />
      <div className="absolute -top-10 -right-10 w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-[25vw] lg:h-[25vw] rounded-full bg-[#da1e5e]/5 blur-[60px] sm:blur-[80px] lg:blur-[100px] pointer-events-none" />
      
      {/* Subtle Background Mesh/Grid for modern UI texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:3rem_3rem] sm:bg-[size:4rem_4rem] pointer-events-none" />

      {/* Content Container with Motion Entrance */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} // Premium Cinematic Ease-Out
        className="relative z-10 w-full max-w-5xl text-center mx-auto flex flex-col items-center justify-center"
      >
        {/* Subtle UI Detail: Small Accent Tag */}
        <motion.span 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] sm:text-[10px] md:text-xs font-bold tracking-widest text-[#da1e5e] uppercase bg-[#da1e5e]/10 border border-[#da1e5e]/20 rounded-full mb-5 sm:mb-6 md:mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#da1e5e] animate-pulse" />
          Instant Support
        </motion.span>

        {/* Heading: Strong Typography Hierarchy & Scaling */}
        <h2 className="font-sans text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-white leading-[1.2] lg:leading-[1.15] max-w-xs sm:max-w-xl md:max-w-2xl lg:max-w-3xl mb-6 sm:mb-8 md:mb-10">
          Need quick help? <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#da1e5e]">
            Chat with us
          </span>
        </h2>

        {/* Premium CTA Button Component */}
        <motion.a
          href="https://wa.me/917004106519?text=Hello%20I%20want%20to%20book%20a%20salon%20appointment"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.02, y: -1.5 }}
          whileTap={{ scale: 0.98 }}
          className="group relative inline-flex items-center justify-center gap-2 sm:gap-3 px-5 py-3 sm:px-6 sm:py-3.5 md:px-8 md:py-4 lg:px-10 lg:py-4.5 text-xs sm:text-sm md:text-base lg:text-lg font-bold text-white bg-gradient-to-r from-[#da1e5e] to-[#b01347] rounded-xl lg:rounded-2xl transition-all duration-300 shadow-[0_4px_15px_rgba(218,30,94,0.25)] hover:shadow-[0_8px_30px_rgba(218,30,94,0.45)] overflow-hidden cursor-pointer"
        >
          {/* Shimmer/Glint Animation Effect on Hover */}
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />

          {/* Icon */}
          <MessageCircle className="w-3.5 h-3.5 sm:w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 transition-transform duration-300 group-hover:rotate-6 shrink-0" />
          
          {/* Button Text */}
          <span className="tracking-wide">Chat on WhatsApp</span>
          
          {/* Animated Arrow */}
          <span className="inline-block transition-transform duration-300 transform group-hover:translate-x-1 sm:group-hover:translate-x-1.5">
            →
          </span>
        </motion.a>
      </motion.div>
    </section>
  );
};

export default ChatCTA;