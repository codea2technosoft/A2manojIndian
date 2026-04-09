import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { RiLockPasswordFill } from "react-icons/ri";
import { AiFillUnlock } from "react-icons/ai";
import { IoMdLock } from "react-icons/io";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState("");

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
          setOldPassword(data.data.password);
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
    if (!confirmPassword)
      newErrors.confirmPassword = "Confirm password is required";
    if (password && confirmPassword && password !== confirmPassword)
      newErrors.confirmPassword =
        "New password and confirm password does not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    const newErrors = {};
    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Submit form
    }
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
          html: "<strong>Password changed successfully!</strong>",
          showConfirmButton: false,
          timer: 2000,
          background: "#f9f9f9",
          customClass: {
            popup: "custom-swal-box",
          },
        }).then(() => {
          navigate("/my-dashboard/profile");
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

  const checkPasswordStrength = (pwd) => {
    let strength = "";

    if (pwd.length < 6) {
      strength = "Weak";
    } else if (
      /[a-z]/.test(pwd) &&
      /[A-Z]/.test(pwd) &&
      /[0-9]/.test(pwd) &&
      /[^A-Za-z0-9]/.test(pwd)
    ) {
      strength = "Strong";
    } else {
      strength = "Medium";
    }

    setPasswordStrength(strength);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    checkPasswordStrength(value);
  };

  return (
    <>
      <div className="card">
        <div className="card-header bg_design_color_header">
          <h3>
            <RiLockPasswordFill />
            Change Password
          </h3>
        </div>
        <div className="card-body">
          <Form onSubmit={handleChangePassword}>
            <div className="form-group profileinputbox">
              <label>New Password</label>
              <div className="inputfield position-relative">
                <div className="icon_all">
                  <AiFillUnlock />
                </div>
                <input
                  type="password"
                  value={password}
                  placeholder="Enter new password Like Abcd@123"
                  onChange={handlePasswordChange}
                  className={`form-control ${
                    errors.password ? "is-invalid" : ""
                  }`}
                />
              </div>

              {/* ✅ Password Strength Message */}
              {password && (
                <small
                  style={{
                    color:
                      passwordStrength === "Strong"
                        ? "green"
                        : passwordStrength === "Medium"
                        ? "orange"
                        : "red",
                    fontWeight: "bold",
                  }}
                >
                  Password Strength: {passwordStrength}
                </small>
              )}

              {errors.password && (
                <Form.Text className="text-danger">{errors.password}</Form.Text>
              )}
            </div>
            <div className="form-group profileinputbox">
              <label>Confirm Password</label>
              <div className="inputfield position-relative">
                <div className="icon_all">
                  <AiFillUnlock />
                </div>
                <input
                  type="password"
                  value={confirmPassword}
                  placeholder="Confirm password Like Abcd@123"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`form-control ${
                    errors.confirmPassword ? "is-invalid" : ""
                  }`}
                />
              </div>
              {errors.confirmPassword && (
                <Form.Text className="text-danger">
                  {errors.confirmPassword}
                </Form.Text>
              )}
            </div>

            {errors.global && (
              <div className="text-danger mb-3">{errors.global}</div>
            )}

            <div className="d-flex justify-content-end">
              <button className="submitbutton">Change Password</button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
