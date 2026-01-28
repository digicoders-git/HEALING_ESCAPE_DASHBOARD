import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import {
  getFreeConsultationById,
  updateFreeConsultation,
} from "../apis/freeConsultation";
import { MdArrowBack, MdCancel, MdDoneAll } from "react-icons/md";
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

  const handleStatusUpdate = async (status, additionalData = {}) => {
    try {
      setLoading(true);
      const res = await updateFreeConsultation(id, {
        leadStatus: status,
        ...additionalData,
      });
      if (res.success) {
        Swal.fire({
          title: "Success",
          text: `Lead marked as ${status}`,
          icon: "success",
          background: colors.background,
          color: colors.text,
        });
        fetchDetail();
      }
    } catch (error) {
      console.error("Error updating lead status:", error);
      Swal.fire("Error", "Failed to update status", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleNegativeLead = async () => {
    const { value: reason } = await Swal.fire({
      title: "Negative Lead Reason",
      text: "Please provide a reason why this lead is negative",
      input: "textarea",
      inputPlaceholder: "Enter reason here...",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Submit",
      cancelButtonText: "Cancel",
      background: colors.background,
      color: colors.text,
      inputValidator: (value) => {
        if (!value) {
          return "Reason is required!";
        }
      },
    });

    if (reason) {
      handleStatusUpdate("negative", { negativeReason: reason });
    }
  };

  const handleCloseLead = async () => {
    const result = await Swal.fire({
      title: "Close Lead?",
      text: "Are you sure you want to close this lead?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#22c55e",
      confirmButtonText: "Yes, close it",
      cancelButtonText: "Cancel",
      background: colors.background,
      color: colors.text,
    });

    if (result.isConfirmed) {
      handleStatusUpdate("closed");
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
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Main Container: Basic Info + Meta + Assigned Employee */}
          <div
            className="rounded-lg border shadow-sm"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.accent + "30",
            }}
          >
            <div
              className="grid grid-cols-1 divide-y"
              style={{ borderColor: colors.accent + "20" }}
            >
              {/* Basic Information */}
              <div className="p-6">
                <h2
                  className="text-lg font-bold mb-4 flex items-center gap-2"
                  style={{ color: colors.text }}
                >
                  Basic Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3
                      className="text-xs font-semibold mb-1 uppercase tracking-wide"
                      style={{ color: colors.textSecondary }}
                    >
                      Full Name
                    </h3>
                    <p
                      className="text-base font-medium"
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
                      className="text-base font-medium"
                      style={{ color: colors.text }}
                    >
                      {data.countryCode} {data.mobile}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3
                        className="text-xs font-semibold mb-1 uppercase tracking-wide"
                        style={{ color: colors.textSecondary }}
                      >
                        Country
                      </h3>
                      <p
                        className="text-base font-medium"
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
                        className="text-base font-medium"
                        style={{ color: colors.text }}
                      >
                        {data.city || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3
                      className="text-xs font-semibold mb-1 uppercase tracking-wide"
                      style={{ color: colors.textSecondary }}
                    >
                      Requirement
                    </h3>
                    <p className="text-sm" style={{ color: colors.text }}>
                      {data.clinicalRequirement || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Meta Details */}
              <div className="p-6">
                <h2
                  className="text-lg font-bold mb-4"
                  style={{ color: colors.text }}
                >
                  Meta Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3
                      className="text-xs font-semibold mb-1 uppercase tracking-wide"
                      style={{ color: colors.textSecondary }}
                    >
                      Status
                    </h3>
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold capitalize inline-block"
                      style={{
                        backgroundColor:
                          data.leadStatus === "negative"
                            ? "#fee2e2"
                            : data.leadStatus === "closed"
                              ? "#dcfce7"
                              : colors.primary + "15",
                        color:
                          data.leadStatus === "negative"
                            ? "#ef4444"
                            : data.leadStatus === "closed"
                              ? "#22c55e"
                              : colors.primary,
                      }}
                    >
                      {data.leadStatus || "New"}
                    </span>
                    {data.leadStatus === "negative" && data.negativeReason && (
                      <p
                        className="mt-2 text-xs italic"
                        style={{ color: colors.textSecondary }}
                      >
                        Reason: {data.negativeReason}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3
                        className="text-xs font-semibold mb-1 uppercase tracking-wide"
                        style={{ color: colors.textSecondary }}
                      >
                        Source
                      </h3>
                      <p
                        className="text-sm font-medium capitalize"
                        style={{ color: colors.text }}
                      >
                        {data.source || "Website"}
                      </p>
                    </div>
                    <div>
                      <h3
                        className="text-xs font-semibold mb-1 uppercase tracking-wide"
                        style={{ color: colors.textSecondary }}
                      >
                        Type
                      </h3>
                      <p
                        className="text-sm font-medium"
                        style={{ color: colors.text }}
                      >
                        Consultation
                      </p>
                    </div>
                  </div>
                  <div
                    className="border-t pt-3"
                    style={{ borderColor: colors.accent + "10" }}
                  >
                    <h3
                      className="text-xs font-semibold mb-1 uppercase tracking-wide"
                      style={{ color: colors.textSecondary }}
                    >
                      Dates
                    </h3>
                    <div
                      className="grid grid-cols-1 gap-1 text-xs"
                      style={{ color: colors.text }}
                    >
                      <p>
                        <span className="opacity-60">Created:</span>{" "}
                        {new Date(data.createdAt).toLocaleDateString()}
                      </p>
                      <p>
                        <span className="opacity-60">Updated:</span>{" "}
                        {new Date(data.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Assigned Employee */}
              <div className="p-6">
                <h2
                  className="text-lg font-bold mb-4"
                  style={{ color: colors.text }}
                >
                  Assigned Employee
                </h2>
                {data.assignedTo ? (
                  <div className="flex items-start gap-4 p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white border shadow-sm text-primary font-bold text-sm shrink-0">
                      {data.assignedTo.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p
                        className="font-bold text-sm truncate"
                        style={{ color: colors.text }}
                      >
                        {data.assignedTo.name}
                      </p>
                      <p
                        className="text-xs font-medium"
                        style={{ color: colors.textSecondary }}
                      >
                        {data.assignedTo.department}
                      </p>
                      <p
                        className="text-xs mt-1"
                        style={{ color: colors.primary }}
                      >
                        {data.assignedTo.phone}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 px-4 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50">
                    <p className="text-xs italic text-gray-400">
                      Not assigned yet
                    </p>
                  </div>
                )}
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
            <div className="flex items-center justify-between mb-6">
              <h2
                className="text-xl font-bold flex items-center gap-2"
                style={{ color: colors.text }}
              >
                Follow-up History
                <span className="text-sm font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                  {data.totalFollowUps || 0}
                </span>
              </h2>
            </div>

            <div className="space-y-4">
              {data.followUps && data.followUps.length > 0 ? (
                data.followUps.map((followUp, idx) => {
                  const displayIndex = data.followUps.length - idx;
                  const isExpired =
                    followUp.status !== "done" &&
                    followUp.nextFollowUpDate &&
                    new Date(followUp.nextFollowUpDate) < new Date();

                  return (
                    <div
                      key={followUp._id}
                      className="p-5 rounded-xl border transition-all hover:shadow-md"
                      style={{
                        backgroundColor: colors.background,
                        borderColor: colors.accent + "20",
                      }}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 text-gray-500">
                            #{displayIndex}
                          </span>
                          <span
                            className="text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider"
                            style={{
                              backgroundColor:
                                followUp.status === "done"
                                  ? "#dcfce7"
                                  : isExpired
                                    ? "#fee2e2"
                                    : "#fff7ed",
                              color:
                                followUp.status === "done"
                                  ? "#166534"
                                  : isExpired
                                    ? "#ef4444"
                                    : "#9a3412",
                            }}
                          >
                            {isExpired ? "Expired" : followUp.status}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                            Recorded On
                          </p>
                          <p
                            className="text-xs font-medium"
                            style={{ color: colors.textSecondary }}
                          >
                            {new Date(followUp.createdAt).toLocaleDateString()}{" "}
                            at{" "}
                            {new Date(followUp.createdAt).toLocaleTimeString(
                              [],
                              { hour: "2-digit", minute: "2-digit" },
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="bg-gray-50/50 p-4 rounded-lg mb-4 border border-gray-100/50">
                        <p
                          className="text-sm leading-relaxed"
                          style={{ color: colors.text }}
                        >
                          {followUp.note}
                        </p>
                      </div>

                      <div
                        className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-dashed"
                        style={{ borderColor: colors.accent + "20" }}
                      >
                        <div className="flex gap-4">
                          {followUp.nextFollowUpDate && (
                            <div className="flex flex-col">
                              <span className="text-[10px] uppercase font-bold opacity-40">
                                Next Follow-up
                              </span>
                              <span
                                className="text-xs font-bold"
                                style={{
                                  color: isExpired ? "#ef4444" : colors.primary,
                                }}
                              >
                                {new Date(
                                  followUp.nextFollowUpDate,
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-bold opacity-40">
                              Handled By
                            </span>
                            <span
                              className="text-xs font-bold"
                              style={{ color: colors.text }}
                            >
                              {followUp.employee?.name || "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                  <p className="text-gray-400 font-medium">
                    No follow-up history found for this lead.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons at the bottom */}
          <div className="flex items-center justify-center gap-4 pt-6">
            <button
              onClick={handleNegativeLead}
              className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg hover:shadow-red-500/25"
              style={{
                backgroundColor: "#fee2e2",
                color: "#ef4444",
                border: "1px solid #fecaca",
              }}
            >
              <MdCancel size={22} /> Negative Lead
            </button>
            <button
              onClick={handleCloseLead}
              className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg hover:shadow-green-500/25"
              style={{
                backgroundColor: "#dcfce7",
                color: "#22c55e",
                border: "1px solid #bbf7d0",
              }}
            >
              <MdDoneAll size={22} /> Close Lead
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewLead;
