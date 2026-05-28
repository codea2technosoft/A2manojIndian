import React, { useRef, useState, useEffect } from "react";
import { FaBuilding, FaCalendarAlt, FaIdBadge, FaBriefcase, FaDownload } from "react-icons/fa";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { IoLocationSharp } from "react-icons/io5";
import { PiGlobeLight } from "react-icons/pi";
import { SlCalender } from "react-icons/sl";
import { MdOutlineMail } from "react-icons/md";
import { Link } from "react-router-dom";
import DummyUser from "../../assets/images/dummy_profile.png"

const API_URL = process.env.REACT_APP_API_URL;
const profileImage = `${process.env.REACT_APP_IMAGE_API_URL}/uploads/profile/`;

const Idcard = () => {
  const [profile, setProfile] = useState(null);
  const [general, setGeneral] = useState(null);
  const [loading, setLoading] = useState(true);
  const cardRef = useRef();

  const getAuthToken = () => localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = getAuthToken();
      if (!token) return setLoading(false);

      try {
        const res = await fetch(`${API_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data.status === "1") setProfile(data.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchGeneral = async () => {
      const token = getAuthToken();
      if (!token) return setLoading(false);

      try {
        const res = await fetch(`${API_URL}/site-setting`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data.status === "1") setGeneral(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    fetchGeneral();
  }, []);

  if (loading) return <p>Loading...</p>;

  // Function to generate PDF


  // const downloadPDF = async () => {
  //   const element = cardRef.current;

  //   // Wait for all images to load
  //   const images = element.getElementsByTagName("img");
  //   await Promise.all(
  //     Array.from(images).map(
  //       (img) =>
  //         new Promise((resolve) => {
  //           if (img.complete) resolve();
  //           else img.onload = img.onerror = resolve;
  //         })
  //     )
  //   );

  //   // Capture the element to canvas
  //   const canvas = await html2canvas(element, {
  //     scale: 2,
  //     useCORS: true,
  //     allowTaint: true,
  //   });

  //   const imgData = canvas.toDataURL("image/png");
  //   const pdf = new jsPDF("p", "mm", "a4");
  //   const pdfWidth = pdf.internal.pageSize.getWidth();
  //   const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  //   pdf.addImage(imgData, "PNG", 10, 10, pdfWidth - 20, pdfHeight);
  //   pdf.save(`${profile?.username || "Employee"}_ID_Card.pdf`);
  // };
  const downloadPDF = async () => {
    const element = cardRef.current;

    // Wait for all images to load
    const images = element.getElementsByTagName("img");
    await Promise.all(
      Array.from(images).map(
        (img) =>
          new Promise((resolve) => {
            if (img.complete) resolve();
            else img.onload = img.onerror = resolve;
          })
      )
    );

    // Capture the element to canvas with a lower scale
    const canvas = await html2canvas(element, {
      scale: 2, // Reduce the scale to avoid zooming in too much
      useCORS: true,
      allowTaint: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    // Adjust image width and height for a more fitting result in PDF
    const margin = 10;
    const adjustedWidth = pdfWidth - 2 * margin;
    const adjustedHeight = (canvas.height * adjustedWidth) / canvas.width;

    // Add the image with adjusted width and height
    pdf.addImage(imgData, "PNG", margin, margin, adjustedWidth, adjustedHeight);

    // Save the PDF with the profile name or default "Employee"
    pdf.save(`${profile?.username || "Employee"}_ID_Card.pdf`);
  };


  return (
    <section className="idcard_new_design mt-3">
      <div className="card">
        <div className="card-header">
          <div className="d-flex justify-content-between align-items-center">
            <div className="titlepage">
              <h3> View ID Card Details : </h3>
            </div>
            <div className="backbutton">
              <Link to='/dashboard'>Back</Link>
            </div>
          </div>
        </div>

        <div className="card-body">
          <div className="idcard-card" ref={cardRef}>
            <div className="idcard-content">
              <div className="watermarkdesign">
                <img
                  src={`${process.env.PUBLIC_URL}logo.png`}
                  alt="logo"
                  className="logo-lg"
                />
              </div>

              {/* Left Section */}
              <div className="idcard-left-section">
                <div className="idcard-photo-container">
                  <img
                    src={
                      profile?.profile
                        ? `${profileImage}${profile.profile.replace(/^\/+/, "")}`
                        : {DummyUser}
                    }
                    alt="Profile"
                    className="rounded-circle profile_designall"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => {e.target.src = DummyUser;  }}
                  />
                </div>

                {profile && (
                  <>
                    <div className="idcard-employee-info mb-0">
                      <h2 className="idcard-name">
                        {profile.username?.charAt(0).toUpperCase() + profile.username?.slice(1)}
                      </h2>
                      <p className="idcard-id">
                        ID: {profile.mobile}
                      </p>
                    </div>
                    {profile && (
                      <>


                        <div className="idcard-detail-row my-1 text-center">

                          <div className="idcard-detail-text">
                            <div className="idcard-detail-label text-white">Date Of Joining</div>
                            <div className="design_name text-white">{profile.date}</div>
                          </div>
                        </div>
                      </>
                    )}
                    <div className="idcard-logo-container">
                      <div className="idcard-logo">
                        <img
                          src={`${process.env.PUBLIC_URL}logo.png`}
                          alt="logo"
                          className="logo-lg"
                        />
                      </div>
                      <p className="idcard-logo-text">Shubh Bhoomi Real Estates</p>
                    </div>
                  </>
                )}
              </div>

              {/* Right Section */}
              <div className="idcard-right-section">
                <div className="idcard-badge">VERIFIED</div>
                <div className="idcard-details-container">
                  {profile && (
                    <>
                      <div className="idcard-detail-row">
                        <FaBriefcase className="idcard-icon" />
                        <div className="idcard-detail-text">
                          <div className="idcard-detail-label">Designation</div>
                          <div className="design_name">{profile.designation || "Employee"}</div>
                        </div>
                      </div>

                      <div className="idcard-detail-row">
                        <SlCalender className="idcard-icon" />
                        <div className="idcard-detail-text">
                          <div className="idcard-detail-label">Date Of Birth</div>
                          <div className="design_name">{(() => {
                            const date = new Date(profile.dob);
                            const day = String(date.getDate()).padStart(2, "0");
                            const month = String(date.getMonth() + 1).padStart(2, "0");
                            const year = date.getFullYear();
                            return `${day}-${month}-${year}`;
                          })()}</div>
                        </div>
                      </div>
                    </>
                  )}

                  {general && (
                    <>

                      <div className="idcard-detail-row">
                        <MdOutlineMail className="idcard-icon" />
                        <div className="idcard-detail-text">
                          <div className="idcard-detail-label">E-mail</div>
                          <div className="design_name">
                            {general.email_id}
                          </div>
                        </div>
                      </div>
                      <div className="idcard-detail-row">
                        <PiGlobeLight className="idcard-icon" />
                        <div className="idcard-detail-text">
                          <div className="idcard-detail-label">Site Url</div>
                          <div className="design_name">
                            <span style={{ color: "#003eb5" }}>  {general.site_url}</span>
                          </div>
                        </div>
                      </div>
                      <div className="idcard-detail-row">
                        <IoLocationSharp className="idcard-icon" />
                        <div className="idcard-detail-text">
                          <div className="idcard-detail-label">Address</div>
                          <div className="design_name">
                            {general.address}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Download Button */}
          <div className="button-card" style={{ marginTop: "10px" }}>
            <button onClick={downloadPDF} className="idcard-download-button">
              <FaDownload className="idcard-download-icon" /> Download ID Card
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Idcard;
