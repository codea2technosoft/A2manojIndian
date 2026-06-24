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
  Pagination,
} from "react-bootstrap";

const ProfitlossStament = () => {
  const navigate = useNavigate();
  const { adminId } = useParams();
  const [loading, setLoading] = useState(false);
  const [statementData, setStatementData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ PAGINATION STATES
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [limit, setLimit] = useState(5);
  const [paginationData, setPaginationData] = useState({
    total_records: 0,
    total_pages: 1,
    current_page: 1,
    limit: 5,
  });

  const [total, setTotal] = useState({
    credit: 0,
    debit: 0,
    commissionPlus: 0,
    commissionMinus: 0,
    netBalance: 0,
  });

  const token = localStorage.getItem("token");

  // ============================
  // FETCH DATA WITH PAGINATION
  // ============================
  useEffect(() => {
    fetchStatementData();
  }, [currentPage, limit, searchTerm]); // Add dependencies to refetch when these change

  const convertUTCToIST = (utcDateString) => {
    if (!utcDateString) return "N/A";

    const utcDate = new Date(utcDateString);

    // IST is UTC + 5:30
    const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
    const istDate = new Date(utcDate.getTime() + istOffset);

    // Extract IST date components
    const day = istDate.getUTCDate().toString().padStart(2, "0");
    const month = (istDate.getUTCMonth() + 1).toString().padStart(2, "0");
    const year = istDate.getUTCFullYear();

    // Extract IST time components
    let hours = istDate.getUTCHours();
    const minutes = istDate.getUTCMinutes().toString().padStart(2, "0");
    const seconds = istDate.getUTCSeconds().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12
    hours = hours.toString().padStart(2, "0");

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds} ${ampm}`;
  };
  const fetchStatementData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/get-statement-user-pl`,
        {
          admin_id: adminId,
          page: currentPage,
          limit: limit,
          search: searchTerm,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      console.log("API Response:", response.data);

      if (response.data.success) {
        const data = response.data.data || [];
        const pagination = response.data.pagination || {
          total_records: 0,
          total_pages: 1,
          current_page: 1,
          limit: 5,
        };

        // Set pagination data
        setPaginationData(pagination);
        setTotalPages(pagination.total_pages || 1);
        setTotalRecords(pagination.total_records || 0);
        setCurrentPage(pagination.current_page || 1);
        setLimit(pagination.limit || 5);

        // Format the data according to the actual API response
        const formattedData = data.map((item, index) => {
          // For a single admin statement, we don't have from/to fields
          // The transaction is either a credit or debit for this admin

          // Determine if this is a credit or debit based on the fields
          const credit = parseFloat(item.credit) || 0;
          const debit = parseFloat(item.debit) || 0;

          // For balance, we need to track running balance
          // Since API gives balance directly, we can use that
          const balance = parseFloat(item.balance) || 0;

          // For old balance, we might need to calculate or use previous balance
          // For now, let's use balance - credit + debit (if credit increases balance)
          // This assumes credit increases balance and debit decreases it
          const oldBalance = balance - credit + debit;

          // Convert UTC to IST format
          const formattedDate = convertUTCToIST(item.created_at);

          // Create description from available fields
          let description = item.remarks || item.comment || "Transaction";
          if (item.type) {
            description = `${item.type}: ${description}`;
          }
          if (item.winner) {
            description += ` - Winner: ${item.winner}`;
          }
          if (item.event_id) {
            description += ` [Event: ${item.event_id}]`;
          }

          return {
            id: item._id || `item-${index}`,
            date: formattedDate,
            description: description,
            oldBalance: oldBalance,
            credit: credit,
            debit: debit,
            commissionPlus: 0, // No commission fields in API
            commissionMinus: 0, // No commission fields in API
            balance: balance,
            type: item.type || "transaction",
            from: item.admin_id || "N/A", // Using admin_id as the transaction owner
            to: "N/A", // No to field in API
            amount: credit > 0 ? credit : debit, // Use whichever is non-zero
            event_id: item.event_id || "N/A",
            comment: item.comment || "",
            winner: item.winner || "",
            remarks: item.remarks || "",
          };
        });

        // Sort by date (newest first based on created_at)
        const sortedData = formattedData.sort(
          (a, b) =>
            new Date(b.date.split(" ")[0].split("-").reverse().join("-")) -
            new Date(a.date.split(" ")[0].split("-").reverse().join("-")),
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
        toast.error(
          error.response?.data?.message || "Failed to load statement data",
        );
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
      netBalance: 0,
    };

    data.forEach((item) => {
      totals.credit += parseFloat(item.credit) || 0;
      totals.debit += parseFloat(item.debit) || 0;
      totals.commissionPlus += parseFloat(item.commissionPlus) || 0;
      totals.commissionMinus += parseFloat(item.commissionMinus) || 0;
    });

    // Net balance should be the balance of the most recent transaction
    // or the last item in the sorted array
    if (data.length > 0) {
      // If data is sorted newest first, first item is newest
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
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleSearchSubmit = () => {
    fetchStatementData();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      fetchStatementData();
    }
  };

  // ============================
  // PAGINATION HANDLERS
  // ============================
  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
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

  // Filter data locally when search term changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredData(statementData);
    } else {
      const filtered = statementData.filter(
        (item) =>
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.event_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.winner.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.remarks.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredData(filtered);
    }
  }, [searchTerm, statementData]);

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

      <div className="card">
        <div className="card-header flex-wrap-mobile bg-primary-yellow text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0 card-title text-white">Profit/Loss</h5>
          <div className="d-flex align-items-center">
            <Form.Control
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={handleSearch}
              onKeyPress={handleKeyPress}
              className="me-2"
              style={{ width: "250px" }}
            />
            
            <div className="d-flex gap-2">
              <Button variant="light" onClick={handleSearchSubmit}>
                Search
              </Button>
              <button
                onClick={() => navigate(-1)}
                className="btn btn-outline-light"
              >
                Back
              </button>
            </div>

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
                      {/* <th className="text-end">OLD BAL</th> */}
                      <th className="text-end">CR</th>
                      <th className="text-end">DR</th>

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
                            Type: {item.type} | Event: {item.event_id}
                            {item.winner && ` | Winner: ${item.winner}`}
                          </small>
                        </td>
                        {/* <td className="text-end">{formatNumber(item.oldBalance)}</td> */}
                        <td className="text-end text-success fw-semibold">
                          {item.credit > 0
                            ? `+${formatNumber(item.credit)}`
                            : "0.00"}
                        </td>
                        <td className="text-end text-danger fw-semibold">
                          {item.debit > 0
                            ? `-${formatNumber(item.debit)}`
                            : "0.00"}
                        </td>

                        <td className="text-end fw-bold">
                          {formatNumber(item.balance)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="table-secondary">
                    <tr>
                      <td colSpan="2" className="text-end fw-bold">
                        TOTAL
                      </td>
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
                    style={{ width: "80px" }}
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

              {/* ✅ ENHANCED PAGINATION UI */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-4">
                  <div className="showingentries">
                    Showing {(currentPage - 1) * limit + 1} to{" "}
                    {Math.min(currentPage * limit, totalRecords)} of{" "}
                    {totalRecords} entries
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
    </>
  );
};

export default ProfitlossStament;
