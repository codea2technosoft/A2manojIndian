import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function SelectMaster() {
    const [uplineList, setUplineList] = useState([]);
    const [loadingUpline, setLoadingUpline] = useState(false);
    const [selectedUpline, setSelectedUpline] = useState('');
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
const [searchText, setSearchText] = useState("");

    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const fetchUplineList = async () => {
        try {
            setLoadingUpline(true);
            const admin_id = localStorage.getItem("admin_id");
            const role = "2";
            
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/get-create-admin-list`,
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
                setUplineList(response.data.data || []);
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
    const handleUplineChange = (e) => {
        const selectedValue = e.target.value;
        setSelectedUpline(selectedValue);
        if (errors.upline_id) {
            setErrors(prev => ({ ...prev, upline_id: '' }));
        }
        if (selectedValue) {
            const selectedUser = uplineList.find(user => user.admin_id === selectedValue);
            if (selectedUser) {
                navigate(`/CreateSuperAgent/${selectedUser.admin_id}`);
            }
        }
    };
    const handleUsernameClick = (adminId) => {
        navigate(`/Updatesuperagent/${adminId}`);
    };
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
                        Select Master <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                        {/* <select
                            className={`form-select ${errors.upline_id ? 'is-invalid' : ''}`}
                            value={selectedUpline}
                            onChange={handleUplineChange}
                            disabled={loadingUpline || isSubmitting}
                            required
                        >
                            <option value="">-- Select Master --</option>
                            {uplineList.map((user) => (
                                <option key={user.admin_id} value={user.admin_id}>
                                    {user.username}
                                </option>
                            ))}
                        </select> */}
                        <select
  className={`form-select ${errors.upline_id ? 'is-invalid' : ''}`}
  value={selectedUpline}
  onChange={handleUplineChange}
  disabled={loadingUpline || isSubmitting}
  required
>
  <option value="">-- Select Master --</option>
  {uplineList
    .filter(user => user.username.toLowerCase().includes(searchText.toLowerCase()))
    .map(user => (
      <option key={user.admin_id} value={user.admin_id}>
        {user.username}
      </option>
    ))}
</select>

<input
  type="text"
  placeholder="Search Master..."
  value={searchText}
  onChange={(e) => setSearchText(e.target.value)}
  className="form-control my-2"
/>
                        <button
                            type="button"
                            className="btn btn-outline-primary"
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

export default SelectMaster;