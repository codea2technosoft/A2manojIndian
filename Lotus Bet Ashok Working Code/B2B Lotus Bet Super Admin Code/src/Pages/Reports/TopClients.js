// import React, { useState, useEffect } from "react";
// import { getTopClientAll } from "../../Server/api";
// import Toast from "../../User/Toast";
// import { FaSearch } from "react-icons/fa";
// import { Col } from "react-bootstrap";
// import Loader from "../../Common/Loader";

// function TopClients() {
//   const [clients, setClients] = useState([]);
//   const [filteredClients, setFilteredClients] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [toast, setToast] = useState({ show: false, message: "", type: "" });

//   // Filters
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isSearching, setIsSearching] = useState(false);

//   const showToast = (message, type = "success") => {
//     setToast({ show: true, message, type });
//   };

//   const hideToast = () => {
//     setToast({ show: false, message: "", type: "" });
//   };

//   // Set default dates (last 7 days)
//   useEffect(() => {
//     const today = new Date();
//     const sevenDaysAgo = new Date(today);
//     sevenDaysAgo.setDate(today.getDate() - 7);

//     const formatDateInput = (date) => {
//       const year = date.getFullYear();
//       const month = String(date.getMonth() + 1).padStart(2, "0");
//       const day = String(date.getDate()).padStart(2, "0");
//       return `${year}-${month}-${day}`;
//     };

//     setFromDate(formatDateInput(sevenDaysAgo));
//     setToDate(formatDateInput(today));
//   }, []);

//   const fetchTopClients = async (from = "", to = "", search = "") => {
//     try {
//       setLoading(true);
//       setError("");

//       const admin_id = localStorage.getItem("admin_id");
//       const payload = {
//         admin_id: admin_id,
//         from_date: from,
//         to_date: to,
//         search: search, // Server-side search
//       };

//       const response = await getTopClientAll(payload);
//       console.log("API Response:", response);

//       if (response.data && response.data.status === true) {
//         const allClients = response.data.data.transactions || [];
//         setClients(allClients);
//         setFilteredClients(allClients);
//         setError("");
//       } else {
//         const errorMsg =
//           response.data?.error?.message || "Failed to fetch top clients";
//         setError(errorMsg);
//         showToast(errorMsg, "error");
//       }
//     } catch (err) {
//       console.error("Error fetching top clients:", err);
//       const errorMsg =
//         err.response?.data?.error?.message ||
//         err.message ||
//         "Failed to fetch top clients";
//       setError(errorMsg);
//       showToast(errorMsg, "error");
//     } finally {
//       setLoading(false);
//       setIsSearching(false);
//     }
//   };

//   // Handle Search - Server side
//   const handleSearch = () => {
//     setIsSearching(true);
//     if (fromDate && toDate) {
//       fetchTopClients(fromDate, toDate, searchTerm);
//     }
//   };

//   // Handle Enter key
//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") {
//       handleSearch();
//     }
//   };

//   // Fetch when dates change
//   useEffect(() => {
//     if (fromDate && toDate) {
//       setSearchTerm("");
//       fetchTopClients(fromDate, toDate, "");
//     }
//   }, [fromDate, toDate]);

//   // Calculate Grand Total
//   const calculateGrandTotal = () => {
//     return filteredClients.reduce(
//       (sum, client) => sum + (parseFloat(client.total) || 0),
//       0,
//     );
//   };

//   // Format date for display (DD-MM-YYYY)
//   const formatDateDisplay = (dateStr) => {
//     if (!dateStr) return "";
//     const parts = dateStr.split("-");
//     return `${parts[2]}-${parts[1]}-${parts[0]}`;
//   };

//   return (
//     <div>
//       {toast.show && (
//         <Toast message={toast.message} type={toast.type} onClose={hideToast} />
//       )}

//       <div className="card">
//         <div className="card-header bg-primary-yellow d-flex justify-content-between align-items-md-center gap-2">
//           <h3 className="card-title mb-0">Top Clients</h3>
//         </div>

//         <div className="card-body">
//           {/* Date Filters */}
//           <div className="mb-2">
//             <div className="row align-items-center gy-2">
//               <Col xs={6} md={3}>
//                 <input
//                   type="date"
//                   className="form-control form-control-sm"
//                   value={fromDate}
//                   onChange={(e) => setFromDate(e.target.value)}
//                 />
//               </Col>
//               <Col xs={6} md={3}>
//                 <input
//                   type="date"
//                   className="form-control form-control-sm"
//                   value={toDate}
//                   onChange={(e) => setToDate(e.target.value)}
//                 />
//               </Col>
//               <Col xs={6} md={3}>
//               <div className="d-flex gap-1">
//                 <input
//                   type="text"
//                   className="form-control form-control-sm"
//                   style={{ width: "250px" }}
//                   placeholder="Search username..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   onKeyPress={handleKeyPress}
//                   disabled={isSearching}
//                 />
//                  <button
//                   className="btn btn-primary btn-sm"
//                   onClick={handleSearch}
//                   disabled={isSearching}
//                 >
//                   {isSearching ? (
//                     <span
//                       className="spinner-border spinner-border-sm"
//                       role="status"
//                     >
//                       <span className="visually-hidden">Loading...</span>
//                     </span>
//                   ) : (
//                     <>
//                       <FaSearch />
//                     </>
//                   )}
//                 </button>
//                 </div>
//               </Col>
//             </div>
//           </div>

