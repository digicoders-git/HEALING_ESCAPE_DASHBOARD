import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { getGalleryById } from "../apis/gallery";
import {
  MdArrowBack,
  MdCalendarToday,
  MdCategory,
  MdZoomIn,
  MdEdit,
} from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Loader from "../components/ui/Loader";

const ViewGallery = () => {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState(null);

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      setLoading(true);
      const response = await getGalleryById(id);
      if (response.success) {
        setItem(response.gallery);
      }
    } catch (error) {
      console.error("Error fetching gallery item:", error);
      Swal.fire("Error", "Failed to fetch gallery details", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = () => {
    if (!item) return;
    Swal.fire({
      imageUrl: item.image,
      imageAlt: item.caption,
      showConfirmButton: false,
      showCloseButton: true,
      width: "auto",
      background: colors.background,
    });
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader size={50} />
      </div>
    );

  if (!item)
    return (
      <div
        className="text-center py-20"
        style={{ color: colors.textSecondary }}
      >
        Gallery item not found.
      </div>
    );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded hover:bg-black/5 cursor-pointer"
            style={{ color: colors.text }}
          >
            <MdArrowBack size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: colors.text }}>
              View Gallery Asset
            </h1>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              Details of the gallery item
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate(`/dashboard/gallery/edit/${id}`)}
          className="flex items-center gap-2 px-4 py-2 rounded font-medium shadow transition-all hover:scale-105 cursor-pointer"
          style={{
            backgroundColor: colors.primary,
            color: colors.background,
          }}
        >
          <MdEdit size={20} /> Edit Asset
        </button>
      </div>

      <div className="max-w-4xl">
        <div
          className="rounded-lg border p-6"
          style={{
            backgroundColor: colors.background,
            borderColor: colors.accent + "30",
          }}
        >
          {/* Main Image */}
          <div className="mb-6">
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: colors.textSecondary }}
            >
              Asset Preview
            </label>
            <div
              className="relative group cursor-zoom-in rounded-lg overflow-hidden border"
              style={{ borderColor: colors.accent + "20" }}
              onClick={handleImageClick}
            >
              <img
                src={item.image}
                alt={item.caption}
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="bg-white/90 p-2 rounded-full shadow-lg">
                  <MdZoomIn size={24} style={{ color: colors.primary }} />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: colors.textSecondary }}
                >
                  Caption
                </label>
                <div
                  className="text-lg font-semibold"
                  style={{ color: colors.text }}
                >
                  {item.caption || "No caption provided"}
                </div>
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: colors.textSecondary }}
                >
                  Category
                </label>
                <div
                  className="flex items-center gap-2 py-1 px-3 rounded-full border w-fit text-sm font-medium"
                  style={{
                    backgroundColor: colors.accent + "10",
                    borderColor: colors.accent + "30",
                    color: colors.primary,
                  }}
                >
                  <MdCategory size={16} />
                  {item.category}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: colors.textSecondary }}
                >
                  Status
                </label>
                <div
                  className={`flex items-center gap-2 py-1 px-3 rounded-full border w-fit text-sm font-medium ${
                    item.isActive
                      ? "bg-green-100 border-green-200 text-green-700"
                      : "bg-red-100 border-red-200 text-red-700"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      item.isActive ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  {item.isActive ? "Active" : "Inactive"}
                </div>
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: colors.textSecondary }}
                >
                  Uploaded On
                </label>
                <div
                  className="flex items-center gap-2 text-sm"
                  style={{ color: colors.text }}
                >
                  <MdCalendarToday
                    size={16}
                    style={{ color: colors.textSecondary }}
                  />
                  {new Date(item.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>
          </div>

          <div
            className="mt-8 pt-6 border-t"
            style={{ borderColor: colors.accent + "20" }}
          >
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: colors.textSecondary }}
            >
              Technical Information
            </label>
            <div className="p-4 rounded bg-black/5 flex flex-col gap-2">
              <div className="flex justify-between text-xs">
                <span style={{ color: colors.textSecondary }}>
                  Internal ID:
                </span>
                <span className="font-mono" style={{ color: colors.text }}>
                  {item._id}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: colors.textSecondary }}>Public ID:</span>
                <span className="font-mono" style={{ color: colors.text }}>
                  {item.imagePublicId}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewGallery;
