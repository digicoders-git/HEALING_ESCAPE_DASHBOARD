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
    <div className="p-6 min-h-screen text-left">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/dashboard/gallery")}
          className="p-2 rounded-full hover:bg-black/5 transition-colors cursor-pointer"
          style={{ color: colors.text }}
        >
          <MdArrowBack size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: colors.text }}>
            Add Gallery Item
          </h1>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            Upload infrastructure or facility photos
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-full grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        <div className="space-y-6">
          <div
            className="p-6 rounded-lg border shadow-sm space-y-4"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.accent + "30",
            }}
          >
            <div className="space-y-2">
              <label
                className="text-sm font-medium"
                style={{ color: colors.text }}
              >
                Category
              </label>
              <input
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. Hospitals & Infrastructure"
                className="w-full px-4 py-2.5 rounded border outline-none focus:ring-1 transition-all"
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.accent + "40",
                  color: colors.text,
                }}
              />
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium"
                style={{ color: colors.text }}
              >
                Caption
              </label>
              <textarea
                name="caption"
                value={formData.caption}
                onChange={handleChange}
                placeholder="Brief description of the photo"
                rows={4}
                className="w-full px-4 py-2.5 rounded border outline-none focus:ring-1 transition-all"
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.accent + "40",
                  color: colors.text,
                }}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded font-bold shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 cursor-pointer"
              style={{
                backgroundColor: colors.primary,
                color: colors.background,
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
              className="px-8 py-3 rounded font-bold border hover:bg-black/5 transition-all text-center cursor-pointer"
              style={{ borderColor: colors.accent + "40", color: colors.text }}
            >
              Cancel
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div
            className="p-6 rounded-lg border shadow-sm space-y-4 h-full flex flex-col"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.accent + "30",
            }}
          >
            <label
              className="text-sm font-medium"
              style={{ color: colors.text }}
            >
              Image Upload
            </label>
            <div
              className="flex-1 min-h-[300px] relative rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden group hover:border-primary/50 transition-colors"
              style={{ borderColor: colors.accent + "30" }}
              onClick={() => document.getElementById("image-upload").click()}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  className="w-full h-full object-cover"
                  alt="Preview"
                />
              ) : (
                <>
                  <MdCloudUpload
                    size={48}
                    className="text-gray-400 group-hover:scale-110 transition-transform"
                  />
                  <span
                    className="text-sm mt-3 font-medium"
                    style={{ color: colors.textSecondary }}
                  >
                    Click to select image
                  </span>
                  <span
                    className="text-xs mt-1"
                    style={{ color: colors.textSecondary }}
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
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddGallery;
