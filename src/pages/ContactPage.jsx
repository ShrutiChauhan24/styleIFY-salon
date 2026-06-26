import React, { useEffect, useState } from 'react';
import ContactForm from '../components/user/ContactForm';
import SalonMap from '../components/user/SalonMap';
import ChatCTA from '../components/user/ChatCTA';
import {doc, getDoc} from "firebase/firestore";
import {db} from "../firebase";

const ContactPage = () => {
   const [settings, setSettings] = useState(null);

   useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, "salonSettings", "config");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setSettings(docSnap.data());
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchSettings();
  }, []);

  return (
    <main className="w-full min-h-screen bg-[#0f0f10] pt-24 sm:pt-28 md:pt-32 pb-12 overflow-hidden flex flex-col">
      
      {/* Contact Input Form Block */}
      <div className="w-full mb-12 sm:mb-16 md:mb-20 lg:mb-24">
        <ContactForm settings={settings}/>
      </div>

      {/* Embedded Location Map Module */}
      <div className="w-full mb-12 sm:mb-16 md:mb-20 lg:mb-24">
        <SalonMap settings={settings}/>
      </div>

      {/* Action Outreach Chat Trigger */}
      <div className="w-full mt-auto">
        <ChatCTA />
      </div>

    </main>
  );
};

export default ContactPage;