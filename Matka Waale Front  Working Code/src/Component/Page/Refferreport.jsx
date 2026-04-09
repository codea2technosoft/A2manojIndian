import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import whatsapp from "../../../src/assets/img/WhatsApp_icon.png";
// import Referafriend from "../../assets/img/Referafriend.gif";
import { Link } from "react-router-dom";
import {
  Table,
  Button,
  Form,
  Spinner,
  Pagination,
  InputGroup,
} from "react-bootstrap";
// import { FiEye } from "react-icons/fi";
// import { BsPeople } from "react-icons/bs";

export default function RefferReport() {
  const user_id = localStorage.getItem("userid");
  const devid = localStorage.getItem("dev_id");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingReddem, setIsLoadingReeedem] = useState(true);
  const [refData, setRefData] = useState({ ref_code: "", ref_by: "" });
  const [updatedRefercode, setUpdatedRefercode] = useState("");
  const [loadingButton, setLoadingButton] = useState(false);
  const [loadButton, setLoadButton] = useState(false);
  const [error, setError] = useState("");
  const [showButton, setShowButton] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [ref_message, setref_message] = useState(null);
  const [activeTab, setActiveTab] = useState("Leave1");
  let active = 2;
  let items = [];
  for (let number = 1; number <= 5; number++) {
    items.push(
      <Pagination.Item key={number} active={number === active}>
        {number}
      </Pagination.Item>
    );
  }

  useEffect(() => {
    ReferCodeList();
    getProfile();
  }, []);

  const getProfile = async () => {
    setLoadButton(false);
    const apiUrl = `${process.env.REACT_APP_API_URL_NODE}user-profile`;
    const requestData = {
      app_id: process.env.REACT_APP_API_ID,
      user_id,
      device_id: devid,
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      setLoadButton(true);

      if (data.is_login === "0") window.location.href = "/";

      if (data.success === "1") {
        setApiResponse(data.is_bonus);
        setref_message(data.ref_message);
        setRefData({ ref_code: data.ref_code, ref_by: data.ref_by });
        setShowButton(!data.ref_by); // Show button only if ref_by is empty
      } else {
        console.error("API Error:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateReferCode = async (event) => {
    event.preventDefault();
    setLoadingButton(true);

    const requestData = { user_id, ref_by: updatedRefercode };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL_NODE}user-update-reffercode`,
        requestData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success === "1") {
        Swal.fire(
          "Success",
          "Your refer code has been updated successfully!",
          "success"
        );
        getProfile(); // Refresh the refer code
        setUpdatedRefercode(""); // Clear the input
      } else {
        Swal.fire("Error", response.data.message, "error");
      }
    } catch (error) {
      console.error("Error updating refer code:", error);
      Swal.fire(
        "Error",
        "An error occurred while updating the refer code. Please try again.",
        "error"
      );
    } finally {
      setLoadingButton(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText("https://matkawaale.com?reffercode=" + refData.ref_code)
      .then(() => {
        Swal.fire(
          "Copied!",
          "Your refer Link has been copied to the clipboard.",
          "success"
        );
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        Swal.fire("Error", "Failed to copy the refer code.", "error");
      });
  };

  const [level1Data, setLevel1Data] = useState([]);
  const [Level1mydata, setLevel1mydata] = useState([]);
  const [level2Data, setLevel2Data] = useState([]);
  const [level1userData, setLevel1userData] = useState();
  const [level2userData, setLevel2userData] = useState();
  const [leveltotaluserData, setLeveltotaluserData] = useState();

  const [totalPlayedTotalLavel1, settotalPlayedTotalLavel1] = useState();
  const [totalPlayedTotalLavel2, settotalPlayedTotalLavel2] = useState();
  const [totalWinTotalLavel1, settotalWinTotalLavel1] = useState();
  const [totalWinTotalLavel2, settotalWinTotalLavel2] = useState();
  const [Lavel1Com, setLavel1Com] = useState();
  const [Lavel1ComSettle, setLavel1ComSettle] = useState();
  const [Lavel2Com, setLavel2Com] = useState();
  const [LevelComission, setLevelComission] = useState();
  const [ComissionButtonVisible, setComissionButtonVisible] = useState();

  const ReferCodeList = async () => {
    const app_id = process.env.REACT_APP_API_ID;
    const requestData = { user_id, app_id };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL_NODE}report-lavel1`,
        requestData,
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.data.status == 1) {
        setLevel1Data(response.data.data);
        setLevel1mydata(response.data.mydata);
        setLevelComission(response.data.common.bonus_commission);

        settotalPlayedTotalLavel1(response.data.totalPlayedTotalLavel1);
        settotalPlayedTotalLavel2(response.data.totalPlayedTotalLavel2);
        settotalWinTotalLavel1(response.data.totalWinTotalLavel1);
        settotalWinTotalLavel2(response.data.totalWinTotalLavel2);

        setComissionButtonVisible(response.data.common.redeem_bonus);
        // let lavel1Com = 0;
        // let lavel1ComSettle = 0;
        // let lavel2Com = 0;

        // response.data.data.forEach((item) => {
        //   const losses = Math.max(
        //     0,
        //     item.lavel1_totalPlayed - item.lavel1_totalWin
        //   );
        //   const lossesSettle = Math.max(
        //     0,
        //     item.lavel1_totalPlayedSettle - item.lavel1_totalWin
        //   );
        //   const lossesChild = Math.max(
        //     0,
        //     item.lavel2_totalPlayed - item.lavel2_totalWin
        //   );

        //   const lossPercentage = response.data.common.bonus_commission
        //     ? (losses * response.data.common.bonus_commission) / 100
        //     : 0;
        //   const lossPercentageSettle = response.data.common.bonus_commission
        //     ? (lossesSettle * response.data.common.bonus_commission) / 100
        //     : 0;

        //   const lossPercentageChild = response.data.mydata.level2_com
        //     ? (lossesChild * response.data.mydata.level2_com) / 100
        //     : 0;

        //   lavel1Com += parseFloat(lossPercentage.toFixed(2));
        //   lavel1ComSettle += parseFloat(lossPercentageSettle.toFixed(2));
        //   lavel2Com += parseFloat(lossPercentageChild.toFixed(2));
        // });

        // if (
        //   Array.isArray(response.data.bonusRedeemSum) &&
        //   response.data.bonusRedeemSum.length > 0
        // ) {
        //   setLavel1ComSettle(
        //     lavel1ComSettle - response.data.bonusRedeemSum[0].totalAmount
        //   );
        //   setLavel1Com(lavel1Com - response.data.bonusRedeemSum[0].totalAmount);
        // } else {
        //   setLavel1ComSettle(lavel1ComSettle);
        //   setLavel1Com(lavel1Com);
        // }

        // setLavel2Com(lavel2Com);
        let lavel1Com = 0;
        let lavel1ComSettle = 0;
        let lavel2Com = 0;

        response.data.data.forEach((item) => {
          const losses = Math.max(
            0,
            item.lavel1_totalPlayed - item.lavel1_totalWin
          );
          const lossesSettle = Math.max(
            0,
            losses - item.lavel1_totalPlayedSettle
          );
          const lossesChild = Math.max(
            0,
            item.lavel2_totalPlayed - item.lavel2_totalWin
          );

          const lossPercentage = response.data.common.bonus_commission
            ? (losses * response.data.common.bonus_commission) / 100
            : 0;
          const lossPercentageSettle = response.data.common.bonus_commission
            ? (lossesSettle * response.data.common.bonus_commission) / 100
            : 0;

          const lossPercentageChild = response.data.mydata.level2_com
            ? (lossesChild * response.data.mydata.level2_com) / 100
            : 0;

          lavel1Com += parseFloat(lossPercentage.toFixed(2));
          lavel1ComSettle += parseFloat(lossPercentageSettle.toFixed(2));
          lavel2Com += parseFloat(lossPercentageChild.toFixed(2));
        });

        if (
          Array.isArray(response.data.bonusRedeemSum) &&
          response.data.bonusRedeemSum.length > 0
        ) {
          setLavel1ComSettle(
            lavel1ComSettle - response.data.bonusRedeemSum[0].totalAmount
          );
          setLavel1Com(lavel1Com - response.data.bonusRedeemSum[0].totalAmount);
        } else {
          setLavel1ComSettle(lavel1ComSettle);
          setLavel1Com(lavel1Com);
        }

        setLavel2Com(lavel2Com);
      } else {
        Swal.fire(
          "Error",
          response.data.message || "Failed to fetch data",
          "error"
        );
      }
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error",
        "An error occurred while fetching the data. Please try again.",
        "error"
      );
    } finally {
      setLoadingButton(false);
    }
  };
  const handleRedeemClick = async (value) => {
    setIsLoadingReeedem(false);
    var amount = value;
    const requestData = { user_id, amount };
    // alert(amount);
    // return;
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL_NODE}user-reedem-bonus`,
        requestData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.status === "1") {
        ReferCodeList();
        Swal.fire("Success", "Successfully!", "success");
      } else {
        ReferCodeList();
        Swal.fire("Error", response.data.message, "error");
      }
    } catch (error) {
      console.error("Error updating refer code:", error);
      Swal.fire(
        "Error",
        "An error occurred while updating the refer code. Please try again.",
        "error"
      );
    } finally {
      setLoadingButton(false);
    }
  };

  return (
    <div className="bg-white height-100 overflow-hidden">
      {isLoading ? (
        <div className="spinner_wrappers  ">
          <Spinner animation="border " />
        </div>
      ) : (
        <>
          <section id="Help" className="margin-bottom-88 height_auto">
            <div className="container">
              <div className="row">
                <div className="col-md-6 offset-md-3 col-12">
                  {/* <div className="w-50 mx-auto referfriend">
                    <img src={Referafriend} className="img-fluid" />
                  </div> */}
                  <div className="referalcode">
                    {ref_message}
                    {/* आप अपने REFERAL CODE से जितने भी खिलाड़ी जोड़ोगे, उनकी खेली
                    हुई गेम का आपको 10 % मिलेगा। और वो जितने लोगों को जोड़ेंगे
                    अपने REFERAL CODE से, उसका भी आपको 2 से 5 परसेंट मिलेगा। */}
                  </div>
                  <div className="chatsupportdesign">
                    <h4>Reffer Link</h4>
                    <div className="referlinkdesign">
                      <p>
                        Referral Link: https://matkawaale.com/?reffercode=
                        {refData.ref_code}
                      </p>
                      <button
                        className="buttoncopylink"
                        onClick={copyToClipboard}
                      >
                        Copy Link
                      </button>

                      <div className="whatsappicon">
                        <Link
                          className="w-100"
                          to={`whatsapp://send?text=गली दिसावर गेम खेलने वाले 
