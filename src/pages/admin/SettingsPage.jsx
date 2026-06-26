import React, { useEffect, useState } from 'react'
import SettingsHeader from '../../components/admin/SettingsHeader'
import SalonInfoCard from '../../components/admin/SalonInfoCard'
// import SalonBrandingCard from '../../components/admin/SalonBrandingCard'
import SalonNotificationsCard from '../../components/admin/SalonNotificationsCard'
import BookingPreferencesCard from '../../components/admin/BookingPreferencesCard'
import AdminAccountCard from '../../components/admin/AdminAccountCard'
import {doc,getDoc} from "firebase/firestore";
import { db } from '../../firebase'

const SettingsPage = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      setLoading(true);

      const docRef = doc(db, "salonSettings", "config");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setSettings(docSnap.data());
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <div>
      <SettingsHeader/>

      <SalonInfoCard
      settings={settings}
      loading={loading}
      refreshSettings={fetchSettings}
      />
      {/* <SalonBrandingCard
      settings={settings}
      loading={loading}
      refreshSettings={fetchSettings}
      /> */}
      <SalonNotificationsCard
      settings={settings}
      loading={loading}
      refreshSettings={fetchSettings}
      />
      <BookingPreferencesCard
      settings={settings}
      loading={loading}
      refreshSettings={fetchSettings}
      />
      <AdminAccountCard/>
    </div>
  )
}

export default SettingsPage 
