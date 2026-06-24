import { Link, useParams, useLocation } from "react-router-dom"; // ✅ useLocation add karo
import React, { useState, useEffect } from "react";
import { MdFilterListAlt, MdMoreVert } from "react-icons/md";
import Swal from "sweetalert2";
import Toast from "../../User/Toast";
import { getAllEvents, toggleEventStatus, toggleCompletedStatus } from "../../Server/api";
function ActiveEvents() {
    const [filter, setFilter] = useState(false);
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updating, setUpdating] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
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

    const fetchEvents = async (page = pagination.page, limit = pagination.limit) => {
        try {
            setLoading(true);
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
                // const activeEvents = response.data.data.filter(game => game.status === 1) || [];
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

    const showToast = (message, type = 'success') => setToast({ show: true, message, type });
    const hideToast = () => setToast({ show: false, message: '', type: '' });

    useEffect(() => {
        fetchEvents(1, pagination.limit);
    }, [sportId, seriesId]);

    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, page: newPage }));
        fetchEvents(newPage, pagination.limit);
    };

    const applyFilters = () => {
        setPagination(prev => ({ ...prev, page: 1 }));
        fetchEvents(1, pagination.limit);
    };
    const resetFilters = () => {
        setFilters({ search: "", is_completed: "", 
    is_inplay: "" });
        setPagination(prev => ({ ...prev, page: 1 }));
        fetchEvents(1, pagination.limit);
    };
    const handleRefresh = () => {
        fetchEvents(1, pagination.limit);
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
                            is_inplay: newStatus === "inplay" ? 1 : 0,      // ✅ YEH CORRECT KARO
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
        const isActive = status === 1; // 1 = Active, 0 = Inactive
        return (
            <span className={`fw-bold ${isActive ? 'text-success' : 'text-danger'} me-2`}>
                {isActive ? 'Active' : 'Inactive'}
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
                        cursor: disabled ? 'not-allowed' : 'pointer',
                    }}
                />
                <label className="form-check-label small fw-bold mb-0">
                    {isActive ? 'Active' : 'Inactive'}
                </label>
            </div>
        );
    };

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
                    <h3 className="card-title mb-0">All Active Event List</h3>
                    <div>
                        <button className="btn btn-info me-2" onClick={handleRefresh}>Refresh</button>
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
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {games.length > 0 ? games.map((game, index) => (
                                <tr key={game._id}>
                                    <td>{(pagination.page - 1) * pagination.limit + index + 1}</td> {/* ✅ YEH LINE CHANGE KARO */}
                                    <td>
                                        {game.name}
                                    </td>
                                    <td>{getStatusBadge(game.status)}</td>
                                    <td className="d-flex align-items-center gap-2">
                                        <button className="btn btn-import">Import Event</button>
                                        <ToggleSwitch
                                            gameId={game._id}
                                            status={game.status}
                                            disabled={updating === game._id}
                                        />
                                        <select
                                            className="form-select form-select-sm"
                                            value={game.is_completed === 1 ? "complete" : "inplay"}
                                            onChange={(e) => handleCompletedChange(game._id, e.target.value)}
                                            disabled={updating === game._id}
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
                {pagination.total > 0 && (
                    <div className="card-footer">
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="text-muted">
                                Page {pagination.page} of {pagination.totalPages} • Total: {pagination.total} events
                            </span>
                            <div className="d-flex gap-2">
                                <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => handlePageChange(pagination.page - 1)}
                                    disabled={pagination.page === 1}
                                >
                                    Previous
                                </button>
                                <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                    disabled={pagination.page === pagination.totalPages}
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

export default ActiveEvents;