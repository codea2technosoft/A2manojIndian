import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAdminDetails, updateClient } from "../Server/api";

const UpdateSuperAgentAdmin = () => {
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = localStorage.getItem("token");
  const role = "2";
  const isInitialMount = useRef(true);
  const hasFetchedData = useRef(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    super_admin_id: "",
    admin_id: "",
    amount: 0,
    coins: 0,
    min_withdraw: 0,
    max_withdraw: 0,
    odd_min: 0,
    odd_max: 0,
    bookmaker_min: 0,
    bookmaker_max: 0,
    match_share: 0,
    commission_type: 1,
    match_comm: 0,
    session_comm: 0,
    commission_rate: 0,
    active: "1",
  });
  const isNoCommission = formData.commission_type === "0";

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (hasFetchedData.current || !id || !token) return;

    fetchSuperAgentData();
    hasFetchedData.current = true;

    return () => {
      hasFetchedData.current = false;
    };
  }, [id, token]);

  useEffect(() => {
    if (id && token && !hasFetchedData.current) {
      fetchSuperAgentData();
      hasFetchedData.current = true;
    }
  }, []);

  const fetchSuperAgentData = async () => {
    setLoading(true);

    try {
      const response = await getAdminDetails({
        admin_id: id,
        role: role,
      });

      if (response.data.success) {
        const agentData = response.data.data;

        setFormData({
          username: agentData.username || "",
          password: agentData.password || "",
          super_admin_id: agentData.super_admin_id || "",
          admin_id: agentData.admin_id || "",
          amount: agentData.amount || 0,
          coins: agentData.coins || 0,
          min_withdraw: agentData.min_withdraw || 0,
          max_withdraw: agentData.max_withdraw || 0,
          odd_min: agentData.odd_min || 0,
          odd_max: agentData.odd_max || 0,
          bookmaker_min: agentData.bookmaker_min || 0,
          bookmaker_max: agentData.bookmaker_max || 0,
          match_share: agentData.match_share || 0,
          commission_type: agentData.commission_type?.toString() || "1",
          match_comm: agentData.match_comm || 0,
          session_comm: agentData.session_comm || 0,
          commission_rate: agentData.commission_rate || 0,
          active: agentData.active?.toString() || "1",

          football_comm: agentData.football_comm || 0,
          tennis_comm: agentData.tennis_comm || 0,
          horse_racing_comm: agentData.horse_racing_comm || 0,
          greyhound_racing_comm: agentData.greyhound_racing_comm || 0,
          politics_comm: agentData.politics_comm || 0,
          casino_comm: agentData.casino_comm || 0,
        });

        toast.success(response.data?.message);
      } else {
        toast.error(response.data?.message);
      }
    } catch (error) {
      console.error(error);

      const apiMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Server error loading data";

      toast.error(apiMessage);
    } finally {
      setLoading(false);
    }
  };

  const blockInvalidKeys = (e) => {
    const key = e.key;

    // Allowed: Only digits + backspace + tab + arrows
    const allowedKeys = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
    ];

    // ❌ If key is not a digit AND not an allowed special key → block it
    if (!/^\d$/.test(key) && !allowedKeys.includes(key)) {
      e.preventDefault();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      let updated = { ...prev, [name]: value };

      // Commission Type change
      if (name === "commission_type") {
        if (value === "0") {
          updated.match_comm = 0;
          updated.session_comm = 0;
          updated.football_comm = 0;
          updated.tennis_comm = 0;
          updated.horse_racing_comm = 0;
          updated.greyhound_racing_comm = 0;
          updated.politics_comm = 0;
          updated.casino_comm = 0;
        }
        return updated;
      }

      
      // Match & Session Commission Validation + Auto Change Commission Type
      if (name === "match_comm" || name === "session_comm") {
        const result = validateCommission(value);
        if (!result.valid) return prev;

        const matchComm =
          name === "match_comm" ? Number(value) : Number(updated.match_comm);

        const sessionComm =
          name === "session_comm"
            ? Number(value)
            : Number(updated.session_comm);

        // 👉 Auto set Commission Type
        updated.commission_type =
          matchComm === 0 && sessionComm === 0 ? "0" : "1";
      }

      return updated;
    });
  };

  const validateCommission = (value) => {
    // empty allow
    if (value === "") return { valid: true, value };

    const num = Number(value);

    if (isNaN(num)) {
      return { valid: false, message: "Sirf number allow hai ❌" };
    }

    if (num < 0 || num > 100) {
      return {
        valid: false,
        message: "Commission 0 se 100 ke beech honi chahiye 🚫",
      };
    }

    return { valid: true, value: num };
  };

  const handleSubmit = async (e) => {
    const matchCheck = validateCommission(formData.match_comm);
    const sessionCheck = validateCommission(formData.session_comm);
    if (!matchCheck.valid || !sessionCheck.valid) {
      setIsSubmitting(false);
      return;
    }
    e.preventDefault();
    setValidated(true);
    setIsSubmitting(true);

    try {
      const payload = {
        admin_id: id,
        role: 2,
        username: formData.username,
        password: formData.password,
        super_admin_id: formData.super_admin_id,
        min_withdraw: Number(formData.min_withdraw),
        max_withdraw: Number(formData.max_withdraw),
        amount: Number(formData.amount),
        coins: Number(formData.coins),
        odd_min: Number(formData.odd_min),
        odd_max: Number(formData.odd_max),
        bookmaker_min: Number(formData.bookmaker_min),
        bookmaker_max: Number(formData.bookmaker_max),
        match_share: Number(formData.match_share),
        commission_type: Number(formData.commission_type),
        match_comm:
          formData.commission_type === "0" ? 0 : Number(formData.match_comm),

        // session_comm:
        //   formData.commission_type === "0" ? 0 : Number(formData.session_comm),

        commission_rate: Number(formData.commission_rate),
        active: Number(formData.active),
        // football_comm: Number(formData.football_comm),
        // tennis_comm: Number(formData.tennis_comm),
        // horse_racing_comm: Number(formData.horse_racing_comm),
        // greyhound_racing_comm: Number(formData.greyhound_racing_comm),
        // politics_comm: Number(formData.politics_comm),
        // casino_comm: Number(formData.casino_comm),
        football_comm:
          formData.commission_type === "0"
            ? 0
            : Number(formData.football_comm),

        tennis_comm:
          formData.commission_type === "0"
            ? 0
            : Number(formData.tennis_comm),

        horse_racing_comm:
          formData.commission_type === "0"
            ? 0
            : Number(formData.horse_racing_comm),

        greyhound_racing_comm:
          formData.commission_type === "0"
            ? 0
            : Number(formData.greyhound_racing_comm),

        politics_comm:
          formData.commission_type === "0"
            ? 0
            : Number(formData.politics_comm),

        casino_comm:
          formData.commission_type === "0"
            ? 0
            : Number(formData.casino_comm),

            session_comm:
          formData.commission_type === "0"
            ? 0
            : Number(formData.session_comm),

      };

      const res = await updateClient(payload);
      if (res.data.success) {
        toast.success(res.data?.message);
        navigate("/masters_list");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error(err);
      const apiMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Server error while updating";
      toast.error(apiMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };
  if (loading)
    return (
      <div className="card">
        <div className="card-body text-center">
          <div className="spinner-border text-primary"></div>
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    );
  return (
    <>
      <ToastContainer theme="colored" />
      <div className="card">
        <div className="card-header bg-primary-yellow p-2 text-white d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">
            Update Master — {formData.username}
          </h5>
          <div className="d-flex gap-2">
            <button className="btn btn-light" onClick={handleBack}>
              Back
            </button>
          </div>
        </div>

        <div className="card-body">
          <form noValidate onSubmit={handleSubmit}>
            {/* Username */}
            <div className="row">
              <div className="mb-3 col-md-6">
                <label>Username</label>
                <input
                  className="form-control"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3 col-md-6">
                <label>Password</label>
                <input
                  className="form-control"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  readOnly
                />
              </div>
              {/* Amount */}
              <div className="mb-3 col-md-6">
                <label>Amount</label>
                <input
                  type="text"
                  className="form-control"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  readOnly
                />
              </div>

              {/* Coins */}
              <div className="mb-3 col-md-6">
                <label>Coins</label>
                <input
                  type="text"
                  className="form-control"
                  name="coins"
                  value={formData.coins}
                  onKeyDown={blockInvalidKeys}
                  onChange={handleChange}
                  readOnly
                />
              </div>
              <div className="mb-3 col-md-6">
                <label>Match Share</label>
                <input
                  type="text"
                  className="form-control"
                  name="match_share"
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.match_share}
                  onKeyDown={blockInvalidKeys}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3 col-md-6">
                <label>Commission Type</label>
                <select
                  className="form-control"
                  name="commission_type"
                  value={formData.commission_type}
                  onChange={handleChange}
                >
                  <option value="1">Bet By Bet</option>
                  <option value="0">No Commission</option>
                </select>
              </div>

              {/* Commission */}
              <div className="mb-3 col-md-6">
                <label>Match Commission</label>
                <input
                  type="text"
                  className="form-control"
                  name="match_comm"
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.match_comm}
                  onChange={handleChange}
                  disabled={isNoCommission}
                  placeholder={
                    isNoCommission
                      ? "Disabled for No Commission"
                      : "Enter match commission"
                  }
                />
              </div>

              <div className="mb-3 col-md-6">
                <label>Session Commission</label>
                <input
                  type="text"
                  className="form-control"
                  name="session_comm"
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.session_comm}
                  onChange={handleChange}
                  disabled={isNoCommission}
                  placeholder={
                    isNoCommission
                      ? "Disabled for No Commission"
                      : "Enter session commission"
                  }
                  style={
                    isNoCommission
                      ? { backgroundColor: "#e9ecef", cursor: "not-allowed" }
                      : {}
                  }
                />
              </div>





              <div className="mb-3 col-md-6">
                <label>Football Commission</label>
                <input
                  type="text"
                  className="form-control"
                  name="football_comm"
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.football_comm}
                  onChange={handleChange}
                  disabled={isNoCommission}
                  placeholder={
                    isNoCommission
                      ? "Disabled for No Commission"
                      : "Enter football commission"
                  }
                  style={
                    isNoCommission
                      ? { backgroundColor: "#e9ecef", cursor: "not-allowed" }
                      : {}
                  }
                />
              </div>

              <div className="mb-3 col-md-6">
                <label>Tennis Commission</label>
                <input
                  type="text"
                  className="form-control"
                  name="tennis_comm"
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.tennis_comm}
                  onChange={handleChange}
                  disabled={isNoCommission}
                  placeholder={
                    isNoCommission
                      ? "Disabled for No Commission"
                      : "Enter tennis commission"
                  }
                  style={
                    isNoCommission
                      ? { backgroundColor: "#e9ecef", cursor: "not-allowed" }
                      : {}
                  }
                />
              </div>




              <div className="mb-3 col-md-6">
                <label>Horse Racing Commission</label>
                <input
                  type="text"
                  className="form-control"
                  name="horse_racing_comm"
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.horse_racing_comm}
                  onChange={handleChange}
                  disabled={isNoCommission}
                  placeholder={
                    isNoCommission
                      ? "Disabled for No Commission"
                      : "Enter horseracing commission"
                  }
                  style={
                    isNoCommission
                      ? { backgroundColor: "#e9ecef", cursor: "not-allowed" }
                      : {}
                  }
                />
              </div>



              <div className="mb-3 col-md-6">
                <label>Greyhound Racing Commission</label>
                <input
                  type="text"
                  className="form-control"
                  name="greyhound_racing_comm"
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.greyhound_racing_comm}
                  onChange={handleChange}
                  disabled={isNoCommission}
                  placeholder={
                    isNoCommission
                      ? "Disabled for No Commission"
                      : "Enter greyhound racing commission"
                  }
                  style={
                    isNoCommission
                      ? { backgroundColor: "#e9ecef", cursor: "not-allowed" }
                      : {}
                  }
                />
              </div>



              <div className="mb-3 col-md-6">
                <label>Politics Commission</label>
                <input
                  type="text"
                  className="form-control"
                  name="politics_comm"
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.politics_comm}
                  onChange={handleChange}
                  disabled={isNoCommission}
                  placeholder={
                    isNoCommission
                      ? "Disabled for No Commission"
                      : "Enter politics commission"
                  }
                  style={
                    isNoCommission
                      ? { backgroundColor: "#e9ecef", cursor: "not-allowed" }
                      : {}
                  }
                />
              </div>



              <div className="mb-3 col-md-6">
                <label>Casino Commission</label>
                <input
                  type="text"
                  className="form-control"
                  name="casino_comm"
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.casino_comm}
                  onChange={handleChange}
                  disabled={isNoCommission}
                  placeholder={
                    isNoCommission
                      ? "Disabled for No Commission"
                      : "Enter casino commission"
                  }
                  style={
                    isNoCommission
                      ? { backgroundColor: "#e9ecef", cursor: "not-allowed" }
                      : {}
                  }
                />
              </div>


              {/* <div className="mb-3 col-md-6">
                <label>Session Commission</label>
                <input
                  type="text"
                  className="form-control"
                  name="session_comm"
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.session_comm}
                  onChange={handleChange}
                  disabled={isNoCommission}
                  placeholder={
                    isNoCommission
                      ? "Disabled for No Commission"
                      : "Enter session commission"
                  }
                  style={
                    isNoCommission
                      ? { backgroundColor: "#e9ecef", cursor: "not-allowed" }
                      : {}
                  }
                />
              </div> */}






              <div className="col-3">
                <button
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  type="submit"
                >
                  {isSubmitting ? "Updating..." : "Update"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdateSuperAgentAdmin;
