import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { createDoctor } from "../apis/doctor";
import { getHospitalDropdown } from "../apis/hospital";
import { MdArrowBack, MdSave, MdImage, MdClose } from "react-icons/md";
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

const AddDoctor = () => {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [hospitalList, setHospitalList] = useState([]);
  const [selectedHospitalId, setSelectedHospitalId] = useState("");

  // States for Tag Inputs
  const [expertise, setExpertise] = useState([]);
  const [expInput, setExpInput] = useState("");

  const [procedures, setProcedures] = useState([]);
  const [procInput, setProcInput] = useState("");

  const [whyChoose, setWhyChoose] = useState([]);
  const [whyInput, setWhyInput] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    speciality: "",
    qualification: "",
    designation: "",
    experience: "",
    summary: "",
    about: "",
    photo: null,
    hospitalName: "",
    hospitalCity: "",
    hospitalAccreditation: "",
  });

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      const response = await getHospitalDropdown();
      if (response.success) {
        setHospitalList(response.hospitals || []);
      }
    } catch (error) {
      console.error("Error fetching hospitals:", error);
    }
  };

  const handleHospitalSelect = (e) => {
    const hospitalId = e.target.value;
    setSelectedHospitalId(hospitalId);

    if (hospitalId) {
      const selectedHospital = hospitalList.find((h) => h._id === hospitalId);
      if (selectedHospital) {
        setFormData({
          ...formData,
          hospitalName: selectedHospital.name,
          hospitalCity: selectedHospital.city,
          hospitalAccreditation: selectedHospital.accreditations.join(", "),
        });
      }
    } else {
      setFormData({
        ...formData,
        hospitalName: "",
        hospitalCity: "",
        hospitalAccreditation: "",
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, photo: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.photo) {
      Swal.fire("Error", "Please upload a doctor photo", "error");
      return;
    }

    try {
      setSubmitting(true);
      const data = new FormData();
      data.append("name", formData.name);
      data.append("speciality", formData.speciality);
      data.append("qualification", formData.qualification);
      data.append("designation", formData.designation);
      data.append("experience", formData.experience);
      data.append("summary", formData.summary);
      data.append("about", formData.about);
      data.append("photo", formData.photo);

      const hospitalObj = {
        name: formData.hospitalName,
        city: formData.hospitalCity,
        accreditation: formData.hospitalAccreditation
          .split(",")
          .map((i) => i.trim())
          .filter((i) => i),
      };

      data.append("hospital", JSON.stringify(hospitalObj));
      data.append("expertise", JSON.stringify(expertise));
      data.append("procedures", JSON.stringify(procedures));
      data.append("whyChoose", JSON.stringify(whyChoose));

      const response = await createDoctor(data);
      if (response.success) {
        Swal.fire("Success", "Doctor created successfully!", "success");
        navigate("/dashboard/doctor");
      }
    } catch (error) {
      console.error("Error creating doctor:", error);
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to create doctor",
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
              onClick={() => navigate(-1)}
              className="p-2.5 rounded-xl transition-all hover:scale-110 cursor-pointer"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: '#ffffff' }}
            >
              <MdArrowBack size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-black text-white flex items-center gap-3">
                <MdImage size={32} /> Add New Doctor
              </h1>
              <p className="text-sm mt-1" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                Create a comprehensive doctor profile with all details
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
          {/* Photo Upload Section */}
          <div className="mb-8">
            <label
              className="block text-sm font-semibold mb-3"
              style={{ color: '#1f2937' }}
            >
              Doctor Photo *
            </label>
            <div className="flex items-center gap-6">
              {imagePreview ? (
                <div className="relative group">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 rounded-full object-cover border-4 shadow-lg"
                    style={{ borderColor: '#006cb5' }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData({ ...formData, photo: null });
                    }}
                    className="absolute -top-2 -right-2 p-1.5 rounded-full shadow-lg cursor-pointer transition-all hover:scale-110"
                    style={{ backgroundColor: '#ef4444', color: '#ffffff' }}
                  >
                    <MdClose size={16} />
                  </button>
                </div>
              ) : (
                <div 
                  className="w-32 h-32 rounded-full border-4 border-dashed flex items-center justify-center"
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
                <MdImage size={22} /> {imagePreview ? 'Change Photo' : 'Upload Photo'}
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  className="block text-sm font-semibold mb-2.5"
                  style={{ color: '#1f2937' }}
                >
                  Doctor Name *
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
                  placeholder="e.g., Dr. Arvind Kumar"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-semibold mb-2.5"
                  style={{ color: '#1f2937' }}
                >
                  Speciality *
                </label>
                <input
                  type="text"
                  required
                  value={formData.speciality}
                  onChange={(e) =>
                    setFormData({ ...formData, speciality: e.target.value })
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
                  placeholder="e.g., Cardiology"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-semibold mb-2.5"
                  style={{ color: '#1f2937' }}
                >
                  Experience (Years) *
                </label>
                <input
                  type="number"
                  required
                  value={formData.experience}
                  onChange={(e) =>
                    setFormData({ ...formData, experience: e.target.value })
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
                  placeholder="e.g., 25"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label
                  className="block text-sm font-semibold mb-2.5"
                  style={{ color: '#1f2937' }}
                >
                  Qualification
                </label>
                <input
                  type="text"
                  value={formData.qualification}
                  onChange={(e) =>
                    setFormData({ ...formData, qualification: e.target.value })
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
                  placeholder="e.g., MBBS, MD, DM"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-semibold mb-2.5"
                  style={{ color: '#1f2937' }}
                >
                  Designation
                </label>
                <input
                  type="text"
                  value={formData.designation}
                  onChange={(e) =>
                    setFormData({ ...formData, designation: e.target.value })
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
                  placeholder="e.g., Principal Consultant"
                />
              </div>
            </div>
          </div>

          {/* Hospital Information Section */}
          <div className="mt-10">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: '#006cb5' }}>
              <div className="w-1 h-6 rounded-full" style={{ backgroundColor: '#006cb5' }}></div>
              Hospital Information
            </h2>
            <div
              className="p-6 rounded-xl border-2"
              style={{
                backgroundColor: '#f0f9ff',
                borderColor: '#bae6fd',
              }}
            >

              {/* Hospital Dropdown */}
              <div className="mb-6">
                <label
                  className="block text-sm font-semibold mb-2.5"
                  style={{ color: '#1f2937' }}
                >
                  Select Hospital
                </label>
                <select
                  value={selectedHospitalId}
                  onChange={handleHospitalSelect}
                  className="w-full px-4 py-3.5 rounded-xl border-2 outline-none cursor-pointer transition-all font-medium"
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
                >
                  <option value="">-- Select a Hospital --</option>
                  {hospitalList.map((hospital) => (
                    <option key={hospital._id} value={hospital._id}>
                      {hospital.name} - {hospital.city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Auto-filled Hospital Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label
                    className="block text-sm font-semibold mb-2.5"
                    style={{ color: '#1f2937' }}
                  >
                    Hospital Name
                  </label>
                  <input
                    type="text"
                    value={formData.hospitalName}
                    readOnly
                    className="w-full px-4 py-3.5 rounded-xl border-2 outline-none cursor-not-allowed opacity-70 font-medium"
                    style={{
                      backgroundColor: '#f9fafb',
                      borderColor: '#e5e7eb',
                      color: '#6b7280',
                    }}
                    placeholder="Auto-filled from dropdown"
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-semibold mb-2.5"
                    style={{ color: '#1f2937' }}
                  >
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.hospitalCity}
                    readOnly
                    className="w-full px-4 py-3.5 rounded-xl border-2 outline-none cursor-not-allowed opacity-70 font-medium"
                    style={{
                      backgroundColor: '#f9fafb',
                      borderColor: '#e5e7eb',
                      color: '#6b7280',
                    }}
                    placeholder="Auto-filled from dropdown"
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-semibold mb-2.5"
                    style={{ color: '#1f2937' }}
                  >
                    Accreditations
                  </label>
                  <input
                    type="text"
                    value={formData.hospitalAccreditation}
                    readOnly
                    className="w-full px-4 py-3.5 rounded-xl border-2 outline-none cursor-not-allowed opacity-70 font-medium"
                    style={{
                      backgroundColor: '#f9fafb',
                      borderColor: '#e5e7eb',
                      color: '#6b7280',
                    }}
                    placeholder="Auto-filled from dropdown"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Additional Details Section */}
          <div className="mt-10">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: '#006cb5' }}>
              <div className="w-1 h-6 rounded-full" style={{ backgroundColor: '#006cb5' }}></div>
              Additional Details
            </h2>

            <div className="mt-6">
              <label
                className="block text-sm font-semibold mb-2.5"
                style={{ color: '#1f2937' }}
              >
                Short Summary
              </label>
              <input
                type="text"
                value={formData.summary}
                onChange={(e) =>
                  setFormData({ ...formData, summary: e.target.value })
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
                placeholder="e.g., Very senior heart doctor"
              />
            </div>

            <div className="mt-6">
              <label
                className="block text-sm font-semibold mb-2.5"
                style={{ color: '#1f2937' }}
              >
                Detailed About
              </label>
              <textarea
                rows={4}
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
                placeholder="Full professional background of the doctor..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6">
              <TagInput
                label="Expertise"
                list={expertise}
                setList={setExpertise}
                input={expInput}
                setInput={setExpInput}
                placeholder="e.g., Heart Transplant"
                colors={colors}
              />
              <TagInput
                label="Procedures"
                list={procedures}
                setList={setProcedures}
                input={procInput}
                setInput={setProcInput}
                placeholder="e.g., Angioplasty"
                colors={colors}
              />
              <TagInput
                label="Why Choose"
                list={whyChoose}
                setList={setWhyChoose}
                input={whyInput}
                setInput={setWhyInput}
                placeholder="e.g., High success rate"
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
              onClick={() => navigate("/dashboard/doctor")}
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
                  <Loader size={22} color="#ffffff" /> Creating Doctor...
                </>
              ) : (
                <>
                  <MdSave size={22} /> Create Doctor Profile
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

export default AddDoctor;
