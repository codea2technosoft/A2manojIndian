import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Modal, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
const API_URL = process.env.REACT_APP_API_URL;

function AddExpenses() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
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

    const [categories, setCategories] = useState([]);
    const [bankAccounts, setBankAccounts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);
    const [errors, setErrors] = useState({});
    const [parentName, setParentName] = useState("");
    const [checkingParentId, setCheckingParentId] = useState(false);


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
        setMessageModalContent({
            title: "",
            text: "",
            type: "",
            confirmAction: null,
        });
    };

    const getAuthToken = () => {
        return localStorage.getItem("token");
    };


    useEffect(() => {
        const fetchData = async () => {
            const token = getAuthToken();
            if (!token) {
                showCustomMessageModal("Auth Error", "Authentication token not found.", "error");
                setDataLoading(false);
                return;
            }

            try {
                const [categoriesResponse, bankAccountsResponse] = await Promise.all([
                    fetch(`${API_URL}/expence-category-list`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    fetch(`${API_URL}/expence-bank-account-list`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                ]);

                const categoriesData = await categoriesResponse.json();
                const bankAccountsData = await bankAccountsResponse.json();

                if (categoriesData.status) {
                    setCategories(categoriesData.data);
                } else {
                    showCustomMessageModal("Fetch Error", categoriesData.message || "Failed to fetch categories.", "error");
                }

                if (bankAccountsData.status) {
                    setBankAccounts(bankAccountsData.data);
                } else {
                    showCustomMessageModal("Fetch Error", bankAccountsData.message || "Failed to fetch bank accounts.", "error");
                }

            } catch (err) {
                console.error("Data fetching error:", err);
                showCustomMessageModal("Network Error", "An unexpected error occurred.", "error");
            } finally {
                setDataLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => {
            const newData = { ...prevData, [name]: value };


            if (name == "category_id") {
                const selectedCategory = categories.find(cat => cat.id.toString() === value);
                newData.category_name = selectedCategory ? selectedCategory.name : "";
            }
            if (name === "account_id") {
                const selectedAccount = bankAccounts.find(acc => acc.id.toString() === value);
                newData.payee = selectedAccount ? selectedAccount.payee : "";
                newData.type = selectedAccount ? selectedAccount.type : "";
                console.log("Setting account_name to:", selectedAccount?.payee);
            }

            return newData;
        });


        if (errors[name]) {
            setErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
        }
    };



    const validateForm = () => {
        let newErrors = {};
        let isValid = true;

        const requiredFields = ["category_id", "account_id", "type", "name", "amount", "date"];

        requiredFields.forEach(field => {
            if (!formData[field] || !formData[field].toString().trim()) {
                newErrors[field] = `${field.replace(/_/g, " ").replace(/\b\w/g, char => char.toUpperCase())} is required.`;
                isValid = false;
            }
        });

        if (formData.amount && (isNaN(formData.amount) || formData.amount <= 0)) {
            newErrors.amount = "Amount must be a positive number.";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            // showCustomMessageModal("Validation Error", "Please correct the errors in the form.", "error");
            return;
        }

        setLoading(true);

        try {
            const token = getAuthToken();
            if (!token) {
                showCustomMessageModal("Authentication Error", "Authentication token not found. Please log in.", "error");
                return;
            }

            const payload = {
                category_id: formData.category_id,
                category_name: formData.category_name,
                account_id: formData.account_id,
                payee: formData.payee,
                type: formData.type,
                name: formData.name,
                amount: parseFloat(formData.amount),
                date: formData.date,
                description: formData.description,
            };


            console.warn("Payload before sending:", payload);


            const response = await fetch(`${API_URL}/expence-add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to add expense.");
            }

            const result = await response.json();
            if (result.success == "1") {
                showCustomMessageModal("Success", result.message || "Expense added successfully!", "success");
                setFormData({
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

                setTimeout(() => {
                    navigate("/expenses-list");
                }, 2000);
            }
            else {
                setErrors({});
            }

        } catch (err) {
            console.error("Error adding expense:", err);
            showCustomMessageModal("Error", err.message || "An unexpected error occurred.", "error");
        } finally {
            setLoading(false);
        }
    };



    const handleChange = async (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: null,
            }));
        }

        if (name === "parent_id" && value.length === 10) {
            setCheckingParentId(true);
            setParentName("");
            try {
                const token = getAuthToken();
                if (!token) {
                    showCustomMessageModal("Authentication Error", "Authentication token not found. Please log in.", "error");
                    setCheckingParentId(false);
                    return;
                }

                const payload = {
                    parentid: value,
                    type: "associate"
                };

                const response = await fetch(`${API_URL}/check-parentid-name`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                });

                const data = await response.json();

                if (response.ok && data.status === "1" && data.data && data.data.username) {
                    setParentName(data.data.username);
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        parent_id: null,
                    }));
                } else {
                    setParentName("");

                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        parent_id: data.message || "Invalid Parent ID or Parent not found.",
                    }));
                }
            } catch (err) {
                console.error("Error checking parent ID:", err);
                setParentName("");
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    parent_id: "Failed to verify Parent ID. Please try again.",
                }));
            } finally {
                setCheckingParentId(false);
            }
        } else if (name === "parent_id" && value.length !== 10) {
            setParentName("");
            setErrors((prevErrors) => ({
                ...prevErrors,
                parent_id: "Parent ID must be 10 digits.",
            }));
        }
    };

    return (
        <Container className="mt-5">
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <div className="titlepage">
                                <h3>Add New Expense</h3>
                            </div>
                        </div>
                        <div className="card-body">
                            {dataLoading ? (
                                <div className="text-center p-5">
                                    <Spinner animation="border" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </Spinner>
                                    <p className="mt-2">Fetching categories and bank accounts...</p>
                                </div>
                            ) : (
                                <Form onSubmit={handleSubmit}>
                                    <Row>

                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label htmlFor="accountId">Select Payment From</Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    name="account_id"
                                                    id="accountId"
                                                    value={formData.account_id}
                                                    onChange={handleFormChange}
                                                    isInvalid={!!errors.account_id}
                                                >
                                                    <option value="">Payment From</option>
                                                    {bankAccounts?.map(acc => (
                                                        <option key={acc.id} value={acc.id}>{acc.bank_name} ({acc.payee})</option>
                                                    ))}
                                                </Form.Control>
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.account_id}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>


                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label htmlFor="type">Type</Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    name="type"
                                                    id="type"
                                                    value={formData.type}
                                                    onChange={handleFormChange}
                                                    isInvalid={!!errors.type}
                                                    disabled
                                                >
                                                    <option value="">Select Type</option>
                                                    <option value="online">Online</option>
                                                    <option value="cash">Cash</option>
                                                </Form.Control>
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.type}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>


                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label htmlFor="categoryId">Category</Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    name="category_id"
                                                    id="categoryId"
                                                    value={formData.category_id}
                                                    onChange={handleFormChange}
                                                    isInvalid={!!errors.category_id}
                                                >
                                                    <option value="">Select Category</option>
                                                    {categories?.map(cat => (
                                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                    ))}
                                                </Form.Control>
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.category_id}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>

                                        {/* <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label htmlFor="expenseName">Payment To</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="name"
                                                    id="expenseName"
                                                    value={formData.name}
                                                    onChange={handleFormChange}
                                                    placeholder="Enter Receiver Name"
                                                    isInvalid={!!errors.name}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.name}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col> */}

                                        <Col md={6}>
                                            <Form.Group className="mb-4" controlId="formParentId">
                                                <Form.Label>
                                                    Payment To <span className="text-danger">*</span>
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="parent_id"
                                                    id="expenseName"
                                                    placeholder="Enter Mobile Number"
                                                    value={formData.parent_id}
                                                    onChange={handleChange}
                                                    isInvalid={!!errors.parent_id}
                                                    className={errors.parent_id ? "is-invalid" : ""}
                                                    maxLength="10"
                                                />
                                                {checkingParentId && <Form.Text className="text-muted">Checking mobile number...</Form.Text>}
                                                {parentName && !errors.parent_id && (
                                                    <Form.Text className="text-success">Parent Name: {parentName}</Form.Text>
                                                )}
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.parent_id}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>

                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label htmlFor="amount">Amount</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    name="amount"
                                                    id="amount"
                                                    value={formData.amount}
                                                    onChange={handleFormChange}
                                                    placeholder="Enter amount"
                                                    isInvalid={!!errors.amount}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.amount}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>


                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label htmlFor="date">Payment Date</Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    name="date"
                                                    id="date"
                                                    value={formData.date}
                                                    onChange={handleFormChange}
                                                    isInvalid={!!errors.date}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.date}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col md={12}>
                                            <Form.Group className="mb-3">
                                                <Form.Label htmlFor="description">Description</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    name="description"
                                                    id="description"
                                                    rows={3}
                                                    value={formData.description}
                                                    onChange={handleFormChange}
                                                    placeholder="Enter a brief description of the expense"
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <div className="submitbutton">
                                        <Button
                                            type="submit"
                                            className="submitbutton_design"
                                            disabled={loading}
                                        >
                                            {loading ? "Adding..." : "Add Expense"}
                                        </Button>
                                    </div>
                                </Form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {showMessageModal && (
                <div
                    className="modal d-block"
                    tabIndex="-1"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div
                            className={`modal-content ${messageModalContent.type === "success"
                                ? "border-success"
                                : messageModalContent.type === "error"
                                    ? "border-danger"
                                    : "border-warning"
                                }`}
                        >
                            <div className="modal-header d-flex justify-content-between align-items-center">
                                <h5
                                    className={`modal-title ${messageModalContent.type === "success"
                                        ? "text-success"
                                        : messageModalContent.type === "error"
                                            ? "text-danger"
                                            : "text-warning"
                                        }`}
                                >
                                    {messageModalContent.title}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    aria-label="Close"
                                    onClick={closeCustomMessageModal}
                                ></button>
                            </div>
                            <div className="modal-body text-secondary">
                                <p>{messageModalContent.text}</p>
                            </div>
                            <div className="modal-footer justify-content-center">
                                <Button
                                    variant={
                                        messageModalContent.type === "success"
                                            ? "success"
                                            : messageModalContent.type === "error"
                                                ? "danger"
                                                : "primary"
                                    }
                                    onClick={closeCustomMessageModal}
                                >
                                    OK
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Container>
    );
}

export default AddExpenses;