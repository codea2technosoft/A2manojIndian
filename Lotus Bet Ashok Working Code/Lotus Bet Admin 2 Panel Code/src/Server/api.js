import Dashboard from '../Pages/Dashboard';
import API from './apiaxios';

export const changePassword = (old_password, new_password) =>
  API.post("/change-password", { old_password, new_password });

export const getAllGames = () => API.get('/allgamelist');

export const toggleGameStatus = (gameId) => API.patch(`/toggle-game-status/${gameId}`);
export const CaseTransactionReport = (payload) =>
  API.post("/cash-transaction-report", payload);
export const getAllMatches = (params = {}) => API.get('/allmetchists', { params });
export const getMatchById = (matchId) => API.get(`/matches/${matchId}`);
export const deleteMatch = (matchId) => API.delete(`/matches/${matchId}`);
export const toggleMatchStatus = (matchId) =>
API.patch(`/matches/${matchId}/toggle-status`, { matchId });
export const getMyLedger = (payload) => {
  // return API.post("/get-my-ledger", payload);
  return API.post("/get-my-ledger-master", payload);
};
//event list
export const getAllEvents = (sportId, seriesId, params = {}) => {
  const queryParams = new URLSearchParams();
  if (sportId && sportId !== 'undefined') queryParams.append('sportId', sportId);
  if (seriesId && seriesId !== 'undefined') queryParams.append('seriesId', seriesId);
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== '') {
      queryParams.append(key, params[key]);
    }
  });
  const queryString = queryParams.toString();
  const url = queryString ? `/allEventslist?${queryString}` : '/allEventslist';
  return API.post(url);
};
export const completedevents = (sportId, seriesId, params = {}) => {
  const queryParams = new URLSearchParams();
  if (sportId && sportId !== 'undefined') queryParams.append('sportId', sportId);
  if (seriesId && seriesId !== 'undefined') queryParams.append('seriesId', seriesId);
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== '') {
      queryParams.append(key, params[key]);
    }
  });
  const queryString = queryParams.toString();
  const url = queryString ? `/completed-events?${queryString}` : '/completed-events';
  return API.get(url);
};

export const toggleEventStatus = (eventId) =>
API.patch(`/events/${eventId}/toggle-status`, { eventId });

export const toggleCompletedStatus = (eventId, newStatus) => {
  return API.patch(`/events/${eventId}/toggle-completed`, { newStatus });
};

// export const getChildList = (role) =>
//   API.post("/get-child-list", { role });

export const getChildList = (role, admin_id) =>
  API.post("/get-child-lenden", {
    role,
    admin_id,
  });
export const getChildListTransaction = (role, admin_id) =>
  API.post("/get-child-list", {
    role,
    admin_id,
  });


// export const getChildList_list = (role) =>
//   API.post("/get-child-user-list", { role });


export const getCompletedMatchList = (payload) =>
  API.post("/complet-match-result-list", payload);
 
// export const getAllMatchResultList = (payload) =>
//   API.get("/complete-match-result-list", payload);
 
export const getMatchBetCompletedHistory = (payload) =>
  API.post("/get-match-bets-complete-history", payload);
 
export const getEventBetsCompleteHistory = (payload) =>
  API.post("/get-event-bets-complete-history", payload);
export const CompleteGameSessionPL = (payload) =>
  API.post("/complete-game-session-pl", payload);
export const Completegetsessionbetspending = (payload) =>
  API.post("/get-session-bets-pending", payload);
export const getmatchbetspending = (payload) =>
  API.post("/get-match-bets-pending", payload);



export const AbendedbetList = (payload) =>
  API.post("/get-bet-cancel-history", payload);
export const getallcompletesession = (payload) =>
  API.post("/get-all-completed-session", payload);
 
export const fetMatchExposerMyBook = (payload) =>
  API.post("/get-match-total-exposer-my", payload);


export const getChildList_list = (role, admin_id) =>
  API.post("/get-child-user-lenden", {
    role,
    admin_id,
  });
export const getChildList_listnew = (role, admin_id) =>
  API.post("/get-child-user-lenden", {
    role,
    admin_id,
  });
export const getChildList_listnewUser = (role, admin_id) =>
  API.post("/get-child-user-list", {
    role,
    admin_id,
  });

 
// Add new transaction
export const addNewTransaction = (data) =>
  API.post("/add-new-transaction", data);
export const addNewTransactionuser = (data) =>
  API.post("/add-new-transaction-user", data);
 
// Get my ledger transactions
export const getMyLedgerTxn = (payload) =>
  API.post("/get-my-ledger-txn", payload);
export const getMyLedgerTxn_user = (payload) =>
  API.post("/get-my-ledger-txn-user", payload);
 
export const deleteLedgerTxn = (payload) =>
  API.post("/delete-ledger-txn", payload);
export const deleteLedgerTxn_user = (payload) =>
  API.post("/delete-ledger-txn-user", payload);
 
export const getDeletedLedgerTxn = (payload) =>
  API.post("/get-my-ledger-delete-txn", payload);
 
