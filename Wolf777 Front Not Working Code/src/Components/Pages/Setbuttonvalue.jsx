import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SetButtonValue.scss";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom"; // Add this import

const SetButtonValue = () => {
    const navigate = useNavigate(); // Add this line
    // const backendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
    // const backendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
    // const nodeMode = process.env.NODE_ENV;
    // const baseUrl =
    //     nodeMode === "development" ? backendLocalApiUrl : backendLiveApiUrl;

      const baseUrl = process.env.REACT_APP_BACKEND_API;


    const [buttonValues, setButtonValues] = useState(["100", "200", "500", "1000", "2000",]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const savedValues = localStorage.getItem("buttonValues");
        if (savedValues) {
            setButtonValues(JSON.parse(savedValues));
        }
        fetchButtonValues();
    }, []);

    useEffect(() => {
        localStorage.setItem("buttonValues", JSON.stringify(buttonValues));
    }, [buttonValues]);

    const fetchButtonValues = async () => {
        try {
            const userId = localStorage.getItem("user_id");
            if (!userId) return;

            const response = await axios.get(`${baseUrl}/get-button-value?user_id=${userId}`);
            console.log("Fetch Button Value Response:", response.data);

            if (response.data.status_code === 1 && response.data.data) {
                setButtonValues(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching button values:", error);
            toast.error("Unable to fetch button values. Please try again.");
        }
    };

    const updateButtonValues = async (values) => {
        const userId = localStorage.getItem("user_id");
        if (!userId) {
            toast.error("User not authenticated");
            return false;
        }

        const valuesString = values.join(",");

        try {
            const response = await axios.post(
                `${baseUrl}/button-value?user_id=${userId}&value=${valuesString}`,
                {},
                { headers: { "Content-Type": "application/json" } }
            );

            if (response.data.status_code === 1) {
                toast.success("Button values updated successfully!");
                return true;
            } else {
                toast.error(response.data.message || "Failed to update values");
                return false;
            }
        } catch (error) {
            console.error("Error updating button values (POST):", error);
            return false;
        }
    };

    const updateButtonValuesWithGet = async (values) => {
        const userId = localStorage.getItem("user_id");
        if (!userId) {
            toast.error("User not authenticated");
            return false;
        }

        const valuesString = values.join(",");

        try {
            const response = await axios.get(
                `${baseUrl}/button-value?user_id=${userId}&value=${valuesString}`
            );

            if (response.data.status_code === 1) {
                toast.success("Button values updated successfully!");
                return true;
            } else {
                toast.error(response.data.message || "Failed to update values");
                return false;
            }
        } catch (error) {
            console.error("Error updating button values (GET):", error);
            toast.error("Server not responding. Please try again later.");
            return false;
        }
    };

    const handleValueChange = (index, value) => {
        const updated = [...buttonValues];
        updated[index] = value;
        setButtonValues(updated);
    };

    const handleAddValue = () => {
        if (buttonValues.length >= 6) {
            toast.info("You can add up to 6 button values only.");
            return;
        }
        setButtonValues([...buttonValues, ""]);
    };

    const handleRemoveValue = (index) => {
        if (buttonValues.length <= 1) {
            toast.warning("At least one value is required.");
            return;
        }

        const updated = buttonValues.filter((_, i) => i !== index);
        setButtonValues(updated);

        setLoading(true);
        updateButtonValues(updated)
            .then((success) => {
                if (!success) return updateButtonValuesWithGet(updated);
            })
            .finally(() => setLoading(false));
    };

    const handleSubmit = async () => {
        if (buttonValues.some((val) => !val || isNaN(val) || Number(val) <= 0)) {
            toast.error("All values must be positive numbers");
            return;
        }

        setLoading(true);
        const success = await updateButtonValues(buttonValues);
        if (!success) await updateButtonValuesWithGet(buttonValues);
        setLoading(false);

 setTimeout(() => {
  navigate("/indexpage");       // ya "/index", "/home", jo bhi route ho
}, 500);
    };

    return (
        <>
            <ToastContainer position="top-center" autoClose={2000} />

            <div className="card">
                <div className="card-header bg-gradient-color">
                    <div className="card-title text-start mb-0 text-white">
                        Set Button Value
                    </div>
                </div>

                <div className="card-body">
                    <div className="value-list">
                        {buttonValues.slice(0, 8).map((val, index) => (
                            <div className="value-item" key={index}>
                                <input
                                    type="number"
                                    value={val}
                                    onChange={(e) => handleValueChange(index, e.target.value)}
                                    className="value-input"
                                    placeholder="Enter Value"
                                    min="1"
                                />

                                {/* <button
                                    className="remove-btn"
                                    onClick={() => handleRemoveValue(index)}
                                    disabled={loading || buttonValues.length <= 1}
                                >
                                    ✕
                                </button> */}
                            </div>
                        ))}


                        {/* <div className="add-value-section">
                            {buttonValues.length !== 6 && (
                                <button className="add-btn" onClick={handleAddValue}>
                                    + Add Value
                                </button>
                            )}
                        </div> */}
                    </div>

                    <div className="submit-section">
                        <button
                            className="submit-btn"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Submit"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SetButtonValue;