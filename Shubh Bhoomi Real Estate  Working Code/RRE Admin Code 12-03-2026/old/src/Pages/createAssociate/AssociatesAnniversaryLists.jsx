import React, { useEffect, useState } from "react";
import { Modal, Button, Table, Pagination } from "react-bootstrap";
import { MdFilterAlt, MdFilterAltOff } from "react-icons/md";
import { FaDownload } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const API_URL = process.env.REACT_APP_API_URL;
function AssociatesAnniversaryLists() {
  const [anniversarys, setAnniversary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(100);
  const [searchDate, setSearchDate] = useState(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [filterInput, setFilterInput] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [downloading, setDownloading] = useState(false);

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
  
  const formatDateForAPI = (date) => {
    if (!date) return "";
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${day}-${month}`;
  };
  
  const formatFullDateForAPI = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const parseDateFromString = (dateStr) => {
    if (!dateStr) return null;
    const formats = [
      /(\d{2})[^\d](\d{2})[^\d](\d{4})/,
      /(\d{2})(\d{2})(\d{4})/,
      /(\d{4})[^\d](\d{2})[^\d](\d{2})/,
    ];

    for (const format of formats) {
      const match = dateStr.match(format);
      if (match) {
        const [, part1, part2, part3] = match;

        if (part3 && part3.length === 4) {
          if (part1.length === 4) {
            return new Date(parseInt(part1), parseInt(part2) - 1, parseInt(part3));
          } else {
            return new Date(parseInt(part3), parseInt(part2) - 1, parseInt(part1));
          }
        } else if (part1.length === 2 && part2.length === 2) {
          return new Date(parseInt(part3), parseInt(part2) - 1, parseInt(part1));
        }
      }
    }

    return null;
  };
  
  const formatDateForDisplay = (dateStr) => {
    const date = parseDateFromString(dateStr);
    if (!date) return dateStr;

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');

    return `${month}-${day}`;
  };
  
  const getMonthDayFromDate = (dateStr) => {
    const date = parseDateFromString(dateStr);
    if (!date) return "";

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');

    return `${day}-${month}`;
  };
  
  const validateDateInput = (input) => {
    const regex = /^(\d{2})-(\d{2})$/;
    const match = input.match(regex);

    if (!match) return false;

    const day = parseInt(match[1]);
    const month = parseInt(match[2]);
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (day > daysInMonth[month - 1]) return false;

    return true;
  };

  const buildUrlWithFilters = (page = 1, limit = null) => {
    let url = `${API_URL}/anniversary-list-associate?page=${page}`;
    
    if (limit) {
      url += `&limit=${limit}`;
    } else {
      url += `&limit=${perPage}`;
    }
    
    if (filterInput && validateDateInput(filterInput)) {
      url += `&date=${filterInput}`;
    } else if (searchDate) {
      url += `&date=${formatDateForAPI(searchDate)}`;
    }
    
    if (fromDate) {
      const formattedFrom = formatFullDateForAPI(fromDate);
      url += `&from_date=${formattedFrom}`;
    }
    
    if (toDate) {
      const formattedTo = formatFullDateForAPI(toDate);
      url += `&to_date=${formattedTo}`;
    }
    
    return url;
  };

  const fetchAnniversaryList = async (page = 1) => {
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
          errorData.message || "Failed to fetch anniversary list.",
          "error"
        );
        throw new Error(errorData.message || "Failed to fetch anniversary list.");
      }

      const data = await response.json();
      console.log("API Response:", data);

      if (data.success === "1") {
        setAnniversary(data.data || []);
        setTotalRecords(data.total || 0);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(data.page || 1);
      } else {
        showCustomMessageModal("Error", data.message || "Failed to fetch anniversary list.", "error");
        setAnniversary([]);
        setTotalPages(1);
        setCurrentPage(1);
        setTotalRecords(0);
      }
    } catch (err) {
      console.error("Fetch anniversary list error:", err);
      setAnniversary([]);
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

      let url = `${API_URL}/anniversary-list-associate?page=1&limit=10000`;
      
      if (filterInput && validateDateInput(filterInput)) {
        url += `&date=${filterInput}`;
      } else if (searchDate) {
        url += `&date=${formatDateForAPI(searchDate)}`;
      }
      
      if (fromDate) {
        const formattedFrom = formatFullDateForAPI(fromDate);
        url += `&from_date=${formattedFrom}`;
      }
      
      if (toDate) {
        const formattedTo = formatFullDateForAPI(toDate);
        url += `&to_date=${formattedTo}`;
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
          "Anniversary Date (DD-MM)",
          "Parent Name",
          "Parent Mobile",
        ];
        
        const csvRows = [];
        csvRows.push(headers.join(","));
        
        data.data.forEach((person, index) => {
          const anniversaryDate = person.marriage_anniversary_date 
            ? `${String(new Date(person.marriage_anniversary_date).getDate()).padStart(2, '0')}-${new Date(person.marriage_anniversary_date).toLocaleString('default', { month: 'long' })}`
            : "-";
          
          const row = [
            `"${(person.username || "-").replace(/"/g, '""')}"`,
            `"${(person.mobile || "-").replace(/"/g, '""')}"`,
            `"${anniversaryDate}"`,
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
        if (filterInput) filterText = `_anniversary_${filterInput}`;
        if (fromDate) filterText += `_from_${formatFullDateForAPI(fromDate)}`;
        if (toDate) filterText += `_to_${formatFullDateForAPI(toDate)}`;
        
        const filename = `associates_anniversary_list${filterText}_${new Date().toISOString().split('T')[0]}.csv`;
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
    fetchAnniversaryList(currentPage);
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleSearchClick = () => {
    setCurrentPage(1);
    fetchAnniversaryList(1);
  };

  const handleClearSearch = () => {
    setSearchDate(null);
    setFilterInput("");
    setFromDate(null);
    setToDate(null);
    setCurrentPage(1);
    fetchAnniversaryList(1);
  };

  const handleToggle = () => {
    setIsFilterActive(!isFilterActive);
  };

  const handleDateChange = (date) => {
    setSearchDate(date);
    if (date) {
      setFilterInput(formatDateForAPI(date));
    }
  };

  const handleManualInputChange = (e) => {
    const value = e.target.value;
    const cleaned = value.replace(/[^\d-]/g, '');
    if (cleaned.length === 2 && !cleaned.includes('-')) {
      setFilterInput(cleaned + '-');
    } else if (cleaned.length <= 5) {
      setFilterInput(cleaned);
    }
    if (value) {
      setSearchDate(null);
    }
  };
  
  const CustomDateInput = React.forwardRef(({ value, onClick }, ref) => (
    <div className="input-group">
      <input
        type="text"
        className="form-control"
        value={filterInput}
        onChange={handleManualInputChange}
        placeholder="DD-MM (e.g., 15-02)"
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

  if (loading) {
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
              <h3>Associates Anniversary Lists</h3>
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
            <div className="d-flex gap-3 mb-3 mt-2 flex-wrap align-items-end">
              {/* <div className="form-group" style={{ flex: "1", minWidth: "200px" }}>
                <label className="form-label">Anniversary Date (DD-MM)</label>
                <div className="input-group">
                  <DatePicker
                    selected={searchDate}
                    onChange={handleDateChange}
                    dateFormat="dd-MM"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    customInput={<CustomDateInput />}
                    placeholderText="DD-MM (e.g., 15-02)"
                    openToDate={new Date()}
                    yearDropdownItemNumber={30}
                    scrollableYearDropdown
                  />
                </div>
              </div> */}

              <div className="form-group" style={{ flex: "1", minWidth: "200px" }}>
                <label className="form-label">From Date</label>
                <DatePicker
                  selected={fromDate}
                  onChange={(date) => setFromDate(date)}
                  dateFormat="yyyy-MM-dd"
                  className="form-control"
                  placeholderText="Select from date"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                />
              </div>

              <div className="form-group" style={{ flex: "1", minWidth: "200px" }}>
                <label className="form-label">To Date</label>
                <DatePicker
                  selected={toDate}
                  onChange={(date) => setToDate(date)}
                  dateFormat="yyyy-MM-dd"
                  className="form-control"
                  placeholderText="Select to date"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                />
              </div>

              <div className="d-flex gap-2">
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
              </div>
            </div>
          )}

          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5>Total Records: {totalRecords}</h5>
              </div>
              {(filterInput || fromDate || toDate) && (
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
                  <th>Anniversary (MM-DD)</th>
                  <th>Parent Name</th>
                  <th>Parent Mobile</th>
                </tr>
              </thead>
              <tbody>
                {anniversarys.length > 0 ? (
                  anniversarys.map((person, index) => (
                    <tr key={index}>
                      <td>{(currentPage - 1) * perPage + index + 1}</td>
                      <td>{person.username || "-"}</td>
                      <td>{person.mobile || "-"}</td>
                      <td>
                        {person.marriage_anniversary_date
                          ? `${String(new Date(person.marriage_anniversary_date).getDate()).padStart(2, '0')}-${new Date(person.marriage_anniversary_date).toLocaleString('default', { month: 'long' })}`
                          : "-"}
                      </td>
                      <td>{person.parent_username || "-"}</td>
                      <td>{person.parent_mobile || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      {(filterInput || searchDate || fromDate || toDate) ?
                        `No anniversaries found for selected filters` :
                        "No anniversary records found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <div className="text-muted">
                Showing {(currentPage - 1) * perPage + 1} to{" "}
                {Math.min(currentPage * perPage, totalRecords)} of {totalRecords} anniversaries
              </div>
              <div>
                <Pagination>
                  <Pagination.Prev
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  />

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

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

export default AssociatesAnniversaryLists;