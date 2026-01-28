import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { createEmployee } from "../apis/employee";
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
import { useNavigate } from "react-router-dom";

const AddEmployee = () => {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    department: "",
    designation: "",
    profilePhoto: null,
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("password", formData.password);
      data.append("department", formData.department);
      data.append("designation", formData.designation);

      // Profile photo is optional
      if (formData.profilePhoto) {
        data.append("profilePhoto", formData.profilePhoto);
      }

      const response = await createEmployee(data);

      if (response.success) {
        Swal.fire("Success", "Employee created successfully!", "success");
        navigate("/dashboard/employee");
      }
    } catch (error) {
      console.error("Error creating employee:", error);
      const message =
        error.response?.data?.message || "Failed to create employee";
      Swal.fire("Error", message, "error");
    } finally {
      setSubmitting(false);
    }
  };

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
            Add Employee
          </h1>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            Create a new CRM employee account
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
                className="w-32 h-32 rounded-full border-2 overflow-hidden flex items-center justify-center bg-gray-100"
                style={{ borderColor: colors.accent + "30" }}
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
                  placeholder="e.g. Abhay Kumar"
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
                  placeholder="e.g. abhay@example.com"
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
                  placeholder="e.g. 7234567890"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.textSecondary }}
              >
                Password
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
                  placeholder="Set account password"
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
                  placeholder="e.g. Sales"
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
                  placeholder="e.g. Senior Counsellor"
                />
              </div>
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
                  Creating...
                </>
              ) : (
                <>
                  <MdSave size={20} />
                  Create Employee
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddEmployee;
