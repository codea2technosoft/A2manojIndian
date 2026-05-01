import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import Select from "react-select";
import { FaPencilAlt, FaEdit } from "react-icons/fa";
import DummyUser from "../../assets/images/dummy_profile.png"
import { IoMdArrowRoundBack } from "react-icons/io";

const API_URL = process.env.REACT_APP_API_URL;
const profileImage = `${process.env.REACT_APP_IMAGE_API_URL}/uploads/profile/`;
const documentImage = `${process.env.REACT_APP_IMAGE_API_URL}/uploads/documents/`;

const Profile = () => {
  const [errors, setErrors] = useState({});
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const validateAadhaar = (aadhaar) => {
    const regex = /^[2-9]{1}[0-9]{11}$/;
    return regex.test(aadhaar);
  };

  const validatePAN = (pan) => {
    const regex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return regex.test(pan);
  };

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
    pan_number: "",
    adhar_number: "",
    pincode: "",
    adhar_front_image: null,
    adhar_back_image: null,
    pan_card_image: null,
  });

  const getAuthToken = () => localStorage.getItem("token");

  const stateOptions = states.map((state) => ({
    value: state.id,
    label: state.name,
  }));

  const cityOptions = cities.map((city) => ({
    value: city.id,
    label: city.name,
  }));

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
      const token = getAuthToken();
      if (!token) return setError("User not logged in");
      const res = await fetch(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.status == "1") {
        setProfile(data.data);
        setImageUrl(data.imagePath);
        // Populate editForm with existing profile data
        setEditForm(prev => ({
          ...prev,
          username: data.data?.username || "",
          email: data.data?.email || "",
          whatsapp_number: data.data?.whatsapp_number || "",
          area: data.data?.area || "",
          dob: data.data?.dob || "",
          marriage_anniversary_date: data.data?.marriage_anniversary_date || "",
          rera_number: data.data?.rera_number || "",
          address: data.data?.address || "",
          pincode: data.data?.pincode || "",
          adhar_number: data.data?.adhar_number || "",
          pan_number: data.data?.pan_number || "",
          state: data.data?.state?.id || "",
          city: data.data?.city?.id || "",
        }));
      } else {
        setError(data.message || "Failed to fetch profile");
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setEditForm({
        ...editForm,
        [fieldName]: file,
      });
    }
  };

  const handleProfileUpdate = async () => {
    const token = getAuthToken();
    if (!token) {
      Swal.fire("Error", "Token not found", "error");
      return;
    }

    const formData = new FormData();

    // Add all text fields to FormData
    formData.append('username', editForm.username || '');
    formData.append('email', editForm.email || '');
    formData.append('whatsapp_number', editForm.whatsapp_number || '');
    formData.append('state', editForm.state || '');
    formData.append('city', editForm.city || '');
    formData.append('area', editForm.area || '');
    formData.append('dob', editForm.dob || '');
    formData.append('marriage_anniversary_date', editForm.marriage_anniversary_date || '');
    formData.append('rera_number', editForm.rera_number || '');
    formData.append('address', editForm.address || '');
    formData.append('pan_number', editForm.pan_number || '');
    formData.append('adhar_number', editForm.adhar_number || '');
    formData.append('pincode', editForm.pincode || '');

    // Add image files if they exist
    if (editForm.adhar_front_image instanceof File) {
      formData.append('adhar_front_image', editForm.adhar_front_image);
    }
    if (editForm.adhar_back_image instanceof File) {
      formData.append('adhar_back_image', editForm.adhar_back_image);
    }
    if (editForm.pan_card_image instanceof File) {
      formData.append('pan_card_image', editForm.pan_card_image);
    }

    try {
      const res = await fetch(`${API_URL}/profile-update`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.status === "1") {
        Swal.fire(
          "🎉 All Set!",
          "Your profile information is now up-to-date.",
          "success"
        );
        setShowModal(false);
        // Refresh profile data
        const refreshRes = await fetch(`${API_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const refreshData = await refreshRes.json();
        if (refreshRes.ok && refreshData.status == "1") {
          setProfile(refreshData.data);
        }
      } else {
        Swal.fire("Error", data.message || "Update failed", "error");
      }
    } catch (error) {
      console.error("Update failed:", error);
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  const toSentenceCase = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const formatDate = (str) => {
    if (!str) return "";
    const d = new Date(str);
    return `${d.getDate().toString().padStart(2, "0")}-${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${d.getFullYear()}`;
  };

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  if (loading)
    return <Spinner animation="border" className="mt-5 mx-auto d-block" />;
  if (error) return <p className="text-danger text-center mt-4">{error}</p>;

  return (
    <div className="padding_15">
      <div className="card">
        <div className="card-header">
          <div className="d-flex align-items-center justify-content-between">
            <div className="titlepage">
              <h3>User Profile</h3>
            </div>
            <div className="d-flex justify-content-end gap-2">
              {/* <button className="submitbutton_design"
                onClick={() => setShowModal(true)}
              >
                <FaEdit /> Edit Profile
              </button> */}
              <div className="backbutton">
                <Link to="/all-project"><IoMdArrowRoundBack/> Back</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="card-body">
          <div className="row">
            <div className="col-md-4 text-center mb-4">
              <div className="position-relative">
                {profile && profile.profile ? (
                  <img
                    src={`${profileImage}${profile.profile}`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = {DummyUser};
                    }}
                    alt="Profile"
                    className="rounded-circle profile_designall"
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <img
                    src={DummyUser}
                    alt="Profile"
                    className="rounded-circle profile_designall"
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "cover",
                    }}
                  />
                )}
                <div>
                  {profile && (
                    <div className="btn_edit alleditbutton">
                      <label
                        htmlFor="fileUpload"
                        className="edit_btn_label d-flex align-items-center gap-1"
                        style={{
                          justifyContent: "flex-start",
                        }}
                      >
                        <FaPencilAlt className="text-white" />
                      </label>
                      <input
                        type="file"
                        id="fileUpload"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (!file) return;

                          try {
                            const token = localStorage.getItem("token");
                            const formData = new FormData();
                            formData.append("image", file);

                            const response = await fetch(
                              `${process.env.REACT_APP_API_URL}/profile-image-update`,
                              {
                                method: "POST",
                                headers: {
                                  Authorization: `Bearer ${token}`,
                                },
                                body: formData,
                              }
                            );

                            const data = await response.json();

                            if (response.ok && data.status == "1") {
                              Swal.fire({
                                icon: "success",
                                title: "Image Updated",
                                text: "✅ Profile image updated successfully!",
                                confirmButtonColor: "#226d36",
                              }).then((response) => {
                                if (response.isConfirmed) {
                                  window.location.reload();
                                }
                              });
                            } else {
                              Swal.fire({
                                icon: "warning",
                                title: "Warning",
                                text: "! Internal Server Error",
                                confirmButtonColor: "#90a728ff",
                              });
                            }
                          } catch (err) {
                            console.error("Upload error:", err);
                            Swal.fire({
                              icon: "error",
                              title: "Error Found",
                              text: "❌ Some things went wrongs",
                              confirmButtonColor: "#a72828ff",
                            });
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
              {profile && (
                <>
                  <div className="profiledetails">
                    <h5 className="">
                      {profile?.username && toSentenceCase(profile.username)}
                    </h5>
                    <div className="kycstatusdesign">
                      {[
                        {
                          label: "KYC Status",
                          value: toSentenceCase(profile?.kyc),
                        },
                      ].map((item, index) => (
                        <div key={index} className="col-sm-12">
                          <div className="d-flex align-items-center gap-2 kycbadge">
                            <label>{item.label}</label>
                            <span
                              className={`kycbadgeall ${item.value.toLowerCase() === "success"
                                ? "badge-success"
                                : item.value.toLowerCase() === "pending"
                                  ? "badge-warning"
                                  : item.value.toLowerCase() === "rejected"
                                    ? "badge-danger"
                                    : ""
                                }`}
                            >
                              {item.value}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="col-md-8">
              <div className="row g-3">
                {[
                  { label: "Mobile", value: profile?.mobile },
                  {
                    label: "Total Advance Balance",
                    value: profile?.advance_payment ?? "0.00"
                  },
                  {
                    label: "Total Achieved (Buy SQYD)",
                    value: profile?.buysqrt ?? "0.00"
                  },
                  {
                    label: "Designation",
                    value: profile?.designation || "NA"
                  },
                  { label: "Email", value: profile?.email || "N/A" },
                  {
                    label: "Parent Name",
                    value: profile?.parent_name ?? "N/A"
                  },
                  { label: "State", value: profile?.state?.name || "N/A" },
                  { label: "City", value: profile?.city?.name || "N/A" },
                  { label: "Area", value: toSentenceCase(profile?.area) },
                  { label: "WhatsApp", value: profile?.whatsapp_number },
                  { label: "DOB", value: formatDate(profile?.dob) },
                  {
                    label: "Anniversary Date",
                    value: formatDate(profile?.marriage_anniversary_date),
                  },
                  { label: "Pin Code", value: profile?.pincode },
                  {
                    label: "User Type",
                    value: toSentenceCase(profile?.user_type),
                  },
                  { label: "PAN", value: profile?.pan_number || "N/A" },
                  {
                    label: "RERA",
                    value: toSentenceCase(profile?.rera_number) || "N/A",
                  },
                  {
                    label: "Aadhar Number",
                    value: profile?.adhar_number || "N/A",
                  },
                  {
                    label: "Status",
                    value:
                      profile?.rera_number == null || profile?.rera_number?.trim() === ""
                        ? "Inactive"
                        : "Active"
                  },
                  { label: "Address", value: toSentenceCase(profile?.address) },
                ].map((item, index) => (
                  item.label === "Address" ? (
                    <div key={index} className="col-sm-12">
                      <div className="form-group">
                        <label htmlFor="">{item.label}</label>
                        <textarea
                          value={item.value}
                          rows={3}
                          placeholder="Enter address"
                          className="inputbgcolor"
                          readOnly
                        />
                      </div>
                    </div>
                  ) : (
                    <div key={index} className="col-sm-6">
                      <div className="form-group">
                        <label htmlFor="">{item.label}</label>
                        <input
                          className="inputbgcolor"
                          type="text"
                          value={item.value}
                          placeholder={`Enter ${item.label}`}
                          readOnly
                        />
                      </div>
                    </div>
                  )
                ))}

                {/* Document Images Section */}
                <div className="col-md-12 mt-4">
                  <h5 className="mb-3">Document Images</h5>
                  <div className="row">
                    {/* Aadhar Front Image */}
                    <div className="col-md-4 col-12 mb-3">
                      <div className="card document-card h-100">
                        <div className="card-body text-center p-2">
                          <h6 className="card-title">Aadhar Front</h6>
                          {profile?.adhar_front_image ? (
                            <>
                              <div className="document-preview mb-2">
                                <img
                                  src={`${profileImage}${profile.adhar_front_image}`}
                                  alt="Aadhar Front"
                                  className="img-fluid rounded"
                                  style={{
                                    minHeight: "120px",
                                    maxHeight: "120px",
                                    objectFit: "contain",
                                    cursor: "pointer"
                                  }}
                                  onClick={() => openImageModal(`${profileImage}${profile.adhar_front_image}`)}
                                />
                              </div>

                            </>
                          ) : (
                            <div className="text-muted">
                              <p>No image uploaded</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Aadhar Back Image */}
                    <div className="col-md-4 col-12 mb-3">
                      <div className="card document-card h-100">
                        <div className="card-body text-center p-2">
                          <h6 className="card-title">Aadhar Back</h6>
                          {profile?.adhar_back_image ? (
                            <>
                              <div className="document-preview mb-2">
                                <img
                                  src={`${profileImage}${profile.adhar_back_image}`}
                                  alt="Aadhar Back"
                                  className="img-fluid rounded"
                                  style={{
                                    minHeight: "120px",
                                    maxHeight: "120px",
                                    objectFit: "contain",
                                    cursor: "pointer"
                                  }}
                                  onClick={() => openImageModal(`${profileImage}${profile.adhar_back_image}`)}
                                />
                              </div>

                            </>
                          ) : (
                            <div className="text-muted">
                              <p>No image uploaded</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* PAN Card Image */}
                    <div className="col-md-4 col-12 mb-3">
                      <div className="card document-card h-100">
                        <div className="card-body text-center p-2">
                          <h6 className="card-title">PAN Card</h6>
                          {profile?.pan_card_image ? (
                            <>
                              <div className="document-preview mb-2">
                                <img
                                  src={`${profileImage}${profile.pan_card_image}`}
                                  alt="PAN Card"
                                  className="img-fluid rounded"
                                  style={{
                                    minHeight: "120px",
                                    maxHeight: "120px",
                                    objectFit: "contain",
                                    cursor: "pointer"
                                  }}
                                  onClick={() => openImageModal(`${profileImage}${profile.pan_card_image}`)}
                                />
                              </div>

                            </>
                          ) : (
                            <div className="text-muted">
                              <p>No image uploaded</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Image Preview Modal */}
      {showImageModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.8)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Documents Preview</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowImageModal(false)}
                ></button>
              </div>

              <div className="modal-body text-center">
                <img
                  src={selectedImage}
                  alt="Full View"
                  className="img-fluid"
                  style={{ maxHeight: "80vh" }}
                />
              </div>
            </div>
          </div>
        </div>
      )}


      {showModal && (
        <>
          <div className="overlay_design"></div>
          <div className="custom-modal editprofile_modal">
            <div className="modal-content">
              <div className="card">
                <div className="card-header">Edit Profile</div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-4 col-12">
                      <div className="mb-2">
                        <label className="form-label">Name</label>
                        <input
                          type="text"
                          className="form-control"
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
                          value={editForm.email}
                          onChange={(e) =>
                            setEditForm({ ...editForm, email: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="col-md-4 col-12">
                      <div className="mb-2">
                        <label className="form-label">WhatsApp Number</label>
                        <input
                          type="text"
                          maxLength={10}
                          className="form-control"
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
                          value={editForm.area}
                          onChange={(e) =>
                            setEditForm({ ...editForm, area: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="col-md-4 col-12">
                      <div className="mb-2">
                        <label className="form-label">Pin Code</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editForm.pincode}
                          placeholder="Enter Pin code"
                          onChange={(e) =>
                            setEditForm({ ...editForm, pincode: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="col-md-4 col-12">
                      <div className="mb-2">
                        <label className="form-label">Date of Birth</label>
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
                    <div className="col-md-4 col-12">
                      <div className="mb-2">
                        <label className="form-label">
                          Marriage Anniversary Date
                        </label>
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

                    <div className="col-md-4">
                      <div className="mb-2">
                        <label className="form-label">Aadhaar Card Number</label>
                        <textarea
                          className={`form-control ${errors.adhar_number ? "is-invalid" : ""}`}
                          value={editForm.adhar_number}
                          maxLength={12}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            setEditForm({ ...editForm, adhar_number: value });

                            if (value && !validateAadhaar(value)) {
                              setErrors((prev) => ({
                                ...prev,
                                adhar_number: "Invalid Aadhaar number",
                              }));
                            } else {
                              setErrors((prev) => ({ ...prev, adhar_number: "" }));
                            }
                          }}
                        />
                        {errors.adhar_number && (
                          <div className="invalid-feedback">{errors.adhar_number}</div>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="mb-2">
                        <label className="form-label">Pan Card Number</label>
                        <textarea
                          className={`form-control ${errors.pan_number ? "is-invalid" : ""}`}
                          value={editForm.pan_number}
                          maxLength={10}
                          onChange={(e) => {
                            const value = e.target.value.toUpperCase();
                            setEditForm({ ...editForm, pan_number: value });

                            if (value && !validatePAN(value)) {
                              setErrors((prev) => ({
                                ...prev,
                                pan_number: "Invalid PAN number (ABCDE1234F)",
                              }));
                            } else {
                              setErrors((prev) => ({ ...prev, pan_number: "" }));
                            }
                          }}
                        />
                        {errors.pan_number && (
                          <div className="invalid-feedback">{errors.pan_number}</div>
                        )}
                      </div>
                    </div>

                    {/* Aadhar Front Image */}
                    <div className="col-md-4 col-12">
                      <div className="mb-2">
                        <label className="form-label">Aadhar Front Image</label>
                        <div className="d-flex align-items-center gap-2">
                          <input
                            type="file"
                            accept="image/*"
                            className="form-control"
                            onChange={(e) => handleFileChange(e, 'adhar_front_image')}
                          />
                          {editForm.adhar_front_image && (
                            <span className="text-success">✓ Selected</span>
                          )}
                        </div>
                        <img
                          src={`${profileImage}${profile.adhar_front_image}`}
                          alt="Aadhar Front"
                          className="img-fluid rounded my-1"
                          style={{
                            minHeight: "120px",
                            maxHeight: "120px",
                            objectFit: "contain",
                            cursor: "pointer"
                          }}

                          onClick={() => {
                            setSelectedImage(`${profileImage}${profile.adhar_front_image}`);
                            setShowImageModal(true);
                          }}
                        />
                      </div>
                    </div>

                    {/* Aadhar Back Image */}
                    <div className="col-md-4 col-12">
                      <div className="mb-2">
                        <label className="form-label">Aadhar Back Image</label>
                        <div className="d-flex align-items-center gap-2">
                          <input
                            type="file"
                            accept="image/*"
                            className="form-control"
                            onChange={(e) => handleFileChange(e, 'adhar_back_image')}
                          />
                          {editForm.adhar_back_image && (
                            <span className="text-success">✓ Selected</span>
                          )}
                        </div>


                        <img
                          src={`${profileImage}${profile.adhar_back_image}`}
                          alt="Aadhar Front"
                          className="img-fluid rounded my-1"
                          style={{
                            minHeight: "120px",
                            maxHeight: "120px",
                            objectFit: "contain",
                            cursor: "pointer"
                          }}

                          onClick={() => {
                            setSelectedImage(`${profileImage}${profile.adhar_back_image}`);
                            setShowImageModal(true);
                          }}
                        />

                      </div>
                    </div>

                    {/* PAN Card Image */}
                    <div className="col-md-4 col-12">
                      <div className="mb-2">
                        <label className="form-label">PAN Card Image</label>
                        <div className="d-flex align-items-center gap-2">
                          <input
                            type="file"
                            accept="image/*"
                            className="form-control"
                            onChange={(e) => handleFileChange(e, 'pan_card_image')}
                          />
                          {editForm.pan_card_image && (
                            <span className="text-success">✓ Selected</span>
                          )}
                        </div>


                        <img
                          src={`${profileImage}${profile.pan_card_image}`}
                          alt="Aadhar Front"
                          className="img-fluid rounded my-1"
                          style={{
                            minHeight: "120px",
                            maxHeight: "120px",
                            objectFit: "contain",
                            cursor: "pointer"
                          }}
                          onClick={() => {
                            setSelectedImage(`${profileImage}${profile.pan_card_image}`);
                            setShowImageModal(true);
                          }}
                        />

                      </div>
                    </div>

                    <div className="col-md-12">
                      <div className="mb-2">
                        <label className="form-label">Enter Address Details</label>
                        <textarea
                          className="form-control"
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
    </div>
  );
};

export default Profile;