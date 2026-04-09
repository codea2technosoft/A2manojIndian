import React, { useState, useEffect } from "react";
import { IoChatboxEllipses } from "react-icons/io5";
import "./Sidebar.scss";
import { IoIosArrowDown } from "react-icons/io";
import { BsBank } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { useNavigate, useLocation, Link, NavLink } from "react-router-dom";
import { MdOutlineSupervisorAccount } from "react-icons/md";
import { BiMoneyWithdraw } from "react-icons/bi";


const Sidebar = ({ isOpen, onToggleSidebar, userType }) => {
  const [activeParent, setActiveParent] = useState(null);
  const [activeDropdowns, setActiveDropdowns] = useState({});
  const [sideBarClose, setSideBarClose] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobileview = window.innerWidth <= 991;
  const userTypes = localStorage.getItem("isLoggedIn");
  const storedPermissions = JSON.parse(localStorage.getItem("permissions")) || [];

  const [isDark, setIsDark] = useState(false);


  const handleReloadLogic = (itemId) => {
    const adminId = localStorage.getItem("admin_id_new");
    const alreadyReloaded = sessionStorage.getItem("admin_reload_done");

    if (adminId) {
      localStorage.removeItem("admin_id_new");
      sessionStorage.setItem("admin_reload_done", "true");

      // setTimeout(() => {
      //   window.location.reload();
      // }, 0);
      return;
    }

    if (
      !alreadyReloaded &&
      (itemId === "agent_lists" || itemId === "myuserMaster")
    ) {
      sessionStorage.setItem("admin_reload_done", "true");

      setTimeout(() => {
        window.location.reload();
      }, 0);
    }
  };

  // 🔍 Recursive function to find active item and its parents
  const findActiveItemAndParents = (items, pathname, parentChain = []) => {
    for (let item of items) {
      // ✅ Check if current item matches
      if (item.path === pathname) {
        return {
          activeId: item.id,
          parents: parentChain,
        };
      }

      // 🔁 Check children recursively
      if (item.children && item.children.length > 0) {
        const found = findActiveItemAndParents(
          item.children,
          pathname,
          [...parentChain, item.id]
        );

        if (found) return found;
      }
    }
    return null;
  };

  // 🔄 Find active item when location changes
  useEffect(() => {
    console.log("Current pathname:", location.pathname);

    for (const section of menuItems) {
      const result = findActiveItemAndParents(section.items, location.pathname);

      if (result) {
        console.log("Found active item:", result);
        setActiveItem(result.activeId);

        // Open all parent dropdowns
        const newDropdowns = {};
        result.parents.forEach(parentId => {
          newDropdowns[parentId] = true;
        });

        setActiveDropdowns(newDropdowns);
        return;
      }
    }

    // If no match found
    setActiveItem(null);
    setActiveDropdowns({});
  }, [location.pathname]);

  // 🔄 Handle mobile view
  useEffect(() => {
    if (isMobileview) {
      setSideBarClose(true);
    } else {
      setSideBarClose(false);
    }
  }, [isMobileview]);

  // 📂 Toggle dropdown
  const toggleDropdown = (id) => {
    setActiveDropdowns((prev) => ({
      // ...prev,
      [id]: !prev[id],
    }));
  };

  // 🎯 Handle item click
  const handleItemClick = (item, parentId = null, e) => {
    if (e) e.preventDefault();
    if (sideBarClose) {
      onToggleSidebar();
    }

    setActiveItem(item.id);

    if (item.onClick) {
      item.onClick?.();
    } else if (item.path && item.path !== "#") {
      navigate(item.path);
    }
    handleReloadLogic(item.id);

    // If this is a child item, ensure parent dropdown is open
    if (parentId) {
      setActiveDropdowns(prev => ({
        ...prev,
        [parentId]: true
      }));
    }
  };

  // 🚪 Handle logout
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    // window.location.path = "/login";
    navigate("/login", { replace: true });

  };

  // 🔒 Check permissions
  const isPermitted = (id) => {
    // if (userTypes === "admin" || userTypes === "tech_admin") return true;
    if (userTypes === "true") return true;
    if (!id) return true;
    return storedPermissions.includes(id);
  };

  // 🌙 Dark mode detection
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.body.classList.contains("dark-theme"));
    };

    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // 🔄 Render menu item recursively
  const renderMenuItem = (item, level = 0, parentId = null) => {
    const isDropdownOpen = activeDropdowns[item.id];
    const isActive = activeItem === item.id;
    const currentPath = location.pathname;
    const checkIfActive = (menuItem) => {
      if (menuItem.path === currentPath) return true;
      if (menuItem.children) {
        return menuItem.children.some(checkIfActive);
      }
      return false;
    };

    const isItemOrChildActive = checkIfActive(item);

    // Check if item or any of its children are permitted
    const canShowItem =
      isPermitted(item.id) ||
      (item.dropdown && item.children?.some(child => isPermitted(child.id)));

    if (!canShowItem) return null;

    return (
      <li
        key={item.id}
        className={`
          menu-item 
          ${isActive ? "active" : ""}
          ${level > 0 ? "sub-item" : ""}
          level-${level}
        `}
      >
        {/* <Link
          to={item.dropdown ? "#" : item.path || "#"}
          className={`menu-link ${isActive ? "active-link" : ""}`}
          onClick={(e) => {
            if (item.onClick) {
              e.preventDefault();
              item.onClick();
            } else if (item.dropdown) {
              e.preventDefault();
              toggleDropdown(item.id);
            } else {
              handleItemClick(item, parentId);
            }
          }}
        > */}

        {item.dropdown ? (
          <div
            className={`menu-link ${isItemOrChildActive ? "active-link" : ""}`}
            onClick={(e) => toggleDropdown(item.id, e)}
          >
            {item.icon && <span className="menu-icon">{item.icon}</span>}
            <span className="menu-text">{item.title}</span>
            {item.badge && (
              <span className={`badge ${item.badge.class}`}>
                {item.badge.text}
              </span>
            )}
            <span className={`menu-arrow ${isDropdownOpen ? "open" : ""}`}>
              <IoIosArrowDown />
            </span>
          </div>
        ) : (
          // Regular link item
          <NavLink
            to={item.path || "#"}
            className={({ isActive }) =>
              `menu-link ${isActive ? "active-link" : ""}`
            }
            onClick={(e) => {
              if (item.onClick) {
                e.preventDefault();
                item.onClick();
              } else {
                handleItemClick(item, parentId, e);
              }
            }}
            end
          >
            {item.icon && <span className="menu-icon">{item.icon}</span>}
            <span className="menu-text">{item.title}</span>
            {item.badge && (
              <span className={`badge ${item.badge.class}`}>
                {item.badge.text}
              </span>
            )}
          </NavLink>
        )}


        {/* Submenu */}
        {item.dropdown && isDropdownOpen && item.children && (
          <div className={`collapse show`}>
            <ul className={`sub-menu level-${level + 1}`}>
              {item.children.map((child) => {
                const canShowChild = isPermitted(child.id);
                if (!canShowChild) return null;

                return child.dropdown ? (
                  renderMenuItem(child, level + 1, item.id)
                ) : (
                  <li
                    key={child.id}
                    className={`
                      menu-item 
                      ${activeItem === child.id ? "active" : ""}
                      sub-item
                      level-${level + 1}
                    `}
                  >
                    <Link
                      to={child.path}
                      className={`menu-link ${activeItem === child.id ? "active-link" : ""}`}
                      onClick={() => handleItemClick(child, item.id)}
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

  // 📋 Menu items definition - आपका original menu items array
  const menuItems = [
    {
      section: "Menu",
      items: [
        // {
        //   id: "homedashboard",
        //   title: "HomeDashboard",
        //   href: "/homedashboard",
        //   icon: (
        //     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        //       <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        //       <polyline points="9 22 9 12 15 12 15 22"></polyline>
        //     </svg>
        //   ),
        // },
        {
          id: "dashboard",
          title: "Dashboard",
          path: "/dashboard",
          // icon: (
          //   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          //     <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          //     <polyline points="7 10 12 15 17 10"></polyline>
          //     <line x1="12" y1="15" x2="12" y2="3"></line>
          //   </svg>
          // ),
        },
        // {
        //   id: "User_Managment",
        //   title: "Users",
        //   dropdown: true,
        //   icon: (
        //     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        //       <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        //       <polyline points="7 10 12 15 17 10"></polyline>
        //       <line x1="12" y1="15" x2="12" y2="3"></line>
        //     </svg>
        //   ),
        //   children: [
        //     {
        //       id: "all_users",
        //       title: "All Users List",
        //       href: "/all_users",
        //     },
        //     {
        //       id: "active_users",
        //       title: "Active Users",
        //       href: "/active_users",
        //     },
        //     {
        //       id: "inactive_users",
        //       title: "InActive Users",
        //       href: "/inactive_users",
        //     },
        //     {
        //       id: "/user-NoteList",
        //       title: "Users Note List",
        //       href: "/user-NoteList",
        //     },
        //     {
        //       id: "deleted-userlist",
        //       title: "Deleted User",
        //       href: "/deleted-userlist", // ✅ slash added
        //     },

        //   ],
        // },
        {
          id: "adminsdetails",
          title: "Users Details",
          dropdown: true,
          icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          ),
          children: [


            {
              id: "users-list",
              title: " All Users",
              path: "/users-list",
            },

            {
              id: "active-users-list",
              title: " Active Users",
              path: "/active-users-list",
            },

            {
              id: "inactive-users-list",
              title: "Inactive User Lists",
              path: "/inactive-users-list",
            },

            {
              id: "blocked-users-list",
              title: "Blocked User Lists",
              path: "/blocked-users-list",
            },



          ],
        },
        {
          id: "sportbetting",
          title: "SPORT BETTING",
          dropdown: true,
          icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          ),
          children: [

            {
              id: "inplaygame",
              title: "In Play Game ",
              path: "/inplay_game",
            },
            {
              id: "Usertransaction",
              title: "Completed Game ",
              path: "/completed_game",
            },
            {
              id: "Bethistory",
              title: "fancy bets pending  history  ",
              path: "/Bethistory",
            },
            {
              id: "Allmatchhistory",
              title: "All match  pending  history  ",
              path: "/Allmatchhistory",
            },
            {
              id: "SettledBethistory",
              title: "settled  bets history  ",
              path: "/SettledBethistory",
            },
            // {
            //   id: "Settledmatchhistory",
            //   title: "settled match  bets history  ",
            //   path: "/Settledmatchhistory",
            // },



          ],
        },



         {
          id: "bank_acoount",
          title: "Account management",
          dropdown: true,
  icon: <MdOutlineSupervisorAccount />,

          children: [

            {
              id: "bank_account_pending",
              title: "Pending",
              path: "/bank_account_pending",
            },

         {
              id: "bank_account_complete",
              title: "Completed",
              path: "/bank_account_complete",
            },


             {
              id: "bank_account_reject",
              title: "Rejected",
              path: "/bank_account_reject",
            },


          ],
        },


        // {
        //   id: "Comm_Report",
        //   title: "Comm. Report",
        //   dropdown: true,
        //   icon: (
        //     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        //       <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        //       <polyline points="7 10 12 15 17 10"></polyline>
        //       <line x1="12" y1="15" x2="12" y2="3"></line>
        //     </svg>
        //   ),
        //   children: [
        //     {
        //       id: "agent_master",
        //       title: " Master Commission Repost",
        //       href: "/master-commisssion-report",
        //     },
        //   ],
        // },
        // {
        //   id: "Ledger",
        //   title: "Ledger",
        //   dropdown: true,
        //   icon: (
        //     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        //       <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        //       <polyline points="7 10 12 15 17 10"></polyline>
        //       <line x1="12" y1="15" x2="12" y2="3"></line>
        //     </svg>
        //   ),
        //   children: [
        //     {
        //       id: "peofit_loss",
        //       title: "Profit And Loss",
        //       path: "/profitloss",
        //     },
        //     {
        //       id: "My_Ledger",
        //       title: "My Ledger",
        //       path: "/my-ledger",
        //     },
        // {
        //   id: "Master_Ledger",
        //   title: "Master",
        //   path: "/Master-ledger",
        // },
        // {
        //   id: "Super_Ledger",
        //   title: "Super Agent",
        //   path: "/super-agent-ledger",
        //   onClick: () => {
        //     // Clear localStorage when Super Agent ledger is clicked
        //     // localStorage.removeItem("selectedSuperAgent");
        //     localStorage.removeItem("selectedMasterId");
        //     // localStorage.removeItem("selectedAdminId");
        //     window.location.path = "/super-agent-ledger";
        //   }
        // },
        // {
        //   id: "agent_Ledger",
        //   title: "Agent",
        //   path: "/agent-ledger",
        // },
        //     {
        //       id: "user_Ledger",
        //       title: "User",
        //       path: "/user-ledger",
        //     },
        //   ],
        // },

        // {
        //   id: "Bet_Managment",
        //   title: "Bet Management",
        //   dropdown: true,
        //   icon: (
        //     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        //       <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        //       <polyline points="7 10 12 15 17 10"></polyline>
        //       <line x1="12" y1="15" x2="12" y2="3"></line>
        //     </svg>
        //   ),
        //   children: [
        //     {
        //       id: "all_bets",
        //       title: "All Bets List",
        //       href: "/all_bets_lists",
        //     },
        //     {
        //       id: "pending_bets",
        //       title: "Pending Bets",
        //       href: "/pending_bets_lists",
        //     },
        //     {
        //       id: "success_bets",
        //       title: "Success Bets",
        //       href: "/success_bets_lists",
        //     },
        //   ],
        // },
  
        // {
        //   id: "adminwalletAndPermissionsManagement",
        //   title: "Admin Wallet",
        //   dropdown: true,
        //   icon: (
        //     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        //       <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        //       <polyline points="7 10 12 15 17 10"></polyline>
        //       <line x1="12" y1="15" x2="12" y2="3"></line>
        //     </svg>
        //   ),
        //   children: [
        //     {
        //       id: "admin_deposit_lists",
        //       title: "Deposit List",
        //       href: "/admin_deposit_lists",
        //     },
        //     {
        //       id: "admin_withdrow_lists",
        //       title: 'Withdraw List',
        //       href: "/admin_withdrow_lists",
        //     },
        //     {
        //       id: "admin_deposite_report_datewise",
        //       title: 'Datewise Deposit',
        //       href: "/admin_deposite_report_datewise",
        //     },
        //     {
        //       id: "admin_withdrawal_report_datewise",
        //       title: 'Datewise Withdraw',
        //       href: "/admin_withdrawal_report_datewise",
        //     },
        //   ],
        // },
        // {
        //   id: "Game_Management",
        //   title: "Sport Management",
        //   dropdown: true,
        //   children: [
        //     {
        //       id: "sports_management",
        //       title: "Sports",
        //       href: "/sports",
        //     },
        //     {
        //       id: "cricket_management",
        //       title: "Cricket",
        //       href: "/cricket",
        //     },
        //   ],
        // },
        // {
        //   id: "event_management",
        //   title: "Event Management",
        //   dropdown: true,
        //   children: [
        //     { id: "active_events", title: "Active Events", href: "/active_events" },
        //     { id: "inactive_events", title: "Inactive Events", href: "/inActive_events" },
        //     { id: "complete_events", title: "Complete Events", href: "/complete_events" }
        //   ]
        // },
        // {
        //   id: "fancy_management",
        //   title: "Fancy Management",
        //   dropdown: true,
        //   children: [
        //     // { id: "fancy_Managment", title: "Fancy Management", href: "/fancy_Managment" }
        //     { id: "fancy_Managment", title: "Fancy Management", href: "/view_match" }
        //   ]
        // },
        // {
        //   id: "ResultAndPermissionsManagement",
        //   title: "Result Management",
        //   dropdown: true,
        //   icon: (
        //     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        //       <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        //       <polyline points="7 10 12 15 17 10"></polyline>
        //       <line x1="12" y1="15" x2="12" y2="3"></line>
        //     </svg>
        //   ),
        //   children: [
        //     {
        //       id: "declare_result",
        //       title: "Result Declare",
        //       href: "/declare_result",
        //     },
        //   ],
        // },

        {
          id: "Game_Management",
          title: "Sport Management",
          dropdown: true,
          icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          ),

          children: [
            {
              id: "sports_management",
              title: "Sports",
              path: "/sports",
            },
            {
              id: "cricket_management",
              title: "Cricket",
              path: "/cricket",
            },
            {
              id: "active_events",
              title: "Active Events",
              path: "/active_events",
            },
            {
              id: "inactive_events",
              title: "Inactive Events",
              path: "/inActive_events",
            },
            {
              id: "complete_events",
              title: "Complete Events",
              path: "/complete_events",
            },
            {
              id: "fancy_management_view",
              title: "Fancy Result",
              path: "/view_match",
            },
            {
              id: "declare_result",
              title: "Result Declare",
              path: "/declare_result",
            },
            {
              id: "/fancy-result-list",
              title: "Fancy Result List",
              path: "/fancy-result-list",
            },
          ],
        },





        // {
        //   id: "Superagenttransaction",
        //   title: "Cash Transactions",
        //   dropdown: true,
        //   icon: (
        //     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        //       <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        //       <polyline points="7 10 12 15 17 10"></polyline>
        //       <line x1="12" y1="15" x2="12" y2="3"></line>
        //     </svg>
        //   ),
        //   children: [


        //     {
        //       id: "agent_master",
        //       title: "Master Transaction",
        //       path: "/master-transaction",
        //     },
        //     {
        //       id: "Superagenttransaction",
        //       title: " Super agent ",
        //       path: "/Superagenttransaction",
        //       onClick: () => {
        //         localStorage.removeItem("selectedSuperAgentId");
        //       },
        //     },
        //     {
        //       id: "Agenttransaction",
        //       title: "  agent ",
        //       path: "/Agenttransaction",
        //     },
        //     {
        //       id: "Usertransaction",
        //       title: "  User ",
        //       path: "/Usertransaction",
        //     },
        //     {
        //       id: "casetransactionreport",
        //       title: "Reports",
        //       path: "/case-transaction-report",
        //     },
        //   ],
        // },

        // {
        //   id: "Game_Management",
        //   title: "Sport Management",
        //   dropdown: true,
        //     icon: (
        //             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        //               <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        //               <polyline points="7 10 12 15 17 10"></polyline>
        //               <line x1="12" y1="15" x2="12" y2="3"></line>
        //             </svg>
        //           ),

        //   children: [
        //     {
        //       id: "sports_management",
        //       title: "Sports",
        //       href: "/sports",
        //     },
        //     {
        //       id: "cricket_management",
        //       title: "Cricket",
        //       href: "/cricket",
        //     },

        //     // 📅 Event Management
        //     {
        //       id: "event_management",
        //       title: "Event Management",
        //       dropdown: true,
        //       children: [
        //         { id: "active_events", title: "Active Events", href: "/active_events" },
        //         { id: "inactive_events", title: "Inactive Events", href: "/inActive_events" },
        //         { id: "complete_events", title: "Complete Events", href: "/complete_events" },
        //       ],
        //     },

        //     // 🎯 Fancy Management
        //     {
        //       id: "fancy_management",
        //       title: "Fancy Management",
        //       dropdown: true,
        //       children: [
        //         { id: "fancy_management_view", title: "Fancy List", href: "/view_match" },
        //       ],
        //     },

        //     // 🏆 Result Management
        //     {
        //       id: "result_management",
        //       title: "Result Management",
        //       dropdown: true,
        //       children: [
        //         {
        //           id: "declare_result",
        //           title: "Result Declare",
        //           href: "/declare_result",
        //         },
        //       ],
        //     },
        //   ],
        // },


        // {
        //   id: "Sub_Admin",
        //   title: "Sub Admin",
        //   href: "/sub_admin",
        //   icon: (
        //     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        //       <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        //       <polyline points="16 17 21 12 16 7"></polyline>
        //       <line x1="21" y1="12" x2="9" y2="12"></line>
        //     </svg>
        //   ),
        // },


        // {
        //   id: "wallettAndPermissionsManagement",
        //   title: "Wallet",
        //   dropdown: true,
        //   icon: (
        //     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        //       <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        //       <polyline points="7 10 12 15 17 10"></polyline>
        //       <line x1="12" y1="15" x2="12" y2="3"></line>
        //     </svg>
        //   ),
        //   children: [
        //     {
        //       id: "depositSection",
        //       title: "Deposit",
        //       dropdown: true,
        //       icon: <BsBank />,
        //       children: [
        //         {
        //           id: "deposite_pending",
        //           title: "Pending",
        //           href: "/deposite_pending",
        //         },
        //         {
        //           id: "deposite_complete",
        //           title: "Complete",
        //           href: "/deposite_complete",
        //         },
        //         {
        //           id: "deposite_reject",
        //           title: "Reject",
        //           href: "/deposite_reject",
        //         },
        //         {
        //           id: "deposite_report_datewise",
        //           title: 'Datewise Deposit list',
        //           href: "/deposite_report_datewise",
        //         },
        //       ]
        //     },
        //     {
        //       id: "withdrawSection",
        //       title: "Withdraw",
        //       dropdown: true,
        //       children: [
        //         {
        //           id: "withdrawal_pending",
        //           title: "Pending List",
        //           href: "/withdrawal_pending",
        //         },
        //         {
        //           id: "withdrawal_complete",
        //           title: "Complete",
        //           href: "/withdrawal_complete",
        //         },
        //         {
        //           id: "withdrawal_reject",
        //           title: "Reject",
        //           href: "/withdrawal_reject",
        //         },
        //         {
        //           id: "withdrawal_report_datewise",
        //           title: 'Datewise Withdraw list',
        //           href: "/withdrawal_report_datewise",
        //         },
        //       ]
        //     },
        //   ]
        // },

        {
          id: "depositSectionsss",
          title: "Deposit",
          dropdown: true,
          icon: <BsBank />,
          children: [
            {
              id: "deposite_pending",
              title: "Pending",
              path: "/deposite_pending",
            },
            {
              id: "deposite_complete",
              title: "Complete",
              path: "/deposite_complete",
            },
            {
              id: "deposite_reject",
              title: "Reject",
              path: "/deposite_reject",
            },

             {
              id: "deposit_amount_by_user",
              title: "Deposited Amount By Users",
              path: "/deposit_amount_by_user",
            },

            {
              id: "deposite_report_datewise",
              title: "Datewise Deposit list",
              path: "/deposite_report_datewise",
            },
          ],
        },
        {
          id: "withdrawSection",
          title: "Withdraw",
          dropdown: true,
                          icon: <BiMoneyWithdraw  />,

          children: [

            {
              id: "withdrawal_pending_Approve",
              title: "PreApproved",

              path: "/withdrawal_pending_Approve",
            },


            {
              id: "withdrawal_pending",
              title: "Pending List",
              path: "/withdrawal_pending",
            },
            {
              id: "withdrawal_complete",
              title: "Complete",
              path: "/withdrawal_complete",
            },
            {
              id: "withdrawal_reject",
              title: "Reject",
              path: "/withdrawal_reject",
            },
            {
              id: "withdrawal_report_datewise",
              title: "Datewise Withdraw list",
              path: "/withdrawal_report_datewise",
            },
          ],
        },


        // {
        //   id: "app_settings",
        //   title: "Setting",
        //   href: "/setting",
        //   icon: (
        //     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        //       <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        //       <polyline points="16 17 21 12 16 7"></polyline>
        //       <line x1="21" y1="12" x2="9" y2="12"></line>
        //     </svg>
        //   ),
        // },

        // {
        //   id: "slider",
        //   title: "Slider",
        //   path: "/slider_lists",
        //   icon: (
        //     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        //       <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        //       <polyline points="7 10 12 15 17 10"></polyline>
        //       <line x1="12" y1="15" x2="12" y2="3"></line>
        //     </svg>
        //   ),
        // },

        {
          id: "app_settings",
          title: "Setting",
          dropdown: true,
          icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          ),
          children: [
            // {
            //   id: "general_setting",
            //   title: "Admin Setting",
            //   path: "/setting",
            // },
            {
              id: "gateway-setting",
              title: "Gateway Setting",
              path: "/gateway-setting",
            },

            {
              id: "web-seting",
              title: "Web Setting",
              path: "/web-setting",
            },

            {
              id: "slider",
              title: "Slider",
              path: "/slider_lists",
            },

          ],
        },


        // {
        //   id: "app_settings",
        //   title: "Admin Setting",
        //   path: "/setting",
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
        // },
        // {
        //   id: "web-setting",
        //   title: "Web Setting",
        //   path: "/web-setting",
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
        //       id: "general_setting",
        //       title: "Admin Setting",
        //       href: "/setting",
        //     },

        //   ],

        // },


      {
          id: "adminchat",
          title: "Users Chat",
          path: "/adminchat",
          // icon: <IoChatboxEllipses />,
        },




        {
          id: "logout",
          title: "Logout",
          onClick: handleLogout,
          href: "#",
          // icon: (
          //   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          //     <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          //     <polyline points="7 10 12 15 17 10"></polyline>
          //     <line x1="12" y1="15" x2="12" y2="3"></line>
          //   </svg>
          // ),
        },
      ],
    },
  ];

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
            <Link to="/dashboard">
              <img
                src={
                  isDark
                    ? `${process.env.PUBLIC_URL}/assets/images/logo.png`
                    : `${process.env.PUBLIC_URL}/assets/images/logo.png`
                }
                alt="logo"
                className="logo-lg"
                height="60"
              />
            </Link>
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