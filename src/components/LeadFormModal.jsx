import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { createLead, updateFreeConsultation } from "../apis/freeConsultation";
import Loader from "./ui/Loader";
import Swal from "sweetalert2";
import { MdClose, MdPerson, MdLocationOn, MdPhone, MdMedicalServices } from "react-icons/md";

const LeadFormModal = ({ isOpen, onClose, initialData, onSuccess }) => {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    country: "",
    city: "",
    countryCode: "+91",
    mobile: "",
    clinicalRequirement: "",
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          fullName: initialData.fullName || "",
          country: initialData.country || "",
          city: initialData.city || "",
          countryCode: initialData.countryCode || "+91",
          mobile: initialData.mobile || "",
          clinicalRequirement: initialData.clinicalRequirement || "",
        });
      } else {
        setFormData({
          fullName: "",
          country: "",
          city: "",
          countryCode: "+91",
          mobile: "",
          clinicalRequirement: "",
        });
      }
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;
      if (initialData) {
        response = await updateFreeConsultation(initialData._id, formData);
      } else {
        response = await createLead(formData);
      }

      if (response.success) {
        Swal.fire({
          title: "Success",
          text: initialData
            ? "Lead updated successfully"
            : "Lead created successfully",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          background: colors.background,
          color: colors.text,
        });
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Error saving lead:", error);
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Failed to save lead",
        icon: "error",
        background: colors.background,
        color: colors.text,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div
        className="rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-slideUp"
        style={{
          backgroundColor: '#ffffff',
        }}
      >
        {/* Modern Header with Gradient */}
        <div 
          className="px-8 py-6 flex items-center justify-between"
          style={{
            background: 'linear-gradient(135deg, #006cb5 0%, #004d84 100%)'
          }}
        >
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-3">
              <MdPerson size={28} />
              {initialData ? "Edit Lead" : "Create New Lead"}
            </h2>
            <p className="text-sm mt-1" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              {initialData ? "Update lead information" : "Add a new consultation lead"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl transition-all hover:scale-110 cursor-pointer"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: '#ffffff' }}
          >
            <MdClose size={24} />
          </button>
        </div>

        {/* Form Content */}
        <div className="px-8 py-6 max-h-[calc(90vh-140px)] overflow-y-auto">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
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
                    required
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
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
                    placeholder="Enter full name"
                  />
                </div>
              </div>

              {/* Country */}
              <div>
                <label
                  className="block text-sm font-bold mb-2.5"
                  style={{ color: '#1f2937' }}
                >
                  Country *
                </label>
                <div className="relative">
                  <MdLocationOn
                    className="absolute left-4 top-4"
                    style={{ color: '#6b7280' }}
                    size={20}
                  />
                  <input
                    type="text"
                    required
                    value={formData.country}
                    onChange={(e) =>
                      setFormData({ ...formData, country: e.target.value })
                    }
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
                    placeholder="Enter country"
                  />
                </div>
              </div>

              {/* City */}
              <div>
                <label
                  className="block text-sm font-bold mb-2.5"
                  style={{ color: '#1f2937' }}
                >
                  City *
                </label>
                <div className="relative">
                  <MdLocationOn
                    className="absolute left-4 top-4"
                    style={{ color: '#6b7280' }}
                    size={20}
                  />
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
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
                    placeholder="Enter city"
                  />
                </div>
              </div>

              {/* Country Code */}
              <div>
                <label
                  className="block text-sm font-bold mb-2.5"
                  style={{ color: '#1f2937' }}
                >
                  Country Code *
                </label>
                <div className="relative">
                  <MdPhone
                    className="absolute left-4 top-4"
                    style={{ color: '#6b7280' }}
                    size={20}
                  />
                  <input
                    type="text"
                    required
                    value={formData.countryCode}
                    onChange={(e) =>
                      setFormData({ ...formData, countryCode: e.target.value })
                    }
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
                    placeholder="+91"
                  />
                </div>
              </div>

              {/* Mobile */}
              <div>
                <label
                  className="block text-sm font-bold mb-2.5"
                  style={{ color: '#1f2937' }}
                >
                  Mobile *
                </label>
                <div className="relative">
                  <MdPhone
                    className="absolute left-4 top-4"
                    style={{ color: '#6b7280' }}
                    size={20}
                  />
                  <input
                    type="tel"
                    required
                    value={formData.mobile}
                    onChange={(e) =>
                      setFormData({ ...formData, mobile: e.target.value })
                    }
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
                    placeholder="Enter mobile number"
                  />
                </div>
              </div>

              {/* Clinical Requirement */}
              <div className="md:col-span-2">
                <label
                  className="block text-sm font-bold mb-2.5"
                  style={{ color: '#1f2937' }}
                >
                  Clinical Requirement *
                </label>
                <div className="relative">
                  <MdMedicalServices
                    className="absolute left-4 top-4"
                    style={{ color: '#6b7280' }}
                    size={20}
                  />
                  <textarea
                    required
                    rows={4}
                    value={formData.clinicalRequirement}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        clinicalRequirement: e.target.value,
                      })
                    }
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 outline-none transition-all font-medium resize-none"
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
                    placeholder="Enter clinical requirement details"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-8 pt-6 border-t-2" style={{ borderColor: '#f1f5f9' }}>
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-3.5 rounded-xl font-bold transition-all hover:scale-105 cursor-pointer shadow-md"
                style={{
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                style={{
                  backgroundColor: '#1db64c',
                  color: '#ffffff',
                }}
              >
                {loading ? (
                  <>
                    <Loader size={22} color="#ffffff" />
                    Saving...
                  </>
                ) : initialData ? (
                  "Update Lead"
                ) : (
                  "Create Lead"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LeadFormModal;
