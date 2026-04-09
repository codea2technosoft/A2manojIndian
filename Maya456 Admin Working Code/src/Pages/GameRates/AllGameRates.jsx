import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
const API_BASE = process.env.REACT_APP_API_URL;
function GameRatesPage() {
  const [mainRates, setMainRates] = useState([]);
  const [starlineRates, setStarlineRates] = useState([]);
  const [kingjakportRates, setKingjakportRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const token = localStorage.getItem("token");
  const normalize = (arr) =>
    arr.data.map((item) => ({
      _id: item._id,
      gameType: item.name,
      gameRate: item.game_rate,
      minBid: item.min_bid,
      maxBid: item.max_bid,
    }));

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const [mainRes, starlineRes, kingjakportRes] = await Promise.all([
        fetch(`${API_BASE}/main-market-rate-list`, { headers }),
        fetch(`${API_BASE}/king-starline-market-rate-list`, { headers }),
        fetch(`${API_BASE}/king-jackport-market-rate-list`, { headers }),
      ]);

      if (!mainRes.ok || !starlineRes.ok || !kingjakportRes.ok) {
        throw new Error("Failed to fetch one or more APIs");
      }

      const mainData = await mainRes.json();
      const starlineData = await starlineRes.json();
      const kingjakportData = await kingjakportRes.json();
      setMainRates(normalize(mainData));
      setStarlineRates(normalize(starlineData));
      setKingjakportRates(normalize(kingjakportData));
    } catch (err) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleChange = (setter, data, index, field, value) => {
    if (!/^\d*$/.test(value)) return; // Allow digits only
    const updated = [...data];
    updated[index][field] = value;
    setter(updated);
    const rowId = updated[index]._id;
    const newErrors = { ...errors };
    if (value === "" || value === "0") {
      if (!newErrors[rowId]) newErrors[rowId] = {};
      newErrors[rowId][field] = "Enter only numeric value";
    } else {
      if (newErrors[rowId]) {
        delete newErrors[rowId][field];
        if (Object.keys(newErrors[rowId]).length === 0) {
          delete newErrors[rowId];
        }
      }
    }

    setErrors(newErrors);
  };
  const handleUpdate = async (title, data) => {
    let newErrors = {};
    data.forEach((row) => {
      const rowErrors = {};
      if (!/^\d+$/.test(row.gameRate) || parseInt(row.gameRate, 10) <= 0) {
        rowErrors.gameRate = "Enter a numeric value greater than 0";
      }
      if (!/^\d+$/.test(row.minBid) || parseInt(row.minBid, 10) <= 0) {
        rowErrors.minBid = "Enter a numeric value greater than 0";
      }
      if (!/^\d+$/.test(row.maxBid) || parseInt(row.maxBid, 10) <= 0) {
        rowErrors.maxBid = "Enter a numeric value greater than 0";
      }
      if (Object.keys(rowErrors).length > 0) {
        newErrors[row._id] = rowErrors;
      }
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Swal.fire(
        "Invalid Input",
        "Please verify input value before submitting.",
        "error"
      );
      return;
    }

    let url = "";
    if (title === "Main Game Rates")
      url = `${API_BASE}/main-market-rate-update`;
    else if (title === "King Starline Game Rates")
      url = `${API_BASE}/king-starline-market-rate-update`;
    else if (title === "King Jak Port Game Rates")
      url = `${API_BASE}/king-jackport-market-rate-update`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update " + title);
      await response.json();
      Swal.fire("Success", `${title} Updated Successfully!`, "success");
      await fetchData();
    } catch (err) {
      Swal.fire(
        "Update Failed",
        `Error updating ${title}: ${err.message}`,
        "error"
      );
    }
  };

  const renderTable = (title, data, setter) => (
    <div className="card mt-3">
      <div className="card-header bg-black text-white">
        <div className="card-title">{title}</div>
      </div>
      <div className="card-body">
        {data.length === 0 ? (
          <p>No data available.</p>
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
                    <td>{row.gameType}</td>
                    {["gameRate", "minBid", "maxBid"].map((field) => (
                      <td key={field}>
                        <input
                          type="text"
                          className="form-control"
                          inputMode="numeric"
                          value={row[field]}
                          onChange={(e) =>
                            handleChange(
                              setter,
                              data,
                              index,
                              field,
                              e.target.value
                            )
                          }
                          style={{
                            borderColor: errors[row._id]?.[field]
                              ? "red"
                              : undefined,
                          }}
                          disabled={
                            field === "gameRate" &&
                            (row.name_slug?.trim().toLowerCase() ===
                              "sp_dp_tp" ||
                              Number(row.gameRate) === 5960)
                          }
                        />
                        {errors[row._id]?.[field] && (
                          <div style={{ color: "red", fontSize: "12px" }}>
                            {errors[row._id][field]}
                          </div>
                        )}
                      </td>
                    ))}

                    {/* {["gameRate", "minBid", "maxBid"].map((field) => (
                      <td key={field}>
                        <input
                          type="text"
                          className="form-control"
                          inputMode="numeric"
                          value={row[field]}
                          onChange={(e) =>
                            handleChange(
                              setter,
                              data,
                              index,
                              field,
                              e.target.value
                            )
                          }
                          style={{
                            borderColor: errors[row._id]?.[field]
                              ? "red"
                              : undefined,
                          }}
                        />
                        {errors[row._id]?.[field] && (
                          <div style={{ color: "red", fontSize: "12px" }}>
                            {errors[row._id][field]}
                          </div>
                        )}
                      </td>
                    ))} */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="card-footer d-flex justify-content-end">
        <button
          className="button_submit"
          onClick={() => handleUpdate(title, data)}
        >
          Update
        </button>
      </div>
    </div>
  );

  if (loading) return <div>Loading data...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  return (
    <div>
      {renderTable("Main Game Rates", mainRates, setMainRates)}
      {renderTable("King Starline Game Rates", starlineRates, setStarlineRates)}
      {renderTable(
        "King Jak Port Game Rates",
        kingjakportRates,
        setKingjakportRates
      )}
    </div>
  );
}

export default GameRatesPage;
