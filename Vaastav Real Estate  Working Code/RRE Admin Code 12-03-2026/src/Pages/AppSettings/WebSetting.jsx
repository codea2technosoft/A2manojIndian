import React, { useEffect, useState } from "react";
import { Form, Button, Container, Row, Col, Modal } from "react-bootstrap";

const API_URL = process.env.REACT_APP_API_URL;

function WebSetting() {
  const [formData, setFormData] = useState({
    support1_number: "",
    mobile_number: "",
    whatsapp_number: "",
    whatsapp_link: "",
    call_number: "",
    email_id: "",
    address: "",
    insta_link: "",
    facebook_link: "",
    youtube_link: "",
    visit_car: "",
    visit_bike: "",
    visit_taxi: "",
    withdraw_date1: "",
    withdraw_date2: "",
    withdraw_date3: "",
    company_name: "",
    site_url: "",
    rre_rules_book: null,
    upload_rre_plans_pdf: null,
    marketting_partner_rules_regulations: null,
    Booking_forms: null,
    teligram_link: "",
    office_location_link: "",
    zoom_meeting_link: "",
    // associate_rules_regulations: "",
    // channel_rules_regulations: "",
    marketting_partner_rules_regulations: "",
    Booking_forms: "",
    rre_screen_message: "",
    tds: "",

  });
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
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


  const fetchSiteSettings = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      if (!token) {
        showCustomMessageModal("Authentication Error", "Authentication token not found. Please log in.", "error");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/site-setting`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        showCustomMessageModal("Error", errorData.message || "Failed to fetch site settings.", "error");
        return;
      }
      const data = await response.json();


      if (data.status === "1") {

        setFormData({
          support1_number: data.data.support1_number || "",
          mobile_number: data.data.mobile_number || "",
          whatsapp_number: data.data.whatsapp_number || "",
          call_number: data.data.call_number || "",
          email_id: data.data.email_id || "",
          address: data.data.address || "",
          insta_link: data.data.insta_link || "",
          facebook_link: data.data.facebook_link || "",
          youtube_link: data.data.youtube_link || "",
          visit_car: data.data.visit_car || "",
          visit_bike: data.data.visit_bike || "",
          visit_taxi: data.data.visit_taxi || "",
          withdraw_date1: data.data.withdraw_date1 || "",
          withdraw_date2: data.data.withdraw_date2 || "",
          withdraw_date3: data.data.withdraw_date3 || "",
          company_name: data.data.company_name || "",
          site_url: data.data.site_url || "",
          teligram_link: data.data.teligram_link || "",
          office_location_link: data.data.office_location_link || "",
          zoom_meeting_link: data.data.zoom_meeting_link || "",
          marketting_partner_rules_regulations: data.data.marketting_partner_rules_regulations || "",
          Booking_forms: data.data.Booking_forms || "",
          whatsapp_link: data.data.whatsapp_link || "",
          tds: data.data.tds || "",
          rre_screen_message: data.data.rre_screen_message || "",
        });
      } else {
        showCustomMessageModal("Info", "No existing site settings found. Please fill in the details.", "info");
      }
    } catch (error) {
      console.error("Error fetching site settings:", error);
      showCustomMessageModal("Error", `An unexpected error occurred: ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSiteSettings();
  }, []);


  const handleFormChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? files[0] : value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const token = getAuthToken();
      if (!token) {
        showCustomMessageModal("Authentication Error", "Authentication token not found. Please log in.", "error");
        setIsUpdating(false);
        return;
      }


      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formDataToSend.append(key, value);
        }
      });



      const response = await fetch(`${API_URL}/update-site-setting`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        showCustomMessageModal("Error", errorData.message || "Failed to update site settings.", "error");
        return;
      }

      const result = await response.json();
      showCustomMessageModal("Success", result.message || "Site settings updated successfully!", "success");
      fetchSiteSettings();
    } catch (error) {
      console.error("Error updating site settings:", error);
      showCustomMessageModal("Error", `An unexpected error occurred: ${error.message}`, "error");
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
    <div className="padding_15">
      <div className="card">
        <div className="card-header">
          <div className="d-flex align-items-center justify-content-between">
            <div className="titlepage">
              <h3>Website Settings</h3>
            </div>
            <div className="d-flex">

            </div>
          </div>
        </div>
        <div className="card-body">
          <Form onSubmit={handleSubmit}>
            <Row className="">
              <Col md={4}>
                <Form.Group className="mb-3 form_design_all" controlId="insta_link">
                  <Form.Label>Company Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleFormChange}
                    placeholder="Enter Company Name"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3 form_design_all" controlId="support1_number">
                  <Form.Label>Support Number 1</Form.Label>
                  <Form.Control
                    type="text"
                    name="support1_number"
                    value={formData.support1_number}
                    onChange={handleFormChange}
                    placeholder="Enter support number 1"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3 form_design_all" controlId="mobile_number">
                  <Form.Label>Mobile Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="mobile_number"
                    value={formData.mobile_number}
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
                    value={formData.whatsapp_number}
                    onChange={handleFormChange}
                    placeholder="Enter WhatsApp number"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3 form_design_all" controlId="call_number">
                  <Form.Label>Call Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="call_number"
                    value={formData.call_number}
                    onChange={handleFormChange}
                    placeholder="Enter call number"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3 form_design_all" controlId="email_id">
                  <Form.Label>Email ID</Form.Label>
                  <Form.Control
                    type="email"
                    name="email_id"
                    value={formData.email_id}
                    onChange={handleFormChange}
                    placeholder="Enter email ID"
                  />
                </Form.Group>
              </Col>


              <Col md={4}>
                <Form.Group className="mb-3 form_design_all" controlId="tds">
                  <Form.Label>TDS (%)</Form.Label>
                  <Form.Control
                    type="text"
                    name="tds"
                    value={formData.tds}
                    onChange={handleFormChange}
                    placeholder="Enter TDS in %"
                  />
                </Form.Group>
              </Col>




              <Col md={4}>
                <Form.Group className="mb-3 form_design_all" controlId="visit_car">
                  <Form.Label>Visit Car Amount (Per KM)</Form.Label>
                  <Form.Control
                    type="number"
                    name="visit_car"
                    value={formData.visit_car}
                    onChange={handleFormChange}
                    placeholder="Enter Amount"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3 form_design_all" controlId="visit_bike">
                  <Form.Label>Visit Bike Amount (Per KM)</Form.Label>
                  <Form.Control
                    type="number"
                    name="visit_bike"
                    value={formData.visit_bike}
                    onChange={handleFormChange}
                    placeholder="Enter Amount"
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3 form_design_all" controlId="visit_taxi">
                  <Form.Label>Visit Taxi Amount (Per KM)</Form.Label>
                  <Form.Control
                    type="number"
                    name="visit_taxi"
                    value={formData.visit_taxi}
                    onChange={handleFormChange}
                    placeholder="Enter Amount"
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3 form_design_all" controlId="withdraw_date1">
                  <Form.Label>Withdraw Request Date 1</Form.Label>
                  <Form.Control
                    type="date"
                    name="withdraw_date1"
                    value={formData.withdraw_date1}
                    onChange={handleFormChange}
                    placeholder="Select Date"
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3 form_design_all" controlId="withdraw_date2">
                  <Form.Label>Withdraw Request Date 2</Form.Label>
                  <Form.Control
                    type="date"
                    name="withdraw_date2"
                    value={formData.withdraw_date2}
                    onChange={handleFormChange}
                    placeholder="Select Date"
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3 form_design_all" controlId="withdraw_date3">
                  <Form.Label>Withdraw Request Date 3</Form.Label>
                  <Form.Control
                    type="date"
                    name="withdraw_date3"
                    value={formData.withdraw_date3}
                    onChange={handleFormChange}
                    placeholder="Select Date"
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3 form_design_all" controlId="rre_rules_book">
                  <Form.Label>Rule Book</Form.Label>
                  <Form.Control
                    type="file"
                    name="rre_rules_book"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFormChange}
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3 form_design_all" controlId="upload_rre_plans_pdf">
                  <Form.Label>Plan Book</Form.Label>
                  <Form.Control
                    type="file"
                    name="upload_rre_plans_pdf"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFormChange}
                  />
                </Form.Group>
              </Col>


              <Col md={4}>
                <Form.Group className="mb-3 form_design_all" controlId="marketting_partner_rules_regulations">
                  <Form.Label>Marketting Partner Rules & Rgulations</Form.Label>
                  <Form.Control
                    type="file"
                    name="marketting_partner_rules_regulations"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFormChange}
                  />
                </Form.Group>
              </Col>


              <Col md={4}>
                <Form.Group className="mb-3 form_design_all" controlId="Booking_forms">
                  <Form.Label>Booking Forms</Form.Label>
                  <Form.Control
                    type="file"
                    name="Booking_forms"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFormChange}
                  />
                </Form.Group>
              </Col>



              <Col md={4}>
                <Form.Group className="mb-3 form_design_all" controlId="site_url">
                  <Form.Label>Site URL</Form.Label>
                  <Form.Control
                    type="url"
                    name="site_url"
                    value={formData.site_url}
                    onChange={handleFormChange}
                    placeholder="Enter Site Url"
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3 form_design_all" controlId="insta_link">
                  <Form.Label>Instagram Link</Form.Label>
                  <Form.Control
                    type="url"
                    name="insta_link"
                    value={formData.insta_link}
                    onChange={handleFormChange}
                    placeholder="Enter Instagram link"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3 form_design_all" controlId="facebook_link">
                  <Form.Label>Facebook Link</Form.Label>
                  <Form.Control
                    type="url"
                    name="facebook_link"
                    value={formData.facebook_link}
                    onChange={handleFormChange}
                    placeholder="Enter Facebook link"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3 form_design_all" controlId="youtube_link">
                  <Form.Label>YouTube Link</Form.Label>
                  <Form.Control
                    type="url"
                    name="youtube_link"
                    value={formData.youtube_link}
                    onChange={handleFormChange}
                    placeholder="Enter YouTube link"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3 form_design_all" controlId="teligram_link">
                  <Form.Label>Telegram Link</Form.Label>
                  <Form.Control
                    type="url"
                    name="teligram_link"
                    value={formData.teligram_link}
                    onChange={handleFormChange}
                    placeholder="Enter Telegram Link"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3 form_design_all" controlId="office_location_link">
                  <Form.Label>Office Location Link</Form.Label>
                  <Form.Control
                    type="url"
                    name="office_location_link"
                    value={formData.office_location_link}
                    onChange={handleFormChange}
                    placeholder="Enter Office Location Link"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3 form_design_all" controlId="zoom_meeting_link">
                  <Form.Label>Zoom Meeting  Link</Form.Label>
                  <Form.Control
                    type="url"
                    name="zoom_meeting_link"
                    value={formData.zoom_meeting_link}
                    onChange={handleFormChange}
                    placeholder="Enter Zoom Meeting Link"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3 form_design_all" controlId="whatsapp_link">
                  <Form.Label>Whatsapp Link</Form.Label>
                  <Form.Control
                    type="url"
                    name="whatsapp_link"
                    value={formData.whatsapp_link}
                    onChange={handleFormChange}
                    placeholder="Enter Whatsapp Link"
                  />
                </Form.Group>
              </Col>

               


               <Col md={12}>
                <Form.Group className="mb-3 form_design_all" controlId="address">
                  <Form.Label>VRE Screen Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="rre_screen_message"
                    value={formData.rre_screen_message}
                    onChange={handleFormChange}
                    placeholder="VRE Screen Message"
                  />
                </Form.Group></Col>



              <Col md={12}>
                <Form.Group className="mb-3 form_design_all" controlId="address">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="address"
                    value={formData.address}
                    onChange={handleFormChange}
                    placeholder="Enter address"
                  />
                </Form.Group></Col>
            </Row>
            <div className="submitbutton">
              <button type="submit" className="submitbutton_design" disabled={isUpdating}>
                {isUpdating ? "Updating Settings..." : "Update Settings"}
              </button>
            </div>
          </Form>

        </div>
      </div>


      {showMessageModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className={`modal-content ${messageModalContent.type === 'success' ? 'border-success' : messageModalContent.type === 'error' ? '' : ''}`}>
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
                    <Button
                      variant="secondary"
                      onClick={closeCustomMessageModal}
                    >
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

export default WebSetting;
