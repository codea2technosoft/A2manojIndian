import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Modal, Button, Form, Table, Pagination, Row, Col, Container, Spinner } from "react-bootstrap";
import axios from "axios";
import { MdFilterAlt } from "react-icons/md";
import { MdFilterAltOff } from "react-icons/md";

const API_URL = process.env.REACT_APP_API_URL;
const imageAPIURL = process.env.REACT_APP_Image_URL;

function AccountList() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchName, setSearchName] = useState("");
  const [searchAccount, setSearchAccount] = useState("");
  const [submittedSearchName, setSubmittedSearchName] = useState("");
  const [submittedSearchAccount, setSubmittedSearchAccount] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const searchTimeoutRef = useRef(null);

  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  const [isFilterActive, setIsFilterActive] = useState(false);
  const handleToggle = () => {
    setIsFilterActive(!isFilterActive);
  };
  const fetchVisits = async (page = 1, name = "", account = "") => {
    setLoading(true);
    const token = getAuthToken();
    try {
      const response = await axios.get(
        `${API_URL}/bank-account-pending-list?page=${page}&limit=10&name=${name}&account_number=${account}`,
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
        setCurrentPage(result.currentPage || page);
      }
    } catch (err) {
      setError("Failed to fetch visit list.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusAction = (accountId, action) => {
    setSelectedAccount(accountId);
    setSelectedAction(action);
    setShowConfirmModal(true);
  };

  const confirmStatusChange = async () => {
    const token = getAuthToken();
    try {
      await axios.put(
        `${API_URL}/bank-account-update-status`,
        { id: selectedAccount, status: selectedAction },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      fetchVisits(currentPage, submittedSearchName, submittedSearchAccount);
    } catch (err) {
      setError("Failed to update account status.");
      console.error(err);
    } finally {
      setShowConfirmModal(false);
    }
  };

  useEffect(() => {
    fetchVisits(currentPage, submittedSearchName, submittedSearchAccount);
  }, [currentPage, submittedSearchName, submittedSearchAccount]);

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
          <h5 className="mb-0">Pending Account List</h5>
          <div className="d-none d-md-block">
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
        <div className="card-body">
              {isFilterActive && (
               <Form className="d-flex gap-2 mb-3 mt-2 flex-wrap-mobile" onSubmit={handleSearchSubmit}>
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
          )}
          <div className="table-responsive">
            <Table striped bordered hover>
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
                  <th>Image</th>
                  <th>Date</th>
                  <th>Action</th>
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
                      <td>
                        {visit.image ? (
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'nowrap', alignItems: 'center' }}>
                            {visit.image.split(',').map((img, index) => {
                              const fileUrl = `${imageAPIURL}/loanlead/${img.trim()}`;
                              return (
                                <div
                                  key={index}
                                  style={{
                                    position: 'relative',
                                    display: 'inline-block',
                                    width: '60px',
                                    height: '60px',
                                    overflow: 'hidden',
                                    borderRadius: '6px',
                                    border: '1px solid #ddd',
                                    flex: '0 0 auto' // ✅ keeps items side by side
                                  }}
                                >
                                  {img.toLowerCase().endsWith('.pdf') ? (
                                    <div style={{
                                      width: '100%',
                                      height: '100%',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      background: '#f5f5f5'
                                    }}>
                                      <span style={{ fontSize: '10px', fontWeight: 'bold' }}>PDF</span>
                                    </div>
                                  ) : (
                                    <img
                                      src={fileUrl}
                                      alt={`Uploaded ${index + 1}`}
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        cursor: "pointer"
                                      }}
                                      onClick={() => window.open(fileUrl, "_blank")}
                                    />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          "No Document"
                        )}
                      </td>


                      <td>{new Date(visit.created_at).toLocaleDateString('en-GB').replace(/\//g, '-')}</td>
                      <td>
                        {visit.status === 'pending' && (
                          <div className="d-flex gap-2">
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => handleStatusAction(visit.id, 'success')}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleStatusAction(visit.id, 'reject')}
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
                    <td colSpan="8" className="text-center">
                      No Account found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
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


      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Action</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to {selectedAction === 'success' ? 'approve' : 'reject'} this account?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </Button>
          <Button variant={selectedAction === 'success' ? 'success' : 'danger'} onClick={confirmStatusChange}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AccountList;