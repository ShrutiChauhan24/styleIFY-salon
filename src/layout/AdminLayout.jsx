import React from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';

const AdminLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen w-full bg-[#0F0F0F] text-stone-100 overflow-x-hidden">
      {/* 1. FIXED/RESPONSIVE ADMIN SIDEBAR */}
      <AdminSidebar />

      {/* 2. DYNAMIC CONTENT INNER CONTAINER WRAPPER */}
      {/* Changed overflow-y-auto to isolated block flow so scrolling doesn't stall on mobile viewports */}
      <main className="flex-grow min-w-0 w-full flex flex-col pt-16 md:pt-0">
        <div className="w-full flex-grow mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;