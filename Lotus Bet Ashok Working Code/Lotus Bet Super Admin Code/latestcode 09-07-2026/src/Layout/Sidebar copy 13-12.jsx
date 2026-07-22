// import React, { useState, useEffect } from "react";
// import { IoChatboxEllipses } from "react-icons/io5";
// import "./Sidebar.scss";
// import { IoIosArrowDown } from "react-icons/io";
// import { BsBank } from "react-icons/bs";

// import { IoMdClose } from "react-icons/io";
// import { useNavigate, useLocation, Link } from "react-router-dom";
// const Sidebar = ({ isOpen, onToggleSidebar, userType }) => {
//   const [activeParent, setActiveParent] = useState(null);
//   const [activeDropdowns, setActiveDropdowns] = useState({});
//   const [sideBarClose, setSideBarClose] = useState(false);
//   const [activeItem, setActiveItem] = useState(null);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const isMobileview = window.innerWidth <= 991;
// const permissions = JSON.parse(localStorage.getItem("permissions"));
// const userType1 = localStorage.getItem("userType");
//   useEffect(() => {
//     if (isMobileview) {
//       setSideBarClose(true);
//     } else {
//       setSideBarClose(false);
//     }
//   }, [isMobileview]);
//   // const toggleDropdown = (id) => {
//   //   setActiveDropdowns((prev) => {
//   //     const isOpen = !!prev[id];
//   //     return isOpen ? {} : { [id]: true };
//   //   });
//   // };



// const toggleDropdown = (id) => {
//   setActiveDropdowns((prev) => ({
//     ...prev,
//     [id]: !prev[id],
//   }));
// };




//   const handleItemClick = (item) => {
//     if (sideBarClose) {
//       onToggleSidebar();
//     }
//     setActiveItem(item.id);
//     if (item.id === "logout") {
//       item.onClick?.();
//     } else if (item.href && item.href !== "#") {
//       navigate(item.href);
//     }
//   };
//   const isAllAccessUser = userType === "tech_admin";
//   const handleLogout = () => {
//     localStorage.clear();
//     sessionStorage.clear();
//     window.location.href = "/login";
//   };
//   // const isPermitted = (href) => {
//   //   if (isAllAccessUser || permissions.includes("*")) return true;
//   //   return permissions.includes(href);
//   // };

//   const isPermitted = (href) => {
//   if (!href || href === "#") return true; // always allow
//   if (permissions.includes("*")) return true; // all permissions
//   // convert href to key, example: "/all_users" => "all_users"
//   const key = href.replace("/", "");
//   return permissions.includes(key);
// };
//   const [isDark, setIsDark] = useState(false);

//   useEffect(() => {
//     const checkDarkMode = () => {
//       setIsDark(document.body.classList.contains("dark-theme"));
//     };

//     checkDarkMode(); // Initial check

//     const observer = new MutationObserver(checkDarkMode);
//     observer.observe(document.body, {
//       attributes: true,
//       attributeFilter: ["class"],
//     });

//     return () => observer.disconnect(); // Cleanup on unmount
//   }, []);

//   const menuItems = [
//     {
//       section: "Menu",
//       items: [
//         {
//           id: "homedashboard",
//           title: "HomeDashboard",
//           href: "/homedashboard",
//           icon: (
//             <svg
//               width="24"
//               height="24"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//             >
//               <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
//               <polyline points="9 22 9 12 15 12 15 22"></polyline>
//             </svg>
//           ),
//         },

//         {
//           id: "dashboard",
//           title: "Dashboard",
//           href: "/dashboard",
//           icon: (
//             <svg
//               width="24"
//               height="24"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//             >
//               <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
//               <polyline points="9 22 9 12 15 12 15 22"></polyline>
//             </svg>
//           ),
//         },
//         {
//           id: "usermanagmentAndPermissionsManagement",
//           title: " User Managment",
//           dropdown: true,
//           icon: (
//             <svg
//               width="24"
//               height="24"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//             >
//               <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
//               <polyline points="7 10 12 15 17 10"></polyline>
//               <line x1="12" y1="15" x2="12" y2="3"></line>
//             </svg>
//           ),
//           children: [
//             {
//               id: "/all_users",
//               title: "All Users List",
//               href: "/all_users",
//             },
//             {
//               id: "/active_users",
//               title: "Active Users",
//               href: "/active_users",
//             },
//             {
//               id: "/inactive_users",
//               title: "InActive Users ",
//               href: "/inactive_users",
//             },
//             {
//               id: "/user-NoteList",
//               title: "Users Note List",
//               href: "/user-NoteList",
//             },

