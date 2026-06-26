import React from 'react';
import { motion } from 'framer-motion';
import { Scissors, Calendar, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Choose Service",
      desc: "Select the professional salon service you want from our menu.",
      icon: <Scissors />,
    },
    {
      number: "02",
      title: "Pick Date & Time",
      desc: "Choose your preferred appointment slot that fits your schedule.",
      icon: <Calendar />,
    },
    {
      number: "03",
      title: "Confirm Booking",
      desc: "Receive instant confirmation and prepare for your transformation.",
      icon: <CheckCircle />,
    }
  ];

  // Motion Variants matching your exact GSAP physics/timing specs
  const headerVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { duration: 0.8, ease: [0.215, 0.610, 0.355, 1.000] } // power3.out equivalent
    }
  };

  const stepVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: (index) => ({
      y: 0,
      opacity: 1,
      transition: { 
        duration: 0.8, 
        delay: index * 0.15, // Preserves your explicit layout stagger calculation
        ease: [0.25, 0.46, 0.45, 0.94] // power2.out equivalent
      }
    })
  };

  return (
    <section className="relative bg-[#0f0f0f] py-16 sm:py-20 md:py-24 lg:py-32 px-4 sm:px-8 md:px-12 lg:px-16 overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-[#FF1B6B]/5 blur-[80px] sm:blur-[120px] rounded-full -mr-36 -mt-36 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <motion.div 
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="how-header text-center mb-12 sm:mb-16 md:mb-20 lg:mb-24"
        >
          <span className="text-[#FF1B6B] text-[10px] sm:text-xs font-semibold uppercase tracking-widest block mb-2">Process</span>
          <h2 className="text-white font-bold leading-tight text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-3 sm:mb-4">
            How It <span className="text-[#FF1B6B] italic font-serif">Works</span>
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm md:text-base max-w-md mx-auto leading-relaxed px-2">
            Book your professional salon appointment in just 3 simple steps.
          </p>
        </motion.div>

        {/* Process Flow - Clean layout stack that turns side-by-side at lg breakpoint */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-10 sm:gap-12 lg:gap-6 xl:gap-8 relative w-full">
          
          {/* Connector Horizontal Rule Line (Large Desktops Only) */}
          <div className="hidden lg:block absolute top-16 xl:top-20 left-[10%] w-[80%] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent z-0" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={stepVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              className="group relative z-10 flex flex-col items-center text-center max-w-[280px] sm:max-w-xs md:max-w-sm lg:w-[31%] w-full"
            >
              {/* Outer Step Circle Wrapper */}
              <div className="relative mb-4 sm:mb-6 md:mb-8">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 xl:w-32 xl:h-32 rounded-full border border-white/10 bg-[#1a1a1a] flex items-center justify-center relative transition-all duration-500 group-hover:border-[#FF1B6B]/50 group-hover:shadow-[0_0_30px_rgba(255,27,107,0.15)]">
                  
                  {/* Dynamic Scaling React Icons */}
                  {React.cloneElement(step.icon, { 
                    className: "w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 xl:w-8 xl:h-8 text-[#FF1B6B]" 
                  })}
                  
                  {/* Step Number Badge */}
                  <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 xl:w-10 xl:h-10 rounded-full bg-[#FF1B6B] text-white font-bold text-xs sm:text-sm flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                    {step.number}
                  </div>
                </div>
                
                {/* Accent Pulsing Circle */}
                <div className="absolute inset-0 rounded-full bg-[#FF1B6B]/5 animate-ping opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Step Title Header */}
              <h3 className="text-white font-bold text-base sm:text-lg md:text-xl xl:text-2xl mb-2 sm:mb-3 tracking-tight group-hover:text-[#FF1B6B] transition-colors">
                {step.title}
              </h3>
              
              {/* Step Explanatory Text */}
              <p className="text-gray-400 text-xs sm:text-sm xl:text-base leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Final Flow Trigger Call-to-Action Button */}
        <div className="mt-14 sm:mt-16 md:mt-20 lg:mt-24 text-center">
          <Link to="/book-appointment">
            <button className="bg-[#FF1B6B] hover:bg-[#d11556] text-white px-8 sm:px-10 md:px-12 py-3.5 sm:py-4 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-widest transition-all duration-300 shadow-[0_6px_20px_rgba(255,27,107,0.25)] active:scale-98 cursor-pointer">
              Start Booking Now
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;