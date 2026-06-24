import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PageTitle from "../Include/Pagetitle";
import { FaExpand, FaTimes } from "react-icons/fa";
import { RiContactsLine } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { MdSend } from "react-icons/md";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import axios from "axios";
import Swal from "sweetalert2";
import { BiSolidFilePdf } from "react-icons/bi";
import { FiDownload } from "react-icons/fi";

const API_URL = process.env.REACT_APP_API_URL;

const imagePathname = `${process.env.REACT_APP_IMAGE_API_URL}/uploads/project/`;
const amenitiesPath = `${process.env.REACT_APP_IMAGE_API_URL}/uploads/aminities/`;

function Projectdetils() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [imagePath, setImagePath] = useState("");
  const [loading, setLoading] = useState(true);
  const [projectData, setProjectData] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedimagePath, setSelectedimagePath] = useState(null);
  const [aminitiesimagePath, setaminitiesimagePath] = useState(null);
  const [imagesall, setimagesall] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [aminitiesList, setAminitiesList] = useState([]);

  const fetchProjectDetails = async () => {
    try {
      const res = await fetch(
        // `https://realestateapi.a2logicgroup.com/frontapi/project-details/${id}`
        `${process.env.REACT_APP_API_URL}/project-details/${id}`
      );
      const data = await res.json();
      if (data.status === "1") {
        setProject(data.data);

        setimagesall(data.images);
        setSelectedProject(data.data[0]);

        // 👉 Proper alert with readable format
      }
    } catch (err) {
      console.error("Error loading project", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setaminitiesimagePath(amenitiesPath);

    setImagePath(imagePathname);
    fetchProjectDetails();
  }, [id]);

  const onOpenModal = (index) => {
    setSelectedImage(index);
    setOpen(true);
  };

  const onCloseModal = () => setOpen(false);

  // ✅ Place at the top inside Projectdetils

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

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
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (!/^[A-Za-z\s]+$/.test(formData.name)) {
      newErrors.name = "Please enter a valid name using only letters";
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
        text: "Thank you for your enquiry! ✅ Your request has been successfully submitted. Our team will get back to you shortly.",
        confirmButtonColor: "#28a745",
      }).then(() => {
        // navigate("/"); // redirect if needed
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      Swal.fire({
        icon: "warning",
        title: "Warning!",
        text: "Please check your details and try again.",
        confirmButtonColor: "#f39c12",
      });
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (!project)
    return <p className="text-danger text-center">Project not found</p>;

  const images = project.images || [];

  return (
    <div className="projectdetils pb-70">
      <PageTitle />
      <div className="projectdetailsoverview">
        <div className="d-flex">
          <Link to="#overview" onClick={() => scrollToSection("overview")}>
            Overview
          </Link>
          <Link to="#Amenities" onClick={() => scrollToSection("Amenities")}>
            Amenities
          </Link>
          <Link to="#Plans" onClick={() => scrollToSection("Plans")}>
            Plans
          </Link>
          {/* <Link to='#Video' onClick={() => scrollToSection('Video')}>Video</Link> */}
          <Link to="#Location" onClick={() => scrollToSection("Location")}>
            Location
          </Link>
          <Link to="#Enquiry" onClick={() => scrollToSection("Enquiry")}>
            Enquiry
          </Link>
        </div>
      </div>

      <div className="margin_all_section">
        <div className="container">
          <div className="row">
            <div className="col-md-8">
              <div className="row" id="overview">
                <div className="col-md-12 site-plan-header">
                  <h3 className="site-plan-title">Overview</h3>
                </div>

                <div className="col-md-12">
                  <div className="gallery-container">
                    <div className="row">
                      {/* Main Image */}
                      <div className="col-md-6 col-6">
                        <div
                          className="image-project-main"
                          onClick={() => onOpenModal(0)}
                        >
                          <img
                            src={`${imagePath}${imagesall[0].image}`}
                            alt="Project"
                          />
                          <div className="image-overlay">
                            <FaExpand className="expand-icon" />
                          </div>
                        </div>
                      </div>

                      {/* Thumbnails */}
                      <div className="col-md-6 col-6">
                        <div className="row padding_detailspage">
                          {/* {imagesall.slice(1, 3).map((img, index) => (
                            <div className="col-md-6 col-6" key={index}>
                              <div
                                className="image-project-thumb"
                                onClick={() => onOpenModal(index + 1)}
                              >
    {img.image && !img.image.toLowerCase().endsWith(".pdf") && (
  <img
    src={`${imagePath}${img.image}`}
    alt={`Thumb ${index + 1}`}
  />
)}
                                <div className="image-overlay">
                                  <FaExpand className="expand-icon" />
                                </div>
                              </div>
                            </div>
                          ))} */}
                          {imagesall.slice(1, 3).map((img, index) => {
                            const isPdf =
                              img.image &&
                              img.image.toLowerCase().endsWith(".pdf");

                            if (isPdf) return null; // 🔁 skip this item completely

                            return (
                              <div className="col-md-6 col-6" key={index}>
                                <div
                                  className="image-project-thumb"
                                  onClick={() => onOpenModal(index + 1)}
                                >
                                  <img
                                    src={`${imagePath}${img.image}`}
                                    alt={`Thumb ${index + 1}`}
                                  />
                                  <div className="image-overlay">
                                    <FaExpand className="expand-icon" />
                                  </div>
                                </div>
                              </div>
                            );
                          })}

                          <div className="col-md-12 col-12 mt-2">
                            <div
                              className="view-more-box"
                              onClick={() => onOpenModal(0)}
                            >
                              <div className="view-more-content">
                                <span>+{images.length - 7}</span>
                                <p>View All</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Modal */}
                    <Modal
                      open={open}
                      onClose={onCloseModal}
                      classNames={{
                        overlay: "customOverlay",
                        modal: "customModal",
                      }}
                      animationDuration={500}
                    >
                      <button
                        className="close-btn-modal"
                        onClick={onCloseModal}
                      >
                        <FaTimes />
                      </button>
                      <div className="lightbox-content">
                        <img
                          src={`${imagePath}${imagesall[selectedImage].image}`}
                          alt={`Gallery ${selectedImage + 1}`}
                          className="lightbox-image"
                        />
                        <div className="lightbox-thumbnails">
                          {/* {imagesall.map((img, index) => (
                            <img
                              key={index}
                              src={`${imagePath}${img.image}`}
                              alt={`Thumb ${index + 1}`}
                              className={`thumbnail ${
                                index === selectedImage ? "active" : ""
                              }`}
                              onClick={() => setSelectedImage(index)}
                            />
                          ))} */}
                          {imagesall.map((img, index) => {
                            const isPdf = img.image
                              .toLowerCase()
                              .endsWith(".pdf");
                            return (
                              !isPdf && (
                                <img
                                  key={index}
                                  src={`${imagePath}${img.image}`}
                                  alt={`Thumb ${index + 1}`}
                                  className={`thumbnail ${
                                    index === selectedImage ? "active" : ""
                                  }`}
                                  onClick={() => setSelectedImage(index)}
                                />
                              )
                            );
                          })}
                        </div>
                      </div>
                    </Modal>
                  </div>
                </div>

                <div className="row mt-3" id="Plans">
                  <div className="col-md-12 site-plan-header">
                    <h3 className="site-plan-title">Site Plan</h3>
                    <p
                      className="site-plan-subtitle"
                      dangerouslySetInnerHTML={{ __html: project.description }}
                    />
                  </div>
                  <div className="col-md-12">
                    <div className="siteplan">
                      {selectedProject.map_pdf && (
                        <div className="col-md-6 col-12">
                          <div className="custum_all">
                            {/* <label className="form-label">Map PDF</label> */}
                            <div>
                              <a
                                href={`${imagePath}${selectedProject.map_pdf}`}
                                className="btn_all_pdf d-inline-flex align-items-center"
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <BiSolidFilePdf className="fs-3 me-1"/>
                                Download Map PDF
                                <FiDownload className="fs-4 ms-2"/>
                              </a>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-md-12 mt-2" id="Amenities">
                  <div className="amenities-section">
                    <h3 className="site-plan-title">Amenities</h3>
                    <p>
                      A premium township offering modern amenities, lush green
                      landscapes, and a luxurious lifestyle in Ajmer
                    </p>
                    <div className="">
                      <label className="form-label">Amenities</label>
                      {selectedProject.aminities && (
                        <ul className="amenities">
                          {JSON.parse(selectedProject.aminities).map(
                            (item, idx) => (
                              <li key={idx} className="amenitiesbox">
                                <div className="amenitiesboximage">
                                  <img
                                    src={`${amenitiesPath}${item.image}`}
                                    alt={item.name}
                                  />
                                </div>
                                <span>{item.name}</span>
                              </li>
                            )
                          )}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>

                <div className="row mt-4 gap-3" id="Location">
                  <div className="site-plan-header">
                    <h3 className="site-plan-title">Site Location</h3>
                    <p className="site-plan-subtitle">
                      Prime location with easy access to key city landmarks.
                    </p>
                  </div>

                  <div className="col-md-12">
                    <div className="locationdetails">
                      <h5>Key transport</h5>
                      <div className="transport-container">
                        <div className="facilities-grid">
                          {selectedProject.key_transport && (
                            <ul className="amenities w-100 gap-0">
                              {JSON.parse(selectedProject.key_transport).map(
                                (item, idx) => (
                                  <div className="facility-card">
                                    <div className="facility-info">
                                      <h3 className="facility-name">
                                        {item.name}
                                      </h3>
                                      <p className="facility-distance">
                                        {item.distance}
                                      </p>
                                    </div>
                                  </div>
                                )
                              )}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="iframe">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d227748.43602644143!2d75.62574649726879!3d26.88542138946675!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396c4adf4c57e281%3A0xce1c63a0cf22e09!2sJaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1753457895306!5m2!1sen!2sin"
                        width="100%"
                        height="300"
                        allowFullScreen
                        loading="lazy"
                      ></iframe>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4" id="Enquiry">
              <div className="details-siderbar2">
                <h4>
                  <RiContactsLine />
                  Contact Seller
                </h4>

                <div className="seller">
                  <div className="space10"></div>
                  <form
                    onSubmit={handleSubmit}
                    className="form-contact"
                    noValidate
                  >
                    <div className="input-area">
                      <label htmlFor="Name">
                        Name : <span className="text-danger">*</span>
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
                    </div>
                    <div className="input-area">
                      <label htmlFor="email">
                        Email Address : <span className="text-danger">*</span>
                      </label>
                      <input
                        type="Enter Your Valid Email"
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
                    </div>

                    <div className="input-area">
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
                    </div>

                    <div className="input-area">
                      <label htmlFor="subject">
                        Subject : <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control style-1"
                        placeholder="Enter Subject"
                        name="subject"
                        id="subject"
                        value={formData.subject}
                        onChange={handleChange}
                      />
                      {errors.subject && (
                        <span className="text-danger">{errors.subject}</span>
                      )}
                    </div>

                    <div className="input-area">
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
                    </div>
                    <div className="input-area">
                      <button
                        type="submit"
                        className="theme-btn1 d-flex align-items-center gap-2 justify-content-center"
                      >
                        Find Properties
                        <span className="arrow1">
                          <MdSend />
                        </span>
                        <span className="arrow2">
                          <MdSend />
                        </span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Projectdetils;
