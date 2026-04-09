import React, { useState, useEffect, useRef } from "react";
import {
  FaHome,
  FaBuilding,
  FaCity,
  FaUser,
  FaPlus,
  FaSearchPlus,
} from "react-icons/fa";

import Slider from "react-slick";
import videobg from "../assets/images/landvideo.mp4";
import { Link } from "react-router-dom";
import { MdArrowOutward } from "react-icons/md";
import { MdOutlineArrowBackIos } from "react-icons/md";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import rentimage from "../assets/images/sell_rent_icon.svg";
import { FaArrowUp } from "react-icons/fa";
import youtubelogo from "../assets/images/youtubelogo.png";
import youtubelinks from "../assets/images/youtube_links.png";
import notavailable from "../assets/images/Image_not_available.png";
import axios from "axios";
import { FaArrowRight, FaPlay, FaSearch } from "react-icons/fa";
import { MdOutlineArrowOutward } from "react-icons/md";
import { MdStore, MdApartment, MdHome, MdBusiness } from "react-icons/md";
import { FaAngleRight } from "react-icons/fa";
import aboutimagevideo from "../assets/images/aboutimagevideo.jpg";
import landvideo from "../assets/images/landvideo.mp4";
import aboutimage from "../assets/images/aboutimage.jpg";
import propertyImg1 from "../assets/images/1.png";
import propertyImg2 from "../assets/images/2.png";
import propertyImg3 from "../assets/images/3.png";
import propertyImg4 from "../assets/images/4.png";
import propertyImg5 from "../assets/images/5.png";
import propertyImg6 from "../assets/images/6.png";
import propertyImg7 from "../assets/images/7.png";
import propertyImg8 from "../assets/images/8.png";
import google from "../assets/images/google.png";
import blogImg1 from "../assets/images/blog-1.jpg";
import blogImg2 from "../assets/images/blog-2.jpg";
import mission from "../assets/images/mission.png";
import value from "../assets/images/value.png";
import vision from "../assets/images/our-vision.png";
import blogImg3 from "../assets/images/blog-3.jpg";
import { MdLocationOn, MdMap, MdPlace } from "react-icons/md";
import TestimonialSection from "../Commonpage/TestimonialSection";
import Faq from "../Commonpage/Faq";
import AOS from "aos";

const imagePathname = `${process.env.REACT_APP_IMAGE_API_URL}/uploads/project/`;
const imageGallery = `${process.env.REACT_APP_IMAGE_API_URL}/uploads/gallery/`;
const imageSlider = `${process.env.REACT_APP_IMAGE_API_URL}/uploads/banner/`;
const imageBlogsimage = `${process.env.REACT_APP_IMAGE_API_URL}/uploads/blog/`;
const profileImage = `${process.env.REACT_APP_IMAGE_API_URL}/uploads/profile/`;

