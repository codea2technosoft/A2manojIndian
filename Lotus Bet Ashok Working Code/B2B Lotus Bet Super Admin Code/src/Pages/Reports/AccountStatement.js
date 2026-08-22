// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   MdOutlineKeyboardArrowRight,
//   MdOutlineKeyboardArrowLeft,
//   MdKeyboardDoubleArrowRight,
//   MdKeyboardDoubleArrowLeft,
// } from "react-icons/md";
// import { getStatementAll, getAccountStatement } from "../../Server/api";
// import { FiSearch } from "react-icons/fi";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { Spinner, Form, Button } from "react-bootstrap";
// import { FaSearch } from "react-icons/fa";
// import Loader from "../../Common/Loader";

// const AccountStatement = () => {
//   const navigate = useNavigate();
//   const { adminId } = useParams();

//   const [loading, setLoading] = useState(true);
//   const [statementData, setStatementData] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sport_id, setSport] = useState("ALL");
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [transactionType, setTransactionType] = useState("ALL");

//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [limit] = useState(50);

//   const [total, setTotal] = useState({
//     credit: 0,
//     debit: 0,
//     netBalance: 0,
//   });

//   const hasActiveFilters =
//     searchTerm ||
//     sport_id !== "ALL" ||
//     fromDate ||
//     toDate ||
//     transactionType !== "ALL";

//   useEffect(() => {
//     fetchStatementData(currentPage);
//   }, [
//     adminId,
//     currentPage,
//     searchTerm,
//     sport_id,
//     fromDate,
//     toDate,
//     transactionType,
//   ]);

//   const fetchStatementData = async (page = currentPage) => {
//     try {
//       setLoading(true);
//       const loggedInAdminId = localStorage.getItem("admin_id");
//       const res = await getAccountStatement({
//         admin_id: adminId || loggedInAdminId,
//         page,
//         limit,
//         search: searchTerm,
//         sport_id: sport_id,
//         from_date: fromDate,
//         to_date: toDate,
//         transaction_type: transactionType,
//       });

//       const response = res.data;
//       if (response.success) {
//         const data = response.data || [];
//         setStatementData(data);
//         setTotalPages(response.totalPages || 1);
//         setCurrentPage(response.page || 1);
//         setTotalRecords(response.total || 0);
//         calculateTotals(data);
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to fetch statement data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateTotals = (data) => {
//     let credit = 0;
//     let debit = 0;

//     data.forEach((item) => {
//       if (item.win_loss === "WIN" || item.type === "credit") {
//         credit += Number(item.amount || 0);
//       } else if (item.win_loss === "LOSS" || item.type === "debit") {
//         debit += Number(item.amount || 0);
//       }
//     });
//     setTotal({
//       credit,
//       debit,
//       netBalance: data.length ? Number(data[data.length - 1].balance || 0) : 0,
//     });
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
//     fetchStatementData(1);
//   };

//   const handleClearSearch = () => {
//     setSearchTerm("");
//     setSport("ALL");
//     setFromDate("");
//     setToDate("");
//     setTransactionType("ALL");
//     setCurrentPage(1);
//   };

//   const getSport = (item) => {
//     if (!item.match_name) return "-";
//     const matchName = item.match_name.toLowerCase();
//     if (matchName.includes("cricket")) return "Cricket";
//     if (matchName.includes("football")) return "Football";
//     if (matchName.includes("tennis")) return "Tennis";
//     if (matchName.includes("casino")) return "Casino";
//     if (matchName.includes("horse racing")) return "Horse Racing";
//     if (matchName.includes("kabaddi")) return "Kabaddi";
//     if (matchName.includes("politics")) return "Politics";
//     if (matchName.includes("basketball")) return "Basketball";
//     if (matchName.includes("baseball")) return "Baseball";
//     if (matchName.includes("golf")) return "Golf";
//     if (matchName.includes("boxing")) return "Boxing";
//     if (matchName.includes("mma")) return "MMA";
//     if (matchName.includes("wwe")) return "WWE";
//     if (matchName.includes("nfl")) return "NFL";
//     if (matchName.includes("nba")) return "NBA";
//     if (matchName.includes("mlb")) return "MLB";
//     if (matchName.includes("nhl")) return "NHL";
//     if (matchName.includes("rugby")) return "Rugby";
//     if (matchName.includes("f1") || matchName.includes("formula"))
//       return "Formula 1";
//     if (matchName.includes("darts")) return "Darts";
//     if (matchName.includes("snooker")) return "Snooker";
//     if (matchName.includes("badminton")) return "Badminton";
//     if (matchName.includes("handball")) return "Handball";
//     if (matchName.includes("volleyball")) return "Volleyball";
//     if (matchName.includes("table tennis")) return "Table Tennis";
//     if (matchName.includes("esports")) return "Esports";
//     return "-";
//   };

//   const getTransactionTypeLabel = (item) => {
//     if (item.win_loss === "WIN") return "Profit & Loss";
//     if (item.win_loss === "LOSS") return "Profit & Loss";
//     if (item.transaction_type === "Bet") return "Profit & Loss";
//     return item.transaction_type || "Profit & Loss";
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "-";
//     try {
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) return "-";
//       return date.toLocaleString("en-IN", {
//         day: "2-digit",
//         month: "2-digit",
//         year: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//         second: "2-digit",
//         hour12: true,
//       });
//     } catch (error) {
//       return "-";
//     }
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

