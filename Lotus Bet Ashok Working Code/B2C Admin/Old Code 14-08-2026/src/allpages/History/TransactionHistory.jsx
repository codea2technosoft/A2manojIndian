// // import React, { useState, useEffect } from 'react';
// // import { useSearchParams } from 'react-router-dom';
// // import Layout from './Layout';
// // import Swal from 'sweetalert2';

// // import {
// //   getAllStatementLadgerData,
// //   getAdminProfile,
// //   getUserProfileData
// // } from "../../Server/api";

// // const TransactionHistory = () => {
// //   const [searchParams] = useSearchParams();
// //   const adminId = searchParams.get('admin_id');
// //   const role = searchParams.get('role');

// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [transactions, setTransactions] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [pagination, setPagination] = useState({
// //     page: 1,
// //     limit: 15,
// //     total: 0,
// //     totalPages: 0
// //   });
// //   const [userId, setUserId] = useState(null);
// //   const [profileUsername, setProfileUsername] = useState('');

// //   const itemsPerPage = 15;

// //   // Fetch user/agent profile to get _id
// //   const fetchUserProfile = async () => {
// //     if (!adminId) {
// //       console.error("No admin_id found");
// //       return;
// //     }

// //     try {
// //       const payload = {
// //         admin_id: adminId,
// //         role: parseInt(role)
// //       };

// //       console.log("Fetching profile with payload:", payload);

// //       let response;
// //       let profileData;

// //       // Check if role is 3 (user) or 2 (agent)
// //       if (parseInt(role) === 3) {
// //         // User profile
// //         console.log("Fetching user profile data");
// //         response = await getUserProfileData(payload);
// //         console.log("User Profile Response:", response);
// //         profileData = response?.data?.data?.admin_profile || response?.data?.admin_profile || response?.data || {};
// //       } else {
// //         // Agent profile (role 2 or any other)
// //         console.log("Fetching admin/agent profile data");
// //         response = await getAdminProfile(payload);
// //         console.log("Admin Profile Response:", response);
// //         profileData = response?.data?.data?.admin_profile || response?.data?.admin_profile || response?.data || {};
// //       }

// //       // Get _id from profile data
// //       const userIdFromProfile = profileData._id || profileData.id;
// //       console.log("User ID from profile:", userIdFromProfile);
// //       setUserId(userIdFromProfile);

// //       // Get username from profile data for From/To column
// //       const userName = profileData.username || profileData.name || adminId;
// //       setProfileUsername(userName);
// //       console.log("Profile Username for From/To:", userName);

// //       // If we have userId, fetch transactions
// //       if (userIdFromProfile) {
// //         fetchTransactions(currentPage, userIdFromProfile);
// //       }

// //     } catch (error) {
// //       console.error("Error fetching profile:", error);
// //       Swal.fire({
// //         icon: "error",
// //         title: "Error",
// //         text: error.response?.data?.message || "Failed to fetch profile data",
// //         confirmButtonText: "OK",
// //       });
// //     }
// //   };

// //   // Fetch transactions from API
// //   const fetchTransactions = async (page = 1, userIdParam = null) => {
// //     const userIdToUse = userIdParam || userId || adminId;

// //     if (!adminId) {
// //       console.error("No admin_id found");
// //       return;
// //     }

// //     if (!userIdToUse) {
// //       console.error("No user_id found");
// //       return;
// //     }

// //     setLoading(true);
// //     try {
// //       const payload = {
// //         admin_id: adminId,
// //         user_id: userIdToUse,
// //         page: page,
// //         limit: itemsPerPage,
// //         start_date: null,
// //         end_date: null
// //       };

// //       console.log("Fetching transactions with payload:", payload);

// //       const response = await getAllStatementLadgerData(payload);
// //       console.log("Transaction Response:", response);

// //       // Handle response - your API returns data directly in data array
// //       const responseData = response?.data || response || {};
// //       const transactionList = responseData.data || responseData.transactions || [];

// //       setTransactions(transactionList);

