  import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Layout from "./Layout/Layout";
import Login from "./User/Login";
import Dashboard from "./Pages/Dashboard";
import AccountReport from "./Pages/AccountReport";
import CreateUser from "./Pages/User/CreateUser";
import UsersList from "./Pages/User/UsersList";
import ActiveUsersList from "./Pages/User/ActiveUsersList";
import LoginUsersList from "./Pages/User/LoginUsersList";
import InactiveUsersList from "./Pages/User/InactiveUsersList";
import Banner from "./Pages/AppSettings/Banner";
import WebSettings from "./Pages/AppSettings/WebSetting";
import CreateProject from "./Pages/createProject/CreateProject";
import AllProject from "./Pages/createProject/AllProjectList";
import ActiveProject from "./Pages/createProject/ActiveProjectList";
import InactiveProject from "./Pages/createProject/InactiveProjectList";
import CreateBlocks from "./Pages/createProject/CreateBlock";
import BlockLists from "./Pages/createProject/BlockList";
import ActiveBlockLists from "./Pages/createProject/ActiveBlockList";
import InActiveBlockLists from "./Pages/createProject/InActiveBlockList"
import CreatePlot from "./Pages/plotManagment/CreatePlot"
import AllPlotLists from "./Pages/plotManagment/AllPlotList"
import ActivePlotLists from "./Pages/plotManagment/ActivePlotList"
import InActivePlotLists from "./Pages/plotManagment/InActivePlotList"
import CreateAssociates from "./Pages/createAssociate/CreateAssociate";
import AllAssociateLists from "./Pages/createAssociate/AllAssociateList";
import ActiveAssociateLists from "./Pages/createAssociate/ActiveAssociateList";
import InactiveAssociateLists from "./Pages/createAssociate/InActiveAssociateList";
import CreateChannels from "./Pages/channelCreate/CreateChannel";
import AllChannelLists from "./Pages/channelCreate/ChannelList";
import ActiveChannelLists from "./Pages/channelCreate/ActiveChannelList";
import InactiveChannelLists from "./Pages/channelCreate/InActiveChannelList";
import CreateSubadmin from "./Pages/subAdminCreate/CreateSubadmin";
import AllSubAdminList from "./Pages/subAdminCreate/AllSubadminList";
import SubadminPermission from "./Pages/subAdminCreate/SubadminPermission";
import BannerLists from "./Pages/AppSettings/BannerList";
import Gallerys from "./Pages/AppSettings/Gallery";
import GalleryLists from "./Pages/AppSettings/GalleryList";
import Blogs from "./Pages/AppSettings/Blog";
import BlogLists from "./Pages/AppSettings/BlogList";
import Testimonials from "./Pages/AppSettings/Testimonial";
import TestimonialsList from "./Pages/AppSettings/TestimonialList";
import Aminitiess from "./Pages/createProject/Aminities";
import TeamsLists from "./Pages/createAssociate/TeamsList";
import CreateLeads from "./Pages/leadManagment/CreateLead"
import CreateLeadByUploadingCSV from "./Pages/leadManagment/CreateLeadByUploadingCSV"
import CreateCallingLead from "./Pages/leadManagment/CreateCallingLead"
import LeadsList from "./Pages/leadManagment/AllLeadList"
import CreateLoans from "./Pages/loanManagment/Createloan"
import AllLoanListss from "./Pages/loanManagment/AllLoanList"
import LeadRemarkPage from "./Pages/leadManagment/LeadRemarkPage"
import LoanRemarkPage from "./Pages/loanManagment/LoanRemarkPage"
import CreateCategory from "./Pages/expensesManagment/CreateCategory"
import CategoryLists from "./Pages/expensesManagment/CategoryList"
import AddBankAccount from "./Pages/expensesManagment/CreateBankAccount"
import BankAccountLists from "./Pages/expensesManagment/BankAccountList"
import AddExpensess from "./Pages/expensesManagment/AddExpenses"
import ExpensesLists from "./Pages/expensesManagment/ExpensesList"
import ExpensesDateWises from "./Pages/expensesManagment/ExpensesDateWise"
import ExpensesByDate from "./Pages/expensesManagment/ExpensesByDate"
import VisitLists from "./Pages/visitManagment/VisitList"
import VisitDateWises from "./Pages/visitManagment/VisitDateWise"
import VisteByDates from "./Pages/visitManagment/VisteByDate"
import AccountLists from "./Pages/bankaccountManagment/AccountList"
import AccountStatusLists from "./Pages/bankaccountManagment/AccountStatusList"
import WithdrawalLists from "./Pages/withdrawalManagment/WithdrawlList"
import WithdrawalStatusSuccessLists from "./Pages/withdrawalManagment/WithdrawlStatusSuccessList"
import WithdrawalStatusRejectedLists from "./Pages/withdrawalManagment/WithdrawalStatusRejectedLists"
import AllNotificationLists from "./Pages/notification/AllNotificationList"
import AddAdvancePayments from "./Pages/advancePayment/AddAdvancePayment"
import AddDocuments from "./Pages/AppSettings/addDocument"
import DocumentLists from "./Pages/AppSettings/documentList"
import HomeLoanincomeLists from "./Pages/homeLoanIncomeList/RateList"
import PersonalLoanincomeLists from "./Pages/personalLoanIncomeList/PersonalRateList"
import ProductLoanincomeLists from "./Pages/productLoanIncomeList/ProductRateList"
import PendingBookingLists from "./Pages/bookingManagment/PendingBookingList"
import BookedPendingBookingLists from "./Pages/bookingManagment/BookedPendingBookingList"
import OngoingBookingLists from "./Pages/bookingManagment/OngoingBookingList"
import CompleteBookingLists from "./Pages/bookingManagment/CompleteBookingList"
import CancelBookingLists from "./Pages/bookingManagment/CancelBookingList"

