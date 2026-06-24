import React from "react";
import { useParams } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Layout from "./Layout/Layout";
import GaneRuleModal from "./Layout/GaneRuleModal";
import Login from "./User/Login";
import Userchat from "./User/Userchat";
import Chatclose from "./User/Chatclose";
import Dashboard from "./Pages/Dashboard";
import CommisssionReport from "./Pages/CommisssionReport";
import Commissionhistory from "./Pages/Commissionhistory";
import Clients_SessionPL from "./Pages/Clients_SessionPL";
import MatchStats from "./Pages/MatchStats";
import CompletedSessions from "./Pages/CompletedSessions";
import Fakedata from "./Pages/Fakedata";

import Events from "./Pages/Events";
import Adminchat from "./Pages/AdminChat/AdminPanel.js";
// import AdminchattingPage from "./Pages/AdminChat/AdminchattingPage";
import HomeDashboard from "./Pages/HomeDashboard";
import CreateUser from "./Pages/User/CreateUser";
import Profit_Loss from "./Pages/leger/Profit_Loss";
import My_Ledger from "./Pages/leger/My_Ledger";
import Client_Ledger from "./Pages/leger/Client_Ledger";
import Client_user from "./Pages/leger/Client_user";
import CompletedGames from "./Pages/SportsBetting/CompletedGames";
import InplayGames from "./Pages/SportsBetting/InplayGames";
import Agent_master_lager from "./Pages/leger/Agent_master_lager.jsx";
import Superagenttransaction from "./Pages/transaction/Superagenttransaction";
import Superagenttransactiondelet from "./Pages/transaction/Superagenttransactiondelet";
import Usertransaction from "./Pages/transaction/Usertransaction";
import Agenttransaction from "./Pages/transaction/Agenttransaction";
import Report from "./Pages/transaction/Report";
import Client_user_list from "./Pages/transaction/Client_user";
import EditUser from "./Pages/User/EditUser";
import UserNote from "./Pages/User/UserNote.jsx";
import NotesList from "./Pages/User/UserNoteList.jsx";
import LoginHistory from "./Pages/User/loginHistory";
import UsersWalletBalance from "./Pages/User/UsersWalletBalance";
import UsersList from "./Pages/User/UsersList";
import ActiveUsersList from "./Pages/User/ActiveUsersList";
import DeletedUsers from "./Pages/User/DeletedUsers.jsx";
import InactiveUsersList from "./Pages/User/InactiveUsersList";
import LoginUsersList from "./Pages/User/LoginUsersList";
import Pending from "./Pages/Withdrawal/Pending";
import Complete from "./Pages/Withdrawal/Complete";
import MatchBet from "./Pages/SportsBetting/MatchBet.jsx";
 import SessionBet from "./Pages/SportsBetting/SessionBet.jsx";
 import Cancelhistory from "./Pages/SportsBetting/Cancelhistory.jsx";
 import Completedsession from "./Pages/SportsBetting/Completedsession.jsx";
 import MatchSessionall from "./Pages/SportsBetting/MatchSessionall.jsx";
 import Getsession from "./Pages/SportsBetting/Getsession.jsx";
 import Matchbetspending from "./Pages/SportsBetting/Matchbetspending.jsx";

