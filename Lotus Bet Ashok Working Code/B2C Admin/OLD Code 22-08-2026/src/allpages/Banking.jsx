// import React, { useState, useEffect } from 'react';
// import { getBankingAgentListAll, submitMultipleTransactionsAgents } from "../Server/api";
// import { useNavigate } from 'react-router-dom';
// import Swal from 'sweetalert2';

// const Banking = () => {
//   const navigate = useNavigate();

//   // State for search and filters
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('');

//   // State for expanded rows - track which rows are expanded
//   const [expandedRows, setExpandedRows] = useState({});

//   // State for deposit/withdraw values
//   const [dwValues, setDwValues] = useState({});

//   // State for remark values
//   const [remarks, setRemarks] = useState({});

//   // State for credit reference edits
//   const [creditRefs, setCreditRefs] = useState({});
//   const [editingCreditRef, setEditingCreditRef] = useState(null);
//   const [tempCreditRef, setTempCreditRef] = useState({});

//   // State for payment form
//   const [password, setPassword] = useState('');
//   const [selectedPayments, setSelectedPayments] = useState([]);

//   // State for members data from API
//   const [members, setMembers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [summaryData, setSummaryData] = useState(null);
//   const [paginationData, setPaginationData] = useState(null);
//   const [submitLoading, setSubmitLoading] = useState(false);

//   // State for withdrawal error
//   const [withdrawErrors, setWithdrawErrors] = useState({});

//   // Get user data from localStorage
//   const getUserData = () => {
//     try {
//       const userData = localStorage.getItem('user');
//       if (userData) {
//         return JSON.parse(userData);
//       }
//       return null;
//     } catch (error) {
//       console.error('Error parsing user data:', error);
//       return null;
//     }
//   };

//   // Fetch data from API - Modified to accept parameters
//   const fetchBankingData = async (search = searchTerm, status = statusFilter) => {
//     setLoading(true);
//     try {
//       const payload = {
//         admin_id: "admin",
//         search: search || "",
//         status: status || ""
//       };

//       console.log('Sending payload:', payload);

//       const response = await getBankingAgentListAll(payload);

//       console.log('API Response:', response);

//       const apiData = response?.data;

//       if (apiData && apiData.success === true) {
//         if (apiData.summary) {
//           setSummaryData(apiData.summary);
//         }

//         if (apiData.pagination) {
//           setPaginationData(apiData.pagination);
//         }

//         const dataArray = apiData.data || [];
//         console.log('Data array length:', dataArray.length);

//         if (Array.isArray(dataArray) && dataArray.length > 0) {
//           const formattedMembers = dataArray.map(item => ({
//             id: item._id || item.admin_id || item.user_id,
//             name: item.username || item.uid || '',
//             balance: parseFloat(item.balance) || 0,
//             coins: parseFloat(item.coins) || 0,
//             availableDW: (parseFloat(item.coins) || 0) + (parseFloat(item.balance) || 0),
//             exposure: parseFloat(item.total_exposure) || parseFloat(item.exposure) || 0,
//             creditReference: parseFloat(item.credit) || parseFloat(item.credit_reference) || parseFloat(item.credit_ref) || 0,
//             referencePL: parseFloat(item.reference_pl) || 0,
//             isExpanded: false,
//             status: item.status || 'Active',
//             phoneNumber: item.phoneNumber || '',
//             email: item.email || '',
//             createdAt: item.created_at || '',
//             admin_id: item.admin_id || '',
//             user_id: item.user_id || '',
//             deposit_withdraw: item.deposit_withdraw || 'D W',
//             remark: item.remark || 'Edit',
//             logs: item.logs || 0,
//             totalExposure: item.totalExposure || 0,
//             amount: item.amount || 0,
//             gameBalances: {
//               SABA: 0,
//               'Sky Trader': 0,
//               'Royal Gaming': 0,
//               BPoker: 0,
//               Casino: 0
//             }
//           }));
//           setMembers(formattedMembers);
//           console.log('Formatted Members count:', formattedMembers.length);
//         } else {
//           setMembers([]);
//           console.log('No data available - empty array');
//         }
//       } else {
//         setMembers([]);
//         console.log('Response not successful or no data');
//       }
//     } catch (err) {
//       console.error('Error fetching banking data:', err);
//       setMembers([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Initial load
//   useEffect(() => {
//     fetchBankingData();
//   }, []);

//   // Calculate totals
//   const totals = members.reduce((acc, member) => ({
//     balance: acc.balance + member.coins,
//     availableDW: acc.availableDW + member.availableDW,
//     exposure: acc.exposure + member.exposure,
//     creditReference: acc.creditReference + member.creditReference,
//     referencePL: acc.referencePL + member.referencePL
//   }), { balance: 0, availableDW: 0, exposure: 0, creditReference: 0, referencePL: 0 });

//   // Toggle row expansion
//   const toggleRow = (id) => {
//     setExpandedRows(prev => ({
//       ...prev,
//       [id]: !prev[id]
//     }));
//   };

//   const [fullbutton, setfullbutton] = useState({});
//   const [selectedTransactionType, setSelectedTransactionType] = useState({});

//   // Handle deposit/withdraw toggle
//   const handleDWToggle = (id, type) => {
//     setSelectedTransactionType(prev => ({
//       ...prev,
//       [id]: type
//     }));

//     if (type === 'withdraw') {
//       setfullbutton(prev => ({
//         ...prev,
//         [id]: false
//       }));
//     } else if (type === 'deposit') {
//       setfullbutton(prev => ({
//         ...prev,
//         [id]: true
//       }));
//     }

//     setDwValues(prev => ({
//       ...prev,
//       [id]: ''
//     }));

//     setWithdrawErrors(prev => ({
//       ...prev,
//       [id]: 'Amount should be greater than 0'
//     }));
//   };

//   // Handle DW value change
//   const handleDWValueChange = (id, value) => {
//     const numValue = parseFloat(value);
//     setDwValues(prev => ({
//       ...prev,
//       [id]: value
//     }));

//     const member = members.find(m => m.id === id);

//     if (value === '' || value === null || value === undefined) {
//       setWithdrawErrors(prev => ({
//         ...prev,
//         [id]: 'Amount should be greater than 0'
//       }));
//       return;
//     }

//     if (isNaN(numValue) || numValue <= 0) {
//       setWithdrawErrors(prev => ({
//         ...prev,
//         [id]: 'Amount should be greater than 0'
//       }));
//       return;
//     }

