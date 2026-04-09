import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { useLocation } from "react-router";
import Breadcrumb from "../Layout/Breadcrumb";
import breadcrumbMap from "./breadcrumbMap";
import { useNavigate } from "react-router-dom";
const Layout = ({ children, userType, permissions }) => {
  console.warn(userType.type);
  const navigate = useNavigate();
  const location = useLocation();
  // const path = location.pathname;
  const path = "/" + location.pathname.split("/")[1];
  console.warn("permissionspermissionspermissions", path);
  // if (permissions != undefined) {
  // if (permissions.length == 0) {
  //   navigate("/homedashboard");
  // } else {
  //   const hasCreateUser = permissions.includes(path);
  //   if (userType.type != "tech_admin") {
  //     if (hasCreateUser == false) {
  //       navigate("/homedashboard");
  //     }
  //   }
  // }


  useEffect(() => {
    if (permissions.length === 0) {
      navigate("/homedashboard");
    } else {
      const hasCreateUser = permissions.includes(path);
      if (userType.type !== "tech_admin" && !hasCreateUser) {
        navigate("/homedashboard");
      }
    }
  }, [permissions, path, userType, navigate]);


  // }
  // console.warn("opopopop",hasCreateUser)
  // Fallback to 'Dashboard' if no breadcrumb defined for the route
  const breadcrumbLabels = breadcrumbMap[path] || ["Dashboard"];

  // Build breadcrumb items with hrefs (link first item to "/", others to "#")
  const breadcrumbItems = breadcrumbLabels.map((label, index) => ({
    label,
    href: index === 0 ? "/" : "#",
  }));

  const title = breadcrumbLabels[breadcrumbLabels.length - 1];

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    document.body.classList.add("sidebar-open"); // Default class
    setIsSidebarOpen(true); // Set initial state

    return () => {
      document.body.classList.remove("sidebar-open"); // Cleanup on unmount
    };
  }, []);

  // const toggleSidebar = () => {
  //   setIsSidebarOpen(prev => {
  //     const newState = !prev;

  //     if (newState) {
  //       document.body.classList.add('sidebar-open');
  //       document.body.classList.remove('sidebar_toggle');
  //     } else {
  //       document.body.classList.remove('sidebar-open');
  //       document.body.classList.add('sidebar_toggle'); // Add default class back when closing
  //     }

  //     return newState;
  //   });
  // };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => {
      const newState = !prev;

      if (newState) {
        document.body.classList.add("sidebar-open");
        document.body.classList.remove("sidebar_toggle");
      } else {
        document.body.classList.remove("sidebar-open");
        document.body.classList.add("sidebar_toggle"); // Add default class back when closing
      }

      return newState;
    });
  };
  const hideBreadcrumbPaths = ["/adminchat/adminchat-view"];

  const shouldHideBreadcrumb = hideBreadcrumbPaths.includes(location.pathname);
  return (
    <div className="layout-wrapper active">
      <div className="app-layout">
        <Header
          userType={userType}
          permissions={permissions}
          onToggleSidebar={toggleSidebar}
        />
        <div className="main-content">
          <Sidebar
            userType={userType}
            permissions={permissions}
            isOpen={isSidebarOpen}
            onToggleSidebar={toggleSidebar}
          />
          <div className="page-content">
            <div className="minheight">
              <div className="container-fluid">
                {!shouldHideBreadcrumb && (
                  <Breadcrumb title={title} items={breadcrumbItems} />
                )}
                {children}
              </div>
            </div>
            {!shouldHideBreadcrumb && <Footer />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
