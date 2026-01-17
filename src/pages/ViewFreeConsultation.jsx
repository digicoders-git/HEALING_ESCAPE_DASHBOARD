import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { getFreeConsultationById } from "../apis/freeConsultation";
import { MdArrowBack } from "react-icons/md";
import Loader from "../components/ui/Loader";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

const ViewFreeConsultation = () => {
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
      navigate("/dashboard/free-consultation");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-10">
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
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/dashboard/free-consultation")}
          className="p-2 rounded transition-colors hover:bg-black/5 cursor-pointer"
          style={{ color: colors.text }}
        >
          <MdArrowBack size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: colors.text }}>
            Consultation Details
          </h1>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            View complete consultation information
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl">
        <div
          className="rounded-lg border p-6 shadow-sm"
          style={{
            backgroundColor: colors.background,
            borderColor: colors.accent + "30",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3
                className="text-sm font-semibold mb-1 uppercase tracking-wide"
                style={{ color: colors.textSecondary }}
              >
                Full Name
              </h3>
              <p className="text-lg font-medium" style={{ color: colors.text }}>
                {data.fullName}
              </p>
            </div>
            <div>
              <h3
                className="text-sm font-semibold mb-1 uppercase tracking-wide"
                style={{ color: colors.textSecondary }}
              >
                Mobile Number
              </h3>
              <p className="text-lg font-medium" style={{ color: colors.text }}>
                {data.countryCode} {data.mobile}
              </p>
            </div>
            <div>
              <h3
                className="text-sm font-semibold mb-1 uppercase tracking-wide"
                style={{ color: colors.textSecondary }}
              >
                Country
              </h3>
              <p className="text-lg font-medium" style={{ color: colors.text }}>
                {data.country}
              </p>
            </div>
            <div>
              <h3
                className="text-sm font-semibold mb-1 uppercase tracking-wide"
                style={{ color: colors.textSecondary }}
              >
                City
              </h3>
              <p className="text-lg font-medium" style={{ color: colors.text }}>
                {data.city}
              </p>
            </div>
            <div className="md:col-span-2">
              <h3
                className="text-sm font-semibold mb-1 uppercase tracking-wide"
                style={{ color: colors.textSecondary }}
              >
                Clinical Requirement
              </h3>
              <p className="text-lg" style={{ color: colors.text }}>
                {data.clinicalRequirement}
              </p>
            </div>
            <div>
              <h3
                className="text-sm font-semibold mb-1 uppercase tracking-wide"
                style={{ color: colors.textSecondary }}
              >
                Submitted At
              </h3>
              <p className="text-lg" style={{ color: colors.text }}>
                {new Date(data.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <h3
                className="text-sm font-semibold mb-1 uppercase tracking-wide"
                style={{ color: colors.textSecondary }}
              >
                Last UpdatedAt
              </h3>
              <p className="text-lg" style={{ color: colors.text }}>
                {new Date(data.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div
            className="flex justify-end gap-4 mt-8 pt-6 border-t"
            style={{ borderColor: colors.accent + "20" }}
          >
            <button
              onClick={() => navigate("/dashboard/free-consultation")}
              className="px-6 py-2.5 rounded font-medium transition-colors cursor-pointer"
              style={{
                backgroundColor: colors.accent + "20",
                color: colors.text,
              }}
            >
              Back to List
            </button>
            <button
              onClick={() =>
                navigate(`/dashboard/free-consultation/edit/${data._id}`)
              }
              className="px-6 py-2.5 rounded font-medium shadow transition-all hover:scale-105 cursor-pointer"
              style={{
                backgroundColor: colors.primary,
                color: colors.background,
              }}
            >
              Edit Consultation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewFreeConsultation;
