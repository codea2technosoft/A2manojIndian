import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus, FaEye } from "react-icons/fa";
import { Modal, Button, Form, Table, Pagination, Row, Col, Container, Spinner } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin3Fill } from "react-icons/ri";
import { HiOutlineChevronLeft, HiChevronRight } from "react-icons/hi2";
import { BsThreeDots } from "react-icons/bs";

const API_URL = process.env.REACT_APP_API_URL;

function ExpensesDateWise() {
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
            const response = await fetch(`${API_URL}/expence-datewaise?page=${page}&limit=10`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch expenses.");
            }
            const data = await response.json();
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
    }, [currentPage]);

    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            fetchExpenses(pageNumber);
        }
    };

    const handleView = (date) => {

        const parts = date.split('-');
        if (parts.length === 3) {
            const [day, month, year] = parts;
            const isoDate = `${year}-${month}-${day}`;
            navigate(`/expenses-by-date/${isoDate}`);
        } else {
            const onlyDate = date.split("T")[0];
            navigate(`/expenses-by-date/${onlyDate}`);
        }
    };


    return (
        <>


            <div className="card mt-2">
                <div className="card-header">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="titlepage">
                            <h3 className="mb-0">Date-wise Expense Report</h3>
                        </div>

                    </div>
                </div>
                <div class="card-body">

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
                                        <th>Amount</th>
                                        <th>Date</th>
                                        <th>Count</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {expenses.length > 0 ? (
                                        expenses.map((expense, index) => {
                                            const formattedDate = (() => {
                                                const utcDate = new Date(expense.created_date);
                                                const [year, month, day] = utcDate.toISOString().split('T')[0].split('-');
                                                return `${day}-${month}-${year}`;
                                            })();

                                            return (
                                                <tr key={expense.id}>
                                                    <td>{index + 1}</td>
                                                    <td>₹ {expense.total_amount}</td>
                                                    <td>{formattedDate}</td>
                                                    <td>{expense.total_count}</td>
                                                    <td>
                                                        <button
                                                            className="btn view_btn btn-sm me-1"
                                                            title="Date-wise report"
                                                            onClick={() => handleView(formattedDate)}
                                                        >
                                                            <FaEye />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
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
                </div>
            </div>

        </>
    );
}

export default ExpensesDateWise;