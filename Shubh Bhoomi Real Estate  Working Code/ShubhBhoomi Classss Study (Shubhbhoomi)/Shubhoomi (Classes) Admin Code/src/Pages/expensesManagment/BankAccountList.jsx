import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { Modal, Button, Form, Table, Pagination, Row, Col, Container, Carousel } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin3Fill } from "react-icons/ri";
import { HiOutlineChevronLeft, HiChevronRight } from "react-icons/hi2";
import { BsThreeDots, BsEye } from "react-icons/bs";
import { FaDownload } from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL;
const IMG_URL = process.env.REACT_APP_Image_URL;

function BankAccountList() {
    const navigate = useNavigate();
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [editModalData, setEditModalData] = useState({
        show: false,
        id: null,
        payee: "",
        bank_account_name: "",
        account_number: "",
        ifsc_code: "",
        type: "",
        images: [],
        existing_images: []
    });
    const [deleteModalData, setDeleteModalData] = useState({
        show: false,
        id: null,
        name: "",
    });
    const [imagesModalData, setImagesModalData] = useState({
        show: false,
        images: [],
        title: ""
    });
    const [newImages, setNewImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
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
        setTimeout(() => setShowToast(false), 3000);
    };

    const fetchBankAccounts = async (page = 1) => {
        setLoading(true);
        const token = getAuthToken();
        if (!token) {
            setError("Authentication token not found. Please log in.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/expence-bank-account-list?page=${page}&limit=10`,
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
                throw new Error("Failed to fetch bank accounts.");
            }

            const data = await response.json();
            if (data.status) {
                // Add images array to each account if image field exists
                const accountsWithImages = data.data.map(account => ({
                    ...account,
                    images: account.image ? account.image.split(',') : []
                }));
                setAccounts(accountsWithImages);
                setTotalPages(data.totalPages || 1);
                setCurrentPage(data.currentPage || page);
            } else {
                setError(data.message || "No bank accounts found.");
                setAccounts([]);
            }
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message);
            setAccounts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBankAccounts(currentPage);
    }, [currentPage]);

    const handleEditClick = async (id) => {
        setActionLoading(true);
        const token = getAuthToken();
        if (!token) {
            showToastMessage("Authentication token not found.", "danger");
            setActionLoading(false);
            return;
        }
        try {
            const response = await fetch(`${API_URL}/expence-bank-account-edit`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ id: id }),
            });
            const result = await response.json();
            if (response.ok && result.status) {
                setEditModalData({
                    show: true,
                    id: result.data.id,
                    payee: result.data.payee || "",
                    bank_account_name: result.data.bank_account_name || "",
                    account_number: result.data.account_number || "",
                    ifsc_code: result.data.ifsc_code || "",
                    type: result.data.type || "",
                    images: result.data.images || [],
                    existing_images: result.data.images || []
                });
                setNewImages([]);
                setImagePreviews([]);
            } else {
                throw new Error(result.message || "Failed to fetch account details.");
            }
        } catch (err) {
            console.error("Edit fetch error:", err);
            showToastMessage(err.message, "danger");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteClick = (account) => {
        setDeleteModalData({
            show: true,
            id: account.id,
            name: account.payee,
        });
    };

    const handleViewImagesClick = (account) => {
        setImagesModalData({
            show: true,
            images: account.images,
            title: `Images for ${account.payee}`
        });
    };

    const handleEditModalClose = () => {
        setEditModalData({
            show: false,
            id: null,
            payee: "",
            bank_account_name: "",
            account_number: "",
            ifsc_code: "",
            type: "",
            images: [],
            existing_images: []
        });
        setNewImages([]);
        setImagePreviews([]);
    };

    const handleDeleteModalClose = () => {
        setDeleteModalData({ show: false, id: null, name: "" });
    };

    const handleImagesModalClose = () => {
        setImagesModalData({ show: false, images: [], title: "" });
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditModalData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        // Validate file types and sizes
        const validFiles = files.filter(file => {
            if (!file.type.startsWith('image/')) {
                showToastMessage("Only image files are allowed.", "danger");
                return false;
            }

            if (file.size > 5 * 1024 * 1024) {
                showToastMessage("Image size should be less than 5MB.", "danger");
                return false;
            }

            return true;
        });

        setNewImages(prevImages => [...prevImages, ...validFiles]);

        // Create previews
        const newPreviews = validFiles.map(file => URL.createObjectURL(file));
        setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
    };

    const removeImage = (index, isExisting = false) => {
        if (isExisting) {
            setEditModalData(prev => ({
                ...prev,
                existing_images: prev.existing_images.filter((_, i) => i !== index)
            }));
        } else {
            const newIndex = index - editModalData.existing_images.length;
            setNewImages(prevImages => prevImages.filter((_, i) => i !== newIndex));
            setImagePreviews(prevPreviews => {
                URL.revokeObjectURL(prevPreviews[index]);
                return prevPreviews.filter((_, i) => i !== index);
            });
        }
    };

    const handleUpdateBankAccount = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        const token = getAuthToken();

        try {
            // Create FormData object to send both form data and files
            const formDataToSend = new FormData();
            formDataToSend.append("id", editModalData.id);
            formDataToSend.append("payee", editModalData.payee);
            formDataToSend.append("type", editModalData.type);
            formDataToSend.append("existing_images", JSON.stringify(editModalData.existing_images));

            // Conditionally add online-only fields to the payload
            if (editModalData.type === "online") {
                formDataToSend.append("bank_account_name", editModalData.bank_account_name);
                formDataToSend.append("account_number", editModalData.account_number);
                formDataToSend.append("ifsc_code", editModalData.ifsc_code);
            }

            // Append each new image file
            newImages.forEach((image, index) => {
                formDataToSend.append(`images`, image);
            });

            const response = await fetch(`${API_URL}/expence-bank-account-update`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formDataToSend,
            });

            const result = await response.json();
            if (result.success == "1") {
                showToastMessage("Bank account updated successfully!", "success");
                handleEditModalClose();
                fetchBankAccounts();
            } else {
                throw new Error(result.message || "Failed to update bank account.");
            }
        } catch (err) {
            console.error("Update error:", err);
            showToastMessage(err.message, "danger");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteBankAccount = async () => {
        setActionLoading(true);
        const token = getAuthToken();

        try {
            const response = await fetch(`${API_URL}/expence-bank-account-delete`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ id: deleteModalData.id }),
            });

            const result = await response.json();
            if (response.ok && result.status) {
                showToastMessage("Bank account deleted successfully!", "success");
                handleDeleteModalClose();
                fetchBankAccounts();
            } else {
                throw new Error(result.message || "Failed to delete bank account.");
            }
        } catch (err) {
            console.error("Delete error:", err);
            showToastMessage(err.message, "danger");
        } finally {
            setActionLoading(false);
        }
    };

    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            fetchBankAccounts(pageNumber);
        }
    };

    return (
        <>
            <div className="card mt-2">
                <div className="card-header">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="titlepage">
                            <h3 className="mb-0">Bank Accounts</h3>
                        </div>
                        <Link to="/add-bankaccount" className="btn btn-primary">
                            <FaPlus className="me-2" />
                            Add Bank Account
                        </Link>
                    </div>
                </div>
                <div className="card-body">
                    {loading ? (
                        <div className="text-center mt-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p>Loading bank accounts...</p>
                        </div>
                    ) : error ? (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    ) : accounts?.length === 0 ? (
                        <div className="alert alert-info" role="alert">
                            No bank accounts found.
                        </div>
                    ) : (
                        <>
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Branch Name</th>
                                        <th>Bank</th>
                                        <th>Account Number</th>
                                        <th>IFSC Number</th>
                                        <th>Type</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {accounts?.map((account, index) => (
                                        <tr key={account.id}>
                                            <td>{(currentPage - 1) * 10 + index + 1}</td>
                                            <td>
                                                {account.payee
                                                    ? account.payee.charAt(0).toUpperCase() + account.payee.slice(1).toLowerCase()
                                                    : ''}
                                            </td>

                                            <td>{account.bank_branch_name ||"NA" } </td>

                                            <td>
                                                {account.bank_account_name
                                                    ? account.bank_account_name.charAt(0).toUpperCase() + account.bank_account_name.slice(1).toLowerCase()
                                                    : '-'}
                                            </td>

                                            <td>{account.account_number || "-"}</td>
                                            <td>{account.ifsc_code || "-"}</td>
                                            <td style={{ color: "green" }}>
                                                {account.type.charAt(0).toUpperCase() + account.type.slice(1).toLowerCase()}
                                            </td>


                                            <td>{new Date(account.created_at).toLocaleDateString('en-GB').replace(/\//g, '-')}</td>
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
                                                                onClick={() => handleEditClick(account.id)}
                                                                title="Edit Account"
                                                            >
                                                                <FaEdit /> Edit
                                                            </button>
                                                        </li>
                                                        <li className="dropdown-item">
                                                            <button
                                                                className="btn delete_btn btn-sm"
                                                                onClick={() => handleDeleteClick(account)}
                                                                title="Delete Account"
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

            {/* Edit Bank Account Modal */}
            <Modal show={editModalData.show} onHide={handleEditModalClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Edit Bank Account</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleUpdateBankAccount}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Payee</Form.Label>
                            <Form.Control
                                type="text"
                                name="payee"
                                value={editModalData.payee || ''}
                                onChange={handleEditFormChange}
                                required
                            />
                        </Form.Group>

                        {/* Conditionally render fields for 'online' type */}
                        {editModalData.type === 'online' && (
                            <>
                                <Form.Group className="mb-3">
                                    <Form.Label>Bank Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="bank_account_name"
                                        value={editModalData.bank_account_name || ''}
                                        onChange={handleEditFormChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Account Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="account_number"
                                        value={editModalData.account_number || ''}
                                        onChange={handleEditFormChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>IFSC Code</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="ifsc_code"
                                        value={editModalData.ifsc_code || ''}
                                        onChange={handleEditFormChange}
                                        required
                                    />
                                </Form.Group>
                            </>
                        )}

                        {/* Account Type dropdown */}
                        <Form.Group className="mb-3">
                            <Form.Label>Account Type</Form.Label>
                            <Form.Control
                                as="select"
                                name="type"
                                value={editModalData.type || ''}
                                onChange={handleEditFormChange}
                                required
                            >
                                <option value="">Select Type</option>
                                <option value="online">Online</option>
                                <option value="cash">Cash</option>
                            </Form.Control>
                        </Form.Group>

                        {/* Image Upload Section */}
                        <Form.Group className="mb-3">
                            <Form.Label>Bank Passbook/Cheque Images</Form.Label>
                            <Form.Control
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            <Form.Text className="text-muted">
                                You can select multiple images. Maximum file size: 5MB each.
                            </Form.Text>
                        </Form.Group>

                        {/* Image Previews */}
                        {(editModalData.existing_images.length > 0 || imagePreviews.length > 0) && (
                            <div className="mt-3">
                                <h6>Images:</h6>
                                <div className="d-flex flex-wrap gap-2">
                                    {editModalData.existing_images.map((image, index) => (
                                        <div key={`existing-${index}`} className="position-relative" style={{ width: '100px', height: '100px' }}>
                                            <img
                                                src={`${IMG_URL}/loanlead/${image}`}
                                                alt={`Existing ${index + 1}`}
                                                className="img-thumbnail"
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                            <button
                                                type="button"
                                                className="btn-close position-absolute top-0 end-0 bg-white"
                                                style={{ padding: '0.25rem' }}
                                                onClick={() => removeImage(index, true)}
                                                aria-label="Remove image"
                                            />
                                        </div>
                                    ))}
                                    {imagePreviews.map((preview, index) => (
                                        <div key={`new-${index}`} className="position-relative" style={{ width: '100px', height: '100px' }}>
                                            <img
                                                src={preview}
                                                alt={`New ${index + 1}`}
                                                className="img-thumbnail"
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                            <button
                                                type="button"
                                                className="btn-close position-absolute top-0 end-0 bg-white"
                                                style={{ padding: '0.25rem' }}
                                                onClick={() => removeImage(editModalData.existing_images.length + index, false)}
                                                aria-label="Remove image"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
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

            {/* Delete Confirmation Modal */}
            <Modal show={deleteModalData.show} onHide={handleDeleteModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete the bank account for "<strong>{deleteModalData.name}</strong>"? This action cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleDeleteModalClose}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteBankAccount} disabled={actionLoading}>
                        {actionLoading ? "Deleting..." : "Delete"}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Images View Modal */}
            <Modal show={imagesModalData.show} onHide={handleImagesModalClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{imagesModalData.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {imagesModalData.images.length > 0 ? (
                        <Carousel>
                            {imagesModalData.images.map((image, index) => (
                                <Carousel.Item key={index}>
                                    <div className="d-flex justify-content-center">
                                        <img
                                            className="d-block"
                                            src={`${IMG_URL}/loanlead/${image}`}
                                            alt={`Bank document ${index + 1}`}
                                            style={{ maxHeight: '400px', maxWidth: '100%' }}
                                        />
                                    </div>
                                </Carousel.Item>
                            ))}
                        </Carousel>
                    ) : (
                        <p className="text-center">No images available</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleImagesModalClose}>
                        Close
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
        </>
    );
}

export default BankAccountList;