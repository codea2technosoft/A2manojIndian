import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Table,
  Button,
  Spinner,
  Row,
  Col,
  Pagination,
  Form,
} from "react-bootstrap";
import Swal from "sweetalert2";
import { MdFilterAlt } from "react-icons/md";
import { MdFilterAltOff } from "react-icons/md";
import { BsFiletypeXls } from "react-icons/bs";
import { RiFilterFill } from "react-icons/ri";
const API_URL = process.env.REACT_APP_API_URL;
const ITEMS_PER_PAGE = 10;

function ParentCommissionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [filterPlotNo, setFilterPlotNo] = useState("");
  const [filterColonyName, setFilterColonyName] = useState("");
  const [filterRate, setFilterRate] = useState("");
  const [filterBV, setFilterBV] = useState("");
  const [filterLeadID, setLeadID] = useState("");
  const [filterAssociateName, setFilterAssociateName] = useState("");
  const [filterAssociateMobile, setFilterAssociateMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [commissionData, setCommissionData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter states
  const [filterName, setFilterName] = useState("");
  const [filterMobile, setFilterMobile] = useState("");
  const [filterLevel, setFilterLevel] = useState("");

  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");

  const getAuthToken = () => localStorage.getItem("token");
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const handleToggle = () => {
    setIsFilterActive(!isFilterActive);
  };
  // Fetch Parent Commission Data
  const fetchParentCommission = async (page = 1) => {
    setLoading(true);
    try {
      const token = getAuthToken();
      if (!token) return;

      const params = new URLSearchParams({
        page,
        limit: ITEMS_PER_PAGE,
        source_direct_income_id: id,
        parent_name: filterName,
        parent_mobile: filterMobile,
        level: filterLevel,
        lead_id: filterLeadID,
        from_date: formatDateForServer(filterFromDate), // <-- converted
        to_date: formatDateForServer(filterToDate), // <-- converted
      });

      const response = await fetch(
        `${API_URL}/child-commission-list-for-parent?${params}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (data.success === 0 || !data.data || data.data.length === 0) {
        setCommissionData([]);
        setTotalItems(0);
        Swal.fire({
          icon: "warning",
          title: "No Commission Found",
          text: "No commission data available for this record.",
        });
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
    // eslint-disable-next-line
  }, [currentPage]);

  // DD-MM-YYYY -> YYYY-MM-DD
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
        source_direct_income_id: id,
        parent_name: filterName,
        parent_mobile: filterMobile,
        level: filterLevel,
        lead_id: filterLeadID,
        from_date: formatDateForServer(filterFromDate), // <-- converted
        to_date: formatDateForServer(filterToDate), // <-- converted
      });

      const response = await fetch(
        `${API_URL}/download-property-income-excel-by-associate-for-child?${params.toString()}`,
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

  return (
    <div className="card mt-3">
      <div className="card-header">
        <div className="d-flex flex-wrap-mobile justify-content-between align-items-md-center">
          <div className="titlepage">
            <h3 className="mb-0">Downline Commission Details</h3>
          </div>
          <div className="d-flex gap-2 align-items-center">
            <Button
              className="buttonpadding d-flex gap-2 border border-white"
              variant="primary"
              onClick={handleDownloadFilteredExcel}
            >
              <BsFiletypeXls className="text-white fs-6" />
              Download
            </Button>
            <button
              className={`btn btn-primary filter-toggle-btn d-md-none ${isFilterActive ? "active" : ""}`}
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

      {isFilterActive && (
        <div className="card-body pb-0">
          <Row className="mb-3 gy-2 mobilesed">
            <Col md={6} lg={3} className="">
              <Form.Control
                type="text"
                placeholder="Associates Name"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
              />
            </Col>
            <Col md={6} lg={3} className="">
              <Form.Control
                type="text"
                placeholder="Associates Mobile"
                value={filterMobile}
                onChange={(e) => setFilterMobile(e.target.value)}
              />
            </Col>

            <Col md={3} lg={3}>
              <input
                type="date"
                className="form-control"
                value={filterFromDate}
                onChange={(e) => setFilterFromDate(e.target.value)}
                placeholder="From Date (DD-MM-YYYY)"
              />
            </Col>
            <Col md={3} lg={3}>
              <input
                type="date"
                className="form-control"
                value={filterToDate}
                onChange={(e) => setFilterToDate(e.target.value)}
                placeholder="To Date (DD-MM-YYYY)"
              />
            </Col>

            <Col md={3} lg={3} className="">
              <Form.Control
                type="number"
                placeholder="Level"
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
              />
            </Col>
            <Col md={3} lg={3} className="">
              <Form.Control
                type="number"
                placeholder="Designation"
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
              />
            </Col>

            <Col md={3} lg={3}>
              <input
                type="text"
                placeholder="Lead ID"
                className="form-control"
                value={filterLeadID}
                onChange={(e) => setLeadID(e.target.value)}
              />
            </Col>

            <Col md={2} lg={3}>
              <Button variant="primary" onClick={handleFilter}>
                <RiFilterFill /> Filter
              </Button>
            </Col>
          </Row>
        </div>
      )}

      <div className="card-body">
         <Row className="mb-3 gy-2 mobilesed d-none d-md-flex">
            <Col md={6} lg={3} className="">
              <Form.Control
                type="text"
                placeholder="Associates Name"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
              />
            </Col>
            <Col md={6} lg={3} className="">
              <Form.Control
                type="text"
                placeholder="Associates Mobile"
                value={filterMobile}
                onChange={(e) => setFilterMobile(e.target.value)}
              />
            </Col>

            <Col md={3} lg={3}>
              <input
                type="date"
                className="form-control"
                value={filterFromDate}
                onChange={(e) => setFilterFromDate(e.target.value)}
                placeholder="From Date (DD-MM-YYYY)"
              />
            </Col>
            <Col md={3} lg={3}>
              <input
                type="date"
                className="form-control"
                value={filterToDate}
                onChange={(e) => setFilterToDate(e.target.value)}
                placeholder="To Date (DD-MM-YYYY)"
              />
            </Col>

            <Col md={3} lg={3} className="">
              <Form.Control
                type="number"
                placeholder="Level"
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
              />
            </Col>
            <Col md={3} lg={3} className="">
              <Form.Control
                type="number"
                placeholder="Designation"
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
              />
            </Col>

            <Col md={3} lg={3}>
              <input
                type="text"
                placeholder="Lead ID"
                className="form-control"
                value={filterLeadID}
                onChange={(e) => setLeadID(e.target.value)}
              />
            </Col>

            <Col md={2} lg={3}>
              <Button variant="primary" onClick={handleFilter}>
                <RiFilterFill /> Filter
              </Button>
            </Col>
          </Row>

        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" />
          </div>
        ) : commissionData.length === 0 ? (
          <div className="text-center text-muted">No data found.</div>
        ) : (
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Lead ID</th>
                  <th>Associates Name</th>
                  <th>Associates Mobile</th>

                  <th>Customer Name</th>
                  <th>Customer Mobile</th>

                  {/* <th>Designation</th> */}

                  <th>Project Name</th>
                  <th>Block Name</th>
                  <th>Unit Number</th>
                  <th>Level</th>
                  <th>Old SQYD</th>
                  <th>New SQYD</th>
                  <th>Old Slab</th>
                  <th>Payable BV</th>
                  <th>New Slab</th>
                  <th>Gross Payout</th>
                  <th>TDS</th>
                  <th>Net Payout</th>
                  <th>Advance Balance</th>
                  <th>Adjusted Advance Balance</th>
                  <th>Remaining Advance Balance</th>
                  <th>Gross Payment</th>
                </tr>
              </thead>
              <tbody>
                {commissionData.map((record, idx) => (
                  <tr key={record.id}>
                    <td>{(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}</td>
                    <td>
                      {record.status_date
                        ? `${new Date(record.status_date).getDate().toString().padStart(2, "0")}-${(
                            new Date(record.status_date).getMonth() + 1
                          )
                            .toString()
                            .padStart(
                              2,
                              "0",
                            )}-${new Date(record.date).getFullYear()}`
                        : ""}
                    </td>
                    <td>{record.lead_id || "N/A"}</td>

                    <td>{record.customname}</td>
                    <td>{record.custommobile}</td>
                    <td>{record.customer_name}</td>
                    <td>{record.customer_mobile}</td>

                    {/* <td>{record.desigination}</td> */}

                    <td>{record.project_name}</td>
                    <td>{record.colony_name}</td>
                    <td>{record.plot_no}</td>

                    <td
                      style={{
                        color:
                          [
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
                    <td>₹ {record.tds}</td>
                    <td>₹ {record.net_payout}</td>
                    <td>₹ {record.advance_balance}</td>

                    <td>
                      ₹{" "}
                      {(() => {
                        const advanceBalance = parseFloat(
                          record.advance_balance,
                        );
                        const netPayout = parseFloat(record.net_payout);
                        let adjustedAmount = 0.0;

                        if (advanceBalance > netPayout) {
                          adjustedAmount = netPayout;
                        } else if (advanceBalance < netPayout) {
                          adjustedAmount = advanceBalance;
                        } else {
                          adjustedAmount = advanceBalance;
                        }

                        return adjustedAmount;
                      })()}
                    </td>

                    <td>
                      ₹{" "}
                      {(() => {
                        const advanceBalance = parseFloat(
                          record.advance_balance,
                        );
                        const netPayout = parseFloat(record.net_payout);
                        let adjustedAmount = 0.0;

                        if (advanceBalance > netPayout) {
                          adjustedAmount = netPayout;
                        } else if (advanceBalance < netPayout) {
                          adjustedAmount = advanceBalance;
                        } else {
                          adjustedAmount = advanceBalance;
                        }

                        return record.advance_balance - adjustedAmount;
                      })()}
                    </td>

                    <td>
                      <strong
                        style={{
                          color:
                            record.net_payout - record.advance_balance >= 0
                              ? "green"
                              : "red",
                        }}
                      >
                        ₹{" "}
                        {(record.net_payout - record.advance_balance).toFixed(
                          2,
                        )}
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