function Index() {
  const [activeTab, setActiveTab] = useState("mission");
  const [activeTababout, setActiveTababout] = useState("about-1");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showModal, setShowModal] = useState(false);
  const [blog, setblog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedimagePath, setSelectedimagePath] = useState(null);
  const [projects, setProjects] = useState([]);

  const locations = [
    { name: "Jaipur", properties: 95, img: propertyImg1 },
    { name: "Udaipur", properties: 40, img: propertyImg2 },
    { name: "Jodhpur", properties: 200, img: propertyImg3 },
    { name: "Delhi / NCR", properties: 70, img: propertyImg4 },
    { name: "Goa", properties: 30, img: propertyImg5 },
    { name: "Utter Pradesh", properties: 20, img: propertyImg6 },
    { name: "Punjab", properties: 56, img: propertyImg7 },
    { name: "Bikaner", properties: 110, img: propertyImg8 },
  ];
  // const imagePathname = "https://realestateapi.a2logicgroup.com/uploads/project/";

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-out",
      once: false,
      offset: 50,
    });
    window.addEventListener("load", () => {
      AOS.refresh();
    });
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/project-list?page=1&limit=10&name=`,
        {},
        {
          params: {
            project_status: "ongoing",
          },
        }
      );

      if (response.data && response.data.data) {
        setProjects(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const toSentenceCase = (str) => {
    if (!str) return "";
    const cleaned = str.trim().toLowerCase();
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  };
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const visibleLocations =
    windowWidth < 991 ? locations.slice(0, 4) : locations;

  const propertyTypes = [
    {
      icon: <MdLocationOn />,
      youtubeLink: (
        <iframe
          width="799"
          height="480"
          src="https://www.youtube.com/embed/wkWqK1Ta6AI"
          title="Unnatii Green Valley II Jda &amp; ReraApproved Plots on Ajmer Road II Call 9610500606"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        ></iframe>
      ),
    },
    {
      icon: <MdBusiness />,
      youtubeLink: (
        <iframe
          width="799"
          height="480"
          src="https://www.youtube.com/embed/wkWqK1Ta6AI"
          title="Unnatii Green Valley II Jda &amp; ReraApproved Plots on Ajmer Road II Call 9610500606"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        ></iframe>
      ),
    },
    {
      icon: <MdApartment />,
      youtubeLink: (
        <iframe
          width="799"
          height="480"
          src="https://www.youtube.com/embed/wkWqK1Ta6AI"
          title="Unnatii Green Valley II Jda &amp; ReraApproved Plots on Ajmer Road II Call 9610500606"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        ></iframe>
      ),
    },
    {
      icon: <MdPlace />,
      youtubeLink: (
        <iframe
          width="799"
          height="480"
          src="https://www.youtube.com/embed/wkWqK1Ta6AI"
          title="Unnatii Green Valley II Jda &amp; ReraApproved Plots on Ajmer Road II Call 9610500606"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        ></iframe>
      ),
    },
    {
      icon: <MdStore />,
      youtubeLink: (
        <iframe
          width="799"
          height="480"
          src="https://www.youtube.com/embed/wkWqK1Ta6AI"
          title="Unnatii Green Valley II Jda &amp; ReraApproved Plots on Ajmer Road II Call 9610500606"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        ></iframe>
      ),
    },
    {
      icon: <MdMap />,
      youtubeLink: (
        <iframe
          width="799"
          height="480"
          src="https://www.youtube.com/embed/wkWqK1Ta6AI"
          title="Unnatii Green Valley II Jda &amp; ReraApproved Plots on Ajmer Road II Call 9610500606"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        ></iframe>
      ),
    },
    {
      icon: <MdLocationOn />,
      youtubeLink: (
        <iframe
          width="799"
          height="480"
          src="https://www.youtube.com/embed/wkWqK1Ta6AI"
          title="Unnatii Green Valley II Jda &amp; ReraApproved Plots on Ajmer Road II Call 9610500606"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        ></iframe>
      ),
    },
    {
      icon: <MdHome />,
      youtubeLink: (
        <iframe
          width="799"
          height="480"
          src="https://www.youtube.com/embed/wkWqK1Ta6AI"
          title="Unnatii Green Valley II Jda &amp; ReraApproved Plots on Ajmer Road II Call 9610500606"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        ></iframe>
      ),
    },
    {
      icon: <MdHome />,
      youtubeLink: (
        <iframe
          width="799"
          height="480"
          src="https://www.youtube.com/embed/wkWqK1Ta6AI"
          title="Unnatii Green Valley II Jda &amp; ReraApproved Plots on Ajmer Road II Call 9610500606"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        ></iframe>
      ),
    },
  ];

  const [windowwidthall, setWindowwidthall] = useState(window.innerWidth);

  useEffect(() => {
    const handleResizeall = () => setWindowwidthall(window.innerWidth);
    window.addEventListener("resize", handleResizeall);

    return () => window.removeEventListener("resize", handleResizeall);
  }, []);
  const visiblelocationall =
    windowwidthall < 991 ? propertyTypes.slice(0, 4) : propertyTypes;

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(
          // "https://realestateapi.a2logicgroup.com/frontapi/blog-list?page=1&limit=10"
          `${process.env.REACT_APP_API_URL}/blog-list?page=1&limit=10`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch blog posts");
        }
        const data = await response.json();
        setblog(data.data || []);
        setSelectedimagePath(data.imagePath);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, []);

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 992,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  // counter
  const [counters, setCounters] = useState([
    {
      id: 1,
      value: 0,
      target: 100,
      title: "Properties Sold",
      icon: <FaHome />,
    },
    {
      id: 2,
      value: 0,
      target: 98,
      title: "Happy Clients",
      icon: <FaBuilding />,
    },
    { id: 3, value: 0, target: 10, title: "Cities Covered", icon: <FaCity /> },
    { id: 4, value: 0, target: 15, title: "Employees", icon: <FaUser /> },
  ]);

  useEffect(() => {
    const duration = 3000; // Animation duration in ms
    const interval = 50; // Update interval in ms
    const steps = duration / interval;

    const incrementCounters = () => {
      setCounters((prevCounters) =>
        prevCounters.map((counter) => {
          const increment = Math.ceil(counter.target / steps);
          return {
            ...counter,
            value:
              counter.value + increment > counter.target
                ? counter.target
                : counter.value + increment,
          };
        })
      );
    };

    const animationTimer = setInterval(incrementCounters, interval);

    return () => clearInterval(animationTimer);
  }, []);

  const stripHTML = (html) => {
    return html
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .trim();
  };

  const [photos, setPhotos] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [imagePath, setImagePath] = useState(null);
  const [slider, setSlider] = useState([]);

  const itemsPerPage = 15;

  useEffect(() => {
    const fetchGalleryPhotos = async (page = 1) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/gallery-list?page=${currentPage}&limit=${itemsPerPage}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setPhotos(data.data || []);
        setImagePath(data.imagePath);

        setTotalPages(data.totalPages || 1);
        setCurrentPage(page);
      } catch (err) {
        console.error("Error fetching gallery photos:", err);
        setError("Failed to load gallery images. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryPhotos();
  }, [currentPage, itemsPerPage]);

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
  };

  const closeLightbox = () => {
    setCurrentImageIndex(null);
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };
  const videoRef = useRef(null);
  const [showSlider, setShowSlider] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderImages, setSliderImages] = useState([]);

  // Fetch slider images from API
  useEffect(() => {
    const fetchSliderImages = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/slider-list`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSliderImages(data.data || []);
        setImagePath(data.imagePath || "");
      } catch (err) {
        console.error("Error fetching slider images:", err);
        setError("Failed to load slider images. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSliderImages();
  }, []);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      const handleVideoEnd = () => setShowSlider(true);
      videoElement.addEventListener("ended", handleVideoEnd);
      return () => videoElement.removeEventListener("ended", handleVideoEnd);
    }
  }, []);

  useEffect(() => {
    if (showSlider && sliderImages.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [showSlider, sliderImages.length]);

  // return (
  //   <>
  //     Comming Soon
  //   </>
  // );

  return (
    <div className="homepage">
      <div className="video-slider-container">
        <>
          {!showSlider ? (
            <section>
              <div className="viedwo">
                <video
                  ref={videoRef}
                  loop={false}
                  autoPlay
                  muted
                  playsInline
                  id="vid"
                >
                  <source type="video/mp4" src={videobg} />
                  <source type="video/ogg" src={videobg} />
                </video>
                <div className="hero_main">
                  <div className="container">
                    <div className="row">
                      <div className="col-xl-7 col-lg-9 col-md-10"></div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <div className="slider-wrapper fade-in">
              {loading ? (
                <div className="loading-spinner">Loading...</div>
              ) : error ? (
                <div className="error-message">{error}</div>
              ) : sliderImages.length > 0 ? (
                <>
                  <img
                    src={`${imageSlider}${sliderImages[currentSlide]?.image}`}
                    alt={`Slide ${currentSlide + 1}`}
                    className="slide-image"
                  />
                  <div className="controls">
                    <div className="buttonalldesignnew">
                      <button
                        className="left"
                        onClick={() =>
                          setCurrentSlide(
                            (prev) =>
                              (prev - 1 + sliderImages.length) %
                              sliderImages.length
                          )
                        }
                      >
                        <MdOutlineArrowBackIos />
                      </button>
                    </div>
                    <div className="buttonalldesignnew">
                      <button
                        className="right"
                        onClick={() =>
                          setCurrentSlide(
                            (prev) => (prev + 1) % sliderImages.length
                          )
                        }
                      >
                        <MdOutlineArrowForwardIos />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="no-images">No slider images available</div>
              )}
            </div>
          )}
        </>
      </div>

      {/* about section  */}
      <section className="margin_all_section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-6 col-lg-6 col-md-6 col-12">
              <div
                className="about_content"
                data-aos="fade-up"
                data-aos-duration="0"
              >
                <h5 className="sub_heading">About us</h5>
                <h3 className="main_headin-2" data-aos="fade-left">
                  Vaastav Real Estate
                </h3>
                <p className="mt-4" data-aos="fade-up">
                  It is a company for having scope of providing services to
                  carry on the business of buying, construction, development,
                  advertising, marketing of any real estates projects, lands,
                  villas, houses, flats, apartments, offices, bungalows, farm
                  houses, resorts, other properties, etc.. we strive to create
                  an environment of trust and faith between our sales associates
                  and customers and we strongly believes that we play a vital
                  role in shaping the land of our great nation through following
                  its core values of delivering quality and excellent real
                  estates spaces ensuring customer satisfaction.
                </p>

                <div className="d-flex gap-4 visitsite">
                  <div
                    className="main_btn"
                    data-aos="fade-right"
                    data-aos-delay="300"
                  >
                    <a
                      href="/contact-us"
                      className="d-flex align-items-center gap-2"
                    >
                      Schedule a Visit <FaArrowRight />
                    </a>
                  </div>
                  <div
                    className="main_btn main_btn-2"
                    data-aos="fade-left"
                    data-aos-delay="300"
                  >
                    <a
                      href="https://www.youtube.com/@rajasthanirealestates"
                      className="d-flex align-items-center gap-2"
                      target="__blank"
                    >
                      Watch Video Tour <FaArrowRight />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="col-xl-6 col-lg-6 col-md-6 col-12">
              <div className="main_img ms-md-4">
                <div className="tab-content" id="myTabContent">
                  {images.map((image) => (
                    <div
                      key={image.id}
                      className={`tab-pane fade ${activeTababout === image.id ? 'show active' : ''}`}
                      id={image.id}
                      role="tabpanel"
                      aria-labelledby={`${image.id}-tab`}
                    >
                      <img src={image.src} alt={image.alt} className="w-100" />
                    </div>
                  ))}
                </div>

                <ul className="d-flex thumbnail border-0 mt-3" id="myTab" role="tablist">
                  {images.map((image) => (
                    <li key={image.id} className="thumbnailimages" role="presentation">
                      <button
                        className={` about_s ${activeTababout === image.id ? 'active' : ''}`}
                        id={`${image.id}-tab`}
                        onClick={() => setActiveTababout(image.id)}
                        role="tab"
                        aria-controls={image.id}
                        aria-selected={activeTababout === image.id}
                      >
                        <img src={image.src} alt={image.alt} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div> */}
            <div className="col-xl-6 col-lg-6 col-md-6 col-12 align-self-center">
              <div className="about-us-img-wrap about-img-left">
                <img src={aboutimage} alt="About Us" className="main-img" />
                <div
                  className="about-us-img-info about-us-img-info-2 about-us-img-info-3"
                  data-aos="fade-left"
                  data-aos-delay="300"
                >
                  <div className="ltn__video-img ltn__animation-pulse1">
                    <img
                      src={aboutimagevideo}
                      alt="video bg"
                      className="video-thumb"
                    />
                    <button
                      className="custom-play-btn"
                      onClick={() => setShowModal(true)}
                    >
                      <FaPlay />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {showModal && (
              <div
                className="custom-modal-overlay"
                onClick={() => setShowModal(false)}
              >
                <div
                  className="custom-modal-content"
                  onClick={(e) => e.stopPropagation()}
                >
                  <video
                    width="100%"
                    height="100%"
                    controls
                    autoPlay
                    loop
                    muted={false}
                  >
                    <source src={landvideo} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <button
                    className="modal-close-btn"
                    onClick={() => setShowModal(false)}
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      {/* about section  */}

      {/* counter  */}
      <div className="margin_all_section">
        <div className="counter-section">
          <div className="container">
            <Slider {...sliderSettings}>
              {counters.map((counter) => (
                <div key={counter.id}>
                  <div className="counter-card">
                    <div className="counter-icon">{counter.icon}</div>
                    <div className="boxcounter">
                      <div className="counter-value">
                        <span className="count">
                          {counter.value.toLocaleString()}
                        </span>
                        {counter.id === 5 ? "" : "+"}
                      </div>
                      <div className="counter-title">{counter.title}</div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
      {/* counter  */}
      <div className="land-broker-services">
        <section className="service-categories">
          <div className="container">
            <div className="row">
              <div className="col-12 text-center">
                <h5
                  className="sub_heading"
                  data-aos="fade-left"
                  data-aos-delay="300"
                >
                  Our Service
                </h5>
                <h3
                  className="main_headin-2"
                  data-aos="zoom-in"
                  data-aos-delay="300"
                >
                  Comprehensive Services
                </h3>
                <p data-aos="fade-left" data-aos-delay="300">
                  Find answers to common questions about our real estate
                  services
                </p>
              </div>
            </div>
            <div
              className="category-grid"
              data-aos="zoom-in"
              data-aos-duration="800"
            >
              {/* For Property Owners */}
              <div
                className="category-card"
                data-aos="zoom-in"
                data-aos-duration="800"
              >
                <div className="category-header">
                  <div className="icon_design">
                    <FaHome className="category-icon" />
                  </div>
                  <h3>For Property Owners</h3>
                </div>
                <ul>
                  <li>Buy Properties</li>
                  <li>Marketing & Promotion</li>
                  <li>Township Planners</li>
                  <li>Property Developments</li>
                </ul>
              </div>

              {/* For Buyers & Tenants */}
              <div
                className="category-card"
                data-aos="zoom-in"
                data-aos-duration="800"
              >
                <div className="category-header">
                  <div className="icon_design">
                    <FaSearch className="category-icon" />
                  </div>
                  <h3>For Buyers </h3>
                </div>
                <ul>
                  <li>Property Search Assistance</li>
                  <li>Virtual Tours & Site Visits</li>
                  <li>Legal & Document Support</li>
                  <li>Loan/Home Finance Assistance</li>
                </ul>
              </div>

              {/* For Developers & Investors */}
              <div
                className="category-card"
                data-aos="zoom-in"
                data-aos-delay="350"
              >
                <div className="category-header">
                  <div className="icon_design">
                    <FaBuilding className="category-icon" />
                  </div>
                  <h3>For Investors</h3>
                </div>
                <ul>
                  <li>Land Acquisition Support</li>
                  <li>Project Marketing</li>
                  <li>Investor Onboarding</li>
                  <li>Joint Venture Partnerships</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* project start  */}
      <div className="gallerypage  gallery_image_all">
        <section className="service-categories">
          <div className="container">
            <div className="row">
              <div className="col-12 text-center">
                <h5
                  className="sub_heading text-white"
                  data-aos="fade-left"
                  data-aos-delay="300"
                >
                  Gallery
                </h5>
                <h3
                  className="main_headin-2"
                  data-aos="zoom-in"
                  data-aos-delay="300"
                >
                  Vaastav Real Estate
                </h3>
                {/* <p>
                  Find answers to common questions about our real estate
                  services
                </p> */}
              </div>
            </div>
            <div className="gallery-grid mt-3">
              {!loading && !error && photos.length > 0 && (
                <>
                  {photos.slice(0, 6).map((photo, index) => (
                    <div
                      key={photo.image + index}
                      className="gallery-item"
                      data-aos="zoom-in"
                      data-aos-duration="800"
                      data-aos-delay={index * 150}
                      onClick={() => openLightbox(index)}
                    >
                      <div className="gallery_overlay">
                        <div class="link">
                          <div class="view-image">View</div>
                        </div>
                      </div>
                      <FaSearchPlus />
                      <img
                        src={`${imageGallery}${photo.image}`}
                        alt={photo.alt || "Gallery image"}
                        className="gallery-image"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://placehold.co/100x50/cccccc/333333?text=No+Image";
                        }}
                      />
                    </div>
                  ))}
                </>
              )}
            </div>
            {currentImageIndex !== null && photos.length > 0 && (
              <div className="lightbox" onClick={closeLightbox}>
                <div
                  className="lightbox-content"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button className="close-btn" onClick={closeLightbox}>
                    &times;
                  </button>
                  <button className="nav-btn prev-btn" onClick={goToPrevious}>
                    &#10094;
                  </button>
                  <img
                    src={`${imageGallery}${photos[currentImageIndex].image}`}
                    alt={photos[currentImageIndex].alt || "Gallery image"}
                    className="lightbox-image"
                  />
                  <button className="nav-btn next-btn" onClick={goToNext}>
                    &#10095;
                  </button>
                  <div className="image-counter">
                    {currentImageIndex + 1} / {photos.length}
                  </div>
                </div>
              </div>
            )}
            <div className="d-flex justify-content-center mt-2">
              <div class="viewmorebutton">
                <a href="/gallery">
                  View More <MdArrowOutward />
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
      {/* project start  */}
      <div className="margin_all_section pb-70">
        <section className="service-categories">
          <div className="container">
            <div className="row">
              <div className="col-12 text-center text-white">
                <h5
                  className="sub_heading  text-white"
                  data-aos="fade-left"
                  data-aos-delay="300"
                >
                  Ongoing Project
                </h5>
                <h3
                  className="main_headin-2  text-dark"
                  data-aos="zoom-in"
                  data-aos-delay="300"
                >
                  Ongoing Project
                </h3>
                <p
                  className="text-dark"
                  data-aos="fade-left"
                  data-aos-delay="300"
                >
                  Find answers to common questions about our real estate
                  services
                </p>
              </div>
            </div>
            <div className="row">
              {loading ? (
                <p>Loading projects...</p>
              ) : (
                projects.slice(0, 4).map((item, index) => (
                  <div className="col-md-3 mb-2" key={item.id || index}>
                    <div
                      className="project-card"
                      data-aos="zoom-in"
                      data-aos-duration="800"
                      data-aos-delay={index * 150}
                    >
                      <div className="popular-badge darkyellow">
                        <img src={rentimage} alt="icon" />
                        <p>Ongoing</p>
                      </div>
                      <div className="imageproject position-relative">
                        <img
                          src={
                            item.thumbnail && item.thumbnail.length
                              ? imagePathname + item.thumbnail
                              : rentimage
                          }
                          alt={item.siteName}
                        />
                        <Link
                          to={item.youtube_links}
                          className="youtube_direct"
                        >
                          <div className="image_youtube">
                            <img src={youtubelogo} alt="youtubelogo" />
                          </div>
                        </Link>
                      </div>
                      <div className="project-details ongoinprojectenwall">
                        <h3>{toSentenceCase(item.name)}</h3>
                        <p>{stripHTML(toSentenceCase(item.description))}</p>

                        <div className="button_learn">
                          <Link to={`/projectdetils/${item.id}`}>
                            Read More <FaArrowUp />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="d-flex justify-content-center mt-2">
              <div class="viewmorebutton">
                <a href="/ongoinproject">
                  View More <MdArrowOutward />
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
      {/* project start  */}

      {/* location serciton  */}
      <section className="margin_all_section pb-70 findbestlocation">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <h5
                className="sub_heading"
                data-aos="fade-left"
                data-aos-delay="300"
              >
                Find Best Locations
              </h5>
              <h3
                className="main_headin-2"
                data-aos="zoom-in"
                data-aos-delay="300"
              >
                Modern & Luxury Private Property
              </h3>
              <p data-aos="fade-left" data-aos-delay="300">
                Explore handpicked properties in prime locations, designed to
                offer both style and comfort. From sleek modern homes to
                luxurious private estates, we bring you closer to your perfect
                space.
              </p>
            </div>
          </div>
          <div className="row">
            {loading ? (
              <p>Loading projects...</p>
            ) : projects && projects.length > 0 ? (
              projects.slice(0, 4).map((item, index) => (
                <div
                  className="col-xl-3 col-lg-4 col-md-6 col-sm-6 mt-4"
                  key={item.id || index}
                >
                  <Link to={item.youtube_links} className="text-dark">
                    <div
                      className="prime_property"
                      data-aos="zoom-out"
                      data-aos-duration="800"
                      data-aos-delay={index * 150}
                    >
                      <div className="primg_img">
                        <div
                          className="video-container"
                          style={{
                            position: "relative",
                            width: "100%",
                            height: "450px",
                            borderRadius: "8px",
                            overflow: "hidden",
                            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                            backgroundImage: `url(${
                              item.thumbnail && item.thumbnail.length
                                ? imagePathname + item.thumbnail
                                : rentimage
                            })`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                          }}
                        >
                          {/* <iframe
                          width="799"
                          height="600"
                          src={item.youtube_links}
                          title={toSentenceCase(item.name)}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                        ></iframe> */}
                          <div className="youtube">
                            <img src={youtubelinks} alt="youtube_links" />
                          </div>
                        </div>
                      </div>
                      <div className="prime_content">
                        <div>
                          <h4>
                            {"Location : " + toSentenceCase(item.location)}
                          </h4>
                          <p className="mb-0">
                            {"Address : " + toSentenceCase(item.land_mark)}
                          </p>
                        </div>
                        <a href={item.youtube_links}>
                          <FaAngleRight />
                        </a>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <>
                {/* Static fallback 4 grid items */}
                {[
                  {
                    src: "https://www.youtube.com/embed/wkWqK1Ta6AI",
                    title:
                      "Unnatii Green Valley II Jda & ReraApproved Plots on Ajmer Road",
                  },
                  {
                    src: "https://www.youtube.com/embed/gppBScK2xTE",
                    title: "VillaProject on jaipur-Ajmer",
                  },
                  {
                    src: "https://www.youtube.com/embed/wkWqK1Ta6AI",
                    title:
                      "Unnatii Green Valley II Jda & ReraApproved Plots on Ajmer Road I",
                  },
                  {
                    src: "https://www.youtube.com/embed/DVHaM90vLIY",
                    title: "DHB Sapphire || JDA/RERA",
                  },
                ].map((video, i) => (
                  <div
                    className="col-xl-3 col-lg-4 col-md-6 col-sm-6 mt-4"
                    key={i}
                  >
                    <div className="prime_property">
                      <div className="primg_img">
                        <div
                          className="video-container"
                          style={{
                            position: "relative",
                            width: "100%",
                            height: "450px",
                            borderRadius: "8px",
                            overflow: "hidden",
                            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                          }}
                        >
                          <iframe
                            width="799"
                            height="600"
                            src={video.src}
                            title={video.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                          ></iframe>
                        </div>
                      </div>
                      <div className="prime_content">
                        <div>
                          <h4>{video.title}</h4>
                          <p className="mb-0">Properties</p>
                        </div>
                        <a href="/contact-us">
                          <FaAngleRight />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
            <div className="col-md-12">
              <div className="d-flex justify-content-center mt-2">
                <div class="viewmorebutton">
                  <a href="/ongoinproject">
                    View More <MdArrowOutward />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* location serciton  */}

      <TestimonialSection />
      {/* our value  */}
      <section className="whychooseus">
        <div className=" margin_all_section">
          <div className="ourvalue">
            <div className="container">
              <div className="row">
                <div className="col-12 text-center">
                  <h5
                    className="sub_heading"
                    data-aos="fade-left"
                    data-aos-delay="300"
                  >
                    Why Choose Us
                  </h5>
                  <h3
                    className="main_headin-2"
                    data-aos="zoom-in"
                    data-aos-delay="300"
                  >
                    Best Consultancy
                  </h3>
                  <p data-aos="fade-left" data-aos-delay="300">
                    Our seasoned team excels in real estate with years of
                    successful market navigation.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mission-section" data-aos="fade-right">
            <div className="container">
              <div className="row align-items-start">
                {/* Image Column */}
                <div className="col-lg-6 mb-4 mb-lg-0">
                  <div className="mission-image">
                    {activeTab === "mission" && (
                      <img
                        src={mission}
                        alt="Real estate values"
                        className=" rounded-3 shadow"
                      />
                    )}
                    {activeTab === "vision" && (
                      <img
                        src={vision}
                        alt="Real estate values"
                        className=" rounded-3 shadow"
                      />
                    )}
                    {activeTab === "values" && (
                      <img
                        src={value}
                        alt="Real estate values"
                        className=" rounded-3 shadow"
                      />
                    )}
                  </div>
                </div>

                {/* Tabs Content Column */}
                <div className="col-lg-6">
                  <ul className="custumtab" role="tablist">
                    <li className="button_tabs_value" role="presentation">
                      <button
                        className={`tabbutton ${
                          activeTab === "mission" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("mission")}
                      >
                        Mission
                      </button>
                    </li>
                    <li className="button_tabs_value" role="presentation">
                      <button
                        className={`tabbutton ${
                          activeTab === "vision" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("vision")}
                      >
                        Vision
                      </button>
                    </li>
                    <li className="button_tabs_value" role="presentation">
                      <button
                        className={`tabbutton ${
                          activeTab === "values" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("values")}
                      >
                        Core Values
                      </button>
                    </li>
                  </ul>

                  <div className="tab-content">
                    {/* Mission */}
                    {activeTab === "mission" && (
                      <div className="tab-pane fade show active">
                        <h2 className="section-title">
                          Our Mission in Real Estate
                        </h2>
                        <div className="mission-point">
                          <div className="mb-3">
                            <p className="point-text">
                              To develop a collaborative relationship based on
                              our ethics and mutual trust and contribute to the
                              growth of the real estate professionals through
                              our valuable trainings and quality service and
                              becoming the leader in the real estate industry.
                            </p>
                            <p className="point-text">
                              To develop a collaborative relationship based on
                              our ethics and mutual trust and contribute to the
                              growth of the real estate professionals through
                              our valuable trainings and quality service and
                              becoming the leader in the real estate industry.
                            </p>
                            <p className="point-text">
                              To develop a collaborative relationship based on
                              our ethics and mutual trust and contribute to the
                              growth of the real estate professionals through
                              our valuable trainings and quality service and
                              becoming the leader in the real estate industry.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Vision */}
                    {activeTab === "vision" && (
                      <div className="tab-pane fade show active">
                        <h2 className="section-title">Our Vision</h2>
                        <ul className="list-unstyled">
                          <li className="ourvisionvalue">
                            <span>
                              To create a positive and energetic environment
                              through events, tours and recognition programs.
                            </span>
                          </li>

                          <li className="ourvisionvalue">
                            <span>
                              To teach ethics to real estate professionals
                              through our value-driven culture.
                            </span>
                          </li>

                          <li className="ourvisionvalue">
                            <span>
                              To educate real estate professionals through our
                              valuable trainings.
                            </span>
                          </li>

                          <li className="ourvisionvalue">
                            <span>
                              To teach ethics to real estate professionals
                              through our value-driven culture.
                            </span>
                          </li>

                          <li className="ourvisionvalue">
                            <span>
                              To build a collaborative relationship with best
                              real estate developers.
                            </span>
                          </li>

                          <li className="ourvisionvalue">
                            <span>
                              To assist real estate professionals to achieve
                              growth and success.
                            </span>
                          </li>

                          <li className="ourvisionvalue">
                            <span>
                              To help real estate buyers get the best value for
                              their money.
                            </span>
                          </li>
                        </ul>
                      </div>
                    )}

                    {/* Core Values */}
                    {activeTab === "values" && (
                      <div className="tab-pane fade show active">
                        <h2 className="section-title mb-4">Our Core Values</h2>
                        <ul className="list-unstyled">
                          <li className="mb-3">
                            <strong>Integrity:</strong> We do the right thing
                            even when no one is watching.
                          </li>
                          <li className="mb-3">
                            <strong>Accountability:</strong> We take ownership
                            and deliver on our promises.
                          </li>
                          <li className="mb-3">
                            <strong>Innovation:</strong> We embrace change and
                            continuously improve.
                          </li>
                          <li className="mb-3">
                            <strong>Empathy:</strong> We listen, understand, and
                            respond with compassion.
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* our value  */}
      {/* blog section  */}
      <section className="blog_section margin_all_section">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <h5
                className="sub_heading"
                data-aos="fade-left"
                data-aos-delay="300"
              >
                News & Blogs
              </h5>
              <h3
                className="main_headin-2"
                data-aos="zoom-in"
                data-aos-delay="300"
              >
                Amazing Articles And Post
              </h3>
            </div>
          </div>
          <div className="row">
            {blog.length > 0 ? (
              blog.slice(0, 6).map((post, index) => (
                <div key={index} className="col-xl-4 col-lg-4 col-md-6 mb-4">
                  <div className="blog_box">
                    <div className="blog_img">
                      <span data-aos="zoomin"
                      data-aos-delay="300">
                        {(() => {
                          const [day, month, year] = post.date.split("-");
                          return new Date(
                            `${year}-${month}-${day}`
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          });
                        })()}
                      </span>
                      <a href={post.link}>
                        {/* <img
                          src={
                            post.image
                              ? `${imageBlogsimage}${post.image}`
                              : notavailable
                          }
                          alt={post.title || "Blog post"}
                          onError={(e) => {
                            e.target.src =
                               notavailable;
                          }}
                        /> */}
                        <img
                          src={
                            post.image
                              ? `${imageBlogsimage}${post.image}`
                              : notavailable
                          }
                          alt={post.title || "Blog post"}
                          onError={(e) => {
                            if (e.currentTarget.src !== notavailable) {
                              e.currentTarget.src = notavailable;
                            }
                          }}
                        />
                      </a>
                    </div>
                    <div
                      className="blog_content mt-3"
                      data-aos="fade-left"
                      data-aos-delay={index * 150}
                    >
                      <h3>
                        <a href={`/blog-details/${post.slug}`}>
                          {post.title
                            ? post.title
                                .toLowerCase()
                                .replace(/\b\w/g, (char) => char.toUpperCase())
                            : "Untitled Post"}
                        </a>
                      </h3>
                      <p>{stripHTML(post.description)}</p>
                      <div className="main_btn"  data-aos="zoomin"
                      data-aos-delay={index * 150}>
                        <a href={`/blog-details/${post.slug}`}>
                          Read More <MdOutlineArrowOutward />
                        </a>
                      </div>
                    </div>
                  </div>
                  {/* <div
                    style={{
                      background: "#fff",
                      border: "1px solid #eee",
                      padding: "20px",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    <div>
                      <div style={{ position: "relative" }}>
                        <span
                          style={{
                            position: "absolute",
                            top: "10px",
                            left: "10px",
                            background: "#000",
                            color: "#fff",
                            padding: "2px 6px",
                            fontSize: "12px",
                            borderRadius: "4px",
                            zIndex: "1",
                          }}
                        >
                          {post.date || "No date"}
                        </span>
                        <a href={post.link || "#"}>
                          <img
                            src={
                              post.image
                                ? `${selectedimagePath}${post.image}`
                                : <img src={notavailable} alt="notavailable"/>
                            }
                            alt={post.title || "Blog post"}
                            style={{
                              width: "100%",
                              height: "200px",
                              objectFit: "cover",
                              borderRadius: "4px",
                            }}
                            onError={(e) => {
                              e.target.src = <img src={notavailable} alt="notavailable"/>;
                            }}
                          />
                        </a>
                      </div>

                      <div style={{ marginTop: "16px", flexGrow: 1 }}>
                        <h3 style={{ fontSize: "20px", fontWeight: "600" }}>
                          <a
                            href={post.link || "#"}
                            style={{ textDecoration: "none", color: "#000" }}
                          >
                            {post.title || "Untitled Post"}
                          </a>
                        </h3>
                        <p style={{ fontSize: "14px", color: "#555" }}>
                          {stripHTML(post.description)}
                        </p>
                      </div>
                    </div>

                    <div style={{ marginTop: "auto" }}>
                      <a
                        href={post.link || "#"}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          color: "#007bff",
                          fontWeight: "500",
                          textDecoration: "none",
                          marginTop: "10px",
                        }}
                      >
                        Read More <MdOutlineArrowOutward />
                      </a>
                    </div>
                  </div> */}
                </div>
              ))
            ) : (
              <div className="col-12 text-center py-5">
                <p>No blog posts available yet.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* blog section  */}
      <Faq />
    </div>
  );
}

export default Index;
