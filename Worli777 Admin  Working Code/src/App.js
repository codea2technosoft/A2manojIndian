import React, { useState, useEffect } from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Layout from "./Layout/Layout";
import Login from "./User/Login";
import Userchat from "./User/Userchat";
import Chatclose from "./User/Chatclose";
import Dashboard from "./Pages/Dashboard";
import MobileDashboard from "./Pages/MobileDashboard";
import Adminchat from "./Pages/AdminChat/Adminchat";
import AdminchattingPage from "./Pages/AdminChat/AdminchattingPage";
import HomeDashboard from "./Pages/HomeDashboard";
import CreateUser from "./Pages/User/CreateUser";
import UsersList from "./Pages/User/UsersList";
import LoginHistory from "./Pages/User/loginHistory";
import UsersWalletBalance from "./Pages/User/UsersWalletBalance";
import ActiveUsersList from "./Pages/User/ActiveUsersList";
import LoginUsersList from "./Pages/User/LoginUsersList";
import InactiveUsersList from "./Pages/User/InactiveUsersList";
import MainMarket from "./Pages/Market/MainMarket";
import KingJackPortMarket from "./Pages/Market/KingJackPortMarket";
import KingStarlineMarket from "./Pages/Market/KingStarlineMarket";
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
import UploadResultInCSV from "./Pages/AppSettings/UploadResultInCSV";

// import AddPoint from "./Pages/PointManagement/AddPoint";
// import DeductPoint from "./Pages/PointManagement/DeductPoint";
// import UserWalletBalance from "./Pages/PointManagement/UserWalletBalance";
// import AdminAddPointHistory from "./Pages/PointManagement/AdminAddPointHistory";
// import AutoPointAddHistory from "./Pages/PointManagement/AutoPointAddHistory";

import MainMarketDeclare from "./Pages/DeclareResult/MainMarket";
import KingJackPortMarketDeclare from "./Pages/DeclareResult/KingJackPortMarket";
import KingStarlineMarketDeclare from "./Pages/DeclareResult/KingStarlineMarket";

import MainMarketGameLoad from "./Pages/MarketsGameLoad/MainMarketGameLoad";
import KingJackPortMarketGameLoad from "./Pages/MarketsGameLoad/KingJackPortMarketGameLoad";
import KingStarlineMarketGameLoad from "./Pages/MarketsGameLoad/KingStarlineMarketGameLoad";

// import MainGame from "./Pages/RunningGame/MainMarket";
// import Kingjackportrunning from "./Pages/RunningGame/KingJackPortMarket";
// import Kingstarlinerunning from "./Pages/RunningGame/KingStarlineMarket";

import AllGameRates from "./Pages/GameRates/AllGameRates";
import AllGameRatesUserWaise from "./Pages/GameRates/AllGameRatesUserWaise.jsx";
import MainMarketUpload from "./Pages/UploadOldResult/MainMarket";
import DelhiMarketUpload from "./Pages/UploadOldResult/DelhiMarket";
import StarlineMarketUpload from "./Pages/UploadOldResult/StarlineMarket";
// import BidingReport from "./Pages/ReportManagement/BidingReport";
// import UserBidingReport from "./Pages/ReportManagement/UserBidingReport";
// import UserFullBidingDetails from "./Pages/ReportManagement/UserFullBidingDetails";
// import TransactionHistory from "./Pages/ReportManagement/TransactionHistory";
// import WinnersHistory from "./Pages/ReportManagement/WinnersHistory";
// import ResultAnalysisHistory from "./Pages/ReportManagement/ResultAnalysisHistory";
import Banners from "./Pages/Banners/Banners";
import NoticeManagement from "./Pages/NoticeManagement/NoticeManagement";
import AppSetting from "./Pages/AppSettings/AppSetting";
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

