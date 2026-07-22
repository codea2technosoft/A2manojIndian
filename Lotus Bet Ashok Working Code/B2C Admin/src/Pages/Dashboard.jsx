import { useEffect, useState } from "react";
import { FaUserCircle, FaEye, FaSignOutAlt, FaCopy, FaRegCopy } from "react-icons/fa";
import { getDashboardSummary, getAllEvents, getDashboardPlayerStats, getTopWinningLosingPlayers, getRegistrationStats } from "../Server/api";
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
  FaUserCheck,
  FaUserSlash,
  FaUsers as FaUsersIcon
} from "react-icons/fa";
import Swal from "sweetalert2";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import Heading from "../Layout/Heading";
/* ---------- Helper ---------- */
function getValue(obj, key) {
  return obj?.[key] ?? 0;
}
const admin_id = localStorage.getItem("admin_id");
console.log("adminid", admin_id)


const cardConfig = [
  // Deposit
  {
    label: "P&L",
    key: "totalProfit",
    color: "red",
    icon: <FaMoneyBillWave size={36} className="text-white" />,
  },
  {
    label: "COMMISSION",
    key: "todayProfit",
    icon: <FaMoneyBillWave size={36} className="text-white" />,
  },
  {
    label: "DEPOSIT",
    key: "totalDeposit",
    color: "green",
    icon: <FaMoneyBillWave size={36} className="text-white" />,
  },
  {
    label: "WITHDRAWAL",
    key: "totalWithdraw",
    color: "red",
    icon: <FaMoneyBillWave size={36} className="text-white" />,
  },
  {
    label: "TOTAL BETS",
    key: "todayProfit",
    icon: <FaMoneyBillWave size={36} className="text-white" />,
  },
  {
    label: "SPORTBOOK P&L",
    key: "todayProfit",
    color: "red",

    icon: <FaMoneyBillWave size={36} className="text-white" />,
  },
  // {
  //   label: "Monthly Deposits",
  //   key: "monthlyDeposit",
  //   icon: <FaMoneyBillWave size={36} className="text-white" />,
  // },
  // {
  //   label: "Total Deposits",
  //   key: "totalDeposit",
  //   icon: <FaMoneyBillWave size={36} className="text-white" />,
  // },

  // Withdraw
  // {
  //   label: "Today's Withdrawals",
  //   key: "todayWithdraw",
  //   icon: <FaMoneyBillWave size={36} className="text-white" />,
  // },
  // {
  //   label: "Monthly Withdrawals",
  //   key: "monthlyWithdraw",
  //   icon: <FaMoneyBillWave size={36} className="text-white" />,
  // },
  // {
  //   label: "Total Withdrawals",
  //   key: "totalWithdraw",
  //   icon: <FaMoneyBillWave size={36} className="text-white" />,
  // },

  // Wallet & Profit
  // {
  //   label: "Wallet Balance",
  //   key: "totalUserCredit",
  //   icon: <FaMoneyBillWave size={36} className="text-white" />,
  // },
  // {
  //   label: "Today's Profit",
  //   key: "todayProfit",
  //   icon: <FaMoneyBillWave size={36} className="text-white" />,
  // },
  // {
  //   label: "Monthly Profit",
  //   key: "monthlyProfit",
  //   icon: <FaMoneyBillWave size={36} className="text-white" />,
  // },

  // Users
  // {
  //   label: "Total Users",
  //   key: "totalUsers",
  //   route: "/users-list",
  //   icon: <FaUsersIcon size={36} className="text-white" />,
  // },
  // {
  //   label: "New Users Today",
  //   key: "todayUsers",
  //   icon: <FaUsersIcon size={36} className="text-white" />,
  // },
  // {
  //   label: "New Users This Month",
  //   key: "monthlyUsers",
  //   icon: <FaUsersIcon size={36} className="text-white" />,
  // },
  // {
  //   label: "Active Users",
  //   key: "activeUsers",
  //   route: "/active-users-list",
  //   icon: <FaUserCheck size={36} className="text-white" />,
  // },
  // {
  //   label: "Blocked Users",
  //   key: "bannedUsers",
  //   route: "/blocked-users-list",
  //   icon: <FaUserSlash size={36} className="text-white" />,
  // },
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
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 100,
    totalItems: 0,
    totalPages: 1
  });
  const [pullLoading, setPullLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    is_completed: "",
    is_inplay: ""
  });

  // State for player stats
  const [playerStats, setPlayerStats] = useState({
    topMatchedPlayers: [],
    topExposurePlayers: [],
    userCountByRole: [],
    summary: {},
    agentWiseSummary: []
  });

  const [registrationData, setRegistrationData] = useState({
    pendingRegistrations: [],
    recentRegistrations: [],
    summary: {}
  });


  // State for winning losing players
  const [winningLosingData, setWinningLosingData] = useState({
    topWinningPlayers: [],
    topLosingPlayers: [],
    sportsGameplayDetails: [],
    summary: {}
  });

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const sportId = searchParams.get('sportId');
  const seriesId = searchParams.get('seriesId');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
    fetchDashboardPlayerStats();
    fetchTopWinningLosingPlayers();
    fetchRegistrationStats();  // <-- ye line add karo
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
      { title: adminProfile.admin_id, subtitle: `You are ${adminProfile.role_name}`, icon: <FaUser /> },
      { title: adminProfile.coins, subtitle: "Coins", icon: <FaTrophy /> },
      { title: role2Count, subtitle: "Members", icon: <FaUsers /> },
      { title: `${adminProfile.match_share}%`, subtitle: "My Share", icon: <FaChartBar /> },
      { title: `${adminProfile.company_share}%`, subtitle: "Company Share", icon: <FaChartBar /> },
      { title: `${adminProfile.match_comm}%`, subtitle: "Match Commission" },
      { title: `${adminProfile.session_comm}%`, subtitle: "Session Commission" },
      { title: "Rules", subtitle: "Rules", icon: <FaInfoCircle />, route: "/app/rules", isLink: true },
    ]
    : [];


  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      const toast = document.createElement('div');
      toast.innerHTML = '✅ Copied!';
      toast.success("Copied!");
      toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #fff;
        color: #000;
        padding: 10px 20px;
        border-radius: 5px;
        font-size: 14px;
        z-index: 9999;
        font-weight: semibold;
        transition: opacity 0.3s;
      `;
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
      }, 1500);
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);

      const toast = document.createElement('div');
      toast.innerHTML = '✅ Copied!';
      toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #fff;
        color: #000;
        padding: 10px 20px;
        border-radius: 5px;
        font-size: 14px;
        z-index: 9999;
        font-weight: semibold;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        transition: opacity 0.3s;
      `;
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
      }, 1500);
    });
  };


  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const response = await getDashboardSummary(admin_id);

      if (response?.data?.success) {
        // सीधे data ऑब्जेक्ट को counts में सेट करें
        setCounts(response.data.data);

        // अगर admin_profile और role_2_count अलग API से आते हैं तो
        // उनके लिए अलग सेटअप रखें
        if (response.data.data.admin_profile) {
          setAdminProfile(response.data.data.admin_profile);
        }
        if (response.data.data.role_2_count) {
          setRole2Count(response.data.data.role_2_count);
        }
      }
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch registration stats
  const fetchRegistrationStats = async () => {
    try {
      const params = {
        // admin_id: admin_id || 'all'
      };

      const response = await getRegistrationStats(params);

      if (response?.data?.success) {
        const data = response.data;

        if (data.pending_registrations) {
          setRegistrationData(prev => ({
            ...prev,
            pendingRegistrations: data.pending_registrations.data || []
          }));
        }

        if (data.recent_registrations) {
          setRegistrationData(prev => ({
            ...prev,
            recentRegistrations: data.recent_registrations.data || []
          }));
        }

        if (data.summary) {
          setRegistrationData(prev => ({
            ...prev,
            summary: data.summary
          }));
        }
      }
    } catch (err) {
      console.error("Registration stats error:", err);
    }
  };


  // Fetch dashboard player stats
  const fetchDashboardPlayerStats = async () => {
    try {
      const params = {
        //admin_id: admin_id || 'all',
        // Add date filters if needed
      };

      const response = await getDashboardPlayerStats(params);

      if (response?.data?.success) {
        const data = response.data;

        // Set top matched players
        if (data.top_matched_players) {
          setPlayerStats(prev => ({
            ...prev,
            topMatchedPlayers: data.top_matched_players.data || [],
            topMatchedTitle: data.top_matched_players.title || 'Top 10 Matched Amount Player'
          }));
        }

        // Set top exposure players
        if (data.top_exposure_players) {
          setPlayerStats(prev => ({
            ...prev,
            topExposurePlayers: data.top_exposure_players.data || [],
            topExposureTitle: data.top_exposure_players.title || 'Top 10 Exposure Player'
          }));
        }

        // Set user count by role
        if (data.user_count_by_role) {
          setPlayerStats(prev => ({
            ...prev,
            userCountByRole: data.user_count_by_role.data || [],
            userCountTitle: data.user_count_by_role.title || 'USER COUNT'
          }));
        }

        // Set summary
        if (data.summary) {
          setPlayerStats(prev => ({
            ...prev,
            summary: data.summary
          }));
        }

        // Set agent wise summary
        if (data.agent_wise_summary) {
          setPlayerStats(prev => ({
            ...prev,
            agentWiseSummary: data.agent_wise_summary
          }));
        }
      }
    } catch (err) {
      console.error("Dashboard player stats error:", err);
    }
  };

  // Fetch top winning losing players
  const fetchTopWinningLosingPlayers = async () => {
    try {
      const params = {
        // admin_id: admin_id || 'all'
      };

      const response = await getTopWinningLosingPlayers(params);

      if (response?.data?.success) {
        const data = response.data;

        if (data.top_winning_players) {
          setWinningLosingData(prev => ({
            ...prev,
            topWinningPlayers: data.top_winning_players.data || []
          }));
        }

        if (data.top_losing_players) {
          setWinningLosingData(prev => ({
            ...prev,
            topLosingPlayers: data.top_losing_players.data || []
          }));
        }

        if (data.sports_gameplay_details) {
          setWinningLosingData(prev => ({
            ...prev,
            sportsGameplayDetails: data.sports_gameplay_details.data || []
          }));
        }

        if (data.summary) {
          setWinningLosingData(prev => ({
            ...prev,
            summary: data.summary
          }));
        }
      }
    } catch (err) {
      console.error("Top winning losing players error:", err);
    }
  };

  const fetchEvents = async (page = pagination.currentPage, limit = pagination.itemsPerPage) => {
    try {
      setGamesLoading(true);
      const params = {
        page,
        limit,
        search: filters.search,
        status: 1,
        is_completed: filters.is_completed,
        is_inplay: filters.is_inplay
      };
      const response = await getAllEvents(sportId, seriesId, params);

      if (response.data.success) {
        let list = response.data.data || [];

        list = list.sort((a, b) => {
          const dateA = new Date(a.date_time);
          const dateB = new Date(b.date_time);
          return dateA - dateB;
        });

        setGames(list);

        if (response.data.pagination) {
          setPagination(prev => ({
            ...prev,
            currentPage: response.data.pagination.page || 1,
            itemsPerPage: response.data.pagination.limit || 10,
            totalItems: response.data.pagination.total || 0,
            totalPages: response.data.pagination.totalPages || 1
          }));
        } else {
          setPagination(prev => ({
            ...prev,
            currentPage: page,
            itemsPerPage: limit,
            totalItems: response.data.data?.length || 0,
            totalPages: Math.ceil((response.data.data?.length || 0) / limit)
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
      await fetchDashboardPlayerStats();
      await fetchTopWinningLosingPlayers();
      await fetchRegistrationStats();  // <-- ye line add karo
      await fetchEvents(1, pagination.itemsPerPage);
    } finally {
      setTimeout(() => {
        setPullLoading(false);
      }, 800);
    }
  };

  useEffect(() => {
    fetchEvents(1, pagination.limit);
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
      let start = Math.max(1, pagination.currentPage - Math.floor(maxVisiblePages / 2));
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
            <p><b>Competition:</b> {game.series_name}</p>
            <p><b>Open Date:</b> {formatDate(game.openDate)}</p>
            <p><b>Status:</b> {getStatus(game)}</p>
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

  // Format currency function
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "0";
    return amount.toLocaleString('en-IN');
  };

  // Format number function (for user counts)
  const formatNumber = (num) => {
    if (num === undefined || num === null) return "0";
    return num.toLocaleString('en-IN');
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
      <Heading title="Dashboard" />

      <div className="dashboard-header mb-lg-3">
        <div className="mb-md-0  p-3 row">
          <div className="col-xl-2 col-lg-2 col-md-3 col-sm-6">
            <div className="">
              <span className="date_new_all">From Date :</span>
              <input
                max="2026-07-03"
                type="date"
                className="form-control"
                defaultValue="2026-07-02"
              />
            </div>
          </div>
          <div className="col-xl-2 col-lg-2 col-md-3 col-sm-6">
            <div className="">
              <span className="date_new_all">To Date :</span>
              <input
                max="2026-07-03"
                type="date"
                className="form-control"
                defaultValue="2026-07-03"
              />
            </div>
          </div>
          <div className="d-flex justify-content-start align-items-end col-xl-2 col-lg-2 col-md-3">
            <button
              type="button"
              className="btn theme_dark_btn"
              style={{
                marginRight: 10,
                borderWidth: "medium",
                borderStyle: "none",
                borderColor: "currentcolor",
                borderImage: "none"
              }}
            >
              Submit
            </button>
            <button type="button" className="btn theme_light_btn">
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="mb-lg-3 ">
        <div className="row">
          {cardConfig.map((item, index) => (
            <div key={index} className="mb-3 mb-md-3 mb-lg-3 mb-sm-3 ps-xs-0 col-xl-2 col-lg-2 col-md-3 col-6">
              <div onClick={() => {
                if (item.modalLinks) {
                  setModalLinks(item.modalLinks);
                  setShowModalCount(item.showCount !== false);
                  setModalTitle(item.label);
                  setOpenModal(true);
                } else if (item.route) {
                  if (item.key === "logout") {
                    localStorage.clear();
                    navigate(item.route);
                  } else {
                    navigate(item.route);
                  }
                }
              }} className="dashboard-single">
                <span>{item.label}</span>
                <span className="second" style={{ color: item.color, fontWeight: "bold" }}>
                  {(item.key === "totalUserCredit" ||
                    item.key === "todayDeposit" ||
                    item.key === "totalDeposit" ||
                    item.key === "monthlyDeposit" ||
                    item.key === "todayWithdraw" ||
                    item.key === "monthlyWithdraw" ||
                    item.key === "totalProfit" ||
                    item.key === "monthlyProfit" ||
                    item.key === "todayProfit" ||
                    item.key === "totalWithdraw") && (

                      <>

                        {formatCurrency(counts?.[item.key] ?? 0)}


                        {(item.key === "monthlyProfit" || item.key === "todayProfit") &&
                          (counts?.[item.key] ?? 0) !== 0 && (
                            <small className="">
                              {(counts?.[item.key] ?? 0) < 0
                                ? "User Loss"
                                : "User Profit"}
                            </small>
                          )}
                      </>
                    )}

                  {/* User stats cards - without ₹ symbol */}
                  {(item.key === "totalUsers" ||
                    item.key === "todayUsers" ||
                    item.key === "monthlyUsers" ||
                    item.key === "activeUsers" ||

                    item.key === "bannedUsers") && (
                      <h4 className="">{formatNumber(counts?.[item.key] ?? 0)}</h4>
                    )}
                </span>
              </div>
            </div>
          ))}
          <div className="mb-3 col-xl-4 col-lg-4 col-md-6">
            <div className="dashboard-single">
              <span>Top 10 Matched Amount Player</span>
              <table className="dashboard-single-tabel table">
                <thead>
                  <tr>
                    <th>UID</th>
                    <th>Exposure</th>
                    <th>Matched Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {playerStats.topMatchedPlayers && playerStats.topMatchedPlayers.length > 0 ? (
                    playerStats.topMatchedPlayers.map((player) => (
                      <tr key={player.user_id || player.rank}>
                        <td>
                          {" "}
                          <Link to={`/currentBets-dashboard?admin_id=${player.user_details?.admin_id}`}>
                            {player.rank}
                          </Link>

                          <Link to={`/currentBets-dashboard?admin_id=${player.user_details?.admin_id}`}>
                            {player.uid || player.user_details?.username}
                          </Link>
                        </td>

                        <td>
                          <strong className={player.exposure < 0 ? 'text-danger' : 'text-success'}>
                            {player.exposure < 0 ? `( ${formatCurrency(Math.abs(player.exposure))})` : formatCurrency(player.exposure)}
                          </strong>
                        </td>
                        <td>{formatCurrency(player.matched_amount)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center">No data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mb-3 col-xl-4 col-lg-4 col-md-6">
            <div className="dashboard-single">
              <span>Top 10 Exposure Player</span>
              <table className="dashboard-single-tabel table">
                <thead>
                  <tr>
                    <th>UID</th>
                    <th>Exposure</th>
                    <th>Matched Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {playerStats.topExposurePlayers && playerStats.topExposurePlayers.length > 0 ? (
                    playerStats.topExposurePlayers.map((player) => (
                      <tr key={player.user_id || player.rank}>
                        <td>
                          {" "}
                          <Link to={`/currentBets-dashboard?admin_id=${player.user_details?.admin_id}`}>
                            {player.rank}
                          </Link>

                          <Link to={`/currentBets-dashboard?admin_id=${player.user_details?.admin_id}`}>
                            {player.uid || player.user_details?.username}
                          </Link>
                        </td>

                        <td>
                          <strong className={player.exposure < 0 ? 'text-danger' : 'text-success'}>
                            {player.exposure < 0 ? `( ${formatCurrency(Math.abs(player.exposure))})` : formatCurrency(player.exposure)}
                          </strong>
                        </td>
                        <td>{formatCurrency(player.matched_amount)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center">No data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mb-3 mb-md-3 mb-lg-3 mb-sm-0 col-xl-4 col-lg-4 col-md-6">
            <div className="dashboard-single">
              <span>USER COUNT</span>
              <table className="dashboard-single-tabel table">
                <thead>
                  <tr>
                    <th scope="col">Role</th>
                    <th scope="col" className="text-end">
                      Count
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {playerStats.userCountByRole && playerStats.userCountByRole.length > 0 ? (
                    playerStats.userCountByRole.map((role) => (
                      <tr key={role.role_id || role.role}>
                        <td>{role.role || 'User'}</td>
                        <td className="text-end">{formatNumber(role.count)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="text-center">No data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
          <div className="mb-lg-3 mb-xl-3 mb-md-3 mb-sm-3 mb-xs-0">
            <div className="row">

              <div className="mb-3 mb-md-3 mb-lg-3 mb-sm-0 col-xl-4 col-lg-4 col-md-6">
                <div className="dashboard-single">
                  <span>TOP 10 WINNING PLAYER</span>
                  <table className="dashboard-single-tabel table">
                    <thead>
                      <tr>
                        <th scope="col">Player</th>
                        <th scope="col" className="text-end">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {winningLosingData.topWinningPlayers && winningLosingData.topWinningPlayers.length > 0 ? (
                        winningLosingData.topWinningPlayers.map((player) => (
                          <tr key={player.rank}>
                            <td>
                              {player.player || player.user_details?.username}
                            </td>
                            <td className="text-end" style={{ color: "green" }}>
                              {formatCurrency(player.amount)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="2" className="text-center">No data available</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="mb-3 mb-md-3 mb-lg-3 mb-sm-0 col-xl-4 col-lg-4 col-md-6">
                <div className="dashboard-single">
                  <span>TOP 10 LOSING PLAYER</span>
                  <table className="dashboard-single-tabel table">
                    <thead>
                      <tr>
                        <th scope="col">Player</th>
                        <th scope="col" className="text-end">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {winningLosingData.topLosingPlayers && winningLosingData.topLosingPlayers.length > 0 ? (
                        winningLosingData.topLosingPlayers.map((player) => (
                          <tr key={player.rank}>
                            {/* <td>
                              <a href={`/player-details?admin_id=${player.admin_id || 'USV8180746'}`}>
                                {player.player || player.user_details?.username}
                              </a>
                            </td> */}
                            <td>
                              {player.player || player.user_details?.username}
                            </td>
                            <td className="text-end" style={{ color: "red" }}>
                              {formatCurrency(player.amount)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="2" className="text-center">No data available</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="mb-3 mb-md-3 mb-lg-3 mb-sm-0 col-xl-4 col-lg-4 col-md-6">
                <div className="dashboard-single">
                  <span>SPORTS GAMEPLAY DETAILS</span>
                  <table className="dashboard-single-tabel table">
                    <thead>
                      <tr>
                        <th scope="col">Player</th>
                        <th scope="col" className="text-end">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {winningLosingData.sportsGameplayDetails && winningLosingData.sportsGameplayDetails.length > 0 ? (
                        winningLosingData.sportsGameplayDetails.map((item, index) => (
                          <tr key={index}>
                            <td>{item.bet_type || 'N/A'}</td>
                            <td className="text-end" style={{ color: item.totalAmount >= 0 ? "green" : "red" }}>
                              {formatCurrency(item.totalAmount)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="2" className="text-center">No data available</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-lg-3 mb-xl-3 mb-md-3 mb-sm-3 mb-xs-0 ">
            <div className="row">

              <div className="mt-3 mt-md-3 mt-lg-0 mt-sm-0 col-xl-6 col-lg-6 col-md-6">
                <div className="dashboard-single">
                  <span className="d-flex justify-content-between align-items-center">
                    Pending Registration{" "}
                    <Link
                      to="/registeruser-dashbaord"
                      className="p-0 m-0 text-light"
                    >
                      ...view all
                    </Link>
                  </span>
                  <table className="dashboard-single-tabel table">
                    <thead>
                      <tr>
                        {" "}
                        <th scope="col">Sr No.</th>
                        <th scope="col">Mobile Number</th>
                      </tr>
                    </thead>
                    <tbody>
                      {registrationData.pendingRegistrations && registrationData.pendingRegistrations.length > 0 ? (
                        registrationData.pendingRegistrations.map((item) => (
                          <tr key={item.sr_no}>
                            <td>{item.sr_no}</td>
                            <td>
                              <div className="d-flex justify-content-between align-items-center bg-white">
                                <span className="bg-white text-dark">{item.mobile_number}</span>
                                <FaRegCopy onClick={() => copyToClipboard(item.mobile_number)} title="Copy to clipboard" />
                              </div>{" "}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="2" className="text-center">No pending registrations</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>{" "}
              <div className="mt-3 mt-md-3 mt-lg-0 mt-sm-0 col-xl-6 col-lg-6 col-md-6">
                <div className="dashboard-single">
                  <span className="d-flex justify-content-between align-items-center">
                    Recent Registration{" "}
                    <Link
                      to="/registeredUser/recent"
                      className="p-0 m-0 text-light"
                    >
                      ...view all
                    </Link>
                  </span>
                  <table className="dashboard-single-tabel table">
                    <thead>
                      <tr>
                        {" "}
                        <th scope="col">Sr No.</th>
                        <th scope="col">Mobile Number</th>
                      </tr>
                    </thead>
                    <tbody>
                      {registrationData.recentRegistrations && registrationData.recentRegistrations.length > 0 ? (
                        registrationData.recentRegistrations.map((item) => (
                          <tr key={item.sr_no}>
                            <td>{item.sr_no}</td>
                            <td>
                              <div className="d-flex justify-content-between align-items-center bg-white">
                                <span className="bg-white text-dark">{item.mobile_number}</span>
                                <FaRegCopy onClick={() => copyToClipboard(item.mobile_number)} title="Copy to clipboard" />
                              </div>{" "}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="2" className="text-center">No recent registrations</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>


        </div>
      </div>




      <GlobalModal
        open={openModal}
        showCount={showModalCount}
        title={modalTitle}
        links={modalLinks}
        counts={counts}
        onClose={() => setOpenModal(false)}
      />

      {/* <div className=" activematch card">
        <div className="title_all card-header">All Active Match</div>
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>NAME</th>
                <th>OPEN DATE</th>
                <th>COMPETITION</th>
                <th>STATUS</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {games.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    No matches found
                  </td>
                </tr>
              ) : (
                games.map((game) => (
                  <tr key={game._id}>
                    <td>{game.name}</td>
                    <td>{game.date_time}</td>
                    <td>{game.series_name}</td>
                    <td>
                      <span className={`status-badge ${getStatus(game).toLowerCase()}`}>
                        <span></span>
                        {getStatus(game)}
                      </span>
                    </td>
                    <td>
                      <button
                        className="viewdetailsbutton"
                        onClick={(e) => {
                          handleMatchClicknew(game.market_id, game.event_id, e);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <GameDetailsModal
            game={detailsOpen ? selectedGame : null}
            onClose={() => setDetailsOpen(false)}
          />
        </div>
      </div> */}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-4">
          <div className="sohwingallentries">
            Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{" "}
            {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}
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
    </>
  );
}