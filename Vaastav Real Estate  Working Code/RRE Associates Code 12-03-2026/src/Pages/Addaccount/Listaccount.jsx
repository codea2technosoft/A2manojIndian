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
const imagesURL = `${process.env.REACT_APP_IMAGE_API_URL}/uploads/loanlead`;
const LIMIT = 10;
function Addaccount() {
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [loadingResponce, setLoadingResponce] = useState(false);
  const [leadId, setLeadId] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [showResponceModal, setShowResponceModal] = useState(false);
  const [documentFile, setDocumentFile] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);

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
      const url = `${API_URL}/bank-accounts-list?status=${searchTerm.status}&name=${searchTerm.account_holder_name}&bank=${searchTerm.bank_name}&account_number=${searchTerm.account_number}&page=${page}&limit=${LIMIT}`;

      const response = await fetch(url, {
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
  const handleCreateClick = () => {
    navigate("/create-account");
  };
  const [showFilter, setShowFilter] = useState(false);

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };
  return (
    <div className="padding_15">
      <div className="card">
        <div className="card-header">
          <div className="d-flex align-items-center justify-content-between gap-2">
            <div className="titlepage">
              <h3>Accounts Lists</h3>
            </div>

            <div className="d-flex align-items-center gap-2">
              {/* <div className="form_design">
                <input
                  type="text"
                  name="account_holder_name"
                  placeholder="Name"
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
              <div className="d-md-none d-block d-sm-block">
                 <button
                  type="button"
                  className="toggle-filter-btn"
                  onClick={toggleFilter}
                >
                  {showFilter ? <MdFilterAltOff/> : <MdFilterListAlt/>}
                </button>
              </div>
              <div className="d-md-block d-none d-sm-none">
               


               <div className="d-flex gap-2">
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

              <button
                onClick={handleCreateClick}
                className="btn btn-success d-inline-flex align-items-center"
              >
                <FaPlus className="me-2" /> Add Account
              </button>
            </div>
          </div>
          <div className="mobile-filter">
            {/* Toggle Button */}

            {/* Filter Options */}
            {showFilter && (
              <div className="gap-2 filter-options">
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
            )}
          </div>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
              <p className="mt-3">Loading my properties leads...</p>
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
                      <th>Account Holder Name</th>
                      <th>Bank Name</th>
                      <th>Branch Name</th>
                      <th>Account Number</th>
                      <th>IFSC Code</th>
                      <th>PassBook / Cheque</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr key={user.id}>
                        <td>{(currentPage - 1) * LIMIT + index + 1}</td>
                        <td>{toSentenceCase(user.account_holder_name)}</td>

                        <td>{toSentenceCase(user.bank_name)}</td>
                        <td>{toSentenceCase(user.bank_branch_name)}</td>
                        <td>{toSentenceCase(user.account_number)}</td>
                        <td>{user.ifsc_code.toUpperCase()}</td>


                        <td>
                          {/* {user.image &&
                            user.image.split(",").map((imgName, index) => (
                              <div
                                key={index}
                                className="position-relative me-2 mb-2"
                                style={{ width: "80px", height: "80px" }}
                              >
                                <img
                                  src={`${imagesURL}/${imgName}`}
                                  alt={imgName}
                                  className="img-thumbnail"
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                                <a
                                  href={`${imagesURL}/${imgName}`}
                                  download
                                  target="_blank"
                                  className="btn btn-sm btn-primary position-absolute"
                                  style={{
                                    top: 0,
                                    right: 0,
                                    borderRadius: "50%",
                                    padding: "0 5px",
                                  }}
                                >
                                  ⬇
                                </a>
                                <small
                                  className="d-block text-truncate"
                                  style={{ maxWidth: "80px" }}
                                >
                                  {imgName}
                                </small>
                              </div>
                            ))} */}
                            <div className="d-flex">
                              
                          {user.image &&
                            user.image.split(",").map((imgName, index) => {
                              const trimmedImg = imgName.trim().toLowerCase();
                              const isPDF = trimmedImg.endsWith(".pdf");

                              return (
                                <div className="position-relative">
                                <div key={index} className="position-relative  listaccountdesign">
                                  {isPDF ? (
                                    <div
                                      className="pdf-placeholder d-flex align-items-center justify-content-center bg-secondary text-white"
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                        fontSize: "14px",
                                      }}
                                    >
                                      PDF
                                    </div>
                                  ) : (
                                    <img
                                      src={`${imagesURL}/${trimmedImg}`}
                                      alt={trimmedImg}
                                      className="img-thumbnail"
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                      }}
                                    />
                                  )}                             
                                  <small
                                    className="d-block text-truncate-custum"
                                
                                  >
                                    {imgName}
                                  </small>
                                </div>
                                 <a
                                    href={`${imagesURL}/${trimmedImg}`}
                                    download
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-sm btn-primary position-absolute"
                                    style={{
                                      top: 0,
                                      right: 0,
                                      borderRadius: "50%",
                                      padding: "0 5px",
                                    }}
                                  >
                                    ⬇
                                  </a>
                                  </div>
                              );
                            })
                          }
                          
                            </div>
                          </td>

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

export default Addaccount;
