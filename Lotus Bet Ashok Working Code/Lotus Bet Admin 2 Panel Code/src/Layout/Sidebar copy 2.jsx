import React, { useState, useEffect } from "react";
import { IoChatboxEllipses } from "react-icons/io5";
import "./Sidebar.scss";
import { IoIosArrowDown } from "react-icons/io";
import { BsBank } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { useNavigate, useLocation, Link } from "react-router-dom";

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
  const role = Number(localStorage.getItem("role")); // role = 2 | 3 | 4

  // 🔍 Recursive function to find active item and its parents
  const findActiveItemAndParents = (items, pathname, parentChain = []) => {
    for (let item of items) {
      // ✅ Check if current item matches
      if (item.href === pathname) {
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
      ...prev,
      [id]: !prev[id],
    }));
  };

  // const handleItemClick = (item, parentId = null) => {
  //   // Close sidebar on mobile when any item is clicked
  //   if (sideBarClose && isOpen) {
  //     onToggleSidebar();
  //   }

  //   setActiveItem(item.id);

  //   // 🔴 RELOAD LOGIC FOR SPECIFIC PAGES
  //   const handleReloadLogic = () => {
  //     const adminId = localStorage.getItem("admin_id_new");
  //     const alreadyReloaded = sessionStorage.getItem("admin_reload_done");

  //     // case 1: value exists → remove + reload
  //     if (adminId) {
  //       localStorage.removeItem("admin_id_new");
  //       console.log("admin_id_new removed");

  //       sessionStorage.setItem("admin_reload_done", "true");

  //       setTimeout(() => {
  //         window.location.reload();
  //       }, []); // 1 second
  //     }
  //     // case 2: value already removed earlier → reload once
  //     else if (!alreadyReloaded) {
  //       sessionStorage.setItem("admin_reload_done", "true");

  //       setTimeout(() => {
  //         window.location.reload();
  //       }, []);
  //     }
  //   };

  //   // Apply reload logic for super-agent (AgentMasternew)
  //   if (item.id === "super-agent") {
  //     handleReloadLogic();
  //   }

  //   // Apply reload logic for myuserMaster (Mastermyuser)
  //   if (item.id === "myuserMaster") {
  //     handleReloadLogic();
  //   }

  //   // LOGOUT
  //   if (item.id === "logout") {
  //     item.onClick?.();
  //   }
  //   // NAVIGATION for all other items with href
  //   else if (item.href && item.href !== "#") {
  //     navigate(item.href);
  //   }

  //   // Child dropdown open
  //   if (parentId) {
  //     setActiveDropdowns(prev => ({
  //       ...prev,
  //       [parentId]: true
  //     }));
  //   }
  // };

  // 🚪 Handle logout
  
  // ... 前面的代码保持不变 ...