import Reject from "./Pages/Withdrawal/Reject";
import WithdrawalDateWiseLists from "./Pages/Withdrawal/WithdrawalDateWiseLists";
import AdminWithdrawalDateWiseLists from "./Pages/Withdrawal/AdminWithdrawalDateWiseLists";
import WithdrawalDateWiseDetailPage from "./Pages/Withdrawal/WithdrawalDateWiseDetailPage";
import AdminWithdrawalDateWiseDetailPage from "./Pages/Withdrawal/AdminWithdrawalDateWiseDetailPage";
import WithdrawPendingApporve from "./Pages/Withdrawal/withdrawPendingApporve";
import Ledger from "./Pages/Withdrawal/Ledger";
import BetHistoryUserwaise from "./Pages/BetHistory/betHistoryUserwaise";
import DeclareResult from "./Pages/DeclareResult/MainMarket";
import KingJackPortMarketDeclare from "./Pages/DeclareResult/KingJackPortMarket";
import Banners from "./Pages/Banners/Banners";
import AppSetting from "./Pages/AppSettings/AppSetting";
import Searchlient from "./Pages/AppSettings/Searchlient";
import Statement from "./Pages/AppSettings/Statement";
import Profitlosspage from "./Pages/AppSettings/Profitlosspage";
import AccountOperation from "./Pages/AppSettings/AccountOperation";
import ColorSetting from "./Pages/AppSettings/ColorSetting";
import VideoList from "./Pages/AppSettings/VideoList";
import IdeaSubmitList from "./Pages/AppSettings/IdeaSubmitList";
import Slider from "./Pages/AppSettings/Slider";
import BetHistory from "./Pages/BetHistory/Pending";
import BetHistorySuccess from "./Pages/BetHistory/Success";
import GameLoadBetLossLists from "./Pages/BetHistory/GameLoadBetLossLists";
import GameReportDateWiseLists from "./Pages/BetHistory/GameReportDateWiseLists";
import GameReportDateWiseDetailsPage from "./Pages/BetHistory/GameReportDateWiseDetailsPage";
import GameReportMarketIdWaise from "./Pages/BetHistory/GameReportMarketIdWaise";
import GameReportMarketIdAndMarketTypeAll from "./Pages/BetHistory/GameReportMarketIdAndMarketTypeAll";
import SendNotification from "./Pages/AppSettings/SendNotification";
import BankAccountPending from "./Pages/BankAccounts/Pending";
import BankAccountComplete from "./Pages/BankAccounts/Complete";
import BankAccountReject from "./Pages/BankAccounts/Reject";
import DepositPending from "./Pages/Deposits/Pending";
import DepositComplete from "./Pages/Deposits/Complete";
import DepositReject from "./Pages/Deposits/Reject";
import DepositDateWiseLists from "./Pages/Deposits/DepositDateWiseLists";
import AdminDepositDateWiseLists from "./Pages/Deposits/AdminDepositDateWiseLists";
import DepositDateWiseDetailPage from "./Pages/Deposits/DepositDateWiseDetailPage";
import AdminDepositDateWiseDetailPage from "./Pages/Deposits/AdminDepositDateWiseDetailPage";
import AdminDepositLists from "./Pages/Deposits/AdminDepositLists.jsx";
import DepositGatewayWiseAll from "./Pages/Deposits/DepositGatewayWiseAll";
import AdminWithdrawalLists from "./Pages/Withdrawal/AdminWithdrawalLists.jsx";
import AllGameList from "./Pages/GameList/AllGameList";
import Cricket from "./Pages/GameList/Cricket";
import ViewEvent from "./Pages/GameList/ViewEvent";
import ViewMarket from "./Pages/GameList/ViewMarket.js";
import InActiveEvents from "./Pages/EventManagment/InActiveEvents ";
import ActiveEvents from "./Pages/EventManagment/ActiveEvents";
import CompletedEvents from "./Pages/EventManagment/CompletedEvents";
import FancyManagment from "./Pages/FancyManagment/FancyManagment";
import FancyResult from "./Pages/FancyManagment/FancyResult.js";
import FancyList from "./Pages/FancyManagment/FancyList.js";
import ViewMatch from "./Pages/FancyManagment/ViewMatch";
import UserWalletBalance from "./Pages/User/UsersWalletBalance";
// import DepositReport from "./Pages/Deposits/DepositDateWiseLists";
import WithdrowReport from "./Pages/Withdrawal/WithdrawalDateWiseLists";
import AllBets from "./Pages/BetManagment/AllBets.jsx"
import PendingBet from "./Pages/BetManagment/PendingBet.jsx"
import SuccessBet from "./Pages/BetManagment/SuccessBet.jsx"
import SubAdminPage from "./Pages/SubAdmin/SubAdminPage.jsx";
import SubAdminPermissionList from "./Pages/SubAdmin/SubAdminPermissionList.jsx";
import { ProtectedRoute } from "./Utils/Permissions.js";
import Scannersetting from "./Pages/AppSettings/Scannersetting";
import AgentMaster from "./agent/AgentMaster";
import Inactivelist from "./agent/Inactivelist";
import Inactivelist_user from "./myuser/Inactivelist";
import Inactivelist_agent from "./super/Inactivelist";
import Blocklist from "./agent/Blocklist";
import Blocklist_user from "./myuser/Blocklist";
import Blocklist_agent  from "./super/Blocklist";
import AgentMasternew from "./super/AgentMaster";
import Mastermyuser from "./myuser/AgentMaster";
import Exposeruser from "./myuser/Exposeruser";
import CreateAgent from "./agent/Createagent";
import CreateAgentnew from "./super/Createagent";
import CreateAgentmyuser from "./myuser/Createagent";
import Superagentadminview from "./agent/Superagentadminview";
import Accountoperation from "./agent/Accountoperation";
import Accountoperationsuper from "./super/Accountoperation";
import Accountoperationmyuser from "./myuser/Accountoperation";
import Updatesuperagent from "./agent/Updatesuperagent";
import Updatesuperagentnew from "./super/Updatesuperagent";
import Updatesuperagentmyuser from "./myuser/Updatesuperagent";
import Agentupdate from "./agent/Agentupdate";
import Statementmasterlist from "./agent/Statementmasterlist";
import Profitloss from "./agent/Profitloss";
import Statementmasterlistnew from "./super/Statementmasterlist";
import Statementmasterlistmyuser from "./myuser/Statementmasterlist";
import Clientmasternew from "./super/Clientmaster";
import Clientmastermyuser from "./myuser/Clientmaster";
import Rules from "./Layout/Rules.jsx";


