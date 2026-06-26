import React from 'react';
import { motion } from 'framer-motion';
import { 
  CalendarCheck, 
  CalendarDays, 
  CalendarX, 
  Users, 
  TrendingUp, 
  ArrowUpRight 
} from 'lucide-react';

const DashboardStats = ({bookings,todaysBlockedSlots,yesterdayBlockedSlots}) => {

const today = new Date().toLocaleDateString("en-CA");

const todaysBookings = bookings.filter(
  booking =>
    booking.date === today &&
    booking.bookingStatus !== "cancelled"
).length;

const todayDate = new Date();

const next7Days = new Date();
next7Days.setDate(next7Days.getDate() + 7);

const upcomingBookings = bookings.filter((booking) => {
  const bookingDate = new Date(`${booking.date}T00:00:00`);

  return (
    booking.bookingStatus === "confirmed" &&
    bookingDate >= todayDate &&
    bookingDate <= next7Days
  );
}).length;


const currentMonth = new Date().getMonth();
const currentYear = new Date().getFullYear();

const uniqueCustomers = new Set();

bookings.forEach((booking) => {
  const bookingDate = new Date(`${booking.date}T00:00:00`);

  if (
    bookingDate.getMonth() === currentMonth &&
    bookingDate.getFullYear() === currentYear
  ) {
    uniqueCustomers.add(
      booking.customer.phone
    );
  }
});

const totalCustomers = uniqueCustomers.size;


  //comparitons

  const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

const yesterdayString = yesterday.toLocaleDateString("en-CA");

const yesterdayBookings = bookings.filter(
  booking =>
    booking.date === yesterdayString &&
    booking.bookingStatus !== "cancelled"
).length;

const bookingsDiff = todaysBookings - yesterdayBookings;


const previous7DaysBookings = bookings.filter((booking) => {
  const bookingDate = new Date(`${booking.date}T00:00:00`);

  const previousEnd = new Date();
previousEnd.setDate(previousEnd.getDate() - 1);

const previousStart = new Date();
previousStart.setDate(previousStart.getDate() - 7);

  return (
    booking.bookingStatus === "confirmed" &&
    bookingDate >= previousStart &&
    bookingDate <= previousEnd
  );
}).length;

const upcomingDiff =
  upcomingBookings - previous7DaysBookings;


const blockedSlotsDiff =
  todaysBlockedSlots - yesterdayBlockedSlots;


const now = new Date();

const lastMonthDate = new Date(
  currentYear,
  currentMonth - 1,
  1
);

const lastMonth = lastMonthDate.getMonth();
const lastMonthYear = lastMonthDate.getFullYear();

const lastMonthCustomersSet = new Set();

bookings.forEach((booking) => {
  const bookingDate = new Date(`${booking.date}T00:00:00`);

  if (
    bookingDate.getMonth() === lastMonth &&
    bookingDate.getFullYear() === lastMonthYear
  ) {
    lastMonthCustomersSet.add(
      booking.customer.phone
    );
  }
});

const lastMonthCustomers =
  lastMonthCustomersSet.size;

  const customersDiff =
  totalCustomers - lastMonthCustomers;

  const statsData = [
    { id: 1, title: "Today's Bookings", value: todaysBookings, change: bookingsDiff >= 0
  ? `+${bookingsDiff} bookings`
  : `${bookingsDiff} bookings`, timeframe: "vs yesterday", icon: CalendarCheck, highlight: true },
    { id: 2, title: "Upcoming (7 Days)", value:upcomingBookings , change:  upcomingDiff >= 0
  ? `+${upcomingDiff} bookings`
  : `${upcomingDiff} bookings`,timeframe: "vs last week", icon: CalendarDays, highlight: false },
    { id: 3, title: "Blocked Slots", value: todaysBlockedSlots, change: blockedSlotsDiff >= 0
  ? `+${blockedSlotsDiff} blocked slots`
  : `${blockedSlotsDiff} blocked slots`, timeframe: "vs yesterday", icon: CalendarX, highlight: false },
    { id: 4, title: "Total Customers", value: totalCustomers, change: 
    customersDiff >= 0
      ? `+${customersDiff} customers`
      : `${customersDiff} customers`,timeframe: "vs last month", icon: Users, highlight: false },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { y: 16, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 120, damping: 14 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5 lg:gap-6 w-full"
    >
      {statsData.map((stat) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.id}
            variants={itemVariants}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={`relative overflow-hidden rounded-xl md:rounded-2xl p-4 sm:p-5 lg:p-6 flex flex-col justify-between transition-all duration-300 group select-none border w-full min-h-[140px] sm:min-h-[150px]
              ${stat.highlight 
                ? 'bg-gradient-to-br from-[#1E1215] to-[#141414] border-rose-900/40 shadow-[0_12px_30px_rgba(225,29,72,0.06)]' 
                : 'bg-[#141414] border-stone-800/40 hover:border-stone-800 shadow-xl'
              }`}
          >
            {stat.highlight && <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#E11D48] to-transparent" />}

            <div className="flex items-start justify-between w-full gap-3">
              <span className="text-xs sm:text-sm font-medium tracking-wide text-stone-400 font-sans line-clamp-2">
                {stat.title}
              </span>
              <div className={`p-2 rounded-lg sm:rounded-xl transition-colors duration-300 flex-shrink-0
                ${stat.highlight ? 'bg-[#E11D48]/10 text-[#E11D48]' : 'bg-stone-900 text-stone-400 group-hover:text-stone-200'}`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>

            <div className="mt-4 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-stone-100 font-sans">
                {stat.value}
              </span>
              <ArrowUpRight className="w-4 h-4 text-stone-600 group-hover:text-[#E11D48] transition-colors duration-300 self-center hidden sm:block flex-shrink-0" />
            </div>

            <div className="mt-4 pt-3 border-t border-stone-900/60 flex flex-row items-center justify-between gap-2">
              <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold tracking-wide w-max
                ${stat.trend === 'up' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30' : 'bg-stone-900 text-stone-400 border border-stone-800'}`}
              >
                {stat.trend === 'up' && <TrendingUp className="w-3 h-3 text-emerald-400 flex-shrink-0" />}
                <span className="whitespace-nowrap">{stat.change}</span>
              </div>
              <span className="text-[10px] sm:text-xs text-stone-500 font-medium tracking-wide truncate text-right">
                {stat.timeframe}
              </span>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default DashboardStats;