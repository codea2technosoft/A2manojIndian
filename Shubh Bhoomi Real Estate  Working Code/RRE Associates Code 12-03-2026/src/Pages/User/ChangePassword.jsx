import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/profile`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        if (response.ok && data.status === "1") {
          setOldPassword(data.data.password); // ✅ fetched from API
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
      }
    };

    fetchProfile();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!password) newErrors.password = "New password is required";
    if (!confirmPassword) newErrors.confirmPassword = "Confirm password is required";
    if (password && confirmPassword && password !== confirmPassword)
      newErrors.confirmPassword = "New Password & Cofirm Password Does Not Match ";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrors({ global: "User not authenticated." });
        return;
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            old_password: oldPassword,
            password,
            confirm_password: confirmPassword,
          }),
        }
      );

      const data = await response.json();
      if (response.ok && data.status === "1") {
        Swal.fire({
          icon: "success",
          title: '<span style="color:#28a745;">Success!</span>',
          html: '<strong>Password changed successfully!</strong>',
          showConfirmButton: false,
          timer: 2000,
          background: '#f9f9f9',
          customClass: {
            popup: 'custom-swal-box',
          },
        }).then(() => {
          navigate("/my-profile");
        });

        setPassword("");
        setConfirmPassword("");
        setErrors({});
      } else {
        setErrors({ global: data.message || "Failed to change password." });
      }
    } catch (err) {
      console.error("Change password error:", err);
      setErrors({ global: "Something went wrong." });
    }
  };

  return (
    <div className="padding_15">
      <div className="row justify-content-center">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <div className="d-flex align-items-center justify-content-between">
                <div className="titlepage">
                  <h3>Change Password</h3>
                </div>
                <div className="backbutton">
                  <Link to='/dashboard'>Back</Link>
                </div>
              </div>
            </div>

            <div className="card-body">
              <Form onSubmit={handleChangePassword}>
                {/* <Form.Group className="mb-3">
            <Form.Label>Old Password</Form.Label>
            <Form.Control
              type="text"
              value={oldPassword}
              readOnly
              className="bg-light text-success fw-bold"
            />
          </Form.Group> */}

                <Form.Group className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    placeholder="Enter new password"
                    onChange={(e) => setPassword(e.target.value)}
                    isInvalid={!!errors.password}
                  />
                  {errors.password && (
                    <Form.Text className="text-danger">{errors.password}</Form.Text>
                  )}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={confirmPassword}
                    placeholder="Confirm new password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    isInvalid={!!errors.confirmPassword}
                  />
                  {errors.confirmPassword && (
                    <Form.Text className="text-danger">{errors.confirmPassword}</Form.Text>
                  )}
                </Form.Group>

                {errors.global && (
                  <div className="text-danger mb-3">{errors.global}</div>
                )}
                <div className="d-flex justify-content-end">
                  <Button type="submit" variant="primary">
                    Change Password
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ChangePassword;
