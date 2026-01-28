import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { getSpecialityById, updateSpeciality } from "../apis/speciality";
import { MdArrowBack, MdSave, MdImage } from "react-icons/md";
import Loader from "../components/ui/Loader";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import ModernSelect from "../components/ModernSelect";

const EditSpeciality = () => {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isActive: true,
    image: null,
  });

  useEffect(() => {
    fetchSpeciality();
  }, [id]);

  const fetchSpeciality = async () => {
    try {
      setLoading(true);
      const response = await getSpecialityById(id);
      if (response.success) {
        const data = response.data || response.speciality;
        setFormData({
          title: data.title,
          description: data.description,
          isActive: data.isActive,
          image: null,
        });
        setImagePreview(data.image);
      }
    } catch (error) {
      console.error("Error fetching speciality:", error);
      Swal.fire("Error", "Failed to fetch speciality details", "error");
      navigate("/dashboard/speciality");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageClick = () => {
    if (imagePreview) {
      Swal.fire({
        imageUrl: imagePreview,
        imageAlt: "Preview",
        showConfirmButton: false,
        showCloseButton: true,
        width: "auto",
        background: colors.background,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("isActive", formData.isActive);

      if (formData.image) {
        data.append("image", formData.image);
      }

      const response = await updateSpeciality(id, data);

      if (response.success) {
        Swal.fire("Success", "Speciality updated successfully!", "success");
        navigate("/dashboard/speciality");
      }
    } catch (error) {
      console.error("Error updating speciality:", error);
      if (error.response && error.response.status !== 500) {
        Swal.fire(
          "Error",
          error.response.data.message || "Failed to update speciality",
          "error",
        );
      } else {
        Swal.fire("Error", "Failed to update speciality", "error");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size={60} />
      </div>
    );
  }

  const statusOptions = [
    { label: "Active", value: true },
    { label: "Inactive", value: false },
  ];

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
            Edit Speciality
          </h1>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            Update speciality information
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-2xl">
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
              Speciality Image
            </label>
            <div className="flex items-center gap-4">
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-24 h-24 rounded object-cover border cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ borderColor: colors.accent + "30" }}
                  onClick={handleImageClick}
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
                Change Image
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

            {/* Status */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.textSecondary }}
              >
                Status *
              </label>
              <ModernSelect
                options={statusOptions}
                value={formData.isActive}
                onChange={(value) =>
                  setFormData({ ...formData, isActive: value })
                }
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
                  Updating...
                </>
              ) : (
                <>
                  <MdSave size={20} />
                  Update Speciality
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditSpeciality;
