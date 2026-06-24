import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import { MdFilterListAlt } from "react-icons/md";
function Adminchat() {
  const [chatList, setChatList] = useState([]);
  const token = localStorage.getItem("token");
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const socketRef = useRef(null);
  const usersPerPage = 20;
  const toTitleCase = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  useEffect(() => {
    // fetchChats();
  }, [token]);

  useEffect(() => {
    console.log("🟠 Setting up socket...");
    if (!socketRef.current) {
      try {
        const socket = io("https://chatapi.ankmatka.com", {
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

        socket.on("receive_messageAdmin", (data) => {
          console.warn("📥 Messagesasasas received: ", data);
          setFilteredUsers(data.chatlistAdmin);
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

  const [fillter, setFillter] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const fillterdata = () => {
    setFillter((prev) => !prev);
  };
  const [FilterUsername, setFilterUsername] = useState("");
  const [Filtertype, setFiltertype] = useState("");
  // Search handler

  const handleSearchChangeusername = (e) => {
    const value = e.target.value.toLowerCase();
    setFilterUsername(value);
  };
  const handleChangetype = (e) => {
    const value = e.target.value.toLowerCase();
    setFiltertype(value);
  };
  const handleFilter = (e) => {
    fetchChats();
  };
  useEffect(() => {
    fetchChats(currentPage);
    // fetchMarketlist();
  }, [currentPage]);
  const fetchChats = async (page = 1) => {
    try {
      const res = await fetch(
        `https://adminapis.ankmatka.com/chat-list-admin?page=${page}&limit=20&username=${FilterUsername}&type=${Filtertype}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const result = await res.json();
      if (result && result.chat) {
        setChatList(result.chat);
        setUsers(result.chat);
        setFilteredUsers(result.chat);
        setTotalPages(Number(result.totalNumberPage) || 1);
      } else {
        console.error("No chat data found:", result);
      }
    } catch (error) {
      console.error("Error fetching chat list:", error);
    }
  };

  return (
    <div className="mt-3">
      {/* <h2>Admin Chat List</h2> */}
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header bg-color-black">
              <div className="d-flex align-items-center justify-content-between">
                <h3 className="card-title text-white">Admin Chat List</h3>
                {/* <h3 className="card-title text-white">Bet Pending List</h3> */}
                <div className="buttonlist">
                  <div className="fillterbutton" onClick={fillterdata}>
                    <MdFilterListAlt /> Filter
                  </div>
                </div>
              </div>
            </div>

            {fillter && (
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-design-fillter gap-2 d-flex justify-content-between align-items-end">
                      <div className="form_latest_design w-100">
                        <div className="label">
                          <label htmlFor="">User Name</label>
                        </div>
                        <input
                          type="text"
                          name="user_name"
                          className="form-control"
                          value={FilterUsername}
                          onChange={handleSearchChangeusername}
                        />
                      </div>

                      <div className="form_latest_design w-100">
                        <div className="label">
                          <label htmlFor="">Type</label>
                        </div>
                        <select
                          name="user_name"
                          className="form-control"
                          value={Filtertype}
                          onChange={handleChangetype}
                        >
                          <option value="">Type</option>
                          <option value="deposit">Deposit</option>
                          <option value="withdraw">Withdraw</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div className="form_latest_design">
                        <button
                          className="btn btn-info text-white"
                          onClick={handleFilter}
                        >
                          Filter
                        </button>
                      </div>
                      {/* <di className="form_latest_design"v>
                  <button className="btn btn-secondary">helo</button>
                </di> */}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* <div className="form-design-fillter d-flex justify-content-end search_bar ml-auto">
            <input
              type="text"
              placeholder="Search by Username, Mobile or Email"
              className="form-control mb-3"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div> */}

            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Sr</th>
                      <th>Username</th>
                      {/* <th>Mobile</th> */}
                      <th>Type</th>
                      <th>Status</th>
                      <th>Ticket ID</th>
                      <th>Date Time</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length > 0 ? (
                      users.map((item, index) => (
                        <tr key={item._id}>
                          <td>{index + 1}</td> {/* Global index */}
                          <td>{toTitleCase(item.username)}</td>
                          {/* <td>{item.mobile}</td> */}
                          <td>{toTitleCase(item.type)}</td>
                          <td
                            style={{
                              color: item.status === "open" ? "green" : "red",
                              fontWeight: "bold",
                            }}
                          >
                            {toTitleCase(item.status)}
                          </td>
                          <td>{item.ticket_id}</td>
                          {/* <td>{item.date_time}</td> */}
                          <td>
                            {new Date(item.date_time)
                              .toLocaleString("en-IN", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })
                              .replaceAll("/", "-")
                              .toUpperCase()}
                          </td>
                          <td>
                            <Link
                              to={`/adminchat/adminchat-view?user_id=${item.user_id}`}
                              target="_blank"
                            >
                              <button
                                className="btn btn-primary btn-sm p-2 chat_deign"
                                style={{
                                  backgroundColor: "#3F51B5",
                                  color: "white",
                                }}
                              >
                                Chat <span>{item.unseenChatCountAdmin}</span>
                              </button>
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center">
                          No chat found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              <div className="d-flex paginationgridnew justify-content-between align-items-center mt-3">
                <button
                  className="paginationbutton"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span className="alllistnumber">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="paginationbutton"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Adminchat;
