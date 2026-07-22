import React, { useEffect, useState, useRef } from "react";
import { Modal, Button, Table, Pagination, Row, Col } from "react-bootstrap";
import { BsFiletypeXls } from "react-icons/bs";
import { FaCalendar, FaTimes } from "react-icons/fa";
import { MdFilterAltOff, MdFilterAlt } from "react-icons/md";
import { RiFilterFill } from "react-icons/ri";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const API_URL = process.env.REACT_APP_API_URL;

function AdminWalletLedger() {
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState({ amount: "", type: "" });
  const [showFilter, setShowFilter] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1199);
  const [totals, setTotals] = useState({ total_credit: 0, total_debit: 0 });
  const [summary, setSummary] = useState({
    total_cr: 0,
    total_dr: 0,
    opening_balance: 0,
    closing_balance: 0,
    current_balance: 0,
  });
  const token = localStorage.getItem("token");
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");
  const [filterToType, setFilterToType] = useState("");
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPageRecords, setCurrentPageRecords] = useState(0);

  const datePickerRef = useRef(null);
  const handleIconClick = () => {
    datePickerRef.current.setOpen(true);
  };
  const handleClear = () => {
    setFilterFromDate(null);
  };

  const pageLimit = 10;
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

  const formatDateForServer = (date) => {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };
  // const formatDateForServer = (dateStr) => {
  //   if (!dateStr) return "";
  //   const parts = dateStr.split("-");
  //   if (parts.length !== 3) return "";
  //   const [dd, mm, yyyy] = parts;
  //   return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
  // };

  const fetchLedger = async (page = 1) => {
    setLoading(true);
    try {
      console.log("Fetching page:", page);
      const params = new URLSearchParams();

      // Add filters if available
      if (searchTerm.type || filterToType) {
        params.append("type", searchTerm.type || filterToType);
      }
      if (filterFromDate) {
        params.append("start_date", formatDateForServer(filterFromDate));
      }
      if (filterToDate) {
        params.append("end_date", formatDateForServer(filterToDate));
      }

      // Server-side pagination parameters
      params.append("page", page);
      params.append("limit", pageLimit);

      const url = `${API_URL}/get-admin-wallet-ledgers-with-summary?${params.toString()}`;
      console.log("API URL:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("API Response:", result);

      if (result.success === "1" || result.success) {
        // Set ledger data
        setLedger(result.data?.ledger || []);
        setCurrentPageRecords(result.data?.ledger?.length || 0);

        // Set summary data
        if (result.data?.summary) {
          setSummary(result.data.summary);
          setTotals({
            total_credit: result.data.summary.total_cr || 0,
            total_debit: result.data.summary.total_dr || 0,
          });
        }

        // Set pagination data
        if (result.data?.pagination) {
          const paginationData = result.data.pagination;
          setTotalRecords(paginationData.total_records || 0);

          // Calculate total pages based on total_records and pageLimit
          const totalPagesCount = Math.ceil(
            (paginationData.total_records || 0) / pageLimit,
          );
          setTotalPages(totalPagesCount || 1);
        }

        // Set current page
        setCurrentPage(page);
      } else {
        showCustomMessageModal(
          "Error",
          result.message || "Failed to fetch records.",
        );
      }
    } catch (error) {
      console.error("Fetch error:", error);
      showCustomMessageModal(
        "Error",
        "Failed to fetch ledger data. Please check console for details.",
      );
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
    // Agar total pages 7 se kam hain, to sab dikha do
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Agar current page start ke 3 pages mein hai
    if (currentPage <= 3) {
      return [1, 2, 3, 4, "...", totalPages];
    }

    // Agar current page last ke 3 pages mein hai
    if (currentPage >= totalPages - 2) {
      return [
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    // Middle pages ke liye
    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  // Helper functions
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
    if (amount === undefined || amount === null) return "0.00";
    const num = parseFloat(amount);
    if (isNaN(num)) return "0.00";
    return num.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Get payee/transaction name
  const getTransactionName = (item) => {
    if (item.transaction_name) return item.transaction_name;
    if (item.payee) return item.payee;
    if (item.associate?.name) return item.associate.name;
    return "-";
  };

  // Get project/plot info
  const getProjectPlotInfo = (item) => {
    const projectName = item.project?.name || "";
    const plotName = item.plot?.name || "";

    if (projectName && plotName) {
      return `${projectName} - ${plotName}`;
    } else if (projectName) {
      return projectName;
    } else if (plotName) {
      return plotName;
    }
    return "-";
  };

  // Get category info
  const getCategoryInfo = (item) => {
    if (item.category?.name) {
      return `${item.category.name} (${item.category.type || ""})`;
    }
    return "-";
  };

  // Get associate info
  const getAssociateInfo = (item) => {
    if (item.associate?.name && item.associate?.mobile) {
      return `${item.associate.name} (${item.associate.mobile})`;
    }
    return "-";
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
        amount: searchTerm.amount,
        type: searchTerm.type || filterToType,
        start_date: formatDateForServer(filterFromDate),
        end_date: formatDateForServer(filterToDate),
      }).toString();

      const response = await fetch(
        `${API_URL}/download-admin-wallet-ledger-excel?${params.toString()}`,
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
      link.setAttribute("download", `Filtered Admin Wallet Ledger Report.xlsx`);
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
        text: "Please Check Entered From Date & To Date For Downloding Admin Wallet Ledger Report.",
      });
    }
  };

  // Clear filters
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
        <div className="card shadow-sm mb-3">
          <div className="card-header flex-wrap-mobile d-flex justify-content-between align-items-center gap-2">
            <div className="titlepage">
              <h3>Admin Wallet Ledger Report</h3>
            </div>
            <div className="d-flex align-items-center gap-2">
              <Button
                className="buttonpadding d-flex gap-2"
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

          {isFilterActive && (
            <div className="card-body">
              <div className="d-flex flex-wrap-mobile justify-content-between align-items-center gap-2">
                <div className="position-relative w-100">
                  <div
                    className="position-absolute"
                    style={{ top: "8px", right: "20px" }}
                  >
                    {!filterFromDate ? (
                      <FaCalendar onClick={handleIconClick} />
                    ) : (
                      <FaTimes onClick={handleClear} />
                    )}
                  </div>

                  <DatePicker
                    ref={datePickerRef}
                    selected={filterFromDate}
                    onChange={(date) => setFilterFromDate(date)}
                    placeholderText="DD-MM-YYYY"
                    dateFormat="dd-MM-yyyy"
                    className="form-control w-100"
                    // isClearable={true}
                    showPopperArrow={false}
                  />
                </div>
                <div className="position-relative w-100">
                  <div
                    className="position-absolute"
                    style={{ top: "8px", right: "20px" }}
                  >
                    {!filterFromDate ? (
                      <FaCalendar onClick={handleIconClick} />
                    ) : (
                      <FaTimes onClick={handleClear} />
                    )}
                  </div>

                  <DatePicker
                    ref={datePickerRef}
                    selected={filterToDate}
                    onChange={(date) => setFilterToDate(date)}
                    placeholderText="DD-MM-YYYY"
                    dateFormat="dd-MM-yyyy"
                    className="form-control"
                    // isClearable={true}
                    showPopperArrow={false}
                  />
                </div>
                <Button
                  className="filter-toggle-btn btn"
                  variant="primary"
                  onClick={() => fetchLedger(1)}
                >
                  <RiFilterFill /> Filter
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="mb-4 card">
          <div className="card-header">
            <h5 className="mb-0">Summary</h5>
          </div>
          <div className="card-body pb-0">
            <Row className="gy-2">
              <Col md={4} className="mb-2">
                <div className="card border-success bg_card_design clickable-card">
                  <div className="card-body p-2 text-center">
                    <h6 className="card-title text-success">Total Credit</h6>
                    <p className="fw-semibold mb-0 mt-1">
                      ₹ {formatAmount(summary.total_cr)}
                    </p>
                  </div>
                </div>
              </Col>

              <Col md={4} className="mb-2">
                <div className="card border-danger bg_card_design clickable-card">
                  <div className="card-body p-2 text-center">
                    <h6 className="card-title text-danger">Total Debit</h6>
                    <p className="fw-semibold mb-0 mt-1">
                      ₹ {formatAmount(summary.total_dr)}
                    </p>
                  </div>
                </div>
              </Col>

              {/* <Col md={2} className="mb-2">
                <div className="card border-primary bg_card_design clickable-card" style={{ height: "90px" }}>
                  <div className="card-body p-2 text-center">
                    <h6 className="card-title text-primary">Opening</h6>
                    <p className="fw-semibold mb-0 mt-1" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontSize: "14px" }}>
                      ₹ {formatAmount(summary.opening_balance)}
                    </p>
                  </div>
                </div>
              </Col>

              <Col md={2} className="mb-2">
                <div className="card border-info bg_card_design clickable-card" style={{ height: "90px" }}>
                  <div className="card-body p-2 text-center">
                    <h6 className="card-title text-info">Closing</h6>
                    <p className="fw-semibold mb-0 mt-1" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontSize: "14px" }}>
                      ₹ {formatAmount(summary.closing_balance)}
                    </p>
                  </div>
                </div>
              </Col> */}

              <Col md={4} className="mb-2">
                <div className="card border-warning bg_card_design clickable-card">
                  <div className="card-body p-2 text-center">
                    <h6 className="card-title text-warning">Current</h6>
                    <p className="fw-semibold mb-0 mt-1">
                      ₹ {formatAmount(summary.current_balance)}
                    </p>
                  </div>
                </div>
              </Col>
            </Row>
          </div>

          <div className="card-body">
            {/* Total Records Info */}
            {/* <div className="mb-3 p-2 bg-info text-white rounded">
              <div className="d-flex justify-content-between align-items-center">
                <span className="fw-bold">Total Records: {totalRecords}</span>
                <span className="fw-bold">Page: {currentPage} of {totalPages}</span>
              </div>
            </div> */}

            {/* Table */}
            {loading ? (
              <div className="text-center p-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading records...</p>
              </div>
            ) : ledger.length === 0 ? (
              <div className="text-center py-3">
                <p className="text-muted mb-0">No records found.</p>
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <Table striped bordered hover className="align-middle">
                    <thead className="table-dark">
                      <tr>
                        <th>#</th>
                        <th>Date</th>
                        <th>Category Name</th>
                        <th>Category Type</th>
                        <th>Payee Name</th>

                        <th>Type</th>
                        <th>Project Name</th>
                        <th>Unit Number</th>
                        <th>Descriptions</th>
                        <th>Narration</th>
                        <th>CR (₹)</th>
                        <th>DR (₹)</th>
                        <th>Balance (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ledger.map((item, index) => {
                        const crAmount = parseFloat(item.cr) || 0;
                        const drAmount = parseFloat(item.dr) || 0;
                        const transactionAmount =
                          crAmount > 0 ? crAmount : drAmount;

                        return (
                          <tr key={item.id || index}>
                            <td className="fw-bold">
                              {(currentPage - 1) * pageLimit + index + 1}
                            </td>
                            <td>{formatDate(item.date)}</td>
                            <td>{item.category.name || "NA"}</td>
                            <td
                              style={{
                                color:
                                  item.category.type?.toLowerCase() === "cr"
                                    ? "green"
                                    : item.category.type?.toLowerCase() === "dr"
                                      ? "red"
                                      : "black",
                                fontWeight: "bold",
                              }}
                            >
                              {item.category.type
                                ? item.category.type.charAt(0).toUpperCase() +
                                  item.category.type.slice(1).toLowerCase()
                                : ""}
                            </td>

                            <td>{item.payee || "NA"}</td>

                            <td>{item.payment_type || "NA"}</td>

                            <td>{item?.project?.name || "NA"}</td>
                            <td>{item?.plot?.name || "NA"}</td>

                            <td>
                              <div className="table-cell-remark">
                                {item.description || "NA"}
                              </div>
                            </td>

                            <td>
                              <div className="table-cell-remark">
                                {item.narration || "NA"}
                              </div>
                            </td>
                            <td>{(item.cr ?? 0).toFixed(2)}</td>

                            <td>{(item.dr ?? 0).toFixed(2)}</td>

                            <td>
                              {item.balance != null
                                ? Number(item.balance).toFixed(2)
                                : "NA"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>

                {/* Enhanced Pagination */}
                {totalPages > 1 && (
                  <>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div className="text-muted">
                        Showing {(currentPage - 1) * pageLimit + 1} to{" "}
                        {Math.min(currentPage * pageLimit, totalRecords)} of{" "}
                        {totalRecords} entries
                      </div>

                      <div className="d-flex justify-content-end">
                        <Pagination>
                          <Pagination.First
                            onClick={() => handlePageChange(1)}
                            disabled={currentPage === 1}
                          />
                          <Pagination.Prev
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                          />

                          {getPaginationGroup().map((pageNumber, index) =>
                            pageNumber === "..." ? (
                              <Pagination.Ellipsis
                                key={`ellipsis-${index}`}
                                disabled
                              />
                            ) : (
                              <Pagination.Item
                                key={pageNumber}
                                active={pageNumber === currentPage}
                                onClick={() => handlePageChange(pageNumber)}
                              >
                                {pageNumber}
                              </Pagination.Item>
                            ),
                          )}

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
                    </div>

                    <div className="text-end mt-2">
                      <small className="text-muted">
                        Page {currentPage} of {totalPages}
                        {totalRecords > 0 &&
                          ` | Showing ${(currentPage - 1) * pageLimit + 1} to ${Math.min(currentPage * pageLimit, totalRecords)} of ${totalRecords} records`}
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

export default AdminWalletLedger;
