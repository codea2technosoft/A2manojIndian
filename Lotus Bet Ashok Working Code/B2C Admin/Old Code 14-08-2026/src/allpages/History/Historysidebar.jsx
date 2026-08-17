// import React from 'react';

// const Historysidebar = ({ activeItem }) => {
//   const navItems = [
//     { label: 'Position', path: '#', id: 'position' ,menuheading:"bgcoloractive" },
//     { label: 'Account Summary', path: '/account-summary', id: 'account-summary' },
//     { label: 'Performance', path: '#', id: 'performance' ,menuheading:"bgcoloractive" },
//     { label: 'Current Bets', path: '/current-bets', id: 'current-bets' },
//     { label: 'Betting History', path: '/betting-history', id: 'betting-history' },
//     { label: 'Betting Profit & Loss', path: '/betting-profit-loss', id: 'betting-profit-loss' },
//     { label: 'Transaction History', path: '/transaction-history', id: 'transaction-history' }
//   ];

//   return (
//     <div className="left_side">
//       <div>
//         <div className="sidebar">
//           <div className="sidebar-main">
//             <ul className="menu-list list-unstyled">
//               {navItems.map((item) => (
//                 <li key={item.id} className={`${item.menuheading}`}>
//                   <a
//                     href={item.path}
//                     className={activeItem === item.id ? 'active' : ''}
//                   >
//                     {item.label}
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Historysidebar;

// import React from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';

// const Historysidebar = ({ activeItem }) => {
//   const location = useLocation();
//   const navigate = useNavigate();
  
//   // Current URL se query params extract karein
//   const searchParams = new URLSearchParams(location.search);
//   const adminId = searchParams.get('admin_id');
//   const role = searchParams.get('role');

//   const navItems = [
//     { label: 'Position', path: '#', id: 'position', menuheading: "bgcoloractive" },
//     { label: 'Account Summary', path: '/account-summary', id: 'account-summary' },
//     { label: 'Performance', path: '#', id: 'performance', menuheading: "bgcoloractive" },
//     { label: 'Current Bets', path: '/current-bets', id: 'current-bets' },
//     { label: 'Betting History', path: '/betting-history', id: 'betting-history' },
//     { label: 'Betting Profit & Loss', path: '/betting-profit-loss', id: 'betting-profit-loss' },
//     { label: 'Transaction History', path: '/transaction-history', id: 'transaction-history' },
//     { label: 'Transaction History-2', path: '/transaction-history-2', id: 'transaction-history-2' },
//     { label: 'Lifetime PL', path: '/lifetime-PL', id: 'lifetime-PL' }
//   ];

//   // Query params ke saath path generate karein
//   const getPathWithParams = (path) => {
//     if (path === '#') return '#'; // ✅ # ko waisa hi rakhna hai
    
//     // ✅ Current query params ko preserve karein
//     const params = new URLSearchParams();
//     if (adminId) params.append('admin_id', adminId);
//     if (role) params.append('role', role);
    
//     const queryString = params.toString();
//     return queryString ? `${path}?${queryString}` : path;
//   };

//   // ✅ Handle click for # links
//   const handleLinkClick = (e, path) => {
//     if (path === '#') {
//       e.preventDefault(); // ✅ Prevent navigation
//       // Optional: Show message or do nothing
//       console.log('Performance section coming soon');
//     }
//   };

//   return (
//     <div className="left_side">
//       <div>
//         <div className="sidebar">
//           <div className="sidebar-main">
//             <ul className="menu-list list-unstyled">
//               {navItems.map((item) => (
//                 <li key={item.id} className={item.menuheading}>
//                   <Link
//                     to={getPathWithParams(item.path)}
//                     className={activeItem === item.id ? 'active' : ''}
//                     onClick={(e) => handleLinkClick(e, item.path)}
//                   >
//                     {item.label}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Historysidebar;


import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Historysidebar = ({ activeItem }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Current URL se query params extract karein
  const searchParams = new URLSearchParams(location.search);
  const adminId = searchParams.get('admin_id');
  const role = searchParams.get('role');

  // Role ke hisaab se nav items
  const getNavItems = () => {
    // Agar role 3 (user) hai toh sab items dikhao
    if (parseInt(role) === 3) {
      return [
        { label: 'Position', path: '#', id: 'position', menuheading: "bgcoloractive" },
        { label: 'Account Summary', path: '/account-summary', id: 'account-summary' },
        { label: 'Performance', path: '#', id: 'performance', menuheading: "bgcoloractive" },
        { label: 'Current Bets', path: '/current-bets', id: 'current-bets' },
        { label: 'Betting History', path: '/betting-history', id: 'betting-history' },
        { label: 'Betting Profit & Loss', path: '/betting-profit-loss', id: 'betting-profit-loss' },
        { label: 'Transaction History', path: '/transaction-history', id: 'transaction-history' },
        { label: 'Transaction History-2', path: '/transaction-history-2', id: 'transaction-history-2' },
        { label: 'Lifetime PL', path: '/lifetime-PL', id: 'lifetime-PL' }
      ];
    }
    
    // Role 2 (agent) ya koi aur role ke liye limited items
    return [
      { label: 'Position', path: '#', id: 'position', menuheading: "bgcoloractive" },
      { label: 'Account Summary', path: '/account-summary', id: 'account-summary' },
      { label: 'Performance', path: '#', id: 'performance', menuheading: "bgcoloractive" },
      { label: 'Current Bets', path: '/current-bets', id: 'current-bets' },
      { label: 'Betting History', path: '/betting-history', id: 'betting-history' },
      { label: 'Betting Profit & Loss', path: '/betting-profit-loss', id: 'betting-profit-loss' },
      { label: 'Transaction History', path: '/transaction-history', id: 'transaction-history' }
    ];
  };

  const navItems = getNavItems();

  // Query params ke saath path generate karein
  const getPathWithParams = (path) => {
    if (path === '#') return '#'; // ✅ # ko waisa hi rakhna hai
    
    // ✅ Current query params ko preserve karein
    const params = new URLSearchParams();
    if (adminId) params.append('admin_id', adminId);
    if (role) params.append('role', role);
    
    const queryString = params.toString();
    return queryString ? `${path}?${queryString}` : path;
  };

  // ✅ Handle click for # links
  const handleLinkClick = (e, path) => {
    if (path === '#') {
      e.preventDefault(); // ✅ Prevent navigation
      console.log('Coming soon...');
    }
  };

  return (
    <div className="left_side">
      <div>
        <div className="sidebar">
          <div className="sidebar-main">
            <ul className="menu-list list-unstyled">
              {navItems.map((item) => (
                <li key={item.id} className={item.menuheading}>
                  <Link
                    to={getPathWithParams(item.path)}
                    className={activeItem === item.id ? 'active' : ''}
                    onClick={(e) => handleLinkClick(e, item.path)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Historysidebar;