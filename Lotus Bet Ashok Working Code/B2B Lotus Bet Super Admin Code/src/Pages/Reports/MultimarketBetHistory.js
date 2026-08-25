// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams, useLocation } from "react-router-dom";
// import {
//   MdKeyboardDoubleArrowRight,
//   MdKeyboardDoubleArrowLeft,
// } from "react-icons/md";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { getEventBetsMultimarket } from "../../Server/api";
// import Loader from "../../Common/Loader";

// const MultimarketBetHistory = () => {
//   const navigate = useNavigate();
//   const { marketId } = useParams();
//   const location = useLocation();

//   const eventName = location.state?.eventName || location.state?.marketName || "Unknown Event";

//   const [loading, setLoading] = useState(true);
//   const [statementData, setStatementData] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [limit] = useState(50);

//   useEffect(() => {
//     fetchChipStatementData(currentPage);
//   }, [marketId, currentPage]);

//   const fetchChipStatementData = async (page = currentPage) => {
//     try {
//       setLoading(true);
//       const loggedInAdminId = localStorage.getItem("admin_id");
//       const payload = {
//         admin_id: loggedInAdminId,
//         event_id: marketId,
//         page: page,
//         limit: limit,
//       };

//       const response = await getEventBetsMultimarket(payload);

//       // Response mein status_code: 1 hai, success nahi
//       if (response.data && response.data.status_code === 1) {
//         const data = response.data.data || [];
//         setStatementData(data);
//         setTotalPages(response.data.pagination?.totalPages || 1);
//         setCurrentPage(response.data.pagination?.currentPage || 1);
//         setTotalRecords(response.data.pagination?.totalRecords || 0);
//       } else {
//         toast.error(response.data?.message || "Failed to fetch bet history");
//       }
//     } catch (error) {
//       console.error("Error fetching bet history:", error);
//       toast.error("Failed to fetch bet history");
//     } finally {
//       setLoading(false);
//     }
//   };

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

//   const formatDateTime = (dateString) => {
//     if (!dateString) return "N/A";
//     const date = new Date(dateString);
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

//   // Username fetch karne ke liye helper function
//   const getUsername = (item) => {
//     // Agar user_id se username map karna hai toh yahan logic daal
//     // Abhi ke liye user_id hi dikha rahe hain
//     return item.user_id || "N/A";
//   };

//   return (
//     <>
//       <ToastContainer autoClose={500} theme="colored" />

//       <div className="card">
//         <div className="card-header  d-flex justify-content-between align-items-center">
//           <h5 className="card-title mb-0">Bet History - {eventName}</h5>
//           <button onClick={() => navigate(-1)} className="btn btn-outline-dark btn-sm">
//             Back
//           </button>
//         </div>

