import React, { useEffect, useState, useRef } from "react";
import { Button, Form, Table, Pagination, Container, Spinner } from "react-bootstrap";
import axios from "axios";
import { MdFilterAlt } from "react-icons/md";
import { MdFilterAltOff } from "react-icons/md";

const API_URL = process.env.REACT_APP_API_URL;

function WithdrawlStatusList() {
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

  const getAuthToken = () => {
    return localStorage.getItem("token");
  };
  const [isFilterActive, setIsFilterActive] = useState(false);
  const handleToggle = () => {
    setIsFilterActive(!isFilterActive);
  };
  const fetchVisits = async (page = 1, name = "", account = "", status = "") => {
    setLoading(true);
    const token = getAuthToken();
    let query = `page=${page}&limit=10&name=${name}&account_number=${account}`;

    if (Array.isArray(status) && status.length > 0) {
      status.forEach(s => {
        query += `&status[]=${s}`;
      });
    } else if (status) {
      query += `&status=${status}`;
    }

    try {
      const response = await axios.get(`${API_URL}/withdrawal-requests-completed-list?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = response.data;
      if (result.success === "1") {
        setVisits(result.data);
        setTotalPages(result.totalPages || 1);
        setCurrentPage(result.page || page);
      } else {
        setError(result.message || "Failed to fetch visit list.");
        setVisits([]);
        setTotalPages(1);
      }
    } catch (err) {
      setError("Failed to fetch visit list.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchVisits(currentPage, submittedSearchName, submittedSearchAccount, selectedStatus);
  }, [currentPage, submittedSearchName, submittedSearchAccount, selectedStatus]);

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
          <div className="d-none d-md-block">

            <div className="d-flex gap-2">
              <Form.Group controlId="selectStatus">
                <Form.Select value={selectedStatus} onChange={handleStatusChange}>
                  <option value="">All</option>
                  <option value="success">Success</option>
                  <option value="reject">Reject</option>
                </Form.Select>
              </Form.Group>
              <Form className="d-flex gap-2" onSubmit={handleSearchSubmit}>
                <Form.Group controlId="searchName">
                  <Form.Control
                    type="text"
                    placeholder="Search by A/C Name"
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
            <div className="d-flex gap-2 mb-3 mt-2 flex-wrap-mobile">
              <Form.Group className="text-dark w-100" controlId="selectStatus">
                <Form.Select className="text-dark w-100" value={selectedStatus} onChange={handleStatusChange}>
                  <option value="">All</option>
                  <option value="success">Success</option>
                  <option value="reject">Reject</option>
                </Form.Select>
              </Form.Group>
              <Form className="d-flex flex-wrap-mobile gap-2" onSubmit={handleSearchSubmit}>
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
                <th>Request Date</th>
                <th>Withdraw ID</th>
                <th>Name</th>
                <th>Mobile</th>
                <th>A/C Name</th>
                <th>Bank</th>
                <th>Branch Name</th>
                <th>Account Number</th>
                <th>IFSC Code</th>
                {/* <th>Request Amount</th>
                <th>Advance Payment</th>
                    <th>Gross Payment</th>
                <th>TDS Deduction</th>
                <th>Net Payment</th> */}
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
                    <td>{new Date(visit.updated_at).toLocaleDateString('en-GB').replace(/\//g, '-')}</td>
                    <td>{visit.withdraw_id}</td>
                    <td>
                      {visit.username
                        ? visit.username.charAt(0).toUpperCase() + visit.username.slice(1).toLowerCase()
                        : ""}
                    </td>

                    <td>{visit.mobile}</td>
                    <td>
                      {visit.account_holder_name
                        ? visit.account_holder_name.charAt(0).toUpperCase() + visit.account_holder_name.slice(1).toLowerCase()
                        : ""}
                    </td>



                    <td>
                      {visit.bank_name
                        ? visit.bank_name.charAt(0).toUpperCase() + visit.bank_name.slice(1).toLowerCase()
                        : ""}
                    </td>

                    <td>{visit.bank_branch_name || "NA"}</td>


                  

                    

                    <td>{visit.account_number}</td>
                    <td>{visit.ifsc_code}</td>
                    {/* <td>₹ {visit.amount || "0.00"}</td>
                      <td>₹ {visit.advance_payment || "0.00"}</td>
                        <td>₹ {visit.amount - visit.advance_payment || "0.00"}</td>
                    <td>₹ {visit.tds || "0.00"}</td>
                    <td>₹ {visit.net_payment || "0.00"}</td> */}

                    <td>₹ {visit.amount || "0.00"}</td>
                    <td>{visit.tds_percent || "0.00"}</td>
                    <td>₹ {visit.tds || "0.00"}</td>
                    <td>₹ {visit.amount_after_tds || "0.00"}</td>

                    <td>₹ {visit.advance_payment || "0.00"}</td>
                    <td>₹ {visit.advance_payment_used || "0.00"}</td>
                    <td>₹ {visit.advance_payment - visit.advance_payment_used || "0.00"}</td>
                    <td>₹ {visit.net_payment || "0.00"}</td>

                    <td> {visit.remark || "NA"}</td>
                    <td style={{ color: visit.status === "success" ? "green" : "red" }}>
                      {visit.status.charAt(0).toUpperCase() + visit.status.slice(1)}
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center text-gray-500 py-4 italic bg-gray-50"
                  >
                    No accounts found with status <span className="font-semibold text-gray-700">"{selectedStatus}"</span>.
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

export default WithdrawlStatusList;