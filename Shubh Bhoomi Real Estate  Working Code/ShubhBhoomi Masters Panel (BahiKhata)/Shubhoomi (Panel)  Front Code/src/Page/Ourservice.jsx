import React from "react";
import {
  FaHome,
  FaSearch,
  FaBuilding,
  FaHandshake,
  FaCheck,
  FaPhone,
  FaWhatsapp,
} from "react-icons/fa";
import tigerimage from "../assets/images/tigerimage.png";
import { Link } from "react-router-dom";
import PageTitle from "../Include/Pagetitle";
const Ourservice = () => {
  return (
    <div className="land-broker-services pb-70">
      <PageTitle />

      {/* 2. Service Categories Grid */}
      <section className="service-categories">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <h5 className="sub_heading ">Our Service</h5>
              <h3 className="main_headin-2 ">Comprehensive Services</h3>
              <p className="">
                Find answers to common questions about our real estate services
              </p>
            </div>
          </div>
          <div className="category-grid">
            {/* For Property Owners */}
            <div className="category-card">
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
            <div className="category-card">
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
            <div className="category-card">
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

      {/* 3. Detailed Service Blocks */}
      <section className="detailed-services">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <h5 className="sub_heading ">Details Service</h5>
              <h3 className="main_headin-2 text-white">Why Choose Us</h3>
              <p className="text-white">
                Find answers to common questions about our real estate services
              </p>
            </div>
          </div>

          <div className="service-grid">
            <div className="service-card">
              <div className="service-icon">🔍</div>
              <h3>Property Search & Selection</h3>
              <p>
                Expert guidance to find your perfect home or investment
                property.
              </p>
            </div>

            <div className="service-card">
              <div className="service-icon">🏠</div>
              <h3>Home Buying Assistance</h3>
              <p>
                End-to-end support from viewing to closing on your dream home.
              </p>
            </div>

            <div className="service-card">
              <div className="service-icon">📈</div>
              <h3>Market Analysis</h3>
              <p>
                Data-driven insights on neighborhood trends and property values.
              </p>
            </div>

            <div className="service-card">
              <div className="service-icon">🤝</div>
              <h3>Negotiation Services</h3>
              <p>Skilled deal-making to get you the best terms and price.</p>
            </div>

            <div className="service-card">
              <div className="service-icon">📝</div>
              <h3>Contract Review</h3>
              <p>
                Professional examination of all purchase agreements and
                documents.
              </p>
            </div>

            <div className="service-card">
              <div className="service-icon">🏗️</div>
              <h3>New Construction Advisory</h3>
              <p>
                Guidance through the process of buying newly built properties.
              </p>
            </div>

            <div className="service-card">
              <div className="service-icon">💰</div>
              <h3>Investment Property Consulting</h3>
              <p>Identify high-potential rental and flip opportunities.</p>
            </div>

            <div className="service-card">
              <div className="service-icon">📊</div>
              <h3>Comparative Market Analysis</h3>
              <p>Accurate pricing strategy based on recent comparable sales.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="margin_all_section">
        {/* 7. CTA Section */}
        <div className="container">
          <div className="cta-section">
            <h2>Ready to Buy or Invest?</h2>
            <p>
              Get expert assistance for all your real estate needs — from
              verified listings and legal support to investment guidance and
              hassle-free transactions.
            </p>
            <div className="cta-buttons">
              <Link to="/contact-us">
                <button className="primary-cta">Get in Touch</button>
              </Link>
              <Link to="/contact-us">
                <button className="secondary-cta">Schedule a Free Call</button>
              </Link>
            </div>
            <div className="image_alloverlay">
              <img src={tigerimage} alt="tigerimage" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ourservice;
