import { Link, useParams, useLocation } from "react-router-dom"; // ✅ useLocation add karo
import React, { useState, useEffect } from "react";
import { MdFilterListAlt } from "react-icons/md";
// import { Link } from "react-router";
import axios from "axios";
import Toast from "../../User/Toast";
import { InActiveEventList } from "../../Server/api";
import {
  FiSearch
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
function InActiveEvents() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState(false);
  const [games, setGames] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [filters, setFilters] = useState({ search: "" });
  const hasActiveFilters = searchTerm !== "";
  // const [pagination, setPagination] = useState({
  //   page: 1,
  //   limit: 3,
  //   total: 0,
  //   totalPages: 0
  // });


const [pagination, setPagination] = useState({
  currentPage: 1,
  itemsPerPage: 50,
  totalItems: 0,
  totalPages: 1
});

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const sportId = searchParams.get('sportId');
  const seriesId = searchParams.get('seriesId');

  // Fetch games from API
  // const fetchEvents = async (page = pagination.page, limit = pagination.limit) => {
  //   try {
  //     setLoading(true);
  //     const params = {
  //       page,
  //       limit,
  //       search: filters.search, // ✅ YEH ADD KARO
  //       status: 0, // ✅ Always inactive events
  //       is_completed: filters.is_completed,
  //       is_inplay: filters.is_inplay
  //     };

  //     const response = await getAllEvents(sportId, seriesId, params);
  //     if (response.data.success) {
  //       // const inactiveEvents = response.data.data.filter(game=>game.status === 0)||[];
  //       setGames(response.data.data || []);
  //       if (response.data.pagination) {
  //         setPagination(prev => ({
  //           ...prev,
  //           page: response.data.pagination.page,
  //           total: response.data.pagination.total,
  //           totalPages: response.data.pagination.totalPages
  //         }));
  //       }
  //       setError("");
  //     } else {
  //       setError(response.data.message || "Failed to fetch games");
  //       showToast(response.data.message || "Failed to fetch games", 'error');
  //     }
  //   } catch (err) {
  //     console.error("Error fetching games:", err);
  //     setError("Failed to fetch games");
  //     showToast("Network error: Failed to fetch games", 'error');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchEvents = async (page = pagination.page,
     limit = pagination.itemsPerPage,
    search = searchTerm) => {
    try {
      setLoading(true);
      const payload = {
        page,
        limit,
        ...(search && { search }),
        status: 1,
      };

      const response = await InActiveEventList(payload);
      if (response.data?.success) {
        const apiData = response.data.data || [];
      const pag = response.data.pagination || {};
        setGames(apiData);
    setPagination({
        currentPage: pag.current_page || 1,
        itemsPerPage: pag.limit || limit,
        totalItems: pag.total_records || 0,
        totalPages: pag.total_pages || 1
      });
        setError("");
      } else {
        setError(response.data.message);
        showToast(response.data.message);
      }

    } catch (err) {
      console.error("Error fetching games:", err);
      setError("Failed to fetch games");
    } finally {
      setLoading(false);
    }
  };
  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

const handleSearch = () => {
  const trimmed = searchInput.trim();
  if (trimmed !== searchTerm) {
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    setSearchTerm(trimmed);
    fetchEvents(1, pagination.itemsPerPage, trimmed);
  }
};

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };
  const handleClearAllFilters = () => {
    setSearchInput("");
    setSearchTerm("");
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchEvents(1, pagination.limit, "");
  };
