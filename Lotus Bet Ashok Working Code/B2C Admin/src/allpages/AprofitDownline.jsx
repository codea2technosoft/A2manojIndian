import React, { useEffect, useState } from 'react'
import { DateWisePlReportByDate } from "../../src/Server/api";

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

  // Format date for API
  const formatDateTime = (date, time) => {
    if (!date) return "";
    if (time) {
      return `${date}T${time}:00`;
    }
    return date;
  };

  const fetchReport = async () => {
    setLoading(true);
    try {
      const payload = {
        page: currentPage,
        limit: limit,
        startDate: formatDateTime(fromDate, fromTime),
        endDate: formatDateTime(toDate, toTime),
      };

      const result = await DateWisePlReportByDate(payload);
      
      if (result?.data?.success) {
        // Map the API response to match the component structure
        const mappedData = result.data.data.map(item => ({
          uid: item.uid || item.userId || "",
          name: item.name || item.username || "",
          cricketPL: item.cricketPL || item.cricket || 0,
          soccerPL: item.soccerPL || item.soccer || 0,
          tennisPL: item.tennisPL || item.tennis || 0,
          internationalCasinoPL: item.internationalCasinoPL || item.internationalCasino || 0,
          indiaCasinoPL: item.indiaCasinoPL || item.indiaCasino || 0,
          gapCasinoPL: item.gapCasinoPL || item.gapCasino || 0,
          uplinePL: item.uplinePL || item.totalPL || 0,
          userId: item.userId || item._id || ""
        }));
        
        setData(mappedData);
        setTotalPages(result.data.pagination?.totalPages || 1);
        setTotalRecords(result.data.pagination?.total || 0);
        
        // Set summary if available
        if (result.data.totals) {
          setSummary({
            totalCricketPL: result.data.totals.totalCricketPL || 0,
            totalSoccerPL: result.data.totals.totalSoccerPL || 0,
            totalTennisPL: result.data.totals.totalTennisPL || 0,
            totalInternationalCasinoPL: result.data.totals.totalInternationalCasinoPL || 0,
            totalIndiaCasinoPL: result.data.totals.totalIndiaCasinoPL || 0,
            totalGapCasinoPL: result.data.totals.totalGapCasinoPL || 0,
            totalUplinePL: result.data.totals.totalUplinePL || 0
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
    fetchReport();
  }, [currentPage]);

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
                                max="2026-07-04"
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
                                min={fromDate || "2026-07-03"}
                                max="2026-07-04"
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
                            <th scope="col">Cricket P/L</th>
                            <th scope="col">Soccer P/L</th>
                            <th scope="col">Tennis P/L</th>
                            <th scope="col">International Casino P/L</th>
                            <th scope="col">India Casino P/L</th>
                            <th scope="col">Gap Casino P/L</th>
                            <th scope="col">Upline/Total P/L</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.length > 0 ? (
                            data.map((item, index) => (
                              <tr key={index}>
                                <td className="text-start">
                                  <a href={`/AprofitDownline/${item.userId}/agent`}>
                                    <span>AG</span>{item.name || item.uid}
                                  </a>
                                </td>
                                <td>
                                  <span className={getColorClass(item.cricketPL)}>
                                    {formatPLValue(item.cricketPL)}
                                  </span>
                                </td>
                                <td>
                                  <span className={getColorClass(item.soccerPL)}>
                                    {formatPLValue(item.soccerPL)}
                                  </span>
                                </td>
                                <td>
                                  <span className={getColorClass(item.tennisPL)}>
                                    {formatPLValue(item.tennisPL)}
                                  </span>
                                </td>
                                <td>
                                  <span className={getColorClass(item.internationalCasinoPL)}>
                                    {formatPLValue(item.internationalCasinoPL)}
                                  </span>
                                </td>
                                <td>
                                  <span className={getColorClass(item.indiaCasinoPL)}>
                                    {formatPLValue(item.indiaCasinoPL)}
                                  </span>
                                </td>
                                <td>
                                  <span className={getColorClass(item.gapCasinoPL)}>
                                    {formatPLValue(item.gapCasinoPL)}
                                  </span>
                                </td>
                                <td>
                                  <span className={getColorClass(item.uplinePL)}>
                                    {formatPLValue(item.uplinePL)}
                                  </span>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="8" className="text-center py-4">
                                No records found
                              </td>
                            </tr>
                          )}
                          {/* Total Row */}
                          {data.length > 0 && (
                            <tr>
                              <th scope="col">Total</th>
                              <th scope="col">
                                <span className={getColorClass(summary.totalCricketPL)}>
                                  {formatPLValue(summary.totalCricketPL)}
                                </span>
                              </th>
                              <th scope="col">
                                <span className={getColorClass(summary.totalSoccerPL)}>
                                  {formatPLValue(summary.totalSoccerPL)}
                                </span>
                              </th>
                              <th scope="col">
                                <span className={getColorClass(summary.totalTennisPL)}>
                                  {formatPLValue(summary.totalTennisPL)}
                                </span>
                              </th>
                              <th scope="col">
                                <span className={getColorClass(summary.totalInternationalCasinoPL)}>
                                  {formatPLValue(summary.totalInternationalCasinoPL)}
                                </span>
                              </th>
                              <th scope="col">
                                <span className={getColorClass(summary.totalIndiaCasinoPL)}>
                                  {formatPLValue(summary.totalIndiaCasinoPL)}
                                </span>
                              </th>
                              <th scope="col">
                                <span className={getColorClass(summary.totalGapCasinoPL)}>
                                  {formatPLValue(summary.totalGapCasinoPL)}
                                </span>
                              </th>
                              <th scope="col">
                                <span className={getColorClass(summary.totalUplinePL)}>
                                  {formatPLValue(summary.totalUplinePL)}
                                </span>
                              </th>
                            </tr>
                          )}
                        </tbody>
                      </table>
                      {/* Pagination */}
                      {data.length > 0 && totalPages > 1 && (
                        <div className="bottom-pagination">
                          <ul role="navigation" aria-label="Pagination">
                            <li className={currentPage === 1 ? "previous disabled" : "previous"}>
                              <a
                                className=""
                                tabIndex={currentPage === 1 ? -1 : 0}
                                role="button"
                                aria-disabled={currentPage === 1}
                                aria-label="Previous page"
                                rel="prev"
                                onClick={handlePrev}
                                style={{ cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                              >
                                &lt;
                              </a>
                            </li>
                            <li className="page-info">
                              <span>Page {currentPage} of {totalPages}</span>
                            </li>
                            <li className={currentPage === totalPages ? "next disabled" : "next"}>
                              <a
                                className=""
                                tabIndex={currentPage === totalPages ? -1 : 0}
                                role="button"
                                aria-disabled={currentPage === totalPages}
                                aria-label="Next page"
                                rel="next"
                                onClick={handleNext}
                                style={{ cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                              >
                                &gt;
                              </a>
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