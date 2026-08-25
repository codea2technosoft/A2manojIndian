// import React, { useState, useEffect } from "react";
// import { getsChipSummaryReportAll } from "../../Server/api";
// import Toast from "../../User/Toast";
// import { FaSearch } from "react-icons/fa";
// import Loader from "../../Common/Loader";
// import {
//   MdKeyboardDoubleArrowLeft,
//   MdKeyboardDoubleArrowRight,
// } from "react-icons/md";
// import { Col } from "react-bootstrap";

// function ChipSummary() {
//   const [transactions, setTransactions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [toast, setToast] = useState({ show: false, message: "", type: "" });
//   const [summary, setSummary] = useState({ lena: 0, dena: 0, balance: 0 });

//   // Filters
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isSearching, setIsSearching] = useState(false);

//   // Pagination
//   const [itemsPerPage] = useState(10);
//   const [totalItems, setTotalItems] = useState(0);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

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

//  const fetchSettlementReport = async (
//   from = "",
//   to = "",
//   search = "",
//   page = 1,
// ) => {
//   try {
//     setLoading(true);
//     setError("");

//     // ✅ URL se admin_id lo
//     const getAdminIdFromURL = () => {
//       const path = window.location.pathname;
//       const parts = path.split('/');
//       const lastPart = parts[parts.length - 1];
      
//       // Agar last part "chip-summary" hai toh ignore karo
//       if (lastPart === "chip-summary" || lastPart === "settlement-report" || lastPart === "pending-bet-history" || lastPart === "bet-history-details") {
//         return null;
//       }
      
//       return lastPart;
//     };
    
//     const admin_id_from_url = getAdminIdFromURL();
//     const admin_id = admin_id_from_url || localStorage.getItem("admin_id") || "admin";

//     const payload = {
//       admin_id: admin_id, // ✅ ab sahi value aayegi
//       from_date: from,
//       to_date: to,
//       search: search,
//       page: page,
//       limit: itemsPerPage,
//     };

//     console.log("Payload:", payload); // 👈 Check karo

//     const response = await getsChipSummaryReportAll(payload);
//       console.log("API Response:", response);

//       if (response.data && response.data.success === true) {
//         // Set summary
//         setSummary({
//           lena: Number(response.data?.lena || 0),
//           dena: Number(response.data?.dena || 0),
//           balance: Number(response.data?.balance || 0),
//         });

//         // Set transactions
//         setTransactions(response.data?.data?.data || []);

//         setCurrentPage(response.data?.data?.current_page || 1);
//         setTotalPages(response.data?.data?.last_page || 1);
//         setTotalItems(response.data?.data?.total || 0);
//         setError("");
//       } else {
//         const errorMsg =
//           response.data?.error?.message || "Failed to fetch settlement report";
//         setError(errorMsg);
//         showToast(errorMsg, "error");
//       }
//     } catch (err) {
//       console.error("Error fetching settlement report:", err);
//       const errorMsg =
//         err.response?.data?.error?.message ||
//         err.message ||
//         "Failed to fetch settlement report";
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
//     setCurrentPage(1);
//     if (fromDate && toDate) {
//       fetchSettlementReport(fromDate, toDate, searchTerm, 1);
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
//       setCurrentPage(1);
//       fetchSettlementReport(fromDate, toDate, "", 1);
//     }
//   }, [fromDate, toDate]);

//   // Fetch when page changes
//   useEffect(() => {
//     if (fromDate && toDate) {
//       fetchSettlementReport(fromDate, toDate, searchTerm, currentPage);
//     }
//   }, [currentPage]);

//   // Pagination Handlers
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

//   const formatDateTime = (dateTime) => {
//     if (!dateTime) return "-";

//     const date = new Date(dateTime);

//     if (isNaN(date.getTime())) return "-";

//     return date.toLocaleString("en-GB", {
//       day: "2-digit",
//       month: "2-digit",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//       second: "2-digit",
//       hour12: true,
//     });
//   };

//   // Get description
//   const getDescription = (transaction) => {
//     if (transaction.comment) return transaction.comment;
//     if (transaction.remarks) return transaction.remarks;
//     if (transaction.send_to_admin_id)
//       return `To: ${transaction.send_to_admin_id}`;
//     return "N/A";
//   };

//   const handlePageClick = (page) => {
//     setCurrentPage(page);
//   };
//   // Get type
//   const getType = (transaction) => {
//     if (transaction.pay_type === "liya") return "Liya";
//     if (transaction.pay_type === "dena") return "Dena";
//     if (transaction.type) return transaction.type;
//     return "Cash";
//   };

