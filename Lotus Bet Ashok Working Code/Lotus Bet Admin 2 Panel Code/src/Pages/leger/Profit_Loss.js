import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { BsArrowLeft } from "react-icons/bs";
import axios from "axios";
import { toast } from "react-toastify";

function ProfitAndLoss() {
  const navigate = useNavigate();

  // API Configuration
  const token = localStorage.getItem("token");
  const admin_id = localStorage.getItem("admin_id");
  const API_URL = process.env.REACT_APP_API_URL || "http://192.168.1.12:9002/api/admin";

  // STATE FOR DATA
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ------------ FILTER STATES ------------
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // ------------ PAGINATION STATES ------------
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // ------------ FETCH DATA FROM API ------------
  const fetchMatchLedger = async (page = currentPage, customLimit = limit) => {
    try {
      setLoading(true);
      setError(null);

      // Prepare request body
      const requestBody = {
        admin_id: admin_id,
        page: page.toString(),
        limit: customLimit.toString(),
      };

      // Add date filters if they exist
      if (startDate) {
        requestBody.from_date = startDate;
      }
      if (endDate) {
        requestBody.to_date = endDate;
      }

      const response = await axios.post(
        `${API_URL}/get-match-ledger`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("API Response:", response.data); // Debug log

      if (response.data.success) {
        // API से data array response.data.data.data में है
        let dataArray = [];
        
        // Check the structure from API response
        if (response.data.data && 
            response.data.data.data && 
            Array.isArray(response.data.data.data)) {
          dataArray = response.data.data.data;
        } else if (Array.isArray(response.data.data)) {
          dataArray = response.data.data;
        }
        
        setRows(dataArray);

        // Handle pagination from API response
        if (response.data.data && response.data.data.total) {
          const apiData = response.data.data;
          setTotalRecords(apiData.total || dataArray.length);
          setTotalPages(Math.ceil((apiData.total || 1) / (apiData.per_page || customLimit)));
          setCurrentPage(apiData.current_page || page);
          setLimit(apiData.per_page || customLimit);
        } else {
          // Fallback if no pagination data
          setTotalRecords(dataArray.length);
          setTotalPages(1);
          setCurrentPage(1);
        }

      } else {
        throw new Error(response.data.message || "Failed to fetch data");
      }
    } catch (err) {
      console.error("Error fetching match ledger:", err);
      const errorMsg = err.response?.data?.message || err.message || "Failed to load match ledger data";
      setError(errorMsg);

      // Fallback to empty array if error
      setRows([]);
      setTotalRecords(0);
      setTotalPages(1);
      setCurrentPage(1);
      
      console.log("Error occurred, resetting data");
    } finally {
      setLoading(false);
    }
  };

  // Format date to "DD MMM YYYY" format
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;

      const day = date.getDate().toString().padStart(2, '0');
      const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    } catch (err) {
      return dateString;
    }
  };

  // Fetch data on component mount and when page/limit changes
  useEffect(() => {
    fetchMatchLedger();
  }, []);

  // Handle search button click
  const handleSearch = () => {
    setCurrentPage(1);
    fetchMatchLedger(1);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchMatchLedger(newPage);
    }
  };

  // Handle limit change
  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setCurrentPage(1);
    fetchMatchLedger(1, newLimit);
  };

  // Handle pagination clicks
  const handlePrev = () => handlePageChange(currentPage - 1);
  const handleNext = () => handlePageChange(currentPage + 1);
  const handlePageClick = (page) => {
    if (typeof page === 'number') handlePageChange(page);
  };

  // Generate page numbers for display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 50;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pageNumbers.push(i);
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pageNumbers.push(i);
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pageNumbers.push(i);
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  // Calculate totals - using credit and debit fields from API
  const totals = useMemo(() => {
    if (!Array.isArray(rows)) {
      console.error("Rows is not an array:", rows);
      return { totalCredit: 0, totalDebit: 0 };
    }
    
    return rows.reduce(
      (acc, r) => {
        const credit = parseFloat(r?.credit || 0) || 0;
        const debit = parseFloat(r?.debit || 0) || 0;
        acc.totalCredit += credit;
        acc.totalDebit += debit;
        return acc;
      },
      { totalCredit: 0, totalDebit: 0 }
    );
  }, [rows]);

  const netTotal = (totals.totalCredit - totals.totalDebit).toFixed(2);

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          {/* Header */}
          <div className="card-header bg-color-black">
            <div className="d-flex align-items-center justify-content-between">
              <h3 className="card-title text-white mb-0">
                MATCH LEDGER
              </h3>
               <div
                className="backbutton"
                onClick={() => navigate(-1)}
                style={{
                  cursor: "pointer",
                  color: "###",
                }}
               >
                Back
              </div>
            </div>
          </div>

          <div className="card-body" style={{ padding: "20px" }}>
            <div className="row mb-4 align-items-end">
              <div className="col-md-3">
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#333" }}>
                  Start Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{ border: "1px solid #ccc", borderRadius: "4px", padding: "8px 12px", height: "40px" }}
                />
              </div>

              <div className="col-md-3">
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#333" }}>
                  End Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{ border: "1px solid #ccc", borderRadius: "4px", padding: "8px 12px", height: "40px" }}
                />
              </div>

              <div className="col-md-3">
                <label style={{ display: "block", marginBottom: "8px", color: "transparent" }}>.</label>
                <Button
                  variant="primary"
                  className="w-100"
                  onClick={handleSearch}
                  style={{
                    backgroundColor: "#000",
                    borderColor: "#000",
                    borderRadius: "4px",
                    padding: "8px",
                    height: "40px",
                    fontWeight: "500",
                  }}
                >
                  Search
                </Button>
              </div>
   <h4 className="mb-0" style={{ fontSize: "16px", fontWeight: "600" }}>
                    TOTAL: <span style={{ color: netTotal >= 0 ? "#28a745" : "#dc3545" }}>{netTotal}</span>
                  </h4>
              {/* <div className="col-md-3 text-end">
                <div style={{
                  backgroundColor: "#f8f9fa",
                  padding: "10px 20px",
                  borderRadius: "4px",
                  border: "1px solid #dee2e6",
                  display: "inline-block"
                }}>
                  <h4 className="mb-0" style={{ fontSize: "16px", fontWeight: "600" }}>
                    TOTAL: <span style={{ color: netTotal >= 0 ? "#28a745" : "#dc3545" }}>{netTotal}</span>
                  </h4>
                </div>
              </div> */}
            </div>

            {/* TABLE */}
            <div className="table-responsive">
              <table className="table text-center" style={{ border: "1px solid #dee2e6", borderCollapse: "collapse", width: "100%" }}>
                <thead>
                  <tr style={{ background: "linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%)", color: "#333", fontWeight: "600", borderBottom: "2px solid #dee2e6" }}>
                    <th style={{ border: "1px solid #dee2e6", padding: "12px", width: "15%" }}>DATE</th>
                    <th style={{ border: "1px solid #dee2e6", padding: "12px", width: "40%" }}>EVENT NAME</th>
                    <th style={{ border: "1px solid #dee2e6", padding: "12px", width: "25%" }}>Winner</th>
                    <th style={{ border: "1px solid #dee2e6", padding: "12px", width: "10%" }}>CR</th>
                    <th style={{ border: "1px solid #dee2e6", padding: "12px", width: "10%" }}>DR</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="5" className="py-5"><div className="text-center"><div className="spinner-border spinner-border-sm me-2"></div>Loading...</div></td></tr>
                  ) : error ? (
                    <tr><td colSpan="5" className="py-5"><div className="text-center text-danger"><strong>Error:</strong> {error}</div></td></tr>
                  ) : !Array.isArray(rows) || rows.length === 0 ? (
                    <tr><td colSpan="5" className="py-5"><strong>NO DATA FOUND</strong></td></tr>
                  ) : (
                    rows.map((r, i) => (
                      <tr key={i}>
                        <td style={{ border: "1px solid #dee2e6", padding: "12px", color: "#333" }}>{formatDate(r.created_at)}</td>
                        <td style={{ border: "1px solid #dee2e6", padding: "12px", color: "#333", textAlign: "left" }}>
                          {r.comment || "N/A"}
                        </td>
                        <td style={{ border: "1px solid #dee2e6", padding: "12px", color: "#333", fontWeight: "500" }}>
                          {r.winner || "N/A"}
                        </td>
                        <td style={{ border: "1px solid #dee2e6", padding: "12px", color: "#28a745", fontWeight: "500" }}>
                          {parseFloat(r.credit || 0).toFixed(2)}
                        </td>
                        <td style={{ border: "1px solid #dee2e6", padding: "12px", color: "#dc3545", fontWeight: "500" }}>
                          {parseFloat(r.debit || 0).toFixed(2)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="d-flex justify-content-between align-items-center mt-4">
              <div className="sohwingallentries">
                Showing {((currentPage - 1) * limit) + 1} to{" "}
                {Math.min(currentPage * limit, totalRecords)} of{" "}
                {totalRecords} entries
              </div>

              {totalPages > 1 && (
                <div className="paginationall d-flex align-items-center gap-1">
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    disabled={currentPage === 1}
                    onClick={handlePrev}
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      padding: "6px 12px",
                      minWidth: "36px",
                      height: "36px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    &laquo;
                  </button>

                  <div className="d-flex gap-1">
                    {getPageNumbers().map((page, index) => (
                      <button
                        key={index}
                        className={`btn btn-sm ${currentPage === page ? "btn-primary" : "btn-outline-secondary"}`}
                        onClick={() => handlePageClick(page)}
                        disabled={page === '...'}
                        style={{
                          minWidth: "36px",
                          height: "36px",
                          padding: "6px",
                        }}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    className="btn btn-outline-secondary btn-sm"
                    disabled={currentPage === totalPages}
                    onClick={handleNext}
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      padding: "6px 12px",
                      minWidth: "36px",
                      height: "36px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    &raquo;
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfitAndLoss;