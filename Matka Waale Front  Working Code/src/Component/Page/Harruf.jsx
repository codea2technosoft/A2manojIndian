import React, { useState, useRef, useEffect } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Col, Row, Form, Input } from "antd";
import { toast } from "react-toastify";
import loading from "../../assets/img/loading-gif.gif";
import filesearch from "../../assets/img/filesearch.png";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import $ from "jquery";
import { useNavigate } from "react-router-dom";
import { fail } from "assert";
import { Spinner } from "react-bootstrap";

const url = new URL(window.location.href);
const gameid = url.searchParams.get("id");
const url1 = new URL(window.location.href);
const name = url1.searchParams.get("name");

export default function Harruf() {
  const blockInvalidChar = (e) => {
    const invalidKeys = ["e", "E", "+", "-", "."];

    if (
      invalidKeys.includes(e.key) ||
      (e.key === "." && e.target.value.includes("."))
    ) {
      e.preventDefault();
    }
  };
  const numbers = [111, 222, 333, 444, 555, 666, 777, 888, 999, "000"];
  const [andarHarufValues, setAndarHarufValues] = useState({});
  const navigate = useNavigate();
  const [baharHarufValues, setBaharHarufValues] = useState({});
  const [users1, setUsers1] = useState([]);
  const [users, setUsers] = useState([]);
  const [areCombinationsGenerated, setAreCombinationsGenerated] =
    useState(false);
  const [Deposit, setDeposit] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [appmanagerdata, setAppmanager] = useState(null);
  const [minredeem, setMinredeem] = useState(null);
  const [setminibet1, setMinibet] = useState([]);
  const [MaxbetAmt1, setMaxbet] = useState([]);
  const [Maxpoints, setMaxpoints] = useState([]);
  const [RandNUmberBat, setRandNUmberBat] = useState([]);
  const [showSubmitButton, setShowSubmitButton] = useState(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const isButtonLoading = useRef(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [loadingbutton, setLoadingbutton] = useState(false);

  const [loading2, setLoading2] = useState(false);

  useEffect(() => {
    loaduser();
    app_manager();
    var rString = randomString(
      32,
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    );
    setRandNUmberBat(rString);
  }, []);
  function randomString(length, chars) {
    var result = "";
    for (var i = length; i > 0; --i)
      result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const app_manager = async () => {
    const user_id = localStorage.getItem("userid");
    const dev_id = localStorage.getItem("dev_id");

    try {
      let url = `${process.env.REACT_APP_API_URL_NODE}app-manager`;
      const requestData = {
        app_id: process.env.REACT_APP_API_ID,
        user_id: user_id,
        dev_id: dev_id,
      };

      const config = {
        method: "POST",
        url: url,
        headers: {
          "Content-Type": "application/json",
        },
        data: requestData,
      };
      try {
        const response = await axios(config);
        var jodi_maxbet = response.data.data.jodi_max;
        var jodi_minbet = response.data.data.jodi_min;
        // console.warn(min_redeem)

        setMinibet(jodi_minbet);
        setMaxbet(jodi_maxbet);

        const res = JSON.stringify(response.data.data);
        const objectRes = JSON.parse(res);
        setAppmanager(objectRes);
        setIsLoading(false);
        setUsers(objectRes);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      setIsLoading(false);
    }
  };
  const loaduser = async () => {
    // setLoading(true);
    const user_id = localStorage.getItem("userid");
    const dev_id = localStorage.getItem("dev_id");
    // alert(dev_id);
    try {
      let url = `${process.env.REACT_APP_API_URL_NODE}get-numtable-list`;
      const requestData = {
        app_id: process.env.REACT_APP_API_ID,
        user_id: user_id,
        dev_id: dev_id,
        market_id: gameid,
      };

      const config = {
        method: "POST",
        url: url,
        headers: {
          "Content-Type": "application/json",
        },
        data: requestData,
      };
      const response = await axios(config);
      // .then(function (response) {
      var setmininumbet = response.data.mini_bet;
      var setmax_betnumbet = response.data.max_bet;
      var setpoints = response.data.points;

      setMaxpoints(setpoints);
      // console.warn(setpoints)
      const res = JSON.stringify(response.data);
      const objectRes = JSON.parse(res);
      setUsers1(objectRes);
      // console.warn(objectRes);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      // setLoading(false);
    }
  };
  useEffect(() => {
    const andarValuesNotEmpty = Object.values(andarHarufValues).some(
      (value) => value !== ""
    );
    const baharValuesNotEmpty = Object.values(baharHarufValues).some(
      (value) => value !== ""
    );
    setAreCombinationsGenerated(andarValuesNotEmpty || baharValuesNotEmpty);
  }, [andarHarufValues, baharHarufValues]);
  const [inputValues, setInputValues] = useState([]);
  // const [myArray, setMyArray] = useState([]);
  const handleAndarHarufChange = (number, value, type, uniquue) => {
    if (value != "") {
      const betkeyDigit = Math.abs(number % 10);
      const newInputValues = {};
      newInputValues["betkey"] = betkeyDigit.toString();
      newInputValues["betamount"] = value;
      newInputValues["bettype"] = type;
      newInputValues["crossing"] = "no";
      newInputValues["chkunique"] = uniquue + number;
      newInputValues["chkunique"] = uniquue + number;
      setInputValues([...inputValues, newInputValues]);
    }
  };
  const handleAndarHarufChange1 = (number, value) => {
    setAndarHarufValues((prevState) => ({
      ...prevState,
      [number]: value,
    }));
    setAreCombinationsGenerated(true);
  };
  const handleBaharHarufChange = (number, value) => {
    setBaharHarufValues((prevState) => ({
      ...prevState,
      [number]: value,
    }));
    setAreCombinationsGenerated(true);
  };

  const calculateTotalPoints = () => {
    let totalPoints = 0;

    Object.values(andarHarufValues).forEach((value) => {
      totalPoints += parseInt(value, 10) || 0;
    });

    Object.values(baharHarufValues).forEach((value) => {
      totalPoints += parseInt(value, 10) || 0;
    });

    return totalPoints;
  };
  // const clearInputValues = () => {
  //   setBaharHarufValues(''); // Pass an empty string directly
  //   setAndarHarufValues(''); // Pass an empty string directly
  // };

  // const handlePlaceBet = () => {
  //   clearInputValues();
  //   playGameharruf();
  // };

  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const intervalRef = useRef(null);

  const handleClicksend = () => {
    if (!isButtonClicked) {
      setIsButtonClicked(true);
      playGameharruf();

      // Clear previous interval
      clearInterval(intervalRef.current);

      // Set a new interval to reset isButtonClicked after 3 seconds
      intervalRef.current = setInterval(() => {
        clearInterval(intervalRef.current);
        setIsButtonClicked(false);
      }, 3000);
    }
  };

  const playGameharruf = async () => {
    setIsButtonDisabled(true);
    const reversedArray = [...inputValues].reverse();
    const filterUniqueByKey = (arr, key) => {
      const uniqueMap = new Map();

      // Process array in reverse order to keep the last entry for each key
      for (let i = arr.length - 1; i >= 0; i--) {
        const item = arr[i];
        uniqueMap.set(item[key], item);
      }

      const uniqueArray = Array.from(uniqueMap.values());
      return uniqueArray.reverse();
    };

    // Filter unique data based on the 'id' key
    const uniqueDataFiltered = filterUniqueByKey(reversedArray, "chkunique");

    // return;
    var totalPoints = calculateTotalPoints();
    if (users1.points < totalPoints) {
      const MySwal = withReactContent(Swal);
      MySwal.fire({
        title: "You Dont Have Sufficient Balance",
        timer: 2000,
        icon: "error",
      });
      return;
    }
    const user_id = localStorage.getItem("userid");
    const dev_id = localStorage.getItem("dev_id");
    // const token = localStorage.getItem("token");

    const miniBet = parseFloat(appmanagerdata.HarufMin);
    const maxBet = parseFloat(appmanagerdata.HarufMax);
    let isValidBet = true;

    if (!isValidBet) {
      return;
    }
    var totalPoints = calculateTotalPoints();
    if (users1.points < totalPoints) {
      const MySwal = withReactContent(Swal);
      MySwal.fire({
        title: "You Dont Have Sufficient Balance",
        timer: 2000,
        icon: "error",
      });
      return;
    }
    // setIsButtonVisible(false);
    // if (!isButtonLoading.current) {
    //   isButtonLoading.current = true;
    //   setIsButtonDisabled(true);
    //   setTimeout(() => {
    //     setIsButtonDisabled(false);
    //     isButtonLoading.current = false;
    //   }, 1000);
    // }
    try {
      setLoadingbutton(true);
      // setLoading2(true);

      let url = `${process.env.REACT_APP_API_URL_NODE}bat-place`;
      const requestData = {
        user_id: user_id,
        dev_id: dev_id,
        market_id: gameid,
        app_id: process.env.REACT_APP_API_ID,
        // BetList: [{ betkey:betkey, betamount:betamount, session_name:"open" }],
        BetList: uniqueDataFiltered,
        // token: token,
        betamount: totalPoints,
        batuniqueid: RandNUmberBat,
        market_name: gameid,
        dev_model: "web",
        // betamount: 5,
        btype: "harruf",
        devName: "sumsang",
        session: "close",
        bettype: 2,
        // btype: "crossing",
      };

      const config = {
        method: "POST",
        url: url,
        headers: {
          "Content-Type": "application/json",
        },
        data: requestData,
      };
      try {
        const response = await axios(config);
        if (response.data.success == 1) {
          // setTimeout(() => {
          // setLoading2(false);
          // setIsButtonDisabled(true);

          // const MySwal = withReactContent(Swal)
          // MySwal.fire({
          //   title: response.data.message,
          //   icon: 'success',
          //   timer: 2500
          // })
          //   .then((result) => {
          //     navigate('/Home');
          //   })

          localStorage.setItem("marketName", response.data.game_name);
          localStorage.setItem("total_amount", response.data.total_amount);
          localStorage.setItem("play_date", response.data.play_date);
          localStorage.setItem("date_time", response.data.date_time);
          localStorage.setItem("txn_id", response.data.txn_id);
          localStorage.setItem("bets", JSON.stringify(response.data.BetList));
          navigate("/GameSuccess");
        } else {
          // setIsButtonDisabled(false);
          toast.error(response.data.message);
          // navigate(0)
          return;
        }
      } catch (error) {
        console.error("Error:", error);
      }
      // return;
    } catch (error) {
      console.error("Game store:", error);
      toast.error(
        "An error occurred while Game store. Please try again later."
      );
    } finally {
      setLoadingbutton(false);
    }
    // setLoading2(true);
  };
  const [arrayToSend, setArrayToSend] = useState([1, 2, 3, 4, 5]);
  return (
    <>
      <section id="harruf">
        <div className="d-flex justify-content-between px-3">
          <div className="points">
            <h5>
              Points Remaining :{" "}
              {Math.max(0, users1.points) - calculateTotalPoints()}
            </h5>
          </div>
          <div className="points">
            <h5>Points Added</h5>
            <p>{calculateTotalPoints()}</p>
          </div>
        </div>
        <div className="andarharuf">
          <p className="gametitle ">Andar Haruf</p>
          <div className="d-flex flex-wrap justify-content-between">
            {numbers.map((number) => (
              <div key={number} className="cardview">
                <div
                  className={`number ${
                    andarHarufValues[number] ? "green" : ""
                  }`}
                >
                  {number}
                </div>
                {/* <input type="number" className='form-input' onChange={e => handleAndarHarufChange(number, e.target.value)} autoFocus /> */}
                <input
                  className="form-input"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  onPaste={(e) => {
                    e.preventDefault();
                    const pastedText = e.clipboardData
                      .getData("text/plain")
                      .replace(/[^0-9]/g, "")
                      .slice(0, 2);
                    document.execCommand("insertText", false, pastedText);
                  }}
                  onChange={(e) => {
                    const inputValue = e.target.value
                      .replace(/[^0-9]/g, "")
                      .slice(0, 4);
                    handleAndarHarufChange1(number, inputValue, 8);
                  }}
                  onInput={(e) => {
                    const inputValue = e.target.value
                      .replace(/[^0-9]/g, "")
                      .slice(0, 4);
                    e.target.value = inputValue; // Ensure the input value is updated
                    handleAndarHarufChange1(number, inputValue, 8);
                  }}
                  onBlur={(e) => {
                    const inputValue = e.target.value
                      .replace(/[^0-9]/g, "")
                      .slice(0, 4);
                    e.target.value = inputValue; // Ensure the input value is updated
                    handleAndarHarufChange(number, inputValue, 2, "A");
                  }}
                  autoFocus
                />
              </div>
            ))}
          </div>
        </div>

        <div className="andarharuf mt-3">
          <p className="gametitle">Bahar Haruf</p>
          <div className="d-flex flex-wrap justify-content-between">
            {numbers.map((number) => (
              <div key={number} className="cardview">
                <div
                  className={`number ${
                    baharHarufValues[number] ? "green" : ""
                  }`}
                >
                  {number}
                </div>
                {/* <input type="number" className='form-input' onKeyDown={blockInvalidChar} onChange={e => handleBaharHarufChange(number, e.target.value)} autoFocus /> */}
                <input
                  className="form-input"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  onPaste={(e) => {
                    e.preventDefault();
                    const pastedText = e.clipboardData
                      .getData("text/plain")
                      .replace(/[^0-9]/g, "")
                      .slice(0, 2);
                    document.execCommand("insertText", false, pastedText);
                  }}
                  onChange={(e) => {
                    const inputValue = e.target.value
                      .replace(/[^0-9]/g, "")
                      .slice(0, 4);
                    handleBaharHarufChange(number, inputValue);
                  }}
                  onInput={(e) => {
                    const inputValue = e.target.value
                      .replace(/[^0-9]/g, "")
                      .slice(0, 4);
                    e.target.value = inputValue; // Ensure the input value is updated
                    handleBaharHarufChange(number, inputValue);
                  }}
                  onBlur={(e) => {
                    const inputValue = e.target.value
                      .replace(/[^0-9]/g, "")
                      .slice(0, 4);
                    e.target.value = inputValue; // Ensure the input value is updated
                    handleAndarHarufChange(number, inputValue, 3, "B");
                  }}
                  autoFocus
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* {isButtonVisible ? ( */}
      <div className="totalpoints">
        <div></div>
        {/* {showSubmitButton && <button disabled={loadingbutton || isButtonDisabled || !areCombinationsGenerated} className="btn-add" onClick={handlePlaceBet} >
              Place Bet
              {loadingbutton && <Spinner animation="border" />}
            </button>} */}
        <button
          disabled={
            isButtonClicked || loadingbutton || !areCombinationsGenerated
          }
          className="btn-add"
          onClick={handleClicksend}
        >
          Place Bet
          {loadingbutton && (
            <Spinner
              animation="border"
              style={{
                marginLeft: "8px",
                width: "25px",
                height: "25px",
                marginTop: "15px",
              }}
            />
          )}
        </button>
      </div>
      {/* ) : (
          <div className="d-flex justify-content-center position-relative" style={{ marginTop: '10' }}>
            <img src={loading} className="px-2 loaderfile" style={{ width: '50px' }} />
          </div>
        )} */}
      <ToastContainer />
      {loading2 && (
        <div className="spinner-wrapper">
          <div className="loadernew2"></div>
        </div>
      )}
    </>
  );
}
