import API from './apiaxios';
import axios from "axios"; // ✅ ADD THIS


export const changePassword = (old_password, new_password) =>
  API.post("/change-password", { old_password, new_password });

export const getAllGames = () => API.get('/allgamelist');

export const toggleGameStatus = (gameId) => API.patch(`/toggle-game-status/${gameId}`);

export const getAllMatches = (params = {}) => API.get('/allmetchists', { params });
export const getMatchById = (matchId) => API.get(`/matches/${matchId}`);
export const deleteMatch = (matchId) => API.delete(`/matches/${matchId}`);
export const toggleMatchStatus = (matchId) =>
  API.patch(`/matches/${matchId}/toggle-status`, { matchId });

//event list
export const getAllEvents = (sportId, seriesId, payload = {}) => {
  const queryParams = new URLSearchParams();
  if (sportId && sportId !== 'undefined') queryParams.append('sportId', sportId);
  if (seriesId && seriesId !== 'undefined') queryParams.append('seriesId', seriesId);
  // Object.keys(params).forEach(key => {
  //   if (params[key] !== undefined && params[key] !== '') {
  //     queryParams.append(key, params[key]);
  //   }
  // });
  // const queryString = queryParams.toString();
  // const url = queryString ? `/allEventslist?${queryString}` : '/allEventslist';
  const url = `/allEventslist?${queryParams.toString()}`;
  return API.post(url, payload);
};







export const toggleEventStatus = (eventId) =>
  API.patch(`/events/${eventId}/toggle-status`, { eventId });

export const toggleCompletedStatus = (eventId, newStatus) => {
  return API.patch(`/events/${eventId}/toggle-completed`, { newStatus });
};
export const CompletedEventList = () => {
  return API.get(`completed-events`);
};
export const InActiveEventList = (payload) => {
  return API.post(`inactive-events-list`, payload);
};
export const ActiveEventList = (payload) => {
  return API.post(`active-Events-list`, payload);
};

//UserManagment//
export const getAllUsersList = (params = {}) => API.get('/alluserslist', { params });

export const createUser = (userData) => API.post('/create-user', userData);
export const updateUser = (userId, userData) => API.put(`/users/${userId}`, userData);
// export const updateUser = (userId, userData) => API.put(`/users/${userId}`, userData);
export const deleteUser = (userId) => API.delete(`/users/${userId}`);
export const clearuserexposure = (userId) =>
  API.post(`/clear-user-exposure`, { userId });

export const updateUserStatus = (userId, user_status) =>
  API.patch(`/users/${userId}/status`, { user_status });
export const getDeletedUsers = () => API.get("/deleted-users");
export const restoreUser = (userId) => API.patch(`/users/${userId}/restore`);
export const blockUser = (userId) =>
  API.post("/user-block-status", { user_id: userId });

export const getInactiveUsers = (params = {}) =>
  API.get('/alluserslist', {
    params: { ...params, active: 0 }
  });

// ✅ Get Active Users
export const getActiveUsers = (params = {}) =>
  API.get('/alluserslist', {
    params: { ...params, active: 1 }
  });

// ✅ Get Blocked Users
export const getBlockedUsers = (params = {}) =>
  API.get('/alluserslist', {
    params: { ...params, banned: 1 }
  });



export const addUserNote = (user_id, note) =>
  API.post("/user-note-store", { user_id, note });
export const getUserNote = (userId) =>
  API.get(`/get-note-userdata?user_id=${userId}`);
export const getUserById = (userId) => API.get(`/users/${userId}`);

export const getSingleUserNote = (user_id) =>
  API.get(`/user-note/${user_id}`);
// ✅ Deposit amount to user
export const depositToUser = (userId, amount, remarks, depositType) =>
  API.post('/deposit_amount', { userId, amount, remarks, depositType });

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

// export const getExternalEvents = () => {
//   return API.get(`/events/external`);
// };

