import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  FaEdit,
  FaTrashAlt,
  FaLock,
  FaUnlock,
  FaWallet,
  FaStickyNote,
} from "react-icons/fa";
import { BsArrowLeft } from "react-icons/bs";
import { getInactiveUsers, deleteUser, blockUser } from "../../Server/api";

function InactiveUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    userId: "",
    mobile: "",
    fromDate: "",
    toDate: "",
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const navigate = useNavigate();

  // Fetch inactive users
  const fetchUsers = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        userId: filters.userId,
        mobile: filters.mobile,
        fromDate: filters.fromDate,
        toDate: filters.toDate,
      };

      const response = await getInactiveUsers(params);

      if (response.data?.success) {
        setUsers(response.data.data || []);
        if (response.data.pagination) {
          setPagination({
            page: response.data.pagination.page,
            total: response.data.pagination.total,
            totalPages: response.data.pagination.totalPages,
            limit: response.data.pagination.limit,
          });
        }
      } else {
        Swal.fire("Error", "Failed to fetch inactive users", "error");
        setUsers([]);
      }
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to fetch inactive users",
        "error"
      );
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(pagination.page, pagination.limit);
    // eslint-disable-next-line
  }, []);

  // Delete user
  const handleDeleteUser = async (userId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      const result = await deleteUser(userId);
      if (result.data.success) {
        Swal.fire("Deleted!", "User deleted successfully.", "success");
        fetchUsers(pagination.page, pagination.limit);
      } else {
        Swal.fire("Error", result.data.message || "Failed to delete user", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Failed to delete user", "error");
    }
  };

  // Block / Unblock toggle
  const handleBlockToggle = async (userId, isBlocked) => {
    const confirm = await Swal.fire({
      title: isBlocked ? "Unblock User?" : "Block User?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: isBlocked ? "Unblock" : "Block",
    });

    if (!confirm.isConfirmed) return;

    try {
      const newStatus = isBlocked ? 0 : 1;
      const response = await blockUser(userId, newStatus);

      if (response.data.success) {
        Swal.fire(
          "Success",
          `User ${isBlocked ? "unblocked" : "blocked"} successfully`,
          "success"
        );
        fetchUsers(pagination.page, pagination.limit);
      } else {
        Swal.fire(
          "Error",
          response.data.message || "Failed to update user status",
          "error"
        );
      }
    } catch (error) {
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    fetchUsers(newPage, pagination.limit);
  };


    const handleExposureClick = (userId) => {
    navigate(`/user-bets-exposer-details/${userId}`, {
      state: { userId: userId }
    });
  };
  

  return (
    <div className="card">
      <div className="card-header bg-dark text-white d-flex justify-content-between">
        <h5>Inactive Users List</h5>
        <button
          className="btn btn-light btn-sm"
          onClick={() => navigate("/all_users")}
        >
          <BsArrowLeft /> Back
        </button>
      </div>

      <div className="card-body table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Mobile</th>
              <th>Credit</th>
              <th>Exposer</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center">
                  Loading...
                </td>
              </tr>
            ) : users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user._id}>
                  <td>{(pagination.page - 1) * pagination.limit + index + 1}</td>
                  <td>{user.mobile || "N/A"}</td>
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
                      className={`fw-bold ${user.active == 1
                          ? "text-success"
                          : "text-danger"
                        }`}
                    >
                      {user.active == 1 ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="d-flex gap-2">
                    {/* Edit */}
                    <button
                      onClick={() => navigate(`/edituser/${user._id}`)}
                      className="btn btn-sm btn-primary"
                    >
                      <FaEdit />
                    </button>

                    {/* Block / Unblock */}
                    <button
                      onClick={() =>
                        handleBlockToggle(user._id, user.banned === 1)
                      }
                      className={`btn btn-sm ${user.banned === 1 ? "btn-secondary" : "btn-info"}`}
                    >

                      {user.banned === 1 ? <FaLock /> : <FaUnlock />}
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="btn btn-sm btn-danger"
                    >
                      <FaTrashAlt />
                    </button>

                    {/* Wallet */}
                    {/* <button
                      onClick={() =>
                        navigate(`/userwallet/${user._id}`, {
                          state: { user },
                        })
                      }
                      className="btn btn-sm btn-info text-white"
                    >
                      <FaWallet />
                    </button> */}
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

                    {/* Notes */}
                    {/* <button
                      onClick={() => navigate(`/user-Note/${user._id}`)}
                      className="btn btn-sm btn-warning"
                    >
                      <FaStickyNote />
                    </button> */}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No inactive users found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="d-flex justify-content-between mt-3">
            <button
              className="btn btn-sm btn-secondary"
              disabled={pagination.page === 1}
              onClick={() => handlePageChange(pagination.page - 1)}
            >
              Previous
            </button>

            <span>
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <button
              className="btn btn-sm btn-secondary"
              disabled={pagination.page === pagination.totalPages}
              onClick={() => handlePageChange(pagination.page + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default InactiveUsers;