// import React, { useState, useEffect } from 'react';
// import { useSearchParams, useNavigate } from 'react-router-dom';
// import {
//   getMetchwiseReport,
//   getdatewiseBetUserReport
// } from "../Server/api";

// function Adownlinesportspl() {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const adminId = searchParams.get('admin_id') || localStorage.getItem("admin_id");
//   const role = searchParams.get('role') || localStorage.getItem("role") || 3;

//   const [activeTab, setActiveTab] = useState('Cricket');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedMatch, setSelectedMatch] = useState(null);
//   const [showDetailTable, setShowDetailTable] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [detailLoading, setDetailLoading] = useState(false);
//   const [matchData, setMatchData] = useState([]);
//   const [detailData, setDetailData] = useState([]);
//   const [detailSummary, setDetailSummary] = useState({
//     admin_win_amount: 0,
//     admin_loss_amount: 0,
//     total_profit: 0
//   });
//   const [summary, setSummary] = useState({
//     total_win_amount: 0,
//     total_loss_amount: 0,
//     total_profit: 0
//   });
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 50,
//     total: 0,
//     totalPages: 0
//   });
//   const [detailPagination, setDetailPagination] = useState({
//     page: 1,
//     limit: 50,
//     total: 0,
//     totalPages: 0
//   });


//   const [fromDate, setFromDate] = useState('');
//   const [toDate, setToDate] = useState('');
//   const [fromTime, setFromTime] = useState('');
//   const [toTime, setToTime] = useState('');

//   // ✅ Format date for API - ADD KARO
//   const formatDateTime = (date, time) => {
//     if (!date) return "";
//     if (time) {
//       return `${date}T${time}:00`;
//     }
//     return date;
//   };


//   // Sport tabs data
//   const sportTabs = ['Cricket', 'Soccer', 'Tennis', 'Greyhound', 'Horse'];

//   // Get sport_id based on active tab
//   const getSportId = (sportName) => {
//     const sportMap = {
//       'Cricket': '4',
//       'Soccer': '1',
//       'Tennis': '2',
//       'Greyhound': '8',
//       'Horse': '7'
//     };
//     return sportMap[sportName];
//   };
//   const fetchMatchWiseReport = async (page = 1) => {
//     if (!adminId) {
//       console.error("No admin_id found");
//       return;
//     }
//     setLoading(true);
//     try {
//       const payload = {
//        // admin_id: adminId,
//         search: searchTerm,
//         sport_id: getSportId(activeTab),
//         from_date: formatDateTime(fromDate, fromTime), // ✅ ADD THIS
//         to_date: formatDateTime(toDate, toTime),       // ✅ ADD THIS
//         page: page,
//         limit: pagination.limit
//       };

//       console.log("Fetching Match Wise Report with payload:", payload);

//       const response = await getMetchwiseReport(payload);
//       console.log("Match Wise Report Response:", response);

//       const responseData = response?.data || response || {};
//       const dataList = responseData.data || [];

//       setMatchData(dataList);
//       if (responseData.summary) {
//         setSummary({
//           total_win_amount: responseData.summary.total_win_amount || 0,
//           total_loss_amount: responseData.summary.total_loss_amount || 0,
//           total_profit: responseData.summary.total_profit || 0
//         });
//       }

//       const paginationData = responseData.pagination || {};
//       setPagination({
//         page: paginationData.current_page || page,
//         limit: paginationData.limit || 50,
//         total: paginationData.total_records || 0,
//         totalPages: paginationData.total_pages || 1
//       });

//     } catch (error) {
//       console.error("Error fetching match wise report:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Just For Today handler - ADD KARO
//   const handleJustForToday = () => {
//     const today = new Date().toISOString().split('T')[0];
//     setFromDate(today);
//     setToDate(today);
//     setFromTime('');
//     setToTime('');
//     fetchMatchWiseReport(1);
//   };

//   // ✅ From Yesterday handler - ADD KARO
//   const handleFromYesterday = () => {
//     const today = new Date();
//     const yesterday = new Date(today);
//     yesterday.setDate(today.getDate() - 1);
//     const dateStr = yesterday.toISOString().split('T')[0];
//     setFromDate(dateStr);
//     setToDate(dateStr);
//     setFromTime('');
//     setToTime('');
//     fetchMatchWiseReport(1);
//   };

//   // Fetch Date Wise Bet User Report (Detail Table - Same Page)
//   const fetchDateWiseBetUserReport = async (eventId, page = 1) => {
//     if (!eventId) {
//       console.error("No event_id found");
//       return;
//     }

//     setDetailLoading(true);
//     try {
//       const payload = {
//         admin_id: adminId,
//         event_id: eventId,
//         bet_type: "all",
//         page: page,
//         limit: detailPagination.limit
//       };

//       console.log("Fetching Date Wise Bet User Report with payload:", payload);

//       const response = await getdatewiseBetUserReport(payload);
//       console.log("Date Wise Bet User Report Response:", response);

//       const responseData = response?.data || response || {};
//       const dataList = responseData.data || [];

//       setDetailData(dataList);

//       // Set detail summary
//       if (responseData.summary) {
//         setDetailSummary({
//           admin_win_amount: responseData.summary.admin_win_amount || 0,
//           admin_loss_amount: responseData.summary.admin_loss_amount || 0,
//           total_profit: responseData.summary.total_profit || 0
//         });
//       }

//       const paginationData = responseData.pagination || {};
//       setDetailPagination({
//         page: paginationData.current_page || page,
//         limit: paginationData.limit || 50,
//         total: paginationData.total_records || 0,
//         totalPages: paginationData.total_pages || 1
//       });

//     } catch (error) {
//       console.error("Error fetching date wise bet user report:", error);
//     } finally {
//       setDetailLoading(false);
//     }
//   };

//   // Handle match click - Show detail table in same page
//   const handleMatchClick = async (item, e) => {
//     e.preventDefault();
//     setSelectedMatch(item);
//     setShowDetailTable(true);
//     const eventId = item.event_id;
//     await fetchDateWiseBetUserReport(eventId);
//   };

//   // Handle back button
//   const handleBackClick = () => {
//     setShowDetailTable(false);
//     setSelectedMatch(null);
//     setDetailData([]);
//     setDetailSummary({
//       admin_win_amount: 0,
//       admin_loss_amount: 0,
//       total_profit: 0
//     });
//   };

//   // Handle Show Bets - Navigate to fancy settled page with IDs
//   const handleShowBets = (item) => {
//     const fancyId = item._id || item.id;
//     const eventId = selectedMatch?.event_id;
//     const marketId = item.market_id || selectedMatch?.market_id;
//     const betType = item.bet_type || selectedMatch?.bet_type || 'fancy';
//     // navigate(`/MatchBetDetails/fancy?fancy_id=${fancyId}&event_id=${eventId}&admin_id=${adminId}&role=${role}`);

//     //navigate(`/MatchBetDetails/fancy?market_id=${marketId}`);
//     navigate(`/MatchBetDetails/fancy?market_id=${marketId}&bet_type=${betType}`);

//   };

//   // Handle search
//   const handleSearch = () => {
//     fetchMatchWiseReport(1);
//   };

//   // Handle reset
//   // const handleReset = () => {
//   //   setSearchTerm('');
//   //   fetchMatchWiseReport(1);
//   // };

//   // ✅ Handle reset - e.preventDefault() add karo
//   const handleReset = (e) => {  // ✅ e parameter add karo
//     e.preventDefault();        // ✅ ADD THIS - page reload rokega
//     setSearchTerm('');
//     setFromDate('');
//     setToDate('');
//     setFromTime('');
//     setToTime('');
//     fetchMatchWiseReport(1);
//   };


