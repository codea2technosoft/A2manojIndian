import React, { useState, useEffect } from "react";
import "./Sidebar.scss";
import { IoIosArrowDown } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { FaPeopleGroup } from "react-icons/fa6";
import callIcon from "../assets/images/call.png";
import whatsappIcon from "../assets/images/whatsappicon.png";
import { FaUserTie, FaMoneyCheckAlt, FaWallet } from "react-icons/fa";
import { MdSupportAgent } from "react-icons/md";


const Sidebar = ({ isOpen, onToggleSidebar, userType }) => {
  const [activeParent, setActiveParent] = useState(null);
  const [activeDropdowns, setActiveDropdowns] = useState({});
  const [sideBarClose, setSideBarClose] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobileview = window.innerWidth <= 991;
  const [siteSettings, setSiteSettings] = useState(null);

  //const userType = localStorage.getItem("userType");
  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/site-setting`
        );
        const result = await response.json();

        if (result.status === "1") {
          setSiteSettings(result.data);
        } else {
          console.warn("No data found.");
        }
      } catch (error) {
        console.error("Failed to fetch site settings:", error);
      }
    };

    fetchSiteSettings();
  }, []);

  useEffect(() => {
    if (isMobileview) {
      setSideBarClose(true);
    } else {
      setSideBarClose(false);
    }
  }, [isMobileview]);

  const toggleDropdown = (id) => {
    setActiveDropdowns(prev => {
      if (prev[id]) return {};
      return { [id]: true };
    });
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

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/login";
  };

  const [isDark, setIsDark] = useState(false);

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

  const menuItems = [
    {
      section: "Menu",
      items: [
        // {
        //   id: "dashboard",
        //   title: "Dashboard",
        //   href: "/dashboard",
        //   icon: (
        //     <svg
        //       width="24"
        //       height="24"
        //       viewBox="0 0 24 24"
        //       fill="none"
        //       stroke="currentColor"
        //       strokeWidth="2"
        //     >
        //       <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        //       <polyline points="9 22 9 12 15 12 15 22"></polyline>
        //     </svg>
        //   ),
        // },

        // {
        //   id: "Account",
        //   title: "Bank Account",
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
        //       <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
        //       <path d="M16 3h-8v4h8V3z"></path>
        //     </svg>
        //   ),
        //   children: [
        //     {
        //       id: "Account List",
        //       title: "Bank Account List",
        //       href: "/account-list",
        //     },
        //     {
        //       id: "WithdrawalRequest",
        //       title: "Withdrawal Request",
        //       href: "/add-withdrawal-request",
        //     },

        //     {
        //       id: "withdrawalhistory",
        //       title: "Withdrawal History",
        //       href: "/withdrawal-history",
        //     },

        //     {
        //       id: "tdsreport",
        //       title: "TDS Report",
        //       href: "/get-tsd-report-for-associate",
        //     },



        //   ],
        // },






        // {
        //   id: "wallet_ledger",
        //   title: "Wallet ledger",
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
        //       <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
        //       <path d="M16 3h-8v4h8V3z"></path>
        //     </svg>
        //   ),
        //   children: [


        //     {
        //       id: "walletledger",
        //       title: "Wallet Ledger",
        //       href: "/user-wallet-report",
        //     },
        //     // { id: "PlotLedger", title: "Unit Ledger", href: "/admin-plot-ledger", checked: false },
        //     { id: "unitsqyd_added", title: "Unit SQYD Added", href: "/unit-sqyd-added", checked: false },
        //     { id: "unit_sqyd_ledger", title: "Unit SQYD Ledger", href: "/unit-sqyd-ledger", checked: false },


        //   ],
        // },


        // {
        //   id: "myteam",
        //   title: "My Team",
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
        //       <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
        //       <path d="M16 3h-8v4h8V3z"></path>
        //     </svg>
        //   ),
        //   children: [

        //     ...(userType !== "channel"
        //       ? [
        //         {
        //           id: "my-associates",
        //           title: "Direct All Associates",
        //           href: "/my-associates",
        //         },
        //       ]
        //       : []),

        //     {
        //       id: "all-channel-list",
        //       title: "Direct All Channel Partners",
        //       href: "/all-channel-list",
        //     },

        //     {
        //       id: "myteam",
        //       title: "My Teams",
        //       href: "/my-team",
        //     },
        //     {
        //       id: "levelwiselead",
        //       title: "Level Wise Team",
        //       href: "/levelwise",
        //     },
        //   ],
        // },





        {
          id: "myteam",
          title: "My Team",
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
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 3h-8v4h8V3z"></path>
            </svg>
          ),
          children: [

            ...(userType !== "channel"
              ? [
                {
                  id: "my-associates",
                  title: "Direct All Associates",
                  href: "/my-associates",
                },
              ]
              : []),

            ...(userType === "channel"
              ? [
                {
                  id: "all-channel-list",
                  title: "Direct All Channel Partners",
                  href: "/all-channel-list",
                },
              ]
              : []),

            {
              id: "myteam",
              title: "My Team",
              href: "/my-team",
            },
            {
              id: "levelwiselead",
              title: "Level Wise Team",
              href: "/levelwise",
            },
          ],
        },




        // {
        //   id: "myteam",
        //   title: "My Teams",
        //   href: "/my-team",
        //   icon: <FaPeopleGroup />,
        // },


        {
          id: "projectManagement",
          title: "Projects",
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
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 3h-8v4h8V3z"></path>
            </svg>
          ),
          children: [
            {
              id: "all-project",
              title: "All Projects",
              href: "/all-project",
            },
          ],
        },



        // ...(userType !== "channel"
        //   ? [
        //       {
        //         id: "my-associates",
        //         title: "Direct Associates",
        //         dropdown: true,
        //         icon: (
        //           <svg
        //             width="24"
        //             height="24"
        //             viewBox="0 0 24 24"
        //             fill="none"
        //             stroke="currentColor"
        //             strokeWidth="2"
        //           >
        //             <path d="M17 21v-2a4 4 0 0 0-3-3.87" />
        //             <path d="M7 21v-2a4 4 0 0 1 3-3.87" />
        //             <circle cx="12" cy="7" r="4" />
        //           </svg>
        //         ),
        //         children: [
        //           {
        //             id: "my-associates",
        //             title: "Direct All Associates",
        //             href: "/my-associates",
        //           },
        //         ],
        //       },
        //     ]
        //   : []),

        // {
        //   id: "projectChannel",
        //   title: "Direct Channel Partners",
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
        //       <path d="M17 21v-2a4 4 0 0 0-3-3.87" />
        //       <path d="M7 21v-2a4 4 0 0 1 3-3.87" />
        //       <circle cx="12" cy="7" r="4" />
        //     </svg>
        //   ),
        //   children: [
        //     {
        //       id: "all-channel-list",
        //       title: "Direct All Channel Partners",
        //       href: "/all-channel-list",
        //     },
        //   ],
        // },

        {
          id: "Lead_Management",
          title: "Lead Management",
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
              <path d="M17 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M7 21v-2a4 4 0 0 1 3-3.87" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          ),
          children: [
            {
              id: "property-lead-lists",
              title: "Property Lead",
              href: "/property-lead-list",
            },

            // {
            //   id: "loan-list",
            //   title: "Loan Lead",
            //   href: "/loan-list",
            // },

            {
              id: "property_income_list",
              title: "Property Income ",
              href: "/property-income-list",
              checked: false,
            },
            {
              id: "child-commission",
              // title: "Child Commission",
              title: "Downline Commission",
              href: "/child-commission",
              checked: false,
            },

          ],
        },


        // {
        //   id: "Visit_List",
        //   title: "Visit List",
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
        //       <path d="M17 21v-2a4 4 0 0 0-3-3.87" />
        //       <path d="M7 21v-2a4 4 0 0 1 3-3.87" />
        //       <circle cx="12" cy="7" r="4" />
        //     </svg>
        //   ),
        //   children: [
        //     {
        //       id: "visit-list",
        //       title: "Visit List",
        //       href: "/visiting-listings",
        //     },
        //   ],
        // },





        // {
        //   id: "RRRulesBooks",
        //   title: "Rules Book",
        //   icon: (
        //     <svg
        //       width="24"
        //       height="24"
        //       viewBox="0 0 24 24"
        //       fill="none"
        //       stroke="currentColor"
        //       strokeWidth="2"
        //     >
        //       <path d="M17 21v-2a4 4 0 0 0-3-3.87" />
        //       <path d="M7 21v-2a4 4 0 0 1 3-3.87" />
        //       <circle cx="12" cy="7" r="4" />
        //     </svg>
        //   ),
        //   href: "/rr-rules-book",
        // },


        // {
        //           id: "income Managment",
        //           title: "Income Management",
        //           dropdown: true,
        //           icon: <FaWallet />,
        //           checked: false,
        //           children: [
        //             { id: "property_income_list", title: "Property Income List", href: "/property-income-list", checked: false },
        //             { id: "child-commission", title: "Child Commission", href: "/child-commission", checked: false },

        //           ]
        //         },


        //           {
        //           id: "self gifts lists",
        //           title: "Gifts Management",
        //           dropdown: true,
        //           icon: <FaWallet />,
        //           checked: false,
        //           children: [
        //             { id: "self_gifts_lists", title: "Self Gifts Lists", href: "/self-gifts-lists", checked: false },


        //           ]
        //         },

        //          {
        //           id: "advance-payments-to-associates",
        //           title: "Advance Payments",
        //           dropdown: true,
        //           icon: <FaWallet />,
        //           checked: false,
        //           children: [
        //             { id: "advance-payments-to-associates", title: "Advance Payments", href: "/advance-payment-history", checked: false },


        //           ]
        //         },



        // ...(userType !== "channel"
        //   ? [
        //     // {
        //     //   id: "income Managment",
        //     //   title: "Income Management",
        //     //   dropdown: true,
        //     //   icon: <FaWallet />,
        //     //   checked: false,
        //     //   children: [
        //     //     {
        //     //       id: "property_income_list",
        //     //       title: "Property Income List",
        //     //       href: "/property-income-list",
        //     //       checked: false,
        //     //     },
        //     //     {
        //     //       id: "child-commission",
        //     //       title: "Child Commission",
        //     //       href: "/child-commission",
        //     //       checked: false,
        //     //     },
        //     //   ],
        //     // },
        //     {
        //       id: "self gifts lists",
        //       // title: "Self / Team Gifts SQYD",
        //       title: "Gifts Sales",
        //       dropdown: true,
        //       icon: <FaWallet />,
        //       checked: false,
        //       children: [
        //         {
        //           id: "self_gifts_lists",
        //           title: "Gifts Sales",
        //           // title: "Self / Team Gifts Lists",
        //           href: "/self-gifts-lists",
        //           checked: false,
        //         },
        //       ],
        //     },

        //     // {
        //     //   id: "property-awards-winner-histories",
        //     //   title: "Self / Team Offers",
        //     //   dropdown: true,
        //     //   icon: <FaWallet />,
        //     //   checked: false,
        //     //   children: [
        //     //     {
        //     //       id: "property-awards-winner-histories",
        //     //       title: "View Running Winner",
        //     //       href: "/property-awards-winners-histories",
        //     //       checked: false,
        //     //     },
        //     //     { id: "property-awards-winners-histories", title: "View Distributed Lists", href: "#", checked: false },
        //     //   ],
        //     // },

        //     {
        //       id: "ticket_support",
        //       title: "Ticket Support",
        //       dropdown: true,
        //       icon: <MdSupportAgent />,
        //       checked: false,
        //       children: [
        //         {
        //           id: "create_ticket_support",
        //           title: "Create Ticket Support",
        //           href: "/create-ticket-support",
        //           checked: false,
        //         },
        //         {
        //           id: "ticket_support_list",
        //           title: "Ticket Support List",
        //           href: "/created-ticket-support-list",
        //           checked: false,
        //         },
        //       ],
        //     },

        //     {
        //       id: "advance-payments-to-associates",
        //       title: "Advance Payments",
        //       dropdown: true,
        //       icon: <FaWallet />,
        //       checked: false,
        //       children: [
        //         {
        //           id: "advance-payments-to-associates",
        //           title: "Advance Payments",
        //           href: "/advance-payment-history",
        //           checked: false,
        //         },
        //       ],
        //     }



        //   ]
        //   : []),




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
            setActiveDropdowns({ [item.id]: true });
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
        // setActiveDropdowns({});
      }
    }
  }, [location.pathname]);

  const renderMenuItem = (item, level = 0) => {
    const isDropdownOpen = !!activeDropdowns[item.id];


    const isActive = activeItem === item.id || activeParent === item.id;

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
              handleItemClick(item);
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

        {item.dropdown && isDropdownOpen && item.children && (
          <div className="collapse show">
            <ul className="sub-menu">
              {item.children.map((child) =>
                child.dropdown ? (
                  renderMenuItem(child, level + 1)
                ) : (
                  <li
                    key={child.id}
                    className={`menu-item ${activeItem === child.id ||
                      (child.href && child.href.includes(":") &&
                        location.pathname.startsWith(child.href.split(":")[0]))
                      ? "active"
                      : ""
                      }`}
                  >
                    <Link
                      to={child.href}
                      className="menu-link"
                      onClick={() => handleItemClick(child)}
                    >
                      <span className="menu-text submenulistdesign">
                        {child.title}
                      </span>
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
        )}
      </li>
    );
  };

  return (
    <>
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
                    ? `${process.env.PUBLIC_URL}/assets/images/logo_dark.png`
                    : `${process.env.PUBLIC_URL}/assets/images/logo.png`
                }
                alt="logo"
                className="logo-lg"
              />
            </a>
          </div>
          <div className="sidebar-content">
            <ul className="app-menu">
              {menuItems.map((section) => (
                <React.Fragment key={section.section}>
                  {/* <li className="menu-title">{section.section}</li> */}
                  {section.items.map((item) => renderMenuItem(item))}
                </React.Fragment>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="call fixeditems">
        <Link
          to={
            siteSettings?.call_number
              ? `tel:+91${siteSettings.call_number.replace(/^(\+91|91|0)/, "")}`
              : "/"
          }
        >
          <img alt="call" src={callIcon} />
        </Link>

      </div>

      {/* <div className="whatsappicon fixeditems">
        <Link
          to={
            siteSettings?.whatsapp_number
              ? `https://wa.me/91${'0000'.replace(
                /^\+91|91|0|-/,
                ""
              )}`
              : "/"
          }
          target="_blank"
          rel="noreferrer"
        >
          <img alt="whatsapp" src={whatsappIcon} />
        </Link>
      </div> */}

      <div className="whatsappicon fixeditems">
        <Link
          to={
            siteSettings?.whatsapp_link
              ? siteSettings.whatsapp_link
              : siteSettings?.whatsapp_number
                ? `https://wa.me/91${siteSettings.whatsapp_number.replace(
                  /^\+91|91|0|-/,
                  ""
                )}`
                : "/"
          }
          target="_blank"
          rel="noreferrer"
        >
          <img alt="whatsapp" src={whatsappIcon} />
        </Link>
      </div>

    </>
  );
};

export default Sidebar;