//           ],
//         },
//         {
//           id: "betmanagmentAndPermissionsManagement",
//           title: " Bet Managment",
//           dropdown: true,
//           icon: (
//             <svg
//               width="24"
//               height="24"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//             >
//               <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
//               <polyline points="7 10 12 15 17 10"></polyline>
//               <line x1="12" y1="15" x2="12" y2="3"></line>
//             </svg>
//           ),
//           children: [
//             {
//               id: "/all_bets_lists",
//               title: "All Bets List",
//               href: "/all_bets_lists",
//             },


//           ],
//         },
//         {
//           id: "adminchat",
//           title: "Users Chat",
//           href: "/adminchat",
//           icon: <IoChatboxEllipses />,
//         },
//         {
//           id: "adminwalletAndPermissionsManagement",
//           title: " Admin Wallet",
//           dropdown: true,
//           icon: (
//             <svg
//               width="24"
//               height="24"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//             >
//               <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
//               <polyline points="7 10 12 15 17 10"></polyline>
//               <line x1="12" y1="15" x2="12" y2="3"></line>
//             </svg>
//           ),
//           children: [
//             {
//               id: "/admin_deposit_lists",
//               title: "Deposit List",
//               href: "/admin_deposit_lists",
//             },
//             {
//               id: "/admin_withdrow_lists",
//               title: 'Withdrow List',
//               href: "/admin_withdrow_lists",
//             },

//             {
//               id: "/admin_deposite_report_datewise",
//               title: 'Datewise Deposit',
//               href: "/admin_deposite_report_datewise",
//             },
//             {
//               id: "/admin_withdrawal_report_datewise",
//               title: 'Datewise Withdrow',
//               href: "/admin_withdrawal_report_datewise",
//             },
//           ],
//         },
//         {
//           id: "usertranstionlistAndPermissionsManagement",
//           title: " User Wallet",
//           dropdown: true,
//           icon: (
//             <svg
//               width="24"
//               height="24"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//             >
//               <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
//               <polyline points="7 10 12 15 17 10"></polyline>
//               <line x1="12" y1="15" x2="12" y2="3"></line>
//             </svg>
//           ),
//           children: [
//             {
//               id: "/userwallet",
//               title: "Transaction List",
//               href: "/userwallet",
//             },
//           ],
//         },
//         {
//           id: "RolesAndPermissionsManagement",
//           title: "Helpers",
//           dropdown: true,
//           icon: (
//             <svg
//               width="24"
//               height="24"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//             >
//               <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
//               <polyline points="7 10 12 15 17 10"></polyline>
//               <line x1="12" y1="15" x2="12" y2="3"></line>
//             </svg>
//           ),
//           children: [
//             {
//               id: "create-roles",
//               title: "Create Helpers",
//               href: "/create_roles",
//             },
//             {
//               id: "all-roles",
//               title: "All Helpers",
//               href: "/all_roles",
//             },
//             {
//               id: "active-roles",
//               title: "Active Helpers",
//               href: "/active_roles",
//             },
//             {
//               id: "inactive-roles",

//               title: "Inactive Helpers",
//               href: "/inactive_roles",
//             },
//           ],
//         },
//         {
//           id: "sportyAndPermissionsManagement",
//           title: "Sport Managment ",
//           dropdown: true,
//           icon: (
//             <svg
//               width="24"
//               height="24"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//             >
//               <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
//               <polyline points="7 10 12 15 17 10"></polyline>
//               <line x1="12" y1="15" x2="12" y2="3"></line>
//             </svg>
//           ),
//           children: [
//             {
//               id: "Sport",
//               title: "Sports",
//               href: "/sports",
//             },
//             {
//               id: "Cricket",
//               title: "Cricket",
//               href: "/cricket",
//             },
//           ],
//         },
//         {
//           id: "EventAndPermissionsManagement",
//           title: " Event Managment",
//           dropdown: true,
//           icon: (
//             <svg
//               width="24"
//               height="24"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//             >
//               <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
//               <polyline points="7 10 12 15 17 10"></polyline>
//               <line x1="12" y1="15" x2="12" y2="3"></line>
//             </svg>
//           ),
//           children: [
//             {
//               id: "/active_events",
//               title: "Active Events",
//               href: "/active_events",
//             },

