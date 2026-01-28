import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { addFollowUp } from "../apis/freeConsultation";
import Loader from "./ui/Loader";
import Swal from "sweetalert2";

const FollowUpModal = ({ isOpen, onClose, leadId, employeeId, onSuccess }) => {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    note: "",
    nextFollowUpDate: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.note) {
      Swal.fire("Error", "Please add a note", "error");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        leadId,
        employeeId: employeeId || "admin",
        note: formData.note,
        nextFollowUpDate: formData.nextFollowUpDate || null,
      };

      const response = await addFollowUp(payload);
      if (response.success) {
        Swal.fire({
          title: "Success",
          text: "Follow-up added successfully",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          background: colors.background,
          color: colors.text,
        });
        setFormData({ note: "", nextFollowUpDate: "" });
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Error adding follow-up:", error);
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Failed to add follow-up",
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
        className="rounded-lg p-6 max-w-md w-full shadow-xl"
        style={{
          backgroundColor: colors.background,
          borderColor: colors.accent + "30",
          borderWidth: "1px",
        }}
      >
        <h2 className="text-xl font-bold mb-4" style={{ color: colors.text }}>
          Add New Follow-up
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: colors.textSecondary }}
            >
              Follow-up Note *
            </label>
            <textarea
              required
              rows={4}
              value={formData.note}
              onChange={(e) =>
                setFormData({ ...formData, note: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded border outline-none focus:ring-2"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.accent + "40",
                color: colors.text,
              }}
              placeholder="Enter details of your conversation..."
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: colors.textSecondary }}
            >
              Next Follow-up Date (Optional)
            </label>
            <input
              type="date"
              value={formData.nextFollowUpDate}
              onChange={(e) =>
                setFormData({ ...formData, nextFollowUpDate: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded border outline-none focus:ring-2"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.accent + "40",
                color: colors.text,
              }}
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded font-medium transition-colors cursor-pointer"
              style={{
                backgroundColor: colors.accent + "10",
                color: colors.text,
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 rounded font-medium shadow transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              style={{
                backgroundColor: colors.primary,
                color: colors.background,
              }}
            >
              {loading ? <Loader size={20} /> : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FollowUpModal;
