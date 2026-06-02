import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { getCareers, deleteCareer } from "../apis/career";
import { MdDelete, MdSearch, MdVisibility, MdOutlineWork } from "react-icons/md";
import Loader from "../components/ui/Loader";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const CareersAdmin = () => {
  const { colors } = useTheme();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    search: "",
    formType: "All",
  });
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const isMounted = React.useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    const handler = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 500);
    return () => clearTimeout(handler);
  }, [filters.search]);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [debouncedSearch, filters.formType]);

  useEffect(() => {
    fetchData();
  }, [pagination.page, debouncedSearch, filters.formType]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };
      if (debouncedSearch) params.search = debouncedSearch;
      if (filters.formType !== "All") params.formType = filters.formType;

      const response = await getCareers(params);

      if (response.success) {
        setData(response.data || []);
        setPagination((prev) => ({ ...prev, total: response.total || 0 }));
      } else {
        setData([]);
        setPagination({ page: 1, limit: 10, total: 0 });
      }
    } catch (error) {
      console.error("Error fetching careers:", error);
      setData([]);
      setPagination({ page: 1, limit: 10, total: 0 });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      background: colors.background,
      color: colors.text,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setDeletingId(id);
          await deleteCareer(id);
          Swal.fire({
            title: "Deleted!",
            text: "Application has been deleted.",
            icon: "success",
            background: colors.background,
            color: colors.text,
          });
          fetchData();
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: "Failed to delete application",
            icon: "error",
            background: colors.background,
            color: colors.text,
          });
        } finally {
          setDeletingId(null);
        }
      }
    });
  };

  const getFormTypeLabel = (type) => {
    switch (type) {
      case "global_ambassador":
        return "Global Ambassador";
      case "internship":
        return "Internship";
      case "full_time":
        return "Full-Time Role";
      case "b2b_partnership":
        return "B2B Partnership";
      default:
        return type;
    }
  };

  const getFormTypeBadgeColor = (type) => {
    switch (type) {
      case "global_ambassador":
        return { bg: "bg-purple-100", text: "text-purple-800" };
      case "internship":
        return { bg: "bg-amber-100", text: "text-amber-800" };
      case "full_time":
        return { bg: "bg-blue-100", text: "text-blue-800" };
      case "b2b_partnership":
        return { bg: "bg-teal-100", text: "text-teal-800" };
      default:
        return { bg: "bg-gray-100", text: "text-gray-800" };
    }
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <div className="min-h-screen md:h-screen flex flex-col md:overflow-hidden">
      {/* Header */}
      <div className="shrink-0 p-4 md:p-6 pb-4" style={{ backgroundColor: colors.background }}>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black flex items-center gap-2" style={{ color: "#000000" }}>
                <MdOutlineWork className="text-[#006cb5]" />
                Career & B2B Submissions
              </h1>
              {loading ? (
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-50 animate-pulse">
                  <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "#006cb5" }}></div>
                </div>
              ) : (
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black shadow-lg"
                  style={{
                    backgroundColor: "#006cb5",
                    color: "#ffffff",
                  }}
                  title="Total Submissions"
                >
                  {pagination.total}
                </div>
              )}
            </div>
            <p className="text-sm pt-1" style={{ color: colors.textSecondary }}>
              Manage all job, internship, ambassador applications and B2B partnership requests
            </p>
          </div>
        </div>
      </div>

      {/* Tabs / Filters */}
      <div className="shrink-0 px-4 md:px-6 pb-2 flex gap-2 flex-wrap">
        {[
          { key: "All", label: "All Submissions" },
          { key: "global_ambassador", label: "Global Ambassador" },
          { key: "internship", label: "Internship" },
          { key: "full_time", label: "Full-Time Role" },
          { key: "b2b_partnership", label: "B2B Partnership" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilters({ ...filters, formType: tab.key })}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer border ${
              filters.formType === tab.key
                ? "bg-[#006cb5] border-[#006cb5] text-white shadow-md scale-105"
                : "bg-white text-slate-600 hover:bg-slate-50 border-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="shrink-0 px-4 md:px-6 py-4">
        <div className="flex gap-4">
          <div className="relative w-full">
            <MdSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
              style={{ color: "#006cb5" }}
              size={22}
            />
            <input
              type="text"
              placeholder="Search by name, email, phone, city, country, designation..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 outline-none transition-all font-medium shadow-sm"
              style={{
                backgroundColor: "#ffffff",
                borderColor: "#e5e7eb",
                color: "#000000",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#006cb5";
                e.target.style.boxShadow = "0 0 0 3px rgba(0, 108, 181, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e5e7eb";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>
        </div>
      </div>

      {/* Body Container */}
      <div className="flex-1 px-4 md:px-6 pb-4 md:pb-6 flex flex-col min-h-0 md:overflow-hidden">
        {/* Table Wrapper */}
        <div
          className="md:flex-1 md:overflow-auto overflow-x-auto rounded-lg border shadow-sm relative"
          style={{ borderColor: colors.accent + "30" }}
        >
          <table className="w-full text-left border-collapse">
            <thead
              className="sticky top-0 z-20"
              style={{ 
                backgroundColor: "#006cb5",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
              }}
            >
              <tr>
                <th className="p-4 font-bold text-sm w-16 text-white">S.No</th>
                <th className="p-4 font-bold text-sm text-white">Type</th>
                <th className="p-4 font-bold text-sm text-white">Name / Organization</th>
                <th className="p-4 font-bold text-sm text-white">Email</th>
                <th className="p-4 font-bold text-sm text-white">Phone</th>
                <th className="p-4 font-bold text-sm text-white">City / Country</th>
                <th className="p-4 font-bold text-sm text-white">CV / Profile</th>
                <th className="p-4 font-bold text-sm text-right text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="p-10 text-center">
                    <div className="flex justify-center">
                      <Loader size={40} />
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="p-10 text-center font-medium"
                    style={{ color: colors.textSecondary }}
                  >
                    No submissions found.
                  </td>
                </tr>
              ) : (
                data.map((item, index) => {
                  const badge = getFormTypeBadgeColor(item.formType);
                  const isB2B = item.formType === "b2b_partnership";
                  const displayTitle = isB2B
                    ? `${item.organizationName} (${item.fullName})`
                    : item.fullName || "N/A";
                  return (
                    <tr
                      key={item._id}
                      className="border-b last:border-0 transition-colors"
                      style={{
                        borderColor: colors.accent + "20",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          colors.accent + "10")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      <td className="p-4 text-sm" style={{ color: colors.text }}>
                        {(pagination.page - 1) * pagination.limit + index + 1}
                      </td>
                      <td className="p-4 text-sm">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${badge.bg} ${badge.text}`}>
                          {getFormTypeLabel(item.formType)}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-base text-slate-800">
                        {displayTitle}
                      </td>
                      <td className="p-4 text-sm" style={{ color: colors.text }}>
                        {item.email || "—"}
                      </td>
                      <td className="p-4 text-sm" style={{ color: colors.text }}>
                        {item.phone || "—"}
                      </td>
                      <td className="p-4 text-sm" style={{ color: colors.text }}>
                        {[item.city, item.country].filter(Boolean).join(", ") || "—"}
                      </td>
                      <td className="p-4 text-sm">
                        {item.fileUrl ? (
                          <a
                            href={item.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#006cb5] hover:text-[#005a96] font-bold underline"
                          >
                            View File
                          </a>
                        ) : (
                          <span className="text-slate-400">No File</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() =>
                              navigate(`/dashboard/career/view/${item._id}`)
                            }
                            className="p-2.5 rounded-xl transition-all hover:scale-110 cursor-pointer shadow-sm"
                            style={{ backgroundColor: "#1db64c20", color: "#1db64c" }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = "#1db64c";
                              e.currentTarget.style.color = "#ffffff";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = "#1db64c20";
                              e.currentTarget.style.color = "#1db64c";
                            }}
                            title="View"
                          >
                            <MdVisibility size={20} />
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            disabled={deletingId === item._id}
                            className="p-2 rounded hover:bg-red-100 text-red-600 transition-colors cursor-pointer disabled:opacity-50"
                            title="Delete"
                          >
                            {deletingId === item._id ? (
                              <Loader size={18} color="#dc2626" />
                            ) : (
                              <MdDelete size={18} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && data.length > 0 && (
          <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4 pb-10 md:pb-0">
            <span className="text-sm" style={{ color: colors.textSecondary }}>
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              of {pagination.total} entries
            </span>
            <div className="flex gap-2 flex-wrap justify-center">
              <button
                disabled={pagination.page === 1}
                onClick={() =>
                  setPagination({ ...pagination, page: pagination.page - 1 })
                }
                className={`px-3 py-1 rounded border text-sm transition-all cursor-pointer ${
                  pagination.page === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-black/5"
                }`}
                style={{
                  borderColor: colors.accent + "30",
                  color: colors.text,
                }}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() =>
                      setPagination({ ...pagination, page: pageNum })
                    }
                    className={`px-3 py-1 rounded border text-sm transition-all cursor-pointer ${
                      pagination.page === pageNum
                        ? "font-bold"
                        : "hover:bg-black/5"
                    }`}
                    style={{
                      borderColor: colors.accent + "30",
                      backgroundColor:
                        pagination.page === pageNum
                          ? colors.primary
                          : "transparent",
                      color:
                        pagination.page === pageNum
                          ? colors.background
                          : colors.text,
                    }}
                  >
                    {pageNum}
                  </button>
                ),
              )}
              <button
                disabled={pagination.page === totalPages || totalPages === 0}
                onClick={() =>
                  setPagination({ ...pagination, page: pageNum => pageNum + 1 })
                }
                className={`px-3 py-1 rounded border text-sm transition-all cursor-pointer ${
                  pagination.page === totalPages || totalPages === 0
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-black/5"
                }`}
                style={{
                  borderColor: colors.accent + "30",
                  color: colors.text,
                }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareersAdmin;
