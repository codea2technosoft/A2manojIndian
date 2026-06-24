import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    Table,
    Card,
    Spinner,
    Form,
    Button
} from "react-bootstrap";

const Profitlosspage = () => {
    const navigate = useNavigate();
    const { adminId } = useParams();
    const [loading, setLoading] = useState(false);
    const [statementData, setStatementData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [limit, setLimit] = useState(5);
    const [paginationData, setPaginationData] = useState({
        total_records: 0,
        total_pages: 1,
        current_page: 1,
        limit: 5
    });

    const [total, setTotal] = useState({
        credit: 0,
        debit: 0,
        netBalance: 0
    });

    const token = localStorage.getItem("token");

    // ============================
    // FETCH DATA WITH PAGINATION
    // ============================
    useEffect(() => {
        fetchStatementData();
    }, [currentPage, limit]); // Remove searchTerm from dependencies - we'll handle search locally

    const convertUTCToIST = (utcDateString) => {
        if (!utcDateString) return "N/A";

        const date = new Date(utcDateString);
        
        // Convert to IST (UTC+5:30)
        const istOffset = 5.5 * 60 * 60 * 1000;
        const istDate = new Date(date.getTime() + istOffset);

        const day = istDate.getUTCDate().toString().padStart(2, '0');
        const month = (istDate.getUTCMonth() + 1).toString().padStart(2, '0');
        const year = istDate.getUTCFullYear();

        let hours = istDate.getUTCHours();
        const minutes = istDate.getUTCMinutes().toString().padStart(2, '0');
        const seconds = istDate.getUTCSeconds().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12;
        hours = hours ? hours : 12;
        hours = hours.toString().padStart(2, '0');

        return `${day}-${month}-${year} ${hours}:${minutes}:${seconds} ${ampm}`;
    };

    const fetchStatementData = async () => {
        try {
            setLoading(true);
            const loggedInAdminId = localStorage.getItem("admin_id") ;

            if (!loggedInAdminId) {
                toast.error("Admin ID not found");
                return;
            }

            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/get-statement-pl-master`,
                {
                    admin_id: loggedInAdminId, // Use actual logged-in admin ID
                    // admin_id: "AG1813", // Use actual logged-in admin ID
                    page: currentPage,
                    limit: limit,
                    search: searchTerm
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log("API Response:", response.data);

            if (response.data.success) {
                const data = response.data.data || [];
                const pagination = response.data.pagination || {
                    total_records: 0,
                    total_pages: 1,
                    current_page: 1,
                    limit: 5
                };

                // Set pagination data
                setPaginationData(pagination);
                setTotalPages(pagination.total_pages || 1);
                setTotalRecords(pagination.total_records || 0);
                setCurrentPage(pagination.current_page || 1);
                setLimit(pagination.limit || 5);

                // Format the data according to the actual API response
                const formattedData = data.map((item, index) => {
                    // Determine if this transaction involves the current admin
                    const loggedInAdminId = localStorage.getItem("admin_id") || adminId;
                    
                    // Check if current admin is sender or receiver
                    const isSender = item.from_admin_id === loggedInAdminId;
                    const isReceiver = item.to_admin_id === loggedInAdminId;
                    
                    // Determine credit/debit from current admin's perspective
                    let credit = 0;
                    let debit = 0;
                    let balance = 0;
                    let description = "";
                    
                    if (isReceiver) {
                        // Admin receives money (credit)
                        credit = parseFloat(item.amount) || 0;
                        balance = parseFloat(item.after_balance_to) || 0;
                        description = `Received from ${item.from_username || item.from_admin_id}`;
                    } else if (isSender) {
                        // Admin sends money (debit)
                        debit = parseFloat(item.amount) || 0;
                        balance = parseFloat(item.after_balance_from) || 0;
                        description = `Sent to ${item.to_username || item.to_admin_id}`;
                    } else {
                        // This shouldn't happen, but just in case
                        credit = parseFloat(item.credit) || 0;
                        debit = parseFloat(item.debit) || 0;
                        balance = parseFloat(item.after_balance_from) || parseFloat(item.after_balance_to) || 0;
                        description = "Transaction";
                    }

                    // Build description with all available info
                    let fullDescription = item.remark || description;
                    if (item.type) {
                        fullDescription = `${item.type}: ${fullDescription}`;
                    }
                    if (item.tr_type) {
                        fullDescription += ` (${item.tr_type})`;
                    }
                    if (item.tr_status) {
                        fullDescription += ` - ${item.tr_status}`;
                    }

                    return {
                        id: item._id || `item-${index}`,
                        date: convertUTCToIST(item.created_at),
                        description: fullDescription,
                        credit: credit,
                        debit: debit,
                        balance: balance,
                        type: item.type || "transaction",
                        tr_type: item.tr_type || "",
                        tr_status: item.tr_status || "",
                        from_admin_id: item.from_admin_id,
                        from_username: item.from_username,
                        to_admin_id: item.to_admin_id,
                        to_username: item.to_username,
                        amount: parseFloat(item.amount) || 0,
                        remark: item.remark || "",
                        payment_gateway_type: item.payment_gateway_type || "",
                        before_balance: isReceiver ? item.before_balance_to : item.before_balance_from,
                        after_balance: balance
                    };
                });

                // Sort by date (newest first)
                const sortedData = formattedData.sort((a, b) => 
                    new Date(b.date.split(' ')[0].split('-').reverse().join('-')) - 
                    new Date(a.date.split(' ')[0].split('-').reverse().join('-'))
                );

                setStatementData(sortedData);
                setFilteredData(sortedData);
                calculateTotals(sortedData);
            } else {
                toast.error(response.data.message || "Failed to load data");
            }
        } catch (error) {
            console.error("Error fetching statement data:", error);
            if (error.response?.status === 401) {
                toast.error("Session expired. Please login again.");
                navigate("/login");
            } else {
                toast.error(error.response?.data?.message || "Failed to load statement data");
            }
        } finally {
            setLoading(false);
        }
    };

    // ============================
    // TOTAL CALCULATION
    // ============================
    const calculateTotals = (data) => {
        const totals = {
            credit: 0,
            debit: 0,
            netBalance: 0
        };

        data.forEach(item => {
            totals.credit += parseFloat(item.credit) || 0;
            totals.debit += parseFloat(item.debit) || 0;
        });

        // Net balance should be the balance of the most recent transaction
        if (data.length > 0) {
            totals.netBalance = parseFloat(data[0].balance) || 0;
        }

        setTotal(totals);
    };

    // ============================
    // SEARCH FUNCTIONALITY
    // ============================
    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        
        // Filter locally
        if (term.trim() === "") {
            setFilteredData(statementData);
        } else {
            const filtered = statementData.filter(item => 
                item.description.toLowerCase().includes(term.toLowerCase()) ||
                item.type.toLowerCase().includes(term.toLowerCase()) ||
                item.tr_type.toLowerCase().includes(term.toLowerCase()) ||
                item.from_username?.toLowerCase().includes(term.toLowerCase()) ||
                item.to_username?.toLowerCase().includes(term.toLowerCase()) ||
                item.remark?.toLowerCase().includes(term.toLowerCase())
            );
            setFilteredData(filtered);
        }
    };

    const handleSearchSubmit = () => {
        // Reset to first page and fetch with search term
        setCurrentPage(1);
        fetchStatementData();
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearchSubmit();
        }
    };

    // ============================
    // PAGINATION HANDLERS
    // ============================
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

    const handleFirst = () => {
        setCurrentPage(1);
    };

    const handleLast = () => {
        setCurrentPage(totalPages);
    };

    const handlePageClick = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleLimitChange = (e) => {
        setLimit(parseInt(e.target.value));
        setCurrentPage(1);
    };

    const formatNumber = (num) => {
        return parseFloat(num || 0).toFixed(2);
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
                start = Math.max(1, end - maxVisiblePages + 1);
            }

            for (let i = start; i <= end; i++) {
                pageNumbers.push(i);
            }
        }

        return pageNumbers;
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
            />

            <div className="container-fluid">
                <div className="card">
                    <div className="card-header flex-wrap-mobile bg-color-black text-white d-flex justify-content-between align-items-center">
                        <h5 className="mb-0 card-title text-white">Profit/Loss</h5>
                        <div className="d-flex align-items-center">
                            <Form.Control
                                type="text"
                                placeholder="Search transactions..."
                                value={searchTerm}
                                onChange={handleSearch}
                                onKeyPress={handleKeyPress}
                                className="me-2"
                                style={{ width: '250px' }}
                            />
                            <Button 
                                variant="light" 
                                size="sm" 
                                onClick={handleSearchSubmit}
                                className="me-2"
                            >
                                Search
                            </Button>
                            <button
                                onClick={() => navigate(-1)}
                                className="backbutton"
                            >
                                Back
                            </button>
                        </div>
                    </div>

                    <Card.Body>
                        {loading ? (
                            <div className="text-center py-5">
                                <Spinner animation="border" variant="primary" />
                                <p className="mt-2">Loading statement data...</p>
                            </div>
                        ) : filteredData.length === 0 ? (
                            <div className="text-center py-5">
                                <h5>NO DATA</h5>
                                <p className="text-muted">No transaction records found</p>
                                {searchTerm && (
                                    <button
                                        onClick={() => {
                                            setSearchTerm("");
                                            setCurrentPage(1);
                                            fetchStatementData();
                                        }}
                                        className="refreshbutton"
                                    >
                                        Clear Search
                                    </button>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className="table-responsive">
                                    <Table striped bordered hover className="mb-0">
                                        <thead className="table-dark">
                                            <tr>
                                                <th>DATE (IST)</th>
                                                <th>DESCRIPTION</th>
                                                <th className="text-end">CREDIT (IN)</th>
                                                <th className="text-end">DEBIT (OUT)</th>
                                                <th className="text-end">BALANCE</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredData.map((item, index) => (
                                                <tr key={item.id}>
                                                    <td className="text-nowrap">{item.date}</td>
                                                    <td>
                                                        <div>{item.description}</div>
                                                        <small className="text-muted">
                                                            Type: {item.type} | {item.tr_type}
                                                            {item.from_username && ` | From: ${item.from_username}`}
                                                            {item.to_username && ` | To: ${item.to_username}`}
                                                            {item.tr_status && ` | Status: ${item.tr_status}`}
                                                        </small>
                                                    </td>
                                                    <td className="text-end text-success fw-semibold">
                                                        {item.credit > 0 ? `+${formatNumber(item.credit)}` : "0.00"}
                                                    </td>
                                                    <td className="text-end text-danger fw-semibold">
                                                        {item.debit > 0 ? `-${formatNumber(item.debit)}` : "0.00"}
                                                    </td>
                                                    <td className="text-end fw-bold">
                                                        {formatNumber(item.balance)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="table-secondary">
                                            <tr>
                                                <td colSpan="2" className="text-end fw-bold">TOTAL</td>
                                                <td className="text-end fw-bold text-success">
                                                    +{formatNumber(total.credit)}
                                                </td>
                                                <td className="text-end fw-bold text-danger">
                                                    -{formatNumber(total.debit)}
                                                </td>
                                                <td className="text-end fw-bold text-primary">
                                                    {formatNumber(total.netBalance)}
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </Table>
                                </div>

                                {/* Records per page selector */}
                                <div className="d-flex justify-content-between align-items-center mt-3">
                                    <div className="d-flex align-items-center">
                                        <Form.Select 
                                            size="sm" 
                                            style={{ width: '80px' }} 
                                            value={limit} 
                                            onChange={handleLimitChange}
                                        >
                                            <option value="5">5</option>
                                            <option value="10">10</option>
                                            <option value="25">25</option>
                                            <option value="50">50</option>
                                            <option value="100">100</option>
                                        </Form.Select>
                                        <span className="ms-2">entries per page</span>
                                    </div>
                                </div>

                                {/* Pagination UI */}
                                {totalPages > 1 && (
                                    <div className="d-flex justify-content-between align-items-center mt-4">
                                        <div className="showingentries">
                                            Showing {((currentPage - 1) * limit) + 1} to{" "}
                                            {Math.min(currentPage * limit, totalRecords)} of {totalRecords} entries
                                        </div>

                                        <div className="paginationall d-flex align-items-center gap-1">
                                            <button
                                                className="pagination-btn"
                                                disabled={currentPage === 1}
                                                onClick={handleFirst}
                                                title="First Page"
                                            >
                                                ⟪
                                            </button>

                                            <button
                                                className="pagination-btn"
                                                disabled={currentPage === 1}
                                                onClick={handlePrev}
                                                title="Previous Page"
                                            >
                                                ⟨
                                            </button>

                                            <div className="d-flex gap-1">
                                                {getPageNumbers().map((page) => (
                                                    <button
                                                        key={page}
                                                        className={`pagination-number ${currentPage === page ? "active" : ""}`}
                                                        onClick={() => handlePageClick(page)}
                                                    >
                                                        {page}
                                                    </button>
                                                ))}
                                            </div>

                                            <button
                                                className="pagination-btn"
                                                disabled={currentPage === totalPages}
                                                onClick={handleNext}
                                                title="Next Page"
                                            >
                                                ⟩
                                            </button>

                                            <button
                                                className="pagination-btn"
                                                disabled={currentPage === totalPages}
                                                onClick={handleLast}
                                                title="Last Page"
                                            >
                                                ⟫
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </Card.Body>
                </div>
            </div>

            <style jsx>{`
                .paginationall {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }
                
                .pagination-btn {
                    background: white;
                    border: 1px solid #dee2e6;
                    color: #007bff;
                    padding: 6px 12px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 16px;
                    line-height: 1;
                    transition: all 0.3s;
                }
                
                .pagination-btn:hover:not(:disabled) {
                    background: #007bff;
                    color: white;
                    border-color: #007bff;
                }
                
                .pagination-btn:disabled {
                    background: #f8f9fa;
                    color: #6c757d;
                    cursor: not-allowed;
                    opacity: 0.6;
                }
                
                .pagination-number {
                    background: white;
                    border: 1px solid #dee2e6;
                    color: #007bff;
                    min-width: 38px;
                    height: 38px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s;
                }
                
                .pagination-number:hover {
                    background: #007bff;
                    color: white;
                    border-color: #007bff;
                }
                
                .pagination-number.active {
                    background: #007bff;
                    color: white;
                    border-color: #007bff;
                    font-weight: bold;
                }
                
                .backbutton {
                    background: #6c757d;
                    color: white;
                    border: none;
                    padding: 6px 15px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                    transition: all 0.3s;
                }
                
                .backbutton:hover {
                    background: #5a6268;
                }
                
                .refreshbutton {
                    background: #28a745;
                    color: white;
                    border: none;
                    padding: 8px 20px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                    margin-top: 10px;
                    transition: all 0.3s;
                }
                
                .refreshbutton:hover {
                    background: #218838;
                }
                
                .showingentries {
                    color: #6c757d;
                    font-size: 14px;
                }
                
                .bg-color-black {
                    background-color: #343a40;
                }
                
                .text-white {
                    color: white;
                }
                
                @media (max-width: 768px) {
                    .flex-wrap-mobile {
                        flex-direction: column;
                        gap: 10px;
                    }
                    
                    .paginationall {
                        flex-wrap: wrap;
                        justify-content: center;
                    }
                }
            `}</style>
        </>
    );
};

export default Profitlosspage;