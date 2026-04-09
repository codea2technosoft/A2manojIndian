import { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight, FiEye, FiEyeOff } from "react-icons/fi";
import { Button } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getBlockedUsers, blockUser } from "../Server/api";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { FaLock, FaUnlock } from "react-icons/fa";

function BlockedUserLists() {
  const navigate = useNavigate();
  const location = useLocation();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({});

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const admin_id = localStorage.getItem("admin_id");

  const fetchBlockedUsers = async (page = 1) => {
    try {
      setLoading(true);
      const payload = { admin_id, page, limit: itemsPerPage }; // fetch all users, we'll filter by banned in API
      const res = await getBlockedUsers(payload);
      if (res.data.success) {
        setUsers(res.data.data || []);
        setTotalItems(res.data.pagination?.total || res.data.data.length || 0);
        setTotalPages(res.data.pagination?.totalPages || 1);
        setCurrentPage(res.data.pagination?.page || page);
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.error(err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlockedUsers();
  }, [location]);

  const togglePassword = (_id) => {
    setShowPassword((prev) => ({ ...prev, [_id]: !prev[_id] }));
  };

  const handleToggleBlock = async (user) => {
    const action = user.banned === 1 ? "Unblock" : "Block";

    const confirm = await Swal.fire({
      title: `${action} User?`,
      text: `Do you really want to ${action.toLowerCase()} this user?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${action}`,
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      // Toggle banned status: 1 → 0, 0 → 1
      const newStatus = user.banned === 1 ? 0 : 1;
      const res = await blockUser(user._id, newStatus); // Pass _id and newStatus

      if (res.data.success) {
        toast.success(`User ${action.toLowerCase()}ed successfully`);
        fetchBlockedUsers(currentPage);
      } else {
        toast.error(res.data.message || `Failed to ${action.toLowerCase()} user`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  const handleBack = () => navigate(-1);
  const handleNext = () => currentPage < totalPages && fetchBlockedUsers(currentPage + 1);
  const handlePrev = () => currentPage > 1 && fetchBlockedUsers(currentPage - 1);
  const handlePageClick = (page) => page >= 1 && page <= totalPages && fetchBlockedUsers(page);

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let end = Math.min(totalPages, start + maxVisiblePages - 1);
      if (end - start + 1 < maxVisiblePages) start = end - maxVisiblePages + 1;
      for (let i = start; i <= end; i++) pageNumbers.push(i);
    }
    return pageNumbers;
  };

  return (
    <>
      <div className="card">
        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Blocked Users</h5>
          <Button size="sm" className="btn-success" onClick={handleBack}>Back</Button>
        </div>

        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>User ID</th>
                  <th>Phone</th>
                  <th>Username</th>
                  <th>DOJ</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </td>
                  </tr>
                ) : users.length > 0 ? (
                  users.map((user, index) => (
                    <tr key={user._id || index}>
                      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td>{user._id}</td>
                      <td>{user.mobile}</td>
                      <td>{user.username}</td>
                      <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</td>

                      <td>
                        <button
                          onClick={() => handleToggleBlock(user)}
                          className={`btn btn-sm ${user.banned === 1 ? "btn-secondary" : "btn-info"}`}
                        >

                          {user.banned === 1 ? <FaLock /> : <FaUnlock />}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-muted">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-4">
              <span className="text-muted">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
              </span>
              <div className="d-flex gap-1">
                <Button size="sm" onClick={handlePrev} disabled={currentPage === 1}><FiChevronLeft /></Button>
                {getPageNumbers().map((page) => (
                  <Button
                    key={page}
                    size="sm"
                    variant={currentPage === page ? "primary" : "outline-primary"}
                    onClick={() => handlePageClick(page)}
                  >
                    {page}
                  </Button>
                ))}
                <Button size="sm" onClick={handleNext} disabled={currentPage === totalPages}><FiChevronRight /></Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={1000} hideProgressBar={false} closeOnClick pauseOnHover theme="colored" />
    </>
  );
}

export default BlockedUserLists;