import React from 'react';
import { motion } from 'framer-motion';
import { Award, ShieldCheck, Sparkles, CalendarCheck } from 'lucide-react';

const WhyChooseUs = () => {

  const reasons = [
    {
      title: "Experienced Stylists",
      desc: "Our master artisans bring years of global expertise to every cut.",
      icon: <Award className="w-5 h-5 md:w-6 md:h-6 text-[#FF1B6B]" />,
      bgColor: "bg-pink-500/5",
    },
    {
      title: "Hygienic Environment",
      desc: "Hospital-grade sterilization for your safety and peace of mind.",
      icon: <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-[#FF1B6B]" />,
      bgColor: "bg-pink-500/5",
    },
    {
      title: "Premium Products",
      desc: "We exclusively use world-class, organic hair and skin care lines.",
      icon: <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-[#FF1B6B]" />,
      bgColor: "bg-pink-500/5",
    },
    {
      title: "Easy Online Booking",
      desc: "Schedule your transformation in seconds via our seamless portal.",
      icon: <CalendarCheck className="w-5 h-5 md:w-6 md:h-6 text-[#FF1B6B]" />,
      bgColor: "bg-pink-500/5",
    }
  ];

  // Motion animation parameters matching your design configuration specs
  const headerVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } // Power4.out equivalent
    }
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <section className="relative bg-[#0f0f0f] py-16 sm:py-20 md:py-24 xl:py-32 px-3 sm:px-6 md:px-12 xl:px-16 overflow-hidden">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] sm:w-[400px] md:w-[600px] h-[280px] sm:h-[400px] md:h-[600px] bg-[#FF1B6B]/5 blur-[80px] md:blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <motion.div 
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="why-header text-center mb-12 sm:mb-16 md:mb-24"
        >
          <span className="text-[#FF1B6B] text-[10px] sm:text-xs font-semibold uppercase tracking-widest block mb-2">Why Us</span>
          <h2 className="text-white font-bold leading-tight text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-3 sm:mb-4">
            Why <span className="text-[#FF1B6B] italic font-serif">Choose</span> StyleIFY?
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm md:text-base max-w-xl mx-auto leading-relaxed px-2">
            Elevating the art of grooming through precision, passion, and premium care tailored just for you.
          </p>
        </motion.div>

        {/* Responsive Grid System: 2-columns on mobile/tablets, 4-columns only on wide screens (xl) */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.08 }}
          className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-6 md:gap-8"
        >
          {reasons.map((item, index) => (
            <motion.div
              key={index}
              // Alternates y start positions contextually matching index % 2 === 0 ? 40 : 70
              variants={{
                hidden: { y: index % 2 === 0 ? 40 : 70, opacity: 0 },
                visible: { 
                  y: 0, 
                  opacity: 1, 
                  transition: { duration: 1.2, ease: [0.14, 1, 0.34, 1] } // Expo.out equivalent
                }
              }}
              className={`group flex flex-col justify-between bg-[#1a1a1a] p-3 sm:p-5 md:p-8 rounded-xl sm:rounded-2xl md:rounded-[2rem] border border-white/5 
                hover:border-[#FF1B6B]/30 transition-all duration-500 shadow-2xl w-full
                ${index % 2 !== 0 ? 'xl:mt-10' : 'xl:mb-10'}`}
            >
              <div>
                {/* Icon Wrapper Frame */}
                <div className={`w-9 h-9 sm:w-12 sm:h-12 md:w-14 md:h-14 ${item.bgColor} rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center mb-3 sm:mb-5 md:mb-6 
                  group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 shadow-inner`}>
                  {React.cloneElement(item.icon, { 
                    className: "w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#FF1B6B]" 
                  })}
                </div>

                {/* Card Title */}
                <h3 className="text-white font-bold text-xs sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-1.5 sm:mb-3 group-hover:text-[#FF1B6B] transition-colors leading-tight min-h-[32px] sm:min-h-[48px] xl:min-h-0 flex items-center">
                  {item.title}
                </h3>
                
                {/* Card Description */}
                <p className="text-gray-400 text-[11px] sm:text-xs md:text-sm lg:text-base leading-snug md:leading-relaxed font-light line-clamp-3 xl:line-clamp-none">
                  {item.desc}
                </p>
              </div>

              {/* Decorative Subtle Line Divider */}
              <div className="mt-4 sm:mt-6 md:mt-8 w-6 md:w-8 h-[1px] md:h-[2px] bg-white/10 group-hover:w-full group-hover:bg-[#FF1B6B]/40 transition-all duration-700" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;