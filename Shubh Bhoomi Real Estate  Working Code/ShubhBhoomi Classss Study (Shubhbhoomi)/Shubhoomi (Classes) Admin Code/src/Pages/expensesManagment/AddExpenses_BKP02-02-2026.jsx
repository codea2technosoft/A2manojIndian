import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Spinner } from "react-bootstrap";
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
        associate_mobile: "",
        name: "",
        amount: "",
        date: "",
        description: "",
        project_id: "",
        plot_id: "",
        category_type: "",
        payment_type: "",
    });

    const [categories, setCategories] = useState([]);
    const [bankAccounts, setBankAccounts] = useState([]);
    const [projects, setProjects] = useState([]);
    const [plots, setPlots] = useState([]);
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


    const [selectedPlotArea, setSelectedPlotArea] = useState(null);
    const [perUnitAmount, setPerUnitAmount] = useState("");


    const [receiverNames, setReceiverNames] = useState([
        "AREJR",
        "Accounts Team",
        "Arvind Kumar",
        "Deepak Saini",
        "Khemchandra",
        "Narendra Sharma",
        "RRE",
        "Other"
    ]);


    const isCommissionCategory = () => {
        const selectedCategory = categories.find(cat => cat.id.toString() === formData.category_id);
        return selectedCategory && (selectedCategory.name === "commission received" || selectedCategory.name === "commission paid");
    };


    const shouldShowMobileNumberField = () => {
        const selectedCategory = categories.find(cat => cat.id.toString() === formData.category_id);
        return formData.category_id === "1" ||
            (selectedCategory?.name === "commission paid" && formData.category_type === "dr") ||
            (selectedCategory?.name === "Rewards Paid" && formData.category_type === "dr") || (selectedCategory?.name === "Commission Difference" && formData.category_type === "dr") || (selectedCategory?.name === "Fuel Convince Paid" && formData.category_type === "dr") || (selectedCategory?.name === "Salary Paid" && formData.category_type === "dr");
    };


    const shouldShowReceiverNamesDropdown = () => {
        const selectedCategory = categories.find(cat => cat.id.toString() === formData.category_id);
        return formData.category_type === "cr" &&
            formData.category_id !== "1" &&
            selectedCategory?.name !== "commission paid" &&
            selectedCategory?.name !== "Rewards Paid";
    };


    const shouldShowProjectPlotSelection = () => {
        const selectedCategory = categories.find(cat => cat.id.toString() === formData.category_id);
        return selectedCategory &&
            (selectedCategory.name === "commission received" ||
                selectedCategory.name === "commission paid" ||
                selectedCategory.name === "rewards" ||
                selectedCategory.name === "Commission Difference");
    };


    useEffect(() => {
        const fetchProjectsAndPlots = async () => {
            if (shouldShowProjectPlotSelection()) {
                const token = getAuthToken();
                if (!token) return;

                try {
                    const projectsResponse = await fetch(`${API_URL}/project-list-block`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    });


                    const plotsResponse = await fetch(`${API_URL}/all-plot-list`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    const projectsData = await projectsResponse.json();
                    const plotsData = await plotsResponse.json();

                    if (projectsData.status) {
                        setProjects(projectsData.data || []);
                        console.log("Projects loaded:", projectsData.data);
                    }

                    if (plotsData.status) {
                        setPlots(plotsData.data || []);
                        console.log("Plots loaded:", plotsData.data);
                    }

                } catch (err) {
                    console.error("Error fetching projects/plots:", err);
                }
            } else {

                setProjects([]);
                setPlots([]);
                setFormData(prev => ({
                    ...prev,
                    project_id: "",
                    plot_id: ""
                }));
                setSelectedPlotArea(null);
                setPerUnitAmount("");
            }
        };

        fetchProjectsAndPlots();
    }, [formData.category_id]);


    const handlePlotSelection = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === "plot_id" && value) {
            const selectedPlot = plots.find(plot => plot.id.toString() === value);
            if (selectedPlot) {
                // Extract area_sqyd from plot data (adjust field name as per your API)
                const areaSqyd = selectedPlot.area_sqyd || selectedPlot.area || selectedPlot.sqyd || "0";
                setSelectedPlotArea(areaSqyd);
                console.log("Selected plot area:", areaSqyd);
            }
        } else if (name === "plot_id" && !value) {
            setSelectedPlotArea(null);
            setPerUnitAmount("");
            // Also clear the calculated amount
            setFormData(prev => ({ ...prev, amount: "" }));
        }

        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    // ✅ Handle per unit amount change
    const handlePerUnitAmountChange = (e) => {
        const value = e.target.value;
        setPerUnitAmount(value);

        // Calculate total amount when per unit amount changes
        if (selectedPlotArea && value && !isNaN(value) && parseFloat(value) > 0) {
            const area = parseFloat(selectedPlotArea);
            const perUnit = parseFloat(value);
            const totalAmount = (area * perUnit).toFixed(2);
            setFormData(prev => ({ ...prev, amount: totalAmount }));
        } else {
            // Clear amount if invalid input
            setFormData(prev => ({ ...prev, amount: "" }));
        }
    };

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

    const getAuthToken = () => localStorage.getItem("token");

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
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch(`${API_URL}/expence-bank-account-list`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                const categoriesData = await categoriesResponse.json();
                const bankAccountsData = await bankAccountsResponse.json();

                if (categoriesData.status) {
                    setCategories(categoriesData.data);
                    console.log("Categories loaded:", categoriesData.data);
                } else {
                    showCustomMessageModal("Fetch Error", categoriesData.message || "Failed to fetch categories.", "error");
                }

                if (bankAccountsData.status) setBankAccounts(bankAccountsData.data);
                else showCustomMessageModal("Fetch Error", bankAccountsData.message || "Failed to fetch bank accounts.", "error");
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

            if (name === "category_id") {
                const selectedCategory = categories.find((cat) => cat.id.toString() === value);
                newData.category_name = selectedCategory ? selectedCategory.name : "";
                // Store the 'type' field from category API
                newData.category_type = selectedCategory ? selectedCategory.type : "";

                // Clear project and plot selections if changing away from relevant categories
                if (!shouldShowProjectPlotSelection()) {
                    newData.project_id = "";
                    newData.plot_id = "";
                }

                // ✅ Reset receiver name when category changes (except for mobile number categories)
                if (selectedCategory?.type !== "cr" && !shouldShowMobileNumberField()) {
                    newData.name = "";
                }

                // ✅ Reset mobile number field for non-mobile categories
                if (!shouldShowMobileNumberField()) {
                    newData.associate_mobile = "";
                    setParentName("");
                }

                console.log("Selected Category:", selectedCategory);
                console.log("Category Type set to:", selectedCategory?.type);
                console.log("Should show mobile field?", shouldShowMobileNumberField());
            }

            if (name === "account_id") {
                const selectedAccount = bankAccounts.find((acc) => acc.id.toString() === value);
                newData.payee = selectedAccount ? selectedAccount.payee : "";
                // Payment type automatically set from bank account
                newData.payment_type = selectedAccount ? selectedAccount.type : "";
            }

            return newData;
        });

        if (errors[name]) setErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
    };

    // ✅ Handle receiver name selection
    const handleReceiverNameChange = (e) => {
        const { value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            name: value
        }));

        if (errors.name) setErrors((prevErrors) => ({ ...prevErrors, name: null }));
    };

    const handleChange = async (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));

        if (errors[name]) setErrors((prevErrors) => ({ ...prevErrors, [name]: null }));

        // ✅ UPDATED: Check mobile number for all mobile-required categories
        if ((name === "associate_mobile" && value.length === 10) && shouldShowMobileNumberField()) {
            setCheckingParentId(true);
            setParentName("");
            try {
                const token = getAuthToken();
                if (!token) {
                    showCustomMessageModal("Authentication Error", "Authentication token not found. Please log in.", "error");
                    setCheckingParentId(false);
                    return;
                }

                const payload = { parentid: value, type: "associate" };

                const response = await fetch(`${API_URL}/check-parentid-name`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                });

                const data = await response.json();

                if (response.ok && data.status === "1" && data.data?.username) {
                    setParentName(data.data.username);
                    setErrors((prevErrors) => ({ ...prevErrors, associate_mobile: null }));
                } else {
                    setParentName("");
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        associate_mobile: data.message || "Invalid mobile OR not found.",
                    }));
                }
            } catch (err) {
                console.error("Error checking mobile:", err);
                setParentName("");
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    associate_mobile: "Failed to verify Mobile. Please try again.",
                }));
            } finally {
                setCheckingParentId(false);
            }
        } else if (name === "associate_mobile" && value.length !== 10 && shouldShowMobileNumberField()) {
            setParentName("");
            setErrors((prevErrors) => ({
                ...prevErrors,
                associate_mobile: "mobile must be 10 digits.",
            }));
        }
    };

    // ✅ UPDATED VALIDATION - Handle mobile validation for all mobile-required categories
    const validateForm = () => {
        let newErrors = {};
        let isValid = true;

        const requiredFields = ["category_id", "account_id", "amount", "date"];
        requiredFields.forEach((field) => {
            if (!formData[field] || !formData[field].toString().trim()) {
                newErrors[field] = `${field.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} is required.`;
                isValid = false;
            }
        });

        // Validate payment_type
        if (!formData.payment_type || !formData.payment_type.trim()) {
            newErrors.payment_type = "Payment Mode is required. Please select a payment account.";
            isValid = false;
        }

        // For categories that require project and plot, validate them
        if (shouldShowProjectPlotSelection()) {
            if (!formData.project_id) {
                newErrors.project_id = "Project selection is required for this category.";
                isValid = false;
            }
            if (!formData.plot_id) {
                newErrors.plot_id = "Plot selection is required for this category.";
                isValid = false;
            }
        }

        // ✅ UPDATED: Validate mobile number for all mobile-required categories
        if (shouldShowMobileNumberField()) {
            if (!formData.associate_mobile || formData.associate_mobile.length !== 10) {
                newErrors.associate_mobile = "Valid 10-digit Mobile Number is required.";
                isValid = false;
            }
        } else {
            // For non-mobile categories, validate receiver name
            if (!formData.name || !formData.name.trim()) {
                newErrors.name = "Receiver Name is required.";
                isValid = false;
            }
        }

        if (formData.amount && (isNaN(formData.amount) || formData.amount <= 0)) {
            newErrors.amount = "Amount must be a positive number.";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    // ✅ UPDATED SUBMIT LOGIC - Include parent_name for all cases
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        // ✅ UPDATED: Check mobile verification for all mobile-required categories
        if (shouldShowMobileNumberField() && !parentName) {
            showCustomMessageModal("Validation Error", "Please verify a valid mobile number before submitting.", "error");
            return;
        }

        setLoading(true);
        try {
            const token = getAuthToken();
            if (!token) {
                showCustomMessageModal("Authentication Error", "Authentication token not found. Please log in.", "error");
                return;
            }

            
            let parent_name_value = "";

            if (shouldShowMobileNumberField()) {
               
                parent_name_value = parentName;
            } else if (formData.category_type === "cr") {
                parent_name_value = formData.name;
            } else {
               
                parent_name_value = formData.name || "";
            }
            const payload = {
                category_id: formData.category_id,
                category_name: formData.category_name,
                account_id: formData.account_id,
                payee: formData.payee,
                type: formData.category_type,
                amount: parseFloat(formData.amount),
                date: formData.date,
                description: formData.description,
                payment_type: formData.payment_type,
                name: parent_name_value,
                ...(shouldShowMobileNumberField()
                    ? { associate_mobile: formData.associate_mobile }
                    : { associate_mobile: "" }),
                ...(shouldShowProjectPlotSelection() ? {
                    project_id: formData.project_id,
                    plot_id: formData.plot_id,
                    plot_area_sqyd: selectedPlotArea,
                    per_unit_amount: perUnitAmount
                } : {})
            };

            

            const response = await fetch(`${API_URL}/expence-add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (response.ok && (result.success === "1" || result.status === "1")) {
                showCustomMessageModal("Success", result.message || "Expense added successfully!", "success");
                setFormData({
                    category_id: "",
                    category_name: "",
                    account_id: "",
                    payee: "",
                    type: "",
                    associate_mobile: "",
                    name: "",
                    amount: "",
                    date: "",
                    description: "",
                    project_id: "",
                    plot_id: "",
                    category_type: "",
                    payment_type: "",
                });
                setSelectedPlotArea(null);
                setPerUnitAmount("");
                setParentName("");
                setTimeout(() => navigate("/expenses-list"), 2000);
            } else {
                showCustomMessageModal("Error", result.message || "Failed to add expense.", "error");
            }
        } catch (err) {
            console.error("Error adding expense:", err);
            showCustomMessageModal("Error", err.message || "An unexpected error occurred.", "error");
        } finally {
            setLoading(false);
        }
    };

    const getFilteredPlots = () => {
        if (!formData.project_id) return plots;

        return plots.filter(plot => {
            if (plot.project_id && plot.project_id.toString() === formData.project_id) {
                return true;
            }
            if (plot.project_id && plot.project_id.toString() === formData.project_id.toString()) {
                return true;
            }
            return false;
        });
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
                                                <Form.Label>Select Payment From <span className="text-danger">*</span></Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    name="account_id"
                                                    value={formData.account_id}
                                                    onChange={handleFormChange}
                                                    isInvalid={!!errors.account_id}
                                                >
                                                    <option value="">Payment From </option>
                                                    {bankAccounts?.map((acc) => (
                                                        <option key={acc.id} value={acc.id}>
                                                            {acc.bank_name} ({acc.payee})
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                                <Form.Control.Feedback type="invalid">{errors.account_id}</Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>

                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Payment Mode <span className="text-danger">*</span></Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="payment_type"
                                                    value={formData.payment_type || ""}
                                                    onChange={handleFormChange}
                                                    placeholder="Payment Mode"
                                                    readOnly
                                                    className="bg-light"
                                                    isInvalid={!!errors.payment_type}
                                                />
                                                <Form.Control.Feedback type="invalid">{errors.payment_type}</Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>

                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Category <span className="text-danger">*</span></Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    name="category_id"
                                                    value={formData.category_id}
                                                    onChange={handleFormChange}
                                                    isInvalid={!!errors.category_id}
                                                >
                                                    <option value="">Select Category</option>
                                                    {categories?.map((cat) => (
                                                        <option key={cat.id} value={cat.id}>
                                                            {cat.name}
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                                <Form.Control.Feedback type="invalid">{errors.category_id}</Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>

                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Category Type</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="category_type"
                                                    value={formData.category_type || ""}
                                                    onChange={handleFormChange}
                                                    placeholder="Category Type"
                                                    disabled
                                                    className="bg-light"
                                                />
                                            </Form.Group>
                                        </Col>

                                        {shouldShowProjectPlotSelection() && (
                                            <>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Select Project <span className="text-danger">*</span></Form.Label>
                                                        <Form.Control
                                                            as="select"
                                                            name="project_id"
                                                            value={formData.project_id}
                                                            onChange={handleFormChange}
                                                            isInvalid={!!errors.project_id}
                                                        >
                                                            <option value="">Select Project</option>
                                                            {projects?.map((project) => (
                                                                <option key={project.id} value={project.id}>
                                                                    {project.project_name || project.name}
                                                                </option>
                                                            ))}
                                                        </Form.Control>
                                                        <Form.Control.Feedback type="invalid">{errors.project_id}</Form.Control.Feedback>
                                                    </Form.Group>
                                                </Col>

                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Select Unit Number <span className="text-danger">*</span></Form.Label>
                                                        <Form.Control
                                                            as="select"
                                                            name="plot_id"
                                                            value={formData.plot_id}
                                                            onChange={handlePlotSelection}
                                                            disabled={!formData.project_id}
                                                            isInvalid={!!errors.plot_id}
                                                        >
                                                            <option value="">Select Unit Number</option>
                                                            {getFilteredPlots().map((plot) => (
                                                                <option key={plot.id} value={plot.id}>
                                                                    {plot.plot_shop_villa_no || plot.plot_number || plot.name}
                                                                </option>
                                                            ))}
                                                        </Form.Control>
                                                        <Form.Control.Feedback type="invalid">{errors.plot_id}</Form.Control.Feedback>
                                                        {formData.project_id && getFilteredPlots().length === 0 && (
                                                            <Form.Text className="text-warning">
                                                                No plots available for the selected project
                                                            </Form.Text>
                                                        )}
                                                    </Form.Group>
                                                </Col>

                                                {/* ✅ NEW: Show Plot Area and Per Unit Amount fields */}
                                                {formData.plot_id && selectedPlotArea && (
                                                    <>
                                                        <Col md={6}>
                                                            <Form.Group className="mb-3">
                                                                <Form.Label>Plot Area (SQYD)</Form.Label>
                                                                <Form.Control
                                                                    type="text"
                                                                    value={selectedPlotArea}
                                                                    readOnly
                                                                    className="bg-light"
                                                                    placeholder="Area will be displayed here"
                                                                />
                                                                <Form.Text className="text-muted">
                                                                    Area in square yards for selected plot
                                                                </Form.Text>
                                                            </Form.Group>
                                                        </Col>

                                                        <Col md={6}>
                                                            <Form.Group className="mb-3">
                                                                <Form.Label>Enter Per Unit Amount (₹)</Form.Label>
                                                                <Form.Control
                                                                    type="number"
                                                                    value={perUnitAmount}
                                                                    onChange={handlePerUnitAmountChange}
                                                                    placeholder="Enter per unit amount"
                                                                    step="0.01"
                                                                    min="0"
                                                                />
                                                                <Form.Text className="text-muted">
                                                                    Enter amount per square yard
                                                                </Form.Text>
                                                            </Form.Group>
                                                        </Col>

                                                        <Col md={6}>
                                                            <Form.Group className="mb-3">
                                                                <Form.Label>Total Amount <span className="text-danger">*</span></Form.Label>
                                                                <Form.Control
                                                                    type="number"
                                                                    name="amount"
                                                                    value={formData.amount}
                                                                    onChange={handleFormChange}
                                                                    placeholder="Total amount will be calculated automatically"
                                                                    readOnly
                                                                    className="bg-light"
                                                                    isInvalid={!!errors.amount}
                                                                />
                                                                <Form.Control.Feedback type="invalid">{errors.amount}</Form.Control.Feedback>
                                                                {formData.amount && selectedPlotArea && perUnitAmount && (
                                                                    <Form.Text className="text-success">
                                                                        Calculated: {selectedPlotArea} SQYD × ₹{perUnitAmount} = ₹{formData.amount}
                                                                    </Form.Text>
                                                                )}
                                                            </Form.Group>
                                                        </Col>
                                                    </>
                                                )}
                                            </>
                                        )}

                                       
                                        {shouldShowMobileNumberField() ? (
                                            <Col md={6}>
                                                <Form.Group className="mb-4">
                                                    <Form.Label>Payment To (Mobile Number) <span className="text-danger">*</span></Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="associate_mobile"
                                                        placeholder="Enter Mobile Number"
                                                        value={formData.associate_mobile}
                                                        onChange={handleChange}
                                                        isInvalid={!!errors.associate_mobile}
                                                        maxLength="10"
                                                    />
                                                    {checkingParentId && (
                                                        <Form.Text className="text-muted">Checking mobile number...</Form.Text>
                                                    )}
                                                    {parentName && !errors.associate_mobile && (
                                                        <Form.Text className="text-success">
                                                            {formData.category_id === "1" ? "Associate" : "Receiver"} Name : {parentName}
                                                        </Form.Text>
                                                    )}
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.associate_mobile}
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                            </Col>
                                        ) : (
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Payment To (Receiver Name) <span className="text-danger">*</span></Form.Label>

                                                    {/* ✅ Conditionally render dropdown for cr category type */}
                                                    {shouldShowReceiverNamesDropdown() ? (
                                                        <Form.Control
                                                            as="select"
                                                            name="name"
                                                            value={formData.name}
                                                            onChange={handleReceiverNameChange}
                                                            isInvalid={!!errors.name}
                                                        >
                                                            <option value="">Select Receiver Name</option>
                                                            {receiverNames.map((receiver, index) => (
                                                                <option key={index} value={receiver}>
                                                                    {receiver}
                                                                </option>
                                                            ))}
                                                        </Form.Control>
                                                    ) : (
                                                        <Form.Control
                                                            type="text"
                                                            name="name"
                                                            value={formData.name}
                                                            onChange={handleFormChange}
                                                            placeholder="Enter Receiver Name"
                                                            isInvalid={!!errors.name}
                                                        />
                                                    )}

                                                    <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>

                                                    {/* ✅ Show info message for cr category type */}
                                                    {shouldShowReceiverNamesDropdown() && (
                                                        <Form.Text className="text-muted">
                                                            Select from predefined receiver names for CR category
                                                        </Form.Text>
                                                    )}
                                                </Form.Group>
                                            </Col>
                                        )}

                                        
                                        {!shouldShowProjectPlotSelection() && (
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Amount <span className="text-danger">*</span></Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        name="amount"
                                                        value={formData.amount}
                                                        onChange={handleFormChange}
                                                        placeholder="Enter amount"
                                                        isInvalid={!!errors.amount}
                                                    />
                                                    <Form.Control.Feedback type="invalid">{errors.amount}</Form.Control.Feedback>
                                                </Form.Group>
                                            </Col>
                                        )}

                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Payment Date <span className="text-danger">*</span></Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    name="date"
                                                    value={formData.date}
                                                    onChange={handleFormChange}
                                                    isInvalid={!!errors.date}
                                                />
                                                <Form.Control.Feedback type="invalid">{errors.date}</Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>

                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Description <span className="text-danger">*</span></Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    name="description"
                                                    rows={1}
                                                    value={formData.description}
                                                    onChange={handleFormChange}
                                                    placeholder="Enter description"
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <div className="submitbutton">
                                        <Button type="submit" className="submitbutton_design" disabled={loading}>
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
                <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
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