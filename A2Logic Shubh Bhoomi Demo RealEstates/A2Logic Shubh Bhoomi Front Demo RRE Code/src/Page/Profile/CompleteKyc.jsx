import React, { useState } from "react";
import { Form, Button, Alert, Card, Container } from "react-bootstrap";

const CompleteKyc = () => {
  const [panNumber, setPanNumber] = useState("");
  const [adharNumber, setAdharNumber] = useState("");
  const [kycFile, setKycFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});

  const validatePan = (pan) =>
    /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan.toUpperCase());
  const validateAdhar = (adhar) => /^[2-9]{1}[0-9]{11}$/.test(adhar);

  const handlePanChange = (e) => {
    const value = e.target.value.toUpperCase();
    setPanNumber(value);

    if (value && !validatePan(value)) {
      setErrors((prev) => ({
        ...prev,
        panNumber: "Enter valid PAN (e.g., ABCDE1234F)",
      }));
    } else {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated.panNumber;
        return updated;
      });
    }
  };

  const handleAdharChange = (e) => {
    const input = e.target.value.replace(/\D/g, ""); // Remove non-digits
    const value = input.slice(0, 12); // Limit to 12 digits
    setAdharNumber(value);

    if (value && !validateAdhar(value)) {
      setErrors((prev) => ({
        ...prev,
        adharNumber: "Enter valid 12-digit Aadhaar number (start with 2-9)",
      }));
    } else {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated.adharNumber;
        return updated;
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setKycFile(file); // ✅ properly set the file
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated.kycFile;
        return updated;
      });
    }
  };

  const handleKycSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!panNumber) {
      newErrors.panNumber = "PAN number is required";
    } else if (!validatePan(panNumber)) {
      newErrors.panNumber = "Enter valid PAN (e.g., ABCDE1234F)";
    }

    if (!adharNumber) {
      newErrors.adharNumber = "Aadhaar number is required";
    } else if (!validateAdhar(adharNumber)) {
      newErrors.adharNumber = "Enter valid 12-digit Aadhaar number";
    }

    if (!kycFile) {
      newErrors.kycFile = "Please upload KYC file";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setMessage("");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User token not found. Please login again.");
        return;
      }

      const formData = new FormData();
      formData.append("pan_number", panNumber);
      formData.append("adhar_number", adharNumber);
      formData.append("image", kycFile);

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/kyc-complete`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok && data.status === "1") {
        setMessage("✅ KYC submitted successfully.");
        setError("");
        setPanNumber("");
        setAdharNumber("");
        setKycFile(null);
        setErrors({});
      } else {
        setError(data.message || "KYC submission failed.");
        setMessage("");
      }
    } catch (err) {
      console.error("KYC error:", err);
      setError("Something went wrong.");
      setMessage("");
    }
  };

  return (
    <Container className="mt-5">
      <Card
        className="shadow-sm border-0 p-4 mx-auto"
        style={{ maxWidth: "600px" }}
      >
        <h4 className="mb-4 text-center">📋 Complete Your KYC</h4>
        <Form onSubmit={handleKycSubmit} encType="multipart/form-data">
          <Form.Group className="mb-3">
            <Form.Label>PAN Number</Form.Label>
            <Form.Control
              type="text"
              value={panNumber}
              onChange={handlePanChange}
              placeholder="Enter PAN Number"
              isInvalid={!!errors.panNumber}
            />
            <Form.Control.Feedback type="invalid">
              {errors.panNumber}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Aadhaar Number</Form.Label>
            <Form.Control
              type="text"
              value={adharNumber}
              onChange={handleAdharChange}
              placeholder="Enter Aadhaar Number"
              maxLength={12}
              inputMode="numeric"
              isInvalid={!!errors.adharNumber}
            />
            <Form.Control.Feedback type="invalid">
              {errors.adharNumber}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Upload KYC File</Form.Label>
            <Form.Control
              type="file"
              accept=".pdf, .jpg, .jpeg, .png"
              onChange={handleFileChange}
              isInvalid={!!errors.kycFile}
            />
            <Form.Control.Feedback type="invalid">
              {errors.kycFile}
            </Form.Control.Feedback>
          </Form.Group>

          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}

          <Button type="submit" variant="success" className="w-100">
            Submit KYC
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default CompleteKyc;
