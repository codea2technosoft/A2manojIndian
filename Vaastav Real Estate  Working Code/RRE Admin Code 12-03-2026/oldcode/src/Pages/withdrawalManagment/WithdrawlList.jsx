import React, { useEffect, useState, useRef } from "react";
import { FaCalendar, FaTimes } from "react-icons/fa";
import {
  Modal,
  Button,
  Form,
  Table,
  Pagination,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";
import axios from "axios";
import * as XLSX from "xlsx";
import { MdFilterAlt, MdFilterAltOff } from "react-icons/md";
import { RiFilterFill } from "react-icons/ri";
import { BsFiletypeXls } from "react-icons/bs";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const API_URL = process.env.REACT_APP_API_URL;
const imageAPIURL = process.env.REACT_APP_Image_URL;

function WithdrawlList() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");
  const [filterToType, setFilterToType] = useState(""); // Added missing state
  const datePickerRef = useRef(null);
  const handleIconClick = () => {
    datePickerRef.current.setOpen(true); // opens calendar when icon is clicked
  };
  const handleClear = () => {
    setFilterFromDate(null);
  };

  const [filters, setFilters] = useState({
    name: "",
    account_number: "",
    status: "",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10,
  });
  const [message, setMessage] = useState({ show: false, text: "", type: "" });

  const [statusModalShow, setStatusModalShow] = useState(false);
  const [requestToUpdate, setRequestToUpdate] = useState(null);
  const [approveModalShow, setApproveModalShow] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [PaymentMethods, setPaymentMethods] = useState("");
  const [slipImage, setSlipImage] = useState(null);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [remark, setRemark] = useState("");

  const handleToggle = () => {
    setIsFilterActive(!isFilterActive);
  };

  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  const showMessageModal = (text, type = "success") => {
    setMessage({ show: true, text, type });
  };

  const closeMessageModal = () => {
    setMessage({ show: false, text: "", type: "" });
  };

  const formatDateForServer = (date) => {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  // Updated fetch function with date filters
  const fetchWithdrawalRequests = async (page = 1, filterData = filters) => {
    setLoading(true);
    const token = getAuthToken();

    if (!token) {
      showMessageModal("Authentication token not found.", "danger");
      setLoading(false);
      return;
    }

    // Prepare params with date filters
    const params = {
      page,
      limit: pagination.limit,
      ...filterData,
    };

    // Add date filters if they exist
    if (filterFromDate) {
      params.start_date = formatDateForServer(filterFromDate);
    }

    if (filterToDate) {
      params.end_date = formatDateForServer(filterToDate);
    }

    console.log("Fetching with params:", params);

    try {
      const response = await axios.get(`${API_URL}/withdrawal-requests-list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      });

      if (response.data.success === "1") {
        setWithdrawals(response.data.data);
        setPagination({
          ...pagination,
          currentPage: response.data.page,
          totalPages: response.data.totalPages,
          totalItems: response.data.total,
        });
      } else {
        showMessageModal(
          response.data.message || "Failed to fetch data.",
          "danger",
        );
        setWithdrawals([]);
      }
    } catch (error) {
      console.error("API Error:", error);
      showMessageModal("An error occurred while fetching data.", "danger");
      setWithdrawals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawalRequests(pagination.currentPage);
  }, [pagination.currentPage]);

  // Date filter submit function
  const handleDateFilterSubmit = () => {
    // Validate dates
    if (filterFromDate && filterToDate) {
      const fromDate = new Date(formatDateForServer(filterFromDate));
      const toDate = new Date(formatDateForServer(filterToDate));

      if (fromDate > toDate) {
        showMessageModal("From date cannot be greater than To date", "danger");
        return;
      }
    }

    // Reset to first page and fetch data with date filters
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    fetchWithdrawalRequests(1, filters);
  };

  // Clear date filters
  const clearDateFilters = () => {
    setFilterFromDate("");
    setFilterToDate("");
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    fetchWithdrawalRequests(1, filters);
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: page }));
      fetchWithdrawalRequests(page);
    }
  };

  // handleStatusUpdateClick function
  const handleStatusUpdateClick = (id, newStatus) => {
    if (newStatus === "success") {
      setRequestToUpdate({ id, newStatus });
      setRemark(""); // Reset remark
      setApproveModalShow(true);
    } else {
      setRequestToUpdate({ id, newStatus });
      setRemark(""); // Reset remark
      setStatusModalShow(true);
    }
  };

  // updateRequestStatus function
  const updateRequestStatus = async () => {
    if (!requestToUpdate) return;
    setLoading(true);

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      const url = `${API_URL}/withdrawal-requests-update-status`;
      console.log("Making request to:", url);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const data = {
        request_id: requestToUpdate.id,
        status: requestToUpdate.newStatus,
        remark: remark, // Remark field add karein
      };

      console.log("Request payload:", data);

      const response = await axios.post(url, data, config);
      console.log("API Response:", response);

      if (response.data.success == 1) {
        showMessageModal(response.data.message, "success");
        fetchWithdrawalRequests(pagination.currentPage);
      } else {
        showMessageModal(
          response.data.message || "Failed to update status.",
          "danger",
        );
      }
    } catch (error) {
      console.error("Full error details:", {
        message: error.message,
        response: error.response,
        request: error.request,
        config: error.config,
      });

      let errorMessage = "An error occurred while updating the status.";

      if (error.response) {
        errorMessage =
          error.response.data?.error ||
          error.response.statusText ||
          `Server responded with ${error.response.status}`;
      } else if (error.request) {
        errorMessage = "No response received from server";
      }

      showMessageModal(errorMessage, "danger");
    } finally {
      setLoading(false);
      setStatusModalShow(false);
      setRequestToUpdate(null);
      setRemark(""); // Reset remark
    }
  };

  // handleApproveSubmit function
  const handleApproveSubmit = async () => {
    if (!requestToUpdate) return;

    const token = getAuthToken();
    const formData = new FormData();
    formData.append("request_id", requestToUpdate.id);
    formData.append("status", "success");
    formData.append("payment_utr", paymentUrl);
    formData.append("payment_methods", PaymentMethods);
    formData.append("remark", remark); // Remark field add karein

    if (slipImage) {
      formData.append("slip_image", slipImage);
    }

    try {
      const response = await axios.post(
        `${API_URL}/withdrawal-requests-update-status`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data.success == 1) {
        showMessageModal(response.data.message, "success");
        fetchWithdrawalRequests(pagination.currentPage);
        setApproveModalShow(false);
        setPaymentUrl("");
        setPaymentMethods("");
        setSlipImage(null);
        setRequestToUpdate(null);
        setRemark(""); // Reset remark
      } else {
        showMessageModal(
          response.data.message || "Failed to approve withdrawal",
          "danger",
        );
      }
    } catch (err) {
      console.error(err);
      showMessageModal("Error approving withdrawal", "danger");
    }
  };

  // Export to Excel function
  const exportAllToExcel = async () => {
    setExporting(true);
    const token = getAuthToken();

    try {
      // Implement your export logic here
      // This is a placeholder - you need to implement the actual export
      console.log("Exporting to Excel...");
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setExporting(false);
    }
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
        totalPages: pagination.totalPages,
        start_date: formatDateForServer(filterFromDate),
        end_date: formatDateForServer(filterToDate),
      }).toString();

      // Update this URL to your actual endpoint
      const response = await fetch(
        `${API_URL}/download-withdrawal-pending-excel?${params}`,
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
      link.setAttribute("download", `Filtered Withdrawal Pending Report.xlsx`);
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

  return (
    <>
      <div className="card mt-2">
        <div className="card-header">
          <div className="d-flex justify-content-between align-items-center gap-2 flex-wrap-mobile">
            <div className="titlepage">
              <h3 className="mb-0">Commission Pending Requests</h3>
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
                className={`filter-toggle-btn ${isFilterActive ? "active" : ""}`}
                onClick={handleToggle}
              >
                {isFilterActive ? <MdFilterAltOff /> : <MdFilterAlt />}
              </button>
            </div>
          </div>
        </div>

        <div className="card-body">
          {isFilterActive && (
            <div className="gy-2 mb-2 d-flex align-items-center gap-2 flex-wrap-mobile">
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
                  className="form-control"
                  showPopperArrow={false} 
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
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
                  showPopperArrow={false}
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                />
              </div>
              <Button
                className="gap-1"
                variant="primary"
                onClick={handleDateFilterSubmit}
              >
                <RiFilterFill /> Filter
              </Button>
            </div>
          )}

          {loading ? (
            <div className="text-center my-5">
              <Spinner animation="border" />
              <p className="mt-2">Loading withdrawal requests...</p>
            </div>
          ) : (
            <>
              <Table striped bordered hover responsive className="shadow-sm">
                <thead>
                  <tr>
                    <th>ID</th>
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
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawals.length > 0 ? (
                    withdrawals.map((item, index) => (
                      <tr key={item.id}>
                        <td>
                          {(pagination.currentPage - 1) * pagination.limit +
                            index +
                            1}
                        </td>
                        <td>
                          {new Date(item.created_at)
                            .toLocaleDateString("en-GB")
                            .replace(/\//g, "-")}
                        </td>
                        <td>{item.withdraw_id}</td>
                        <td>
                          {item.username
                            ? item.username.charAt(0).toUpperCase() +
                              item.username.slice(1).toLowerCase()
                            : ""}
                        </td>
                        <td>{item.mobile}</td>
                        <td>
                          {item.account_holder_name
                            ? item.account_holder_name.charAt(0).toUpperCase() +
                              item.account_holder_name.slice(1).toLowerCase()
                            : ""}
                        </td>
                        <td>
                          {item.bank_name
                            ? item.bank_name.charAt(0).toUpperCase() +
                              item.bank_name.slice(1).toLowerCase()
                            : ""}
                        </td>
                        <td>{item.bank_branch_name || "NA"}</td>
                        <td>{item.account_number}</td>
                        <td>{item.ifsc_code}</td>
                        <td>₹ {item.amount || "0.00"}</td>
                        <td>{item.tds_percent || "0.00"}</td>
                        <td>₹ {item.tds || "0.00"}</td>
                        <td>₹ {item.amount_after_tds || "0.00"}</td>
                        <td>₹ {item.advance_payment || "0.00"}</td>
                        <td>₹ {item.advance_payment_used || "0.00"}</td>
                        <td>
                          ₹{" "}
                          {item.advance_payment - item.advance_payment_used ||
                            "0.00"}
                        </td>
                        <td>₹ {item.net_payment || "0.00"}</td>
                        <td>
                          {item.status === "pending" && (
                            <div className="d-flex gap-2">
                              <Button
                                variant="success"
                                size="sm"
                                onClick={() =>
                                  handleStatusUpdateClick(item.id, "success")
                                }
                              >
                                Approve
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() =>
                                  handleStatusUpdateClick(item.id, "reject")
                                }
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="19" className="text-center">
                        No withdrawal requests found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>

              <div className="d-flex justify-content-end">
                <Pagination>
                  <Pagination.Prev
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                  />
                  <Pagination.Item
                    active={1 === pagination.currentPage}
                    onClick={() => handlePageChange(1)}
                  >
                    1
                  </Pagination.Item>
                  {pagination.currentPage > 3 && <Pagination.Ellipsis />}
                  {[...Array(pagination.totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    if (
                      pageNumber > 1 &&
                      pageNumber < pagination.totalPages &&
                      Math.abs(pageNumber - pagination.currentPage) <= 1
                    ) {
                      return (
                        <Pagination.Item
                          key={pageNumber}
                          active={pageNumber === pagination.currentPage}
                          onClick={() => handlePageChange(pageNumber)}
                        >
                          {pageNumber}
                        </Pagination.Item>
                      );
                    }
                    return null;
                  })}
                  {pagination.currentPage < pagination.totalPages - 2 && (
                    <Pagination.Ellipsis />
                  )}
                  {pagination.totalPages > 1 && (
                    <Pagination.Item
                      active={pagination.totalPages === pagination.currentPage}
                      onClick={() => handlePageChange(pagination.totalPages)}
                    >
                      {pagination.totalPages}
                    </Pagination.Item>
                  )}
                  <Pagination.Next
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                  />
                </Pagination>
              </div>
            </>
          )}

          <Modal show={message.show} onHide={closeMessageModal} centered>
            <Modal.Header closeButton>
              <Modal.Title
                className={
                  message.type === "success" ? "text-success" : "text-danger"
                }
              >
                {message.type === "success" ? "Success" : "Error"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>{message.text}</Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={closeMessageModal}>
                OK
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal
            show={approveModalShow}
            onHide={() => {
              setApproveModalShow(false);
              setRemark("");
            }}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Approve Withdrawal</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Payment UTR*</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter payment UTR"
                    value={paymentUrl}
                    onChange={(e) => setPaymentUrl(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Payment Mode*</Form.Label>
                  <Form.Select
                    className="text-dark"
                    value={PaymentMethods}
                    onChange={(e) => setPaymentMethods(e.target.value)}
                    required
                  >
                    <option value="">Select Payment Mode</option>
                    <option value="cash">Cash</option>
                    <option value="online">Online</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Slip Image</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSlipImage(e.target.files[0])}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Remark (Optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Enter any remarks..."
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                  />
                  <Form.Text className="text-muted">
                    Add any additional remarks for this approval
                  </Form.Text>
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => {
                  setApproveModalShow(false);
                  setRemark("");
                }}
              >
                Cancel
              </Button>
              <Button
                variant="success"
                onClick={handleApproveSubmit}
                disabled={loading || !paymentUrl.trim()}
              >
                {loading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  "Confirm Approve"
                )}
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal
            show={statusModalShow}
            onHide={() => {
              setStatusModalShow(false);
              setRemark("");
            }}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Reject Withdrawal</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <p className="mb-3 text-danger">
                  Are you sure you want to <strong>REJECT</strong> this
                  withdrawal request?
                </p>
                <Form.Group className="mb-3">
                  <Form.Label>Reason for Rejection*</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Please provide reason for rejection..."
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    required
                  />
                  <Form.Text className="text-danger">
                    This field is required for rejection
                  </Form.Text>
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => {
                  setStatusModalShow(false);
                  setRemark("");
                }}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={updateRequestStatus}
                disabled={loading || !remark.trim()}
              >
                {loading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  "Confirm Reject"
                )}
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </>
  );
}

export default WithdrawlList;
