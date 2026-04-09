// src/App.js
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
  useLocation,
} from "react-router-dom";
// Components
import Navbar from "./Components/Navbar/Navbar";
import Sidebar from "./Components/Sidebar/Sidebar";
import MainContent from "./Components/MainContent/MainContent";
import PlaceBet from "./Components/PlaceBet/PlaceBet";
import Footer from "./Components/Footer/Footer";
 import Commingsoon from "./Components/Commingsoon";
import Commingsooncasino from "./Components/Commingsooncasino";
// Pages
import Cricket from "./Components/Pages/Cricket";
import Tennis from "./Components/Pages/Tennis";
import TermsConditions from "./Components/Pages/Terms&Conditions";
import Football from "./Components/Pages/Football";
import Login from "./Components/Pages/Login";
import Myprofile from "./Components/Pages/Myprofile";
import Register from "./Components/Pages/Register";
import Home from "./Components/Pages/Home";
import BroadCast from "./Components/Pages/BroadCast";
import Setbuttonvalue from "./Components/Pages/Setbuttonvalue";
import Bethistory from "./Components/Pages/Bethistory";
import Withdraw from "./Components/Pages/Withdraw";
import Deposit from "./Components/Pages/Deposit";
import Statementaccount from "./Components/Pages/Statementaccount";
import AllBetHistory from "./Components/Pages/AllBetHistory";
import ViewHisttory from "./Components/Pages/ViewHisttory";
import Indexpage from "./Components/Pages/Indexpage";
import AccountStatement from "./Components/Pages/AccountStatement";
import Unsettledbet from "./Components/Pages/Unsettledbet";
import Viewprofile from "./Components/Pages/Viewprofile";
import Settledbet from "./Components/Pages/Settledbet";
import Inplay from "./Components/Pages/Inplay";
import Multimarket from "./Components/Pages/Multimarket";
import Withdrawpage from "./Components/Pages/Withdrawpage";
import DepositPage from "./Components/Pages/DepositPage";
import AccountPage from "./Components/Pages/AccountPage";
import Livecasino from "./Components/Pages/Livecasino";
import Rules from "./Components/Pages/Rules";
import WithdrawSection from "./Components/Pages/WithdrawSection";
import AccountDetails from "./Components/Pages/AccountDetails";
import { SidebarProvider } from "./Components/context/SidebarContext";
import Chat from "./Chat";
import Ledger from "./Components/Pages/Ledger";
import Allbet  from "./Components/Pages/Allbet ";
import Changepassword from "./Components/Pages/Changepassword";
import BankManagementCreate from "./Components/Pages/BankManagementCreate";
// Styles
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./assets/scss/Style.scss";
const useBodyClass = () => {
  const location = useLocation();
 const isCricketPage = location.pathname === "/cricket";
  // Apply theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [location.pathname]);
  useEffect(() => {
    const pathClass = location.pathname
      .replace("/", "")
      .replace(/\//g, "-")
      .toLowerCase();
    const oldClasses = Array.from(document.body.classList).filter(
      (cls) => cls.endsWith("-page")
    );
 
    oldClasses.forEach((cls) => document.body.classList.remove(cls));
    if (pathClass) document.body.classList.add(`${pathClass}-page`);
  }, [location]);
};
function Layout({ setSelectedEvent, selectedEvent }) {
  const location = useLocation();
  useBodyClass();
  const isLoginPage = location.pathname === "/login";
  if (isLoginPage) {
    return (
      <div className="App">
        <Outlet />
      </div>
    );
  }
 
  return (
    <div className="App">
      <SidebarProvider>
        <Navbar />
        <div className="main-layout changealldesign_app d-flex align-items-start">
          {/* <Sidebar /> */}
          <div className="main-content  bg-transparent shadow-none newdesign_myx">
            <Outlet />
          </div>
         </div>
 
        {/* <Footer /> */}
      </SidebarProvider>
    </div>
  );
} 
function App() {
  const [selectedEvent, setSelectedEvent] = useState("");
  return (
    <Router>
      <Routes>
        {/* Login page alag se */}
       <Route path="/login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/indexpage" element={<Indexpage />} />
        {/* <Route path="cricket" element={<Cricket />} /> */}
 
          <Route
            path="/cricket/series_idd/:series_idd/event_id/:event_id"
            element={<div className="margin-top-80"><Navbar/><Cricket /></div>}
          />
        <Route path="statementaccount" element={<><Navbar/><div className="margin-top-120"><Statementaccount /></div> </>} />
        <Route path="AllBetHistory" element={<><Navbar/><div className="margin-top-120"><AllBetHistory /></div> </>} />
        <Route path="ViewHisttory" element={<><Navbar/><div className="margin-top-120"><ViewHisttory /></div> </>} />
         <Route path="My-profile" element={<><Navbar/><div className="margin-top-120"><Myprofile /></div></>} />
         <Route path="ledger" element={<><Navbar/><div className="margin-top-120"><Ledger /></div></>} />
         <Route path="Allbet" element={<><Navbar/><div className="margin-top-120"><Allbet  /></div></>} />
         <Route path="changepassword" element={<><Navbar/><div className="margin-top-120"><Changepassword /></div></>} />
        <Route path="rules" element={<div className="bgcolor"><Navbar/><div className="margin-top-120"></div><Rules /></div>} />
        <Route path="commingsoon" element={<><Navbar/><div className="margin-top-120"><Commingsoon  /></div></>} />
         <Route path="commingsooncasino" element={<><Navbar/><div className="margin-top-120"><Commingsooncasino  /></div></>} />
        {/* All other pages inside Layout */}
        <Route
          path="/"
          element={
            <Layout
              setSelectedEvent={setSelectedEvent}
              selectedEvent={selectedEvent}
            />
          }
        >
          <Route index element={<Home />} />
          <Route path="Setbuttonvalue" element={<Setbuttonvalue />} />
          <Route path="bethistory" element={<Bethistory />} />
          <Route path="acountStatement" element={<AccountStatement />} />
          <Route
            path="main-content"
            element={<MainContent setSelectedEvent={setSelectedEvent} />}
          />
          <Route path="home" element={<Home />} />
          <Route path="home/:sport" element={<Home />} />
          <Route path="BroadCast" element={<BroadCast />} />
          <Route path="Withdraw" element={<Withdraw />} />
          <Route path="Deposit" element={<Deposit />} />
          {/* <Route path="cricket/:seriesId/:eventId" element={<Cricket />} /> */}
{/* 
          <Route
            path="/cricket/series_idd/:series_idd/event_id/:event_id"
            element={<Cricket />}
          /> */}                
        {/* <Route path="tennis" element={<Tennis />} /> */}
          <Route path="TermsConditions" element={<TermsConditions />} />
          {/* <Route path="football" element={<Football />} /> */}
          <Route path="inplay" element={<Inplay />} />
          <Route path="Multi-Markets" element={<Multimarket />} />
          <Route path="Chat" element={<Chat />} />
          <Route path="settledbet" element={<Settledbet />} />
          <Route path="unsettledbet" element={<Unsettledbet />} />
          <Route path="withdrawpage" element={<Withdrawpage />} />
          <Route path="accountPage" element={<AccountPage />} />
          <Route path="casino" element={<Livecasino />} />
          <Route path="depositPage" element={<DepositPage />} />
          <Route path="account-details" element={<AccountDetails />} />
          <Route path="withdraw-page" element={<WithdrawSection />} />
          <Route path="viewprofile" element={<Viewprofile />} />
          <Route path="add-bank/:userId" element={<BankManagementCreate />} />
 
          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}
 
export default App;
 