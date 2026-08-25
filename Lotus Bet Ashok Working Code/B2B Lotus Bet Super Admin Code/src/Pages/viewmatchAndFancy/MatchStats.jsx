import React, { useState, useEffect } from "react";
import axios from "axios";
import "../viewmatchAndFancy/Eventcss.scss";
import { useLocation } from "react-router-dom";

function GetEventBets() {
  const admin_id = localStorage.getItem("admin_id");
  const token = localStorage.getItem("token");

  const location = useLocation();

  // URL example:
  // /series_idd/12345/event_id/67890
  const pathParts = location.pathname.split("/");

  const seriesIndex = pathParts.indexOf("series_idd");
  const eventIndex = pathParts.indexOf("event_id");

  const series_id =
    seriesIndex !== -1 ? pathParts[seriesIndex + 1] : null;

  const event_id =
    eventIndex !== -1 ? pathParts[eventIndex + 1] : null;

  console.log("URL:", location.pathname);
  console.log("series_id:", series_id);
  console.log("event_id:", event_id);

  const [betsData, setBetsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedBetType, setSelectedBetType] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    pageSize: 15,
  });

  const [betTypes, setBetTypes] = useState([]);

  // ==============================
  // GET EVENT BETS
  // ==============================
  const getEventBets = async (
    page = 1,
    pageSize = pagination.pageSize
  ) => {
    setLoading(true);
    setError(null);

    // Check event_id before API call
    if (!event_id) {
      setLoading(false);
      setError("Event ID not found in URL.");
      setBetsData([]);
      setFilteredData([]);
      setBetTypes([]);
      return;
    }

    try {
      console.log("Sending payload:", {
        admin_id: admin_id,
        event_id: event_id,
        page: page,
        limit: pageSize,
      });

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/get-event-bets`,
        {
          admin_id: admin_id,
          event_id: event_id,
          page: page,
          limit: pageSize,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("API Response:", res.data);

      if (res.data && res.data.status_code === 1) {
        if (
          Array.isArray(res.data.data) &&
          res.data.data.length > 0
        ) {
          const apiData = res.data.data;

          const formattedData = apiData.map((bet) => ({
            ...bet,

            place_time: bet.created_at || "N/A",

            username: `USER ${bet.user_id?.substring(0, 6) || "N/A"
              }`,

            runner_name:
              bet.team || bet.runner_name || "N/A",

            bet_type:
              bet.bet_type?.toUpperCase() || "N/A",

            bet_price:
              bet.odd || 0,

            bet_value:
              bet.total || 0,

            bet_amount:
              bet.stake || bet.amount || 0,

            bet_action:
              bet.bet_on === "lay"
                ? "LAGAI"
                : "BACK",
          }));

          setBetsData(formattedData);

          // Apply current filter after API response
          if (selectedBetType === "all") {
            setFilteredData(formattedData);
          } else {
            const filtered = formattedData.filter(
              (bet) =>
                bet.bet_type?.toLowerCase() ===
                selectedBetType.toLowerCase()
            );

            setFilteredData(filtered);
          }

          // Unique bet types
          const uniqueBetTypes = [
            ...new Set(
              formattedData
                .map((bet) => bet.bet_type || "")
                .filter((type) => type !== "")
            ),
          ];

          setBetTypes(uniqueBetTypes);

          // Pagination
          if (res.data.pagination) {
            setPagination((prev) => ({
              ...prev,
              currentPage:
                res.data.pagination.currentPage || page,

              totalPages:
                res.data.pagination.totalPages || 1,

              totalRecords:
                res.data.pagination.totalRecords ||
                formattedData.length,

              pageSize: pageSize,
            }));
          }
        } else {
          setBetsData([]);
          setFilteredData([]);
          setBetTypes([]);

          if (res.data.pagination) {
            setPagination((prev) => ({
              ...prev,

              currentPage:
                res.data.pagination.currentPage || page,

              totalPages:
                res.data.pagination.totalPages || 1,

              totalRecords:
                res.data.pagination.totalRecords || 0,

              pageSize: pageSize,
            }));
          }
        }
      } else {
        setBetsData([]);
        setFilteredData([]);
        setBetTypes([]);

        setPagination((prev) => ({
          ...prev,
          currentPage: 1,
          totalPages: 1,
          totalRecords: 0,
        }));

        if (res.data?.message) {
          setError(res.data.message);
        } else {
          setError("No data available");
        }
      }
    } catch (error) {
      console.error(
        "Error fetching event bets:",
        error?.response?.data || error.message
      );

      setError(
        error?.response?.data?.message ||
        "Failed to fetch event bets. Please try again."
      );

      setBetsData([]);
      setFilteredData([]);
      setBetTypes([]);

      setPagination((prev) => ({
        ...prev,
        currentPage: 1,
        totalPages: 1,
        totalRecords: 0,
      }));
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // INITIAL API CALL
  // ==============================
  useEffect(() => {
    if (event_id) {
      getEventBets(1, pagination.pageSize);
    } else {
      setLoading(false);
      setError("Event ID not found in URL.");
    }
  }, [event_id]);

  // ==============================
  // BET TYPE FILTER
  // ==============================
  const handleBetTypeFilter = (betType) => {
    setSelectedBetType(betType);

    if (betType === "all") {
      setFilteredData(betsData);
    } else {
      const filtered = betsData.filter(
        (bet) =>
          bet.bet_type?.toLowerCase() ===
          betType.toLowerCase()
      );

      setFilteredData(filtered);
    }
  };

  // ==============================
  // PAGE CHANGE
  // ==============================
  const handlePageChange = (newPage) => {
    if (
      newPage >= 1 &&
      newPage <= pagination.totalPages
    ) {
      getEventBets(newPage, pagination.pageSize);
    }
  };

  // ==============================
  // PAGE SIZE CHANGE
  // ==============================
  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value, 10);

    setPagination((prev) => ({
      ...prev,
      pageSize: newSize,
      currentPage: 1,
    }));

    // Directly pass newSize so old pageSize is not used
    getEventBets(1, newSize);
  };

  // ==============================
  // FORMAT NUMBER
  // ==============================
  const formatNumber = (num) => {
    if (num === null || num === undefined) {
      return "0.00";
    }

    const parsedNumber = Number(num);

    if (!isNaN(parsedNumber)) {
      return parsedNumber.toFixed(2);
    }

    return num;
  };

  // ==============================
  // FORMAT DATE
  // ==============================
  const formatDate = (dateString) => {
    if (
      !dateString ||
      dateString === "N/A"
    ) {
      return "N/A";
    }

    try {
      const date = new Date(dateString);

      if (isNaN(date.getTime())) {
        return dateString;
      }

      return (
        date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        }) +
        " " +
        date.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    } catch (error) {
      return dateString;
    }
  };

  // ==============================
  // FORMAT BET TYPE
  // ==============================
  const formatBetType = (betType) => {
    if (!betType) {
      return "N/A";
    }

    switch (betType.toLowerCase()) {
      case "bookmaker":
        return "BOOKMAKER";

      case "match_odds":
        return "MATCH ODDS";

      case "fancy":
        return "FANCY";

      default:
        return betType.toUpperCase();
    }
  };

  // ==============================
  // BADGE CLASS
  // ==============================
  const getBadgeClass = (betType) => {
    if (!betType) {
      return "bg-secondary";
    }

    const type = betType.toLowerCase();

    switch (type) {
      case "bookmaker":
        return "bg-primary";

      case "match_odds":
        return "bg-success";

      case "fancy":
        return "bg-warning";

      default:
        return "bg-secondary";
    }
  };

  // ==============================
  // ACTION CLASS
  // ==============================
  const getActionClass = (action) => {
    if (action === "LAGAI") {
      return "bg-danger";
    }

    if (action === "BACK") {
      return "bg-success";
    }

    return "bg-secondary";
  };

  // ==============================
  // PAGINATION BUTTONS
  // ==============================
  const renderPaginationButtons = () => {
    const buttons = [];

    const maxButtons = 5;

    let startPage = Math.max(
      1,
      pagination.currentPage -
      Math.floor(maxButtons / 2)
    );

    let endPage = Math.min(
      pagination.totalPages,
      startPage + maxButtons - 1
    );

    if (
      endPage - startPage + 1 <
      maxButtons
    ) {
      startPage = Math.max(
        1,
        endPage - maxButtons + 1
      );
    }

    // First
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

    // Previous
    if (pagination.currentPage > 1) {
      buttons.push(
        <button
          key="prev"
          onClick={() =>
            handlePageChange(
              pagination.currentPage - 1
            )
          }
          className="pagination-btn"
        >
          ‹
        </button>
      );
    }

    // Pages
    for (
      let i = startPage;
      i <= endPage;
      i++
    ) {
      buttons.push(
        <button
          key={i}
          onClick={() =>
            handlePageChange(i)
          }
          className={`pagination-btn ${pagination.currentPage === i
              ? "active"
              : ""
            }`}
        >
          {i}
        </button>
      );
    }

    // Next
    if (
      pagination.currentPage <
      pagination.totalPages
    ) {
      buttons.push(
        <button
          key="next"
          onClick={() =>
            handlePageChange(
              pagination.currentPage + 1
            )
          }
          className="pagination-btn"
        >
          ›
        </button>
      );
    }

    // Last
    if (
      endPage <
      pagination.totalPages
    ) {
      buttons.push(
        <button
          key="last"
          onClick={() =>
            handlePageChange(
              pagination.totalPages
            )
          }
          className="pagination-btn"
        >
          »
        </button>
      );
    }

    return buttons;
  };

  // ==============================
  // RESET FILTER
  // ==============================
  const handleResetFilter = () => {
    setSelectedBetType("all");
    setFilteredData(betsData);
  };

  // ==============================
  // RENDER
  // ==============================
  return (
    <div className="card">

      {/* ================= HEADER ================= */}
      <div className="card-header bg-primary-yellow d-flex justify-content-between align-items-md-center align-items-start">

        <h3 className="card-title mb-0">
          MATCH STATS
        </h3>

        <div className="filter-controls gap-2 d-flex align-items-center mobilewidthh">

          {/* BET TYPE FILTER */}
          <div className="bet-type-filter">
            <select
              className="form-select form-select-sm"
              value={selectedBetType}
              onChange={(e) =>
                handleBetTypeFilter(
                  e.target.value
                )
              }
            >
              <option value="all">
                All Types
              </option>

              {betTypes.map(
                (type, index) => (
                  <option
                    key={index}
                    value={type}
                  >
                    {formatBetType(type)}
                  </option>
                )
              )}
            </select>
          </div>

          {/* RESET */}
          <button
            className="btn btn-sm btn-outline-light"
            onClick={handleResetFilter}
          >
            Reset Filter
          </button>

        </div>
      </div>

      {/* ================= BODY ================= */}
      <div className="card-body">

        <div className="event-bets-container">

          {/* ERROR */}
          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          {/* LOADING */}
          {loading ? (
            <div className="loading text-center py-4">

              <div
                className="spinner-border text-primary"
                role="status"
              >
                <span className="visually-hidden">
                  Loading...
                </span>
              </div>

              <p className="mt-2">
                Loading event bets...
              </p>

            </div>
          ) : (
            <>
              {/* ================= NO DATA ================= */}
              {filteredData.length === 0 ? (

                <div className="no-data-section">

                  <div className="no-data-header table-responsive">

                    <table className="bets-table table table-striped">

                      <thead className="table-dark">

                        <tr>
                          <th style={{ color: "white" }}> SR NO</th>
                          <th style={{ color: "white" }}>
                            PLACE TIME
                          </th>

                          <th style={{ color: "white" }}>
                            USERNAME
                          </th>

                          <th style={{ color: "white" }}>
                            RUNNER NAME
                          </th>

                          <th style={{ color: "white" }}>
                            BET TYPE
                          </th>

                          <th style={{ color: "white" }}>
                            BET PRICE
                          </th>

                          <th style={{ color: "white" }}>
                            BET VALUE
                          </th>

                          <th style={{ color: "white" }}>
                            BET AMOUNT
                          </th>
                        </tr>

                      </thead>

                    </table>

                  </div>

                  <div className="no-data-message text-center py-5">

                    <h5 className="text-muted">
                      NO DATA FOUND
                    </h5>

                    <p className="text-muted">

                      {selectedBetType !== "all"
                        ? `No bets found for bet type: ${selectedBetType}`
                        : "No bets available"}

                    </p>

                    {selectedBetType !==
                      "all" && (
                        <button
                          className="btn btn-primary mt-2"
                          onClick={() =>
                            handleBetTypeFilter(
                              "all"
                            )
                          }
                        >
                          Show All Bets
                        </button>
                      )}

                  </div>

                </div>

              ) : (

                /* ================= DATA TABLE ================= */
                <>

                  <div className="data-section table-responsive">

                    <table className="bets-table table table-hover table-striped">

                      <thead className="table-dark">

                        <tr>
                          <th style={{ color: "white" }}> SR NO</th>
                          <th className="text-white">
                            PLACE TIME
                          </th>

                          <th className="text-white">
                            USERNAME
                          </th>

                          <th className="text-white">
                            RUNNER NAME
                          </th>

                          <th className="text-white">
                            BET ON
                          </th>

                          <th className="text-white">
                            BET TYPE
                          </th>

                          <th className="text-white">
                            BET PRICE
                          </th>

                          <th className="text-white">
                            BET VALUE
                          </th>

                          <th className="text-white">
                            BET AMOUNT
                          </th>

                        </tr>

                      </thead>

                      <tbody>

                        {filteredData.map(
                          (bet, index) => (

                            <tr key={index}>
                              <td>{index + 1}</td>
                              {/* PLACE TIME */}
                              <td>
                                {formatDate(
                                  bet.place_time ||
                                  bet.created_at
                                )}
                              </td>

                              {/* USERNAME */}
                              <td>

                                <div className="d-flex align-items-center">

                                  {bet.user_name
                                    ?.substring(
                                      0,
                                      20
                                    ) ||
                                    "-"}

                                </div>

                              </td>

                              {/* RUNNER NAME */}
                              <td>
                                {bet.runner_name ||
                                  bet.team ||
                                  "N/A"}
                              </td>

                              {/* BET ON */}
                              <td>
                                <span>
                                  {bet.bet_on?.toLowerCase() === "back"
                                    ? "Yes"
                                    : bet.bet_on?.toLowerCase() === "lay"
                                      ? "No"
                                      : bet.bet_on || "N/A"}
                                </span>
                              </td>


                              {/* BET TYPE */}
                              <td>
                                {formatBetType(
                                  bet.bet_type
                                )}
                              </td>

                              {/* BET PRICE */}
                              <td>
                                {formatNumber(
                                  bet.bet_price ||
                                  bet.odd
                                )}
                              </td>

                              {/* BET VALUE */}
                              <td>
                                {formatNumber(
                                  bet.bet_value ||
                                  bet.total
                                )}
                              </td>

                              {/* BET AMOUNT */}
                              <td>
                                {formatNumber(
                                  bet.bet_amount ||
                                  bet.stake ||
                                  bet.amount
                                )}
                              </td>

                            </tr>

                          )
                        )}

                      </tbody>

                    </table>

                  </div>

                  {/* ================= PAGINATION ================= */}

                  {pagination.totalPages >
                    1 && (

                      <div className="pagination-section mt-3">

                        <div className="row align-items-center justify-content-between w-100">

                          {/* INFO */}
                          <div className="col-md-6 col-6">

                            <div className="pagination-info">

                              <small>

                                Showing{" "}
                                {(
                                  (pagination.currentPage -
                                    1) *
                                  pagination.pageSize
                                ) + 1}

                                {" "}to{" "}

                                {Math.min(
                                  pagination.currentPage *
                                  pagination.pageSize,
                                  pagination.totalRecords
                                )}

                                {" "}of{" "}

                                {
                                  pagination.totalRecords
                                }

                                {" "}entries

                              </small>

                            </div>

                          </div>

                          {/* BUTTONS */}
                          <div className="col-md-6 col-6">

                            <div className="paginationall pagination-controls d-flex justify-content-end">

                              {renderPaginationButtons()}

                            </div>

                          </div>

                        </div>

                      </div>

                    )}

                </>

              )}

            </>
          )}

        </div>

      </div>

    </div>
  );
}

export default GetEventBets;
