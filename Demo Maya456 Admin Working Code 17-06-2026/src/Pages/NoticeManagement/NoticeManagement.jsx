import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import Select from "react-select";

function NoticeManagement() {
  const [show, setShow] = useState(false);
  const [list, setList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false); // ✅ Submit loader
  const [notificationText, setNotificationText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleClose = () => setShow(false);

  const handleShow = () => {
    setShow(true);
    fetchUserList();
  };

  // ✅ Fetch User List
  const fetchUserList = async () => {
    try {
      setLoadingUsers(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.REACT_APP_API_URL}notification-user-list`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data?.success === "1" && Array.isArray(data.data)) {
        const options = [
          { value: "all_user", label: "All Users" },
          ...data.data.map((u) => ({
            value: u.user_id,
            label: u.username,
          })),
        ];
        setUserList(options);
        setMenuOpen(true);
      } else {
        Swal.fire("Error", "Invalid user list response", "error");
      }
    } catch (error) {
      Swal.fire("Error", error.message || "User fetch error", "error");
    } finally {
      setLoadingUsers(false);
    }
  };

  // ✅ Fetch Notifications
  const fetchList = async () => {
    try {
      setLoadingNotifications(true);
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}notification-list?page=${currentPage}&limit=${limit}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (data?.success === "1" && Array.isArray(data.data)) {
        setList(data.data);
        setTotalItems(data.totalcount || 0);
      } else {
        Swal.fire("Error", "Invalid notification response", "error");
      }
    } catch (error) {
      Swal.fire("Error", error.message || "Fetch error", "error");
    } finally {
      setLoadingNotifications(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [currentPage]);

  // ✅ Delete Notification
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.REACT_APP_API_URL}notification-delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderid: id }),
      });
      const data = await res.json();
      if (data?.success === "1") {
        Swal.fire("Deleted!", "Notification deleted successfully.", "success");
        fetchList();
      } else {
        Swal.fire("Error", data?.message || "Something went wrong", "error");
      }
    } catch (error) {
      Swal.fire("Error", error.message || "Delete error", "error");
    }
  };

  // ✅ Submit Notification
  const handleSubmit = async () => {
    if (!notificationText.trim()) {
      Swal.fire("Validation", "Please enter a notification", "info");
      return;
    }
    if (!user) {
      Swal.fire("Validation", "Please select a user", "info");
      return;
    }

    try {
      setLoadingSubmit(true); // Loader start
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.REACT_APP_API_URL}notification-store`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: notificationText, user: user.value }),
      });
      const data = await res.json();
      if (data?.success === "1") {
        Swal.fire("Success", "Notification submitted successfully.", "success");
        fetchList();
        setNotificationText("");
        setUser(null);
        handleClose();
      } else {
        Swal.fire("Error", data?.message || "Submission failed", "error");
      }
    } catch (error) {
      Swal.fire("Error", error.message || "Submit error", "error");
    } finally {
      setLoadingSubmit(false); // Loader stop
    }
  };

  const totalPages = Math.ceil(totalItems / limit);
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="betlists mt-3 position-relative">
      {(loadingNotifications || loadingUsers || loadingSubmit) && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255,255,255,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header bg-color-black d-flex justify-content-between align-items-center">
          <h3 className="card-title text-white">Notification</h3>
          <Button variant="primary" onClick={handleShow}>
            Add New
          </Button>
        </div>

        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Sr.</th>
                  <th>Message</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loadingNotifications ? (
                  <tr>
                    <td colSpan="4" className="text-center">
                      Loading...
                    </td>
                  </tr>
                ) : list.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center text-danger fw-bold">
                      Sorry, no data found.
                    </td>
                  </tr>
                ) : (
                  list.map((item, index) => (
                    <tr key={item.orderid || index}>
                      <td>{(currentPage - 1) * limit + index + 1}</td>
                      <td>{item.message}</td>
                      <td>{item.date}</td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(item.orderid)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {list.length > 0 && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <button
                className="paginationbutton"
                onClick={handlePrev}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="alllistnumber">
                Page {currentPage} of {totalPages} (Total: {totalItems})
              </span>
              <button
                className="paginationbutton"
                onClick={handleNext}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}

          {/* Modal */}
          <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>Add Notification</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <label>
                Select User <span style={{ color: "red" }}>*</span>
              </label>
              <Select
                className="mb-3"
                options={userList}
                value={user}
                onChange={setUser}
                isSearchable
                isLoading={loadingUsers}
                menuIsOpen={menuOpen ? true : undefined}
                placeholder={loadingUsers ? "Loading users..." : "Select User"}
                onMenuClose={() => setMenuOpen(false)}
                onMenuOpen={() => setMenuOpen(true)}
              />

              <label>
                Notification Description <span style={{ color: "red" }}>*</span>
              </label>
              <textarea
                className="form-control"
                value={notificationText}
                onChange={(e) => setNotificationText(e.target.value)}
              ></textarea>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={handleSubmit}>
                Submit
              </Button>
              <Button variant="danger" onClick={handleClose}>
                Cancel
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default NoticeManagement;
