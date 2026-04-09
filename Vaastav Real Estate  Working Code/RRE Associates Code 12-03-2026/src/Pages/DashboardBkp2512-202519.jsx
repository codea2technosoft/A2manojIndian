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
  FaGift
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
import Endimage from '../assets/images/end.png'
import Start from '../assets/images/start.png'
import { TbReceiptRupee } from "react-icons/tb";
import { CiLineHeight } from "react-icons/ci";
import { BiSolidBuildingHouse } from "react-icons/bi";

const iconMap = {
  BiSolidBuildingHouse,
  CiLineHeight,
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
  FaGift,
};

const API_URL = process.env.REACT_APP_API_URL;

const imageSlider = `${process.env.REACT_APP_IMAGE_API_URL}/uploads/banner/`;

const Dashboard = ({ userType }) => {
  const [eligibilityData, setEligibilityData] = useState([]);
  const [teameligibilityData, setteamEligibilityData] = useState([]);
  const [TeamAchievedTeamArea, setAchievedTeamArea] = useState(0);

  // New states for Lifetime Rewards
  const [lifetimeRewardsList, setLifetimeRewardsList] = useState([]);
  const [lifetimeEligibilityData, setLifetimeEligibilityData] = useState([]);
  const [loadingLifetimeRewards, setLoadingLifetimeRewards] = useState(false);
  const [loadingLifetimeEligibility, setLoadingLifetimeEligibility] = useState(false);

  const NoDataMessage = ({ message = "Sorry, no data found" }) => (
    <div className="text-center py-4 text-muted">
      <div className="no-data-icon mb-2">
        <RiCloseCircleLine size={40} className="text-secondary" />
      </div>
      <p className="mb-0">{message}</p>
    </div>
  );

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const [lineData, setLineData] = useState({
    line1: { total_buysqft: 0, total_members: 0, line_name: "" },
    line2: { total_buysqft: 0, total_members: 0, line_name: "" },
    line3: { self_buysqft: 0, total_members: 0, line_name: "" },
    summary: { total_buysqft: 0, total_members: 0, total_lines: 0 }
  });

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
    total_achieved_buy_sqrt: 0,
  });

  const [giftList, setGiftList] = useState([]);
  const [giftTeamList, setGiftTeamList] = useState([]);
  const [loadingGifts, setLoadingGifts] = useState(false);
  const [loadingTeamGifts, setLoadingTeamGifts] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const token = localStorage.getItem("token");

    if (isLoggedIn !== "true" || !token) {
      navigate("/login");
    }
  }, [navigate]);

  const getAuthToken = () => localStorage.getItem("token");

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

          total_achieved_buy_sqrt: parseFloat(
            data.total_achieved_buy_sqrt?.[0]?.total || 0
          ),
        });
      } else {
        setDashboard({
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
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      setDashboard({
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
    }
  };

  // Fetch Lifetime Rewards List
  const fetchLifetimeRewardsList = async () => {
    try {
      setLoadingLifetimeRewards(true);
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/lifetime-rewards-list-associate`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("Lifetime Rewards List Response:", data);

      if (data.success === "1" && data.data && data.data.length > 0) {
        const sortedRewards = [...data.data].sort((a, b) =>
          parseFloat(a.area_sqyd) - parseFloat(b.area_sqyd)
        );
        setLifetimeRewardsList(sortedRewards);
      } else {
        setLifetimeRewardsList([]);
      }
    } catch (error) {
      console.error("Lifetime Rewards list fetch error:", error);
      setLifetimeRewardsList([]);
    } finally {
      setLoadingLifetimeRewards(false);
    }
  };

  // Fetch Lifetime Rewards Eligibility
  const fetchLifetimeRewardsEligibility = async () => {
    try {
      setLoadingLifetimeEligibility(true);
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/lifetime-rewards-list-associate-eligibility`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("Lifetime Rewards Eligibility Response:", data);

      if (data.success === "1" && data.data) {
        const eligibilityData = Array.isArray(data.data) ? data.data : [data.data];
        setLifetimeEligibilityData(eligibilityData);
      } else {
        setLifetimeEligibilityData([]);
      }
    } catch (error) {
      console.error("Lifetime Rewards eligibility fetch error:", error);
      setLifetimeEligibilityData([]);
    } finally {
      setLoadingLifetimeEligibility(false);
    }
  };

  const fetchGiftList = async () => {
    try {
      setLoadingGifts(true);
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/self-gift-list`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success === "1" && data.data && data.data.length > 0) {
        const sortedGifts = [...data.data].sort((a, b) =>
          parseFloat(a.area_sqyd) - parseFloat(b.area_sqyd)
        );
        setGiftList(sortedGifts);
      } else {
        setGiftList([]);
      }
    } catch (error) {
      console.error("Gift list fetch error:", error);
      setGiftList([]);
    } finally {
      setLoadingGifts(false);
    }
  };

  const fetchTeamGiftList = async () => {
    try {
      setLoadingTeamGifts(true);
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/team-gift-list`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("Fetched Team Gift List:", data);

      if (data.success === "1" && data.data && data.data.length > 0) {
        const sortedGifts = [...data.data].sort((a, b) =>
          parseFloat(a.area_sqyd) - parseFloat(b.area_sqyd)
        );
        setGiftTeamList(sortedGifts);
      } else {
        setGiftTeamList([]);
      }
    } catch (error) {
      console.error("Team gift list fetch error:", error);
      setGiftTeamList([]);
    } finally {
      setLoadingTeamGifts(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchGiftList();
    fetchTeamGiftList();
    fetchLifetimeRewardsList();
    fetchLifetimeRewardsEligibility();
    fetchmyteamLinesSummaryAssociate();
  }, []);

  const [lineSummary, setLineSummary] = useState({
    first_line: 0,
    second_line: 0,
    third_line: 0
  });

  const fetchmyteamLinesSummaryAssociate = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/myteam-lines-summary-associate`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("myteamLinesSummaryAssociate Response:", data);

      if (data.status === "1") {
        const newLineData = {
          line1: data.lines?.line1 || { total_buysqft: 0, total_members: 0, line_name: "Line 1" },
          line2: data.lines?.line2 || { total_buysqft: 0, total_members: 0, line_name: "Line 2" },
          line3: data.lines?.others || { self_buysqft: 0, total_members: 0, line_name: "Others" },
          summary: data.summary || { total_buysqft: 0, total_members: 0, total_lines: 0 }
        };

        setLineData(newLineData);

        setDashboard(prev => ({
          ...prev,
          first_line: newLineData.line1.total_members || 0,
          second_line: newLineData.line2.total_members || 0,
          third_line: newLineData.line3.total_members || 0
        }));

        setLineSummary({
          first_line: newLineData.line1.total_members || 0,
          second_line: newLineData.line2.total_members || 0,
          third_line: newLineData.line3.total_members || 0
        });

      } else {
        const defaultData = {
          line1: { total_buysqft: 0, total_members: 0, line_name: "Line 1" },
          line2: { total_buysqft: 0, total_members: 0, line_name: "Line 2" },
          line3: { self_buysqft: 0, total_members: 0, line_name: "Others" },
          summary: { total_buysqft: 0, total_members: 0, total_lines: 0 }
        };

        setLineData(defaultData);
        setLineSummary({
          first_line: 0,
          second_line: 0,
          third_line: 0
        });
        setDashboard(prev => ({
          ...prev,
          first_line: 0,
          second_line: 0,
          third_line: 0
        }));
      }
    } catch (error) {
      console.error("myteam-lines-summary-associate Error:", error);
      const defaultData = {
        line1: { total_buysqft: 0, total_members: 0, line_name: "Line 1" },
        line2: { total_buysqft: 0, total_members: 0, line_name: "Line 2" },
        line3: { self_buysqft: 0, total_members: 0, line_name: "Others" },
        summary: { total_buysqft: 0, total_members: 0, total_lines: 0 }
      };

      setLineData(defaultData);
      setLineSummary({
        first_line: 0,
        second_line: 0,
        third_line: 0
      });
      setDashboard(prev => ({
        ...prev,
        first_line: 0,
        second_line: 0,
        third_line: 0
      }));
    }
  };

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

    {
      title: "Total Achieved (Buy SQYD)",
      value: (
        <span
          style={{
            color:
              Number(dashboard.total_achieved_buy_sqrt) === 0 ||
              !dashboard.total_achieved_buy_sqrt
                ? "red"
                : "green",
          }}
        >
          {Number(dashboard.total_achieved_buy_sqrt) > 0
            ? Number(dashboard.total_achieved_buy_sqrt).toFixed(2)
            : "0.00"}
        </span>
      ),
      icon: "BiSolidBuildingHouse",
      href: "/total-achieved-buy-sqyd-details",

    },
    {
      title: "First Line (30)",
      value: (
        <span
          style={{
            color: lineData.line1.total_buysqft === 0 ? "red" : "green",
          }}
        >
          {Number(lineData.line1.total_buysqft).toFixed(2)} SQYD
        </span>
      ),
      icon: "CiLineHeight",
      href: "/first-line",
    },
    {
      title: `Second Line (30)`,
      value: (
        <span
          style={{
            color: lineData.line2.total_buysqft === 0 ? "red" : "green",
          }}
        >
          {Number(lineData.line2.total_buysqft).toFixed(2)} SQYD
        </span>
      ),
      icon: "CiLineHeight",
      href: "/second-line",
    },
    {
      title: "Third Line (40)",
      value: (
        <span
          style={{
            color: lineData.line3.self_buysqft === 0 ? "red" : "green",
          }}
        >
          {Number(lineData.line3.self_buysqft).toFixed(2)} SQYD
        </span>
      ),
      icon: "CiLineHeight",
      href: "/third-line",
    },
  ];

  const dashboardData = rawData.filter((item) => {
    if (userType === "channel" && item.title === "Total Direct Associates Count") return false;
    if (userType === "associate" && (
      item.title === "Total Direct Channel Partners Count" ||
      item.title === "Total SQYD Channel Partner Sales" ||
      item.title === "Total Channel Partner Sales Earning"
    )) return false;
    return true;
  });

  const token = localStorage.getItem("token");
  const showCustomMessageModal = (title, text) => {
    alert(`${title}: ${text}`);
  };

  const videoRef = useRef(null);
  const [showSlider, setShowSlider] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderImages, setSliderImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imagePath, setImagePath] = useState(null);

  const [achievedArea, setAchievedArea] = useState(0);

  const fetchSliderImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/slider-list`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.data && data.data.length > 0) {
        setSliderImages(data.data || []);
        setImagePath(data.imagePath || "");
      } else {
        setSliderImages([]);
        setError("No slider images available");
      }
    } catch (err) {
      console.error("Error fetching slider images:", err);
      setError("Failed to load slider images. Please try again later.");
      setSliderImages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSliderImages();
  }, []);

  const fetchEligibilityData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/assiciate-gift-eligibility`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();

      if (result.success) {
        const data = Array.isArray(result.data) ? result.data : [result.data];
        setEligibilityData(data);
        const area = data[0]?.achieved_area || 0;
        setAchievedArea(area);

        console.log("Achieved Area:", area);
      } else {
        showCustomMessageModal("Error", result.message || "Failed to fetch eligibility data.");
        setEligibilityData([]);
        setAchievedArea(0);
      }
    } catch (error) {
      showCustomMessageModal("Error", "Failed to fetch eligibility data.");
      setEligibilityData([]);
      setAchievedArea(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEligibilityData();
  }, []);

  const fetchTeamEligibilityData = async () => {
    try {
      const response = await fetch(`${API_URL}/assiciate-team-gift-eligibility`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();
      console.log("Team Eligibility API Response:", result.success);

      if (result.success == true) {
        const data = Array.isArray(result.data) ? result.data : [result.data];

        setteamEligibilityData(data);
        if (data && data.length > 0 && data[0]) {
          console.warn("total_team_sales:", data[0].total_team_sales);
          const area = data[0].total_team_sales || 0;
          setAchievedTeamArea(parseFloat(area) || 0);
          console.log("Team Achieved Area:", area);
        } else {
          console.warn("Data[0] not available");
          setAchievedTeamArea(0);
        }
      } else {
        showCustomMessageModal("Error", result.message || "Failed to fetch team eligibility data.");
        setteamEligibilityData([]);
        setAchievedTeamArea(0);
      }
    } catch (error) {
      console.error("Team eligibility fetch error:", error);
      showCustomMessageModal("Error", "Failed to fetch team eligibility data.");
      setteamEligibilityData([]);
      setAchievedTeamArea(0);
    }
  };

  useEffect(() => {
    fetchTeamEligibilityData();
  }, []);

  // Self Gift Progress Component
  const GiftProgressBar = () => {
    if (loadingGifts) {
      return (
        <div className="gift-progress-loading">
          <div className="gift-spinner" role="status">
            <span className="gift-spinner-text">Loading gifts...</span>
          </div>
          <p className="gift-loading-text">Loading gift progress...</p>
        </div>
      );
    }

    if (giftList.length === 0) {
      return <NoDataMessage message="Sorry, no gift data found" />;
    }

    const currentSqyd = parseFloat(achievedArea) || 0;
    const maxSqyd = parseFloat(giftList[giftList.length - 1]?.area_sqyd) || Math.max(...giftList.map(g => parseFloat(g.area_sqyd)));

    return (
      <div className="gift-progress-wrapper">
        <div className="gift-progress-header">
          <h5 className="gift-progress-title">
            <FaGift className="gift-title-icon" />
            Self Gift Progress
          </h5>
          {eligibilityData.length > 0 ? (
            eligibilityData.map((data, index) => (
              <div key={index} className="mt-2 w-50">
                <Row className="text-center">
                  <Col sm={6} className="mb-3">
                    <div>
                      <small className="text-muted d-block">Achieved Area</small>
                      <div className="fw-bold fs-5 text-success">
                        {data.achieved_area || "0"} SQYD
                      </div>
                      <span className="gift-current-badge d-block mt-1">
                        Current: {data.achieved_area || "0"} SQYD
                      </span>
                    </div>
                  </Col>
                </Row>
              </div>
            ))
          ) : (
            <NoDataMessage message="Sorry, no eligibility data found" />
          )}
        </div>

        <div className="gift-progress-container">
          <div className="gift-progress-track">
            <div className="gift-progress-line">
              <div className="gift-progress-fill"></div>
            </div>

            <div className="gift-steps-scroll-container">
              <div className="gift-steps-flex-container">
                <div className="gift-step-flex-item gift-step-blank">
                  <div className="gift-step-content-wrapper">
                    <div className="gift-step-marker gift-step-marker-blank">
                      <span>
                        <img src={Start} alt="Start" width="50" />
                      </span>
                    </div>
                    <div className="gift-step-content">
                      <div className="gift-step-name">Start Point</div>
                    </div>
                  </div>
                </div>
                {giftList.map((gift, index) => {
                  const giftSqyd = parseFloat(gift.area_sqyd);
                  const isCompleted = currentSqyd >= giftSqyd;
                  const isCurrent = currentSqyd < giftSqyd &&
                    (index === 0 || currentSqyd >= parseFloat(giftList[index - 1]?.area_sqyd));
                  const progressPercentage = (giftSqyd / maxSqyd) * 100;

                  return (
                    <div
                      key={gift.id || index}
                      className={`gift-step-flex-item ${isCompleted ? 'gift-step-completed' : ''} ${isCurrent ? 'gift-step-current' : ''}`}
                    >
                      <div className="gift-step-content-wrapper">
                        <div className="gift-step-marker">
                          {isCompleted ? '✓' : index + 1}
                        </div>
                        <div className="gift-step-content">
                          <div className="gift-step-name">{gift.offer_name || `Gift ${index + 1}`}</div>
                          <div className="gift-step-target">{gift.offer_item || `Gift ${index + 1}`}</div>
                          <div className="gift-step-target text-dark"><strong>{giftSqyd} </strong>SQYD</div>
                          {isCompleted && (
                            <div className="gift-step-achieved">
                              <small>Completed!</small>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div className="gift-step-flex-item gift-step-blank">
                  <div className="gift-step-content-wrapper">
                    <div className="gift-step-marker gift-step-marker-blank">
                      <span>
                        <img src={Endimage} alt="Endimage" width="50" />
                      </span>
                    </div>
                    <div className="gift-step-content">
                      <div className="gift-step-name">End Point</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {giftList.length > 0 ? (
          giftList.map((data, index) => (
            <div key={index} className="p-3">
              <Row>
                <Col sm={2} className="mb-2">
                  <div className="d-flex align-items-center">
                    <small className="text-muted d-block me-2">Start Date:</small>
                    <div className="fw-bold text-danger">
                      {data.date_from}
                    </div>
                  </div>
                </Col>

                <Col sm={2} className="mb-2">
                  <div className="d-flex align-items-center justify-content-center">
                    <small className="text-muted d-block me-2">End Date:</small>
                    <div className="fw-bold text-success">
                      {data.date_to}
                    </div>
                  </div>
                </Col>

                <Col sm={2} className="mb-2">
                  <div className="d-flex align-items-center">
                    <small className="text-muted d-block me-2">Payment Days:</small>
                    <div className="fw-bold text-danger">
                      {data.closing_days}
                    </div>
                  </div>
                </Col>

                <Col sm={2} className="mb-2">
                  <div className="d-flex align-items-center justify-content-center">
                    <small className="text-muted d-block me-2">Offer Project Name:</small>
                    <div className="fw-bold text-success">
                      {data.offer_project_name}
                    </div>
                  </div>
                </Col>

                <Col sm={2} className="mb-2">
                  <div className="d-flex align-items-center">
                    <small className="text-muted d-block me-2">Terms & Conditions:</small>
                    <div className="fw-bold text-danger">
                      {data.terms_conditions}
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          ))
        ) : (
          <NoDataMessage message="Sorry, no giftList date data found" />
        )}
      </div>
    );
  };

  // Team Gift Progress Component
  const TeamProgressBar = () => {
    if (loadingTeamGifts) {
      return (
        <div className="gift-progress-loading">
          <div className="gift-spinner" role="status">
            <span className="gift-spinner-text">Loading team gifts...</span>
          </div>
          <p className="gift-loading-text">Loading team gift progress...</p>
        </div>
      );
    }

    if (giftTeamList.length === 0) {
      return <NoDataMessage message="Sorry, no team gift data found" />;
    }

    const currentTeamSqyd = parseFloat(TeamAchievedTeamArea) || 0;
    const maxTeamSqyd = parseFloat(giftTeamList[giftTeamList.length - 1]?.area_sqyd) || Math.max(...giftTeamList.map(g => parseFloat(g.area_sqyd)));

    return (
      <div className="gift-progress-wrapper">
        <div className="gift-progress-header">
          <h5 className="gift-progress-title">
            <FaUsers className="gift-title-icon" />
            Team Gift Progress
          </h5>
          {teameligibilityData.length > 0 ? (
            <div className="mt-2 w-100">
              <Row className="text-center">
                <Col sm={6} className="mb-3">
                  <div>
                    <small className="text-muted d-block">Team Achieved Area</small>
                    <div className="fw-bold fs-5 text-success">
                      {currentTeamSqyd} SQYD
                    </div>
                    <span className="gift-current-badge d-block mt-1">
                      Current Progress
                    </span>
                  </div>
                </Col>
                <Col sm={6} className="mb-3">
                  <div>
                    <small className="text-muted d-block">Target Area</small>
                    <div className="fw-bold fs-5 text-primary">
                      {maxTeamSqyd} SQYD
                    </div>
                    <span className="gift-target-badge d-block mt-1">
                      Final Goal
                    </span>
                  </div>
                </Col>
              </Row>
            </div>
          ) : (
            <NoDataMessage message="Sorry, no team eligibility data found" />
          )}
        </div>

        <div className="gift-progress-container">
          <div className="gift-progress-track">
            <div className="gift-progress-line">
              <div
                className="gift-progress-fill"
                style={{
                  width: `${Math.min(100, (currentTeamSqyd / maxTeamSqyd) * 100)}%`
                }}
              ></div>
            </div>

            <div className="gift-steps-scroll-container">
              <div className="gift-steps-flex-container">
                <div className="gift-step-flex-item gift-step-blank">
                  <div className="gift-step-content-wrapper">
                    <div className="gift-step-marker gift-step-marker-blank">
                      <span>
                        <img src={Start} alt="Start" width="50" />
                      </span>
                    </div>
                    <div className="gift-step-content">
                      <div className="gift-step-name">Start Point</div>
                      <div className="gift-step-target">0 SQYD</div>
                    </div>
                  </div>
                </div>

                {giftTeamList.map((gift, index) => {
                  const giftSqyd = parseFloat(gift.area_sqyd);
                  const isCompleted = currentTeamSqyd >= giftSqyd;
                  const isCurrent = currentTeamSqyd < giftSqyd &&
                    (index === 0 || currentTeamSqyd >= parseFloat(giftTeamList[index - 1]?.area_sqyd));
                  const progressPercentage = Math.min(100, (currentTeamSqyd / giftSqyd) * 100);

                  return (
                    <div
                      key={gift.id || index}
                      className={`gift-step-flex-item ${isCompleted ? 'gift-step-completed' : ''} ${isCurrent ? 'gift-step-current' : ''}`}
                    >
                      <div className="gift-step-content-wrapper">
                        <div className={`gift-step-marker ${isCompleted ? 'gift-step-marker-completed' : ''} ${isCurrent ? 'gift-step-marker-current' : ''}`}>
                          {isCompleted ? (
                            <FaCheckCircle className="gift-check-icon" />
                          ) : (
                            index + 1
                          )}
                        </div>
                        <div className="gift-step-content">
                          <div className="gift-step-name">{gift.offer_name || `Team Gift ${index + 1}`}</div>
                          <div className="gift-step-target">{gift.offer_item || `Team Reward ${index + 1}`}</div>
                          <div className="gift-step-sqyd text-dark">
                            <strong>{giftSqyd} SQYD</strong>
                          </div>
                          {isCompleted && (
                            <div className="gift-step-achieved">
                              <small>✓ Completed</small>
                            </div>
                          )}
                          {isCurrent && (
                            <div className="gift-step-progress">
                              <div className="gift-step-progress-bar">
                                <div
                                  className="gift-step-progress-fill"
                                  style={{ width: `${progressPercentage}%` }}
                                ></div>
                              </div>
                              <small>{progressPercentage.toFixed(1)}%</small>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="gift-step-flex-item gift-step-blank">
                  <div className="gift-step-content-wrapper">
                    <div className="gift-step-marker gift-step-marker-blank">
                      <span>
                        <img src={Endimage} alt="End" width="50" />
                      </span>
                    </div>
                    <div className="gift-step-content">
                      <div className="gift-step-name">End Point</div>
                      <div className="gift-step-target">{maxTeamSqyd} SQYD</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {giftTeamList.length > 0 ? (
          giftTeamList.map((data, index) => (
            <div key={index} className="gift-dates-section p-3">
              <Row>
                <Col sm={2} className="mb-2">
                  <div className="d-flex align-items-center">
                    <small className="text-muted d-block me-2">Start Date:</small>
                    <div className="fw-bold text-danger">
                      {data.date_from}
                    </div>
                  </div>
                </Col>

                <Col sm={2} className="mb-2">
                  <div className="d-flex align-items-center justify-content-center">
                    <small className="text-muted d-block me-2">End Date:</small>
                    <div className="fw-bold text-success">
                      {data.date_to}
                    </div>
                  </div>
                </Col>

                <Col sm={2} className="mb-2">
                  <div className="d-flex align-items-center">
                    <small className="text-muted d-block me-2">Payment Days:</small>
                    <div className="fw-bold text-danger">
                      {data.closing_days}
                    </div>
                  </div>
                </Col>

                <Col sm={2} className="mb-2">
                  <div className="d-flex align-items-center justify-content-center">
                    <small className="text-muted d-block me-2">Offer Project Name:</small>
                    <div className="fw-bold text-success">
                      {data.offer_project_name}
                    </div>
                  </div>
                </Col>

                <Col sm={2} className="mb-2">
                  <div className="d-flex align-items-center">
                    <small className="text-muted d-block me-2">Terms & Conditions:</small>
                    <div className="fw-bold text-danger">
                      {data.terms_conditions}
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          ))
        ) : (
          <NoDataMessage message="Sorry, no team eligibility date data found" />
        )}
      </div>
    );
  };

  // Lifetime Rewards Progress Component
  const LifetimeRewardsProgressBar = () => {
    if (loadingLifetimeRewards || loadingLifetimeEligibility) {
      return (
        <div className="gift-progress-loading">
          <div className="gift-spinner" role="status">
            <span className="gift-spinner-text">Loading lifetime Rewards...</span>
          </div>
          <p className="gift-loading-text">Loading lifetime Rewards progress...</p>
        </div>
      );
    }

    if (lifetimeRewardsList.length === 0) {
      return <NoDataMessage message="Sorry, no lifetime Rewards data found" />;
    }

    // Get achieved area from eligibility data
    const currentSqyd = lifetimeEligibilityData.length > 0 
      ? parseFloat(lifetimeEligibilityData[0]?.achieved_area || 0) 
      : 0;
    
    const maxSqyd = parseFloat(lifetimeRewardsList[lifetimeRewardsList.length - 1]?.area_sqyd) || 
      Math.max(...lifetimeRewardsList.map(g => parseFloat(g.area_sqyd)));

    return (
      <div className="gift-progress-wrapper">
        <div className="gift-progress-header">
          <h5 className="gift-progress-title">
            <FaGift className="gift-title-icon" />
            Lifetime Rewards Progress
          </h5>
          
          {lifetimeEligibilityData.length > 0 ? (
            lifetimeEligibilityData.map((data, index) => (
              <div key={index} className="mt-2 w-50">
                <Row className="text-center">
                  <Col sm={6} className="mb-3">
                    <div>
                      <small className="text-muted d-block">Achieved Area</small>
                      <div className="fw-bold fs-5 text-success">
                        {data.achieved_area || "0"} SQYD
                      </div>
                      <span className="gift-current-badge d-block mt-1">
                        Current: {data.achieved_area || "0"} SQYD
                      </span>
                    </div>
                  </Col>
                </Row>
              </div>
            ))
          ) : (
            <NoDataMessage message="Sorry, no lifetime Rewards eligibility data found" />
          )}
        </div>

        <div className="gift-progress-container">
          <div className="gift-progress-track">
            <div className="gift-progress-line">
              <div className="gift-progress-fill"></div>
            </div>

            <div className="gift-steps-scroll-container">
              <div className="gift-steps-flex-container">
                <div className="gift-step-flex-item gift-step-blank">
                  <div className="gift-step-content-wrapper">
                    <div className="gift-step-marker gift-step-marker-blank">
                      <span>
                        <img src={Start} alt="Start" width="50" />
                      </span>
                    </div>
                    <div className="gift-step-content">
                      <div className="gift-step-name">Start Point</div>
                    </div>
                  </div>
                </div>
                
                {lifetimeRewardsList.map((reward, index) => {
                  const rewardSqyd = parseFloat(reward.area_sqyd);
                  const isCompleted = currentSqyd >= rewardSqyd;
                  const isCurrent = currentSqyd < rewardSqyd &&
                    (index === 0 || currentSqyd >= parseFloat(lifetimeRewardsList[index - 1]?.area_sqyd));
                  const progressPercentage = (rewardSqyd / maxSqyd) * 100;

                  return (
                    <div
                      key={reward.id || index}
                      className={`gift-step-flex-item ${isCompleted ? 'gift-step-completed' : ''} ${isCurrent ? 'gift-step-current' : ''}`}
                    >
                      <div className="gift-step-content-wrapper">
                        <div className="gift-step-marker">
                          {isCompleted ? '✓' : index + 1}
                        </div>
                        <div className="gift-step-content">
                          <div className="gift-step-name">{reward.offer_name || `Lifetime Reward ${index + 1}`}</div>
                          <div className="gift-step-target">{reward.offer_item || `Reward ${index + 1}`}</div>
                          <div className="gift-step-target text-dark">
                            <strong>{rewardSqyd} </strong>SQYD
                          </div>

                         <div className="gift-step-target">{reward.item_amount || `Item Amount ${index + 1}`}</div>

                         <div className="gift-step-target">{reward.terms_conditions || `T&C ${index + 1}`}</div>


                          {isCompleted && (
                            <div className="gift-step-achieved">
                              <small>Completed!</small>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                <div className="gift-step-flex-item gift-step-blank">
                  <div className="gift-step-content-wrapper">
                    <div className="gift-step-marker gift-step-marker-blank">
                      <span>
                        <img src={Endimage} alt="Endimage" width="50" />
                      </span>
                    </div>
                    <div className="gift-step-content">
                      <div className="gift-step-name">End Point</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* {lifetimeRewardsList.length > 0 ? (
          lifetimeRewardsList.map((data, index) => (
            <div key={index} className="p-3">
              <Row>
                <Col sm={2} className="mb-2">
                  <div className="d-flex align-items-center">
                    <small className="text-muted d-block me-2">Start Date:</small>
                    <div className="fw-bold text-danger">
                      {data.date_from || "-"}
                    </div>
                  </div>
                </Col>

                <Col sm={2} className="mb-2">
                  <div className="d-flex align-items-center justify-content-center">
                    <small className="text-muted d-block me-2">End Date:</small>
                    <div className="fw-bold text-success">
                      {data.date_to || "-"}
                    </div>
                  </div>
                </Col>

                <Col sm={2} className="mb-2">
                  <div className="d-flex align-items-center">
                    <small className="text-muted d-block me-2">Payment Days:</small>
                    <div className="fw-bold text-danger">
                      {data.closing_days || "-"}
                    </div>
                  </div>
                </Col>

                <Col sm={2} className="mb-2">
                  <div className="d-flex align-items-center justify-content-center">
                    <small className="text-muted d-block me-2">Offer Project Name:</small>
                    <div className="fw-bold text-success">
                      {data.offer_project_name || "-"}
                    </div>
                  </div>
                </Col>

                <Col sm={2} className="mb-2">
                  <div className="d-flex align-items-center">
                    <small className="text-muted d-block me-2">Terms & Conditions:</small>
                    <div className="fw-bold text-danger">
                      {data.terms_conditions || "-"}
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          ))
        ) : (
          <NoDataMessage message="Sorry, no lifetime rewards date data found" />
        )} */}
      </div>
    );
  };

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

      {/* 1. Slider Section */}
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
          <NoDataMessage message="Sorry, no slider images found" />
        )}
      </div>

      {/* 2. Dashboard Cards Section */}
      <Row className="mt-4">
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
          <NoDataMessage message="Sorry, no dashboard data found" />
        )}
      </Row>

      {/* 3. Self Gift Progress Section */}
      <div className="card mt-4">
        <div className="card-body shadow-none">
          <GiftProgressBar />
        </div>
      </div>

      {/* 4. Team Progress Section */}
      <div className="card mt-4">
        <div className="card-body shadow-none">
          <TeamProgressBar />
        </div>
      </div>

      {/* 5. Lifetime Rewards Progress Section */}
      <div className="card mt-4">
        <div className="card-body shadow-none">
          <LifetimeRewardsProgressBar />
        </div>
      </div>
    </>
  );
};

export default Dashboard;