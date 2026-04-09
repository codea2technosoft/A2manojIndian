import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardArrowLeft
} from "react-icons/md";
import { getUserExposure } from "../Server/api";
import { Spinner, Button, Table } from "react-bootstrap";

const UserExposer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const passedData = location.state;
  const userId = passedData?.user_id;

  const [agentData, setAgentData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [limit, setLimit] = useState(10);

  // =====================================
  // 📌 Fetch USER EXPOSURE DATA
  // =====================================
  useEffect(() => {
    fetchAgentData();
  }, [currentPage]);

  const fetchAgentData = async () => {
    try {
      setLoading(true);

      const payload = {
        user_id: userId,
        page: currentPage,
        limit: limit
      };

      const res = await getUserExposure(payload);

      if (res.data.status_code === 1) {
        setAgentData(res.data.data || []);

        // IF API SUPPORTS PAGINATION
        if (res.data.pagination) {
          setTotalRecords(res.data.pagination.total_records);
          setTotalPages(res.data.pagination.total_pages);
        }
      }
    } catch (error) {
      console.log("Exposure API error:", error);
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // Pagination functions
  // =====================================
  const handleNext = () => currentPage < totalPages && setCurrentPage(prev => prev + 1);
  const handlePrev = () => currentPage > 1 && setCurrentPage(prev => prev - 1);

  const getPageNumbers = () => {
    const arr = [];
    for (let i = 1; i <= totalPages; i++) arr.push(i);
    return arr;
  };

  // Format Date
  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    }).format(new Date(date));
  };

  return (
    <div className="container-fluid">
      <div className="card">

        {/* Header */}
        <div className="card-header bg-color-black p-2 text-white d-flex justify-content-between">
          <h5 className="mb-0">Exposer Detail</h5>
          <button onClick={() => navigate(-1)} className="backbutton">
            Back
          </button>
        </div>

        {/* Body */}
        <div className="card-body">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
              <p className="mt-2">Loading data...</p>
            </div>
          ) : agentData.length === 0 ? (
            <div className="text-center py-5">
              <h5>No Data</h5>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <Table striped bordered hover className="mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th>#</th>
                      <th>Date</th>
                      <th>Match</th>
                      <th>Bet Type</th>
                      <th>Team</th>
                      <th>Yes/No</th>
                      <th>Odd</th>
                      <th>Stake</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agentData.map((row, index) => (
                      <tr key={row._id}>
                        <td>{index + 1}</td>
                        <td>{row.created_at ? formatDate(row.created_at) : "N/A"}</td>
                        <td>{row.event_name || "N/A"}</td>
                        <td className="text-capitalize">
                          {row.bet_type || "N/A"}
                        </td>

                        <td>{row.team || "N/A"}</td>

                        {/* <td>
                          <span
                            className={`badge ${
                              row.bet_on === "back" ? "bg-success" : "bg-danger"
                            }`}
                          >
                            {row.bet_on?.toUpperCase()}
                          </span>
                        </td> */}

                        <td>
                          <span
                            className={`badge ${row.bet_on === "back" ? "bg-success" : "bg-danger"
                              }`}
                          >
                            {row.bet_on === "back" ? "YES" : "NO"}
                          </span>
                        </td>


                        <td>                         
                         
                          {row.odd || 0}

                          </td>

                        <td>{row.stake || 0}</td>

                        <td className={row.total < 0 ? "text-danger" : "text-success"}>
                          {row.total}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-3">

                  <div>
                    Showing {(currentPage - 1) * limit + 1} to{" "}
                    {Math.min(currentPage * limit, totalRecords)} of {totalRecords} entries
                  </div>

                  <div className="d-flex gap-2">
                    <Button disabled={currentPage === 1} onClick={handlePrev}>
                      <MdOutlineKeyboardArrowLeft />
                    </Button>

                    {getPageNumbers().map((page) => (
                      <Button
                        key={page}
                        variant={page === currentPage ? "primary" : "light"}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    ))}

                    <Button disabled={currentPage === totalPages} onClick={handleNext}>
                      <MdOutlineKeyboardArrowRight />
                    </Button>
                  </div>

                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserExposer;
