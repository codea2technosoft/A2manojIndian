// // import React, { useState, useEffect } from "react";
// // import { useNavigate, useParams, useLocation } from "react-router-dom";
// // import {
// //   MdOutlineKeyboardArrowRight,
// //   MdOutlineKeyboardArrowLeft,
// //   MdKeyboardDoubleArrowRight,
// //   MdKeyboardDoubleArrowLeft,
// // } from "react-icons/md";
// // import { FiSearch } from "react-icons/fi";
// // import { toast, ToastContainer } from "react-toastify";
// // import "react-toastify/dist/ReactToastify.css";
// // import { Form, Button } from "react-bootstrap";
// // import { getEventBetsCompletedAll } from "../../Server/api";
// // import Loader from "../../Common/Loader";

// // const CompletedBets = () => {
// //   const navigate = useNavigate();
// //   const { adminId } = useParams();
// //   const location = useLocation();
// //   const navigationPayload = location.state?.payload || {};

// //   const [loading, setLoading] = useState(true);
// //   const [betsData, setBetsData] = useState([]);
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [sport, setSport] = useState("ALL");
// //   const [fromDate, setFromDate] = useState("");
// //   const [toDate, setToDate] = useState("");
// //   const [betType, setBetType] = useState("ALL");

// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [totalPages, setTotalPages] = useState(1);
// //   const [totalRecords, setTotalRecords] = useState(0);
// //   const [limit] = useState(50);

// //   useEffect(() => {
// //     fetchCompletedBets(currentPage);
// //   }, [
// //     currentPage,
// //     searchTerm,
// //     sport,
// //     fromDate,
// //     toDate,
// //     betType,
// //   ]);

// //   const fetchCompletedBets = async (page = currentPage) => {
// //     try {
// //       setLoading(true);
// //       const loggedInAdminId = localStorage.getItem("admin_id");
// //       const payload = {
// //         admin_id: navigationPayload.admin_id || loggedInAdminId || adminId,
// //         role: navigationPayload.role || parseInt(localStorage.getItem("role")) || 1,
// //         page: page,
// //         limit: limit,
// //         search: searchTerm,
// //         sport: sport,
// //         from_date: fromDate,
// //         to_date: toDate,
// //         bet_type: betType
// //       };

// //       console.log("Sending Completed Bets Payload:", payload);

// //       const response = await getEventBetsCompletedAll(payload);
// //       console.log("Completed Bets Response:", response);

// //       if (response.data && response.data.status_code === 1) {
// //         const data = response.data.data || [];
// //         setBetsData(data);
// //         setTotalPages(response.data.pagination?.totalPages || 1);
// //         setCurrentPage(response.data.pagination?.currentPage || 1);
// //         setTotalRecords(response.data.pagination?.totalRecords || 0);
// //       } else {
// //         const errorMsg = response.data?.message || "Failed to fetch completed bets";
// //         toast.error(errorMsg);
// //       }
// //     } catch (error) {
// //       console.error("Error fetching completed bets:", error);
// //       const errorMsg =
// //         error.response?.data?.message ||
// //         error.message ||
// //         "Failed to fetch completed bets";
// //       toast.error(errorMsg);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const formatNumber = (num) => Number(num || 0).toFixed(2);

// //   const handlePrev = () => {
// //     if (currentPage > 1) setCurrentPage((prev) => prev - 1);
// //   };

// //   const handleNext = () => {
// //     if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
// //   };

// //   const handlePageClick = (page) => {
// //     setCurrentPage(page);
// //   };

// //   const getPageNumbers = () => {
// //     const pageNumbers = [];
// //     const maxVisiblePages = 2;

// //     if (totalPages <= maxVisiblePages) {
// //       for (let i = 1; i <= totalPages; i++) {
// //         pageNumbers.push(i);
// //       }
// //     } else {
// //       let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
// //       let end = Math.min(totalPages, start + maxVisiblePages - 1);

// //       if (end - start + 1 < maxVisiblePages) {
// //         start = Math.max(1, end - maxVisiblePages + 1);
// //       }

// //       for (let i = start; i <= end; i++) {
// //         pageNumbers.push(i);
// //       }
// //     }

// //     return pageNumbers;
// //   };

// //   const handleSearch = () => {
// //     setCurrentPage(1);
// //     fetchCompletedBets(1);
// //   };

// //   const handleClearSearch = () => {
// //     setSearchTerm("");
// //     setSport("ALL");
// //     setFromDate("");
// //     setToDate("");
// //     setBetType("ALL");
// //     setCurrentPage(1);
// //   };

// //   const hasActiveFilters =
// //     searchTerm ||
// //     sport !== "ALL" ||
// //     fromDate ||
// //     toDate ||
// //     betType !== "ALL";

// //   const getSportName = (sportId) => {
// //     const sports = {
// //       1: "Football",
// //       2: "Cricket",
// //       3: "Tennis",
// //       4: "Horse Racing",
// //       5: "Greyhound Racing",
// //       6: "Kabaddi",
// //       7: "Casino",
// //       8: "Politics"
// //     };
// //     return sports[sportId] || "N/A";
// //   };

// //   const getStatusBadge = (isSettled, matchStatus) => {
// //     if (isSettled === 1) {
// //       return <span className="badge bg-success">Settled</span>;
// //     } else if (matchStatus === "3") {
// //       return <span className="badge bg-warning">In Progress</span>;
// //     } else {
// //       return <span className="badge bg-secondary">Pending</span>;
// //     }
// //   };

// //   const getResultBadge = (resultVal) => {
// //     if (resultVal === "WIN" || resultVal === 1) {
// //       return <span className="badge bg-success">Win</span>;
// //     } else if (resultVal === "LOSS" || resultVal === 0) {
// //       return <span className="badge bg-danger">Loss</span>;
// //     } else {
// //       return <span className="badge bg-secondary">{resultVal || "N/A"}</span>;
// //     }
// //   };

// //   return (
// //     <>
// //       <ToastContainer autoClose={500} theme="colored" />

// //       <div className="card">
// //         <div className="card-header bg-primary-yellow d-flex justify-content-between align-items-center gap-2">
// //           <h5 className="card-title mb-0">Bet History</h5>
// //           <div className="d-flex align-items-center">
// //             <button
// //               onClick={() => navigate(-1)}
// //               className="btn btn-outline-light"
// //             >
// //               Back
// //             </button>
// //           </div>
// //         </div>