//   useEffect(() => {
//     fetchMatchWiseReport();
//   }, [activeTab]);

//   // Calculate totals for main table from summary
//  // Calculate totals for main table from summary
// // const totals = {
// //   pnlPlus: summary.total_win_amount?.toFixed(2) || '0.00',
// //   pnlMinus: summary.total_loss_amount?.toFixed(2) || '0.00',
// //   commission: summary.total_commission?.toFixed(2) ||  '0.00',
// //   finalPL: summary.total_profit?.toFixed(2) || '0.00'
// // };
// const totals = {
//   pnlPlus: summary.total_win_amount?.toFixed(2) || '0.00',
//   pnlMinus: summary.total_loss_amount?.toFixed(2) || '0.00',
//   commission: summary.total_commission?.toFixed(2) || '0.00',  // ✅ Sahi
//   finalPL: summary.total_profit?.toFixed(2) || '0.00'
// };

//   // Calculate totals for detail table from detail summary
//   const detailTotals = {
//     pl: detailSummary.total_profit?.toFixed(2) || '0.00',
//     comPlus: '0.00',
//     comMinus: '0.00',
//     netPL: detailSummary.total_profit?.toFixed(2) || '0.00'
//   };

//   const totalPages = pagination.totalPages || Math.ceil(pagination.total / pagination.limit);
//   const detailTotalPages = detailPagination.totalPages || Math.ceil(detailPagination.total / detailPagination.limit);

//   const handlePageChange = (page) => {
//     if (page >= 1 && page <= totalPages) {
//       fetchMatchWiseReport(page);
//     }
//   };

//   const handleDetailPageChange = (page) => {
//     if (page >= 1 && page <= detailTotalPages) {
//       const eventId = selectedMatch?.event_id;
//       fetchDateWiseBetUserReport(eventId, page);
//     }
//   };

//   // Format date function
//   const formatDate = (dateString) => {
//     if (!dateString) return '-';
//     const date = new Date(dateString);
//     return date.toLocaleString('en-US', {
//       month: '2-digit',
//       day: '2-digit',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit',
//       hour12: true
//     });
//   };

//   return (
//     <div className='allcommon'>
//       <section className="main-inner-outer py-4">
//         <div className="container-fluid">
//           <div className="db-sec">
//             <h2 className="common-heading">
//               {showDetailTable ? (
//                 <div className="d-flex align-items-center">
//                   <button className="btn btn-secondary me-2" onClick={handleBackClick}>
//                     ← Back
//                   </button>
//                   Match Profit/Loss - {selectedMatch?.market_name || ''}
//                 </div>
//               ) : (
//                 'Profit/Loss'
//               )}
//             </h2>
//           </div>
//           <div className="row">
//             {/* Show filters only in main table view */}
//             {!showDetailTable && (
//               <>
//                 <div className="col-md-12">
//                   <div className="inner-wrapper">
//                     <form className="bet_status" onSubmit={(e) => e.preventDefault()}>
//                       <div className="row">
//                         <div className="col-xl-12 col-md-12">
//                           <div className="row">
//                             {/* <div className="mb-lg-0 mb-2 flex-grow-0 pe-2 col-lg-3 col-sm-6">
//                               <div className="bet-sec bet-period">
//                                 <label className="px-2 form-label">From</label>
//                                 <div className="form-group">
//                                   <input
//                                     type="date"
//                                     className="small_form_control form-control"
//                                   />
//                                   <input
//                                     placeholder="00:00"
//                                     type="time"
//                                     className="small_form_control form-control"
//                                     style={{ width: 80 }}
//                                   />
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="mb-lg-0 mb-2 flex-grow-0 ps-2 col-lg-3 col-sm-6">
//                               <div className="bet-sec bet-period">
//                                 <label className="px-2 form-label">To</label>
//                                 <div className="form-group">
//                                   <input
//                                     type="date"
//                                     className="small_form_control form-control"
//                                   />
//                                   <input
//                                     placeholder="00:00"
//                                     type="time"
//                                     className="small_form_control form-control"
//                                     style={{ width: 80 }}
//                                   />
//                                 </div>
//                               </div>
//                             </div> */}

//                             {/* From Date */}
//                             <div className="mb-lg-0 mb-2 flex-grow-0 pe-2 col-lg-3 col-sm-6">
//                               <div className="bet-sec bet-period">
//                                 <label className="px-2 form-label">From</label>
//                                 <div className="form-group d-flex">
//                                   <input
//                                     type="date"
//                                     className="small_form_control form-control"
//                                     value={fromDate}  // ✅ ADD
//                                     onChange={(e) => setFromDate(e.target.value)}  // ✅ ADD
//                                   />
//                                   <input
//                                     placeholder="00:00"
//                                     type="time"
//                                     className="small_form_control form-control ms-2"
//                                     value={fromTime}  // ✅ ADD
//                                     onChange={(e) => setFromTime(e.target.value)}  // ✅ ADD
//                                     style={{ width: 80 }}
//                                   />
//                                 </div>
//                               </div>
//                             </div>

//                             {/* To Date */}
//                             <div className="mb-lg-0 mb-2 flex-grow-0 ps-2 col-lg-3 col-sm-6">
//                               <div className="bet-sec bet-period">
//                                 <label className="px-2 form-label">To</label>
//                                 <div className="form-group d-flex">
//                                   <input
//                                     type="date"
//                                     className="small_form_control form-control"
//                                     value={toDate}  // ✅ ADD
//                                     onChange={(e) => setToDate(e.target.value)}  // ✅ ADD
//                                   />
//                                   <input
//                                     placeholder="00:00"
//                                     type="time"
//                                     className="small_form_control form-control ms-2"
//                                     value={toTime}  // ✅ ADD
//                                     onChange={(e) => setToTime(e.target.value)}  // ✅ ADD
//                                     style={{ width: 80 }}
//                                   />
//                                 </div>
//                               </div>
//                             </div>

//                           </div>
//                         </div>
//                       </div>
//                       <div className="history-btn mt-2">
//                         <ul className="list-unstyled mb-0">
//                           {/* <li>
//                             <button type="button" className="me-0 theme_light_btn btn btn-primary">
//                               Just For Today
//                             </button>
//                           </li>
//                           <li>
//                             <button type="button" className="me-0 theme_light_btn btn btn-primary">
//                               From Yesterday
//                             </button>
//                           </li> */}

//                           <li> <button
//                             type="button"
//                             className="me-0 theme_light_btn btn btn-primary"
//                             onClick={handleJustForToday}  // ✅ ADD
//                           >
//                             Just For Today
//                           </button>
//                           </li>
//                           <li>
//                             <button
//                               type="button"
//                               className="me-0 theme_light_btn btn btn-primary"
//                               onClick={handleFromYesterday}  // ✅ ADD
//                             >
//                               From Yesterday
//                             </button>
//                           </li>

//                           <li>
//                             <button type="button" className="me-0 theme_light_btn theme_dark_btn btn btn-primary" onClick={handleSearch}>
//                               Search
//                             </button>
//                           </li>
//                           {/* <li>
//                             <button type="button" className="me-0 theme_light_btn btn btn-primary" onClick={handleReset}>
//                               Reset
//                             </button>
//                           </li> */}

//                           <li>
//                             <button
//                               type="button"  // ✅ Already hai, but ensure karo
//                               className="me-0 theme_light_btn btn btn-primary"
//                               onClick={handleReset}
//                             >
//                               Reset
//                             </button>
//                           </li>

