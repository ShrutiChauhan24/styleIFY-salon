import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UploadCloud, Image as ImageIcon, DollarSign, Clock, Layers, Sparkles } from 'lucide-react';
import { addDoc, collection, doc, getDoc, getDocs, query, serverTimestamp, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { toast } from 'react-toastify';

export default function AddServiceModal({ isOpen, onClose, refreshServices}) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    duration: '',
    price: '',
    status: 'Active',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
  fetchCategories();
}, []);

const fetchCategories = async () => {
  try {
    const q = query(
      collection(db, "categories"),
      where("isActive", "==", true)
    );

    const snapshot = await getDocs(q);

    const categoriesData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    setCategories(categoriesData);
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

     const generateSlug = (name) => {
     return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
       if(!formData.name.trim() || !formData.category || !formData.duration || !formData.price){
        toast.error('All fields are required');
        return;
       }

       if(isNaN(Number(formData.duration.trim())) || Number(formData.duration) <= 0){
         toast.error('Invalid Duration');
         return;
       }

       if(isNaN(Number(formData.price.trim())) || Number(formData.price) <= 0){
         toast.error('Invalid Price');
         return;
       }

       if(!["Active","Inactive"].includes(formData.status)){
         toast.error('Invalid Status');
         return;
       }

       const categoryRef = doc(db, "categories", formData.category);
       const categorySnap = await getDoc(categoryRef);

      if (!categorySnap.exists()) {
       toast.error("Category does not exist");
       return;
      }

    const categoryData = categorySnap.data();

    if (!categoryData.isActive) {
      toast.error("Category is inactive");
      return;
    }


     let imageUrl = "";

    if (formData.image) {
      const imageData = new FormData();
      imageData.append("file", formData.image);
      imageData.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
      );

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/image/upload`,
        {
          method: "POST",
          body: imageData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Image upload failed");
      }

      imageUrl = data.secure_url;
    }

const slug = generateSlug(formData.name.trim());

const slugQuery = query(
  collection(db, "services"),
  where("slug", "==", slug)
);

const slugSnapshot = await getDocs(slugQuery);

if (!slugSnapshot.empty) {
  toast.error("Service slug already exists");
  return;
}

    await addDoc(collection(db, "services"), {
    name: formData.name.trim(),
    slug,
    categoryId: categorySnap.id,
    categoryName: categoryData.name,
    categoryActive:categoryData.isActive,
    duration: Number(formData.duration),
    price: Number(formData.price),
    status: formData.status,
    imageUrl,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
});

    toast.success('Service Added')
    onClose()
    refreshServices()
    } catch (error) {
    console.log(error)
    toast.error('Unable to add service, try again later')  
    }
  };

  const handleClose = () => {
  setFormData({
    name: '',
    category: '',
    duration: '',
    price: '',
    status: 'Active',
    image: null
  });

  setImagePreview(null);
  onClose();
};
 
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-x-hidden overflow-y-auto">
          
          {/* Backdrop Cover - Less bright, blur removed */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 cursor-pointer"
          />

          {/* Modal Card Layout container - Scaled properly for small, medium, and large screens */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
            className="relative w-full max-w-[92vw] sm:max-w-md md:max-w-xl lg:max-w-2xl bg-[#1a1a1a] border border-zinc-800/80 rounded-2xl md:rounded-3xl shadow-2xl shadow-black/80 z-10 overflow-hidden max-h-[90vh] md:max-h-[85vh] flex flex-col text-left transition-all duration-300"
          >
            
            {/* Header section styling mirrors Reference 1 brand accents */}
            <div className="p-4 sm:p-5 md:p-6 border-b border-zinc-800/60 flex items-center justify-between shrink-0 bg-[#202020]/30">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-2 rounded-xl bg-[#e91e63]/10 text-[#e91e63]">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg md:text-xl font-bold text-white tracking-tight">
                    Add New Salon Service
                  </h2>
                  <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5">
                    Configure specialized service listings for customer checkouts
                  </p>
                </div>
              </div>
              <button 
                onClick={handleClose}
                className="p-1.5 sm:p-2 text-zinc-400 hover:text-white bg-zinc-800/40 hover:bg-zinc-800 rounded-xl transition-all duration-200 cursor-pointer"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Scrollable Context Form body */}
            <form onSubmit={handleSubmit} className="p-4 sm:p-5 md:p-6 overflow-y-auto space-y-4 sm:space-y-5 md:space-y-6 flex-1 custom-scrollbar">
              
              {/* Drag-and-Drop Image Area with Instant Preview functionality */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block">
                  Service Banner Image
                </label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative overflow-hidden group min-h-[120px] sm:min-h-[140px] md:min-h-[160px] rounded-xl md:rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-4 transition-all duration-300 cursor-pointer ${
                    imagePreview ? 'border-zinc-800 bg-[#1e1e1e]' : 
                    isDragging ? 'border-[#e91e63] bg-[#e91e63]/5' : 'border-zinc-800 bg-[#222222]/30 hover:border-zinc-700 hover:bg-[#222222]/50'
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
                    <div className="absolute inset-0 w-full h-full flex flex-col sm:flex-row items-center justify-between p-3 sm:p-4 gap-4 bg-[#1e1e1e]/90">
                      <div className="w-full sm:w-1/3 h-24 sm:h-full rounded-lg overflow-hidden border border-zinc-800">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <p className="text-xs font-medium text-white line-clamp-1">{formData.image?.name || "Selected Image"}</p>
                        <p className="text-[11px] text-zinc-400 mt-0.5">{(formData.image?.size / (1024 * 1024)).toFixed(2)} MB</p>
                        <span className="inline-block mt-2 text-[10px] text-[#e91e63] font-medium bg-[#e91e63]/10 px-2 py-0.5 rounded border border-[#e91e63]/20 group-hover:bg-[#e91e63] group-hover:text-white transition-all">
                          Change Image
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-center gap-2 max-w-sm">
                      <div className="p-2.5 rounded-xl bg-zinc-800/60 text-zinc-400 group-hover:text-white transition-colors">
                        <UploadCloud className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-white">
                          Drag your image here, or <span className="text-[#e91e63] underline hover:text-[#ff3b83]">browse</span>
                        </p>
                        <p className="text-[10px] sm:text-xs text-zinc-500 mt-1">
                          Supports PNG, JPG or WEBP up to 5MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Form Grid layout adapts to viewport parameters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                
                {/* Field: Service Name */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block">
                    Service Name <span className="text-[#e91e63]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Keratin Deep Infusion Spa"
                      className="w-full bg-[#222222]/50 border border-zinc-800 focus:border-[#e91e63]/60 focus:ring-2 focus:ring-[#e91e63]/20 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-600 transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Field: Category Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block">
                    Category <span className="text-[#e91e63]">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
                      <Layers className="w-4 h-4" />
                    </span>
                    <select
                      name="category"
                      required
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full bg-[#222222]/50 border border-zinc-800 focus:border-[#e91e63]/60 focus:ring-2 focus:ring-[#e91e63]/20 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white appearance-none transition-all outline-none"
                    >
                      <option value="" disabled className="text-zinc-600">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id} className="bg-[#1a1a1a]">{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Field: Duration configuration */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block">
                    Duration (Minutes) <span className="text-[#e91e63]">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
                      <Clock className="w-4 h-4" />
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
                      className="w-full bg-[#222222]/50 border border-zinc-800 focus:border-[#e91e63]/60 focus:ring-2 focus:ring-[#e91e63]/20 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-600 transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Field: Price configuration */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block">
                    Base Price (INR) <span className="text-[#e91e63]">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 font-medium text-xs sm:text-sm">
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
                      className="w-full bg-[#222222]/50 border border-zinc-800 focus:border-[#e91e63]/60 focus:ring-2 focus:ring-[#e91e63]/20 rounded-xl pl-8 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-600 transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Field: Status Badge config */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block">
                    Initial Status
                  </label>
                  <div className="grid grid-cols-2 gap-2 bg-[#222222]/30 border border-zinc-800/80 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, status: 'Active' }))}
                      className={`py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                        formData.status === 'Active' 
                          ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-sm' 
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      Active
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, status: 'Inactive' }))}
                      className={`py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                        formData.status === 'Inactive' 
                          ? 'bg-zinc-700/30 border border-zinc-600/30 text-zinc-400 shadow-sm' 
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      Inactive
                    </button>
                  </div>
                </div>

              </div>
            </form>

            {/* Footer Form Controls Container */}
            <div className="p-4 sm:p-5 md:p-6 border-t border-zinc-800/60 flex items-center justify-end gap-3 shrink-0 bg-[#202020]/30">
              <button
                type="button"
                onClick={handleClose}
                className="w-full sm:w-auto px-4 md:px-5 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-semibold text-zinc-400 hover:text-white bg-transparent hover:bg-zinc-800/50 border border-zinc-800 hover:border-zinc-700 transition-all duration-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="w-full sm:w-auto px-5 md:px-6 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-bold text-white bg-[#e91e63] hover:bg-[#ff1e6d] shadow-lg shadow-[#e91e63]/20 hover:shadow-[#e91e63]/30 active:scale-[0.98] transition-all duration-200 cursor-pointer"
              >
                Save Service
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}