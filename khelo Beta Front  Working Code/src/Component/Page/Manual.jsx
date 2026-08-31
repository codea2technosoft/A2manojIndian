import React, { useState, useRef, useEffect } from "react";
import Table from "react-bootstrap/Table";
// import { Input } from "antd";
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
import { useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";

import Swal from "sweetalert2";
const url = new URL(window.location.href);
const gameid = url.searchParams.get("id");
const url1 = new URL(window.location.href);
const name = url1.searchParams.get("name");

export default function Manual() {
  const blockCopyPaste = (e) => {
    e.preventDefault();
  };
  const [areCombinationsGenerated, setAreCombinationsGenerated] =
    useState(false);
  const [users, setUsers] = useState([]);
  const [areAnyInputsEmpty, setAreAnyInputsEmpty] = useState(false);
  const [showSubmitButton, setShowSubmitButton] = useState(true);
  const [session_name, setSessionname] = useState([]);
  const [setminibet, setMinibet] = useState([]);
  const [MaxbetAmt, setMaxbet] = useState([]);
  const [Maxpoints, setMaxpoints] = useState([]);
  const [RandNUmberBat, setRandNUmberBat] = useState([]);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const isButtonLoading = useRef(false);
  const [loadingbutton, setLoadingbutton] = useState(false);
  const [loading1, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const navigate = useNavigate();

  const [sets, setSets] = useState([
    { inputs: Array(5).fill(""), points: "", totalPoints: "", totalIndex: "" },
    { inputs: Array(5).fill(""), points: "", totalPoints: "", totalIndex: "" },
    { inputs: Array(5).fill(""), points: "", totalPoints: "", totalIndex: "" },

    { inputs: Array(5).fill(""), points: "", totalPoints: "", totalIndex: "" },
    { inputs: Array(5).fill(""), points: "", totalPoints: "", totalIndex: "" },
    { inputs: Array(5).fill(""), points: "", totalPoints: "", totalIndex: "" },

    { inputs: Array(5).fill(""), points: "", totalPoints: "", totalIndex: "" },
    { inputs: Array(5).fill(""), points: "", totalPoints: "", totalIndex: "" },
    { inputs: Array(5).fill(""), points: "", totalPoints: "", totalIndex: "" },

    { inputs: Array(5).fill(""), points: "", totalPoints: "", totalIndex: "" },
  ]);

  const [errors, setErrors] = useState(
    Array(10)
      .fill(null)
      .map(() => Array(5).fill(""))
  );

  const [totalPoints, setTotalPoints] = useState("");
  const [Points, setPoints] = useState(0);

  const countTotalIndex = (setIndex) => {
    const newSets = [...sets];
    newSets[setIndex].totalIndex = newSets[setIndex].inputs.reduce(
      (totalIndex, inputVal) => totalIndex + (inputVal.trim() !== "" ? 1 : 0),
      0
    );
    setSets(newSets);
  };

  const calculateTotalWithIndex = (setIndex) => {
    const newSets = [...sets];
    newSets[setIndex].totalWithIndex =
      newSets[setIndex].totalIndex * newSets[setIndex].points;

    setSets(newSets);
    const newTotalPoints = newSets.reduce(
      (total, set) => total + (set.totalWithIndex || 0),
      0
    );
    setTotalPoints(newTotalPoints);
  };

  // const handleInputChange = (setIndex, inputIndex, value) => {
  //   const newSets = [...sets];
  //   newSets[setIndex].inputs[inputIndex] = value;

  //   // Handle Backspace key press
  //   if (value === "" && inputIndex > 0) {
  //     const prevInputIndex = inputIndex - 1;
  //     const prevInput = document.getElementById(`input-${setIndex}-${prevInputIndex}`);
  //     if (prevInput) {
  //       prevInput.focus();
  //       // Delete the last digit in the previous input
  //       const prevInputValue = newSets[setIndex].inputs[prevInputIndex].slice(0, -1);
  //       handleInputChange(setIndex, prevInputIndex, prevInputValue);
  //     }
  //     return;
  //   }

  //   // Handle moving to the next input when two digits are entered
  //   if (/^\d{2}$/.test(value) && inputIndex < 4) {
  //     const nextInputIndex = inputIndex + 1;
  //     const nextInput = document.getElementById(`input-${setIndex}-${nextInputIndex}`);
  //     if (nextInput) {
  //       nextInput.focus();
  //     }
  //   }

  //   countTotalIndex(setIndex);
  //   calculateTotalWithIndex(setIndex);
  //   setSets(newSets);
  // };

  const handleInputChange = (setIndex, inputIndex, value) => {
    const newSets = [...sets];
    const newErrors = [...errors];

    // Validation
    if (!/^\d{2}$/.test(value) && value !== "") {
      newErrors[setIndex][inputIndex] = "Input must be exactly 2 digits";
    } else {
      newErrors[setIndex][inputIndex] = ""; // Clear error if valid
    }

    newSets[setIndex].inputs[inputIndex] = value;

    if (value === "" && inputIndex > 0) {
      const prevInputIndex = inputIndex - 1;
      const prevInput = document.getElementById(
        `input-${setIndex}-${prevInputIndex}`
      );
      if (prevInput) {
        prevInput.focus();
        // Delete the last digit in the previous input
        const prevInputValue = newSets[setIndex].inputs[prevInputIndex].slice(
          0,
          -1
        );
        handleInputChange(setIndex, prevInputIndex, prevInputValue);
      }
      return;
    }

    if (/^\d{2}$/.test(value) && inputIndex < 4) {
      const nextInputIndex = inputIndex + 1;
      const nextInput = document.getElementById(
        `input-${setIndex}-${nextInputIndex}`
      );
      if (nextInput) {
        nextInput.focus();
      }
    }
    countTotalIndex(setIndex);
    calculateTotalWithIndex(setIndex);
    setSets(newSets);
    setErrors(newErrors);
  };

  const handlePointsChange = (setIndex, value) => {
    const newSets = [...sets];
    newSets[setIndex].points = parseInt(value, 10) || 0;
    if (/^\d{2}$/.test(value)) {
    }
    calculateTotalWithIndex(setIndex);
    setSets(newSets);
    setAreCombinationsGenerated(true);
  };
  // remaining point api
  useEffect(() => {
    loaduser();
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
        setMinibet(setmininumbet);
        setMaxbet(setmax_betnumbet);
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

  const clearInputValues = () => {
    setSets([
      {
        inputs: Array(5).fill(""),
        points: "",
        totalPoints: "",
        totalIndex: "",
      },
      {
        inputs: Array(5).fill(""),
        points: "",
        totalPoints: "",
        totalIndex: "",
      },
      {
        inputs: Array(5).fill(""),
        points: "",
        totalPoints: "",
        totalIndex: "",
      },

      {
        inputs: Array(5).fill(""),
        points: "",
        totalPoints: "",
        totalIndex: "",
      },
      {
        inputs: Array(5).fill(""),
        points: "",
        totalPoints: "",
        totalIndex: "",
      },
      {
        inputs: Array(5).fill(""),
        points: "",
        totalPoints: "",
        totalIndex: "",
      },

      {
        inputs: Array(5).fill(""),
        points: "",
        totalPoints: "",
        totalIndex: "",
      },
      {
        inputs: Array(5).fill(""),
        points: "",
        totalPoints: "",
        totalIndex: "",
      },
      {
        inputs: Array(5).fill(""),
        points: "",
        totalPoints: "",
        totalIndex: "",
      },

      {
        inputs: Array(5).fill(""),
        points: "",
        totalPoints: "",
        totalIndex: "",
      },
    ]);
  };

  const handlePlayGame = () => {
    clearInputValues();
    playgame();
  };

  const playgame = async () => {
    const user_id = localStorage.getItem("userid");
    const dev_id = localStorage.getItem("dev_id");
    for (let setIndex = 0; setIndex < sets.length; setIndex++) {
      const currentErrors = errors[setIndex];
      for (
        let inputIndex = 0;
        inputIndex < currentErrors.length;
        inputIndex++
      ) {
        if (currentErrors[inputIndex]) {
          toast.error("आपने जोड़ी सही नहीं डाली है कृपा जोड़ी सही डाले");
          return;
        }
      }
    }

    for (let setIndex = 0; setIndex < sets.length; setIndex++) {
      const currentSet = sets[setIndex];
      if (currentSet.points <= 0) {
        continue;
      }

      if (setminibet > currentSet.points) {
        toast.error(`Minimum Bet Placed ${users.mini_bet} `);
        return;
      }

      if (MaxbetAmt < currentSet.points) {
        toast.error(`Maximum Bet Placed ${users.max_bet} `);
        return;
      }
      if (
        !currentSet.points ||
        isNaN(currentSet.points) ||
        parseInt(currentSet.points, 10) <= 0
      ) {
        toast.error("Please provide a valid point value for each row");
        return;
      }
      if (users.points < totalPoints) {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
          title: "You Dont Have Sufficient Balance",
          timer: 2000,
          icon: "error",
        });
        return;
      }
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

      const betList = sets
        .map((set, setIndex) => {
          return set.inputs
            .filter((input) => input.trim() !== "" && set.points > 0)
            .map((input, inputIndex) => ({
              betkey: input,
              betamount: set.points,
              bettype: "1",
              crossing: "no",
            }));
        })
        .flat();

      setLoading2(true);
      setLoading3(true);

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
        btype: "manual",
        devName: "sumsang",
        batuniqueid: RandNUmberBat,
        market_name: gameid,
        session: "close",
        betamount: totalPoints,
        bettype: 1,
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
          // setIsButtonVisible(false)
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

      // return;
    } catch (error) {
      console.error("Game store:", error);
      toast.error(
        "An error occurred while Game store. Please try again later."
      );
    } finally {
      setLoadingbutton(false);
    }
    setLoading2(false);
    setLoading3(true);
  };

  return (
    <>
      <section id="manual">
        <div className="d-flex justify-content-between px-3">
          <div className="points">
            <h5>Points Remaining</h5>
            <p>{Math.max(0, users.points - totalPoints)}</p>
          </div>
          <div className="points">
            <h5>Points Added</h5>
            <p>{totalPoints}</p>
          </div>
        </div>
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead className="tablehead">
              <tr>
                <th>Jodi</th>
                <th>Point</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody className="padding-table">
              {sets.map((set, setIndex) => (
                <tr key={setIndex}>
                  <td className="d-flex">
                    <tr>
                      {[...Array(5)].map((_, inputIndex) => (
                        <td key={inputIndex}>
                          <Input
                            type="text"
                            inputMode="numeric"
                            maxLength={2}
                            onChange={(e) => {
                              const inputValue = e.target.value
                                .replace(/[^0-9]/g, "")
                                .slice(0, 2);
                              handleInputChange(
                                setIndex,
                                inputIndex,
                                inputValue
                              );
                            }}
                            onPaste={(e) => {
                              e.preventDefault();
                              const pastedText = e.clipboardData
                                .getData("text/plain")
                                .replace(/[^0-9]/g, "")
                                .slice(0, 2);
                              document.execCommand(
                                "insertText",
                                false,
                                pastedText
                              );
                            }}
                            className="width_input"
                            value={set.inputs[inputIndex]}
                            id={`input-${setIndex}-${inputIndex}`}
                          />
                          {/* {errors[setIndex][inputIndex] && (
                          <span className="error-message">{errors[setIndex][inputIndex]}</span>
                        )} */}
                        </td>
                      ))}
                    </tr>
                  </td>
                  <td>
                    <tr>
                      <td>
                        <Input
                          // type="number"
                          type="text"
                          inputMode="numeric"
                          maxLength={4}
                          onChange={(e) => {
                            const inputValue = e.target.value
                              .replace(/[^0-9]/g, "")
                              .slice(0, 4);
                            handlePointsChange(setIndex, inputValue);
                          }}
                          onPaste={(e) => {
                            e.preventDefault();
                            const pastedText = e.clipboardData
                              .getData("text/plain")
                              .replace(/[^0-9]/g, "")
                              .slice(0, 4);
                            document.execCommand(
                              "insertText",
                              false,
                              pastedText
                            );
                          }}
                          className="width_input"
                          value={set.points}
                          id={`input-${setIndex}-${setIndex}`}
                        />
                      </td>
                    </tr>
                  </td>
                  <td>
                    <tr>
                      <td>
                        <Input
                          maxLength={4}
                          className="width_input"
                          value={set.totalWithIndex}
                          readOnly
                        />
                      </td>
                    </tr>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </section>
      <div className="position-relative">
        <div class="d-flex justify-content-between">
          <p>Total Points</p>
          <p>{totalPoints}</p>
        </div>

        {isButtonVisible ? (
          <div class="totalpoints">
            {showSubmitButton && (
              <button
                className="btn-add"
                onClick={handlePlayGame}
                disabled={
                  loadingbutton ||
                  isButtonDisabled ||
                  areAnyInputsEmpty ||
                  !areCombinationsGenerated
                }
              >
                Place Bet
                {loadingbutton && <Spinner animation="border" />}
              </button>
            )}
          </div>
        ) : (
          <div className="d-flex justify-content-center position-relative">
            <img
              src={loading}
              className="px-2 loaderfile"
              style={{ width: "50px" }}
            />
          </div>
        )}
        <ToastContainer />
      </div>
      {loading3 && (
        <div className="spinner-wrapper">
          <div className="loadernew2"></div>
        </div>
      )}
    </>
  );
}
