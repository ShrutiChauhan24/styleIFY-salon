import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { formatTime12Hour } from "../helper/formatTime12Hour";
import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  where,
  getDoc,
  addDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { generateSlots } from "../helper/generateSlots";
import { buildSlotsStatus } from "../helper/buildSlotsStatus";
import { toast } from "react-toastify";
import { addMinutes } from "../helper/addMinutes";
import { sendBookingEmail } from "../helper/sendBookingEmail";

const BookingPage = () => {
  const navigate = useNavigate();
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [bookingDate, setBookingDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [settings, setSettings] = useState(null);
  const [servicesList, setServicesList] = useState([]);
  const location = useLocation();
  const preselectedServiceId = location.state?.serviceId;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      const snapshot = await getDocs(collection(db, "services"));

      const services = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setServicesList(services);

      if (preselectedServiceId) {
        const service = services.find((s) => s.id === preselectedServiceId);

        if (service) {
          setSelectedService(service);
        }
      }
    };

    fetchServices();
  }, [preselectedServiceId]);

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
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (!bookingDate || !settings) return;

    const fetchAvailableSlots = async () => {
      if (
        !settings?.openingTime ||
        !settings?.closingTime ||
        !settings?.slotDuration
      ) {
        return;
      }

      const blockedSnapshot = await getDocs(
        query(collection(db, "blockedSlots"), where("date", "==", bookingDate)),
      );

      const blockedTimes = blockedSnapshot.docs.map(
        (doc) => doc.data().slotTime,
      );

      const bookedTimes = new Set();

      const bookedQuery = query(
        collection(db, "bookings"),
        where("date", "==", bookingDate),
      );

      const snapshotBookings = await getDocs(bookedQuery);

      const bookedDocs = snapshotBookings.docs
        .map((doc) => doc.data())
        .filter((booking) =>
          ["confirmed", "completed"].includes(
            booking.bookingStatus?.toLowerCase(),
          ),
        );

      bookedDocs.forEach((booking) => {
        let current = booking.startTime;

        while (current < booking.endTime) {
          bookedTimes.add(current);

          current = addMinutes(current, settings.slotDuration);
        }
      });

      const allSlots = generateSlots(
        settings?.openingTime,
        settings?.closingTime,
        settings?.slotDuration,
      );

      const slotsStatus = buildSlotsStatus({
        date: bookingDate,
        allSlots,
        blockedTimes,
        bookedTimes: [...bookedTimes],
      });

      let availableSlots = slotsStatus.filter(
        (slot) => slot.status === "available",
      );

      const isToday = bookingDate === getTodayString();

      if (isToday) {
        const now = new Date();

        const currentMinutes =
          now.getHours() * 60 + now.getMinutes() + settings.slotDuration;

        availableSlots = availableSlots.filter(
          (slot) => toMinutes(slot.time) >= currentMinutes,
        );
      }

      setTimeSlots(availableSlots);
    };

    fetchAvailableSlots();
  }, [bookingDate, settings]);

  const toMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const settingsDoc = await getDoc(doc(db, "salonSettings", "config"));

      const latestSettings = settingsDoc.data();

      const {
        openingTime,
        closingTime,
        slotDuration,
        maxAdvanceBookingDays,
        allowSameDayBooking,
        sendEmailBookingConfirmation,
      } = latestSettings;

      const validService = servicesList.find(
        (service) => service.id === selectedService?.id,
      );

      if (
        !validService ||
        !bookingDate ||
        !selectedTime ||
        !customerDetails.name.trim() ||
        !customerDetails.phone ||
        !customerDetails.email
      ) {
        toast.error(
          "Please fill in all the required booking tokens to reserve your slot.",
        );
        return;
      }

      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

      if (!dateRegex.test(bookingDate)) {
        toast.error("Invalid booking date");
        return;
      }

      const selectedDate = new Date(`${bookingDate}T00:00:00`);

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

      const isToday = bookingDate === getTodayString();

      if (allowSameDayBooking === false && isToday) {
        toast.error("Same-day bookings are disabled");
        return;
      }

      if (isToday) {
        const now = new Date();

        const currentMinutes =
          now.getHours() * 60 + now.getMinutes() + slotDuration;

        if (toMinutes(selectedTime) < currentMinutes) {
          toast.error(
            `Please select a time at least ${slotDuration} minutes from now`,
          );
          return;
        }
      }

      const maxDays = maxAdvanceBookingDays ?? 30;

      const lastAllowedDate = new Date(today);
      lastAllowedDate.setDate(lastAllowedDate.getDate() + maxDays);

      if (selectedDate > lastAllowedDate) {
        toast.error(
          `Bookings can only be made up to ${maxDays} days in advance`,
        );
        return;
      }

      const endTime = addMinutes(selectedTime, selectedService?.duration);

      const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

      if (!timeRegex.test(selectedTime)) {
        toast.error("Invalid start time");
        return;
      }

      if (!timeRegex.test(endTime)) {
        toast.error("Invalid end time");
        return;
      }

      const bookingStart = toMinutes(selectedTime);
      const bookingEnd = toMinutes(endTime);

      const salonOpen = toMinutes(openingTime);
      const salonClose = toMinutes(closingTime);

      if (bookingStart < salonOpen || bookingEnd > salonClose) {
        toast.error("Booking falls outside salon hours");
        return;
      }

      if (bookingStart >= bookingEnd) {
        toast.error("Invalid booking duration");
        return;
      }

      const blockedSnapshot = await getDocs(
        query(collection(db, "blockedSlots"), where("date", "==", bookingDate)),
      );

      const bookedSnapshot = await getDocs(
        query(collection(db, "bookings"), where("date", "==", bookingDate)),
      );

      const blockedTimes = blockedSnapshot.docs.map(
        (doc) => doc.data().slotTime,
      );

      if (blockedTimes.includes(selectedTime)) {
        toast.error("This slot is blocked");
        return;
      }

      const hasOverlap = bookedSnapshot.docs.some((doc) => {
        const booking = doc.data();

        const existingStart = toMinutes(booking.startTime);
        const existingEnd = toMinutes(booking.endTime);

        return bookingStart < existingEnd && bookingEnd > existingStart;
      });

      if (hasOverlap) {
        toast.error("This slot has already been booked");
        return;
      }

      const nameRegex = /^[A-Za-z\s]{2,50}$/;

      if (!nameRegex.test(customerDetails.name.trim())) {
        toast.error("Please enter a valid name");
        return;
      }

      const phoneRegex = /^[6-9]\d{9}$/;

      if (!phoneRegex.test(customerDetails.phone.trim())) {
        toast.error("Please enter a valid 10-digit phone number");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(customerDetails.email.trim())) {
        toast.error("Please enter a valid email address");
        return;
      }

      console.log({
        selectedTime,
        duration: selectedService.duration,
        endTime,
      });

      const bookingData = {
        serviceId: selectedService.id,

        service: {
          id: selectedService.id,
          name: selectedService.name,
          price: selectedService.price,
          duration: selectedService.duration,
          imageUrl: selectedService.imageUrl,
        },

        date: bookingDate,
        startTime: selectedTime,
        endTime,

        customer: {
          name: customerDetails.name.trim(),
          email: customerDetails.email.trim(),
          phone: customerDetails.phone.trim(),
        },

        bookingStatus: "confirmed",
        paymentStatus: "pending",

        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const newBooking = await addDoc(collection(db, "bookings"), bookingData);

      if (sendEmailBookingConfirmation) {
        console.log("sendBookingEmail called");
        await sendBookingEmail({
          bookingId: newBooking.id,
          ...bookingData,
        });
      }

      navigate("/booking-confirmed", {
        state: {
          booking: {
            id: newBooking.id,
            service: bookingData.service,
            date: bookingData.date,
            time: bookingData.startTime,
            customer: {
              name: bookingData.customer.name,
              phone: bookingData.customer.phone,
              email: bookingData.customer.email,
            },
          },
        },
      });
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast.error("Oops! something went wrong");
    }
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="bg-[#0b0b0b] text-white w-full font-sans antialiased min-h-screen flex flex-col pt-[5.5rem] sm:pt-24 md:pt-28 lg:pt-32 xl:pt-36 pb-12 sm:pb-16 md:pb-20 lg:pb-24 xl:pb-28 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">
      <div className="max-w-7xl mx-auto w-full flex flex-col items-center my-auto">
        
    
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-3xl mx-auto flex flex-col items-center mb-8 sm:mb-12 md:mb-14 lg:mb-16 xl:mb-20"
        >
          <motion.span
            variants={itemVariants}
            className="text-[10px] sm:text-xs xl:text-sm tracking-[0.25em] uppercase text-[#e91e63] font-semibold bg-[#e91e63]/5 border border-[#e91e63]/20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full mb-3 sm:mb-4"
          >
            Reservations
          </motion.span>
          <motion.h1
            variants={itemVariants}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light tracking-tight text-stone-100"
          >
            Book Your{" "}
            <span className="font-normal text-[#e91e63]">Appointment</span>
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-stone-400 text-xs sm:text-sm md:text-base xl:text-lg font-light leading-relaxed mt-2 sm:mt-4 px-2 max-w-2xl"
          >
            Choose your service, preferred date, and time to reserve your slot.
          </motion.p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
          className="w-full bg-[#121212] rounded-xl sm:rounded-2xl xl:rounded-3xl border border-stone-900/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden grid grid-cols-1 lg:grid-cols-12"
        >
          
          <div className="lg:col-span-7 p-5 sm:p-8 md:p-10 xl:p-14 space-y-6 sm:space-y-8 md:space-y-10 border-b lg:border-b-0 lg:border-r border-stone-900">
         
            <div className="flex flex-col gap-2 sm:gap-3">
              <label className="text-[10px] sm:text-xs xl:text-sm font-semibold tracking-widest text-[#e91e63] uppercase">
                Step 1: Select Service
              </label>
              <div className="relative">
                <select
                  value={selectedService?.id || ""}
                  onChange={(e) => {
                    const selected = servicesList.find(
                      (s) => s.id === e.target.value,
                    );
                    setSelectedService(selected || null);
                  }}
                  className="w-full bg-[#181818] border border-stone-800 text-stone-200 rounded-xl px-4 py-3 sm:py-3.5 xl:py-4 text-xs sm:text-sm xl:text-base focus:outline-none focus:border-[#e91e63] transition-colors duration-300 appearance-none cursor-pointer font-light"
                >
                  <option value="">Select a service</option>
                  {servicesList.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} (₹{service.price})
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-stone-500 text-xs sm:text-sm">
                  ▼
                </div>
              </div>

              <AnimatePresence mode="wait">
                {selectedService && (
                  <motion.div
                    key={selectedService.id}
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="mt-1 bg-stone-950/40 border border-stone-900/60 rounded-xl p-3 sm:p-4 flex justify-between items-center text-stone-400 overflow-hidden"
                  >
                    <div className="flex flex-col">
                      <span className="text-[9px] sm:text-[10px] xl:text-xs text-stone-500 uppercase tracking-wider font-mono">
                        Duration
                      </span>
                      <span className="text-xs sm:text-sm md:text-base xl:text-lg text-stone-300 font-light mt-0.5">
                        {selectedService?.duration} mins
                      </span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-[9px] sm:text-[10px] xl:text-xs text-stone-500 uppercase tracking-wider font-mono">
                        Price
                      </span>
                      <span className="text-xs sm:text-sm md:text-base xl:text-lg text-[#e91e63] font-semibold mt-0.5">
                        ₹{selectedService?.price}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

      
            <div className="flex flex-col gap-2 sm:gap-3">
              <label className="text-[10px] sm:text-xs xl:text-sm font-semibold tracking-widest text-[#e91e63] uppercase">
                Step 2: Select Date
              </label>
              <input
                type="date"
                min={getTodayString()}
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                required
                className="w-full bg-[#181818] border border-stone-800 text-stone-200 rounded-xl px-4 py-3 sm:py-3.5 xl:py-4 text-xs sm:text-sm xl:text-base focus:outline-none focus:border-[#e91e63] transition-colors duration-300 cursor-pointer font-light [color-scheme:dark]"
              />
            </div>

            <div className="flex flex-col gap-2 sm:gap-3">
              <label className="text-[10px] sm:text-xs xl:text-sm font-semibold tracking-widest text-[#e91e63] uppercase">
                Step 3: Select Time Slot
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                <AnimatePresence mode="popLayout">
                  {timeSlots.map((slot, index) => {
                    const isSelected = selectedTime === slot.time;
                    const isDisabled =
                      slot.status === "booked" || slot.status === "blocked";

                    return (
                      <motion.button
                        key={slot.time}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => setSelectedTime(slot.time)}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.2) }}
                        className={`py-2.5 sm:py-3 xl:py-3.5 rounded-xl font-mono text-center text-xs sm:text-sm xl:text-base tracking-wide transition-all duration-300 cursor-pointer border
                          ${
                            isSelected
                              ? "bg-[#e91e63] text-white border-[#e91e63] shadow-[0_4px_12px_rgba(233,30,99,0.3)] scale-[1.02]"
                              : isDisabled
                                ? "bg-stone-900/40 border-stone-900/60 text-stone-600 line-through cursor-not-allowed"
                                : "bg-[#181818] border-stone-850 text-stone-400 hover:text-stone-100 hover:border-stone-700"
                          }`}
                      >
                        {formatTime12Hour(slot.time)}
                      </motion.button>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>

        
            <div className="flex flex-col gap-4">
              <label className="text-[10px] sm:text-xs xl:text-sm font-semibold tracking-widest text-[#e91e63] uppercase border-b border-stone-900 pb-2">
                Step 4: Customer Details
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] sm:text-xs xl:text-sm text-stone-400 font-light">
                    Full Name *
                  </span>
                  <input
                    type="text"
                    name="name"
                    value={customerDetails.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Shruti Chauhan"
                    className="w-full bg-[#181818] border border-stone-800 text-stone-200 rounded-xl px-4 py-2.5 sm:py-3 xl:py-3.5 text-xs sm:text-sm xl:text-base focus:outline-none focus:border-[#e91e63] transition-colors duration-300 font-light"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] sm:text-xs xl:text-sm text-stone-400 font-light">
                    Phone Number *
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    value={customerDetails.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full bg-[#181818] border border-stone-800 text-stone-200 rounded-xl px-4 py-2.5 sm:py-3 xl:py-3.5 text-xs sm:text-sm xl:text-base focus:outline-none focus:border-[#e91e63] transition-colors duration-300 font-light"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] sm:text-xs xl:text-sm text-stone-400 font-light">
                  Email Address (Optional)
                </span>
                <input
                  type="email"
                  name="email"
                  value={customerDetails.email}
                  onChange={handleInputChange}
                  placeholder="name@example.com"
                  className="w-full bg-[#181818] border border-stone-800 text-stone-200 rounded-xl px-4 py-2.5 sm:py-3 xl:py-3.5 text-xs sm:text-sm xl:text-base focus:outline-none focus:border-[#e91e63] transition-colors duration-300 font-light"
                />
              </div>
            </div>
          </div>

          
          <div className="lg:col-span-5 bg-[#161616] p-5 sm:p-8 md:p-10 xl:p-14 flex flex-col justify-between gap-10 lg:gap-0">
            <div className="space-y-6 sm:space-y-8">
              <div className="border-b border-stone-900 pb-3 sm:pb-4 flex items-center justify-between">
                <h3 className="text-[11px] sm:text-xs xl:text-sm tracking-widest uppercase font-semibold text-stone-300">
                  Booking Summary
                </h3>
                <span className="w-2 h-2 rounded-full bg-[#e91e63] shadow-[0_0_10px_#e91e63]" />
              </div>

              <div className="space-y-3 sm:space-y-4 font-light">
                <div className="flex flex-col bg-[#121212]/40 p-3 sm:p-4 rounded-xl border border-stone-900/60">
                  <span className="text-[9px] sm:text-[10px] xl:text-xs text-stone-500 uppercase tracking-wider font-mono">
                    Selected Service
                  </span>
                  <span className="text-stone-200 text-xs sm:text-sm xl:text-base mt-1 truncate font-normal">
                    {selectedService?.name || "---"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex flex-col bg-[#121212]/40 p-3 sm:p-4 rounded-xl border border-stone-900/60">
                    <span className="text-[9px] sm:text-[10px] xl:text-xs text-stone-500 uppercase tracking-wider font-mono">
                      Date
                    </span>
                    <span className="text-stone-200 text-xs sm:text-sm xl:text-base mt-1 truncate font-normal">
                      {bookingDate
                        ? new Date(bookingDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                          })
                        : "---"}
                    </span>
                  </div>
                  <div className="flex flex-col bg-[#121212]/40 p-3 sm:p-4 rounded-xl border border-stone-900/60">
                    <span className="text-[9px] sm:text-[10px] xl:text-xs text-stone-500 uppercase tracking-wider font-mono">
                      Time Slot
                    </span>
                    <span className="text-stone-200 text-xs sm:text-sm xl:text-base mt-1 truncate font-normal">
                      {selectedTime || "---"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col bg-[#121212]/40 p-3 sm:p-4 rounded-xl border border-stone-900/60">
                  <span className="text-[9px] sm:text-[10px] xl:text-xs text-stone-500 uppercase tracking-wider font-mono">
                    Duration Estimate
                  </span>
                  <span className="text-stone-300 text-xs sm:text-sm xl:text-base mt-1 font-normal">
                    {selectedService ? `${selectedService.duration} mins` : "---"}
                  </span>
                </div>
              </div>
            </div>

       
            <div className="pt-5 sm:pt-6 border-t border-stone-900 space-y-4 sm:space-y-6">
              <div className="flex items-baseline justify-between">
                <span className="text-xs sm:text-sm xl:text-base font-light text-stone-400">
                  Total Amount Due
                </span>
                <span className="text-xl sm:text-2xl md:text-3xl xl:text-4xl tracking-tight text-stone-100 font-light">
                  {selectedService ? `₹${selectedService.price}` : "₹0"}
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 shadow-[0_4px_12px_rgba(233,30,99,0.2)] hover:shadow-[0_6px_20px_rgba(233,30,99,0.35)] active:scale-[0.99] cursor-pointer
                  ${
                    loading
                      ? "bg-gray-500 cursor-not-allowed opacity-70"
                      : "bg-[#e91e63] hover:bg-[#d81b60] text-white"
                  }`}
              >
                {loading ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        </motion.form>
      </div>
    </section>
  );
};

export default BookingPage;