const handleClearSearch = () => {
  if (searchTerm !== "") {
    setSearchInput("");
    setSearchTerm("");
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    fetchEvents(1, pagination.itemsPerPage, "");
  }
};


  const applyFilters = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchEvents(1, pagination.limit);
  };
  const resetFilters = () => {
    setFilters({
      search: "",
      is_completed: "",
      is_inplay: ""
    });
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchEvents(1, pagination.limit);
  };

  // Toast helpers
  const showToast = (message, type = 'success') => setToast({ show: true, message, type });
  const hideToast = () => setToast({ show: false, message: '', type: '' });

  useEffect(() => {
    fetchEvents(1, pagination.itemsPerPage);
  }, [sportId, seriesId]);

  // Toggle game status
  const toggleGameStatus = async (eventId, currentStatus) => {
    try {
      setUpdating(eventId);
      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}/events/${eventId}/toggle-status`,
        { eventId },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: false
        }
      );

      if (response.data.success) {
        setGames(prev =>
          prev.map(game =>
            game._id === eventId ? { ...game, status: currentStatus === 1 ? 0 : 1 } : game
          )
        );
        const newStatus = currentStatus === 1 ? 'deactivated' : 'activated';
        showToast(`Game ${newStatus} successfully`, 'success');
      } else {
        showToast(response.data.message || "Failed to update status", 'error');
      }
    } catch (err) {
      console.error("Error toggling game status:", err);
      showToast("Network error: Failed to update status", 'error');
    } finally {
      setUpdating(null);
    }
  };
// Add these functions after fetchEvents function:

const handleNextPage = () => {
  if (pagination.currentPage < pagination.totalPages) {
    const nextPage = pagination.currentPage + 1;
    fetchEvents(nextPage, pagination.itemsPerPage, searchTerm);
  }
};

const handlePrevPage = () => {
  if (pagination.currentPage > 1) {
    const prevPage = pagination.currentPage - 1;
    fetchEvents(prevPage, pagination.itemsPerPage, searchTerm);
  }
};

const handlePageClick = (page) => {
  if (page >= 1 && page <= pagination.totalPages) {
    fetchEvents(page, pagination.itemsPerPage, searchTerm);
  }
};

// Page numbers generate karne ke liye function
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
          onChange={() => toggleGameStatus(gameId, status)}
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
        <div className="card-header bg-color-black p-2 text-white d-flex justify-content-between align-items-center">
          <h3 className="card-title mb-0">All InActive Event List</h3>
          <div>
            <button className="refeshbutton" onClick={() => navigate("/active_events")}>
              ← Back
            </button>
            {/* <button className="btn btn-outline-light" onClick={() => setFilter(prev => !prev)}>
              <MdFilterListAlt /> Filter
            </button> */}
          </div>
        </div>
        {filter && (
          <div className="card-body border-bottom">
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label">Search by Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Type name..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>

              {/* ✅ YEH SECTION ADD KARO */}
              <div className="col-md-3">
                <label className="form-label">Completion Status</label>
                <select
                  className="form-select"
                  value={filters.is_completed}
                  onChange={(e) => setFilters(prev => ({ ...prev, is_completed: e.target.value }))}
                >
                  <option value="">All</option>
                  <option value="1">Completed</option>
                  <option value="0">Not Completed</option>
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label">In-Play Status</label>
                <select
                  className="form-select"
                  value={filters.is_inplay}
                  onChange={(e) => setFilters(prev => ({ ...prev, is_inplay: e.target.value }))}
                >
                  <option value="">All</option>
                  <option value="1">In-Play</option>
                  <option value="0">Not In-Play</option>
                </select>
              </div>

              <div className="col-md-3 d-flex align-items-end gap-2">
                <button className="btn btn-primary" onClick={applyFilters}>Apply Filters</button>
                <button className="btn btn-secondary" onClick={resetFilters}>Reset</button>
              </div>
            </div>
          </div>
        )}




        {/* Table */}
        <div className="card-body table-responsive">
{games.length > 0 && (
          <div className="row mb-3">
            <div className="col-md-6">
              <div className="d-flex">
                <div className="input-group me-2" style={{ width: "300px" }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search events..."
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
              </div>

              {searchTerm && (
                <div className="mt-2">
                  <small className="text-muted">
                    Search results for: <strong>"{searchTerm}"</strong>
                  </small>
                </div>
              )}
            </div>
          </div>
)}
          <div className="table-responsive">

            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Sr</th>
                  <th>Name</th>
                  <th>Date&Time</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {games.length > 0 ? games.map((game, index) => (
                  <tr key={game._id}>
                    <td>{((pagination.currentPage - 1) * pagination.itemsPerPage) + (index + 1)}</td>
                    <td>
                      {game.name}
                    </td>
                    <td> {game.date_time}</td>
                    <td>{getStatusBadge(game.status)}</td>
                    <td className="d-flex align-items-center gap-2">

                      <ToggleSwitch
                        gameId={game._id}
                        //   status={game.status}
                        disabled={updating === game._id}
                      />
                      {updating === game._id && (
                        <div className="spinner-border spinner-border-sm text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      )}
                      {/* <button
                      className="btn btn-sm btn-danger"
                      onClick={() => deleteMatch(game._id)}
                    >
                      Delete
                    </button> */}
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

        </div>
   {pagination.totalItems > pagination.itemsPerPage && (
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


      </div>
    </div>
  );
}

export default InActiveEvents;

