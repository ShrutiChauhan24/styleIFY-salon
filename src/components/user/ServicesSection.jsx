import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import {Link, useNavigate} from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const ServicesSection = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const [services,setServices] = useState([]);
  const navigate = useNavigate();

      useEffect(() => {
        fetchServices();
      }, []);
    
const fetchServices = async () => {
  try {
    const q = query(
      collection(db, "services"),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    const servicesData = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter(
        (service) =>
          service.status === "Active" &&
          service.categoryActive === true
      )
      .slice(0, 4);

    setServices(servicesData);
  } catch (error) {
    console.error("Error fetching services:", error);
  }
};
  

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".service-header", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: ".service-header",
          start: "top 90%",
        }
      });

      cardsRef.current.forEach((card, index) => {
        if (card) {
          gsap.from(card, {
            y: 50,
            opacity: 0,
            duration: 0.6,
            delay: index * 0.1,
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
            }
          });
        }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-[#0f0f0f] py-16 sm:py-20 md:py-24 px-3 sm:px-6 md:px-12 lg:px-16 z-10">
      
      {/* Header */}
      <div className="service-header text-center mb-10 sm:mb-16 md:mb-20">
        <span className="text-[#FF1B6B] text-[10px] sm:text-xs font-semibold uppercase tracking-widest block mb-2">Our Offerings</span>
        <h2 className="text-white font-bold leading-tight text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-3 sm:mb-4">
          Popular <span className="text-[#FF1B6B] italic font-serif relative">Services</span>
        </h2>
        <p className="text-gray-400 text-xs sm:text-sm md:text-base lg:text-lg max-w-2xl mx-auto px-2">
          Choose from our most-loved salon services and book instantly.
        </p>
      </div>

      {/* Grid: Always 2 cards wide, upgrades to 4 cards wide on desktop (lg:) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-8 max-w-7xl mx-auto">
        {services.map((service,index) => (
          <div
            key={service.id}
            ref={el => cardsRef.current[index] = el}
            className="group flex flex-col justify-between bg-[#1a1a1a] rounded-xl sm:rounded-2xl md:rounded-[2rem] p-2.5 sm:p-4 md:p-5 border border-white/10 shadow-2xl transition-all duration-300 hover:border-[#FF1B6B]/50 hover:-translate-y-1.5 w-full"
          >
            <div>
              {/* Image Container */}
              <div className="relative aspect-[3/4] sm:aspect-[4/5] rounded-lg sm:rounded-xl md:rounded-[1.5rem] overflow-hidden mb-3 sm:mb-4 md:mb-5 shadow-inner">
                <img 
                  src={service.imageUrl} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  alt={service.name}
                />
                {/* Floating Price Badge */}
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-black/80 backdrop-blur-md px-2 py-0.5 sm:px-3 sm:py-1 rounded-full border border-white/10">
                  <span className="text-[#FF1B6B] font-bold text-[10px] sm:text-xs md:text-sm">₹{service.price}</span>
                </div>
              </div>

              {/* Content Area - Stacked on mobile/tablet, Inline on large desktops */}
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-baseline gap-0.5 sm:gap-1.5 lg:gap-2 mb-3 sm:mb-4">
                <h3 className="text-white font-bold text-xs sm:text-base md:text-lg lg:text-xl truncate">
                  {service.name}
                </h3>
                <span className="text-gray-500 text-[9px] sm:text-[11px] md:text-xs font-medium uppercase tracking-wider shrink-0">
                  {service.duration} mins
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <button type='button' onClick={()=>{
                  navigate("/book-appointment", {
  state: {
    serviceId: service.id
  }
});
                }} className="w-full py-2 sm:py-3 bg-[#FF1B6B] hover:bg-[#d11556] text-white font-bold uppercase text-[9px] sm:text-xs tracking-widest rounded-lg sm:rounded-xl cursor-pointer shadow-[0_4px_12px_rgba(255,27,107,0.2)] active:scale-98 transition-all block text-center mt-auto">
              Book Now
            </button>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-12 sm:mt-16 md:mt-20 text-center">
        <Link to={'/services'}>
        <button className="px-5 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-3.5 border border-white/20 text-white rounded-full hover:bg-white hover:text-black transition-all font-bold text-[10px] sm:text-xs uppercase tracking-widest cursor-pointer">
          View All Services
        </button>
        </Link>
      </div>
    </section>
  );
};

export default ServicesSection;