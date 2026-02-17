import React, { useState, useEffect, useMemo } from "react";
import { useTheme } from "../context/ThemeContext";
import { updateBlog, getBlogs, getBlogById } from "../apis/blog";
import { MdArrowBack, MdCloudUpload } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Loader from "../components/ui/Loader";
import ModernSelect from "../components/ModernSelect";
import JoditEditor from "jodit-react";
import { useRef } from "react";

const EditBlog = () => {
  const editor = useRef(null);
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();

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

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Main Content Area */}
        <div className="space-y-6">
          <div
            className="p-8 rounded-2xl border shadow-xl space-y-6"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.accent + "30",
            }}
          >
            {/* Section Header */}
            <div
              className="flex items-center gap-3 pb-4 border-b-2"
              style={{ borderColor: colors.accent + "10" }}
            >
              <div
                className="w-1 h-8 rounded-full"
                style={{ backgroundColor: colors.primary }}
              ></div>
              <h2 className="text-xl font-black" style={{ color: colors.text }}>
                Blog Content
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2.5">
                <label
                  className="text-sm font-bold"
                  style={{ color: colors.text }}
                >
                  Title
                </label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter blog title"
                  className="w-full px-4 py-3.5 rounded-xl border-2 outline-none transition-all font-medium"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.accent + "30",
                    color: colors.text,
                  }}
                />
              </div>
              <div className="space-y-2.5">
                <label
                  className="text-sm font-bold"
                  style={{ color: colors.text }}
                >
                  Category
                </label>
                <input
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Enter category name"
                  className="w-full px-4 py-3.5 rounded-xl border-2 outline-none transition-all font-medium"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.accent + "30",
                    color: colors.text,
                  }}
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <label
                className="text-sm font-bold"
                style={{ color: colors.text }}
              >
                Excerpt (Short Description)
              </label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                placeholder="Brief summary of the blog"
                rows={4}
                className="w-full px-4 py-3.5 rounded-xl border-2 outline-none transition-all font-medium"
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.accent + "30",
                  color: colors.text,
                }}
              />
            </div>

            <div className="space-y-2.5">
              <label
                className="text-sm font-bold"
                style={{ color: colors.text }}
              >
                Introduction
              </label>
              <textarea
                name="introduction"
                value={formData.introduction}
                onChange={handleChange}
                placeholder="Introductory paragraph"
                rows={4}
                className="w-full px-4 py-3.5 rounded-xl border-2 outline-none transition-all font-medium"
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.accent + "30",
                  color: colors.text,
                }}
              />
            </div>

            <div className="space-y-2.5">
              <label
                className="text-sm font-bold"
                style={{ color: colors.text }}
              >
                Content
              </label>
              <div
                className="min-h-[400px] rounded-xl overflow-hidden border-2"
                style={{ borderColor: colors.accent + "30" }}
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
                className="w-full px-4 py-3.5 rounded-xl border-2 outline-none transition-all font-medium resize-none"
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.accent + "30",
                  color: colors.text,
                }}
              />
            </div>
          </div>

          {/* Middle Section: Image and Related Blogs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image Upload */}
            <div
              className="p-8 rounded-2xl border shadow-xl space-y-4"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.accent + "30",
              }}
            >
              <div
                className="flex items-center gap-3 pb-3 border-b-2"
                style={{ borderColor: colors.accent + "10" }}
              >
                <div
                  className="w-1 h-6 rounded-full"
                  style={{ backgroundColor: colors.primary }}
                ></div>
                <h3
                  className="text-lg font-black"
                  style={{ color: colors.text }}
                >
                  Blog Image
                </h3>
              </div>
              <div
                className="relative aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden group hover:border-primary/50 transition-colors"
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
              className="p-8 rounded-2xl border shadow-xl space-y-4"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.accent + "30",
              }}
            >
              <div
                className="flex items-center gap-3 pb-3 border-b-2"
                style={{ borderColor: colors.accent + "10" }}
              >
                <div
                  className="w-1 h-6 rounded-full"
                  style={{ backgroundColor: colors.primary }}
                ></div>
                <h3
                  className="text-lg font-black"
                  style={{ color: colors.text }}
                >
                  Related Blogs
                </h3>
              </div>
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
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-4 rounded-xl font-bold shadow-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 cursor-pointer"
              style={{
                backgroundColor: colors.primary,
                color: colors.background,
              }}
            >
              {saving ? <Loader size={22} color="#fff" /> : "Update Blog"}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-12 py-4 rounded-xl font-bold border-2 hover:bg-black/5 transition-all cursor-pointer"
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
