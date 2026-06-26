import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  UserCheck, 
  UserPlus, 
  Search, 
  MoreVertical, 
  Phone, 
  Calendar, 
  Eye, 
  Edit3, 
  Trash2,
  Mail
} from 'lucide-react';
import { collection, doc, getDocs, query, serverTimestamp, where, getDoc, addDoc } from "firebase/firestore";
import {db} from "../../firebase";
import CustomerProfileDrawer from '../../components/admin/CustomerProfileDrawer';

export default function CustomersListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeMenu, setActiveMenu] = useState(null);
const [customers, setCustomers] = useState([]);
const [loading, setLoading] = useState(true);
const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
const [selectedCustomer, setSelectedCustomer] = useState(null);

useEffect(() => {
  const fetchCustomers = async () => {
    try {
      const snapshot = await getDocs(
        collection(db, "bookings")
      );

      const bookings = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      const customersMap = {};

      bookings.forEach((booking) => {
        const phone = booking.customer.phone;

        if (!customersMap[phone]) {
          customersMap[phone] = {
            id: phone,
            name: booking.customer.name,
            phone: booking.customer.phone,
            email: booking.customer.email,
            bookings: [],
          };
        }

        customersMap[phone].bookings.push(booking);
      });

      const customersData = Object.values(customersMap).map(
        (customer) => {
         const today = new Date();

const pastBookings = customer.bookings.filter(
  booking => new Date(booking.date) <= today
);

  const sortedPastBookings = [...pastBookings].sort(
  (a, b) => new Date(b.date) - new Date(a.date)
);

return {
  ...customer,
  totalVisits: pastBookings.length,
  lastVisit: sortedPastBookings[0]?.date || null,
  firstVisit:
    sortedPastBookings[sortedPastBookings.length - 1]?.date || null,

  upcomingAppointments: customer.bookings.filter(
    booking => new Date(booking.date) > today
  ),

   visitHistory: sortedPastBookings,
  status: pastBookings.length > 1 ? "Repeat" : "New",
};
        }
      ) .sort(
    (a, b) =>
      new Date(b.lastVisit) - new Date(a.lastVisit)
  );

      setCustomers(customersData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  fetchCustomers();
}, []);

 const filteredCustomers = customers.filter((customer) => {
  const matchesSearch =
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery);

  const matchesFilter =
    activeFilter === "All" ||
    customer.status === activeFilter;

  return matchesSearch && matchesFilter;
});

const repeatCustomers = customers?.filter(
  customer => customer.totalVisits > 1
).length;

const currentMonth = new Date().getMonth();
const currentYear = new Date().getFullYear();

const newThisMonth = customers?.filter(customer => {
  const firstVisit = new Date(customer.firstVisit);

  return (
    firstVisit.getMonth() === currentMonth &&
    firstVisit.getFullYear() === currentYear
  );
}).length;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.04 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-stone-200 antialiased font-sans p-4 sm:p-6 md:p-8 xl:p-12 selection:bg-[#e61e53]/30">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-[1600px] mx-auto space-y-6 sm:space-y-8 md:space-y-10"
      >
        
        {/* --- SECTION 1: HEADER --- */}
        <motion.div variants={itemVariants} className="flex flex-col gap-2 border-b border-stone-900 pb-5 sm:pb-6">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#e61e53]">
            Workspace Directory
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            Customers
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 max-w-xl font-medium leading-relaxed">
            Manage customer records, monitor loyalty touchpoints, and overview holistic salon appointment histories.
          </p>
        </motion.div>

        {/* --- SECTION 2: FIXED TOP STATS CARDS --- */}
        {/* Changed 'sm:grid-cols-3' to 'md:grid-cols-2 lg:grid-cols-3' to allow comfortable scaling on tablet screens */}
        <motion.div 
          variants={containerVariants} 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          {/* Card 1: Total Customers */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -4, borderColor: 'rgba(230, 30, 83, 0.25)' }}
            className="bg-[#121214] border border-stone-900 rounded-2xl p-5 md:p-6 flex items-start justify-between group transition-all duration-300 shadow-sm"
          >
            <div className="space-y-2.5 min-w-0 flex-1 pr-2">
              <p className="text-[11px] font-bold tracking-wider text-stone-500 uppercase">Total Customers</p>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{customers?.length}</h3>
              <div className="pt-1">
                <span className="inline-flex items-center text-[10px] text-emerald-400 font-bold bg-emerald-950/30 border border-emerald-900/30 px-2 py-0.5 rounded-md whitespace-nowrap">
                  +32 new this month
                </span>
              </div>
            </div>
            <div className="p-3 bg-stone-900/60 rounded-xl border border-stone-800 text-stone-400 group-hover:text-[#e61e53] group-hover:border-[#e61e53]/20 transition-all duration-300 shrink-0">
              <Users className="w-5 h-5" />
            </div>
          </motion.div>

          {/* Card 2: Repeat Customers */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -4, borderColor: 'rgba(230, 30, 83, 0.25)' }}
            className="bg-[#121214] border border-stone-900 rounded-2xl p-5 md:p-6 flex items-start justify-between group transition-all duration-300 shadow-sm"
          >
            <div className="space-y-2.5 min-w-0 flex-1 pr-2">
              <p className="text-[11px] font-bold tracking-wider text-stone-500 uppercase">Repeat Customers</p>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{repeatCustomers}</h3>
              <div className="pt-1">
                <span className="inline-flex items-center text-[10px] text-purple-400 font-bold bg-purple-950/30 border border-purple-900/30 px-2 py-0.5 rounded-md whitespace-nowrap">
                  67.4% retention rate
                </span>
              </div>
            </div>
            <div className="p-3 bg-stone-900/60 rounded-xl border border-stone-800 text-stone-400 group-hover:text-[#e61e53] group-hover:border-[#e61e53]/20 transition-all duration-300 shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
          </motion.div>

          {/* Card 3: New This Month */}
          {/* 'md:col-span-2 lg:col-span-1' keeps this card clean and beautifully balanced when transitioning layouts */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -4, borderColor: 'rgba(230, 30, 83, 0.25)' }}
            className="bg-[#121214] border border-stone-900 rounded-2xl p-5 md:p-6 md:col-span-2 lg:col-span-1 flex items-start justify-between group transition-all duration-300 shadow-sm"
          >
            <div className="space-y-2.5 min-w-0 flex-1 pr-2">
              <p className="text-[11px] font-bold tracking-wider text-stone-500 uppercase">New This Month</p>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{newThisMonth}</h3>
              <div className="pt-1">
                <span className="inline-flex items-center text-[10px] text-amber-400 font-bold bg-amber-950/30 border border-amber-900/30 px-2 py-0.5 rounded-md whitespace-nowrap">
                  vs 98 last month
                </span>
              </div>
            </div>
            <div className="p-3 bg-stone-900/60 rounded-xl border border-stone-800 text-stone-400 group-hover:text-[#e61e53] group-hover:border-[#e61e53]/20 transition-all duration-300 shrink-0">
              <UserPlus className="w-5 h-5" />
            </div>
          </motion.div>
        </motion.div>

        {/* --- SECTION 3: SEARCH + FILTER ROW --- */}
        <motion.div 
          variants={itemVariants} 
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#121214] border border-stone-900/60 p-3 rounded-2xl shadow-sm"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search customer name or phone..."
              className="w-full bg-[#17171a] border border-stone-800/80 rounded-xl pl-11 pr-4 py-2.5 text-xs sm:text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:border-[#e61e53] focus:ring-1 focus:ring-[#e61e53]/30 transition-all"
            />
          </div>

          <div className="flex items-center bg-[#17171a] border border-stone-800/60 p-1 rounded-xl gap-1 overflow-x-auto shrink-0">
            {['All', 'Repeat', 'New'].map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setActiveFilter(filterOption)}
                className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wide transition-all cursor-pointer whitespace-nowrap ${
                  activeFilter === filterOption 
                    ? 'bg-[#e61e53] text-white shadow-md shadow-[#e61e53]/20' 
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/50'
                }`}
              >
                {filterOption}
              </button>
            ))}
          </div>
        </motion.div>

        {/* --- SECTION 4: CUSTOMERS CONTAINER --- */}
        <motion.div variants={itemVariants} className="w-full bg-[#121214] border border-stone-900/80 rounded-2xl overflow-hidden shadow-xl">
          {/* DESKTOP MODE (Visible on Screens >= xl) */}
          <div className="hidden xl:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-900/80 bg-[#161619]/40 text-xs font-bold uppercase tracking-wider text-stone-500">
                  <th className="px-6 py-4.5">Customer</th>
                  <th className="px-6 py-4.5">Phone</th>
                  <th className="px-6 py-4.5">Last Visit</th>
                  <th className="px-6 py-4.5 text-center">Total Visits</th>
                  <th className="px-6 py-4.5 text-center">Status</th>
                  <th className="px-6 py-4.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-900/40 text-sm">
                <AnimatePresence>
                  {filteredCustomers.map((customer) => (
                    <motion.tr 
                      key={customer.id}
                      className="hover:bg-[#161619]/20 transition-colors group"
                    >
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        <div className="flex items-center gap-3.5">
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${customer.avatarColor} border border-stone-800 flex items-center justify-center font-bold text-xs text-[#e61e53] shrink-0`}>
                            {customer.name.charAt(0)}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-stone-200 group-hover:text-white transition-colors tracking-tight">{customer.name}</span>
                            <span className="text-xs text-stone-500 truncate mt-0.5">{customer.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4.5 whitespace-nowrap text-stone-400 font-mono text-xs">
                        {customer.phone}
                      </td>
                      <td className="px-6 py-4.5 whitespace-nowrap text-stone-400 text-xs font-medium">
                        {customer.lastVisit}
                      </td>
                      <td className="px-6 py-4.5 whitespace-nowrap text-center text-white font-bold font-mono text-xs">
                        {customer.totalVisits}
                      </td>
                      <td className="px-6 py-4.5 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          customer.status === 'Repeat'
                            ? 'bg-rose-950/20 border border-rose-900/40 text-[#e61e53]'
                            : 'bg-emerald-950/20 border border-emerald-900/40 text-emerald-400'
                        }`}>
                          {customer.status}
                        </span>
                      </td>
                      <td className="px-6 py-4.5 whitespace-nowrap text-right relative">
                        <button 
                          onClick={() => setActiveMenu(activeMenu === customer.id ? null : customer.id)}
                          className="p-1.5 hover:bg-stone-900 border border-transparent hover:border-stone-800 rounded-lg text-stone-500 hover:text-stone-200 transition-all cursor-pointer"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        {activeMenu === customer.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)} />
                            <div className="absolute right-6 top-11 w-36 bg-[#161619] border border-stone-800 rounded-xl shadow-2xl p-1 z-20 text-left">
                              <button onClick={() => {
    setSelectedCustomer(customer);
    setIsProfileDrawerOpen(true);
    setActiveMenu(null);
  }} className="w-full px-2.5 py-1.5 hover:bg-stone-900 text-xs font-semibold text-stone-300 rounded-lg flex items-center gap-2 transition-colors"><Eye className="w-3.5 h-3.5 text-stone-500" /> View Profile</button>
                              <button className="w-full px-2.5 py-1.5 hover:bg-red-950/20 text-xs font-semibold text-red-400 rounded-lg flex items-center gap-2 transition-colors mt-1"><Trash2 className="w-3.5 h-3.5 text-red-500/60" /> Delete</button>
                            </div>
                          </>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* MOBILE & TABLET CUSTOMER CARDS */}
          <div className="block xl:hidden p-4 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <AnimatePresence>
                {filteredCustomers.map((customer) => (
                  <motion.div 
                    key={customer.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-[#161619]/50 border border-stone-900 rounded-2xl p-5 space-y-5 flex flex-col justify-between transition-all duration-300 hover:border-stone-800/80"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className={`w-11 h-11 rounded-full bg-gradient-to-tr ${customer.avatarColor} border border-stone-800 flex items-center justify-center font-black text-sm text-[#e61e53] shrink-0`}>
                          {customer.name.charAt(0)}
                        </div>  
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-stone-100 text-base tracking-tight truncate">{customer.name}</span>
                          <span className="text-xs text-stone-500 truncate flex items-center gap-1.5 mt-1">
                            <Mail className="w-3.5 h-3.5 text-stone-600 shrink-0" />
                            {customer.email}
                          </span>
                        </div>
                      </div>
                      
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                        customer.status === 'Repeat'
                          ? 'bg-rose-950/20 border border-rose-900/40 text-[#e61e53]'
                          : 'bg-emerald-950/20 border border-emerald-900/40 text-emerald-400'
                      }`}>
                        {customer.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#1b1b1f]/40 border border-stone-900/60 p-3.5 rounded-xl text-xs">
                      <div className="space-y-1">
                        <p className="text-[10px] text-stone-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-stone-600" /> Phone
                        </p>
                        <p className="font-mono text-stone-300 font-medium tracking-wide text-xs">{customer.phone}</p>
                      </div>
                      <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-stone-900/60 pt-2.5 sm:pt-0 sm:pl-3.5">
                        <p className="text-[10px] text-stone-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-stone-600" /> Last Visit
                        </p>
                        <p className="text-stone-300 font-semibold text-xs">{customer.lastVisit}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-stone-900/40 gap-4">
                      <div className="text-xs text-stone-400 font-medium">
                        Total Visits: <span className="font-bold text-white font-mono bg-stone-900 border border-stone-800 px-2 py-0.5 rounded-md ml-1">{customer.totalVisits}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => {
    setSelectedCustomer(customer);
    setIsProfileDrawerOpen(true);
  }} className="px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-800 hover:border-stone-700 text-stone-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer">
                          <Eye className="w-3.5 h-3.5" /> View
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {filteredCustomers.length === 0 && (
            <div className="px-6 py-16 text-center text-xs sm:text-sm text-stone-500 font-medium">
              No salon customers found matching your criteria.
            </div>
          )}
        </motion.div>

      </motion.div>

      <CustomerProfileDrawer
    isOpen={isProfileDrawerOpen}
  onClose={() => {
    setIsProfileDrawerOpen(false);
    setSelectedCustomer(null);
  }}
  customerData={selectedCustomer}
      />
    </div>
  );
}