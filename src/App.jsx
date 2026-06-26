import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom';
import LayoutWrapper from './layout/LayoutWrapper';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import BookingPage from './pages/BookingPage';
import BookingConfirmed from './pages/BookingConfirmed';
import ContactPage from './pages/ContactPage';
import AdminLayout from './layout/AdminLayout';
import DashboardStats from './components/admin/DashboardStats';
import DashboardPage from './pages/admin/DashboardPage';
import DashboardBookingsPage from './pages/admin/DashboardBookingsPage';
import DashboardServicesPage from './pages/admin/DashboardServicesPage';
import DashboardTimeSlots from './pages/admin/DashboardTimeSlots';
import CustomersListPage from './pages/admin/CustomersListPage';
import SettingsPage from './pages/admin/SettingsPage';
import AdminLogin from './pages/admin/AdminLogin';
import ScrollToTop from './ScrollToTop';
import {ToastContainer} from 'react-toastify';
import ProtectedRoute from './components/ProtectedRoute';

function App() {


  return (
    <>
   <ScrollToTop/>

    <Routes>
     <Route
     path='/'
     element={
      <LayoutWrapper>
        <HomePage/>
      </LayoutWrapper>
     }
     />

     <Route
       path='/services'
     element={
      <LayoutWrapper>
        <ServicesPage/>
      </LayoutWrapper>
     }
     />
      <Route
       path='/book-appointment'
     element={
      <LayoutWrapper>
        <BookingPage/>
      </LayoutWrapper>
     }
     />

    <Route
     path='/booking-confirmed'
     element={
      <LayoutWrapper>
        <BookingConfirmed/>
      </LayoutWrapper>
     }
     />

     <Route
       path='/contact-us'
     element={
      <LayoutWrapper>
        <ContactPage/>
      </LayoutWrapper>
     }
     />

     <Route
      path='/admin/login'
     element={
      <AdminLogin/>
     }
     />

     <Route
      path='/admin/dashboard'
     element={
      <ProtectedRoute>
      <AdminLayout>
       <DashboardPage/>
      </AdminLayout>
      </ProtectedRoute>
     }
     />

      <Route
      path='/admin/all-bookings'
     element={
       <ProtectedRoute>
      <AdminLayout>
       <DashboardBookingsPage/>
      </AdminLayout>
      </ProtectedRoute>
     }
     />

     <Route
      path='/admin/services'
     element={
      <ProtectedRoute>
      <AdminLayout>
       <DashboardServicesPage/>
      </AdminLayout>
      </ProtectedRoute>
     }
     />

     <Route
      path='/admin/slots'
     element={
      <ProtectedRoute>
      <AdminLayout>
       <DashboardTimeSlots/>
      </AdminLayout>
      </ProtectedRoute>
     }
     />

     <Route
      path='/admin/customers'
     element={
      <ProtectedRoute>
      <AdminLayout>
       <CustomersListPage/>
      </AdminLayout>
      </ProtectedRoute>
     }
     />

     <Route
      path='/admin/settings'
     element={
      <ProtectedRoute>
      <AdminLayout>
       <SettingsPage/> 
      </AdminLayout>
      </ProtectedRoute>
     }
     />

    </Routes>

    <ToastContainer/>
    </>
  )
}

export default App;
