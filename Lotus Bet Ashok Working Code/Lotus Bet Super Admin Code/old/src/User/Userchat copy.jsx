import React, { useRef, useState } from "react";
import { io } from "socket.io-client";
import { useLocation } from "react-router-dom";

const UserChat = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const socketRef = useRef(null);

  // 🔍 Get token and type from URL
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const user_id = query.get("user_id");
  const type = query.get("type");

  const sendMessage = () => {
    if (!message) return;

    // ✅ If socket not connected, connect with token and type in query
    if (!socketRef.current) {
      const socket = io("https://sara777chatapi.sindoor7.com", {
        transports: ["websocket"],
        withCredentials: true,
        // query: {
        //   token: token,
        //   type: type,
        // },
      });

      socketRef.current = socket;

      // 🔌 On connection
      socket.on("connect", () => {
        console.log("Connected with socket ID:", socket.id);

        // Join room or setup
        socket.emit("join", {
          userId: "user123",
          role: "user",
        });

        // Receive messages
        socket.on("receive_message", (data) => {
          setChat((prev) => [...prev, data]);
        });

        // Send first message
        socket.emit("send_message", {
          from: "user123",
          to: "admin123",
          message,
          user_id:user_id,
          type:type,
          action:'user',
        });

        setChat((prev) => [...prev, { from: "You", message }]);
        setMessage("");
      });

      // Handle disconnection
      socket.on("disconnect", () => {
        console.log("Socket disconnected");
        socketRef.current = null;
      });
    } else {
      // ✅ Socket already connected, just send message
      socketRef.current.emit("send_message", {
        from: "user123",
        to: "admin123",
        message,
      });

      setChat((prev) => [...prev, { from: "You", message }]);
      setMessage("");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>User Chat</h2>
      <div style={{ maxHeight: "300px", overflowY: "auto", border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
        {chat.map((msg, i) => (
          <p key={i}>
            <strong>{msg.from}:</strong> {msg.message}
          </p>
        ))}
      </div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message"
        style={{ width: "80%", padding: "8px" }}
      />
      <button onClick={sendMessage} style={{ padding: "8px 16px", marginLeft: "10px" }}>
        Send
      </button>
    </div>
  );
};

export default UserChat;
