import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import whatsapp from "../../../src/assets/img/WhatsApp_icon.png";
import Referafriend from "../../assets/img/Referafriend.gif";
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

export default function RefferreportLavel2() {
  const user_id = localStorage.getItem("userid");
  const devid = localStorage.getItem("dev_id");
  const [isLoading, setIsLoading] = useState(true);
  const [refData, setRefData] = useState({ ref_code: "", ref_by: "" });
  const [updatedRefercode, setUpdatedRefercode] = useState("");
  const [loadingButton, setLoadingButton] = useState(false);
  const [loadButton, setLoadButton] = useState(false);
  const [error, setError] = useState("");
  const [showButton, setShowButton] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
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
    getProfile();
    ReferCodeList();
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
      } else {
        console.error("API Error:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const [level1Data, setLevel1Data] = useState([]);
  const [Level1mydata, setLevel1mydata] = useState([]);
  const [level2Data, setLevel2Data] = useState([]);
  const [level1userData, setLevel1userData] = useState();
  const [level2userData, setLevel2userData] = useState();
  const [leveltotaluserData, setLeveltotaluserData] = useState();

  const ReferCodeList = async () => {
    const path = window.location.pathname;
    const segments = path.split("/");
    const user_id = segments[segments.length - 1];
    const app_id = process.env.REACT_APP_API_ID;
    const requestData = { user_id, app_id };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL_NODE}report-lavel2`,
        requestData,
        { headers: { "Content-Type": "application/json" } }
      );
      // alert(response.data.status);
      if (response.data.status == 1) {
        setLevel1Data(response.data.data);
        setLevel1mydata(response.data.mydata);
        // setLevel2Data(response.data.lavel2);

        // console.warn("total_win_level1", response.data.user.total_win_level1);
        // console.warn(
        //   "total_played_level1",
        //   response.data.user.total_played_level1
        // );
        // console.warn("totallevel1", response.data.user.level1_com);
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

  return (
    <div>
      {isLoading ? (
        <div className="spinner_wrappers  ">
          <Spinner animation="border " />
        </div>
      ) : (
        <>
          <div className="container-fluid">
            <h5 className="my-4 text-white d-flex justify-content-between align-items-center w-100 text-center reportingtable"></h5>
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
                    {/* <th><InputGroup.Checkbox />Select All</th> */}
                    <th>Sr. No.</th>
                    <th>Mobile</th>
                    <th>Commission Lavel 2 (%)</th>
                    <th>Commission</th>
                    <th>Game Played Level 2</th>
                    <th>Win Amount Level 2</th>
                  </tr>
                </thead>
                <tbody>
                  {level1Data &&
                    level1Data.map((item, index) => {
                      const lossesChild =
                        item.lavel1_totalPlayed >= item.lavel1_totalWin
                          ? item.lavel1_totalPlayed - item.lavel1_totalWin
                          : 0;

                      const lossPercentageChild =
                        Level1mydata.level2_com > 0
                          ? (
                              (lossesChild * Level1mydata.level2_com) /
                              100
                            ).toFixed(2)
                          : "0";

                      return (
                        <tr key={index}>
                          {/* <td><InputGroup.Checkbox /></td> */}
                          <td>{index + 1}</td>
                          <td>{item.mob}</td>
                          <td>{Level1mydata.level2_com}</td>

                          <td>
                            {item.lavel1_totalPlayed >= item.lavel1_totalWin ? (
                              <>{lossPercentageChild}</>
                            ) : (
                              <>0</>
                            )}
                          </td>
                          <td>{item.lavel1_totalPlayed}</td>
                          <td>{item.lavel1_totalWin}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
