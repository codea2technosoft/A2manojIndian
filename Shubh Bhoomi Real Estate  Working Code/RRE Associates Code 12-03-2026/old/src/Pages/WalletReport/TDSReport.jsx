import React, { useEffect, useState } from "react";
import { Modal, Button, Table, Pagination, Row, Col } from "react-bootstrap";
import { BsFiletypeXls } from "react-icons/bs";
import { MdFilterAltOff, MdFilterAlt } from "react-icons/md";
import { RiFilterFill } from "react-icons/ri";
import Swal from "sweetalert2";
import { FaSearch } from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL;

function TDSReport() {
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState({ amount: "", type: "" });
  const [showFilter, setShowFilter] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1199);
  const [totals, setTotals] = useState({ total_credit: 0, total_debit: 0 });
  const token = localStorage.getItem("token");
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");
  const [filterToType, setFilterToType] = useState("");
  const [filterAllData, setFilterAllData] = useState("");
  const [isFilterActive, setIsFilterActive] = useState(false);

  const pageLimit = 10;
  const toggleFilter = () => setShowFilter((prev) => !prev);
  const showCustomMessageModal = (title, text) => {
    alert(`${title}: ${text}`);
  };

  const handleToggle = () => {
    setIsFilterActive(!isFilterActive);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1199) {
        setIsDesktop(true);
        setShowFilter(true);
      } else {
        setIsDesktop(false);
        setShowFilter(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchLedger = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        type: searchTerm.type || filterToType,
        from_date: formatDateForServer(filterFromDate),
        to_date: formatDateForServer(filterToDate),
        filterAllData: filterAllData,
        page,
      });
      const response = await fetch(
        `${API_URL}/get-tsd-report-for-associate?${params}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const result = await response.json();

      if (result.success === "1") {
        setLedger(result.data || []);
        setTotalPages(result.total_pages || 1);
        setCurrentPage(result.current_page || 1);
      } else {
        showCustomMessageModal(
          "Error",
          result.message || "Failed to fetch records.",
        );
      }
    } catch (error) {
      showCustomMessageModal("Error", "Failed to fetch ledger data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLedger();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchLedger(1);
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      fetchLedger(pageNumber);
    }
  };

  const getPaginationGroup = () => {
    const start = Math.floor((currentPage - 1) / pageLimit) * pageLimit;
    return new Array(Math.min(pageLimit, totalPages - start))
      .fill()
      .map((_, idx) => start + idx + 1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatAmount = (amount) => {
    if (!amount) return "0.00";
    return parseFloat(amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatDateForServer = (dateStr) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length !== 3) return "";
    const [dd, mm, yyyy] = parts;
    return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
  };

  const handleDownloadFilteredExcel = async () => {
    const token = localStorage.getItem("token");

    try {
      Swal.fire({
        title: "Please wait...",
        text: "Generating your filtered Excel file",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const params = new URLSearchParams({
        totalPages,
        amount: searchTerm.amount,
        type: searchTerm.type || filterToType,
        from_date: formatDateForServer(filterFromDate),
        to_date: formatDateForServer(filterToDate),
      }).toString();

      const response = await fetch(
        `${API_URL}/download-property-income-excel-by-associate?${params}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) throw new Error("Failed to download Excel");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Filtered Users Wallet Ledger Report.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      Swal.fire({
        icon: "success",
        title: "Download Successful!",
        text: "Filtered Excel report has been downloaded successfully.",
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (error) {
      console.error("Filtered Excel download failed:", error);
      Swal.fire({
        icon: "warning",
        title: "Download Failed!",
        text: "Please Check Entered From Date & To Date For Downloading TDS Report.",
      });
    }
  };

  return (
    <div className="padding_15">
      <div className="userlist">
        <div className="card shadow-sm">
          <div className="card-header d-flex flex-wrap-mobile justify-content-between align-items-md-center gap-2">
            <div className="titlepage">
              <h3>TDS Deductions Report</h3>
            </div>
            <div className="d-flex align-items-center gap-2">
              <Button
                className="buttonpadding d-flex gap-2 border border-white"
                variant="primary"
                onClick={handleDownloadFilteredExcel}
              >
                <BsFiletypeXls className="text-white fs-6" />
                Download
              </Button>
              <button
                className={`filter-toggle-btn btn btn-primary ${isFilterActive ? "active" : ""}`}
                onClick={handleToggle}
              >
                {isFilterActive ? <MdFilterAltOff /> : <MdFilterAlt />}
              </button>
            </div>
          </div>

          <div className="card-body">
            {isFilterActive && (
              <div className="d-flex flex-wrap-mobile align-items-md-center gap-2 mb-3 gy-2 mobilesed">
                <div className="w-100">
                  <input
                    type="date"
                    className="form-control"
                    value={filterFromDate}
                    ss
                    onChange={(e) => setFilterFromDate(e.target.value)}
                    placeholder="From Date (DD-MM-YYYY)"
                  />
                </div>
                <div className="w-100">
                  <input
                    type="date"
                    className="form-control"
                    value={filterToDate}
                    onChange={(e) => setFilterToDate(e.target.value)}
                    placeholder="To Date (DD-MM-YYYY)"
                  />
                </div>
                <div className="w-100">
                  <input
                    type="text"
                    placeholder="Filter"
                    className="form-control"
                    value={filterAllData}
                    onChange={(e) => setFilterAllData(e.target.value)}
                  />
                </div>

                <Button variant="primary" onClick={() => fetchLedger(1)}>
                  <FaSearch /> Search
                </Button>
              </div>
            )}
          </div>

          <div className="card-body">
            {loading ? (
              <p>Loading records...</p>
            ) : ledger.length === 0 ? (
              <p className="text-center">No records found.</p>
            ) : (
              <>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Approve Date</th>
                      <th>Refrence Number</th>
                      {/* <th>Approve Amount</th>
                      <th>Advance Amount (₹)</th>
                      <th>Gross Payment (₹)</th>
                      <th>TDS Deduction</th>
                      <th>Net Amount</th> */}
                      <th>Apporve Amount</th>
                      <th>TDS %</th>
                      <th>TDS Amount</th>
                      <th>Net Amount (After TDS)</th>
                      <th>Advance Payment</th>
                      <th>Advance Payment Settled</th>
                      <th>Remaining Advance Payment</th>
                      <th>Net Payable Amount</th>

                      <th>Transfrred Bank</th>
                      <th>Account Number</th>
                      <th>IFSC Code</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ledger.map((item, index) => (
                      <tr key={item.id}>
                        <td>{(currentPage - 1) * pageLimit + index + 1}</td>
                        <td>{formatDate(item.date)}</td>
                        <td>{item.transaction_id}</td>
                        {/* <td>
                          <strong>₹ {formatAmount(item.transaction_amount)}</strong>
                        </td>
      <td>₹ {formatAmount(item.advance_payment || "0.00")}</td>
      <td>₹ {formatAmount(item.transaction_amount - item.advance_payment)}</td>

                        <td style={{ color: "red" }}>
                          ₹ {formatAmount(item.tds_amount)}
                        </td>

                  
                        
                        <td style={{ color: "green" }}>
                          ₹ {formatAmount((item.transaction_amount - item.advance_payment) - item.tds_amount)}
                        </td> */}

                        <td>₹ {item.transaction_amount || "0.00"}</td>
                        <td>{item.tds_percent || "0.00"}</td>
                        <td>₹ {item.tds_amount || "0.00"}</td>
                        <td>₹ {item.amount_after_tds || "0.00"}</td>

                        <td>₹ {item.advance_payment || "0.00"}</td>
                        <td>₹ {item.advance_payment_used || "0.00"}</td>
                        <td>
                          ₹{" "}
                          {item.advance_payment - item.advance_payment_used ||
                            "0.00"}
                        </td>
                        <td>₹ {item.net_payment || "0.00"}</td>

                        <td>{item.bank || "-"}</td>
                        <td>{item.account_number || "-"}</td>
                        <td>{item.ifsc_code || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                <div className="d-flex justify-content-end mt-3">
                  <Pagination>
                    <Pagination.Prev
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    />
                    {getPaginationGroup().map((item, index) => (
                      <Pagination.Item
                        key={index}
                        active={item === currentPage}
                        onClick={() => handlePageChange(item)}
                      >
                        {item}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TDSReport;
