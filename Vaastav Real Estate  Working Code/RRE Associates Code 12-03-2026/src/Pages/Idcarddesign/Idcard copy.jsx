import React, { useRef, useState, useEffect } from "react";
import {
  FaBuilding,
  FaCalendarAlt,
  FaEnvelope,
  FaIdBadge,
  FaSignature,
  FaDownload,
  FaBriefcase,
} from "react-icons/fa";
const API_URL = process.env.REACT_APP_API_URL;
const profileImage = `${process.env.REACT_APP_IMAGE_API_URL}/uploads/profile/`;

const Idcard = () => {
  const [errors, setErrors] = useState({});
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const getAuthToken = () => localStorage.getItem("token");

  const [employee] = useState({
    name: "John Doe",
    id: "RE12345",
    designation: "Real Estate Agent",
    company: "Vaastav Real Estate",
    joinDate: "01-Aug-2025",
    email: "john.doe@dreamhomes.com",
    photo: "https://i.pravatar.cc/150?img=12",
  });

  const componentRef = useRef();

  // Custom function to download ID card as image
  const downloadIdCard = () => {
    const cardElement = componentRef.current;

    // Use html2canvas to convert the card to an image
    html2canvas(cardElement, {
      scale: 3, // Higher scale for better quality
      useCORS: true, // To allow cross-origin images
      backgroundColor: null, // Transparent background
    }).then((canvas) => {
      // Convert canvas to data URL
      const imageData = canvas.toDataURL("image/png");

      // Create a temporary link element
      const link = document.createElement("a");
      link.href = imageData;
      link.download = `${employee.name}_ID_Card.png`;

      // Trigger the download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const token = getAuthToken();
      if (!token) return setError("User not logged in");
      const res = await fetch(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.status == "1") {
        setProfile(data.data);
        setImageUrl(data.imagePath);
      } else {
        setError(data.message || "Failed to fetch profile");
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  return (
    <section className="idcard_new_design">
    <div className="card">
      <div className="card-header">
         <div className="d-flex justify-content-between align-items-center">
            <div class="titlepage"><h3>ID Card</h3></div>
            <div class="backbutton"><a href="/" data-discover="true">Back</a></div>
         </div>
      </div>
      <div className="card-body">
          <div className="idcard-container">
        <div className="idcard-card" ref={componentRef}>
          <div className="idcard-content">
            <div className="watermarkdesign">
              <img
                        src={`${process.env.PUBLIC_URL}/assets/images/logo.png`}
                        alt="logo"
                        className="logo-lg"
                      />
            </div>
            <div className="idcard-left-section">
              <div className="idcard-photo-container">
                {profile && profile.profile ? (
                  <img
                    src={`${profileImage}${profile.profile}`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/assets/images/dummy_profile.png";
                    }}
                    alt="Profile"
                    className="rounded-circle profile_designall"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <img
                    src="/assets/images/dummy_profile.png"
                    alt="Profile"
                    className="rounded-circle profile_designall"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                )}
              </div>
              {profile && (
                <>
                  <div className="idcard-employee-info">
                    <h2 className="idcard-name">
                      {profile.username?.charAt(0).toUpperCase() +
                        profile.username?.slice(1)}
                    </h2>
                    <p className="idcard-id">
                      <FaIdBadge className="idcard-icon" /> ID: {profile.mobile}
                    </p>
                  </div>
                  <div className="idcard-logo-container">
                    <div className="idcard-logo">
                      <img
                        src={`${process.env.PUBLIC_URL}/assets/images/logo.png`}
                        alt="logo"
                        className="logo-lg"
                      />
                    </div>
                    <p className="idcard-logo-text">Vaastav Real Estate</p>
                  </div>
                </>
              )}
            </div>
            {profile && (
              <div className="idcard-right-section">
                <div className="idcard-badge">VERIFIED</div>

                <div className="idcard-details-container">
                  <div className="idcard-detail-row">
                    <FaBriefcase className="idcard-icon" />
                    <div className="idcard-detail-text">
                      <div className="idcard-detail-label">Designation</div>
                          <div className="design_name">{profile.designation ? `${profile.designation}` : 'Employee'}</div>
                    </div>
                  </div>

                  <div className="idcard-detail-row">
                    <FaBuilding className="idcard-icon" />
                    <div className="idcard-detail-text">
                      <div className="idcard-detail-label">Company</div>
                      <div className="design_name">{profile.company_name ? `${profile.company_name}` : 'Vaastav Real Estate'}</div>
                    </div>
                  </div>

                  <div className="idcard-detail-row">
                    <FaCalendarAlt className="idcard-icon" />
                    <div className="idcard-detail-text">
                      <div className="idcard-detail-label">Joined</div>
                      <div className="design_name">{profile.date}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="button-card">

       <div className="d-flex justify-content-end">
         <button onClick={downloadIdCard} className="idcard-download-button">
          <FaDownload className="idcard-download-icon" /> Download ID Card
        </button>
        </div>
       </div>

      </div>
      </div>
    </div>
    </section>
  );
};

// HTML2Canvas implementation (simplified version)
const html2canvas = (element, options = {}) => {
  return new Promise((resolve) => {
    const { scale = 1, useCORS = false, backgroundColor = null } = options;

    // Create a canvas element
    const canvas = document.createElement("canvas");
    const rect = element.getBoundingClientRect();

    // Set canvas dimensions
    canvas.width = rect.width * scale;
    canvas.height = rect.height * scale;

    const ctx = canvas.getContext("2d");

    // Apply scaling
    ctx.scale(scale, scale);

    // Set background if provided
    if (backgroundColor) {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Function to render element to canvas
    const renderElement = (el, x = 0, y = 0) => {
      if (el.nodeType === Node.TEXT_NODE) {
        // Render text
        ctx.font = getComputedStyle(el.parentNode).font;
        ctx.fillStyle = getComputedStyle(el.parentNode).color;
        ctx.fillText(
          el.textContent,
          x,
          y + parseInt(getComputedStyle(el.parentNode).fontSize)
        );
      } else if (el.nodeType === Node.ELEMENT_NODE) {
        const style = getComputedStyle(el);

        // Handle specific element types
        if (el.tagName === "IMG" && useCORS) {
          // Create a new image to handle CORS
          const img = new Image();
          img.crossOrigin = "Anonymous";
          img.src = el.src;
          img.onload = () => {
            ctx.drawImage(img, x, y, el.width, el.height);
          };
        } else if (el.tagName === "CANVAS") {
          ctx.drawImage(el, x, y);
        } else {
          // Render background
          if (
            style.backgroundColor &&
            style.backgroundColor !== "rgba(0, 0, 0, 0)"
          ) {
            ctx.fillStyle = style.backgroundColor;
            ctx.fillRect(x, y, el.offsetWidth, el.offsetHeight);
          }

          // Render border
          if (parseInt(style.borderWidth) > 0) {
            ctx.strokeStyle = style.borderColor;
            ctx.lineWidth = parseInt(style.borderWidth);
            ctx.strokeRect(x, y, el.offsetWidth, el.offsetHeight);
          }

          // Recursively render children
          Array.from(el.childNodes).forEach((child, index) => {
            renderElement(child, x, y);
          });
        }
      }
    };

    // Start rendering
    renderElement(element);

    // Return the canvas after a short delay to allow for async operations
    setTimeout(() => resolve(canvas), 100);
  });
};

export default Idcard;
