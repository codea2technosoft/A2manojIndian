import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { MdFilterListAlt } from "react-icons/md";
import { MdFilterAltOff } from "react-icons/md";
import DummyUser from "../../assets/images/dummy_profile.png"

import Swal from "sweetalert2";
import {
  Modal,
  Button,
  Form,
  Table,
  Pagination,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { FaEye, FaEdit } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
const API_URL = process.env.REACT_APP_API_URL;
function ChannelList() {
  const [associates, setAssociates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [parentId, setParentId] = useState("");
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageModalContent, setMessageModalContent] = useState({
    title: "",
    text: "",
    type: "",
    confirmAction: null,
  });
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAssociate, setSelectedAssociate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [kycStatus, setKYCStatus] = useState("");
  const navigate = useNavigate();

  const showCustomMessageModal = (title, text, type, confirmAction = null) => {
    setMessageModalContent({ title, text, type, confirmAction });
    setShowMessageModal(true);
  };

  const closeCustomMessageModal = () => {
    setShowMessageModal(false);
    setMessageModalContent({
      title: "",
      text: "",
      type: "",
      confirmAction: null,
    });
  };

  const [showFilter, setShowFilter] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1199);

  const toggleFilter = () => {
    setShowFilter((prev) => !prev);
  };

  useEffect(() => {
    // Function to check screen width
    const handleResize = () => {
      if (window.innerWidth >= 1199) {
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
  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  };

  const fetchAssociates = async (page = 1, parent = parentId) => {
    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) {
        showCustomMessageModal(
          "Authentication Error",
          "Authentication token not found. Please log in.",
          "error"
        );
        throw new Error("Authentication token not found. Please log in.");
      }

      const response = await fetch(
        `${API_URL}/my-channel-user?page=${page}&limit=10&parent_id=${parent}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        showCustomMessageModal(
          "Error",
          errorData.message || "Failed to fetch Channel.",
          "error"
        );
        throw new Error(errorData.message || "Failed to fetch Channel.");
      }
      const data = await response.json();
      setAssociates(data.data || []);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(page);
    } catch (err) {
      console.error("Fetch Channel error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (associate) => {
    setSelectedAssociate(associate);
    setShowViewModal(true);
  };
  const toSentenceCase = (str) => {
    str = String(str || "");
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  useEffect(() => {
    const fetchProfileAndChannels = async () => {
      try {
        const token = getAuthToken();
        if (!token) return;

        const response = await fetch(`${API_URL}/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok && data.status === "1") {
          const mobile = data.data.mobile || data.data.phone || "";
          const KYC = data.data.kyc || "";

          setParentId(mobile);
          setKYCStatus(KYC); // ✅ Set KYC status
          fetchAssociates(1, mobile);
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
      }
    };

    fetchProfileAndChannels();
  }, []);

  useEffect(() => {
    if (parentId) {
      fetchAssociates(currentPage, parentId);
    }
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // const filteredAssociates = associates.filter((associate) => {
  //   const search = searchTerm.toLowerCase();
  //   return (
  //     associate.username?.toLowerCase().includes(search) ||
  //     associate.mobile?.toLowerCase().includes(search)
  //   );
  // });

  const filteredAssociates = associates.filter((associate) => {
    const search = searchTerm.toLowerCase();
    const statusMatch =
      statusFilter === "" || associate.status === statusFilter;
    const searchMatch =
      associate.username?.toLowerCase().includes(search) ||
      associate.mobile?.toLowerCase().includes(search);
    return statusMatch && searchMatch;
  });

  // const handleCreateClick = () => {
  //   if (kycStatus.toLowerCase() === "success") {
  //     navigate("/create-channel");
  //   } else {
  //     Swal.fire({
  //       icon: "warning",
  //       title: "KYC Incomplete",
  //       text: "Please complete your KYC and then try to create Channel Partner.",
  //       confirmButtonText: "OK",
  //     });
  //   }
  // };

  const handleCreateClick = () => {
    navigate("/create-channel");

  };


  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="padding_15">
      <div className="card">
        <div className="card-header">
          <div className="d-flex align-items-center justify-content-between">
            <div className="titlepage">
              <h3>All Channel Partner List</h3>
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

            <div className="d-md-none d-lg-none d-xl-block d-none d-sm-none">
              <div className="d-flex gap-2">
                <div className="form_design">
                  <input
                    type="text"
                    placeholder="Name OR Mobile"
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
                <button
                  onClick={handleCreateClick}
                  className="btn btn-success d-inline-flex align-items-center"
                >
                  <FaPlus className="me-2" /> Create Channel Partner
                </button>
              </div>
            </div>


          </div>
        </div>
        <div className="card-body">
          {showFilter && (
            <div className=" d-lg-block d-xl-none">
              <div className="d-flex fillter_input gap-2">
                <div className="form_design">
                  <input
                    type="text"
                    placeholder="Name OR Mobile"
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
                <button
                  onClick={handleCreateClick}
                  className="btn btn-success d-inline-flex align-items-center"
                >
                  <FaPlus className="me-2" /> Create Channel Partner
                </button>
              </div>
            </div>
          )}
          <div className="table-responsive">
            <Table bordered>
              <thead className="text-white">
                <tr>
                  <th>Sr No.</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>KYC</th>
                  <th>Parent Name</th>
                  <th>Parent ID</th>

                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssociates.length > 0 ? (
                  filteredAssociates.map((associate, index) => (
                    <tr key={associate.id}>
                      <td>{(currentPage - 1) * 10 + index + 1}</td>{" "}
                      <td>{toSentenceCase(associate.username)}</td>
                      <td>{associate.email}</td>
                      <td>{associate.mobile}</td>
                      {/* <td>{toSentenceCase(associate.kyc)}</td> */}
                      <td>
                        <span
                          className={`badge ${associate.user_type?.toLowerCase() === "channel"
                            ? associate.kyc?.toLowerCase() === "success"
                              ? "bg-custum"
                              : associate.kyc?.toLowerCase() === "pending"
                                ? "bg-warning text-white"
                                : "bg-danger"
                            : associate.kyc?.toLowerCase() === "success"
                              ? "bg-custum"
                              : associate.kyc?.toLowerCase() === "pending"
                                ? "bg-warning text-white"
                                : "bg-danger"
                            }`}
                        >
                          {associate.user_type?.toLowerCase() === "channel"
                            ? associate.kyc?.toLowerCase() === "success"
                              ? "Complete"
                              : associate.kyc?.toLowerCase() === "pending"
                                ? "Pending"
                                : toSentenceCase(associate.kyc)
                            : toSentenceCase(associate.kyc)}
                        </span>
                      </td>
                      <td>{toSentenceCase(associate.parent_name)}</td>
                      <td>{toSentenceCase(associate.parent_id)}</td>

                      <td>
                        <span
                          className={`badge ${associate.status === "active"
                            ? "bg-custum"
                            : "bg-danger"
                            }`}
                        >
                          {associate.status}
                        </span>
                      </td>
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
                                onClick={() => handleView(associate)}
                              >
                                <FaEye /> View
                              </button>
                            </li>
                          </ul>
                        </div>
                        {/* <Button
                      variant="info"
                      size="sm"
                      onClick={() => handleView(associate)}
                      className="me-2"
                    >
                      View
                    </Button> */}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No Channel found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          <div className="d-flex justify-content-end">
            <Pagination>
              {/* <Pagination.First
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          /> */}
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
              {/* <Pagination.Last
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          /> */}
            </Pagination>
          </div>
        </div>
      </div>

      {showViewModal && selectedAssociate && (
        <Modal
          size="lg"
          className="modalcontent"
          show
          onHide={() => setShowViewModal(false)}
          centered
        >
          <div className="d-flex justify-content-between header_modal_design">
            <h3>
              Channel Partner Details (
              {toSentenceCase(selectedAssociate.username)})
            </h3>
            <Modal.Header closeButton>
              <Modal.Title></Modal.Title>
            </Modal.Header>
          </div>

          <Modal.Body className="">
            <div className="associatedetails">
              {selectedAssociate?.profile ? (
                <div className="profileimage">
                  <img
                    src={
                      selectedAssociate.profile?.trim() !== ""
                        ? `${process.env.REACT_APP_API_URL}/${selectedAssociate.profile}`
                        : {DummyUser}
                    }
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = {DummyUser};
                    }}
                    alt="Profile"
                    className="rounded-circle"
                  />
                </div>
              ) : (
                <div className="profileimage">
                  <img
                    src={DummyUser}
                    alt="Dummy Profile"
                    className="rounded-circle"
                  />
                </div>
              )}

              <div className="row">
                <div className="col-md-6 col-12 col-lg-4">
                  <div className="form-group form_modal">
                    <label htmlFor="">Username</label>
                    <input
                      type="text"
                      value={toSentenceCase(selectedAssociate.username)}
                      disabled
                    />
                  </div>
                </div>
                <div className="col-md-6 col-12 col-lg-4">
                  <div className="form-group form_modal">
                    <label htmlFor="">Email</label>
                    <input
                      type="text"
                      value={selectedAssociate.email}
                      disabled
                    />
                  </div>
                </div>
                <div className="col-md-6 col-12 col-lg-4">
                  <div className="form-group form_modal">
                    <label htmlFor="">Mobile</label>
                    <input
                      type="text"
                      value={selectedAssociate.mobile}
                      disabled
                    />
                  </div>
                </div>
                <div className="col-md-6 col-12 col-lg-4">
                  <div className="form-group form_modal">
                    <label htmlFor="">Parent name</label>
                    <input
                      type="text"
                      value={selectedAssociate.parent_name}
                      disabled
                    />
                  </div>
                </div>
                <div className="col-md-6 col-12 col-lg-4">
                  <div className="form-group form_modal">
                    <label htmlFor="">Parent ID</label>
                    <input
                      type="text"
                      value={selectedAssociate.parent_id}
                      disabled
                    />
                  </div>
                </div>
                <div className="col-md-6 col-12 col-lg-4">
                  <div className="form-group form_modal">
                    <label htmlFor="">State</label>
                    <input
                      type="text"
                      value={toSentenceCase(selectedAssociate.state.name)}
                      disabled
                    />
                  </div>
                </div>
                <div className="col-md-6 col-12 col-lg-4">
                  <div className="form-group form_modal">
                    <label htmlFor="">City</label>
                    <input
                      type="text"
                      value={toSentenceCase(selectedAssociate.city.name)}
                      disabled
                    />
                  </div>
                </div>
                <div className="col-md-6 col-12 col-lg-4">
                  <div className="form-group form_modal">
                    <label htmlFor="">Area</label>
                    <input
                      type="text"
                      value={toSentenceCase(selectedAssociate.area)}
                      disabled
                    />
                  </div>
                </div>
                <div className="col-md-6 col-12 col-lg-4">
                  <div className="form-group form_modal">
                    <label htmlFor="">Pincode</label>
                    <input
                      type="text"
                      value={selectedAssociate.pincode}
                      disabled
                    />
                  </div>
                </div>
                <div className="col-md-6 col-12 col-lg-4">
                  <div className="form-group form_modal">
                    <label htmlFor="">Whatsapp Number</label>
                    <input
                      type="text"
                      value={selectedAssociate.whatsapp_number}
                      disabled
                    />
                  </div>
                </div>
                <div className="col-md-6 col-12 col-lg-4">
                  <div className="form-group form_modal">
                    <label htmlFor="">DOB</label>
                    <input
                      type="text"
                      value={formatDate(selectedAssociate.dob)}
                      disabled
                    />
                  </div>
                </div>
                <div className="col-md-6 col-12 col-lg-4">
                  <div className="form-group form_modal">
                    <label htmlFor="">Marriage Anniversary Date</label>
                    <input
                      type="text"
                      value={formatDate(
                        selectedAssociate.marriage_anniversary_date
                      )}
                      disabled
                    />
                  </div>
                </div>

                {/* <p>
              <strong>User Type : </strong>{" "}
              {toSentenceCase(selectedAssociate.user_type)}
            </p>
            <p>
              <strong>Password : </strong> {selectedAssociate.password}
            </p> */}

                <div className="col-md-6 col-12 col-lg-4">
                  <div className="form-group form_modal">
                    <label htmlFor="">Status</label>
                    <input
                      type="text"
                      value={toSentenceCase(selectedAssociate.status)}
                      disabled
                    />
                  </div>
                </div>

                <div className="col-md-6 col-12 col-lg-4">
                  <div className="form-group form_modal">
                    <label htmlFor="">Whatsapp Number</label>
                    <input
                      type="text"
                      value={selectedAssociate.whatsapp_number}
                      disabled
                    />
                  </div>
                </div>
                <div className="col-md-6 col-12 col-lg-4">
                  <div className="form-group form_modal">
                    <label htmlFor="">Pan Number</label>
                    <input
                      type="text"
                      value={selectedAssociate.pan_number}
                      disabled
                    />
                  </div>
                </div>

                <div className="col-md-6 col-12 col-lg-4">
                  <div className="form-group form_modal">
                    <label htmlFor="">Rera Number</label>
                    <input
                      type="text"
                      value={selectedAssociate.rera_number}
                      disabled
                    />
                  </div>
                </div>
                <div className="col-md-6 col-12 col-lg-4">
                  <div className="form-group form_modal">
                    <label htmlFor="">Date</label>
                    <input
                      type="text"
                      value={selectedAssociate.date}
                      disabled
                    />
                  </div>
                </div>

                <div className="col-md-6 col-12 col-lg-4">
                  <div className="form-group form_modal">
                    <label htmlFor="">Date & Timing</label>
                    <input
                      type="text"
                      value={selectedAssociate.date_time}
                      disabled
                    />
                  </div>
                </div>
                <div className="col-md-6 col-12 col-lg-4">
                  <div className="form-group form_modal">
                    <label htmlFor="">KYC</label>
                    <input
                      type="text"
                      value={toSentenceCase(selectedAssociate.kyc)}
                      disabled
                    />
                  </div>
                </div>
                {/* <div className="col-md-6 col-12 col-lg-4">
                  <div className="form-group form_modal">
                    <label htmlFor="">First Time Password Change</label>
                    <input
                      type="text"
                      value={
                        selectedAssociate.first_time_password_change
                          ? selectedAssociate.first_time_password_change
                              .charAt(0)
                              .toUpperCase() +
                            selectedAssociate.first_time_password_change
                              .slice(1)
                              .toLowerCase()
                          : ""
                      }
                      disabled
                    />
                  </div>
                </div> */}
                <div className="col-md-6 col-12 col-lg-4">
                  <div className="form-group form_modal">
                    <label htmlFor="">Aadhar Number</label>
                    <input
                      type="text"
                      value={
                        selectedAssociate.adhar_number
                          ? selectedAssociate.adhar_number
                          : "NA"
                      }
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div className="cancelbutton">
              <Button onClick={() => setShowViewModal(false)}>Close</Button>
            </div>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default ChannelList;
