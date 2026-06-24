import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import { Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;
const imagesURL = `${process.env.REACT_APP_IMAGE_API_URL}/uploads/loanlead`;

const LoandDetails = () => {
  const { id } = useParams();
  const [leadData, setLeadData] = useState(null);
  const [leadResponseList, setLeadResponseList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const itemsPerPage = 50; // You can set this as per your need

  const getAuthToken = () => localStorage.getItem("token");

  const fetchLeadDetails = async () => {
    try {
      const response = await fetch(`${API_URL}/loan-lead-edit`, {
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
        <p className="mt-3">Loading loan details...</p>
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

  // const renderMedia = (filePath, label) => {
  //   if (!filePath) return <span>No file</span>;

  //   const extension = filePath.split(".").pop().toLowerCase();
  //   const isImage = ["jpg", "jpeg", "png", "jfif"].includes(extension);
  //   const fullPath = `${imagesURL}/${filePath}`;

  //   return isImage ? (
  //     <img src={fullPath} alt={label} height="100" width="100" />
  //   ) : extension === "pdf" ? (
  //     <a
  //       href={fullPath}
  //       target="_blank"
  //       rel="noopener noreferrer"
  //       className="btn btn-sm btn-primary"
  //     >
  //       View PDF
  //     </a>
  //   ) : (
  //     <span>Unsupported File</span>
  //   );
  // };

  const renderMedia = (filePath, label) => {
    if (!filePath) return <span>No file</span>;

    const extension = filePath.split(".").pop().toLowerCase();
    const isImage = ["jpg", "jpeg", "png", "jfif"].includes(extension);
    const fullPath = `${imagesURL}/${filePath}`;

    return isImage ? (
      <a href={fullPath} target="_blank" rel="noopener noreferrer">
        <img
          src={fullPath}
          alt={label}
          height="100"
          width="100"
          style={{ cursor: "pointer" }}
        />
      </a>
    ) : extension === "pdf" ? (
      <a
        href={fullPath}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-sm btn-primary"
      >
        View PDF
      </a>
    ) : (
      <span>Unsupported File</span>
    );
  };

  return (
    <div className="padding_15">
      <div className="card">
        <div className="card-header">
          <div className="d-flex align-items-center justify-content-between">
            <div class="titlepage mb-0">
              <h3>Loan List</h3>
            </div>
            <button className="btn btn-primary" onClick={() => navigate(-1)}>
              ← Back
            </button>
          </div>
        </div>
        <div className="card-body">
          {/* 🧾 Main Lead Details Table */}
                        <div className="table-responsive">

          <Table bordered className="table">
            <tbody>
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
                <td>{toSentenceCase(leadData.lead_response)}</td>
              </tr>
              <tr>
                <th>Category</th>
                <td>{toSentenceCase(leadData.category)}</td>
              </tr>
              <tr>
                <th>Service</th>
                <td>{toSentenceCase(leadData.service)}</td>
              </tr>
              <tr>
                <th>Aadhar Number </th>
                <td>{leadData.adhar_number}</td>
              </tr>
              <tr>
                <th>Pan Number</th>
                <td>{leadData.pan_card_number}</td>
              </tr>
              <tr>
                <th>State</th>
                <td>{toSentenceCase(leadData.state)}</td>
              </tr>
              <tr>
                <th>City </th>
                <td>{toSentenceCase(leadData.city)}</td>
              </tr>
              <tr>
                <th>Monthly Income</th>
                <td>{leadData.monthly_income}</td>
              </tr>
              <tr>
                <th>monthly EMI</th>
                <td>{leadData.monthly_emi}</td>
              </tr>
              <tr>
                <th>Cibil Score</th>
                <td>{leadData.cibil_score}</td>
              </tr>
              <tr>
                <th>Cibil Score Value</th>
                <td>{leadData.cibil_score_value}</td>
              </tr>{" "}
              <tr>
                <th>Require Loan Amount</th>
                <td>{leadData.require_loan_amount}</td>
              </tr>
              <tr>
                <th>Pincode</th>
                <td>{leadData.pincode}</td>
              </tr>
              <tr>
                <th>Location</th>
                <td>{leadData.location}</td>
              </tr>
              {/* <tr>
            <th>Current Residence Proof</th>
            <td>{leadData.current_residence_proof}</td>
          </tr>
          <tr>
            <th>Permanent Address Proof</th>
            <td>{leadData.permanent_address_proof}</td>
          </tr>{" "}
          <tr>
            <th>EmployeeProof Bussiness Registration</th>
            <td>{leadData.employeeProof_bussinessRegistration}</td>
          </tr>{" "} */}
              <tr>
                <th>Date</th>
                <td>{leadData.date_time}</td>
              </tr>{" "}
              <tr>
                <th>Status</th>
                <td>{toSentenceCase(leadData.status)}</td>
              </tr>{" "}
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
                {/* <td>
                    <img
                      src={`${imagesURL}/${leadData.adhar_front_image}`}
                      alt="Aadhar Front"
                      height="100"
                      width="100"
                    />
                  </td> */}

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
                  <a
                    href={`${imagesURL}/${leadData.adhar_back_image}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={`${imagesURL}/${leadData.adhar_back_image}`}
                      alt="Aadhar Back"
                      height="100"
                      width="100"
                      style={{ cursor: "pointer" }}
                    />
                  </a>
                </td>
              </tr>
              <tr>
                <th>PAN Card</th>
                <td>
                  <a
                    href={`${imagesURL}/${leadData.pan_card_image}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={`${imagesURL}/${leadData.pan_card_image}`}
                      alt="PAN Card"
                      height="100"
                      width="100"
                      style={{ cursor: "pointer" }}
                    />
                  </a>
                </td>
              </tr>
              {/* <tr>
            <th>Current Residence Poof</th>
            <td>
              <img
                src={`${imagesURL}/${leadData.current_residence_proof}`}
                alt="Current Residence Proof"
                height="100"
                width="100"
              />
            </td>
          </tr>
          <tr>
            <th>Current Address Poof</th>
            <td>
              <img
                src={`${imagesURL}/${leadData.permanent_address_proof}`}
                alt="Current Address Proof"
                height="100"
                width="100"
              />
            </td>
          </tr>
          <tr>
            <th>Employee Bussiness Registration Proof</th>
            <td>
              <img
                src={`${imagesURL}/${leadData.employeeProof_bussinessRegistration}`}
                alt="Employee Bussiness Registration Proof"
                height="100"
                width="100"
              />
            </td>
          </tr>
          <tr>
            <th>Salary Slip</th>
            <td>
              <img
                src={`${imagesURL}/${leadData.salary_slip}`}
                alt="Salary Slip"
                height="100"
                width="100"
              />
            </td>
          </tr>
          <tr>
            <th>ITR IMAGE</th>
            <td>
              <img
                src={`${imagesURL}/${leadData.itr}`}
                alt="ITR IMAGE"
                height="100"
                width="100"
              />
            </td>
          </tr>
          <tr>
            <th>Form16 IMAGE</th>
            <td>
              <img
                src={`${imagesURL}/${leadData.form16}`}
                alt="Form 16  IMAGE"
                height="100"
                width="100"
              />
            </td>
          </tr>
          <tr>
            <th>Bank Statement</th>
            <td>
              <img
                src={`${imagesURL}/${leadData.bank_statement}`}
                alt="Bank Statement IMAGE"
                height="100"
                width="100"
              />
            </td>
          </tr>
          <tr>
            <th>Bank Statement Current Account</th>
            <td>
              <img
                src={`${imagesURL}/${leadData.bank_statement_current_account}`}
                alt="Bank Statement Current Account"
                height="100"
                width="100"
              />
            </td>
          </tr>
          <tr>
            <th>GST Return</th>
            <td>
              <img
                src={`${imagesURL}/${leadData.gst_return}`}
                alt="GST Return"
                height="100"
                width="100"
              />
            </td>
          </tr>
          <tr>
            <th>Property Paper</th>
            <td>
              <img
                src={`${imagesURL}/${leadData.property_paper}`}
                alt="Property Paper"
                height="100"
                width="100"
              />
            </td>
          </tr> */}
              <tr>
                <th>Current Residence Proof</th>
                <td>
                  {renderMedia(
                    leadData.current_residence_proof,
                    "Current Residence Proof"
                  )}
                </td>
              </tr>
              <tr>
                <th>Current Address Proof</th>
                <td>
                  {renderMedia(
                    leadData.permanent_address_proof,
                    "Current Address Proof"
                  )}
                </td>
              </tr>
              <tr>
                <th>Employee Business Registration Proof</th>
                <td>
                  {renderMedia(
                    leadData.employeeProof_bussinessRegistration,
                    "Employee Business Registration Proof"
                  )}
                </td>
              </tr>
              <tr>
                <th>Salary Slip</th>
                <td>{renderMedia(leadData.salary_slip, "Salary Slip")}</td>
              </tr>
              <tr>
                <th>ITR IMAGE</th>
                <td>{renderMedia(leadData.itr, "ITR IMAGE")}</td>
              </tr>
              <tr>
                <th>Form16 IMAGE</th>
                <td>{renderMedia(leadData.form16, "Form16 IMAGE")}</td>
              </tr>
              <tr>
                <th>Bank Statement</th>
                <td>
                  {renderMedia(leadData.bank_statement, "Bank Statement")}
                </td>
              </tr>
              <tr>
                <th>Bank Statement Current Account</th>
                <td>
                  {renderMedia(
                    leadData.bank_statement_current_account,
                    "Bank Statement Current Account"
                  )}
                </td>
              </tr>
              <tr>
                <th>GST Return</th>
                <td>{renderMedia(leadData.gst_return, "GST Return")}</td>
              </tr>
              <tr>
                <th>Property Paper</th>
                <td>
                  {renderMedia(leadData.property_paper, "Property Paper")}
                </td>
              </tr>
            </tbody>
          </Table>
          </div>
          {/* {leadResponseList.length > 0 && (
            <div className="mt-5">
              <h4 className="mb-3">Loan Lead Response History</h4>
              <Table bordered responsive>
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Response</th>
                    <th>Attachment</th>
                    <th>Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((response, index) => (
                    <tr key={response.id}>
                      <td>{indexOfFirstItem + index + 1}</td>
                      <td>{toSentenceCase(response.response)}</td>
                      <td>
                        {(() => {
                          const fileUrl = `${imagesURL}/${response.image}`;
                          const fileExt = response.image
                            ?.split(".")
                            .pop()
                            .toLowerCase();

                          if (fileExt === "pdf") {
                            // PDF case → Show download link
                            return (
                              <a href={fileUrl} download target="_blank">
                                View PDF
                              </a>
                            );
                          } else {
                            return (
                              <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <img
                                  src={fileUrl}
                                  alt="Attachment"
                                  height="100"
                                  width="100"
                                  style={{ cursor: "pointer" }}
                                />
                              </a>
                            );
                          }
                        })()}
                      </td>

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

export default LoandDetails;
