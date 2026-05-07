import { useState, useEffect } from "react";
import { Layout, Menu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
// images
import logo from "assets/images/logo.png";
import logoIcon from "assets/images/favicon.png";
// icons

import newOverview from "assets/images/overview.png";
import newtransaction from "assets/images/transaction.png";
import newuser from "assets/images/Permission.png";
import newpayinpayout from "assets/images/payinpayout.png";
import newLEDGER from "assets/images/LEDGER.png";
import newreports from "assets/images/reports.png";
import newusericon from "assets/images/usersicon.png";
import usersIcon from "assets/images/Userswhite.png";
import overviewWhite from "assets/images/whiteIcon/overviewWhite.png";
import transactionwWhite from "assets/images/whiteIcon/transactionWhite.png";
import PermissionWhite from "assets/images/whiteIcon/PermissionWhite.png";
import payinandpayoutWhite from "assets/images/whiteIcon/payinandpayoutWhite.png";
import LEDGERWhite from "assets/images/whiteIcon/LEDGERWhite.png";
import gatewayreportsWhite from "assets/images/whiteIcon/gatewayreportsWhite.png";
import paypal from "assets/images/paypal.png";
import paypal_white from "assets/images/whiteIcon/paypal_white.png";

import {
  ChartSquareBarIcon,
  CurrencyRupeeIcon,
  GlobeIcon,
  UserGroupIcon,
  CloudIcon,
  ServerIcon,
  CalendarIcon,
  ShareIcon,
  UsersIcon,
  CogIcon,
  NewspaperIcon,
  MailIcon,
  ColorSwatchIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@heroicons/react/outline";

import { HiMenuAlt2 } from "react-icons/hi";

const { Sider } = Layout;

const menu = [
  {
    title: "Overview Payout",
    key: "overview",
    icon: [
      <img
        src={newOverview}
        alt="Overview"
        width={24}
        height={24}
        className="normalWhite ant-menu-item-icon"
      />,
      <img
        src={overviewWhite}
        alt="Overview"
        width={24}
        height={24}
        className="activeWhite ant-menu-item-icon"
      />,
    ],
    path: "/overview",
  },

  {
    title: "Overview Payin",
    key: "overviewpayin",
    icon: [
      <img
        src={newOverview}
        alt="overview payin"
        width={24}
        height={24}
        className="normalWhite ant-menu-item-icon"
      />,
      <img
        src={overviewWhite}
        alt="overview payin"
        width={24}
        height={24}
        className="activeWhite ant-menu-item-icon"
      />,
    ],
    path: "/overviewpayin",
  },

  {
    title: "Transaction Payout",
    key: "transaction",
    icon: [
      <img
        src={newtransaction}
        alt="Transaction"
        width={24}
        height={24}
        className="normalWhite ant-menu-item-icon"
      />,
      <img
        src={transactionwWhite}
        alt="Transaction"
        width={24}
        height={24}
        className="activeWhite ant-menu-item-icon"
      />,
    ],
    path: "/transaction",
  },

{
    title: "Account Payout Report",
    key: "accountpayoutreport",  // Space hataya
    icon: [
      <img
        src={newtransaction}
        alt="Account Payout Report"
        width={24}
        height={24}
        className="normalWhite ant-menu-item-icon"
      />,
      <img
        src={transactionwWhite}
        alt="Account Payout Report"
        width={24}
        height={24}
        className="activeWhite ant-menu-item-icon"
      />,
    ],
    path: "/account-payout-report",
},

  {
    title: "Transaction Payin",
    key: "transactionspayin",
    icon: [
      <img
        src={newreports}
        alt="transactionspayin"
        width={24}
        height={24}
        className="normalWhite ant-menu-item-icon"
      />,
      <img
        src={gatewayreportsWhite}
        alt="transactionspayin"
        width={24}
        height={24}
        className="activeWhite ant-menu-item-icon"
      />,
    ],
    path: "/transactionspayin",
  },
  {
    title: "Paypal Transaction",
    key: "paypal_transaction",
    icon: [
      <img
        src={paypal}
        alt="Transaction"
        width={24}
        height={24}
        className="normalWhite ant-menu-item-icon"
      />,
      <img
        src={paypal_white}
        alt="Transaction"
        width={24}
        height={24}
        className="activeWhite ant-menu-item-icon"
      />,
    ],
    path: "/Paypal-Transaction",
  },

  {
    title: "Users",
    icon: [
      <img
        src={newusericon}
        alt="Users"
        width={24}
        height={24}
        className="normalWhite ant-menu-item-icon"
      />,
      <img
        src={usersIcon}
        alt="Users"
        width={24}
        height={24}
        className="activeWhite ant-menu-item-icon"
      />,
    ],
    key: "users",
    path: "/users",
  },

  {
    title: "Roles & Permission",
    key: "roles_permission",
    icon: [
      <img
        src={newuser}
        alt="Roles & Permission"
        width={24}
        height={24}
        className="normalWhite ant-menu-item-icon"
      />,
      <img
        src={PermissionWhite}
        alt="Roles & Permission"
        width={24}
        height={24}
        className="activeWhite ant-menu-item-icon"
      />,
    ],
    path: "/payin-payout-permission",
  },

  {
    title: "Gateway Setting",
    icon: [
      <img
        src={newpayinpayout}
        alt="PayIN & Payout"
        width={24}
        height={24}
        className="normalWhite ant-menu-item-icon"
      />,
      <img
        src={payinandpayoutWhite}
        alt="PayIN & Payout"
        width={24}
        height={24}
        className="activeWhite ant-menu-item-icon"
      />,
    ],
    key: "dashboard_setting",
    path: "/payin-payout",
  },

  {
    title: "Ledger",
    key: "razorpay",
    icon: [
      <img
        src={newLEDGER}
        alt="Ledger"
        width={24}
        height={24}
        className="normalWhite ant-menu-item-icon"
      />,
      <img
        src={LEDGERWhite}
        alt="Ledger"
        width={24}
        height={24}
        className="activeWhite ant-menu-item-icon"
      />,
    ],
    path: "/partner-merchantUser-list",
  },

  // {
  //   title: "Gateway Report",
  //   key: "getwayreport",
  //   icon: [
  //     <img
  //       src={newreports}
  //       alt="Gateway Report"
  //       width={24}
  //       height={24}
  //       className="normalWhite ant-menu-item-icon"
  //     />,
  //     <img
  //       src={gatewayreportsWhite}
  //       alt="Gateway Report"
  //       width={24}
  //       height={24}
  //       className="activeWhite ant-menu-item-icon"
  //     />,
  //   ],
  //   path: "/report",
  // },

  // {
  //   title: "Add GateWay",
  //   key: "services",
  //   icon: <ShareIcon width={24} height={24} />,
  //   path: "/servicesss",
  // },
];

const AppSidebar = (props) => {
  const { isCollapsed, toggleCollapse } = props;

  const [selectedKeys, setSelectedKeys] = useState(["overview"]);
  const [openKeys, setOpenKeys] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let childIndex = -1;
    const selectedMenuItem = menu.find((item) => {
      if (item.childrens) {
        const tmp = item.childrens.findIndex(
          (child) => location.pathname === child.path // Exact match for children paths
        );
        if (tmp >= 0) {
          childIndex = tmp;
          return true;
        }
        return false;
      } else {
        return location.pathname === item.path; // Exact match for top-level paths
      }
    });

    if (selectedMenuItem) {
      if (selectedMenuItem.childrens) {
        setSelectedKeys([
          selectedMenuItem.key,
          selectedMenuItem.childrens[childIndex].key,
        ]);
        setOpenKeys([selectedMenuItem.key]);
      } else {
        setSelectedKeys([selectedMenuItem.key]);
      }
    }
  }, [location.pathname]);

  useEffect(() => {
    if (isCollapsed) setOpenKeys([]);
  }, [isCollapsed]);

  const onToggleSubMenu = (key) => {
    if (openKeys.includes(key)) {
      setOpenKeys([]);
    } else {
      setOpenKeys([key]);
    }
  };

  return (
    <Sider className="app-sidebar" theme="dark" collapsed={isCollapsed}>
      {isCollapsed ? (
        <img src={logoIcon} className="logo-collapsed mt-8 ml-16" />
      ) : (
        <img src={logo} className="logo mt-8 ml-24 mr-24" />
      )}
      <Menu
        mode="inline"
        className="sidebar-menu"
        selectedKeys={selectedKeys}
        openKeys={openKeys}
        theme="dark"
        onOpenChange={setOpenKeys}
        onClick={({ key }) => setSelectedKeys([key])}
      >
        <Menu.Item
          key={"collapse"}
          icon={
            isCollapsed ? (
              <ArrowRightIcon width={24} height={24} />
            ) : (
              <HiMenuAlt2
                set="light"
                width={24}
                height={24}
                className="humburger"
              />
            )
          }
          onClick={toggleCollapse}
          className="menu-item--collapse toggle"
        >
          {isCollapsed ? "Expand Menu" : "Collapse Menu"}
        </Menu.Item>
        {menu.map((item) => {
          if (item.childrens && item.childrens.length) {
            return (
              <Menu.SubMenu
                key={item.key}
                icon={item.icon}
                title={item.title}
                theme="dark"
                onTitleClick={() => onToggleSubMenu(item.key)}
              >
                {item.childrens.map((child) => (
                  <Menu.Item
                    key={child.key}
                    icon={child.icon}
                    theme="dark"

                    onClick={() => navigate(child.path)}
                  >
                    {child.title}
                  </Menu.Item>
                ))}
              </Menu.SubMenu>
            );
          }
          return (
            <Menu.Item
              key={item.key}
              icon={item.icon}
              onClick={() => navigate(item.path)}
            >
              {item.title}
            </Menu.Item>
          );
        })}
      </Menu>
    </Sider>
  );
};

export default AppSidebar;
