import React, { useState, useEffect } from "react";
import { IoChatboxEllipses } from "react-icons/io5";
import "./Sidebar.scss";
import { IoIosArrowDown } from "react-icons/io";
import { BsBank } from "react-icons/bs";

import { IoMdClose } from "react-icons/io";
import { useNavigate, useLocation, Link } from "react-router-dom";
const Sidebar = ({ isOpen, onToggleSidebar, userType, permissions }) => {
  const [activeParent, setActiveParent] = useState(null);
  const [activeDropdowns, setActiveDropdowns] = useState({});
    const [sideBarClose, setSideBarClose] = useState(false);
  
  const [activeItem, setActiveItem] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
    useEffect(() =>{
          if(isMobileview){
          setSideBarClose(true)
  
          }else{
         setSideBarClose(false)
   
          }
    },[isMobileview])
  const toggleDropdown = (id) => {
    setActiveDropdowns((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  const handleItemClick = (item) => {
    if(sideBarClose){
       onToggleSidebar();
    }
    setActiveItem(item.id);
    if (item.id === "logout") {
      item.onClick?.();
    } else if (item.href && item.href !== "#") {
      navigate(item.href);
    }
  };
  const isAllAccessUser = userType === "tech_admin";
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/login";
  };
  const isPermitted = (href) => {
    if (isAllAccessUser || permissions.includes("*")) return true;
    return permissions.includes(href);
  };

  const menuItems = [
    {
      section: "Menu",
      items: [
        {
          id: "homedashboard",
          title: "HomeDashboard",
          href: "/homedashboard",
          icon: (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          ),
        },
        {
          id: "dashboard",
          title: "Dashboard",
          href: "/dashboard",
          icon: (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          ),
        },

        {
          id: "adminchat",
          title: "Adminchat",
          href: "/adminchat",
          icon: <IoChatboxEllipses />,
        },

        {
          id: "RolesAndPermissionsManagement",
          title: "Roles & Permissions",
          dropdown: true,
          icon: (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          ),
          children: [
            {
              id: "create-roles",
              title: "Create Roles",
              href: "/create_roles",
              onClick: onToggleSidebar,
            },
            {
              id: "all-roles",
              title: "All Roles",
              href: "/all_roles",
              onClick: onToggleSidebar,
            },
            {
              id: "active-roles",
              title: "Active Roles",
              href: "/active_roles",
              onClick: onToggleSidebar,
            },
            {
              id: "inactive-roles",
              title: "Inactive Roles",
              href: "/inactive_roles",
              onClick: onToggleSidebar,
            },
          ],
        },

        {
          id: "user",
          title: "Application User",
          dropdown: true,
          active: true,
          icon: (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          ),
          children: [
            {
              id: "create-user",
              title: "Create user",
              href: "/create_user",
              onClick: onToggleSidebar,
            },
            {
              id: "users-list",
              title: "Users List",
              href: "/all_users",
              onClick: onToggleSidebar,
            },
            {
              id: "active-users",
              title: "Active Users List",
              href: "/active_users",
              onClick: onToggleSidebar,
            },
            {
              id: "inactive-users",
              title: "Inactive Users List",
              href: "/inactive_users",
              onClick: onToggleSidebar,
            },
            {
              id: "wallet-balance",
              title: "Users Wallet Balance",
              href: "/user_wallet_balance",
              onClick: onToggleSidebar,
            },
          ],
        },
        {
          id: "GameManagement",
          title: "Market",
          dropdown: true,
          icon: (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="2" y="4" width="20" height="16" rx="2"></rect>
              <path d="M2 8h20"></path>
              <path d="M6 8v12"></path>
            </svg>
          ),
          children: [
            {
              id: "main-market",
              title: "Main Market",
              href: "/main_market_list",
              onClick: onToggleSidebar,
            },
            {
              id: "king-jack-port",
              title: "King Jack Port Market",
              href: "/king_jack_port_market_list",
              onClick: onToggleSidebar,
            },
            {
              id: "king-starline",
              title: "King Starline Market",
              href: "/king_starline_market_list",
              onClick: onToggleSidebar,
            },
          ],
        },
        {
          id: "withdrawal_management",
          title: "Withdrawal",
          dropdown: true,
          icon: (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          ),
         children: [
            {
              id: "withdrawal-pending",
              title: "Pending",
              href: "/withdrawal_pending",
              onClick: onToggleSidebar,
            },
            {
              id: "withdrawal-pending-approved",
              title: "Approved",
              href: "/withdrawal_pending_Approve",
              onClick: onToggleSidebar,
            },
            {
              id: "withdrawal-complete",
              title: "Success",
              href: "/withdrawal_complete",
              onClick: onToggleSidebar,
            },
            {
              id: "withdrawal-reject",
              title: "Reject",
              href: "/withdrawal_reject",
              onClick: onToggleSidebar,
            },
 
            {
              id: "withdrawal_report_datewise",
              title: "Date Wise Report",
              href: "/withdrawal_report_datewise",
              onClick: onToggleSidebar,
            },
          ],
        },

        {
          id: "bank_account_management",
          title: "Bank Accounts",
          dropdown: true,
          icon: (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 10l9-7 9 7" />
              <path d="M4 10h16v10H4z" />
              <line x1="8" y1="20" x2="8" y2="10" />
              <line x1="12" y1="20" x2="12" y2="10" />
              <line x1="16" y1="20" x2="16" y2="10" />
            </svg>
          ),
          children: [
            {
              id: "bank_account_pending",
              title: "Pending",
              href: "/bank_account_pending",
              onClick: onToggleSidebar,
            },
            {
              id: "bank_account_complete",
              title: "Complete",
              href: "/bank_account_complete",
              onClick: onToggleSidebar,
            },
            {
              id: "bank_account_reject",
              title: "Reject",
              href: "/bank_account_reject",
              onClick: onToggleSidebar,
            },
          ],
        },





        {
          id: "deposit_management",
          title: "Deposit",
          dropdown: true,
          icon: (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 10l9-7 9 7" />
              <path d="M4 10h16v10H4z" />
              <line x1="8" y1="20" x2="8" y2="10" />
              <line x1="12" y1="20" x2="12" y2="10" />
              <line x1="16" y1="20" x2="16" y2="10" />
            </svg>
          ),
          children: [
            {
              id: "deposite_pending",
              title: "Pending",
              href: "/deposite_pending",
              onClick: onToggleSidebar,
            },
            {
              id: "deposite_complete",
              title: "Complete",
              href: "/deposite_complete",
              onClick: onToggleSidebar,
            },
            {
              id: "deposite_reject",
              title: "Reject",
              href: "/deposite_reject",
              onClick: onToggleSidebar,
            },

               {
              id: "deposite_report_datewise",
              title: "Date Wise Report",
              href: "/deposite_report_datewise",
              onClick: onToggleSidebar,
            },

          ],
        },


        // {
        //   id: "WalletManagement",
        //   title: "Point Management",

        //   dropdown: true,
        //   icon: (
        //     <svg
        //       width="24"
        //       height="24"
        //       viewBox="0 0 24 24"
        //       fill="none"
        //       stroke="currentColor"
        //       strokeWidth="2"
        //     >
        //       <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        //       <polyline points="7 10 12 15 17 10"></polyline>
        //       <line x1="12" y1="15" x2="12" y2="3"></line>
        //     </svg>
        //   ),
        //   children: [
        //     {
        //       id: "add-point",
        //       title: "Add Point",
        //       href: "/point_management_add_point",
        //       onClick: onToggleSidebar,
        //     },
        //     {
        //       id: "deduct-point",
        //       title: "Deduct Point",
        //       href: "/point_management_deduct_point",
        //       onClick: onToggleSidebar,
        //     },
        //     {
        //       id: "user-wallet-balance",
        //       title: "User Wallet Balance",
        //       href: "/point_user_wallet_balance",
        //       onClick: onToggleSidebar,
        //     },
        //     {
        //       id: "add-point-history",
        //       title: "Admin Add Point History",
        //       href: "/admin_add_point_history",
        //       onClick: onToggleSidebar,
        //     },
        //     {
        //       id: "auto-point-history",
        //       title: "Auto Point Add History",
        //       href: "/auto_point_add_history",
        //       onClick: onToggleSidebar,
        //     },
        //   ],
        // },

        {
          id: "BetHistoryManagement",
          title: "Bet History",
          dropdown: true,
          icon: (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          ),
          children: [
            {
              id: "bet-pending",
              title: "Pending Bet List",
              href: "/bet_history_pending",
              onClick: onToggleSidebar,
            },
            {
              id: "bet-success",
              title: "Win Bet List",
              href: "/bet_history_success",
              onClick: onToggleSidebar,
            },

            {
              id: "game_load_bet_loss_lists",
              title: "Loss Bet List",
              href: "/game_load_bet_loss_lists",
              onClick: onToggleSidebar,
            },

              {
              id: "game_report_datewise",
              title: "Game Report Datewise",
              href: "/game_report_datewise",
              onClick: onToggleSidebar,
            },


          ],
        },

        {
          id: "declare_result",
          title: "Declare Result",
          dropdown: true,
          icon: (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          ),
          children: [
            {
              id: "main-market-result",
              title: "Main Market",
              href: "/declare_main",
              onClick: onToggleSidebar,
            },
            {
              id: "king-jack-port-result",
              title: "King Jack Port Market",
              href: "/declare_king_jack",
              onClick: onToggleSidebar,
            },
            {
              id: "king-starline-result",
              title: "King Starline Market",
              href: "/declare_king_starline",
              onClick: onToggleSidebar,
            },
          ],
        },
        // {
        //   id: "runningGame",
        //   title: "Running Game",
        //   dropdown: true,
        //   icon: (
        //     <svg
        //       width="24"
        //       height="24"
        //       viewBox="0 0 24 24"
        //       fill="none"
        //       stroke="currentColor"
        //       strokeWidth="2"
        //     >
        //       <path d="M12 20v-6"></path>
        //       <path d="M6 20V10"></path>
        //       <path d="M18 20V4"></path>
        //     </svg>
        //   ),
        //   children: [
        //     {
        //       id: "main-game",
        //       title: "Main Game",
        //       href: "/running_main_market_lists",
        //       onClick: onToggleSidebar,
        //     },
        //     {
        //       id: "king-jack-port-game",
        //       title: "King Jack Port Market",
        //       href: "/running_king_jack_port_lists",
        //       onClick: onToggleSidebar,
        //     },
        //     {
        //       id: "king-starline-game",
        //       title: "King Starline Game",
        //       href: "/running_king_starline_lists",
        //       onClick: onToggleSidebar,
        //     },
        //   ],
        // },
        {
          id: "gameRates",
          title: "Game Rates",
          dropdown: true,
          icon: (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 20v-6"></path>
              <path d="M6 20V10"></path>
              <path d="M18 20V4"></path>
            </svg>
          ),
          children: [
            {
              id: "all-game-rates",
              title: "All Game Rates",
              href: "/update_rates",
              onClick: onToggleSidebar,
            },
          ],
        },

        // {
        //   id: "ecom_dr21",
        //   title: "Report Management",
        //   dropdown: true,
        //   icon: (
        //     <svg
        //       width="24"
        //       height="24"
        //       viewBox="0 0 24 24"
        //       fill="none"
        //       stroke="currentColor"
        //       strokeWidth="2"
        //     >
        //       <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        //       <polyline points="14 2 14 8 20 8"></polyline>
        //       <line x1="16" y1="13" x2="8" y2="13"></line>
        //       <line x1="16" y1="17" x2="8" y2="17"></line>
        //       <polyline points="10 9 9 9 8 9"></polyline>
        //     </svg>
        //   ),
        //   children: [
        //     {
        //       id: "biding-report",
        //       title: "Biding Report",
        //       href: "/bidding_report",
        //        onClick: onToggleSidebar,
        //     },
        //     {
        //       id: "user-biding-report",
        //       title: "User Biding Report",
        //       href: "/user_bidding_report",
        //        onClick: onToggleSidebar,
        //     },
        //     {
        //       id: "full-biding-details",
        //       title: "User FullBiding Details",
        //       href: "/user_full_bidding_report",
        //        onClick: onToggleSidebar,
        //     },
        //     {
        //       id: "transaction-history",
        //       title: "Transaction History",
        //       href: "/user_transactions_history",
        //        onClick: onToggleSidebar,
        //     },
        //     {
        //       id: "winners-history",
        //       title: "Winners History",
        //       href: "/user_winner_history",
        //        onClick: onToggleSidebar,
        //     },
        //     {
        //       id: "result-analysis",
        //       title: "Result Analysis History",
        //       href: "/user_result_analysis_history",
        //        onClick: onToggleSidebar,
        //     },
        //   ],
        // },
        {
          id: "noticeManagement",
          title: "Notice Management",
          dropdown: true,
          icon: (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"></path>
            </svg>
          ),
          children: [
            {
              id: "notice-management",
              title: "Notice Management",
              href: "/notice_management",
              onClick: onToggleSidebar,
            },
          ],
        },

        {
          id: "pay_in_gateway_settings",
          title: "Gateway Settings",
          dropdown: true,
          icon: (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          ),
          children: [
            {
              id: "pay_in_gateway_settings",
              title: "PayIn Gateway Settings",
              href: "/pay_in_gateway_settings",
              onClick: onToggleSidebar,
            },
          ],
        },

        {
          id: "settingManagement",
          title: "App Settings",
          dropdown: true,
          icon: (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          ),
          children: [
            {
              id: "app-setting",
              title: "App Setting",
              href: "/config",
              onClick: onToggleSidebar,
            },

            {
              id: "video_lists",
              title: "Video Lists",
              href: "/video_lists",
              onClick: onToggleSidebar,
            },

            {
              id: "idea_submit_lists",
              title: "Idea Submit Lists",
              href: "/idea_submit_lists",
              onClick: onToggleSidebar,
            },

            // {
            //   id: "send-notification",
            //   title: "Send Notification",
            //   href: "/notification/notification-list",
            // },
          ],
        },
        {
          id: "logout",
          title: "Logout",
          onClick: handleLogout,
          href: "#",
          icon: (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          ),
        },
      ],
    },
  ];

  useEffect(() => {
    const findActiveItem = (items) => {
      for (const item of items) {
        if (item.href === location.pathname) {
          return { itemId: item.id, parentId: null };
        }
        if (item.children) {
          const childMatch = item.children.find(
            (child) => child.href === location.pathname
          );
          if (childMatch) {
            setActiveDropdowns({ [item.id]: true }); // Open only the matching parent
            return { itemId: childMatch.id, parentId: item.id };
          }
        }
      }
      return { itemId: null, parentId: null };
    };

    for (const section of menuItems) {
      const { itemId, parentId } = findActiveItem(section.items);
      if (itemId) {
        setActiveItem(itemId);
        setActiveParent(parentId);
        break;
      } else {
        setActiveItem(null);
        setActiveParent(null);
        setActiveDropdowns({}); // Close all dropdowns if no match
      }
    }
  }, [location.pathname]);
  const renderMenuItem = (item, level = 0) => {
    const isDropdownOpen = activeDropdowns[item.id];
    const isActive = activeItem === item.id || activeParent === item.id;
    const canShowItem =
      item.id === "logout" || // Always show logout
      isPermitted(item.href) || // Check permission for this item
      (item.dropdown &&
        item.children?.some((child) => isPermitted(child.href))); // Check any submenu allowed
    if (!canShowItem) return null;
    return (
      <li key={item.id} className={`menu-item ${isActive ? "active" : ""}`}>
        <Link
          to={item.dropdown ? "#" : item.href || "#"}
          className="menu-link"
          //   onClick={(e) => {
          //     if (item.onClick) {
          //       item.onClick();
          //     } else if (item.dropdown) {
          //       toggleDropdown(item.id);
          //     } else {
          //       handleItemClick(item.id);
          //     }
          //   }
          //    onToggleSidebar();
          // }
          onClick={(e) => {
            if (item.onClick) {
              item.onClick();
            } else if (item.dropdown) {
              toggleDropdown(item.id);
            } else {
              handleItemClick(item.id);
              onToggleSidebar();
            }
          }}
        >
          {item.icon && <span className="menu-icon">{item.icon}</span>}
          <span className="menu-text">{item.title}</span>
          {item.badge && (
            <span className={`badge ${item.badge.class}`}>
              {item.badge.text}
            </span>
          )}
          {item.dropdown && (
            <span className={`menu-arrow ${isDropdownOpen ? "open" : ""}`}>
              <IoIosArrowDown />
            </span>
          )}
        </Link>
        {/* Submenu */}
        {item.dropdown && isDropdownOpen && item.children && (
          <div className="collapse show">
            <ul className="sub-menu">
              {item.children.map((child) => {
                const canShowChild = isPermitted(child.href);
                if (!canShowChild) return null;

                return child.dropdown ? (
                  renderMenuItem(child, level + 1)
                ) : (
                  <li
                    key={child.id}
                    className={`menu-item ${
                      activeItem === child.id ? "active" : ""
                    }`}
                  >
                    <Link
                      to={child.href}
                      className="menu-link"
                      // onClick={() => handleItemClick(child.id, item.id)}
                      onClick={() => {
                        handleItemClick(child.id, item.id);
                        onToggleSidebar();
                      }}
                    >
                      <span className="menu-text">{child.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </li>
    );
  };

  return (
    <React.Fragment>
      <div className={`sidebar ${!isOpen ? "closed" : ""}`}>
        {!isOpen && (
          <div className="overlaysidebar" onClick={onToggleSidebar}></div>
        )}
        {!isOpen && (
          <div className="closebutton" onClick={onToggleSidebar}>
            <IoMdClose />
          </div>
        )}
        <div className="main-menu">
          <div className="logo-box">
            <a className="logo-light" href="/dashboard">
              <img
                src={`${process.env.PUBLIC_URL}/assets/images/logosidebar.png`}
                alt="logo"
                className="logo-lg"
                height="40"
              />
            </a>
          </div>
          <div className="sidebar-content">
            <ul className="app-menu">
              {menuItems.map((section) => (
                <React.Fragment key={section.section}>
                  <li className="menu-title">{section.section}</li>
                  {section.items.map((item) => renderMenuItem(item))}
                </React.Fragment>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default Sidebar;
