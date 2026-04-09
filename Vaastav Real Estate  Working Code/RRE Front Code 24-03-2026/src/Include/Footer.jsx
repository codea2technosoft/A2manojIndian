import React, { useState, useEffect } from "react";
import {
  MdFacebook,
  MdInstagram,
  MdShare,
  MdBusiness,
  MdArrowForward,
  MdLocationPin,
  MdPhone,
  MdEmail,
  MdSend,
} from "react-icons/md";
import {
  FaFacebookF,
  FaInstagram,
  FaPinterestP,
  FaYoutube,
  FaLinkedinIn,
} from "react-icons/fa";
import { FaTelegramPlane } from "react-icons/fa";
import facebook from '../assets/images/facebook.png'
import instragram from '../assets/images/instrgram.png'
import linkdin from '../assets/images/linkdin.png'
import location from '../assets/images/location.png'
import telegram from '../assets/images/telegram.png'
import zoom from '../assets/images/zoom.png'
import youtube from '../assets/images/youtube.png'
import { FaHeadphones } from "react-icons/fa";
import { MdMessage } from "react-icons/md";
import { FaPhoneVolume } from "react-icons/fa6";
import mapImage from "../assets/images/map.png";
import logoImage from "../assets/images/logo.png";
import call from "../assets/images/call.png";
import ios from "../assets/images/appstore.png";
import googleplaystore from "../assets/images/googleplaystore.png";
import qrcode from "../assets/images/qrcode.jpg";
import whatsapp from "../assets/images/whatsapplogo.png";
import { Link } from "react-router-dom";

