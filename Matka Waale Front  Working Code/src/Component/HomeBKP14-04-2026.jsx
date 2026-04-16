import React, { useState, useEffect } from "react";
// import marketnamedata from './MarketNamedata';
import * as Icon from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import { Carousel } from "antd";
import chaticon from "../assets/img/chaticon.png";
import withdrawchat from "../assets/img/withdrawchat.png";
import result from "../assets/img/result.png";
import logonew from "../assets/img/logo.png";
import jQuery from "jquery";
import axios from "axios";
import logo from "../assets/img/logo.png";
import loaderimage from "../assets/img/loaderimage.gif";
import newgiff from "../assets/img/new.gif";
import om from "../assets/img/om.gif";
import chaticonnew from "../assets/img/chaticon.png";
import refresh from "../assets/img/refresh.png";
import othergame from "../assets/img/othergame.png";
import ReactHtmlParser from "react-html-parser";

export default function Home() {
  const initialTime = 15 * 60; // 15 minutes in seconds
  const [countdown, setCountdown] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [users, setUsers] = useState([]);
  const [users1, setUsers1] = useState([]);
  const [usersdata, setUsersdata] = useState([]);
  const [datamsg, setDataMsg] = useState([]);
  const [marketdetails, setmarketdetails] = useState([]);
  const [depositCountData, setdepositCount] = useState([]);
  const [withdrawCountData, setwithdrawCount] = useState([]);
  const [jodiRate, setJodiRate] = useState("");
  const [harapRate, setharapRate] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [data, setData] = useState("Your data here");
  const clearData = () => {
    setData("");
  };

  useEffect(() => {
    let timer;
    if (isRunning && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(countdown - 1);
      }, 100);
    } else if (countdown === 0) {
      clearInterval(timer);
    }
    return () => {
      clearInterval(timer);
    };
  }, [isRunning, countdown]);

  const startCountdown = () => {
    setIsRunning(true);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const contentStyle = {
    height: "70px",
  };

  useEffect(() => {
    loaduser();
    depositCount();
  }, []);

  const dev_id = localStorage.getItem("dev_id");
  const loaduser = async () => {
    const user_id = localStorage.getItem("userid");
    let url = `${process.env.REACT_APP_API_URL_NODE}home`;


    const requestData = {
      app_id: process.env.REACT_APP_API_ID,
      user_id: user_id,
      dev_id: dev_id,
    };

    var config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      // console.warn(data.marquee_msg)
      setDataMsg(data);
      setmarketdetails(data);
      // Handle the response data as needed
      const objectRes = data;

      const objectRess = objectRes.data;
      // console.warn(objectRess)
      setUsers(objectRess);
      setUsersdata(objectRess);

      setmarketdetails(data);
      setMobileNumber(data?.current_market_details?.whatsap || "");
      setJodiRate(data?.jodirate || "");
      setharapRate(data?.andarrate || "");


      loaduser1();
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const depositCount = async () => {
    const user_id = localStorage.getItem("userid");
    let url = `${process.env.REACT_APP_API_URL_NODE}unseen-chat-count`;

    const requestData = {
      user_id: user_id,
    };

    var config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      setdepositCount(data.message.desposit);
      setwithdrawCount(data.message.withdraw);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // const viewBroadcast = async () => {
  //   const user_id = localStorage.getItem("userid");
  //   const apiUrl = `${process.env.REACT_APP_API_URL_NODE}view-boardcast`;
  //   const requestData = {
  //     app_id: process.env.REACT_APP_API_ID,
  //     user_id: user_id,
  //     broadcast_id: users1.id,
  //   };

  //   fetch(apiUrl, {
  //     method: "POST",
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(requestData),
  //   })
  //   loaduser1();
  // };

  const viewBroadcast = async () => {
    try {
      const user_id = localStorage.getItem("userid");
      const apiUrl = `${process.env.REACT_APP_API_URL_NODE}view-boardcast`;
      const requestData = {
        app_id: process.env.REACT_APP_API_ID,
        user_id: user_id,
        broadcast_id: users1.id,
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      console.warn(response);

      if (response.status == 200) {
        loaduser1();
      } else {
        console.error("Failed to view broadcast:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const handleClick = (id, name) => {
    window.location.href = `/Playgame?id=${id}&name=${name}`;
  };

  const loaduser1 = async () => {
    const user_id = localStorage.getItem("userid");
    // alert(user_id);
    try {
      const url = `${process.env.REACT_APP_API_URL_NODE}latest-boardcast`;
      const requestData = {
        app_id: process.env.REACT_APP_API_ID,
        user_id: user_id,
      };
      var config = {
        method: "POST",
        url: url,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      };
      axios.post(url, requestData, config).then(function (response) {
        const res = JSON.stringify(response.data.data);
        const objectRes = JSON.parse(res);
        setUsers1(objectRes[0]);
        if (objectRes.length > 0) {
          jQuery("#modal-container").removeAttr("class").addClass("five");
          jQuery("body").addClass("modal-active");
        }
        // localStorage.setItem("notificationCount", objectRes.length);
      });
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  jQuery(function () {
    jQuery("#clickme").click(function () {
      var buttonId = jQuery(this).attr("id");
      jQuery("#modal-container").removeAttr("class").removeClass(buttonId);
      jQuery("body").removeClass("modal-active");

      // jQuery(this).addClass('out');
    });
    jQuery("#closemodle").click(function () {
      var buttonId = jQuery(this).attr("id");
      jQuery("#modal-container").removeAttr("class").removeClass(buttonId);
      jQuery("body").removeClass("modal-active");

      // jQuery(this).addClass('out');
    });
  });
  function refreshPage() {
    setTimeout(() => {
      window.location.reload(false);
    }, 500);
    console.log("page to reload");
  }
  return (
    <>
      <div className="popupnew" id="modal-container">
        <div className="new_five">
          <div className="modal-background position-relative">
            <div className="modal">
              <button onClick={viewBroadcast} id="closemodle">
                &times;
              </button>
              <div className="logo_babaji">
                <img src={logo} alt="" />
              </div>
              <h2 className="updateversion">{users1 && users1.title}</h2>
              <p className="updateversion_sec">
                {ReactHtmlParser(users1 && users1.message)}
                {users1 && users1.type == "video" ? (
                  <video controls width="100%" height="150px">
                    <source src={users1.media} />
                  </video>
                ) : (
                  <></>
                )}
                {users1 && users1.type == "image" ? (
                  <img
                    src={users1.media}
                    alt="User"
                    style={{ width: "50px" }}
                  />
                ) : (
                  <></>
                )}
              </p>
              <div className="btn-group">
                <Link
                  to="/Notification"
                  className="btnnew btn-masterful"
                  id="clickme"
                >
                  <span className="icon">&#x1F680;</span>
                  <span onClick={viewBroadcast} className="btn-txt">
                    Click me!
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="five" className="button"></div>

      <div className="mainhome">
        <div className="bg_home margin-bottom-88">
          {/* {users && (
            <marquee className="resultmarquee" behavior="" direction="">
              {datamsg.marquee_msg}
            </marquee>
          )} */}
          <div className="container-fluid mt-2">
            {/* <div className="d-flex align-items-center justify-content-between"> */}
            <div className="width_50 d-flex chatbuttonnew justify-content-between">
              <button class="btn-hover color-8">
                <Link
                  to="/Depositchat"
                  className="d-flex align-items-center chatlinkdesign"
                >
                  <span class="chat-icon-home">
                    <img src={chaticonnew} />
                  </span>
                  {depositCountData == 0 ? (
                    // <span className="badge notibadge text-center bedgecustum">
                    //   <span>11</span>
                    // </span>
                    <></>
                  ) : (
                    <span className="badge notibadge text-center bedgecustum">
                      <span>{depositCountData}</span>
                    </span>
                  )}
                  <span className="chat_live"> Deposit Chat</span>
                </Link>
              </button>
              {/* <div>
                  <Link to="/Depositchat">
                    <span class="chat-icon-home">💬</span>
                    <span className="chatname">
                      {depositCountData == 0 ? (
                        // <span className="badge notibadge text-center bedgecustum">
                        //   <span>11</span>
                        // </span>
                        <></>
                      ) : (
                        <span className="badge notibadge text-center bedgecustum">
                          <span>{depositCountData}</span>
                        </span>
                      )}
                      Live Chat
                    </span>
                  </Link>

                </div> */}

              <button class="btn-hover color-8">
                <Link
                  to="/Withdrawalchat"
                  className="d-flex align-items-center chatlinkdesign"
                >
                  <span class="chat-icon-home">
                    <img src={chaticonnew} />
                  </span>
                  {withdrawCountData == 0 ? (
                    // <span className="badge notibadge text-center bedgecustum">
                    //   <span>11</span>
                    // </span>
                    <></>
                  ) : (
                    <span className="badge notibadge text-center bedgecustum">
                      <span>{withdrawCountData}</span>
                    </span>
                  )}
                  <span className="chat_live">Withdraw Chat</span>
                </Link>
              </button>
            </div>
            {/* <div className="width_20">
                <div className="logofront">
                  <img
                    src={logonew}
                    className="mx-auto d-flex justify-content-end"
                  />
                </div>
              </div> */}
            {/* <div className="width_50 d-flex chatbuttonnew"> */}
            {/* <button class="btn-hover color-8">
                  <Link
                    to={
                      marketdetails.current_market_details &&
                      marketdetails.current_market_details.other_game
                    }
                    target="_blank"
                    className="d-flex align-items-center chatlinkdesign"
                  >
                    <span class="chat-icon-home">
                      <img src={othergame} />
                    </span>
                    <span className="chat_live">Other Game</span>
                  </Link>
                </button> */}
            {/* <button class="btn-hover color-8">
                  <Link
                    onClick={refreshPage}
                    className="d-flex align-items-center chatlinkdesign"
                  >
                    <span class="chat-icon-home">
                      <img src={refresh} />
                    </span>
                    <span className="chat_live">Refresh</span>
                  </Link>
                </button> */}
            {/* </div> */}
            {/* </div> */}
          </div>
          {/* 
          <div className="card card-style cardbabaji">
            <div className="content">
              <center>
                <h6 className="mt-1">
                  &#128293; Matka Name &#128293;{" "}
                </h6>
                <h6> &#128591;  Matka Name &#128591; </h6>
              </center>
              <h6 className="d-flex justify-content-center">
                <span id="date">
                  {datamsg.nformat}
              
                  <date />
                </span>
              </h6>
            </div>
          </div> */}
          <div className="omcolor">
            <img src={om} alt={om} />
          </div>
          <div className="card card-style cardbabaji newdesignall">
            <div className="content">
              <center>
                <h6 className="mt-1">&#128293;ALL IS WELL &#128293; </h6>
                <h6> &#128591; GOD IS GREAT &#128591; </h6>
              </center>
              <h6 className="d-flex justify-content-center">
                <span id="date">
                  {datamsg.nformat}
                  {/* <div>{new Date(users.nformat).toLocaleDateString()}</div>
                  <div>{new Date(users.nformat).toLocaleTimeString()}</div> */}
                  <date />
                </span>
                {/* <span id="time">14:22</span> */}
              </h6>
            </div>
          </div>
          <div className="d-flex justify-content-center">
            <div class="animated-box todayresultdesign in mx-2">
              <div className="card card-style">
                <center>
                  {marketdetails && (
                    <div className="result position-relative align-items-center">
                      <div className="confetti">
                        <div className="confetti-piece"></div>
                        <div className="confetti-piece"></div>
                        <div className="confetti-piece"></div>
                        <div className="confetti-piece"></div>
                        <div className="confetti-piece"></div>
                        <div className="confetti-piece"></div>
                        <div className="confetti-piece"></div>
                        <div className="confetti-piece"></div>
                        <div className="confetti-piece"></div>
                        <div className="confetti-piece"></div>
                        <div className="confetti-piece"></div>
                        <div className="confetti-piece"></div>
                        <div className="confetti-piece"></div>
                      </div>
                      {/* <h5 className="resulttext">Result</h5> */}
                      <div className="resultimage">
                        <img src={result} alt="result" />
                      </div>
                      <div className="habhai">
                        हां भाई सबसे तेज और सबसे फास्ट रिजल्ट यही मिलता है
                      </div>
                      <h6>
                        <p className="fw-bold mb-1 bazarname">
                          {marketdetails.current_market_details &&
                            marketdetails.current_market_details.market_name}
                        </p>
                        <div className="d-flex justify-content-center align-items-center giffloader">
                          <img src={loaderimage} alt="loaderimage" />
                        </div>
                        <span className="bazarnamename">
                          {marketdetails.current_market_details &&
                            marketdetails.current_market_details.market_result}
                        </span>
                      </h6>
                    </div>
                  )}
                </center>
              </div>
            </div>
          </div>

          <div className="card text-center clickresult animated-box">
            <p className="mb-0">
              &#128293; सबसे पहले रिजल्ट देखने के लिए क्लिक करे &#128293;
            </p>
            <Link
              to="https://result.matkawaale.in"
              //  to="https://satta-king-fixed-no.in"
              className="clicklink"
              id="neonShadow"
            >
              Click Link
            </Link>
          </div>
          {/* <div className="card live-result">
            <p>
              <strong>Note</strong>
            </p>
            <p>{ReactHtmlParser(datamsg.note)}</p>
          </div> */}
          <div className="card matkalive-result">
            <p>Live Result of {marketdetails.current_date}</p>
          </div>
          {/* <table className="marketnametime">
            <thead>
              <tr>
                <td className="width_50">Market Name/Time</td>
                <td className="width_25">Previous Result</td>
                <td className="width_25 border-radius">Today Result</td>
              </tr>
            </thead>
          </table> */}
          <div className="flex_all_new">
            {usersdata &&
              usersdata.map((user) =>
                user.is_open == 1 ? (
                  <div
                    className="market"
                    onClick={() => {
                      handleClick(user.market_id, user.market_name);
                    }}
                  >
                    {/* <div className="market"> */}
                    <div className="marketdesign_new">
                      <div className="marketnamelist">
                        <h3 className="animationtittle markettitlename">
                          {user.market_name}
                        </h3>
                        <div className="timeallnewnew active"> {user.resultTime}</div>
                        <div className="d-flex justify-content-center marketresultnumber gap-2 align-items-center">
                          <div
                            className="text-center"
                            onClick={startCountdown}
                            disabled={isRunning}
                          >
                            {/* <Icon.ChevronRight /> */}
                            <h3 className="marketnumber">
                              {"{"}    {user.market_result_previous_day}{"}"}
                            </h3>
                          </div>
                          <div className="marketnumber"> {">"}</div>
                          <div
                            className="text-center"
                            onClick={startCountdown}
                            disabled={isRunning}
                          >
                            {/* <Icon.ChevronRight /> */}
                            <div className="d-flex justify-content-center align-items-center gap-2">
                              <h3 className="marketnumber">{"["}{user.market_result}{"]"}</h3>
                              <div className="giffimage">
                                <img src={newgiff} alt="newgiff" />
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* <ul className="liststyle">
                        <li>
                          <span className="opentime">Open Time</span>
                          <span className="d-block opentime">
                            {user.openTime}
                          </span>
                        </li>
                        <li>|</li>
                        <li>
                          <span className="opentime"> Close Time</span>
                          <span className="d-block opentime">
                            {user.closeTime}
                          </span>
                        </li>
                        <li>|</li>
                        <li>
                          <span className="opentime"> Result At</span>
                          <span className="d-block opentime">
                            {user.resultTime}
                          </span>
                        </li>
                      </ul> */}
                      </div>

                      {/* <div className="text-center playicon" onClick={startCountdown} disabled={isRunning}>
                  <Icon.ChevronRight />

                </div> */}
                    </div>
                  </div>
                ) : (
                  <div className="market">
                    {/* <div className="market"> */}
                    <div className="marketdesign_new">
                      <div className="marketnamelist">
                        <h3 className="animationtittle markettitlename">
                          {user.market_name}
                        </h3>
                        <div className="timeallnewnew"> {user.resultTime}</div>
                        <div className="d-flex justify-content-center marketresultnumber gap-2 align-items-center">
                          <div
                            className="text-center d-flex align-items-center gap-2"
                            onClick={startCountdown}
                            disabled={isRunning}
                          >
                            {/* <Icon.ChevronRight /> */}
                            <h3 className="mb-0 marketnumber">
                              {"{"}{user.market_result_previous_day}{"}"}
                            </h3>
                          </div>
                          <div className="marketnumber"> {">"}</div>

                          <div
                            className="text-center d-flex align-items-center gap-2"
                            onClick={startCountdown}
                            disabled={isRunning}
                          >
                            {/* <Icon.ChevronRight /> */}

                            <h3 className="mb-0 marketnumber">
                              {"["}  {user.market_result}{"]"}
                            </h3>
                          </div>
                        </div>
                        {/* <ul className="liststyle">
                        <li>
                          <span className="opentime"> Open Time</span>
                          <span className="d-block opentime">
                            {user.openTime}
                          </span>
                        </li>
                        <li>|</li>
                        <li>
                          <span className="opentime"> Close Time </span>
                          <span className="d-block opentime">
                            {user.closeTime}
                          </span>
                        </li>
                        <li>|</li>
                        <li>
                          <span className="opentime"> Result At</span>
                          <span className="d-block opentime">
                            {user.resultTime}
                          </span>
                        </li>
                      </ul> */}
                      </div>

                      {/* <div className="text-center playicon" onClick={startCountdown} disabled={isRunning}>
                  <Icon.ChevronRight />

                </div> */}
                    </div>
                  </div>
                )
              )}
          </div>

          <div className="marketTime" style={{ marginTop: 40 }}>
            <div className="title">PLAY ONLINE GAME</div>
            <div className="subtitle">इमानदारी हमारी विश्वास आपकी</div>
            <div className="name">Matkawale</div>
            <div className="mobile">📞{mobileNumber}</div>
            <div className="line" />
            <div className="games">
              {usersdata &&
                usersdata.map((user, index) => (
                  <div
                    key={user.market_id}
                    className={`game-row ${index % 2 === 0 ? "left" : "right"}`}
                  >
                    <span>
                      ➤ {user.market_name}
                      {user.is_open != 1 && " (Closed)"}
                    </span>
                    <span>{user.resultTime}</span>
                  </div>
                ))}
            </div>
            <div className="line" />
            <div className="rates">
              <div>JODI RATE – 100 के {jodiRate}</div>
              <div>HARUP RATE – 100 के {harapRate}</div>
            </div>
          </div>

          {/* <div className="pm-container">
            <div className="pm-border">
              <div className="pm-box">
                <p className="pm-text">
                  अब आप ऑनलाइन गेम इस एप्लीकेशन में खेल सकते हैं इसे डाउनलोड करने के लिए लिंक पर क्लिक करें
                </p>

                <p className="pm-title">{process.env.REACT_APP_API_URL}</p>
              </div>
            </div>
          </div> */}

        </div>
      </div>
    </>
  );
}
