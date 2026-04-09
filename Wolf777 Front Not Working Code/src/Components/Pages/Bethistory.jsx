import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MyBets() {
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("10-30-2025");
  const [endDate, setEndDate] = useState("11-30-2025");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const userId = localStorage.getItem("user_id");

  // ✅ Environment-based base URL setup
  // const nodeMode = process.env.NODE_ENV;
  // const backendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
  // const backendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  // const baseUrl = nodeMode === "development" ? backendLocalApiUrl : backendLiveApiUrl;
  
    const baseUrl = process.env.REACT_APP_BACKEND_API;


  // ✅ Fetch user's bet history
  const fetchMyBets = async () => {
    try {
      if (!userId) {
        console.error("User ID not found in localStorage");
        setLoading(false);
        return;
      }

      setLoading(true);

      // ✅ Use POST with dynamic base URL
      const response = await axios.post(`${baseUrl}/bet-history`, {
        user_id: userId,
        start_date: startDate,
        end_date: endDate,
      });

      console.log("✅ API Response:", response.data);

      if (response.data?.status_code === 1 && Array.isArray(response.data.data)) {
        setBets(response.data.data);
      } else {
        setBets([]);
      }
    } catch (error) {
      console.error("❌ Error fetching bets:", error);
      setBets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBets();
  }, [userId]);

  // ✅ Handle date changes
  const handleStartDateChange = (e) => setStartDate(e.target.value);
  const handleEndDateChange = (e) => setEndDate(e.target.value);

  // ✅ Handle items per page change
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  // ✅ Format date
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString("en-IN", {
      dateStyle: "short",
      timeStyle: "short",
    });

  // ✅ Pagination logic
  const totalPages = Math.ceil(bets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBets = bets.slice(startIndex, endIndex);

  const goToPage = (page) => setCurrentPage(page);
  const goToPreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const goToNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  return (
    <section className="my-bets-section pt-3">
      <div className="container-fluid">
        <div className="card shadow-sm">
          <div className="card-header bg-gradient-color flex-wrap-mobile text-white d-flex justify-content-between align-items-center p-2">
            <h5 className="text-light mb-0">My Bet History</h5>
            <div className="d-md-flex d-none align-items-center gap-2">
              <div className="d-flex gap-2">
               <div className="w-100">
                 <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Start Date (MM-DD-YYYY)"
                  value={startDate}
                  onChange={handleStartDateChange}
                />
               </div>
               <div className="w-100">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="End Date (MM-DD-YYYY)"
                  value={endDate}
                  onChange={handleEndDateChange}
                 
                /></div>
                
              </div>
              <button className="btn btn-sm btn-light" onClick={fetchMyBets}>
                Refresh
              </button>
            </div>
          </div>
          {/* {mobileshow && (
            <></>
          )} */}

          <div className="card-body">
            {bets.length > 0 && (
              <div className="row mb-3">
                <div className="col-md-6">
                  <div className="d-flex align-items-center">
                    <label className="me-2 mb-0">Show:</label>
                    <select
                      className="form-select form-select-sm"
                      style={{ width: "80px" }}
                      value={itemsPerPage}
                      onChange={handleItemsPerPageChange}
                    >
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                    </select>
                    <span className="ms-2">entries</span>
                  </div>
                </div>
                
              </div>
            )}

            {loading ? (
              <div className="loader-6">
                <div className="set-one">
                  <div className="circle "></div>
                  <div className="circle circle1"></div>
                </div>

                <div className="set-two">
                  <div className="circle circle2"></div>
                  <div className="circle circle3"></div>
                </div>
              </div>
            ) : bets.length === 0 ? (
              <div className="text-center py-4">
                <p>No bets found for the selected date range.</p>
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <table className="table table-striped table-bordered align-middle bethistorydesign">
                    <thead>
                      <tr>
                        <th>#</th>
                        {/* <th>User Name</th> */}
                        <th>Team</th>
                        <th>Bet On</th>
                        <th>Odd</th>
                        <th>Stake</th>
                        <th>Total</th>
                        <th>Liability</th>
                        <th>Bet Type</th>
                        <th>Market</th>
                        <th>Status</th>
                        <th>Created At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentBets.map((bet, index) => (
                        <tr key={bet._id}>
                          <td>{startIndex + index + 1}</td>
                          {/* <td>{bet.user_id?.name || "N/A"}</td> */}
                          <td>{bet.team || "-"}</td>
                          <td>
                            <span
                              className={`badge ${
                                bet.bet_on?.toLowerCase() === "back"
                                  ? "bg-success-custum"
                                  : "bg-danger-custum"
                              }`}
                            >
                              {bet.bet_on}
                            </span>
                          </td>
                          <td>{bet.odd}</td>
                          <td>₹{bet.stake}</td>
                          <td>₹{bet.total}</td>
                          <td className={bet.liability < 0 ? "text-danger" : "text-success"}>
                            ₹{bet.liability}
                          </td>
                          <td>
                            <span className="badge bg-info-custum">{bet.bet_type}</span>
                          </td>
                          <td>
                            <small>{bet.market_id === "2" ? "Fancy" : "Match Odds"}</small>
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                bet.is_settled === "1"
                                  ? "bg-success-custum"
                                  : bet.matched_status === "matched"
                                  ? "bg-warning-custum"
                                  : "bg-secondary-custum"
                              }`}
                            >
                              {bet.is_settled === "1"
                                ? "Settled"
                                : bet.matched_status === "matched"
                                ? "Matched"
                                : "Unmatched"}
                            </span>
                          </td>
                          <td>{formatDate(bet.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div>
                      <p className="mb-0">
                        Page {currentPage} of {totalPages}
                      </p>
                    </div>
                    <nav>
                      <ul className="pagination mb-0">
                        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                          <button className="page-link" onClick={goToPreviousPage}>
                            Previous
                          </button>
                        </li>

                        {getPageNumbers().map((page) => (
                          <li key={page} className={`page-item ${currentPage === page ? "active" : ""}`}>
                            <button className="page-link" onClick={() => goToPage(page)}>
                              {page}
                            </button>
                          </li>
                        ))}

                        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                          <button className="page-link" onClick={goToNextPage}>
                            Next
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                )}
              </>
            )}
              {/* {bets.length > 0 && (
              <div className="row mb-3">
                
                <div className="col-md-12 text-end">
                  <p className="mb-0">
                    Showing {startIndex + 1} to {Math.min(endIndex, bets.length)} of {bets.length} entries
                  </p>
                </div>
              </div>
            )} */}
          </div>

          {/* {bets.length > 0 && (
            <div className="card-footer">
              <div className="row text-center">
                <div className="col-md-3">
                  <strong>Total Bets:</strong> {bets.length}
                </div>
                <div className="col-md-3">
                  <strong>Total Stake:</strong> ₹
                  {bets.reduce((sum, bet) => sum + (parseFloat(bet.stake) || 0), 0)}
                </div>
                <div className="col-md-3">
                  <strong>Total Liability:</strong> ₹
                  {bets.reduce((sum, bet) => sum + (parseFloat(bet.liability) || 0), 0)}
                </div>
                <div className="col-md-3">
                  <strong>Back/Lay:</strong>{" "}
                  {bets.filter((bet) => bet.bet_on?.toLowerCase() === "back").length} /{" "}
                  {bets.filter((bet) => bet.bet_on?.toLowerCase() === "lay").length}
                </div>
              </div>
            </div>
          )} */}
        </div>
      </div>
    </section>
  );
}
