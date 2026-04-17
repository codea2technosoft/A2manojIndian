import React, { useState, useEffect } from "react";
import "./Sidebar.scss";
import { IoIosArrowDown } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { RiGroupLine } from "react-icons/ri";
import { GoProjectRoadmap } from "react-icons/go";
import { FaUserTie, FaMoneyCheckAlt, FaWallet } from "react-icons/fa";
import { IoIosGitNetwork } from "react-icons/io";
import { TbWorldWww } from "react-icons/tb";
import { LuLayoutDashboard } from "react-icons/lu";
import { MdOutlineLocationOn } from "react-icons/md";

const Sidebar = ({ isOpen, onToggleSidebar, userType, permissions }) => {

  const [activeParent, setActiveParent] = useState(null);
  const [activeDropdowns, setActiveDropdowns] = useState({});
  const [sideBarClose, setSideBarClose] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [isDark, setIsDark] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobileview = window.innerWidth <= 991;

  const [menuItems, setMenuItems] = useState([
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
          icon: <LuLayoutDashboard />,
          checked: true
        },


        // {
        //   id: "AccountReport",
        //   title: "Accounts Report",
        //   href: "/account-report",
        //   icon: <LuLayoutDashboard />,
        //   checked: true
        // },

        {
          id: "AccountReport",
          title: "Accounts Report",
          dropdown: true,
          icon: <LuLayoutDashboard />,
          checked: false,
          children: [
            { id: "AccountReports", title: "Accounts Report", href: "/account-report", checked: false },
            { id: "CRSettleReports", title: "TDS CR Settle Reports", href: "/cr-settle-reports", checked: false },
            { id: "DRSettleReports", title: "TDS DR Settle Reports", href: "/dr-settle-reports", checked: false },
          ]
        },
        {
          id: "WalletLedger",
          title: "Wallet Ledger",
          dropdown: true,
          icon: <LuLayoutDashboard />,
          checked: false,
          children: [
            { id: "WalletLedger", title: "Wallet Ledger", href: "/admin-wallet-report", checked: false },
            { id: "projectledger", title: "Project Ledger", href: "/admin-project-wise-ledger", checked: false },
            { id: "PlotLedger", title: "Unit Ledger", href: "/admin-plot-ledger", checked: false },
            { id: "unitsqyd_added", title: "Unit SQYD Added", href: "/unit-sqyd-added", checked: false },
            { id: "unit_sqyd_ledger", title: "Unit SQYD Ledger", href: "/unit-sqyd-ledger", checked: false },
          ]
        },

        //  {
        //   id: "WalletLedger",
        //   title: "Wallet Ledger",
        //   href: "/admin-wallet-report",
        //   icon: <LuLayoutDashboard />,
        //   checked: true
        // },

        {
          id: "subadminManagement",
          title: "Subadmin",
          dropdown: true,
          icon: <RiGroupLine />,
          checked: false,
          children: [
            { id: "create-subadmin", title: "Create Subadmin", href: "/create-subadmin", checked: false },
            { id: "all-subadmin", title: "All Subadmin", href: "/allsubadmin", checked: false },
            // { id: "subadmin-permission", title: "Permission Management", href: "/subadmin-permission", checked: false }
          ]
        },
        {
          id: "projectManagement",
          title: "Project",
          dropdown: true,
          icon: <GoProjectRoadmap />,
          checked: false,
          children: [
            { id: "all-project", title: "All Project", href: "/all-project", checked: false },
            { id: "active-project", title: "Show Project", href: "/active-project", checked: false },
            { id: "inactive-project", title: "Hide Project", href: "/inactive-project", checked: false },
            { id: "aminities-list", title: "Amenities", href: "/aminities-list", checked: false },
            { id: "all-block-list", title: "All Block", href: "/all-block-list", checked: false },
            { id: "active-block-list", title: "Active Block", href: "/active-block-list", checked: false },
            { id: "inactive-block-list", title: "Inactive Block", href: "/inactive-block-list", checked: false },
            { id: "all-Plot", title: "All Unit", href: "/all-plot", checked: false },
            { id: "active-plot-list", title: "Available Unit", href: "/active-plot-list", checked: false },
            { id: "inactive-plot-list", title: "Sold Unit", href: "/inactive-plot-list", checked: false }
          ]
        },


        //      {
        //   id: "projectChannel",
        //   title: "Channel Partner",
        //   dropdown: true,
        //   icon: <RiGroupLine />,
        //   checked: false,
        //   children: [
        //     { id: "all-channel-list", title: "All Channel List", href: "/all-channel-list", checked: false },
        //     { id: "all-channel-active-list", title: "Active Channel", href: "/all-channel-active-list", checked: false },
        //     { id: "all-channel-inactive-list", title: "Inactive Channel", href: "/all-channel-inactive-list", checked: false }
        //   ]
        // },

        {
          id: "projectAssociate",
          title: "Associate",
          dropdown: true,
          icon: <FaUserTie />,
          checked: false,
          children: [
            { id: "all-associate-list", title: "All Associate List", href: "/all-associate-list", checked: false },
            { id: "all-associate-active-list", title: "Active Associate", href: "/all-associate-active-list", checked: false },
            { id: "all-associate-inactive-list", title: "Inactive Associate", href: "/all-associate-inactive-list", checked: false },
            { id: "my-team-tree-admin", title: "Team Tree", href: "/my-team-tree-admin", checked: false },
            { id: "myteam-parent-chain-upline", title: "Parent Chain", href: "/myteam-parent-chain-upline", checked: false },
            { id: "download-my-11level-team-data-in-excel", title: "My11Level Team", href: "/download-my-11level-team-data-in-excel", checked: false },
            { id: "associates-birthday-lists", title: "Birthday Lists", href: "/associates-birthday-lists", checked: false },
            { id: "associates-anniversary-lists", title: "Anniversary Lists", href: "/associates-anniversary-lists", checked: false },
            { id: "associates-designation-lists", title: "Designation Lists", href: "/associates-designation-lists", checked: false },
            { id: "associates-bima-achiever-lists", title: "Bima Achiever Lists", href: "/associates-bima-achiever-lists", checked: false },

            { id: "associates-bonus-reward-list", title: "Bonus Achiever Lists", href: "/associates-bonus-reward-list", checked: false },



          ]
        },
        {
          id: "leadManagment",
          title: "Lead Managment",
          dropdown: true,
          icon: <GoProjectRoadmap />,
          checked: false,
          children: [
            { id: "all_lead_list", title: "Property Lead", href: "/lead-list", checked: false },
            { id: "loan_list", title: "Loan Lead", href: "/loan-list", checked: false },
            { id: "assign_property_lead_to_subadmin", title: "Assign Calling Leads", href: "/assign-property-lead-to-subadmin", checked: false },
            { id: "upload_property_lead_csv", title: "Calling Leads", href: "/upload-property-lead-csv", checked: false },
            { id: "calling_lead_report", title: "Calling Leads Report", href: "/calling-lead-report", checked: false },
            { id: "property_income_list", title: " Property Income Approved Leads", href: "/property-income-list", checked: false },
            { id: "property_income_unit_is_not_sold_list", title: "Unit is Not Sold", href: "/property-income-unit-is-not-sold-list", checked: false },
            { id: "blocked-inactive-associates-commissions", title: "Blocked Inactive Associates Commissions", href: "/blocked-inactive-associates-commissions", checked: false },
          ]
        },
        {
          id: "expensesmanagement ",
          title: "Expense Management",
          dropdown: true,
          icon: <FaMoneyCheckAlt />,
          checked: false,
          children: [
            { id: "category_list", title: "Category List", href: "/category-list", checked: false },
            { id: "bank_account_list", title: "Bank Account List", href: "/bank-account-list", checked: false },
            { id: "add_expense", title: "Add Expense", href: "/expence-add", checked: false },
            { id: "cr_dr_ledger_report", title: "CR DR Ledger Report", href: "/expenses-list", checked: false },
            { id: "expenses_date_wise", title: "Datewise CR DR Ledger Report", href: "/expenses-date-wise", checked: false },
            { id: "tds_report", title: "TDS Report", href: "/tds-report", checked: false },
            //  { id: "advance_payment",  title: "Advance Payment", href: "/advance-payment", checked: false },
            //  { id: "add_advance_payment",  title: "Add Advance Payment", href: "/add-advance-payment", checked: false },
          ]
        },
        {
          id: "visitmanagement ",
          title: "Visit Report",
          dropdown: true,
          icon: <MdOutlineLocationOn />,
          checked: false,
          children: [
            { id: "visit_list", title: "Visit List", href: "/visit-list", checked: false },
            { id: "visit_date_wise", title: "Visit Date-wise", href: "/visit-date-wise", checked: false },
          ]
        },
        {
          id: "accountmanagement ",
          title: "Bank Account",
          dropdown: true,
          icon: <IoIosGitNetwork />,
          checked: false,
          children: [
            { id: "account_list", title: "Pending Account", href: "/account-list", checked: false },
            { id: "account_list_status", title: "Success/Reject", href: "/account-list-status", checked: false },
          ]
        },
        {
          id: "Withdrawmanagement ",
          title: "Withdrawal",
          dropdown: true,
          icon: <FaWallet />,
          checked: false,
          children: [
            { id: "withdrawal_list", title: "Commission Pending", href: "/withdrawal-list", checked: false },
            { id: "withdrawal_success_list_status", title: "Commission Paid", href: "/withdrawal-success-list-status", checked: false },
            { id: "withdrawal-rejected-list-status", title: "Commission Rejected", href: "/withdrawal-rejected-list-status", checked: false },
            // { id: "withdrawal_list_status", title: "Success/Reject", href: "/withdrawal-list-status", checked: false },
          ]
        },
        {
          id: "HomeLoanIncomeList",
          title: "Income Plan",
          dropdown: true,
          icon: <FaWallet />,
          checked: false,
          children: [
            { id: "income_list", title: "Loan 1", href: "/income-list", checked: false },
            { id: "personal_income_list", title: "Loan 2", href: "/personal-income-list", checked: false },
            { id: "product_income_list", title: "Property", href: "/product-income-list", checked: false },
          ]
        },
        {
          id: "bookingmanagement",
          title: "Booking Management",
          dropdown: true,
          icon: <FaWallet />,
          checked: false,
          children: [
            { id: "pending_booking_list", title: "Pending Booking", href: "/pending-booking", checked: false },
            { id: "booked_pending_booking_list", title: "Booked Pending", href: "/booked-pending-booking", checked: false },
            { id: "ongoing_booking_list", title: "Ongoing Booking", href: "/ongoing-booking", checked: false },
            { id: "complete_booking_list", title: "Complete Booking", href: "/complete-booking", checked: false },
            { id: "cancel_booking_list", title: "Cancel Booking", href: "/cancel-booking", checked: false },
          ]
        },

        // {
        //   id: "income Managment",
        //   title: "Income Management",
        //   dropdown: true,
        //   icon: <FaWallet />,
        //   checked: false,
        //   children: [
        //     { id: "property_income_list", title: " Property Income Approved Leads", href: "/property-income-list", checked: false },

        //     { id: "property_income_unit_is_not_sold_list", title: "Unit is Not Sold", href: "/property-income-unit-is-not-sold-list", checked: false },
        //   ]
        // },

        {
          id: "Self Gifts",
          title: "Self / Team Gift SQYD",
          dropdown: true,
          icon: <FaWallet />,
          checked: false,
          children: [
            { id: "self-gifts", title: "Assign Self Gifts", href: "/self-gifts", checked: false },
            { id: "giftselfassociatelist", title: "Self Gift List", href: "/gift-self-associate-list", checked: false },
            { id: "assign-self-gifts", title: "Assign Team Gifts", href: "/assign-team-self-gifts", checked: false },
            { id: "teamselfgiftslists", title: "Team Gift List", href: "/team-self-gifts-lists", checked: false },
          ]
        },
        {
          id: "offersgiftsmanagement",
          title: "Offers Management",
          dropdown: true,
          icon: <TbWorldWww />,
          checked: false,
          children: [
            { id: "all-offer-gifts", title: "Upload New Offers", href: "/all-offer-gifts", checked: false },

            // { id: "property-awards-self-winners-histories", title: "Self Winner Lists", href: "/property-awards-self-winners-histories", checked: false },
            // { id: "property-awards-team-winners-histories", title: "Team Winner Lists", href: "/property-awards-team-winners-histories", checked: false },

            { id: "monthly-or-special-self-offers-lists", title: "Self Offers Winners", href: "/monthly-or-special-self-offers-lists", checked: false },
            { id: "monthly-or-special-customers-offers-lists", title: "Customers Offers Winners", href: "/monthly-or-special-customers-offers-lists", checked: false },
            { id: "monthly-or-special-team-offers-lists", title: "Team Offers Winners", href: "/monthly-or-special-team-offers-lists", checked: false },
            // { id: "property-awards-winners-histories", title: "View Distributed Lists", href: "#", checked: false },

          ]
        },
        {
          id: "Rewards",
          title: "Royalty Management",
          dropdown: true,
          icon: <TbWorldWww />,
          checked: false,
          children: [
            { id: "mentor-royalty-rewards-lists", title: "Mentor Royalty", href: "/mentor-royalty-rewards-lists", checked: false },
            { id: "voice-president-rewards-lists", title: "Voice President", href: "/voice-president-rewards-lists", checked: false },
            { id: "senior-voice-president-rewards-lists", title: "Sr.Voice President", href: "/senior-voice-president-rewards-lists", checked: false },
            { id: "president-fund-rewards-lists", title: "President Funds", href: "/president-fund-rewards-lists", checked: false },
            { id: "president-level-fund-rewards-lists", title: "President Level Funds", href: "/president-level-fund-rewards-lists", checked: false },
          ]
        },
        {
          id: "lifeTimeRewards",
          title: "Life Time Rewards",
          dropdown: true,
          icon: <TbWorldWww />,
          checked: false,
          children: [
            { id: "add-new-offer-gifts", title: "Upload LifeTime Rewards", href: "/upload-lifetime-rewards", checked: false },
            { id: "all-lifetime-rewards-lists", title: "LifeTime Rewards Lists", href: "/all-lifetime-rewards-lists", checked: false },
            { id: "life-time-rewards-winner-lists", title: "LifeTime Rewards Winner Lists", href: "/life-time-rewards-winner-lists", checked: false },
          ]
        },
        {
          id: "settingManagement",
          title: "General Settings",
          dropdown: true,
          icon: <TbWorldWww />,
          checked: false,
          children: [
            { id: "web-settings", title: "General Setting", href: "/web-settings", checked: false },
            { id: "banner-list", title: "Banner List", href: "/banner-list", checked: false },
            { id: "gallery-list", title: "Gallery List", href: "/gallery-list", checked: false },
            { id: "blogs", title: "Blog", href: "/blogs", checked: false },
            { id: "blog-list", title: "Blog List", href: "/blog-list", checked: false },
            { id: "testimonial", title: "Testimonial", href: "/testimonial", checked: false },
            { id: "testimonial-list", title: "Testimonial List", href: "/testimonial-list", checked: false },
            { id: "document_upload", title: "Document Upload", href: "/document-upload", checked: false },
          ]
        },
        {
          id: "logout",
          title: "Logout",
          href: "#",
          icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          ),
          checked: true
        }
      ]
    }
  ]);

  useEffect(() => {
    setMenuItems(prevMenuItems => {
      return prevMenuItems.map(section => {
        if (section.section === "Menu") {
          return {
            ...section,
            items: section.items.map(item => {
              // HomeDashboard hamesha visible
              if (item.id === "homedashboard") {
                return {
                  ...item,
                  checked: true,
                  children: item.children?.map(child => ({ ...child, checked: true }))
                };
              }

              // Logout hamesha visible
              if (item.id === "logout") {
                return {
                  ...item,
                  checked: true,
                  children: item.children?.map(child => ({ ...child, checked: true }))
                };
              }

              // Dashboard - permission based
              if (item.id === "dashboard") {
                const hasDashboardPermission = userType?.type === 'admin' || permissions?.includes('/dashboard');
                return {
                  ...item,
                  checked: hasDashboardPermission,
                  children: item.children?.map(child => ({ ...child, checked: hasDashboardPermission }))
                };
              }

              // Admin gets full access
              if (userType?.type === 'admin') {
                return {
                  ...item,
                  checked: true,
                  children: item.children?.map(child => ({ ...child, checked: true }))
                };
              }

              const hasParentPermission = permissions?.some(perm => {
                const parentRoute = `/${item.id.toLowerCase().replace('management', '')}`;
                return perm === parentRoute ||
                  perm.includes(item.id.toLowerCase()) ||
                  (item.href && perm === item.href);
              });

              const updatedChildren = item.children?.map(child => {
                const hasChildPermission = permissions?.some(perm => {
                  return perm === child.href ||
                    perm.includes(child.id.toLowerCase());
                });
                return { ...child, checked: hasChildPermission };
              });

              const shouldShowParent = hasParentPermission ||
                updatedChildren?.some(child => child.checked);

              return {
                ...item,
                checked: shouldShowParent,
                children: updatedChildren
              };
            })
          };
        }
        return section;
      });
    });
  }, [permissions, userType]);

  useEffect(() => {
    if (isMobileview) {
      setSideBarClose(true);
    } else {
      setSideBarClose(false);
    }
  }, [isMobileview]);

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

  const toggleDropdown = (id) => {
    setActiveDropdowns(prev => ({
      [id]: !prev[id]
    }));
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/login";
  };

  const handleItemClick = (item) => {
    if (sideBarClose) onToggleSidebar();
    setActiveItem(item.id);
    if (item.id === "logout") {
      handleLogout();
    } else if (item.href && item.href !== "#") {
      navigate(item.href);
    }
  };

  useEffect(() => {
    const findActiveItem = (items) => {
      for (const item of items) {
        if (item.href && item.href.includes(":") &&
          location.pathname.startsWith(item.href.split(":")[0])) {
          return { itemId: item.id, parentId: null };
        }
        if (item.href === location.pathname) {
          return { itemId: item.id, parentId: null };
        }
        if (item.children) {
          const childMatch = item.children.find(child => {
            if (child.href && child.href.includes(":") &&
              location.pathname.startsWith(child.href.split(":")[0])) {
              return true;
            }
            return child.href === location.pathname;
          });
          if (childMatch) {
            setActiveDropdowns(prev => ({ ...prev, [item.id]: true }));
            return { itemId: childMatch.id, parentId: item.id };
          }
        }
      }
      return { itemId: null, parentId: null };
    };

    let foundActive = false;
    for (const section of menuItems) {
      const { itemId, parentId } = findActiveItem(section.items);
      if (itemId) {
        setActiveItem(itemId);
        setActiveParent(parentId);
        foundActive = true;
        break;
      }
    }

    if (!foundActive) {
      setActiveItem(null);
      setActiveParent(null);
    }
  }, [location.pathname, menuItems]);

  const renderMenuItem = (item, level = 0) => {
    const isDropdownOpen = activeDropdowns[item.id];
    const isActive = activeItem === item.id || activeParent === item.id ||
      (item.href && item.href.includes(":") &&
        location.pathname.startsWith(item.href.split(":")[0]));

    // 🔴 YAHAN CHANGE KIYA - dashboard ka special case hata diya
    if (!item.checked && userType?.type !== 'admin' && item.id !== "logout") {
      return null;
    }

    if (item.dropdown && item.children && userType?.type !== 'admin') {
      const hasVisibleChildren = item.children.some(child => child.checked);
      if (!hasVisibleChildren && item.id !== "logout") {
        return null;
      }
    }

    return (
      <li key={item.id} className={`menu-item ${isActive ? "active" : ""}`}>
        <Link
          to={item.dropdown ? "#" : item.href || "#"}
          className="menu-link"
          onClick={(e) => {
            if (item.onClick) {
              item.onClick();
            } else if (item.dropdown) {
              e.preventDefault();
              toggleDropdown(item.id);
            } else {
              handleItemClick(item);
            }
          }}
        >
          {item.icon && <span className="menu-icon">{item.icon}</span>}
          <span className="menu-text">{item.title}</span>
          {item.dropdown && (
            <span className={`menu-arrow ${isDropdownOpen ? "open" : ""}`}>
              <IoIosArrowDown />
            </span>
          )}
        </Link>

        {item.dropdown && isDropdownOpen && item.children && (
          <div className="collapse show">
            <ul className="sub-menu">
              {item.children.map(child =>
                child.checked || userType?.type === 'admin' ? (
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
                        <span className="menu-text submenulistdesign">{child.title}</span>
                      </Link>
                    </li>
                  )
                ) : null
              )}
            </ul>
          </div>
        )}
      </li>
    );
  };

  return (
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
                {section.items.map((item) => renderMenuItem(item))}
              </React.Fragment>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;