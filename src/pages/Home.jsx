import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { getSpecialities } from "../apis/speciality";
import { getHospitals } from "../apis/hospital";
import { getDoctors } from "../apis/doctor";
import { getBlogs } from "../apis/blog";
import { getGalleries } from "../apis/gallery";
import { getVideos } from "../apis/video";
import { getEnquiries } from "../apis/enquiry";
import { getFreeConsultations } from "../apis/freeConsultation";
import {
  MdLocalHospital,
  MdPeople,
  MdArticle,
  MdCollections,
  MdVideoLibrary,
  MdCategory,
  MdContactMail,
  MdQuestionAnswer,
} from "react-icons/md";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Loader from "../components/ui/Loader";

const Home = () => {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    specialities: 0,
    hospitals: 0,
    doctors: 0,
    blogs: 0,
    gallery: 0,
    videos: 0,
    enquiries: 0,
    freeConsultations: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [
        specRes,
        hospRes,
        docRes,
        blogRes,
        galRes,
        vidRes,
        enqRes,
        freeConsRes,
      ] = await Promise.all([
        getSpecialities({ limit: 1 }),
        getHospitals({ limit: 1 }),
        getDoctors({ limit: 1 }),
        getBlogs({ limit: 1 }),
        getGalleries({ limit: 1 }),
        getVideos({ limit: 1 }),
        getEnquiries({ limit: 1 }),
        getFreeConsultations({ limit: 1 }),
      ]);

      setStats({
        specialities: specRes.total || 0,
        hospitals: hospRes.total || 0,
        doctors: docRes.total || 0,
        blogs: blogRes.total || 0,
        gallery: galRes.total || 0,
        videos: vidRes.total || 0,
        enquiries: enqRes.total || 0,
        freeConsultations: freeConsRes.total || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const chartOptions = {
    chart: {
      type: "column",
      backgroundColor: "transparent",
      style: {
        fontFamily: "Inter, sans-serif",
      },
    },
    title: {
      text: "Data Overview",
      style: { color: colors.text, fontWeight: "bold" },
    },
    xAxis: {
      categories: [
        "Specialities",
        "Hospitals",
        "Doctors",
        "Blogs",
        "Gallery",
        "Videos",
        "Enquiries",
        "Free Consultations",
      ],
      labels: {
        style: { color: colors.textSecondary },
      },
      lineColor: colors.accent + "20",
    },
    yAxis: {
      min: 0,
      title: {
        text: "Total Counts",
        style: { color: colors.textSecondary },
      },
      labels: {
        style: { color: colors.textSecondary },
      },
      gridLineColor: colors.accent + "10",
    },
    legend: {
      enabled: false,
    },
    tooltip: {
      backgroundColor: colors.background,
      style: { color: colors.text },
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.accent + "30",
    },
    series: [
      {
        name: "Total",
        data: [
          { y: stats.specialities, color: "#6366f1" },
          { y: stats.hospitals, color: "#ec4899" },
          { y: stats.doctors, color: "#3b82f6" },
          { y: stats.blogs, color: "#f59e0b" },
          { y: stats.gallery, color: "#10b981" },
          { y: stats.videos, color: "#ef4444" },
          { y: stats.enquiries, color: "#8b5cf6" },
          { y: stats.freeConsultations, color: "#14b8a6" },
        ],
        borderRadius: 5,
      },
    ],
    credits: {
      enabled: false,
    },
  };

  const statCards = [
    {
      title: "Specialities",
      count: stats.specialities,
      icon: MdCategory,
      color: "#6366f1",
    },
    {
      title: "Hospitals",
      count: stats.hospitals,
      icon: MdLocalHospital,
      color: "#ec4899",
    },
    {
      title: "Doctors",
      count: stats.doctors,
      icon: MdPeople,
      color: "#3b82f6",
    },
    { title: "Blogs", count: stats.blogs, icon: MdArticle, color: "#f59e0b" },
    {
      title: "Gallery",
      count: stats.gallery,
      icon: MdCollections,
      color: "#10b981",
    },
    {
      title: "Videos",
      count: stats.videos,
      icon: MdVideoLibrary,
      color: "#ef4444",
    },
    {
      title: "Enquiries",
      count: stats.enquiries,
      icon: MdContactMail,
      color: "#8b5cf6",
    },
    {
      title: "Free Consultations",
      count: stats.freeConsultations,
      icon: MdQuestionAnswer,
      color: "#14b8a6",
    },
  ];

  const lineChartOptions = {
    chart: {
      type: "line",
      backgroundColor: "transparent",
      style: {
        fontFamily: "Inter, sans-serif",
      },
    },
    title: {
      text: "Data Trends Overview",
      style: { color: colors.text, fontWeight: "bold" },
    },
    xAxis: {
      categories: [
        "Specialities",
        "Hospitals",
        "Doctors",
        "Blogs",
        "Gallery",
        "Videos",
        "Enquiries",
        "Free Consultations",
      ],
      labels: {
        style: { color: colors.textSecondary },
      },
      lineColor: colors.accent + "20",
    },
    yAxis: {
      min: 0,
      title: {
        text: "Count",
        style: { color: colors.textSecondary },
      },
      labels: {
        style: { color: colors.textSecondary },
      },
      gridLineColor: colors.accent + "10",
    },
    legend: {
      enabled: false,
    },
    tooltip: {
      backgroundColor: colors.background,
      style: { color: colors.text },
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.accent + "30",
    },
    series: [
      {
        name: "Total Count",
        data: [
          stats.specialities,
          stats.hospitals,
          stats.doctors,
          stats.blogs,
          stats.gallery,
          stats.videos,
          stats.enquiries,
          stats.freeConsultations,
        ],
        color: colors.primary,
        marker: {
          fillColor: colors.primary,
          lineWidth: 2,
          lineColor: colors.background,
        },
      },
    ],
    credits: {
      enabled: false,
    },
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader size={50} />
      </div>
    );

  return (
    <div className="p-6 space-y-8 text-left">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: colors.text }}>
          {getGreeting()}!
        </h1>
        <p className="text-sm" style={{ color: colors.textSecondary }}>
          Here's what's happening across your dashboard today.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="relative p-6 rounded-2xl shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group cursor-pointer overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${card.color}15 0%, ${card.color}05 100%)`,
              border: `1.5px solid ${card.color}30`,
              backdropFilter: 'blur(10px)',
            }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 -mr-16 -mt-16 transition-all duration-500 group-hover:scale-150" 
              style={{ backgroundColor: card.color }}
            />
            <div className="relative flex flex-col items-start space-y-4">
              <div
                className="p-4 rounded-xl shadow-md transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
                style={{
                  background: `linear-gradient(135deg, ${card.color} 0%, ${card.color}dd 100%)`,
                  color: '#FFFFFF',
                }}
              >
                <card.icon size={32} />
              </div>
              <div className="w-full">
                <p
                  className="text-xs font-semibold uppercase tracking-wider mb-2"
                  style={{ color: card.color }}
                >
                  {card.title}
                </p>
                <h3
                  className="text-4xl font-black transition-all duration-300 group-hover:scale-105"
                  style={{ color: card.color }}
                >
                  {card.count}
                </h3>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 transition-all duration-500 group-hover:h-2" 
              style={{ background: `linear-gradient(90deg, ${card.color} 0%, ${card.color}80 100%)` }}
            />
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div
        className="p-8 rounded-2xl border shadow-xl transition-all hover:shadow-2xl backdrop-blur-sm"
        style={{
          backgroundColor: '#FFFFFF',
          borderColor: colors.accent,
        }}
      >
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </div>

      {/* Line Chart Section */}
      <div
        className="p-8 rounded-2xl border shadow-xl transition-all hover:shadow-2xl backdrop-blur-sm"
        style={{
          backgroundColor: '#FFFFFF',
          borderColor: colors.accent,
        }}
      >
        <HighchartsReact highcharts={Highcharts} options={lineChartOptions} />
      </div>
    </div>
  );
};

export default Home;
