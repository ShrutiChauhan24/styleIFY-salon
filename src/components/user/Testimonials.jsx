import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const dummyReviews = [
  { id: 1, name: "Aanya Sharma", role: "Bridal Client", text: "Absolutely incredible experience! They completely understood the modern minimalist look I wanted for my wedding. The hair and makeup stayed flawless all night.", rating: 5, img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop" },
  { id: 2, name: "Rohan Malhotra", role: "Regular Member", text: "The premium atmosphere alone makes it worth it. Precision haircutting at its best. The stylists pay close attention to structural flow and texture.", rating: 5, img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop" },
  { id: 3, name: "Priya Patel", role: "Color Enthusiast", text: "Finding a salon that handles vivid hair transitions without damaging hair texture is rare. Exceptional technique, stunning luxury interiors, and top-tier hospitality.", rating: 5, img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop" },
  { id: 4, name: "Kabir Singh", role: "Style Client", text: "Clean, sharp, and high-end. The styling team uses premium products, and the attention to subtle detail is phenomenal. Easily the best premium salon experience.", rating: 5, img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&auto=format&fit=crop" },
  { id: 5, name: "Meera Joshi", role: "Skin Therapy Client", text: "A sanctuary of absolute relaxation. The facial therapies and hair spa treatments are incredibly luxurious. You walk out feeling entirely renewed.", rating: 5, img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=256&auto=format&fit=crop" },
  { id: 6, name: "Vikram Mehta", role: "Regular Member", text: "Highly professional artists who don't rush through the process. They treat hair styling like a craft. Excellent ambiance and impeccable hygienic standards.", rating: 5, img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=256&auto=format&fit=crop" },
  { id: 7, name: "Sneha Kapoor", role: "Bridal Client", text: "They made my entire bridal crew look sensational. The organization, timelines, and execution were flawlessly seamless. Worth every single rupee.", rating: 5, img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&auto=format&fit=crop" },
  { id: 8, name: "Arjun Rao", role: "Style Client", text: "Master-level color corrections and premium sharp skin fades. Finally a place that blends modern global trends seamlessly with tailored individual styling.", rating: 5, img: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=256&auto=format&fit=crop" }
];

const Testimonials = () => {
  const [mobileIndex, setMobileIndex] = useState(0);

  // Auto-playing carousel for small screens
  useEffect(() => {
    const timer = setInterval(() => {
      setMobileIndex((prev) => (prev + 1) % dummyReviews.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setMobileIndex((prev) => (prev === 0 ? dummyReviews.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setMobileIndex((prev) => (prev + 1) % dummyReviews.length);
  };

  return (
    <section className="relative w-full bg-[#121212] px-4 py-16 sm:px-8 md:py-24 lg:py-28 xl:py-32 overflow-hidden">
      
      {/* Background Visual Depth Shadows */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <div className="absolute top-12 left-10 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-[#da1e5e]/5 blur-[80px] sm:blur-[130px]" />
        <div className="absolute bottom-12 right-10 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-[#da1e5e]/5 blur-[80px] sm:blur-[130px]" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        
        {/* Header Block */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 md:mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-[#da1e5e] uppercase block mb-2 sm:mb-3"
          >
            Guest Journals
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight"
          >
            What our customers say
          </motion.h2>
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="w-12 sm:w-16 h-[2px] bg-[#da1e5e] mx-auto mt-3 sm:mt-4 origin-center"
          />
        </div>

        {/* --- RESPONSIVE LAYOUT MATRIX --- */}

        {/* 1. Medium (3 Cards) & Large Desktop (4 Cards) Responsive Matrix */}
        <div className="hidden md:grid md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
          {dummyReviews.map((review, idx) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: idx * 0.06 }}
              whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}
              // Displays 6 reviews (3 columns x 2 rows) on tablet/mid-desktop. Unlocks 8 reviews seamlessly on wide desktops (xl)
              className={`relative bg-gradient-to-b from-[#1c1c1e] to-[#161617] border border-white/[0.04] rounded-2xl p-5 lg:p-6 xl:p-7 flex flex-col justify-between group transition-all duration-300 ${
                idx >= 6 ? 'md:hidden xl:flex' : ''
              }`}
            >
              <Quote className="absolute top-5 right-5 w-7 h-7 text-white/[0.01] group-hover:text-[#da1e5e]/[0.04] transition-colors duration-300 pointer-events-none" />
              
              <div>
                {/* Ratings */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-3 sm:w-3.5 h-3 sm:h-3.5 fill-[#da1e5e] text-[#da1e5e]" />
                  ))}
                </div>
                {/* Dynamic Scaled Copy Typography */}
                <p className="text-xs lg:text-sm text-neutral-300 leading-relaxed font-light tracking-wide">
                  "{review.text}"
                </p>
              </div>

              {/* Author Metadata Frame */}
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-white/[0.04]">
                <img 
                  src={review.img} 
                  alt={review.name} 
                  className="w-9 h-9 lg:w-10 lg:h-10 rounded-full object-cover ring-2 ring-white/[0.05] group-hover:ring-[#da1e5e]/40 transition-all duration-300"
                />
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm lg:text-base font-semibold text-white tracking-wide truncate">{review.name}</h4>
                  <p className="text-[10px] lg:text-xs text-neutral-400 font-medium mt-0.5 truncate">{review.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 2. Mobile / Small Screen Layout (1-Card Sliding Carousel) */}
        <div className="block md:hidden relative max-w-[340px] sm:max-w-[450px] mx-auto px-1">
          <div className="min-h-[230px] sm:min-h-[210px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={mobileIndex}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="w-full bg-gradient-to-b from-[#1c1c1e] to-[#161617] border border-white/[0.05] rounded-2xl p-5 sm:p-6 relative"
              >
                <Quote className="absolute top-4 right-4 w-7 h-7 text-white/[0.01] pointer-events-none" />
                
                <div className="flex items-center gap-1 mb-3.5">
                  {[...Array(dummyReviews[mobileIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#da1e5e] text-[#da1e5e]" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed min-h-[90px] font-light">
                  "{dummyReviews[mobileIndex].text}"
                </p>

                <div className="flex items-center gap-3 mt-5 pt-3.5 border-t border-white/[0.04]">
                  <img 
                    src={dummyReviews[mobileIndex].img} 
                    alt={dummyReviews[mobileIndex].name} 
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-white/[0.05]"
                  />
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-white">{dummyReviews[mobileIndex].name}</h4>
                    <p className="text-[10px] sm:text-xs text-neutral-400 mt-0.5">{dummyReviews[mobileIndex].role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Carousel Micro Navigation Controls */}
          <div className="flex items-center justify-between mt-5 px-0.5">
            {/* Pagination Progress Dots */}
            <div className="flex gap-1.5">
              {dummyReviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setMobileIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === mobileIndex ? 'w-4 bg-[#da1e5e]' : 'w-1.5 bg-white/15'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button 
                onClick={handlePrev}
                className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.05] text-white active:scale-95 transition-transform cursor-pointer"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={handleNext}
                className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.05] text-white active:scale-95 transition-transform cursor-pointer"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Testimonials;