// //         <div className="card-body">
// //           {/* <div className="row mb-3 align-items-center">
// //             <div className="col-md-2">
// //               <Form.Control
// //                 type="text"
// //                 placeholder="Search..."
// //                 value={searchTerm}
// //                 onChange={(e) => setSearchTerm(e.target.value)}
// //               />
// //             </div>
// //             <div className="col-md-2">
// //               <Form.Select
// //                 value={sport}
// //                 onChange={(e) => setSport(e.target.value)}
// //               >
// //                 <option value="ALL">ALL</option>
// //                 <option value="1">Football</option>
// //                 <option value="2">Cricket</option>
// //                 <option value="3">Tennis</option>
// //                 <option value="4">Horse Racing</option>
// //                 <option value="5">Greyhound Racing</option>
// //                 <option value="6">Kabaddi</option>
// //                 <option value="7">Casino</option>
// //                 <option value="8">Politics</option>
// //               </Form.Select>
// //             </div>
// //             <div className="col-md-2">
// //               <Form.Select
// //                 value={betType}
// //                 onChange={(e) => setBetType(e.target.value)}
// //               >
// //                 <option value="ALL">All Types</option>
// //                 <option value="match_odds">Match Odds</option>
// //                 <option value="bookmaker">Bookmaker</option>
// //                 <option value="fancy">Fancy</option>
// //               </Form.Select>
// //             </div>
// //             <div className="col-md-2">
// //               <Form.Control
// //                 type="date"
// //                 value={fromDate}
// //                 onChange={(e) => setFromDate(e.target.value)}
// //               />
// //             </div>
// //             <div className="col-md-2">
// //               <Form.Control
// //                 type="date"
// //                 value={toDate}
// //                 onChange={(e) => setToDate(e.target.value)}
// //               />
// //             </div>
// //             <div className="col-md-1">
// //               <Button onClick={handleSearch}>
// //                 <FiSearch />
// //               </Button>
// //             </div>
// //             {hasActiveFilters && (
// //               <div className="col-md-1">
// //                 <Button variant="secondary" onClick={handleClearSearch}>
// //                   Clear
// //                 </Button>
// //               </div>
// //             )}
// //           </div> */}

// //           <div className="table-responsive">
// //             <table className="table table-bordered table-hover table-striped">
// //               <thead className="table-dark">
// //                 <tr>
// //                   <th>NO</th>
// //                   <th>USERNAME</th>
// //                   <th>RUNNER NAME</th>
// //                   <th>ROUND ID</th>
// //                   <th>Odds</th>
// //                   <th className="text-end">STAKES</th>
// //                   <th>RESULT</th>
// //                   <th>Status</th>
// //                   {/* <th>Comm In</th>
// //                   <th>Comm Out</th>
// //                   <th>Total</th> */}
// //                   <th>DATE/TIME</th>
// //                 </tr>
// //               </thead>

// //               <tbody>
// //                 {loading ? (
// //                   <tr>
// //                     <td colSpan="9" className="table_loader">
// //                       <div className="text-center py-5">
// //                         {/* <p>Loading completed bets...</p> */}
// //                         <Loader />
// //                       </div>
// //                     </td>
// //                   </tr>
// //                 ) : betsData.length === 0 ? (
// //                   <tr>
// //                     <td colSpan="9">
// //                       <h5 className="fs-6 text-dark py-5 text-center">
// //                         No Completed Bets Found
// //                       </h5>
// //                     </td>
// //                   </tr>
// //                 ) : (
// //                   <>
// //                     {betsData.map((item, index) => {
// //                       const serialNo = (currentPage - 1) * limit + index + 1;
// //                       return (
// //                         <tr key={item._id || index}>
// //                           <td>{serialNo}</td>
// //                           <td>{item.username || "N/A"}</td>
// //                           <td>{item.team || "N/A"}</td>
// //                           <td>{item.event_id || "-"}</td>
// //                           {/* <td>{item.odd} / {item.total}</td> */}
// //                           <td>{item.odd} </td>
// //                           <td className="text-end">
// //                             {formatNumber(item.stake || 0)}
// //                           </td>
// //                           <td>
// //                             {item.total || "-" }
// //                           </td>
// //                           <td>
// //                             {item.is_settled === 1 ? "Success" : "Pending"}
// //                           </td>

// //                           {/* <td>
// //                             {item.win_amount || 0.00}
// //                           </td> 
// //                           <td>
// //                             {item.loss_amount || 0.00}
// //                           </td> 
// //                           <td>
// //                             {item.profit_loss || 0.00}
// //                           </td>  */}
// //                           <td>
// //                             {item.date_time ?
// //                               new Date(item.date_time).toLocaleString() :
// //                               new Date(item.created_at).toLocaleString()
// //                             }
// //                           </td>
// //                         </tr>
// //                       );
// //                     })}
// //                   </>
// //                 )}
// //               </tbody>
// //             </table>

// //           </div>
// //           {/* PAGINATION */}
// //           {totalPages > 0 && (
// //             <div className="d-flex justify-content-center align-items-center mt-4">
// //               <div className="paginationall d-flex align-items-center gap-1">
// //                 <button disabled={currentPage === 1} onClick={handlePrev}>
// //                   <MdKeyboardDoubleArrowLeft /> Previous
// //                 </button>

// //                 <div className="d-flex gap-1">
// //                   {getPageNumbers().map((page) => (
// //                     <div
// //                       key={page}
// //                       className={`paginationnumber ${currentPage === page ? "active" : ""}`}
// //                       onClick={() => handlePageClick(page)}
// //                     >
// //                       {page}
// //                     </div>
// //                   ))}
// //                 </div>

// //                 <button
// //                   disabled={currentPage === totalPages}
// //                   onClick={handleNext}
// //                 >
// //                   Next <MdKeyboardDoubleArrowRight />
// //                 </button>
// //               </div>
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </>
// //   );
// // };

// // export default CompletedBets;


// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams, useLocation } from "react-router-dom";
// import {
//   MdOutlineKeyboardArrowRight,
//   MdOutlineKeyboardArrowLeft,
//   MdKeyboardDoubleArrowRight,
//   MdKeyboardDoubleArrowLeft,
// } from "react-icons/md";
// import { FiSearch } from "react-icons/fi";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { Form, Button } from "react-bootstrap";
// import { getEventBetsCompletedAll } from "../../Server/api";
// import Loader from "../../Common/Loader";

// const CompletedBets = () => {
//   const navigate = useNavigate();
//   const { adminId } = useParams();
//   const location = useLocation();
//   const navigationPayload = location.state?.payload || {};

//   const [loading, setLoading] = useState(true);
//   const [betsData, setBetsData] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sport, setSport] = useState("ALL");
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [betType, setBetType] = useState("ALL");

//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [limit] = useState(50);

//   useEffect(() => {
//     fetchCompletedBets(currentPage);
//   }, [
//     currentPage,
//     searchTerm,
//     sport,
//     fromDate,
//     toDate,
//     betType,
//   ]);

//   const fetchCompletedBets = async (page = currentPage) => {
//     try {
//       setLoading(true);
//       const loggedInAdminId = localStorage.getItem("admin_id");
//       const payload = {
//         admin_id: navigationPayload.admin_id || loggedInAdminId || adminId,
//         role: navigationPayload.role || parseInt(localStorage.getItem("role")) || 1,
//         page: page,
//         limit: limit,
//         search: searchTerm,
//         sport: sport,
//         from_date: fromDate,
//         to_date: toDate,
//         bet_type: betType
//       };

//       console.log("Sending Completed Bets Payload:", payload);

//       const response = await getEventBetsCompletedAll(payload);
//       console.log("Completed Bets Response:", response);

//       if (response.data && response.data.status_code === 1) {
//         const data = response.data.data || [];
//         setBetsData(data);
//         setTotalPages(response.data.pagination?.totalPages || 1);
//         setCurrentPage(response.data.pagination?.currentPage || 1);
//         setTotalRecords(response.data.pagination?.totalRecords || 0);
//       } else {
//         const errorMsg = response.data?.message || "Failed to fetch completed bets";
//         toast.error(errorMsg);
//       }
//     } catch (error) {
//       console.error("Error fetching completed bets:", error);
//       const errorMsg =
//         error.response?.data?.message ||
//         error.message ||
//         "Failed to fetch completed bets";
//       toast.error(errorMsg);
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
//     fetchCompletedBets(1);
//   };

