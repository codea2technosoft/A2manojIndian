// import React from "react";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "./Layout/Headerall.jsx"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Layout from "./Layout/Layout";
import GaneRuleModal from "./Layout/GaneRuleModal";
import Login from "./User/Login";
import Userchat from "./User/Userchat";
import Chatclose from "./User/Chatclose";
import Dashboard from "./Pages/Dashboard";
import SubAdminDashboard from "./Pages/SubAdminDashboard.jsx";
import ViewmatchAndfancy from "./Pages/viewmatchAndFancy/viewMactch&fancy.jsx";//for dashboard page 
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
import AdminWithdrawal from "./Pages/Withdrawal/AdminWithdrawal";
import AdminWithdrawalDateWiseLists from "./Pages/Withdrawal/AdminWithdrawalDateWiseLists";
import WithdrawalDateWiseDetailPage from "./Pages/Withdrawal/WithdrawalDateWiseDetailPage";
import AdminWithdrawalDateWiseDetailPage from "./Pages/Withdrawal/AdminWithdrawalDateWiseDetailPage";
import WithdrawPendingApporve from "./Pages/Withdrawal/withdrawPendingApporve";
import Ledger from "./Pages/Withdrawal/Ledger";
import BetHistoryUserwaise from "./Pages/BetHistory/betHistoryUserwaise";
import DeclareResult from "./Pages/DeclareResult/MainMarket";
import DeclareResultHorseGreyhund from "./Pages/DeclareResultHorseGreyhund/HorseRacingAndGreyhund";
import KingJackPortMarketDeclare from "./Pages/DeclareResult/KingJackPortMarket";
import Banners from "./Pages/Banners/Banners";
import AppSetting from "./Pages/AppSettings/AppSetting";
import WebSetting from "./Pages/AppSettings/WebSetting.jsx";
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
import DepositeCompletedHistory from "./Pages/Deposits/DepositeCompletedHistory";
import DepositComplete from "./Pages/Deposits/Complete";
import DepositReject from "./Pages/Deposits/Reject";
import DepositDateWiseLists from "./Pages/Deposits/DepositDateWiseLists";
import DateWiseBetLists from "./Pages/Reports/DateWiseBetLists.jsx";
import DateWiseMatchListPage from "./Pages/Reports/DateWiseMatchListPage.jsx";
import DateWiseBetUserReport from "./Pages/Reports/DateWiseBetUserReport";
import Getfancyview from "./Pages/DeclareResult/Getfancyview";
import Getfancysettled from "./Pages/Reports/Getfancysettled";
import WithdrawalReportDateWiseLists from "./Pages/Reports/WithdrawalListDateWise.jsx";
import PLReport from "./Pages/Reports/PLReport.jsx";

import WithdrawalReportDateWiseDetail from "./Pages/Reports/WithdrawalReportDateWiseDetail.jsx";
import AdminDepositDateWiseLists from "./Pages/Deposits/AdminDepositDateWiseLists";
import Admindeposit from "./Pages/Deposits/Admindeposit";
import DepositDateWiseDetailPage from "./Pages/Deposits/DepositDateWiseDetailPage";
import DepositDateWiseReportPage from "./Pages/Reports/DepositReportDetailPage.jsx";
import DepositListDateWiseReportPage from "./Pages/Reports/DepositLists.jsx";
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
import CreateSubAdminPage from "./Pages/SubAdmin/CreateSubAdminPage.jsx";
import UpdateSubAdminPage from "./Pages/SubAdmin/UpdateSubAdminPage.jsx";
import SubAdminPermissionList from "./Pages/SubAdmin/SubAdminPermissionList.jsx";
import { ProtectedRoute } from "./Utils/Permissions.js";
import Scannersetting from "./Pages/AppSettings/Scannersetting";
import UpdatepayingatewaySettings from "./Pages/AppSettings/UpdatepayingatewaySettings";
import Mastermyuser from "./myuser/AgentMaster";
import InActiveUserList from "./myuser/InActiveUserLists.jsx";
import BlockUserList from "./myuser/BlockUserLists.jsx";
import Accountoperationmyuser from "./myuser/Accountoperation";
import Clientmastermyuser from "./myuser/Clientmaster";
import UserExposer from "./myuser/UserExposer.jsx";
import UserBetsExposerDetails from "./myuser/UserBetsExposerDetails.jsx";
import UserSettledBetsDetails from "./myuser/UserSettledBetsDetails.jsx";

