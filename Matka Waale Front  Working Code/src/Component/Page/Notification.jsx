import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactHtmlParser from "react-html-parser";
// import Loader from './Loader';
import { Link } from "react-router-dom";

export default function Notification() {
  const [users, setUsers] = useState([{}]);
  const [loading1, setLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);

    try {
      const user_id = localStorage.getItem("userid");
      const requestData = {
        app_id: process.env.REACT_APP_API_ID,
        user_id: user_id,
      };

      const config = {
        method: "POST",
        url: `${process.env.REACT_APP_API_URL_NODE}boardcast`,
        headers: {
          "Content-Type": "application/json",
        },
        data: requestData,
      };

      const response = await axios(config);
      const userData = response.data.data;
      setUsers(userData);
      localStorage.setItem("notificationCount", userData.length);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <section id="notification">
        <div className="margin-bottom-88">
          {users &&
            users.map((user) => (
              <>
                <div className="notficationbox">
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="titlenotification"> {user.title}</h6>
                    {/* <p></p> */}
                  </div>
                  <p className="notificationdes">
                    {ReactHtmlParser(user.message)}
                    <Link to={user.link}>{user.link}</Link>
                  </p>
                  {user && user.type == "video" ? (
                    <video controls width="50%" height="150px">
                      <source src={user.media} />
                    </video>
                  ) : (
                    <></>
                  )}
                  {user && user.type == "image" ? (
                    <img
                      src={user.media}
                      alt="User"
                      style={{ width: "50px" }}
                    />
                  ) : (
                    <></>
                  )}
                  <div className="d-flex justify-content-between">
                    <time className="time">Date:{user.date}</time>
                    {/* <p>Timer:09:15:21</p> */}
                  </div>
                </div>
              </>
            ))}
          <div>
            {loading1 && (
              <div className="spinner-wrapper">
                <div className="loadernew2"></div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
