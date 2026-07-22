import React from "react";
import { useParams } from "react-router-dom";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState } from "react";
import Layout from "./Layout/Layout";
import GaneRuleModal from "./Layout/GaneRuleModal";
import Login from "./User/Login";
import Userchat from "./User/Userchat";
import Chatclose from "./User/Chatclose";
import Dashboard from "./Pages/Dashboard";
import ViewmatchAndfancy from "./Pages/viewmatchAndFancy/viewMactch&fancy.jsx"; //for dashboard page
import Adminchat from "./Pages/AdminChat/AdminPanel.js";
// import AdminchattingPage from "./Pages/AdminChat/AdminchattingPage";
import HomeDashboard from "./Pages/HomeDashboard";
import CreateUser from "./Pages/User/CreateUser";
import Superagenttransaction from "./Pages/transaction/Superagenttransaction";
import Superagenttransactiondelet from "./Pages/transaction/Superagenttransactiondelet";
import Usertransaction from "./Pages/transaction/Usertransaction";
import Agenttransaction from "./Pages/transaction/Agenttransaction";
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
import WebSetting from "./Pages/AppSettings/WebSetting.jsx";
import Commissionhistry from "./Pages/AppSettings/Commissionhistry.jsx";
import Commissionreport from "./Pages/AppSettings/Commissionreport.jsx";
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
import ActiveAllGames from "./Pages/ActiveAllGames/ActiveAllGames";
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
import AllBets from "./Pages/BetManagment/AllBets.jsx";
import PendingBet from "./Pages/BetManagment/PendingBet.jsx";
import SuccessBet from "./Pages/BetManagment/SuccessBet.jsx";
import SubAdminPage from "./Pages/SubAdmin/SubAdminPage.jsx";
import SubAdminPermissionList from "./Pages/SubAdmin/SubAdminPermissionList.jsx";
import { ProtectedRoute } from "./Utils/Permissions.js";
import Scannersetting from "./Pages/AppSettings/Scannersetting";
import AgentMaster from "./agent/AgentMaster";
import AgentMasternew from "./super/AgentMaster";
import InActiveAgentList from "./super/InActiveAgentLists.jsx";
import BlockAgentList from "./super/BlockAgentLists.jsx";
import Mastermyuser from "./myuser/AgentMaster";
import InActiveUserList from "./myuser/InActiveUserLists.jsx";
import BlockUserList from "./myuser/BlockUserLists.jsx";
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
import Statementmasterlistnew from "./super/Statementmasterlist";
import Statementmasterlistmyuser from "./myuser/Statementmasterlist";
import Clientmasternew from "./super/Clientmaster";
import BlockSuperAgentList from "./agent/BlockSuperAgentLists.jsx";
import InAvtiveSuperAgentList from "./agent/InActiveSuperAgentLists.jsx";
import Clientmastermyuser from "./myuser/Clientmaster";
import UserExposer from "./myuser/UserExposer.jsx";
//master route
import MastersLists from "./Master/Master.jsx";
import MasterProfitLossStatement from "./Master/MasterProfit&LossStatement.jsx";
import OperationAccount from "./Master/OperationAccount.jsx";
import CreatesuperAgentt from "./Master/CreatesuperAgentt.jsx";
import GetSelectedSuperagentList from "./Master/SlectedMasterLists.jsx";
import BlockedMasterLists from "./Master/BlockedMasterLists.jsx";
import InActiveMasterLists from "./Master/InActiveMasterLists.jsx";
import Mastercreate from "./Master/CreateMaster.jsx";
import SelectMaster from "./Master/Selectmaster.jsx";
// import Superagentadminview from "./Master/Superagentadminview.jsx";
import UpdatMaster from "./Master/UpdateMaster.jsx";
// import Agentupdate from "./Master/Agentupdate.jsx";
// import Statementmasterlist from "./Master/AccountStatement.jsx";
import InPlayGame from "./Pages/SportBetting/InPlay.jsx";
import CompleteGame from "./Pages/SportBetting/CompleteGame.jsx";
import MatchAndSessionPlReport from "./Pages/SportBetting/Match&SessionPlReport.jsx";
import MatchAndSessionPl from "./Pages/SportBetting/Match&SessionPl.jsx";
import MatchBet from "./Pages/SportBetting/MatchBet.jsx";
import SessionBet from "./Pages/SportBetting/SessionBet.jsx";
import RejectedBet from "./Pages/SportBetting/RejectedBet.jsx";
import CompletedSession from "./Pages/SportBetting/CompletedSessions.jsx";
//Inplay Game Route
import InPlayMatchBet from "./Pages/SportBetting/InPlaySession/MatchBet.jsx";
import InPlaySessionBet from "./Pages/SportBetting/InPlaySession/SessionBet.jsx";
import InPlyaRejectedBet from "./Pages/SportBetting/InPlaySession/RejectedBet.jsx";
//ledger route/
import ProfitAndLoss from "./Pages/Ledger/ProfitLoss.js";
import MyProfitAndLoss from "./Pages/Ledger/MyProfitLoss.js";
import MyLedger from "./Pages/Ledger/MyLedger.js";
import MasterLedger from "./Pages/Ledger/MasterLedger.js";