//   const handleClearSearch = () => {
//     setSearchTerm("");
//     setSport("ALL");
//     setFromDate("");
//     setToDate("");
//     setBetType("ALL");
//     setCurrentPage(1);
//   };

//   const hasActiveFilters =
//     searchTerm ||
//     sport !== "ALL" ||
//     fromDate ||
//     toDate ||
//     betType !== "ALL";

//   const getSportName = (sportId) => {
//     const sports = {
//       1: "Football",
//       2: "Cricket",
//       3: "Tennis",
//       4: "Horse Racing",
//       5: "Greyhound Racing",
//       6: "Kabaddi",
//       7: "Casino",
//       8: "Politics"
//     };
//     return sports[sportId] || "N/A";
//   };

//   const getStatusBadge = (isSettled, matchStatus) => {
//     if (isSettled === 1) {
//       return <span className="badge bg-success">Settled</span>;
//     } else if (matchStatus === "3") {
//       return <span className="badge bg-warning">In Progress</span>;
//     } else {
//       return <span className="badge bg-secondary">Pending</span>;
//     }
//   };

//   const getResultBadge = (resultVal) => {
//     if (resultVal === "WIN" || resultVal === 1) {
//       return <span className="badge bg-success">Win</span>;
//     } else if (resultVal === "LOSS" || resultVal === 0) {
//       return <span className="badge bg-danger">Loss</span>;
//     } else {
//       return <span className="badge bg-secondary">{resultVal || "N/A"}</span>;
//     }
//   };

//   return (
//     <>
//       <ToastContainer autoClose={500} theme="colored" />

//       <div className="card">
//         <div className="card-header bg-primary-yellow d-flex justify-content-between align-items-center gap-2">
//           <h5 className="card-title mb-0">Bet History</h5>
//           <div className="d-flex align-items-center">
//             <button
//               onClick={() => navigate(-1)}
//               className="btn btn-outline-light"
//             >
//               Back
//             </button>
//           </div>
//         </div>

//         <div className="card-body">
//           {/* <div className="row mb-3 align-items-center">
//             <div className="col-md-2">
//               <Form.Control
//                 type="text"
//                 placeholder="Search..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//             <div className="col-md-2">
//               <Form.Select
//                 value={sport}
//                 onChange={(e) => setSport(e.target.value)}
//               >
//                 <option value="ALL">ALL</option>
//                 <option value="1">Football</option>
//                 <option value="2">Cricket</option>
//                 <option value="3">Tennis</option>
//                 <option value="4">Horse Racing</option>
//                 <option value="5">Greyhound Racing</option>
//                 <option value="6">Kabaddi</option>
//                 <option value="7">Casino</option>
//                 <option value="8">Politics</option>
//               </Form.Select>
//             </div>
//             <div className="col-md-2">
//               <Form.Select
//                 value={betType}
//                 onChange={(e) => setBetType(e.target.value)}
//               >
//                 <option value="ALL">All Types</option>
//                 <option value="match_odds">Match Odds</option>
//                 <option value="bookmaker">Bookmaker</option>
//                 <option value="fancy">Fancy</option>
//               </Form.Select>
//             </div>
//             <div className="col-md-2">
//               <Form.Control
//                 type="date"
//                 value={fromDate}
//                 onChange={(e) => setFromDate(e.target.value)}
//               />
//             </div>
//             <div className="col-md-2">
//               <Form.Control
//                 type="date"
//                 value={toDate}
//                 onChange={(e) => setToDate(e.target.value)}
//               />
//             </div>
//             <div className="col-md-1">
//               <Button onClick={handleSearch}>
//                 <FiSearch />
//               </Button>
//             </div>
//             {hasActiveFilters && (
//               <div className="col-md-1">
//                 <Button variant="secondary" onClick={handleClearSearch}>
//                   Clear
//                 </Button>
//               </div>
//             )}
//           </div> */}

//           <div className="table-responsive">
//             <table className="table table-bordered table-hover table-striped">
//               <thead className="table-dark">
//                 <tr>
//                   <th>NO</th>
//                   <th>USERNAME</th>
//                   <th>RUNNER NAME</th>
//                   <th>ROUND ID</th>
//                   <th>Transaction ID</th>
//                   <th className="text-end">Game ID</th>
//                   <th>Game Code</th>
//                   <th>Amount</th>
//                   {/* <th>Comm In</th>
//                   <th>Comm Out</th>
//                   <th>Total</th> */}
//                   <th>DATE/TIME</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {loading ? (
//                   <tr>
//                     <td colSpan="9" className="table_loader">
//                       <div className="text-center py-5">
//                         {/* <p>Loading completed bets...</p> */}
//                         <Loader />
//                       </div>
//                     </td>
//                   </tr>
//                 ) : betsData.length === 0 ? (
//                   <tr>
//                     <td colSpan="9">
//                       <h5 className="fs-6 text-dark py-5 text-center">
//                         No Completed Bets Found
//                       </h5>
//                     </td>
//                   </tr>
//                 ) : (
//                   <>
//                     {betsData.map((item, index) => {
//                       const serialNo = (currentPage - 1) * limit + index + 1;
//                       return (
//                         <tr key={item._id || index}>
//                           <td>{serialNo}</td>
//                           <td>{item.username || "N/A"}</td>
//                           <td>{item.team || "N/A"}</td>
//                           <td>{item.event_id || "-"}</td>
//                           {/* <td>{item.odd} / {item.total}</td> */}
//                           <td>{item.bet_id} </td>
//                           <td className="text-end">
//                             {item.sport_id || "-"}
//                           </td>
//                           <td>
//                             {item.market_id || "-" }
//                           </td>

//                            <td>
//                             {item.stake || "-" }
//                           </td>


//                           {/* <td>
//                             {item.is_settled === 1 ? "Success" : "Pending"}
//                           </td> */}

//                           {/* <td>
//                             {item.win_amount || 0.00}
//                           </td> 
//                           <td>
//                             {item.loss_amount || 0.00}
//                           </td> 
//                           <td>
//                             {item.profit_loss || 0.00}
//                           </td>  */}
//                           <td>
//                             {item.date_time ?
//                               new Date(item.date_time).toLocaleString() :
//                               new Date(item.created_at).toLocaleString()
//                             }
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </>
//                 )}
//               </tbody>
//             </table>

//           </div>
//           {/* PAGINATION */}
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
//     </>
//   );
// };

// export default CompletedBets;

// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams, useLocation } from "react-router-dom";
// import {
//   MdOutlineKeyboardArrowRight,
//   MdOutlineKeyboardArrowLeft,
//   MdKeyboardDoubleArrowRight,
//   MdKeyboardDoubleArrowLeft,
// } from "react-icons/md";
// import { FiSearch } from "react-icons/fi";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { Form, Button } from "react-bootstrap";
// import { getEventBetsCompletedAll } from "../../Server/api";
// import Loader from "../../Common/Loader";

// const CompletedBets = () => {
//   const navigate = useNavigate();
//   const { adminId } = useParams();
//   const location = useLocation();
//   const navigationPayload = location.state?.payload || {};

//   const [loading, setLoading] = useState(true);
//   const [betsData, setBetsData] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sport, setSport] = useState("ALL");
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [betType, setBetType] = useState("ALL");

//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [limit] = useState(50);

