import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";
const API_URL = process.env.REACT_APP_API_URL;

function AssignPropertyLoanLeadToSubadmin() {
  const navigate = useNavigate();
  const [subadminId, setSubadminId] = useState("");
  const [totalLead, setTotalLead] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [subadmins, setSubadmins] = useState([]);
  const [leadCount, setLeadCount] = useState(0);
  const [countLoading, setCountLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchSubadmins = async () => {
      try {
        const res = await fetch(`${API_URL}/subadmin-list`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok && data.status === "1") {
          setSubadmins(data.data || []);
        } else {
          console.error("Failed to fetch subadmins:", data.message);
        }
      } catch (err) {
        console.error("Error fetching subadmins:", err);
      }
    };

    fetchSubadmins();
  }, [token]);

  useEffect(() => {
    const fetchLeadCount = async () => {
      setCountLoading(true);
      try {
        const res = await fetch(`${API_URL}/loan-lead-list-count-new`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok && data.status === "1") {
          setLeadCount(data.total || 0);
        } else {
          console.error("Failed to fetch count:", data.message);
        }
      } catch (err) {
        console.error("Error fetching lead count:", err);
      } finally {
        setCountLoading(false);
      }
    };

    fetchLeadCount();
  }, [token]);

  const handleSubadminChange = (e) => setSubadminId(e.target.value);

  const handleLeadChange = (e) => {
    let value = e.target.value;
    if (/^\d*$/.test(value)) {
      if (parseInt(value) > leadCount) {
        value = leadCount.toString();
      }
      setTotalLead(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let tempErrors = {};

    if (!subadminId) tempErrors.subadmin_id = "Please select a subadmin";
    if (!totalLead || parseInt(totalLead) === 0) tempErrors.total_lead = "Please enter total leads to assign";
    if (parseInt(totalLead) > leadCount) tempErrors.total_lead = `You can assign up to ${leadCount} leads only`;

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return;
    }

    setLoading(true);
    try {
      // JSON payload
      const payload = {
        subadminId,
        limit: parseInt(totalLead),
      };

      const response = await fetch(`${API_URL}/loan-lead-assign-subadmin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // important
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload), // sending as JSON
      });

      const result = await response.json();

      if (!response.ok) {
        setErrors({ submit: result.message || "Failed to assign loan lead" });
        return;
      }

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: result.message || "loan Lead assigned successfully!",
        timer: 2000,        // auto close after 2 seconds
        showConfirmButton: false
      });

      setErrors({});
      setSubadminId("");
      setTotalLead("");
      setLeadCount((prev) => prev - parseInt(totalLead));

      setTimeout(() => {
        navigate("/assign-property-loan-lead-to-subadmin");
      }, 2000);
    } catch (err) {
      console.error("Error assigning lead:", err);
      setErrors({ submit: err.message || "An unexpected error occurred" });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="card mt-2">
      <div className="card-header d-flex align-items-center justify-content-between">
        <div className="titlepage">
          <h3>Assign Property Loan Lead To Sub Admin</h3>
        </div>
      </div>
      <div className="card-body">
        <Form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-4 col-12">
              {/* <div className="mb-3">
                <strong>
                  {countLoading
                    ? "Loading property count..."
                    : `Total Available Pending Property Leads: ${leadCount}`}
                </strong>
              </div> */}
              <div className="card card_new_design text-center shadow-sm p-3 mb-3">
                <div className="card-body">
                  <h5 className="card-title text-danger mb-3">Available Pending Loan Leads</h5>
                  <p className="card-text  text-danger fw-bold count_design">
                    {countLoading ? "Loading..." : leadCount}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-8 col-12">
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3" controlId="formSubadminId">
                    <Form.Label>
                      Select Subadmin <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      as="select"
                      value={subadminId}
                      onChange={handleSubadminChange}
                      isInvalid={!!errors.subadmin_id}
                      disabled={loading || subadmins.length === 0}
                    >
                      <option value="">Select a Subadmin</option>
                      {subadmins.map((sa) => (
                        <option key={sa.id} value={sa.id}>
                          {sa.name ? sa.name : sa.email}
                        </option>
                      ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {errors.subadmin_id}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group className="mb-3" controlId="formTotalLead">
                    <Form.Label>
                      Enter Available Property Lead <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={totalLead}
                      onChange={handleLeadChange}
                      isInvalid={!!errors.total_lead}
                      placeholder="Enter Available Property Lead "
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.total_lead}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <div className="col-md-12">
                  <div className="submitbutton mt-3">
                    <Button type="submit" className="submitbutton_design" disabled={loading}>
                      {loading ? "Assigning..." : "Assign To Sub-Admin"}
                    </Button>
                  </div>
                </div>
              </Row>
            </div>
          </div>
        </Form>
      </div>
    </div>

  );
}

export default AssignPropertyLoanLeadToSubadmin;
