import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./Layout/Layout";
import Login from "./User/Login";
import Dashboard from "./Pages/Dashboard";
import AllProject from "./Pages/ProjectLists/AllProjectList";
import CreateChannels from "./Pages/channelCreate/CreateChannel";
import AllChannelLists from "./Pages/channelCreate/ChannelList";
import Listaccount from './Pages/Addaccount/Listaccount'
import Withdrawalrequest from './Pages/Addaccount/Withdrawalrequest'
import WithdrawalHistory from './Pages/Addaccount/WithdrawalHistory'
import Createaccount from './Pages/Addaccount/Createaccount'
import LeadManagement from "./Pages/LeadManagement/PropertyLeadLists";
import CreatePropertyLead from "./Pages/LeadManagement/CreatePropertyLead";
import PropertyLeadDetails from "./Pages/LeadManagement/PropertyLeadDetails";
import PropertyLeadRemarksLisst from "./Pages/LeadManagement/PropertyLeadRemarksLisst";
import Idcarddesign from "./Pages/Idcarddesign/Idcard";

import LoanLists from "./Pages/LeadManagement/LoanLists";
import CreateLoan from "./Pages/LeadManagement/CreateLoan";
import LoandDetails from "./Pages/LeadManagement/LoandDetails";
import LoanRemarksLisst from "./Pages/LeadManagement/LoanRemarksLisst";

import VisitingListings from "./Pages/VisitingManagement/VisitingListings";
import VisitingDetails from "./Pages/VisitingManagement/VisitingDetails";
import NotificationsLists from "./Pages/Notifications/NotificationsLists";
import RRRulesBook from "./Pages/RRRulesBook/RRRulesBook";
import PlanPDF from "./Pages/RRRulesBook/PlanPDF";

import Myprofile from "./Pages/User/Profile";
import ChangePassword from "./Pages/User/ChangePassword";
import CompeleKYC from "./Pages/User/CompeleKYC";
import BlockListPage from "./Pages/Blocks/BlockListPage";
import PlotListPage from "./Pages/Plots/PlotListPage";
import MyAssociates from "./Pages/MyAssociates/MyAssociates";
import Levelwiselead from "./Pages/MyAssociates/Levelwiselead";
import Levelwise from "./Pages/MyAssociates/Levelwise";
import RefferAndEarn from "./Pages/RefferAndEarn/RefferAndEarn";
import Myteam from "./Pages/Myteam/Myteam";
import ALLPropertyIncomeLists from "./Pages/incomeManagment/ALLPropertyIncomeList.jsx";
import ChildCommissionPage from "./Pages/incomeManagment/ChildCommissionPage"
import SelfGiftsLists from "./Pages/SelfGifts/SelfGiftsLists.jsx";
import ToatalSales from "./Pages/SelfGifts/ToatalSales.jsx";
import SelfSales from "./Pages/SelfGifts/SelfSales.jsx";
import TeamSales from "./Pages/SelfGifts/TeamSales.jsx";
import SalesEarning from "./Pages/SelfGifts/SalesEarning.jsx";
import SelfSalesEarning from "./Pages/SelfGifts/SelfSalesEarning.jsx";
import TeamSalesEarning from "./Pages/SelfGifts/TeamSalesEarning.jsx";
import AdvancepaymentHistory from "./Pages/AdvancepaymentHistory/AdvancepaymentHistory.jsx";
import WalletReport from "./Pages/WalletReport/WalletReport.jsx";
import TDSReport from "./Pages/WalletReport/TDSReport.jsx";
import ProprtyAwardsWinnerHistories from "./Pages/ProprtyAwardsWinnerHistories/ProprtyAwardsWinner.jsx";
import FirstLine from "./Pages/Lines/FirstLine";
import SecondLine from "./Pages/Lines/SecondLine";
import ThirdLine from "./Pages/Lines/ThirdLine";
import LinesDetails from './Pages/Lines/LinesDetails';
import Lines2Details from './Pages/Lines/Lines2Details';
import Lines3Details from './Pages/Lines/Lines3Details';
import TotalAchievedBuySqydDetails from './Pages/Lines/TotalAchievedBuySqydDetails';
import CreateTicketSupport from "./Pages/ticketSupport/CreateTicketSupport";
import AllCreatedTicketSupport from "./Pages/ticketSupport/AllCreatedTicketSupport";
import PlotLedger from "./Pages/WalletReport/PlotLedger.jsx";
import UnitSQYDAdded from "./Pages/WalletReport/Unit_sqyd_added.jsx";
import UnitSQYDLedger from "./Pages/WalletReport/UnitSQYDLedger.jsx";
import BimaRegistrationForm from "./Pages/BimaRegistrationForm/BimaRegistrationForm.jsx";

