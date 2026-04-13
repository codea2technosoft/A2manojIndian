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
import bimaImg from "../assets/images/bima.png";

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
  // New states for Lifetime Rewards
  const [lifetimeRewardsList, setLifetimeRewardsList] = useState([]);
  const [lifetimeEligibilityData, setLifetimeEligibilityData] = useState([]);
  const [loadingLifetimeRewards, setLoadingLifetimeRewards] = useState(false);
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
    // Get designation directly as string
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
      console.log("Associate Profile Response:", data);

      if (data.status === "1" && data.data) {
        // Date field se date pickup karo
        const registrationDate = data.data.date || data.data.created_at || null;
        console.log("Registration Date:", registrationDate);

        setAssociateData({
          registrationDate: registrationDate,
          name: data.data.username || "",
          mobile: data.data.mobile || "",
          designation: data.data.designation || ""
        });
      } else {
        console.log("No profile data found, using default");
        // Agar API fail ho to default date use karo
        setAssociateData({
          registrationDate: "2026-04-01",
          name: "",
          mobile: "",
          designation: ""
        });
      }
    } catch (error) {
      console.error("Error fetching associate profile:", error);
      // Error case mein bhi default date set karo
      setAssociateData({
        registrationDate: "2026-04-01",
        name: "",
        mobile: "",
        designation: ""
      });
    }
  };


  const calculateDatesFromRegistration = (registrationDateStr) => {
    console.log("Calculating dates from:", registrationDateStr);

    if (!registrationDateStr) {
      console.log("No registration date, using default");
      // Default date use karo agar null hai
      registrationDateStr = "2026-04-01";
    }

    // Parse the registration date
    const regDate = new Date(registrationDateStr);
    console.log("Parsed registration date:", regDate);

    // Joining date
    const joiningDate = new Date(regDate);

    // Booking date = Registration date + 30 days
    const bookingDate = new Date(regDate);
    bookingDate.setDate(regDate.getDate() + 30);

    // Closing date = Booking date + 30 days
    const closingDate = new Date(bookingDate);
    closingDate.setDate(bookingDate.getDate() + 30);

    console.log("Joining Date:", joiningDate);
    console.log("Booking Date:", bookingDate);
    console.log("Closing Date:", closingDate);

    return {
      joiningDate,
      bookingDate,
      closingDate
    };
  };




  // Add this function to calculate dates
  const calculateDates = () => {
    if (!associateData.registrationDate) return { bookingDate: null, closingDate: null };

    const regDate = new Date(associateData.registrationDate);
    const bookingDate = new Date(regDate);
    bookingDate.setDate(regDate.getDate() + 30);

    const closingDate = new Date(bookingDate);
    closingDate.setDate(bookingDate.getDate() + 30);

    return { bookingDate, closingDate };
  };

  // Add this function to format date as DD-MM-YY
  const formatShortDate = (date) => {
    if (!date) return "-";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${day}-${month}-${year}`;
  };

  // Call this in your existing useEffect (around line 350)
  useEffect(() => {
    fetchDashboardData();
    fetchGiftList();
    fetchTeamGiftList();
    fetchLifetimeRewardsList();
    fetchLifetimeRewardsEligibility();
    fetchmyteamLinesSummaryAssociate();
    fetchAssociateProfile(); // Add this line
  }, []);


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
        total_propertyEarning: 0,
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
      console.log("Lifetime Rewards List Response:", data);

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
      console.log("Lifetime Rewards Eligibility Response:", data);

      if (data.success === true) {
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

  // const fetchLifetimeRewardsEligibility = async () => {
  //   try {
  //     setLoadingLifetimeEligibility(true);
  //     const token = getAuthToken();
  //     const response = await fetch(`${API_URL}/lifetime-rewards-list-associate-eligibility`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     const data = await response.json();
  //     console.log("Lifetime Rewards Eligibility Response:", data);

  //     if (data.success == '1') {
  //       const eligibilityData = Array.isArray(data.data) ? data.data : [data.data];
  //       setLifetimeEligibilityData(eligibilityData);
  //     } else {
  //       setLifetimeEligibilityData([]);
  //     }
  //   } catch (error) {
  //     console.error("Lifetime Rewards eligibility fetch error:", error);
  //     setLifetimeEligibilityData([]);
  //   } finally {
  //     setLoadingLifetimeEligibility(false);
  //   }
  // };

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
      console.log("Fetched Team Gift List:", data);

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
        // status 1 hai na ki "1"

        const newLineData = {
          line1: {
            total_buysqft: parseFloat(data.lines?.line1?.total_buysqft) || 0,
            total_members: 1, // line1 mein 1 member (line owner)
            line_name: data.lines?.line1?.line_name || "Line 1",
            line_id: data.lines?.line1?.line_id,
          },
          line2: {
            total_buysqft: parseFloat(data.lines?.line2?.total_buysqft) || 0,
            total_members: 1, // line2 mein 1 member (line owner)
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
            total_members: (data.lines?.others?.lines_count || 0) + 2, // line1 + line2 + others lines_count
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
        // Default data for unsuccessful response
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
      console.error("myteam-lines-summary-associate Error:", error);
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

    // {
    //   title: "Welcome Bonus",
    //   icon: "FaGift",
    //   image: designation === "Sr. Sales Associate" ? welcomeImg : runningHourse,
    // },

    // {
    //   title: "Bima",
    //   icon: "TbReceiptRupee",
    //   image: designation === "Sr. Sales Associate" ? bimaImg : runningHourse,
    // },


  

    // {
    //   title: "Total Loan Leads",
    //   value: (
    //     <span style={{ color: dashboard.total_lead_loan === 0 ? "red" : "green" }}>
    //       {dashboard.total_lead_loan}
    //     </span>
    //   ),
    //   icon: "RiHandCoinLine",
    //   href: "/loan-list",
    // },

    // {
    //   title: "Total SQYD Sales",
    //   value: (
    //     <span
    //       style={{
    //         color:
    //           Number(dashboard.total_sqyd_self_sales || 0) +
    //             Number(dashboard.total_sqyd_team_sales || 0) ===
    //           0
    //             ? "red"
    //             : "green",
    //       }}
    //     >
    //       {(
    //         Number(dashboard.total_sqyd_self_sales || 0) +
    //         Number(dashboard.total_sqyd_team_sales || 0)
    //       ).toFixed(2)}
    //     </span>
    //   ),
    //   icon: "FaBuilding",
    // },

    // {
    //   title: "Total SQYD Self Sales",
    //   value: (
    //     <span
    //       style={{
    //         color:
    //           Number(dashboard.total_sqyd_self_sales) === 0 ||
    //           !dashboard.total_sqyd_self_sales
    //             ? "red"
    //             : "green",
    //       }}
    //     >
    //       {Number(dashboard.total_sqyd_self_sales) > 0
    //         ? Number(dashboard.total_sqyd_self_sales).toFixed(2)
    //         : "0.00"}
    //     </span>
    //   ),
    //   icon: "FaBuilding",
    // },
    // {
    //   title: "Total SQYD Team Sales",
    //   value: (
    //     <span
    //       style={{
    //         color:
    //           Number(dashboard.total_sqyd_team_sales) === 0 ||
    //           !dashboard.total_sqyd_team_sales
    //             ? "red"
    //             : "green",
    //       }}
    //     >
    //       {Number(dashboard.total_sqyd_team_sales) > 0
    //         ? Number(dashboard.total_sqyd_team_sales).toFixed(2)
    //         : "0.00"}
    //     </span>
    //   ),
    //   icon: "FaBuilding",
    // },
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
      customContent: true, // Add flag for custom rendering
    },


    {
      title: "Bima",
      icon: "TbReceiptRupee",
      customContent: true,
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

  // Self Gift Progress Component
  // Self Gift Progress Component - Updated
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
    const maxSqyd =
      parseFloat(giftList[giftList.length - 1]?.area_sqyd) ||
      Math.max(...giftList.map((g) => parseFloat(g.area_sqyd)));

    // Find the eligible gift based on API response
    const eligibleGiftData = eligibilityData.find(
      (item) => item.status === "Eligible",
    );
    const eligibleGift = giftList.find(
      (gift) =>
        gift.offer_name === eligibleGiftData?.gift_name &&
        gift.offer_item === eligibleGiftData?.gift_item,
    );

    // Get qualifying gift's SQYD requirement
    const qualifyingSqyd = eligibleGift
      ? parseFloat(eligibleGift.area_sqyd)
      : 0;
    const achieved_at = eligibleGift ? parseFloat(eligibleGift.achieved_at) : 0;

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
                <Row>
                  <Col sm={12} className="mb-3 text-end">
                    <div className="fs-5 d-block">Current</div>
                    <span className="text-success">
                      {data.achieved_area || "0"} SQYD
                    </span>
                  </Col>
                  {/* <Col sm={6} className="mb-3">
                    <div className="fs-5">
                      Achieved Area
                    </div>
                    <small className="text-success d-block">  {data.achieved_area || "0"} SQYD</small>
                  </Col> */}
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
                      <div className="gift-step-target">0 SQYD</div>
                    </div>
                  </div>
                </div>

                {/* {giftList.map((gift, index) => {
                  const giftSqyd = parseFloat(gift.area_sqyd);
                  const isEligibleGift = eligibleGift && gift.id === eligibleGift.id;
                  const isCompleted = currentSqyd >= giftSqyd;
                  if (isEligibleGift || giftSqyd <= qualifyingSqyd) {
                    return (
                      <div
                        key={gift.id || index}
                        className={`gift-step-flex-item ${isEligibleGift ? 'gift-step-current' : ''} ${isCompleted ? 'gift-step-completed' : ''}`}
                      >
                        <div className="gift-step-content-wrapper">
                          <div className={`gift-step-marker ovel ${isEligibleGift ? 'ggift-step-marker-current bg-success' : 'bg-danger'}`}>
                            {isEligibleGift ? 'Qualified' : "Unqualified"}
                          </div>
                          <div className="gift-step-content">
                            <div className="gift-step-name">{gift.offer_name || `Gift ${index + 1}`}</div>
                            <div className="gift-step-target">{gift.offer_item || `Gift ${index + 1}`}</div>
                            <div className="gift-step-target text-dark"><strong>{giftSqyd} </strong>SQYD</div>

                            {isEligibleGift && eligibleGiftData && (
                              <div className="gift-step-achieved">
                                <div>{eligibleGiftData?.project_name || "NA"}</div>
                                <div>{formatDate(eligibleGiftData?.status_date)}</div>
                                <small className="text-success">Eligible</small>
                              </div>
                            )}
                            {!isEligibleGift && isCompleted && (
                              <div className="gift-step-achieved">
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })} */}

                {giftList.map((gift, index) => {
                  const giftSqyd = parseFloat(gift.area_sqyd || 0);
                  const isEligibleGift = eligibleGift?.id === gift.id;
                  const isCompleted = currentSqyd >= giftSqyd;

                  return (
                    <div
                      key={gift.id}
                      className={`gift-step-flex-item 
        ${isEligibleGift ? "gift-step-current" : ""} 
        ${isCompleted ? "gift-step-completed" : ""}`}
                    >
                      <div className="gift-step-content-wrapper">
                        <div
                          className={`gift-step-marker ovel ${isCompleted ? "bg-success" : "bg-danger"
                            }`}
                        >
                          {isCompleted ? "Qualified" : "Unqualified"}
                        </div>

                        <div className="gift-step-content">
                          <div className="gift-step-name">
                            {gift.offer_name}
                          </div>
                          <div className="gift-step-target">
                            {gift.offer_item}
                          </div>
                          <div className="gift-step-target text-dark">
                            <strong>{giftSqyd}</strong> SQYD
                          </div>

                          <div className="gift-step-target gift_content">
                            {gift.terms_conditions}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Show end point if we have qualifying gift */}
                {qualifyingSqyd > 0 && (
                  <div className="gift-step-flex-item gift-step-blank">
                    <div className="gift-step-content-wrapper">
                      <div className="gift-step-marker gift-step-marker-blank">
                        <span>
                          <img src={Endimage} alt="Endimage" width="50" />
                        </span>
                      </div>
                      <div className="gift-step-content">
                        <div className="gift-step-target">{maxSqyd} SQYD</div>
                      </div>

                      <div className="gift-step-content">
                        <div className="gift-step-target">{achieved_at} </div>
                      </div>
                    </div>
                  </div>
                )}

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

        {/* Show details only for eligible gift */}
        {/* {eligibleGift && (
          <div className="p-3 border-top">
            <h6 className="mb-3">Eligible Gift Details:</h6>
            <Row>
              <Col sm={2} className="mb-2">
                <div>
                  <div className="text-muted">Start Date:</div>
                  <div className="text-danger fw-bold">
                    {eligibleGift.date_from || eligibleGiftData?.gift_date_from || "-"}
                  </div>
                </div>
              </Col>

              <Col sm={2} className="mb-2">
                <div>
                  <div className="text-muted">End Date:</div>
                  <div className="text-success fw-bold">
                    {eligibleGift.date_to || eligibleGiftData?.gift_date_to || "-"}
                  </div>
                </div>
              </Col>

              <Col sm={2} className="mb-2">
                <div>
                  <div className="text-muted">Payment Days:</div>
                  <div className="text-danger fw-bold">
                    {eligibleGift.closing_days || eligibleGiftData?.closing_days || "-"}
                  </div>
                </div>
              </Col>

              <Col sm={3} className="mb-2">
                <div>
                  <div className="text-muted">Terms & Conditions:</div>
                  <div className="text-danger">
                    {eligibleGift.terms_conditions || "-"}
                  </div>
                </div>
              </Col>

              <Col sm={3} className="mb-2">
                <div>
                  <div className="text-muted">Project Name:</div>
                  <div className="text-success fw-bold">
                    {eligibleGift.offer_project_name || eligibleGiftData?.project_name || "-"}
                  </div>
                </div>
              </Col>
            </Row>
            {eligibleGiftData && (
              <Row className="mt-3">
                <Col sm={12}>
                  <div className="alert alert-success">
                    <strong>Status:</strong> {eligibleGiftData.status} <br />
                    <strong>Qualifying Lead Date:</strong> {eligibleGiftData.qualifying_lead_date} <br />
                    <strong>Closing Date:</strong> {formatDate(eligibleGiftData.closing_date)} <br />
                    <strong>Days Completed:</strong> {eligibleGiftData.days_completed} <br />
                    <strong>Days Remaining:</strong> {eligibleGiftData.days_remaining}
                  </div>
                </Col>
              </Row>
            )}
          </div>
        )} */}

        {giftList.length > 0 ? (
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
              {giftList.map((data, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>

                  <td className="text-danger">{data.date_from}</td>

                  <td className="text-success">{data.date_to}</td>

                  <td className="text-danger">{data?.closing_days || "N/A"}</td>

                  <td className="text-danger">{data.terms_conditions}</td>

                  <td className="text-success">
                    <div className="table-cell-remark">
                      {data.offer_project_name}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <NoDataMessage message="Sorry, no team eligibility date data found" />
        )}

        {/* If no eligible gift found */}
        {!eligibleGift && eligibilityData.length === 0 && (
          <div className="text-center py-4">
            <div className="alert alert-warning">
              No eligible gift found. You need to achieve{" "}
              {giftList[0]?.area_sqyd || 0} SQYD to qualify for the first gift.
            </div>
          </div>
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
    const maxTeamSqyd =
      parseFloat(giftTeamList[giftTeamList.length - 1]?.area_sqyd) ||
      Math.max(...giftTeamList.map((g) => parseFloat(g.area_sqyd)));

    return (
      <div className="gift-progress-wrapper">
        <div className="gift-progress-header">
          <h5 className="gift-progress-title">
            <FaUsers className="gift-title-icon" />
            Team Gift Progress
          </h5>
          {teameligibilityData.length > 0 ? (
            <div className="mt-2 w-50">
              <Row className="text-end">
                <Col sm={12} className="mb-3">
                  <div>
                    <div className="fs-5">Current</div>
                    <small className="text-success d-block">
                      {currentTeamSqyd} SQYD
                    </small>
                    {/* <span className="gift-current-badge d-block mt-1">
                      Current Progress
                    </span> */}
                  </div>
                </Col>
                <Col sm={6} className="mb-3">
                  <div>
                    {/* <div className="fs-5">Target Area</div>
                    <small className=" text-info d-block">
                      {maxTeamSqyd} SQYD
                    </small> */}
                    {/* <span className="gift-target-badge d-block mt-1">
                      Final Goal
                    </span> */}
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
                  width: `${Math.min(100, (currentTeamSqyd / maxTeamSqyd) * 100)}%`,
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
                  const isCurrent =
                    currentTeamSqyd < giftSqyd &&
                    (index === 0 ||
                      currentTeamSqyd >=
                      parseFloat(giftTeamList[index - 1]?.area_sqyd));
                  const progressPercentage = Math.min(
                    100,
                    (currentTeamSqyd / giftSqyd) * 100,
                  );

                  return (
                    <>
                      <div
                        key={gift.id || index}
                        className={`gift-step-flex-item ${isCompleted ? "gift-step-completed" : ""} ${isCurrent ? "gift-step-current" : ""}`}
                      >
                        <div className="gift-step-content-wrapper">
                          <div
                            className={`gift-step-marker ovel ${isCompleted
                              ? "gift-step-marker-completed bg-success text-white"
                              : isCurrent
                                ? "gift-step-marker-current bg-danger text-white"
                                : "bg-danger text-white"
                              }`}
                          >
                            {isCompleted ? "Qualified" : "Unqualified"}
                          </div>
                          <div className="gift-step-content">
                            <div className="gift-step-name">
                              {gift.offer_name || `Team Gift ${index + 1}`}
                            </div>
                            <div className="gift-step-target">
                              {gift.offer_item || `Team Reward ${index + 1}`}
                            </div>
                            <div className="gift-step-sqyd text-dark">
                              <strong>{giftSqyd} SQYD</strong>
                            </div>
                            {isCompleted && (
                              <div className="gift-step-achieved">
                                {/* <small>Completed!</small> */}
                                <div>
                                  {teameligibilityData?.[0]?.project_name ||
                                    "-NA-"}
                                </div>
                                {/* <div>{teameligibilityData?.[0]?.qualify_date || "-NA-"}</div> */}
                                <div>
                                  {formatDate(
                                    teameligibilityData?.[0]?.achieved_at,
                                  )}
                                </div>
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
                                {/* <small>{progressPercentage.toFixed(1)}%</small> */}
                              </div>
                            )}
                            <div className="gift-step-target gift_content">
                              {gift.terms_conditions}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
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
              {giftTeamList.map((data, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>

                  <td className="text-danger">{data.date_from}</td>

                  <td className="text-success">{data.date_to}</td>

                  <td className="text-danger">{data?.closing_days || "N/A"}</td>

                  <td className="text-danger">{data.terms_conditions}</td>

                  <td className="text-success">
                    <div className="table-cell-remark">
                      {data.offer_project_name}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <NoDataMessage message="Sorry, no team eligibility date data found" />
        )}
      </div>
    );
  };

  const LifetimeRewardsProgressBar = () => {
    if (loadingLifetimeRewards || loadingLifetimeEligibility) {
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

    if (lifetimeRewardsList.length === 0) {
      return <NoDataMessage message="Sorry, no lifetime Rewards data found" />;
    }

    const eligibilityData =
      lifetimeEligibilityData.length > 0 ? lifetimeEligibilityData[0] : null;

    const currentSqyd =
      eligibilityData?.rewards && eligibilityData.rewards.length > 0
        ? Math.max(
          ...eligibilityData.rewards.map((r) => parseFloat(r.totalArea || 0)),
        )
        : 0;

    const maxSqyd =
      parseFloat(
        lifetimeRewardsList[lifetimeRewardsList.length - 1]?.area_sqyd,
      ) || Math.max(...lifetimeRewardsList.map((g) => parseFloat(g.area_sqyd)));

    const eligibleRewardAreas = eligibilityData?.rewards
      ? new Set(
        eligibilityData.rewards.map((r) => parseFloat(r.reward.area_sqyd)),
      )
      : new Set();

    const highestEligibleReward =
      eligibilityData?.rewards && eligibilityData.rewards.length > 0
        ? eligibilityData.rewards.reduce(
          (max, reward) =>
            parseFloat(reward.reward.area_sqyd) >
              parseFloat(max.reward.area_sqyd)
              ? reward
              : max,
          eligibilityData.rewards[0],
        )
        : null;

    return (
      <div className="gift-progress-wrapper">
        <div className="gift-progress-header">
          <h5 className="gift-progress-title">
            <FaGift className="gift-title-icon" />
            Lifetime Rewards Progress
          </h5>

          {eligibilityData ? (
            <div className="mt-2">
              <Row className="text-end">
                <Col sm={12} className="mb-3">
                  <div className="fs-5">Current Team Area</div>
                  <small className="text-success d-block">
                    {currentSqyd.toFixed(2)} SQYD
                  </small>
                </Col>
              </Row>

              {/* Show eligible rewards summary */}
              {eligibilityData.rewards &&
                eligibilityData.rewards.length > 0 && (
                  <div className="mt-2 p-2 bg-light rounded">
                    <h6 className="text-success mb-2">
                      🏆 You are eligible for {eligibilityData.rewards.length}{" "}
                      Rewards!
                    </h6>
                    <div className="small">
                      {eligibilityData.rewards.map((reward, idx) => (
                        <div
                          key={idx}
                          className="d-flex justify-content-between border-bottom py-1"
                        >
                          <span>{reward.reward.offer_item}</span>
                          <span className="text-primary">
                            ₹{reward.reward.item_amount?.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
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
                      <div className="gift-step-target">0 SQYD</div>
                    </div>
                  </div>
                </div>

                {lifetimeRewardsList.map((reward, index) => {
                  const rewardSqyd = parseFloat(reward.area_sqyd);
                  const isCompleted = currentSqyd >= rewardSqyd;
                  const isEligible = eligibleRewardAreas.has(rewardSqyd);

                  const matchingReward =
                    isEligible && eligibilityData?.rewards
                      ? eligibilityData.rewards.find(
                        (r) => parseFloat(r.reward.area_sqyd) === rewardSqyd,
                      )
                      : null;

                  return (
                    <div
                      key={reward.id || index}
                      className={`gift-step-flex-item 
                      ${isCompleted ? "gift-step-completed" : ""} 
                      ${isEligible ? "gift-step-current" : ""}`}
                    >
                      <div className="gift-step-content-wrapper">
                        <div className="gift-step-target gift_content mb-2">
                          <ul className="leg_content">
                            {legData.map((item, index) => (
                              <li key={index}>
                                <span className="text_leg">{item.leg} :</span>
                                {item.amount} - {item.value}
                                <span
                                  className={`status ${item.status}`}
                                  style={{
                                    marginLeft: "10px",
                                    color:
                                      item.status === "active"
                                        ? "green"
                                        : "red",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {item.status === "active"
                                    ? "Active"
                                    : "Inactive"}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div
                          className={`gift-step-marker ovel ${isEligible
                            ? "bg-success"
                            : isCompleted
                              ? "bg-warning"
                              : "bg-danger"
                            } text-white`}
                        >
                          {isEligible
                            ? "Eligible"
                            : isCompleted
                              ? "Qualified"
                              : "Not Qualified"}
                        </div>
                        <div className="gift-step-content">
                          <div className="gift-step-name">
                            {reward.offer_name ||
                              `Lifetime Rewards ${index + 1}`}
                          </div>
                          <div className="gift-step-target">
                            {reward.offer_item || `Rewards ${index + 1}`}
                          </div>
                          <div className="gift-step-target text-dark">
                            <strong>{rewardSqyd} </strong>SQYD
                          </div>

                          {matchingReward && (
                            <div className="gift-step-target text-success">
                              <strong>
                                Date:{" "}
                                {(() => {
                                  const d = new Date(
                                    matchingReward.achievementDate,
                                  );
                                  const day = String(d.getDate()).padStart(
                                    2,
                                    "0",
                                  );
                                  const month = String(
                                    d.getMonth() + 1,
                                  ).padStart(2, "0");
                                  const year = d.getFullYear();
                                  return `${day}-${month}-${year}`;
                                })()}
                              </strong>
                            </div>
                          )}

                          {reward.item_amount && (
                            <div className="gift-step-target text-primary">
                              <strong>
                                ₹
                                {parseFloat(
                                  reward.item_amount,
                                ).toLocaleString()}
                              </strong>
                            </div>
                          )}

                          {isEligible && matchingReward && (
                            <div className="gift-step-target text-success small">
                              ✓ You've earned this reward!
                            </div>
                          )}

                          <div className="gift-step-target gift_content">
                            {reward.terms_conditions}
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

        {/* Eligible Rewards Details Section */}
        {eligibilityData?.rewards && eligibilityData.rewards.length > 0 && (
          <div className="p-3 border-top bg-light">
            <h6 className="mb-3">
              🎁 Your Eligible Rewards ({eligibilityData.rewards.length})
            </h6>
            <Row>
              {eligibilityData.rewards.map((rewardItem, idx) => (
                <Col md={4} key={idx} className="mb-3">
                  <div className="border rounded p-2 h-100">
                    <div className="fw-bold text-success">
                      {rewardItem.reward.offer_item}
                    </div>
                    <div className="small">
                      <div>
                        <strong>Area:</strong> {rewardItem.reward.area_sqyd}{" "}
                        SQYD
                      </div>
                      <div>
                        <strong>Value:</strong> ₹
                        {parseFloat(
                          rewardItem.reward.item_amount,
                        ).toLocaleString()}
                      </div>
                      {/* <div><strong>Achieved:</strong> {new Date(rewardItem.achievementDate).toLocaleDateString()}</div> */}

                      <div className="gift-step-target text-success">
                        <strong>
                          Date:{" "}
                          {(() => {
                            const d = new Date(rewardItem.achievementDate);
                            const day = String(d.getDate()).padStart(2, "0");
                            const month = String(d.getMonth() + 1).padStart(
                              2,
                              "0",
                            );
                            const year = d.getFullYear();
                            return `${day}-${month}-${year}`;
                          })()}
                        </strong>
                      </div>

                      <div className="mt-1">
                        <strong>Your Team Area:</strong>{" "}
                        {rewardItem.totalArea.toFixed(2)} SQYD
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </div>
    );
  };

  // const LifetimeRewardsProgressBar = () => {
  //   if (loadingLifetimeRewards || loadingLifetimeEligibility) {
  //     return (
  //       <div className="gift-progress-loading">
  //         <div className="gift-spinner" role="status">
  //           <span className="gift-spinner-text">Loading lifetime Rewards...</span>
  //         </div>
  //         <p className="gift-loading-text">Loading lifetime Rewards progress...</p>
  //       </div>
  //     );
  //   }

  //   if (lifetimeRewardsList.length === 0) {
  //     return <NoDataMessage message="Sorry, no lifetime Rewards data found" />;
  //   }

  //   // Get eligibility data from the new API response
  //   const eligibilityData = lifetimeEligibilityData.length > 0 ? lifetimeEligibilityData[0] : null;
  //   const currentSqyd = eligibilityData ? parseFloat(eligibilityData.user_buysqrt || 0) : 0;
  //   const maxSqyd = parseFloat(lifetimeRewardsList[lifetimeRewardsList.length - 1]?.area_sqyd) ||
  //     Math.max(...lifetimeRewardsList.map(g => parseFloat(g.area_sqyd)));

  //   // Find eligible reward from lifetimeRewardsList
  //   const eligibleReward = eligibilityData?.eligible_reward?.area_sqyd
  //     ? lifetimeRewardsList.find(reward =>
  //       parseFloat(reward.area_sqyd) === parseFloat(eligibilityData.eligible_reward.area_sqyd)
  //     )
  //     : null;

  //   return (
  //     <div className="gift-progress-wrapper">
  //       <div className="gift-progress-header">
  //         <h5 className="gift-progress-title">
  //           <FaGift className="gift-title-icon" />
  //           Lifetime Rewards Progress
  //         </h5>

  //         {eligibilityData ? (
  //           <div className="mt-2">
  //             <Row className="text-end">
  //               <Col sm={12} className="mb-3">
  //                 <div className="fs-5">Current</div>
  //                 <small className="text-success d-block">
  //                   {currentSqyd.toFixed(2)} SQYD
  //                 </small>
  //               </Col>
  //               {/* <Col sm={4} className="mb-3">
  //               <div className="fs-5">Status:</div>
  //               <small className={`d-block fw-bold ${
  //                 eligibilityData.status === "ELIGIBLE" ? "text-success" : "text-warning"
  //               }`}>
  //                 {eligibilityData.status}
  //               </small>
  //             </Col> */}
  //               {/* <Col sm={4} className="mb-3">
  //               <div className="fs-5">Eligible For:</div>
  //               <small className="text-info d-block">
  //                 {eligibilityData.eligible_reward?.offer_item || "Not Eligible"}
  //               </small>
  //             </Col> */}
  //             </Row>

  //             {/* Distribution Check Status */}
  //             {/* {eligibilityData.distribution_check_30_30_40 && (
  //             <div className="mt-3">
  //               <h6 className="text-center mb-3">Distribution Check (30-30-40 Rule)</h6>
  //               <Row className="text-center">
  //                 <Col sm={4} className="mb-2">
  //                   <div className="fs-6">Required Total:</div>
  //                   <div className="fw-bold">
  //                     {eligibilityData.distribution_check_30_30_40.required_total_area} SQYD
  //                   </div>
  //                 </Col>
  //                 <Col sm={4} className="mb-2">
  //                   <div className="fs-6">Line 1 (30%):</div>
  //                   <div className={`fw-bold ${
  //                     eligibilityData.distribution_check_30_30_40.child1_check.status === "PASS"
  //                       ? "text-success" : "text-danger"
  //                   }`}>
  //                     {eligibilityData.distribution_check_30_30_40.child1_check.achieved}/{eligibilityData.distribution_check_30_30_40.child1_check.required} SQYD
  //                   </div>
  //                   <small className="text-muted">
  //                     {eligibilityData.distribution_check_30_30_40.child1_check.child_name}
  //                   </small>
  //                 </Col>
  //                 <Col sm={4} className="mb-2">
  //                   <div className="fs-6">Line 2 (30%):</div>
  //                   <div className={`fw-bold ${
  //                     eligibilityData.distribution_check_30_30_40.child2_check.status === "PASS"
  //                       ? "text-success" : "text-danger"
  //                   }`}>
  //                     {eligibilityData.distribution_check_30_30_40.child2_check.achieved}/{eligibilityData.distribution_check_30_30_40.child2_check.required} SQYD
  //                   </div>
  //                   <small className="text-muted">
  //                     {eligibilityData.distribution_check_30_30_40.child2_check.child_name}
  //                   </small>
  //                 </Col>
  //               </Row>
  //               <Row className="text-center mt-2">
  //                 <Col sm={6} className="mb-2">
  //                   <div className="fs-6">Remaining Team (40%):</div>
  //                   <div className={`fw-bold ${
  //                     eligibilityData.distribution_check_30_30_40.self_remaining_check.status === "PASS"
  //                       ? "text-success" : "text-danger"
  //                   }`}>
  //                     {eligibilityData.distribution_check_30_30_40.self_remaining_check.total_achieved}/{eligibilityData.distribution_check_30_30_40.self_remaining_check.required} SQYD
  //                   </div>
  //                   <small className="text-muted">
  //                     {eligibilityData.distribution_check_30_30_40.self_remaining_check.remaining_children_count} members
  //                   </small>
  //                 </Col>
  //                 <Col sm={6} className="mb-2">
  //                   <div className="fs-6">Overall Status:</div>
  //                   <div className={`fw-bold ${
  //                     eligibilityData.distribution_check_30_30_40.overall_status === "ELIGIBLE"
  //                       ? "text-success" : "text-danger"
  //                   }`}>
  //                     {eligibilityData.distribution_check_30_30_40.overall_status}
  //                   </div>
  //                 </Col>
  //               </Row>
  //             </div>
  //           )} */}
  //           </div>
  //         ) : (
  //           <NoDataMessage message="Sorry, no lifetime Rewards eligibility data found" />
  //         )}
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

  //               {lifetimeRewardsList.map((reward, index) => {
  //                 const rewardSqyd = parseFloat(reward.area_sqyd);
  //                 const achieved_at = reward.achieved_at;
  //                 const isCompleted = currentSqyd >= rewardSqyd;
  //                 const isCurrentEligible = eligibleReward?.id === reward.id;
  //                 const isCurrent = currentSqyd < rewardSqyd &&
  //                   (index === 0 || currentSqyd >= parseFloat(lifetimeRewardsList[index - 1]?.area_sqyd));

  //                 return (
  //                   <div
  //                     key={reward.id || index}
  //                     className={`gift-step-flex-item
  //                     ${isCompleted ? 'gift-step-completed' : ''}
  //                     ${isCurrentEligible ? 'gift-step-current' : ''}
  //                     ${isCurrent ? 'gift-step-next-target' : ''}`}
  //                   >
  //                     <div className="gift-step-content-wrapper">
  //                       <div className={`gift-step-marker ovel ${isCurrentEligible ? 'bg-success' :
  //                         isCompleted ? 'bg-warning' : 'bg-danger'
  //                         } text-white`}>
  //                         {isCurrentEligible ? 'Eligible' :
  //                           isCompleted ? 'Qualified' : 'Not Qualified'}
  //                       </div>
  //                       <div className="gift-step-content">
  //                         <div className="gift-step-name">{reward.offer_name || `Lifetime Rewards ${index + 1}`}</div>
  //                         <div className="gift-step-target">{reward.offer_item || `Rewards ${index + 1}`}</div>
  //                         <div className="gift-step-target text-dark">
  //                           <strong>{rewardSqyd} </strong>SQYDdd
  //                         </div>

  //                          <div className="gift-step-target text-dark">
  //                           <strong>{achieved_at} </strong>
  //                         </div>

  //                         {reward.item_amount && (
  //                           <div className="gift-step-target text-primary">
  //                             <strong>₹{reward.item_amount.toLocaleString()}</strong>
  //                           </div>
  //                         )}
  //                         <div className="gift-step-target gift_content">
  //                           {reward.terms_conditions}
  //                         </div>

  //                         {/* Show eligible reward details */}
  //                         {isCurrentEligible && eligibilityData && (
  //                           <div className="gift-step-achieved mt-2 p-2 bg-light rounded">
  //                             <small className="text-success fw-bold">Currently Eligible</small>
  //                             <div className="small">
  //                               <strong>Distribution:</strong> 30-30-40 Rule
  //                             </div>
  //                             <div className="small">
  //                               <strong>Team Members:</strong> {eligibilityData.team_details?.total_children || 0}
  //                             </div>
  //                           </div>
  //                         )}
  //                       </div>
  //                     </div>
  //                   </div>
  //                 );
  //               })}

  //               <div className="gift-step-flex-item gift-step-blank">
  //                 <div className="gift-step-content-wrapper">
  //                   <div className="gift-step-marker gift-step-marker-blank">
  //                     <span>
  //                       <img src={Endimage} alt="Endimage" width="50" />
  //                     </span>
  //                   </div>
  //                   <div className="gift-step-content">
  //                     <div className="gift-step-name">End Point</div>
  //                     <div className="gift-step-target">{maxSqyd} SQYD</div>
  //                   </div>
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>

  //       {/* Team Details Section */}
  //       {/* {eligibilityData?.team_details && (
  //       <div className="mt-4 p-3 border-top">
  //         <h6 className="mb-3">Team Performance Details</h6>
  //         <Row>
  //           <Col md={6}>
  //             <div className="mb-3">
  //               <h6>Top Performers (First Two Lines)</h6>
  //               {eligibilityData.team_details.top_two_children && eligibilityData.team_details.top_two_children.length > 0 ? (
  //                 eligibilityData.team_details.top_two_children.map((member, index) => (
  //                   <div key={member.user_id} className="d-flex justify-content-between border-bottom py-2">
  //                     <div>
  //                       <strong>{index + 1}. {member.username}</strong>
  //                       <div className="small text-muted">{member.mobile}</div>
  //                     </div>
  //                     <div className="text-end">
  //                       <div className="fw-bold">{member.buysqrt} SQYD</div>
  //                       <div className="small text-success">{member.relationship}</div>
  //                     </div>
  //                   </div>
  //                 ))
  //               ) : (
  //                 <div className="text-muted">No top performers found</div>
  //               )}
  //             </div>
  //           </Col>
  //           <Col md={6}>
  //             <div className="mb-3">
  //               <h6>Remaining Team Members ({eligibilityData.team_details.remaining_children?.length || 0})</h6>
  //               <div className="small">
  //                 <div className="d-flex justify-content-between mb-2">
  //                   <span>Total Team Members:</span>
  //                   <strong>{eligibilityData.team_details.total_children}</strong>
  //                 </div>
  //                 <div className="d-flex justify-content-between mb-2">
  //                   <span>Total Area Achieved by Remaining Team:</span>
  //                   <strong>{eligibilityData.distribution_check_30_30_40?.self_remaining_check?.remaining_children_area || "0.00"} SQYD</strong>
  //                 </div>
  //                 <div className="d-flex justify-content-between">
  //                   <span>Self Area:</span>
  //                   <strong>{eligibilityData.user_buysqrt} SQYD</strong>
  //                 </div>
  //               </div>

  //               {eligibilityData.team_details.remaining_children &&
  //                eligibilityData.team_details.remaining_children.length > 0 && (
  //                 <div className="mt-2 small">
  //                   <div className="fw-bold">Sample Team Members:</div>
  //                   {eligibilityData.team_details.remaining_children.slice(0, 3).map((member, index) => (
  //                     <div key={index} className="d-flex justify-content-between">
  //                       <span>{member.username}</span>
  //                       <span>{member.buysqrt} SQYD</span>
  //                     </div>
  //                   ))}
  //                   {eligibilityData.team_details.remaining_children.length > 3 && (
  //                     <div className="text-muted mt-1">
  //                       + {eligibilityData.team_details.remaining_children.length - 3} more members
  //                     </div>
  //                   )}
  //                 </div>
  //               )}
  //             </div>
  //           </Col>
  //         </Row>
  //       </div>
  //     )} */}

  //       {/* Reward Terms Section */}
  //       {eligibilityData?.eligible_reward && (
  //         <div className="p-3 border-top bg-light">
  //           <h6 className="mb-3">Eligible Rewards Details</h6>
  //           <Row>
  //             <Col md={4} className="mb-2">
  //               <div className="fw-bold">Rewards:</div>
  //               <div className="text-success">{eligibilityData.eligible_reward.offer_item}</div>
  //             </Col>
  //             <Col md={4} className="mb-2">
  //               <div className="fw-bold">Required Area:</div>
  //               <div className="text-danger">{eligibilityData.eligible_reward.area_sqyd} SQYD</div>
  //             </Col>
  //             <Col md={4} className="mb-2">
  //               <div className="fw-bold">Value:</div>
  //               <div className="text-primary">₹{eligibilityData.eligible_reward.item_amount?.toLocaleString()}</div>
  //             </Col>
  //             <Col md={12} className="mt-2">
  //               <div className="fw-bold">Terms & Conditions:</div>
  //               <div className="small text-muted">{eligibilityData.eligible_reward.terms_conditions}</div>
  //             </Col>
  //           </Row>
  //         </div>
  //       )}
  //     </div>
  //   );
  // };

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

      {/* 2. Dashboard Cards Section */}
      {/*<Row className="mt-4">
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
      </Row>*/}


      {/* 2. Dashboard Cards Section */}
      <Row className="mt-4">
        {dashboardData.length > 0 ? (
          dashboardData.map((item, index) => {
            const IconComponent = iconMap[item.icon];

            // Welcome Bonus Card with dynamic dates
            if (item.customContent && item.title === "Welcome Bonus") {
              const { bookingDate, closingDate } = calculateDates();
              const currentDate = new Date();
              let status = "Processing";
              let statusColor = "#ffc107"; // yellow/warning

              if (closingDate && currentDate > closingDate) {
                status = "success";
                statusColor = "#28a745"; // green
              } else if (bookingDate && currentDate > bookingDate) {
                status = "processing";
                statusColor = "#17a2b8"; // teal/blue
              }

              return (
                <Col key={index} xs={12} sm={6} md={4} lg={4}>
                  <div className="card bg_card_design welcome-bonus-card">
                    <div className="card-body">
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <div className="icon_dashboard">
                          <FaGift size={40} className="text-white" />
                        </div>
                        <div className="card-title mb-0">{item.title}</div>
                      </div>

                      {/* Joining + Booking Section */}
                      <div className="date-section mb-3">
                        <div className="date-label">Joining + Booking</div>
                        <div className="date-range">
                          {associateData.registrationDate ? (
                            <>
                              {formatShortDate(new Date(associateData.registrationDate))} - {bookingDate ? formatShortDate(bookingDate) : "-"}
                            </>
                          ) : "-"}
                        </div>
                        <div className="status-badge" style={{ color: statusColor }}>
                          {status}
                        </div>
                      </div>

                      {/* Booking + Closing Section - Static as requested */}
                      <div className="date-section">
                        <div className="date-label">Booking + Closing</div>
                        <div className="date-range">
                          15-04-26 - 14-05-26
                        </div>
                        <div className="status-badge" style={{ color: "#28a745" }}>
                          success
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              );
            }

            // Bima Card - Same style as Welcome Bonus
            // Bima Card - Click to open registration form
            if (item.customContent && item.title === "Bima") {
              const bimaStartDate = "01-04-26";
              const bimaEndDate = "30-04-26";

              const handleBimaClick = () => {
                navigate("/bima-registration-form");
              };

              return (
                <Col key={index} xs={12} sm={6} md={4} lg={4}>
                  <div
                    className="card bg_card_design welcome-bonus-card"
                    style={{ cursor: "pointer" }}
                    onClick={handleBimaClick}
                  >
                    <div className="card-body">
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <div className="icon_dashboard">
                          <TbReceiptRupee size={40} className="text-white" />
                        </div>
                        <div className="card-title mb-0">{item.title}</div>
                      </div>

                      {/* Bima Validity Section */}
                      <div className="date-section mb-3">
                        <div className="date-label">Policy Validity</div>
                        <div className="date-range">
                          {bimaStartDate} - {bimaEndDate}
                        </div>
                        <div className="status-badge" style={{ color: "#28a745" }}>
                          Active
                        </div>
                      </div>

                      {/* Bima Coverage Section */}
                      <div className="date-section">
                        <div className="date-label">Coverage Amount</div>
                        <div className="date-range">
                          ₹5,00,000
                        </div>
                        <div className="status-badge" style={{ color: "#17a2b8" }}>
                          Click to Register
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              );
            }

            // Regular card rendering
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
