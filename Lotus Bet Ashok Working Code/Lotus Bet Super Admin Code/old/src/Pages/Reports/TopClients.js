import React, { useState, useEffect } from "react";
import { getTopClientAll } from "../../Server/api";
import Toast from "../../User/Toast";
import { FaSearch } from "react-icons/fa";

function TopClients() {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  // Filters
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ show: false, message: "", type: "" });
  };

  // Set default dates (last 7 days)
  useEffect(() => {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const formatDateInput = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    setFromDate(formatDateInput(sevenDaysAgo));
    setToDate(formatDateInput(today));
  }, []);

  const fetchTopClients = async (from = "", to = "", search = "") => {
    try {
      setLoading(true);
      setError("");

      const admin_id = localStorage.getItem("admin_id");
      const payload = {
        admin_id: admin_id,
        from_date: from,
        to_date: to,
        search: search // Server-side search
      };

      const response = await getTopClientAll(payload);
      console.log("API Response:", response);

      if (response.data && response.data.status === true) {
        const allClients = response.data.data.transactions || [];
        setClients(allClients);
        setFilteredClients(allClients);
        setError("");
      } else {
        const errorMsg = response.data?.error?.message || "Failed to fetch top clients";
        setError(errorMsg);
        showToast(errorMsg, "error");
      }
    } catch (err) {
      console.error("Error fetching top clients:", err);
      const errorMsg = err.response?.data?.error?.message || err.message || "Failed to fetch top clients";
      setError(errorMsg);
      showToast(errorMsg, "error");
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  // Handle Search - Server side
  const handleSearch = () => {
    setIsSearching(true);
    if (fromDate && toDate) {
      fetchTopClients(fromDate, toDate, searchTerm);
    }
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Fetch when dates change
  useEffect(() => {
    if (fromDate && toDate) {
      setSearchTerm("");
      fetchTopClients(fromDate, toDate, "");
    }
  }, [fromDate, toDate]);

  // Calculate Grand Total
  const calculateGrandTotal = () => {
    return filteredClients.reduce((sum, client) => sum + (parseFloat(client.total) || 0), 0);
  };

  // Format date for display (DD-MM-YYYY)
  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return "";
    const parts = dateStr.split('-');
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  if (loading) {
    return (
      <div className="text-center mt-3">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading top clients...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-3">
        <div className="text-danger mb-3">
          <p><strong>Error:</strong> {error}</p>
        </div>
        <button className="btn btn-primary" onClick={() => fetchTopClients(fromDate, toDate, searchTerm)}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="mt-3">
      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}

      <div className="card">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">Top Clients</h4>
        </div>

        <div className="card-body">
          {/* Date Filters */}
          <div className="mb-2">
            <div className="d-flex align-items-center gap-2">
              <input
                type="date"
                className="form-control form-control-sm"
                style={{ width: '150px' }}
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
              <input
                type="date"
                className="form-control form-control-sm"
                style={{ width: '150px' }}
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
          </div>



          {/* Search - Server Side */}
          <div className="mb-3">
            <div className="d-flex align-items-center gap-2">
              <input
                type="text"
                className="form-control form-control-sm"
                style={{ width: '250px' }}
                placeholder="Search username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isSearching}
              />
              <button
                className="btn btn-primary btn-sm"
                onClick={handleSearch}
                disabled={isSearching}
              >
                {isSearching ? (
                  <span className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </span>
                ) : (
                  <><FaSearch /> Search</>
                )}
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="table-responsive">
            <table className="table table-bordered mb-0">
              <thead className="table-dark">
                <tr>
                  <th>USERNAME</th>
                  <th className="text-end">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.length > 0 ? (
                  <>
                    {filteredClients.map((client, index) => {
                      const total = parseFloat(client.total) || 0;
                      return (
                        <tr key={index}>
                          <td>
                            <strong>{client.username || "N/A"}</strong>
                          </td>
                          <td className="text-end">
                            <span className={total < 0 ? "text-danger" : "text-success"}>
                              {total.toFixed(2)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    {/* Grand Total Row */}
                    <tr className="table-active fw-bold">
                      <td>GRAND TOTAL</td>
                      <td className="text-end">
                        <span className={calculateGrandTotal() < 0 ? "text-danger" : "text-success"}>
                          {calculateGrandTotal().toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  </>
                ) : (
                  <tr>
                    <td colSpan="2" className="text-center py-4">
                      <div className="text-muted">
                        {searchTerm ? `No clients found for "${searchTerm}"` : "No clients found"}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style jsx>{`
        .card-header {
          background-color: #007bff !important;
        }
        .table-active {
          background-color: #f8f9fa !important;
        }
        .form-control:focus {
          box-shadow: none;
          border-color: #ced4da;
        }
        .form-control-sm {
          font-size: 0.875rem;
        }
        @media (max-width: 576px) {
          .d-flex.align-items-center.gap-2 {
            flex-direction: column;
            align-items: stretch !important;
          }
          .form-control {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}

export default TopClients;