const App = () => {
  const [userType, setUserType] = useState(() => {
    return localStorage.getItem("userType") || null;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobile, setMobile] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUserProfile();
    }, 500);
    return () => clearTimeout(timer);
  }, []);
  const fetchUserProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.status === 401) {
        localStorage.setItem("isLoggedIn", "false");
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }
      if (res.ok) {
        const data = await res.json();
        if (data.message == "Invalid Token") {
          localStorage.setItem("isLoggedIn", "false");
          localStorage.removeItem("token");
          const isLoggedIn = localStorage.getItem("isLoggedIn");
          if (isLoggedIn === "true") {
          } else {
            window.location.href = "/login";
          }
        } else {
          const roles = data.data.user_type;
          const userId = data.data._id;
          const mobile = data.data.mobile;
          const designation = data.data.designation; // designation
          setUserType(roles);
          setMobile(mobile);
          localStorage.setItem("designation", designation);
        }
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setIsLoading(false);
    }
  };
  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loaderimage">
          <img
            src={`${process.env.PUBLIC_URL}logo.png`}
            alt="logo"
            className="logo-lg"
          />
        </div>
      </div>
    );
  }
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <Layout userType={userType}>
              <Dashboard userType={userType} />
            </Layout>
          }
        />

        <Route
          path="/notification-list"
          element={
            <Layout userType={userType}>
              <NotificationsLists userType={userType} />
            </Layout>
          }
        />

        <Route
          path="/bima-registration-form"
          element={
            <Layout userType={userType}>
              <BimaRegistrationForm userType={userType} />
            </Layout>
          }
        />


        <Route
          path="/my-profile"
          element={
            <Layout userType={userType}>
              <Myprofile />
            </Layout>
          }
        />
        <Route
          path="/account-list"
          element={
            <Layout userType={userType}>
              <Listaccount />
            </Layout>
          }
        />
        <Route
          path="/add-withdrawal-request"
          element={
            <Layout userType={userType}>
              <Withdrawalrequest />
            </Layout>
          }
        />

        <Route
          path="/withdrawal-history"
          element={
            <Layout userType={userType}>
              <WithdrawalHistory />
            </Layout>
          }
        />




        <Route
          path="/chnage-password"
          element={
            <Layout userType={userType}>
              <ChangePassword />
            </Layout>
          }
        />
        <Route
          path="/complete-kyc"
          element={
            <Layout userType={userType}>
              <CompeleKYC />
            </Layout>
          }
        />
        <Route
          path="/create-account"
          element={
            <Layout userType={userType}>
              <Createaccount />
            </Layout>
          }
        />

        <Route
          path="/all-project"
          element={
            <Layout userType={userType}>
              <AllProject />
            </Layout>
          }
        />

        <Route
          path="/id-card"
          element={
            <Layout userType={userType}>
              <Idcarddesign />
            </Layout>
          }
        />
        <Route
          path="/my-team"
          element={
            <Layout userType={userType}>
              <Myteam />
            </Layout>
          }
        />

        <Route
          path="/blocklists"
          element={
            <Layout userType={userType}>
              <BlockListPage />
            </Layout>
          }
        />

        <Route
          path="/plot-list"
          element={
            <Layout userType={userType}>
              <PlotListPage />
            </Layout>
          }
        />
        <Route
          path="/create-channel"
          element={
            <Layout userType={userType}>
              <CreateChannels />
            </Layout>
          }
        />

        <Route
          path="/all-channel-list"
          element={
            <Layout userType={userType}>
              <AllChannelLists />
            </Layout>
          }
        />

        <Route
          path="/my-associates"
          element={
            <Layout userType={userType}>
              <MyAssociates />
            </Layout>
          }
        />
        <Route
          path="/levelwise"
          element={
            <Layout userType={userType}>
              <Levelwise />
            </Layout>
          }
        />
        <Route
          path="/levelwiselead"
          element={
            <Layout userType={userType}>
              <Levelwiselead />
            </Layout>
          }
        />

        <Route
          path="/reffer-and-earn"
          element={
            <Layout userType={userType} mobile={mobile}>
              <RefferAndEarn />
            </Layout>
          }
        />

        <Route
          path="/property-lead-list"
          element={
            <Layout userType={userType}>
              <LeadManagement />
            </Layout>
          }
        />

        <Route
          path="/create-property-lead"
          element={
            <Layout userType={userType}>
              <CreatePropertyLead />
            </Layout>
          }
        />

        <Route
          path="/property-lead-details/:id"
          element={
            <Layout userType={userType}>
              <PropertyLeadDetails />
            </Layout>
          }
        />

        <Route
          path="/property-lead-remarks-lisst/:leadId/:orderId"
          element={
            <Layout userType={userType}>
              <PropertyLeadRemarksLisst />
            </Layout>
          }
        />


        <Route
          path="/loan-list"
          element={
            <Layout userType={userType}>
              <LoanLists />
            </Layout>
          }
        />

        <Route
          path="/create-loan"
          element={
            <Layout userType={userType}>
              <CreateLoan />
            </Layout>
          }
        />

        <Route
          path="/loan-details/:id"
          element={
            <Layout userType={userType}>
              <LoandDetails />
            </Layout>
          }
        />

        <Route
          path="/loan-remarks-lisst/:leadId/:orderId"
          element={
            <Layout userType={userType}>
              <LoanRemarksLisst />
            </Layout>
          }
        />


        <Route
          path="/visiting-listings"
          element={
            <Layout userType={userType}>
              <VisitingListings />
            </Layout>
          }
        />

        <Route
          path="/advance-payment-history"
          element={
            <Layout userType={userType}>
              <AdvancepaymentHistory />
            </Layout>
          }
        />



        <Route
          path="/visitings-details/:id"
          element={
            <Layout userType={userType}>
              <VisitingDetails />
            </Layout>
          }
        />



        <Route
          path="/rr-rules-book"
          element={
            <Layout userType={userType}>
              <RRRulesBook />
            </Layout>
          }
        />
        <Route
          path="/plan-PDF"
          element={
            <Layout userType={userType}>
              <PlanPDF />
            </Layout>
          }
        />


        <Route
          path="/property-income-list"
          element={
            <Layout userType={userType}>
              <ALLPropertyIncomeLists />
            </Layout>
          }
        />


        {/* <Route
          path="/parent-commission/:id"
          element={
            <Layout userType={userType}>
              <ParentCommissionPage />
            </Layout>
          }
        /> */}

        <Route
          path="/child-commission"
          element={
            <Layout userType={userType}>
              <ChildCommissionPage />
            </Layout>
          }
        />

        <Route
          path="/self-gifts-lists"
          element={
            <Layout userType={userType}>
              <SelfGiftsLists />
            </Layout>
          }
        />

        <Route
          path="/total-sales"
          element={
            <Layout userType={userType}>
              <ToatalSales />
            </Layout>
          }
        />

        <Route
          path="/total-self-sales"
          element={
            <Layout userType={userType}>
              <SelfSales />
            </Layout>
          }
        />
        <Route
          path="/total-team-sales"
          element={
            <Layout userType={userType}>
              <TeamSales />
            </Layout>
          }
        />
        <Route
          path="/total-sales-earning"
          element={
            <Layout userType={userType}>
              <SalesEarning />
            </Layout>
          }
        />
        <Route
          path="/total-self-salesEarning"
          element={
            <Layout userType={userType}>
              <SelfSalesEarning />
            </Layout>
          }
        />
        <Route
          path="/total-team-salesEarning"
          element={
            <Layout userType={userType}>
              <TeamSalesEarning />
            </Layout>
          }
        />

        <Route
          path="/user-wallet-report"
          element={
            <Layout userType={userType} mobile={mobile}>
              <WalletReport />
            </Layout>
          }
        />


        <Route
          path="/get-tsd-report-for-associate"
          element={
            <Layout userType={userType} mobile={mobile}>
              <TDSReport />
            </Layout>
          }
        />

        <Route
          path="/property-awards-winners-histories"
          element={
            <Layout userType={userType} mobile={mobile}>
              <ProprtyAwardsWinnerHistories />
            </Layout>
          }
        />

        <Route
          path="/first-line"
          element={
            <Layout userType={userType} mobile={mobile}>
              <FirstLine />
            </Layout>
          }
        />
        <Route
          path="/second-line"
          element={
            <Layout userType={userType} mobile={mobile}>
              <SecondLine />
            </Layout>
          }
        />
        <Route
          path="/third-line"
          element={
            <Layout userType={userType} mobile={mobile}>
              <ThirdLine />
            </Layout>
          }
          />

          <Route
          path="/lines-details/:id" 
          element={
            <Layout userType={userType} mobile={mobile}>
              <LinesDetails />
            </Layout>
          }
        />


        <Route
          path="/second-lines-details/:id" 
          element={
            <Layout userType={userType} mobile={mobile}>
              <Lines2Details />
            </Layout>
          }
        />


        <Route
          path="/third-lines-details/:id" 
          element={
            <Layout userType={userType} mobile={mobile}>
              <Lines3Details />
            </Layout>
          }
        />


          <Route
          path="/total-achieved-buy-sqyd-details" 
          element={
            <Layout userType={userType} mobile={mobile}>
              <TotalAchievedBuySqydDetails />
            </Layout>
          }
        />
          <Route
          path="/create-ticket-support" 
          element={
            <Layout userType={userType} mobile={mobile}>
              <CreateTicketSupport />
            </Layout>
          }
        />
          <Route
          path="/created-ticket-support-list" 
          element={
            <Layout userType={userType} mobile={mobile}>
              <AllCreatedTicketSupport />
            </Layout>
          }
        />


         <Route
          path="/admin-plot-ledger" 
          element={
            <Layout userType={userType} mobile={mobile}>
              <PlotLedger />
            </Layout>
          }
        />


         <Route
          path="/unit-sqyd-added" 
          element={
            <Layout userType={userType} mobile={mobile}>
              <UnitSQYDAdded />
            </Layout>
          }
        />

         <Route
          path="/unit-sqyd-ledger" 
          element={
            <Layout userType={userType} mobile={mobile}>
              <UnitSQYDLedger />
            </Layout>
          }
        />



      </Routes>
    </Router>
  );
};

export default App;
