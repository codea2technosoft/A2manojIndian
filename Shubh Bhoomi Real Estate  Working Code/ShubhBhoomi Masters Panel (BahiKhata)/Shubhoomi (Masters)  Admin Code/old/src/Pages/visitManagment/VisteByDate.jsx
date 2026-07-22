import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaPlus, FaEye } from "react-icons/fa";
import { Modal, Button, Form, Table, Pagination, Row, Col, Container, Spinner } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin3Fill } from "react-icons/ri";
import { HiOutlineChevronLeft, HiChevronRight } from "react-icons/hi2";
import { BsThreeDots } from "react-icons/bs";

const API_URL = process.env.REACT_APP_API_URL;

function VisteByDate() {
    const { date } = useParams();
    const navigate = useNavigate();
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
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
            const response = await fetch(`${API_URL}/visite-dateWaise-view?date=${date}&page=${page}&limit=10`, {
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
            if (data.success == "1") {
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

                            <h3 className="mb-0">Visit By Date Report</h3>
                        </div>
                        <Link to="/visit-date-wise" className="btn btn-primary">
                            Back
                        </Link>

                    </div>
                </div>
                <div className="card-body">
                    <Row className="mt-4">
                        <Col>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h2></h2>

                            </div>

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
                                                <th>#</th>
                                                <th>Name</th>
                                                <th>Mobile</th>
                                                <th>Start Time</th>
                                                <th>Start Address</th>
                                                <th>End Time</th>
                                                <th>End Address</th>
                                                <th>Distance(Meter)</th>
                                                <th>Per KM Amount</th>
                                                <th>Total Amount</th>
                                                <th>Status</th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            {expenses.length > 0 ? (
                                                expenses.map((expense, index) => (
                                                    <tr key={expense.id}>
                                                        {/* Corrected serial number - shows 1-10 on page 1, 11-20 on page 2, etc. */}
                                                        <td>{(currentPage - 1) * 10 + index + 1}</td>
                                                        <td>{expense.user_name}</td>
                                                        <td>{expense.mobile}</td>
                                                        <td>
                                                            {new Date(expense.start_time).toLocaleString('en-US', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric',
                                                                hour: 'numeric',
                                                                minute: '2-digit',
                                                                second: '2-digit',
                                                                hour12: true
                                                            })}
                                                        </td>
                                                        <td>{expense.start_address}</td>
                                                        <td>
                                                            {new Date(expense.end_time).toLocaleString('en-US', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric',
                                                                hour: 'numeric',
                                                                minute: '2-digit',
                                                                second: '2-digit',
                                                                hour12: true
                                                            })}
                                                        </td>
                                                        <td>{expense.end_address}</td>
                                                        <td>{expense.distance}</td>
                                                 <td>
  &#8377; {Number(expense.per_kilometer_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
</td>
                                                     <td>
  &#8377; {Number(expense.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
</td>
                                                        <td style={{
                                                            color: expense.status === 'end' ? 'green' : expense.status === 'start' ? 'red' : 'inherit'
                                                        }}>
                                                            {expense.status.toUpperCase()} 
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="11" className="text-center">No Visit found.</td>
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

export default VisteByDate;