import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../Common/Loader";
import { getCasinoSettingValues, updateCasinoSettingValues } from "../Server/api";

function CasinoSetting() {
  const navigate = useNavigate();
  const { adminId } = useParams();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settings, setSettings] = useState({
    min_bet: "",
    max_bet: "",
    max_profit: "",
    max_market_profit: "",
    max_liability: "",
    max_market_liability: "",
  });

  useEffect(() => {
    if (adminId) {
      fetchCasinoSettings();
    }
  }, [adminId]);

  const fetchCasinoSettings = async () => {
    try {
      setLoading(true);
      const payload = { admin_id: adminId };
      const response = await getCasinoSettingValues(payload);
      console.log("Casino Settings Response:", response);

      if (response.data && response.data.success) {
        const data = response.data.data;
        setSettings({
          min_bet: data.min_bet || "",
          max_bet: data.max_bet || "",
          max_profit: data.max_profit || "",
          max_market_profit: data.max_market_profit || "",
          max_liability: data.max_liability || "",
          max_market_liability: data.max_market_liability || "",
        });
      } else {
        toast.warning("Using default settings");
        setDefaultSettings();
      }
    } catch (error) {
      console.error("Error fetching casino settings:", error);
      toast.error("Failed to load casino settings");
      setDefaultSettings();
    } finally {
      setLoading(false);
    }
  };

  const setDefaultSettings = () => {
    setSettings({
      min_bet: "10",
      max_bet: "1000000",
      max_profit: "10000000",
      max_market_profit: "1000000",
      max_liability: "1000000",
      max_market_liability: "1000000",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Validate all fields are filled
      for (let key in settings) {
        if (!settings[key] || settings[key] === "") {
          toast.error(`Please fill ${key.replace(/_/g, ' ').toUpperCase()}`);
          setIsSubmitting(false);
          return;
        }
      }

      const payload = {
        admin_id: adminId,
        min_bet: parseFloat(settings.min_bet) || 0,
        max_bet: parseFloat(settings.max_bet) || 0,
        max_profit: parseFloat(settings.max_profit) || 0,
        max_market_profit: parseFloat(settings.max_market_profit) || 0,
        max_liability: parseFloat(settings.max_liability) || 0,
        max_market_liability: parseFloat(settings.max_market_liability) || 0,
      };

      const response = await updateCasinoSettingValues(payload);
      console.log("Update Response:", response);

      if (response.data && response.data.success) {
        toast.success("Casino settings updated successfully!");
        await fetchCasinoSettings();
      } else {
        toast.error(response.data?.message || "Failed to update settings");
      }
    } catch (error) {
      console.error("Error updating casino settings:", error);
      toast.error(error.response?.data?.message || "Error updating settings");
    } finally {
      setIsSubmitting(false);
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
          <h3 className="card-title mb-0">Casino Setting</h3>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-light" onClick={() => navigate(-1)}>
              Back
            </button>
          </div>
        </div>
        <div className="card-body">
          {/* Admin ID Display */}
          <div className="mb-3">
            <span className="fw-bold">Admin ID: </span>
            <span>{adminId || "-"}</span>
          </div>

          <div className="row mt-3">
            <div className="col-md-4 mb-3">
              <label className="fw-bold">Min Bet</label>
              <input
                type="number"
                name="min_bet"
                className="form-control"
                value={settings.min_bet}
                onChange={handleChange}
                placeholder="Enter min bet"
              />
            </div>

            <div className="col-md-4 mb-3">
              <label className="fw-bold">Max Bet</label>
              <input
                type="number"
                name="max_bet"
                className="form-control"
                value={settings.max_bet}
                onChange={handleChange}
                placeholder="Enter max bet"
              />
            </div>

            <div className="col-md-4 mb-3">
              <label className="fw-bold">Max Profit</label>
              <input
                type="number"
                name="max_profit"
                className="form-control"
                value={settings.max_profit}
                onChange={handleChange}
                placeholder="Enter max profit"
              />
            </div>

            <div className="col-md-4 mb-3">
              <label className="fw-bold">Max Market Profit</label>
              <input
                type="number"
                name="max_market_profit"
                className="form-control"
                value={settings.max_market_profit}
                onChange={handleChange}
                placeholder="Enter max market profit"
              />
            </div>

            <div className="col-md-4 mb-3">
              <label className="fw-bold">Max Liability</label>
              <input
                type="number"
                name="max_liability"
                className="form-control"
                value={settings.max_liability}
                onChange={handleChange}
                placeholder="Enter max liability"
              />
            </div>

            <div className="col-md-4 mb-3">
              <label className="fw-bold">Max Market Liability</label>
              <input
                type="number"
                name="max_market_liability"
                className="form-control"
                value={settings.max_market_liability}
                onChange={handleChange}
                placeholder="Enter max market liability"
              />
            </div>

            <div className="d-flex gap-2 justify-content-start mt-2">
              <button 
                className="btn btn-primary text-dark py-2 px-4" 
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </span>
                    Saving...
                  </>
                ) : (
                  'Save'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CasinoSetting;