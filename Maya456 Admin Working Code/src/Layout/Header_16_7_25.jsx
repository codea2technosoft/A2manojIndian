import React, { useState, useEffect, useRef } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { FiUser, FiLogOut } from "react-icons/fi"; // Profile and Logout icons
import { Link } from "react-router-dom";
import { MdNotificationsActive } from "react-icons/md";
import { io } from "socket.io-client";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";

function Header({ onToggleSidebar }) {
  const [darkMode, setDarkMode] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [name, setName] = useState("");
  const [AdminNotifiaction, setAdminNotifiaction] = useState(0);
  const socketRef = useRef(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (email) {
      const username = email.split("@")[0];
      setName(username.charAt(0).toUpperCase() + username.slice(1)); // Optional: capitalize
    }
  }, []);
  useEffect(() => {
    fetchMarkets();
  }, []);
  const fetchMarkets = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/chat-header-notification-count`,
        {
          method: "get",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setAdminNotifiaction(data.totalUnseenAdmin);
    } catch (err) {
      console.error("Error fetching market list:", err);
    } finally {
    }
  };
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-theme");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/login";
  };

  useEffect(() => {
    if (!socketRef.current) {
      try {
        const socket = io("https://chatapi.maya456.com", {
          transports: ["websocket"],
          withCredentials: true,
          reconnection: true,
        });

        socketRef.current = socket;

        socket.on("connect", () => {
          console.log("✅ Connected with socket ID:", socket.id);
          socket.emit("join", {
            userId: "user123",
            role: "user",
          });
        });

        socket.on("receive_messageAdminnotifiactionCount", (data) => {
          setAdminNotifiaction(data.totalUnseenAdmin);
        });

        socket.on("disconnect", () => {
          console.log("⚠️ Socket disconnected");
        });

        socket.on("connect_error", (err) => {
          console.error("❌ Connection Error:", err);
        });

        socket.on("error", (err) => {
          console.error("❌ General Socket Error:", err);
        });
      } catch (e) {
        console.error("❌ Exception in socket setup:", e);
      }
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        console.log("🔌 Socket disconnected on unmount");
        socketRef.current = null;
      }
    };
  }, []);

  return (
    <div className="header" id="header">
      <div className="d-flex justify-content-between px-2 w-100">
        <div className="logo-box d-xl-none d-md-none d-sm-block">
          <Link className="logo-light" to="/dashboard">
            <img
              src={`${process.env.PUBLIC_URL}/assets/images/logosidebar.png`}
              alt="logo"
              className="logo-lg"
              height="40"
            />
          </Link>
        </div>
        <div className=" d-xl-block  d-md-block d-sm-none d-none">
          <div className="togglebutton">
            <AiOutlineMenu onClick={onToggleSidebar} />
          </div>
        </div>
        <div className="linksmode">
          <div className="darkmode" onClick={toggleDarkMode}>
            {darkMode ? <FaSun /> : <FaMoon />}
          </div>
          <div className="notification chat_header_icon">
            <MdNotificationsActive />
          </div>
          <div className="chat_header_icon chat_new">
            <Link to="/adminchat">
              <IoChatbubbleEllipsesSharp />
              <span> {AdminNotifiaction}</span>
            </Link>
          </div>
          <div className="profilie" ref={dropdownRef}>
            <div className="profile-header" onClick={toggleDropdown}>
              <div className="profileimage">
                <img
                  src={`${process.env.PUBLIC_URL}/assets/images/avatar-1.jpg`}
                  alt="Avatar"
                />
              </div>
              <div className="name desktop_device">{name}</div>
              <div
                className={`arrowprofile transition-transform duration-300 ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              >
                <IoIosArrowDown />
              </div>
            </div>

            {dropdownOpen && (
              <div className="profile-dropdown">
                <div className="dropdown-item mobile_device">
                  <div className="d-flex gap-2 align-items-center">
                    <div className="profileimage">
                      <img
                        src={`${process.env.PUBLIC_URL}/assets/images/avatar-1.jpg`}
                        alt="Avatar"
                      />
                    </div>
                    <div className="name">{name}</div>
                  </div>
                </div>
                <div className="dropdown-item flex items-center gap-2">
                  <FiUser /> Profile
                </div>
                <div
                  className="dropdown-item flex items-center gap-2"
                  onClick={handleLogout}
                >
                  <FiLogOut /> Logout
                </div>
              </div>
            )}
          </div>
          <div className="d-xl-none  d-md-none d-sm-block">
            <div className="togglebutton">
              <AiOutlineMenu onClick={onToggleSidebar} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