const Footer = () => {
  const [siteSettings, setSiteSettings] = useState(null);

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

  if (!siteSettings) {
    return <div className="loading-screen">
      <div className="loaderimage">
        <img
          src={logoImage}
          alt="logo"
          className="logo-lg"
        />
      </div>
    </div>; // Optional loader
  }


  const socialMedia = [
    {
      link:
        siteSettings?.facebook_link?.trim() !== ""
          ? siteSettings.facebook_link
          : "https://www.facebook.com",
      icon: <MdFacebook />,
    },
    {
      link:
        siteSettings?.insta_link?.trim() !== ""
          ? siteSettings.insta_link
          : "https://www.instagram.com",
      icon: <FaInstagram />,
    },
    {
      link:
        siteSettings?.youtube_link?.trim() !== ""
          ? siteSettings.youtube_link
          : "https://www.youtube.com",
      icon: <FaYoutube />,
    },
    {
      link:
        siteSettings?.linkedin_link?.trim() !== ""
          ? siteSettings.linkedin_link
          : "https://www.linkedin.com",
      icon: <FaLinkedinIn className="text-white" />,
    },
  ];

  const exploreLinks = [
    { text: "Home", link: "/" },
    { text: "About", link: "aboutus" },
    { text: "Gallery", link: "gallery" },
    { text: "Contact", link: "contact-us" },
    { text: "Our Services", link: "ourservice" },
    { text: "On Going Project", link: "ongoinproject" },
    { text: "Complete Project", link: "completeproject" },
  ];

  const contactInfo = [
    {
      icon: <MdLocationPin />,
      content: (
        <a href="#" onClick={(e) => e.preventDefault()}>
          {siteSettings?.address ||
            "USA Office: 64-15 Cooper Ave 64-15 Cooper Ave"}
        </a>
      ),
    },
    {
      icon: <MdPhone />,
      content: (
        <>
          <a
            href={
              siteSettings?.support1_number
                ? `tel:+91${siteSettings.support1_number.replace(
                  /^(\+91|91|0|\-)/g,
                  ""
                )}`
                : "tel:+919999999999"
            }
          >
            {siteSettings?.support1_number
              ? `+91 - ${siteSettings.support1_number.replace(
                /^(\+91|91|0|\-)/g,
                ""
              )}`
              : "+91 - 9999999999"}
          </a>
          <br />

          <a
            href={`tel:+91${siteSettings?.mobile_number?.replace(/^(\+91|91|0|\-)/g, "") ||
              "9999999999"
              }`}
          >
            {siteSettings?.mobile_number
              ? `+91 - ${siteSettings.mobile_number.replace(
                /^(\+91|91|0|\-)/g,
                ""
              )}`
              : "+91 - 9999999999"}
          </a>
        </>
      ),
    },
    {
      icon: <MdEmail />,
      content: (
        <>
          <a
            href={
              `mailto:${siteSettings?.email_id}` || "mailto:info@thehouse.com"
            }
          >
            {siteSettings?.email_id || "info@thehouse.com"}
          </a>
          <br />
        </>
      ),
    },
  ];

  return (
    <div className="footer_all_design">
      <footer className="pt-75">
        <img src={mapImage} alt="background" className="mil-footer-bg" />
        <div className="container">
          <div
            className="mil-deco mil-deco-accent"
            style={{ top: 0, right: "0%" }}
          ></div>
          <div className="row">
            <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
              <div className="footer_first">
                <div className="footer_logo">
                  <div>
                    <img src={logoImage} className="img-fluid" alt="logo" />
                  </div>
                </div>
                <p>
                  It is a company for having scope of providing services to carry on the business of buying, construction, development, advertising, marketing of any real estates projects, lands, villas, houses, flats, apartments, offices, bungalows, farm houses, resorts, other properties, etc..
                </p>

              </div>
            </div>
            <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 mt-5 mt-sm-0">
              <div className="footer_explore">
                <div className="title_style">
                  <h5 className="main_subheading text-white">
                    <span></span>EXPLORE
                  </h5>
                </div>
                <ul>
                  {exploreLinks.map((item, index) => (
                    <li key={index}>
                      <a href={item.link}>
                        <MdArrowForward /> {item.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 mt-5 mt-lg-0">
              <div className="footer_contact">
                <div className="title_style">
                  <h5 className="main_subheading text-white">
                    <span></span>CONTACT
                  </h5>
                </div>
                {/* Updated contact info */}
                {contactInfo.map((item, index) => (
                  <div key={index} className="footer_contact_wrapper">
                    <div className="icon_location">
                      {item.icon}
                    </div>
                    <div className="footer_contact_info">{item.content}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 mt-5 mt-lg-0">
              <div className="footer_news">
                <div className="title_style">
                  <h5 className="main_subheading text-white">
                    <span></span>EXPERIENCE HOUSING APP ON MOBILE
                  </h5>
                </div>
              </div>
              <div className="footer__input">
                <div className="d-flex justify-content-between appdownload">
                  <div className="ios">
                    <img src={ios} alt="ios" />
                  </div>
                  <div className="app">
                    <img src={googleplaystore} alt="googleplaystore" />
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <div className="qrimage">
                    <img src={qrcode} alt="qr Code" />
                  </div>
                  <div>
                    <p>Open camera & scan the QR code to Download the App</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row align-items-end">
            <div className="col-md-5">
              <div className="follow">
                <h4>Follow</h4>
                {/* <div className="social-icons">
                  {siteSettings && (
                    <Link
                      to={
                        siteSettings.facebook_link?.trim()
                          ? siteSettings.facebook_link
                          : "https://www.facebook.com"
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FaFacebookF />
                    </Link>
                  )}

                  <Link
                    to={
                      siteSettings?.insta_link &&
                      siteSettings.insta_link.trim() !== ""
                        ? siteSettings.insta_link
                        : "https://www.instagram.com"
                    }
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FaInstagram />
                  </Link>

                  <Link
                  to={
                      siteSettings?.teligram_link &&
                      siteSettings.teligram_link.trim() !== ""
                        ? siteSettings.teligram_link
                        : "https://www.telegram.com"
                    }
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FaTelegramPlane />
                  </Link>

                  <Link
                    to={
                      siteSettings?.youtube_link &&
                      siteSettings.youtube_link.trim() !== ""
                        ? siteSettings.youtube_link
                        : "https://www.youtube.com"
                    }
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FaYoutube />
                  </Link>

                  <Link
                    to={
                      siteSettings?.linkedin_link &&
                      siteSettings.linkedin_link.trim() !== ""
                        ? siteSettings.linkedin_link
                        : "https://www.linkedin.com"
                    }
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FaLinkedinIn />
                  </Link>
                </div> */}

                <div className="social-icons">
                  {siteSettings && (
                    <Link
                      to={
                        siteSettings.facebook_link?.trim()
                          ? siteSettings.facebook_link
                          : "https://www.facebook.com"
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="icon-link"
                    >
                      <img src={facebook} alt="facebook" />
                    </Link>
                  )}

                  <Link
                    to={
                      siteSettings?.insta_link &&
                        siteSettings.insta_link.trim() !== ""
                        ? siteSettings.insta_link
                        : "https://www.instagram.com"
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="icon-link"
                  >
                    <img src={instragram} alt="instragram" />
                  </Link>

                  <Link
                    to={
                      siteSettings?.teligram_link &&
                        siteSettings.teligram_link.trim() !== ""
                        ? siteSettings.teligram_link
                        : "https://www.telegram.com"
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="icon-link"
                  >
                    <img src={telegram} alt="telegram" />
                  </Link>

                  <Link
                    to={
                      siteSettings?.youtube_link &&
                        siteSettings.youtube_link.trim() !== ""
                        ? siteSettings.youtube_link
                        : "https://www.youtube.com"
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="icon-link"
                  >
                    <img src={youtube} alt="youtube" />
                  </Link>
                  <Link
                    to={
                      siteSettings?.office_location_link &&
                        siteSettings.office_location_link.trim() !== ""
                        ? siteSettings.office_location_link
                        : "https://www.google.com"
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="icon-link"
                  >
                    <img src={location} alt="location" />
                  </Link>
                  <Link
                    to={
                      siteSettings?.zoom_meeting_link &&
                        siteSettings.zoom_meeting_link.trim() !== ""
                        ? siteSettings.zoom_meeting_link
                        : "https://www.zoom.com"
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="icon-link"
                  >
                    <img src={zoom} alt="zoom" />
                  </Link>

                  {/*<Link
                    to={
                      siteSettings?.linkedin_link &&
                      siteSettings.linkedin_link.trim() !== ""
                        ? siteSettings.linkedin_link
                        : "https://www.linkedin.com"
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="icon-link"
                  >
                      <img src={linkdin} alt="linkdin" />
                  </Link>*/}
                </div>
              </div>
            </div>
            <div class="col-xl-7">
              <div class="row justify-content-center gy-4">
                <div class="col-md-4 col-sm-6">
                  <div class="contact-info">
                    <span class="bg-primary">
                      <FaHeadphones />
                    </span>
                    <div>
                      <p>Customer Support</p>
                      <h6>
                        {siteSettings?.support1_number
                          ? `+91-${siteSettings.support1_number.replace(
                            /^(\+91|91|0|\-)/g,
                            ""
                          )}`
                          : "+91 56589 54598"}
                      </h6>
                    </div>
                  </div>
                </div>
                <div class="col-md-4 col-sm-6">
                  <div class="contact-info">
                    <span class="bg-secondary">
                      <MdEmail />
                    </span>
                    <div>
                      <p>Drop Us an Email</p>
                      <h6>{siteSettings?.email_id || "info@example.com"}</h6>
                    </div>
                  </div>
                </div>
                {/* <div class="col-md-4 col-sm-6">
                  <div class="contact-info">
                    <span class="bg-danger">
                      <FaPhoneVolume />
                    </span>
                    <div>
                      <p>Customer Support</p>

                      <h6>
                        {siteSettings?.mobile_number
                          ? `+91-${siteSettings.mobile_number.replace(
                            /^(\+91|91|0|\-)/g,
                            ""
                          )}`
                          : "+91 56589 54598"}
                      </h6>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>

          <div className="mil-divider mil-light"></div>
          <div className="mil-footer-links">
            <ul className="mil-social mil-light">
              <li className="mil-adapt-links">
                <a href="index.html"> © 2026 Vaastav Real Estates Pvt Ltd. All rights reserved.</a>
              </li>
            </ul>
            <ul className="mil-additional-links mil-light">
              <li>
                <a href="#">Terms & Condition</a>
              </li>
              <li>
                <a href="#">Privacy Policy</a>
              </li>
              <li>
                <a href="#">Sitemap</a>
              </li>
            </ul>
          </div>
        </div>
        {/* <div className="whatsappicon fixeditems">
          <Link
            to={
              siteSettings?.whatsapp_number
                ? `https://wa.me/91${siteSettings.whatsapp_number.replace(
                    /^\+91|91|0|-/,
                    ""
                  )}`
                : "/"
            }
            target="_blank"
            rel="noreferrer"
          >
            <img src={whatsapp} alt="whatsapp" />
          </Link>
        </div> */}

        {/* <div className="whatsappicon fixeditems">
          <Link
            to={
              siteSettings?.whatsapp_link
                ? siteSettings.whatsapp_link
                : siteSettings?.whatsapp_number
                  ? `https://wa.me/91${siteSettings.whatsapp_number.replace(
                    /^\+91|91|0|-/,
                    ""
                  )}`
                  : "/"
            }
            target="_blank"
            rel="noreferrer"
          >
            <img alt="whatsapp" src={whatsapp} />
          </Link>
        </div> */}



        <div className="whatsappicon fixeditems">
          <Link
            to="https://wa.link/ars8r4"
            target="_blank"
            rel="noreferrer"
          >
            <img alt="whatsapp" src={whatsapp} />
          </Link>
        </div>




        <div className="call fixeditems">
          <Link
            to={
              siteSettings?.call_number
                ? `tel:+91${siteSettings.call_number.replace(/\D/g, "")}`
                : "/"
            }
          >
            <img src={call} alt="call" />
          </Link>

        </div>
      </footer>
    </div>
  );
};

export default Footer;
