import React, { useEffect } from 'react';
import { useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroSection from '../components/user/HeroSection';
import ServicesSection from '../components/user/ServicesSection';
import WhyChooseUs from '../components/user/WhyChooseUs';
import HowItWorks from '../components/user/HowItWorks';
import Testimonials from '../components/user/Testimonials';
import HomeCTA from '../components/user/HomeCTA';
import AboutSectionHome from '../components/user/AboutSectionHome';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const HomePage = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      
      const handleExecution = () => {
        // Force GSAP to recalculate everything first
        ScrollTrigger.refresh();
        
        const el = document.getElementById(id);
        if (el) {
        
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = el.getBoundingClientRect().top;
          const elementTopPosition = elementRect - bodyRect;
          
    
          const centralOffset = 60; 
          
          const finalScrollTarget = elementTopPosition + centralOffset;

          window.scrollTo({
            top: finalScrollTarget,
            behavior: "smooth"
          });
        }
      };

      // Tri-stage rendering fallback to ensure it captures calculations after page layout shifts
      const timer1 = setTimeout(handleExecution, 100);
      const timer2 = setTimeout(handleExecution, 300);
      const timer3 = setTimeout(handleExecution, 600); 

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [location]);

  return (
    <>
     <HeroSection/>
     <ServicesSection/>
     <AboutSectionHome id="about" />
     <WhyChooseUs/>
     <HowItWorks/>
     <Testimonials/>
     <HomeCTA/>
    </>
  );
};

export default HomePage;