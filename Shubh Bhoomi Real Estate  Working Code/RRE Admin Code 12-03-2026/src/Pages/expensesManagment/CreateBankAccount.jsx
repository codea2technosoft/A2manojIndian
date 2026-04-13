import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

function CreateBankAccount() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    payee: "",
    bank_account_name: "",
    account_number: "",
    type: "",
    ifsc_code: "",
    bank_branch_name: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

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
    setMessageModalContent({
      title: "",
      text: "",
      type: "",
      confirmAction: null,
    });
  };

  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file types and sizes
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        showCustomMessageModal("Invalid File", "Only image files are allowed.", "error");
        return false;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showCustomMessageModal("File Too Large", "Image size should be less than 5MB.", "error");
        return false;
      }
      
      return true;
    });
    
    setImages(prevImages => [...prevImages, ...validFiles]);
    
    // Create previews
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
    setImagePreviews(prevPreviews => {
      URL.revokeObjectURL(prevPreviews[index]); // Clean up memory
      return prevPreviews.filter((_, i) => i !== index);
    });
  };

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    if (!formData.payee || !formData.payee.trim()) {
      newErrors.payee = "Payee name is required.";
      isValid = false;
    }

    if (formData.type === "online") {
      if (!formData.bank_account_name || !formData.bank_account_name.trim()) {
        newErrors.bank_account_name = "Bank name is required.";
        isValid = false;
      }
      if (!formData.account_number || !formData.account_number.trim()) {
        newErrors.account_number = "Account number is required.";
        isValid = false;
      } else if (!/^\d+$/.test(formData.account_number)) {
        newErrors.account_number = "Account number must contain only digits.";
        isValid = false;
      }
      if (!formData.ifsc_code || !formData.ifsc_code.trim()) {
        newErrors.ifsc_code = "IFSC code is required.";
        isValid = false;
      }
    }

    if (!formData.type || !formData.type.trim()) {
      newErrors.type = "Account type is required.";
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
        showCustomMessageModal(
          "Authentication Error",
          "Authentication token not found. Please log in.",
          "error"
        );
        return;
      }

      // Create FormData object to send both form data and files
      const formDataToSend = new FormData();
      formDataToSend.append("payee", formData.payee);
      formDataToSend.append("bank_account_name", formData.bank_account_name);
      formDataToSend.append("account_number", formData.account_number);
      formDataToSend.append("type", formData.type);
      formDataToSend.append("ifsc_code", formData.ifsc_code);
      formDataToSend.append("bank_branch_name", formData.bank_branch_name);
      
      // Append each image file
      images.forEach((image, index) => {
        formDataToSend.append(`images`, image);
      });

      const response = await fetch(`${API_URL}/expence-bank-account-create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type header when sending FormData
          // The browser will set it automatically with the correct boundary
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        showCustomMessageModal(
          "Error",
          errorData.message || "Failed to create bank account.",
          "error"
        );
        return;
      }

      const result = await response.json();

      if (result.success == "1") {
        showCustomMessageModal(
          "Success",
          result.message || "Bank account created successfully!",
          "success"
        );
        setFormData({
          payee: "",
          bank_account_name: "",
          account_number: "",
          type: "",
          ifsc_code: "",
          bank_branch_name: "",
        });
        setImages([]);
        setImagePreviews([]);
        setErrors({});

        setTimeout(() => {
          navigate("/bank-account-list");
        }, 2000);
      }
      else {
        showCustomMessageModal(
          "Error",
          result.message || "Bank account created Error!",
          "Error"
        );
      }

    } catch (err) {
      console.error("Error creating bank account:", err);
      showCustomMessageModal(
        "Error",
        err.message || "An unexpected error occurred while creating bank account.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-2">
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <div className="d-flex align-items-center justify-content-between">
                <div className="titlepage">
                  <h3>Create Bank Account</h3>
                </div>
              </div>
            </div>
            <div className="card-body">
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label htmlFor="accountType">Type</Form.Label>
                      <Form.Control
                        as="select"
                        name="type"
                        id="accountType"
                        value={formData.type}
                        onChange={handleFormChange}
                        isInvalid={!!errors.type}
                      >
                        <option value="">Select Type</option>
                        <option value="online">Online</option>
                        <option value="cash">Cash</option>
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">
                        {errors.type}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label htmlFor="accountName">Payment From Account Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="payee"
                        id="payee"
                        value={formData.payee}
                        onChange={handleFormChange}
                        placeholder="Enter Payee Name"
                        isInvalid={!!errors.payee}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.payee}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  {formData.type === "online" && (
                    <>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label htmlFor="bankAccountName">Bank Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="bank_account_name"
                            id="bankAccountName"
                            value={formData.bank_account_name}
                            onChange={handleFormChange}
                            placeholder="Enter bank name"
                            isInvalid={!!errors.bank_account_name}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.bank_account_name}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label htmlFor="barnchName">Branch Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="bank_branch_name"
                            id="barnchName"
                            value={formData.bank_branch_name}
                            onChange={handleFormChange}
                            placeholder="Enter bank branch name"
                            isInvalid={!!errors.bank_branch_name}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.bank_branch_name}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label htmlFor="accountNumber">Account Number</Form.Label>
                          <Form.Control
                            type="text"
                            name="account_number"
                            id="accountNumber"
                            value={formData.account_number}
                            onChange={handleFormChange}
                            placeholder="Enter account number"
                            isInvalid={!!errors.account_number}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.account_number}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label htmlFor="ifscCode">IFSC Code</Form.Label>
                          <Form.Control
                            type="text"
                            name="ifsc_code"
                            id="ifscCode"
                            value={formData.ifsc_code}
                            onChange={handleFormChange}
                            placeholder="Enter IFSC code"
                            isInvalid={!!errors.ifsc_code}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.ifsc_code}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </>
                  )}

                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Bank Passbook/Cheque</Form.Label>
                      <Form.Control
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      <Form.Text className="text-muted">
                        You can select multiple images. Maximum file size: 5MB each.
                      </Form.Text>
                    </Form.Group>
                    
                    {/* Image previews */}
                    {imagePreviews.length > 0 && (
                      <div className="mt-3">
                        <h6>Selected Images:</h6>
                        <div className="d-flex flex-wrap gap-2">
                          {imagePreviews.map((preview, index) => (
                            <div key={index} className="position-relative" style={{width: '100px', height: '100px'}}>
                              <img 
                                src={preview} 
                                alt={`Preview ${index + 1}`}
                                className="img-thumbnail"
                                style={{width: '100%', height: '100%', objectFit: 'cover'}}
                              />
                              <button
                                type="button"
                                className="btn-close position-absolute top-0 end-0 bg-white"
                                style={{padding: '0.25rem'}}
                                onClick={() => removeImage(index)}
                                aria-label="Remove image"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Col>
                </Row>
                <div className="submitbutton">
                  <Button
                    type="submit"
                    className="submitbutton_design"
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Create Bank Account"}
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div
              className={`modal-content ${messageModalContent.type === "success"
                ? "border-success"
                : messageModalContent.type === "error"
                  ? "border-danger"
                  : "border-warning"
                }`}
            >
              <div className="modal-header d-flex justify-content-between align-items-center">
                <h5
                  className={`modal-title ${messageModalContent.type === "success"
                    ? "text-success"
                    : messageModalContent.type === "error"
                      ? "text-danger"
                      : "text-warning"
                    }`}
                >
                  {messageModalContent.title}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={closeCustomMessageModal}
                ></button>
              </div>
              <div className="modal-body text-secondary">
                <p>{messageModalContent.text}</p>
              </div>
              <div className="modal-footer justify-content-center">
                {messageModalContent.confirmAction ? (
                  <>
                    <Button variant="danger" onClick={closeCustomMessageModal}>
                      Cancel
                    </Button>
                    <Button
                      variant={
                        messageModalContent.type === "warning" ? "warning" : "primary"
                      }
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
                    variant={
                      messageModalContent.type === "success"
                        ? "success"
                        : messageModalContent.type === "error"
                          ? "danger"
                          : "primary"
                    }
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

export default CreateBankAccount;