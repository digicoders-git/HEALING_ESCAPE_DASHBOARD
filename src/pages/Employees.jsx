import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import {
  getEmployees,
  deleteEmployee,
  toggleEmployeeStatus,
} from "../apis/employee";
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

const Employees = () => {
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
    fetchEmployees();
  }, [pagination.page, debouncedSearch, filters.isActive]);

  const fetchEmployees = async () => {
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

      const response = await getEmployees(params);
      if (response.success) {
        setData(response.data || []);
        setPagination({
          page: response.page || pagination.page,
          limit: pagination.limit,
          total: response.total || 0,
          pages:
            response.pages ||
            Math.ceil((response.total || 0) / pagination.limit),
        });
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      Swal.fire("Error", "Failed to fetch employees", "error");
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
          await deleteEmployee(id);
          Swal.fire({
            title: "Deleted!",
            text: "Employee has been deleted.",
            icon: "success",
            background: colors.background,
            color: colors.text,
          });
          fetchEmployees();
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: "Failed to delete employee",
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
      await toggleEmployeeStatus(id);
      fetchEmployees();
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

  const handleImageClick = (imageUrl, name) => {
    Swal.fire({
      imageUrl: imageUrl,
      imageAlt: name,
      showConfirmButton: false,
      showCloseButton: true,
      width: "auto",
      background: colors.background,
    });
  };

  const totalPages = pagination.pages || 0;

  const statusOptions = [
    { label: "All Status", value: "" },
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen md:h-screen flex flex-col md:overflow-hidden">
      {/* Fixed Header and Filters */}
      <div
        className="shrink-0 p-4 md:p-6 pb-4 z-30 relative"
        style={{ backgroundColor: colors.background }}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold" style={{ color: colors.text }}>
                Employees
              </h1>
              {loading ? (
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 animate-pulse">
                  <div className="w-4 h-4 rounded-full border-2 border-gray-400 border-t-transparent animate-spin"></div>
                </div>
              ) : (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm"
                  style={{
                    backgroundColor: colors.primary,
                    color: colors.background,
                  }}
                  title="Total Employees"
                >
                  {pagination.total}
                </div>
              )}
            </div>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              Manage all CRM employees
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboard/employee/add")}
            className="flex items-center gap-2 px-4 py-2 rounded shadow transition-all hover:scale-105 active:scale-95 cursor-pointer"
            style={{ backgroundColor: colors.text, color: colors.background }}
          >
            <MdAdd size={20} /> Add Employee
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <MdSearch
              className="absolute left-3 top-3 z-10"
              style={{ color: colors.textSecondary }}
            />
            <input
              type="text"
              placeholder="Search employee by name, email or phone..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              className="w-full pl-10 pr-4 py-[6px] rounded border outline-none focus:ring-1"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.accent + "40",
                color: colors.text,
              }}
            />
          </div>

          {/* Status Filter */}
          <div className="w-full md:w-auto md:min-w-[180px]">
            <ModernSelect
              options={statusOptions}
              value={filters.isActive}
              onChange={(value) => setFilters({ ...filters, isActive: value })}
              placeholder="All Status"
            />
          </div>
        </div>
      </div>

      {/* Scrollable Table */}
      <div className="flex-1 px-4 md:px-6 pb-4 md:pb-6 flex flex-col">
        <div
          className="md:flex-1 md:overflow-auto overflow-x-auto rounded-lg border shadow-sm relative"
          style={{ borderColor: colors.accent + "30" }}
        >
          <table className="w-full text-left border-collapse">
            <thead
              className="sticky top-0 z-20"
              style={{ backgroundColor: colors.background }}
            >
              <tr>
                <th
                  className="p-4 font-bold text-sm sticky top-0 z-10 border-b"
                  style={{
                    color: colors.text,
                    backgroundColor: colors.background,
                    borderColor: colors.primary + "30",
                  }}
                >
                  #
                </th>
                <th
                  className="p-4 font-bold text-sm sticky top-0 z-10 border-b"
                  style={{
                    color: colors.text,
                    backgroundColor: colors.background,
                    borderColor: colors.primary + "30",
                  }}
                >
                  Profile
                </th>
                <th
                  className="p-4 font-bold text-sm sticky top-0 z-10 border-b"
                  style={{
                    color: colors.text,
                    backgroundColor: colors.background,
                    borderColor: colors.primary + "30",
                  }}
                >
                  Name
                </th>
                <th
                  className="p-4 font-bold text-sm sticky top-0 z-10 border-b"
                  style={{
                    color: colors.text,
                    backgroundColor: colors.background,
                    borderColor: colors.primary + "30",
                  }}
                >
                  Contact
                </th>
                <th
                  className="p-4 font-bold text-sm sticky top-0 z-10 border-b"
                  style={{
                    color: colors.text,
                    backgroundColor: colors.background,
                    borderColor: colors.primary + "30",
                  }}
                >
                  Role
                </th>
                <th
                  className="p-4 font-bold text-sm sticky top-0 z-10 border-b"
                  style={{
                    color: colors.text,
                    backgroundColor: colors.background,
                    borderColor: colors.primary + "30",
                  }}
                >
                  Last Login
                </th>
                <th
                  className="p-4 font-bold text-sm text-center sticky top-0 z-10 border-b"
                  style={{
                    color: colors.text,
                    backgroundColor: colors.background,
                    borderColor: colors.primary + "30",
                  }}
                >
                  Leads Assigned
                </th>
                <th
                  className="p-4 font-bold text-sm text-center sticky top-0 z-10 border-b"
                  style={{
                    color: colors.text,
                    backgroundColor: colors.background,
                    borderColor: colors.primary + "30",
                  }}
                >
                  Leads Closed
                </th>
                <th
                  className="p-4 font-bold text-sm sticky top-0 z-10 border-b"
                  style={{
                    color: colors.text,
                    backgroundColor: colors.background,
                    borderColor: colors.primary + "30",
                  }}
                >
                  Status
                </th>
                <th
                  className="p-4 font-bold text-sm text-right sticky top-0 z-10 border-b"
                  style={{
                    color: colors.text,
                    backgroundColor: colors.background,
                    borderColor: colors.primary + "30",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="10" className="p-10 text-center">
                    <div className="flex justify-center">
                      <Loader size={40} />
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan="10"
                    className="p-10 text-center font-medium"
                    style={{ color: colors.textSecondary }}
                  >
                    No employees found.
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
                    <td
                      className="p-4 text-sm"
                      style={{ color: colors.textSecondary }}
                    >
                      {(pagination.page - 1) * pagination.limit + index + 1}
                    </td>
                    <td className="p-4">
                      <img
                        src={
                          item.profilePhoto?.url ||
                          "https://via.placeholder.com/150"
                        }
                        alt={item.name}
                        className="w-12 h-12 rounded-full object-cover border cursor-pointer hover:opacity-80 transition-opacity"
                        style={{ borderColor: colors.accent + "20" }}
                        onClick={() =>
                          handleImageClick(item.profilePhoto?.url, item.name)
                        }
                      />
                    </td>
                    <td
                      className="p-4 font-medium"
                      style={{ color: colors.text }}
                    >
                      <div>
                        <div className="font-bold">{item.name}</div>
                        <div className="text-xs opacity-70">{item.email}</div>
                      </div>
                    </td>
                    <td
                      className="p-4 text-sm"
                      style={{ color: colors.textSecondary }}
                    >
                      {item.phone}
                    </td>
                    <td
                      className="p-4 text-sm"
                      style={{ color: colors.textSecondary }}
                    >
                      <div className="font-semibold">{item.designation}</div>
                      <div className="text-xs italic">{item.department}</div>
                    </td>
                    <td
                      className="p-4 text-xs"
                      style={{ color: colors.textSecondary }}
                    >
                      {formatDate(item.lastLogin)}
                    </td>
                    <td
                      className="p-4 text-center"
                      style={{ color: colors.text }}
                    >
                      <span
                        className="font-bold text-lg"
                        style={{ color: colors.primary }}
                      >
                        {item.totalLeadsAssigned || 0}
                      </span>
                    </td>
                    <td
                      className="p-4 text-center"
                      style={{ color: colors.text }}
                    >
                      <span
                        className="font-bold text-lg"
                        style={{ color: colors.primary }}
                      >
                        {item.totalLeadsClosed || 0}
                      </span>
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
                            navigate(`/dashboard/employee/view/${item._id}`)
                          }
                          className="p-2 rounded hover:bg-green-100 text-green-600 transition-colors cursor-pointer"
                          title="View"
                        >
                          <MdVisibility size={18} />
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/dashboard/employee/edit/${item._id}`)
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
      </div>

      {/* Pagination */}
      {!loading && data.length > 0 && (
        <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4 px-4 md:px-0">
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
              disabled={pagination.page === totalPages || totalPages === 0}
              onClick={() =>
                setPagination({ ...pagination, page: pagination.page + 1 })
              }
              className={`px-3 py-1 rounded border text-sm transition-all cursor-pointer ${
                pagination.page === totalPages || totalPages === 0
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

export default Employees;
