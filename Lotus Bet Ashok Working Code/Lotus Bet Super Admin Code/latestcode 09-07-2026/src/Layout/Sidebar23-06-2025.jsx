import React, { useState, useEffect } from "react";
import "./Sidebar.scss";
import { IoIosArrowDown } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { useNavigate, useLocation, Link } from "react-router-dom";
const Sidebar = ({ isOpen, onToggleSidebar, userType, permissions }) => {
  const [activeParent, setActiveParent] = useState(null);
  const [activeDropdowns, setActiveDropdowns] = useState({});
  const [activeItem, setActiveItem] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const toggleDropdown = (id) => {
    setActiveDropdowns((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  const handleItemClick = (item) => {
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
            },
            {
              id: "all-roles",
              title: "All Roles",
              href: "/all_roles",
            },
            {
              id: "active-roles",
              title: "Active Roles",
              href: "/active_roles",
            },
            {
              id: "inactive-roles",
              title: "Inactive Roles",
              href: "/inactive_roles",
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
            },
            {
              id: "users-list",
              title: "Users List",
              href: "/all_users",
            },
            {
              id: "active-users",
              title: "Active Users List",
              href: "/active_users",
            },
            {
              id: "inactive-users",
              title: "Inactive Users List",
              href: "/inactive_users",
            },
            {
              id: "wallet-balance",
              title: "Users Wallet Balance",
              href: "/user_wallet_balance",
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
            },
            {
              id: "king-jack-port",
              title: "King Jack Port Market",
              href: "/king_jack_port_market_list",
            },
            {
              id: "king-starline",
              title: "King Starline Market",
              href: "/king_starline_market_list",
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
            },
            {
              id: "withdrawal-complete",
              title: "Complete",
              href: "/withdrawal_complete",
            },
            {
              id: "withdrawal-reject",
              title: "Reject",
              href: "/withdrawal_reject",
            },
          ],
        },
        {
          id: "WalletManagement",
          title: "Point Management",
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
              id: "add-point",
              title: "Add Point",
              href: "/point_management_add_point",
            },
            {
              id: "deduct-point",
              title: "Deduct Point",
              href: "/point_management_deduct_point",
            },
            {
              id: "user-wallet-balance",
              title: "User Wallet Balance",
              href: "/point_user_wallet_balance",
            },
            {
              id: "add-point-history",
              title: "Admin Add Point History",
              href: "/admin_add_point_history",
            },
            {
              id: "auto-point-history",
              title: "Auto Point Add History",
              href: "/auto_point_add_history",
            },
          ],
        },

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
              title: "Pending",
              href: "/bet_history_pending",
            },
            {
              id: "bet-success",
              title: "Success",
              href: "/bet_history_success",
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
            },
            {
              id: "king-jack-port-result",
              title: "King Jack Port Market",
              href: "/declare_king_jack",
            },
            {
              id: "king-starline-result",
              title: "King Starline Market",
              href: "/declare_king_starline",
            },
          ],
        },
        {
          id: "runningGame",
          title: "Running Game",
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
              id: "main-game",
              title: "Main Game",
              href: "/running_main_market_lists",
            },
            {
              id: "king-jack-port-game",
              title: "King Jack Port Market",
              href: "/running_king_jack_port_lists",
            },
            {
              id: "king-starline-game",
              title: "King Starline Game",
              href: "/running_king_starline_lists",
            },
          ],
        },
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
            },
          ],
        },

        {
          id: "ecom_dr21",
          title: "Report Management",
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
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          ),
          children: [
            {
              id: "biding-report",
              title: "Biding Report",
              href: "/bidding_report",
            },
            {
              id: "user-biding-report",
              title: "User Biding Report",
              href: "/user_bidding_report",
            },
            {
              id: "full-biding-details",
              title: "User FullBiding Details",
              href: "/user_full_bidding_report",
            },
            {
              id: "transaction-history",
              title: "Transaction History",
              href: "/user_transactions_history",
            },
            {
              id: "winners-history",
              title: "Winners History",
              href: "/user_winner_history",
            },
            {
              id: "result-analysis",
              title: "Result Analysis History",
              href: "/user_result_analysis_history",
            },
          ],
        },
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
            },

             {
              id: "video_lists",
              title: "Video Lists",
              href: "/video_lists",
            },

              {
              id: "idea_submit_lists",
              title: "Idea Submit Lists",
              href: "/idea_submit_lists",
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
          onClick={(e) => {
            if (item.onClick) {
              item.onClick();
            } else if (item.dropdown) {
              toggleDropdown(item.id);
            } else {
              handleItemClick(item.id);
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
                      onClick={() => handleItemClick(child.id, item.id)}
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
            <a className="logo-light" href="#">
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
