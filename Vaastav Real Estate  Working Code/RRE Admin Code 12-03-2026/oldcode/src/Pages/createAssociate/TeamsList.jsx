import React, { useEffect, useState, useRef } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { Modal, Button, Form, Table, Pagination, Container, Row, Col } from "react-bootstrap";
import { FaEye, FaEdit } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { BsThreeDots } from "react-icons/bs";
import { MdAirplanemodeInactive, MdAirplanemodeActive, MdOutlineUpcoming, MdUpcoming } from "react-icons/md";
import { MdFilterAlt } from "react-icons/md";
import { MdFilterAltOff } from "react-icons/md";

const API_URL = process.env.REACT_APP_API_URL;

function TeamsList() {

  const [associates, setAssociates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchMobile, setSearchMobile] = useState("");
  const [searchParentID, setSearchParentID] = useState("");
  const [searchLevel, setSearchLevel] = useState("");
  const [searchDOJ, setSearchDOJ] = useState("");
  const searchTimeoutRef = useRef(null);
  const { mobile } = useParams();
  const [searchParams] = useSearchParams();
  const name = searchParams.get('name');

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
  const [isFilterActive, setIsFilterActive] = useState(false);
  const handleToggle = () => {
    setIsFilterActive(!isFilterActive);
  };

  const fetchAssociates = async (page = 1, mobile = "", parent_mobile = "", level = "", parent_id = "", date = "") => {
    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) {
        showCustomMessageModal("Authentication Error", "Authentication token not found. Please log in.", "error");
        throw new Error("Authentication token not found. Please log in.");
      }

      const pathParts = window.location.pathname.split('/');
      const urlMobileNumber = pathParts[pathParts.length - 1];
      const effectiveParentMobile = parent_mobile || urlMobileNumber;

      const url = new URL(`${API_URL}/Associate-list-lavel11`);
      url.searchParams.append('page', page);
      url.searchParams.append('mobile', searchMobile);
      url.searchParams.append('level', searchLevel);
      url.searchParams.append('date', searchDOJ);
      url.searchParams.append('parent_id', searchParentID);
      url.searchParams.append('limit', 10);
      if (effectiveParentMobile) url.searchParams.append('parent_mobile', effectiveParentMobile);
      const response = await fetch(url.toString(), {
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
        showCustomMessageModal("Error", errorData.message || "Failed to fetch associates.", "error");
        throw new Error(errorData.message || "Failed to fetch associates.");
      }

      const data = await response.json();
      setAssociates(data.data || []);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(page);

    } catch (err) {
      console.error("Fetch associates error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssociates(currentPage, searchMobile, "", searchLevel, searchParentID, searchDOJ);
  }, [currentPage, searchMobile, searchParentID, searchLevel, searchDOJ]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


  const handleSearchMobileChange = (e) => {
    const value = e.target.value;
    setSearchMobile(value);
    debounceSearch();
  };

  const handleSearchParentIDChange = (e) => {
    const value = e.target.value;
    setSearchParentID(value);
    debounceSearch();
  };

  const handleSearchLevelChange = (e) => {
    const value = e.target.value;
    setSearchLevel(value);
    debounceSearch();
  };

  const handleSearchDOJChange = (e) => {
    const value = e.target.value;
    const formattedValue = value ? formatDateToDDMMYYYY(value) : "";
    setSearchDOJ(formattedValue);
    debounceSearch();
  };


  const formatDateToDDMMYYYY = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  };


  const formatDateToYYYYMMDD = (dateString) => {
    if (!dateString) return "";
    const [day, month, year] = dateString.split('-');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  const debounceSearch = () => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      setCurrentPage(1);
    }, 500);
  };


  return (

    <div className="card mt-2">
      <div className="card-header">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div className="titlepage">
            <h3>View Team-({mobile})-{name}</h3>
          </div>

         <div className="d-none d-md-block">
           <div className="d-flex gap-2">
            <div className="form-group" id="searchMobile">
              <input
                type="text"
                placeholder="Search Mobile"
                value={searchMobile}
                onChange={handleSearchMobileChange}
                className="form-control"
              />
            </div>

            <div className="form-group" id="searchParentID">
              <input
                type="text"
                placeholder="Parent ID"
                value={searchParentID}
                onChange={handleSearchParentIDChange}
                className="form-control"
              />
            </div>

            <div className="form-group" id="searchLevel">
              <input
                type="text"
                placeholder="Level"
                value={searchLevel}
                onChange={handleSearchLevelChange}
                className="form-control"
              />
            </div>

            <div className="form-group" id="searchDOJ">
              <input
                type="date"
                placeholder="Date of Joining"
                value={formatDateToYYYYMMDD(searchDOJ)}
                onChange={handleSearchDOJChange}
                className="form-control"
              />
            </div>
          </div>
         </div>

          {/* <div className="form-group d-flex align-items-center" id="searchDOJ">
            <input
              type="date"
              placeholder="Date of Joining"
              value={formatDateToYYYYMMDD(searchDOJ)}
              onChange={handleSearchDOJChange}
              className="form-control me-2" // margin-right for spacing
            />
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSearch} // function to trigger search
            >
              Search
            </button>
          </div> */}


          <div class="d-block d-md-none">
            <button
              className={`filter-toggle-btn ${isFilterActive ? "active" : ""}`}
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
      <div className="card-body">
        {isFilterActive && (
          <div className="d-flex gap-2 mb-3 mt-2 flex-wrap-mobile">
            <div className="form-group w-100" id="searchMobile">
              <input
                type="text"
                placeholder="Search Mobile"
                value={searchMobile}
                onChange={handleSearchMobileChange}
                className="form-control"
              />
            </div>

            <div className="form-group w-100" id="searchParentID">
              <input
                type="text"
                placeholder="Parent ID"
                value={searchParentID}
                onChange={handleSearchParentIDChange}
                className="form-control"
              />
            </div>

            <div className="form-group w-100" id="searchLevel">
              <input
                type="text"
                placeholder="Level"
                value={searchLevel}
                onChange={handleSearchLevelChange}
                className="form-control"
              />
            </div>

            <div className="form-group w-100" id="searchDOJ">
              <input
                type="date"
                placeholder="Date of Joining"
                value={formatDateToYYYYMMDD(searchDOJ)}
                onChange={handleSearchDOJChange}
                className="form-control"
              />
            </div>

          </div>
        )}
        <div className="table-responsive">
          <Table bordered>
            <thead className="bg-primary text-white">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Mobile</th>
                <th>Level</th>
                <th>Parent Name</th>
                <th>Parent ID</th>
                <th>User Type</th>
                <th>KYC Status</th>
                <th>Date Of Joining</th>
              </tr>
            </thead>
            <tbody>
              {associates.length > 0 ? (
                associates.map((associate, i) => (
                  <tr key={associate.id}>
                    <td>{i + 1}</td>
                    <td>{associate.username}</td>
                    <td>{associate.mobile}</td>
                    <td>{associate.level}</td>
                    <td>{associate.parent_name}</td>
                    <td>{associate.parent_id}</td>
                    <td>{associate.user_type}</td>
                    <td>
                      <span
                        className={`badge ${associate.status === "active" ? "bg-success" : "bg-danger"
                          }`}
                      >
                        {associate.kyc}
                      </span>
                    </td>
                    <td>{associate.date}</td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No associates found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        <div className="d-flex justify-content-end">
          <Pagination>
            <Pagination.Prev
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />

            <Pagination.Item
              active={1 === currentPage}
              onClick={() => handlePageChange(1)}
            >
              1
            </Pagination.Item>

            {currentPage > 3 && <Pagination.Ellipsis />}

            {currentPage > 2 && (
              <Pagination.Item
                onClick={() => handlePageChange(currentPage - 1)}
              >
                {currentPage - 1}
              </Pagination.Item>
            )}

            {currentPage !== 1 && currentPage !== totalPages && (
              <Pagination.Item active>
                {currentPage}
              </Pagination.Item>
            )}


            {currentPage < totalPages - 1 && (
              <Pagination.Item
                onClick={() => handlePageChange(currentPage + 1)}
              >
                {currentPage + 1}
              </Pagination.Item>
            )}


            {currentPage < totalPages - 2 && <Pagination.Ellipsis />}


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

      </div>
    </div>

  )
}
export default TeamsList;