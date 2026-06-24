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
  const isMobileview = window.innerWidth <= 991;

  useEffect(() => {
    if (isMobileview) {
      setSideBarClose(true);
    } else {
      setSideBarClose(false);
    }
  }, [isMobileview]);
  const toggleDropdown = (id) => {
    setActiveDropdowns((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  const handleItemClick = (item) => {
    if (sideBarClose) {
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

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.body.classList.contains("dark-theme"));
    };

    checkDarkMode(); // Initial check

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect(); // Cleanup on unmount
  }, []);

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
          title: "Users Chat",
          href: "/adminchat",
          icon: <IoChatboxEllipses />,
        },

        {
          id: "RolesAndPermissionsManagement",
          title: "Helpers",
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
              title: "Create Helpers",
              href: "/create_roles",
            },
            {
              id: "all-roles",
              title: "All Helpers",
              href: "/all_roles",
            },
            {
              id: "active-roles",
              title: "Active Helpers",
              href: "/active_roles",
            },
            {
              id: "inactive-roles",
              title: "Inactive Helpers",
              href: "/inactive_roles",
            },
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
            <a href="/dashboard">
              {/* <img
                src={
                  isDark
                    ? `${process.env.PUBLIC_URL}/assets/images/logo_dark.png`
                    : `${process.env.PUBLIC_URL}/assets/images/logo.png`
                }
                alt="logo"
                className="logo-lg"
                height="40"
              /> */}
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
