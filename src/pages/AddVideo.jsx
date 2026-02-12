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
    try {
      setLoading(true);
      const data = new FormData();
      data.append("title", formData.title);
      data.append("category", formData.category);
      data.append("duration", formData.duration);
      data.append("description", formData.description);
      data.append(
        "whatYouWillLearn",
        JSON.stringify(
          formData.whatYouWillLearn.filter((p) => p.trim() !== ""),
        ),
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
    <div className="min-h-screen" style={{ backgroundColor: '#f9fafb' }}>
      {/* Premium Gradient Header */}
      <div 
        className="sticky top-0 z-50 shadow-lg"
        style={{
          background: 'linear-gradient(135deg, #006cb5 0%, #004d84 100%)'
        }}
      >
        <div className="max-w-full mx-auto px-4 md:px-6 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2.5 rounded-xl transition-all hover:scale-110 cursor-pointer"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: '#ffffff' }}
            >
              <MdArrowBack size={24} />
            </button>
            <div className="flex-1">
              <h1 className="text-3xl font-black text-white flex items-center gap-3">
                <MdSlowMotionVideo size={32} /> Add New Video
              </h1>
              <p className="text-sm mt-1 font-medium" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                Upload educational content or patient testimonial videos
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto px-4 md:px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Side */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-xl border space-y-8" style={{ borderColor: '#e5e7eb' }}>
              {/* Section Header */}
              <div className="flex items-center gap-3 pb-4 border-b-2" style={{ borderColor: '#f1f5f9' }}>
                <div className="w-1 h-8 rounded-full" style={{ backgroundColor: '#006cb5' }}></div>
                <h2 className="text-xl font-black" style={{ color: '#1f2937' }}>Video Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <label className="text-sm font-bold" style={{ color: '#1f2937' }}>
                    Video Title *
                  </label>
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter video title"
                    required
                    className="w-full px-4 py-3.5 rounded-xl border-2 outline-none transition-all font-medium"
                    style={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e5e7eb',
                      color: '#1f2937',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#006cb5';
                      e.target.style.boxShadow = '0 0 0 3px rgba(0, 108, 181, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
                <div className="space-y-2.5">
                  <label className="text-sm font-bold" style={{ color: '#1f2937' }}>
                    Category *
                  </label>
                  <input
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="e.g. Treatments, Testimonials"
                    required
                    className="w-full px-4 py-3.5 rounded-xl border-2 outline-none transition-all font-medium"
                    style={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e5e7eb',
                      color: '#1f2937',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#006cb5';
                      e.target.style.boxShadow = '0 0 0 3px rgba(0, 108, 181, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-sm font-bold" style={{ color: '#1f2937' }}>
                  Duration (Auto-calculated)
                </label>
                <div className="relative">
                  <input
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="00:00"
                    className="w-full px-4 py-3.5 rounded-xl border-2 outline-none transition-all font-medium"
                    style={{
                      backgroundColor: '#f9fafb',
                      borderColor: '#e5e7eb',
                      color: '#6b7280',
                    }}
                    readOnly
                  />
                  <div className="absolute right-4 top-4 text-xs font-bold" style={{ color: '#9ca3af' }}>
                    AUTO
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-sm font-bold" style={{ color: '#1f2937' }}>
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell us about this video..."
                  rows={4}
                  className="w-full px-4 py-3.5 rounded-xl border-2 outline-none transition-all font-medium resize-none"
                  style={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e5e7eb',
                    color: '#1f2937',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#006cb5';
                    e.target.style.boxShadow = '0 0 0 3px rgba(0, 108, 181, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold" style={{ color: '#1f2937' }}>
                    What You Will Learn
                  </label>
                  <button
                    type="button"
                    onClick={addLearnPoint}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all hover:scale-105 shadow-sm cursor-pointer"
                    style={{ backgroundColor: '#006cb520', color: '#006cb5' }}
                  >
                    <MdAdd size={18} /> Add Point
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.whatYouWillLearn.map((point, index) => (
                    <div key={index} className="flex gap-3 group">
                      <div className="flex-1 relative">
                        <input
                          value={point}
                          onChange={(e) =>
                            handleLearnPointChange(index, e.target.value)
                          }
                          placeholder={`Learning objective #${index + 1}`}
                          className="w-full px-4 py-3.5 rounded-xl border-2 outline-none transition-all font-medium pl-12"
                          style={{
                            backgroundColor: '#ffffff',
                            borderColor: '#e5e7eb',
                            color: '#1f2937',
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#006cb5';
                            e.target.style.boxShadow = '0 0 0 3px rgba(0, 108, 181, 0.1)';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = '#e5e7eb';
                            e.target.style.boxShadow = 'none';
                          }}
                        />
                        <div className="absolute left-4 top-4 text-sm font-bold" style={{ color: '#9ca3af' }}>
                          {index + 1}.
                        </div>
                      </div>
                      {formData.whatYouWillLearn.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeLearnPoint(index)}
                          className="p-3 rounded-xl hover:bg-red-50 text-red-500 transition-all border-2 border-transparent hover:border-red-200 cursor-pointer"
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

          {/* Media Upload Side */}
          <div className="lg:col-span-4 space-y-6">
            {/* Media Upload Card */}
            <div className="bg-white p-6 rounded-2xl shadow-xl border space-y-6" style={{ borderColor: '#e5e7eb' }}>
              {/* Section Header */}
              <div className="flex items-center gap-3 pb-4 border-b-2" style={{ borderColor: '#f1f5f9' }}>
                <div className="w-1 h-8 rounded-full" style={{ backgroundColor: '#006cb5' }}></div>
                <h2 className="text-xl font-black" style={{ color: '#1f2937' }}>Media Assets</h2>
              </div>

              {/* Thumbnail Section */}
              <div className="space-y-3">
                <label className="text-sm font-bold block" style={{ color: '#1f2937' }}>
                  Thumbnail Image *
                </label>
                <div
                  className="relative w-full h-[200px] rounded-2xl border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden group hover:shadow-lg transition-all active:scale-[0.98]"
                  style={{
                    borderColor: '#bae6fd',
                    backgroundColor: '#f0f9ff',
                  }}
                  onClick={() =>
                    document.getElementById("thumb-upload").click()
                  }
                >
                  {thumbnailPreview ? (
                    <>
                      <img
                        src={thumbnailPreview}
                        className="w-full h-full object-cover"
                        alt="Preview"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="text-center">
                          <MdCloudUpload className="text-white mx-auto mb-2" size={40} />
                          <p className="text-white text-sm font-bold">Change Image</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center space-y-3">
                      <div className="w-16 h-16 rounded-2xl shadow-lg flex items-center justify-center mx-auto" style={{ backgroundColor: '#006cb5' }}>
                        <MdImage size={32} className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-bold" style={{ color: '#1f2937' }}>
                          Drop Image Here
                        </p>
                        <p className="text-xs mt-1" style={{ color: '#6b7280' }}>
                          or click to browse
                        </p>
                      </div>
                    </div>
                  )}
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
                <label className="text-sm font-bold block" style={{ color: '#1f2937' }}>
                  Video File *
                </label>
                <div
                  className="relative w-full h-[200px] rounded-2xl border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden group hover:shadow-lg transition-all active:scale-[0.98]"
                  style={{
                    borderColor: videoFile ? '#86efac' : '#bae6fd',
                    backgroundColor: videoFile ? '#f0fdf4' : '#f0f9ff',
                  }}
                  onClick={() =>
                    document.getElementById("video-upload").click()
                  }
                >
                  {videoFile ? (
                    <>
                      <div className="text-center p-4">
                        <div className="w-16 h-16 rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: '#1db64c' }}>
                          <MdSlowMotionVideo size={32} className="text-white" />
                        </div>
                        <p className="text-sm font-bold truncate max-w-[200px] mx-auto" style={{ color: '#166534' }}>
                          {videoFile.name}
                        </p>
                        <p className="text-xs mt-2" style={{ color: '#16a34a' }}>
                          ✓ Ready to upload
                        </p>
                      </div>
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="text-center">
                          <MdCloudUpload className="text-white mx-auto mb-2" size={40} />
                          <p className="text-white text-sm font-bold">Change Video</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center space-y-3">
                      <div className="w-16 h-16 rounded-2xl shadow-lg flex items-center justify-center mx-auto" style={{ backgroundColor: '#006cb5' }}>
                        <MdSlowMotionVideo size={32} className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-bold" style={{ color: '#1f2937' }}>
                          Drop Video Here
                        </p>
                        <p className="text-xs mt-1" style={{ color: '#6b7280' }}>
                          or click to browse
                        </p>
                      </div>
                    </div>
                  )}
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
              <div className="pt-4 space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl font-bold shadow-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 cursor-pointer"
                  style={{
                    backgroundColor: '#1db64c',
                    color: '#ffffff',
                  }}
                >
                  {loading ? (
                    <>
                      <Loader size={22} color="#fff" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <MdCloudUpload size={24} />
                      <span>Publish Video</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/dashboard/video")}
                  className="w-full py-4 rounded-xl font-bold border-2 transition-all hover:bg-gray-50 cursor-pointer"
                  style={{
                    borderColor: '#e5e7eb',
                    color: '#6b7280',
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
      </div>
    </div>
  );
};

export default AddVideo;
