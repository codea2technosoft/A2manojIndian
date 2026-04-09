import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import logo from "../../assets/img/logo.png";
import points from "../../assets/img/points.gif";
import help from "../../assets/img/help.png";
import Row from "react-bootstrap/Row";
import "./Header.css";
import * as Icon from "react-bootstrap-icons";
// import { useState } from 'react';
import { Link } from "react-router-dom";
import SidebarData from "../Sidebar/SidebarData";
import profile from "../../assets/img/logo.png";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import { Button } from "react-bootstrap";
import axios from "axios";
import Cookies from "js-cookie";
import { fetchwalletamount } from "../../common.js";
import { useHistory } from "react-router-dom";

export default function Header() {
  const [path, setPath] = useState([]);
  const [Notification, setNotification] = useState("");
  const [insta, setinsta] = useState("");
  const [facebook, setfacebook] = useState("");
  const [loginset, setlogin] = useState("");
  const navigate = useNavigate();
  const [apiResponse, setApiResponse] = useState(null);
  const notificationcount = localStorage.getItem("notificationCount");
  const Gameposting = localStorage.getItem("Gameposting");
  const [NotificationGameposting, setNotificationGameposting] = useState("");

  useEffect(() => {
    getprofile();
    const updatePath = () => {
      const segment = window.location.pathname.split("/");
      setPath(segment);
    };
    updatePath();
    const intervalId = setInterval(updatePath, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  function refreshPage() {
    setTimeout(() => {
      window.location.reload(false);
    }, 500);
    console.log("page to reload");
  }
  const [walletAmount, setWalletAmount] = useState(null);
  const user_id = localStorage.getItem("userid");
  const devid = localStorage.getItem("dev_id");
  const segment = window.location.pathname.split("/");

  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const handleClick = () => {
    open === true ? setOpen(false) : setOpen(true);
  };

  const [users, setUsers] = useState([]);

  const [loading1, setLoading] = useState(false);

  const getprofile = async () => {
    const apiUrl = `${process.env.REACT_APP_API_URL_NODE}user-profile`;
    const requestData = {
      app_id: process.env.REACT_APP_API_ID,
      user_id: user_id,
      device_id: devid,
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      console.warn(" setApiResponse(response.data.is_show);", data.is_bonus);
      setApiResponse(data.is_bonus);
      const islogin = data.is_login;

      if (islogin === "0") {
        window.location.href = "/";
      }

      if (data.success === "1") {
        localStorage.setItem("ref_status", data.ref_status);
        localStorage.setItem("ref_code", data.ref_code);
        setUserData(data);
      } else {
        console.error("API Error:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const Logout_user = async () => {
    const apiUrl = `${process.env.REACT_APP_API_URL}/logout_user.php`;
    const formData = new FormData();
    formData.append("user_id", user_id);
    fetch(apiUrl, {
      method: "POST",
      body: formData,
    });
  };

  const logout = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Are you sure?",
      text: "You will be log out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Log Out !",
    }).then((result) => {
      if (result.isConfirmed) {
        Logout_user();
        // localStorage.removeItem('user_id');
        localStorage.clear();
        navigate(-1);
        navigate("/");
      }
    });
  };

  useEffect(() => {
    setinsta(localStorage.getItem("insta"));
    setfacebook(localStorage.getItem("facebook"));

    const user_id = localStorage.getItem("userid");
    if (user_id == null) {
      window.location.href = "/";
      localStorage.clear();
    }
    if (devid == null) {
      window.location.href = "/";
      localStorage.clear();
    }

    loaduser();
  }, []);

  // const loaduser = async () => {
  //   const user_id = localStorage.getItem("userid");
  //   const dev_id = localStorage.getItem("dev_id");
  //   let url = (`${process.env.REACT_APP_API_URL}/get_user_credit.php`);
  //   const formData = new FormData();
  //   formData.append('app_id', process.env.REACT_APP_API_ID);
  //   formData.append('user_id', user_id);
  //   formData.append('dev_id', dev_id);
  //   var config = {
  //     method: 'POST',
  //     url: url,
  //     body: formData,
  //   };
  //   axios.post(url, formData, config)
  //     .then(function (response) {
  //       const res = JSON.stringify(response.data);
  //       const res1 = response.data.success;
  //       console.warn(res1);
  //       const objectRes = JSON.parse(res);
  //       console.log(objectRes)
  //       setUsers(objectRes);
  //     //   if(res1 == 3){

  //     //     localStorage.clear();
  //     //     navigate('/');
  //     // }
  //     })
  // }

  const loaduser = async () => {
    const user_id = localStorage.getItem("userid");
    const dev_id = localStorage.getItem("dev_id");
    const url = `${process.env.REACT_APP_API_URL_NODE}user-credit`;

    const requestData = {
      app_id: process.env.REACT_APP_API_ID,
      user_id: user_id,
      dev_id: dev_id,
    };

    try {
      const response = await axios.post(url, requestData);
      const data = response.data;

      const res1 = data.success;
      // console.warn(res1);

      setUsers(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchwalletamount(setWalletAmount);
  }, [setWalletAmount]);

  const notification = async () => {
    setLoading(true);
    // alert('pppppp');
    const user_id = localStorage.getItem("userid");

    try {
      let url = `${process.env.REACT_APP_API_URL_NODE}boardcast`;

      // const formData = new FormData();
      // formData.append('app_id', process.env.REACT_APP_API_ID);
      // formData.append('user_id', user_id);

      const requestData = {
        app_id: process.env.REACT_APP_API_ID,
        user_id: user_id,
      };

      var config = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestData,
      };

      axios
        .post(url, requestData, config)
        .then(function (response) {
          const res = JSON.stringify(response.data.data);
          const objectRes = JSON.parse(res);
          const noteFiCation = Math.max(
            objectRes.length - notificationcount,
            0
          );
          setNotification(noteFiCation);
          // console.warn(noteFiCation);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  useEffect(() => {
    notification();
    setTimeout(() => {}, 2000);
  }, []);

  const handleReload = () => {
    notification();
    window.scrollTo(0, 0);
  };
  const loadusersGameposting = async () => {
    const user_id = localStorage.getItem("userid");
    try {
      setLoading(true);
      const requestData = {
        // app_id: process.env.REACT_APP_API_ID,
        user_id: user_id,
      };
      const config = {
        method: "POST",
        url: `${process.env.REACT_APP_API_URL_NODE}get-group-message`,
        headers: {
          "Content-Type": "application/json",
        },
        data: requestData,
      };
      // axios.post(url, formData, config)
      // .then(function (response) {
      const response = await axios(config);
      const res = JSON.stringify(response.data.message.data);
      const objectRes = JSON.parse(res);
      // alert(objectRes.length);
      const noteFiCation = Math.max(objectRes.length - Gameposting, 0);
      // const noteFiCation = Math.max(response.data.message.totalcount - Gameposting, 0);
      setNotificationGameposting(noteFiCation);
      // console.warn(noteFiCation);

      // })
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
    setLoading(false);
  };
  useEffect(() => {
    loadusersGameposting();
    setTimeout(() => {}, 2000);
  }, []);

  const handleReloadGameposting = () => {
    loadusersGameposting();
    window.scrollTo(0, 0);
  };

  return (
    <>
      <div className="header-top">
        <Container>
          <Row className="d-flex align-items-center justify-content-between">
            <Col xs={4} md={4} className="p-0">
              <div
                className="menuicon d-flex justify-content-between align-items-center"
                onClick={handleReloadGameposting}
              >
                <i class="bi bi-list" onClick={handleClick}></i>
                <div>
                  <span className="badge text-center">
                    {Number.isNaN(NotificationGameposting)
                      ? null
                      : NotificationGameposting !== 0 &&
                        NotificationGameposting}
                  </span>
                </div>
                {/* Home */}
                <div className="word_wrap_header">{path.join("")}</div>
              </div>
            </Col>
            <Col xs={2} md={2} className="">
              <div className="logo_design">
                <img src={logo} />
              </div>
              {/* <div className="refresh">
                <Link onClick={refreshPage}>Refresh</Link>
              </div> */}
            </Col>
            <Col xs={4} md={4} className="p-0">
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <span className="points">
                    <img src={points} alt="points" />
                  </span>
                  {/* {users.credit} */}
                  &nbsp;
                  <span className="expenseAmtt">{walletAmount}</span>/-
                </div>
                <Link
                  to="/Notification"
                  onClick={handleReload}
                  className="buttonpage"
                >
                  <i class="bi bi-bell-fill text-white"></i>
                  <span class="badge noti">
                    {Notification !== 0 && <span>{Notification}</span>}
                  </span>
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <div className={open ? "sidebar is-toggle" : "sidebar"}>
        <div className="profileimage">
          <Button className="closebtn" onClick={handleClick}>
            &times;
          </Button>
          {userData && (
            <>
              <div className="d-flex align-items-center justify-content-between">
                <div className="profilephoto">
                  <img src={profile} />
                </div>
                <Link
                  to="/Profile"
                  className="profilelink"
                  onClick={handleClick}
                >
                  Edit Profile
                </Link>
              </div>
              <div className="profiledetails">
                <h3>{userData.name}</h3>
                <h4>
                  <strong>ID : </strong>
                  {userData.mob}
                </h4>
              </div>
            </>
          )}
        </div>
        <ul className="menulist">
          {SidebarData.map((val) => (
            <li key={val.title}>
              {val.title === "Logout" ? (
                <Link to={val.path} onClick={logout} className={val.ownclass}>
                  <div className="iconmenu">{val.icon}</div>
                  {val.title}
                  {val.hinditext}
                </Link>
              ) : val.title === "Share" ? (
                <Link to="#" onClick={val.onClick} className={val.ownclass}>
                  <div className="iconmenu">{val.icon}</div>
                  <div className="menulistsidebar">
                    {val.title}
                    <small>{val.hinditext}</small>
                  </div>
                </Link>
              ) : val.title === "Game Posting" ? (
                <Link to={val.path} className={val.ownclass}>
                  <div className="iconmenu">{val.icon}</div>
                  <div className="menulistsidebar position-relative">
                    {val.title}
                    {Number.isNaN(NotificationGameposting)
                      ? null
                      : NotificationGameposting !== 0 && (
                          <div className="text-white badgegameposing">
                            {NotificationGameposting}
                          </div>
                        )}
                    <small>{val.hinditext}</small>
                  </div>
                </Link>
              ) : val.title === "Reffer" ? (
                <Link to={val.path} className={val.ownclass}>
                  <div className="iconmenu">{val.icon}</div>
                  <div className="menulistsidebar">
                    {val.title}
                    <small>{val.hinditext}</small>
                  </div>
                </Link>
              ) : val.title !== "Reffer" ? (
                <Link
                  to={val.path}
                  onClick={handleClick}
                  className={val.ownclass}
                >
                  <div className="iconmenu">{val.icon}</div>
                  <div className="menulistsidebar">
                    {val.title}
                    <small>{val.hinditext}</small>
                  </div>
                </Link>
              ) : null}
            </li>
          ))}

          {/* <li className="p-0">
            <div className="socialmedia w-100 ">
              <div className="d-flex justify-content-center gap-2">
                <div className="whatsapp">
                  <div className="iconmessage">
                    <Link to={facebook}>
                      <i class="bi bi-facebook"></i>
                    </Link>
                  </div>
                </div>
                <div className="chaticoninstra">
                  <div className="iconmessage">
                    <Link to={insta}>
                      <i class="bi bi-instagram"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </li> */}
        </ul>
      </div>
      <div
        className={`sidebar-overlay ${open == true ? "active" : ""}`}
        onClick={handleClick}
      ></div>
    </>
  );
}
