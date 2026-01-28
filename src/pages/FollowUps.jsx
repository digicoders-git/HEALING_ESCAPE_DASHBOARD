import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { getAllFollowUps } from "../apis/freeConsultation";
import {
  MdSearch,
  MdVisibility,
  MdInfo,
  MdCall,
  MdLocationOn,
  MdPerson,
  MdHistory,
} from "react-icons/md";
import Loader from "../components/ui/Loader";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import ModernSelect from "../components/ModernSelect";

const FollowUps = () => {
  const { colors, isDarkMode } = useTheme();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    fetchFollowUps();
  }, [statusFilter]);

  const fetchFollowUps = async () => {
    try {
      setLoading(true);
      const response = await getAllFollowUps({ status: statusFilter });

      if (response.success) {
        setData(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching follow-ups:", error);
      Swal.fire("Error", "Failed to fetch follow-ups", "error");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      done: "bg-green-100 text-green-700 border-green-200",
      missed: "bg-red-100 text-red-700 border-red-200",
    };
    const s = String(status).toLowerCase();
    const colorClass =
      statusColors[s] || "bg-gray-100 text-gray-700 border-gray-200";

    return (
      <span
        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm whitespace-nowrap ${colorClass}`}
      >
        {s}
      </span>
    );
  };

  const statusOptions = [
    { label: "All Status", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Done", value: "done" },
    { label: "Missed", value: "missed" },
  ];

  const filteredData = data.filter((item) => {
    const leadName = item.lead?.fullName?.toLowerCase() || "";
    const empName = item.employee?.name?.toLowerCase() || "";
    const note = item.note?.toLowerCase() || "";
    const searchLower = debouncedSearch.toLowerCase();

    return (
      leadName.includes(searchLower) ||
      empName.includes(searchLower) ||
      note.includes(searchLower)
    );
  });

  const renderFollowUpCard = (item, index) => (
    <div
      key={item._id}
      className="p-4 rounded-xl border mb-4 shadow-sm"
      style={{
        backgroundColor: colors.background,
        borderColor: colors.accent + "30",
      }}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className="text-xs opacity-60">#{index + 1}</span>
          <h3
            className="font-bold text-lg leading-tight"
            style={{ color: colors.text }}
          >
            {item.lead?.fullName || "N/A"}
          </h3>
          <div className="flex items-center gap-1 text-xs opacity-60 mt-0.5 font-medium">
            <MdCall size={14} />
            <span>{item.lead?.mobile}</span>
          </div>
        </div>
        {getStatusBadge(item.status)}
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-blue-600">
          <MdPerson className="shrink-0" size={16} />
          <span>Handled by: {item.employee?.name || "Admin"}</span>
        </div>
        <div
          className="p-3 rounded-lg bg-black/5 border border-black/5 italic text-sm"
          style={{ color: colors.textSecondary }}
        >
          "{item.note}"
        </div>
        <div className="flex items-center justify-between text-[10px] font-bold opacity-60 px-1">
          <div className="flex items-center gap-1 uppercase tracking-wider">
            <MdHistory size={14} />
            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
          </div>
          {item.nextFollowUpDate && (
            <span style={{ color: colors.primary }}>
              Next: {new Date(item.nextFollowUpDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      <div
        className="flex items-center justify-end pt-3 border-t"
        style={{ borderColor: colors.accent + "15" }}
      >
        <button
          onClick={() =>
            navigate(`/dashboard/manage-leads/view/${item.lead?._id}`)
          }
          className="p-2 rounded-lg bg-emerald-50 text-emerald-600 flex items-center gap-2 font-bold text-xs uppercase px-4 py-2"
        >
          <MdVisibility size={18} /> View Details
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <div
        className="shrink-0 p-4 md:p-6 pb-4 z-30 relative"
        style={{ backgroundColor: colors.background }}
      >
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1
                className="text-xl md:text-2xl font-bold"
                style={{ color: colors.text }}
              >
                Interaction History
              </h1>
              {!loading && (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm"
                  style={{
                    backgroundColor: colors.primary,
                    color: colors.background,
                  }}
                >
                  {filteredData.length}
                </div>
              )}
            </div>
            <p
              className="text-xs md:text-sm mt-1 opacity-60"
              style={{ color: colors.textSecondary }}
            >
              Monitor all lead interactions across the organization
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <MdSearch
              className="absolute left-3 top-2.5 z-10 opacity-50"
              style={{ color: colors.textSecondary }}
            />
            <input
              type="text"
              placeholder="Search history..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded border focus:ring-1 outline-none text-sm transition-all"
              style={{
                backgroundColor: isDarkMode
                  ? colors.accent + "10"
                  : colors.background,
                borderColor: colors.accent + "30",
                color: colors.text,
              }}
            />
          </div>
          <div className="min-w-0 md:w-48">
            <ModernSelect
              options={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="All Status"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 md:px-6 pb-4 md:pb-6 flex flex-col overflow-hidden min-h-0">
        <div className="flex-1 overflow-auto custom-scrollbar relative">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <Loader size={48} />
            </div>
          ) : filteredData.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center gap-2 opacity-40">
              <MdInfo size={64} />
              <p className="font-bold uppercase tracking-widest text-sm">
                No record found
              </p>
            </div>
          ) : (
            <>
              {/* Desktop View */}
              <div
                className="hidden md:block rounded-xl border overflow-hidden shadow-sm"
                style={{ borderColor: colors.accent + "20" }}
              >
                <table className="w-full text-left border-collapse">
                  <thead
                    className="sticky top-0 z-20"
                    style={{ backgroundColor: colors.background }}
                  >
                    <tr
                      className="border-b"
                      style={{ borderColor: colors.accent + "20" }}
                    >
                      <th className="p-4 font-bold text-xs opacity-60 uppercase tracking-widest">
                        #
                      </th>
                      <th className="p-4 font-bold text-xs opacity-60 uppercase tracking-widest">
                        Lead Name
                      </th>
                      <th className="p-4 font-bold text-xs opacity-60 uppercase tracking-widest">
                        Handled By
                      </th>
                      <th className="p-4 font-bold text-xs opacity-60 uppercase tracking-widest">
                        Note
                      </th>
                      <th className="p-4 font-bold text-xs opacity-60 uppercase tracking-widest">
                        Next Date
                      </th>
                      <th className="p-4 font-bold text-xs opacity-60 uppercase tracking-widest">
                        Status
                      </th>
                      <th className="p-4 font-bold text-xs opacity-60 uppercase tracking-widest text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((item, index) => (
                      <tr
                        key={item._id}
                        className="border-b last:border-0 hover:bg-black/5 transition-colors text-sm"
                        style={{ borderColor: colors.accent + "10" }}
                      >
                        <td className="p-4 opacity-50">{index + 1}</td>
                        <td className="p-4 font-bold">
                          {item.lead?.fullName || "N/A"}
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-blue-600">
                              {item.employee?.name || "Admin"}
                            </span>
                            <span className="text-[10px] opacity-60">
                              {item.employee?.phone}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 max-w-xs truncate opacity-80 italic">
                          "{item.note}"
                        </td>
                        <td className="p-4 opacity-70">
                          {item.nextFollowUpDate
                            ? new Date(
                                item.nextFollowUpDate,
                              ).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="p-4">{getStatusBadge(item.status)}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() =>
                              navigate(
                                `/dashboard/manage-leads/view/${item.lead?._id}`,
                              )
                            }
                            className="p-2 rounded-lg hover:bg-emerald-50 text-emerald-600"
                          >
                            <MdVisibility size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile View */}
              <div className="md:hidden pb-4">
                {filteredData.map((item, index) =>
                  renderFollowUpCard(item, index),
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: ${isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}; border-radius: 10px; }
      `,
        }}
      />
    </div>
  );
};

export default FollowUps;
