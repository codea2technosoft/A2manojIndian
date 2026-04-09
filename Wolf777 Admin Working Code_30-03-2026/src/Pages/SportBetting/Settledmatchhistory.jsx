import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdOutlineKeyboardArrowRight, MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { getallsettledmatchbetshistory } from "../../Server/api";
import { FiSearch } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Table,
  Spinner,
  Form,
  Button
} from "react-bootstrap";

const AllStatementlist = () => {
  const navigate = useNavigate();
  const { adminId } = useParams();

  const [loading, setLoading] = useState(true);
  const [statementData, setStatementData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [mode, setMode] = useState("ALL");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [limit] = useState(50);

  // Date filter states
  const [fromDate, setFromDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 3); // Set to 3 days ago
    return date.toISOString().split('T')[0];
  });
  const [toDate, setToDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  const [total, setTotal] = useState({
    credit: 0,
    debit: 0,
    commissionPlus: 0,
    commissionMinus: 0,
    netBalance: 0
  });

  const [summary, setSummary] = useState({
    total_win_amount: 0,
    total_loss_amount: 0,
    total_profit: 0
  });

  useEffect(() => {
    fetchStatementData(currentPage);
  }, [adminId, currentPage, searchTerm, fromDate, toDate]);

  const fetchStatementData = async (page = currentPage) => {
    try {
      setLoading(true);
      const loggedInAdminId = localStorage.getItem("admin_id");
      
      // Prepare request parameters
      const params = {
        admin_id: adminId || loggedInAdminId,
        page,
        limit,
        search: searchTerm,
        from_date: fromDate,
        to_date: toDate
      };
      
      // Remove undefined or empty values
      Object.keys(params).forEach(key => {
        if (params[key] === undefined || params[key] === '') {
          delete params[key];
        }
      });

      const res = await getallsettledmatchbetshistory(params);

      const response = res.data;
      if (response.status_code === 1) {
        const data = response.data || [];
        setStatementData(data);
        setTotalPages(response.pagination?.totalPages || 1);
        setCurrentPage(response.pagination?.currentPage || 1);
        setTotalRecords(response.pagination?.totalRecords || 0);
        
        // Set summary data from API response
        if (response.summary) {
          setSummary(response.summary);
        }

        // Calculate totals based on the actual data structure
        calculateTotals(data);
      } else {
        // toast.error(response.error_message || "Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching fancy bets history:", error);
      toast.error("An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = (data) => {
    let totalStake = 0;
    let totalBetWin = 0;

    data.forEach(item => {
      totalStake += Number(item.stake || 0);
      totalBetWin += Number(item.bet_win_amount || 0);
    });

    setTotal({
      credit: totalBetWin, // Winning amounts
      debit: totalStake, // Stake amounts
      commissionPlus: 0,
      commissionMinus: 0,
      netBalance: totalBetWin - totalStake // Net P/L
    });
  };

  const formatNumber = (num) => Number(num || 0).toFixed(2);
  
  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
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

  const getStatusBadge = (matchStatus) => {
    switch(matchStatus) {
      case "1":
        return { text: "WIN", class: "bg-success" };
      case "2":
        return { text: "LOSS", class: "bg-danger" };
      default:
        return { text: "SETTLED", class: "bg-secondary" };
    }
  };

  const getAmountBadge = (matchStatus, amount) => {
    const status = getStatusBadge(matchStatus);
    return (
      <span className={`badge ${status.class}`}>
        ₹{formatNumber(amount)}
      </span>
    );
  };

  const handleApplyDateFilter = () => {
    setCurrentPage(1);
    fetchStatementData(1);
  };

  const handleResetDateFilter = () => {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    setFromDate(threeDaysAgo.toISOString().split('T')[0]);
    setToDate(new Date().toISOString().split('T')[0]);
    setCurrentPage(1);
    fetchStatementData(1);
  };

  return (
    <>
      <ToastContainer autoClose={500} theme="colored" />

      <div className="container-fluid">
        <div className="card">
          <div className="card-header flex-wrap-mobile bg-color-black p-2 text-white d-flex justify-content-between align-items-md-center gap-2">
            <h5 className="card-title mb-0">settled match Bets History

</h5>

            <div className="d-flex align-items-center">
              <button onClick={() => navigate(-1)} className="backbutton">
                Back
              </button>
            </div>
          </div>

          <div className="card-body">
            {/* Search and Date Filter Section */}
            <div className="row mb-3">
              <div className="col-md-12">
                <div className="d-flex flex-wrap gap-3 align-items-center">
                  {/* Search Input */}
                  <div className="input-group" style={{ width: "300px" }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by mobile..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                    <button
                      className="btn btn-outline-primary"
                      type="button"
                      onClick={() => fetchStatementData(1)}
                    >
                      <FiSearch />
                    </button>
                    {searchTerm && (
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => {
                          setSearchTerm("");
                          setCurrentPage(1);
                        }}
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Date Filter */}
                  <div className="d-flex gap-2 align-items-center">
                    <div className="d-flex align-items-center gap-1">
                      <label className="text-nowrap">From:</label>
                      <input
                        type="date"
                        className="form-control"
                        style={{ width: "150px" }}
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        max={toDate}
                      />
                    </div>
                    <div className="d-flex align-items-center gap-1">
                      <label className="text-nowrap">To:</label>
                      <input
                        type="date"
                        className="form-control"
                        style={{ width: "150px" }}
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        min={fromDate}
                        max={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <button
                      className="btn btn-primary"
                      onClick={handleApplyDateFilter}
                    >
                      Apply
                    </button>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={handleResetDateFilter}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            {!loading && statementData.length > 0 && (
              <div className="row mb-4">
                <div className="col-md-4">
                  <div className="card bg-success ">
                    <div className="card-body py-2" style={{color:"black"}}>
                      <h6 className="mb-0">Total Win Amount</h6>
                      <h4 className="mb-0">₹{formatNumber(summary.total_win_amount)}</h4>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card bg-danger" style={{color:"black"}}>
                    <div className="card-body py-2">
                      <h6 className="mb-0">Total Loss Amount</h6>
                      <h4 className="mb-0">₹{formatNumber(summary.total_loss_amount)}</h4>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card bg-info " style={{color:"black"}}> 
                    <div className="card-body py-2">
                      <h6 className="mb-0">Total Profit</h6>
                      <h4 className="mb-0">₹{formatNumber(summary.total_profit)}</h4>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Date Range Display */}
            {fromDate && toDate && !loading && statementData.length > 0 && (
              <div className="mb-3">
                <small className="text-muted">
                  Showing data from {new Date(fromDate).toLocaleDateString('en-IN')} to {new Date(toDate).toLocaleDateString('en-IN')}
                </small>
              </div>
            )}

            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Loading fancy bets history...</p>
              </div>
            ) : statementData.length === 0 ? (
              <div className="text-center py-5">
                <h5>No bets found</h5>
                {(searchTerm || fromDate || toDate) && (
                  <p className="text-muted">
                    Try clearing your filters or adjusting the date range
                  </p>
                )}
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <table className="table table-bordered table-hover">
                    <thead className="table-dark">
                      <tr>
                        <th>DATE & TIME</th>
                        <th>MOBILE</th>
                        <th>TEAM/MARKET</th>
                        <th>BET TYPE</th>
                        <th>BET ON</th>
                        <th className="text-end">ODDS</th>
                        <th className="text-end">STAKE</th>
                        <th>STATUS</th>
                        <th className="text-end">AMOUNT</th>
                      </tr>
                    </thead>

                    <tbody>
                      {statementData.map((item, index) => {
                        const status = getStatusBadge(item.match_status);
                        return (
                          <tr key={item._id || index}>
                            <td>{formatDateTime(item.created_at)}</td>
                            <td>{item.mobile || 'N/A'}</td>
                            <td>{item.team || 'N/A'}</td>
                            <td>
                              <span className={`badge ${item.bet_type === 'fancy' ? 'bg-info' : 'bg-secondary'}`}>
                                {item.bet_type?.toUpperCase() || 'N/A'}
                              </span>
                            </td>
                            <td>
                              <span className={`badge ${item.bet_on === 'back' ? 'bg-success' : 'bg-danger'}`}>
                                {item.bet_on?.toUpperCase() || 'N/A'}
                              </span>
                            </td>
                            <td className="text-end">{item.odd || '0.00'}</td>
                            <td className="text-end">₹{formatNumber(item.stake)}</td>
                            <td>
                              <span className={`badge ${status.class}`}>
                                {status.text}
                              </span>
                            </td>
                            <td className="text-end">
                              {getAmountBadge(item.match_status, item.bet_win_amount)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <div className="d-flex justify-content-between align-items-center mt-4">
                    <div className="showingallentries">
                      Showing {((currentPage - 1) * limit) + 1} to{" "}
                      {Math.min(currentPage * limit, totalRecords)} of {totalRecords} entries
                    </div>

                    <div className="paginationall d-flex align-items-center gap-1">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        disabled={currentPage === 1}
                        onClick={handlePrev}
                      >
                        <MdOutlineKeyboardArrowLeft />
                      </button>

                      <div className="d-flex gap-1">
                        {getPageNumbers().map((page) => (
                          <button
                            key={page}
                            className={`btn btn-sm ${currentPage === page ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => handlePageClick(page)}
                          >
                            {page}
                          </button>
                        ))}
                      </div>

                      <button
                        className="btn btn-sm btn-outline-primary"
                        disabled={currentPage === totalPages}
                        onClick={handleNext}
                      >
                        <MdOutlineKeyboardArrowRight />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AllStatementlist;