//             {
//               id: "inActive_events",
//               title: "InActive",
//               href: "/inActive_events",
//             },
//             {
//               id: "complete_events",
//               title: "Complete",
//               href: "/complete_events",
//             },

//           ],
//         },
//         {
//           id: "fancyAndPermissionsManagement",
//           title: " Fancy Managment",
//           dropdown: true,
//           icon: (
//             <svg
//               width="24"
//               height="24"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//             >
//               <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
//               <polyline points="7 10 12 15 17 10"></polyline>
//               <line x1="12" y1="15" x2="12" y2="3"></line>
//             </svg>
//           ),
//           children: [
//             {
//               id: "/fancy_Managment",
//               title: "Fancy Managment",
//               href: "/fancy_Managment",
//             },

//           ],
//         },
//          {
//           id: "ResultAndPermissionsManagement",
//           title: " Result Managment",
//           dropdown: true,
//           icon: (
//             <svg
//               width="24"
//               height="24"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//             >
//               <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
//               <polyline points="7 10 12 15 17 10"></polyline>
//               <line x1="12" y1="15" x2="12" y2="3"></line>
//             </svg>
//           ),
//           children: [
//             {
//               id: "/declare_result",
//               title: "Result Declare",
//               href: "/declare_result",
//             },

//           ],
//         },
        
//         {
//           id: "slider",
//           title: "Slider",
//           href: "/slider_lists",
//           icon: (
//             <svg
//               width="24"
//               height="24"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//             >
//               <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
//               <polyline points="16 17 21 12 16 7"></polyline>
//               <line x1="21" y1="12" x2="9" y2="12"></line>
//             </svg>
//           ),
//         },
//         {
//           id: "Sub Admin",
//           title: "Sub Admin",
//           href: "/sub_admin",
//           icon: (
//             <svg
//               width="24"
//               height="24"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//             >
//               <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
//               <polyline points="16 17 21 12 16 7"></polyline>
//               <line x1="21" y1="12" x2="9" y2="12"></line>
//             </svg>
//           ),
//         },

//         {
//           id: "wallettAndPermissionsManagement",
//           title: " Wallet",
//           dropdown: true,
//           icon: (
//             <svg
//               width="24"
//               height="24"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//             >
//               <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
//               <polyline points="7 10 12 15 17 10"></polyline>
//               <line x1="12" y1="15" x2="12" y2="3"></line>
//             </svg>
//           ),
//           children: [

//             {
//               id: "depositSection",
//               title: "Deposit",
//               dropdown: true,
//                icon: <BsBank />,
//               children:[
//                      {
//               id: "/deposite_pending",
//               title: " Deposit Panding List",
//               href: "/deposite_pending",
//             },
//             {
//               id: "/deposite_complete",
//               title: "Deposit Complete",
//               href: "/deposite_complete",
//             },
//             {
//               id: "/deposite_reject",
//               title: "Deposit Reject ",
//               href: "/deposite_reject",
//             },
//             {
//               id: "/deposite_report_datewise",
//               title: 'Datewise Deposit list',
//               href: "/deposite_report_datewise",
//             },

//               ]
//             },
//                {
//       id: "withdrawSection",
//       title: "Withdraw",
//       dropdown: true,
//       children:[
//          {
//               id: "/withdrawal_pending",
//               title: " Withdrow Panding List",
//               href: "/withdrawal_pending",
//             },
//             {
//               id: "/withdrawal_complete",
//               title: "Withdrow Complete",
//               href: "/withdrawal_complete",
//             },
//             {
//               id: "/withdrawal_reject",
//               title: "Withdrow Reject ",
//               href: "/withdrawal_reject",
//             },
//             {
//               id: "/withdrawal_report_datewise",
//               title: ' Datewise Withdrow list',
//               href: "/withdrawal_report_datewise",
//             },

//       ]
//     },
//           ]
//         },     
     
