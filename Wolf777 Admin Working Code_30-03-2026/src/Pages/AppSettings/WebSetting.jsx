import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getSettings, UpdateSettings } from '../../Server/api'

function WebSetting() {
  const [settings, setSettings] = useState({
    id: "",
    name: "",
    whatsapp_no: "",
    telegram_link: "",
    telegram_support: "",
    whatsapp_support: "",
    logo: "",
    description: "",
    status: "",
    fancy_min_bet: "",
    fancy_max_bet: "",
    odds_min_bet: "",
    odds_max_bet: "",
    bookmaker_min_bet: "",
    bookmaker_max_bet: "",
    min_deposit: "",
    max_deposit: "",
    min_withdraw: "",
    max_withdraw: "",
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
        if (!value || value === "") {
          error = "Minimum bet is required";
        } else if (isNaN(value) || parseInt(value) < 1) {
          error = "Minimum bet must be a positive number";
        }
        break;


      // ✅ Deposit Validation
      case "min_deposit":
        if (!value || value === "") {
          error = "Minimum deposit is required";
        } else if (isNaN(value) || parseInt(value) < 1) {
          error = "Minimum deposit must be a positive number";
        }
        break;

      case "max_deposit":
        if (!value || value === "") {
          error = "Maximum deposit is required";
        } else if (isNaN(value) || parseInt(value) < 1) {
          error = "Maximum deposit must be a positive number";
        }
        break;

      // ✅ Withdraw Validation
      case "min_withdraw":
        if (!value || value === "") {
          error = "Minimum withdraw amount is required";
        } else if (isNaN(value) || parseInt(value) < 1) {
          error = "Minimum withdraw amount must be a positive number";
        }
        break;

      case "max_withdraw":
        if (!value || value === "") {
          error = "Maximum withdraw amount is required";
        } else if (isNaN(value) || parseInt(value) < 1) {
          error = "Maximum withdraw amount must be a positive number";
        }
        break;

      case "fancy_max_bet":
      case "odds_max_bet":
      case "bookmaker_max_bet":
        if (!value || value === "") {
          error = "Maximum bet is required";
        } else if (isNaN(value) || parseInt(value) < 1) {
          error = "Maximum bet must be a positive number";
        }
        break;

      case "whatsapp_no":
      case "whatsapp_support":
        if (value && !/^\d{10}$/.test(value.replace(/\D/g, ''))) {
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

  // const fetchSettings = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await getSettings();
  //     console.log("Settings API Response:", response);

  //     if (response.data) {
  //       setSettings({
  //         id: response.data.id || "",
  //         name: response.data.name || "",
  //         whatsapp_no: response.data.whatsapp_no || "",
  //         telegram_link: response.data.telegram_link || "",
  //         telegram_support: response.data.telegram_support || "",
  //         whatsapp_support: response.data.whatsapp_support || "",
  //         logo: response.data.logo || "",
  //         description: response.data.description || "",
  //         status: response.data.status || "",
  //         fancy_min_bet: response.data.fancy_min_bet || "",
  //         fancy_max_bet: response.data.fancy_max_bet || "",
  //         odds_min_bet: response.data.odds_min_bet || "",
  //         odds_max_bet: response.data.odds_max_bet || "",
  //         bookmaker_min_bet: response.data.bookmaker_min_bet || "",
  //         bookmaker_max_bet: response.data.bookmaker_max_bet || ""
  //       });

  //       if (response.data.logo) {
  //         setLogoPreview(`${process.env.REACT_APP_API_URL}/uploads/${response.data.logo}`);
  //       }
  //     }
  //   } catch (err) {
  //     console.error("Error fetching settings:", err);
  //     Swal.fire("Error", "Failed to fetch settings", "error");
  //   } finally {
  //     setLoading(false);
  //   }
  // };





  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await getSettings();

      const result = response.data?.data?.[0];
      if (!result) return;

      setSettings({
        id: result._id,
        description: result.description,
        status: result.status,
        fancy_min_bet: result.fancy_min_bet,
        fancy_max_bet: result.fancy_max_bet,
        odds_min_bet: result.odds_min_bet,
        odds_max_bet: result.odds_max_bet,
        bookmaker_min_bet: result.bookmaker_min_bet,
        bookmaker_max_bet: result.bookmaker_max_bet,
        min_deposit: result.min_deposit,
        max_deposit: result.max_deposit,
        min_withdraw: result.min_withdraw,
        max_withdraw: result.max_withdraw,
      });

      if (result.logo) {
        setLogoPreview(`${process.env.REACT_APP_API_URL}/uploads/${result.logo}`);
      }
    } catch (err) {
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
    let newValue = value;

    // Special handling for numeric fields
    if (name.includes("_min_bet") || name.includes("_max_bet")) {
      newValue = value.replace(/\D/g, "");
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

    // Validate all required numeric fields
    const numericFields = [
      'fancy_min_bet', 'fancy_max_bet',
      'odds_min_bet', 'odds_max_bet',
      'bookmaker_min_bet', 'bookmaker_max_bet'
    ];

    numericFields.forEach(field => {
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




      const payload = {
        // id: settings.id,
        id: "6969cea9fb6d9e9d23dab319",
        description: settings.description,
        status: Number(settings.status), // IMPORTANT
        fancy_min_bet: settings.fancy_min_bet,
        fancy_max_bet: settings.fancy_max_bet,
        odds_min_bet: settings.odds_min_bet,
        odds_max_bet: settings.odds_max_bet,
        bookmaker_min_bet: settings.bookmaker_min_bet,
        bookmaker_max_bet: settings.bookmaker_max_bet,
        min_deposit: settings.min_deposit,
        max_deposit: settings.max_deposit,
        min_withdraw: settings.min_withdraw,
        max_withdraw: settings.max_withdraw,
      };
      const response = await UpdateSettings(payload);

      if (response.data?.message) {
        Swal.fire("Success 🎉", response.data.message, "success");
        fetchSettings();
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (label, name, type = "text", placeholder = "", maxLength = null) => (
    <div className="col-md-6 mb-3">
      <label className="form-label">{label}</label>
      <input
        type={type}
        className={`form-control ${errors[name] ? "is-invalid" : ""}`}
        name={name}
        value={settings[name]}
        onChange={handleChange}
        placeholder={placeholder}
        maxLength={maxLength}
      />
      {errors[name] && (
        <div className="text-danger small mt-1">{errors[name]}</div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="row mt-3">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-header bg-color-black">
            <div className="d-flex align-items-center justify-content-between">
              <h3 className="card-title text-white">Admin Settings</h3>
            </div>
          </div>
          <div className="card-body">
            <form noValidate onSubmit={handleSave}>
              <div className="row">
                <div className="col-md-12 mb-3">
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
                </div>

                {/* {renderInput("WhatsApp Number", "whatsapp_no", "text", "Enter WhatsApp number", 10)}
                {renderInput("WhatsApp Support", "whatsapp_support", "text", "Enter WhatsApp support number", 10)}
                {renderInput("Telegram Link", "telegram_link", "text", "Enter Telegram link")}
                {renderInput("Telegram Support", "telegram_support", "text", "Enter Telegram support link")} */}


                {/* 
                <div className="col-md-6 mb-3">
                  <label className="form-label">Logo</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setLogoFile(e.target.files[0]);
                        setLogoPreview(URL.createObjectURL(e.target.files[0]));
                      }
                    }}
                  />
                  {logoPreview && (
                    <div className="mt-2">
                      <img
                        src={logoPreview}
                        alt="Logo Preview"
                        style={{ height: "80px", objectFit: "contain" }}
                      />
                    </div>
                  )}
                </div> */}

                <div className="col-12 mt-4">
                  <h5 className="border-bottom pb-2">Betting Limits</h5>
                </div>

                {renderInput("Fancy Minimum Bet", "fancy_min_bet", "text", "Enter minimum bet for fancy", 10)}
                {renderInput("Fancy Maximum Bet", "fancy_max_bet", "text", "Enter maximum bet for fancy", 10)}
                {renderInput("Odds Minimum Bet", "odds_min_bet", "text", "Enter minimum bet for odds", 10)}
                {renderInput("Odds Maximum Bet", "odds_max_bet", "text", "Enter maximum bet for odds", 10)}
                {renderInput("Bookmaker Minimum Bet", "bookmaker_min_bet", "text", "Enter minimum bet for bookmaker", 10)}
                {renderInput("Bookmaker Maximum Bet", "bookmaker_max_bet", "text", "Enter maximum bet for bookmaker", 10)}


                {renderInput("Min Depost", "min_deposit", "text", "Enter Minimum Deposit", 10)}

                {renderInput("Max Deposit", "max_deposit", "text", "Enter Maximum Deposit", 10)}

                {renderInput("Min Withdraw", "min_withdraw", "text", "Enter Minimum Withdraw", 10)}

                {renderInput("Max Withdraw", "max_withdraw", "text", "Enter Maximum Withdraw", 10)}

                <div className="col-md-12 mb-5">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control h-100"
                    rows="6"
                    name="description"
                    value={settings.description}
                    onChange={handleChange}
                    placeholder="Enter description"
                  ></textarea>
                </div>

                <div className="col-md-12">
                  <div className="d-flex justify-content-end">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Updating...
                        </>
                      ) : (
                        "Update Settings"
                      )}
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

export default WebSetting;