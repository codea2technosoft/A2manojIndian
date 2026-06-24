import { useEffect, useState } from "react";
import { FaUserCircle, FaEye } from "react-icons/fa";
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
import { FiLogOut } from "react-icons/fi";
import { Modal } from "react-bootstrap";
import GameRulesModal from "../Layout/GaneRuleModal";

/* ---------- Helper ---------- */
function getValue(obj, key) {
  return obj?.[key] ?? 0;
}

const admin_id = localStorage.getItem("admin_id");
const role = localStorage.getItem("role");

/* ---------- Card Config based on Role ---------- */
const getCardConfigByRole = () => {
  const roleNumber = parseInt(role || "0");
  
  const commonCards = [
    {
      label: "Sport's Details",
      key: "sportsDetails",
      icon: <FaGamepad size={36} className="text-white" />,
      modalLinks: [
        { label: "Active Games", route: "/InplayGames", icon: <FaGamepad size={16} /> },
        { label: "Finish Games", route: "/CompletedGames", icon: <FaCheckCircle size={16} /> },
      ],
    },
    {
      label: "Ledger",
      key: "ledger",
      icon: <FaBook size={36} className="text-white" />,
      modalLinks: [
        { label: "Profit / Loss", route: "/Profit_Loss", icon: <FaChartLine size={16} /> },
        { label: "My Ledger", route: "/My_Ledger", icon: <FaBook size={16} /> },
        { label: "Agent Master", route: "/agent_master_lager", icon: <FaUserTie size={16} /> },
        { label: "Client Master", route: "/Client_Ledger", icon: <FaUsers size={16} /> },
      ],
    },
    {
      label: "Cash Transaction",
      key: "cashTransaction",
      route: "/Superagenttransaction",
      icon: <FaMoneyBillWave size={36} className="text-white" />,
      modalLinks: [
        { label: "Agent Cash", route: "/cash_agent", icon: <FaUserTie size={16} /> },
        { label: "Client Cash", route: "/cash_client", icon: <FaUsers size={16} /> },
      ],
    },
    {
      label: "Settings",
      key: "settings",
      icon: <FaCogs size={36} className="text-white" />,
      route: "/setting",
    },
    {
      label: "Logout",
      key: "logout",
      icon: <FiLogOut size={36} className="text-white" />,
      onClick: null,
    },
  ];

  // Role 2: Show all three cards
  if (roleNumber === 2) {
    return [
      {
        label: "Super Agent",
        key: "total_master",
        icon: <FaUserCircle size={36} className="text-white" />,
        route: "/agent_master",
        modalLinks: [
          { label: "Super Agent", route: "/agent_lists", icon: <FaUserTie size={16} /> },
          { label: "Agent User", route: "/AgentMasternew", icon: <FaUsers size={16} /> },
          { label: "User", route: "/Mastermyuser", icon: <FaUsers size={16} /> },
        ],
      },
      {
        label: "Agent",
        key: "total_super_agent",
        route: "/AgentMasternew",
        icon: <FaUserCircle size={36} className="text-white" />,
        modalLinks: [
          { label: "Agent Master", route: "/agent_master", icon: <FaUserTie size={16} /> },
          { label: "Create Agent", route: "/createagent", icon: <FaUserTie size={16} /> },
          { label: "Deleted Master List", route: "/deleted_master_lists", icon: <FaUsers size={16} /> },
        ],
      },
      {
        label: "User",
        key: "total_agent",
        route: "/Mastermyuser",
        icon: <FaUserTie size={36} className="text-white" />,
        modalLinks: [
          { label: "Agent List", route: "/agents", icon: <FaUserTie size={16} /> },
        ],
      },
      ...commonCards
    ];
  }
  
  // Role 3: Show Agent and User cards
  if (roleNumber === 3) {
    return [
      {
        label: "Agent",
        key: "total_super_agent",
        route: "/AgentMasternew",
        icon: <FaUserCircle size={36} className="text-white" />,
        modalLinks: [
          { label: "Agent Master", route: "/agent_master", icon: <FaUserTie size={16} /> },
          { label: "Create Agent", route: "/createagent", icon: <FaUserTie size={16} /> },
          { label: "Deleted Master List", route: "/deleted_master_lists", icon: <FaUsers size={16} /> },
        ],
      },
      {
        label: "User",
        key: "total_agent",
        route: "/Mastermyuser",
        icon: <FaUserTie size={36} className="text-white" />,
        modalLinks: [
          { label: "Agent List", route: "/agents", icon: <FaUserTie size={16} /> },
        ],
      },
      ...commonCards
    ];
  }
  
  // Role 4: Show only User card
  if (roleNumber === 4) {
    return [
      {
        label: "User",
        key: "total_agent",
        route: "/Mastermyuser",
        icon: <FaUserTie size={36} className="text-white" />,
        modalLinks: [
          { label: "Agent List", route: "/agents", icon: <FaUserTie size={16} /> },
        ],
      },
      ...commonCards
    ];
  }
  
  // Default: Show all cards (for admin/super admin)
  return [
    {
      label: "Super Agent",
      key: "total_master",
      icon: <FaUserCircle size={36} className="text-white" />,
      route: "/agent_master",
      modalLinks: [
        { label: "Super Agent", route: "/agent_lists", icon: <FaUserTie size={16} /> },
        { label: "Agent User", route: "/AgentMasternew", icon: <FaUsers size={16} /> },
        { label: "User", route: "/Mastermyuser", icon: <FaUsers size={16} /> },
      ],
    },
    {
      label: "Agent",
      key: "total_super_agent",
      route: "/AgentMasternew",
      icon: <FaUserCircle size={36} className="text-white" />,
      modalLinks: [
        { label: "Agent Master", route: "/agent_master", icon: <FaUserTie size={16} /> },
        { label: "Create Agent", route: "/createagent", icon: <FaUserTie size={16} /> },
        { label: "Deleted Master List", route: "/deleted_master_lists", icon: <FaUsers size={16} /> },
      ],
    },
    {
      label: "User",
      key: "total_agent",
      route: "/Mastermyuser",
      icon: <FaUserTie size={36} className="text-white" />,
      modalLinks: [
        { label: "Agent List", route: "/agents", icon: <FaUserTie size={16} /> },
      ],
    },
    ...commonCards
  ];
};

