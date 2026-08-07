// import React, { useState, useEffect } from "react";
// import { getSettlementReporttAll } from "../../Server/api";
// import Toast from "../../User/Toast";
// import { FaSearch } from "react-icons/fa";
// import Loader from "../../Common/Loader";
// import {
//   MdKeyboardDoubleArrowLeft,
//   MdKeyboardDoubleArrowRight,
// } from "react-icons/md";
// import { Col } from "react-bootstrap";
// // ❌ useParams HATAA DO
// // import { useParams } from "react-router-dom";

// function SettlementReport() {
//   const [transactions, setTransactions] = useState([]);
//   const [loading, setLoading] = useState(true);
  
//   // ✅ URL se direct admin_id lo - YE FUNCTION DEFINE KARO
//   const getAdminIdFromURL = () => {
//   const path = window.location.pathname;
//   const parts = path.split('/');
//   const lastPart = parts[parts.length - 1];
  
//   // ✅ Agar last part me "SM" ya "MA" ya "US" ya "AG" hai toh valid ID hai
//   if (lastPart && (lastPart.startsWith("SM") || lastPart.startsWith("MA") || lastPart.startsWith("US") || lastPart.startsWith("AG") || lastPart.startsWith("SA"))) {
//     return lastPart;
//   }
  
//   return null;
// };
  
// const admin_id = getAdminIdFromURL() || localStorage.getItem("admin_id") || "admin";
  
//   console.log("admin_id from URL:", admin_id); // 👈 Check karo

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

//   const fetchSettlementReport = async (
//     from = "",
//     to = "",
//     search = "",
//     page = 1,
//   ) => {
//     try {
//       setLoading(true);
//       setError("");

//       const payload = {
//         admin_id: admin_id, // ✅ ab sahi value aayegi
//         from_date: from,
//         to_date: to,
//         search: search,
//         page: page,
//         limit: itemsPerPage,
//       };

//       console.log("Payload:", payload); // 👈 Check karo

//       const response = await getSettlementReporttAll(payload);
//       console.log("API Response:", response);

//       if (response.data && response.data.success === true) {
//         setSummary({
//           lena: Number(response.data?.lena || 0),
//           dena: Number(response.data?.dena || 0),
//           balance: Number(response.data?.balance || 0),
//         });

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

//   return (
//     <div>
//       {toast.show && (
//         <Toast message={toast.message} type={toast.type} onClose={hideToast} />
//       )}

//       <div className="card">
//         <div className="card-header d-flex bg-primary-yellow justify-content-between align-items-center">
//           <h3 className="sport card-title mb-0 d-flex align-items-center gap-2">
//             Settlement Report
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
//               <Col xs={12} md={4}>
//                 <div className="d-flex align-items-center gap-1">
//                   <input
//                     type="text"
//                     className="form-control form-control-sm"
//                     style={{ width: "250px" }}
//                     placeholder="Search..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     onKeyDown={(e) => {
//                       if (e.key === "Enter") {
//                         handleSearch();
//                       }
//                     }}
//                     disabled={isSearching}
//                   />
//                   <button
//                     className="btn btn-primary btn-sm"
//                     onClick={handleSearch}
//                     disabled={isSearching}
//                   >
//                     {isSearching ? (
//                       <span
//                         className="spinner-border spinner-border-sm"
//                         role="status"
//                       >
//                         <span className="visually-hidden">Loading...</span>
//                       </span>
//                     ) : (
//                       <>
//                         <FaSearch />
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </Col>
//             </div>
//           </div>

//           {/* Table */}
//           <div className="table-responsive">
//             <table className="table table-striped table-bordered mb-0">
//               <thead className="table-dark">
//                 <tr>
//                   <th>NO</th>
//                   <th>DESC</th>
//                   <th>TYPE</th>
//                   <th>AMOUNT</th>
//                   <th>D/C</th>
//                   <th>NOTE</th>
//                   <th>TIME/DATE</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {loading ? (
//                   <tr>
//                     <td colSpan="7">
//                       <div className="table_loader text-center py-5">
//                         <Loader />
//                       </div>
//                     </td>
//                   </tr>
//                 ) : error ? (
//                   <tr>
//                     <td colSpan="7">
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
//                       <tr key={transaction._id ?? index}>
//                         <td>{serialNo}</td>
//                         <td>{getDescription(transaction)}</td>
//                         <td>{getType(transaction)}</td>
//                         <td>
//                           <span>{Math.abs(amount).toFixed(2)}</span>
//                         </td>
//                         <td>
//                           <span>{getDC(transaction)}</span>
//                         </td>
//                         <td>{transaction.collection_name || "-"}</td>
//                         <td>{formatDateTime(transaction.created_at)}</td>
//                       </tr>
//                     );
//                   })
//                 ) : (
//                   <tr>
//                     <td colSpan="7" className="text-center py-4">
//                       <div className="text-muted">
//                         {searchTerm
//                           ? `No transactions found for "${searchTerm}"`
//                           : "No transactions found"}
//                       </div>
//                     </td>
//                   </tr>
//                 )}
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

