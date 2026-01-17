import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { getVideoById } from "../apis/video";
import {
  MdArrowBack,
  MdCalendarToday,
  MdCategory,
  MdTimer,
  MdPlayArrow,
  MdEdit,
} from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Loader from "../components/ui/Loader";

const ViewVideo = () => {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState(null);

  useEffect(() => {
    fetchVideo();
  }, [id]);

  const fetchVideo = async () => {
    try {
      setLoading(true);
      const response = await getVideoById(id);
      if (response.success) {
        setItem(response.video);
      }
    } catch (error) {
      console.error("Error fetching video:", error);
      Swal.fire("Error", "Failed to fetch video details", "error");
    } finally {
      setLoading(false);
    }
  };

  const openVideoInModal = () => {
    if (!item) return;
    Swal.fire({
      html: `
         <div style="padding: 10px;">
           <video controls autoplay style="width: 100%; border-radius: 8px;">
              <source src="${item.videoUrl}" type="video/mp4">
              Your browser does not support the video tag.
           </video>
         </div>
       `,
      showConfirmButton: false,
      showCloseButton: true,
      width: "80%",
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
        Video content not found.
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
              View Video
            </h1>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              Video details and preview
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate(`/dashboard/video/edit/${id}`)}
          className="flex items-center gap-2 px-4 py-2 rounded font-medium shadow transition-all hover:scale-105 cursor-pointer"
          style={{
            backgroundColor: colors.primary,
            color: colors.background,
          }}
        >
          <MdEdit size={20} /> Edit Video
        </button>
      </div>

      <div className="max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div
            className="rounded-lg border p-6"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.accent + "30",
            }}
          >
            {/* Video Thumbnail / Player Trigger */}
            <div className="mb-6">
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.textSecondary }}
              >
                Video Preview
              </label>
              <div
                className="relative group cursor-pointer rounded-lg overflow-hidden border"
                style={{ borderColor: colors.accent + "20" }}
                onClick={openVideoInModal}
              >
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full aspect-video object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100">
                  <div className="bg-white/90 p-4 rounded-full shadow-lg scale-90 group-hover:scale-100 transition-transform">
                    <MdPlayArrow size={40} style={{ color: colors.primary }} />
                  </div>
                </div>
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                  <MdTimer size={14} /> {item.duration}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold" style={{ color: colors.text }}>
                {item.title}
              </h2>
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: colors.textSecondary }}
                >
                  Description
                </label>
                <p
                  className="whitespace-pre-wrap leading-relaxed"
                  style={{ color: colors.text }}
                >
                  {item.description}
                </p>
              </div>
            </div>
          </div>

          {item.whatYouWillLearn?.length > 0 && (
            <div
              className="rounded-lg border p-6"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.accent + "30",
              }}
            >
              <h3
                className="text-lg font-bold mb-4"
                style={{ color: colors.text }}
              >
                What You Will Learn
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {item.whatYouWillLearn.map((point, i) => (
                  <div key={i} className="flex gap-2 text-sm items-start">
                    <span className="text-green-500 font-bold">✓</span>
                    <span style={{ color: colors.text }}>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div
            className="rounded-lg border p-6"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.accent + "30",
            }}
          >
            <h3
              className="text-lg font-bold mb-4"
              style={{ color: colors.text }}
            >
              Media Info
            </h3>
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <span
                  className="text-xs font-medium uppercase tracking-wider"
                  style={{ color: colors.textSecondary }}
                >
                  Category
                </span>
                <span
                  className="text-sm font-semibold"
                  style={{ color: colors.primary }}
                >
                  {item.category}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span
                  className="text-xs font-medium uppercase tracking-wider"
                  style={{ color: colors.textSecondary }}
                >
                  Status
                </span>
                <span
                  className={`text-sm font-semibold ${
                    item.isActive ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {item.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span
                  className="text-xs font-medium uppercase tracking-wider"
                  style={{ color: colors.textSecondary }}
                >
                  Created Date
                </span>
                <span
                  className="text-sm font-medium"
                  style={{ color: colors.text }}
                >
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div
            className="rounded-lg border p-6"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.accent + "30",
            }}
          >
            <h3
              className="text-sm font-bold mb-3 uppercase tracking-wider opacity-50"
              style={{ color: colors.text }}
            >
              Technical Stats
            </h3>
            <div className="text-[10px] space-y-2 opacity-70">
              <div className="flex flex-col">
                <span style={{ color: colors.textSecondary }}>Public ID</span>
                <span
                  className="font-mono break-all"
                  style={{ color: colors.text }}
                >
                  {item.videoPublicId}
                </span>
              </div>
              <div className="flex flex-col">
                <span style={{ color: colors.textSecondary }}>Resource ID</span>
                <span className="font-mono" style={{ color: colors.text }}>
                  {item._id}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewVideo;
