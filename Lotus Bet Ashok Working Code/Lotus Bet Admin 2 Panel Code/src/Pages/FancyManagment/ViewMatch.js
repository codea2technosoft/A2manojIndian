import { Link, useParams, useLocation } from "react-router-dom"; // ✅ useLocation add karo
import React, { useState, useEffect } from "react";
import { MdFilterListAlt, MdMoreVert } from "react-icons/md";
import Swal from "sweetalert2";
import Toast from "../../User/Toast";
import { getExternalEvents } from "../../Server/api";
import { useNavigate } from "react-router-dom";
import {Button } from "react-bootstrap";

function ViewMatch() {
    const navigate = useNavigate();
    const [filter, setFilter] = useState(false);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updating, setUpdating] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const { matchId } = useParams();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const sportId = searchParams.get('sportId');
    const seriesId = searchParams.get('seriesId');
    const [filters, setFilters] = useState({
        status: "",
        search: "",
    });
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    });


    const fetchEvents = async (page = pagination.page, limit = pagination.limit) => {
        try {
            setLoading(true);
            const params = {
                page,
                limit,
                ...filters
            };
            // const response = await getAllEvents(sportId, seriesId, params);
            const response = await getExternalEvents(sportId, seriesId, params);
            if (response.data.success) {
                setEvents(response.data.data || []);
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
                setError(response.data.message || "Failed to fetch events");
                showToast(response.data.message || "Failed to fetch events", 'error');
            }
        } catch (err) {
            console.error("Error fetching events:", err);
            setError("Failed to fetch events");
            showToast("Network error: Failed to fetch events", 'error');
        } finally {
            setLoading(false);
        }
    };
    const showToast = (message, type = 'success') => setToast({ show: true, message, type });
    const hideToast = () => setToast({ show: false, message: '', type: '' });

    useEffect(() => {
        if (sportId && seriesId) fetchEvents();
    }, [sportId, seriesId]);



    const getStatusBadge = (status) => {
        const isActive = status === 1; // 1 = Active, 0 = Inactive
        return (
            <span className={`fw-bold ${isActive ? 'text-success' : 'text-danger'} me-2`}>
                {isActive ? 'Active' : 'Inactive'}
            </span>
        );
    };

    //      const handleView = (match) => { // ✅ Pure game object pass karein
    //     navigate(`/view_match/${match._id}?sportId=${match.sport_id}&seriesId=${match.series_id}`);
    //   };
    //   const handleViewMatch = (match) => {
    //   navigate(`/view_fancy/${match.id}`);
    // };
    const handleViewMatch = (match) => {
        navigate(`/view_fancy/${match.id}`);
    };

    const handleViewResult = (match) => {
        navigate(`/view_result/${match.id}`); // event_id = match.id
    };


    if (loading) return (
        <div className="text-center mt-3">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading events...</p>
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
                    <h3 className="card-title mb-0">All Matches List</h3>
                    <div>
                        <Button variant="secondary" onClick={() => navigate("/fancy_Managment")}>
                            ← Back
                        </Button>
                        <button className="btn btn-outline-light" onClick={() => setFilter(prev => !prev)}>
                            <MdFilterListAlt /> Filter
                        </button>
                    </div>
                </div>

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
                            {events.length > 0 ? events.map((game, index) => (
                                <tr key={game._id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        {game.name}
                                    </td>
                                    <td>{getStatusBadge(game.status)}</td>
                                    <td className="d-flex align-items-center gap-2">
                                        <button className="btn btn-import " onClick={() => handleViewResult(game)}>Result</button>
                                        <button className="btn btn-import"
                                            onClick={() => handleViewMatch(game)}
                                        >Fancy Status</button>
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
            </div>
        </div>
    );
}

export default ViewMatch;