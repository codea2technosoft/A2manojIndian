import React, { useState, useEffect } from "react";
import logoImage from "../assets/images/logo.png";
import { MdFacebook } from "react-icons/md";
import { FaInstagram, FaYoutube, FaLinkedinIn } from "react-icons/fa";
import facebook from "../assets/images/facebook.png";
import instragram from "../assets/images/instrgram.png";
import telegram from "../assets/images/telegram.png";
import zoom from "../assets/images/zoom.png";
import location from "../assets/images/location.png";
import youtube from "../assets/images/youtube.png";

const Footer = () => {
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
          <img src={logoImage} alt="logo" className="logo-lg" />
        </div>
      </div>
    ); // Optional loader
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
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="d-flex align-items-center flex-wrap-mobile justify-content-between footercopyright">
              <div className="text-center">
                <b>
                  © {currentYear} Shubh Bhoomi Real Estates Pvt Ltd. All rights
                  reserved.
                </b>
              </div>
              <div className="d-flex socialmediadeign">
                {siteSettings && (
                  <a
                    href={
                      siteSettings.facebook_link?.trim()
                        ? siteSettings.facebook_link
                        : "https://www.facebook.com"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="icon-link"
                  >
                    <img src={facebook} alt="facebook" />
                  </a>
                )}

                <a
                  href={
                    siteSettings?.insta_link &&
                    siteSettings.insta_link.trim() !== ""
                      ? siteSettings.insta_link
                      : "https://www.instagram.com"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="icon-link"
                >
                  <img src={instragram} alt="instragram" />
                </a>

                <a
                  href={
                    siteSettings?.teligram_link &&
                    siteSettings.teligram_link.trim() !== ""
                      ? siteSettings.teligram_link
                      : "https://www.telgram.com"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="icon-link"
                >
                  <img src={telegram} alt="telegram" />
                </a>

                <a
                  href={
                    siteSettings?.youtube_link &&
                    siteSettings.youtube_link.trim() !== ""
                      ? siteSettings.youtube_link
                      : "https://www.youtube.com"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="icon-link"
                >
                  <img src={youtube} alt="facebook" />
                </a>
                <a
                  href={
                    siteSettings?.office_location_link &&
                    siteSettings.office_location_link.trim() !== ""
                      ? siteSettings.office_location_link
                      : "https://www.googlemaps.com"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="icon-link"
                >
                  <img src={location} alt="location" />
                </a>
                <a
                  href={
                    siteSettings?.zoom_meeting_link &&
                    siteSettings.zoom_meeting_link.trim() !== ""
                      ? siteSettings.zoom_meeting_link
                      : "https://www.youtube.com"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="icon-link"
                >
                  <img src={zoom} alt="zoom" />
                </a>

                {/*  <a
    href={
      siteSettings?.linkedin_link && siteSettings.linkedin_link.trim() !== ""
        ? siteSettings.linkedin_link
        : "https://www.linkedin.com"
    }
    target="_blank"
    rel="noopener noreferrer"
    className="icon-link"
  >
      <img src={linkdin} alt="linkedin" />
  </a>*/}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
