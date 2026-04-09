import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdOutlineKeyboardArrowRight, MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { getallsettledfancybetshistory } from "../../Server/api";
import { FiSearch } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllStatementlist = () => {
  const navigate = useNavigate();
  const { adminId } = useParams();

  const [loading, setLoading] = useState(true);
  const [statementData, setStatementData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [limit] = useState(50);

  // Date filter states
  const [fromDate, setFromDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 3);
    return date.toISOString().split('T')[0];
  });
  const [toDate, setToDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  const [summary, setSummary] = useState({
    total_win_amount: 0,
    total_loss_amount: 0,
    total_profit: 0
  });

  useEffect(() => {
    fetchStatementData(currentPage);
  }, [adminId, currentPage, fromDate, toDate]);

  const fetchStatementData = async (page = currentPage) => {
    try {
      setLoading(true);
      const loggedInAdminId = localStorage.getItem("admin_id");

      const params = {
        admin_id: adminId || loggedInAdminId,
        page,
        limit,
        search: searchTerm,
        from_date: fromDate,
        to_date: toDate
      };

      Object.keys(params).forEach(key => {
        if (params[key] === undefined || params[key] === '') {
          delete params[key];
        }
      });

      const res = await getallsettledfancybetshistory(params);
      const response = res.data;

      if (response.status_code === 1) {
        const data = response.data || [];
        setStatementData(data);
        setTotalPages(response.pagination?.totalPages || 1);
        setCurrentPage(response.pagination?.currentPage || 1);
        setTotalRecords(response.pagination?.totalRecords || 0);

        if (response.summary) {
          setSummary(response.summary);
        }
      }
    } catch (error) {
      console.error("Error fetching fancy bets history:", error);
      toast.error("An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => Number(num || 0).toFixed(2);

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

  const getProfitLossClass = (value) => {
    return value >= 0 ? "text-success" : "text-danger";
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

  const handleSearch = () => {
    setCurrentPage(1);
    fetchStatementData(1);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
    fetchStatementData(1);
  };
  const handleView = (item) => {
    // ID localStorage me save karo
    localStorage.setItem("event_id", item.event_id);
    localStorage.setItem("match_name", item.match_name);

    // XYZ page par navigate karo
    navigate("/SettledBethistoryview");
  };
  return (
    <>
      <ToastContainer autoClose={500} theme="colored" />

      <div className="container-fluid">
        <div className="card">
          <div className="card-header flex-wrap-mobile bg-color-black p-2 text-white d-flex justify-content-between align-items-md-center gap-2">
            <h5 className="card-title mb-0">Settled  Bets History </h5>
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
                  {/* <div className="input-group" style={{ width: "300px" }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by match name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button
                      className="btn btn-outline-primary"
                      type="button"
                      onClick={handleSearch}
                    >
                      <FiSearch />
                    </button>
                    {searchTerm && (
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={clearSearch}
                      >
                        Clear
                      </button>
                    )}
                  </div> */}

                  {/* Date Filter */}
                  <div className="d-flex gap-2 align-items-center flex-wrap">
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
                  <div className="card bg-success">
                    <div className="card-body py-2">
                      <h6 className="mb-0">Total Win Amount</h6>
                      <h4 className="mb-0">₹{formatNumber(summary.total_win_amount)}</h4>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card bg-danger ">
                    <div className="card-body py-2">
                      <h6 className="mb-0">Total Loss Amount</h6>
                      <h4 className="mb-0">₹{formatNumber(summary.total_loss_amount)}</h4>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card bg-info ">
                    <div className="card-body py-2">
                      <h6 className="mb-0">Total Profit</h6>
                      <h4 className={`mb-0 ${getProfitLossClass(summary.total_profit)}`}>
                        ₹{formatNumber(summary.total_profit)}
                      </h4>
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
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading fancy bets history...</p>
              </div>
            ) : statementData.length === 0 ? (
              <div className="text-center py-5">
                <h5>No data found</h5>
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
                        <th>SR NO.</th>
                        <th>Date</th>
                        <th>MATCH NAME</th>
                        <th className="text-end">TOTAL WIN (₹)</th>
                        <th className="text-end">TOTAL LOSS (₹)</th>
                        <th className="text-end">PROFIT/LOSS (₹)</th>
                        <th className="text-end">view</th>
                      </tr>
                    </thead>

                    <tbody>
                      {statementData.map((item, index) => {
                        const profitLoss = item.total_win - item.total_loss;
                        const profitLossClass = profitLoss >= 0 ? "text-success" : "text-danger";

                        return (
                          <tr key={item._id || index}>
                            <td>{(currentPage - 1) * limit + index + 1}</td>
                            <td>
                              {item.date
                                ? new Date(item.date).toLocaleString("en-IN", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                                : "N/A"}
                            </td>
                            <td>
                              <strong>{item.match_name || 'N/A'}</strong>
                              <br />
                              <small className="text-muted">Event ID: {item.event_id}</small>
                            </td>
                            <td className="text-end text-success fw-bold">
                              ₹{formatNumber(item.total_win)}
                            </td>
                            <td className="text-end text-danger fw-bold">
                              ₹{formatNumber(item.total_loss)}
                            </td>
                            <td className={`text-end fw-bold ${profitLossClass}`}>
                              ₹{formatNumber(profitLoss)}
                              {profitLoss > 0 ? ' ▲' : profitLoss < 0 ? ' ▼' : ''}
                            </td>

                            <td className="text-end">
                              <button
                                className="btn btn-sm btn-primary"
                                onClick={() => handleView(item)}
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>

                    {/* {statementData.length > 0 && (
                      <tfoot className="table-secondary">
                        <tr>
                          <td colSpan="2" className="text-end fw-bold">TOTAL:</td>
                          <td className="text-end fw-bold text-success">₹{formatNumber(summary.total_win_amount)}</td>
                          <td className="text-end fw-bold text-danger">₹{formatNumber(summary.total_loss_amount)}</td>
                          <td className={`text-end fw-bold ${getProfitLossClass(summary.total_profit)}`}>
                            ₹{formatNumber(summary.total_profit)}
                          </td>
                        </tr>
                      </tfoot>
                    )} */}
                  </table>
                </div>

                {totalPages > 1 && (
                  <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-2">
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