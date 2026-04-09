import React from 'react';
import { Breadcrumb } from '../Layout/Breadcrumb';

// Material Icons from react-icons/md
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

// Map icon strings to Material Icons
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
};

const HomeDashboard = () => {
  const tiles = [
    { icon: 'cogs', label: 'App Setting', href: '/administrator/setting/appsetting', points: "2000" },
    { icon: 'user', label: 'Total App Users', href: '/administrator/user/all-user-list', points: "2000" },
    { icon: 'credit-card-alt', label: 'Pending Withdrawal', href: '/administrator/withdrawal-pending', points: "2000" },
    { icon: 'credit-card-alt', label: 'Compleate Withdrawal', href: '/administrator/withdrawal-complet', points: "2000" },
    { icon: 'credit-card-alt', label: 'Reject Withdrawal', href: '/administrator/withdrawal-reject', points: "2000" },
    { icon: 'history', label: 'Transaction history', href: '/administrator/report-managment/transaction-history', points: "2000" },
    { icon: 'trophy', label: 'Winners History', href: '/administrator/report-managment/user-winner-history', points: "2000" },
    { icon: 'bar-chart', label: 'Running Games', href: '/administrator/main-market-list', points: "2000" },
    { icon: 'inr', label: 'Add user point', href: '/administrator/point-management-add-point', points: "2000" },
    { icon: 'money', label: 'Add Withdraw', href: '/administrator/point-management-add-point', points: "2000" },
    { icon: 'sort-numeric-desc', label: 'Declare Main Market Result', href: '/administrator/declare-result/main-market', points: "2000" },
    { icon: 'sort-numeric-desc', label: 'Declare Delhi Market Result', href: '/administrator/declare-result/delhi-market', points: "2000" },
    { icon: 'sort-numeric-desc', label: 'Declare Starline Market Result', href: '/administrator/declare-result/starline-market', points: "2000" },
    { icon: 'user-times', label: 'Blocked List', href: '/administrator/user/unapprove-user-list', points: "2000" },
    { icon: 'cog', label: 'Game Setting', href: '/administrator/setting/appsetting', points: "2000" },
    { icon: 'bell', label: 'Send Notice', href: '/administrator/notice-management', points: "2000" },
    { icon: 'usd', label: 'Change Rates', href: '/administrator/all-game-rate', points: "2000" },
  ];

  return (
    <div className="dashboard">
      Welcome To New Dashboard
      <div className="row color_differnt">
        {tiles.slice(0,0).map((item, index) => {
          const IconComponent = iconMap[item.icon] || MdSettings; 
          return (
            <div className="col-md-3 mb-3" key={index}>
              <a href={item.href} className='text-decoration-none'>
                <div className="card">
                   <div class="card-header bg-white padding_custum">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <p class="text-sm mb-0 text-capitalize">{item.label}</p>
                      <h4 class="mb-0">{item.points}</h4>
                    </div>
                    <div class="icon_design">
                      <IconComponent className="" />
                    </div>
                  </div>
                </div>
                </div>
              </a>
            </div>
          );
        })}

      </div>
    </div>
  );
};

export default HomeDashboard;
