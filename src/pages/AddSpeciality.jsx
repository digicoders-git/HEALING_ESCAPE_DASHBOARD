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
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/dashboard/speciality")}
          className="p-2 rounded transition-colors hover:bg-black/5 cursor-pointer"
          style={{ color: colors.text }}
        >
          <MdArrowBack size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: colors.text }}>
            Add Speciality
          </h1>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            Create a new medical speciality
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-full">
        <div
          className="rounded-lg border p-6 shadow-sm"
          style={{
            backgroundColor: colors.background,
            borderColor: colors.accent + "30",
          }}
        >
          {/* Image Upload */}
          <div className="mb-6">
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: colors.textSecondary }}
            >
              Speciality Image *
            </label>
            <div className="flex items-center gap-4">
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-24 h-24 rounded object-cover border"
                  style={{ borderColor: colors.accent + "30" }}
                />
              )}
              <label
                className="flex items-center gap-2 px-4 py-2 rounded border cursor-pointer hover:bg-black/5 transition-colors"
                style={{
                  borderColor: colors.accent + "30",
                  color: colors.text,
                }}
              >
                <MdImage size={20} />
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
                className="block text-sm font-medium mb-2"
                style={{ color: colors.textSecondary }}
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
                className="w-full px-4 py-2.5 rounded border outline-none focus:ring-2"
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.accent + "40",
                  color: colors.text,
                }}
                placeholder="e.g., Cardiology"
              />
            </div>

            {/* Description */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.textSecondary }}
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
                className="w-full px-4 py-2.5 rounded border outline-none focus:ring-2"
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.accent + "40",
                  color: colors.text,
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
              className="px-6 py-2.5 rounded font-medium transition-colors cursor-pointer"
              style={{
                backgroundColor: colors.accent + "20",
                color: colors.text,
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded font-medium shadow transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              style={{
                backgroundColor: colors.primary,
                color: colors.background,
              }}
            >
              {submitting ? (
                <>
                  <Loader size={20} />
                  Saving...
                </>
              ) : (
                <>
                  <MdSave size={20} />
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
