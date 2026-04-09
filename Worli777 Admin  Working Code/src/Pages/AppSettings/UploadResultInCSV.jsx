import React, { useState, useRef } from "react";
import Swal from "sweetalert2";

function UploadCSV() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith(".csv")) {
      setError("Please select a valid CSV file.");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setError("");
    setFile(selectedFile);
  };
  const handleRemoveFile = () => {
    setFile(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a CSV file before submitting.");
      return;
    }
    const formData = new FormData();
    formData.append("resultCsv", file);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.REACT_APP_API_URL}result-create-csv`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const result = await res.json();
      if (result.success) {
        Swal.fire("Success", "Result Uploaded Successfully!", "Success");
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        Swal.fire("Error", result.message || "Failed to upload result.", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to upload result, please check CSV file and try again.", "error");
    }
  };

  return (
    <div className="card mt-3">
      <div className="card-header bg-color-black">
        <div className="d-flex justify-content-between align-items-center">
          <h3 className="card-title text-white">Upload Bulk Result</h3>
        </div>
      </div>

      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <label className="mt-3 fw-semibold">
            Select CSV File & Upload Bulk Result <span className="text-danger">*</span>
          </label>

          <div className="mb-3">
            <input
              type="file"
              accept=".csv"
              className={`form-control ${error ? "is-invalid" : ""}`}
              onChange={handleFileChange}
              ref={fileInputRef}
            />
            {error && <div className="text-danger small mt-1">{error}</div>}
          </div>

          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary">
              Upload
            </button>
          </div>

          {file && (
            <div className="mt-2 uploaded_file d-flex align-items-center">
              <strong>Selected File :&nbsp;</strong> {file.name}
              <button
                type="button"
                onClick={handleRemoveFile}
                className="btn btn-sm btn-danger ms-2"
                style={{
                  padding: "0 6px",
                  lineHeight: "1",
                  fontWeight: "bold",
                }}
              >
                ×
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default UploadCSV;
