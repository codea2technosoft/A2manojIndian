import React, { useState, useEffect, useRef } from "react";
import {
  FaUserCircle,
  FaUserCheck,
  FaUsers,
  FaUserTie,
  FaHandshake,
  FaProjectDiagram,
  FaUsersCog,
  FaTasks,
  FaCheckCircle,
  FaBuilding,
  FaMoneyBillWave,
} from "react-icons/fa";
import { MdSettings, MdAssignmentTurnedIn } from "react-icons/md";
import { PiListNumbersFill } from "react-icons/pi";
import { RiCloseCircleLine, RiHandCoinLine } from "react-icons/ri";
import { HiMiniCubeTransparent } from "react-icons/hi2";
import { GoProjectSymlink } from "react-icons/go";
import { SiPlotly } from "react-icons/si";
import { useNavigate } from "react-router-dom";
import { GrChannel } from "react-icons/gr";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from "react-icons/md";
import { TbReceiptRupee } from "react-icons/tb";

// Icon mapping
const iconMap = {
  FaUserCircle,
  FaUserCheck,
  MdSettings,
  FaUsers,
  FaUserTie,
  FaHandshake,
  FaProjectDiagram,
  FaUsersCog,
  FaTasks,
  FaCheckCircle,
  FaBuilding,
  FaMoneyBillWave,
  MdAssignmentTurnedIn,
  HiMiniCubeTransparent,
  PiListNumbersFill,
  RiCloseCircleLine,
  GoProjectSymlink,
  SiPlotly,
  GrChannel,
  TbReceiptRupee,
  RiHandCoinLine,
};

const API_URL = process.env.REACT_APP_API_URL;
const imageSlider = `${process.env.REACT_APP_IMAGE_API_URL}/uploads/banner/`;

