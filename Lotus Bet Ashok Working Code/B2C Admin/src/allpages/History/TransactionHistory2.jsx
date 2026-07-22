import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from './Layout';
import Swal from 'sweetalert2';

import {
  getAllStatementLadgerData2,
  getUserProfileData
} from "../../Server/api";

const TransactionHistory2 = () => {
  const [searchParams] = useSearchParams();
  const adminId = searchParams.get('admin_id') || localStorage.getItem("admin_id");
  const role = searchParams.get('role') || localStorage.getItem("role") || 3;

  const [currentPage, setCurrentPage] = useState(1);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 0
  });
  const [userId, setUserId] = useState(null);
  const [profileUsername, setProfileUsername] = useState('');

  const itemsPerPage = 15;

  // Fetch user profile to get _id (Sirf User ke liye)
  const fetchUserProfile = async () => {
    if (!adminId) {
      console.error("No admin_id found");
      return;
    }

    try {
      const payload = {
        admin_id: adminId,
        role: parseInt(role) || 3
      };

      console.log("Fetching user profile with payload:", payload);

      const response = await getUserProfileData(payload);
      console.log("User Profile Response:", response);
      const profileData = response?.data?.data?.admin_profile || response?.data?.admin_profile || response?.data || {};

      const userIdFromProfile = profileData._id || profileData.id;
      console.log("User ID from profile:", userIdFromProfile);
      setUserId(userIdFromProfile);

      const userName = profileData.username || profileData.name || adminId;
      setProfileUsername(userName);
      console.log("Profile Username for From/To:", userName);

      if (userIdFromProfile) {
        fetchTransactions(currentPage, userIdFromProfile);
      }

    } catch (error) {
      console.error("Error fetching profile:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to fetch profile data",
        confirmButtonText: "OK",
      });
    }
  };

  // Fetch transactions from API
  const fetchTransactions = async (page = 1, userIdParam = null) => {
    const userIdToUse = userIdParam || userId || adminId;

    if (!adminId) {
      console.error("No admin_id found");
      return;
    }

    if (!userIdToUse) {
      console.error("No user_id found");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        admin_id: adminId,
        user_id: userIdToUse,
        type: "all",
        page: page,
        limit: itemsPerPage,
        start_date: null,
        end_date: null
      };

      console.log("Fetching transactions with payload:", payload);

      const response = await getAllStatementLadgerData2(payload);
      console.log("Transaction Response:", response);

      const responseData = response?.data || response || {};
      const transactionList = responseData.data || responseData.transactions || [];

      setTransactions(transactionList);

      const paginationData = responseData.pagination || {};
      setPagination({
        page: paginationData.current_page || page,
        limit: paginationData.limit || itemsPerPage,
        total: paginationData.total_records || 0,
        totalPages: paginationData.total_pages || 1
      });

    } catch (error) {
      console.error("Error fetching transactions:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to fetch transaction history",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchTransactions(currentPage, userId);
    }
  }, [currentPage, userId]);

  const totalPages = pagination.totalPages || Math.ceil(pagination.total / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
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

  // Get From/To label with username
  const getFromToLabel = () => {
    return `User -> ${profileUsername || adminId}`;
  };

  return (
    <Layout activeItem="transaction-history-2">
      <div className="right_side">
        <div className="inner-wrapper">
          <h2 className="common-heading">Transaction History</h2>
          <section className="account-table w-100">
            <div className="responsive transaction-history">
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
                        <th scope="col">Withdraw By Upline</th>
                        <th scope="col">Withdraw From Downline</th>
                        <th scope="col">Balance</th>
                        <th scope="col">Remark</th>
                        <th scope="col">From/To</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions && transactions.length > 0 ? (
                        transactions.map((transaction, index) => (
                          <tr key={transaction._id || index}>
                            <td>{formatDate(transaction.date)}</td>
                            <td>
                              {transaction.credit && transaction.credit > 0 && transaction.type !== 'withdraw' ? (
                                <span className="text-success">{transaction.credit.toFixed(2)}</span>
                              ) : "-"}
                            </td>
                            <td>-</td>
                            <td>
                              {transaction.debit && transaction.debit > 0 && transaction.type === 'withdraw' ? (
                                <span className="text-danger">{transaction.debit.toFixed(2)}</span>
                              ) : "-"}
                            </td>
                            <td>-</td>
                            <td>{transaction.balance ? transaction.balance.toFixed(2) : '0.00'}</td>
                            <td>
                              {transaction.description || '-'}
                              
                            </td>
                            <td>{getFromToLabel()}</td>
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
                        <li className={currentPage === 1 ? "previous disabled" : "previous"}>
                          <a
                            className={currentPage === 1 ? "" : ""}
                            tabIndex={currentPage === 1 ? "-1" : "0"}
                            role="button"
                            aria-disabled={currentPage === 1}
                            aria-label="Previous page"
                            rel="prev"
                            onClick={() => handlePageChange(currentPage - 1)}
                          >
                            &lt;
                          </a>
                        </li>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                          <li key={page} className={page === currentPage ? "p-1" : ""}>
                            <a
                              rel={page === currentPage ? "canonical" : ""}
                              role="button"
                              className={page === currentPage ? "pagintion-li" : ""}
                              tabIndex="-1"
                              aria-label={`Page ${page}${page === currentPage ? ' is your current page' : ''}`}
                              aria-current={page === currentPage ? "page" : undefined}
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </a>
                          </li>
                        ))}

                        <li className={currentPage === totalPages ? "next disabled" : "next"}>
                          <a
                            className=""
                            tabIndex={currentPage === totalPages ? "-1" : "0"}
                            role="button"
                            aria-disabled={currentPage === totalPages}
                            aria-label="Next page"
                            rel="next"
                            onClick={() => handlePageChange(currentPage + 1)}
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
    </Layout>
  );
};

export default TransactionHistory2;