export const getExternalmatch = (params) => {
  // return API.get(`/events/external`, { params });
  return API.get(`events/external-fancy-result`, { params });

};
export const getExternalEvents = (sport_id, series_id) => {
  return API.get(`events/external?seriesId=${series_id}&sport_id=${sport_id}`);
};





//without pagination mtch list
// export const getmatchEvents = () => {
//   return API.get(`/event-match`);
// };

export const getmatchEvents = (payload) => {
  return API.post(`/event-match`, payload);
};





export const getExternalEventsBySport = (sport_id) => {
  return API.get(`/active-events?sport_id=${sport_id}`);
};

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


export const getCompletedMatchList = (payload) =>
  API.post("/complete-match-result-list", payload);

export const getAllMatchResultList = (payload) =>
  API.post("/complete-match-settled-result-list", payload);


export const getMatchBetCompletedHistory = (payload) =>
  API.post("/get-match-bets-complete-history", payload);

export const getEventBetsCompleteHistory = (payload) =>
  API.post("/get-event-bets-complete-history", payload);

export const fetMatchExposerMyBook = (payload) =>
  API.post("/get-match-total-exposer-my", payload);

export const AbendedbetList = (payload) =>
  API.post("/get-bet-cancel-history", payload);

export const getAllCompleteSession = (payload) =>
  API.post("/get-all-completed-session", payload);

export const getAllSessionBetList = (payload) =>
  API.post("/get-session-bets", payload);


// Server/api.js
export const getFancySetteledList = (payload) =>
  API.get("/get-fancy-settled-list", payload);

export const getFancyResultList = (payload) =>
  API.post("/get-fancy-result-list", payload);
export const getfancyrollbacklist = (payload) =>
  API.post("/get-fancy-rollback-list", payload);

// ✔ Fancy list by ID (VIEW API)
export const getFancyByList = (payload) =>
  API.post("/get-fancy-by-list", payload);

// Import Event
export const importEvent = (sport_id, series_id) =>
  API.post("/import-event", { sport_id, series_id });

// Settings APIs
export const getSettings = () => API.get('/admin-setting-list');

export const UpdateSettings = (formData) => API.post('/update-admin-setting', formData);

export const getAllScanners = () =>
  API.get("/scanner-lists");

export const viewScanner = (id) =>

  API.get(`/scanners-view/${id}`);
export const deleteScanner = (id) =>
  API.delete("/scanners-delete", {
    data: { id },
  });

// export const createScannersetting = (data) =>
//   API.post("/scanners-create", data, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });

// export const createScannersetting = (data) =>
//   API.post("/create-pay-type", data, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });

export const createScannersetting = (data) =>
  API.post("/create-pay-type", data); // just pass the object



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
export const getAllgetAllDepositList = (params = {}) => API.get("/admin-deposit-list", { params });
export const getAlltwithdrawList = (params = {}) => API.get("/admin-withdraw-list", { params });

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


export const getAllCompletedDepositRequests = (params = {}) =>
  API.get("/deposits-all-data", { params });

export const getAllAgentsLists = (params = {}) =>
  API.get("/agent-list", { params });


export const getAllCompletedWithdrawalRequests = (params = {}) =>
  API.get("/withdrow-all-data", { params });




// Get specific deposit request by ID
export const getDepositById = (id) =>
  API.get(`/deposit_request/${id}`);

// Update deposit request status (approved/rejected)
// in bulk
// export const updateDepositStatus = (ids, data) =>
//   API.put(`/deposit_request_change_status`, { ids, ...data });

export const updateDepositStatus = (id, data) =>
  API.put(`/deposit_request_change_status/${id}`, data);




//fancy managment
export const getAllFancyMatches = (params = {}) => API.get('/fancy/allmetchists', { params });
export const getMatchesBySeriesId = (seriesId) =>
  API.get(`/admin/series/${seriesId}/matches`);
// export const getFancyList = (eventId) => 
// API.get(`https://apileo.leobook.in/get-fancy-list?id=${eventId}`);
// 🔥 Fancy Management APIs
// FANCY MANAGEMENT APIS

