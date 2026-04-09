import React, { useState, useEffect, useRef } from "react";
import "./Chat.scss";
import { IoMdSend } from "react-icons/io";
import { BsFillSendFill } from "react-icons/bs";
import { ImAttachment } from "react-icons/im";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { RiCheckDoubleFill } from "react-icons/ri";

const Userchat = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi there! 👋", sender: "bot", timestamp: new Date() },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = {
      id: Date.now(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate bot reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: getRandomBotResponse(),
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const getRandomBotResponse = () => {
    const responses = [
      "I'm a bot 🤖. How can I help you?",
      "That's interesting! Tell me more.",
      "I'll make a note of that.",
      "Thanks for your message!",
      "Let me check on that for you...",
      "I'm still learning. Can you rephrase that?",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="profile-pic"></div>
        <div className="chat-info">
          <div className="chat-title">Worli777 Chat</div>
          <div className="chat-status">{isTyping ? "typing..." : "online"}</div>
        </div>
        <div className="chat-actions">
          <button className="action-btn">⋮</button>
        </div>
      </div>

      <div className="chat-body">
        <div className="chat-date">TODAY</div>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-message ${msg.sender === "user" ? "user" : "bot"}`}
          >
            <div className="chat-bubble">
              <div className="message-text">{msg.text}</div>
              <div className="message-time">
                {formatTime(msg.timestamp)}
                {msg.sender === "user" && (
                  <span className="message-status">
                    <RiCheckDoubleFill />
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="chat-message bot">
            <div className="chat-bubble">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-footer">
        <button className="footer-btn">
          <MdOutlineEmojiEmotions />
        </button>
        <button className="footer-btn">
          <ImAttachment />
        </button>
        <input
          type="text"
          placeholder="Type a message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button className="send-btn" onClick={sendMessage}>
          {input.trim() ? <BsFillSendFill /> : <IoMdSend />}
        </button>
      </div>
    </div>
  );
};

export default Userchat;
