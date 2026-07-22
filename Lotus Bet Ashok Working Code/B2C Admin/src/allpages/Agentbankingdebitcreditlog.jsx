import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAgentsWiseBankingLogs } from "../Server/api";

const Agentbankingtransctionhistory = () => {
  const [searchParams] = useSearchParams();
  const agentId = searchParams.get('agentId');
  
  // State for logs data
  const [logsData, setLogsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 0,
    total_records: 0,
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
    if (!agentId) {
      console.log('Agent ID not found');
      return;
    }

    setLoading(true);
    try {
      const userData = getUserData();
      const payload = {
        admin_id: agentId,
        page: page,
        limit: 100
      };

      console.log('Fetching agent logs with payload:', payload);

      const response = await getAgentsWiseBankingLogs(payload);
      console.log('Agent Logs API Response:', response);

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
            current_page: apiData.pagination.current_page || apiData.pagination.page || 1,
            total_pages: apiData.pagination.total_pages || apiData.pagination.totalPages || 0,
            total_records: apiData.pagination.total_records || apiData.pagination.totalRecords || 0,
            hasNext: apiData.pagination.current_page < apiData.pagination.total_pages,
            hasPrev: apiData.pagination.current_page > 1
          });
        }
      } else {
        setLogsData([]);
      }
    } catch (err) {
      console.error('Error fetching agent logs data:', err);
      setLogsData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount or when agentId changes
  useEffect(() => {
    if (agentId) {
      fetchLogsData();
    }
  }, [agentId]);

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.total_pages) {
      fetchLogsData(page);
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

  // If no agentId
  if (!agentId) {
    return (
      <main className="allcommon">
        <section className="py-4 main-inner-outer">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12 col-md-12">
                <div className="inner-wrapper">
                  <h2 className="common-heading">Account Statement</h2>
                  <div className="alert alert-danger" role="alert">
                    Agent ID not found
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const total = pagination.total_pages;
    const current = pagination.current_page;
    const pages = [];
    
    if (total <= 5) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else if (current <= 3) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i);
      }
    } else if (current >= total - 2) {
      for (let i = total - 4; i <= total; i++) {
        pages.push(i);
      }
    } else {
      for (let i = current - 2; i <= current + 2; i++) {
        pages.push(i);
      }
    }
    return pages;
  };

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
                    {pagination.total_records > 0 && (
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
                                  handlePageChange(pagination.current_page - 1);
                                }
                              }}
                            >
                              &lt;
                            </a>
                          </li>
                          {getPageNumbers().map((pageNum) => (
                            <li key={pageNum} className={pagination.current_page === pageNum ? 'p-0' : ''}>
                              <a
                                rel="canonical"
                                role="button"
                                className={pagination.current_page === pageNum ? 'pagintion-li' : ''}
                                tabIndex={-1}
                                aria-label={`Page ${pageNum}`}
                                aria-current={pagination.current_page === pageNum ? 'page' : undefined}
                                onClick={(e) => {
                                  e.preventDefault();
                                  handlePageChange(pageNum);
                                }}
                                style={{ cursor: 'pointer' }}
                              >
                                {pageNum}
                              </a>
                            </li>
                          ))}
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
                                  handlePageChange(pagination.current_page + 1);
                                }
                              }}
                            >
                              &gt;
                            </a>
                          </li>
                        </ul>
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