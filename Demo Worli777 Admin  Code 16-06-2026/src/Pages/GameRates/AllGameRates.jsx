import React, { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";

const API_BASE = process.env.REACT_APP_API_URL;

function GameRatesPage() {
  const [rates, setRates] = useState({
    main: [],
    starline: [],
    kingjakport: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const token = localStorage.getItem("token");

  // API endpoints configuration
  const endpoints = {
    main: {
      list: `${API_BASE}/main-market-rate-list`,
      update: `${API_BASE}/main-market-rate-update`,
      title: "Main Game Rates"
    },
    starline: {
      list: `${API_BASE}/king-starline-market-rate-list`,
      update: `${API_BASE}/king-starline-market-rate-update`,
      title: "King Starline Game Rates"
    },
    kingjakport: {
      list: `${API_BASE}/king-jackport-market-rate-list`,
      update: `${API_BASE}/king-jackport-market-rate-update`,
      title: "King Jak Port Game Rates"
    }
  };

  // Normalize API response data
  const normalize = (arr) =>
    arr.data.map((item) => ({
      _id: item._id,
      gameType: item.name,
      gameRate: item.game_rate?.toString() || "",
      minBid: item.min_bid?.toString() || "",
      maxBid: item.max_bid?.toString() || "",
      name_slug: item.name_slug || ""
    }));

  // Fetch all data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const requests = Object.values(endpoints).map(endpoint =>
        fetch(endpoint.list, { headers }).then(res => {
          if (!res.ok) {
            throw new Error(`Failed to fetch ${endpoint.title}`);
          }
          return res.json();
        })
      );

      const results = await Promise.allSettled(requests);
      
      const newRates = {};
      results.forEach((result, index) => {
        const key = Object.keys(endpoints)[index];
        if (result.status === 'fulfilled') {
          newRates[key] = normalize(result.value);
        } else {
          console.error(`Failed to fetch ${endpoints[key].title}:`, result.reason);
          newRates[key] = [];
        }
      });

      setRates(newRates);
      
      // Check if all requests failed
      const failedRequests = results.filter(r => r.status === 'rejected');
      if (failedRequests.length === results.length) {
        setError("Failed to load all game rates. Please try again.");
      }
      
    } catch (err) {
      setError(err.message || "An unknown error occurred");
      Swal.fire("Error", "Failed to load game rates", "error");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle input changes with validation
  const handleChange = (type, index, field, value) => {
    // Allow only numbers and empty string
    if (!/^\d*$/.test(value)) return;
    
    setRates(prev => {
      const updated = [...prev[type]];
      updated[index] = { ...updated[index], [field]: value };
      
      return { ...prev, [type]: updated };
    });

    // Validate the field
    const rowId = rates[type][index]._id;
    setErrors(prev => {
      const newErrors = { ...prev };
      const rowErrors = newErrors[rowId] || {};
      
      if (value === "" || value === "0") {
        rowErrors[field] = "Enter a numeric value greater than 0";
      } else if (!/^\d+$/.test(value)) {
        rowErrors[field] = "Enter only numeric value";
      } else if (parseInt(value, 10) <= 0) {
        rowErrors[field] = "Value must be greater than 0";
      } else {
        delete rowErrors[field];
      }
      
      if (Object.keys(rowErrors).length > 0) {
        newErrors[rowId] = rowErrors;
      } else if (newErrors[rowId]) {
        delete newErrors[rowId];
      }
      
      return newErrors;
    });
  };

  // Validate all rows before submission
  const validateRows = (data) => {
    const newErrors = {};
    
    data.forEach((row) => {
      const rowErrors = {};
      const fields = ['gameRate', 'minBid', 'maxBid'];
      
      fields.forEach(field => {
        const value = row[field];
        if (!value || value === "" || !/^\d+$/.test(value) || parseInt(value, 10) <= 0) {
          rowErrors[field] = "Enter a numeric value greater than 0";
        }
      });
      
      if (Object.keys(rowErrors).length > 0) {
        newErrors[row._id] = rowErrors;
      }
    });
    
    return newErrors;
  };

  // Handle update for specific rate type
  const handleUpdate = async (type) => {
    const data = rates[type];
    const endpoint = endpoints[type];
    
    // Validate all rows
    const validationErrors = validateRows(data);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      Swal.fire(
        "Invalid Input",
        "Please correct all errors before submitting.",
        "error"
      );
      return;
    }

    try {
      const response = await fetch(endpoint.update, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to update ${endpoint.title}`);
      }

      await response.json();
      Swal.fire("Success", `${endpoint.title} Updated Successfully!`, "success");
      
      // Refresh data
      await fetchData();
      
      // Clear errors for this update
      const updatedErrors = { ...errors };
      data.forEach(row => {
        delete updatedErrors[row._id];
      });
      setErrors(updatedErrors);
      
    } catch (err) {
      Swal.fire(
        "Update Failed",
        err.message || `Error updating ${endpoint.title}`,
        "error"
      );
    }
  };

  // Render table for a specific rate type
  const renderTable = (type) => {
    const data = rates[type];
    const { title } = endpoints[type];
    
    return (
      <div className="card">
        <div className="card-header bg-black text-white">
          <div className="card-title">{title}</div>
        </div>
        <div className="card-body">
          {data.length === 0 ? (
            <p className="text-muted">No data available.</p>
          ) : (
            <div className="table-responsive">
              <table className="table border">
                <thead>
                  <tr>
                    <th>Game Type</th>
                    <th>Game Rate</th>
                    <th>Min Bid</th>
                    <th>Max Bid</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, index) => (
                    <tr key={row._id || index}>
                      <td className="align-middle">{row.gameType}</td>
                      {["gameRate", "minBid", "maxBid"].map((field) => (
                        <td key={field}>
                          <input
                            type="text"
                            className={`form-control ${
                              errors[row._id]?.[field] ? "is-invalid" : ""
                            }`}
                            inputMode="numeric"
                            value={row[field]}
                            onChange={(e) =>
                              handleChange(type, index, field, e.target.value)
                            }
                            disabled={
                              field === "gameRate" &&
                              (row.name_slug?.trim().toLowerCase() === "sp_dp_tp" ||
                                Number(row.gameRate) === 5960)
                            }
                            placeholder={`Enter ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`}
                          />
                          {errors[row._id]?.[field] && (
                            <div className="invalid-feedback d-block">
                              {errors[row._id][field]}
                            </div>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="card-footer d-flex justify-content-end">
          <button
            className="btn btn-primary"
            onClick={() => handleUpdate(type)}
            disabled={Object.keys(errors).length > 0 || data.length === 0}
          >
            Update {title}
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <span className="ms-3">Loading game rates...</span>
      </div>
    );
  }

  if (error && Object.values(rates).every(arr => arr.length === 0)) {
    return (
      <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading">Error Loading Data</h4>
        <p>{error}</p>
        <button className="btn btn-outline-danger" onClick={fetchData}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container-fluid py-3">
      {error && (
        <div className="alert alert-warning alert-dismissible fade show" role="alert">
          <strong>Warning:</strong> {error}
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}
      
      {renderTable("main")}
      {renderTable("starline")}
      {/* {renderTable("kingjakport")} */}
    </div>
  );
}

export default GameRatesPage;