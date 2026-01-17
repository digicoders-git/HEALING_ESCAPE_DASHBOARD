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
              className="hover:bg-black/10 rounded-full p-0.5 cursor-pointer"
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

    if (!formData.image) {
      Swal.fire("Error", "Please upload a hospital image", "error");
      return;
    }

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
        JSON.stringify(internationalServices)
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
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/dashboard/hospital")}
          className="p-2 rounded hover:bg-black/5 cursor-pointer"
          style={{ color: colors.text }}
        >
          <MdArrowBack size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: colors.text }}>
            Add Hospital
          </h1>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            Create a new hospital profile
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div
          className="rounded-lg border p-6"
          style={{
            backgroundColor: colors.background,
            borderColor: colors.accent + "30",
          }}
        >
          {/* Image Upload */}
          <div className="mb-6">
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: colors.textSecondary }}
            >
              Hospital Image *
            </label>
            <div className="flex items-center gap-4">
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-24 h-24 rounded object-cover border"
                  style={{ borderColor: colors.accent + "30" }}
                />
              )}
              <label
                className="flex items-center gap-2 px-4 py-2 rounded border cursor-pointer hover:bg-black/5"
                style={{
                  borderColor: colors.accent + "30",
                  color: colors.text,
                }}
              >
                <MdImage size={20} /> Upload Image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.textSecondary }}
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
                className="w-full px-4 py-2.5 rounded border outline-none focus:ring-1"
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.accent + "40",
                  color: colors.text,
                }}
                placeholder="e.g., Medanta - The Medicity"
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
                className="w-full px-4 py-2.5 rounded border outline-none focus:ring-1"
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.accent + "40",
                  color: colors.text,
                }}
                placeholder="e.g., Gurugram"
              />
            </div>
          </div>

          <div className="mt-6">
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: colors.textSecondary }}
            >
              About Hospital *
            </label>
            <textarea
              required
              rows={3}
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
              placeholder="Short summary about the hospital"
            />
          </div>

          <div className="mt-6">
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: colors.textSecondary }}
            >
              Full Description *
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded border outline-none focus:ring-1"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.accent + "40",
                color: colors.text,
              }}
              placeholder="Detailed description of hospital facilities and services"
            />
          </div>

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

          {/* Submit Button */}
          <div
            className="flex justify-end gap-4 mt-8 pt-6 border-t"
            style={{ borderColor: colors.accent + "20" }}
          >
            <button
              type="button"
              onClick={() => navigate("/dashboard/hospital")}
              className="px-6 py-2.5 rounded font-medium cursor-pointer"
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
              className="flex items-center gap-2 px-6 py-2.5 rounded font-medium shadow transition-all hover:scale-105 cursor-pointer"
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
                  <MdSave size={20} /> Create Hospital
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddHospital;