// const ROUTE_PERMISSION_MAP = {
//   "/homedashboard": "homedashboard",
//   "/dashboard": "dashboard",
//   "/adminchat": "adminchat",
//   "/adminchat/adminchat-view": "adminchat",
//   "/create_user": "create_user",
//   "/edituser/:id": "edit_user",
//   "/all_users": "all_users",
//   "/active_users": "active_users",
//   "/inactive_users": "inactive_users",
//   "/user-Note/:user_id": "user_notes",
//   "/user-NoteList": "user_notes",
//   "/user/login-user-list": "login_users",
//   "/withdrawal_pending": "withdrawal_pending",
//   "/withdrawal_complete": "withdrawal_complete",
//   "/withdrawal_reject": "withdrawal_reject",
//   "/withdrawal_report_datewise": "withdrawal_reports",
//   "/admin_withdrawal_report_datewise": "withdrawal_reports",
//   "/withdrawal_datewise_details/:date": "withdrawal_reports",
//   "/admin_withdrawal_datewise_details/:date": "withdrawal_reports",
//   "/bank_account_pending": "bank_accounts",
//   "/bank_account_complete": "bank_accounts",
//   "/bank_account_reject": "bank_accounts",
//   "/deposite_pending": "deposit_pending",
//   "/deposite_complete": "deposit_complete",
//   "/deposite_reject": "deposit_reject",
//   "/deposite_report_datewise": "deposit_reports",
//   "/admin_deposite_report_datewise": "deposit_reports",
//   "/deposit_detail/:date": "deposit_reports",
//   "/admin_deposit_detail/:date": "deposit_reports",
//   "/deposit_list_report_getway_wise_all": "deposit_reports",
//   "/bet_history_pending": "bet_history",
//   "/bet_history_success": "bet_history",
//   "/all_bets_lists": "all_bets",
//   "/game_load_bet_loss_lists": "game_reports",
//   "/game_report_datewise": "game_reports",
//   "/game_report_marketTypewaise/:date": "game_reports",
//   "/game_report_marketIdwaise/:markettypeURL": "game_reports",
//   "/game_report_marketIdAndMarketTypeAll/": "game_reports",
//   "/declare_main": "declare_main",
//   "/declare_king_jack": "declare_king_jack",
//   "/config": "app_settings",
//   "/color_lists": "color_settings",
//   "/video_lists": "video_management",
//   "/withdrawal_pending_Approve": "withdrawal_approve",
//   "/Ledger/:userid": "ledger",
//   "/bet_history_userwaise/:userid": "user_bet_history",
//   "/login_history/:userid": "login_history",
//   "/idea_submit_lists": "idea_management",
//   "/slider_lists": "slider_management",
//   "/notification/notification-list": "notification_management",
//   "/sports": "sports_management",
//   "/cricket": "cricket_management",
//   "/view_event/:matchId": "event_management",
//   "/inActive_events": "event_management",
//   "/active_events": "event_management",
//   "/complete_events": "event_management",
//   "/fancy_Managment": "fancy_management",
//   "/view_match/:matchId": "fancy_management",
//   "/view_fancy/:eventId": "fancy_management",
//   "/view_result/:eventId": "fancy_management",
//   "/userwallet/:id": "user_wallet",
//   "/admin_deposit_lists": "admin_deposits",
//   "/admin_withdrow_lists": "admin_withdrawals",
//   "/sub_admin": "subadmin_management",
//   "/sub_admin-permission-list/:id": "subadmin_permissions"
// };

