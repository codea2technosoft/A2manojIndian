import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Table, Pagination, Container, Row, Col, Modal } from "react-bootstrap";
import { FaPlus, FaEye, FaEdit } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { RiDeleteBin3Fill } from "react-icons/ri";
import { Dropdown } from 'react-bootstrap';
import { BsThreeDots } from "react-icons/bs";

const API_URL = process.env.REACT_APP_API_URL;
const imageAPIURL = process.env.REACT_APP_Image_URL;

function BlogList() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [imagePath, setImagePath] = useState("");

    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null);

    const [editFormData, setEditFormData] = useState({
        id: "",
        title: "",
        description: "",
        newImage: null,
        existingImage: null,
    });
    const editImageInputRef = useRef(null);

    const [showMessageModal, setShowMessageModal] = useState(false);
    const [messageModalContent, setMessageModalContent] = useState({
        title: "",
        text: "",
        type: "",
        confirmAction: null,
    });

    const showCustomMessageModal = (title, text, type, confirmAction = null) => {
        setMessageModalContent({ title, text, type, confirmAction });
        setShowMessageModal(true);
    };

    const closeCustomMessageModal = () => {
        setShowMessageModal(false);
        setMessageModalContent({ title: "", text: "", type: "", confirmAction: null });
    };

    const getAuthToken = () => {
        return localStorage.getItem("token");
    };

    // Helper function to strip HTML and truncate for table display
    const stripHtmlAndTruncate = (htmlString, maxLength = 150) => {
        if (!htmlString) return "";
        const doc = new DOMParser().parseFromString(htmlString, 'text/html');
        const textContent = doc.body.textContent || "";
        return textContent.length > maxLength
            ? textContent.substring(0, maxLength) + "..."
            : textContent;
    };

    const fetchBlogs = async (page = 1) => {
        setLoading(true);
        setError(null);
        try {
            const token = getAuthToken();
            if (!token) {
                showCustomMessageModal("Authentication Error", "Authentication token not found. Please log in.", "error");
                throw new Error("Authentication token not found. Please log in.");
            }

            const response = await fetch(`${API_URL}/blog-list?page=${page}&limit=10`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    showCustomMessageModal("Authorization Error", "Unauthorized: Please log in again.", "error");
                    throw new Error("Unauthorized: Please log in again.");
                }
                const errorData = await response.json();
                showCustomMessageModal("Error", errorData.message || "Failed to fetch blogs.", "error");
                throw new Error(errorData.message || "Failed to fetch blogs.");
            }

            const data = await response.json();
            if (data.status == '1') {
                setBlogs(data.data || []);
                setTotalPages(data.totalPages || 1);
                setImagePath(data.imagePath || "");
                setCurrentPage(page);
            }

        } catch (err) {
            console.error("Fetch blogs error:", err);
            setError(err.message); // Set error state
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs(currentPage);
    }, [currentPage]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleViewBlog = async (blogId) => {
        setLoading(true);
        try {
            const token = getAuthToken();
            if (!token) {
                showCustomMessageModal("Authentication Error", "Authentication token not found. Please log in.", "error");
                throw new Error("Authentication token not found. Please log in.");
            }

            const response = await fetch(`${API_URL}/blog-edit`, {
                method: "POST", // This endpoint name `blog-edit` suggests GET, but it's a POST. Ensure API consistency.
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ id: blogId }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                showCustomMessageModal("Error", errorData.message || "Failed to fetch blog details.", "error");
                throw new Error(errorData.message || "Failed to fetch blog details.");
            }

            const data = await response.json();
            setSelectedBlog(data.data);
            setShowViewModal(true);
        } catch (err) {
            console.error("View blog error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEditBlog = async (blogId) => {
        setLoading(true);
        try {
            const token = getAuthToken();
            if (!token) {
                showCustomMessageModal("Authentication Error", "Authentication token not found. Please log in.", "error");
                throw new Error("Authentication token not found. Please log in.");
            }

            const response = await fetch(`${API_URL}/blog-edit`, {
                method: "POST", // Same note as above regarding POST for `blog-edit`
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ id: blogId }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                showCustomMessageModal("Error", errorData.message || "Failed to fetch blog for editing.", "error");
                throw new Error(errorData.message || "Failed to fetch blog for editing.");
            }

            const data = await response.json();
            const blogData = data.data;

            setEditFormData({
                id: blogData.id || "",
                title: blogData.title || "",
                description: blogData.description || "", // This should be HTML content
                newImage: null,
                existingImage: blogData.image || "",
            });
            setShowEditModal(true);
        } catch (err) {
            console.error("Edit blog error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleEditImageChange = (e) => {
        const file = e.target.files[0];
        setEditFormData((prevData) => ({
            ...prevData,
            newImage: file,
        }));
    };

    const removeNewEditImage = () => {
        setEditFormData(prevData => ({ ...prevData, newImage: null }));
        if (editImageInputRef.current) {
            editImageInputRef.current.value = "";
        }
    };

    const handleUpdateBlog = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!editFormData.title.trim()) {
            showCustomMessageModal("Validation Error", "Blog title is required.", "error");
            setLoading(false);
            return;
        }

        // Validate description after CKEditor provides data.
        // CKEditor might return an empty string or '<p><br></p>' for empty content.
        const descriptionContent = editFormData.description.trim();
        if (!descriptionContent || descriptionContent === "<p><br></p>") {
            // showCustomMessageModal("Validation Error", "Blog description is required.", "error");
            setLoading(false);
            return;
        }

        try {
            const token = getAuthToken();
            if (!token) {
                showCustomMessageModal("Authentication Error", "Authentication token not found. Please log in.", "error");
                throw new Error("Authentication token not found. Please log in.");
            }

            const formData = new FormData();
            formData.append("id", editFormData.id);
            formData.append("title", editFormData.title);
            formData.append("description", editFormData.description); // Send the full HTML description

            if (editFormData.newImage) {
                formData.append("image", editFormData.newImage);
            } else if (!editFormData.existingImage) {
                // If there was no existing image and no new image is provided,
                // you might want to send a signal to the backend to remove the image
                // or ensure it handles missing image gracefully.
                // For now, doing nothing means the image field won't be sent if not existing and no new one.
            }


            const response = await fetch(`${API_URL}/blog-update`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    // Do NOT set Content-Type for FormData, browser sets it automatically with boundary
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                showCustomMessageModal("Error", errorData.message || "Failed to update blog.", "error");
                throw new Error(errorData.message || "Failed to update blog.");
            }


            const result = await response.json();

            if (result.success == '1') {
                showCustomMessageModal("Success", "Blog updated successfully!", "success");
                setShowEditModal(false);
                fetchBlogs(currentPage);
            }
            else {
                showCustomMessageModal("Error", result.message || "Something went wrong", "error");
            }

        } catch (err) {
            console.error("Update blog error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteBlog = async (blogId) => {
        showCustomMessageModal(
            "Confirm Deletion",
            "Are you sure you want to delete this blog post? This action cannot be undone.",
            "warning",
            async () => {
                setLoading(true);
                setError(null);
                try {
                    const token = getAuthToken();
                    if (!token) {
                        showCustomMessageModal("Authentication Error", "Authentication token not found. Please log in.", "error");
                        throw new Error("Authentication token not found. Please log in.");
                    }

                    const response = await fetch(`${API_URL}/blog-delete`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ id: blogId }),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        showCustomMessageModal("Error", errorData.message || "Failed to delete blog.", "error");
                        throw new Error(errorData.message || "Failed to delete blog.");
                    }

                    showCustomMessageModal("Success", "Blog deleted successfully!", "success");
                    fetchBlogs(currentPage); // Refresh the list
                } catch (err) {
                    console.error("Delete blog error:", err);
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            }
        );
    };

    const handleCloseViewModal = () => {
        setShowViewModal(false);
        setSelectedBlog(null);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setSelectedBlog(null);
        setEditFormData({
            id: "",
            title: "",
            description: "",
            newImage: null,
            existingImage: null,
        });
        if (editImageInputRef.current) {
            editImageInputRef.current.value = "";
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <Container className="mt-4 text-center">
                <div className="alert alert-danger" role="alert">
                    Error: {error}
                </div>
                <Button onClick={() => fetchBlogs(currentPage)}>Try Again</Button>
            </Container>
        );
    }

    return (
        <div className="padding_15">
            <div className="card">
                <div className="card-header">
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="titlepage">
                            <h3>Blog Post List</h3>
                        </div>
                        <div className="d-flex">
                            <Link to="/blogs" className="btn btn-success d-inline-flex align-items-center">
                                <FaPlus className="me-2" /> Create New Blog Post
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="card-body">

                    <div className="table-responsive">
                        <Table striped bordered hover className="shadow-sm">
                            <thead className="bg-primary text-white">
                                <tr>
                                    <th>ID</th>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Date</th>
                                    <th>Image</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {blogs.length > 0 ? (
                                    blogs.map((blog, i) => (
                                        <tr key={blog.id}>
                                            <td>{i + 1}</td>
                                            <td>{blog.title}</td>
                                            {/* Apply the stripping function here */}
                                            {/* <td>{stripHtmlAndTruncate(blog.description, 150)}</td> */}
                                            <td>
                                                 <div className="textareadesign">
                                                    {stripHtmlAndTruncate(blog.description, 150)}
                                                </div>
                                            </td>
                                            <td>{blog.date}</td>

                                            <td>
                                                {blog.image ? (
                                                    <img
                                                        src={`${imageAPIURL}/blog/${blog.image}`}
                                                        alt={blog.title}
                                                        style={{ width: "80px", height: "auto", borderRadius: "4px" }}
                                                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/80x50/cccccc/333333?text=No+Image"; }}
                                                    />
                                                ) : (
                                                    <span>No Image</span>
                                                )}
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
                                                                className="btn view_btn btn-sm me-1"
                                                                onClick={() => handleViewBlog(blog.id)}
                                                                title="View Project Details"
                                                            >
                                                                <FaEye /> View
                                                            </button>
                                                        </li>
                                                        <li className="dropdown-item">
                                                            <button
                                                                className="btn edit_btn btn-sm me-1"
                                                                onClick={() => handleEditBlog(blog.id)}
                                                                title="Edit Project"
                                                            >
                                                                <FaEdit /> Edit
                                                            </button>
                                                        </li>


                                                        <li className="dropdown-item">
                                                            <button
                                                                className="btn delete_btn btn-sm"
                                                                onClick={() => handleDeleteBlog(blog.id)}
                                                                title="Delete Project"
                                                            >
                                                                <RiDeleteBin3Fill /> Delete
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </div>
                                                {/* <Button
                                            variant="info"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => handleViewBlog(blog.id)}
                                        >
                                            <FaEye /> View
                                        </Button>
                                        <Button
                                            variant="warning"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => handleEditBlog(blog.id)}
                                        >
                                            <FaEdit /> Edit
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDeleteBlog(blog.id)}
                                        >
                                            <RiDeleteBin5Fill /> Delete
                                        </Button> */}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center"> {/* Updated colspan */}
                                            No blog posts found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>

                    <div className="d-flex justify-content-end">
                        <Pagination>
                            {/* <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} /> */}
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
                            {/* <Pagination.Last
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                    /> */}
                        </Pagination>
                    </div>
                </div>
            </div>



            {/* View Blog Modal */}
            <Modal show={showViewModal} onHide={handleCloseViewModal} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Blog Post Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedBlog && (
                        <>
                            <h5><strong>Title:</strong> {selectedBlog.title}</h5>
                            <hr />
                            <h6><strong>Description:</strong></h6>
                            {/* Render HTML content directly for viewing */}
                            <div dangerouslySetInnerHTML={{ __html: selectedBlog.description }} />
                            <hr />
                            <h6><strong>Image:</strong></h6>
                            {selectedBlog.image ? (
                                <img
                                    src={`${imageAPIURL}/blog/${selectedBlog.image}`}
                                    alt={selectedBlog.title}
                                    className="img-fluid rounded"
                                    style={{ maxWidth: "200px", height: "auto" }}
                                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/200x100/cccccc/333333?text=No+Image"; }}
                                />
                            ) : (
                                <p>No image available.</p>
                            )}
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleCloseViewModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Edit Blog Modal */}
            <Modal show={showEditModal} onHide={handleCloseEditModal} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Edit Blog Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleUpdateBlog}>
                        <Form.Group className="mb-3" controlId="editBlogTitle">
                            <Form.Label>Title <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={editFormData.title}
                                onChange={handleEditFormChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="editBlogDescription">
                            <Form.Label>Description <span className="text-danger">*</span></Form.Label>
                            {/* <CKEditor
                                editor={ClassicEditor}
                                data={editFormData.description}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    setEditFormData(prev => ({ ...prev, description: data }));
                                }}
                                config={{
                                    toolbar: [
                                        'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|',
                                        'undo', 'redo'
                                    ],

                                    licenseKey: 'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NTQ0MzgzOTksImp0aSI6Ijk4MGNlZTU4LTA0ZTUtNDVkMi1iZmI4LWZmZTNjNjMwNjA4MCIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6IjVmZjc5NDUxIn0.0ckOvFDI8r8h1g0YVW4Vlx4PmiF2bYkIaAqdSYuM_8RC8Wl3cO4jIfkMAd57z6Fo_6JPmlmDfLjafu4EnnByzQ',
                                }}
                            /> */}
                            <Form.Control
                                as="textarea"

                                name="description"
                                value={editFormData.description}
                                onChange={handleEditFormChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="editBlogImage">
                            <Form.Label>Blog Image</Form.Label>
                            {editFormData.existingImage && !editFormData.newImage && (
                                <div className="mb-2">
                                    <p className="mb-1">Current Image:</p>
                                    <img
                                        src={`${imageAPIURL}/blog/${editFormData.existingImage}`}
                                        alt="Current Blog Image"
                                        className="img-thumbnail"
                                        style={{ width: "150px", height: "100px", objectFit: "cover" }}
                                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/150x100/cccccc/333333?text=No+Image"; }}
                                    />
                                </div>
                            )}
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleEditImageChange}
                                ref={editImageInputRef}
                            />
                            {editFormData.newImage && (
                                <div className="mt-2 position-relative d-inline-block">
                                    <img
                                        src={URL.createObjectURL(editFormData.newImage)}
                                        alt="New Image Preview"
                                        className="img-thumbnail"
                                        style={{ width: "150px", height: "100px", objectFit: "cover" }}
                                    />
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        className="position-absolute top-0 end-0 translate-middle badge rounded-pill bg-danger"
                                        onClick={removeNewEditImage}
                                        style={{ cursor: "pointer" }}
                                    >
                                        X
                                    </Button>
                                </div>
                            )}
                            <Form.Text className="text-muted">
                                Upload a new image to replace the current one.
                            </Form.Text>
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100 mt-3" disabled={loading}>
                            {loading ? "Updating..." : "Update Blog Post"}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Custom Message Modal */}
            {showMessageModal && (
                <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className={`modal-content ${messageModalContent.type === 'success' ? 'border-success' : messageModalContent.type === 'error' ? '' : ''}`}>
                            <div className="modal-header d-flex justify-content-between align-items-center">
                                <h5 className={`modal-title ${messageModalContent.type === 'success' ? 'text-success' : messageModalContent.type === 'error' ? 'text-danger' : 'text-warning'}`}>
                                    {messageModalContent.title}
                                </h5>
                                <button type="button" className="btn-close" aria-label="Close" onClick={closeCustomMessageModal}></button>
                            </div>
                            <div className="modal-body text-secondary">
                                <p>{messageModalContent.text}</p>
                            </div>
                            <div className="modal-footer justify-content-center">
                                {messageModalContent.confirmAction ? (
                                    <>
                                        <Button
                                            variant="secondary"
                                            onClick={closeCustomMessageModal}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            variant={messageModalContent.type === 'warning' ? 'warning' : 'primary'}
                                            onClick={() => {
                                                messageModalContent.confirmAction();
                                                closeCustomMessageModal();
                                            }}
                                        >
                                            Confirm
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        variant={messageModalContent.type === 'success' ? 'success' : messageModalContent.type === 'error' ? 'danger' : 'primary'}
                                        onClick={closeCustomMessageModal}
                                    >
                                        OK
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BlogList;