import RolesAndPermissions from "./Pages/RolesAndPermissions/CreateRoles";
import CreatedRolesAndPermissions from "./Pages/RolesAndPermissions/CreatedRolesList";
import ActiveRolesAndPermissions from "./Pages/RolesAndPermissions/ActiveRolesList";
import InactiveRolesAndPermissions from "./Pages/RolesAndPermissions/InactiveRolesLists";
import PayInGatewaySettings from "./Pages/GatewaySettings/PayInGatewaySetting";
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
import DepositGatewayWiseAll from "./Pages/Deposits/DepositGatewayWiseAll";
import UploadManualResults from "./Pages/AppSettings/UploadManualResults";
import NoticeBoardManagement from "./Pages/NoticeBoardManagement/NoticeBoardManagement";

import Sidebar from "./Layout/Sidebar";

const App = () => {
  const [userType, setUserType] = useState(() => {
    return localStorage.getItem("userType") || null;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [permissions, setPermissions] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const permissionRouteMap = {
    homedashboard: "/homedashboard",
    dashboard: "/dashboard",
    adminchat: "/adminchat",
    adminchat_adminchat_view: "/adminchat/adminchat-view",
    bet_history_userwaise: "/bet_history_userwaise",
    login_history: "/login_history",
    Ledger: "/Ledger",
    game_report_marketTypewaise: "/game_report_marketTypewaise",
    game_report_marketIdwaise: "/game_report_marketIdwaise",
    game_report_marketIdAndMarketTypeAll:
      "/game_report_marketIdAndMarketTypeAll",
    admin_withdrawal_datewise_details: "/admin_withdrawal_datewise_details",
    withdrawal_datewise_details: "/withdrawal_datewise_details",
    deposit_detail: "/deposit_detail",
    deposit_list_report_getway_wise_all: "/deposit_list_report_getway_wise_all",
    admin_deposit_detail: "/admin_deposit_detail",
    create_user: "/create_user",
    userchat: "/Userchat",
    all_users: "/all_users",
    active_users: "/active_users",
    inactive_users: "/inactive_users",
    // user_wallet_balance: "/user_wallet_balance",
    main_market_list: "/main_market_list",
    king_jack_port_market_list: "/king_jack_port_market_list",
    king_starline_market_list: "/king_starline_market_list",
    withdrawal_pending: "/withdrawal_pending",
    withdrawal_complete: "/withdrawal_complete",
    withdrawal_reject: "/withdrawal_reject",
    withdrawal_report_datewise: "/withdrawal_report_datewise",
    withdrawal_pending_Approve: "/withdrawal_pending_Approve",
    admin_withdrawal_report_datewise: "/admin_withdrawal_report_datewise",

    bank_account_pending: "/bank_account_pending",
    bank_account_complete: "/bank_account_complete",
    bank_account_reject: "/bank_account_reject",

    deposite_pending: "/deposite_pending",
    deposite_complete: "/deposite_complete",
    deposite_reject: "/deposite_reject",
    deposite_report_datewise: "/deposite_report_datewise",
    admin_deposite_report_datewise: "/admin_deposite_report_datewise",

    // add_point: "/point_management_add_point",
    // deduct_point: "/point_management_deduct_point",
    // point_user_wallet_balance: "/point_user_wallet_balance",
    // admin_add_point_history: "/admin_add_point_history",
    // auto_point_add_history: "/auto_point_add_history",

    bet_history_pending: "/bet_history_pending",
    bet_history_success: "/bet_history_success",
    game_load_bet_loss_lists: "/game_load_bet_loss_lists",
    game_report_datewise: "/game_report_datewise",

    declare_main: "/declare_main",
    declare_king_jack: "/declare_king_jack",
    declare_king_starline: "/declare_king_starline",

    main_market_game_load: "/main_market_game_load",
    king_jackport_game_load: "/king_jackport_game_load",
    king_starline_game_load: "/king_starline_game_load",

    // running_main_market_lists: "/running_main_market_lists",
    // running_king_jack_port_lists: "/running_king_jack_port_lists",
    // running_king_starline_lists: "/running_king_starline_lists",

    update_rates: "/update_rates",
    update_rates_userWaise: "/update_rates_userWaise",
    create_roles: "/create_roles",
    all_roles: "/all_roles",
    active_roles: "/active_roles",
    inactive_roles: "/inactive_roles",
    config: "/config",
    PayInGatewaySettings: "/PayInGatewaySettings",
    video_lists: "/video_lists",
    idea_submit_lists: "/idea_submit_lists",
    notice_management: "/notice_management",
    NoticeBoardManagement: "/NoticeBoardManagement",
    slider_lists: "/slider_lists",
    color_lists: "/color_lists",
    // bidding_report: "/bidding_report",
    // user_bidding_report: "/user_bidding_report",
    // user_full_bidding_report: "/user_full_bidding_report",
    // user_transactions_history: "/user_transactions_history",
    // user_winner_history: "/user_winner_history",
    // user_result_analysis_history: "/user_result_analysis_history",
  };
  const fetchPermissions = async (token, userType, userId) => {
    try {
      if (userType === "tech_admin") {
        setUserType({ token, type: userType });
        setPermissions(["*"]);
      } else {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/admin-permissions-list`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: userId,
            }),
          }
        );

        if (res.ok) {
          const result = await res.json();
          const permissionData = result.data; // Your array of permission objects
          const allowedRoutes = [];
          // console.warn("permissionData", permissionData["0"].permissions);
          permissionData["0"].permissions.push({
            id: "homedashboard",
            name: "homedashboard",
            checked: true,
            children: [
              { id: "homedashboard", name: "homedashboard", checked: true },
            ],
          });
          permissionData["0"].permissions.push({
            id: "adminchat_adminchat_view",
            name: "adminchat_adminchat_view",
            checked: true,
            children: [
              {
                id: "adminchat_adminchat_view",
                name: "adminchat_adminchat_view",
                checked: true,
              },
            ],
          });
          permissionData["0"].permissions.push({
            id: "bet_history_userwaise",
            name: "bet_history_userwaise",
            checked: true,
            children: [
              {
                id: "bet_history_userwaise",
                name: "bet_history_userwaise",
                checked: true,
              },
            ],
          });
          permissionData["0"].permissions.push({
            id: "login_history",
            name: "login_history",
            checked: true,
            children: [
              {
                id: "login_history",
                name: "login_history",
                checked: true,
              },
            ],
          });
          permissionData["0"].permissions.push({
            id: "update_rates_userWaise",
            name: "update_rates_userWaise",
            checked: true,
            children: [
              {
                id: "update_rates_userWaise",
                name: "update_rates_userWaise",
                checked: true,
              },
            ],
          });
          permissionData["0"].permissions.push({
            id: "Ledger",
            name: "Ledger",
            checked: true,
            children: [
              {
                id: "Ledger",
                name: "Ledger",
                checked: true,
              },
            ],
          });
          permissionData["0"].permissions.push({
            id: "game_report_marketTypewaise",
            name: "game_report_marketTypewaise",
            checked: true,
            children: [
              {
                id: "game_report_marketTypewaise",
                name: "game_report_marketTypewaise",
                checked: true,
              },
            ],
          });
          permissionData["0"].permissions.push({
            id: "game_report_marketIdwaise",
            name: "game_report_marketIdwaise",
            checked: true,
            children: [
              {
                id: "game_report_marketIdwaise",
                name: "game_report_marketIdwaise",
                checked: true,
              },
            ],
          });
          permissionData["0"].permissions.push({
            id: "game_report_marketIdAndMarketTypeAll",
            name: "game_report_marketIdAndMarketTypeAll",
            checked: true,
            children: [
              {
                id: "game_report_marketIdAndMarketTypeAll",
                name: "game_report_marketIdAndMarketTypeAll",
                checked: true,
              },
            ],
          });
          permissionData["0"].permissions.push({
            id: "admin_withdrawal_datewise_details",
            name: "admin_withdrawal_datewise_details",
            checked: true,
            children: [
              {
                id: "admin_withdrawal_datewise_details",
                name: "admin_withdrawal_datewise_details",
                checked: true,
              },
            ],
          });
          permissionData["0"].permissions.push({
            id: "withdrawal_datewise_details",
            name: "withdrawal_datewise_details",
            checked: true,
            children: [
              {
                id: "withdrawal_datewise_details",
                name: "withdrawal_datewise_details",
                checked: true,
              },
            ],
          });
          permissionData["0"].permissions.push({
            id: "admin_deposit_detail",
            name: "admin_deposit_detail",
            checked: true,
            children: [
              {
                id: "admin_deposit_detail",
                name: "admin_deposit_detail",
                checked: true,
              },
            ],
          });
          permissionData["0"].permissions.push({
            id: "deposit_detail",
            name: "deposit_detail",
            checked: true,
            children: [
              {
                id: "deposit_detail",
                name: "deposit_detail",
                checked: true,
              },
            ],
          });
          permissionData["0"].permissions.push({
            id: "deposit_list_report_getway_wise_all",
            name: "deposit_list_report_getway_wise_all",
            checked: true,
            children: [
              {
                id: "deposit_list_report_getway_wise_all",
                name: "deposit_list_report_getway_wise_all",
                checked: true,
              },
            ],
          });

          permissionData["0"].permissions.forEach((permission) => {
            // Check if the permission itself has a route (like 'home')
            if (permission.checked && permissionRouteMap[permission.id]) {
              allowedRoutes.push(permissionRouteMap[permission.id]);
            }

            // Process children if they exist
            if (permission.children && Array.isArray(permission.children)) {
              permission.children.forEach((child) => {
                if (child.checked && permissionRouteMap[child.id]) {
                  allowedRoutes.push(permissionRouteMap[child.id]);
                }
              });
            }
          });

          // 3. Remove any null/undefined values that might have slipped through
          const filteredRoutes = allowedRoutes.filter(
            (route) => route !== null && route !== undefined
          );
          setUserType({ token, type: userType });
          console.warn("filteredRoutes", filteredRoutes);
          setPermissions(filteredRoutes);
        } else {
          console.error("Permission API failed with status:", res.status);
          setPermissions([]);
        }
      }
    } catch (err) {
      console.error("Permission fetch error:", err);
      setPermissions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getQueryParams = () => {
    const params = new URLSearchParams(window.location.search);
    return Object.fromEntries(params.entries());
  };






  // useEffect(() => {
  //   const fetchUserProfile = async () => {
  //     const token = localStorage.getItem("token");
  //     if (!token) {
  //       setIsLoading(false);
  //       return;
  //     }
  //     try {
  //       const res = await fetch(
  //         `${process.env.REACT_APP_API_URL}/admin-profile`,
  //         {
  //           method: "GET",
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );
  //       if (res.status === 401) {
  //         localStorage.setItem("isLoggedIn", "false");
  //         localStorage.removeItem("token");
  //         window.location.href = "/login";
  //         return; // stop further execution
  //       }
  //       if (res.ok) {
  //         const data = await res.json();
  //         if (data.message == "Invalid Token") {
  //           localStorage.setItem("isLoggedIn", "false");
  //           localStorage.removeItem("token");
  //           const isLoggedIn = localStorage.getItem("isLoggedIn");
  //           if (isLoggedIn === "true") {
  //             //navigate('/dashboard');
  //           } else {
  //             window.location.href = "/login";
  //           }
  //         } else {
  //           const roles = data.data.roles;
  //           const userId = data.data._id;

  //           setUserType(roles);
  //           fetchPermissions(token, roles, userId); // ✅ Pass userId
  //         }
  //       }
  //     } catch (err) {
  //       console.error("Error fetching profile:", err);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchUserProfile();
  // }, []);


  useEffect(() => {
  const fetchUserProfile = async () => {
    const token = localStorage.getItem("token"); // LocalStorage token
   // console.log("LocalStorage token:", token);

    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/admin-profile`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 401) {
        localStorage.setItem("isLoggedIn", "false");
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }

      if (res.ok) {
        const data = await res.json();

        // Admin API se token console me
      //  console.log("Admin profile token:", data.data.token);
        if(data.data.token != token){
          localStorage.setItem("isLoggedIn", "false");
                  localStorage.removeItem("token");
                  window.location.href = "/login";
        }
        if (data.message === "Invalid Token") {
          localStorage.setItem("isLoggedIn", "false");
          localStorage.removeItem("token");
          window.location.href = "/login";
        } else {
          const roles = data.data.roles;
          const userId = data.data._id;

          setUserType(roles);
          fetchPermissions(token, roles, userId);
        }
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setIsLoading(false);
    }
  };

  fetchUserProfile();
}, []);





   const handleLogout = () => {
    localStorage.setItem("isLoggedIn", "false");
    localStorage.removeItem("token");
    localStorage.removeItem("adminProfile");
    window.location.href = "/login";
  };


  //localStorage.setItem("permissions", JSON.stringify(permissions));
  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loaderimage">
          <img
            src={`${process.env.PUBLIC_URL}/assets/images/logo.png`}
            alt="logo"
            className="logo-lg"
          />
        </div>
      </div>
    );
  }
  const ProtectedRoute = ({ element: Element, path }) => {
    if (isLoading) return <div>Loading...</div>;
    if (!userType) return <Navigate to="/login" replace />;
    if (
      userType.type === "tech_admin" ||
      permissions.includes("*") ||
      permissions.includes(path)
    ) {
      return (
        <Layout>
          <Element />
        </Layout>
      );
    }
    return <Navigate to="/unauthorized" replace />;
  };

  //console.log("Permissions in App.js:", permissions);
  return (
    <Router>
      <Routes>
        <Route
          path="/userchat"
          element={
            <div>
              {" "}
              <Userchat />
            </div>
          }
        />
        <Route
          path="/Chatclose"
          element={
            <div>
              {" "}
              <Chatclose />
            </div>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <Layout userType={userType} permissions={permissions}>
              <Dashboard />
            </Layout>
          }
        />


         <Route
          path="/mobile-dashboard"
          element={
            <Layout userType={userType} permissions={permissions}>
              <MobileDashboard />
            </Layout>
          }
        />



        

        <Route
          path="/adminchat"
          element={
            <Layout userType={userType} permissions={permissions}>
              <Adminchat />
            </Layout>
          }
        />
        <Route
          path="/homedashboard"
          element={
            <Layout userType={userType} permissions={permissions}>
              <HomeDashboard />
            </Layout>
          }
        />

        <Route
          path="/create_user"
          element={
            <Layout userType={userType} permissions={permissions}>
              <CreateUser />
            </Layout>
          }
        />
        <Route
          path="/all_users"
          element={
            <Layout userType={userType} permissions={permissions}>
              <UsersList />
            </Layout>
          }
        />
        {/* <Route
          path="/user_wallet_balance"
          element={
            <Layout userType={userType} permissions={permissions}>
              <UsersWalletBalance />
            </Layout>
          }
        /> */}
        <Route
          path="/active_users"
          element={
            <Layout userType={userType} permissions={permissions}>
              <ActiveUsersList />
            </Layout>
          }
        />
        <Route
          path="/user/login-user-list"
          element={
            <Layout userType={userType} permissions={permissions}>
              <LoginUsersList />
            </Layout>
          }
        />
        <Route
          path="/inactive_users"
          element={
            <Layout userType={userType} permissions={permissions}>
              <InactiveUsersList />
            </Layout>
          }
        />
        <Route
          path="/main_market_list"
          element={
            <Layout userType={userType} permissions={permissions}>
              <MainMarket />
            </Layout>
          }
        />
        <Route
          path="/king_jack_port_market_list"
          element={
            <Layout userType={userType} permissions={permissions}>
              <KingJackPortMarket />
            </Layout>
          }
        />
        <Route
          path="/king_starline_market_list"
          element={
            <Layout userType={userType} permissions={permissions}>
              <KingStarlineMarket />
            </Layout>
          }
        />

        <Route
          path="/main_market_game_load"
          element={
            <Layout userType={userType} permissions={permissions}>
              <MainMarketGameLoad />
            </Layout>
          }
        />

        <Route
          path="/king_jackport_game_load"
          element={
            <Layout userType={userType} permissions={permissions}>
              <KingJackPortMarketGameLoad />
            </Layout>
          }
        />

        <Route
          path="/king_starline_game_load"
          element={
            <Layout userType={userType} permissions={permissions}>
              <KingStarlineMarketGameLoad />
            </Layout>
          }
        />

        <Route
          path="/withdrawal_pending"
          element={
            <Layout userType={userType} permissions={permissions}>
              <Pending />
            </Layout>
          }
        />
        <Route
          path="/withdrawal_complete"
          element={
            <Layout userType={userType} permissions={permissions}>
              <Complete />
            </Layout>
          }
        />
        <Route
          path="/withdrawal_reject"
          element={
            <Layout userType={userType} permissions={permissions}>
              <Reject />
            </Layout>
          }
        />

        <Route
          path="/withdrawal_report_datewise"
          element={
            <Layout userType={userType} permissions={permissions}>
              <WithdrawalDateWiseLists />
            </Layout>
          }
        />
        <Route
          path="/admin_withdrawal_report_datewise"
          element={
            <Layout userType={userType} permissions={permissions}>
              <AdminWithdrawalDateWiseLists />
            </Layout>
          }
        />
        <Route
          path="/withdrawal_datewise_details/:date"
          element={
            <Layout userType={userType} permissions={permissions}>
              <WithdrawalDateWiseDetailPage />
            </Layout>
          }
        />
        <Route
          path="/admin_withdrawal_datewise_details/:date"
          element={
            <Layout userType={userType} permissions={permissions}>
              <AdminWithdrawalDateWiseDetailPage />
            </Layout>
          }
        />

        <Route
          path="/bank_account_pending"
          element={
            <Layout userType={userType} permissions={permissions}>
              <BankAccountPending />
            </Layout>
          }
        />
        <Route
          path="/bank_account_complete"
          element={
            <Layout userType={userType} permissions={permissions}>
              <BankAccountComplete />
            </Layout>
          }
        />
        <Route
          path="/bank_account_reject"
          element={
            <Layout userType={userType} permissions={permissions}>
              <BankAccountReject />
            </Layout>
          }
        />

        <Route
          path="/deposite_pending"
          element={
            <Layout userType={userType} permissions={permissions}>
              <DepositPending />
            </Layout>
          }
        />
        <Route
          path="/deposite_complete"
          element={
            <Layout userType={userType} permissions={permissions}>
              <DepositComplete />
            </Layout>
          }
        />
        <Route
          path="/deposite_reject"
          element={
            <Layout userType={userType} permissions={permissions}>
              <DepositReject />
            </Layout>
          }
        />

        <Route
          path="/deposite_report_datewise"
          element={
            <Layout userType={userType} permissions={permissions}>
              <DepositDateWiseLists />
            </Layout>
          }
        />
        <Route
          path="/admin_deposite_report_datewise"
          element={
            <Layout userType={userType} permissions={permissions}>
              <AdminDepositDateWiseLists />
            </Layout>
          }
        />

        <Route
          path="/deposit_detail/:date"
          element={
            <Layout userType={userType} permissions={permissions}>
              <DepositDateWiseDetailPage />
            </Layout>
          }
        />
        <Route
          path="/admin_deposit_detail/:date"
          element={
            <Layout userType={userType} permissions={permissions}>
              <AdminDepositDateWiseDetailPage />
            </Layout>
          }
        />

        <Route
          path="/deposit_list_report_getway_wise_all"
          element={
            <Layout userType={userType} permissions={permissions}>
              <DepositGatewayWiseAll />
            </Layout>
          }
        />

        {/* <Route
          path="/point_management_add_point"
          element={
            <Layout userType={userType} permissions={permissions}>
              <AddPoint />
            </Layout>
          }
        />
        <Route
          path="/point_management_deduct_point"
          element={
            <Layout userType={userType} permissions={permissions}>
              <DeductPoint />
            </Layout>
          }
        />

        <Route
          path="/point_user_wallet_balance"
          element={
            <Layout userType={userType} permissions={permissions}>
              <DeductPoint />
            </Layout>
          }
        />

        <Route
          path="/admin_add_point_history"
          element={
            <Layout userType={userType} permissions={permissions}>
              <AdminAddPointHistory />
            </Layout>
          }
        />
        <Route
          path="/auto_point_add_history"
          element={
            <Layout userType={userType} permissions={permissions}>
              <AutoPointAddHistory />
            </Layout>
          }
        /> */}

        <Route
          path="/create_roles"
          element={
            <Layout userType={userType} permissions={permissions}>
              <RolesAndPermissions />
            </Layout>
          }
        />

        <Route
          path="/all_roles"
          element={
            <Layout userType={userType} permissions={permissions}>
              <CreatedRolesAndPermissions userType={userType} />
            </Layout>
          }
        />

        <Route
          path="/active_roles"
          element={
            <Layout userType={userType} permissions={permissions}>
              <ActiveRolesAndPermissions />
            </Layout>
          }
        />

        <Route
          path="/inactive_roles"
          element={
            <Layout userType={userType} permissions={permissions}>
              <InactiveRolesAndPermissions />
            </Layout>
          }
        />

        <Route
          path="/bet_history_pending"
          element={
            <Layout userType={userType} permissions={permissions}>
              <BetHistory />
            </Layout>
          }
        />
        <Route
          path="/bet_history_success"
          element={
            <Layout userType={userType} permissions={permissions}>
              <BetHistorySuccess />
            </Layout>
          }
        />

        <Route
          path="/game_load_bet_loss_lists"
          element={
            <Layout userType={userType} permissions={permissions}>
              <GameLoadBetLossLists />
            </Layout>
          }
        />

        <Route
          path="/game_report_datewise"
          element={
            <Layout userType={userType} permissions={permissions}>
              <GameReportDateWiseLists />
            </Layout>
          }
        />

        <Route
          path="/game_report_marketTypewaise/:date"
          element={
            <Layout userType={userType} permissions={permissions}>
              <GameReportDateWiseDetailsPage />
            </Layout>
          }
        />

        <Route
          path="/game_report_marketIdwaise/:markettypeURL"
          element={
            <Layout userType={userType} permissions={permissions}>
              <GameReportMarketIdWaise />
            </Layout>
          }
        />

        <Route
          path="/game_report_marketIdAndMarketTypeAll/"
          element={
            <Layout userType={userType} permissions={permissions}>
              <GameReportMarketIdAndMarketTypeAll />
            </Layout>
          }
        />

        <Route
          path="/declare_main"
          element={
            <Layout userType={userType} permissions={permissions}>
              <MainMarketDeclare />
            </Layout>
          }
        />
        <Route
          path="/declare_king_jack"
          element={
            <Layout userType={userType} permissions={permissions}>
              <KingJackPortMarketDeclare />
            </Layout>
          }
        />

        <Route
          path="/declare_king_starline"
          element={
            <Layout userType={userType} permissions={permissions}>
              <KingStarlineMarketDeclare />
            </Layout>
          }
        />
        {/*         
        <Route
          path="/running_main_market_lists"
          element={
            <Layout userType={userType} permissions={permissions}>
              <MainGame />
            </Layout>
          }
        />
        <Route
          path="/running_king_jack_port_lists"
          element={
            <Layout userType={userType} permissions={permissions}>
              <Kingjackportrunning />
            </Layout>
          }
        />

        <Route
          path="/running_king_starline_lists"
          element={
            <Layout userType={userType} permissions={permissions}>
              <Kingstarlinerunning />
            </Layout>
          }
        /> */}
        <Route
          path="/update_rates"
          element={
            <Layout userType={userType} permissions={permissions}>
              <AllGameRates />
            </Layout>
          }
        />
        <Route
          path="/update_rates_userWaise/:userid"
          element={
            <Layout userType={userType} permissions={permissions}>
              <AllGameRatesUserWaise />
            </Layout>
          }
        />
        {/* <Route
          path="/upload-old-main-market-list"
          element={
            <Layout userType={userType} permissions={permissions}>
              <MainMarketUpload />
            </Layout>
          }
        />
        <Route
          path="/upload-old-delhi-market-list"
          element={
            <Layout userType={userType} permissions={permissions}>
              <DelhiMarketUpload />
            </Layout>
          }
        />
        <Route
          path="/upload-old-starline-market-list-n"
          element={
            <Layout userType={userType} permissions={permissions}>
              <StarlineMarketUpload />
            </Layout>
          }
        /> */}
        {/* <Route
          path="/bidding_report"
          element={
            <Layout userType={userType} permissions={permissions}>
              <BidingReport />
            </Layout>
          }
        />
        <Route
          path="/user_bidding_report"
          element={
            <Layout userType={userType} permissions={permissions}>
              <UserBidingReport />
            </Layout>
          }
        />
        <Route
          path="/user_full_bidding_report"
          element={
            <Layout userType={userType} permissions={permissions}>
              <UserFullBidingDetails />
            </Layout>
          }
        />
        <Route
          path="/user_transactions_history"
          element={
            <Layout userType={userType} permissions={permissions}>
              <TransactionHistory />
            </Layout>
          }
        />
        <Route
          path="/user_winner_history"
          element={
            <Layout userType={userType} permissions={permissions}>
              <WinnersHistory />
            </Layout>
          }
        />
        <Route
          path="/user_result_analysis_history"
          element={
            <Layout userType={userType} permissions={permissions}>
              <ResultAnalysisHistory />
            </Layout>
          }
        /> */}
        {/* <Route
          path="/banners/index"
          element={
            <Layout userType={userType} permissions={permissions}>
              <Banners />
            </Layout>
          }
        /> */}
        <Route
          path="/notice_management"
          element={
            <Layout userType={userType} permissions={permissions}>
              <NoticeManagement />
            </Layout>
          }
        />

         <Route
          path="/notice-board-management"
          element={
            <Layout userType={userType} permissions={permissions}>
              <NoticeBoardManagement />
            </Layout>
          }
        />


        

        <Route
          path="/config"
          element={
            <Layout userType={userType} permissions={permissions}>
              <AppSetting />
            </Layout>
          }
        />
        <Route
          path="/color_lists"
          element={
            <Layout userType={userType} permissions={permissions}>
              <ColorSetting />
            </Layout>
          }
        />

        <Route
          path="/pay_in_gateway_settings"
          element={
            <Layout userType={userType} permissions={permissions}>
              <PayInGatewaySettings />
            </Layout>
          }
        />

        <Route
          path="/video_lists"
          element={
            <Layout userType={userType} permissions={permissions}>
              <VideoList />
            </Layout>
          }
        />

        <Route
          path="/withdrawal_pending_Approve"
          element={
            <Layout userType={userType} permissions={permissions}>
              <WithdrawPendingApporve />
            </Layout>
          }
        />
        <Route
          path="/Ledger/:userid"
          element={
            <Layout userType={userType} permissions={permissions}>
              <Ledger />
            </Layout>
          }
        />
        <Route
          path="/bet_history_userwaise/:userid"
          element={
            <Layout userType={userType} permissions={permissions}>
              <BetHistoryUserwaise />
            </Layout>
          }
        />
        <Route
          path="/login_history/:userid"
          element={
            <Layout userType={userType} permissions={permissions}>
              <LoginHistory />
            </Layout>
          }
        />

        <Route
          path="/idea_submit_lists"
          element={
            <Layout userType={userType} permissions={permissions}>
              <IdeaSubmitList />
            </Layout>
          }
        />
        <Route
          path="/slider_lists"
          element={
            <Layout userType={userType} permissions={permissions}>
              <Slider />
            </Layout>
          }
        />

        <Route
          path="/notification/notification-list"
          element={
            <Layout userType={userType} permissions={permissions}>
              <SendNotification />
            </Layout>
          }
        />
        {/* <Route
                  path="/adminchat/adminchat-view?user_id=:userId"
                  element={
                    <Layout userType={userType} permissions={permissions}>
                      <AdminchattingPage />
                    </Layout>
                  }
              /> */}

        <Route
          path="/adminchat/adminchat-view"
          element={
            <Layout userType={userType} permissions={permissions}>
              <AdminchattingPage />
            </Layout>
          }
        />
        
        <Route
          path="/upload-result-inCSV"
          element={
            <Layout userType={userType} permissions={permissions}>
              <UploadResultInCSV />
            </Layout>
          }
        />

         <Route
          path="/upload-manul-results"
          element={
            <Layout userType={userType} permissions={permissions}>
              <UploadManualResults />
            </Layout>
          }
        />

        {/* <Route path="/logout" element={<Layout><Logout /></Layout>} /> */}
      </Routes>
    </Router>
  );
};

export default App;
