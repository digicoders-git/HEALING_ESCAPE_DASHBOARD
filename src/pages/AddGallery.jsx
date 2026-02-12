import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { createGallery } from "../apis/gallery";
import { MdArrowBack, MdCloudUpload } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Loader from "../components/ui/Loader";

const AddGallery = () => {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    category: "",
    caption: "",
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = new FormData();
      data.append("category", formData.category);
      data.append("caption", formData.caption);
      data.append("image", image);

      const response = await createGallery(data);
      if (response.success) {
        Swal.fire({
          title: "Success",
          text: "Gallery item added successfully",
          icon: "success",
          background: colors.background,
          color: colors.text,
        });
        navigate("/dashboard/gallery");
      }
    } catch (error) {
      console.error("Error adding gallery item:", error);
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Failed to add gallery item",
        icon: "error",
        background: colors.background,
        color: colors.text,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
      {/* Modern Header */}
      <div className="sticky top-0 z-50 backdrop-blur-md border-b" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderColor: '#e5e7eb' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard/gallery")}
              className="p-2.5 rounded-xl transition-all hover:scale-110 cursor-pointer"
              style={{ backgroundColor: '#f1f5f9', color: '#1e293b' }}
            >
              <MdArrowBack size={24} />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-black" style={{ color: '#000000' }}>
                Add Gallery Item
              </h1>
              <p className="text-sm font-medium" style={{ color: '#64748b' }}>
                Upload infrastructure or facility photos
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg border space-y-6" style={{ borderColor: '#e5e7eb' }}>
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider" style={{ color: '#1e293b' }}>
                  Category *
                </label>
                <input
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g. Hospitals & Infrastructure"
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 outline-none transition-all"
                  style={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e5e7eb',
                    color: '#000000',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#006cb5'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider" style={{ color: '#1e293b' }}>
                  Caption *
                </label>
                <textarea
                  name="caption"
                  value={formData.caption}
                  onChange={handleChange}
                  placeholder="Brief description of the photo"
                  rows={4}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 outline-none transition-all"
                  style={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e5e7eb',
                    color: '#000000',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#006cb5'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3.5 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 cursor-pointer"
                style={{
                  backgroundColor: '#006cb5',
                  color: '#ffffff',
                }}
              >
                {loading ? (
                  <Loader size={20} color="#fff" />
                ) : (
                  "Upload to Gallery"
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate("/dashboard/gallery")}
                className="px-8 py-3.5 rounded-xl font-bold border-2 hover:bg-black/5 transition-all text-center cursor-pointer"
                style={{ borderColor: '#e5e7eb', color: '#1e293b' }}
              >
                Cancel
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg border h-full flex flex-col" style={{ borderColor: '#e5e7eb' }}>
              <label className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: '#1e293b' }}>
                Image Upload *
              </label>
              <div
                className="flex-1 min-h-[400px] relative rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden group transition-all"
                style={{ borderColor: '#e5e7eb' }}
                onClick={() => document.getElementById("image-upload").click()}
                onMouseEnter={(e) => e.target.style.borderColor = '#006cb5'}
                onMouseLeave={(e) => e.target.style.borderColor = '#e5e7eb'}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    className="w-full h-full object-cover rounded-xl"
                    alt="Preview"
                  />
                ) : (
                  <>
                    <MdCloudUpload
                      size={64}
                      className="text-gray-400 group-hover:scale-110 transition-transform"
                      style={{ color: '#006cb5' }}
                    />
                    <span
                      className="text-base mt-4 font-bold"
                      style={{ color: '#1e293b' }}
                    >
                      Click to select image
                    </span>
                    <span
                      className="text-sm mt-2"
                      style={{ color: '#64748b' }}
                    >
                      Support JPG, PNG, WEBP
                    </span>
                  </>
                )}
                <input
                  id="image-upload"
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGallery;