//   useEffect(() => {
//     fetchCompletedBets(currentPage);
//   }, [
//     currentPage,
//     searchTerm,
//     sport,
//     fromDate,
//     toDate,
//     betType,
//   ]);

//   const fetchCompletedBets = async (page = currentPage) => {
//     try {
//       setLoading(true);
//       const loggedInAdminId = localStorage.getItem("admin_id");
//       const payload = {
//         admin_id: navigationPayload.admin_id || loggedInAdminId || adminId,
//         role: navigationPayload.role || parseInt(localStorage.getItem("role")) || 1,
//         page: page,
//         limit: limit,
//         search: searchTerm,
//         sport: sport,
//         from_date: fromDate,
//         to_date: toDate,
//         bet_type: betType
//       };

//       console.log("Sending Completed Bets Payload:", payload);

//       const response = await getEventBetsCompletedAll(payload);
//       console.log("Completed Bets Response:", response);

//       if (response.data && response.data.status_code === 1) {
//         const data = response.data.data || [];
//         setBetsData(data);
//         setTotalPages(response.data.pagination?.totalPages || 1);
//         setCurrentPage(response.data.pagination?.currentPage || 1);
//         setTotalRecords(response.data.pagination?.totalRecords || 0);
//       } else {
//         const errorMsg = response.data?.message || "Failed to fetch completed bets";
//         toast.error(errorMsg);
//       }
//     } catch (error) {
//       console.error("Error fetching completed bets:", error);
//       const errorMsg =
//         error.response?.data?.message ||
//         error.message ||
//         "Failed to fetch completed bets";
//       toast.error(errorMsg);
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
//     fetchCompletedBets(1);
//   };

//   const handleClearSearch = () => {
//     setSearchTerm("");
//     setSport("ALL");
//     setFromDate("");
//     setToDate("");
//     setBetType("ALL");
//     setCurrentPage(1);
//   };

//   const hasActiveFilters =
//     searchTerm ||
//     sport !== "ALL" ||
//     fromDate ||
//     toDate ||
//     betType !== "ALL";

//   const getSportName = (sportId) => {
//     const sports = {
//       1: "Football",
//       2: "Cricket",
//       3: "Tennis",
//       4: "Horse Racing",
//       5: "Greyhound Racing",
//       6: "Kabaddi",
//       7: "Casino",
//       8: "Politics"
//     };
//     return sports[sportId] || "N/A";
//   };

//   const getStatusBadge = (isSettled, matchStatus) => {
//     if (isSettled === 1) {
//       return <span className="badge bg-success">Settled</span>;
//     } else if (matchStatus === "3") {
//       return <span className="badge bg-warning">In Progress</span>;
//     } else {
//       return <span className="badge bg-secondary">Pending</span>;
//     }
//   };

//   const getResultBadge = (resultVal) => {
//     if (resultVal === "WIN" || resultVal === 1) {
//       return <span className="badge bg-success">Win</span>;
//     } else if (resultVal === "LOSS" || resultVal === 0) {
//       return <span className="badge bg-danger">Loss</span>;
//     } else {
//       return <span className="badge bg-secondary">{resultVal || "N/A"}</span>;
//     }
//   };

//   return (
//     <>
//       <ToastContainer autoClose={500} theme="colored" />

//       <div className="card">
//         <div className="card-header bg-primary-yellow d-flex justify-content-between align-items-center gap-2">
//           <h5 className="card-title mb-0">Bet History</h5>
//           <div className="d-flex align-items-center">
//             <button
//               onClick={() => navigate(-1)}
//               className="btn btn-outline-light"
//             >
//               Back
//             </button>
//           </div>
//         </div>

//         <div className="card-body">
//           {/* <div className="row mb-3 align-items-center">
//             <div className="col-md-2">
//               <Form.Control
//                 type="text"
//                 placeholder="Search..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//             <div className="col-md-2">
//               <Form.Select
//                 value={sport}
//                 onChange={(e) => setSport(e.target.value)}
//               >
//                 <option value="ALL">ALL</option>
//                 <option value="1">Football</option>
//                 <option value="2">Cricket</option>
//                 <option value="3">Tennis</option>
//                 <option value="4">Horse Racing</option>
//                 <option value="5">Greyhound Racing</option>
//                 <option value="6">Kabaddi</option>
//                 <option value="7">Casino</option>
//                 <option value="8">Politics</option>
//               </Form.Select>
//             </div>
//             <div className="col-md-2">
//               <Form.Select
//                 value={betType}
//                 onChange={(e) => setBetType(e.target.value)}
//               >
//                 <option value="ALL">All Types</option>
//                 <option value="match_odds">Match Odds</option>
//                 <option value="bookmaker">Bookmaker</option>
//                 <option value="fancy">Fancy</option>
//               </Form.Select>
//             </div>
//             <div className="col-md-2">
//               <Form.Control
//                 type="date"
//                 value={fromDate}
//                 onChange={(e) => setFromDate(e.target.value)}
//               />
//             </div>
//             <div className="col-md-2">
//               <Form.Control
//                 type="date"
//                 value={toDate}
//                 onChange={(e) => setToDate(e.target.value)}
//               />
//             </div>
//             <div className="col-md-1">
//               <Button onClick={handleSearch}>
//                 <FiSearch />
//               </Button>
//             </div>
//             {hasActiveFilters && (
//               <div className="col-md-1">
//                 <Button variant="secondary" onClick={handleClearSearch}>
//                   Clear
//                 </Button>
//               </div>
//             )}
//           </div> */}

//           <div className="table-responsive">
//             <table className="table table-bordered table-hover table-striped">
//               <thead className="table-dark">
//                 <tr>
//                   <th>NO</th>
//                   <th>USERNAME</th>
//                   <th>RUNNER NAME</th>
//                   <th>ROUND ID</th>
//                   <th>Odds</th>
//                   <th className="text-end">STAKES</th>
//                   <th>RESULT</th>
//                   <th>Status</th>
//                   {/* <th>Comm In</th>
//                   <th>Comm Out</th>
//                   <th>Total</th> */}
//                   <th>DATE/TIME</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {loading ? (
//                   <tr>
//                     <td colSpan="9" className="table_loader">
//                       <div className="text-center py-5">
//                         {/* <p>Loading completed bets...</p> */}
//                         <Loader />
//                       </div>
//                     </td>
//                   </tr>
//                 ) : betsData.length === 0 ? (
//                   <tr>
//                     <td colSpan="9">
//                       <h5 className="fs-6 text-dark py-5 text-center">
//                         No Completed Bets Found
//                       </h5>
//                     </td>
//                   </tr>
//                 ) : (
//                   <>
//                     {betsData.map((item, index) => {
//                       const serialNo = (currentPage - 1) * limit + index + 1;
//                       return (
//                         <tr key={item._id || index}>
//                           <td>{serialNo}</td>
//                           <td>{item.username || "N/A"}</td>
//                           <td>{item.team || "N/A"}</td>
//                           <td>{item.event_id || "-"}</td>
//                           {/* <td>{item.odd} / {item.total}</td> */}
//                           <td>{item.odd} </td>
//                           <td className="text-end">
//                             {formatNumber(item.stake || 0)}
//                           </td>
//                           <td>
//                             {item.total || "-" }
//                           </td>
//                           <td>
//                             {item.is_settled === 1 ? "Success" : "Pending"}
//                           </td>

