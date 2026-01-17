import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { getBlogById, getBlogs } from "../apis/blog";
import {
  MdArrowBack,
  MdCalendarToday,
  MdCategory,
  MdEdit,
  MdInfo,
} from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Loader from "../components/ui/Loader";

const ViewBlog = () => {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await getBlogById(id);
      if (response.success) {
        setBlog(response.blog);

        if (response.blog.relatedIds?.length > 0) {
          const allBlogsRes = await getBlogs({ limit: 1000 });
          if (allBlogsRes.success) {
            const related = allBlogsRes.blogs.filter((b) =>
              response.blog.relatedIds.includes(b._id)
            );
            setRelatedBlogs(related);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
      Swal.fire("Error", "Failed to fetch blog details", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader size={50} />
      </div>
    );

  if (!blog)
    return (
      <div
        className="text-center py-20"
        style={{ color: colors.textSecondary }}
      >
        Article not found.
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
              View Blog Article
            </h1>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              Details of the published article
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate(`/dashboard/blog/edit/${id}`)}
          className="flex items-center gap-2 px-4 py-2 rounded font-medium shadow transition-all hover:scale-105 cursor-pointer"
          style={{
            backgroundColor: colors.primary,
            color: colors.background,
          }}
        >
          <MdEdit size={20} /> Edit Article
        </button>
      </div>

      <div className="max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div
            className="rounded-lg border p-6"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.accent + "30",
            }}
          >
            {/* Featured Image */}
            <div className="mb-6">
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.textSecondary }}
              >
                Featured Image
              </label>
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full aspect-video object-cover rounded-lg border"
                style={{ borderColor: colors.accent + "20" }}
              />
            </div>

            <div className="space-y-6">
              <h2
                className="text-3xl font-bold leading-tight"
                style={{ color: colors.text }}
              >
                {blog.title}
              </h2>

              <div className="flex flex-wrap gap-3">
                <div
                  className="flex items-center gap-2 py-1 px-3 rounded-full border text-xs font-bold"
                  style={{
                    backgroundColor: colors.accent + "05",
                    borderColor: colors.accent + "20",
                    color: colors.primary,
                  }}
                >
                  <MdCategory size={14} />
                  {blog.category}
                </div>
                <div
                  className="flex items-center gap-2 py-1 px-3 rounded-full border text-xs font-bold"
                  style={{
                    backgroundColor: colors.accent + "05",
                    borderColor: colors.accent + "20",
                    color: colors.textSecondary,
                  }}
                >
                  <MdCalendarToday size={14} />
                  {blog.date}
                </div>
                <div
                  className={`flex items-center gap-2 py-1 px-3 rounded-full border text-xs font-bold ${
                    blog.isActive
                      ? "bg-green-50 border-green-200 text-green-600"
                      : "bg-red-50 border-red-200 text-red-500"
                  }`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      blog.isActive ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  {blog.isActive ? "Published" : "Draft"}
                </div>
              </div>

              <div
                className="space-y-4 pt-4 border-t"
                style={{ borderColor: colors.accent + "10" }}
              >
                <section>
                  <label
                    className="block text-xs font-bold uppercase tracking-wider mb-2"
                    style={{ color: colors.textSecondary }}
                  >
                    Excerpt
                  </label>
                  <p className="italic text-lg" style={{ color: colors.text }}>
                    "{blog.excerpt}"
                  </p>
                </section>

                <section>
                  <label
                    className="block text-xs font-bold uppercase tracking-wider mb-2"
                    style={{ color: colors.textSecondary }}
                  >
                    Introduction
                  </label>
                  <p
                    className="leading-relaxed opacity-80"
                    style={{ color: colors.text }}
                  >
                    {blog.introduction}
                  </p>
                </section>

                <section>
                  <label
                    className="block text-xs font-bold uppercase tracking-wider mb-2"
                    style={{ color: colors.textSecondary }}
                  >
                    Full Content
                  </label>
                  <div
                    className="whitespace-pre-wrap leading-relaxed space-y-4"
                    style={{ color: colors.text }}
                  >
                    {blog.content}
                  </div>
                </section>

                <section className="p-4 rounded-lg bg-black/5">
                  <h3
                    className="text-sm font-bold flex items-center gap-2 mb-2"
                    style={{ color: colors.primary }}
                  >
                    <MdInfo size={18} /> Why This Matters
                  </h3>
                  <p
                    className="text-sm opacity-80"
                    style={{ color: colors.text }}
                  >
                    {blog.whyThisMatters}
                  </p>
                </section>
              </div>
            </div>
          </div>
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
              Related Stories
            </h3>
            <div className="space-y-4">
              {relatedBlogs.map((rBlog) => (
                <div
                  key={rBlog._id}
                  onClick={() => navigate(`/dashboard/blog/view/${rBlog._id}`)}
                  className="flex gap-3 group cursor-pointer border-b pb-3 last:border-0 last:pb-0"
                  style={{ borderColor: colors.accent + "10" }}
                >
                  <img
                    src={rBlog.image}
                    alt=""
                    className="w-16 h-16 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex flex-col justify-center min-w-0">
                    <h4
                      className="text-sm font-bold group-hover:text-primary transition-colors line-clamp-2"
                      style={{ color: colors.text }}
                    >
                      {rBlog.title}
                    </h4>
                    <span
                      className="text-[10px] opacity-60 uppercase font-black tracking-widest mt-1"
                      style={{ color: colors.textSecondary }}
                    >
                      {rBlog.category}
                    </span>
                  </div>
                </div>
              ))}
              {relatedBlogs.length === 0 && (
                <p
                  className="text-sm text-center py-4 opacity-50"
                  style={{ color: colors.textSecondary }}
                >
                  No related stories linked
                </p>
              )}
            </div>
          </div>

          <div
            className="rounded-lg border p-6 text-[11px]"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.accent + "30",
            }}
          >
            <h4 className="font-bold border-b mb-3 pb-2 uppercase tracking-widest opacity-40">
              Article Data
            </h4>
            <div className="space-y-2 opacity-80">
              <div className="flex justify-between">
                <span>Created</span>
                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Updated</span>
                <span>{new Date(blog.updatedAt).toLocaleDateString()}</span>
              </div>
              <div
                className="pt-2 border-t mt-2"
                style={{ borderColor: colors.accent + "10" }}
              >
                <span className="block mb-1 opacity-50 uppercase tracking-tighter">
                  Database ID
                </span>
                <span className="font-mono break-all">{blog._id}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBlog;
