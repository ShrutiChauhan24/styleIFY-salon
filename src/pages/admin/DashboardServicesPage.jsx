import React, { useEffect, useState } from 'react'
import ServicesHeader from '../../components/admin/ServicesHeader'
import ServicesCategoryTabs from '../../components/admin/ServicesCategoryTabs'
import ManageCategories from '../../components/admin/ManageCategories'
import ServicesList from '../../components/admin/ServicesList'
import AddServiceModal from '../../components/admin/AddServiceModal'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../../firebase'



const DashboardServicesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);

      const q = query(collection(db, "services"), orderBy("createdAt", "desc"));

      const snapshot = await getDocs(q);

      const servicesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setServices(servicesData);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <ServicesHeader onAddClick={() => setIsModalOpen(true)}/>

      {/* Main responsive container wrapper */}
      <div className="flex flex-col gap-4 px-4 sm:px-6 md:px-8">
        
        {/* 2. Search & Category Filters Row */}
        <ServicesCategoryTabs />

        {/* 3. Utility Trigger (e.g., Manage Categories Button) */}
        <div className="flex justify-center sm:justify-end">
          <ManageCategories />
        </div>

    
        <div className="mt-2">
          <ServicesList services={services} fetchServices={fetchServices} loading={loading}/>
        </div>

     <AddServiceModal 
       isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        refreshServices={fetchServices}
     />
      </div>
    </>
  )
}

export default DashboardServicesPage;