//   // Get amount
//   const getAmount = ({ debit = 0, credit = 0 }) => {
//     if (Number(debit) > 0) return -Number(debit);
//     if (Number(credit) > 0) return Number(credit);
//     return 0;
//   };

//   // Get D/C
//   const getDC = ({ debit = 0, credit = 0 }) => {
//     if (Number(debit) > 0) return "Debit";
//     if (Number(credit) > 0) return "Credit";
//     return "-";
//   };

//   // if (loading)
//   //   return (
//   //     <div className="text-center mt-3">
//   //       <p className="mt-2">Loading games...</p>
//   //       <Loader />
//   //     </div>
//   //   );

//   // if (error)
//   //   return (
//   //     <div className="text-center mt-3">
//   //       <div className="text-danger mb-3">
//   //         <p>
//   //           <strong>Error:</strong> {error}
//   //         </p>
//   //         <p className="text-muted small">Sport ID: {sportId}</p>
//   //         {apiResponse && (
//   //           <pre
//   //             className="text-start bg-light p-2 rounded"
//   //             style={{ fontSize: "12px", maxHeight: "200px", overflow: "auto" }}
//   //           >
//   //             {JSON.stringify(apiResponse, null, 2)}
//   //           </pre>
//   //         )}
//   //       </div>
//   //       <button className="btn btn-primary" onClick={fetchGames}>
//   //         Retry
//   //       </button>
//   //     </div>
//   //   );

//   return (
//     <div>
//       {toast.show && (
//         <Toast message={toast.message} type={toast.type} onClose={hideToast} />
//       )}

//       <div className="card">
//         <div className="card-header d-flex bg-primary-yellow justify-content-between align-items-center">
//           <h3 className="sport card-title mb-0 d-flex align-items-center gap-2">
//             Chip Summary
//           </h3>
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
//               {/* <Col md={3}>
//                 <input
//                   type="text"
//                   className="form-control form-control-sm"
//                   style={{ width: "250px" }}
//                   placeholder="Search..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter") {
//                       handleSearch();
//                     }
//                   }}
//                   disabled={isSearching}
//                 />
//               </Col> */}
//               <Col md={2}>
//                 <button
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
//               </Col>
//             </div>
//           </div>

