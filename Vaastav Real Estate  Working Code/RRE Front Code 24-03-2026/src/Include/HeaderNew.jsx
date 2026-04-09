import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GoArrowDownRight } from "react-icons/go";

import {
  FaLocationDot,
  FaPhoneVolume,
  FaRegEnvelope,
  FaAngleDown,
  FaAngleLeft,
  FaUserCircle,
  FaLock
} from 'react-icons/fa';
import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaLinkedinIn,
  FaPinterestP,
  FaYoutube
} from 'react-icons/fa6';
import { BiSolidPhoneCall } from "react-icons/bi";

import Logo from '../assets/images/logo.png';
import userprofile from '../assets/images/userprofile.png';
import './Include.scss';
import { FaRegUserCircle } from "react-icons/fa";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [profilestate, setProfilestate] = useState(false);

  const menuItems = [
    { id: 'Home', title: 'Home', path: '/' },
    {
      id: 'Aboutus',
      title: 'About Us',
      path: '/aboutus',
      icon: <FaAngleDown />,
      // submenu: [
      //   { title: 'About Us', path: '/aboutus' },
      //   { title: 'Why us', path: '/why-us' },
      //   { title: 'Why Choose Us', path: '/why-choose-us' },
      // ]
    },
    { id: 'ourservice', title: 'Our Service', path: '/ourservice' },
    {
      id: 'ourprojects',
      title: 'Our Projects',
      icon: <FaAngleDown />,
      submenu: [
        { title: 'Ongoing Projects', path: '/ongoinproject', icon: <GoArrowDownRight /> },
        { title: 'Upcomming Projects', path: '/upcommingproject', icon: <GoArrowDownRight /> },
        { title: 'Completed Projects', path: '/completeproject', icon: <GoArrowDownRight /> },
      ]
    },
    { id: 'Gallary', title: 'Gallary', path: '/gallery' },
    // { id: 'Download', title: 'Download', path: '/download' },
    { id: 'contact', title: 'Contact Us', path: '/contact-us' }
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSubmenu = (e, index) => {
    if (window.innerWidth <= 992) {
      e.preventDefault();
      setActiveSubmenu(activeSubmenu === index ? null : index);
    }
  };

  const closeAllMenus = () => {
    setIsMenuOpen(false);
    setActiveSubmenu(null);
    setProfilestate(false);
  };

  const handuserprofile = () => {
    setProfilestate(!profilestate);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 992) {
        closeAllMenus();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

   useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(capitalizeWords(storedUsername));
    }

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${process.env.REACT_APP_API_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();
        if (result.status === "1") {
          setKycStatus(result.data.kyc); // 👈 Set KYC status here
        }
      } catch (error) {
        console.error("Profile fetch failed:", error);
      }
    };

    if (localStorage.getItem("isLoggedIn") === "true") {
      fetchProfile();
    }
  }, []);


  return (
    <div className='header_all_site'>
      <div className="top_header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-5 col-lg-9 col-md-6 d-sm-none d-md-block d-none">
              <div className="topslogan">
                <h4>Welcome to Advance Real Estate Solution</h4>
              </div>
            </div>
            <div className="col-xl-7 col-lg-3 col-md-6">
              <div className="top_detail d-flex">
                <ul>
                  <li><FaRegEnvelope /><h4>info@advancerealestate.in</h4></li>
                  <li><BiSolidPhoneCall /><h4>+91 9610500606</h4></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <header className="headerContainer">
          <div className="headerWrapper">
            <Link to="/" className="logo">
              <img src={Logo} alt="Logo" />
            </Link>
            <div
              className={`backdrop ${isMenuOpen ? 'active' : ''}`}
              onClick={closeAllMenus}
            ></div>

            <div className={`mainNav ${isMenuOpen ? 'open' : ''}`}>
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
              <ul className="navList">
                {menuItems.map((item, index) => (
                  <li
                    key={item.id}
                    className={`navItem ${item.submenu ? 'hasDropdown' : ''} ${activeSubmenu === index ? 'active' : ''}`}
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
                          style={activeSubmenu === index ? { maxHeight: '1000px' } : null}
                        >
                          {item.submenu.map((subItem) => (
                            <li key={subItem.path} className="submenuItem">
                              <Link to={subItem.path} className="submenuLink" onClick={closeAllMenus}>
                                {subItem.icon}
                                {subItem.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <Link to={item.path} className="navLink" onClick={closeAllMenus}>
                        {item.title}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
              <div className="header_follow">
                <h4>Follow</h4>
                <div className="social-icons">
                  <Link to="https://www.facebook.com" target="_blank" rel="noreferrer"><FaFacebookF /></Link>
                  <Link to="https://www.instagram.com" target="_blank" rel="noreferrer"><FaInstagram /></Link>
                  <Link to="https://www.pinterest.com" target="_blank" rel="noreferrer"><FaPinterestP /></Link>
                  <Link to="https://www.youtube.com" target="_blank" rel="noreferrer"><FaYoutube /></Link>
                  <Link to="https://www.linkedin.com" target="_blank" rel="noreferrer"><FaLinkedinIn /></Link>
                </div>
              </div>
            </div>
            <div className="d-flex align-items-center gap-3">
              <div className="user_profile_design">
                <div className='userprofile_all'>
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
                </div>
                <div className="mobile-menu-footer">
                  {localStorage.getItem("isLoggedIn") === "true" ? (
                    <>
                      <div className="buttonlogin">
                        <Link
                          to="/profile"
                          className="customerlogin d-flex align-items-center gap-2"
                        >
                          <FaUserCircle /> Profile
                        </Link>
                      </div>
                      <div className="buttonlogin">
                        <Link
                          to="/change-password"
                          className="customerlogin d-flex align-items-center gap-2"
                        >
                          <FaLock /> Change Password
                        </Link>
                      </div>

                      {(kycStatus === "pending" || kycStatus === "reject") && (
                        <div className="buttonlogin">
                          <Link
                            to="/complete-kyc"
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
                        <Link
                          className="customerlogin d-flex align-items-center gap-2"
                          to="/login"
                        >
                          <FaLock /> Associates
                        </Link>
                      </div>
                      <div className="buttonlogin">
                        <Link
                          className="customerlogin d-flex align-items-center gap-2"
                          to="/login"
                        >
                          <FaUsers /> User
                        </Link>
                      </div>
                      <div className="buttonlogin">
                        <Link
                          className="customerlogin d-flex align-items-center gap-2"
                          to="/login"
                        >
                          <GrChannel /> Channel
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <button
                className={`menuToggle ${isMenuOpen ? 'active' : ''}`}
                onClick={toggleMenu}
                aria-label="Toggle menu"
              >
                <span className="toggleLine"></span>
                <span className="toggleLine"></span>
                <span className="toggleLine"></span>
              </button>
            </div>

          </div>


        </header>
      </div>


    </div>
  );
}

export default Header;
