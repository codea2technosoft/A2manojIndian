import React, { useState, useEffect } from "react";
import axios from "axios";
import jQuery from "jquery";
import { Link } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ReactHtmlParser from "react-html-parser";
import $ from "jquery";
import Play from "./Page/Play";
import Wallet from "./Page/Wallet";
import chat from "../assets/img/sodapdf-converted.gif";
import question from "../assets/img/question.png";
import profile from "../assets/img/logo.png";
import logo from "../assets/img/logo.png";
import hands from "../assets/img/hands.png";

export default function Footer() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();
  const [users, setUsers] = useState([{}]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      handleShow();
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const handleReload = () => {
    window.scrollTo(0, 0);
  };

  const Helpss = () => {
    navigate("/Help");
  };
  const Withdrawalchat = () => {
    navigate("/Depositchat");
  };

  const [activeIndex, setActiveIndex] = useState(null);
  const handleClick = (index) => {
    setActiveIndex(index);
  };
  return (
    <>
      <div className="footer-menu">
        <div className="menufooter">
          <ul>
            <li className="menu ">
              <div
                className={
                  activeIndex === 0 ? "activemenu " : "inactive iconmenu"
                }
              >
                <Link
                  to="/Home"
                  onClick={() => {
                    handleReload();
                    handleClick(0);
                  }}
                  className="buttonpage"
                >
                  <i class="bi bi-house-door-fill"></i>
                  <span>Home</span>
                </Link>
              </div>
            </li>
            <li className="menu">
              <div
                className={
                  activeIndex === 1 ? "activemenu " : "inactive iconmenu"
                }
              >
                <Link
                  to="/Play"
                  onClick={() => {
                    handleReload();
                    handleClick(1);
                  }}
                  className="buttonpage"
                >
                  <i class="bi bi-controller"></i>
                  <span> Play</span>
                </Link>
              </div>
            </li>
            <li className="menu">
              <div
                className={
                  activeIndex === 3 ? "activemenu " : "inactive iconmenu"
                }
              >
                <Link
                  to="/wallet"
                  onClick={() => {
                    handleReload();
                    handleClick(3);
                  }}
                  className="buttonpage"
                >
                  <i class="bi bi-wallet2"></i>
                  <span> Wallet</span>
                </Link>
              </div>
            </li>

            <li className="menu">
              <div className="iconmenu">
                <Link to="/Help" className="buttonpage">
                  {/* <div className="helpbox">
                    <img src={question} />
                  </div> */}
                  <i class="bi bi-info-square"></i>
                  <span> Help</span>
                </Link>
              </div>
            </li>
          </ul>
        </div>
      </div>
      {/* <Modal
        aria-labelledby="contained-modal-title-vcenter newmodel"
        centered
        show={show}
        onHide={handleClose}
        animation={false}
      > */}
        {/* <Modal.Header closeButton>Welcome Back</Modal.Header> */}
        {/* <Modal.Body className="p-0"> */}
          {/* <p className="text-white text-center m-2 popupheadinghelp">
            अगर आपको पैसा एड करने मैं, पैसा निकालने मैं और गेम खेलने मैं कोई
            समस्या होती है तो आप HELP मैं जाके हमसे बात भी कर सकते हो.
          </p> */}

          {/* <p className="text-white text-center m-2 popupheadinghelp">
            2. आप जो भी राशि जमा करेंगे उसमें आपको 5% का बोनस दिया जाएगा.
          </p> */}
          {/* <div className="d-flex justify-content-center align-items-center m-3">
            <div className="buttonwithdrwal text-center">
              <button
                onClick={Withdrawalchat}
                className="btn mb-2 chat_popup me-3 fw-bold"
              >
                Chat
              </button>
            </div>
            <div className="buttonwithdrwal text-center">
              <img style={{ width: 80 }} src={profile}></img>
            </div>
            <div className="buttonwithdrwal text-center">
              <button
                onClick={Helpss}
                className="chat_popup btn mb-2 ms-2 fw-bold"
              >
                Help
              </button>
            </div>
          </div> */}
        {/* </Modal.Body> */}
      {/* </Modal> */}
    </>
  );
}
