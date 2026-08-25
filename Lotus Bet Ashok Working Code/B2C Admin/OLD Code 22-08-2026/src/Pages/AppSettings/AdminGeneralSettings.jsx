import React, { useEffect, useState } from "react";
import { Form, Button, Container, Row, Col, Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import Heading from '../../Layout/Heading'

import {
    UpdateSettings,
    getSettings
} from "../../Server/api";

function AdminGeneralSettings() {
  const [formData, setFormData] = useState({
    mobile_number: "",
    whatsapp_number: "",
    email_id: "",
    address: "",
    description: "",
  });
  const [settingsId, setSettingsId] = useState("");
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  const fetchSiteSettings = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      if (!token) {
        Swal.fire({
          icon: "error",
          title: "Authentication Error",
          text: "Please log in to continue.",
          confirmButtonColor: "#d33",
        });
        setLoading(false);
        return;
      }

      const response = await getSettings({});
      const responseData = response.data?.data || response.data;
      
      if (responseData && Array.isArray(responseData) && responseData.length > 0) {
        const settingsData = responseData[0];
        setSettingsId(settingsData._id || "");
        setFormData({
          mobile_number: settingsData.mobile_number || "",
          whatsapp_number: settingsData.whatsapp_number || "",
          email_id: settingsData.email_id || "",
          address: settingsData.address || "",
          description: settingsData.description || "",
        });
      } else {
        Swal.fire({
          icon: "info",
          title: "No Settings Found",
          text: "Please fill in the details and save.",
          confirmButtonColor: "#3085d6",
        });
      }
    } catch (error) {
      console.error("Error fetching site settings:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Failed to fetch settings: ${error.message}`,
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSiteSettings();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const token = getAuthToken();
      if (!token) {
        Swal.fire({
          icon: "error",
          title: "Authentication Error",
          text: "Please log in to continue.",
          confirmButtonColor: "#d33",
        });
        setIsUpdating(false);
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("id", settingsId);
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formDataToSend.append(key, value);
        }
      });

      const response = await UpdateSettings(formDataToSend);
      const responseData = response.data || response;
      
      if (responseData && responseData.success === true) {
        Swal.fire({
          icon: "success",
          title: "Success! 🎉",
          text: responseData.message || "Site settings updated successfully!",
          confirmButtonColor: "#28a745",
          timer: 3000,
          timerProgressBar: true,
        });
        fetchSiteSettings();
      } else {
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: responseData?.message || "Failed to update site settings.",
          confirmButtonColor: "#d33",
        });
      }
    } catch (error) {
      console.error("Error updating site settings:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `An error occurred: ${error.message}`,
        confirmButtonColor: "#d33",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="py-3">
      <div className="allcommon">
        <Heading title="Admin General Settings" />
        <div className="mt-3 overflow-hidden">
          <div className="set-limit-sec">
            <Form onSubmit={handleSubmit}>
              <Row className="">
                <Col md={4}>
                  <Form.Group className="mb-3 form_design_all" controlId="mobile_number">
                    <Form.Label>Mobile Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="mobile_number"
                      value={formData.mobile_number || ""}
                      onChange={handleFormChange}
                      placeholder="Enter mobile number"
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3 form_design_all" controlId="whatsapp_number">
                    <Form.Label>WhatsApp Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="whatsapp_number"
                      value={formData.whatsapp_number || ""}
                      onChange={handleFormChange}
                      placeholder="Enter WhatsApp number"
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group className="mb-3 form_design_all" controlId="email_id">
                    <Form.Label>Email ID</Form.Label>
                    <Form.Control
                      type="email"
                      name="email_id"
                      value={formData.email_id || ""}
                      onChange={handleFormChange}
                      placeholder="example@mail.com"
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3 form_design_all" controlId="description">
                    <Form.Label>Lotus77VIP Screen Message</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      name="description"
                      value={formData.description || ""}
                      onChange={handleFormChange}
                      placeholder="Lotus77VIP Screen Message"
                      style={{ height: "90px" }}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3 form_design_all" controlId="address">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      name="address"
                      value={formData.address || ""}
                      onChange={handleFormChange}
                      placeholder="Enter address"
                      style={{ height: "90px" }}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <div className="mt-2 d-flex justify-content-end">
                <button type="submit" className="btn green-btn" disabled={isUpdating}>
                  {isUpdating ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Updating...
                    </>
                  ) : (
                    "Update Settings"
                  )}
                </button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminGeneralSettings;