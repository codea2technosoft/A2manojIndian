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

  // Check if selected category is commission-related (for mandatory project/plot)
  const isCommissionCategory = () => {
    const selectedCategory = categories.find(
      (cat) => cat.id.toString() === formData.category_id,
    );
    return (
      selectedCategory &&
      (selectedCategory.name.toLowerCase() === "commission received" ||
        selectedCategory.name.toLowerCase() === "commission paid" ||
        selectedCategory.name.toLowerCase() === "rewards" ||
        selectedCategory.name.toLowerCase() === "commission difference")
    );
  };

  const shouldShowProjectPlotSelection = () => {
    const selectedCategory = categories.find(
      (cat) => cat.id.toString() === formData.category_id,
    );
    return selectedCategory && projects.length > 0 && plots.length > 0;
  };

  const isProjectPlotMandatory = () => {
    return isCommissionCategory();
  };

  const shouldShowMobileNumberField = () => {
    const selectedCategory = categories.find(
      (cat) => cat.id.toString() === formData.category_id,
    );
    return (
      formData.category_id === "1" ||
      (selectedCategory?.name === "commission paid" &&
        formData.category_type === "dr") ||
      (selectedCategory?.name === "Rewards Paid" &&
        formData.category_type === "dr") ||
      (selectedCategory?.name === "Commission Difference" &&
        formData.category_type === "dr") ||
      (selectedCategory?.name === "Fuel Convince Paid" &&
        formData.category_type === "dr") ||
      (selectedCategory?.name === "Salary Paid" &&
        formData.category_type === "dr") ||
      (selectedCategory?.name === "Royalty Paid" &&
        formData.category_type === "dr") ||
      (selectedCategory?.name === "TDS Amount Received" &&
        formData.category_type === "cr")
    );
  };

  // Fetch projects and plots for ALL categories
  useEffect(() => {
    const fetchProjectsAndPlots = async () => {
      const token = getAuthToken();
      if (!token) return;

      try {
        const [projectsResponse, plotsResponse] = await Promise.all([
          fetch(`${API_URL}/project-list-block`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${API_URL}/all-plot-list`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

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
    };

    fetchProjectsAndPlots();
  }, []);

  const handlePlotSelection = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "plot_id" && value) {
      const selectedPlot = plots.find((plot) => plot.id.toString() === value);
      if (selectedPlot) {
        const areaSqyd =
          selectedPlot.area_sqyd ||
          selectedPlot.area ||
          selectedPlot.sqyd ||
          "0";
        setSelectedPlotArea(areaSqyd);
        console.log("Selected plot area:", areaSqyd);
      }
    } else if (name === "plot_id" && !value) {
      setSelectedPlotArea(null);
      setPerUnitAmount("");
      // Only clear amount if we're in commission category and using per unit calculation
      if (isCommissionCategory()) {
        setFormData((prev) => ({ ...prev, amount: "" }));
      }
    }

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handlePerUnitAmountChange = (e) => {
    const value = e.target.value;
    setPerUnitAmount(value);
    if (selectedPlotArea && value && !isNaN(value) && parseFloat(value) > 0) {
      const area = parseFloat(selectedPlotArea);
      const perUnit = parseFloat(value);
      const totalAmount = (area * perUnit).toFixed(2);
      setFormData((prev) => ({ ...prev, amount: totalAmount }));
    } else {
      // Only clear amount for commission categories
      if (isCommissionCategory()) {
        setFormData((prev) => ({ ...prev, amount: "" }));
      }
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
        showCustomMessageModal(
          "Auth Error",
          "Authentication token not found.",
          "error",
        );
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
          showCustomMessageModal(
            "Fetch Error",
            categoriesData.message || "Failed to fetch categories.",
            "error",
          );
        }

        if (bankAccountsData.status) setBankAccounts(bankAccountsData.data);
        else
          showCustomMessageModal(
            "Fetch Error",
            bankAccountsData.message || "Failed to fetch bank accounts.",
            "error",
          );
      } catch (err) {
        console.error("Data fetching error:", err);
        showCustomMessageModal(
          "Network Error",
          "An unexpected error occurred.",
          "error",
        );
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
        const selectedCategory = categories.find(
          (cat) => cat.id.toString() === value,
        );
        newData.category_name = selectedCategory ? selectedCategory.name : "";
        newData.category_type = selectedCategory ? selectedCategory.type : "";

        // Reset project/plot fields if switching from commission category
        const prevSelectedCategory = categories.find(
          (cat) => cat.id.toString() === prevData.category_id,
        );
        if (
          prevSelectedCategory &&
          isCommissionCategory() &&
          !isCommissionCategory()
        ) {
          newData.project_id = "";
          newData.plot_id = "";
          setSelectedPlotArea(null);
          setPerUnitAmount("");
        }

        if (selectedCategory?.type !== "cr" && !shouldShowMobileNumberField()) {
          newData.name = "";
        }

        if (!shouldShowMobileNumberField()) {
          newData.associate_mobile = "";
          setParentName("");
        }

        console.log("Selected Category:", selectedCategory);
        console.log("Is Commission Category?", isCommissionCategory());
      }

      if (name === "account_id") {
        const selectedAccount = bankAccounts.find(
          (acc) => acc.id.toString() === value,
        );
        newData.payee = selectedAccount ? selectedAccount.payee : "";
        newData.payment_type = selectedAccount ? selectedAccount.type : "";
      }

      return newData;
    });

    if (errors[name])
      setErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    if (errors[name])
      setErrors((prevErrors) => ({ ...prevErrors, [name]: null }));

    if (
      name === "associate_mobile" &&
      value.length === 10 &&
      shouldShowMobileNumberField()
    ) {
      setCheckingParentId(true);
      setParentName("");
      try {
        const token = getAuthToken();
        if (!token) {
          showCustomMessageModal(
            "Authentication Error",
            "Authentication token not found. Please log in.",
            "error",
          );
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
          setErrors((prevErrors) => ({
            ...prevErrors,
            associate_mobile: null,
          }));
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
    } else if (
      name === "associate_mobile" &&
      value.length !== 10 &&
      shouldShowMobileNumberField()
    ) {
      setParentName("");
      setErrors((prevErrors) => ({
        ...prevErrors,
        associate_mobile: "mobile must be 10 digits.",
      }));
    }
  };

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    const requiredFields = ["category_id", "account_id", "amount", "date"];
    requiredFields.forEach((field) => {
      if (!formData[field] || !formData[field].toString().trim()) {
        newErrors[field] =
          `${field.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} is required.`;
        isValid = false;
      }
    });

    if (!formData.payment_type || !formData.payment_type.trim()) {
      newErrors.payment_type =
        "Payment Mode is required. Please select a payment account.";
      isValid = false;
    }

    // Project/Plot validation
    if (shouldShowProjectPlotSelection()) {
      if (isProjectPlotMandatory()) {
        // Mandatory for commission categories
        if (!formData.project_id) {
          newErrors.project_id =
            "Project selection is required for this category.";
          isValid = false;
        }
        if (!formData.plot_id) {
          newErrors.plot_id = "Plot selection is required for this category.";
          isValid = false;
        }
      }
      // For non-commission categories, project/plot are optional (no validation)
    }

    if (shouldShowMobileNumberField()) {
      if (
        !formData.associate_mobile ||
        formData.associate_mobile.length !== 10
      ) {
        newErrors.associate_mobile =
          "Valid 10-digit Mobile Number is required.";
        isValid = false;
      }
    } else {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (shouldShowMobileNumberField() && !parentName) {
      showCustomMessageModal(
        "Validation Error",
        "Please verify a valid mobile number before submitting.",
        "error",
      );
      return;
    }
    setLoading(true);
    try {
      const token = getAuthToken();
      if (!token) {
        showCustomMessageModal(
          "Authentication Error",
          "Authentication token not found. Please log in.",
          "error",
        );
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
        // Always include project/plot if they have values
        ...(formData.project_id ? { project_id: formData.project_id } : {}),
        ...(formData.plot_id
          ? {
              plot_id: formData.plot_id,
              plot_area_sqyd: selectedPlotArea,
              per_unit_amount: isCommissionCategory() ? perUnitAmount : null,
            }
          : {}),
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
        showCustomMessageModal(
          "Success",
          result.message || "Expense added successfully!",
          "success",
        );
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
        showCustomMessageModal(
          "Error",
          result.message || "Failed to add expense.",
          "error",
        );
      }
    } catch (err) {
      console.error("Error adding expense:", err);
      showCustomMessageModal(
        "Error",
        err.message || "An unexpected error occurred.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const getFilteredPlots = () => {
    if (!formData.project_id) return plots;

    return plots.filter((plot) => {
      if (
        plot.project_id &&
        plot.project_id.toString() === formData.project_id
      ) {
        return true;
      }
      if (
        plot.project_id &&
        plot.project_id.toString() === formData.project_id.toString()
      ) {
        return true;
      }
      return false;
    });
  };

  return (
    <div className="mt-2">
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
                  <p className="mt-2">
                    Fetching categories and bank accounts...
                  </p>
                </div>
              ) : (
                <Form onSubmit={handleSubmit}>
                  <Row>
                    {/* Payment From */}
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Select Payment From{" "}
                          <span className="text-danger">*</span>
                        </Form.Label>
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
                        <Form.Control.Feedback type="invalid">
                          {errors.account_id}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    {/* Payment Mode */}
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Payment Mode <span className="text-danger">*</span>
                        </Form.Label>
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
                        <Form.Control.Feedback type="invalid">
                          {errors.payment_type}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    {/* Category */}
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Category <span className="text-danger">*</span>
                        </Form.Label>
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
                        <Form.Control.Feedback type="invalid">
                          {errors.category_id}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    {/* Category Type */}
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

                    {/* Project and Plot Selection - Show for ALL categories if data exists */}
                    {shouldShowProjectPlotSelection() && (
                      <>
                        {/* Project Selection */}
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>
                              Select Project
                              {isProjectPlotMandatory() && (
                                <span className="text-danger">*</span>
                              )}
                            </Form.Label>
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
                            <Form.Control.Feedback type="invalid">
                              {errors.project_id}
                            </Form.Control.Feedback>
                            {isProjectPlotMandatory() &&
                              !formData.project_id && (
                                <Form.Text className="text-muted">
                                  Project selection is required for this
                                  category
                                </Form.Text>
                              )}
                          </Form.Group>
                        </Col>

                        {/* Plot Selection */}
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>
                              Select Unit Number
                              {isProjectPlotMandatory() && (
                                <span className="text-danger">*</span>
                              )}
                            </Form.Label>
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
                                  {plot.plot_shop_villa_no ||
                                    plot.plot_number ||
                                    plot.name}
                                </option>
                              ))}
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                              {errors.plot_id}
                            </Form.Control.Feedback>
                            {formData.project_id &&
                              getFilteredPlots().length === 0 && (
                                <Form.Text className="text-warning">
                                  No plots available for the selected project
                                </Form.Text>
                              )}
                            {isProjectPlotMandatory() && !formData.plot_id && (
                              <Form.Text className="text-muted">
                                Unit selection is required for this category
                              </Form.Text>
                            )}
                          </Form.Group>
                        </Col>

                        {/* Per Unit Calculation - Only for Commission Categories */}
                        {isCommissionCategory() &&
                          formData.plot_id &&
                          selectedPlotArea && (
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
                                  <Form.Label>
                                    Enter Per Unit Amount (₹)
                                  </Form.Label>
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
                                  <Form.Label>
                                    Total Amount{" "}
                                    <span className="text-danger">*</span>
                                  </Form.Label>
                                  <Form.Control
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleFormChange}
                                    placeholder="Total amount will be calculated automatically"
                                    readOnly={!!perUnitAmount}
                                    className={perUnitAmount ? "bg-light" : ""}
                                    isInvalid={!!errors.amount}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {errors.amount}
                                  </Form.Control.Feedback>
                                  {formData.amount &&
                                    selectedPlotArea &&
                                    perUnitAmount && (
                                      <Form.Text className="text-success">
                                        Calculated: {selectedPlotArea} SQYD × ₹
                                        {perUnitAmount} = ₹{formData.amount}
                                      </Form.Text>
                                    )}
                                </Form.Group>
                              </Col>
                            </>
                          )}
                      </>
                    )}

                    {/* Payment To (Mobile or Name) */}
                    {shouldShowMobileNumberField() ? (
                      <Col md={6}>
                        <Form.Group className="mb-4">
                          <Form.Label>
                            Payment To (Mobile Number){" "}
                            <span className="text-danger">*</span>
                          </Form.Label>
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
                            <Form.Text className="text-muted">
                              Checking mobile number...
                            </Form.Text>
                          )}
                          {parentName && !errors.associate_mobile && (
                            <Form.Text className="text-success">
                              {formData.category_id === "1"
                                ? "Associate"
                                : "Receiver"}{" "}
                              Name : {parentName}
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
                          <Form.Label>
                            Payment To (Receiver Name){" "}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleFormChange}
                            placeholder="Enter Receiver Name"
                            isInvalid={!!errors.name}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.name}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    )}

                    {/* Amount - Show if NOT commission category OR commission category without per unit calculation */}
                    {(!isCommissionCategory() || !perUnitAmount) && (
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            Amount <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="number"
                            name="amount"
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
                    )}

                    {/* Payment Date */}
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Payment Date <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleFormChange}
                          isInvalid={!!errors.date}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.date}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    {/* Description */}
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Description <span className="text-danger">*</span>
                        </Form.Label>
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

      {/* Message Modal */}
      {showMessageModal && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div
              className={`modal-content ${
                messageModalContent.type === "success"
                  ? "border-success"
                  : messageModalContent.type === "error"
                    ? "border-danger"
                    : "border-warning"
              }`}
            >
              <div className="modal-header d-flex justify-content-between align-items-center">
                <h5
                  className={`modal-title ${
                    messageModalContent.type === "success"
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
    </div>
  );
}

export default AddExpenses;
