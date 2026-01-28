import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { createLead, updateFreeConsultation } from "../apis/freeConsultation";
import Loader from "./ui/Loader";
import Swal from "sweetalert2";

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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className="rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: colors.background,
          borderColor: colors.accent + "30",
        }}
      >
        <h2 className="text-2xl font-bold mb-4" style={{ color: colors.text }}>
          {initialData ? "Edit Lead" : "Create New Lead"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.textSecondary }}
              >
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded border outline-none focus:ring-2"
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.accent + "40",
                  color: colors.text,
                }}
                placeholder="Enter full name"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.textSecondary }}
              >
                Country *
              </label>
              <input
                type="text"
                required
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded border outline-none focus:ring-2"
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.accent + "40",
                  color: colors.text,
                }}
                placeholder="Enter country"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.textSecondary }}
              >
                City *
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded border outline-none focus:ring-2"
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.accent + "40",
                  color: colors.text,
                }}
                placeholder="Enter city"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.textSecondary }}
              >
                Country Code *
              </label>
              <input
                type="text"
                required
                value={formData.countryCode}
                onChange={(e) =>
                  setFormData({ ...formData, countryCode: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded border outline-none focus:ring-2"
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.accent + "40",
                  color: colors.text,
                }}
                placeholder="+91"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.textSecondary }}
              >
                Mobile *
              </label>
              <input
                type="tel"
                required
                value={formData.mobile}
                onChange={(e) =>
                  setFormData({ ...formData, mobile: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded border outline-none focus:ring-2"
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.accent + "40",
                  color: colors.text,
                }}
                placeholder="Enter mobile number"
              />
            </div>

            <div className="md:col-span-2">
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.textSecondary }}
              >
                Clinical Requirement *
              </label>
              <textarea
                required
                rows={3}
                value={formData.clinicalRequirement}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    clinicalRequirement: e.target.value,
                  })
                }
                className="w-full px-4 py-2.5 rounded border outline-none focus:ring-2"
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.accent + "40",
                  color: colors.text,
                }}
                placeholder="Enter clinical requirement"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
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
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 rounded font-medium shadow transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              style={{
                backgroundColor: colors.primary,
                color: colors.background,
              }}
            >
              {loading ? (
                <>
                  <Loader size={20} />
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
  );
};

export default LeadFormModal;
