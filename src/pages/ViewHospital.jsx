import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { getHospitalById } from "../apis/hospital";
import {
  MdArrowBack,
  MdCheckCircle,
  MdCancel,
  MdLocationOn,
} from "react-icons/md";
import Loader from "../components/ui/Loader";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

const ViewHospital = () => {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchHospital();
  }, [id]);

  const fetchHospital = async () => {
    try {
      setLoading(true);
      const response = await getHospitalById(id);
      if (response.success) {
        setData(response.hospital);
      }
    } catch (error) {
      console.error("Error fetching hospital:", error);
      Swal.fire("Error", "Failed to fetch hospital details", "error");
      navigate("/dashboard/hospital");
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = () => {
    if (data.image) {
      Swal.fire({
        imageUrl: data.image,
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
      <div className="flex items-center justify-center h-full p-10">
        <Loader size={60} />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-10 text-center" style={{ color: colors.textSecondary }}>
        Hospital not found
      </div>
    );
  }

  const DetailSection = ({ title, items }) => (
    <div className="mb-6">
      <h3
        className="text-sm font-semibold mb-3 uppercase tracking-wide"
        style={{ color: colors.textSecondary }}
      >
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {Array.isArray(items) && items.length > 0 ? (
          items.map((item, index) => (
            <span
              key={index}
              className="px-3 py-1 rounded-full text-sm border"
              style={{
                backgroundColor: colors.accent + "10",
                borderColor: colors.accent + "30",
                color: colors.text,
              }}
            >
              {item}
            </span>
          ))
        ) : (
          <span
            className="text-sm italic"
            style={{ color: colors.textSecondary }}
          >
            No data available
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/dashboard/hospital")}
          className="p-2 rounded hover:bg-black/5 cursor-pointer"
          style={{ color: colors.text }}
        >
          <MdArrowBack size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: colors.text }}>
            Hospital Details
          </h1>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            View complete hospital profile
          </p>
        </div>
      </div>

      <div className="max-w-5xl">
        <div
          className="rounded-lg border p-6 shadow-sm"
          style={{
            backgroundColor: colors.background,
            borderColor: colors.accent + "30",
          }}
        >
          {/* Main Info Section */}
          <div
            className="flex flex-col md:flex-row gap-8 mb-8 pb-8 border-b"
            style={{ borderColor: colors.accent + "20" }}
          >
            <img
              src={data.image}
              alt={data.name}
              className="w-full md:w-64 h-64 rounded-lg object-cover border shadow-sm cursor-pointer hover:opacity-90"
              style={{ borderColor: colors.accent + "30" }}
              onClick={handleImageClick}
            />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h2
                  className="text-3xl font-bold"
                  style={{ color: colors.text }}
                >
                  {data.name}
                </h2>
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
              <div
                className="flex items-center gap-2 mb-4 text-lg"
                style={{ color: colors.primary }}
              >
                <MdLocationOn />
                <span>{data.city}</span>
              </div>

              <div className="space-y-4">
                <div>
                  <h4
                    className="text-xs font-bold uppercase mb-1"
                    style={{ color: colors.textSecondary }}
                  >
                    About
                  </h4>
                  <p style={{ color: colors.text }}>{data.about}</p>
                </div>
                <div>
                  <h4
                    className="text-xs font-bold uppercase mb-1"
                    style={{ color: colors.textSecondary }}
                  >
                    Description
                  </h4>
                  <p style={{ color: colors.text }}>{data.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
            <DetailSection title="Specialities" items={data.specialities} />
            <DetailSection title="Accreditations" items={data.accreditations} />
            <DetailSection title="Departments" items={data.departments} />
            <DetailSection title="Infrastructure" items={data.infrastructure} />
            <DetailSection title="Why Choose" items={data.whyChoose} />
            <DetailSection
              title="International Services"
              items={data.internationalServices}
            />
          </div>

          {/* Action Buttons */}
          <div
            className="flex justify-end gap-4 mt-8 pt-6 border-t"
            style={{ borderColor: colors.accent + "20" }}
          >
            <button
              onClick={() => navigate("/dashboard/hospital")}
              className="px-6 py-2.5 rounded font-medium cursor-pointer"
              style={{
                backgroundColor: colors.accent + "20",
                color: colors.text,
              }}
            >
              Back to List
            </button>
            <button
              onClick={() => navigate(`/dashboard/hospital/edit/${data._id}`)}
              className="px-6 py-2.5 rounded font-medium shadow transition-all hover:scale-105 cursor-pointer"
              style={{
                backgroundColor: colors.primary,
                color: colors.background,
              }}
            >
              Edit Hospital
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewHospital;
