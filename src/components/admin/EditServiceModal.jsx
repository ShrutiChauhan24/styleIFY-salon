import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UploadCloud, Edit3, Clock, Layers, HelpCircle, Save } from 'lucide-react';
import { collection, doc, getDoc, getDocs, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { toast } from 'react-toastify';

export default function EditServiceModal({ isOpen, onClose, refreshServices, serviceData }) {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    category: '',
    duration: '',
    price: '',
    status: 'Active',
    image: null
  });
  const [categories,setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showDurationNotice, setShowDurationNotice] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
  fetchCategories();
}, []);

const fetchCategories = async () => {
  try {
    const snapshot = await getDocs(collection(db, "categories"));

    const categoriesData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    setCategories(categoriesData);
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

  useEffect(() => {
    if (serviceData && isOpen) {
      const parsedDuration = typeof serviceData.duration === 'string' 
        ? serviceData.duration.replace(/[^0-9]/g, '') 
        : serviceData.duration;

      setFormData({
        id: serviceData.id || '',
        name: serviceData.name || '',
        category: serviceData.categoryId || '',
        duration: parsedDuration || '',
        price: serviceData.price || '',
        status: serviceData.status || 'Active',
        image: serviceData.imageUrl || null
      });
      setImagePreview(serviceData.imageUrl || null);
      setShowDurationNotice(false);
    }
  }, [serviceData, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'duration') {
      const originalDuration = typeof serviceData?.duration === 'string'
        ? serviceData.duration.replace(/[^0-9]/g, '')
        : serviceData?.duration;
      
      setShowDurationNotice(String(value) !== String(originalDuration));
    }
  };

  const handleFileChange = (file) => {
    if (file && file.type.startsWith('image/')) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    if (
      !formData.name.trim() ||
      !formData.category ||
      !formData.price ||
      !formData.duration
    ) {
      alert("Please complete all required fields.");
      return;
    }

    let slug = serviceData.slug;
    if(formData.name.trim().toLowerCase() !== serviceData.name.toLowerCase()){
     slug = formData.name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-");

  const slugQuery = query(
    collection(db, "services"),
    where("slug", "==", slug)
  );

  const slugSnapshot = await getDocs(slugQuery);

  const duplicate = slugSnapshot.docs.find(
    doc => doc.id !== formData.id
  );

  if (duplicate) {
    alert("Service name already exists");
    return;
  }    
    }
  

       const categoryRef = doc(db, "categories", formData.category);
       const categorySnap = await getDoc(categoryRef);
      
            if (!categorySnap.exists()) {
             toast.error("Category does not exist");
             return;
            }
      
          const categoryData = categorySnap.data();
      

     if(isNaN(Number(formData.duration)) || Number(formData.duration) <= 0){
        toast.error('Invalid Duration');
        return;
   }
    
     if(isNaN(Number(formData.price)) || Number(formData.price) <= 0){
        toast.error('Invalid Price');
        return;
    }

    if(!["Active","Inactive"].includes(formData.status)){
      toast.error('Invalid Status');
      return;
    }

    let imageUrl = serviceData?.imageUrl || "";

    if (formData.image instanceof File) {
      const cloudinaryData = new FormData();

      cloudinaryData.append("file", formData.image);
      cloudinaryData.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
      );

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/image/upload`,
        {
          method: "POST",
          body: cloudinaryData,
        }
      );

      const data = await response.json();

      if (!data.secure_url) {
        throw new Error("Image upload failed");
      }

      imageUrl = data.secure_url;
    }


   await updateDoc(
  doc(db, "services", formData.id),
   {
      name: formData.name.trim(),
      slug,
      categoryId: formData.category,
      categoryName: categoryData.name,
      categoryActive:categoryData.isActive,
      duration: Number(formData.duration),
      price: Number(formData.price),
      status: formData.status,
      imageUrl,
      updatedAt: serverTimestamp()
  }
);

  toast.success("Service updated successfully");
    refreshServices();

    onClose();
  } catch (error) {
    console.error("Edit service error:", error);
    toast.error("Failed to update service");
  }
};

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto">
          
          {/* Backdrop Cover - Kept dark and clean, strictly without blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 cursor-pointer"
          />

          {/* Modal Card Layout container - Proportional and tailored sizes across breakpoints */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.1 }}
            className="relative w-full max-w-[calc(100vw-2rem)] sm:max-w-md md:max-w-xl lg:max-w-2xl bg-[#141414] border border-zinc-800 rounded-2xl shadow-2xl z-10 overflow-hidden max-h-[85vh] flex flex-col text-left transition-all duration-300"
          >
            
            {/* Header Section */}
            <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between shrink-0 bg-[#1a1a1a]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#e91e63]/10 text-[#e91e63]">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    Modify Salon Service
                  </h2>
                  <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5">
                    Update workspace profile matrices and system settings
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-1.5 text-zinc-400 hover:text-white bg-zinc-800/60 hover:bg-zinc-800 rounded-xl transition-all duration-200 cursor-pointer"
              >
                <X className="w-4 h-4 sm:w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-4 sm:space-y-5 flex-1 custom-scrollbar">
              
              {/* Drag-and-Drop Image Area */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                  Service Banner Image
                </label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative overflow-hidden group min-h-[110px] rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-4 transition-all duration-300 cursor-pointer ${
                    imagePreview ? 'border-zinc-700 bg-[#1a1a1a]' : 
                    isDragging ? 'border-[#e91e63] bg-[#e91e63]/5' : 'border-zinc-800 bg-[#1c1c1c] hover:border-zinc-700'
                  }`}
                >
                  <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => handleFileChange(e.target.files[0])}
                    className="hidden" 
                    accept="image/*"
                  />

                  {imagePreview ? (
                    <div className="absolute inset-0 w-full h-full flex items-center p-3 gap-4 bg-[#161616]">
                      <div className="w-20 h-full rounded-lg overflow-hidden border border-zinc-800 bg-black flex-shrink-0">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-xs font-semibold text-white truncate">{formData.image?.name || "Existing Asset Link"}</p>
                        <p className="text-[10px] text-zinc-500 mt-0.5">{formData.image ? `${(formData.image.size / (1024 * 1024)).toFixed(2)} MB` : 'Cloud Hosted Asset'}</p>
                        <span className="inline-block mt-1.5 text-[10px] text-[#e91e63] font-medium bg-[#e91e63]/10 px-2 py-0.5 rounded border border-[#e91e63]/20 transition-all">
                          Replace Image
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-center gap-1.5">
                      <div className="p-2 rounded-xl bg-zinc-800/80 text-zinc-400">
                        <UploadCloud className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-zinc-300">
                          Drag image here, or <span className="text-[#e91e63] underline">browse</span>
                        </p>
                        <p className="text-[10px] text-zinc-500 mt-0.5">
                          Supports PNG, JPG, or WEBP up to 5MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Form Input Layout */}
              <div className="space-y-4">
                
                {/* Field: Service Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                    Service Name <span className="text-[#e91e63]">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Keratin Deep Infusion Spa"
                    className="w-full bg-[#1c1c1c] border border-zinc-800 focus:border-[#e91e63] focus:ring-1 focus:ring-[#e91e63] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 transition-all outline-none"
                  />
                </div>

                {/* Field Grid Matrix */}
                <div className="grid grid-cols-2 gap-3.5">
                  
                  {/* Field: Category Selector */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                      Category <span className="text-[#e91e63]">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                        <Layers className="w-3.5 h-3.5" />
                      </span>
                      <select
                        name="category"
                        required
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full bg-[#1c1c1c] border border-zinc-800 focus:border-[#e91e63] focus:ring-1 focus:ring-[#e91e63] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white appearance-none transition-all outline-none"
                      >
                        <option value="" disabled>Select</option>
                        {categories.map(cat => (
                          <option
  key={cat.id}
  value={cat.id}
  disabled={!cat.isActive && cat.id !== serviceData.categoryId}
>
  {cat.name}
  {!cat.isActive ? " (Inactive)" : ""}
</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Field: Duration */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                      Duration (Mins) <span className="text-[#e91e63]">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                        <Clock className="w-3.5 h-3.5" />
                      </span>
                      <input
                        type="number"
                        name="duration"
                        required
                        min="5"
                        max="480"
                        value={formData.duration}
                        onChange={handleInputChange}
                        placeholder="e.g., 60"
                        className="w-full bg-[#1c1c1c] border border-zinc-800 focus:border-[#e91e63] focus:ring-1 focus:ring-[#e91e63] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-zinc-600 transition-all outline-none"
                      />
                    </div>
                  </div>

                  {/* Field: Price */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                      Base Price (INR) <span className="text-[#e91e63]">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 font-medium text-xs">
                        ₹
                      </span>
                      <input
                        type="number"
                        name="price"
                        required
                        min="0"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="e.g., 1299"
                        className="w-full bg-[#1c1c1c] border border-zinc-800 focus:border-[#e91e63] focus:ring-1 focus:ring-[#e91e63] rounded-xl pl-8 pr-3 py-2.5 text-xs text-white placeholder-zinc-600 transition-all outline-none"
                      />
                    </div>
                  </div>

                  {/* Field: Operational Status */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                      Status
                    </label>
                    <div className="grid grid-cols-2 gap-1 bg-[#1c1c1c] border border-zinc-800 p-1 rounded-xl h-[38px] items-center">
                      <button
                        type="button"
                        onClick={() => setFormData(p => ({ ...p, status: 'Active' }))}
                        className={`h-full text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                          formData.status === 'Active' 
                            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
                            : 'text-zinc-500'
                        }`}
                      >
                        Active
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData(p => ({ ...p, status: 'Inactive' }))}
                        className={`h-full text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                          formData.status === 'Inactive' 
                            ? 'bg-zinc-800 text-zinc-400' 
                            : 'text-zinc-500'
                        }`}
                      >
                        Inactive
                      </button>
                    </div>
                  </div>

                </div>
              </div>

              {/* Dynamic Notification Warning */}
              <AnimatePresence>
                {showDurationNotice && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-start gap-2.5 bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 text-amber-400/90 text-[11px]">
                      <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block text-amber-300">Timeline Modification Advisory</span>
                        Changing duration affects future slot availability only.
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </form>

            {/* Footer Form Actions */}
            <div className="p-4 border-t border-zinc-800 flex items-center justify-end gap-3 shrink-0 bg-[#1a1a1a]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white bg-transparent hover:bg-zinc-800 border border-zinc-800 transition-all duration-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#e91e63] hover:bg-[#ff1e6d] transition-all duration-200 cursor-pointer flex items-center gap-2"
              >
                <Save className="w-3.5 h-3.5" />
                Save Changes
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}