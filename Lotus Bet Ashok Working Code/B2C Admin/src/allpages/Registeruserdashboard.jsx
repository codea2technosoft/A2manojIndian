import React, { useState, useEffect } from "react";
import { getRegistrationStats } from "../Server/api";
import { MdOutlineKeyboardArrowRight, MdOutlineKeyboardArrowLeft } from "react-icons/md";

export default function Registeruserdashboard() {
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [pendingData, setPendingData] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 1
  });

  const [filters, setFilters] = useState({
    search: "",
    from_date: "",
    to_date: ""
  });

  // const fetchPendingRegistrations = async (page = 1) => {
  //   setLoading(true);
  //   try {
  //     const params = {
  //       page: page,
  //       limit: pagination.limit
  //     };

  //     if (filters.search) params.search = filters.search;
  //     if (filters.from_date) params.from_date = filters.from_date;
  //     if (filters.to_date) params.to_date = filters.to_date;

  //     const response = await getRegistrationStats(params);

  //     if (response?.data?.success) {
  //       const data = response.data;

  //       if (data.pending_registrations) {
  //         setPendingData(data.pending_registrations.data || []);

  //         if (data.pending_registrations.pagination) {
  //           setPagination({
  //             page: data.pending_registrations.pagination.page || 1,
  //             limit: data.pending_registrations.pagination.limit || 50,
  //             total: data.pending_registrations.pagination.total || 0,
  //             totalPages: data.pending_registrations.pagination.totalPages || 1
  //           });
  //         }
  //       }
  //     }
  //   } catch (err) {
  //     console.error("Error fetching pending registrations:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Export to CSV
  const fetchPendingRegistrations = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page: page,
        limit: pagination.limit
      };

      if (filters.search) params.search = filters.search;

      // ✅ Sirf tab bhejo jab dates ho
      if (filters.from_date && filters.from_date.trim() !== "") {
        params.from_date = filters.from_date;
      }
      if (filters.to_date && filters.to_date.trim() !== "") {
        params.to_date = filters.to_date;
      }

      const response = await getRegistrationStats(params);
      // ... rest of your code
    } catch (err) {
      console.error("Error fetching pending registrations:", err);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = async () => {
    setExportLoading(true);
    try {
      // Fetch all data for export (without pagination limit)
      const params = {
        page: 1,
        limit: 1000 // Fetch all pending records
      };

      if (filters.search) params.search = filters.search;
      if (filters.from_date) params.from_date = filters.from_date;
      if (filters.to_date) params.to_date = filters.to_date;

      const response = await getRegistrationStats(params);

      if (response?.data?.success) {
        const data = response.data.pending_registrations?.data || [];

        if (data.length === 0) {
          alert("No data to export!");
          setExportLoading(false);
          return;
        }

        // CSV headers
        const headers = [
          "Sr No.",
          "Mobile Number",
          "Date",
        ];

        // Prepare CSV rows
        const rows = data.map((item, index) => [
          item.sr_no || index + 1,
          item.mobile_number || "",
          item.created_at?.split("T")[0],
        ]);

        // Combine headers and rows
        const csvContent = [
          headers.join(","),
          ...rows.map(row => row.join(","))
        ].join("\n");

        // Create blob and download
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `pending_users_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error("Error exporting to CSV:", err);
      alert("Failed to export data!");
    } finally {
      setExportLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingRegistrations(1);
  }, []);

  const handleSearch = () => {
    fetchPendingRegistrations(1);
  };

  // const handleReset = () => {
  //   setFilters({ search: "", from_date: "", to_date: "" });
  //   fetchPendingRegistrations(1);
  // };
  const handleReset = () => {
    setFilters({
      search: "",
      from_date: "",  // ✅ Empty
      to_date: ""     // ✅ Empty
    });
    fetchPendingRegistrations(1);
  };
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchPendingRegistrations(newPage);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short"
    });
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 3;
    if (pagination.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= pagination.totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let start = Math.max(1, pagination.page - 1);
      let end = Math.min(pagination.totalPages, start + 2);
      if (end - start + 1 < maxVisiblePages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
    }
    return pageNumbers;
  };

  return (
    <div className="allcommon">
      <section className="main-inner-outer py-4">
        <div className="db-sec">
          <h2 className="common-heading">Pending Users</h2>
        </div>
        <form className="mb-3 d-flex align-items-center" onSubmit={(e) => e.preventDefault()}>
          <input
            placeholder="search"
            type="text"
            className="w-25 form-control"
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            style={{ marginRight: 15 }}
          />
          <div
            className="bet-sec bet-period d-flex align-items-center"
            style={{ marginRight: 15, marginLeft: 15 }}
          >
            <label className="form-label" style={{ marginRight: 10 }}>
              From
            </label>
            <input
              type="date"
              className="form-control"
              value={filters.from_date}
              onChange={(e) => setFilters(prev => ({ ...prev, from_date: e.target.value }))}
            />
          </div>

          <div
            className="bet-sec bet-period d-flex align-items-center"
            style={{ marginRight: 15, marginLeft: 15 }}
          >
            <label className="form-label" style={{ marginRight: 10 }}>
              To
            </label>
            <input
              type="date"
              className="form-control"
              value={filters.to_date}
              onChange={(e) => setFilters(prev => ({ ...prev, to_date: e.target.value }))}
            />
          </div>
          <button
            type="button"
            className="theme_dark_btn btn btn-primary"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Search'}
          </button>
          {/* <button
            type="button"
            className="theme_light_btn btn btn-primary ms-2"
            onClick={handleReset}
          >
            Reset
          </button> */}

          <button
            type="button"
            className="theme_light_btn btn btn-primary ms-2 d-flex align-items-center"
            onClick={exportToCSV}
            disabled={exportLoading}
            style={{
              cursor: exportLoading ? "not-allowed" : "pointer"
            }}
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth={0}
              viewBox="0 0 384 512"
              height={15}
              width={15}
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginRight: 5 }}
            >
              <path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM155.7 250.2L192 302.1l36.3-51.9c7.6-10.9 22.6-13.5 33.4-5.9s13.5 22.6 5.9 33.4L221.3 344l46.4 66.2c7.6 10.9 5 25.8-5.9 33.4s-25.8 5-33.4-5.9L192 385.8l-36.3 51.9c-7.6 10.9-22.6 13.5-33.4 5.9s-13.5-22.6-5.9-33.4L162.7 344l-46.4-66.2c-7.6-10.9-5-25.8 5.9-33.4s25.8-5 33.4 5.9z" />
            </svg>
            {exportLoading ? 'Exporting...' : 'Export'}
          </button>
        </form>
        <div className="inner-wrapper">
          <div className="common-container">
            <div className="account-table batting-table w-100">
              <div className="responsive">
                {loading ? (
                  <div className="text-center py-4">Loading...</div>
                ) : (
                  <>
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col" style={{ width: "5%" }}>Sr No.</th>
                          <th scope="col">Mobile Number</th>
                          <th scope="col">Username</th>
                          <th scope="col">User ID</th>
                          <th scope="col">Agent ID</th>
                          <th scope="col">Date</th>
                          <th scope="col">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingData && pendingData.length > 0 ? (
                          pendingData.map((item, index) => (
                            <tr key={item.sr_no || item.user_id || index}>
                              <td>{item.sr_no || ((pagination.page - 1) * pagination.limit) + index + 1}</td>
                              <td>{item.mobile_number}</td>
                              <td>{item.username || '-'}</td>
                              <td>{item.user_id || '-'}</td>
                              <td>{item.agent_id || '-'}</td>
                              <td>{formatDate(item.created_at)}</td>
                              <td className="text-center">
                                <span className="d-inline badge bg-success">{item.status || 'Active'}</span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="7" className="text-center py-4">No records found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>

                    {pagination.totalPages > 1 && (
                      <div className="d-flex justify-content-between align-items-center mt-4">
                        <div className="sohwingallentries">
                          Showing {((pagination.page - 1) * pagination.limit) + 1} to{" "}
                          {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
                        </div>
                        <div className="paginationall d-flex align-items-center gap-1">
                          <button
                            disabled={pagination.page === 1}
                            onClick={() => handlePageChange(pagination.page - 1)}
                            className="btn btn-sm btn-outline-secondary"
                          >
                            <MdOutlineKeyboardArrowLeft />
                          </button>
                          {getPageNumbers().map((page) => (
                            <button
                              key={page}
                              className={`btn btn-sm ${pagination.page === page ? 'btn-primary' : 'btn-outline-secondary'}`}
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </button>
                          ))}
                          <button
                            disabled={pagination.page === pagination.totalPages}
                            onClick={() => handlePageChange(pagination.page + 1)}
                            className="btn btn-sm btn-outline-secondary"
                          >
                            <MdOutlineKeyboardArrowRight />
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}