
// import React, { useState, useEffect } from "react";
// import { getsportsSummaryReportAll } from "../../Server/api";
// import Toast from "../../User/Toast";
// import { FaSearch } from "react-icons/fa";
// import Loader from "../../Common/Loader";
// import {
//   MdKeyboardDoubleArrowLeft,
//   MdKeyboardDoubleArrowRight,
// } from "react-icons/md";
// import { Col } from "react-bootstrap";
// import { useLocation } from "react-router-dom";

// function SportSummaryReport() {
//   const [transactions, setTransactions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [toast, setToast] = useState({ show: false, message: "", type: "" });

//   // Filters - Default empty (null)
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isSearching, setIsSearching] = useState(false);

//   // Pagination
//   const [itemsPerPage] = useState(10);
//   const [totalItems, setTotalItems] = useState(0);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [hasSearched, setHasSearched] = useState(false);

//   // ✅ Get admin_id from URL
//   const location = useLocation();
//   const getAdminIdFromURL = () => {
//     const path = location.pathname;
//     const parts = path.split('/');
//     const lastPart = parts[parts.length - 1];

//     // Agar last part page name hai toh ignore karo
//     const ignoreList = ["sport-summary-report", "chip-summary", "settlement-report", "pending-bet-history", "bet-history-details"];
//     if (ignoreList.includes(lastPart)) {
//       return null;
//     }

//     return lastPart;
//   };

//   const adminIdFromURL = getAdminIdFromURL();

//   const showToast = (message, type = "success") => {
//     setToast({ show: true, message, type });
//   };

//   const hideToast = () => {
//     setToast({ show: false, message: "", type: "" });
//   };

//   const getPageNumbers = () => {
//     const pageNumbers = [];
//     const maxVisiblePages = 2;

//     if (totalPages <= maxVisiblePages) {
//       for (let i = 1; i <= totalPages; i++) {
//         pageNumbers.push(i);
//       }
//     } else {
//       let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
//       let end = Math.min(totalPages, start + maxVisiblePages - 1);

//       if (end - start + 1 < maxVisiblePages) {
//         start = Math.max(1, end - maxVisiblePages + 1);
//       }

//       for (let i = start; i <= end; i++) {
//         pageNumbers.push(i);
//       }
//     }

//     return pageNumbers;
//   };

//   const fetchSettlementReport = async (
//     from = "",
//     to = "",
//     search = "",
//     page = 1,
//   ) => {
//     try {
//       console.log("🔄 API Call Started...");
//       setLoading(true);
//       setError("");

//       // ✅ Get admin_id - priority: URL > localStorage > default "admin"
//       let admin_id = adminIdFromURL;

//       if (!admin_id) {
//         admin_id = localStorage.getItem("admin_id") || "admin";
//       }

//       const payload = {
//         admin_id: admin_id,
//         from_date: from || null,
//         to_date: to || null,
//         search: search || null,
//         page: page,
//         limit: itemsPerPage,
//       };

//       console.log("📤 Payload:", payload);

//       const response = await getsportsSummaryReportAll(payload);
//       console.log("📥 API Response:", response);

//       if (response?.data?.success === true) {
//         const apiData = response.data;

//         // ✅ Set Transactions - data array directly
//         if (Array.isArray(apiData.data)) {
//           setTransactions(apiData.data);
//           setTotalItems(apiData.data.length);

//           if (apiData.pagination) {
//             setCurrentPage(apiData.pagination.current_page || 1);
//             setTotalPages(apiData.pagination.total_pages || 1);
//             setTotalItems(apiData.pagination.total_records || 0);
//           } else {
//             setTotalPages(Math.ceil(apiData.data.length / itemsPerPage));
//           }
//         } else {
//           setTransactions([]);
//           setTotalItems(0);
//           setTotalPages(1);
//         }

//         setHasSearched(true);
//         setError("");

