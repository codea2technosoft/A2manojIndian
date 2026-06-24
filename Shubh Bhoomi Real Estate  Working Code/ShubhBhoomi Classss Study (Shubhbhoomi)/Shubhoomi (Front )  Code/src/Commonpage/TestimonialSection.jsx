import { useState, useEffect, useRef } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ImQuotesLeft } from "react-icons/im";
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import google from '../assets/images/google3.svg'
import GoogleReview from '../assets/images/Google-Review-Logo.png'
import { BsPlayBtnFill } from "react-icons/bs";
const imageGallery = `${process.env.REACT_APP_IMAGE_API_URL}/uploads/testimonial/`;

const truncateWords = (text, limit = 40) => {
  if (!text) return ""; // Handle empty text
  const words = text.split(" ");
  return words.length > limit ? words.slice(0, limit).join(" ") + "..." : text;
};



const TestimonialSection = () => {

  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedimagePath, setSelectedimagePath] = useState(null);

  const [showVideo, setShowVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");


  const handlePlayVideo = (video) => {
    setVideoUrl(video);
    setShowVideo(true);
  };

  const closeVideo = () => {
    setShowVideo(false);
    setVideoUrl("");
  };

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {

        const response = await fetch(`${process.env.REACT_APP_API_URL}/testimonial-list?page=1&limit=10`);

        console.warn(response);

        if (!response.ok) {
          throw new Error('Failed to fetch testimonials');
        }
        const data = await response.json();
        console.warn("datadatadatadatadata", data.data)
        setTestimonials(data.data || []);
        setSelectedimagePath(data.imagePath);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);



  const settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    slidesToShow: 2,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 4 } },
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 991, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
      { breakpoint: 576, settings: { slidesToShow: 1 } },
    ],
  };


  const stripHTML = (html) => {
    return html.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim();
  };

  return (
    <section className="margin_all_section pb-70">
      <div className="flat-section bg-primary-new flat-testimonial ">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <h5 className="sub_heading "
                data-aos="fade-left"
                data-aos-delay="300">

                Our Testimonials
              </h5>
              <h3 className="main_headin-2" data-aos="zoom-in"
                data-aos-delay="300">What's people say's</h3>
              <p data-aos="fade-left" data-aos-delay="300">
                Our seasoned team excels in real estate with years of successful market navigation.

              </p>
            </div>
          </div>

        </div>

        <div className="container">
          <div className="row">
            <div className="col-md-3">
              <div className="customer-feedback-left">

                <a href="#" className="trustpilot">
                  <h5>Excellent!</h5>
                  <div className="star">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} color="#00b67a" />
                    ))}
                  </div>
                  <span>Based On <strong>2348</strong> Reviews</span>
                  <img
                    className="logo"
                    src={GoogleReview}
                    alt="Trustpilot Logo"
                  />
                </a>

                {/* Google Rating */}
                <a href="#" className="google">
                  <img
                    className="logo"
                    src={google}
                    alt="Google Logo"
                  />
                  <div className="star">
                    <ul>
                      <li className="active"><FaStar color="#FFD700" /></li>
                      <li><FaStar color="#FFD700" /></li>
                      <li><FaStar color="#FFD700" /></li>
                      <li><FaStar color="#FFD700" /></li>
                      <li><FaStarHalfAlt color="#FFD700" /></li>
                    </ul>
                  </div>
                  <span>Based On <strong>1448</strong> Reviews</span>
                </a>
              </div>
            </div>
            <div className="col-md-9">
              <div className="testimonial-carousel-container">
                <Slider {...settings}>
                  {testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="px-3">
                      <div className="box-tes-item rounded shadow bg-white">
                        <span className="icon icon-quote"><ImQuotesLeft /></span>
                        <p className="note body-2 mt-3">
                          "{truncateWords(stripHTML(testimonial.description))}"
                        </p>
                        <div className="box-avt d-flex align-items-center gap-3">
                          <div className="d-flex w-75 gap-2">
                            <div className="avatar avt-60 round">
                              <img src={`${imageGallery}${testimonial.image}`} alt={testimonial.name} />
                            </div>
                            <div className="info">
                              <h6 className="mb-0">{testimonial.name}</h6>
                              <p className="caption-2 text-muted">{testimonial.degination}</p>
                              <ul className="list-star d-flex">
                                {Array(5).fill(0).map((_, i) => (
                                  <li key={i} className="icon icon-star text-warning">★</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          <div className="videoclip w-25">
                            <span className="icon icon-quote position-relative" onClick={() => handlePlayVideo(testimonial.vedioclips_reels)}>
                              <BsPlayBtnFill /> </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </Slider>

                {showVideo &&
                  testimonials.map((testimonial, index) => (
                    <div className="video-modal" key={index}>
                      <div className="video-overlay" onClick={closeVideo}></div>

                      <div className="video-content">
                        <button className="close-btn" onClick={closeVideo}>✖</button>

                        <video autoPlay>
                          <source
                            src={`${imageGallery}${testimonial.vedioclips_reels}`}
                            type="video/mp4"
                          />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    </div>
                  ))
                }

              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default TestimonialSection;