// //       // Update pagination from your response structure
// //       const paginationData = responseData.pagination || {};
// //       setPagination({
// //         page: paginationData.current_page || page,
// //         limit: paginationData.limit || itemsPerPage,
// //         total: paginationData.total_records || 0,
// //         totalPages: paginationData.total_pages || 1
// //       });

// //     } catch (error) {
// //       console.error("Error fetching transactions:", error);
// //       Swal.fire({
// //         icon: "error",
// //         title: "Error",
// //         text: error.response?.data?.message || "Failed to fetch transaction history",
// //         confirmButtonText: "OK",
// //       });
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchUserProfile();
// //   }, []);

// //   useEffect(() => {
// //     if (userId) {
// //       fetchTransactions(currentPage, userId);
// //     }
// //   }, [currentPage, userId]);

// //   const totalPages = pagination.totalPages || Math.ceil(pagination.total / itemsPerPage);

// //   const handlePageChange = (page) => {
// //     if (page >= 1 && page <= totalPages) {
// //       setCurrentPage(page);
// //     }
// //   };

// //   // Format date function
// //   const formatDate = (dateString) => {
// //     if (!dateString) return '-';
// //     const date = new Date(dateString);
// //     return date.toLocaleString('en-US', {
// //       month: '2-digit',
// //       day: '2-digit',
// //       year: 'numeric',
// //       hour: '2-digit',
// //       minute: '2-digit',
// //       second: '2-digit',
// //       hour12: true
// //     });
// //   };

// //   // Get From/To label with username
// //   const getFromToLabel = () => {
// //     if (parseInt(role) === 3) {
// //       return `User -> ${profileUsername || adminId}`;
// //     } else {
// //       return `Agent -> ${profileUsername || adminId}`;
// //     }
// //   };

// //   return (
// //     <Layout activeItem="transaction-history">
// //       <div className="right_side">
// //         <div className="inner-wrapper">
// //           <h2 className="common-heading">Transaction History</h2>
// //           <section className="account-table w-100">
// //             <div className="responsive transaction-history">
// //               {loading ? (
// //                 <div className="text-center py-4">
// //                   <div className="spinner-border text-primary"></div>
// //                   <p className="mt-2">Loading transactions...</p>
// //                 </div>
// //               ) : (
// //                 <>
// //                   <table className="table">
// //                     <thead>
// //                       <tr>
// //                         <th scope="col">Date/Time</th>
// //                         <th scope="col">Deposit From Upline</th>
// //                         <th scope="col">Deposit to Downline</th>
// //                         <th scope="col">Withdraw By Upline</th>
// //                         <th scope="col">Withdraw From Downline</th>
// //                         <th scope="col">Balance</th>
// //                         <th scope="col">Remark</th>
// //                         <th scope="col">From/To</th>
// //                       </tr>
// //                     </thead>
// //                     <tbody>
// //                       {transactions && transactions.length > 0 ? (
// //                         transactions.map((transaction, index) => (
// //                           <tr key={transaction._id || index}>
// //                             <td>{formatDate(transaction.created_at || transaction.date)}</td>
// //                             <td>
// //                               {transaction.tr_type === 'credit' && transaction.type !== 'withdraw' ? (
// //                                 <span className="text-success">{transaction.amount ? transaction.amount.toFixed(2) : '0.00'}</span>
// //                               ) : "-"}
// //                             </td>
// //                             <td>-</td>
// //                             <td>
// //                               {transaction.tr_type === 'debit' && transaction.type === 'withdraw' ? (
// //                                 <span className="text-danger">{transaction.amount ? transaction.amount.toFixed(2) : '0.00'}</span>
// //                               ) : "-"}
// //                             </td>
// //                             <td>-</td>
// //                             <td>{transaction.wallet_amount ? transaction.wallet_amount.toFixed(2) : '0.00'}</td>
// //                             <td>
// //                               {transaction.remark || transaction.description || '-'}
// //                               {/* {transaction.tr_status && (
// //                                 <span className={`ms-1 badge ${
// //                                   transaction.tr_status === 'approved' ? 'bg-success' : 
// //                                   transaction.tr_status === 'rejected' ? 'bg-danger' : 
// //                                   'bg-warning'
// //                                 }`}>
// //                                   {transaction.tr_status}
// //                                 </span>
// //                               )} */}
// //                             </td>
// //                             <td>{getFromToLabel()}</td>
// //                           </tr>
// //                         ))
// //                       ) : (
// //                         <tr>
// //                           <td colSpan="8" className="text-center py-4">
// //                             No transactions found
// //                           </td>
// //                         </tr>
// //                       )}
// //                     </tbody>
// //                   </table>