import SuperAgentLedger from "./Pages/Ledger/SuperAgentLedger.js";
import SuperAgentSettlementReport from "./Pages/Ledger/SuperAgentSettlementReport";
import AgentSettlementReport from "./Pages/Ledger/AgentSettlementReport";
import UserSettlementReport from "./Pages/Ledger/UserSettlementReport";
import AgentLedger from "./Pages/Ledger/AgentLedger.js";
import UserLedger from "./Pages/Ledger/UserLedger.js";


//Balance Sheet

import BalanceSuperAgentLedger from "./Pages/BalanceSheet/SuperAgentLedger.js";
import BalanceSuperAgentSettlementReport from "./Pages/BalanceSheet/SuperAgentSettlementReport";
import BalanceAgentSettlementReport from "./Pages/BalanceSheet/AgentSettlementReport";
import BalanceUserSettlementReport from "./Pages/BalanceSheet/UserSettlementReport";
import BalanceAgentLedger from "./Pages/BalanceSheet/AgentLedger.js";
import BalanceUserLedger from "./Pages/BalanceSheet/UserLedger.js";


//transaction
import MasterTransction from "./Pages/transaction/MasterTransaction.js";
import AgentMasterTransction from "./Pages/transaction/MasterTransaction.js";
import CaseTransctionReport from "./Pages/transaction/CaseTransactionReport.jsx";
import CommissionReport from "./Pages/transaction/CommReport.js";
// import CommReportnew from "./Pages/transaction/CommReportnew.js";
import MasterDeletedTransactionList from "./Pages/transaction/MasterDeletedTransaction.js";
import AllAccountOperation from "./Pages/AllStatments/MyAccountOperation.js";
import MyAllStatment from "./Pages/AllStatments/Mystatment.js";
import AllPLStatment from "./Pages/AllStatments/AllPLReport.js";
import fancyResultList from "./Pages/DeclareResult/fancyResultList.jsx";
import ViewfancyResultList from "./Pages/DeclareResult/ViewfancyResultList.jsx";
import AccountStatement from "./Pages/Reports/AccountStatement";
import BetHistoryDetails from "./Pages/Reports/BetHistoryDetails";
import PendingBetHistory from "./Pages/Reports/PendingBetHistory";
import BalanceSheet from "./Pages/Reports/BalanceSheet";
import ChipStatement from "./Pages/Reports/ChipStatement";
import ChipSummary from "./Pages/Reports/ChipSummary";
import ProfitLoss from "./Pages/Reports/ProfitLoss";
import Settlements from "./Pages/Reports/Settlements";
import SettlementReport from "./Pages/Reports/SettlementReport";
import SportSummaryReport from "./Pages/Reports/SportSummaryReport";
import TopClients from "./Pages/Reports/TopClients";
import CasinoManagement from "./Pages/Casino/CasinoProvidersLists";
import MarketAnalysisLists from "./Pages/MarketAnalysis/MarketAnalysisLists";
import MarketAnalysisEventDetail from "./Pages/MarketAnalysis/MarketAnalysisEventDetail";
import MarketAnalysisBetHistory from "./Pages/MarketAnalysis/MarketAnalysisBetHistory";
import BlockedChildLists from "./Pages/BlockedChildLists/BlockedChildLists";
import AgentMasterClone from "./agent/AgentMasterClone";
import Multimarket from "./Pages/Multimarket/Multimarket.jsx";
import CasinoSetting from "./UserWiseSettings/casino-setting";
import ICasinoSetting from "./UserWiseSettings/icasino-setting";
import SportSetting from "./UserWiseSettings/sport-setting";
import UserSetting from "./UserWiseSettings/UserSetting.jsx";

