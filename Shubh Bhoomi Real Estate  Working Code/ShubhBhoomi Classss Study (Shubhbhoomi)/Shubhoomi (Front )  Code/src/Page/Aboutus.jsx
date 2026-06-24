import React, { useState, useEffect } from 'react';
import { FaPlay, FaMapMarkerAlt, FaLayerGroup, FaChartBar, FaFileSignature, FaMap, FaHome, FaHandHoldingUsd, FaHeadset, FaUsers } from 'react-icons/fa';
import TestimonialSection from '../Commonpage/TestimonialSection';
import PageTitle from '../Include/Pagetitle';

// Import images (adjust paths as needed)
import plotDesign from '../assets/images/category/plot-design.png';
import landSurvey from '../assets/images/category/land-survey.png';
import zoning from '../assets/images/category/zoning.png';
import legal from '../assets/images/category/legal.png';

function Aboutus() {
    // State for counters
    const [counters, setCounters] = useState({
        projects: 0,
        clients: 0,
        acres: 0
    });

    // Counter animation function
    useEffect(() => {
        const animateCounters = () => {
            const duration = 2000;
            const startTime = Date.now();

            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);

                setCounters({
                    projects: Math.floor(progress * 250),
                    clients: Math.floor(progress * 185),
                    acres: Math.floor(progress * 500)
                });

                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };

            animate();
        };

        animateCounters();
    }, []);

    return (
        <div className='aboutsection'>
            <PageTitle />
            <div className="margin_all_section">
            <div className="about-section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 col-md-12">
                            <div className="testimonial-video">
                                <div className="overlayabout op-3"></div>
                                <div className="testimonial-btn">
                                    <a
                                        href="https://www.youtube.com/watch?v=EFB33r7u4tY"
                                        className="property-yt hvr-ripple-out"
                                    >
                                        <FaPlay className="play-icon" />
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-12">
                            <div className="row">
                                <div className="col-12 text-start">
                                    <h5 className="sub_heading">

                                        Precision Land Development Solutions
                                    </h5>
                                    <h3 className="main_headin-2">Expert Plotting Services for Your Property Vision</h3>

                                </div>
                            </div>

                            <div className="about-text res-box">
                                <p>
                                    As professional plotting providers, we specialize in transforming raw land into perfectly planned properties.
                                    Our team combines technical expertise with creative vision to deliver customized plotting solutions that
                                    maximize land potential while complying with all regulations. Whether you're developing residential communities,
                                    commercial complexes, or agricultural land, we provide end-to-end plotting services from initial survey to
                                    final layout approval.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
</div>
            <div className="margin_all_section">

            <div className="promo-section v2">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-5 col-lg-12">
                             <div className="row">
                                <div className="col-12 text-start">
                                    <h5 className="sub_heading">

                                     Why Partner With Us
                                    </h5>
                                    <h3 className="main_headin-2">Our Plotting Advantages</h3>

                                </div>
                            </div>
                            <div className="promo-desc">
                              
                                <div className="promo-text">
                                    <p>
                                        With decades of combined experience in land development, we bring unparalleled precision to every project.
                                        Our advanced surveying technology and planning expertise ensure optimal land utilization while preserving
                                        natural features. We navigate complex zoning regulations so you don't have to, saving you time and
                                        minimizing development risks.
                                    </p>
                                </div>

                                <div className="property-plotting mt-4">
                                    <h4 className="mb-3">Core Plotting Services</h4>
                                    <ul className="plotting-features">
                                        <li><div className="icon_list">
                                            <FaMapMarkerAlt className="feature-icon" /></div> <p className='mb-0'>Precise topographic surveys and boundary marking</p></li>
                                        <li><div className="icon_list"><FaLayerGroup className="feature-icon" /></div> <p className='mb-0'>3D terrain modeling and visualization</p></li>
                                        <li><div className="icon_list"><FaChartBar className="feature-icon" /></div> <p className='mb-0'>Feasibility studies and ROI analysis</p></li>
                                        <li><div className="icon_list"><FaFileSignature className="feature-icon" /> </div><p className='mb-0'>Permitting and regulatory compliance</p></li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="col-xl-7 col-lg-12">
                            <div className="row">
                                {/* Full width top item */}
                                <div className="col-md-6">
                                    <div className="promo-content">
                                        <img src={plotDesign} alt="Custom Plot Designs" />
                                        <h4>Custom Plot Designs</h4>
                                        <p>Tailored layouts that maximize usable space while maintaining aesthetic appeal and functionality</p>
                                    </div>
                                </div>

                                {/* Two column items */}
                                <div className="col-md-6">
                                    <div className="promo-content">
                                        <img src={landSurvey} alt="Advanced Surveying" />
                                        <h4>Advanced Surveying</h4>
                                        <p>Precision GPS and drone technology for accurate land measurements and topography mapping</p>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="promo-content">
                                        <img src={zoning} alt="Zoning Analysis" />
                                        <h4>Zoning Analysis</h4>
                                        <p>Comprehensive evaluation of local regulations to ensure compliant and optimal land use</p>
                                    </div>
                                </div>

                                {/* Two column items */}
                                <div className="col-md-6">
                                    <div className="promo-content">
                                        <img src={legal} alt="Legal Documentation" />
                                        <h4>Legal Documentation</h4>
                                        <p>Preparation of all necessary plotting documents for approval and recording</p>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
            <TestimonialSection />

        </div>

    );
}

export default Aboutus;