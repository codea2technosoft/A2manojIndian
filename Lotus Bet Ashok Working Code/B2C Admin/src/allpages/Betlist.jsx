import React, { useState, useEffect } from 'react';
import {
  getAllBetList,
} from "../Server/api";

function Betlist() {
  const [filters, setFilters] = useState({
    user_id: '',
    sport: 'all',
    market_type: 'all',
    bet_status: 'all',
    from_date: '',
    to_date: '',
    bet_on: 'all',
    team: 'all',
    page: 1,
    limit: 35,
    search: ''
  });

  const [betData, setBetData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });
  const [summary, setSummary] = useState(null);

  const fetchBetList = async (page = 1) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();

      if (filters.user_id) queryParams.append('user_id', filters.user_id);
      if (filters.sport && filters.sport !== 'all') queryParams.append('sport', filters.sport);
      if (filters.market_type && filters.market_type !== 'all') queryParams.append('market_type', filters.market_type);
      if (filters.bet_status && filters.bet_status !== 'all') queryParams.append('bet_status', filters.bet_status);
      if (filters.from_date) queryParams.append('from_date', filters.from_date);
      if (filters.to_date) queryParams.append('to_date', filters.to_date);
      if (filters.bet_on && filters.bet_on !== 'all') queryParams.append('bet_on', filters.bet_on);
      if (filters.team && filters.team !== 'all') queryParams.append('team', filters.team);
      if (filters.search) queryParams.append('search', filters.search);

      queryParams.append('page', page);
      queryParams.append('limit', filters.limit);

      const queryString = queryParams.toString();
      const response = await getAllBetList(queryString, 'GET');

      console.log('Full API Response:', response);

      // ✅ FIXED: Directly access response.data since that's where your data is
      if (response && response.data) {
        const responseData = response.data;

        console.log('Response Data:', responseData);

        // ✅ Get bets data - it's directly in response.data
        if (Array.isArray(responseData)) {
          setBetData(responseData);
        } else if (responseData.data && Array.isArray(responseData.data)) {
          setBetData(responseData.data);
        } else {
          setBetData([]);
        }

        // ✅ Get pagination - it's at response.data.pagination
        if (responseData.pagination) {
          setPagination({
            currentPage: responseData.pagination.page || page,
            totalPages: responseData.pagination.totalPages || 1,
            total: responseData.pagination.total || 0
          });
          console.log('Pagination set:', {
            currentPage: responseData.pagination.page,
            totalPages: responseData.pagination.totalPages,
            total: responseData.pagination.total
          });
        }

        // ✅ Get summary - it's at response.data.summary
        if (responseData.summary) {
          setSummary(responseData.summary);
          console.log('Summary set:', responseData.summary);
        }
      } else {
        console.warn('No data in response:', response);
        setBetData([]);
      }
    } catch (error) {
      console.error('Error fetching bet list:', error);
      setBetData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBetList(1);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBetList(1);
  };

  const handleReset = () => {
    setFilters({
      user_id: '',
      sport: 'all',
      market_type: 'all',
      bet_status: 'all',
      from_date: '',
      to_date: '',
      bet_on: 'all',
      team: 'all',
      page: 1,
      limit: 50,
      search: ''
    });
    setTimeout(() => {
      fetchBetList(1);
    }, 100);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setFilters(prev => ({ ...prev, page: page }));
      fetchBetList(page);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const renderPagination = () => {
    const items = [];
    const total = pagination.totalPages;
    const current = pagination.currentPage;

    if (total <= 1) return null;

    items.push(
      <li key="prev" className={`previous ${current === 1 ? 'disabled' : ''}`}>
        <a
          onClick={() => current > 1 && handlePageChange(current - 1)}
          className={current === 1 ? '' : 'cursor-pointer'}
          tabIndex={current === 1 ? -1 : 0}
          role="button"
          aria-disabled={current === 1}
          aria-label="Previous page"
          rel="prev"
        >
          &lt;
        </a>
      </li>
    );

    let startPage = Math.max(1, current - 4);
    let endPage = Math.min(total, current + 4);

    if (current <= 4) {
      endPage = Math.min(10, total);
    }
    if (current >= total - 3) {
      startPage = Math.max(1, total - 9);
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <li key={i} className={i === current ? 'p-1 active' : ''}>
          <a
            onClick={() => handlePageChange(i)}
            role="button"
            className={i === current ? 'pagintion-li active' : ''}
            tabIndex={i === current ? -1 : 0}
            aria-label={`Page ${i}`}
            aria-current={i === current ? 'page' : undefined}
          >
            {i}
          </a>
        </li>
      );
    }

    items.push(
      <li key="next" className={`next ${current === total ? 'disabled' : ''}`}>
        <a
          onClick={() => current < total && handlePageChange(current + 1)}
          className={current === total ? '' : 'cursor-pointer'}
          tabIndex={current === total ? -1 : 0}
          role="button"
          aria-disabled={current === total}
          aria-label="Next page"
          rel="next"
        >
          &gt;
        </a>
      </li>
    );

    return items;
  };

  const getRowColor = (bet) => {
    if (bet.bet_on === 'lay' || bet.type === 'lay') {
      return '#FAA9BA';
    }
    return '#72BBEF';
  };

  const formatProfitLoss = (value) => {
    if (value === undefined || value === null) return 'N/A';
    if (value < 0) {
      return `-(${Math.abs(value).toFixed(2)})`;
    }
    return value.toFixed(2);
  };

  return (
    <div className='allcommon'>
      <section className="find-member-sec py-3">
        <div className="container-fluid">
          <h4 className="page-title">Bet List </h4>
          <div className="inner-wrapper">
            <div className="common-container">
              <form className="bet_status p-0 bet-list-live d-flex flex-column w-100 align-items-start" onSubmit={handleSearch}>
                <div className="bet_outer betlist-n w-100">
                  <div className="bet-sec">
                    <label className="form-label">Select Sport:</label>
                    <select
                      name="sport"
                      value={filters.sport}
                      onChange={handleInputChange}
                      aria-label="Default select example"
                      className="small_select form-select"
                    >
                      <option value="all">All Sports</option>
                      <option value="4">Cricket</option>
                      <option value="2">Tennis</option>
                      <option value="1">Soccer</option>
                      <option value="10">Casino</option>
                      <option value="8">Greyhound</option>
                      <option value="7">Horse</option>
                    </select>
                  </div>
                  <div className="bet-sec">
                    <label className="form-label">Select Market Type:</label>
                    <select
                      name="market_type"
                      value={filters.market_type}
                      onChange={handleInputChange}
                      aria-label="Default select example"
                      className="small_select form-select"
                    >
                      <option value="all">All</option>
                      <option value="match_odds">Match Odds</option>
                      <option value="bookmaker">Bookmaker</option>
                      <option value="fancy">Fancy</option>
                      <option value="betfair">Bet Fair</option>
                      <option value="toss">Toss</option>
                      <option value="lottery">Lottery</option>
                    </select>
                  </div>
                  {/* <div className="bet-sec">
                    <label className="form-label">Bet Status:</label>
                    <select
                      name="bet_status"
                      value={filters.bet_status}
                      onChange={handleInputChange}
                      aria-label="Default select example"
                      className="small_select form-select"
                    >
                      <option value="all">All Status</option>
                      <option value="settled">Settled</option>
                      <option value="active">Active</option>
                      <option value="unsettled">Unsettled</option>
                    </select>
                  </div> */}
                  <div className="bet-sec bet-period">
                    <label className="form-label">From</label>
                    <input
                      type="date"
                      name="from_date"
                      value={filters.from_date}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  <div className="bet-sec bet-period">
                    <label className="form-label">To</label>
                    <input
                      type="date"
                      name="to_date"
                      value={filters.to_date}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="history-btn ">
                  <ul className="list-unstyled mb-0">
                    <li>
                      <button
                        type="submit"
                        className="theme_dark_btn btn btn-primary"
                        disabled={loading}
                      >
                        {loading ? 'Loading...' : 'Search'}
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        className="theme_light_btn btn btn-primary"
                        onClick={handleReset}
                        disabled={loading}
                      >
                        Reset
                      </button>
                    </li>
                  </ul>
                </div>
              </form>

              {/* Summary Section */}
              {/* {summary && (
                <div className="summary-section mb-3 p-2" style={{ background: '#f8f9fa', borderRadius: '5px', border: '1px solid #ddd' }}>
                  <div className="row">
                    <div className="col-md-2">
                      <strong>Total Bets:</strong> {summary.totalBets || 0}
                    </div>
                    <div className="col-md-2">
                      <strong>Total Stake:</strong> {summary.totalStake || 0}
                    </div>
                    <div className="col-md-2">
                      <strong>Total Liability:</strong> {(summary.totalLiability || 0).toFixed(2)}
                    </div>
                    <div className="col-md-2">
                      <strong>Back Bets:</strong> {summary.totalBackBets || 0}
                    </div>
                    <div className="col-md-2">
                      <strong>Lay Bets:</strong> {summary.totalLayBets || 0}
                    </div>
                    <div className="col-md-2">
                      <strong>Settled:</strong> {summary.totalSettled || 0}/{summary.totalBets || 0}
                    </div>
                  </div>
                </div>
              )} */}

              <div className="responsive">
                {loading ? (
                  <div className="text-center py-5">Loading bets...</div>
                ) : (
                  <table className="all-bets-dialog-tabel table">
                    <thead>
                      <tr>
                        <th scope="col">PL ID</th>
                        <th scope="col">Bet ID</th>
                        <th scope="col">Bet placed</th>
                        <th scope="col">IP Address</th>
                        <th scope="col">Market</th>
                        <th scope="col">Selection</th>
                        <th scope="col">Bet Type</th>
                        <th scope="col">Type</th>
                        
                        <th scope="col">Odds req.</th>
                        <th scope="col">Stake</th>
                        <th scope="col">Liability</th>
                        <th scope="col">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {betData && betData.length > 0 ? (
                        betData.map((bet, index) => (
                          <tr key={bet._id || bet.bet_id || index} bgcolor={getRowColor(bet)}>
                            <td>{bet.pl_id || bet.user?.username || '-'}</td>
                            <td>{bet.bet_id || bet._id || '-'}</td>
                            <td>{formatDate(bet.bet_placed || bet.created_at)}</td>
                            <td>{bet.ip_address || bet.user?.ip_address || '-'}</td>
                            <td className="text-start">
                              {bet.game_name || bet.market || '-'}
                              <span className="angle_unicode" style={{ background: "transparent" }}>
                                ▸
                              </span>
                              <strong style={{ background: "transparent" }}>
                                {bet.team || '-'}
                              </strong>
                              <span className="angle_unicode" style={{ background: "transparent" }}>
                                ▸
                              </span>
                              {bet.bet_type || '-'}
                            </td>
                            <td>{bet.selection || bet.team || '-'}</td>
                            <td>{bet.bet_type || '-'}</td>
                            <td>{bet.type || '-'}</td>
                            
                            <td>{bet.odd || bet.odds_req || '-'}</td>
                            <td>{bet.stake || '-'}</td>
                            <td>{bet.liability !== undefined ? bet.liability.toFixed(2) : '-'}</td>
                            {/* <td className="text-end">
                              <span
                                className={bet.profit_loss !== undefined && bet.profit_loss < 0 ? 'text-danger' : 'text-success'}
                                style={{ background: "transparent" }}
                              >
                                {bet.profit_loss !== undefined ? formatProfitLoss(bet.profit_loss) : 'N/A'}
                              </span>
                            </td> */}


                            <td className="text-end">
                              <span
                                className={
                                  bet.is_settled === 1 && bet.match_status === "1"
                                    ? "text-success"
                                    : bet.is_settled === 1 && bet.match_status === "2"
                                      ? "text-danger"
                                      : "text-warning"
                                }
                                style={{ background: "transparent" }}
                              >
                                {bet.is_settled === 1 && bet.match_status === "1"
                                  ? "Win"
                                  : bet.is_settled === 1 && bet.match_status === "2"
                                    ? "Loss"
                                    : ""}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="11" className="text-center py-3">
                            No bets found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
              {betData && betData.length > 0 && pagination.totalPages > 1 && (
                <div className="bottom-pagination">
                  <ul role="navigation" aria-label="Pagination">
                    {renderPagination()}
                  </ul>
                </div>
              )}
              {betData && betData.length > 0 && (
                <div className="text-muted mt-2" style={{ fontSize: '14px' }}>
                  Showing {betData.length} of {pagination.total} bets
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Betlist;