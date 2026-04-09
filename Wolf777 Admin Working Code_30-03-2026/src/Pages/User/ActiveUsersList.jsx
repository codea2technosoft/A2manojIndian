import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { MdFilterListAlt } from "react-icons/md";
import { FaEdit, FaTrashAlt, FaLock, FaUnlock, FaWallet ,FaGamepad} from "react-icons/fa";
import { BsArrowLeft } from "react-icons/bs";
import { getActiveUsers, deleteUser, blockUser } from "../../Server/api";


function ActiveUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState(false);
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    mobile: "",
    fromDate: "",
    toDate: "",
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  });

  const fetchUsers = async (page = pagination.page, limit = pagination.limit) => {
    setLoading(true);
    try {
      const params = { page, limit, ...filters };
      const res = await getActiveUsers(params);
      if (res.data.success) {
        setUsers(res.data.data || []);
        if (res.data.pagination) {
          setPagination({
            page: res.data.pagination.page,
            limit: res.data.pagination.limit,
            total: res.data.pagination.total,
            totalPages: res.data.pagination.totalPages,
          });
        }
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch users", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  const handleDeleteUser = async (userId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This user will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
    });
    if (!confirm.isConfirmed) return;

    try {
      const res = await deleteUser(userId);
      if (res.data.success) {
        Swal.fire("Deleted!", "User deleted successfully", "success");
        fetchUsers(pagination.page);
      }
    } catch (err) {
      Swal.fire("Error", "Delete failed", "error");
    }
  };

  // ✅ Correct Block / Unblock toggle
  const handleBlockToggle = async (userId, isBlocked) => {
    const confirm = await Swal.fire({
      title: isBlocked ? "Unblock User?" : "Block User?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: isBlocked ? "Yes, Unblock" : "Yes, Block",
    });
    if (!confirm.isConfirmed) return;

    try {
      const newStatus = isBlocked ? 0 : 1; // toggle
      const res = await blockUser(userId, newStatus);
      if (res.data.success) {
        Swal.fire("Success", `User ${isBlocked ? "unblocked" : "blocked"} successfully`, "success");
        fetchUsers(pagination.page);
      } else {
        Swal.fire("Error", res.data.message || "Failed to update status", "error");
      }
    } catch {
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  const applyFilters = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchUsers(1, pagination.limit);
    setFilter(false);
  };

  const resetFilters = () => {
    setFilters({ mobile: "", fromDate: "", toDate: "" });
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchUsers(1, pagination.limit);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.totalPages) return;
    fetchUsers(page);
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
    <div className="card">
      <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Active Users List</h5>
        <div>
          <button className="btn btn-sm btn-light me-2" onClick={() => setFilter(!filter)}>
            <MdFilterListAlt /> Filter
          </button>
          <button className="btn btn-sm btn-light" onClick={() => navigate("/all_users")}>
            <BsArrowLeft /> Back
          </button>
        </div>
      </div>

      {filter && (
        <div className="card-body border-bottom">
          <div className="row">
            <div className="col-md-3">
              <input type="text" className="form-control" placeholder="Mobile" value={filters.mobile} onChange={(e) => setFilters({ ...filters, mobile: e.target.value })} />
            </div>
            {/* <div className="col-md-3">
              <input type="date" className="form-control" value={filters.fromDate} onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })} />
            </div>
            <div className="col-md-3">
              <input type="date" className="form-control" value={filters.toDate} onChange={(e) => setFilters({ ...filters, toDate: e.target.value })} />
            </div> */}
            <div className="col-md-3">
              <button className="btn btn-primary me-2" onClick={applyFilters}>Apply</button>
              <button className="btn btn-secondary" onClick={resetFilters}>Reset</button>
            </div>
          </div>
        </div>
      )}

      <div className="card-body table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Mobile</th>
              <th>Credit</th>
              <th>Exposer</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className="text-center">Loading...</td></tr>
            ) : users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user._id}>
                  <td>{(pagination.page - 1) * pagination.limit + index + 1}</td>
                  <td>
                    {new Date(user.created_at).toLocaleString()}
                  </td>                  <td>{user.mobile}</td>
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
                      {user.active == 1 ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="d-flex gap-1">
                    <button className="btn btn-sm btn-primary" onClick={() => navigate(`/edituser/${user._id}`)}><FaEdit /></button>
                    <button className={`btn btn-sm ${user.banned === 1 ? "btn-secondary" : "btn-info"}`} onClick={() => handleBlockToggle(user._id, user.banned === 1)}>
                      {user.banned === 1 ? <FaLock /> : <FaUnlock />}
                    </button>
                    {/* <button className="btn btn-sm btn-warning" onClick={() => navigate(`/userwallet/${user._id}`, { state: { user } })}><FaWallet /></button> */}
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
                    <button className="btn btn-sm btn-danger" onClick={() => handleDeleteUser(user._id)}><FaTrashAlt /></button>



                    <button
                      onClick={() => handleBetSettledClick(user._id)}
                      className="me-1 btn btn-warning"
                      title={"Users Settled Bets"}
                    >
                      <FaGamepad />
                    </button>


                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="7" className="text-center">No active users found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 && (
        <div className="card-footer text-center">
          <button className="btn btn-sm btn-secondary me-2" disabled={pagination.page === 1} onClick={() => handlePageChange(pagination.page - 1)}>Prev</button>
          Page {pagination.page} of {pagination.totalPages}
          <button className="btn btn-sm btn-secondary ms-2" disabled={pagination.page === pagination.totalPages} onClick={() => handlePageChange(pagination.page + 1)}>Next</button>
        </div>
      )}
    </div>
  );
}

export default ActiveUsers;