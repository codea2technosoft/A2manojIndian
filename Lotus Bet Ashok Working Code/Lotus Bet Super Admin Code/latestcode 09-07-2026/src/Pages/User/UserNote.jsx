import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { addUserNote, getSingleUserNote } from "../../Server/api";
import { Button, Form, Card, Spinner } from "react-bootstrap";
import { BsArrowLeft } from "react-icons/bs";

function UserNote() {
  const { user_id } = useParams(); // URL se user_id
  const navigate = useNavigate();

  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch user note
  const fetchUserNote = async () => {
    setLoading(true);
    try {
      const response = await getSingleUserNote(user_id); // API call

      if (response.data.success && response.data.data) {
        setNote(response.data.data.note || "");
      } else {
        setNote(""); // agar note nahi hai
      }
    } catch (error) {
      console.error("Error fetching note:", error);
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to fetch note",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Initial fetch on component mount
  useEffect(() => {
    if (user_id) {
      fetchUserNote();
    }
  }, [user_id]);

  // 🔹 Save / Update note
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!note.trim()) {
      Swal.fire("Error", "Please enter a note", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await addUserNote(user_id, note);

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          text: response.data.message,
        }).then(() => {
          navigate("/all_users");
        });
      } else {
        Swal.fire(response.data.message);
      }
    } catch (error) {
      console.error("Error saving note:", error);
      Swal.fire(
        "Error",
        error.response?.data?.message || "Unable to save note",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center">
        <h4 c className="card-title mb-0">
          User Note
        </h4>
        <Button variant="light" onClick={() => navigate(-1)}>
          <BsArrowLeft className="me-1" /> Back
        </Button>
      </Card.Header>

      <Card.Body>
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <Form onSubmit={handleSubmit}>
            {/* User ID */}
            <Form.Group className="mb-3">
              <Form.Label>User ID</Form.Label>
              <Form.Control type="text" value={user_id} readOnly />
            </Form.Group>

            {/* Note textarea */}
            <Form.Group className="mb-3">
              <Form.Label>Note</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Enter or edit user note..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </Form.Group>

            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Saving..." : "Save Note"}
            </Button>
          </Form>
        )}
      </Card.Body>
    </Card>
  );
}

export default UserNote;