// //                   {pagination.total > 0 && (
// //                     <div className="bottom-pagination">
// //                       <ul role="navigation" aria-label="Pagination">
// //                         <li className={currentPage === 1 ? "previous disabled" : "previous"}>
// //                           <a
// //                             className={currentPage === 1 ? "" : ""}
// //                             tabIndex={currentPage === 1 ? "-1" : "0"}
// //                             role="button"
// //                             aria-disabled={currentPage === 1}
// //                             aria-label="Previous page"
// //                             rel="prev"
// //                             onClick={() => handlePageChange(currentPage - 1)}
// //                           >
// //                             &lt;
// //                           </a>
// //                         </li>

// //                         {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
// //                           <li key={page} className={page === currentPage ? "p-1" : ""}>
// //                             <a
// //                               rel={page === currentPage ? "canonical" : ""}
// //                               role="button"
// //                               className={page === currentPage ? "pagintion-li" : ""}
// //                               tabIndex="-1"
// //                               aria-label={`Page ${page}${page === currentPage ? ' is your current page' : ''}`}
// //                               aria-current={page === currentPage ? "page" : undefined}
// //                               onClick={() => handlePageChange(page)}
// //                             >
// //                               {page}
// //                             </a>
// //                           </li>
// //                         ))}

// //                         <li className={currentPage === totalPages ? "next disabled" : "next"}>
// //                           <a
// //                             className=""
// //                             tabIndex={currentPage === totalPages ? "-1" : "0"}
// //                             role="button"
// //                             aria-disabled={currentPage === totalPages}
// //                             aria-label="Next page"
// //                             rel="next"
// //                             onClick={() => handlePageChange(currentPage + 1)}
// //                           >
// //                             &gt;
// //                           </a>
// //                         </li>
// //                       </ul>
// //                     </div>
// //                   )}
// //                 </>
// //               )}
// //             </div>
// //           </section>
// //         </div>
// //       </div>
// //     </Layout>
// //   );
// // };

// // export default TransactionHistory;

// import React, { useState, useEffect } from 'react';
// import { useSearchParams } from 'react-router-dom';
// import Layout from './Layout';
// import Swal from 'sweetalert2';

// import {
//   getAllStatementLadgerData,
//   getAdminProfile,
//   getUserProfileData
// } from "../../Server/api";

// const TransactionHistory = () => {
//   const [searchParams] = useSearchParams();
//   const adminId = searchParams.get('admin_id');
//   const role = searchParams.get('role');

//   const [currentPage, setCurrentPage] = useState(1);
//   const [transactions, setTransactions] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 15,
//     total: 0,
//     totalPages: 0
//   });
//   const [userId, setUserId] = useState(null);
//   const [profileUsername, setProfileUsername] = useState('');

//   const itemsPerPage = 15;

//   // Fetch user/agent profile to get _id
//   const fetchUserProfile = async () => {
//     if (!adminId) {
//       console.error("No admin_id found");
//       return;
//     }

//     try {
//       const payload = {
//         admin_id: adminId,
//         role: parseInt(role)
//       };

//       console.log("Fetching profile with payload:", payload);

//       let response;
//       let profileData;