//         <div className="card-body">
//           <div className="table-responsive">
//             <table className="table table-bordered table-hover table-striped">
//               <thead className="table-dark">
//                 <tr>
//                   <th>NO</th>
//                   <th>USERNAME</th>
//                   <th>EVENT</th>
//                   <th>MARKET TYPE</th>
//                   <th>SELECTION</th>
//                   <th>TYPE</th>
//                   <th>ODDS REQ.</th>
//                   <th>STAKE</th>
//                   <th>PLACE TIME</th>
//                   <th>MATCHED TIME</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {loading ? (
//                   <tr>
//                     <td colSpan="10" className="text-center py-5">
//                       <Loader />
//                     </td>
//                   </tr>
//                 ) : statementData.length === 0 ? (
//                   <tr>
//                     <td colSpan="10" className="text-center py-5">
//                       <h5>No Data Found</h5>
//                     </td>
//                   </tr>
//                 ) : (
//                   statementData.map((item, index) => {
//                     const serialNo = (currentPage - 1) * limit + index + 1;
//                     return (
//                       <tr key={item._id || index}>
//                         <td>{serialNo}</td>
//                         <td>{getUsername(item)}</td>
//                         <td>{item.game_name || eventName || "N/A"}</td>
//                         <td>{item.bet_type || "MATCH_ODDS"}</td>
//                         <td>{item.team || "N/A"}</td>
//                         <td>
//                           <span className={`badge ${item.bet_on === "lay" ? "bg-danger" : "bg-success"}`}>
//                             {item.bet_on || "Back"}
//                           </span>
//                         </td>
//                         <td>{item.odd || "-"}</td>
//                         <td>{item.stake ? Number(item.stake).toFixed(2) : "-"}</td>
//                         <td>{formatDateTime(item.created_at)}</td>
//                         <td>{formatDateTime(item.created_at)}</td>
//                       </tr>
//                     );
//                   })
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {totalPages > 1 && (
//             <div className="d-flex justify-content-center align-items-center mt-3">
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

//                 <button disabled={currentPage === totalPages} onClick={handleNext}>
//                   Next <MdKeyboardDoubleArrowRight />
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       <style jsx="true">{`
//         .table thead th {
//           font-size: 12px;
//           font-weight: 600;
//           text-align: center;
//           white-space: nowrap;
//           padding: 8px 6px;
//         }

//         .table tbody td {
//           font-size: 12px;
//           text-align: center;
//           vertical-align: middle;
//           padding: 6px 4px;
//         }

//         .badge {
//           font-size: 11px;
//           padding: 4px 8px;
//         }

//         .paginationall {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//         }

//         .paginationall button {
//           padding: 6px 12px;
//           border: 1px solid #dee2e6;
//           background: #fff;
//           border-radius: 4px;
//           cursor: pointer;
//           display: flex;
//           align-items: center;
//           gap: 4px;
//           font-size: 13px;
//         }

//         .paginationall button:disabled {
//           opacity: 0.5;
//           cursor: not-allowed;
//         }

//         .paginationnumber {
//           padding: 6px 12px;
//           border: 1px solid #dee2e6;
//           border-radius: 4px;
//           cursor: pointer;
//           min-width: 36px;
//           text-align: center;
//           font-size: 13px;
//         }

//         .paginationnumber.active {
//           background: #007bff;
//           color: #fff;
//           border-color: #007bff;
//         }

//         .bg-primary-yellow {
//           background-color: #ffc107 !important;
//         }
//       `}</style>
//     </>
//   );
// };

// export default MultimarketBetHistory;
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  MdKeyboardDoubleArrowRight,
  MdKeyboardDoubleArrowLeft,
  MdSearch,
} from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getEventBetsMultimarket } from "../../Server/api";
import Loader from "../../Common/Loader";

