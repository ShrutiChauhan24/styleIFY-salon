import React, { useEffect, useState } from 'react';
import { X, User, Phone, Mail, Calendar, Edit2, Save, Sparkles, Clock, History } from 'lucide-react';
import { doc, updateDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db } from '../../firebase';
import { toast } from 'react-toastify';

export default function CustomerProfileDrawer({ isOpen, onClose, customerData }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });

  // Keep state synced with incoming data properties
  useEffect(() => {
    if (customerData) {
  setFormData({
    name: customerData.name || '',
    phone: customerData.phone || '',
    email: customerData.email || ''
  });
}
    // Reset edit mode when drawer opens/closes or data updates
    setIsEditing(false);
  }, [customerData, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const nameRegex = /^[A-Za-z\s]{2,50}$/;
    const phoneRegex = /^[6-9]\d{9}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nameRegex.test(formData.name.trim())) {
      toast.error("Please enter a valid name");
      return;
    }
    if (!phoneRegex.test(formData.phone.trim())) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }
    if (!emailRegex.test(formData.email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      const batch = writeBatch(db);

customerData.bookings.forEach((booking) => {
  batch.update(
    doc(db, "bookings", booking.id),
    {
      customer: {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
      },
      updatedAt: serverTimestamp(),
    }
  );
});

await batch.commit();
      
      toast.success("Customer profile updated securely");
      // if (fetchBookings) fetchBookings();
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      toast.error("Unable to update profile data");
    }
  };

 const stats = {
  totalVisits: customerData?.totalVisits || 0,
  lastVisit: customerData?.lastVisit || "—",
  firstVisit: customerData?.firstVisit || "—"
};

 const upcomingAppointments =
  customerData?.upcomingAppointments || [];

