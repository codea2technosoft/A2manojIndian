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
function ParentUnitisnotsoldePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [commissionData, setCommissionData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterName, setFilterName] = useState("");
  const [filterMobile, setFilterMobile] = useState("");
  const [filterLevel, setFilterLevel] = useState("");

  const getAuthToken = () => localStorage.getItem("token");
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");

  const datePickerRef = useRef(null);
  const handleIconClick = () => {
    if (datePickerRef.current) {
      datePickerRef.current.setOpen(true);
    }
  };
  
  const handleClear = () => {
    setFilterFromDate(null);
  };

  const handleToggle = () => {
    setIsFilterActive(!isFilterActive);
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
        from_date: formatDateForServer(filterFromDate),
        to_date: formatDateForServer(filterToDate),
      });

      const response = await fetch(`${API_URL}/parent-unitis-notsolde-list-view?${params}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success === 0 || !data.data || data.data.length === 0) {
        setCommissionData([]);
        setTotalItems(0);
      } else {
        setCommissionData(data.data);
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
        <h4>Unit Is Not Sold Area Details </h4>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Back
        </Button>
        <div className="d-block d-md-none">
          <button
            className={`filter-toggle-btn btn ${isFilterActive ? "active" : ""}`}
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

      <div className="card-body">
        {isFilterActive && (
          <Row className="mb-3 mobilesed">
            

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
                selected={filterToDate}
                onChange={(date) => setFilterToDate(date)}
                placeholderText="DD-MM-YYYY"
                dateFormat="dd-MM-yyyy"
                className="form-control"
                showPopperArrow={false}
              />
              </div>
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
                type="number"
                placeholder="Designation"
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
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
              <Button variant="primary" onClick={handleFilter}>
                Apply Filter
              </Button>
            </Col>
          </Row>
        </div>
        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" />
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Lead ID</th>
                    <th>Customer Name</th>
                    <th>Customer Mobile</th>
                    <th>Associate Name</th>
                    <th>Associate Mobile</th>
                    <th>Old SQYD</th>
                    <th>New SQYD</th>
                    <th>Old Slab</th>
                    <th>New Slab</th>
                  </tr>
                </thead>
                <tbody>
                  {commissionData.length === 0 ? (
                    <tr>
                      <td colSpan="11" className="text-center text-muted py-4">
                        No data found.
                      </td>
                    </tr>
                  ) : (
                    commissionData.map((record, idx) => (
                      <tr key={record.id}>
                        <td>{(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}</td>
                        <td>
                          {record.date
                            ? `${new Date(record.date).getDate().toString().padStart(2, "0")}-${(
                              new Date(record.date).getMonth() + 1
                            )
                              .toString()
                              .padStart(2, "0")}-${new Date(record.date).getFullYear()}`
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
                        <td>{record.old_sqyd}</td>
                        <td>{record.new_sqyd}</td>
                        <td>{record.old_slab}</td>
                        <td>{record.new_slab}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
            {totalPages > 1 && commissionData.length > 0 && (
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
          </>
        )}
      </div>
    </div>
  );
}

export default ParentUnitisnotsoldePage;