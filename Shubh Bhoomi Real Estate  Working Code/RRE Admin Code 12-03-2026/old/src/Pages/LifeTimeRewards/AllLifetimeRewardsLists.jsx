import React, { useEffect, useState, useRef } from "react";
import { Modal, Button, Table, Pagination, Row, Col } from "react-bootstrap";
import { BsFiletypeXls } from "react-icons/bs";
import { MdFilterAltOff, MdFilterAlt } from "react-icons/md";
import { Link } from "react-router-dom";
import { RiFilterFill } from "react-icons/ri";
import { FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";
import { FaCalendar, FaTimes } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const API_URL = process.env.REACT_APP_API_URL;

function AllLifetimeRewardsLists() {
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [searchTerm, setSearchTerm] = useState({ amount: "", type: "" });
  const [showFilter, setShowFilter] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1199);
  const [totals, setTotals] = useState({ total_credit: 0, total_debit: 0 });
  const token = localStorage.getItem("token");

  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");
  const [filterToType, setFilterToType] = useState("");

  const [isFilterActive, setIsFilterActive] = useState(false);

  const pageLimit = 10;


  const datePickerRef = useRef(null);
  const handleIconClick = () => {
    datePickerRef.current.setOpen(true);
  };
  const handleClear = () => {
    setFilterFromDate(null);
  };

  const toggleFilter = () => setShowFilter((prev) => !prev);
  const showCustomMessageModal = (title, text) => {
    //alert(`${title}: ${text}`);
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

  // Self Section API - lifetime-rewards-list
  // const fetchLedger = async (page = 1) => {
  //   setLoading(true);
  //   try {
  //     const params = new URLSearchParams({
  //       gift_type: searchTerm.gift_type || filterToType,
  //       date_from: formatDateForServer(filterFromDate),
  //       date_to: formatDateForServer(filterToDate),
  //       page,
  //     });
  //     const response = await fetch(`${API_URL}/lifetime-rewards-list?${params}`, {
  //       method: "GET",
  //       headers: { Authorization: `Bearer ${token}` },
  //     });

  //     const result = await response.json();

  //     if (result.success === "1") {
  //       setLedger(result.data || []);
  //       setTotalPages(result.total_pages || 1);
  //       setCurrentPage(result.current_page || 1);
  //       setTotalItems(result.total || 0);
  //     } else {
  //       showCustomMessageModal("Error", result.message || "Failed to fetch records.");
  //     }
  //   } catch (error) {
  //     showCustomMessageModal("Error", "Failed to fetch ledger data.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  // Self Section API - lifetime-rewards-list
  const fetchLedger = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        date_from: formatDateForServer(filterFromDate),
        date_to: formatDateForServer(filterToDate),
        area_sqyd: searchTerm.area_sqyd || "",
        offer_item: searchTerm.offer_item || "",
        // item_amount remove kar diya
        page,
      });

      const response = await fetch(`${API_URL}/lifetime-rewards-list?${params}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();

      if (result.success === "1") {
        setLedger(result.data || []);
        setTotalPages(result.total_pages || 1);
        setCurrentPage(result.current_page || 1);
        setTotalItems(result.total || 0);
      } else {
        showCustomMessageModal("Error", result.message || "Failed to fetch records.");
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

  const getPaginationGroup = (currentPage, totalPages) => {
    const start = Math.floor((currentPage - 1) / pageLimit) * pageLimit;
    return new Array(Math.min(pageLimit, totalPages - start))
      .fill()
      .map((_, idx) => start + idx + 1);
  };

  const formatDateForServer = (date) => {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
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
        gift_type: searchTerm.gift_type || filterToType,
        date_from: formatDateForServer(filterFromDate),
        date_to: formatDateForServer(filterToDate),
      }).toString();

      const response = await fetch(
        `${API_URL}/download-lifetime-rewards-lists?${params}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to download Excel");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `self offer lists.xlsx`);
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
        text: "Please Check Entered From Date & To Date For Downloading Lifetime Rewards Report.",
      });
    }
  };

  // Format currency with Indian numbering system
  const formatCurrency = (amount) => {
    if (!amount) return "₹0.00";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="padding_15">
      <div className="userlist mb-5">
        <div className="card shadow-sm">
          <div className="card-header d-flex justify-content-between align-items-center gap-2">
            <div className="titlepage">
              <h3>Lifetime Rewards</h3>
              {totalItems > 0 && (
                <p className="text-light mb-0">Total Rewards: {totalItems}</p>
              )}
            </div>

            <div className="createnewadmin">
              <Link to="/upload-lifetime-rewards" className="btn btn-success d-flex align-items-center">
                <FaPlus className="me-2" /> Add New Rewards
              </Link>
            </div>

            <div className="d-block d-md-none">
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
              <Row className="mb-3 gy-2 mobilesed">
                <Col md={3} style={{ position: "relative" }}>
                  <div className="position-absolute" style={{ top: '10px', right: '20px' }}>
                    {!filterFromDate ? (
                      <FaCalendar
                        onClick={handleIconClick}
                      />
                    ) : (
                      <FaTimes
                        onClick={handleClear}
                      />
                    )}
                  </div>
                  <DatePicker
                    ref={datePickerRef}
                    selected={filterFromDate}
                    onChange={(date) => setFilterFromDate(date)}
                    placeholderText="DD-MM-YYYY"
                    dateFormat="dd-MM-yyyy"
                    className="form-control"
                    // isClearable={true} 
                    showPopperArrow={false}
                  />
                </Col>


                <Col md={3} style={{ position: "relative" }}>
                  <div className="position-absolute" style={{ top: '10px', right: '20px' }}>
                    {!filterFromDate ? (
                      <FaCalendar
                        onClick={handleIconClick}
                      />
                    ) : (
                      <FaTimes
                        onClick={handleClear}
                      />
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
                </Col>
                <Col md={6}>
                  <input
                    type="text"
                    placeholder="Area SQYD"
                    className="form-control"
                    value={searchTerm.area_sqyd || ""}
                    onChange={(e) => setSearchTerm({ ...searchTerm, area_sqyd: e.target.value })}
                  />
                </Col>
                <Col md={6}>
                  <input
                    type="text"
                    placeholder="Offer Item"
                    className="form-control"
                    value={searchTerm.offer_item || ""}
                    onChange={(e) => setSearchTerm({ ...searchTerm, offer_item: e.target.value })}
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
                {/* <Col md={2} style={{ position: "relative" }}>
                  <div className="position-absolute" style={{ top: '10px', right: '20px' }}>
                    {!filterFromDate ? (
                      <FaCalendar
                        onClick={handleIconClick}
                      />
                    ) : (
                      <FaTimes
                        onClick={handleClear}
                      />
                    )}
                  </div>
                  <DatePicker
                    ref={datePickerRef}
                    selected={filterFromDate}
                    onChange={(date) => setFilterFromDate(date)}
                    placeholderText="DD-MM-YYYY"
                    dateFormat="dd-MM-yyyy"
                    className="form-control"
                    // isClearable={true} 
                    showPopperArrow={false}
                  />
                </Col>


                <Col md={2} style={{ position: "relative" }}>
                  <div className="position-absolute" style={{ top: '10px', right: '20px' }}>
                    {!filterFromDate ? (
                      <FaCalendar
                        onClick={handleIconClick}
                      />
                    ) : (
                      <FaTimes
                        onClick={handleClear}
                      />
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
                </Col> */}

                <Col md={2}>
                  <input
                    type="text"
                    placeholder="Area SQYD"
                    className="form-control"
                    value={searchTerm.area_sqyd || ""}
                    onChange={(e) => setSearchTerm({ ...searchTerm, area_sqyd: e.target.value })}
                  />
                </Col>

                <Col md={3}>
                  <input
                    type="text"
                    placeholder="Offer Item"
                    className="form-control"
                    value={searchTerm.offer_item || ""}
                    onChange={(e) => setSearchTerm({ ...searchTerm, offer_item: e.target.value })}
                  />
                </Col>
                <Col md={3} className="d-flex gap-2">
                  <Button variant="primary" onClick={() => fetchLedger(1)}>
                    <RiFilterFill /> Filter
                  </Button>
                  {/* <Button
                    variant="secondary"
                    onClick={() => {
                      setFilterFromDate("");
                      setFilterToDate("");
                      setSearchTerm({ amount: "", type: "", area_sqyd: "", offer_item: "" });
                      fetchLedger(1);
                    }}
                  >
                    Clear
                  </Button> */}
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

          <div className="card-body">
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading Rewards...</p>
              </div>
            ) : ledger.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-muted">No lifetime Rewards found.</p>
              </div>
            ) : (
              <>
                <Table striped bordered hover responsive className="align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th>#</th>
                      <th>Offer Name</th>
                      <th>Area SQYD</th>
                      <th>Offer Item</th>
                      <th>Item Amount</th>
                      <th>Terms & Conditions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ledger.map((item, index) => (
                      <tr key={item.id}>
                        <td className="fw-bold">{(currentPage - 1) * pageLimit + index + 1}</td>
                        <td>
                          {"Life Time Rewards"}
                        </td>

                        <td>
                          <span className="fs-6">
                            <div className="table-cell-remark">
                              {item.area_sqyd || "N/A"}
                            </div>
                          </span>
                        </td>

                        <td className="fw-semibold"> <div className="table-cell-remark">{item.offer_item || "N/A"}</div></td>
                        <td className="fw-bold text-success">
                          {formatCurrency(item.item_amount)}
                        </td>
                        <td>
                          {item.terms_conditions ? (
                            <div title={item.terms_conditions}>
                              <textarea
                                rows={5}
                                style={{ width: '350px' }}
                                value={item.terms_conditions}
                              />
                            </div>
                          ) : (
                            "N/A"
                          )}
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </Table>

                {totalPages > 1 && (
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div className="text-muted">
                      Showing {((currentPage - 1) * pageLimit) + 1} to {Math.min(currentPage * pageLimit, totalItems)} of {totalItems} entries
                    </div>
                    <div>
                      <Pagination>
                        <Pagination.Prev
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        />
                        {getPaginationGroup(currentPage, totalPages).map((item, index) => (
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
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div >
    </div >
  );
}

export default AllLifetimeRewardsLists;