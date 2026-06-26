import React, { useEffect, useState } from 'react';
import BookingsHeader from '../../components/admin/BookingsHeader';
import BookingTabsComponent from '../../components/admin/BookingTabsComponent';
import BookingsList from '../../components/admin/BookingsList';
import WalkInBookingModal from '../../components/admin/WalkInBookingModal';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

const DashboardBookingsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  useEffect(() => {
  fetchBookings();
}, []);

 const fetchBookings = async () => {
    try {
      const snapshot = await getDocs(collection(db, "bookings"));

      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setBookings(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

const filteredBookings = bookings?.filter((booking) => {
  // Search filter
  const matchesSearch =
    booking.customer.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

  // Date filter
  const matchesDate =
    !selectedDate || booking.date === selectedDate;

  // Tab filter
  let matchesTab = true;

const today = new Date().toLocaleDateString("en-CA");

switch (activeTab) {
 case "Today":
  matchesTab =
    booking.date === today &&
    booking.bookingStatus !== "cancelled";
  break;

case "Upcoming":
  matchesTab =
    booking.bookingStatus === "confirmed" &&
    booking.date >= today;
  break;

case "Completed":
  matchesTab = booking.bookingStatus === "completed";
  break;

case "Cancelled":
  matchesTab = booking.bookingStatus === "cancelled";
  break;

  default:
    matchesTab = true;
}

  return matchesSearch && matchesDate && matchesTab;
});

useEffect(() => {
  if (
    selectedDate &&
    (activeTab === "Today" || activeTab === "Upcoming")
  ) {
    setActiveTab("All");
  }
}, [selectedDate]);

  return (
    <div className="w-full bg-transparent p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-[1600px] mx-auto space-y-6 sm:space-y-8">
        <BookingsHeader onAddWalkIn = {() => setIsModalOpen(true)}/>
        <div className="bg-[#121214] border border-zinc-800/40 rounded-2xl p-4 sm:p-6 shadow-xl space-y-6">
          <BookingTabsComponent 
           activeTab={activeTab}
           setActiveTab={setActiveTab}
           searchQuery={searchQuery}
           setSearchQuery={setSearchQuery}
           selectedDate={selectedDate}
           setSelectedDate={setSelectedDate} 
          />
          <BookingsList bookings={filteredBookings} fetchBookings={fetchBookings}/>
        </div>
      </div>

      <WalkInBookingModal
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default DashboardBookingsPage;