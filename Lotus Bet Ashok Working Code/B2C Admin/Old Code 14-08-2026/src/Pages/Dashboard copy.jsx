import { useEffect, useState } from "react";
import { FaUserCircle, FaEye, FaSignOutAlt } from "react-icons/fa";
import { getDashboardSummary, getAllEvents } from "../Server/api";
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
    key: "todayProfit",
     color:"red",
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
        color:"green",
    icon: <FaMoneyBillWave size={36} className="text-white" />,
  },
  {
    label: "WITHDRAWAL",
    key: "totalWithdraw",
    color:"red",
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
        color:"red",

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
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const sportId = searchParams.get('sportId');
  const seriesId = searchParams.get('seriesId');
  const navigate = useNavigate();

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
            <div key={index} className="mb-3 mb-md-3 mb-lg-3 mb-sm-3 ps-2 ps-xs-0 col-xl-2 col-lg-2 col-md-3 col-6">
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
                <span className="second" style={{color:item.color,fontWeight:"bold"}}>
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
                  <tr>
                    <td>
                      {" "}
                      <a href="/currentBets/689604444200adc80d853266/undefined">1 </a>
                      <a href="#">zabi</a>
                    </td>
                    <td>
                      <strong className="text-danger">( 7,300.00) </strong>
                    </td>
                    <td>12,030.00</td>
                  </tr>
                  <tr>
                    <td>
                      {" "}
                      <a href="/currentBets/6863fab724307bd4f5ce2539/undefined">2 </a>
                      <a href="#">shaik</a>
                    </td>
                    <td>
                      <strong className="text-danger">( 1,910.00) </strong>
                    </td>
                    <td>12,000.00</td>
                  </tr>
                  <tr>
                    <td>
                      {" "}
                      <a href="/currentBets/69d0e17544ab60211f7b66ec/undefined">3 </a>
                      <a href="#">vnd15</a>
                    </td>
                    <td>
                      <strong className="text-danger">( 1,200.00) </strong>
                    </td>
                    <td>5,000.00</td>
                  </tr>
                  <tr>
                    <td>
                      {" "}
                      <a href="/currentBets/69493a922dd426aabb7069f4/undefined">4 </a>
                      <a href="#">rockey1</a>
                    </td>
                    <td>
                      <strong className="text-danger">( 1,000.00) </strong>
                    </td>
                    <td>4,600.00</td>
                  </tr>
                  <tr>
                    <td>
                      {" "}
                      <a href="/currentBets/68b3193e2c0db9d9a5bbe90c/undefined">5 </a>
                      <a href="#">khalilauto</a>
                    </td>
                    <td>
                      <strong className="text-danger">( 1,993.00) </strong>
                    </td>
                    <td>3,700.00</td>
                  </tr>
                </tbody>
              </table>
              <div className="w-100 d-flex justify-content-end align-items-center p-2">
                {" "}
                <Link to="/currentBets-dashboard" className="green-btn p-1 btn btn-primary">
                  View All
                </Link>
              </div>
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
                  <tr>
                    <td>
                      {" "}
                      <a href="/currentBets/689604444200adc80d853266/undefined">1 </a>
                      <a href="#">zabi</a>
                    </td>
                    <td>
                      <strong className="text-danger">( 7,300.00) </strong>
                    </td>
                    <td>12,030.00</td>
                  </tr>
                  <tr>
                    <td>
                      {" "}
                      <a href="/currentBets/6863fab724307bd4f5ce2539/undefined">2 </a>
                      <a href="#">shaik</a>
                    </td>
                    <td>
                      <strong className="text-danger">( 1,910.00) </strong>
                    </td>
                    <td>12,000.00</td>
                  </tr>
                  <tr>
                    <td>
                      {" "}
                      <a href="/currentBets/69d0e17544ab60211f7b66ec/undefined">3 </a>
                      <a href="#">vnd15</a>
                    </td>
                    <td>
                      <strong className="text-danger">( 1,200.00) </strong>
                    </td>
                    <td>5,000.00</td>
                  </tr>
                  <tr>
                    <td>
                      {" "}
                      <a href="/currentBets/69493a922dd426aabb7069f4/undefined">4 </a>
                      <a href="#">rockey1</a>
                    </td>
                    <td>
                      <strong className="text-danger">( 1,000.00) </strong>
                    </td>
                    <td>4,600.00</td>
                  </tr>
                  <tr>
                    <td>
                      {" "}
                      <a href="/currentBets/68b3193e2c0db9d9a5bbe90c/undefined">5 </a>
                      <a href="#">khalilauto</a>
                    </td>
                    <td>
                      <strong className="text-danger">( 1,993.00) </strong>
                    </td>
                    <td>3,700.00</td>
                  </tr>
                </tbody>
              </table>
              <div className="w-100 d-flex justify-content-end align-items-center p-2">
                {" "}
                <button type="button" className="green-btn p-1 btn btn-primary">
                  View All
                </button>
              </div>
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
                <tbody />
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
                      <tr>
                        <td>honn05</td>
                        <td className="text-end" style={{ color: "green" }}>
                          62350
                        </td>
                      </tr>
                      <tr>
                        <td>dundappa</td>
                        <td className="text-end" style={{ color: "green" }}>
                          27000
                        </td>
                      </tr>
                      <tr>
                        <td>shaik</td>
                        <td className="text-end" style={{ color: "green" }}>
                          5880
                        </td>
                      </tr>
                      <tr>
                        <td>raghukagi</td>
                        <td className="text-end" style={{ color: "green" }}>
                          4060
                        </td>
                      </tr>
                      <tr>
                        <td>govindraaj</td>
                        <td className="text-end" style={{ color: "green" }}>
                          2210
                        </td>
                      </tr>
                      <tr>
                        <td>shivu777</td>
                        <td className="text-end" style={{ color: "green" }}>
                          2085
                        </td>
                      </tr>
                      <tr>
                        <td>pranavi</td>
                        <td className="text-end" style={{ color: "green" }}>
                          1510
                        </td>
                      </tr>
                      <tr>
                        <td>ajjayya</td>
                        <td className="text-end" style={{ color: "green" }}>
                          294
                        </td>
                      </tr>
                      <tr>
                        <td>nabi001</td>
                        <td className="text-end" style={{ color: "green" }}>
                          293
                        </td>
                      </tr>
                      <tr>
                        <td>prathap</td>
                        <td className="text-end" style={{ color: "green" }}>
                          253
                        </td>
                      </tr>
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
                      <tr>
                        <td>shachin</td>
                        <td className="text-end" style={{ color: "red" }}>
                          43001
                        </td>
                      </tr>
                      <tr>
                        <td>rani098</td>
                        <td className="text-end" style={{ color: "red" }}>
                          29748
                        </td>
                      </tr>
                      <tr>
                        <td>muttappa001</td>
                        <td className="text-end" style={{ color: "red" }}>
                          25050
                        </td>
                      </tr>
                      <tr>
                        <td>malli01</td>
                        <td className="text-end" style={{ color: "red" }}>
                          17974
                        </td>
                      </tr>
                      <tr>
                        <td>raju1234</td>
                        <td className="text-end" style={{ color: "red" }}>
                          13900
                        </td>
                      </tr>
                      <tr>
                        <td>madhu11</td>
                        <td className="text-end" style={{ color: "red" }}>
                          12050
                        </td>
                      </tr>
                      <tr>
                        <td>diri123</td>
                        <td className="text-end" style={{ color: "red" }}>
                          12000
                        </td>
                      </tr>
                      <tr>
                        <td>tej95</td>
                        <td className="text-end" style={{ color: "red" }}>
                          10560
                        </td>
                      </tr>
                      <tr>
                        <td>sagar01</td>
                        <td className="text-end" style={{ color: "red" }}>
                          9500
                        </td>
                      </tr>
                      <tr>
                        <td>punithkb</td>
                        <td className="text-end" style={{ color: "red" }}>
                          8008
                        </td>
                      </tr>
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
                    <tbody />
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
                      className="p-0 m-0"
                      style={{ textDecoration: "underline", cursor: "pointer" }}
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
                      <tr>
                        <td>1</td>
                        <td>
                          <div className="d-flex justify-content-between align-items-center bg-white">
                            <span className="bg-white text-dark">919945988201</span>
                            <svg
                              stroke="currentColor"
                              fill="currentColor"
                              strokeWidth={0}
                              viewBox="0 0 448 512"
                              height="1em"
                              width="1em"
                              xmlns="http://www.w3.org/2000/svg"
                              style={{ cursor: "pointer" }}
                            >
                              <path d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16l140.1 0L400 115.9V320c0 8.8-7.2 16-16 16zM192 384H384c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1H192c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H256c35.3 0 64-28.7 64-64V416H272v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16H96V128H64z" />
                            </svg>
                          </div>{" "}
                        </td>
                      </tr>
                      <tr>
                        <td>2</td>
                        <td>
                          <div className="d-flex justify-content-between align-items-center bg-white">
                            <span className="bg-white text-dark">919748753402</span>
                            <svg
                              stroke="currentColor"
                              fill="currentColor"
                              strokeWidth={0}
                              viewBox="0 0 448 512"
                              height="1em"
                              width="1em"
                              xmlns="http://www.w3.org/2000/svg"
                              style={{ cursor: "pointer" }}
                            >
                              <path d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16l140.1 0L400 115.9V320c0 8.8-7.2 16-16 16zM192 384H384c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1H192c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H256c35.3 0 64-28.7 64-64V416H272v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16H96V128H64z" />
                            </svg>
                          </div>{" "}
                        </td>
                      </tr>
                      <tr>
                        <td>3</td>
                        <td>
                          <div className="d-flex justify-content-between align-items-center bg-white">
                            <span className="bg-white text-dark">917338447374</span>
                            <svg
                              stroke="currentColor"
                              fill="currentColor"
                              strokeWidth={0}
                              viewBox="0 0 448 512"
                              height="1em"
                              width="1em"
                              xmlns="http://www.w3.org/2000/svg"
                              style={{ cursor: "pointer" }}
                            >
                              <path d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16l140.1 0L400 115.9V320c0 8.8-7.2 16-16 16zM192 384H384c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1H192c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H256c35.3 0 64-28.7 64-64V416H272v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16H96V128H64z" />
                            </svg>
                          </div>{" "}
                        </td>
                      </tr>
                      <tr>
                        <td>4</td>
                        <td>
                          <div className="d-flex justify-content-between align-items-center bg-white">
                            <span className="bg-white text-dark">919591863094</span>
                            <svg
                              stroke="currentColor"
                              fill="currentColor"
                              strokeWidth={0}
                              viewBox="0 0 448 512"
                              height="1em"
                              width="1em"
                              xmlns="http://www.w3.org/2000/svg"
                              style={{ cursor: "pointer" }}
                            >
                              <path d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16l140.1 0L400 115.9V320c0 8.8-7.2 16-16 16zM192 384H384c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1H192c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H256c35.3 0 64-28.7 64-64V416H272v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16H96V128H64z" />
                            </svg>
                          </div>{" "}
                        </td>
                      </tr>
                      <tr>
                        <td>5</td>
                        <td>
                          <div className="d-flex justify-content-between align-items-center bg-white">
                            <span className="bg-white text-dark">919019759787</span>
                            <svg
                              stroke="currentColor"
                              fill="currentColor"
                              strokeWidth={0}
                              viewBox="0 0 448 512"
                              height="1em"
                              width="1em"
                              xmlns="http://www.w3.org/2000/svg"
                              style={{ cursor: "pointer" }}
                            >
                              <path d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16l140.1 0L400 115.9V320c0 8.8-7.2 16-16 16zM192 384H384c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1H192c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H256c35.3 0 64-28.7 64-64V416H272v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16H96V128H64z" />
                            </svg>
                          </div>{" "}
                        </td>
                      </tr>
                      <tr>
                        <td>6</td>
                        <td>
                          <div className="d-flex justify-content-between align-items-center bg-white">
                            <span className="bg-white text-dark">919019662766</span>
                            <svg
                              stroke="currentColor"
                              fill="currentColor"
                              strokeWidth={0}
                              viewBox="0 0 448 512"
                              height="1em"
                              width="1em"
                              xmlns="http://www.w3.org/2000/svg"
                              style={{ cursor: "pointer" }}
                            >
                              <path d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16l140.1 0L400 115.9V320c0 8.8-7.2 16-16 16zM192 384H384c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1H192c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H256c35.3 0 64-28.7 64-64V416H272v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16H96V128H64z" />
                            </svg>
                          </div>{" "}
                        </td>
                      </tr>
                      <tr>
                        <td>7</td>
                        <td>
                          <div className="d-flex justify-content-between align-items-center bg-white">
                            <span className="bg-white text-dark">919925859108</span>
                            <svg
                              stroke="currentColor"
                              fill="currentColor"
                              strokeWidth={0}
                              viewBox="0 0 448 512"
                              height="1em"
                              width="1em"
                              xmlns="http://www.w3.org/2000/svg"
                              style={{ cursor: "pointer" }}
                            >
                              <path d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16l140.1 0L400 115.9V320c0 8.8-7.2 16-16 16zM192 384H384c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1H192c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H256c35.3 0 64-28.7 64-64V416H272v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16H96V128H64z" />
                            </svg>
                          </div>{" "}
                        </td>
                      </tr>
                      <tr>
                        <td>8</td>
                        <td>
                          <div className="d-flex justify-content-between align-items-center bg-white">
                            <span className="bg-white text-dark">917016061069</span>
                            <svg
                              stroke="currentColor"
                              fill="currentColor"
                              strokeWidth={0}
                              viewBox="0 0 448 512"
                              height="1em"
                              width="1em"
                              xmlns="http://www.w3.org/2000/svg"
                              style={{ cursor: "pointer" }}
                            >
                              <path d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16l140.1 0L400 115.9V320c0 8.8-7.2 16-16 16zM192 384H384c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1H192c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H256c35.3 0 64-28.7 64-64V416H272v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16H96V128H64z" />
                            </svg>
                          </div>{" "}
                        </td>
                      </tr>
                      <tr>
                        <td>9</td>
                        <td>
                          <div className="d-flex justify-content-between align-items-center bg-white">
                            <span className="bg-white text-dark">919190196627</span>
                            <svg
                              stroke="currentColor"
                              fill="currentColor"
                              strokeWidth={0}
                              viewBox="0 0 448 512"
                              height="1em"
                              width="1em"
                              xmlns="http://www.w3.org/2000/svg"
                              style={{ cursor: "pointer" }}
                            >
                              <path d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16l140.1 0L400 115.9V320c0 8.8-7.2 16-16 16zM192 384H384c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1H192c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H256c35.3 0 64-28.7 64-64V416H272v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16H96V128H64z" />
                            </svg>
                          </div>{" "}
                        </td>
                      </tr>
                      <tr>
                        <td>10</td>
                        <td>
                          <div className="d-flex justify-content-between align-items-center bg-white">
                            <span className="bg-white text-dark">919989126864</span>
                            <svg
                              stroke="currentColor"
                              fill="currentColor"
                              strokeWidth={0}
                              viewBox="0 0 448 512"
                              height="1em"
                              width="1em"
                              xmlns="http://www.w3.org/2000/svg"
                              style={{ cursor: "pointer" }}
                            >
                              <path d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16l140.1 0L400 115.9V320c0 8.8-7.2 16-16 16zM192 384H384c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1H192c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H256c35.3 0 64-28.7 64-64V416H272v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16H96V128H64z" />
                            </svg>
                          </div>{" "}
                        </td>
                      </tr>
                      <tr>
                        <td>11</td>
                        <td>
                          <div className="d-flex justify-content-between align-items-center bg-white">
                            <span className="bg-white text-dark">919663714310</span>
                            <svg
                              stroke="currentColor"
                              fill="currentColor"
                              strokeWidth={0}
                              viewBox="0 0 448 512"
                              height="1em"
                              width="1em"
                              xmlns="http://www.w3.org/2000/svg"
                              style={{ cursor: "pointer" }}
                            >
                              <path d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16l140.1 0L400 115.9V320c0 8.8-7.2 16-16 16zM192 384H384c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1H192c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H256c35.3 0 64-28.7 64-64V416H272v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16H96V128H64z" />
                            </svg>
                          </div>{" "}
                        </td>
                      </tr>
                      <tr>
                        <td>12</td>
                        <td>
                          <div className="d-flex justify-content-between align-items-center bg-white">
                            <span className="bg-white text-dark">919898989898</span>
                            <svg
                              stroke="currentColor"
                              fill="currentColor"
                              strokeWidth={0}
                              viewBox="0 0 448 512"
                              height="1em"
                              width="1em"
                              xmlns="http://www.w3.org/2000/svg"
                              style={{ cursor: "pointer" }}
                            >
                              <path d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16l140.1 0L400 115.9V320c0 8.8-7.2 16-16 16zM192 384H384c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1H192c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H256c35.3 0 64-28.7 64-64V416H272v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16H96V128H64z" />
                            </svg>
                          </div>{" "}
                        </td>
                      </tr>
                      <tr>
                        <td>13</td>
                        <td>
                          <div className="d-flex justify-content-between align-items-center bg-white">
                            <span className="bg-white text-dark">917022763036</span>
                            <svg
                              stroke="currentColor"
                              fill="currentColor"
                              strokeWidth={0}
                              viewBox="0 0 448 512"
                              height="1em"
                              width="1em"
                              xmlns="http://www.w3.org/2000/svg"
                              style={{ cursor: "pointer" }}
                            >
                              <path d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16l140.1 0L400 115.9V320c0 8.8-7.2 16-16 16zM192 384H384c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1H192c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H256c35.3 0 64-28.7 64-64V416H272v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16H96V128H64z" />
                            </svg>
                          </div>{" "}
                        </td>
                      </tr>
                      <tr>
                        <td>14</td>
                        <td>
                          <div className="d-flex justify-content-between align-items-center bg-white">
                            <span className="bg-white text-dark">919663199592</span>
                            <svg
                              stroke="currentColor"
                              fill="currentColor"
                              strokeWidth={0}
                              viewBox="0 0 448 512"
                              height="1em"
                              width="1em"
                              xmlns="http://www.w3.org/2000/svg"
                              style={{ cursor: "pointer" }}
                            >
                              <path d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16l140.1 0L400 115.9V320c0 8.8-7.2 16-16 16zM192 384H384c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1H192c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H256c35.3 0 64-28.7 64-64V416H272v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16H96V128H64z" />
                            </svg>
                          </div>{" "}
                        </td>
                      </tr>
                      <tr>
                        <td>15</td>
                        <td>
                          <div className="d-flex justify-content-between align-items-center bg-white">
                            <span className="bg-white text-dark">919986969818</span>
                            <svg
                              stroke="currentColor"
                              fill="currentColor"
                              strokeWidth={0}
                              viewBox="0 0 448 512"
                              height="1em"
                              width="1em"
                              xmlns="http://www.w3.org/2000/svg"
                              style={{ cursor: "pointer" }}
                            >
                              <path d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16l140.1 0L400 115.9V320c0 8.8-7.2 16-16 16zM192 384H384c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1H192c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H256c35.3 0 64-28.7 64-64V416H272v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16H96V128H64z" />
                            </svg>
                          </div>{" "}
                        </td>
                      </tr>
                      <tr>
                        <td>16</td>
                        <td>
                          <div className="d-flex justify-content-between align-items-center bg-white">
                            <span className="bg-white text-dark">919071420334</span>
                            <svg
                              stroke="currentColor"
                              fill="currentColor"
                              strokeWidth={0}
                              viewBox="0 0 448 512"
                              height="1em"
                              width="1em"
                              xmlns="http://www.w3.org/2000/svg"
                              style={{ cursor: "pointer" }}
                            >
                              <path d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16l140.1 0L400 115.9V320c0 8.8-7.2 16-16 16zM192 384H384c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1H192c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H256c35.3 0 64-28.7 64-64V416H272v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16H96V128H64z" />
                            </svg>
                          </div>{" "}
                        </td>
                      </tr>
                      <tr>
                        <td>17</td>
                        <td>
                          <div className="d-flex justify-content-between align-items-center bg-white">
                            <span className="bg-white text-dark">919014849985</span>
                            <svg
                              stroke="currentColor"
                              fill="currentColor"
                              strokeWidth={0}
                              viewBox="0 0 448 512"
                              height="1em"
                              width="1em"
                              xmlns="http://www.w3.org/2000/svg"
                              style={{ cursor: "pointer" }}
                            >
                              <path d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16l140.1 0L400 115.9V320c0 8.8-7.2 16-16 16zM192 384H384c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1H192c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H256c35.3 0 64-28.7 64-64V416H272v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16H96V128H64z" />
                            </svg>
                          </div>{" "}
                        </td>
                      </tr>
                      <tr>
                        <td>18</td>
                        <td>
                          <div className="d-flex justify-content-between align-items-center bg-white">
                            <span className="bg-white text-dark">919590392272</span>
                            <svg
                              stroke="currentColor"
                              fill="currentColor"
                              strokeWidth={0}
                              viewBox="0 0 448 512"
                              height="1em"
                              width="1em"
                              xmlns="http://www.w3.org/2000/svg"
                              style={{ cursor: "pointer" }}
                            >
                              <path d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16l140.1 0L400 115.9V320c0 8.8-7.2 16-16 16zM192 384H384c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1H192c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H256c35.3 0 64-28.7 64-64V416H272v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16H96V128H64z" />
                            </svg>
                          </div>{" "}
                        </td>
                      </tr>
                      <tr>
                        <td>19</td>
                        <td>
                          <div className="d-flex justify-content-between align-items-center bg-white">
                            <span className="bg-white text-dark">919014849984</span>
                            <svg
                              stroke="currentColor"
                              fill="currentColor"
                              strokeWidth={0}
                              viewBox="0 0 448 512"
                              height="1em"
                              width="1em"
                              xmlns="http://www.w3.org/2000/svg"
                              style={{ cursor: "pointer" }}
                            >
                              <path d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16l140.1 0L400 115.9V320c0 8.8-7.2 16-16 16zM192 384H384c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1H192c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H256c35.3 0 64-28.7 64-64V416H272v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16H96V128H64z" />
                            </svg>
                          </div>{" "}
                        </td>
                      </tr>
                      <tr>
                        <td>20</td>
                        <td>
                          <div className="d-flex justify-content-between align-items-center bg-white">
                            <span className="bg-white text-dark">919844193331</span>
                            <svg
                              stroke="currentColor"
                              fill="currentColor"
                              strokeWidth={0}
                              viewBox="0 0 448 512"
                              height="1em"
                              width="1em"
                              xmlns="http://www.w3.org/2000/svg"
                              style={{ cursor: "pointer" }}
                            >
                              <path d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16l140.1 0L400 115.9V320c0 8.8-7.2 16-16 16zM192 384H384c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1H192c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H256c35.3 0 64-28.7 64-64V416H272v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16H96V128H64z" />
                            </svg>
                          </div>{" "}
                        </td>
                      </tr>
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
                      className="p-0 m-0"
                      style={{ textDecoration: "underline", cursor: "pointer" }}
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
                      <tr>
                        <td>1</td>
                        <td>
                          <div className="d-flex justify-content-between align-items-center bg-white">
                            <span className="bg-white text-dark">916362856269</span>
                            <svg
                              stroke="currentColor"
                              fill="currentColor"
                              strokeWidth={0}
                              viewBox="0 0 448 512"
                              height="1em"
                              width="1em"
                              xmlns="http://www.w3.org/2000/svg"
                              style={{ cursor: "pointer" }}
                            >
                              <path d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16l140.1 0L400 115.9V320c0 8.8-7.2 16-16 16zM192 384H384c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1H192c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H256c35.3 0 64-28.7 64-64V416H272v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16H96V128H64z" />
                            </svg>
                          </div>{" "}
                        </td>
                      </tr>
                      <tr>
                        <td>2</td>
                        <td>
                          <div className="d-flex justify-content-between align-items-center bg-white">
                            <span className="bg-white text-dark">918618591646</span>
                            <svg
                              stroke="currentColor"
                              fill="currentColor"
                              strokeWidth={0}
                              viewBox="0 0 448 512"
                              height="1em"
                              width="1em"
                              xmlns="http://www.w3.org/2000/svg"
                              style={{ cursor: "pointer" }}
                            >
                              <path d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16l140.1 0L400 115.9V320c0 8.8-7.2 16-16 16zM192 384H384c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1H192c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H256c35.3 0 64-28.7 64-64V416H272v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16H96V128H64z" />
                            </svg>
                          </div>{" "}
                        </td>
                      </tr>
                      <tr>
                        <td>3</td>
                        <td>
                          <div className="d-flex justify-content-between align-items-center bg-white">
                            <span className="bg-white text-dark">919205476460</span>
                            <svg
                              stroke="currentColor"
                              fill="currentColor"
                              strokeWidth={0}
                              viewBox="0 0 448 512"
                              height="1em"
                              width="1em"
                              xmlns="http://www.w3.org/2000/svg"
                              style={{ cursor: "pointer" }}
                            >
                              <path d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16l140.1 0L400 115.9V320c0 8.8-7.2 16-16 16zM192 384H384c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1H192c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H256c35.3 0 64-28.7 64-64V416H272v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16H96V128H64z" />
                            </svg>
                          </div>{" "}
                        </td>
                      </tr>
                      <tr>
                        <td>4</td>
                        <td>
                          <div className="d-flex justify-content-between align-items-center bg-white">
                            <span className="bg-white text-dark">9611414326</span>
                            <svg
                              stroke="currentColor"
                              fill="currentColor"
                              strokeWidth={0}
                              viewBox="0 0 448 512"
                              height="1em"
                              width="1em"
                              xmlns="http://www.w3.org/2000/svg"
                              style={{ cursor: "pointer" }}
                            >
                              <path d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16l140.1 0L400 115.9V320c0 8.8-7.2 16-16 16zM192 384H384c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1H192c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H256c35.3 0 64-28.7 64-64V416H272v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16H96V128H64z" />
                            </svg>
                          </div>{" "}
                        </td>
                      </tr>
                      <tr>
                        <td>5</td>
                        <td>
                          <div className="d-flex justify-content-between align-items-center bg-white">
                            <span className="bg-white text-dark">8722143727</span>
                            <svg
                              stroke="currentColor"
                              fill="currentColor"
                              strokeWidth={0}
                              viewBox="0 0 448 512"
                              height="1em"
                              width="1em"
                              xmlns="http://www.w3.org/2000/svg"
                              style={{ cursor: "pointer" }}
                            >
                              <path d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16l140.1 0L400 115.9V320c0 8.8-7.2 16-16 16zM192 384H384c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1H192c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H256c35.3 0 64-28.7 64-64V416H272v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16H96V128H64z" />
                            </svg>
                          </div>{" "}
                        </td>
                      </tr>
                      <tr>
                        <td>6</td>
                        <td>
                          <div className="d-flex justify-content-between align-items-center bg-white">
                            <span className="bg-white text-dark">7892853923</span>
                            <svg
                              stroke="currentColor"
                              fill="currentColor"
                              strokeWidth={0}
                              viewBox="0 0 448 512"
                              height="1em"
                              width="1em"
                              xmlns="http://www.w3.org/2000/svg"
                              style={{ cursor: "pointer" }}
                            >
                              <path d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16l140.1 0L400 115.9V320c0 8.8-7.2 16-16 16zM192 384H384c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1H192c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H256c35.3 0 64-28.7 64-64V416H272v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16H96V128H64z" />
                            </svg>
                          </div>{" "}
                        </td>
                      </tr>
                      <tr>
                        <td>7</td>
                        <td>
                          <div className="d-flex justify-content-between align-items-center bg-white">
                            <span className="bg-white text-dark">9964429449</span>
                            <svg
                              stroke="currentColor"
                              fill="currentColor"
                              strokeWidth={0}
                              viewBox="0 0 448 512"
                              height="1em"
                              width="1em"
                              xmlns="http://www.w3.org/2000/svg"
                              style={{ cursor: "pointer" }}
                            >
                              <path d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16l140.1 0L400 115.9V320c0 8.8-7.2 16-16 16zM192 384H384c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1H192c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H256c35.3 0 64-28.7 64-64V416H272v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16H96V128H64z" />
                            </svg>
                          </div>{" "}
                        </td>
                      </tr>
                      <tr>
                        <td>8</td>
                        <td>
                          <div className="d-flex justify-content-between align-items-center bg-white">
                            <span className="bg-white text-dark">919902425825</span>
                            <svg
                              stroke="currentColor"
                              fill="currentColor"
                              strokeWidth={0}
                              viewBox="0 0 448 512"
                              height="1em"
                              width="1em"
                              xmlns="http://www.w3.org/2000/svg"
                              style={{ cursor: "pointer" }}
                            >
                              <path d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16l140.1 0L400 115.9V320c0 8.8-7.2 16-16 16zM192 384H384c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1H192c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H256c35.3 0 64-28.7 64-64V416H272v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16H96V128H64z" />
                            </svg>
                          </div>{" "}
                        </td>
                      </tr>
                      <tr>
                        <td>9</td>
                        <td>
                          <div className="d-flex justify-content-between align-items-center bg-white">
                            <span className="bg-white text-dark">917892821154</span>
                            <svg
                              stroke="currentColor"
                              fill="currentColor"
                              strokeWidth={0}
                              viewBox="0 0 448 512"
                              height="1em"
                              width="1em"
                              xmlns="http://www.w3.org/2000/svg"
                              style={{ cursor: "pointer" }}
                            >
                              <path d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16l140.1 0L400 115.9V320c0 8.8-7.2 16-16 16zM192 384H384c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1H192c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H256c35.3 0 64-28.7 64-64V416H272v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16H96V128H64z" />
                            </svg>
                          </div>{" "}
                        </td>
                      </tr>
                      <tr>
                        <td>10</td>
                        <td>
                          <div className="d-flex justify-content-between align-items-center bg-white">
                            <span className="bg-white text-dark">919844338367</span>
                            <svg
                              stroke="currentColor"
                              fill="currentColor"
                              strokeWidth={0}
                              viewBox="0 0 448 512"
                              height="1em"
                              width="1em"
                              xmlns="http://www.w3.org/2000/svg"
                              style={{ cursor: "pointer" }}
                            >
                              <path d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16l140.1 0L400 115.9V320c0 8.8-7.2 16-16 16zM192 384H384c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1H192c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H256c35.3 0 64-28.7 64-64V416H272v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16H96V128H64z" />
                            </svg>
                          </div>{" "}
                        </td>
                      </tr>
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