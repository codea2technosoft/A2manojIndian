import React, { useEffect, useState, useRef } from "react";
import { Button, Form, Table, Pagination, Container, Spinner, Modal } from "react-bootstrap";
import axios from "axios";
import * as XLSX from 'xlsx';
import { MdFilterAlt } from "react-icons/md";
import { MdFilterAltOff } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL;

function AccountStatusList() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchName, setSearchName] = useState("");
  const [searchAccount, setSearchAccount] = useState("");
  const [searchMobile, setSearchMobile] = useState("");
  const [submittedSearchName, setSubmittedSearchName] = useState("");
  const [submittedSearchAccount, setSubmittedSearchAccount] = useState("");
  const [exporting, setExporting] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  // New state for edit functionality
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingVisit, setEditingVisit] = useState(null);
  const [editFormData, setEditFormData] = useState({
    account_holder_name: "",
    bank_name: "",
    account_number: "",
    ifsc_code: "",
    status: "",
    bank_branch_name: ""
  });
  const [updating, setUpdating] = useState(false);

  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  const [isFilterActive, setIsFilterActive] = useState(false);
  const handleToggle = () => {
    setIsFilterActive(!isFilterActive);
  };

  const fetchVisits = async (page = 1, name = "", account = "", status = "", mobile = "") => {
    setLoading(true);
    const token = getAuthToken();
    try {
      const response = await axios.get(
        `${API_URL}/bank-account-list-by-status?page=${page}&limit=10&status=${status}&name=${name}&account_number=${account}&mobile=${mobile}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = response.data;
      if (result.success === "1") {
        setVisits(result.data);
        setTotalPages(result.totalPages || 1);
        setCurrentPage(result.page || page);
      } else {
        setError(result.message || "Failed to fetch Bank  list.");
        setVisits([]);
        setTotalPages(1);
      }
    } catch (err) {
      setError("Failed to fetch Bank list.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits(currentPage, submittedSearchName, submittedSearchAccount, selectedStatus);
  }, [currentPage, submittedSearchName, submittedSearchAccount, selectedStatus]);

  // Edit functions
  const handleEditClick = (visit) => {
    setEditingVisit(visit);
    setEditFormData({
      account_holder_name: visit.account_holder_name || "",
      bank_name: visit.bank_name || "",
      account_number: visit.account_number || "",
      ifsc_code: visit.ifsc_code || "",
      status: visit.status || "",
      bank_branch_name: visit.bank_branch_name || ""
    });
    setShowEditModal(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  const handleUpdate = async () => {
    if (!editingVisit) return;

    setUpdating(true);
    const token = getAuthToken();

    try {
      const payload = {
        id: editingVisit.id,
        account_holder_name: editFormData.account_holder_name,
        bank_name: editFormData.bank_name,
        account_number: editFormData.account_number,
        ifsc_code: editFormData.ifsc_code,
        status: editFormData.status,
        bank_branch_name: editFormData.bank_branch_name
      };

      const response = await axios.post(
        `${API_URL}/update-bank-details`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      if (response.data.success === "1") {
        // Refresh the list after successful update
        fetchVisits(currentPage, submittedSearchName, submittedSearchAccount, selectedStatus);
        setShowEditModal(false);
        setEditingVisit(null);
      } else {
        alert("Update failed", response.data.message || "Failed to update bank details", "error");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Error", "Failed to update bank details", "error");
    } finally {
      setUpdating(false);
    }
  };

  const exportAllToExcel = async () => {
    setExporting(true);
    try {
      const token = getAuthToken();
      if (!token) {
        alert("Authentication Error", "Authentication token not found. Please log in.", "error");
        return;
      }

      let url = `${API_URL}/bank-account-list-by-status`;

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
        "account holder name": associate.account_holder_name,
        "Bank Name": associate.bank_name,
        "Account Number": associate.account_number,
        "IFSC": associate.ifsc_code,
        "Name": associate.username,
        "Mobile": associate.mobile,
        "Status": associate.status,
      })));

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Success-Reject");
      XLSX.writeFile(workbook, `All_Success-Reject_${new Date().toISOString().split('T')[0]}.xlsx`);

    } catch (err) {
      console.error("Export error:", err);
      alert("Error", "Failed to export Success-Reject.", "error");
    } finally {
      setExporting(false);
    }
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
    setCurrentPage(1);
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
        <div className="card-header d-flex justify-content-between align-items-center">
          <div className="titlepage">
            <h3 className="mb-0">Success/Reject List</h3>
          </div>
          {/* <div className="d-none d-md-block">
            <div className="d-flex gap-2">
              <Form.Group controlId="selectStatus">
                <Form.Select value={selectedStatus} onChange={handleStatusChange} className="text-light">
                  <option value="">All</option>
                  <option value="success">Success</option>
                  <option value="reject">Reject</option>
                </Form.Select>
              </Form.Group>
              <Form className="d-flex gap-2" onSubmit={handleSearchSubmit}>
                <Form.Group controlId="searchName">
                  <Form.Control
                    type="text"
                    placeholder="A/C Name"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="searchAccount">
                  <Form.Control
                    type="text"
                    placeholder="Search by Account"
                    value={searchAccount}
                    onChange={(e) => setSearchAccount(e.target.value)}
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Search
                </Button>
              </Form>
            </div>
          </div> */}

          <div className="d-block">
            <div className="d-flex gap-2">
               <button
                  className="btn btn-info text-white"
                  onClick={exportAllToExcel}
                  disabled={exporting}
                >
                  {exporting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Exporting All...
                    </>
                  ) : (
                    "Download"
                  )}
                </button>
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
        <div className="card-body">
          {isFilterActive && (
            <div className="d-flex gap-2 mb-3 mt-2 flex-wrap-mobile">
              <Form.Group className="w-100 text-dark" controlId="selectStatus">
                <Form.Select className="text-dark" value={selectedStatus} onChange={handleStatusChange}>
                  <option value="">All</option>
                  <option value="success">Success</option>
                  <option value="reject">Reject</option>
                </Form.Select>
              </Form.Group>
              <Form className="d-flex flex-wrap-mobile w-100 gap-2" onSubmit={handleSearchSubmit}>
                <Form.Group className="w-100" controlId="searchName">
                  <Form.Control
                    type="text"
                    placeholder="Search by Name"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="w-100" controlId="searchAccount">
                  <Form.Control
                    type="text"
                    placeholder="Search by Account"
                    value={searchAccount}
                    onChange={(e) => setSearchAccount(e.target.value)}
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Search
                </Button>
              </Form>
            </div>
          )}
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Mobile</th>
                <th>A/C Name</th>
                <th>Bank</th>
                <th>Branch Name</th>
                <th>A/C Number</th>
                <th>IFSC Code</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th> {/* New Action column */}
              </tr>
            </thead>
            <tbody>
              {visits.length > 0 ? (
                visits.map((visit, index) => (
                  <tr key={visit.id}>
                    <td>{(currentPage - 1) * 10 + index + 1}</td>
                    <td>
                      {visit.username
                        ? visit.username.charAt(0).toUpperCase() + visit.username.slice(1).toLowerCase()
                        : ''}
                    </td>
                    <td>{visit.mobile}</td>
                    <td>
                      {visit.account_holder_name
                        ? visit.account_holder_name.charAt(0).toUpperCase() + visit.account_holder_name.slice(1).toLowerCase()
                        : ''}
                    </td>
                    <td>
                      {visit.bank_name
                        ? visit.bank_name.charAt(0).toUpperCase() + visit.bank_name.slice(1).toLowerCase()
                        : ''}
                    </td>
                    <td>{visit.bank_branch_name || "NA"}</td>
                    <td>{visit.account_number}</td>
                    <td>{visit.ifsc_code}</td>
                    <td style={{ color: visit.status === "success" ? "green" : "red" }}>
                      {visit.status.charAt(0).toUpperCase() + visit.status.slice(1)}
                    </td>
                    <td>{new Date(visit.created_at).toLocaleDateString('en-GB').replace(/\//g, '-')}</td>
                    {/* <td>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleEditClick(visit)}
                      >
                        <FaEdit /> Edit
                      </Button>
                    </td> */}

                    <td>
                      {visit.status === "success" && (
                        <Button
                          variant="primary"
                          size="sm"
                          className="edit-btn-hover d-flex align-items-center gap-1"
                          onClick={() => handleEditClick(visit)}
                        >
                          <FaEdit className="edit-icon-hover" /> Edit
                        </Button>
                      )}
                      {visit.status === "reject" && (
                        <span className="text-muted">Not Allowed</span>
                      )}
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" className="text-center">
                    No accounts found with status "{selectedStatus}".
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          <div className="d-flex justify-content-end">
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
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Bank Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingVisit && (
            <Form>
              <div className="row">
                {/* Left Column - 6 fields in 6 columns */}
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Account Holder Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="account_holder_name"
                      value={editFormData.account_holder_name}
                      onChange={handleEditFormChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Bank Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="bank_name"
                      value={editFormData.bank_name}
                      onChange={handleEditFormChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Account Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="account_number"
                      value={editFormData.account_number}
                      onChange={handleEditFormChange}
                    />
                  </Form.Group>
                </div>

                {/* Right Column - 3 fields in 6 columns */}
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>IFSC Code</Form.Label>
                    <Form.Control
                      type="text"
                      name="ifsc_code"
                      value={editFormData.ifsc_code}
                      onChange={handleEditFormChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Branch Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="bank_branch_name"
                      value={editFormData.bank_branch_name}
                      onChange={handleEditFormChange}
                    />
                  </Form.Group>

                  {/* <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      name="status"
                      value={editFormData.status}
                      onChange={handleEditFormChange}
                    >
                      <option value="success">Success</option>
                      <option value="reject">Reject</option>
                    </Form.Select>
                  </Form.Group> */}
                </div>
              </div>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdate} disabled={updating}>
            {updating ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Updating...
              </>
            ) : (
              'Update'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AccountStatusList;