//     if (member && selectedTransactionType[id] === 'withdraw' && numValue > 0) {
//       if (numValue > member.availableDW) {
//         setWithdrawErrors(prev => ({
//           ...prev,
//           [id]: 'Withdrawal amount should not be greater than available balance'
//         }));
//       } else {
//         setWithdrawErrors(prev => ({
//           ...prev,
//           [id]: ''
//         }));
//       }
//     } else if (member && selectedTransactionType[id] === 'deposit' && numValue > 0) {
//       setWithdrawErrors(prev => ({
//         ...prev,
//         [id]: ''
//       }));
//     } else {
//       setWithdrawErrors(prev => ({
//         ...prev,
//         [id]: 'Amount should be greater than 0'
//       }));
//     }
//   };

//   // Handle Full button click
//   const handleFullClick = (id) => {
//     const member = members.find(m => m.id === id);
//     if (member) {
//       setDwValues(prev => ({
//         ...prev,
//         [id]: member.balance
//       }));
//     }
//   };

//   // Handle remark change
//   const handleRemarkChange = (id, value) => {
//     setRemarks(prev => ({
//       ...prev,
//       [id]: value
//     }));
//   };

//   // Handle credit reference edit
//   const handleCreditRefEdit = (id) => {
//     const member = members.find(m => m.id === id);
//     setTempCreditRef(prev => ({
//       ...prev,
//       [id]: member ? member.creditReference : 0
//     }));
//     setCreditRefs(prev => ({
//       ...prev,
//       [id]: member ? member.creditReference : 0
//     }));
//     setEditingCreditRef(id);
//   };

//   const handleCreditRefChange = (id, value) => {
//     setCreditRefs(prev => ({
//       ...prev,
//       [id]: value
//     }));
//   };

//   const handleCreditRefSave = (id) => {
//     console.log(`Saved credit reference for ${id}: ${creditRefs[id]}`);
//     setEditingCreditRef(null);
//   };

//   const handleCreditRefCancel = (id) => {
//     setCreditRefs(prev => ({
//       ...prev,
//       [id]: tempCreditRef[id] || 0
//     }));
//     setEditingCreditRef(null);
//   };

//   // Handle search - FIXED: Pass search term
//   const handleSearch = () => {
//     console.log('Searching for:', searchTerm);
//     fetchBankingData(searchTerm, statusFilter);
//   };

//   // Handle status filter - FIXED: Pass new status value
//   const handleStatusChange = (e) => {
//     const value = e.target.value;
//     setStatusFilter(value);
//     fetchBankingData(searchTerm, value);
//   };

//   // Handle reset - FIXED: Pass empty values
//   const handleReset = () => {
//     setSearchTerm('');
//     setStatusFilter('');
//     fetchBankingData('', '');
//   };

//   // Get selected payment count
//   const getSelectedPaymentCount = () => {
//     let count = 0;
//     members.forEach(member => {
//       if (dwValues[member.id] && parseFloat(dwValues[member.id]) > 0) {
//         count++;
//       }
//     });
//     return count;
//   };

//   // Handle payment submit
//   const handlePaymentSubmit = async (e) => {
//     e.preventDefault();

//     if (!password) {
//       Swal.fire({
//         icon: 'warning',
//         title: 'Password Required',
//         text: 'Please enter password',
//         confirmButtonColor: '#3085d6',
//         confirmButtonText: 'OK'
//       });
//       return;
//     }

//     const transactions = [];
//     let hasTypeError = false;

//     members.forEach(member => {
//       const amount = parseFloat(dwValues[member.id]);

//       if (amount && amount > 0) {
//         const type = selectedTransactionType[member.id];

//         if (!type) {
//           hasTypeError = true;
//           setWithdrawErrors(prev => ({
//             ...prev,
//             [member.id]: 'Please select Debit or Withdraw type'
//           }));
//           return;
//         }

//         const remark = remarks[member.id] || `${type} for ${member.name}`;
//         transactions.push({
//           admin_id: member.admin_id || member.id,
//           amount: amount,
//           type: type,
//           remark: remark
//         });
//       }
//     });

//     if (hasTypeError) {
//       Swal.fire({
//         icon: 'error',
//         title: 'Type Selection Required',
//         text: 'Please select Debit or Withdraw type for all entries',
//         confirmButtonColor: '#d33',
//         confirmButtonText: 'OK'
//       });
//       return;
//     }

//     if (transactions.length === 0) {
//       Swal.fire({
//         icon: 'warning',
//         title: 'No Transactions',
//         text: 'Please select at least one transaction',
//         confirmButtonColor: '#3085d6',
//         confirmButtonText: 'OK'
//       });
//       return;
//     }

//     const userData = getUserData();
//     if (!userData) {
//       Swal.fire({
//         icon: 'error',
//         title: 'User Not Found',
//         text: 'User data not found',
//         confirmButtonColor: '#d33',
//         confirmButtonText: 'OK'
//       });
//       return;
//     }

//     const payload = {
//       super_admin_id: userData.admin_id || 'admin',
//       master_role: userData.role || 1,
//       role: 2,
//       password: password,
//       transactions: transactions
//     };

//     console.log('Submitting payload:', payload);

//     setSubmitLoading(true);
//     try {
//       const response = await submitMultipleTransactionsAgents(payload);
//       console.log('Payment submitted successfully:', response);

//       const successMessage = response?.data?.message || response?.message || 'Transactions processed successfully';

//       Swal.fire({
//         icon: 'success',
//         title: 'Success!',
//         text: successMessage,
//         confirmButtonColor: '#28a745',
//         confirmButtonText: 'OK',
//         timer: 2000,
//         timerProgressBar: true,
//         showConfirmButton: false
//       });

//       setDwValues({});
//       setRemarks({});
//       setPassword('');
//       setSelectedTransactionType({});
//       setfullbutton({});
//       setWithdrawErrors({});
//       fetchBankingData(searchTerm, statusFilter);

//     } catch (error) {
//       console.error('Error submitting payments:', error);
//       const errorMessage = error?.response?.data?.message || error?.message || 'Failed to submit payments. Please try again.';
//       Swal.fire({
//         icon: 'error',
//         title: 'Error!',
//         text: errorMessage,
//         confirmButtonColor: '#d33',
//         confirmButtonText: 'OK'
//       });
//     } finally {
//       setSubmitLoading(false);
//     }
//   };

//   // Handle clear all
//   const handleClearAll = () => {
//     setDwValues({});
//     setRemarks({});
//     setSelectedTransactionType({});
//     setfullbutton({});
//     setWithdrawErrors({});
//   };

//   // Handle log click
//   const handleLogClick = (adminId) => {
//     console.log('View logs for:', adminId);
//     window.open(`/agentwisebanking-debit-credit-log?agentId=${adminId}`, '_blank');
//   };