//                           {/* <td>
//                             {item.win_amount || 0.00}
//                           </td> 
//                           <td>
//                             {item.loss_amount || 0.00}
//                           </td> 
//                           <td>
//                             {item.profit_loss || 0.00}
//                           </td>  */}
//                           <td>
//                             {item.date_time ?
//                               new Date(item.date_time).toLocaleString() :
//                               new Date(item.created_at).toLocaleString()
//                             }
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </>
//                 )}
//               </tbody>
//             </table>

//           </div>
//           {/* PAGINATION */}
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
//     </>
//   );
// };

// export default CompletedBets;


// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams, useLocation } from "react-router-dom";
// import {
//   MdOutlineKeyboardArrowRight,
//   MdOutlineKeyboardArrowLeft,
//   MdKeyboardDoubleArrowRight,
//   MdKeyboardDoubleArrowLeft,
// } from "react-icons/md";
// import { FiSearch } from "react-icons/fi";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { Form, Button } from "react-bootstrap";
// import { getEventBetsCompletedAll } from "../../Server/api";
// import Loader from "../../Common/Loader";

// const CompletedBets = () => {
//   const navigate = useNavigate();
//   const { adminId } = useParams();
//   const location = useLocation();
//   const navigationPayload = location.state?.payload || {};

//   const [loading, setLoading] = useState(true);
//   const [betsData, setBetsData] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sport, setSport] = useState("ALL");
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [betType, setBetType] = useState("ALL");

//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [limit] = useState(50);

//   useEffect(() => {
//     fetchCompletedBets(currentPage);
//   }, [
//     currentPage,
//     searchTerm,
//     sport,
//     fromDate,
//     toDate,
//     betType,
//   ]);

//   const fetchCompletedBets = async (page = currentPage) => {
//     try {
//       setLoading(true);
//       const loggedInAdminId = localStorage.getItem("admin_id");
//       const payload = {
//         admin_id: navigationPayload.admin_id || loggedInAdminId || adminId,
//         role: navigationPayload.role || parseInt(localStorage.getItem("role")) || 1,
//         page: page,
//         limit: limit,
//         search: searchTerm,
//         sport: sport,
//         from_date: fromDate,
//         to_date: toDate,
//         bet_type: betType
//       };

//       console.log("Sending Completed Bets Payload:", payload);

//       const response = await getEventBetsCompletedAll(payload);
//       console.log("Completed Bets Response:", response);

//       if (response.data && response.data.status_code === 1) {
//         const data = response.data.data || [];
//         setBetsData(data);
//         setTotalPages(response.data.pagination?.totalPages || 1);
//         setCurrentPage(response.data.pagination?.currentPage || 1);
//         setTotalRecords(response.data.pagination?.totalRecords || 0);
//       } else {
//         const errorMsg = response.data?.message || "Failed to fetch completed bets";
//         toast.error(errorMsg);
//       }
//     } catch (error) {
//       console.error("Error fetching completed bets:", error);
//       const errorMsg =
//         error.response?.data?.message ||
//         error.message ||
//         "Failed to fetch completed bets";
//       toast.error(errorMsg);
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
//     fetchCompletedBets(1);
//   };

//   const handleClearSearch = () => {
//     setSearchTerm("");
//     setSport("ALL");
//     setFromDate("");
//     setToDate("");
//     setBetType("ALL");
//     setCurrentPage(1);
//   };

//   const hasActiveFilters =
//     searchTerm ||
//     sport !== "ALL" ||
//     fromDate ||
//     toDate ||
//     betType !== "ALL";

//   const getSportName = (sportId) => {
//     const sports = {
//       1: "Football",
//       2: "Cricket",
//       3: "Tennis",
//       4: "Horse Racing",
//       5: "Greyhound Racing",
//       6: "Kabaddi",
//       7: "Casino",
//       8: "Politics"
//     };
//     return sports[sportId] || "N/A";
//   };

//   const getStatusBadge = (isSettled, matchStatus) => {
//     if (isSettled === 1) {
//       return <span className="badge bg-success">Settled</span>;
//     } else if (matchStatus === "3") {
//       return <span className="badge bg-warning">In Progress</span>;
//     } else {
//       return <span className="badge bg-secondary">Pending</span>;
//     }
//   };

//   const getResultBadge = (resultVal) => {
//     if (resultVal === "WIN" || resultVal === 1) {
//       return <span className="badge bg-success">Win</span>;
//     } else if (resultVal === "LOSS" || resultVal === 0) {
//       return <span className="badge bg-danger">Loss</span>;
//     } else {
//       return <span className="badge bg-secondary">{resultVal || "N/A"}</span>;
//     }
//   };

//   return (
//     <>
//       <ToastContainer autoClose={500} theme="colored" />

//       <div className="card">
//         <div className="card-header bg-primary-yellow d-flex justify-content-between align-items-center gap-2">
//           <h5 className="card-title mb-0">Bet History</h5>
//           <div className="d-flex align-items-center">
//             <button
//               onClick={() => navigate(-1)}
//               className="btn btn-outline-light"
//             >
//               Back
//             </button>
//           </div>
//         </div>

//         <div className="card-body">
//           {/* <div className="row mb-3 align-items-center">
//             <div className="col-md-2">
//               <Form.Control
//                 type="text"
//                 placeholder="Search..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//             <div className="col-md-2">
//               <Form.Select
//                 value={sport}
//                 onChange={(e) => setSport(e.target.value)}
//               >
//                 <option value="ALL">ALL</option>
//                 <option value="1">Football</option>
//                 <option value="2">Cricket</option>
//                 <option value="3">Tennis</option>
//                 <option value="4">Horse Racing</option>
//                 <option value="5">Greyhound Racing</option>
//                 <option value="6">Kabaddi</option>
//                 <option value="7">Casino</option>
//                 <option value="8">Politics</option>
//               </Form.Select>
//             </div>
//             <div className="col-md-2">
//               <Form.Select
//                 value={betType}
//                 onChange={(e) => setBetType(e.target.value)}
//               >
//                 <option value="ALL">All Types</option>
//                 <option value="match_odds">Match Odds</option>
//                 <option value="bookmaker">Bookmaker</option>
//                 <option value="fancy">Fancy</option>
//               </Form.Select>
//             </div>
//             <div className="col-md-2">
//               <Form.Control
//                 type="date"
//                 value={fromDate}
//                 onChange={(e) => setFromDate(e.target.value)}
//               />
//             </div>
//             <div className="col-md-2">
//               <Form.Control
//                 type="date"
//                 value={toDate}
//                 onChange={(e) => setToDate(e.target.value)}
//               />
//             </div>
//             <div className="col-md-1">
//               <Button onClick={handleSearch}>
//                 <FiSearch />
//               </Button>
//             </div>
//             {hasActiveFilters && (
//               <div className="col-md-1">
//                 <Button variant="secondary" onClick={handleClearSearch}>
//                   Clear
//                 </Button>
//               </div>
//             )}
//           </div> */}

