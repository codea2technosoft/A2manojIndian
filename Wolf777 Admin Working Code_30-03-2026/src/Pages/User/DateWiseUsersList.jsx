import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { Button, Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { MdFilterListAlt } from "react-icons/md";
import {
  FaInfoCircle,
  FaLock,
  FaUnlock,
  FaStickyNote,
  FaTrashAlt,
  FaEdit,
  FaWallet,
  FaGamepad,
} from "react-icons/fa";
import {
  deleteUser,
  updateUserStatus,
  depositToUser,
  withdrawFromUser,
  blockUser,
  getDateWiseAllUsersList
} from "../../Server/api";
import { FaPlus, FaMinus, FaEye } from "react-icons/fa";

function DateWiseUsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");
  const [depositType, setDepositType] = useState("admin");

  const navigate = useNavigate();

  // Filters state - Updated to match backend params
  const [filters, setFilters] = useState({
    active: "",
    banned: "",        // Added banned filter
    userId: "",
    mobile: "",
    start_date: "",    // Changed from fromDate to start_date
    end_date: "",      // Changed from toDate to end_date
  });

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  });

  const fetchUsers = async (
    page = pagination.page,
    limit = pagination.limit
  ) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        active: filters.active,
        banned: filters.banned,     // Added banned param
        userId: filters.userId,
        mobile: filters.mobile,
        start_date: filters.start_date,  // Changed from fromDate
        end_date: filters.end_date,      // Changed from toDate
      };
      const response = await getDateWiseAllUsersList(params);
      if (response.data && response.data.success) {
        setUsers(response.data.data);
        setPagination((prev) => ({
          ...prev,
          page: response.data.pagination.page,
          total: response.data.pagination.totalRecords,
          totalPages: response.data.pagination.totalPages,
          limit: response.data.pagination.limit,
        }));
      } else if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        Swal.fire("Error", "Failed to fetch users", "error");
      }
    } catch (error) {
      console.error("API Error:", error);
      Swal.fire("Error", "Failed to fetch users", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    const confirmation = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmation.isConfirmed) {
      try {
        const result = await deleteUser(userId);
        if (result.data.success) {
          Swal.fire("Deleted!", "User has been deleted.", "success");
          fetchUsers(pagination.page);
        }
      } catch (error) {
        Swal.fire(
          "Error",
          error.response?.data?.message || "Failed to delete user",
          "error"
        );
      }
    }
  };

  const applyFilters = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchUsers(1, pagination.limit);
    setFilter(true);
  };

  const resetFilters = () => {
    setFilters({
      active: "",
      banned: "",        // Reset banned filter
      userId: "",
      mobile: "",
      start_date: "",    // Reset start_date
      end_date: "",      // Reset end_date
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchUsers(1, pagination.limit);
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    fetchUsers(newPage, pagination.limit);
  };

  const handleOpenModal = (type, user) => {
    setModalType(type);
    setSelectedUser(user);
    setAmount("");
    setRemarks("");
    setDepositType("admin");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleTransaction = async () => {
    if (!amount || amount <= 0) {
      Swal.fire("Error", "Please enter a valid amount", "error");
      return;
    }

    try {
      let response;
      if (modalType === "add") {
        response = await depositToUser(
          selectedUser._id,
          Number(amount),
          remarks,
          depositType
        );
      } else {
        response = await withdrawFromUser(
          selectedUser._id,
          Number(amount),
          remarks,
          depositType
        );
      }

      if (response.data.success) {
        Swal.fire({
          title: "Success!",
          html: `
        <p>${response.data.message}</p>
        <div class="mt-3">
          <p><strong>User:</strong> ${selectedUser?.username || selectedUser?.mobile
            }</p>
          <p><strong>Previous Balance:</strong> ₹ ${response.data.data.previousBalance || selectedUser?.credit || 0
            }</p>
          <p><strong>${modalType === "add" ? "Added" : "Withdrawn"
            }:</strong> ₹ ${amount}</p>
        </div>
        `,
          icon: "success",
        });
        fetchUsers(pagination.page);
        handleCloseModal();
      } else {
        Swal.fire(
          "Error",
          response.data.message || "Transaction failed",
          "error"
        );
      }
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Something went wrong",
        "error"
      );
    }
  };

  const handleBlockToggle = async (userId, isBlocked) => {
    const confirm = await Swal.fire({
      title: isBlocked ? "Unblock User?" : "Block User?",
      text: isBlocked
        ? "Do you really want to unblock this user?"
        : "Do you really want to block this user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: isBlocked ? "Yes, Unblock" : "Yes, Block",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      const response = await blockUser(userId);
      if (response.data.success) {
        Swal.fire(
          isBlocked ? "Unblocked!" : "Blocked!",
          response.data.message,
          "success"
        );
        fetchUsers(pagination.page);
      } else {
        Swal.fire(
          "Error",
          response.data.message || "Unable to update user block status",
          "error"
        );
      }
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Something went wrong",
        "error"
      );
    }
  };

  // Function to handle exposure click
  const handleExposureClick = (userId) => {
    navigate(`/user-bets-exposer-details/${userId}`, {
      state: { userId: userId }
    });
  };

  // Function to handle exposure click
  const handleBetSettledClick = (userId) => {
    navigate(`/user-settled-bets-details/${userId}`, {
      state: { userId: userId }
    });
  };

  return (
    <>
      <div className="card">
        <div className="card-header bg-color-black p-2 text-white d-flex justify-content-between align-items-center">
          <h3 className="card-title mb-0">Date Wise All Users List</h3>
          <div>
            <button
              className="btn btn-success me-2"
              onClick={() => navigate("/create-users")}
            >
              Create User
            </button>
            <button
              className="btn btn-light"
              onClick={() => setFilter((prev) => !prev)}
            >
              <MdFilterListAlt /> Filter
            </button>
          </div>
        </div>
        {filter && (
          <div className="card-body border-bottom">
            <div className="row g-3">
              {/* <div className="col-md-2">
                <label>User ID/Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="User ID or Name"
                  value={filters.userId}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, userId: e.target.value }))
                  }
                />
              </div> */}
              <div className="col-md-2">
                <label>Mobile</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Mobile"
                  value={filters.mobile}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, mobile: e.target.value }))
                  }
                />
              </div>
              {/* <div className="col-md-2">
                <label>Status</label>
                <select
                  className="form-control"
                  value={filters.active}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, active: e.target.value }))
                  }
                >
                  <option value="">All</option>
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </select>
              </div> */}
              {/* <div className="col-md-2">
                <label>Block Status</label>
                <select
                  className="form-control"
                  value={filters.banned}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, banned: e.target.value }))
                  }
                >
                  <option value="">All</option>
                  <option value="1">Blocked</option>
                  <option value="0">Not Blocked</option>
                </select>
              </div> */}
              <div className="col-md-2">
                <label>From Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={filters.start_date}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, start_date: e.target.value }))
                  }
                />
              </div>
              <div className="col-md-2">
                <label>To Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={filters.end_date}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, end_date: e.target.value }))
                  }
                />
              </div>
              <div className="col-md-12 d-flex align-items-end gap-2">
                <button className="btn btn-primary" onClick={applyFilters}>
                  Apply Filters
                </button>
                <button className="btn btn-secondary" onClick={resetFilters}>
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="card-body table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>Sr.No</th>
                <th>Date/Time</th>
                <th>User Name</th>
                <th>Mobile</th>
                <th>Credit Amount</th>
                <th>Exposer</th>
                <th>Status</th>
                <th>Block Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user, i) => (
                  <tr key={user._id}>
                    <td>{(pagination.page - 1) * pagination.limit + i + 1}</td>
                    <td>
                      <small>
                        {new Date(
                          user.created_at || user.createdAt || user.updated_at
                        ).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </small>
                    </td>
                    <td>{user.username}</td>
                    <td>{user.mobile}</td>
                    <td>₹ {Number(user.credit || 0).toFixed(2)}</td>
                    <td
                      className="fw-bold text-danger"
                      style={{ cursor: 'pointer', textDecoration: 'underline' }}
                      onClick={() => handleExposureClick(user._id)}
                      title="Click to view bet details"
                    >
                      ₹ {user.totalExposure || 0}
                    </td>
                    <td>
                      <span
                        className={`fw-bold ${user.active === 1
                          ? "text-success"
                          : "text-danger"
                          }`}
                      >
                        {user.active === 1 ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`fw-bold ${user.banned === 1
                          ? "text-danger"
                          : "text-success"
                          }`}
                      >
                        {user.banned === 1 ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td>
                      <div
                        className="justify-content-between d-flex gap-2"
                        role="group"
                      >
                        <button
                          onClick={() => navigate(`/edituser/${user._id}`)}
                          className="me-1 btn btn-primary"
                        >
                          <FaEdit />
                        </button>
                        <div
                          onClick={() =>
                            handleBlockToggle(user._id, user.banned === 1)
                          }
                          className="me-1 d-flex align-items-center justify-content-center border-0"
                          title={
                            user.banned === 1
                              ? "Blocked — click to Unblock"
                              : "Active — click to Block"
                          }
                        >
                          {user.banned === 1 ? (
                            <div className="btn btn-secondary">
                              <FaLock />
                            </div>
                          ) : (
                            <div className="btn btn-info">
                              <FaUnlock />
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            localStorage.setItem("admin_id", user.admin_id);
                            localStorage.setItem("user_id", user._id);

                            navigate(`/userwallet/${user._id}`, {
                              state: { user },
                            });
                          }}
                          className="refreshbutton"
                        >
                          <FaWallet />
                        </button>

                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="btn btn btn-danger"
                        >
                          <FaTrashAlt />
                        </button>
                        <button
                          onClick={() => handleOpenModal("add", user)}
                          className="btn btn-success"
                          title={"Add Balance"}
                        >
                          <FaPlus />
                        </button>

                        <button
                          onClick={() => handleOpenModal("withdraw", user)}
                          className="me-1 btn btn-warning"
                          title={"Withdraw Balance"}
                        >
                          <FaMinus />
                        </button>

                        <button
                          onClick={() => handleBetSettledClick(user._id)}
                          className="me-1 btn btn-warning"
                          title={"Users Settled Bets"}
                        >
                          <FaGamepad />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-4">
                    No users found
                    <br />
                    <button
                      className="btn btn-primary mt-2"
                      onClick={fetchUsers}
                    >
                      Refresh
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.total > 0 && (
          <div className="card-footer d-flex justify-content-between align-items-center">
            <span className="text-muted small">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
              {pagination.total} All users
            </span>

            <ul className="custom-pagination pagination mb-0">
              {/* Prev */}
              <li
                className={`page-item ${pagination.page === 1 ? "disabled" : ""
                  }`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(pagination.page - 1)}
                >
                  &laquo;
                </button>
              </li>

              {/* Pages */}
              {[pagination.page - 1, pagination.page, pagination.page + 1]
                .filter((p) => p > 0 && p <= pagination.totalPages)
                .map((p) => (
                  <li
                    key={p}
                    className={`page-item ${pagination.page === p ? "active" : ""
                      }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(p)}
                    >
                      {p}
                    </button>
                  </li>
                ))}

              {/* Next */}
              <li
                className={`page-item ${pagination.page === pagination.totalPages ? "disabled" : ""
                  }`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(pagination.page + 1)}
                >
                  &raquo;
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === "add" ? "Add Balance" : "Withdraw Balance"} -{" "}
            {selectedUser?.username}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <div className="alert alert-info">
              <div className="d-flex justify-content-between align-items-center">
                <span className="fw-bold">Current Balance:</span>
                <span className="h5 mb-0">₹ {selectedUser?.credit || 0}</span>
              </div>
              {modalType === "withdraw" && (
                <div className="mt-2 small text-muted">
                  Available to withdraw: ₹ {selectedUser?.credit || 0}
                </div>
              )}
            </div>
          </div>

          <Form>
            <Form.Group className="mb-3">
              <Form.Label>
                Amount{" "}
                {modalType === "withdraw" &&
                  `(Max: ₹ ${selectedUser?.credit || 0})`}
              </Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                max={
                  modalType === "withdraw" ? selectedUser?.credit : undefined
                }
                min="0"
                step="0.01"
              />
              {modalType === "withdraw" && selectedUser?.credit > 0 && (
                <div className="mt-1">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => setAmount(selectedUser.credit)}
                  >
                    Use Max Balance
                  </button>
                </div>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Remarks</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Enter remarks (optional)"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </Form.Group>

            {amount > 0 && (
              <div className="alert alert-warning">
                <div className="d-flex justify-content-between">
                  <span>Current Balance:</span>
                  <span>₹ {selectedUser?.credit || 0}</span>
                </div>
                <div className="d-flex justify-content-between mt-1">
                  <span>
                    {modalType === "add"
                      ? "Amount to Add:"
                      : "Amount to Withdraw:"}
                  </span>
                  <span>₹ {amount}</span>
                </div>
                <hr className="my-2" />
                <div className="d-flex justify-content-between fw-bold">
                  <span>New Balance:</span>
                  <span>
                    ₹{" "}
                    {modalType === "add"
                      ? (selectedUser?.credit || 0) + Number(amount)
                      : (selectedUser?.credit || 0) - Number(amount)}
                  </span>
                </div>
              </div>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <div className="d-flex justify-content-between w-100 align-items-center">
            <div className="text-muted small">
              User ID: {selectedUser?.user_id}
            </div>
            <div className="d-flex gap-2">
              <Button variant="danger" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button
                variant={modalType === "add" ? "success" : "warning"}
                onClick={handleTransaction}
                disabled={
                  modalType === "withdraw" &&
                  Number(amount) > (selectedUser?.credit || 0)
                }
              >
                {modalType === "add" ? (
                  <>
                    <FaPlus className="me-1" /> Add ₹ {amount || 0}
                  </>
                ) : (
                  <>
                    Withdraw ₹ {amount || 0}
                  </>
                )}
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DateWiseUsersList;