//UserManagment//
export const getAllUsersList = (params = {}) => API.get('/alluserslist', { params });
export const createUser = (userData) => API.post('/create-user', userData);
export const updateUser = (userId, userData) => API.put(`/users/${userId}`, userData);
export const deleteUser = (userId) => API.delete(`/users/${userId}`);
export const updateUserStatus = (userId, user_status) =>
  API.patch(`/users/${userId}/status`, { user_status });
export const getDeletedUsers = () => API.get("/deleted-users");
export const restoreUser = (userId) => API.patch(`/users/${userId}/restore`);
export const blockUser = (userId) =>
  API.post("/user-block-status", { user_id: userId });
   export const addUserNote = (user_id, note) =>
  API.post("/user-note-store", { user_id, note });
  export const getUserNote = (userId) =>
  API.get(`/get-note-userdata?user_id=${userId}`);
export const getUserById = (userId) => API.get(`/users/${userId}`);

export const getSingleUserNote = (user_id) =>
  API.post(`/user-note/${user_id}`);
// ✅ Deposit amount to user
export const depositToUser = (userId, amount, remarks) =>
  API.post('/deposit_amount', { userId, amount, remarks });

// ✅ Withdraw amount from user
export const withdrawFromUser = (userId, amount, remarks) =>
  API.post('/withdraw_amount', { userId, amount, remarks });


export const getUserWalletDetails = (userId) =>
  API.get(`/wallet/user/${userId}`);

export const getAllTransactions = (params = {}) =>
  API.get('/transactions', { params });

export const getTransactionSummary = () =>
  API.get('/transactions/summary');

export const getUserTransactions = (userId, params = {}) =>
  API.get(`/transactionlist/user/${userId}`, { params });


// ✅ NEW: Refresh matches API call
export const refreshMatches = () => API.get('/getMatchRefresh');

export const getExternalEvents = (sport_id, series_id) => {
  return API.get(`/events/external?series_id=${series_id}&sport_id=${sport_id}`);
};

export const getExternalEventsBySport = (sport_id) => {
  return API.get(`/active-events?sport_id=${sport_id}`);
};
// ✅ Get selections (teams) by market
// ✅ Get markets by event
export const getMarketsByEvent = (event_id) =>
  API.get(`/get-markets`, { params: { event_id } });

// ✅ Get selections (teams) by market
export const getSelectionsByMarket = (market_id) =>
  API.get(`/get-selections`, { params: { market_id } });

// 🔹 Declare Result API
export const declareMatchResult = (payload) => {
  return API.post("/match-result-settled", payload);
};
// export const getAllMatchResultList = (params = {}) =>
//   API.post("/all-match-result-list", params);

export const getAllMatchResultList = (payload) =>
  API.post("/complete-match-result-list", payload);

// Import Event
export const importEvent = (sport_id, series_id) =>
  API.post("/import-event", { sport_id, series_id });

// Settings APIs
export const getSettings = () => API.get('/settings');
export const saveSettings = (formData) => API.post('/save-settings', formData);
export const getAllScanners = () =>
  API.get("/scanner-lists");
 
export const viewScanner = (id) =>
  API.get(`/scanners-view/${id}`);
 export const deleteScanner = (id) =>
  API.delete("/scanners-delete", {
    data: { id },
  });
 
