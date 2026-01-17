import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { getSpecialityById, updateSpeciality } from "../apis/speciality";
import { MdArrowBack, MdSave, MdImage, MdClose } from "react-icons/md";
import Loader from "../components/ui/Loader";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

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
        className="w-full px-4 py-2.5 rounded border min-h-[50px] flex flex-wrap gap-2 items-center"
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
              backgroundColor: colors.primary + "20",
              borderColor: colors.primary + "40",
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
          className="flex-1 min-w-[150px] outline-none bg-transparent"
          style={{ color: colors.text }}
          placeholder={list.length === 0 ? placeholder : "Add more..."}
        />
      </div>
    </div>
  );
};

const EditSpeciality = () => {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [whenRecommendedTags, setWhenRecommendedTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    whatIs: "",
    procedure: "",
    recovery: "",
    costRange: "",
    image: null,
  });

  useEffect(() => {
    fetchSpeciality();
  }, [id]);

  const fetchSpeciality = async () => {
    try {
      setLoading(true);
      const response = await getSpecialityById(id);
      if (response.success) {
        const data = response.speciality;
        setFormData({
          title: data.title,
          description: data.description,
          whatIs: data.whatIs,
          procedure: data.procedure,
          recovery: data.recovery,
          costRange: data.costRange,
          image: null,
        });
        setImagePreview(data.image);
        setWhenRecommendedTags(
          Array.isArray(data.whenRecommended) ? data.whenRecommended : []
        );
      }
    } catch (error) {
      console.error("Error fetching speciality:", error);
      Swal.fire("Error", "Failed to fetch speciality details", "error");
      navigate("/dashboard/speciality");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageClick = () => {
    if (imagePreview) {
      Swal.fire({
        imageUrl: imagePreview,
        imageAlt: "Preview",
        showConfirmButton: false,
        showCloseButton: true,
        width: "auto",
        background: colors.background,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (whenRecommendedTags.length === 0) {
      Swal.fire("Error", "Please add at least one recommendation", "error");
      return;
    }

    try {
      setSubmitting(true);

      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("whatIs", formData.whatIs);
      data.append("procedure", formData.procedure);
      data.append("recovery", formData.recovery);
      data.append("costRange", formData.costRange);

      if (formData.image) {
        data.append("image", formData.image);
      }

      data.append("whenRecommended", JSON.stringify(whenRecommendedTags));

      const response = await updateSpeciality(id, data);

      if (response.success) {
        Swal.fire("Success", "Speciality updated successfully!", "success");
        navigate("/dashboard/speciality");
      }
    } catch (error) {
      console.error("Error updating speciality:", error);
      if (error.response && error.response.status !== 500) {
        Swal.fire(
          "Error",
          error.response.data.message || "Failed to update speciality",
          "error"
        );
      } else {
        Swal.fire("Error", "Failed to update speciality", "error");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-10">
        <Loader size={60} />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/dashboard/speciality")}
          className="p-2 rounded transition-colors hover:bg-black/5 cursor-pointer"
          style={{ color: colors.text }}
        >
          <MdArrowBack size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: colors.text }}>
            Edit Speciality
          </h1>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            Update speciality information
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div
          className="rounded-lg border p-6 shadow-sm"
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
              Speciality Image
            </label>
            <div className="flex items-center gap-4">
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-24 h-24 rounded object-cover border cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ borderColor: colors.accent + "30" }}
                  onClick={handleImageClick}
                />
              )}
              <label
                className="flex items-center gap-2 px-4 py-2 rounded border cursor-pointer hover:bg-black/5 transition-colors"
                style={{
                  borderColor: colors.accent + "30",
                  color: colors.text,
                }}
              >
                <MdImage size={20} />
                Change Image
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
            {/* Title */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.textSecondary }}
              >
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded border outline-none focus:ring-2"
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.accent + "40",
                  color: colors.text,
                }}
                placeholder="e.g., Cardiology"
              />
            </div>

            {/* Cost Range */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.textSecondary }}
              >
                Cost Range *
              </label>
              <input
                type="text"
                required
                value={formData.costRange}
                onChange={(e) =>
                  setFormData({ ...formData, costRange: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded border outline-none focus:ring-2"
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.accent + "40",
                  color: colors.text,
                }}
                placeholder="e.g., 5000-8000"
              />
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: colors.textSecondary }}
            >
              Description *
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded border outline-none focus:ring-2"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.accent + "40",
                color: colors.text,
              }}
              placeholder="Brief description of the speciality"
            />
          </div>

          {/* What Is */}
          <div className="mt-6">
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: colors.textSecondary }}
            >
              What Is *
            </label>
            <textarea
              required
              rows={3}
              value={formData.whatIs}
              onChange={(e) =>
                setFormData({ ...formData, whatIs: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded border outline-none focus:ring-2"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.accent + "40",
                color: colors.text,
              }}
              placeholder="Detailed explanation of what this speciality is"
            />
          </div>

          {/* When Recommended - Badge Input */}
          <TagInput
            label="When Recommended *"
            list={whenRecommendedTags}
            setList={setWhenRecommendedTags}
            input={tagInput}
            setInput={setTagInput}
            placeholder="e.g., Chest pain"
            colors={colors}
          />

          {/* Procedure */}
          <div className="mt-6">
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: colors.textSecondary }}
            >
              Procedure *
            </label>
            <textarea
              required
              rows={3}
              value={formData.procedure}
              onChange={(e) =>
                setFormData({ ...formData, procedure: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded border outline-none focus:ring-2"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.accent + "40",
                color: colors.text,
              }}
              placeholder="Description of the procedure"
            />
          </div>

          {/* Recovery */}
          <div className="mt-6">
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: colors.textSecondary }}
            >
              Recovery *
            </label>
            <input
              type="text"
              required
              value={formData.recovery}
              onChange={(e) =>
                setFormData({ ...formData, recovery: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded border outline-none focus:ring-2"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.accent + "40",
                color: colors.text,
              }}
              placeholder="e.g., 4-6 weeks"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={() => navigate("/dashboard/speciality")}
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
              className="flex items-center gap-2 px-6 py-2.5 rounded font-medium shadow transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              style={{
                backgroundColor: colors.primary,
                color: colors.background,
              }}
            >
              {submitting ? (
                <>
                  <Loader size={20} />
                  Updating...
                </>
              ) : (
                <>
                  <MdSave size={20} />
                  Update Speciality
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditSpeciality;
