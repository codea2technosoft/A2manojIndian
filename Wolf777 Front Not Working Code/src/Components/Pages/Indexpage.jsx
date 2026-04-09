import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import "./Indexpage.scss";

import profile from "../../assets/images/profile.png";
import password from "../../assets/images/password.png";
import chat from "../../assets/images/chat.png";
import bankstatement from "../../assets/images/bankstatement.png";
import casino from "../../assets/images/casino.png";
import cricket from "../../assets/images/cricket.png";
import matka from "../../assets/images/matka.png";
import rule from "../../assets/images/rule.png";
import deposit from "../../assets/images/deposit.png";
import withdraw from "../../assets/images/withdraw.png";
import ladger from "../../assets/images/ladger.png";
import { FaRocketchat } from "react-icons/fa";


const COMPANY_NAME = {
  english: "wolff777",
  hindi: "wolff777",
};
const modelcontent = {
  english: {
    title: "Rules And Regulations",
    intro: `Dear Customer, before withdrawing balance from your ${COMPANY_NAME.english} account and before placing bets, please read the Terms and Conditions carefully. If you agree, you may start playing on ${COMPANY_NAME.english}.`,

    sections: [
      {
        title: "General Rules",
        rules: [
          "If any event or game is entered in error, the user shall always have the right to correct it. The correct result for the game or event may be entered within 48 to 72 hours after the result has been entered or at any time.",
          "If the Client uses the coins added by a wrong result declared, then the Client will have to pay for the coins used when the result is corrected, or the coins will be minused or deducted from the Client's ID. The Client can bet on this site only if he agrees to these terms.",
          "In this case, no dispute of any kind will be entertained later either with the Agent or by the Agent with the Company. If the Agent has already informed these conditions to its Client, no argument or dispute of any kind will be entertained later.",

        ]
      },

    ],
  },

  hindi: {
    title: "नियम और शर्तें",
    intro: `प्रिय ग्राहक, ${COMPANY_NAME.hindi} में खेलने से पहले नियम और शर्तें ध्यान से पढ़ें।`,

    sections: [
      {
        title: "सामान्य नियम",
        rules: [
          "किसी भी इवेंट या खेल का परिणाम गलती से दर्ज होने पर, उसे सही करने का अधिकार हमेशा रहेगा। परिणाम दर्ज होने के बाद से 48 से 72 घंटों के अंदर या कभी भी उस खेल या इवेंट का सही परिणाम दर्ज किया जा सकता है।",
          "यदि ग्राहक घोषित ग़लत रिजल्ट के द्वारा बड़े हुये कॉइन का यूज़ करता है तो रिजल्ट सही किए जाने पर इस्तेमाल किए गए कॉइन का भुगतान ग्राहक को ख़ुद करना पड़ेगा, या ग्राहक की आईडी से कॉइन माइनस या काट लिए जाएँगे यदि ग्राहक इन शर्तों से सहमत होता है, तो ही वह इस साइट पर बैटिंग कर सकता है।",
          "इस स्थिति में बाद में किसी भी प्रकार का विवाद न तो एजेंट के साथ और न ही एजेंट के द्वारा कंपनी के साथ स्वीकार किया जाएगा। यदि एजेंट ने इन शर्तों को पहले ही अपने ग्राहक को बता दे , बाद में किसी भी प्रकार का तर्क या विवाद स्वीकार नहीं किया जाएगा।",

        ]
      },

    ],


  },
};

const RULES_ACCEPTED_KEY = "rules_tc_accepted";


function Indexpage() {
  const [modalLanguage, setModalLanguage] = useState("english");
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const agreed = localStorage.getItem("rulesAgreed");

    if (!agreed) {
      setShowModal(true);
    }
  }, []);

  // const backendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
  // const backendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  // const nodeMode = process.env.NODE_ENV;
  // const baseUrl = nodeMode === "development" ? backendLocalApiUrl : backendLiveApiUrl;

    const baseUrl = process.env.REACT_APP_BACKEND_API;


  const modalContent = modelcontent[modalLanguage];

