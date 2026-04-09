import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import { useLocation } from 'react-router';
import Breadcrumb from '../Layout/Breadcrumb';
import breadcrumbMap from './breadcrumbMap';
import { useNavigate } from 'react-router-dom';
const Layout = ({ children, userType, permissions }) => {
 const navigate = useNavigate();
 const location = useLocation();
 const path = location.pathname;


 if (userType && userType.type !== 'admin' && path.startsWith('/admin')) {
  navigate('/dashboard'); 
 }

 const breadcrumbLabels = breadcrumbMap[path] || ['Dashboard'];
 const breadcrumbItems = breadcrumbLabels.map((label, index) => ({
  label,
  href: index === 0 ? '/' : '#', // Adjust href for Breadcrumb items if needed for actual navigation
 }));

 const title = breadcrumbLabels[breadcrumbLabels.length - 1];

 const [isSidebarOpen, setIsSidebarOpen] = useState(true);

 useEffect(() => {
  // These class manipulations affect the main body element for sidebar styling
  document.body.classList.add('sidebar-open'); 
  setIsSidebarOpen(true);
 
  return () => {
   document.body.classList.remove('sidebar-open'); 
   document.body.classList.remove('sidebar_toggle'); // Ensure this is also cleaned up
  };
 }, []);


 const toggleSidebar = () => {
  setIsSidebarOpen(prev => {
   const newState = !prev;

   if (newState) {
    document.body.classList.add('sidebar-open');
    document.body.classList.remove('sidebar_toggle'); 
   } else {
    document.body.classList.remove('sidebar-open');
    document.body.classList.add('sidebar_toggle');
   }

   return newState;
  });
 };

 const hideBreadcrumbPaths = ['/adminchat/adminchat-view'];

 const shouldHideBreadcrumb = hideBreadcrumbPaths.includes(location.pathname);
 
 return (
  <div className="layout-wrapper active">
   <div className="app-layout">
    <Header userType={userType} onToggleSidebar={toggleSidebar} />
    <div className="main-content">
     {/* Pass 'permissions' prop to Sidebar */}
     <Sidebar userType={userType} permissions={permissions} isOpen={isSidebarOpen} onToggleSidebar={toggleSidebar} />
     <div className="page-content">
      <div className="minheight">
       <div className="container-fluid">
        {/* {!shouldHideBreadcrumb && (
         <Breadcrumb title={title} items={breadcrumbItems} />
        )} */}
        {children}
       </div>
      </div>
      {!shouldHideBreadcrumb && (
       <Footer />
      )}
     </div>
    </div>
   </div>
  </div>
 );
};

export default Layout;