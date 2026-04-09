import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Table, Button, Spinner, Row, Col, Pagination, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import { MdFilterAlt } from "react-icons/md";
import { MdFilterAltOff } from "react-icons/md";
import { FaCalendar, FaTimes } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const API_URL = process.env.REACT_APP_API_URL;
const ITEMS_PER_PAGE = 10;

function ParentCommissionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [commissionData, setCommissionData] = useState([]);
  const [sourceDetails, setSourceDetails] = useState(null);
  const [totals, setTotals] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterName, setFilterName] = useState("");
  const [filterMobile, setFilterMobile] = useState("");
  const [filterLevel, setFilterLevel] = useState("");
  const [filterDesignation, setFilterDesignation] = useState(""); // Add this state

  const getAuthToken = () => localStorage.getItem("token");
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");

  const handleToggle = () => {
    setIsFilterActive(!isFilterActive);
  };

  const datePickerRef = useRef(null);
  const handleIconClick = () => {
    datePickerRef.current.setOpen(true);
  };
  const handleClear = () => {
    setFilterFromDate(null);
  };

  const fetchParentCommission = async (page = 1) => {
    setLoading(true);
    try {
      const token = getAuthToken();
      if (!token) return;

      const params = new URLSearchParams({
        page,
        limit: ITEMS_PER_PAGE,
        source_direct_income_id: id,
        associate_name: filterName,
        associate_mobile: filterMobile,
        level: filterLevel,
        designation: filterDesignation, // Add this
        from_date: formatDateForServer(filterFromDate),
        to_date: formatDateForServer(filterToDate),
      });

      const response = await fetch(`${API_URL}/parent-commission-list-view?${params}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success === 0 || !data.data || data.data.length === 0) {
        setCommissionData([]);
        setSourceDetails(null);
        setTotals(null);
        setTotalItems(0);
        Swal.fire({
          icon: "warning",
          title: "No Commission Found",
          text: "No commission data available for this record.",
        });
      } else {
        setCommissionData(data.data);
        setSourceDetails(data.source_details || null);
        setTotals(data.totals || null);
        setTotalItems(data.total || data.data.length);
      }
    } catch (error) {
      console.error("Error fetching parent commission:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (pageNum) => {
    if (pageNum > 0 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  const handleFilter = () => {
    setCurrentPage(1);
    fetchParentCommission(1);
  };

  useEffect(() => {
    fetchParentCommission(currentPage);
  }, [currentPage]);

  const formatDateForServer = (dateStr) => {
    if (!dateStr) return "";
    if (dateStr instanceof Date) {
      const dd = String(dateStr.getDate()).padStart(2, "0");
      const mm = String(dateStr.getMonth() + 1).padStart(2, "0");
      const yyyy = dateStr.getFullYear();
      return `${yyyy}-${mm}-${dd}`;
    }
    if (typeof dateStr === 'string') {
      const parts = dateStr.split("-");
      if (parts.length !== 3) return "";
      const [dd, mm, yyyy] = parts;
      return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
    }
    return "";
  };

  return (
    <div className="card mt-3">
      <div className="card-header gap-2 d-flex justify-content-between align-items-center">
        <h4>Commission Details</h4>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Back
        </Button>
        <div className="d-block d-md-none">
          <button
            className={`filter-toggle-btn ${isFilterActive ? "active" : ""}`}
            onClick={handleToggle}
          >
            {isFilterActive ? (
              <>
                <MdFilterAltOff />
              </>
            ) : (
              <>
                <MdFilterAlt />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Source Details Table */}
      {sourceDetails && (
        <div className="card-body border-bottom">
          <h5 className="mb-3 text-dark">Self Commission Distribution</h5>
          <div className="table-responsive">
            <Table bordered className="mb-0">
              <thead className="headerallnew">
               <tr>
                 <th>#</th>
                   <th>Date</th>
                  <th>Lead ID</th>
                  <th>Customer Name</th>
                  <th>Customer Mobile</th>
                  <th>Associate Name</th>
                  <th>Associate Mobile</th>
                  <th>Colony/Block Name</th>
                  <th>Unit Number</th>
                  <th>Total Unit Area (SQYD)</th>
                  <th>Calculated Area (SQYD)</th>
                  <th>Unit Rate</th>
                  <th>BV (%)</th>
                  <th>Level</th>
                  <th>Old SQYD</th>
                  <th>New SQYD</th>
                  <th>Old Slab</th>
                  <th>Payable BV</th>
                  <th>New Slab</th>
                  <th>Gross Payout</th>
                  <th>Net Payout</th>
                  <th>Gross Payment</th>
               </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{(currentPage - 1) * ITEMS_PER_PAGE  + 1}</td>
                   <td>
                    {sourceDetails.status_date 
                      ? `${new Date(sourceDetails.status_date).getDate().toString().padStart(2, "0")}-${(
                          new Date(sourceDetails.status_date).getMonth() + 1
                        ).toString().padStart(2, "0")}-${new Date(sourceDetails.status_date).getFullYear()}`
                      : "N/A"}
                  </td>
                  <td>{sourceDetails.lead_id || "N/A"}</td>
                  <td>{sourceDetails.customer_name || "N/A"}</td>
                  <td>{sourceDetails.customer_mobile || "N/A"}</td>
                   <td>{sourceDetails.user_details?.username || "N/A"}</td>
                  <td>{sourceDetails.user_details?.mobile || "N/A"}</td>
                  <td>{sourceDetails.colony_name || "N/A"}</td>
                    <td>{sourceDetails.plot_no || "N/A"}</td>
                    <td>{sourceDetails.total_plot_area || "N/A"}</td>
                    <td>{sourceDetails.total_plot_area || "N/A"}</td>
                    <td>{sourceDetails.rate || "N/A"}</td>
                    <td>{sourceDetails.bv || "N/A"}</td>
                    <td>{sourceDetails.level || "N/A"}</td>
                    <td>{sourceDetails.old_sqyd || "N/A"}</td>
                    <td>{sourceDetails.new_sqyd || "0.00"}</td>
                    <td>{sourceDetails.old_slab || "N/A"}</td> 
                    <td>{sourceDetails.payable_bv || "N/A"}</td> 
                  <td>{sourceDetails.new_slab || "N/A"}</td>
                  <td>{sourceDetails.gross_payout || "N/A"}</td>
                  <td>{sourceDetails.net_payout || "N/A"}</td>
                  <td>
                      ₹ {(sourceDetails.payable_amount = sourceDetails.net_payout - sourceDetails.advance_balance).toFixed(2)}
                    </td>
                 
                </tr>
               
              </tbody>
            </Table>
          </div>
        </div>
      )}

      <div className="card-body">
        {isFilterActive && (
          <Row className="mb-3 mobilesed">
            <div className="position-absolute" style={{ top: '10px', right: '20px' }}>
              {!filterFromDate ? (
                <FaCalendar onClick={handleIconClick} />
              ) : (
                <FaTimes onClick={handleClear} />
              )}
            </div>
            <Col md={6}>
              <DatePicker
                ref={datePickerRef}
                selected={filterFromDate}
                onChange={(date) => setFilterFromDate(date)}
                placeholderText="DD-MM-YYYY"
                dateFormat="dd-MM-yyyy"
                className="form-control"
                showPopperArrow={false}
              />
            </Col>
            <Col md={6}>
              <DatePicker
                ref={datePickerRef}
                selected={filterToDate}
                onChange={(date) => setFilterToDate(date)}
                placeholderText="DD-MM-YYYY"
                dateFormat="dd-MM-yyyy"
                className="form-control"
                showPopperArrow={false}
              />
            </Col>
            <Col md={6} className="">
              <Form.Control
                type="text"
                placeholder="Associate Name"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
              />
            </Col>
            <Col md={6} className="">
              <Form.Control
                type="text"
                placeholder="Associate Mobile"
                value={filterMobile}
                onChange={(e) => setFilterMobile(e.target.value)}
              />
            </Col>
            <Col md={6} className="">
              <Form.Control
                type="number"
                placeholder="Level"
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
              />
            </Col>
            <Col md={6} className="">
              <Form.Control
                type="text"
                placeholder="Designation"
                value={filterDesignation}
                onChange={(e) => setFilterDesignation(e.target.value)}
              />
            </Col>
            <Col md={12}>
              <div className="mt-2 d-flex justify-content-end">
                <Button variant="primary" onClick={handleFilter}>
                  Apply Filter
                </Button>
              </div>
            </Col>
          </Row>
        )}
        
        <div className="d-none d-md-block card mb-3">
          <Row className="gy-2 card-body">
            <Col md={6}>
              <div className="position-relative">
                <div className="position-absolute" style={{ top: '10px', right: '20px' }}>
                  {!filterFromDate ? (
                    <FaCalendar onClick={handleIconClick} />
                  ) : (
                    <FaTimes onClick={handleClear} />
                  )}
                </div>
                <DatePicker
                  ref={datePickerRef}
                  selected={filterFromDate}
                  onChange={(date) => setFilterFromDate(date)}
                  placeholderText="DD-MM-YYYY"
                  dateFormat="dd-MM-yyyy"
                  className="form-control"
                  showPopperArrow={false}
                />
              </div>
            </Col>
            <Col md={6}>
              <div className="position-relative">
                <div className="position-absolute" style={{ top: '10px', right: '20px' }}>
                  {!filterFromDate ? (
                    <FaCalendar onClick={handleIconClick} />
                  ) : (
                    <FaTimes onClick={handleClear} />
                  )}
                </div>
                <DatePicker
                  ref={datePickerRef}
                  selected={filterToDate}
                  onChange={(date) => setFilterToDate(date)}
                  placeholderText="DD-MM-YYYY"
                  dateFormat="dd-MM-yyyy"
                  className="form-control"
                  showPopperArrow={false}
                />
              </div>
            </Col>
            <Col md={4}>
              <Form.Control
                type="text"
                placeholder="Associate Name"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
              />
            </Col>
            <Col md={4}>
              <Form.Control
                type="text"
                placeholder="Associate Mobile"
                value={filterMobile}
                onChange={(e) => setFilterMobile(e.target.value)}
              />
            </Col>
            <Col md={4}>
              <Form.Control
                type="number"
                placeholder="Level"
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
              />
            </Col>
            <Col md={4}>
              <Form.Control
                type="text"
                placeholder="Designation"
                value={filterDesignation}
                onChange={(e) => setFilterDesignation(e.target.value)}
              />
            </Col>
            <Col md={4}>
              <Button variant="primary" onClick={handleFilter}>
                Apply Filter
              </Button>
            </Col>
          </Row>
        </div>

        {/* Totals Summary */}
        {!loading && totals && (
          <div className="row mb-4">
            <div className="col-md-6 mb-3">
              <div className="card border-success">
                <div className="card-header bg-success text-white">
                  <h5 className="mb-0">Summary Totals</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-6">
                      <p className="mb-2"><strong>Self Commision:</strong></p>
                      <p className="mb-2"><strong>Upline Commission Total:</strong></p>
                      <hr className="my-2" />
                      <p className="mb-0"><strong>Total Payable:</strong></p>
                    </div>
                    <div className="col-6">
                      <p className="mb-2">₹ {totals?.direct_income_amount || "0.00"}</p>
                      <p className="mb-2">₹ {totals?.commission_total || "0.00"}</p>
                      <hr className="my-2" />
                      <p className="mb-0 fs-5 fw-bold text-primary">₹ {totals?.total_payable || "0.00"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Commission Data Table */}
        <h5 className="mb-3 text-dark">Upline Commission Distribution</h5>
        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" />
          </div>
        ) : commissionData.length === 0 ? (
          <div className="text-center text-muted py-5">No commission data found.</div>
        ) : (
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead className="headerallnew">
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Lead ID</th>
                  <th>Customer Name</th>
                  <th>Customer Mobile</th>
                  <th>Associate Name</th>
                  <th>Associate Mobile</th>
                  <th>Designation</th>
                  <th>Level</th>
                  <th>Old SQYD</th>
                  <th>New SQYD</th>
                  <th>Old Slab</th>
                  <th>Payable BV</th>
                  <th>New Slab</th>
                  <th>Gross Payout</th>
                  <th>Net Payout</th>
                  <th>Gross Payment</th>
                </tr>
              </thead>
              <tbody>
                {commissionData.map((record, idx) => (
                  <tr key={record.id}>
                    <td>{(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}</td>
                    <td>
                      {record.date
                        ? `${new Date(record.date).getDate().toString().padStart(2, "0")}-${(
                            new Date(record.date).getMonth() + 1
                          ).toString().padStart(2, "0")}-${new Date(record.date).getFullYear()}`
                        : ""}
                    </td>
                    <td>{record.lead_id || "N/A"}</td>
                    <td>
                      {record.customer_name
                        ? record.customer_name.charAt(0).toUpperCase() + record.customer_name.slice(1).toLowerCase()
                        : ""}
                    </td>
                    <td>{record.customer_mobile}</td>
                    <td>{record.associate_name}</td>
                    <td>{record.associate_mobile}</td>
                    <td>{record.desigination}</td>
                    <td
                      style={{
                        color: [
                          "gray",
                          "red",
                          "orange",
                          "green",
                          "blue",
                          "indigo",
                          "violet",
                          "purple",
                          "teal",
                        ][record.level] || "black",
                        fontWeight: "bold",
                      }}
                    >
                      {record.level}
                    </td>
                    <td>{record.old_sqyd}</td>
                    <td>{record.new_sqyd}</td>
                    <td>{record.old_slab}</td>
                    <td>{record.payable_bv}</td>
                    <td>{record.new_slab}</td>
                    <td>₹ {record.gross_payout}</td>
                    <td>₹ {record.net_payout}</td>
                    <td>
                      <strong
                        style={{
                          color:
                            record.net_payout - record.advance_balance >= 0
                              ? "green"
                              : "red",
                        }}
                      >
                        ₹ {(record.net_payout - record.advance_balance).toFixed(2)}
                      </strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-end mt-4">
            <Pagination>
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
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}

export default ParentCommissionPage;