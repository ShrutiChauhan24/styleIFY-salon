import React, { useState,useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, User, Phone, Mail, Sparkles, ChevronDown } from 'lucide-react';
import { collection, doc, getDocs, query, serverTimestamp, where, getDoc, addDoc } from "firebase/firestore";
import {db} from "../../firebase";
import { generateSlots } from '../../helper/generateSlots';
import { buildSlotsStatus } from '../../helper/buildSlotsStatus';
import { addMinutes } from '../../helper/addMinutes';
import { formatTime12Hour } from '../../helper/formatTime12Hour';
import {useNavigate} from "react-router-dom"
import {toast} from "react-toastify"
import { sendBookingEmail } from '../../helper/sendBookingEmail';


export default function WalkInBookingModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    serviceId: '',
    date: '',
    timeSlot: ''
  });

const [servicesList, setServicesList] = useState([]);
const [timeSlots,setTimeSlots] = useState([]);
const [settings,setSettings] = useState(null);
const selectedService = servicesList?.find(
  service => service.id === formData.serviceId
);

 useEffect(() => {
  const fetchServices = async () => {
    const snapshot = await getDocs(collection(db, "services"));

    const services = snapshot.docs.map(doc => ({
      id: doc.id, 
      ...doc.data(),
    }));
    setServicesList(services);
    }
  fetchServices();
 },[])

const fetchSettings = async () => {
  const docRef = doc(db, "salonSettings", "config");

  const snapshot = await getDoc(docRef);

  if (snapshot.exists()) {
    return snapshot.data();
  }

  return null;
};

