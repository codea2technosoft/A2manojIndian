import React, { useEffect, useState, useRef } from "react";
import { Button, Table, Pagination, Row, Col } from "react-bootstrap";
import { BsFiletypeXls } from "react-icons/bs";
import { MdFilterAltOff, MdFilterAlt } from "react-icons/md";
import { Link } from "react-router-dom";
import { RiFilterFill } from "react-icons/ri";
import { FaEye } from "react-icons/fa";
import Swal from "sweetalert2";
import { FaCalendar, FaTimes } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const API_URL = process.env.REACT_APP_API_URL;

function RewardsMentorRoyalty() {
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
  const [isFilterActive, setIsFilterActive] = useState(false);

  const datePickerRef = useRef(null);
  const handleIconClick = () => {
    datePickerRef.current.setOpen(true);
  };
  const handleClear = () => {
    setFilterFromDate(null);
  };

  const pageLimit = 10;

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

  const formatDateForServer = (date) => {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const fetchLedger = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        gift_type: searchTerm.gift_type || filterToType,
        date_from: formatDateForServer(filterFromDate),
        date_to: formatDateForServer(filterToDate),
        page,
      });

      const response = await fetch(`${API_URL}/mantor-offer?${params}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();

      if (result.success === "1" || result.success === true) {
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
      console.error("Fetch error:", error);
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
        `${API_URL}/download-mentorr-royalty-rewards-achievements-lists?${params}`,
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
        text: "Please Check Entered From Date & To Date For Downloading 2.1 Mentor Royalty Achievements Lists Report.",
      });
    }
  };

  return (
    <div className="padding_15">
      <div className="userlist">
        <div className="card shadow-sm">
          <div className="card-header d-flex justify-content-between align-items-center gap-2">
            <div className="titlepage">
              <h3 style={{ whiteSpace: "wrap" }}>
                2.1 Mentor Royalty Achievements Lists
              </h3>
            </div>

            <div className="d-flex gap-2">
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
              <div className="gy-2 mb-3 d-flex align-items-center gap-2 flex-wrap-mobile">
                <div className="position-relative w-100">
                  <div
                    className="position-absolute"
                    style={{ top: "10px", right: "20px" }}
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
                    className="form-control"
                    // isClearable={true}
                    showPopperArrow={false}
                  />
                </div>

                <div className="position-relative w-100">
                  <div
                    className="position-absolute"
                    style={{ top: "10px", right: "20px" }}
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
                <Button variant="primary" onClick={() => fetchLedger(1)}>
                  <RiFilterFill /> Filter
                </Button>
              </div>
            )}

            {loading ? (
              <p>Loading records...</p>
            ) : (
              <>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Mobile</th>
                      <th>Achieved Area (SQYD)</th>
                      <th>Offer Name</th>
                      <th>Offer Item</th>
                      <th>Min Area Required</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ledger.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center">
                          No records found.
                        </td>
                      </tr>
                    ) : (
                      ledger.map((item, index) => (
                        <tr key={item.id || index}>
                          <td>{(currentPage - 1) * pageLimit + index + 1}</td>
                          <td>{item.username || "-"}</td>
                          <td>{item.mobile || "-"}</td>
                          <td>{item.total_buysqrt || "-"}</td>
                          <td>{item.gift_details?.offer_name || "-"}</td>
                          <td>{item.gift_details?.item_amount || "-"}</td>
                          <td>{item.gift_details?.min_area_sqyd || "-"}</td>
                          <td>
                            {item.user_id ? (
                              <Link
                                to={`/mentor-royalty-rewards-details/${item.user_id}`}
                                state={{
                                  userData: item,
                                  fromDate: filterFromDate,
                                  toDate: filterToDate,
                                }}
                              >
                                <Button
                                  variant="info"
                                  size="sm"
                                  title="View Mentor Royalty Details"
                                >
                                  <FaEye /> Details
                                </Button>
                              </Link>
                            ) : (
                              <Button
                                variant="secondary"
                                size="sm"
                                disabled
                                title="Missing user or project data"
                              >
                                <FaEye /> N/A
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>

                {ledger.length > 0 && (
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
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RewardsMentorRoyalty;
