import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

function UploadManualResults() {
  const [fromDate, setFromDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [results, setResults] = useState([]);

  // Get month range based on fromDate
  const getMonthRange = (dateString) => {
    if (!dateString) return { minDate: "", maxDate: "" };
    
    const date = new Date(dateString);
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    return {
      minDate: firstDay.toISOString().split('T')[0],
      maxDate: lastDay.toISOString().split('T')[0]
    };
  };

  const monthRange = getMonthRange(fromDate);

  // Automatically generate fields when both dates are filled
  useEffect(() => {
    if (fromDate && endDate) {
      generateResultsFields();
    }
  }, [fromDate, endDate]);

  // Calculate number of days between two dates and generate inputs
  const generateResultsFields = () => {
    const start = new Date(fromDate);
    const end = new Date(endDate);
    
    if (start > end) {
      Swal.fire({
        icon: "error",
        title: "Invalid Date Range",
        text: "From date cannot be greater than end date!",
      });
      setResults([]);
      return;
    }

    // Check if end date is in same month as from date
    if (start.getMonth() !== end.getMonth() || start.getFullYear() !== end.getFullYear()) {
      Swal.fire({
        icon: "error",
        title: "Invalid Date Range",
        text: "End date must be in the same month as from date!",
      });
      setEndDate("");
      setResults([]);
      return;
    }

    // Calculate difference in days
    const timeDiff = end.getTime() - start.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // +1 to include both start and end dates

    if (daysDiff <= 0) {
      Swal.fire({
        icon: "error",
        title: "Invalid Date Range",
        text: "Please select valid dates!",
      });
      setResults([]);
      return;
    }

    // Generate empty results array for each day
    const newResults = Array.from({ length: daysDiff }, (_, index) => {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + index);
      
      return {
        date: currentDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
        open_digit: "",
        jodi_digit: "",
        close_digit: ""
      };
    });

    setResults(newResults);
  };

  // Handle individual result input change
  const handleResultChange = (index, field, value) => {
    const newResults = [...results];
    newResults[index] = {
      ...newResults[index],
      [field]: value
    };
    setResults(newResults);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validation
    if (!fromDate || !endDate) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please select both from date and end date!",
      });
      return;
    }

    if (results.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please generate result fields by selecting dates!",
      });
      return;
    }

    if (results.some(item => !item.open_digit || !item.jodi_digit || !item.close_digit)) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please fill all Open Digit, Jodi Digit and Close Digit fields!",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      
      // Prepare payload in array format
      const payload = {
        from_date: fromDate,
        end_date: endDate,
        results: results
      };

      console.log("Submitting payload:", payload); // Debug log

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/add-manual-result`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      
      const result = await res.json();
      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: `${results.length} days results added successfully!`,
        });
        // Reset form
        setFromDate("");
        setEndDate("");
        setResults([]);
      } else {
        Swal.fire({
          icon: "error",
          title: "Submission Failed",
          text: result.message || "Something went wrong!",
        });
      }
    } catch (error) {
      console.error("Error adding results:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong while submitting.",
      });
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
  };

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card mt-3">
          <div className="card-header bg-color-black">
            <div className="d-flex justify-content-between align-items-center">
              <h3 className="card-title text-white">Add Manual Results</h3>
            </div>
          </div>
          <div className="card-body">
            <form noValidate onSubmit={handleSubmit}>
              <div className="row">
                {/* Date Inputs */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    From Date<span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    value={fromDate}
                    onChange={(e) => {
                      setFromDate(e.target.value);
                      setEndDate("");
                      setResults([]);
                    }}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    End Date<span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={monthRange.minDate}
                    max={monthRange.maxDate}
                    disabled={!fromDate}
                    required
                  />
                  {fromDate && (
                    <small className="text-muted">
                      Only dates from {formatDate(monthRange.minDate)} to {formatDate(monthRange.maxDate)} are allowed
                    </small>
                  )}
                </div>

                {/* Show number of days info */}
                {results.length > 0 && (
                  <div className="col-md-12 mb-3">
                    <div className="alert alert-info">
                      <strong>{results.length} days</strong> selected between {formatDate(fromDate)} and {formatDate(endDate)}
                    </div>
                  </div>
                )}

                {/* Dynamic Result Inputs - Only show when dates are selected */}
                {results.map((result, index) => (
                  <div key={index} className="col-md-12 mb-4 p-3 border rounded">
                    <div className="row">
                      {/* Result Date - Readonly */}
                      <div className="col-md-12 mb-3">
                        <label className="form-label fw-bold">
                          Result Date<span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control bg-light"
                          value={formatDate(result.date)}
                          readOnly
                        />
                      </div>
                      
                      {/* Open Digit */}
                      <div className="col-md-4 mb-3">
                        <label className="form-label">
                          Open Digit<span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={result.open_digit}
                          onChange={(e) => handleResultChange(index, "open_digit", e.target.value)}
                          placeholder="Enter open digit"
                          maxLength={2}
                          required
                        />
                      </div>
                      
                      {/* Jodi Digit */}
                      <div className="col-md-4 mb-3">
                        <label className="form-label">
                          Jodi Digit<span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={result.jodi_digit}
                          onChange={(e) => handleResultChange(index, "jodi_digit", e.target.value)}
                          placeholder="Enter jodi digit"
                          maxLength={2}
                          required
                        />
                      </div>
                      
                      {/* Close Digit */}
                      <div className="col-md-4 mb-3">
                        <label className="form-label">
                          Close Digit<span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={result.close_digit}
                          onChange={(e) => handleResultChange(index, "close_digit", e.target.value)}
                          placeholder="Enter close digit"
                          maxLength={2}
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <div className="col-md-12">
                  <div className="d-flex justify-content-end">
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={results.length === 0}
                    >
                      Add Results ({results.length} days)
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadManualResults;