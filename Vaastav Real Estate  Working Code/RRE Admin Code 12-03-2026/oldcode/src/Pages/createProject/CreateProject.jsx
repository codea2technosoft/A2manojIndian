import React, { useState, useEffect, useRef } from "react";
import { Form, Button, Container, Row, Col, Card, Modal, Dropdown } from "react-bootstrap";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

function CreateProject() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [projectSize, setProjectSize] = useState("");
  const [status, setStatus] = useState("active");
  const [projectStatus, setProjectStatus] = useState("ongoing");
  const [images, setImages] = useState([]);
  const [image1, setImage1] = useState(null);
  const [imageprojectmap, setimageprojectmap] = useState(null);
  const [reraRegistrationNo, setReraRegistrationNo] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [legality, setLegality] = useState("");

  const [businessVolume, setBusinessVolume] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [landmark, setLandmark] = useState("");
  const [propertyChainPapers, setPropertyChainPapers] = useState([]);

  const [availableAmenities, setAvailableAmenities] = useState([]);
  const [statesList, setStatesList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [selectedStateId, setSelectedStateId] = useState("");

  const [keyTransports, setKeyTransports] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [newTransportName, setNewTransportName] = useState("");
  const [newTransportDistance, setNewTransportDistance] = useState("");

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");

  const imageInputRef = useRef(null);
  const imageInputRef1 = useRef(null);
  const imageInputRef2 = useRef(null);
  const propertyChainPaperRef = useRef(null);

  const showCustomModal = (message, type) => {
    setModalMessage(message);
    setModalType(type);
    setShowModal(true);
  };

  const closeCustomModal = () => {
    setShowModal(false);
    setModalMessage("");
    setModalType("success");
  };

  const getAuthToken = () => {
    return localStorage.getItem("token");
  };


  useEffect(() => {
    const fetchAmenities = async () => {
      const token = getAuthToken();
      if (!token) {
        showCustomModal("Authentication token not found. Please log in.", "error");
        return;
      }
      try {
        const amenitiesResponse = await fetch(`${API_URL}/amenities-list`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const amenitiesData = await amenitiesResponse.json();

        if (amenitiesResponse.ok && amenitiesData.status === "1") {
          setAvailableAmenities(amenitiesData.data);
        } else {
          console.error("Failed to fetch amenities:", amenitiesData.message);
        }
      } catch (error) {
        console.error("Error fetching amenities:", error);
      }
    };
    fetchAmenities();
  }, []);


  useEffect(() => {
    const fetchStates = async () => {
      const token = getAuthToken();
      if (!token) {
        showCustomModal("Authentication token not found. Please log in.", "error");
        return;
      }
      try {
        const statesResponse = await fetch(`${API_URL}/state-list`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const statesData = await statesResponse.json();

        console.warn("statesData", statesData);

        if (statesData.status == "1") {
          setStatesList(statesData.data);
        } else {
          console.error("Failed to fetch states:", statesData.message);

        }
      } catch (error) {
        console.error("Error fetching states:", error);

      }
    };
    fetchStates();
  }, []);


  useEffect(() => {
    const fetchCities = async () => {
      if (selectedStateId) {
        const token = getAuthToken();
        if (!token) {
          showCustomModal("Authentication token not found. Please log in.", "error");
          return;
        }

        try {
          const citiesResponse = await fetch(`${API_URL}/city-list`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ state_id: selectedStateId }),
          });
          const citiesData = await citiesResponse.json();
          if (citiesResponse.ok && citiesData.status === "1") {
            setCitiesList(citiesData.data);
          } else {
            setCitiesList([]);
            console.error("Failed to fetch cities:", citiesData.message);

          }
        } catch (error) {
          setCitiesList([]);
          console.error("Error fetching cities:", error);

        }
      } else {
        setCitiesList([]);
      }
    };

    fetchCities();
  }, [selectedStateId]);



  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Project name is required.";
    if (!projectSize || isNaN(projectSize) || parseFloat(projectSize) <= 0) {
      newErrors.projectSize = "Project size must be a positive number.";
    }
    // if (images.length === 0) newErrors.images = "At least one multi-image is required.";
    // if (!image1) newErrors.image1 = "A single project thumbnail image is required.";
    // if (!imageprojectmap) newErrors.imageprojectmap = "A project map PDF file is required.";
    if (!reraRegistrationNo.trim()) newErrors.reraRegistrationNo = "RERA Registration No. is required.";
    if (!location.trim()) newErrors.location = "Location is required.";
    if (!description.trim()) newErrors.description = "Description is required.";
    if (!legality.trim()) newErrors.legality = "Approved Authority details are required.";
    if (!projectStatus.trim()) newErrors.projectStatus = "Project Status is required.";
    if (!businessVolume.trim()) newErrors.businessVolume = "Business Volume is required.";
    if (!city) newErrors.city = "City is required.";
    if (!state) newErrors.state = "State is required.";
    if (!landmark.trim()) newErrors.landmark = "Landmark is required.";
    if (amenities.length === 0) newErrors.amenities = "At least one amenity must be selected.";
    // if (propertyChainPapers.length === 0) newErrors.propertyChainPapers = "At least one property chain paper (PDF) is required.";
    if (keyTransports.length === 0) newErrors.keyTransports = "At least one Key Transport entry is required.";
    if (youtubeLink.length === 0) newErrors.youtubeLink = " Youtube Link is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 20) {
      showCustomModal("You can only upload a maximum of 20 project images.", "error");
      if (imageInputRef.current) imageInputRef.current.value = "";
      return;
    }

    setErrors(prevErrors => ({ ...prevErrors, images: "" }));
    setImages([...images, ...files]);
    e.target.value = null;
  };

  const removeImage = (indexToRemove) => {
    setImages(prevImages => prevImages.filter((_, index) => index !== indexToRemove));
    if (images.length === 1 && indexToRemove === 0) {
      if (imageInputRef.current) imageInputRef.current.value = "";
    }
  };

  const handleImageChange1 = (e) => {
    const file = e.target.files[0];
    if (file && !file.type.startsWith('image/')) {
      showCustomModal("Please upload an image file for the thumbnail.", "error");
      if (imageInputRef1.current) imageInputRef1.current.value = "";
      return;
    }
    setImage1(file);
    if (errors.image1) {
      setErrors(prev => ({ ...prev, image1: null }));
    }
  };

  const removeImage1 = () => {
    setImage1(null);
    if (imageInputRef1.current) {
      imageInputRef1.current.value = "";
    }
  };

  const handleImageChange2 = (e) => {
    const file = e.target.files[0];
    if (file && file.type !== 'application/pdf') {
      showCustomModal("Please upload a PDF file for the project map.", "error");
      if (imageInputRef2.current) imageInputRef2.current.value = "";
      return;
    }
    setimageprojectmap(file);
    if (errors.imageprojectmap) {
      setErrors(prev => ({ ...prev, imageprojectmap: null }));
    }
  };

  const removeImage2 = () => {
    setimageprojectmap(null);
    if (imageInputRef2.current) {
      imageInputRef2.current.value = "";
    }
  };

  const handlePropertyChainPaperChange = (e) => {
    const files = Array.from(e.target.files);
    const newPdfs = files.filter(file => file.type === 'application/pdf');

    if (newPdfs.length !== files.length) {
      showCustomModal("Only PDF files are allowed for Property Chain Papers.", "error");
      if (propertyChainPaperRef.current) propertyChainPaperRef.current.value = "";
      return;
    }

    setPropertyChainPapers([...propertyChainPapers, ...newPdfs]);
    setErrors(prevErrors => ({ ...prevErrors, propertyChainPapers: "" }));
    e.target.value = null;
  };

  const removePropertyChainPaper = (indexToRemove) => {
    setPropertyChainPapers(prevPdfs => prevPdfs.filter((_, index) => index !== indexToRemove));
    if (propertyChainPapers.length === 1 && indexToRemove === 0) {
      if (propertyChainPaperRef.current) propertyChainPaperRef.current.value = "";
    }
  };

  const handleAmenityToggle = (amenityId) => {
    const updatedAmenities = amenities.includes(amenityId)
      ? amenities.filter(id => id !== amenityId)
      : [...amenities, amenityId];
    setAmenities(updatedAmenities);
    if (errors.amenities) setErrors(prev => ({ ...prev, amenities: null }));
  };


  const addKeyTransport = () => {
    if (newTransportName.trim() && newTransportDistance.trim()) {
      setKeyTransports(prev => [
        ...prev,
        { name: newTransportName.trim(), distance: newTransportDistance.trim() }
      ]);
      setNewTransportName("");
      setNewTransportDistance("");
      if (errors.keyTransports) setErrors(prev => ({ ...prev, keyTransports: null }));
    } else {
      showCustomModal("Please enter both a name and a distance for Key Transport.", "error");
    }
  };

  const removeKeyTransport = (indexToRemove) => {
    setKeyTransports(prev => prev.filter((_, index) => index !== indexToRemove));
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("project_rera_no", reraRegistrationNo);
    formData.append("location", location);
    formData.append("bussiness_volume", businessVolume);
    formData.append("description", description);
    formData.append("youtube_links", youtubeLink);
    formData.append("approve_authority", legality);
    formData.append("state", state);
    formData.append("city", city);
    formData.append("land_mark", landmark);

    // amenities.forEach(amenityId => {
    //   formData.append("aminities", JSON.stringify(amenityId));
    // });

    const amenitiesArrayOfObjects = amenities.map(id => ({ id: String(id) }));
    formData.append("aminities", JSON.stringify(amenitiesArrayOfObjects));

    formData.append("total_township_area", projectSize);
    formData.append("key_transport", JSON.stringify(keyTransports));
    formData.append("status", status);

    if (image1) {
      formData.append("thumbnail", image1);
    }

    if (imageprojectmap) {
      formData.append("map_pdf", imageprojectmap);
    }

    formData.append("project_status", projectStatus);

    propertyChainPapers.forEach((file) => {
      formData.append("property_chain_papers[]", file);
    });

    images.forEach((imageFile) => {
      formData.append("image[]", imageFile);
    });


    const authToken = localStorage.getItem("token");

    if (!authToken) {
      showCustomModal("Authentication token not found. Please log in.", "error");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/project-create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      });


      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error response:", errorText);
        throw new Error(`Server responded with status ${response.status}`);
      }

      const result = await response.json();
      if (result.success == "1" || result.status == "1") {
        showCustomModal(result.message || "Project has been created successfully!", "success");
        setName("");
        setProjectSize("");
        setStatus("active");
        setProjectStatus("ongoing");
        setImages([]);
        setImage1(null);
        setimageprojectmap(null);
        setReraRegistrationNo("");
        setLocation("");
        setDescription("");
        setLegality("");
        setYoutubeLink("");
        setBusinessVolume("");
        setCity("");
        setState("");
        setLandmark("");
        setAmenities([]);
        setPropertyChainPapers([]);
        setSelectedStateId("");
        setKeyTransports([]);
        setNewTransportName("");
        setNewTransportDistance("");

        if (imageInputRef.current) imageInputRef.current.value = "";
        if (imageInputRef1.current) imageInputRef1.current.value = "";
        if (imageInputRef2.current) imageInputRef2.current.value = "";
        if (propertyChainPaperRef.current) propertyChainPaperRef.current.value = "";

        setTimeout(() => {
          navigate("/all-project");
        }, 3000);
      } else {
        const errorMessage = result.message || "Failed to create project.";
        showCustomModal(`Error: ${errorMessage}`, "error");
      }
    } catch (error) {
      console.error("Error creating project:", error);
      showCustomModal(`An unexpected error occurred: ${error.message || ""}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="justify-content-center formselectnewdesign">
        <div className="card mt-2">
          <div className="card-header">
            <div className="d-flex align-items-center justify-content-between">
              <div className="titlepage">
                <h3>Create New Project</h3>
              </div>
            </div>
          </div>
          <div className="card-body" >
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Project Name <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors(prev => ({ ...prev, name: null }));
                      }}
                      placeholder="e.g., Grand Residency"
                      isInvalid={!!errors.name}
                    />
                    <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3" controlId="project_size">
                    <Form.Label>Total Townships (Sq. Yard) <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="number"
                      value={projectSize}
                      onChange={(e) => {
                        setProjectSize(e.target.value);
                        if (errors.projectSize) setErrors(prev => ({ ...prev, projectSize: null }));
                      }}
                      placeholder="e.g., 10000"
                      step="1"
                      min="0"
                      isInvalid={!!errors.projectSize}
                    />
                    <Form.Control.Feedback type="invalid">{errors.projectSize}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="rera_registration_no">
                    <Form.Label>Project RERA Number <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      value={reraRegistrationNo}
                      onChange={(e) => {
                        setReraRegistrationNo(e.target.value);
                        if (errors.reraRegistrationNo) setErrors(prev => ({ ...prev, reraRegistrationNo: null }));
                      }}
                      placeholder="Enter RERA registration number"
                      isInvalid={!!errors.reraRegistrationNo}
                    />
                    <Form.Control.Feedback type="invalid">{errors.reraRegistrationNo}</Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3" controlId="location">
                    <Form.Label>Location <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      value={location}
                      onChange={(e) => {
                        setLocation(e.target.value);
                        if (errors.location) setErrors(prev => ({ ...prev, location: null }));
                      }}
                      placeholder="Enter project location"
                      isInvalid={!!errors.location}
                    />
                    <Form.Control.Feedback type="invalid">{errors.location}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="businessVolume">
                    <Form.Label>Business Volume(%) <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="number"
                      value={businessVolume}
                      onChange={(e) => {
                        setBusinessVolume(e.target.value);
                        if (errors.businessVolume) setErrors(prev => ({ ...prev, businessVolume: null }));
                      }}
                      placeholder="Enter business volume"
                      isInvalid={!!errors.businessVolume}
                    />
                    <Form.Control.Feedback type="invalid">{errors.businessVolume}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="state">
                    <Form.Label>State <span className="text-danger">*</span></Form.Label>
                    <Form.Select
                      value={state}
                      onChange={(e) => {
                        setState(e.target.value);
                        setSelectedStateId(e.target.value);
                        setCity("");
                        if (errors.state) setErrors(prev => ({ ...prev, state: null }));
                        if (errors.city) setErrors(prev => ({ ...prev, city: null }));
                      }}
                      isInvalid={!!errors.state}
                    >
                      <option value="">Select State</option>
                      {statesList.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{errors.state}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="city">
                    <Form.Label>City <span className="text-danger">*</span></Form.Label>
                    <Form.Select
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value);
                        if (errors.city) setErrors(prev => ({ ...prev, city: null }));
                      }}
                      isInvalid={!!errors.city}
                      disabled={!selectedStateId || citiesList.length === 0}
                    >
                      <option value="">Select City</option>
                      {citiesList.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{errors.city}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="landmark">
                    <Form.Label>Landmark <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      value={landmark}
                      onChange={(e) => {
                        setLandmark(e.target.value);
                        if (errors.landmark) setErrors(prev => ({ ...prev, landmark: null }));
                      }}
                      placeholder="Enter nearest landmark"
                      isInvalid={!!errors.landmark}
                    />
                    <Form.Control.Feedback type="invalid">{errors.landmark}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="amenities">
                    <Form.Label>Amenities <span className="text-danger">*</span></Form.Label>
                    <Dropdown className={errors?.amenities ? 'is-invalid' : ''}>
                      <Dropdown.Toggle variant="outline-primary" id="dropdown-amenities" className="w-100 text-start">
                        {amenities.length > 0
                          ? `${amenities.length} selected`
                          : 'Select Amenities'}
                      </Dropdown.Toggle>

                      <Dropdown.Menu style={{ maxHeight: '200px', overflowY: 'auto', width: '100%' }}>
                        {availableAmenities.map((amenity) => (
                          <Form.Check
                            key={amenity.id}
                            type="checkbox"
                            id={`amenity-${amenity.id}`}
                            label={amenity.name}
                            checked={amenities.includes(amenity.id)}
                            onChange={() => handleAmenityToggle(amenity.id)}
                            className="mx-3"
                          />
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                    {errors.amenities && (
                      <div className="invalid-feedback d-block">{errors.amenities}</div>
                    )}
                    <Form.Text className="text-muted">Click to select amenities.</Form.Text>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="propertyChainPapers">
                    <Form.Label>Property Chain Papers (PDF)</Form.Label>
                    <Form.Control
                      type="file"
                      accept="application/pdf"
                      multiple
                      onChange={handlePropertyChainPaperChange}
                      isInvalid={!!errors.propertyChainPapers}
                      ref={propertyChainPaperRef}
                    />
                    <Form.Control.Feedback type="invalid">{errors.propertyChainPapers}</Form.Control.Feedback>
                    {propertyChainPapers.length > 0 && (
                      <div className="mt-2 d-flex flex-wrap gap-2">
                        {propertyChainPapers.map((file, index) => (
                          <div key={index} className="position-relative d-flex align-items-center border p-2 rounded">
                            <i className="bi bi-file-earmark-pdf-fill me-2 fs-4 text-danger"></i>
                            <span className="text-truncate" style={{ maxWidth: '120px' }}>{file.name}</span>
                            <Button
                              variant="danger"
                              size="sm"
                              className="position-absolute top-0 end-0 translate-middle badge rounded-pill bg-danger"
                              onClick={() => removePropertyChainPaper(index)}
                              style={{ cursor: "pointer" }}
                            >
                              X
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    {propertyChainPapers.length > 0 && (
                      <div className="mt-2 text-muted">
                        {propertyChainPapers.length} PDF(s) selected
                      </div>
                    )}
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3" controlId="keyTransports">
                <Form.Label>Key Transport <span className="text-danger">*</span></Form.Label>
                <Row className="mb-2">
                  <Col md={5}>
                    <Form.Control
                      type="text"
                      placeholder="e.g., Malls"
                      value={newTransportName}
                      onChange={(e) => setNewTransportName(e.target.value)}
                      isInvalid={!!errors.keyTransports && keyTransports.length === 0}
                    />
                  </Col>
                  <Col md={5}>
                    <Form.Control
                      type="text"
                      placeholder="e.g., 2KM, 190m"
                      value={newTransportDistance}
                      onChange={(e) => setNewTransportDistance(e.target.value)}
                      isInvalid={!!errors.keyTransports && keyTransports.length === 0}
                    />
                  </Col>
                  <Col md={2} className="d-grid">
                    <Button variant="primary" onClick={addKeyTransport}>
                      Add
                    </Button>
                  </Col>
                </Row>
                <Form.Control.Feedback type="invalid">{errors.keyTransports}</Form.Control.Feedback>

                {keyTransports.length > 0 && (
                  <div className="mt-2 border rounded p-3 bg-light">
                    <h5>Added Locations:</h5>
                    <ul className="list-unstyled mb-0">
                      {keyTransports.map((item, index) => (
                        <li key={index} className="d-flex justify-content-between align-items-center mb-1">
                          <span>
                            <strong>{item.name}:</strong> {item.distance}
                          </span>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => removeKeyTransport(index)}
                          >
                            Remove
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="status">
                    <Form.Label>Status <span className="text-danger">*</span></Form.Label>
                    <Form.Select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="active">Show</option>
                      <option value="inactive">Hide</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3" controlId="project_status">
                    <Form.Label>Project Status <span className="text-danger">*</span></Form.Label>
                    <Form.Select
                      value={projectStatus}
                      onChange={(e) => {
                        setProjectStatus(e.target.value);
                        if (errors.projectStatus) setErrors(prev => ({ ...prev, projectStatus: null }));
                      }}
                      isInvalid={!!errors.projectStatus}
                    >
                      <option value="ongoing">Ongoing Project</option>
                      <option value="complete">Complete Project</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{errors.projectStatus}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3" controlId="description">
                <Form.Label>Description <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (errors.description) setErrors(prev => ({ ...prev, description: null }));
                  }}
                  placeholder="Enter Decription"
                  isInvalid={!!errors.description}
                />
              
                {errors.description && <div className="text-danger mt-1" style={{ fontSize: '0.875em' }}>{errors.description}</div>}
              </Form.Group>

              <Form.Group className="mb-3" controlId="legality">
                <Form.Label>Approved Authority <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={legality}
                  onChange={(e) => {
                    setLegality(e.target.value);
                    if (errors.legality) setErrors(prev => ({ ...prev, legality: null }));
                  }}
                  placeholder="Enter legality details"
                  isInvalid={!!errors.legality}
                />
                <Form.Control.Feedback type="invalid">{errors.legality}</Form.Control.Feedback>
              </Form.Group>


              <Form.Group className="mb-3" controlId="images-upload-multiple">
                <Form.Label>Project Images (Multiple) </Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  isInvalid={!!errors.images}
                  ref={imageInputRef}
                />
                <Form.Control.Feedback type="invalid">{errors.images}</Form.Control.Feedback>
                {images.length > 0 && (
                  <div className="mt-2 d-flex flex-wrap gap-2">
                    {images.map((file, index) => (
                      <div key={index} className="position-relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index}`}
                          className="img-thumbnail"
                          style={{ width: "100px", height: "100px", objectFit: "cover" }}
                        />
                        <Button
                          variant="danger"
                          size="sm"
                          className="position-absolute top-0 end-0 translate-middle badge rounded-pill bg-danger"
                          onClick={() => removeImage(index)}
                          style={{ cursor: "pointer" }}
                        >
                          X
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                {images.length > 0 && (
                  <div className="mt-2 text-muted">
                    {images.length}/3 images selected
                  </div>
                )}
              </Form.Group>

              <Form.Group className="mb-3" controlId="image-upload-single">
                <Form.Label>Thumbnail Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange1}
                  isInvalid={!!errors.image1}
                  ref={imageInputRef1}
                />
                <Form.Control.Feedback type="invalid">{errors.image1}</Form.Control.Feedback>
                {image1 && (
                  <div className="mt-2 position-relative d-inline-block">
                    <img
                      src={URL.createObjectURL(image1)}
                      alt="Single Image Preview"
                      className="img-thumbnail"
                      style={{ width: "100px", height: "100px", objectFit: "cover" }}
                    />
                    <Button
                      variant="danger"
                      size="sm"
                      className="position-absolute top-0 end-0 translate-middle badge rounded-pill bg-danger"
                      onClick={removeImage1}
                      style={{ cursor: "pointer" }}
                    >
                      X
                    </Button>
                  </div>
                )}
              </Form.Group>

              <Form.Group className="mb-3" controlId="map-upload-pdf">
                <Form.Label>Project Map (PDF) </Form.Label>
                <Form.Control
                  type="file"
                  accept="application/pdf"
                  onChange={handleImageChange2}
                  isInvalid={!!errors.imageprojectmap}
                  ref={imageInputRef2}
                />
                <Form.Control.Feedback type="invalid">{errors.imageprojectmap}</Form.Control.Feedback>
                {imageprojectmap && (
                  <div className="mt-2 position-relative d-inline-block p-2 border rounded">
                    <i className="bi bi-file-earmark-pdf-fill me-2 fs-4 text-danger"></i>
                    <span className="text-truncate" style={{ maxWidth: '150px', display: 'inline-block', verticalAlign: 'middle' }}>{imageprojectmap.name}</span>
                    <Button
                      variant="danger"
                      size="sm"
                      className="position-absolute top-0 end-0 translate-middle badge rounded-pill bg-danger"
                      onClick={removeImage2}
                      style={{ cursor: "pointer" }}
                    >
                      X
                    </Button>
                  </div>
                )}
              </Form.Group>


              <Form.Group className="mb-3" controlId="youtubelink">
                <Form.Label>Youtube Link <span className="text-danger">*</span></Form.Label>
                <Form.Control
                 type="text"
                  value={youtubeLink}
                  onChange={(e) => {
                    setYoutubeLink(e.target.value);
                    if (errors.youtubeLink) setErrors(prev => ({ ...prev, youtubeLink: null }));
                  }}
                  placeholder="Enter Your Youtube Link"
                  isInvalid={!!errors.youtubeLink}
                />
                {errors.youtubeLink && <div className="text-danger mt-1" style={{ fontSize: '0.875em' }}>{errors.youtubeLink}</div>}
              </Form.Group>

              <div className="submitbutton d-flex justify-content-end ">
                <button
                  type="submit"
                  className="submitbutton_design"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Loading...
                    </>
                  ) : (
                    <div className="">Submit</div>
                  )}
                </button>
              </div>
            </Form>
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={closeCustomModal} centered>
        <Modal.Header closeButton>
          <Modal.Title className={modalType === 'success' ? 'text-success' : 'text-danger'}>
            {modalType === 'success' ? 'Success!' : 'Error!'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{modalMessage}</p>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button
            variant={modalType === 'success' ? 'success' : 'danger'}
            onClick={closeCustomModal}
          >
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CreateProject;