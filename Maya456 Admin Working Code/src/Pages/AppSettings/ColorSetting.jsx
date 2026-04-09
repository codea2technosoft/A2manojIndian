import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

function AppSetting() {
  const [settings, setSettings] = useState({
    id: "",
    red_color: "red",
    red_amount: "",
    orange_color: "orange",
    orange_amount: "",
    violet_color: "violet",
    violet_amount: "",
    yellow_color: "yellow",
    yellow_amount: "",
    blue_color: "blue",
    blue_amount: "",
    green_color: "green",
    green_amount: "",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/color-setting-list`,
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
    // switch (name) {
    //   case "red_amount":
    //     newValue = value.replace(/\D/g, "").slice(0, 10);
    //     setMobileError(
    //       newValue.length > 10
    //         ? "Orange Amount must be less than 10 digits."
    //         : ""
    //     );
    //     break;
    //   case "orange_amount":
    //     newValue = value.replace(/\D/g, "").slice(0, 10);
    //     setMobileError(
    //       newValue.length > 10
    //         ? "Orange Amount must be less than 10 digits."
    //         : ""
    //     );
    //     break;

    //   case "violet_amount":
    //     newValue = value.replace(/\D/g, "").slice(0, 10);
    //     setMobileError(
    //       newValue.length > 10
    //         ? "Orange Amount must be less than 10 digits."
    //         : ""
    //     );
    //   case "yellow_amount":
    //     newValue = value.replace(/\D/g, "").slice(0, 10);
    //     setMobileError(
    //       newValue.length > 10
    //         ? "Orange Amount must be less than 10 digits."
    //         : ""
    //     );
    //     break;
    //   case "blue_amount":
    //     newValue = value.replace(/\D/g, "").slice(0, 10);
    //     setMobileError(
    //       newValue.length > 10
    //         ? "Orange Amount must be less than 10 digits."
    //         : ""
    //     );
    //     break;

    //   case "green_amount":
    //     newValue = value.replace(/\D/g, "").slice(0, 10);
    //     setMobileError(
    //       newValue.length > 10
    //         ? "Orange Amount must be less than 10 digits."
    //         : ""
    //     );
    //     break;
    // }

    setSettings((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const { created_at, updated_at, __v, _id, ...rest } = settings;
      const payload = {
        ...rest,
        id: _id,
      };

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/color-setting-update`,
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
    <div className="row">
      <div className="col-lg-12">
        <div className="card mt-3">
          <div className="card-header bg-color-black">
            <div className="d-flex justify-content-between align-items-center">
              <h3 className="card-title text-white">Color Setting</h3>
            </div>
          </div>
          <div className="card-body">
            <form noValidate onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Red Color</label>
                  <div className="red box_all d-flex">
                    <div className="colorbox" style={{ "--i": "red" }}></div>
                    <input
                      type="text"
                      className="form-control"
                      value={
                        settings.red_color
                          ? settings.red_color.charAt(0).toUpperCase() +
                            settings.red_color.slice(1)
                          : ""
                      }
                    />
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Amount</label>

                  <input
                    type="text"
                    className={`form-control`}
                    name="red_amount"
                    value={settings.red_amount}
                    onChange={handleChange}
                    maxLength={6}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Orange Color</label>
                  <div className="red box_all d-flex">
                    <div className="colorbox" style={{ "--i": "Orange" }}></div>
                    <input
                      type="text"
                      className="form-control"
                      // name="orange_color"
                      // value={settings.orange_color}
                      value={
                        settings.orange_color
                          ? settings.orange_color.charAt(0).toUpperCase() +
                            settings.orange_color.slice(1)
                          : ""
                      }
                      // onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Amount</label>

                  <input
                    type="text"
                    className={`form-control`}
                    name="orange_amount"
                    value={settings.orange_amount}
                    onChange={handleChange}
                    maxLength={6}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Violet Color</label>
                  <div className="red box_all d-flex">
                    <div className="colorbox" style={{ "--i": "Violet" }}></div>
                    <input
                      type="text"
                      className="form-control"
                      // name="violet_color"
                      // value={settings.violet_color}
                      value={
                        settings.violet_color
                          ? settings.violet_color.charAt(0).toUpperCase() +
                            settings.violet_color.slice(1)
                          : ""
                      }
                      // onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Amount</label>

                  <input
                    type="text"
                    className={`form-control`}
                    name="violet_amount"
                    value={settings.violet_amount}
                    onChange={handleChange}
                    maxLength={6}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Yellow Color</label>
                  <div className="red box_all d-flex">
                    <div className="colorbox" style={{ "--i": "Yellow" }}></div>
                    <input
                      type="text"
                      className="form-control"
                      // name="yellow_color"
                      // value={settings.yellow_color}
                      value={
                        settings.yellow_color
                          ? settings.yellow_color.charAt(0).toUpperCase() +
                            settings.yellow_color.slice(1)
                          : ""
                      }
                      // onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Amount</label>

                  <input
                    type="text"
                    className={`form-control`}
                    name="yellow_amount"
                    value={settings.yellow_amount}
                    onChange={handleChange}
                    maxLength={6}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Blue Color</label>
                  <div className="red box_all d-flex">
                    <div className="colorbox" style={{ "--i": "Blue" }}></div>
                    <input
                      type="text"
                      className="form-control"
                      // name="blue_color"
                      // value={settings.blue_color}
                      value={
                        settings.blue_color
                          ? settings.blue_color.charAt(0).toUpperCase() +
                            settings.blue_color.slice(1)
                          : ""
                      }
                      // onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Amount</label>

                  <input
                    type="text"
                    className={`form-control`}
                    name="blue_amount"
                    value={settings.blue_amount}
                    onChange={handleChange}
                    maxLength={6}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Green Color</label>
                  <div className="red box_all d-flex">
                    <div className="colorbox" style={{ "--i": "Green" }}></div>
                    <input
                      type="text"
                      className="form-control"
                      // name="green_color"
                      // value={settings.green_color}
                      value={
                        settings.green_color
                          ? settings.green_color.charAt(0).toUpperCase() +
                            settings.green_color.slice(1)
                          : ""
                      }
                      // onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Amount</label>

                  <input
                    type="text"
                    className={`form-control`}
                    name="green_amount"
                    value={settings.green_amount}
                    onChange={handleChange}
                    maxLength={6}
                  />
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
