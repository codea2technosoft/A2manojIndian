import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaFileDownload } from "react-icons/fa";
import {
  Modal,
  Button,
  Table,
  Pagination,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";
import Swal from "sweetalert2"; // Add sweetalert2
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { MdFilterAlt } from "react-icons/md";
import { MdFilterAltOff } from "react-icons/md";
import axios from "axios";
import { FaCalendar, FaTimes } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const API_URL = process.env.REACT_APP_API_URL;
const INCOME_API_ENDPOINT = `${API_URL}/property-income-list`;

const ITEMS_PER_PAGE = 10;

function ALLPropertyIncomeList() {
  const navigate = useNavigate();
  const [incomeRecords, setIncomeRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCommission, setTotalCommission] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [filterPlotNo, setFilterPlotNo] = useState("");
  const [filterColonyName, setFilterColonyName] = useState("");

  const [filterRate, setFilterRate] = useState("");
  const [filterBV, setFilterBV] = useState("");
  const [filterLevel, setFilterLevel] = useState("");
  const [filterLeadID, setLeadID] = useState("");
  const [filterAssociateName, setFilterAssociateName] = useState("");
  const [filterAssociateMobile, setFilterAssociateMobile] = useState("");
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const getAuthToken = () => localStorage.getItem("token");
  const [isFilterActive, setIsFilterActive] = useState(false);

  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");

  const datePickerRef = useRef(null);
  const handleIconClick = () => {
    datePickerRef.current.setOpen(true);
  };
  const handleClear = () => {
    setFilterFromDate(null);
  };

  const handleToggle = () => {
    setIsFilterActive(!isFilterActive);
  };

  const fetchIncomeRecords = async (page = 1) => {
    setLoading(true);
    try {
      const authToken = getAuthToken();
      if (!authToken) return setLoading(false);

      const params = new URLSearchParams({
        page,
        limit: ITEMS_PER_PAGE,
        plot_no: filterPlotNo,
        colony_name: filterColonyName,
        rate: filterRate,
        bv: filterBV,
        level: filterLevel,
        lead_id: filterLeadID,
        associate_name: filterAssociateName,
        associate_mobile: filterAssociateMobile,
        from_date: formatDateForServer(filterFromDate),
        to_date: formatDateForServer(filterToDate),
      });

      const response = await fetch(
        `${INCOME_API_ENDPOINT}?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        },
      );

      if (response.ok) {
        const result = await response.json();
        setIncomeRecords(result.data || []);
        setTotalItems(result.total || 0);
        setTotalCommission(result.total_commission || 0);
        setCurrentPage(result.page || page);
      } else {
        console.error("Failed to fetch income records:", response.statusText);
        setIncomeRecords([]);
      }
    } catch (error) {
      console.error("Network or unexpected error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) setCurrentPage(pageNumber);
  };

  useEffect(() => {
    fetchIncomeRecords(currentPage);
  }, [currentPage]);

  const handleDownloadExcel = async (income_id) => {
    const token = localStorage.getItem("token");

    try {
      Swal.fire({
        title: "Please wait...",
        text: "Generating your Excel file",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });
      const response = await fetch(
        `${API_URL}/export-property-commission?id=${income_id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) throw new Error("Failed to download Excel");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `parent_commission_${income_id}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      Swal.fire({
        icon: "success",
        title: "Download Successful!",
        text: "Your Excel report has been downloaded successfully.",
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (error) {
      console.error("Excel download failed:", error);
      Swal.fire({
        icon: "error",
        title: "Download Failed!",
        text: "Please Check Commision ID, And Try Again.",
      });
    }
  };
  const handleDownloadFilteredExcel = async () => {
    const token = localStorage.getItem("token");

    try {
      Swal.fire({
        title: "Please wait...",
        text: "Generating your filtered Excel file",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const params = new URLSearchParams({
        plot_no: filterPlotNo,
        colony_name: filterColonyName,
        rate: filterRate,
        bv: filterBV,
        level: filterLevel,
        lead_id: filterLeadID,
        associate_name: filterAssociateName,
        associate_mobile: filterAssociateMobile,
        from_date: formatDateForServer(filterFromDate),
        to_date: formatDateForServer(filterToDate),
      });

      const response = await fetch(
        `${API_URL}/export-property-commission-by-date?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) throw new Error("Failed to download Excel");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `filtered_property_commission.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      Swal.fire({
        icon: "success",
        title: "Download Successful!",
        text: "Filtered Excel report has been downloaded successfully.",
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (error) {
      console.error("Filtered Excel download failed:", error);
      Swal.fire({
        icon: "error",
        title: "Download Failed!",
        text: "Please Check Entered From Date & To Date For Downloding Commission Report.",
      });
    }
  };

  const formatDateForServer = (dateStr) => {
    if (!dateStr) return "";
    if (dateStr instanceof Date) {
      const dd = String(dateStr.getDate()).padStart(2, "0");
      const mm = String(dateStr.getMonth() + 1).padStart(2, "0");
      const yyyy = dateStr.getFullYear();
      return `${yyyy}-${mm}-${dd}`;
    }
    if (typeof dateStr === "string") {
      const parts = dateStr.split("-");
      if (parts.length !== 3) return "";
      const [dd, mm, yyyy] = parts;
      return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
    }

    return "";
  };

  return (
    <div className="card mt-2">
      <div className="card-header">
        <div className="d-flex justify-content-between align-items-center">
          <div className="titlepage">
            <h3 className="mb-0">All Property Commission List</h3>
          </div>
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
      </div>
      <div className="card-body">
        {isFilterActive && (
          <Row className="mb-3 mobilesed">
            <Col md={6}>
              <div className="position-relative">
                <div
                  className="position-absolute"
                  style={{ top: "10px", right: "20px" }}
                >
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
                  // isClearable={true}
                  showPopperArrow={false}
                />
              </div>
            </Col>
            <Col md={6}>
              <div className="position-relative">
                <div
                  className="position-absolute"
                  style={{ top: "10px", right: "20px" }}
                >
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
                  // isClearable={true}
                  showPopperArrow={false}
                />
              </div>
            </Col>

            <Col md={6}>
              <input
                type="text"
                placeholder="Associate Name"
                className="form-control"
                value={filterAssociateName}
                onChange={(e) => setFilterAssociateName(e.target.value)}
              />
            </Col>
            <Col md={6}>
              <input
                type="text"
                placeholder="Associate Mobile"
                className="form-control"
                value={filterAssociateMobile}
                onChange={(e) => setFilterAssociateMobile(e.target.value)}
              />
            </Col>
            <Col md={6}>
              <input
                type="text"
                placeholder="Unit"
                className="form-control"
                value={filterPlotNo}
                onChange={(e) => setFilterPlotNo(e.target.value)}
              />
            </Col>
            <Col md={6}>
              <input
                type="text"
                placeholder="Colony Name / Block Name"
                className="form-control"
                value={filterColonyName}
                onChange={(e) => setFilterColonyName(e.target.value)}
              />
            </Col>
            <Col md={6}>
              <input
                type="text"
                placeholder="Unit Rate"
                className="form-control"
                value={filterRate}
                onChange={(e) => setFilterRate(e.target.value)}
              />
            </Col>
            <Col md={6}>
              <input
                type="text"
                placeholder="BV"
                className="form-control"
                value={filterBV}
                onChange={(e) => setFilterBV(e.target.value)}
              />
            </Col>
            <Col md={6}>
              <input
                type="text"
                placeholder="Level"
                className="form-control"
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
              />
            </Col>

            <Col md={3}>
              <input
                type="text"
                placeholder="Lead ID"
                className="form-control"
                value={filterLeadID}
                onChange={(e) => setLeadID(e.target.value)}
              />
            </Col>

            <Col md={12}>
              <div className="d-flex mt-2 justify-content-end align-items-center gap-2">
                <Button variant="primary" onClick={() => fetchIncomeRecords(1)}>
                  Filter
                </Button>

                <Button variant="primary" onClick={handleDownloadFilteredExcel}>
                  Download
                </Button>
              </div>
            </Col>
          </Row>
        )}
        <Row className="mb-3 gy-2">
          <Col md={6}>
            <div className="p-3 bg-light rounded shadow-sm">
              <h5 className="text-muted">
                <strong>Total Commissions</strong>
              </h5>
              <h3 className="text-success">
                {totalCommission.toLocaleString("en-IN")}
              </h3>
            </div>
          </Col>
          <Col md={6}>
            <div className="p-3 bg-light rounded shadow-sm">
              <h5 className="text-muted">
                <strong>Total Records</strong>
              </h5>
              <h3 className="text-primary">{totalItems}</h3>
            </div>
          </Col>
        </Row>
        <div className="d-none d-md-block card mb-3">
          <Row className="card-body gy-2">
            <Col md={6}>
              <div className="position-relative">
                <div
                  className="position-absolute"
                  style={{ top: "10px", right: "20px" }}
                >
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
                  // isClearable={true}
                  showPopperArrow={false}
                />
              </div>
            </Col>
            <Col md={6}>
              <div className="position-relative">
                <div
                  className="position-absolute"
                  style={{ top: "10px", right: "20px" }}
                >
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
                  // isClearable={true}
                  showPopperArrow={false}
                />
              </div>
            </Col>

            <Col md={2}>
              <input
                type="text"
                placeholder="Associate Name"
                className="form-control"
                value={filterAssociateName}
                onChange={(e) => setFilterAssociateName(e.target.value)}
              />
            </Col>
            <Col md={2}>
              <input
                type="text"
                placeholder="Associate Mobile"
                className="form-control"
                value={filterAssociateMobile}
                onChange={(e) => setFilterAssociateMobile(e.target.value)}
              />
            </Col>
            <Col md={2}>
              <input
                type="text"
                placeholder="Unit"
                className="form-control"
                value={filterPlotNo}
                onChange={(e) => setFilterPlotNo(e.target.value)}
              />
            </Col>

            <Col md={3}>
              <input
                type="text"
                placeholder="Colony Name / Block Name"
                className="form-control"
                value={filterColonyName}
                onChange={(e) => setFilterColonyName(e.target.value)}
              />
            </Col>
            <Col md={3}>
              <input
                type="text"
                placeholder="Unit Rate"
                className="form-control"
                value={filterRate}
                onChange={(e) => setFilterRate(e.target.value)}
              />
            </Col>
            <Col md={3}>
              <input
                type="text"
                placeholder="BV"
                className="form-control"
                value={filterBV}
                onChange={(e) => setFilterBV(e.target.value)}
              />
            </Col>
            <Col md={3}>
              <input
                type="text"
                placeholder="Level"
                className="form-control"
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
              />
            </Col>

            <Col md={3}>
              <input
                type="text"
                placeholder="Lead ID"
                className="form-control"
                value={filterLeadID}
                onChange={(e) => setLeadID(e.target.value)}
              />
            </Col>

            <Col md={6} className="">
              <div className="d-flex gap-2 align-items-center">
                <Button variant="primary" onClick={() => fetchIncomeRecords(1)}>
                  Filter
                </Button>

                <Button variant="primary" onClick={handleDownloadFilteredExcel}>
                  Download
                </Button>
              </div>
            </Col>
          </Row>
        </div>

        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" />
          </div>
        ) : incomeRecords.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            No commission records found.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <Table
              striped
              bordered
              hover
              responsive
              className="min-w-full divide-y divide-gray-200"
            >
              <thead className="bg-gray-50">
                <tr>
                  <th>#</th>
                  <th>Show</th>
                  <th>Excel</th>
                  <th>Date</th>
                  <th>Lead ID</th>
                  <th>Customer Name</th>
                  <th>Customer Mobile</th>
                  <th>Project Name</th>
                  <th>Colony/Block Name</th>
                  <th>Unit Number</th>
                  <th>Total Unit Area (SQYD)</th>
                  <th>Calculated Area (SQYD)</th>
                  <th>Unit Rate</th>
                  <th>BV (%)</th>
                  <th>Level</th>
                  <th>Associate Name</th>
                  <th>Associate Mobile</th>
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
                {incomeRecords.map((record, index) => (
                  <tr key={record.income_id}>
                    <td>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                    <td>
                      <Button
                        size="sm"
                        variant="info"
                        onClick={() =>
                          navigate(`/parent-commission/${record.income_id}`)
                        }
                      >
                        <FaEye />
                      </Button>
                    </td>
                    <td>
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Download filtered data</Tooltip>}
                      >
                        <Button
                          size="sm"
                          variant="info"
                          onClick={() => handleDownloadExcel(record.income_id)}
                        >
                          <FaFileDownload className="text-white fs-6" />
                        </Button>
                      </OverlayTrigger>
                    </td>
                    <td>
                      {record.date
                        ? `${new Date(record.date).getDate().toString().padStart(2, "0")}-${(
                            new Date(record.date).getMonth() + 1
                          )
                            .toString()
                            .padStart(
                              2,
                              "0",
                            )}-${new Date(record.date).getFullYear()}`
                        : ""}
                    </td>
                    <td>{record.lead_id || "N/A"}</td>

                    <td>
                      {record.customer_name
                        ? record.customer_name.charAt(0).toUpperCase() +
                          record.customer_name.slice(1).toLowerCase()
                        : ""}
                    </td>
                    <td>{record.customer_mobile}</td>

                    <td>{record.project_name}</td>

                    <td>
                      {record.colony_name
                        ? record.colony_name.charAt(0).toUpperCase() +
                          record.colony_name.slice(1).toLowerCase()
                        : ""}
                    </td>
                    <td>
                      {record.plot_no
                        ? record.plot_no.charAt(0).toUpperCase() +
                          record.plot_no.slice(1).toLowerCase()
                        : ""}
                    </td>
                    <td>{record.total_plot_area}</td>
                    <td>{record.area}</td>
                    <td>₹ {record.rate}</td>
                    <td>{record.bv}</td>
                    <td
                      style={{
                        color:
                          [
                            "gray",
                            "red",
                            "orange",
                            "orange",
                            "green",
                            "blue",
                            "indigo",
                            "violet",
                            "pink",
                            "brown",
                            "purple",
                            "teal",
                          ][record.level] || "black",
                        fontWeight: "bold",
                      }}
                    >
                      {record.level}
                    </td>
                    <td>
                      {record.associate_name
                        ? record.associate_name.charAt(0).toUpperCase() +
                          record.associate_name.slice(1).toLowerCase()
                        : ""}
                    </td>

                    <td>{record.associate_mobile}</td>
                    <td>{record.old_sqyd}</td>
                    <td>{record.new_sqyd}</td>
                    <td>{record.old_slab}</td>
                    <td>{record.payable_bv}</td>
                    <td>{record.new_slab}</td>
                    <td>₹ {record.gross_payout}</td>
                    <td>₹ {record.net_payout}</td>
                    <td>
                      ₹{" "}
                      {(record.payable_amount =
                        record.net_payout - record.advance_balance).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="d-flex justify-content-end mt-4">
            <Pagination>
              <Pagination.Prev
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              />
              {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
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

export default ALLPropertyIncomeList;
