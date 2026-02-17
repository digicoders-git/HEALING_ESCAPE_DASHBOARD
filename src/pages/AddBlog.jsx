import React, { useState, useEffect, useMemo } from "react";
import { useTheme } from "../context/ThemeContext";
import { createBlog, getBlogs } from "../apis/blog";
import { MdArrowBack, MdCloudUpload, MdClose } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Loader from "../components/ui/Loader";
import ModernSelect from "../components/ModernSelect";
import JoditEditor from "jodit-react";
import { useRef } from "react";

const AddBlog = () => {
  const editor = useRef(null);
  const { colors } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);

  const config = useMemo(
    () => ({
      readonly: false,
      height: 500,
      buttons: [
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "|",
        "ul",
        "ol",
        "|",
        "font",
        "fontsize",
        "brush",
        "paragraph",
        "|",
        "image",
        "video",
        "table",
        "link",
        "|",
        "align",
        "undo",
        "redo",
        "|",
        "hr",
        "eraser",
        "copyformat",
        "|",
        "fullsize",
        "selectall",
        "source",
      ],
      uploader: {
        insertImageAsBase64URI: true,
      },
      placeholder: "Start typing your blog content...",
      askBeforePasteFromWord: false,
      askBeforePasteHTML: false,
      defaultActionOnPaste: "insert_as_text",
      imageDefaultWidth: "auto",
      resizer: {
        showSize: true,
        hideSizeTimeout: 0,
      },
      extraCSS: `
        ul { list-style-type: disc !important; padding-left: 2rem !important; margin-bottom: 1rem !important; }
        ol { list-style-type: decimal !important; padding-left: 2rem !important; margin-bottom: 1rem !important; }
        li { margin-bottom: 0.5rem !important; }
        img { max-width: 100%; height: auto; display: inline-block; margin: 10px 0; border-radius: 8px; }
        img[style*="float:left"] { margin-right: 20px !important; margin-bottom: 15px !important; float: left; }
        img[style*="float:right"] { margin-left: 20px !important; margin-bottom: 15px !important; float: right; }
        .jodit-wysiwyg p { margin-bottom: 1rem !important; line-height: 1.7 !important; }
      `,
    }),
    [],
  );

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
      console.error("Error fetching blogs:", error);
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
    <div className="min-h-screen" style={{ backgroundColor: "#f9fafb" }}>
      {/* Premium Gradient Header */}
      <div
        className="sticky top-0 z-50 shadow-lg"
        style={{
          background: "linear-gradient(135deg, #006cb5 0%, #004d84 100%)",
        }}
      >
        <div className="max-w-full mx-auto px-4 md:px-6 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2.5 rounded-xl transition-all hover:scale-110 cursor-pointer"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                color: "#ffffff",
              }}
            >
              <MdArrowBack size={24} />
            </button>
            <div className="flex-1">
              <h1 className="text-3xl font-black text-white">Add New Blog</h1>
              <p
                className="text-sm mt-1 font-medium"
                style={{ color: "rgba(255, 255, 255, 0.9)" }}
              >
                Create a new article for your medical tourism platform
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto px-4 md:px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Main Content Area */}
          <div className="space-y-6">
            {/* Card */}
            <div
              className="bg-white p-8 rounded-2xl shadow-xl border space-y-6"
              style={{ borderColor: "#e5e7eb" }}
            >
              {/* Section Header */}
              <div
                className="flex items-center gap-3 pb-4 border-b-2"
                style={{ borderColor: "#f1f5f9" }}
              >
                <div
                  className="w-1 h-8 rounded-full"
                  style={{ backgroundColor: "#006cb5" }}
                ></div>
                <h2 className="text-xl font-black" style={{ color: "#1f2937" }}>
                  Blog Content
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <label
                    className="text-sm font-bold"
                    style={{ color: "#1f2937" }}
                  >
                    Title *
                  </label>
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter blog title"
                    required
                    className="w-full px-4 py-3.5 rounded-xl border-2 outline-none transition-all font-medium"
                    style={{
                      backgroundColor: "#ffffff",
                      borderColor: "#e5e7eb",
                      color: "#1f2937",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#006cb5";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(0, 108, 181, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e5e7eb";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
                <div className="space-y-2.5">
                  <label
                    className="text-sm font-bold"
                    style={{ color: "#1f2937" }}
                  >
                    Category *
                  </label>
                  <input
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Enter category name"
                    required
                    className="w-full px-4 py-3.5 rounded-xl border-2 outline-none transition-all font-medium"
                    style={{
                      backgroundColor: "#ffffff",
                      borderColor: "#e5e7eb",
                      color: "#1f2937",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#006cb5";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(0, 108, 181, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e5e7eb";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <label
                  className="text-sm font-bold"
                  style={{ color: "#1f2937" }}
                >
                  Excerpt (Short Description) *
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  placeholder="Brief summary of the blog"
                  rows={2}
                  required
                  className="w-full px-4 py-3.5 rounded-xl border-2 outline-none transition-all font-medium resize-none"
                  style={{
                    backgroundColor: "#ffffff",
                    borderColor: "#e5e7eb",
                    color: "#1f2937",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#006cb5";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(0, 108, 181, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e5e7eb";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              <div className="space-y-2.5">
                <label
                  className="text-sm font-bold"
                  style={{ color: "#1f2937" }}
                >
                  Introduction *
                </label>
                <textarea
                  name="introduction"
                  value={formData.introduction}
                  onChange={handleChange}
                  placeholder="Introductory paragraph"
                  rows={3}
                  required
                  className="w-full px-4 py-3.5 rounded-xl border-2 outline-none transition-all font-medium resize-none"
                  style={{
                    backgroundColor: "#ffffff",
                    borderColor: "#e5e7eb",
                    color: "#1f2937",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#006cb5";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(0, 108, 181, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e5e7eb";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              <div className="space-y-2.5">
                <label
                  className="text-sm font-bold"
                  style={{ color: "#1f2937" }}
                >
                  Content *
                </label>
                <div
                  className="min-h-[400px] rounded-xl overflow-hidden border-2"
                  style={{ borderColor: "#e5e7eb" }}
                >
                  <JoditEditor
                    ref={editor}
                    value={formData.content}
                    config={config}
                    onBlur={(newContent) =>
                      setFormData((prev) => ({ ...prev, content: newContent }))
                    }
                    onChange={(newContent) => {}}
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <label
                  className="text-sm font-bold"
                  style={{ color: "#1f2937" }}
                >
                  Why This Matters
                </label>
                <textarea
                  name="whyThisMatters"
                  value={formData.whyThisMatters}
                  onChange={handleChange}
                  placeholder="Explain why this article is important for patients"
                  rows={2}
                  className="w-full px-4 py-3.5 rounded-xl border-2 outline-none transition-all font-medium resize-none"
                  style={{
                    backgroundColor: "#ffffff",
                    borderColor: "#e5e7eb",
                    color: "#1f2937",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#006cb5";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(0, 108, 181, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e5e7eb";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            {/* Middle Section: Image and Related Blogs in a row or stacked? User said Image below content full width */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Image Upload */}
              <div
                className="bg-white p-8 rounded-2xl shadow-xl border space-y-4"
                style={{ borderColor: "#e5e7eb" }}
              >
                <div
                  className="flex items-center gap-3 pb-3 border-b-2"
                  style={{ borderColor: "#f1f5f9" }}
                >
                  <div
                    className="w-1 h-6 rounded-full"
                    style={{ backgroundColor: "#006cb5" }}
                  ></div>
                  <h3
                    className="text-lg font-black"
                    style={{ color: "#1f2937" }}
                  >
                    Blog Image
                  </h3>
                </div>
                <div
                  className="relative aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden group hover:border-primary/50 transition-all"
                  style={{ borderColor: "#bae6fd", backgroundColor: "#f0f9ff" }}
                  onClick={() =>
                    document.getElementById("image-upload").click()
                  }
                >
                  {imagePreview ? (
                    <>
                      <img
                        src={imagePreview}
                        className="w-full h-full object-cover"
                        alt="Preview"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="text-center">
                          <MdCloudUpload
                            className="text-white mx-auto mb-2"
                            size={40}
                          />
                          <p className="text-white text-sm font-bold">
                            Change Image
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <MdCloudUpload
                        size={48}
                        style={{ color: "#006cb5" }}
                        className="group-hover:scale-110 transition-transform"
                      />
                      <span
                        className="text-sm mt-2 font-semibold"
                        style={{ color: "#6b7280" }}
                      >
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
                className="bg-white p-8 rounded-2xl shadow-xl border space-y-4"
                style={{ borderColor: "#e5e7eb" }}
              >
                <div
                  className="flex items-center gap-3 pb-3 border-b-2"
                  style={{ borderColor: "#f1f5f9" }}
                >
                  <div
                    className="w-1 h-6 rounded-full"
                    style={{ backgroundColor: "#006cb5" }}
                  ></div>
                  <h3
                    className="text-lg font-black"
                    style={{ color: "#1f2937" }}
                  >
                    Related Blogs
                  </h3>
                </div>
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
                          backgroundColor: formData.relatedIds.includes(
                            blog._id,
                          )
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
                        className="text-sm truncate"
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
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-4 rounded-xl font-bold shadow-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 cursor-pointer"
                style={{
                  backgroundColor: "#1db64c",
                  color: "#ffffff",
                }}
              >
                {loading ? (
                  <>
                    <Loader size={22} color="#fff" />
                    <span>Creating...</span>
                  </>
                ) : (
                  "Create Blog"
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-12 py-4 rounded-xl font-bold border-2 hover:bg-gray-50 transition-all cursor-pointer"
                style={{ borderColor: "#e5e7eb", color: "#6b7280" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBlog;