// export default SettlementReport;

import React, { useState, useEffect } from "react";
import { getSettlementReporttAll } from "../../Server/api";
import Toast from "../../User/Toast";
import { FaSearch } from "react-icons/fa";
import Loader from "../../Common/Loader";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import { Col } from "react-bootstrap";

function SettlementReport() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const getAdminIdFromURL = () => {
    const path = window.location.pathname;
    const parts = path.split('/');
    const lastPart = parts[parts.length - 1];
    
    if (lastPart && (lastPart.startsWith("SM") || lastPart.startsWith("MA") || lastPart.startsWith("US") || lastPart.startsWith("AG") || lastPart.startsWith("SA"))) {
      return lastPart;
    }
    return null;
  };
  
  const admin_id = getAdminIdFromURL() || localStorage.getItem("admin_id") || "admin";
  
  console.log("admin_id from URL:", admin_id);

  const [error, setError] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [summary, setSummary] = useState({ lena: 0, dena: 0, balance: 0 });

  // ✅ CHANGE 1: Dates ko EMPTY (null) rakho
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Pagination
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ show: false, message: "", type: "" });
  };

  // ✅ CHANGE 2: Default dates wala useEffect HATAYO (comment karo)
  // useEffect(() => {
  //   const today = new Date();
  //   const sevenDaysAgo = new Date(today);
  //   sevenDaysAgo.setDate(today.getDate() - 7);
  //
  //   const formatDateInput = (date) => {
  //     const year = date.getFullYear();
  //     const month = String(date.getMonth() + 1).padStart(2, "0");
  //     const day = String(date.getDate()).padStart(2, "0");
  //     return `${year}-${month}-${day}`;
  //   };
  //
  //   setFromDate(formatDateInput(sevenDaysAgo));
  //   setToDate(formatDateInput(today));
  // }, []);

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
      setLoading(true);
      setError("");

      // ✅ CHANGE 3: Payload conditional - sirf filled fields
      const payload = {
        admin_id: admin_id,
        page: page,
        limit: itemsPerPage,
      };
      
      if (from && from.trim()) payload.from_date = from;
      if (to && to.trim()) payload.to_date = to;
      if (search && search.trim()) payload.search = search;

      console.log("Payload:", payload);

      const response = await getSettlementReporttAll(payload);
      console.log("API Response:", response);

      if (response.data && response.data.success === true) {
        setSummary({
          lena: Number(response.data?.lena || 0),
          dena: Number(response.data?.dena || 0),
          balance: Number(response.data?.balance || 0),
        });

        setTransactions(response.data?.data?.data || []);
        setCurrentPage(response.data?.data?.current_page || 1);
        setTotalPages(response.data?.data?.last_page || 1);
        setTotalItems(response.data?.data?.total || 0);
        setError("");
      } else {
        const errorMsg =
          response.data?.error?.message || "Failed to fetch settlement report";
        setError(errorMsg);
        showToast(errorMsg, "error");
      }
    } catch (err) {
      console.error("Error fetching settlement report:", err);
      const errorMsg =
        err.response?.data?.error?.message ||
        err.message ||
        "Failed to fetch settlement report";
      setError(errorMsg);
      showToast(errorMsg, "error");
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  // ✅ CHANGE 4: Handle Search - ab alert nahi, seedha fetch
  const handleSearch = () => {
    setIsSearching(true);
    setCurrentPage(1);
    fetchSettlementReport(fromDate, toDate, searchTerm, 1);
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // ✅ CHANGE 5: Dates change par auto-fetch wala useEffect HATAYO
  // useEffect(() => {
  //   if (fromDate && toDate) {
  //     setSearchTerm("");
  //     setCurrentPage(1);
  //     fetchSettlementReport(fromDate, toDate, "", 1);
  //   }
  // }, [fromDate, toDate]);

  // ✅ CHANGE 6: Page change par fetch - agar filters hain toh
  useEffect(() => {
    if (fromDate || toDate || searchTerm) {
      fetchSettlementReport(fromDate, toDate, searchTerm, currentPage);
    } else {
      // Agar koi filter nahi hai toh sirf admin_id ke saath fetch
      fetchSettlementReport("", "", "", currentPage);
    }
  }, [currentPage]);

  // ✅ CHANGE 7: Page load par fetch - sirf admin_id ke saath
  useEffect(() => {
    fetchSettlementReport("", "", "", 1);
  }, []);

  // Pagination Handlers
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

  const formatDateTime = (dateTime) => {
    if (!dateTime) return "-";

    const date = new Date(dateTime);

    if (isNaN(date.getTime())) return "-";

    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  // Get description
  const getDescription = (transaction) => {
    if (transaction.comment) return transaction.comment;
    if (transaction.remarks) return transaction.remarks;
    if (transaction.send_to_admin_id)
      return `To: ${transaction.send_to_admin_id}`;
    return "N/A";
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };
  // Get type
  const getType = (transaction) => {
    if (transaction.pay_type === "liya") return "Liya";
    if (transaction.pay_type === "dena") return "Dena";
    if (transaction.type) return transaction.type;
    return "Cash";
  };

  // Get amount
  const getAmount = ({ debit = 0, credit = 0 }) => {
    if (Number(debit) > 0) return -Number(debit);
    if (Number(credit) > 0) return Number(credit);
    return 0;
  };

  // Get D/C
  const getDC = ({ debit = 0, credit = 0 }) => {
    if (Number(debit) > 0) return "Debit";
    if (Number(credit) > 0) return "Credit";
    return "-";
  };

  return (
    <div>
      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}

      <div className="card">
        <div className="card-header d-flex bg-primary-yellow justify-content-between align-items-center">
          <h3 className="sport card-title mb-0 d-flex align-items-center gap-2">
            Settlement Report
          </h3>
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
              <Col xs={12} md={4}>
                <div className="d-flex align-items-center gap-1">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    style={{ width: "250px" }}
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch();
                      }
                    }}
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
            <table className="table table-striped table-bordered mb-0">
              <thead className="table-dark">
                <tr>
                  <th>NO</th>
                  <th>DESC</th>
                  <th>TYPE</th>
                  <th>AMOUNT</th>
                  <th>D/C</th>
                  <th>NOTE</th>
                  <th>TIME/DATE</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7">
                      <div className="table_loader text-center py-5">
                        <Loader />
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="7">
                      <div className="text-center mt-3">
                        <div className="text-danger mb-3">
                          <p>
                            <strong>Error:</strong> {error}
                          </p>
                        </div>
                        <button
                          className="btn btn-primary"
                          onClick={() =>
                            fetchSettlementReport(
                              fromDate,
                              toDate,
                              searchTerm,
                              currentPage,
                            )
                          }
                        >
                          Retry
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : transactions.length > 0 ? (
                  transactions.map((transaction, index) => {
                    const amount = getAmount(transaction);
                    const isDebit = amount < 0;
                    const serialNo =
                      (currentPage - 1) * itemsPerPage + index + 1;

                    return (
                      <tr key={transaction._id ?? index}>
                        <td>{serialNo}</td>
                        <td>{getDescription(transaction)}</td>
                        <td>{getType(transaction)}</td>
                        <td>
                          <span>{Math.abs(amount).toFixed(2)}</span>
                        </td>
                        <td>
                          <span>{getDC(transaction)}</span>
                        </td>
                        <td>{transaction.collection_name || "-"}</td>
                        <td>{formatDateTime(transaction.created_at)}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      <div className="text-muted">
                        {searchTerm
                          ? `No transactions found for "${searchTerm}"`
                          : "No transactions found"}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 0 && (
            <div className="d-flex justify-content-center align-items-center mt-4">
              <div className="paginationall d-flex align-items-center gap-1">
                <button disabled={currentPage === 1} onClick={handlePrev}>
                  <MdKeyboardDoubleArrowLeft /> Previous
                </button>

                <div className="d-flex gap-1">
                  {getPageNumbers().map((page) => (
                    <div
                      key={page}
                      className={`paginationnumber ${currentPage === page ? "active" : ""}`}
                      onClick={() => handlePageClick(page)}
                    >
                      {page}
                    </div>
                  ))}
                </div>

                <button
                  disabled={currentPage === totalPages}
                  onClick={handleNext}
                >
                  Next <MdKeyboardDoubleArrowRight />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SettlementReport;