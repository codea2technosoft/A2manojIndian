import React, { useEffect, useState } from "react";
import { Modal, Button, Table, Pagination } from "react-bootstrap";
import { MdFilterAlt, MdFilterAltOff } from "react-icons/md";
import { FaDownload } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const API_URL = process.env.REACT_APP_API_URL;
function AssociatesDesignationLists() {
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(100);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Filter states
  const [filterDesignation, setFilterDesignation] = useState("");
  const [filterMinBuySQFT, setFilterMinBuySQFT] = useState("");
  const [filterMaxBuySQFT, setFilterMaxBuySQFT] = useState("");
  const [filterFromDate, setFilterFromDate] = useState(null);
  const [filterToDate, setFilterToDate] = useState(null);
  const [filterFromDateInput, setFilterFromDateInput] = useState("");
  const [filterToDateInput, setFilterToDateInput] = useState("");

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
    setMessageModalContent({ title: "", text: "", type: "" });
  };

  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  // Format date for API payload (YYYY-MM-DD)
  const formatDateForAPI = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Format date for display (DD-MM-YYYY)
  const formatDateForDisplay = (dateStr) => {
    if (!dateStr) return "-";

    // Try to parse if it's in YYYY-MM-DD format from API
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    }
    return dateStr;
  };

  // Parse date from DD-MM-YYYY string
  const parseDateFromString = (dateStr) => {
    if (!dateStr) return null;

    // Handle DD-MM-YYYY format
    const regex = /^(\d{2})-(\d{2})-(\d{4})$/;
    const match = dateStr.match(regex);

    if (match) {
      const day = parseInt(match[1]);
      const month = parseInt(match[2]) - 1;
      const year = parseInt(match[3]);
      return new Date(year, month, day);
    }

    return null;
  };

  const validateDateInput = (input) => {
    if (!input) return true; // Empty is valid

    const regex = /^(\d{2})-(\d{2})-(\d{4})$/;
    const match = input.match(regex);

    if (!match) return false;

    const day = parseInt(match[1]);
    const month = parseInt(match[2]);
    const year = parseInt(match[3]);

    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    if (year < 1900 || year > 2100) return false;

    const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (day > daysInMonth[month - 1]) return false;

    return true;
  };

  const validateBuySQFTInput = (value) => {
    if (!value) return true;
    return !isNaN(value) && parseFloat(value) >= 0;
  };

  const buildUrlWithFilters = (page = 1, limit = null) => {
    let url = `${API_URL}/designation-list-associate?page=${page}`;
    
    if (limit) {
      url += `&limit=${limit}`;
    } else {
      url += `&limit=${perPage}`;
    }
    
    if (filterDesignation) {
      url += `&designation=${encodeURIComponent(filterDesignation)}`;
    }

    if (filterMinBuySQFT) {
      url += `&min_buysqrt=${encodeURIComponent(filterMinBuySQFT)}`;
    }

    if (filterMaxBuySQFT) {
      url += `&max_buysqrt=${encodeURIComponent(filterMaxBuySQFT)}`;
    }

    if (filterFromDate) {
      const formattedDate = formatDateForAPI(filterFromDate);
      url += `&from_date=${encodeURIComponent(formattedDate)}`;
    }

    if (filterToDate) {
      const formattedDate = formatDateForAPI(filterToDate);
      url += `&to_date=${encodeURIComponent(formattedDate)}`;
    }
    
    return url;
  };

  const fetchDesignationList = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const token = getAuthToken();
      if (!token) {
        showCustomMessageModal(
          "Authentication Error",
          "Authentication token not found. Please log in.",
          "error"
        );
        throw new Error("Authentication token not found. Please log in.");
      }

      const url = buildUrlWithFilters(page);
      console.log("Fetching URL:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          showCustomMessageModal(
            "Authorization Error",
            "Unauthorized: Please log in again.",
            "error"
          );
          throw new Error("Unauthorized: Please log in again.");
        }
        const errorData = await response.json();
        showCustomMessageModal(
          "Error",
          errorData.message || "Failed to fetch designation list.",
          "error"
        );
        throw new Error(errorData.message || "Failed to fetch designation list.");
      }

      const data = await response.json();
      console.log("API Response:", data);

      if (data.success === "1") {
        setDesignations(data.data || []);
        setTotalRecords(data.total || 0);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(data.page || 1);
      } else {
        showCustomMessageModal("Error", data.message || "Failed to fetch designation list.", "error");
        setDesignations([]);
        setTotalPages(1);
        setCurrentPage(1);
        setTotalRecords(0);
      }
    } catch (err) {
      console.error("Fetch designation list error:", err);
      setDesignations([]);
      setTotalPages(1);
      setCurrentPage(1);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCSV = async () => {
    setDownloading(true);
    try {
      const token = getAuthToken();
      if (!token) {
        showCustomMessageModal(
          "Authentication Error",
          "Authentication token not found. Please log in.",
          "error"
        );
        return;
      }

      let url = `${API_URL}/designation-list-associate?page=1&limit=10000`;
      
      if (filterDesignation) {
        url += `&designation=${encodeURIComponent(filterDesignation)}`;
      }

      if (filterMinBuySQFT) {
        url += `&min_buysqrt=${encodeURIComponent(filterMinBuySQFT)}`;
      }

      if (filterMaxBuySQFT) {
        url += `&max_buysqrt=${encodeURIComponent(filterMaxBuySQFT)}`;
      }

      if (filterFromDate) {
        const formattedDate = formatDateForAPI(filterFromDate);
        url += `&from_date=${encodeURIComponent(formattedDate)}`;
      }

      if (filterToDate) {
        const formattedDate = formatDateForAPI(filterToDate);
        url += `&to_date=${encodeURIComponent(formattedDate)}`;
      }

      console.log("Download URL:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to download data");
      }

      const data = await response.json();
      
      if (data.success === "1" && data.data && data.data.length > 0) {
        const headers = [
          "Name",
          "Mobile",
          "BuySQYD",
          "Designation",
          "Designation Achieve Date",
          "Parent Name",
          "Parent Mobile",
        ];
        
        const csvRows = [];
        csvRows.push(headers.join(","));
        
        data.data.forEach((person, index) => {
          const achieveDate = person.buysqrt_updated_at || person.updated_at
            ? formatDateForDisplay(person.buysqrt_updated_at || person.updated_at)
            : "-";
          
          const row = [
            `"${(person.username || "-").replace(/"/g, '""')}"`,
            `"${(person.mobile || "-").replace(/"/g, '""')}"`,
            `"${(person.buysqrt || "-").replace(/"/g, '""')}"`,
            `"${(person.designation || "-").replace(/"/g, '""')}"`,
            `"${achieveDate}"`,
            `"${(person.parent_username || "-").replace(/"/g, '""')}"`,
            `"${(person.parent_mobile || "-").replace(/"/g, '""')}"`,
          ];
          csvRows.push(row.join(","));
        });
        
        const csvContent = csvRows.join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const downloadUrl = URL.createObjectURL(blob);
        
        let filterText = "";
        if (filterDesignation) filterText += `_${filterDesignation}`;
        if (filterMinBuySQFT) filterText += `_min_${filterMinBuySQFT}`;
        if (filterMaxBuySQFT) filterText += `_max_${filterMaxBuySQFT}`;
        if (filterFromDate) filterText += `_from_${formatDateForAPI(filterFromDate)}`;
        if (filterToDate) filterText += `_to_${formatDateForAPI(filterToDate)}`;
        
        const filename = `associates_designation_list${filterText}_${new Date().toISOString().split('T')[0]}.csv`;
        link.setAttribute("href", downloadUrl);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(downloadUrl);
        
        showCustomMessageModal(
          "Success",
          `Successfully downloaded ${data.data.length} filtered records!`,
          "success"
        );
      } else {
        showCustomMessageModal(
          "No Data",
          "No records found with current filters to download!",
          "error"
        );
      }
    } catch (err) {
      console.error("Download CSV error:", err);
      showCustomMessageModal(
        "Download Error",
        err.message || "Failed to download CSV file",
        "error"
      );
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    fetchDesignationList(currentPage);
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleSearchClick = () => {
    setCurrentPage(1);

    // Validate BuySQFT inputs
    if (!validateBuySQFTInput(filterMinBuySQFT)) {
      showCustomMessageModal(
        "Invalid Input",
        "Enter Min BuySQYD",
        "error"
      );
      return;
    }

    if (!validateBuySQFTInput(filterMaxBuySQFT)) {
      showCustomMessageModal(
        "Invalid Input",
        "Enter Max BuySQYD",
        "error"
      );
      return;
    }

    // Validate dates
    if (filterFromDateInput && !validateDateInput(filterFromDateInput)) {
      showCustomMessageModal(
        "Invalid Date",
        "Please enter From Date in DD-MM-YYYY format (e.g., 10-02-2026)",
        "error"
      );
      return;
    }

    if (filterToDateInput && !validateDateInput(filterToDateInput)) {
      showCustomMessageModal(
        "Invalid Date",
        "Please enter To Date in DD-MM-YYYY format (e.g., 10-02-2026)",
        "error"
      );
      return;
    }

    // Validate min <= max
    if (filterMinBuySQFT && filterMaxBuySQFT) {
      if (parseFloat(filterMinBuySQFT) > parseFloat(filterMaxBuySQFT)) {
        showCustomMessageModal(
          "Invalid Range",
          "Min BuySQYD cannot be greater than Max BuySQFT",
          "error"
        );
        return;
      }
    }

    // Validate from_date <= to_date
    if (filterFromDate && filterToDate) {
      if (filterFromDate > filterToDate) {
        showCustomMessageModal(
          "Invalid Date Range",
          "From Date cannot be later than To Date",
          "error"
        );
        return;
      }
    }

    fetchDesignationList(1);
  };

  const handleClearSearch = () => {
    setFilterDesignation("");
    setFilterMinBuySQFT("");
    setFilterMaxBuySQFT("");
    setFilterFromDate(null);
    setFilterToDate(null);
    setFilterFromDateInput("");
    setFilterToDateInput("");
    setCurrentPage(1);
    fetchDesignationList(1);
  };

  const handleToggle = () => {
    setIsFilterActive(!isFilterActive);
  };

  const handleFromDateChange = (date) => {
    setFilterFromDate(date);
    if (date) {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      setFilterFromDateInput(`${day}-${month}-${year}`);
    }
  };

  const handleToDateChange = (date) => {
    setFilterToDate(date);
    if (date) {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      setFilterToDateInput(`${day}-${month}-${year}`);
    }
  };

  const handleFromDateManualInput = (e) => {
    const value = e.target.value;
    const cleaned = value.replace(/[^\d-]/g, '');

    if (cleaned.length === 2 && !cleaned.includes('-')) {
      setFilterFromDateInput(cleaned + '-');
    } else if (cleaned.length === 5 && cleaned.split('-').length === 2) {
      setFilterFromDateInput(cleaned + '-');
    } else if (cleaned.length <= 10) {
      setFilterFromDateInput(cleaned);
    }

    if (cleaned.length === 10) {
      const parsedDate = parseDateFromString(cleaned);
      setFilterFromDate(parsedDate);
    } else {
      setFilterFromDate(null);
    }
  };

  const handleToDateManualInput = (e) => {
    const value = e.target.value;
    const cleaned = value.replace(/[^\d-]/g, '');

    if (cleaned.length === 2 && !cleaned.includes('-')) {
      setFilterToDateInput(cleaned + '-');
    } else if (cleaned.length === 5 && cleaned.split('-').length === 2) {
      setFilterToDateInput(cleaned + '-');
    } else if (cleaned.length <= 10) {
      setFilterToDateInput(cleaned);
    }

    if (cleaned.length === 10) {
      const parsedDate = parseDateFromString(cleaned);
      setFilterToDate(parsedDate);
    } else {
      setFilterToDate(null);
    }
  };

  const handleMinBuySQFTChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setFilterMinBuySQFT(value);
    }
  };

  const handleMaxBuySQFTChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setFilterMaxBuySQFT(value);
    }
  };

  const CustomDateInput = React.forwardRef(({ value, onClick, onChange, placeholder, dateValue, onManualChange }, ref) => (
    <div className="input-group">
      <input
        type="text"
        className="form-control"
        value={dateValue || value || ''}
        onChange={onManualChange}
        placeholder={placeholder}
        ref={ref}
      />
      <button
        className="btn btn-outline-secondary"
        type="button"
        onClick={onClick}
      >
        📅
      </button>
    </div>
  ));

  if (loading && !designations.length) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card mt-2">
        <div className="card-header">
          <div className="d-flex align-items-center justify-content-between">
            <div className="titlepage">
              <h3>Associates Designation Lists</h3>
            </div>
            <div className="d-flex gap-2">
              <button
                className={`filter-toggle-btn btn ${isFilterActive ? "btn-secondary" : "btn-outline-secondary"}`}
                onClick={handleToggle}
              >
                {isFilterActive ? <MdFilterAltOff /> : <MdFilterAlt />}
              </button>
            </div>
          </div>
        </div>

        <div className="card-body">
          {isFilterActive && (
            <div className="filter-section mb-2">
              <div className="row g-3">
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label">Designation</label>
                    <input
                      type="text"
                      className="form-control"
                      value={filterDesignation}
                      onChange={(e) => setFilterDesignation(e.target.value)}
                      placeholder="Enter designation"
                    />
                  </div>
                </div>

                <div className="col-md-2">
                  <div className="form-group">
                    <label className="form-label">Min BuySQYD</label>
                    <input
                      type="text"
                      className="form-control"
                      value={filterMinBuySQFT}
                      onChange={handleMinBuySQFTChange}
                      placeholder="Min BuySQYD"
                    />
                  </div>
                </div>

                <div className="col-md-2">
                  <div className="form-group">
                    <label className="form-label">Max BuySQYD</label>
                    <input
                      type="text"
                      className="form-control"
                      value={filterMaxBuySQFT}
                      onChange={handleMaxBuySQFTChange}
                      placeholder="Max BuySQYD"
                    />
                  </div>
                </div>

                {/* <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label">From Date (DD-MM-YYYY)</label>
                    <DatePicker
                      selected={filterFromDate}
                      onChange={handleFromDateChange}
                      dateFormat="dd-MM-yyyy"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      customInput={
                        <CustomDateInput 
                          dateValue={filterFromDateInput}
                          onManualChange={handleFromDateManualInput}
                          placeholder="DD-MM-YYYY"
                        />
                      }
                      placeholderText="DD-MM-YYYY"
                      openToDate={new Date()}
                      yearDropdownItemNumber={30}
                      scrollableYearDropdown
                    />
                  </div>
                </div>

                <div className="col-md-2">
                  <div className="form-group">
                    <label className="form-label">To Date (DD-MM-YYYY)</label>
                    <DatePicker
                      selected={filterToDate}
                      onChange={handleToDateChange}
                      dateFormat="dd-MM-yyyy"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      customInput={
                        <CustomDateInput 
                          dateValue={filterToDateInput}
                          onManualChange={handleToDateManualInput}
                          placeholder="DD-MM-YYYY"
                        />
                      }
                      placeholderText="DD-MM-YYYY"
                      openToDate={new Date()}
                      yearDropdownItemNumber={30}
                      scrollableYearDropdown
                      minDate={filterFromDate || undefined}
                    />
                  </div>
                </div>

                <div className="col-md-12 d-flex gap-2">
                  <button className="btn btn-primary" onClick={handleSearchClick}>
                    Search
                  </button>

                  <button className="btn btn-success" onClick={handleDownloadCSV} disabled={downloading}>
                    <FaDownload className="me-2" />
                    {downloading ? "Downloading..." : "Download CSV"}
                  </button>

                  <button className="btn btn-secondary" onClick={handleClearSearch}>
                    Clear
                  </button>
                </div> */}

                 <button className="btn btn-success" onClick={handleDownloadCSV} disabled={downloading}>
                    <FaDownload className="me-2" />
                    {downloading ? "Downloading..." : "Download CSV"}
                  </button>
              </div>
            </div>
          )}

          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5>Total Records: {totalRecords}</h5>
              </div>
              {(filterDesignation || filterMinBuySQFT || filterMaxBuySQFT || filterFromDate || filterToDate) && (
                <div className="text-info">
                  <small>Filtered data showing {totalRecords} records</small>
                </div>
              )}
            </div>
          </div>

          <div className="table-responsive">
            <Table bordered hover>
              <thead className="bg-primary text-white">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>BuySQYD</th>
                  <th>Designation</th>
                  <th>Designation Achieve Date</th>
                  <th>Parent Name</th>
                  <th>Parent Mobile</th>
                </tr>
              </thead>
              <tbody>
                {designations.length > 0 ? (
                  designations.map((person, index) => (
                    <tr key={person.id || index}>
                      <td>{(currentPage - 1) * perPage + index + 1}</td>
                      <td>{person.username || "-"}</td>
                      <td>{person.mobile || "-"}</td>
                      <td>{person.buysqrt || "-"}</td>
                      <td>{person.designation || "-"}</td>
                      <td>
                        {person.buysqrt_updated_at || person.updated_at
                          ? formatDateForDisplay(person.buysqrt_updated_at || person.updated_at)
                          : "-"}
                      </td>
                      <td>{person.parent_username || "-"}</td>
                      <td>{person.parent_mobile || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">
                      {(filterDesignation || filterMinBuySQFT || filterMaxBuySQFT || filterFromDate || filterToDate) ?
                        `No designation records found for selected filters` :
                        "No designation records found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap">
              <div className="text-muted">
                Showing {(currentPage - 1) * perPage + 1} to{" "}
                {Math.min(currentPage * perPage, totalRecords)} of {totalRecords} Designations
              </div>
              <div>
                <Pagination>
                  <Pagination.Prev
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  />

                  {[1, 2, 3].map((pageNum) => {
                    if (pageNum > totalPages) return null;
                    return (
                      <Pagination.Item
                        key={pageNum}
                        active={pageNum === currentPage}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </Pagination.Item>
                    );
                  })}

                  {currentPage > 4 && totalPages > 4 && <Pagination.Ellipsis disabled />}

                  {currentPage > 3 && currentPage < totalPages - 1 && (
                    <Pagination.Item
                      active
                      onClick={() => handlePageChange(currentPage)}
                    >
                      {currentPage}
                    </Pagination.Item>
                  )}

                  {currentPage < totalPages - 2 && totalPages > 4 && <Pagination.Ellipsis disabled />}

                  {totalPages > 3 && (
                    <Pagination.Item
                      active={currentPage === totalPages}
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
            </div>
          )}
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
                : "border-danger"}`}
            >
              <div className="modal-header">
                <h5
                  className={`modal-title ${messageModalContent.type === "success"
                    ? "text-success"
                    : "text-danger"}`}
                >
                  {messageModalContent.title}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeCustomMessageModal}
                ></button>
              </div>
              <div className="modal-body">
                <p>{messageModalContent.text}</p>
              </div>
              <div className="modal-footer">
                <Button
                  variant={messageModalContent.type === "success" ? "success" : "danger"}
                  onClick={closeCustomMessageModal}
                >
                  OK
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AssociatesDesignationLists;