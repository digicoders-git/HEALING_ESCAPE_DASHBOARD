import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { createHospital } from "../apis/hospital";
import { MdArrowBack, MdSave, MdImage, MdClose, MdAdd } from "react-icons/md";
import Loader from "../components/ui/Loader";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const TagInput = ({
  label,
  list,
  setList,
  input,
  setInput,
  placeholder,
  colors,
}) => {
  const handleAddTag = (e) => {
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault();
      if (!list.includes(input.trim())) {
        setList([...list, input.trim()]);
      }
      setInput("");
    }
  };

  const handleRemoveTag = (indexToRemove) => {
    setList(list.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="mt-6">
      <label
        className="block text-sm font-semibold mb-2.5"
        style={{ color: '#1f2937' }}
      >
        {label} <span className="text-xs font-normal" style={{ color: '#6b7280' }}>(Press Enter to add)</span>
      </label>
      <div
        className="w-full px-4 py-3 rounded-xl border-2 min-h-[52px] flex flex-wrap gap-2 items-center transition-all"
        style={{
          backgroundColor: '#ffffff',
          borderColor: '#e5e7eb',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = '#006cb5';
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 108, 181, 0.1)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = '#e5e7eb';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {list.map((tag, index) => (
          <span
            key={index}
            className="px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm transition-all hover:scale-105"
            style={{
              backgroundColor: '#006cb5',
              color: '#ffffff',
            }}
          >
            {tag}
            <button
              type="button"
              onClick={() => handleRemoveTag(index)}
              className="rounded-full p-0.5 cursor-pointer transition-all hover:bg-white/20"
            >
              <MdClose size={14} />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleAddTag}
          className="flex-1 min-w-[120px] outline-none bg-transparent font-medium"
          style={{ color: '#1f2937' }}
          placeholder={list.length === 0 ? placeholder : "Add more..."}
        />
      </div>
    </div>
  );
};

const AddHospital = () => {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // States for Tag Inputs
  const [accreditations, setAccreditations] = useState([]);
  const [accInput, setAccInput] = useState("");

  const [specialities, setSpecialities] = useState([]);
  const [specInput, setSpecInput] = useState("");

  const [departments, setDepartments] = useState([]);
  const [deptInput, setDeptInput] = useState("");

  const [infrastructure, setInfrastructure] = useState([]);
  const [infraInput, setInfraInput] = useState("");

  const [whyChoose, setWhyChoose] = useState([]);
  const [whyInput, setWhyInput] = useState("");

  const [internationalServices, setInternationalServices] = useState([]);
  const [intInput, setIntInput] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    city: "",
    about: "",
    description: "",
    image: null,
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      const data = new FormData();
      data.append("name", formData.name);
      data.append("city", formData.city);
      data.append("about", formData.about);
      data.append("description", formData.description);
      data.append("image", formData.image);

      data.append("accreditations", JSON.stringify(accreditations));
      data.append("specialities", JSON.stringify(specialities));
      data.append("departments", JSON.stringify(departments));
      data.append("infrastructure", JSON.stringify(infrastructure));
      data.append("whyChoose", JSON.stringify(whyChoose));
      data.append(
        "internationalServices",
        JSON.stringify(internationalServices),
      );

      const response = await createHospital(data);
      if (response.success) {
        Swal.fire("Success", "Hospital created successfully!", "success");
        navigate("/dashboard/hospital");
      }
    } catch (error) {
      console.error("Error creating hospital:", error);
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to create hospital",
        "error",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f9fafb' }}>
      {/* Modern Header with Gradient */}
      <div 
        className="sticky top-0 z-50 shadow-md"
        style={{
          background: 'linear-gradient(135deg, #006cb5 0%, #004d84 100%)'
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard/hospital")}
              className="p-2.5 rounded-xl transition-all hover:scale-110 cursor-pointer"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: '#ffffff' }}
            >
              <MdArrowBack size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-black text-white flex items-center gap-3">
                <MdAdd size={32} /> Add New Hospital
              </h1>
              <p className="text-sm mt-1" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                Create a comprehensive hospital profile with all details
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit}>
          <div
            className="rounded-2xl shadow-xl p-8 border"
            style={{
              backgroundColor: '#ffffff',
              borderColor: '#e5e7eb',
            }}
          >
          {/* Image Upload Section */}
          <div className="mb-8">
            <label
              className="block text-sm font-semibold mb-3"
              style={{ color: '#1f2937' }}
            >
              Hospital Image *
            </label>
            <div className="flex items-center gap-6">
              {imagePreview ? (
                <div className="relative group">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 rounded-2xl object-cover border-4 shadow-lg"
                    style={{ borderColor: '#006cb5' }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData({ ...formData, image: null });
                    }}
                    className="absolute -top-2 -right-2 p-1.5 rounded-full shadow-lg cursor-pointer transition-all hover:scale-110"
                    style={{ backgroundColor: '#ef4444', color: '#ffffff' }}
                  >
                    <MdClose size={16} />
                  </button>
                </div>
              ) : (
                <div 
                  className="w-32 h-32 rounded-2xl border-4 border-dashed flex items-center justify-center"
                  style={{ borderColor: '#d1d5db', backgroundColor: '#f9fafb' }}
                >
                  <MdImage size={48} style={{ color: '#9ca3af' }} />
                </div>
              )}
              <label
                className="flex items-center gap-2 px-6 py-3 rounded-xl cursor-pointer transition-all hover:scale-105 shadow-md font-semibold"
                style={{
                  backgroundColor: '#006cb5',
                  color: '#ffffff',
                }}
              >
                <MdImage size={22} /> {imagePreview ? 'Change Image' : 'Upload Image'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>

          {/* Basic Information Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: '#006cb5' }}>
              <div className="w-1 h-6 rounded-full" style={{ backgroundColor: '#006cb5' }}></div>
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  className="block text-sm font-semibold mb-2.5"
                  style={{ color: '#1f2937' }}
                >
                  Hospital Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3.5 rounded-xl border-2 outline-none transition-all font-medium"
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
                  placeholder="e.g., Medanta - The Medicity"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-semibold mb-2.5"
                  style={{ color: '#1f2937' }}
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
                  className="w-full px-4 py-3.5 rounded-xl border-2 outline-none transition-all font-medium"
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
                  placeholder="e.g., Gurugram"
                />
              </div>
            </div>

            <div className="mt-6">
              <label
                className="block text-sm font-semibold mb-2.5"
                style={{ color: '#1f2937' }}
              >
                About Hospital
              </label>
              <textarea
                rows={3}
                value={formData.about}
                onChange={(e) =>
                  setFormData({ ...formData, about: e.target.value })
                }
                className="w-full px-4 py-3.5 rounded-xl border-2 outline-none transition-all font-medium resize-none"
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
                placeholder="Short summary about the hospital"
              />
            </div>

            <div className="mt-6">
              <label
                className="block text-sm font-semibold mb-2.5"
                style={{ color: '#1f2937' }}
              >
                Full Description
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-3.5 rounded-xl border-2 outline-none transition-all font-medium resize-none"
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
                placeholder="Detailed description of hospital facilities and services"
              />
            </div>
          </div>

          {/* Additional Details Section */}
          <div className="mt-10">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: '#006cb5' }}>
              <div className="w-1 h-6 rounded-full" style={{ backgroundColor: '#006cb5' }}></div>
              Additional Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <TagInput
                label="Accreditations"
                list={accreditations}
                setList={setAccreditations}
                input={accInput}
                setInput={setAccInput}
                placeholder="e.g., NABH"
                colors={colors}
              />
              <TagInput
                label="Specialities"
                list={specialities}
                setList={setSpecialities}
                input={specInput}
                setInput={setSpecInput}
                placeholder="e.g., Cardiology"
                colors={colors}
              />
              <TagInput
                label="Departments"
                list={departments}
                setList={setDepartments}
                input={deptInput}
                setInput={setDeptInput}
                placeholder="e.g., Oncology"
                colors={colors}
              />
              <TagInput
                label="Infrastructure"
                list={infrastructure}
                setList={setInfrastructure}
                input={infraInput}
                setInput={setInfraInput}
                placeholder="e.g., ICU"
                colors={colors}
              />
              <TagInput
                label="Why Choose"
                list={whyChoose}
                setList={setWhyChoose}
                input={whyInput}
                setInput={setWhyInput}
                placeholder="e.g., Best doctors"
                colors={colors}
              />
              <TagInput
                label="International Services"
                list={internationalServices}
                setList={setInternationalServices}
                input={intInput}
                setInput={setIntInput}
                placeholder="e.g., Visa help"
                colors={colors}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div
            className="flex justify-end gap-4 mt-10 pt-8 border-t-2"
            style={{ borderColor: '#e5e7eb' }}
          >
            <button
              type="button"
              onClick={() => navigate("/dashboard/hospital")}
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
                  <Loader size={22} color="#ffffff" /> Creating Hospital...
                </>
              ) : (
                <>
                  <MdSave size={22} /> Create Hospital
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

export default AddHospital;
