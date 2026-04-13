import React, { useEffect, useState, useRef } from "react";
import {
  Modal,
  Button,
  Form,
  Table,
  Pagination,
  Row,
  Col,
  Container,
  Spinner,
} from "react-bootstrap";
import axios from "axios";
import { MdFilterAlt, MdFilterAltOff } from "react-icons/md";
import Swal from "sweetalert2";
import { FaCalendar, FaTimes } from "react-icons/fa";
import { BsFiletypeXls } from "react-icons/bs";
import { RiFilterFill } from "react-icons/ri";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const API_URL = process.env.REACT_APP_API_URL;

function WithdrawalStatusRejectedLists() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchName, setSearchName] = useState("");
  const [searchAccount, setSearchAccount] = useState("");
  const [submittedSearchName, setSubmittedSearchName] = useState("");
  const [submittedSearchAccount, setSubmittedSearchAccount] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");
  const [isFilterActive, setIsFilterActive] = useState(false);

  const datePickerRef = useRef(null);
  const handleIconClick = () => {
    datePickerRef.current.setOpen(true); // opens calendar when icon is clicked
  };
  const handleClear = () => {
    setFilterFromDate(null);
  };

  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  const handleToggle = () => {
    setIsFilterActive(!isFilterActive);
  };

  const formatDateForServer = (date) => {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  // Updated fetch function with date filters
  const fetchVisits = async (
    page = 1,
    name = "",
    account = "",
    status = "",
  ) => {
    setLoading(true);
    const token = getAuthToken();

    // Prepare query parameters using URLSearchParams
    const params = new URLSearchParams({
      page: page,
      limit: 10,
      name: name,
      account_number: account,
    });

    // Add status if selected
    if (Array.isArray(status) && status.length > 0) {
      status.forEach((s) => {
        params.append("status[]", s);
      });
    } else if (status) {
      params.append("status", status);
    }

    // Add date filters if they exist
    if (filterFromDate) {
      params.append("start_date", formatDateForServer(filterFromDate));
    }

    if (filterToDate) {
      params.append("end_date", formatDateForServer(filterToDate));
    }

    const query = params.toString();
    console.log(
      "API URL:",
      `${API_URL}/withdrawal-requests-rejected-list?${query}`,
    );

    try {
      const response = await axios.get(
        `${API_URL}/withdrawal-requests-rejected-list?${query}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const result = response.data;
      if (result.success === "1") {
        setVisits(result.data);
        setTotalPages(result.totalPages || 1);
        setCurrentPage(result.page || page);
      } else {
        setError(result.message || "Failed to fetch Rejected Data.");
        setVisits([]);
        setTotalPages(1);
      }
    } catch (err) {
      setError("Failed to fetch Rejected Data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits(
      currentPage,
      submittedSearchName,
      submittedSearchAccount,
      selectedStatus,
    );
  }, [
    currentPage,
    submittedSearchName,
    submittedSearchAccount,
    selectedStatus,
  ]);

  // Date filter submit function
  const handleDateFilterSubmit = () => {
    // Validate dates
    if (filterFromDate && filterToDate) {
      const fromDate = new Date(formatDateForServer(filterFromDate));
      const toDate = new Date(formatDateForServer(filterToDate));

      if (fromDate > toDate) {
        Swal.fire({
          icon: "warning",
          title: "Invalid Date Range",
          text: "From date cannot be greater than To date",
        });
        return;
      }
    }

    // Reset to first page and fetch data with date filters
    setCurrentPage(1);
    setSubmittedSearchName("");
    setSubmittedSearchAccount("");
    setSearchName("");
    setSearchAccount("");
    fetchVisits(1, "", "", selectedStatus);
  };

  // Clear date filters
  const clearDateFilters = () => {
    setFilterFromDate("");
    setFilterToDate("");
    setCurrentPage(1);
    fetchVisits(1, submittedSearchName, submittedSearchAccount, selectedStatus);
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSubmittedSearchName(searchName);
    setSubmittedSearchAccount(searchAccount);
    setCurrentPage(1);
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setSelectedStatus(newStatus);
    setSearchName("");
    setSearchAccount("");
    setSubmittedSearchName("");
    setSubmittedSearchAccount("");
    setFilterFromDate("");
    setFilterToDate("");
    setCurrentPage(1);
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
        start_date: formatDateForServer(filterFromDate),
        end_date: formatDateForServer(filterToDate),
      }).toString();

      // Update this URL to your actual endpoint for rejected list
      const response = await fetch(
        `${API_URL}/download-withdrawal-reject-excel?${params}`,
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
      link.setAttribute("download", `Filtered Withdrawal Rejected Report.xlsx`);
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
        text: "Please check the selected dates for downloading the report.",
      });
    }
  };

  if (loading) {
    return (
      <Container
        fluid
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid>
        <div className="alert alert-danger">{error}</div>
      </Container>
    );
  }

  return (
    <>
      <div className="card mt-2">
        <div className="card-header d-flex gap-2 flex-wrap-mobile justify-content-between align-items-center">
          <div className="titlepage">
            <h3 className="mb-0">Commission Rejected List Details</h3>
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
              className={`filter-toggle-btn btn ${isFilterActive ? "active" : ""}`}
              onClick={handleToggle}
            >
              {isFilterActive ? <MdFilterAltOff /> : <MdFilterAlt />}
            </button>
          </div>
        </div>

        {isFilterActive && (
          <div className="card-body pb-0">
            <Row className="gy-2">
              <Col md={5} className="position-relative">
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
              </Col>

              <Col md={5} className="position-relative">
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
              </Col>
              <Col md={2}>
                <Button variant="primary" onClick={handleDateFilterSubmit}>
                  <RiFilterFill /> Filter
                </Button>
              </Col>
            </Row>
          </div>
        )}

        <div className="card-body">
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Request Date</th>
                <th>Withdraw ID</th>
                <th>Name</th>
                <th>Mobile</th>
                <th>A/C Name</th>
                <th>Bank</th>
                <th>Branch Name</th>
                <th>Account Number</th>
                <th>IFSC Code</th>
                <th>Request Amount</th>
                <th>TDS %</th>
                <th>TDS Amount</th>
                <th>Net Amount (After TDS)</th>
                <th>Advance Payment</th>
                <th>Advance Payment Settled</th>
                <th>Remaining Advance Payment</th>
                <th>Net Payable Amount</th>
                <th>Remark</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {visits.length > 0 ? (
                visits.map((visit, index) => (
                  <tr key={visit.id}>
                    <td>{(currentPage - 1) * 10 + index + 1}</td>
                    <td>
                      {new Date(visit.updated_at)
                        .toLocaleDateString("en-GB")
                        .replace(/\//g, "-")}
                    </td>
                    <td>{visit.withdraw_id}</td>
                    <td>
                      {visit.username
                        ? visit.username.charAt(0).toUpperCase() +
                          visit.username.slice(1).toLowerCase()
                        : ""}
                    </td>
                    <td>{visit.mobile}</td>
                    <td>
                      {visit.account_holder_name
                        ? visit.account_holder_name.charAt(0).toUpperCase() +
                          visit.account_holder_name.slice(1).toLowerCase()
                        : ""}
                    </td>
                    <td>
                      {visit.bank_name
                        ? visit.bank_name.charAt(0).toUpperCase() +
                          visit.bank_name.slice(1).toLowerCase()
                        : ""}
                    </td>
                    <td>{visit.bank_branch_name || "NA"}</td>
                    <td>{visit.account_number}</td>
                    <td>{visit.ifsc_code}</td>
                    <td>₹ {visit.amount || "0.00"}</td>
                    <td>{visit.tds_percent || "0.00"}</td>
                    <td>₹ {visit.tds || "0.00"}</td>
                    <td>₹ {visit.amount_after_tds || "0.00"}</td>
                    <td>₹ {visit.advance_payment || "0.00"}</td>
                    <td>₹ {visit.advance_payment_used || "0.00"}</td>
                    <td>
                      ₹{" "}
                      {visit.advance_payment - visit.advance_payment_used ||
                        "0.00"}
                    </td>
                    <td>₹ {visit.net_payment || "0.00"}</td>
                    <td> {visit.remark || "NA"}</td>
                    <td
                      style={{
                        color: visit.status === "success" ? "green" : "red",
                      }}
                    >
                      {visit.status.charAt(0).toUpperCase() +
                        visit.status.slice(1)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="20"
                    className="text-center text-danger fw-bold  text-gray-500 py-4 italic bg-gray-50"
                  >
                    No rejected withdrawal requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          <div className="d-flex justify-content-end">
            {visits.length > 0 && totalPages > 1 && (
              <Pagination>
                <Pagination.Prev
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                />
                {[...Array(totalPages)].map((_, index) => (
                  <Pagination.Item
                    key={index + 1}
                    active={index + 1 === currentPage}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default WithdrawalStatusRejectedLists;
