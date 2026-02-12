import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { getEnquiries, deleteEnquiry } from "../apis/enquiry";
import { MdEdit, MdDelete, MdSearch, MdVisibility } from "react-icons/md";
import Loader from "../components/ui/Loader";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Enquiry = () => {
  const { colors } = useTheme();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({ search: "" });
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
  }, [debouncedSearch]);

  useEffect(() => {
    fetchData();
  }, [pagination.page, debouncedSearch]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };
      if (debouncedSearch) params.search = debouncedSearch;

      const response = await getEnquiries(params);

      if (response.success) {
        setData(response.data || []);
        setPagination((prev) => ({ ...prev, total: response.total || 0 }));
      } else {
        setData([]);
        setPagination({ page: 1, limit: 10, total: 0 });
      }
    } catch (error) {
      console.error("Error:", error);
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
          await deleteEnquiry(id);
          Swal.fire({
            title: "Deleted!",
            text: "Enquiry has been deleted.",
            icon: "success",
            background: colors.background,
            color: colors.text,
          });
          fetchData();
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: "Failed to delete enquiry",
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

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <div className="min-h-screen md:h-screen flex flex-col md:overflow-hidden">
      {/* Header */}
      <div className="shrink-0 p-4 md:p-6 pb-4" style={{ backgroundColor: colors.background }}>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black" style={{ color: '#000000' }}>
                Enquiries
              </h1>
              {loading ? (
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-50 animate-pulse">
                  <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#006cb5' }}></div>
                </div>
              ) : (
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black shadow-lg"
                  style={{
                    backgroundColor: '#006cb5',
                    color: '#ffffff',
                  }}
                  title="Total Enquiries"
                >
                  {pagination.total}
                </div>
              )}
            </div>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              Manage all general enquiries
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="shrink-0 px-4 md:px-6 pb-4">
        <div className="flex gap-4">
          <div className="relative w-full">
            <MdSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
              style={{ color: '#006cb5' }}
              size={22}
            />
            <input
              type="text"
              placeholder="Search by name, email, phone, country, city, message..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 outline-none transition-all font-medium shadow-sm"
              style={{
                backgroundColor: '#ffffff',
                borderColor: '#e5e7eb',
                color: '#000000',
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
                backgroundColor: '#006cb5',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            >
              <tr>
                <th
                  className="p-4 font-bold text-sm w-16 text-white"
                >
                  S.No
                </th>
                <th
                  className="p-4 font-bold text-sm text-white"
                >
                  Full Name
                </th>
                <th
                  className="p-4 font-bold text-sm text-white"
                >
                  Email
                </th>
                <th
                  className="p-4 font-bold text-sm text-white"
                >
                  Phone
                </th>
                <th
                  className="p-4 font-bold text-sm text-white"
                >
                  Country
                </th>
                <th
                  className="p-4 font-bold text-sm text-white"
                >
                  Message
                </th>
                <th
                  className="p-4 font-bold text-sm text-right text-white"
                >
                  Actions
                </th>
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
                    No enquiries found.
                  </td>
                </tr>
              ) : (
                data.map((item, index) => (
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
                    <td
                      className="p-4 font-bold text-base"
                      style={{ color: '#006cb5' }}
                    >
                      {item.fullName}
                    </td>
                    <td className="p-4 text-sm" style={{ color: colors.text }}>
                      {item.email}
                    </td>
                    <td
                      className="p-4 text-sm"
                      style={{
                        color:
                          item.phone?.length > 15 ? "#ef4444" : colors.text,
                      }}
                      title={
                        item.phone?.length > 15 ? "Invalid contact detail" : ""
                      }
                    >
                      {item.phone}
                      {item.phone?.length > 15 && (
                        <span className="block text-[10px] font-bold">
                          &gt; 15 digits
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-sm" style={{ color: colors.text }}>
                      {item.country}
                    </td>
                    <td
                      className="p-4 text-sm max-w-xs truncate"
                      style={{ color: colors.textSecondary }}
                    >
                      {item.message}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            navigate(`/dashboard/enquiry/view/${item._id}`)
                          }
                          className="p-2.5 rounded-xl transition-all hover:scale-110 cursor-pointer shadow-sm"
                          style={{ backgroundColor: '#1db64c20', color: '#1db64c' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#1db64c';
                            e.currentTarget.style.color = '#ffffff';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#1db64c20';
                            e.currentTarget.style.color = '#1db64c';
                          }}
                          title="View"
                        >
                          <MdVisibility size={20} />
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/dashboard/enquiry/edit/${item._id}`)
                          }
                          className="p-2.5 rounded-xl transition-all hover:scale-110 cursor-pointer shadow-sm"
                          style={{ backgroundColor: '#006cb520', color: '#006cb5' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#006cb5';
                            e.currentTarget.style.color = '#ffffff';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#006cb520';
                            e.currentTarget.style.color = '#006cb5';
                          }}
                          title="Edit"
                        >
                          <MdEdit size={20} />
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
                ))
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
                  setPagination({ ...pagination, page: pagination.page + 1 })
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

export default Enquiry;
