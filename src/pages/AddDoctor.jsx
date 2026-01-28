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
        className="block text-sm font-medium mb-2"
        style={{ color: colors.textSecondary }}
      >
        {label} (Press Enter to add)
      </label>
      <div
        className="w-full px-4 py-2 rounded border min-h-[45px] flex flex-wrap gap-2 items-center"
        style={{
          backgroundColor: colors.background,
          borderColor: colors.accent + "40",
        }}
      >
        {list.map((tag, index) => (
          <span
            key={index}
            className="px-3 py-1 rounded-full text-sm flex items-center gap-2 border"
            style={{
              backgroundColor: colors.primary + "15",
              borderColor: colors.primary + "30",
              color: colors.text,
            }}
          >
            {tag}
            <button
              type="button"
              onClick={() => handleRemoveTag(index)}
              className="rounded-full p-0.5 cursor-pointer transition-colors"
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = colors.accent + "30")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
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
          className="flex-1 min-w-[120px] outline-none bg-transparent"
          style={{ color: colors.text }}
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
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded hover:bg-black/5 cursor-pointer"
          style={{ color: colors.text }}
        >
          <MdArrowBack size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: colors.text }}>
            Add Doctor
          </h1>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            Create a new doctor profile
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-full">
        <div
          className="rounded-lg border p-6 shadow-sm"
          style={{
            backgroundColor: colors.background,
            borderColor: colors.accent + "30",
          }}
        >
          {/* Photo Upload */}
          <div className="mb-8">
            <label
              className="block text-sm font-medium mb-3"
              style={{ color: colors.textSecondary }}
            >
              Doctor Photo *
            </label>
            <div className="flex items-center gap-6">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-28 h-28 rounded-full object-cover border-2 shadow-md"
                  style={{ borderColor: colors.primary }}
                />
              ) : (
                <div
                  className="w-28 h-28 rounded-full border-2 border-dashed flex items-center justify-center"
                  style={{
                    borderColor: colors.accent + "40",
                    color: colors.textSecondary,
                  }}
                >
                  No Photo
                </div>
              )}
              <label
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg border cursor-pointer hover:bg-black/5 transition-all"
                style={{
                  borderColor: colors.accent + "30",
                  color: colors.text,
                }}
              >
                <MdImage size={22} />{" "}
                {imagePreview ? "Change Photo" : "Upload Photo"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.textSecondary }}
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
                className="w-full px-4 py-2.5 rounded border outline-none focus:ring-1"
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.accent + "40",
                  color: colors.text,
                }}
                placeholder="e.g., Dr. Arvind Kumar"
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.textSecondary }}
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
                className="w-full px-4 py-2.5 rounded border outline-none focus:ring-1"
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.accent + "40",
                  color: colors.text,
                }}
                placeholder="e.g., Cardiology"
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.textSecondary }}
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
                className="w-full px-4 py-2.5 rounded border outline-none focus:ring-1"
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.accent + "40",
                  color: colors.text,
                }}
                placeholder="e.g., 25"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.textSecondary }}
              >
                Qualification
              </label>
              <input
                type="text"
                value={formData.qualification}
                onChange={(e) =>
                  setFormData({ ...formData, qualification: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded border outline-none focus:ring-1"
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.accent + "40",
                  color: colors.text,
                }}
                placeholder="e.g., MBBS, MD, DM"
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.textSecondary }}
              >
                Designation
              </label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) =>
                  setFormData({ ...formData, designation: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded border outline-none focus:ring-1"
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.accent + "40",
                  color: colors.text,
                }}
                placeholder="e.g., Principal Consultant"
              />
            </div>
          </div>

          <div
            className="mt-8 p-6 rounded-lg border-2 border-dashed"
            style={{
              backgroundColor: colors.accent + "10",
              borderColor: colors.accent + "30",
            }}
          >
            <h3
              className="text-sm font-bold uppercase tracking-wider mb-4"
              style={{ color: colors.primary }}
            >
              Hospital Information
            </h3>

            {/* Hospital Dropdown */}
            <div className="mb-6">
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.textSecondary }}
              >
                Select Hospital
              </label>
              <select
                value={selectedHospitalId}
                onChange={handleHospitalSelect}
                className="w-full px-4 py-2.5 rounded border outline-none focus:ring-1 cursor-pointer transition-all"
                style={{
                  backgroundColor: colors.sidebar || colors.background,
                  borderColor: colors.accent + "40",
                  color: colors.text,
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
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.textSecondary }}
                >
                  Hospital Name
                </label>
                <input
                  type="text"
                  value={formData.hospitalName}
                  readOnly
                  className="w-full px-4 py-2.5 rounded border outline-none cursor-not-allowed opacity-70"
                  style={{
                    backgroundColor: colors.accent + "10",
                    borderColor: colors.accent + "40",
                    color: colors.textSecondary,
                  }}
                  placeholder="Auto-filled from dropdown"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.textSecondary }}
                >
                  City
                </label>
                <input
                  type="text"
                  value={formData.hospitalCity}
                  readOnly
                  className="w-full px-4 py-2.5 rounded border outline-none cursor-not-allowed opacity-70"
                  style={{
                    backgroundColor: colors.accent + "10",
                    borderColor: colors.accent + "40",
                    color: colors.textSecondary,
                  }}
                  placeholder="Auto-filled from dropdown"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.textSecondary }}
                >
                  Accreditations
                </label>
                <input
                  type="text"
                  value={formData.hospitalAccreditation}
                  readOnly
                  className="w-full px-4 py-2.5 rounded border outline-none cursor-not-allowed opacity-70"
                  style={{
                    backgroundColor: colors.accent + "10",
                    borderColor: colors.accent + "40",
                    color: colors.textSecondary,
                  }}
                  placeholder="Auto-filled from dropdown"
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: colors.textSecondary }}
            >
              Short Summary
            </label>
            <input
              type="text"
              value={formData.summary}
              onChange={(e) =>
                setFormData({ ...formData, summary: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded border outline-none focus:ring-1"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.accent + "40",
                color: colors.text,
              }}
              placeholder="e.g., Very senior heart doctor"
            />
          </div>

          <div className="mt-6">
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: colors.textSecondary }}
            >
              Detailed About
            </label>
            <textarea
              rows={4}
              value={formData.about}
              onChange={(e) =>
                setFormData({ ...formData, about: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded border outline-none focus:ring-1"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.accent + "40",
                color: colors.text,
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

          {/* Submit Button */}
          <div
            className="flex justify-end gap-4 mt-8 pt-6 border-t"
            style={{ borderColor: colors.accent + "20" }}
          >
            <button
              type="button"
              onClick={() => navigate("/dashboard/doctor")}
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
              className="flex items-center gap-2 px-8 py-2.5 rounded-lg font-bold shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
              style={{
                backgroundColor: colors.primary,
                color: colors.background,
              }}
            >
              {submitting ? (
                <>
                  <Loader size={20} /> Creating...
                </>
              ) : (
                <>
                  <MdSave size={20} /> Create Doctor Profile
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddDoctor;