const App = () => {
  //   const [isLoading, setIsLoading] = useState(true);
  //   const [permissions, setPermissions] = useState([]);
  //   const encryptedUserType = localStorage.getItem("userType");
  // const params = useParams();

  const token = localStorage.getItem("token");
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (!token || !isLoggedIn) {
    return (

      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

  // ✅ Get user type from localStorage
  // const userType = {
  //   type: localStorage.getItem("userType") || "admin"
  // };

  // // ✅ Permission check function
  // const hasPermission = (path) => {
  //   if (userType.type === "tech_admin" || userType.type === "admin") {
  //     return true;
  //   }
  //   if (userType.type === "subadmin") {
  //     const userPermissions = JSON.parse(localStorage.getItem("permissions") || "[]");
  //     const requiredPermission = ROUTE_PERMISSION_MAP[path]; 
  //     return userPermissions.includes(requiredPermission) || 
  //            userPermissions.includes("*") || 
  //            userPermissions.includes("all_access");
  //   }

  //   return false;
  // };

  // ✅ Protected Route Component
  // const ProtectedRoute = ({ element: Element, path }) => {
  //   const token = localStorage.getItem("token");
  //   const isLoggedIn = localStorage.getItem("isLoggedIn");
  //   if (!token || !isLoggedIn) {
  //   return <Navigate to="/login" replace />;
  // }



  //   if (!hasPermission(path)) {
  //     return <Navigate to="/unauthorized" replace />;
  //   }

  //   return (
  //     <Layout userType={userType}>
  //       <Element  {...params} />
  //     </Layout>
  //   );
  // };
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/userchat" element={<Userchat />} />
        <Route path="/Chatclose" element={<Chatclose />} />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        {/* <Route
          path="/homedashboard"
          element={<ProtectedRoute element={HomeDashboard} path="/homedashboard" />}
        /> */}

        <Route
          path="/dashboard"
          element={<ProtectedRoute element={Dashboard} path="/dashboard" />}
        />

        <Route
          path="/CommisssionReport"
          element={<ProtectedRoute element={CommisssionReport} path="/CommisssionReport" />}
        />
        <Route
          path="/Commissionhistory"
          element={<ProtectedRoute element={Commissionhistory} path="/Commissionhistory" />}
        />
        {/* <Route
          path="/Events"
          element={<ProtectedRoute element={Events} path="/Events" />}
        /> */}

          {/* <Route
            path="/Events/series_idd/:series_idd/event_id/:event_id"
            element={<div className="margin-top-80"><Navbar/><Events /></div>}
          /> */}

        <Route
          path="/Events/series_idd/:series_idd/event_id/:event_id"
          element={<ProtectedRoute element={Events} path="/Events" />}
        />
        <Route
          path="/agent_master"
          element={<ProtectedRoute element={AgentMaster} path="/agent_master" />}
        />
        <Route
          path="/Clients_SessionPL"
          element={<ProtectedRoute element={Clients_SessionPL} path="/Clients_SessionPL" />}
        />
        <Route
          path="/MatchStats"
          element={<ProtectedRoute element={MatchStats} path="/MatchStats" />}
        />
        <Route
          path="/GaneRuleModal"
          element={<ProtectedRoute element={GaneRuleModal} path="/GaneRuleModal" />}
        />
        <Route
          path="/CompletedSessions"
          element={<ProtectedRoute element={CompletedSessions} path="/CompletedSessions" />}
        />
        <Route
          path="/Fakedata"
          element={<ProtectedRoute element={Fakedata} path="/Fakedata" />}
        />
        <Route
          path="/Inactivelist"
          element={<ProtectedRoute element={Inactivelist} path="/Inactivelist" />}
        />
        <Route
          path="/Inactivelist_user"
          element={<ProtectedRoute element={Inactivelist_user} path="/Inactivelist_user" />}
        />
        <Route
          path="/Blocklist_user"
          element={<ProtectedRoute element={Blocklist_user} path="/Blocklist_user" />}
        />
        <Route
          path="/Inactivelist_agent"
          element={<ProtectedRoute element={Inactivelist_agent} path="/Inactivelist_agent" />}
        />
        <Route
          path="/Blocklist_agent"
          element={<ProtectedRoute element={Blocklist_agent} path="/Blocklist_agent" />}
        />
        <Route
          path="/Blocklist"
          element={<ProtectedRoute element={Blocklist} path="/Blocklist" />}
        />
        <Route
          path="/AgentMasternew"
          element={<ProtectedRoute element={AgentMasternew} path="/AgentMasternew" />}
        />
        <Route
          path="/Mastermyuser"
          element={<ProtectedRoute element={Mastermyuser} path="/Mastermyuser" />}
        />

        <Route
          path="/createagent"
          element={<ProtectedRoute element={CreateAgent} path="/createagent" />}
        />
        <Route
          path="/Clientmasternew"
          element={<ProtectedRoute element={Clientmasternew} path="/Clientmasternew" />}
        />
        <Route
          path="/Clientmastermyuser"
          element={<ProtectedRoute element={Clientmastermyuser} path="/Clientmastermyuser" />}
        />

        <Route
          path="/CreateAgentnew/:id"
          element={
            <ProtectedRoute
              element={CreateAgentnew}
              path="/CreateAgentnew/:id"
            />
          }
        />
        <Route
          path="/Exposeruser"
          element={
            <ProtectedRoute
              element={Exposeruser}
              path="/Exposeruser"
            />
          }
        />
        <Route
          path="/CreateAgentmyuser/:id"
          element={
            <ProtectedRoute
              element={CreateAgentmyuser}
              path="/CreateAgentmyuser/:id"
            />
          }
        />
        {/* <Route
          path="/Superagentadminview"
          element={<ProtectedRoute element={Superagentadminview} path="/Superagentadminview" />}
        /> */}

        <Route
          path="/Superagentadminview/:id"
          element={
            <ProtectedRoute
              element={Superagentadminview}
              path="/Superagentadminview/:id"
            />
          }
        />
        <Route
          path="/Accountoperation/:id"
          element={
            <ProtectedRoute
              element={Accountoperation}
              path="/Accountoperation/:id"
            />
          }
        />
        <Route
          path="/Accountoperationsuper/:id"
          element={
            <ProtectedRoute
              element={Accountoperationsuper}
              path="/Accountoperationsuper/:id"
            />
          }
        />
        <Route
          path="/Accountoperationmyuser/:id"
          element={
            <ProtectedRoute
              element={Accountoperationmyuser}
              path="/Accountoperationmyuser/:id"
            />
          }
        />
        <Route path="/GaneRuleModal" element={<GaneRuleModal />} />

        <Route
          path="/Updatesuperagent/:id"
          element={
            <ProtectedRoute
              element={Updatesuperagent}
              path="/Updatesuperagent/:id"
            />
          }
        />
        <Route
          path="/Updatesuperagentnew/:id"
          element={
            <ProtectedRoute
              element={Updatesuperagentnew}
              path="/Updatesuperagentnew/:id"
            />
          }
        />
        <Route
          path="/Updatesuperagentmyuser/:id"
          element={
            <ProtectedRoute
              element={Updatesuperagentmyuser}
              path="/Updatesuperagentmyuser/:id"
            />
          }



        />
        <Route
          path="/Statementmasterlist/:adminId"  // :adminId use करें
          element={
            <ProtectedRoute
              element={Statementmasterlist}
              path="/Statementmasterlist/:adminId"
            />
          }
        />
        <Route
          path="/Profitloss"  // :adminId use करें
          element={
            <ProtectedRoute
              element={Profitloss}
              path="/Profitloss"
            />
          }
        />
        <Route
          path="/Statementmasterlistnew/:adminId"  // :adminId use करें
          element={
            <ProtectedRoute
              element={Statementmasterlistnew}
              path="/Statementmasterlistnew/:adminId"
            />
          }
        />
        <Route
          path="/Statementmasterlistmyuser/:adminId"  // :adminId use करें
          element={
            <ProtectedRoute
              element={Statementmasterlistmyuser}
              path="/Statementmasterlistmyuser/:adminId"
            />
          }
        />

        <Route
          path="/rules"
          element={<ProtectedRoute element={Rules} path="/rules" />}
        />
        <Route
          path="/agentupdate"
          element={<ProtectedRoute element={Agentupdate} path="/agentupdate" />}
        />

        <Route
          path="/adminchat"
          element={<ProtectedRoute element={Adminchat} path="/adminchat" />}
        />

        {/* <Route 
          path="/adminchat/adminchat-view" 
          element={<ProtectedRoute element={AdminchattingPage} path="/adminchat/adminchat-view" />} 
        /> */}

        <Route
          path="/create_user"
          element={<ProtectedRoute element={CreateUser} path="/Profit_Loss" />}
        />
        <Route
          path="/Profit_Loss"
          element={<ProtectedRoute element={Profit_Loss} path="/create_user" />}
        />
        <Route
          path="/My_Ledger"
          element={<ProtectedRoute element={My_Ledger} path="/My_Ledger" />}
        />
        <Route
          path="/Client_Ledger"
          element={<ProtectedRoute element={Client_Ledger} path="/Client_Ledger" />}
        />
        <Route
          path="/Client_user"
          element={<ProtectedRoute element={Client_user} path="/Client_user" />}
        />

        <Route
          path="/CompletedGames"
          element={<ProtectedRoute element={CompletedGames} path="/CompletedGames" />}
        />
        <Route
          path="/InplayGames"
          element={<ProtectedRoute element={InplayGames} path="/InplayGames" />}
        />
        <Route
          path="/agent_master_lager"
          element={<ProtectedRoute element={Agent_master_lager} path="/agent_master_lager" />}
        />
        <Route
          path="/Superagenttransaction"
          element={<ProtectedRoute element={Superagenttransaction} path="/Superagenttransaction" />}
        />
        <Route
          path="/Usertransaction"
          element={<ProtectedRoute element={Usertransaction} path="/Usertransaction" />}
        />
        <Route
          path="/Agenttransaction"
          element={<ProtectedRoute element={Agenttransaction} path="/Agenttransaction" />}
        />
        <Route
          path="/Report"
          element={<ProtectedRoute element={Report} path="/Report" />}
        />

        <Route
          path="/edituser/:id"
          element={<ProtectedRoute element={EditUser} path="/edituser/:id" />}
        />
        <Route
          path="/Superagenttransactiondelet"
          element={<ProtectedRoute element={Superagenttransactiondelet} path="/Superagenttransactiondelet" />}
        />
        <Route
          path="/Client_user_list"
          element={<ProtectedRoute element={Client_user_list} path="/Client_user_list" />}
        />

        <Route
          path="/all_users"
          element={<ProtectedRoute element={UsersList} path="/all_users" />}
        />

        <Route
          path="/active_users"
          element={<ProtectedRoute element={ActiveUsersList} path="/active_users" />}
        />

        <Route
          path="/inactive_users"
          element={<ProtectedRoute element={InactiveUsersList} path="/inactive_users" />}
        />

        <Route
          path="/user-Note/:user_id"
          element={<ProtectedRoute element={UserNote} path="/user-Note/:user_id" />}
        />
        <Route
          path="/deleted-userlist"
          element={<ProtectedRoute element={DeletedUsers} path="/deleted-userlist" />}
        />


        <Route
          path="/user-NoteList"
          element={<ProtectedRoute element={NotesList} path="/user-NoteList" />}
        />

        <Route
          path="/user/login-user-list"
          element={<ProtectedRoute element={LoginUsersList} path="/user/login-user-list" />}
        />

        <Route
          path="/withdrawal_pending"
          element={<ProtectedRoute element={Pending} path="/withdrawal_pending" />}
        />

        <Route
          path="/withdrawal_complete"
          element={<ProtectedRoute element={Complete} path="/withdrawal_complete" />}
        />

        <Route
          path="/withdrawal_reject"
          element={<ProtectedRoute element={Reject} path="/withdrawal_reject" />}
        />

        <Route
          path="/withdrawal_report_datewise"
          element={<ProtectedRoute element={WithdrawalDateWiseLists} path="/withdrawal_report_datewise" />}
        />

        <Route
          path="/admin_withdrawal_report_datewise"
          element={<ProtectedRoute element={AdminWithdrawalDateWiseLists} path="/admin_withdrawal_report_datewise" />}
        />

        <Route
          path="/withdrawal_datewise_details/:date"
          element={<ProtectedRoute element={WithdrawalDateWiseDetailPage} path="/withdrawal_datewise_details/:date" />}
        />

        <Route
          path="/admin_withdrawal_datewise_details/:date"
          element={<ProtectedRoute element={AdminWithdrawalDateWiseDetailPage} path="/admin_withdrawal_datewise_details/:date" />}
        />

        <Route
          path="/bank_account_pending"
          element={<ProtectedRoute element={BankAccountPending} path="/bank_account_pending" />}
        />

        <Route
          path="/bank_account_complete"
          element={<ProtectedRoute element={BankAccountComplete} path="/bank_account_complete" />}
        />

        <Route
          path="/bank_account_reject"
          element={<ProtectedRoute element={BankAccountReject} path="/bank_account_reject" />}
        />

        <Route
          path="/deposite_pending"
          element={<ProtectedRoute element={DepositPending} path="/deposite_pending" />}
        />

        <Route
          path="/deposite_complete"
          element={<ProtectedRoute element={DepositComplete} path="/deposite_complete" />}
        />
        <Route
          path="/deposite_reject"
          element={<ProtectedRoute element={DepositReject} path="/deposite_reject" />}
        />
        <Route
          path="/deposite_report_datewise"
          element={<ProtectedRoute element={DepositDateWiseLists} path="/deposite_report_datewise" />}
        />

        <Route
          path="/admin_deposite_report_datewise"
          element={<ProtectedRoute element={AdminDepositDateWiseLists} path="/admin_deposite_report_datewise" />}
        />

        <Route
          path="/deposit_detail/:date"
          element={<ProtectedRoute element={DepositDateWiseDetailPage} path="/deposit_detail/:date" />}
        />

        <Route
          path="/admin_deposit_detail/:date"
          element={<ProtectedRoute element={AdminDepositDateWiseDetailPage} path="/admin_deposit_detail/:date" />}
        />

        <Route
          path="/deposit_list_report_getway_wise_all"
          element={<ProtectedRoute element={DepositGatewayWiseAll} path="/deposit_list_report_getway_wise_all" />}
        />

        <Route
          path="/bet_history_pending"
          element={<ProtectedRoute element={BetHistory} path="/bet_history_pending" />}
        />

        <Route
          path="/bet_history_success"
          element={<ProtectedRoute element={BetHistorySuccess} path="/bet_history_success" />}
        />

        <Route
          path="/all_bets_lists"
          element={<ProtectedRoute element={AllBets} path="/all_bets_lists" />}
        />
        <Route
          path="/pending_bets_lists"
          element={<ProtectedRoute element={PendingBet} path="/pending_bets_lists" />}
        />
        <Route
          path="/success_bets_lists"
          element={<ProtectedRoute element={SuccessBet} path="/success_bets_lists" />}
        />

        <Route
          path="/game_load_bet_loss_lists"
          element={<ProtectedRoute element={GameLoadBetLossLists} path="/game_load_bet_loss_lists" />}
        />

        <Route
          path="/game_report_datewise"
          element={<ProtectedRoute element={GameReportDateWiseLists} path="/game_report_datewise" />}
        />

        <Route
          path="/game_report_marketTypewaise/:date"
          element={<ProtectedRoute element={GameReportDateWiseDetailsPage} path="/game_report_marketTypewaise/:date" />}
        />

        <Route
          path="/game_report_marketIdwaise/:markettypeURL"
          element={<ProtectedRoute element={GameReportMarketIdWaise} path="/game_report_marketIdwaise/:markettypeURL" />}
        />

        <Route
          path="/game_report_marketIdAndMarketTypeAll/"
          element={<ProtectedRoute element={GameReportMarketIdAndMarketTypeAll} path="/game_report_marketIdAndMarketTypeAll/" />}
        />

        <Route
          path="/declare_result"
          element={<ProtectedRoute element={DeclareResult} path="/declare_main" />}
        />

        <Route
          path="/declare_king_jack"
          element={<ProtectedRoute element={KingJackPortMarketDeclare} path="/declare_king_jack" />}
        />

        <Route
          path="/setting"
          element={<ProtectedRoute element={AppSetting} path="/config" />}
        />
        <Route
          path="/Searchlient"
          element={<ProtectedRoute element={Searchlient} path="/config" />}
        />
        <Route
          path="/Statement"
          element={<ProtectedRoute element={Statement} path="/Statement" />}
        />
        <Route
          path="/Profitlosspage"
          element={<ProtectedRoute element={Profitlosspage} path="/Profitlosspage" />}
        />
        <Route
          path="/AccountOperation"
          element={<ProtectedRoute element={AccountOperation} path="/AccountOperation" />}
        />


<Route
          path="/match_bet/:event_id"
          element={
            <ProtectedRoute
              element={MatchBet}
              path="/match_bet"
            />
          }
        />
        <Route
          path="/session_bet/:event_id"
          element={
            <ProtectedRoute
              element={SessionBet}
              path="/session_bet"
            />
          }
        />
        <Route
          path="/Cancelhistory/:event_id"
          element={
            <ProtectedRoute
              element={Cancelhistory}
              path="/Cancelhistory"
            />
          }
        />
        <Route
          path="/Completedsession/:event_id"
          element={
            <ProtectedRoute
              element={Completedsession}
              path="/Completedsession"
            />
          }
        />
        <Route
          path="/MatchSessionall/:event_id"
          element={
            <ProtectedRoute
              element={MatchSessionall}
              path="/MatchSessionall"
            />
          }
        />
        <Route
          path="/Getsession/:event_id"
          element={
            <ProtectedRoute
              element={Getsession}
              path="/Getsession"
            />
          }
        />
        <Route
          path="/Matchbetspending/:event_id"
          element={
            <ProtectedRoute
              element={Matchbetspending}
              path="/Matchbetspending"
            />
          }
        />

        <Route
          path="/withdrawal_pending_Approve"
          element={<ProtectedRoute element={WithdrawPendingApporve} path="/withdrawal_pending_Approve" />}
        />

        <Route
          path="/Ledger/:userid"
          element={<ProtectedRoute element={Ledger} path="/Ledger/:userid" />}
        />

        <Route
          path="/bet_history_userwaise/:userid"
          element={<ProtectedRoute element={BetHistoryUserwaise} path="/bet_history_userwaise/:userid" />}
        />

        <Route
          path="/login_history/:userid"
          element={<ProtectedRoute element={LoginHistory} path="/login_history/:userid" />}
        />

        <Route
          path="/idea_submit_lists"
          element={<ProtectedRoute element={IdeaSubmitList} path="/idea_submit_lists" />}
        />

        <Route
          path="/slider_lists"
          element={<ProtectedRoute element={Slider} path="/slider_lists" />}
        />

        <Route
          path="/notification/notification-list"
          element={<ProtectedRoute element={SendNotification} path="/notification/notification-list" />}
        />

        <Route
          path="/sports"
          element={<ProtectedRoute element={AllGameList} path="/sports" />}
        />

        <Route
          path="/cricket"
          element={<ProtectedRoute element={Cricket} path="/cricket" />}
        />

        <Route
          path="/view_event/:matchId"
          element={<ProtectedRoute element={ViewEvent} path="/view_event/:matchId" />}
        />

        <Route
          path="/inActive_events"
          element={<ProtectedRoute element={InActiveEvents} path="/inActive_events" />}
        />

        <Route
          path="/active_events"
          element={<ProtectedRoute element={ActiveEvents} path="/active_events" />}
        />

        <Route
          path="/complete_events"
          element={<ProtectedRoute element={CompletedEvents} path="/complete_events" />}
        />

        <Route
          path="/fancy_Managment"
          element={<ProtectedRoute element={FancyManagment} path="/fancy_Managment" />}
        />

        <Route
          path="/view_match/:matchId"
          element={<ProtectedRoute element={ViewMatch} path="/view_match/:matchId" />}
        />

        <Route
          path="/view_fancy/:eventId"
          element={<ProtectedRoute element={FancyList} path="/view_fancy/:eventId" />}
        />

        <Route
          path="/view_result/:eventId"
          element={<ProtectedRoute element={FancyResult} path="/view_result/:eventId" />}
        />

        <Route
          path="/userwallet/:id"
          element={<ProtectedRoute element={UserWalletBalance} path="/userwallet/:id" />}
        />

        <Route
          path="/admin_deposit_lists"
          element={<ProtectedRoute element={AdminDepositLists} path="/admin_deposit_lists" />}
        />

        <Route
          path="/admin_withdrow_lists"
          element={<ProtectedRoute element={AdminWithdrawalLists} path="/admin_withdrow_lists" />}
        />

        <Route
          path="/sub_admin"
          element={<ProtectedRoute element={SubAdminPage} path="/sub_admin" />}
        />
        <Route
          path="/Scannersetting"
          element={<ProtectedRoute element={Scannersetting} path="/config" />}
        />
        <Route
          path="/sub_admin-permission-list/:id"
          element={<ProtectedRoute element={SubAdminPermissionList} path="/sub_admin-permission-list/:id" />}
        />

        {/* Add unauthorized route */}
        <Route path="/unauthorized" element={<div>Access Denied - You don't have permission to access this page</div>} />

      </Routes>
    </Router>

  );
};

export default App;
