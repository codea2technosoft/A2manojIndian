import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Table,
  Container,
  Card,
  Row,
  Col,
  Spinner,
  Form,
  Button,
  Pagination
} from "react-bootstrap";

const Statementmasterlist = () => {
  const navigate = useNavigate();
  const { adminId } = useParams();
  const [loading, setLoading] = useState(true);
  const [statementData, setStatementData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // PAGINATION STATES
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [limit, setLimit] = useState(10);
  const [paginationData, setPaginationData] = useState({
    total_records: 0,
    total_pages: 1,
    current_page: 1,
    limit: 10
  });

  const [total, setTotal] = useState({
    credit: 0,
    debit: 0,
    commissionPlus: 0,
    commissionMinus: 0,
    netBalance: 0
  });

  const token = localStorage.getItem("token");
  const currentAdminId = localStorage.getItem("admin_id");

  // ============================
  // FETCH DATA WITH PAGINATION
  // ============================
  useEffect(() => {
    fetchStatementData();
  }, [currentPage, searchTerm]);

  const convertUTCToIST = (utcDateString) => {
    if (!utcDateString) return "N/A";

    const utcDate = new Date(utcDateString);

    // IST is UTC + 5:30
    const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
    const istDate = new Date(utcDate.getTime() + istOffset);

    // Extract IST date components
    const day = istDate.getUTCDate().toString().padStart(2, '0');
    const month = (istDate.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = istDate.getUTCFullYear();

    // Extract IST time components
    let hours = istDate.getUTCHours();
    const minutes = istDate.getUTCMinutes().toString().padStart(2, '0');
    const seconds = istDate.getUTCSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12;
    hours = hours.toString().padStart(2, '0');

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds} ${ampm}`;
  };

  const fetchStatementData = async () => {
    try {
      setLoading(true);
      const admin_id = localStorage.getItem("admin_id");
      const role = localStorage.getItem("role");

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/get-statement-all-master`,
        {
          admin_id: admin_id,
          page: currentPage,
          limit: limit,
          role: role,
          search: searchTerm
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        const data = response.data.data || [];
        const pagination = response.data.pagination || {
          total_records: 0,
          total_pages: 1,
          current_page: 1,
          limit: 10
        };

        // Set pagination data
        setPaginationData(pagination);
        setTotalPages(pagination.total_pages || 1);
        setTotalRecords(pagination.total_records || 0);
        setCurrentPage(pagination.current_page || 1);
        setLimit(pagination.limit || 10);

        // Format the data
        const formattedData = data.map((item, index) => {
          const isSender = item.from_admin_id === currentAdminId;
          const isReceiver = item.to_admin_id === currentAdminId;

          let description = item.remark || "Transaction";
          let credit = 0;
          let debit = 0;
          let commissionPlus = 0;
          let commissionMinus = 0;

          // CORRECTED: Set credit/debit based on type and direction
          const amount = parseFloat(item.amount) || 0;

          if (item.type === "deposit") {
            if (isReceiver) {
              credit = amount; 
            } else if (isSender) {
              debit = amount; 
            }
          } else if (item.type === "withdraw") {
            if (isSender) {
              debit = amount; 
            } else if (isReceiver) {
              credit = amount;
            }
          }

          // Commission logic remains the same
          if (item.commission_amount) {
            if (isSender) {
              commissionMinus = parseFloat(item.commission_amount) || 0;
            } else {
              commissionPlus = parseFloat(item.commission_amount) || 0;
            }
          }

          const oldBalance = isSender
            ? parseFloat(item.before_balance_from) || 0
            : parseFloat(item.before_balance_to) || 0;

          const newBalance = isSender
            ? parseFloat(item.after_balance_from) || 0
            : parseFloat(item.after_balance_to) || 0;

          const formattedDate = convertUTCToIST(item.created_at);
          const status = item.tr_status || item.status || "N/A";
          const transactionType = item.tr_type || item.type || "transaction";

          return {
            id: item._id || `item-${index}`,
            date: formattedDate,
            description: description,
            oldBalance: oldBalance,
            credit: credit, // Now correctly set based on type and direction
            debit: debit,   // Now correctly set based on type and direction
            commissionPlus: commissionPlus,
            commissionMinus: commissionMinus,
            balance: newBalance,
            type: transactionType,
            status: status,
            from: item.from_admin_id || "N/A",
            fromUsername: item.from_username || "N/A",
            to: item.to_admin_id || "N/A",
            toUsername: item.to_username || "N/A",
            amount: amount,
            paymentGateway: item.payment_gateway_type || "N/A",
            isSender: isSender,
            isReceiver: isReceiver,
            originalType: item.type // Store original type for reference
          };
        });

        setStatementData(formattedData);
        setFilteredData(formattedData);
        calculateTotals(formattedData);
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
      commissionPlus: 0,
      commissionMinus: 0,
      netBalance: 0
    };

    data.forEach(item => {
      totals.credit += parseFloat(item.credit) || 0;
      totals.debit += parseFloat(item.debit) || 0;
      totals.commissionPlus += parseFloat(item.commissionPlus) || 0;
      totals.commissionMinus += parseFloat(item.commissionMinus) || 0;
    });

    // Net balance is last transaction's balance
    if (data.length > 0) {
      totals.netBalance = parseFloat(data[data.length - 1].balance) || 0;
    }

    setTotal(totals);
  };

  // ============================
  // SEARCH FUNCTIONALITY
  // ============================
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
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
        start = end - maxVisiblePages + 1;
      }

      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  };

  // Get status badge color
  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'success':
      case 'completed':
        return 'badge bg-success';
      case 'pending':
        return 'badge bg-warning';
      case 'failed':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
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
            <h5 className="mb-0 card-title text-white">Transaction Statement</h5>
            <div className="d-flex align-items-center">
              <Form.Control
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={handleSearch}
                className="me-2"
                style={{ width: '250px' }}
              />
          <button
  onClick={() => navigate("/Profitlosspage")}
  className="backbutton btn btn-secondary"