//   // Handle header Logs button click
//   const handleHeaderLogsClick = () => {
//     window.open('/Agentbankingtransctionhistory', '_blank');
//   };

//   // Handle recall
//   const handleRecall = (id, game) => {
//     console.log(`Recall ${game} for ${id}`);
//   };

//   const handleRecallAll = (id) => {
//     console.log(`Recall all games for ${id}`);
//   };

//   // Loading state
//   if (loading) {
//     return (
//       <div className="allcommon">
//         <section className="main-inner-outer">
//           <div className="container-fluid">
//             <div className="find-member-sec search_banking_detail">
//               <div className="db-sec">
//                 <h2 className="common-heading page-title">Banking</h2>
//               </div>
//               <div className="text-center py-5">
//                 <div className="spinner-border text-primary" role="status">
//                   <span className="visually-hidden">Loading...</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>
//       </div>
//     );
//   }

//   const paymentCount = getSelectedPaymentCount();

//   return (
//     <div className="allcommon">
//       <section className="main-inner-outer">
//         <div className="container-fluid">
//           <div className="find-member-sec search_banking_detail">
//             <div className="db-sec">
//               <h2 className="common-heading page-title">Banking</h2>
//             </div>

//             {/* Search Form */}
//             <form id="searchForm" className="">
//               <div className="position-relative">
//                 <input
//                   placeholder="Find member..."
//                   type="text"
//                   className="form-control"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//                 <i className="fas fa-search" />
//                 <button
//                   type="button"
//                   className="search-btn btn btn-primary"
//                   onClick={handleSearch}
//                 >
//                   Search
//                 </button>
//               </div>
//               <div className="d-flex align-items-center ps-3 mb-3 mb-sm-0">
//                 <label className="pe-3 mb-0 form-label">Status</label>
//                 <select
//                   className="form-select"
//                   value={statusFilter}
//                   onChange={handleStatusChange}
//                 >
//                   <option value="">All</option>
//                   <option value="active">Active</option>
//                   <option value="suspend">Suspend</option>
//                   <option value="locked">Locked</option>
//                 </select>
//               </div>
//               <button className="btn" type="button" onClick={handleReset}>
//                 <i className="fas fa-redo-alt" />
//               </button>
//             </form>

//             <div className="inner-wrapper">
//               <div className="common-container">
//                 {/* Balance Display */}
//                 <div className="bet_status bank_balance_detail d-sm-flex align-items-center my-1 my-sm-3">
//                   <h6 className="mb-0">Your Balance</h6>
//                   <strong>
//                     <small>INR</small>
//                     {totals.availableDW.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                   </strong>
//                 </div>

