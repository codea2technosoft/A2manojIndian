import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { Modal, Button, Form, Table, Pagination, Row, Col, Container, Spinner } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin3Fill, RiFilter2Line } from "react-icons/ri";
import { HiOutlineChevronLeft, HiChevronRight } from "react-icons/hi2";
import { BsThreeDots } from "react-icons/bs";
import { MdFilterAlt } from "react-icons/md";
import { MdFilterAltOff } from "react-icons/md";
import { FaDownload } from "react-icons/fa";
import * as XLSX from 'xlsx';

const API_URL = process.env.REACT_APP_API_URL;

function ExpensesList() {
    const navigate = useNavigate();
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [editModalShow, setEditModalShow] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [limit, setLimit] = useState(10);

    // Edit form data में project और plot fields जोड़ें
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
        project_id: "", // नया
        project_name: "", // नया
        plot_id: "", // नया
        plot_name: "" // नया
    });

    const [deleteModalShow, setDeleteModalShow] = useState(false);
    const [expenseToDelete, setExpenseToDelete] = useState(null);
    const [categories, setCategories] = useState([]);
    const [bankAccounts, setBankAccounts] = useState([]);
    const [fillterdesign, setfillterdesign] = useState();

    // Projects और Plots के लिए state
    const [projects, setProjects] = useState([]);
    const [plots, setPlots] = useState([]);
    const [filteredPlots, setFilteredPlots] = useState([]);

    const formatText = (text) => {
        if (!text || typeof text !== "string") return "NA";
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    };

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

    // Projects fetch करें
    const fetchProjects = async () => {
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

            const projectsData = await projectsResponse.json();

            if (projectsData.status) {
                setProjects(projectsData.data || []);
            }
        } catch (err) {
            console.error("Error fetching projects:", err);
            showCustomMessageModal("Error", "Failed to load projects", "error");
        }
    };

    // Selected project के based पर plots fetch करें
    const fetchPlotsByProject = async (projectId) => {
        if (!projectId) {
            setFilteredPlots([]);
            return;
        }

        const token = getAuthToken();
        if (!token) return;

        try {
            const plotsResponse = await fetch(`${API_URL}/all-plot-list-by-id?project_id=${projectId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const plotsData = await plotsResponse.json();

            if (plotsData.status) {
                const allPlots = plotsData.data || [];
                setFilteredPlots(allPlots);
            } else {
                setFilteredPlots([]);
            }
        } catch (err) {
            console.error("Error fetching plots:", err);
            showCustomMessageModal("Error", "Failed to load plots", "error");
        }
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

            const response = await fetch(`${API_URL}/final-pl-report-details-lists?${query}`, {
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

    // Export function (same as before)
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
                "Project": associate.project_name,
                "Plot": associate.plot_name
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
        fetchExpenses(1);
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
        fetchProjects(); // Projects fetch करें
    }, []);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            fetchExpenses(pageNumber);
        }
    };

    // Edit modal show होने पर
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
            project_id: expense.project_id || "",
            project_name: expense.project_name || "",
            plot_id: expense.plot_id || "",
            plot_name: expense.plot_name || ""
        });

        // Agar project_id hai to uske plots fetch करें
        if (expense.project_id) {
            fetchPlotsByProject(expense.project_id);
        } else {
            setFilteredPlots([]);
        }

        setEditModalShow(true);
    };

    const handleEditModalClose = () => {
        setEditModalShow(false);
        setFilteredPlots([]); // Reset plots
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
            // Project change होने पर
            if (name === "project_id") {
                const selectedProject = projects.find(project => project.id.toString() === value);
                newData.project_name = selectedProject ? selectedProject.name : "";
                newData.plot_id = ""; // Reset plot when project changes
                newData.plot_name = "";

                // Fetch plots for selected project
                if (value) {
                    fetchPlotsByProject(value);
                } else {
                    setFilteredPlots([]);
                }
            }
            // Plot change होने पर
            if (name === "plot_id") {
                const selectedPlot = filteredPlots.find(plot => plot.id.toString() === value);
                newData.plot_name = selectedPlot ? (selectedPlot.name || selectedPlot.plot_number) : "";
            }

            return newData;
        });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = getAuthToken();

        // Selected project और plot की details fetch करें
        const selectedProject = projects.find(p => p.id == editFormData.project_id);
        const selectedPlot = filteredPlots.find(p => p.id == editFormData.plot_id);

        const payload = {
            ...editFormData,
            amount: parseFloat(editFormData.amount),
            project_name: selectedProject ? selectedProject.name : "",
            plot_name: selectedPlot ? (selectedPlot.name || selectedPlot.plot_number) : ""
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
            fetchExpenses(currentPage);

        } catch (error) {
            console.error("Error deleting expense:", error);
            showCustomMessageModal("Error", error.message || "An unexpected error occurred.", "error");
        } finally {
            setLoading(false);
        }
    };

    const [isFilterActive, setIsFilterActive] = useState(false);
    const handleToggle = () => {
        setIsFilterActive(!isFilterActive);
    };

    return (
        <>
            <div className="card mt-2">
                <div className="card-header expenselistdesign">
                    <div className="d-flex  justify-content-between align-items-center w-100">
                        <div className="titlepage expenselist">
                            <h3 className="mb-0">Final PL Report Details Lists</h3>
                        </div>
                        <div className="d-flex gap-2">
                            {/* <div className="d-none d-md-none d-lg-none d-xl-block">
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
                                            className="submit_button"
                                            onClick={handleSearch}>
                                            Search
                                        </button>
                                    </div>
                                </div>
                            </div> */}
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
                                    <FaDownload />
                                )}
                            </button>

                            <div className="d-block d-md-block">
                                <div className="d-flex gap-2">
                                    <button
                                        className={`filter-toggle-btn btn ${isFilterActive ? "active" : ""}`}
                                        onClick={handleToggle}
                                    >
                                        {isFilterActive ? (
                                            <>
                                                <MdFilterAltOff />
                                            </>
                                        ) : (
                                            <>
                                                <MdFilterAlt />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    {isFilterActive && (
                        <div className="d-flex gap-2 mb-3 mt-2 flex-wrap-mobile expencelistwrap">
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
                                    className="submit_button"
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
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {expenses.length > 0 ? (
                                                expenses.map((expense, index) => (
                                                    <tr key={expense.id}>
                                                       <td>{(currentPage - 1) * limit + (index + 1)}</td>
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
                                                            {expense.plot_name || "NA"}
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
                                                    <td colSpan="14" className="text-center">No expenses found.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>

                                    {/* Totals Summary Row (Optional) */}
                                    {/* {expenses.length > 0 && (
                    <div className="mt-3 p-3 bg-light border rounded">
                        <div className="row">
                            <div className="col-md-4">
                                <strong>Total CR:</strong> ₹ {summary?.total_cr?.toLocaleString() || 0}
                            </div>
                            <div className="col-md-4">
                                <strong>Total DR:</strong> ₹ {summary?.total_dr?.toLocaleString() || 0}
                            </div>
                            <div className="col-md-4">
                                <strong>Net Balance:</strong> ₹ {summary?.net_balance?.toLocaleString() || 0}
                            </div>
                        </div>
                    </div>
                )} */}

                                    <div className="d-flex justify-content-end mt-3">
                                        <Pagination>
                                            <Pagination.Prev
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                            />

                                            {/* Always show first page */}
                                            <Pagination.Item
                                                active={1 === currentPage}
                                                onClick={() => handlePageChange(1)}
                                            >
                                                1
                                            </Pagination.Item>

                                            {/* Show ellipsis if there are pages before current page beyond page 2 */}
                                            {currentPage > 3 && (
                                                <Pagination.Ellipsis />
                                            )}

                                            {/* Show pages around current page */}
                                            {[...Array(totalPages)].map((_, index) => {
                                                const pageNumber = index + 1;
                                                // Show page if it's within 1 of current page (except page 1 which is always shown)
                                                if (
                                                    pageNumber > 1 &&
                                                    pageNumber < totalPages &&
                                                    Math.abs(pageNumber - currentPage) <= 1
                                                ) {
                                                    return (
                                                        <Pagination.Item
                                                            key={pageNumber}
                                                            active={pageNumber === currentPage}
                                                            onClick={() => handlePageChange(pageNumber)}
                                                        >
                                                            {pageNumber}
                                                        </Pagination.Item>
                                                    );
                                                }
                                                return null;
                                            })}

                                            {/* Show ellipsis if there are pages after current page before last page */}
                                            {currentPage < totalPages - 2 && (
                                                <Pagination.Ellipsis />
                                            )}

                                            {/* Always show last page if there's more than 1 page */}
                                            {totalPages > 1 && (
                                                <Pagination.Item
                                                    active={totalPages === currentPage}
                                                    onClick={() => handlePageChange(totalPages)}
                                                >
                                                    {totalPages}
                                                </Pagination.Item>
                                            )}

                                            <Pagination.Next
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                            />
                                        </Pagination>
                                    </div>
                                </>
                            )}
                        </Col>
                    </Row>
                </div>
            </div>

            {/* Edit Expense Modal - Project और Plot fields जोड़ें */}
            <Modal show={editModalShow} onHide={handleEditModalClose} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Edit Expense</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleEditSubmit}>
                    <Modal.Body>
                        <Row>
                            <Col md={6}>
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
                            <Col md={6}>
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
                                            <option key={acc.id} value={acc.id}>{acc.name} ({acc.payee})</option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>

                            {/* Project Field */}
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Project Name</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="project_id"
                                        value={editFormData.project_id}
                                        onChange={handleEditFormChange}
                                    >
                                        <option value="">Select Project</option>
                                        {projects?.map(project => (
                                            <option key={project.id} value={project.id}>
                                                {project.name}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>

                            {/* Plot Field - Project select होने पर ही enabled हो */}
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Unit Number</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="plot_id"
                                        value={editFormData.plot_id}
                                        onChange={handleEditFormChange}
                                        disabled={!editFormData.project_id}
                                    >
                                        <option value="">Select Plot</option>
                                        {filteredPlots?.map(plot => (
                                            <option key={plot.id} value={plot.id}>
                                                {plot.plot_shop_villa_no || plot.plot_shop_villa_no || `Plot ${plot.id}`}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
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
                        <Button variant="danger" onClick={handleEditModalClose}>Cancel</Button>
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
        </>
    );
}

export default ExpensesList;