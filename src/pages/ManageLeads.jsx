import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import {
  getFreeConsultations,
  deleteFreeConsultation,
  assignLeads,
  unassignLeads,
  getUnassignedLeads,
  getLeadsByEmployee,
} from "../apis/freeConsultation";
import { getEmployees } from "../apis/employee";
import {
  MdEdit,
  MdDelete,
  MdAdd,
  MdSearch,
  MdVisibility,
} from "react-icons/md";
import Loader from "../components/ui/Loader";
import LeadFormModal from "../components/LeadFormModal";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import ModernSelect from "../components/ModernSelect";

const ManageLeads = () => {
  const { colors } = useTheme();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    search: "",
    source: "",
    leadStatus: "",
    assignedTo: "",
  });
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [unassigning, setUnassigning] = useState(false);

  // New Modal States
  const [editingLead, setEditingLead] = useState(null);
  const [viewMode, setViewMode] = useState("all"); // all, unassigned, byEmployee
  const [selectedEmployeeForView, setSelectedEmployeeForView] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 500);
    return () => clearTimeout(handler);
  }, [filters.search]);

  useEffect(() => {
    fetchLeads();
  }, [
    pagination.page,
    debouncedSearch,
    filters.source,
    filters.leadStatus,
    filters.assignedTo,
    viewMode,
    selectedEmployeeForView,
  ]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await getEmployees({ limit: 1000 });
      if (response.success) {
        setEmployees(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch,
      };

      // Add filters only if not in special view modes
      if (viewMode === "all") {
        if (filters.source) params.source = filters.source;
        if (filters.leadStatus) params.leadStatus = filters.leadStatus;
        if (filters.assignedTo) params.assignedTo = filters.assignedTo;
      }

      let response;
      if (viewMode === "unassigned") {
        response = await getUnassignedLeads(params);
      } else if (viewMode === "byEmployee" && selectedEmployeeForView) {
        response = await getLeadsByEmployee(selectedEmployeeForView, params);
      } else {
        response = await getFreeConsultations(params);
      }

      if (response.success) {
        setData(response.data || []);
        setPagination({
          page: response.page || pagination.page,
          limit: pagination.limit,
          total: response.total || 0,
          pages:
            response.totalPages ||
            Math.ceil((response.total || 0) / pagination.limit),
        });
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
      Swal.fire("Error", "Failed to fetch leads", "error");
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
          await deleteFreeConsultation(id);
          Swal.fire({
            title: "Deleted!",
            text: "Lead has been deleted.",
            icon: "success",
            background: colors.background,
            color: colors.text,
          });
          fetchLeads();
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: "Failed to delete lead",
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

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase();
    const statusColors = {
      new: "bg-blue-100 text-blue-700",
      contacted: "bg-yellow-100 text-yellow-700",
      "in-progress": "bg-indigo-100 text-indigo-700",
      qualified: "bg-green-100 text-green-700",
      lost: "bg-red-100 text-red-700",
      won: "bg-emerald-100 text-emerald-700",
    };
    return statusColors[s] || "bg-gray-100 text-gray-700";
  };

  const getSourceBadge = (source) => {
    const sourceColors = {
      web: "bg-purple-100 text-purple-700",
      admin: "bg-indigo-100 text-indigo-700",
      employee: "bg-cyan-100 text-cyan-700",
    };
    return sourceColors[source] || "bg-gray-100 text-gray-700";
  };

  const handleAssignLeads = async () => {
    if (!selectedEmployee) {
      Swal.fire("Error", "Please select an employee", "error");
      return;
    }
    if (selectedLeads.length === 0) {
      Swal.fire("Error", "Please select at least one lead", "error");
      return;
    }

    const employee = employees.find((emp) => emp._id === selectedEmployee);

    Swal.fire({
      title: "Confirm Assignment",
      html: `Assign <strong>${selectedLeads.length}</strong> lead(s) to:<br/><br/><strong>${employee?.name}</strong><br/>${employee?.phone}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, assign!",
      background: colors.background,
      color: colors.text,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setAssigning(true);
          await assignLeads({
            employeeId: selectedEmployee,
            leadIds: selectedLeads,
          });
          Swal.fire({
            title: "Assigned!",
            text: `${selectedLeads.length} lead(s) assigned successfully.`,
            icon: "success",
            background: colors.background,
            color: colors.text,
          });
          setSelectedLeads([]);
          setSelectedEmployee("");
          setShowAssignModal(false);
          fetchLeads();
        } catch (error) {
          console.error("Error assigning leads:", error);
          Swal.fire({
            title: "Error",
            text: "Failed to assign leads",
            icon: "error",
            background: colors.background,
            color: colors.text,
          });
        } finally {
          setAssigning(false);
        }
      }
    });
  };

  const handleSelectLead = (leadId) => {
    setSelectedLeads((prev) =>
      prev.includes(leadId)
        ? prev.filter((id) => id !== leadId)
        : [...prev, leadId],
    );
  };

  const handleSelectAll = () => {
    if (selectedLeads.length === data.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(data.map((item) => item._id));
    }
  };

  const isAllSelected = data.length > 0 && selectedLeads.length === data.length;

  const handleUnassignLeads = () => {
    if (selectedLeads.length === 0) {
      Swal.fire("Error", "Please select at least one lead", "error");
      return;
    }

    Swal.fire({
      title: "Confirm Unassignment",
      html: `Unassign <strong>${selectedLeads.length}</strong> lead(s)?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, unassign!",
      background: colors.background,
      color: colors.text,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setUnassigning(true);
          await unassignLeads({
            leadIds: selectedLeads,
          });
          Swal.fire({
            title: "Unassigned!",
            text: `${selectedLeads.length} lead(s) unassigned successfully.`,
            icon: "success",
            background: colors.background,
            color: colors.text,
          });
          setSelectedLeads([]);
          fetchLeads();
        } catch (error) {
          console.error("Error unassigning leads:", error);
          Swal.fire({
            title: "Error",
            text: "Failed to unassign leads",
            icon: "error",
            background: colors.background,
            color: colors.text,
          });
        } finally {
          setUnassigning(false);
        }
      }
    });
  };

  const handleEmployeeClick = (employeeId) => {
    navigate(`/dashboard/employee/view/${employeeId}`);
  };

  const handleResetView = () => {
    setViewMode("all");
    setSelectedEmployeeForView("");
    setPagination({ ...pagination, page: 1 });
    setSelectedLeads([]);
  };

  const handleShowUnassigned = () => {
    setViewMode("unassigned");
    setPagination({ ...pagination, page: 1 });
    setSelectedLeads([]);
  };

  const totalPages = pagination.pages || 0;

  const sourceOptions = [
    { label: "All Sources", value: "" },
    { label: "Web", value: "web" },
    { label: "Admin", value: "admin" },
    { label: "Employee", value: "employee" },
  ];

  const statusOptions = [
    { label: "All Status", value: "" },
    { label: "New", value: "new" },
    { label: "Contacted", value: "contacted" },
    { label: "Qualified", value: "qualified" },
    { label: "Lost", value: "lost" },
  ];

  const employeeOptions = [
    { label: "All Employees", value: "" },
    ...employees.map((emp) => ({
      label: emp.name,
      value: emp._id,
    })),
  ];

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
                Manage Leads
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
                  title="Total Leads"
                >
                  {pagination.total}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 mt-1">
              {viewMode === "byEmployee" && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                  Employee View
                </span>
              )}
              {viewMode === "unassigned" && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-orange-100 text-orange-700">
                  Unassigned
                </span>
              )}
              {selectedLeads.length > 0 && (
                <span className="text-xs font-bold text-blue-600">
                  ({selectedLeads.length} selected)
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {viewMode !== "all" && (
              <button
                onClick={handleResetView}
                className="flex items-center gap-2 px-4 py-2 rounded shadow transition-all hover:scale-105 active:scale-95 cursor-pointer bg-gray-600 text-white"
              >
                Reset View
              </button>
            )}
            {viewMode === "all" && (
              <button
                onClick={handleShowUnassigned}
                className="flex items-center gap-2 px-4 py-2 rounded shadow transition-all hover:scale-105 active:scale-95 cursor-pointer bg-orange-600 text-white"
              >
                Show Unassigned
              </button>
            )}
            {selectedLeads.length > 0 && (
              <>
                <button
                  onClick={handleUnassignLeads}
                  disabled={unassigning}
                  className="flex items-center gap-2 px-4 py-2 rounded shadow transition-all hover:scale-105 active:scale-95 cursor-pointer bg-red-600 text-white disabled:opacity-50"
                >
                  {unassigning ? <Loader size={16} /> : <MdDelete size={20} />}
                  Unassign
                </button>
                <button
                  onClick={() => setShowAssignModal(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded shadow transition-all hover:scale-105 active:scale-95 cursor-pointer bg-blue-600 text-white"
                >
                  <MdAdd size={20} /> Assign
                </button>
              </>
            )}
            <button
              onClick={() => {
                setEditingLead(null);
                setShowCreateModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded shadow transition-all hover:scale-105 active:scale-95 cursor-pointer"
              style={{ backgroundColor: colors.text, color: colors.background }}
            >
              <MdAdd size={20} /> Create Lead
            </button>
          </div>
        </div>

        {/* Filters - Only show in "all" mode */}
        {viewMode === "all" && (
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <MdSearch
                className="absolute left-3 top-3 z-10"
                style={{ color: colors.textSecondary }}
              />
              <input
                type="text"
                placeholder="Search by name, country, city, mobile..."
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

            {/* Source Filter */}
            <div className="w-full md:w-auto md:min-w-[150px]">
              <ModernSelect
                options={sourceOptions}
                value={filters.source}
                onChange={(value) => setFilters({ ...filters, source: value })}
                placeholder="All Sources"
              />
            </div>

            {/* Status Filter */}
            <div className="w-full md:w-auto md:min-w-[150px]">
              <ModernSelect
                options={statusOptions}
                value={filters.leadStatus}
                onChange={(value) =>
                  setFilters({ ...filters, leadStatus: value })
                }
                placeholder="All Status"
              />
            </div>

            {/* Employee Filter */}
            <div className="w-full md:w-auto md:min-w-[180px]">
              <ModernSelect
                options={employeeOptions}
                value={filters.assignedTo}
                onChange={(value) =>
                  setFilters({ ...filters, assignedTo: value })
                }
                placeholder="All Employees"
              />
            </div>
          </div>
        )}
      </div>

      {/* Scrollable Table */}
      <div className="flex-1 px-4 md:px-6 pb-4 md:pb-6 flex flex-col min-h-0 md:overflow-hidden">
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
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className="w-4 h-4 cursor-pointer"
                  />
                </th>
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
                  Full Name
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
                  Location
                </th>
                <th
                  className="p-4 font-bold text-sm sticky top-0 z-10 border-b"
                  style={{
                    color: colors.text,
                    backgroundColor: colors.background,
                    borderColor: colors.primary + "30",
                  }}
                >
                  Clinical Req.
                </th>
                <th
                  className="p-4 font-bold text-sm sticky top-0 z-10 border-b"
                  style={{
                    color: colors.text,
                    backgroundColor: colors.background,
                    borderColor: colors.primary + "30",
                  }}
                >
                  Source
                </th>
                <th
                  className="p-4 font-bold text-sm sticky top-0 z-10 border-b"
                  style={{
                    color: colors.text,
                    backgroundColor: colors.background,
                    borderColor: colors.primary + "30",
                  }}
                >
                  Assigned To
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
                    No leads found.
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
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedLeads.includes(item._id)}
                        onChange={() => handleSelectLead(item._id)}
                        className="w-4 h-4 cursor-pointer"
                      />
                    </td>
                    <td
                      className="p-4 text-sm"
                      style={{ color: colors.textSecondary }}
                    >
                      {(pagination.page - 1) * pagination.limit + index + 1}
                    </td>
                    <td
                      className="p-4 font-medium"
                      style={{ color: colors.text }}
                    >
                      {item.fullName}
                    </td>
                    <td
                      className="p-4 text-sm"
                      style={{ color: colors.textSecondary }}
                    >
                      <div className="whitespace-nowrap">
                        {item.countryCode} {item.mobile}
                      </div>
                    </td>
                    <td
                      className="p-4 text-sm"
                      style={{ color: colors.textSecondary }}
                    >
                      <div>
                        {item.city}, {item.country}
                      </div>
                    </td>
                    <td
                      className="p-4 text-sm"
                      style={{ color: colors.textSecondary }}
                    >
                      <div className="max-w-xs truncate">
                        {item.clinicalRequirement}
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${getSourceBadge(
                          item.source,
                        )}`}
                      >
                        {item.source}
                      </span>
                    </td>
                    <td
                      className="p-4 text-sm"
                      style={{ color: colors.textSecondary }}
                    >
                      {item.assignedTo ? (
                        <div
                          onClick={() =>
                            handleEmployeeClick(item.assignedTo._id)
                          }
                          className="cursor-pointer hover:underline"
                          title="View employee details"
                        >
                          <div className="font-semibold text-blue-600 whitespace-nowrap">
                            {item.assignedTo.name}
                          </div>
                          <div className="text-xs uppercase opacity-70">
                            {item.assignedTo.department}
                          </div>
                        </div>
                      ) : (
                        <span className="italic opacity-50">Unassigned</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap inline-flex items-center justify-center min-w-[100px] shadow-sm ${getStatusBadge(
                            item.leadStatus,
                          )}`}
                        >
                          {item.leadStatus}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            navigate(`/dashboard/manage-leads/view/${item._id}`)
                          }
                          className="p-2 rounded hover:bg-green-100 text-green-600 transition-colors cursor-pointer"
                          title="View"
                        >
                          <MdVisibility size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setEditingLead(item);
                            setShowCreateModal(true);
                          }}
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

      <LeadFormModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setEditingLead(null);
        }}
        initialData={editingLead}
        onSuccess={fetchLeads}
      />

      {/* Assign Leads Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className="rounded-lg p-6 max-w-md w-full"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.accent + "30",
            }}
          >
            <h2
              className="text-2xl font-bold mb-4"
              style={{ color: colors.text }}
            >
              Assign Leads to Employee
            </h2>
            <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
              Selected Leads:{" "}
              <span className="font-bold">{selectedLeads.length}</span>
            </p>

            <div className="mb-6">
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.textSecondary }}
              >
                Select Employee *
              </label>
              <ModernSelect
                options={employees.map((emp) => ({
                  label: `${emp.name} - ${emp.phone}`,
                  value: emp._id,
                }))}
                value={selectedEmployee}
                onChange={(value) => setSelectedEmployee(value)}
                placeholder="Choose an employee"
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedEmployee("");
                }}
                className="px-6 py-2.5 rounded font-medium transition-colors cursor-pointer"
                style={{
                  backgroundColor: colors.accent + "20",
                  color: colors.text,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAssignLeads}
                disabled={assigning || !selectedEmployee}
                className="flex items-center gap-2 px-6 py-2.5 rounded font-medium shadow transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                style={{
                  backgroundColor: colors.primary,
                  color: colors.background,
                }}
              >
                {assigning ? (
                  <>
                    <Loader size={20} />
                    Assigning...
                  </>
                ) : (
                  <>
                    <MdAdd size={20} />
                    Assign Leads
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageLeads;
