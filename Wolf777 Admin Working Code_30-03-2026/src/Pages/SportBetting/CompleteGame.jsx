import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { getAllEvents } from "../../Server/api";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiSearch, FiMoreVertical,

} from "react-icons/fi";
import {
  getCompletedMatchList,
} from "../../Server/api";
import { IoClose } from "react-icons/io5";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { Card, CardBody, CardHeader } from "react-bootstrap";
export default function Dashboard() {
  const [gamesLoading, setGamesLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [marketData, setMarketData] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [games, setGames] = useState([]);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 100,
    totalItems: 0,
    totalPages: 1,
  });
  const [page, setPage] = useState(1);
  const [limit] = useState(100);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({ code: "", name: "" });
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const hasActiveFilters = filters.code !== "" || filters.name !== "";

  // safer alias
  const itemsPerPage = pagination.itemsPerPage;
  const admin_id = localStorage.getItem("admin_id")
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const sportId = searchParams.get("sportId");
  const seriesId = searchParams.get("seriesId");
  const navigate = useNavigate();



  const fetchMatchResultList = async (pageNo = page) => {
    try {
      setLoading(true);

      const payload = {
        admin_id,
        page: pageNo,
        limit: limit,
      };
      const res = await getCompletedMatchList(payload);
      if (res.data.success) {
        setMarketData(res.data.results || []);
        setTotal(res.data.total);
        setTotalPages(res.data.pages);
        setPage(res.data.page);
        setSummary(res.data.summary);
      }
    } catch (err) {
      console.error("Match result list error", err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchMatchResultList();
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
    navigate(`/viewmatch-fancy/series_idd/${market_id}/event_id/${event_id}`);
  };

  const handleNextPage = () => {
    if (pagination.currentPage < pagination.totalPages) {
      const nextPage = pagination.currentPage + 1;
      fetchMatchResultList(nextPage, pagination.itemsPerPage);
    }
  };
  const toggleActionDropdown = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  const handlePrevPage = () => {
    if (pagination.currentPage > 1) {
      const prevPage = pagination.currentPage - 1;
      fetchMatchResultList(prevPage, pagination.itemsPerPage);
    }
  };
  const handlePageClick = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchMatchResultList(page, pagination.itemsPerPage);
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

  const handleMatchAndSessionPLReport = (agent) => {
    navigate(`/match_session_PL_Report/${agent.admin_id}`);
  };

  const handleMatchAndSessionPL = (agent) => {
    navigate(`/match_session_PL/${agent.event_id}`);
  };

  const handleMatchBet = (agent) => {
    navigate(`/match_bet/${agent.event_id}`);
    console.log("agent.event_id", agent.event_id)
  };

  const handleSessionBet = (agent) => {
    navigate(`/session_bet/${agent.event_id}`);
  };

  const handleCompletedSession = (agent) => {
    navigate(`/completed-session/${agent.event_id}`);
  };

  const handleRejectedBet = (agent) => {
    navigate(`/rejected_bet/${agent.event_id}`);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
    setFilters({ code: "", name: "" });
    fetchMatchResultList(1, pagination.itemsPerPage, "", { code: "", name: "" });
  };


  const handleSearch = () => {
    // if (searchInput.trim() !== "") {
    //   setSearchTerm(searchInput.trim());
    //   fetchMatchResultList(1, itemsPerPage, searchInput.trim(), filters);
    // }
    fetchMatchResultList(1, itemsPerPage, searchInput.trim(), filters);
  };


  const handleClearAllFilters = () => {
    if (filters.code !== "" || filters.name !== "") {
      setFilters({ code: "", name: "" });
      fetchMatchResultList(1, itemsPerPage, searchTerm, { code: "", name: "" });
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };







  return (
    <>
      <div className="mt-4 activematch">
        <Card>
          <CardHeader className=" bg-color-black">
            <div className="title_all mb-0">
              <h4 className="mb-0 text-white">COMPLETE GAMES</h4>
            </div>
          </CardHeader>
          <CardBody>

            {/* <div className="row mb-3 align-items-center">
              <div className="col-md-6">
                <div className="d-flex">
                  <div className="input-group me-2" style={{ width: "300px" }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search master..."
                      value={searchInput}
                      onChange={handleSearchInputChange}
                      onKeyPress={handleSearchKeyPress}
                    />
                    <button
                      className="btn btn-outline-primary"
                      type="button"
                      onClick={handleSearch}
                      disabled={isSearching}
                    >
                      <FiSearch />
                    </button>
                    {(searchTerm || hasActiveFilters) && (
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={handleClearSearch}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  {hasActiveFilters && (
                    <div className="d-flex align-items-center">
                      <span className="badge bg-info me-2">
                        Filters Active
                      </span>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={handleClearAllFilters}
                      >
                        Clear All Filters
                      </button>
                    </div>
                  )}
                </div>
                {searchTerm && (
                  <div className="mt-2">
                    <small className="text-muted">
                      Search results for: <strong>"{searchTerm}"</strong>
                    </small>
                  </div>
                )}
              </div>

            </div> */}
            {summary && (
              <div className="rounded bg-light">

                <div className="d-flex gap-4 pb-2 text-uppercase">

                  {/* <div className="">
                    <strong>Comm (+): </strong>
                    <span style={{ color: "green", fontWeight: "bold" }}>
                      {summary.commission_plus}
                    </span>
                  </div>
                  <div className="">
                    <strong>Comm (-): </strong>
                    <span style={{ color: "red", fontWeight: "bold" }}>
                      {summary.commission_minus}
                    </span>
                  </div> */}

                 {/* <div className="">
                    <strong>P&L: </strong>
                    <span
                      style={{
                        color:
                          summary.pl > 0
                            ? "green"
                            : summary.pl < 0
                              ? "red"
                              : "black",
                        fontWeight: "bold",
                      }}
                    >
                      {summary.pl}
                    </span>
                  </div>*/}

                </div>
              </div>
            )}

            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>DATE & TIME</th>
                    <th>NAME</th>
                    
                    <th>Winner</th>
                    {/* <th>comm(+)</th>
                    <th>comm(-)</th> */}
                    {/* <th>pl</th> */}
                    {/* <th>DETAILS</th> */}
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
                  ) : marketData.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center">
                        No matches found
                      </td>
                    </tr>
                  ) : (
                    marketData.map((game, index) => (
                      <tr key={game._id || game.event_id}>
                        <td className="text-center">
                          <div className="dropdown ms-2 position-static">
                            <div
                              className="dropdown-toggle newtoggle"
                              type="button"
                              onClick={() => toggleActionDropdown(game.id || index)}
                              aria-expanded={dropdownOpen === (game.id || index)}
                            >
                              <FiMoreVertical />
                            </div>

                            {dropdownOpen === (game.id || index) && (
                              <ul
                                className="dropdown-menu dropdown-menu-end show"
                                style={{
                                  position: "absolute",
                                  transform: "translate3d(-10px, 24px, 0px)",
                                  zIndex: 1055,
                                  minWidth: "220px",
                                }}
                              >
                                {/* <li>
                                  <div
                                    className="dropdown-item custum_new_ul"
                                    onClick={() => {
                                      handleMatchAndSessionPLReport(game);
                                      // toggleActionDropdown(null);
                                    }}
                                  >
                                    MATCH And SESSION PL REPORT
                                  </div>
                                </li> */}
                                {/* <li>
                                  <div
                                    className="dropdown-item custum_new_ul"
                                    onClick={() => {
                                      handleMatchAndSessionPL(game); 
                                    }}

                                  >
                                   Match&SESSION PL                   
                                  </div>
                                </li> */}
                                <li>
                                  <div
                                    className="dropdown-item custum_new_ul"
                                    onClick={() => {
                                      handleMatchBet(game);
                                      // toggleActionDropdown(null);
                                    }}
                                  >
                                    METCH BET
                                  </div>
                                </li>
                                <li>
                                  <div
                                    className="dropdown-item custum_new_ul"
                                    onClick={() => {
                                      handleSessionBet(game);
                                      // toggleActionDropdown(null);
                                    }}
                                  >
                                    SESSION BET
                                  </div>
                                </li>
                                {/* <li>
                                  <div
                                    className="dropdown-item custum_new_ul"
                                    onClick={() => {
                                      handleCompletedSession(game);
                                      // toggleActionDropdown(null);
                                    }}
                                  >
                                    COMPLETED SESSION
                                  </div>
                                </li> */}
                                <li>
                                  <div
                                    className="dropdown-item custum_new_ul"
                                    onClick={() => {
                                      handleRejectedBet(game);
                                      // toggleActionDropdown(null);
                                    }}
                                  >
                                    REJECTED BET
                                  </div>
                                </li>
                              </ul>
                            )}
                          </div>
                        </td>
                        <td>{formatDate(game.created_at)}</td>
                        <td>{game.full_team_name || "-"}</td>
                        <td>{game.team_name || "-"}</td>
                        {/* <td className="text-success fw-1">{game.commission_plus || "-"}</td>
                        <td className="text-danger fw-1">{game.commission_minus || "-"}</td> */}
                        {/* <td
                          style={{
                            color:
                              game.pl > 0
                                ? "green"
                                : game.pl < 0
                                  ? "red"
                                  : "",
                            fontWeight: "600",
                          }}
                        >
                          {game.pl}
                        </td> */}

                        {/* <td>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={(e) => handleMatchClicknew(game.market_id, game.event_id, e)}
                            title="View Match Details"
                          >
                            <FaEye /> View
                          </button>
                        </td> */}
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

            {pagination.totalPages > 1 && (
              <div className="d-flex justify-content-between align-items-center mt-4">
                <div className="sohwingallentries d-flex align-items-center gap-3">
                  Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{" "}
                  {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{" "}
                  {pagination.totalItems} entries
                </div>

                <div className="paginationall d-flex align-items-center gap-2">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    disabled={pagination.currentPage === 1}
                    onClick={handlePrevPage}
                    title="Previous Page"
                  >
                    <MdOutlineKeyboardArrowLeft />
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
                    <MdOutlineKeyboardArrowRight />
                  </button>
                </div>

              </div>
            )}

          </CardBody>
        </Card>
      </div>
    </>
  );
}
