// import React from 'react';
// import Sidebar from './Historysidebar';

// const Layout = ({ children, activeItem }) => {
//   // Breadcrumb items
//   const breadcrumbItems = [
//     { label: 'MA', strong: 'Lotus77VIP' },
//     // { label: 'AG', strong: 'abhishek gandhi' }
//   ];

//   return (
//     <div className='allcommon'>
//       <section className="py-4 main-inner-outer">
//         <div className="container-fluid">
//           {/* Breadcrumb */}
//           <div className="agent-path mb-4">
//             <ul
//               className="m-0 list-unstyled"
//               style={{
//                 backgroundImage: "linear-gradient(rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)",
//                 border: "1px solid rgb(187, 187, 187)"
//               }}
//             >
//               {breadcrumbItems.map((item, index) => (
//                 <li key={index}>
//                   <a href="#">
//                     <span>{item.label}</span>
//                     <strong>{item.strong}</strong>
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           <div className="accout_cols_outer">
//             {/* Sidebar - Global */}
//             <Sidebar activeItem={activeItem} />
            
//             {/* Main Content - Page specific */}
//             <div className="right_side">
//               {children}
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Layout;

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Historysidebar';
import { getAdminProfile, getUserProfileData } from "../../Server/api";

const Layout = ({ children, activeItem }) => {
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [userLabel, setUserLabel] = useState(''); // AG ya CL
  const [loading, setLoading] = useState(false);

  // Current URL se query params extract karein
  const searchParams = new URLSearchParams(location.search);
  const adminId = searchParams.get('admin_id') || localStorage.getItem("admin_id");
  const role = searchParams.get('role') || localStorage.getItem("role") || 2;

  // Fetch profile data
  const fetchProfile = async () => {
    if (!adminId) {
      console.error("No admin_id found");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        admin_id: adminId,
        role: parseInt(role) || 2
      };

      console.log("Fetching profile for breadcrumb:", payload);

      let response;
      let profileData;

      // Check if role is 3 (user) or 2 (agent)
      if (parseInt(role) === 3) {
        // User profile
        response = await getUserProfileData(payload);
        profileData = response?.data?.data?.admin_profile || response?.data?.admin_profile || response?.data || {};
        // User ke liye label "CL"
        setUserLabel('CL');
      } else {
        // Agent profile (role 2 or any other)
        response = await getAdminProfile(payload);
        profileData = response?.data?.data?.admin_profile || response?.data?.admin_profile || response?.data || {};
        // Agent ke liye label "AG"
        setUserLabel('AG');
      }

      // Get username from profile data
      const userName = profileData.username || profileData.name || adminId;
      console.log("Username for breadcrumb:", userName);
      setUsername(userName);

    } catch (error) {
      console.error("Error fetching profile for breadcrumb:", error);
      // Fallback to adminId if API fails
      setUsername(adminId);
      // Fallback label based on role
      if (parseInt(role) === 3) {
        setUserLabel('CL');
      } else {
        setUserLabel('AG');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [adminId, role]);

  // Breadcrumb items with dynamic username
  const breadcrumbItems = [
    { label: 'MA', strong: 'Lotus77VIP' },
  ];

  // Agar username mil gaya toh add karo with proper label
  if (username) {
    breadcrumbItems.push({ label: userLabel, strong: username });
  }

  return (
    <div className='allcommon'>
      <section className="py-4 main-inner-outer">
        <div className="container-fluid">
          {/* Breadcrumb */}
          <div className="agent-path mb-4">
            <ul
              className="m-0 list-unstyled"
              style={{
                backgroundImage: "linear-gradient(rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)",
                border: "1px solid rgb(187, 187, 187)"
              }}
            >
              {breadcrumbItems.map((item, index) => (
                <li key={index}>
                  <a href="#">
                    <span>{item.label}</span>
                    <strong>{item.strong}</strong>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="accout_cols_outer">
            {/* Sidebar - Global */}
            <Sidebar activeItem={activeItem} />
            
            {/* Main Content - Page specific */}
            <div className="right_side">
              {children}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Layout;