import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { Modal, Button, Form, Table, Pagination, Row, Col, Container, Spinner } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin3Fill, RiFilter2Line } from "react-icons/ri";
import { HiOutlineChevronLeft, HiChevronRight } from "react-icons/hi2";
import { BsThreeDots } from "react-icons/bs";

import * as XLSX from 'xlsx';

const API_URL = process.env.REACT_APP_API_URL;

function AdvancePaymentList() {
    const navigate = useNavigate();
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [editModalShow, setEditModalShow] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [editFormData, setEditFormData] = useState({
        id: "",
        category_id: "",
        category_name: "",
        account_id: "",
        payee: "",
        type: "",
        name: "",
        amount: "",
        date: "",
        description: "",
    });


    const [deleteModalShow, setDeleteModalShow] = useState(false);
    const [expenseToDelete, setExpenseToDelete] = useState(null);
    const [categories, setCategories] = useState([]);
    const [bankAccounts, setBankAccounts] = useState([]);
    const [fillterdesign, setfillterdesign] = useState();


    const handlefillter = () => {
        setfillterdesign(prev => (!prev));
    }

    const [searchTerm, setSearchTerm] = useState({
        name: "",
        category: "",
        payee: "",
        type: "",
        amount: "",
        fromdate: "",
        todate: ""
    });

    const getAuthToken = () => {
        return localStorage.getItem("token");
    };

    const [showMessageModal, setShowMessageModal] = useState(false);
    const [messageModalContent, setMessageModalContent] = useState({
        title: "",
        text: "",
        type: "",
    });

    const showCustomMessageModal = (title, text, type) => {
        setMessageModalContent({ title, text, type });
        setShowMessageModal(true);
    };

    const closeCustomMessageModal = () => {
        setShowMessageModal(false);
    };


    const fetchExpenses = async (page = 1) => {
        const token = getAuthToken();
        if (!token) {
            showCustomMessageModal("Auth Error", "Authentication token not found. Please log in.", "error");
            setLoading(false);
            setDataLoading(false);
            return;
        }
        setLoading(true);
        try {


            const query = new URLSearchParams({
                page,
                name: searchTerm.name,
                payee: searchTerm.payee,
                category: searchTerm.category,
                type: searchTerm.type,
                amount: searchTerm.amount,
                fromdate: searchTerm.fromdate,
                todate: searchTerm.todate
            }).toString();

            const response = await fetch(`${API_URL}/expence-list?${query}`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
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
                showCustomMessageModal("Error", data.message, "error");
            }
        } catch (error) {
            console.error("Failed to fetch expenses:", error);
            showCustomMessageModal("Network Error", "Could not connect to the server.", "error");
        } finally {
            setLoading(false);
            setDataLoading(false);
        }
    };


    const exportAllToExcel = async () => {
        setExporting(true);
        try {
            const token = getAuthToken();
            if (!token) {
                showCustomMessageModal("Authentication Error", "Authentication token not found. Please log in.", "error");
                return;
            }


            let url = `${API_URL}/expense-download`;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                showCustomMessageModal("Error", errorData.message || "Failed to fetch associates.", "error");
                return;
            }

            const data = await response.json();
            const allAssociates = data.data || [];
            const worksheet = XLSX.utils.json_to_sheet(allAssociates.map(associate => ({
                "SL No.": allAssociates.indexOf(associate) + 1,
                "Name": associate.name,
                "Category Name": associate.category_name,
                "Payee": associate.payee,
                "Type": associate.type,
                "Amount": associate.amount,
                "Description": associate.description,
                "Date": associate.date,
            })));

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");
            XLSX.writeFile(workbook, `All_Expenses_${new Date().toISOString().split('T')[0]}.xlsx`);

        } catch (err) {
            console.error("Export error:", err);
            showCustomMessageModal("Error", "Failed to export expenses.", "error");
        } finally {
            setExporting(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchExpenses(1, searchQuery);
    };

    const fetchDropdownData = async () => {
        const token = getAuthToken();
        if (!token) return;

        try {
            const [categoriesResponse, bankAccountsResponse] = await Promise.all([
                fetch(`${API_URL}/expence-category-list`, { headers: { Authorization: `Bearer ${token}` } }),
                fetch(`${API_URL}/expence-bank-account-list`, { headers: { Authorization: `Bearer ${token}` } }),
            ]);

            const categoriesData = await categoriesResponse.json();
            const bankAccountsData = await bankAccountsResponse.json();

            if (categoriesData.status) {
                setCategories(categoriesData.data);
            }
            if (bankAccountsData.status) {
                setBankAccounts(bankAccountsData.data);
            }

        } catch (error) {
            console.error("Failed to fetch dropdown data:", error);
        }
    };

    useEffect(() => {
        fetchExpenses(currentPage);
        fetchDropdownData();
    }, []);


    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            fetchExpenses(pageNumber);
        }
    };

    const handleEditModalShow = (expense) => {
        setEditFormData({
            id: expense.id,
            category_id: expense.category_id,
            category_name: expense.category_name,
            account_id: expense.account_id,
            account_name: expense.account_name,
            type: expense.type,
            name: expense.name,
            amount: expense.amount,
            date: expense.date,
            description: expense.description,
        });
        setEditModalShow(true);
    };

    const handleEditModalClose = () => {
        setEditModalShow(false);
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData((prevData) => {
            const newData = { ...prevData, [name]: value };

            if (name === "category_id") {
                const selectedCategory = categories.find(cat => cat.id.toString() === value);
                newData.category_name = selectedCategory ? selectedCategory.name : "";
            }
            if (name === "account_id") {
                const selectedAccount = bankAccounts.find(acc => acc.id.toString() === value);
                newData.payee = selectedAccount ? selectedAccount.payee : "";
            }
            return newData;
        });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = getAuthToken();

        const payload = {
            ...editFormData,
            amount: parseFloat(editFormData.amount)
        };

        try {
            const response = await fetch(`${API_URL}/expence-update`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to update expense.");
            }

            const result = await response.json();

            if (result.success == "1") {
                showCustomMessageModal("Success", result.message, "success");
                handleEditModalClose();
                fetchExpenses(currentPage);
            }
            else {
                throw new Error(result.message || "Failed to update Expenses.");
            }

        } catch (error) {
            console.error("Error updating expense:", error);
            showCustomMessageModal("Error", error.message || "An unexpected error occurred.", "error");
        } finally {
            setLoading(false);
        }
    };


    const handleDeleteModalShow = (expenseId) => {
        setExpenseToDelete(expenseId);
        setDeleteModalShow(true);
    };

    const handleDeleteModalClose = () => {
        setDeleteModalShow(false);
        setExpenseToDelete(null);
    };

    const handleConfirmDelete = async () => {
        setLoading(true);
        const token = getAuthToken();

        try {
            const response = await fetch(`${API_URL}/expence-delete`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ id: expenseToDelete }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to delete expense.");
            }

            const result = await response.json();
            showCustomMessageModal("Success", result.message, "success");

            handleDeleteModalClose();
            fetchExpenses(currentPage); // Refresh the list

        } catch (error) {
            console.error("Error deleting expense:", error);
            showCustomMessageModal("Error", error.message || "An unexpected error occurred.", "error");
        } finally {
            setLoading(false);
        }
    };


    return (
        <Container fluid>
            <div className="card">
                <div className="card-header expenselistdesign">
                    <div className="d-flex justify-content-between align-items-center w-100">
                        <div className="titlepage expenselist">
                            <h3>Expenses List</h3>
                        </div>
                        <div className="d-flex gap-2">
                            <div onClick={handlefillter} className="fillterbutton">
                                <RiFilter2Line />      Filter
                            </div>

                            <button
                                className="exportingall"
                                onClick={exportAllToExcel}
                                disabled={exporting}
                            >
                                {exporting ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Exporting All...
                                    </>
                                ) : (
                                    "Download"
                                )}
                            </button>

                            <Link to="/expence-add" className="">
                                <Button variant="primary">
                                    <FaPlus className="me-2" /> Add New Expense
                                </Button>
                            </Link>

                        </div>
                    </div>
                </div>
                <div className="card-body">
                    {fillterdesign && (
                        <div className="d-flex gap-2 align-items-center w-100 justify-content-between flex-wrap-mobile width_all_page_design">
                            <div className="form_design">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Name"
                                    value={searchTerm.name}
                                    onChange={(e) =>
                                        setSearchTerm({
                                            ...searchTerm,
                                            [e.target.name]: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="form_design">
                                <input
                                    type="text"
                                    name="payee"
                                    placeholder="Payee"
                                    value={searchTerm.payee}
                                    onChange={(e) =>
                                        setSearchTerm({
                                            ...searchTerm,
                                            [e.target.name]: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="form_design">
                                <select
                                    name="category"
                                    className=""
                                    value={searchTerm.category}
                                    onChange={(e) =>
                                        setSearchTerm({
                                            ...searchTerm,
                                            [e.target.name]: e.target.value,
                                        })
                                    }
                                >
                                    <option value="">Category</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.name}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>

                            </div>

                            <div className="form_design">
                                <select
                                    name="type"
                                    className=""
                                    value={searchTerm.type}
                                    onChange={(e) =>
                                        setSearchTerm({
                                            ...searchTerm,
                                            [e.target.name]: e.target.value,
                                        })
                                    }
                                >
                                    <option value="">Type</option>
                                    <option value="online">Online</option>
                                    <option value="cash">Cash</option>
                                </select>

                            </div>

                            <div className="form_design">
                                <input
                                    type="date"
                                    name="fromdate"
                                    placeholder="From Date"
                                    value={searchTerm.fromdate}
                                    onChange={(e) =>
                                        setSearchTerm({
                                            ...searchTerm,
                                            [e.target.name]: e.target.value,
                                        })
                                    }
                                    className="form-control"
                                />
                            </div>

                            <div className="form_design">
                                <input
                                    type="date"
                                    name="todate"
                                    placeholder="To Date"
                                    value={searchTerm.todate}
                                    onChange={(e) =>
                                        setSearchTerm({
                                            ...searchTerm,
                                            [e.target.name]: e.target.value,
                                        })
                                    }
                                    className="form-control"
                                />
                            </div>

                            <div className="form_design">
                                <button
                                    type="button"
                                    className="searchbutton"
                                    onClick={handleSearch}>
                                    Search
                                </button>
                            </div>

                        </div>
                    )}
                    <Row className="mt-4">
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
                                                <th>Name</th>
                                                <th>Category</th>
                                                <th>Payee</th>
                                                <th>Amount</th>
                                                <th>Type</th>
                                                <th>Expense Date</th>
                                                <th>Pay Date</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {expenses.length > 0 ? (
                                                expenses.map((expense, index) => (
                                                    <tr key={expense.id}>
                                                        <td>{index + 1}</td>
                                                        <td>{expense.name}</td>
                                                        <td>{expense.category_name}</td>
                                                        <td>{expense.payee}</td>
                                                        <td>{expense.amount}</td>
                                                        <td>{expense.type}</td>
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
                                                            <div className="dropdown">
                                                                <button
                                                                    className="btn light btn-action dropdown-toggle"
                                                                    type="button"
                                                                    id="dropdownMenuButton"
                                                                    data-bs-toggle="dropdown"
                                                                    aria-expanded="false"
                                                                >
                                                                    <BsThreeDots size={20} />
                                                                </button>

                                                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                                    <li className="dropdown-item">
                                                                        <button
                                                                            className="btn edit_btn btn-sm me-1"
                                                                            onClick={() => handleEditModalShow(expense)}
                                                                            title="Edit Project"
                                                                        >
                                                                            <FaEdit /> Edit
                                                                        </button>
                                                                    </li>

                                                                    <li className="dropdown-item">
                                                                        <button
                                                                            className="btn delete_btn btn-sm"
                                                                            onClick={() => handleDeleteModalShow(expense.id)}
                                                                            title="Delete Project"
                                                                        >
                                                                            <RiDeleteBin3Fill /> Delete
                                                                        </button>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </td>

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


            {/* Edit Expense Modal */}
            <Modal show={editModalShow} onHide={handleEditModalClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Expense</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleEditSubmit}>
                    <Modal.Body>
                        <Row>
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Category</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="category_id"
                                        value={editFormData.category_id}
                                        onChange={handleEditFormChange}
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categories?.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Select Name</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="account_id"
                                        value={editFormData.account_id}
                                        onChange={handleEditFormChange}
                                        required
                                    >
                                        <option value="">Select Name</option>
                                        {bankAccounts?.map(acc => (
                                            <option key={acc.id} value={acc.id}>{acc.name} - {acc.payee}</option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Receiver Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={editFormData.name}
                                        onChange={handleEditFormChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Amount</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="amount"
                                        value={editFormData.amount}
                                        onChange={handleEditFormChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Type</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="type"
                                        value={editFormData.type}
                                        onChange={handleEditFormChange}
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="date"
                                        value={editFormData.date}
                                        onChange={handleEditFormChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="description"
                                        rows={3}
                                        value={editFormData.description}
                                        onChange={handleEditFormChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleEditModalClose}>Cancel</Button>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? <Spinner animation="border" size="sm" /> : "Save Changes"}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={deleteModalShow} onHide={handleDeleteModalClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this expense? This action cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleDeleteModalClose}>Cancel</Button>
                    <Button variant="danger" onClick={handleConfirmDelete} disabled={loading}>
                        {loading ? <Spinner animation="border" size="sm" /> : "Delete"}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Message Modal */}
            <Modal show={showMessageModal} onHide={closeCustomMessageModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title className={messageModalContent.type === "success" ? "text-success" : "text-danger"}>
                        {messageModalContent.title}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {messageModalContent.text}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={closeCustomMessageModal}>OK</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default AdvancePaymentList;