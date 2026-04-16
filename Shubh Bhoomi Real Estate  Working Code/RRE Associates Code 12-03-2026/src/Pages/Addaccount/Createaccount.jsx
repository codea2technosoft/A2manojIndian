import React, { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

function CreateBankAccount() {
  const [formData, setFormData] = useState({
    account_holder_name: "",
    bank_name: "",
    account_number: "",
    ifsc_code: "",
    bank_branch_name: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [documentFile, setDocumentFile] = useState([]);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    setFormData({
      ...formData,
      [name]: name === "ifsc_code" ? value.toUpperCase() : value,
    });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };




  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    if (!formData.account_holder_name.trim()) {
      newErrors.account_holder_name = "Account Holder Name is required.";
      isValid = false;
    }
    if (!formData.bank_name.trim()) {
      newErrors.bank_name = "Bank Name is required.";
      isValid = false;
    }

    if (!formData.bank_branch_name.trim()) {
      newErrors.bank_branch_name = "Bank Branch Name is required.";
      isValid = false;
    }



    if (!/^\d+$/.test(formData.account_number)) {
      newErrors.account_number = "Account Number must be numeric.";
      isValid = false;
    }
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifsc_code)) {
      newErrors.ifsc_code = "Invalid IFSC Code format.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!validateForm()) return;

  //   setLoading(true);
  //   try {
  //     const token = localStorage.getItem("token");
  //     documentFile.forEach((file) => {
  //       formData.append("document", file);
  //     });

  //     const response = await fetch(`${API_URL}/create-bank-account`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify(formData),
  //     });

  //     const result = await response.json();
  //     if (!response.ok || result.status === false) {
  //       Swal.fire(
  //         "Error",
  //         result.message || "Failed to create account",
  //         "error"
  //       );
  //       return;
  //     }

  //     Swal.fire(
  //       "Success",
  //       result.message || "Account created successfully!",
  //       "success"
  //     );
  //     setFormData({
  //       account_holder_name: "",
  //       bank_name: "",
  //       account_number: "",
  //       ifsc_code: "",
  //     });
  //   } catch (err) {
  //     Swal.fire("Error", err.message || "Unexpected error occurred", "error");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;


    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      // Create FormData
      const data = new FormData();
      data.append("account_holder_name", formData.account_holder_name);
      data.append("bank_name", formData.bank_name);
      data.append("account_number", formData.account_number);
      data.append("ifsc_code", formData.ifsc_code);
      data.append("bank_branch_name", formData.bank_branch_name);

      // Append files
      documentFile.forEach((file) => {
        data.append("document", file);
      });

      const response = await fetch(`${API_URL}/create-bank-account`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Content-Type will be set automatically
        },
        body: data,
      });

      const result = await response.json();
      if (!response.ok || result.status === false) {
        Swal.fire(
          "Error",
          result.message || "Failed to create account",
          "error"
        );
        return;
      }

      Swal.fire(
        "Success",
        result.message || "Account created successfully!",
        "success"
      ).then(() => {
        // Redirect after success
        navigate("/account-list");
      });

      // Reset form
      setFormData({
        account_holder_name: "",
        bank_name: "",
        account_number: "",
        ifsc_code: "",
        bank_branch_name: "",
      });
      setDocumentFile([]);
    } catch (err) {
      Swal.fire("Error", err.message || "Unexpected error occurred", "error");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="padding_15">
      <div className="card">
        <div className="card-header">
          <div class="titlepage">
            <h3>Add Bank Account</h3>
          </div>
        </div>
        <div className="card-body">
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Account Holder Name <span className="text-danger">*</span> </Form.Label>
                  <Form.Control
                    type="text"
                    name="account_holder_name"
                    placeholder=" Enter Account Holder Name"
                    value={formData.account_holder_name}
                    onChange={handleChange}
                    isInvalid={!!errors.account_holder_name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.account_holder_name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Bank Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="bank_name"
                    placeholder=" Enter Bank Name"
                    value={formData.bank_name}
                    onChange={handleChange}
                    isInvalid={!!errors.bank_name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.bank_name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>




              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Bank Branch Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="bank_branch_name"
                    placeholder=" Enter Bank Branch Name"
                    value={formData.bank_branch_name}
                    onChange={handleChange}
                    isInvalid={!!errors.bank_branch_name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.bank_branch_name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Account Number <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="account_number"
                    placeholder="Enter Account Number"
                    value={formData.account_number}
                    onChange={(e) => {
                      const val = e.target.value;
                      // Allow only digits
                      if (/^\d*$/.test(val)) {
                        handleChange(e); // call your existing handleChange
                      }
                    }}
                    isInvalid={!!errors.account_number}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.account_number}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>IFSC Code <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="ifsc_code"
                    value={formData.ifsc_code}
                    placeholder=" Enter IFSC Code Like : SBIN0007587"
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase();
                      setFormData({ ...formData, ifsc_code: value });
                    }}
                    isInvalid={!!errors.ifsc_code}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.ifsc_code}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Upload PassBook / Cheque <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setDocumentFile(Array.from(e.target.files))}
                multiple
                required
              />
              <div className="row">
                {documentFile?.length > 0 && (
                  <div className="mt-2">
                    <small className="text-muted">Selected files:</small>
                    <ul className="list-unstyled d-flex flex-wrap">
                      <div className="row">
                        {documentFile.map((file, index) => (
                          <React.Fragment
                            key={index}
                            className="me-2 mb-2 "
                            style={{ listStyle: "none" }}
                          >
                            {/* Preview */}
                            <div className="col-md-2 position-relative">
                              {file.type.startsWith("image/") && (
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt={file.name}
                                  className="img-thumbnail"
                                  style={{
                                    width: "60px",
                                    height: "60px",
                                    objectFit: "cover",
                                  }}
                                />
                              )}
                              <button
                                type="button"
                                className="btn btn-sm btn-danger position-absolute"
                                style={{
                                  top: 0,
                                  right: 0,
                                  borderRadius: "50%",
                                  padding: "0 5px",
                                }}
                                onClick={() => {
                                  const newFiles = documentFile.filter(
                                    (_, i) => i !== index
                                  );
                                  setDocumentFile(newFiles);
                                }}
                              >
                                &times;
                              </button>
                            </div>
                            <small
                              className="d-block text-truncate"
                              style={{ maxWidth: "100px" }}
                            >
                              {file.name}
                            </small>
                          </React.Fragment>
                        ))}
                      </div>
                    </ul>
                  </div>
                )}
              </div>
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Account"}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default CreateBankAccount;
