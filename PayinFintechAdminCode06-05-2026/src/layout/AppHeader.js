import { useState, useEffect } from "react";
import { Dropdown, Layout, Menu, Badge, Row, Modal } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
// icons
import { BellIcon, LogoutIcon } from "@heroicons/react/outline";
//actions
import { logoutAction as logout } from "redux/actions/auth";

const { Header } = Layout;
const { confirm } = Modal;

const DropdownContent = () => (
  <Menu>
    <Menu.Item>1st menu item</Menu.Item>
    <Menu.Item>2nd menu item</Menu.Item>
    <Menu.Item>3rd menu item</Menu.Item>
  </Menu>
);

const AppHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = () => {
    confirm({
      title: "Are you sure you want to logout?",
      onOk: () => {
        dispatch(logout());
        navigate("/login");
      },
    });
  };

  return (
    <Header className="app-header">
      {/* <Badge count={5} offset={[0, 10]}>
                <div className='app-circle-icon'>
                    <Dropdown overlay={DropdownContent} placement='bottomRight'>
                        <BellIcon width={24} height={24} />
                    </Dropdown>
                </div>
            </Badge> */}
      <Row className="link" align="middle" onClick={onLogout}>
        {/* <LogoutIcon width={24} height={24} set="light" /> */}
        {/* <span className="ml-8">
          <b>Logout</b>
        </span> */}
        <Badge offset={[0, 10]}>
          <div className="app-circle-icon">
            <LogoutIcon width={24} height={24} />
          </div>
        </Badge>
      </Row>
    </Header>
  );
};

export default AppHeader;