export const changeFancyStatusNew = (payload) =>
  API.post('/change-fancy-status-new', payload);

export const getFancySecondList = (event_id) =>
  API.post('/change-fancy-second', { event_id });

export const getFancyStatusList = (event_id) =>
  API.post('/get-fancy-status', { event_id });

export const manageFancyResult = (payload) =>
  API.post('/manage-fancy-result', payload);

export const rollbackFancyNow = (payload) =>
  API.post('/rollback-fancy-now', payload);

export const rollbackFancyNow1 = (payload) =>
  API.post('/fancy-rollback', payload);
export const lenadenasettled = (payload) =>
  API.post('/lena-dena-settled', payload);

export const settledFancyNow = (payload) =>
  API.post('/settled-fancy-now', payload);

export const deleteAllFancyBets = (payload) =>
  API.post('/all-bet-delete', payload);
export const deleteFancy = (payload) =>
  API.post('/delete-fancy-bet', payload);



// Fancy APIs
// export const getFancyList = (event_id) => {
//   return API.post('/get-fancy', { params: { event_id } });
// };
export const getFancyList = (payload) =>
  API.post("/get-fancy", payload);

export const toggleFancyStatus = (id) =>
  API.post('/change-fancy-status', { id });
// Withdraw requests API
export const getAllWithdrawRequests = (params = {}) =>
  API.get('/all_withdrow_request', { params });

// date wise deposit request from user side//
export const DepositRequestListsByDate = (params = {}) =>
  API.get(`/datewise-deposit_request-list`, { params });


export const BetListsDatewise = (data) =>
  API.post(`/get-Date-Wise-Bet-Report`, data);
export const getadmindepositlist = (data) =>
  API.post(`/get-admin-deposit-list`, data);


export const getadminwithdrawlist = (data) =>
  API.post(`/get-admin-withdraw-list`, data);


// export const getAllBetList = (data) =>
//   API.post(`/get-Bet-List`, data);



// api.js - POST request with body
// export const getAllBetList = (data) => {
//   return API.post('/get-Bet-List', data);
// };

export const getAllBetList = (dataOrQuery, method = 'GET') => {
  if (method === 'POST') {
    return API.post('/get-Bet-List', dataOrQuery);
  } else {
    const queryString = typeof dataOrQuery === 'string' ? dataOrQuery : '';
    const url = queryString ? `/get-Bet-List?${queryString}` : '/get-Bet-List';
    return API.get(url);
  }
};


export const GetBetListLive = (date, params = {}) =>
  API.get(`/get-Bet-List-live/${date}`, { params });




export const DepositRequestDetailsByDate = (date, params = {}) =>
  API.get(`/datewise_deposit_request_details/${date}`, { params });

export const getMetchwiseReport = (payload) =>
  API.post(`/get-Match-Wise-Report`, payload);
// export const getfancybyid = (payload) =>
//   API.post(`/get-fancy-by-id`, payload);

export const getfancybyid = (fancy_id) =>
  API.post(`/get-fancy-by-id`, {
    fancy_id,
  });

export const getdatewiseBetUserReport = (payload) =>
  API.post(`/get-Date-Wise-Bet-User-Report`, payload);

// export const getfancysettled = (params = {}) =>
//   API.get(`/get-fancy-settled`, { params });
// export const getfancysettled = (fancy_id, data) => {
//   return axios.post(`/get-fancy-settled/${fancy_id}`, data);
// };

export const getfancysettled = (payload) =>
  API.post(`/get-fancy-settled`, payload);


// date wise withdraw request from user side//
export const WithdrawRequestListsByDate = (params = {}) =>
  API.get(`/datewise-request-withdraw-list`, { params });


export const getProfitLossByMarket = (params = {}) =>
  API.get(`/profit-loss-by-market`, { params });

export const showBetsLossByMarket = (params = {}) =>
  API.get("/show-bets", { params });


export const getDashboardPlayerStats = (params = {}) =>
  API.get("/dashboard-player-stats", { params });