//           {/* Table */}
//           <div className="table-responsive">
//             <table className="table table-striped table-bordered mb-0">
//               {/* <thead className="table-dark">
//                 <tr>
//                   <th>NO</th>
//                   <th>SPORTS NAME</th>
//                   <th>TOTAL</th>
//                   <th>100% CLIENTS</th>
//                 </tr>
//               </thead> */}
//               <tbody>
//                 {/* {loading ? ( */}
//                   <tr>
//                     <td colSpan="4">
//                       <div className="table_loader text-center py-5">
//                         <Loader />
//                       </div>
//                     </td>
//                   </tr>
//                 {/* ) 
//                 : error ? (
//                   <tr>
//                     <td colSpan="4">
//                       <div className="text-center mt-3">
//                         <div className="text-danger mb-3">
//                           <p>
//                             <strong>Error:</strong> {error}
//                           </p>
//                         </div>
//                         <button
//                           className="btn btn-primary"
//                           onClick={() =>
//                             fetchSettlementReport(
//                               fromDate,
//                               toDate,
//                               searchTerm,
//                               currentPage,
//                             )
//                           }
//                         >
//                           Retry
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : transactions.length > 0 ? (
//                   transactions.map((transaction, index) => {
//                     const amount = getAmount(transaction);
//                     const isDebit = amount < 0;
//                     const serialNo =
//                       (currentPage - 1) * itemsPerPage + index + 1;

//                     return (
//                       <tr key="">
//                         <td>{serialNo}</td>
//                         <td>-</td>
//                         <td>-</td>
//                         <td>
//                           <span>-</span>
//                         </td>
//                       </tr>
//                     );
//                   })
//                 ) : (
//                   <tr>
//                     <td colSpan="4" className="text-center py-4">
//                       <div className="text-muted">
//                         {searchTerm
//                           ? `No transactions found for "${searchTerm}"`
//                           : "No transactions found"}
//                       </div>
//                     </td>
//                   </tr>
//                 )
//                 } */}
//               </tbody>
//             </table>
//           </div>

//           {totalPages > 0 && (
//             <div className="d-flex justify-content-center align-items-center mt-4">
//               <div className="paginationall d-flex align-items-center gap-1">
//                 <button disabled={currentPage === 1} onClick={handlePrev}>
//                   <MdKeyboardDoubleArrowLeft /> Previous
//                 </button>

//                 <div className="d-flex gap-1">
//                   {getPageNumbers().map((page) => (
//                     <div
//                       key={page}
//                       className={`paginationnumber ${currentPage === page ? "active" : ""}`}
//                       onClick={() => handlePageClick(page)}
//                     >
//                       {page}
//                     </div>
//                   ))}
//                 </div>

//                 <button
//                   disabled={currentPage === totalPages}
//                   onClick={handleNext}
//                 >
//                   Next <MdKeyboardDoubleArrowRight />
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ChipSummary;

import React, { useState, useEffect } from "react";
import { getsChipSummaryReportAll } from "../../Server/api";
import Toast from "../../User/Toast";
import { FaSearch } from "react-icons/fa";
import Loader from "../../Common/Loader";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import { Col } from "react-bootstrap";
import { useLocation } from "react-router-dom";

function ChipSummary() {
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

  // ✅ Chip Data State
  const [chipData, setChipData] = useState({
    username: "",
    admin_id: "",
    coins: 0,
    total_amount: 0
  });

  // ✅ Get admin_id from URL
  const location = useLocation();
  const getAdminIdFromURL = () => {
    const path = location.pathname;
    const parts = path.split('/');
    const lastPart = parts[parts.length - 1];
    
    const ignoreList = ["chip-summary", "settlement-report", "pending-bet-history", "bet-history-details", "sport-summary-report"];
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

  const fetchChipSummary = async (
    from = "",
    to = "",
    search = "",
    page = 1,
  ) => {
    try {
      console.log("🔄 API Call Started...");
      setLoading(true);
      setError("");

      // ✅ Get admin_id - priority: URL > localStorage > default "admin"
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

      const response = await getsChipSummaryReportAll(payload);
      console.log("📥 API Response:", response);

      if (response?.data?.success === true) {
        const apiData = response.data;

        // ✅ Set Chip Data from API response
        if (apiData.data) {
          setChipData({
            username: apiData.data.username || "",
            admin_id: apiData.data.admin_id || "",
            coins: apiData.data.coins || 0,
            total_amount: apiData.data.total_amount || 0
          });
        }

        // ✅ Set Transactions (if multiple records, otherwise use single data)
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
        } else if (apiData.data && typeof apiData.data === 'object') {
          // If single object response, convert to array for display
          setTransactions([apiData.data]);
          setTotalItems(1);
          setTotalPages(1);
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
          "Failed to fetch chip summary";
        setError(errorMsg);
        showToast(errorMsg, "error");
      }
    } catch (err) {
      console.error("❌ Error:", err);
      const errorMsg =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch chip summary";
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
    fetchChipSummary(fromDate, toDate, searchTerm, 1);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // ✅ Initial load - fetch all data with null dates
  useEffect(() => {
    console.log("📦 Initial load - fetching all data with null dates");
    console.log("📍 Admin ID from URL:", adminIdFromURL);
    fetchChipSummary(null, null, "", 1);
  }, []);

  // ✅ Fetch when page changes
  useEffect(() => {
    if (hasSearched && currentPage > 1) {
      fetchChipSummary(fromDate, toDate, searchTerm, currentPage);
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
            <h3 className="sport card-title mb-0">Chip Summary</h3>
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
            <h3 className="sport card-title mb-0">Chip Summary</h3>
          </div>
          <div className="card-body">
            <div className="text-center py-4">
              <div className="text-danger mb-3">
                <p><strong>Error:</strong> {error}</p>
              </div>
              <button 
                className="btn btn-primary" 
                onClick={() => fetchChipSummary(null, null, "", 1)}
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
            Chip Summary
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
                  placeholder="Search..."
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
                  <th>USERNAME</th>
                  {/* <th>ADMIN ID</th> */}
                  <th>COINS</th>
                  <th>TOTAL AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? (
                  transactions.map((item, index) => {
                    const serialNo = (currentPage - 1) * itemsPerPage + index + 1;
                    
                    return (
                      <tr key={item._id || index}>
                        <td>{serialNo}</td>
                        <td>
                          <strong>{item.username || 'N/A'}</strong>
                        </td>
                        {/* <td>{item.admin_id || 'N/A'}</td> */}
                        <td>{item.coins || 0}</td>
                        <td className={item.total_amount >= 0 ? 'text-success fw-bold' : 'text-danger fw-bold'}>
                          {item.total_amount.toFixed(2) || 0}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      <div className="text-muted">
                        {hasSearched ? "No data found" : "Please click Search to view report"}
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

export default ChipSummary;
