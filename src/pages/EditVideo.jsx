import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { getVideoById, updateVideo } from "../apis/video";
import { MdArrowBack, MdCloudUpload, MdAdd, MdClose } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Loader from "../components/ui/Loader";

const EditVideo = () => {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    duration: "",
    description: "",
    whatYouWillLearn: [""],
    isActive: true,
  });

  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  useEffect(() => {
    fetchVideo();
  }, [id]);

  const fetchVideo = async () => {
    try {
      setLoading(true);
      const response = await getVideoById(id);
      if (response.success) {
        const v = response.video;
        setFormData({
          title: v.title || "",
          category: v.category || "",
          duration: v.duration || "",
          description: v.description || "",
          whatYouWillLearn:
            v.whatYouWillLearn?.length > 0 ? v.whatYouWillLearn : [""],
          isActive: v.isActive,
        });
        setThumbnailPreview(v.thumbnail);
      }
    } catch (error) {
      console.error("Error fetching video:", error);
      Swal.fire("Error", "Failed to fetch video details", "error");
    } finally {
      setLoading(false);
    }
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
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
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
      data.append("isActive", formData.isActive);

      if (thumbnail) data.append("thumbnail", thumbnail);
      if (videoFile) data.append("video", videoFile);

      const response = await updateVideo(id, data);
      if (response.success) {
        Swal.fire({
          title: "Success",
          text: "Video updated successfully",
          icon: "success",
          background: colors.background,
          color: colors.text,
        });
        navigate("/dashboard/video");
      }
    } catch (error) {
      console.error("Error updating video:", error);
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Failed to update video",
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
      <div className="p-10 text-center">
        <Loader size={40} />
      </div>
    );

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
            Edit Video
          </h1>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            Update video details and files
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8"
      >
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-6">
          <div
            className="p-6 rounded-xl border shadow-sm space-y-4"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.accent + "30",
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  className="text-sm font-medium"
                  style={{ color: colors.text }}
                >
                  Video Title
                </label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
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
                  Category
                </label>
                <input
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded border outline-none focus:ring-1 transition-all"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.accent + "40",
                    color: colors.text,
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label
                  className="text-sm font-medium"
                  style={{ color: colors.text }}
                >
                  Duration
                </label>
                <input
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded border outline-none focus:ring-1 transition-all"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.accent + "40",
                    color: colors.text,
                  }}
                />
              </div>
              <div className="flex items-end pb-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="w-4 h-4 cursor-pointer"
                  />
                  <label
                    htmlFor="isActive"
                    className="text-sm font-medium cursor-pointer"
                    style={{ color: colors.text }}
                  >
                    Active
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium"
                style={{ color: colors.text }}
              >
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2.5 rounded border outline-none focus:ring-1 transition-all"
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.accent + "40",
                  color: colors.text,
                }}
              />
            </div>

            <div className="space-y-3">
              <label
                className="text-sm font-medium flex items-center justify-between"
                style={{ color: colors.text }}
              >
                What You Will Learn
                <button
                  type="button"
                  onClick={addLearnPoint}
                  className="text-xs flex items-center gap-1 px-2 py-1 rounded-md hover:bg-black/5 cursor-pointer"
                  style={{ color: colors.primary }}
                >
                  <MdAdd size={16} /> Add Point
                </button>
              </label>
              <div className="space-y-2">
                {formData.whatYouWillLearn.map((point, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      value={point}
                      onChange={(e) =>
                        handleLearnPointChange(index, e.target.value)
                      }
                      placeholder={`Point ${index + 1}`}
                      className="flex-1 px-4 py-2 rounded border outline-none focus:ring-1 transition-all"
                      style={{
                        backgroundColor: colors.background,
                        borderColor: colors.accent + "40",
                        color: colors.text,
                      }}
                    />
                    {formData.whatYouWillLearn.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLearnPoint(index)}
                        className="p-2 rounded hover:bg-red-50 text-red-500 transition-colors cursor-pointer"
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

        {/* Sidebar Space */}
        <div className="lg:col-span-4 space-y-6">
          {/* Thumbnail */}
          <div
            className="p-6 rounded-xl border shadow-sm space-y-4"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.accent + "30",
            }}
          >
            <label
              className="text-sm font-medium"
              style={{ color: colors.text }}
            >
              Thumbnail
            </label>
            <div
              className="relative aspect-video rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden group transition-all"
              style={{ borderColor: colors.accent + "30" }}
              onClick={() => document.getElementById("thumb-upload").click()}
            >
              <img
                src={thumbnailPreview}
                className="w-full h-full object-cover"
                alt="Preview"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <span className="text-xs font-bold">Change Thumbnail</span>
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

          {/* Video Attachment */}
          <div
            className="p-6 rounded-xl border shadow-sm space-y-4"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.accent + "30",
            }}
          >
            <label
              className="text-sm font-medium"
              style={{ color: colors.text }}
            >
              Replace Video File
            </label>
            <div
              className="relative py-8 rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
              style={{ borderColor: colors.accent + "30" }}
              onClick={() => document.getElementById("video-upload").click()}
            >
              <MdCloudUpload
                size={40}
                className={videoFile ? "text-green-500" : "text-gray-400"}
              />
              <span
                className="text-xs mt-2 px-4 text-center truncate w-full"
                style={{ color: colors.textSecondary }}
              >
                {videoFile ? videoFile.name : "Click to select new video"}
              </span>
              <input
                id="video-upload"
                type="file"
                hidden
                accept="video/*"
                onChange={handleVideoChange}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3.5 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 cursor-pointer"
              style={{
                backgroundColor: colors.primary,
                color: colors.background,
              }}
            >
              {saving ? <Loader size={20} color="#fff" /> : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard/video")}
              className="w-full py-3.5 rounded-xl font-bold border hover:bg-black/5 transition-all text-center cursor-pointer"
              style={{ borderColor: colors.accent + "40", color: colors.text }}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditVideo;
