import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";
import Loader from "../Common/Loader";

function IcasinoSetting() {
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
    ICASINO: {
      minBet: 10,
      maxBet: 1000000,
      maxProfit: 10000000,
      maxMarketProfit: 0,
      maxLiability: 0,
      maxMarketLiability: 0,
    },
  };

  const [activeTab, setActiveTab] = useState("ICASINO");
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
          <h3 className="card-title mb-0">ICasino Setting</h3>
          <div className="d-flex gap-2">
            <button className="btn btn-light" onClick={() => navigate(-1)}>
              Back
            </button>
          </div>
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

          {loading ? (
            <div className="table_loader">
              <div className="py-5 text-center">
                <Loader />
              </div>
            </div>
          ) : <div className="row mt-3 user_setting">
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

            <div className="d-flex gap-2 justify-content-start">
              <button className="btn btn-primary text-dark">Save</button>
            </div>
          </div>}
        </div>
      </div>
    </>
  );
}

export default IcasinoSetting;
