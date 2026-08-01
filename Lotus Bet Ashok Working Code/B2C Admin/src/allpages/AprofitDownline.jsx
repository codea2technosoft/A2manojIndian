import React, { useEffect, useState } from 'react'
import { getprofitLossReport } from "../../src/Server/api";
import { Link } from 'react-router';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

function AprofitDownline() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const limit = 50;

  // Filter states
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");

  // ✅ NEW: Dynamic game list state
  const [gameList, setGameList] = useState([]);

  // Summary states
  const [summary, setSummary] = useState({
    totalCricketPL: 0,
    totalSoccerPL: 0,
    totalTennisPL: 0,
    totalInternationalCasinoPL: 0,
    totalIndiaCasinoPL: 0,
    totalGapCasinoPL: 0,
    totalUplinePL: 0
  });

  // ✅ NEW: Dynamic summary state
  const [dynamicSummary, setDynamicSummary] = useState({
    total_pl: 0,
    game_totals: {},
    total_agents: 0,
    total_records: 0
  });

  // Format date for API
  const formatDateTime = (date, time) => {
    if (!date) return "";
    if (time) {
      return `${date}T${time}:00`;
    }
    return date;
  };


  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };
  // ✅ NEW: Fetch game list dynamically
  const fetchGameList = async () => {
    try {
      // Agar aapke paas game list API hai toh use karo
      // const response = await API.get("/game-list");
      // setGameList(response.data.game_list);

      // ✅ Temporary: Static game list (baad me API se replace karna)
      const staticGameList = [
        { id: 1, name: "football", key: "football_" },
        { id: 4, name: "cricket", key: "cricket" },
        { id: 2, name: "tennis", key: "tennis" },
        { id: 7, name: "Horse Racing", key: "horse_racing" },
        { id: 6, name: "Kabaddi", key: "kabaddi" },
        { id: 8, name: "Greyhound Racing", key: "greyhound_racing" },
        { id: 10, name: "All Casino", key: "all_casino" }
      ];
      setGameList(staticGameList);
    } catch (error) {
      console.error("Error fetching game list:", error);
    }
  };

  const fetchReport = async () => {
    setLoading(true);
    try {
      const payload = {
        page: currentPage,
        limit: limit,
        from_date: formatDateTime(fromDate, fromTime),
        to_date: formatDateTime(toDate, toTime),
      };

      const result = await getprofitLossReport(payload);

      if (result?.data?.success) {
        // ✅ NEW: Dynamic data mapping based on game keys
        const gameKeys = gameList.map(game => game.key);

        const mappedData = result.data.data.map(item => {
          // Base object
          const mappedItem = {
            admin_id: item.admin_id || item.uid || "",
            username: item.username || item.name || "",
            phoneNumber: item.phoneNumber || "",
            email: item.email || "",
            record_count: item.record_count || 0,
            total_pl: item.total_pl || item.uplinePL || 0,
          };

          // ✅ Dynamically add game values
          gameKeys.forEach(key => {
            mappedItem[key] = item[key] || 0;
          });

          return mappedItem;
        });

        setData(mappedData);
        setTotalPages(result.data.pagination?.totalPages || 1);
        setTotalRecords(result.data.pagination?.total || 0);

        // ✅ NEW: Set dynamic summary
        if (result.data.summary) {
          setDynamicSummary({
            total_pl: result.data.summary.total_pl || 0,
            game_totals: result.data.summary.game_totals || {},
            total_agents: result.data.summary.total_agents || 0,
            total_records: result.data.summary.total_records || 0
          });

          // ✅ Old summary mapping (backward compatibility)
          const gameTotals = result.data.summary.game_totals || {};
          setSummary({
            totalCricketPL: gameTotals.cricket || 0,
            totalSoccerPL: gameTotals.football_ || 0,
            totalTennisPL: gameTotals.tennis || 0,
            totalInternationalCasinoPL: gameTotals.international_casino || 0,
            totalIndiaCasinoPL: gameTotals.india_casino || 0,
            totalGapCasinoPL: gameTotals.gap_casino || 0,
            totalUplinePL: result.data.summary.total_pl || 0
          });
        }
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching downline report:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Auto fetch on page change
  useEffect(() => {
    if (gameList.length > 0) {
      fetchReport();
    }
  }, [currentPage, gameList]);

  // ✅ NEW: Fetch game list on mount
  useEffect(() => {
    fetchGameList();
  }, []);

  // Handle Search
  const handleSearch = () => {
    setCurrentPage(1);
    fetchReport();
  };

  // Handle Reset
  const handleReset = () => {
    setFromDate("");
    setToDate("");
    setFromTime("");
    setToTime("");
    setCurrentPage(1);
    fetchReport();
  };

  // Format number with commas
  const formatNumber = (num = 0) => {
    return Number(num).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Get color class based on value
  const getColorClass = (value) => {
    if (value > 0) return "text-success";
    if (value < 0) return "text-danger";
    return "text-dark";
  };
  const getColorClassnew = (value) => {
    if (value > 0) return "text-success";
    if (value < 0) return "text-danger";
    return "text-white";
  };

  // Format display value with parentheses for negative
  const formatPLValue = (value) => {
    const num = Number(value || 0);
    if (num < 0) {
      return `(${formatNumber(Math.abs(num))})`;
    }
    return formatNumber(num);
  };

  // Pagination handlers
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  // ✅ NEW: Get display name for game key
  const getGameDisplayName = (key) => {
    const game = gameList.find(g => g.key === key);
    return game ? game.name : key;
  };

  return (
    <div className='allcommon'>
      <section className="main-inner-outer py-4">
        <div className="container-fluid">
          <div className="row">
            <div className="db-sec">
              <h2 className="common-heading">Profit/Loss Report by Downline</h2>
            </div>
            <div className="col-md-12">
              <div className="inner-wrapper">
                <form className="bet_status" onSubmit={(e) => e.preventDefault()}>
                  <div className="row">
                    <div className="col-xl-12 col-md-12">
                      <div className="row">
                        <div className="mb-lg-0 mb-2 flex-grow-0 pe-2 col-lg-3 col-sm-6">
                          <div className="bet-sec bet-period">
                            <label className="px-2 form-label">From</label>
                            <div className="form-group">
                              <input
                                // ✅ FIX: max attribute hatao ya dynamic karo
                                type="date"
                                className="small_form_control form-control"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                              />
                              <input
                                placeholder="00:00"
                                type="time"
                                className="small_form_control form-control"
                                value={fromTime}
                                onChange={(e) => setFromTime(e.target.value)}
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
                                // ✅ FIX: min attribute hatao ya dynamic karo
                                type="date"
                                className="small_form_control form-control"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                              />
                              <input
                                placeholder="00:00"
                                type="time"
                                className="small_form_control form-control"
                                value={toTime}
                                onChange={(e) => setToTime(e.target.value)}
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
                      <li>
                        <button
                          type="button"
                          className="theme_dark_btn btn btn-primary"
                          onClick={handleSearch}
                        >
                          Search
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
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
            <div className="mt-2 col-lg-12 col-md-12 col-sm-12">
              <section className="account-table aprofit-downline w-100">
                <div className="responsive transaction-history">
                  {loading ? (
                    <div className="text-center py-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <table className="table">
                        <thead>
                          <tr>
                            <th scope="col">UID</th>
                            {gameList.map((game) => (
                              <th key={game.id} scope="col" >
                                {game.name?.charAt(0).toUpperCase() + game.name?.slice(1).toLowerCase()} P/L
                              </th>
                            ))}
                            <th scope="col">Total P/L</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.length > 0 ? (
                            data.map((item, index) => (
                              <tr key={index}>
                                <td className="text-start">
                                  <Link to={`/aprofit-downline-user?agent_id=${item.admin_id}`}>
                                    <span>AG</span>
                                    {item.username}
                                  </Link>
                                </td>
                                {gameList.map((game) => (
                                  <td key={game.id}>
                                    <span style={{ color: "#000!important" }} className={getColorClass(item[game.key] || 0)}>
                                      {formatPLValue(item[game.key] || 0)}
                                    </span>
                                  </td>
                                ))}
                                <td>
                                  <span className={getColorClass(item.total_pl)}>
                                    {formatPLValue(item.total_pl)}
                                  </span>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={gameList.length + 3} className="text-center py-4">
                                No records found
                              </td>
                            </tr>
                          )}
                          {/* ✅ DYNAMIC: Total Row */}
                          {data.length > 0 && (
                            <tr>
                              <th scope="col">Total</th>
                              {/* ✅ DYNAMIC: Game totals */}
                              {gameList.map((game) => (
                                <th key={game.id} scope="col">
                                  <span className={getColorClassnew(dynamicSummary.game_totals[game.key] || 0)}>
                                    {formatPLValue(dynamicSummary.game_totals[game.key] || 0)}
                                  </span>
                                </th>
                              ))}
                              <th scope="col">
                                <span className={getColorClassnew(dynamicSummary.total_pl)}>
                                  {formatPLValue(dynamicSummary.total_pl)}
                                </span>
                              </th>
                            </tr>
                          )}
                        </tbody>
                      </table>

                      {/* Pagination */}

                      {data.length > 0 && totalPages > 0 && (
                        <div className="bottom-pagination d-flex justify-content-center align-items-center">
                          <ul className="pagination mb-0 gap-0">

                            <li className={`previous ${currentPage === 1 ? "disabled" : ""}`}>
                              <Link onClick={() => handlePageChange(currentPage - 1)}>
                                <FaChevronLeft />
                              </Link>
                            </li>

                            {[currentPage - 1, currentPage, currentPage + 1]
                              .filter((p) => p > 0 && p <= totalPages)
                              .map((p) => (
                                <li
                                  key={p}
                                  className={`p-0 ${currentPage === p ? "active" : ""}`}
                                >
                                  <Link
                                    className="pagintion-li"
                                    onClick={() => handlePageChange(p)}
                                  >
                                    {p}
                                  </Link>
                                </li>
                              ))}

                            <li className={`next ${currentPage === totalPages ? "disabled" : ""}`}>
                              <Link onClick={() => handlePageChange(currentPage + 1)}>
                                <FaChevronRight />
                              </Link>
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
      </section>
    </div>
  )
}

export default AprofitDownline