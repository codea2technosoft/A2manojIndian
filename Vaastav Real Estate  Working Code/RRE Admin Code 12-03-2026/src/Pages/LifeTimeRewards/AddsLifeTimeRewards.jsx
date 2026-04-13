import React, { useState } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import callingleads from "../../assets/images/life-time-rewards-format.csv";

const API_URL = process.env.REACT_APP_API_URL;

function AddsLifeTimeRewards() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const showCustomMessageModal = (title, text, type, confirmAction = null) => {
    Swal.fire({
      icon: type,
      title: title,
      text: text,
      confirmButtonText: "OK",
    });
  };

  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  const validateForm = () => {
    if (!file) {
      Swal.fire({
        icon: "error",
        title: "No CSV File",
        text: "Please select a CSV file before submitting.",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const token = getAuthToken();
      if (!token) {
        showCustomMessageModal(
          "Authentication Error",
          "Authentication token not found. Please log in.",
          "error"
        );
        return;
      }

      const uploadData = new FormData();
      uploadData.append("lifetimerewardsCsv", file);

      const response = await fetch(`${API_URL}/life-time-offer-create-csv`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        showCustomMessageModal(
          "Error",
          errorData.message || "Failed to create Offer.",
          "error"
        );
        return;
      }

      const result = await response.json();
      if (result.success === "1") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: result.message,
          confirmButtonText: "OK",
        });

        setFile(null);

        setTimeout(() => {
          navigate("/all-offer-gifts");
        }, 2000);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: result.message || "Something went wrong!",
          confirmButtonText: "OK",
        });
      }
    } catch (err) {
      console.error("Error creating offer:", err);
      showCustomMessageModal(
        "Error",
        err.message || "An unexpected error occurred.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-2">
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap">
                <div className="titlepage">
                  <h3>Upload Life Time Rewards</h3>
                </div>

                <div className="d-flex justify-content-between">
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>Download Life Time Rewards/Life Time Rewards Format</Tooltip>}
                  >
                    <a
                      href={callingleads}
                      className="btn btn-primary"
                      download="Lifetime Rewards Creation Format.csv"
                    >
                      Download Excel Format
                    </a>
                  </OverlayTrigger>
                </div>
              </div>
            </div>

            <div className="card-body">
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formFile">
                      <Form.Label>
                        Upload CSV File <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="file"
                        accept=".csv"
                        onChange={(e) => {
                          const selectedFile = e.target.files[0];
                          if (!selectedFile) return;

                          const fileExtension = selectedFile.name
                            .split(".")
                            .pop()
                            .toLowerCase();
                          if (fileExtension !== "csv") {
                            Swal.fire({
                              icon: "error",
                              title: "Invalid File",
                              text: "Only CSV files are allowed!",
                            });
                            e.target.value = null;
                            setFile(null);
                            return;
                          }
                          setFile(selectedFile);
                        }}
                      />
                      <Form.Text className="text-muted">
                        Please upload a CSV file in the correct format.
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="submitbutton">
                  <Button
                    type="submit"
                    className="submitbutton_design mt-2"
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Upload New"}
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default AddsLifeTimeRewards;