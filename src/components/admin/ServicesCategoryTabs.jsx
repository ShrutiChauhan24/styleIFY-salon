import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";

const ServicesCategoryControls = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const q = query(
      collection(db, "categories"),
      where("isActive", "==", true),
    );
    const snapshot = await getDocs(q);

    const categoriesData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setCategories(categoriesData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="w-full bg-[#121212] px-4 py-4 sm:px-5 md:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 select-none border-b border-zinc-900/80"
    >
      {/* LEFT SIDE: Premium Dropdown Selector Field */}
      <div className="w-full sm:w-64 md:w-72 relative" ref={dropdownRef}>
        <label className="block text-[11px] font-bold tracking-wider text-zinc-500 uppercase mb-1.5 pl-1">
          Filter by Category
        </label>

        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-zinc-950 text-xs sm:text-sm font-medium border text-zinc-200 transition-all duration-200 cursor-pointer shadow-inner shadow-black/30 group ${
            isDropdownOpen
              ? "border-[#E31A53] shadow-[0_0_15px_rgba(227,26,83,0.1)] text-white"
              : "border-zinc-800/80 hover:border-zinc-700 hover:text-zinc-100"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {/* Glowing Category Indicator Accent */}
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#E31A53] opacity-40 group-hover:animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E31A53]" />
            </span>
            <span className="tracking-wide">
              {selectedCategory === "all"
                ? "All"
                : categories.find((cat) => cat.id === selectedCategory)?.name}
            </span>
          </div>

          <svg
            className={`w-4 h-4 text-zinc-500 group-hover:text-zinc-400 transition-transform duration-300 ease-[0.16,1,0.3,1] ${
              isDropdownOpen ? "rotate-180 text-[#E31A53]" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </button>

        <AnimatePresence>
          {isDropdownOpen && (
            <motion.ul
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-0 right-0 mt-2 bg-zinc-900/95 border border-zinc-800/90 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.7)] z-50 overflow-hidden backdrop-blur-xl divide-y divide-zinc-800/40"
            >
              <li key="all">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory("all");
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 text-xs sm:text-sm transition-all duration-150 cursor-pointer text-left ${
                    selectedCategory === "all"
                      ? "bg-[#E31A53]/10 text-[#E31A53] font-semibold"
                      : "text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200"
                  }`}
                >
                  <span className="tracking-wide">All</span>

                  {selectedCategory === "all" && (
                    <motion.svg
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-4 h-4 text-[#E31A53]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </motion.svg>
                  )}
                </button>
              </li>

              {categories?.map((category) => {
                const isSelected = selectedCategory === category.id;
                return (
                  <li key={category.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 text-xs sm:text-sm transition-all duration-150 cursor-pointer text-left ${
                        isSelected
                          ? "bg-[#E31A53]/10 text-[#E31A53] font-semibold"
                          : "text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200"
                      }`}
                    >
                      <span className="tracking-wide">{category?.name}</span>

                      {isSelected && (
                        <motion.svg
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="w-4 h-4 text-[#E31A53]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </motion.svg>
                      )}
                    </button>
                  </li>
                );
              })}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      <div className="w-full sm:w-64 md:w-72 lg:w-80 relative group">
        <label className="block text-[11px] font-bold tracking-wider text-zinc-500 uppercase mb-1.5 pl-1">
          Search Directory
        </label>

        <div className="relative">
          <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-[#E31A53] transition-colors duration-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.2"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.603 10.601z"
              />
            </svg>
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search services..."
            className="w-full pl-10 pr-10 py-2.5 bg-zinc-950 hover:bg-zinc-900/20 focus:bg-zinc-950 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 rounded-xl border border-zinc-800/80 focus:border-[#E31A53]/70 focus:outline-none transition-all duration-200 shadow-inner shadow-black/30 focus:shadow-[0_0_15px_rgba(227,26,83,0.08)]"
          />

          <AnimatePresence>
            {searchQuery && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-3 flex items-center text-zinc-500 hover:text-zinc-300 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4.5 h-4.5"
                >
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default ServicesCategoryControls;
