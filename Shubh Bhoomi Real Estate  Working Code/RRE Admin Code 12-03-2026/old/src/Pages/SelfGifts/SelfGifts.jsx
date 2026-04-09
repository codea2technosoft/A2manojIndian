import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Select from "react-select";

const API_URL = process.env.REACT_APP_API_URL;

function SelfGifts() {
  const navigate = useNavigate();
  const [associateIds, setAssociateIds] = useState([]);
  const [plotSize, setPlotSize] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [associates, setAssociates] = useState([]);
  const [associateOptions, setAssociateOptions] = useState([]); // नया state

  const token = localStorage.getItem("token");

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
          // Original data store करें
          setAssociates(data.data || []);
          
          // Select के लिए formatted options
          const formatted = (data.data || []).map((a) => ({
            value: a.id,
            label: a.username ? `${a.username} - ${a.mobile}` : a.mobile,
            originalData: a // पूरी data store करें
          }));
          setAssociateOptions(formatted);
        } else {
          console.error("Failed to fetch associates:", data.message);
        }
      } catch (err) {
        console.error("Error fetching associates:", err);
      }
    };

    fetchAssociates();
  }, [token]);

  // अगर आप username या name भी show करना चाहते हैं
  // तो इस format का use करें:
  /*
  const formatted = (data.data || []).map((a) => ({
    value: a.id,
    label: `${a.parent_name || a.username || a.reffer_id} (${a.mobile})`,
    originalData: a
  }));
  */

  const handlePlotSizeChange = (e) => {
    let value = e.target.value;

    // sirf numbers allow karo
    if (/^\d*$/.test(value)) {
      // agar empty hai to allow karo
      if (value === "") {
        setPlotSize("");
        return;
      }

      // agar "0" se start hota hai to ignore karo
      if (/^0/.test(value)) {
        return;
      }

      setPlotSize(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let tempErrors = {};
    if (associateIds.length === 0) tempErrors.associateIds = "Please select at least one associate";
    if (!plotSize || parseInt(plotSize) === 0) tempErrors.plot_size = "Please enter plot size in SQYD";

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        associateIds: associateIds.map((a) => a.value),
        buysqrt: parseInt(plotSize),
      };

      const response = await fetch(`${API_URL}/gift-self-to-associates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.warn("assign gifts", result);

      if (result.status === "0") {
        Swal.fire({
          icon: "error",
          title: "Assign Gifts Failed",
          text: result.message || "",
        });
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Success",
        text: result.message || "Assign Gifts Successfully!",
        timer: 2000,
        showConfirmButton: false,
      });

      setErrors({});
      setAssociateIds([]);
      setPlotSize("");

      setTimeout(() => {
        navigate("/gift-self-associate-list");
      }, 2000);
    } catch (err) {
      console.error("Error assigning gifts:", err);
      setErrors({ submit: err.message || "An unexpected error occurred" });
    } finally {
      setLoading(false);
    }
  };

  // custom styles for green color
  const customStyles = {
    control: (base) => ({
      ...base,
      borderColor: errors.associateIds ? "#dc3545" : base.borderColor,
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "green",
      color: "white",
      borderRadius: "8px",
      padding: "2px 6px",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "white",
      fontWeight: "500",
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: "white",
      ":hover": {
        backgroundColor: "darkgreen",
        color: "white",
      },
    }),
  };

  // Optional: अगर आपको और details show करनी हैं तो formatOptionLabel use करें
  const formatOptionLabel = ({ value, label, originalData }) => {
    return (
      <div>
        <div>
          <strong>{originalData?.username || originalData?.reffer_id}</strong>
        </div>
        <div>Mobile: {originalData?.mobile}</div>
        {originalData?.username && <div>Name: {originalData.username}</div>}
      </div>
    );
  };

  return (
    <div className="card mt-2">
      <div className="card-header">
        <div className="d-flex justify-content-between align-items-center">
          <div className="titlepage">
            <h3 className="mb-0">Assign Self Gifts to Associates</h3>
          </div>
        </div>
      </div>

      <div className="card-body">
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3" controlId="formAssociateIds">
                <Form.Label>
                  <strong>Select Associates</strong> <span className="text-danger">*</span>
                </Form.Label>
                <Select
                  isMulti
                  options={associateOptions}
                  value={associateIds}
                  onChange={setAssociateIds}
                  styles={customStyles}
                  // formatOptionLabel={formatOptionLabel} // अगर detailed view चाहिए तो uncomment करें
                  placeholder="Select associates..."
                  isDisabled={loading || associateOptions.length === 0}
                />
                {errors.associateIds && (
                  <div className="invalid-feedback d-block">{errors.associateIds}</div>
                )}
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group className="mb-3" controlId="formPlotSize">
                <Form.Label>
                  <strong>Enter Plot Size in (SQYD)</strong> <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={plotSize}
                  onChange={handlePlotSizeChange}
                  isInvalid={!!errors.plot_size}
                  placeholder="Enter Plot Size in (SQYD) Like 50 "
                />
                <Form.Control.Feedback type="invalid">
                  {errors.plot_size}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={12}>
              <div className="submitbutton mt-3">
                <Button type="submit" className="submitbutton_design" disabled={loading}>
                  {loading ? "Assigning..." : "Gift To Associate"}
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
}

export default SelfGifts;