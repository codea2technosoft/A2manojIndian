import React, { useEffect, useState } from "react";
import { Modal, Button, Table, Pagination, Row, Col } from "react-bootstrap";
import { BsFiletypeXls } from "react-icons/bs";
import { MdFilterAltOff, MdFilterAlt } from "react-icons/md";
import { Link } from "react-router-dom";
import { RiFilterFill } from "react-icons/ri";
import { FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";

const API_URL = process.env.REACT_APP_API_URL;

function AdminTDSReport() {
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState({ amount: "", type: "" });
  const [showFilter, setShowFilter] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1199);
  const [totals, setTotals] = useState({ total_credit: 0, total_debit: 0 });
  const token = localStorage.getItem("token");
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");
  const [filterToType, setFilterToType] = useState("");
  const [isFilterActive, setIsFilterActive] = useState(false);

  const pageLimit = 10;
  const toggleFilter = () => setShowFilter((prev) => !prev);
  const showCustomMessageModal = (title, text) => {
    alert(`${title}: ${text}`);
  };

  const handleToggle = () => {
    setIsFilterActive(!isFilterActive);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1199) {
        setIsDesktop(true);
        setShowFilter(true);
      } else {
        setIsDesktop(false);
        setShowFilter(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchLedger = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        gift_type: searchTerm.gift_type || filterToType,
        date_from: formatDateForServer(filterFromDate),
        date_to: formatDateForServer(filterToDate),
        page,
      });
      const response = await fetch(`${API_URL}/gift-list-team?${params}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();

      if (result.success === "1") {
        setLedger(result.data || []);
        setTotalPages(result.total_pages || 1);
        setCurrentPage(result.current_page || 1);
      } else {
        showCustomMessageModal("Error", result.message || "Failed to fetch records.");
      }
    } catch (error) {
      showCustomMessageModal("Error", "Failed to fetch ledger data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLedger();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchLedger(1);
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      fetchLedger(pageNumber);
    }
  };

  const getPaginationGroup = () => {
    const start = Math.floor((currentPage - 1) / pageLimit) * pageLimit;
    return new Array(Math.min(pageLimit, totalPages - start))
      .fill()
      .map((_, idx) => start + idx + 1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };



  const formatDateForServer = (dateStr) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length !== 3) return "";
    const [dd, mm, yyyy] = parts;
    return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
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
        totalPages,
        gift_type: searchTerm.gift_type || filterToType,
        date_from: formatDateForServer(filterFromDate),
        date_to: formatDateForServer(filterToDate),
      }).toString();

      const response = await fetch(
        `${API_URL}/download-property-income-excel-by-associate?${params}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to download Excel");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Filtered Users Wallet Ledger Report.xlsx`);
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
        icon: "warning",
        title: "Download Failed!",
        text: "Please Check Entered From Date & To Date For Downloading TDS Report.",
      });
    }
  };

  return (
    <div className="padding_15">
      <div className="userlist">
        <div className="card shadow-sm">
          <div className="card-header d-flex justify-content-between align-items-center gap-2">
            <div className="titlepage">
              <h3>Team Rewards Running Winning Lists</h3>
            </div>

            {/* <div className="createnewadmin">
              <Link to="/add-new-offer-gifts" className="btn btn-success d-flex align-items-center">
                <FaPlus className="me-2" /> Add New Offer
              </Link>
            </div> */}

            <div className="d-block d-md-none">
              <button
                className={`filter-toggle-btn btn btn-primary ${isFilterActive ? "active" : ""}`}
                onClick={handleToggle}
              >
                {isFilterActive ? <MdFilterAltOff /> : <MdFilterAlt />}
              </button>
            </div>
          </div>

          <div className="card-body">
            {isFilterActive && (
              <Row className="mb-3 gy-2 mobilesed">
                <Col md={6}>
                  <input
                    type="text"
                    className="form-control"
                    value={filterFromDate}
                    onChange={(e) => setFilterFromDate(e.target.value)}
                    placeholder="From Date (DD-MM-YYYY)"
                  />
                </Col>
                <Col md={6}>
                  <input
                    type="text"
                    className="form-control"
                    value={filterToDate}
                    onChange={(e) => setFilterToDate(e.target.value)}
                    placeholder="To Date (DD-MM-YYYY)"
                  />
                </Col>
                <Col md={6}>
                  <input
                    type="text"
                    placeholder="Search"
                    className="form-control"
                    value={filterToType}
                    onChange={(e) => setFilterToType(e.target.value)}
                  />
                </Col>

                <Col md={12} className="d-flex justify-content-end gap-2">
                  <Button variant="primary" onClick={() => fetchLedger(1)}>
                    <RiFilterFill /> Filter
                  </Button>
                  <Button
                    className="buttonpadding d-flex gap-2 border border-white"
                    variant="primary"
                    onClick={handleDownloadFilteredExcel}
                  >
                    <BsFiletypeXls className="text-white fs-6" />
                    Download
                  </Button>
                </Col>



              </Row>
            )}

            <div className="d-none d-md-block">
              <Row className="mb-3 gy-2">
                <Col md={3}>
                  <input
                    type="text"
                    className="form-control"
                    value={filterFromDate}
                    onChange={(e) => setFilterFromDate(e.target.value)}
                    placeholder="From Date (DD-MM-YYYY)"
                  />
                </Col>
                <Col md={3}>
                  <input
                    type="text"
                    className="form-control"
                    value={filterToDate}
                    onChange={(e) => setFilterToDate(e.target.value)}
                    placeholder="To Date (DD-MM-YYYY)"
                  />
                </Col>
                <Col md={3}>
                  <input
                    type="text"
                  placeholder="Search"
                    className="form-control"
                    value={filterToType}
                    onChange={(e) => setFilterToType(e.target.value)}
                  />
                </Col>
                <Col md={3} className="d-flex gap-2">
                  <Button variant="primary" onClick={() => fetchLedger(1)}>
                    <RiFilterFill /> Filter
                  </Button>
                  <Button
                    className="buttonpadding d-flex gap-2 border border-white"
                    variant="primary"
                    onClick={handleDownloadFilteredExcel}
                  >
                    <BsFiletypeXls className="text-white fs-6" />
                    Download
                  </Button>
                </Col>
              </Row>
            </div>
          </div>

          <div className="card-body">
            {loading ? (
              <p>Loading records...</p>
            ) : ledger.length === 0 ? (
              <p>No records found.</p>
            ) : (
              <>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>#</th>

                      <th>From Date</th>
                      <th>To Date</th>
                      <th>Booking Date </th>
                      <th>Closing Date</th>

                      <th>Gift Type</th>
                      <th>Area SQYD</th>
                      <th>Offer Name</th>
                      <th>Offer Item</th>


                      <th>Offer Project Name</th>
                      <th>Terms Conditions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ledger.map((item, index) => (
                      <tr key={item.id}>
                        <td>{(currentPage - 1) * pageLimit + index + 1}</td>


                        <td>{(item.date_from) || "-"}</td>
                        <td>{(item.date_to) || "-"}</td>
                        <td>{item.booking_date}</td>
                        <td>{item.closing_date}</td>
                        <td>
                          {item.gift_type
                            ? item.gift_type.charAt(0).toUpperCase() + item.gift_type.slice(1).toLowerCase()
                            : "-"}
                        </td>

                        <td>{item.area_sqyd || "-"}</td>
                        <td> {item.offer_name}</td>
                        <td> {item.offer_item}</td>


                        <td>{item.offer_project_name}</td>
                        <td>  {item.terms_conditions}</td>


                      </tr>
                    ))}
                  </tbody>
                </Table>

                <div className="d-flex justify-content-end mt-3">
                  <Pagination>
                    <Pagination.Prev
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    />
                    {getPaginationGroup().map((item, index) => (
                      <Pagination.Item
                        key={index}
                        active={item === currentPage}
                        onClick={() => handlePageChange(item)}
                      >
                        {item}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminTDSReport;
