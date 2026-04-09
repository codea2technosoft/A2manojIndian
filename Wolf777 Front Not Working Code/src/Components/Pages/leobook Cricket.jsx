import React, { useState, useEffect, useRef } from "react";
import $ from "jquery";
import Axios from "axios";
import Swal from "sweetalert2";
import loading from "../../assets/images/loading-gif.gif";
import { fetchwalletamount } from "../common";
// import io from 'socket.io-client';

function Cricket() {
  const iframeRef = useRef(null);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [togglebtn, setTogglebtn] = useState(false);
  const [data, setData] = useState([]);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [stackValue, setStackValue] = useState("");
  const [selectedname, setSelectedname] = useState("");
  const [showSection, setShowSection] = useState(false);
  const [fancydata, setFancyData] = useState([]);
  const [errors, setErrors] = useState({});
  const [selectedfid, setSelectedfid] = useState("");
  const [selectedEid, setSelectedEid] = useState("");
  const [selectedbettype, setSelectedbettype] = useState("");
  const [oddValue, setoddValue] = useState("");
  const [stackvaluetotal, setstackvaluetotal] = useState("");
  const [myBets, setMyBets] = useState([]);
  const [showBets, setShowBets] = useState(false);
  const [data1, setData1] = useState(null);
  // const [walletAmount, setWalletAmount] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  // const socket = io('http://127.0.0.1:4000');
  const [reloadPage, setReloadPage] = useState(false);
  const seriesId = localStorage.getItem("seriesId");
  const event_id = localStorage.getItem("event_id");
  const name = localStorage.getItem("name");
  const url = new URL(window.location.href);

  const idParam = url.searchParams.get("event_id");
  const nameParam = url.searchParams.get("name");
  const apiUrl = process.env.REACT_APP_API_URL;

  const [ipset, setIP] = useState();
  const getData = async () => {
    try {
      const response = await fetch("https://geolocation-db.com/json/");
      if (!response.ok) {
        throw new Error("Failed to fetch IP address");
      }
      const data = await response.json();
      setIP(data.IPv4);
      // alert(data.IPv4);
      localStorage.setItem("ipaddress", data.IPv4);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const toggleFullscreen = () => {
    if (iframeRef.current) {
      if (iframeRef.current.requestFullscreen) {
        iframeRef.current.requestFullscreen();
      } else if (iframeRef.current.mozRequestFullScreen) {
        iframeRef.current.mozRequestFullScreen();
      } else if (iframeRef.current.webkitRequestFullscreen) {
        iframeRef.current.webkitRequestFullscreen();
      } else if (iframeRef.current.msRequestFullscreen) {
        iframeRef.current.msRequestFullscreen();
      }
    }
  };

  useEffect(() => {
    $(document).ready(function () {
      $("#closebetbox").click(function () {
        $(".bettingbox").css("display", "none");
      });
    });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`https://leobookapi.a2logicgroup.com/api/v1/get-button-value`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setData(data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleButtonClick = (amount) => {
    setSelectedAmount(amount);
    setInputValue(amount);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  document.addEventListener("DOMContentLoaded", function () {
    const clickSpan = document.querySelector(".click-span");
    const betInput = document.querySelector(".bet-input");

    if (clickSpan && betInput) {
      clickSpan.addEventListener("click", () => {
        betInput.style.display =
          betInput.style.display === "none" || !betInput.style.display
            ? "block"
            : "none";
      });
    }
  });

  const handleValueClick1 = () => {
    setShowSection(false);
  };

  const handleValueClick = (
    value,
    name,
    fancy_id,
    event,
    betType,
    lay_line,
    lay_price
  ) => {
    const concatenatedFancyId = `${event_id}-${fancy_id}`;
    setStackValue(value);
    setSelectedname(name);
    setSelectedfid(concatenatedFancyId);
    setSelectedEid(event_id);
    setSelectedbettype(betType);
    setoddValue(lay_line);
    const formattedLayPrice = lay_price.toString().replace(/\.00$/, "");
    setstackvaluetotal(formattedLayPrice);
    setShowSection(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("event_id", event_id);

        const response = await fetch(
          `https://leobookapi.a2logicgroup.com/api/v1/get-fancy`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        const data = result.response.map((item) => ({
          RunnerName: item.name,
          LayPrice1: item.lay_price,
          LaySize1: item.lay_line,
          BackPrice1: item.back_price,
          BackSize1: item.back_line,
          GameStatus: item.fc_status,
          SelectionId: item.fancy_id,
          event_id: item.event_id,
        }));

        setFancyData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 2000);
    return () => clearInterval(intervalId);
  }, [event_id]);

  const onlyData = Array.isArray(fancydata)
    ? fancydata.filter(
        (item) => <></>
        //  item.RunnerName.includes('Only')
      )
    : [];
  const ballbyball = Array.isArray(fancydata)
    ? fancydata.filter(
        (item) => <></>
        // item.RunnerName.includes('.')
      )
    : [];
  const fetchdatamatch = Array.isArray(fancydata)
    ? fancydata.filter(
        (item) => <></>
        //  !item.RunnerName.includes('Only') && !item.RunnerName.includes('.')
      )
    : [];

  const fetchMyBetsData = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Token is missing");
      return;
    }

    const apiUrl = process.env.REACT_APP_API_URL;
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    fetch(`https://leobookapi.a2logicgroup.com/api/v1/my-bet`, {
      method: "GET",
      headers: headers,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status_code === 1) {
          setMyBets(data.data);
        } else {
          console.error("API request failed:", data.error_message);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const userid = localStorage.getItem("userid");

  const handlePlaceBet = async (e) => {
    // alert('opppppp');
    e.preventDefault();
    setIsButtonDisabled(true);
    setIsButtonVisible(false);
    setErrors({});

    if (!inputValue) {
      setErrors({ inputValue: "" });

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please enter an amount!",
        timer: 1000,
      });
      // setIsButtonVisible(false);
      return false;
    }

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("fancy_id", selectedfid);
    formData.append("betSlip_stake", inputValue);
    formData.append("betSlip_odds", oddValue);
    // formData.append('stake', '100');
    formData.append("bet_on", selectedbettype);
    formData.append("user_id", userid);
    formData.append("total", stackvaluetotal);
    formData.append("event_id", selectedEid);
    formData.append("team", selectedname);
    formData.append("sport_id", "4");

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    };

    try {
      const response = await Axios.post(
        `https://leobookapi.a2logicgroup.com/api/v1/place-session-bet`,
        formData,
        { headers }
      );

      console.log("API Response:", response.data);

      if (response.data.status_code === 1) {
        // Success case
        Swal.fire({
          icon: "success",
          title: "Success",
          text: response.data.message,

          showConfirmButton: false,
          timer: 1000,
        });
        fetchMyBetsData();
        fetchwalletamount();
        console.warn(response.data.exp);
        $(".expenseAmtt").html(" ");
        $(".expenseAmtt").html(response.data.exp);
        setShowSection(false);
      } else {
        // Error case
        Swal.fire({
          icon: "error",
          title: "Error",
          timer: 2000,
          text: response.data.error_message,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "API Error: " + error.message,
        timer: 1000,
      });

      console.error("API Error:", error);
    } finally {
      setTimeout(() => {
        setIsButtonDisabled(false);
        setIsButtonVisible(true);
      }, 2000);
    }
  };

  useEffect(() => {
    fetchMyBetsData();
    fetchwalletamount();
  }, []);
  useEffect(() => {
    getData();
  }, []);

  const toggleBets = () => {
    setShowBets(!showBets);
  };

  return (
    <>
      <div class="card-header tab_first d-flex displaynone_mobile">
        <div>
          <ul
            class="nav nav-tabs card-header-tabs"
            id="outerTab"
            role="tablist"
          >
            <li class="nav-item activetab">
              <a
                class="nav-link active"
                data-toggle="tab"
                href="#tab-1"
                aria-controls="tab-1"
                role="tab"
                aria-expanded="true"
              ></a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                data-toggle="tab"
                href="#tab-2"
                aria-controls="tab-2"
                role="tab"
              ></a>
            </li>
          </ul>
        </div>
      </div>

      <section>
        <main id="main" class="main">
          <div class="container-fluid">
            <div class="row dispaly-coloumre">
              <div class="col-md-8  padding_custom">
                <div class="card-body p-1 bg-dark heading_match">
                  <p class="p-0 text-dark">{nameParam}</p>
                </div>
                {/* <div style={{background:'#000000	'}}>
                  <iframe src={`https://score.onlyscore.live/Scorebord?id=${event_id}`} style={{ width: '100%', height: "181px" }} />
                </div> */}

                {/* <h5 className='text-center'><i>Comming Soon....</i></h5> */}
                {/* <div className="commingsoon">
                                      <img src={Grandslambro} className='img-fluid' />

                                    </div> */}
                <div class="card">
                  <div class="card-body p-0">
                    <div class="">
                      <div class="d-flex bg_theme justify-content-between align-items-center">
                        <div class="card-body p-1 bg_theme heading_match">
                          <p class="p-0 text-dark">Session Market</p>
                        </div>
                        <div class="dateandtime d-flex align-items-center">
                          <div class="information mr_5"></div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md-12 yesorno">
                          <div class="col-12 col-md-11"></div>
                        </div>

                        <div className="col-md-12">
                          <div className="fancy_box pt-0">
                            <table style={{ width: "100%" }}>
                              <thead>
                                <th className="sessionmarket text-dark">
                                  Session Market
                                </th>
                                <th>
                                  <div class="fancy-tripple">
                                    <div class="bet-table-row flex-nowrap d-flex">
                                      <div class="lay bl-title lay-title">
                                        No
                                      </div>
                                      <div class="back bl-title back-title">
                                        Yes
                                      </div>
                                    </div>
                                  </div>
                                </th>
                                <th></th>
                              </thead>
                              <tbody>
                                <>
                                  {ballbyball && ballbyball.length > 0 ? (
                                    ballbyball.map((item, index) => (
                                      <tr
                                        key={index}
                                        className="bg-secondary text-light"
                                      >
                                        <td style={{ width: "77%" }}>
                                          <div className="d-flex justify-content-between">
                                            <p className="cricketbet mb-0 d-flex justify-content-between w-100">
                                              {item.RunnerName}
                                              <small>{item.value}</small>
                                              <div className="information mr_5">
                                                {/* <i
                    className="fa-solid fa-circle-info"
                    data-bs-toggle="modal"
                    data-bs-target="#infomodel"
                  ></i> */}
                                              </div>
                                            </p>
                                          </div>
                                        </td>
                                        <td>
                                          {/* {(item.GameStatus === 'BALL_RUN' || item.GameStatus === 'Ball Running') ? ( */}
                                          <div className="d-flex overlay justify-content-between">
                                            <div className="betamount">
                                              <p className="btn-lay2">
                                                {parseFloat(item.LayPrice1)
                                                  .toFixed(2)
                                                  .replace(/\.00$/, "")}
                                                <br />
                                                <span className="text-danger">
                                                  {parseFloat(item.LaySize1)
                                                    .toFixed(2)
                                                    .replace(/\.00$/, "")}
                                                </span>
                                              </p>
                                            </div>
                                            <div className="betamount">
                                              <p className="btn-back2">
                                                {parseFloat(item.BackPrice1)
                                                  .toFixed(2)
                                                  .replace(/\.00$/, "")}
                                                <br />
                                                <span>
                                                  {parseFloat(item.BackSize1)
                                                    .toFixed(2)
                                                    .replace(/\.00$/, "")}
                                                </span>
                                              </p>
                                            </div>
                                          </div>
                                          {/* ) : null} */}
                                          {/* {item.GameStatus === '' ? ( */}
                                          <div className="d-flex overlay12 justify-content-between">
                                            <div
                                              className="betamount"
                                              onClick={() =>
                                                handleValueClick(
                                                  item.LayPrice1,
                                                  item.RunnerName,
                                                  item.SelectionId,
                                                  item.event_id,
                                                  "lay",
                                                  item.LaySize1,
                                                  item.LayPrice1
                                                )
                                              }
                                            >
                                              <p className="btn-lay2">
                                                {parseFloat(item.LayPrice1)
                                                  .toFixed(2)
                                                  .replace(/\.00$/, "")}
                                                <br />
                                                <span>
                                                  {parseFloat(item.LaySize1)
                                                    .toFixed(2)
                                                    .replace(/\.00$/, "")}
                                                </span>
                                              </p>
                                            </div>
                                            <div
                                              className="betamount"
                                              onClick={() =>
                                                handleValueClick(
                                                  item.BackPrice1,
                                                  item.RunnerName,
                                                  item.SelectionId,
                                                  item.event_id,
                                                  "back",
                                                  item.BackSize1,
                                                  item.BackPrice1
                                                )
                                              }
                                            >
                                              <p className="btn-back2">
                                                {parseFloat(item.BackPrice1)
                                                  .toFixed(2)
                                                  .replace(/\.00$/, "")}
                                                <br />
                                                <span>
                                                  {parseFloat(item.BackSize1)
                                                    .toFixed(2)
                                                    .replace(/\.00$/, "")}
                                                </span>
                                              </p>
                                            </div>
                                          </div>
                                          {/* ) : null} */}
                                          {/* {(item.GameStatus === 'SUSPEND' || item.GameStatus === 'SUSPENDED') ? ( */}
                                          <div className="d-flex overlay1 justify-content-between">
                                            <div className="betamount">
                                              <p className="btn-lay2">
                                                {parseFloat(item.LayPrice1)
                                                  .toFixed(2)
                                                  .replace(/\.00$/, "")}
                                                <br />
                                                <span>
                                                  {parseFloat(item.LaySize1)
                                                    .toFixed(2)
                                                    .replace(/\.00$/, "")}
                                                </span>
                                              </p>
                                            </div>
                                            <div className="betamount">
                                              <p className="btn-back2">
                                                {parseFloat(item.BackPrice1)
                                                  .toFixed(2)
                                                  .replace(/\.00$/, "")}
                                                <br />
                                                <span>
                                                  {parseFloat(item.BackSize1)
                                                    .toFixed(2)
                                                    .replace(/\.00$/, "")}
                                                </span>
                                              </p>
                                            </div>
                                          </div>
                                          {/* ) : null} */}
                                        </td>
                                        <td className="text-right w-100">
                                          <div className="d-flex justify-content-between margin-top-bottom align-items-center">
                                            <p className="mx-2 betamt"></p>
                                            {/* <p className="mx-2 betamt"><span>Bet Amt</span> {inputValue}</p> */}
                                            <div className="maxvalue">
                                              <span>max:0</span>
                                              <span>mkt:0</span>
                                            </div>
                                          </div>
                                        </td>
                                      </tr>
                                    ))
                                  ) : (
                                    <p className="d-flex justify-content-center">
                                      <img
                                        src={loading}
                                        width={40}
                                        height={40}
                                        className="px-2 loaderfile"
                                      />
                                    </p>
                                  )}
                                </>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div class="col-md-6 yesorno"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="card">
                  <div class="card-body p-0">
                    <div class="">
                      <div class="d-flex bg_theme justify-content-between align-items-center">
                        <div class="card-body p-1 bg_theme heading_match">
                          <p class="p-0 text-dark">
                            Over by Over Session Market
                          </p>
                        </div>
                        <div class="dateandtime d-flex align-items-center">
                          <div class="information mr_5"></div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md-12 yesorno">
                          <div class="col-12 col-md-11"></div>
                        </div>

                        <div className="col-md-12">
                          <div className="fancy_box pt-0">
                            <table style={{ width: "100%" }}>
                              <thead>
                                <th className="sessionmarket text-dark">
                                  Session Market
                                </th>
                                <th>
                                  <div class="fancy-tripple">
                                    <div class="bet-table-row flex-nowrap d-flex">
                                      <div class="lay bl-title lay-title">
                                        No
                                      </div>
                                      <div class="back bl-title back-title">
                                        Yes
                                      </div>
                                    </div>
                                  </div>
                                </th>
                                <th></th>
                              </thead>
                              <tbody>
                                <>
                                  {onlyData && onlyData.length > 0 ? (
                                    onlyData.map((item, index) => (
                                      <tr>
                                        <td style={{ width: "77%" }}>
                                          <div className="d-flex  justify-content-between">
                                            <p className="cricketbet mb-0 d-flex justify-content-between w-100">
                                              {item.RunnerName}
                                              <small>{item.value}</small>
                                              <div class="information mr_5">
                                                {/* <i
                                                  class="fa-solid fa-circle-info "
                                                  data-bs-toggle="modal"
                                                  data-bs-target="#infomodel"
                                                ></i> */}
                                              </div>
                                            </p>
                                          </div>
                                        </td>
                                        <td>
                                          {item.GameStatus === "BALL_RUN" ||
                                          item.GameStatus === "Ball Running" ? (
                                            <div className="d-flex overlay justify-content-between">
                                              <div className="betamount ">
                                                <p className="btn-lay2">
                                                  {parseFloat(item.LayPrice1)
                                                    .toFixed(2)
                                                    .replace(/\.00$/, "")}
                                                  <br></br>
                                                  <span>
                                                    {parseFloat(item.LaySize1)
                                                      .toFixed(2)
                                                      .replace(/\.00$/, "")}
                                                  </span>
                                                </p>
                                              </div>
                                              <div className="betamount">
                                                <p className="btn-back2">
                                                  {parseFloat(item.BackPrice1)
                                                    .toFixed(2)
                                                    .replace(/\.00$/, "")}
                                                  <br></br>
                                                  <span>
                                                    {parseFloat(item.BackSize1)
                                                      .toFixed(2)
                                                      .replace(/\.00$/, "")}
                                                  </span>
                                                </p>
                                              </div>
                                            </div>
                                          ) : null}
                                          {item.GameStatus === "" ? (
                                            <div className="d-flex overlay12 justify-content-between">
                                              <div
                                                className="betamount"
                                                onClick={() =>
                                                  handleValueClick(
                                                    item.LayPrice1,
                                                    item.RunnerName,
                                                    item.SelectionId,
                                                    item.event_id,
                                                    "lay",
                                                    item.LaySize1,
                                                    item.LayPrice1
                                                  )
                                                }
                                              >
                                                <p className="btn-lay2">
                                                  {parseFloat(item.LayPrice1)
                                                    .toFixed(2)
                                                    .replace(/\.00$/, "")}
                                                  <br></br>
                                                  <span>
                                                    {parseFloat(item.LaySize1)
                                                      .toFixed(2)
                                                      .replace(/\.00$/, "")}
                                                  </span>
                                                </p>
                                              </div>
                                              <div
                                                className="betamount"
                                                onClick={() =>
                                                  handleValueClick(
                                                    item.BackPrice1,
                                                    item.RunnerName,
                                                    item.SelectionId,
                                                    item.event_id,
                                                    "back",
                                                    item.BackSize1,
                                                    item.BackPrice1
                                                  )
                                                }
                                              >
                                                <p className="btn-back2">
                                                  {parseFloat(item.BackPrice1)
                                                    .toFixed(2)
                                                    .replace(/\.00$/, "")}
                                                  <br></br>
                                                  <span>
                                                    {parseFloat(item.BackSize1)
                                                      .toFixed(2)
                                                      .replace(/\.00$/, "")}
                                                  </span>
                                                </p>
                                              </div>
                                            </div>
                                          ) : null}
                                          {item.GameStatus === "SUSPEND" ||
                                          item.GameStatus === "SUSPENDED" ? (
                                            <div className="d-flex overlay1 justify-content-between">
                                              <div className="betamount ">
                                                <p className="btn-lay2">
                                                  {parseFloat(item.LayPrice1)
                                                    .toFixed(2)
                                                    .replace(/\.00$/, "")}
                                                  <br></br>
                                                  <span>
                                                    {parseFloat(item.LaySize1)
                                                      .toFixed(2)
                                                      .replace(/\.00$/, "")}
                                                  </span>
                                                </p>
                                              </div>
                                              <div className="betamount">
                                                <p className="btn-back2">
                                                  {parseFloat(item.BackPrice1)
                                                    .toFixed(2)
                                                    .replace(/\.00$/, "")}
                                                  <br></br>
                                                  <span>
                                                    {parseFloat(item.BackSize1)
                                                      .toFixed(2)
                                                      .replace(/\.00$/, "")}
                                                  </span>
                                                </p>
                                              </div>
                                            </div>
                                          ) : null}
                                        </td>
                                        <td className=" text-right w-100">
                                          <div className="d-flex justify-content-between margin-top-bottom algin-items-center">
                                            <p className="mx-2 betamt"></p>
                                            {/* <p className='mx-2 betamt'><span>Bet Amt</span> {inputValue}</p> */}
                                            <div className="maxvalue">
                                              <span>max:0</span>
                                              <span>mkt:0</span>
                                            </div>
                                          </div>
                                        </td>
                                      </tr>
                                    ))
                                  ) : (
                                    <p className="d-flex justify-content-center">
                                      <img
                                        src={loading}
                                        width={40}
                                        height={40}
                                        className="px-2 loaderfile"
                                      />
                                    </p>
                                  )}
                                </>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div class="col-md-6 yesorno"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="card">
                  <div class="card-body p-0">
                    <div class="">
                      <div class="d-flex bg_theme justify-content-between align-items-center">
                        <div class="card-body p-1 bg_theme heading_match">
                          <p class="p-0 text-dark">
                            Ball By Ball Session Market
                          </p>
                        </div>
                        <div class="dateandtime d-flex align-items-center">
                          <div class="information mr_5"></div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md-12 yesorno">
                          <div class="col-12 col-md-11"></div>
                        </div>

                        <div className="col-md-12">
                          <div className="fancy_box pt-0">
                            <table style={{ width: "100%" }}>
                              <thead>
                                <th className="sessionmarket text-dark">
                                  Session Market
                                </th>
                                <th>
                                  <div class="fancy-tripple">
                                    <div class="bet-table-row flex-nowrap d-flex">
                                      <div class="lay bl-title lay-title">
                                        No
                                      </div>
                                      <div class="back bl-title back-title">
                                        Yes
                                      </div>
                                    </div>
                                  </div>
                                </th>
                                <th></th>
                              </thead>
                              <tbody>
                                <>
                                  {fancydata && fancydata.length > 0 ? (
                                    fancydata.map((item, index) => (
                                      <tr>
                                        <td style={{ width: "77%" }}>
                                          <div className="d-flex  justify-content-between">
                                            <p className="cricketbet mb-0 d-flex justify-content-between w-100">
                                              {item.RunnerName}
                                              <small>{item.value}</small>
                                              <div class="information mr_5">
                                                {/* <i
                                                  class="fa-solid fa-circle-info "
                                                  data-bs-toggle="modal"
                                                  data-bs-target="#infomodel"
                                                ></i> */}
                                              </div>
                                            </p>
                                          </div>
                                        </td>
                                        <td>
                                          {item.GameStatus === "BALL_RUN" ||
                                          item.GameStatus === "Ball Running" ? (
                                            <div className="d-flex overlay justify-content-between">
                                              <div className="betamount ">
                                                <p className="btn-lay2">
                                                  {parseFloat(item.LayPrice1)
                                                    .toFixed(2)
                                                    .replace(/\.00$/, "")}
                                                  <br></br>
                                                  <span>
                                                    {parseFloat(item.LaySize1)
                                                      .toFixed(2)
                                                      .replace(/\.00$/, "")}
                                                  </span>
                                                </p>
                                              </div>
                                              <div className="betamount">
                                                <p className="btn-back2">
                                                  {parseFloat(item.BackPrice1)
                                                    .toFixed(2)
                                                    .replace(/\.00$/, "")}
                                                  <br></br>
                                                  <span>
                                                    {parseFloat(item.BackSize1)
                                                      .toFixed(2)
                                                      .replace(/\.00$/, "")}
                                                  </span>
                                                </p>
                                              </div>
                                            </div>
                                          ) : null}
                                          {item.GameStatus === "" ? (
                                            <div className="d-flex overlay12 justify-content-between">
                                              <div
                                                className="betamount"
                                                onClick={() =>
                                                  handleValueClick(
                                                    item.LayPrice1,
                                                    item.RunnerName,
                                                    item.SelectionId,
                                                    item.event_id,
                                                    "lay",
                                                    item.LaySize1,
                                                    item.LayPrice1
                                                  )
                                                }
                                              >
                                                <p className="btn-lay2">
                                                  {parseFloat(item.LayPrice1)
                                                    .toFixed(2)
                                                    .replace(/\.00$/, "")}
                                                  <br></br>
                                                  <span>
                                                    {parseFloat(item.LaySize1)
                                                      .toFixed(2)
                                                      .replace(/\.00$/, "")}
                                                  </span>
                                                </p>
                                              </div>
                                              <div
                                                className="betamount"
                                                onClick={() =>
                                                  handleValueClick(
                                                    item.BackPrice1,
                                                    item.RunnerName,
                                                    item.SelectionId,
                                                    item.event_id,
                                                    "back",
                                                    item.BackSize1,
                                                    item.BackPrice1
                                                  )
                                                }
                                              >
                                                <p className="btn-back2">
                                                  {parseFloat(item.BackPrice1)
                                                    .toFixed(2)
                                                    .replace(/\.00$/, "")}
                                                  <br></br>
                                                  <span>
                                                    {parseFloat(item.BackSize1)
                                                      .toFixed(2)
                                                      .replace(/\.00$/, "")}
                                                  </span>
                                                </p>
                                              </div>
                                            </div>
                                          ) : null}
                                          {item.GameStatus === "SUSPEND" ||
                                          item.GameStatus === "SUSPENDED" ? (
                                            <div className="d-flex overlay1 justify-content-between">
                                              <div className="betamount ">
                                                <p className="btn-lay2">
                                                  {parseFloat(item.LayPrice1)
                                                    .toFixed(2)
                                                    .replace(/\.00$/, "")}
                                                  <br></br>
                                                  <span>
                                                    {parseFloat(item.LaySize1)
                                                      .toFixed(2)
                                                      .replace(/\.00$/, "")}
                                                  </span>
                                                </p>
                                              </div>
                                              <div className="betamount">
                                                <p className="btn-back2">
                                                  {parseFloat(item.BackPrice1)
                                                    .toFixed(2)
                                                    .replace(/\.00$/, "")}
                                                  <br></br>
                                                  <span>
                                                    {parseFloat(item.BackSize1)
                                                      .toFixed(2)
                                                      .replace(/\.00$/, "")}
                                                  </span>
                                                </p>
                                              </div>
                                            </div>
                                          ) : null}
                                        </td>
                                        <td className=" text-right w-100">
                                          <div className="d-flex justify-content-between margin-top-bottom algin-items-center">
                                            <p className="mx-2 betamt"></p>
                                            {/* <p className='mx-2 betamt'><span>Bet Amt</span> {inputValue}</p> */}
                                            <div className="maxvalue">
                                              <span>max:0</span>
                                              <span>mkt:0</span>
                                            </div>
                                          </div>
                                        </td>
                                      </tr>
                                    ))
                                  ) : (
                                    <p className="d-flex justify-content-center">
                                      <img
                                        src={loading}
                                        width={40}
                                        height={40}
                                        className="px-2 loaderfile"
                                      />
                                    </p>
                                  )}
                                </>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div class="col-md-6 yesorno"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-4  padding_custom">
                <div class="width-sidebar">
                  <div className="live bg_theme p-1">
                    <div className="d-flex justify-content-between">
                      <div>Live Match</div>
                      <div className="">
                        <button
                          className="btn_tv"
                          onClick={() => setTogglebtn(!togglebtn)}
                        >
                          <i className="fa-solid fa-desktop"></i>Watch Live
                        </button>
                        <button className="btn_tv" onClick={toggleFullscreen}>
                          <i className="fa-solid fa-expand"></i>Fullscreen
                        </button>
                      </div>
                    </div>
                    {togglebtn ? (
                      <div className="matchtv">
                        <iframe
                          src={`https://sqmrtv.in/btv.php?eventId=${event_id}`}
                          // src={`https://dpmatka.in/dcasino/sslife.php?MatchID=${event_id}`}
                          // src={`https://ss247.life/api/d6cd1f332f6248f5544395e0b70f9471/Nstreamapi.php?chid=1027&ip=2024-05-29T13:21:02.378Z`}
                          // src={`https://ss247.life/api/d6cd1f332f6248f5544395e0b70f9471/Nstreamapi.php?chid=1027&ip=${ipset}`}
                          // https://ss247.life/api/d6cd1f332f6248f5544395e0b70f9471/Nstreamapi.php?chid=1027&ip=2024-04-20 07:30:29
                          // https://ss247.life/da39bc2d-fdd7-4b47-9a5d-9f73df51ddf7
                          // https://ss247.life/api/d6cd1f332f6248f5544395e0b70f9471/Nstreamapi.php?chid=1027
                          // https://dtv.diamondapi.uk/tv/index.html?eventId=32673333
                          // https://sqmrtv.in/btv.php?eventId=32625126
                          //</div> <iframe src=" https://sqmrtv.in/btv.php?eventId=32625126 " width={100} height={100}>
                          //</iframe>
                          width={640}
                          height={400}
                          controls
                          ref={iframeRef}
                        ></iframe>
                      </div>
                    ) : null}
                  </div>
                  <div class="live bg_theme p-1 margint-2">
                    <div>PlaceBet</div>
                    <div className="mobilenonebet">
                      {showSection && (
                        <div class="bettingbox ">
                          <div class="bet_box">
                            <div class="bet-slip-box">
                              <div class="bet-slip">
                                <div class="bet-nation d-flex justify-content-between">
                                  <span>Match Name</span>
                                  <a
                                    href="#"
                                    class="close-bet float-right"
                                    id="closebetbox"
                                    onClick={handleValueClick1}
                                  >
                                    <i class="fa-solid fa-xmark text-dark"></i>
                                  </a>
                                </div>
                                <div class="match-result">Normal</div>
                                <div class="bet-team">
                                  <span
                                    title="1 to 100 Balls Runs OI(OI vs TR)adv 100 "
                                    class="bet-team-name"
                                  >
                                    {selectedname}
                                  </span>
                                  <span class="float-right">157</span>
                                </div>
                              </div>
                              <div className="d-flex">
                                <div>
                                  <input
                                    style={{ display: "flex" }}
                                    type="text"
                                    id="pressed"
                                    placeholder="select value"
                                    value={stackvaluetotal}
                                    maxLength="9"
                                    onChange={(e) =>
                                      setStackValue(e.target.value)
                                    }
                                    className="form-control"
                                  />
                                </div>
                                <div class="bet-input lay-border">
                                  <input
                                    type="text"
                                    id="pressed"
                                    value={inputValue}
                                    onChange={handleInputChange}
                                    maxLength="9"
                                    placeholder="Amount"
                                    class={`form-control ${
                                      errors.inputValue ? "is-invalid" : ""
                                    }`}
                                  />
                                  {errors.inputValue && (
                                    <div className="invalid-feedback">
                                      {errors.inputValue}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {data.length > 0 && (
                                <div className="bet-buttons">
                                  {data.map((value, index) => (
                                    <button
                                      key={index}
                                      className="btn btn-primary"
                                      type="button"
                                      onClick={() => handleButtonClick(value)}
                                    >
                                      <span className="valueamount">
                                        {value}
                                      </span>
                                    </button>
                                  ))}
                                </div>
                              )}

                              <div class="place-bet-btn">
                                <button
                                  className="btn btn-success placebet btn-block"
                                  onClick={handlePlaceBet}
                                  disabled={isButtonDisabled}
                                >
                                  <span>Place bet</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div class="live bg_theme p-1 margint-2">
                    <div
                      class="d-flex justify-content-between"
                      onClick={toggleBets}
                    >
                      <div>My Bet ({myBets.length})</div>
                    </div>
                    {showBets && (
                      <div class="d-flex justify-content-between bg_matched">
                        <table className="table tablematchbet matchoddbet">
                          <thead>
                            <th>Nation</th>
                            <th>Odd</th>
                            <th>Amount</th>
                          </thead>
                          <tbody>
                            {myBets.map((bet) => (
                              <tr
                                key={bet.id}
                                className={
                                  bet.bet_on === "lay"
                                    ? "laybet"
                                    : bet.bet_on === "back"
                                    ? "backbet"
                                    : ""
                                }
                              >
                                <td>
                                  {bet.team} / {bet.total}
                                </td>
                                <td>{bet.odd}</td>
                                <td>{bet.stake}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </section>
      <section className="mobileshow">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div class="live  p-1 margint-2">
                {showSection && (
                  <div class="bettingbox">
                    <div class="bet_box">
                      <div class="bet-slip-box">
                        <div class="bet-slip">
                          <div class="bet-nation d-flex justify-content-between">
                            <span>Match Name</span>
                            <a
                              href="#"
                              class="close-bet float-right"
                              id="closebetbox"
                              onClick={handleValueClick1}
                            >
                              <i class="fa-solid fa-xmark text-dark"></i>
                            </a>
                          </div>
                          <div class="match-result">Normal</div>
                          <div class="bet-team">
                            <span
                              title="1 to 100 Balls Runs OI(OI vs TR)adv 100 "
                              class="bet-team-name"
                            >
                              {selectedname}
                            </span>
                            <span class="float-right">157</span>
                          </div>
                        </div>
                        <div className="d-flex">
                          <div>
                            <input
                              style={{ display: "flex" }}
                              type="text"
                              id="pressed"
                              placeholder="select value"
                              value={stackvaluetotal}
                              maxLength="9"
                              onChange={(e) => setStackValue(e.target.value)}
                              className="form-control"
                            />
                          </div>
                          <div class="bet-input lay-border">
                            <input
                              type="text"
                              id="pressed"
                              value={inputValue}
                              onChange={handleInputChange}
                              maxLength="9"
                              placeholder="Amount"
                              class={`form-control ${
                                errors.inputValue ? "is-invalid" : ""
                              }`}
                            />
                            {errors.inputValue && (
                              <div className="invalid-feedback">
                                {errors.inputValue}
                              </div>
                            )}
                          </div>
                        </div>

                        {data.length > 0 && (
                          <div className="bet-buttons">
                            {data.map((value, index) => (
                              <button
                                key={index}
                                className="btn btn-primary"
                                type="button"
                                onClick={() => handleButtonClick(value)}
                              >
                                <span className="valueamount">{value}</span>
                              </button>
                            ))}
                          </div>
                        )}

                        {isButtonVisible ? (
                          <div className="place-bet-btn">
                            <button
                              className="btn btn-success placebet btn-block"
                              onClick={handlePlaceBet}
                              disabled={isButtonDisabled}
                            >
                              <span>Place bet</span>
                            </button>
                          </div>
                        ) : (
                          <p className="d-flex justify-content-center">
                            <img
                              src={loading}
                              width={40}
                              height={40}
                              className="px-2 loaderfile"
                            />
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Cricket;
