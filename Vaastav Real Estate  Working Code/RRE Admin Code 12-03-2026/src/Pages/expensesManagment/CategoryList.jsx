import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { Modal, Button, Form, Table, Pagination, Row, Col, Container } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin3Fill } from "react-icons/ri";
import { HiOutlineChevronLeft, HiChevronRight } from "react-icons/hi2";
import { BsThreeDots } from "react-icons/bs";

const API_URL = process.env.REACT_APP_API_URL;

function CategoryList() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [editModalData, setEditModalData] = useState({
        show: false,
        id: null,
        name: "",
    });
    const [deleteModalData, setDeleteModalData] = useState({
        show: false,
        id: null,
        name: "",
    });
    const [actionLoading, setActionLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState("success");

    const getAuthToken = () => {
        return localStorage.getItem("token");
    };

    const showToastMessage = (message, variant) => {
        setToastMessage(message);
        setToastVariant(variant);
        setShowToast(true);
    };

    const fetchCategories = async (page = 1) => {
        setLoading(true);
        const token = getAuthToken();
        if (!token) {
            setError("Authentication token not found. Please log in.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/expence-category-list?page=${page}&limit=10`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                if (response.status === 401) {
                    navigate('/login');
                }
                throw new Error("Failed to fetch categories.");
            }

            const data = await response.json();
            if (data.status) {
                setCategories(data.data);
                setTotalPages(data.totalPages || 1);
                setCurrentPage(data.currentPage || page);
            } else {
                setError(data.message || "No categories found.");
                setCategories([]);
            }
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message);
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories(currentPage);
    }, [currentPage]);



    const handleEditClick = (category) => {
        setEditModalData({
            show: true,
            id: category.id,
            name: category.name,
        });
    };

    const handleDeleteClick = (category) => {
        setDeleteModalData({
            show: true,
            id: category.id,
            name: category.name,
        });
    };

    const handleEditModalClose = () => {
        setEditModalData({ show: false, id: null, name: "" });
    };

    const handleDeleteModalClose = () => {
        setDeleteModalData({ show: false, id: null, name: "" });
    };

    const handleEditFormChange = (e) => {
        setEditModalData({ ...editModalData, name: e.target.value });
    };

    const handleUpdateCategory = async (e) => {
        e.preventDefault();
        if (!editModalData.name.trim()) {
            showToastMessage("Category name cannot be empty.", "danger");
            return;
        }

        setActionLoading(true);
        const token = getAuthToken();

        try {
            const payload = {
                id: editModalData.id,
                name: editModalData.name
            };

            const response = await fetch(`${API_URL}/expence-category-update`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            console.log(result);

            if (result.success == "1") {
                showToastMessage("Category updated successfully!", "success");
                handleEditModalClose();
                fetchCategories();
            } else {
                throw new Error(result.message || "Failed to update category.");
            }
        } catch (err) {
            console.error("Update error:", err);
            showToastMessage(err.message, "danger");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteCategory = async () => {
        setActionLoading(true);
        const token = getAuthToken();

        try {
            const payload = {
                id: deleteModalData.id
            };

            const response = await fetch(`${API_URL}/expence-category-delete`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            if (response.ok && result.status) {
                showToastMessage("Category deleted successfully!", "success", "top");
                handleDeleteModalClose();
                fetchCategories();
            } else {
                throw new Error(result.message || "Failed to delete category.");
            }
        } catch (err) {
            console.error("Delete error:", err);
            showToastMessage(err.message, "danger", "top");
        } finally {
            setActionLoading(false);
        }
    };

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            fetchCategories(pageNumber);
        }
    };

    return (
        <Container fluid>
            <div className="card mt-2">
                <div className="card-header">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="titlepage">

                            <h3 className="mb-0">Expense Categories</h3>
                        </div>
                        <Link to="/add-category" className="btn btn-primary">
                            <FaPlus className="me-2" />
                            Add Category
                        </Link>
                        
                    </div>
                </div>
                <div className="card-body">

                    {loading ? (
                        <div className="text-center mt-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p>Loading categories...</p>
                        </div>
                    ) : error ? (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    ) : categories?.length == 0 ? (
                        <div className="alert alert-info" role="alert">
                            No expense categories found.
                        </div>
                    ) : (
                        <div>
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Category Type</th>
                                        <th>Created At</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories?.map((category, index) => (
                                        <tr key={category.id}>
                                            <td>{(currentPage - 1) * 10 + index + 1}</td>
                                            <td
                                                style={{
                                                    textAlign: "justify",
                                                    whiteSpace: "normal",
                                                    wordWrap: "break-word",
                                                    wordBreak: "break-word",
                                                }}
                                            >
                                                {category.name.charAt(0).toUpperCase() + category.name.slice(1).toLowerCase()}
                                            </td>

                                            <td>{category.type || "NA"}</td>
                                            <td>{new Date(category.created_at).toLocaleDateString('en-GB').replace(/\//g, '-')}</td>
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
                                                                onClick={() => handleEditClick(category)}
                                                                title="Edit Project"
                                                            >
                                                                <FaEdit /> Edit
                                                            </button>
                                                        </li>

                                                        <li className="dropdown-item">
                                                            <button
                                                                className="btn delete_btn btn-sm"
                                                                onClick={() => handleDeleteClick(category)}
                                                                title="Delete Project"
                                                            >
                                                                <RiDeleteBin3Fill /> Delete
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </div>


                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>

                            <div className="d-flex justify-content-end">
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

                        </div>

                    )}

                </div>
            </div>
            <Modal show={editModalData.show} onHide={handleEditModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Category</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleUpdateCategory}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Category Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={editModalData.name}
                                onChange={handleEditFormChange}
                                required
                            />
                        </Form.Group>
                    </Modal.Body>

                    
                    <Modal.Footer>
                        <Button variant="danger" onClick={handleEditModalClose}>
                            Close
                        </Button>
                        <Button variant="primary" type="submit" disabled={actionLoading}>
                            {actionLoading ? "Updating..." : "Save Changes"}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>


            <Modal show={deleteModalData.show} onHide={handleDeleteModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete the category "<strong>{deleteModalData.name}</strong>"? This action cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleDeleteModalClose}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteCategory} disabled={actionLoading}>
                        {actionLoading ? "Deleting..." : "Delete"}
                    </Button>
                </Modal.Footer>
            </Modal>

            {showToast && (
                <div
                    className={`toast show bg-${toastVariant} text-white`}
                    style={{ position: "fixed", bottom: "20px", right: "20px" }}
                    role="alert"
                    aria-live="assertive"
                    aria-atomic="true"
                >
                    <div className="toast-header bg-transparent text-white border-0">
                        <strong className="me-auto">{toastVariant === 'success' ? 'Success' : 'Error'}</strong>
                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            onClick={() => setShowToast(false)}
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="toast-body">{toastMessage}</div>
                </div>
            )}

        </Container>
    );
}

export default CategoryList;