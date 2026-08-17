import React, { useState, useEffect } from 'react';
import { getAgentsBankingAllLogs } from "../Server/api";

const Agentbankingtransctionhistory = () => {
  // State for logs data
  const [logsData, setLogsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 100,
    totalPages: 0,
    totalRecords: 0,
    hasNext: false,
    hasPrev: false
  });

  // Get user data from localStorage
  const getUserData = () => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        return JSON.parse(userData);
      }
      return null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  };

  // Fetch logs data
  const fetchLogsData = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const userData = getUserData();
      const payload = {
        role: userData?.role || 1,
        admin_id: userData?.admin_id || 'admin',
        page: page,
        limit: 100
      };

      console.log('Fetching logs with payload:', payload);

      const response = await getAgentsBankingAllLogs(payload);
      console.log('Logs API Response:', response);

      // Check response structure
      const apiData = response?.data;

      if (apiData && apiData.success === true) {
        // Set logs data
        if (apiData.data && Array.isArray(apiData.data)) {
          setLogsData(apiData.data);
        } else {
          setLogsData([]);
        }

        // Set pagination
        if (apiData.pagination) {
          setPagination({
            page: apiData.pagination.current_page || apiData.pagination.page || 1,
            limit: apiData.pagination.limit || 100,
            totalPages: apiData.pagination.total_pages || apiData.pagination.totalPages || 0,
            totalRecords: apiData.pagination.total_records || apiData.pagination.totalRecords || 0,
            hasNext: apiData.pagination.current_page < apiData.pagination.total_pages,
            hasPrev: apiData.pagination.current_page > 1
          });
        }
      } else {
        setLogsData([]);
        console.log('No logs data available');
      }
    } catch (err) {
      console.error('Error fetching logs data:', err);
      setError('Failed to load data');
      setLogsData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchLogsData();
  }, []);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchLogsData(newPage);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
    } catch (e) {
      return dateString;
    }
  };

  // Format amount
  const formatAmount = (amount) => {
    if (amount === undefined || amount === null) return '0.00';
    return parseFloat(amount).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Get balance based on transaction type
  const getBalance = (log) => {
    // For deposit: after_balance_to shows the balance after transaction
    // For withdraw: after_balance_from shows the balance after transaction
    if (log.type === 'deposit') {
      return log.after_balance_to || log.balance || 0;
    } else if (log.type === 'withdraw') {
      return log.after_balance_from || log.balance || 0;
    }
    return log.balance || log.after_balance_to || log.after_balance_from || 0;
  };

  // Get From/To display
  const getFromTo = (log) => {
    if (log.type === 'deposit') {
      return log.from_username || log.from_admin_id || '-';
    } else if (log.type === 'withdraw') {
      return log.to_username || log.to_admin_id || '-';
    }
    return '-';
  };

  // Loading state
  if (loading) {
    return (
      <main className="allcommon">
        <section className="py-4 main-inner-outer">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12 col-md-12">
                <div className="inner-wrapper">
                  <h2 className="common-heading">Account Statement</h2>
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="allcommon">
      <section className="py-4 main-inner-outer">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <div className="inner-wrapper">
                <h2 className="common-heading">Account Statement</h2>
                <section className="account-table">
                  <div className="responsive transaction-history">
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col">Date/Time</th>
                          <th scope="col">Deposit</th>
                          <th scope="col">Withdraw</th>
                          <th scope="col">Balance</th>
                          <th scope="col">Remark</th>
                          <th scope="col">From/To</th>
                        </tr>
                      </thead>
                      <tbody>
                        {logsData && logsData.length > 0 ? (
                          logsData.map((log, index) => (
                            <tr key={log._id || index}>
                              <td>{formatDate(log.created_at)}</td>
                              <td>
                                {log.type === 'deposit' ? formatAmount(log.amount) : '-'}
                              </td>
                              <td>
                                {log.type === 'withdraw' ? formatAmount(log.amount) : '-'}
                              </td>
                              <td>{formatAmount(getBalance(log))}</td>
                              <td>{log.remark || '-'}</td>
                              <td>{getFromTo(log)}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="text-center py-4">
                              No transactions found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>

                    {/* Pagination */}
                    {pagination.totalRecords > 0 && (
                      <div className="bottom-pagination">
                        <ul role="navigation" aria-label="Pagination">
                          <li className={`previous ${pagination.hasPrev ? '' : 'disabled'}`}>
                            <a
                              className=""
                              tabIndex={-1}
                              role="button"
                              aria-disabled={!pagination.hasPrev}
                              aria-label="Previous page"
                              rel="prev"
                              onClick={(e) => {
                                e.preventDefault();
                                if (pagination.hasPrev) {
                                  handlePageChange(pagination.page - 1);
                                }
                              }}
                            >
                              &lt;
                            </a>
                          </li>
                          {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                            let pageNum;
                            if (pagination.totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (pagination.page <= 3) {
                              pageNum = i + 1;
                            } else if (pagination.page >= pagination.totalPages - 2) {
                              pageNum = pagination.totalPages - 4 + i;
                            } else {
                              pageNum = pagination.page - 2 + i;
                            }
                            return (
                              <li key={pageNum} className={pagination.page === pageNum ? 'p-0' : ''}>
                                <a
                                  rel="canonical"
                                  role="button"
                                  className={pagination.page === pageNum ? 'pagintion-li' : ''}
                                  tabIndex={-1}
                                  aria-label={`Page ${pageNum}`}
                                  aria-current={pagination.page === pageNum ? 'page' : undefined}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handlePageChange(pageNum);
                                  }}
                                  style={{ cursor: 'pointer' }}
                                >
                                  {pageNum}
                                </a>
                              </li>
                            );
                          })}
                          <li className={`next ${pagination.hasNext ? '' : 'disabled'}`}>
                            <a
                              className=""
                              tabIndex={0}
                              role="button"
                              aria-disabled={!pagination.hasNext}
                              aria-label="Next page"
                              rel="next"
                              onClick={(e) => {
                                e.preventDefault();
                                if (pagination.hasNext) {
                                  handlePageChange(pagination.page + 1);
                                }
                              }}
                            >
                              &gt;
                            </a>
                          </li>
                        </ul>
                        {pagination.totalRecords > 0 && (
                          <span className="ms-3 text-muted" style={{ fontSize: '14px' }}>
                            Total: {pagination.totalRecords} records
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Agentbankingtransctionhistory;