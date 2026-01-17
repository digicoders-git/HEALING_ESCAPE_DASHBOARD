import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { getSpecialityById } from "../apis/speciality";
import { MdArrowBack, MdCheckCircle, MdCancel } from "react-icons/md";
import Loader from "../components/ui/Loader";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

const ViewSpeciality = () => {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchSpeciality();
  }, [id]);

  const fetchSpeciality = async () => {
    try {
      setLoading(true);
      const response = await getSpecialityById(id);
      if (response.success) {
        setData(response.speciality);
      }
    } catch (error) {
      console.error("Error fetching speciality:", error);
      Swal.fire("Error", "Failed to fetch speciality details", "error");
      navigate("/dashboard/speciality");
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = () => {
    if (data.image) {
      Swal.fire({
        imageUrl: data.image,
        imageAlt: data.title,
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
        Speciality not found
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/dashboard/speciality")}
          className="p-2 rounded transition-colors hover:bg-black/5 cursor-pointer"
          style={{ color: colors.text }}
        >
          <MdArrowBack size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: colors.text }}>
            Speciality Details
          </h1>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            View complete speciality information
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
          {/* Image and Title Section */}
          <div
            className="flex flex-col md:flex-row gap-6 mb-6 pb-6 border-b"
            style={{ borderColor: colors.accent + "20" }}
          >
            <img
              src={data.image}
              alt={data.title}
              className="w-full md:w-48 h-48 rounded-lg object-cover border shadow-sm cursor-pointer hover:opacity-80 transition-opacity"
              style={{ borderColor: colors.accent + "30" }}
              onClick={handleImageClick}
            />
            <div className="flex-1">
              <h2
                className="text-2xl font-bold mb-2"
                style={{ color: colors.text }}
              >
                {data.title}
              </h2>
              <div className="flex items-center gap-2 mb-3">
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
              <p
                className="text-sm mb-2"
                style={{ color: colors.textSecondary }}
              >
                <strong>Cost Range:</strong> {data.costRange}
              </p>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                <strong>Created:</strong>{" "}
                {new Date(data.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="space-y-6">
            {/* Description */}
            <div>
              <h3
                className="text-sm font-semibold mb-2 uppercase tracking-wide"
                style={{ color: colors.textSecondary }}
              >
                Description
              </h3>
              <p className="text-base" style={{ color: colors.text }}>
                {data.description}
              </p>
            </div>

            {/* What Is */}
            <div>
              <h3
                className="text-sm font-semibold mb-2 uppercase tracking-wide"
                style={{ color: colors.textSecondary }}
              >
                What Is
              </h3>
              <p className="text-base" style={{ color: colors.text }}>
                {data.whatIs}
              </p>
            </div>

            {/* When Recommended */}
            <div>
              <h3
                className="text-sm font-semibold mb-2 uppercase tracking-wide"
                style={{ color: colors.textSecondary }}
              >
                When Recommended
              </h3>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(data.whenRecommended) &&
                  data.whenRecommended.map((item, index) => (
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
                  ))}
              </div>
            </div>

            {/* Procedure */}
            <div>
              <h3
                className="text-sm font-semibold mb-2 uppercase tracking-wide"
                style={{ color: colors.textSecondary }}
              >
                Procedure
              </h3>
              <p className="text-base" style={{ color: colors.text }}>
                {data.procedure}
              </p>
            </div>

            {/* Recovery */}
            <div>
              <h3
                className="text-sm font-semibold mb-2 uppercase tracking-wide"
                style={{ color: colors.textSecondary }}
              >
                Recovery Time
              </h3>
              <p className="text-base" style={{ color: colors.text }}>
                {data.recovery}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div
            className="flex justify-end gap-4 mt-8 pt-6 border-t"
            style={{ borderColor: colors.accent + "20" }}
          >
            <button
              onClick={() => navigate("/dashboard/speciality")}
              className="px-6 py-2.5 rounded font-medium transition-colors cursor-pointer"
              style={{
                backgroundColor: colors.accent + "20",
                color: colors.text,
              }}
            >
              Back to List
            </button>
            <button
              onClick={() => navigate(`/dashboard/speciality/edit/${data._id}`)}
              className="px-6 py-2.5 rounded font-medium shadow transition-all hover:scale-105 cursor-pointer"
              style={{
                backgroundColor: colors.primary,
                color: colors.background,
              }}
            >
              Edit Speciality
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSpeciality;
