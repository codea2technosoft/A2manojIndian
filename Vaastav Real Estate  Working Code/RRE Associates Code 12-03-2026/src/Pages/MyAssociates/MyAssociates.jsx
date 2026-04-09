import React, { useEffect, useState } from "react";
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
import { MdFilterListAlt } from "react-icons/md";
import { MdFilterAltOff } from "react-icons/md";
import {
  MdAirplanemodeInactive,
  MdAirplanemodeActive,
  MdOutlineUpcoming,
  MdUpcoming,
} from "react-icons/md";

const API_URL = process.env.REACT_APP_API_URL;
const LIMIT = 10;

function MyAssociates() {
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");

  const getAuthToken = () => localStorage.getItem("token");

  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1200);
  
const [showFilter, setShowFilter] = useState(false); // default hidden

const toggleFilter = () => {
setShowFilter(prev => !prev);
};

  useEffect(() => {
    // Function to check screen width
    const handleResize = () => {
      if (window.innerWidth >= 1200) {
        setIsDesktop(false);
        setShowFilter(false); // always show filter in desktop
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

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const url = `${API_URL}/my-child-user?page=${page}&limit=${LIMIT}`;

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

  // const handleSearchChange = (e) => {
  //   const value = e.target.value.toLowerCase();
  //   setSearchTerm(value);
  //   const filtered = allUsers.filter(
  //     (user) =>
  //       user.username?.toLowerCase().includes(value) ||
  //       user.mobile?.includes(value)
  //   );
  //   setUsers(filtered);
  // };

  const filteredAssociates = users.filter((user) => {
    const search = searchTerm.toLowerCase();
    const statusMatch = statusFilter === "" || user.status === statusFilter;
    const searchMatch =
      user.username?.toLowerCase().includes(search) ||
      user.mobile?.toLowerCase().includes(search);
    return statusMatch && searchMatch;
  });

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setShowModal(false);
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

  return (
    <div className="padding_15">
      <div className="card">
        <div className="card-header">
          <div className="d-flex align-items-center justify-content-between">
            <div className="titlepage">
              <h3>My Associates</h3>
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
              <div className="d-flex  gap-2">
              <div className="form_design">
                <input
                  type="text"
                  placeholder="username or mobile"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="form_design">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            </div>
          </div>
        </div>
        <div className="card-body">
           {showFilter && (
              <div className="d-flex gap-2 mb-2">
              <div className="form_design w-100">
                <input
                  type="text"
                  placeholder="username or mobile"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="form_design w-100">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div> 
            )
          }
          {/* <Form.Group controlId="search" className="mb-4">
        <Form.Control
          type="text"
          placeholder="Search by username or mobile..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </Form.Group> */}

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
              <p className="mt-3">Loading my Associates...</p>
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
                      <th>Name</th>
                      <th>Mobile</th>
                      <th>Type</th>
                      <th>KYC Status</th>
                      <th>Parent Name</th>
                      <th>Parent ID</th>
                      <th>Status</th>
                      <th>Joining Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAssociates.map((user, index) => (
                      <tr key={user.id}>
                        <td>{(currentPage - 1) * LIMIT + index + 1}</td>
                        <td>{toSentenceCase(user.username)}</td>
                        <td>{user.mobile}</td>
                        <td>{toSentenceCase(user.user_type)}</td>
                        {/* <td>{toSentenceCase(user.kyc)}</td> */}
                        <td>
                          <span
                            className={`badge ${user.kyc?.toLowerCase() === "success"
                                ? "bg-success"
                                : user.kyc?.toLowerCase() === "pending"
                                  ? "bg-warning text-white"
                                  : "bg-custum"
                              }`}
                          >
                            {user.kyc?.toLowerCase() === "success"
                              ? "Complete"
                              : user.kyc?.toLowerCase() === "pending"
                                ? "Pending"
                                : toSentenceCase(user.kyc)}
                          </span>
                        </td>

                        <td>{user.parent_name}</td>
                        <td>{user.parent_id}</td>
                        <td>
                          <Badge
                            bg={
                              user.status === "active" ? "custum" : "danger"
                            }
                          >
                            {user.status}
                          </Badge>
                        </td>
                        <td>{user.date}</td>
                        <td>
                          <div className="dropdown">
                            <button
                              className="btn light btn-action dropdown-toggle"
                              type="button"
                              id="dropdownMenuButton"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              <BsThreeDots size={20} />
                            </button>
                            <ul
                              className="dropdown-menu"
                              aria-labelledby="dropdownMenuButton"
                            >
                              <li className="dropdown-item">
                                <button
                                  className="btn view_btn btn-sm"
                                  title="View Project Details"
                                  onClick={() => handleViewUser(user)}
                                >
                                  <FaEye /> View
                                </button>
                              </li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              <div className="d-flex justify-content-end gap-2 align-items-center">
                <button
                  className="button_pagination"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  <MdArrowBackIosNew />
                </button>

                <div className="d-flex gap-2 align-items-center">
                  <p className="pagination_all">{currentPage}</p>
                  {/* of
                <p className="pagination_all">
                  {totalPages}
                </p> */}
                </div>

                <button
                  className="button_pagination"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  <MdArrowForwardIos />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedUser && (
        <Modal show={showModal}  size="lg"  className="modalcontent" onHide={handleCloseModal} centered>
          <div className="d-flex justify-content-between header_modal_design">
            <h3>My Associates Details</h3>
            <Modal.Header closeButton>
              <Modal.Title></Modal.Title>
            </Modal.Header>
          </div>
          <Modal.Body className="text-center">
            <div className="associatedetails">
              <div className="profileimage">
                 <img
                src={
                  selectedUser.profile &&
                    selectedUser.profile !== "null" &&
                    selectedUser.profile !== ""
                    ? `${API_URL}/${selectedUser.profile}`
                    : "/assets/images/dummy_profile.png"
                }
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/assets/images/dummy_profile.png";
                }}
                alt="User Profile"
                className="rounded-circle mb-4"
              
              />
              </div>

              <div className="text-start">
                <div className="row">
                  <div className="col-md-6 col-12 col-lg-4">
                      <div className="form-group form_modal">
                        <label htmlFor="">Name</label>
                        <input type="text" value={toSentenceCase(selectedUser.username)} disabled />
                      </div>
                  </div>
                  <div className="col-md-6 col-12 col-lg-4">
                    <div className="form-group form_modal">
                        <label htmlFor="">Mobile</label>
                        <input type="text" value={selectedUser.mobile} disabled />
                      </div>
                  </div>
                  <div className="col-md-6 col-12 col-lg-4">
                    <div className="form-group form_modal">
                        <label htmlFor="">Email</label>
                        <input type="text" value={selectedUser.email || "-"} disabled />
                      </div>
                  </div>
                  <div className="col-md-6 col-12 col-lg-4">
                     <div className="form-group form_modal">
                        <label htmlFor="">Address</label>
                        <input type="text" value={toSentenceCase(selectedUser.address || "-")} disabled />
                      </div>
                    
                  </div>
                  <div className="col-md-6 col-12 col-lg-4">
                     <div className="form-group form_modal">
                        <label htmlFor="">Status</label>
                        <input type="text" value={toSentenceCase(selectedUser.status)} disabled />
                      </div>
                  </div>
                  <div className="col-md-6 col-12 col-lg-4">
                     <div className="form-group form_modal">
                        <label htmlFor="">DOB</label>
                        <input type="text" value={formatDate(selectedUser.dob)} disabled />
                      </div>
                  </div>
                  <div className="col-md-6 col-12 col-lg-4">
                    <div className="form-group form_modal">
                        <label htmlFor="">Aadhar</label>
                        <input type="text" value={selectedUser.adhar_number} disabled />
                      </div>
                  </div>
                  <div className="col-md-6 col-12 col-lg-4">
                    <div className="form-group form_modal">
                        <label htmlFor="">PAN</label>
                        <input type="text" value={selectedUser.pan_number} disabled />
                      </div>
                  </div>
                  <div className="col-md-6 col-12 col-lg-4">
                     <div className="form-group form_modal">
                        <label htmlFor="">KYC</label>
                        <input type="text" value={toSentenceCase(selectedUser.kyc)} disabled />
                      </div>
                  </div>
                  <div className="col-md-6 col-12 col-lg-4">
                    <div className="form-group form_modal">
                        <label htmlFor="">Parent Name</label>
                        <input type="text" value={selectedUser.parent_name} disabled />
                      </div>
                  </div>
                  <div className="col-md-6 col-12 col-lg-4">
                        <div className="form-group form_modal">
                        <label htmlFor="">Parent ID</label>
                        <input type="text" value={selectedUser.parent_id || "-"} disabled />
                      </div>
                  </div>
                  <div className="col-md-6 col-12 col-lg-4">
                       <div className="form-group form_modal">
                        <label htmlFor="">Register By</label>
                        <input type="text" value={selectedUser.register_by || "-"} disabled />
                      </div>
                   
                  </div>
                  <div className="col-md-6 col-12 col-lg-4">
                     <div className="form-group form_modal">
                        <label htmlFor="">User Type</label>
                        <input type="text" value= {toSentenceCase(selectedUser.user_type)} disabled />
                      </div>                   
                  </div>
                  <div className="col-md-6 col-12 col-lg-4">
                     <div className="form-group form_modal">
                        <label htmlFor="">City</label>
                        <input type="text" value={selectedUser.city.name} disabled />
                      </div> 
                  </div>
                  <div className="col-md-6 col-12 col-lg-4">
                     <div className="form-group form_modal">
                        <label htmlFor="">Area</label>
                        <input type="text" value={selectedUser.area} disabled />
                      </div> 
                  </div>
                  <div className="col-md-6 col-12 col-lg-4">
                    <div className="form-group form_modal">
                        <label htmlFor="">PinCode</label>
                        <input type="text" value= {selectedUser.pincode} disabled />
                      </div> 
                  </div>
                  <div className="col-md-6 col-12 col-lg-4">
                      <div className="form-group form_modal">
                        <label htmlFor="">Whatsapp No</label>
                        <input type="text" value={selectedUser.whatsapp_number} disabled />
                      </div>
                  </div>
                  <div className="col-md-6 col-12 col-lg-4">
                    <div className="form-group form_modal">
                        <label htmlFor="">Marriage Date</label>
                        <input type="text" value={formatDate(selectedUser.marriage_anniversary_date)} disabled />
                      </div>
                    
                  </div>
                  <div className="col-md-6 col-12 col-lg-4">
                      <div className="form-group form_modal">
                        <label htmlFor="">RERA Number</label>
                        <input type="text" value={selectedUser.rera_number || "-"} disabled />
                      </div>
                    
                  </div>
                   <div className="col-md-6 col-12 col-lg-4">
                   <div className="form-group form_modal">
                        <label htmlFor="">First Time Password Change</label>
                        <input type="text" value={selectedUser.first_time_password_change?.toUpperCase() || "-"} disabled />
                      </div>
                   
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
}

export default MyAssociates;
