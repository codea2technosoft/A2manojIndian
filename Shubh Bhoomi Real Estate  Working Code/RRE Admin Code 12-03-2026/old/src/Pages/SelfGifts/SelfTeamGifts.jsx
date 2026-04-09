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

  const token = localStorage.getItem("token");

  // useEffect(() => {
  //   const fetchAssociates = async () => {
  //     try {
  //       const res = await fetch(`${API_URL}/gift-self-associate-list`, {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });

  //       const data = await res.json();
  //       if (res.ok && data.status === "1") {
  //         const formatted = (data.data || []).map((a) => ({
  //           value: a.id,
  //           label: a.name ? a.name : a.reffer_id,
  //         }));
  //         setAssociates(formatted);
  //       } else {
  //         console.error("Failed to fetch associates:", data.message);
  //       }
  //     } catch (err) {
  //       console.error("Error fetching associates:", err);
  //     }
  //   };

  //   fetchAssociates();
  // }, [token]);

  // const handlePlotSizeChange = (e) => {
  //   let value = e.target.value;
  //   if (/^\d*$/.test(value)) {
  //     setPlotSize(value);
  //   }
  // };

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
        const formatted = (data.data || []).map((a) => ({
          value: a.id,
          label: a.username && a.mobile 
            ? `${a.username} - ${a.mobile}`
            : a.username 
            ? a.username
            : a.reffer_id || a.id.toString(),
        }));
        setAssociates(formatted);
      } else {
        console.error("Failed to fetch associates:", data.message);
      }
    } catch (err) {
      console.error("Error fetching associates:", err);
    }
  };

  fetchAssociates();
}, [token]);

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
      {/* for multipe ids */}
      // const payload = {
      //   associateIds: associateIds.map((a) => a.value),
      //   buysqrt: parseInt(plotSize),
      // };

      const payload = {
        associateIds: associateIds.length > 0 ? associateIds[0].value : "",
        buysqrt: parseInt(plotSize),
      };



      const response = await fetch(`${API_URL}/gift-team-to-associates`, {
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
        navigate("/team-self-gifts-lists");
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

  return (
    <div className="card mt-2">
      <div className="card-header d-flex align-items-center justify-content-between">
        <div className="titlepage">
          <h3>Assign Team Gifts to Associates</h3>
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
                {/* for multipe ids */}
                {/* <Select
                  isMulti
                  options={associates}
                  value={associateIds}
                  onChange={setAssociateIds}
                  styles={customStyles}
                  placeholder="Select associates..."
                  isDisabled={loading || associates.length === 0}
                /> */}

                <Select
                  options={associates}
                  value={associateIds}
                  onChange={(selected) => setAssociateIds(selected ? [selected] : [])}
                  styles={customStyles}
                  placeholder="Select associate..."
                  isDisabled={loading || associates.length === 0}
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