//master route
// import Agentupdate from "./Master/Agentupdate.jsx";
// import Statementmasterlist from "./Master/AccountStatement.jsx";
import InPlayGame from "./Pages/SportBetting/InPlay.jsx";
import Bethistory from "./Pages/SportBetting/Bethistory.jsx";
import Allmatchhistory from "./Pages/SportBetting/Allmatchhistory.jsx";
import SettledBethistory from "./Pages/SportBetting/SettledBethistory.jsx";
import SettledBethistoryview from "./Pages/SportBetting/SettledBethistoryview.jsx";
import Settledmatchhistory from "./Pages/SportBetting/Settledmatchhistory.jsx";
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
import UserLedger from "./Pages/Ledger/UserLedger.js";
//transaction
import MasterTransction from "./Pages/transaction/MasterTransaction.js";
import AgentMasterTransction from "./Pages/transaction/MasterTransaction.js";
import CaseTransctionReport from "./Pages/transaction/CaseTransactionReport.jsx";
import CommissionReport from "./Pages/transaction/CommReport.js";
import MasterDeletedTransactionList from "./Pages/transaction/MasterDeletedTransaction.js";
import MyAllStatment from "./Pages/AllStatments/Mystatment.js";
import AllPLStatment from "./Pages/AllStatments/AllPLReport.js";
import fancyResultList from "./Pages/DeclareResult/fancyResultList.jsx";
import ViewfancyResultList from "./Pages/DeclareResult/ViewfancyResultList.jsx";


// new routers 
import Adminsetting from "./Pages/AppSettings/Adminsetting.jsx";
import AdminGeneralSettings from "./Pages/AppSettings/AdminGeneralSettings.jsx";
import BetListLive from "./allpages/BetListLive.jsx";
import Riskmangement from "./allpages/Riskmangement.jsx";
import TransferAgent from "./allpages/TransferAgent.jsx";
import Sportanalysis from "./allpages/Sportanalysis.jsx";
import Betlist from "./allpages/Betlist.jsx";
import Myaccountstatement from "./allpages/Myaccountstatement.jsx";
import Myprofile from "./allpages/Myprofile.jsx";
import Casinocontrol from "./allpages/Casinocontrol.jsx";
import Offer from "./allpages/Offer.jsx";
import Bannnerlist from "./allpages/Bannnerlist.jsx";
import AprofitDownline from "./allpages/AprofitDownline.jsx";
import Adownlinesportspl from "./allpages/Adownlinesportspl.jsx";
import AprofitPlayer from "./allpages/AprofitPlayer.jsx";
import AprofitMarket from "./allpages/AprofitMarket.jsx";
import AprofitCasino from "./allpages/AprofitCasino.jsx";
import Internationalreport from "./allpages/Internationalreport.jsx";
import Gapcasinobets from "./allpages/Gapcasinobets.jsx";
import Profitgaploss from "./allpages/Profitgaploss.jsx";
import Profitlossaura from "./allpages/Profitlossaura.jsx";
import Banking from "./allpages/Banking.jsx";
import Settlement from "./allpages/Settlement.jsx";
import Banks from "./allpages/Banks.jsx";
import Sms from "./allpages/Sms";
// import Client from "./allpages/Client";
import Agentlist from "./allpages/AgentLists.jsx";
import Accountsummary from "./allpages/History/Accountsummary";
import LifetimePL from "./allpages/History/LifetimePL";
import CurrentBets from "./allpages/History/CurrentBets";
import CurrentBetsdashboard from "./allpages/History/CurrentBetsdashboard";
import BettingHistory from "./allpages/History/BettingHistory";
import Bettingprofitloss from "./allpages/History/Bettingprofitloss";
import TransactionHistory from "./allpages/History/TransactionHistory";
import TransactionHistory2 from "./allpages/History/TransactionHistory2";
import Matchbetdetails from "./allpages/Matchbetdetails";
import Registeruserdashboard from "./allpages/Registeruserdashboard.jsx";
import RegisteruserdashboardRecent from "./allpages/RegisteruserdashboardRecent.jsx";
import Commingsoon from "./allpages/Commingsoon.jsx";
import MatchMarketBets from "./allpages/MatchMarketBets.jsx";
import Agentbankingdebitcreditlog from "./allpages/Agentbankingdebitcreditlog";
import Agentbankingtransctionhistory from "./allpages/Agentbankingtransctionhistory";
import AprofitDownlineuser from "./allpages/AprofitDownlineuser";
import Profitlosssportswise from "./allpages/Profitlosssportswise";
import Downlinesportsplsportswise from "./allpages/Downlinesportsplsportswise";
import MatchBetDetailssportswise from "./allpages/MatchBetDetailssportswise";
import Profitlossreportsportswisedownline from "./allpages/Profitlossreportsportswisedownline";

