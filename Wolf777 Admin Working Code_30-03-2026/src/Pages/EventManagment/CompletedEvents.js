import { Link, useParams, useLocation } from "react-router-dom"; // ✅ useLocation add karo
import React, { useState, useEffect } from "react";
import { MdFilterListAlt } from "react-icons/md";
import Swal from "sweetalert2";
import Toast from "../../User/Toast";
import { useNavigate } from "react-router-dom";
import { CompletedEventList, toggleEventStatus, toggleCompletedStatus } from "../../Server/api";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import {
    FiSearch
} from "react-icons/fi";
import { Button } from "react-bootstrap";
function CompletedEvents() {
    const navigate = useNavigate();
    const [filter, setFilter] = useState(false);
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updating, setUpdating] = useState(null);
    const [editableEventId, setEditableEventId] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const sportId = searchParams.get('sportId');
    const seriesId = searchParams.get('seriesId');
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [filters, setFilters] = useState({
        name: "",
    });
    const hasActiveFilters = filters.code !== "" || filters.name !== "";
    const [searchTerm, setSearchTerm] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    // Fetch games from API
    const fetchEvents = async () => {
        try {
            setLoading(true);

            const response = await CompletedEventList();

            if (response.data?.success) {
                const apiData = response.data.data || [];

                console.log("Fetched Completed Events:", apiData);
                setGames(apiData);
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
    // Toast helpers
    const showToast = (message, type = 'success') => setToast({ show: true, message, type });
    const hideToast = () => setToast({ show: false, message: '', type: '' });

    useEffect(() => {
        fetchEvents();
    }, []);



    const handleClearAllFilters = () => {
        if (filters.name !== "") {
            setFilters({ name: "" });
            fetchEvents(1, itemsPerPage, searchTerm, { name: "" });
        }
    };
    const handleSearch = () => {
        if (searchInput.trim() !== searchTerm) {
            fetchEvents(1, itemsPerPage, searchInput.trim(), filters);
        }
    };

    const handleClearSearch = () => {
        if (searchTerm !== "" || filters.name !== "") {
            setSearchInput("");
            setFilters({ name: "" });
            fetchEvents(1, itemsPerPage, "", { name: "" });
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
                <div className="card-header bg-color-black p-2 text-white d-flex justify-content-between align-items-center">
                    <h3 className="card-title mb-0">Completed Event List</h3>
                    <div>
                        <button className="backbutton" onClick={() => navigate("/active_events")}>
                            ← Back
                        </button>
                        {/* <button className="btn btn-outline-light" onClick={() => setFilter(prev => !prev)}>
                            <MdFilterListAlt /> Filter
                        </button> */}
                    </div>
                </div>

                {/* Table */}
                <div className="card-body ">
                    {/* {games.length > 0 && (
                        <div className="row mb-3">
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
                    )} */}

                    <div className="table-responsive">
                        <table className="table table-bordered table-hover">
                            <thead className="table-dark">
                                <tr>
                                    <th>Sr</th>
                                    <th>Name</th>
                                    <th>Date&Time</th>
                                    {/* <th>Status</th> */}
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
                                        <td>{game.date_time}</td>
                                        {/* <td>{getStatusBadge(game.status)}</td> */}
                                        <td className="d-flex align-items-center gap-2">
                                            {/* <ToggleSwitch
                                            gameId={game._id}
                                            status={game.status}
                                            disabled={updating === game._id}
                                        /> */}

                                            {/* <select
                                            className="form-select form-select-sm"
                                            value={game.is_completed === 1 ? "Completed" : "In Progress"}
                                            disabled 
                                            style={{ width: "120px" }}
                                        >
                                            <option value={game.is_completed === 1 ? "Completed" : "In Progress"}>
                                                {game.is_completed === 1 ? "Completed" : "In Progress"}
                                            </option>
                                        </select> */}

                                            <select
                                                className="form-select form-select-sm"
                                                value={game.is_completed === 1 ? "complete" : "inplay"}
                                                onChange={(e) => handleCompletedChange(game._id, e.target.value)}
                                                disabled={updating === game._id || editableEventId !== game._id}
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




                </div>
            </div>
        </div>
    );
}

export default CompletedEvents;