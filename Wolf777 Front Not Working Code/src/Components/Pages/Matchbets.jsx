import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { FaCalendarAlt, FaSortDown, FaRedoAlt, FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";

function Matchodds() {
  const todayStr = new Date().toISOString().slice(0, 10);
  const defaultFrom = "2025-10-30";
  const defaultTo = todayStr;

  const [fromDate, setFromDate] = useState(defaultFrom);
  const [toDateState, setToDate] = useState(defaultTo);
  const [pageSize, setPageSize] = useState(30);
  const [currentPage, setCurrentPage] = useState(1);
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // const backendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API || "http://localhost:9001/api/users";
  // const backendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  // const nodeMode = process.env.NODE_ENV;
  // const baseUrl = nodeMode === "development" ? backendLocalApiUrl : backendLiveApiUrl;

  const baseUrl = process.env.REACT_APP_BACKEND_API;


  const userId = localStorage.getItem("user_id");
  const event_id = localStorage.getItem("event_id");

  const [eventId, setEventId] = useState(
    localStorage.getItem("event_id")
  );

  // console.warn("eventId55555", eventId);


  useEffect(() => {
    console.log("✅ eventIdUpdated listener registered");

    const updateEventId = () => {
      const id = localStorage.getItem("event_id");
      console.warn("🔥 eventIdUpdated fired, new event_id =", id);
      setEventId(id);
    };

    window.addEventListener("eventIdUpdated", updateEventId);

    return () => {
      console.log("🧹 eventIdUpdated listener removed");
      window.removeEventListener("eventIdUpdated", updateEventId);
    };
  }, []);


  useEffect(() => {
    if (eventId) {
      fetchData();
    }
  }, [eventId]);
  // ✅ Fetch API Data - All bets EXCEPT fancy bets
  const fetchData = async () => {
    if (!userId) {
      console.error("User ID not found");
      setBets([]);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${baseUrl}/unselleted-bet`, {
        user_id: userId,
        event_id: event_id,
        // start_date: new Date(fromDate).toLocaleDateString("en-US"), // MM/DD/YYYY
        // end_date: new Date(toDateState).toLocaleDateString("en-US"),
      });

      if (res.data?.status_code === 1 && Array.isArray(res.data.data)) {
        // Filter out fancy bets (show all other bets)
        const nonFancyBets = res.data.data.filter(bet =>
          !bet.bet_type || bet.bet_type.toLowerCase() !== "fancy"
        );
        setBets(nonFancyBets);
      } else {
        setBets([]);
      }
    } catch (error) {
      console.error("Error fetching match odds bets:", error);
      setBets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // load once

  // Pagination calculations
  const { totalPages, currentPageData, startIndex, endIndex } = useMemo(() => {
    const totalItems = bets.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentPageData = bets.slice(startIndex, endIndex);

    return {
      totalPages,
      currentPageData,
      startIndex,
      endIndex,
      totalItems
    };
  }, [bets, currentPage, pageSize]);

  const applyFilters = () => {
    setCurrentPage(1); // Reset to first page when filters are applied
    fetchData();
  };

  const resetFilters = () => {
    setFromDate(defaultFrom);
    setToDate(defaultTo);
    setPageSize(10);
    setCurrentPage(1); // Reset to first page
    fetchData();
  };

  // Pagination handlers
  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Generate page numbers for pagination
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



  useEffect(() => {
    const handleBetUpdate = () => {
      fetchData();
    };
    window.addEventListener("bet-updated", handleBetUpdate);
    return () => window.removeEventListener("bet-updated", handleBetUpdate);
  }, []);

  return (
    <div className="matchbets">
      <div className="card">
        <div className="card-header headingheadermatch">
          <div className='text-center'>
            <h5 className="mb-0" style={{ color: "white" }}>Match Bets</h5>
            {/* <div className="d-md-none">
              <button
                className="btn btn-sm btn-primary d-flex align-items-center gap-1"
                onClick={() => setShowFilters(!showFilters)}
              >
                Filters
                <FaSortDown />
              </button>
            </div> */}
          </div>
        </div>

        <div className="card-body">
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading match bets...</p>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className='table table-hover'>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Runner Name sd</th>
                      <th>Bet Mode</th>
                      <th>Bet Price</th>
                      <th>Bet Value</th>
                      <th>Bet Amount</th>
                      {/* <th>Bet Type</th> */}
                      {/* <th>Created At</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {currentPageData.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center text-muted py-4">
                          No match bets found.
                        </td>
                      </tr>
                    ) : (
                      currentPageData.map((bet, index) => (
                        <tr key={bet._id || index}>
                          <td>{startIndex + index + 1}</td>
                          <td>{bet.team || "N/A"}</td>
                          <td>
                            <span
                              className={`badge ${bet.bet_on === "back" ? "bg-success" : "bg-danger"
                                }`}
                            >
                              {bet.bet_on === "back" ? "LAGAI" : bet.bet_on === "lay" ? "KHAI" : "N/A"}
                            </span>
                          </td>

                          <td>{bet.odd || "N/A"}</td>
                          {/* <td>{bet.total || "N/A"}</td> */}
                          <td>
                            {bet.total !== null && bet.total !== undefined
                              ? Number(bet.total).toFixed(2)
                              : "N/A"}
                          </td>
                          <td>{bet.stake || "N/A"}</td>


                          {/* <td>
                            <span className="badge bg-info text-capitalize">
                              {bet.bet_type || "N/A"}
                            </span>
                          </td> */}
                          {/* <td>{bet.created_at?.slice(0, 10) || "N/A"}</td> */}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {bets.length > 0 && totalPages > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-4">
                  <div>
                    <p className="mb-0 text-muted small">
                      Showing {currentPageData.length > 0 ? startIndex + 1 : 0} to{" "}
                      {Math.min(endIndex, bets.length)} of {bets.length} entries
                    </p>
                  </div>
                  <nav>
                    <ul className="pagination pagination-sm mb-0">
                      <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                        <button className="page-link" onClick={goToPreviousPage}>
                          <FaChevronLeft />
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
                          <FaChevronRight />
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Matchodds;