//           {/* <div className="table-responsive">
//             <table className="table table-bordered table-hover table-striped">
//               <thead className="table-dark">
//                 <tr>
//                   <th>NO</th>
//                   <th>USERNAME</th>
//                   <th>RUNNER NAME</th>
//                   <th>ROUND ID</th>
//                   <th>Transaction ID</th>
//                   <th className="text-end">Game ID</th>
//                   <th>Game Code</th>
//                   <th>Amount</th>
//                   <th>DATE/TIME</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {loading ? (
//                   <tr>
//                     <td colSpan="9" className="table_loader">
//                       <div className="text-center py-5">
//                         <Loader />
//                       </div>
//                     </td>
//                   </tr>
//                 ) : betsData.length === 0 ? (
//                   <tr>
//                     <td colSpan="9">
//                       <h5 className="fs-6 text-dark py-5 text-center">
//                         No Completed Bets Found
//                       </h5>
//                     </td>
//                   </tr>
//                 ) : (
//                   <>
//                     {betsData.map((item, index) => {
//                       const serialNo = (currentPage - 1) * limit + index + 1;
//                       return (
//                         <tr key={item._id || index}>
//                           <td>{serialNo}</td>
//                           <td>{item.username || "N/A"}</td>
//                           <td>{item.team || "N/A"}</td>
//                           <td>{item.event_id || "-"}</td>
//                           <td>{item.bet_id} </td>
//                           <td className="text-end">
//                             {item.sport_id || "-"}
//                           </td>
//                           <td>
//                             {item.market_id || "-" }
//                           </td>

//                            <td>
//                             {item.stake || "-" }
//                           </td>

//                           <td>
//                             {item.date_time ?
//                               new Date(item.date_time).toLocaleString() :
//                               new Date(item.created_at).toLocaleString()
//                             }
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </>
//                 )}
//               </tbody>
//             </table>
//           </div> */}

//           <div className="table-responsive">
//             <table className="table table-bordered table-hover table-striped">
//               <thead className="table-dark">
//                 <tr>
//                   <th>NO</th>
//                   <th>USERNAME</th>
//                   <th>RUNNER NAME</th>
//                   <th>ROUND ID</th>
//                   <th>Bet Type</th>
//                   <th>ODDS</th>
//                   <th>STAKES</th>
//                   {/* <th>RESULT</th> */}
//                   {/* <th>STATUS</th> */}
//                   <th>DATE/TIME</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {loading ? (
//                   <tr>
//                     <td colSpan="9" className="table_loader">
//                       <div className="text-center py-5">
//                         <Loader />
//                       </div>
//                     </td>
//                   </tr>
//                 ) : betsData.length === 0 ? (
//                   <tr>
//                     <td colSpan="9">
//                       <h5 className="fs-6 text-dark py-5 text-center">
//                         No Completed Bets Found
//                       </h5>
//                     </td>
//                   </tr>
//                 ) : (
//                   betsData.map((item, index) => {
//                     const serialNo = (currentPage - 1) * limit + index + 1;
//                     return (
//                       <tr key={item._id || index}>
//                         <td>{serialNo}</td>
//                         <td>{item.username || "N/A"}</td>
//                         <td>{item.team || item.runner_name || "N/A"}</td>
//                         <td>{item.event_id || item.round_id || "-"}</td>
//                         <td>{item.bet_type || "-"}</td>
//                         <td>{item.odd || item.odds || "-"}</td>
//                         <td>{item.stake || item.amount || "-"}</td>
//                         {/* <td >

//               </td> */}
//                         {/* <td>
//                           {item.is_settled === 1 ? 'Settled' : 'Pending'}
//                         </td> */}

//                         <td>
//                           {item.date_time ?
//                             new Date(item.date_time).toLocaleString() :
//                             new Date(item.created_at).toLocaleString()
//                           }
//                         </td>
//                       </tr>
//                     );
//                   })
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* PAGINATION */}
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
//     </>
//   );
// };

// export default CompletedBets;


//uper wala page sabhi ke laiye common tha 

// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams, useLocation } from "react-router-dom";
// import {
//   MdOutlineKeyboardArrowRight,
//   MdOutlineKeyboardArrowLeft,
//   MdKeyboardDoubleArrowRight,
//   MdKeyboardDoubleArrowLeft,
// } from "react-icons/md";
// import { FiSearch } from "react-icons/fi";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { Form, Button } from "react-bootstrap";
// import { getEventBetsCompletedAll } from "../../Server/api";
// import Loader from "../../Common/Loader";

// const CompletedBets = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { adminId, eventId, marketId, sportId } = useParams();
//   const navigationPayload = location.state?.payload || {};

//   const [loading, setLoading] = useState(true);
//   const [betsData, setBetsData] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sport, setSport] = useState("ALL");
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [betType, setBetType] = useState("ALL");

//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [limit] = useState(50);

//   useEffect(() => {
//     fetchCompletedBets(currentPage);
//   }, [
//     currentPage,
//     searchTerm,
//     sport,
//     fromDate,
//     toDate,
//     betType,
//   ]);

//   const fetchCompletedBets = async (page = currentPage) => {
//     try {
//       setLoading(true);
//       const loggedInAdminId = localStorage.getItem("admin_id");

//       const finalSportId = sportId || navigationPayload.sport_id || (sport !== "ALL" ? parseInt(sport) : null);

//       const payload = {
//         admin_id: navigationPayload.admin_id || loggedInAdminId || adminId,
//         role: navigationPayload.role || parseInt(localStorage.getItem("role")) || 1,
//         page: page,
//         limit: limit,
//         search: searchTerm,
//         sport: sport,
//         from_date: fromDate,
//         to_date: toDate,
//         bet_type: betType
//       };

//       if (finalSportId) {
//         payload.sport_id = finalSportId;
//       }

//       console.log("Sending Completed Bets Payload:", payload);

//       const response = await getEventBetsCompletedAll(payload);
//       console.log("Completed Bets Response:", response);

//       if (response.data && response.data.status_code === 1) {
//         let data = response.data.data || [];

//         if (finalSportId) {
//           data = data.filter(item => item.sport_id === parseInt(finalSportId));
//           console.log(`Filtered data for sport_id ${finalSportId}:`, data.length);
//         }

//         setBetsData(data);

//         const filteredTotal = data.length;
//         const calculatedTotalPages = Math.ceil(filteredTotal / limit) || 1;

//         setTotalPages(calculatedTotalPages);
//         setCurrentPage(1);
//         setTotalRecords(filteredTotal);
//       } else {
//         const errorMsg = response.data?.message || "Failed to fetch completed bets";
//         toast.error(errorMsg);
//       }
//     } catch (error) {
//       console.error("Error fetching completed bets:", error);
//       const errorMsg =
//         error.response?.data?.message ||
//         error.message ||
//         "Failed to fetch completed bets";
//       toast.error(errorMsg);
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
//     fetchCompletedBets(1);
//   };

//   const handleClearSearch = () => {
//     setSearchTerm("");
//     setSport("ALL");
//     setFromDate("");
//     setToDate("");
//     setBetType("ALL");
//     setCurrentPage(1);
//   };

//   const hasActiveFilters =
//     searchTerm ||
//     sport !== "ALL" ||
//     fromDate ||
//     toDate ||
//     betType !== "ALL";

//   // ✅ Sport ID check
//   const finalSportId = parseInt(sportId) || parseInt(navigationPayload.sport_id) || (sport !== "ALL" ? parseInt(sport) : null);
//   const isCricket = finalSportId === 4;
//   const isTennis = finalSportId === 2;
//   const isFootball = finalSportId === 1;
//   const isHorseRacing = finalSportId === 7;
//   const isGreyhound = finalSportId === 8;
//   const isCasino = finalSportId === 10;