//       // Check if role is 3 (user) or 2 (agent)
//       if (parseInt(role) === 3) {
//         // 🔥 USER PROFILE (Role 3) - FIXED
//         console.log("Fetching user profile data");
//         response = await getUserProfileData(payload);
//         console.log("User Profile Response:", response);
        
//         // 🔥 FIX: Response mein "user_profile" hai
//         profileData = response?.data?.data?.user_profile || 
//                      response?.data?.user_profile || 
//                      response?.data?.data || 
//                      response?.data || 
//                      response || {};
                     
//         console.log("Extracted profileData:", profileData);
//       } else {
//         // ✅ AGENT PROFILE (Role 2) - COMPLETELY UNTOUCHED
//         console.log("Fetching admin/agent profile data");
//         response = await getAdminProfile(payload);
//         console.log("Admin Profile Response:", response);
//         profileData = response?.data?.data?.admin_profile || 
//                      response?.data?.admin_profile || 
//                      response?.data || 
//                      response || {};
//       }

//       // 🔥 Get _id from profile data
//       const userIdFromProfile = profileData._id || profileData.id;
//       console.log("User ID from profile:", userIdFromProfile);
//       setUserId(userIdFromProfile);

//       // Get username from profile data for From/To column
//       const userName = profileData.username || profileData.name || adminId;
//       setProfileUsername(userName);
//       console.log("Profile Username for From/To:", userName);

//       // If we have userId, fetch transactions
//       if (userIdFromProfile) {
//         fetchTransactions(currentPage, userIdFromProfile);
//       }

//     } catch (error) {
//       console.error("Error fetching profile:", error);
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: error.response?.data?.message || "Failed to fetch profile data",
//         confirmButtonText: "OK",
//       });
//     }
//   };

//   // ✅ Fetch transactions from API - COMPLETELY UNTOUCHED
//   const fetchTransactions = async (page = 1, userIdParam = null) => {
//     const userIdToUse = userIdParam || userId || adminId;

//     if (!adminId) {
//       console.error("No admin_id found");
//       return;
//     }

//     if (!userIdToUse) {
//       console.error("No user_id found");
//       return;
//     }

//     setLoading(true);
//     try {
//       const payload = {
//         admin_id: adminId,
//         user_id: userIdToUse,
//         page: page,
//         limit: itemsPerPage,
//         start_date: null,
//         end_date: null
//       };

//       console.log("Fetching transactions with payload:", payload);

//       const response = await getAllStatementLadgerData(payload);
//       console.log("Transaction Response:", response);

//       // Handle response - your API returns data directly in data array
//       const responseData = response?.data || response || {};
//       const transactionList = responseData.data || responseData.transactions || [];

//       setTransactions(transactionList);

//       // Update pagination from your response structure
//       const paginationData = responseData.pagination || {};
//       setPagination({
//         page: paginationData.current_page || page,
//         limit: paginationData.limit || itemsPerPage,
//         total: paginationData.total_records || 0,
//         totalPages: paginationData.total_pages || 1
//       });

//     } catch (error) {
//       console.error("Error fetching transactions:", error);
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: error.response?.data?.message || "Failed to fetch transaction history",
//         confirmButtonText: "OK",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUserProfile();
//   }, []);

//   useEffect(() => {
//     if (userId) {
//       fetchTransactions(currentPage, userId);
//     }
//   }, [currentPage, userId]);

//   const totalPages = pagination.totalPages || Math.ceil(pagination.total / itemsPerPage);

//   const handlePageChange = (page) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   // Format date function
//   const formatDate = (dateString) => {
//     if (!dateString) return '-';
//     const date = new Date(dateString);
//     return date.toLocaleString('en-US', {
//       month: '2-digit',
//       day: '2-digit',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit',
//       hour12: true
//     });
//   };

//   // Get From/To label with username
//   const getFromToLabel = () => {
//     if (parseInt(role) === 3) {
//       return `User -> ${profileUsername || adminId}`;
//     } else {
//       return `Agent -> ${profileUsername || adminId}`;
//     }
//   };

