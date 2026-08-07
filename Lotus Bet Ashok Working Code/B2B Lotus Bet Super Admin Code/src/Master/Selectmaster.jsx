import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";

function CustomDropdown() {
  const [uplineList, setUplineList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedUpline, setSelectedUpline] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Fetch upline list from API
  const fetchUplineList = async () => {
    try {
      setLoading(true);
      const admin_id = localStorage.getItem("admin_id");
      const role = "2";

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/get-create-admin-list`,
        { role, admin_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.success) {
        setUplineList(response.data.data || []);
        toast.success("Upline list loaded successfully!");
      } else {
        toast.error(response.data.message || "Failed to load upline list");
        setUplineList([]);
      }
    } catch (err) {
      console.error("Error fetching upline list:", err);
      toast.error("Failed to load upline list");
      setUplineList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchUplineList();
  }, [token]);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter upline list
  const filteredUpline = uplineList.filter((user) =>
    user.username.toLowerCase().includes(searchText.toLowerCase()),
  );

  const handleSelect = (user) => {
    setSelectedUpline(user);
    setSearchText(user.username);
    setDropdownOpen(false);
    navigate(`/agent_lists/create-new-master/${user.admin_id}`);
  };

  return (
    <Row>
      <Col md={8}>
        <div className="card">
          <div className="card-body">
            <label className="form-label">
              Select Master <span className="text-danger">*</span>
            </label>
            <div className="d-flex gap-2">
              <div className="w-100 w-md-50">
                <div className="custom-dropdown" ref={dropdownRef}>
                  <input
                    type="text"
                    placeholder={loading ? "Loading..." : "Search Master..."}
                    value={searchText}
                    onChange={(e) => {
                      setSearchText(e.target.value);
                      setDropdownOpen(true);
                    }}
                    onFocus={() => setDropdownOpen(true)}
                    disabled={loading}
                    className="form-control"
                  />

                  {dropdownOpen && (
                    <div className="options">
                      {filteredUpline.length > 0 ? (
                        filteredUpline.map((user) => (
                          <div
                            key={user.admin_id}
                            className="option-item"
                            onClick={() => handleSelect(user)}
                          >
                            {user.username}
                          </div>
                        ))
                      ) : (
                        <div className="option-item disabled">
                          No master found
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {selectedUpline && (
                  <p style={{ marginTop: "10px" }}>
                    Selected Master: <strong>{selectedUpline.username}</strong>
                  </p>
                )}
              </div>

              {/* Refresh button */}
              <button
                type="button"
                className="refreshbutton"
                onClick={fetchUplineList}
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm me-2"></span>
                ) : (
                  <i className="fas fa-sync-alt me-2"></i>
                )}
                Refresh
              </button>
            </div>
          </div>
        </div>
      </Col>
    </Row>
  );
}

export default CustomDropdown;