//                         </ul>
//                       </div>
//                     </form>
//                   </div>
//                 </div>
//                 <div className="col-md-12">
//                   <div className="inner-wrapper">
//                     {sportTabs.map((sport) => (
//                       <button
//                         key={sport}
//                         className={`btn-result ${activeTab === sport ? 'active' : ''}`}
//                         onClick={() => setActiveTab(sport)}
//                         style={{
//                           marginRight: '5px',
//                           backgroundColor: activeTab === sport ? '#007bff' : '#6c757d',
//                           color: 'white',
//                           border: 'none',
//                           padding: '2px 16px',
//                           borderRadius: '4px',
//                           cursor: 'pointer'
//                         }}
//                       >
//                         {sport}
//                       </button>
//                     ))}
//                   </div>
//                   {/* <div>
//                     <input
//                       placeholder="Search"
//                       type="text"
//                       className="form-control"
//                       style={{ maxWidth: "17%", display: 'inline-block', marginLeft: '10px' }}
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
//                     />
//                   </div> */}
//                 </div>
//               </>
//             )}

//             {/* Table Section */}
//             <div className="mt-2 col-lg-12 col-md-12 col-sm-12">
//               <div className="inner-wrapper">
//                 <section className="account-table donwline-match-pl w-100">
//                   <div className="responsive transaction-history w-100">
//                     {loading || detailLoading ? (
//                       <div className="text-center py-4">
//                         <div className="spinner-border text-primary"></div>
//                         <p className="mt-2">Loading data...</p>
//                       </div>
//                     ) : showDetailTable ? (
//                       // Detail Table
//                       <>
//                         <table className="table">
//                           <thead>
//                             <tr>
//                               <th scope="col">Title</th>
//                               <th scope="col">P&amp;L</th>
//                               <th scope="col">Com+</th>
//                               <th scope="col">Com-</th>
//                               <th scope="col">Won By</th>
//                               <th scope="col">Net P&amp;L</th>
//                               <th scope="col">Action</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {/* Total Row */}
//                             <tr style={{ fontWeight: 'bold', backgroundColor: '#f8f9fa' }}>
//                               <td className="text-start">Total</td>
//                               <td>
//                                 <span className={parseFloat(detailTotals.pl) < 0 ? 'text-danger' : 'text-success'}>
//                                   {detailTotals.pl}
//                                 </span>
//                               </td>
//                               <td>
//                                 <span className="text-success">{detailTotals.comPlus}</span>
//                               </td>
//                               <td>
//                                 <span className="text-danger">{detailTotals.comMinus}</span>
//                               </td>
//                               <td></td>
//                               <td>
//                                 <span className={parseFloat(detailTotals.netPL) < 0 ? 'text-danger' : 'text-success'}>
//                                   {detailTotals.netPL}
//                                 </span>
//                               </td>
//                               <td></td>
//                             </tr>

//                             {/* Detail Rows */}
//                             {detailData.length > 0 ? (
//                               detailData.map((item, index) => (
//                                 <tr key={item._id || index}>
//                                   <td className="text-start">{item.team_name || item.title || '-'}</td>
//                                   <td>
//                                     <span className={parseFloat(item.admin_win || 0) < 0 ? 'text-danger' : 'text-success'}>
//                                       {item.admin_win?.toFixed(2) || '0.00'}
//                                     </span>
//                                   </td>
//                                   <td>
//                                     <span className="text-success">0.00</span>
//                                   </td>
//                                   <td>
//                                     <span className="text-danger">0.00</span>
//                                   </td>
//                                   <td>{item.result_val || '-'}</td>
//                                   <td>
//                                     <span className={parseFloat(item.admin_win || 0) < 0 ? 'text-danger' : 'text-success'}>
//                                       {item.admin_win?.toFixed(2) || '0.00'}
//                                     </span>
//                                   </td>
//                                   <td>
//                                     <button
//                                       className="btn btn-primary btn-sm"
//                                       onClick={() => handleShowBets(item)}
//                                     >
//                                       Show Bets
//                                     </button>
//                                   </td>
//                                 </tr>
//                               ))
//                             ) : (
//                               <tr>
//                                 <td colSpan="7" className="text-center" style={{ padding: '20px' }}>
//                                   No details available
//                                 </td>
//                               </tr>
//                             )}
//                           </tbody>
//                         </table>

//                         {/* Detail Pagination */}
//                         {detailPagination.total > 0 && (
//                           <div className="bottom-pagination">
//                             <ul role="navigation" aria-label="Pagination">
//                               <li className={detailPagination.page === 1 ? "previous disabled" : "previous"}>
//                                 <a
//                                   className=" "
//                                   tabIndex={detailPagination.page === 1 ? -1 : 0}
//                                   role="button"
//                                   aria-disabled={detailPagination.page === 1}
//                                   aria-label="Previous page"
//                                   rel="prev"
//                                   onClick={() => handleDetailPageChange(detailPagination.page - 1)}
//                                 >
//                                   &lt;{" "}
//                                 </a>
//                               </li>
//                               {Array.from({ length: Math.min(detailTotalPages, 10) }, (_, i) => i + 1).map(page => (
//                                 <li key={page} className={page === detailPagination.page ? "p-1" : ""}>
//                                   <a
//                                     rel={page === detailPagination.page ? "canonical" : ""}
//                                     role="button"
//                                     className={page === detailPagination.page ? "pagintion-li" : ""}
//                                     tabIndex={-1}
//                                     aria-label={page === detailPagination.page ? "Page " + page + " is your current page" : "Page " + page}
//                                     aria-current={page === detailPagination.page ? "page" : undefined}
//                                     onClick={() => handleDetailPageChange(page)}
//                                   >
//                                     {page}
//                                   </a>
//                                 </li>
//                               ))}
//                               <li className={detailPagination.page === detailTotalPages ? "next disabled" : "next"}>
//                                 <a
//                                   className=""
//                                   tabIndex={detailPagination.page === detailTotalPages ? -1 : 0}
//                                   role="button"
//                                   aria-disabled={detailPagination.page === detailTotalPages}
//                                   aria-label="Next page"
//                                   rel="next"
//                                   onClick={() => handleDetailPageChange(detailPagination.page + 1)}
//                                 >
//                                   {" "}
//                                   &gt;
//                                 </a>
//                               </li>
//                             </ul>
//                           </div>
//                         )}
//                       </>
//                     ) : (
//                       // Main Table
//                       <>
//                         <table className="table">
//                           <thead>
//                             <tr>
//                               <th scope="col">S.No.</th>
//                               <th scope="col">Sport Name</th>
//                               <th scope="col">Match Name</th>
//                               <th scope="col">Match Date.</th>
//                               <th scope="col">Pnl+</th>
//                               <th scope="col">Pnl-</th>
//                               <th scope="col">Commission</th>
//                               <th scope="col">Final P&amp;L</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {/* Total Row */}
//                             <tr style={{ fontWeight: 'bold', backgroundColor: '#f8f9fa' }}>
//                               <td>&nbsp;</td>
//                               <td>&nbsp;</td>
//                               <td className="text-start">Total</td>
//                               <td>&nbsp;</td>
//                               <td>
//                                 <span className={parseFloat(totals.pnlPlus) < 0 ? 'text-danger' : 'text-success'}>
//                                   {totals.pnlPlus}
//                                 </span>
//                               </td>
//                               <td>
//                                 <span className={parseFloat(totals.pnlMinus) < 0 ? 'text-danger' : 'text-success'}>
//                                   {totals.pnlMinus}
//                                 </span>
//                               </td>
//                               <td>{totals.total_commission}</td>
//                               <td>
//                                 <span className={parseFloat(totals.finalPL) < 0 ? 'text-danger' : 'text-success'}>
//                                   ({totals.finalPL})
//                                 </span>
//                               </td>
//                             </tr>

