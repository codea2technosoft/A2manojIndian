import React, { useState, useRef, useEffect } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Col, Row, Form, Input, Radio } from "antd";
import { toast } from "react-toastify";
import loading from "../../assets/img/loading-gif.gif";
import filesearch from "../../assets/img/filesearch.png";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Table from "react-bootstrap/Table";
import { useNavigate } from "react-router-dom";
import $ from "jquery";
import { Spinner } from "react-bootstrap";

export default function Copypaste() {
  const [areCombinationsGenerated, setAreCombinationsGenerated] =
    useState(false);
  const [WithoutPlati, setWithoutPlati] = useState("WithPlati");

  const [showSubmitButton, setShowSubmitButton] = useState(true);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [users, setUsers] = useState([]);
  const [selectedOption, setSelectedOption] = useState("option1");
  const [points, setPoints] = useState(0);
  const [totalPoints, setTotalPoints] = useState();
  const [MaxbetAmt, setMaxbet] = useState([]);
  const [setminibet, setMinibet] = useState([]);
  const [Maxpoints, setMaxpoints] = useState([]);
  const [RandNUmberBat, setRandNUmberBat] = useState([]);
  const url = new URL(window.location.href);
  const gameid = url.searchParams.get("id");
  const url1 = new URL(window.location.href);
  const name = url1.searchParams.get("name");
  const [appmanagerdata, setAppmanager] = useState(null);
  const [minredeem, setMinredeem] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const isButtonLoading = useRef(false);
  const [loadingbutton, setLoadingbutton] = useState(false);

  // const [selectedRadio, setSelectedRadio] = useState('');
  const onFinish = () => {
    // message.success('Submit success!');
  };

  const onFinishFailed = () => {
    // message.error('Submit failed!');
  };
  const handleRadioChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const [loading2, setLoading2] = useState(false);

  const [nums, setNums] = useState("");
  const [combinations, setCombinations] = useState([]);
  const [input, setInput] = useState("");
  const [result, setResult] = useState([]);
  const [plati, setPlati] = useState("");
  const [radioValue, setRadioValue] = useState("WithPlati");
  const navigate = useNavigate();

  const onChangeValue = (event) => {
    setPlati(event.target.value);
    console.log(event.target.value);
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const generateSubstrings = () => {
    setAreCombinationsGenerated(true);
    let i = 0;
    let newCombinations = [];

    if (!nums) {
      toast.error("Number is required.");
      return;
    }

    if (!points) {
      toast.error(" Points is required.");
      return;
    }

    while (i < nums.length) {
      let tmp1 = "";
      let tmp2 = "";
      if (i === nums.length - 1) {
        tmp1 += nums[i] + nums[i];
        newCombinations.push(tmp1);
      } else {
        tmp1 += nums[i] + nums[i + 1];
        tmp2 += nums[i + 1] + nums[i];
        newCombinations.push(tmp1);
        newCombinations.push(tmp2);
      }
      i = i + 2;
    }
    const uniqueCombinations = [...new Set(newCombinations)];
    setCombinations(uniqueCombinations);
  };

  const deleteCombination1 = (index) => {
    const updatedCombinations = [...combinations];
    updatedCombinations.splice(index, 1);
    setCombinations(updatedCombinations);

    const newTotalPoints = updatedCombinations.length; // Calculate points based on the number of combinations
    setTotalPoints(newTotalPoints);
    toast.success("Combination deleted successfully!");
  };

  const generateCombinations = () => {
    // setNums('')
    setAreCombinationsGenerated(true);
    // setCombinations('');
    const numArray = nums.split("").map(Number);
    const n = numArray.length;
    if (!nums) {
      toast.error("Number is required.");
      return;
    }

    if (!points) {
      toast.error(" Points is required.");
      return;
    }
    let combinations = [];

    if (n % 2 == 0) {
      for (let i = 0; i < n; i += 2) {
        const pair = [numArray[i]];
        if (i + 1 < n) {
          pair.push(numArray[i + 1]);
        }
        combinations.push(pair);
      }
    } else {
      if (n % 2 !== 0) {
        toast.error(" Must be Even Digit.");
        return {};
      }
    }

    const uniqueCombinations = combinations.filter(
      (combination, index, self) =>
        index ===
        self.findIndex(
          (c) =>
            c.length === combination.length &&
            c.every((value, i) => value === combination[i])
        )
    );

    setCombinations(uniqueCombinations);
  };
  function handleChange(evt) {
    setNums(evt.target.value);
  }
  const combinationsCount = combinations.length;
  var totalpoint = combinationsCount * points;

  const deleteCombination = (index) => {
    const updatedCombinations = [...combinations];
    updatedCombinations.splice(index, 1);
    setCombinations(updatedCombinations);

    const updatedPoints = combinationsCount > 1 ? points : 0;
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

    // let url = (`${process.env.REACT_APP_API_URL}/app_manager.php`);
    // const formData = new FormData();
    // formData.append('app_id', process.env.REACT_APP_API_ID);
    // formData.append('user_id', user_id);
    // // formData.append('market_id', gameid);
    // formData.append('dev_id', dev_id);
    // var config = {
    //   method: 'POST',
    //   url: url,
    //   body: formData,
    // };
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
    var min_redeem = response.data.data.min_redeem;

    const res = JSON.stringify(response.data.data);
    const objectRes = JSON.parse(res);
    setAppmanager(objectRes);
    var setmininumbet = objectRes.jodi_min;
    setMinibet(setmininumbet);
    var setmax_betnumbet = objectRes.jodi_max;
    setMaxbet(setmax_betnumbet);
    // setIsLoading(false);
    // })
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
      setMinibet(setmininumbet);
      setMaxbet(setmax_betnumbet);
      setMaxpoints(setpoints);
      const res = JSON.stringify(response.data);
      const objectRes = JSON.parse(res);
      setUsers(objectRes);
      // })
      // .finally(() => {
      //   // setLoading(false);
      // });
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      //   setLoading(false);
    }
  };

  const clearInputValues = () => {
    setCombinations(Array().fill(""));
  };

  const handlePlayGame = () => {
    clearInputValues();
    playgame();
  };

  const playgame = async () => {
    // alert(RandNUmberBat);
    // return;
    const user_id = localStorage.getItem("userid");
    const dev_id = localStorage.getItem("dev_id");
    // const token = localStorage.getItem("token");

    // console.warn(totalPoints);
    if (parseInt(setminibet) > parseInt(points)) {
      toast.error(`Minimum Bet Placed ${appmanagerdata.jodi_min}`);
      return;
    }
    if (parseInt(MaxbetAmt) < parseInt(points)) {
      toast.error(`Maximum Bet Placed ${appmanagerdata.jodi_max}`);
      return;
    }
    if (users.points < totalpoint) {
      toast.error(`You Dont Have Sufficient Balance`);
      return;
    }

    //   setIsButtonVisible(false);
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
      const betList =
        selectedOption === "option2"
          ? combinations
              .map((combination, index) => {
                return {
                  betkey: combination.join(""),
                  betamount: points,
                  session_name: "open",
                  bettype: "1",
                };
              })
              .filter((item) => item.betamount > 0)
          : combinations
              .map((substring, index) => {
                return {
                  betkey: substring,
                  betamount: points,
                  session_name: "open",
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
        betamount: combinationsCount * points,
        bettype: "1",
        batuniqueid: RandNUmberBat,
        market_name: gameid,
        dev_model: "web",
        // betamount: 5,
        btype: "copypaste",
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
          // setTimeout(() => {
          setIsButtonDisabled(true);

          setLoading2(false);
          // }, 1000);
          // console.warn(response.data.success)
          // const MySwal = withReactContent(Swal)
          // MySwal.fire({
          //   title: response.data.message,
          //   icon: 'success',
          //   timer: 1500
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
          const MySwal = withReactContent(Swal);
          MySwal.fire({
            title: response.data.message,
            timer: 2000,
            icon: "error",
          });
          // window.location.reload()
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
  const [form] = Form.useForm();

  return (
    <>
      <section id="copyright">
        <div className="d-flex justify-content-between px-3">
          <div className="points">
            <h5>Points Remaining</h5>
            <p>{Math.max(0, users.points) - combinationsCount * points}</p>
          </div>
          <div className="points">
            <h5>Points Added</h5>
            <p>{combinationsCount * points}</p>
          </div>
        </div>
        <div className="form">
          <Form form={form} layout="vertical">
            {selectedOption === "option1" && (
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                className="d-flex justify-content-between w-100"
              >
                <Form.Item label="Number">
                  <Input
                    placeholder="Number"
                    type="text"
                    inputMode="numeric"
                    className="inputfile"
                    value={nums}
                    onPaste={(e) => {
                      e.preventDefault();
                      const pastedText = e.clipboardData
                        .getData("text/plain")
                        .replace(/[^0-9]/g, "");
                      document.execCommand("insertText", false, pastedText);
                    }}
                    onChange={(e) => {
                      const inputValue = e.target.value.replace(/[^0-9]/g, "");
                      setNums(inputValue);
                    }}
                  />
                </Form.Item>
              </Form>
            )}
            {selectedOption === "option2" && (
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                className="d-flex justify-content-between w-100"
              >
                <Form.Item label="Number">
                  <Input
                    placeholder="Number"
                    type="text"
                    inputMode="numeric"
                    className="inputfile"
                    value={nums}
                    onPaste={(e) => {
                      e.preventDefault();
                      const pastedText = e.clipboardData
                        .getData("text/plain")
                        .replace(/[^0-9]/g, "");
                      document.execCommand("insertText", false, pastedText);
                    }}
                    onChange={(e) => {
                      const inputValue = e.target.value.replace(/[^0-9]/g, "");
                      setNums(inputValue);
                    }}
                  />
                </Form.Item>
              </Form>
            )}

            <div className="d-flex gap-2 mt-1">
              <div className="d-flex gap-2 align-items-center">
                <input
                  type="radio"
                  value="option1"
                  onChange={handleRadioChange}
                  checked={selectedOption === "option1"}
                  name="addfund"
                  id="googlepay"
                />
                <label>With Palti</label>
              </div>
              <div className="d-flex align-items-center">
                <input
                  type="radio"
                  value="option2"
                  onChange={handleRadioChange}
                  checked={selectedOption === "option2"}
                  name="addfund"
                  id="paytm"
                />
                <label>Without Palti</label>
              </div>
            </div>
            <Form.Item label="Amount" className="margin-top-15">
              <Input
                placeholder="Number"
                className="inputfile"
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
                  setPoints(inputValue);
                }}
                onInput={(e) => {
                  const inputValue = e.target.value
                    .replace(/[^0-9]/g, "")
                    .slice(0, 4);
                  e.target.value = inputValue; // Ensure the input value is updated
                  setPoints(inputValue);
                }}
                autoFocus
              />
            </Form.Item>

            {selectedOption === "option2" ? (
              <Form.Item>
                <Button
                  type="button"
                  className="btn_submit"
                  onClick={generateCombinations}
                >
                  Add
                </Button>
              </Form.Item>
            ) : (
              <Button
                type="button"
                className="btn_submit"
                onClick={generateSubstrings}
              >
                Add
              </Button>
            )}
          </Form>
        </div>
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <td>Number Type</td>
                <td>Number</td>
                <td>Points</td>
              </tr>
            </thead>
            <tbody>
              {selectedOption === "option2"
                ? combinations.map((substring, index) => (
                    <tr key={index}>
                      <td>Jodi</td>
                      <td>{substring}</td>
                      <td>{points}</td>
                      <td
                        className="text-danger"
                        onClick={() => deleteCombination1(index)}
                      >
                        <i className="bi bi-trash3"></i>
                      </td>
                    </tr>
                  ))
                : combinations.map((combination, index) => (
                    <tr key={index}>
                      <td>Jodi</td>
                      <td>{combination}</td>
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
        </div>
        {isButtonVisible ? (
          <div class="totalpoints">
            <div class="d-flex justify-content-between">
              <p>Total Points</p>
              <p>{combinationsCount * points}</p>
            </div>
            {showSubmitButton && (
              <button
                id="submit"
                disabled={
                  loadingbutton || isButtonDisabled || !areCombinationsGenerated
                }
                class="btn_submit"
                onClick={handlePlayGame}
              >
                Play
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
      </section>
      <ToastContainer />
      {loading2 && (
        <div className="spinner-wrapper">
          <div className="loadernew2"></div>
        </div>
      )}
    </>
  );
}
