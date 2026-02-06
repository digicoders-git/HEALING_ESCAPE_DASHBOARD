import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { createBlog, getBlogs } from "../apis/blog";
import { MdArrowBack, MdCloudUpload, MdClose } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Loader from "../components/ui/Loader";
import ModernSelect from "../components/ModernSelect";
import { Editor } from "@tinymce/tinymce-react";

const AddBlog = () => {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    date: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }),
    excerpt: "",
    introduction: "",
    content: "",
    whyThisMatters: "",
    relatedIds: [],
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await getBlogs({ limit: 1000 });
      if (response.success) {
        setBlogs(response.blogs || []);
      }
    } catch (error) {
      console.error("Error fetching blogs for relatedIds:", error);
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
    setFormData((prev) => {
      const exists = prev.relatedIds.includes(blogId);
      if (exists) {
        return {
          ...prev,
          relatedIds: prev.relatedIds.filter((id) => id !== blogId),
        };
      } else {
        return { ...prev, relatedIds: [...prev.relatedIds, blogId] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "relatedIds") {
          data.append(key, JSON.stringify(formData[key]));
        } else {
          data.append(key, formData[key]);
        }
      });
      data.append("image", image);

      const response = await createBlog(data);
      if (response.success) {
        Swal.fire({
          title: "Success",
          text: "Blog created successfully",
          icon: "success",
          background: colors.background,
          color: colors.text,
        });
        navigate("/dashboard/blog");
      }
    } catch (error) {
      console.error("Error creating blog:", error);
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Failed to create blog",
        icon: "error",
        background: colors.background,
        color: colors.text,
      });
    } finally {
      setLoading(false);
    }
  };

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
            Add New Blog
          </h1>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            Create a new article for your medical tourism platform
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card */}
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
              <div className="min-h-[400px]">
                <Editor
                  apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                  value={formData.content}
                  onEditorChange={(content) =>
                    setFormData((prev) => ({ ...prev, content }))
                  }
                  init={{
                    height: 500,
                    menubar: true,
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "image",
                      "charmap",
                      "preview",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                      "code",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                      "code",
                      "help",
                      "wordcount",
                    ],
                    toolbar:
                      "undo redo | blocks | " +
                      "bold italic forecolor | alignleft aligncenter " +
                      "alignright alignjustify | bullist numlist outdent indent | " +
                      "removeformat | help | image link | code",
                    content_style:
                      "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                    skin:
                      colors.background === "#ffffff" ? "oxide" : "oxide-dark",
                    content_css:
                      colors.background === "#ffffff" ? "default" : "dark",
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium"
                style={{ color: colors.text }}
              >
                Why This Matters
              </label>
              <textarea
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

        {/* Sidebar Space */}
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
                  <span className="text-xs mt-2 text-gray-500">
                    Click to upload image
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
              {blogs.map((blog) => (
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
              {blogs.length === 0 && (
                <p
                  className="text-xs text-center py-4"
                  style={{ color: colors.textSecondary }}
                >
                  No blogs available to link
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded font-bold shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 cursor-pointer"
              style={{
                backgroundColor: colors.primary,
                color: colors.background,
              }}
            >
              {loading ? <Loader size={20} color="#fff" /> : "Create Blog"}
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

export default AddBlog;
