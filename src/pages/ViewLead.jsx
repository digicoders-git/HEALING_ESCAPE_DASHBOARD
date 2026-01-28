import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { getFreeConsultationById } from "../apis/freeConsultation";
import { MdArrowBack } from "react-icons/md";
import Loader from "../components/ui/Loader";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

const ViewLead = () => {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const response = await getFreeConsultationById(id);
      if (response.success) {
        setData(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire("Error", "Failed to fetch details", "error");
      navigate("/dashboard/manage-leads");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader size={60} />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-10 text-center" style={{ color: colors.textSecondary }}>
        Data not found
      </div>
    );
  }

  return (
    <div className="p-6 h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <div className="shrink-0 flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/dashboard/manage-leads")}
          className="p-2 rounded transition-colors hover:bg-black/5 cursor-pointer"
          style={{ color: colors.text }}
        >
          <MdArrowBack size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: colors.text }}>
            Lead Details
          </h1>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            View complete lead information and follow-up history
          </p>
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Main Details Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div
              className="rounded-lg border p-6 shadow-sm"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.accent + "30",
              }}
            >
              <h2
                className="text-lg font-bold mb-4"
                style={{ color: colors.text }}
              >
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3
                    className="text-xs font-semibold mb-1 uppercase tracking-wide"
                    style={{ color: colors.textSecondary }}
                  >
                    Full Name
                  </h3>
                  <p
                    className="text-lg font-medium"
                    style={{ color: colors.text }}
                  >
                    {data.fullName}
                  </p>
                </div>
                <div>
                  <h3
                    className="text-xs font-semibold mb-1 uppercase tracking-wide"
                    style={{ color: colors.textSecondary }}
                  >
                    Mobile Number
                  </h3>
                  <p
                    className="text-lg font-medium"
                    style={{ color: colors.text }}
                  >
                    {data.countryCode} {data.mobile}
                  </p>
                </div>
                <div>
                  <h3
                    className="text-xs font-semibold mb-1 uppercase tracking-wide"
                    style={{ color: colors.textSecondary }}
                  >
                    Country
                  </h3>
                  <p
                    className="text-lg font-medium"
                    style={{ color: colors.text }}
                  >
                    {data.country || "N/A"}
                  </p>
                </div>
                <div>
                  <h3
                    className="text-xs font-semibold mb-1 uppercase tracking-wide"
                    style={{ color: colors.textSecondary }}
                  >
                    City
                  </h3>
                  <p
                    className="text-lg font-medium"
                    style={{ color: colors.text }}
                  >
                    {data.city || "N/A"}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <h3
                    className="text-xs font-semibold mb-1 uppercase tracking-wide"
                    style={{ color: colors.textSecondary }}
                  >
                    Clinical Requirement
                  </h3>
                  <p className="text-lg" style={{ color: colors.text }}>
                    {data.clinicalRequirement || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Follow Ups Section */}
            <div
              className="rounded-lg border p-6 shadow-sm"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.accent + "30",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2
                  className="text-lg font-bold"
                  style={{ color: colors.text }}
                >
                  Follow Ups ({data.totalFollowUps || 0})
                </h2>
              </div>

              {/* Scrollable Follow-ups Area - Approx 5 items height (~500px) */}
              <div
                className="space-y-4 overflow-y-auto pr-2 custom-scrollbar"
                style={{ maxHeight: "500px" }}
              >
                {data.followUps && data.followUps.length > 0 ? (
                  data.followUps.map((followUp) => (
                    <div
                      key={followUp._id}
                      className="p-4 rounded border-l-4 shadow-sm"
                      style={{
                        backgroundColor: colors.accent + "05",
                        borderColor:
                          followUp.status === "completed"
                            ? "#22c55e"
                            : "#f97316",
                      }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded uppercase"
                          style={{
                            backgroundColor:
                              followUp.status === "completed"
                                ? "#dcfce7"
                                : "#ffedd5",
                            color:
                              followUp.status === "completed"
                                ? "#166534"
                                : "#9a3412",
                          }}
                        >
                          {followUp.status}
                        </span>
                        <span
                          className="text-xs"
                          style={{ color: colors.textSecondary }}
                        >
                          {new Date(followUp.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p
                        className="text-sm mb-3 whitespace-pre-wrap"
                        style={{ color: colors.text }}
                      >
                        {followUp.note}
                      </p>
                      <div
                        className="flex flex-wrap gap-4 text-xs border-t pt-2"
                        style={{
                          color: colors.textSecondary,
                          borderColor: colors.accent + "20",
                        }}
                      >
                        {followUp.nextFollowUpDate && (
                          <span className="flex items-center gap-1">
                            <strong>Next Follow-up:</strong>{" "}
                            {new Date(
                              followUp.nextFollowUpDate,
                            ).toLocaleDateString()}
                          </span>
                        )}
                        {followUp.employee && (
                          <span className="flex items-center gap-1">
                            <strong>By:</strong> {followUp.employee.name}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p
                    className="text-sm text-center py-8"
                    style={{ color: colors.textSecondary }}
                  >
                    No follow-ups recorded yet.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Info Column */}
          <div className="space-y-6">
            {/* Status Card */}
            <div
              className="rounded-lg border p-6 shadow-sm"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.accent + "30",
              }}
            >
              <h3
                className="text-sm font-semibold mb-3 uppercase tracking-wide"
                style={{ color: colors.textSecondary }}
              >
                Meta Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label
                    className="text-xs mb-1 block"
                    style={{ color: colors.textSecondary }}
                  >
                    Status
                  </label>
                  <span
                    className="px-3 py-1 rounded-full text-sm font-medium capitalize inline-block"
                    style={{
                      backgroundColor: colors.primary + "20",
                      color: colors.primary,
                    }}
                  >
                    {data.leadStatus || "New"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className="text-xs mb-1 block"
                      style={{ color: colors.textSecondary }}
                    >
                      Source
                    </label>
                    <p
                      className="font-medium capitalize text-sm"
                      style={{ color: colors.text }}
                    >
                      {data.source || "Website"}
                    </p>
                  </div>
                  <div>
                    <label
                      className="text-xs mb-1 block"
                      style={{ color: colors.textSecondary }}
                    >
                      Lead Type
                    </label>
                    <p
                      className="font-medium capitalize text-sm"
                      style={{ color: colors.text }}
                    >
                      Free Consultation
                    </p>
                  </div>
                </div>

                <div
                  className="border-t pt-3 mt-3"
                  style={{ borderColor: colors.accent + "20" }}
                >
                  <div className="mb-2">
                    <label
                      className="text-xs mb-1 block"
                      style={{ color: colors.textSecondary }}
                    >
                      Created At
                    </label>
                    <p className="text-sm" style={{ color: colors.text }}>
                      {new Date(data.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label
                      className="text-xs mb-1 block"
                      style={{ color: colors.textSecondary }}
                    >
                      Last Updated
                    </label>
                    <p className="text-sm" style={{ color: colors.text }}>
                      {new Date(data.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Assigned To Card */}
            <div
              className="rounded-lg border p-6 shadow-sm"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.accent + "30",
              }}
            >
              <h3
                className="text-sm font-semibold mb-3 uppercase tracking-wide"
                style={{ color: colors.textSecondary }}
              >
                Assigned Employee
              </h3>
              {data.assignedTo ? (
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-200 text-gray-600 font-bold text-lg shrink-0">
                    {data.assignedTo.name
                      ? data.assignedTo.name.charAt(0).toUpperCase()
                      : "?"}
                  </div>
                  <div>
                    <p
                      className="font-bold text-base"
                      style={{ color: colors.text }}
                    >
                      {data.assignedTo.name}
                    </p>
                    <p
                      className="text-sm"
                      style={{ color: colors.textSecondary }}
                    >
                      {data.assignedTo.department || "N/A"}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                        {data.assignedTo.phone}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 bg-gray-50 rounded border border-dashed">
                  <p
                    className="text-sm italic"
                    style={{ color: colors.textSecondary }}
                  >
                    Not assigned to any employee
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <button
              onClick={() => navigate("/dashboard/manage-leads")}
              className="w-full py-2.5 rounded font-medium transition-colors cursor-pointer border"
              style={{
                borderColor: colors.accent + "40",
                color: colors.text,
                backgroundColor: colors.background,
              }}
            >
              Back to Leads
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewLead;
