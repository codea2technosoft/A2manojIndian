// src/Utils/permission.js
import React from "react";
import { Navigate } from "react-router-dom";
import Layout from "../Layout/Layout";

// Route to permission mapping
export const ROUTE_PERMISSION_MAP = {
  "/homedashboard": "homedashboard",
  "/dashboard": "dashboard",
  "/adminchat": "adminchat",
  "/adminchat/adminchat-view": "adminchat",
  "/create_user": "create_user",
  "/edituser/:id": "edit_user",
  "/all_users": "all_users",
  "/active_users": "active_users",
  "/inactive_users": "inactive_users",
  "/user-Note/:user_id": "user_notes",
  "/user-NoteList": "user_notes",
  "/user/login-user-list": "login_users",
  "/withdrawal_pending": "withdrawal_pending",
  "/withdrawal_complete": "withdrawal_complete",
  "/withdrawal_reject": "withdrawal_reject",
  "/withdrawal_report_datewise": "withdrawal_reports",
  "/admin_withdrawal_report_datewise": "withdrawal_reports",
  "/withdrawal_datewise_details/:date": "withdrawal_reports",
  "/admin_withdrawal_datewise_details/:date": "withdrawal_reports",
  "/bank_account_pending": "bank_accounts",
  "/bank_account_complete": "bank_accounts",
  "/bank_account_reject": "bank_accounts",
  "/deposite_pending": "deposit_pending",
  "/deposite_complete": "deposit_complete",
  "/deposite_reject": "deposit_reject",
  "/deposite_report_datewise": "deposit_reports",
  "/admin_deposite_report_datewise": "deposit_reports",
  "/deposit_detail/:date": "deposit_reports",
  "/admin_deposit_detail/:date": "deposit_reports",
  "/deposit_list_report_getway_wise_all": "deposit_reports",
  "/bet_history_pending": "bet_history",
  "/bet_history_success": "bet_history",
  "/all_bets_lists": "all_bets",
  "/game_load_bet_loss_lists": "game_reports",
  "/game_report_datewise": "game_reports",
  "/game_report_marketTypewaise/:date": "game_reports",
  "/game_report_marketIdwaise/:markettypeURL": "game_reports",
  "/game_report_marketIdAndMarketTypeAll/": "game_reports",
  "/declare_main": "declare_main",
  "/declare_king_jack": "declare_king_jack",
  "/config": "app_settings",
  "/color_lists": "color_settings",
  "/video_lists": "video_management",
  "/withdrawal_pending_Approve": "withdrawal_approve",
  "/Ledger/:userid": "ledger",
  "/bet_history_userwaise/:userid": "user_bet_history",
  "/login_history/:userid": "login_history",
  "/idea_submit_lists": "idea_management",
  "/slider_lists": "slider_management",
  "/notification/notification-list": "notification_management",
  "/sports": "sports_management",
  "/cricket": "cricket_management",
  "/view_event/:matchId": "event_management",
  "/inActive_events": "event_management",
  "/active_events": "event_management",
  "/complete_events": "event_management",
  "/fancy_Managment": "fancy_management",
  "/view_match/:matchId": "fancy_management",
  "/view_fancy/:eventId": "fancy_management",
  "/view_result/:eventId": "fancy_management",
  "/userwallet/:id": "user_wallet",
  "/admin_deposit_lists": "admin_deposits",
  "/admin_withdrow_lists": "admin_withdrawals",
  "/sub_admin": "subadmin_management",
  "/sub_admin-permission-list/:id": "subadmin_permissions",
  "/pending_bets_lists": "pending_bets",
  "/success_bets_lists": "success_bets", 
  "/deleted-userlist": "deleted_users", 

};

// Get current user type
export const getUserType = () => {
  return localStorage.getItem("userType") || "admin";
};

// Check if user has permission for a route
export const hasPermission = (path) => {
  const userType = getUserType();
  if (userType === "tech_admin" || userType === "admin") return true;

  const userPermissions = JSON.parse(localStorage.getItem("permissions") || "[]");
  const requiredPermission = ROUTE_PERMISSION_MAP[path];
  return userPermissions.includes(requiredPermission) || userPermissions.includes("*") || userPermissions.includes("all_access");
};

// ProtectedRoute component
export const ProtectedRoute = ({ element: Element, path, ...props }) => {
  const token = localStorage.getItem("token");
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (!token || !isLoggedIn) return <Navigate to="/login" replace />;
  if (!hasPermission(path)) return <Navigate to="/unauthorized" replace />;

  return (
    <Layout userType={{ type: getUserType() }}>
      <Element {...props} />
    </Layout>
  );
};
