import React, { useState } from "react";
import { Form, Button, Container, Card, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import callingleads from "../../assets/images/project_creation_format.csv";
import { FaFileDownload } from "react-icons/fa";
const API_URL = process.env.REACT_APP_API_URL;

function CreateProjectByUploadingCSV() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      Swal.fire({
        icon: "error",
        title: "No CSV File",
        text: "Please select a CSV file before submitting.",
      });
      return;
    }
    setLoading(true);
    try {
      const token = getAuthToken();
      if (!token) {
        Swal.fire({
          icon: "error",
          title: "Authentication Error",
          text: "Authentication token not found. Please log in.",
        });
        return;
      }

      const uploadData = new FormData();
      uploadData.append("projectCsv", file); 

      const response = await fetch(`${API_URL}/project-import`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorData.message || "Failed to import associates.",
        });
        return;
      }

      const result = await response.json();

      if (result.status == "success") {
        // Check if any data was actually imported
        if (result.summary && result.summary.imported === 0) {
          Swal.fire({
            icon: "warning",
            title: "No Data Imported",
            text: "Sorry, no data was imported. Please check your CSV file or duplicate entry and try again.",
            confirmButtonText: "OK"
          });
        } else {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: `Successfully imported ${result.summary?.imported || 0} projects!`,
            confirmButtonText: "OK"
          });

          setFile(null);
          document.querySelector('input[type="file"]').value = "";

          setTimeout(() => {
            navigate("/all-project");
          }, 2000);
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: result.message || "Something went wrong!",
          confirmButtonText: "OK"
        });
      }
    } catch (err) {
      console.error("Error importing projects:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "An unexpected error occurred.",
      });
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
              <div className="d-flex align-items-center justify-content-between">
                <div className="titlepage">
                  <h3>Create New Project By Uploading CSV</h3>
                </div>

                <div className="d-flex justify-content-between">
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>Download Create New Project By Uploading CSV Excel Format</Tooltip>}
                  >
                    <a href={callingleads}
                      className="btn btn-primary"
                      download="Project Creation Format.csv"
                    >
                      Download CSV Format
                    </a>
                  </OverlayTrigger>
                </div>
              </div>
            </div>
            <div className="card-body">
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Select CSV File</Form.Label>
                  <Form.Control
                    type="file"
                    accept=".csv"
                    onChange={(e) => {
                      const selectedFile = e.target.files[0];
                      if (!selectedFile) return;

                      const fileExtension = selectedFile.name.split(".").pop().toLowerCase();
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
                    Only CSV files are allowed. Maximum file size: 10MB
                  </Form.Text>
                </Form.Group>

                {file && (
                  <div className="alert alert-info">
                    Selected file: <strong>{file.name}</strong>
                  </div>
                )}

                <div className="submitbutton">
                  <Button
                    type="submit"
                    className="submitbutton_design mt-2"
                    disabled={loading || !file}
                    variant="primary"
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Importing...
                      </>
                    ) : (
                      "Import Projects"
                    )}
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

export default CreateProjectByUploadingCSV;