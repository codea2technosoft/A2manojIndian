import { Link, useParams, useLocation } from "react-router-dom"; // ✅ useLocation add karo
import React, { useState, useEffect } from "react";
import { MdFilterListAlt } from "react-icons/md";
// import { Link } from "react-router";
import axios from "axios";
import Toast from "../../User/Toast";
import { getAllEvents } from "../../Server/api";
import { useNavigate } from "react-router-dom";
import {Button } from "react-bootstrap";

function InActiveEvents() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState(false);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [filters, setFilters] = useState({
    search: "",
    is_completed: "",
    is_inplay: ""
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  // ✅ URL se sportId aur seriesId extract karo
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const sportId = searchParams.get('sportId');
  const seriesId = searchParams.get('seriesId');

  // Fetch games from API
  const fetchEvents = async (page = pagination.page, limit = pagination.limit) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit,
        search: filters.search, // ✅ YEH ADD KARO
        status: 0, // ✅ Always inactive events
        is_completed: filters.is_completed,
        is_inplay: filters.is_inplay
      };

      const response = await getAllEvents(sportId, seriesId, params);
      if (response.data.success) {
        // const inactiveEvents = response.data.data.filter(game=>game.status === 0)||[];
        setGames(response.data.data || []);
        if (response.data.pagination) {
          setPagination(prev => ({
            ...prev,
            page: response.data.pagination.page,
            total: response.data.pagination.total,
            totalPages: response.data.pagination.totalPages
          }));
        }
        setError("");
      } else {
        setError(response.data.message || "Failed to fetch games");
        showToast(response.data.message || "Failed to fetch games", 'error');
      }
    } catch (err) {
      console.error("Error fetching games:", err);
      setError("Failed to fetch games");
      // showToast("Network error: Failed to fetch games", 'error');
    } finally {
      setLoading(false);
    }
  };


  const applyFilters = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchEvents(1, pagination.limit);
  };

  // ✅ Reset filters function CORRECT KARO
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
    fetchEvents();
  }, [sportId, seriesId]); // ✅ sportId ya seriesId change pe phir se fetch hoga

  // Toggle game status
  const toggleGameStatus = async (matchId, currentStatus) => {
    try {
      setUpdating(matchId);
      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}/matches/${matchId}/toggle-status`,
        { matchId },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: false
        }
      );

      if (response.data.success) {
        setGames(prev =>
          prev.map(game =>
            game._id === matchId ? { ...game, status: currentStatus === 1 ? 0 : 1 } : game
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
        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
          <h3 className="card-title mb-0">All InActive Event List</h3>
          <div>
                  <Button variant="secondary" onClick={() => navigate("/active_events")}>
      ← Back
    </Button>
            <button className="btn btn-outline-light" onClick={() => setFilter(prev => !prev)}>
              <MdFilterListAlt /> Filter
            </button>
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
                  <td>{index + 1}</td>
                  <td>
                    {game.name}
                  </td>
                  <td> {game.created_at}</td>
                  <td>{getStatusBadge(game.status)}</td>
                  <td className="d-flex align-items-center gap-2">
                    <button className="btn btn-import">Import Event</button>
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
                  <td colSpan="3" className="text-center py-4">
                    No games found
                    <br />
                    <button className="btn btn-primary mt-2" onClick={fetchEvents}>Refresh</button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* ✅ YEH PAGINATION SECTION ADD KARO InActiveEvents ke table ke baad */}
        {pagination.total > 0 && (
          <div className="card-footer">
            <div className="d-flex justify-content-between align-items-center">
              <span className="text-muted">
                Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)} • Total: {pagination.total} events
              </span>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => fetchEvents(pagination.page - 1, pagination.limit)}
                  disabled={pagination.page === 1}
                >
                  Previous
                </button>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => fetchEvents(pagination.page + 1, pagination.limit)}
                  disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default InActiveEvents;