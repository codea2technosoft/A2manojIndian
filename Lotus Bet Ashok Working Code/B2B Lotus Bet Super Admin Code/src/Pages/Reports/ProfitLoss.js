// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams, useLocation } from "react-router-dom";
// import {
//   MdOutlineKeyboardArrowRight,
//   MdOutlineKeyboardArrowLeft,
//   MdKeyboardDoubleArrowRight,
//   MdKeyboardDoubleArrowLeft,
// } from "react-icons/md";
// import { getProfitLossPL } from "../../Server/api";
// import { FiSearch } from "react-icons/fi";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { Spinner, Form, Button } from "react-bootstrap";
// import Loader from "../../Common/Loader";

// const ProfitLoss = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { adminId } = useParams();

//   const [loading, setLoading] = useState(true);
//   const [statementData, setStatementData] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sport, setSport] = useState("ALL");
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [eventId, setEventId] = useState("");

//   // PAGINATION
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [limit] = useState(50);

//   // Grand total and page total from API
//   const [grandTotal, setGrandTotal] = useState(null);
//   const [pageTotal, setPageTotal] = useState(null);

//   useEffect(() => {
//     fetchPLStatementData(currentPage);
//   }, [adminId, currentPage]);

//   const fetchPLStatementData = async (page) => {
//     try {
//       setLoading(true);
//       const loggedInAdminId = localStorage.getItem("admin_id");

//       // Build payload - send only what's needed
//       const payload = {
//         admin_id: adminId || loggedInAdminId,
//         page,
//         limit,
//       };

//       // Add filters only if they have values
//       if (sport && sport !== "ALL") payload.sport = sport; // Send sport as text
//       if (fromDate) payload.from_date = fromDate;
//       if (toDate) payload.to_date = toDate;
//       if (eventId) payload.event_id = eventId;
//       if (searchTerm) payload.search = searchTerm;

//       console.log("Sending payload:", payload);

//       const res = await getProfitLossPL(payload);

//       const response = res.data;
//       if (response.success) {
//         const data = response.data || [];
//         setStatementData(data);
//         setTotalPages(response.pagination?.total_pages || 1);
//         setTotalRecords(response.pagination?.total_records || 0);

//         // Store grand total and page total
//         if (response.grand_total) {
//           setGrandTotal(response.grand_total);
//         }
//         if (response.page_total) {
//           setPageTotal(response.page_total);
//         }
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to fetch P&L statement data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatNumber = (num) => Number(num || 0).toFixed(2);

//   const handlePrev = () => {
//     if (currentPage > 1) setCurrentPage((prev) => prev - 1);
//   };

//   const handleNext = () => {
//     if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
//   };

//   const handlePageClick = (page) => {
//     setCurrentPage(page);
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

//   const handleSearch = () => {
//     setCurrentPage(1);
//     fetchPLStatementData(1);
//   };

//   const handleClearSearch = () => {
//     setSearchTerm("");
//     setSport("ALL");
//     setFromDate("");
//     setToDate("");
//     setEventId("");
//     setCurrentPage(1);
//   };

//   const handleSummaryClick = (eventId) => {
//     const admin_id = localStorage.getItem("admin_id") || "admin";
//     const role = parseInt(localStorage.getItem("role")) || 1;
//     const payload = {
//       event_id: eventId,
//       admin_id: admin_id,
//       role: role,
//     };

//     console.log("✅ Navigating with payload:", payload);

//     navigate(`/reports/profit-loss-summary-event/${eventId}`, {
//       state: {
//         payload: payload,
//       },
//     });
//   };

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

//   const handleDetailClick = (eventId) => {
//     const admin_id = localStorage.getItem("admin_id") || "admin";
//     const role = parseInt(localStorage.getItem("role")) || 1;
//     const payload = {
//       event_id: eventId,
//       admin_id: admin_id,
//       role: role,
//     };

//     console.log("✅ Navigating with payload:", payload);
//     navigate(`/reports/profit-loss-detail/${eventId}`, {
//       state: {
//         payload: payload,
//       },
//     });
//   };

//   const hasActiveFilters =
//     searchTerm || sport !== "ALL" || fromDate || toDate || eventId;

//   return (
//     <>
//       <ToastContainer autoClose={500} theme="colored" />

