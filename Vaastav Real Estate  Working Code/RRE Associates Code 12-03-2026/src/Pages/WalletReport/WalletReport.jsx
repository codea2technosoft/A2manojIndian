import React, { useEffect, useState } from "react";
import { Modal, Button, Table, Pagination, Row, Col } from "react-bootstrap";
import { BsFiletypeXls } from "react-icons/bs";
import { MdFilterListAlt, MdFilterAltOff, MdFilterAlt } from "react-icons/md";
import { RiFilterFill } from "react-icons/ri";
import Swal from "sweetalert2";
const API_URL = process.env.REACT_APP_API_URL;
function WalletReport() {
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

  const pageLimit = 100;
  const toggleFilter = () => setShowFilter((prev) => !prev);
  const showCustomMessageModal = (title, text) => {
    alert(`${title}: ${text}`);
  };
  const [isFilterActive, setIsFilterActive] = useState(false);
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
      console.log("Fetching page:", page);
      const params = new URLSearchParams();
      if (searchTerm.type || filterToType) {
        params.append('type', searchTerm.type || filterToType);
      }
      if (filterFromDate) {
        params.append('from_date', formatDateForServer(filterFromDate));
      }
      if (filterToDate) {
        params.append('to_date', formatDateForServer(filterToDate));
      }
      params.append('page', page);
      params.append('limit', pageLimit);
      const url = `${API_URL}/ledger/list?${params.toString()}`;
      console.log("API URL:", url);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      console.log("Response status:", response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log("API Response:", result);
      if (result.success) {
        setLedger(result.data || result.ledger || []);
        setTotals(result.totals || { total_credit: 0, total_debit: 0 });
        const pagination = result.pagination || result.meta || {};
        setTotalPages(pagination.totalPages || pagination.last_page || 1);
        setCurrentPage(pagination.page || pagination.current_page || page);
      } else {
        showCustomMessageModal("Error", result.message || "Failed to fetch records.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      showCustomMessageModal("Error", "Failed to fetch ledger data. Please check console for details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLedger();
  }, []);
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchLedger(1);
  };
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      fetchLedger(pageNumber);
    }
  };
  const getPaginationGroup = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 3) {
      return [1, 2, 3, 4, '...', totalPages];
    }
    if (currentPage >= totalPages - 2) {
      return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "-";
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch (error) {
      return "-";
    }
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
    if (parts[0].length === 2 && parts[2].length === 4) {
      const [dd, mm, yyyy] = parts;
      return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
    } else if (parts[0].length === 4 && parts[2].length === 2) {
      return dateStr;
    }
    return "";
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

      const response = await fetch(`${API_URL}/download-wallet-ledger-excel?${params.toString()}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
        text: "Please Check Entered From Date & To Date For Downloding Users Wallet Ledger Report.",
      });
    }
  };
  const handleClearFilters = () => {
    setFilterFromDate("");
    setFilterToDate("");
    setFilterToType("");
    setSearchTerm({ amount: "", type: "" });
    setCurrentPage(1);
    fetchLedger(1);
  };

  return (
    <div className="padding_15">
      <div className="userlist">
        <div className="card shadow-sm">
          <div className="card-header d-flex justify-content-between align-items-center gap-2">
            <div className="titlepage">
              <h3>Wallet Ledger Report</h3>
            </div>
            <div className="d-block d-md-none">
              <button
                className={`filter-toggle-btn btn btn-primary ${isFilterActive ? "active" : ""}`}
                onClick={handleToggle}
              >
                {isFilterActive ? (
                  <>
                    <MdFilterAltOff />
                  </>
                ) : (
                  <>
                    <MdFilterAlt />
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="card-body">
            {isFilterActive && (
              <Row className="mb-3 gy-2 mobilesed">
                <Col md={6}>
                  <input
                    type="text"
                    className="form-control"
                    value={filterFromDate}
                    onChange={(e) => setFilterFromDate(e.target.value)}
                    placeholder="From Date (DD-MM-YYYY)"
                  />
                </Col>
                <Col md={6}>
                  <input
                    type="text"
                    className="form-control"
                    value={filterToDate}
                    onChange={(e) => setFilterToDate(e.target.value)}
                    placeholder="To Date (DD-MM-YYYY)"
                  />
                </Col>

                <Col md={6}>
                  <input
                    type="text"
                    placeholder="Transaction Type CR/DR"
                    className="form-control"
                    value={filterToType}
                    onChange={(e) => setFilterToType(e.target.value)}
                  />
                </Col>

                <Col md={12} className="d-flex justify-content-end gap-2">
                  <Button variant="primary" onClick={() => fetchLedger(1)}>
                    <RiFilterFill /> Filter
                  </Button>
                  <Button
                    className="buttonpadding d-flex gap-2 border border-white"
                    variant="primary"
                    onClick={handleDownloadFilteredExcel}
                  >
                    <BsFiletypeXls className="text-white fs-6" />
                    Download
                  </Button>
                </Col>
              </Row>
            )}

            <div className="d-none d-md-block">
              <Row className="mb-3 gy-2">
                <Col md={3}>
                  <input
                    type="date"
                    className="form-control"
                    value={filterFromDate}
                    onChange={(e) => setFilterFromDate(e.target.value)}
                    placeholder="From Date (DD-MM-YYYY)"
                  />
                </Col>
                <Col md={3}>
                  <input
                    type="date"
                    className="form-control"
                    value={filterToDate}
                    onChange={(e) => setFilterToDate(e.target.value)}
                    placeholder="To Date (DD-MM-YYYY)"
                  />
                </Col>

                {/* <Col md={2}>
                  <input
                    type="text"
                    placeholder="Transaction Type"
                    className="form-control"
                    value={filterToType}
                    onChange={(e) => setFilterToType(e.target.value)}
                  />
                </Col> */}

                <Col md={4} className="d-flex gap-2">
                  <Button variant="primary" onClick={() => fetchLedger(1)}>
                    <RiFilterFill /> Filter
                  </Button>

                  <Button
                    className="buttonpadding d-flex gap-2 border border-white"
                    variant="primary"
                    onClick={handleDownloadFilteredExcel}
                  >
                    <BsFiletypeXls className="text-white fs-6" />
                    Download
                  </Button>
                </Col>
              </Row>
            </div>
          </div>


          
          
        <div className="mb-4 card">
          <div className="card-header">
            <h5 className="mb-0">Summary</h5>
          </div>
          <div className="card-body pb-0">
            <Row>
              <Col md={3} className="mb-2">
                <div
                  className="card border-success bg_card_design clickable-card"
                  style={{ height: "90px" }}
                >
                  <div className="card-body p-2 text-center">
                    <h6 className="card-title text-success">Total Credit</h6>
                    <p
                      className="card-text fw-bold"
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontSize: "14px"
                      }}
                    >
                      ₹ {formatAmount(totals.total_credit)}
                    </p>
                  </div>
                </div>
              </Col>

              <Col md={3} className="mb-2">
                <div className="card border-danger bg_card_design clickable-card" style={{ height: "90px" }}>
                  <div className="card-body p-2 text-center">
                    <h6 className="card-title text-danger">Total Debit</h6>
                    <p className="card-text fw-bold" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontSize: "14px" }}>
                      ₹ {formatAmount(totals.total_debit)}
                    </p>
                  </div>
                </div>
              </Col>

              

              <Col md={2} className="mb-2">
                <div className="card border-warning bg_card_design clickable-card" style={{ height: "90px" }}>
                  <div className="card-body p-2 text-center">
                    <h6 className="card-title text-warning">Current</h6>
                    <p className="card-text fw-bold" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontSize: "14px" }}>
                       ₹ {formatAmount(totals.total_credit - totals.total_debit)}


                    </p>
                  </div>
                </div>
              </Col>
            </Row>
          </div>

            {/* <div className="mb-3 d-flex justify-content-between flex-wrap">
              <h6 className="text-success">
                Total Credit: ₹ {formatAmount(totals.total_credit)}
              </h6>
              <h6 className="text-danger">
                Total Debit: ₹ {formatAmount(totals.total_debit)}
              </h6>
            </div> */}
            {loading ? (
              <p>Loading records...</p>
            ) : ledger.length === 0 ? (
              <p>No records found.</p>
            ) : (
              <>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Date</th>
                      <th>Narration</th>
                      <th>Credit (Cr)</th>
                      <th>Debit (Dr)</th>
                      <th>Closing Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ledger.map((item, index) => {
                      // Check transaction type
                      const isCr = item.transaction_type?.toUpperCase() === 'CR';
                      const isDr = item.transaction_type?.toUpperCase() === 'DR';

                      return (
                        <tr key={item.id || index}>
                          <td>{(currentPage - 1) * pageLimit + index + 1}</td>
                          <td>{formatDate(item.date)}</td>
                          <td className="table-cell-remark">{item.narration || "-"}</td>

                          {/* CREDIT COLUMN - केवल Cr transactions दिखाएं */}
                          <td className="text-success fw-bold">
                            {isCr ? `₹ ${formatAmount(item.amount)}` : "-"}
                          </td>

                          {/* DEBIT COLUMN - केवल Dr transactions दिखाएं */}
                          <td className="text-danger fw-bold">
                            {isDr ? `₹ ${formatAmount(item.amount)}` : "-"}
                          </td>

                          <td>₹ {formatAmount(item.closing_balance)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
                {totalPages > 1 && (
                  <>
                    <div className="d-flex justify-content-end mt-3"> {/* Changed from justify-content-center to justify-content-end */}
                      <Pagination>
                        <Pagination.First
                          onClick={() => handlePageChange(1)}
                          disabled={currentPage === 1}
                        />
                        <Pagination.Prev
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        />

                        {getPaginationGroup().map((pageNumber, index) => (
                          pageNumber === '...' ? (
                            <Pagination.Ellipsis key={`ellipsis-${index}`} disabled />
                          ) : (
                            <Pagination.Item
                              key={pageNumber}
                              active={pageNumber === currentPage}
                              onClick={() => handlePageChange(pageNumber)}
                            >
                              {pageNumber}
                            </Pagination.Item>
                          )
                        ))}

                        <Pagination.Next
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        />
                        <Pagination.Last
                          onClick={() => handlePageChange(totalPages)}
                          disabled={currentPage === totalPages}
                        />
                      </Pagination>
                    </div>

                    <div className="text-end mt-2"> {/* Changed from text-center to text-end */}
                      <small className="text-muted">
                        Page {currentPage} of {totalPages}
                        {totalPages > 0 && ` | Showing ${ledger.length} records (Serial: ${(currentPage - 1) * pageLimit + 1} to ${(currentPage - 1) * pageLimit + ledger.length})`}
                      </small>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WalletReport;