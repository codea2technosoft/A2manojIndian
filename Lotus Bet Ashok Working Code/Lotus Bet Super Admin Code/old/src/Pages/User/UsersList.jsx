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
} from "react-icons/fa";
import {
  getAllUsersList,
  deleteUser,
  updateUserStatus,
  depositToUser,
  withdrawFromUser,
  blockUser,
} from "../../Server/api";
import { FaPlus, FaMinus, FaEye } from "react-icons/fa";

function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");

  const navigate = useNavigate();

  // Filters state
  const [filters, setFilters] = useState({
    status: "",
    userId: "",
    mobile: "",
    fromDate: "",
    toDate: "",
  });

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
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
        status: filters.status,
        userId: filters.userId,
        mobile: filters.mobile,
        fromDate: filters.fromDate, // ✅ बिना conversion के
        toDate: filters.toDate,
      };
      const response = await getAllUsersList(params);
      if (response.data && response.data.success) {
        setUsers(response.data.data);
        if (response.data.pagination) {
          setPagination((prev) => ({
            ...prev,
            page: response.data.pagination.page,
            total: response.data.pagination.total,
            totalPages: response.data.pagination.totalPages,
            limit: response.data.pagination.limit,
          }));
        }
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

  // const handleToggleStatus = async (userId, currentStatus) => {
  //   const newStatus = currentStatus === 1 ? 0 : 1;
  //   try {
  //     const result = await updateUserStatus(userId, newStatus);
  //     if (result.data.success) {
  //       Swal.fire({
  //         icon: "success",
  //         title: "Success",
  //         text: `User status ${newStatus === 1 ? 'activated' : 'deactivated'} successfully`,
  //       });

  //       fetchUsers(pagination.page);
  //     } else {
  //       throw new Error(result.message || "Failed to update status");
  //     }
  //   } catch (error) {
  //     Swal.fire({
  //       icon: "error",
  //       title: "Error",
  //       text: error.message || "Something went wrong.",
  //     });
  //   }
  // };

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
    fetchUsers(1, pagination.limit); // filter apply ke sath refresh
    setFilter(false);
  };
  const resetFilters = () => {
    setFilters({
      status: "",
      search: "",
      userId: "",
      mobile: "",
      name: "",
      fromDate: "",
      toDate: "",
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchUsers(1, pagination.limit);
  };
  // const handleRefresh = () => {
  //   resetFilters();
  // };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleOpenModal = (type, user) => {
    setModalType(type);
    setSelectedUser(user);
    setAmount("");
    setRemarks("");
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
          remarks
        );
      } else {
        response = await withdrawFromUser(
          selectedUser._id,
          Number(amount),
          remarks
        );
      }

      if (response.data.success) {
        Swal.fire({
          title: "Success!",
          html: `
        <p>${response.data.message}</p>
        <div class="mt-3">
          <p><strong>User:</strong> ${
            selectedUser?.username || selectedUser?.mobile
          }</p>
          <p><strong>Previous Balance:</strong> ₹ ${
            response.data.data.previousBalance || selectedUser?.credit || 0
          }</p>
          <p><strong>${
            modalType === "add" ? "Added" : "Withdrawn"
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

  // const getVisiblePages = () => {
  //   const { page, totalPages } = pagination;
  //   const visible = 5;
  //   let start = Math.max(1, page - 1);
  //   let end = Math.min(totalPages, start + visible - 1);
  //   if (end - start < visible - 1) {
  //     start = Math.max(1, end - visible + 1);
  //   }
  //   return { start, end };
  // };

  return (
    <>
      <div className="card">
         <div className="card-header d-flex bg-primary-yellow justify-content-between align-items-center">
      <h3 className="card-title mb-0">All User List</h3>
          <div>
            <button
              className="btn btn-success me-2"
              onClick={() => navigate("/create_user")}
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
              <div className="col-md-2">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={filters.status}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, status: e.target.value }))
                  }
                >
                  <option value="">All Status</option>
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </select>
              </div>
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
              <div className="col-md-2">
                <label className="form-label">To Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={filters.toDate}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, toDate: e.target.value }))
                  }
                />
              </div>

              <div className="col-md-2">
                <label className="form-label">To Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={filters.toDate}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, toDate: e.target.value }))
                  }
                />
              </div>
              <div className="col-md-2 d-flex align-items-end gap-2">
                <button className="btn btn-primary" onClick={applyFilters}>
                  Apply
                </button>
                <button className="btn btn-secondary" onClick={resetFilters}>
                  Reset
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
                {/* <th>User Id</th> */}
                <th>Date/Time</th>
                <th>Mobile</th>
                <th>Note</th>
                <th>Credit Amount</th>
                <th>Exposer</th>

                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user, i) => (
                  <tr key={user._id}>
                    <td>{(pagination.page - 1) * pagination.limit + i + 1}</td>
                    {/* <td>{user.user_id}</td> */}
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
                    <td>{user.mobile}</td>
                    <td>
                      {user?.note ? (
                        <span
                          className="badge bg-danger text-light text-truncate d-inline-block"
                          title={user.note}
                        >
                          {user.note}
                        </span>
                      ) : (
                        "--"
                      )}
                    </td>

                    <td>{user.credit}</td>
                    <td className="fw-bold text-danger">
                      {user.total_exposer || 0}
                    </td>
                    <td>
                      <span
                        className={`fw-bold ${
                          user.user_status === 1
                            ? "text-success"
                            : "text-danger"
                        }`}
                      >
                        {user.user_status === 1 ? "Active" : "Inactive"}
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
                          className="btn btn-warning"
                          onClick={() => navigate(`/user-Note/${user.user_id}`)}
                          title="Add/View Note"
                        >
                          <FaStickyNote />
                        </button>
                        {/* <button
                          onClick={() => navigate(`/userwallet/${user._id}`, { state: { user } })}
                          className="btn btn-info text-white"
                        >
                          <FaEye /> Wallet
                        </button> */}
                        <button
                          onClick={() =>
                            navigate(`/userwallet/${user._id}`, {
                              state: { user },
                            })
                          }
                          className="refreshbutton"
                        >
                          {/* <FaEye />  */}
                          <FaWallet />
                        </button>

                        {/* <button
                          variant={user.user_status === 1 ? "outline-warning" : "outline-success"}
                          onClick={() => handleToggleStatus(user._id, user.user_status)}
                          className="me-1 btn btn-sm btn-primary"
                        >
                          {user.user_status === 1 ? "Deactivate" : "Activate"}
                        </button> */}
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
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">
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
                className={`page-item ${
                  pagination.page === 1 ? "disabled" : ""
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
                    className={`page-item ${
                      pagination.page === p ? "active" : ""
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
                className={`page-item ${
                  pagination.page === pagination.totalPages ? "disabled" : ""
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

export default UsersList;