export const getTopWinningLosingPlayers = (params = {}) =>
  API.get("/top-winning-losing-players", { params });

export const getRegistrationStats = (params = {}) =>
  API.get("/registration-stats", { params });










export const DateWisePlReportByDate = (payload) =>
  API.post(`/datewise-profit-loss`, payload);


export const withdrawRequestDetailsByDate = (date, params = {}) =>
  API.get(`/datewise_withdraw-request-details/${date}`, { params });
// ✅ Update withdraw status (approved/rejected)



export const updateWithdrawStatus = (id, data) =>
  API.put(`/withdrow_request_change_status/${id}`, data);

export const getAllPendingWithdrawRequests = (params = {}) =>
  API.post("/withdraw-request-list", { params });




export const PreapproveupdateWithdrawStatus = (id, data) =>
  API.put(`/withdraw-status-preview-update/${id}`, data);


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

export const createSubAdmin = (data) =>
  API.post("/sub-admin-create", data);

export const subAdminMenu = (data) =>
  API.post("/sub-admin-by-id", data);

export const getAllSubAdmins = () =>
  API.get("/sub-admin-list");

export const updateSubAdmin = (id, data) =>
  API.put(`/sub-admin-update/${id}`, data);

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


//master
export const createMasterAdmin = (data) =>
  API.post("/create-master-admin", data);

export const getAdminProfile = (data) =>
  API.post("/get-data", data);


export const getUserProfileData = (data) =>
  API.post("/get-data-user", data);

export const getAllStatementLadgerData = (data) =>
  API.post("/get-statement-user-ladger", data)


export const getAllStatementLadgerData2 = (data) =>
  API.post("/all-statement-ladger", data)

export const ChangeExposureLimit = (data) =>
  API.post("/change-exposer-limit", data)

export const GetAllLifetimePL = (data) =>
  API.post("/balance-summary", data)




export const GetAllMyAccountStatement= (data) =>
  API.post("/my-account-statement", data)




export const getAgentList = (params = {}) =>
  API.post("/get-user-list", params);

export const getAdminDetails = (data) =>
  API.post("/get-edit-admin-details", data);

// Update client details
export const updateClient = (data) =>
  API.post("/update-new-client", data);

// Update client status (active/inactive)
export const updateClientStatus = (admin_id, role, active) =>
  API.post("/update-client-status", { admin_id, role, active });

// Delete user
export const deleteMaster = (admin_id, role) =>
  API.post("/delete-user", { admin_id, role });

// Change user password (admin side)
export const changeMasterPassword = (data) =>
  API.post("/change-user-password-admin", data);

export const changeMasterPasswordAgent = (data) =>
  API.post("/change-user-password-agent", data);

export const changeMasterPasswordAgentStatus = (data) =>
  API.post("/change-status", data);

export const verifySuperAdminPassword = (payload) => {
  return API.post(`/verify-super-admin-password`, payload);
};



// Block/Unblock user
export const blockUnblockMaster = (admin_id, role, is_blocked) =>
  API.post("/block-unblock-user", { admin_id, role, is_blocked });
export const blockMasterList = (payload) =>
  API.post("/get-user-block-list", payload);

// Deposit coins to user
export const coinsDeposit = (data) =>
  API.post("/coins-deposit-master", data);

export const coinsWithdraw = (data) =>
  API.post("/coins-withdraw-master", data);

export const getStatements = (params = {}) =>
  API.post("/get-statement", params);


export const getDashboardClientList = (admin_id) =>
  API.post("/get-dashboard-client-list", { admin_id });



export const getAccountOperation = (data) =>
  API.post("/get-account-operation", data);


export const getMasterStatement = (adminId, params = {}) =>
  API.post("/get-statement", { admin_id: adminId, ...params });


export const getStatementPL = (payload) =>
  API.post("/get-statement-pl", payload);

///master trasaction
// Get child list for dropdown

export const SelectMastertList = (payload) => {
  return API.post("/get-child-list", payload)
}

// Server/api.js
export const getChildList = (payload) => {
  return API.post("/get-child-lenden", payload)
}