//   return (
//     <Layout activeItem="transaction-history">
//       <div className="right_side">
//         <div className="inner-wrapper">
//           <h2 className="common-heading">Transaction History</h2>
//           <section className="account-table w-100">
//             <div className="responsive transaction-history">
//               {loading ? (
//                 <div className="text-center py-4">
//                   <div className="spinner-border text-primary"></div>
//                   <p className="mt-2">Loading transactions...</p>
//                 </div>
//               ) : (
//                 <>
//                   <table className="table">
//                     <thead>
//                       <tr>
//                         <th scope="col">Date/Time</th>
//                         <th scope="col">Deposit From Upline</th>
//                         <th scope="col">Deposit to Downline</th>
//                         <th scope="col">Withdraw By Upline</th>
//                         <th scope="col">Withdraw From Downline</th>
//                         <th scope="col">Balance</th>
//                         <th scope="col">Remark</th>
//                         <th scope="col">From/To</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {transactions && transactions.length > 0 ? (
//                         transactions.map((transaction, index) => (
//                           <tr key={transaction._id || index}>
//                             <td>{formatDate(transaction.created_at || transaction.date)}</td>
//                             <td>
//                               {transaction.tr_type === 'credit' && transaction.type !== 'withdraw' ? (
//                                 <span className="text-success">{transaction.amount ? transaction.amount.toFixed(2) : '0.00'}</span>
//                               ) : "-"}
//                             </td>
//                             <td>-</td>
//                             <td>
//                               {transaction.tr_type === 'debit' && transaction.type === 'withdraw' ? (
//                                 <span className="text-danger">{transaction.amount ? transaction.amount.toFixed(2) : '0.00'}</span>
//                               ) : "-"}
//                             </td>
//                             <td>-</td>
//                             <td>{transaction.wallet_amount ? transaction.wallet_amount.toFixed(2) : '0.00'}</td>
//                             <td>
//                               {transaction.remark || transaction.description || '-'}
//                             </td>
//                             <td>{getFromToLabel()}</td>
//                           </tr>
//                         ))
//                       ) : (
//                         <tr>
//                           <td colSpan="8" className="text-center py-4">
//                             No transactions found
//                           </td>
//                         </tr>
//                       )}
//                     </tbody>
//                   </table>

//                   {pagination.total > 0 && (
//                     <div className="bottom-pagination">
//                       <ul role="navigation" aria-label="Pagination">
//                         <li className={currentPage === 1 ? "previous disabled" : "previous"}>
//                           <a
//                             className={currentPage === 1 ? "" : ""}
//                             tabIndex={currentPage === 1 ? "-1" : "0"}
//                             role="button"
//                             aria-disabled={currentPage === 1}
//                             aria-label="Previous page"
//                             rel="prev"
//                             onClick={() => handlePageChange(currentPage - 1)}
//                           >
//                             &lt;
//                           </a>
//                         </li>

//                         {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
//                           <li key={page} className={page === currentPage ? "p-1" : ""}>
//                             <a
//                               rel={page === currentPage ? "canonical" : ""}
//                               role="button"
//                               className={page === currentPage ? "pagintion-li" : ""}
//                               tabIndex="-1"
//                               aria-label={`Page ${page}${page === currentPage ? ' is your current page' : ''}`}
//                               aria-current={page === currentPage ? "page" : undefined}
//                               onClick={() => handlePageChange(page)}
//                             >
//                               {page}
//                             </a>
//                           </li>
//                         ))}

//                         <li className={currentPage === totalPages ? "next disabled" : "next"}>
//                           <a
//                             className=""
//                             tabIndex={currentPage === totalPages ? "-1" : "0"}
//                             role="button"
//                             aria-disabled={currentPage === totalPages}
//                             aria-label="Next page"
//                             rel="next"
//                             onClick={() => handlePageChange(currentPage + 1)}
//                           >
//                             &gt;
//                           </a>
//                         </li>
//                       </ul>
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>
//           </section>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default TransactionHistory;

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from './Layout';
import Swal from 'sweetalert2';

