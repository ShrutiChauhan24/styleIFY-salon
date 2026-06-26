import React, { useEffect, useState } from 'react'
import TimeSlotHeader from '../../components/admin/TimeSlotHeader'
import SlotsManagement from '../../components/admin/SlotsManagement'
import BlockSlotModal from '../../components/admin/BlockSlotModal'
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";

const DashboardTimeSlots = () => {
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [settings, setSettings] = useState(null);

 useEffect(() => {
  fetchSettings();
}, []);

const fetchSettings = async () => {
  const snap = await getDoc(doc(db, "salonSettings", "config"));

  if (snap.exists()) {
    setSettings(snap.data());
  }
};
  

  return (
    <div className="w-full min-h-screen bg-[#0D0D0E] text-stone-200 select-none 
      p-4 sm:p-6 md:p-8 lg:p-11 xl:p-14
      space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-12"
    >
      <div className="mx-auto w-full max-w-7xl space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-12">
        <TimeSlotHeader onBlockCustomSlotClick={() => setIsModalOpen(true)} settings={settings}/>
        <SlotsManagement settings={settings}/>
      </div>

      <BlockSlotModal
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        settings={settings}
      />
    </div>
  )
}

export default DashboardTimeSlots;