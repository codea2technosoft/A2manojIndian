import React, { useState, useEffect, useRef } from "react";
import CryptoJS from "crypto-js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../assets/scss/Login.scss";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";

function Register({ closeModal }) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        username: "",
        fullname: "",
        password: "",
        phone: "",
        otp: "",
    });

    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [error, setError] = useState("");

    const usernameRef = useRef(null);
    const fullnameRef = useRef(null);
    const passwordRef = useRef(null);
    const phoneRef = useRef(null);
    const otpRef = useRef(null);

    const backendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
    const backendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
    const nodeMode = process.env.NODE_ENV;
    const baseUrl =
        nodeMode === "development" ? backendLocalApiUrl : backendLiveApiUrl;

    /* ===================== TIMER ===================== */
    useEffect(() => {
        if (resendTimer <= 0) return;
        const timer = setInterval(() => {
            setResendTimer((t) => t - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [resendTimer]);

    /* ===================== AUTO FOCUS ===================== */
    useEffect(() => {
        setTimeout(() => {
            if (step === 1) usernameRef.current?.focus();
            if (step === 2) otpRef.current?.focus();
        }, 100);
    }, [step]);

    /* ===================== INPUT ===================== */
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setError("");

        if (name === "phone") {
            setFormData({ ...formData, phone: value.replace(/\D/g, "").slice(0, 10) });
        } else if (name === "otp") {
            setFormData({ ...formData, otp: value.replace(/\D/g, "").slice(0, 4) });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    /* ===================== STEP 1 ===================== */
    const handleNamePasswordSubmit = async (e) => {
        e.preventDefault();

        if (!formData.username.trim()) {
            toast.error("Enter username");
            usernameRef.current.focus();
            return;
        }
        if (!formData.fullname.trim()) {
            toast.error("Enter full name");
            fullnameRef.current.focus();
            return;
        }
        if (!formData.password || formData.password.length < 6) {
            toast.error("Password must be at least 6 characters");
            passwordRef.current.focus();
            return;
        }
        if (formData.phone.length !== 10) {
            toast.error("Enter valid mobile number");
            phoneRef.current.focus();
            return;
        }

        setIsButtonDisabled(true);
        setStep(2); // Pehle step change karo

        // Phir OTP request bhejo (yeh automatically mobile check karega)
        handleRequestOtp(e);
    };

    /* ===================== STEP 2 - REQUEST OTP ===================== */
    const handleRequestOtp = async (e) => {
        if (e && e.preventDefault) {
            e.preventDefault();
        }

        if (formData.phone.length !== 10) {
            toast.error("Enter valid mobile number");
            if (step === 1) phoneRef.current.focus();
            return;
        }

        setIsButtonDisabled(true);

        try {
            const response = await fetch(`${baseUrl}/request-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    phone_number: Number(formData.phone),
                    username: formData.username,
                    fullname: formData.fullname,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success("OTP sent successfully");
                setResendTimer(30);
                setFormData((prev) => ({ ...prev, otp: "" }));
            } else {
                toast.error(data.message || "Failed to send OTP");
                setError(data.message);
                
                // Agar mobile already registered hai to step 1 pe wapas jao
                if (data.message === "Mobile number already registered") {
                    setStep(1); // Wapas step 1 pe
                    phoneRef.current?.focus();
                    setFormData(prev => ({ ...prev, phone: "" })); // Mobile clear karo
                }
            }
        } catch (err) {
            toast.error("Server connection failed");
            setError("Network error");
            setStep(1); // Error hone pe bhi step 1 pe wapas
        } finally {
            setIsButtonDisabled(false);
        }
    };

    /* ===================== STEP 3 - VERIFY OTP ===================== */
    const handleVerifyOtp = async (e) => {
        e.preventDefault();

        if (formData.otp.length !== 4) {
            toast.error("Enter valid OTP");
            otpRef.current.focus();
            return;
        }

        setIsButtonDisabled(true);

        try {
            let browserId = localStorage.getItem("browserId");
            if (!browserId) {
                browserId = CryptoJS.lib.WordArray.random(8).toString();
                localStorage.setItem("browserId", browserId);
            }

            const response = await fetch(`${baseUrl}/verify-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mobile: Number(formData.phone),
                    otp: formData.otp,
                    browserId: browserId,
                    username: formData.username,
                    fullname: formData.fullname,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success("Registration successful");

                localStorage.setItem("accessToken", data.accessToken || "");
                localStorage.setItem("user_mobile", formData.phone);
                localStorage.setItem("user_name", formData.fullname);
                localStorage.setItem("UserName", formData.username);

                setTimeout(() => {
                    closeModal();
                    window.location.reload();
                }, 500);
            } else {
                toast.error(data.message || "Invalid OTP");
                setError(data.message);
                
                // Agar mobile already registered error aaye to step 1 pe wapas
                if (data.message && data.message.includes("already registered")) {
                    setStep(1);
                    phoneRef.current?.focus();
                } else {
                    setFormData((p) => ({ ...p, otp: "" }));
                    otpRef.current.focus();
                }
            }
        } catch (err) {
            toast.error("OTP verification failed");
            setError("Server error");
        } finally {
            setIsButtonDisabled(false);
        }
    };

    /* ===================== RESEND ===================== */
    const handleResendOtp = () => {
        if (resendTimer === 0) {
            handleRequestOtp();
        }
    };

    /* ===================== BACK ===================== */
    const handleBack = () => {
        if (step === 2) setStep(1);
        setResendTimer(0);
        setError("");
        setFormData(prev => ({ ...prev, otp: "" }));
    };

    /* ===================== UI ===================== */
    return (
        <div className="login-container">
            {/* {error && <div className="login-error-box">{error}</div>} */}

            <form
                onSubmit={
                    step === 1
                        ? handleNamePasswordSubmit
                        : step === 2
                            ? handleVerifyOtp
                            : null
                }
            >
                {step === 1 && (
                    <>
                        <FloatingLabel label="Username" className="mb-3">
                            <Form.Control 
                                ref={usernameRef} 
                                name="username" 
                                value={formData.username} 
                                onChange={handleInputChange}
                                disabled={isButtonDisabled}
                            />
                        </FloatingLabel>

                        <FloatingLabel label="Full Name" className="mb-3">
                            <Form.Control 
                                ref={fullnameRef} 
                                name="fullname" 
                                value={formData.fullname} 
                                onChange={handleInputChange}
                                disabled={isButtonDisabled}
                            />
                        </FloatingLabel>

                        <FloatingLabel label="Password" className="mb-3">
                            <Form.Control 
                                ref={passwordRef} 
                                type="password" 
                                name="password" 
                                value={formData.password} 
                                onChange={handleInputChange}
                                disabled={isButtonDisabled}
                            />
                        </FloatingLabel>

                        <FloatingLabel label="Mobile Number" className="mb-3">
                            <Form.Control 
                                ref={phoneRef} 
                                name="phone" 
                                value={formData.phone} 
                                onChange={handleInputChange} 
                                placeholder="Enter 10-digit mobile number"
                                disabled={isButtonDisabled}
                                isInvalid={error && error.includes("already registered")}
                            />
                        </FloatingLabel>
                        
                        {/* {error && error.includes("already registered") && (
                            <div className="text-danger small mb-3">
                                This mobile number is already registered. Please login or use a different number.
                            </div>
                        )} */}
                    </>
                )}

                {step === 2 && (
                    <>
                        <div className="login-phone-display mb-3">
                            <p>OTP sent to: <strong>{formData.phone}</strong></p>
                            <p className="small text-muted">Enter the 4-digit OTP received on your phone</p>
                        </div>

                        <FloatingLabel label="OTP" className="mb-3">
                            <Form.Control 
                                ref={otpRef} 
                                name="otp" 
                                value={formData.otp} 
                                onChange={handleInputChange}
                                disabled={isButtonDisabled}
                            />
                        </FloatingLabel>

                        <div 
                            className={`login-resend ${resendTimer > 0 ? 'disabled' : ''}`} 
                            onClick={handleResendOtp}
                        >
                            {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
                        </div>
                    </>
                )}

                <button 
                    className="login-button" 
                    disabled={isButtonDisabled}
                    type="submit"
                >
                    {isButtonDisabled
                        ? "Processing..."
                        : step === 1
                            ? "Continue"
                            : step === 2
                                ? "Verify & Register"
                                : "Submit"}
                </button>

                {step > 1 && (
                    <button 
                        type="button" 
                        className="login-back-button" 
                        onClick={handleBack}
                        disabled={isButtonDisabled}
                    >
                        ← Back
                    </button>
                )}
            </form>

            <ToastContainer 
                theme="colored"
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
}

export default Register;