const App = () => {
  const [depositPending, setDepositPending] = useState(0);
  const [withdrawPending, setWithdrawPending] = useState(0);
  const [profileData, setProfileData] = useState(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);

  const token = localStorage.getItem("token");
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const admin_id = localStorage.getItem("admin_id");

  // ✅ Profile API Call
  const getAdminProfile = async () => {
    const token = localStorage.getItem("token");
    const data = {
      admin_id: "admin",
      role: 1,
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/get-data`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      const profile = await response.json();

      if (profile.success === true) {
        const adminProfile = profile.data.admin_profile;
        setProfileData(adminProfile);

        const depositPendingCount = adminProfile?.transaction_summary?.deposit?.pending || 0;
        const withdrawPendingCount = adminProfile?.transaction_summary?.withdraw?.pending || 0;

        setDepositPending(depositPendingCount);
        setWithdrawPending(withdrawPendingCount);
      }

      return profile;
    } catch (error) {
      console.error("❌ Profile API Error:", error);
      throw error;
    }
  };

  // ✅ TOKEN EXPIRY CHECK (Sirf expiry ke liye, multiple login allow)
  useEffect(() => {
    const checkExpiry = () => {
      const expiryTime = localStorage.getItem("expiryTime");
      if (expiryTime && new Date().getTime() > expiryTime) {
        localStorage.clear();
        window.location.href = "/login";
      }
    };
    checkExpiry();

    const interval = setInterval(checkExpiry, 1000);
    return () => clearInterval(interval);
  }, []);

  // ✅ VERIFICATION - Multiple login allowed (No token matching)
  useEffect(() => {
    const verify = async () => {
      console.log("🔍 Verification Started...");
      console.log("Token:", token);
      console.log("Admin ID:", admin_id);
      console.log("isLoggedIn:", isLoggedIn);

      // ✅ Sirf token exist karta hai ya nahi check karo
      if (!token || !isLoggedIn || !admin_id) {
        console.log("❌ Token/Admin ID missing - Redirect to Login");
        setIsValid(false);
        setIsVerifying(false);
        return;
      }

      try {
        // ✅ Profile fetch karo (Token valid hai ya nahi check karne ke liye)
        const profileData = await getAdminProfile();

        if (profileData.success === true) {
          console.log("✅ Profile Fetched Successfully");
          console.log("🔑 Token exists - Multiple Login Allowed");
          setIsValid(true);
        } else {
          console.log("❌ Profile API Failed - Invalid Token");
          localStorage.clear();
          window.location.href = "/login";
          setIsValid(false);
        }
      } catch (error) {
        console.log("❌ Profile API Error:", error);
        // ⚠️ Agar API fail ho toh bhi logout mat karo (network issue ho sakta hai)
        setIsValid(true); // ✅ Temporary fix - allow access
      } finally {
        setIsVerifying(false);
        console.log("🏁 Verification Complete");
      }
    };

    verify();
  }, []); // ✅ Sirf ek baar run hoga

  // ⏳ Loading State
  if (isVerifying) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontSize: "24px",
        fontWeight: "bold"
      }}>
        ⏳ Verifying...
      </div>
    );
  }

  // ❌ Invalid Token / No Token
  if (!isValid || !token || !isLoggedIn) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

  // ✅ MAIN APP - Sabhi routes chalenge
  return (
    <Router>
      <Header
        depositPending={depositPending}
        withdrawPending={withdrawPending}
        profileData={profileData}
      />

      <Routes>
        {/* ✅ Login Route - Agar already logged in hai toh dashboard pe bhejo */}
        <Route
          path="/login"
          element={
            (localStorage.getItem("token") && localStorage.getItem("isLoggedIn") === "true")
              ? <Navigate to="/dashboard" replace />
              : <Login />
          }
        />


        <Route path="/userchat" element={<Userchat />} />
        <Route path="/Chatclose" element={<Chatclose />} />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/homedashboard"
          element={<ProtectedRoute element={HomeDashboard} path="/homedashboard" />}
        />
        <Route
          path="/current-bets"
          element={<ProtectedRoute element={CurrentBets} path="/current-bets" />}
        />
        <Route
          path="/aprofit-downline-user"
          element={<ProtectedRoute element={AprofitDownlineuser} path="/aprofit-downline-user" />}
        />
        <Route
          path="/agentwisebanking-debit-credit-log"
          element={<ProtectedRoute element={Agentbankingdebitcreditlog} path="/agentwisebanking-debit-credit-log" />}
        />
        <Route
          path="/Agentbankingtransctionhistory"
          element={<ProtectedRoute element={Agentbankingtransctionhistory} path="/Agentbankingtransctionhistory" />}
        />
        <Route
          path="/currentBets-dashboard"
          element={<ProtectedRoute element={CurrentBetsdashboard} path="/currentBets-dashboard" />}
        />
        <Route
          path="/registeruser-dashbaord"
          element={<ProtectedRoute element={Registeruserdashboard} path="/registeruser-dashbaord" />}
        />
        <Route
          path="/comming-soon"
          element={<ProtectedRoute element={Commingsoon} path="/comming-soon" />}
        />
        <Route
          path="/registeredUser/recent"
          element={<ProtectedRoute element={RegisteruserdashboardRecent} path="/registeredUser/recent" />}
        />
        <Route
          path="/betting-profit-loss"
          element={<ProtectedRoute element={Bettingprofitloss} path="/betting-profit-loss" />}
        />
        <Route
          path="/transaction-history"
          element={<ProtectedRoute element={TransactionHistory} path="/transaction-history" />}
        />
        <Route
          path="/transaction-history-2"
          element={<ProtectedRoute element={TransactionHistory2} path="/transaction-history-2" />}
        />
        <Route
          path="/betting-history"
          element={<ProtectedRoute element={BettingHistory} path="/betting-history" />}
        />
        <Route
          path="/account-summary"
          element={<ProtectedRoute element={Accountsummary} path="/account-summary" />}
        />
        <Route
          path="/lifetime-PL"
          element={<ProtectedRoute element={LifetimePL} path="/lifetime-PL" />}
        />
        <Route
          path="/pl-report-by-player"
          element={<ProtectedRoute element={AprofitPlayer} path="/pl-report-by-player" />}
        />
        <Route
          path="/sms"
          element={<ProtectedRoute element={Sms} path="/sms" />}
        />
        <Route
          path="/pl-international-casino-bets"
          element={<ProtectedRoute element={Internationalreport} path="/pl-international-casino-bets" />}
        />
        <Route
          path="/pl-gap-casino-bets"
          element={<ProtectedRoute element={Gapcasinobets} path="/pl-gap-casino-bets" />}
        />
        <Route
          path="/pl-aura-casino-bets"
          element={<ProtectedRoute element={Profitlossaura} path="/pl-aura-casino-bets" />}
        />
        <Route
          path="/banking"
          element={<ProtectedRoute element={Banking} path="/banking" />}
        />
        <Route
          path="/settlement"
          element={<ProtectedRoute element={Settlement} path="/settlement" />}
        />
        <Route
          path="/banks"
          element={<ProtectedRoute element={Banks} path="/banks" />}
        />
        <Route
          path="/report/gap"
          element={<ProtectedRoute element={Profitgaploss} path="/report/gap" />}
        />
        <Route
          path="/casino-profit-loss-by-date"
          element={<ProtectedRoute element={AprofitCasino} path="/casino-profit-loss-by-date" />}
        />
        <Route
          path="/pl-by-downline"
          element={<ProtectedRoute element={AprofitDownline} path="/pl-by-downline" />}
        />
        <Route
          path="/profit-loss-report-sports-wise-downline/:id"
          element={<ProtectedRoute element={Profitlossreportsportswisedownline} path="/profit-loss-report-sports-wise-downline/:id" />}
        />
        <Route
          path="/pl-by-market"
          element={<ProtectedRoute element={AprofitMarket} path="/pl-by-market" />}
        />
        <Route
          path="/match-profit-loss"
          element={<ProtectedRoute element={Adownlinesportspl} path="/match-profit-loss" />}
        />
        <Route
          path="/downlinesportspl-sports-wise"
          element={<ProtectedRoute element={Downlinesportsplsportswise} path="/downlinesportspl-sports-wise" />}
        />
        <Route
          path="/matchBetDetailssports-wise"
          element={<ProtectedRoute element={MatchBetDetailssportswise} path="/matchBetDetailssports-wise" />}
        />
        <Route
          path="/profit-loss-sports-wise"
          element={<ProtectedRoute element={Profitlosssportswise} path="/profit-loss-sports-wise" />}
        />
        <Route
          path="/MatchBetDetails/fancy"
          element={<ProtectedRoute element={Matchbetdetails} path="/MatchBetDetails/fancy" />}
        />
        <Route
          path="/offer"
          element={<ProtectedRoute element={Offer} path="/offer" />}
        />
        <Route
          path="/bannerlist"
          element={<ProtectedRoute element={Bannnerlist} path="/bannerlist" />}
        />
        <Route
          path="/casinocontrol"
          element={<ProtectedRoute element={Casinocontrol} path="/casinocontrol" />}
        />
        {/* new routes  */}


        <Route
          path="/my-account-statement"
          element={<ProtectedRoute element={Myaccountstatement} path="/my-account-statement" />}
        />

        <Route
          path="/my-profile"
          element={<ProtectedRoute element={Myprofile} path="/my-profile" />}
        />

        <Route
          path="/transfer-agent"
          element={<ProtectedRoute element={TransferAgent} path="/transferAgent" />}
        />
        <Route
          path="/betlist"
          element={<ProtectedRoute element={Betlist} path="/betlist" />}
        />

        <Route
          path="/bet-live-list"
          element={<ProtectedRoute element={BetListLive} path="/BetListLive" />}
        />
        <Route
          path="/riskmangement"
          element={<ProtectedRoute element={Riskmangement} path="/Riskmangement" />}
        />
        <Route
          path="/sportanalysis"
          element={<ProtectedRoute element={Sportanalysis} path="/sportanalysis" />}
        />




        {/* new routes  */}

        <Route
          path="/dashboard"
          element={<ProtectedRoute element={Dashboard} path="/dashboard" />}
        />
        <Route
          path="/Dashboard"
          element={<ProtectedRoute element={SubAdminDashboard} path="/Dashboard" />}
        />
        {/* <Route
          path="/viewmatch-fancy/series_idd/:series_idd/event_id/:event_id"
          element={<ProtectedRoute element={ViewmatchAndfancy} path="/dashboard" />}
        /> */}

        <Route
          path="/viewmatch-fancy/series_idd/:series_idd/event_id/:event_id/sport_id/:sport_id"
          element={<ProtectedRoute element={ViewmatchAndfancy} path="/dashboard" />}
        />

        <Route
          path="/Mastermyuser/:adminId?"
          element={<ProtectedRoute element={Mastermyuser} path="/Mastermyuser" />}
        />
        <Route
          path="/user-exposer"
          element={<ProtectedRoute element={UserExposer} path="/user-exposer" />}
        />
        <Route
          path="/block-users-lists"
          element={<ProtectedRoute element={BlockUserList} path="/block-users-lists" />}
        />
        <Route
          path="/inactive-users-lists"
          element={<ProtectedRoute element={InActiveUserList} path="/inactive-users-lists" />}
        />
        <Route
          path="/Clientmastermyuser"
          element={<ProtectedRoute element={Clientmastermyuser} path="/Clientmastermyuser" />}
        />
        <Route
          path="/master-transaction/:master_id?"
          element={<ProtectedRoute element={MasterTransction} path="/master-transaction" />}
        />
        <Route
          path="/case-transaction-report"
          element={<ProtectedRoute element={CaseTransctionReport} path="/master-transaction" />}
        />
        <Route
          path="/agent_master-deleted-transactions"
          element={<ProtectedRoute element={MasterDeletedTransactionList} path="/agent_master-deleted-transactions" />}
        />
        <Route
          path="/master-commisssion-report"
          element={<ProtectedRoute element={CommissionReport} path="/master-commisssion-report" />}
        />
        <Route
          path="/master-commisssion-report"
          element={<ProtectedRoute element={CommissionReport} path="/master-commisssion-report" />}
        />


        <Route
          path="/profitloss"
          element={<ProtectedRoute element={ProfitAndLoss} path="/profitloss" />}
        />
        <Route
          path="/my-profit-loss"
          element={<ProtectedRoute element={MyProfitAndLoss} path="/my-profit-loss" />}
        />
        <Route
          path="/my-ledger"
          element={<ProtectedRoute element={MyLedger} path="/my-ledger" />}
        />
        <Route
          path="/user-ledger"
          element={<ProtectedRoute element={UserLedger} path="/user-ledger" />}
        />

        <Route
          path="/Ledger/:userid"
          element={<ProtectedRoute element={Ledger} path="/Ledger/:userid" />}
        />



        <Route
          path="/getAllstatment"
          element={
            <ProtectedRoute
              element={MyAllStatment}
              path="/getAllstatment"
            />
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
          path="/inplay_game"
          element={
            <ProtectedRoute
              element={InPlayGame}
              path="/inplay_game"
            />
          }
        />
        <Route
          path="/Bethistory"
          element={
            <ProtectedRoute
              element={Bethistory}
              path="/Bethistory"
            />
          }
        />
        <Route
          path="/Allmatchhistory"
          element={
            <ProtectedRoute
              element={Allmatchhistory}
              path="/Allmatchhistory"
            />
          }
        />
        <Route
          path="/SettledBethistory"
          element={
            <ProtectedRoute
              element={SettledBethistory}
              path="/SettledBethistory"
            />
          }
        />
        <Route
          path="/SettledBethistoryview"
          element={
            <ProtectedRoute
              element={SettledBethistoryview}
              path="/SettledBethistoryview"
            />
          }
        />
        <Route
          path="/Settledmatchhistory"
          element={
            <ProtectedRoute
              element={Settledmatchhistory}
              path="/Settledmatchhistory"
            />
          }
        />
        <Route
          path="/completed_game"
          element={
            <ProtectedRoute
              element={CompleteGame}
              path="/completed_game"
            />
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
          path="/rejected_bet/:event_id"
          element={
            <ProtectedRoute
              element={RejectedBet}
              path="/rejected_bet"
            />
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
          path="/adminchat"
          element={<ProtectedRoute element={Adminchat} path="/adminchat" />}
        />

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
          element={<ProtectedRoute element={Superagenttransaction} path="/Superagenttransaction" />}
        />

        <Route
          path="/master-transaction/:master_id?"
          element={<ProtectedRoute element={AgentMasterTransction} path="/master-transaction" />}
        />
        <Route
          path="/Usertransaction/:admin_id?"
          element={<ProtectedRoute element={Usertransaction} path="/Usertransaction" />}
        />
        <Route
          path="/Agenttransaction/:master_id?"
          element={<ProtectedRoute element={Agenttransaction} path="/Agenttransaction" />}
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
        {/* <Route
          path="/client"
          element={<ProtectedRoute element={Client} path="/client" />}
        /> */}

        <Route
          path="/withdrawal_reject"
          element={<ProtectedRoute element={Reject} path="/withdrawal_reject" />}
        />

        <Route
          path="/withdrawal_report_datewise"
          element={<ProtectedRoute element={WithdrawalDateWiseLists} path="/withdrawal_report_datewise" />}
        />
        <Route
          path="/AdminWithdrawal"
          element={<ProtectedRoute element={AdminWithdrawal} path="/AdminWithdrawal" />}
        />
        <Route
          path="/withdrawalList_report_datewise"
          element={<ProtectedRoute element={WithdrawalReportDateWiseLists} path="/withdrawalList_report_datewise" />}
        />
        <Route
          path="/pl_report"
          element={<ProtectedRoute element={PLReport} path="/pl_report" />}
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
          path="/withdrawalreport_datewise_details/:date"
          element={<ProtectedRoute element={WithdrawalReportDateWiseDetail} path="/withdrawalreport_datewise_details/:date" />}
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
          path="/deposite_completed_history"
          element={<ProtectedRoute element={DepositeCompletedHistory} path="/deposite_completed_history" />}
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
          path="/depositeList_report_datewise"
          element={<ProtectedRoute element={DepositListDateWiseReportPage} path="/depositeList_report_datewise" />}
        />
        <Route
          path="/datewise_bet_reoprt"
          element={<ProtectedRoute element={DateWiseBetLists} path="/datewise_bet_reoprt" />}
        />

        <Route
          path="/admin_deposite_report_datewise"
          element={<ProtectedRoute element={AdminDepositDateWiseLists} path="/admin_deposite_report_datewise" />}
        />
        <Route
          path="/Admindeposit"
          element={<ProtectedRoute element={Admindeposit} path="/Admindeposit" />}
        />

        <Route
          path="/deposit_detail/:date"
          element={<ProtectedRoute element={DepositDateWiseDetailPage} path="/deposit_detail/:date" />}
        />
        <Route
          path="/date_wise_deposit_detail/:date"
          element={<ProtectedRoute element={DepositDateWiseReportPage} path="/date_wise_deposit_detail/:date" />}
        />
        <Route
          path="/datewise_match_List/:date"
          element={<ProtectedRoute element={DateWiseMatchListPage} path="/datewise_match_List/:date" />}
        />
        <Route
          path="/datewise_bet_user_report/:eventId"
          element={<ProtectedRoute element={DateWiseBetUserReport} path="/datewise_bet_user_report/:eventId" />}
        />
        <Route
          path="/Getfancyview/:eventId"
          element={<ProtectedRoute element={Getfancyview} path="/Getfancyview/:eventId" />}
        />
        <Route
          path="/Getfancysettled/:eventId/:bet_type"
          element={
            <ProtectedRoute
              element={Getfancysettled}
              path="/Getfancysettled/:eventId/:bet_type"
            />
          }
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
          path="/declare_result_horsegreyhund"
          element={<ProtectedRoute element={DeclareResultHorseGreyhund} path="/declare_result_horsegreyhund" />}
        />


        <Route
          path="/fancy-result-list"
          element={<ProtectedRoute element={fancyResultList} path="/fancy-result-list" />}
        />
        <Route
          path="/view-fancy-result-list/:event_id"
          element={<ProtectedRoute element={ViewfancyResultList} path="/view-fancy-result-list" />}
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
          path="/web-setting"
          element={<ProtectedRoute element={WebSetting} path="/web-setting" />}
        />
        <Route
          path="/general-setting"
          element={<ProtectedRoute element={Adminsetting} path="/web-setting" />}
        />

         <Route
          path="/admin-general-settings"
          element={<ProtectedRoute element={AdminGeneralSettings} path="/admin-general-settings" />}
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
          element={<ProtectedRoute element={FancyList} path="/view_fancy/:eventId" />}
        />

        <Route
          path="/view_result/:eventId"
          element={<ProtectedRoute element={FancyResult} path="/view_result/:eventId" />}
        />


        <Route
          path="/userwallet/:id?"
          element={<ProtectedRoute element={UserWalletBalance} path="/userwallet/:id?" />}
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
          path="/create-sub_admin"
          element={<ProtectedRoute element={CreateSubAdminPage} path="/create-sub_admin" />}
        />
        <Route
          path="/update-sub_admin/:id"
          element={<ProtectedRoute element={UpdateSubAdminPage} path="/update-sub_admin/:id" />}
        />
        <Route
          path="/gateway-setting"
          element={<ProtectedRoute element={Scannersetting} path="/gateway-setting" />}
        />

        {/* <Route
  path="/updatepayin-gateway-settings/:id"
  element={<ProtectedRoute element={UpdatepayingatewaySettings} path="/updatepayin-gateway-settings/:id" />}
/> */}

        <Route
          path="/updatepayin-gateway-settings/:id/:pay_type/:name"
          element={<ProtectedRoute element={UpdatepayingatewaySettings} path="/updatepayin-gateway-settings/:id/:pay_type/:name" />}
        />



        <Route
          path="/sub_admin-permission-list/:id"
          element={<ProtectedRoute element={SubAdminPermissionList} path="/sub_admin-permission-list/:id" />}
        />


        <Route
          path="/create-users"
          element={<ProtectedRoute element={CreateUser} path="/create-users" />}
        />



        {/* <Route
          path="/users-list"
          element={<ProtectedRoute element={UsersList} path="/users-list" />}
        /> */}

        <Route
          path="/users-list"
          element={<ProtectedRoute element={UsersList} path="/users-list" />}
        />




        <Route
          path="/agent-list"
          element={<ProtectedRoute element={Agentlist} path="/agent-list" />}
        />

        <Route
          path="/active-users-list"
          element={<ProtectedRoute element={ActiveUsersList} path="/active-users-list" />}
        />

        <Route
          path="inactive-users-list"
          element={<ProtectedRoute element={InactiveUsersList} path="/inactive-users-list" />}
        />

        <Route
          path="blocked-users-list"
          element={<ProtectedRoute element={BlockUserList} path="/blocked-users-list" />}
        />


        <Route
          path="user-bets-exposer-details/:userId"
          element={<ProtectedRoute element={UserBetsExposerDetails} path="/user-bets-exposer-details/:userId" />}
        />

        <Route
          path="user-settled-bets-details/:userId"
          element={<ProtectedRoute element={UserSettledBetsDetails} path="/user-settled-bets-details/:userId" />}
        />
        <Route
          path="/match-market-bets/:id"
          element={<ProtectedRoute element={MatchMarketBets} path="/match-market-bets/:id" />}
        />




        {/* Add unauthorized route */}
        <Route path="/unauthorized" element={<div>Access Denied - You don't have permission to access this page</div>} />

      </Routes>
    </Router>

  );
};

export default App;
