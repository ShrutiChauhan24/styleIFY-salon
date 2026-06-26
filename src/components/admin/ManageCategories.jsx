import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  updateDoc,
  doc,
  writeBatch
} from "firebase/firestore";
import { db } from "../../firebase";

const ManageCategories = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  
  const drawerRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (isOpen && drawerRef.current && !drawerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Clean up object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleImageChange = (e) => {
    const file = e.target.target?.files?.[0] || e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET); 

    const response = await fetch(
       `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Cloudinary upload failed');
    }

    const data = await response.json();
    return data.secure_url; 
  };

  const updateServicesCategoryName = async (
  categoryId,
  newName
) => {
  const servicesQuery = query(
    collection(db, "services"),
    where("categoryId", "==", categoryId)
  );

  const snapshot = await getDocs(servicesQuery);

  const batch = writeBatch(db);

  snapshot.docs.forEach((serviceDoc) => {
    batch.update(serviceDoc.ref, {
      categoryName: newName,
      updatedAt: serverTimestamp(),
    });
  });

  await batch.commit();
};

  const updateServicesCategoryStatus = async (
  categoryId,
  isActive
) => {
  const servicesQuery = query(
    collection(db, "services"),
    where("categoryId", "==", categoryId)
  );

  const snapshot = await getDocs(servicesQuery);

  const batch = writeBatch(db);

  snapshot.docs.forEach((serviceDoc) => {
    batch.update(serviceDoc.ref, {
      categoryActive: isActive,
      updatedAt: serverTimestamp(),
    });
  });

  await batch.commit();
};

  const handleToggleStatus = async (category) => {
    try {
      const newStatus = !category.isActive;
      await updateDoc(
        doc(db, "categories", category.id),
        {
          isActive: newStatus,
          updatedAt: serverTimestamp(),
        }
      );

      await updateServicesCategoryStatus(
  category.id,
  newStatus
);

      setCategories(prev =>
        prev.map(cat =>
          cat.id === category.id
            ? { ...cat, isActive: !cat.isActive }
            : cat
        )
      );

      toast.success(
        category.isActive
          ? "Category disabled"
          : "Category enabled"
      );
    } catch (error) {
      console.error(error);
      toast.error("Unable to update category status");
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      if (!newCategoryName.trim()) {
        toast.error('Category Name required');
        setIsUploading(false);
        return;
      }

      const slug = newCategoryName
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

      const q = query(
        collection(db, "categories"),
        where("slug", "==", slug)
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        toast.error("Category already exists");
        setIsUploading(false);
        return;
      }

      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      const docRef = await addDoc(collection(db, "categories"), {
        name: newCategoryName.trim(),
        slug,
        imageUrl,
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast.success('Category added successfully');
      setCategories(prev => [
        ...prev,
        {
          id: docRef.id,
          name: newCategoryName.trim(),
          imageUrl,
          isActive: true,
        }
      ]);
      
      // Reset layout configurations
      setNewCategoryName('');
      setImageFile(null);
      setImagePreview(null);
      setIsAdding(false);

    } catch (error) {
      console.error(error);
      toast.error('Unable to add category, try again later');
    } finally {
      setIsUploading(false);
    }
  };
  
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const snapshot = await getDocs(collection(db, "categories"));
    const categoriesData = snapshot.docs.map(doc => ({
      id: doc.id,         
      ...doc.data(),
    }));
    setCategories(categoriesData);
  };

  const startInlineEdit = (cat) => {
    setEditingId(cat.id);
    setEditName(cat.name);
  };

  const handleSaveEdit = async (categoryId) => {
    try {
      if (!editName.trim()) {
        toast.error("Category name required");
        return;
      }

      const slug = editName
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, "-");

      const q = query(
        collection(db, "categories"),
        where("slug", "==", slug)
      );

      const snapshot = await getDocs(q);

      const duplicateExists = snapshot.docs.some(
        doc => doc.id !== categoryId
      );

      if (duplicateExists) {
        toast.error("Category already exists");
        return;
      }

      await updateDoc(
        doc(db, "categories", categoryId),
        {
          name: editName.trim(),
          slug,
          updatedAt: serverTimestamp()
        }
      );

      await updateServicesCategoryName(
      categoryId,
      editName.trim()
);

      await fetchCategories();
      setEditingId(null);
      toast.success("Category updated successfully");

    } catch (error) {
      console.error(error);
      toast.error("Unable to update category");
    }
  };

  return (
    <div className="w-full flex justify-center sm:justify-start md:justify-end lg:justify-end font-sans select-none">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group relative inline-flex items-center justify-center gap-1.5 sm:gap-2 md:gap-2.5 w-full max-w-[220px] sm:w-auto px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3 lg:px-6 lg:py-3 rounded-xl text-[11px] sm:text-xs md:text-sm lg:text-base font-semibold tracking-wide text-zinc-300 bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700/80 active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-lg shadow-black/20"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-[#E31A53] transition-transform duration-300 group-hover:rotate-45"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.43l-1.003.767c-.3.23-.452.617-.432.998.003.074.003.147.003.22c0 .072 0 .146-.003.22a1.104 1.104 0 0 1-.432.999l1.003.767a1.125 1.125 0 0 1 .26 1.43l-1.296 2.247a1.125 1.125 0 0 1-1.37.49l-1.216-.456a1.125 1.125 0 0 1-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281a1.125 1.125 0 0 1-.645-.87a6.528 6.528 0 0 1-.22-.127a1.125 1.125 0 0 1-1.075-.124l-1.217.456a1.125 1.125 0 0 1-1.37-.49l-1.296-2.247a1.125 1.125 0 0 1 .26-1.43l1.003-.767c.3-.23.452-.617.432-.998a5.949 5.949 0 0 1-.003-.22c0-.074 0-.147.003-.22a1.104 1.104 0 0 1 .432-.999l-1.003-.767a1.125 1.125 0 0 1-.26-1.43l1.296-2.247a1.125 1.125 0 0 1 1.37-.49l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128c.332-.183.582-.495.644-.869l.214-1.28z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
        </svg>
        <span className="tracking-wide whitespace-nowrap">Manage Categories</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Dimmer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-all"
            />

            {/* Right Sliding Panel */}
            <motion.div
              ref={drawerRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="fixed inset-y-0 right-0 w-full max-w-[310px] sm:max-w-[380px] md:max-w-[420px] bg-[#121212] border-l border-zinc-800/80 shadow-[0_0_50px_rgba(0,0,0,0.8)] z-50 flex flex-col justify-between overflow-hidden"
            >
              {/* HEADER CONTAINER */}
              <div className="px-4 py-4 sm:px-6 sm:py-5 border-b border-zinc-900 flex items-center justify-between bg-zinc-950/40">
                <div>
                  <h2 className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-zinc-50">Categories</h2>
                  <p className="text-[10px] sm:text-xs text-zinc-500 font-medium tracking-wide mt-0.5">
                    Configure architecture filter parameters
                  </p>
                </div>
                
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 sm:p-2 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 rounded-xl transition-all cursor-pointer border border-transparent hover:border-zinc-800/40"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5 sm:w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* CENTER COMPONENT BODY LIST */}
              <div className="flex-grow overflow-y-auto px-4 py-3 sm:px-6 sm:py-4 space-y-3 sm:space-y-3.5 scrollbar-thin scrollbar-thumb-zinc-800">
                <div className="space-y-2">
                  {categories.map((category) => (
                    <motion.div
                      layout
                      key={category.id}
                      className={`flex items-center justify-between p-2.5 sm:p-3.5 rounded-xl border transition-all ${
                        category.isActive 
                          ? 'bg-zinc-900/40 border-zinc-800/60' 
                          : 'bg-zinc-950/20 border-zinc-900/40 opacity-50'
                      }`}
                    >
                      {/* Left Side Elements (Preview Image + Name Input/Text) */}
                      <div className="flex items-center gap-3 flex-grow pr-3 sm:pr-4 min-w-0">
                        {/* Tiny Category Image Preview */}
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-zinc-950 border border-zinc-800/60 overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {category.imageUrl ? (
                            <img 
                              src={category.imageUrl} 
                              alt={category.name} 
                              className="w-full h-full object-cover text-[8px] text-zinc-600 text-center"
                            />
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 text-zinc-600">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                          )}
                        </div>

                        {/* Dynamic Editing Input / Label */}
                        <div className="flex-grow min-w-0">
                          {editingId === category.id ? (
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="px-2 py-0.5 sm:px-2.5 sm:py-1 text-xs sm:text-sm bg-zinc-950 text-white border border-[#E31A53]/50 focus:border-[#E31A53] focus:outline-none rounded-lg w-full font-medium"
                                autoFocus
                              />
                              <button
                                type="button"
                                onClick={() => handleSaveEdit(category.id)}
                                className="px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] font-bold tracking-wide bg-[#E31A53] text-white rounded-lg hover:bg-[#c21243] cursor-pointer flex-shrink-0"
                              >
                                Save
                              </button>
                            </div>
                          ) : (
                            <span className={`text-xs sm:text-sm font-semibold tracking-wide truncate block ${category.isActive ? 'text-zinc-100' : 'text-zinc-500 line-through'}`}>
                              {category.name}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right Actions Block */}
                      {editingId !== category.id && (
                        <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => startInlineEdit(category)}
                            disabled={!category.isActive}
                            className="p-1 sm:p-1.5 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60 transition-all cursor-pointer disabled:opacity-0 disabled:cursor-not-allowed"
                            title="Edit Name"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3.5 h-3.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                            </svg>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleStatus(category)}
                            className={`px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] font-bold tracking-wider uppercase rounded-lg border transition-all cursor-pointer ${
                              category.isActive
                                ? 'text-zinc-400 border-zinc-800 hover:border-red-900/40 hover:bg-red-950/20 hover:text-red-400'
                                : 'text-[#E31A53] border-[#E31A53]/20 bg-[#E31A53]/5 hover:bg-[#E31A53]/10'
                            }`}
                          >
                            {category.isActive ? 'Disable' : 'Enable'}
                          </button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* DYNAMIC EXPANDABLE ADD CARD INPUT */}
                <div className="pt-2 border-t border-zinc-900">
                  <AnimatePresence initial={false}>
                    {!isAdding ? (
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsAdding(true)}
                        className="w-full inline-flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-4 text-xs sm:text-sm font-semibold tracking-wide text-[#E31A53] hover:text-[#f02861] bg-[#E31A53]/5 hover:bg-[#E31A53]/10 border border-[#E31A53]/10 hover:border-[#E31A53]/20 rounded-xl transition-all cursor-pointer"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5 sm:w-4 sm:h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        <span>Add Category</span>
                      </motion.button>
                    ) : (
                      <motion.form
                        initial={{ opacity: 0, y: 10, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.97 }}
                        onSubmit={handleAddCategory}
                        className="p-3 sm:p-4 bg-zinc-950 rounded-xl border border-zinc-800/80 space-y-3.5 shadow-inner shadow-black/40"
                      >
                        {/* Category Name Field */}
                        <div className="space-y-1">
                          <label className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                            Category Name
                          </label>
                          <input
                            type="text"
                            placeholder="e.g., Massage, Extensions"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm bg-zinc-900 text-white border border-zinc-800 focus:border-[#E31A53] focus:outline-none rounded-lg tracking-wide placeholder-zinc-600 font-medium transition-all"
                            autoFocus
                            required
                            disabled={isUploading}
                          />
                        </div>

                        {/* Category Image Upload Field */}
                        <div className="space-y-1.5">
                          <label className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                            Category Image
                          </label>
                          
                          <div className="flex items-center gap-3">
                            {/* Upload Area Box Trigger */}
                            <label className="flex-grow flex flex-col items-center justify-center border border-dashed border-zinc-800 hover:border-[#E31A53]/50 bg-zinc-900/60 rounded-lg p-2.5 cursor-pointer text-center group transition-colors">
                              <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={handleImageChange}
                                disabled={isUploading}
                              />
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors mb-0.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                              </svg>
                              <span className="text-[10px] text-zinc-500 group-hover:text-zinc-400 truncate max-w-[150px]">
                                {imageFile ? imageFile.name : "Choose an image"}
                              </span>
                            </label>

                            {/* Temporary Thumbnail Preview block inside the form */}
                            {imagePreview && (
                              <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-800 overflow-hidden relative flex-shrink-0">
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => { setImageFile(null); setImagePreview(null); }}
                                  className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity text-red-500"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Submit Buttons */}
                        <div className="flex items-center justify-end gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold pt-1">
                          <button
                            type="button"
                            onClick={() => { setIsAdding(false); setNewCategoryName(''); setImageFile(null); setImagePreview(null); }}
                            className="px-2.5 py-1 sm:px-3 sm:py-1.5 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
                            disabled={isUploading}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-3 py-1 sm:px-4 sm:py-1.5 bg-gradient-to-r from-[#E31A53] to-[#C21243] hover:from-[#f02861] hover:to-[#d6184d] text-white rounded-lg shadow-md shadow-[#E31A53]/15 cursor-pointer transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isUploading}
                          >
                            {isUploading ? (
                              <>
                                <svg className="animate-spin h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Saving...
                              </>
                            ) : 'Save'}
                          </button>
                        </div>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* BOTTOM SYSTEM CONTROL STICKY ANCHOR */}
              <div className="px-4 py-3 sm:px-6 sm:py-4 bg-zinc-950 border-t border-zinc-900 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2 sm:py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-xs sm:text-sm text-zinc-300 hover:text-white font-semibold border border-zinc-800/60 transition-all cursor-pointer"
                >
                  Close System View
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageCategories;