import React, { useState } from "react";
import { Form, Button, Alert, Card, Container, CardBody } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const KycPage = () => {
  const [panNumber, setPanNumber] = useState("");
  const [adharNumber, setAdharNumber] = useState("");
  const [kycFile, setKycFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validatePan = (pan) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan.toUpperCase());
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

  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setKycFile(file); // ✅ properly set the file
  //     setErrors((prev) => {
  //       const updated = { ...prev };
  //       delete updated.kycFile;
  //       return updated;
  //     });
  //   }
  // };

  // const handleKycSubmit = async (e) => {
  //   e.preventDefault();

  //   const newErrors = {};
  //   if (!panNumber) {
  //     newErrors.panNumber = "PAN number is required";
  //   } else if (!validatePan(panNumber)) {
  //     newErrors.panNumber = "Enter valid PAN (e.g., ABCDE1234F)";
  //   }

  //   if (!adharNumber) {
  //     newErrors.adharNumber = "Aadhaar number is required";
  //   } else if (!validateAdhar(adharNumber)) {
  //     newErrors.adharNumber = "Enter valid 12-digit Aadhaar number";
  //   }

  //   // if (!kycFile) {
  //   //   newErrors.kycFile = "Please upload KYC file";
  //   // }

  //   // if (Object.keys(newErrors).length > 0) {
  //   //   setErrors(newErrors);
  //   //   setMessage("");
  //   //   return;
  //   // }

  //   try {
  //     const token = localStorage.getItem("token");
  //     if (!token) {
  //       setError("User token not found. Please login again.");
  //       return;
  //     }

  //     // const formData = new FormData();
  //     // formData.append("pan_number", panNumber);
  //     // formData.append("adhar_number", adharNumber);
  //     // formData.append("image", kycFile);


  //     const response = await fetch(
  //       `${process.env.REACT_APP_API_URL}/kyc-complete`,
  //       {
  //         method: "POST",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body: formData,
  //       }
  //     );

  //     const data = await response.json();

  //     if (response.ok && data.status === "1") {
  //       setMessage("✅ KYC submitted successfully.");
  //       setError("");
  //       setPanNumber("");
  //       setAdharNumber("");
  //       // setKycFile(null);
  //       setErrors({});
  //         setTimeout(() => {
  //       navigate("/my-profile"); 
  //     }, 1000);

  //     } else {
  //       setError(data.message || "KYC submission failed.");
  //       setMessage("");
  //     }
  //   } catch (err) {
  //     console.error("KYC error:", err);
  //     setError("Something went wrong.");
  //     setMessage("");
  //   }
  // };
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

      // ✅ JSON payload instead of FormData
      const payload = {
        pan_number: panNumber,
        adhar_number: adharNumber,
      };

      const response = await fetch(`${process.env.REACT_APP_API_URL}/kyc-complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Send JSON
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload), // Convert JS object to JSON
      });

      const data = await response.json();

      if (response.ok && data.status === "1") {
        setMessage("✅ KYC submitted successfully.");
        setError("");
        setPanNumber("");
        setAdharNumber("");
        setErrors({});
        setTimeout(() => {
          window.location.href = "/my-profile";
          navigate("/my-profile");
        }, 1000);
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
    <Container>
      <Card className="mt-3">
        <div className="card-header">
          <div className="d-flex justify-content-between align-items-center">
            <div className="titlepage">
              <h3> Complete Your KYC : </h3>
            </div>
            <div className="backbutton">
              <Link to='/dashboard'>Back</Link>
            </div>
          </div>
        </div>
        <CardBody>
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

            {/* <Form.Group className="mb-3">
  <Form.Label>Upload Profile Image</Form.Label>
  <Form.Control
    type="file"
    accept=".pdf, .jpg, .jpeg, .png"
    onChange={handleFileChange}
    isInvalid={!!errors.kycFile}
  />
  <Form.Control.Feedback type="invalid">
    {errors.kycFile}
  </Form.Control.Feedback>
</Form.Group> */}

            {error && <Alert variant="danger">{error}</Alert>}
            {message && <Alert variant="success">{message}</Alert>}
            <div className="d-flex justify-content-end">
              <Button type="submit" variant="success">
                Submit KYC
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
    </Container>
  );
};

export default KycPage;