export const getUserChildList = (payload) => {
  return API.post("/get-child-user-lenden", payload)
}


export const getEventBetsFancy = (payload) => {
  return API.post(`/get-event-bets-fancy`, payload);
};

// Add new transaction
export const addNewTransaction = (data) =>
  API.post("/add-new-transaction", data);

export const addNewTransactionmaster = (data) =>
  API.post("/add-new-transaction-master", data);

export const addUserNewTransaction = (data) =>
  API.post("/add-new-transaction-user", data);

// Get my ledger transactions
export const getMyLedgerTxn = (payload) =>
  API.post("/get-my-ledger-txn", payload);

export const getMyLedgerTxnUser = (payload) =>
  API.post("/get-my-ledger-txn-user", payload);

export const getMyLedger = (payload) => {
  return API.post("/get-my-ledger", payload);
};

export const deleteLedgerTxn = (payload) =>
  API.post("/delete-ledger-txn", payload);

export const MasterdeleteLedgerTxn = (payload) =>
  API.post("/delete-ledger-txn-master", payload);

export const UserdeleteLedgerTxn = (payload) =>
  API.post("/delete-ledger-txn-user", payload);


export const CaseTransactionReport = (payload) =>
  API.post("/cash-transaction-report", payload);

export const getDeletedLedgerTxn = (payload) =>
  API.post("/get-my-ledger-delete-txn", payload);

export const getChildList_list = (role) =>
  API.post("/get-child-user-list", { role });

export const getInactiveMasterList = (payload) =>
  API.post("/get-user-inactive-list", payload);

export const UserInactiveList = (payload) =>
  API.post("/get-agent-user-inactive-list", payload);

export const blockUserList = (payload) =>
  API.post("/get-agent-user-block-list", payload);


export const addSuperAdminCoins = (payload) => {
  return API.post("/add-coins", payload);
};





// MATCH LEDGER API
export const getMatchLedger = (payload) =>
  API.post("/get-match-ledger", payload);

// STATEMENT - ADMIN SETTING PAGE
export const getStatementAll = (payload) => {
  return API.post("/get-statement-all", payload);
};
export const getallfancybetshistory = (payload) => {
  return API.post("/get-all-fancy-bets-history", payload);
};
// export const getallsettledfancybetshistory = (payload) => {
//   return API.post("/get-all-settled-fancy-bets-history", payload);
// };
export const getallsettledmatchbetshistory = (payload) => {
  return API.post("/get-all-settled-match-bets-history", payload);
};
export const getallmatchbetshistory = (payload) => {
  return API.post("/get-all-match-bets-history", payload);
};






// ACCOUNT OPERATION - ADMIN SETTING PAGE
export const getAccountOperationAll = (params) => {
  return API.get("/get-account-operation-all", {
    params,
  });
};


export const getRiskManagementAll = (params) => {
  return API.get("/risk-management", {
    params,
  });
};

// export const getBankingAgentListAll = (params) => {
//   return API.get("/Banking-agent-list", {
//     params,
//   });
// };



export const getBankingAgentListAll = (payload) => {
  return API.post("/Banking-agent-list", payload);
};


export const submitMultipleTransactionsAgents = (payload) => {
  return API.post("/banking/multiple-transactions", payload);
};



// export const getAgentsBankingAllLogs = (payload) => {
//   return API.post("/get-Statement-Agent", payload);
// };

// export const getAgentsWiseBankingLogs = (payload) => {
//   return API.post("/get-Statement-all-Agent-list", payload);
// };


export const getAgentsWiseBankingLogs = (payload) => {
  return API.post("/get-Statement-Agent", payload);
};

export const getAgentsBankingAllLogs = (payload) => {
  return API.post("/get-Statement-all-Agent-list", payload);
};

export const getAgentsSettlementList = (payload) => {
  return API.get("/settlement-list", payload);
};



export const submitBankingAgentLenaDena = (payload) => {
  return API.post("/settlement-payment", payload);
};














