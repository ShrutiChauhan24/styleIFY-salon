import React, { useEffect, useState } from "react";
import {
  MoreVertical,
  Eye,
  Edit2,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from "lucide-react";
import ViewServiceDetailsModal from "./ViewServiceDetailsModal";
import EditServiceModal from "./EditServiceModal";
import { collection, doc, getDocs, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "react-toastify";

export default function ServicesList({services,fetchServices,loading}) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchTerm] = useState("");
  const [selectedCategory] = useState("All");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);


  const getEffectiveStatus = (service) => {
    if (!service.categoryActive) {
      return "Category Disabled";
    }

    return service.status;
  };

  const handleOpenViewDetails = (service) => {
    setSelectedService(service); 
    setIsViewModalOpen(true); 
    setActiveDropdown(null); 
  };

  const handleOpenEditModal = (service) => {
    setEditingService(service);
    setIsEditModalOpen(true);
    setActiveDropdown(null);
  };


  const toggleStatus = async (service) => {
    if (!service.categoryActive) {
      toast.warning(
        "This service cannot be activated because its category is inactive.",
      );
      return;
    }

     const newStatus =
      service.status === "Active"
        ? "Inactive"
        : "Active";

    await updateDoc(
      doc(db, "services", service.id),
      {
        status: newStatus,
        updatedAt: serverTimestamp(),
      }
    );

    setServices(
      services?.map((s) => {
        if (s.id === service.id) {
          return {
            ...s,
            status: newStatus,
          };
        }
        return s;
      }),
    );
    setActiveDropdown(null);
  };

  const deleteService = (id) => {
    setServices(services?.filter((service) => service.id !== id));
    setActiveDropdown(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <p className="text-zinc-400">Loading services...</p>
      </div>
    );
  }

  if (!loading && services?.length === 0) {
    return (
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-10 text-center">
        <p className="text-zinc-400">No services found.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-visible transition-all duration-300">
      {/* 1. LARGE DESKTOP TABLE VIEW (Visible exclusively on xl screens and up -> >= 1280px) */}
      <div className="hidden xl:block bg-[#1a1a1a] border border-gray-800/60 rounded-2xl shadow-2xl shadow-black/40">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-800 bg-[#222222]/40 text-gray-400 text-xs font-semibold tracking-wider uppercase">
              <th className="py-4 px-6 w-20 text-center">Image</th>
              <th className="py-4 px-6 text-sm">Service</th>
              <th className="py-4 px-6 text-sm">Category</th>
              <th className="py-4 px-6 text-sm">Duration</th>
              <th className="py-4 px-6 text-sm">Price</th>
              <th className="py-4 px-6 text-sm">Status</th>
              <th className="py-4 px-6 text-sm text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50 text-sm">
            {services?.filter(
                (s) =>
                  selectedCategory === "All" ||
                  s.categoryId === selectedCategory,
              )
              .filter((s) =>
                s.name.toLowerCase().includes(searchTerm.toLowerCase()),
              )
              .map((service) => (
                <tr
                  key={service.id}
                  className="hover:bg-[#242424]/40 transition-colors duration-200 group"
                >
                  <td className="py-3.5 px-6 whitespace-nowrap">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-gray-800 group-hover:border-gray-700 transition-colors">
                      <img
                        src={service.imageUrl}
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </td>
                  <td className="py-3.5 px-6 whitespace-nowrap font-medium text-white group-hover:text-[#e91e63] transition-colors">
                    {service.name}
                  </td>
                  <td className="py-3.5 px-6 whitespace-nowrap text-gray-400">
                    <span className="bg-[#262626] border border-gray-800 px-2.5 py-1 rounded-lg text-xs font-medium">
                      {service.categoryName}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 whitespace-nowrap text-gray-300">
                    {service.duration} mins
                  </td>
                  <td className="py-3.5 px-6 whitespace-nowrap font-semibold text-white">
                    ₹{service.price}
                  </td>
                  <td className="py-3.5 px-6 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                        !service.categoryActive
                          ? "bg-orange-500/5 border-orange-500/20 text-orange-400"
                          : service.status === "Active"
                            ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
                            : "bg-zinc-500/5 border-zinc-500/20 text-zinc-400"
                      }`}
                    >
                      {!service.categoryActive
                        ? "Category Disabled"
                        : service.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 whitespace-nowrap text-right relative">
                    <button
                      onClick={() =>
                        setActiveDropdown(
                          activeDropdown === service.id ? null : service.id,
                        )
                      }
                      className="p-1.5 hover:bg-[#2d2d2d] rounded-lg transition-colors text-gray-400 hover:text-white"
                    >
                      <MoreVertical size={16} />
                    </button>
                    {activeDropdown === service.id && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setActiveDropdown(null)}
                        />
                        <div className="absolute right-2 top-12 w-44 bg-[#1e1e1e] border border-gray-800 rounded-xl shadow-xl py-1.5 z-20 text-left overflow-hidden">
                          <button
                            onClick={() => handleOpenViewDetails(service)}
                            className="w-full px-3 py-2 text-xs text-gray-300 hover:bg-[#2d2d2d] flex items-center gap-2 transition-colors"
                          >
                            <Eye size={14} /> View Details
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(service)}
                            className="w-full px-3 py-2 text-xs text-gray-300 hover:bg-[#2d2d2d] flex items-center gap-2 transition-colors"
                          >
                            <Edit2 size={14} /> Edit Service
                          </button>
                          <button
                            disabled={!service.categoryActive}
                            onClick={() => toggleStatus(service)}
                            className={`w-full px-3 py-2 text-xs flex items-center gap-2 transition-colors
    ${
      !service.categoryActive
        ? "opacity-40 cursor-not-allowed text-zinc-500"
        : service.status === "Active"
          ? "text-amber-400 hover:bg-amber-500/5"
          : "text-emerald-400 hover:bg-emerald-500/5"
    }
  `}
                          >
                            {service.status === "Active" ? (
                              <ToggleLeft size={14} />
                            ) : (
                              <ToggleRight size={14} />
                            )}

                            {!service.categoryActive
                              ? "Category Disabled"
                              : service.status === "Active"
                                ? "Deactivate"
                                : "Activate"}
                          </button>
                          <div className="h-px bg-gray-800 my-1" />
                          <button
                            onClick={() => deleteService(service.id)}
                            className="w-full px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/5 flex items-center gap-2 transition-colors"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* 2. CARD VIEW (Fully fluid tracking layout scales across Mobile, Tablet, and Medium Desktops) */}
      <div className="xl:hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-5">
        {services?.filter(
            (s) =>
              selectedCategory === "All" || s.categoryId === selectedCategory,
          )
          .filter((s) =>
            s.name.toLowerCase().includes(searchTerm.toLowerCase()),
          )
          .map((service) => (
            <div
              key={service.id}
              className="p-3.5 md:p-4 lg:p-5 flex flex-col justify-between min-h-[140px] md:min-h-[150px] bg-[#1a1a1a] border border-gray-800/60 rounded-xl md:rounded-2xl shadow-xl hover:bg-[#242424]/25 transition-all duration-200 relative group"
            >
              <div className="flex items-start justify-between gap-2 md:gap-3">
                <div className="flex items-center gap-2.5 md:gap-3.5">
                  {/* Image Scaled Relative to Screen Size */}
                  <div className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg md:rounded-xl overflow-hidden border border-gray-800 shrink-0">
                    <img
                      src={service.imageUrl}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  {/* Dynamically Sized Text Core Components */}
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-white leading-snug group-hover:text-[#e91e63] transition-colors line-clamp-1">
                      {service.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-1 md:gap-1.5 mt-1">
                      <span className="text-[10px] md:text-[11px] font-medium bg-[#262626] px-1.5 md:px-2 py-0.5 rounded border border-gray-800 text-gray-400">
                        {service.categoryName}
                      </span>
                      <span className="text-xs text-gray-600 select-none">
                        •
                      </span>
                      <span className="text-[11px] md:text-xs text-gray-400">
                        {service.duration} mins
                      </span>
                    </div>
                  </div>
                </div>

                {/* Context Actions Button */}
                <div className="relative shrink-0">
                  <button
                    onClick={() =>
                      setActiveDropdown(
                        activeDropdown === service.id ? null : service.id,
                      )
                    }
                    className="p-1.5 hover:bg-[#2d2d2d] rounded-lg text-gray-400 hover:text-white transition-colors"
                  >
                    <MoreVertical size={16} />
                  </button>
                  {activeDropdown === service.id && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setActiveDropdown(null)}
                      />
                      <div className="absolute right-0 top-8 w-44 bg-[#1e1e1e] border border-gray-800 rounded-xl shadow-2xl py-1.5 z-20 overflow-hidden text-left">
                        <button
                          onClick={() => handleOpenViewDetails(service)}
                          className="w-full px-3 py-2 text-xs text-gray-300 hover:bg-[#2d2d2d] flex items-center gap-2 transition-colors"
                        >
                          <Eye size={14} /> View Details
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(service)}
                          className="w-full px-3 py-2 text-xs text-gray-300 hover:bg-[#2d2d2d] flex items-center gap-2 transition-colors"
                        >
                          <Edit2 size={14} /> Edit Service
                        </button>
                        <button
                          disabled={!service.categoryActive}
                          onClick={() => toggleStatus(service)}
                          className={`w-full px-3 py-2 text-xs flex items-center gap-2 transition-colors
    ${
      !service.categoryActive
        ? "opacity-40 cursor-not-allowed text-zinc-500"
        : service.status === "Active"
          ? "text-amber-400 hover:bg-amber-500/5"
          : "text-emerald-400 hover:bg-emerald-500/5"
    }
  `}
                        >
                          {service.status === "Active" ? (
                            <ToggleLeft size={14} />
                          ) : (
                            <ToggleRight size={14} />
                          )}

                          {!service.categoryActive
                            ? "Category Disabled"
                            : service.status === "Active"
                              ? "Deactivate"
                              : "Activate"}
                        </button>
                        <div className="h-px bg-gray-800 my-1" />
                        <button
                          onClick={() => deleteService(service.id)}
                          className="w-full px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/5 flex items-center gap-2 transition-colors"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Bottom Context Row: Sizing scales appropriately to context spacing */}
              <div className="flex items-center justify-between border-t border-gray-800/40 pt-2.5 mt-3">
                <div className="text-sm md:text-base font-bold text-white tracking-wide">
                  ₹{service.price}
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                    !service.categoryActive
                      ? "bg-orange-500/5 border-orange-500/20 text-orange-400"
                      : service.status === "Active"
                        ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
                        : "bg-zinc-500/5 border-zinc-500/20 text-zinc-400"
                  }`}
                >
                  {!service.categoryActive
                    ? "Category Disabled"
                    : service.status}
                </span>
              </div>
            </div>
          ))}
      </div>

      <ViewServiceDetailsModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedService(null); 
        }}
        refreshServices={fetchServices}
        serviceData={selectedService}
      />

      <EditServiceModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingService(null);
        }}
        refreshServices={fetchServices}
        serviceData={editingService}
      />
    </div>
  );
}
