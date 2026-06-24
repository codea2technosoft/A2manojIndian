import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import Swal from "sweetalert2";

const API_URL = process.env.REACT_APP_API_URL;

function AssignPropertyLeadToSubadmin() {
  const navigate = useNavigate();
  const [subadminId, setSubadminId] = useState("");
  const [associateId, setAssociateId] = useState("");
  const [totalLead, setTotalLead] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [subadmins, setSubadmins] = useState([]);
  const [associates, setAssociates] = useState([]);
  const [leadCount, setLeadCount] = useState(0);
  const [countLoading, setCountLoading] = useState(false);
  const [selectedAssociate, setSelectedAssociate] = useState(null);
  const [selectedSubadmin, setSelectedSubadmin] = useState(null);

  const token = localStorage.getItem("token");

  // Convert associates to react-select format - only name/mobile
  const associateOptions = associates.map(associate => ({
    value: associate.id,
    label: `${associate.username ? associate.username : associate.name} / ${associate.mobile || ''}`
  }));

  // Convert subadmins to react-select format - only email
  const subadminOptions = subadmins.map(subadmin => ({
    value: subadmin.id,
    label: subadmin.email ? subadmin.email : subadmin.name
  }));

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
    const fetchAssociates = async () => {
      try {
        const res = await fetch(`${API_URL}/gift-self-associate-list`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok && data.status === "1") {
          setAssociates(data.data || []);
        } else {
          console.error("Failed to fetch associates:", data.message);
        }
      } catch (err) {
        console.error("Error fetching associates:", err);
      }
    };

    fetchAssociates();
  }, [token]);

  useEffect(() => {
    const fetchLeadCount = async () => {
      setCountLoading(true);
      try {
        const res = await fetch(`${API_URL}/property-lead-list-count-new`, {
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

  const handleSubadminChange = (selectedOption) => {
    if (selectedOption) {
      setSubadminId(selectedOption.value);
      setSelectedSubadmin(selectedOption);
      setAssociateId("");
      setSelectedAssociate(null);
    } else {
      setSubadminId("");
      setSelectedSubadmin(null);
    }
  };

  const handleAssociateChange = (selectedOption) => {
    if (selectedOption) {
      setAssociateId(selectedOption.value);
      setSelectedAssociate(selectedOption);
      setSubadminId("");
      setSelectedSubadmin(null);
    } else {
      setAssociateId("");
      setSelectedAssociate(null);
    }
  };

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

    if (!subadminId && !associateId) {
      tempErrors.selection = "Please select either a Subadmin or an Associate";
    }
    if (!totalLead || parseInt(totalLead) === 0) {
      tempErrors.total_lead = "Please enter total leads to assign";
    } else if (parseInt(totalLead) > leadCount) {
      tempErrors.total_lead = `You can assign up to ${leadCount} leads only`;
    }

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return;
    }

    setLoading(true);
    try {
      let payload = {
        subadminId: subadminId || associateId,
        limit: parseInt(totalLead),
      };

      const response = await fetch(`${API_URL}/property-lead-assign-subadmin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.warn('lead assign', result);

      if (result.status == '0') {
        Swal.fire({
          icon: 'error',
          title: 'Calling Lead Assignment Failed',
          text: result.message || "Sorry, New Leads Available.",
        });
        return;
      }

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: result.message || "Lead assigned successfully!",
        timer: 2000,
        showConfirmButton: false
      });

      setErrors({});
      setSubadminId("");
      setAssociateId("");
      setSelectedAssociate(null);
      setSelectedSubadmin(null);
      setTotalLead("");
      setLeadCount((prev) => prev - parseInt(totalLead));

      setTimeout(() => {
        navigate("/assign-property-lead-to-subadmin");
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
          <h3>Assign Property Lead To Sub Admin / Associate</h3>
        </div>
      </div>
      <div className="card-body">
        <Form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-4 col-12">
              <div className="card card_new_design text-center shadow-sm p-3 mb-3">
                <div className="card-body">
                  <h5 className="card-title text-danger mb-3">Available Pending Property Leads</h5>
                  <p className="card-text text-danger fw-bold count_design">
                    {countLoading ? "Loading..." : leadCount}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-8 col-12">
              <Row>
                {/* Associate Select - Name/Mobile only */}
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formAssociateId">
                    <Form.Label>
                      Select Associate <span className="text-danger">*</span>
                    </Form.Label>
                    <Select
                      options={associateOptions}
                      value={selectedAssociate}
                      onChange={handleAssociateChange}
                      isDisabled={loading || associates.length === 0 || subadminId !== ""}
                      isClearable
                      placeholder="Select an Associate"
                      noOptionsMessage={() => "No associates found"}
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          borderColor: errors.associate_id ? '#dc3545' : base.borderColor,
                          '&:hover': {
                            borderColor: errors.associate_id ? '#dc3545' : base.borderColor,
                          }
                        })
                      }}
                    />
                    {errors.associate_id && (
                      <div className="text-danger mt-1" style={{ fontSize: '0.875rem' }}>
                        {errors.associate_id}
                      </div>
                    )}
                  </Form.Group>
                </Col>

                {/* Subadmin Select - Email only */}
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formSubadminId">
                    <Form.Label>
                      Select Subadmin <span className="text-danger">*</span>
                    </Form.Label>
                    <Select
                      options={subadminOptions}
                      value={selectedSubadmin}
                      onChange={handleSubadminChange}
                      isDisabled={loading || subadmins.length === 0 || associateId !== ""}
                      isClearable
                      placeholder="Select a Subadmin"
                      noOptionsMessage={() => "No subadmins found"}
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          borderColor: errors.subadmin_id ? '#dc3545' : base.borderColor,
                          '&:hover': {
                            borderColor: errors.subadmin_id ? '#dc3545' : base.borderColor,
                          }
                        })
                      }}
                    />
                    {errors.subadmin_id && (
                      <div className="text-danger mt-1" style={{ fontSize: '0.875rem' }}>
                        {errors.subadmin_id}
                      </div>
                    )}
                  </Form.Group>
                </Col>

                {errors.selection && (
                  <div className="col-md-12">
                    <div className="text-danger mb-3">{errors.selection}</div>
                  </div>
                )}

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
                      placeholder="Enter Available Property Lead"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.total_lead}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <div className="col-md-12">
                  <div className="submitbutton mt-3">
                    <Button type="submit" className="submitbutton_design" disabled={loading}>
                      {loading ? "Assigning..." : "Assign"}
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

export default AssignPropertyLeadToSubadmin;