const App = () => {
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
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/userchat" element={<Userchat />} />
        <Route path="/Chatclose" element={<Chatclose />} />

        <Route path="/" element={<Navigate to="/homedashboard" replace />} />
        <Route
          path="/homedashboard"
          element={
            <ProtectedRoute element={HomeDashboard} path="/homedashboard" />
          }
        />

        <Route
          path="/dashboard"
          element={<ProtectedRoute element={Dashboard} path="/dashboard" />}
        />
        <Route
          path="/viewmatch-fancy/series_idd/:series_idd/event_id/:event_id"
          element={
            <ProtectedRoute element={ViewmatchAndfancy} path="/dashboard" />
          }
        />

        {/* master routes */}
        <Route
          path="/masters_list"
          element={
            <ProtectedRoute element={MastersLists} path="/masters_list" />
          }
        />

        <Route
          path="/create-master"
          element={
            <ProtectedRoute element={Mastercreate} path="/create-master" />
          }
        />

        <Route
          path="/master_operation/:id"
          element={
            <ProtectedRoute
              element={OperationAccount}
              path="/master_operation/:id"
            />
          }
        />

        <Route
          path="/Updatemaster/:id"
          element={
            <ProtectedRoute element={UpdatMaster} path="/Updatemaster/:id" />
          }
        />
        <Route
          path="/getSuperAgent-list/:id"
          element={
            <ProtectedRoute
              element={GetSelectedSuperagentList}
              path="/getSuperAgent-list/:id"
            />
          }
        />

        <Route
          path="/SelectSuperagent"
          element={
            <ProtectedRoute element={SelectMaster} path="/SelectSuperagent" />
          }
        />
        <Route
          path="/agent_lists/:adminId?"
          element={<ProtectedRoute element={AgentMaster} path="/agent_lists" />}
        />
        <Route
          path="/block-super-agent-lists"
          element={
            <ProtectedRoute
              element={BlockSuperAgentList}
              path="/Block-super-agent-lists"
            />
          }
        />
        <Route
          path="/inActive-super-agent-lists"
          element={
            <ProtectedRoute
              element={InAvtiveSuperAgentList}
              path="/inActive-super-agent-lists"
            />
          }
        />
        <Route
          path="/AgentMasternew/:adminId?"
          element={
            <ProtectedRoute element={AgentMasternew} path="/AgentMasternew" />
          }
        />
        <Route
          path="/inActive-agent-lists"
          element={
            <ProtectedRoute
              element={InActiveAgentList}
              path="/inActive-agent-lists"
            />
          }
        />
        <Route
          path="/block-agent-list"
          element={
            <ProtectedRoute element={BlockAgentList} path="/block-agent-list" />
          }
        />
        <Route
          path="/Mastermyuser/:adminId?"
          element={
            <ProtectedRoute element={Mastermyuser} path="/Mastermyuser" />
          }
        />
        <Route
          path="/user-exposer"
          element={
            <ProtectedRoute element={UserExposer} path="/user-exposer" />
          }
        />
        <Route
          path="/block-users-lists"
          element={
            <ProtectedRoute element={BlockUserList} path="/block-users-lists" />
          }
        />
        <Route
          path="/inactive-users-lists"
          element={
            <ProtectedRoute
              element={InActiveUserList}
              path="/inactive-users-lists"
            />
          }
        />

        <Route
          path="/createagent"
          element={<ProtectedRoute element={CreateAgent} path="/createagent" />}
        />
        <Route
          path="/Clientmasternew"
          element={
            <ProtectedRoute element={Clientmasternew} path="/Clientmasternew" />
          }
        />
        <Route
          path="/Clientmastermyuser"
          element={
            <ProtectedRoute
              element={Clientmastermyuser}
              path="/Clientmastermyuser"
            />
          }
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
          path="/CreateSuperAgent/:id"
          element={
            <ProtectedRoute
              element={CreatesuperAgentt}
              path="/CreateSuperAgent/:id"
            />
          }
        />
        <Route
          path="/master-transaction/:master_id?"
          element={
            <ProtectedRoute
              element={MasterTransction}
              path="/master-transaction"
            />
          }
        />
        <Route
          path="/case-transaction-report"
          element={
            <ProtectedRoute
              element={CaseTransctionReport}
              path="/master-transaction"
            />
          }
        />
        <Route
          path="/agent_master-deleted-transactions"
          element={
            <ProtectedRoute
              element={MasterDeletedTransactionList}
              path="/agent_master-deleted-transactions"
            />
          }
        />
        <Route
          path="/CommissionReport"
          element={
            <ProtectedRoute
              element={CommissionReport}
              path="/CommissionReport"
            />
          }
        />
        {/* <Route
          path="/master-commisssion-report"
          element={<ProtectedRoute element={CommissionReport} path="/master-commisssion-report" />}
        /> */}
        <Route
          path="/master-blocked-list"
          element={
            <ProtectedRoute
              element={BlockedMasterLists}
              path="/master-blocked-list"
            />
          }
        />
        {/* <Route
          path="/CommReportnew"
          element={<ProtectedRoute element={CommReportnew} path="/CommReportnew" />}
        /> */}
        <Route
          path="/InActive-master-list"
          element={
            <ProtectedRoute
              element={InActiveMasterLists}
              path="/InActive-master-list"
            />
          }
        />
        <Route
          path="/profitloss"
          element={
            <ProtectedRoute element={ProfitAndLoss} path="/profitloss" />
          }
        />
        <Route
          path="/my-profit-loss"
          element={
            <ProtectedRoute element={MyProfitAndLoss} path="/my-profit-loss" />
          }
        />
        <Route
          path="/my-ledger"
          element={<ProtectedRoute element={MyLedger} path="/my-ledger" />}
        />
        <Route
          path="/Master-ledger"
          element={
            <ProtectedRoute element={MasterLedger} path="/Master-ledger" />
          }
        />
        <Route
          path="/super-agent-ledger"
          element={
            <ProtectedRoute
              element={SuperAgentLedger}
              path="/super-agent-ledger"
            />
          }
        />

        <Route
          path="/super-agent-ledger-settlement-report/:admin_id"
          element={
            <ProtectedRoute
              element={SuperAgentSettlementReport}
              path="/super-agent-ledger-settlement-report/:admin_id"
            />
          }
        />

        <Route
          path="/agent-settlement-report/:admin_id"
          element={
            <ProtectedRoute
              element={AgentSettlementReport}
              path="/agent-settlement-report/:admin_id"
            />
          }
        />

        <Route
          path="/user-settlement-report/:admin_id"
          element={
            <ProtectedRoute
              element={UserSettlementReport}
              path="/user-settlement-report/:admin_id"
            />
          }
        />


        <Route
          path="/agent-ledger"
          element={
            <ProtectedRoute element={AgentLedger} path="/agent-ledger" />
          }
        />
        <Route
          path="/user-ledger"
          element={<ProtectedRoute element={UserLedger} path="/user-ledger" />}
        />

  {/* New  Balance Sheets*/}

        <Route
          path="/reports/balance-sheet"
          element={
            <ProtectedRoute
              element={BalanceSuperAgentLedger}
              path="/reports/balance-sheet"
            />
          }
        />

        <Route
          path="/reports/agent-ledger"
          element={
            <ProtectedRoute element={BalanceAgentLedger} path="/reports/agent-ledger" />
          }
        />
        <Route
          path="/reports/user-ledger"
          element={<ProtectedRoute element={BalanceUserLedger} path="/reports/user-ledger" />}
        />

        <Route
          path="/reports/super-agent-ledger-settlement-report/:admin_id"
          element={
            <ProtectedRoute
              element={BalanceSuperAgentSettlementReport}
              path="/reports/super-agent-ledger-settlement-report/:admin_id"
            />
          }
        />

        <Route
          path="/reports/agent-settlement-report/:admin_id"
          element={
            <ProtectedRoute
              element={BalanceAgentSettlementReport}
              path="/reports/agent-settlement-report/:admin_id"
            />
          }
        />

        <Route
          path="/reports/user-settlement-report/:admin_id"
          element={
            <ProtectedRoute
              element={BalanceUserSettlementReport}
              path="/reports/user-settlement-report/:admin_id"
            />
          }
        />




        <Route
          path="/Ledger/:userid"
          element={<ProtectedRoute element={Ledger} path="/Ledger/:userid" />}
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
          path="/getAllAccountOperation"
          element={
            <ProtectedRoute
              element={AllAccountOperation}
              path="/getAllAccountOperation"
            />
          }
        />
        <Route
          path="/getAllstatment"
          element={
            <ProtectedRoute element={MyAllStatment} path="/getAllstatment" />
          }
        />
        <Route
          path="/all-profit-loss-statment"
          element={
            <ProtectedRoute
              element={AllPLStatment}
              path="/all-profit-loss-statment"
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
        {/* Sport Betting Route */}

        <Route
          path="/inplay_game"
          element={<ProtectedRoute element={InPlayGame} path="/inplay_game" />}
        />

        <Route
          path="/completed_game"
          element={
            <ProtectedRoute element={CompleteGame} path="/completed_game" />
          }
        />

        <Route
          path="/match_session_PL_Report/:event_id"
          element={
            <ProtectedRoute
              element={MatchAndSessionPlReport}
              path="/match_session_PL_Report"
            />
          }
        />
        <Route
          path="/match_session_PL/:event_id"
          element={
            <ProtectedRoute
              element={MatchAndSessionPl}
              path="/match_session_PL"
            />
          }
        />
        <Route
          path="/match_bet/:event_id"
          element={<ProtectedRoute element={MatchBet} path="/match_bet" />}
        />
        <Route
          path="/session_bet/:event_id"
          element={<ProtectedRoute element={SessionBet} path="/session_bet" />}
        />
        <Route
          path="/rejected_bet/:event_id"
          element={
            <ProtectedRoute element={RejectedBet} path="/rejected_bet" />
          }
        />
        <Route
          path="/inplay-game-match_bet/:event_id"
          element={
            <ProtectedRoute
              element={InPlayMatchBet}
              path="/inplay-game-match_bet"
            />
          }
        />
        <Route
          path="/inplay-session_bet/:event_id"
          element={
            <ProtectedRoute
              element={InPlaySessionBet}
              path="/inplay-session_bet"
            />
          }
        />
        <Route
          path="/inplay-rejected_bet/:event_id"
          element={
            <ProtectedRoute
              element={InPlyaRejectedBet}
              path="/inplay-rejected_bet"
            />
          }
        />
        <Route
          path="/completed-session/:event_id"
          element={
            <ProtectedRoute
              element={CompletedSession}
              path="/completed-session"
            />
          }
        />
        <Route
          path="/Statementmasterlist/:adminId"
          element={
            <ProtectedRoute
              element={Statementmasterlist}
              path="/Statementmasterlist/:adminId"
            />
          }
        />
        <Route
          path="/Statementmasterlistnew/:adminId"
          element={
            <ProtectedRoute
              element={Statementmasterlistnew}
              path="/Statementmasterlistnew/:adminId"
            />
          }
        />
        <Route
          path="/Statementmasterlistmyuser/:adminId"
          element={
            <ProtectedRoute
              element={Statementmasterlistmyuser}
              path="/Statementmasterlistmyuser/:adminId"
            />
          }
        />
        <Route
          path="/profitandloss/:adminId"
          element={
            <ProtectedRoute
              element={MasterProfitLossStatement}
              path="/profitandloss/:adminId"
            />
          }
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
          path="/CommReportnew"
          element={<ProtectedRoute element={CommReportnew} path="/CommReportnew" />}
        /> */}
        {/* <Route 
          path="/adminchat/adminchat-view" 
          element={<ProtectedRoute element={AdminchattingPage} path="/adminchat/adminchat-view" />} 
        /> */}
        <Route
          path="/create_user"
          element={<ProtectedRoute element={CreateUser} path="/create_user" />}
        />
        {/* <Route
          path="/Superagenttransaction"
          element={<ProtectedRoute element={Superagenttransaction} path="/Superagenttransaction" />}
        /> */}
        <Route
          path="/Superagenttransaction/:master_id?"
          element={
            <ProtectedRoute
              element={Superagenttransaction}
              path="/Superagenttransaction"
            />
          }
        />
        <Route
          path="/master-transaction/:master_id?"
          element={
            <ProtectedRoute
              element={AgentMasterTransction}
              path="/master-transaction"
            />
          }
        />
        <Route
          path="/Usertransaction/:admin_id?"
          element={
            <ProtectedRoute element={Usertransaction} path="/Usertransaction" />
          }
        />
        <Route
          path="/Agenttransaction/:master_id?"
          element={
            <ProtectedRoute
              element={Agenttransaction}
              path="/Agenttransaction"
            />
          }
        />

        <Route
          path="/edituser/:id"
          element={<ProtectedRoute element={EditUser} path="/edituser/:id" />}
        />
        <Route
          path="/Superagenttransactiondelet"
          element={
            <ProtectedRoute
              element={Superagenttransactiondelet}
              path="/Superagenttransactiondelet"
            />
          }
        />

        <Route
          path="/all_users"
          element={<ProtectedRoute element={UsersList} path="/all_users" />}
        />

        <Route
          path="/active_users"
          element={
            <ProtectedRoute element={ActiveUsersList} path="/active_users" />
          }
        />

        <Route
          path="/inactive_users"
          element={
            <ProtectedRoute
              element={InactiveUsersList}
              path="/inactive_users"
            />
          }
        />

        <Route
          path="/user-Note/:user_id"
          element={
            <ProtectedRoute element={UserNote} path="/user-Note/:user_id" />
          }
        />
        <Route
          path="/deleted-userlist"
          element={
            <ProtectedRoute element={DeletedUsers} path="/deleted-userlist" />
          }
        />

        <Route
          path="/user-NoteList"
          element={<ProtectedRoute element={NotesList} path="/user-NoteList" />}
        />

        <Route
          path="/user/login-user-list"
          element={
            <ProtectedRoute
              element={LoginUsersList}
              path="/user/login-user-list"
            />
          }
        />

        <Route
          path="/withdrawal_pending"
          element={
            <ProtectedRoute element={Pending} path="/withdrawal_pending" />
          }
        />

        <Route
          path="/withdrawal_complete"
          element={
            <ProtectedRoute element={Complete} path="/withdrawal_complete" />
          }
        />

        <Route
          path="/withdrawal_reject"
          element={
            <ProtectedRoute element={Reject} path="/withdrawal_reject" />
          }
        />

        <Route
          path="/withdrawal_report_datewise"
          element={
            <ProtectedRoute
              element={WithdrawalDateWiseLists}
              path="/withdrawal_report_datewise"
            />
          }
        />

        <Route
          path="/admin_withdrawal_report_datewise"
          element={
            <ProtectedRoute
              element={AdminWithdrawalDateWiseLists}
              path="/admin_withdrawal_report_datewise"
            />
          }
        />

        <Route
          path="/withdrawal_datewise_details/:date"
          element={
            <ProtectedRoute
              element={WithdrawalDateWiseDetailPage}
              path="/withdrawal_datewise_details/:date"
            />
          }
        />

        <Route
          path="/admin_withdrawal_datewise_details/:date"
          element={
            <ProtectedRoute
              element={AdminWithdrawalDateWiseDetailPage}
              path="/admin_withdrawal_datewise_details/:date"
            />
          }
        />

        <Route
          path="/bank_account_pending"
          element={
            <ProtectedRoute
              element={BankAccountPending}
              path="/bank_account_pending"
            />
          }
        />

        <Route
          path="/bank_account_complete"
          element={
            <ProtectedRoute
              element={BankAccountComplete}
              path="/bank_account_complete"
            />
          }
        />

        <Route
          path="/bank_account_reject"
          element={
            <ProtectedRoute
              element={BankAccountReject}
              path="/bank_account_reject"
            />
          }
        />
        <Route
          path="/deposite_pending"
          element={
            <ProtectedRoute element={DepositPending} path="/deposite_pending" />
          }
        />
        <Route
          path="/deposite_complete"
          element={
            <ProtectedRoute
              element={DepositComplete}
              path="/deposite_complete"
            />
          }
        />
        <Route
          path="/deposite_reject"
          element={
            <ProtectedRoute element={DepositReject} path="/deposite_reject" />
          }
        />
        <Route
          path="/deposite_report_datewise"
          element={
            <ProtectedRoute
              element={DepositDateWiseLists}
              path="/deposite_report_datewise"
            />
          }
        />
        <Route
          path="/admin_deposite_report_datewise"
          element={
            <ProtectedRoute
              element={AdminDepositDateWiseLists}
              path="/admin_deposite_report_datewise"
            />
          }
        />
        <Route
          path="/deposit_detail/:date"
          element={
            <ProtectedRoute
              element={DepositDateWiseDetailPage}
              path="/deposit_detail/:date"
            />
          }
        />
        <Route
          path="/admin_deposit_detail/:date"
          element={
            <ProtectedRoute
              element={AdminDepositDateWiseDetailPage}
              path="/admin_deposit_detail/:date"
            />
          }
        />
        <Route
          path="/deposit_list_report_getway_wise_all"
          element={
            <ProtectedRoute
              element={DepositGatewayWiseAll}
              path="/deposit_list_report_getway_wise_all"
            />
          }
        />
        <Route
          path="/bet_history_pending"
          element={
            <ProtectedRoute element={BetHistory} path="/bet_history_pending" />
          }
        />
        <Route
          path="/bet_history_success"
          element={
            <ProtectedRoute
              element={BetHistorySuccess}
              path="/bet_history_success"
            />
          }
        />
        <Route
          path="/all_bets_lists"
          element={<ProtectedRoute element={AllBets} path="/all_bets_lists" />}
        />
        <Route
          path="/pending_bets_lists"
          element={
            <ProtectedRoute element={PendingBet} path="/pending_bets_lists" />
          }
        />
        <Route
          path="/success_bets_lists"
          element={
            <ProtectedRoute element={SuccessBet} path="/success_bets_lists" />
          }
        />
        <Route
          path="/game_load_bet_loss_lists"
          element={
            <ProtectedRoute
              element={GameLoadBetLossLists}
              path="/game_load_bet_loss_lists"
            />
          }
        />
        <Route
          path="/game_report_datewise"
          element={
            <ProtectedRoute
              element={GameReportDateWiseLists}
              path="/game_report_datewise"
            />
          }
        />
        <Route
          path="/game_report_marketTypewaise/:date"
          element={
            <ProtectedRoute
              element={GameReportDateWiseDetailsPage}
              path="/game_report_marketTypewaise/:date"
            />
          }
        />
        <Route
          path="/game_report_marketIdwaise/:markettypeURL"
          element={
            <ProtectedRoute
              element={GameReportMarketIdWaise}
              path="/game_report_marketIdwaise/:markettypeURL"
            />
          }
        />
        <Route
          path="/game_report_marketIdAndMarketTypeAll/"
          element={
            <ProtectedRoute
              element={GameReportMarketIdAndMarketTypeAll}
              path="/game_report_marketIdAndMarketTypeAll/"
            />
          }
        />
        <Route
          path="/declare_result"
          element={
            <ProtectedRoute element={DeclareResult} path="/declare_main" />
          }
        />
        <Route
          path="/fancy-result-list"
          element={
            <ProtectedRoute
              element={fancyResultList}
              path="/fancy-result-list"
            />
          }
        />
        <Route
          path="/view-fancy-result-list/:event_id"
          element={
            <ProtectedRoute
              element={ViewfancyResultList}
              path="/view-fancy-result-list"
            />
          }
        />
        <Route
          path="/declare_king_jack"
          element={
            <ProtectedRoute
              element={KingJackPortMarketDeclare}
              path="/declare_king_jack"
            />
          }
        />
        <Route
          path="/setting"
          element={<ProtectedRoute element={AppSetting} path="/config" />}
        />
        <Route
          path="/web-setting"
          element={<ProtectedRoute element={WebSetting} path="/web-setting" />}
        />
        <Route
          path="/commission-histry"
          element={
            <ProtectedRoute
              element={Commissionhistry}
              path="/commission-histry"
            />
          }
        />
        <Route
          path="/commission-report"
          element={
            <ProtectedRoute
              element={Commissionreport}
              path="/commission-report"
            />
          }
        />
        <Route
          path="/withdrawal_pending_Approve"
          element={
            <ProtectedRoute
              element={WithdrawPendingApporve}
              path="/withdrawal_pending_Approve"
            />
          }
        />
        <Route
          path="/Ledger/:userid"
          element={<ProtectedRoute element={Ledger} path="/Ledger/:userid" />}
        />
        <Route
          path="/bet_history_userwaise/:userid"
          element={
            <ProtectedRoute
              element={BetHistoryUserwaise}
              path="/bet_history_userwaise/:userid"
            />
          }
        />
        <Route
          path="/login_history/:userid"
          element={
            <ProtectedRoute
              element={LoginHistory}
              path="/login_history/:userid"
            />
          }
        />
        <Route
          path="/idea_submit_lists"
          element={
            <ProtectedRoute
              element={IdeaSubmitList}
              path="/idea_submit_lists"
            />
          }
        />
        <Route
          path="/slider_lists"
          element={<ProtectedRoute element={Slider} path="/slider_lists" />}
        />
        <Route
          path="/notification/notification-list"
          element={
            <ProtectedRoute
              element={SendNotification}
              path="/notification/notification-list"
            />
          }
        />
        <Route
          path="/sports"
          element={<ProtectedRoute element={AllGameList} path="/sports" />}
        />

        <Route
          path="/active-all-games/:sportId"
          element={
            <ProtectedRoute element={ActiveAllGames} path="/active-all-games" />
          }
        />

        <Route
          path="/cricket/:id"
          element={<ProtectedRoute element={Cricket} path="/cricket" />}
        />
        <Route
          path="/view_event/:matchId"
          element={
            <ProtectedRoute element={ViewEvent} path="/view_event/:matchId" />
          }
        />
        <Route
          path="/inActive_events/:id"
          element={
            <ProtectedRoute element={InActiveEvents} path="/inActive_events" />
          }
        />

        <Route
          path="/active_events/:id"
          element={
            <ProtectedRoute element={ActiveEvents} path="/active_events" />
          }
        />
        <Route
          path="/complete_events/:id"
          element={
            <ProtectedRoute element={CompletedEvents} path="/complete_events" />
          }
        />
        <Route
          path="/fancy_Managment"
          element={
            <ProtectedRoute element={FancyManagment} path="/fancy_Managment" />
          }
        />

        {/* <Route
          path="/view_match/:matchId"
          element={<ProtectedRoute element={ViewMatch} path="/view_match/:matchId" />}
        /> */}
        <Route
          path="/view_match"
          element={<ProtectedRoute element={ViewMatch} path="/view_match" />}
        />
        <Route
          path="/view_fancy/:eventId"
          element={
            <ProtectedRoute element={FancyList} path="/view_fancy/:eventId" />
          }
        />
        <Route
          path="/view_result/:eventId"
          element={
            <ProtectedRoute
              element={FancyResult}
              path="/view_result/:eventId"
            />
          }
        />
        <Route
          path="/userwallet/:id"
          element={
            <ProtectedRoute
              element={UserWalletBalance}
              path="/userwallet/:id"
            />
          }
        />
        <Route
          path="/admin_deposit_lists"
          element={
            <ProtectedRoute
              element={AdminDepositLists}
              path="/admin_deposit_lists"
            />
          }
        />
        <Route
          path="/admin_withdrow_lists"
          element={
            <ProtectedRoute
              element={AdminWithdrawalLists}
              path="/admin_withdrow_lists"
            />
          }
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
          element={
            <ProtectedRoute
              element={SubAdminPermissionList}
              path="/sub_admin-permission-list/:id"
            />
          }
        />
        <Route
          path="/reports/account-statement/:adminId?"
          element={
            <ProtectedRoute
              element={AccountStatement}
              path="reports/account-statement/:adminId?"
            />
          }
        />

        <Route
          path="/reports/bet-history-details/:roundId/:eventTypeId"
          element={
            <ProtectedRoute
              element={BetHistoryDetails}
              path="reports/bet-history-details/:roundId/:eventTypeId"
            />
          }
        />


        <Route
          path="/reports/profit-loss/:adminId?"
          element={
            <ProtectedRoute element={ProfitLoss} path="reports/profit-loss/:adminId?" />
          }
        />

        <Route
          path="/reports/chip-statement/:adminId?"
          element={
            <ProtectedRoute
              element={ChipStatement}
              path="reports/chip-statement/:adminId?"
            />
          }
        />

        <Route
          path="/reports/chip-summary/:adminId?"
          element={
            <ProtectedRoute element={ChipSummary} path="reports/chip-summary/:adminId?" />
          }
        />

        <Route
          path="/reports/settlement-report/:adminId?"
          element={
            <ProtectedRoute
              element={SettlementReport}
              path="reports/settlement-report/:adminId?"
            />
          }
        />

        <Route
          path="/reports/sport-summary-report/:adminId?"
          element={
            <ProtectedRoute
              element={SportSummaryReport}
              path="reports/sport-summary-report/:adminId?"
            />
          }
        />

        <Route
          path="/reports/top-clients"
          element={
            <ProtectedRoute element={TopClients} path="reports/top-clients" />
          }
        />

        <Route
          path="/reports/settlement"
          element={
            <ProtectedRoute element={Settlements} path="reports/settlement" />
          }
        />

        <Route
          path="/reports/balance-sheet"
          element={
            <ProtectedRoute
              element={BalanceSheet}
              path="reports/balance-sheet"
            />
          }
        />

        <Route
          path="/reports/bet-history-details/:adminId?"
          element={
            <ProtectedRoute
              element={BetHistoryDetails}
              path="/reports/bet-history-details/:adminId?"
            />
          }
        />


        <Route
          path="/reports/pending-bet-history/:adminId?"
          element={
            <ProtectedRoute
              element={PendingBetHistory}
              path="/reports/pending-bet-history/:adminId?"
            />
          }
        />


        <Route
          path="/casino/casino-providers-lists"
          element={
            <ProtectedRoute
              element={CasinoManagement}
              path="casino/casino-providers-lists"
            />
          }
        />

        <Route
          path="/market-analysis"
          element={
            <ProtectedRoute
              element={MarketAnalysisLists}
              path="market-analysis"
            />
          }
        />

        <Route
          path="/event/detail/:eventId"
          element={
            <ProtectedRoute
              element={MarketAnalysisEventDetail}
              path="event/detail/:eventId"
            />
          }
        />

        <Route
          path="/bet-history/:userId/:marketId"
          element={
            <ProtectedRoute
              element={MarketAnalysisBetHistory}
              path="bet-history/:userId/:marketId"
            />
          }
        />

        <Route
          path="/blocked-child-list"
          element={
            <ProtectedRoute
              element={BlockedChildLists}
              path="blocked-child-list"
            />
          }
        />

        <Route
          path="/agent_lists_clone/:adminId?"
          element={
            <ProtectedRoute
              element={AgentMasterClone}
              path="/agent_lists_clone"
            />
          }
        />

        <Route
          path="/multi-market"
          element={
            <ProtectedRoute element={Multimarket} path="/multi-market" />
          }
        />

        <Route
          path="/casino-setting/:adminId"
          element={
            <ProtectedRoute
              element={CasinoSetting}
              path="/casino-setting/:adminId"
            />
          }
        />

        <Route
          path="/icasino-setting/:id"
          element={
            <ProtectedRoute
              element={ICasinoSetting}
              path="/icasino-setting/:id"
            />
          }
        />

        <Route
          path="/sport-setting/:adminId"
          element={
            <ProtectedRoute element={SportSetting} path="/sport-setting/:adminId" />
          }
        />

        <Route
          path="/user-setting/:id"
          element={
            <ProtectedRoute element={UserSetting} path="/user-setting/:id" />
          }
        />

        {/* Add unauthorized route */}
        <Route
          path="/unauthorized"
          element={
            <div>
              Access Denied - You don't have permission to access this page
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