//       <div className="card">
//         <div className="card-header bg-primary-yellow d-flex justify-content-between align-items-md-center gap-2">
//           <h3 className="card-title mb-0">Profit Loss</h3>
//         </div>

//         <div className="card-body">
//           <div className="row gy-2 mb-3 align-items-center">
//             <div className="col-md-2 col-6">
//               <Form.Select
//                 value={sport}
//                 onChange={(e) => setSport(e.target.value)}
//               >
//                 <option value="ALL">All Sports</option>
//                 <option value="Cricket">Cricket</option>
//                 <option value="Football">Football</option>
//                 <option value="Tennis">Tennis</option>
//                 <option value="Horse Racing">Horse Racing</option>
//                 <option value="Greyhound Racing">Greyhound Racing</option>
//                 <option value="Kabaddi">Kabaddi</option>
//                 <option value="Politics">Politics</option>
//                 <option value="Casino">Casino</option>
//               </Form.Select>
//             </div>

//             {/* From Date */}
//             <div className="col-md-2 col-6">
//               <Form.Control
//                 type="date"
//                 value={fromDate}
//                 onChange={(e) => setFromDate(e.target.value)}
//               />
//             </div>

//             {/* To Date */}
//             <div className="col-md-2 col-6">
//               <Form.Control
//                 type="date"
//                 value={toDate}
//                 onChange={(e) => setToDate(e.target.value)}
//               />
//             </div>

//             {/* Search Input */}
//             {/* <div className="col-md-1">
//               <Form.Control
//                 type="text"
//                 placeholder="Search"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div> */}

//             {/* Search Button */}
//             <div className="col-md-1 col-2">
//               <Button onClick={handleSearch} className="w-100">
//                 <FiSearch />
//               </Button>
//             </div>

//             {/* Clear Button
//             <div className="col-md-1">
//               <Button variant="secondary" onClick={handleClearSearch} className="w-100">
//                 Clear
//               </Button>
//             </div> */}
//           </div>

//           {/* Active Filters Display */}
//           {hasActiveFilters && (
//             <div className="mb-3">
//               <small className="text-muted">
//                 Active filters:
//                 {sport !== "ALL" && (
//                   <span className="ms-2">
//                     Sport: <strong>{sport}</strong>
//                   </span>
//                 )}
//                 {eventId && (
//                   <span className="ms-2">
//                     Event ID: <strong>{eventId}</strong>
//                   </span>
//                 )}
//                 {fromDate && (
//                   <span className="ms-2">
//                     From: <strong>{fromDate}</strong>
//                   </span>
//                 )}
//                 {toDate && (
//                   <span className="ms-2">
//                     To: <strong>{toDate}</strong>
//                   </span>
//                 )}
//                 {searchTerm && (
//                   <span className="ms-2">
//                     <strong>"{searchTerm}"</strong>
//                   </span>
//                 )}
//               </small>
//             </div>
//           )}

//           {/* TABLE */}
//           <div className="table-responsive">
//             <table className="table table-bordered table-hover table-striped">
//               <thead className="table-dark">
//                 <tr>
//                   <th>SR NO</th>
//                   <th>EVENT ID</th>
//                   <th>SPORT</th>
//                   <th>EVENT</th>
//                   <th>COMM IN</th>
//                   <th>COMM OUT</th>
//                   <th>AMOUNT</th>
//                   {/* <th>TOTAL</th> */}
//                   <th>Info</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {loading ? (
//                   <tr>
//                     <td colSpan="8" className="table_loader">
//                       <div className="text-center py-5">
//                         {/* <p>Loading P&L statement data...</p> */}
//                         <Loader />
//                       </div>
//                     </td>
//                   </tr>
//                 ) : statementData.length === 0 ? (
//                   <tr>
//                     <td colSpan="8">
//                       <h5 className="fs-6 text-dark py-5 text-center">
//                         No Data Found
//                       </h5>
//                     </td>
//                   </tr>
//                 ) : (
//                   <>
//                     {statementData.map((item, index) => (
//                       <tr key={index}>
//                         <td>{item.sr_no}</td>
//                         <td>{item.event_id}</td>
//                         <td>{item.sport}</td>
//                         <td>{item.event}</td>
//                         <td>{formatNumber(item.comm_in)}</td>
//                         <td>{formatNumber(item.comm_out)}</td>
//                         <td
//                           className={`fw-bold ${item.amount >= 0 ? "text-success" : "text-danger"}`}
//                         >
//                           {formatNumber(item.amount)}
//                         </td>
//                         {/* <td>
//                           {formatNumber(item.total)}
//                         </td> */}
//                         <td>
//                           <div className="d-flex justify-content-start gap-1">
//                             <button
//                               className="btn gradient-4 btn-rounded"
//                               onClick={() => handleSummaryClick(item.event_id)}
//                               title="View Summary"
//                             >
//                               S
//                             </button>
//                             <button
//                               className="buttoncommon gradient-2"
//                               onClick={() => handleDetailClick(item.event_id)}
//                               title="View Detail"
//                             >
//                               D
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}