export const createScannersetting = (data) =>
  API.post("/scanners-create", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const changeScannerStatus = (id) =>
  API.patch(`/scanners-change-status/${id}/status`);
 
export const updateScanner = (id, data) =>
  API.post(`/scanners-update`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
 
// Import Market API
export const importMarket = (sport_id, event_id) =>
  API.post("/get-market-teams", { sport_id, event_id });

// export const getImportedMarkets = (sport_id, event_id) => 
//   API.post("/market-lists", { sport_id, event_id });

export const getAllDepositWithdrawList = (params = {}) =>
  API.get("/deposit-withdraw-list", { params });

export const getAdminDashboardSummary = () => {
  return API.get(`/dashboard/summary`);
};

// ✅ Get Admin Deposit Details by Date


export const getAdminDepositDetailsByDate = (date, params = {}) =>
  API.get(`/deposit-details/${date}`, { params });

export const getAdminDepositListsByDate = (params = {}) =>
  API.get(`/datewise_deposit-list`, { params });

//  Get Admin Withdraw Summary (Date-wise)
export const getAdminWithdrawlsitdateWise = (params = {}) =>
  API.get('/datewise_withdraw-list', { params });

//Get Admin Withdraw Details by Specific Date
export const getAdminWithdrawDetailsByDate = (date, params = {}) =>
  API.get(`/datewisewithdraw-details/${date}`, { params });

// export const getAllgetAllDepositList = (params = {}) =>API.get("/deposit-list", { params });
export const getAllgetAllDepositList = (params = {}) =>API.get("/admin-deposit-list", { params });
export const getAlltwithdrawList = (params = {}) =>API.get("/admin-withdraw-list", { params });

//bet managment
// ✅ Get All Bets (Admin)
export const getAllBets = (params) =>
  API.get("/get-all-bets", { params });
export const getAllpending = (params) => API.get("/get-pending-bets", { params });
export const getAllsucces = (params) => API.get("/get-succes-bets", { params });
export const getBetById = (betId) => API.get(`/get-bet/${betId}`);
export const deleteBets = (betId) => API.delete(`/delete-bet/${betId}`);

// Get all deposit requests (with filters/pagination)
export const getAllDepositRequests = (params = {}) =>
  API.get("/all_deposit_request", { params });

// Get specific deposit request by ID
export const getDepositById = (id) =>
  API.get(`/deposit_request/${id}`);

// Update deposit request status (approved/rejected)
// in bulk
// export const updateDepositStatus = (ids, data) =>
//   API.put(`/deposit_request_change_status`, { ids, ...data });

export const updateDepositStatus = (id, data) =>
  API.put(`/deposit_request_change_status/${id}`, data);

export const getDashboardClientList = (admin_id) =>
  API.post("/get-dashboard-client-list", { admin_id });
 

 //fancy managment
export const getAllFancyMatches = (params = {}) => API.get('/fancy/allmetchists', { params });
export const getMatchesBySeriesId = (seriesId) =>
  API.get(`/admin/series/${seriesId}/matches`);
// export const getFancyList = (eventId) => 
// API.get(`https://apileo.leobook.in/get-fancy-list?id=${eventId}`);
// 🔥 Fancy Management APIs
// FANCY MANAGEMENT APIS
export const changeFancyStatusNew = (payload) =>
  API.post('/change-fancy-status-new', payload);  // ✅ Fancy ON/OFF (Add/Delete)

export const getFancySecondList = (event_id) =>
  API.post('/change-fancy-second', { event_id }); // ✅ Fancy Second Page (list)

export const manageFancyResult = (payload) =>
  API.post('/manage-fancy-result', payload);

export const rollbackFancyNow = (payload) =>
  API.post('/rollback-fancy-now', payload); // ✅ Rollback fancy

export const settledFancyNow = (payload) =>
  API.post('/settled-fancy-now', payload); // ✅ Settle fancy
// Fancy APIs
// export const getFancyList = (event_id) => {
//   return API.post('/get-fancy', { params: { event_id } });
// };
export const getFancyList = (event_id) =>
  API.post("/get-fancy", { event_id });

export const toggleFancyStatus = (id) =>
  API.post('/change-fancy-status', { id }); // ✅ Activate / Inactivate Fancy
// Withdraw requests API
export const getAllWithdrawRequests = (params = {}) =>
  API.get('/all_withdrow_request', { params });

// date wise deposit request from user side//
export const DepositRequestListsByDate = (params = {}) =>
  API.get(`/datewise-deposit_request-list`, { params });
export const DepositRequestDetailsByDate = (date, params = {}) =>
  API.get(`/datewise_deposit_request_details/${date}`, { params });

// date wise withdraw request from user side//
export const WithdrawRequestListsByDate = (params = {}) =>
  API.get(`/datewise-request-withdraw-list`, { params });
export const withdrawRequestDetailsByDate = (date, params = {}) =>
  API.get(`/datewise_withdraw-request-details/${date}`, { params });
// ✅ Update withdraw status (approved/rejected)
export const updateWithdrawStatus = (id, data) =>
  API.put(`/withdrow_request_change_status/${id}`, data);


//slider

export const getAllSliders = () => API.get("/slider-lists");
export const getSliderById = (id) => API.get(`/sliders/${id}`);
export const createSlider = (data) =>
  API.post("/sliders-create", data, {
    headers: { "Content-Type": "multipart/form-data" }
  });
export const updateSlider = (data) =>
  API.post("/sliders-update", data, {
    headers: { "Content-Type": "multipart/form-data" }
  });

export const deleteSlider = (id) =>
  API.delete(`/sliders-delete`, {
    data: { id }
  });
// CHANGE STATUS
export const toggleSliderStatus = (id) => API.patch(`/sliders-change-status/${id}/status`);

//subAdmin Route//
// Correct ROUTES
export const createSubAdmin = (data) =>
  API.post("/sub-admin-create", data);
export const getAllSubAdmins = () =>
  API.get("/sub-admin-list");
export const updateSubAdmin = (id, data) => API.put(`/sub-admin-update/${id}`, data);
export const deleteSubAdmin = (user_id) =>
  API.delete(`/sub-admin-delete/${user_id}`);
export const changestatusSubAdmin = (id, data) =>
  API.put(`/sub-admin-change-status/${id}`, data);

export const getSingleSubAdmin = (id) =>
  API.get(`/sub-admin/${id}`);

// Add this function to your API file
export const updateSubAdminPermissions = (id, data) =>
  API.put(`/sub-admin-permissions/${id}`, data);

export const getSubAdminPermissions = (id) =>
  API.get(`/sub-admin-permissions-list/${id}`);





