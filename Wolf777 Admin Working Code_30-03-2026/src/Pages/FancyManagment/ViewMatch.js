import { Link, useParams, useLocation } from "react-router-dom"; // ✅ useLocation add karo
import React, { useState, useEffect } from "react";
import { MdFilterListAlt, MdMoreVert, MdRefresh } from "react-icons/md";
import Swal from "sweetalert2";
import Toast from "../../User/Toast";
import { getExternalmatch } from "../../Server/api";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import {
    FiSearch
} from "react-icons/fi";
function ViewMatch() {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [error, setError] = useState("");
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    // const sportId = searchParams.get('sportId');
    // const seriesId = searchParams.get('seriesId');
    const [filters, setFilters] = useState({ search: "" });
    const [searchInput, setSearchInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    const hasActiveFilters = searchTerm !== "";

    const [pageLoading, setPageLoading] = useState(true);
    const [tableLoading, setTableLoading] = useState(false);
    const [paginationData, setPaginationData] = useState({
        current_page: 1,
        limit: 50,
        total_records: 0,
        total_pages: 1
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    // const fetchEvents = async (page = pagination.page, limit = pagination.limit) => {
    //     try {
    //         setLoading(true);
    //         const params = {
    //             page,
    //             limit,
    //             ...filters
    //         };
    //         // const response = await getAllEvents(sportId, seriesId, params);
    //         const response = await getExternalEvents(params);
    //         if (response.data.success) {
    //             setEvents(response.data.data || []);
    //             if (response.data.pagination) {
    //                 setPagination(prev => ({
    //                     ...prev,
    //                     page: response.data.pagination.page,
    //                     total: response.data.pagination.total,
    //                     totalPages: response.data.pagination.totalPages
    //                 }));
    //             }
    //             setError("");
    //         } else {
    //             setError(response.data.message);
    //             showToast(response.data.message);
    //         }
    //     } catch (err) {
    //         console.error("Error fetching events:", err);
    //         setError("Failed to fetch events");
    //         showToast("Network error: Failed to fetch events", 'error');
    //     } finally {
    //         setLoading(false);
    //     }
    // };


    useEffect(() => {
        fetchEvents(currentPage, itemsPerPage);
    }, [currentPage, itemsPerPage, filters]);



    const fetchEvents = async (page = 1, limit = 10, searchValue = null) => {
        try {

            const params = {
                page,
                limit,
                ...filters
            };
            if (searchValue !== null) {
                params.search = searchValue;
            } else if (searchTerm.trim() !== "") {
                params.search = searchTerm.trim();
            }

            const response = await getExternalmatch(params);

            if (response.data.success) {
                setEvents(response.data.data || []);
                if (response.data.pagination) {
                    const pagination = response.data.pagination;
                    setPaginationData({
                        current_page: pagination.page || page,
                        limit: pagination.limit || limit,
                        total_records: pagination.total || 0,
                        total_pages: pagination.totalPages || 1
                    });

                    // setCurrentPage(pagination.page || page);
                    setTotalPages(pagination.totalPages || 1);
                    setTotalItems(pagination.total || 0);
                }

                setError("");
            } else {
                setError(response.data.message);
                showToast(response.data.message);
            }
        } catch (err) {
            console.error("Error fetching events:", err);
            setError("Failed to fetch events");
            showToast("Network error: Failed to fetch events", 'error');
        } finally {
            setPageLoading(false);
            setTableLoading(false);
        }
    };





    const handleSearchInputChange = (e) => {
        setSearchInput(e.target.value);
    };

    const handleSearch = () => {
        const trimmed = searchInput.trim();

        // state update
        setSearchTerm(trimmed);

        // page reset
        setCurrentPage(1);

        // Yahi main fix hai: trimmed ko direct bhejo
        fetchEvents(1, itemsPerPage, trimmed);
    };



    const handleSearchKeyPress = (e) => {
        if (e.key === "Enter") handleSearch();
    };
    const handleClearAllFilters = () => {
        setSearchInput("");
        setSearchTerm("");
        setPaginationData(prev => ({ ...prev, current_page: 1 }));

        fetchEvents(1, paginationData.limit, "");
        ;
    };
    const handleClearSearch = () => {
        setSearchInput("");
        setSearchTerm("");
        setCurrentPage(1);
        fetchEvents(1, itemsPerPage, "");
    };


    const handleFilterChange = (key, value) => {
        setCurrentPage(1);
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };
    // const applyFilters = () => {
    //     setPaginationData(prev => ({ ...prev, page: 1 }));
    //     fetchEvents(1, paginationData.limit);
    // };

    const applyFilters = () => {
        setCurrentPage(1);
        fetchEvents(1, itemsPerPage);
    };

    const resetFilters = () => {
        setFilters({
            search: "",
            is_completed: "",
            is_inplay: ""
        });
        setPaginationData(prev => ({ ...prev, page: 1 }));
        fetchEvents(1, paginationData.limit);
    };
    const handlePrev = () => {
        if (currentPage > 1) {
            const prevPage = currentPage - 1;
            setCurrentPage(prevPage);
            // fetchEvents(prevPage, itemsPerPage);
        }
    };
    const handlePageClick = (page) => {
        if (page >= 1 && page <= totalPages) {
            // fetchEvents(page, itemsPerPage); 
        }
    };
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 2;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
            let end = Math.min(totalPages, start + maxVisiblePages - 1);

            if (end - start + 1 < maxVisiblePages) {
                start = Math.max(1, end - maxVisiblePages + 1);
            }

            for (let i = start; i <= end; i++) {
                pageNumbers.push(i);
            }
        }

        return pageNumbers;
    };

    const showToast = (message, type = 'success') => setToast({ show: true, message, type });
    const hideToast = () => setToast({ show: false, message: '', type: '' });


    const getStatusBadge = (status) => {
        const isActive = status === 1; // 1 = Active, 0 = Inactive
        return (
            <span className={`fw-bold ${isActive ? 'text-success' : 'text-danger'} me-2`}>
                {isActive ? 'Active' : 'Inactive'}
            </span>
        );
    };

    const handleViewMatch = (match) => {
        navigate(`/view_fancy/${match.id}`);
    };

    const handleViewResult = (match) => {
        navigate(`/view_result/${match.id}`);
    };


    if (pageLoading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-primary" />
                <p>Loading page...</p>
            </div>
        );
    }

    // Error state
    if (error) return (
        <div className="text-center mt-3 text-danger">
            <p>{error}</p>
            <button className="btn btn-primary" onClick={fetchEvents}>Retry</button>
        </div>
    );
    const formatDateTime = (dateString) => {
        const date = new Date(dateString);

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");
        const ampm = hours >= 12 ? "pm" : "am";
        hours = hours % 12 || 12;
        return `${day}-${month}-${year} ${hours}:${minutes}:${seconds} ${ampm}`;
    };

    return (
        <div className="">
            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={hideToast}
                />
            )}
            <div className="card">
                <div className="card-header bg-color-black p-2 text-white d-flex justify-content-between align-items-center">
                    <h3 className="card-title mb-0">All Matches List</h3>
                    <div>
                        {/* <button
                            type="button"
                            className="backbutton"
                            // onClick={() => fetchEvents(1, itemsPerPage, true)}
                             onClick={() => navigate(-1)}
                        >
                            <MdRefresh size={20} />
                        </button> */}


                        <button className="backbutton" onClick={() => navigate("/fancy_Managment")}>
                            Back
                        </button>
                        {/* <button className="backbutton" onClick={() => setFilter(prev => !prev)}>
                            <MdFilterListAlt /> Filter
                        </button> */}
                    </div>
                </div>


                <div className="card-body ">

                    {events.length > 0 && (
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

                    )}


                    <div className="table-responsive">
                        <table className="table table-bordered table-hover">
                            <thead className="table-dark">
                                <tr>
                                    <th>Sr</th>
                                    <th>Name</th>
                                    <th>Date & Time</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableLoading ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4">
                                            <div className="spinner-border spinner-border-sm text-primary" />
                                            <span className="ms-2">Refreshing data...</span>
                                        </td>
                                    </tr>
                                ) : events.length > 0 ? (
                                    events.map((game, index) => (
                                        <tr key={game._id}>
                                            <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>

                                            <td>
                                                <span className="fs-5">{game.name}</span>
                                                <br />
                                                <span className="text-success">{game.series_name}</span>
                                            </td>

                                            <td>{game.date_time}</td>

                                            <td>{getStatusBadge(game.status)}</td>

                                            <td className="d-flex align-items-center gap-2">
                                                <button
                                                    className="importbutton"
                                                    onClick={() => handleViewResult(game)}
                                                >
                                                    Result
                                                </button>

                                                {/* <button
                                                    className="importbutton"
                                                    onClick={() => handleViewMatch(game)}
                                                >
                                                    Fancy Status
                                                </button> */}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4">
                                            No games found
                                            <br />
                                            <button
                                                className="refreshbuttonall mt-2"
                                                onClick={() => fetchEvents(1, itemsPerPage, true)}
                                            >
                                                Refresh
                                            </button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>

                        </table>
                    </div>



                    {/* Simple Pagination (Prev / Next only) */}
                    {totalPages > 1 && (
                        <div className="d-flex justify-content-between align-items-center mt-4">
                            <div className="sohwingallentries">
                                Showing {((currentPage - 1) * itemsPerPage) + 1} to{" "}
                                {Math.min(currentPage * itemsPerPage, totalItems)}
                            </div>

                            <div className="paginationall d-flex align-items-center gap-1">

                                <button
                                    disabled={currentPage === 1}
                                    onClick={handlePrev}
                                    className={`paginationarrow ${currentPage === 1 ? "disabled" : ""}`}
                                >
                                    <MdOutlineKeyboardArrowLeft />
                                </button>

                                <div className="d-flex gap-1">
                                    {getPageNumbers().map((page) => (
                                        <div
                                            key={page}
                                            className={`paginationnumber ${currentPage === page ? "active" : ""
                                                }`}
                                            onClick={() => handlePageClick(page)}
                                        >
                                            {page}
                                        </div>
                                    ))}
                                </div>
                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={handleNext}
                                    className={`paginationarrow ${currentPage === totalPages ? "disabled" : ""}`}
                                >
                                    <MdOutlineKeyboardArrowRight />
                                </button>

                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

export default ViewMatch;