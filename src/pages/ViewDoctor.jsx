import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { getDoctorById } from "../apis/doctor";
import {
  MdArrowBack,
  MdCheckCircle,
  MdCancel,
  MdLocationOn,
  MdWork,
  MdSchool,
} from "react-icons/md";
import Loader from "../components/ui/Loader";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

const ViewDoctor = () => {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDoctor();
  }, [id]);

  const fetchDoctor = async () => {
    try {
      setLoading(true);
      const response = await getDoctorById(id);
      if (response.success) {
        setData(response.doctor);
      }
    } catch (error) {
      console.error("Error fetching doctor:", error);
      Swal.fire("Error", "Failed to fetch doctor details", "error");
      navigate("/dashboard/doctor");
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = () => {
    if (data.photo) {
      Swal.fire({
        imageUrl: data.photo,
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
        Doctor not found
      </div>
    );
  }

  const DetailSection = ({ title, items, icon: Icon }) => (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        {Icon && <Icon className="text-xl" style={{ color: colors.primary }} />}
        <h3
          className="text-sm font-bold uppercase tracking-wider"
          style={{ color: colors.textSecondary }}
        >
          {title}
        </h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {Array.isArray(items) && items.length > 0 ? (
          items.map((item, index) => (
            <span
              key={index}
              className="px-4 py-1.5 rounded-full text-sm border font-medium"
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
            No information available
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate("/dashboard/doctor")}
          className="p-2 rounded hover:bg-black/5 cursor-pointer"
          style={{ color: colors.text }}
        >
          <MdArrowBack size={26} />
        </button>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: colors.text }}>
            Doctor Profile
          </h1>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            View detailed professional profile
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <div
          className="rounded-2xl border p-8 shadow-lg"
          style={{
            backgroundColor: colors.background,
            borderColor: colors.accent + "30",
          }}
        >
          {/* Main Info Section */}
          <div
            className="flex flex-col lg:flex-row gap-10 mb-10 pb-10 border-b"
            style={{ borderColor: colors.accent + "20" }}
          >
            <div className="relative group">
              <img
                src={data.photo}
                alt={data.name}
                className="w-full lg:w-72 h-80 rounded-2xl object-cover border-4 shadow-xl cursor-pointer transition-transform group-hover:scale-[1.02]"
                style={{ borderColor: colors.primary }}
                onClick={handleImageClick}
              />
              <div className="absolute top-4 right-4">
                <span
                  className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-md flex items-center gap-1.5 ${
                    data.isActive
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {data.isActive ? <MdCheckCircle /> : <MdCancel />}
                  {data.isActive ? "ACTIVE" : "INACTIVE"}
                </span>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <div className="mb-6">
                <h2
                  className="text-4xl font-extrabold mb-2"
                  style={{ color: colors.text }}
                >
                  {data.name}
                </h2>
                <div
                  className="flex items-center gap-2 text-xl font-semibold"
                  style={{ color: colors.primary }}
                >
                  <span>{data.speciality}</span>
                  <span className="text-gray-400">•</span>
                  <span>{data.experience} Years Exp.</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-black/5">
                    <MdSchool
                      className="text-2xl"
                      style={{ color: colors.primary }}
                    />
                  </div>
                  <div>
                    <h4
                      className="text-xs font-bold uppercase mb-1"
                      style={{ color: colors.textSecondary }}
                    >
                      Qualification
                    </h4>
                    <p className="font-medium" style={{ color: colors.text }}>
                      {data.qualification}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-black/5">
                    <MdWork
                      className="text-2xl"
                      style={{ color: colors.primary }}
                    />
                  </div>
                  <div>
                    <h4
                      className="text-xs font-bold uppercase mb-1"
                      style={{ color: colors.textSecondary }}
                    >
                      Designation
                    </h4>
                    <p className="font-medium" style={{ color: colors.text }}>
                      {data.designation}
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="p-5 rounded-xl border bg-black/5"
                style={{ borderColor: colors.accent + "20" }}
              >
                <div
                  className="flex items-center gap-2 mb-3 font-bold"
                  style={{ color: colors.primary }}
                >
                  <MdLocationOn className="text-xl" />
                  <span>PRESENT HOSPITAL</span>
                </div>
                <h4
                  className="text-xl font-bold mb-1"
                  style={{ color: colors.text }}
                >
                  {data.hospital?.name}
                </h4>
                <p
                  className="text-sm font-medium mb-3"
                  style={{ color: colors.textSecondary }}
                >
                  {data.hospital?.city}
                </p>
                <div className="flex flex-wrap gap-2">
                  {data.hospital?.accreditation?.map((acc, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-bold border border-blue-200 uppercase"
                    >
                      {acc}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* About & Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <div className="mb-10">
                <h3
                  className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2"
                  style={{ color: colors.primary }}
                >
                  <span className="w-8 h-0.5 bg-current opacity-30"></span>{" "}
                  Professional Summary
                </h3>
                <p
                  className="text-lg leading-relaxed font-semibold italic opacity-90"
                  style={{ color: colors.text }}
                >
                  "{data.summary}"
                </p>
              </div>

              <div>
                <h3
                  className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2"
                  style={{ color: colors.primary }}
                >
                  <span className="w-8 h-0.5 bg-current opacity-30"></span>{" "}
                  Detailed About
                </h3>
                <p
                  className="text-base leading-relaxed whitespace-pre-line"
                  style={{ color: colors.textSecondary }}
                >
                  {data.about}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <DetailSection title="Expertise" items={data.expertise} />
              <DetailSection title="Procedures" items={data.procedures} />
              <DetailSection title="Why Choose" items={data.whyChoose} />
            </div>
          </div>

          {/* Action Buttons */}
          <div
            className="flex justify-end gap-4 mt-12 pt-8 border-t"
            style={{ borderColor: colors.accent + "20" }}
          >
            <button
              onClick={() => navigate("/dashboard/doctor")}
              className="px-8 py-3 rounded-xl font-bold transition-all hover:bg-black/5 cursor-pointer"
              style={{
                border: `2px solid ${colors.accent}40`,
                color: colors.text,
              }}
            >
              Back to List
            </button>
            <button
              onClick={() => navigate(`/dashboard/doctor/edit/${data._id}`)}
              className="px-10 py-3 rounded-xl font-bold shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
              style={{
                backgroundColor: colors.primary,
                color: colors.background,
              }}
            >
              Edit Doctor Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDoctor;
