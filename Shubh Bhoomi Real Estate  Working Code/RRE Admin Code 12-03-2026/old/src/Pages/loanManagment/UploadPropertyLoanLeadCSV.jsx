import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import Swal from "sweetalert2";

const API_URL = process.env.REACT_APP_API_URL;

function UploadPropertyLoanLeadCSV() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  // File selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  // Drag & drop
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      Swal.fire("Warning", "Please select a CSV file!", "warning");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file); // payload me file bhejna

      const res = await fetch(`${API_URL}/upload-property-lead-csv`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      let data = null;
      try {
        data = await res.json();
      } catch (err) {
        data = null;
      }

      if (res.ok) {
        Swal.fire("Success", data?.message || "CSV uploaded successfully!", "success");
        setFile(null);
      } else {
        Swal.fire("Error", data?.message || "Failed to upload CSV, Internal Server Error, Please Try After Some Time !!!", "error");
      }
    } catch (err) {
      console.error("Error uploading CSV:", err);
      Swal.fire("Error", err.message || "Network error while uploading CSV", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card mt-2">
      <div className="card-header">
        <h3>Upload Property Loan Lead CSV</h3>
      </div>
      <div className="card-body">
        <Form onSubmit={handleSubmit}>
          <div
            className="p-3 mb-3 border text-center"
            style={{ cursor: "pointer" }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              style={{ display: "none" }}
              id="fileInput"
            />
            <label htmlFor="fileInput" style={{ cursor: "pointer" }}>
              {file ? file.name : "Drag & drop CSV here or click to select"}
            </label>
          </div>

          <div className="d-flex justify-content-end">
            <Button type="submit" disabled={loading}>
              {loading ? "Uploading..." : "Upload CSV"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default UploadPropertyLoanLeadCSV;
