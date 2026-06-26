import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

// Register ScrollTrigger plugin safely
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const HomeCTA = () => {
  const containerRef = useRef(null);
  const circleContainerRef = useRef(null);
  const contentRef = useRef(null);

  useGSAP(() => {
    // 1. Entrance Animation for Text and Button Content
    gsap.fromTo(
      contentRef.current.children,
      { opacity: 0, y: 35 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );

    // 2. Continuous Ambient Scale & Pulse Animation for Content Rings
    const rings = circleContainerRef.current.querySelectorAll('.cta-ring');
    rings.forEach((ring, index) => {
      gsap.to(ring, {
        scale: index % 2 === 0 ? 1.05 : 0.95,
        opacity: index % 2 === 0 ? 0.3 : 0.15,
        duration: 4 + index * 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: index * 0.4,
      });
    });

    // 3. Subtle Parallax/Sway tied to Mouse movement over the section (Desktop Only)
    const handleMouseMove = (e) => {
      // Avoid computation overhead if on mobile viewport
      if (window.innerWidth < 1024) return;

      const { clientX, clientY } = e;
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      
      const x = (clientX - left) / width - 0.5;
      const y = (clientY - top) / height - 0.5;

      gsap.to(circleContainerRef.current, {
        x: x * 30,
        y: y * 30,
        duration: 0.8,
        ease: 'power2.out',
      });
    };

    const container = containerRef.current;
    container.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, { scope: containerRef });

  return (
    <section 
      ref={containerRef}
      className="bg-[#1a1a1a] text-white relative overflow-hidden py-20 sm:py-24 md:py-32 xl:py-40 px-4 sm:px-8 md:px-12 w-full flex items-center justify-center border-b border-[#e91e63]/5"
    >
      {/* BACKGROUND GRAPHICS SECTION */}
      <div 
        ref={circleContainerRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 select-none overflow-hidden"
      >
        {/* Core Vibrant Radial Glow */}
        <div className="absolute w-[220px] h-[220px] sm:w-[350px] sm:h-[350px] md:w-[450px] md:h-[450px] bg-gradient-to-tr from-[#e91e63]/10 to-transparent rounded-full blur-3xl opacity-60" />
        
        {/* Concentric Circle 1 (Innermost) */}
        <div className="cta-ring absolute w-[260px] h-[260px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] xl:w-[550px] xl:h-[550px] rounded-full border border-[#e91e63]/10 opacity-20" />
        
        {/* Concentric Circle 2 */}
        <div className="cta-ring absolute w-[380px] h-[380px] sm:w-[580px] sm:h-[580px] md:w-[720px] md:h-[720px] xl:w-[800px] xl:h-[800px] rounded-full border border-stone-800/40 opacity-30" />
        
        {/* Concentric Circle 3 (Outermost Spec) */}
        <div className="cta-ring absolute w-[520px] h-[520px] sm:w-[760px] sm:h-[760px] md:w-[950px] md:h-[950px] xl:w-[1100px] xl:h-[1100px] rounded-full border border-stone-900/30 opacity-40" />
      </div>

      {/* FOREGROUND CONTENT LAYER */}
      <div 
        ref={contentRef} 
        className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center gap-4 sm:gap-6 md:gap-8"
      >
        {/* Tagline Badge Detail */}
        <div>
          <span className="text-[10px] sm:text-xs tracking-[0.25em] uppercase text-[#e91e63] font-semibold bg-[#e91e63]/5 border border-[#e91e63]/20 px-4 py-1.5 rounded-full backdrop-blur-md inline-block">
            Elevate Your Look
          </span>
        </div>

        {/* Main Header Copy */}
        <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-stone-100 max-w-3xl leading-[1.2] sm:leading-[1.15]">
          Ready for your <br className="hidden sm:inline" />
          <span className="font-normal text-white relative inline-block sm:inline">
            next appointment?
            <span className="absolute left-0 bottom-1 w-full h-[1.5px] sm:h-[2px] bg-[#e91e63]/30 rounded-full" />
          </span>
        </h2>

        {/* Supporting Context Copy */}
        <p className="text-stone-400 text-xs sm:text-sm md:text-base lg:text-lg max-w-md font-light leading-relaxed px-2 sm:px-4">
          Book your session today with our expert stylists and experience a premium standard of luxury care.
        </p>

        {/* Premium Action Trigger */}
        <div className="mt-2 sm:mt-4 w-full sm:w-auto">
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
        </div>
      </div>

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