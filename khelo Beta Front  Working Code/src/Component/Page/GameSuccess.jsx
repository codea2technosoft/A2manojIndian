import React, { useState, useRef, useEffect } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import { LockOutlined, UserOutlined, HomeOutlined } from "@ant-design/icons";
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
import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";
const url = new URL(window.location.href);
const gameid = url.searchParams.get("id");
const url1 = new URL(window.location.href);
const name = url1.searchParams.get("name");

// alert(name);

// alert(gameid);
export default function GameSuccess() {
  const [gamename, setgamename] = useState([]);
  const [total_amount, settotal_amount] = useState([]);
  const [play_date, setplay_date] = useState([]);
  const [date_time, setdate_time] = useState([]);
  const [txn_id, settxn_id] = useState([]);
  const [bets, setbets] = useState([]);

  const navigate = useNavigate();
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

  useEffect(() => {
    var gamename = localStorage.getItem("marketName");
    var total_amount = localStorage.getItem("total_amount");
    var play_date = localStorage.getItem("play_date");
    var date_time = localStorage.getItem("date_time");
    var txn_id = localStorage.getItem("txn_id");
    var bets = JSON.parse(localStorage.getItem("bets"));
    setgamename(gamename);
    settotal_amount(total_amount);
    setplay_date(play_date);
    setdate_time(date_time);
    settxn_id(txn_id);
    setbets(bets);
    console.warn(bets);
  }, []);

  return (
    <>
      <section className="jodi p-0 bg-transparent shadow-none" id="jodi">
        <div className=" gameresult_design">
          <div className="container">
            <div className="row">
              <div className="col-md-6 offset-md-3">
                <div className="bgcustum border-2 p-3">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h3 className="text-dark">Receipt</h3>
                    </div>
                    <div>
                      <button className="btn_recipt" onClick={handleScreenshot}>
                        Save Reciept
                      </button>
                    </div>
                  </div>
                  <div ref={modalRef} className="p-3">
                    <div className="newgame">
                      <p className="mb-0 pb-0">
                        <strong>Game Name</strong> : <span> {gamename}</span>
                      </p>
                      <p className="mb-0 pb-0">
                        <strong>Total Bet Amount</strong> :{" "}
                        <span> RS {total_amount}</span>
                      </p>
                      <p className="mb-0 pb-0">
                        <strong>Play Date</strong> : <span> {play_date} </span>
                      </p>
                      <p className="mb-0 pb-0">
                        <strong>Date & Time</strong> :{" "}
                        <span> {date_time} </span>
                      </p>
                      <p className="mb-0 pb-0">
                        <strong>Transaction ID</strong> :{" "}
                        <span> {txn_id} </span>
                      </p>
                    </div>
                    <div className="number_number">
                      <p className="text-center">Numbers</p>
                    </div>
                    <div>
                      <ul className="liststyle_none">
                        {bets.map((item) => (
                          <li>
                            {item.betkey} = <span>{item.betamount} RS</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="home_btn d-flex gap-2 align-items-center justify-content-center text-center">
                    <Link
                      to="/Home"
                      className=" d-flex gap-2 align-items-center justify-content-center"
                    >
                      <HomeOutlined />
                      Home
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