//                             {/* Data Rows */}
//                             {matchData.length > 0 ? (
//                               matchData.map((item, index) => (
//                                 <tr key={item.event_id || index}>
//                                   <td className="text-start">{(pagination.page - 1) * pagination.limit + index + 1}</td>
//                                   <td>{item.game_name || item.sport_name || '-'}</td>
//                                   <td>
//                                     <a
//                                       href="#"
//                                       onClick={(e) => handleMatchClick(item, e)}
//                                       style={{ color: '#007bff', textDecoration: 'none', cursor: 'pointer' }}
//                                     >
//                                       {item.market_name || '-'}
//                                     </a>
//                                   </td>
//                                   <td>{formatDate(item.match_start_date)}</td>
//                                   <td>
//                                     <span className={parseFloat(item.admin_win_amount || 0) < 0 ? 'text-danger' : 'text-success'}>
//                                       {item.admin_win_amount?.toFixed(2) || '0.00'}
//                                     </span>
//                                   </td>
//                                   <td>
//                                     <span className={parseFloat(item.admin_loss_amount || 0) < 0 ? 'text-danger' : 'text-success'}>
//                                       {item.admin_loss_amount?.toFixed(2) || '0.00'}
//                                     </span>
//                                   </td>
//                                   <td>0.00</td>
//                                   <td>
//                                     <span className={parseFloat(item.total_pl || 0) < 0 ? 'text-danger' : 'text-success'}>
//                                       {item.total_pl?.toFixed(2) || '0.00'}
//                                     </span>
//                                   </td>
//                                 </tr>
//                               ))
//                             ) : (
//                               <tr>
//                                 <td colSpan="8" className="text-center" style={{ padding: '20px' }}>
//                                   No data found
//                                 </td>
//                               </tr>
//                             )}
//                           </tbody>
//                         </table>

//                         {/* Main Pagination */}
//                         {pagination.total > 0 && (
//                           <div className="bottom-pagination">
//                             <ul role="navigation" aria-label="Pagination">
//                               <li className={pagination.page === 1 ? "previous disabled" : "previous"}>
//                                 <a
//                                   className=" "
//                                   tabIndex={pagination.page === 1 ? -1 : 0}
//                                   role="button"
//                                   aria-disabled={pagination.page === 1}
//                                   aria-label="Previous page"
//                                   rel="prev"
//                                   onClick={() => handlePageChange(pagination.page - 1)}
//                                 >
//                                   &lt;{" "}
//                                 </a>
//                               </li>
//                               {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map(page => (
//                                 <li key={page} className={page === pagination.page ? "p-1" : ""}>
//                                   <a
//                                     rel={page === pagination.page ? "canonical" : ""}
//                                     role="button"
//                                     className={page === pagination.page ? "pagintion-li" : ""}
//                                     tabIndex={-1}
//                                     aria-label={page === pagination.page ? "Page " + page + " is your current page" : "Page " + page}
//                                     aria-current={page === pagination.page ? "page" : undefined}
//                                     onClick={() => handlePageChange(page)}
//                                   >
//                                     {page}
//                                   </a>
//                                 </li>
//                               ))}
//                               <li className={pagination.page === totalPages ? "next disabled" : "next"}>
//                                 <a
//                                   className=""
//                                   tabIndex={pagination.page === totalPages ? -1 : 0}
//                                   role="button"
//                                   aria-disabled={pagination.page === totalPages}
//                                   aria-label="Next page"
//                                   rel="next"
//                                   onClick={() => handlePageChange(pagination.page + 1)}
//                                 >
//                                   {" "}
//                                   &gt;
//                                 </a>
//                               </li>
//                             </ul>
//                           </div>
//                         )}
//                       </>
//                     )}
//                   </div>
//                 </section>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

// export default Adownlinesportspl;

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  getMetchwiseReport,
  getdatewiseBetUserReport
} from "../Server/api";


