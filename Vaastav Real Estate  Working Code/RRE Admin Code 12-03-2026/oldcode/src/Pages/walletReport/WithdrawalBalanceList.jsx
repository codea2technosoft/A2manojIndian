import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus, FaEdit, FaEye } from "react-icons/fa";
import { RiDeleteBin3Fill } from "react-icons/ri";
import { HiOutlineChevronLeft, HiChevronRight } from "react-icons/hi2";
import { BsThreeDots } from "react-icons/bs";
import { Modal, Button, Form, Table, Pagination, Row, Col, Container, Spinner } from "react-bootstrap";
import axios from "axios";
import * as XLSX from 'xlsx';
import { MdFilterAlt } from "react-icons/md";
import { MdFilterAltOff } from "react-icons/md";
import { FaDownload } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";


const API_URL = process.env.REACT_APP_API_URL;
const imageAPIURL = process.env.REACT_APP_Image_URL;


function WithdrawlBalanceList() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
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
  const [slipImage, setSlipImage] = useState(null);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [remark, setRemark] = useState('');
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

  const fetchWithdrawalRequests = async (page = 1, filterData = filters) => {
    setLoading(true);
    const token = getAuthToken();

    if (!token) {
      showMessageModal("Authentication token not found.", "danger");
      setLoading(false);
      return;
    }

    const params = {
      page,
      limit: pagination.limit,
      ...filterData,
    };

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
        showMessageModal(response.data.message || "Failed to fetch data.", "danger");
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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    fetchWithdrawalRequests(1, filters);
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: page }));
    }
  };

  // handleStatusUpdateClick function ko update karein (line 174 ke baad):
  const handleStatusUpdateClick = (id, newStatus) => {
    if (newStatus === "success") {
      setRequestToUpdate({ id, newStatus });
      setRemark(''); // Reset remark
      setApproveModalShow(true);
    } else {
      setRequestToUpdate({ id, newStatus });
      setRemark(''); // Reset remark
      setStatusModalShow(true);
    }
  };

  // updateRequestStatus function ko update karein (line 190 ke baad):
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
          'Content-Type': 'application/json'
        }
      };

      const data = {
        request_id: requestToUpdate.id,
        status: requestToUpdate.newStatus,
        remark: remark // Remark field add karein
      };

      console.log("Request payload:", data);

      const response = await axios.post(url, data, config);
      console.log("API Response:", response);

      if (response.data.success == 1) {
        showMessageModal(response.data.message, "success");
        fetchWithdrawalRequests(pagination.currentPage);
      } else {
        showMessageModal(response.data.message || "Failed to update status.", "danger");
      }
    } catch (error) {
      console.error("Full error details:", {
        message: error.message,
        response: error.response,
        request: error.request,
        config: error.config
      });

      let errorMessage = "An error occurred while updating the status.";

      if (error.response) {
        errorMessage = error.response.data?.error ||
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
      setRemark(''); // Reset remark
    }
  };

  // handleApproveSubmit function ko update karein (line 252 ke baad):
  const handleApproveSubmit = async () => {
    if (!requestToUpdate) return;

    const token = getAuthToken();
    const formData = new FormData();
    formData.append("request_id", requestToUpdate.id);
    formData.append("status", "success");
    formData.append("payment_utr", paymentUrl);
    formData.append("remark", remark); // Remark field add karein

    if (slipImage) {
      formData.append("slip_image", slipImage);
    }

    try {
      const response = await axios.post(`${API_URL}/withdrawal-requests-update-status`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success == 1) {
        showMessageModal(response.data.message, "success");
        fetchWithdrawalRequests(pagination.currentPage);
        setApproveModalShow(false);
        setPaymentUrl("");
        setSlipImage(null);
        setRequestToUpdate(null);
        setRemark(''); // Reset remark
      } else {
        showMessageModal(response.data.message || "Failed to approve withdrawal", "danger");
      }
    } catch (err) {
      console.error(err);
      showMessageModal("Error approving withdrawal", "danger");
    }
  };


  const renderPaginationItems = () => {
    const items = [];
    const { currentPage, totalPages } = pagination;
    const maxVisiblePages = 5;

    items.push(
      <Pagination.Prev
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      />
    );

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <Pagination.Item key={i} active={i === currentPage} onClick={() => handlePageChange(i)}>
            {i}
          </Pagination.Item>
        );
      }
    } else {
      items.push(
        <Pagination.Item key={1} active={1 === currentPage} onClick={() => handlePageChange(1)}>
          {1}
        </Pagination.Item>
      );

      if (currentPage > maxVisiblePages - 2) {
        items.push(<Pagination.Ellipsis key="dots1" />);
      }

      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        startPage = 2;
        endPage = 4;
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
        endPage = totalPages - 1;
      }

      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <Pagination.Item key={i} active={i === currentPage} onClick={() => handlePageChange(i)}>
            {i}
          </Pagination.Item>
        );
      }

      if (currentPage < totalPages - 2) {
        items.push(<Pagination.Ellipsis key="dots2" />);
      }

      items.push(
        <Pagination.Item key={totalPages} active={totalPages === currentPage} onClick={() => handlePageChange(totalPages)}>
          {totalPages}
        </Pagination.Item>
      );
    }

    items.push(
      <Pagination.Next
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      />
    );

    return items;
  };


  const exportAllToExcel = async () => {
    setExporting(true);
    try {
      const token = getAuthToken();
      if (!token) {
        alert("Authentication Error", "Authentication token not found. Please log in.", "error");
        return;
      }


      let url = `${API_URL}/withdrawal-requests-list-excel`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert("Error", errorData.message || "Failed to fetch associates.", "error");
        return;
      }

      const data = await response.json();
      const allAssociates = data.data || [];
      const worksheet = XLSX.utils.json_to_sheet(allAssociates.map(associate => ({
        "SL No.": allAssociates.indexOf(associate) + 1,
        "Withdraw ID": associate.withdraw_id,
        "Bank Name": associate.bank_name,
        "Bank Branch Name": associate.bank_branch_name,
        "Amount": associate.amount,
        "Account Holder Name": associate.account_holder_name,
        "Account Number": associate.account_number,
        "IFSC": associate.ifsc_code,
      })));

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Pending");
      XLSX.writeFile(workbook, `All_PendingPayment_${new Date().toISOString().split('T')[0]}.xlsx`);

    } catch (err) {
      console.error("Export error:", err);
      alert("Error", "Failed to export expenses.", "error");
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      <div className="card mt-2">
        <div className="card-header">
          <div className="d-flex justify-content-between align-items-center">
            <div className="titlepage">
              <h3 className="mb-0">Wallet Balance (Without Withdrawal Request)</h3>
            </div>
            {/* <div className="d-none d-md-block">
              <Form onSubmit={handleFilterSubmit} className="d-flex gap-2">
                <Form.Group>
                  <Form.Control
                    type="text"
                    name="name"
                    value={filters.name}
                    onChange={handleFilterChange}
                    placeholder="Search by A/C Name"
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Control
                    type="text"
                    name="account_number"
                    value={filters.account_number}
                    onChange={handleFilterChange}
                    placeholder="Search by Account"
                  />
                </Form.Group>
                <button
                  className="exportingall"
                  onClick={exportAllToExcel}
                  disabled={exporting}
                >
                  {exporting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Exporting All...
                    </>
                  ) : (
                    
                    <FaDownload/>)}
                </button>
                <Button variant="primary" type="submit">
                  Search
                </Button>
              </Form>
            </div> */}


            <div className="d-md-block d-none">
              <div className="d-flex gap-2">
                <div className="createnewadmin">
                  <Link
                    to="/account-report"
                    className="btn btn-success d-inline-flex align-items-center"
                  >
                    <FaArrowLeft className="me-2" /> Back
                  </Link>
                </div>
              </div>
            </div>


            <div className="d-block d-md-none">
              <div className="d-flex gap-2">

                <button
                  className={`filter-toggle-btn ${isFilterActive ? "active" : ""}`}
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

          </div>
        </div>
        <div class="card-body">
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
                    <th>Status</th>

                  </tr>
                </thead>
                <tbody>
                  {withdrawals.length > 0 ? (
                    withdrawals.map((item, index) => (
                      <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>{new Date(item.created_at).toLocaleDateString('en-GB').replace(/\//g, '-')}</td>
                        <td>{item.withdraw_id}</td>
                        <td>
                          {item.username
                            ? item.username.charAt(0).toUpperCase() + item.username.slice(1).toLowerCase()
                            : ""}
                        </td>
                        <td>{item.mobile}</td>
                        <td>
                          {item.account_holder_name
                            ? item.account_holder_name.charAt(0).toUpperCase() + item.account_holder_name.slice(1).toLowerCase()
                            : ""}
                        </td>



                        <td>
                          {item.bank_name
                            ? item.bank_name.charAt(0).toUpperCase() + item.bank_name.slice(1).toLowerCase()
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
                        <td>₹ {item.advance_payment - item.advance_payment_used || "0.00"}</td>
                        <td>₹ {item.net_payment || "0.00"}</td>
                        <td
                          className={
                            item.status?.toLowerCase() === "pending"
                              ? "text-warning fw-bold"
                              : item.status?.toLowerCase() === "approved"
                                ? "text-success fw-bold"
                                : item.status?.toLowerCase() === "rejected"
                                  ? "text-danger fw-bold"
                                  : ""
                          }
                        >
                          {item.status
                            ? item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase()
                            : "NA"}
                        </td>




                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center">No withdrawal requests found.</td>
                    </tr>
                  )}
                </tbody>
              </Table>


              {pagination.totalPages > 1 && (
                <div className="d-flex justify-content-center">
                  <Pagination>
                    {renderPaginationItems()}
                  </Pagination>
                </div>
              )}
            </>
          )}


          <Modal show={message.show} onHide={closeMessageModal} centered>
            <Modal.Header closeButton>
              <Modal.Title className={message.type === "success" ? "text-success" : "text-danger"}>
                {message.type === "success" ? "Success" : "Error"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>{message.text}</Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={closeMessageModal}>OK</Button>
            </Modal.Footer>
          </Modal>


          <Modal show={approveModalShow} onHide={() => {
            setApproveModalShow(false);
            setRemark(''); // Reset remark
          }} centered>
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
              <Button variant="secondary" onClick={() => {
                setApproveModalShow(false);
                setRemark('');
              }}>
                Cancel
              </Button>
              <Button
                variant="success"
                onClick={handleApproveSubmit}
                disabled={loading || !paymentUrl.trim()}
              >
                {loading ? <Spinner animation="border" size="sm" /> : "Confirm Approve"}
              </Button>
            </Modal.Footer>
          </Modal>


          <Modal show={statusModalShow} onHide={() => {
            setStatusModalShow(false);
            setRemark(''); // Reset remark
          }} centered>
            <Modal.Header closeButton>
              <Modal.Title>Reject Withdrawal</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <p className="mb-3 text-danger">
                  Are you sure you want to <strong>REJECT</strong> this withdrawal request?
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
              <Button variant="secondary" onClick={() => {
                setStatusModalShow(false);
                setRemark('');
              }}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={updateRequestStatus}
                disabled={loading || !remark.trim()}
              >
                {loading ? <Spinner animation="border" size="sm" /> : "Confirm Reject"}
              </Button>
            </Modal.Footer>
          </Modal>

        </div>
      </div>
    </>
  );
}

export default WithdrawlBalanceList;