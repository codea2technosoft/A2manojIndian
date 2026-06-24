import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Select from "react-select";

function YourComponent() {
    const [uplineList, setUplineList] = useState([]);
    const [loadingUpline, setLoadingUpline] = useState(false);
    const [selectedUpline, setSelectedUpline] = useState(null);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    // Fetch Upline List
    const fetchUplineList = async () => {
        try {
            setLoadingUpline(true);

            const admin_id = localStorage.getItem("admin_id");
            const role = "3";

            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/get-create-admin-list`,
                { role, admin_id },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                const formattedData = response.data.data.map(item => ({
                    value: item.admin_id,
                    label: item.username,
                    original: item
                }));
                
                setUplineList(formattedData);
            } 
            else {
                toast.error(response.data.message || "Failed to load upline list");
                setUplineList([]);
            }

        } catch (error) {
            console.error("Error fetching upline list:", error);
            toast.error("Failed to load upline list");
            setUplineList([]);
        } finally {
            setLoadingUpline(false);
        }
    };

    // Handle Select Change
    const handleUplineChange = (selectedOption) => {
        setSelectedUpline(selectedOption);

        if (selectedOption) {
            navigate(`/CreateAgentnew/${selectedOption.value}`);
        }
    };

    useEffect(() => {
        if (token) fetchUplineList();
    }, [token]);

    return (
        <div className="card-body">
            <div className="row">
                <div className="col-md-8">
                    <label className="form-label">
                        Select Super Agent <span className="text-danger">*</span>
                    </label>

                    <div className="d-flex gap-2">

                        {/* ✅ React Select Component */}
                        <Select
                            className="w-100"
                            options={uplineList}
                            value={selectedUpline}
                            onChange={handleUplineChange}
                            isLoading={loadingUpline}
                            isDisabled={loadingUpline || isSubmitting}
                            placeholder="Search Super Agent..."
                        />

                        {/* Refresh Button */}
                        <button
                            type="button"
                            className="refreshbutton"
                            onClick={fetchUplineList}
                            disabled={loadingUpline}
                        >
                            {loadingUpline ? (
                                <span className="spinner-border spinner-border-sm me-2"></span>
                            ) : (
                                <i className="fas fa-sync-alt me-2"></i>
                            )}
                            Refresh
                        </button>

                    </div>

                    {/* Error Message */}
                    {errors.upline_id && (
                        <div className="invalid-feedback d-block">{errors.upline_id}</div>
                    )}

                    {/* Loading Text */}
                    {loadingUpline && (
                        <div className="mt-2">
                            <span className="spinner-border spinner-border-sm text-primary me-2"></span>
                            <small className="text-muted">Loading upline list...</small>
                        </div>
                    )}

                    {/* No Data */}
                    {uplineList.length === 0 && !loadingUpline && (
                        <small className="text-warning">
                            No upline users found. Please check your API or contact support.
                        </small>
                    )}
                </div>
            </div>
        </div>
    );
}

export default YourComponent;
