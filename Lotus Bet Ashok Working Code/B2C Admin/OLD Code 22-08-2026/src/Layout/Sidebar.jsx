import React, { useState, useEffect } from "react";
import { IoChatboxEllipses, IoHome } from "react-icons/io5";
import "./Sidebar.scss";
import { IoIosArrowDown, IoIosSettings } from "react-icons/io";
import { BsBank } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { useNavigate, useLocation, Link, NavLink } from "react-router-dom";
import {
  MdAccountBalance,
  MdOutlineSupervisorAccount,
  MdSportsBaseball,
  MdSportsCricket,
} from "react-icons/md";
import { BiMoneyWithdraw } from "react-icons/bi";
import { subAdminMenu } from "../Server/api";
import { FaRegUser } from "react-icons/fa";
import { TbReport } from "react-icons/tb";
import { RiAdminFill, RiLogoutCircleRLine } from "react-icons/ri";

const Sidebar = ({ isOpen, onToggleSidebar, userType }) => {
  const [activeParent, setActiveParent] = useState(null);
  const [activeDropdowns, setActiveDropdowns] = useState({});
  const [sideBarClose, setSideBarClose] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobileview = window.innerWidth <= 991;
  const userTypes = localStorage.getItem("isLoggedIn");
  const storedPermissions =
    JSON.parse(localStorage.getItem("permissions")) || [];
  const [permissions, setPermissions] = useState([]);
  const [userTypeState, setUserTypeState] = useState("");
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
        const found = findActiveItemAndParents(item.children, pathname, [
          ...parentChain,
          item.id,
        ]);

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
        result.parents.forEach((parentId) => {
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
  useEffect(() => {
    const userType = localStorage.getItem("user_type"); // admin / subadmin
    const adminId = localStorage.getItem("admin_id");

    setUserTypeState(userType);

    // ✅ ADMIN → SHOW ALL
    if (userType === "admin") {
      setPermissions("ALL");
    }

    // ✅ SUBADMIN → CALL API
    if (userType === "subadmin") {
      fetchSubAdminPermissions(adminId);
    }
  }, []);
  const fetchSubAdminPermissions = async (adminId) => {
    try {
      const res = await subAdminMenu({ admin_id: adminId });

      if (res.data.success) {
        const data = res.data.data;

        setPermissions(data.permissions || []);

        // store for reuse
        localStorage.setItem("permissions", JSON.stringify(data.permissions));
      }
    } catch (err) {
      console.log("Permission fetch error", err);
    }
  };
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
      setActiveDropdowns((prev) => ({
        ...prev,
        [parentId]: true,
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
  // const isPermitted = (id) => {
  //   if (userTypes === "true") return true;
  //   return storedPermissions.includes(id);
  // };
  const isPermitted = (id) => {
    // ✅ Admin → allow all
    if (userTypeState === "admin") return true;

    // ✅ Subadmin → check permission array
    if (!id) return true;

    return permissions.includes(id);
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
      (item.dropdown && item.children?.some((child) => isPermitted(child.id)));

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
              `menu-link  ${
                isActive && item.id !== "logout" ? "active-link" : ""
              }`
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

const menuItems = [
  {
    items: [
      {
        id: "dashboard",
        title: "Dashboard",
        path: "/dashboard",
        icon: <IoHome />,
      },

      // Users
      {
        id: "users_management",
        title: "User Management",
        dropdown: true,
        icon: <FaRegUser />,
        children: [
          {
            id: "users-list",
            title: "All Users",
            path: "/users-list",
          },
          {
            id: "active-users-list",
            title: "Active Users",
            path: "/active-users-list",
          },
          {
            id: "inactive-users-list",
            title: "Inactive Users",
            path: "/inactive-users-list",
          },
          {
            id: "blocked-users-list",
            title: "Blocked Users",
            path: "/blocked-users-list",
          },
        ],
      },

      // Betting
      {
        id: "sports_betting",
        title: "Sports Betting",
        dropdown: true,
        icon: <MdSportsCricket />,
        children: [
          {
            id: "inplaygame",
            title: "Live Matches",
            path: "/inplay_game",
          },
          {
            id: "completedgame",
            title: "Completed Matches",
            path: "/completed_game",
          },
          {
            id: "fancy_pending",
            title: "Fancy Bets (Pending)",
            path: "/Bethistory",
          },
          {
            id: "match_pending",
            title: "Match Bets (Pending)",
            path: "/Allmatchhistory",
          },
          // {
          //   id: "settled_bets",
          //   title: "Settled Bets",
          //   path: "/SettledBethistory",
          // },
        ],
      },

      // Sports Management
      {
        id: "sports_management",
        title: "Sports Management",
        dropdown: true,
        icon: <MdSportsBaseball />,
        children: [
          {
            id: "sports",
            title: "All Sports",
            path: "/sports",
          },
          {
            id: "cricket",
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
            title: "Completed Events",
            path: "/complete_events",
          },
          {
            id: "fancy_result",
            title: "Fancy Results",
            path: "/view_match",
          },
          {
            id: "declare_result",
            title: "Declare Results",
            path: "/declare_result",
          },
          {
            id: "fancy_result_list",
            title: "Fancy Results List",
            path: "/fancy-result-list",
          },
        ],
      },

      // Deposit
      {
        id: "deposit_section",
        title: "Deposits",
        dropdown: true,
        icon: <BsBank />,
        children: [
          {
            id: "deposit_pending",
            title: "Pending",
            path: "/deposite_pending",
          },
          {
            id: "deposit_complete",
            title: "Completed",
            path: "/deposite_complete",
          },
          {
            id: "deposit_reject",
            title: "Rejected",
            path: "/deposite_reject",
          },
          {
            id: "deposit_report",
            title: " Reports",
            path: "/deposite_report_datewise",
          },
          {
            id: "Admindeposit",
            title: " Admin Deposit",
            path: "/Admindeposit",
          },
        ],
      },

      // Withdraw
      {
        id: "withdraw_section",
        title: "withdraw",
        dropdown: true,
        icon: <BiMoneyWithdraw />,
        children: [
          {
            id: "withdraw_preapproved",
            title: "Pre-approved Requests",
            path: "/withdrawal_pending_Approve",
          },
          {
            id: "withdraw_pending",
            title: "Pending withdraw",
            path: "/withdrawal_pending",
          },
          {
            id: "withdraw_complete",
            title: "Completed withdraw",
            path: "/withdrawal_complete",
          },
          {
            id: "withdraw_reject",
            title: "Rejected withdraw",
            path: "/withdrawal_reject",
          },
          {
            id: "withdraw_report",
            title: "Withdrawal Reports",
            path: "/withdrawal_report_datewise",
          },
          {
            id: "AdminWithdrawal",
            title: "withdraw Admin",
            path: "/AdminWithdrawal",
          },
        ],
      },

      // Settings
   

      // Reports
      {
        id: "reports",
        title: "Reports",
        dropdown: true,
        icon: <TbReport />,
        children: [
          {
            id: "bet_report",
            title: "Bet Reports",
            path: "/datewise_bet_reoprt",
          },
          {
            id: "deposit_report",
            title: "Deposit Reports",
            path: "/depositeList_report_datewise",
          },
          {
            id: "withdraw_report",
            title: "Withdrawal Reports",
            path: "/withdrawalList_report_datewise",
          },
          {
            id: "payment_report",
            title: "P&L / Payments",
            path: "/pl_report",
          },
        ],
      },
   {
        id: "settings",
        title: "Settings",
        dropdown: true,
        icon: <IoIosSettings />,
        children: [
          // {
          //   id: "admin_setting",
          //   title: "Admin Settings",
          //   path: "/setting",
          // },
          {
            id: "gateway_setting",
            title: "Payment Gateway",
            path: "/gateway-setting",
          },
          {
            id: "web_setting",
            title: "Website Settings",
            path: "/web-setting",
          },
          {
            id: "slider",
            title: "Banner / Slider",
            path: "/slider_lists",
          },
        ],
      },
      // Other
      {
        id: "adminchat",
        title: "User Chat",
        path: "/adminchat",
        icon: <IoChatboxEllipses />,
      },
      {
        id: "subadmin",
        title: "Sub Admin",
        path: "/sub_admin",
        icon: <RiAdminFill />,
      },
      {
        id: "logout",
        title: "Logout",
        onClick: handleLogout,
        icon: <RiLogoutCircleRLine />,
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
