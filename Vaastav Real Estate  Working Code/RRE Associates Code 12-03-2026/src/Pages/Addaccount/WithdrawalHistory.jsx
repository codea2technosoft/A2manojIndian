import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { MdFilterListAlt } from "react-icons/md";
import { MdFilterAltOff } from "react-icons/md";

import {
  Table,
  Form,
  Spinner,
  Badge,
  Container,
  Button,
  Modal,
  Row,
  Col,
} from "react-bootstrap";
import { MdArrowBackIosNew } from "react-icons/md";
import { MdArrowForwardIos } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { FaEye, FaEdit } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { FaHistory } from "react-icons/fa";

import {
  MdAirplanemodeInactive,
  MdAirplanemodeActive,
  MdOutlineUpcoming,
  MdUpcoming,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";

import { Pagination } from "react-bootstrap";
const API_URL = process.env.REACT_APP_API_URL;
const LIMIT = 10;
function WithdrawalHistory() {
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState({
    status: "",
    account_holder_name: "",
    bank_name: "",
    account_number: "",
  });

  const navigate = useNavigate();

  const getAuthToken = () => localStorage.getItem("token");

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    console.warn(searchTerm.level);
    try {
      const token = getAuthToken();
      let formattedDate = "";
      if (searchTerm.date !== "") {
        formattedDate = formatDate(searchTerm.date);
      }
      const url = `${API_URL}/withdrawal-history?status=${searchTerm.status}&name=${searchTerm.account_holder_name}&bank=${searchTerm.bank_name}&account_number=${searchTerm.account_number}&page=${page}&limit=${LIMIT}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      const fetchedUsers = result.data || [];
      setAllUsers(fetchedUsers);
      setUsers(fetchedUsers);
      setTotalPages(result.totalPages || 1);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const handleSearch = (e) => {
    fetchUsers();
  };


  const toSentenceCase = (text) => {
    if (!text) return "-";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  // const handleCreateClick = () => {
  //   navigate("/create-account");
  // };
  const [showFilter, setShowFilter] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1200);

  const toggleFilter = () => {
    setShowFilter((prev) => !prev);
  };

  useEffect(() => {
    // Function to check screen width
    const handleResize = () => {
      if (window.innerWidth >= 1200) {
        setIsDesktop(true);
        setShowFilter(true); // always show filter in desktop
      } else {
        setIsDesktop(false);
        setShowFilter(false); // hide filter in mobile initially
      }
    };

    // Run on mount
    handleResize();

    // Listen to resize
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div className="padding_15">
      <div className="card">
        <div className="card-header">
          <div className="d-flex align-items-center justify-content-between gap-2">
            <div className="titlepage">
              <h3>Withdrawal History</h3>
            </div>

            {!isDesktop && (
              <div className="d-md-block d-lg-block d-xl-none d-block d-sm-block">
                <button
                  type="button"
                  className="toggle-filter-btn"
                  onClick={toggleFilter}
                >
                  {showFilter ? <MdFilterAltOff /> : <MdFilterListAlt />}
                </button>
              </div>
            )}


            <div className="d-lg-none d-xl-block d-none">
              <div className="d-flex gap-2">
                {/* <div className="form_design">
                <input
                  type="text"
                  name="account_holder_name"
                  placeholder="Account Holder Name"
                  value={searchTerm.account_holder_name}
                  onChange={(e) =>
                    setSearchTerm({
                      ...searchTerm,
                      [e.target.name]: e.target.value,
                    })
                  }
                />
              </div> */}

                {/* <div className="form_design">
                <input
                  type="text"
                  name="bank_name"
                  placeholder="Bank Name"
                  value={searchTerm.bank_name}
                  onChange={(e) =>
                    setSearchTerm({
                      ...searchTerm,
                      [e.target.name]: e.target.value,
                    })
                  }
                />
              </div> */}

                {/* <div className="form_design">
                <input
                  type="text"
                  name="account_number"
                  placeholder="Account Number"
                  value={searchTerm.account_number}
                  onChange={(e) =>
                    setSearchTerm({
                      ...searchTerm,
                      [e.target.name]: e.target.value,
                    })
                  }
                />
              </div> */}
                <div className="form_design">
                  <select
                    name="status"
                    value={searchTerm.status}
                    onChange={(e) =>
                      setSearchTerm({
                        ...searchTerm,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="success">Success</option>
                    <option value="reject">Reject</option>
                  </select>
                </div>
                <div className="form_design">
                  <button
                    type="button"
                    className="submit_button"
                    onClick={handleSearch}
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body">
          {showFilter && (
            <div className="d-lg-block d-xl-none">
              <div className="d-flex gap-2">
                {/* <div className="form_design">
                <input
                  type="text"
                  name="account_holder_name"
                  placeholder="Account Holder Name"
                  value={searchTerm.account_holder_name}
                  onChange={(e) =>
                    setSearchTerm({
                      ...searchTerm,
                      [e.target.name]: e.target.value,
                    })
                  }
                />
              </div> */}

                {/* <div className="form_design">
                <input
                  type="text"
                  name="bank_name"
                  placeholder="Bank Name"
                  value={searchTerm.bank_name}
                  onChange={(e) =>
                    setSearchTerm({
                      ...searchTerm,
                      [e.target.name]: e.target.value,
                    })
                  }
                />
              </div> */}

                {/* <div className="form_design">
                <input
                  type="text"
                  name="account_number"
                  placeholder="Account Number"
                  value={searchTerm.account_number}
                  onChange={(e) =>
                    setSearchTerm({
                      ...searchTerm,
                      [e.target.name]: e.target.value,
                    })
                  }
                />
              </div> */}
                <div className="form_design w-100">
                  <select
                    name="status"
                    value={searchTerm.status}
                    onChange={(e) =>
                      setSearchTerm({
                        ...searchTerm,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="success">Success</option>
                    <option value="reject">Reject</option>
                  </select>
                </div>
                <div className="form_design w-100">
                  <button
                    type="button"
                    className="submit_button"
                    onClick={handleSearch}
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          )
          }
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
              <p className="mt-3">Loading my bank history...</p>
            </div>
          ) : users.length === 0 ? (
            <p className="text-center text-danger fw-bold">No data found!</p>
          ) : (
            <>
              <div className="table-responsive">
                <Table bordered>
                  <thead className="table-dark">
                    <tr>
                      <th>#</th>
                      <th>Request Date</th>
                      <th>Withdraw ID</th>
                      <th>A/C Holder Name</th>
                      <th>Bank Name</th>
                      <th>Branch Name</th>
                      <th>Account Number</th>
                      <th>IFSC Code</th>
                      {/* <th>Request Amount</th>
                      <th>Advance Amount</th>
                      <th>Gross Payment</th>
                      <th>TDS Deduction</th>
                      <th>Net Amount</th> */}
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
                    {users.map((user, index) => (
                      <tr key={user.id}>
                        <td>{(currentPage - 1) * LIMIT + index + 1}</td>
                        <td>
                          {user.created_at
                            ? (() => {
                              const d = new Date(user.created_at);
                              const day = String(d.getDate()).padStart(2, "0");
                              const month = String(d.getMonth() + 1).padStart(2, "0");
                              const year = d.getFullYear();
                              return `${day}-${month}-${year}`;
                            })()
                            : "-"}
                        </td>



                        <td>{user.withdraw_id}</td>
                        <td>{toSentenceCase(user.account_holder_name)}</td>


                        <td>{user.bank_name || "NA"}</td>
                        <td>{user.bank_branch_name || "NA"}</td>
                        <td>{user.account_number || "NA"}</td>
                        <td>{user.ifsc_code ? user.ifsc_code.toUpperCase() : "NA"}</td>
                        {/* <td>
                          <strong>
                            ₹ {user.amount ? Number(user.amount).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}
                          </strong>
                        </td>
                        <td>₹ {user.advance_payment || "0.00"}</td>

                         <td>₹ {user.amount - user.advance_payment || "0.00"}</td>


                        <td style={{ color: "red" }}>
                          ₹ {user.tds ? Number(user.tds).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}
                        </td>

                        <td style={{ color: "green" }}>
                          ₹ {user.net_payment ? Number(user.net_payment).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}
                        </td> */}

                        <td>₹ {user.amount || "0.00"}</td>
                        <td>{user.tds_percent || "0.00"}</td>
                        <td>₹ {user.tds || "0.00"}</td>
                        <td>₹ {user.amount_after_tds || "0.00"}</td>

                        <td>₹ {user.advance_payment || "0.00"}</td>
                        <td>₹ {user.advance_payment_used || "0.00"}</td>
                        <td>₹ {user.advance_payment - user.advance_payment_used || "0.00"}</td>
                        <td>₹ {user.net_payment || "0.00"}</td>

                     <td>{user.remark || "NA"}</td>
                        <td>
                          {user.status === "pending" ? (
                            <span className="badge bg-warning text-white">
                              Pending
                            </span>
                          ) : user.status === "success" ? (
                            <span className="badge bg-success">Success</span>
                          ) : user.status === "reject" ? (
                            <span className="badge bg-danger">Rejected</span>
                          ) : (
                            toSentenceCase(user.status)
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              <div className="d-flex justify-content-end">
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

                  {currentPage > 3 && <Pagination.Ellipsis />}
                  {currentPage > 2 && (
                    <Pagination.Item
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      {currentPage - 1}
                    </Pagination.Item>
                  )}
                  {currentPage !== 1 && currentPage !== totalPages && (
                    <Pagination.Item active>{currentPage}</Pagination.Item>
                  )}
                  {currentPage < totalPages - 1 && (
                    <Pagination.Item
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      {currentPage + 1}
                    </Pagination.Item>
                  )}
                  {currentPage < totalPages - 2 && <Pagination.Ellipsis />}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default WithdrawalHistory;