export const getBetListLiveUserWais = (params) => {
  return API.get("/get-Bet-List-live-User-Wais", {
    params,
  });
};


export const getBetHistoryUserPlReport = (params) => {
  return API.get("/bet-history-user-pl-report", {
    params,
  });
};


export const getBettingProfitLoss = (params) => {
  return API.get("/betting-profit-loss", {
    params,
  });
};


export const getBettingProfitLossDetail = (params) => {
  return API.get("/betting-profit-loss-detail", {
    params,
  });
};











export const getBetListlive = (params) => {
  return API.get("/get-Bet-List-live", {
    params,
  });
};








export const getAgentTransfertouser = (payload) => {
  return API.post("/transfer-User", payload)
};


export const getUsersByAgent = (payload) => {
  return API.post("/getUsersByAgent", payload)
};






export const getallsettledfancybetshistory = (payload) => {
  return API.post("/match-profit-loss", payload)
};


// user exposer

export const getUserExposure = (payload) =>
  API.post("/get-user-exposure", payload);

export const getUserSettledBets = (payload) =>
  API.post("/get-user-settled-bets", payload);


export const CompleteGameSessionPL = (payload) =>
  API.post("/complete-game-session-pl", payload);



/// InPlay game Session Api


export const InPlayGetmatchbetPending = (payload) =>
  API.post("/get-match-bets-pending", payload);

export const InPlayGetSessionbetPending = (payload) =>
  API.post("/get-session-bets-pending", payload);




// Payin Gateway Settings APIs
export const getAllPayingatewaySettings = (pay_type) => {
  return API.post(`/getAllPayingatewaySettings/`, { pay_type });
};

export const createPayingatewaySettings = (data) => {
  return API.post("/createPayingatewaySettings", data, {
    headers: {
      'Content-Type': 'multipart/form-data', // FormData ke liye
    }
  });
};



// export const getPayingatewaySetting = (params) => {
//   return API.get("/getPayingatewaySetting", {
//     params,
//   });
// };

export const getPayingatewaySetting = (id) => {
  return API.get(`/getPayingatewaySetting/${id}`);
};



// export const deletePayingatewaySettings = (params) => {
//   return API.delete("/deletePayingatewaySettings", {
//     params,
//   });
// };

// Delete - PATH parameter with ID
export const deletePayingatewaySettings = (id) => {
  return API.delete(`/deletePayingatewaySettings/${id}`);
};

// export const getPayingatewaySettingsByType = (params) => {
//   return API.get("/getPayingatewaySettingsByType", {
//     params,
//   });
// };

// Get by Type - PATH parameter
export const getPayingatewaySettingsByType = (type) => {
  return API.get(`/getPayingatewaySettingsByType/${type}`);
};





// API function
// export const updatePayingatewaySettings = (data) => {
//   return API.post(`/updatePayingatewaySettings`, data, {
//     headers: { 'Content-Type': 'multipart/form-data' }
//   });
// };

// Update - PATH parameter with ID
export const updatePayingatewaySettings = (data, id) => {
  return API.post(`/updatePayingatewaySettings/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};



export const changePayingatewaySettingsStatus = (id, status) => {
  return API.post(`/changePayingatewaySettingsStatus`, { id, status });
};
export const updatePayingatewaySettingsDetails = (id, data) => {
  return API.post(`/updatePayingatewaySettingsDetails/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data', // FormData ke liye
    }
  });
};


export const getDashboardSummary = () => API.get('/dashboard/summary');




export const CreateAgentAdmin = (payload) => {
  return API.post(`/create-agent-admin`, payload);
};


export const CreateUserAdmin = (payload) => {
  return API.post(`/create-user-admin`, payload);
};


export const BetBlockUnblock = (payload) => {
  return API.post(`/bet-block-unblock`, payload);
};


export const GetAgentMarketList = (payload) => {
  return API.post(`/get-agent-market-list`, payload);
};


export const AgentMarketStatusUpdate = (payload) => {
  return API.post(`/agent-market-status-update`, payload);
};














