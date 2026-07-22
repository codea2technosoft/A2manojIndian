import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";
import Loader from "../Common/Loader";

function UserSetting() {
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const token = localStorage.getItem("token");
  const [AdminData, setAdminDataNEW] = useState({});
  const { id } = useParams();

  const initialSettings = {
    BOOK_MAKER: {
      minBet: 10,
      maxBet: 5000000,
      maxProfit: 50000000,
      maxMarketProfit: 5000000,
      maxLiability: 5000000,
      maxMarketLiability: 5000000,
      betDelay: 0,
      commissionIn: 0,
      commissionOut: 0,
    },

    BOTH_TEAMS_TO_SCORE: {
      minBet: 20,
      maxBet: 4000000,
      maxProfit: 40000000,
      maxMarketProfit: 4000000,
      maxLiability: 4000000,
      maxMarketLiability: 4000000,
      betDelay: 1,
      commissionIn: 1,
      commissionOut: 1,
    },

    CORRECT_SCORE: {
      minBet: 30,
      maxBet: 3000000,
      maxProfit: 30000000,
      maxMarketProfit: 3000000,
      maxLiability: 3000000,
      maxMarketLiability: 3000000,
      betDelay: 2,
      commissionIn: 2,
      commissionOut: 2,
    },
    FANCY: {
      minBet: 30,
      maxBet: 3000000,
      maxProfit: 30000000,
      maxMarketProfit: 3000000,
      maxLiability: 3000000,
      maxMarketLiability: 3000000,
      betDelay: 2,
      commissionIn: 2,
      commissionOut: 2,
    },
    FOOTBALL_BOOKMAKER: {},
    FOOTBALL_FANCY: {},
    FOOTBALL_MATCH_ODDS: {},
    FOOTBALL_ODD_EVEN: {},
    FOOTBALL_OVER_UNDER: {},
    FOOTBALL_TO_WIN_THE_TOSS: {},
    HORSE_RACING: {},
    KABADDI: {},
    KABADDI_FANCY: {},
    MATCH_ODDS: {},
    ODD_EVEN: {},
    OVER_UNDER: {},
    TENNIS_BOOKMAKER: {},
    TENNIS_FANCY: {},
    TENNIS_MATCH_ODDS: {},
    TO_WIN_THE_TOSS: {},
  };

  const [activeTab, setActiveTab] = useState("BOOK_MAKER");
  const [settings, setSettings] = useState(initialSettings);

  const current = settings[activeTab];

  useEffect(() => {
    getUserSetting();
  }, []);

  const getUserSetting = async () => {
    try {
      setLoading(true);
      setTimeout(() => {
        setSettings(initialSettings);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load settings");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="card-body text-center">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <div className="card">
        <div className="card-header bgHeader bg-primary-yellow d-flex justify-content-between align-items-center">
          <h3 className="card-title mb-0">User Setting</h3>
        </div>
        <div className="card-body">
          <div className="setting_btns d-flex flex-nowrap overflow-auto gap-2">
            {Object.keys(settings).map((tab) => (
              <button
                key={tab}
                className={`btn  ${activeTab === tab ? "active btn-warning" : "btn-light"}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="row mt-3">
            <div className="col-md-4 mb-3">
              <label>Min Bet</label>

              <input
                className="form-control"
                value={current.minBet}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    [activeTab]: {
                      ...current,
                      minBet: e.target.value,
                    },
                  })
                }
              />
            </div>

            <div className="col-md-4 mb-3">
              <label>Max Bet</label>

              <input
                className="form-control"
                value={current.maxBet}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    [activeTab]: {
                      ...current,
                      maxBet: e.target.value,
                    },
                  })
                }
              />
            </div>

            <div className="col-md-4 mb-3">
              <label>Max Profit</label>

              <input
                className="form-control"
                value={current.maxProfit}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    [activeTab]: {
                      ...current,
                      maxProfit: e.target.value,
                    },
                  })
                }
              />
            </div>

            <div className="col-md-4 mb-3">
              <label>Max Market Profit</label>

              <input
                className="form-control"
                value={current.maxMarketProfit}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    [activeTab]: {
                      ...current,
                      maxMarketProfit: e.target.value,
                    },
                  })
                }
              />
            </div>

            <div className="col-md-4 mb-3">
              <label>Max Liability</label>

              <input
                className="form-control"
                value={current.maxLiability}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    [activeTab]: {
                      ...current,
                      maxLiability: e.target.value,
                    },
                  })
                }
              />
            </div>

            <div className="col-md-4 mb-3">
              <label>Max Market Liability</label>

              <input
                className="form-control"
                value={current.maxMarketLiability}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    [activeTab]: {
                      ...current,
                      maxMarketLiability: e.target.value,
                    },
                  })
                }
              />
            </div>

            <div className="col-md-4 mb-3">
              <label>Bet Delay</label>

              <input
                className="form-control"
                value={current.betDelay}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    [activeTab]: {
                      ...current,
                      betDelay: e.target.value,
                    },
                  })
                }
              />
            </div>

            <div className="col-md-4 mb-3">
              <label>Commission In</label>

              <input
                className="form-control"
                value={current.commissionIn}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    [activeTab]: {
                      ...current,
                      commissionIn: e.target.value,
                    },
                  })
                }
              />
            </div>

            <div className="col-md-4 mb-3">
              <label>Commission Out</label>

              <input
                className="form-control"
                value={current.commissionOut}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    [activeTab]: {
                      ...current,
                      commissionOut: e.target.value,
                    },
                  })
                }
              />
            </div>

            <div className="d-flex gap-2">
              <button className="btn btn-primary text-dark">
                Update Me And Down-line
              </button>

              <button className="btn btn-primary text-dark">Update Only Me</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserSetting;
