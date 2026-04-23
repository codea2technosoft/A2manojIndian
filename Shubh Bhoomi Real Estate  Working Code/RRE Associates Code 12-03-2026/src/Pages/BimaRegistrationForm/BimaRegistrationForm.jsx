import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Form, Button, Row, Col, Spinner, Modal } from "react-bootstrap";
import { FaUpload, FaArrowLeft } from "react-icons/fa";
import { TbReceiptRupee } from "react-icons/tb";

const API_URL = process.env.REACT_APP_API_URL;
const profileImage = `${process.env.REACT_APP_IMAGE_API_URL}/uploads/profile/`;

function BimaRegistrationForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [associateId, setAssociateId] = useState(null);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [profileLoading, setProfileLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);

  // State for existing images from API
  const [existingImages, setExistingImages] = useState({
    profile_photo: null,
    pan_image: null,
    aadhar_front_image: null,
    aadhar_back_image: null
  });

  const [formData, setFormData] = useState({
    associate_id: "",
    full_name: "",
    mobile: "",
    email: "",
    date_of_birth: "",
    gender: "",
    pan_number: "",
    aadhar_number: "",
    address: "",
    state: "",
    city: "",
    pincode: "",
    nominee_name: "",
    nominee_relation: "",
    nominee_dob: "",
    insurance_amount: "500000",
  });

  const [files, setFiles] = useState({
    pan_image: null,
    aadhar_front_image: null,
    aadhar_back_image: null,
    profile_photo: null,
    signature: null,
  });

  const [filePreviews, setFilePreviews] = useState({
    pan_image: null,
    aadhar_front_image: null,
    aadhar_back_image: null,
    profile_photo: null,
    signature: null,
  });

  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  // Convert date format from DD-MM-YYYY to YYYY-MM-DD
  const convertDateFormat = (dateStr) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
  };

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  // Fetch Associate Profile from API
  const fetchAssociateProfile = async () => {
    setProfileLoading(true);
    try {
      const token = getAuthToken();
      console.log("Fetching associate profile...");
      console.log("Token:", token);

      const response = await fetch(`${API_URL}/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (data.status === "1" && data.data) {
        const profileData = data.data;
        
        const id = profileData.id;
        const username = profileData.username || "";
        const mobile = profileData.mobile || "";
        const email = profileData.email || "";
        const dob = convertDateFormat(profileData.dob || "");
        const address = profileData.address || "";
        const pan_number = profileData.pan_number || "";
        const aadhar_number = profileData.adhar_number || "";
        const pincode = profileData.pincode || "";
        
        // Get state and city IDs from API response
        const stateId = profileData.state?.id || "";
        const cityId = profileData.city?.id || "";
        
        console.log("Setting values:", { 
          id, username, mobile, email, dob, address, 
          stateId, cityId, pan_number, aadhar_number, pincode 
        });
        
        setAssociateId(id);
        setFormData(prev => ({
          ...prev,
          associate_id: id,
          full_name: username,
          mobile: mobile,
          email: email,
          date_of_birth: dob,
          address: address,
          pan_number: pan_number,
          aadhar_number: aadhar_number,
          pincode: pincode,
          state: stateId,
          city: cityId,
        }));

        // Set existing images
        setExistingImages({
          profile_photo: profileData.profile ? `${profileImage}${profileData.profile}` : null,
          pan_image: profileData.pan_card_image ? `${profileImage}${profileData.pan_card_image}` : null,
          aadhar_front_image: profileData.adhar_fornt_image ? `${profileImage}${profileData.adhar_fornt_image}` : null,
          aadhar_back_image: profileData.adhar_back_image ? `${profileImage}${profileData.adhar_back_image}` : null
        });
        
        // If state has value, fetch cities for that state
        if (stateId) {
          await fetchCitiesForState(stateId);
        }
        
        console.log("Form data updated successfully!");
      } else {
        console.log("API status not 1 or no data");
        const id = localStorage.getItem("userId") || localStorage.getItem("id");
        const username = localStorage.getItem("username") || "";
        const mobile = localStorage.getItem("mobile") || "";
        const email = localStorage.getItem("email") || "";
        
        console.log("Fallback values:", { id, username, mobile, email });
        
        setAssociateId(id);
        setFormData(prev => ({
          ...prev,
          associate_id: id,
          full_name: username,
          mobile: mobile,
          email: email,
        }));
      }
    } catch (error) {
      console.error("Error fetching associate profile:", error);
      const id = localStorage.getItem("userId") || localStorage.getItem("id");
      const username = localStorage.getItem("username") || "";
      const mobile = localStorage.getItem("mobile") || "";
      const email = localStorage.getItem("email") || "";
      
      setAssociateId(id);
      setFormData(prev => ({
        ...prev,
        associate_id: id,
        full_name: username,
        mobile: mobile,
        email: email,
      }));
    } finally {
      setProfileLoading(false);
    }
  };

  // Fetch States
  const fetchStates = async () => {
    const token = getAuthToken();
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/state-list`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) setStates(data.data || []);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  // Fetch Cities for a specific state
  const fetchCitiesForState = async (stateId) => {
    if (!stateId) {
      setCities([]);
      return;
    }
    const token = getAuthToken();
    try {
      const res = await fetch(`${API_URL}/city-list`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ state_id: stateId }),
      });
      const data = await res.json();
      if (res.ok) setCities(data.data || []);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  // Fetch Cities based on selected state
  const fetchCities = async () => {
    if (!formData.state) {
      setCities([]);
      return;
    }
    const token = getAuthToken();
    try {
      const res = await fetch(`${API_URL}/city-list`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ state_id: formData.state }),
      });
      const data = await res.json();
      if (res.ok) setCities(data.data || []);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  // Main useEffect - Fetch Profile on component mount
  useEffect(() => {
    console.log("Component mounted, fetching profile...");
    fetchAssociateProfile();
    fetchStates();
  }, []);

  // Fetch Cities when state changes
  useEffect(() => {
    fetchCities();
  }, [formData.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    const file = selectedFiles[0];

    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        Swal.fire("Error", `Please upload valid file (JPEG, PNG, or PDF) for ${name}`, "error");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        Swal.fire("Error", `File size should be less than 5MB for ${name}`, "error");
        return;
      }

      setFiles(prev => ({
        ...prev,
        [name]: file
      }));

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreviews(prev => ({
            ...prev,
            [name]: reader.result
          }));
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreviews(prev => ({
          ...prev,
          [name]: null
        }));
      }

      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validate = () => {
    let newErrors = {};

    if (!formData.full_name) newErrors.full_name = "Full name is required";
    if (!formData.mobile) newErrors.mobile = "Mobile number is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.date_of_birth) newErrors.date_of_birth = "Date of birth is required";
    if (!formData.gender) newErrors.gender = "Gender is required";

    if (!formData.pan_number) {
      newErrors.pan_number = "PAN number is required";
    } else {
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!panRegex.test(formData.pan_number.toUpperCase())) {
        newErrors.pan_number = "Invalid PAN number format. Example: ABCDE1234F";
      }
    }

    if (!formData.aadhar_number) {
      newErrors.aadhar_number = "Aadhar number is required";
    } else {
      const aadharRegex = /^[0-9]{12}$/;
      if (!aadharRegex.test(formData.aadhar_number)) {
        newErrors.aadhar_number = "Invalid Aadhar number. Should be 12 digits";
      }
    }

    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.pincode) {
      newErrors.pincode = "Pincode is required";
    } else {
      const pincodeRegex = /^[0-9]{6}$/;
      if (!pincodeRegex.test(formData.pincode)) {
        newErrors.pincode = "Invalid pincode. Should be 6 digits";
      }
    }

    if (formData.mobile) {
      const mobileRegex = /^[0-9]{10}$/;
      if (!mobileRegex.test(formData.mobile)) {
        newErrors.mobile = "Invalid mobile number. Should be 10 digits";
      }
    }

    if (!formData.nominee_name) newErrors.nominee_name = "Nominee name is required";
    if (!formData.nominee_relation) newErrors.nominee_relation = "Nominee relation is required";
    if (!formData.nominee_dob) newErrors.nominee_dob = "Nominee date of birth is required";

    if (!files.pan_image && !existingImages.pan_image) newErrors.pan_image = "PAN card image is required";
    if (!files.aadhar_front_image && !existingImages.aadhar_front_image) newErrors.aadhar_front_image = "Aadhar front image is required";
    if (!files.aadhar_back_image && !existingImages.aadhar_back_image) newErrors.aadhar_back_image = "Aadhar back image is required";
    // if (!files.profile_photo && !existingImages.profile_photo) newErrors.profile_photo = "Profile photo is required";

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    console.log("Validation Result:", isValid, "Errors:", newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("========== FORM SUBMITTED ==========");
    
    // Log current form data
    console.log("Current Form Data:", formData);
    console.log("Current Files:", files);
    console.log("Existing Images:", existingImages);

    // Check validation
    const isValid = validate();
    console.log("Validation Result:", isValid);
    
    if (!isValid) {
      console.log("Validation failed! Errors:", errors);
      Swal.fire("Validation Error", "Please fill all required fields correctly", "warning");
      return;
    }

    setLoading(true);

    try {
      const token = getAuthToken();
      console.log("Auth Token:", token ? "Present" : "Missing");
      
      if (!token) {
        throw new Error("Authentication token not found. Please login again.");
      }

      const formDataToSend = new FormData();

      // Add all form data
      Object.keys(formData).forEach(key => {
        if (formData[key] && formData[key] !== "") {
          formDataToSend.append(key, formData[key]);
          console.log(`Appended: ${key} = ${formData[key]}`);
        }
      });

      // Add files if they exist
      if (files.pan_image) {
        formDataToSend.append("pan_image", files.pan_image);
        console.log("Appended pan_image");
      }
      if (files.aadhar_front_image) {
        formDataToSend.append("aadhar_front_image", files.aadhar_front_image);
        console.log("Appended aadhar_front_image");
      }
      if (files.aadhar_back_image) {
        formDataToSend.append("aadhar_back_image", files.aadhar_back_image);
        console.log("Appended aadhar_back_image");
      }
      if (files.profile_photo) {
        formDataToSend.append("profile_photo", files.profile_photo);
        console.log("Appended profile_photo");
      }
      if (files.signature) {
        formDataToSend.append("signature", files.signature);
        console.log("Appended signature");
      }

      const apiUrl = `${API_URL}/associate-bima-registration-form`;
      console.log("Sending request to:", apiUrl);
      
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formDataToSend
      });

      console.log("Response status:", response.status);
      console.log("Response OK?", response.ok);
      
      const result = await response.json();
      console.log("Response Data:", result);

      if (response.ok && (result.status === "1" || result.success === true)) {
        Swal.fire({
          title: "Success!",
          text: result.message || "Bima registration submitted successfully!",
          icon: "success",
          confirmButtonText: "OK"
        }).then(() => {
          navigate("/dashboard");
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: result.message || result.error || "Something went wrong. Please try again.",
          icon: "error",
          confirmButtonText: "OK"
        });
      }
    } catch (err) {
      console.error("Submission Error:", err);
      Swal.fire({
        title: "Error!",
        text: err.message || "Network error. Please check your connection and try again.",
        icon: "error",
        confirmButtonText: "OK"
      });
    } finally {
      setLoading(false);
    }
  };

  // Show loading indicator
  if (profileLoading) {
    return (
      <div className="padding_15">
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading profile data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3">
      <div className="row">
        <div className="col-md-12 col-12 col-sm-12">
          <div className="card">
            <div className="card-header">
              <div className="d-flex align-items-center justify-content-between">
                <div className="titlepage">
                  <h3>
                    <TbReceiptRupee size={30} className="me-2" />
                    Bima (Insurance) Registration Form
                  </h3>
                </div>
                <Button variant="primary" onClick={() => navigate(-1)}>
                  <FaArrowLeft className="me-1" /> Back
                </Button>
              </div>
            </div>
            <div className="card-body">
              <Form onSubmit={handleSubmit}>
                <h5 className="mb-3 text-dark fw-bold">Personal Details</h5>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        name="full_name"
                        value={formData.full_name || ""}
                        onChange={handleChange}
                        isInvalid={!!errors.full_name}
                        disabled
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.full_name}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Mobile Number <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="tel"
                        name="mobile"
                        value={formData.mobile || ""}
                        onChange={handleChange}
                        isInvalid={!!errors.mobile}
                        disabled
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.mobile}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        isInvalid={!!errors.email}
                        disabled
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}  
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Date of Birth <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="date"
                        name="date_of_birth"
                        value={formData.date_of_birth || ""}
                        onChange={handleChange}
                        isInvalid={!!errors.date_of_birth}
                        
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.date_of_birth}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Gender <span className="text-danger">*</span></Form.Label>
                      <Form.Select
                        name="gender"
                        value={formData.gender || ""}
                        onChange={handleChange}
                        isInvalid={!!errors.gender}
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.gender}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <h5 className="mb-3 mt-4 text-dark fw-bold">KYC Details</h5>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>PAN Number <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        name="pan_number"
                        placeholder="ABCDE1234F"
                        value={formData.pan_number || ""}
                        onChange={handleChange}
                        isInvalid={!!errors.pan_number}
                        style={{ textTransform: "uppercase" }}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.pan_number}
                      </Form.Control.Feedback>
                      <Form.Text className="text-muted">Format: 5 letters, 4 digits, 1 letter</Form.Text>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Aadhar Number <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        name="aadhar_number"
                        placeholder="123456789012"
                        value={formData.aadhar_number || ""}
                        onChange={handleChange}
                        isInvalid={!!errors.aadhar_number}
                        maxLength="12"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.aadhar_number}
                      </Form.Control.Feedback>
                      <Form.Text className="text-muted">12-digit Aadhar number</Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                <h5 className="mb-3 mt-4 text-dark fw-bold">Address Details</h5>
                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Address <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        name="address"
                        placeholder="Enter Full Address"
                        value={formData.address || ""}
                        onChange={handleChange}
                        isInvalid={!!errors.address}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.address}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>State <span className="text-danger">*</span></Form.Label>
                      <Form.Select
                        name="state"
                        value={formData.state || ""}
                        onChange={handleChange}
                        isInvalid={!!errors.state}
                      >
                        <option value="">Select State</option>
                        {states.map((state) => (
                          <option key={state.id} value={state.id}>
                            {state.name}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.state}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>City <span className="text-danger">*</span></Form.Label>
                      <Form.Select
                        name="city"
                        value={formData.city || ""}
                        onChange={handleChange}
                        isInvalid={!!errors.city}
                        disabled={!formData.state}
                      >
                        <option value="">Select City</option>
                        {cities.map((city) => (
                          <option key={city.id} value={city.id}>
                            {city.name}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.city}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Pincode <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        name="pincode"
                        placeholder="123456"
                        value={formData.pincode || ""}
                        onChange={handleChange}
                        isInvalid={!!errors.pincode}
                        maxLength="6"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.pincode}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <h5 className="mb-3 mt-4 text-dark fw-bold">Nominee Details</h5>
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nominee Name <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        name="nominee_name"
                        placeholder="Enter Nominee Name"
                        value={formData.nominee_name || ""}
                        onChange={handleChange}
                        isInvalid={!!errors.nominee_name}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.nominee_name}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nominee Relation <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        name="nominee_relation"
                        placeholder="e.g., Spouse, Father, Mother"
                        value={formData.nominee_relation || ""}
                        onChange={handleChange}
                        isInvalid={!!errors.nominee_relation}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.nominee_relation}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nominee DOB <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="date"
                        name="nominee_dob"
                        value={formData.nominee_dob || ""}
                        onChange={handleChange}
                        isInvalid={!!errors.nominee_dob}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.nominee_dob}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                {/* <h5 className="mb-3 mt-4 text-dark fw-bold">Insurance Details</h5>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Insurance Amount (Coverage) <span className="text-danger">*</span></Form.Label>
                      <Form.Select
                        name="insurance_amount"
                        value={formData.insurance_amount || "500000"}
                        onChange={handleChange}
                      >
                        <option value="500000">₹5,00,000</option>
                        <option value="1000000">₹10,00,000</option>
                        <option value="1500000">₹15,00,000</option>
                        <option value="2000000">₹20,00,000</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row> */}

                <h5 className="mb-3 mt-4 text-dark fw-bold">Document Uploads</h5>
                <Row>
                  {/* PAN Card Image */}
                  <Col md={6} lg={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>PAN Card Image <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="file"
                        name="pan_image"
                        onChange={handleFileChange}
                        accept="image/jpeg,image/jpg,image/png,application/pdf"
                        isInvalid={!!errors.pan_image}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.pan_image}
                      </Form.Control.Feedback>
                      <Form.Text className="text-muted">JPEG, PNG, or PDF (Max 5MB)</Form.Text>
                      
                      {/* Show existing PAN image */}
                      {existingImages.pan_image && !filePreviews.pan_image && (
                        <div className="mt-2">
                          <img 
                            src={existingImages.pan_image} 
                            alt="Existing PAN" 
                            style={{ width: "100px", height: "100px", objectFit: "contain", border: "2px solid #4CAF50", borderRadius: "5px", cursor: "pointer" }}
                            onClick={() => openImageModal(existingImages.pan_image)}
                          />
                          <p className="text-success small mt-1">Current PAN Card</p>
                        </div>
                      )}
                      
                      {/* Show new preview */}
                      {filePreviews.pan_image && (
                        <div className="mt-2">
                          <img 
                            src={filePreviews.pan_image} 
                            alt="PAN Preview" 
                            style={{ width: "100px", height: "100px", objectFit: "contain", border: "2px solid #ff9800", borderRadius: "5px", cursor: "pointer" }}
                            onClick={() => openImageModal(filePreviews.pan_image)}
                          />
                          <p className="text-warning small mt-1">New PAN Card</p>
                        </div>
                      )}
                    </Form.Group>
                  </Col>

                  {/* Aadhar Front Image */}
                  <Col md={6} lg={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Aadhar Front Image <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="file"
                        name="aadhar_front_image"
                        onChange={handleFileChange}
                        accept="image/jpeg,image/jpg,image/png,application/pdf"
                        isInvalid={!!errors.aadhar_front_image}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.aadhar_front_image}
                      </Form.Control.Feedback>
                      <Form.Text className="text-muted">JPEG, PNG, or PDF (Max 5MB)</Form.Text>
                      
                      {/* Show existing Aadhar Front image */}
                      {existingImages.aadhar_front_image && !filePreviews.aadhar_front_image && (
                        <div className="mt-2">
                          <img
                            src={existingImages.aadhar_front_image}
                            alt="Existing Aadhar Front"
                            style={{ width: "120px", height: "120px", objectFit: "contain", border: "2px solid #4CAF50", borderRadius: "5px", cursor: "pointer" }}
                            onClick={() => openImageModal(existingImages.aadhar_front_image)}
                          />
                          <p className="text-success small mt-1">Current Aadhar Front</p>
                        </div>
                      )}
                      
                      {/* Show new preview */}
                      {filePreviews.aadhar_front_image && (
                        <div className="mt-2">
                          <img
                            src={filePreviews.aadhar_front_image}
                            alt="Aadhar Front Preview"
                            style={{ width: "120px", height: "120px", objectFit: "contain", border: "2px solid #ff9800", borderRadius: "5px", cursor: "pointer" }}
                            onClick={() => openImageModal(filePreviews.aadhar_front_image)}
                          />
                          <p className="text-warning small mt-1">New Aadhar Front</p>
                        </div>
                      )}
                    </Form.Group>
                  </Col>

                  {/* Aadhar Back Image */}
                  <Col md={6} lg={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Aadhar Back Image <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="file"
                        name="aadhar_back_image"
                        onChange={handleFileChange}
                        accept="image/jpeg,image/jpg,image/png,application/pdf"
                        isInvalid={!!errors.aadhar_back_image}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.aadhar_back_image}
                      </Form.Control.Feedback>
                      <Form.Text className="text-muted">JPEG, PNG, or PDF (Max 5MB)</Form.Text>
                      
                      {/* Show existing Aadhar Back image */}
                      {existingImages.aadhar_back_image && !filePreviews.aadhar_back_image && (
                        <div className="mt-2">
                          <img
                            src={existingImages.aadhar_back_image}
                            alt="Existing Aadhar Back"
                            style={{ width: "120px", height: "120px", objectFit: "contain", border: "2px solid #4CAF50", borderRadius: "5px", cursor: "pointer" }}
                            onClick={() => openImageModal(existingImages.aadhar_back_image)}
                          />
                          <p className="text-success small mt-1">Current Aadhar Back</p>
                        </div>
                      )}
                      
                      {/* Show new preview */}
                      {filePreviews.aadhar_back_image && (
                        <div className="mt-2">
                          <img
                            src={filePreviews.aadhar_back_image}
                            alt="Aadhar Back Preview"
                            style={{ width: "120px", height: "120px", objectFit: "contain", border: "2px solid #ff9800", borderRadius: "5px", cursor: "pointer" }}
                            onClick={() => openImageModal(filePreviews.aadhar_back_image)}
                          />
                          <p className="text-warning small mt-1">New Aadhar Back</p>
                        </div>
                      )}
                    </Form.Group>
                  </Col>

                  {/* Profile Photo */}
                  {/* <Col md={6} lg={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Profile Photo <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="file"
                        name="profile_photo"
                        onChange={handleFileChange}
                        accept="image/jpeg,image/jpg,image/png"
                        isInvalid={!!errors.profile_photo}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.profile_photo}
                      </Form.Control.Feedback>
                      <Form.Text className="text-muted">JPEG or PNG (Max 5MB)</Form.Text>
                      {existingImages.profile_photo && !filePreviews.profile_photo && (
                        <div className="mt-2">
                          <img
                            src={existingImages.profile_photo}
                            alt="Existing Profile"
                            className="rounded-circle"
                            style={{
                              width: "120px",
                              height: "120px",
                              objectFit: "cover",
                              cursor: "pointer",
                              border: "3px solid #4CAF50"
                            }}
                            onClick={() => openImageModal(existingImages.profile_photo)}
                          />
                          <p className="text-success mt-1 small">Current Profile Photo</p>
                        </div>
                      )}
                      {filePreviews.profile_photo && (
                        <div className="mt-2">
                          <img
                            src={filePreviews.profile_photo}
                            alt="Profile Preview"
                            className="rounded-circle"
                            style={{
                              width: "120px",
                              height: "120px",
                              objectFit: "cover",
                              cursor: "pointer",
                              border: "3px solid #ff9800"
                            }}
                            onClick={() => openImageModal(filePreviews.profile_photo)}
                          />
                          <p className="text-warning mt-1 small">New Photo (will replace existing)</p>
                        </div>
                      )}
                    </Form.Group>
                  </Col> */}
                </Row>

                <div className="d-flex gap-2 justify-content-center">
                  <Button type="submit" variant="primary" size="lg" disabled={loading}>
                    {loading ? <Spinner as="span" animation="border" size="sm" /> : <FaUpload className="me-2" />}
                    {loading ? " Submitting..." : " Submit Registration"}
                  </Button>
                  <Button type="button" variant="primary" size="lg" className="ms-3" onClick={() => navigate(-1)}>
                    Cancel
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <Modal show={showImageModal} onHide={() => setShowImageModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Image Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <img 
            src={selectedImage} 
            alt="Preview" 
            style={{ 
              maxWidth: "100%", 
              maxHeight: "70vh", 
              objectFit: "contain" 
            }} 
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowImageModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default BimaRegistrationForm;