DOWNLOAD करे.....Matkawaale ऐप क्योंकि इसमें मिलता है आपको सबसे जायदा रेट 10के 980 रुपए और सबसे FAST एंड SAFE PAYMENT
 https://matkawaale.com/?reffercode=${refData.ref_code}`}
                        >
                          <img src={whatsapp} alt="whatsapp" />
                        </Link>
                      </div>
                    </div>

                    {/* ⚠️ Chat SUPPORT💥 के ज़रिए Admin से संपर्क करें और अपना
                    Bonus Commission ON करवाएं, ताकि आप अपना रेफरल BONUS
                    Commission बिना किसी रुकावट के आसानी से प्राप्त कर सकें। जब
                    तक आप इसे ON नहीं करवाएंगे, तब तक आपका BOnus Commission
                    मिलना शुरू नहीं होगा। ⚠️ */}
                  </div>
                  {/* <div className="refer_whatsapp">
                    <div className="">
                      <div
                        class="refercodedesign text-center border_custum"
                        role="alert"
                      ></div>
                      <div className="refer_field d-flex justify-content-between align-items-center">
                        <div className="d-flex justify-content-between align-items-center w-100">
                          <div className="refercode_new w-100 d-flex justify-content-between align-items-center">
                            <div className=" d-flex w-100 justify-content-between align-items-center gap-2">
                              <h6 className="text-dark redeem mb-0">
                                Refer Code
                              </h6>
                              <div className="d-flex gap-2">
                                <p className="mb-0"> {refData.ref_code}</p>
                                <i
                                  class="bi bi-copy text-dark"
                                  onClick={copyToClipboard}
                                ></i>
                              </div>
                              <div className="whatsappicon">
                                <Link
                                  className="w-100"
                                  to={`whatsapp://send?text=अब आप REFERAL CODE से अपने दोस्तो को जोड़ के भी 10 परसेंट पैसा कमा सकते हैं मेरा रेफरल कोड  👇  ${refData.ref_code} है https://matkawaale.com/`}
                                >
                                  <img src={whatsapp} alt="whatsapp" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {apiResponse !== 0 ? (
                        <div className="refer_field p-2 d-flex justify-content-between align-items-center">
                          <h6 className="text-dark redeem mb-0">Refer By</h6>
                          <div className="d-flex gap-2 align-items-center">
                            <div className="d-flex align-items-center gap-2">
                              <div className="">
                                <input
                                  type="text"
                                  value={
                                    refData.ref_by
                                      ? refData.ref_by
                                      : updatedRefercode
                                  }
                                  onChange={(e) =>
                                    setUpdatedRefercode(e.target.value)
                                  }
                                  placeholder={
                                    refData.ref_by
                                      ? "Enter new refer"
                                      : "Enter refer code"
                                  }
                                  className="form-control cusutmform"
                                />
                              </div>

                              {loadButton && showButton && (
                                <div className="">
                                  <button
                                    type="button"
                                    onClick={updateReferCode}
                                    className="playgames checkicon w-100"
                                    disabled={
                                      loadingButton || !updatedRefercode
                                    }
                                  >
                                    <i class="bi bi-check2"></i>

                                    {loadingButton && (
                                      <Spinner animation="border" />
                                    )}
                                  </button>
                                </div>
                              )}

                              {error && <p className="text-danger">{error}</p>}
                            </div>
                          </div>
                          <div></div>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div> */}
                  <div className="bonusreport">
                    <h3>Refer And Earn</h3>
                  </div>
                  <div className="marquee_bonus"></div>
                  <div className="bonuscommison text-center">
                    Total Commission ₹ {Lavel1Com + Lavel2Com}
                  </div>
                </div>
              </div>
            </div>
          </section>
          <div className="container-fluid">
            <h5 className="my-4 text-white d-flex justify-content-between align-items-center w-100 text-center reportingtable">
              <div className="gameplayed">
                <span className="gameplayedlevel"> Played</span>{" "}
                <span className="amountgame">
                  ₹{Lavel1ComSettle > 0 ? totalPlayedTotalLavel1 : 0}
                </span>
              </div>
              <div className="gameplayed">
                <span className="gameplayedlevel"> Win </span>{" "}
                <span className="amountgame">
                  ₹ {Lavel1ComSettle > 0 ? totalWinTotalLavel1 : 0}
                </span>
              </div>
              {/* <div className="gameplayed">
                <span className="gameplayedlevel"> Played Level 2 </span>
                <span className="amountgame">₹ {totalPlayedTotalLavel2}</span>
              </div> */}
              {/* <div className="gameplayed">
                <span className="gameplayedlevel"> Win Level 2 </span>
                <span className="amountgame">₹ {totalWinTotalLavel2}</span>
              </div> */}
              <div className="gameplayed">
                <span className="gameplayedlevel"> Commission </span>
                {/* <span className="amountgame">₹ {Lavel1Com}</span> */}
                <span className="amountgame">
                  ₹{" "}
                  {level1Data &&
                    (
                      level1Data.reduce((total, item) => {
                        return (
                          total +
                          (item.lavel1_totalPlayed - item.lavel1_totalWin)
                        );
                      }, 0) *
                      (LevelComission / 100)
                    ).toFixed(2)}
                </span>
              </div>
              <div className="gameplayed">
                {ComissionButtonVisible == 0 ? (
                  <span className="gameplayedlevel">
                    Rs.{" "}
                    {/* {level1Data &&
                      (
                        level1Data.reduce((total, item) => {
                          return (
                            total +
                            (item.lavel1_totalPlayed - item.lavel1_totalWin)
                          );
                        }, 0) *
                        (LevelComission / 100)
                      ).toFixed(2)}{" "} */}
                    {level1Data &&
                      Math.floor(
                        level1Data.reduce((total, item) => {
                          return (
                            total +
                            (item.lavel1_totalPlayed - item.lavel1_totalWin)
                          );
                        }, 0) *
                          (LevelComission / 100)
                      )}{" "}
                    {isLoadingReddem &&
                      level1Data &&
                      level1Data.reduce((total, item) => {
                        return (
                          total +
                          (item.lavel1_totalPlayed - item.lavel1_totalWin)
                        );
                      }, 0) *
                        (LevelComission / 100) >
                        0 && (
                        <button
                          className="buttoncopylink"
                          style={{ background: "#60ce13" }}
                          onClick={() =>
                            handleRedeemClick(
                              Math.floor(
                                level1Data.reduce((total, item) => {
                                  return (
                                    total +
                                    (item.lavel1_totalPlayed -
                                      item.lavel1_totalWin)
                                  );
                                }, 0) *
                                  (LevelComission / 100)
                              )
                            )
                          }
                        >
                          Redeem Now
                        </button>
                      )}
                  </span>
                ) : (
                  <></>
                )}
              </div>

              {/* <div className="gameplayed">
                {ComissionButtonVisible == 1 ? (
                  <span className="gameplayedlevel">
                    Rs. {Lavel1ComSettle}{" "}
                    {isLoadingReddem && Lavel1ComSettle > 0 && (
                      <button
                        className="buttoncopylink"
                        style={{ background: "#60ce13" }}
                        onClick={() => handleRedeemClick(Lavel1ComSettle)}
                      >
                        Redeem Now
                      </button>
                    )}
                  </span>
                ) : (
                  <></>
                )}
              </div> */}
            </h5>
            <div className="mb-5">
              <Table
                striped
                bordered
                hover
                responsive
                className="tablecommisiion"
              >
                <thead>
                  <tr>
                    <th>Sr. No.</th>
                    <th>Mobile</th>
                    <th>Commission (%)</th>
                    {/* <th>Commission Level 2 (%)</th> */}
                    <th>Commission</th>
                    <th>Commission Amount</th>
                    {/* <th>Child Commission</th> */}
                    <th>Game Played</th>
                    <th>Win Amount</th>
                    {/* <th>Game Played Level 2</th>
                    <th>Win Amount Level 2</th> */}
                    {/* <th>Action</th> */}
                  </tr>
                </thead>
                <tbody>
                  {level1Data &&
                    level1Data.map((item, index) => {
                      // const losses =
                      //   item.lavel1_totalPlayed >= item.lavel1_totalWin
                      //     ? item.lavel1_totalPlayed - item.lavel1_totalWin
                      //     : 0;
                      const losses =
                        item.lavel1_totalPlayed - item.lavel1_totalWin;

                      const lossPercentage =
                        LevelComission > 0
                          ? ((losses * LevelComission) / 100).toFixed(2)
                          : "0";

                      const lossesChild =
                        item.lavel2_totalPlayed >= item.lavel2_totalWin
                          ? item.lavel2_totalPlayed - item.lavel2_totalWin
                          : 0;

                      const lossPercentageChild =
                        Level1mydata.level2_com > 0
                          ? (
                              (lossesChild * Level1mydata.level2_com) /
                              100
                            ).toFixed(2)
                          : "0";

                      const total = 100;

                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.mob}</td>
                          <td>{LevelComission}</td>
                          {/* <td>{Level1mydata.level2_com}</td> */}
                          <td>
                            {item.lavel1_totalPlayed >= item.lavel1_totalWin ? (
                              <>{Math.max(lossPercentage, 0)}</>
                            ) : (
                              <>{Math.max(lossPercentage, 0)}</>
                            )}
                          </td>
                          {/* <td>
                            {item.lavel2_totalPlayed >= item.lavel2_totalWin ? (
                              <>{lossPercentageChild}</>
                            ) : (
                              <>0</>
                            )}
                          </td> */}
                          <td>
                            <td>
                              {Math.max(
                                item.lavel1_totalPlayed - item.lavel1_totalWin,
                                0
                              )}
                            </td>
                          </td>
                          <td>{item.lavel1_totalPlayed}</td>
                          <td>{item.lavel1_totalWin}</td>
                          {/* <td>{item.lavel2_totalPlayed}</td>
                          <td>{item.lavel2_totalWin}</td> */}
                          {/* <td> */}{" "}
                          {/* <Link
                              to={`/Reffer-Report-lavel2/${item.user_id}`}
                              className="buttonpage1"
                            >
                              <span>View</span>
                            </Link> */}
                          {/* </td> */}
                        </tr>
                      );
                    })}
                  <tr>
                    {/* <td></td>
                    <td></td> */}
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                      <strong>
                        {level1Data &&
                          level1Data.reduce((total, item) => {
                            return (
                              total +
                              (item.lavel1_totalPlayed - item.lavel1_totalWin)
                            );
                          }, 0)}
                      </strong>
                    </td>
                    <td>
                      <strong>{totalPlayedTotalLavel1}</strong>
                    </td>
                    <td>
                      <strong>{totalWinTotalLavel1}</strong>
                    </td>
                    {/* <td>
                      <strong>{totalPlayedTotalLavel2}</strong>
                    </td> */}
                    {/* <td>
                      <strong>{totalWinTotalLavel2}</strong>
                    </td> */}
                    {/* <td></td> */}
                  </tr>
                </tbody>
              </Table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