const MultimarketBetHistory = () => {
  const navigate = useNavigate();
  const { marketId } = useParams();
  const location = useLocation();

  const eventName = location.state?.eventName || location.state?.marketName || "Unknown Event";

  const [loading, setLoading] = useState(true);
  const [statementData, setStatementData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [limit] = useState(50);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // Fetch data function with search support
  const fetchChipStatementData = useCallback(async (page = currentPage, search = searchTerm) => {
    try {
      setLoading(true);
      const loggedInAdminId = localStorage.getItem("admin_id");
      const payload = {
        admin_id: loggedInAdminId,
        event_id: marketId,
        page: page,
        limit: limit,
      };

      // Agar search term hai toh payload mein add karo - 'search' parameter send karo
      if (search && search.trim() !== "") {
        payload.search = search.trim();
      }

      const response = await getEventBetsMultimarket(payload);

      if (response.data && response.data.status_code === 1) {
        const data = response.data.data || [];
        setStatementData(data);
        setTotalPages(response.data.pagination?.totalPages || 1);
        setCurrentPage(response.data.pagination?.currentPage || 1);
        setTotalRecords(response.data.pagination?.totalRecords || 0);
      } else {
        toast.error(response.data?.message || "Failed to fetch bet history");
      }
    } catch (error) {
      console.error("Error fetching bet history:", error);
      toast.error("Failed to fetch bet history");
    } finally {
      setLoading(false);
    }
  }, [marketId, limit]);

  useEffect(() => {
    fetchChipStatementData(currentPage, searchTerm);
  }, [currentPage, searchTerm, fetchChipStatementData]);

  // Search handler
  const handleSearch = () => {
    setSearchTerm(searchInput);
    setCurrentPage(1);
  };

  // Enter key press handler
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Clear search handler
  const handleClearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
    setCurrentPage(1);
  };

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

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
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

  return (
    <>
      <ToastContainer autoClose={500} theme="colored" />

      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
          <h5 className="card-title mb-0">Bet History - {eventName}</h5>
          <div className="d-flex align-items-center gap-2 flex-wrap">
            {/* Search Box */}
            <div className="search-box d-flex align-items-center gap-1">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Search by username..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleKeyPress}
                style={{ width: "200px" }}
              />
              <button
                className="btn btn-primary btn-sm"
                onClick={handleSearch}
              >
                <MdSearch /> Search
              </button>
              {searchTerm && (
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={handleClearSearch}
                >
                  Clear
                </button>
              )}
            </div>
            <button onClick={() => navigate(-1)} className="btn btn-outline-dark btn-sm">
              Back
            </button>
          </div>
        </div>

        <div className="card-body">
          {/* Total Records Info */}
          {!loading && (
            <div className="mb-2 text-muted" style={{ fontSize: "13px" }}>
              Total Records: {totalRecords}
              {searchTerm && ` (Filtered by: "${searchTerm}")`}
            </div>
          )}

          <div className="table-responsive">
            <table className="table table-bordered table-hover table-striped">
              <thead className="table-dark">
                <tr>
                  <th>NO</th>
                  <th>USERNAME</th>
                  <th>EVENT</th>
                  <th>MARKET TYPE</th>
                  <th>SELECTION</th>
                  <th>TYPE</th>
                  <th>ODDS REQ.</th>
                  <th>STAKE</th>
                  <th>PLACE TIME</th>
                  <th>MATCHED TIME</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="10" className="text-center py-5">
                      <Loader />
                    </td>
                  </tr>
                ) : statementData.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center py-5">
                      <h5>No Data Found</h5>
                      {searchTerm && (
                        <p className="text-muted">No results found for "{searchTerm}"</p>
                      )}
                    </td>
                  </tr>
                ) : (
                  statementData.map((item, index) => {
                    const serialNo = (currentPage - 1) * limit + index + 1;
                    return (
                      <tr key={item._id || index}>
                        <td>{serialNo}</td>
                        <td>
                          <span className="fw-bold">
                            {item.user_name || item.user_id || "N/A"}
                          </span>
                        </td>
                        <td>{item.game_name || eventName || "N/A"}</td>
                        <td>
                          <span className="text-uppercase">
                            {item.bet_type || "-"}
                          </span>
                        </td>
                        <td>{item.team || "-"}</td>
                        <td>
                          <span className="text-uppercase fw-bold">
                            {item.bet_on || "Back"}
                          </span>
                        </td>
                        <td>{item.odd || "-"}</td>
                        <td>{item.stake ? Number(item.stake).toFixed(2) : "-"}</td>
                        <td>{formatDateTime(item.created_at)}</td>
                        <td>{formatDateTime(item.created_at)}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="d-flex justify-content-center align-items-center mt-3">
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

                <button disabled={currentPage === totalPages} onClick={handleNext}>
                  Next <MdKeyboardDoubleArrowRight />
                </button>
              </div>
            </div>
          )}

          {/* Page Info */}
          {totalPages > 1 && (
            <div className="text-center text-muted mt-2" style={{ fontSize: "12px" }}>
              Page {currentPage} of {totalPages}
            </div>
          )}
        </div>
      </div>

      <style jsx="true">{`
        .table thead th {
          font-size: 12px;
          font-weight: 600;
          text-align: center;
          white-space: nowrap;
          padding: 8px 6px;
        }

        .table tbody td {
          font-size: 12px;
          text-align: center;
          vertical-align: middle;
          padding: 6px 4px;
        }

        .badge {
          font-size: 11px;
          padding: 4px 8px;
        }

        .paginationall {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .paginationall button {
          padding: 6px 12px;
          border: 1px solid #dee2e6;
          background: #fff;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
        }

        .paginationall button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .paginationnumber {
          padding: 6px 12px;
          border: 1px solid #dee2e6;
          border-radius: 4px;
          cursor: pointer;
          min-width: 36px;
          text-align: center;
          font-size: 13px;
        }

        .paginationnumber.active {
          background: #007bff;
          color: #fff;
          border-color: #007bff;
        }

        .bg-primary-yellow {
          background-color: #ffc107 !important;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .search-box input {
          min-width: 180px;
        }

        @media (max-width: 768px) {
          .search-box input {
            min-width: 120px;
            width: 120px !important;
          }
          
          .card-header {
            flex-direction: column;
            align-items: stretch !important;
          }
          
          .card-header > div {
            flex-wrap: wrap;
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
};

export default MultimarketBetHistory;