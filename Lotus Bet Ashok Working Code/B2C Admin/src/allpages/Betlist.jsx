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
    limit: 50,
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
      
      console.log('API Response:', response);
      
      // Directly handle response - ignore success flag
      if (response) {
        // Try to get data from response
        let dataArray = [];
        
        // Check all possible places where data might be
        if (Array.isArray(response)) {
          dataArray = response;
        } else if (response.data && Array.isArray(response.data)) {
          dataArray = response.data;
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          dataArray = response.data.data;
        } else if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
          // If data is object, try to find array
          for (let key in response.data) {
            if (Array.isArray(response.data[key])) {
              dataArray = response.data[key];
              break;
            }
          }
        }
        
        console.log('Extracted data array:', dataArray);
        setBetData(dataArray);
        
        // Get pagination
        const paginationData = response.pagination || response.data?.pagination || null;
        if (paginationData) {
          setPagination({
            currentPage: paginationData.page || page,
            totalPages: paginationData.totalPages || 1,
            total: paginationData.total || 0
          });
        }
        
        // Get summary
        const summaryData = response.summary || response.data?.summary || null;
        if (summaryData) {
          setSummary(summaryData);
        }
      }
    } catch (error) {
      console.error('Error fetching bet list:', error);
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
                      <option value="all">All Markets</option>
                      <option value="betfair">Bet Fair</option>
                      <option value="bookmaker">Bookmaker</option>
                      <option value="fancy">Fancy</option>
                      <option value="toss">Toss</option>
                      <option value="lottery">Lottery</option>
                    </select>
                  </div>
                  <div className="bet-sec">
                    <label className="form-label">Bet Status:</label>
                    <select
                      name="bet_status"
                      value={filters.bet_status}
                      onChange={handleInputChange}
                      aria-label="Default select example"
                      className="small_select form-select"
                    >
                      <option value="all">All Status</option>
                      <option value="unmatched">Unmatched</option>
                      <option value="matched">Matched</option>
                      <option value="completed">Settled</option>
                      <option value="suspend">Cancelled</option>
                      <option value="voided">Voided</option>
                    </select>
                  </div>
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
                        <th scope="col">Type</th>
                        <th scope="col">Odds req.</th>
                        <th scope="col">Stake</th>
                        <th scope="col">Liability</th>
                        <th scope="col">Profit/Loss</th>
                      </tr>
                    </thead>
                    <tbody>
                      {betData && betData.length > 0 ? (
                        betData.map((bet, index) => (
                          <tr key={bet._id || bet.bet_id || index} bgcolor={getRowColor(bet)}>
                            <td>{bet.pl_id || bet.user?.username || 'N/A'}</td>
                            <td>{bet.bet_id || bet._id || 'N/A'}</td>
                            <td>{formatDate(bet.bet_placed || bet.created_at)}</td>
                            <td>{bet.ip_address || bet.user?.ip_address || 'N/A'}</td>
                            <td className="text-start">
                              {bet.game_name || bet.market || 'N/A'}
                              <span className="angle_unicode" style={{ background: "transparent" }}>
                                ▸
                              </span>
                              <strong style={{ background: "transparent" }}>
                                {bet.team || 'N/A'}
                              </strong>
                              <span className="angle_unicode" style={{ background: "transparent" }}>
                                ▸
                              </span>
                              {bet.bet_type || 'Match Odds'}
                            </td>
                            <td>{bet.selection || bet.team || 'N/A'}</td>
                            <td>{bet.bet_on || bet.type || 'N/A'}</td>
                            <td>{bet.odd || bet.odds_req || 'N/A'}</td>
                            <td>{bet.stake || 'N/A'}</td>
                            <td>{bet.liability !== undefined ? bet.liability.toFixed(2) : 'N/A'}</td>
                            <td className="text-end">
                              <span
                                className={bet.profit_loss !== undefined && bet.profit_loss < 0 ? 'text-danger' : 'text-success'}
                                style={{ background: "transparent" }}
                              >
                                {bet.profit_loss !== undefined ? formatProfitLoss(bet.profit_loss) : 'N/A'}
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