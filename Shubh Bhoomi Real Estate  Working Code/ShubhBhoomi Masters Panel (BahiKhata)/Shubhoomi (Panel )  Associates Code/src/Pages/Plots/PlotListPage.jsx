import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  Card,
  Row,
  Col,
  Badge,
  Form,
  Pagination,
  Spinner,
} from "react-bootstrap";

const API_URL = process.env.REACT_APP_API_URL;

function PlotListPage() {
  const [plots, setPlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imagePath, setImagePath] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const project_id = searchParams.get("project_id");
  const block_id = searchParams.get("block_id");

  const handleBookNow = (plot_id) => {
    navigate(
      `/create-property-lead?project_id=${project_id}&block_id=${block_id}&plot_id=${plot_id}`
    );
  };

  const queryParams = new URLSearchParams(location.search);
  const projectId = queryParams.get("project_id");
  const blockId = queryParams.get("block_id");

  const getAuthToken = () => localStorage.getItem("token");

  const fetchPlots = async (page = 1) => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const response = await fetch(
        `${API_URL}/plot-list?page=${page}&limit=10&project_id=${projectId}&block_id=${blockId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setPlots(data.data || []);
      setImagePath(data.imagePath || "");
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching plots:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId && blockId) {
      fetchPlots(currentPage);
    }
  }, [projectId, blockId, currentPage]);

  const toSentenceCase = (text) => {
    if (!text) return "-";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="padding_15 px-0">
      <div className="card">
        <div className="card-header">
          <div className="d-flex align-items-center justify-content-between">
            <div className="titlepage">
              <h3>Project & Units Details</h3>
            </div>
          </div>
        </div>
        <div className="card-body">
          <Form.Group className="mb-4">
            <Form.Control
              type="text"
              placeholder="Search by Project Name or Block Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form.Group>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
            </div>
          ) : plots.length > 0 ? (
            <>
              <div className="row">
                {plots
                  .filter((plot) => {
                    const search = searchTerm.trim().toLowerCase();
                    return (
                      plot.project_name?.toLowerCase().includes(search) ||
                      plot.block_name?.toLowerCase().includes(search)
                    );
                  })
                  .map((plot) => (
                    <div className="col-md-4 col-lg-4 col-12" key={plot.id}>
                      <div className="card">
                        {/* <div className="card-body">
                      <strong>Project Name : </strong> {plot.project_name?.toUpperCase()} <br />
                      <strong>Block Name : </strong> {plot.block_name?.toUpperCase()} <br />
                      <strong>Property Type : </strong> {plot.property_type?.toUpperCase()} <br />
                      <Card.Title className="d-flex justify-content-between">
                        Plot No : {plot.plot_shop_villa_no}
                      </Card.Title>
                      <Card.Text>
                        <strong>Size : </strong> {plot.plot_size} Sq. Yard<br />
                        <strong>Plot SQYD : </strong> {plot.plot_sqyd} <br />
                        <strong>Plot Rate : </strong> ₹{plot.plot_rate} Per Sq. Yard<br />
                        <strong>Registry Patta : </strong> {plot.resgistry_patta?.toUpperCase() || "-"} <br />
                        <strong>Plot Hold : </strong> {plot.plot_hold?.toUpperCase() || "-"} <br />
                        <strong>Registry Date : </strong> {(() => {
                          const date = new Date(plot.resgistry_date);
                          const day = String(date.getDate()).padStart(2, "0");
                          const month = String(date.getMonth() + 1).padStart(2, "0");
                          const year = date.getFullYear();
                          return `${day}-${month}-${year}`;
                        })()}<br />
                        <strong>Plot Address : </strong> {toSentenceCase(plot.plot_address)} <br />
                        <strong>Date : </strong> {plot.date}
                      </Card.Text>
                    </div> */}
                        <div className="card-body plot-card">
                          <div className="mb-3">
                            <p className="data_plot">
                              <strong>Project Name:</strong>{" "}
                              {plot.project_name?.toUpperCase()}
                            </p>
                            <p className="data_plot">
                              <strong>Block Name:</strong>{" "}
                              {plot.block_name?.toUpperCase()}
                            </p>
                            {/* <p className="data_plot"><strong>Property Type:</strong> {plot.property_type?.toUpperCase()}</p> */}
                          </div>

                          <h5 className="d-flex justify-content-between align-items-center border-top pt-2">
                            <span>
                              <strong>Units/Shop/Villa No:</strong>
                            </span>
                            <span>{plot.plot_shop_villa_no}</span>
                          </h5>

                          <div className="mt-3">
                            <p className="data_plot">
                              <strong>Area :</strong> {plot.area_sqyd} SQ.Yd.
                            </p>
                            {/* <p className="data_plot"><strong>SQYD:</strong> {plot.plot_sqyd}</p> */}
                            <p className="data_plot">
                              <strong>Rate:</strong> {plot.rate} Per SQ.Yd
                            </p>


                             <p className="data_plot">
                              <strong>Total Amount:</strong> ₹ {plot.area_sqyd * plot.rate}
                            </p>


                            <p className="data_plot">
                              <strong>Document Type:</strong>{" "}
                              {toSentenceCase(plot.document_type)}
                            </p>
                            <p className="data_plot">
                              <strong>Dimenison:</strong> {plot.dimension}
                            </p>
                            {/* <p className="data_plot"><strong>Registry Patta:</strong> {plot.resgistry_patta?.toUpperCase() || "-"}</p> */}
                            {/* <p className="data_plot"><strong>Plot Hold:</strong> {plot.plot_hold?.toUpperCase() || "-"}</p> */}
                            {/* <p className="data_plot">
                              <strong>Registry Date:</strong> {(() => {
                                const date = new Date(plot.resgistry_date);
                                const day = String(date.getDate()).padStart(2, "0");
                                const month = String(date.getMonth() + 1).padStart(2, "0");
                                const year = date.getFullYear();
                                return `${day}-${month}-${year}`;
                              })()}
                            </p> */}
                            <p
                              className="data_plot"
                              style={{
                                color:
                                  plot.status?.toLowerCase() === "available"
                                    ? "green"
                                    : plot.status?.toLowerCase() === "sold"
                                    ? "red"
                                    : "inherit", // default color if neither
                              }}
                            >
                              <strong>Status:</strong>{" "}
                              {toSentenceCase(plot.status)}
                            </p>{" "}
                            {/* <p className="mb-0"><strong>Date:</strong> {plot.date}</p> */}
                           
                          </div>
                        </div>
                        <div className="card-footer bg-white">
                           {plot.status?.toLowerCase() === "available" && (
                             <div className="d-flex justify-content-end ">
                                <button
                                className="booknow"
                               onClick={() => handleBookNow(plot.id)}
                              >
                                Book Now
                              </button>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="">
                {totalPages > 1 && (
                  <Pagination className="justify-content-center pagination_design">
                    <Pagination.First
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
                    />
                    <Pagination.Prev
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    />
                    {[...Array(totalPages)].map((_, i) => (
                      <Pagination.Item
                        key={i + 1}
                        active={i + 1 === currentPage}
                        onClick={() => handlePageChange(i + 1)}
                      >
                        {i + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    />
                    <Pagination.Last
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>
                )}
              </div>
            </>
          ) : (
            <div className="text-center text-muted">
              No units found for this block.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PlotListPage;

// <div className="card-body">
//                       <strong>Project Name : </strong> {plot.project_name?.toUpperCase()} <br />
//                       <strong>Block Name : </strong> {plot.block_name?.toUpperCase()} <br />
//                       <strong>Property Type : </strong> {plot.property_type?.toUpperCase()} <br />
//                       <Card.Title className="d-flex justify-content-between">
//                         Plot No : {plot.plot_shop_villa_no}
//                       </Card.Title>
//                       <Card.Text>
//                         <strong>Size : </strong> {plot.plot_size} Sq. Yard<br />
//                         <strong>Plot SQYD : </strong> {plot.plot_sqyd} <br />
//                         <strong>Plot Rate : </strong> ₹{plot.plot_rate} Per Sq. Yard<br />
//                         <strong>Registry Patta : </strong> {plot.resgistry_patta?.toUpperCase() || "-"} <br />
//                         <strong>Plot Hold : </strong> {plot.plot_hold?.toUpperCase() || "-"} <br />
//                         <strong>Registry Date : </strong> {(() => {
//                           const date = new Date(plot.resgistry_date);
//                           const day = String(date.getDate()).padStart(2, "0");
//                           const month = String(date.getMonth() + 1).padStart(2, "0");
//                           const year = date.getFullYear();
//                           return `${day}-${month}-${year}`;
//                         })()}<br />
//                         <strong>Plot Address : </strong> {toSentenceCase(plot.plot_address)} <br />
//                         <strong>Date : </strong> {plot.date}
//                       </Card.Text>
//                     </div>
