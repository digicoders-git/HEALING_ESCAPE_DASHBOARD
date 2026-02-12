import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import {
  MdMenu,
  MdDashboard,
  MdLogout,
  MdPeople,
  MdStorefront,
  MdPerson,
  MdLocalHospital,
  MdOutlineArticle,
  MdOutlineCollections,
  MdOutlineVideoLibrary,
  MdQuestionAnswer,
  MdBusiness,
} from "react-icons/md";

import { Clock } from "./Clock";
import logoo from "../assets/logo.png";
import landLogoo from "../assets/landLogoo.png";
import { ChevronDown } from "lucide-react";
import Swal from "sweetalert2";

const Dashboard = () => {
  const { colors } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("admin-token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of the dashboard!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout!",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("admin-token");
        navigate("/");
        Swal.fire(
          "Logged Out!",
          "You have been logged out successfully.",
          "success",
        );
      }
    });
  };





  const navLinks = [
    { name: "Dashboard", icon: MdDashboard, path: "/dashboard" },
    { name: "Speciality", icon: MdStorefront, path: "/dashboard/speciality" },
    { name: "Hospitals", icon: MdLocalHospital, path: "/dashboard/hospital" },
    { name: "Doctors", icon: MdPeople, path: "/dashboard/doctor" },
    { name: "Blogs", icon: MdOutlineArticle, path: "/dashboard/blog" },
    { name: "Gallery", icon: MdOutlineCollections, path: "/dashboard/gallery" },
    { name: "Videos", icon: MdOutlineVideoLibrary, path: "/dashboard/video" },
    {
      name: "Enquiry",
      icon: MdQuestionAnswer,
      path: "/dashboard/enquiry",
    },
    {
      name: "CRM",
      icon: MdBusiness,
      path: "#",
      submenu: [
        { name: "Employee", path: "/dashboard/employee" },
        { name: "Manage Leads", path: "/dashboard/manage-leads" },
        { name: "Follow Ups", path: "/dashboard/follow-ups" },
      ],
    },
    { name: "Profile", icon: MdPerson, path: "/dashboard/profile" },
  ];



  return (
    <div
      className="flex h-screen relative overflow-hidden"
      style={{ backgroundColor: colors.background }}
    >
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full z-[9999] transition-all duration-700 ease-out border-r shadow-lg md:relative md:z-auto flex flex-col ${
          sidebarOpen
            ? "translate-x-0 w-64 "
            : "-translate-x-full w-64 md:translate-x-0 md:w-18"
        }`}
        style={{
          backgroundColor: colors.sidebar || colors.background,
          borderColor: colors.accent,
        }}
      >
        <div
          className="flex items-center justify-center border-b h-[61px] px-4 shadow-sm"
          style={{ borderColor: colors.accent }}
        >
          {sidebarOpen ? (
            <div className="transition-all duration-500 ease-out flex items-center justify-center w-full">
              <img
                src={landLogoo}
                className="max-w-[180px] h-11 object-contain"
                alt="Healing Escape"
              />
            </div>
          ) : (
            <div className="w-12 h-12 flex items-center justify-center transition-all duration-500 overflow-hidden">
              <img src={logoo} className="w-10 h-10 object-contain" alt="HE" />
            </div>
          )}
        </div>
        <nav className="mt-5 pt-1 flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
          {navLinks.map((link, index) => {
            if (link.submenu) {
              const isOpen = openSubmenu === link.name;
              const isAnySubmenuActive = link.submenu.some((sub) => {
                return location.pathname === sub.path;
              });

              return (
                <div key={index}>
                  <button
                    onClick={() => setOpenSubmenu(isOpen ? null : link.name)}
                    className={`flex items-center justify-between w-[93%] px-4 py-2.5 mx-2 rounded-lg mb-1 transition-all duration-200 cursor-pointer font-bold ${
                      isAnySubmenuActive ? "ring-2 shadow-sm" : ""
                    } ${!sidebarOpen ? "justify-center! w-auto!" : ""}`}
                    style={{
                      color: isAnySubmenuActive ? colors.primary : colors.text,
                      backgroundColor: isAnySubmenuActive
                        ? colors.primary + "10"
                        : "transparent",
                      ringColor: isAnySubmenuActive
                        ? colors.primary
                        : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!isAnySubmenuActive) {
                        e.target.style.backgroundColor = colors.accent;
                        e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isAnySubmenuActive) {
                        e.target.style.backgroundColor = "transparent";
                        e.target.style.boxShadow = "none";
                      }
                    }}
                    title={!sidebarOpen ? link.name : ""}
                  >
                    <div
                      className={`flex items-center ${
                        !sidebarOpen ? "justify-center" : ""
                      }`}
                    >
                      <link.icon className="w-5 h-5 shrink-0" />
                      <span
                        className={`ml-3 whitespace-nowrap transition-all duration-300 ${
                          sidebarOpen
                            ? "opacity-100 w-auto"
                            : "opacity-0 w-0 overflow-hidden"
                        }`}
                      >
                        {link.name}
                      </span>
                    </div>
                    {sidebarOpen && (
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen && sidebarOpen
                        ? "max-h-96 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="ml-8 mr-2 mb-2 space-y-1 pt-1">
                      {link.submenu.map((sublink, subIndex) => {
                        let isSubActive = location.pathname === sublink.path;

                        return (
                          <NavLink
                            key={subIndex}
                            to={sublink.path}
                            onClick={() => {
                              if (window.innerWidth < 768) {
                                setSidebarOpen(false);
                              }
                            }}
                            className="flex items-center px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer font-bold"
                            style={{
                              color: isSubActive ? colors.primary : colors.text,
                              backgroundColor: isSubActive
                                ? colors.primary + "10"
                                : "transparent",
                              fontSize: "13px",
                            }}
                            onMouseEnter={(e) => {
                              if (!isSubActive) {
                                e.target.style.backgroundColor = colors.accent;
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isSubActive) {
                                e.target.style.backgroundColor = "transparent";
                              }
                            }}
                          >
                            {sublink.name}
                          </NavLink>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            }

            const isActive =
              location.pathname === link.path ||
              (link.path === "/dashboard" &&
                (location.pathname === "/dashboard" ||
                  location.pathname === "/dashboard/home"));
            return (
              <NavLink
                key={index}
                to={link.path}
                onClick={() => {
                  if (window.innerWidth < 768) {
                    setSidebarOpen(false);
                  }
                }}
                className={`flex items-center px-4 py-2.5 mx-2 rounded-lg mb-2 transition-all duration-200 cursor-pointer font-bold ${
                  isActive ? "ring-2 shadow-sm" : ""
                } ${!sidebarOpen ? "justify-center" : ""}`}
                style={{
                  color: isActive ? colors.primary : colors.text,
                  backgroundColor: isActive
                    ? colors.primary + "10"
                    : "transparent",
                  ringColor: isActive ? colors.primary : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.target.style.backgroundColor = colors.accent;
                    e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.boxShadow = "none";
                  }
                }}
                title={!sidebarOpen ? link.name : ""}
              >
                <link.icon className="w-5 h-5 shrink-0" />
                <span
                  className={`ml-3 whitespace-nowrap transition-all duration-300 ${
                    sidebarOpen
                      ? "opacity-100 w-auto"
                      : "opacity-0 w-0 overflow-hidden"
                  }`}
                >
                  {link.name}
                </span>
              </NavLink>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div
          className="p-4 border-t shadow-sm"
          style={{ borderColor: colors.accent }}
        >
          <button
            onClick={handleLogout}
            className={`flex cursor-pointer items-center px-4 py-3 w-full rounded-lg transition-all duration-200 font-semibold ${
              !sidebarOpen ? "justify-center" : ""
            }`}
            style={{ color: "#DC2626" }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#FEE2E2";
              e.target.style.color = "#B91C1C";
              e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.color = "#DC2626";
              e.target.style.boxShadow = "none";
            }}
            title={!sidebarOpen ? "Logout" : ""}
          >
            <MdLogout className="w-5 h-5 shrink-0" />
            <span
              className={`ml-3 whitespace-nowrap transition-all duration-300 ${
                sidebarOpen
                  ? "opacity-100 w-auto"
                  : "opacity-0 w-0 overflow-hidden"
              }`}
            >
              Logout
            </span>
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-[9998] md:hidden bg-black/50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header
          className="h-17 border-b flex items-center px-4 md:px-6 relative shadow-sm"
          style={{
            backgroundColor: colors.sidebar,
            borderColor: colors.accent,
          }}
        >
          <div className="flex items-center space-x-2 md:space-x-4 flex-1">
            <button
              onClick={(e) => {
                setSidebarOpen((prev) => !prev);
              }}
              className="p-2 rounded-lg hover:bg-opacity-20 transition-all duration-200 cursor-pointer md:hidden"
              style={{
                color: colors.primary,
                zIndex: 10,
                position: "relative",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = colors.accent;
                e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
                e.target.style.boxShadow = "none";
              }}
            >
              <MdMenu className="w-6 h-6" style={{ pointerEvents: "none" }} />
            </button>
            <button
              onClick={(e) => {
                setSidebarOpen((prev) => !prev);
              }}
              className="p-2 rounded-lg hover:bg-opacity-20 transition-all duration-200 cursor-pointer hidden md:block"
              style={{
                color: colors.primary,
                zIndex: 10,
                position: "relative",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = colors.accent;
                e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
                e.target.style.boxShadow = "none";
              }}
            >
              <MdMenu className="w-6 h-6" style={{ pointerEvents: "none" }} />
            </button>
            {/* <div className='flex flex-col'>
              <h1 className='text-sm md:text-xl font-semibold' style={{ color: colors.text }}>Welcome Back</h1>
              <span className='text-xs md:text-sm' style={{ color: colors.textSecondary }}>Admin</span>
            </div> */}
            <div
              className="text-sm md:text-base font-bold"
              style={{ color: colors.primary }}
            >
              <Clock />
            </div>
          </div>


        </header>

        <div
          className="h-full w-full p-2 md:p-0 overflow-auto scrollbar-hide"
          style={{ backgroundColor: colors.background }}
        >
          <div className="max-w-full h-full flex flex-col">
            <Outlet />
          </div>
        </div>
      </div>


    </div>
  );
};

export default Dashboard;
