import React, { useEffect, useState } from "react";
import { Table, Spinner, Badge, Modal, Pagination } from "react-bootstrap";
import DummyUser from "../../assets/images/dummy_profile.png";
import { MdFilterListAlt } from "react-icons/md";
import { MdFilterAltOff } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

const API_URL = process.env.REACT_APP_API_URL;
const LIMIT = 10;

function Levelwiselead() {
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState({
    level: "",
    mobile: "",
    parentId: "",
    date: "",
    user_type: "",
  });
  const getLevelFromURL = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("level") || "";
  };
  useEffect(() => {
    const levelFromURL = getLevelFromURL();
    if (levelFromURL) {
      setSearchTerm((prev) => ({
        ...prev,
        level: levelFromURL,
      }));
    }
  }, []);

  const handleChange = (e) => {
    setSearchTerm((prev) => ({
      ...prev,
      user_type: e.target.value,
    }));
  };

  const getAuthToken = () => localStorage.getItem("token");

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    console.warn("Search Term Level:", searchTerm.level);
    try {
      const token = getAuthToken();
      let formattedDate = "";
      if (searchTerm.date !== "") {
        formattedDate = formatDate(searchTerm.date);
      }
      const url = `${API_URL}/myteam-list-lavel11?level=${searchTerm.level}&parent_id=${searchTerm.parentId}&mobile=${searchTerm.mobile}&date=${formattedDate}&user_type=${searchTerm.user_type}&page=${page}&limit=${LIMIT}`;

      console.log("API URL:", url);

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      console.log("API Response:", result);

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
    if (searchTerm.level !== "") {
      fetchUsers(1);
    }
  }, [searchTerm.level]);
  useEffect(() => {
    if (searchTerm.level !== "") {
      fetchUsers(currentPage);
    }
  }, [currentPage]);

  const handleSearch = (e) => {
    fetchUsers(1);
  };

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

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const [showFilter, setShowFilter] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1199);

  const toggleFilter = () => {
    setShowFilter((prev) => !prev);
  };


  const levelFromURL = getLevelFromURL();
  const pageTitle = levelFromURL
    ? `Level ${levelFromURL} Lead Details`
    : "Level Wise Lead Details";

  return (
    <div className="padding_15">
      <div className="card">
        <div className="card-header">
          <div className="d-flex flex-wrap-mobile align-items-md-center justify-content-between">
            <div className="titlepage">
              <h3>{pageTitle}</h3>
              {levelFromURL && <Badge bg="info">Level {levelFromURL}</Badge>}
            </div>

            <div className="d-flex gap-2 align-items-center">
              <button
                type="button"
                className="toggle-filter-btn btn btn-primary"
                onClick={toggleFilter}
              >
                {showFilter ? <MdFilterAltOff /> : <MdFilterListAlt />}
              </button>
              <button
                type="button"
                className="submit_button"
                onClick={() => navigate("/levelwise")}
              >
                <IoMdArrowRoundBack /> Back
              </button>
            </div>
          </div>
        </div>

        {showFilter && (
          <div className="card-body pb-0">
            <div className="d-flex flex-wrap-mobile align-items-md-center fillter_input gap-2">
              {/* <div className="form_design">
                                    <input
                                        type="number"
                                        name="level"
                                        placeholder="Level"
                                        value={searchTerm.level}
                                        onChange={(e) =>
                                            setSearchTerm({
                                                ...searchTerm,
                                                [e.target.name]: e.target.value,
                                            })
                                        }
                                    />
                                </div> */}
              <div className="form_design w-100">
                <input
                  type="number"
                  name="mobile"
                  placeholder="Mobile number"
                  value={searchTerm.mobile}
                  onChange={(e) =>
                    setSearchTerm({
                      ...searchTerm,
                      [e.target.name]: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form_design w-100">
                <input
                  type="number"
                  name="parentId"
                  placeholder="Parent Id"
                  value={searchTerm.parentId}
                  onChange={(e) =>
                    setSearchTerm({
                      ...searchTerm,
                      [e.target.name]: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form_design w-100">
                <select
                  name="user_type"
                  value={searchTerm.user_type}
                  className="text-black"
                  onChange={(e) => {
                    handleChange(e);
                    fetchUsers(1);
                  }}
                >
                  <option value="">All Users</option>
                  <option value="channel">Channel</option>
                  <option value="associate">Associate</option>
                </select>
              </div>
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

        <div className="card-body">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
              <p className="mt-3">
                Loading {levelFromURL ? `Level ${levelFromURL}` : "Level"}{" "}
                Leads...
              </p>
            </div>
          ) : users.length === 0 ? (
            <p className="text-center text-danger fw-bold">
              {searchTerm.level
                ? `No data found for Level ${searchTerm.level}`
                : "No data found!"}
            </p>
          ) : (
            <>
              <div className="table-responsive">
                <Table bordered>
                  <thead className="table-dark">
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Mobile</th>
                      {/* <th>Level</th> */}
                      <th>Parent Name</th>
                      <th>Parent ID</th>
                      <th>Type</th>
                      <th>KYC Status</th>
                      <th>Joining Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr key={user.id}>
                        <td>{(currentPage - 1) * LIMIT + index + 1}</td>
                        <td>{toSentenceCase(user.username)}</td>
                        <td>{user.mobile}</td>
                        {/* <td>{user.level}</td> */}
                        <td>{toSentenceCase(user.parent_name)}</td>
                        <td>{toSentenceCase(user.parent_id)}</td>
                        <td>{toSentenceCase(user.user_type)}</td>
                        <td>
                          <span
                            className={`badge ${
                              user.kyc?.toLowerCase() === "success"
                                ? "backgroundgreen"
                                : user.kyc?.toLowerCase() === "pending"
                                  ? "bg-warning"
                                  : user.kyc?.toLowerCase() === "reject"
                                    ? "bg-danger"
                                    : "backgroundgreen"
                            }`}
                          >
                            {toSentenceCase(user.kyc)}
                          </span>
                        </td>
                        <td>{user.date}</td>
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

      {/* Modal */}
      {selectedUser && (
        <Modal
          show={showModal}
          size="lg"
          className="modalcontent"
          onHide={handleCloseModal}
          centered
        >
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
                      : { DummyUser }
                  }
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = { DummyUser };
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
                      <input
                        type="text"
                        value={toSentenceCase(selectedUser.username)}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="col-md-6 col-12 col-lg-4">
                    <div className="form-group form_modal">
                      <label htmlFor="">Mobile</label>
                      <input type="text" value={selectedUser.mobile} disabled />
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

export default Levelwiselead;
