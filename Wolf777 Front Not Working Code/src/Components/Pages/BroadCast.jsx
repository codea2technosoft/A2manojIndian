import React, { useEffect, useState } from "react";
import axios from "axios";

const BroadCast = () => {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Environment setup
    // const backendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
    // const backendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
    // const nodeMode = process.env.NODE_ENV;
    // const baseUrl =
    //     nodeMode === "development" ? backendLocalApiUrl : backendLiveApiUrl;

      const baseUrl = process.env.REACT_APP_BACKEND_API;


    const userId = localStorage.getItem("user_id");

    useEffect(() => {
        const fetchNotices = async () => {
            if (!userId) {
                setError("User ID not found");
                return;
            }

            try {
                setLoading(true);
                const res = await axios.get(`${baseUrl}/manage-notice`);
                console.log("Notice API Response:", res.data);

                // ✅ handle API structure correctly
                if (res.data?.success && res.data?.data) {
                    // since `data` is an object, wrap it inside an array for rendering
                    setNotices([res.data.data]);
                    setError("");
                } else {
                    setNotices([]);
                    setError("No notice data found");
                }
            } catch (err) {
                console.error("Error fetching notices:", err);
                setError("Failed to load notices");
            } finally {
                setLoading(false);
            }
        };

        fetchNotices();
    }, [baseUrl, userId]);

    return (
        <div className="notice-page">

            <div className="card notice">
                <div className="card-header">
                    <h2 className="card-title mb-0">📢 Latest Notices</h2>
                </div>

                <div className="card-body">

                    {loading ? (
                        <p className="loading-text">Loading notices...</p>
                    ) : error ? (
                        <p className="error-text text-danger">{error}</p>
                    ) : notices.length > 0 ? (
                        <div className="notice-list">
                            {notices.map((item, index) => (
                                <div key={index} className="notice-card notification-box mb-2">

                                    <div className="notification-header">
                                        <span className="notif-icon">📣</span>
                                        <h3 className="notif-title">
                                            {item?.description || "Important Update"}
                                        </h3>
                                    </div>

                                    <div className="notification-body">
                                        <p className="notice-body">
                                            {item?.description || "No details available"}
                                        </p>

                                        <p className="notice-date text-muted">
                                            {item?.updated_at
                                                ? new Date(item.updated_at).toLocaleString()
                                                : new Date().toLocaleString()}
                                        </p>
                                    </div>

                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="no-notice">No notices available.</p>
                    )}

                </div>
            </div>

        </div>


    );
};

export default BroadCast;
