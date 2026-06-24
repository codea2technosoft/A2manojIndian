import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
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
import { MdFilterAlt } from "react-icons/md";
import { MdFilterAltOff } from "react-icons/md";
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
  const [filterAssociateName, setFilterAssociateName] = useState("");
  const [filterAssociateMobile, setFilterAssociateMobile] = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedIncomeId, setSelectedIncomeId] = useState(null);
  const [parentCommissionData, setParentCommissionData] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const getAuthToken = () => localStorage.getItem("token");
  const [isFilterActive, setIsFilterActive] = useState(false);
  const handleToggle = () => {
    setIsFilterActive(!isFilterActive);
  };
  // const fetchIncomeRecords = async (page = 1) => {
  //   setLoading(true);
  //   try {
  //     const authToken = getAuthToken();
  //     if (!authToken) return setLoading(false);

  //     const response = await fetch(`${INCOME_API_ENDPOINT}?page=${page}&limit=${ITEMS_PER_PAGE}`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${authToken}`,
  //       },
  //     });

  //     if (response.ok) {
  //       const result = await response.json();
  //       setIncomeRecords(result.data || []);
  //       setTotalItems(result.total || 0);
  //       setTotalCommission(result.total_commission || 0);
  //       setCurrentPage(result.page || page);
  //     } else {
  //       console.error("Failed to fetch income records:", response.statusText);
  //       setIncomeRecords([]);
  //     }
  //   } catch (error) {
  //     console.error("Network or unexpected error:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
        associate_name: filterAssociateName,
        associate_mobile: filterAssociateMobile,
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

  const fetchParentCommission = async (id) => {
    setModalLoading(true);
    try {
      const authToken = getAuthToken();
      if (!authToken) return;
      const response = await fetch(
        `${API_URL}/parent-commission-list-view?source_direct_income_id=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        },
      );

      const data = await response.json();

      if (data.success === 0) {
        // Show short SweetAlert message
        Swal.fire({
          icon: "error",
          title: "No Commission",
          text: "No commission data found", // <-- Short message here
        });
        setParentCommissionData(null);
        setShowModal(false);
      } else {
        setParentCommissionData(data);
        setShowModal(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setModalLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomeRecords(currentPage);
  }, [currentPage]);

  return (
    <div className="card mt-2">
      <div className="card-header">
        <div className="d-flex justify-content-between align-items-center">
          <h3 className="mb-0">All Property Commission List</h3>
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
                placeholder="Colony Name"
                className="form-control"
                value={filterColonyName}
                onChange={(e) => setFilterColonyName(e.target.value)}
              />
            </Col>
            <Col md={6}>
              <input
                type="number"
                placeholder="Rate"
                className="form-control"
                value={filterRate}
                onChange={(e) => setFilterRate(e.target.value)}
              />
            </Col>
            <Col md={6}>
              <input
                type="number"
                placeholder="BV"
                className="form-control"
                value={filterBV}
                onChange={(e) => setFilterBV(e.target.value)}
              />
            </Col>
            <Col md={6}>
              <input
                type="number"
                placeholder="Level"
                className="form-control"
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
              />
            </Col>

            <Col md={12}>
              <Button variant="primary" onClick={() => fetchIncomeRecords(1)}>
                Filter
              </Button>
            </Col>
          </Row>
        )}
        <Row className="mb-3 gy-2">
          <Col md={6}>
            <div className="p-3 bg-light rounded shadow-sm">
              <h5 className="text-muted">Total Commission</h5>
              <h3 className="text-success">
                {totalCommission.toLocaleString("en-IN")}
              </h3>
            </div>
          </Col>
          <Col md={6}>
            <div className="p-3 bg-light rounded shadow-sm">
              <h5 className="text-muted">Total Records</h5>
              <h3 className="text-primary">{totalItems}</h3>
            </div>
          </Col>
        </Row>
        
        <div className="d-none d-md-block">
          <Row className="mb-3">
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
            <Col md={1}>
              <input
                type="text"
                placeholder="Plot"
                className="form-control"
                value={filterPlotNo}
                onChange={(e) => setFilterPlotNo(e.target.value)}
              />
            </Col>
            <Col md={2}>
              <input
                type="text"
                placeholder="Colony Name"
                className="form-control"
                value={filterColonyName}
                onChange={(e) => setFilterColonyName(e.target.value)}
              />
            </Col>
            <Col md={1}>
              <input
                type="number"
                placeholder="Rate"
                className="form-control"
                value={filterRate}
                onChange={(e) => setFilterRate(e.target.value)}
              />
            </Col>
            <Col md={1}>
              <input
                type="number"
                placeholder="BV"
                className="form-control"
                value={filterBV}
                onChange={(e) => setFilterBV(e.target.value)}
              />
            </Col>
            <Col md={1}>
              <input
                type="number"
                placeholder="Level"
                className="form-control"
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
              />
            </Col>

            <Col md={2}>
              <Button variant="primary" onClick={() => fetchIncomeRecords(1)}>
                Filter
              </Button>
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
                  <th>Date</th>
                  <th>Customer Name</th>
                  <th>Customer Mobile</th>
                  <th>Unit Number</th>
                  <th>Colony Name</th>
                  <th>Total Unit Area (SQYD)</th>
                  <th>Area (SQYD)</th>
                  <th>Rate</th>
                  <th>BV</th>
                  <th>Level</th>
                  <th>Associate Name</th>
                  <th>Associate Mobile</th>
                  <th>Old SQYD</th>
                  <th>New SQYD</th>
                  <th>Old Slab</th>
                  <th>Payable BV</th>
                  <th>New Slab</th>
                  <th>Gross Payout</th>
                  <th>TDS (%)</th>
                  <th>Net Payout</th>
                  <th>Advance Balance</th>
                  <th>Payable Amount</th>
                  <th>Total Gross Payout</th>
                  <th>Total TDS</th>
                  <th>Total Net Payout</th>
                  <th>Total Advance</th>
                  {/* <th>Advance Received</th>
                  <th>Total Advance Balance</th> */}
                  <th>Total Payable Amount</th>
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
                        onClick={() => fetchParentCommission(record.income_id)}
                      >
                        <FaEye /> Show
                      </Button>
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
                    <td>
                      {record.customer_name
                        ? record.customer_name.charAt(0).toUpperCase() +
                          record.customer_name.slice(1).toLowerCase()
                        : ""}
                    </td>

                    <td>{record.customer_mobile}</td>
                    <td>
                      {record.plot_no
                        ? record.plot_no.charAt(0).toUpperCase() +
                          record.plot_no.slice(1).toLowerCase()
                        : ""}
                    </td>

                    <td>
                      {record.colony_name
                        ? record.colony_name.charAt(0).toUpperCase() +
                          record.colony_name.slice(1).toLowerCase()
                        : ""}
                    </td>

                    <td>{record.total_plot_area}</td>
                    <td>{record.area}</td>
                    <td>₹ {record.rate}</td>
                    <td> {record.bv} %</td>
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
                    <td>₹ {record.tds}</td>
                    <td>₹ {record.net_payout}</td>
                    <td>₹ {record.advance_balance}</td>
                    <td>
                      ₹{" "}
                      {(record.payable_amount =
                        record.net_payout - record.advance_balance).toFixed(2)}
                    </td>

                    <td>₹ {record.TotalGrossPayout}</td>
                    <td>₹ {record.TotalTDS}</td>
                    <td>₹ {record.TotalNetPayout}</td>
                    <td>₹ {record.TotalAdvanceBalance}</td>
                    {/* <td>₹ {0.00}</td>
                    <td>₹ {0.00}</td> */}
                    <td>₹ {record.TotalPayableAmount}</td>
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

      {/* Parent Commission Modal */}
      {/* Parent Commission Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="xl"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Parent Commission Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalLoading ? (
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          ) : parentCommissionData &&
            parentCommissionData.data &&
            parentCommissionData.data.length > 0 ? (
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
                    <th>Date</th>
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
                    <th>TDS</th>
                    <th>Net Payout</th>
                    <th>Advance Balance</th>
                    <th>Payable Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {parentCommissionData.data.map((record, idx) => (
                    <tr key={record.id}>
                      <td>{idx + 1}</td>
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
                      <td>
                        {record.associate_name
                          ? record.associate_name.charAt(0).toUpperCase() +
                            record.associate_name.slice(1).toLowerCase()
                          : ""}
                      </td>
                      <td>{record.associate_mobile}</td>

                      <td>
                        {record.desigination
                          ? record.desigination.charAt(0).toUpperCase() +
                            record.desigination.slice(1).toLowerCase()
                          : ""}
                      </td>
                      <td>{record.level}</td>
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
                        <strong
                          style={{
                            color: record.payable_amount >= 0 ? "green" : "red",
                          }}
                        >
                          ₹{" "}
                          {(record.payable_amount =
                            record.net_payout - record.advance_balance).toFixed(
                            2,
                          )}
                        </strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <div>No data found.</div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ALLPropertyIncomeList;
