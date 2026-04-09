import React, { useState, useEffect } from "react";
import HomePage from './../src/ChatPage/HomePage';
import ChatPage from './../src/ChatPage/ChatPage';
import "./Chat.css";
import axios from "axios";

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [chatData, setChatData] = useState({ type: '', ticketId: '' });
  const userId = localStorage.getItem("user_id");
  // const [phonenum, setPhonenum] = useState("");
  // alert(phonenum);
  const backendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
  const backendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  const nodeMode = process.env.NODE_ENV;
   const user_mobile = localStorage.getItem('user_mobile');
  const baseUrl =
    nodeMode === "development" ? backendLocalApiUrl : backendLiveApiUrl;
  // const fetchUser = async () => {
  //   try {
  //     const userId = localStorage.getItem("user_id");
  //     if (!userId) return;
  //     const response = await axios.get(`${baseUrl}/getProfil/${userId}`);
  //     if (response.data.success) setPhonenum(response.data.user.mobile);
  //   } catch (err) {
  //     console.error("Error fetching user:", err);
  //   }
  // };
  // useEffect(() => {
  //   fetchUser();
  // }, [baseUrl]);

  const user = {
    user_id: userId,
    name: 'Test',
    // mobile: phonenum
    mobile: user_mobile
  };

  const handleStartChat = (type, ticketId = null) => {
    setChatData({ type, ticketId });
    setCurrentPage('chat');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setChatData({ type: '', ticketId: '' });
  };

  return (
    <div className="app">
      {currentPage === 'home' ? (
        <HomePage user={user} onChatStart={handleStartChat} />
      ) : (
        <ChatPage 
          user={user}
          chatType={chatData.type}
          ticketId={chatData.ticketId}
          onBackToHome={handleBackToHome}
        />
      )}
    </div>
  );
};

export default App;