//                 {/* Table */}
//                 <div className="account-table batting-table banking-table">
//                   <div className="responsive">
//                     <table className="banking_detail_table table-color table">
//                       <thead>
//                         <tr>
//                           <th scope="col">UID</th>
//                           <th scope="col" style={{ textAlign: 'right' }}>Balance</th>
//                           <th scope="col" style={{ textAlign: 'right' }}>Available D/W</th>
//                           <th scope="col" style={{ textAlign: 'right' }}>Exposure</th>
//                           <th scope="col" style={{ textAlign: 'center' }}>Deposit / Withdraw</th>
//                           <th scope="col" style={{ textAlign: 'right' }}>Credit Reference</th>
//                           <th scope="col" style={{ textAlign: 'right', width: 180 }}>Reference P/L</th>
//                           <th scope="col" style={{ textAlign: 'right', width: '5%' }}>Remark</th>
//                           <th scope="col" style={{ textAlign: 'right', width: 110 }}>
//                             <button
//                               className="btn green-btn"
//                               style={{ padding: '3px 10px' }}
//                               onClick={handleHeaderLogsClick}
//                             >
//                               Logs
//                             </button>
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {members && members.length > 0 ? (
//                           members.map((member) => (
//                             <React.Fragment key={member.id}>
//                               {/* Main Row */}
//                               <tr>
//                                 <td>
//                                   <span className="list_number" />
//                                   {member.name}
//                                 </td>
//                                 <td>
//                                   {member.availableDW.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                                   <i
//                                     id={`icon_${member.id}`}
//                                     className={`fas ${expandedRows[member.id] ? 'fa-minus-square' : 'fa-plus-square'} pe-2`}
//                                     onClick={() => toggleRow(member.id)}
//                                     style={{ cursor: 'pointer' }}
//                                   />
//                                 </td>
//                                 <td> {member.coins.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
//                                 <td>{member.exposure.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
//                                 <td className="check_date" />
//                                 <td className="border-x" width={320}>
//                                   <div className="deposite-withdraw medium_width">
//                                     <div className="dw-toggle">
//                                       <div className="tgl_btn">
//                                         <input
//                                           type="radio"
//                                           name={`DW_${member.id}`}
//                                           checked={selectedTransactionType?.[member.id] === 'deposit'}
//                                           onChange={() => {
//                                             handleDWToggle(member.id, 'deposit');
//                                           }}
//                                         />
//                                         <label className={selectedTransactionType?.[member.id] === 'deposit' ? 'bg-green' : ''}>
//                                           D
//                                         </label>
//                                       </div>
//                                       <div className="tgl_btn">
//                                         <input
//                                           type="radio"
//                                           name={`DW_${member.id}`}
//                                           checked={selectedTransactionType?.[member.id] === 'withdraw'}
//                                           onChange={() => {
//                                             handleDWToggle(member.id, 'withdraw');
//                                           }}
//                                         />
//                                         <label className={selectedTransactionType?.[member.id] === 'withdraw' ? 'bg-red' : ''}>
//                                           W
//                                         </label>
//                                       </div>
//                                     </div>

//                                     <div className="dw-value_text_box">
//                                       <input
//                                         type="number"
//                                         min={1}
//                                         className="text-end form-control"
//                                         id={`user_${member.id}`}
//                                         value={dwValues[member.id] || ''}
//                                         onChange={(e) => handleDWValueChange(member.id, e.target.value)}
//                                       />
//                                       <span
//                                         className={`dw-graph-position ${selectedTransactionType[member.id] === 'deposit'
//                                           ? 'text-success'
//                                           : selectedTransactionType[member.id] === 'withdraw'
//                                             ? 'text-danger'
//                                             : ''
//                                           }`}
//                                       >
//                                         {selectedTransactionType[member.id] === 'deposit' ? '+' :
//                                           selectedTransactionType[member.id] === 'withdraw' ? '-' : ''}
//                                       </span>
//                                     </div>
//                                     <button
//                                       className={`btn ${dwValues[member.id]
//                                         ? 'theme_light_btn'
//                                         : 'disabled theme_light_btn'
//                                         }`}
//                                       onClick={() => handleFullClick(member.id)}
//                                       disabled={fullbutton[member.id]}
//                                     >
//                                       Full
//                                     </button>
//                                   </div>
//                                   {withdrawErrors[member.id] && (
//                                     <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>
//                                       {withdrawErrors[member.id]}
//                                     </div>
//                                   )}
//                                 </td>
//                                 <td>
//                                   {editingCreditRef === member.id ? (
//                                     <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
//                                       <input
//                                         type="number"
//                                         style={{ width: '100px' }}
//                                         value={creditRefs[member.id] || member.creditReference}
//                                         onChange={(e) => handleCreditRefChange(member.id, e.target.value)}
//                                         autoFocus
//                                       />
//                                       <button
//                                         className="btn theme_light_btn"
//                                         onClick={() => handleCreditRefSave(member.id)}
//                                         style={{ padding: '2px 8px', fontSize: '12px' }}
//                                       >
//                                         Save
//                                       </button>
//                                       <button
//                                         className="btn theme_light_btn"
//                                         onClick={() => handleCreditRefCancel(member.id)}
//                                         style={{ padding: '2px 8px', fontSize: '12px' }}
//                                       >
//                                         Cancel
//                                       </button>
//                                     </div>
//                                   ) : (
//                                     <div className='d-flex'>
//                                       <span style={{ marginRight: 10 }}>
//                                         {member.creditReference.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                                       </span>
//                                       <button
//                                         className="btn theme_light_btn"
//                                         onClick={() => handleCreditRefEdit(member.id)}
//                                       >
//                                         Edit
//                                       </button>
//                                     </div>
//                                   )}
//                                 </td>
//                                 <td className="border-x">
//                                   <span style={{ color: member.referencePL >= 0 ? 'green' : 'red' }}>
//                                     {member.referencePL.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                                   </span>
//                                 </td>
//                                 <td>
//                                   <input
//                                     placeholder="Remark"
//                                     type="text"
//                                     className="form-control"
//                                     value={remarks[member.id] || ''}
//                                     onChange={(e) => handleRemarkChange(member.id, e.target.value)}
//                                   />
//                                 </td>
//                                 <td>
//                                   <button
//                                     type="button"
//                                     className="btn theme_light_btn"
//                                     onClick={() => handleLogClick(member.admin_id || member.id)}
//                                   >
//                                     Log
//                                   </button>
//                                 </td>
//                               </tr>

//                               {/* Expanded Row - Game Balances */}
//                               <tr
//                                 id={member.id}
//                                 className="expand-balance light_blue"
//                                 style={{ display: expandedRows[member.id] ? 'contents' : 'none' }}
//                               >
//                                 <td></td>
//                                 <td colSpan="10" className="p-0 large_table_data">
//                                   <table className="inner_table">
//                                     <tbody>
//                                       <tr>
//                                         <th style={{ width: '9%' }}>Game</th>
//                                         <th style={{ width: '11%' }}>Balance</th>
//                                         <th style={{ width: '7%' }}>
//                                           <a
//                                             href="#"
//                                             onClick={(e) => {
//                                               e.preventDefault();
//                                               handleRecallAll(member.id);
//                                             }}
//                                           >
//                                             Recall All
//                                           </a>
//                                         </th>
//                                         <th></th>
//                                       </tr>
//                                       {Object.entries(member.gameBalances).map(([game, balance]) => (
//                                         <tr key={game}>
//                                           <td>{game}</td>
//                                           <td>{balance}</td>
//                                           <td>
//                                             <a
//                                               href="#"
//                                               onClick={(e) => {
//                                                 e.preventDefault();
//                                                 handleRecall(member.id, game);
//                                               }}
//                                             >
//                                               Recall
//                                             </a>
//                                           </td>
//                                           <td></td>
//                                         </tr>
//                                       ))}
//                                     </tbody>
//                                   </table>
//                                 </td>
//                               </tr>
//                             </React.Fragment>
//                           ))
//                         ) : (
//                           <tr>
//                             <td colSpan="9" className="text-center py-4">
//                               No data available
//                             </td>
//                           </tr>
//                         )}

//                         {/* Total Row */}
//                         {members.length > 0 && (
//                           <tr style={{ fontWeight: 500 }}>
//                             <td>Total</td>
//                             <td>{totals.balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
//                             <td>{totals.availableDW.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
//                             <td>{totals.exposure.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
//                             <td></td>
//                             <td>{totals.creditReference.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
//                             <td>{totals.referencePL.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
//                             <td></td>
//                             <td></td>
//                           </tr>
//                         )}
//                       </tbody>
//                     </table>
//                   </div>

//                   {/* Pagination */}
//                   <div className="bottom-pagination">
//                     <ul role="navigation" aria-label="Pagination">
//                       <li className={`previous ${paginationData?.hasPrev ? '' : 'disabled'}`}>
//                         <a
//                           className=""
//                           tabIndex={-1}
//                           role="button"
//                           aria-disabled={!paginationData?.hasPrev}
//                           aria-label="Previous page"
//                           rel="prev"
//                         >
//                           &lt;
//                         </a>
//                       </li>
//                       <li className="p-0">
//                         <a
//                           rel="canonical"
//                           role="button"
//                           className="pagintion-li"
//                           tabIndex={-1}
//                           aria-label="Page 1 is your current page"
//                           aria-current="page"
//                         >
//                           {paginationData?.page || 1}
//                         </a>
//                       </li>
//                       <li className={`next ${paginationData?.hasNext ? '' : 'disabled'}`}>
//                         <a
//                           className=""
//                           tabIndex={-1}
//                           role="button"
//                           aria-disabled={!paginationData?.hasNext}
//                           aria-label="Next page"
//                           rel="next"
//                         >
//                           &gt;
//                         </a>
//                       </li>
//                     </ul>
//                     {paginationData && (
//                       <span className="ms-3 text-muted" style={{ fontSize: '14px' }}>
//                         Total: {paginationData.totalRecords} records
//                       </span>
//                     )}
//                   </div>

//                   {/* Payment Form */}
//                   <div className="paymoney d-flex justify-content-center align-items-center">
//                     <form className="paymoney_form justify-content-center" onSubmit={handlePaymentSubmit}>
//                       <button
//                         className="clear_btn btn"
//                         type="button"
//                         onClick={handleClearAll}
//                       >
//                         Clear All
//                       </button>
//                       <input
//                         placeholder="Password"
//                         name="password"
//                         type="password"
//                         className="form-control"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         required
//                       />
//                       <button
//                         type="submit"
//                         className="btn green-btn"
//                         disabled={submitLoading}
//                       >
//                         {submitLoading ? 'Processing...' : 'Submit'}
//                         <span className="payment_count">{paymentCount}</span> Payment
//                       </button>
//                     </form>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Banking;

import React, { useState, useEffect } from "react";
import {
  getBankingAgentListAll,
  submitMultipleTransactionsAgents,
} from "../Server/api";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Banking = () => {
  const navigate = useNavigate();

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // State for expanded rows - track which rows are expanded
  const [expandedRows, setExpandedRows] = useState({});

  // State for deposit/withdraw values
  const [dwValues, setDwValues] = useState({});

  // State for remark values
  const [remarks, setRemarks] = useState({});

  // State for credit reference edits
  const [creditRefs, setCreditRefs] = useState({});
  const [editingCreditRef, setEditingCreditRef] = useState(null);
  const [tempCreditRef, setTempCreditRef] = useState({});

  // State for payment form
  const [password, setPassword] = useState("");
  const [selectedPayments, setSelectedPayments] = useState([]);

  // State for members data from API
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summaryData, setSummaryData] = useState(null);
  const [paginationData, setPaginationData] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  // State for withdrawal error
  const [withdrawErrors, setWithdrawErrors] = useState({});

  // Get user data from localStorage
  const getUserData = () => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        return JSON.parse(userData);
      }
      return null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  };

  // Fetch data from API - Modified to accept parameters
  const fetchBankingData = async (
    search = searchTerm,
    status = statusFilter,
  ) => {
    setLoading(true);
    try {
      const payload = {
        admin_id: "admin",
        search: search || "",
        status: status || "",
      };

      console.log("Sending payload:", payload);

      const response = await getBankingAgentListAll(payload);

      console.log("API Response:", response);

      const apiData = response?.data;

      if (apiData && apiData.success === true) {
        if (apiData.summary) {
          setSummaryData(apiData.summary);
        }

        if (apiData.pagination) {
          setPaginationData(apiData.pagination);
        }

        const dataArray = apiData.data || [];
        console.log("Data array length:", dataArray.length);

        if (Array.isArray(dataArray) && dataArray.length > 0) {
          const formattedMembers = dataArray.map((item) => ({
            id: item._id || item.admin_id || item.user_id,
            name: item.username || item.uid || "",
            balance: parseFloat(item.balance) || 0,
            coins: parseFloat(item.coins) || 0,
            availableDW:
              (parseFloat(item.coins) || 0) + (parseFloat(item.balance) || 0),
            exposure:
              parseFloat(item.total_exposure) || parseFloat(item.exposure) || 0,
            creditReference:
              parseFloat(item.credit) ||
              parseFloat(item.credit_reference) ||
              parseFloat(item.credit_ref) ||
              0,
            referencePL: parseFloat(item.reference_pl) || 0,
            isExpanded: false,
            status: item.status || "Active",
            phoneNumber: item.phoneNumber || "",
            email: item.email || "",
            createdAt: item.created_at || "",
            admin_id: item.admin_id || "",
            user_id: item.user_id || "",
            deposit_withdraw: item.deposit_withdraw || "D W",
            remark: item.remark || "Edit",
            logs: item.logs || 0,
            totalExposure: item.totalExposure || 0,
            amount: item.amount || 0,
            gameBalances: {
              SABA: 0,
              "Sky Trader": 0,
              "Royal Gaming": 0,
              BPoker: 0,
              Casino: 0,
            },
          }));
          setMembers(formattedMembers);
          console.log("Formatted Members count:", formattedMembers.length);
        } else {
          setMembers([]);
          console.log("No data available - empty array");
        }
      } else {
        setMembers([]);
        console.log("Response not successful or no data");
      }
    } catch (err) {
      console.error("Error fetching banking data:", err);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchBankingData();
  }, []);

  // Calculate totals
  const totals = members.reduce(
    (acc, member) => ({
      balance: acc.balance + member.coins,
      availableDW: acc.availableDW + member.availableDW,
      exposure: acc.exposure + member.exposure,
      creditReference: acc.creditReference + member.creditReference,
      referencePL: acc.referencePL + member.referencePL,
    }),
    {
      balance: 0,
      availableDW: 0,
      exposure: 0,
      creditReference: 0,
      referencePL: 0,
    },
  );

  // Toggle row expansion
  const toggleRow = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const [fullbutton, setfullbutton] = useState({});
  const [selectedTransactionType, setSelectedTransactionType] = useState({});

  // 🔥 FIX: Handle deposit/withdraw toggle - W click par sirf Full button active
  const handleDWToggle = (id, type) => {
    setSelectedTransactionType((prev) => ({
      ...prev,
      [id]: type,
    }));

    // 🔥 W (Withdraw) click par Full button active karo (value auto-fill nahi)
    if (type === "withdraw") {
      setfullbutton((prev) => ({
        ...prev,
        [id]: false, // false = enabled (clickable)
      }));

      // ❌ Value auto-fill nahi karenge
      // Sirf input field empty rakhenge
      setDwValues((prev) => ({
        ...prev,
        [id]: "",
      }));
      setWithdrawErrors((prev) => ({
        ...prev,
        [id]: "",
      }));
    } else if (type === "deposit") {
      // D (Deposit) click par Full button disable karo
      setfullbutton((prev) => ({
        ...prev,
        [id]: true, // true = disabled
      }));

      setDwValues((prev) => ({
        ...prev,
        [id]: "",
      }));
      setWithdrawErrors((prev) => ({
        ...prev,
        [id]: "",
      }));
    }
  };

  // Handle DW value change
  const handleDWValueChange = (id, value) => {
    const numValue = parseFloat(value);
    setDwValues((prev) => ({
      ...prev,
      [id]: value,
    }));

    const member = members.find((m) => m.id === id);

    if (value === "" || value === null || value === undefined) {
      setWithdrawErrors((prev) => ({
        ...prev,
        [id]: "Amount should be greater than 0",
      }));
      return;
    }

    if (isNaN(numValue) || numValue <= 0) {
      setWithdrawErrors((prev) => ({
        ...prev,
        [id]: "Amount should be greater than 0",
      }));
      return;
    }

    if (member && selectedTransactionType[id] === "withdraw" && numValue > 0) {
      if (numValue > member.coins) {
        setWithdrawErrors((prev) => ({
          ...prev,
          [id]: "Withdrawal amount should not be greater than available balance",
        }));
      } else {
        setWithdrawErrors((prev) => ({
          ...prev,
          [id]: "",
        }));
      }
    } else if (
      member &&
      selectedTransactionType[id] === "deposit" &&
      numValue > 0
    ) {
      setWithdrawErrors((prev) => ({
        ...prev,
        [id]: "",
      }));
    } else {
      setWithdrawErrors((prev) => ({
        ...prev,
        [id]: "Amount should be greater than 0",
      }));
    }
  };

  // 🔥 FIX: Handle Full button click - coins value auto-fill
  const handleFullClick = (id) => {
    const member = members.find((m) => m.id === id);
    if (member) {
      // 🔥 Full button click par coins value fill karo
      const coinsValue = member.coins || 0;
      setDwValues((prev) => ({
        ...prev,
        [id]: coinsValue.toString(),
      }));

      // Validation check for withdraw
      if (selectedTransactionType[id] === "withdraw" && coinsValue > 0) {
        if (coinsValue > member.coins) {
          setWithdrawErrors((prev) => ({
            ...prev,
            [id]: "Withdrawal amount should not be greater than available balance",
          }));
        } else {
          setWithdrawErrors((prev) => ({
            ...prev,
            [id]: "",
          }));
        }
      }
    }
  };

  // Handle remark change
  const handleRemarkChange = (id, value) => {
    setRemarks((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Handle credit reference edit
  const handleCreditRefEdit = (id) => {
    const member = members.find((m) => m.id === id);
    setTempCreditRef((prev) => ({
      ...prev,
      [id]: member ? member.creditReference : 0,
    }));
    setCreditRefs((prev) => ({
      ...prev,
      [id]: member ? member.creditReference : 0,
    }));
    setEditingCreditRef(id);
  };

  const handleCreditRefChange = (id, value) => {
    setCreditRefs((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleCreditRefSave = (id) => {
    console.log(`Saved credit reference for ${id}: ${creditRefs[id]}`);
    setEditingCreditRef(null);
  };

  const handleCreditRefCancel = (id) => {
    setCreditRefs((prev) => ({
      ...prev,
      [id]: tempCreditRef[id] || 0,
    }));
    setEditingCreditRef(null);
  };

  // Handle search - FIXED: Pass search term
  const handleSearch = () => {
    console.log("Searching for:", searchTerm);
    fetchBankingData(searchTerm, statusFilter);
  };

  // Handle status filter - FIXED: Pass new status value
  const handleStatusChange = (e) => {
    const value = e.target.value;
    setStatusFilter(value);
    fetchBankingData(searchTerm, value);
  };

  // Handle reset - FIXED: Pass empty values
  const handleReset = () => {
    setSearchTerm("");
    setStatusFilter("");
    fetchBankingData("", "");
  };

  // Get selected payment count
  const getSelectedPaymentCount = () => {
    let count = 0;
    members.forEach((member) => {
      if (dwValues[member.id] && parseFloat(dwValues[member.id]) > 0) {
        count++;
      }
    });
    return count;
  };

  // Handle payment submit
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    if (!password) {
      Swal.fire({
        icon: "warning",
        title: "Password Required",
        text: "Please enter password",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
      return;
    }

    const transactions = [];
    let hasTypeError = false;

    members.forEach((member) => {
      const amount = parseFloat(dwValues[member.id]);

      if (amount && amount > 0) {
        const type = selectedTransactionType[member.id];

        if (!type) {
          hasTypeError = true;
          setWithdrawErrors((prev) => ({
            ...prev,
            [member.id]: "Please select Debit or Withdraw type",
          }));
          return;
        }

        const remark = remarks[member.id] || `${type} for ${member.name}`;
        transactions.push({
          admin_id: member.admin_id || member.id,
          amount: amount,
          type: type,
          remark: remark,
        });
      }
    });

    if (hasTypeError) {
      Swal.fire({
        icon: "error",
        title: "Type Selection Required",
        text: "Please select Debit or Withdraw type for all entries",
        confirmButtonColor: "#d33",
        confirmButtonText: "OK",
      });
      return;
    }

    if (transactions.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Transactions",
        text: "Please select at least one transaction",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
      return;
    }

    const userData = getUserData();
    if (!userData) {
      Swal.fire({
        icon: "error",
        title: "User Not Found",
        text: "User data not found",
        confirmButtonColor: "#d33",
        confirmButtonText: "OK",
      });
      return;
    }

    const payload = {
      super_admin_id: userData.admin_id || "admin",
      master_role: userData.role || 1,
      role: 2,
      password: password,
      transactions: transactions,
    };

    console.log("Submitting payload:", payload);

    setSubmitLoading(true);
    try {
      const response = await submitMultipleTransactionsAgents(payload);
      console.log("Payment submitted successfully:", response);

      const successMessage =
        response?.data?.message ||
        response?.message ||
        "Transactions processed successfully";

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: successMessage,
        confirmButtonColor: "#28a745",
        confirmButtonText: "OK",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      setDwValues({});
      setRemarks({});
      setPassword("");
      setSelectedTransactionType({});
      setfullbutton({});
      setWithdrawErrors({});
      fetchBankingData(searchTerm, statusFilter);
    } catch (error) {
      console.error("Error submitting payments:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to submit payments. Please try again.";
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: errorMessage,
        confirmButtonColor: "#d33",
        confirmButtonText: "OK",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  // Handle clear all
  const handleClearAll = () => {
    setDwValues({});
    setRemarks({});
    setSelectedTransactionType({});
    setfullbutton({});
    setWithdrawErrors({});
  };

  // // Handle log click
  // const handleLogClick = (adminId) => {
  //   console.log('View logs for:', adminId);
  //   window.open(`/agentwisebanking-debit-credit-log?agentId=${adminId}`, '_blank');
  // };

  // Handle log click
  const handleLogClick = (adminId) => {
    console.log("View logs for:", adminId);
    window.open(
      `/agentwisebanking-debit-credit-log?agentId=${adminId}`,
      "_blank",
      "width=1200,height=800,scrollbars=yes,resizable=yes",
    );
  };

  // Handle header Logs button click
  // const handleHeaderLogsClick = () => {
  //   window.open('/Agentbankingtransctionhistory', '_blank');
  // };

  // Handle header Logs button click
  const handleHeaderLogsClick = () => {
    window.open(
      "/Agentbankingtransctionhistory",
      "_blank",
      "width=1200,height=800,scrollbars=yes,resizable=yes",
    );
  };

  // Handle recall
  const handleRecall = (id, game) => {
    console.log(`Recall ${game} for ${id}`);
  };

  const handleRecallAll = (id) => {
    console.log(`Recall all games for ${id}`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="allcommon">
        <section className="main-inner-outer">
          <div className="container-fluid">
            <div className="find-member-sec search_banking_detail">
              <div className="db-sec">
                <h2 className="common-heading page-title">Banking</h2>
              </div>
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const paymentCount = getSelectedPaymentCount();

  return (
    <div className="allcommon">
      <section className="main-inner-outer">
        <div className="container-fluid">
          <div className="find-member-sec search_banking_detail">
            <div className="db-sec">
              <h2 className="common-heading page-title">Banking</h2>
            </div>

            {/* Search Form */}
            <form id="searchForm" className="">
              <div className="position-relative">
                <input
                  placeholder="Find member..."
                  type="text"
                  className="form-control"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <i className="fas fa-search" />
                <button
                  type="button"
                  className="search-btn btn btn-primary"
                  onClick={handleSearch}
                >
                  Search
                </button>
              </div>
              <div className="d-flex align-items-center ps-3 mb-3 mb-sm-0">
                <label className="pe-3 mb-0 form-label">Status</label>
                <select
                  className="form-select"
                  value={statusFilter}
                  onChange={handleStatusChange}
                >
                  <option value="">All</option>
                  <option value="active">Active</option>
                  <option value="suspend">Suspend</option>
                  <option value="locked">Locked</option>
                </select>
              </div>
              <button className="btn" type="button" onClick={handleReset}>
                <i className="fas fa-redo-alt" />
              </button>
            </form>

            <div className="inner-wrapper">
              <div className="common-container">
                {/* Balance Display */}
                <div className="bet_status bank_balance_detail d-sm-flex align-items-center my-1 my-sm-3">
                  <h6 className="mb-0">Your Balance</h6>
                  <strong>
                    <small>INR</small>
                    {totals.availableDW.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </strong>
                </div>

                {/* Table */}
                <div className="account-table batting-table banking-table">
                  <div className="responsive">
                    <table className="banking_detail_table table-color table">
                      <thead>
                        <tr>
                          <th scope="col">UID</th>
                          <th scope="col">
                            Balance
                          </th>
                          <th scope="col">
                            Available D/W
                          </th>
                          <th scope="col">
                            Exposure
                          </th>
                          <th scope="col" style={{ textAlign: "center" }}>
                            Deposit / Withdraw
                          </th>
                          <th scope="col">
                            Credit Reference
                          </th>
                          <th scope="col">Reference P/L</th>
                          <th
                            scope="col"
                            style={{ textAlign: "right", width: "5%" }}
                          >
                            Remark
                          </th>
                          <th scope="col">
                            <button
                              className="btn green-btn"
                              style={{ padding: "3px 10px" }}
                              onClick={handleHeaderLogsClick}
                            >
                              All AG Logs
                            </button>
                          </th>

                          <th scope="col">AG Wise Logs</th>
                        </tr>
                      </thead>
                      <tbody>
                        {members && members.length > 0 ? (
                          members.map((member) => (
                            <React.Fragment key={member.id}>
                              {/* Main Row */}
                              <tr>
                                <td>
                                  <span className="list_number" />
                                  {member.name}
                                </td>
                                <td>
                                  {member.availableDW.toLocaleString("en-IN", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}
                                  <i
                                    id={`icon_${member.id}`}
                                    className={`fas ${expandedRows[member.id] ? "fa-minus-square" : "fa-plus-square"} pe-2`}
                                    onClick={() => toggleRow(member.id)}
                                    style={{ cursor: "pointer" }}
                                  />
                                </td>
                                <td>
                                  {" "}
                                  {member.coins.toLocaleString("en-IN", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}
                                </td>
                                <td>
                                  {member.exposure.toLocaleString("en-IN", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}
                                </td>
                                <td className="check_date" />
                                <td className="border-x" width={320}>
                                  <div className="deposite-withdraw medium_width">
                                    <div className="dw-toggle">
                                      <div className="tgl_btn">
                                        <input
                                          type="radio"
                                          name={`DW_${member.id}`}
                                          checked={
                                            selectedTransactionType?.[
                                              member.id
                                            ] === "deposit"
                                          }
                                          onChange={() => {
                                            handleDWToggle(
                                              member.id,
                                              "deposit",
                                            );
                                          }}
                                        />
                                        <label
                                          className={
                                            selectedTransactionType?.[
                                              member.id
                                            ] === "deposit"
                                              ? "bg-green"
                                              : ""
                                          }
                                        >
                                          D
                                        </label>
                                      </div>
                                      <div className="tgl_btn">
                                        <input
                                          type="radio"
                                          name={`DW_${member.id}`}
                                          checked={
                                            selectedTransactionType?.[
                                              member.id
                                            ] === "withdraw"
                                          }
                                          onChange={() => {
                                            handleDWToggle(
                                              member.id,
                                              "withdraw",
                                            );
                                          }}
                                        />
                                        <label
                                          className={
                                            selectedTransactionType?.[
                                              member.id
                                            ] === "withdraw"
                                              ? "bg-red"
                                              : ""
                                          }
                                        >
                                          W
                                        </label>
                                      </div>
                                    </div>

                                    <div className="dw-value_text_box">
                                      <input
                                        type="number"
                                        min={1}
                                        className="text-end form-control"
                                        id={`user_${member.id}`}
                                        value={dwValues[member.id] || ""}
                                        onChange={(e) =>
                                          handleDWValueChange(
                                            member.id,
                                            e.target.value,
                                          )
                                        }
                                      />
                                      <span
                                        className={`dw-graph-position ${
                                          selectedTransactionType[member.id] ===
                                          "deposit"
                                            ? "text-success"
                                            : selectedTransactionType[
                                                  member.id
                                                ] === "withdraw"
                                              ? "text-danger"
                                              : ""
                                        }`}
                                      >
                                        {selectedTransactionType[member.id] ===
                                        "deposit"
                                          ? "+"
                                          : selectedTransactionType[
                                                member.id
                                              ] === "withdraw"
                                            ? "-"
                                            : ""}
                                      </span>
                                    </div>
                                    {/* 🔥 FIX: Full button - W click par active, D click par disable */}
                                    <button
                                      className={`btn ${
                                        selectedTransactionType[member.id] ===
                                        "withdraw"
                                          ? "theme_light_btn"
                                          : "disabled theme_light_btn"
                                      }`}
                                      onClick={() => handleFullClick(member.id)}
                                      disabled={
                                        selectedTransactionType[member.id] !==
                                        "withdraw"
                                      }
                                    >
                                      Full
                                    </button>
                                  </div>
                                  {withdrawErrors[member.id] && (
                                    <div
                                      style={{
                                        color: "red",
                                        fontSize: "12px",
                                        marginTop: "5px",
                                      }}
                                    >
                                      {withdrawErrors[member.id]}
                                    </div>
                                  )}
                                </td>
                                <td>
                                  {editingCreditRef === member.id ? (
                                    <div
                                      style={{
                                        display: "flex",
                                        gap: "5px",
                                        alignItems: "center",
                                      }}
                                    >
                                      <input
                                        type="number"
                                        style={{ width: "100px" }}
                                        value={
                                          creditRefs[member.id] ||
                                          member.creditReference
                                        }
                                        onChange={(e) =>
                                          handleCreditRefChange(
                                            member.id,
                                            e.target.value,
                                          )
                                        }
                                        autoFocus
                                      />
                                      {/* <button
                                        className="btn theme_light_btn"
                                        onClick={() => handleCreditRefSave(member.id)}
                                        style={{ padding: '2px 8px', fontSize: '12px' }}
                                      >
                                        Save
                                      </button> */}
                                      <button
                                        className="btn theme_light_btn"
                                        onClick={() =>
                                          handleCreditRefCancel(member.id)
                                        }
                                        style={{
                                          padding: "2px 8px",
                                          fontSize: "12px",
                                        }}
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="d-inline-flex flex-column gap-1">
                                      <span style={{ marginRight: 10 }}>
                                        {member.creditReference.toLocaleString(
                                          "en-IN",
                                          {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                          },
                                        )}
                                      </span>
                                      <button
                                        className="btn theme_light_btn"
                                        onClick={() =>
                                          handleCreditRefEdit(member.id)
                                        }
                                      >
                                        Edit
                                      </button>
                                    </div>
                                  )}
                                </td>
                                <td className="border-x">
                                  <span
                                    style={{
                                      color:
                                        member.referencePL >= 0
                                          ? "green"
                                          : "red",
                                    }}
                                  >
                                    {member.referencePL.toLocaleString(
                                      "en-IN",
                                      {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                      },
                                    )}
                                  </span>
                                </td>
                                <td>
                                  <input
                                    placeholder="Remark"
                                    type="text"
                                    className="form-control"
                                    value={remarks[member.id] || ""}
                                    onChange={(e) =>
                                      handleRemarkChange(
                                        member.id,
                                        e.target.value,
                                      )
                                    }
                                  />
                                </td>
                                <td>
                                  <button
                                    type="button"
                                    className="btn theme_light_btn"
                                    onClick={() =>
                                      handleLogClick(
                                        member.admin_id || member.id,
                                      )
                                    }
                                  >
                                    Log
                                  </button>
                                </td>
                              </tr>

                              {/* Expanded Row - Game Balances */}
                              <tr
                                id={member.id}
                                className="expand-balance light_blue"
                                style={{
                                  display: expandedRows[member.id]
                                    ? "contents"
                                    : "none",
                                }}
                              >
                                <td></td>
                                <td
                                  colSpan="10"
                                  className="p-0 large_table_data"
                                >
                                  <table className="inner_table">
                                    <tbody>
                                      <tr>
                                        <th rowSpan="1" style={{ width: "9%" }}>Game</th>
                                        <th style={{ width: "11%" }}>
                                          Balance
                                        </th>
                                        <th style={{ width: "7%" }}>
                                          <a
                                            href="#"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              handleRecallAll(member.id);
                                            }}
                                          >
                                            Recall All
                                          </a>
                                        </th>
                                        <th></th>
                                      </tr>
                                      {Object.entries(member.gameBalances).map(
                                        ([game, balance]) => (
                                          <tr key={game}>
                                            <td>{game}</td>
                                            <td>{balance}</td>
                                            <td>
                                              <a
                                                href="#"
                                                onClick={(e) => {
                                                  e.preventDefault();
                                                  handleRecall(member.id, game);
                                                }}
                                              >
                                                Recall
                                              </a>
                                            </td>
                                            <td></td>
                                          </tr>
                                        ),
                                      )}
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </React.Fragment>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="9" className="text-center py-4">
                              No data available
                            </td>
                          </tr>
                        )}

                        {/* Total Row */}
                        {members.length > 0 && (
                          <tr style={{ fontWeight: 500 }}>
                            <td>Total</td>
                            <td>
                              {totals.balance.toLocaleString("en-IN", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </td>
                            <td>
                              {totals.availableDW.toLocaleString("en-IN", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </td>
                            <td>
                              {totals.exposure.toLocaleString("en-IN", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </td>
                            <td></td>
                            <td>
                              {totals.creditReference.toLocaleString("en-IN", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </td>
                            <td>
                              {totals.referencePL.toLocaleString("en-IN", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </td>
                            <td></td>
                            <td></td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="bottom-pagination">
                    <ul role="navigation" aria-label="Pagination">
                      <li
                        className={`previous ${paginationData?.hasPrev ? "" : "disabled"}`}
                      >
                        <a
                          className=""
                          tabIndex={-1}
                          role="button"
                          aria-disabled={!paginationData?.hasPrev}
                          aria-label="Previous page"
                          rel="prev"
                        >
                          &lt;
                        </a>
                      </li>
                      <li className="p-0">
                        <a
                          rel="canonical"
                          role="button"
                          className="pagintion-li"
                          tabIndex={-1}
                          aria-label="Page 1 is your current page"
                          aria-current="page"
                        >
                          {paginationData?.page || 1}
                        </a>
                      </li>
                      <li
                        className={`next ${paginationData?.hasNext ? "" : "disabled"}`}
                      >
                        <a
                          className=""
                          tabIndex={-1}
                          role="button"
                          aria-disabled={!paginationData?.hasNext}
                          aria-label="Next page"
                          rel="next"
                        >
                          &gt;
                        </a>
                      </li>
                    </ul>
                    {paginationData && (
                      <span
                        className="ms-3 text-muted"
                        style={{ fontSize: "14px" }}
                      >
                        Total: {paginationData.totalRecords} records
                      </span>
                    )}
                  </div>

                  {/* Payment Form */}
                  <div className="paymoney d-flex justify-content-center align-items-center">
                    <form
                      className="paymoney_form justify-content-center"
                      onSubmit={handlePaymentSubmit}
                    >
                      <button
                        className="clear_btn btn"
                        type="button"
                        onClick={handleClearAll}
                      >
                        Clear All
                      </button>
                      <input
                        placeholder="Password"
                        name="password"
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="submit"
                        className="btn green-btn"
                        disabled={submitLoading}
                      >
                        {submitLoading ? "Processing..." : "Submit"}
                        <span className="payment_count">
                          {paymentCount}
                        </span>{" "}
                        Payment
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Banking;
