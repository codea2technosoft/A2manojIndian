import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Table, Pagination } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
const API_URL = process.env.REACT_APP_API_URL;

function RateList() {
  const [homeRate, setHomeRate] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageModalContent, setMessageModalContent] = useState({
    title: "",
    text: "",
    type: "",
    confirmAction: null,
  });


  const [showEditModal, setShowEditModal] = useState(false);
  const [currentRate, setCurrentRate] = useState(null);

  const showCustomMessageModal = (title, text, type, confirmAction = null) => {
    setMessageModalContent({ title, text, type, confirmAction });
    setShowMessageModal(true);
  };

  const closeCustomMessageModal = () => {
    setShowMessageModal(false);
    setMessageModalContent({ title: "", text: "", type: "", confirmAction: null });
  };

  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  const fetchHomeRates = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) {
        showCustomMessageModal("Authentication Error", "Authentication token not found. Please log in.", "error");
        setLoading(false);
        return;
      }

      let url = `${API_URL}/home-loan-rate-list`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          showCustomMessageModal("Authorization Error", "Unauthorized: Please log in again.", "error");
        }
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch Home Income List.");
      }

      const data = await response.json();
      setHomeRate(data.data || []);

    } catch (err) {
      console.error("Fetch Home Income List error:", err);
      setError(err.message);
      if (!showMessageModal) {
        showCustomMessageModal("Error", err.message || "An unexpected error occurred while fetching Home Income List.", "error");
      }
    } finally {
      setLoading(false);
    }
  };


  const handleEditClick = (rate) => {
    setCurrentRate(rate);
    setShowEditModal(true);
  };


  const updateHomeRate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = getAuthToken();
      if (!token) {
        showCustomMessageModal("Authentication Error", "Please log in.", "error");
        setLoading(false);
        return;
      }

      const url = `${API_URL}/home-loan-rate-update`; 

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(currentRate),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update rate.");
      }

      await fetchHomeRates();
      setShowEditModal(false);
      showCustomMessageModal("Success", "Rate updated successfully.", "success");
    } catch (err) {
      console.error("Update error:", err);
      showCustomMessageModal("Error", err.message || "An unexpected error occurred during update.", "error");
    } finally {
      setLoading(false);
    }
  };


  const closeEditModal = () => {
    setShowEditModal(false);
    setCurrentRate(null);
  };

  useEffect(() => {
    fetchHomeRates();
  }, []);


  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center m-5" role="alert">
        {error}
        <button className="btn btn-primary ms-3" onClick={() => fetchHomeRates()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="userlist">
      <div className="card mt-2">
        <div className="card-header">
          <div className="d-flex align-items-center justify-content-between">
            <div className="titlepage">
              <h3>Home Loan Income List </h3>
            </div>
          </div>
        </div>

        <div className="card-body">
          <div className="table-responsive">
            <Table bordered>
              <thead className="bg-primary text-white">
                <tr>
                  <th>ID</th>
                  <th>Target</th>
                  <th>Direct Income</th>
                  <th>Differential Income after achieve target</th>
                  <th>Level</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {homeRate?.length > 0 ? (
                  homeRate.map((homerate, i) => (
                    <tr key={homerate.id}>
                      <td>{i + 1}</td>
                      <td>{homerate.target}</td>
                      <td>{homerate.direct_income}</td>
                      <td>{homerate.differential_Income_after_achieve_target}</td>
                      <td>{homerate.lavel}</td>
                      <td>
                        <Button onClick={() => handleEditClick(homerate)} className="page-link">
                          <FaEdit />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No Home Loan Income found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </div>

      <Modal show={showMessageModal} onHide={closeCustomMessageModal}>
        <Modal.Header closeButton>
          <Modal.Title>{messageModalContent.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{messageModalContent.text}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeCustomMessageModal}>
            {messageModalContent.type === "confirmation" ? "Cancel" : "Close"}
          </Button>
          {messageModalContent.type === "confirmation" && (
            <Button variant="primary" onClick={() => messageModalContent.confirmAction()}>
              Confirm
            </Button>
          )}
        </Modal.Footer>
      </Modal>


      <Modal show={showEditModal} onHide={closeEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Home Loan Rate</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentRate && (
            <Form onSubmit={updateHomeRate}>
              <Form.Group className="mb-3">
                <Form.Label>Target</Form.Label>
                <Form.Control
                  type="number"
                  value={currentRate.target}
                  onChange={(e) =>
                    setCurrentRate({ ...currentRate, target: e.target.value })
                  }
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Direct Income</Form.Label>
                <Form.Control
                  type="number"
                  value={currentRate.direct_income}
                  onChange={(e) =>
                    setCurrentRate({ ...currentRate, direct_income: e.target.value })
                  }
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Differential Income after achieve target</Form.Label>
                <Form.Control
                  type="number"
                  value={currentRate.differential_Income_after_achieve_target}
                  onChange={(e) =>
                    setCurrentRate({
                      ...currentRate,
                      differential_Income_after_achieve_target: e.target.value,
                    })
                  }
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Level</Form.Label>
                <Form.Control
                  type="number"
                  value={currentRate.lavel}
                  onChange={(e) =>
                    setCurrentRate({ ...currentRate, lavel: e.target.value })
                  }
                  required
                />
              </Form.Group>
            <div className="d-flex justify-content-end">
                <Button variant="primary" type="submit" className="mt-3">
                Update
              </Button>
            </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>

    </div>
  );
}

export default RateList;