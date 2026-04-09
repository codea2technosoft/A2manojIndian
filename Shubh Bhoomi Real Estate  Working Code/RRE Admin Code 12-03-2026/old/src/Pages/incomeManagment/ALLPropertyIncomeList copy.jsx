import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { Modal, Button, Form, Table, Pagination, Row, Col, Spinner, Dropdown } from "react-bootstrap";
import { FaEye, FaEdit } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { MdFilterAlt, MdFilterAltOff } from "react-icons/md";

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

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const getAuthToken = () => {
    return localStorage.getItem("token");
  };
  const fetchIncomeRecords = async (page = 1) => {
    setLoading(true);
    try {
      const authToken = getAuthToken();
      if (!authToken) {
        console.error("No authentication token found. Redirecting...");
        setLoading(false);
        return;
      }

      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`,
      };
      const response = await fetch(`${INCOME_API_ENDPOINT}?page=${page}&limit=${ITEMS_PER_PAGE}`, {
        method: "GET",
        headers: headers,
      });

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
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
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
        </div>
      </div>

      <div className="card-body">
        <Row className="mb-3">
          <Col md={6}>
            <div className="p-3 bg-light rounded shadow-sm">
              <h5 className="text-muted">Total Commission</h5>
              <h3 className="text-success">{totalCommission.toLocaleString('en-IN')}</h3>
            </div>
          </Col>
          <Col md={6}>
            <div className="p-3 bg-light rounded shadow-sm">
              <h5 className="text-muted">Total Records</h5>
              <h3 className="text-primary">{totalItems}</h3>
            </div>
          </Col>
        </Row>

        {loading ? (
          <div className="text-center my-5"><Spinner animation="border" /></div>
        ) : incomeRecords.length === 0 ? (
          <div className="text-center text-gray-500 py-10">No commission records found.</div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <Table striped bordered hover responsive className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Customer Name</th>
                  <th>Customer Mobile</th>
                  <th>Plot Number</th>
                  <th>Colony Name</th>
                  <th>Total Plot Area</th>
                  <th>Area</th>
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
                </tr>
              </thead>
              <tbody>
                {incomeRecords.map((record, index) => (
                  <tr key={record.income_id}>
                    <td>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                    <td>
                      {record.date
                        ? new Date(record.date).getDate().toString().padStart(2, "0") +
                        "-" +
                        (new Date(record.date).getMonth() + 1).toString().padStart(2, "0") +
                        "-" +
                        new Date(record.date).getFullYear()
                        : ""}
                    </td>
                    <td>
                      {record.customer_name
                        ? record.customer_name.charAt(0).toUpperCase() + record.customer_name.slice(1).toLowerCase()
                        : ""}
                    </td>
                    <td>{record.customer_mobile}</td>
                    <td>
                      {record.plot_no
                        ? record.plot_no
                          .toLowerCase()
                          .replace(/\b\w/g, (char) => char.toUpperCase())
                        : ""}
                    </td>

                    <td>
                      {record.colony_name
                        ? record.colony_name
                          .toLowerCase()
                          .replace(/\b\w/g, (char) => char.toUpperCase())
                        : ""}
                    </td>
                    <td>{record.total_plot_area}</td>
                    <td>{record.area}</td>
                    <td>₹ {record.rate}</td>
                    <td>₹ {record.bv}</td>
                    <td
                      style={{
                        color: [
                          "gray",    // 0
                          "red",     // 1
                          "orange",  // 2
                          "orange",  // 3
                          "green",   // 4
                          "blue",    // 5
                          "indigo",  // 6
                          "violet",  // 7
                          "pink",    // 8
                          "brown",   // 9
                          "purple",  // 10
                          "teal",    // 11
                        ][record.level] || "black",
                        fontWeight: "bold",
                      }}
                    >
                      {record.level}
                    </td>

                    <td>
                      {record.associate_name
                        ? record.associate_name.charAt(0).toUpperCase() + record.associate_name.slice(1).toLowerCase()
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
                      <strong
                        style={{
                          color:
                            record.payable_amount >= 0 ? "green" : "red"
                        }}
                      >
                        ₹ {(record.payable_amount = record.net_payout - record.advance_balance).toFixed(2)}
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
              <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
              {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => handlePageChange(index + 1)}>
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
            </Pagination>
          </div>
        )}
      </div>

    </div>
  );
}

export default ALLPropertyIncomeList;