import AssignPropertyLeadToSubadmin from "./Pages/leadManagment/AssignPropertyLeadToSubadmin"
import AssignPropertyLoanLeadToSubadmin from "./Pages/loanManagment/AssignPropertyLoanLeadToSubadmin"

import UploadPropertyLeadCSV from "./Pages/leadManagment/UploadPropertyLeadCSV"
import UploadPropertyLoanLeadCSV from "./Pages/loanManagment/UploadPropertyLoanLeadCSV"
import CallingRemarkHistory from "./Pages/leadManagment/CallingRemarkHistory"
import ConvertCallingLead from "./Pages/leadManagment/ConvertCallingLead"
import CallingLeadReport from "./Pages/leadManagment/CallingLeadReport.jsx"
import ALLPropertyIncomeLists from "./Pages/incomeManagment/ALLPropertyIncomeList.jsx";
import SelfGifts from "./Pages/SelfGifts/SelfGifts.jsx";
import SelfGiftsLists from "./Pages/SelfGifts/SelfGiftsLists.jsx";
import ParentCommissionPage from "./Pages/incomeManagment/ParentCommissionPage"
import AssignTeamSelfGifts from "./Pages/SelfGifts/SelfTeamGifts.jsx";
import SelfTeamsGiftsLists from "./Pages/SelfGifts/SelfTeamsGiftsLists.jsx";
import DownloadMy11LevelTeams from "./Pages/createAssociate/DownloadMy11LevelTeams.jsx";
import MyTeamTree from "./Pages/createAssociate/MyTeamTree.jsx";
import MyChainUpLine from "./Pages/createAssociate/MyChainUpLine.jsx";
import AdminTDSReport from "./Pages/expensesManagment/AdminTDSReport.jsx";
import GiftsOfferManagement from "./Pages/GiftsOfferManagement/AllOfferGifts.jsx";
import AddsOfferManagement from "./Pages/GiftsOfferManagement/AddOfferGifts.jsx";


import LifeTimeRewardsManagement from "./Pages/LifeTimeRewards/AllLifetimeRewardsLists.jsx";
import AddsLifeTimeRewards from "./Pages/LifeTimeRewards/AddsLifeTimeRewards.jsx";
import AllLifetimeRewardsWinnerLists from "./Pages/LifeTimeRewards/AllLifetimeRewardsWinnerLists.jsx";


// import ProprtyAwardsSelfWinnerHistories from "./Pages/ProprtyAwardsWinnerHistories/ProprtySelfAwardsWinner.jsx";
// import ProprtyAwardsTeamWinnerHistories from "./Pages/ProprtyAwardsWinnerHistories/ProprtyTeamAwardsWinner.jsx";

import RewardsMentorRoyalty from "./Pages/GiftsOfferManagement/RewardsMentorRoyalty.jsx";
import MentorRoyaltyDetails from "./Pages/GiftsOfferManagement/MentorRoyaltyDetails.jsx";


import VoicePresidentRewards from "./Pages/GiftsOfferManagement/VoicePresidentRewards.jsx";
import VoicePresidentRewardsDetails from "./Pages/GiftsOfferManagement/VoicePresidentRewardsDetails.jsx";

import SRVoicePresidentRewards from "./Pages/GiftsOfferManagement/SRVoicePresidentRewards.jsx";
import SRVoicePresidentRewardsDetails from "./Pages/GiftsOfferManagement/SRVoicePresidentRewardsDetails.jsx";


import LifeTimeRewardsWinnerListsDetails from "./Pages/GiftsOfferManagement/LifeTimeRewardsWinnerListsDetails.jsx";


import MonthlyORSpecialSelfOffers from "./Pages/GiftsOfferManagement/MonthlyORSpecialSelfOffers.jsx";
import MonthlyORSpecialCustomerOffers from "./Pages/GiftsOfferManagement/MonthlyORSpecialCustomerOffers.jsx";

import MonthlyORSpecialTeamOffers from "./Pages/GiftsOfferManagement/MonthlyORSpecialTeamOffers.jsx";
import MyteamchildChainDownLineDetails from "./Pages/createAssociate/MyteamchildChainDownLineDetails.jsx";