//         {
//           id: "setting",
//           title: "Setting",
//           href: "/setting",
//           icon: (
//             <svg
//               width="24"
//               height="24"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//             >
//               <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
//               <polyline points="16 17 21 12 16 7"></polyline>
//               <line x1="21" y1="12" x2="9" y2="12"></line>
//             </svg>
//           ),
//         },
//         {
//           id: "logout",
//           title: "Logout",
//           onClick: handleLogout,
//           href: "#",
//           icon: (
//             <svg
//               width="24"
//               height="24"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//             >
//               <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
//               <polyline points="16 17 21 12 16 7"></polyline>
//               <line x1="21" y1="12" x2="9" y2="12"></line>
//             </svg>
//           ),
//         },

//       ],
//     },
//   ];

//   useEffect(() => {
//     const findActiveItem = (items) => {
//       for (const item of items) {
//         if (item.href === location.pathname) {
//           return { itemId: item.id, parentId: null };
//         }
//         if (item.children) {
//           const childMatch = item.children.find(
//             (child) => child.href === location.pathname
//           );
//           if (childMatch) {
//             setActiveDropdowns({ [item.id]: true }); // Open only the matching parent
//             return { itemId: childMatch.id, parentId: item.id };
//           }
//         }
//       }
//       return { itemId: null, parentId: null };
//     };

//     for (const section of menuItems) {
//       const { itemId, parentId } = findActiveItem(section.items);
//       if (itemId) {
//         setActiveItem(itemId);
//         setActiveParent(parentId);
//         break;
//       } else {
//         setActiveItem(null);
//         setActiveParent(null);
//         setActiveDropdowns({}); // Close all dropdowns if no match
//       }
//     }
//   }, [location.pathname]);
//   const renderMenuItem = (item, level = 0) => {
//     const isDropdownOpen = activeDropdowns[item.id];
//     const isActive = activeItem === item.id || activeParent === item.id;
//     // const canShowItem =
//     //   item.id === "logout" || // Always show logout
//     //   isPermitted(item.href) || // Check permission for this item
//     //   (item.dropdown &&
//     //     item.children?.some((child) => isPermitted(child.href))); // Check any submenu allowed
//     const canShowItem = true;

//     if (!canShowItem) return null;
//     return (
//       <li key={item.id} className={`menu-item ${isActive ? "active" : ""}`}>
//         <Link
//           to={item.dropdown ? "#" : item.href || "#"}
//           className="menu-link"
//           //   onClick={(e) => {
//           //     if (item.onClick) {
//           //       item.onClick();
//           //     } else if (item.dropdown) {
//           //       toggleDropdown(item.id);
//           //     } else {
//           //       handleItemClick(item.id);
//           //     }
//           //   }
//           //    onToggleSidebar();
//           // }
//           onClick={(e) => {
//             if (item.onClick) {
//               item.onClick();
//             } else if (item.dropdown) {
//               toggleDropdown(item.id);
//             } else {
//               handleItemClick(item.id);
//             }
//           }}
//         >
//           {item.icon && <span className="menu-icon">{item.icon}</span>}
//           <span className="menu-text">{item.title}</span>
//           {item.badge && (
//             <span className={`badge ${item.badge.class}`}>
//               {item.badge.text}
//             </span>
//           )}
//           {item.dropdown && (
//             <span className={`menu-arrow ${isDropdownOpen ? "open" : ""}`}>
//               <IoIosArrowDown />
//             </span>
//           )}
//         </Link>
//         {/* Submenu */}
//         {item.dropdown && isDropdownOpen && item.children && (
//           <div className="collapse show">
//             <ul className="sub-menu">
//               {item.children.map((child) => {
//                 const canShowChild = isPermitted(child.href);
//                 if (!canShowChild) return null;

//                 return child.dropdown ? (
//                   renderMenuItem(child, level + 1)
//                 ) : (
//                   <li
//                     key={child.id}
//                     className={`menu-item ${activeItem === child.id ? "active" : ""
//                       }`}
//                   >
//                     <Link
//                       to={child.href}
//                       className="menu-link"
//                       // onClick={() => handleItemClick(child.id, item.id)}
//                       onClick={() => {
//                         handleItemClick(child.id, item.id);
//                       }}
//                     >
//                       <span className="menu-text">{child.title}</span>
//                     </Link>
//                   </li>
//                 );
//               })}
//             </ul>
//           </div>
//         )}
//       </li>
//     );
//   };

