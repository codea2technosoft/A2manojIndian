import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  GetAllMyAccountStatement
} from "../Server/api";

function Myaccountstatement() {
  const [searchParams] = useSearchParams();
  const adminId = searchParams.get('admin_id') || localStorage.getItem("admin_id");
  
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 100,
    total: 0,
    totalPages: 0
  });
  const [summary, setSummary] = useState({
    totalAmount: 0,
    totalCredit: 0,
    totalDebit: 0,
    totalDeposits: 0,
    totalWithdraws: 0,
    totalRecords: 0
  });

  const itemsPerPage = 100;

  // Fetch Account Statement
  const fetchAccountStatement = async (page = 1) => {
    if (!adminId) {
      console.error("No admin_id found");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        admin_id: adminId,
        page: page,
        limit: itemsPerPage,
        start_date: null,
        end_date: null,
        type: null,
        tr_status: null
      };

      console.log("Fetching Account Statement with payload:", payload);

      const response = await GetAllMyAccountStatement(payload);
      console.log("Account Statement Response:", response);

      const responseData = response?.data || response || {};
      const dataList = responseData.data || [];

      setTransactions(dataList);

      // Set summary
      if (responseData.summary) {
        setSummary({
          totalAmount: responseData.summary.totalAmount || 0,
          totalCredit: responseData.summary.totalCredit || 0,
          totalDebit: responseData.summary.totalDebit || 0,
          totalDeposits: responseData.summary.totalDeposits || 0,
          totalWithdraws: responseData.summary.totalWithdraws || 0,
          totalRecords: responseData.summary.totalRecords || 0
        });
      }

      // Set pagination
      const paginationData = responseData.pagination || {};
      setPagination({
        page: paginationData.current_page || page,
        limit: paginationData.limit || itemsPerPage,
        total: paginationData.total_records || 0,
        totalPages: paginationData.total_pages || 1
      });

    } catch (error) {
      console.error("Error fetching account statement:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountStatement();
  }, []);

  const totalPages = pagination.totalPages || Math.ceil(pagination.total / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      fetchAccountStatement(page);
    }
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

  return (
    <div className='allcommon'>
      <section className="py-4 main-inner-outer">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <div className="inner-wrapper">
                <h2 className="common-heading">Account Statement</h2>
                
                {/* Summary Cards */}
                {/* <div className="row mb-3">
                  <div className="col-md-2 col-sm-4 col-6">
                    <div className="card p-2 text-center bg-light">
                      <small>Total Amount</small>
                      <strong>{summary.totalAmount.toFixed(2)}</strong>
                    </div>
                  </div>
                  <div className="col-md-2 col-sm-4 col-6">
                    <div className="card p-2 text-center bg-success text-white">
                      <small>Total Credit</small>
                      <strong>{summary.totalCredit.toFixed(2)}</strong>
                    </div>
                  </div>
                  <div className="col-md-2 col-sm-4 col-6">
                    <div className="card p-2 text-center bg-danger text-white">
                      <small>Total Debit</small>
                      <strong>{summary.totalDebit.toFixed(2)}</strong>
                    </div>
                  </div>
                  <div className="col-md-2 col-sm-4 col-6">
                    <div className="card p-2 text-center bg-info text-white">
                      <small>Deposits</small>
                      <strong>{summary.totalDeposits.toFixed(2)}</strong>
                    </div>
                  </div>
                  <div className="col-md-2 col-sm-4 col-6">
                    <div className="card p-2 text-center bg-warning">
                      <small>Withdraws</small>
                      <strong>{summary.totalWithdraws.toFixed(2)}</strong>
                    </div>
                  </div>
                  <div className="col-md-2 col-sm-4 col-6">
                    <div className="card p-2 text-center bg-secondary text-white">
                      <small>Records</small>
                      <strong>{summary.totalRecords}</strong>
                    </div>
                  </div>
                </div> */}

                <section className="account-table w-100">
                  <div className="responsive transaction-history table-color">
                    {loading ? (
                      <div className="text-center py-4">
                        <div className="spinner-border text-primary"></div>
                        <p className="mt-2">Loading transactions...</p>
                      </div>
                    ) : (
                      <>
                        <table className="table">
                          <thead>
                            <tr>
                              <th scope="col">Date/Time</th>
                              <th scope="col">Deposit From Upline</th>
                              <th scope="col">Deposit to Downline</th>
                              <th scope="col">WihtDraw By Upline </th>
                              <th scope="col">WithDraw From Downline </th>
                              <th scope="col">Balance</th>
                              <th scope="col">Remark</th>
                              <th scope="col">From/To</th>
                            </tr>
                          </thead>
                          <tbody>
                            {transactions && transactions.length > 0 ? (
                              transactions.map((transaction, index) => (
                                <tr key={transaction._id || index}>
                                  <td>{formatDate(transaction.created_at)}</td>
                                  <td>
                                    {transaction.tr_type === 'credit' && transaction.type === 'deposit' ? (
                                      <span className="text-success">{transaction.amount ? transaction.amount.toFixed(2) : '0.00'}</span>
                                    ) : "-"}
                                  </td>
                                  <td>-</td>
                                  <td>
                                    {transaction.tr_type === 'debit' && transaction.type === 'withdraw' ? (
                                      <span className="text-danger">{transaction.amount ? transaction.amount.toFixed(2) : '0.00'}</span>
                                    ) : "-"}
                                  </td>
                                  <td>-</td>
                                  <td>{transaction.wallet_amount ? transaction.wallet_amount.toFixed(2) : '0.00'}</td>
                                  <td>
                                    {transaction.remark || '-'}
                                   
                                  </td>
                                 <td>
                                    Lotus77Vip -&gt; {transaction.user_name || transaction.user_details?.username || '-'}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="8" className="text-center py-4">
                                  No transactions found
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>

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
                              
                              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
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
                </section>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Myaccountstatement;