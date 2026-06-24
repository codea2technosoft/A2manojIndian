import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MdCurrencyRupee } from "react-icons/md";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import { getMyLedger } from "../../Server/api";

function MyLedger() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState({
    lena: 0,
    dena: 0,
    balance: 0,
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [search, setSearch] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const admin_id = localStorage.getItem("admin_id");

  const fetchLedger = useCallback(async () => {
    try {
      setLoading(true);

      const payload = {
        admin_id: admin_id,
        page: currentPage,
        limit,
        startDate,
        endDate,
        search,
        paymentType,
      };

      const res = await getMyLedger(payload);

      if (res?.data?.success) {
        // Extract data from nested structure based on your API response
        const apiData = res.data.data?.data || [];
        setRows(apiData);

        // Set summary from response
        setSummary({
          lena: res.data.lena || 0,
          dena: res.data.dena || 0,
          balance: res.data.balance || 0,
        });

        // Extract pagination info from nested data
        if (res.data.data) {
          setTotalRecords(res.data.data.total || 0);
          setTotalPages(Math.ceil((res.data.data.total || 0) / limit) || 1);
        } else {
          setTotalRecords(apiData.length || 0);
          setTotalPages(1);
        }
      } else {
        // Reset to empty if API fails
        setRows([]);
        setSummary({ lena: 0, dena: 0, balance: 0 });
        setTotalRecords(0);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Error fetching ledger:", err);
      setRows([]);
      setSummary({ lena: 0, dena: 0, balance: 0 });
      setTotalRecords(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage, limit, startDate, endDate, search, paymentType]);

  useEffect(() => {
    fetchLedger();
  }, [fetchLedger]);

  // Calculate totals from rows - with safety check
  const totals = useMemo(() => {
    if (!Array.isArray(rows)) {
      return { totalDr: 0, totalCr: 0 };
    }

    return rows.reduce(
      (acc, r) => {
        const dr = parseFloat(r.debit) || 0;
        const cr = parseFloat(r.credit) || 0;
        acc.totalDr += dr;
        acc.totalCr += cr;
        return acc;
      },
      { totalDr: 0, totalCr: 0 }
    );
  }, [rows]);

  // Get current balance - with safety check
  const currentBalance = useMemo(() => {
    if (!Array.isArray(rows) || rows.length === 0) {
      return 0;
    }

    const lastRow = rows[rows.length - 1];
    return parseFloat(lastRow.balance) || 0;
  }, [rows]);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Handle limit change
  const handleLimitChange = (e) => {
    const newLimit = parseInt(e.target.value, 10);
    setLimit(newLimit);
    setCurrentPage(1); // Reset to first page when changing limit
  };

  // Pagination handlers
  const handlePrev = () => handlePageChange(currentPage - 1);
  const handleNext = () => handlePageChange(currentPage + 1);

  // Generate page numbers for display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

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

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return "";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;

      const day = date.getDate().toString().padStart(2, "0");
      const month = date
        .toLocaleString("default", { month: "short" })
        .toUpperCase();
      const year = date.getFullYear();

      let hours = date.getHours(); // 0–23
      const minutes = date.getMinutes().toString().padStart(2, "0");

      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12; // 0 → 12
      hours = hours.toString().padStart(2, "0");

      return `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
    } catch (err) {
      console.error("Error formatting date:", err);
      return dateString;
    }
  };

  // Reset filters
  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    setSearch("");
    setPaymentType("");
    setCurrentPage(1);
  };

  const paymentTypes = ["All", "Commission", "Withdrawal", "Bonus", "Game"];

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-header bg-color-black">
            <div className="d-flex align-items-center justify-content-between">
              <h3 className="card-title text-white mb-0">MY LEDGER</h3>
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

          <div className="card-body">
            {/* USER & SUMMARY */}
            <div className="row mb-4 g-4">
              <div className="col-4">
                <div className="newalldesign">
                  <h6>LENA</h6>
                  <span className="text-success">
                    <MdCurrencyRupee />
                    {summary.lena ? Number(summary.lena).toFixed(2) : "0.00"}
                  </span>
                </div>
              </div>

              <div className="col-4">
                <div className="newalldesign">

                  <h6>DENA</h6>
                  <span className="text-danger">
                    <MdCurrencyRupee />
                    {summary.dena ? Number(summary.dena).toFixed(2) : "0.00"}
                  </span>
                </div>
              </div>

              <div className="col-md-4">
                <div className="newalldesign">
                  {/* <h3 className={Number(summary.balance) < 0 ? "text-danger" : "text-success"}>
                        
                        </h3> */}
                  <h6>  Balance</h6>
                  <span className={Number(summary.balance) > 0 ? "text-danger" : "text-success"}>
                    <MdCurrencyRupee />
                    {summary.balance ? Number(summary.balance).toFixed(2) : "0.00"} {Number(summary.balance) > 0 ? "DENA" : "LENA"}
                  </span>

                </div>
              </div>


            </div>


            {/* Records per page selector */}
            <div className="row mb-3">
              <div className="col-md-3">
                <div className="d-flex align-items-center">
                  <label className="me-2 mb-0" style={{ fontWeight: "500" }}>Show:</label>
                  <select
                    className="form-select form-select-sm"
                    value={limit}
                    onChange={handleLimitChange}
                    style={{ width: "auto" }}
                    disabled={loading}
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                  <span className="ms-2" style={{ fontWeight: "500" }}>entries</span>
                </div>
              </div>
            </div>

            {/* TABLE */}
            <div className="table-responsive">
              <table className="table table-bordered" style={{ border: "1px solid #dee2e6", borderCollapse: "collapse", width: "100%" }}>
                <thead>
                  <tr style={{ background: "linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%)", color: "#333", fontWeight: "600", borderBottom: "2px solid #dee2e6" }}>
                    <th style={{ border: "1px solid #dee2e6", padding: "12px" }}>Date</th>
                    <th style={{ border: "1px solid #dee2e6", padding: "12px" }}>DR</th>
                    <th style={{ border: "1px solid #dee2e6", padding: "12px" }}>CR</th>
                    <th style={{ border: "1px solid #dee2e6", padding: "12px" }}>Balance</th>
                    <th style={{ border: "1px solid #dee2e6", padding: "12px" }}>Payment Type</th>
                    <th style={{ border: "1px solid #dee2e6", padding: "12px" }}>Remark</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="py-5">
                        <div className="text-center">
                          <div className="spinner-border spinner-border-sm me-2"></div>
                          Loading...
                        </div>
                      </td>
                    </tr>
                  ) : !Array.isArray(rows) || rows.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-5">
                        <div className="text-center">
                          <strong>NO DATA FOUND</strong>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    rows.map((r, i) => (
                      <tr key={i}>
                        <td style={{ border: "1px solid #dee2e6", padding: "12px", color: "#333" }}>
                          {formatDate(r.created_at)}
                        </td>
                        <td style={{ border: "1px solid #dee2e6", padding: "12px", color: "#dc3545", fontWeight: "500" }}>
                          {r.debit ? parseFloat(r.debit).toFixed(2) : "-"}
                        </td>
                        <td style={{ border: "1px solid #dee2e6", padding: "12px", color: "#28a745", fontWeight: "500" }}>
                          {r.credit ? parseFloat(r.credit).toFixed(2) : "-"}
                        </td>
                        <td style={{ border: "1px solid #dee2e6", padding: "12px", color: "#333", fontWeight: "500" }}>
                          {parseFloat(r.balance || 0).toFixed(2)}
                        </td>
                        <td style={{ border: "1px solid #dee2e6", padding: "12px", color: "#333" }}>
                          {r.comment || "-"}
                        </td>
                        <td style={{ border: "1px solid #dee2e6", padding: "12px", color: "#333" }}>
                          {r.remarks || "-"}
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
                Showing {Math.min(((currentPage - 1) * limit) + 1, totalRecords)} to{" "}
                {Math.min(currentPage * limit, totalRecords)} of{" "}
                {totalRecords} entries
              </div>

              {totalPages > 1 && (
                <div className="paginationall d-flex align-items-center gap-1">
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    disabled={currentPage === 1 || loading}
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
                    <MdOutlineKeyboardArrowLeft />
                  </button>

                  <div className="d-flex gap-1">
                    {getPageNumbers().map((page, index) => (
                      <button
                        key={index}
                        className={`btn btn-sm ${currentPage === page ? "btn-primary" : "btn-outline-secondary"}`}
                        onClick={() => typeof page === 'number' && handlePageChange(page)}
                        disabled={page === '...' || loading}
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
                    disabled={currentPage === totalPages || loading}
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
                    <MdOutlineKeyboardArrowRight />
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

export default MyLedger;