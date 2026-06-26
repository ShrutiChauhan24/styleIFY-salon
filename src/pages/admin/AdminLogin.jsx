import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if(!email.trim() || !password.trim()){
        toast.error('All fields must be filled');
        return;
      }


  await signInWithEmailAndPassword(
  auth,
  email,
  password
);
   toast.success('Login successful');
   navigate('/admin/dashboard')
 
    } catch (error) {
  switch (error.code) {
    case 'auth/invalid-credential':
      toast.error('Invalid email or password');
      break;

    case 'auth/user-not-found':
      toast.error('User not found');
      break;

    case 'auth/too-many-requests':
      toast.error('Too many attempts. Try again later.');
      break;

    default:
      toast.error('Login failed');
  }
}
  };

  return (
    <div className="min-h-screen w-full bg-[#1e1e1e] text-white flex items-center justify-center p-4 md:p-8 lg:p-12 font-sans selection:bg-[#ff2a6d] selection:text-white">
      
      {/* Main Container - Split Layout inspired by Ref 2 */}
      <div className="w-full max-w-6xl bg-[#121212] rounded-3xl overflow-hidden shadow-2xl border border-white/5 flex flex-col md:flex-row min-h-[600px] lg:min-h-[700px] animate-fade-in opacity-0 [animation-fill-mode:forwards] [animation-duration:800ms]">
        
        {/* Left Side: Visual Rich Content Panel */}
        <div className="relative w-full md:w-1/2 bg-[#1a1a1a] hidden md:flex flex-col justify-between p-8 lg:p-12 overflow-hidden group">
          {/* Background Image with Premium Dark Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{ 
              backgroundImage: `url('https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1200')` 
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/70 to-[#ff2a6d]/20 mix-blend-multiply" />
          
          {/* Top Decorative Floating Shape (Ref 1 Theme) */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#ff2a6d]/10 rounded-full blur-2xl pointer-events-none" />

          {/* Logo Brand Layer */}
          <div className="relative z-10 flex items-center gap-3 animate-slide-up opacity-0 [animation-fill-mode:forwards] [animation-duration:600ms] [animation-delay:200ms]">
            <div className="p-2.5 bg-[#ff2a6d] rounded-xl shadow-lg shadow-[#ff2a6d]/30">
              {/* Custom SVG Stylized Scissors Logo */}
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5h-.008v.008H7.5V7.5zm0 9h-.008v.008H7.5v-.008zm9-9h-.008v.008h.008V7.5zm0 9h-.008v.008h.008v-.008zM4.5 10.5a6 6 0 1112 0v3a6 6 0 11-12 0v-3z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M18 12H6" />
              </svg>
            </div>
            <span className="text-xl lg:text-2xl font-bold tracking-wider uppercase text-white">
              style<span className="text-[#ff2a6d]">IFY</span>
            </span>
          </div>

          {/* Bottom Statement */}
          <div className="relative z-10 space-y-3 mt-auto animate-slide-up opacity-0 [animation-fill-mode:forwards] [animation-duration:600ms] [animation-delay:400ms]">
            <p className="text-xs lg:text-sm font-semibold tracking-widest text-[#ff2a6d] uppercase">
              Premium Management Experience
            </p>
            <h2 className="text-2xl lg:text-4xl font-light tracking-tight text-white leading-tight">
              Refinement in <br />
              <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Every Detail.</span>
            </h2>
          </div>
        </div>

        {/* Right Side: Clean Form Layout (Ref 2 Form Structure) */}
        <div className="w-full md:w-1/2 p-6 sm:p-10 md:p-12 lg:p-16 flex flex-col justify-between bg-gradient-to-b from-[#121212] to-[#161616] relative">
          
          {/* Mobile Logo Only */}
          <div className="flex items-center gap-2 md:hidden mb-8">
            <div className="w-2.5 h-2.5 bg-[#ff2a6d] rounded-full"></div>
            <span className="text-sm font-bold uppercase tracking-widest">Amerisalon</span>
          </div>

          {/* Header Typography Hierarchy */}
          <div className="space-y-2 md:space-y-3 mt-4 md:mt-8 animate-slide-up opacity-0 [animation-fill-mode:forwards] [animation-duration:600ms] [animation-delay:200ms]">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
              Welcome Back, Admin
            </h1>
            <p className="text-xs sm:text-sm lg:text-base text-gray-400 font-light max-w-sm leading-relaxed">
              Sign in to access the salon management dashboard
            </p>
          </div>

          {/* Form Interactive Fields */}
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 my-8 md:my-0 animate-slide-up opacity-0 [animation-fill-mode:forwards] [animation-duration:600ms] [animation-delay:400ms]">
            
            {/* Email Field */}
            <div className="space-y-1.5 sm:space-y-2 group">
              <label className="text-xs lg:text-sm font-medium tracking-wide text-gray-400 group-focus-within:text-[#ff2a6d] transition-colors duration-300">
                Email Address
              </label>
              <div className="relative">
                <input 
                  type="email" 
                  name='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@amerisalon.com"
                  className="w-full bg-[#1a1a1a]/80 text-sm sm:text-base text-white px-4 py-3.5 rounded-xl border border-white/10 outline-none transition-all duration-300 placeholder:text-gray-600 focus:border-[#ff2a6d] focus:bg-[#1a1a1a] focus:ring-4 focus:ring-[#ff2a6d]/10"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5 sm:space-y-2 group">
              <div className="flex justify-between items-center">
                <label className="text-xs lg:text-sm font-medium tracking-wide text-gray-400 group-focus-within:text-[#ff2a6d] transition-colors duration-300">
                  Password
                </label>
                <a href="#forgot" className="text-[11px] sm:text-xs text-gray-500 hover:text-[#ff2a6d] transition-colors duration-200">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <input 
                  type="password" 
                  name='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#1a1a1a]/80 text-sm sm:text-base text-white px-4 py-3.5 rounded-xl border border-white/10 outline-none transition-all duration-300 placeholder:text-gray-600 focus:border-[#ff2a6d] focus:bg-[#1a1a1a] focus:ring-4 focus:ring-[#ff2a6d]/10"
                  required
                />
              </div>
            </div>

            {/* Premium Call to Action Button */}
            <button 
              type="submit"
              className="w-full relative overflow-hidden group bg-[#ff2a6d] text-white py-3.5 px-6 rounded-xl text-sm sm:text-base font-semibold tracking-wide transition-all duration-300 shadow-xl shadow-[#ff2a6d]/20 hover:shadow-[#ff2a6d]/30 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#ff528c] to-[#ff2a6d] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                Login 
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </span>
            </button>
          </form>

          {/* Footer Security Notice */}
          <div className="text-center md:text-left mt-4 md:mt-0 animate-slide-up opacity-0 [animation-fill-mode:forwards] [animation-duration:600ms] [animation-delay:500ms]">
            <p className="text-[10px] sm:text-xs tracking-widest text-gray-600 uppercase font-medium flex items-center justify-center md:justify-start gap-1.5">
              <svg className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Authorized personnel only.
            </p>
          </div>

        </div>
      </div>

      {/* Global CSS Animation Additions for Tailwind v4 natively supporting custom inline classes */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn cubic-bezier(0.16, 1, 0.3, 1) both; }
        .animate-slide-up { animation: slideUp cubic-bezier(0.16, 1, 0.3, 1) both; }
      `}} />
    </div>
  );
};

export default AdminLogin;