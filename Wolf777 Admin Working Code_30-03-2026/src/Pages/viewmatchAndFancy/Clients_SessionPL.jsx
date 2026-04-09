import React, { useState, useEffect } from "react";
import axios from "axios";
import "../viewmatchAndFancy/Eventcss.scss"

function GetEventBets() {
  const admin_id = localStorage.getItem("admin_id");
  const event_id = localStorage.getItem("event_id");
  const token = localStorage.getItem("token");

  const [betsData, setBetsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [totals, setTotals] = useState({
    totalSessionAmount: 0,
    totalSessionComm: 0,
    totalComm: 0,
    totalAmount: 0,
    myShare: 0,
    netPL: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    pageSize: 15
  });

  const getEventBets = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/get-sessions-pl`,
        {
          admin_id,
          event_id,
          page,
          limit: pagination.pageSize
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // ----- Validate API Response -----
      const responseData = res?.data;
      const list = Array.isArray(responseData?.data) ? responseData.data : [];

      if (responseData?.status_code === 1) {
        const cleanList = list.filter(item => item.username !== "TOTAL");
        setBetsData(cleanList);
        setFilteredData(cleanList);
        calculateTotals(cleanList);

        if (responseData.pagination) {
          setPagination(prev => ({
            ...prev,
            currentPage: responseData.pagination.currentPage || page,
            totalPages: responseData.pagination.totalPages || 1,
            totalRecords: responseData.pagination.totalRecords || 0
          }));
        }

      } else {
        setBetsData([]);
        setFilteredData([]);
      }

    } catch (error) {
      console.error("Error fetching event bets", error?.response?.data || error);

      setError("Failed to fetch event bets. Please try again.");
      setBetsData([]);
      setFilteredData([]);

    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = (data) => {
    if (!data || data.length === 0) {
      setTotals({
        totalSessionAmount: 0,
        totalSessionComm: 0,
        totalComm: 0,
        totalAmount: 0,
        myShare: 0,
        netPL: 0
      });
      return;
    }

    const totals = data.reduce(
      (acc, bet) => ({
        totalSessionAmount: acc.totalSessionAmount + (bet.session_amt || 0),
        totalSessionComm: acc.totalSessionComm + (bet.session_comm || 0),
        totalComm: acc.totalComm + (bet.total_comm || 0),
        totalAmount: acc.totalAmount + (bet.total_amount || 0),
        myShare: acc.myShare + (bet.my_share || 0),
        netPL: acc.netPL + (bet.net_pl || 0),
      }),
      {
        totalSessionAmount: 0,
        totalSessionComm: 0,
        totalComm: 0,
        totalAmount: 0,
        myShare: 0,
        netPL: 0,
        totalOverall: 0,
      }
    );

    setTotals(totals);
  };


  useEffect(() => {
    getEventBets(1);
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      getEventBets(newPage);
    }
  };

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setPagination(prev => ({
      ...prev,
      pageSize: newSize,
      currentPage: 1
    }));
    setTimeout(() => getEventBets(1), 0);
  };

  const formatNumber = (num) => {
    return num.toFixed(2);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 5;

    let startPage = Math.max(1, pagination.currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(pagination.totalPages, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    if (startPage > 1) {
      buttons.push(
        <button
          key="first"
          onClick={() => handlePageChange(1)}
          className="pagination-btn"
        >
          «
        </button>
      );
    }

    if (pagination.currentPage > 1) {
      buttons.push(
        <button
          key="prev"
          onClick={() => handlePageChange(pagination.currentPage - 1)}
          className="pagination-btn"
        >
          ‹
        </button>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`pagination-btn ${pagination.currentPage === i ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }

    if (pagination.currentPage < pagination.totalPages) {
      buttons.push(
        <button
          key="next"
          onClick={() => handlePageChange(pagination.currentPage + 1)}
          className="pagination-btn"
        >
          ›
        </button>
      );
    }

    if (endPage < pagination.totalPages) {
      buttons.push(
        <button
          key="last"
          onClick={() => handlePageChange(pagination.totalPages)}
          className="pagination-btn"
        >
          »
        </button>
      );
    }

    return buttons;
  };

  // return (
    // <div className="card mt-4">
    //   <div className="card-header bg-color-black text-white d-flex justify-content-between align-items-md-center align-items-start">
    //     <h3 className="card-title text-white mb-0">Clients Session PL</h3>
    //   </div>

    //   <div className="card-body">
    //     <div className="event-bets-container">
    //       {error && <div className="alert alert-danger">{error}</div>}

    //       {loading ? (
    //         <div className="loading text-center py-4">
    //           <div className="spinner-border text-primary" role="status">
    //             <span className="visually-hidden">Loading...</span>
    //           </div>
    //           <p className="mt-2">Loading event bets...</p>
    //         </div>
    //       ) : (
    //         <>
    //           {filteredData.length === 0 ? (
    //             <div className="no-data-section">
    //               <div className="no-data-header table-responsive">
    //                 <table className="bets-table table table-striped">
    //                   <thead className="table-dark">
    //                     <tr>
    //                       <th className="text-white">CLIENT</th>
    //                       <th className="text-white">BET TYPE</th>
    //                       <th className="text-white">SESSION AMT.</th>
    //                       <th className="text-white">TOTAL</th>
    //                       <th className="text-white">SESSION COMM</th>
    //                       <th className="text-white">TOTAL COMM</th>
    //                       <th className="text-white">TOTAL AMOUNT</th>
    //                       <th className="text-white">MY SHARE</th>
    //                       <th className="text-white">NET PL</th>
    //                     </tr>
    //                   </thead>
    //                 </table>
    //               </div>
    //               <div className="no-data-message text-center py-5">
    //                 <h4 className="text-muted">NO DATA FOUND</h4>
    //                 <p className="text-muted">
    //                   No fancy bets data available
    //                 </p>
    //               </div>
    //               <div className="totals-row">
    //                 <table className="bets-table table">
    //                   <tbody>
    //                     <tr className="table-secondary">
    //                       <td><strong>TOTAL</strong></td>
    //                       <td>-</td>
    //                       <td>0.00</td>
    //                       <td>0.00</td>
    //                       <td>0.00</td>
    //                       <td>0.00</td>
    //                       <td>0.00</td>
    //                       <td>0.00</td>
    //                       <td>0.00</td>
    //                     </tr>
    //                   </tbody>
    //                 </table>
    //               </div>
    //             </div>
    //           ) : (
    //             <>
    //               <div className="data-section table-responsive">
    //                 <table className="bets-table table table-hover table-striped">
    //                   <thead className="table-dark">
    //                     <tr>
    //                       <th className="text-white">CLIENT</th>
    //                       {/* <th className="text-white">BET TYPE</th> */}
    //                       <th className="text-white">SESSION AMT.</th>
    //                       <th className="text-white">TOTAL</th>
    //                       <th className="text-white">SESSION COMM</th>
    //                       <th className="text-white">TOTAL COMM</th>
    //                       <th className="text-white">TOTAL AMOUNT</th>
    //                       <th className="text-white">MY SHARE</th>
    //                       <th className="text-white">NET PL</th>
    //                     </tr>
    //                   </thead>
    //                   <tbody>
    //                     {filteredData.map((bet, index) => (
    //                       <tr key={index}>
    //                         <td>{bet.username || "N/A"}</td>
    //                         {/* <td>
    //                           <span className="badge bg-warning">
    //                             Fancy
    //                           </span>
    //                         </td> */}
    //                         <td>{formatNumber(bet.session_amt || 0)}</td>
    //                         <td>{formatNumber(bet.total || 0)}</td>
    //                         <td>{formatNumber(bet.session_comm || 0)}</td>
    //                         <td>{formatNumber(bet.total_comm || 0)}</td>
    //                         <td>{formatNumber(bet.total_amount || 0)}</td>
    //                         <td>{formatNumber(bet.my_share || 0)}</td>
    //                         <td className={`${(bet.net_pl || 0) >= 0 ? 'text-success' : 'text-danger'}`}>
    //                           {formatNumber(bet.net_pl || 0)}
    //                         </td>

    //                       </tr>
    //                     ))}
    //                   </tbody>
    //                   <tfoot>
    //                     <tr className="totals-row table-secondary">

    //                       <td><strong>TOTAL</strong></td>

    //                       <td>{formatNumber(totals.totalSessionAmount)}</td>

    //                       <td>{formatNumber(totals.totalAmount)}</td>

    //                       {/* SESSION COMM */}
    //                       <td>{formatNumber(totals.totalSessionComm)}</td>

    //                       {/* TOTAL COMM */}
    //                       <td>{formatNumber(totals.totalComm)}</td>

    //                       {/* TOTAL AMOUNT */}
    //                       <td>{formatNumber(totals.totalAmount)}</td>

    //                       {/* MY SHARE */}
    //                       <td>{formatNumber(totals.myShare)}</td>

    //                       {/* NET PL */}
    //                       <td className={`${totals.netPL >= 0 ? 'text-success' : 'text-danger'}`}>
    //                         {formatNumber(totals.netPL)}
    //                       </td>

    //                     </tr>
    //                   </tfoot>

    //                 </table>
    //               </div>

    //               {pagination.totalPages > 1 && (
    //                 <div className="pagination-section mt-3">
    //                   <div className="row align-items-center justify-content-between w-100">
    //                     <div className="col-md-6 col-6">
    //                       <div className="pagination-info">
    //                         <small>
    //                           Showing {((pagination.currentPage - 1) * pagination.pageSize) + 1} to{" "}
    //                           {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalRecords)} of{" "}
    //                           {pagination.totalRecords} entries
    //                         </small>
    //                       </div>
    //                     </div>
    //                     <div className="col-md-6 col-6">
    //                       <div className="pagination-controls d-flex justify-content-end">
    //                         {renderPaginationButtons()}
    //                       </div>
    //                     </div>
    //                   </div>
    //                 </div>
    //               )}
    //             </>
    //           )}
    //         </>
    //       )}
    //     </div>
    //   </div>
    // </div>
  // );
}

export default GetEventBets;