useEffect(() => {
  const loadSettings = async () => {
    const data = await fetchSettings();
    setSettings(data);
  };

  loadSettings();
}, []);

 const getTodayString = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  };


   useEffect(() => {
  if (!formData.date || !settings) return;

  const fetchAvailableSlots = async () => {

  if (
  !settings?.openingTime ||
  !settings?.closingTime ||
  !settings?.slotDuration
) {
  return;
}

    const blockedSnapshot = await getDocs(
      query(
        collection(db, "blockedSlots"),
        where("date", "==", formData.date)
      )
    );

    const blockedTimes = blockedSnapshot.docs.map(
      doc => doc.data().slotTime
    );

      const bookedTimes = new Set();

      const bookedQuery = query(
        collection(db, "bookings"),
        where("date", "==", formData.date),
      );

    const snapshotBookings = await getDocs(bookedQuery);

    const bookedDocs = snapshotBookings.docs
  .map((doc) => doc.data())
  .filter((booking) =>
    ["confirmed", "completed"].includes(
      booking.bookingStatus?.toLowerCase()
    )
  );

  bookedDocs.forEach((booking) => {
    let current = booking.startTime;
  
    while (current < booking.endTime) {
      bookedTimes.add(current);
  
      current = addMinutes(
        current,
        settings.slotDuration
      );
    }
  });

    const allSlots = generateSlots(
      settings?.openingTime,
      settings?.closingTime,
      settings?.slotDuration
    );

    const slotsStatus = buildSlotsStatus({
      date: formData.date,
      allSlots,
      blockedTimes,
      bookedTimes:[...bookedTimes],
    });


    
    let availableSlots = slotsStatus.filter(
      slot => slot.status === "available"
    );

    const isToday = formData?.date === getTodayString();

   if (isToday) {
  const now = new Date();

  const currentMinutes =
    now.getHours() * 60 +
    now.getMinutes() +
    settings?.slotDuration;

     availableSlots = availableSlots.filter(
        slot => toMinutes(slot.time) >= currentMinutes
     );
}

    setTimeSlots(availableSlots);
  };

  fetchAvailableSlots();
}, [formData.date, settings]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const toMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
     const settingsDoc = await getDoc(
  doc(db, "salonSettings", "config")
);

const latestSettings = settingsDoc.data();

const {
  openingTime,
  closingTime,
  slotDuration,
  maxAdvanceBookingDays,
  allowSameDayBooking,
  sendEmailBookingConfirmation
} = latestSettings;

      const validService = servicesList.find(
    service => service.id === formData.serviceId
  );

      if (!validService || !formData.date || !formData.timeSlot || !formData.name.trim() || !formData.phone || !formData.email) {
      toast.error('Please fill in all the required booking tokens to reserve your slot.');
      return;
    }
    
     const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!dateRegex.test(formData.date)) {
      toast.error("Invalid booking date");
      return;
    }

    const selectedDate = new Date(`${formData.date}T00:00:00`);

    if (isNaN(selectedDate.getTime())) {
      toast.error("Invalid booking date");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

     if (selectedDate < today) {
      toast.error("Booking date cannot be in the past");
      return;
    }

    const isToday = formData?.date === getTodayString();

if (
  allowSameDayBooking === false &&
  isToday
) {
  toast.error(
    "Same-day bookings are disabled"
  );
  return;
}

if (isToday) {
  const now = new Date();

  const currentMinutes =
    now.getHours() * 60 +
    now.getMinutes() +
    slotDuration; 

  if (toMinutes(formData.timeSlot) < currentMinutes) {
    toast.error(
      `Please select a time at least ${slotDuration} minutes from now`
    );
    return;
  }
}

    const maxDays = maxAdvanceBookingDays ?? 30;

    const lastAllowedDate = new Date(today);
    lastAllowedDate.setDate(lastAllowedDate.getDate() + maxDays);

    if (selectedDate > lastAllowedDate) {
      toast.error(
        `Bookings can only be made up to ${maxDays} days in advance`
      );
      return;
    }

   const endTime = addMinutes(
   formData.timeSlot,
   selectedService?.duration
);

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

if (!timeRegex.test(formData.timeSlot)) {
  toast.error("Invalid start time");
  return;
}

if (!timeRegex.test(endTime)) {
  toast.error("Invalid end time");
  return;
}

const bookingStart = toMinutes(formData.timeSlot);
const bookingEnd = toMinutes(endTime);

const salonOpen = toMinutes(openingTime);
const salonClose = toMinutes(closingTime);

if (
  bookingStart < salonOpen ||
  bookingEnd > salonClose
) {
  toast.error("Booking falls outside salon hours");
  return;
}

if (bookingStart >= bookingEnd) {
  toast.error("Invalid booking duration");
  return;
}
 
const blockedSnapshot = await getDocs(
  query(
    collection(db, "blockedSlots"),
    where("date", "==", formData.date)
  )
);

const bookedSnapshot = await getDocs(
  query(
    collection(db, "bookings"),
    where("date", "==", formData.date)
  )
);

const blockedTimes = blockedSnapshot.docs.map(
  doc => doc.data().slotTime
);

if (blockedTimes.includes(formData.timeSlot)) {
  toast.error("This slot is blocked");
  return;
}

const hasOverlap = bookedSnapshot.docs.some((doc) => {
  const booking = doc.data();

  const existingStart = toMinutes(booking.startTime);
  const existingEnd = toMinutes(booking.endTime);

  return (
    bookingStart < existingEnd &&
    bookingEnd > existingStart
  );
});

if (hasOverlap) {
  toast.error("This slot has already been booked");
  return;
}

const nameRegex = /^[A-Za-z\s]{2,50}$/;

if (!nameRegex.test(formData.name.trim())) {
  toast.error("Please enter a valid name");
  return;
}

const phoneRegex = /^[6-9]\d{9}$/;

if (!phoneRegex.test(formData.phone.trim())) {
  toast.error("Please enter a valid 10-digit phone number");
  return;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(formData.email.trim())) {
  toast.error("Please enter a valid email address");
  return;
}


const bookingData = {
  serviceId : selectedService?.id,

  service : {
    id : selectedService.id,
    name: selectedService?.name,
    price: selectedService?.price,
    duration : selectedService?.duration,
    imageUrl: selectedService?.imageUrl
  },

  date: formData.date,
  startTime: formData.timeSlot,
  endTime,

  customer:{
    name: formData.name.trim(),
    email: formData.email.trim(),
    phone: formData.phone.trim()
  },

  bookingStatus : "confirmed",
  paymentStatus : "pending",

  createdAt : serverTimestamp(),
  updatedAt : serverTimestamp()
}

  const newBooking = await addDoc(
  collection(db, "bookings"),
  bookingData
);

     if (sendEmailBookingConfirmation) {
      console.log("sendBookingEmail called");
    await sendBookingEmail({
      bookingId: newBooking.id,
      ...bookingData
    });
  }

   onClose();
    } catch (error) {
       console.error(error);
      toast.error("Oops! something went wrong")
    } 
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-x-hidden overflow-y-auto isolation-auto">
          {/* Backdrop Cover Layer - Reduced brightness/opacity and removed backdrop-blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 cursor-pointer"
          />

          {/* Modal Container */}
          {/* Fluid scale across sizes: max-w-[92%] (Mobile) -> sm:max-w-md (Tablet) -> md:max-w-lg (Laptop) -> lg:max-w-xl (Desktop) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5, bounce: 0.2 }}
            className="relative w-full max-w-[92%] sm:max-w-md md:max-w-lg lg:max-w-xl bg-[#1a1a1a] rounded-3xl border border-white/5 shadow-2xl shadow-black/80 overflow-hidden z-10 max-h-[90vh] flex flex-col transition-all duration-300"
          >
            {/* Ambient Background Glow Effect */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#d91b5c]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#d91b5c]/5 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="relative p-4 sm:p-5 md:p-6 border-b border-white/5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-[#d91b5c] text-[11px] md:text-xs font-semibold tracking-wider uppercase mb-1">
                  <Sparkles className="w-3 h-3 md:w-3.5 md:h-3.5" />
                  <span>Amerisalon Desk</span>
                </div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight">
                  Add Walk-In Booking
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 sm:p-2 rounded-full bg-white/5 text-stone-400 hover:text-white hover:bg-white/10 transition-colors duration-200"
                aria-label="Close modal"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5 custom-scrollbar">
              
              {/* Customer Name */}
              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-medium text-stone-300">
                  Customer Name <span className="text-[#d91b5c]">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm bg-[#242424] border border-white/10 rounded-xl text-white placeholder-stone-600 focus:outline-none focus:border-[#d91b5c] focus:ring-1 focus:ring-[#d91b5c] transition-all duration-200"
                  />
                </div>
              </div>

              {/* Grid Wrapper for Phone and Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Phone Number */}
                <div className="space-y-1.5">
                  <label className="block text-xs sm:text-sm font-medium text-stone-300">
                    Phone Number <span className="text-[#d91b5c]">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs sm:text-sm font-medium text-stone-500">+91</span>
                    <input
                      type="tel"
                      name="phone"
                      required
                      pattern="[0-9]{10}"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="9876543210"
                      className="w-full pl-12 pr-4 py-2.5 sm:py-3 text-sm bg-[#242424] border border-white/10 rounded-xl text-white placeholder-stone-600 focus:outline-none focus:border-[#d91b5c] focus:ring-1 focus:ring-[#d91b5c] transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Email (Optional) */}
                <div className="space-y-1.5">
                  <label className="block text-xs sm:text-sm font-medium text-stone-300">
                    Email <span className="text-[#d91b5c]">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="alex@example.com"
                      className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm bg-[#242424] border border-white/10 rounded-xl text-white placeholder-stone-600 focus:outline-none focus:border-[#d91b5c] focus:ring-1 focus:ring-[#d91b5c] transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Service Selection Dropdown */}
              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-medium text-stone-300">
                  Select Service <span className="text-[#d91b5c]">*</span>
                </label>
                <div className="relative">
                  <select
                    name="serviceId"
                    required
                    value={formData.serviceId}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 sm:py-3 text-sm bg-[#242424] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#d91b5c] focus:ring-1 focus:ring-[#d91b5c] appearance-none cursor-pointer transition-all duration-200"
                  >
                    <option value="" disabled className="text-stone-600">Choose a styling option</option>
                    {servicesList.map((service) => (
                      <option key={service.id} value={service.id} className="bg-[#1a1a1a] text-white">
                        {service.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                </div>
              </div>

              {/* Dynamic Price & Duration Banner */}
              <AnimatePresence mode="wait">
                {formData.serviceId && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    className="overflow-hidden"
                  >
                    <div className="flex justify-between items-center bg-[#2d1720] border border-[#d91b5c]/20 p-3 sm:p-3.5 rounded-xl">
                      <span className="text-xs font-medium text-stone-300">Estimated Summary:</span>
                      <div className="flex gap-4 text-xs font-semibold">
                        <span className="text-stone-300 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#d91b5c]" /> {selectedService?.duration} mins
                        </span>
                        <span className="text-white bg-[#d91b5c] px-2.5 py-0.5 rounded-full text-[11px]">
                          ₹{selectedService?.price}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Grid Wrapper for Date and Time Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Date Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs sm:text-sm font-medium text-stone-300">
                    Date <span className="text-[#d91b5c]">*</span>
                  </label>
                  <div className="relative group">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500 pointer-events-none" />
                    <input
                      type="date"
                      name="date"
                      required
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm bg-[#242424] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#d91b5c] focus:ring-1 focus:ring-[#d91b5c] transition-all duration-200 scheme-dark custom-calendar-icon"
                    />
                  </div>
                </div>

                {/* Time Slot Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs sm:text-sm font-medium text-stone-300">
                    Time Slot <span className="text-[#d91b5c]">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="timeSlot"
                      required
                      value={formData.timeSlot}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 sm:py-3 text-sm bg-[#242424] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#d91b5c] focus:ring-1 focus:ring-[#d91b5c] appearance-none cursor-pointer transition-all duration-200"
                    >

                      <option value="" disabled>Select Slot</option>
                      {timeSlots?.map((slot)=> <option value={slot.time} className="bg-[#1a1a1a]">{formatTime12Hour(slot.time)}</option>)}
        
                    </select>
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Action Footer Buttons */}
              <div className="flex flex-col-reverse sm:flex-row gap-2.5 sm:gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-1/2 py-2.5 sm:py-3 rounded-xl border border-white/10 text-stone-300 hover:bg-white/5 font-medium text-xs sm:text-sm transition-all duration-200 cursor-pointer active:scale-[0.98]"
                >
                  Save as Draft
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-1/2 py-2.5 sm:py-3 rounded-xl bg-[#d91b5c] text-white hover:bg-[#c21450] font-semibold text-xs sm:text-sm transition-all duration-200 cursor-pointer shadow-lg shadow-[#d91b5c]/20 active:scale-[0.98]"
                >
                  Add Booking
                </button>
              </div>

            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}