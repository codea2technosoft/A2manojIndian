import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import { Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;
const imagesURL = `${process.env.REACT_APP_IMAGE_API_URL}/uploads/lead`;

const PropertyLeadDetails = () => {
  const { id } = useParams();
  const [leadData, setLeadData] = useState(null);
  const [leadResponseList, setLeadResponseList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const itemsPerPage = 1; // You can set this as per your need

  const getAuthToken = () => localStorage.getItem("token");

  const fetchLeadDetails = async () => {
    try {
      const response = await fetch(`${API_URL}/property-lead-edit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();
      console.log("API Result:", result);

      if (result.status === "1" && result.data) {
        setLeadData(result.data); // 👈 main data
        setLeadResponseList(result.lead_reponse_list || []); // 👈 lead responses
      } else {
        setLeadData(null);
        setLeadResponseList([]);
      }
    } catch (err) {
      console.error("Error fetching lead details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeadDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
        <p className="mt-3">Loading property lead details...</p>
      </div>
    );
  }

  if (!leadData) {
    return <p className="text-center text-danger fw-bold">No data found!</p>;
  }

  const toSentenceCase = (text) => {
    if (!text) return "-";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  //////lead history pagination
  const totalPages = Math.ceil(leadResponseList.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = leadResponseList.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="py-4">
      <div className="card">
        <div className="card-header">
          <div className="d-flex align-items-center justify-content-between">
            <div className="titlepage">
            <h3 className="mb-0">Property Lead Details</h3>
            </div>
            <button className="submit_button" onClick={() => navigate(-1)}>
              ← Back
            </button>
          </div>
        </div>
        <div className="card-body">
          {/* 🧾 Main Lead Details Table */}
          <div className="table-reponsive">
            <Table bordered>
              <tbody>
                <tr>
                  <th>Project Name</th>
                  <td>{toSentenceCase(leadData.project_name)}</td>
                </tr>


                <tr>
                  <th>Block Name</th>
                  <td>{toSentenceCase(leadData.block_name)}</td>
                </tr>
                <tr>
                  <th>Unit Name</th>
                  <td>{toSentenceCase(leadData.plot_name)}</td>
                </tr>

                <tr>
                  <th>Unit/Shop/Villa No.</th>
                  <td>{toSentenceCase(leadData.plot_shop_villa_no)}</td>
                </tr>


                <tr>
                  <th>Unit Area ( SQYD )</th>
                  <td><strong>{leadData.area_sqyd ?? "0.00"}</strong></td>
                </tr>

                <tr>
                  <th>Unit Rate (Per SQYD )</th>
                  <td> ₹ <strong>{leadData.rate ?? "0.00"}</strong>
                  </td>

                </tr>

                <tr>
                  <th>Total Amount</th>
                  <td>
                    ₹ <strong>{leadData.area_sqyd * leadData.rate ?? "0.00"}</strong>
                  </td>
                </tr>

                <tr>
                  <th>PLC Amount</th>
                  <td>
                    <strong>{leadData.plc_amount ?? "0.00"}</strong>
                  </td>

                </tr>

                <tr>
                  <th>Business Volume (BV)</th>
                  <td>
                    <strong>{leadData.bv ?? "0.00"}</strong>
                  </td>

                </tr>


                <tr>
                  <th>Customer Name</th>
                  <td>{toSentenceCase(leadData.customer_name)}</td>
                </tr>

                <tr>
                  <th>Lead ID</th>
                  <td>{leadData.order_id}</td>
                </tr>

                <tr>
                  <th>Mobile</th>
                  <td>{leadData.mobile}</td>
                </tr>
                <tr>
                  <th>Income Source</th>
                  <td>{toSentenceCase(leadData.income_source)}</td>
                </tr>

                <tr>
                  <th>Lead Response</th>
                  <td><div className="table-cell-remark">{toSentenceCase(leadData.lead_response)}</div></td>
                </tr>

                <tr>
                  <th>Aadhar Number</th>
                  <td>{leadData.adhar_card_number}</td>
                </tr>
                <tr>
                  <th>PAN Number</th>
                  <td>{leadData.pan_card_number}</td>
                </tr>
                <tr>
                  <th>Status</th>
                  <td>{toSentenceCase(leadData.status)}</td>
                </tr>
                <tr>
                  <th>Created By</th>
                  <td>{toSentenceCase(leadData.created_by)}</td>
                </tr>
                <tr>
                  <th>Lead Date</th>
                  <td>{leadData.date_time}</td>
                </tr>
                <tr>
                  <th>Aadhar Front</th>
                  <td>
                    <a
                      href={`${imagesURL}/${leadData.adhar_front_image}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={`${imagesURL}/${leadData.adhar_front_image}`}
                        alt="Aadhar Front"
                        height="100"
                        width="100"
                        style={{ cursor: "pointer" }}
                      />
                    </a>
                  </td>
                </tr>
                <tr>
                  <th>Aadhar Back</th>
                  <td>
                    <img
                      src={`${imagesURL}/${leadData.adhar_back_image}`}
                      alt="Aadhar Back"
                      height="100"
                      width="100"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        const newTab = window.open(
                          `${imagesURL}/${leadData.adhar_back_image}`,
                          "_blank"
                        );
                        setTimeout(() => {
                          const link = document.createElement("a");
                          link.href = `${imagesURL}/${leadData.adhar_back_image}`;
                          link.download = leadData.adhar_back_image;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }, 500);
                      }}
                    />
                  </td>
                </tr>
                <tr>
                  <th>PAN Card</th>
                  <td>
                    <img
                      src={`${imagesURL}/${leadData.pan_card_image}`}
                      alt="PAN Card"
                      height="100"
                      width="100"
                    />
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
          {/* {leadResponseList.length > 0 && (
            <div className="mt-5">
              <h4 className="mb-3">Lead Response History</h4>
              <Table bordered responsive>
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Response</th>
                    <th>Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((response, index) => (
                    <tr key={response.id}>
                      <td>{indexOfFirstItem + index + 1}</td>
                      <td>{toSentenceCase(response.lead_response)}</td>
                      <td>{response.date_time}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div className="d-flex justify-content-between align-items-center mt-4">
              
                <button
                  className="btn btn-outline-primary"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  ⬅ Previous
                </button>
                <div className="d-flex">
                  <ul className="pagination mb-0">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <li
                        key={i + 1}
                        className={`page-item ${
                          currentPage === i + 1 ? "active" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(i + 1)}
                        >
                          {i + 1}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  className="btn btn-outline-primary"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next ➡
                </button>
              </div>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default PropertyLeadDetails;
