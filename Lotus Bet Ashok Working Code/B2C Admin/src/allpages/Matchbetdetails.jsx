import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  getfancysettled
} from "../Server/api";

function Matchbetdetails() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // URL se params receive kar raha hai
  const marketId = searchParams.get('market_id');
  const eventId = searchParams.get('event_id');
  const adminId = searchParams.get('admin_id') || localStorage.getItem("admin_id");
  const betTypeFromUrl = searchParams.get('bet_type') || 'fancy';  // ✅ bet_type receive
  const role = searchParams.get('role') || localStorage.getItem("role") || 3;

  const [loading, setLoading] = useState(false);
  const [betsData, setBetsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [betType, setBetType] = useState(betTypeFromUrl);  // ✅ betType state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0
  });
  const [summary, setSummary] = useState({
    total_win: 0,
    total_loss: 0,
    total_profit: 0
  });

  // Fetch Fancy Settled Data with market_id in payload
  const fetchFancySettled = async (page = 1) => {
    if (!marketId) {
      console.error("No market_id found");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        fancy_id: marketId,
        bet_type: betType,
        search: searchTerm,
        page: page,
        limit: pagination.limit
      };

      console.log("Fetching Fancy Settled with payload:", payload);

      const response = await getfancysettled(payload);
      console.log("Fancy Settled Response:", response);

      const responseData = response?.data || response || {};

      // Response me 'market' array hai
      const dataList = responseData.market || [];

      setBetsData(dataList);

      // Calculate summary from data
      let totalWin = 0;
      let totalLoss = 0;
      let totalProfit = 0;

      dataList.forEach(item => {
        const betWinAmount = parseFloat(item.bet_win_amount || 0);

        if (betWinAmount > 0) {
          totalWin += betWinAmount;
        } else if (betWinAmount < 0) {
          totalLoss += Math.abs(betWinAmount);
        }
        totalProfit += betWinAmount;
      });

      setSummary({
        total_win: totalWin,
        total_loss: totalLoss,
        total_profit: totalProfit
      });

      const paginationData = responseData.pagination || {};
      setPagination({
        page: paginationData.current_page || page,
        limit: paginationData.limit || 50,
        total: paginationData.total_records || dataList.length,
        totalPages: paginationData.total_pages || 1
      });

    } catch (error) {
      console.error("Error fetching fancy settled:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (marketId) {
      fetchFancySettled();
    }
  }, [marketId]);

  // Handle search
  const handleSearch = () => {
    fetchFancySettled(1);
  };

  // Handle reset
  const handleReset = () => {
    setSearchTerm('');
    fetchFancySettled(1);
  };

  // Handle back
  const handleBack = () => {
    navigate(`/downline-sports-pl?admin_id=${adminId}&role=${role}`);
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const totalPages = pagination.totalPages || Math.ceil(pagination.total / pagination.limit);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      fetchFancySettled(page);
    }
  };

  // ✅ Get type display - lay = Yes, back = No
  const getTypeDisplay = (betOn) => {
    if (betOn === 'lay') return 'Yes';
    if (betOn === 'back') return 'No';
    return betOn || '-';
  };

  // Get status text
  const getStatusText = (item) => {
    if (item.is_settled === 1) return 'Completed';
    if (item.matched_status === 'matched') return 'Matched';
    if (item.match_status === '2') return 'Settled';
    return item.matched_status || 'Pending';
  };

  // Get status color
  const getStatusColor = (item) => {
    if (item.is_settled === 1) return 'text-success';
    if (item.matched_status === 'matched') return 'text-warning';
    if (item.match_status === '2') return 'text-info';
    return 'text-secondary';
  };

  return (
    <div className='allcommon'>
      <section className="main-inner-outer py-4">
        <div className="container-fluid">
          <div className="db-sec">
            <h2 className="common-heading">
              <div className="d-flex align-items-center">
                {/* <button className="btn btn-secondary me-2" onClick={handleBack}>
                  ← Back
                </button> */}
                Show Bet
              </div>
            </h2>
          </div>
          <div className="inner-wrapper">
            {/* Search Section */}
            {/* <div className="row mb-3">
              <div className="col-md-12">
                <div className="d-flex align-items-center">
                  <input
                    placeholder="Search bets..."
                    type="text"
                    className="form-control"
                    style={{ maxWidth: "300px", display: 'inline-block' }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <button className="btn btn-primary ms-2" onClick={handleSearch}>
                    Search
                  </button>
                  <button className="btn btn-secondary ms-2" onClick={handleReset}>
                    Reset
                  </button>
                </div>
              </div>
            </div> */}

            <div className="common-container">
              <div className="account-table batting-table">
                <div className="responsive">
                  {loading ? (
                    <div className="text-center py-4">
                      <div className="spinner-border text-primary"></div>
                      <p className="mt-2">Loading bets...</p>
                    </div>
                  ) : (
                    <>
                      <table className="matchbetdetails-table table">
                        <thead>
                          <tr>
                            <th scope="col">Sports</th>
                            <th scope="col">Match Name</th>
                            <th scope="col">Client</th>
                            <th scope="col">Type</th>
                            <th scope="col">Selection</th>
                            <th scope="col">Odds</th>
                            <th scope="col">Stake</th>
                            <th scope="col">Place Time</th>
                            <th scope="col">IP</th>
                            <th scope="col">PnL</th>
                            <th scope="col">Result</th>
                            <th scope="col">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* Total Row */}
                          {/* <tr style={{ fontWeight: 'bold', backgroundColor: '#f8f9fa' }}>
                           
                            <td>
                              <span className={summary.total_profit < 0 ? 'text-danger' : 'text-success'}>
                                {summary.total_profit?.toFixed(2) || '0.00'}
                              </span>
                            </td>
                            <td></td>
                            <td></td>
                          </tr> */}

                          {/* Data Rows */}
                          {betsData && betsData.length > 0 ? (
                            betsData.map((item, index) => (
                              <tr key={item._id || index} className={item.bet_on === 'back' ? 'back-bg-row' : 'lay-bg-row'}>
                                <td>
                                  {item.game_name || '-'} - sportID  {item.sport_id || '-'}
                                </td>
                                <td>
                                  {item.team ? item.team.split('>')[0]?.trim() || item.market_name || '-' : '-'}
                                </td>
                                <td>{item.username || item.user_id || '-'}</td>
                                {/* ✅ Type column - lay = Yes, back = No */}
                                {/* <td>{getTypeDisplay(item.bet_on)}</td> */}
                                <td>{item.bet_on}</td>
                                <td>{item.team || item.selection || '-'}</td>
                                <td>{item.odd || item.odds || '0.00'}</td>
                                <td>{item.stake || '0.00'}</td>
                                <td>{formatDate(item.created_at || item.date_time)}</td>
                                <td>{item.ip || '-'}</td>
                                <td>
                                  <span className={parseFloat(item.bet_win_amount || 0) < 0 ? 'text-danger' : 'text-success'}>
                                    {item.bet_win_amount?.toFixed(2) || '0.00'}
                                  </span>
                                </td>
                                <td>
                                  {item.is_settled === 1 ? "Yes" : "-"}
                                </td>
                                <td>
                                  <span className={getStatusColor(item)}>
                                    {getStatusText(item)}
                                  </span>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="12" className="text-center" style={{ padding: '20px' }}>
                                No bets found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>

                      {/* Pagination */}
                      {pagination.total > 0 && (
                        <div className="bottom-pagination">
                          <ul role="navigation" aria-label="Pagination">
                            <li className={pagination.page === 1 ? "previous disabled" : "previous"}>
                              <a
                                className=" "
                                tabIndex={pagination.page === 1 ? -1 : 0}
                                role="button"
                                aria-disabled={pagination.page === 1}
                                aria-label="Previous page"
                                rel="prev"
                                onClick={() => handlePageChange(pagination.page - 1)}
                              >
                                &lt;{" "}
                              </a>
                            </li>
                            {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map(page => (
                              <li key={page} className={page === pagination.page ? "p-1" : ""}>
                                <a
                                  rel={page === pagination.page ? "canonical" : ""}
                                  role="button"
                                  className={page === pagination.page ? "pagintion-li" : ""}
                                  tabIndex={-1}
                                  aria-label={page === pagination.page ? "Page " + page + " is your current page" : "Page " + page}
                                  aria-current={page === pagination.page ? "page" : undefined}
                                  onClick={() => handlePageChange(page)}
                                >
                                  {page}
                                </a>
                              </li>
                            ))}
                            <li className={pagination.page === totalPages ? "next disabled" : "next"}>
                              <a
                                className=""
                                tabIndex={pagination.page === totalPages ? -1 : 0}
                                role="button"
                                aria-disabled={pagination.page === totalPages}
                                aria-label="Next page"
                                rel="next"
                                onClick={() => handlePageChange(pagination.page + 1)}
                              >
                                {" "}
                                &gt;
                              </a>
                            </li>
                          </ul>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Matchbetdetails;