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
    <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
      {/* Modern Header */}
      <div className="sticky top-0 z-50 backdrop-blur-md border-b" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderColor: '#e5e7eb' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2.5 rounded-xl transition-all hover:scale-110 cursor-pointer"
                style={{ backgroundColor: '#f1f5f9', color: '#1e293b' }}
              >
                <MdArrowBack size={24} />
              </button>
              <div>
                <h1 className="text-2xl font-black" style={{ color: '#000000' }}>
                  My Profile
                </h1>
                <p className="text-sm font-medium" style={{ color: '#64748b' }}>
                  Manage your personal information
                </p>
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold shadow-lg transition-all hover:scale-105 cursor-pointer"
                style={{ backgroundColor: '#006cb5', color: '#ffffff' }}
              >
                <MdEdit size={20} />
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-8 shadow-xl border flex flex-col items-center text-center" style={{ borderColor: '#e5e7eb' }}>
            <div className="relative mb-6 group">
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 shadow-2xl" style={{ borderColor: '#006cb5' }}>
                <img
                  src={previewImage || "https://via.placeholder.com/150"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>

              {isEditing && (
                <label
                  className="absolute bottom-2 right-2 p-3 rounded-full cursor-pointer shadow-xl transition-transform hover:scale-110"
                  style={{ backgroundColor: '#1db64c', color: '#ffffff' }}
                >
                  <MdCameraAlt size={22} />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>

            <h2 className="text-2xl font-black mb-2" style={{ color: '#000000' }}>
              {adminData.name}
            </h2>
            <p className="text-sm mb-6 font-semibold" style={{ color: '#64748b' }}>
              Administrator
            </p>

            <div className="w-full py-3 rounded-xl mb-4 flex items-center justify-center gap-2" style={{ backgroundColor: '#10b98120' }}>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm font-bold" style={{ color: '#10b981' }}>
                Active Status
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Details/Edit Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-8 shadow-xl border" style={{ borderColor: '#e5e7eb' }}>
            <h3 className="text-xl font-black mb-6" style={{ color: '#000000' }}>
              Personal Details
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider mb-2" style={{ color: '#1e293b' }}>
                  Full Name
                </label>
                <div className="relative">
                  <MdPerson className="absolute left-4 top-4 w-5 h-5" style={{ color: '#006cb5' }} />
                  <input
                    type="text"
                    value={isEditing ? formData.name : adminData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!isEditing}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 outline-none transition-all"
                    style={{
                      backgroundColor: isEditing ? '#ffffff' : '#f8fafc',
                      borderColor: '#e5e7eb',
                      color: '#000000',
                    }}
                    onFocus={(e) => isEditing && (e.target.style.borderColor = '#006cb5')}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider mb-2" style={{ color: '#1e293b' }}>
                  Email Address
                </label>
                <div className="relative">
                  <MdEmail className="absolute left-4 top-4 w-5 h-5" style={{ color: '#006cb5' }} />
                  <input
                    type="email"
                    value={isEditing ? formData.email : adminData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 outline-none transition-all"
                    style={{
                      backgroundColor: isEditing ? '#ffffff' : '#f8fafc',
                      borderColor: '#e5e7eb',
                      color: '#000000',
                    }}
                    onFocus={(e) => isEditing && (e.target.style.borderColor = '#006cb5')}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
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
                      setFormData({
                        name: adminData.name,
                        email: adminData.email,
                        password: "",
                        profilePhoto: null,
                      });
                      setPreviewImage(adminData.profilePhoto);
                    }}
                    className="px-8 py-3 rounded-xl font-bold border-2 transition-all hover:bg-black/5 cursor-pointer"
                    style={{ borderColor: '#e5e7eb', color: '#1e293b' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold shadow-xl transition-all hover:scale-105 cursor-pointer"
                    style={{ backgroundColor: '#006cb5', color: '#ffffff' }}
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
    </div>
  );
};

export default Profile;