import PresidentFundRewards from "./Pages/GiftsOfferManagement/PresidentFundRewards.jsx";
import PresidentFundRewardsRewardsDetails from "./Pages/GiftsOfferManagement/PresidentFundRewardsRewardsDetails.jsx";



import PresidentlevelFundRewards from "./Pages/GiftsOfferManagement/PresidentlevelFundRewards.jsx";
import PresidentlevelFundRewardsDetails from "./Pages/GiftsOfferManagement/PresidentlevelFundRewardsDetails.jsx";

import CreateAssociateByUploadingCSV from "./Pages/createAssociate/CreateAssociateByUploadingCSV.jsx";
import CreateProjectByUploadingCSV from "./Pages/createProject/CreateProjectByUploadingCSV.jsx";
import CreateBlocksByUploadingCSV from "./Pages/createProject/CreateBlocksByUploadingCSV.jsx";
import ALLPropertyUnitisnotsoldLists from "./Pages/incomeManagment/ALLPropertyUnitisnotsoldeList.jsx";
import ParentUnitisnotsoldePage from "./Pages/incomeManagment/ParentUnitisnotsoldePage"

import CashCredit from "./Pages/creditReport/CashCreditList";
import OnlineCredit from "./Pages/creditReport/OnlineCreditList";
import AllCredit from "./Pages/creditReport/AllCreditList";

import CashDebit from "./Pages/debitReport/CashDebitList";
import OnlineDebit from "./Pages/debitReport/OnlineDebitList";
import AllDebit from "./Pages/debitReport/AllDebitList";

import CashBalance from "./Pages/balanceReport/CashBalanceList";
import OnlineBalance from "./Pages/balanceReport/OnlineBalanceList";
import AllBalance from "./Pages/balanceReport/AllBalanceList";

import WalletBalance from "./Pages/walletReport/WalletBalanceList";
import WithdrawalWalletBalance from "./Pages/walletReport/WithdrawalBalanceList";
import SuccessWalletBalance from "./Pages/walletReport/SuccessBalanceList";
import TdsBalance from "./Pages/walletReport/TdsBalanceList";
import MonthlyRewardBalance from "./Pages/walletReport/MonthlyRewardBalance";
import LifetimeRewardBalance from "./Pages/walletReport/LifetimeRewardBalance";
import RoyaltyBalance from "./Pages/walletReport/RoyaltyBalance";
import AdminWalletLedger from "./Pages/walletReport/AdminWalletLedger";
import PlotLedger from "./Pages/walletReport/PlotLedger.jsx";
import UnitSQYDAdded from "./Pages/walletReport/Unit_sqyd_added.jsx";
import UnitSQYDLedger from "./Pages/walletReport/UnitSQYDLedger.jsx";
import ProjectWiseLedger from "./Pages/walletReport/ProjectWiseLedger.jsx";

import TdsCRList from "./Pages/tdsReport/TdsCRList.jsx";
import TdsDRList from "./Pages/tdsReport/TdsDRList.jsx";
import TdsSettleCRList from "./Pages/tdsReport/TdsSellteCRList.jsx";
import TdsSellteDRList from "./Pages/tdsReport/TdsSellteDRList.jsx";
import AssociatesBirthdayLists from "./Pages/createAssociate/AssociatesBirthdayLists.jsx";
import AssociatesAnniversaryLists from "./Pages/createAssociate/AssociatesAnniversaryLists.jsx";
import AssociatesDesignationLists from "./Pages/createAssociate/AssociatesDesignationLists.jsx";
import CreateProjectCategoryList from "./Pages/CreateProjectCategory/CreateProjectCategoryList.jsx";
import CreateProjectCategory from "./Pages/CreateProjectCategory/CreateProjectCategory.jsx";




const App = () => {
  const [userTypeState, setUserTypeState] = useState(() => {
    const storedType = localStorage.getItem("userType");
    const storedToken = localStorage.getItem("token");
    return storedType ? { token: storedToken, type: storedType } : null;
  });

  const [isLoadingInitialAuth, setIsLoadingInitialAuth] = useState(true);
  const [permissions, setPermissions] = useState([]);

  const permissionRouteMap = {
    "dashboard": "/dashboard",
    "my-team-tree-admin": "/my-team-tree-admin",
    "myteam-parent-chain-upline": "/myteam-parent-chain-upline",
    "download-my-11level-team-data-in-excel": "/download-my-11level-team-data-in-excel",
    "account-report": "/account-report",
    "create-subadmin": "/create-subadmin",
    "all-subadmin": "/allsubadmin",
    "subadmin-permission": "/subadmin-permission",
    "all-project": "/all-project",
    "active-project": "/active-project",
    "inactive-project": "/inactive-project",
    "all-block-list": "/all-block-list",
    "active-block-list": "/active-block-list",
    "inactive-block-list": "/inactive-block-list",
    "all-Plot": "/all-plot",
    "active-plot-list": "/active-plot-list",
    "inactive-plot-list": "/inactive-plot-list",
    "all-associate-list": "/all-associate-list",
    "all-associate-active-list": "/all-associate-active-list",
    "all-associate-inactive-list": "/all-associate-inactive-list",
    "all-channel-list": "/all-channel-list",
    "all-channel-active-list": "/all-channel-active-list",
    "all-channel-inactive-list": "/all-channel-inactive-list",
    "banner-list": "/banner-list",
    "gallery-list": "/gallery-list",
    "web-settings": "/web-settings",
    "blogs": "/blogs",
    "blog-list": "/blog-list",
    "testimonial": "/testimonial",
    "testimonial-list": "/testimonial-list",
    "aminities-list": "/aminities-list",
    "document-upload": "/document-upload",
    "team-list": "/team-list",
    "assign-property-lead-to-subadmin": "/assign-property-lead-to-subadmin",
    "assign-property-loan-lead-to-subadmin": "/assign-property-loan-lead-to-subadmin",
    "upload-property-lead-csv": "/upload-property-lead-csv",
    "upload-property-loan-lead-csv": "/upload-property-loan-lead-csv",
    "lead-list": "/lead-list",
    "loan-list": "/loan-list",
    "calling-remark-history": "/calling-remark-history",
    "calling-lead-report": "/calling-lead-report",
    "create-project": "/create-project",
    "create-block": "/create-block",
    "create-plot": "/create-plot",
    "category-list": "/category-list",
    "bank-account-list": "/bank-account-list",
    "property-income-list": "/property-income-list",
    "property-income-unit-is-not-sold-list": "/property-income-unit-is-not-sold-list",
    "expence-add": "/expence-add",
    "expenses-list": "/expenses-list",
    "expenses-date-wise": "/expenses-date-wise",
    "tds-report": "/tds-report",
    "visit-list": "/visit-list",
    "visit-date-wise": "/visit-date-wise",
    "account-list": "/account-list",
    "account-list-status": "/account-list-status",
    "withdrawal-list": "/withdrawal-list",
    "withdrawal-success-list-status": "/withdrawal-success-list-status",
    "withdrawal-rejected-list-status": "/withdrawal-rejected-list-status",
    "income-list": "/income-list",
    "personal-income-list": "/personal-income-list",
    "product-income-list": "/product-income-list",
    "pending-booking": "/pending-booking",
    "booked-pending-booking": "/booked-pending-booking",
    "ongoing-booking": "/ongoing-booking",
    "cancel-booking": "/cancel-booking",
    "self-gifts": "/self-gifts",
    "gift-self-associate-list": "/gift-self-associate-list",
    "assign-team-self-gifts": "/assign-team-self-gifts",
    "team-self-gifts-lists": "/team-self-gifts-lists",
    "all-offer-gifts": "/all-offer-gifts",
    "monthly-or-special-self-offers-lists": "/monthly-or-special-self-offers-lists",
    "monthly-or-special-customers-offers-lists": "/monthly-or-special-customers-offers-lists",
    "monthly-or-special-team-offers-lists": "/monthly-or-special-team-offers-lists",
    "mentor-royalty-rewards-lists": "/mentor-royalty-rewards-lists",
    "voice-president-rewards-lists": "/voice-president-rewards-lists",
    "senior-voice-president-rewards-lists": "/senior-voice-president-rewards-lists",
    "president-fund-rewards-lists": "/president-fund-rewards-lists",
    "president-level-fund-rewards-lists": "/president-level-fund-rewards-lists",
    "upload-lifetime-rewards": "/upload-lifetime-rewards",
    "all-lifetime-rewards-lists": "/all-lifetime-rewards-lists",
    "life-time-rewards-winner-lists": "/life-time-rewards-winner-lists",
    "admin-wallet-report": "/admin-wallet-report",

  };



  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoadingInitialAuth(false);
        return;
      }
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/admin-profile`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (res.status === 401) {
          localStorage.setItem("isLoggedIn", "false");
          localStorage.removeItem("token");
          setIsLoadingInitialAuth(false);
          return;
        }
        if (res.ok) {
          const data = await res.json();
          if (data.message === "Invalid Token") {
            localStorage.setItem("isLoggedIn", "false");
            localStorage.removeItem("token");
            setIsLoadingInitialAuth(false);
          } else {
            const roles = data.data.type;
            const userId = data.data.id;
            setUserTypeState({ token, type: roles });
            localStorage.setItem("userType", roles);
            fetchPermissions(token, roles, userId);
          }
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setIsLoadingInitialAuth(false);
      }
    };
    fetchUserProfile();
  }, []);

  const fetchPermissions = async (token, roles, userId) => {
    try {
      if (roles === "admin") {
        setPermissions(["*"]);
      } else {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/sub-admin-permission-list`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              sub_admin_id: userId,
            }),
          }
        );

        if (res.ok) {
          const result = await res.json();
          const permissionData = JSON.parse(result.data.data);
          const allowedRoutes = [];

          if (permissionData.some(p => p.id === 'dashboard' && p.checked)) {
            allowedRoutes.push("/dashboard");
          }

          permissionData.forEach((permission) => {
            if (permission.checked && permissionRouteMap[permission.id]) {
              allowedRoutes.push(permissionRouteMap[permission.id]);
            }

            if (permission.children && Array.isArray(permission.children)) {
              permission.children.forEach((child) => {
                if (child.checked && permissionRouteMap[child.id]) {
                  allowedRoutes.push(permissionRouteMap[child.id]);
                }
              });
            }
          });
          // console.warn("allowedRoutes",allowedRoutes);
          setPermissions(allowedRoutes.filter(route => route));
        } else {
          console.error("Permission API failed with status:", res.status);
          setPermissions(["/dashboard"]);
        }
      }
    } catch (err) {
      console.error("Permission fetch error:", err);
      setPermissions(["/dashboard"]);
    } finally {
      setIsLoadingInitialAuth(false);
    }
  };



  if (isLoadingInitialAuth) {
    return (
      <div className="loading-screen">
        <div className="loaderimage">
          <img
            src={`${process.env.PUBLIC_URL}/assets/images/logo.png`}
            alt="logo"
            className="logo-lg"
          />
        </div>
      </div>
    );
  }


  const PrivateRoute = ({ children, allowedRoutes }) => {
    const isLoggedIn = localStorage.getItem("token") !== null;
    const location = useLocation();

    if (!isLoggedIn) {
      return <Navigate to="/login" replace />;
    }

    if (userTypeState && userTypeState.type === "admin") {
      return children;
    }

    const isAllowed = allowedRoutes.some(route => {
      if (route.includes('/subadmin-permission')) {
        return location.pathname.startsWith('/subadmin-permission');
      }
      return location.pathname === route;
    });

    if (isAllowed) {
      return children;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  };


  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions} > <Dashboard /> </Layout></PrivateRoute>} />
        <Route path="/account-report" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions} > <AccountReport /> </Layout></PrivateRoute>} />
        <Route path="/create-user" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <CreateUser /></Layout></PrivateRoute>} />
        <Route path="/all-users" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <UsersList /> </Layout></PrivateRoute>} />
        <Route path="/active-users" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <ActiveUsersList /> </Layout></PrivateRoute>} />
        <Route path="/user/login-user-list" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <LoginUsersList /> </Layout></PrivateRoute>} />
        <Route path="/inactive-users" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <InactiveUsersList /></Layout></PrivateRoute>} />

        <Route path="/create-project" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <CreateProject /> </Layout></PrivateRoute>} />
        <Route path="/all-project" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <AllProject /> </Layout></PrivateRoute>} />
        <Route path="/active-project" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <ActiveProject /> </Layout></PrivateRoute>} />
        <Route path="/inactive-project" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <InactiveProject /> </Layout></PrivateRoute>} />

        <Route path="/create-block" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <CreateBlocks /> </Layout></PrivateRoute>} />
        <Route path="/all-block-list" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <BlockLists /> </Layout></PrivateRoute>} />
        <Route path="/active-block-list" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <ActiveBlockLists /> </Layout></PrivateRoute>} />
        <Route path="/inactive-block-list" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <InActiveBlockLists /> </Layout></PrivateRoute>} />

        <Route path="/create-plot" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <CreatePlot /> </Layout></PrivateRoute>} />
        <Route path="/all-plot" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <AllPlotLists /> </Layout></PrivateRoute>} />
        <Route path="/active-plot-list" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <ActivePlotLists /> </Layout></PrivateRoute>} />
        <Route path="/inactive-plot-list" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <InActivePlotLists /> </Layout></PrivateRoute>} />

        <Route path="/create-associate" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <CreateAssociates /> </Layout></PrivateRoute>} />
        <Route path="/all-associate-list" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <AllAssociateLists /> </Layout></PrivateRoute>} />
        <Route path="/all-associate-active-list" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <ActiveAssociateLists /> </Layout></PrivateRoute>} />
        <Route path="/all-associate-inactive-list" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <InactiveAssociateLists /> </Layout></PrivateRoute>} />

        <Route path="/create-channel" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <CreateChannels /> </Layout></PrivateRoute>} />
        <Route path="/all-channel-list" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <AllChannelLists /> </Layout></PrivateRoute>} />
        <Route path="/all-channel-active-list" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <ActiveChannelLists /> </Layout></PrivateRoute>} />
        <Route path="/all-channel-inactive-list" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <InactiveChannelLists /></Layout></PrivateRoute>} />

        <Route path="/create-subadmin" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <CreateSubadmin /></Layout></PrivateRoute>} />
        <Route path="/allsubadmin" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}><AllSubAdminList /> </Layout></PrivateRoute>} />
        {/* SubadminPermission route - still wrapped in Layout for consistent UI */}
        <Route path="/subadmin-permission/:sub_admin_id" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}><SubadminPermission /></Layout></PrivateRoute>} />

        <Route path="/banner" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <Banner /> </Layout></PrivateRoute>} />
        <Route path="/banner-list" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <BannerLists /> </Layout></PrivateRoute>} />
        <Route path="/gallery" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <Gallerys /> </Layout></PrivateRoute>} />
        <Route path="/gallery-list" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <GalleryLists /> </Layout></PrivateRoute>} />
        <Route path="/web-settings" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <WebSettings /> </Layout></PrivateRoute>} />
        <Route path="/blogs" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <Blogs /> </Layout></PrivateRoute>} />
        <Route path="/blog-list" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <BlogLists /> </Layout></PrivateRoute>} />
        <Route path="/testimonial" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <Testimonials /> </Layout></PrivateRoute>} />
        <Route path="/testimonial-list" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <TestimonialsList /> </Layout></PrivateRoute>} />
        <Route path="/aminities-list" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <Aminitiess /> </Layout></PrivateRoute>} />

        <Route path="/team-list/:mobile" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <TeamsLists /> </Layout></PrivateRoute>} />
        <Route path="/create-lead" element={<Layout userType={userTypeState} permissions={permissions}> <CreateLeads /> </Layout>} />
        <Route path="/calling-create-lead" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <CreateCallingLead /> </Layout></PrivateRoute>} />
        <Route path="/lead-list" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <LeadsList /> </Layout></PrivateRoute>} />
        <Route path="/create-loan" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <CreateLoans /> </Layout></PrivateRoute>} />
        <Route path="/loan-list" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <AllLoanListss /> </Layout></PrivateRoute>} />
        <Route path="/lead-remarks/:leadId/:orderId/:userId" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <LeadRemarkPage /> </Layout></PrivateRoute>} />
        <Route path="/loan-remarks/:leadId/:orderId/:userId" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <LoanRemarkPage /> </Layout></PrivateRoute>} />
        <Route path="/add-category" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <CreateCategory /> </Layout></PrivateRoute>} />
        <Route path="/category-list" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <CategoryLists /> </Layout></PrivateRoute>} />
        <Route path="/add-bankaccount" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <AddBankAccount /> </Layout></PrivateRoute>} />
        <Route path="/bank-account-list" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <BankAccountLists /> </Layout></PrivateRoute>} />
        <Route path="/expence-add" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <AddExpensess /> </Layout></PrivateRoute>} />
        <Route path="/expenses-list" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <ExpensesLists /> </Layout></PrivateRoute>} />
        <Route path="/expenses-date-wise" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <ExpensesDateWises /> </Layout></PrivateRoute>} />
        <Route path="/expenses-by-date/:date" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <ExpensesByDate /> </Layout></PrivateRoute>} />
        <Route path="/visit-list" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <VisitLists /> </Layout></PrivateRoute>} />
        <Route path="/account-list" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <AccountLists /> </Layout></PrivateRoute>} />
        <Route path="/account-list-status" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <AccountStatusLists /> </Layout></PrivateRoute>} />
        <Route path="/withdrawal-list" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <WithdrawalLists /> </Layout></PrivateRoute>} />


        <Route path="/withdrawal-success-list-status" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <WithdrawalStatusSuccessLists /> </Layout></PrivateRoute>} />


        <Route path="/withdrawal-rejected-list-status" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <WithdrawalStatusRejectedLists /> </Layout></PrivateRoute>} />





        <Route path="/visit-date-wise" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <VisitDateWises /> </Layout></PrivateRoute>} />
        <Route path="/visit-by-date/:date" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <VisteByDates /> </Layout></PrivateRoute>} />
        <Route path="/notification-list" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <AllNotificationLists /> </Layout></PrivateRoute>} />
        <Route path="/add-advance-payment" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <AddAdvancePayments /> </Layout></PrivateRoute>} />
        <Route path="/add-document" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <AddDocuments /> </Layout></PrivateRoute>} />
        <Route path="/document-upload" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <DocumentLists /> </Layout></PrivateRoute>} />
        <Route path="/income-list" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <HomeLoanincomeLists /> </Layout></PrivateRoute>} />
        <Route path="/personal-income-list" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <PersonalLoanincomeLists /> </Layout></PrivateRoute>} />
        <Route path="/product-income-list" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <ProductLoanincomeLists /> </Layout></PrivateRoute>} />
        <Route path="/pending-booking" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <PendingBookingLists /> </Layout></PrivateRoute>} />
        <Route path="/booked-pending-booking" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <BookedPendingBookingLists /> </Layout></PrivateRoute>} />
        <Route path="/ongoing-booking" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <OngoingBookingLists /> </Layout></PrivateRoute>} />
        <Route path="/complete-booking" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <CompleteBookingLists /> </Layout></PrivateRoute>} />

        <Route path="/cancel-booking" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <CancelBookingLists /> </Layout></PrivateRoute>} />


        <Route path="/assign-property-lead-to-subadmin" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <AssignPropertyLeadToSubadmin /> </Layout></PrivateRoute>} />

        <Route path="/assign-property-loan-lead-to-subadmin" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <AssignPropertyLoanLeadToSubadmin /> </Layout></PrivateRoute>} />


        <Route path="/upload-property-lead-csv" element={<Layout userType={userTypeState} permissions={permissions}> <UploadPropertyLeadCSV /> </Layout>} />

        {/* Credit Report List */}
        <Route path="/cash-credit-list" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <CashCredit /> </Layout></PrivateRoute>} />
        <Route path="/online-credit-list" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <OnlineCredit /> </Layout></PrivateRoute>} />
        <Route path="/total-credit-list" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <AllCredit /> </Layout></PrivateRoute>} />

        {/* Debit Report List */}
        <Route path="/cash-debit-list" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <CashDebit /> </Layout></PrivateRoute>} />
        <Route path="/online-debit-list" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <OnlineDebit /> </Layout></PrivateRoute>} />
        <Route path="/total-debit-list" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <AllDebit /> </Layout></PrivateRoute>} />

        {/* Balance Report List */}
        <Route path="/cash-balance-list" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <CashBalance /> </Layout></PrivateRoute>} />
        <Route path="/online-balance-list" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <OnlineBalance /> </Layout></PrivateRoute>} />
        <Route path="/total-balance-list" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <AllBalance /> </Layout></PrivateRoute>} />

        {/* Wallet Report List */}
        <Route path="/wallet-balance" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <WalletBalance /> </Layout></PrivateRoute>} />
        <Route path="/withdrawal-wallet-balance" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <WithdrawalWalletBalance /> </Layout></PrivateRoute>} />
        <Route path="/success-wallet-balance" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <SuccessWalletBalance /> </Layout></PrivateRoute>} />
        <Route path="/tds-balance" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <TdsBalance /> </Layout></PrivateRoute>} />
        <Route path="/monthly-reward-balance" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <MonthlyRewardBalance /> </Layout></PrivateRoute>} />
        <Route path="/lifetime-reward-balance" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <LifetimeRewardBalance /> </Layout></PrivateRoute>} />
        <Route path="/royalty-balance" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <RoyaltyBalance /> </Layout></PrivateRoute>} />


        {/* <Route path="/upload-property-loan-lead-csv" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <UploadPropertyLoanLeadCSV/> </Layout></PrivateRoute>} /> */}

        <Route
          path="/calling-remark-history/:id"
          element={
            <Layout userType={userTypeState} permissions={permissions}>
              <CallingRemarkHistory />
            </Layout>
          }
        />

        <Route
          path="/convert-calling-lead/:id"
          element={
            <Layout userType={userTypeState} permissions={permissions}>
              <ConvertCallingLead />
            </Layout>
          }
        />

        <Route
          path="/calling-lead-report"
          element={
            <Layout userType={userTypeState} permissions={permissions}>
              <CallingLeadReport />
            </Layout>
          }
        />

        <Route path="/property-income-list" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <ALLPropertyIncomeLists /> </Layout></PrivateRoute>} />


        <Route path="/self-gifts" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <SelfGifts /> </Layout></PrivateRoute>} />



        <Route path="/gift-self-associate-list" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <SelfGiftsLists /> </Layout></PrivateRoute>} />


        <Route path="/parent-commission/:id" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <ParentCommissionPage /> </Layout></PrivateRoute>} />


        <Route path="/assign-team-self-gifts" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <AssignTeamSelfGifts /> </Layout></PrivateRoute>} />



        <Route path="/team-self-gifts-lists" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <SelfTeamsGiftsLists /> </Layout></PrivateRoute>} />

        <Route path="/download-my-11level-team-data-in-excel" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <DownloadMy11LevelTeams /> </Layout></PrivateRoute>} />


        <Route path="/my-team-tree-admin" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <MyTeamTree /> </Layout></PrivateRoute>} />


        <Route path="/myteam-parent-chain-upline" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <MyChainUpLine /> </Layout></PrivateRoute>} />

        <Route path="/tds-report" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <AdminTDSReport /> </Layout></PrivateRoute>} />

        <Route path="/all-offer-gifts" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <GiftsOfferManagement /> </Layout></PrivateRoute>} />

        <Route path="/add-new-offer-gifts" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <AddsOfferManagement /> </Layout></PrivateRoute>} />

        {/* <Route path="/property-awards-self-winners-histories" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <ProprtyAwardsSelfWinnerHistories /> </Layout></PrivateRoute>} /> 

<Route path="/property-awards-team-winners-histories" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <ProprtyAwardsTeamWinnerHistories /> </Layout></PrivateRoute>} />  */}


        <Route path="/mentor-royalty-rewards-lists" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <RewardsMentorRoyalty /> </Layout></PrivateRoute>} />

        <Route path="/mentor-royalty-rewards-details/:user_id" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <MentorRoyaltyDetails /> </Layout></PrivateRoute>} />


        <Route path="/voice-president-rewards-lists" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <VoicePresidentRewards /> </Layout></PrivateRoute>} />

        <Route path="/voice-president-rewards-details/:user_id" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <VoicePresidentRewardsDetails /> </Layout></PrivateRoute>} />




        <Route path="/senior-voice-president-rewards-lists" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <SRVoicePresidentRewards /> </Layout></PrivateRoute>} />

        <Route path="/senior-voice-president-rewards-details/:user_id" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <SRVoicePresidentRewardsDetails /> </Layout></PrivateRoute>} />


        <Route path="/life-time-rewards-winner-lists-details/:user_id" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <LifeTimeRewardsWinnerListsDetails /> </Layout></PrivateRoute>} />




        <Route path="/monthly-or-special-self-offers-lists" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <MonthlyORSpecialSelfOffers /> </Layout></PrivateRoute>} />


        <Route path="/monthly-or-special-customers-offers-lists" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <MonthlyORSpecialCustomerOffers /> </Layout></PrivateRoute>} />





        <Route path="/monthly-or-special-team-offers-lists" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <MonthlyORSpecialTeamOffers /> </Layout></PrivateRoute>} />

        <Route path="/myteam-child-chain-down-line-details" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <MyteamchildChainDownLineDetails /> </Layout></PrivateRoute>} />




        <Route path="/president-fund-rewards-lists" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <PresidentFundRewards /> </Layout></PrivateRoute>} />

        <Route path="/president-fund-rewards-lists-details/:user_id" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <PresidentFundRewardsRewardsDetails /> </Layout></PrivateRoute>} />


        <Route path="/president-level-fund-rewards-lists" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <PresidentlevelFundRewards /> </Layout></PrivateRoute>} />

        <Route path="/president-level-fund-rewards-lists-details/:user_id" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <PresidentlevelFundRewardsDetails /> </Layout></PrivateRoute>} />

        <Route path="/create-associate-by-uploading-csv" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <CreateAssociateByUploadingCSV /> </Layout></PrivateRoute>} />

        <Route path="/create-project-by-uploading-csv" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <CreateProjectByUploadingCSV /> </Layout></PrivateRoute>} />
        <Route path="/create-lead-by-uploading-csv" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <CreateLeadByUploadingCSV /> </Layout></PrivateRoute>} />


        <Route path="/create-bloks-by-uploading-csv" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <CreateBlocksByUploadingCSV /> </Layout></PrivateRoute>} />

        <Route path="/parent-unitis-notsold/:id" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <ParentUnitisnotsoldePage /> </Layout></PrivateRoute>} />
        <Route path="/property-income-unit-is-not-sold-list" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <ALLPropertyUnitisnotsoldLists /> </Layout></PrivateRoute>} />


        <Route path="/all-lifetime-rewards-lists" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <LifeTimeRewardsManagement /> </Layout></PrivateRoute>} />

        <Route path="/upload-lifetime-rewards" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <AddsLifeTimeRewards /> </Layout></PrivateRoute>} />


        <Route path="/life-time-rewards-winner-lists" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <AllLifetimeRewardsWinnerLists /> </Layout></PrivateRoute>} />

        <Route path="/admin-wallet-report" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <AdminWalletLedger /> </Layout></PrivateRoute>} />

        <Route path="/admin-plot-ledger" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <PlotLedger /> </Layout></PrivateRoute>} />

        <Route path="/admin-project-wise-ledger" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <ProjectWiseLedger/> </Layout></PrivateRoute>} />
        


         <Route path="/unit-sqyd-added" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <UnitSQYDAdded /> </Layout></PrivateRoute>} />


          <Route path="/unit-sqyd-ledger" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <UnitSQYDLedger /> </Layout></PrivateRoute>} />



        <Route path="/tds-cr-report" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <TdsCRList /> </Layout></PrivateRoute>} />
        <Route path="/tds-dr-report" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <TdsDRList /> </Layout></PrivateRoute>} />
        <Route path="/cr-settle-reports" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <TdsSettleCRList /> </Layout></PrivateRoute>} />
        <Route path="/dr-settle-reports" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <TdsSellteDRList /> </Layout></PrivateRoute>} />


         <Route path="/associates-birthday-lists" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <AssociatesBirthdayLists /> </Layout></PrivateRoute>} />



          <Route path="/associates-anniversary-lists" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <AssociatesAnniversaryLists /> </Layout></PrivateRoute>} />


           <Route path="/associates-designation-lists" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <AssociatesDesignationLists /> </Layout></PrivateRoute>} />

             <Route path="/created-project-category-list" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <CreateProjectCategoryList /> </Layout></PrivateRoute>} />

                <Route path="/create-project-category" element={<PrivateRoute allowedRoutes={permissions}><Layout userType={userTypeState} permissions={permissions}> <CreateProjectCategory /> </Layout></PrivateRoute>} />


           
           


      </Routes>
    </Router>
  );
};

export default App;