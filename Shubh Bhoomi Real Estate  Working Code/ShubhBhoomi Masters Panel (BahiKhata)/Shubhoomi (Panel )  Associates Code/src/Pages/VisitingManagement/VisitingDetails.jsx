import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import { Table } from "react-bootstrap";

const API_URL = process.env.REACT_APP_API_URL;
const imagesURL = `${process.env.REACT_APP_IMAGE_API_URL}/uploads/visitImage`;

const VisitingDetails = () => {
  const { id } = useParams();
  const [visitData, setVisitData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchLeadDetails = async () => {
    try {
      const response = await fetch(`${API_URL}/visite-view?id=${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const result = await response.json();
      console.log("API Result:", result);

      if (result.success === "1" && result.data) {
        setVisitData(result.data);
      } else {
        setVisitData(null);
      }
    } catch (err) {
      console.error("Error fetching visit details:", err);
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
        <p className="mt-3">Loading visit details...</p>
      </div>
    );
  }

  if (!visitData) {
    return <p className="text-center text-danger fw-bold">No data found!</p>;
  }

  const toSentenceCase = (text) => {
    if (!text) return "-";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  return (
    <div className="">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div className="titlepage">
            <h3 className="mb-0">Client Visiting Details</h3>
          </div>
          <button className="submit_button" onClick={() => navigate(-1)}>
            ← Back
          </button>
        </div>
        <div className="card-body">
          {/* <Table bordered>
            <tbody>
              <tr>
                <th>Customer Name</th>
                <td>{toSentenceCase(visitData.user_name)}</td>
              </tr>
              <tr>
                <th>Start Time</th>
                <td>
                  {new Date(visitData.start_time)
                    .toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    })
                    .replace(/\//g, "-")}
                </td>
              </tr>
              <tr>
                <th>Start Address</th>
                <td>{visitData.start_address}</td>
              </tr>
              <tr>
                <th>End Time</th>
                <td>
                  {new Date(visitData.end_time)
                    .toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    })
                    .replace(/\//g, "-")}
                </td>
              </tr>
              <tr>
                <th>End Address</th>
                <td>{visitData.end_address}</td>
              </tr>
              <tr>
                <th>Total Duration </th>
                <td>{visitData.duration} (Second) </td>
              </tr>

              <tr>
                <th>Visit Purpose</th>
                <td>{visitData.visit_purpose}</td>
              </tr>

              <tr>
                <th>Total Distance </th>
                <td>{visitData.distance} (Meter) </td>
              </tr>

              <tr>
                <th>Vehicle Type </th>
                <td>{toSentenceCase(visitData.vehicle_type)} </td>
              </tr>

              <tr>
                <th>Per Kilometer Amount </th>
                <td>₹ {visitData.per_kilometer_amount} </td>
              </tr>

              <tr>
                <th>Total Amount </th>
                <td>₹ {visitData.amount}</td>
              </tr>

              <tr>
                <th>Status</th>
                <td>{toSentenceCase(visitData.status)}</td>
              </tr>

              <tr>
                <th>Start Image</th>
                <td>
                  {visitData.start_image ? (
                    <>
                      <img
                        src={`${imagesURL}/${visitData.start_image}`}
                        alt="Start"
                        style={{
                          width: "120px",
                          height: "auto",
                          borderRadius: "5px",
                          marginBottom: "10px",
                          display: "block",
                        }}
                      />
                      <a
                        href={`${imagesURL}/${visitData.start_image}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        style={{
                          display: "inline-block",
                          padding: "8px 12px",
                          background: "#4CAF50",
                          color: "#fff",
                          borderRadius: "5px",
                          textDecoration: "none",
                        }}
                      >
                        Download Start Image
                      </a>
                    </>
                  ) : (
                    <span>No image available</span>
                  )}
                </td>
              </tr>

              <tr>
                <th>End Image</th>
                <td>
                  {visitData.end_image ? (
                    <>
                      <img
                        src={`${imagesURL}/${visitData.end_image}`}
                        alt="End"
                        style={{
                          width: "120px",
                          height: "auto",
                          borderRadius: "5px",
                          marginBottom: "10px",
                          display: "block",
                        }}
                      />
                      <a
                        href={`${imagesURL}/${visitData.end_image}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        style={{
                          display: "inline-block",
                          padding: "8px 12px",
                          background: "#2196F3",
                          color: "#fff",
                          borderRadius: "5px",
                          textDecoration: "none",
                        }}
                      >
                        Download End Image
                      </a>
                    </>
                  ) : (
                    <span>No image available</span>
                  )}
                </td>
              </tr>
              <tr>
                <th>Date & Timing </th>
                <td>
                  {new Date(visitData.created_at)
                    .toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    })
                    .replace(/\//g, "-")}
                </td>
              </tr>
            </tbody>
          </Table> */}
          <div className="timeline">
            {/* Visit Details */}
            <div className="timeline-item">
              {/* <div className="timeline-marker bg-danger"> Start</div> */}
              <div className="timeline-content card mb-3">
                <div className="card-header">
                  <h5 className="mb-0">📝 Visit Details</h5>
                </div>
                <div className="card-body">
                <div className="table-responsive">
                    <Table bordered>
                    <tbody>
                      <tr>
                        <th>Project Name</th>
                        <td>{toSentenceCase(visitData.project_name)}</td>
                      </tr>

                      <tr>
                        <th>Customer Name</th>
                        <td>{toSentenceCase(visitData.user_name)}</td>
                      </tr>
                      <tr>
                        <th>Visit Purpose</th>
                        <td><div className="table-cell-remark">{toSentenceCase(visitData.visit_purpose)}</div></td>
                      </tr>
                      <tr>
                        <th>Total Duration</th>
                        <td>{Math.floor(visitData.duration / 60)} min {visitData.duration % 60} sec
 </td>
                      </tr>
                      <tr>
                        <th>Total Distance</th>
                        {/* <td>{visitData.distance} (Meter)</td> */}
                        <td>
                          {(() => {
                            const m = Number(visitData.distance);
                            return Number.isFinite(m)
                              ? (m / 1000).toFixed(2) + " (KM) "
                              : "—";
                          })()}
                        </td>
                      </tr>
                      <tr>
                        <th>Status</th>
                        <td>
                          <span
                            className={`badge ${
                              visitData.status === "start"
                                ? "bg-danger"
                                : visitData.status === "end"
                                ? "backgroundgreen"
                                : "bg-secondary"
                            }`}
                          >
                            {toSentenceCase(visitData.status)}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <th>Date & Timing</th>
                        <td>
                          {new Date(visitData.created_at)
                            .toLocaleString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                              hour12: true,
                            })
                            .replace(/\//g, "-")}
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
                </div>
              </div>
            </div>

            {/* Profile / Payment Info */}
            <div className="timeline-item">
              <div className="timeline-content card mb-3">
                <div className="card-header">
                  <h5 className="mb-0">👤 Profile / Payment Info</h5>
                </div>
                <div className="card-body">
                  <Table bordered>
                    <tbody>
                      <tr>
                        <th>Vehicle Type</th>
                        <td>{toSentenceCase(visitData.vehicle_type)}</td>
                      </tr>
                      <tr>
                        <th>Per Kilometer Amount</th>
                        <td>₹ {visitData.per_kilometer_amount}</td>
                      </tr>
                      <tr>
                        <th>Total Amount</th>
                        <td>₹ {visitData.amount}</td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </div>
            </div>

            {/* Start & End Info */}
            <div className="timeline position-relative">
              {/* Start Info */}

              <div className="timeline_line mr-2"></div>
              <div className="timeline-item ">
                <div className="timeline-marker marker-start bg-danger">
                  Start
                </div>
                <div className="timeline-content card mb-3">
                  <div className="card-header bg-danger text-white">
                    <h5 className="mb-0">📝 Start Info</h5>
                  </div>
                  <div className="card-body">
                    <p>
                      <strong>Start Time:</strong>{" "}
                      {new Date(visitData.start_time)
                        .toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: true,
                        })
                        .replace(/\//g, "-")}
                    </p>

                    <p>
                      <strong>Start Address:</strong> {visitData.start_address}
                    </p>

                    {visitData.start_image ? (
                      <>
                        <img
                          src={`${imagesURL}/${visitData.start_image}`}
                          alt="Start"
                          className="img-thumbnail mb-2"
                          style={{ width: "120px" }}
                        />
                        <a
                          href={`${imagesURL}/${visitData.start_image}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="btn btn-outline-danger btn-sm"
                        >
                          ⬇ Download Start Image
                        </a>
                      </>
                    ) : (
                      <span>No image available</span>
                    )}

                    <p>
                      <strong>Start Latitude:</strong> {visitData.start_lat}
                    </p>

                    <p>
                      <strong>Start Longitude:</strong> {visitData.start_long}
                    </p>
                  </div>
                </div>
              </div>

              {/* End Info */}
              <div className="timeline-item">
                <div className="timeline-marker backgroundgreen marker-end">
                  End
                </div>
                <div className="timeline-content card mb-3">
                  <div className="card-header bg-success text-white">
                    <h5 className="mb-0">🚦 End Info</h5>
                  </div>
                  <div className="card-body">
                    <p>
                      <strong>End Time:</strong>{" "}
                      {new Date(visitData.end_time)
                        .toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: true,
                        })
                        .replace(/\//g, "-")}
                    </p>

                    <p>
                      <strong>End Address:</strong> {visitData.end_address}
                    </p>

                    {visitData.end_image ? (
                      <>
                        <img
                          src={`${imagesURL}/${visitData.end_image}`}
                          alt="End"
                          className="img-thumbnail mb-2"
                          style={{ width: "120px" }}
                        />
                        <a
                          href={`${imagesURL}/${visitData.end_image}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="btn btn-outline-success btn-sm"
                        >
                          ⬇ Download End Image
                        </a>
                      </>
                    ) : (
                      <span>No image available</span>
                    )}
                  <p>
                      <strong>End Latitude:</strong> {visitData.end_lat}
                    </p>

                    <p>
                      <strong>End Longitude:</strong> {visitData.end_long}
                    </p>
                  </div>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-marker marker-info bg-info">
                  Trip Info
                </div>
                <div className="timeline-content card mb-3">
                  <div className="card-header bg-warning text-white">
                    <h5 className="mb-0">📍 Trip Summary</h5>
                  </div>
                  <div className="card-body">
                    <p>
                      <strong>Total Distance:</strong>{" "}
                      {(() => {
                        const m = Number(visitData.distance);
                        return Number.isFinite(m)
                          ? (m / 1000).toFixed(2) + " (KM) "
                          : "—";
                      })()}
                    </p>
                    <p>
                      <strong>Total Time:</strong> {Math.floor(visitData.duration / 60)} min {visitData.duration % 60} sec
  
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Info */}

          {/* Start & End Info */}
        </div>
      </div>
    </div>
  );
};

export default VisitingDetails;
