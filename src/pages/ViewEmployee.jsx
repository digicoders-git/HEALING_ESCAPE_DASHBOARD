import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { getEmployeeById } from "../apis/employee";
import {
  MdArrowBack,
  MdCheckCircle,
  MdCancel,
  MdEmail,
  MdPhone,
  MdWork,
  MdBadge,
  MdPerson,
} from "react-icons/md";
import Loader from "../components/ui/Loader";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

const ViewEmployee = () => {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      const response = await getEmployeeById(id);
      if (response.success) {
        setData(response.data);
      }
    } catch (error) {
      console.error("Error fetching employee:", error);
      Swal.fire("Error", "Failed to fetch employee details", "error");
      navigate("/dashboard/employee");
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = () => {
    if (data?.profilePhoto?.url) {
      Swal.fire({
        imageUrl: data.profilePhoto.url,
        imageAlt: data.name,
        showConfirmButton: false,
        showCloseButton: true,
        width: "auto",
        background: colors.background,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size={60} />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-10 text-center" style={{ color: colors.textSecondary }}>
        Employee not found
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/dashboard/employee")}
          className="p-2 rounded transition-colors hover:bg-black/5 cursor-pointer"
          style={{ color: colors.text }}
        >
          <MdArrowBack size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: colors.text }}>
            Employee Details
          </h1>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            View complete employee information
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto">
        <div
          className="rounded-lg border p-6 shadow-sm"
          style={{
            backgroundColor: colors.background,
            borderColor: colors.accent + "30",
          }}
        >
          {/* Profile Section */}
          <div
            className="flex flex-col items-center mb-6 pb-6 border-b"
            style={{ borderColor: colors.accent + "20" }}
          >
            <div
              className="w-32 h-32 rounded-full border-2 overflow-hidden flex items-center justify-center bg-gray-100 mb-4 cursor-pointer hover:opacity-80 transition-opacity"
              style={{ borderColor: colors.accent + "30" }}
              onClick={handleImageClick}
            >
              {data.profilePhoto?.url ? (
                <img
                  src={data.profilePhoto.url}
                  alt={data.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <MdPerson size={64} className="text-gray-300" />
              )}
            </div>
            <h2
              className="text-2xl font-bold mb-2"
              style={{ color: colors.text }}
            >
              {data.name}
            </h2>
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                  data.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {data.isActive ? <MdCheckCircle /> : <MdCancel />}
                {data.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              <strong>Joined:</strong>{" "}
              {new Date(data.createdAt).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div>
              <h3
                className="text-sm font-semibold mb-2 uppercase tracking-wide flex items-center gap-2"
                style={{ color: colors.textSecondary }}
              >
                <MdEmail /> Email Address
              </h3>
              <p className="text-base" style={{ color: colors.text }}>
                {data.email}
              </p>
            </div>

            {/* Phone */}
            <div>
              <h3
                className="text-sm font-semibold mb-2 uppercase tracking-wide flex items-center gap-2"
                style={{ color: colors.textSecondary }}
              >
                <MdPhone /> Phone Number
              </h3>
              <p className="text-base" style={{ color: colors.text }}>
                {data.phone}
              </p>
            </div>

            {/* Department */}
            <div>
              <h3
                className="text-sm font-semibold mb-2 uppercase tracking-wide flex items-center gap-2"
                style={{ color: colors.textSecondary }}
              >
                <MdWork /> Department
              </h3>
              <p className="text-base" style={{ color: colors.text }}>
                {data.department}
              </p>
            </div>

            {/* Designation */}
            <div>
              <h3
                className="text-sm font-semibold mb-2 uppercase tracking-wide flex items-center gap-2"
                style={{ color: colors.textSecondary }}
              >
                <MdBadge /> Designation
              </h3>
              <p className="text-base" style={{ color: colors.text }}>
                {data.designation}
              </p>
            </div>

            {/* Last Login */}
            <div>
              <h3
                className="text-sm font-semibold mb-2 uppercase tracking-wide"
                style={{ color: colors.textSecondary }}
              >
                Last Login
              </h3>
              <p className="text-base" style={{ color: colors.text }}>
                {data.lastLogin
                  ? new Date(data.lastLogin).toLocaleString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Never"}
              </p>
            </div>

            {/* Stats */}
            <div>
              <h3
                className="text-sm font-semibold mb-2 uppercase tracking-wide"
                style={{ color: colors.textSecondary }}
              >
                Performance Stats
              </h3>
              <div className="flex gap-4">
                <div>
                  <p
                    className="text-xs"
                    style={{ color: colors.textSecondary }}
                  >
                    Leads Assigned
                  </p>
                  <p
                    className="text-lg font-bold"
                    style={{ color: colors.primary }}
                  >
                    {data.totalLeadsAssigned || 0}
                  </p>
                </div>
                <div>
                  <p
                    className="text-xs"
                    style={{ color: colors.textSecondary }}
                  >
                    Leads Closed
                  </p>
                  <p
                    className="text-lg font-bold"
                    style={{ color: colors.primary }}
                  >
                    {data.totalLeadsClosed || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div
            className="flex justify-end gap-4 mt-8 pt-6 border-t"
            style={{ borderColor: colors.accent + "20" }}
          >
            <button
              onClick={() => navigate("/dashboard/employee")}
              className="px-6 py-2.5 rounded font-medium transition-colors cursor-pointer"
              style={{
                backgroundColor: colors.accent + "20",
                color: colors.text,
              }}
            >
              Back to List
            </button>
            <button
              onClick={() => navigate(`/dashboard/employee/edit/${data._id}`)}
              className="px-6 py-2.5 rounded font-medium shadow transition-all hover:scale-105 cursor-pointer"
              style={{
                backgroundColor: colors.primary,
                color: colors.background,
              }}
            >
              Edit Employee
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewEmployee;