//           {/* Table */}
//           <div className="table-responsive">
//             <table className="table table-bordered mb-0">
//               <thead className="table-dark">
//                 <tr>
//                   <th className="w-50">USERNAME</th>
//                   <th className="w-50">TOTAL</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {loading ? (
//                   <tr>
//                     <td colSpan="2">
//                       <div className="table_loader text-center py-5">
//                         <Loader />
//                       </div>
//                     </td>
//                   </tr>
//                 ) : error ? (
//                   <tr>
//                     <td colSpan="2">
//                       <div className="text-center mt-3">
//                         <div className="text-danger mb-3">
//                           <p>
//                             <strong>Error:</strong> {error}
//                           </p>
//                         </div>
//                         <button
//                           className="btn btn-primary"
//                           onClick={() =>
//                             fetchTopClients(fromDate, toDate, searchTerm)
//                           }
//                         >
//                           Retry
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : filteredClients.length > 0 ? (
//                   <>
//                     {filteredClients.map((client, index) => {
//                       const total = parseFloat(client.total) || 0;
//                       return (
//                         <tr key={index}>
//                           <td>
//                             <strong>{client.username || "N/A"}</strong>
//                           </td>
//                           <td>
//                             <span>{total.toFixed(2)}</span>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                     {/* Grand Total Row */}
//                     <tr className="table-active fw-bold">
//                       <td className="bg-theme">TOTAL</td>
//                       <td className="bg-theme">
//                         <span>{calculateGrandTotal().toFixed(2)}</span>
//                       </td>
//                     </tr>
//                   </>
//                 ) : (
//                   <tr>
//                     <td colSpan="2" className="text-center py-4">
//                       <div className="text-muted">
//                         {searchTerm
//                           ? `No clients found for "${searchTerm}"`
//                           : "No clients found"}
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default TopClients;


import React, { useState, useEffect } from "react";
import { getTopClientAll } from "../../Server/api";
import Toast from "../../User/Toast";
import { FaSearch } from "react-icons/fa";
import { Col } from "react-bootstrap";
import Loader from "../../Common/Loader";

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

  const fetchTopClients = async (from = "", to = "", search = "") => {
    try {
      setLoading(true);
      setError("");

      const admin_id = localStorage.getItem("admin_id");
      
      const payload = { admin_id: admin_id };
      
      // Only add non-empty values
      if (from && from.trim()) payload.from_date = from;
      if (to && to.trim()) payload.to_date = to;
      if (search && search.trim()) payload.search = search;

      const response = await getTopClientAll(payload);
      console.log("API Response:", response);

      if (response.data && response.data.status === true) {
        const allClients = response.data.data.transactions || [];
        setClients(allClients);
        setFilteredClients(allClients);
        setError("");
      } else {
        const errorMsg =
          response.data?.error?.message || "Failed to fetch top clients";
        setError(errorMsg);
        showToast(errorMsg, "error");
      }
    } catch (err) {
      console.error("Error fetching top clients:", err);
      const errorMsg =
        err.response?.data?.error?.message ||
        err.message ||
        "Failed to fetch top clients";
      setError(errorMsg);
      showToast(errorMsg, "error");
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  // Page load par default data fetch karega (sirf admin_id ke saath)
  useEffect(() => {
    fetchTopClients("", "", "");
  }, []);

  // Handle Search - Server side
  const handleSearch = () => {
    setIsSearching(true);
    fetchTopClients(fromDate, toDate, searchTerm);
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Calculate Grand Total
  const calculateGrandTotal = () => {
    return filteredClients.reduce(
      (sum, client) => sum + (parseFloat(client.total) || 0),
      0,
    );
  };

  return (
    <div>
      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}

      <div className="card">
        <div className="card-header bg-primary-yellow d-flex justify-content-between align-items-md-center gap-2">
          <h3 className="card-title mb-0">Top Clients</h3>
        </div>

        <div className="card-body">
          {/* Date Filters */}
          <div className="mb-2">
            <div className="row align-items-center gy-2">
              <Col xs={6} md={3}>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </Col>
              <Col xs={6} md={3}>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </Col>
              <Col xs={6} md={3}>
              <div className="d-flex gap-1">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  style={{ width: "250px" }}
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
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </span>
                  ) : (
                    <>
                      <FaSearch />
                    </>
                  )}
                </button>
                </div>
              </Col>
            </div>
          </div>

          {/* Table */}
          <div className="table-responsive">
            <table className="table table-bordered mb-0">
              <thead className="table-dark">
                <tr>
                  <th className="w-50">USERNAME</th>
                  <th className="w-50">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="2">
                      <div className="table_loader text-center py-5">
                        <Loader />
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="2">
                      <div className="text-center mt-3">
                        <div className="text-danger mb-3">
                          <p>
                            <strong>Error:</strong> {error}
                          </p>
                        </div>
                        <button
                          className="btn btn-primary"
                          onClick={() =>
                            fetchTopClients(fromDate, toDate, searchTerm)
                          }
                        >
                          Retry
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : filteredClients.length > 0 ? (
                  <>
                    {filteredClients.map((client, index) => {
                      const total = parseFloat(client.total) || 0;
                      return (
                        <tr key={index}>
                          <td>
                            <strong>{client.username || "N/A"}</strong>
                          </td>
                          <td>
                            <span>{total.toFixed(2)}</span>
                          </td>
                        </tr>
                      );
                    })}
                    {/* Grand Total Row */}
                    <tr className="table-active fw-bold">
                      <td className="bg-theme">TOTAL</td>
                      <td className="bg-theme">
                        <span>{calculateGrandTotal().toFixed(2)}</span>
                      </td>
                    </tr>
                  </>
                ) : (
                  <tr>
                    <td colSpan="2" className="text-center py-4">
                      <div className="text-muted">
                        {searchTerm
                          ? `No clients found for "${searchTerm}"`
                          : "No clients found"}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopClients;