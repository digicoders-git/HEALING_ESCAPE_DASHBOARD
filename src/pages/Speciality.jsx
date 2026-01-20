import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import {
  getSpecialities,
  deleteSpeciality,
  updateSpecialityStatus,
} from "../apis/speciality";
import {
  MdEdit,
  MdDelete,
  MdAdd,
  MdSearch,
  MdVisibility,
} from "react-icons/md";
import Loader from "../components/ui/Loader";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import ModernSelect from "../components/ModernSelect";
import Toggle from "../components/ui/Toggle";

const Speciality = () => {
  const { colors } = useTheme();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({ search: "", isActive: "" });
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 500);
    return () => clearTimeout(handler);
  }, [filters.search]);

  useEffect(() => {
    fetchSpecialities();
  }, [pagination.page, debouncedSearch, filters.isActive]);

  const fetchSpecialities = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch,
      };
      if (filters.isActive !== "") {
        params.isActive = filters.isActive;
      }

      const response = await getSpecialities(params);
      if (response.success) {
        setData(response.specialities);
        setPagination((prev) => ({ ...prev, total: response.total }));
      }
    } catch (error) {
      console.error("Error fetching specialities:", error);
      Swal.fire("Error", "Failed to fetch specialities", "error");
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
          await deleteSpeciality(id);
          Swal.fire({
            title: "Deleted!",
            text: "Speciality has been deleted.",
            icon: "success",
            background: colors.background,
            color: colors.text,
          });
          fetchSpecialities();
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: "Failed to delete speciality",
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

  const handleStatusUpdate = async (id) => {
    try {
      await updateSpecialityStatus(id);
      fetchSpecialities();
      const toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: colors.background,
        color: colors.text,
      });
      toast.fire({
        icon: "success",
        title: "Status updated successfully",
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Failed to update status",
        icon: "error",
        background: colors.background,
        color: colors.text,
      });
    }
  };

  const handleImageClick = (imageUrl, title) => {
    Swal.fire({
      imageUrl: imageUrl,
      imageAlt: title,
      showConfirmButton: false,
      showCloseButton: true,
      width: "auto",
      background: colors.background,
    });
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  const statusOptions = [
    { label: "All Status", value: "" },
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ];

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: colors.text }}>
            Specialities
          </h1>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            Manage all medical specialities
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard/speciality/add")}
          className="flex items-center gap-2 px-4 py-2 rounded shadow transition-all hover:scale-105 active:scale-95 cursor-pointer"
          style={{ backgroundColor: colors.text, color: colors.background }}
        >
          <MdAdd size={20} /> Add Speciality
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search Input - Takes more width */}
        <div className="relative flex-1">
          <MdSearch
            className="absolute left-3 top-3 z-10"
            style={{ color: colors.textSecondary }}
          />
          <input
            type="text"
            placeholder="Search speciality..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full pl-10 pr-4 py-[6px] rounded border outline-none focus:ring-1"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.accent + "40",
              color: colors.text,
            }}
          />
        </div>

        {/* Status Filter - Minimal width */}
        <div className="w-full md:w-auto md:min-w-[180px]">
          <ModernSelect
            options={statusOptions}
            value={filters.isActive}
            onChange={(value) => setFilters({ ...filters, isActive: value })}
            placeholder="All Status"
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
                Image
              </th>
              <th
                className="p-4 font-semibold text-sm"
                style={{ color: colors.textSecondary }}
              >
                Title
              </th>
              <th
                className="p-4 font-semibold text-sm"
                style={{ color: colors.textSecondary }}
              >
                Description
              </th>
              <th
                className="p-4 font-semibold text-sm"
                style={{ color: colors.textSecondary }}
              >
                Status
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
                <td colSpan="5" className="p-10 text-center">
                  <div className="flex justify-center">
                    <Loader size={40} />
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="p-10 text-center font-medium"
                  style={{ color: colors.textSecondary }}
                >
                  No specialities found.
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={item._id}
                  className="border-b last:border-0 hover:bg-black/5 transition-colors"
                  style={{ borderColor: colors.accent + "20" }}
                >
                  <td className="p-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-12 h-12 rounded object-cover border cursor-pointer hover:opacity-80 transition-opacity"
                      style={{ borderColor: colors.accent + "20" }}
                      onClick={() => handleImageClick(item.image, item.title)}
                    />
                  </td>
                  <td
                    className="p-4 font-medium"
                    style={{ color: colors.text }}
                  >
                    {item.title}
                  </td>
                  <td
                    className="p-4 text-sm max-w-xs truncate"
                    style={{ color: colors.textSecondary }}
                  >
                    {item.description}
                  </td>
                  <td className="p-4">
                    <Toggle
                      checked={item.isActive}
                      onChange={() => handleStatusUpdate(item._id)}
                    />
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() =>
                          navigate(`/dashboard/speciality/view/${item._id}`)
                        }
                        className="p-2 rounded hover:bg-green-100 text-green-600 transition-colors cursor-pointer"
                        title="View"
                      >
                        <MdVisibility size={18} />
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/dashboard/speciality/edit/${item._id}`)
                        }
                        className="p-2 rounded hover:bg-blue-100 text-blue-600 transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <MdEdit size={18} />
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
              ),
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

export default Speciality;
