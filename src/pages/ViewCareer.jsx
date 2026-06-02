import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { getCareerById } from "../apis/career";
import { MdArrowBack, MdOutlineWork, MdOutlineFileDownload } from "react-icons/md";
import Loader from "../components/ui/Loader";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

const ViewCareer = () => {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const response = await getCareerById(id);
      if (response.success) {
        setData(response.data);
      }
    } catch (error) {
      console.error("Error fetching career details:", error);
      Swal.fire("Error", "Failed to fetch details", "error");
      navigate("/dashboard/career");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-10">
        <Loader size={60} />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-10 text-center" style={{ color: colors.textSecondary }}>
        Submission not found
      </div>
    );
  }

  const getFormTypeLabel = (type) => {
    switch (type) {
      case "global_ambassador":
        return "Global Ambassador";
      case "internship":
        return "Internship Application";
      case "full_time":
        return "Full-Time Role";
      case "b2b_partnership":
        return "B2B Partnership Request";
      default:
        return type;
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate("/dashboard/career")}
          className="p-3 rounded-xl transition-all hover:bg-slate-100 cursor-pointer shadow-sm border border-slate-200"
          style={{ color: colors.text }}
        >
          <MdArrowBack size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <MdOutlineWork className="text-[#006cb5]" />
            Submission Details
          </h1>
          <p className="text-sm font-medium" style={{ color: colors.textSecondary }}>
            {getFormTypeLabel(data.formType)} — Received on {new Date(data.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Main Details Grid */}
      <div
        className="rounded-3xl border p-8 shadow-sm"
        style={{
          backgroundColor: colors.background,
          borderColor: colors.accent + "30",
        }}
      >
        <div className="border-b pb-6 mb-6">
          <h2 className="text-lg font-bold text-slate-700 uppercase tracking-wider">
            Applicant Information
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* General Fields for all */}
          {data.formType !== "b2b_partnership" ? (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Full Name</h3>
              <p className="text-base font-bold text-slate-800 pt-1">{data.fullName || "—"}</p>
            </div>
          ) : (
            <>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Organization / Hospital Name</h3>
                <p className="text-base font-bold text-slate-800 pt-1">{data.organizationName || "—"}</p>
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Contact Person Name</h3>
                <p className="text-base font-bold text-slate-800 pt-1">{data.fullName || "—"}</p>
              </div>
            </>
          )}

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</h3>
            <p className="text-base font-medium text-slate-800 pt-1">
              {data.email ? (
                <a href={`mailto:${data.email}`} className="text-[#006cb5] hover:underline">
                  {data.email}
                </a>
              ) : (
                "—"
              )}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Mobile / Phone</h3>
            <p className="text-base font-medium text-slate-800 pt-1">{data.phone || "—"}</p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">City</h3>
            <p className="text-base font-medium text-slate-800 pt-1">{data.city || "—"}</p>
          </div>

          {data.country && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Country</h3>
              <p className="text-base font-medium text-slate-800 pt-1">{data.country}</p>
            </div>
          )}

          {/* Form Specific: Global Ambassador */}
          {data.formType === "global_ambassador" && (
            <>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Occupation / Profession</h3>
                <p className="text-base font-medium text-slate-800 pt-1">{data.occupation || "—"}</p>
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Highest Qualification</h3>
                <p className="text-base font-medium text-slate-800 pt-1">{data.highestQualification || "—"}</p>
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Languages Known</h3>
                <p className="text-base font-medium text-slate-800 pt-1">{data.languagesKnown || "—"}</p>
              </div>
            </>
          )}

          {/* Form Specific: B2B Partnership */}
          {data.formType === "b2b_partnership" && (
            <>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Destination / Designation</h3>
                <p className="text-base font-medium text-slate-800 pt-1">{data.designation || "—"}</p>
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Partnership Type</h3>
                <p className="text-base font-medium text-slate-800 pt-1 uppercase tracking-wide">{data.partnershipType || "—"}</p>
              </div>
            </>
          )}

          {/* Form Specific: Internship & Full-time */}
          {(data.formType === "internship" || data.formType === "full_time") && (
            <>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Age</h3>
                <p className="text-base font-medium text-slate-800 pt-1">{data.age || "—"}</p>
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Gender</h3>
                <p className="text-base font-medium text-slate-800 pt-1 uppercase">{data.gender || "—"}</p>
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Languages Known</h3>
                <p className="text-base font-medium text-slate-800 pt-1">{data.languagesKnown || "—"}</p>
              </div>
              {data.highestQualification && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Highest Qualification</h3>
                  <p className="text-base font-medium text-slate-800 pt-1">{data.highestQualification}</p>
                </div>
              )}
              {data.formType === "full_time" && (
                <>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Branch</h3>
                    <p className="text-base font-medium text-slate-800 pt-1">{data.branch || "—"}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Branch / Role</h3>
                    <p className="text-base font-medium text-slate-800 pt-1">{data.branchRole || "—"}</p>
                  </div>
                </>
              )}
              {data.linkedinId && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">LinkedIn Profile</h3>
                  <p className="text-base font-medium text-slate-800 pt-1">
                    <a href={data.linkedinId.startsWith('http') ? data.linkedinId : `https://${data.linkedinId}`} target="_blank" rel="noopener noreferrer" className="text-[#006cb5] hover:underline">
                      View Profile
                    </a>
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Education, Skills, and Experience (Expanded Block) */}
        {(data.formType === "internship" || data.formType === "full_time") && (
          <div className="mt-8 border-t pt-8">
            <h2 className="text-lg font-bold text-slate-700 uppercase tracking-wider mb-6">
              Qualifications & Experience
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.education && (
                <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Education Details</h3>
                  <div className="grid grid-cols-1 gap-3 text-sm">
                    <div>
                      <span className="font-bold text-slate-500">UG / Pass Year:</span>{" "}
                      <span className="text-slate-800">{data.education.ug || "—"}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-500">PG / Pass Year:</span>{" "}
                      <span className="text-slate-800">{data.education.pg || "—"}</span>
                    </div>
                    {data.formType === "full_time" && (
                      <div>
                        <span className="font-bold text-slate-500">Diploma Details:</span>{" "}
                        <span className="text-slate-800">{data.education.diploma || "—"}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Skills & Background</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-bold text-slate-500 block">Skills:</span>
                    <p className="text-slate-800 mt-1 font-medium">{data.skills || "—"}</p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-500 block">Experience Details:</span>
                    <p className="text-slate-800 mt-1 font-medium">{data.experience || "—"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Uploaded File Block */}
        <div className="mt-8 border-t pt-8">
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#006cb5]/10 flex items-center justify-center text-[#006cb5]">
                <MdOutlineWork size={28} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">
                  {data.formType === "b2b_partnership" ? "Company Profile / Brochure" : "CV / Resume Document"}
                </h3>
                <p className="text-xs text-slate-400">
                  {data.fileUrl ? "Document uploaded successfully" : "No document uploaded for this request"}
                </p>
              </div>
            </div>
            {data.fileUrl ? (
              <a
                href={data.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#006cb5] text-white font-bold rounded-xl hover:bg-[#005a96] transition-all shadow-md hover:shadow-lg text-sm cursor-pointer"
              >
                <MdOutlineFileDownload size={20} /> View / Download Document
              </a>
            ) : (
              <span className="text-slate-400 font-bold text-sm">—</span>
            )}
          </div>
        </div>

        {/* Navigation back */}
        <div className="flex justify-end gap-4 mt-10 pt-6 border-t" style={{ borderColor: colors.accent + "20" }}>
          <button
            onClick={() => navigate("/dashboard/career")}
            className="px-8 py-3 rounded-xl font-bold transition-all hover:bg-slate-100 border border-slate-200 cursor-pointer text-sm"
            style={{ color: colors.text }}
          >
            Back to Submissions
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewCareer;