/* ---------- Global Modal ---------- */
const GlobalModal = ({ open, title, links, onClose }) => {
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
            <div className="d-flex align-items-center gap-2 linksall_new" key={index}>
              <span className="text-white">{item.icon}</span>
              <Link to={item.route} onClick={onClose}>
                {item.label}
              </Link>
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
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [openRuleModal, setOpenRuleModal] = useState(false);
  const [modalLinks, setModalLinks] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [gamesLoading, setGamesLoading] = useState(false);
  const [games, setGames] = useState([]);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [description, setDescription] = useState("");

  // Pagination State
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 20,
    totalItems: 0,
    totalPages: 1
  });

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

  // Get card config based on role
  const cardConfig = getCardConfigByRole();

  // Logout Handler
  const handleLogout = () => {
    Swal.fire({
      title: 'Logout Confirmation',
      text: 'Are you sure you want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Logout',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        // Clear all storage
        localStorage.clear();
        sessionStorage.clear();

        // Show success message
        Swal.fire({
          title: 'Logged Out!',
          text: 'You have been successfully logged out.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          // Redirect to login page
          navigate("/login");
        });
      }
    });
  };

  // Updated cardConfig with onClick
  const updatedCardConfig = cardConfig.map(card => {
    if (card.key === "logout") {
      return {
        ...card,
        onClick: handleLogout
      };
    }
    return card;
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    const isShown = localStorage.getItem("ruleModalShown");
    if (!isShown) {
      setOpenRuleModal(true);
      localStorage.setItem("ruleModalShown", "true");
    }
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const clientRes = await getDashboardClientList(admin_id);

      if (clientRes?.data?.success) {
        setAdminProfile(clientRes.data.data.admin_details);
        setDashboardData({
          total_master: clientRes.data.data.counts?.total_super_agent || 0,
          total_super_agent: clientRes.data.data.counts?.total_agent || 0,
          total_agent: clientRes.data.data.counts?.total_user || 0,
          total_user: clientRes.data.data.counts?.total_user || 0,
        });
      }
    } catch (err) {
      console.error("Dashboard error:", err);
      showToast("Failed to load dashboard data", "error");
    } finally {
      setLoading(false);
    }
  };

  const infoCards = adminProfile
    ? [
      { title: adminProfile.admin_id, subtitle: `You are ${adminProfile.username}`, icon: <FaUser /> },
      { title: adminProfile.coins, subtitle: "Coins", icon: <FaTrophy /> },
      {
        title: (dashboardData.total_super_agent + dashboardData.total_agent + dashboardData.total_user),
        subtitle: "Total Members",
        icon: <FaUsers />
      },
      { title: `${adminProfile.match_share}%`, subtitle: "My Share", icon: <FaChartBar /> },
      { title: `${adminProfile.company_share}%`, subtitle: "Company Share", icon: <FaChartBar /> },
      { title: `${adminProfile.match_comm}%`, subtitle: "Match Commission", icon: <FaChartBar /> },
      { title: `${adminProfile.session_comm}%`, subtitle: "Session Commission", icon: <FaChartBar /> },
      {
        title: "Rules",
        subtitle: "Game Rules",
        icon: <FaInfoCircle />,
        route: "#",
        isLink: false,
        onClick: () => navigate("/rules")
      },
    ]
    : [];

  // Fetch events with pagination
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
        setGames(response.data.data || []);

        // Update pagination from API response
        if (response.data.pagination) {
          setPagination(prev => ({
            ...prev,
            currentPage: response.data.pagination.page || response.data.pagination.current_page || page,
            itemsPerPage: response.data.pagination.limit || response.data.pagination.per_page || limit,
            totalItems: response.data.pagination.total || response.data.pagination.total_records || 0,
            totalPages: response.data.pagination.totalPages ||
              response.data.pagination.total_pages ||
              Math.ceil((response.data.pagination.total || 0) / (response.data.pagination.limit || limit))
          }));
        } else {
          // Fallback if no pagination data
          setPagination(prev => ({
            ...prev,
            currentPage: page,
            totalItems: response.data.data?.length || 0,
            totalPages: Math.ceil((response.data.data?.length || 0) / limit)
          }));
        }

        setError("");
      } else {
        setError(response.data.message);
        showToast(response.data.message, "error");
      }
    } catch (err) {
      console.error("Error fetching games:", err);
      // setError("Failed to fetch games");
      // showToast("Network error: Failed to fetch games", "error");
    } finally {
      setGamesLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };

  useEffect(() => {
    if (!loading) {
      fetchEvents(1, pagination.itemsPerPage);
    }
  }, [sportId, seriesId, loading]);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const token = localStorage.getItem("token");
        const hmac = localStorage.getItem("hmac");

        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/admin-setting-list`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            // body: JSON.stringify({
            //   id: admin_id,
            // }),
          }
        );

        const result = await res.json();

        if (result?.success && result?.data?.length > 0) {
          setDescription(result.data[0].description);
        }
      } catch (err) {
        console.error("Notice fetch error:", err);
      }
    };

    fetchNotice();
  }, []);

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
    navigate(`/Events/series_idd/${market_id}/event_id/${event_id}`);
  };

  // Pagination handlers
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
    const maxVisiblePages = 5;

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

    if (game.is_completed === 1) return "COMPLETED";
    if (game.status === 0) return "INACTIVE";
    if (game.is_inplay === 1) return "INPLAY";
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
            <p><b>Event ID:</b> {game.event_id}</p>
            <p><b>Market ID:</b> {game.market_id}</p>
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
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h5 className="mt-3">Loading dashboard data...</h5>
      </div>
    );
  }

  return (
    <>
      {/* Toast Notification */}
      {toast.show && (
        <div className={`toast-notification ${toast.type}`}>
          {toast.message}
        </div>
      )}

      <div className="marquee-container">
        <p className="marquee-text">{description}</p>
      </div>

      <div className="row g-3">
        {updatedCardConfig.map((item, index) => (
          <div key={index} className="col-md-3 col-6">
            {item.key === "logout" ? (
              // Logout card doesn't need Link wrapper
              <div
                className="card  shadow-sm primarycolor"
                style={{ cursor: "pointer" }}
                onClick={item.onClick}
              >
                <div className="card-body heightallsdf d-flex align-items-center justify-content-between">
                  <div>
                    <h6 className="mb-1 text-white">{item.label}</h6>
                  </div>
                  {item.icon}
                </div>
              </div>
            ) : (
              // Other cards with Link wrapper
              <Link to={item.route} className="new_link_al">
                <div
                  className="card shadow-sm primarycolor"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    if (item.modalLinks) {
                      setModalLinks(item.modalLinks);
                      setOpenModal(true);
                    }
                  }}
                >
                  <div className="card-body d-flex align-items-center justify-content-between">
                    <div>
                      <h6 className="mb-1 text-white">{item.label}</h6>
                      <h4 className="text-white">{getValue(dashboardData, item.key)}</h4>
                    </div>
                    {item.icon}
                  </div>
                </div>
              </Link>
            )}
          </div>
        ))}
      </div>

      <div className="row g-3 mt-3">
        {infoCards.map((item, index) => (
          <div key={index} className="col-12 col-lg-3">
            <div
              className="text-decoration-none card shadow-sm primarycolor"
              style={{ cursor: item.onClick ? 'pointer' : 'default' }}
              onClick={item.onClick}
            >
              <div className="card-body d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="mb-1 text-white">
                    <small>{item.subtitle}</small>
                  </h6>
                  <h4 className="text-white">{item.title}</h4>
                </div>
                {item.icon && <div className="card-icon text-white">{item.icon}</div>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <GlobalModal
        open={openModal}
        title="User Options"
        links={modalLinks}
        onClose={() => setOpenModal(false)}
      />

      <div className="mt-4 activematch">
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>NAME</th>
                <th>OPEN DATE</th>
                <th>COMPETITION</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {gamesLoading ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    <div className="spinner-border spinner-border-sm" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    Loading matches...
                  </td>
                </tr>
              ) : games.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    No matches found
                  </td>
                </tr>
              ) : (
                games.map((game) => (
                  <tr key={game._id || game.event_id}>
                    <td>{game.name || "-"}</td>
                    <td>{game.date_time}</td>
                    <td>{game.series_name || "-"}</td>
                    <td>
                      <span className={`status-badge ${getStatus(game).toLowerCase()}`}>
                        {getStatus(game)}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={(e) => handleMatchClicknew(game.market_id, game.event_id, e)}
                        title="View Match Details"
                      >
                        <FaEye /> View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Game Details Modal */}
        <GameDetailsModal
          game={detailsOpen ? selectedGame : null}
          onClose={() => setDetailsOpen(false)}
        />

        {/* Rules Modal */}
        <Modal
          show={openRuleModal}
          onHide={() => setOpenRuleModal(false)}
          backdrop="static"
          keyboard={false}
          centered
          size="md"
        >
          <Modal.Header closeButton>
            <Modal.Title className="text-light">Rules & Regulations</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <GameRulesModal />
          </Modal.Body>

          <Modal.Footer>
            <button
              className="btn btn-primary"
              onClick={() => setOpenRuleModal(false)}
            >
              I Agree
            </button>
          </Modal.Footer>
        </Modal>

        {/* Pagination Controls */}
        {pagination.totalPages > 1 && (
          <div className="d-flex justify-content-between align-items-center mt-4">
            <div className="showing-entries">
              Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{" "}
              {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{" "}
              {pagination.totalItems} entries
            </div>

            <div className="pagination-controls d-flex align-items-center gap-2">
              <button
                className="btn btn-sm btn-outline-primary"
                disabled={pagination.currentPage === 1}
                onClick={handlePrevPage}
                title="Previous Page"
              >
                <MdOutlineKeyboardArrowLeft /> Prev
              </button>

              <div className="d-flex gap-1">
                {getPageNumbers().map((page) => (
                  <button
                    key={page}
                    className={`btn btn-sm ${pagination.currentPage === page ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => handlePageClick(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                className="btn btn-sm btn-outline-primary"
                disabled={pagination.currentPage === pagination.totalPages}
                onClick={handleNextPage}
                title="Next Page"
              >
                Next <MdOutlineKeyboardArrowRight />
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .toast-notification {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 12px 20px;
          border-radius: 4px;
          color: white;
          z-index: 9999;
          animation: slideIn 0.3s ease;
        }
        
        .toast-notification.success {
          background-color: #28a745;
        }
        
        .toast-notification.error {
          background-color: #dc3545;
        }
        
        .marquee-container {
          background: #f8f9fa;
          padding: 10px;
          border-radius: 5px;
          margin-bottom: 20px;
          overflow: hidden;
        }
        
        .marquee-text {
          white-space: nowrap;
          animation: marquee 30s linear infinite;
          margin: 0;
          font-weight: 500;
          color: #333;
        }
        
        .status-badge {
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }
        
        .status-badge.inplay {
          background-color: #28a745;
          color: white;
        }
        
        .status-badge.upcoming {
          background-color: #ffc107;
          color: #212529;
        }
        
        .status-badge.completed {
          background-color: #6c757d;
          color: white;
        }
        
        .status-badge.inactive {
          background-color: #dc3545;
          color: white;
        }
        
        .showing-entries {
          font-size: 14px;
          color: #6c757d;
        }
        
        .pagination-controls .btn {
          min-width: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </>
  );
}