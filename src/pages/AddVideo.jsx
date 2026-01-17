import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { createVideo } from "../apis/video";
import {
  MdArrowBack,
  MdCloudUpload,
  MdAdd,
  MdClose,
  MdSlowMotionVideo,
  MdImage,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Loader from "../components/ui/Loader";

const AddVideo = () => {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    duration: "",
    description: "",
    whatYouWillLearn: [""],
  });

  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLearnPointChange = (index, value) => {
    const newPoints = [...formData.whatYouWillLearn];
    newPoints[index] = value;
    setFormData((prev) => ({ ...prev, whatYouWillLearn: newPoints }));
  };

  const addLearnPoint = () => {
    setFormData((prev) => ({
      ...prev,
      whatYouWillLearn: [...prev.whatYouWillLearn, ""],
    }));
  };

  const removeLearnPoint = (index) => {
    if (formData.whatYouWillLearn.length > 1) {
      setFormData((prev) => ({
        ...prev,
        whatYouWillLearn: prev.whatYouWillLearn.filter((_, i) => i !== index),
      }));
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);

      // Auto-calculate duration
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = function () {
        window.URL.revokeObjectURL(video.src);
        const durationStr = formatDuration(video.duration);
        setFormData((prev) => ({ ...prev, duration: durationStr }));
      };
      video.src = URL.createObjectURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!thumbnail || !videoFile) {
      Swal.fire(
        "Error",
        "Please upload both thumbnail and video file",
        "error"
      );
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();
      data.append("title", formData.title);
      data.append("category", formData.category);
      data.append("duration", formData.duration);
      data.append("description", formData.description);
      data.append(
        "whatYouWillLearn",
        JSON.stringify(formData.whatYouWillLearn.filter((p) => p.trim() !== ""))
      );
      data.append("thumbnail", thumbnail);
      data.append("video", videoFile);

      const response = await createVideo(data);
      if (response.success) {
        Swal.fire({
          title: "Success",
          text: "Video created successfully",
          icon: "success",
          background: colors.background,
          color: colors.text,
        });
        navigate("/dashboard/video");
      }
    } catch (error) {
      console.error("Error creating video:", error);
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Failed to create video",
        icon: "error",
        background: colors.background,
        color: colors.text,
        confirmButtonColor: colors.primary,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen text-left">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-black/5 transition-colors cursor-pointer"
          style={{ color: colors.text }}
        >
          <MdArrowBack size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: colors.text }}>
            Create Video
          </h1>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            Add new educational or patient testimonial video
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Side */}
          <div className="lg:col-span-8 space-y-6">
            <div
              className="p-8 rounded-2xl border shadow-sm space-y-6 transition-all"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.accent + "20",
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: colors.textSecondary }}
                  >
                    Video Title
                  </label>
                  <input
                    required
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter video title"
                    className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 transition-all text-sm"
                    style={{
                      backgroundColor: colors.background,
                      borderColor: colors.accent + "30",
                      color: colors.text,
                      "--tw-ring-color": colors.primary + "30",
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: colors.textSecondary }}
                  >
                    Category
                  </label>
                  <input
                    required
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="e.g. Treatments"
                    className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 transition-all text-sm"
                    style={{
                      backgroundColor: colors.background,
                      borderColor: colors.accent + "30",
                      color: colors.text,
                      "--tw-ring-color": colors.primary + "30",
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: colors.textSecondary }}
                  >
                    Duration
                  </label>
                  <div className="relative">
                    <input
                      required
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      placeholder="00:00"
                      className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 transition-all text-sm"
                      style={{
                        backgroundColor: colors.background,
                        borderColor: colors.accent + "30",
                        color: colors.text,
                        "--tw-ring-color": colors.primary + "30",
                      }}
                    />
                    <div className="absolute right-3 top-3 text-[10px] uppercase font-bold text-gray-400">
                      Fixed
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: colors.textSecondary }}
                >
                  Description
                </label>
                <textarea
                  required
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell us about this video..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 transition-all text-sm"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.accent + "30",
                    color: colors.text,
                    "--tw-ring-color": colors.primary + "30",
                  }}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: colors.textSecondary }}
                  >
                    What You Will Learn
                  </label>
                  <button
                    type="button"
                    onClick={addLearnPoint}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:bg-black/5 cursor-pointer"
                    style={{ color: colors.primary }}
                  >
                    <MdAdd size={18} /> Add Point
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.whatYouWillLearn.map((point, index) => (
                    <div key={index} className="flex gap-3 group">
                      <div className="flex-1 relative">
                        <input
                          required
                          value={point}
                          onChange={(e) =>
                            handleLearnPointChange(index, e.target.value)
                          }
                          placeholder={`Learning objective #${index + 1}`}
                          className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 transition-all text-sm pl-10"
                          style={{
                            backgroundColor: colors.background,
                            borderColor: colors.accent + "30",
                            color: colors.text,
                            "--tw-ring-color": colors.primary + "30",
                          }}
                        />
                        <div className="absolute left-3 top-3.5 text-gray-400 text-xs font-mono">
                          {index + 1}.
                        </div>
                      </div>
                      {formData.whatYouWillLearn.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeLearnPoint(index)}
                          className="p-3 rounded-xl hover:bg-red-50 text-red-400 transition-colors border border-transparent hover:border-red-100 cursor-pointer"
                        >
                          <MdClose size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Media Side */}
          <div className="lg:col-span-4 space-y-6">
            {/* Asset Uploder Card */}
            <div
              className="p-6 rounded-2xl border shadow-sm space-y-6"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.accent + "20",
              }}
            >
              {/* Thumbnail Section */}
              <div className="space-y-3">
                <label
                  className="text-xs font-bold uppercase tracking-wider block"
                  style={{ color: colors.textSecondary }}
                >
                  Thumbnail
                </label>
                <div
                  className="relative w-full h-[180px] rounded-2xl border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden group hover:shadow-md transition-all active:scale-[0.98]"
                  style={{
                    borderColor: colors.accent + "30",
                    backgroundColor: colors.accent + "05",
                  }}
                  onClick={() =>
                    document.getElementById("thumb-upload").click()
                  }
                >
                  {thumbnailPreview ? (
                    <img
                      src={thumbnailPreview}
                      className="w-full h-full object-cover"
                      alt="Preview"
                    />
                  ) : (
                    <div className="text-center space-y-2">
                      <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto text-gray-400">
                        <MdImage size={24} />
                      </div>
                      <p className="text-[10px] font-bold text-gray-400">
                        Drop Image Here
                      </p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <MdCloudUpload className="text-white" size={32} />
                  </div>
                  <input
                    id="thumb-upload"
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleThumbnailChange}
                  />
                </div>
              </div>

              {/* Video Section */}
              <div className="space-y-3">
                <label
                  className="text-xs font-bold uppercase tracking-wider block"
                  style={{ color: colors.textSecondary }}
                >
                  Video File
                </label>
                <div
                  className="relative w-full h-[180px] rounded-2xl border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden group hover:shadow-md transition-all active:scale-[0.98]"
                  style={{
                    borderColor: colors.accent + "30",
                    backgroundColor: colors.accent + "05",
                  }}
                  onClick={() =>
                    document.getElementById("video-upload").click()
                  }
                >
                  {videoFile ? (
                    <div className="text-center p-4">
                      <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-2">
                        <MdSlowMotionVideo size={28} />
                      </div>
                      <p className="text-[10px] font-bold text-green-700 truncate w-40">
                        {videoFile.name}
                      </p>
                      <p className="text-[9px] text-gray-400 mt-1 uppercase">
                        Ready to upload
                      </p>
                    </div>
                  ) : (
                    <div className="text-center space-y-2">
                      <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto text-gray-400">
                        <MdSlowMotionVideo size={24} />
                      </div>
                      <p className="text-[10px] font-bold text-gray-400">
                        Drop Video Here
                      </p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <MdCloudUpload className="text-white" size={32} />
                  </div>
                  <input
                    id="video-upload"
                    type="file"
                    hidden
                    accept="video/*"
                    onChange={handleVideoChange}
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl font-bold shadow-xl flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-70 cursor-pointer"
                  style={{
                    backgroundColor: colors.primary,
                    color: colors.background,
                  }}
                >
                  {loading ? (
                    <Loader size={20} color="#fff" />
                  ) : (
                    "Broadcast Video"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/dashboard/video")}
                  className="w-full py-4 rounded-xl font-bold border transition-all hover:bg-black/5 cursor-pointer"
                  style={{
                    borderColor: colors.accent + "40",
                    color: colors.text,
                  }}
                >
                  Discard
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddVideo;
