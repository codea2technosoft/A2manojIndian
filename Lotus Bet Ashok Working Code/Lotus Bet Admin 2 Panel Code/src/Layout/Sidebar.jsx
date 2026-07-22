import React, { useState, useEffect } from "react";
import { IoChatboxEllipses } from "react-icons/io5";
import "./Sidebar.scss";
import { IoIosArrowDown } from "react-icons/io";
import { BsBank } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios"; // Add axios import
import newlogo from "../assets/images/logonew.png";
import {
  MdDashboard,
  MdAdminPanelSettings,
  MdSportsSoccer,
  MdAssessment,
  MdMenuBook,
  MdPayments,
  MdSettings,
  MdLogout,
} from "react-icons/md";

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

  // 🔄 Handle mobile view
  useEffect(() => {
    if (isMobileview) {
      setSideBarClose(true);
    } else {
      setSideBarClose(false);
    }
  }, [isMobileview]);

  // 📂 Toggle dropdown
  // const toggleDropdown = (id) => {
  //   setActiveDropdowns((prev) => ({
  //     ...prev,
  //     [id]: !prev[id],
  //   }));
  // };

  const handleItemClick = (item, parentId = null) => {
    if (sideBarClose && isOpen) {
      onToggleSidebar();
    }

    setActiveItem(item.id);

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
        }, 100); // 1 second
      }
      // case 2: value already removed earlier → reload once
      else if (!alreadyReloaded) {
        sessionStorage.setItem("admin_reload_done", "true");

        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    };

    // Apply reload logic for super-agent (AgentMasternew)
    if (item.id == "super-agent") {
      handleReloadLogic();
    }

    if (item.id == "myuserMaster") {
      handleReloadLogic();
    }

    // ✅ NEW: 检查并移除 superagent_admin_id 值（针对 Superagenttransaction 和 Agenttransaction）
    if (
      item.id === "Superagenttransaction" ||
      item.id === "Agenttransaction" ||
      item.id === "Client_Ledger" ||
      item.id === "Client" ||
      item.id === "agent_master_lager"
    ) {
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
      setActiveDropdowns((prev) => ({
        ...prev,
        [parentId]: true,
      }));
    }
  };

  useEffect(() => {
    const handleBack = () => {
      const adminId = localStorage.getItem("admin_id_new");
      const superagent_admin_id = localStorage.getItem("superagent_admin_id");

      if (adminId || superagent_admin_id) {
        window.location.reload();
      }
      localStorage.removeItem("admin_id_new");
      localStorage.removeItem("superagent_admin_id");
    };

    window.addEventListener("popstate", handleBack);
    window.history.pushState(null, "", window.location.href);

    return () => {
      window.removeEventListener("popstate", handleBack);
    };
  }, []);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Confirm Logout",
      text: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      focusCancel: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (!result.isConfirmed) return;

    // Loading popup
    Swal.fire({
      title: "Logging out...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      // Clear storage
      localStorage.clear();
      sessionStorage.clear();

      // Small delay for UX
      setTimeout(() => {
        Swal.fire({
          icon: "success",
          title: "Logged Out",
          text: "You have been logged out successfully",
          timer: 1200,
          showConfirmButton: false,
        }).then(() => {
          window.location.replace("/login"); // safer than href
        });
      }, 600);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Logout Failed",
        text: "Something went wrong. Please try again.",
      });
    }
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

  useEffect(() => {
    fetchAdminProfile();
  }, []);
  const fetchAdminProfile = async () => {
    try {
      const admin_id = localStorage.getItem("admin_id");
      const role = localStorage.getItem("role");
      const token = localStorage.getItem("token");

      if (!admin_id || !role || !token) {
        console.warn("Missing authentication data");
        navigate("/login");
        return;
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/get-data`,
        {
          role: role,
          admin_id: admin_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.success && response.data.data?.admin_profile) {
        const adminProfile = response.data.data.admin_profile;

        // 🔴 CHECK ACTIVE & BLOCK STATUS
        if (adminProfile.active === 0 || adminProfile.is_blocked === "1") {
          localStorage.clear(); // optional but recommended
          navigate("/login");
          return;
        }

        // setAdminData(adminProfile);
        // setUsername(adminProfile.username || "");
        // setCoins(adminProfile.coins || 0);

        localStorage.setItem("super_agent_id", adminProfile.super_agent_id);
        localStorage.setItem("super_admin_id", adminProfile.super_admin_id);
        localStorage.setItem("master_admin_id", adminProfile.master_admin_id);
        localStorage.setItem("adminProfile", JSON.stringify(adminProfile));
      }
    } catch (error) {
      console.error("Error fetching admin profile:", error);
      navigate("/login");
    }
  };

  // 🔄 Render menu item recursively
  const renderMenuItem = (item, level = 0, parentId = null) => {
    const isDropdownOpen = activeDropdowns[item.id];
    const isActive = activeItem === item.id;

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
                        //  onToggleSidebar();
                        // Close sidebar on mobile for ALL clicks including submenu items
                        if (sideBarClose && isOpen) {
                          onToggleSidebar();
                        }
                        if (sideBarClose) {
                          onToggleSidebar();
                        }
                        handleItemClick(child, item.id);
                        fetchAdminProfile();
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

  const toggleDropdown = (id) => {
    setActiveDropdowns((prev) => {
      // agar same dropdown click ho raha hai → toggle
      if (prev[id]) {
        return {};
      }

      // warna sirf current open rakho, baaki sab band
      return {
        [id]: true,
      };
    });
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
          icon: <MdDashboard size={22} />,
        },
        {
          id: "adminsdetails",
          title: "Admin Details",
          dropdown: true,
          icon: <MdAdminPanelSettings size={22} />,
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
          id: "SportsBetting",
          title: "Sports Betting",
          dropdown: true,
          icon: <MdSportsSoccer size={22} />,
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
          id: "Comm_Report",
          title: "Commission Report",
          dropdown: true,
          icon: <MdAssessment size={22} />,
          children: [
            {
              id: "CommisssionReport",
              title: "  Commission Report",
              href: "/CommisssionReport",
            },
          ],
        },
        {
          id: "Ledger",
          title: "Ledger",
          dropdown: true,
          icon: <MdMenuBook size={22} />,
          children:
            role === 4
              ? [
                  // Role 4: Only show Profit_Loss and My_Ledger
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
                    id: "Client",
                    title: "User",
                    href: "/Client_user",
                  },
                ]
              : role === 3
                ? [
                    // Role 3: Don't show agent_master_lager, show others
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
                      id: "Client_Ledger",
                      title: "agent",
                      href: "/Client_Ledger",
                    },
                    {
                      id: "Client",
                      title: "User",
                      href: "/Client_user",
                    },
                  ]
                : [
                    // Role 2: Show all
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
                    {
                      id: "Client",
                      title: "User",
                      href: "/Client_user",
                    },
                  ],
        },

        {
          id: "Superagenttransaction",
          title: "Cash Transactions",
          dropdown: true,
          icon: <MdPayments size={22} />,
          children:
            role === 4
              ? [
                  {
                    id: "Client_user_list",
                    title: "User",
                    href: "/Client_user_list",
                  },
                  {
                    id: "Report",
                    title: "Report",
                    href: "/Report",
                  },
                ]
              : role === 3
                ? [
                    {
                      id: "Agenttransaction",
                      title: "Agent",
                      href: "/Agenttransaction",
                    },
                    {
                      id: "Client_user_list",
                      title: "User",
                      href: "/Client_user_list",
                    },
                    {
                      id: "Report",
                      title: "Report",
                      href: "/Report",
                    },
                  ]
                : [
                    {
                      id: "Superagenttransaction",
                      title: "Super Agent",
                      href: "/Superagenttransaction",
                    },
                    {
                      id: "Agenttransaction",
                      title: "Agent",
                      href: "/Agenttransaction",
                    },
                    {
                      id: "Client_user_list",
                      title: "User",
                      href: "/Client_user_list",
                    },
                    {
                      id: "Report",
                      title: "Report",
                      href: "/Report",
                    },
                  ],
        },

        {
          id: "general_setting",
          title: "Admin Setting",
          href: "/setting",
          icon: <MdSettings size={22} />,
        },

        {
          id: "logout",
          title: "Logout",
          onClick: handleLogout,
          href: "#",
          icon: <MdLogout size={22} />,
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
                src={isDark ? newlogo : newlogo}
                alt="logo"
                className="logo-lg"
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
