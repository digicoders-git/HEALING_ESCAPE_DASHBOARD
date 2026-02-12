import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { createSpeciality } from "../apis/speciality";
import { MdArrowBack, MdSave, MdImage } from "react-icons/md";
import Loader from "../components/ui/Loader";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const AddSpeciality = () => {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image) {
      Swal.fire("Error", "Please upload a speciality image", "error");
      return;
    }

    try {
      setSubmitting(true);

      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("image", formData.image);

      const response = await createSpeciality(data);

      if (response.success) {
        Swal.fire("Success", "Speciality created successfully!", "success");
        navigate("/dashboard/speciality");
      }
    } catch (error) {
      console.error("Error creating speciality:", error);
      if (error.response && error.response.status !== 500) {
        Swal.fire(
          "Error",
          error.response.data.message || "Failed to create speciality",
          "error",
        );
      } else {
        Swal.fire("Error", "Failed to create speciality", "error");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/dashboard/speciality")}
          className="p-3 rounded-xl transition-all hover:scale-110 cursor-pointer shadow-md"
          style={{ backgroundColor: colors.accent + "20", color: colors.text }}
        >
          <MdArrowBack size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-black" style={{ color: '#000000' }}>
            Add Speciality
          </h1>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            Create a new medical speciality
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div
          className="rounded-2xl border-2 p-8 shadow-xl"
          style={{
            backgroundColor: colors.background,
            borderColor: '#006cb520',
          }}
        >
          {/* Image Upload */}
          <div className="mb-8">
            <label
              className="block text-sm font-bold mb-3 uppercase tracking-wider"
              style={{ color: '#006cb5' }}
            >
              Speciality Image *
            </label>
            <div className="flex items-center gap-6">
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 rounded-xl object-cover border-2 shadow-lg"
                  style={{ borderColor: '#006cb5' }}
                />
              )}
              <label
                className="flex items-center gap-3 px-6 py-3 rounded-xl border-2 cursor-pointer transition-all hover:scale-105 shadow-md font-bold"
                style={{
                  borderColor: '#006cb5',
                  backgroundColor: '#006cb510',
                  color: '#006cb5',
                }}
              >
                <MdImage size={24} />
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>

          <div className="space-y-6">
            {/* Title */}
            <div>
              <label
                className="block text-sm font-bold mb-3 uppercase tracking-wider"
                style={{ color: '#006cb5' }}
              >
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-3.5 rounded-xl border-2 outline-none transition-all font-medium shadow-sm"
                style={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e5e7eb',
                  color: '#000000',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#006cb5';
                  e.target.style.boxShadow = '0 0 0 3px rgba(0, 108, 181, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
                placeholder="e.g., Cardiology"
              />
            </div>

            {/* Description */}
            <div>
              <label
                className="block text-sm font-bold mb-3 uppercase tracking-wider"
                style={{ color: '#006cb5' }}
              >
                Description *
              </label>
              <textarea
                required
                rows={5}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-3.5 rounded-xl border-2 outline-none transition-all font-medium shadow-sm"
                style={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e5e7eb',
                  color: '#000000',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#006cb5';
                  e.target.style.boxShadow = '0 0 0 3px rgba(0, 108, 181, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
                placeholder="Brief description of the speciality"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={() => navigate("/dashboard/speciality")}
              className="px-8 py-3 rounded-xl font-bold transition-all hover:scale-105 cursor-pointer shadow-md"
              style={{
                backgroundColor: '#e5e7eb',
                color: '#000000',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              style={{
                backgroundColor: '#1db64c',
                color: '#ffffff',
              }}
            >
              {submitting ? (
                <>
                  <Loader size={20} />
                  Saving...
                </>
              ) : (
                <>
                  <MdSave size={22} />
                  Save Speciality
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddSpeciality;
