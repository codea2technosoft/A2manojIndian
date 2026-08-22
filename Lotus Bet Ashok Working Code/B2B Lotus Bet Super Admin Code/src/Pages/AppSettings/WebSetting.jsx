import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getSettings, UpdateSettings } from "../../Server/api";
import Loader from "../../Common/Loader";

function WebSetting() {
  const [settings, setSettings] = useState({
    id: "",
    name: "",
    telegram_link: "",
    telegram_support: "",
    whatsapp_number: "",
    whatsapp_support: "", // ✅ Added missing field
    mobile_number: "",
    email_id: "",
    logo: "",
    description: "",
    status: "1",
    fancy_min_bet: "",
    fancy_max_bet: "",
    odds_min_bet: "",
    odds_max_bet: "",
    bookmaker_min_bet: "",
    bookmaker_max_bet: "",
  });

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "fancy_min_bet":
      case "odds_min_bet":
      case "bookmaker_min_bet":
      case "fancy_max_bet":
      case "odds_max_bet":
      case "bookmaker_max_bet":
        if (!value || value === "" || value === "0") {
          error = `${name.replace(/_/g, " ")} is required and must be greater than 0`;
        } else if (isNaN(value) || parseInt(value) < 1) {
          error = "Must be a positive number";
        }
        break;

      case "whatsapp_number":
      case "whatsapp_support":
        if (value && !/^\d{10}$/.test(value.replace(/\D/g, ""))) {
          error = "Please enter a valid 10-digit number";
        }
        break;

      case "telegram_link":
      case "telegram_support":
        if (value && !value.startsWith("http")) {
          error = "Please enter a valid URL starting with http:// or https://";
        }
        break;

      default:
        break;
    }

    return error;
  };

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await getSettings();

      const result = response.data?.data?.[0];
      if (!result) {
        console.log("No settings found");
        return;
      }

      setSettings({
        id: result._id || "",
        name: result.name || "",
        telegram_link: result.telegram_link || "",
        telegram_support: result.telegram_support || "",
        whatsapp_number: result.whatsapp_number || "",
        whatsapp_support: result.whatsapp_support || "", // ✅ Added
        mobile_number: result.mobile_number || "",
        email_id: result.email_id || "",
        logo: result.logo || "",
        description: result.description || "",
        status: result.status !== undefined ? String(result.status) : "1",
        fancy_min_bet: result.fancy_min_bet !== undefined ? String(result.fancy_min_bet) : "",
        fancy_max_bet: result.fancy_max_bet !== undefined ? String(result.fancy_max_bet) : "",
        odds_min_bet: result.odds_min_bet !== undefined ? String(result.odds_min_bet) : "",
        odds_max_bet: result.odds_max_bet !== undefined ? String(result.odds_max_bet) : "",
        bookmaker_min_bet: result.bookmaker_min_bet !== undefined ? String(result.bookmaker_min_bet) : "",
        bookmaker_max_bet: result.bookmaker_max_bet !== undefined ? String(result.bookmaker_max_bet) : "",
      });

      if (result.logo) {
        setLogoPreview(
          `${process.env.REACT_APP_API_URL}/uploads/${result.logo}`
        );
      }
    } catch (err) {
      console.error("Error fetching settings:", err);
      Swal.fire("Error", "Failed to fetch settings", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // ✅ Numeric fields ke liye allow empty string
    let newValue = value;
    if (name.includes("_min_bet") || name.includes("_max_bet")) {
      // Allow empty string or digits only
      if (value === "" || /^\d+$/.test(value)) {
        newValue = value;
      } else {
        return; // Ignore invalid input
      }
    }

    setSettings((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Validate field
    const error = validateField(name, newValue);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const validateAllFields = () => {
    const newErrors = {};
    let isValid = true;

    const numericFields = [
      "fancy_min_bet",
      "fancy_max_bet",
      "odds_min_bet",
      "odds_max_bet",
      "bookmaker_min_bet",
      "bookmaker_max_bet",
    ];

    numericFields.forEach((field) => {
      const error = validateField(field, settings[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

const handleSave = async (e) => {
  e.preventDefault();

  if (!validateAllFields()) {
    Swal.fire({
      icon: "warning",
      title: "Validation Error",
      text: "Please fix the errors before saving",
    });
    return;
  }

  try {
    setLoading(true);

  // ✅ Force update with exact value
const payload = {
  id: settings.id || "6969cea9fb6d9e9d23dab319",
  description: settings.description || "",
  status: Number(settings.status),
  
  // Betting Limits
  fancy_min_bet: settings.fancy_min_bet ? Number(settings.fancy_min_bet) : 0,
  fancy_max_bet: settings.fancy_max_bet ? Number(settings.fancy_max_bet) : 0,
  odds_min_bet: settings.odds_min_bet ? Number(settings.odds_min_bet) : 0,
  odds_max_bet: settings.odds_max_bet ? Number(settings.odds_max_bet) : 0,
  bookmaker_min_bet: settings.bookmaker_min_bet ? Number(settings.bookmaker_min_bet) : 0,
  bookmaker_max_bet: settings.bookmaker_max_bet ? Number(settings.bookmaker_max_bet) : 0,
  
  // ✅ HARD SET
  whatsapp_number: settings.whatsapp_number ? settings.whatsapp_number.trim() : "",
  whatsapp_support: settings.whatsapp_support ? settings.whatsapp_support.trim() : "",
  mobile_number: settings.mobile_number ? settings.mobile_number.trim() : "",
  email_id: settings.email_id ? settings.email_id.trim() : "",
  telegram_link: settings.telegram_link ? settings.telegram_link.trim() : "",
  telegram_support: settings.telegram_support ? settings.telegram_support.trim() : "",
};

    console.log("📤 Sending payload:", payload);

    const response = await UpdateSettings(payload);

    if (response.data?.message) {
      Swal.fire({
        title: "Success",
        text: response.data.message,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      fetchSettings();
    }
  } catch (error) {
    console.error("❌ Error saving settings:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.response?.data?.message || "Failed to update settings",
    });
  } finally {
    setLoading(false);
  }
};

  const renderInput = (
    label,
    name,
    type = "text",
    placeholder = "",
    maxLength = null
  ) => (
    <div className="col-md-6 mb-3">
      <label className="form-label">{label}</label>
      <input
        type={type}
        className={`form-control ${errors[name] ? "is-invalid" : ""}`}
        name={name}
        value={settings[name] || ""}
        onChange={handleChange}
        placeholder={placeholder}
        maxLength={maxLength}
      />
      {errors[name] && (
        <div className="text-danger small mt-1">{errors[name]}</div>
      )}
    </div>
  );

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-header bgHeader">
            <div className="d-flex align-items-center justify-content-between align-items-center">
              <h3 className="card-title mb-0">Admin Settings</h3>
            </div>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="d-flex justify-content-center align-items-center py-5">
                <Loader />
              </div>
            ) : (
              <form noValidate onSubmit={handleSave}>
                <div className="row">
                  {/* Status */}
                  {/* <div className="col-md-6 mb-3">
                    <label className="form-label">Status</label>
                    <select
                      className="form-control"
                      name="status"
                      value={settings.status}
                      onChange={handleChange}
                    >
                      <option value="1">Active</option>
                      <option value="0">Inactive</option>
                    </select>
                  </div> */}

                  {/* WhatsApp Number */}
                  {renderInput(
                    "WhatsApp Number",
                    "whatsapp_number",
                    "text",
                    "Enter WhatsApp number",
                    10
                  )}

                  {/* WhatsApp Support */}
                  {/* {renderInput(
                    "WhatsApp Support",
                    "whatsapp_support",
                    "text",
                    "Enter WhatsApp support number",
                    10
                  )} */}

                  {/* Mobile Number */}
                  {renderInput(
                    "Mobile Number",
                    "mobile_number",
                    "text",
                    "Enter mobile number",
                    10
                  )}

                  {/* Email */}
                  {renderInput(
                    "Email Id",
                    "email_id",
                    "email",
                    "Enter Email"
                  )}

                  {/* Description */}
                  <div className="col-md-12 mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      name="description"
                      value={settings.description || ""}
                      onChange={handleChange}
                      placeholder="Enter description"
                    ></textarea>
                  </div>

                  {/* <div className="col-12">
                    <h5 className="card-title">Betting Limits</h5>
                  </div>

                  {renderInput(
                    "Fancy Minimum Bet",
                    "fancy_min_bet",
                    "text",
                    "Enter minimum bet for fancy"
                  )}
                  {renderInput(
                    "Fancy Maximum Bet",
                    "fancy_max_bet",
                    "text",
                    "Enter maximum bet for fancy"
                  )}
                  {renderInput(
                    "Odds Minimum Bet",
                    "odds_min_bet",
                    "text",
                    "Enter minimum bet for odds"
                  )}
                  {renderInput(
                    "Odds Maximum Bet",
                    "odds_max_bet",
                    "text",
                    "Enter maximum bet for odds"
                  )}
                  {renderInput(
                    "Bookmaker Minimum Bet",
                    "bookmaker_min_bet",
                    "text",
                    "Enter minimum bet for bookmaker"
                  )}
                  {renderInput(
                    "Bookmaker Maximum Bet",
                    "bookmaker_max_bet",
                    "text",
                    "Enter maximum bet for bookmaker"
                  )} */}

                  {/* Submit Button */}
                  <div className="col-md-12">
                    <div className="d-flex justify-content-start">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Updating...
                          </>
                        ) : (
                          "Update Settings"
                        )}
                      </button>
                    </div>
                  </div> {/* Betting Limits Section */}
                 
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WebSetting;