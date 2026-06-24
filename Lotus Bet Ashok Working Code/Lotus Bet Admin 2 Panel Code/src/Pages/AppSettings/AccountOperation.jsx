import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    Table,
    Card,
    Spinner,
    Form
} from "react-bootstrap";

const Accountoperation = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [loading, setLoading] = useState(false);
    const [operationData, setOperationData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [limit] = useState(10);

    const token = localStorage.getItem("token");
    const toastShownRef = useRef(false);

    // Fetch operation data
    useEffect(() => {
        if (!toastShownRef.current) {
            toastShownRef.current = true;
        }
        fetchOperationData();
    }, [currentPage, searchTerm]);

    const fetchOperationData = async () => {
        try {
            setLoading(true);

            // Corrected API call with params
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/get-account-operation-all`,
                {
                    params: {
                        page: currentPage,
                        limit: limit,
                        search: searchTerm || undefined
                    },
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log("API Response:", response.data);

            if (response.data.success) {
                const data = response.data.data || [];
                const count = response.data.count || 0;

                // Set pagination
                setTotalRecords(count);
                setTotalPages(Math.ceil(count / limit) || 1);

                // Format the data as shown in the image
                const formattedData = data.map((item, index) => {
                    // Format date to match the image format (DD-MMM-YYYY HH:MM PM/AM)
                    const formatDateTime = (dateString) => {
                        if (!dateString) return "N/A";

                        try {
                            const dateObj = new Date(dateString);

                            // Check if date is valid
                            if (isNaN(dateObj.getTime())) {
                                return "Invalid Date";
                            }

                            // Format as DD-MMM-YYYY HH:MM AM/PM
                            const day = dateObj.getDate().toString().padStart(2, '0');
                            const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
                                'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
                            const month = monthNames[dateObj.getMonth()];
                            const year = dateObj.getFullYear();

                            // Format time in 12-hour format
                            let hours = dateObj.getHours();
                            const minutes = dateObj.getMinutes().toString().padStart(2, '0');
                            const ampm = hours >= 12 ? 'PM' : 'AM';
                            hours = hours % 12;
                            hours = hours ? hours.toString().padStart(2, '0') : '12'; // the hour '0' should be '12'

                            return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
                        } catch (error) {
                            console.error("Error formatting date:", error);
                            return "Date Error";
                        }
                    };

                    // Determine operation type color based on operation name
                    const getOperationType = (operation) => {
                        if (!operation) return "secondary";

                        const op = operation.toLowerCase();
                        if (op.includes("block")) return "dangerbadge";
                        if (op.includes("unblock")) return "successbadge";
                        if (op.includes("update")) return "warningbadge";
                        if (op.includes("create")) return "infobadge";
                        if (op.includes("delete")) return "darkbadge";
                        if (op.includes("password")) return "primarybadge";
                        if (op.includes("commission")) return "bonusbadge";

                        return "secondary";
                    };

                    return {
                        id: item._id || `item-${index}`,
                        date: formatDateTime(item.created_at),
                        operation: item.operation || "Operation",
                        description: item.description || "No description",
                        performedBy: item.performed_by?.name || "Unknown",
                        performedById: item.performed_by?.admin_id || "N/A",
                        adminId: item.admin_id || "N/A",
                        operationType: getOperationType(item.operation || ""),
                        rawDate: item.created_at
                    };
                });

                setOperationData(formattedData);
            } else {
                if (!toastShownRef.current) {
                    toast.error(response.data.message || "Failed to load data");
                }
            }
        } catch (error) {
            console.error("Error fetching operation data:", error);

            if (!toastShownRef.current) {
                if (error.response?.status === 401) {
                    toast.error("Session expired. Please login again.");
                    navigate("/login");
                } else {
                    toast.error(error.response?.data?.message || "Failed to load operation data");
                }
            }
        } finally {
            setLoading(false);
            toastShownRef.current = false;
        }
    };

    // Handle search
    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        setCurrentPage(1); // Reset to first page when searching
    };

    // Filter data based on search term
    const filteredData = operationData.filter(item => {
        if (!searchTerm) return true;
        
        const term = searchTerm.toLowerCase();
        return (
            item.description.toLowerCase().includes(term) ||
            item.operation.toLowerCase().includes(term) ||
            item.performedBy.toLowerCase().includes(term) ||
            item.adminId.toLowerCase().includes(term) ||
            item.performedById.toLowerCase().includes(term)
        );
    });

    // Pagination handlers
    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const handlePageClick = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
            let end = Math.min(totalPages, start + maxVisiblePages - 1);

            if (end - start + 1 < maxVisiblePages) {
                start = end - maxVisiblePages + 1;
            }

            for (let i = start; i <= end; i++) {
                pageNumbers.push(i);
            }
        }

        return pageNumbers;
    };

    // Get paginated data
    const getPaginatedData = () => {
        const startIndex = (currentPage - 1) * limit;
        const endIndex = startIndex + limit;
        return filteredData.slice(startIndex, endIndex);
    };

    // Clear search
    const clearSearch = () => {
        setSearchTerm("");
        setCurrentPage(1);
    };

    // Refresh data
    const refreshData = () => {
        fetchOperationData();
        toast.success("Data refreshed successfully!");
    };

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={500}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                limit={3}
            />

            <div className="container-fluid">
                <div className="card">
                    <div className="card-header bg-color-black text-white d-flex justify-content-between align-items-center">
                        <h5 className="mb-0 card-title text-white">
                            <i className="fas fa-history me-2"></i>
                            Account Operations 
                        </h5>
                        <div className="d-flex align-items-center gap-2">
                            <Form.Control
                                type="text"
                                placeholder="Search operations..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="me-2"
                                style={{ width: '250px' }}
                            />
                            {searchTerm && (
                                <button
                                    onClick={clearSearch}
                                    className="btn btn-sm btn-outline-light me-2"
                                >
                                    Clear
                                </button>
                            )}
                            <button
                                onClick={refreshData}
                                className="backbutton me-2"
                                title="Refresh"
                            >
                                <i className="fas fa-sync-alt me-1"></i>
                                Refresh
                            </button>
                            <button
                                className="backbutton"
                                onClick={() => navigate(-1)}
                            >
                                Back
                            </button>
                        </div>
                    </div>

                    <div className="card-body">
                        {loading ? (
                            <div className="text-center py-5">
                                <Spinner animation="border" variant="primary" />
                                <p className="mt-2">Loading operation data...</p>
                            </div>
                        ) : filteredData.length === 0 ? (
                            <div className="text-center py-5">
                                <i className="fas fa-clipboard-list fa-3x text-muted mb-3"></i>
                                <h5>NO OPERATION RECORDS FOUND</h5>
                                <p className="text-muted">
                                    {searchTerm ? "No matching operations found for your search" : "No operation logs available"}
                                </p>
                                {searchTerm && (
                                    <button
                                        onClick={clearSearch}
                                        className="refreshbutton"
                                    >
                                        Clear Search
                                    </button>
                                )}
                            </div>
                        ) : (
                            <>
                                {/* Operations Table */}
                                <div className="table-responsive">
                                    <Table striped bordered hover className="mb-0">
                                        <thead className="table-dark">
                                            <tr>
                                                <th width="200">DATE</th>
                                                <th width="250">OPERATION</th>
                                                <th>DESCRIPTION</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {getPaginatedData().map((item) => (
                                                <tr key={item.id}>
                                                    <td className="text-nowrap">
                                                        <div className="fw-semibold">{item.date}</div>
                                                    </td>
                                                    <td>
                                                        <div
                                                            className={`badgenew ${item.operationType}`}
                                                        >
                                                            {item.operation}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="mb-1" style={{ fontSize: '0.95rem' }}>
                                                            {item.description}
                                                        </div>
                                                        <div className="text-muted small mt-1">
                                                            <span className="me-3">
                                                                <i className="fas fa-user me-1"></i>
                                                                {item.performedBy} ({item.performedById})
                                                            </span>
                                                            <span>
                                                                <i className="fas fa-id-card me-1"></i>
                                                                Admin ID: {item.adminId}
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="d-flex justify-content-between align-items-center mt-4">
                                        <div className="sohwingallentries">
                                            Showing {((currentPage - 1) * limit) + 1} to{" "}
                                            {Math.min(currentPage * limit, filteredData.length)} of{" "}
                                            {filteredData.length} entries
                                            {searchTerm && " (filtered)"}
                                        </div>

                                        <div className="paginationall d-flex align-items-center gap-1">
                                            <button
                                                disabled={currentPage === 1}
                                                onClick={handlePrev}
                                                className="btn btn-sm btn-outline-primary"
                                            >
                                                &laquo;
                                            </button>

                                            <div className="d-flex gap-1">
                                                {getPageNumbers().map((page) => (
                                                    <button
                                                        key={page}
                                                        className={`btn btn-sm ${currentPage === page ? "btn-primary" : "btn-outline-primary"}`}
                                                        onClick={() => handlePageClick(page)}
                                                    >
                                                        {page}
                                                    </button>
                                                ))}
                                            </div>

                                            <button
                                                disabled={currentPage === totalPages}
                                                onClick={handleNext}
                                                className="btn btn-sm btn-outline-primary"
                                            >
                                                &raquo;
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Search Info */}
                                {searchTerm && filteredData.length > 0 && (
                                    <div className="alert alert-info mt-3 py-2">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <small>
                                                <i className="fas fa-info-circle me-1"></i>
                                                Showing {filteredData.length} results for: "{searchTerm}"
                                            </small>
                                            <button
                                                onClick={clearSearch}
                                                className="btn btn-sm btn-outline-info"
                                            >
                                                Clear Search
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    <div className="card-footer bg-light">
                        <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">
                                <i className="fas fa-database me-1"></i>
                                Last updated: {new Date().toLocaleTimeString()}
                            </small>
                            <small className="text-muted">
                                Total Records: {totalRecords}
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Accountoperation;