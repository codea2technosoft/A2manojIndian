import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import chat from "../../assets/img/chat.png";
import Button from "react-bootstrap/Button";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Help() {
  const [isLoading, setIsLoading] = useState(true);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  useEffect(() => {
    setTimeout(function () {
      setIsLoading(false);
    });
    return;
  }, []);
  const Depositchat = () => {
    window.location.href = `/Depositchat`;
  };
  const Withdrawalchat = () => {
    window.location.href = `/Withdrawalchat`;
  };
  return (
    <>
      <Modal
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={show}
        onHide={handleClose}
        animation={false}
      >
        <Modal.Header closeButton>Chat</Modal.Header>
        <Modal.Body className="p-0">
          <div className="d-flex">
            <div>
              <div className="buttonwithdrwal text-center">
                {/* <Link to='Withdrawalchat'> */}
                <button onClick={Withdrawalchat} className="refresh btn mb-2">
                  Withdrawal Chat
                </button>
                {/* </Link> */}
                <p className="text-white">
                  पैसे निकालने मैं अगर कोई समस्या है तो withdraw chat पे क्लिक
                  करे।
                </p>
              </div>
            </div>
            <div>
              <div className="buttonwithdrwal text-center">
                <Link to="Depositchat">
                  <button onClick={Depositchat} className="refresh btn mb-2">
                    Deposit Chat
                  </button>
                </Link>
                <p className="text-white">
                  पैसे ऐड करने मैं अगर आपको समस्या है तो deposit chat पे क्लिक
                  करे।
                </p>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <div className="chaticon">
        {/* <div type="button" class="email-bt">
          <div class="text-call" onClick={handleShow}>
            <i class="bi bi-chat-dots"></i>
            <span>
              Live
              <br />
              Chat
            </span>
          </div>
        </div> */}
      </div>
      {isLoading && (
        <div className="spinner-wrapper">
          <div className="loadernew2"></div>
        </div>
      )}

      {!isLoading && (
        <section id="Help" className="margin-bottom-88 mb-0">
          <div className="margin-bottom-88 mb-0">
            <div className="pb-4">
              <iframe
                src={`https://matkawaale.com/api/pages/help.php`}
                style={{ width: "100%", height: "75vh" }}
              />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
