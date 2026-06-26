import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from 'react-router-dom';

// Register ScrollTrigger safely
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const ServicesPage = () => {
  const componentRef = useRef(null);
  const headerRef = useRef(null);
  const categoriesRef = useRef(null);
  const cardsContainerRef = useRef(null);
  const [categories,setCategories] = useState([])
  const [services,setServices] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const navigate = useNavigate();


   useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const q = query(
      collection(db, "categories"),
      where("isActive", "==", true),
    );
    const snapshot = await getDocs(q);

    const categoriesData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setCategories(categoriesData);
  };

    useEffect(() => {
      fetchServices();
    }, []);
  
    const fetchServices = async () => {
      try {
  
        const q = query(collection(db, "services"), orderBy("createdAt", "desc"));
  
        const snapshot = await getDocs(q);
  
        const servicesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
  
        setServices(servicesData);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

  const filteredServices =
  activeCategory === "all"
    ? services.filter(
        service =>
          service.status === "Active" &&
          service.categoryActive === true
      )
    : services.filter(
        service =>
          service.categoryId === activeCategory &&
          service.status === "Active" &&
          service.categoryActive === true
      );


  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: componentRef.current,
        start: 'top 75%',
        toggleActions: 'play none none none'
      }
    });

    tl.fromTo(headerRef.current.children,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power4.out' }
    );

    
    tl.fromTo(categoriesRef.current.children,
      { opacity: 0, scale: 0.9, y: 15 },
      { opacity: 1, scale: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'back.out(1.2)' },
      '-=0.6'
    );

    tl.fromTo(cardsContainerRef.current.children,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.12, ease: 'power3.out' },
      '-=0.5'
    );
  }, { scope: componentRef });

  return (
    <section 
      ref={componentRef}
      className="bg-[#0b0b0b] text-white py-12 sm:py-16 md:py-24 lg:py-32 px-4 sm:px-6 md:px-12 lg:px-20 xl:px-28 w-full font-sans antialiased overflow-hidden"
    >
      <div 
        ref={headerRef} 
        className="text-center max-w-4xl mx-auto flex flex-col items-center mb-10 sm:mb-12 md:mb-16 lg:mb-20"
      >
        <span className="text-[9px] sm:text-[10px] md:text-xs tracking-[0.3em] uppercase text-[#e91e63] font-semibold bg-[#e91e63]/5 border border-[#e91e63]/20 px-3 py-1.5 rounded-full mb-3 md:mb-4">
          Our Specialization
        </span>
        <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light tracking-tight leading-[1.2] text-stone-100">
          Luxury Beauty <span className="font-normal text-[#e91e63]">Services</span>
        </h2>
        <p className="text-stone-400 text-[11px] sm:text-xs md:text-sm lg:text-base xl:text-lg max-w-xl font-light leading-relaxed mt-2.5 sm:mt-3.5 md:mt-4 px-4">
          Tailored treatments designed to make you look and feel your best
        </p>
      </div>

      {/* 2. CATEGORIES ROW */}
      <div
  ref={categoriesRef}
  className="flex items-center justify-center gap-3 sm:gap-5 md:gap-6 lg:gap-8 xl:gap-10 flex-wrap mb-10 sm:mb-14 md:mb-16 lg:mb-24 max-w-6xl mx-auto"
>

  {/* All Services Button */}
  <button
    onClick={() => setActiveCategory("all")}
    className="flex flex-col items-center group cursor-pointer focus:outline-none"
  >
    <div
      className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 rounded-full flex items-center justify-center transition-all duration-300 border p-0.5 sm:p-1 mb-1.5 sm:mb-2 md:mb-3
      ${
        activeCategory === "all"
          ? "border-[#e91e63] shadow-[0_0_15px_rgba(233,30,99,0.3)] scale-105"
          : "border-stone-800 hover:border-stone-600 group-hover:scale-105"
      }`}
    >
      <div
        className={`w-full h-full rounded-full flex items-center justify-center text-lg
        ${
          activeCategory === "all"
            ? "bg-[#e91e63]"
            : "bg-stone-900"
        }`}
      >
        ✨
      </div>
    </div>

    <span
      className={`text-[9px] sm:text-[10px] md:text-xs xl:text-sm tracking-wider uppercase font-medium
      ${
        activeCategory === "all"
          ? "text-[#e91e63]"
          : "text-stone-400"
      }`}
    >
      All Services
    </span>
  </button>

  {/* Firestore Categories */}
  {categories.map((cat) => {
    const isSelected = activeCategory === cat.id;

    return (
      <button
        key={cat.id}
        onClick={() => setActiveCategory(cat.id)}
        className="flex flex-col items-center group cursor-pointer focus:outline-none"
      >
        <div
          className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 rounded-full flex items-center justify-center transition-all duration-300 relative overflow-hidden border p-0.5 sm:p-1 mb-1.5 sm:mb-2 md:mb-3
          ${
            isSelected
              ? "border-[#e91e63] shadow-[0_0_15px_rgba(233,30,99,0.3)] scale-105"
              : "border-stone-800 hover:border-stone-600 group-hover:scale-105"
          }`}
        >
          <div className="w-full h-full rounded-full overflow-hidden relative">
            <img
              src={cat.imageUrl}
              alt={cat.name}
              className="w-full h-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
            />
            <div
              className={`absolute inset-0 transition-opacity duration-300 ${
                isSelected
                  ? "bg-[#e91e63]/20"
                  : "bg-black/40 group-hover:bg-black/10"
              }`}
            />
          </div>
        </div>

        <span
          className={`text-[9px] sm:text-[10px] md:text-xs xl:text-sm tracking-wider uppercase font-medium
          ${
            isSelected
              ? "text-[#e91e63]"
              : "text-stone-400 group-hover:text-stone-200"
          }`}
        >
          {cat.name}
        </span>
      </button>
    );
  })}
</div>

      {/* 3. CARD SERVICES LIST GRID - Fixed layout configurations: 2 cards on mobile/tablet/mid-desktop, 4 cards on large desktops */}
      <div 
        ref={cardsContainerRef}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-6 lg:gap-8 max-w-7xl mx-auto"
      >
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="group bg-[#151515] rounded-xl sm:rounded-2xl md:rounded-3xl p-2.5 sm:p-3.5 md:p-4 lg:p-4.5 xl:p-5 border border-stone-900/60 shadow-2xl transition-all duration-300 hover:border-[#e91e63]/40 hover:-translate-y-1.5 flex flex-col justify-between"
          >
            
            <div className="relative aspect-[4/5] sm:aspect-[3/4] md:aspect-[4/5] rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden mb-3 sm:mb-4 md:mb-5 shadow-inner">
              <img 
                src={service.imageUrl} 
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                alt={service.name}
              />
          
              <div className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 md:top-3.5 md:right-3.5 bg-black/75 backdrop-blur-md px-1.5 py-0.5 sm:px-2.5 sm:py-1 md:px-3 md:py-1.5 rounded-full border border-white/5 shadow-md">
                <span className="text-[#e91e63] font-semibold text-[10px] sm:text-xs md:text-sm lg:text-xs xl:text-sm tracking-wide">
                  ₹{service.price}
                </span>
              </div>
            </div>

          
            <div className="flex flex-col flex-grow justify-between gap-2.5 sm:gap-3.5 px-0.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
                <h3 className="text-white font-normal text-xs sm:text-sm md:text-base lg:text-sm xl:text-base tracking-wide truncate">
                  {service.name}
                </h3>
                <span className="self-start sm:self-auto text-stone-500 font-mono text-[8px] sm:text-[9px] md:text-[10px] lg:text-[9px] xl:text-[10px] uppercase tracking-widest bg-stone-900/80 px-1.5 py-0.5 rounded border border-stone-800/40 whitespace-nowrap">
                  {service.duration} mins
                </span>
              </div>
              <button 
                type="button"
                onClick={()=>{
                  navigate("/book-appointment", {
  state: {
    serviceId: service.id
  }
});
                }}
                className="w-full py-2 sm:py-2.5 md:py-3 bg-[#e91e63] hover:bg-[#d81b60] text-white font-semibold uppercase text-[9px] sm:text-[10px] md:text-xs lg:text-[10px] xl:text-xs tracking-widest rounded-md sm:rounded-lg md:rounded-xl transition-all duration-300 shadow-[0_4px_12px_rgba(233,30,99,0.2)] hover:shadow-[0_6px_20px_rgba(233,30,99,0.35)] active:scale-[0.98] cursor-pointer block text-center mt-auto"
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServicesPage;