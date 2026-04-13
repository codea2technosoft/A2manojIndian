import React, { useEffect, useState } from "react";
import { Table, Modal, Button, Pagination, Row, Col } from "react-bootstrap";
import { FaInfoCircle } from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL || 'https://realestateapi.a2logicgroup.com/adminapi';

function AllNotificationList() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [notificationsPerPage] = useState(10);

  const [showModal, setShowModal] = useState(false); // for remark modal
  const [selectedRemark, setSelectedRemark] = useState(""); // selected remark

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/notification-data`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.status === "1") setNotifications(data.data || []);
      else setNotifications([]);
    } catch (err) {
      setError(err.message);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (remark) => {
    setSelectedRemark(remark);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRemark("");
  };

  // Pagination
  const indexOfLast = currentPage * notificationsPerPage;
  const indexOfFirst = indexOfLast - notificationsPerPage;
  const currentNotifications = notifications.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(notifications.length / notificationsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="userlist mt-2">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4>All Notifications</h4>
        </div>

        <div className="card-body">
          {notifications.length === 0 ? (
            <div className="text-center p-5">
              <p>No notifications found. Click "Add Notification" to create one.</p>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Lead ID</th>
                      <th>Type</th>
                      <th>Message</th>
                      <th>Remark</th>
                      <th>Status</th>
                      <th>Action BY</th>
                      <th>Date Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentNotifications.map((notification, index) => (
                      <tr key={notification.id}>
                        <td>{indexOfFirst + index + 1}</td>
                        <td>{notification.order_id}</td>
                        <td>
                          {notification.type
                            .replace(/_/g, " ") // underscores को space में बदलना
                            .replace(/\b\w/g, (char) => char.toUpperCase())} {/* हर शब्द का पहला अक्षर capital */}
                        </td>


                        <td>{notification.message?.substring(0, 50)}...</td>
                        <td style={{ wordBreak: "break-word" }}>
                          {notification.remark?.substring(0, 30)}{" "}
                          {notification.remark?.length > 30 && (
                            <Button
                              variant="link"
                              size="sm"
                              style={{ padding: 0 }}
                              onClick={() => handleShowModal(notification.remark)}
                            >
                              <FaInfoCircle color="blue" />
                            </Button>
                          )}
                        </td>
                        <td className={notification.statusremark === 'approved' ? 'text-success' : ''}>{notification.statusremark.charAt(0).toUpperCase() + notification.statusremark.slice(1).toLowerCase()}</td>
                        <td> {notification.action_by.charAt(0).toUpperCase() + notification.action_by.slice(1).toLowerCase()}</td>
                        <td>
                          {(() => {
                            const date = new Date(notification.date_time.replace(" ", "T"));
                            return (
                              date.toLocaleDateString("en-GB") +
                              " " +
                              date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
                            );
                          })()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {totalPages > 1 && (
                <Row className="mt-3">
                  <Col>
                    <Pagination>
                      <Pagination.First onClick={() => paginate(1)} disabled={currentPage === 1} />
                      <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
                      {[...Array(totalPages).keys()].map(number => (
                        <Pagination.Item
                          key={number + 1}
                          active={number + 1 === currentPage}
                          onClick={() => paginate(number + 1)}
                        >
                          {number + 1}
                        </Pagination.Item>
                      ))}
                      <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} />
                      <Pagination.Last onClick={() => paginate(totalPages)} disabled={currentPage === totalPages} />
                    </Pagination>
                  </Col>
                </Row>
              )}
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Remark Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{ wordBreak: "break-word" }}>{selectedRemark}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AllNotificationList;
