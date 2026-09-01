import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaUsers, FaLock, FaUserCircle } from "react-icons/fa";
import { GrAnnounce } from "react-icons/gr";
import logo from "../assets/images/logo.png";

import {
  FaRegEnvelope,
  FaAngleDown,
  FaInstagram,
  FaFacebookF,
  FaPinterestP,
  FaYoutube,
  FaLinkedinIn,
} from "react-icons/fa6";
import { BiLogOut, BiSolidPhoneCall } from "react-icons/bi";

import Logo from "../assets/images/logo.png";
import userimage from "../assets/images/userimage.png";
import "./Include.scss";
import { GoArrowDownRight } from "react-icons/go";

function Header() {
  const [imageUrl, setimageUrl] = useState("");
  const profileImage = `${process.env.REACT_APP_IMAGE_API_URL}/uploads/profile/`;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [username, setUsername] = useState("");
  const [kycStatus, setKycStatus] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState("");
  const [userType, setuserType] = useState("");

  const location = useLocation();

  useEffect(() => {
    const loginStatus = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loginStatus);
  }, []);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
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
          },
        );

        const data = await response.json();

        if (response.ok && data.status == "1") {
          const username = data.data.username || "";
          const userType = data.data.user_type || "";
          setimageUrl(data.imagePath);
          setProfile(data.data);
          setName(username.charAt(0).toUpperCase() + username.slice(1));
          setuserType(userType.charAt(0).toUpperCase() + userType.slice(1));
          setKycStatus(data.data.kyc); // ✅ Set kyc status
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
      }
    };

    fetchProfile();
  }, []);
  const menuItems = [
    { id: "Home", title: "Home", path: "/" },
    // {
    //   id: "Company",
    //   title: "Company",
    //   icon: <FaAngleDown />,
    //   submenu: [
    //     { title: "About Us", path: "/aboutus" },
    //     { title: "Why us", path: "/why-us" },
    //     { title: "Why Choose Us", path: "/why-choose-us" },
    //   ],
    // },
    { id: "AboutUs", title: "About Us", path: "/aboutus" },
    { id: "ourservice", title: "Our Service", path: "/ourservice" },
    {
      id: "ourprojects",
      title: "Our Projects",
      icon: <FaAngleDown />,
      submenu: [
        {
          title: "Ongoing Projects",
          path: "/ongoinproject",
          icon: <GoArrowDownRight />,
        },
        {
          title: "Completed Projects",
          path: "/completeproject",
          icon: <GoArrowDownRight />,
        },
      ],
    },
    // {
    //   id: "DocumentsDownload",
    //   title: "Download Documents",
    //   path: "/download-official-documents",
    //   icon: <FaAngleDown />,
    //   submenu: [
    //     {
    //       title: "Download Offcial Documents",
    //       path: "/download-official-documents",
    //       icon: <GoArrowDownRight />,
    //     },
    //     {
    //       title: "Download RRE Plans",
    //       path: "/download-rre-plans",
    //       icon: <GoArrowDownRight />,
    //     },
    //     {
    //       title: "Marketting Partners Rules",
    //       path: "/marketingpartmner_rule",
    //       icon: <GoArrowDownRight />,
    //     },
    //     {
    //       title: "Booking Form",
    //       path: "/booking_form",
    //       icon: <GoArrowDownRight />,
    //     },
    //   ],
    // },
    {
      id: "DocumentsDownload",
      title: "Download Documents",
      path: "/download-official-documents",
    },

    { id: "Gallary", title: "Gallary", path: "/gallery" },
    { id: "contact", title: "Contact", path: "/contact-us" },
    // { id: "contact", title: "Become Channel Partner", path: "/contact-us" },
    // { id: "downloaddocumentnew", title: "Documents Download", path: "/download-official-documents" },
    // { id: "upload_rre_plans_pdf", title: "Download Plans", path: "/download-rre-plans" },
    // {
    //   id: "downloaddocument",
    //   title: "Download Documents",
    //   path: pdf,
    //   download: true,
    //   classdesign: "pdfclass navLink",
    // },

    // { id: "UserDashboard", title: "My Dashboard", path: "/my-dashboard/profile" }
    ...(isLoggedIn
      ? [
          {
            id: "UserDashboard",
            title: "My Dashboard",
            path: "/my-dashboard/profile",
          },
        ]
      : []),
  ];

  const toggleSubmenu = (e, index) => {
    if (window.innerWidth <= 992) {
      e.preventDefault();
      setActiveSubmenu(activeSubmenu === index ? null : index);
    }
  };

  const closeAllMenus = () => {
    setIsMenuOpen(false);
    setActiveSubmenu(null);
  };

  const capitalizeWords = (str) => {
    if (!str) return "";
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userMobile");
    window.location.href = "/login";
  };

  // useEffect(() => {
  //   const storedUsername = localStorage.getItem("username");
  //   if (storedUsername) {
  //     setUsername(capitalizeWords(storedUsername));
  //   }

  //   const fetchProfile = async () => {
  //     try {
  //       const token = localStorage.getItem("token");
  //       const response = await fetch(
  //         `${process.env.REACT_APP_API_URL}/profile`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );

  //       const result = await response.json();
  //       if (result.status === "1") {
  //         setKycStatus(result.data.kyc); // 👈 Set KYC status here
  //           setProfile(data.data);
  //       }
  //     } catch (error) {
  //       console.error("Profile fetch failed:", error);
  //     }
  //   };

  //   if (localStorage.getItem("isLoggedIn") === "true") {
  //     fetchProfile();
  //   }
  // }, []);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(capitalizeWords(storedUsername));
    }

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const result = await response.json();
        if (result.status === "1") {
          setKycStatus(result.data.kyc); // ✅ Set KYC status
          setProfile(result.data); // ✅ Fix: result.data not data.data
        }
      } catch (error) {
        console.error("Profile fetch failed:", error);
      }
    };

    if (localStorage.getItem("isLoggedIn") === "true") {
      fetchProfile(); // ✅ only call if logged in
    }
  }, []);

  const [siteSettings, setSiteSettings] = useState(null);

  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/site-setting`,
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

  if (!siteSettings) {
    return (
      <div className="loading-screen">
        <div className="loaderimage">
          <img src={logo} alt="logo" className="logo-lg" />
        </div>
      </div>
    ); // Optional loader; // Optional loader
  }

  return (
    <div className="header_all_site">
      <div className="top_header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-8 col-lg-8 col-md-8 d-sm-none d-md-block d-none">
              <div className="topslogan">
                <GrAnnounce />
                <div className="header_marquee">
                  <div className="marquee_text">
                    {siteSettings?.rre_screen_message}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-4">
              <div className="top_detail d-flex">
                <ul>
                  <li>
                    <FaRegEnvelope />
                    <h4>{siteSettings?.email_id}</h4>
                  </li>
                  <li>
                    <BiSolidPhoneCall />
                    <h4>
                      {" "}
                      {siteSettings?.mobile_number
                        ? `+91 - ${siteSettings.mobile_number.replace(
                            /^(\+91|91|0|\-)/g,
                            "",
                          )}`
                        : "+91 - 9999999999"}
                    </h4>
                  </li>
                  {/* <li className="mobile_none">
                    <a href={pdf} download className="downloaddoument">
                      <FaFilePdf />
                      Download Doucment
                    </a>
                  </li> */}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <header className="headerContainer">
        <div className="container">
          <div className="headerWrapper">
            <Link to="/" className="logo">
              <img src={Logo} alt="Logo" />
            </Link>

            <div
              className={`backdrop ${isMenuOpen ? "active" : ""}`}
              onClick={closeAllMenus}
            ></div>

            <div className={`mainNav ${isMenuOpen ? "open" : ""}`}>
              <div className="d-flex justify-content-between align-items-center padding_all_left_right">
                <div className="mobile-sidebar-logo">
                  <Link to="/">
                    <img src={Logo} alt="Logo" />
                  </Link>
                </div>
                <button
                  className="mobile-sidebar-close"
                  onClick={closeAllMenus}
                  aria-label="Close menu"
                >
                  &times;
                </button>
              </div>
              {/* <ul className="navList">
                {menuItems.map((item, index) => (
        
                  <li
                    key={item.id}
                    className={`navItem ${item.submenu ? "hasDropdown" : ""} ${
                      activeSubmenu === index ? "active" : ""
                    }`}
                  >
                    {item.submenu ? (
                      <>
                        <button
                          className="navLink withDropdown"
                          onClick={(e) => toggleSubmenu(e, index)}
                        >
                          {item.title}
                          {item.icon}
                        </button>
                        <ul
                          className="submenuList"
                          style={
                            activeSubmenu === index
                              ? { maxHeight: "1000px" }
                              : null
                          }
                        >
                          {item.submenu.map((subItem) => (
                            <li key={subItem.path} className="submenuItem">
                              <Link
                                to={subItem.path}
                                className="submenuLink"
                                onClick={closeAllMenus}
                              >
                                {subItem.icon}
                                {subItem.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <Link
                        to={item.path}
                        className="navLink"
                        onClick={closeAllMenus}
                      >
                        {item.title}
                      </Link>
                    )}
                  </li>
                ))}
              </ul> */}
              <ul className="navList">
                {menuItems.map((item, index) =>
                  item.id === "downloaddocument" ? (
                    // You can skip or use custom <li> here
                    <li key={item.id} className="navItem customDownloadItem">
                      <a
                        href={item.path}
                        className={item.classdesign}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.title}
                      </a>
                    </li>
                  ) : (
                    <li
                      key={item.id}
                      className={`navItem ${
                        item.submenu ? "hasDropdown" : ""
                      } ${activeSubmenu === index ? "active" : ""}`}
                    >
                      {item.download ? (
                        <a
                          href={item.path}
                          className={item.classdesign}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {item.title}
                        </a>
                      ) : item.submenu ? (
                        <>
                          <button
                            className="navLink withDropdown"
                            onClick={(e) => toggleSubmenu(e, index)}
                          >
                            {item.title}
                            {item.icon}
                          </button>
                          <ul
                            className="submenuList"
                            style={
                              activeSubmenu === index
                                ? { maxHeight: "1000px" }
                                : null
                            }
                          >
                            {item.submenu.map((subItem) => (
                              <li key={subItem.path} className="submenuItem">
                                <Link
                                  to={subItem.path}
                                  className="submenuLink"
                                  onClick={closeAllMenus}
                                >
                                  {subItem.icon}
                                  {subItem.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </>
                      ) : (
                        <Link
                          to={item.path}
                          className={`navLink ${location.pathname === item.path ? "active" : ""}`}
                          onClick={closeAllMenus}
                        >
                          {item.title}
                        </Link>
                      )}
                    </li>
                  ),
                )}
              </ul>

              <div className="header_follow">
                <h4>Follow</h4>
                <div className="social-icons">
                  <Link
                    to="https://www.facebook.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FaFacebookF />
                  </Link>
                  <Link
                    to="https://www.instagram.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FaInstagram />
                  </Link>
                  <Link
                    to="https://www.pinterest.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FaPinterestP />
                  </Link>
                  <Link
                    to="https://www.youtube.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FaYoutube />
                  </Link>
                  <Link
                    to="https://www.linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FaLinkedinIn />
                  </Link>
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-3">
              <div className="user_profile_design">
                {/* <div className="userprofile_all">
                  <FaRegUserCircle />
                  <div className="logincontent">
                    {username ? (
                      <p>
                        Hello, <span>{username}</span>
                      </p>
                    ) : (
                      <p>
                        Sign In <span>account</span>
                      </p>
                    )}
                  </div>
                </div> */}

                <div className="userprofile_all d-flex align-items-center gap-2">
                  <div className="logincontent">
                    {username ? (
                      <p style={{ margin: 0 }}>
                        Welcome :
                        <br />
                        <span
                          style={{
                            display: "inline-block",
                            marginLeft: "16px",
                            fontWeight: "bold",
                            color: "#078ac8",
                          }}
                        >
                          {username}
                        </span>
                      </p>
                    ) : (
                      <p style={{ margin: 0 }}>
                        Sign In <span>account</span>
                      </p>
                    )}
                  </div>

                  {/* <img
                    // src={
                    //   profile?.profile
                    //     ? profile.profile.includes("http")
                    //       ? profile.profile
                    //       : `${process.env.REACT_APP_API_URL}/${profile.profile}`
                    //     : "/public/icons/dummy_profile.png"
                    // }
                    src={
  profile?.profile
    ? typeof profile.profile === "string" && profile.profile.includes("http")
      ? profile.profile
      : `${process.env.REACT_APP_API_URL}/${profile.profile}`
    : "/public/icons/dummy_profile.png" 

}

                    alt="Profile"
                    className="img-fluid avater"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/public/icons/dummy_profile.png";
                    }}
                  /> */}
                  {profile?.profile &&
                  profile.profile !== "null" &&
                  profile.profile !== "undefined" ? (
                    <div className="image_all">
                      <img
                        src={`${profileImage}${profile.profile}`}
                        alt="Profile"
                        className="rounded-circle"
                      />
                    </div>
                  ) : (
                    <div className="image_all">
                      <img
                        src={userimage}
                        alt="Profile"
                        className="rounded-circle"
                      />
                    </div>
                  )}
                </div>

                <div className="mobile-menu-footer">
                  {localStorage.getItem("isLoggedIn") === "true" ? (
                    <>
                      <div className="buttonlogin">
                        <Link
                          to="/my-dashboard/profile"
                          className="customerlogin d-flex align-items-center gap-2"
                        >
                          <FaUserCircle /> Profile
                        </Link>
                      </div>
                      <div className="buttonlogin">
                        <Link
                          to="/my-dashboard/change-password"
                          className="customerlogin d-flex align-items-center gap-2"
                        >
                          <FaLock /> Change Password
                        </Link>
                      </div>

                      {(kycStatus === "pending" || kycStatus === "reject") && (
                        <div className="buttonlogin">
                          <Link
                            to="/my-dashboard/complete-kyc"
                            className="customerlogin d-flex align-items-center gap-2"
                          >
                            <FaUsers /> KYC
                          </Link>
                        </div>
                      )}

                      <div className="buttonlogin">
                        <Link
                          onClick={handleLogout}
                          className="customerlogin d-flex align-items-center gap-2 text-danger"
                        >
                          <BiLogOut /> Logout
                        </Link>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="buttonlogin">
                        {/* <Link
                          className="customerlogin d-flex align-items-center gap-2"
                          to="https://dashboard.rajasthanirealestates.in/login" target="__blank"
                        >
                          <FaLock /> Associates
                        </Link> */}
                        {/* <a
                          className="customerlogin d-flex align-items-center gap-2"
                          href={`https://dashboard.rajasthanirealestates.in/login`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaLock /> Associates
                        </a>*/}

                        <a
                          className="customerlogin d-flex align-items-center gap-2"
                          href={process.env.REACT_APP_dashboardLogin_API_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaLock /> Associates
                        </a>

                        {/* </div>
                      <div className="buttonlogin">
                        <Link
                          className="customerlogin d-flex align-items-center gap-2"
                          to="/login"
                        >
                          <FaUsers /> Customer
                        </Link>
                      </div> */}
                      </div>
                      <div className="buttonlogin">
                        <a
                          className="customerlogin d-flex align-items-center gap-2"
                          href={process.env.REACT_APP_FrontLogin_API_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaUsers /> Customer
                        </a>
                      </div>

                      {/* <div className="buttonlogin">
                          <a
                            className="customerlogin d-flex align-items-center gap-2"
                            href="http://localhost:3000/login"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FaUsers /> Customer
                          </a>
                        </div>*/}

                      {/* 
                      <div className="buttonlogin">
                        <a
                          className="customerlogin d-flex align-items-center gap-2"
                          href={`https://dashboard.rajasthanirealestates.in/login`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <GrChannel /> Channel Partner
                        </a>
                      </div> */}

                      {/* <div className="buttonlogin">
                      <a
                        className="customerlogin d-flex align-items-center gap-2"
                        href={process.env.REACT_APP_dashboardLogin_API_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <GrChannel /> Channel Partner
                      </a>
                    </div>*/}
                    </>
                  )}
                </div>
              </div>

              <button
                className={`menuToggle ${isMenuOpen ? "active" : ""}`}
                onClick={toggleMenu}
                aria-label="Toggle menu"
              >
                <span className="toggleLine"></span>
                <span className="toggleLine"></span>
                <span className="toggleLine"></span>
              </button>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Header;
