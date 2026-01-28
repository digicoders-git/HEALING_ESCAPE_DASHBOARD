import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { getGalleryById, updateGallery } from "../apis/gallery";
import { MdArrowBack, MdCloudUpload } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Loader from "../components/ui/Loader";

const EditGallery = () => {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    category: "",
    caption: "",
    isActive: true,
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getGalleryById(id);
      if (response.success) {
        const item = response.gallery;
        setFormData({
          category: item.category || "",
          caption: item.caption || "",
          isActive: item.isActive,
        });
        setImagePreview(item.image);
      }
    } catch (error) {
      console.error("Error fetching gallery item:", error);
      Swal.fire("Error", "Failed to fetch gallery details", "error");
    } finally {
      setLoading(false);
    }
  };

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
      setSaving(true);
      const data = new FormData();
      data.append("category", formData.category);
      data.append("caption", formData.caption);
      data.append("isActive", formData.isActive);
      if (image) {
        data.append("image", image);
      }

      const response = await updateGallery(id, data);
      if (response.success) {
        Swal.fire({
          title: "Success",
          text: "Gallery item updated successfully",
          icon: "success",
          background: colors.background,
          color: colors.text,
        });
        navigate("/dashboard/gallery");
      }
    } catch (error) {
      console.error("Error updating gallery item:", error);
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Failed to update item",
        icon: "error",
        background: colors.background,
        color: colors.text,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader size={50} />
      </div>
    );

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
            Edit Gallery Item
          </h1>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            Modify photo details
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8"
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
                placeholder="Brief description"
                rows={4}
                className="w-full px-4 py-2.5 rounded border outline-none focus:ring-1 transition-all"
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.accent + "40",
                  color: colors.text,
                }}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="w-4 h-4"
              />
              <label
                htmlFor="isActive"
                className="text-sm font-medium"
                style={{ color: colors.text }}
              >
                Active
              </label>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 rounded font-bold shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 cursor-pointer"
              style={{
                backgroundColor: colors.primary,
                color: colors.background,
              }}
            >
              {saving ? <Loader size={20} color="#fff" /> : "Update Item"}
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
              Gallery Image
            </label>
            <div
              className="flex-1 min-h-[300px] relative rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden group hover:border-primary/50 transition-colors"
              style={{ borderColor: colors.accent + "30" }}
              onClick={() => document.getElementById("image-upload").click()}
            >
              <img
                src={imagePreview}
                className="w-full h-full object-cover"
                alt="Preview"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                <MdCloudUpload size={32} />
                <span className="text-xs mt-1">Change Image</span>
              </div>
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

export default EditGallery;
