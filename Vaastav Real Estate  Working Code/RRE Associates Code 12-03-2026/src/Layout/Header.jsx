import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { IoIosArrowDown } from "react-icons/io";
import { FiUser } from "react-icons/fi";
import { RiVerifiedBadgeLine, RiLogoutBoxRLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { Form, Button, Alert, Card, Container } from "react-bootstrap";
import Referandearn from "../assets/images/referandearn_icon.png";
import wallet from "../assets/images/wallet.png";
import bell from "../assets/images/bell.png";

const profileImage = `${process.env.REACT_APP_IMAGE_API_URL}/uploads/profile/`;
const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

function Header({ onToggleSidebar }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [name, setName] = useState("");
  const [walletbalance, serWalletbalance] = useState("");
  const [userType, setuserType] = useState("");
  const [kycStatus, setKycStatus] = useState("");
  const [reranumber, setreranumber] = useState("");
  const [profile, setProfile] = useState(null);
  const [imageUrl, setimageUrl] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [siteSettings, setSiteSettings] = useState(null);

  const getAuthToken = () => localStorage.getItem("token");


  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/site-setting`
        );
        const result = await response.json();

        if (result.status === "1") {
          setSiteSettings(result.data);
        } else {
          console.warn("No data found.");
        }
      } catch (error) {
        console.error("Failed to fetch site settings:", error);
      }
    };

    fetchSiteSettings();
  }, []);


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
          const username = data.data.username || "";
          const userType = data.data.user_type || "";
          setProfile(data.data);
          setimageUrl(data.imagePath);
          setName(username.charAt(0).toUpperCase() + username.slice(1));
          setuserType(userType.charAt(0).toUpperCase() + userType.slice(1));
          setKycStatus(data.data.kyc); // ✅ Set kyc status
          setreranumber(data.data.rera_number);
          serWalletbalance(data.data.credit);
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
      }
    };

    fetchProfile();
  }, []);

  const fetchCount = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${REACT_APP_API_URL}/notification-count`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.warn("data notification", data.data);
      setUnreadCount(data.data?.[0]?.unseen_count || 0);
    } catch (err) {
      console.error("Fetch Profile error:", err);
    }
  };

  useEffect(() => {
    fetchCount();
  }, []);


  //////notification Count Via Sockets/////
  useEffect(() => {
    const socket = new WebSocket(process.env.REACT_APP_WS_URL);

    socket.onopen = () => {
      console.log("✅ WebSocket Connected");
      const token = localStorage.getItem("token");
      if (token) {
        socket.send(JSON.stringify({ type: "auth", token }));
      }
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📩 Incoming socket data:", data);

        if (data.event === "receive_message") {
          console.log("🔔 Received Notification:", data);

          if (Array.isArray(data.rows)) {
            setNotifications((prev) => [...data.rows, ...prev]);
          }

          fetchCount();
        }

        if (data.event === "notification_count") {
          console.log("🔢 Updated total count:", data.count);
          setUnreadCount(data.count || 0);
        }
      } catch (err) {
        console.error("Socket parse error:", err);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket Disconnected");
    };

    return () => {
      socket.close();
    };
  }, []);



  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/login";
  };

  // ✅ Badge logic
  const getKycBadge = () => {
    if (kycStatus === "pending" || kycStatus === "reject") {
      return (
        <Link
          to="/complete-kyc"
          className="text-decoration-none ms-2 d-inline-flex align-items-center"
        >
          <span className="kyc-alert-glow">
            {kycStatus === "pending"
              ? "KYC Pending - Click to Complete"
              : "KYC Rejected - Click to Reapply"}
          </span>
        </Link>
      );
    }
    return null;
  };
  const getKycBadgemobile = () => {
    if (kycStatus === "pending" || kycStatus === "reject") {
      return (
        <Link
          to="/complete-kyc"
          className="text-decoration-none d-inline-flex align-items-center"
        >
          <span className="kyc-alert-glow">
            {kycStatus === "pending"
              ? "KYC Pending"
              : "KYC Rejected"}
          </span>
        </Link>
      );
    }
    return null;
  };
  const [panNumber, setPanNumber] = useState("");
  const [adharNumber, setAdharNumber] = useState("");
  const [kycFile, setKycFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validatePan = (pan) =>
    /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan.toUpperCase());
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

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/kyc-complete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Send JSON
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload), // Convert JS object to JSON
        }
      );

      const data = await response.json();

      if (response.ok && data.status === "1") {
        setMessage("✅ KYC submitted successfully.");
        setError("");
        setPanNumber("");
        setAdharNumber("");
        setErrors({});
        setTimeout(() => {
          navigate("/my-profile", { replace: true });
          window.location.reload();
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
  const getReferAndEarnBadge = () => {
    // if ((kycStatus || "").trim().toLowerCase() !== "success") return null;

    return (
      <Link
        to="/reffer-and-earn"
        className="text-decoration-none ms-2 d-inline-flex align-items-center"
      >
        <span className="refer-alert-glow">
          <div className="referandearn_icob">
            <img src={Referandearn} alt="Referandearn" />
          </div>
          <div className="referdetailscontent">
            <p className="card bg-success text-white p-2">
              Share Your Referral Link
              {/* Share Your Referral Link <span>Get Your Link Now!</span> */}
            </p>
          </div>
        </span>
      </Link>
    );
  };
  const yourstatus = () => {
    // if ((kycStatus || "").trim().toLowerCase() !== "success") return null;

    return (
      <Link
        to="#"
        className="text-decoration-none text-dark text-center ms-2 d-inline-flex align-items-center"
      >
        <span
          className={`raranumber px-1 py-1 rounded ${reranumber === null || reranumber === ""
            ? " " // Inactive → red bg
            : " " // Active → green bg
            }`}
        >
          {reranumber === null || reranumber === "" ? (
            <h3 className="mb-0 fw-normal statusfont">
              Your Status  <span className="d-block text-danger">Inactive</span>
            </h3>
          ) : (
            <h3 className="mb-0 fw-normal statusfont">
              Your Status <span className="d-block text-success">Active</span>
            </h3>
          )}</span>

      </Link>


    );
  };
  useEffect(() => {
    if (kycStatus === "pending" || kycStatus === "reject") {
      setShowModal(true);
    }
  }, [kycStatus]);

  //   const getKycBadge = () => {
  //   if (kycStatus === "pending" || kycStatus === "reject") {
  //     return (
  //       <>
  //         <Link
  //           to="#"
  //           onClick={() => setShowModal(true)} // open modal on click
  //           className="text-decoration-none ms-2 d-inline-flex align-items-center"
  //         >
  //           <span className="kyc-alert-glow">
  //             {kycStatus === "pending"
  //               ? "KYC Pending - Click to Complete The KYC"
  //               : "KYC Rejected - Click to Reapply The KYC"}
  //           </span>
  //         </Link>

  //         {showModal && (
  //           <>
  //             <div className="overlay_design" onClick={() => setShowModal(false)}></div>
  //             <div className="custom-modal editprofile_modal">
  //               <div className="modal-content">
  //                 <div className="card">
  //                   <div className="card-header">Complete KYC</div>
  //                   <div className="card-body">
  //                     {/* Your KYC form here */}
  //                   </div>
  //                   <div className="card-footer text-end">
  //                     <button
  //                       className="btn btn-secondary"
  //                       onClick={() => setShowModal(false)}
  //                     >
  //                       Close
  //                     </button>
  //                   </div>
  //                 </div>
  //               </div>
  //             </div>
  //           </>
  //         )}
  //       </>
  //     );
  //   }
  //   return null;
  // };

  return (
    <>
      <div className="header" id="header">
        <div className="d-flex justify-content-between px-2 w-100">
          <div className="logo-box d-xl-none d-md-none d-sm-block">
            <Link className="logo-light" to="/dashboard">
              <img
                src={`${process.env.PUBLIC_URL}/assets/images/logo.png`}
                alt="logo"
                className="logo-lg"
              />
            </Link>
          </div>
          <div className="d-flex align-items-center gap-2">
            <div className="d-xl-block d-md-block d-sm-none d-none">
              <div className="togglebutton">
                <AiOutlineMenu onClick={onToggleSidebar} />
              </div>
            </div>
            <div className="desktop-show">
              <div className="d-flex align-items-center flex-wrap gap-2">
                {/* {getKycBadge()} */}
                {getReferAndEarnBadge()}
                {yourstatus()}

                <div className="wallet">
                  <div className="">
                    <div className="credit_amount">
                      <Link
                        to="/user-wallet-report"
                        className="gap-2 wallet-link d-flex align-items-center text-decoration-none"
                      >
                        <div className="walletimage">
                          <img src={wallet} alt="wallet" />
                        </div>
                        <div className="text-dark">
                          <div className="referdetailscontent text-center">
                            <p className="mb-1">Wallet Amount</p>
                            <h3 className="m-0 fw-normal text-success">
                              ₹&nbsp;
                              {walletbalance
                                ? Number(walletbalance).toLocaleString("en-IN")
                                : "0"}
                            </h3>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>


          <div className="linksmode">
            <div className="notify">
              <Link to="/notification-list" className="wallet mw-auto">
                <div className="d-flex gap-2 align-items-center">
                  <div className="walletimage position-relative">
                    <img src={bell} alt="wallet" />
                    <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {unreadCount}
                      <span class="visually-hidden">unread messages</span>
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            <div className="profilie" ref={dropdownRef}>
              <div className="profile-header" onClick={toggleDropdown}>
                <div className="name desktop_device">
                  <div className="d-flex gap-1">
                    Welcome :{" "}
                    <span className="namedesign"> {String(name || "").length > 18
                      ? String(name).substring(0, 18) + "..."
                      : String(name || "")}</span>
                  </div>
                  <span>
                    ({userType}
                    {userType?.toLowerCase() === "channel" ? " Partner" : ""})
                  </span>
                </div>

                <div className="profileimage">
                  {/* <img
                  src={`${process.env.PUBLIC_URL}/assets/images/avatar-1.jpg`}
                  alt="Avatar"
                /> */}

                  {profile && profile.profile ? (
                    <img
                      src={`${profileImage}${profile.profile}`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/assets/images/dummy_profile.png";
                      }}
                      alt="Profile"
                      className="rounded-circle"
                    />
                  ) : (
                    <img
                      src="/assets/images/dummy_profile.png"
                      alt="Profile"
                      className="rounded-circle"
                    />
                  )}
                </div>

                <div
                  className={`arrowprofile transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""
                    }`}
                >
                  <IoIosArrowDown />
                </div>
              </div>

              {dropdownOpen && (
                <div className="profile-dropdown">
                  {/* Mobile Device View */}
                  <div className="dropdown-item mobile_device">
                    <div className="d-flex gap-2 align-items-center">
                      <div className="profileimage">
                        <img
                          src={`${process.env.PUBLIC_URL}/assets/images/avatar-1.jpg`}
                          alt="Avatar"
                        />
                      </div>
                      <div className="name">
                        {name}&nbsp; &nbsp;({userType})
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/my-profile"
                    className="dropdown-item flex items-center gap-2"
                  >
                    <FiUser /> Profile
                  </Link>

                  <Link
                    to="/id-card"
                    className="dropdown-item flex items-center gap-2"
                  >
                    <FiUser /> Download ID Card
                  </Link>
                  {/* <Link
                  to="/complete-kyc"
                  className="dropdown-item flex items-center gap-2"
                >
                  <RiVerifiedBadgeLine /> KYC
                </Link> */}

                  {(kycStatus === "pending" || kycStatus === "reject") && (
                    <Link
                      to="/complete-kyc"
                      className="dropdown-item flex items-center gap-2"
                    >
                      <RiVerifiedBadgeLine /> KYC
                    </Link>
                  )}

                  <Link
                    to="/chnage-password"
                    className="dropdown-item flex items-center gap-2"
                  >
                    <FiUser /> Change Password
                  </Link>

                  <div
                    className="dropdown-item flex items-center gap-2"
                    style={{ color: "red", fontWeight: "500" }}
                    onClick={handleLogout}
                  >
                    <RiLogoutBoxRLine /> Logout
                  </div>
                </div>
              )}
            </div>

            <div className="d-xl-none d-md-none d-sm-block">
              <div className="togglebutton">
                <AiOutlineMenu onClick={onToggleSidebar} />
              </div>
            </div>
          </div>
        </div>

        <div className="mobile_show">
          <div className="d-flex align-items-center flex-wrap gap-2">
            {getKycBadgemobile()}
            {getReferAndEarnBadge()}
            <div className="wallet">
              <div>
                <div className="credit_amount">
                  <Link
                    to="/user-wallet-report"
                    className="wallet-link d-flex align-items-center text-decoration-none"
                  >
                    <div className="walletimage">
                      <img src={wallet} alt="wallet" />
                    </div>


                    <div className="text-dark">
                      <div className="referdetailscontent text-center">
                        <p className="mb-1 fw-semibold">Wallet Amount</p>
                        <h3 className="m-0 fw-bold text-success">
                          ₹&nbsp;
                          {walletbalance
                            ? Number(walletbalance).toLocaleString("en-IN")
                            : "0"}
                        </h3>
                      </div>
                    </div>
                  </Link>
                </div>


              </div>
            </div>
          </div>
        </div>

        <marquee className="header_marquee">{siteSettings?.rre_screen_message
                }</marquee>

      </div>
      {/* {showModal && (
        <>
          <div className="overlay_design"></div>
          <div className="custom-modal editprofile_modal">
            <div className="modal-content">
              <div className="card">
                <div className="card-header">Complete KYC</div>
                <div className="card-body">
                  <Card
                    className="shadow-sm border-0 p-4 mx-auto"
                    style={{ maxWidth: "600px" }}
                  >
                    <Form
                      onSubmit={handleKycSubmit}
                      encType="multipart/form-data"
                    >
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

                      {error && <Alert variant="danger">{error}</Alert>}
                      {message && <Alert variant="success">{message}</Alert>}

                      <Button type="submit" variant="success" className="w-100">
                        Submit KYC
                      </Button>
                    </Form>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </>
      )} */}
    </>
  );
}

export default Header;
