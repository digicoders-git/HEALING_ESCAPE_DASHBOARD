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
    <div className="min-h-screen" style={{ backgroundColor: '#f9fafb' }}>
      {/* Premium Gradient Header */}
      <div 
        className="sticky top-0 z-50 shadow-lg"
        style={{
          background: 'linear-gradient(135deg, #006cb5 0%, #004d84 100%)'
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard/employee")}
              className="p-2.5 rounded-xl transition-all hover:scale-110 cursor-pointer"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: '#ffffff' }}
            >
              <MdArrowBack size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-black text-white flex items-center gap-3">
                <MdPerson size={32} /> Add New Employee
              </h1>
              <p className="text-sm mt-1 font-medium" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                Create a new CRM employee account with credentials
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit}>
          <div
            className="rounded-2xl shadow-xl p-8 border"
            style={{
              backgroundColor: '#ffffff',
              borderColor: '#e5e7eb',
            }}
          >
          {/* Profile Photo Upload */}
          <div className="mb-10 flex flex-col items-center">
            <div className="relative group">
              <div
                className="w-40 h-40 rounded-full border-4 overflow-hidden flex items-center justify-center shadow-xl"
                style={{ borderColor: '#006cb5', backgroundColor: '#f0f9ff' }}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <MdPerson size={80} style={{ color: '#006cb5' }} />
                )}
              </div>
              <label
                className="absolute bottom-2 right-2 p-3 rounded-full cursor-pointer shadow-xl hover:scale-110 transition-all"
                style={{
                  backgroundColor: '#1db64c',
                  color: '#ffffff',
                }}
              >
                <MdImage size={24} />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>
            <p className="mt-4 text-sm font-semibold" style={{ color: '#6b7280' }}>
              Upload Profile Photo
            </p>
          </div>

          {/* Section Header */}
          <div className="flex items-center gap-3 pb-6 mb-6 border-b-2" style={{ borderColor: '#f1f5f9' }}>
            <div className="w-1 h-8 rounded-full" style={{ backgroundColor: '#006cb5' }}></div>
            <h2 className="text-xl font-black" style={{ color: '#1f2937' }}>Employee Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label
                className="block text-sm font-bold mb-2.5"
                style={{ color: '#1f2937' }}
              >
                Full Name *
              </label>
              <div className="relative">
                <MdPerson
                  className="absolute left-4 top-4"
                  style={{ color: '#6b7280' }}
                  size={20}
                />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 outline-none transition-all font-medium"
                  style={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e5e7eb',
                    color: '#1f2937',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#006cb5';
                    e.target.style.boxShadow = '0 0 0 3px rgba(0, 108, 181, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="e.g. Abhay Kumar"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                className="block text-sm font-bold mb-2.5"
                style={{ color: '#1f2937' }}
              >
                Email Address
              </label>
              <div className="relative">
                <MdEmail
                  className="absolute left-4 top-4"
                  style={{ color: '#6b7280' }}
                  size={20}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 outline-none transition-all font-medium"
                  style={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e5e7eb',
                    color: '#1f2937',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#006cb5';
                    e.target.style.boxShadow = '0 0 0 3px rgba(0, 108, 181, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="e.g. abhay@example.com"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label
                className="block text-sm font-bold mb-2.5"
                style={{ color: '#1f2937' }}
              >
                Phone Number *
              </label>
              <div className="relative">
                <MdPhone
                  className="absolute left-4 top-4"
                  style={{ color: '#6b7280' }}
                  size={20}
                />
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 outline-none transition-all font-medium"
                  style={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e5e7eb',
                    color: '#1f2937',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#006cb5';
                    e.target.style.boxShadow = '0 0 0 3px rgba(0, 108, 181, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="e.g. 7234567890"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                className="block text-sm font-bold mb-2.5"
                style={{ color: '#1f2937' }}
              >
                Password
              </label>
              <div className="relative">
                <MdLock
                  className="absolute left-4 top-4"
                  style={{ color: '#6b7280' }}
                  size={20}
                />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 outline-none transition-all font-medium"
                  style={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e5e7eb',
                    color: '#1f2937',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#006cb5';
                    e.target.style.boxShadow = '0 0 0 3px rgba(0, 108, 181, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="Set account password"
                />
              </div>
            </div>

            {/* Department */}
            <div>
              <label
                className="block text-sm font-bold mb-2.5"
                style={{ color: '#1f2937' }}
              >
                Department
              </label>
              <div className="relative">
                <MdWork
                  className="absolute left-4 top-4"
                  style={{ color: '#6b7280' }}
                  size={20}
                />
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 outline-none transition-all font-medium"
                  style={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e5e7eb',
                    color: '#1f2937',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#006cb5';
                    e.target.style.boxShadow = '0 0 0 3px rgba(0, 108, 181, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="e.g. Sales"
                />
              </div>
            </div>

            {/* Designation */}
            <div>
              <label
                className="block text-sm font-bold mb-2.5"
                style={{ color: '#1f2937' }}
              >
                Designation
              </label>
              <div className="relative">
                <MdBadge
                  className="absolute left-4 top-4"
                  style={{ color: '#6b7280' }}
                  size={20}
                />
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 outline-none transition-all font-medium"
                  style={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e5e7eb',
                    color: '#1f2937',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#006cb5';
                    e.target.style.boxShadow = '0 0 0 3px rgba(0, 108, 181, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="e.g. Senior Counsellor"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-10 pt-8 border-t-2" style={{ borderColor: '#e5e7eb' }}>
            <button
              type="button"
              onClick={() => navigate("/dashboard/employee")}
              className="px-8 py-3.5 rounded-xl font-bold cursor-pointer transition-all hover:scale-105 shadow-md"
              style={{
                backgroundColor: '#f3f4f6',
                color: '#374151',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold shadow-lg transition-all hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: '#1db64c',
                color: '#ffffff',
              }}
            >
              {submitting ? (
                <>
                  <Loader size={22} color="#ffffff" />
                  Creating Employee...
                </>
              ) : (
                <>
                  <MdSave size={22} />
                  Create Employee
                </>
              )}
            </button>
          </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
