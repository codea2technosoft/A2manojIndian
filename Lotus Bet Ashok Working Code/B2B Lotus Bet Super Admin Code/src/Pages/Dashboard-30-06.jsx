import { useEffect, useState } from "react";
import {
  FaUserCircle,
  FaEye,
  FaSignOutAlt,
  FaLockOpen,
  FaLock,
  FaTv,
  FaPlayCircle,
  FaWallet,
  FaArrowDown,
  FaArrowUp,
  FaSyncAlt,
} from "react-icons/fa";
import { getDashboardClientList, getAllEvents } from "../Server/api";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { FaCircleArrowDown, FaCircleArrowUp } from "react-icons/fa6";
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
  1: "#45b7d1", // Football - Blue
  2: "#4ecdc4", // Tennis - Teal
  4: "#ff6b6b", // Cricket - Red
};

// Sport Icons
const SPORT_ICONS = {
  1: football, // Football
  2: tennis, // Tennis
  4: cricket, // Cricket
};

// Sport Order - define the order you want them to appear
const SPORT_ORDER = ["4", "1", "2"]; // Cricket first, then Football, then Tennis

const cardConfig = [
  // {
  //   label: "Admin",
  //   key: "superMaster",
  //   bg: "#6394c9",
  //   showModalCount: true,
  //   icon: <FaUserCircle size={36} />,
  //   modalLinks: [
  //     {
  //       label: "Master",
  //       key: "total_master",
  //       route: "/masters_list",
  //       icon: <FaUserTie size={16} />,
  //     },
  //     {
  //       label: "Super Agent",
  //       key: "total_super_agent",
  //       route: "/agent_lists",
  //       icon: <FaUserTie size={16} />,
  //     },
  //     {
  //       label: "Agent User",
  //       key: "total_agent",
  //       route: "/AgentMasternew",
  //       icon: <FaUsers size={16} />,
  //     },
  //     {
  //       label: "User",
  //       key: "total_user",
  //       route: "/Mastermyuser",
  //       icon: <FaUsers size={16} />,
  //     },
  //   ],
  // },
  // {
  //   bg: "#fa0e0e",
  //   label: "Sport's Details",
  //   key: "sportsDetails",
  //   showCount: false,
  //   icon: <FaGamepad size={36} />,
  //   modalLinks: [
  //     {
  //       label: "Active Games",
  //       route: "/inplay_game",
  //       icon: <FaGamepad size={16} />,
  //     },
  //     {
  //       label: "Complete Games",
  //       route: "/completed_game",
  //       icon: <FaCheckCircle size={16} />,
  //     },
  //   ],
  // },
  // {
  //   bg: "#28a745",
  //   label: "Ledger",
  //   key: "ledger",
  //   showCount: false,
  //   icon: <FaBook size={36} />,
  //   modalLinks: [
  //     {
  //       label: "Profit / Loss",
  //       route: "/profitloss",
  //       icon: <FaChartLine size={16} />,
  //     },
  //     { label: "My Ledger", route: "/my-ledger", icon: <FaBook size={16} /> },
  //     {
  //       label: "Master",
  //       route: "/Master-ledger",
  //       icon: <FaUserTie size={16} />,
  //     },
  //     {
  //       label: "Super Agent",
  //       route: "/super-agent-ledger",
  //       icon: <FaUsers size={16} />,
  //     },
  //     { label: "Agent", route: "/agent-ledger", icon: <FaUserTie size={16} /> },
  //     { label: "User", route: "/agent-ledger", icon: <FaUsers size={16} /> },
  //   ],
  // },
  // {
  //   bg: "#6b00ff",
  //   label: "Cash Transaction",
  //   key: "cashTransaction",
  //   showCount: false,
  //   icon: <FaMoneyBillWave size={36} />,
  //   modalLinks: [
  //     {
  //       label: "Master",
  //       route: "/agent_master-transaction",
  //       icon: <FaUserTie size={16} />,
  //     },
  //     {
  //       label: "Super Agent ",
  //       route: "/Superagenttransaction",
  //       icon: <FaUsers size={16} />,
  //     },
  //     {
  //       label: "Agent ",
  //       route: "/Agenttransaction",
  //       icon: <FaUserTie size={16} />,
  //     },
  //   ],
  // },
  {
    bg: "#6394c9",
    value: "0",
    valueIcon: "",
    label: "Balance",
    route: "/dashboard",
    key: "settings",
    icon: <FaSyncAlt />,
  },
  {
    bg: "#28a745",
    value: "0",
    valueIcon: <FaCircleArrowUp />,
    label: "Upline PL",
    route: "/dashboard",
    key: "logout",
    icon: <FaSyncAlt />,
  },
  {
    bg: "#fa0e0e",
    value: "0",
    valueIcon: <FaCircleArrowDown />,
    label: "Running PL",
    route: "/dashboard",
    key: "logout",
    icon: <FaSyncAlt />,
  },
  {
    bg: "#6b00ff",
    value: "0",
    valueIcon: <FaCircleArrowUp />,
    label: "Lifetime PL",
    route: "/dashboard",
    key: "logout",
    icon: <FaSyncAlt />,
  },
];

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