//   return (
//     <React.Fragment>
//       <div className={`sidebar ${!isOpen ? "closed" : ""}`}>
//         {!isOpen && (
//           <div className="overlaysidebar" onClick={onToggleSidebar}></div>
//         )}
//         {!isOpen && (
//           <div className="closebutton" onClick={onToggleSidebar}>
//             <IoMdClose />
//           </div>
//         )}
//         <div className="main-menu">
//           <div className="logo-box">
//             <a href="/dashboard">
//               {/* <img
//                 src={
//                   isDark
//                     ? `${process.env.PUBLIC_URL}/assets/images/logo_dark.png`
//                     : `${process.env.PUBLIC_URL}/assets/images/logo.png`
//                 }
//                 alt="logo"
//                 className="logo-lg"
//                 height="40"
//               /> */}
//             </a>
//           </div>
//           <div className="sidebar-content">
//             <ul className="app-menu">
//               {menuItems.map((section) => (
//                 <React.Fragment key={section.section}>
//                   <li className="menu-title">{section.section}</li>
//                   {section.items.map((item) => renderMenuItem(item))}
//                 </React.Fragment>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </div>
//     </React.Fragment>
//   );
// };
// export default Sidebar;
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
const userTypes = localStorage.getItem("userType");
  const storedPermissions = JSON.parse(localStorage.getItem("permissions")) || [];

  useEffect(() => {
    if (isMobileview) {
      setSideBarClose(true);
    } else {
      setSideBarClose(false);
    }
  }, [isMobileview]);
  // const toggleDropdown = (id) => {
  //   setActiveDropdowns((prev) => {
  //     const isOpen = !!prev[id];
  //     return isOpen ? {} : { [id]: true };
  //   });
  // };



