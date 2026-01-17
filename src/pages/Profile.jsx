import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { getAdminProfile, updateAdminProfile } from "../apis/admin";
import {
  MdEdit,
  MdSave,
  MdPerson,
  MdEmail,
  MdCameraAlt,
  MdArrowBack,
  MdLock,
} from "react-icons/md";
import Loader from "../components/ui/Loader";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { colors, isDarkMode } = useTheme();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [adminData, setAdminData] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profilePhoto: null,
  });
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await getAdminProfile();
      const admin =
        response.data && response.data.length > 0 ? response.data[0] : null;

      if (admin) {
        setAdminData(admin);
        setFormData({
          name: admin.name,
          email: admin.email,
          password: "",
          profilePhoto: null, // Reset file input
        });
        setPreviewImage(admin.profilePhoto);
      }
    } catch (error) {
      // console.error('Error fetching profile:', error);
      if (error.response && error.response.status !== 500) {
        Swal.fire(
          "Error",
          error.response.data.message ||
            error.response.data.error ||
            "Failed to load profile data",
          "error"
        );
      } else {
        Swal.fire("Error", "Failed to load profile data", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profilePhoto: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!adminData?._id) return;

    try {
      setLoading(true);

      // Prepare data for API
      const dataToSend = new FormData();
      dataToSend.append("name", formData.name);
      dataToSend.append("email", formData.email);
      if (formData.password) {
        dataToSend.append("password", formData.password);
      }
      if (formData.profilePhoto) {
        dataToSend.append("profilePhoto", formData.profilePhoto);
      }

      await updateAdminProfile(adminData._id, dataToSend);

      Swal.fire("Success", "Profile updated successfully!", "success");
      setIsEditing(false);
      fetchProfile(); // Refresh data
    } catch (error) {
      // console.error('Error updating profile:', error);
      if (error.response && error.response.status !== 500) {
        Swal.fire(
          "Error",
          error.response.data.message ||
            error.response.data.error ||
            "Failed to update profile",
          "error"
        );
      } else {
        Swal.fire("Error", "Failed to update profile", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && !adminData) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader size={60} />
      </div>
    );
  }

  if (!adminData) {
    return <div className="p-10 text-center">Admin data not found.</div>;
  }

  return (
    <div className="p-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 cursor-pointer rounded transition-colors"
            style={{
              backgroundColor: colors.accent + "20",
              color: colors.text,
            }}
          >
            <MdArrowBack size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold" style={{ color: colors.text }}>
              My Profile
            </h1>
            <p style={{ color: colors.textSecondary }}>
              Manage your personal information
            </p>
          </div>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-6 py-2.5 rounded font-medium transition-all hover:scale-105 shadow-sm cursor-pointer"
            style={{
              backgroundColor: colors.primary,
              color: colors.background,
            }}
          >
            <MdEdit size={20} />
            Edit Profile
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1">
          <div
            className="rounded p-6 border shadow-sm flex flex-col items-center text-center"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.accent + "30",
            }}
          >
            <div className="relative mb-4 group">
              <div
                className="w-40 h-40 rounded-full overflow-hidden border-4 shadow-md"
                style={{ borderColor: colors.background }}
              >
                <img
                  src={previewImage || "https://via.placeholder.com/150"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>

              {isEditing && (
                <label
                  className="absolute bottom-2 right-2 p-3 rounded-full cursor-pointer shadow-lg transition-transform hover:scale-110"
                  style={{
                    backgroundColor: colors.primary,
                    color: colors.background,
                  }}
                >
                  <MdCameraAlt size={20} />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>

            <h2
              className="text-xl font-bold mb-1"
              style={{ color: colors.text }}
            >
              {adminData.name}
            </h2>
            <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
              Administrator
            </p>

            <div
              className="w-full py-3 rounded mb-2 flex items-center justify-center gap-2"
              style={{ backgroundColor: colors.accent + "10" }}
            >
              <div className={`w-2 h-2 rounded-full bg-green-500`}></div>
              <span
                className="text-sm font-medium"
                style={{ color: colors.text }}
              >
                Active Status
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Details/Edit Form */}
        <div className="lg:col-span-2">
          <div
            className="rounded p-8 border shadow-sm"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.accent + "30",
            }}
          >
            <h3
              className="text-xl font-bold mb-6"
              style={{ color: colors.text }}
            >
              Personal Details
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.textSecondary }}
                >
                  Full Name
                </label>
                <div className="relative">
                  <MdPerson
                    className="absolute left-4 top-3.5 w-5 h-5"
                    style={{ color: colors.textSecondary }}
                  />
                  <input
                    type="text"
                    value={isEditing ? formData.name : adminData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    disabled={!isEditing}
                    className={`w-full pl-12 pr-4 py-3 rounded border outline-none transition-all ${
                      !isEditing
                        ? "cursor-default focus:ring-2 focus:ring-primary"
                        : ""
                    }`}
                    style={{
                      backgroundColor: isEditing
                        ? colors.background
                        : colors.accent + "05",
                      borderColor: colors.accent + "30",
                      color: colors.text,
                    }}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.textSecondary }}
                >
                  Email Address
                </label>
                <div className="relative">
                  <MdEmail
                    className="absolute left-4 top-3.5 w-5 h-5"
                    style={{ color: colors.textSecondary }}
                  />
                  <input
                    type="email"
                    value={isEditing ? formData.email : adminData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    disabled={!isEditing}
                    className={`w-full pl-12 pr-4 py-3 rounded border outline-none transition-all ${
                      !isEditing
                        ? "cursor-default focus:ring-2 focus:ring-primary"
                        : ""
                    }`}
                    style={{
                      backgroundColor: isEditing
                        ? colors.background
                        : colors.accent + "05",
                      borderColor: colors.accent + "30",
                      color: colors.text,
                    }}
                  />
                </div>
              </div>

              {/* Password Field (Only during editing) */}
              {isEditing && (
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.textSecondary }}
                  >
                    New Password (leave blank to keep current)
                  </label>
                  <div className="relative">
                    <MdLock
                      className="absolute left-4 top-3.5 w-5 h-5"
                      style={{ color: colors.textSecondary }}
                    />
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      placeholder="Enter new password"
                      className={`w-full pl-12 pr-4 py-3 rounded border outline-none transition-all focus:ring-2 focus:ring-primary`}
                      style={{
                        backgroundColor: colors.background,
                        borderColor: colors.accent + "30",
                        color: colors.text,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Read-only Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.textSecondary }}
                  >
                    Joined Date
                  </label>
                  <div
                    className="px-4 py-3 rounded border"
                    style={{
                      borderColor: colors.accent + "20",
                      color: colors.text,
                    }}
                  >
                    {new Date(adminData.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.textSecondary }}
                  >
                    Last Updated
                  </label>
                  <div
                    className="px-4 py-3 rounded border"
                    style={{
                      borderColor: colors.accent + "20",
                      color: colors.text,
                    }}
                  >
                    {new Date(adminData.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      // Reset form data to original
                      setFormData({
                        name: adminData.name,
                        email: adminData.email,
                        password: "",
                        profilePhoto: null,
                      });
                      setPreviewImage(adminData.profilePhoto);
                    }}
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
                    className="flex items-center gap-2 px-8 py-2.5 rounded font-medium transition-all shadow-md hover:shadow-lg cursor-pointer"
                    style={{
                      backgroundColor: colors.primary,
                      color: colors.background,
                    }}
                  >
                    {loading ? (
                      <Loader size={20} />
                    ) : (
                      <>
                        <MdSave size={20} />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
