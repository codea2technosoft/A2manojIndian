import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdOutlineKeyboardArrowRight, MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { getallfancybetshistory } from "../../Server/api";
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
  const [limit] = useState(500);

  const [total, setTotal] = useState({
    credit: 0,
    debit: 0,
    commissionPlus: 0,
    commissionMinus: 0,
    netBalance: 0
  });

  useEffect(() => {
    fetchStatementData(currentPage);
  }, [adminId, currentPage, searchTerm]);

  const fetchStatementData = async (page = currentPage) => {
    try {
      setLoading(true);
      const loggedInAdminId = localStorage.getItem("admin_id");
      const res = await getallfancybetshistory({
        admin_id: adminId || loggedInAdminId,
        page,
        limit,
        search: searchTerm
      });

      const response = res.data;
      if (response.status_code === 1) {
        const data = response.data || [];
        setStatementData(data);
        setTotalPages(response.pagination?.totalPages || 1);
        setCurrentPage(response.pagination?.currentPage || 1);
        setTotalRecords(response.pagination?.totalRecords || 0);
        
        // Calculate totals based on the actual data structure
        calculateTotals(data);
        
        // if (response.message) {
        //   toast.success(response.message);
        // }
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
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
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

  return (
    <>
      <ToastContainer autoClose={500} theme="colored" />

      <div className="container-fluid">
        <div className="card">
          <div className="card-header flex-wrap-mobile bg-color-black p-2 text-white d-flex justify-content-between align-items-md-center gap-2">
            <h5 className="card-title mb-0">Fancy Bets History</h5>

            <div className="d-flex align-items-center">
              <button onClick={() => navigate(-1)} className="backbutton">
                Back
              </button>
            </div>
          </div>

          <div className="card-body">
            <div className="row mb-3">
              {/* Search and Filter Section */}
              <div className="col-md-6">
                <div className="d-flex">
                  <div className="input-group me-2" style={{ width: "300px" }}>
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
                </div>
              </div>

              {/* <div className="col-md-6 d-flex justify-content-end align-items-center">
                <select
                  className="form-select"
                  style={{ width: "250px" }}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "PL") {
                      navigate("/all-profit-loss-statment");
                    } else if (value === "ALL") {
                      navigate("/getAllstatment");
                    }
                  }}
                >
                  <option value="">Select Statement Type</option>
                  <option value="ALL">All Statement</option>
                  <option value="PL">P&L Statement</option>
                </select>
              </div> */}
            </div>

       

            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" />
                <p>Loading fancy bets history...</p>
              </div>
            ) : statementData.length === 0 ? (
              <div className="text-center py-5">
                <h5>No  bets found</h5>
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
                        {/* <th className="text-end">FANCY DEPOSIT</th>
                        <th className="text-end">FANCY WITHDRAW</th> */}
                        {/* <th>STATUS</th>
                        <th className="text-end">WIN AMOUNT</th> */}
                      </tr>
                    </thead>

                    <tbody>
                      {statementData.map((item, index) => (
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
                          <td className="text-end">{item.odd}</td>
                          <td className="text-end">₹{formatNumber(item.stake)}</td>
                          {/* <td className="text-end">₹{formatNumber(item.fancy_deposit)}</td>
                          <td className="text-end">₹{formatNumber(item.fancy_withdraw)}</td> */}
                          {/* <td>
                            <span className={`badge ${item.matched_status === 'matched' ? 'bg-success' : 'bg-warning'}`}>
                              {item.matched_status?.toUpperCase() || 'N/A'}
                            </span>
                            {item.is_settled === 1 && (
                              <span className="badge bg-secondary ms-1">SETTLED</span>
                            )}
                          </td>
                          <td className="text-end fw-bold">
                            {item.bet_win_amount > 0 ? (
                              <span className="text-success">₹{formatNumber(item.bet_win_amount)}</span>
                            ) : (
                              <span className="text-muted">₹0.00</span>
                            )}
                          </td> */}
                        </tr>
                      ))}
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