// Sport Section Component
const SportSection = ({
  sportId,
  sportName,
  games,
  color,
  icon,
  onToggleStatus,
}) => {
  const navigate = useNavigate();
  const [oddsDataMap, setOddsDataMap] = useState({});
  const [updating, setUpdating] = useState(null);

  // setInterval(() => {
  //   fetchOddsData();
  // }, 10000);
  useEffect(() => {
    // Initial fetch
    fetchOddsData();

    // Poll every 10 seconds
    const intervalId = setInterval(() => {
      fetchOddsData();
    }, 10000);

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, [sportId]);

  // Fetch odds data for all events in this sport
  const fetchOddsData = async () => {
    try {
      // Collect all market IDs from games
      const marketIds = games
        .filter((game) => game.market_id)
        .map((game) => game.market_id)
        .join(",");

      if (!marketIds) return;

      const oddsUrl = `https://cricketapinew.shyammatka.co.in/get-match-odds-list?id=${marketIds}&sport_id=${sportId}`;
      console.log("Fetching odds from:", oddsUrl);

      const response = await axios.get(oddsUrl);
      console.log("Odds Response:", response.data);

      if (response.data && Array.isArray(response.data)) {
        const oddsMap = {};
        response.data.forEach((market) => {
          if (market.marketId && market.runners && market.runners.length > 0) {
            const runners = market.runners;
            const oddsData = [];

            // Get first 2 runners for odds
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
    }
  };

  // Fetch odds when component mounts
  useEffect(() => {
    fetchOddsData();
  }, [sportId]);

  // Early return AFTER all hooks are called
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
      console.log("Toggling status for event:", eventId);
      console.log("URL:", url);

      const response = await axios.patch(
        url,
        { eventId: eventId },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: false,
        },
      );

      console.log("Toggle Status Response:", response);

      if (response.data && response.data.success) {
        await Swal.fire({
          icon: "success",
          title: "Success!",
          text: `Event ${action}ed successfully!`,
          timer: 2000,
          showConfirmButton: false,
        });
        // Refresh games list
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
            {games.map((game) => {
              // Get odds for this game's market
              const eventOdds = oddsDataMap[game.market_id] || [];

              // Create 6 boxes: [back1] [lay1] [-] [-] [back2] [lay2]
              const oddsDisplay = [];

              // Box 1: Runner 1 Back
              if (eventOdds.length > 0 && eventOdds[0].back !== null) {
                oddsDisplay.push(eventOdds[0].back);
              } else {
                oddsDisplay.push(null);
              }

              // Box 2: Runner 1 Lay
              if (eventOdds.length > 0 && eventOdds[0].lay !== null) {
                oddsDisplay.push(eventOdds[0].lay);
              } else {
                oddsDisplay.push(null);
              }

              // Box 3: NULL
              oddsDisplay.push(null);

              // Box 4: NULL
              oddsDisplay.push(null);

              // Box 5: Runner 2 Back
              if (eventOdds.length > 1 && eventOdds[1].back !== null) {
                oddsDisplay.push(eventOdds[1].back);
              } else {
                oddsDisplay.push(null);
              }

              // Box 6: Runner 2 Lay
              if (eventOdds.length > 1 && eventOdds[1].lay !== null) {
                oddsDisplay.push(eventOdds[1].lay);
              } else {
                oddsDisplay.push(null);
              }

              // Check if game is locked (status: 0 = locked, 1 = open)
              const isLocked = game.status === 0;

              // Get event ID and series ID
              const eventId = game.event_id;
              const seriesId = game.series_id || null;

              return (
                <tr
                  key={game._id}
                  className=""
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
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </span>
                          ) : isLocked ? (
                            <FaLock
                              className="lockIcon locked"
                              style={{ color: "#ff4a4a" }}
                            />
                          ) : (
                            <FaLockOpen
                              className="lockIcon unlocked"
                              style={{ color: "#6fd96f " }}
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
                        {/* Only show FANCY badge for Cricket (sport_id = "4") */}
                        {sportId === "4" && (
                          <span className="my_badge fancy_badge">FANCY</span>
                        )}
                        <FaTv className="my_badge tv" />
                      </div>
                    </div>
                  </td>
                  <td
                    className="w-100 py-0 box_padding px-0"
                    style={{ padding: "2px" }}
                  >
                    <div className="odds_btns_div">
                      {oddsDisplay.map((value, index) => (
                        <button
                          key={index}
                          className={`odds_btn ${index % 2 === 0 ? "back" : "lay"}`}
                        >
                          {value !== null ? value : "-"}
                        </button>
                      ))}
                    </div>
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

export default function Dashboard() {
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
  const [open, setOpen] = useState(true);
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

  // Filter games - ONLY keep Cricket (4), Football (1), Tennis (2)
  const filteredGames = games.filter((game) => {
    const sportId = game.sport_id?.toString();
    return SPORT_NAMES[sportId]; // Only keep if sport_id is in our mapping
  });

  // Group filtered games by sport_id
  const groupedGames = filteredGames.reduce((acc, game) => {
    const sportId = game.sport_id?.toString() || "unknown";
    if (!acc[sportId]) {
      acc[sportId] = [];
    }
    acc[sportId].push(game);
    return acc;
  }, {});

  // Get sport IDs that have matches, in the order defined by SPORT_ORDER
  const sortedSportIds = SPORT_ORDER.filter(
    (id) => groupedGames[id] && groupedGames[id].length > 0,
  );

  useEffect(() => {
    fetchDashboardData();
  }, []);

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

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const clientRes = await getDashboardClientList(admin_id);
      if (clientRes?.data?.success) {
        setAdminProfile(clientRes.data.data.admin_profile);
        setRole2Count(clientRes.data.data.role_2_count);
        setCounts(clientRes.data.data.counts);
      }
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async (
    page = pagination.currentPage,
    limit = pagination.itemsPerPage,
  ) => {
    try {
      setGamesLoading(true);
      const params = {
        page,
        limit,
        search: filters.search,
        status: 1,
        is_completed: filters.is_completed,
        is_inplay: filters.is_inplay,
      };
      const response = await getAllEvents(sportId, seriesId, params);

      if (response.data.success) {
        let list = response.data.data || [];

        // Sort by date_time (earliest match first)
        list = list.sort((a, b) => {
          const dateA = new Date(a.date_time);
          const dateB = new Date(b.date_time);
          return dateA - dateB;
        });

        setGames(list);

        if (response.data.pagination) {
          setPagination((prev) => ({
            ...prev,
            currentPage: response.data.pagination.page || 1,
            itemsPerPage: response.data.pagination.limit || 10,
            totalItems: response.data.pagination.total || 0,
            totalPages: response.data.pagination.totalPages || 1,
          }));
        } else {
          setPagination((prev) => ({
            ...prev,
            currentPage: page,
            itemsPerPage: limit,
            totalItems: response.data.data?.length || 0,
            totalPages: Math.ceil((response.data.data?.length || 0) / limit),
          }));
        }

        setError("");
      }
    } catch (err) {
      console.error("Error fetching games:", err);
    } finally {
      setGamesLoading(false);
    }
  };

  const triggerPullRefresh = async () => {
    if (pullLoading) return;
    setPullLoading(true);
    try {
      await fetchDashboardData();
      await fetchEvents(1, pagination.itemsPerPage);
    } finally {
      setTimeout(() => {
        setPullLoading(false);
      }, 800);
    }
  };

  useEffect(() => {
    fetchEvents(1, pagination.itemsPerPage);
  }, [sportId, seriesId]);

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const handleMatchClicknew = (market_id, event_id, e) => {
    e.preventDefault();
    localStorage.setItem("event_id", event_id);
    navigate(`/viewmatch-fancy/series_idd/${market_id}/event_id/${event_id}`);
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

  const [activeTab, setActiveTab] = useState(sortedSportIds[0] || null);

  useEffect(() => {
    if (sortedSportIds.length > 0 && !activeTab) {
      setActiveTab(sortedSportIds[0]);
    }
  }, [sortedSportIds]);

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

      <button onClick={() => setOpen(!open)} className="btn btn_collpse w-100">
        {open ? <FaArrowUp /> : <FaArrowDown />}
      </button>

      <div className={`content  ${open ? "open" : ""}`}>
        <div className="row g-2 mt-0">
          {cardConfig.map((item, index) => (
            <div key={index} className="col-md-3 col-6">
              <div
                className="card_dashboard shadow-sm"
                style={{
                  cursor: "pointer",
                  background: `${item.bg}`,
                }}
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
      </div>

      <div className="row g-3 mt-3">
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

      {/* Sport Sections - Only Cricket, Football, Tennis */}

      <div className="card mb-2">
        <div className="card-body p-2">
          <div className="sports-tabs mb-1">
            <ul className="nav nav-tabs">
              {sortedSportIds.map((sportId) => (
                <li className="nav-item" key={sportId}>
                  <button
                    className={`nav-link ${activeTab === sportId ? "active" : ""}`}
                    onClick={() => setActiveTab(sportId)}
                  >
                    {SPORT_NAMES[sportId]}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="all_matches">
            {sortedSportIds.length === 0 ? (
              <div className="text-center p-4">
                <p>No matches found for Cricket, Football, or Tennis</p>
              </div>
            ) : (
              sortedSportIds
                .filter((sportId) => sportId === activeTab)
                .map((sportId) => {
                  const sportName = SPORT_NAMES[sportId];
                  const color = SPORT_COLORS[sportId] || "#6c757d";
                  const sportGames = groupedGames[sportId];

                  return (
                    <SportSection
                      key={sportId}
                      sportId={sportId}
                      sportName={sportName}
                      games={sportGames}
                      color={color}
                      icon={SPORT_ICONS[sportId]}
                      onToggleStatus={() =>
                        fetchEvents(1, pagination.itemsPerPage)
                      }
                    />
                  );
                })
            )}
          </div>

          {/* <div className="all_matches">
            {sortedSportIds.length === 0 ? (
              <div className="text-center p-4">
                <p>No matches found for Cricket, Football, or Tennis</p>
              </div>
            ) : (
              sortedSportIds.map((sportId) => {
                const sportName = SPORT_NAMES[sportId];
                const color = SPORT_COLORS[sportId] || "#6c757d";
                const icon = SPORT_ICONS[sportId] || "🏅";
                const sportGames = groupedGames[sportId];

                return (
                  <SportSection
                    key={sportId}
                    sportId={sportId}
                    sportName={sportName}
                    games={sportGames}
                    color={color}
                    icon={SPORT_ICONS[sportId]}
                    onToggleStatus={() =>
                      fetchEvents(1, pagination.itemsPerPage)
                    }
                  />
                );
              })
            )}
          </div> */}
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
