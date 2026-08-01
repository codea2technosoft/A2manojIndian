import { useEffect, useState, useRef } from "react";
import {
  FaUserCircle,
  FaEye,
  FaSignOutAlt,
  FaLockOpen,
  FaLock,
  FaTv,
  FaPlayCircle,
  FaWallet,
} from "react-icons/fa";
import { getDashboardClientList, getAllEvents } from "../Server/api";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import {
  FaUserTie,
  FaGamepad,
  FaCheckCircle,
  FaChartLine,
  FaBook,
  FaMoneyBillWave,
  FaCogs,
  FaUser,
  FaTrophy,
  FaUsers,
  FaChartBar,
  FaInfoCircle,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import cricket from "../asset/image/cricket.png";
import football from "../asset/image/football.png";
import tennis from "../asset/image/tennis.png";

import Competition from "../asset/image/competition.svg";
import Inplay from "../asset/image/inplay.svg";
import Datewise from "../asset/image/date.svg";
import axios from "axios";

/* ---------- Helper ---------- */
function getValue(obj, key) {
  return obj?.[key] ?? 0;
}

const admin_id = localStorage.getItem("admin_id");
console.log("adminid", admin_id);

// Sport mapping - ONLY THESE 3 SPORTS
const SPORT_NAMES = {
  1: "Football",
  2: "Tennis",
  4: "Cricket",
};

const SPORT_COLORS = {
  1: "#45b7d1",
  2: "#4ecdc4",
  4: "#ff6b6b",
};

const SPORT_ICONS = {
  1: football,
  2: tennis,
  4: cricket,
};

const TABS = [
  { id: "inplay", label: "Inplay", icon: Inplay },
  { id: "competition", label: "Competition Wise", icon: Competition },
  { id: "date", label: "Date Wise", icon: Datewise },
];

const SPORT_ORDER = ["4", "1", "2"];

// ✅ Helper function to get values safely
const getSafeValue = (key, defaultValue = 0) => {
  try {
    const value = localStorage.getItem(key);
    if (value === null || value === undefined || value === "") {
      return defaultValue;
    }
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
  } catch (error) {
    console.error(`Error reading ${key}:`, error);
    return defaultValue;
  }
};

// ✅ Get card config with current values
const getCardConfig = () => {
  const coins = getSafeValue("coins", 0);
  const runningPl = getSafeValue("running_pl", 0);
  const uplinePl = getSafeValue("upline_pl", 0);
  const lifetimePl = getSafeValue("lifetime_pl", 0);

  return [
    {
      label: "Admin",
      key: "superMaster",
      showModalCount: true,
      icon: <FaUserCircle size={36} />,
      modalLinks: [
        {
          label: "Master",
          key: "total_master",
          route: "/masters_list",
          icon: <FaUserTie size={16} />,
        },
        {
          label: "Super Agent",
          key: "total_super_agent",
          route: "/agent_lists",
          icon: <FaUserTie size={16} />,
        },
        {
          label: "Agent User",
          key: "total_agent",
          route: "/AgentMasternew",
          icon: <FaUsers size={16} />,
        },
        {
          label: "User",
          key: "total_user",
          route: "/Mastermyuser",
          icon: <FaUsers size={16} />,
        },
      ],
    },
    {
      label: "Sport's Details",
      key: "sportsDetails",
      showCount: false,
      icon: <FaGamepad size={36} />,
      modalLinks: [
        {
          label: "Active Games",
          route: "/inplay_game",
          icon: <FaGamepad size={16} />,
        },
        {
          label: "Complete Games",
          route: "/completed_game",
          icon: <FaCheckCircle size={16} />,
        },
      ],
    },
    {
      label: "Ledger",
      key: "ledger",
      showCount: false,
      icon: <FaBook size={36} />,
      modalLinks: [
        {
          label: "Profit / Loss",
          route: "/profitloss",
          icon: <FaChartLine size={16} />,
        },
        { label: "My Ledger", route: "/my-ledger", icon: <FaBook size={16} /> },
        {
          label: "Master",
          route: "/Master-ledger",
          icon: <FaUserTie size={16} />,
        },
        {
          label: "Super Agent",
          route: "/super-agent-ledger",
          icon: <FaUsers size={16} />,
        },
        {
          label: "Agent",
          route: "/agent-ledger",
          icon: <FaUserTie size={16} />,
        },
        { label: "User", route: "/agent-ledger", icon: <FaUsers size={16} /> },
      ],
    },
    {
      label: "Cash Transaction",
      key: "cashTransaction",
      showCount: false,
      icon: <FaMoneyBillWave size={36} />,
      modalLinks: [
        {
          label: "Master",
          route: "/agent_master-transaction",
          icon: <FaUserTie size={16} />,
        },
        {
          label: "Super Agent ",
          route: "/Superagenttransaction",
          icon: <FaUsers size={16} />,
        },
        {
          label: "Agent ",
          route: "/Agenttransaction",
          icon: <FaUserTie size={16} />,
        },
      ],
    },
    {
      label: `Balance: ₹${coins.toLocaleString()}`,
      route: "/dashboard",
      key: "balance",
      icon: <FaWallet size={36} />,
    },
    {
      label: `Upline PL: ₹${uplinePl.toLocaleString()}`,
      route: "/dashboard",
      key: "upline",
      icon: <FaChartLine size={36} />,
    },
    {
      label: `Running PL: ₹${runningPl.toLocaleString()}`,
      route: "/dashboard",
      key: "running",
      icon: <FaChartBar size={36} />,
    },
    {
      label: `Lifetime PL: ₹${lifetimePl.toLocaleString()}`,
      route: "/dashboard",
      key: "lifetime",
      icon: <FaTrophy size={36} />,
    },
  ];
};

/* ---------- Global Modal ---------- */
const GlobalModal = ({ open, title, links, counts, onClose, showCount }) => {
  if (!open) return null;

  return (
    <div className="global-modal-overlay">
      <div className="global-modal">
        <div className="d-flex justify-content-between align-items-center modeldesignallfor">
          <h5 className="modal-title">{title}</h5>
          <div className="closebtn" onClick={onClose}>
            <IoClose />
          </div>
        </div>

        <div className="modal-links">
          {links.map((item, index) => (
            <div
              key={index}
              className="d-flex align-items-center justify-content-between linksall_new"
            >
              <div className="d-flex align-items-center gap-2">
                <span className="text-white">{item.icon}</span>
                <Link to={item.route} onClick={onClose}>
                  {item.label}
                </Link>
              </div>

              {showCount && (
                <span className="badge bg-light text-dark">
                  {counts?.[item.key] ?? 0}
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="p-2 d-flex justify-content-end">
          <button className="modal-close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ✅ Sport Section Component
const SportSection = ({
  sportId,
  sportName,
  games,
  color,
  icon,
  onToggleStatus,
  viewType = "inplay",
}) => {
  const navigate = useNavigate();
  const [oddsDataMap, setOddsDataMap] = useState({});
  const [updating, setUpdating] = useState(null);
  const oddsIntervalRef = useRef(null);
  const isOddsFetchingRef = useRef(false);

  // ✅ Odds fetch with polling (10 seconds)
  useEffect(() => {
    if (games && games.length > 0) {
      // Initial fetch
      fetchOddsData();

      // Set interval for 10 seconds
      oddsIntervalRef.current = setInterval(() => {
        fetchOddsData();
      }, 10000);

      return () => {
        if (oddsIntervalRef.current) {
          clearInterval(oddsIntervalRef.current);
          oddsIntervalRef.current = null;
        }
      };
    }
  }, [games, sportId]);

  const fetchOddsData = async () => {
    // ✅ Prevent duplicate odds calls
    if (isOddsFetchingRef.current) {
      console.log("⏳ Odds fetch already in progress, skipping...");
      return;
    }

    try {
      isOddsFetchingRef.current = true;

      let marketIds = [];

      if (viewType === "inplay") {
        marketIds = games
          .filter((game) => game.market_id)
          .map((game) => game.market_id)
          .join(",");
      } else if (viewType === "competition") {
        games.forEach((competition) => {
          competition.events?.forEach((event) => {
            if (event.market_id) {
              marketIds.push(event.market_id);
            }
          });
        });
        marketIds = marketIds.join(",");
      } else if (viewType === "date") {
        games.forEach((dateGroup) => {
          dateGroup.events?.forEach((event) => {
            if (event.market_id) {
              marketIds.push(event.market_id);
            }
          });
        });
        marketIds = marketIds.join(",");
      }

      if (!marketIds) return;

      const oddsUrl = `https://cricketapinew.shyammatka.co.in/get-match-odds-list?id=${marketIds}&sport_id=${sportId}`;
      console.log("Fetching odds from:", oddsUrl);

      const response = await axios.get(oddsUrl);

      if (response.data && Array.isArray(response.data)) {
        const oddsMap = {};
        response.data.forEach((market) => {
          if (market.marketId && market.runners && market.runners.length > 0) {
            const runners = market.runners;
            const oddsData = [];

            runners.forEach((runner, index) => {
              if (runner.ex) {
                const backPrice =
                  runner.ex.availableToBack &&
                  runner.ex.availableToBack.length > 0
                    ? runner.ex.availableToBack[0].price
                    : null;
                const layPrice =
                  runner.ex.availableToLay &&
                  runner.ex.availableToLay.length > 0
                    ? runner.ex.availableToLay[0].price
                    : null;

                oddsData.push({
                  back: backPrice,
                  lay: layPrice,
                });
              }
            });

            oddsMap[market.marketId] = oddsData;
          }
        });
        setOddsDataMap(oddsMap);
      }
    } catch (error) {
      console.error("Error fetching odds data:", error);
    } finally {
      isOddsFetchingRef.current = false;
    }
  };

  if (!games || games.length === 0) return null;

  const handleMatchClick = (eventId, seriesId, e) => {
    e.preventDefault();
    const eventParam = eventId || "null";
    const seriesParam = seriesId || "null";
    localStorage.setItem("event_id", eventId);
    navigate(
      `/viewmatch-fancy/series_idd/${seriesParam}/event_id/${eventParam}`,
    );
  };

  const handleToggleStatus = async (eventId, currentStatus, e) => {
    e.stopPropagation();

    const action = currentStatus === 0 ? "lock" : "unlock";
    const confirmMessage =
      currentStatus === 0
        ? "ARE YOU SURE?\nThis Event Will Be Locked For Down-Line!"
        : "ARE YOU SURE?\nThis Event Will Be Unlocked For Down-Line!";

    const result = await Swal.fire({
      title: "Are you sure?",
      text: confirmMessage,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, do it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setUpdating(eventId);

      const url = `${process.env.REACT_APP_API_URL}/events/${eventId}/toggle-status`;

      const response = await axios.patch(
        url,
        { eventId: eventId },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: false,
        },
      );

      if (response.data && response.data.success) {
        await Swal.fire({
          icon: "success",
          title: "Success!",
          text: `Event ${action}ed successfully!`,
          timer: 2000,
          showConfirmButton: false,
        });
        if (onToggleStatus) {
          onToggleStatus();
        }
      } else {
        const errorMsg = response.data?.message || `Failed to ${action} event`;
        await Swal.fire({
          icon: "error",
          title: "Error!",
          text: errorMsg,
        });
      }
    } catch (err) {
      console.error("Error toggling game status:", err);
      const errorMsg =
        err.response?.data?.message || err.message || "Failed to toggle status";
      await Swal.fire({
        icon: "error",
        title: "Error!",
        text: errorMsg,
      });
    } finally {
      setUpdating(null);
    }
  };

  // ✅ Render single event row
  const renderEventRow = (game, index) => {
    const eventOdds = oddsDataMap[game.market_id] || [];
    const oddsDisplay = [];

    if (eventOdds.length > 0 && eventOdds[0].back !== null) {
      oddsDisplay.push(eventOdds[0].back);
    } else {
      oddsDisplay.push(null);
    }

    if (eventOdds.length > 0 && eventOdds[0].lay !== null) {
      oddsDisplay.push(eventOdds[0].lay);
    } else {
      oddsDisplay.push(null);
    }

    oddsDisplay.push(null);
    oddsDisplay.push(null);

    if (eventOdds.length > 1 && eventOdds[1].back !== null) {
      oddsDisplay.push(eventOdds[1].back);
    } else {
      oddsDisplay.push(null);
    }

    if (eventOdds.length > 1 && eventOdds[1].lay !== null) {
      oddsDisplay.push(eventOdds[1].lay);
    } else {
      oddsDisplay.push(null);
    }

    const isLocked = game.status === 0;
    const eventId = game.event_id || game.id;
    const seriesId = game.series_id || null;

    return (
      <tr
        key={game._id || index}
        style={{ cursor: "pointer" }}
        onClick={(e) => handleMatchClick(eventId, seriesId, e)}
      >
        <td className="event_id w-100">
          <div className="d-flex justify-content-between gap-1">
            <div className="d-flex justify-content-between align-items-center gap-1">
              <div
                onClick={(e) =>
                  handleToggleStatus(game._id, game.status || 0, e)
                }
                style={{ cursor: "pointer" }}
                title={isLocked ? "Click to unlock" : "Click to lock"}
              >
                {updating === game._id ? (
                  <span
                    className="spinner-border spinner-border-sm text-primary"
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </span>
                ) : isLocked ? (
                  <FaLock
                    className="lockIcon locked"
                    style={{ color: "red" }}
                  />
                ) : (
                  <FaLockOpen
                    className="lockIcon unlocked"
                    style={{ color: "green" }}
                  />
                )}
              </div>
              <div>
                <div className="event_name">
                  <FaPlayCircle className="play_btn" />
                  {game.name}
                </div>
                <span className="d-block time">
                  ({game.date_time || "N/A"})
                </span>
              </div>
            </div>
            <div className="other_option">
              <span className="my_badge bm_badge">BM</span>
              {sportId === "4" && (
                <span className="my_badge fancy_badge">FANCY</span>
              )}
              <FaTv className="my_badge tv" />
            </div>
          </div>
        </td>
        <td className="w-100 py-0 box_padding px-0" style={{ padding: "2px" }}>
          <div className="odds_btns_div">
            {oddsDisplay.map((value, idx) => (
              <button
                key={idx}
                className={`odds_btn ${idx % 2 === 0 ? "back" : "lay"}`}
              >
                {value !== null ? value : "-"}
              </button>
            ))}
          </div>
        </td>
      </tr>
    );
  };

  // ✅ Render based on view type
  if (viewType === "inplay") {
    return (
      <div className="sport-section">
        <div className="sport-header">
          <div className="sport sport-icon-wrapper">
            <img className="sportIcon" src={icon} alt={sportName} />
          </div>
          <h3 className="sport-title">{sportName}</h3>
        </div>
        <div className="table-responsive">
          <table className="table table-bordered table-hover mb-0">
            <tbody>
              {games.map((game, index) => renderEventRow(game, index))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (viewType === "competition") {
    return (
      <div className="sport-section">
        <div className="sport-header">
          <div className="sport sport-icon-wrapper">
            <img className="sportIcon" src={icon} alt={sportName} />
          </div>
          <h3 className="sport-title">{sportName}</h3>
        </div>
        {games.map((competition, compIndex) => (
          <div key={compIndex} className="competition-group mb-3">
            <h5
              className="competition-title"
              style={{
                background: "#f8f9fa",
                padding: "8px 15px",
                borderRadius: "5px",
                fontSize: "14px",
                fontWeight: "bold",
                color: "#333",
              }}
            >
              {competition.series_name || "Unknown Competition"}
            </h5>
            <div className="table-responsive">
              <table className="table table-bordered table-hover mb-0">
                <tbody>
                  {competition.events?.map((event, idx) =>
                    renderEventRow(event, idx),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (viewType === "date") {
    return (
      <div className="sport-section">
        <div className="sport-header">
          <div className="sport sport-icon-wrapper">
            <img className="sportIcon" src={icon} alt={sportName} />
          </div>
          <h3 className="sport-title">{sportName}</h3>
        </div>
        {games.map((dateGroup, dateIndex) => (
          <div key={dateIndex} className="date-group mb-3">
            <h5
              className="date-title"
              style={{
                background: "#e9ecef",
                padding: "8px 15px",
                borderRadius: "5px",
                fontSize: "14px",
                fontWeight: "bold",
                color: "#495057",
              }}
            >
              📅 {dateGroup.date || "Unknown Date"}
            </h5>
            <div className="table-responsive">
              <table className="table table-bordered table-hover mb-0">
                <tbody>
                  {dateGroup.events?.map((event, idx) =>
                    renderEventRow(event, idx),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default function Dashboard() {
  // ✅ ALL HOOKS AT TOP LEVEL
  const [dashboardData, setDashboardData] = useState({});
  const [adminProfile, setAdminProfile] = useState(null);
  const [role2Count, setRole2Count] = useState(0);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [modalLinks, setModalLinks] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [gamesLoading, setGamesLoading] = useState(false);
  const [counts, setCounts] = useState({});
  const [showModalCount, setShowModalCount] = useState(true);
  const [modalTitle, setModalTitle] = useState("");
  const [games, setGames] = useState([]);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 100,
    totalItems: 0,
    totalPages: 1,
  });
  const [pullLoading, setPullLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    is_completed: "",
    is_inplay: "",
  });
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const sportId = searchParams.get("sportId");
  const seriesId = searchParams.get("seriesId");
  const navigate = useNavigate();

  // ✅ Refs for preventing duplicate calls
  const isFetchingRef = useRef(false);
  const isMountedRef = useRef(true);
  const pollingIntervalRef = useRef(null);
  const isInitialLoadDone = useRef(false); // ✅ Track initial load

  const [activeTab, setActiveTab] = useState("inplay");

  // ✅ State for API data
  const [apiData, setApiData] = useState({
    inplay: [],
    competition_wise: [],
    date_wise: [],
  });

  const [cardValues, setCardValues] = useState({
    balance: 0,
    running_pl: 0,
    upline_pl: 0,
    lifetime_pl: 0,
  });

  // ✅ Function to update card values
  const updateCardValues = () => {
    const coins = getSafeValue("coins", 0);
    const runningPl = getSafeValue("running_pl", 0);
    const uplinePl = getSafeValue("upline_pl", 0);
    const lifetimePl = getSafeValue("lifetime_pl", 0);

    setCardValues({
      balance: coins,
      running_pl: runningPl,
      upline_pl: uplinePl,
      lifetime_pl: lifetimePl,
    });
  };

  // ✅ 1. Storage change listener
  useEffect(() => {
    updateCardValues();
    const handleStorageChange = () => updateCardValues();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // ✅ 2. Initial load + Polling (combined)
  useEffect(() => {
    isMountedRef.current = true;

    // ✅ Function to load data (with duplicate prevention)
    const loadAllData = async () => {
      // ✅ Prevent duplicate concurrent calls
      if (isFetchingRef.current) {
        console.log("⏳ Load already in progress, skipping...");
        return;
      }

      try {
        isFetchingRef.current = true;

        console.log("📡 Loading data...", {
          sportId,
          seriesId,
          activeTab,
          isInitial: !isInitialLoadDone.current,
          timestamp: new Date().toISOString(),
        });

        // Load dashboard and events in parallel
        const [dashboardRes, eventsRes] = await Promise.all([
          getDashboardClientList(admin_id),
          getAllEvents(sportId, seriesId, {
            page: pagination.currentPage,
            limit: pagination.itemsPerPage,
            search: filters.search,
            status: 1,
            is_completed: filters.is_completed,
            is_inplay: filters.is_inplay,
          }),
        ]);

        if (!isMountedRef.current) return;

        // ✅ Process dashboard data
        if (dashboardRes?.data?.success) {
          const storedCoins = getSafeValue("coins", 0);
          const storedRunningPl = getSafeValue("running_pl", 0);
          const storedUplinePl = getSafeValue("upline_pl", 0);
          const storedLifetimePl = getSafeValue("lifetime_pl", 0);

          const adminProfileData = dashboardRes.data.data.admin_profile || {};
          adminProfileData.coins = storedCoins;
          adminProfileData.running_pl = storedRunningPl;
          adminProfileData.upline_pl = storedUplinePl;
          adminProfileData.lifetime_pl = storedLifetimePl;

          setAdminProfile(adminProfileData);
          setRole2Count(dashboardRes.data.data.role_2_count);
          setCounts(dashboardRes.data.data.counts);
          updateCardValues();
        }

        // ✅ Process events data
        if (eventsRes?.data?.success) {
          const data = eventsRes.data.data;

          setApiData({
            inplay: data.inplay || [],
            competition_wise: data.competition_wise || [],
            date_wise: data.date_wise || [],
          });

          if (eventsRes.data.pagination) {
            setPagination((prev) => ({
              ...prev,
              currentPage: eventsRes.data.pagination.page || 1,
              itemsPerPage: eventsRes.data.pagination.limit || 10,
              totalItems: eventsRes.data.pagination.total || 0,
              totalPages: eventsRes.data.pagination.totalPages || 1,
            }));
          }

          setError("");
        }

        // ✅ Mark initial load as done
        isInitialLoadDone.current = true;
        console.log("✅ Data loaded successfully", {
          timestamp: new Date().toISOString(),
        });
      } catch (err) {
        console.error("Error loading data:", err);
        setError(err.message || "Failed to load data");
      } finally {
        if (isMountedRef.current) {
          isFetchingRef.current = false;
          setLoading(false);
          setGamesLoading(false);
        }
      }
    };

    // ✅ Initial load - ONLY ONCE
    if (!isInitialLoadDone.current) {
      loadAllData();
    }

    // ✅ Start polling every 10 seconds (only after initial load)
    pollingIntervalRef.current = setInterval(() => {
      if (!isFetchingRef.current && isInitialLoadDone.current) {
        console.log("🔄 Polling API every 10 seconds...");
        loadAllData();
      } else if (isFetchingRef.current) {
        console.log("⏳ Skipping poll - API call already in progress");
      }
    }, 10000);

    // ✅ Cleanup on unmount
    return () => {
      isMountedRef.current = false;
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [sportId, seriesId, activeTab]); // ✅ Dependencies

  // ✅ 3. Pull to refresh
  useEffect(() => {
    let startY = 0;

    const handleTouchStart = (e) => {
      if (window.scrollY === 0) {
        startY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e) => {
      const currentY = e.touches[0].clientY;
      if (window.scrollY === 0 && currentY - startY > 80) {
        triggerPullRefresh();
      }
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  // ✅ Function to manually refresh data
  const refreshData = async () => {
    if (isFetchingRef.current) return;

    // Reset initial load flag so it loads fresh
    isInitialLoadDone.current = false;
    setLoading(true);

    // Trigger load
    const loadAllData = async () => {
      try {
        isFetchingRef.current = true;

        const [dashboardRes, eventsRes] = await Promise.all([
          getDashboardClientList(admin_id),
          getAllEvents(sportId, seriesId, {
            page: pagination.currentPage,
            limit: pagination.itemsPerPage,
            search: filters.search,
            status: 1,
            is_completed: filters.is_completed,
            is_inplay: filters.is_inplay,
          }),
        ]);

        if (!isMountedRef.current) return;

        if (dashboardRes?.data?.success) {
          const storedCoins = getSafeValue("coins", 0);
          const storedRunningPl = getSafeValue("running_pl", 0);
          const storedUplinePl = getSafeValue("upline_pl", 0);
          const storedLifetimePl = getSafeValue("lifetime_pl", 0);

          const adminProfileData = dashboardRes.data.data.admin_profile || {};
          adminProfileData.coins = storedCoins;
          adminProfileData.running_pl = storedRunningPl;
          adminProfileData.upline_pl = storedUplinePl;
          adminProfileData.lifetime_pl = storedLifetimePl;

          setAdminProfile(adminProfileData);
          setRole2Count(dashboardRes.data.data.role_2_count);
          setCounts(dashboardRes.data.data.counts);
          updateCardValues();
        }

        if (eventsRes?.data?.success) {
          const data = eventsRes.data.data;
          setApiData({
            inplay: data.inplay || [],
            competition_wise: data.competition_wise || [],
            date_wise: data.date_wise || [],
          });
        }

        isInitialLoadDone.current = true;
      } catch (err) {
        console.error("Error refreshing data:", err);
      } finally {
        if (isMountedRef.current) {
          isFetchingRef.current = false;
          setLoading(false);
          setGamesLoading(false);
        }
      }
    };

    await loadAllData();
  };

  // ✅ Modified fetchEvents - uses refreshData
  const fetchEvents = async (page = 1, limit = pagination.itemsPerPage) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
    await refreshData();
  };

  // ✅ Modified fetchDashboardData
  const fetchDashboardData = async () => {
    await refreshData();
  };

  // ✅ Modified triggerPullRefresh
  const triggerPullRefresh = async () => {
    if (pullLoading || isFetchingRef.current) return;
    setPullLoading(true);
    try {
      await refreshData();
    } finally {
      setTimeout(() => {
        setPullLoading(false);
      }, 800);
    }
  };

  const infoCards = adminProfile
    ? [
        {
          title: adminProfile.admin_id,
          subtitle: `You are ${adminProfile.role_name}`,
          icon: <FaUser />,
        },
        { title: adminProfile.coins, subtitle: "Coins", icon: <FaTrophy /> },
        { title: role2Count, subtitle: "Members", icon: <FaUsers /> },
        {
          title: `${adminProfile.match_share}%`,
          subtitle: "My Share",
          icon: <FaChartBar />,
        },
        {
          title: `${adminProfile.company_share}%`,
          subtitle: "Company Share",
          icon: <FaChartBar />,
        },
        { title: `${adminProfile.match_comm}%`, subtitle: "Match Commission" },
        {
          title: `${adminProfile.session_comm}%`,
          subtitle: "Session Commission",
        },
        {
          title: "Rules",
          subtitle: "Rules",
          icon: <FaInfoCircle />,
          route: "/app/rules",
          isLink: true,
        },
      ]
    : [];

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const handleNextPage = () => {
    if (pagination.currentPage < pagination.totalPages) {
      const nextPage = pagination.currentPage + 1;
      fetchEvents(nextPage, pagination.itemsPerPage);
    }
  };

  const handlePrevPage = () => {
    if (pagination.currentPage > 1) {
      const prevPage = pagination.currentPage - 1;
      fetchEvents(prevPage, pagination.itemsPerPage);
    }
  };

  const handlePageClick = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchEvents(page, pagination.itemsPerPage);
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 2;
    if (pagination.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= pagination.totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let start = Math.max(
        1,
        pagination.currentPage - Math.floor(maxVisiblePages / 2),
      );
      let end = Math.min(pagination.totalPages, start + maxVisiblePages - 1);

      if (end - start + 1 < maxVisiblePages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }

      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
    }
    return pageNumbers;
  };

  const getStatus = (game) => {
    const now = new Date();
    const openDateObj = new Date(game.openDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (game.status === 0) return "INACTIVE";
    if (game.is_inplay === 1) return "INPLAY";

    const gameDate = new Date(game.openDate);
    gameDate.setHours(0, 0, 0, 0);
    if (gameDate.getTime() === today.getTime()) {
      return "INPLAY";
    }

    if (now < openDateObj) return "UPCOMING";
    if (now >= openDateObj) return "INPLAY";

    return "UPCOMING";
  };

  const GameDetailsModal = ({ game, onClose }) => {
    if (!game) return null;

    return (
      <div className="global-modal-overlay">
        <div className="global-modal">
          <div className="d-flex justify-content-between align-items-center modeldesignallfor">
            <h5 className="modal-title">{game.name}</h5>
            <div className="closebtn" onClick={onClose}>
              <IoClose />
            </div>
          </div>
          <div className="modal-links">
            <p>
              <b>Competition:</b> {game.series_name}
            </p>
            <p>
              <b>Open Date:</b> {formatDate(game.openDate)}
            </p>
            <p>
              <b>Status:</b> {getStatus(game)}
            </p>
          </div>

          <div className="p-2 d-flex justify-content-end">
            <button className="modal-close-btn" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ✅ Get data for rendering
  const cardConfig = getCardConfig();

  // ✅ Get current view data based on active tab
  const getCurrentViewData = () => {
    if (activeTab === "inplay") {
      return {
        type: "inplay",
        data: apiData.inplay || [],
      };
    } else if (activeTab === "competition") {
      return {
        type: "competition",
        data: apiData.competition_wise || [],
      };
    } else if (activeTab === "date") {
      return {
        type: "date",
        data: apiData.date_wise || [],
      };
    }
    return { type: "inplay", data: [] };
  };

  const currentView = getCurrentViewData();

  // ✅ Group data by sport for current view
  const getGroupedDataForView = () => {
    const data = currentView.data;
    const type = currentView.type;

    if (type === "inplay") {
      const grouped = {};
      data.forEach((event) => {
        const sportId = event.sport_id?.toString() || "unknown";
        if (!grouped[sportId]) grouped[sportId] = [];
        grouped[sportId].push(event);
      });
      return grouped;
    } else if (type === "competition") {
      const grouped = {};
      data.forEach((sport) => {
        const sportId = sport.sport_id?.toString() || "unknown";
        if (!grouped[sportId]) grouped[sportId] = [];
        sport.competitions?.forEach((comp) => {
          grouped[sportId].push({
            ...comp,
            sport_id: sportId,
            sport_name: sport.sport_name,
          });
        });
      });
      return grouped;
    } else if (type === "date") {
      const grouped = {};
      data.forEach((sport) => {
        const sportId = sport.sport_id?.toString() || "unknown";
        if (!grouped[sportId]) grouped[sportId] = [];
        sport.dates?.forEach((dateGroup) => {
          grouped[sportId].push({
            ...dateGroup,
            sport_id: sportId,
            sport_name: sport.sport_name,
          });
        });
      });
      return grouped;
    }
    return {};
  };

  const groupedData = getGroupedDataForView();

  // ✅ Get all sport IDs that have data
  const allSportIds = Object.keys(groupedData).filter(
    (id) => groupedData[id] && groupedData[id].length > 0,
  );

  // ✅ Sort sport IDs in order: Cricket (4), Football (1), Tennis (2)
  const sortedSportIds = SPORT_ORDER.filter((id) => allSportIds.includes(id));

  // ✅ If loading, show loader
  if (loading) {
    return (
      <div className="text-center mt-5">
        <h5>Loading dashboard data...</h5>
      </div>
    );
  }

  return (
    <>
      {pullLoading && (
        <div className="pull-loader">
          <span className="spinner"></span>
          <small>Refreshing...</small>
        </div>
      )}

      <div className="row g-3">
        {cardConfig.map((item, index) => (
          <div key={index} className="col-md-3 col-6">
            <div
              className="card_dashboard shadow-sm"
              style={{ cursor: "pointer" }}
              onClick={() => {
                if (item.modalLinks) {
                  setModalLinks(item.modalLinks);
                  setShowModalCount(item.showCount !== false);
                  setModalTitle(item.label);
                  setOpenModal(true);
                } else if (item.route) {
                  navigate(item.route);
                }
              }}
            >
              <div className="card-body d-flex align-items-center justify-content-between">
               <div>
                    <div className="d-flex align-items-center gap-3 mb-2">
                      <h5>{item.value}</h5>
                      <h6 className="d-flex">{item.valueIcon}</h6>
                    </div>
                    <h6 className="mb-1">{item.label}</h6>
                  </div>
               <div className="card-icon"> {item.icon}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3 mt-5">
        {infoCards.map((item, index) => {
          const CardWrapper = item.isLink ? Link : "div";
          return (
            <div key={index} className="col-12 col-lg-3">
              <CardWrapper
                to={item.route}
                className="text-decoration-none card shadow-sm primarycolor"
              >
                <div className="card-body d-flex align-items-center justify-content-between">
                  <div>
                    <h6 className="mb-1">
                      {item.subtitle && <small>{item.subtitle}</small>}
                    </h6>
                    <h4>{item.title}</h4>
                  </div>
                  {item.icon && <div className="card-icon">{item.icon}</div>}
                </div>
              </CardWrapper>
            </div>
          );
        })}
      </div>

      <GlobalModal
        open={openModal}
        showCount={showModalCount}
        title={modalTitle}
        links={modalLinks}
        counts={counts}
        onClose={() => setOpenModal(false)}
      />

      <div className="card mb-2">
        <div className="card-body p-2">
          <div className="sports-tabs">
            <ul className="nav nav-tabs">
              {TABS.map((tab) => (
                <li className="nav-item" key={tab.id}>
                  <button
                    className={`nav-link ${activeTab === tab.id ? "active" : ""}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <img
                      src={tab.icon}
                      alt={tab.label}
                      width={18}
                      height={18}
                      className="me-2"
                    />
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="all_matches">
            {gamesLoading ? (
              <div className="text-center p-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading matches...</p>
              </div>
            ) : sortedSportIds.length === 0 ? (
              <div className="text-center p-4">
                <p>No matches found</p>
              </div>
            ) : (
              sortedSportIds.map((sportId) => {
                const sportName = SPORT_NAMES[sportId];
                const color = SPORT_COLORS[sportId] || "#6c757d";
                const sportGames = groupedData[sportId] || [];

                return (
                  <SportSection
                    key={sportId}
                    sportId={sportId}
                    sportName={sportName}
                    games={sportGames}
                    color={color}
                    icon={SPORT_ICONS[sportId]}
                    viewType={currentView.type}
                    onToggleStatus={() =>
                      fetchEvents(
                        pagination.currentPage,
                        pagination.itemsPerPage,
                      )
                    }
                  />
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-4">
          <div className="sohwingallentries">
            Showing {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}{" "}
            to{" "}
            {Math.min(
              pagination.currentPage * pagination.itemsPerPage,
              pagination.totalItems,
            )}
          </div>

          <div className="paginationall d-flex align-items-center gap-1">
            <button
              disabled={pagination.currentPage === 1}
              onClick={handlePrevPage}
              className=""
              title="Previous Page"
            >
              <MdOutlineKeyboardArrowLeft />
            </button>

            <div className="d-flex gap-1">
              {getPageNumbers().map((page) => (
                <div
                  key={page}
                  className={`paginationnumber ${pagination.currentPage === page ? "active" : ""}`}
                  onClick={() => handlePageClick(page)}
                >
                  {page}
                </div>
              ))}
            </div>

            <button
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={handleNextPage}
              className=""
              title="Next Page"
            >
              <MdOutlineKeyboardArrowRight />
            </button>
          </div>
        </div>
      )}

      <GameDetailsModal
        game={detailsOpen ? selectedGame : null}
        onClose={() => setDetailsOpen(false)}
      />
    </>
  );
}
