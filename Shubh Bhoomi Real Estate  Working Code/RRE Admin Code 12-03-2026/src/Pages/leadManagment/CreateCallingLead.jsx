import React, { useState, useEffect } from "react";
import { Form, Button, Card, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

function CreateCallingLead() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    LeadDate: "",
    Platform: "",
    Name: "",
    MobileNo: "",
    AlternateMobileNo: "",
    City: "",
    JobTitle: "",
    Budget: "",
    Requirement: "",
    Status: "New",
    Remark: "",
    NextFollowUpDate: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Message Modal State
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageModalContent, setMessageModalContent] = useState({
    title: "",
    text: "",
    type: "",
    confirmAction: null,
  });

  const showCustomMessageModal = (title, text, type, confirmAction = null) => {
    setMessageModalContent({ title, text, type, confirmAction });
    setShowMessageModal(true);
  };

  const closeCustomMessageModal = () => {
    setShowMessageModal(false);
    setMessageModalContent({ title: "", text: "", type: "", confirmAction: null });
  };

  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  // Set current date as default for LeadDate
  useEffect(() => {
    const currentDate = new Date().toISOString().split('T')[0];
    setFormData(prevData => ({
      ...prevData,
      LeadDate: currentDate
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: null,
      }));
    }
  };

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    // Required fields validation
    if (!formData.Name.trim()) {
      newErrors.Name = "Name is required.";
      isValid = false;
    }

    if (!formData.MobileNo.trim()) {
      newErrors.MobileNo = "Mobile Number is required.";
      isValid = false;
    } else if (!/^[0-9]{10}$/.test(formData.MobileNo.trim())) {
      newErrors.MobileNo = "Mobile Number must be 10 digits.";
      isValid = false;
    }

    // Alternate Mobile validation (if provided)
    if (formData.AlternateMobileNo && !/^[0-9]{10}$/.test(formData.AlternateMobileNo.trim())) {
      newErrors.AlternateMobileNo = "Alternate Mobile must be 10 digits.";
      isValid = false;
    }

    // Lead Date validation
    if (!formData.LeadDate) {
      newErrors.LeadDate = "Lead Date is required.";
      isValid = false;
    }

    // Next Follow Up Date validation (if provided)
    if (formData.NextFollowUpDate && formData.LeadDate) {
      const leadDate = new Date(formData.LeadDate);
      const followUpDate = new Date(formData.NextFollowUpDate);

      if (followUpDate < leadDate) {
        newErrors.NextFollowUpDate = "Next Follow Up Date cannot be before Lead Date.";
        isValid = false;
      }
    }

    // Platform validation
    if (!formData.Platform.trim()) {
      newErrors.Platform = "Platform is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const token = getAuthToken();
      if (!token) {
        showCustomMessageModal("Authentication Required", "Please log in to create a lead.", "error");
        navigate("/login");
        return;
      }

      const response = await fetch(`${API_URL}/calling-lead-create-single`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        showCustomMessageModal("Creation Failed", errorData.message || "Failed to create lead.", "error");
        return;
      }

      const result = await response.json();
      showCustomMessageModal("Success", result.message || "Lead created successfully!", "success");

      // Reset form after successful submission
      setFormData({
        LeadDate: new Date().toISOString().split('T')[0],
        Platform: "",
        Name: "",
        MobileNo: "",
        AlternateMobileNo: "",
        City: "",
        JobTitle: "",
        Budget: "",
        Requirement: "",
        Status: "New",
        Remark: "",
        NextFollowUpDate: "",
      });
      setErrors({});

      // Optional: Redirect to leads list after 2 seconds
      setTimeout(() => {
        navigate("/upload-property-lead-csv");
      }, 2000);

    } catch (err) {
      console.error("Error creating lead:", err);
      showCustomMessageModal("Network Error", "An unexpected error occurred. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-2">
      <div className="row">
        <div className="col-md-12">
          <Card className="shadow-lg rounded-3">
            <div className="card-header">
              <div className="d-flex align-items-center justify-content-between">
                <div className="titlepage">
                  <h3>Create New Calling Lead</h3>
                </div>
              </div>
            </div>

            <Card.Body>
              <Form onSubmit={handleSubmit}>
                {/* Row 1: Lead Date & Platform */}
                <div className="row">
                  <div className="col-md-6">
                    <Form.Group className="mb-3" controlId="formLeadDate">
                      <Form.Label>Lead Date <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="date"
                        name="LeadDate"
                        value={formData.LeadDate}
                        onChange={handleChange}
                        isInvalid={!!errors.LeadDate}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.LeadDate}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </div>
                  <div className="col-md-6">
                    <Form.Group className="mb-3" controlId="formPlatform">
                      <Form.Label>Platform <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        name="Platform"
                        placeholder="Enter platform (e.g., Website, Facebook, Instagram)"
                        value={formData.Platform}
                        onChange={handleChange}
                        isInvalid={!!errors.Platform}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.Platform}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </div>
                </div>

                {/* Row 2: Name & Mobile */}
                <div className="row">
                  <div className="col-md-6">
                    <Form.Group className="mb-3" controlId="formName">
                      <Form.Label>Name <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        name="Name"
                        placeholder="Enter full name"
                        value={formData.Name}
                        onChange={handleChange}
                        isInvalid={!!errors.Name}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.Name}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </div>
                  <div className="col-md-6">
                    <Form.Group className="mb-3" controlId="formMobileNo">
                      <Form.Label>Mobile No <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        name="MobileNo"
                        placeholder="Enter 10-digit mobile number"
                        value={formData.MobileNo}
                        onChange={handleChange}
                        isInvalid={!!errors.MobileNo}
                        maxLength="10"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.MobileNo}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </div>
                </div>

                {/* Row 3: Alternate Mobile & City */}
                <div className="row">
                  <div className="col-md-6">
                    <Form.Group className="mb-3" controlId="formAlternateMobileNo">
                      <Form.Label>Alternate Mobile No</Form.Label>
                      <Form.Control
                        type="text"
                        name="AlternateMobileNo"
                        placeholder="Enter alternate mobile number"
                        value={formData.AlternateMobileNo}
                        onChange={handleChange}
                        isInvalid={!!errors.AlternateMobileNo}
                        maxLength="10"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.AlternateMobileNo}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </div>
                  <div className="col-md-6">
                    <Form.Group className="mb-3" controlId="formCity">
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        type="text"
                        name="City"
                        placeholder="Enter city"
                        value={formData.City}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </div>
                </div>

                {/* Row 4: Job Title & Budget */}
                <div className="row">
                  <div className="col-md-6">
                    <Form.Group className="mb-3" controlId="formJobTitle">
                      <Form.Label>Job Title</Form.Label>
                      <Form.Control
                        type="text"
                        name="JobTitle"
                        placeholder="Enter job title"
                        value={formData.JobTitle}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </div>
                  <div className="col-md-6">
                    <Form.Group className="mb-3" controlId="formBudget">
                      <Form.Label>Budget</Form.Label>
                      <Form.Control
                        type="text"
                        name="Budget"
                        placeholder="Enter budget"
                        value={formData.Budget}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </div>
                </div>

                {/* Row 5: Requirement & Status */}
                <div className="row">
                  <div className="col-md-6">
                    <Form.Group className="mb-3" controlId="formRequirement">
                      <Form.Label>Requirement</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="Requirement"
                        placeholder="Enter requirement details"
                        value={formData.Requirement}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </div>
                  <div className="col-md-6">
                    <Form.Group className="mb-3" controlId="formStatus">
                      <Form.Label>Status</Form.Label>
                      <Form.Control
                        as="select"
                        name="Status"
                        value={formData.Status}
                        onChange={handleChange}
                        disabled
                      >
                        <option value="New">New</option>
                      </Form.Control>
                    </Form.Group>
                  </div>
                </div>

                {/* Row 6: Remark & Next Follow Up Date */}
                <div className="row">
                  <div className="col-md-6">
                    <Form.Group className="mb-3" controlId="formRemark">
                      <Form.Label>Remark</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="Remark"
                        placeholder="Enter remarks"
                        value={formData.Remark}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </div>
                  <div className="col-md-6">
                    <Form.Group className="mb-3" controlId="formNextFollowUpDate">
                      <Form.Label>Next Follow Up Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="NextFollowUpDate"
                        value={formData.NextFollowUpDate}
                        onChange={handleChange}
                        isInvalid={!!errors.NextFollowUpDate}
                        min={formData.LeadDate}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.NextFollowUpDate}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </div>
                </div>

                <div className="submitbutton">
                  <Button
                    type="submit"
                    className="submitbutton_design"
                    disabled={loading}
                    style={{ minWidth: "150px" }}
                  >
                    {loading ? "Creating..." : "Create Lead"}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className={`modal-content ${messageModalContent.type === 'success' ? 'border-success' : messageModalContent.type === 'error' ? 'border-danger' : 'border-warning'}`}>
              <div className="modal-header d-flex justify-content-between align-items-center">
                <h5 className={`modal-title ${messageModalContent.type === 'success' ? 'text-success' : messageModalContent.type === 'error' ? 'text-danger' : 'text-warning'}`}>
                  {messageModalContent.title}
                </h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={closeCustomMessageModal}></button>
              </div>
              <div className="modal-body text-secondary">
                <p>{messageModalContent.text}</p>
              </div>
              <div className="modal-footer justify-content-center">
                {messageModalContent.confirmAction ? (
                  <>
                    <Button variant="secondary" onClick={closeCustomMessageModal}>
                      Cancel
                    </Button>
                    <Button
                      variant={messageModalContent.type === 'warning' ? 'warning' : 'primary'}
                      onClick={() => {
                        messageModalContent.confirmAction();
                        closeCustomMessageModal();
                      }}
                    >
                      Confirm
                    </Button>
                  </>
                ) : (
                  <Button
                    variant={messageModalContent.type === 'success' ? 'success' : messageModalContent.type === 'error' ? 'danger' : 'primary'}
                    onClick={closeCustomMessageModal}
                  >
                    OK
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateCallingLead;