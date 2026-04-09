import React, { useState, useRef, useEffect } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Col, Row, Form, Input } from "antd";
import withReactContent from "sweetalert2-react-content";
import { toast } from "react-toastify";
import loading from "../../assets/img/loading-gif.gif";
import filesearch from "../../assets/img/filesearch.png";
import Swal from "sweetalert2";
import { Spinner } from "react-bootstrap";
import html2canvas from "html2canvas";
import { createFileName, useScreenshot } from "use-react-screenshot";

import { useNavigate } from "react-router-dom";
const url = new URL(window.location.href);
const gameid = url.searchParams.get("id");
const url1 = new URL(window.location.href);
const name = url1.searchParams.get("name");

// alert(name);

// alert(gameid);
export default function Jodi() {
  const data = Array.from(
    { length: 100 },
    (_, index) => `Item ${String(index + 0).padStart(2, "0")}`
  );
  const [inputValues, setInputValues] = useState(Array(data.length).fill(""));

  const [attendeeEmails, setAttendeeEmails] = useState({});
  const [users, setUsers] = useState([]);
  const [areAnyInputsEmpty, setAreAnyInputsEmpty] = useState(false);
  const [betkey, setBetkey] = useState([]);
  const [betamount, setBetamount] = useState([]);
  const [session_name, setSessionname] = useState([]);
  const [setminibet, setMinibet] = useState([]);
  const [MaxbetAmt, setMaxbet] = useState([]);
  const [Maxpoints, setMaxpoints] = useState([]);
  const [RandNUmberBat, setRandNUmberBat] = useState([]);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  // const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const isButtonLoading = useRef(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading1, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [appmanager, setAppmanager] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingbutton, setLoadingbutton] = useState(false);
  const navigate = useNavigate();
  const handleInputChange = (e, index) => {
    const newInputValues = [...inputValues];

    newInputValues[index] = e.target.value;
    setInputValues(newInputValues);

    const newTotalPoints = newInputValues.reduce(
      (acc, value) => acc + Number(value),
      0
    );
    setTotalPoints(newTotalPoints);
    console.log(`${index}, ${e.target.value}`);
  };
  useEffect(() => {
    const emptyInputs = inputValues.every((value) => value.trim() === "");
    setAreAnyInputsEmpty(emptyInputs);
  }, [inputValues]);

  const setBetkeyChange = (e) => {
    const betkeyy = e.target.value;
    setBetkey(betkeyy);
  };
  const setBetamountChange = (e) => {
    const amount = e.target.value;
    setBetamount(amount);
  };
  const setSessionnameChange = (e) => {
    const Session = e.target.value;
    setSessionname(Session);
  };

  useEffect(() => {
    loaduser();
    app_manager();
  }, []);
  function randomString(length, chars) {
    var result = "";
    for (var i = length; i > 0; --i)
      result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }
  useEffect(() => {
    window.scrollTo(0, 0);

    var rString = randomString(
      32,
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    );
    // alert(rString);
    setRandNUmberBat(rString);
  }, []);

  const loaduser = async () => {
    setLoading(true);
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
      try {
        const response = await axios(config);
        var setmininumbet = response.data.mini_bet;
        var setmax_betnumbet = response.data.max_bet;
        var setpoints = response.data.points;
        // setMinibet(setmininumbet)
        // setMaxbet(setmax_betnumbet)
        setMaxpoints(setpoints);
        const res = JSON.stringify(response.data);
        const objectRes = JSON.parse(res);
        setUsers(objectRes);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      setLoading(false);
    }
  };

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
        setLoading(false);
      }
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      setLoading(false);
    }
  };
  const clearInputValues = () => {
    setInputValues(Array(data.length).fill(""));
  };

  const handlePlayGame = () => {
    clearInputValues();
    playgame();
  };
  const modalRef = useRef(null);

  const handleScreenshot = () => {
    if (modalRef.current) {
      html2canvas(modalRef.current).then((canvas) => {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "screenshot.png";
        link.click();
      });
    }
  };

  const playgame = async () => {
    const user_id = localStorage.getItem("userid");
    const dev_id = localStorage.getItem("dev_id");
    // const token = localStorage.getItem("token");
    const isInvalidBet = inputValues.some((value) => {
      const numericValue = parseFloat(value);
      const miniBet = parseFloat(5);
      const maxBet = parseFloat(10000);
      // console.warn(miniBet)

      // Check if the value is below the minimum bet
      if (parseInt(numericValue) < parseInt(miniBet)) {
        toast.error(
          `Bet value ${numericValue} is below the minimum bet (${miniBet}). Please check your input.`
        );
        return true;
      }

      // Check if the value is above the maximum bet
      if (parseInt(numericValue) > parseInt(maxBet)) {
        toast.error(
          `Bet value ${numericValue} is above the maximum bet (${maxBet}). Please check your input.`
        );
        return true;
      }

      return false;
    });

    if (isInvalidBet) {
      return;
    }
    if (isInvalidBet) {
      return;
    }
    if (Maxpoints < totalPoints) {
      const MySwal = withReactContent(Swal);
      MySwal.fire({
        title: "You Dont Have Sufficient Balance",
        timer: 2000,
        icon: "error",
      });
      return;
    }

    // alert(dev_id + user_id)
    setIsButtonVisible(false);
    if (!isButtonLoading.current) {
      isButtonLoading.current = true;
      setIsButtonDisabled(true);
      // setTimeout(() => {
      setIsButtonDisabled(false);
      isButtonLoading.current = false;
      // }, 1000);
    }
    try {
      setLoadingbutton(true);
      const betList = data
        .map((item, index) => {
          return {
            betkey: String(index).padStart(2, "0"), // replace betkey with the appropriate variable
            betamount: inputValues[index] || 0,
            // session_name: "open"
            bettype: "1",
            crossing: "no",
          };
        })
        .filter((item) => item.betamount > 0);

      setLoading2(true);
      let url = `${process.env.REACT_APP_API_URL_NODE}bat-place`;
      const requestData = {
        user_id: user_id,
        dev_id: dev_id,
        market_id: gameid,
        app_id: process.env.REACT_APP_API_ID,
        // BetList: [{ betkey:betkey, betamount:betamount, session_name:"open" }],
        BetList: betList,
        // token: token,
        dev_model: "web",
        btype: "jodi",
        devName: "sumsang",
        batuniqueid: RandNUmberBat,
        market_name: gameid,
        session: "close",
        betamount: totalPoints,
        bettype: 1,
        btype: "jodi",
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
          setIsButtonDisabled(true);
          setLoading2(false);
          localStorage.setItem("marketName", response.data.game_name);
          localStorage.setItem("total_amount", response.data.total_amount);
          localStorage.setItem("play_date", response.data.play_date);
          localStorage.setItem("date_time", response.data.date_time);
          localStorage.setItem("txn_id", response.data.txn_id);
          localStorage.setItem("bets", JSON.stringify(response.data.BetList));
          navigate("/GameSuccess");

          //   .then((result) => {
          // });
        } else {
          setIsButtonDisabled(false);
          setLoading2(false);
          const MySwal = withReactContent(Swal);
          MySwal.fire({
            title: response.data.message,
            timer: 2000,
            icon: "error",
          });
          return;
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    } catch (error) {
      console.error("Game store:", error);
      toast.error(
        "An error occurred while Game store. Please try again later."
      );
    } finally {
      setLoadingbutton(false);
    }
    setLoading2(true);
  };

  return (
    <>
      <section className="jodi" id="jodi">
        <div className="d-flex justify-content-between px-3 ">
          <div className="points">
            <h5>Points Remaining</h5>
            <p>{Math.max(0, Maxpoints - totalPoints)}</p>
          </div>
          <div className="points">
            <h5>Points Added</h5>
            <p>{totalPoints}</p>
          </div>
        </div>

        <div className="d-flex flex-wrap justify-content-between">
          {data.map((item, index) => (
            <div className="cardview" key={index}>
              <div className={`number ${inputValues[index] ? "green" : ""}`}>
                {String(index + 0).padStart(2, "0")}
              </div>
              <input
                type="text"
                inputMode="numeric"
                className="form-input"
                autoFocus={index === 0}
                value={inputValues[index]}
                onChange={(e) => {
                  const updatedInputValues = [...inputValues];
                  updatedInputValues[index] = e.target.value
                    .replace(/[^0-9]/g, "")
                    .slice(0, 4);
                  handleInputChange(e, index, updatedInputValues[index]);
                  setInputValues(updatedInputValues);
                }}
                onPaste={(e) => {
                  e.preventDefault();
                  const pastedText = e.clipboardData
                    .getData("text/plain")
                    .replace(/[^0-9]/g, "")
                    .slice(0, 4);
                  document.execCommand("insertText", false, pastedText);
                }}
                disabled={isButtonDisabled}
              />
            </div>
          ))}

          {/* <Button onClick={playgame} disabled={areAnyInputsEmpty} className='btn-add'>Play</Button> */}
          <div className="position-relative" id="capture">
            {isButtonVisible ? (
              <div className="totalpoints">
                <button
                  className="btn-add"
                  onClick={handlePlayGame}
                  // disabled={isButtonDisabled}
                  disabled={
                    loadingbutton || isButtonDisabled || areAnyInputsEmpty
                  }
                >
                  <span>Play</span>
                  {loadingbutton && <Spinner animation="border" />}
                </button>
              </div>
            ) : (
              <div
                className="d-flex justify-content-center position-relative"
                style={{ left: "175px" }}
              >
                <img
                  src={loading}
                  className="px-2 loaderfile"
                  style={{ width: "50px" }}
                />
              </div>
            )}
            <ToastContainer />
          </div>
        </div>
      </section>

      {loading2 && (
        <div className="spinner-wrapper">
          <div className="loadernew2"></div>
        </div>
      )}
    </>
  );
}