>
  P/L
</button>

              <button
                onClick={() => navigate(-1)}
                className="backbutton btn btn-secondary">
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
                    onClick={() => setSearchTerm("")}
                    className="refreshbutton btn btn-primary"
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
                        <th className="text-end">OLD BAL</th>
                        <th className="text-end">CR</th>
                        <th className="text-end">DR</th>
                        {/* <th className="text-end">COMM+</th>
                        <th className="text-end">COMM-</th> */}
                        <th className="text-end">BALANCE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((item, index) => (
                        <tr key={item.id}>
                          <td className="text-nowrap">{item.date}</td>
                          <td>
                            <div>{item.description}</div>
                            <small className="text-muted d-block">
                              <strong>From:</strong> {item.fromUsername} ({item.from})
                            </small>
                            <small className="text-muted d-block">
                              <strong>To:</strong> {item.toUsername} ({item.to})
                            </small>
                            <small className="text-muted d-block">
                              <strong>Type:</strong> {item.originalType} | <strong>Amount:</strong> ₹{formatNumber(item.amount)}
                            </small>
                          </td>

                                  <td className="text-end fw-bold">
                            {formatNumber(item.balance)}
                          </td>
                           <td className="text-end text-success">
                            {item.debit > 0 ? formatNumber(item.debit) : "0.00"}
                          </td>
                          <td className="text-end text-danger">
                            {item.credit > 0 ? formatNumber(item.credit) : "0.00"}
                          </td>
                         
                          {/* <td className="text-end text-success">
                            {item.commissionPlus > 0 ? formatNumber(item.commissionPlus) : "0.00"}
                          </td>
                          <td className="text-end text-danger">
                            {item.commissionMinus > 0 ? formatNumber(item.commissionMinus) : "0.00"}
                          </td> */}
                  

                                                    <td className="text-end">{formatNumber(item.oldBalance)}</td>

                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="table-secondary">
                      <tr>
                        <td colSpan="3" className="text-end fw-bold">TOTAL</td>
                           {/* <td className="text-end fw-bold text-danger"> */}
                           <td className="text-end fw-bold ">
                          {formatNumber(total.debit)}
                        </td>
                        {/* <td className="text-end fw-bold text-success"> */}
                        <td className="text-end fw-bold ">
                          {formatNumber(total.credit)}
                        </td>
                     
                        {/* <td className="text-end fw-bold text-success">
                          {formatNumber(total.commissionPlus)}
                        </td>
                        <td className="text-end fw-bold text-danger">
                          {formatNumber(total.commissionMinus)}
                        </td> */}
                        <td className="text-end fw-bold text-primary">
                          {formatNumber(total.netBalance)}
                        </td>
                      </tr>
                    </tfoot>
                  </Table>
                </div>

                {/* PAGINATION UI */}
                {totalPages > 1 && (
                  <div className="d-flex justify-content-between align-items-center mt-4">
                    <div className="showingentries text-muted">
                      Showing {((currentPage - 1) * limit) + 1} to{" "}
                      {Math.min(currentPage * limit, totalRecords)} of {totalRecords} entries
                    </div>

                    <div className="paginationall d-flex align-items-center gap-1">
                      <button
                        className="btn btn-outline-primary btn-sm"
                        disabled={currentPage === 1}
                        onClick={handleFirst}
                      >
                        First
                      </button>

                      <button
                        className="btn btn-outline-primary btn-sm"
                        disabled={currentPage === 1}
                        onClick={handlePrev}
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
                        className="btn btn-outline-primary btn-sm"
                        disabled={currentPage === totalPages}
                        onClick={handleNext}
                      >
                        &raquo;
                      </button>

                      <button
                        className="btn btn-outline-primary btn-sm"
                        disabled={currentPage === totalPages}
                        onClick={handleLast}
                      >
                        Last
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </Card.Body>
        </div>
      </div>
    </>
  );
};

export default Statementmasterlist;