import React, { useState, useEffect } from "react";
import axios from "axios";
import PageTitle from "../Include/Pagetitle";
import logo from "../assets/images/logo.png";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import {
  FaInstagram,
  FaFacebookF,
  FaYoutube,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.name || !/^[A-Za-z\s]+$/.test(formData.name)) {
      errors.name = "Please enter a valid name using only letters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone must be 10 digits";
    }
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/store-contact-us`,
        formData
      );
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Thank you for your enquiry! ✅ Your request has been successfully submitted. Our team will get back to you shortly. We appreciate your patience!",
        confirmButtonColor: "#28a745",
      }).then(() => {
        // navigate("/"); // 👈 Redirect to home after alert is dismissed
      });
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (error) {
      Swal.fire({
        icon: "warning",
        title: "Warning !",
        text: "Please Check Details, Input IS Not Valid!!!",
        confirmButtonColor: "#28a745",
      });
    }
  };

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
            src={logo}
            alt="logo"
            className="logo-lg"
          />
        </div>
      </div>; 
  }

  return (
    <div className="contactus_design pb-70">
      <PageTitle />
    
      <section className="margin_all_section">
        <div className="flat-section flat-contact">
          <div className="container">
            <div className="row">
              <div className="col-lg-8">
                <div className="contact-content">
                  <h4>Drop Us A Line</h4>
                  <p className="body-2 text-variant-1">
                    Feel free to connect with us through our online channels for
                    updates, news, and more.
                  </p>
                  <form
                    onSubmit={handleSubmit}
                    className="form-contact"
                    noValidate
                  >
                    <div className="box grid-2">
                      <fieldset>
                        <label htmlFor="name">
                          Full Name: <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Your Full Name"
                          name="name"
                          id="name"
                          value={formData.name}
                          onChange={(e) => {
                            const value = e.target.value;
                            // Allow only letters and spaces
                            if (/^[A-Za-z\s]*$/.test(value)) {
                              handleChange(e); // Call your handler only if input is valid
                            }
                          }}
                          required
                        />
                        {errors.name && (
                          <span className="text-danger">{errors.name}</span>
                        )}
                      </fieldset>

                      <fieldset>
                        <label htmlFor="email">
                          Email Address : <span className="text-danger">*</span>
                        </label>
                        <input
                          type="email"
                            className="form-control"
                          placeholder="Email"
                          name="email"
                          id="email"
                          
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                        {errors.email && (
                          <span className="text-danger">{errors.email}</span>
                        )}
                      </fieldset>
                    </div>

                    <div className="box grid-2">
                      <fieldset>
                        <label htmlFor="phone">
                          Phone Number: <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control style-1"
                          placeholder="Enter 10 Digit Mobile Number"
                          name="phone"
                          id="phone"
                          value={formData.phone}
                          maxLength="10"
                          onChange={(e) => {
                            const value = e.target.value;
                            // Allow only numbers
                            if (/^\d*$/.test(value)) {
                              handleChange(e); // Call your existing handler
                            }
                          }}
                          required
                        />
                        {errors.phone && (
                          <span className="text-danger">{errors.phone}</span>
                        )}
                      </fieldset>

                      <fieldset>
                        <label htmlFor="subject">
                          Subject : <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control style-1"
                          placeholder="Enter Keyword"
                          name="subject"
                          id="subject"
                          value={formData.subject}
                          onChange={handleChange}
                        />
                        {errors.subject && (
                          <span className="text-danger">{errors.subject}</span>
                        )}
                      </fieldset>
                    </div>

                    <fieldset>
                      <label htmlFor="Enter Your Query Details">
                        Your Message : <span className="text-danger">*</span>
                      </label>
                      <textarea
                        name="message"
                        className="form-control"
                        cols="30"
                        rows="5"
                        placeholder="Message"
                        id="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                      ></textarea>
                      {errors.message && (
                        <span className="text-danger">{errors.message}</span>
                      )}
                    </fieldset>

                    <div className="send-wrap">
                      <button className="tf-btn primary size-1" type="submit">
                        Send Message
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="contactusdesignallpage">
                  <h4>Contact Us</h4>
                  <div className="contact-info">
                    <ul className="listcontactdetailsdesign">
                      <li className="box">
                        <h6 className="title">Address:</h6>
                        <p className="text-variant-1">
                          {siteSettings?.address || "info@thehouse.com"}
                        
                        </p>
                      </li>
                      <li className="box">
                        <h6 className="title">Information:</h6>
                        <p className="text-variant-1">
                          {siteSettings?.mobile_number
                            ? `+91 - ${siteSettings.mobile_number.replace(
                                /^(\+91|91|0|\-)/g,
                                ""
                              )}`
                            : "+91 - 9999999999"}
                          <br />
                          <a
                            href={
                              `mailto:${siteSettings?.email_id}` ||
                              "mailto:info@thehouse.com"
                            }
                          >
                            {siteSettings?.email_id || "info@thehouse.com"}
                          </a>
                        </p>
                      </li>
                      <li className="box">
                        <div className="title">Open Time:</div>
                        <p className="text-variant-1">
                          Monday - Friday: 08:00 - 20:00
                          <br />
                          Saturday - Sunday: 10:00 - 18:00
                        </p>
                      </li>
                      <li className="box">
                        <div className="title">Follow Us:</div>
                        <ul className="box-social d-flex gap-3 mt-2">
                          <li>
                            <a
                              href={
                                siteSettings?.facebook_link?.trim() !== ""
                                  ? siteSettings.facebook_link
                                  : "#"
                              }
                              className="item"
                              aria-label="Facebook"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FaFacebookF />
                            </a>
                          </li>

                          <li>
                            <a
                              href={
                                siteSettings?.insta_link?.trim() !== ""
                                  ? siteSettings.insta_link
                                  : "#"
                              }
                              className="item"
                              aria-label="Instagram"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FaInstagram />
                            </a>
                          </li>

                          <li>
                            <a
                              href={
                                siteSettings?.youtube_link?.trim() !== ""
                                  ? siteSettings.youtube_link
                                  : "#"
                              }
                              className="item"
                              aria-label="YouTube"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FaYoutube />
                            </a>
                          </li>

                          <li>
                            <a
                              href={
                                siteSettings?.twitter_link?.trim() !== ""
                                  ? siteSettings.twitter_link
                                  : "#"
                              }
                              className="item"
                              aria-label="Twitter"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FaTwitter />
                            </a>
                          </li>

                          <li>
                            <a
                              href={
                                siteSettings?.linkedin_link?.trim() !== ""
                                  ? siteSettings.linkedin_link
                                  : "#"
                              }
                              className="item"
                              aria-label="LinkedIn"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FaLinkedinIn />
                            </a>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactSection;
