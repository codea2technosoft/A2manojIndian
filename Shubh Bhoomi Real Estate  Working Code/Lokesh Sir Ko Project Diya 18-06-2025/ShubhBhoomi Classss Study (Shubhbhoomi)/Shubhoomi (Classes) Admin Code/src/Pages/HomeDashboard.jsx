import React, { useState, useEffect } from 'react';
import {
  MdSettings,
  MdPerson,
  MdCreditCard,
  MdHistory,
  MdEmojiEvents,
  MdBarChart,
  MdAttachMoney,
  MdMoney,
  MdNumbers,
  MdBlock,
  MdNotifications,
  MdCurrencyExchange,
} from 'react-icons/md';
import { FaUserTie, FaBuilding } from 'react-icons/fa';

const iconMap = {
  'cogs': MdSettings,
  'user': MdPerson,
  'credit-card-alt': MdCreditCard,
  'history': MdHistory,
  'trophy': MdEmojiEvents,
  'bar-chart': MdBarChart,
  'inr': MdAttachMoney,
  'money': MdMoney,
  'sort-numeric-desc': MdNumbers,
  'user-times': MdBlock,
  'cog': MdSettings,
  'bell': MdNotifications,
  'usd': MdCurrencyExchange,
  'associate': FaUserTie,
  'project': FaBuilding,
};