//   // ✅ Bet History navigate function
//   const handleBetHistoryClick = (item) => {
//     // ✅ event_id aur market_id extract karo
//     const eventId = item.event_id || item.round_id || "";
//     const marketId = item.market_id || item.event_type_id || "";

//     console.log("Navigating to Bet History with:", { eventId, marketId });

//     // ✅ Navigate with payload
//     navigate(`/reports/bet-history/${eventId}/${marketId}`, {
//       state: {
//         payload: {
//           event_id: eventId,
//           market_id: marketId,
//           admin_id: item.admin_id || adminId,
//           bet_type: "bookmaker",
//         },
//       },
//     });
//   };

//   return (
//     <>
//       <ToastContainer autoClose={500} theme="colored" />

//       <div className="card">
//         <div className="card-header bg-white d-flex justify-content-between align-items-center gap-2">
//           <h5 className="card-title mb-0">Account Statement</h5>
//         </div>

//         <div className="card-body">
//           {/* Filter Section */}
//           <div className="row mb-3 align-items-center gy-2">
//             <div className="col-md-2 col-6">
//               <Form.Select
//                 value={sport_id}
//                 onChange={(e) => setSport(e.target.value)}
//                 style={{ fontSize: "13px" }}
//               >
//                 <option value="ALL">ALL</option>
//                 <option value="4">Cricket</option>
//                 <option value="1">Football</option>
//                 <option value="2">Tennis</option>
//                 <option value="10">Casino</option>
//                 <option value="7">Horse Racing</option>
//                 <option value="15">Kabaddi</option>
//                 <option value="20">Politics</option>
//               </Form.Select>
//             </div>

//             <div className="col-md-2 col-6">
//               <Form.Select
//                 value={transactionType}
//                 onChange={(e) => setTransactionType(e.target.value)}
//                 style={{ fontSize: "13px" }}
//               >
//                 <option value="ALL">Profit & Loss</option>
//                 <option value="PROFIT_LOSS">Profit & Loss</option>
//                 <option value="FREE_CHIPS">Free Chips</option>
//                 <option value="coins">Cash</option>
//                 <option value="coins">Cash(0)</option>
//               </Form.Select>
//             </div>

//             <div className="col-md-2 col-6">
//               <Form.Control
//                 type="date"
//                 value={fromDate}
//                 placeholder="Enter Date"
//                 onChange={(e) => setFromDate(e.target.value)}
//                 style={{ fontSize: "13px" }}
//               />
//             </div>

//             <div className="col-md-2 col-6">
//               <Form.Control
//                 type="date"
//                 value={toDate}
//                 placeholder="Enter Date"
//                 onChange={(e) => setToDate(e.target.value)}
//                 style={{ fontSize: "13px" }}
//               />
//             </div>

//             <div className="col-md-1">
//               <Button
//                 onClick={handleSearch}
//                 variant="primary"
//                 style={{ fontSize: "13px" }}
//               >
//                 <FaSearch />
//               </Button>
//             </div>
//             {/* 
//             {hasActiveFilters && (
//               <div className="col-md-1">
//                 <Button variant="secondary" onClick={handleClearSearch} style={{ fontSize: '13px' }}>
//                   Clear
//                 </Button>
//               </div>
//             )} */}
//           </div>