//       } else {
//         const errorMsg =
//           response?.data?.error?.message || 
//           response?.data?.message ||
//           "Failed to fetch settlement report";
//         setError(errorMsg);
//         showToast(errorMsg, "error");
//       }
//     } catch (err) {
//       console.error("❌ Error:", err);
//       const errorMsg =
//         err.response?.data?.error?.message ||
//         err.response?.data?.message ||
//         err.message ||
//         "Failed to fetch settlement report";
//       setError(errorMsg);
//       showToast(errorMsg, "error");
//     } finally {
//       setLoading(false);
//       setIsSearching(false);
//       console.log("✅ API Call Completed");
//     }
//   };

//   const handleSearch = () => {
//     console.log("🔍 Search clicked");
//     setIsSearching(true);
//     setCurrentPage(1);
//     fetchSettlementReport(fromDate, toDate, searchTerm, 1);
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") {
//       handleSearch();
//     }
//   };

//   // ✅ Initial load - fetch all data with null dates
//   useEffect(() => {
//     console.log("📦 Initial load - fetching all data with null dates");
//     console.log("📍 Admin ID from URL:", adminIdFromURL);
//     fetchSettlementReport(null, null, "", 1);
//   }, []);

//   // ✅ Fetch when page changes
//   useEffect(() => {
//     if (hasSearched && currentPage > 1) {
//       fetchSettlementReport(fromDate, toDate, searchTerm, currentPage);
//     }
//   }, [currentPage]);

//   const handlePrev = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   const handleNext = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const handlePageClick = (page) => {
//     setCurrentPage(page);
//   };