const API_URL = process.env.REACT_APP_API_URL;

 const HomeDashboard = () => {
//   const [userType, setUserType] = useState(null);
//   const [dashboardData11, setDashboardData] = useState({
//     todayAssociate: 0,
//     todayChannel: 0,
//     activeProject: 0,
//     activeBlock: 0,
//     activePlot: 0,
//     totalAssociate: 0,
//     totalChannel: 0,
//     totalTeamCount: 0,
//     total_property: 0,
//     total_lead_loan: 0,
//     ongoingProject: 0,
//     completeProject: 0,
//   });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const userTypeStorage = localStorage.getItem("userType");
//     setUserType(userTypeStorage);

    // Admin aur sub-admin dono ke liye same API se data fetch karo
  //   fetchDashboardData();
  // }, []);

  // 🔴 CHANGE: Dashboard.jsx jaisa hi API call - same `/dashboard-list` endpoint
  // const fetchDashboardData = async () => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     const response = await fetch(`${API_URL}/dashboard-list`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     const rawData = await response.json();
  //     console.log("HomeDashboard fetched data:", rawData);

  //     // 🔴 Dashboard.jsx ke same pattern se data map karo
  //     setDashboardData({
  //       todayAssociate: rawData.todayAssociate?.[0]?.total || 0,
  //       todayChannel: rawData.todayChannel?.[0]?.total || 0,
  //       activeProject: rawData.ActiveProject?.[0]?.total || 0,
  //       activeBlock: rawData.Activeblock?.[0]?.total || 0,
  //       activePlot: rawData.ActivePlot?.[0]?.total || 0,
  //       totalAssociate: rawData.AllAssociate?.[0]?.total || 0,
  //       totalChannel: rawData.AllChannel?.[0]?.total || 0,
  //       totalTeamCount: rawData.totalTeamCount?.[0]?.total || 0,
  //       total_property: rawData.TotalPropertyLead?.[0]?.total || 0,
  //       total_lead_loan: rawData.TotalLoanLead?.[0]?.total || 0,
  //       ongoingProject: rawData.ongoingProject?.[0]?.total || 0,
  //       completeProject: rawData.completeProject?.[0]?.total || 0,
  //     });
  //   } catch (error) {
  //     console.error("Dashboard fetch error:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Admin ke liye tiles (static)
  // const adminTiles = [
    // { icon: 'cogs', label: 'App Setting', href: '/administrator/setting/appsetting', points: "2000" },
    // { icon: 'user', label: 'Total App Users', href: '/administrator/user/all-user-list', points: "2000" },
    // { icon: 'credit-card-alt', label: 'Pending Withdrawal', href: '/administrator/withdrawal-pending', points: "2000" },
    // { icon: 'credit-card-alt', label: 'Complete Withdrawal', href: '/administrator/withdrawal-complet', points: "2000" },
    // { icon: 'credit-card-alt', label: 'Reject Withdrawal', href: '/administrator/withdrawal-reject', points: "2000" },
    // { icon: 'history', label: 'Transaction history', href: '/administrator/report-managment/transaction-history', points: "2000" },
    // { icon: 'trophy', label: 'Winners History', href: '/administrator/report-managment/user-winner-history', points: "2000" },
    // { icon: 'bar-chart', label: 'Running Games', href: '/administrator/main-market-list', points: "2000" },
    // { icon: 'inr', label: 'Add user point', href: '/administrator/point-management-add-point', points: "2000" },
    // { icon: 'money', label: 'Add Withdraw', href: '/administrator/point-management-add-point', points: "2000" },
    // { icon: 'sort-numeric-desc', label: 'Declare Main Market Result', href: '/administrator/declare-result/main-market', points: "2000" },
    // { icon: 'sort-numeric-desc', label: 'Declare Delhi Market Result', href: '/administrator/declare-result/delhi-market', points: "2000" },
    // { icon: 'sort-numeric-desc', label: 'Declare Starline Market Result', href: '/administrator/declare-result/starline-market', points: "2000" },
    // { icon: 'user-times', label: 'Blocked List', href: '/administrator/user/unapprove-user-list', points: "2000" },
    // { icon: 'cog', label: 'Game Setting', href: '/administrator/setting/appsetting', points: "2000" },
    // { icon: 'bell', label: 'Send Notice', href: '/administrator/notice-management', points: "2000" },
    // { icon: 'usd', label: 'Change Rates', href: '/administrator/all-game-rate', points: "2000" },
  // ];

  // Sub-admin ke liye tiles (dynamic data se)
  // const subAdminTiles = [
    // { icon: 'associate', label: 'Today Associates', value: dashboardData.todayAssociate, href: '/all-associate-list' },
    // { icon: 'associate', label: 'Total Associates', value: dashboardData.totalAssociate, href: '/all-associate-list' },
    // { icon: 'project', label: 'Active Projects', value: dashboardData.activeProject, href: '/all-project' },
    // { icon: 'project', label: 'Ongoing Projects', value: dashboardData.ongoingProject, href: '/all-project' },
    // { icon: 'project', label: 'Completed Projects', value: dashboardData.completeProject, href: '/all-project' },
    // { icon: 'project', label: 'Total Properties', value: dashboardData.total_property, href: '/property-lead-list' },

  //    { icon: 'associate', label: 'Today Associates', value: dashboardData11.todayAssociate, href: '#' },
  //   { icon: 'associate', label: 'Total Associates', value: dashboardData11.totalAssociate, href: '#' },
  //   { icon: 'project', label: 'Active Projects', value: dashboardData11.activeProject, href: '#' },
  //   { icon: 'project', label: 'Ongoing Projects', value: dashboardData11.ongoingProject, href: '#' },
  //   { icon: 'project', label: 'Completed Projects', value: dashboardData11.completeProject, href: '#' },
  //   { icon: 'project', label: 'Total Properties', value: dashboardData11.total_property, href: '#' },

  // ];

  // if (loading) {
  //   return (
  //     <div className="dashboard">
  //       <div className="loading-spinner">Loading...</div>
  //     </div>
  //   );
  // }

  // Admin View
  // if (userType === 'admin') {
  //   return (
  //     <div className="dashboard">
  //      <p className='mt-3'> Welcome To Home Dashboard</p>
  //       <div className="row color_differnt">
  //         {adminTiles.map((item, index) => {
  //           const IconComponent = iconMap[item.icon] || MdSettings;
  //           return (
  //             <div className="col-md-3 mb-3" key={index}>
  //               <a href={item.href} className='text-decoration-none'>
  //                 <div className="card">
  //                   <div className="card-header bg-white padding_custum">
  //                     <div className="d-flex justify-content-between align-items-center">
  //                       <div>
  //                         <p className="text-sm mb-0 text-capitalize">{item.label}</p>
  //                         <h4 className="mb-0">{item.points}</h4>
  //                       </div>
  //                       <div className="icon_design">
  //                         <IconComponent className="" />
  //                       </div>
  //                     </div>
  //                   </div>
  //                 </div>
  //               </a>
  //             </div>
  //           );
  //         })}
  //       </div>
  //     </div>
  //   );
  // }

  // Sub-admin View
  // return (
  // <div className="dashboard container-fluid py-3">
  //   <div className="row">

  //     <div className="col-12">
  //       <h3 className="fw-bold mb-4 dashboard_heading">
  //         🏠 Home Dashboard
  //       </h3>
  //     </div>

      {/* {subAdminTiles.map((item, index) => (
        <div className="col-lg-3 col-md-4 col-6 mb-4" key={index}>
          
          <div
            className="card dashboard_card border-0"
            style={{
              cursor: item.href ? "pointer" : "default",
            }}
            onClick={() =>
              item.href && (window.location.href = item.href)
            }
          >

            <div className="card-body d-flex align-items-center justify-content-between">

              <div>
                <h6 className="dashboard_label mb-2">
                  {item.label}
                </h6>

                <h3 className="dashboard_value mb-0">
                  {item.value}
                </h3>
              </div>

              <div className="dashboard_icon">
                <IconComponent size={32} />
              </div>

            </div>

          </div>

        </div>
      ))} */}

//     </div>
//   </div>
// );
return (
  <div
    className="container-fluid d-flex align-items-center justify-content-center"
    style={{
      minHeight: "100vh",
      background: "linear-gradient(45deg, #262f55, #b40201)",
      position: "relative",
      overflow: "hidden",
      padding: "30px",
    }}
  >
    {/* Top Glow */}
    <div
      style={{
        position: "absolute",
        top: "-120px",
        right: "-120px",
        width: "350px",
        height: "350px",
        borderRadius: "50%",
        background: "rgba(255,255,255,0.08)",
        filter: "blur(80px)",
      }}
    ></div>

    {/* Bottom Glow */}
    <div
      style={{
        position: "absolute",
        bottom: "-120px",
        left: "-120px",
        width: "300px",
        height: "300px",
        borderRadius: "50%",
        background: "rgba(255,255,255,0.06)",
        filter: "blur(80px)",
      }}
    ></div>

    <div className="row justify-content-center w-100 position-relative">

      <div className="col-lg-8 col-md-10 col-12">

        <div
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
            backdropFilter: "blur(18px)",
            borderRadius: "35px",
            padding: "70px 40px",
            textAlign: "center",
            boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative Circle */}
          <div
            style={{
              position: "absolute",
              top: "-60px",
              right: "-60px",
              width: "180px",
              height: "180px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
            }}
          ></div>

          {/* Badge */}
          <div
            style={{
              display: "inline-block",
              padding: "10px 22px",
              borderRadius: "40px",
              background: "rgba(255,255,255,0.12)",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: "600",
              marginBottom: "30px",
              letterSpacing: "1px",
            }}
          >
            ADMIN PANEL
          </div>

          {/* Welcome Text */}
          <h1
            style={{
              fontSize: "65px",
              fontWeight: "800",
              color: "#ffffff",
              marginBottom: "10px",
              textShadow: "0 4px 20px rgba(0,0,0,0.25)",
            }}
          >
            Welcome
          </h1>

          <h2
            style={{
              fontSize: "34px",
              fontWeight: "600",
              color: "#ffffff",
              marginBottom: "20px",
            }}
          >
            🏠 Home Dashboard
          </h2>

          <p
            style={{
              color: "rgba(255,255,255,0.85)",
              fontSize: "17px",
              lineHeight: "30px",
              maxWidth: "650px",
              margin: "0 auto",
            }}
          >
            Manage analytics, monitor reports and control your
            complete dashboard experience with a modern UI.
          </p>

          {/* Bottom Button */}
          <button
            style={{
              marginTop: "35px",
              border: "none",
              padding: "14px 32px",
              borderRadius: "14px",
              background: "#ffffff",
              color: "#262f55",
              fontWeight: "700",
              fontSize: "15px",
              transition: "0.3s",
              boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
            }}
          >
            Explore Dashboard
          </button>

          {/* Bottom Line */}
          <div
            style={{
              width: "120px",
              height: "5px",
              borderRadius: "20px",
              background: "#ffffff",
              margin: "35px auto 0",
              opacity: 0.8,
            }}
          ></div>
        </div>

      </div>

      {/* {subAdminTiles.map((item, index) => (
        <div className="col-lg-3 col-md-4 col-6 mb-4" key={index}>
          
          <div
            className="card dashboard_card border-0"
            style={{
              cursor: item.href ? "pointer" : "default",
            }}
            onClick={() =>
              item.href && (window.location.href = item.href)
            }
          >

            <div className="card-body d-flex align-items-center justify-content-between">

              <div>
                <h6 className="dashboard_label mb-2">
                  {item.label}
                </h6>

                <h3 className="dashboard_value mb-0">
                  {item.value}
                </h3>
              </div>

              <div className="dashboard_icon">
                <IconComponent size={32} />
              </div>

            </div>

          </div>

        </div>
      ))} */}

    </div>
  </div>
);
};

export default HomeDashboard;