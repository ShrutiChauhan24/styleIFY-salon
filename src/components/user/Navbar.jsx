import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(navRef.current, 
        { y: -120, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "expo.out", delay: 0.5 }
      );
    });
    return () => ctx.revert();
  }, []);

 
useEffect(() => {
  let hidden = false;

  const handleScroll = () => {
    if (isOpen) return;

    const scrollY = window.scrollY;

    if (scrollY > 10 && !hidden) {
      hidden = true;

      gsap.killTweensOf(navRef.current);

      gsap.to(navRef.current, {
        y: -150,
        autoAlpha: 0,
        duration: 0.25,
        ease: "power2.out",
      });
    }

    if (scrollY <= 10 && hidden) {
      hidden = false;

      gsap.killTweensOf(navRef.current);

      gsap.to(navRef.current, {
        y: 0,
        autoAlpha: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  handleScroll();

  window.addEventListener("scroll", handleScroll, { passive: true });

  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
}, [isOpen]);

useEffect(() => {
  if (isOpen) {
    gsap.killTweensOf(navRef.current);

    gsap.to(navRef.current, {
      y: 0,
      autoAlpha: 1,
      duration: 0.2,
    });
  }
}, [isOpen]);

  useEffect(() => {
    const menu = mobileMenuRef.current;
    
    if (isOpen) {
      gsap.set(menu, { display: 'flex', opacity: 0 });
      gsap.to(menu, { 
        opacity: 1, 
        duration: 0.4, 
        ease: 'power2.out' 
      });
      gsap.fromTo(menu.querySelectorAll('li'), 
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out', delay: 0.1 }
      );
      document.body.style.overflow = 'hidden';
    } else {
      gsap.to(menu, { 
        opacity: 0, 
        duration: 0.3, 
        ease: 'power2.in',
        onComplete: () => gsap.set(menu, { display: 'none' })
      });
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact-us' },
  ];

  const handleAboutClick = () => {
    setIsOpen(false);
    navigate('/#about');
  };

  const closeMobileMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      <header 
        ref={navRef}
        className="fixed top-0 left-0 w-full z-[100] pointer-events-none
        pt-4 sm:pt-6 md:pt-8 px-4 sm:px-6 md:px-10 lg:px-16 flex justify-center"
      >
        <nav className="max-w-7xl w-full flex items-center justify-between pointer-events-auto">
          
          <div className="flex items-center justify-between md:justify-start w-full md:w-auto bg-[#1a1a1a]/90 backdrop-blur-xl border border-white/10 rounded-full px-5 sm:px-6 py-2.5 sm:py-3 shadow-2xl transition-all">
            
            <div className="flex items-center mr-0 md:mr-8 lg:mr-12">
              <Link to="/" onClick={closeMobileMenu} className="text-white font-black tracking-tighter text-lg sm:text-xl md:text-2xl italic select-none">
                style<span className="text-[#FF1B6B]">IFY</span>
              </Link>
            </div>
            <ul className="hidden md:flex items-center space-x-6 lg:space-x-8">
              {navLinks.map((link) => (
                 <li key={link.name}>
                   {link.name === "About" ? (
                    <button
                      onClick={handleAboutClick}
                      className="text-gray-400 hover:text-white text-[11px] lg:text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 cursor-pointer"
                    >
                      {link.name}
                    </button>
                  ) : (
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-white text-[11px] lg:text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
            
            <button 
              className="md:hidden text-white hover:text-[#FF1B6B] transition-colors p-1 ml-2 cursor-pointer focus:outline-none" 
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          <div className="hidden sm:flex items-center bg-[#1a1a1a]/90 backdrop-blur-xl border border-white/10 rounded-full p-1 sm:p-1.5 shadow-2xl ml-4 whitespace-nowrap">
            <Link to="/book-appointment">
              <button className="px-5 lg:px-6 py-2 md:py-2.5 bg-[#FF1B6B] hover:bg-[#d11556] text-white text-[10px] lg:text-xs font-bold uppercase tracking-widest rounded-full hover:scale-102 transition-all duration-300 shadow-lg shadow-[#FF1B6B]/10 cursor-pointer">
                Book Appointment
              </button>
            </Link>
          </div>

        </nav>
      </header>

      <div
        ref={mobileMenuRef}
        className="fixed inset-0 bg-[#0f0f0f]/98 backdrop-blur-2xl z-[90] flex-col items-center justify-center p-6"
        style={{ display: 'none' }}
      >
        <ul className="flex flex-col items-center space-y-6 sm:space-y-8 text-center">
          {navLinks.map((link, idx) => (
            <li key={idx} className="w-full">
              {link.name === "About" ? (
                <button
                  onClick={handleAboutClick}
                  className="text-gray-300 hover:text-[#FF1B6B] text-lg sm:text-xl font-medium uppercase tracking-[0.25em] transition-colors duration-300 block w-full py-2 cursor-pointer"
                >
                  {link.name}
                </button>
              ) : (
                <Link
                  to={link.path}
                  onClick={closeMobileMenu}
                  className="text-gray-300 hover:text-[#FF1B6B] text-lg sm:text-xl font-medium uppercase tracking-[0.25em] transition-colors duration-300 block w-full py-2"
                >
                  {link.name}
                </Link>
              )}
            </li>
          ))}
          
          <li className="pt-6 w-full sm:hidden">
            <Link to="/book-appointment" onClick={closeMobileMenu}>
              <button className="w-full py-3.5 px-5 bg-[#FF1B6B] text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-lg active:scale-98 transition-transform">
                Book Appointment
              </button>
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;