//                     {/* Page Total Row */}
//                     {/* {pageTotal && (
//                       <tr className="table-warning fw-bold">
//                         <td colSpan="4">Page Total</td>
//                         <td>{formatNumber(pageTotal.comm_in)}</td>
//                         <td>{formatNumber(pageTotal.comm_out)}</td>
//                         <td>{formatNumber(pageTotal.amount)}</td>
//                         <td>{formatNumber(pageTotal.total)}</td>
//                       </tr>
//                     )} */}
//                   </>
//                 )}
//               </tbody>
//               {/* Grand Total Footer */}
//               {/* {grandTotal && !loading && statementData.length > 0 && (
//                 <tfoot className="table-dark fw-bold">
//                   <tr>
//                     <td colSpan="4">Grand Total</td>
//                     <td>{formatNumber(grandTotal.comm_in)}</td>
//                     <td>{formatNumber(grandTotal.comm_out)}</td>
//                     <td>{formatNumber(grandTotal.amount)}</td>
//                     <td>{formatNumber(grandTotal.total)}</td>
//                   </tr>
//                 </tfoot>
//               )} */}
//             </table>

//             {/* PAGINATION */}
//             {totalPages > 1 && (
//               <div className="d-flex justify-content-center align-items-center mt-4">
//                 <div className="paginationall d-flex align-items-center gap-1">
//                   <button disabled={currentPage === 1} onClick={handlePrev}>
//                     <MdKeyboardDoubleArrowLeft /> Previous
//                   </button>

//                   <div className="d-flex gap-1">
//                     {getPageNumbers().map((page) => (
//                       <div
//                         key={page}
//                         className={`paginationnumber ${currentPage === page ? "active" : ""}`}
//                         onClick={() => handlePageClick(page)}
//                       >
//                         {page}
//                       </div>
//                     ))}
//                   </div>

//                   <button
//                     disabled={currentPage === totalPages}
//                     onClick={handleNext}
//                   >
//                     Next <MdKeyboardDoubleArrowRight />
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ProfitLoss;


// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams, useLocation } from "react-router-dom";
// import {
//   MdOutlineKeyboardArrowRight,
//   MdOutlineKeyboardArrowLeft,
//   MdKeyboardDoubleArrowRight,
//   MdKeyboardDoubleArrowLeft,
// } from "react-icons/md";
// import { getProfitLossPL } from "../../Server/api";
// import { FiSearch } from "react-icons/fi";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { Spinner, Form, Button } from "react-bootstrap";
// import Loader from "../../Common/Loader";

// const ProfitLoss = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { adminId } = useParams();

//   const [loading, setLoading] = useState(true);
//   const [statementData, setStatementData] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sport_id, setSport] = useState("ALL");
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [eventId, setEventId] = useState("");

//   // PAGINATION
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [limit] = useState(50);

//   // Grand total and page total from API
//   const [grandTotal, setGrandTotal] = useState(null);
//   const [pageTotal, setPageTotal] = useState(null);

//   useEffect(() => {
//     fetchPLStatementData(currentPage);
//   }, [adminId, currentPage]);

//   const fetchPLStatementData = async (page) => {
//     try {
//       setLoading(true);
//       const loggedInAdminId = localStorage.getItem("admin_id");

//       // Build payload - send only what's needed
//       const payload = {
//         admin_id: adminId || loggedInAdminId,
//         page,
//         limit,
//       };

//       // Add filters only if they have values
//       if (sport_id && sport_id !== "ALL") payload.sport_id = sport_id;
//       if (fromDate) payload.from_date = fromDate;
//       if (toDate) payload.to_date = toDate;
//       if (eventId) payload.event_id = eventId;
//       if (searchTerm) payload.search = searchTerm;

//       console.log("Sending payload:", payload);

//       const res = await getProfitLossPL(payload);

//       const response = res.data;
//       if (response.success) {
//         const data = response.data || [];
//         setStatementData(data);
//         setTotalPages(response.pagination?.total_pages || 1);
//         setTotalRecords(response.pagination?.total_records || 0);

//         // Store grand total and page total
//         if (response.grand_total) {
//           setGrandTotal(response.grand_total);
//         }
//         if (response.page_total) {
//           setPageTotal(response.page_total);
//         }
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to fetch P&L statement data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatNumber = (num) => Number(num || 0).toFixed(2);

//   const handlePrev = () => {
//     if (currentPage > 1) setCurrentPage((prev) => prev - 1);
//   };

//   const handleNext = () => {
//     if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
//   };

//   const handlePageClick = (page) => {
//     setCurrentPage(page);
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

//   const handleSearch = () => {
//     setCurrentPage(1);
//     fetchPLStatementData(1);
//   };

//   const handleClearSearch = () => {
//     setSearchTerm("");
//     setSport("ALL");
//     setFromDate("");
//     setToDate("");
//     setEventId("");
//     setCurrentPage(1);
//   };

//   const handleSummaryClick = (eventId) => {
//     const admin_id = localStorage.getItem("admin_id") || "admin";
//     const role = parseInt(localStorage.getItem("role")) || 1;
//     const payload = {
//       event_id: eventId,
//       admin_id: admin_id,
//       role: role,
//     };

//     console.log("✅ Navigating with payload:", payload);

//     navigate(`/reports/profit-loss-summary-event/${eventId}`, {
//       state: {
//         payload: payload,
//       },
//     });
//   };

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

//   const handleDetailClick = (eventId) => {
//     const admin_id = localStorage.getItem("admin_id") || "admin";
//     const role = parseInt(localStorage.getItem("role")) || 1;
//     const payload = {
//       event_id: eventId,
//       admin_id: admin_id,
//       role: role,
//     };

//     console.log("✅ Navigating with payload:", payload);
//     navigate(`/reports/profit-loss-detail/${eventId}`, {
//       state: {
//         payload: payload,
//       },
//     });
//   };

//   const hasActiveFilters =
//     searchTerm || sport_id !== "ALL" || fromDate || toDate || eventId;

//   return (
//     <>
//       <ToastContainer autoClose={500} theme="colored" />

//       <div className="card">
//         <div className="card-header bg-primary-yellow d-flex justify-content-between align-items-md-center gap-2">
//           <h3 className="card-title mb-0">Profit Loss</h3>
//         </div>

//         <div className="card-body">
//           <div className="row gy-2 mb-3 align-items-center">
//             <div className="col-md-2 col-6">
//               <Form.Select
//                 value={sport_id}
//                 onChange={(e) => setSport(e.target.value)}
//               >
//                 <option value="ALL">All Sports</option>
//                 <option value="4">Cricket</option>
//                 <option value="1">Football</option>
//                 <option value="2">Tennis</option>
//                 <option value="7">Horse Racing</option>
//                 <option value="8">Greyhound Racing</option>
//                 <option value="10">Casino</option>
//                 <option value="15">Kabaddi</option>
//                 <option value="20">Politics</option>
                
//               </Form.Select>
//             </div>

//             {/* From Date */}
//             <div className="col-md-2 col-6">
//               <Form.Control
//                 type="date"
//                 value={fromDate}
//                 onChange={(e) => setFromDate(e.target.value)}
//               />
//             </div>

//             {/* To Date */}
//             <div className="col-md-2 col-6">
//               <Form.Control
//                 type="date"
//                 value={toDate}
//                 onChange={(e) => setToDate(e.target.value)}
//               />
//             </div>

//             {/* Search Button */}
//             <div className="col-md-1 col-2">
//               <Button onClick={handleSearch} className="w-100">
//                 <FiSearch />
//               </Button>
//             </div>
//           </div>

//           {/* Active Filters Display */}
//           {/* {hasActiveFilters && (
//             <div className="mb-3">
//               <small className="text-muted">
//                 Active filters:
//                 {sport !== "ALL" && (
//                   <span className="ms-2">
//                     Sport: <strong>{sport}</strong>
//                   </span>
//                 )}
//                 {eventId && (
//                   <span className="ms-2">
//                     Event ID: <strong>{eventId}</strong>
//                   </span>
//                 )}
//                 {fromDate && (
//                   <span className="ms-2">
//                     From: <strong>{fromDate}</strong>
//                   </span>
//                 )}
//                 {toDate && (
//                   <span className="ms-2">
//                     To: <strong>{toDate}</strong>
//                   </span>
//                 )}
//                 {searchTerm && (
//                   <span className="ms-2">
//                     <strong>"{searchTerm}"</strong>
//                   </span>
//                 )}
//               </small>
//             </div>
//           )} */}

//           {/* TABLE */}
//           <div className="table-responsive">
//             <table className="table table-bordered table-hover table-striped">
//               <thead className="table-dark">
//                 <tr>
//                   <th>SR NO</th>
//                   <th>EVENT ID</th>
//                   <th>SPORT</th>
//                   <th>EVENT</th>
//                   <th>COMM IN</th>
//                   <th>COMM OUT</th>
//                   <th>AMOUNT</th>
//                   <th>Total</th>
//                   <th>Info</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {loading ? (
//                   <tr>
//                     <td colSpan="8" className="table_loader">
//                       <div className="text-center py-5">
//                         <Loader />
//                       </div>
//                     </td>
//                   </tr>
//                 ) : statementData.length === 0 ? (
//                   <tr>
//                     <td colSpan="9">
//                       <h5 className="fs-6 text-dark py-5 text-center">
//                         No Data Found
//                       </h5>
//                     </td>
//                   </tr>
//                 ) : (
//                   <>
//                     {/* Page Total Row */}
//                     {pageTotal && (
//                       <tr className="table-striped fw-bold">
//                         <td>#</td>
//                         <td colSpan="5">Page Total</td>
//                         <td>{pageTotal.event || ""}</td>

//                         <td>{formatNumber(pageTotal.amount)}</td>
//                         <td></td>
//                       </tr>
//                     )}

//                     {/* Grand Total Row - Page Total ke neeche */}
//                     {grandTotal && (
//                       <tr className="table-striped fw-bold">
//                         <td>#</td>
//                         <td colSpan="5">Grand Total</td>
//                         <td>{grandTotal.event || ""}</td>

//                         <td>{formatNumber(grandTotal.amount)}</td>
//                         <td></td>
//                       </tr>
//                     )}

//                     {/* Data Rows */}
//                     {statementData.map((item, index) => (
//                       <tr key={index}>
//                         <td>{item.sr_no}</td>
//                         <td>{item.event_id}</td>
//                         <td>{item.sport}</td>
//                         <td>{item.event}</td>
//                         <td>{formatNumber(item.comm_in)}</td>
//                         <td>{formatNumber(item.comm_out)}</td>
//                         <td
//                           className={`fw-bold ${item.amount >= 0 ? "text-success" : "text-danger"}`}
//                         >
//                           {formatNumber(item.amount)}
//                         </td>

//                         <td
//                           className={`fw-bold ${item.total >= 0 ? "text-success" : "text-danger"}`}
//                         >
//                           {formatNumber(item.total)}
//                         </td>


//                         <td>
//                           <div className="d-flex justify-content-start gap-1">
//                             <button
//                               className="btn gradient-4 btn-rounded"
//                               onClick={() => handleSummaryClick(item.event_id)}
//                               title="View Summary"
//                             >
//                               S
//                             </button>
//                             <button
//                               className="buttoncommon gradient-2"
//                               onClick={() => handleDetailClick(item.event_id)}
//                               title="View Detail"
//                             >
//                               D
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </>
//                 )}
//               </tbody>
//             </table>

