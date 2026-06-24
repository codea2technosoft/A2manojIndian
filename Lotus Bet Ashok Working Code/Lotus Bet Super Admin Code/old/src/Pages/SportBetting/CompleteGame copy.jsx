import { Link, useParams, useLocation } from "react-router-dom"; // ✅ useLocation add karo
import React, { useState, useEffect } from "react";
import { MdFilterListAlt } from "react-icons/md";
import moment from "moment";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import Swal from "sweetalert2";
import Toast from "../../User/Toast";
// import { FiSearch} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import {getCompletedMatchList, toggleEventStatus, toggleCompletedStatus } from "../../Server/api";
import {
  FiSearch,  FiMoreVertical, FiUser, FiUserCheck,
  FiUserX, FiLock,  FiSlash, FiPlusCircle,
  FiMinusCircle,  
} from "react-icons/fi";
import { Button } from "react-bootstrap";
function CompletedEvents() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState(false);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
   const [dropdownOpen, setDropdownOpen] = useState(null);
  

const [total, setTotal] = useState(0);
const [totalPages, setTotalPages] = useState(1);
const [page, setPage] = useState(1);
const [limit] = useState(10);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(null);
  const [editableEventId, setEditableEventId] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const sportId = searchParams.get('sportId');
  const seriesId = searchParams.get('seriesId');
const [searchInput, setSearchInput] = useState("");
const [searchTerm, setSearchTerm] = useState("");
const [filters, setFilters] = useState({ code: "", name: "" });
const [isSearching, setIsSearching] = useState(false);
const hasActiveFilters =
  filters.code !== "" ||
  filters.name !== "" ||
  searchTerm !== "";



  // const fetchEvents = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await getAllEvents(sportId, seriesId);
  //     if (response.data.data) {
  //       let completedEvents = response.data.data.filter(event => event.is_completed === 1);
  //         if (searchTerm.trim() !== "") {
  //     completedEvents = completedEvents.filter(ev =>
  //       ev.name.toLowerCase().includes(searchTerm.toLowerCase())
  //     );
  //   }
  //       setGames(completedEvents);
  //       setError("");
  //     } else {
  //       setError(response.data.message);
  //       // showToast(response.data.message);
  //     }
  //   } catch (err) {
  //     console.error("Error fetching games:", err);
  //     setError(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  // Toast helpers
 
const fetchEvents = async () => {
  try {
    setLoading(true);

    const payload = {
      page,
      limit,
      search: searchTerm.trim() || "",
    };

    const response = await getCompletedMatchList(payload);

    if (response?.data?.success) {
      const api = response.data;

      setGames(api.results);      
      setTotal(api.total);       
      setTotalPages(api.pages); 
      setError("");
    } else {
      setError(response?.data?.message);
    }

  } catch (error) {
    console.error("Error fetching completed match list:", error);
    setError("Failed to load matches.");
  } finally {
    setLoading(false);
  }
};
// Toggle game status function ke baad ya pehle add karo
const handlePageChange = (newPage) => {
  if (newPage >= 1 && newPage <= totalPages) {
    setPage(newPage);
  }
};

// Ya existing functions ke saath:
const handlePageClick = (pageNum) => {  // Agar is naam se hai
  if (pageNum >= 1 && pageNum <= totalPages) {
    setPage(pageNum);
  }
};
 
 
  const showToast = (message, type = 'success') => setToast({ show: true, message, type });
  const hideToast = () => setToast({ show: false, message: '', type: '' });

