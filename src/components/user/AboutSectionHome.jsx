import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Link } from "react-router-dom";

import aboutBg from "../../assets/about.jpg";

// Isolated Counter Component to ensure smooth dynamic number updates on mobile
const StatCounter = ({ target }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    // Listens to frame updates and binds cleanly to local component state
    const unsubscribe = rounded.on("change", (latest) => {
      setDisplayValue(latest);
    });
    return () => unsubscribe();
  }, [rounded]);

  return (
    <motion.span
      whileInView={{
        custom: (() => {
          // Triggers the frame animation once when entering mobile viewport
          animate(count, target, { duration: 2, ease: [0.16, 1, 0.3, 1] });
        })()
      }}
      viewport={{ once: true }}
    >
      {displayValue}
    </motion.span>
  );
};

const AboutSectionHome = () => {
  // Motion Container variants setup to stagger the text block children smoothly
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const statsContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const statItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  return (
    <section
      id="about"
      className="relative bg-[#0b0b0b] text-white py-16 sm:py-20 md:py-24 xl:py-32 px-4 sm:px-8 md:px-16 xl:px-24 w-full font-sans antialiased overflow-hidden border-b border-stone-900/40"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-[#e91e63]/10 rounded-full blur-[140px]" />

        <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-[#e91e63]/8 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-12 gap-12 sm:gap-16 xl:gap-12 items-center">
        <div className="xl:col-span-7 flex flex-col items-center xl:items-start text-center xl:text-left order-2 xl:order-1 w-full">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="flex flex-col items-center xl:items-start w-full mb-8 sm:mb-10 md:mb-12"
          >
            <motion.span variants={itemVariants} className="text-[10px] sm:text-xs tracking-[0.25em] uppercase text-[#e91e63] font-semibold bg-[#e91e63]/5 border border-[#e91e63]/20 px-4 py-1.5 rounded-full mb-4">
              Our Legacy
            </motion.span>
            <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight leading-[1.2] text-stone-100 max-w-2xl xl:max-w-none">
              About Our{" "}
              <span className="font-normal text-[#e91e63]">Salon</span>
            </motion.h2>
            <motion.p variants={itemVariants} className="text-stone-400 text-sm sm:text-base md:text-lg font-light leading-relaxed mt-4 sm:mt-5 max-w-2xl xl:max-w-none">
              Delivering premium beauty experiences with expert care and
              personalized styling for over 10 years. We combine global runway
              trends with custom care regimens.
            </motion.p>
            <motion.div variants={itemVariants} className="mt-6 sm:mt-8 w-full sm:w-auto">
              <Link to="/book-appointment">
                <button
                  type="button"
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#e91e63] hover:bg-[#d81b60] text-white font-semibold uppercase text-xs tracking-widest rounded-xl transition-all duration-300 shadow-[0_4px_12px_rgba(233,30,99,0.2)] hover:shadow-[0_6px_20px_rgba(233,30,99,0.35)] active:scale-[0.98] cursor-pointer"
                >
                  Book Appointment
                </button>
              </Link>
            </motion.div>
          </motion.div>

          <hr className="w-full border-stone-900 mb-8 sm:mb-10 md:mb-12" />

          <motion.div
            variants={statsContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-y-8 gap-x-4 sm:gap-6 w-full text-left"
          >
            <motion.div variants={statItemVariants} className="flex flex-col border-l border-stone-800 pl-4 sm:pl-5">
              <div className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight text-stone-100 flex items-center">
                <span className="stat-counter-value">
                  <StatCounter target={10} />
                </span>
                <span className="text-[#e91e63] font-normal ml-0.5">+</span>
              </div>
              <span className="text-[11px] sm:text-xs text-stone-500 uppercase tracking-wider font-medium mt-1.5 leading-tight">
                Years Experience
              </span>
            </motion.div>

            <motion.div variants={statItemVariants} className="flex flex-col border-l border-stone-800 pl-4 sm:pl-5">
              <div className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight text-stone-100 flex items-center">
                <span className="stat-counter-value">
                  <StatCounter target={1000} />
                </span>
                <span className="text-[#e91e63] font-normal ml-0.5">+</span>
              </div>
              <span className="text-[11px] sm:text-xs text-stone-500 uppercase tracking-wider font-medium mt-1.5 leading-tight">
                Happy Clients
              </span>
            </motion.div>

            <motion.div variants={statItemVariants} className="flex flex-col border-l border-stone-800 pl-4 sm:pl-5">
              <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light tracking-tight text-stone-100 min-h-[32px] sm:min-h-[40px] flex items-center">
                <span className="font-normal text-stone-100 text-lg sm:text-xl md:text-2xl">
                  Certified
                </span>
              </div>
              <span className="text-[11px] sm:text-xs text-stone-500 uppercase tracking-wider font-medium mt-1.5 leading-tight">
                Master Stylists
              </span>
            </motion.div>

            <motion.div variants={statItemVariants} className="flex flex-col border-l border-stone-800 pl-4 sm:pl-5">
              <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light tracking-tight text-stone-100 min-h-[32px] sm:min-h-[40px] flex items-center">
                <span className="font-normal text-stone-100 text-lg sm:text-xl md:text-2xl">
                  Premium
                </span>
              </div>
              <span className="text-[11px] sm:text-xs text-stone-500 uppercase tracking-wider font-medium mt-1.5 leading-tight">
                Global Products
              </span>
            </motion.div>
          </motion.div>
        </div>

        <div className="xl:col-span-5 order-1 xl:order-2 flex justify-center w-full">
          <motion.div
            variants={imageVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="relative w-full max-w-[340px] sm:max-w-[480px] md:max-w-[540px] xl:max-w-none aspect-[4/5] sm:aspect-[16/10] xl:aspect-[3/4] rounded-2xl md:rounded-[2rem] overflow-hidden group border border-stone-900 shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

            <div
              style={{
                backgroundImage: `url(${aboutBg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              className="w-full h-full
                brightness-95 contrast-105
                transition-all duration-700 ease-out
                 xl:grayscale
                 xl:group-hover:grayscale-0
                 xl:group-hover:scale-105"
            />

            <div className="absolute inset-4 rounded-[1rem] sm:rounded-[1.5rem] border border-white/5 pointer-events-none z-20 transition-all duration-500 group-hover:border-[#e91e63]/20" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSectionHome;