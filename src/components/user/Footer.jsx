import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Phone, 
  MapPin, 
  Clock, 
  ArrowRight 
} from 'lucide-react';
import {doc, getDoc} from "firebase/firestore";
import {db} from "../../firebase";
import {formatTime12Hour} from "../../helper/formatTime12Hour";
import {Link} from "react-router-dom";

const WhatsAppIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className="w-4 h-4 sm:w-5 sm:h-5"
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
  </svg>
);

const Footer = () => {
     const [settings, setSettings] = useState(null);

   useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, "salonSettings", "config");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setSettings(docSnap.data());
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchSettings();
  }, []);

  const footerLinks = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "About", path: "/#about" },
  { name: "Contact", path: "/contact-us" },
];


  const containerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1], // Premium ease-out expo
        staggerChildren: 0.08
      }
    }
  };

  // Animation Variants for Individual Columns
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <motion.footer 
      className="bg-[#1a1a1a] text-stone-300 font-sans border-t border-[#e91e63]/10 relative overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={containerVariants}
    >
      {/* Background Subtle Pink Glow - Scaled responsively */}
      <div className="absolute bottom-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-[#e91e63]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 md:px-8 md:py-16 lg:px-12 lg:py-20 xl:py-24">
        
        {/* Top Grid Section */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 mb-12 md:mb-16 lg:mb-20">
          
          {/* Column 1: Contact Info */}
          <motion.div variants={itemVariants} className="space-y-4 sm:space-y-5 md:space-y-6">
            <h3 className="text-white text-xs sm:text-sm font-semibold tracking-widest uppercase border-b border-stone-800 pb-2.5 sm:pb-3">
              Contact Us
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm md:text-base">
              <li className="flex items-center gap-3 group transition-colors duration-300 hover:text-[#e91e63]">
                <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#e91e63] shrink-0" />
                <a href="tel:+1234567890" className="transition-transform duration-300 group-hover:translate-x-1">
                  +91 {settings?.salonPhone}
                </a>
              </li>
              <li className="flex items-start gap-3 group transition-colors duration-300 hover:text-[#e91e63]">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#e91e63] shrink-0 mt-0.5 sm:mt-1" />
                <span className="transition-transform duration-300 group-hover:translate-x-1 leading-relaxed">
                  {settings?.salonAddress}
                </span>
              </li>
            </ul>
          </motion.div>

          {/* Column 2: Quick Links */}
          <motion.div variants={itemVariants} className="space-y-4 sm:space-y-5 md:space-y-6">
            <h3 className="text-white text-xs sm:text-sm font-semibold tracking-widest uppercase border-b border-stone-800 pb-2.5 sm:pb-3">
              Navigation
            </h3>
            <ul className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm md:text-base">
  {footerLinks.map((item) => (
    <li key={item.name}>
      <Link
        to={item.path}
        className="inline-block transition-all duration-300 hover:text-[#e91e63] hover:translate-x-1.5 relative after:content-[''] after:absolute after:w-0 after:h-[1px] after:bottom-0 after:left-0 after:bg-[#e91e63] hover:after:w-full after:transition-all after:duration-300"
      >
        {item.name}
      </Link>
    </li>
  ))}
</ul>
          </motion.div>

          {/* Column 3: Hours */}
          <motion.div variants={itemVariants} className="space-y-4 sm:space-y-5 md:space-y-6">
            <h3 className="text-white text-xs sm:text-sm font-semibold tracking-widest uppercase border-b border-stone-800 pb-2.5 sm:pb-3">
              Working Hours
            </h3>
            <ul className="space-y-3.5 text-xs sm:text-sm md:text-base">
              <li className="flex items-start gap-3">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#e91e63] shrink-0 mt-0.5 sm:mt-1" />
                <div>
                  <p className="text-white font-medium">Mon - Sat</p>
                  <p className="text-stone-400 text-[11px] sm:text-xs md:text-sm mt-0.5">{settings?.openingTime && settings?.closingTime
    ? `${formatTime12Hour(settings.openingTime)} - ${formatTime12Hour(settings.closingTime)}`
    : "Loading..."}</p>
                </div>
              </li>
              <li className="flex items-start gap-3 pl-6.5 sm:pl-7">
                <div>
                  <p className="text-white font-medium">Sunday</p>
                  <p className="text-stone-400 text-[11px] sm:text-xs md:text-sm mt-0.5">10:00 AM - 4:00 PM</p>
                </div>
              </li>
            </ul>
          </motion.div>

          {/* Column 4: Newsletter */}
          <motion.div variants={itemVariants} className="space-y-4 sm:space-y-5 md:space-y-6">
            <h3 className="text-white text-xs sm:text-sm font-semibold tracking-widest uppercase border-b border-stone-800 pb-2.5 sm:pb-3">
              Newsletter
            </h3>
            <p className="text-[11px] sm:text-xs md:text-sm text-stone-400 leading-relaxed">
              Be the first to hear about our latest luxury hair offers and styling trends.
            </p>
            <form className="relative flex items-center mt-2 group" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="YOUR EMAIL ADDRESS" 
                className="w-full bg-stone-900/50 backdrop-blur-xs text-[10px] sm:text-xs tracking-wider text-white placeholder-stone-500 px-3.5 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 border border-stone-800 rounded-none focus:outline-none focus:border-[#e91e63] focus:ring-1 focus:ring-[#e91e63] transition-all duration-300"
              />
              <button 
                type="submit" 
                className="absolute right-0 top-0 bottom-0 px-3 sm:px-4 bg-stone-800 border-l border-stone-800 text-stone-400 group-hover:bg-[#e91e63] group-hover:text-white transition-all duration-300 flex items-center justify-center"
                aria-label="Subscribe"
              >
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </button>
            </form>
          </motion.div>

        </div>

        {/* Bottom Bar Section */}
        <motion.div 
          variants={itemVariants}
          className="pt-6 md:pt-8 border-t border-stone-900 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          {/* Copyright */}
          <p className="text-center sm:text-left text-[11px] sm:text-xs md:text-sm text-stone-500">
            &copy; {new Date().getFullYear()} AmeriSalon Ltd. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex justify-center gap-3 sm:gap-4">
            <a 
              href="https://wa.me/1234567890" 
              target="_blank" 
              rel="noreferrer"
              className="p-2 sm:p-2.5 rounded-full bg-stone-900 text-stone-400 border border-stone-800 transition-all duration-300 hover:text-white hover:bg-[#25D366] hover:border-[#25D366] hover:shadow-[0_0_15px_rgba(37,211,102,0.3)] hover:-translate-y-0.5"
              aria-label="WhatsApp"
            >
              <WhatsAppIcon />
            </a>
          </div>

        </motion.div>

      </div>
    </motion.footer>
  );
}

export default Footer;