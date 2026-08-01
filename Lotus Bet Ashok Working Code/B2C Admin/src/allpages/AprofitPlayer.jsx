import React, { useState, useEffect } from 'react';
import { profitLossReportPlayer } from "../Server/api";
import { Link } from 'react-router';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

function AprofitPlayer() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  const [summary, setSummary] = useState({
    total_downline_pl: 0,
    total_player_pl: 0,
    total_commission: 0,
    total_upline_pl: 0
  });
  const [agentDetails, setAgentDetails] = useState({
    total_users: 0,
    total_records: 0,
    message: ""
  });

  // ✅ Helper functions for dates
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getLastMonthDate = () => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split('T')[0];
  };

  // ✅ Filter states - WITH DEFAULT DATES (last 30 days)
  const [filters, setFilters] = useState({
    from_date: getLastMonthDate(),
    from_time: "00:00",
    to_date: getTodayDate(),
    to_time: "23:59",
    last: "",
    sport_id: "",
    page: 1,
    limit: 20
  });

  // ✅ Initial fetch on component mount
  useEffect(() => {
    fetchData(filters);
  }, []);

  // Fetch data function
  const fetchData = async (filterParams = null) => {
    setLoading(true);
    setError(null);
    try {
      const params = filterParams || filters;

      const cleanParams = {};
      Object.keys(params).forEach(key => {
        if (params[key] !== "" && params[key] !== null && params[key] !== undefined) {
          cleanParams[key] = params[key];
        }
      });

      // ✅ Agar dates empty hain toh error do
      if (!cleanParams.from_date || !cleanParams.to_date) {
        setLoading(false);
        setData([]);
        setSummary({
          total_downline_pl: 0,
          total_player_pl: 0,
          total_commission: 0,
          total_upline_pl: 0
        });
        setPagination({
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0
        });
        setAgentDetails({
          total_users: 0,
          total_records: 0,
          message: ""
        });
        setError("Please select From and To dates");
        return;
      }

      console.log("API Payload:", cleanParams);
      const response = await profitLossReportPlayer(cleanParams);
      console.log("Full API Response:", response);

      if (response) {
        let responseData = [];

        if (response.data && Array.isArray(response.data)) {
          responseData = response.data;
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          responseData = response.data.data;
        } else if (Array.isArray(response)) {
          responseData = response;
        }

        setData(responseData);

        if (response.summary) {
          setSummary(response.summary);
        } else if (response.data && response.data.summary) {
          setSummary(response.data.summary);
        }

        if (response.pagination) {
          setPagination(response.pagination);
        } else if (response.data && response.data.pagination) {
          setPagination(response.data.pagination);
        }

        if (response.agent_details) {
          setAgentDetails(response.agent_details);
        } else if (response.data && response.data.agent_details) {
          setAgentDetails(response.data.agent_details);
        }
      } else {
        setData([]);
      }

    } catch (err) {
      console.error("Error fetching profit/loss data:", err);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1
    }));
  };

  const handleDateTimeChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: value,
      page: 1
    }));
  };

  const handleSportFilter = (sportId) => {
    if (!filters.from_date || !filters.to_date) {
      setError("Please select From and To dates first");
      return;
    }
    const newFilters = {
      ...filters,
    sport_id: sportId ? String(sportId) : "",
      page: 1
    };
    setFilters(newFilters);
    fetchData(newFilters);
  };

  const handleJustForToday = () => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    const newFilters = {
      ...filters,
      from_date: formattedDate,
      to_date: formattedDate,
      from_time: "00:00",
      to_time: "23:59",
      page: 1
    };
    setFilters(newFilters);
    fetchData(newFilters);
  };

  const handleFromYesterday = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const formattedDate = yesterday.toISOString().split('T')[0];
    const newFilters = {
      ...filters,
      from_date: formattedDate,
      to_date: formattedDate,
      from_time: "00:00",
      to_time: "23:59",
      page: 1
    };
    setFilters(newFilters);
    fetchData(newFilters);
  };

  const handleReset = () => {
    const emptyFilters = {
      from_date: getLastMonthDate(),
      from_time: "00:00",
      to_date: getTodayDate(),
      to_time: "23:59",
      last: "",
      sport_id: "",
      page: 1,
      limit: 20
    };
    setFilters(emptyFilters);
    fetchData(emptyFilters);
  };

  const handleSearch = () => {
    if (!filters.from_date || !filters.to_date) {
      setError("Please select From and To dates");
      return;
    }
    const searchFilters = {
      ...filters,
      page: 1
    };
    setFilters(searchFilters);
    fetchData(searchFilters);
  };

  const handleBlur = () => {
    if (filters.from_date && filters.to_date) {
      fetchData(filters);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    const newFilters = {
      ...filters,
      page: newPage
    };
    setFilters(newFilters);
    fetchData(newFilters);
  };

  const handleLimitChange = (e) => {
    const newLimit = parseInt(e.target.value);
    const newFilters = {
      ...filters,
      limit: newLimit,
      page: 1
    };
    setFilters(newFilters);
    fetchData(newFilters);
  };

  return (
    <div className='allcommon'>
      <section className="main-inner-outer py-4">
        <div className="container-fluid">
          <div className="row">
            <div className="db-sec">
              <h2 className="common-heading">Profit/Loss Report by Player</h2>
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
                            <div className="form-group d-flex">
                              <input
                                type="date"
                                className="small_form_control form-control"
                                value={filters.from_date}
                                onChange={(e) => handleDateTimeChange('from_date', e.target.value)}
                                onBlur={handleBlur}
                                onKeyPress={handleKeyPress}
                              />
                              <input
                                placeholder="00:00"
                                type="time"
                                className="small_form_control form-control ms-2"
                                value={filters.from_time}
                                onChange={(e) => handleDateTimeChange('from_time', e.target.value)}
                                onBlur={handleBlur}
                                onKeyPress={handleKeyPress}
                                style={{ width: 80 }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="mb-lg-0 mb-2 flex-grow-0 ps-2 col-lg-3 col-sm-6">
                          <div className="bet-sec bet-period">
                            <label className="px-2 form-label">To</label>
                            <div className="form-group d-flex">
                              <input
                                type="date"
                                className="small_form_control form-control"
                                value={filters.to_date}
                                onChange={(e) => handleDateTimeChange('to_date', e.target.value)}
                                onBlur={handleBlur}
                                onKeyPress={handleKeyPress}
                              />
                              <input
                                placeholder="00:00"
                                type="time"
                                className="small_form_control form-control ms-2"
                                value={filters.to_time}
                                onChange={(e) => handleDateTimeChange('to_time', e.target.value)}
                                onBlur={handleBlur}
                                onKeyPress={handleKeyPress}
                                style={{ width: 80 }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="mb-lg-0 mb-3 col-lg-2 col-sm-3">
                          <div className="bet-sec">
                            <label className="form-label">Last</label>
                            <select
                              aria-label="Default select example"
                              className="small_select form-select"
                              name="last"
                              value={filters.last}
                              onChange={handleFilterChange}
                              onBlur={handleBlur}
                            >
                              <option value="">All</option>
                              <option value="100">100 Txn</option>
                              <option value="200">200 Txn</option>
                              <option value="500">500 Txn</option>
                              <option value="1000">1000 Txn</option>
                              <option value="5000">5000 Txn</option>
                              <option value="10000">10000 Txn</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="history-btn mt-2">
                    <ul className="list-unstyled mb-0 d-flex flex-wrap">
                      <li>
                        <button
                          type="button"
                          className="me-2 theme_light_btn btn btn-primary"
                          onClick={handleJustForToday}
                        >
                          Just For Today
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          className="me-2 theme_light_btn btn btn-primary"
                          onClick={handleFromYesterday}
                        >
                          From Yesterday
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          className="me-2 theme_dark_btn btn btn-primary"
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
            <div className="col-md-12">
              <div className="d-flex flex-wrap align-items-center justify-content-between">
                <div className="d-flex flex-wrap live-match-bat">
                  <button
                    type="button"
                    className={`mb-2 mx-1 ${filters.sport_id === '' ? 'theme_dark_btn' : 'theme_light_btn'} btn btn-primary`}
                    onClick={() => handleSportFilter('')}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    className={`mb-2 mx-1 ${filters.sport_id === '4' ? 'theme_dark_btn' : 'theme_light_btn'} btn btn-primary`}
                    onClick={() => handleSportFilter('4')}
                  >
                    Cricket
                  </button>
                  <button
                    type="button"
                    className={`mb-2 mx-1 ${filters.sport_id === '1' ? 'theme_dark_btn' : 'theme_light_btn'} btn btn-primary`}
                    onClick={() => handleSportFilter('1')}
                  >
                    Soccer
                  </button>
                  <button
                    type="button"
                    className={`mb-2 mx-1 ${filters.sport_id === '2' ? 'theme_dark_btn' : 'theme_light_btn'} btn btn-primary`}
                    onClick={() => handleSportFilter('2')}
                  >
                    Tennis
                  </button>
                  <button
                    type="button"
                    className={`mb-2 mx-1 ${filters.sport_id === '10' ? 'theme_dark_btn' : 'theme_light_btn'} btn btn-primary`}
                    onClick={() => handleSportFilter('10')}
                  >
                    International Casino
                  </button>
                  {/* <button
                    type="button"
                    className={`mb-2 mx-1 ${filters.sport_id === '11' ? 'theme_dark_btn' : 'theme_light_btn'} btn btn-primary`}
                    onClick={() => handleSportFilter('11')}
                  >
                    Indian Casino
                  </button> */}
                </div>
                {agentDetails.total_users > 0 && (
                  <div className="mb-2">
                    {/* <span className="badge bg-info me-2">Total Users: {agentDetails.total_users}</span>
                    <span className="badge bg-secondary">Total Records: {agentDetails.total_records}</span> */}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-2 col-lg-12 col-md-12 col-sm-12">
              <section className="account-table w-100">
                <div className="responsive transaction-history table-color">
                  {loading ? (
                    <div className="text-center py-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : error ? (
                    <div className="alert alert-danger m-3">{error}</div>
                  ) : data && data.length > 0 ? (
                    <>
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Sr No.</th>
                            <th scope="col">UID</th>
                            <th scope="col">Downline P/L</th>
                            <th scope="col">Player P/L</th>
                            <th scope="col">Comm.</th>
                            <th scope="col">Upline P/L</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.map((item, index) => (
                            <tr key={item.user_id || index}>
                              <td>{(pagination.page - 1) * pagination.limit + index + 1}</td>
                              <td>
                                <div>
                                  <strong>{item.username || 'N/A'}</strong>
                                  <br />
                                </div>
                              </td>
                              <td>
                                <span className={item.downline_pl < 0 ? 'text-danger' : 'text-success'}>
                                  {item.downline_pl < 0 ? `(${Math.abs(item.downline_pl).toFixed(2)})` : item.downline_pl.toFixed(2)}
                                </span>
                              </td>
                              <td>
                                <span className={item.player_pl < 0 ? 'text-danger' : 'text-success'}>
                                  {item.player_pl < 0 ? `(${Math.abs(item.player_pl).toFixed(2)})` : item.player_pl.toFixed(2)}
                                </span>
                              </td>
                              <td>{item.commission ? item.commission.toFixed(2) : '0.00'}</td>
                              <td>
                                <span className={item.upline_pl < 0 ? 'text-danger' : 'text-success'}>
                                  {item.upline_pl < 0 ? `(${Math.abs(item.upline_pl).toFixed(2)})` : item.upline_pl.toFixed(2)}
                                </span>
                              </td>
                            </tr>
                          ))}
                          <tr className="table-active fw-bold">
                            <td colSpan="2" className="text-end">Total</td>
                            <td>
                              <span className={summary.total_downline_pl < 0 ? 'text-danger' : 'text-success'}>
                                {summary.total_downline_pl < 0 ? `(${Math.abs(summary.total_downline_pl).toFixed(2)})` : summary.total_downline_pl.toFixed(2)}
                              </span>
                            </td>
                            <td>
                              <span className={summary.total_player_pl < 0 ? 'text-danger' : 'text-success'}>
                                {summary.total_player_pl < 0 ? `(${Math.abs(summary.total_player_pl).toFixed(2)})` : summary.total_player_pl.toFixed(2)}
                              </span>
                            </td>
                            <td>{summary.total_commission ? summary.total_commission.toFixed(2) : '0.00'}</td>
                            <td>
                              <span className={summary.total_upline_pl < 0 ? 'text-danger' : 'text-success'}>
                                {summary.total_upline_pl < 0 ? `(${Math.abs(summary.total_upline_pl).toFixed(2)})` : summary.total_upline_pl.toFixed(2)}
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      {/* Pagination */}

                      {pagination.total > 0 && (
                        <div className="bottom-pagination d-flex justify-content-center align-items-center">
                          <ul className="pagination mb-0 gap-0">
                            <li className={`previous ${pagination.page === 1 ? "disabled" : ""}`}>
                              <Link className="" onClick={() => handlePageChange(pagination.page - 1)}>
                                <FaChevronLeft />
                              </Link>
                            </li>
                            {[pagination.page - 1, pagination.page, pagination.page + 1]
                              .filter((p) => p > 0 && p <= pagination.totalPages)
                              .map((p) => (
                                <li key={p} className={`p-0 ${pagination.page === p ? "active" : ""}`}>
                                  <Link className="pagintion-li" onClick={() => handlePageChange(p)}>
                                    {p}
                                  </Link>
                                </li>
                              ))}
                            <li className={`next ${pagination.page === pagination.totalPages ? "disabled" : ""}`}>
                              <Link className="" onClick={() => handlePageChange(pagination.page + 1)}>
                                <FaChevronRight />
                              </Link>
                            </li>
                          </ul>
                        </div>
                      )}
                    </>
                  ) : (
                    // ✅ Empty table with headers
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Sr No.</th>
                          <th scope="col">UID</th>
                          <th scope="col">Downline P/L</th>
                          <th scope="col">Player P/L</th>
                          <th scope="col">Comm.</th>
                          <th scope="col">Upline P/L</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td colSpan="6" className="text-center py-4">
                            No records found
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AprofitPlayer;