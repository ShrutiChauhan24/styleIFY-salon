import React, { useState, useEffect, useRef } from "react";
import BookingDetailModal from "./BookingDetailModal";
import EditBookingDrawer from "./EditBookingDrawer";
import { formatTime12Hour } from "../../helper/formatTime12Hour";
import { Scissors } from "lucide-react";

const BookingsList = ({ bookings, fetchBookings}) => {
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const componentContainerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        componentContainerRef.current &&
        !componentContainerRef.current.contains(event.target)
      ) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = (id, e) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  // 3. CAPTURE ACTIONS AND DISPATCH TARGET VALUES TO MODAL OR DRAWER
  const handleAction = (actionType, bookingItem, e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    setActiveMenuId(null);

    if (actionType === "view") {
      setSelectedBooking(bookingItem);
      setIsDetailsOpen(true);
    } else if (actionType === "edit") {
      setEditingBooking(bookingItem);
      setIsEditOpen(true);
    }
  };

  const STATUS_BADGES = {
    confirmed: "bg-blue-500/10 text-blue-400 border-blue-500/20",

    completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",

    cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  return (
    <div ref={componentContainerRef} className="w-full px-2 sm:px-4 xl:px-6">
      {/* DESKTOP LARGE TABLE VIEW */}
      <div className="hidden xl:block overflow-visible rounded-xl border border-[#1a1c1d] bg-[#141617]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[hsl(200,5%,11%)] text-stone-400 text-xs uppercase tracking-wider font-bold bg-[#181a1c]">
              <th className="py-4 px-5">Time</th>
              <th className="py-4 px-5">Date</th>
              <th className="py-4 px-5">Customer</th>
              <th className="py-4 px-5">Service</th>
              <th className="py-4 px-5">Status</th>
              <th className="py-4 px-5 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a1c1d]">
            {bookings?.map((booking) => (
              <tr
                key={booking.id}
                className="hover:bg-[#1c1e21]/40 transition duration-150"
              >
                <td className="py-4 px-5 font-bold text-rose-500 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    {formatTime12Hour(booking.startTime)}
                  </div>
                </td>

                <td className="py-4 px-5 text-stone-300 text-sm font-medium">
                  {new Date(booking.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>

                <td className="py-4 px-5">
                  <div className="flex items-center">
                    <span className="font-bold text-stone-100 text-sm">
                      {booking.customer.name}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-5 text-stone-300 text-sm">
                  <div className="flex items-center gap-2.5">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-zinc-800 flex items-center justify-center">
                      {booking.service?.imageUrl ? (
                        <img
                          src={booking.service.imageUrl}
                          alt={booking.service.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Scissors className="w-5 h-5 text-zinc-400" />
                      )}
                    </div>
                    <span>{booking.service.name}</span>
                  </div>
                </td>
                <td className="py-4 px-5">
                  <span
                    className={`px-2.5 py-1 rounded-md text-[10px] sm:text-xs font-bold uppercase tracking-wider border ${
                      STATUS_BADGES[booking.bookingStatus?.toLowerCase()] ||
                      "bg-stone-500/10 text-stone-400 border-stone-500/20"
                    }`}
                  >
                    {booking.bookingStatus}
                  </span>
                </td>
                <td className="py-4 px-5 text-center relative">
                  <button
                    onClick={(e) => toggleMenu(booking.id, e)}
                    className="text-stone-500 hover:text-stone-300 p-1.5 rounded-lg hover:bg-[#1a1c1d] transition cursor-pointer"
                  >
                    <svg
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      className="w-5 h-5 inline"
                    >
                      <path d="M10 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm0 5.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm1.5 7a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z" />
                    </svg>
                  </button>

                  {/* Dropdown Options */}
                  {activeMenuId === booking.id && (
                    <div className="absolute right-6 top-12 w-36 bg-[#181a1c] border border-[#26292b] rounded-lg shadow-xl py-1 z-40 animate-in fade-in slide-in-from-top-1 duration-100">
                      <button
                        onClick={(e) => handleAction("view", booking, e)}
                        className="w-full text-left px-3.5 py-2 text-xs font-medium text-stone-300 hover:bg-[#202326] hover:text-white transition flex items-center gap-2 cursor-pointer"
                      >
                        View Details
                      </button>
                      <button
                        onClick={(e) => handleAction("edit", booking, e)}
                        className="w-full text-left px-3.5 py-2 text-xs font-medium text-stone-300 hover:bg-[#202326] hover:text-white transition flex items-center gap-2 border-t border-[#1a1c1d] cursor-pointer"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE & TABLET LAYOUT: CARDS VIEW */}
      <div className="xl:hidden grid grid-cols-1 lg:grid-cols-2 gap-4">
        {bookings?.map((booking) => (
          <div
            key={booking.id}
            className="rounded-xl border border-[#1a1c1d] bg-[#141617] p-4 sm:p-5 flex flex-col justify-between gap-3.5 shadow-md"
          >
            <div className="flex items-center justify-between border-b border-[#1a1c1d]/60 pb-3">
              <div className="flex items-center gap-3">
                <div className="space-y-0.5">
                  <h3 className="text-sm sm:text-base font-bold text-stone-100 tracking-wide">
                    {booking.customer.name}
                  </h3>
                  <p className="text-xs font-bold text-rose-500 tracking-wider">
                    {formatTime12Hour(booking.startTime)}
                  </p>
                </div>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                  STATUS_BADGES[booking.bookingStatus?.toLowerCase()] ||
                  "bg-stone-500/10 text-stone-400 border-stone-500/20"
                }`}
              >
                {booking.bookingStatus}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-stone-300 pt-0.5 relative">
              <div className="flex items-center gap-2.5 max-w-[80%]">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-800 flex items-center justify-center shrink-0">
                  {booking.service?.imageUrl ? (
                    <img
                      src={booking.service.imageUrl}
                      alt={booking.service.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Scissors className="w-4 h-4 text-zinc-400" />
                  )}
                </div>
                <span className="text-xs sm:text-sm font-medium tracking-wide text-stone-300 truncate">
                  {booking.service.name}
                </span>
              </div>

              <div className="relative">
                <button
                  onClick={(e) => toggleMenu(booking.id, e)}
                  className="text-stone-500 hover:text-stone-300 p-1.5 rounded-lg hover:bg-[#1a1c1d] transition cursor-pointer"
                >
                  <svg
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    className="w-4 h-4"
                  >
                    <path d="M10 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm0 5.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm1.5 7a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z" />
                  </svg>
                </button>

                {/* Mobile Dropdown Menu */}
                {activeMenuId === booking.id && (
                  <div className="absolute right-0 bottom-8 w-36 bg-[#181a1c] border border-[#26292b] rounded-lg shadow-xl py-1 z-40">
                    <button
                      onClick={(e) => handleAction("view", booking, e)}
                      className="w-full text-left px-3.5 py-2 text-xs font-medium text-stone-300 hover:bg-[#202326] hover:text-white transition cursor-pointer"
                    >
                      View Details
                    </button>
                    <button
                      onClick={(e) => handleAction("edit", booking, e)}
                      className="w-full text-left px-3.5 py-2 text-xs font-medium text-stone-300 hover:bg-[#202326] hover:text-white transition border-t border-[#1a1c1d] cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedBooking && (
        <BookingDetailModal
          isOpen={isDetailsOpen}
          booking={selectedBooking}
          onClose={() => {
            setIsDetailsOpen(false);
            setSelectedBooking(null);
          }}
          onEditClick={() => {
            const dataToEdit = { ...selectedBooking };
            setIsDetailsOpen(false);
            setSelectedBooking(null);

            setEditingBooking(dataToEdit);
            setIsEditOpen(true);
          }}
        />
      )}

      {/* EDIT DRAWER PANEL */}
      <EditBookingDrawer
        isOpen={isEditOpen}
        bookingData={editingBooking}
        fetchBookings={fetchBookings}
        onClose={() => {
          setIsEditOpen(false);
          setEditingBooking(null);
        }}
      />
    </div>
  );
};

export default BookingsList;
