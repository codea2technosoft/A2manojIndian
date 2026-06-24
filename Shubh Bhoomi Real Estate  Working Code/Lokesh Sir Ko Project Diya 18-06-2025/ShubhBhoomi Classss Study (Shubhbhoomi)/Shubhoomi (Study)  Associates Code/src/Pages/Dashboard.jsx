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
  FaGift,
} from "react-icons/fa";
import { MdSettings, MdAssignmentTurnedIn } from "react-icons/md";
import { PiListNumbersFill } from "react-icons/pi";
import { RiCloseCircleLine, RiHandCoinLine } from "react-icons/ri";
import { HiMiniCubeTransparent } from "react-icons/hi2";
import { GoProjectSymlink } from "react-icons/go";
import { SiPlotly } from "react-icons/si";
import { useNavigate } from "react-router-dom";
import { GrChannel } from "react-icons/gr";
import { Row, Col, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  MdOutlineArrowBackIos,
  MdOutlineArrowForwardIos,
} from "react-icons/md";
import Endimage from "../assets/images/end.png";
import Start from "../assets/images/start.png";
import { TbReceiptRupee } from "react-icons/tb";
import { CiLineHeight } from "react-icons/ci";
import { BiSolidBuildingHouse } from "react-icons/bi";
import runningHourse from "../assets/images/hourse.gif";
import welcomeImg from "../assets/images/bonus.webp";
import bimaActiveImg from "../assets/images/bima.png";
import bimaSuccessImg from "../assets/images/claimed.webp";
import moment from 'moment';

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
const legData = [
  { leg: "Leg 1", amount: 300, value: 100, status: "inactive" },
  { leg: "Leg 2", amount: 300, value: 150, status: "active" },
  { leg: "Leg 3", amount: 400, value: 200, status: "inactive" },
];
const Dashboard = ({ userType }) => {
  const [eligibilityData, setEligibilityData] = useState([]);
  const [teameligibilityData, setteamEligibilityData] = useState([]);
  const [TeamAchievedTeamArea, setAchievedTeamArea] = useState(0);
  const [lifetimeRewardsList, setLifetimeRewardsList] = useState([]);
  const [lifetimeEligibilityData, setLifetimeEligibilityData] = useState([]);
  const [loadingLifetimeRewards, setLoadingLifetimeRewards] = useState(false);
  const [royaltyRewardsList, setRoyaltyRewardsList] = useState([]);
  const [royaltyEligibilityData, setRoyaltyEligibilityData] = useState([]);
  const [loadingRoyaltyRewards, setLoadingRoyaltyRewards] = useState(false);
  const [loadingRoyaltyEligibility, setLoadingRoyaltyEligibility] = useState(false);

  const [associateData, setAssociateData] = useState({
    registrationDate: "2026-04-01", // Default date for testing
    name: "",
    mobile: "",
    designation: ""
  });

  const [loadingLifetimeEligibility, setLoadingLifetimeEligibility] =
    useState(false);
  const [designation, setDesignation] = useState("");
  useEffect(() => {
    const designationData = localStorage.getItem("designation");
    setDesignation(designationData || "");
  }, []);


  const fetchAssociateProfile = async () => {
    try {
      const token = getAuthToken();
      console.log("Fetching associate profile...");

      const response = await fetch(`${API_URL}/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.status === "1" && data.data) {
        const registrationDate = data.data.date || data.data.created_at || null;
        setAssociateData({
          registrationDate: registrationDate,
          name: data.data.username || "",
          mobile: data.data.mobile || "",
          designation: data.data.designation || ""
        });
      } else {
        setAssociateData({
          registrationDate: "2026-04-01",
          name: "",
          mobile: "",
          designation: ""
        });
      }
    } catch (error) {
      setAssociateData({
        registrationDate: "2026-04-01",
        name: "",
        mobile: "",
        designation: ""
      });
    }
  };


  const calculateDatesFromRegistration = (registrationDateStr) => {
    if (!registrationDateStr) {
      registrationDateStr = "2026-04-01";
    }
    const regDate = new Date(registrationDateStr);
    const joiningDate = new Date(regDate);
    // Booking date = Registration date + 30 days
    const bookingDate = new Date(regDate);
    bookingDate.setDate(regDate.getDate() + 30);
    // Closing date = Booking date + 30 days
    const closingDate = new Date(bookingDate);
    closingDate.setDate(bookingDate.getDate() + 30);
    return {
      joiningDate,
      bookingDate,
      closingDate
    };
  };
  const calculateDates = () => {
    if (!associateData.registrationDate) return { bookingDate: null, closingDate: null };
    const regDate = new Date(associateData.registrationDate);
    const bookingDate = new Date(regDate);
    bookingDate.setDate(regDate.getDate() + 30);
    const closingDate = new Date(bookingDate);
    closingDate.setDate(bookingDate.getDate() + 30);
    return { bookingDate, closingDate };
  };
  const formatShortDate = (date) => {
    if (!date) return "-";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${day}-${month}-${year}`;
  };

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
    summary: { total_buysqft: 0, total_members: 0, total_lines: 0 },
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
    total_propertyEarning: 0,
    bimaStatus: {
      activeStatus: false,
      successStatus: false
    }, bonus: {
      status: false,
      lastDate: "--",
      joiningDate: "--",
      leadDate: "--",
      targetDate: "--",
      approved: false
    }
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
      if (data.status === "1") {
        setDashboard({
          todayAssociate: data.todayAssociate?.[0]?.total || 0,
          todayChannel: data.todayChannel?.[0]?.total || 0,
          activeProject:
            data.ActiveProject?.[0]?.total ||
            data.activeProject?.[0]?.total ||
            0,
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
            data.total_self_sales_earning?.[0]?.total || 0,
          ),
          total_team_sales_earning: parseFloat(
            data.total_team_sales_earning?.[0]?.total || 0,
          ),
          total_channel_sales_earning: parseFloat(
            data.total_channel_sales_earning?.[0]?.total || 0,
          ),
          total_loan_earning: parseFloat(
            data.total_loan_earning?.[0]?.total || 0,
          ),

          total_achieved_buy_sqrt: parseFloat(
            data.total_achieved_buy_sqrt?.[0]?.total || 0,
          ),

          total_propertyEarning: parseFloat(
            data.total_propertyEarning?.[0]?.total || 0,
          ),
          bimaStatus: data.bimaStatus || { activeStatus: false, successStatus: false },
          bonus: {
            status: data.bonus?.status || false,
            joiningDate: data.bonus?.joiningDate || "--",
            lastDate: data.bonus?.lastDate || "--",
            leadDate: data.bonus?.leadDate || "--",
            targetDate: data.bonus?.targetDate || "--",
            approveDate: data.bonus?.approveDate || "--",
            approved: data.bonus?.approved || false
          }


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
          total_propertyEarning: 0,
          bimaStatus: { activeStatus: false, successStatus: false },
          bonus: {
            status: false,
            joiningDate: "--",
            lastDate: "--",
            leadDate: "--",
            targetDate: "--",
            approveDate: "--",
            approved: false
          }
        });
      }
    } catch (error) {
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
        total_propertyEarning: 0,
        bimaStatus: { activeStatus: false, successStatus: false },
        bonus: {
          status: false,
          joiningDate: "--",
          lastDate: "--",
          leadDate: "--",
          targetDate: "--",
          approveDate: "--",
          approved: false
        }
      });
    }
  };

  const fetchLifetimeRewardsList = async () => {
    try {
      setLoadingLifetimeRewards(true);
      const token = getAuthToken();
      const response = await fetch(
        `${API_URL}/lifetime-rewards-list-associate`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();
      if (data.success === "1" && data.data && data.data.length > 0) {
        const sortedRewards = [...data.data].sort(
          (a, b) => parseFloat(a.area_sqyd) - parseFloat(b.area_sqyd),
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

  const fetchLifetimeRewardsEligibility = async () => {
    try {
      setLoadingLifetimeEligibility(true);
      const token = getAuthToken();
      const response = await fetch(
        `${API_URL}/lifetime-rewards-list-associate-eligibility`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();



      if (data.status === "1" && Array.isArray(data.data)) {
        setLifetimeEligibilityData(data.data);
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

  const fetchRoyaltyRewardsList = async () => {
    try {
      setLoadingRoyaltyRewards(true);
      const token = getAuthToken();
      const response = await fetch(
        `${API_URL}/leadership-reward-list`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success === "1" && data.data && data.data.length > 0) {
        const sortedRewards = [...data.data].sort(
          (a, b) => parseFloat(a.area_sqyd) - parseFloat(b.area_sqyd)
        );
        setRoyaltyRewardsList(sortedRewards);
      } else {
        setRoyaltyRewardsList([]);
      }
    } catch (error) {
      setRoyaltyRewardsList([]);
    } finally {
      setLoadingRoyaltyRewards(false);
    }
  };

  // Replace this entire function
  const fetchRoyaltyRewardsEligibility = async () => {
    try {
      setLoadingRoyaltyEligibility(true);
      const token = getAuthToken();
      const response = await fetch(
        `${API_URL}/royalty-rewards-eligibility-associate`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      console.log("Royalty Eligibility API Response:", data);

      if (data.status === "1" && data.data && data.data.length > 0) {
        // Backend array response ko direct state mein mount kiya
        setRoyaltyEligibilityData(data.data);
      } else {
        setRoyaltyEligibilityData([]);
      }
    } catch (error) {
      console.error("Royalty eligibility error:", error);
      setRoyaltyEligibilityData([]);
    } finally {
      setLoadingRoyaltyEligibility(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchGiftList();
    fetchTeamGiftList();
    fetchLifetimeRewardsList();
    fetchLifetimeRewardsEligibility();
    fetchmyteamLinesSummaryAssociate();
    fetchAssociateProfile();
    fetchRoyaltyRewardsList();
    fetchRoyaltyRewardsEligibility();
  }, []);

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
        const sortedGifts = [...data.data].sort(
          (a, b) => parseFloat(a.area_sqyd) - parseFloat(b.area_sqyd),
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
      if (data.success === "1" && data.data && data.data.length > 0) {
        const sortedGifts = [...data.data].sort(
          (a, b) => parseFloat(a.area_sqyd) - parseFloat(b.area_sqyd),
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
    third_line: 0,
  });

  const fetchmyteamLinesSummaryAssociate = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(
        `${API_URL}/myteam-lines-summary-associate`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();
      console.log("myteamLinesSummaryAssociate Response:", data);

      if (data.status === 1) {
        const newLineData = {
          line1: {
            total_buysqft: parseFloat(data.lines?.line1?.total_buysqft) || 0,
            total_members: 1,
            line_name: data.lines?.line1?.line_name || "Line 1",
            line_id: data.lines?.line1?.line_id,
          },
          line2: {
            total_buysqft: parseFloat(data.lines?.line2?.total_buysqft) || 0,
            total_members: 1,
            line_name: data.lines?.line2?.line_name || "Line 2",
            line_id: data.lines?.line2?.line_id,
          },
          line3: {
            total_buysqft: parseFloat(data.lines?.others?.total_buysqft) || 0,
            self_buysqft: parseFloat(data.lines?.others?.self_buysqft) || 0,
            total_members: data.lines?.others?.lines_count || 0,
            line_name: "Others",
          },
          summary: {
            total_buysqft: parseFloat(data.summary?.total_team_area) || 0,
            total_members: (data.lines?.others?.lines_count || 0) + 2,
            total_lines: data.summary?.total_direct_lines || 0,
          },
        };

        setLineData(newLineData);
        setDashboard((prev) => ({
          ...prev,
          first_line: newLineData.line1.total_buysqft || 0,
          second_line: newLineData.line2.total_buysqft || 0,
          third_line: newLineData.line3.total_buysqft || 0,
        }));

        setLineSummary({
          first_line: newLineData.line1.total_buysqft || 0,
          second_line: newLineData.line2.total_buysqft || 0,
          third_line: newLineData.line3.total_buysqft || 0,
        });
      } else {
        const defaultData = {
          line1: { total_buysqft: 0, total_members: 0, line_name: "Line 1" },
          line2: { total_buysqft: 0, total_members: 0, line_name: "Line 2" },
          line3: {
            total_buysqft: 0,
            self_buysqft: 0,
            total_members: 0,
            line_name: "Others",
          },
          summary: { total_buysqft: 0, total_members: 0, total_lines: 0 },
        };
        setLineData(defaultData);
        setLineSummary({
          first_line: 0,
          second_line: 0,
          third_line: 0,
        });
        setDashboard((prev) => ({
          ...prev,
          first_line: 0,
          second_line: 0,
          third_line: 0,
        }));
      }
    } catch (error) {
      const defaultData = {
        line1: { total_buysqft: 0, total_members: 0, line_name: "Line 1" },
        line2: { total_buysqft: 0, total_members: 0, line_name: "Line 2" },
        line3: {
          total_buysqft: 0,
          self_buysqft: 0,
          total_members: 0,
          line_name: "Others",
        },
        summary: { total_buysqft: 0, total_members: 0, total_lines: 0 },
      };
      setLineData(defaultData);
      setLineSummary({
        first_line: 0,
        second_line: 0,
        third_line: 0,
      });
      setDashboard((prev) => ({
        ...prev,
        first_line: 0,
        second_line: 0,
        third_line: 0,
      }));
    }
  };

  const rawData = [
    {
      title: "Total Direct Associates",
      value: (
        <span
          style={{ color: dashboard.totalAssociate === 0 ? "red" : "green" }}
        >
          {dashboard.totalAssociate}
        </span>
      ),
      icon: "FaUserTie",
      href: "/my-associates",
    },
    // {
    //   title: "Total Direct Channel Partners",
    //   value: (
    //     <span style={{ color: dashboard.totalChannel === 0 ? "red" : "green" }}>
    //       {dashboard.totalChannel}
    //     </span>
    //   ),
    //   icon: "FaHandshake",
    //   href: "/all-channel-list",
    // },
    {
      title: "Projects",
      value: (
        <span
          style={{ color: dashboard.activeProject === 0 ? "red" : "green" }}
        >
          {dashboard.activeProject}
        </span>
      ),
      icon: "FaBuilding",
      href: "/all-project",
    },
    {
      title: "OnGoing Projects",
      value: (
        <span
          style={{ color: dashboard.ongoingProject === 0 ? "red" : "green" }}
        >
          {dashboard.ongoingProject}
        </span>
      ),
      icon: "FaTasks",
      href: "/all-project",
    },
    {
      title: "Completed Projects",
      value: (
        <span
          style={{ color: dashboard.completeProject === 0 ? "red" : "green" }}
        >
          {dashboard.completeProject}
        </span>
      ),
      icon: "FaCheckCircle",
      href: "/all-project",
    },
    {
      title: "Total 11 Level My Team ",
      value: (
        <span
          style={{ color: dashboard.totalTeamCount === 0 ? "red" : "green" }}
        >
          {dashboard.totalTeamCount}
        </span>
      ),
      icon: "FaUsersCog",
      href: "/my-team",
    },
    {
      title: "Total Property Leads ",
      value: (
        <span
          style={{ color: dashboard.total_property === 0 ? "red" : "green" }}
        >
          {dashboard.total_property}
        </span>
      ),
      icon: "FaBuilding",
      href: "/property-lead-list",
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

    // {
    //   title: "Total Sales Earning",
    //   value: (
    //     <span
    //       style={{
    //         color:
    //           Number(dashboard.total_self_sales_earning || 0) +
    //             Number(dashboard.total_team_sales_earning || 0) ===
    //           0
    //             ? "red"
    //             : "green",
    //       }}
    //     >
    //       {(
    //         Number(dashboard.total_self_sales_earning || 0) +
    //         Number(dashboard.total_team_sales_earning || 0)
    //       ).toFixed(2)}
    //     </span>
    //   ),
    //   icon: "TbReceiptRupee",
    //   href: "#",
    // },

    // {
    //   title: "Total Self Sales Earning",
    //   value: (
    //     <span
    //       style={{
    //         color:
    //           Number(dashboard.total_self_sales_earning) === 0 ||
    //           !dashboard.total_self_sales_earning
    //             ? "red"
    //             : "green",
    //       }}
    //     >
    //       {Number(dashboard.total_self_sales_earning) > 0
    //         ? Number(dashboard.total_self_sales_earning).toFixed(2)
    //         : "0.00"}
    //     </span>
    //   ),
    //   icon: "TbReceiptRupee",
    //   href: "#",
    // },
    // {
    //   title: "Total Team Sales Earning",
    //   value: (
    //     <span
    //       style={{
    //         color:
    //           Number(dashboard.total_team_sales_earning) === 0 ||
    //           !dashboard.total_team_sales_earning
    //             ? "red"
    //             : "green",
    //       }}
    //     >
    //       {Number(dashboard.total_team_sales_earning) > 0
    //         ? Number(dashboard.total_team_sales_earning).toFixed(2)
    //         : "0.00"}
    //     </span>
    //   ),
    //   icon: "TbReceiptRupee",
    //   href: "#",
    // },
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
    // {
    //   title: "Total Loan Earning",
    //   value: (
    //     <span
    //       style={{
    //         color:
    //           Number(dashboard.total_loan_earning) === 0 ||
    //             !dashboard.total_loan_earning
    //             ? "red"
    //             : "green",
    //       }}
    //     >
    //       {Number(dashboard.total_loan_earning) > 0
    //         ? Number(dashboard.total_loan_earning).toFixed(2)
    //         : "0.00"}
    //     </span>
    //   ),
    //   icon: "TbReceiptRupee",
    //   href: "#",
    // },

    // {
    //   title: "Total Achieved (SQYD)",
    //   value: (
    //     <span
    //       style={{
    //         color:
    //           Number(dashboard.total_achieved_buy_sqrt) === 0 ||
    //             !dashboard.total_achieved_buy_sqrt
    //             ? "red"
    //             : "green",
    //       }}
    //     >
    //       {Number(dashboard.total_achieved_buy_sqrt) > 0
    //         ? Number(dashboard.total_achieved_buy_sqrt).toFixed(2)
    //         : "0.00"}
    //     </span>
    //   ),
    //   icon: "BiSolidBuildingHouse",
    //   href: "/total-achieved-buy-sqyd-details",

    // },

    // {
    //   title: "Total Property Earning",
    //   value: (
    //     <span style={{ color: dashboard.total_propertyEarning === 0 ? "red" : "green" }}>
    //       {dashboard.total_propertyEarning}
    //     </span>
    //   ),
    //   icon: "FaCheckCircle",
    //   // href: "/all-project",
    // },

    {
      title: "First Line (30%)",
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
      title: `Second Line (30%)`,
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
      title: "Third Line (40%)",
      value: (
        <span
          style={{
            color: lineData.line3.total_buysqft === 0 ? "red" : "green",
          }}
        >
          {Number(lineData.line3.total_buysqft).toFixed(2)} SQYD
        </span>
      ),
      icon: "CiLineHeight",
      href: "/third-line",
    },
    {
      title: "Welcome Bonus",
      icon: "FaGift",
      customContent: true,
      href: "/associates-bima-achiever-lists",
    },


    {
      title: "Bima",
      icon: "TbReceiptRupee",
      customContent: true,
      href: "/associates-welcome-bonus-achiever-lists",
    },
  ];

  const dashboardData = rawData.filter((item) => {
    if (
      userType === "channel" &&
      item.title === "Total Direct Associates Count"
    )
      return false;
    if (
      userType === "associate" &&
      (item.title === "Total Direct Channel Partners Count" ||
        item.title === "Total SQYD Channel Partner Sales" ||
        item.title === "Total Channel Partner Sales Earning")
    )
      return false;
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
        showCustomMessageModal(
          "Error",
          result.message || "Failed to fetch eligibility data.",
        );
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

  // const fetchTeamEligibilityData = async () => {
  //   try {
  //     const response = await fetch(
  //       `${API_URL}/assiciate-team-gift-eligibility`,
  //       {
  //         method: "GET",
  //         headers: { Authorization: `Bearer ${token}` },
  //       },
  //     );

  //     const result = await response.json();
  //     console.log("Team Eligibility API Response:", result.success);

  //     if (result.success == true) {
  //       const data = Array.isArray(result.data) ? result.data : [result.data];

  //       setteamEligibilityData(data);
  //       if (data && data.length > 0 && data[0]) {
  //         console.warn("total_team_sales:", data[0].total_team_sales);
  //         const area = data[0].total_team_sales || 0;
  //         setAchievedTeamArea(parseFloat(area) || 0);
  //         console.log("Team Achieved Area:", area);
  //       } else {
  //         console.warn("Data[0] not available");
  //         setAchievedTeamArea(0);
  //       }
  //     } else {
  //       showCustomMessageModal(
  //         "Error",
  //         result.message || "Failed to fetch team eligibility data.",
  //       );
  //       setteamEligibilityData([]);
  //       setAchievedTeamArea(0);
  //     }
  //   } catch (error) {
  //     console.error("Team eligibility fetch error:", error);
  //     showCustomMessageModal("Error", "Failed to fetch team eligibility data.");
  //     setteamEligibilityData([]);
  //     setAchievedTeamArea(0);
  //   }
  // };


  const fetchTeamEligibilityData = async () => {
    try {
        const response = await fetch(
            `${API_URL}/assiciate-team-gift-eligibility`,
            {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            },
        );

        const result = await response.json();
        console.log("Team Eligibility API Response:", result);

        if (result.success == true) {
            // ✅ result.data is already the array of gifts
            const data = result.data || [];
            
            console.log("Team Eligibility Data:", data);
            
            setteamEligibilityData(data);
            
            if (data && data.length > 0 && data[0]) {
                const area = data[0].total_progress?.achieved || 0;
                setAchievedTeamArea(parseFloat(area) || 0);
                console.log("Team Achieved Area:", area);
            } else {
                setAchievedTeamArea(0);
            }
        } else {
            showCustomMessageModal(
                "Error",
                result.message || "Failed to fetch team eligibility data.",
            );
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


  // const GiftProgressBar = () => {
  //     if (loadingGifts) {
  //       return (
  //         <div className="gift-progress-loading">
  //           <div className="gift-spinner" role="status">
  //             <span className="gift-spinner-text">Loading gifts...</span>
  //           </div>
  //           <p className="gift-loading-text">Loading gift progress...</p>
  //         </div>
  //       );
  //     }


  //     const displayGiftList = giftList.length === 0 ? [
  //       { id: 1, offer_name: "Demo Gift 1", offer_item: "Gift Item", area_sqyd: 100, terms_conditions: "Sample terms", date_from: "-", date_to: "-", closing_days: "-", offer_project_name: "-" },
  //       { id: 2, offer_name: "Demo Gift 2", offer_item: "Gift Item", area_sqyd: 200, terms_conditions: "Sample terms", date_from: "-", date_to: "-", closing_days: "-", offer_project_name: "-" },
  //       { id: 3, offer_name: "Demo Gift 3", offer_item: "Gift Item", area_sqyd: 300, terms_conditions: "Sample terms", date_from: "-", date_to: "-", closing_days: "-", offer_project_name: "-" }
  //     ] : giftList;

  //     const displayEligibilityData = eligibilityData.length === 0 ? [{ achieved_area: "0", status: "Not Eligible" }] : eligibilityData;
  //     const currentSqyd = parseFloat(achievedArea) || 0;
  //     const maxSqyd = displayGiftList.length > 0 ? parseFloat(displayGiftList[displayGiftList.length - 1]?.area_sqyd) || 300 : 300;

  //     return (
  //       <div className="gift-progress-wrapper">
  //         <div className="gift-progress-header">
  //           <h5 className="gift-progress-title">
  //             <FaGift className="gift-title-icon" />
  //             Self Gift Progress
  //           </h5>
  //           <div className="mt-2 w-50">
  //             <Row>
  //               <Col sm={12} className="mb-3 text-end">
  //                 <div className="fs-5 d-block">Current</div>
  //                 <span className="text-success">
  //                   {displayEligibilityData[0]?.achieved_area || "0"} SQYD
  //                 </span>
  //               </Col>
  //             </Row>
  //           </div>
  //         </div>

  //         <div className="gift-progress-container">
  //           <div className="gift-progress-track">
  //             <div className="gift-progress-line">
  //               <div className="gift-progress-fill"></div>
  //             </div>

  //             <div className="gift-steps-scroll-container">
  //               <div className="gift-steps-flex-container">
  //                 <div className="gift-step-flex-item gift-step-blank">
  //                   <div className="gift-step-content-wrapper">
  //                     <div className="gift-step-marker gift-step-marker-blank">
  //                       <span>
  //                         <img src={Start} alt="Start" width="50" />
  //                       </span>
  //                     </div>
  //                     <div className="gift-step-content">
  //                       <div className="gift-step-name">Start Point</div>
  //                       <div className="gift-step-target">0 SQYD</div>
  //                     </div>
  //                   </div>
  //                 </div>

  //                 {displayGiftList.map((gift, index) => {
  //                   const giftSqyd = parseFloat(gift.area_sqyd || 0);
  //                   const isCompleted = currentSqyd >= giftSqyd;

  //                   return (
  //                     <div
  //                       key={gift.id || index}
  //                       className={`gift-step-flex-item ${isCompleted ? "gift-step-completed" : ""}`}
  //                     >
  //                       <div className="gift-step-content-wrapper">
  //                         <div className={`gift-step-marker ovel ${isCompleted ? "bg-success" : "bg-danger"}`}>
  //                           {isCompleted ? "Qualified" : "Unqualified"}
  //                         </div>
  //                         <div className="gift-step-content">
  //                           <div className="gift-step-name">{gift.offer_name || `Gift ${index + 1}`}</div>
  //                           <div className="gift-step-target">{gift.offer_item || `Gift Item ${index + 1}`}</div>
  //                           <div className="gift-step-target text-dark">
  //                             <strong>{giftSqyd}</strong> SQYD
  //                           </div>
  //                           <div className="gift-step-target gift_content">
  //                             {gift.terms_conditions || "Sample terms & conditions"}
  //                           </div>
  //                         </div>
  //                       </div>
  //                     </div>
  //                   );
  //                 })}

  //                 <div className="gift-step-flex-item gift-step-blank">
  //                   <div className="gift-step-content-wrapper">
  //                     <div className="gift-step-marker gift-step-marker-blank">
  //                       <span>
  //                         <img src={Endimage} alt="Endimage" width="50" />
  //                       </span>
  //                     </div>
  //                     <div className="gift-step-content">
  //                       <div className="gift-step-name">End Point</div>
  //                       <div className="gift-step-target">{maxSqyd} SQYD</div>
  //                     </div>
  //                   </div>
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //         </div>


  //         <Table bordered hover responsive className="mt-3">
  //           <thead className="table-light">
  //             <tr>
  //               <th>#</th>
  //               <th>Start Date</th>
  //               <th>End Date</th>
  //               <th>Payment Days</th>
  //               <th>Terms & Conditions</th>
  //               <th>Offer Project Name</th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //             {displayGiftList.map((data, index) => (
  //               <tr key={index}>
  //                 <td>{index + 1}</td>
  //                 <td className="text-danger">{data.date_from || "-"}</td>
  //                 <td className="text-success">{data.date_to || "-"}</td>
  //                 <td className="text-danger">{data?.closing_days || "N/A"}</td>
  //                 <td className="text-danger">{data.terms_conditions || "-"}</td>
  //                 <td className="text-success">
  //                   <div className="table-cell-remark">
  //                     {data.offer_project_name || "-"}
  //                   </div>
  //                 </td>
  //               </tr>
  //             ))}
  //           </tbody>
  //         </Table>
  //       </div>
  //     );
  // };



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


    const displayGiftList = giftList.length === 0 ? [
      { id: 1, offer_name: "Demo Gift 1", offer_item: "Gift Item", area_sqyd: 100, terms_conditions: "Sample terms", date_from: "-", date_to: "-", closing_days: "-", offer_project_name: "-" },
      { id: 2, offer_name: "Demo Gift 2", offer_item: "Gift Item", area_sqyd: 200, terms_conditions: "Sample terms", date_from: "-", date_to: "-", closing_days: "-", offer_project_name: "-" },
      { id: 3, offer_name: "Demo Gift 3", offer_item: "Gift Item", area_sqyd: 300, terms_conditions: "Sample terms", date_from: "-", date_to: "-", closing_days: "-", offer_project_name: "-" }
    ] : giftList;

    const displayEligibilityData = eligibilityData.length === 0 ? [{ achieved_area: "0", status: "Not Eligible" }] : eligibilityData;
    const currentSqyd = parseFloat(achievedArea) || 0;
    const eligibleProjects = eligibilityData
      .filter(item => item.status === "Eligible")
      .map(item => item.project_name?.trim().toLowerCase());
    const maxSqyd = displayGiftList.length > 0 ? parseFloat(displayGiftList[displayGiftList.length - 1]?.area_sqyd) || 300 : 300;

    return (
      <div className="gift-progress-wrapper">
        <div className="gift-progress-header">
          <h5 className="gift-progress-title">
            <FaGift className="gift-title-icon" />
            Self Gift Progress
          </h5>
          <div className="mt-2 w-50">
            <Row>
              <Col sm={12} className="mb-3 text-end">
                <div className="fs-5 d-block">Current</div>
                <span className="text-success">
                  {displayEligibilityData[0]?.achieved_area || "0"} SQYD
                </span>
              </Col>
            </Row>
          </div>
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
                      <div className="gift-step-target">0 SQYD</div>
                    </div>
                  </div>
                </div>

                {displayGiftList.map((gift, index) => {
                  const giftSqyd = parseFloat(gift.area_sqyd || 0);

                  const isCompleted = eligibleProjects.includes(
                    gift.offer_project_name?.trim().toLowerCase()
                  );


                  const eligibleGift = eligibilityData.find(
                    item =>
                      item.project_name?.trim().toLowerCase() ===
                      gift.offer_project_name?.trim().toLowerCase()
                  );

                  const qualifiedDate =
                    eligibleGift?.qualifying_lead_date || "";

                  return (
                    <div
                      key={gift.id || index}
                      className={`gift-step-flex-item ${isCompleted ? "gift-step-completed" : ""}`}
                    >
                      <div className="gift-step-content-wrapper">
                        <div className={`gift-step-marker ovel ${isCompleted ? "bg-success" : "bg-danger"}`}>
                          {isCompleted ? "Qualified" : "Unqualified"}
                        </div>
                        <div className="gift-step-content">
                          <div className="gift-step-name">{gift.offer_name || `Gift ${index + 1}`}</div>
                          <div className="gift-step-target">{gift.offer_item || `Gift Item ${index + 1}`}</div>
                          <div className="gift-step-target text-dark">
                            <strong>{giftSqyd}</strong> SQYD
                          </div>
                          <div className="gift-step-target gift_content">
                            {gift.terms_conditions || "Sample terms & conditions"}
                            {isCompleted && qualifiedDate && (
                              <div
                                className="gift-step-target"
                                style={{
                                  color: "#198754",
                                  fontWeight: "600",
                                  marginTop: "4px",
                                  fontSize: "12px"
                                }}
                              >
                                Reward Earned: {qualifiedDate}
                              </div>
                            )}
                          </div>
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
                      <div className="gift-step-target">{maxSqyd} SQYD</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


        <Table bordered hover responsive className="mt-3">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Payment Days</th>
              <th>Terms & Conditions</th>
              <th>Offer Project Name</th>
            </tr>
          </thead>
          <tbody>
            {displayGiftList.map((data, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td className="text-danger">{data.date_from || "-"}</td>
                <td className="text-success">{data.date_to || "-"}</td>
                <td className="text-danger">{data?.closing_days || "N/A"}</td>
                <td className="text-danger">{data.terms_conditions || "-"}</td>
                <td className="text-success">
                  <div className="table-cell-remark">
                    {data.offer_project_name || "-"}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  };


  // const TeamProgressBar = () => {
  //   if (loadingTeamGifts) {
  //     return (
  //       <div className="gift-progress-loading">
  //         <div className="gift-spinner" role="status">
  //           <span className="gift-spinner-text">Loading team gifts...</span>
  //         </div>
  //         <p className="gift-loading-text">Loading team gift progress...</p>
  //       </div>
  //     );
  //   }

  //   const displayGiftTeamList = giftTeamList.length === 0 ? [
  //     { id: 1, offer_name: "Team Demo Gift 1", offer_item: "Team Gift Item", area_sqyd: 500, terms_conditions: "Sample team terms", date_from: "-", date_to: "-", closing_days: "-", offer_project_name: "-" },
  //     { id: 2, offer_name: "Team Demo Gift 2", offer_item: "Team Gift Item", area_sqyd: 1000, terms_conditions: "Sample team terms", date_from: "-", date_to: "-", closing_days: "-", offer_project_name: "-" }
  //   ] : giftTeamList;

  //   const displayTeamEligibilityData = teameligibilityData.length === 0 ? [{ total_team_sales: "0" }] : teameligibilityData;
  //   const currentTeamSqyd = parseFloat(TeamAchievedTeamArea) || 0;
  //   const maxTeamSqyd = displayGiftTeamList.length > 0 ? parseFloat(displayGiftTeamList[displayGiftTeamList.length - 1]?.area_sqyd) || 1000 : 1000;

  //   return (
  //     <div className="gift-progress-wrapper">
  //       <div className="gift-progress-header">
  //         <h5 className="gift-progress-title">
  //           <FaUsers className="gift-title-icon" />
  //           Team Gift Progress
  //         </h5>
  //         <div className="mt-2 w-50">
  //           <Row className="text-end">
  //             <Col sm={12} className="mb-3">
  //               <div>
  //                 <div className="fs-5">Current</div>
  //                 <small className="text-success d-block">
  //                   {currentTeamSqyd} SQYD
  //                 </small>
  //               </div>
  //             </Col>
  //           </Row>
  //         </div>
  //       </div>

  //       <div className="gift-progress-container">
  //         <div className="gift-progress-track">
  //           <div className="gift-progress-line">
  //             <div className="gift-progress-fill"></div>
  //           </div>

  //           <div className="gift-steps-scroll-container">
  //             <div className="gift-steps-flex-container">
  //               <div className="gift-step-flex-item gift-step-blank">
  //                 <div className="gift-step-content-wrapper">
  //                   <div className="gift-step-marker gift-step-marker-blank">
  //                     <span>
  //                       <img src={Start} alt="Start" width="50" />
  //                     </span>
  //                   </div>
  //                   <div className="gift-step-content">
  //                     <div className="gift-step-name">Start Point</div>
  //                     <div className="gift-step-target">0 SQYD</div>
  //                   </div>
  //                 </div>
  //               </div>

  //               {displayGiftTeamList.map((gift, index) => {
  //                 const giftSqyd = parseFloat(gift.area_sqyd);
  //                 const isCompleted = currentTeamSqyd >= giftSqyd;

  //                 return (
  //                   <div
  //                     key={gift.id || index}
  //                     className={`gift-step-flex-item ${isCompleted ? "gift-step-completed" : ""}`}
  //                   >
  //                     <div className="gift-step-content-wrapper">
  //                       <div className={`gift-step-marker ovel ${isCompleted ? "bg-success" : "bg-danger"}`}>
  //                         {isCompleted ? "Qualified" : "Unqualified"}
  //                       </div>
  //                       <div className="gift-step-content">
  //                         <div className="gift-step-name">{gift.offer_name || `Team Gift ${index + 1}`}</div>
  //                         <div className="gift-step-target">{gift.offer_item || `Team Gift Item ${index + 1}`}</div>
  //                         <div className="gift-step-sqyd text-dark">
  //                           <strong>{giftSqyd} SQYD</strong>
  //                         </div>
  //                         <div className="gift-step-target gift_content">
  //                           {gift.terms_conditions || "Sample team terms & conditions"}
  //                         </div>
  //                       </div>
  //                     </div>
  //                   </div>
  //                 );
  //               })}

  //               <div className="gift-step-flex-item gift-step-blank">
  //                 <div className="gift-step-content-wrapper">
  //                   <div className="gift-step-marker gift-step-marker-blank">
  //                     <span>
  //                       <img src={Endimage} alt="End" width="50" />
  //                     </span>
  //                   </div>
  //                   <div className="gift-step-content">
  //                     <div className="gift-step-name">End Point</div>
  //                     <div className="gift-step-target">{maxTeamSqyd} SQYD</div>
  //                   </div>
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>

  //       <Table bordered hover responsive className="mt-3">
  //         <thead className="table-light">
  //           <tr>
  //             <th>#</th>
  //             <th>Start Date</th>
  //             <th>End Date</th>
  //             <th>Payment Days</th>
  //             <th>Terms & Conditions</th>
  //             <th>Offer Project Name</th>
  //           </tr>
  //         </thead>
  //         <tbody>
  //           {displayGiftTeamList.map((data, index) => (
  //             <tr key={index}>
  //               <td>{index + 1}</td>
  //               <td className="text-danger">{data.date_from || "-"}</td>
  //               <td className="text-success">{data.date_to || "-"}</td>
  //               <td className="text-danger">{data?.closing_days || "N/A"}</td>
  //               <td className="text-danger">{data.terms_conditions || "-"}</td>
  //               <td className="text-success">
  //                 <div className="table-cell-remark">
  //                   {data.offer_project_name || "-"}
  //                 </div>
  //               </td>
  //             </tr>
  //           ))}
  //         </tbody>
  //       </Table>
  //     </div>
  //   );
  // };


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

    // ✅ Directly use teameligibilityData (it's already an array)
    const teamGiftData = Array.isArray(teameligibilityData) ? teameligibilityData : [];
    
    console.log("Team Gift Data:", teamGiftData);
    
    // For backward compatibility
    const displayGiftTeamList = teamGiftData.length > 0 ? teamGiftData : giftTeamList;
    
    let currentTeamSqyd = 0;
    if (teamGiftData.length > 0) {
        currentTeamSqyd = Math.max(...teamGiftData.map(item => item.total_progress?.achieved || 0));
    } else {
        currentTeamSqyd = parseFloat(TeamAchievedTeamArea) || 0;
    }

    const maxTeamSqyd = displayGiftTeamList.length > 0
        ? parseFloat(displayGiftTeamList[displayGiftTeamList.length - 1]?.required_area ||
            displayGiftTeamList[displayGiftTeamList.length - 1]?.area_sqyd || 1000)
        : 1000;

    const formatDate = (dateString) => {
        if (!dateString || dateString === "-" || dateString === null) return "-";
        try {
            return moment(dateString).format("DD-MM-YYYY");
        } catch (error) {
            return "-";
        }
    };

    if (teamGiftData.length === 0 && giftTeamList.length === 0) {
        return (
            <div className="gift-progress-wrapper">
                <div className="gift-progress-header">
                    <h5 className="gift-progress-title">
                        <FaUsers className="gift-title-icon" />
                        Team Gift Progress
                    </h5>
                </div>
                <div className="text-center p-4">
                    <p>No team gifts available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="gift-progress-wrapper">
            <div className="gift-progress-header">
                <h5 className="gift-progress-title">
                    <FaUsers className="gift-title-icon" />
                    Team Gift Progress
                </h5>

                <div className="mt-2 w-50">
                    <Row>
                        <Col sm={12} className="mb-3 text-end">
                            <div className="fs-5 d-block">Current</div>
                            <span className="text-success">
                                {Number(currentTeamSqyd).toFixed(2)} SQYD
                            </span>
                        </Col>
                    </Row>
                </div>
            </div>

            <div className="gift-progress-container">
                <div className="gift-progress-track">
                    <div className="gift-progress-line">
                        <div className="gift-progress-fill"></div>
                    </div>

                    <div className="gift-steps-scroll-container">
                        <div className="gift-steps-flex-container">

                            {/* Start Point */}
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

                            {/* Gift Items */}
                            {displayGiftTeamList.map((gift, index) => {
                                const isEligible = gift.achieved === true;
                                const targetArea = gift.required_area || parseFloat(gift.area_sqyd) || 0;
                                const legs = gift.legs_progress || {};

                                const leg1 = legs.leg1 || {};
                                const leg2 = legs.leg2 || {};

                                return (
                                    <div
                                        key={gift.reward_id || gift.id || index}
                                        className={`gift-step-flex-item ${isEligible ? "gift-step-completed" : ""}`}
                                    >
                                        <div className="gift-step-content-wrapper">

                                            {/* Leg Progress Display */}
                                            <div className="gift-step-target gift_content mb-2">
                                                <ul
                                                    className="leg_content"
                                                    style={{
                                                        listStyle: "none",
                                                        paddingLeft: 0,
                                                        marginBottom: 0,
                                                    }}
                                                >
                                                    {/* Leg 1 - 40% */}
                                                    <li style={{ marginBottom: "5px" }}>
                                                        <span className="text_leg" style={{ fontWeight: "500" }}>
                                                            Leg 1:
                                                        </span>
                                                        {(leg1.required || 0).toFixed(2)}
                                                        {" / "}
                                                        <strong>{(leg1.achieved || 0).toFixed(2)}</strong>
                                                        <span
                                                            style={{
                                                                marginLeft: "10px",
                                                                color: (leg1.achieved || 0) >= (leg1.required || 0) ? "green" : "red",
                                                                fontWeight: "bold",
                                                            }}
                                                        >
                                                            ({((leg1.required || 0) - (leg1.achieved || 0)).toFixed(2)} left)
                                                        </span>
                                                    </li>

                                                    {/* Leg 2 - 60% (Self + Other Legs) */}
                                                    <li>
                                                        <span className="text_leg" style={{ fontWeight: "500" }}>
                                                            Leg 2:
                                                        </span>
                                                        {(leg2.required || 0).toFixed(2)}
                                                        {" / "}
                                                        <strong>{(leg2.achieved || 0).toFixed(2)}</strong>
                                                        <span
                                                            style={{
                                                                marginLeft: "10px",
                                                                color: (leg2.achieved || 0) >= (leg2.required || 0) ? "green" : "red",
                                                                fontWeight: "bold",
                                                            }}
                                                        >
                                                            ({((leg2.required || 0) - (leg2.achieved || 0)).toFixed(2)} left)
                                                        </span>
                                                        {leg2.breakdown?.self_area > 0 && (
                                                            <span style={{ marginLeft: "10px", fontSize: "11px", color: "#666" }}>
                                                                (Self: {leg2.breakdown.self_area.toFixed(2)})
                                                            </span>
                                                        )}
                                                    </li>
                                                </ul>
                                            </div>

                                            {/* STATUS Badge */}
                                            <div
                                                className={`gift-step-marker ovel ${isEligible ? "bg-success" : "bg-danger"}`}
                                                style={{
                                                    display: "inline-block",
                                                    padding: "5px 12px",
                                                    borderRadius: "20px",
                                                    fontSize: "12px",
                                                    fontWeight: "bold",
                                                    color: "white",
                                                    marginBottom: "10px",
                                                }}
                                            >
                                                {isEligible ? "✓ Eligible" : "✗ Not Eligible"}
                                            </div>

                                            {/* CONTENT */}
                                            <div className="gift-step-content">
                                                <div className="gift-step-name" style={{ fontSize: "16px", fontWeight: "bold" }}>
                                                    {gift.reward_type || gift.offer_name}
                                                </div>

                                                <div className="gift-step-target" style={{ color: "#666", marginBottom: "5px" }}>
                                                    {gift.reward_details?.offer_item || gift.offer_item}
                                                </div>

                                                <div className="gift-step-target text-dark">
                                                    <strong>Required: {targetArea} SQYD</strong>
                                                    <br />
                                                    Current: {gift.total_progress?.achieved?.toFixed(2) || currentTeamSqyd.toFixed(2)} SQYD
                                                    <br />
                                                    Progress: {gift.total_progress?.percentage || 0}%
                                                </div>

                                                <div className="gift-step-target text-primary" style={{ fontWeight: "bold", marginTop: "5px" }}>
                                                    {gift.reward_details?.item_amount !== "Gift Item" 
                                                        ? `₹${Number(gift.reward_details?.item_amount || 0).toLocaleString()}`
                                                        : "Gift Item"}
                                                </div>

                                                <div className="gift-step-target gift_content" style={{ fontSize: "11px", color: "#666", marginTop: "8px" }}>
                                                    {gift.reward_details?.terms_conditions || gift.terms_conditions}
                                                </div>

                                                {gift.reward_details?.closing_days && (
                                                    <div className="gift-step-target text-muted small" style={{ fontSize: "10px", marginTop: "5px" }}>
                                                        Closing Days: {gift.reward_details.closing_days} days
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* End Point */}
                            <div className="gift-step-flex-item gift-step-blank">
                                <div className="gift-step-content-wrapper">
                                    <div className="gift-step-marker gift-step-marker-blank">
                                        <span>
                                            <img src={Endimage} alt="Endimage" width="50" />
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

            {/* Rewards Table */}
            <Table bordered hover responsive className="mt-3">
                <thead className="table-light">
                    <tr>
                        <th>#</th>
                        <th>Reward</th>
                        <th>Required SQYD</th>
                        <th>Achieved SQYD</th>
                        <th>Status</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {displayGiftTeamList.map((item, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.reward_name || item.offer_name}</td>
                            <td>{item.required_area || item.area_sqyd}</td>
                            <td>{item.total_progress?.achieved?.toFixed(2) || currentTeamSqyd.toFixed(2)}</td>
                            <td>
                                {item.achieved ? (
                                    <span className="text-success">Qualified</span>
                                ) : (
                                    <span className="text-danger">Not Qualified</span>
                                )}
                            </td>
                            <td>
                                {item.reward_details?.item_amount !== "Gift Item" 
                                    ? `₹${Number(item.reward_details?.item_amount || 0).toLocaleString()}`
                                    : "Gift Item"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Gift Details Table */}
            <Table bordered hover responsive className="mt-3">
                <thead className="table-light">
                    <tr>
                        <th>#</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Closing Days</th>
                        <th>Terms & Conditions</th>
                        <th>Offer Project Name</th>
                    </tr>
                </thead>
                <tbody>
                    {displayGiftTeamList.map((data, index) => {
                        const rewardDetails = data.reward_details || {};
                        
                        return (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td className="text-danger">
                                    {rewardDetails.date_from ? formatDate(rewardDetails.date_from) : "-"}
                                </td>
                                <td className="text-success">
                                    {rewardDetails.date_to ? formatDate(rewardDetails.date_to) : "-"}
                                </td>
                                <td className="text-danger">{rewardDetails.closing_days || "N/A"}</td>
                                <td className="text-danger">{rewardDetails.terms_conditions || "-"}</td>
                                <td className="text-success">
                                    <div className="table-cell-remark">
                                        {rewardDetails.applicable_projects || "-"}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        </div>
    );
};


  const LifetimeRewardsProgressBar = () => {
    if (loadingLifetimeEligibility) {
      return (
        <div className="gift-progress-loading">
          <div className="gift-spinner" role="status">
            <span className="gift-spinner-text">
              Loading lifetime Rewards...
            </span>
          </div>
          <p className="gift-loading-text">
            Loading lifetime Rewards progress...
          </p>
        </div>
      );
    }

    const displayLifetimeRewardsList = lifetimeEligibilityData || [];

    const currentSqyd = displayLifetimeRewardsList.reduce(
      (max, item) => Math.max(max, item.total_progress?.achieved || 0),
      0
    );

    const maxSqyd = displayLifetimeRewardsList.length > 0
      ? Math.max(...displayLifetimeRewardsList.map(item => item.total_progress?.required || 0))
      : 0;

    return (
      <div className="gift-progress-wrapper">
        <div className="gift-progress-header">
          <h5 className="gift-progress-title">
            <FaGift className="gift-title-icon" />
            Lifetime Rewards Progress
          </h5>

          <div className="mt-2 w-50">
            <Row>
              <Col sm={12} className="mb-3 text-end">
                <div className="fs-5 d-block">Current</div>
                <span className="text-success">
                  {Number(currentSqyd).toFixed(2)} SQYD
                </span>
              </Col>
            </Row>
          </div>
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
                      <div className="gift-step-target">0 SQYD</div>
                    </div>
                  </div>
                </div>

                {displayLifetimeRewardsList.map((reward, index) => {
                  const isEligible = reward.achieved === true;
                  const targetArea = reward.total_progress?.required || 0;
                  const legs = reward.legs_progress || {};

                  const formattedLegs = [
                    { name: "Leg 1", ...legs.leg1 },
                    { name: "Leg 2", ...legs.leg2 },
                    { name: "Leg 3", ...legs.self_and_other_legs },
                  ];

                  return (
                    <div
                      key={reward.reward_name || index}
                      className={`gift-step-flex-item ${isEligible ? "gift-step-completed" : ""}`}
                    >
                      <div className="gift-step-content-wrapper">

                        <div className="gift-step-target gift_content mb-2">
                          <ul
                            className="leg_content"
                            style={{
                              listStyle: "none",
                              paddingLeft: 0,
                            }}
                          >
                            {formattedLegs.map((legItem, idx) => {
                              // Skip if legItem is undefined
                              if (!legItem) return null;

                              const required = legItem.required || 0;
                              const achieved = legItem.achieved || 0;
                              const remaining = legItem.remaining || 0;
                              const legActive = achieved >= required;

                              return (
                                <li key={idx}>
                                  <span className="text_leg">
                                    {legItem.name}:
                                  </span>

                                  {/* ✅ Show exact value with 2 decimals - NO ROUNDING */}
                                  {required.toFixed(2)}

                                  {" / "}

                                  <strong>
                                    {achieved.toFixed(2)}
                                  </strong>

                                  <span
                                    style={{
                                      marginLeft: "10px",
                                      color: legActive ? "green" : "red",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    (
                                    {legActive
                                      ? "Target Met"
                                      : `${remaining.toFixed(2)} left`}
                                    )
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>

                        {/* STATUS */}
                        <div
                          className={`gift-step-marker ovel ${isEligible ? "bg-success" : "bg-danger"}`}
                        >
                          {isEligible ? "✓ Eligible" : "✗ Not Eligible"}
                        </div>

                        {/* CONTENT */}
                        <div className="gift-step-content">
                          <div className="gift-step-name">
                            {reward.reward_name}
                          </div>

                          <div className="gift-step-target">
                            {reward.reward_details?.offer_item}
                          </div>

                          <div className="gift-step-target text-dark">
                            <strong>
                              Required: {targetArea} SQYD
                            </strong>
                            <br />
                            Current: {reward.total_progress?.achieved} SQYD
                          </div>

                          <div className="gift-step-target text-primary">
                            ₹{Number(reward.reward_details?.item_amount || 0).toLocaleString()}
                          </div>

                          <div className="gift-step-target gift_content">
                            {reward.reward_details?.terms_conditions}
                          </div>
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
                      <div className="gift-step-target">{maxSqyd} SQYD</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        <Table bordered hover responsive className="mt-3">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Reward</th>
              <th>Required SQYD</th>
              <th>Achieved SQYD</th>
              <th>Status</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {displayLifetimeRewardsList.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.reward_name}</td>
                <td>{item.total_progress?.required}</td>
                <td>{item.total_progress?.achieved}</td>
                <td>
                  {item.achieved ? (
                    <span className="text-success">Qualified</span>
                  ) : (
                    <span className="text-danger">Not Qualified</span>
                  )}
                </td>
                <td>
                  ₹{Number(item.reward_details?.item_amount || 0).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  };


  const RoyaltyRewardsProgressBar = () => {
    if (loadingRoyaltyRewards || loadingRoyaltyEligibility) {
      return (
        <div className="gift-progress-loading">
          <div className="gift-spinner" role="status">
            <span className="gift-spinner-text">Loading Royalty Rewards...</span>
          </div>
          <p className="gift-loading-text">Loading Royalty Rewards progress...</p>
        </div>
      );
    }

    // Fallback checking framework data
    const displayList = royaltyEligibilityData.length > 0 ? royaltyEligibilityData : royaltyRewardsList;

    if (displayList.length === 0) {
      return <NoDataMessage message="Sorry, no royalty rewards data found" />;
    }

    // Backend Response data array ke metrics ko extract kiya
    // Total Achieved Area calculate karne ke liye hum check karte hain ki kis boundary range tak user pahuncha hai
    let maxAchievedArea = 0;
    if (royaltyEligibilityData.length > 0) {
      maxAchievedArea = royaltyEligibilityData.reduce((max, item) => {
        const currentTotal = parseFloat(item.total_progress?.achieved || 0);
        return currentTotal > max ? currentTotal : max;
      }, 0);
    }

    return (
      <div className="gift-progress-wrapper">
        <div className="gift-progress-header">
          <h5 className="gift-progress-title">
            <FaGift className="gift-title-icon" />
            Royalty Rewards Progress
          </h5>
          <div className="mt-2 w-50">
            <Row>
              <Col sm={12} className="mb-3 text-end">
                <div className="fs-5 d-block">Your Total Achieved Area</div>
                <span className="text-success fw-bold fs-4">
                  {maxAchievedArea.toFixed(2)} SQYD
                </span>
              </Col>
            </Row>
          </div>
        </div>

        <div className="gift-progress-container">
          <div className="gift-progress-track">
            <div className="gift-progress-line">
              <div className="gift-progress-fill"></div>
            </div>

            <div className="gift-steps-scroll-container">
              <div className="gift-steps-flex-container">
                {/* START STEP */}
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

                {/* DYNAMIC MAP RENDER ITERATION */}
                {displayList.map((reward, index) => {
                  const isEligible = reward.achieved === true;
                  const targetArea = reward.total_progress?.required || 0;
                  const legs = reward.legs_progress || {};

                  // Dynamic Legs structure map translation layer
                  const formattedLegs = [
                    { name: "Leg 1", ...legs.leg1 },
                    { name: "Leg 2", ...legs.leg2 },
                    { name: "Leg 3", ...legs.leg3 },
                  ];

                  return (
                    <div
                      key={reward.reward_type || index}
                      className={`gift-step-flex-item ${isEligible ? "gift-step-completed" : ""}`}
                    >
                      <div className="gift-step-content-wrapper">
                        {/* Dynamic Real-Time Legs UI Block */}
                        <div className="gift-step-target gift_content mb-2">
                          <ul className="leg_content" style={{ listStyle: 'none', paddingLeft: 0 }}>
                            {formattedLegs.map((legItem, idx) => {
                              const legActive = (legItem.achieved >= legItem.required) && legItem.required > 0;
                              return (
                                <li key={idx} className="mb-1">
                                  <span className="text_leg">{legItem.name}: </span>
                                  <strong>{legItem.required || 0}</strong> / {legItem.achieved || 0}
                                  <span
                                    className={`status ${legActive ? "active" : "inactive"}`}
                                    style={{
                                      marginLeft: "10px",
                                      color: legActive ? "green" : "red",
                                      fontWeight: "bold",
                                      fontSize: "0.85em"
                                    }}
                                  >
                                    ({legActive ? "Target Met" : `${legItem.remaining || 0} left`})
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>

                        {/* Status Check Badge */}
                        <div className={`gift-step-marker ovel ${isEligible ? "bg-success" : "bg-danger"}`} style={{ color: '#fff', padding: '4px 8px', borderRadius: '4px', textAlign: 'center' }}>
                          {isEligible ? "✓ Eligible" : "✗ Not Eligible"}
                        </div>

                        <div className="gift-step-content mt-2">
                          <div className="gift-step-name fw-bold">
                            {reward.reward_name || "Royalty Milestone"}
                          </div>

                          <div className="gift-step-target text-dark mt-1">
                            <strong>Required: {targetArea} SQYD</strong> |
                            <span className="text-muted"> Current: {reward.total_progress?.achieved || 0} SQYD</span>
                          </div>

                          <div className="gift-step-target gift_content small mt-2">
                            📝 {reward.terms || "Leg matrix distributions apply (30:30:40)"}
                          </div>

                          <div className="gift-step-target text-muted small mt-1">
                            <strong>🏷️ Type:</strong> {reward.reward_type?.replace(/_/g, ' ').toUpperCase() || "-"}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* END STEP */}
                <div className="gift-step-flex-item gift-step-blank">
                  <div className="gift-step-content-wrapper">
                    <div className="gift-step-marker gift-step-marker-blank">
                      <span>
                        <img src={Endimage} alt="Endimage" width="50" />
                      </span>
                    </div>
                    <div className="gift-step-content">
                      <div className="gift-step-name">End Point</div>
                      <div className="gift-step-target">
                        {displayList.length > 0
                          ? `${displayList[displayList.length - 1]?.total_progress?.required || 0} SQYD`
                          : "0 SQYD"}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* DETAILS TABLE BREAKDOWN */}
        <div className="table-responsive mt-4">
          <table className="table table-bordered table-hover alignment-middle">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Reward Type</th>
                <th>Reward Name</th>
                <th>Target Area (SQYD)</th>
                <th>Legs Breakdown (Achieved / Required)</th>
                <th>Your Total Progress</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {displayList.map((data, index) => {
                const isEligible = data.achieved === true;
                return (
                  <tr key={index} className={isEligible ? "table-success" : ""}>
                    <td>{index + 1}</td>
                    <td className="text-capitalize">
                      {data.reward_type?.replace(/_/g, ' ') || "-"}
                    </td>
                    <td className="fw-bold">{data.reward_name || "-"}</td>
                    <td className="text-primary fw-bold">{data.total_progress?.required || 0}</td>
                    <td>
                      <small>
                        L1: {data.legs_progress?.leg1?.required}/{data.legs_progress?.leg1?.achieved} |
                        L2: {data.legs_progress?.leg2?.required}/ {data.legs_progress?.leg2?.achieved} |
                        L3:{data.legs_progress?.leg3?.required} / {data.legs_progress?.leg3?.achieved}
                      </small>
                    </td>
                    <td>
                      <span className="fw-bold text-success">{data.total_progress?.required || 0}</span>
                      <span className="text-muted"> / {data.total_progress?.achieved || 0}</span>
                    </td>
                    <td className={isEligible ? "text-success fw-bold" : "text-danger fw-bold"}>
                      {isEligible ? "✅ ELIGIBLE" : "❌ NOT ELIGIBLE"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <>
      <div id="Breadcrumb" className="">
        <Row>
          <Col lg={3}>
            <h4 className="page-title mb-0">Dashboard</h4>
          </Col>
          <Col lg={6}>
            <div className="d-flex justify-content-center align-items-center">
              <h6
                className="designation_local mb-0"
                style={{ textDecoration: "underline" }}
              >
                {designation
                  ? `DESIGNATION - ${designation.toUpperCase()}`
                  : "NA"}
              </h6>
            </div>
          </Col>

          <Col lg={3}>
            <div className="d-none d-lg-block float-end">
              <ol className="breadcrumb m-0">
                <li className="breadcrumb-item">Home</li>
                <li className="breadcrumb-item active">Dashboard</li>
              </ol>
            </div>
          </Col>
        </Row>
      </div>


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
                      (prev) =>
                        (prev - 1 + sliderImages.length) % sliderImages.length,
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


      <Row className="mt-4">
        {dashboardData.length > 0 ? (
          dashboardData.map((item, index) => {
            const IconComponent = iconMap[item.icon];
            if (item.customContent && item.title === "Welcome Bonus") {
              const bonusData = dashboard?.bonus || {};
              const joiningDate = bonusData.joiningDate || "--";
              const lastDate = bonusData.lastDate || "--";
              const leadDate = bonusData.leadDate || "--";
              const targetDate = bonusData.targetDate || "--";
              const approveDate = bonusData.approveDate || "--";
              const approved = bonusData.approved || false;
              const isValidDate = (date) => {
                return date && date !== "--" && date !== null && date !== "null";
              };
              const isDateExpired = (dateStr) => {
                if (!isValidDate(dateStr)) return true;
                const currentDate = new Date();
                const [day, month, year] = dateStr.split("-");
                const dateObj = new Date(year, month - 1, day);
                return currentDate > dateObj;
              };
              let joiningBookingStatus = "--";
              let joiningBookingColor = "#6c757d";
              let canRegister = false;
              if (isValidDate(joiningDate) && isValidDate(lastDate)) {
                if (approved === true) {
                  joiningBookingStatus = "Success";
                  joiningBookingColor = "#28a745";
                  canRegister = false;
                } else if (approved === false) {
                  if (!isDateExpired(lastDate)) {
                    joiningBookingStatus = "Progress";
                    joiningBookingColor = "#ffc107";
                    canRegister = true;
                  } else {
                    joiningBookingStatus = "Progress";
                    joiningBookingColor = "#ffc107";
                    canRegister = false;
                  }
                }
              } else {
                joiningBookingStatus = "Not Available";
                joiningBookingColor = "#dc3545";
                canRegister = false;
              }
              let bookingClosingStatus = "--";
              let bookingClosingColor = "#6c757d";

              if (isValidDate(leadDate) && isValidDate(targetDate)) {
                if (approved === true && isValidDate(approveDate)) {
                  bookingClosingStatus = "Achieved";
                  bookingClosingColor = "#28a745";
                } else {
                  bookingClosingStatus = "Not Achieved";
                  bookingClosingColor = "#dc3545";
                }
              } else {
                bookingClosingStatus = "Not Achieved";
                bookingClosingColor = "#dc3545";
              }
              const formatDisplayDate = (dateStr) => {
                if (!dateStr || dateStr === "--" || dateStr === null || dateStr === "null") return "--";
                return dateStr;
              };
              const handleCardClick = () => {
                const fullUrl = `/welcome-bonus-registration-form`;
                navigate(fullUrl);
              };

              return (
                <Col key={index} xs={12} sm={6} md={6} lg={6}>
                  <div
                    className="card bg_card_design welcome-bonus-card h-100"
                    style={{ cursor: "pointer" }}
                    onClick={handleCardClick}
                  >
                    <div className="card-body">
                      <div className="d-flex align-items-center gap-2 gap-md-4">
                        <div className="icon_dashboard">
                          <FaGift size={40} className="text-white" />
                        </div>
                        <div className="w-100">
                          <div className="card-title mb-0">{item.title}</div>
                          <div className="d-flex justify-content-between mt-2">
                            <div className="date-section">
                              <div className="date-label">Joining + Booking</div>
                              <div className="date-range">
                                {formatDisplayDate(joiningDate)} - {formatDisplayDate(lastDate)}
                              </div>
                              {joiningBookingStatus !== "--" && (
                                <div className="status-badge" style={{ color: joiningBookingColor }}>
                                  {joiningBookingStatus}
                                </div>
                              )}
                            </div>

                            <div className="date-section">
                              <div className="date-label">Booking + Closing</div>
                              <div className="date-range">
                                {formatDisplayDate(leadDate)} - {formatDisplayDate(targetDate)}
                              </div>
                              {bookingClosingStatus !== "--" && (
                                <div className="status-badge" style={{ color: bookingClosingColor }}>
                                  {bookingClosingStatus}
                                </div>
                              )}
                            </div>

                          </div>

                          {canRegister && (
                            <div className="register-text mt-2" style={{ color: "#17a2b8", fontSize: "14px", textAlign: "center" }}>
                              Click to Register
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              );
            }

            if (item.customContent && item.title === "Bima") {
              const { activeStatus, successStatus } = dashboard.bimaStatus;
              let statusText = "Inactive";
              let statusColor = "#dc3545";
              let canRegister = false;
              let bimaImage = runningHourse;

              if (activeStatus === true && successStatus === true) {
                statusText = "Success";
                statusColor = "#28a745";
                canRegister = false;
                bimaImage = bimaSuccessImg;
              } else if (activeStatus === true && successStatus === false) {
                statusText = "Active";
                statusColor = "#28a745";
                canRegister = true;
                bimaImage = bimaActiveImg;
              } else {
                statusText = "Inactive";
                statusColor = "#dc3545";
                canRegister = false;
                bimaImage = runningHourse;
              }

              const handleBimaClick = () => {
                navigate("/bima-registration-form");
              };

              return (
                <Col key={index} xs={12} sm={6} md={6} lg={6}>
                  <div
                    className="card bg_card_design welcome-bonus-card h-100"
                    style={{ cursor: "pointer" }}
                    onClick={handleBimaClick}
                  >
                    <div className="card-body">
                      <div className="d-flex align-items-center gap-2 gap-md-4">
                        <div className="icon_dashboard bg_running">
                          <img src={bimaImage} alt="bima" className="load_img hourse" />
                        </div>
                        <div className="d-flex align-items-start justify-content-between flex-column w-100">
                          <div className="card-title mb-0">{item.title}</div>
                          <div className="d-flex justify-content-between align-items-center w-100 mt-2">
                            <div className="fw-bold" style={{ color: statusColor, fontSize: "18px" }}>
                              {statusText}
                            </div>
                            {canRegister && (
                              <div className="register-text" style={{ color: "#17a2b8", fontSize: "14px" }}>
                                Click to Register
                              </div>
                            )}
                            {!canRegister && statusText === "Success" && (
                              <div className="register-text" style={{ color: "#28a745", fontSize: "14px" }}>
                                Claimed
                              </div>
                            )}
                            {!canRegister && statusText === "Inactive" && (
                              <div className="register-text" style={{ color: "#dc3545", fontSize: "14px" }}>
                                Not Available
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              );
            }

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
                        <div className="card-text">
                          {item.value
                            ? item.value
                            : item.image && (
                              <img
                                className="load_img hourse"
                                src={item.image}
                                alt="load-img"
                              />
                            )}
                        </div>
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


      <div className="card mt-4">
        <div className="card-body shadow-none">
          <LifetimeRewardsProgressBar />
        </div>
      </div>


      <div className="card mt-4">
        <div className="card-body shadow-none">
          <RoyaltyRewardsProgressBar />
        </div>
      </div>
    </>
  );

};

export default Dashboard;
