import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import {
  getDoctors,
  deleteDoctor,
  updateDoctorStatus,
  getDoctorSpecialitiesDropdown,
} from "../apis/doctor";
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

const Doctor = () => {
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
    speciality: "",
    city: "",
    isActive: "",
  });
  const [specialityList, setSpecialityList] = useState([]);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchSpecialities();
  }, []);

  const fetchSpecialities = async () => {
    try {
      const response = await getDoctorSpecialitiesDropdown();
      if (response.success) {
        setSpecialityList(response.specialities || []);
      }
    } catch (error) {
      console.error("Error fetching specialities:", error);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 500);
    return () => clearTimeout(handler);
  }, [filters.search]);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [debouncedSearch, filters.speciality, filters.city, filters.isActive]);

  useEffect(() => {
    fetchDoctors();
  }, [
    pagination.page,
    debouncedSearch,
    filters.speciality,
    filters.city,
    filters.isActive,
  ]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };

      if (debouncedSearch) params.search = debouncedSearch;
      if (filters.speciality) params.speciality = filters.speciality;
      if (filters.city) params.city = filters.city;
      if (filters.isActive !== "") params.isActive = filters.isActive;

      const response = await getDoctors(params);
      if (response.success) {
        setData(response.doctors || []);
        setPagination((prev) => ({ ...prev, total: response.total || 0 }));
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
      Swal.fire("Error", "Failed to fetch doctors", "error");
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
          await deleteDoctor(id);
          Swal.fire({
            title: "Deleted!",
            text: "Doctor has been deleted.",
            icon: "success",
            background: colors.background,
            color: colors.text,
          });
          fetchDoctors();
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: "Failed to delete doctor",
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
      await updateDoctorStatus(id);
      fetchDoctors();
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
              <h1 className="text-3xl font-black" style={{ color: '#000000' }}>
                Doctors
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
                  title="Total Doctors"
                >
                  {pagination.total}
                </div>
              )}
            </div>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              Manage all medical professionals
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboard/doctor/add")}
            className="flex items-center gap-2 px-6 py-3 rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer font-bold"
            style={{
              backgroundColor: '#1db64c',
              color: '#ffffff',
            }}
          >
            <MdAdd size={22} /> Add Doctor
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          {/* 🔍 Search - 80% width */}
          <div className="relative w-full">
            <MdSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
              style={{ color: '#006cb5' }}
              size={22}
            />
            <input
              type="text"
              placeholder="Search doctor by name, city, speciality, hospital name"
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

          {/* Speciality Filter */}
          <div className="w-fit">
            <ModernSelect
              options={[
                { label: "All Specialities", value: "" },
                ...specialityList.map((s) => ({ label: s, value: s })),
              ]}
              value={filters.speciality}
              onChange={(value) =>
                setFilters({ ...filters, speciality: value })
              }
              placeholder="Filter by Speciality"
            />
          </div>

          {/* 🟢 Status - auto width */}
          <div className="w-fit">
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
      <div className="flex-1 px-4 md:px-6 pb-4 md:pb-6 flex flex-col min-h-0 md:overflow-hidden">
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
                  className="p-4 font-bold text-sm sticky top-0 z-10 text-white"
                  style={{
                    backgroundColor: '#006cb5',
                  }}
                >
                  #
                </th>
                <th
                  className="p-4 font-bold text-sm sticky top-0 z-10 text-white"
                  style={{
                    backgroundColor: '#006cb5',
                  }}
                >
                  Photo
                </th>
                <th
                  className="p-4 font-bold text-sm sticky top-0 z-10 text-white"
                  style={{
                    backgroundColor: '#006cb5',
                  }}
                >
                  Name
                </th>
                <th
                  className="p-4 font-bold text-sm sticky top-0 z-10 text-white"
                  style={{
                    backgroundColor: '#006cb5',
                  }}
                >
                  Speciality
                </th>
                <th
                  className="p-4 font-bold text-sm sticky top-0 z-10 text-white"
                  style={{
                    backgroundColor: '#006cb5',
                  }}
                >
                  Hospital & City
                </th>
                <th
                  className="p-4 font-bold text-sm sticky top-0 z-10 text-white"
                  style={{
                    backgroundColor: '#006cb5',
                  }}
                >
                  Status
                </th>
                <th
                  className="p-4 font-bold text-sm text-right sticky top-0 z-10 text-white"
                  style={{
                    backgroundColor: '#006cb5',
                  }}
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
                    No doctors found.
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
                        src={item.photo}
                        alt={item.name}
                        className="w-12 h-12 rounded-full object-cover border cursor-pointer hover:opacity-80 transition-opacity"
                        style={{ borderColor: colors.accent + "20" }}
                        onClick={() => handleImageClick(item.photo, item.name)}
                      />
                    </td>
                    <td
                      className="p-4 font-bold text-base"
                      style={{ color: '#006cb5' }}
                    >
                      {item.name}
                      <div
                        className="text-xs font-normal"
                        style={{ color: colors.textSecondary }}
                      >
                        {item.qualification}
                      </div>
                    </td>
                    <td
                      className="p-4 text-sm"
                      style={{ color: colors.textSecondary }}
                    >
                      {item.speciality}
                    </td>
                    <td
                      className="p-4 text-sm"
                      style={{ color: colors.textSecondary }}
                    >
                      <div>{item.hospital?.name}</div>
                      <div className="text-xs">{item.hospital?.city}</div>
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
                            navigate(`/dashboard/doctor/view/${item._id}`)
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
                            navigate(`/dashboard/doctor/edit/${item._id}`)
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
          <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4 px-4 md:px-0">
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

export default Doctor;