const cards = [

     
    { title: "IN PLAY", link: "/", img: cricket },
     { title: "Chat", link: "/Chat", img: chat },
    { title: "Deposit", link: "/depositPage", img: deposit, class:"blinkall" },
    { title: "Withdraw", link: "/withdraw-page", img: withdraw },
    // { title: "CASINO", link: "/commingsooncasino", img: casino, commingsoon: "Coming Soon" },
    // { title: "MATKA", link: "/commingsoon", img: matka, commingsoon: "Coming Soon" },
    { title: "STATEMENT", link: "/statementaccount", img: bankstatement },
    // { title: "LEDGER", link: "/ledger", img: ladger },
    { title: "PROFILE", link: "/my-profile", img: profile },
    { title: "RULES", link: "/rules", img: rule },
    // { title: "PASSWORD", link: "/changepassword", img: password },
  
  ];

  // const cards = [
  //   { title: "IN PLAY", link: "/", img: cricket },
  //   { title: "CASINO", link: "/", img: casino, commingsoon: "Coming Soon" },
  //   { title: "MATKA", link: "/", img: matka, commingsoon: "Coming Soon" },
  //   { title: "STATEMENT", link: "/statementaccount", img: bankstatement },
  //   { title: "LEDGER", link: "/ledger", img: ladger },
  //   { title: "PROFILE", link: "/my-profile", img: profile },
  //   { title: "RULES", link: "/rules", img: rule },
  //   { title: "PASSWORD", link: "/changepassword", img: password },
  // ];

  const handleAgree = () => {
    localStorage.setItem("rulesAgreed", "true");
    setShowModal(false);
  };
  // useEffect(() => {
  //   document.body.addEventListener("click", handleAgree);

  //   return () => {
  //     document.body.removeEventListener("click", handleAgree);
  //   };
  // }, []);
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("token");
    const isAgreed = localStorage.getItem("rulesAgreed");

    if (isLoggedIn && !isAgreed) {
      setShowModal(true);
    }
  }, []);




  return (
    <div className="indexpage">
      <Navbar />

      <div className="main-layout d-flex align-items-start bg_new_iamge_all">
        <div className="main-content bg-transparent shadow-none">
       

          <div className="container">
            <div className="row g-4 justify-content-start">

              {cards.map((card, index) => (
                <div
                  key={index}
                  className="col-6 col-sm-6 col-md-6 col-lg-6 text-center"
                  onClick={() => navigate(card.link)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="icons_home dash-icons position-relative">
                    <div className="iconsbody">
                      <img src={card.img} alt={card.title} />
                    </div>

                    {card.commingsoon && (
                      <div className="commingsoon blink" >
                        {card.commingsoon}
                      </div>
                    )}
                 <div className={`${card.title === "Deposit" ? "blinkall" : ""} dash-title`}>
{card.title}</div>
                  </div>

                </div>
              ))}

            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="rules-tc-overlay" onClick={handleAgree}>
          <div className="rules-tc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="rules-tc-header">
              <h4>{modalContent.title}</h4>
              <button
                className="rules-tc-close"
                onClick={handleAgree}
              >
                ×
              </button>
            </div>

            <div className="rules-tc-body">
              <div className="d-flex justify-content-center align-items-center">
                <div className="rules-tc-lang">
                  <button
                    className={`fillterbutton_new ${modalLanguage === "english" ? "active" : ""}`}
                    onClick={() => setModalLanguage("english")}
                  >
                    English
                  </button>
                  <button
                    className={`fillterbutton_new ${modalLanguage === "hindi" ? "active" : ""}`}
                    onClick={() => setModalLanguage("hindi")}
                  >
                    हिंदी
                  </button>
                </div>
              </div>

              {modalContent.sections.slice(0, 4).map((section, sectionIndex) => (
                <div key={sectionIndex} className="rules-section">
                  <h5>{section.title}</h5>
                  {section.rules.map((rule, index) => (
                    <p key={index} className="rule-item">
                      <strong>{index + 1}.</strong> {rule}
                    </p>
                  ))}
                </div>
              ))}
            </div>

            <div className="rules-tc-footer">
              <button
                className="rules-tc-agree-btn"
                onClick={handleAgree}
              >
                {modalLanguage === "english"
                  ? "I Agree"
                  : "मैं सहमत हूँ"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Indexpage;
