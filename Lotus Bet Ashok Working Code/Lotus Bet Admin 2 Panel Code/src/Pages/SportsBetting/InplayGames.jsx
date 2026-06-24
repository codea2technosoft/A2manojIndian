import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { FiMoreVertical } from "react-icons/fi";
import { getAllEvents } from "../../Server/api";
import { useNavigate, useLocation } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { Card, CardBody, CardHeader } from "react-bootstrap";

export default function Dashboard() {
  const [gamesLoading, setGamesLoading] = useState(false);
  const [games, setGames] = useState([]);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 1,
  });
  const [filters, setFilters] = useState({
    search: "",
    is_completed: "",
    is_inplay: "",
    status: "",
  });
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [isResetting, setIsResetting] = useState(false);
  
  // State for dropdown
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const sportId = searchParams.get("sportId");
  const seriesId = searchParams.get("seriesId");
  const navigate = useNavigate();

  // Dropdown handler functions
  const toggleActionDropdown = (gameId) => {
    setDropdownOpen(dropdownOpen === gameId ? null : gameId);
  };

  // const handleMatchSessionall = (game) => {
  //   console.log("Session PL clicked for:", game);
  //   alert(`Session PL  ${game.name}`);
  //   setDropdownOpen(null);
  // };
    const handleMatchSessionall = (agent) => {
    navigate(`/Getsession/${agent.event_id}`);
  };
    const handleMatchBet = (agent) => {
    navigate(`/Matchbetspending/${agent.event_id}`);
  };

  // const handleMatchBet = (game) => {
  //   console.log("Match Bet clicked for:", game);
  //   // Add your logic here for METCH BET
  //   alert(`Match Bet for ${game.name}`);
  //   setDropdownOpen(null);
  // };

  const handleSessionBet = (game) => {
    console.log("Session Bet clicked for:", game);
    // Add your logic here for SESSION BET
    
    alert(`Session Bet for ${game.name}`);
    setDropdownOpen(null);
  };

  const handleCancelHistory = (game) => {
    console.log("Cancel History clicked for:", game);
    // Add your logic here for Cancel History
        navigate(`/Cancelhistory/${game.event_id}`);

    // alert(`Cancel History for ${game.name}`);
    // setDropdownOpen(null);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown')) {
        setDropdownOpen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchEvents = async (page = pagination.currentPage, limit = pagination.itemsPerPage) => {
    try {
      setGamesLoading(true);
      const params = {
        page,
        limit,
        search: filters.search,
        status: filters.status || undefined,
        is_completed: filters.is_completed,
        is_inplay: filters.is_inplay
      };

      // Remove undefined or empty values from params
      Object.keys(params).forEach(key => {
        if (params[key] === undefined || params[key] === "") {
          delete params[key];
        }
      });

      const response = await getAllEvents(sportId, seriesId, params);

      if (response.data.success) {
        setGames(response.data.data || []);

        if (response.data.pagination) {
          setPagination(prev => ({
            ...prev,
            currentPage: response.data.pagination.current_page || response.data.pagination.page || 1,
            itemsPerPage: response.data.pagination.limit || limit,
            totalItems: response.data.pagination.total_records || response.data.pagination.total || 0,
            totalPages: response.data.pagination.total_pages ||
              Math.ceil((response.data.pagination.total_records || 0) / (response.data.pagination.limit || limit))
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
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error("Error fetching games:", err);
      setError("Failed to fetch games");
    } finally {
      setGamesLoading(false);
      setIsResetting(false);
    }
  };

  useEffect(() => {
    fetchEvents(1, pagination.itemsPerPage);
  }, [sportId, seriesId]);

  const formatDate = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    const hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;

    return `${day}/${month}/${year} ${formattedHours}:${minutes} ${ampm}`;
  };

  const handleMatchClicknew = (market_id, event_id, e) => {
    e.preventDefault();
    localStorage.setItem("event_id", event_id);
    navigate(`/Events/series_idd/${market_id}/event_id/${event_id}`);
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

    // First check completion status
    if (game.is_completed === 1) return "COMPLETED";
    
    // Check if event is inactive
    if (game.status === 0) return "INACTIVE";
    
    // Check if event is inplay
    if (game.is_inplay === 1) return "INPLAY";
    
    // Check open_status (from your API response)
    if (game.open_status === 1) {
      // If open_status is 1, check if it's past the open date
      if (now >= openDateObj) return "INPLAY";
      return "UPCOMING";
    }
    
    // Fallback logic
    if (now >= openDateObj) return "INPLAY";
    return "UPCOMING";
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApplyFilters = () => {
    fetchEvents(1, pagination.itemsPerPage);
  };

  const handleResetFilters = async () => {
    // Disable the button immediately
    setIsResetting(true);
    
    // Reset filters first
    const resetFilters = {
      search: "",
      is_completed: "",
      is_inplay: "",
      status: "",
    };
    
    // Update state
    setFilters(resetFilters);
    
    // Reset pagination to first page
    setPagination(prev => ({
      ...prev,
      currentPage: 1
    }));
    
    // Fetch data with reset filters
    try {
      setGamesLoading(true);
      
      // Only send sportId and seriesId without any other filters
      const params = {
        page: 1,
        limit: pagination.itemsPerPage
      };

      const response = await getAllEvents(sportId, seriesId, params);

      if (response.data.success) {
        setGames(response.data.data || []);

        if (response.data.pagination) {
          setPagination(prev => ({
            ...prev,
            currentPage: response.data.pagination.current_page || response.data.pagination.page || 1,
            itemsPerPage: response.data.pagination.limit || pagination.itemsPerPage,
            totalItems: response.data.pagination.total_records || response.data.pagination.total || 0,
            totalPages: response.data.pagination.total_pages ||
              Math.ceil((response.data.pagination.total_records || 0) / (response.data.pagination.limit || pagination.itemsPerPage))
          }));
        } else {
          setPagination(prev => ({
            ...prev,
            currentPage: 1,
            itemsPerPage: pagination.itemsPerPage,
            totalItems: response.data.data?.length || 0,
            totalPages: Math.ceil((response.data.data?.length || 0) / pagination.itemsPerPage)
          }));
        }

        setError("");
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error("Error fetching games:", err);
      setError("Failed to fetch games");
    } finally {
      setGamesLoading(false);
      setIsResetting(false);
    }
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
            <p><b>Open Status:</b> {game.open_status === 1 ? 'Open' : 'Closed'}</p>
            <p><b>Inplay:</b> {game.is_inplay === 1 ? 'Yes' : 'No'}</p>
            <p><b>Completed:</b> {game.is_completed === 1 ? 'Yes' : 'No'}</p>
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

  return (
    <>
      <div className="mt-4 activematch">
        <Card>
          <CardHeader className="bg-color-black">
            <div className="title_all mb-0">
              <h4 className="mb-0 text-white">ACTIVE GAMES</h4>
            </div>
          </CardHeader>
          <CardBody>
            {/* Filter Section - Commented out as in original */}
            {/* <div className="row mb-4">
              <div className="col-md-4 mb-3">
                <label className="form-label">Search</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name or competition"
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                />
              </div>
              
              <div className="col-md-3 mb-3">
                <label className="form-label">Status</label>
                <select 
                  className="form-control"
                  value={filters.is_completed}
                  onChange={(e) => handleFilterChange("is_completed", e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="0">Active</option>
                  <option value="1">Completed</option>
                </select>
              </div>
              
              <div className="col-md-2 mb-3">
                <label className="form-label">Inplay</label>
                <select 
                  className="form-control"
                  value={filters.is_inplay}
                  onChange={(e) => handleFilterChange("is_inplay", e.target.value)}
                >
                  <option value="">All</option>
                  <option value="1">Inplay</option>
                  <option value="0">Not Inplay</option>
                </select>
              </div>
              
              <div className="col-md-2 mb-3">
                <label className="form-label">Event Status</label>
                <select 
                  className="form-control"
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                >
                  <option value="">All</option>
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </select>
              </div>
              
              <div className="col-md-2 d-flex align-items-end gap-2 mb-3">
                <button
                  className="btn btn-primary w-100"
                  onClick={handleApplyFilters}
                  disabled={gamesLoading}
                >
                  {gamesLoading ? "Loading..." : "Apply"}
                </button>
                <button
                  className="btn btn-secondary w-100"
                  onClick={handleResetFilters}
                  disabled={gamesLoading || isResetting}
                >
                  {isResetting ? "Resetting..." : "Reset"}
                </button>
              </div>
            </div> */}

            {/* Games Table */}
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>NAME</th>
                    <th>DATE & TIME</th>
                    <th>COMPETITION NAME</th>
                    <th>STATUS</th>
                    <th>DETAILS</th>
                    {/* <th>ACTIONS</th> */}
                  </tr>
                </thead>
                <tbody>
                  {gamesLoading ? (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        <div className="spinner-border spinner-border-sm me-2" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        {isResetting ? "Resetting filters..." : "Loading matches..."}
                      </td>
                    </tr>
                  ) : games.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        No matches found
                      </td>
                    </tr>
                  ) : (
                    games.map((game, index) => (
                      <tr key={game._id || game.event_id}>
        <div className="dropdown ms-2 position-static">
                            <div
                              className="dropdown-toggle newtoggle"
                              type="button"
                              onClick={() => toggleActionDropdown(game.id || game.event_id || index)}
                              aria-expanded={dropdownOpen === (game.id || game.event_id || index)}
                              style={{ cursor: 'pointer' }}
                            >
                              <FiMoreVertical />
                            </div>

                            {dropdownOpen === (game.id || game.event_id || index) && (
                              <ul
                                className="dropdown-menu dropdown-menu-end show"
                                style={{
                                  position: "absolute",
                                  transform: "translate3d(-10px, 24px, 0px)",
                                  zIndex: 1055,
                                  minWidth: "220px",
                                }}
                              >
                                <li>
                                  <div
                                    className="dropdown-item custum_new_ul"
                                    onClick={() => {
                                      handleMatchSessionall(game);
                                    }}
                                  >
                                    SESSION BET
                                  </div>
                                </li>
                                <li>
                                  <div
                                    className="dropdown-item custum_new_ul"
                                    onClick={() => {
                                      handleMatchBet(game);
                                    }}
                                  >
                                    METCH BET
                                  </div>
                                </li>
                                {/* <li>
                                  <div
                                    className="dropdown-item custum_new_ul"
                                    onClick={() => {
                                      handleSessionBet(game);
                                    }}
                                  >
                                    SESSION BET
                                  </div>
                                </li> */}
                                <li>
                                  <div
                                    className="dropdown-item custum_new_ul"
                                    onClick={() => {
                                      handleCancelHistory(game);
                                    }}
                                  >
                                    Rejected Bets
                                  </div>
                                </li>
                              </ul>
                            )}
                          </div>                        <td>{game.name || "-"}</td>
                        <td>{formatDate(game.openDate)}</td>
                        <td>{game.series_name || "-"}</td>
                        <td>
                          <span className={`badge status-badge d-inline ${
                            getStatus(game) === "INPLAY" ? "bg-transparent" :
                            getStatus(game) === "COMPLETED" ? "bg-secondary" :
                            getStatus(game) === "INACTIVE" ? "bg-danger" :
                            getStatus(game) === "UPCOMING" ? "bg-warning" :
                            "bg-info"
                          }`}>
                            <span className="blinking-dot"></span>
                            {getStatus(game)}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-primary d-flex align-items-center gap-1"
                            onClick={(e) => handleMatchClicknew(game.market_id, game.event_id, e)}
                            title="View Match Details"
                          >
                            <FaEye /> View
                          </button>
                        </td>
                        <td>
                          {/* Dropdown Menu */}
                  
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

            {/* Pagination Section */}
            {pagination.totalPages > 1 && (
              <div className="d-flex justify-content-between align-items-center mt-4">
                <div className="pagination-container d-flex align-items-center gap-2">
                  {/* Uncomment if you want pagination controls */}
                  {/* <button
                    className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
                    disabled={pagination.currentPage === 1 || gamesLoading}
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
                        disabled={gamesLoading}
                        style={{
                          minWidth: '40px',
                          padding: '5px 10px'
                        }}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
                    disabled={pagination.currentPage === pagination.totalPages || gamesLoading}
                    onClick={handleNextPage}
                    title="Next Page"
                  >
                    Next <MdOutlineKeyboardArrowRight />
                  </button> */}
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Add custom styles for dropdown */}
      <style jsx>{`
        .newtoggle {
          cursor: pointer;
          padding: 5px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: background-color 0.2s;
        }

        .newtoggle:hover {
          background-color: rgba(0, 0, 0, 0.05);
        }

        .custum_new_ul {
          cursor: pointer;
          padding: 8px 16px;
          font-size: 14px;
          transition: background-color 0.2s;
        }

        .custum_new_ul:hover {
          background-color: #f8f9fa;
        }

        .dropdown-menu {
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(0, 0, 0, 0.15);
          border-radius: 4px;
          padding: 8px 0;
        }
      `}</style>
    </>
  );
}