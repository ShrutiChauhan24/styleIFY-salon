import React, { useEffect, useState } from 'react';
import { X, User, Phone, Mail, Calendar, Clock, CheckCircle, Save, CreditCard } from 'lucide-react';
import { collection, doc, getDoc, getDocs, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { db } from '../../firebase';
import {toast} from "react-toastify";
import { addMinutes } from '../../helper/addMinutes';
import { formatTime12Hour } from '../../helper/formatTime12Hour';
import { generateSlots } from '../../helper/generateSlots';
import { buildSlotsStatus } from '../../helper/buildSlotsStatus';

export default function EditBookingDrawer({ isOpen, onClose, bookingData,fetchBookings }) {
  const [formData, setFormData] = useState(bookingData);
  const [servicesList, setServicesList] = useState([]);
  const [settings,setSettings] = useState(null);
  const [timeSlots,setTimeSlots] = useState([])

useEffect(() => {
  if (bookingData) {
    setFormData(bookingData);
  }
}, [bookingData]);

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCustomerChange = (e) => {
  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    customer: {
      ...prev.customer,
      [name]: value,
    },
  }));
};

   useEffect(() => {
  if (!formData?.date || !settings) return;

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
  .map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
  .filter((booking) =>
    ["confirmed", "completed"].includes(
      booking.bookingStatus?.toLowerCase()
    )
  );

    const allSlots = generateSlots(
      settings?.openingTime,
      settings?.closingTime,
      settings?.slotDuration
    );

      const currentDuration =
    formData?.service?.duration ||
    bookingData?.service?.duration;

  const availableSlots = allSlots.filter((slotTime) => {

  const bookingStart = toMinutes(slotTime);

  const bookingEnd = bookingStart + currentDuration;

  // salon hours
  if (
    bookingEnd >
    toMinutes(settings.closingTime)
  ) {
    return false;
  }

  // blocked slots
  if (
    blockedTimes.includes(slotTime) &&
    slotTime !== bookingData.startTime
  ) {
    return false;
  }

  // overlap check
  const hasOverlap = bookedDocs.some((booking) => {

    // ignore current booking
    if (booking.id === bookingData.id) {
      return false;
    }

    const existingStart = toMinutes(
      booking.startTime
    );

    const existingEnd = toMinutes(
      booking.endTime
    );

    return (
      bookingStart < existingEnd &&
      bookingEnd > existingStart
    );
  });

  return !hasOverlap;
});

setTimeSlots(
  availableSlots.map((slot) => ({
    time: slot,
  }))
);
  };

  fetchAvailableSlots();
}, [formData?.date, settings]);

const toMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

  const handleSubmit = async (e) => {
    e.preventDefault();
   try {
    const validService = servicesList.find(
    service => service.id === formData?.service.id
  );

    if(!formData?.customer.name.trim() || 
       !formData?.customer.phone || 
       !formData?.customer.email ||
       !validService||
       !formData?.date ||
       !formData?.startTime ||
       !formData?.bookingStatus ||
       !formData?.paymentStatus
      ){
        toast.error("Please fill all required fields");
        return;
      }

      //date
           const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      
          if (!dateRegex.test(formData?.date)) {
            toast.error("Invalid booking date");
            return;
          }
      
          const selectedDate = new Date(`${formData?.date}T00:00:00`);
      
          if (isNaN(selectedDate.getTime())) {
            toast.error("Invalid booking date");
            return;
          }
      
          const today = new Date();
          today.setHours(0, 0, 0, 0);
      
           const isDateChanged =
  formData?.date !== bookingData?.date;

if (isDateChanged && selectedDate < today) {
  toast.error("Booking date cannot be in the past");
  return;
}
      
          const maxDays = settings?.maxAdvanceBookingDays ?? 30;
      
          const lastAllowedDate = new Date(today);
          lastAllowedDate.setDate(lastAllowedDate.getDate() + maxDays);
      
          if (selectedDate > lastAllowedDate) {
            toast.error(
              `Bookings can only be made up to ${maxDays} days in advance`
            );
            return;
          }

          // time
           const endTime = addMinutes(
             formData.startTime,
             formData?.service.duration
          );
          
          const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
          
          if (!timeRegex.test(formData.startTime)) {
            toast.error("Invalid start time");
            return;
          }
          
          if (!timeRegex.test(endTime)) {
            toast.error("Invalid end time");
            return;
          }

          const bookingStart = toMinutes(formData.startTime);
          const bookingEnd = toMinutes(endTime);
          
          const salonOpen = toMinutes(settings?.openingTime);
          const salonClose = toMinutes(settings?.closingTime);
          
          if (
            bookingStart < salonOpen ||
            bookingEnd > salonClose
          ) {
            toast.error("Booking falls outside salon hours");
            return;
          }
          
          if (bookingStart >= bookingEnd){
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
          
          if (
        blockedTimes.includes(formData.startTime) &&
        formData.startTime !== bookingData.startTime
){
  toast.error("This slot is blocked");
  return;
}
          
          const hasOverlap = bookedSnapshot.docs.some((docSnap) => {
                if (docSnap.id === formData.id) {
               return false;
              }

            const booking = docSnap.data();
          
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

          const oldStatus = bookingData?.bookingStatus?.toLowerCase();
       const newStatus = formData?.bookingStatus?.toLowerCase();

          if (!["confirmed", "completed", "cancelled"].includes(newStatus)) {
  toast.error("Incorrect status");
  return;
}

// Completed is final
if (oldStatus === "completed" && newStatus !== "completed") {
  toast.error("Completed bookings cannot be changed");
  return;
}

// Cancelled is final
if (oldStatus === "cancelled" && newStatus !== "cancelled") {
  toast.error("Cancelled bookings cannot be changed");
  return;
}

           if(!["pending","paid"].includes(formData?.paymentStatus)){
            toast.error("Incorrect payment status");
            return;
          }

          const nameRegex = /^[A-Za-z\s]{2,50}$/;
          
          if (!nameRegex.test(formData?.customer.name.trim())) {
            toast.error("Please enter a valid name");
            return;
          }
          
          const phoneRegex = /^[6-9]\d{9}$/;
          
          if (!phoneRegex.test(formData?.customer.phone.trim())) {
            toast.error("Please enter a valid 10-digit phone number");
            return;
          }
          
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          
          if (!emailRegex.test(formData?.customer.email.trim())) {
            toast.error("Please enter a valid email address");
            return;
          }
          
           const updatedData = {
             serviceId : formData?.service.id,
           
             service : {
               id : formData?.service.id,
               name: formData?.service.name,
               price: formData?.service.price,
               duration : formData?.service.duration,
               imageUrl: formData?.service.imageUrl
             },
           
             date: formData?.date,
             startTime: formData?.startTime,
             endTime,
           
             customer:{
               name: formData?.customer.name.trim(),
               email: formData?.customer.email.trim(),
               phone: formData?.customer.phone.trim()
             },
           
             bookingStatus : formData?.bookingStatus,
             paymentStatus : formData?.paymentStatus,
             updatedAt : serverTimestamp()
           }

           await updateDoc(
             doc(db, "bookings", formData?.id),
             updatedData)

          toast.success("Booking changes updated")
          fetchBookings()
          onClose();
   } catch (error) {
    console.log(error)
      toast.error("Unable to edit booking data, please try again later")
   }
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 ease-in-out ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 right-0 z-50 h-full bg-[#121214] text-gray-100 shadow-2xl 
          border-l border-white/10 flex flex-col transition-transform duration-300 ease-out
          w-full sm:w-[440px] md:w-[500px] lg:w-[560px]
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
      
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 sm:px-6 md:px-8 md:py-5">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#e61e53] font-bold sm:text-xs">
              Management Portal
            </span>
            <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl md:text-3xl mt-0.5">
              Edit Booking
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

       
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-6 space-y-6 sm:px-6 md:px-8 md:py-8">
          
        
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 sm:text-sm border-b border-white/5 pb-2">
              Customer Details
            </h3>
            
    
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-300 sm:text-sm">Customer Name</label>
              <div className="relative group">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#e61e53] transition-colors" />
                <input
                  type="text"
                  name="name"
                  value={formData?.customer.name}
                  onChange={handleCustomerChange}
                  className="w-full bg-[#1a1a1e] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:border-[#e61e53] focus:ring-1 focus:ring-[#e61e53] transition-all"
                  placeholder="Enter full name"
                  required
                />
              </div>
            </div>

            {/* Phone Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-300 sm:text-sm">Phone Number</label>
              <div className="relative group">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#e61e53] transition-colors" />
                <input
                  type="tel"
                  name="phone"
                  value={formData?.customer.phone}
                  onChange={handleCustomerChange}
                  className="w-full bg-[#1a1a1e] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:border-[#e61e53] focus:ring-1 focus:ring-[#e61e53] transition-all"
                  placeholder="Enter phone number"
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-300 sm:text-sm">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#e61e53] transition-colors" />
                <input
                  type="email"
                  name="email"
                  value={formData?.customer.email}
                  onChange={handleCustomerChange}
                  className="w-full bg-[#1a1a1e] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:border-[#e61e53] focus:ring-1 focus:ring-[#e61e53] transition-all"
                  placeholder="Enter email address"
                  required
                />
              </div>
            </div>
          </div>

    
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 sm:text-sm border-b border-white/5 pb-2">
              Appointment Info
            </h3>

           
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-300 sm:text-sm">Service</label>
              <div className="relative">
                <select
                  name="service"
                  value={formData?.service?.id || ""}
                  onChange={(e) => {
  const selected = servicesList.find(
    s => s.id === e.target.value
  );

  setFormData(prev => ({
    ...prev,
    service: {
      id: selected.id,
      name: selected.name,
      duration: selected.duration,
      price: selected.price,
      imageUrl:selected.imageUrl
    }
  }));
}}
                  className="w-full bg-[#1a1a1e] border border-white/10 rounded-xl px-4 py-2.5 text-sm sm:text-base text-white appearance-none focus:outline-none focus:border-[#e61e53] focus:ring-1 focus:ring-[#e61e53] transition-all cursor-pointer"
                >
                  <option value="" disabled className="text-stone-600">Choose a styling option</option>
                    {servicesList.map((service) => (
                      <option key={service.id} value={service.id} className="bg-[#1a1a1a] text-white">
                        {service.name}
                      </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
                  <span className="text-xs sm:text-sm">▼</span>
                </div>
              </div>
            </div>

            {/* Date Picker Component */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-300 sm:text-sm">Date 📅</label>
              <div className="relative group">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#e61e53] pointer-events-none" />
                <input
                  type="date"
                  name="date"
                  value={formData?.date}
                  onChange={handleChange}
                  className="w-full bg-[#1a1a1e] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm sm:text-base text-white focus:outline-none focus:border-[#e61e53] focus:ring-1 focus:ring-[#e61e53] transition-all [color-scheme:dark] cursor-pointer"
                  required
                />
              </div>
            </div>

            {/* Time Slot Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-300 sm:text-sm">Time Slot</label>
              <div className="relative">
                <select
                  name="startTime"
                  value={formData?.startTime}
                  onChange={handleChange}
                  className="w-full bg-[#1a1a1e] border border-white/10 rounded-xl px-4 py-2.5 text-sm sm:text-base text-white appearance-none focus:outline-none focus:border-[#e61e53] focus:ring-1 focus:ring-[#e61e53] transition-all cursor-pointer"
                > 
                  {timeSlots?.map((slot)=><option value={slot.time}>{formatTime12Hour(slot.time)}</option>)}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
                  <span className="text-xs sm:text-sm">▼</span>
                </div>
              </div>
            </div>

            {/* Status Dropdown */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-300 sm:text-sm">Status</label>
              <div className="relative">
                <select
                  name="bookingStatus"
                  value={formData?.bookingStatus}
                  onChange={handleChange}
                  className="w-full bg-[#1a1a1e] border border-white/10 rounded-xl px-4 py-2.5 text-sm sm:text-base text-white appearance-none focus:outline-none focus:border-[#e61e53] focus:ring-1 focus:ring-[#e61e53] transition-all cursor-pointer"
                >
                  <option value="confirmed">🟢 Confirmed</option>
                  <option value="completed">🔵 Completed</option>
                  <option value="cancelled">🔴 Cancelled</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
                  <span className="text-xs sm:text-sm">▼</span>
                </div>
              </div>
            </div>

            {/* Payment Status Dropdown */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-300 sm:text-sm">Payment Status</label>
              <div className="relative">
                <select
                  name="paymentStatus"
                  value={formData?.paymentStatus}
                  onChange={handleChange}
                  className="w-full bg-[#1a1a1e] border border-white/10 rounded-xl px-4 py-2.5 text-sm sm:text-base text-white appearance-none focus:outline-none focus:border-[#e61e53] focus:ring-1 focus:ring-[#e61e53] transition-all cursor-pointer"
                >
                  <option value="paid">💳 Paid</option>
                  <option value="pending">⏳ Pending</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
                  <span className="text-xs sm:text-sm">▼</span>
                </div>
              </div>
            </div>

          </div>

           {/* Fixed Footer Action Section */}
        <div className="p-4 bg-[#161619] border-t border-white/5 flex gap-3 sm:p-6 md:px-8">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-transparent border border-white/10 text-white font-medium rounded-xl py-2.5 text-sm sm:text-base hover:bg-white/5 transition-colors cursor-pointer text-center"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 bg-[#e61e53] hover:bg-[#cf1445] text-white font-medium rounded-xl py-2.5 text-sm sm:text-base shadow-lg shadow-[#e61e53]/20 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4 sm:w-5 sm:h-5" />
            Save Changes
          </button>
        </div>
        </form>

       
      </div>
    </>
  );
}