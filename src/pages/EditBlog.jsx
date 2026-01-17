import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { updateBlog, getBlogs, getBlogById } from "../apis/blog";
import { MdArrowBack, MdCloudUpload } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Loader from "../components/ui/Loader";
import ModernSelect from "../components/ModernSelect";

const EditBlog = () => {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [blogs, setBlogs] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    date: "",
    excerpt: "",
    introduction: "",
    content: "",
    whyThisMatters: "",
    relatedIds: [],
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
      const [blogRes, allBlogsRes] = await Promise.all([
        getBlogById(id),
        getBlogs({ limit: 1000 }),
      ]);

      if (blogRes.success) {
        const blog = blogRes.blog;
        setFormData({
          title: blog.title || "",
          category: blog.category || "",
          date: blog.date || "",
          excerpt: blog.excerpt || "",
          introduction: blog.introduction || "",
          content: blog.content || "",
          whyThisMatters: blog.whyThisMatters || "",
          relatedIds: blog.relatedIds || [],
          isActive: blog.isActive,
        });
        setImagePreview(blog.image);
      }

      if (allBlogsRes.success) {
        setBlogs(allBlogsRes.blogs || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire("Error", "Failed to fetch blog details", "error");
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

  const handleRelatedBlogToggle = (blogId) => {
    if (blogId === id) return; // Cannot relate to itself
    setFormData((prev) => {
      const exists = prev.relatedIds.includes(blogId);
      if (exists) {
        return {
          ...prev,
          relatedIds: prev.relatedIds.filter((mid) => mid !== blogId),
        };
      } else {
        return { ...prev, relatedIds: [...prev.relatedIds, blogId] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "relatedIds") {
          data.append(key, JSON.stringify(formData[key]));
        } else {
          data.append(key, formData[key]);
        }
      });
      if (image) {
        data.append("image", image);
      }

      const response = await updateBlog(id, data);
      if (response.success) {
        Swal.fire({
          title: "Success",
          text: "Blog updated successfully",
          icon: "success",
          background: colors.background,
          color: colors.text,
        });
        navigate("/dashboard/blog");
      }
    } catch (error) {
      console.error("Error updating blog:", error);
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Failed to update blog",
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
    <div className="p-6 min-h-screen">
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
            Edit Blog
          </h1>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            Update your blog content and settings
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <div
            className="p-6 rounded-lg border shadow-sm space-y-4"
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
                  Title
                </label>
                <input
                  required
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter blog title"
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
                  required
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Enter category name"
                  className="w-full px-4 py-2.5 rounded border outline-none focus:ring-1 transition-all"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.accent + "40",
                    color: colors.text,
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium"
                style={{ color: colors.text }}
              >
                Excerpt (Short Description)
              </label>
              <textarea
                required
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                placeholder="Brief summary of the blog"
                rows={2}
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
                Introduction
              </label>
              <textarea
                required
                name="introduction"
                value={formData.introduction}
                onChange={handleChange}
                placeholder="Introductory paragraph"
                rows={3}
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
                Content
              </label>
              <textarea
                required
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Full blog article content"
                rows={8}
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
                Why This Matters
              </label>
              <textarea
                required
                name="whyThisMatters"
                value={formData.whyThisMatters}
                onChange={handleChange}
                placeholder="Explain why this article is important for patients"
                rows={2}
                className="w-full px-4 py-2.5 rounded border outline-none focus:ring-1 transition-all"
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.accent + "40",
                  color: colors.text,
                }}
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Image Upload */}
          <div
            className="p-6 rounded-lg border shadow-sm space-y-4"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.accent + "30",
            }}
          >
            <label
              className="text-sm font-medium"
              style={{ color: colors.text }}
            >
              Blog Image
            </label>
            <div
              className="relative aspect-video rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden group hover:border-primary/50 transition-colors"
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

          {/* Related Blogs */}
          <div
            className="p-6 rounded-lg border shadow-sm space-y-4"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.accent + "30",
            }}
          >
            <label
              className="text-sm font-medium"
              style={{ color: colors.text }}
            >
              Related Blogs
            </label>
            <div className="max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {blogs
                .filter((b) => b._id !== id)
                .map((blog) => (
                  <div
                    key={blog._id}
                    onClick={() => handleRelatedBlogToggle(blog._id)}
                    className="flex items-center gap-2 p-2 rounded cursor-pointer transition-colors border"
                    style={{
                      backgroundColor: formData.relatedIds.includes(blog._id)
                        ? colors.primary + "10"
                        : "transparent",
                      borderColor: formData.relatedIds.includes(blog._id)
                        ? colors.primary
                        : colors.accent + "20",
                    }}
                  >
                    <div
                      className="w-4 h-4 rounded-sm border flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: formData.relatedIds.includes(blog._id)
                          ? colors.primary
                          : "transparent",
                        borderColor: colors.primary,
                      }}
                    >
                      {formData.relatedIds.includes(blog._id) && (
                        <span className="text-[10px] text-white">✓</span>
                      )}
                    </div>
                    <span
                      className="text-xs truncate"
                      style={{ color: colors.text }}
                    >
                      {blog.title}
                    </span>
                  </div>
                ))}
              {blogs.length <= 1 && (
                <p
                  className="text-xs text-center py-4"
                  style={{ color: colors.textSecondary }}
                >
                  No other blogs available to link
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 rounded font-bold shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 cursor-pointer"
              style={{
                backgroundColor: colors.primary,
                color: colors.background,
              }}
            >
              {saving ? <Loader size={20} color="#fff" /> : "Update Blog"}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full py-3 rounded font-bold border hover:bg-black/5 transition-all cursor-pointer"
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

export default EditBlog;
