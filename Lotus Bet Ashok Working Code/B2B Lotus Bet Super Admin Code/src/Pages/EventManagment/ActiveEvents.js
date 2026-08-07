import { Link, useParams, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdFilterListAlt,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
  MdMoreVert,
} from "react-icons/md";
import Swal from "sweetalert2";
import Toast from "../../User/Toast";
import {
  ActiveEventList,
  toggleEventStatus,
  toggleCompletedStatus,
} from "../../Server/api";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import Loader from "../../Common/Loader";
import { LuRefreshCw } from "react-icons/lu";
import { FaLock, FaUnlock } from "react-icons/fa";

function ActiveEvents() {
  const navigate = useNavigate();
  const { id } = useParams();
  const sport_id = id;
  console.log("Sport ID:", sport_id);
  const [filter, setFilter] = useState(false);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [pagination, setPagination] = useState({
    current_page: 1,
    limit: 50,
    total_records: 0,
    total_pages: 0,
  });
  const [filters, setFilters] = useState({ search: "" });
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const sportId = searchParams.get("sportId");
  const seriesId = searchParams.get("seriesId");
  const hasActiveFilters = searchTerm !== "";
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchEvents = async (
    page = pagination.current_page,
    limit = pagination.limit,
    search = "",
  ) => {
    try {
      setLoading(true);
      const payload = {
        page,
        limit,
        sport_id,
        ...(search && { search: search }),
        // is_completed: filters.is_completed,
        // is_inplay: filters.is_inplay
      };
      const response = await ActiveEventList(payload);
      if (response.data.success) {
        // const activeEvents = response.data.data.filter(game => game.status === 1) || [];
        setGames(response.data.data || []);
        if (response.data.pagination) {
          setPagination({
            current_page: response.data.pagination.current_page,
            limit: response.data.pagination.limit,
            total_records: response.data.pagination.total_records,
            total_pages: response.data.pagination.total_pages,
          });
        }
        setSearchTerm(search);
        setError("");
      } else {
        setError(response.data.message);
        // showToast(response.data.message);
      }
    } catch (err) {
      console.error("Error fetching games:", err);
      setError("Failed to fetch games");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = "success") =>
    setToast({ show: true, message, type });
  const hideToast = () => setToast({ show: false, message: "", type: "" });

  useEffect(() => {
    fetchEvents(pagination.current_page, pagination.limit, searchTerm);
  }, [sportId, seriesId, pagination.current_page, searchTerm]);

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearch = () => {
    const trimmed = searchInput.trim();
    if (trimmed !== searchTerm) {
      setPagination((prev) => ({ ...prev, page: 1 })); // ✅ Page 1 पर reset करें
      setSearchTerm(trimmed);
      fetchEvents(1, pagination.limit, trimmed);
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };
  const handleClearAllFilters = () => {
    setSearchInput("");
    setSearchTerm("");
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchEvents(1, pagination.limit, "");
  };
  const handleClearSearch = () => {
    if (searchTerm !== "") {
      setSearchInput("");
      setSearchTerm("");
      setPagination((prev) => ({ ...prev, page: 1 }));
      fetchEvents(1, pagination.limit, "");
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 2;
    const { current_page, total_pages } = pagination;
    if (total_pages <= maxVisiblePages) {
      for (let i = 1; i <= total_pages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let start = Math.max(1, current_page - Math.floor(maxVisiblePages / 2));
      let end = start + maxVisiblePages - 1;

      if (end > total_pages) {
        end = total_pages;
        start = end - maxVisiblePages + 1;
      }

      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  };

  // ---------------- PAGINATION ----------------
  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, current_page: newPage }));
  };

  const handleViewMatch = (match) => {
    navigate(`/view_fancy/${match.id}`);
  };

  // const handlePageChange = (newPage) => {
  //     setPagination(prev => ({ ...prev, page: newPage }));
  //     // fetchEvents(newPage, pagination.limit);
  // };

  const applyFilters = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    // fetchEvents(1, pagination.limit);
  };
  const resetFilters = () => {
    setFilters({
      search: "",
      is_completed: "",
      is_inplay: "",
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
    // fetchEvents(1, pagination.limit);
  };
  const handleRefresh = () => {
    fetchEvents(1, pagination.limit);
  };
  const handleLimitChange = (e) => {
    const newLimit = Number(e.target.value);
    setPagination((prev) => ({
      ...prev,
      limit: newLimit,
      current_page: 1,
    }));
    fetchEvents(1, newLimit, searchTerm);
  };

  // const toggleGameStatus = async (matchId, currentStatus) => {
  //     try {
  //         setUpdating(matchId);
  //         const response = await toggleMatchStatus(matchId);

  //         if (response.data.success) {
  //             setGames(prev =>
  //                 prev.map(game =>
  //                     game._id === matchId ? { ...game, status: currentStatus === 1 ? 0 : 1 } : game
  //                 )
  //             );
  //             const newStatus = currentStatus === 1 ? 'deactivated' : 'activated';
  //             showToast(`Game ${newStatus} successfully`, 'success');
  //         } else {
  //             showToast(response.data.message || "Failed to update status", 'error');
  //         }
  //     } catch (err) {
  //         console.error("Error toggling game status:", err);
  //         showToast("Network error: Failed to update status", 'error');
  //     } finally {
  //         setUpdating(null);
  //     }
  // };

  const handleToggleEventStatus = async (eventId, currentStatus) => {
    try {
      setUpdating(eventId);
      const response = await toggleEventStatus(eventId);

      if (response.data.success) {
        setGames((prev) =>
          prev.map((event) =>
            event._id === eventId
              ? { ...event, status: currentStatus === 1 ? 0 : 1 }
              : event,
          ),
        );
        showToast(`Event ${response.data.message}`, "success");
        fetchEvents();
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
                  // is_completed: event.is_completed === 1 ? 0 : 1,
                  // is_inplay: event.is_inplay === 1 ? 0 : 1,
                  is_completed: newStatus === "complete" ? 1 : 0, // ✅ YEH CORRECT KARO
                  is_inplay: newStatus === "inplay" ? 1 : 0, // ✅ YEH CORRECT KARO
                }
              : event,
          ),
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
      Swal.fire(
        "Network Error",
        "Something went wrong while updating",
        "error",
      );
    } finally {
      setUpdating(null);
    }
  };

  // const handleToggleCompleted = async (eventId, currentStatus) => {
  //     try {
  //         setUpdating(eventId);
  //         const response = await toggleCompletedStatus(eventId);

  //         if (response.data.success) {
  //             setEvents((prev) =>
  //                 prev.map((event) =>
  //                     event._id === eventId
  //                         ? {
  //                             ...event,
  //                             is_completed: event.is_completed === 1 ? 0 : 1,
  //                             is_inplay: event.is_inplay === 1 ? 0 : 1,
  //                         }
  //                         : event
  //                 )
  //             );
  //             showToast(response.data.message, "success");
  //         } else {
  //             showToast(response.data.message, "error");
  //         }
  //     } catch (error) {
  //         console.error("Error toggling completed status:", error);
  //         showToast("Network error while toggling completed status", "error");
  //     } finally {
  //         setUpdating(null);
  //     }
  // };

  const getStatusBadge = (status) => {
    const isActive = status === 1;
    return (
      <span
        className={`fw-bold ${isActive ? "text-success" : "text-danger"} me-2`}
      >
        {isActive ? "Active" : "Inactive"}
      </span>
    );
  };

  const ToggleSwitch = ({ gameId, status, disabled }) => {
    const isActive = status === 1;
    return (
      <div className="form-check form-switch d-flex align-items-center gap-2">
        <input
          className="form-check-input"
          type="checkbox"
          checked={isActive}
          onChange={() => handleToggleEventStatus(gameId, status)}
          disabled={disabled}
          style={{
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        />
        <label className="form-check-label small fw-bold mb-0">
          {isActive ? "Active" : "Inactive"}
        </label>
      </div>
    );
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const StatusToggle = ({ gameId, status, disabled }) => {
    const isActive = status === 1;

    return (
      <button
        type="button"
        className="btn btn-link p-0 border-0"
        disabled={disabled}
        onClick={() => handleToggleEventStatus(gameId, status)}
        title={isActive ? "Click to Inactive" : "Click to Active"}
        style={{
          cursor: disabled ? "not-allowed" : "pointer",
        }}
      >
        {isActive ? (
          <FaUnlock size={16} className="text-success" />
        ) : (
          <FaLock size={16} className="text-danger" />
        )}
      </button>
    );
  };

  return (
    <div>
      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}

      <div className="card">
        <div className="card-header bg-primary-yellow d-flex justify-content-between align-items-center">
          <h3 className="card-title mb-0">Active Event List</h3>

          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-dark gradient-10 border-0" onClick={handleRefresh}>
              <LuRefreshCw />
            </button>

            <button
              className="btn btn-outline-light border border-warning"
              onClick={() => navigate(-1)}
            >
              Back
            </button>
          </div>
        </div>
        <div className="card-body">
          {games.length > 0 && (
            <div className="row mb-2">
              <div className="col-md-4">
                <div className="d-flex">
                  <div className="input-group me-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search events..."
                      value={searchInput}
                      onChange={handleSearchInputChange}
                      onKeyPress={handleSearchKeyPress}
                    />
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={handleSearch}
                      disabled={isSearching}
                    >
                      <FiSearch />
                    </button>
                    {/* {(searchTerm || hasActiveFilters) && (
                      <button
                        className="btn btn-outline-danger"
                        type="button"
                        onClick={handleClearSearch}
                      >
                        Clear
                      </button>
                    )} */}
                  </div>
                </div>
                {searchTerm && (
                  <div className="mt-2">
                    <small className="text-muted">
                      Search results for: <strong>"{searchTerm}"</strong>
                    </small>
                  </div>
                )}
              </div>

              {/* <div className="col-md-8">
                <div className="d-flex justify-content-end mb-2">
                  <select
                    className="form-select form-select-sm"
                    style={{ width: "80px" }}
                    value={pagination.limit}
                    onChange={handleLimitChange}
                  >
                    <option value={1}>1</option>
                    <option value={20}>20</option>
                    <option value={30}>30</option>
                    <option value={40}>40</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div> */}
            </div>
          )}

          <div className=" table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>SR</th>
                  <th>DATE&TIME</th>
                  <th>NAME</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="table_loader">
                      <div className="text-center py-5">
                        <Loader />
                        {/* <p className="mt-2">Loading games...</p> */}
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="5">
                      <div className="text-center mt-3 text-danger">
                        <p>{error}</p>
                        <button
                          className="btn btn-primary"
                          onClick={fetchEvents}
                        >
                          Retry
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : games.length > 0 ? (
                  games.map((game, index) => (
                    <tr key={game._id}>
                      <td>
                        {((pagination?.current_page ?? 1) - 1) *
                          (pagination?.limit ?? 20) +
                          index +
                          1}
                      </td>
                      <td>{game.date_time}</td>
                      <td>{game.name}</td>
                      <td>
                        {/* {getStatusBadge(game.status)} */}
                        <StatusToggle
                          gameId={game._id}
                          status={game.status}
                          disabled={updating === game._id}
                        />
                        {updating === game._id && (
                          <div
                            className="spinner-border spinner-border-sm text-warning"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        )}
                      </td>

                      <td className="d-flex align-items-center gap-2">
                        {/* <ToggleSwitch
                          gameId={game._id}
                          status={game.status}
                          disabled={updating === game._id}
                        /> */}
                        <select
                          className="form-select form-select-sm"
                          value={
                            game.is_completed === 1 ? "complete" : "inplay"
                          }
                          onChange={(e) =>
                            handleCompletedChange(game._id, e.target.value)
                          }
                          disabled={updating === game._id}
                          style={{ width: "120px" }}
                        >
                          <option value="inplay">In Play</option>
                          <option value="complete">Complete</option>
                        </select>
                        {updating === game._id && (
                          <div
                            className="spinner-border spinner-border-sm text-primary"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        )}
                        <button
                          className="importbutton"
                          onClick={() => handleViewMatch(game)}
                        >
                          Fancy Status
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-5">
                      <p> No games found</p>
                      <button className="btn btn-primary" onClick={fetchEvents}>
                        Refresh
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="d-flex justify-content-center align-items-center mt-4">
              <div className="paginationall d-flex align-items-center gap-1">
                <button disabled={currentPage === 1} onClick={handlePrev}>
                  <MdKeyboardDoubleArrowLeft /> Previous
                </button>

                <div className="d-flex gap-1">
                  {getPageNumbers().map((page) => (
                    <div
                      key={page}
                      className={`paginationnumber ${currentPage === page ? "active" : ""}`}
                      onClick={() => handlePageClick(page)}
                    >
                      {page}
                    </div>
                  ))}
                </div>

                <button
                  disabled={currentPage === totalPages}
                  onClick={handleNext}
                >
                  Next <MdKeyboardDoubleArrowRight />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ActiveEvents;
