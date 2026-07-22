import React, { useEffect, useState } from "react";
import moment from "moment";
import { MdFilterListAlt } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { getAllDepositRequests } from "../../Server/api";

const DepositeReject = ({ userId }) => {
  const [depositList, setDepositList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [fillter, setFillter] = useState(false);
  const [filters, setFilters] = useState({
    userId: "",
    startDate: "",
    endDate: ""
  });

  const limit = 10;
  const navigate = useNavigate();

  const ucWords = (str) => {
    if (!str || typeof str !== "string") return "";
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  useEffect(() => {
    fetchDepositList(currentPage);
  }, [currentPage, userId]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleClearFilter = () => {
    setFilters({
      userId: "",
      startDate: "",
      endDate: ""
    });
    setCurrentPage(1);
    setTimeout(() => fetchDepositList(), 100);
  };

  const handleFilter = () => {
    setCurrentPage(1);
    fetchDepositList();
  };

  const fillterdata = () => {
    setFillter(prev => !prev);
  };

  const fetchDepositList = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        status: 'rejected',
        userId: filters.userId || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
      };

      const result = await getAllDepositRequests(params);

      if (result.data.success) {
        const rejectedList = (result.data.data || []).filter(
          (item) => item.status?.toLowerCase() === "rejected"
        );
        setDepositList(rejectedList);
        setTotalPages(result.pagination?.totalPages || 1);
      } else {
        setDepositList([]);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      setDepositList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleActionLedger = (user_id) => {
    navigate(`/ledger/${user_id}`);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="mt-3">
      <div className="card">
        <div className="card-header bg-primary-yellow">
          <div className="d-flex align-items-center justify-content-between">
            <h3 className="card-title text-white">Deposit Reject List</h3>
            <div className="buttonlist">
              <div className="fillterbutton" onClick={fillterdata}>
                <MdFilterListAlt /> Filter
              </div>
            </div>
          </div>
        </div>

        <div className="card-body">
          {fillter && (
            <div className="row mb-3">
              <div className="col-md-12">
                <div className="form-design-fillter gap-2 d-flex justify-content-between align-items-end">
                  <div className="form_latest_design w-100">
                    <div className="label">
                      <label htmlFor="">User ID</label>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      value={filters.userId}
                      onChange={(e) => handleFilterChange('userId', e.target.value)}
                      placeholder="Enter User ID"
                    />
                  </div>

                  <div className="form_latest_design w-100">
                    <div className="label">
                      <label htmlFor="">Start Date</label>
                    </div>
                    <input
                      type="date"
                      className="form-control"
                      value={filters.startDate}
                      onChange={(e) => handleFilterChange('startDate', e.target.value)}
                    />
                  </div>

                  <div className="form_latest_design w-100">
                    <div className="label">
                      <label htmlFor="">End Date</label>
                    </div>
                    <input
                      type="date"
                      className="form-control"
                      value={filters.endDate}
                      onChange={(e) => handleFilterChange('endDate', e.target.value)}
                    />
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      className="refreshbutton"
                      onClick={handleFilter}
                    >
                      Apply Filter
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={handleClearFilter}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead className="table-light">
                    <tr>
                      <th>Sr.No</th>
                      {/* <th>User Name</th>
                      <th>Email</th> */}
                      <th>Mobile</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Rejection Reason</th>
                      <th>Date & Time</th>
                      {/* <th>Action</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {depositList.length > 0 ? (
                      depositList.map((item, index) => (
                        <tr key={item._id}>
                          <td>{(currentPage - 1) * limit + index + 1}</td>
                          {/* <td>{ucWords(item.userId?.username)}</td>
                          <td>{item.userId?.email}</td> */}
                          <td>{item.userId?.mobile}</td>
                          <td>₹ {item.amount}</td>
                          <td>
                            <span className="badge bg-danger">
                              {String(item.status || "").toUpperCase()}

                            </span>
                          </td>
                          <td>
                            {item.remark || item.notes || "-"}
                          </td>
                          <td>
                            {moment(item.createdAt).format("DD-MM-YYYY hh:mm A")}
                          </td>
                          {/* <td>
                            <button
                              className="btn btn-sm btn-info"
                              onClick={() => handleActionLedger(item.userId?._id)}
                            >
                              Ledger
                            </button>
                          </td> */}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="text-center">
                          No rejected deposits found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {depositList.length > 0 && totalPages > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <button
                    className="btn btn-outline-primary"
                    disabled={currentPage === 1}
                    onClick={handlePrev}
                  >
                    Previous
                  </button>
                  <span className="text-muted">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    className="btn btn-outline-primary"
                    disabled={currentPage === totalPages}
                    onClick={handleNext}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepositeReject;