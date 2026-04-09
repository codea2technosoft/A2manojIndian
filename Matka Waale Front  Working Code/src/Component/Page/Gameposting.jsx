import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import withReactContent from "sweetalert2-react-content";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { Container } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import logo from "../../assets/img/logo.png";
import { Link } from "react-router-dom";

export default function Gameposting() {
  const [users, setUsers] = useState([]);
  const [showSubmitButton, setShowSubmitButton] = useState(null);
  const [loading1, setLoading] = useState(false);


  useEffect(() => {
    loaduser();
  }, []);
  const loaduser = async () => {
    // setLoading(true);
    const user_id = localStorage.getItem("userid");

    try {
      setLoading(true);
      const requestData = {
        // app_id: process.env.REACT_APP_API_ID,
        user_id: user_id,
      };
      const config = {
        method: 'POST',
        url: `${process.env.REACT_APP_API_URL_NODE}get-group-message`,
        headers: {
          'Content-Type': 'application/json',
        },
        data: requestData,
      };

      const response = await axios(config);
      const res = JSON.stringify(response.data.message.data);

      const objectRes = JSON.parse(res);
      setUsers(objectRes);
      localStorage.setItem("Gameposting", response.data.message.totalcount);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
    setLoading(false);
  };

  const [message, setMessage] = useState("");

  const OnnumberChange = (e) => {
    const mobilnumbers = e.target.value;
    setMessage(mobilnumbers);
  };

  const addmsggroup = async () => {
    const user_id = localStorage.getItem("userid");
    if (message.trim() === "") {
      toast.error("Please enter a message before sending.");
      return;
    }
    try {
      const requestData = {
        // app_id: process.env.REACT_APP_API_ID,
        user_id: user_id,
        message: message
      };
      const config = {
        method: 'POST',
        url: `${process.env.REACT_APP_API_URL_NODE}addMsg-Group`,
        headers: {
          'Content-Type': 'application/json',
        },
        data: requestData,
      };
      const response = await axios(config);
      // .then(function (response) {
      const res = JSON.stringify(response.data);
      if (response.data.success == 1) {
        // setShowSubmitButton(false);
        setMessage("");
        const MySwal = withReactContent(Swal);

        toast.success(response.data.message, {
          onClose: () => {
            setTimeout(() => {
              loaduser();
            }, 1000);
          },
        });
      } else {
        toast.error(response.data.message);
      }
      // });
    } catch (error) {
      console.error("User Name Update:", error);
    }
  };

  useEffect(() => {
    loaduser();
    setTimeout(() => { }, 2000);
  }, []);

  const handleReload = () => {
    loaduser();
    window.scrollTo(0, 0);
  };

  const groupMessagesByDate = (messages) => {
    const groupedMessages = {};
    messages.forEach((value) => {
      const dateKey = new Date(value.datetime).toDateString();
      if (!groupedMessages[dateKey]) {
        groupedMessages[dateKey] = [];
      }
      groupedMessages[dateKey].push(value);
    });
    return groupedMessages;
  };

  const groupedMessages = groupMessagesByDate(users);
  const sortedDates = Object.keys(groupedMessages).sort((a, b) => new Date(b) - new Date(a));
  const isToday = (someDate) => {
    const today = new Date();
    return (
      someDate.getDate() === today.getDate() &&
      someDate.getMonth() === today.getMonth() &&
      someDate.getFullYear() === today.getFullYear()
    );
  };


  const loaduser1 = async () => {
    const user_id = localStorage.getItem("userid");
    const dev_id = localStorage.getItem("dev_id");
    let url = `${process.env.REACT_APP_API_URL_NODE}user-profile`;

    const requestData = {
      app_id: process.env.REACT_APP_API_ID,
      user_id: user_id,
      dev_id: dev_id,
    };

    const config = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      console.warn(data);
      setShowSubmitButton(data.game_host);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };


  useEffect(() => {
    loaduser1();
  }, [])



  return (
    <>
      <section className="chat" id="gameposting">
        <div className="headerchat">
          <div className="d-flex justify-content-between align-items-center">
            <div className="headericonarrow">
              <Link className="arrowlink" to="/Home">
                <i class="bi bi-arrow-left-short"></i>
              </Link>
            </div>
            <div className="chatname">
              <h2>Game Posting</h2>
            </div>

            <div className="logoheader">
              <img src={logo} className="img-fluid" />
            </div>
          </div>
        </div>

        <div className="container">
          <div className="chatdesignuser1">
            <div class="chat-message-group writer-user" style={{ paddingTop: "50px" }}>
              <div class="chat-messages">
                {sortedDates.reverse().map((date) => (
                  <div key={date}>
                    <ul class="list-group">
                      {/* <div className="date-header text-danger text-center">{date}</div> */}
                      <div class="chat-line">
                                <span class="chat-date"> {isToday(new Date(date))
                          ? "Today"
                          : new Date(date).toLocaleDateString("en-GB")}</span>
                            </div>
                     
                      {/* <hr class="hr-text text-danger" data-content="" /> */}
                      {groupedMessages[date].map((value) => (
                        <div key={value.id}>
                       <div class="chat-profile-name text-end">
                       <h6>{value.name}<span class="chat-time">
                       {new Date(value.datetime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                            </span>
                            
                            </h6>
                        
                          </div>
                         <div class="message">
                          <h4 className="mb-0 text-white chattext" style={{ wordBreak: "break-all" }}>
                            {value.message}
                          </h4>
                         </div>
                         
                        </div>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

          </div>
          <div className="d-flex chatdesign">
            <div className="inputchat">
              <input
                type="text"
                className="form-control"
                placeholder="Type Message"
                onChange={OnnumberChange}
                value={message}
              />
            </div>
            {showSubmitButton == 1 && (
              <div className="buttonsend">
                <i onClick={addmsggroup} class="bi bi-send"></i>
              </div>
            )}
            
          </div>
          
        </div>
        <ToastContainer />
      </section>
      {loading1 && (
        <div className="spinner-wrapper">
          <div className="loadernew2"></div>
        </div>
      )}
    </>
  );
}
