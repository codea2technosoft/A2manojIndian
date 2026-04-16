import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { isMobile } from "react-device-detect";
import "./Style.css";
import "./Style.scss";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Login from "./Component/Login/Login";
import ForgetMpin from "./Component/Login/ForgetMpin";
import ResetMpin from "./Component/Login/ResetMpin";
import Loginapp from "./Component/Login/Loginapp";
import Home from "./Component/Home";
import History from "./Component/Page/History";
import LoginAuto from "./Component/Login/LoginAuto";
import Setmpin from "./Component/Page/Setmpin";
import HistoryDeclared from "./Component/Page/History_declared";
import Wallet from "./Component/Page/Wallet";
import AddBank from "./Component/Page/AddBank";
import Play from "./Component/Page/Play";
import Help from "./Component/Page/Help";
import Jodi from "./Component/Page/Jodi";
import GameSuccess from "./Component/Page/GameSuccess";
import Manual from "./Component/Page/Manual";
import Playgame from "./Component/Page/Playgame";
import Harruf from "./Component/Page/Harruf";
// import SplashScreen from "./Component/Page/SplashScreen";
import Crossing from "./Component/Page/Crossing";
import Playcommon from "./Component/Page/Playcommon";
import Copypaste from "./Component/Page/Copypaste";
import Profile from "./Component/Page/Profile";
import Resulthistory from "./Component/Page/Resulthistory";
import Termsandcondition from "./Component/Page/Termsandcondition";
import Notification from "./Component/Page/Notification";
import Appdetails from "./Component/Page/Appdetails";
import Gameposting from "./Component/Page/Gameposting";
import Bonusreport from "./Component/Page/Bonusreport";
import Refferreport from "./Component/Page/Refferreport";
import RefferreportLavel2 from "./Component/Page/RefferreportLavel2";
import Withdrawalchat from "./Component/Page/Withdrawalchat";
import Depositchat from "./Component/Page/Depositchat";
import Chatusapp from "./Component/Page/Chatusapp";
import ".././src/assets/fonts/font1/stylesheet.css";
import ".././src/assets/fonts/font-2/stylesheet.css";
import Header from ".././src/Component/Header/Header";
import Footer from ".././src/Component/Footer";
import CreateAccount from "./Component/Login/CreateAccount";
import HistoryPending from "./Component/Page/History_pending";
 import GameLoad from "./Component/Page/GameLoad";
//import GameLoad from "./components/GameLoad"; // Sahi path do

// const RouteChangeHandler = ({ loaduser1 }) => {
//   const location = useLocation();
//   useEffect(() => {
//     loaduser1();
//   }, [location, loaduser1]);
//   return null;
// };

const RouteChangeHandler = ({ loaduser1 }) => {
  const location = useLocation();
  useEffect(() => {
    if (location.pathname != "/chat_us") {
      loaduser1();
    }
  }, [location, loaduser1]);

  return null;
};

function App() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const publicVapidKey =
    "BBy06jNaw6csPMcbLXtyGbq1nwIHJJVIj4bPWu8wP1Fxjg9lCvDSUMXn8FR58RCetNVN72JaYCm8m1ini1pNO9c";
  const registerServiceWorker = async () => {
    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.register(
          "/service-worker.js"
        );
        console.log(
          "Service Worker registered with scope:",
          registration.scope
        );
        return registration;
      } catch (error) {
        console.error("Service Worker registration failed:", error);
      }
    }
  };

  useEffect(() => {
    registerServiceWorker();
    subscribeToPush();
  }, []);

  const subscribeToPush = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        // alert('You need to allow notifications to receive push messages.');
        return;
      }
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
      });
      await fetch("https://notification.khelomatka.com/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscription),
      });
      setIsSubscribed(true);
    } catch (error) {
      console.error("Error subscribing to push notifications:", error);
    }
  };

  function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  const loaduser1 = async () => {
    const token = localStorage.getItem("tokenl");
    const user_id = localStorage.getItem("userid");
    const dev_id = localStorage.getItem("dev_id");
    let url = `${process.env.REACT_APP_API_URL_NODE}user-profile`;
    const requestData = {
      app_id: process.env.REACT_APP_API_ID,
      user_id: user_id,
      dev_id: dev_id,
    };

    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      // console.warn(token);
      console.warn(data);
      // return;
      if (token != data.tokenl) {
        localStorage.removeItem("userid");
        localStorage.removeItem("tokenl");
        localStorage.removeItem("dev_id");
        window.location.href = "/";
      }

      if (data.user_status == 0) {
        localStorage.removeItem("userid");
        localStorage.removeItem("tokenl");
        localStorage.removeItem("dev_id");
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    loaduser1();
  }, []);

  return (
    <>
      <BrowserRouter>
        <RouteChangeHandler loaduser1={loaduser1} />
        <Routes>
          <Route
            path="/*"
            element={
              <div>
                <Header />
                <Routes>
                  <Route path="/Bonus-Report" element={<Bonusreport />} />
                  <Route path="/Reffer-Report" element={<Refferreport />} />
                  <Route
                    path="/Reffer-Report-lavel2/:id"
                    element={<RefferreportLavel2 />}
                  />

                  <Route path="/Wallet" element={<Wallet />} />
                  <Route path="/add-bank" element={<AddBank />} />
                  <Route path="/History" element={<History />} />
                  <Route
                    path="/History-declared"
                    element={<HistoryDeclared />}
                  />
                  <Route path="/pending-bet" element={<HistoryPending />} />
                  <Route path="/Play" element={<Play />} />
                  <Route path="/Playcommon" element={<Playcommon />} />
                  <Route path="/Notification" element={<Notification />} />
                  <Route path="/Help" element={<Help />} />
                  <Route path="/Profile" element={<Profile />} />
                  <Route path="/Appdetails" element={<Appdetails />} />
                  <Route path="/setmpin" element={<Setmpin />} />
                  <Route path="/Home" element={<Home />} />
                </Routes>
                <Footer />
              </div>
            }
          />
          <Route path="/Playgame" element={<Playgame />} />
          <Route
            path="/Termsandcondition"
            element={
              <>
                <Termsandcondition /> <Header />
              </>
            }
          />
          <Route
            path="/game-load/:market_id/:user_id"
            element={
              <>
                <Header />
                <GameLoad />
              </>
            }
          />

          <Route
            path="/Resulthistory"
            element={
              <>
                <Resulthistory />
                <Header />
              </>
            }
          />
          {/* <Route path="/Help" element={<><Help /><Header /></>} /> */}
          <Route path="/Jodi" element={<Jodi />} />
          <Route path="/GameSuccess" element={<GameSuccess />} />
          <Route path="/Manual" element={<Manual />} />
          <Route path="/Harruf" element={<Harruf />} />
          <Route path="/Crossing" element={<Crossing />} />
          <Route path="/Copypaste" element={<Copypaste />} />
          <Route path="/Withdrawalchat" element={<Withdrawalchat />} />
          <Route path="/Depositchat" element={<Depositchat />} />
          <Route path="/chat_us" element={<Chatusapp />} />
          <Route path="/Gameposting" element={<Gameposting />} />
          <Route path="/" element={<Login />} />
          <Route path="/forget-mpin" element={<ForgetMpin />} />
          <Route path="/LoginAuto" element={<LoginAuto />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/resetmpin" element={<ResetMpin />} />
          <Route path="/Loginapp" element={<Loginapp />} />
          {/* <Route path="/" element={<SplashScreen />} /> */}
        </Routes>
      </BrowserRouter>
      {/* }  */}
    </>
  );
}

export default App;
