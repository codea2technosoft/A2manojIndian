import React, { useEffect, useRef, useState } from "react";
import { Modal, Button, Table, Pagination, Row, Col } from "react-bootstrap";
import { BsFiletypeXls } from "react-icons/bs";
import { MdFilterAltOff, MdFilterAlt } from "react-icons/md";
import { RiFilterFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import Swal from "sweetalert2";
import { FaCalendar, FaTimes } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const API_URL = process.env.REACT_APP_API_URL;

function AllLifetimeRewardsWinnerLists() {
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [searchTerm, setSearchTerm] = useState({
    username: "",
    mobile: "",
    area_sqyd: "",
    offer_item: "",
  });
  const [showFilter, setShowFilter] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1199);
  const token = localStorage.getItem("token");

  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");
  const [filterToType, setFilterToType] = useState("");

  const [isFilterActive, setIsFilterActive] = useState(false);

  const pageLimit = 10;
  const toggleFilter = () => setShowFilter((prev) => !prev);
  const showCustomMessageModal = (title, text) => {};

  const datePickerRef = useRef(null);
  const handleIconClick = () => {
    datePickerRef.current.setOpen(true);
  };
  const handleClear = () => {
    setFilterFromDate(null);
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
        page: page,
        limit: pageLimit,
        username: searchTerm.username || "",
        mobile: searchTerm.mobile || "",
        area_sqyd: searchTerm.area_sqyd || "",
        offer_item: searchTerm.offer_item || "",
        date_from: formatDateForServer(filterFromDate) || "",
        date_to: formatDateForServer(filterToDate) || "",
      });

      Array.from(params.entries()).forEach(([key, value]) => {
        if (!value) params.delete(key);
      });

      const response = await fetch(
        `${API_URL}/lifetime-rewards-winner-list?${params}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const result = await response.json();

      // Debug के लिए console.log add करें
      console.log("API Response:", result);
      console.log("Data received:", result.data);
      console.log("Data length:", result.data?.length || 0);

      if (result.success === true) {
        // यहाँ check करें कि data कहाँ है
        const ledgerData = result.data || [];
        console.log("Setting ledger data:", ledgerData);

        setLedger(ledgerData);
        setTotalItems(result.total_users || ledgerData.length);

        // Calculate total pages based on total_users
        const totalUsers = result.total_users || ledgerData.length;
        setTotalPages(Math.ceil(totalUsers / pageLimit));
        setCurrentPage(page);
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

  const getPaginationGroup = (currentPage, totalPages) => {
    const start = Math.floor((currentPage - 1) / pageLimit) * pageLimit;
    return new Array(Math.min(pageLimit, totalPages - start))
      .fill()
      .map((_, idx) => start + idx + 1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) return "-";

      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch (error) {
      console.error("Date parsing error:", error);
      return "-";
    }
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
        username: searchTerm.username || "",
        mobile: searchTerm.mobile || "",
        area_sqyd: searchTerm.area_sqyd || "",
        offer_item: searchTerm.offer_item || "",
        date_from: formatDateForServer(filterFromDate) || "",
        date_to: formatDateForServer(filterToDate) || "",
      }).toString();

      const response = await fetch(
        `${API_URL}/download-lifetime-rewards-winner-list?${params}`,
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
      link.setAttribute("download", `lifetime_rewards_winners.xlsx`);
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
        text: "Please check your filters Lifetime Rewards Winner Lists.",
      });
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return "₹0.00";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const clearFilters = () => {
    setSearchTerm({ username: "", mobile: "", area_sqyd: "", offer_item: "" });
    setFilterFromDate("");
    setFilterToDate("");
    setFilterToType("");
    fetchLedger(1);
  };

  // Helper function to get reward items count
  const getRewardCount = (rewards) => {
    return rewards?.length || 0;
  };

  // Helper function to get reward item names
  const getRewardItems = (rewards) => {
    if (!rewards || rewards.length === 0) return "-";
    return rewards.map((r) => r.reward.offer_item).join(", ");
  };

  // Helper function to get total eligible rewards
  const getTotalEligibleRewards = (rewards) => {
    return rewards?.length || 0;
  };

  return (
    <div className="padding_15">
      <div className="userlist mb-5">
        <div className="card shadow-sm">
          <div className="card-header d-flex justify-content-between align-items-center gap-2">
            <div className="titlepage">
              <h3>Lifetime Rewards Winner Lists</h3>
              {totalItems > 0 && (
                <p className="text-light mb-0">Total Winners: {totalItems}</p>
              )}
            </div>

            <div className="d-flex">
              <button
                className={`filter-toggle-btn btn btn-primary ${isFilterActive ? "active" : ""}`}
                onClick={handleToggle}
              >
                {isFilterActive ? <MdFilterAltOff /> : <MdFilterAlt />}
              </button>
            </div>
          </div>

          {isFilterActive && (
            <div className="card-body">
              <Row className="gy-2">
                <Col md={2} style={{ position: "relative" }}>
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
                    showPopperArrow={false}
                  />
                </Col>

                <Col md={2} style={{ position: "relative" }}>
                  <div
                    className="position-absolute"
                    style={{ top: "10px", right: "20px" }}
                  >
                    {!filterToDate ? (
                      <FaCalendar onClick={handleIconClick} />
                    ) : (
                      <FaTimes onClick={handleClear} />
                    )}
                  </div>
                  <DatePicker
                    selected={filterToDate}
                    onChange={(date) => setFilterToDate(date)}
                    placeholderText="DD-MM-YYYY"
                    dateFormat="dd-MM-yyyy"
                    className="form-control"
                    showPopperArrow={false}
                  />
                </Col>

                <Col md={2}>
                  <input
                    type="text"
                    placeholder="Search by Name"
                    className="form-control"
                    value={searchTerm.username || ""}
                    onChange={(e) =>
                      setSearchTerm({ ...searchTerm, username: e.target.value })
                    }
                  />
                </Col>

                <Col md={2}>
                  <input
                    type="text"
                    placeholder="Search by Mobile"
                    className="form-control"
                    value={searchTerm.mobile || ""}
                    onChange={(e) =>
                      setSearchTerm({ ...searchTerm, mobile: e.target.value })
                    }
                  />
                </Col>

                <Col md={2}>
                  <input
                    type="text"
                    placeholder="Area SQYD"
                    className="form-control"
                    value={searchTerm.area_sqyd || ""}
                    onChange={(e) =>
                      setSearchTerm({
                        ...searchTerm,
                        area_sqyd: e.target.value,
                      })
                    }
                  />
                </Col>

                <Col md={2}>
                  <input
                    type="text"
                    placeholder="Offer Item"
                    className="form-control"
                    value={searchTerm.offer_item || ""}
                    onChange={(e) =>
                      setSearchTerm({
                        ...searchTerm,
                        offer_item: e.target.value,
                      })
                    }
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
            </div>
          )}

          <div className="card-body">
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading Rewards...</p>
              </div>
            ) : (
              <>
                <Table
                  striped
                  bordered
                  hover
                  responsive
                  className="align-middle"
                >
                  <thead className="table-dark">
                    <tr>
                      <th>#</th>
                      <th>Achieved Date</th>
                      <th>Associate Name</th>
                      <th>Associate Mobile</th>
                      <th>Reward Qualified Target SQYD</th>
                      <th>Total Eligible Rewards</th>
                      <th>Achieved Item</th>
                      <th>Amount</th>
                      <th>Total SQYD</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ledger.length > 0 ? (
                      ledger.map((item, index) => {
                        // Agar multiple rewards hain to alag-alag rows me dikhao
                        if (item.rewards && item.rewards.length > 1) {
                          return item.rewards.map((rewardItem, idx) => (
                            <tr key={`${item.user_id}-${idx}`}>
                              <td className="fw-bold">
                                {idx === 0
                                  ? (currentPage - 1) * pageLimit + index + 1
                                  : ""}
                              </td>
                              <td>{formatDate(rewardItem.achievementDate)}</td>

                              <td className="fw-semibold">
                                {idx === 0 ? item.username || "N/A" : ""}
                              </td>
                              <td>{idx === 0 ? item.mobile || "N/A" : ""}</td>
                              <td>
                                {idx === 0 ? (
                                  <span className="fs-6 fw-bold text-primary">
                                    {rewardItem.reward.area_sqyd} SQYD
                                  </span>
                                ) : (
                                  ""
                                )}
                              </td>
                              <td>
                                {idx === 0 ? (
                                  <span className="fs-6">
                                    {getTotalEligibleRewards(item.rewards)}
                                  </span>
                                ) : (
                                  ""
                                )}
                              </td>
                              <td>{rewardItem.reward.offer_item}</td>
                              <td>
                                {formatCurrency(rewardItem.reward.item_amount)}
                              </td>

                              <td>{rewardItem.totalArea?.toFixed(2)} SQYD</td>
                            </tr>
                          ));
                        }
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan="9"
                          className="text-center py-5 text-danger fw-bold"
                        >
                          <p className="text-muted small mb-3 text-danger fw-bold">
                            No lifetime Rewards winners available.
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>

                {ledger.length > 0 && totalPages > 1 && (
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div className="text-muted">
                      Showing {(currentPage - 1) * pageLimit + 1} to{" "}
                      {Math.min(currentPage * pageLimit, totalItems)} of{" "}
                      {totalItems} entries
                    </div>
                    <div>
                      <Pagination>
                        <Pagination.Prev
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        />

                        <Pagination.Item
                          active={1 === currentPage}
                          onClick={() => handlePageChange(1)}
                        >
                          1
                        </Pagination.Item>

                        {currentPage > 4 && <Pagination.Ellipsis disabled />}

                        {Array.from(
                          { length: Math.min(5, totalPages - 2) },
                          (_, i) => {
                            let pageNumber;
                            if (currentPage <= 3) {
                              pageNumber = i + 2;
                            } else if (currentPage >= totalPages - 2) {
                              pageNumber = totalPages - 5 + i;
                            } else {
                              pageNumber = currentPage - 2 + i;
                            }

                            if (pageNumber > 1 && pageNumber < totalPages) {
                              return (
                                <Pagination.Item
                                  key={pageNumber}
                                  active={pageNumber === currentPage}
                                  onClick={() => handlePageChange(pageNumber)}
                                >
                                  {pageNumber}
                                </Pagination.Item>
                              );
                            }
                            return null;
                          },
                        )}

                        {currentPage < totalPages - 3 && (
                          <Pagination.Ellipsis disabled />
                        )}

                        {totalPages > 1 && (
                          <Pagination.Item
                            active={totalPages === currentPage}
                            onClick={() => handlePageChange(totalPages)}
                          >
                            {totalPages}
                          </Pagination.Item>
                        )}

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
      </div>
    </div>
  );
}

export default AllLifetimeRewardsWinnerLists;
