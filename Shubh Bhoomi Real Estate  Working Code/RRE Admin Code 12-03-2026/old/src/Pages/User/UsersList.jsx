import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function UsersList() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 20;
  const [modalOpen, setModalOpen] = useState(false);
  const [modalUserId, setModalUserId] = useState(null);
  const [modalAction, setModalAction] = useState(null);
  const [ModalCredit, setModalCredit] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [amount, setAmount] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchUsers = async (filter) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/user-list?filter=${filter}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await res.json();
      if (result.success === "1") {
        setUsers(result.data);
        setFilteredUsers(result.data);
        setCurrentPage(1); // reset to first page after fetching
      } else {
        Swal.fire("Error", result.message || "Failed to fetch users", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Failed to fetch users", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);


  const handleToggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/user-inactive-active-update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ user_id: userId, status: newStatus }),
        }
      );

      const result = await res.json();
      if (res.ok && result.success === "1") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: `User status updated to ${newStatus}`,
        });

        fetchUsers();
      } else {
        throw new Error(result.message || "Failed to update status");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Something went wrong.",
      });
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = users.filter((user) => {
      const userName = user.username?.toLowerCase() || "";
      const mobile = user.mobile?.toString() || "";
      const color = user.color?.toString() || "";
      return (
        userName.includes(value) ||
        mobile.includes(value) ||
        color.includes(value)
      );
    });

    setFilteredUsers(filtered);
    setCurrentPage(1); 
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const [selectedValue, setSelectedValue] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setSelectedValue(value);
    console.warn("Selected:", value);
    fetchUsers(value);
  };
  return (
    <div className="userlist">
      <div className="card">
        <div className="card-header bg-color-black">
          <div className="d-flex align-items-center justify-content-between">
            <h3 className="card-title text-white">All Users List</h3>
            <div className="buttonlist">
            </div>
          </div>
        </div>

        <div className="card-body">
          <div className="row">
            <div className="col-md-12">
              <div className="form-design-fillter gap-2 d-flex justify-content-end search_bar ml-auto">
                <select
                  className="form-select"
                  onChange={handleChange}
                  value={selectedValue}
                >
                  <option value="">Select</option>
                  <option value="top_winner">Top Winner</option>
                  <option value="top_losser">Top Losser</option>
                </select>
                <div>
                  <input
                    type="text"
                    name="user_name"
                    className="form-control"
                    placeholder="Search by Name || Mobile || Color"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card-body">
          {loading ? (
            <p>Loading users...</p>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Sr.</th>
                      <th>User Name</th>
                      <th>Mobile No</th>
                      <th>Password</th>
                      <th>Date</th>
                      <th>Status</th>
                     
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center">
                          No users found.
                        </td>
                      </tr>
                    ) : (
                      currentUsers.map((user, index) => (
                        <tr key={user._id}>
                          <td>
                            <div className="d-flex align-items-center">
                              {" "}
                              {indexOfFirstUser + index + 1}{" "}
                              <span
                                className="indicator"
                                style={{
                                  background: user.color || "transparent",
                                }}
                              ></span>
                            </div>{" "}
                          </td>
                          <td>
                            {user.username.charAt(0).toUpperCase() +
                              user.username.slice(1).toLowerCase()}
                          </td>
                          <td>{user.mobile}</td>
                          <td>{user.mpin}</td>
                          <td>
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                          <td>
                            <div className="form-check form-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`userSwitch-${user.user_id}`}
                                checked={user.status === "active"}
                                onChange={() =>
                                  handleToggleStatus(user.user_id, user.status)
                                }
                                style={{ cursor: "pointer" }}
                              />
                              <label
                                className="form-check-label"
                                htmlFor={`userSwitch-${user.user_id}`}
                                style={{
                                  marginLeft: "10px",
                                  fontWeight: "bold",
                                  color:
                                    user.status === "active" ? "green" : "red",
                                }}
                              >
                                {user.status === "active" ? "ON" : "OFF"}
                              </label>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="d-flex justify-content-between align-items-center mt-3">
                <button
                  className="paginationbutton"
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>

                <span className="alllistnumber">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  className="paginationbutton"
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default UsersList;
