import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const toTitleCase = (str) => {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

function AppSetting() {
  const [settings, setSettings] = useState({
    id: "",
    application_name: "",
    company_address: "",
    mobile: "",
    whatsapp_Number: "",
    whatsapp_Number_first: "",
    email_id: "",
    telegram_link: "",
    youtube_link: "",
    playstore_link: "",
    min_deposit: "",
    max_deposit: "",
    min_withdraw: "",
    max_withdraw: "",
    per_day_withdraw_request: "",
    withdraw_open_time: "",
    withdraw_close_time: "",
    withdraw_enable_disable: "",
    home_screen_msg: "",
    copy_right: "",
    registration_bonus_status: "",
    registration_on_off: "",
    registration_bonus_amount: "",
    home_screen_marquee: "",
    apk_version: "",
  });

  const [emailError, setEmailError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [whatsappError, setWhatsappError] = useState("");
  const [whatsappErrorFirst, setWhatsappErrorFirst] = useState("");
  const [minDepositError, setMinDepositError] = useState("");
  const [ApkVersionError, setApkVersionError] = useState("");
  const [maxDepositError, setMaxDepositError] = useState("");
  const [minWithdrawError, setMinWithdrawError] = useState("");
  const [maxWithdrawError, setMaxWithdrawError] = useState("");
  const [perDayWithdrawError, setPerDayWithdrawError] = useState("");
  const [RegistrationBonusError, setRegistrationBonusError] = useState("");
  const [withdrawEnableDisableError, setWithdrawEnableDisableError] =
    useState("");

  function convertTo24HourFormat(timeStr) {
    if (!timeStr || !timeStr.includes(" ")) return timeStr;
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours, 10);
    if (modifier === "PM" && hours !== 12) {
      hours += 12;
    }
    if (modifier === "AM" && hours === 12) {
      hours = 0;
    }
    return `${String(hours).padStart(2, "0")}:${minutes}`;
  }

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/app-setting-list`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const result = await res.json();
        if (result && result.data && result.data.length > 0) {
          const raw = result.data[0];
          setSettings((prev) => ({
            ...prev,
            ...raw,
            withdraw_open_time: convertTo24HourFormat(raw.withdraw_open_time),
            withdraw_close_time: convertTo24HourFormat(raw.withdraw_close_time),
          }));
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    switch (name) {
      case "withdraw_enable_disable":
        newValue = value.replace(/[^a-zA-Z]/g, "");
        setWithdrawEnableDisableError(
          newValue === ""
            ? "This field is required and must contain only letters."
            : ""
        );
        break;
      case "mobile":
        newValue = value.replace(/\D/g, "").slice(0, 10);
        setMobileError(
          newValue.length !== 10
            ? "Mobile number must be exactly 10 digits."
            : ""
        );
        break;

      // case "whatsapp_Number":
      //   newValue = value.replace(/\D/g, "").slice(0, 10);
      //   setWhatsappError(
      //     newValue.length !== 10
      //       ? "WhatsApp number must be exactly 10 digits."
      //       : ""
      //   );
      // case "whatsapp_Number_first":
      //   newValue = value.replace(/\D/g, "").slice(0, 10);
      //   setWhatsappErrorFirst(
      //     newValue.length !== 10
      //       ? "WhatsApp number must be exactly 10 digits."
      //       : ""
      //   );
      // break;

      // case "min_deposit":
      //   newValue = value.replace(/\D/g, "").slice(0, 3);
      //   setMinDepositError(
      //     newValue.length === 0
      //       ? "Minimum deposit is required and max 3 digits."
      //       : ""
      //   );
      //   break;

      case "min_deposit":
        newValue = value.replace(/\D/g, "");
        newValue = newValue.replace(/^0+/, "");
        newValue = newValue.slice(0, 3);
        setSettings((prev) => ({
          ...prev,
          [name]: newValue,
        }));
        if (!newValue) {
          setMinDepositError(
            "Minimum deposit is required Zero not allowd , and max input 3 digits."
          );
        } else {
          setMinDepositError("");
        }
        break;

      // case "max_deposit":
      //   newValue = value.replace(/\D/g, "").slice(0, 6);
      //   setMaxDepositError(
      //     newValue.length === 0
      //       ? "Maximum deposit is required and max 6 digits."
      //       : ""
      //   );
      //   break;

      case "max_deposit":
        newValue = value.replace(/\D/g, "");
        newValue = newValue.replace(/^0+/, "");
        newValue = newValue.slice(0, 6);
        setSettings((prev) => ({
          ...prev,
          [name]: newValue,
        }));
        if (!newValue) {
          setMaxDepositError(
            "Maximum deposit is required Zero not allowed , and max input 6 digits."
          );
        } else {
          setMaxDepositError("");
        }
        break;

      // case "min_withdraw":
      //   newValue = value.replace(/\D/g, "").slice(0, 3);
      //   setMinWithdrawError(
      //     newValue.length === 0
      //       ? "Minimum withdraw is required and max 3 digits."
      //       : ""
      //   );
      //   break;

      case "min_withdraw":
        newValue = value.replace(/\D/g, "");
        newValue = newValue.replace(/^0+/, "");
        newValue = newValue.slice(0, 3);
        setSettings((prev) => ({
          ...prev,
          [name]: newValue,
        }));
        if (!newValue) {
          setMinWithdrawError(
            "Minimum withdraw is required, Zero not allowed,  and max input 3 digits."
          );
        } else {
          setMinWithdrawError("");
        }
        break;

      // case "max_withdraw":
      //   newValue = value.replace(/\D/g, "").slice(0, 6);
      //   setMaxWithdrawError(
      //     newValue.length === 0
      //       ? "Maximum withdraw is required and max 6 digits."
      //       : ""
      //   );
      //   break;

      case "max_withdraw":
        newValue = value.replace(/\D/g, "");
        newValue = newValue.replace(/^0+/, "");
        newValue = newValue.slice(0, 6);
        setSettings((prev) => ({
          ...prev,
          [name]: newValue,
        }));
        if (!newValue) {
          setMaxWithdrawError(
            "Maximum withdraw is required, Zero not allowed,  and  max input 6 digits."
          );
        } else {
          setMaxWithdrawError("");
        }
        break;

      // case "per_day_withdraw_request":
      //   newValue = value.replace(/\D/g, "").slice(0, 3);
      //   setPerDayWithdrawError(
      //     newValue.length === 0
      //       ? "Per day withdraw request is required and max 3 digits."
      //       : ""
      //   );
      //   break;

      case "per_day_withdraw_request":
        newValue = value.replace(/\D/g, "");
        newValue = newValue.replace(/^0+/, "");
        newValue = newValue.slice(0, 3);
        setSettings((prev) => ({
          ...prev,
          [name]: newValue,
        }));
        if (!newValue) {
          setPerDayWithdrawError(
            "Per day withdraw request is required, Zero not allowed,  and max input 3 digits."
          );
        } else {
          setPerDayWithdrawError("");
        }
        break;

      //  case "registration_bonus_amount":
      // newValue = value.replace(/\D/g, "").slice(0, 6);
      // setRegistrationBonusError(
      //   newValue.length === 0
      //     ? "Registration Bonus Amount Max Limits 6."
      //     : ""
      // );
      // break;

      case "registration_bonus_amount":
        newValue = value.replace(/\D/g, "");
        newValue = newValue.replace(/^0+/, "");
        newValue = newValue.slice(0, 6);
        setSettings((prev) => ({
          ...prev,
          [name]: newValue,
        }));
        if (!newValue) {
          setRegistrationBonusError(
            "Registration Bonus Amount is required and should not be zero,  max input  6 digits allowed."
          );
        } else {
          setRegistrationBonusError("");
        }
        break;

      case "email_id":
        setEmailError(validateEmail(newValue) ? "" : "Invalid email address");
        break;

      default:
        break;
    }

    setSettings((prev) => ({ ...prev, [name]: newValue }));
  };

  const validateAllFields = () => {
    let valid = true;

    if (!validateEmail(settings.email_id)) {
      setEmailError("Invalid email address");
      valid = false;
    }

    if (settings.mobile.length !== 10) {
      setMobileError("Mobile number must be exactly 10 digits.");
      valid = false;
    }

    // if (settings.whatsapp_Number.length < 20) {
    //   setWhatsappError("WhatsApp number must be Required.");
    //   valid = false;
    // }
    // if (settings.whatsapp_Number_first.length < 20) {
    //   setWhatsappErrorFirst("WhatsApp number must be Required.");
    //   valid = false;
    // }

    if (settings.min_deposit.length === 0 || settings.min_deposit.length > 3) {
      setMinDepositError("Minimum deposit is required and max 3 digits.");
      valid = false;
    }
    if (settings.apk_version.length === 0) {
      setApkVersionError("Minimum deposit is required and min 1 digits.");
      valid = false;
    }

    if (settings.max_deposit.length === 0 || settings.max_deposit.length > 6) {
      setMaxDepositError("Maximum deposit is required and max 6 digits.");
      valid = false;
    }

    if (
      settings.min_withdraw.length === 0 ||
      settings.min_withdraw.length > 3
    ) {
      setMinWithdrawError("Minimum withdraw is required and max 3 digits.");
      valid = false;
    }

    if (
      settings.max_withdraw.length === 0 ||
      settings.max_withdraw.length > 6
    ) {
      setMaxWithdrawError("Maximum withdraw is required and max 6 digits.");
      valid = false;
    }

    if (
      settings.per_day_withdraw_request.length === 0 ||
      settings.per_day_withdraw_request.length > 3
    ) {
      setPerDayWithdrawError(
        "Per day withdraw request is required and max 3 digits."
      );
      valid = false;
    }

    if (
      settings.registration_bonus_amount.length === 0 ||
      settings.registration_bonus_amount.length > 6
    ) {
      setRegistrationBonusError("Registration Bonus Amount 6 digits.");
      valid = false;
    }

    if (
      settings.withdraw_enable_disable.trim() === "" ||
      /[^a-zA-Z]/.test(settings.withdraw_enable_disable)
    ) {
      setWithdrawEnableDisableError(
        "This field is required and must contain only letters."
      );
      valid = false;
    }

    return valid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setEmailError("");
    setMobileError("");
    setWhatsappError("");
    setWhatsappErrorFirst("");
    setMinDepositError("");
    setApkVersionError("");
    setMaxDepositError("");
    setMinWithdrawError("");
    setMaxWithdrawError("");
    setPerDayWithdrawError("");
    setRegistrationBonusError("");
    setWithdrawEnableDisableError("");

    if (!validateAllFields()) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const { created_at, updated_at, __v, _id, ...rest } = settings;
      const payload = {
        ...rest,
        id: _id,
      };

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/app-setting-update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      const result = await res.json();
      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Settings updated successfully!",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: result.message || "Something went wrong!",
        });
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong while updating.",
      });
    }
  };
  // Form render
  return (
    <div className="row mt-3">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-header bg-color-black">
            <div className="d-flex align-items-center justify-content-between">
              <h3 className="card-title text-white">App Setting</h3>
            </div>
          </div>
          <div className="card-body">
            <form noValidate onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Company Address</label>
                  <input
                    type="text"
                    className="form-control"
                    name="company_address"
                    value={settings.company_address}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Email ID</label>
                  <input
                    type="email"
                    className={`form-control ${emailError ? "is-invalid" : ""}`}
                    name="email_id"
                    value={settings.email_id}
                    onChange={handleChange}
                    required
                  />
                  {emailError && (
                    <div className="text-danger small mt-1">{emailError}</div>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Mobile Number</label>
                  <input
                    type="text"
                    className={`form-control ${
                      mobileError ? "is-invalid" : ""
                    }`}
                    name="mobile"
                    value={settings.mobile}
                    onChange={handleChange}
                    maxLength={10}
                  />
                  {mobileError && (
                    <div className="text-danger small mt-1">{mobileError}</div>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">WhatsApp Number</label>
                  <input
                    type="text"
                    className={`form-control ${
                      whatsappError ? "is-invalid" : ""
                    }`}
                    name="whatsapp_Number"
                    value={settings.whatsapp_Number}
                    onChange={handleChange}
                    maxLength={20}
                  />
                  {whatsappError && (
                    <div className="text-danger small mt-1">
                      {whatsappError}
                    </div>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">WhatsApp Number First</label>
                  <input
                    type="text"
                    className={`form-control ${
                      whatsappError ? "is-invalid" : ""
                    }`}
                    name="whatsapp_Number_first"
                    value={settings.whatsapp_Number_first}
                    onChange={handleChange}
                    maxLength={20}
                  />
                  {whatsappErrorFirst && (
                    <div className="text-danger small mt-1">
                      {whatsappErrorFirst}
                    </div>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Application Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="application_name"
                    value={settings.application_name}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Telegram Link</label>
                  <input
                    type="text"
                    className="form-control"
                    name="telegram_link"
                    value={settings.telegram_link}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">YouTube Link</label>
                  <input
                    type="text"
                    className="form-control"
                    name="youtube_link"
                    value={settings.youtube_link}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Playstore Link</label>
                  <input
                    type="text"
                    className="form-control"
                    name="playstore_link"
                    value={settings.playstore_link}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Minimum Deposit</label>
                  <input
                    type="text"
                    className={`form-control ${
                      minDepositError ? "is-invalid" : ""
                    }`}
                    name="min_deposit"
                    value={settings.min_deposit}
                    onChange={handleChange}
                    maxLength={3}
                  />
                  {minDepositError && (
                    <div className="text-danger small mt-1">
                      {minDepositError}
                    </div>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Maximum Deposit</label>
                  <input
                    type="text"
                    className={`form-control ${
                      maxDepositError ? "is-invalid" : ""
                    }`}
                    name="max_deposit"
                    value={settings.max_deposit}
                    onChange={handleChange}
                    maxLength={6}
                  />
                  {maxDepositError && (
                    <div className="text-danger small mt-1">
                      {maxDepositError}
                    </div>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Minimum Withdraw</label>
                  <input
                    type="text"
                    className={`form-control ${
                      minWithdrawError ? "is-invalid" : ""
                    }`}
                    name="min_withdraw"
                    value={settings.min_withdraw}
                    onChange={handleChange}
                    maxLength={3}
                  />
                  {minWithdrawError && (
                    <div className="text-danger small mt-1">
                      {minWithdrawError}
                    </div>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Maximum Withdraw</label>
                  <input
                    type="text"
                    className={`form-control ${
                      maxWithdrawError ? "is-invalid" : ""
                    }`}
                    name="max_withdraw"
                    value={settings.max_withdraw}
                    onChange={handleChange}
                    maxLength={6}
                  />
                  {maxWithdrawError && (
                    <div className="text-danger small mt-1">
                      {maxWithdrawError}
                    </div>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Per Day Withdraw Request</label>
                  <input
                    type="text"
                    className={`form-control ${
                      perDayWithdrawError ? "is-invalid" : ""
                    }`}
                    name="per_day_withdraw_request"
                    value={settings.per_day_withdraw_request}
                    onChange={handleChange}
                    maxLength={3}
                  />
                  {perDayWithdrawError && (
                    <div className="text-danger small mt-1">
                      {perDayWithdrawError}
                    </div>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Withdraw Open Time</label>
                  <input
                    type="time"
                    className="form-control"
                    name="withdraw_open_time"
                    value={settings.withdraw_open_time}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Withdraw Close Time</label>
                  <input
                    type="time"
                    className="form-control"
                    name="withdraw_close_time"
                    value={settings.withdraw_close_time}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Withdraw Enable/Disable</label>
                  <select
                    className={`form-select ${
                      withdrawEnableDisableError ? "is-invalid" : ""
                    }`}
                    name="withdraw_enable_disable"
                    value={settings.withdraw_enable_disable}
                    onChange={handleChange}
                  >
                    <option value="">-- Select Option --</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                  {withdrawEnableDisableError && (
                    <div className="text-danger small mt-1">
                      {withdrawEnableDisableError}
                    </div>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Copy Right</label>
                  <input
                    type="text"
                    className="form-control"
                    name="copy_right"
                    value={settings.copy_right}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Registration Bonus Status
                  </label>
                  <select
                    className="form-control"
                    name="registration_bonus_status"
                    value={settings.registration_bonus_status}
                    onChange={handleChange}
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>


                  <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Registration Start / Stop
                  </label>
                  <select
                    className="form-control"
                    name="registration_on_off"
                    value={settings.registration_on_off}
                    onChange={handleChange}
                  >
                    <option value="on">On</option>
                    <option value="off">Off</option>
                  </select>
                </div>


                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Registration Bonus Amount{" "}
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      RegistrationBonusError ? "is-invalid" : ""
                    }`}
                    name="registration_bonus_amount"
                    value={settings.registration_bonus_amount}
                    onChange={handleChange}
                    maxLength={6}
                  />
                  {RegistrationBonusError && (
                    <div className="text-danger small mt-1">
                      {RegistrationBonusError}
                    </div>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Apk Version</label>
                  <input
                    type="text"
                    className={`form-control ${
                      ApkVersionError ? "is-invalid" : ""
                    }`}
                    name="apk_version"
                    value={settings.apk_version}
                    onChange={handleChange}
                    maxLength={50}
                  />
                  {ApkVersionError && (
                    <div className="text-danger small mt-1">
                      {ApkVersionError}
                    </div>
                  )}
                </div>

                <div className="col-md-12 mb-3">
                  <label className="form-label">Home Screen Message</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    name="home_screen_msg"
                    value={settings.home_screen_msg}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div className="col-md-12 mb-3">
                  <label className="form-label">
                    Home Screen Title (Slider Text)
                  </label>
                  <textarea
                    className="form-control"
                    rows="3"
                    name="home_screen_marquee"
                    value={settings.home_screen_marquee}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div className="col-md-12">
                  <div className="d-flex justify-content-end">
                    <button type="submit" className="btn btn-primary">
                      Update Settings
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppSetting;
