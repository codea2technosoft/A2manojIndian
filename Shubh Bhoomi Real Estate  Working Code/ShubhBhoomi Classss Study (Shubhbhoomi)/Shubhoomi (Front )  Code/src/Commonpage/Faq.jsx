import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import faqimage from '../assets/images/faqimage.jpg';


const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqData = [
    {
      question: "How do I search for properties on your website?",
      answer: "You can use our search bar at the top of the page to filter properties by location, price range, property type, and more. You can also browse our featured listings or use the map view to explore properties in specific areas."
    },
    {
      question: "What information do I need to provide to schedule a viewing?",
      answer: "To schedule a property viewing, you'll need to provide your name, contact information, preferred date and time, and the property ID or address you're interested in. Our agent will then contact you to confirm the appointment."
    },
    {
      question: "How does the buying process work?",
      answer: "Our buying process typically involves: 1) Property search and selection, 2) Property viewing, 3) Making an offer, 4) Mortgage application (if needed), 5) Property survey, 6) Exchange of contracts, and 7) Completion. Our agents will guide you through each step."
    },
    {
      question: "What fees should I expect when purchasing a property?",
      answer: "When purchasing a property, you may encounter several fees including: Stamp Duty Land Tax, solicitor fees, survey costs, mortgage arrangement fees, valuation fees, and moving costs. The exact fees depend on the property price and your circumstances."
    },
    {
      question: "How long does the rental application process take?",
      answer: "The rental application process typically takes 3-5 business days once all required documents are submitted. This includes reference checks, credit checks, and preparing the tenancy agreement. In some cases, it may take longer if references are delayed."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-12 text-center">
            <h5 className="sub_heading"
                  data-aos="fade-left"
                  data-aos-delay="300">
              FAQ
            </h5>
            <h3 className="main_headin-2" data-aos="zoom-in"
                  data-aos-delay="300">Frequently Asked Questions</h3>
            <p data-aos="fade-left" data-aos-delay="300">
              Find answers to common questions about our real estate services
            </p>
          </div>
        </div>

      </div>
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <div className="faq-container">
              {faqData.map((item, index) => (
                <div
                  key={index}
                  className={`faq-item ${activeIndex === index ? 'active' : ''}`}
                >
                  <div
                    className="faq-question"
                    onClick={() => toggleFAQ(index)}
                  >
                    <h3>{item.question}</h3>
                    <span className="faq-icon">
                      {activeIndex === index ? <FiChevronUp /> : <FiChevronDown />}
                    </span>
                  </div>
                  <div className="faq-answer">
                    <p>{item.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-md-6">
            <div className="faq-image" data-aos="fade-up" data-aos-delay="300">
              <div className="contentfaq">
                <h3>Get in Touch With Us</h3>
                <p>Reach out today for expert real estate advice, personalized support, and a dedicated team ready to guide you every step of the way.</p>
                <div className="buttonconsultation">
                  <a href="/contact-us" class="tf-btn btn-bg-1 btn-px-28">
                    Schedule a Consultation
                    <span class="bg-effect"></span>
                  </a>
                </div>
              </div>
              <img src={faqimage} alt="faqimage" />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default FAQ;