//             {/* PAGINATION */}
//             {totalPages > 1 && (
//               <div className="d-flex justify-content-center align-items-center mt-4">
//                 <div className="paginationall d-flex align-items-center gap-1">
//                   <button disabled={currentPage === 1} onClick={handlePrev}>
//                     <MdKeyboardDoubleArrowLeft /> Previous
//                   </button>

//                   <div className="d-flex gap-1">
//                     {getPageNumbers().map((page) => (
//                       <div
//                         key={page}
//                         className={`paginationnumber ${currentPage === page ? "active" : ""}`}
//                         onClick={() => handlePageClick(page)}
//                       >
//                         {page}
//                       </div>
//                     ))}
//                   </div>

//                   <button
//                     disabled={currentPage === totalPages}
//                     onClick={handleNext}
//                   >
//                     Next <MdKeyboardDoubleArrowRight />
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ProfitLoss;

import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardArrowLeft,
  MdKeyboardDoubleArrowRight,
  MdKeyboardDoubleArrowLeft,
} from "react-icons/md";
import { getProfitLossPL } from "../../Server/api";
import { FiSearch } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Spinner, Form, Button } from "react-bootstrap";
import Loader from "../../Common/Loader";

const ProfitLoss = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { adminId } = useParams();

  const [loading, setLoading] = useState(true);
  const [statementData, setStatementData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sport_id, setSport] = useState("ALL");
  const [fromDate, setFromDate] = useState(""); // ✅ Default empty (null)
  const [toDate, setToDate] = useState(""); // ✅ Default empty (null)
  const [eventId, setEventId] = useState("");

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [limit] = useState(50);

  // Grand total and page total from API
  const [grandTotal, setGrandTotal] = useState(null);
  const [pageTotal, setPageTotal] = useState(null);

  useEffect(() => {
    fetchPLStatementData(currentPage);
  }, [adminId, currentPage]);

  const fetchPLStatementData = async (page) => {
    try {
      setLoading(true);
      const loggedInAdminId = localStorage.getItem("admin_id");

      // Build payload - send only what's needed
      const payload = {
        admin_id: adminId || loggedInAdminId,
        page,
        limit,
      };

      // Add filters only if they have values
      if (sport_id && sport_id !== "ALL") payload.sport_id = sport_id;
      if (fromDate) payload.from_date = fromDate;
      if (toDate) payload.to_date = toDate;
      if (eventId) payload.event_id = eventId;
      if (searchTerm) payload.search = searchTerm;

      console.log("Sending payload:", payload);

      const res = await getProfitLossPL(payload);

      const response = res.data;
      if (response.success) {
        const data = response.data || [];
        setStatementData(data);
        setTotalPages(response.pagination?.total_pages || 1);
        setTotalRecords(response.pagination?.total_records || 0);

        // Store grand total and page total
        if (response.grand_total) {
          setGrandTotal(response.grand_total);
        }
        if (response.page_total) {
          setPageTotal(response.page_total);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch P&L statement data");
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => Number(num || 0).toFixed(2);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
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

  const handleSearch = () => {
    setCurrentPage(1);
    fetchPLStatementData(1);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSport("ALL");
    setFromDate("");
    setToDate("");
    setEventId("");
    setCurrentPage(1);
  };

  const handleSummaryClick = (eventId,eventName) => {
    const admin_id = localStorage.getItem("admin_id") || "admin";
    const role = parseInt(localStorage.getItem("role")) || 1;
    const payload = {
      event_id: eventId,
      admin_id: admin_id,
      role: role,
    };

    console.log("✅ Navigating with payload:", payload);

    navigate(`/reports/profit-loss-summary-event/${eventId}`, {
      state: {
        payload: payload,
         eventName: eventName,
        
      },
    });
  };

  // ✅ REMOVED: Default date useEffect - ab dates empty hain

  const handleDetailClick = (eventId,eventName) => {
    const admin_id = localStorage.getItem("admin_id") || "admin";
    const role = parseInt(localStorage.getItem("role")) || 1;
    const payload = {
      event_id: eventId,
      admin_id: admin_id,
      role: role,
    };

    console.log("✅ Navigating with payload:", payload);
    navigate(`/reports/profit-loss-detail/${eventId}`, {
      state: {
        payload: payload,
         eventName: eventName,
      },
    });
  };

  const hasActiveFilters =
    searchTerm || sport_id !== "ALL" || fromDate || toDate || eventId;

  return (
    <>
      <ToastContainer autoClose={500} theme="colored" />

      <div className="card">
        <div className="card-header bg-primary-yellow d-flex justify-content-between align-items-md-center gap-2">
          <h3 className="card-title mb-0">Profit Loss (Super Admin)</h3>
        </div>

        <div className="card-body">
          <div className="row gy-2 mb-3 align-items-center">
            <div className="col-md-2 col-6">
              <Form.Select
                value={sport_id}
                onChange={(e) => setSport(e.target.value)}
              >
                <option value="ALL">All Sports</option>
                <option value="4">Cricket</option>
                <option value="1">Football</option>
                <option value="2">Tennis</option>
                <option value="7">Horse Racing</option>
                <option value="8">Greyhound Racing</option>
                <option value="10">Casino</option>
                <option value="15">Kabaddi</option>
                <option value="20">Politics</option>
                
              </Form.Select>
            </div>

            {/* From Date */}
            <div className="col-md-2 col-6">
              <Form.Control
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>

            {/* To Date */}
            <div className="col-md-2 col-6">
              <Form.Control
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>

            {/* Search Button */}
            <div className="col-md-1 col-2">
              <Button onClick={handleSearch} className="w-100">
                <FiSearch />
              </Button>
            </div>
          </div>

          {/* TABLE */}
          <div className="table-responsive">
            <table className="table table-bordered table-hover table-striped">
              <thead className="table-dark">
                <tr>
                  <th>SR NO</th>
                  <th>EVENT ID</th>
                  <th>SPORT</th>
                  <th>EVENT</th>
                  <th>COMM IN</th>
                  <th>COMM OUT</th>
                  <th>AMOUNT</th>
                  <th>Total</th>
                  <th>Info</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="table_loader">
                      <div className="text-center py-5">
                        <Loader />
                      </div>
                    </td>
                  </tr>
                ) : statementData.length === 0 ? (
                  <tr>
                    <td colSpan="9">
                      <h5 className="fs-6 text-dark py-5 text-center">
                        No Data Found
                      </h5>
                    </td>
                  </tr>
                ) : (
                  <>
                    {/* Page Total Row */}
                    {pageTotal && (
                      <tr className="table-striped fw-bold">
                        <td>#</td>
                        <td colSpan="5">Page Total</td>
                        <td>{pageTotal.event || ""}</td>

                        <td>{formatNumber(pageTotal.amount)}</td>
                        <td></td>
                      </tr>
                    )}

                    {/* Grand Total Row - Page Total ke neeche */}
                    {grandTotal && (
                      <tr className="table-striped fw-bold">
                        <td>#</td>
                        <td colSpan="5">Grand Total</td>
                        <td>{grandTotal.event || ""}</td>

                        <td>{formatNumber(grandTotal.amount)}</td>
                        <td></td>
                      </tr>
                    )}

                    {/* Data Rows */}
                    {statementData.map((item, index) => (
                      <tr key={index}>
                        <td>{item.sr_no}</td>
                        <td>{item.event_id}</td>
                        <td>{item.sport}</td>
                        <td>{item.event}</td>
                        <td>{formatNumber(item.comm_in)}</td>
                        <td>{formatNumber(item.comm_out)}</td>
                        <td
                          className={`fw-bold ${item.amount >= 0 ? "text-success" : "text-danger"}`}
                        >
                          {formatNumber(item.amount)}
                        </td>

                        <td
                          className={`fw-bold ${item.total >= 0 ? "text-success" : "text-danger"}`}
                        >
                          {formatNumber(item.total)}
                        </td>


                        <td>
                          <div className="d-flex justify-content-start gap-1">
                            <button
                              className="btn gradient-4 btn-rounded"
                              onClick={() => handleSummaryClick(item.event_id,item.event)}
                              title="View Summary"
                            >
                              S
                            </button>
                            <button
                              className="buttoncommon gradient-2"
                              onClick={() => handleDetailClick(item.event_id,item.event)}
                              title="View Detail"
                            >
                              D
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>

            {/* PAGINATION */}
            {totalPages > 1 && (
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
    </>
  );
};

export default ProfitLoss;