import React, { useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import Leftsidebar from "../Mydashboard/Leftsidebar";
import { FaUser, FaMobileAlt, FaEnvelope, FaIdBadge, FaCity, FaRegAddressCard, FaWhatsapp, FaBirthdayCake, FaRing, FaRegIdCard, FaRegUserCircle, FaPencilAlt, FaEdit } from 'react-icons/fa';
import { MdEmail, MdOutlineLocationCity, MdOutlineHome, MdDateRange, MdOutlineVpnKey, MdVerified, MdLockReset } from 'react-icons/md';
import { AiOutlineUser, AiOutlineCheckCircle } from 'react-icons/ai';
import { RiMapPinLine, RiShieldUserLine } from 'react-icons/ri';
import loginimage from '../../assets/images/login.svg';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";

const API_URL = process.env.REACT_APP_API_URL;

const formatDateToDDMMYYYY = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const toSentenceCase = (str) => {
  if (!str) return "";
  const cleaned = str.trim().toLowerCase();
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
};

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const [editForm, setEditForm] = useState({
    username: "",
    email: "",
    whatsapp_number: "",
    state: "",
    city: "",
    area: "",
    dob: "",
    marriage_anniversary_date: "",
    rera_number: "",
    address: "",
    image: null,
  });

  const getAuthToken = () => localStorage.getItem("token");

  const stateOptions = states.map((state) => ({ value: state.id, label: state.name }));
  const cityOptions = cities.map((city) => ({ value: city.id, label: city.name }));

  useEffect(() => {
    const fetchStates = async () => {
      const token = getAuthToken();
      if (!token) return;
      const res = await fetch(`${API_URL}/state-list`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) setStates(data.data || []);
    };
    fetchStates();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      if (!editForm.state) return setCities([]);
      const token = getAuthToken();
      const res = await fetch(`${API_URL}/city-list`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ state_id: editForm.state }),
      });
      const data = await res.json();
      if (res.ok) setCities(data.data || []);
    };
    fetchCities();
  }, [editForm.state]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          setError("User not logged in");
          setLoading(false);
          return;
        }
        const res = await fetch(`${API_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok && data.status === "1") {
          setProfile(data.data);
        } else {
          setError(data.message || "Failed to fetch profile");
        }
      } catch (err) {
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleProfileUpdate = async () => {
    const token = getAuthToken();
    if (!token) {
      Swal.fire("Error", "Token not found", "error");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/profile-update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (res.ok && data.status === "1") {
        Swal.fire({
          icon: "success",
          title: "Profile Updated",
          text: "Your profile has been updated successfully.",
          confirmButtonColor: "#226d36",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
        setShowModal(false);
      } else {
        Swal.fire("Error", data.message || "Update failed", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <span className="ms-2">Loading profile...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-danger text-center">
        <div className="image_login">
          <img src={loginimage} alt="Login" />
        </div>
        {error}
      </div>
    );
  }


  return (
        <>
          <div className="card">
            
            <div className="card-header bg_design_color_header">
                  <div className="d-flex align-items-center justify-content-between">
            <div className="titlepage">
                              <h3><FaUser/>User Profile</h3>

            </div>
            <div className="d-flex justify-content-end gap-2">
            <button
              className="submitbutton_design"
              onClick={() => {
                setEditForm({
                  username: profile?.username || "",
                  email: profile?.email || "",
                  whatsapp_number: profile?.whatsapp_number || "",
                  area: profile?.area || "",
                  dob: profile?.dob || "",
                  marriage_anniversary_date:
                    profile?.marriage_anniversary_date || "",
                  rera_number: profile?.rera_number || "",
                  address: profile?.address || "",
                });
                setShowModal(true);
              }}
            >
            <FaEdit/>  Edit Profile
            </button>
           
              

              </div>
          </div>
           
            </div>
            <div className="card-body">
              <div className="row">
              

             {[
  { label: "Mobile", icon: <FaMobileAlt />, value: profile?.mobile ,placeholder:"Mobile"},
  { label: "Email", icon: <MdEmail />, value: profile?.email || "N/A" ,placeholder:"Email"},
  { label: "Reffer ID", icon: <FaIdBadge />, value: profile?.reffer_id ,placeholder:"Reffer ID"},
  { label: "State", icon: <RiMapPinLine />, value: profile?.state.name ,placeholder:"State"},
  { label: "City", icon: <MdOutlineLocationCity />, value: profile?.city.name ,placeholder:"City"},
  { label: "Area", icon: <MdOutlineHome />, value: toSentenceCase(profile?.area) ,placeholder:"Area"},
  { label: "WhatsApp", icon: <FaWhatsapp  />, value: profile?.whatsapp_number ,placeholder:"WhatsApp Number"},
  { label: "DOB", icon: <FaBirthdayCake />, value: formatDateToDDMMYYYY(profile?.dob),placeholder:"Date Of Birth"},
  { label: "Anniversary", icon: <FaRing />, value: formatDateToDDMMYYYY(profile?.marriage_anniversary_date  ),placeholder:"Anniversary"},
  { label: "PAN", icon: <FaRegIdCard />, value: profile?.pan_number || "N/A" ,placeholder:"PAN"},
  { label: "RERA", icon: <MdVerified />, value: profile?.rera_number || "N/A" ,placeholder:"RERA"},
  { label: "Aadhar Number", icon: <RiShieldUserLine />, value: profile?.adhar_number || "N/A" ,placeholder:"Aadhar Number"},
  // { label: "First Time Password Change", icon: <MdLockReset />, value: toSentenceCase(profile?.first_time_password_change) ,placeholder:""},
  { label: "Status", icon: <AiOutlineCheckCircle />, value: toSentenceCase(profile?.status) ,placeholder:"Status"},
  { label: "Address", icon: <FaRegAddressCard />, value: toSentenceCase(profile?.address) ,placeholder:"Address"},
               ].map((item, index) => (
              <div key={index} className="col-sm-6 mt-0">
                <div className="form-group profileinputbox">
                  <label htmlFor="">{item.label}</label>
                  <div className="inputfield">
                  <div className="icon_all">
                      {item.icon}
                  </div>
                  <input type="text" placeholder={item.placeholder} value={item.value}  disabled />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* <div className="d-flex justify-content-end">
            <button className="submitbutton" onClick={handleLogout}>
              Logout
            </button>
          </div> */}
            </div>
          </div>
             {showModal && (
        <>
          <div className="overlay_design"></div>
          <div className="custom-modal editprofile_modal">
            <div className="modal-content">
              <div className="card">
                <div className="card-header">Edit Profile</div>
                <div className="card-body">
                  {/* Name */}
                  <div className="row">
                    <div className="col-md-4 col-12">
                      <div className="mb-2">
                        <label className="form-label">Name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Name"
                          value={editForm.username}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              username: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="col-md-4 col-12">
                      <div className="mb-2">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          placeholder="Email"
                          value={editForm.email}
                          onChange={(e) =>
                            setEditForm({ ...editForm, email: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="col-md-4 col-12">
                      {" "}
                      <div className="mb-2">
                        <label className="form-label">WhatsApp Number</label>
                        <input
                          type="text"
                          maxLength={10}
                          className="form-control"
                          placeholder="Whatsapp Number"
                          value={editForm.whatsapp_number}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              whatsapp_number: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="col-md-4 col-12">
                      <div className="mb-2">
                        <label className="form-label">Area</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Area"
                          value={editForm.area}
                          onChange={(e) =>
                            setEditForm({ ...editForm, area: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="col-md-4 col-12">
                      <div className="mb-2">
                        <label className="form-label">Date of Birth</label>
                        <div className="w-100">
                          {/* <DatePicker
                            selected={
                              editForm.dob ? new Date(editForm.dob) : null
                            }
                            onChange={(date) =>
                              setEditForm({
                                ...editForm,
                                dob: date.toISOString().split("T")[0],
                              })
                            }
                            dateFormat="dd-MM-yyyy"
                            placeholderText="Select DOB"
                            showYearDropdown
                            scrollableYearDropdown
                            className="form-control w-100"
                          /> */}
                            <input
                            type="text"
                            className="form-control"
                            placeholder="DD-MM-YYYY"

                            value={editForm.dob || ""}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                dob: e.target.value,
                              })
                            }
                          />

                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 col-12">
                      {" "}
                      <div className="mb-2">
                        <label className="form-label">
                          Marriage Anniversary Date
                        </label>
                        <div>
                          {/* <DatePicker
                            selected={
                              editForm.marriage_anniversary_date
                                ? new Date(editForm.marriage_anniversary_date)
                                : null
                            }
                            onChange={(date) =>
                              setEditForm({
                                ...editForm,
                                marriage_anniversary_date: date
                                  .toISOString()
                                  .split("T")[0],
                              })
                            }
                            dateFormat="dd-MM-yyyy"
                            placeholderText="Select Anniversary Date"
                            showYearDropdown
                            scrollableYearDropdown
                            className="form-control"
                            placeholder="Name"
                          /> */}
                          
                           <input
                                type="text"
                                className="form-control"
                                placeholder="DD-MM-YYYY"
                                value={editForm.marriage_anniversary_date || ""}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    marriage_anniversary_date: e.target.value,
                                  })
                                }
                              />

                        </div>
                      </div>
                    </div>

                    <div className="col-md-4 col-12">
                      <div className="mb-2">
                        <label className="form-label">State</label>
                        <Select
                          name="state"
                          options={stateOptions}
                          value={stateOptions.find(
                            (opt) => opt.value === editForm.state
                          )}
                          onChange={(selectedOption) =>
                            setEditForm({
                              ...editForm,
                              state: selectedOption?.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="col-md-4 col-12">
                      {" "}
                      <div className="mb-2">
                        <label className="form-label">City</label>
                        <Select
                          name="city"
                          options={cityOptions}
                          value={cityOptions.find(
                            (opt) => opt.value === Number(editForm.city)
                          )}
                          onChange={(selectedOption) =>
                            setEditForm({
                              ...editForm,
                              city: selectedOption?.value,
                            })
                          }
                          isDisabled={
                            !editForm.state || cityOptions.length === 0
                          }
                        />
                      </div>
                    </div>
                    <div className="col-md-4 col-12">
                      <div className="mb-2">
                        <label className="form-label">RERA Number</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="RERA Number"
                          value={editForm.rera_number}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              rera_number: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="mb-2">
                        <label className="form-label">Address</label>
                        <textarea
                          className="form-control"
                          placeholder="Address"
                          value={editForm.address}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              address: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="d-flex justify-content-end gap-2 mt-4">
                        <button
                          className="btn btn-success"
                          onClick={handleProfileUpdate}
                        >
                          &nbsp;&nbsp;Update&nbsp;&nbsp;
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => setShowModal(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
        </>
  );
};

export default Profile;
