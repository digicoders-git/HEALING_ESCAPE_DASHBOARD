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
  const [filters, setFilters] = useState({
    country: "",
    preferredCity: "",
  });
  // console.log(filters.search)
  const [debouncedFilters, setDebouncedFilters] = useState({
    country: "",
    preferredCity: "",
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilters(filters);
      // Reset to page 1 when filters change
      setPagination(prev => ({ ...prev, page: 1 }));
    }, 500);
    return () => clearTimeout(handler);
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [pagination.page, debouncedFilters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const params = {};
      if (debouncedFilters.country) params.country = debouncedFilters.country;
      if (debouncedFilters.preferredCity) params.preferredCity = debouncedFilters.preferredCity;
      params.page = pagination.page;
      params.limit = pagination.limit;
      
      const response = await getEnquiries(params);
      
      if (response.success) {
        setData(response.data || []);
        setPagination(prev => ({ ...prev, total: response.total || 0 }));
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error:", error);
      setData([]);
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
        }
      }
    });
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: colors.text }}>
            Enquiries
          </h1>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            Manage all general enquiries
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative">
          <MdSearch
            className="absolute left-3 top-3 z-10"
            style={{ color: colors.textSecondary }}
          />
          <input
            type="text"
            placeholder="Search by Country..."
            value={filters.country}
            onChange={(e) =>
              setFilters({ ...filters, country: e.target.value })
            }
            className="w-full pl-10 pr-4 py-2.5 rounded border outline-none focus:ring-1"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.accent + "40",
              color: colors.text,
            }}
          />
        </div>
        <div className="relative">
          <MdSearch
            className="absolute left-3 top-3 z-10"
            style={{ color: colors.textSecondary }}
          />
          <input
            type="text"
            placeholder="Search by Preferred City..."
            value={filters.preferredCity}
            onChange={(e) =>
              setFilters({ ...filters, preferredCity: e.target.value })
            }
            className="w-full pl-10 pr-4 py-2.5 rounded border outline-none focus:ring-1"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.accent + "40",
              color: colors.text,
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div
        className="overflow-x-auto rounded-lg border shadow-sm"
        style={{ borderColor: colors.accent + "30" }}
      >
        <table className="w-full text-left border-collapse">
          <thead>
            <tr style={{ backgroundColor: colors.accent + "10" }}>
              <th
                className="p-4 font-semibold text-sm"
                style={{ color: colors.textSecondary }}
              >
                Full Name
              </th>
              <th
                className="p-4 font-semibold text-sm"
                style={{ color: colors.textSecondary }}
              >
                Email
              </th>
              <th
                className="p-4 font-semibold text-sm"
                style={{ color: colors.textSecondary }}
              >
                Phone
              </th>
              <th
                className="p-4 font-semibold text-sm"
                style={{ color: colors.textSecondary }}
              >
                Country
              </th>
              <th
                className="p-4 font-semibold text-sm"
                style={{ color: colors.textSecondary }}
              >
                Preferred City
              </th>
              <th
                className="p-4 font-semibold text-sm"
                style={{ color: colors.textSecondary }}
              >
                Message
              </th>
              <th
                className="p-4 font-semibold text-sm text-right"
                style={{ color: colors.textSecondary }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="p-10 text-center">
                  <div className="flex justify-center">
                    <Loader size={40} />
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="p-10 text-center font-medium"
                  style={{ color: colors.textSecondary }}
                >
                  No enquiries found.
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={item._id}
                  className="border-b last:border-0 hover:bg-black/5 transition-colors"
                  style={{ borderColor: colors.accent + "20" }}
                >
                  <td
                    className="p-4 font-medium"
                    style={{ color: colors.text }}
                  >
                    {item.fullName}
                  </td>
                  <td className="p-4 text-sm" style={{ color: colors.text }}>
                    {item.email}
                  </td>
                  <td className="p-4 text-sm" style={{ color: colors.text }}>
                    {item.phone}
                  </td>
                  <td className="p-4 text-sm" style={{ color: colors.text }}>
                    {item.country}
                  </td>
                  <td className="p-4 text-sm" style={{ color: colors.text }}>
                    {item.preferredCity}
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
                        className="p-2 rounded hover:bg-green-100 text-green-600 transition-colors cursor-pointer"
                        title="View"
                      >
                        <MdVisibility size={18} />
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/dashboard/enquiry/edit/${item._id}`)
                        }
                        className="p-2 rounded hover:bg-blue-100 text-blue-600 transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <MdEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-2 rounded hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <MdDelete size={18} />
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
        <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
          <span className="text-sm" style={{ color: colors.textSecondary }}>
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total} entries
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
              style={{ borderColor: colors.accent + "30", color: colors.text }}
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
              )
            )}
            <button
              disabled={pagination.page === totalPages}
              onClick={() =>
                setPagination({ ...pagination, page: pagination.page + 1 })
              }
              className={`px-3 py-1 rounded border text-sm transition-all cursor-pointer ${
                pagination.page === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-black/5"
              }`}
              style={{ borderColor: colors.accent + "30", color: colors.text }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Enquiry;
