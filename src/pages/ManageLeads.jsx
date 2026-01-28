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
  MdCall,
  MdLocationOn,
  MdPerson,
  MdInfo,
} from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";
import Loader from "../components/ui/Loader";
import LeadFormModal from "../components/LeadFormModal";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import ModernSelect from "../components/ModernSelect";

const ManageLeads = () => {
  const { colors, isDarkMode } = useTheme();
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
      new: "bg-blue-100 text-blue-700 border-blue-200",
      contacted: "bg-orange-100 text-orange-700 border-orange-200",
      "in-progress": "bg-indigo-100 text-indigo-700 border-indigo-200",
      converted: "bg-emerald-100 text-emerald-700 border-emerald-200",
      closed: "bg-green-100 text-green-700 border-green-200",
      negative: "bg-red-100 text-red-700 border-red-200",
    };
    const colorClass =
      statusColors[s] || "bg-gray-100 text-gray-700 border-gray-200";
    return (
      <span
        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm inline-block ${colorClass}`}
      >
        {s?.replace(/-/g, " ")}
      </span>
    );
  };

  const getSourceBadge = (source) => {
    const sourceColors = {
      web: "bg-purple-50 text-purple-600 border-purple-100",
      admin: "bg-indigo-50 text-indigo-600 border-indigo-100",
      employee: "bg-cyan-50 text-cyan-600 border-cyan-100",
    };
    const s = String(source).toLowerCase();
    const colorClass =
      sourceColors[s] || "bg-gray-50 text-gray-600 border-gray-100";
    return (
      <span
        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${colorClass}`}
      >
        {s}
      </span>
    );
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
      html: `Assign <strong>${selectedLeads.length}</strong> lead(s) to:<br/><br/><strong>${employee?.name}</strong>`,
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
    { label: "In-Progress", value: "in-progress" },
    { label: "Converted", value: "converted" },
    { label: "Closed", value: "closed" },
    { label: "Negative", value: "negative" },
  ];

  const employeeOptions = [
    { label: "All Employees", value: "" },
    ...employees.map((emp) => ({
      label: emp.name,
      value: emp._id,
    })),
  ];

  const renderLeadCard = (item, index) => (
    <div
      key={item._id}
      className="p-4 rounded-xl border mb-3 shadow-sm transition-all hover:shadow-md relative"
      style={{
        backgroundColor: colors.background,
        borderColor: colors.accent + "30",
      }}
    >
      <div className="absolute top-4 left-4">
        <input
          type="checkbox"
          checked={selectedLeads.includes(item._id)}
          onChange={() => handleSelectLead(item._id)}
          className="w-5 h-5 cursor-pointer rounded"
        />
      </div>

      <div className="pl-8 mb-4">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs opacity-60 block mb-1">
              #{(pagination.page - 1) * pagination.limit + index + 1}
            </span>
            <h3
              className="font-bold text-lg leading-tight"
              style={{ color: colors.text }}
            >
              {item.fullName}
            </h3>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            {getStatusBadge(item.leadStatus)}
            {getSourceBadge(item.source)}
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div
            className="flex items-center gap-2 text-sm"
            style={{ color: colors.textSecondary }}
          >
            <MdLocationOn className="shrink-0" size={16} />
            <span>
              {item.city}, {item.country}
            </span>
          </div>
          <div
            className="flex items-center gap-2 text-sm"
            style={{ color: colors.textSecondary }}
          >
            <MdInfo className="shrink-0" size={16} />
            <span className="line-clamp-2">{item.clinicalRequirement}</span>
          </div>
          {item.assignedTo && (
            <div className="flex items-center gap-2 text-sm font-semibold text-blue-600">
              <MdPerson className="shrink-0" size={16} />
              <span>{item.assignedTo.name}</span>
            </div>
          )}
          <div
            className="flex items-center gap-2 text-sm font-bold pt-1"
            style={{ color: colors.text }}
          >
            <MdCall size={16} />
            <span>
              {item.countryCode} {item.mobile}
            </span>
          </div>
        </div>
      </div>

      <div
        className="flex items-center justify-between pt-3 border-t"
        style={{ borderColor: colors.accent + "15" }}
      >
        <div className="flex gap-2">
          <a
            href={`tel:${item.countryCode}${item.mobile}`}
            className="p-2 rounded-lg bg-blue-50 text-blue-600"
          >
            <MdCall size={18} />
          </a>
          <a
            href={`https://wa.me/${String(item.countryCode + item.mobile).replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-green-50 text-green-600"
          >
            <FaWhatsapp size={18} />
          </a>
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => navigate(`/dashboard/manage-leads/view/${item._id}`)}
            className="p-2 rounded-lg bg-emerald-50 text-emerald-600"
          >
            <MdVisibility size={18} />
          </button>
          <button
            onClick={() => {
              setEditingLead(item);
              setShowCreateModal(true);
            }}
            className="p-2 rounded-lg bg-blue-50 text-blue-600"
          >
            <MdEdit size={18} />
          </button>
          <button
            onClick={() => handleDelete(item._id)}
            disabled={deletingId === item._id}
            className="p-2 rounded-lg bg-red-50 text-red-600 disabled:opacity-50"
          >
            {deletingId === item._id ? (
              <Loader size={18} />
            ) : (
              <MdDelete size={18} />
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen md:h-screen flex flex-col md:overflow-hidden">
      {/* Fixed Header and Filters */}
      <div
        className="shrink-0 p-4 md:p-6 pb-4 z-30 relative"
        style={{ backgroundColor: colors.background }}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <div className="w-full md:w-auto">
            <div className="flex items-center justify-between md:justify-start gap-4">
              <div className="flex items-center gap-3">
                <h1
                  className="text-xl md:text-2xl font-bold"
                  style={{ color: colors.text }}
                >
                  Manage Leads
                </h1>
                {!loading && (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm"
                    style={{
                      backgroundColor: colors.primary,
                      color: colors.background,
                    }}
                  >
                    {pagination.total}
                  </div>
                )}
              </div>
              <div className="md:hidden">
                <button
                  onClick={() => {
                    setEditingLead(null);
                    setShowCreateModal(true);
                  }}
                  className="p-2 rounded-lg shadow-sm"
                  style={{
                    backgroundColor: colors.text,
                    color: colors.background,
                  }}
                >
                  <MdAdd size={24} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2">
              {viewMode === "byEmployee" && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700 uppercase">
                  Employee View
                </span>
              )}
              {viewMode === "unassigned" && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-100 text-orange-700 uppercase tracking-wider">
                  Unassigned
                </span>
              )}
              {selectedLeads.length > 0 && (
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {selectedLeads.length} Selected
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {viewMode !== "all" && (
              <button
                onClick={handleResetView}
                className="flex-1 md:flex-none px-4 py-2 rounded shadow-sm bg-gray-600 text-white text-xs font-bold uppercase tracking-wider"
              >
                Reset
              </button>
            )}
            {viewMode === "all" && (
              <button
                onClick={handleShowUnassigned}
                className="flex-1 md:flex-none px-4 py-2 rounded shadow-sm bg-orange-600 text-white text-xs font-bold uppercase tracking-wider"
              >
                Unassigned
              </button>
            )}
            {selectedLeads.length > 0 && (
              <>
                <button
                  onClick={handleUnassignLeads}
                  disabled={unassigning}
                  className="flex items-center justify-center gap-1 px-4 py-2 rounded shadow-sm bg-red-600 text-white text-xs font-bold uppercase disabled:opacity-50"
                >
                  {unassigning ? <Loader size={12} /> : <MdDelete size={16} />}{" "}
                  Unassign
                </button>
                <button
                  onClick={() => setShowAssignModal(true)}
                  className="flex-1 md:flex-none flex items-center justify-center gap-1 px-4 py-2 rounded shadow-sm bg-blue-600 text-white text-xs font-bold uppercase"
                >
                  <MdAdd size={16} /> Assign
                </button>
              </>
            )}
            <button
              onClick={() => {
                setEditingLead(null);
                setShowCreateModal(true);
              }}
              className="hidden md:flex items-center gap-2 px-6 py-2 rounded shadow-sm font-bold"
              style={{ backgroundColor: colors.text, color: colors.background }}
            >
              <MdAdd size={20} /> Create Lead
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <MdSearch
              className="absolute left-3 top-2.5 z-10 opacity-50"
              style={{ color: colors.text }}
            />
            <input
              type="text"
              placeholder="Search leads..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              className="w-full pl-10 pr-4 py-2 rounded border focus:ring-1 outline-none text-sm transition-all"
              style={{
                backgroundColor: isDarkMode
                  ? colors.accent + "10"
                  : colors.background,
                borderColor: colors.accent + "30",
                color: colors.text,
              }}
            />
          </div>

          <div className="grid grid-cols-2 lg:flex gap-2 lg:w-auto">
            <ModernSelect
              options={sourceOptions}
              value={filters.source}
              onChange={(v) => setFilters({ ...filters, source: v })}
              placeholder="Source"
            />
            <ModernSelect
              options={statusOptions}
              value={filters.leadStatus}
              onChange={(v) => setFilters({ ...filters, leadStatus: v })}
              placeholder="Status"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 md:px-6 pb-4 md:pb-6 flex flex-col overflow-hidden min-h-0">
        <div className="flex-1 overflow-auto custom-scrollbar">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <Loader size={48} />
            </div>
          ) : data.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-40 gap-2">
              <MdInfo size={64} />
              <p className="font-bold uppercase tracking-widest text-sm">
                No data available
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div
                className="hidden md:block rounded-xl border overflow-hidden"
                style={{ borderColor: colors.accent + "20" }}
              >
                <table className="w-full text-left border-collapse">
                  <thead
                    className="sticky top-0 z-20"
                    style={{ backgroundColor: colors.background }}
                  >
                    <tr
                      className="border-b"
                      style={{ borderColor: colors.accent + "20" }}
                    >
                      <th className="p-4 w-10">
                        <input
                          type="checkbox"
                          checked={isAllSelected}
                          onChange={handleSelectAll}
                          className="w-4 h-4 rounded cursor-pointer"
                        />
                      </th>
                      <th className="p-4 font-bold text-xs opacity-60">#</th>
                      <th className="p-4 font-bold text-xs opacity-60">
                        LEAD DETAILS
                      </th>
                      <th className="p-4 font-bold text-xs opacity-60">
                        LOCATION
                      </th>
                      <th className="p-4 font-bold text-xs opacity-60">
                        REQUIREMENT
                      </th>
                      <th className="p-4 font-bold text-xs opacity-60">
                        SOURCE
                      </th>
                      <th className="p-4 font-bold text-xs opacity-60">
                        ASSIGNED TO
                      </th>
                      <th className="p-4 font-bold text-xs opacity-60 text-center">
                        STATUS
                      </th>
                      <th className="p-4 font-bold text-xs opacity-60 text-right">
                        ACTIONS
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => (
                      <tr
                        key={item._id}
                        className="border-b last:border-0 hover:bg-black/5"
                        style={{ borderColor: colors.accent + "10" }}
                      >
                        <td className="p-4">
                          <input
                            type="checkbox"
                            checked={selectedLeads.includes(item._id)}
                            onChange={() => handleSelectLead(item._id)}
                            className="w-4 h-4 rounded cursor-pointer"
                          />
                        </td>
                        <td className="p-4 text-xs opacity-60">
                          {(pagination.page - 1) * pagination.limit + index + 1}
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-sm">
                            {item.fullName}
                          </div>
                          <div className="text-xs opacity-60">
                            {item.countryCode} {item.mobile}
                          </div>
                        </td>
                        <td className="p-4 text-xs opacity-80">
                          {item.city}, {item.country}
                        </td>
                        <td className="p-4 text-xs opacity-80 max-w-[200px] truncate">
                          {item.clinicalRequirement}
                        </td>
                        <td className="p-4">{getSourceBadge(item.source)}</td>
                        <td className="p-4">
                          {item.assignedTo ? (
                            <div
                              onClick={() =>
                                handleEmployeeClick(item.assignedTo._id)
                              }
                              className="cursor-pointer group"
                            >
                              <div className="font-bold text-xs text-blue-600 group-hover:underline">
                                {item.assignedTo.name}
                              </div>
                              <div className="text-[10px] opacity-60 uppercase">
                                {item.assignedTo.department}
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs opacity-40 italic">
                              Not Assigned
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {getStatusBadge(item.leadStatus)}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() =>
                                navigate(
                                  `/dashboard/manage-leads/view/${item._id}`,
                                )
                              }
                              className="p-2 rounded hover:bg-emerald-50 text-emerald-600"
                            >
                              <MdVisibility size={18} />
                            </button>
                            <button
                              onClick={() => {
                                setEditingLead(item);
                                setShowCreateModal(true);
                              }}
                              className="p-2 rounded hover:bg-blue-50 text-blue-600"
                            >
                              <MdEdit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(item._id)}
                              disabled={deletingId === item._id}
                              className="p-2 rounded hover:bg-red-50 text-red-600"
                            >
                              {deletingId === item._id ? (
                                <Loader size={18} />
                              ) : (
                                <MdDelete size={18} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-3 pb-4">
                {data.map((item, index) => renderLeadCard(item, index))}
              </div>
            </>
          )}
        </div>

        {/* Pagination */}
        {!loading && data.length > 0 && (
          <div className="shrink-0 flex flex-col md:flex-row items-center justify-between mt-4 gap-4">
            <p className="text-xs font-bold opacity-40 uppercase tracking-widest">
              Showing {data.length} of {pagination.total}
            </p>
            <div className="flex items-center gap-1">
              <button
                disabled={pagination.page === 1}
                onClick={() =>
                  setPagination({ ...pagination, page: pagination.page - 1 })
                }
                className="px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase transition-all active:scale-95 disabled:opacity-20 translate-y-0 active:translate-y-0.5"
                style={{
                  borderColor: colors.accent + "30",
                  color: colors.text,
                }}
              >
                Prev
              </button>
              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() =>
                      setPagination({ ...pagination, page: i + 1 })
                    }
                    className={`w-8 h-8 rounded-lg text-[10px] font-bold transition-all active:scale-90 ${pagination.page === i + 1 ? "shadow-md" : "border"}`}
                    style={{
                      backgroundColor:
                        pagination.page === i + 1
                          ? colors.primary
                          : "transparent",
                      color:
                        pagination.page === i + 1
                          ? colors.background
                          : colors.text,
                      borderColor: colors.accent + "30",
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                disabled={pagination.page === totalPages}
                onClick={() =>
                  setPagination({ ...pagination, page: pagination.page + 1 })
                }
                className="px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase transition-all active:scale-95 disabled:opacity-20"
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

      {/* Modals */}
      <LeadFormModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        initialData={editingLead}
        onSuccess={fetchLeads}
      />

      {/* Assign Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm bg-black/40">
          <div
            className="w-full max-w-sm rounded-[32px] p-6 shadow-2xl"
            style={{ backgroundColor: colors.background }}
          >
            <div className="mb-6">
              <h2
                className="text-2xl font-black tracking-tight mb-2"
                style={{ color: colors.text }}
              >
                Assign Leads
              </h2>
              <p
                className="text-sm opacity-60 font-bold"
                style={{ color: colors.textSecondary }}
              >
                Assigning {selectedLeads.length} leads
              </p>
            </div>

            <div className="mb-8">
              <label
                className="block text-xs font-black uppercase tracking-widest mb-3 opacity-60"
                style={{ color: colors.text }}
              >
                Select Employee
              </label>
              <ModernSelect
                options={employeeOptions.filter((o) => o.value !== "")}
                value={selectedEmployee}
                onChange={setSelectedEmployee}
                placeholder="Search employee..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowAssignModal(false)}
                className="flex-1 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg active:scale-95 transition-all text-gray-500 bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignLeads}
                disabled={assigning || !selectedEmployee}
                className="flex-1 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg active:scale-95 transition-all text-white disabled:opacity-50"
                style={{ backgroundColor: colors.primary }}
              >
                {assigning ? <Loader size={16} /> : "Complete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: ${isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}; border-radius: 10px; }
      `,
        }}
      />
    </div>
  );
};

export default ManageLeads;