const visitHistory =
  customerData?.visitHistory || [];

  return (
    <>
      {/* Backdrop Backdrop Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 ease-in-out ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Profile Sidebar Panel Container */}
      <div
        className={`fixed top-0 right-0 z-50 h-full bg-[#121214] text-gray-100 shadow-2xl 
          border-l border-white/10 flex flex-col transition-transform duration-300 ease-out
          w-full sm:w-[440px] md:w-[500px] lg:w-[560px]
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        
        {/* Header Segment */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 sm:px-6 md:px-8 md:py-5">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#e61e53] font-bold sm:text-xs">
              Management Portal
            </span>
            <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl md:text-3xl mt-0.5">
              Customer Profile
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 transition-colors rounded-full text-gray-400 hover:bg-white/5 hover:text-[#e61e53] cursor-pointer"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Dynamic Master Scroll View Area */}
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6 sm:px-6 md:px-8 md:py-8">
          
          {/* Identity Contact Form / Fields Block */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 sm:text-sm">
                Personal Contact details
              </h3>
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#e61e53] hover:text-[#cf1445] transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="text-xs font-medium text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-500 transition-colors cursor-pointer"
                  >
                    <Save className="w-3 h-3" /> Save Info
                  </button>
                </div>
              )}
            </div>

            {/* Name Field Row */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-300 sm:text-sm">Customer Name</label>
              <div className="relative group">
                <User className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isEditing ? 'text-gray-500 group-focus-within:text-[#e61e53]' : 'text-gray-400'}`} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm sm:text-base text-white transition-all focus:outline-none
                    ${isEditing 
                      ? 'bg-[#1a1a1e] border-white/10 focus:border-[#e61e53] focus:ring-1 focus:ring-[#e61e53]' 
                      : 'bg-[#161619] border-transparent cursor-not-allowed select-none'
                    }`}
                  placeholder="No profile name"
                  required
                />
              </div>
            </div>

            {/* Phone Field Row */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-300 sm:text-sm">Phone Number</label>
              <div className="relative group">
                <Phone className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isEditing ? 'text-gray-500 group-focus-within:text-[#e61e53]' : 'text-gray-400'}`} />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm sm:text-base text-white transition-all focus:outline-none
                    ${isEditing 
                      ? 'bg-[#1a1a1e] border-white/10 focus:border-[#e61e53] focus:ring-1 focus:ring-[#e61e53]' 
                      : 'bg-[#161619] border-transparent cursor-not-allowed select-none'
                    }`}
                  placeholder="No phone registered"
                  required
                />
              </div>
            </div>

            {/* Email Field Row */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-300 sm:text-sm">Email Address</label>
              <div className="relative group">
                <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isEditing ? 'text-gray-500 group-focus-within:text-[#e61e53]' : 'text-gray-400'}`} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm sm:text-base text-white transition-all focus:outline-none
                    ${isEditing 
                      ? 'bg-[#1a1a1e] border-white/10 focus:border-[#e61e53] focus:ring-1 focus:ring-[#e61e53]' 
                      : 'bg-[#161619] border-transparent cursor-not-allowed select-none'
                    }`}
                  placeholder="No email registered"
                  required
                />
              </div>
            </div>
          </form>

          {/* Metric Stats Breakdown Element Grid */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 sm:text-sm border-b border-white/5 pb-2">
              Stats
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#1a1a1e] border border-white/5 p-3 rounded-xl text-center">
                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Total Visits</p>
                <p className="text-xl font-bold text-[#e61e53] mt-1">{stats.totalVisits}</p>
              </div>
              <div className="bg-[#1a1a1e] border border-white/5 p-3 rounded-xl text-center">
                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Last Visit</p>
                <p className="text-xs font-semibold text-white mt-2.5 whitespace-nowrap">{stats.lastVisit}</p>
              </div>
              <div className="bg-[#1a1a1e] border border-white/5 p-3 rounded-xl text-center">
                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">First Visit</p>
                <p className="text-xs font-semibold text-white mt-2.5 whitespace-nowrap">{stats.firstVisit}</p>
              </div>
            </div>
          </div>

          {/* Upcoming Appointment Schedule Array Section */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 sm:text-sm border-b border-white/5 pb-2">
              Upcoming Appointments
            </h3>
            <div className="space-y-2.5">
              {upcomingAppointments.length > 0 ? (
  upcomingAppointments.map((appointment) => (
    <div
      key={appointment.id}
      className="flex items-center justify-between bg-gradient-to-r from-[#1e1418] to-[#1a1a1e] border border-[#e61e53]/20 px-4 py-3 rounded-xl"
    >
      <div className="flex items-center gap-3">
        <Calendar className="w-4 h-4 text-[#e61e53]" />
        <span className="text-sm font-medium text-gray-200">
          {appointment.date}
        </span>
      </div>

      <span className="text-xs font-bold uppercase tracking-wider bg-[#e61e53]/10 text-[#e61e53] px-2.5 py-1 rounded-md">
        {appointment?.service.name}
      </span>
    </div>
  ))
) : (
  <p className="text-sm text-stone-500">
    No upcoming appointments
  </p>
)}
            </div>
          </div>

          {/* Historic Dynamic Visit Stack View Component */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 sm:text-sm border-b border-white/5 pb-2">
              Visit History
            </h3>
            <div className="overflow-hidden border border-white/5 rounded-xl divide-y divide-white/5 bg-[#161619]">
              {visitHistory.length > 0 ? (
  visitHistory.map((booking) => (
    <div
      key={booking.id}
      className="flex items-center justify-between px-4 py-3"
    >
      <div className="flex items-center gap-3">
        <Clock className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-300">
          {booking.date}
        </span>
      </div>

      {/* <span className="text-xs text-gray-400">
        {booking?.service.name}
      </span> */}

      <div className="text-right">
  <p className="text-sm text-white">
    {booking.service?.name}
  </p>
  <p className="text-xs text-stone-500">
    ₹{booking.service?.price}
  </p>
</div>
    </div>
  ))
) : (
  <p className="p-4 text-sm text-stone-500">
    No visit history
  </p>
)}
            </div>
          </div>

        </div>

        {/* Lower Static Panel Footer */}
        <div className="p-4 bg-[#161619] border-t border-white/5 sm:p-6 md:px-8">
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-transparent border border-white/10 text-white font-medium rounded-xl py-2.5 text-sm sm:text-base hover:bg-white/5 transition-colors cursor-pointer text-center"
          >
            Close View
          </button>
        </div>

      </div>
    </>
  );
}