//   // ✅ Get Table Headers based on sport
//   const getTableHeaders = () => {
//     // Cricket (4), Tennis (2), Football (1), Horse Racing (7), Greyhound (8)
//     if (isCricket || isTennis || isFootball || isHorseRacing || isGreyhound) {
//       return (
//         <tr>
//           <th>NO</th>
//           <th>USERNAME</th>
//           <th>RUNNER</th>
//           <th>RATE</th>
//           <th>STAKE</th>
//           <th>COMM IN</th>
//           <th>COMM OUT</th>
//           <th>TOTAL</th>
//           <th>DATE/TIME</th>
//         </tr>
//       );
//     }

//     // Casino (10)
//     if (isCasino) {
//       return (
//         <tr>
//           <th>NO</th>
//           <th>USERNAME</th>
//           <th>ROUND ID</th>
//           <th>TRANSACTION ID</th>
//           <th>GAME ID</th>
//           <th>GAME CODE</th>
//           <th>AMOUNT</th>
//           <th>DATE/TIME</th>
//         </tr>
//       );
//     }

//     // Default
//     return (
//       <tr>
//         <th>NO</th>
//         <th>USERNAME</th>
//         <th>RUNNER</th>
//         <th>RATE</th>
//         <th>STAKE</th>
//         <th>COMM IN</th>
//         <th>COMM OUT</th>
//         <th>TOTAL</th>
//         <th>DATE/TIME</th>
//       </tr>
//     );
//   };

//   // ✅ Render Table Row based on sport (SIRF EK BAAR)
//   const renderTableRow = (item, serialNo) => {
//     // Cricket, Tennis, Football, Horse Racing, Greyhound - Same layout
//     if (isCricket || isTennis || isFootball || isHorseRacing || isGreyhound) {
//       return (
//         <tr key={item._id || serialNo}>
//           <td>{serialNo}</td>
//           <td>{item.username || "N/A"}</td>
//           <td>{item.team || item.runner_name || "N/A"}</td>
//           <td>{item.odd  || "-"} / {item.total.toFixed(2)}</td>
//           <td>{item.stake || item.amount || "-"}</td>
//           <td>0.00</td>
//           <td>0.00</td>
//           <td className={item.total < 0 ? "text-danger" : "text-success"}>
//             {Number(item.total || 0).toFixed(2)}
//           </td>
//           <td>
//             {item.date_time ?
//               new Date(item.date_time).toLocaleString() :
//               new Date(item.created_at).toLocaleString()
//             }
//           </td>
//         </tr>
//       );
//     }

//     // Casino (10)
//     if (isCasino) {
//       return (
//         <tr key={item._id || serialNo}>
//           <td>{serialNo}</td>
//           <td>{item.username || "N/A"}</td>
//           <td>{item.event_id || item.round_id || "-"}</td>
//           <td>{item.bet_id || item.transaction_id || "-"}</td>
//           <td>{item.game_id || item.sport_id || "-"}</td>
//           <td>{item.team || item.runner_name || "-"}</td>
//           <td>{item.stake || item.amount || "-"}</td>
//           <td>
//             {item.date_time ?
//               new Date(item.date_time).toLocaleString() :
//               new Date(item.created_at).toLocaleString()
//             }
//           </td>
//         </tr>
//       );
//     }

//     // Default
//     return (
//       <tr key={item._id || serialNo}>
//         <td>{serialNo}</td>
//         <td>{item.username || "N/A"}</td>
//         <td>{item.team || item.runner_name || "N/A"}</td>
//         <td>{item.odd || item.odds || "-"}</td>
//         <td>{item.stake || item.amount || "-"}</td>
//         <td>0.00</td>
//         <td>0.00</td>
//         <td className={item.total < 0 ? "text-danger" : "text-success"}>
//           {Number(item.total || 0).toFixed(2)}
//         </td>
//         <td>
//           {item.date_time ?
//             new Date(item.date_time).toLocaleString() :
//             new Date(item.created_at).toLocaleString()
//           }
//         </td>
//       </tr>
//     );
//   };

//   return (
//     <>
//       <ToastContainer autoClose={500} theme="colored" />

//       <div className="card">
//         <div className="card-header bg-primary-yellow d-flex justify-content-between align-items-center gap-2">
//           <h5 className="card-title mb-0">Bet History</h5>
//           <div className="d-flex align-items-center">
//             <button
//               onClick={() => navigate(-1)}
//               className="btn btn-outline-light"
//             >
//               Back
//             </button>
//           </div>
//         </div>

//         <div className="card-body">
//           <div className="table-responsive">
//             <table className="table table-bordered table-hover table-striped">
//               <thead className="table-dark">
//                 {getTableHeaders()}
//               </thead>

//               <tbody>
//                 {loading ? (
//                   <tr>
//                     <td colSpan="9" className="table_loader">
//                       <div className="text-center py-5">
//                         <Loader />
//                       </div>
//                     </td>
//                   </tr>
//                 ) : betsData.length === 0 ? (
//                   <tr>
//                     <td colSpan="9">
//                       <h5 className="fs-6 text-dark py-5 text-center">
//                         No Completed Bets Found
//                       </h5>
//                     </td>
//                   </tr>
//                 ) : (
//                   betsData.map((item, index) => {
//                     const serialNo = (currentPage - 1) * limit + index + 1;
//                     return renderTableRow(item, serialNo);
//                   })
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* PAGINATION */}
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
//     </>
//   );
// };

// export default CompletedBets;


/////////lates code 25-08-2026
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardArrowLeft,
  MdKeyboardDoubleArrowRight,
  MdKeyboardDoubleArrowLeft,
} from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Form, Button } from "react-bootstrap";
import { getEventBetsCompletedAll } from "../../Server/api";
import Loader from "../../Common/Loader";