//           <div className="table-responsive">
//             <table className="table table-bordered table-hover table-striped">
//               <thead className="table-dark">
//                 <tr>
//                   <th style={{ width: "50px" }}>NO</th>
//                   <th>DATE</th>
//                   <th>SPORT</th>
//                   <th>DESC</th>
//                   <th>TYPE</th>
//                   <th>D/C</th>
//                   <th>AMOUNT</th>
//                   <th>TOTAL</th>
//                   <th>BALANCE</th>
//                   <th>DETAILS</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {loading ? (
//                   <tr>
//                     <td colSpan="10">
//                       <Loader className="mt-2" />
//                       <p className="text-center py-5">
//                         Loading statement data...
//                       </p>
//                     </td>
//                   </tr>
//                 ) : statementData.length === 0 ? (
//                   <tr>
//                     <td colSpan="10">
//                       <h5 className="fs-6 text-dark py-5 text-center">
//                         No Data Found
//                       </h5>
//                     </td>
//                   </tr>
//                 ) : (
//                   <>
//                     {statementData.map((item, index) => {
//                       const amount = Number(item.amount || 0);
//                       const beforeBalance = Number(
//                         item.before_balance_from || 0,
//                       );
//                       const balance = Number(item.balance || 0);
//                       const trType = item.tr_type || item.type || "-";
//                       const dateValue = item.created_at || item.date;
//                       const sportName = getSport(item);

//                       const amountColor =
//                         amount < 0 ? "text-danger" : "text-success";

//                       return (
//                         <tr key={item.transaction_id || index}>
//                           <td>{(currentPage - 1) * limit + index + 1}</td>
//                           <td>{formatDate(dateValue)}</td>
//                           <td>{item.game_name}</td>
//                           <td>{item.remark || "-"}</td>
//                           <td>{getTransactionTypeLabel(item)}</td>
//                           <td>{trType}</td>
//                           <td
//                             style={{
//                               fontSize: "12px",
//                               fontWeight: "600",
//                             }}
//                             className={amountColor}
//                           >
//                             {amount.toFixed(2)}
//                           </td>
//                           <td style={{ textAlign: "right", fontSize: "12px" }}>
//                             {beforeBalance.toFixed(2)}
//                           </td>
//                           <td>{balance.toFixed(2)}</td>

//                           <td>
//                             <button
//                               className="btn btn gradient-3 btn-rounded bet_btn"
//                               title="Bet History"
//                               onClick={() => handleBetHistoryClick(item)}
//                             >
//                               B
//                             </button>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </>
//                 )}
//               </tbody>
//             </table>
//           </div>
//           {totalPages > 1 && (
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

// export default AccountStatement;
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardArrowLeft,
  MdKeyboardDoubleArrowRight,
  MdKeyboardDoubleArrowLeft,
} from "react-icons/md";
import { getStatementAll, getAccountStatement } from "../../Server/api";
import { FiSearch } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Spinner, Form, Button } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import Loader from "../../Common/Loader";

