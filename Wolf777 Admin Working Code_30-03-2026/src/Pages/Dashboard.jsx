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

/* ---------- Helper ---------- */
function getValue(obj, key) {
  return obj?.[key] ?? 0;
}

const admin_id = localStorage.getItem("admin_id");
console.log("adminid", admin_id)

const cardConfig = [
  // Deposit Cards
  {
    label: "Today Deposit",
    key: "todayDeposit",
    icon: <FaMoneyBillWave size={36} className="text-white" />,
  },

  {
    label: "Total Users Wallet",
    key: "totalUserCredit",
    icon: <FaMoneyBillWave size={36} className="text-white" />,
  },

  {
    label: "Total Deposit",
    key: "totalDeposit",
    icon: <FaMoneyBillWave size={36} className="text-white" />,
  },
  
  // Withdraw Cards
  {
    label: "Today Withdraw",
    key: "todayWithdraw",
    icon: <FaMoneyBillWave size={36} className="text-white" />,
  },
  {
    label: "Total Withdraw",
    key: "totalWithdraw",
    icon: <FaMoneyBillWave size={36} className="text-white" />,
  },
  
  // User Stats Cards - ये नए जोड़े हैं
  {
    label: "Total Users",
    key: "totalUsers",
    route:"/users-list",
    icon: <FaUsersIcon size={36} className="text-white" />,
  },
  {
    label: "Active Users",
    key: "activeUsers",
    route:"/active-users-list",
    icon: <FaUserCheck size={36} className="text-white" />,
  },
  {
    label: "Banned Users",
    key: "bannedUsers",
    route:"/blocked-users-list",
    icon: <FaUserSlash size={36} className="text-white" />,
  },
  
  // Sports Details
  {
    label: "Sport's Details",
    key: "sportsDetails",
    showCount: false,
    icon: <FaGamepad size={36} className="text-white" />,
    modalLinks: [
      { label: "Active Games", route: "/inplay_game", icon: <FaGamepad size={16} /> },
      { label: "Complete Games", route: "/completed_game", icon: <FaCheckCircle size={16} /> },
    ],
  },
  
  // Settings & Logout
  {
    label: "Settings",
    route: "/web-setting",
    key: "settings",
    icon: <FaCogs size={36} className="text-white" />,
  },
  {
    label: "Logout",
    route: "/login",
    key: "logout",
    icon: <FaSignOutAlt size={36} className="text-white" />,
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
      <div className="row g-3">
        {cardConfig.map((item, index) => (
          <div key={index} className="col-md-3 col-6">
            <div
              className="card shadow-sm primarycolor"
              style={{ cursor: "pointer" }}
              onClick={() => {
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
              }}
            >
              <div className="card-body d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="mb-1 text-white">{item.label}</h6>
                  
                  {/* Deposit/Withdraw cards - with ₹ symbol */}
                  {(item.key === "todayDeposit" || 
                    item.key === "totalDeposit" || 
                    item.key === "totalUserCredit" || 
                    item.key === "todayWithdraw" || 
                    item.key === "totalWithdraw") && (
                    <h4 className="text-white mt-2">₹{formatCurrency(counts?.[item.key] ?? 0)}</h4>
                  )}
                  
                  {/* User stats cards - without ₹ symbol */}
                  {(item.key === "totalUsers" || 
                    item.key === "activeUsers" || 
                    item.key === "bannedUsers") && (
                    <h4 className="text-white mt-2">{formatNumber(counts?.[item.key] ?? 0)}</h4>
                  )}
                </div>
                {item.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3 mt-3">
        {infoCards.map((item, index) => {
          const CardWrapper = item.isLink ? Link : "div";
          return (
            <div key={index} className="col-12 col-lg-3">
              <CardWrapper to={item.route} className="text-decoration-none card shadow-sm primarycolor">
                <div className="card-body d-flex align-items-center justify-content-between">
                  <div>
                    <h6 className="mb-1 text-white">
                      {item.subtitle && <small>{item.subtitle}</small>}
                    </h6>
                    <h4 className="text-white">{item.title}</h4>
                  </div>
                  {item.icon && <div className="card-icon text-white">{item.icon}</div>}
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
      
      <div className="mt-2 activematch">
        <div className="title_all">All Active Match</div>
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
      </div>

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