import {
  getAllStatementLadgerData,
  getAdminProfile,
  getUserProfileData
} from "../../Server/api";

const TransactionHistory = () => {
  const [searchParams] = useSearchParams();
  const adminId = searchParams.get('admin_id');
  const role = searchParams.get('role');

  const [currentPage, setCurrentPage] = useState(1);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 100,
    total: 0,
    totalPages: 0
  });
  const [userId, setUserId] = useState(null);
  const [profileUsername, setProfileUsername] = useState('');

  const itemsPerPage = 100;

  // Fetch user/agent profile to get _id
  const fetchUserProfile = async () => {
    if (!adminId) {
      console.error("No admin_id found");
      return;
    }

    try {
      const payload = {
        admin_id: adminId,
        role: parseInt(role)
      };

      console.log("Fetching profile with payload:", payload);

      let response;
      let profileData;

      // Check if role is 3 (user) or 2 (agent)
      if (parseInt(role) === 3) {
        // 🔥 USER PROFILE (Role 3) - Sirf user ki own transactions
        console.log("Fetching user profile data");
        response = await getUserProfileData(payload);
        console.log("User Profile Response:", response);
        
        profileData = response?.data?.data?.user_profile || 
                     response?.data?.user_profile || 
                     response?.data?.data || 
                     response?.data || 
                     response || {};
                     
        console.log("Extracted profileData:", profileData);
      } else {
        // ✅ AGENT PROFILE (Role 2) - Agent ke saare users ki transactions
        console.log("Fetching admin/agent profile data");
        response = await getAdminProfile(payload);
        console.log("Admin Profile Response:", response);
        profileData = response?.data?.data?.admin_profile || 
                     response?.data?.admin_profile || 
                     response?.data || 
                     response || {};
      }

      // Get _id from profile data
      const userIdFromProfile = profileData._id || profileData.id;
      console.log("User ID from profile:", userIdFromProfile);
      setUserId(userIdFromProfile);

      // Get username from profile data for From/To column
      const userName = profileData.username || profileData.name || adminId;
      setProfileUsername(userName);
      console.log("Profile Username for From/To:", userName);

      // If we have userId, fetch transactions
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
    let userIdToUse = userIdParam || userId || adminId;

    // 🔥 ROLE 2: Agent ke liye - saare users ki transactions ke liye user_id = admin_id bhejna hai
    if (parseInt(role) === 2) {
      // Agent ke liye admin_id hi user_id ke roop mein bhejna hai
      userIdToUse = adminId;
      console.log("🔹 Role 2 (Agent): Using admin_id as user_id:", userIdToUse);
    } else {
      // Role 3: User ki own transactions
      userIdToUse = userIdParam || userId;
      console.log("🔹 Role 3 (User): Using user_id:", userIdToUse);
    }

    if (!adminId) {
      console.error("No admin_id found");
      return;
    }

    if (!userIdToUse) {
      console.error("No user_id found");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "User ID not found",
        confirmButtonText: "OK",
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        admin_id: adminId,
       // user_id: userIdToUse,  // 🔥 Role 2: admin_id, Role 3: user_id
        page: page,
        limit: itemsPerPage,
        start_date: null,
        end_date: null
      };

      console.log("🚀 Sending API Payload:", payload);

      const response = await getAllStatementLadgerData(payload);
      console.log("✅ Transaction Response:", response);

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
      console.error("❌ Error fetching transactions:", error);
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
    if (userId || parseInt(role) === 2) {
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
    if (parseInt(role) === 3) {
      return `User -> ${profileUsername || adminId}`;
    } else {
      return `Agent -> ${profileUsername || adminId}`;
    }
  };

  return (
    <Layout activeItem="transaction-history">
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
                            <td>{formatDate(transaction.created_at || transaction.date)}</td>
                            <td>
                              {transaction.tr_type === 'credit' && transaction.type !== 'withdraw' ? (
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
                              {transaction.remark || transaction.description || '-'}
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

export default TransactionHistory;