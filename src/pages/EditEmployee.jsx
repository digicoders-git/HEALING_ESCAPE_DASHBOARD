import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { getEmployeeById, updateEmployee } from "../apis/employee";
import {
  MdArrowBack,
  MdSave,
  MdImage,
  MdPerson,
  MdEmail,
  MdPhone,
  MdWork,
  MdBadge,
  MdLock,
} from "react-icons/md";
import Loader from "../components/ui/Loader";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import ModernSelect from "../components/ModernSelect";

const EditEmployee = () => {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    department: "",
    designation: "",
    isActive: true,
    profilePhoto: null,
  });

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      const response = await getEmployeeById(id);
      if (response.success) {
        const data = response.data;
        setFormData({
          name: data.name,
          email: data.email,
          phone: data.phone,
          password: data.password || "",
          department: data.department,
          designation: data.designation,
          isActive: data.isActive,
          profilePhoto: null,
        });
        setImagePreview(data.profilePhoto?.url);
      }
    } catch (error) {
      console.error("Error fetching employee:", error);
      Swal.fire("Error", "Failed to fetch employee details", "error");
      navigate("/dashboard/employee");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profilePhoto: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageClick = () => {
    if (imagePreview) {
      Swal.fire({
        imageUrl: imagePreview,
        imageAlt: "Preview",
        showConfirmButton: false,
        showCloseButton: true,
        width: "auto",
        background: colors.background,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      if (formData.password) {
        data.append("password", formData.password);
      }
      data.append("department", formData.department);
      data.append("designation", formData.designation);
      data.append("isActive", formData.isActive);

      if (formData.profilePhoto) {
        data.append("profilePhoto", formData.profilePhoto);
      }

      const response = await updateEmployee(id, data);

      if (response.success) {
        Swal.fire("Success", "Employee updated successfully!", "success");
        navigate("/dashboard/employee");
      }
    } catch (error) {
      console.error("Error updating employee:", error);
      const message =
        error.response?.data?.message || "Failed to update employee";
      Swal.fire("Error", message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size={60} />
      </div>
    );
  }

  const statusOptions = [
    { label: "Active", value: true },
    { label: "Inactive", value: false },
  ];

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
            Edit Employee
          </h1>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            Update employee account information
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div
          className="rounded-lg border p-6 shadow-sm"
          style={{
            backgroundColor: colors.background,
            borderColor: colors.accent + "30",
          }}
        >
          {/* Profile Photo Upload */}
          <div className="mb-8 flex flex-col items-center">
            <div className="relative group">
              <div
                className="w-32 h-32 rounded-full border-2 overflow-hidden flex items-center justify-center bg-gray-100 cursor-pointer"
                style={{ borderColor: colors.accent + "30" }}
                onClick={handleImageClick}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <MdPerson size={64} className="text-gray-300" />
                )}
              </div>
              <label
                className="absolute bottom-0 right-0 p-2 rounded-full cursor-pointer shadow-lg hover:scale-110 transition-transform"
                style={{
                  backgroundColor: colors.primary,
                  color: colors.background,
                }}
              >
                <MdImage size={20} />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>
            <p className="mt-2 text-sm" style={{ color: colors.textSecondary }}>
              Profile Photo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.textSecondary }}
              >
                Full Name *
              </label>
              <div className="relative">
                <MdPerson
                  className="absolute left-3 top-3.5"
                  style={{ color: colors.textSecondary }}
                />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded border outline-none focus:ring-2"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.accent + "40",
                    color: colors.text,
                  }}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.textSecondary }}
              >
                Email Address
              </label>
              <div className="relative">
                <MdEmail
                  className="absolute left-3 top-3.5"
                  style={{ color: colors.textSecondary }}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded border outline-none focus:ring-2"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.accent + "40",
                    color: colors.text,
                  }}
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.textSecondary }}
              >
                Phone Number *
              </label>
              <div className="relative">
                <MdPhone
                  className="absolute left-3 top-3.5"
                  style={{ color: colors.textSecondary }}
                />
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded border outline-none focus:ring-2"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.accent + "40",
                    color: colors.text,
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.textSecondary }}
              >
                Password (Leave blank to keep current)
              </label>
              <div className="relative">
                <MdLock
                  className="absolute left-3 top-3.5"
                  style={{ color: colors.textSecondary }}
                />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded border outline-none focus:ring-2"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.accent + "40",
                    color: colors.text,
                  }}
                  placeholder="Enter new password"
                />
              </div>
            </div>

            {/* Department */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.textSecondary }}
              >
                Department
              </label>
              <div className="relative">
                <MdWork
                  className="absolute left-3 top-3.5"
                  style={{ color: colors.textSecondary }}
                />
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded border outline-none focus:ring-2"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.accent + "40",
                    color: colors.text,
                  }}
                />
              </div>
            </div>

            {/* Designation */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.textSecondary }}
              >
                Designation
              </label>
              <div className="relative">
                <MdBadge
                  className="absolute left-3 top-3.5"
                  style={{ color: colors.textSecondary }}
                />
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded border outline-none focus:ring-2"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.accent + "40",
                    color: colors.text,
                  }}
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.textSecondary }}
              >
                Account Status *
              </label>
              <ModernSelect
                options={statusOptions}
                value={formData.isActive}
                onChange={(value) =>
                  setFormData({ ...formData, isActive: value })
                }
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={() => navigate("/dashboard/employee")}
              className="px-6 py-2.5 rounded font-medium transition-colors cursor-pointer"
              style={{
                backgroundColor: colors.accent + "20",
                color: colors.text,
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded font-medium shadow transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              style={{
                backgroundColor: colors.primary,
                color: colors.background,
              }}
            >
              {submitting ? (
                <>
                  <Loader size={20} />
                  Updating...
                </>
              ) : (
                <>
                  <MdSave size={20} />
                  Update Employee
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditEmployee;