const Dashboard = ({ userType }) => {
  // ✅ Default safe state for all fields
  const [dashboard, setDashboard] = useState({
    todayAssociate: 0,
    todayChannel: 0,
    activeProject: 0,
    activeBlock: 0,
    activePlot: 0,
    totalAssociate: 0,
    totalChannel: 0,
    totalTeamCount: 0,
    total_property: 0,
    total_lead_loan: 0,
    ongoingProject: 0,
    completeProject: 0,
    total_sqyd_self_sales: 0,
    total_sqyd_team_sales: 0,
    total_sqyd_channel_sales: 0,
    total_self_sales_earning: 0,
    total_team_sales_earning: 0,
    total_channel_sales_earning: 0,
    total_loan_earning: 0,
  });

  const navigate = useNavigate();
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const token = localStorage.getItem("token");

    if (isLoggedIn !== "true" || !token) {
      navigate("/login");
    }
  }, [navigate]);

  const getAuthToken = () => localStorage.getItem("token");
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = getAuthToken();
        const response = await fetch(`${API_URL}/front-dashboard`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log("Fetched Dashboard Data:", data);

        if (data.status === "1") {
          setDashboard({
            todayAssociate: data.todayAssociate?.[0]?.total || 0,
            todayChannel: data.todayChannel?.[0]?.total || 0,
            activeProject:
              data.ActiveProject?.[0]?.total || data.activeProject?.[0]?.total || 0,
            activeBlock:
              data.Activeblock?.[0]?.total || data.activeBlock?.[0]?.total || 0,
            activePlot:
              data.ActivePlot?.[0]?.total || data.activePlot?.[0]?.total || 0,
            totalAssociate: data.totalAssociate?.[0]?.total || 0,
            totalChannel: data.totalChannel?.[0]?.total || 0,
            totalTeamCount: data.totalTeamCount?.[0]?.total || 0,
            total_property: data.total_property?.[0]?.total || 0,
            total_lead_loan: data.total_lead_loan?.[0]?.total || 0,
            ongoingProject: data.ongoingProject?.[0]?.total || 0,
            completeProject: data.completeProject?.[0]?.total || 0,
            total_sqyd_self_sales: data.total_sqyd_self_sales?.[0]?.total || 0,
            total_sqyd_team_sales: data.total_sqyd_team_sales?.[0]?.total || 0,
            total_sqyd_channel_sales:
              data.total_sqyd_channel_sales?.[0]?.total || 0,
            total_self_sales_earning: parseFloat(
              data.total_self_sales_earning?.[0]?.total || 0
            ),
            total_team_sales_earning: parseFloat(
              data.total_team_sales_earning?.[0]?.total || 0
            ),
            total_channel_sales_earning: parseFloat(
              data.total_channel_sales_earning?.[0]?.total || 0
            ),
            total_loan_earning: parseFloat(
              data.total_loan_earning?.[0]?.total || 0
            ),
          });
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      }
    };

    fetchDashboardData();
  }, []);

  const rawData = [
    {
      title: "Total Direct Associates Count",
      value: (
        <span style={{ color: dashboard.totalAssociate === 0 ? "red" : "green" }}>
          {dashboard.totalAssociate}
        </span>
      ),
      icon: "FaUserTie",
      href: "/my-associates",
    },
    {
      title: "Total Direct Channel Partners Count",
      value: (
        <span style={{ color: dashboard.totalChannel === 0 ? "red" : "green" }}>
          {dashboard.totalChannel}
        </span>
      ),
      icon: "FaHandshake",
      href: "/all-channel-list",
    },
    {
      title: "Projects Count",
      value: (
        <span style={{ color: dashboard.activeProject === 0 ? "red" : "green" }}>
          {dashboard.activeProject}
        </span>
      ),
      icon: "FaBuilding",
      href: "/all-project",
    },
    {
      title: "OnGoing Projects Count",
      value: (
        <span style={{ color: dashboard.ongoingProject === 0 ? "red" : "green" }}>
          {dashboard.ongoingProject}
        </span>
      ),
      icon: "FaTasks",
      href: "/all-project",
    },
    {
      title: "Completed Projects Count",
      value: (
        <span style={{ color: dashboard.completeProject === 0 ? "red" : "green" }}>
          {dashboard.completeProject}
        </span>
      ),
      icon: "FaCheckCircle",
      href: "/all-project",
    },
    {
      title: "Total 11 Level My Team Count",
      value: (
        <span style={{ color: dashboard.totalTeamCount === 0 ? "red" : "green" }}>
          {dashboard.totalTeamCount}
        </span>
      ),
      icon: "FaUsersCog",
      href: "/my-team",
    },
    {
      title: "Total Property Leads Count",
      value: (
        <span style={{ color: dashboard.total_property === 0 ? "red" : "green" }}>
          {dashboard.total_property}
        </span>
      ),
      icon: "FaBuilding",
      href: "/property-lead-list",
    },
    {
      title: "Total Loan Leads Count",
      value: (
        <span style={{ color: dashboard.total_lead_loan === 0 ? "red" : "green" }}>
          {dashboard.total_lead_loan}
        </span>
      ),
      icon: "RiHandCoinLine",
      href: "/loan-list",
    },
    {
      title: "Total SQYD Self Sales",
      value: (
        <span
          style={{
            color:
              Number(dashboard.total_sqyd_self_sales) === 0 ||
              !dashboard.total_sqyd_self_sales
                ? "red"
                : "green",
          }}
        >
          {Number(dashboard.total_sqyd_self_sales) > 0
            ? Number(dashboard.total_sqyd_self_sales).toFixed(2)
            : "0.00"}
        </span>
      ),
      icon: "FaBuilding",
    },
    {
      title: "Total SQYD Team Sales",
      value: (
        <span
          style={{
            color:
              Number(dashboard.total_sqyd_team_sales) === 0 ||
              !dashboard.total_sqyd_team_sales
                ? "red"
                : "green",
          }}
        >
          {Number(dashboard.total_sqyd_team_sales) > 0
            ? Number(dashboard.total_sqyd_team_sales).toFixed(2)
            : "0.00"}
        </span>
      ),
      icon: "FaBuilding",
    },
    {
      title: "Total SQYD Channel Partner Sales",
      value: (
        <span
          style={{
            color:
              Number(dashboard.total_sqyd_channel_sales) === 0 ||
              !dashboard.total_sqyd_channel_sales
                ? "red"
                : "green",
          }}
        >
          {Number(dashboard.total_sqyd_channel_sales) > 0
            ? Number(dashboard.total_sqyd_channel_sales).toFixed(2)
            : "0.00"}
        </span>
      ),
      icon: "FaBuilding",
      href: "#",
    },
    {
      title: "Total Self Sales Earning",
      value: (
        <span
          style={{
            color:
              Number(dashboard.total_self_sales_earning) === 0 ||
              !dashboard.total_self_sales_earning
                ? "red"
                : "green",
          }}
        >
          {Number(dashboard.total_self_sales_earning) > 0
            ? Number(dashboard.total_self_sales_earning).toFixed(2)
            : "0.00"}
        </span>
      ),
      icon: "TbReceiptRupee",
      href: "#",
    },
    {
      title: "Total Team Sales Earning",
      value: (
        <span
          style={{
            color:
              Number(dashboard.total_team_sales_earning) === 0 ||
              !dashboard.total_team_sales_earning
                ? "red"
                : "green",
          }}
        >
          {Number(dashboard.total_team_sales_earning) > 0
            ? Number(dashboard.total_team_sales_earning).toFixed(2)
            : "0.00"}
        </span>
      ),
      icon: "TbReceiptRupee",
      href: "#",
    },
    {
      title: "Total Channel Partner Sales Earning",
      value: (
        <span
          style={{
            color:
              Number(dashboard.total_channel_sales_earning) === 0 ||
              !dashboard.total_channel_sales_earning
                ? "red"
                : "green",
          }}
        >
          {Number(dashboard.total_channel_sales_earning) > 0
            ? Number(dashboard.total_channel_sales_earning).toFixed(2)
            : "0.00"}
        </span>
      ),
      icon: "TbReceiptRupee",
      href: "#",
    },
    {
      title: "Total Loan Earning",
      value: (
        <span
          style={{
            color:
              Number(dashboard.total_loan_earning) === 0 ||
              !dashboard.total_loan_earning
                ? "red"
                : "green",
          }}
        >
          {Number(dashboard.total_loan_earning) > 0
            ? Number(dashboard.total_loan_earning).toFixed(2)
            : "0.00"}
        </span>
      ),
      icon: "TbReceiptRupee",
      href: "#",
    },
  ];

  // ✅ Filter by userType logic
  const dashboardData = rawData.filter((item) => {
    if (userType === "channel" && item.title === "Total Direct Associates Count") return false;
    if (userType === "associate" && (
        item.title === "Total Direct Channel Partners Count" ||
        item.title === "Total SQYD Channel Partner Sales"||
        item.title === "Total Channel Partner Sales Earning"
      )) return false;
    return true;
  });

  // ✅ Slider setup
  const videoRef = useRef(null);
  const [showSlider, setShowSlider] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderImages, setSliderImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imagePath, setImagePath] = useState(null);

  useEffect(() => {
    const fetchSliderImages = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/slider-list`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSliderImages(data.data || []);
        setImagePath(data.imagePath || "");
      } catch (err) {
        console.error("Error fetching slider images:", err);
        setError("Failed to load slider images. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSliderImages();
  }, []);

  return (
    <>
      <div id="Breadcrumb" className="">
        <Row>
          <Col lg={5}>
            <h4 className="page-title mb-0">Dashboard</h4>
          </Col>
          <Col lg={7}>
            <div className="d-none d-lg-block float-end">
              <ol className="breadcrumb m-0">
                <li className="breadcrumb-item">Home</li>
                <li className="breadcrumb-item active">Dashboard</li>
              </ol>
            </div>
          </Col>
        </Row>
      </div>

      {/* Slider Section */}
      <div className="slider-wrapper fade-in">
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : sliderImages.length > 0 ? (
          <>
            <img
              src={`${imageSlider}${sliderImages[currentSlide]?.image}`}
              alt={`Slide ${currentSlide + 1}`}
              className="slide-image"
            />
            <div className="controls">
              <div className="buttonalldesignnew">
                <button
                  className="left"
                  onClick={() =>
                    setCurrentSlide(
                      (prev) => (prev - 1 + sliderImages.length) % sliderImages.length
                    )
                  }
                >
                  <MdOutlineArrowBackIos />
                </button>
              </div>
              <div className="buttonalldesignnew">
                <button
                  className="right"
                  onClick={() =>
                    setCurrentSlide((prev) => (prev + 1) % sliderImages.length)
                  }
                >
                  <MdOutlineArrowForwardIos />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="no-images">No slider images available</div>
        )}
      </div>

      {/* Dashboard Cards */}
      <Row className="">
        {dashboardData.length > 0 ? (
          dashboardData.map((item, index) => {
            const IconComponent = iconMap[item.icon];
            return (
              <Col key={index} xs={12} sm={6} md={4} lg={4}>
                <div className="card bg_card_design">
                  <Link to={item.href} className="text-decoration-none">
                    <div className="card-body pr-0 gap-2 d-flex align-items-center justify-content-start">
                      {IconComponent && (
                        <div className="icon_dashboard">
                          <IconComponent size={40} className="text-white" />
                        </div>
                      )}
                      <div>
                        <div className="card-title">{item.title}</div>
                        <div className="card-text">{item.value}</div>
                      </div>
                    </div>
                  </Link>
                </div>
              </Col>
            );
          })
        ) : (
          <div className="text-center py-4">No dashboard data available</div>
        )}
      </Row>
    </>
  );
};

export default Dashboard;