const handleItemClick = (item, parentId = null) => {
  // Close sidebar on mobile when any item is clicked
  if (sideBarClose && isOpen) {
    onToggleSidebar();
  }

  setActiveItem(item.id);

  // 🔴 RELOAD LOGIC FOR SPECIFIC PAGES (原来的逻辑保持不变)
  const handleReloadLogic = () => {
    const adminId = localStorage.getItem("admin_id_new");
    const alreadyReloaded = sessionStorage.getItem("admin_reload_done");

    // case 1: value exists → remove + reload
    if (adminId) {
      localStorage.removeItem("admin_id_new");
      console.log("admin_id_new removed");

      sessionStorage.setItem("admin_reload_done", "true");

      setTimeout(() => {
        window.location.reload();
      }, 1000); // 1 second
    }
    // case 2: value already removed earlier → reload once
    else if (!alreadyReloaded) {
      sessionStorage.setItem("admin_reload_done", "true");

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  // Apply reload logic for super-agent (AgentMasternew)
  if (item.id === "super-agent") {
    handleReloadLogic();
  }

  // Apply reload logic for myuserMaster (Mastermyuser)
  if (item.id === "myuserMaster") {
    handleReloadLogic();
  }
  

  // ✅ NEW: 检查并移除 superagent_admin_id 值（针对 Superagenttransaction 和 Agenttransaction）
  if (item.id === "Superagenttransaction" || item.id === "Agenttransaction"  ||item.id === "Client_Ledger"  ||item.id === "agent_master_lager") {
    const superagentAdminId = localStorage.getItem("superagent_admin_id");
    if (superagentAdminId) {
      localStorage.removeItem("superagent_admin_id");
      console.log("superagent_admin_id removed from localStorage");
    }
  }

  // LOGOUT
  if (item.id === "logout") {
    item.onClick?.();
  }
  // NAVIGATION for all other items with href
  else if (item.href && item.href !== "#") {
    navigate(item.href);
  }

  // Child dropdown open
  if (parentId) {
    setActiveDropdowns(prev => ({
      ...prev,
      [parentId]: true
    }));
  }
};

// ... 后面的代码保持不变 ...
  
  
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/login";
  };

  // 🔒 Check permissions
  const isPermitted = (id) => {
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
        <Link
          to={item.dropdown ? "#" : item.href || "#"}
          className={`menu-link ${isActive ? "active-link" : ""}`}
          onClick={(e) => {
            // Close sidebar on mobile for ALL clicks
            if (sideBarClose && isOpen) {
              onToggleSidebar();
            }

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
                      to={child.href}
                      className={`menu-link ${activeItem === child.id ? "active-link" : ""}`}
                      onClick={(e) => {
                        // Close sidebar on mobile for ALL clicks including submenu items
                        if (sideBarClose && isOpen) {
                          onToggleSidebar();
                        }
                        handleItemClick(child, item.id);
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

  // 📋 Menu items definition
  const menuItems = [
    {
      section: "Menu",
      items: [
        {
          id: "dashboard",
          title: "Dashboard",
          href: "/dashboard",
          icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          ),
        },
        {
          id: "adminsdetails",
          title: "Admin Details",
          dropdown: true,
          icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          ),
          children:
            role === 2
              ? [
                {
                  id: "Master",
                  title: "Super Agent",
                  href: "/agent_master",
                },
                {
                  id: "super-agent",
                  title: "Agent",
                  href: "/AgentMasternew",
                },
                {
                  id: "myuserMaster",
                  title: "User",
                  href: "/Mastermyuser",
                },
              ]
              : role === 3
                ? [
                  {
                    id: "super-agent",
                    title: "Agent",
                    href: "/AgentMasternew",
                  },
                  {
                    id: "myuserMaster",
                    title: "User",
                    href: "/Mastermyuser",
                  },
                ]
                : role === 4
                  ? [
                    {
                      id: "myuserMaster",
                      title: "User",
                      href: "/Mastermyuser",
                    },
                  ]
                  : [],
        },
          {
          id: "Comm_Report",
          title: "Comm. Report",
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
              id: "CommisssionReport",
              title: "  Commission Repost",
              href: "/CommisssionReport",
            },
          ],
        },
            {
          id: "Ledger",
          title: "Ledger",
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
              id: "peofit_loss",
              title: "Profit And Loss",
              href: "/Profit_Loss",
            },
            {
              id: "My_Ledger",
              title: "My Ledger",
              href: "/My_Ledger",
            },
            {
              id: "agent_master",
              title: "Super agent",
              href: "/agent_master_lager",
            },
            {
              id: "Client_Ledger",
              title: "agent",
              href: "/Client_Ledger",
            },
          ],
        },
            {
          id: "SportsBetting",
          title: "Sports Betting",
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
              id: "InplayGames",
              title: "Inplay Games",
              href: "/InplayGames",
            },
      
            {
              id: "CompletedGames",
              title: "Completed Games",
              href: "/CompletedGames",
            },
      
          ],
        },
        {
          id: "Superagenttransaction",
          title: "Cash Transactions",
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
              id: "Superagenttransaction",
              title: " Super agent ",
              href: "/Superagenttransaction",
            },
            {
              id: "Agenttransaction",
              title: "  agent ",
              href: "/Agenttransaction",
            },
            // {
            //   id: "Usertransaction",
            //   title: "  User ",
            //   href: "/Usertransaction",
            // },
          ],
        },
        {
          id: "general_setting",
          title: "Admin Setting",
          href: "/setting",
          icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          ),
        },

        {
          id: "logout",
          title: "Logout",
          onClick: handleLogout,
          href: "#",
          icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          ),
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
            <a href="/dashboard">
              <img
                src={
                  isDark
                    ? `${process.env.PUBLIC_URL}/assets/images/logo.png`
                    : `${process.env.PUBLIC_URL}/assets/images/logo.png`
                }
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