useEffect(() => {
  fetchEvents();
}, [page, searchTerm]); // page और searchTerm दोनों के लिए listen करें

  // Toggle game status
  const handleToggleEventStatus = async (eventId, currentStatus) => {
    try {
      setUpdating(eventId);
      const response = await toggleEventStatus(eventId);

      if (response.data.success) {
        setGames((prev) =>
          prev.map((event) =>
            event._id === eventId
              ? { ...event, status: currentStatus === 1 ? 0 : 1 }
              : event
          )
        );
        showToast(`Event ${response.data.message}`, "success");
      } else {
        showToast(response.data.message, "error");
      }
    } catch (error) {
      console.error("Error toggling event status:", error);
      showToast("Network error while toggling status", "error");
    } finally {
      setUpdating(null);
    }
  };

  // Status badge
  const getStatusBadge = (status) => {
    const isActive = status === 1; // 1 = Active, 0 = Inactive
    return (
      <span className={`fw-bold ${isActive ? 'text-success' : 'text-danger'} me-2`}>
        {isActive ? 'Active' : 'Inactive'}
      </span>
    );
  };

  // ToggleSwitch component
  const ToggleSwitch = ({ gameId, status, disabled }) => {
    const isActive = status === 1;
    return (
      <div className="form-check form-switch d-flex align-items-center gap-2">
        <input
          className="form-check-input"
          type="checkbox"
          checked={isActive}
          onChange={() => {
            handleToggleEventStatus(gameId, status);
            setEditableEventId(gameId); // ✅ toggle करने के बाद dropdown enable
          }}

          disabled={disabled}
          style={{
            cursor: disabled ? 'not-allowed' : 'pointer',
          }}
        />
        <label className="form-check-label small fw-bold mb-0">
          {isActive ? 'Active' : 'Inactive'}
        </label>
      </div>
    );
  };

  const handleCompletedChange = async (eventId, newStatus) => {
    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to mark this event as "${newStatus}"`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, confirm it!",
      cancelButtonText: "Cancel",
    });

    if (!confirmResult.isConfirmed) return;

    try {
      setUpdating(eventId);
      const response = await toggleCompletedStatus(eventId, newStatus);

      if (response.data.success) {
        setGames((prev) =>
          prev.map((event) =>
            event._id === eventId
              ? {
                ...event,
                is_completed: event.is_completed === 1 ? 0 : 1,
                is_inplay: event.is_inplay === 1 ? 0 : 1,
              }
              : event
          )
        );

        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: response.data.message,
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire("Error", response.data.message, "error");
      }
    } catch (error) {
      console.error("Error updating completed status:", error);
      Swal.fire("Network Error", "Something went wrong while updating", "error");
    } finally {
      setUpdating(null);
    }
  };
const handleClearSearch = () => {
  setSearchInput("");
  setSearchTerm("");
  setFilters({ code: "", name: "" });
  fetchEvents(); 
};


const handleSearch = () => {
  setSearchTerm(searchInput.trim());
  setPage(1); // Reset to first page when searching
};
  const toggleActionDropdown = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  const handleClearAllFilters = () => {
    if (filters.code !== "" || filters.name !== "") {
      setFilters({ code: "", name: "" });
      fetchEvents( searchTerm, { code: "", name: "" });
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
  const handleMatchAndSessionPLReport = (agent) => {
    navigate(`/match_session_PL_Report/${agent.admin_id}`);
  };

  const handleMatchAndSessionPL = (agent) => {
    navigate(`/match_session_PL/${agent.admin_id}`);
  };
  const handleMatchBet = (agent) => {
    navigate(`/match_bet/${agent.admin_id}`);
  };
  const handleSessionBet = (agent) => {
    navigate(`/session_bet/${agent.admin_id}`);
  };

  const handleCompletedSession = (agent) => {
    navigate(`/completed-session/${agent.admin_id}`);
  };

  const handleRejectedBet = (agent) => {
    navigate(`/rejected_bet/${agent.admin_id}`);
  };
  const getCompletionBadge = (isCompleted) => {
    return (
      <span className={`badge ${isCompleted === 1 ? 'bg-success' : 'bg-warning'}`}>
        {isCompleted === 1 ? 'Completed' : 'In Progress'}
      </span>
    );
  };
  // Loading state
  if (loading) return (
    <div className="text-center mt-3">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-2">Loading games...</p>
    </div>
  );

  // Error state
  if (error) return (
    <div className="text-center mt-3 text-danger">
      <p>{error}</p>
      <button className="btn btn-primary" onClick={fetchEvents}>Retry</button>
    </div>
  );
  return (
    <div className="mt-3">
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
      <div className="card">
        <div className="card-header bg-primary-yellow p-2 text-white d-flex justify-content-between align-items-center">
          <h3 className="card-title mb-0">Completed Event List</h3>
          {/* <div>
            <button className="btn btn-outline-light"onClick={() => setFilter(prev => !prev)}>
              <MdFilterListAlt /> Filter
            </button>
          </div> */}
        </div>
        {/* Table */}
        <div className="card-body table-responsive">
         {/* <div className="row mb-3 align-items-center">

  <div className="col-md-6">
    <div className="d-flex">
      <div className="input-group me-2" style={{ width: "300px" }}>
        <input
          type="text"
          className="form-control"
          placeholder="Search by match name..."
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

  <div className="col-md-6">
    <div className="d-flex justify-content-end align-items-center">

      {hasActiveFilters && (
        <button
          className="btn btn-outline-danger btn-sm"
          onClick={handleClearAllFilters}
        >
          Clear All Filters
        </button>
      )}
    </div>
  </div>
</div> */}

          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>Sr</th>
                 <th>#</th>
                <th>Name</th>
                <th>Date&Time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {games.length > 0 ? games.map((game, index) => (
                <tr key={game._id}>
                     <td>{index + 1}</td>
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
                                <li>
                                  <div
                                    className="dropdown-item custum_new_ul"
                                    onClick={() => {
                                      handleMatchAndSessionPLReport(game);
                                      // toggleActionDropdown(null);
                                    }}
                                  >
                                    MATCH And SESSION PL REPORT
                                  </div>
                                </li>
                                <li>
                                  <div
                                    className="dropdown-item custum_new_ul"
                                    onClick={() => {
                                      handleMatchAndSessionPL(game);
                                      // toggleActionDropdown(null);
                                    }}

                                  >
                                    MATCH AND SESSION PL
                                  </div>
                                </li>
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
                                <li>
                                  <div
                                    className="dropdown-item custum_new_ul"
                                    onClick={() => {
                                      handleCompletedSession(game);
                                      // toggleActionDropdown(null);
                                    }}
                                  >
                                    COMPLETED SESSION
                                  </div>
                                </li>
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
                  <td>
                    {game.full_team_name}
                  </td>
                <td>{moment(game.created_at).format("DD-MM-YYYY hh:mm A")}</td>
                  <td>{getStatusBadge(game.status)}</td>
                  <td className="d-flex align-items-center gap-2">
                    {/* <ToggleSwitch
                                            gameId={game._id}
                                            status={game.status}
                                            disabled={updating === game._id}
                                        /> */}
                    <select
                      className="form-select form-select-sm"
                      value={game.is_completed === 1 ? "complete" : "inplay"}
                      onChange={(e) => handleCompletedChange(game._id, e.target.value)}
                      disabled={updating === game._id || editableEventId !== game._id} // ✅ only enable for current event
                      style={{ width: "120px" }}
                    >
                      <option value="inplay">In Play</option>
                      <option value="complete">Complete</option>
                    </select>




                    {updating === game._id && (
                      <div className="spinner-border spinner-border-sm text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    No games found
                    <br />
                    <button className="refreshbuttonall" onClick={fetchEvents}>Refresh</button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>


{/* PAGINATION FOOTER — REPLACE OLD BLOCK WITH THIS */}
{total > 0 && (
  <div className="card-footer">
    <div className="d-flex justify-content-between align-items-center mt-4">

      {/* Showing Entries */}
      <div className="sohwingallentries">
        Page {page} of {totalPages}
      </div>

      {/* Pagination Controls */}
      <div className="paginationall d-flex align-items-center gap-1">

        {/* Previous Button */}
        <button
          onClick={() => page > 1 && handlePageChange(page - 1)}
          disabled={page === 1}
        >
          <MdOutlineKeyboardArrowLeft />
        </button>

        {/* Current Page Number */}
        <div className="paginationnumber">
          {page}
        </div>

        {/* Next Button */}
        <button
          onClick={() => page < totalPages && handlePageChange(page + 1)}
          disabled={page === totalPages}
        >
          <MdOutlineKeyboardArrowRight />
        </button>

      </div>
    </div>
  </div>
)}

      </div>
    </div>

  );
}

export default CompletedEvents;