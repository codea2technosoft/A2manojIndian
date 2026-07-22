import React, { useRef, useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useLocation } from "react-router-dom";
import moment from 'moment';
const UserChat = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [chatdataList, setchatdataList] = useState([]);
  const socketRef = useRef(null);
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const user_id = query.get("user_id");
  const type = query.get("type");
 const [UserMsgLastDateTime, SetUserMsgLastDateTime] = useState(null);
const [showPopup, setShowPopup] = useState(false);

useEffect(() => {
  if (!UserMsgLastDateTime) return;
  const interval = setInterval(() => {
    const now = moment();
    const originalTime = moment(UserMsgLastDateTime);
    const newTime = originalTime.clone().add(1, 'minutes'); // +1 minute का नया समय
if (now.isSameOrAfter(newTime)) {
      setShowPopup(true);
      clearInterval(interval);
    }
  }, 1000); // हर एक सेकंड चेक करे
  return () => clearInterval(interval);
}, [UserMsgLastDateTime]);



useEffect(() => {
  
  chatUser();
}, [user_id]);
const chatUser = async () => {
    try {
      const res = await fetch(
        `https://sara777adminapi.sindoor7.com/chat-list`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user_id,
          }),
        }
      );
      const result = await res.json();
      console.log("🧾 User Response:", result);
      setchatdataList(result.chatData);
      if (result.chatData.length === 0) {
        setMessage("first_time");
      }else{
        // alert(result.chat.user_last_msg_date_time);
         SetUserMsgLastDateTime(result.chat.user_last_msg_date_time);
      }
    } catch (error) {
      console.error("❌ Error fetching user:", error);
    }
  };
useEffect(() => {
  if (message === "first_time" && chatdataList.length === 0) {
    sendMessage();
  }
}, [message, chatdataList]);
const sendMessage = () => {
  if (!message) return;
  if (!socketRef.current) {
    const socket = io("https://sara777chatapi.sindoor7.com", {
      transports: ["websocket"],
      withCredentials: true,
    });

    socketRef.current = socket;
    socket.on("connect", () => {
      console.log("Connected with socket ID:", socket.id);
      socket.emit("join", {
        userId: "user123",
        role: "user",
      });

      socket.on("receive_message", (data) => {
        console.log("📥 Message Received: ", data);
        setchatdataList(data.chatData);
        setChat((prev) => [...prev, data]);
        SetUserMsgLastDateTime(data.chat.user_last_msg_date_time);
        if (!data.chat || data.chat.length != 0) {
        }
      });

      socket.emit("send_message", {
        from: "user123",
        to: "admin123",
        message,
        user_id: user_id,
        type: type,
        action: "user",
      });

      setChat((prev) => [...prev, { from: "You", message, action: "user" }]);
      setMessage("");
    });

    socket.on("disconnect", () => {
      console.log("⚠️ Socket disconnected");
      socketRef.current = null;
    });
  } else {
    socketRef.current.emit("send_message", {
      from: "user123",
      to: "admin123",
      message,
      user_id: user_id,
      type: type,
      action: "user",
    });

    setChat((prev) => [...prev, { from: "You", message, action: "user" }]);
    setMessage("");
  }
};
  return (
    <>
    <div style={{ padding: "20px" }}>
      <h2>User Chat</h2>
      <div
        style={{
          maxHeight: "400px",
          overflowY: "auto",
          border: "1px solid #ccc",
          padding: "10px",
          marginBottom: "10px",
        }}
      >
        {chatdataList.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: msg.action === "user" ? "flex-end" : "flex-start",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                backgroundColor: msg.action === "user" ? "#dcf8c6" : "#f1f0f0",
                color: "#000",
                padding: "8px 12px",
                borderRadius: "15px",
                maxWidth: "60%",
              }}
            >
              <strong>{msg.action}:</strong> {msg.message}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex" }}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message"
          style={{ flexGrow: 1, padding: "8px", borderRadius: "5px" }}
        />
        <button
          onClick={sendMessage}
          style={{ padding: "8px 16px", marginLeft: "10px" }}
        >
          Send
        </button>
      </div>
    </div>
    <div>
      {showPopup && (
        <div style={{ backgroundColor: "yellow", padding: "20px", marginTop: "20px" }}>
          🎉 Datetime Matched! This is your popup.
        </div>
      )}
    </div>
    </>
  );
};
export default UserChat;
