import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DashboardStats from '../../components/admin/DashboardStats';
import TodaysBookings from '../../components/admin/TodaysBookings';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';

const DashboardPage = () => {
  const [bookings,setBookings] = useState([]);
  const [todaysBlockedSlots, setTodaysBlockedSlots] = useState(0);
  const [yesterdayBlockedSlots, setYesterdayBlockedSlots] = useState(0);
  const [loading,setLoading] = useState(true);
 
  useEffect(() => {
  fetchBookings()
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

useEffect(() => {
  const fetchBlockedSlots = async () => {
    const today = new Date().toLocaleDateString("en-CA");

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const yesterdayString =
      yesterday.toLocaleDateString("en-CA");

    const todaySnapshot = await getDocs(
      query(
        collection(db, "blockedSlots"),
        where("date", "==", today)
      )
    );

    const yesterdaySnapshot = await getDocs(
      query(
        collection(db, "blockedSlots"),
        where("date", "==", yesterdayString)
      )
    );

    setTodaysBlockedSlots(todaySnapshot.size);
    setYesterdayBlockedSlots(yesterdaySnapshot.size);
  };

  fetchBlockedSlots();
}, []);

  return (
    <div className="w-full bg-[#0F0F0F] min-h-screen text-stone-100 flex flex-col items-start justify-start select-none
      p-3.5 sm:p-5 md:p-6 lg:p-8 xl:p-10 
      gap-5 sm:gap-6 lg:gap-8 xl:gap-10"
    >
      
      {/* --- CENTRALIZED WELCOME HEADER --- */}
      <motion.div 
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-0.5 sm:space-y-1 w-full"
      >
        <h1 className="font-bold tracking-tight text-stone-100 font-sans
          text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl"
        >
          Welcome back, Admin
        </h1>
        <p className="font-medium tracking-wide text-stone-400
          text-[11px] sm:text-xs md:text-sm lg:text-base"
        >
          Here's your salon overview for today.
        </p>
      </motion.div>

      {/* --- SECTION 2: STATS CARDS ROW --- */}
      <div className="w-full">
        <DashboardStats bookings={bookings} todaysBlockedSlots={todaysBlockedSlots} yesterdayBlockedSlots={yesterdayBlockedSlots}/>
      </div>

      {/* --- SECTION 3: BOOKINGS SECTION --- */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.12 }}
        className="w-full h-full"
      >
        <TodaysBookings bookings={bookings} fetchBookings={fetchBookings}/>
      </motion.div>

    </div>
  );
};

export default DashboardPage;