function Adownlinesportspl() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const adminId = searchParams.get('admin_id') || localStorage.getItem("admin_id");
  const role = searchParams.get('role') || localStorage.getItem("role") || 3;

  const [activeTab, setActiveTab] = useState('Cricket');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [showDetailTable, setShowDetailTable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [matchData, setMatchData] = useState([]);
  const [detailData, setDetailData] = useState([]);
  const [detailSummary, setDetailSummary] = useState({
    admin_win_amount: 0,
    admin_loss_amount: 0,
    total_profit: 0
  });
  const [summary, setSummary] = useState({
    total_win_amount: 0,
    total_loss_amount: 0,
    total_profit: 0
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0
  });
  const [detailPagination, setDetailPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0
  });


  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');

  // ✅ Format date for API - ADD KARO
  const formatDateTime = (date, time) => {
    if (!date) return "";
    if (time) {
      return `${date}T${time}:00`;
    }
    return date;
  };


  // Sport tabs data
  const sportTabs = ['Cricket', 'Soccer', 'Tennis', 'Greyhound', 'Horse'];

  // Get sport_id based on active tab
  const getSportId = (sportName) => {
    const sportMap = {
      'Cricket': '4',
      'Soccer': '1',
      'Tennis': '2',
      'Greyhound': '8',
      'Horse': '7'
    };
    return sportMap[sportName];
  };
  const fetchMatchWiseReport = async (page = 1) => {
    if (!adminId) {
      console.error("No admin_id found");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        // admin_id: adminId,
        search: searchTerm,
        sport_id: getSportId(activeTab),
        from_date: formatDateTime(fromDate, fromTime), // ✅ ADD THIS
        to_date: formatDateTime(toDate, toTime),       // ✅ ADD THIS
        page: page,
        limit: pagination.limit
      };

      console.log("Fetching Match Wise Report with payload:", payload);

      const response = await getMetchwiseReport(payload);
      console.log("Match Wise Report Response:", response.data.summary.total_commission);

      const responseData = response?.data || response || {};
      const dataList = responseData.data || [];

      setMatchData(dataList);
      if (responseData.summary) {
        setSummary({
          total_win_amount: responseData.summary.total_win_amount || 0,
          total_loss_amount: responseData.summary.total_loss_amount || 0,
          total_profit: responseData.summary.total_profit || 0,
          total_commission: responseData.summary.total_commission || 0
        });
      }

      const paginationData = responseData.pagination || {};
      setPagination({
        page: paginationData.current_page || page,
        limit: paginationData.limit || 50,
        total: paginationData.total_records || 0,
        totalPages: paginationData.total_pages || 1
      });

    } catch (error) {
      console.error("Error fetching match wise report:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Just For Today handler - ADD KARO
  const handleJustForToday = () => {
    const today = new Date().toISOString().split('T')[0];
    setFromDate(today);
    setToDate(today);
    setFromTime('');
    setToTime('');
    fetchMatchWiseReport(1);
  };

  // ✅ From Yesterday handler - ADD KARO
  const handleFromYesterday = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const dateStr = yesterday.toISOString().split('T')[0];
    setFromDate(dateStr);
    setToDate(dateStr);
    setFromTime('');
    setToTime('');
    fetchMatchWiseReport(1);
  };

  // Fetch Date Wise Bet User Report (Detail Table - Same Page)
  const fetchDateWiseBetUserReport = async (eventId, page = 1) => {
    if (!eventId) {
      console.error("No event_id found");
      return;
    }

    setDetailLoading(true);
    try {
      const payload = {
        admin_id: adminId,
        event_id: eventId,
        bet_type: "all",
        page: page,
        limit: detailPagination.limit
      };

      console.log("Fetching Date Wise Bet User Report with payload:", payload);

      const response = await getdatewiseBetUserReport(payload);
      console.log("Date Wise Bet User Report Response:", response);

      const responseData = response?.data || response || {};
      const dataList = responseData.data || [];

      setDetailData(dataList);

      // Set detail summary
      // if (responseData.summary) {
      //   setDetailSummary({
      //     admin_win_amount: responseData.summary.admin_win_amount || 0,
      //     admin_loss_amount: responseData.summary.admin_loss_amount || 0,
      //     total_profit: responseData.summary.total_profit || 0
      //   });
      // }
      // Set detail summary
      if (responseData.summary) {
        setDetailSummary({
          admin_win_amount: responseData.summary.admin_win_amount || 0,
          admin_loss_amount: responseData.summary.admin_loss_amount || 0,
          total_profit: responseData.summary.total_profit || 0,
          total_commission: responseData.summary.total_commission || 0,  // ✅ ADD
          net_total: responseData.summary.net_total || 0                  // ✅ ADD
        });
      }

      const paginationData = responseData.pagination || {};
      setDetailPagination({
        page: paginationData.current_page || page,
        limit: paginationData.limit || 50,
        total: paginationData.total_records || 0,
        totalPages: paginationData.total_pages || 1
      });

    } catch (error) {
      console.error("Error fetching date wise bet user report:", error);
    } finally {
      setDetailLoading(false);
    }
  };

  // Handle match click - Show detail table in same page
  const handleMatchClick = async (item, e) => {
    e.preventDefault();
    setSelectedMatch(item);
    setShowDetailTable(true);
    const eventId = item.event_id;
    await fetchDateWiseBetUserReport(eventId);
  };

  // Handle back button
  const handleBackClick = () => {
    setShowDetailTable(false);
    setSelectedMatch(null);
    setDetailData([]);
    setDetailSummary({
      admin_win_amount: 0,
      admin_loss_amount: 0,
      total_profit: 0,
     
    });
  };

  // Handle Show Bets - Navigate to fancy settled page with IDs
  const handleShowBets = (item) => {
    const fancyId = item._id || item.id;
    const eventId = selectedMatch?.event_id;
    const marketId = item.market_id || selectedMatch?.market_id;
    const betType = item.bet_type || selectedMatch?.bet_type || 'fancy';
    // navigate(`/MatchBetDetails/fancy?fancy_id=${fancyId}&event_id=${eventId}&admin_id=${adminId}&role=${role}`);

    //navigate(`/MatchBetDetails/fancy?market_id=${marketId}`);
    navigate(`/MatchBetDetails/fancy?market_id=${marketId}&bet_type=${betType}`);

  };

  // Handle search
  const handleSearch = () => {
    fetchMatchWiseReport(1);
  };

  // Handle reset
  // const handleReset = () => {
  //   setSearchTerm('');
  //   fetchMatchWiseReport(1);
  // };

  // ✅ Handle reset - e.preventDefault() add karo
  const handleReset = (e) => {  // ✅ e parameter add karo
    e.preventDefault();        // ✅ ADD THIS - page reload rokega
    setSearchTerm('');
    setFromDate('');
    setToDate('');
    setFromTime('');
    setToTime('');
    fetchMatchWiseReport(1);
  };


  useEffect(() => {
    fetchMatchWiseReport();
  }, [activeTab]);

  // Calculate totals for main table from summary
  // Calculate totals for main table from summary
  // const totals = {
  //   pnlPlus: summary.total_win_amount?.toFixed(2) || '0.00',
  //   pnlMinus: summary.total_loss_amount?.toFixed(2) || '0.00',
  //   commission: summary.total_commission?.toFixed(2) ||  '0.00',
  //   finalPL: summary.total_profit?.toFixed(2) || '0.00'
  // };
  const totals = {
    pnlPlus: summary.total_win_amount?.toFixed(2) || '0.00',
    pnlMinus: summary.total_loss_amount?.toFixed(2) || '0.00',
    commission: summary.total_commission?.toFixed(2) || '0.00',  // ✅ Sahi
    finalPL: summary.total_profit?.toFixed(2) || '0.00'
  };

  console.warn("ggggggg", totals);

  // Calculate totals for detail table from detail summary
  const detailTotals = {
    pl: detailSummary.total_profit?.toFixed(2) || '0.00',
    comPlus: '0.00',
    comMinus: '0.00',
    netPL: detailSummary.total_profit?.toFixed(2) || '0.00'
  };

  const totalPages = pagination.totalPages || Math.ceil(pagination.total / pagination.limit);
  const detailTotalPages = detailPagination.totalPages || Math.ceil(detailPagination.total / detailPagination.limit);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      fetchMatchWiseReport(page);
    }
  };

  const handleDetailPageChange = (page) => {
    if (page >= 1 && page <= detailTotalPages) {
      const eventId = selectedMatch?.event_id;
      fetchDateWiseBetUserReport(eventId, page);
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  return (
    <div className='allcommon'>
      <section className="main-inner-outer py-4">
        <div className="container-fluid">
          <div className="db-sec">
            <h2 className="common-heading">
              {showDetailTable ? (
                <div className="d-flex align-items-center">
                  <button className="btn btn-secondary me-2" onClick={handleBackClick}>
                    ← Back
                  </button>
                  Match Profit/Loss - {selectedMatch?.market_name || ''}
                </div>
              ) : (
                'Profit/Loss'
              )}
            </h2>
          </div>
          <div className="row">
            {/* Show filters only in main table view */}
            {!showDetailTable && (
              <>
                <div className="col-md-12">
                  <div className="inner-wrapper">
                    <form className="bet_status" onSubmit={(e) => e.preventDefault()}>
                      <div className="row">
                        <div className="col-xl-12 col-md-12">
                          <div className="row">
                            {/* <div className="mb-lg-0 mb-2 flex-grow-0 pe-2 col-lg-3 col-sm-6">
                              <div className="bet-sec bet-period">
                                <label className="px-2 form-label">From</label>
                                <div className="form-group">
                                  <input
                                    type="date"
                                    className="small_form_control form-control"
                                  />
                                  <input
                                    placeholder="00:00"
                                    type="time"
                                    className="small_form_control form-control"
                                    style={{ width: 80 }}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="mb-lg-0 mb-2 flex-grow-0 ps-2 col-lg-3 col-sm-6">
                              <div className="bet-sec bet-period">
                                <label className="px-2 form-label">To</label>
                                <div className="form-group">
                                  <input
                                    type="date"
                                    className="small_form_control form-control"
                                  />
                                  <input
                                    placeholder="00:00"
                                    type="time"
                                    className="small_form_control form-control"
                                    style={{ width: 80 }}
                                  />
                                </div>
                              </div>
                            </div> */}

                            {/* From Date */}
                            <div className="mb-lg-0 mb-2 flex-grow-0 pe-2 col-lg-3 col-sm-6">
                              <div className="bet-sec bet-period">
                                <label className="px-2 form-label">From</label>
                                <div className="form-group d-flex">
                                  <input
                                    type="date"
                                    className="small_form_control form-control"
                                    value={fromDate}  // ✅ ADD
                                    onChange={(e) => setFromDate(e.target.value)}  // ✅ ADD
                                  />
                                  <input
                                    placeholder="00:00"
                                    type="time"
                                    className="small_form_control form-control ms-2"
                                    value={fromTime}  // ✅ ADD
                                    onChange={(e) => setFromTime(e.target.value)}  // ✅ ADD
                                    style={{ width: 80 }}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* To Date */}
                            <div className="mb-lg-0 mb-2 flex-grow-0 ps-2 col-lg-3 col-sm-6">
                              <div className="bet-sec bet-period">
                                <label className="px-2 form-label">To</label>
                                <div className="form-group d-flex">
                                  <input
                                    type="date"
                                    className="small_form_control form-control"
                                    value={toDate}  // ✅ ADD
                                    onChange={(e) => setToDate(e.target.value)}  // ✅ ADD
                                  />
                                  <input
                                    placeholder="00:00"
                                    type="time"
                                    className="small_form_control form-control ms-2"
                                    value={toTime}  // ✅ ADD
                                    onChange={(e) => setToTime(e.target.value)}  // ✅ ADD
                                    style={{ width: 80 }}
                                  />
                                </div>
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>
                      <div className="history-btn mt-2">
                        <ul className="list-unstyled mb-0">
                          {/* <li>
                            <button type="button" className="me-0 theme_light_btn btn btn-primary">
                              Just For Today
                            </button>
                          </li>
                          <li>
                            <button type="button" className="me-0 theme_light_btn btn btn-primary">
                              From Yesterday
                            </button>
                          </li> */}

                          <li> <button
                            type="button"
                            className="me-0 theme_light_btn btn btn-primary"
                            onClick={handleJustForToday}  // ✅ ADD
                          >
                            Just For Today
                          </button>
                          </li>
                          <li>
                            <button
                              type="button"
                              className="me-0 theme_light_btn btn btn-primary"
                              onClick={handleFromYesterday}  // ✅ ADD
                            >
                              From Yesterday
                            </button>
                          </li>

                          <li>
                            <button type="button" className="me-0 theme_light_btn theme_dark_btn btn btn-primary" onClick={handleSearch}>
                              Search
                            </button>
                          </li>
                          {/* <li>
                            <button type="button" className="me-0 theme_light_btn btn btn-primary" onClick={handleReset}>
                              Reset
                            </button>
                          </li> */}

                          <li>
                            <button
                              type="button"  // ✅ Already hai, but ensure karo
                              className="me-0 theme_light_btn btn btn-primary"
                              onClick={handleReset}
                            >
                              Reset
                            </button>
                          </li>

                        </ul>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="inner-wrapper">
                    {sportTabs.map((sport) => (
                      <button
                        key={sport}
                        className={`btn-result ${activeTab === sport ? 'active' : ''}`}
                        onClick={() => setActiveTab(sport)}
                        style={{
                          marginRight: '5px',
                          backgroundColor: activeTab === sport ? '#007bff' : '#6c757d',
                          color: 'white',
                          border: 'none',
                          padding: '2px 16px',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        {sport}
                      </button>
                    ))}
                  </div>
                  {/* <div>
                    <input
                      placeholder="Search"
                      type="text"
                      className="form-control"
                      style={{ maxWidth: "17%", display: 'inline-block', marginLeft: '10px' }}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div> */}
                </div>
              </>
            )}

            {/* Table Section */}
            <div className="mt-2 col-lg-12 col-md-12 col-sm-12">
              <div className="inner-wrapper">
                <section className="account-table donwline-match-pl w-100">
                  <div className="responsive transaction-history w-100">
                    {loading || detailLoading ? (
                      <div className="text-center py-4">
                        <div className="spinner-border text-primary"></div>
                        <p className="mt-2">Loading data...</p>
                      </div>
                    ) : showDetailTable ? (
                      // Detail Table
                      <>
                        {/* <table className="table">
                          <thead>
                            <tr>
                              <th scope="col">Title</th>
                              <th scope="col">P&amp;L</th>
                              <th scope="col">Com+</th>
                              <th scope="col">Com-</th>
                              <th scope="col">Won By</th>
                              <th scope="col">Net P&amp;L</th>
                              <th scope="col">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr style={{ fontWeight: 'bold', backgroundColor: '#f8f9fa' }}>
                              <td className="text-start">Total</td>
                              <td>
                                <span className={parseFloat(detailTotals.pl) < 0 ? 'text-danger' : 'text-success'}>
                                  {detailTotals.pl}
                                </span>
                              </td>
                              <td>
                                <span className="text-success">{detailTotals.comPlus}</span>
                              </td>
                              <td>
                                <span className="text-danger">{detailTotals.comMinus}</span>
                              </td>
                              <td></td>
                              <td>
                                <span className={parseFloat(detailTotals.netPL) < 0 ? 'text-danger' : 'text-success'}>
                                  {detailTotals.netPL}
                                </span>
                              </td>
                              <td></td>
                            </tr>
                            {detailData.length > 0 ? (
                              detailData.map((item, index) => (
                                <tr key={item._id || index}>
                                  <td className="text-start">{item.team_name || item.title || '-'}</td>
                                  <td>
                                    <span className={parseFloat(item.admin_win || 0) < 0 ? 'text-danger' : 'text-success'}>
                                      {item.admin_win?.toFixed(2) || '0.00'}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="text-success">0.00</span>
                                  </td>
                                  <td>
                                    <span className="text-danger">0.00</span>
                                  </td>
                                  <td>{item.result_val || '-'}</td>
                                  <td>
                                    <span className={parseFloat(item.admin_win || 0) < 0 ? 'text-danger' : 'text-success'}>
                                      {item.admin_win?.toFixed(2) || '0.00'}
                                    </span>
                                  </td>
                                  <td>
                                    <button
                                      className="btn btn-primary btn-sm"
                                      onClick={() => handleShowBets(item)}
                                    >
                                      Show Bets
                                    </button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="7" className="text-center" style={{ padding: '20px' }}>
                                  No details available
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table> */}
                     
                        <>
                          <table className="table">
                            <thead>
                              <tr>
                                <th scope="col">Title</th>
                                <th scope="col">P&amp;L</th>
                                <th scope="col">Commission</th>
                                <th scope="col">Won By</th>
                                <th scope="col">Net P&amp;L</th>
                                <th scope="col">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {/* Total Row - Summary se */}
                              <tr style={{ fontWeight: 'bold', backgroundColor: '#f8f9fa' }}>
                                <td className="text-start">Total</td>
                                <td>
                                  <span className={parseFloat(detailSummary.total_profit || 0) < 0 ? 'text-danger' : 'text-success'}>
                                    {detailSummary.total_profit?.toFixed(2) || '0.00'}
                                  </span>
                                </td>
                                <td>
                                  <span className="text-primary">{detailSummary.total_commission?.toFixed(2) || '0.00'}</span>
                                </td>
                                <td></td>
                                <td>
                                  <span className={parseFloat(detailSummary.net_total || 0) < 0 ? 'text-danger' : 'text-success'}>
                                    {detailSummary.net_total?.toFixed(2) || '0.00'}
                                  </span>
                                </td>
                                <td></td>
                              </tr>

                              {/* Detail Rows - Data se */}
                              {detailData.length > 0 ? (
                                detailData.map((item, index) => {
                                  // ✅ P&L = admin_win - admin_loss
                                  const pl = Number(item.admin_win || 0) - Number(item.admin_loss || 0);
                                  // ✅ Net P&L = net_amount
                                  const netAmount = Number(item.net_amount || 0);

                                  return (
                                    <tr key={item._id || index}>
                                      <td className="text-start">{item.team_name || item.title || '-'}</td>
                                      <td>
                                        <span className={pl < 0 ? 'text-danger' : 'text-success'}>
                                          {pl.toFixed(2)}
                                        </span>
                                      </td>
                                      <td>
                                        <span className="text-primary">{item.commission?.toFixed(2) || '0.00'}</span>
                                      </td>
                                      <td>{'-'}</td>
                                      <td>
                                        <span className={netAmount < 0 ? 'text-danger' : 'text-success'}>
                                          {netAmount.toFixed(2)}
                                        </span>
                                      </td>
                                      <td>
                                        <button
                                          className="btn btn-primary btn-sm"
                                          onClick={() => handleShowBets(item)}
                                        >
                                          Show Bets
                                        </button>
                                      </td>
                                    </tr>
                                  );
                                })
                              ) : (
                                <tr>
                                  <td colSpan="6" className="text-center" style={{ padding: '20px' }}>
                                    No details available
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>

                          {/* Detail Pagination */}
                          {detailPagination.total > 0 && (
                            <div className="bottom-pagination">
                              <ul role="navigation" aria-label="Pagination">
                                <li className={detailPagination.page === 1 ? "previous disabled" : "previous"}>
                                  <a
                                    className=" "
                                    tabIndex={detailPagination.page === 1 ? -1 : 0}
                                    role="button"
                                    aria-disabled={detailPagination.page === 1}
                                    aria-label="Previous page"
                                    rel="prev"
                                    onClick={() => handleDetailPageChange(detailPagination.page - 1)}
                                  >
                                    &lt;{" "}
                                  </a>
                                </li>
                                {Array.from({ length: Math.min(detailTotalPages, 10) }, (_, i) => i + 1).map(page => (
                                  <li key={page} className={page === detailPagination.page ? "p-1" : ""}>
                                    <a
                                      rel={page === detailPagination.page ? "canonical" : ""}
                                      role="button"
                                      className={page === detailPagination.page ? "pagintion-li" : ""}
                                      tabIndex={-1}
                                      aria-label={page === detailPagination.page ? "Page " + page + " is your current page" : "Page " + page}
                                      aria-current={page === detailPagination.page ? "page" : undefined}
                                      onClick={() => handleDetailPageChange(page)}
                                    >
                                      {page}
                                    </a>
                                  </li>
                                ))}
                                <li className={detailPagination.page === detailTotalPages ? "next disabled" : "next"}>
                                  <a
                                    className=""
                                    tabIndex={detailPagination.page === detailTotalPages ? -1 : 0}
                                    role="button"
                                    aria-disabled={detailPagination.page === detailTotalPages}
                                    aria-label="Next page"
                                    rel="next"
                                    onClick={() => handleDetailPageChange(detailPagination.page + 1)}
                                  >
                                    {" "}
                                    &gt;
                                  </a>
                                </li>
                              </ul>
                            </div>
                          )}
                        </>

                        {/* Detail Pagination */}
                        {/* {detailPagination.total > 0 && (
                          <div className="bottom-pagination">
                            <ul role="navigation" aria-label="Pagination">
                              <li className={detailPagination.page === 1 ? "previous disabled" : "previous"}>
                                <a
                                  className=" "
                                  tabIndex={detailPagination.page === 1 ? -1 : 0}
                                  role="button"
                                  aria-disabled={detailPagination.page === 1}
                                  aria-label="Previous page"
                                  rel="prev"
                                  onClick={() => handleDetailPageChange(detailPagination.page - 1)}
                                >
                                  &lt;{" "}
                                </a>
                              </li>
                              {Array.from({ length: Math.min(detailTotalPages, 10) }, (_, i) => i + 1).map(page => (
                                <li key={page} className={page === detailPagination.page ? "p-1" : ""}>
                                  <a
                                    rel={page === detailPagination.page ? "canonical" : ""}
                                    role="button"
                                    className={page === detailPagination.page ? "pagintion-li" : ""}
                                    tabIndex={-1}
                                    aria-label={page === detailPagination.page ? "Page " + page + " is your current page" : "Page " + page}
                                    aria-current={page === detailPagination.page ? "page" : undefined}
                                    onClick={() => handleDetailPageChange(page)}
                                  >
                                    {page}
                                  </a>
                                </li>
                              ))}
                              <li className={detailPagination.page === detailTotalPages ? "next disabled" : "next"}>
                                <a
                                  className=""
                                  tabIndex={detailPagination.page === detailTotalPages ? -1 : 0}
                                  role="button"
                                  aria-disabled={detailPagination.page === detailTotalPages}
                                  aria-label="Next page"
                                  rel="next"
                                  onClick={() => handleDetailPageChange(detailPagination.page + 1)}
                                >
                                  {" "}
                                  &gt;
                                </a>
                              </li>
                            </ul>
                          </div>
                        )} */}
                        {detailPagination.total > 0 && (
                          <div className="bottom-pagination">
                            <ul role="navigation" aria-label="Pagination">
                              <li className={detailPagination.page === 1 ? "previous disabled" : "previous"}>
                                <a
                                  className=" "
                                  tabIndex={detailPagination.page === 1 ? -1 : 0}
                                  role="button"
                                  aria-disabled={detailPagination.page === 1}
                                  aria-label="Previous page"
                                  rel="prev"
                                  onClick={() => handleDetailPageChange(detailPagination.page - 1)}
                                >
                                  &lt;{" "}
                                </a>
                              </li>
                              {Array.from({ length: Math.min(detailTotalPages, 10) }, (_, i) => i + 1).map(page => (
                                <li key={page} className={page === detailPagination.page ? "p-1" : ""}>
                                  <a
                                    rel={page === detailPagination.page ? "canonical" : ""}
                                    role="button"
                                    className={page === detailPagination.page ? "pagintion-li" : ""}
                                    tabIndex={-1}
                                    aria-label={page === detailPagination.page ? "Page " + page + " is your current page" : "Page " + page}
                                    aria-current={page === detailPagination.page ? "page" : undefined}
                                    onClick={() => handleDetailPageChange(page)}
                                  >
                                    {page}
                                  </a>
                                </li>
                              ))}
                              <li className={detailPagination.page === detailTotalPages ? "next disabled" : "next"}>
                                <a
                                  className=""
                                  tabIndex={detailPagination.page === detailTotalPages ? -1 : 0}
                                  role="button"
                                  aria-disabled={detailPagination.page === detailTotalPages}
                                  aria-label="Next page"
                                  rel="next"
                                  onClick={() => handleDetailPageChange(detailPagination.page + 1)}
                                >
                                  {" "}
                                  &gt;
                                </a>
                              </li>
                            </ul>
                          </div>
                        )}
                      </>
                    ) : (
                      // Main Table
                      <>
                        {/* <table className="table">
                          <thead>
                            <tr>
                              <th scope="col">S.No.</th>
                              <th scope="col">Sport Name</th>
                              <th scope="col">Match Name</th>
                              <th scope="col">Match Date.</th>
                              <th scope="col">Pnl+</th>
                              <th scope="col">Pnl-</th>
                              <th scope="col">Commission</th>
                              <th scope="col">Final P&amp;L</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr style={{ fontWeight: 'bold', backgroundColor: '#f8f9fa' }}>
                              <td>&nbsp;</td>
                              <td>&nbsp;</td>
                              <td className="text-start">Total</td>
                              <td>&nbsp;</td>
                              <td>
                                <span className={parseFloat(totals.pnlPlus) < 0 ? 'text-danger' : 'text-success'}>
                                  {totals.pnlPlus}
                                </span>
                              </td>
                              <td>
                                <span className={parseFloat(totals.pnlMinus) < 0 ? 'text-danger' : 'text-success'}>
                                  {totals.pnlMinus}
                                </span>
                              </td>
                              <td>{totals.commission}</td>  
                              <td>
                                <span className={parseFloat(totals.finalPL) < 0 ? 'text-danger' : 'text-success'}>
                                  {totals.finalPL}
                                </span>
                              </td>
                            </tr>

                            {matchData.length > 0 ? (
                              matchData.map((item, index) => (
                                <tr key={item.event_id || index}>
                                  <td className="text-start">{(pagination.page - 1) * pagination.limit + index + 1}</td>
                                  <td>{item.game_name || item.sport_name || '-'}</td>
                                  <td>
                                    <a
                                      href="#"
                                      onClick={(e) => handleMatchClick(item, e)}
                                      style={{ color: '#007bff', textDecoration: 'none', cursor: 'pointer' }}
                                    >
                                      {item.market_name || '-'}
                                    </a>
                                  </td>
                                  <td>{formatDate(item.match_start_date)}</td>
                                  <td>
                                    <span className={parseFloat(item.admin_win_amount || 0) < 0 ? 'text-danger' : 'text-success'}>
                                      {item.admin_win_amount?.toFixed(2) || '0.00'}
                                    </span>
                                  </td>
                                  <td>
                                    <span className={parseFloat(item.admin_loss_amount || 0) < 0 ? 'text-danger' : 'text-success'}>
                                      {item.admin_loss_amount?.toFixed(2) || '0.00'}
                                    </span>
                                  </td>
                                  <td>{item.total_commission?.toFixed(2) || '0.00'}</td>  
                                  <td>
                                    <span className={parseFloat(item.total_pl || 0) < 0 ? 'text-danger' : 'text-success'}>
                                      {item.total_pl?.toFixed(2) || '0.00'}
                                    </span>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="8" className="text-center" style={{ padding: '20px' }}>
                                  No data found
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table> */}
                        <table className="table">
                          <thead>
                            <tr>
                              <th scope="col">S.No.</th>
                              <th scope="col">Sport Name</th>
                              <th scope="col">Match Name</th>
                              <th scope="col">Match Date.</th>
                              <th scope="col">Pnl+</th>
                              <th scope="col">Pnl-</th>
                              <th scope="col">Commission</th>
                              <th scope="col">Final P&amp;L</th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* ✅ Total Row - Summary se */}
                            <tr style={{ fontWeight: 'bold', backgroundColor: '#f8f9fa' }}>
                              <td>&nbsp;</td>
                              <td>&nbsp;</td>
                              <td className="text-start">Total</td>
                              <td>&nbsp;</td>
                              <td>
                                <span className={parseFloat(totals.pnlPlus) < 0 ? 'text-danger' : 'text-success'}>
                                  {totals.pnlPlus}
                                </span>
                              </td>
                              <td>
                                <span className={parseFloat(totals.pnlMinus) < 0 ? 'text-danger' : 'text-success'}>
                                  {totals.pnlMinus}
                                </span>
                              </td>
                              <td>{totals.commission}</td>  {/* ✅ FIX 1 */}
                              <td>
                                <span className={parseFloat(totals.finalPL) < 0 ? 'text-danger' : 'text-success'}>
                                  {totals.finalPL}  {/* ✅ FIX 2 */}
                                </span>
                              </td>
                            </tr>

                            {/* ✅ Data Rows - API se */}
                            {matchData.length > 0 ? (
                              matchData.map((item, index) => (
                                <tr key={item.event_id || index}>
                                  <td className="text-start">{(pagination.page - 1) * pagination.limit + index + 1}</td>
                                  <td>{item.game_name || item.sport_name || '-'}</td>
                                  <td>
                                    <a
                                      href="#"
                                      onClick={(e) => handleMatchClick(item, e)}
                                      style={{ color: '#007bff', textDecoration: 'none', cursor: 'pointer' }}
                                    >
                                      {item.market_name || '-'}
                                    </a>
                                  </td>
                                  <td>{formatDate(item.match_start_date)}</td>
                                  <td>
                                    <span className={parseFloat(item.admin_win_amount || 0) < 0 ? 'text-danger' : 'text-success'}>
                                      {item.admin_win_amount?.toFixed(2) || '0.00'}
                                    </span>
                                  </td>
                                  <td>
                                    <span className={parseFloat(item.admin_loss_amount || 0) < 0 ? 'text-danger' : 'text-success'}>
                                      {item.admin_loss_amount?.toFixed(2) || '0.00'}
                                    </span>
                                  </td>
                                  <td>{item.total_commission?.toFixed(2) || '0.00'}</td>  {/* ✅ FIX 3 */}
                                  <td>
                                    <span className={parseFloat(item.total_pl || 0) < 0 ? 'text-danger' : 'text-success'}>
                                      {item.total_pl?.toFixed(2) || '0.00'}
                                    </span>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="8" className="text-center" style={{ padding: '20px' }}>
                                  No data found
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>

                        {/* Main Pagination */}
                        {/* {pagination.total > 0 && (
                          <div className="bottom-pagination">
                            <ul role="navigation" aria-label="Pagination">
                              <li className={pagination.page === 1 ? "previous disabled" : "previous"}>
                                <a
                                  className=" "
                                  tabIndex={pagination.page === 1 ? -1 : 0}
                                  role="button"
                                  aria-disabled={pagination.page === 1}
                                  aria-label="Previous page"
                                  rel="prev"
                                  onClick={() => handlePageChange(pagination.page - 1)}
                                >
                                  &lt;{" "}
                                </a>
                              </li>
                              {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map(page => (
                                <li key={page} className={page === pagination.page ? "p-1" : ""}>
                                  <a
                                    rel={page === pagination.page ? "canonical" : ""}
                                    role="button"
                                    className={page === pagination.page ? "pagintion-li" : ""}
                                    tabIndex={-1}
                                    aria-label={page === pagination.page ? "Page " + page + " is your current page" : "Page " + page}
                                    aria-current={page === pagination.page ? "page" : undefined}
                                    onClick={() => handlePageChange(page)}
                                  >
                                    {page}
                                  </a>
                                </li>
                              ))}
                              <li className={pagination.page === totalPages ? "next disabled" : "next"}>
                                <a
                                  className=""
                                  tabIndex={pagination.page === totalPages ? -1 : 0}
                                  role="button"
                                  aria-disabled={pagination.page === totalPages}
                                  aria-label="Next page"
                                  rel="next"
                                  onClick={() => handlePageChange(pagination.page + 1)}
                                >
                                  {" "}
                                  &gt;
                                </a>
                              </li>
                            </ul>
                          </div>
                        )} */}
                        {pagination.total > 0 && (
                          <div className="bottom-pagination">
                            <ul role="navigation" aria-label="Pagination">
                              <li className={pagination.page === 1 ? "previous disabled" : "previous"}>
                                <a
                                  className=" "
                                  tabIndex={pagination.page === 1 ? -1 : 0}
                                  role="button"
                                  aria-disabled={pagination.page === 1}
                                  aria-label="Previous page"
                                  rel="prev"
                                  onClick={() => handlePageChange(pagination.page - 1)}
                                >
                                  &lt;{" "}
                                </a>
                              </li>
                              {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map(page => (
                                <li key={page} className={page === pagination.page ? "p-1" : ""}>
                                  <a
                                    rel={page === pagination.page ? "canonical" : ""}
                                    role="button"
                                    className={page === pagination.page ? "pagintion-li" : ""}
                                    tabIndex={-1}
                                    aria-label={page === pagination.page ? "Page " + page + " is your current page" : "Page " + page}
                                    aria-current={page === pagination.page ? "page" : undefined}
                                    onClick={() => handlePageChange(page)}
                                  >
                                    {page}
                                  </a>
                                </li>
                              ))}
                              <li className={pagination.page === totalPages ? "next disabled" : "next"}>
                                <a
                                  className=""
                                  tabIndex={pagination.page === totalPages ? -1 : 0}
                                  role="button"
                                  aria-disabled={pagination.page === totalPages}
                                  aria-label="Next page"
                                  rel="next"
                                  onClick={() => handlePageChange(pagination.page + 1)}
                                >
                                  {" "}
                                  &gt;
                                </a>
                              </li>
                            </ul>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Adownlinesportspl;