const AccountStatement = () => {
  const navigate = useNavigate();
  const { adminId } = useParams();

  const [loading, setLoading] = useState(true);
  const [statementData, setStatementData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sport_id, setSport] = useState("ALL");
  // ✅ CHANGE 1: Dates ko EMPTY (null) karo
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [transactionType, setTransactionType] = useState("ALL");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [limit] = useState(50);

  const [total, setTotal] = useState({
    credit: 0,
    debit: 0,
    netBalance: 0,
  });

  const hasActiveFilters =
    searchTerm ||
    sport_id !== "ALL" ||
    fromDate ||
    toDate ||
    transactionType !== "ALL";

  // ✅ CHANGE 2: useEffect - ab sirf page load par ek baar fetch (bina dates)
  useEffect(() => {
    fetchStatementData(currentPage);
  }, [adminId]); // ✅ Sirf adminId change par chalega

  const fetchStatementData = async (page = currentPage) => {
    try {
      setLoading(true);
      const loggedInAdminId = localStorage.getItem("admin_id");
      
      // ✅ CHANGE 3: Payload - sirf filled fields
      const payload = {
        admin_id: adminId || loggedInAdminId,
        page,
        limit,
      };
      
      // Only add non-empty values
      if (searchTerm && searchTerm.trim()) payload.search = searchTerm;
      if (sport_id && sport_id !== "ALL") payload.sport_id = sport_id;
      if (fromDate && fromDate.trim()) payload.from_date = fromDate;
      if (toDate && toDate.trim()) payload.to_date = toDate;
      if (transactionType && transactionType !== "ALL") payload.transaction_type = transactionType;

      console.log("Payload:", payload);

      const res = await getAccountStatement(payload);

      const response = res.data;
      if (response.success) {
        const data = response.data || [];
        setStatementData(data);
        setTotalPages(response.totalPages || 1);
        setCurrentPage(response.page || 1);
        setTotalRecords(response.total || 0);
        calculateTotals(data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch statement data");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = (data) => {
    let credit = 0;
    let debit = 0;

    data.forEach((item) => {
      if (item.win_loss === "WIN" || item.type === "credit") {
        credit += Number(item.amount || 0);
      } else if (item.win_loss === "LOSS" || item.type === "debit") {
        debit += Number(item.amount || 0);
      }
    });
    setTotal({
      credit,
      debit,
      netBalance: data.length ? Number(data[data.length - 1].balance || 0) : 0,
    });
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

  // ✅ CHANGE 4: Search handler - dates ke saath fetch
  const handleSearch = () => {
    setCurrentPage(1);
    fetchStatementData(1);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSport("ALL");
    setFromDate("");
    setToDate("");
    setTransactionType("ALL");
    setCurrentPage(1);
  };

  const getSport = (item) => {
    if (!item.match_name) return "-";
    const matchName = item.match_name.toLowerCase();
    if (matchName.includes("cricket")) return "Cricket";
    if (matchName.includes("football")) return "Football";
    if (matchName.includes("tennis")) return "Tennis";
    if (matchName.includes("casino")) return "Casino";
    if (matchName.includes("horse racing")) return "Horse Racing";
    if (matchName.includes("kabaddi")) return "Kabaddi";
    if (matchName.includes("politics")) return "Politics";
    if (matchName.includes("basketball")) return "Basketball";
    if (matchName.includes("baseball")) return "Baseball";
    if (matchName.includes("golf")) return "Golf";
    if (matchName.includes("boxing")) return "Boxing";
    if (matchName.includes("mma")) return "MMA";
    if (matchName.includes("wwe")) return "WWE";
    if (matchName.includes("nfl")) return "NFL";
    if (matchName.includes("nba")) return "NBA";
    if (matchName.includes("mlb")) return "MLB";
    if (matchName.includes("nhl")) return "NHL";
    if (matchName.includes("rugby")) return "Rugby";
    if (matchName.includes("f1") || matchName.includes("formula"))
      return "Formula 1";
    if (matchName.includes("darts")) return "Darts";
    if (matchName.includes("snooker")) return "Snooker";
    if (matchName.includes("badminton")) return "Badminton";
    if (matchName.includes("handball")) return "Handball";
    if (matchName.includes("volleyball")) return "Volleyball";
    if (matchName.includes("table tennis")) return "Table Tennis";
    if (matchName.includes("esports")) return "Esports";
    return "-";
  };

  const getTransactionTypeLabel = (item) => {
    if (item.win_loss === "WIN") return "Profit & Loss";
    if (item.win_loss === "LOSS") return "Profit & Loss";
    if (item.transaction_type === "Bet") return "Profit & Loss";
    return item.transaction_type || "Profit & Loss";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "-";
      return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
    } catch (error) {
      return "-";
    }
  };

  // ✅ CHANGE 5: Default dates wala useEffect HATAYA
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

  // Bet History navigate function
  const handleBetHistoryClick = (item) => {
    const eventId = item.event_id || item.round_id || "";
    const marketId = item.market_id || item.event_type_id || "";

    console.log("Navigating to Bet History with:", { eventId, marketId });

    navigate(`/reports/bet-history/${eventId}/${marketId}`, {
      state: {
        payload: {
          event_id: eventId,
          market_id: marketId,
          admin_id: item.admin_id || adminId,
          bet_type: "bookmaker",
        },
      },
    });
  };

  return (
    <>
      <ToastContainer autoClose={500} theme="colored" />

      <div className="card">
        <div className="card-header bg-white d-flex justify-content-between align-items-center gap-2">
          <h5 className="card-title mb-0">Account Statement</h5>
        </div>

        <div className="card-body">
          {/* Filter Section */}
          <div className="row mb-3 align-items-center gy-2">
            <div className="col-md-2 col-6">
              <Form.Select
                value={sport_id}
                onChange={(e) => setSport(e.target.value)}
                style={{ fontSize: "13px" }}
              >
                <option value="ALL">ALL</option>
                <option value="4">Cricket</option>
                <option value="1">Football</option>
                <option value="2">Tennis</option>
                <option value="10">Casino</option>
                <option value="7">Horse Racing</option>
                <option value="8">GreyHound Racing</option>
                <option value="15">Kabaddi</option>
                <option value="20">Politics</option>
              </Form.Select>
            </div>

            <div className="col-md-2 col-6">
              <Form.Select
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value)}
                style={{ fontSize: "13px" }}
              >
                <option value="ALL">Profit & Loss</option>
                <option value="PROFIT_LOSS">Profit & Loss</option>
                <option value="FREE_CHIPS">Free Chips</option>
                <option value="coins">Cash</option>
                <option value="coins">Cash(0)</option>
              </Form.Select>
            </div>

            <div className="col-md-2 col-6">
              <Form.Control
                type="date"
                value={fromDate}
                placeholder="Enter Date"
                onChange={(e) => setFromDate(e.target.value)}
                style={{ fontSize: "13px" }}
              />
            </div>

            <div className="col-md-2 col-6">
              <Form.Control
                type="date"
                value={toDate}
                placeholder="Enter Date"
                onChange={(e) => setToDate(e.target.value)}
                style={{ fontSize: "13px" }}
              />
            </div>

            <div className="col-md-1">
              <Button
                onClick={handleSearch}
                variant="primary"
                style={{ fontSize: "13px" }}
              >
                <FaSearch />
              </Button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered table-hover table-striped">
              <thead className="table-dark">
                <tr>
                  <th style={{ width: "50px" }}>NO</th>
                  <th>DATE</th>
                  <th>SPORT</th>
                  <th>DESC</th>
                  <th>TYPE</th>
                 
                  <th>AMOUNT</th>
                  <th>TOTAL</th>
                   <th>D/C</th>
                  <th>BALANCE</th>
                  <th>DETAILS</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="10">
                      <Loader className="mt-2" />
                      <p className="text-center py-5">
                        Loading statement data...
                      </p>
                    </td>
                  </tr>
                ) : statementData.length === 0 ? (
                  <tr>
                    <td colSpan="10">
                      <h5 className="fs-6 text-dark py-5 text-center">
                        No Data Found
                      </h5>
                    </td>
                  </tr>
                ) : (
                  <>
                    {statementData.map((item, index) => {
                      const amount = Number(item.amount || 0);
                      const beforeBalance = Number(
                        item.before_balance || 0,
                      );
                      const balance = Number(item.balance || 0);
                      const trType = item.value_update_by|| "-";
                      const dateValue = item.created_at || item.date;
                      const sportName = getSport(item);

                      const amountColor =
                        amount < 0 ? "text-danger" : "text-success";

                      return (
                        <tr key={item.transaction_id || index}>
                          <td>{(currentPage - 1) * limit + index + 1}</td>
                          <td>{formatDate(dateValue)}</td>
                          <td>{item.game_name}</td>
                          <td>{item.remark || "-"}</td>
                          <td>{getTransactionTypeLabel(item)}</td>
                         
                          <td
                            style={{
                              fontSize: "12px",
                              fontWeight: "600",
                            }}
                            className={amountColor}
                          >
                            {amount.toFixed(2)}
                          </td>
                          <td style={{ textAlign: "right", fontSize: "12px" }}>
                            {beforeBalance.toFixed(2)}
                          </td>
                           <td>{trType}</td>
                          <td>{balance.toFixed(2)}</td>

                          <td>
                            <button
                              className="btn btn gradient-3 btn-rounded bet_btn"
                              title="Bet History"
                              onClick={() => handleBetHistoryClick(item)}
                            >
                              B
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </>
                )}
              </tbody>
            </table>
          </div>
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
    </>
  );
};

export default AccountStatement;