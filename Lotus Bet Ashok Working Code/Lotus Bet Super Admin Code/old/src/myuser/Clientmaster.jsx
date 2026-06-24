import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Select from "react-select";

function YourComponent() {
    const [uplineList, setUplineList] = useState([]);
    const [loadingUpline, setLoadingUpline] = useState(false);
    const [selectedUpline, setSelectedUpline] = useState('');
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    // API function to fetch upline list
    const fetchUplineList = async () => {
        try {
            setLoadingUpline(true);
            const admin_id = localStorage.getItem("admin_id");
            const role = "4";

            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/get-create-user-list`,
                {
                    role: role,
                    admin_id: admin_id
                },
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


                // setUplineList(response.data.data || []);
                toast.success("Upline list loaded successfully!");
            } else {
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

    // Handle upline selection change
    // const handleUplineChange = (e) => {
    //     const selectedValue = e.target.value;
    //     setSelectedUpline(selectedValue);

    //     // Clear error when user selects an option
    //     if (errors.upline_id) {
    //         setErrors(prev => ({ ...prev, upline_id: '' }));
    //     }

    //     // If a valid option is selected, navigate to the update page
    //     if (selectedValue) {
    //         // Find the selected user from uplineList
    //         const selectedUser = uplineList.find(user => user.admin_id === selectedValue);
    //         if (selectedUser) {
    //             // Navigate to update page with admin_id
    //             navigate(`/CreateAgentmyuser/${selectedUser.admin_id}`);
    //         }
    //     }
    // };



    const handleUplineChange = (selectedOption) => {
        setSelectedUpline(selectedOption);
        if (selectedOption) {
            navigate(`/CreateAgentmyuser/${selectedOption.value}`);
        }
    };


    // Handle click on username (alternative method)
    const handleUsernameClick = (adminId) => {
        navigate(`/Updatesuperagent/${adminId}`);
    };

    // Call fetchUplineList when component mounts
    useEffect(() => {
        if (token) {
            fetchUplineList();
        }
    }, [token]);

    return (
        <div className="card-body">
            <div className="row">
                <div className="col-md-8">
                    <label className="form-label">
                        Select Agent <span className="text-danger">*</span>
                    </label>
                    <div className="d-flex gap-2">
                        {/* <select
                            className={`form-select ${errors.upline_id ? 'is-invalid' : ''}`}
                            value={selectedUpline}
                            onChange={handleUplineChange}
                            disabled={loadingUpline || isSubmitting}
                            required
                        >
                            <option value="">-- Select Agent --</option>
                            {uplineList.map((user) => (
                                <option key={user.admin_id} value={user.admin_id}>
                                    {user.username}
                                </option>
                            ))}
                        </select> */}
                        <Select
                            className="w-100"
                            options={uplineList}
                            value={selectedUpline}
                            onChange={handleUplineChange}
                            isLoading={loadingUpline}
                            isDisabled={loadingUpline || isSubmitting}
                            placeholder="Search Agent..."
                        />

                        <button
                            type="button"
                            className="refreshbutton"
                            onClick={fetchUplineList}
                            disabled={loadingUpline || isSubmitting}
                        >
                            {loadingUpline ? (
                                <span className="spinner-border spinner-border-sm me-2"></span>
                            ) : (
                                <i className="fas fa-sync-alt me-2"></i>
                            )}
                            Refresh
                        </button>
                    </div>
                    {errors.upline_id && (
                        <div className="invalid-feedback d-block">{errors.upline_id}</div>
                    )}
                    {loadingUpline && (
                        <div className="mt-2">
                            <span className="spinner-border spinner-border-sm text-primary me-2"></span>
                            <small className="text-muted">Loading upline list...</small>
                        </div>
                    )}
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