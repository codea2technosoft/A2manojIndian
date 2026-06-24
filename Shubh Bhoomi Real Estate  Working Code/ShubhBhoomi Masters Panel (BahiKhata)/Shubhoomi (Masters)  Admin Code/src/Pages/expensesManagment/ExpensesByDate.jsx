import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaPlus, FaEye } from "react-icons/fa";
import { Modal, Button, Form, Table, Pagination, Row, Col, Container, Spinner } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin3Fill } from "react-icons/ri";
import { HiOutlineChevronLeft, HiChevronRight } from "react-icons/hi2";
import { BsThreeDots } from "react-icons/bs";

const API_URL = process.env.REACT_APP_API_URL;

function ExpensesByDate() {
    const { date } = useParams();
    const navigate = useNavigate();
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
     const formatText = (text) => {
        if (!text || typeof text !== "string") return "NA";
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    };

    const getAuthToken = () => {
        return localStorage.getItem("token");
    };
    const fetchExpenses = async (page = 1) => {
        const token = getAuthToken();
        if (!token) {
            setLoading(false);
            setDataLoading(false);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/expence-datewaise-list?date=${date}&page=${page}&limit=10`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch expenses.");
            }
            const data = await response.json();
            console.warn(data);
            if (data.status) {
                setExpenses(data.data);
                setTotalPages(data.totalPages || 1);
                setCurrentPage(data.currentPage || page);
            } else {
                alert("Error", data.message, "error");
            }
        } catch (error) {
            console.error("Failed to fetch expenses:", error);

        } finally {
            setLoading(false);
            setDataLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses(currentPage);
    }, []);

    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            fetchExpenses(pageNumber);
        }
    };



    return (
        <Container fluid>
            <div className="card">
                <div className="card-header">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="titlepage">

                            <h3 className="mb-0">Datewise CR / DR Ledger Report</h3>
                        </div>
                        <Link to="/expenses-date-wise" className="btn btn-primary">
                            Back
                        </Link>

                    </div>
                </div>
                <div className="card-body">
                    <Row className="">
                        <Col>
                           

                            {dataLoading ? (
                                <div className="text-center p-5">
                                    <Spinner animation="border" />
                                    <p className="mt-2">Loading expenses...</p>
                                </div>
                            ) : (
                                <>
                                    <Table striped bordered hover responsive className="shadow-sm">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                 <th>Category Name</th>
                                                <th>Category Type</th>
                                                <th>Payee Name</th>
                                                <th>Type</th>
                                                <th>Expense Date</th>
                                                <th>Pay Date</th>
                                                <th>Project Name</th>
                                                <th>Unit Number</th>
                                                <th>Descriptions</th>
                                                <th>CR Amount</th>
                                                <th>DR Amount</th>
                                                <th>Balance</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                           {expenses.length > 0 ? (
                                                expenses.map((expense, index) => (
                                                    <tr key={expense.id}>
                                                        <td>{index + 1}</td>
                                                        <td>
                                                            {(expense.category_name)}
                                                        </td>
                                                        <td>
                                                            {expense.category_type || "NA"}
                                                        </td>
                                                        <td>
                                                            {formatText(expense.payee)}
                                                        </td>

                                                        <td>
                                                            <span style={{ color: "blue" }}>
                                                                {expense.type}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            {(() => {
                                                                const d = new Date(expense.date);
                                                                const day = String(d.getDate()).padStart(2, "0");
                                                                const month = String(d.getMonth() + 1).padStart(2, "0");
                                                                const year = d.getFullYear();
                                                                return `${day}-${month}-${year}`;
                                                            })()}
                                                        </td>
                                                        <td>
                                                            {(() => {
                                                                const d = new Date(expense.created_at);
                                                                const day = String(d.getDate()).padStart(2, "0");
                                                                const month = String(d.getMonth() + 1).padStart(2, "0");
                                                                const year = d.getFullYear();
                                                                return `${day}-${month}-${year}`;
                                                            })()}
                                                        </td>
                                                        <td>
                                                            {expense.project_name || "NA"}
                                                        </td>
                                                        <td>
                                                            {expense.plot_shop_villa_no || "NA"}
                                                        </td>
                                                        <td>
                                                            <div className="table-cell-remark">
                                                                {expense.description ? (expense.description.charAt(0).toUpperCase() + expense.description.slice(1).toLowerCase()) : "NA"}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            {/* CR Amount Column */}
                                                            {expense.category_type === 'cr' ? (
                                                                <span style={{ color: "green", fontWeight: "bold" }}>
                                                                    ₹ {expense.amount}
                                                                </span>
                                                            ) : (
                                                                <span style={{ color: "#ccc" }}>₹ 0</span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            {/* DR Amount Column */}
                                                            {expense.category_type === 'dr' ? (
                                                                <span style={{ color: "red", fontWeight: "bold" }}>
                                                                    ₹ {expense.amount}
                                                                </span>
                                                            ) : (
                                                                <span style={{ color: "#ccc" }}>₹ 0</span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            {/* Balance Column */}
                                                            <span
                                                                style={{
                                                                    color: expense.running_balance >= 0 ? "green" : "red",
                                                                    fontWeight: "bold"
                                                                }}
                                                            >
                                                                ₹ {expense.running_balance?.toLocaleString() || 0}
                                                            </span>
                                                        </td>
                                                        {/* <td>
                                                            {(() => {
                                                                const d = new Date(expense.date);
                                                                const day = String(d.getDate()).padStart(2, "0");
                                                                const month = String(d.getMonth() + 1).padStart(2, "0");
                                                                const year = d.getFullYear();
                                                                return `${day}-${month}-${year}`;
                                                            })()}
                                                        </td> */}
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="8" className="text-center">No expenses found.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>

                                    <div className="d-flex justify-content-end">
                                        <nav>
                                            <ul className="pagination">
                                                <li className="page-item">
                                                    <button
                                                        className="page-link"
                                                        onClick={() => handlePageChange(currentPage - 1)}
                                                        disabled={currentPage === 1}
                                                        aria-label="Previous"
                                                    >
                                                        <HiOutlineChevronLeft />
                                                    </button>
                                                </li>

                                                {[...Array(totalPages)].map((_, index) => (
                                                    <li key={index + 1} className="page-item">
                                                        <button
                                                            className={`page-link ${index + 1 === currentPage ? "active" : ""}`}
                                                            onClick={() => handlePageChange(index + 1)}
                                                        >
                                                            {index + 1}
                                                        </button>
                                                    </li>
                                                ))}

                                                <li className="page-item">
                                                    <button
                                                        className="page-link"
                                                        onClick={() => handlePageChange(currentPage + 1)}
                                                        disabled={currentPage === totalPages}
                                                        aria-label="Next"
                                                    >
                                                        <HiChevronRight />
                                                    </button>
                                                </li>
                                            </ul>
                                        </nav>
                                    </div>
                                </>
                            )}
                        </Col>
                    </Row>
                </div>
            </div>

        </Container>
    );
}

export default ExpensesByDate;