import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Modal, Form, Button } from "react-bootstrap";
import { MdFilterListAlt } from "react-icons/md";
import {
  FaEdit,
  FaTrashAlt,
  FaLock,
  FaUnlock,
  FaWallet,
  FaStickyNote,
} from "react-icons/fa";
import { getAllUsersList, deleteUser, blockUser } from "../../Server/api";
import { BsArrowLeft } from "react-icons/bs";

function InactiveUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const navigate = useNavigate();

  // Filters state
  const [filters, setFilters] = useState({
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
        status: "0", // Only inactive users
        userId: filters.userId,
        mobile: filters.mobile,
        fromDate: filters.fromDate,
        toDate: filters.toDate,
      };

      const response = await getAllUsersList(params);

      if (response.data && response.data.success) {
        // Filter for inactive users only (additional safety)
        const inactiveUsers = response.data.data.filter(
          (user) => user.user_status === 0
        );
        setUsers(inactiveUsers);

        if (response.data.pagination) {
          setPagination((prev) => ({
            ...prev,
            page: response.data.pagination.page,
            total: inactiveUsers.length, // Use filtered count
            totalPages: response.data.pagination.totalPages,
            limit: response.data.pagination.limit,
          }));
        }
      } else if (Array.isArray(response.data)) {
        const inactiveUsers = response.data.filter(
          (user) => user.user_status === 0
        );
        setUsers(inactiveUsers);
      } else {
        Swal.fire("Error", "Failed to fetch inactive users", "error");
      }
    } catch (error) {
      console.error("API Error:", error);
      Swal.fire("Error", "Failed to fetch inactive users", "error");
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
    setFilter(false);
  };

  const resetFilters = () => {
    setFilters({
      userId: "",
      mobile: "",
      fromDate: "",
      toDate: "",
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchUsers(1, pagination.limit);
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    fetchUsers(newPage);
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

  return (
    <div className="card">
      {/* Card Header */}
     <div className="card-header d-flex bg-primary-yellow justify-content-between align-items-center">
      <h3 className="card-title mb-0">Inactive Users List</h3>
      <div className="d-flex gap-2">
        <button
          className="backbutton"
          onClick={() => setFilter((prev) => !prev)}
        >
          <MdFilterListAlt /> Filter
        </button>
        <button
          className="backbutton"
          onClick={() => navigate("/all_users")}
        >
          <BsArrowLeft className="me-1" />
          Back
        </button>
      </div>
    </div>

      {/* Filter Section */ }
  {
    filter && (
      <div className="card-body border-bottom">
        <div className="row g-3">
          <div className="col-md-2">
            <label>User ID</label>
            <input
              type="text"
              className="form-control"
              placeholder="User ID"
              value={filters.userId}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, userId: e.target.value }))
              }
            />
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
            <label className="form-label">From Date</label>
            <input
              type="date"
              className="form-control"
              value={filters.fromDate}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, fromDate: e.target.value }))
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
    )
  }

  {/* Table Section */ }
  <div className="card-body table-responsive">
    <table className="table table-bordered table-hover">
      <thead className="table-dark">
        <tr>
          <th>Sr.No</th>
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
        {loading ? (
          <tr>
            <td colSpan="8" className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </td>
          </tr>
        ) : users.length > 0 ? (
          users.map((user, i) => (
            <tr key={user._id}>
              <td>{(pagination.page - 1) * pagination.limit + i + 1}</td>
              <td>
                <small>
                  {new Date(
                    user.d_at || user.createdAt || user.updated_at
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
                    style={{ maxWidth: "100px" }}
                  >
                    {user.note}
                  </span>
                ) : (
                  "--"
                )}
              </td>
              <td>₹ {user.credit || 0}</td>
              <td className="fw-bold text-danger">
                ₹ {user.total_exposer || 0}
              </td>
              <td>
                <span className="fw-bold text-danger">Inactive</span>
              </td>
              <td>
                <div
                  className="justify-content-between d-flex gap-2"
                  role="group"
                >
                  <button
                    onClick={() => navigate(`/edituser/${user._id}`)}
                    className="btn btn-sm btn-primary"
                    title="Edit User"
                  >
                    <FaEdit />
                  </button>

                  <div
                    onClick={() =>
                      handleBlockToggle(user._id, user.banned === 1)
                    }
                    title={
                      user.banned === 1 ? "Unblock User" : "Block User"
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
                    className="settlementnowbutton"
                    onClick={() => navigate(`/user-Note/${user.user_id}`)}
                    title="Add/View Note"
                  >
                    <FaStickyNote />
                  </button>

                  <button
                    onClick={() =>
                      navigate(`/userwallet/${user._id}`, {
                        state: { user },
                      })
                    }
                    className="btn btn-sm btn-info text-white"
                    title="View Wallet"
                  >
                    <FaWallet />
                  </button>

                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="btn btn-sm btn-danger"
                    title="Delete User"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="8" className="text-center py-4">
              No inactive users found
              <br />
              <button className="btn btn-primary mt-2" onClick={fetchUsers}>
                Refresh
              </button>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>

  {/* Pagination */ }
  {
    pagination.total > 0 && (
      <div className="card-footer d-flex justify-content-between align-items-center">
        <span className="text-muted small">
          Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
          {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
          {pagination.total} inactive users
        </span>

        <ul className="pagination pagination-sm mb-0">
          {/* Previous */}
          <li
            className={`page-item ${pagination.page === 1 ? "disabled" : ""}`}
          >
            <button
              className="page-link"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
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
              disabled={pagination.page === pagination.totalPages}
            >
              &raquo;
            </button>
          </li>
        </ul>
      </div>
    )
  }
    </div >
  );
}

export default InactiveUsers;