const toggleDropdown = (id) => {
  setActiveDropdowns((prev) => ({
    ...prev,
    [id]: !prev[id],
  }));
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
  // const isPermitted = (href) => {
  //   if (isAllAccessUser || permissions.includes("*")) return true;
  //   return permissions.includes(href);
  // };

 const isPermitted = (id) => {
    if (userTypes === "admin" || userTypes === "tech_admin") return true;
    if (!id) return true;
    return storedPermissions.includes(id);
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
          id: "User Managment",
          title: " User Managment",
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
              id: "all_users",
              title: "All Users List",
              href: "/all_users",
            },
            {
              id: "active_users",
              title: "Active Users",
              href: "/active_users",
            },
            {
              id: "inactive_users",
              title: "InActive Users ",
              href: "/inactive_users",
            },
            {
              id: "/user-NoteList",
              title: "Users Note List",
              href: "/user-NoteList",
            },

          ],
        },
        {
          id: "Bet Managment",
          title: " Bet Managment",
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
              id: "all_bets",
              title: "All Bets List",
              href: "/all_bets_lists",
            },


          ],
        },
        {
          id: "adminchat",
          title: "Users Chat",
          href: "/adminchat",
          icon: <IoChatboxEllipses />,
        },
        {
          id: "adminwalletAndPermissionsManagement",
          title: " Admin Wallet",
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
              id: "/admin_deposit_lists",
              title: "Deposit List",
              href: "/admin_deposit_lists",
            },
            {
              id: "/admin_withdrow_lists",
              title: 'Withdrow List',
              href: "/admin_withdrow_lists",
            },

            {
              id: "/admin_deposite_report_datewise",
              title: 'Datewise Deposit',
              href: "/admin_deposite_report_datewise",
            },
            {
              id: "/admin_withdrawal_report_datewise",
              title: 'Datewise Withdrow',
              href: "/admin_withdrawal_report_datewise",
            },
          ],
        },
        // {
        //   id: "user_wallet",
        //   title: " User Wallet",
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
        //       id: "userwallet",
        //       title: "Transaction List",
        //       href: "/userwallet",
        //     },
        //   ],
        // },
        // {
        //   id: "RolesAndPermissionsManagement",
        //   title: "Helpers",
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
        //       id: "create-roles",
        //       title: "Create Helpers",
        //       href: "/create_roles",
        //     },
        //     {
        //       id: "all-roles",
        //       title: "All Helpers",
        //       href: "/all_roles",
        //     },
        //     {
        //       id: "active-roles",
        //       title: "Active Helpers",
        //       href: "/active_roles",
        //     },
        //     {
        //       id: "inactive-roles",

        //       title: "Inactive Helpers",
        //       href: "/inactive_roles",
        //     },
        //   ],
        // },
        // {
        //   id: "sportyAndPermissionsManagement",
        //   title: "Sport Managment ",
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
        //       id: "Sport",
        //       title: "Sports",
        //       href: "/sports",
        //     },
        //     {
        //       id: "Cricket",
        //       title: "Cricket",
        //       href: "/cricket",
        //     },
        //   ],
        // },
        {
  id: "Game Management",
  title: "Sport Management",
  dropdown: true,
  children: [
    {
      id: "sports_management",
      title: "Sports",
      href: "/sports",
    },
    {
      id: "cricket_management",
      title: "Cricket",
      href: "/cricket",
    },
  ],
},

        // {
        //   id: "EventAndPermissionsManagement",
        //   title: " Event Managment",
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
        //       id: "/active_events",
        //       title: "Active Events",
        //       href: "/active_events",
        //     },

        //     {
        //       id: "inActive_events",
        //       title: "InActive",
        //       href: "/inActive_events",
        //     },
        //     {
        //       id: "complete_events",
        //       title: "Complete",
        //       href: "/complete_events",
        //     },

        //   ],
        // },
        {
  id: "event_management",
  title: "Event Management",
  dropdown: true,
  children: [
    { id: "event_management", title: "Active Events", href: "/active_events" },
    { id: "event_management", title: "Inactive Events", href: "/inActive_events" },
    { id: "event_management", title: "Complete Events", href: "/complete_events" }
  ]
},

        // {
        //   id: "fancyAndPermissionsManagement",
        //   title: " Fancy Managment",
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
        //       id: "/fancy_Managment",
        //       title: "Fancy Managment",
        //       href: "/fancy_Managment",
        //     },

        //   ],
        // },
        {
  id: "fancy_management",
  title: "Fancy Management",
  dropdown: true,
  children: [
    { id: "fancy_management", title: "Fancy Management", href: "/fancy_Managment" }
  ]
},

         {
          id: "ResultAndPermissionsManagement",
          title: " Result Managment",
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
              id: "declare_result",
              title: "Result Declare",
              href: "/declare_result",
            },

          ],
        },
        
        {
          id: "slider",
          title: "Slider",
          href: "/slider_lists",
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
        {
          id: "Sub Admin",
          title: "Sub Admin",
          href: "/sub_admin",
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

        {
          id: "wallettAndPermissionsManagement",
          title: " Wallet",
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
              id: "depositSection",
              title: "Deposit",
              dropdown: true,
               icon: <BsBank />,
              children:[
                     {
              id: "deposite_pending",
              title: " Deposit Panding List",
              href: "/deposite_pending",
            },
            {
              id: "deposite_complete",
              title: "Deposit Complete",
              href: "/deposite_complete",
            },
            {
              id: "deposite_reject",
              title: "Deposit Reject ",
              href: "/deposite_reject",
            },
            {
              id: "deposite_report_datewise",
              title: 'Datewise Deposit list',
              href: "/deposite_report_datewise",
            },

              ]
            },
               {
      id: "withdrawSection",
      title: "Withdraw",
      dropdown: true,
      children:[
         {
              id: "withdrawal_pending",
              title: " Withdrow Panding List",
              href: "/withdrawal_pending",
            },
            {
              id: "withdrawal_complete",
              title: "Withdrow Complete",
              href: "/withdrawal_complete",
            },
            {
              id: "withdrawal_reject",
              title: "Withdrow Reject ",
              href: "/withdrawal_reject",
            },
            {
              id: "withdrawal_report_datewise",
              title: ' Datewise Withdrow list',
              href: "/withdrawal_report_datewise",
            },

      ]
    },
          ]
        },     
     
        {
          id: "app_settings",
          title: "Setting",
          href: "/setting",
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
    // const canShowItem =
    //   item.id === "logout" || // Always show logout
    //   isPermitted(item.href) || // Check permission for this item
    //   (item.dropdown &&
    //     item.children?.some((child) => isPermitted(child.href))); // Check any submenu allowed
   const canShowItem =
    isPermitted(item.id) || 
    (item.dropdown && item.children?.some(c => isPermitted(c.id)));


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
                const canShowChild = isPermitted(child.id);

                if (!canShowChild) return null;

                return child.dropdown ? (
                  renderMenuItem(child, level + 1)
                ) : (
                  <li
                    key={child.id}
                    className={`menu-item ${activeItem === child.id ? "active" : ""
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