//   if (loading) {
//     return (
//       <div>
//         <div className="card">
//           <div className="card-header bg-primary-yellow">
//             <h3 className="sport card-title mb-0">Sports Summary Report</h3>
//           </div>
//           <div className="card-body">
//             <div className="text-center py-5">
//               <Loader />
//               <p className="mt-2">Loading report data...</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div>
//         <div className="card">
//           <div className="card-header bg-primary-yellow">
//             <h3 className="sport card-title mb-0">Sports Summary Report</h3>
//           </div>
//           <div className="card-body">
//             <div className="text-center py-4">
//               <div className="text-danger mb-3">
//                 <p><strong>Error:</strong> {error}</p>
//               </div>
//               <button 
//                 className="btn btn-primary" 
//                 onClick={() => fetchSettlementReport(null, null, "", 1)}
//               >
//                 Retry
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       {toast.show && (
//         <Toast message={toast.message} type={toast.type} onClose={hideToast} />
//       )}

//       <div className="card">
//         <div className="card-header bg-primary-yellow d-flex justify-content-between align-items-center">
//           <h3 className="sport card-title mb-0 d-flex align-items-center gap-2">
//             Sports Summary Report
//             {/* {adminIdFromURL && (
//               <span className="badge bg-info ms-2">
//                 Admin: {adminIdFromURL}
//               </span>
//             )} */}
//           </h3>
//         </div>

//         <div className="card-body">
//           {/* Date Filters */}
//           <div className="mb-3">
//             <div className="row align-items-center gy-2">
//               <Col md={3} xs={6}>
//                 <input
//                   type="date"
//                   className="form-control form-control-sm"
//                   value={fromDate}
//                   onChange={(e) => setFromDate(e.target.value)}
//                   placeholder="From Date"
//                 />
//               </Col>
//               <Col md={3} xs={6}>
//                 <input
//                   type="date"
//                   className="form-control form-control-sm"
//                   value={toDate}
//                   onChange={(e) => setToDate(e.target.value)}
//                   placeholder="To Date"
//                 />
//               </Col>
//               <Col md={4} xs={8}>
//                 <input
//                   type="text"
//                   className="form-control form-control-sm"
//                   placeholder="Search by sport name..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   onKeyDown={handleKeyPress}
//                   disabled={isSearching}
//                 />
//               </Col>
//               <Col md={2} xs={4}>
//                 <button
//                   className="btn btn-primary btn-sm w-100"
//                   onClick={handleSearch}
//                   disabled={isSearching || loading}
//                 >
//                   {isSearching || loading ? (
//                     <span className="spinner-border spinner-border-sm" role="status">
//                       <span className="visually-hidden">Loading...</span>
//                     </span>
//                   ) : (
//                     <>
//                       <FaSearch /> Search
//                     </>
//                   )}
//                 </button>
//               </Col>
//             </div>
//           </div>

//           {/* Table */}
//           <div className="table-responsive">
//             <table className="table table-striped table-bordered mb-0">
//               <thead className="table-dark">
//                 <tr>
//                   <th>#</th>
//                   <th>SPORTS NAME</th>
//                   <th>TOTAL 100% CLIENTS</th>
//                   <th>TOTAL WIN</th>
//                   <th>TOTAL LOSS</th>
//                   <th>TOTAL STAKE</th>
//                   <th>TOTAL AMOUNT</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {transactions.length > 0 ? (
//                   transactions.map((transaction, index) => {
//                     const serialNo = (currentPage - 1) * itemsPerPage + index + 1;

//                     return (
//                       <tr key={transaction.sr_no || transaction.sport_id || index}>
//                         <td>{serialNo}</td>
//                         <td>
//                           <strong>{transaction.sport_name || 'N/A'}</strong>
//                         </td>
//                         <td>{transaction.total_clients || 0}</td>
//                         <td className="text-success">{transaction.total_win || 0}</td>
//                         <td className="text-danger">{transaction.total_loss || 0}</td>
//                         <td>{transaction.total_stake || 0}</td>
//                         <td>{transaction.total_amount || 0}</td>
//                       </tr>
//                     );
//                   })
//                 ) : (
//                   <tr>
//                     <td colSpan="7" className="text-center py-4">
//                       <div className="text-muted">
//                         No data found
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="d-flex justify-content-center align-items-center mt-4">
//               <div className="paginationall d-flex align-items-center gap-1">
//                 <button 
//                   className="btn btn-sm btn-outline-secondary"
//                   disabled={currentPage === 1 || loading} 
//                   onClick={handlePrev}
//                 >
//                   <MdKeyboardDoubleArrowLeft /> Previous
//                 </button>

//                 <div className="d-flex gap-1">
//                   {getPageNumbers().map((page) => (
//                     <button
//                       key={page}
//                       className={`btn btn-sm ${currentPage === page ? 'btn-primary' : 'btn-outline-secondary'}`}
//                       onClick={() => handlePageClick(page)}
//                       disabled={loading}
//                     >
//                       {page}
//                     </button>
//                   ))}
//                 </div>

//                 <button
//                   className="btn btn-sm btn-outline-secondary"
//                   disabled={currentPage === totalPages || loading}
//                   onClick={handleNext}
//                 >
//                   Next <MdKeyboardDoubleArrowRight />
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Total items info */}
//           {totalItems > 0 && (
//             <div className="text-center text-muted mt-2 small">
//               Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SportSummaryReport;

import React, { useState, useEffect } from "react";
import { getsportsSummaryReportAll } from "../../Server/api";
import Toast from "../../User/Toast";
import { FaSearch } from "react-icons/fa";
import Loader from "../../Common/Loader";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import { Col } from "react-bootstrap";
import { useLocation } from "react-router-dom";

function SportSummaryReport() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  // Filters - Default empty (null)
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Pagination
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);

  // ✅ Grand Total State
  const [grandTotal, setGrandTotal] = useState({
    total_events: 0,
    total_clients: 0,
    total_users: 0,
    total_bets: 0,
    total_stake: 0,
    total_amount: 0,
    total_win: 0,
    total_loss: 0
  });

  // ✅ Get admin_id from URL
  const location = useLocation();
  const getAdminIdFromURL = () => {
    const path = location.pathname;
    const parts = path.split('/');
    const lastPart = parts[parts.length - 1];

    const ignoreList = ["sport-summary-report"];
    if (ignoreList.includes(lastPart)) {
      return null;
    }

    return lastPart;
  };

  const adminIdFromURL = getAdminIdFromURL();

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ show: false, message: "", type: "" });
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 2;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let end = Math.min(totalPages, start + maxVisiblePages - 1);

      if (end - start + 1 < maxVisiblePages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }

      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  };

  const fetchSettlementReport = async (
    from = "",
    to = "",
    search = "",
    page = 1,
  ) => {
    try {
      console.log("🔄 API Call Started...");
      setLoading(true);
      setError("");

      let admin_id = adminIdFromURL;

      if (!admin_id) {
        admin_id = localStorage.getItem("admin_id") || "admin";
      }

      const payload = {
        admin_id: admin_id,
        from_date: from || null,
        to_date: to || null,
        search: search || null,
        page: page,
        limit: itemsPerPage,
      };

      console.log("📤 Payload:", payload);

      const response = await getsportsSummaryReportAll(payload);
      console.log("📥 API Response:", response);

      if (response?.data?.success === true) {
        const apiData = response.data;

        // ✅ Set Grand Total from API response
        if (apiData.grand_total) {
          setGrandTotal({
            total_events: apiData.grand_total.total_events || 0,
            total_clients: apiData.grand_total.total_clients || 0,
            total_users: apiData.grand_total.total_users || 0,
            total_bets: apiData.grand_total.total_bets || 0,
            total_stake: apiData.grand_total.total_stake || 0,
            total_amount: apiData.grand_total.total_amount || 0,
            total_win: apiData.grand_total.total_win || 0,
            total_loss: apiData.grand_total.total_loss || 0,
          });
        }

        // ✅ Set Transactions
        if (Array.isArray(apiData.data)) {
          setTransactions(apiData.data);
          setTotalItems(apiData.data.length);

          if (apiData.pagination) {
            setCurrentPage(apiData.pagination.current_page || 1);
            setTotalPages(apiData.pagination.total_pages || 1);
            setTotalItems(apiData.pagination.total_records || 0);
          } else {
            setTotalPages(Math.ceil(apiData.data.length / itemsPerPage));
          }
        } else {
          setTransactions([]);
          setTotalItems(0);
          setTotalPages(1);
        }

        setHasSearched(true);
        setError("");

      } else {
        const errorMsg =
          response?.data?.error?.message ||
          response?.data?.message ||
          "Failed to fetch settlement report";
        setError(errorMsg);
        showToast(errorMsg, "error");
      }
    } catch (err) {
      console.error("❌ Error:", err);
      const errorMsg =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch settlement report";
      setError(errorMsg);
      showToast(errorMsg, "error");
    } finally {
      setLoading(false);
      setIsSearching(false);
      console.log("✅ API Call Completed");
    }
  };

  const handleSearch = () => {
    console.log("🔍 Search clicked");
    setIsSearching(true);
    setCurrentPage(1);
    fetchSettlementReport(fromDate, toDate, searchTerm, 1);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // ✅ Initial load
  useEffect(() => {
    console.log("📦 Initial load - fetching all data with null dates");
    console.log("📍 Admin ID from URL:", adminIdFromURL);
    fetchSettlementReport(null, null, "", 1);
  }, []);

  // ✅ Fetch when page changes
  useEffect(() => {
    if (hasSearched && currentPage > 1) {
      fetchSettlementReport(fromDate, toDate, searchTerm, currentPage);
    }
  }, [currentPage]);

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div>
        <div className="card">
          <div className="card-header bg-primary-yellow">
            <h3 className="sport card-title mb-0">Sports Summary Report</h3>
          </div>
          <div className="card-body">
            <div className="text-center py-5">
              <Loader />
              <p className="mt-2">Loading report data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="card">
          <div className="card-header bg-primary-yellow">
            <h3 className="sport card-title mb-0">Sports Summary Report</h3>
          </div>
          <div className="card-body">
            <div className="text-center py-4">
              <div className="text-danger mb-3">
                <p><strong>Error:</strong> {error}</p>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => fetchSettlementReport(null, null, "", 1)}
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}

      <div className="card">
        <div className="card-header bg-primary-yellow d-flex justify-content-between align-items-center">
          <h3 className="sport card-title mb-0 d-flex align-items-center gap-2">
            Sports Summary Report
          </h3>
        </div>

        <div className="card-body">
          {/* Date Filters */}
          <div className="mb-3">
            <div className="row align-items-center gy-2">
              <Col md={3} xs={6}>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  placeholder="From Date"
                />
              </Col>
              <Col md={3} xs={6}>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  placeholder="To Date"
                />
              </Col>
              <Col md={4} xs={8}>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Search by sport name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyPress}
                  disabled={isSearching}
                />
              </Col>
              <Col md={2} xs={4}>
                <button
                  className="btn btn-primary btn-sm w-100"
                  onClick={handleSearch}
                  disabled={isSearching || loading}
                >
                  {isSearching || loading ? (
                    <span className="spinner-border spinner-border-sm" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </span>
                  ) : (
                    <>
                      <FaSearch /> Search
                    </>
                  )}
                </button>
              </Col>
            </div>
          </div>

          {/* Table */}
          <div className="table-responsive">
            <table className="table table-striped table-bordered mb-0">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>SPORTS NAME</th>
                  <th>TOTAL</th>
                  <th>100% CLIENTS</th>
                  {/* <th>TOTAL WIN</th>
                  <th>TOTAL LOSS</th>
                  <th>TOTAL STAKE</th> */}

                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? (
                  <>
                    {/* Data Rows */}
                    {transactions.map((transaction, index) => {
                      const serialNo = (currentPage - 1) * itemsPerPage + index + 1;

                      return (
                        <tr key={transaction.sr_no}>
                          <td>{serialNo}</td>
                          <td>
                            <strong>{transaction.sport_name || 'N/A'}</strong>
                          </td>
                          {/* <td>{transaction.total_amount || 0}</td>
                          <td>{transaction.total_clients || 0}</td> */}

                          <td className={
                            transaction.total_amount < 0
                              ? "text-danger"
                              : transaction.total_amount > 0
                                ? "text-success"
                                : ""
                          }>
                            {transaction.total_amount || 0}
                          </td>

                          <td className={
                            transaction.total_clients < 0
                              ? "text-danger"
                              : transaction.total_clients > 0
                                ? "text-success"
                                : ""
                          }>
                            {transaction.total_clients || 0}
                          </td>


                          {/* <td className="text-success">{transaction.total_win || 0}</td>
                          <td className="text-danger">{transaction.total_loss || 0}</td>
                          <td>{transaction.total_stake || 0}</td> */}

                        </tr>
                      );
                    })}

                    {/* ✅ Grand Total Row - at the bottom */}
                    <tr className="table-primary fw-bold">
                      <td colSpan="2" className="text-center">TOTAL</td>
                      {/* <td>{grandTotal.total_amount || 0}</td>
                      <td>{grandTotal.total_clients || 0}</td> */}
                      <td className={grandTotal.total_amount < 0 ? "text-danger" : "text-success"}>
                        {grandTotal.total_amount || 0}
                      </td>

                      <td className={grandTotal.total_clients < 0 ? "text-danger" : "text-success"}>
                        {grandTotal.total_clients || 0}
                      </td>

                      {/* <td className="text-success">{grandTotal.total_win || 0}</td>
                      <td className="text-danger">{grandTotal.total_loss || 0}</td>
                      <td>{grandTotal.total_stake || 0}</td> */}
                      {/* <td></td>
                      <td></td>
                      <td></td> */}

                    </tr>
                  </>
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      <div className="text-muted">
                        No data found
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center align-items-center mt-4">
              <div className="paginationall d-flex align-items-center gap-1">
                <button
                  className="btn btn-sm btn-outline-secondary"
                  disabled={currentPage === 1 || loading}
                  onClick={handlePrev}
                >
                  <MdKeyboardDoubleArrowLeft /> Previous
                </button>

                <div className="d-flex gap-1">
                  {getPageNumbers().map((page) => (
                    <button
                      key={page}
                      className={`btn btn-sm ${currentPage === page ? 'btn-primary' : 'btn-outline-secondary'}`}
                      onClick={() => handlePageClick(page)}
                      disabled={loading}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  className="btn btn-sm btn-outline-secondary"
                  disabled={currentPage === totalPages || loading}
                  onClick={handleNext}
                >
                  Next <MdKeyboardDoubleArrowRight />
                </button>
              </div>
            </div>
          )}

          {/* Total items info */}
          {totalItems > 0 && (
            <div className="text-center text-muted mt-2 small">
              Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SportSummaryReport;