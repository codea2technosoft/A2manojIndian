import React, { useState, useRef, useEffect } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import loading from "../../assets/img/loading-gif.gif";
import filesearch from "../../assets/img/filesearch.png";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Toast } from "react-bootstrap";
import { Col, Row, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";

export default function Crossing() {
  // alert('dddddd');

  const [areCombinationsGenerated, setAreCombinationsGenerated] =
    useState(false);

  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [users, setUsers] = useState([]);
  const [nums, setNums] = useState("");
  const [st, setSt] = useState([]);
  const [points, setPoints] = useState();
  const [totalPoints, setTotalPoints] = useState();
  const [MaxbetAmt, setMaxbet] = useState([]);
  const [setminibet, setMinibet] = useState([]);
  const [Maxpoints, setMaxpoints] = useState([]);
  const [RandNUmberBat, setRandNUmberBat] = useState([]);
  const url = new URL(window.location.href);
  const gameid = url.searchParams.get("id");
  const url1 = new URL(window.location.href);
  const name = url1.searchParams.get("name");
  const navigate = useNavigate();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const isButtonLoading = useRef(false);
  const [loadingbutton, setLoadingbutton] = useState(false);

  const blockCopyPaste = (e) => {
    e.preventDefault();
  };
  const [appmanagerdata, setAppmanager] = useState(null);
  const [minredeem, setMinredeem] = useState(null);
  const [showSubmitButton, setShowSubmitButton] = useState(true);
  const [loading2, setLoading2] = useState(false);

  const [s1, setS1] = useState("");
  const [s2, setS2] = useState("");
  const [result, setResult] = useState(new Set());
  useEffect(() => {
    setS2(s1);
    setResult("");
  }, [s1]);

  const handleCalculate = () => {
    setResult("");
    if (!s1 || !s2) {
      toast.error("Please enter number ", 2000);
      return;
    }
    if (!points) {
      toast.error("Please enter points ", 2000);
      return;
    }
    const st = new Set();

    for (let i = 0; i < s1.length; i++) {
      for (let j = 0; j < s2.length; j++) {
        const tmp1 = s1[i] + s2[j];
        // const tmp2 = s2[j] + s1[i];
        st.add(tmp1);
        // st.add(tmp2);
      }
    }
    setResult(Array.from(st));
    setAreCombinationsGenerated(true);
  };
  const combinationsCount = result.length;
  var totalpoint = combinationsCount * points;
  const deleteCombination = (index) => {
    const updatedCombinations = [...result];
    updatedCombinations.splice(index, 1);
    setResult(updatedCombinations);

    const updatedPoints = updatedCombinations.length > 0 ? points : 0;
    const newTotalPoints = updatedCombinations.length * updatedPoints;
    setTotalPoints(newTotalPoints);
    toast.success("Combination deleted successfully! ");
  };

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
    const response = await axios(config);
    // .then(function (response) {
    var setpoints = response.data.points;
    setMaxpoints(setpoints);

    const res = JSON.stringify(response.data.data);
    const objectRes = JSON.parse(res);
    setAppmanager(objectRes);
    var setmininumbet = objectRes.crossingMin;
    setMinibet(setmininumbet);
    var setmax_betnumbet = objectRes.crossingMax;
    setMaxbet(setmax_betnumbet);
  };
  const loaduser = async () => {
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
      // var setmax_betnumbet = response.data.max_bet;
      var setpoints = response.data.points;
      setMinibet(setmininumbet);
      // setMaxbet(setmax_betnumbet)
      setMaxpoints(setpoints);
      const res = JSON.stringify(response.data);
      const objectRes = JSON.parse(res);
      setUsers(objectRes);
      // })
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      //   setLoading(false);
    }
  };

  const playgamecrossing = async () => {
    const user_id = localStorage.getItem("userid");
    const dev_id = localStorage.getItem("dev_id");
    // const token = localStorage.getItem("token");
    if (parseInt(setminibet) > parseInt(points)) {
      toast.error(`Minimum Bet Placed ${appmanagerdata.crossingMin}`);
      return;
    }
    if (parseInt(MaxbetAmt) < parseInt(points)) {
      toast.error(`Maximum Bet Placed ${appmanagerdata.crossingMax}`);
      return;
    }
    if (users.points < totalpoint) {
      toast.error(`You Dont Have Sufficient Balance`);
      return;
    }

    setIsButtonVisible(false);
    if (!isButtonLoading.current) {
      isButtonLoading.current = true;
      setIsButtonDisabled(true);
      setTimeout(() => {
        setIsButtonDisabled(false);
        isButtonLoading.current = false;
      }, 1000);
    }
    try {
      setLoadingbutton(true);
      const betList = result
        .map((item, index) => {
          return {
            betkey: item,
            betamount: points,
            session_name: "open",
            bettype: "1",
            crossing: "yes",
          };
        })
        .filter((item) => item.betamount > 0);
      setResult("");
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
        betamount: combinationsCounts,
        bettype: "1",
        batuniqueid: RandNUmberBat,
        market_name: gameid,
        dev_model: "web",
        // betamount: 5,
        btype: "crossing",
        devName: "sumsang",
        session: "close",
        // bettype: 1,
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
          setIsButtonDisabled(true);
          // setTimeout(() => {
          setLoading2(false);
          // }, 1000);
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
          setIsButtonDisabled(false);
          setLoading2(false);
          // window.location.reload()
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
    // setShowSubmitButton(false);
  };

  var combinationsCounts = combinationsCount * points || 0;
  var combinationsCounts1 = combinationsCounts || 0;
  //combination with two different input value
  return (
    <>
      <section id="crossing">
        <div className="d-flex justify-content-between px-3">
          <div className="points">
            <h5>Points Remaining</h5>
            <p>{Math.max(0, users.points - combinationsCounts)}</p>
          </div>
          <div className="points">
            <h5>Points Added</h5>
            <p>{combinationsCounts}</p>
          </div>
        </div>
        <div className="bg-white">
          <div className="d-flex justify-conten-between formnumber">
            <div className="form-group">
              <label>Number</label>
              <Input
                type="text"
                inputMode="numeric"
                className="form-control"
                maxLength={6}
                onPaste={blockCopyPaste}
                placeholder="Number"
                value={s1}
                onChange={(e) => {
                  const inputValue = e.target.value
                    .replace(/[^0-9]/g, "")
                    .slice(0, 6);
                  setS1(inputValue);
                }}
                required
              />{" "}
            </div>
            &nbsp;
            <div className="form-group">
              <label>Number</label>
              <input
                type="text"
                inputMode="numeric"
                className="form-control"
                maxLength={6}
                placeholder="Number"
                onPaste={blockCopyPaste}
                value={s2}
                onChange={(e) => {
                  const inputValue = e.target.value
                    .replace(/[^0-9]/g, "")
                    .slice(0, 6);
                  setS2(inputValue);
                }}
                required
              />{" "}
            </div>
          </div>
          <div className="form-group">
            <label>Points</label>
            <Input
              type="text"
              inputMode="numeric"
              maxLength={6}
              className="form-control"
              placeholder="Points"
              value={points}
              onPaste={blockCopyPaste}
              onChange={(e) => {
                const inputValue = e.target.value.replace(/[^0-9]/g, "");
                setPoints(inputValue);
              }}
              required
            />
          </div>

          <div className="form-btn">
            <button className="btn-add" onClick={handleCalculate}>
              Add
            </button>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <td>Number Type</td>
              <td>Number</td>
              <td>Points</td>
            </tr>
          </thead>
          <tbody>
            {Array.from(result).map((item, index) => (
              <tr key={index}>
                <td>Crossing</td>
                <td>{item}</td>
                <td>{points}</td>
                <td
                  className="text-danger"
                  onClick={() => deleteCombination(index)}
                >
                  <i className="bi bi-trash3"></i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isButtonVisible ? (
          <div className="totalpoints">
            <div className="d-flex justify-content-between">
              <p>Total Points</p>
              <p>{combinationsCounts1}</p>
            </div>

            {showSubmitButton && (
              <button
                className="btn-add"
                onClick={playgamecrossing}
                disabled={
                  loadingbutton || !areCombinationsGenerated || isButtonDisabled
                }
              >
                <span>Place bet</span>
                {loadingbutton && <Spinner animation="border" />}
              </button>
            )}
          </div>
        ) : (
          <div
            className="d-flex justify-content-center position-relative"
            style={{ left: "0" }}
          >
            <img
              src={loading}
              className="px-2 loaderfile"
              style={{ width: "50px" }}
            />
          </div>
        )}
        <ToastContainer />
      </section>
      {loading2 && (
        <div className="spinner-wrapper">
          <div className="loadernew2"></div>
        </div>
      )}
    </>
  );
}
