import React, { useRef, useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useLocation } from "react-router-dom";

const UserChat = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [chatdataList, setchatdataList] = useState([]);
  const socketRef = useRef(null);

  // 🔍 Get token and type from URL
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const user_id = query.get("user_id");
  const type = query.get("type");

//   useEffect(() => {
//     const chatUser = async () => {
//       try {
//         const res = await fetch(
//           `https://sara777adminapi.sindoor7.com/chat-list`,
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               user_id: user_id,
//             }),
//           }
//         );

//         const result = await res.json();
//         console.log("🧾 User Response:", result);
//         setchatdataList(result.chatData);
//         // console.log(result.chatData.length);
//         if(result.chatData.length==0){
//             setMessage("deposite");
//           sendMessage();
//         }

//         // Agar tumhe user details store karne hain to state bana lo
//         // setUserData(result.data);
//       } catch (error) {
//         console.error("❌ Error fetching user:", error);
//       }
//     };

//     chatUser();
//   }, [user_id]);
useEffect(() => {
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
      }

    } catch (error) {
      console.error("❌ Error fetching user:", error);
    }
  };

  chatUser();
}, [user_id]);
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

        if (!data.chat || data.chat.length === 0) {
          setchatdataList(data.chatData);
          setChat((prev) => [...prev, data]);
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

//   const sendMessage = () => {
//     alert('ppppp');
//     if (!message) return;

//     if (!socketRef.current) {
//       const socket = io("https://sara777chatapi.sindoor7.com", {
//         transports: ["websocket"],
//         withCredentials: true,
//       });

//       socketRef.current = socket;

//       socket.on("connect", () => {
//         console.log("Connected with socket ID:", socket.id);

//         socket.emit("join", {
//           userId: "user123",
//           role: "user",
//         });

//         socket.on("receive_message", (data) => {
//           console.log("Message Received: ", data);
//           if(data.chat.length==null){
//           setchatdataList(data.chatData);
//           setChat((prev) => [...prev, data]);
//           }
//         });

//         socket.emit("send_message", {
//           from: "user123",
//           to: "admin123",
//           message,
//           user_id: user_id,
//           type: type,
//           action: "user",
//         });

//         setChat((prev) => [...prev, { from: "You", message, action: "user" }]);
//         setMessage("");
//       });

//       socket.on("disconnect", () => {
//         console.log("Socket disconnected");
//         socketRef.current = null;
//       });
//     } else {
//       socketRef.current.emit("send_message", {
//         from: "user123",
//         to: "admin123",
//         message,
//         user_id: user_id,
//         type: type,
//         action: "user",
//       });

//       setChat((prev) => [...prev, { from: "You", message, action: "user" }]);
//       setMessage("");
//     }
//   };

  return (
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
  );
};

export default UserChat;