const CompletedBets = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { adminId, eventId, marketId, sportId } = useParams();
  const navigationPayload = location.state?.payload || {};

  const [loading, setLoading] = useState(true);
  const [betsData, setBetsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sport, setSport] = useState("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [betType, setBetType] = useState("ALL");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [limit] = useState(50);

  useEffect(() => {
    fetchCompletedBets(currentPage);
  }, [
    currentPage,
    searchTerm,
    sport,
    fromDate,
    toDate,
    betType,
  ]);

  const fetchCompletedBets = async (page = currentPage) => {
    try {
      setLoading(true);
      const loggedInAdminId = localStorage.getItem("admin_id");

      // ✅ SIRF SPORT_ID LO - KOI MATCH MAT KARO
      let urlSportId = sportId || navigationPayload.sport_id || null;

      // ✅ AGAR SPORT_ID NULL HAI AUR EVENT_ID "10" HAI TOH SPORT_ID = "10"
      if (!urlSportId && eventId === "10") {
        urlSportId = "10";
      }

      console.log("🔍 urlSportId:", urlSportId);

      const payload = {
        admin_id: navigationPayload.admin_id || loggedInAdminId || adminId,
        role: navigationPayload.role || parseInt(localStorage.getItem("role")) || 1,
        page: page,
        limit: limit,
        search: searchTerm,
        sport: sport,
        from_date: fromDate,
        to_date: toDate,
        bet_type: betType
      };

      // ✅ SIRF SPORT_ID BHEJO - KUCH AUR MAT BHEJO
      if (urlSportId && urlSportId !== "undefined" && urlSportId !== "null" && urlSportId !== "") {
        payload.sport_id = parseInt(urlSportId);
      }

      // ✅ CASINO KE LIYE BET_TYPE SET KARO
      if (parseInt(urlSportId) === 10) {
        payload.bet_type = "casino";
      }

      console.log("📤 Sending Payload:", payload);

      const response = await getEventBetsCompletedAll(payload);
      console.log("📥 Response:", response);

      if (response.data && response.data.status_code === 1) {
        let data = response.data.data || [];
        console.log("📊 Raw Data length:", data.length);

        // ✅ SIRF SPORT_ID SE FILTER KARO - KUCH AUR MAT KARO
        if (urlSportId && urlSportId !== "undefined" && urlSportId !== "null" && urlSportId !== "") {
          const sportIdStr = String(urlSportId);
          data = data.filter(item => String(item.sport_id) === sportIdStr);
          console.log(`✅ Filtered by sport_id ${sportIdStr}: ${data.length} records`);
        }

        console.log("✅ Final Data length:", data.length);

        setBetsData(data);

        const filteredTotal = data.length;
        const calculatedTotalPages = Math.ceil(filteredTotal / limit) || 1;

        setTotalPages(calculatedTotalPages);
        setCurrentPage(1);
        setTotalRecords(filteredTotal);
      } else {
        const errorMsg = response.data?.message || "Failed to fetch completed bets";
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error("❌ Error:", error);
      toast.error("Failed to fetch completed bets");
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
    fetchCompletedBets(1);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSport("ALL");
    setFromDate("");
    setToDate("");
    setBetType("ALL");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchTerm ||
    sport !== "ALL" ||
    fromDate ||
    toDate ||
    betType !== "ALL";

  // ✅ CASINO CHECK - SIRF SPORT_ID SE
  let finalSportId = sportId || navigationPayload.sport_id || null;
  if (!finalSportId && eventId === "10") {
    finalSportId = "10";
  }

  const isCasino = finalSportId === "10";
  const isCricket = finalSportId === "4";
  const isTennis = finalSportId === "2";
  const isFootball = finalSportId === "1";
  const isHorseRacing = finalSportId === "7";
  const isGreyhound = finalSportId === "8";

  console.log("🏷️ finalSportId:", finalSportId);
  console.log("🏷️ isCasino:", isCasino);

  const getTableHeaders = () => {
    if (isCasino) {
      return (
        <tr>
          <th>NO</th>

          <th>USERNAME</th>
          <th>Round ID</th>
          <th>Transaction ID</th>
          <th>Sport NAME</th>
          <th>MARKET NAME</th>
          <th>SPORT</th>

          <th>BET TYPE</th>
          <th>AMOUNT</th>
          <th>RESULT</th>
          <th>DATE/TIME</th>

        </tr>
      );
    }

    if (isCricket || isTennis || isFootball || isHorseRacing || isGreyhound) {
      return (
        <tr>
          <th>NO</th>
          <th>USERNAME</th>
          <th>RUNNER</th>
          <th>RATE</th>
          <th>STAKE</th>
          <th>Bet Type</th>
          <th>COMM IN</th>
          <th>COMM OUT</th>
          <th>TOTAL</th>
          <th>DATE/TIME</th>
        </tr>
      );
    }

    return (
      <tr>
        <th>NO</th>
        <th>USERNAME</th>
        <th>RUNNER</th>
        <th>RATE</th>
        <th>STAKE</th>
        <th>Bet Type</th>
        <th>COMM IN</th>
        <th>COMM OUT</th>
        <th>TOTAL</th>
        <th>DATE/TIME</th>
      </tr>
    );
  };

  const getColorClass = (winLoss) => {
    if (winLoss === "WIN") return "text-success";
    if (winLoss === "LOSS") return "text-danger";
    return "";
  };

  const renderTableRow = (item, serialNo) => {
    // Casino
    // Casino
    if (isCasino) {
      return (
        <tr key={item._id || serialNo}>
          <td>{serialNo}</td>

          <td>{item.username || "-"}</td>
          <td>{item.market_id || "-"}</td>
          <td>{item.bet_id || "-"}</td>
          <td>{item.event_name || "-"}</td>
          <td>{item.market_name || "-"}</td>
          <td>{item.sport_name || "-"}</td>

          <td>
            {item.bet_type
              ? item.bet_type.replace(/_/g, " ")
              : "-"}
          </td>
          <td className={getColorClass(item.win_loss)}>
            {formatNumber(item.amount || 0)}
          </td>
          <td>
            <span className={getColorClass(item.win_loss)}>
              {item.win_loss || "N/A"}
            </span>
          </td>
          <td>
            {item.created_at ? new Date(item.created_at).toLocaleString() : "N/A"}
          </td>
        </tr>
      );
    }

    // Cricket, Tennis, Football, Horse Racing, Greyhound
    if (isCricket || isTennis || isFootball || isHorseRacing || isGreyhound) {
      return (
        <tr key={item._id || serialNo}>
          <td>{serialNo}</td>
          <td>{item.username || item.admin_username || "N/A"}</td>
          <td>{item.team_name || item.bet_on || "N/A"}</td>
          <td>{item.odd || "-"} / {formatNumber(item.total || 0)}</td>
          <td>{formatNumber(item.stake || 0)}</td>
          <td>
            {item.bet_type
              ? item.bet_type.replace(/_/g, " ")
              : "-"}
          </td>
          <td>0.00</td>
          <td>0.00</td>
          <td className={getColorClass(item.win_loss)}>
            {formatNumber(item.profit_loss || 0)}
          </td>
          <td>
            {item.created_at ? new Date(item.created_at).toLocaleString() : "N/A"}
          </td>
        </tr>
      );
    }

    // Default
    return (
      <tr key={item._id || serialNo}>
        <td>{serialNo}</td>
        <td>{item.username || item.admin_username || "N/A"}</td>
        <td>{item.team_name || item.bet_on || "N/A"}</td>
        <td>{item.odd || "-"}</td>
        <td>{formatNumber(item.stake || 0)}</td>
        <td>
          {item.bet_type
            ? item.bet_type.replace(/_/g, " ")
            : "-"}
        </td>
        <td>0.00</td>
        <td>0.00</td>
        <td className={getColorClass(item.win_loss)}>
          {formatNumber(item.profit_loss || 0)}
        </td>
        <td>
          {item.created_at ? new Date(item.created_at).toLocaleString() : "N/A"}
        </td>
      </tr>
    );
  };

  return (
    <>
      <ToastContainer autoClose={500} theme="colored" />

      <div className="card">
        <div className="card-header bg-primary-yellow d-flex justify-content-between align-items-center gap-2">
          <h5 className="card-title mb-0">Bet History</h5>
          <div className="d-flex align-items-center">
            <button
              onClick={() => navigate(-1)}
              className="btn btn-outline-light"
            >
              Back
            </button>
          </div>
        </div>

        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered table-hover table-striped">
              <thead className="table-dark">
                {getTableHeaders()}
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="9" className="table_loader">
                      <div className="text-center py-5">
                        <Loader />
                      </div>
                    </td>
                  </tr>
                ) : betsData.length === 0 ? (
                  <tr>
                    <td colSpan="9">
                      <h5 className="fs-6 text-dark py-5 text-center">
                        No Completed Bets Found
                      </h5>
                    </td>
                  </tr>
                ) : (
                  betsData.map((item, index) => {
                    const serialNo = (currentPage - 1) * limit + index + 1;
                    return renderTableRow(item, serialNo);
                  })
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
    </>
  );
};

export default CompletedBets;