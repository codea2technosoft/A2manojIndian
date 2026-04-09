import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { getAccountOperationAll } from "../../Server/api";
import { MdOutlineKeyboardArrowRight, MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { FiSearch } from "react-icons/fi"; 
import "react-toastify/dist/ReactToastify.css";
import {
  Table,
  Card,
  Spinner,
  Form,
  Badge
} from "react-bootstrap";

const AllAccountOperation = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [originalData, setOriginalData] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 100;

  const toastShownRef = useRef(false);

  useEffect(() => {
    fetchOperationData();
  }, []);

  // ================= API CALL =================
  const fetchOperationData = async () => {
    try {
      setLoading(true);
      const res = await getAccountOperationAll({
        admin_id: id,
      });
      if (res.data.success) {
        const formatted = res.data.data.map((item, index) => {
          const formatDate = (date) => {
            if (!date) return "N/A";
            const d = new Date(date);
            return `${d.getDate().toString().padStart(2, "0")}-${(
              d.getMonth() + 1
            )
              .toString()
              .padStart(2, "0")}-${d.getFullYear()} ${d
              .getHours()
              .toString()
              .padStart(2, "0")}:${d
              .getMinutes()
              .toString()
              .padStart(2, "0")}`;
          };
          const badgeType = (op = "") => {
            op = op.toLowerCase();
            if (op.includes("block")) return "danger";
            if (op.includes("unblock")) return "success";
            if (op.includes("update")) return "warning";
            if (op.includes("create")) return "info";
            if (op.includes("delete")) return "dark";
            return "secondary";
          };
          return {
            id: item._id || index,
            date: formatDate(item.created_at),
            operation: item.operation || "-",
            description: item.description || "-",
            operationType: badgeType(item.operation),
          };
        });
        // setFilteredData(formatted);
            setOriginalData(formatted);
        setFilteredData(formatted);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };
  const handleSearch = () => {
    const trimmed = searchInput.trim();
    setSearchTerm(trimmed);
    setCurrentPage(1);
    
    if (trimmed === "") {
      setFilteredData(originalData);
    } else {
      const filtered = originalData.filter(
        (item) =>
          item.operation.toLowerCase().includes(trimmed.toLowerCase()) ||
          item.description.toLowerCase().includes(trimmed.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };
  const handleClearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
    setCurrentPage(1);
    setFilteredData(originalData);  // ✅ originalData se set karo
  };
 const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };


  // ================= PAGINATION =================
  const startIndex = (currentPage - 1) * limit;
  const paginatedData = filteredData.slice(startIndex, startIndex + limit);
  const totalPages = Math.ceil(filteredData.length / limit);

  return (
    <>
      <ToastContainer position="top-right" autoClose={800} theme="colored" />
      <div className="container-fluid">
        <div className="card">
          <div className="card-header bg-dark flex-wrap-mobile text-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Account Operations</h5>
            <div className="d-flex gap-2">
              {/* <div className="input-group" style={{ width: "300px" }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by operation or description..."
                  value={searchInput}
                  onChange={handleSearchInputChange}
                  onKeyPress={handleSearchKeyPress}
                />
                <button
                  className="btn btn-outline-primary"
                  type="button"
                  onClick={handleSearch}
                >
                  <FiSearch />
                </button>
                {searchTerm && (
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={handleClearSearch}
                  >
                    Clear
                  </button>
                )}
              </div> */}
              <button onClick={() => navigate(-1)} className="backbutton">
                Back
              </button>
            </div>
          </div>
          {/* BODY */}
          <div className="card-body">
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" />
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead className="table-dark">
                    <tr>
                      <th>DATE & TIME</th>
                      <th>OPERATION</th>
                      <th>DESCRIPTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="text-center">
                          No Data Found
                        </td>
                      </tr>
                    ) : (
                      paginatedData.map((item) => (
                        <tr key={item.id}>
                          <td>{item.date}</td>
                          <td>
                            {/* <Badge bg={item.operationType}> */}
                              {item.operation}
                            {/* </Badge> */}
                          </td>
                          <td>{item.description}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* PAGINATION */}
          {/* {totalPages > 1 && (
            <div className="d-flex justify-content-end gap-2 p-3">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                <MdOutlineKeyboardArrowLeft />
              </button>

              <span>
                {currentPage} / {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                <MdOutlineKeyboardArrowRight />
              </button>
            </div>
          )} */}
{/* PAGINATION WITH UI CLASSES */}
{totalPages > 1 && (
  <div className="d-flex justify-content-between align-items-center mt-4">

    {/* Showing Entries */}
    <div className="sohwingallentries d-flex align-items-center gap-3">
      Showing {startIndex + 1} to{" "}
      {Math.min(startIndex + limit, filteredData.length)} of{" "}
      {filteredData.length} entries
    </div>
    {/* Pagination Buttons */}
    <div className="paginationall d-flex align-items-center gap-2">

      {/* Prev */}
      <button
        className="btn btn-sm btn-outline-primary"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((p) => p - 1)}
        title="Previous Page"
      >
        <MdOutlineKeyboardArrowLeft />
      </button>
      {/* Page Numbers */}
      <div className="d-flex gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={`btn  ${
              currentPage === page ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next */}
      <button
        className="btn btn-sm btn-outline-primary"
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage((p) => p + 1)}
        title="Next Page"
      >
        <MdOutlineKeyboardArrowRight />
      </button>

    </div>
  </div>
)}


        </div>
      </div>
    </>
  );
};

export default AllAccountOperation;
