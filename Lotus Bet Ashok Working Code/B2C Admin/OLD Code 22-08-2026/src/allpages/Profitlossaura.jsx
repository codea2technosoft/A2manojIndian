import React, { useState, useEffect } from "react";
import Select from "react-select";
import { getProfitLossAura } from "../../src/Server/api";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router";

function Profitlossaura() {
  const [activeTab, setActiveTab] = useState("Casino");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState([]);
  const [totals, setTotals] = useState(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 50,
    total_records: 0,
    total_pages: 1,
  });

  const [periodFrom, setPeriodFrom] = useState({
    date: "",
    time: "",
  });
  const [periodTo, setPeriodTo] = useState({
    date: "",
    time: "",
  });
  const [selectedLast, setSelectedLast] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});

  const userOptions = [{ value: "no options", label: "no options" }];

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: "38px",
      borderRadius: "4px",
      border: "1px solid #ced4da",
      boxShadow: state.isFocused ? "0 0 0 0.2rem rgba(13,110,253,0.25)" : null,
      "&:hover": {
        borderColor: "#86b7fe",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#0d6efd"
        : state.isFocused
          ? "#e9ecef"
          : null,
      color: state.isSelected ? "white" : "#212529",
      cursor: "pointer",
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
  };

  const getGroupBy = () => {
    switch (activeTab) {
      case "Casino":
        return "agent";
      case "CasinoGamePnL":
        return "game";
      case "PlayerPnL":
        return "user";
      default:
        return "agent";
    }
  };

  const fetchReportData = async (customPayload = null) => {
    setLoading(true);
    setError(null);

    try {
      const groupBy = getGroupBy();
      const payload = customPayload || {
        from_date: periodFrom.date,
        to_date: periodTo.date,
        group_by: groupBy,
        last: selectedLast === "all" ? undefined : parseInt(selectedLast),
        user_id: selectedUser?.value || undefined,
        page: pagination.current_page || 1,
        per_page: pagination.per_page || 50,
      };

      console.log("📤 Sending payload:", payload);

      const response = await getProfitLossAura(payload);

      console.log("📥 Full API Response:", response);

      if (!response) {
        throw new Error("No response received from server");
      }

      if (response.status === 200 || response.status === 1) {
        const actualData = response.data?.data || [];
        setReportData(actualData);

        if (response.data?.total) {
          setTotals(response.data.total);
        }

        // ✅ Set Pagination from server response
        if (response.data?.pagination) {
          setPagination({
            current_page: response.data.pagination.current_page || 1,
            per_page: response.data.pagination.per_page || 50,
            total_records: response.data.pagination.total_records || 0,
            total_pages: response.data.pagination.total_pages || 1,
          });
        }

        console.log("✅ Data set:", actualData);
      } else {
        setError(response.message || "Failed to fetch data");
        setReportData([]);
        setTotals(null);
        setPagination({
          current_page: 1,
          per_page: 50,
          total_records: 0,
          total_pages: 1,
        });
      }
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "Failed to fetch data. Please try again.");
      setReportData([]);
      setTotals(null);
      setPagination({
        current_page: 1,
        per_page: 50,
        total_records: 0,
        total_pages: 1,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setExpandedRows({});
    // Reset pagination on tab change
    setPagination({
      current_page: 1,
      per_page: 50,
      total_records: 0,
      total_pages: 1,
    });
  };

  const handlePeriodFromDateChange = (e) => {
    setPeriodFrom({ ...periodFrom, date: e.target.value });
  };

  const handlePeriodFromTimeChange = (e) => {
    setPeriodFrom({ ...periodFrom, time: e.target.value });
  };

  const handlePeriodToDateChange = (e) => {
    setPeriodTo({ ...periodTo, date: e.target.value });
  };

  const handlePeriodToTimeChange = (e) => {
    setPeriodTo({ ...periodTo, time: e.target.value });
  };

  const handleLastChange = (e) => {
    setSelectedLast(e.target.value);
  };

  const handleUserChange = (selectedOption) => {
    setSelectedUser(selectedOption);
  };

  // ✅ Search Function
  const handleSearch = () => {
    const payload = {
      from_date: periodFrom.date,
      to_date: periodTo.date,
      group_by: getGroupBy(),
      last: selectedLast === "all" ? undefined : parseInt(selectedLast),
      user_id: selectedUser?.value || undefined,
      page: 1,
      per_page: pagination.per_page || 50,
    };
    // Reset pagination on search
    setPagination((prev) => ({ ...prev, current_page: 1 }));
    fetchReportData(payload);
  };

  // ✅ Page Change Handler
  const handlePageChange = (page) => {
    if (page < 1 || page > pagination?.total_pages) return;

    const payload = {
      from_date: periodFrom.date,
      to_date: periodTo.date,
      group_by: getGroupBy(),
      last: selectedLast === "all" ? undefined : parseInt(selectedLast),
      user_id: selectedUser?.value || undefined,
      page: page,
      per_page: pagination?.per_page || 50,
    };
    setPagination((prev) => ({ ...prev, current_page: page }));
    fetchReportData(payload);
  };

  const handleJustForToday = () => {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    const payload = {
      from_date: todayStr,
      to_date: todayStr,
      group_by: getGroupBy(),
      last: selectedLast === "all" ? undefined : parseInt(selectedLast),
      user_id: selectedUser?.value || undefined,
      page: 1,
      per_page: pagination.per_page || 50,
    };
    setPagination((prev) => ({ ...prev, current_page: 1 }));
    fetchReportData(payload);
  };

  const handleFromYesterday = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];
    const payload = {
      from_date: yesterdayStr,
      to_date: yesterdayStr,
      group_by: getGroupBy(),
      last: selectedLast === "all" ? undefined : parseInt(selectedLast),
      user_id: selectedUser?.value || undefined,
      page: 1,
      per_page: pagination.per_page || 50,
    };
    setPagination((prev) => ({ ...prev, current_page: 1 }));
    fetchReportData(payload);
  };

  const handleGetPL = () => {
    const payload = {
      from_date: periodFrom.date,
      to_date: periodTo.date,
      group_by: getGroupBy(),
      last: selectedLast === "all" ? undefined : parseInt(selectedLast),
      user_id: selectedUser?.value || undefined,
      page: 1,
      per_page: pagination.per_page || 50,
    };
    setPagination((prev) => ({ ...prev, current_page: 1 }));
    fetchReportData(payload);
  };

  const toggleExpand = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const formatNumber = (num) => {
    if (num === undefined || num === null) return "0.00";
    const formatted = Number(num).toFixed(2);
    if (num < 0) {
      return `(${Math.abs(num)
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")})`;
    }
    return formatted.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const getColorClass = (num) => {
    if (num === undefined || num === null) return "";
    return num < 0 ? "text-danger" : "text-success";
  };

  const renderFilterForm = () => (
    <form
      className="bet_status bet-list-live"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="bet_outer">
        <div className="mb-lg-0 mb-3 col-lg-3 col-sm-3">
          <div className="bet-sec bet-period">
            <label className="me-2 form-label" style={{ fontWeight: 600 }}>
              Period From
            </label>
            <div className="form-group">
              <input
                type="date"
                className="form-control"
                value={periodFrom.date}
                onChange={handlePeriodFromDateChange}
              />
              <input
                placeholder="00:00"
                type="time"
                className="small_form_control form-control"
                value={periodFrom.time}
                onChange={handlePeriodFromTimeChange}
                style={{ width: 80 }}
              />
            </div>
          </div>
        </div>

        <div className="mb-lg-0 mb-3 col-lg-3 col-sm-3">
          <div className="bet-sec bet-period">
            <label className="me-2 form-label" style={{ fontWeight: 600 }}>
              Period To
            </label>
            <div className="form-group">
              <input
                type="date"
                className="form-control"
                value={periodTo.date}
                onChange={handlePeriodToDateChange}
              />
              <input
                placeholder="00:00"
                type="time"
                className="small_form_control form-control"
                value={periodTo.time}
                onChange={handlePeriodToTimeChange}
                style={{ width: 80 }}
              />
            </div>
          </div>
        </div>

        <div className="bet-sec bet-period">
          <label className="form-label" style={{ fontWeight: 600 }}>
            Last
          </label>
          <select
            aria-label="Default select example"
            className="small_select form-select"
            value={selectedLast}
            onChange={handleLastChange}
          >
            <option value="all">All</option>
            <option value="25">25 Txn</option>
            <option value="50">50 Txn</option>
            <option value="100">100 Txn</option>
            <option value="200">200 Txn</option>
          </select>
        </div>

        <div className="mb-lg-0 mb-3 col-lg-3 col-sm-3">
          <div className="d-flex align-items-center">
            <label
              className="form-label"
              style={{ fontWeight: 600, marginRight: 5 }}
            >
              User List
            </label>
            <div style={{ minWidth: "200px" }}>
              <Select
                value={selectedUser}
                onChange={handleUserChange}
                options={userOptions}
                styles={customStyles}
                placeholder="Select User"
                isClearable
                isSearchable
                className="basic-single"
                classNamePrefix="select"
              />
            </div>
            <button
              type="button"
              className="btn btn-primary ms-2"
              onClick={handleSearch}
              style={{
                padding: "6px 15px",
                borderRadius: "4px",
                fontSize: "14px",
                whiteSpace: "nowrap",
              }}
              disabled={loading}
            >
              {loading ? "Loading..." : "Search"}
            </button>
          </div>
        </div>
      </div>

      <div className="history-btn mt-3">
        <ul className="list-unstyled mb-0">
          <li>
            <button
              type="button"
              className="me-0 theme_light_btn btn btn-primary"
              onClick={handleJustForToday}
            >
              Just For Today
            </button>
          </li>
          <li>
            <button
              type="button"
              className="me-0 theme_light_btn btn btn-primary"
              onClick={handleFromYesterday}
            >
              From Yesterday
            </button>
          </li>
          <li>
            <button
              type="button"
              className="theme_light_btn theme_dark_btn btn btn-primary"
              onClick={handleGetPL}
              disabled={loading}
            >
              {loading ? "Loading..." : "Get P/L"}
            </button>
          </li>
        </ul>
      </div>
    </form>
  );

  const renderCasinoTable = () => (
    <div className="account-table">
      <div className="responsive">
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">UID</th>
                  <th scope="col">Player P/L</th>
                  {/* <th scope="col">DownLine P/L</th>
                                    <th scope="col">Agent Comm. P/L</th>
                                    <th scope="col">Upline P/L</th> */}
                </tr>
              </thead>
              <tbody>
                {reportData && reportData.length > 0 ? (
                  <>
                    {reportData.map((item) => (
                      <React.Fragment key={item.uid || item.id}>
                        <tr
                          id={item.uid || item.id}
                          style={{ display: "table-row" }}
                        >
                          <td className="text-start">
                            {item.children && item.children.length > 0 && (
                              <i
                                id={`icon_${item.uid || item.id}`}
                                className={`fas fa-${expandedRows[item.uid || item.id] ? "minus" : "plus"}-square pe-2`}
                                onClick={() =>
                                  toggleExpand(item.uid || item.id)
                                }
                                style={{ cursor: "pointer" }}
                              />
                            )}
                            <a href="#" className="text-primary">
                              <span>AG</span>
                            </a>
                            {item.name || ""}
                          </td>
                          <td>
                            <span className={getColorClass(item.player_pl)}>
                              {formatNumber(item.player_pl)}
                            </span>
                          </td>
                          {/* <td><span className={getColorClass(item.downline_pl)}>{formatNumber(item.downline_pl)}</span></td>
                                                    <td><span>{formatNumber(item.agent_commission || item.agent_comm)}</span></td>
                                                    <td><span className={getColorClass(item.upline_pl)}>{formatNumber(item.upline_pl)}</span></td> */}
                        </tr>
                        {item.children &&
                          item.children.length > 0 &&
                          expandedRows[item.uid || item.id] && (
                            <tr className="expand">
                              <td colSpan={9} className="expand_wrap lightgrey">
                                <table className="w-100">
                                  <tbody>
                                    {item.children.map((child) => (
                                      <tr key={child.admin_id || child.uid}>
                                        <td className="text-start" style={{width:'66.92%'}}>
                                          <a href="#" className="text-primary">
                                            <span>CL</span>
                                          </a>
                                          {child.username || child.name || ""}
                                        </td>
                                        <td>
                                          <span
                                            className={getColorClass(
                                              child.player_pl,
                                            )}
                                          >
                                            {formatNumber(child.player_pl)}
                                          </span>
                                        </td>
                                        {/* <td><span className={getColorClass(child.downline_pl)}>{formatNumber(child.downline_pl)}</span></td>
                                                                            <td><span>{formatNumber(child.agent_commission || child.agent_comm)}</span></td>
                                                                            <td><span className={getColorClass(child.upline_pl)}>{formatNumber(child.upline_pl)}</span></td> */}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          )}
                      </React.Fragment>
                    ))}
                    {totals && (
                      <tr className="total-table-balance-none">
                        <td>
                          <strong>Total</strong>
                        </td>
                        <td>
                          <strong>
                            <span className={getColorClass(totals.player_pl)}>
                              {formatNumber(totals.player_pl)}
                            </span>
                          </strong>
                        </td>
                        {/* <td><strong><span className={getColorClass(totals.downline_pl)}>{formatNumber(totals.downline_pl)}</span></strong></td>
                                                <td><strong>{formatNumber(totals.agent_commission || totals.agent_comm)}</strong></td>
                                                <td><strong><span className={getColorClass(totals.upline_pl)}>{formatNumber(totals.upline_pl)}</span></strong></td> */}
                      </tr>
                    )}
                  </>
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* ✅ PAGINATION */}
            {renderPagination()}
          </>
        )}
      </div>
    </div>
  );

  const renderCasinoGameTable = () => (
    <div className="account-table">
      <div className="responsive">
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">SportName</th>
                  <th scope="col">Player P/L</th>
                  {/* <th scope="col">DownLine P/L</th>
                                    <th scope="col">Agent Comm. P/L</th>
                                    <th scope="col">Upline P/L</th> */}
                </tr>
              </thead>
              <tbody>
                {reportData && reportData.length > 0 ? (
                  <>
                    {reportData.map((item) => (
                      <tr key={item.uid || item.id}>
                        <td className="text-start">
                          <i className="fas fa-plus-square pe-2" />
                          {item.name || item.uid}
                        </td>
                        <td>
                          <span className={getColorClass(item.player_pl)}>
                            {formatNumber(item.player_pl)}
                          </span>
                        </td>
                        {/* <td><span className={getColorClass(item.downline_pl)}>{formatNumber(item.downline_pl)}</span></td>
                                                <td><span>{formatNumber(item.agent_commission || item.agent_comm)}</span></td>
                                                <td><span className={getColorClass(item.upline_pl)}>{formatNumber(item.upline_pl)}</span></td> */}
                      </tr>
                    ))}
                    {totals && (
                      <tr className="total-table-balance-none">
                        <td>
                          <strong>Total</strong>
                        </td>
                        <td>
                          <strong>
                            <span className={getColorClass(totals.player_pl)}>
                              {formatNumber(totals.player_pl)}
                            </span>
                          </strong>
                        </td>
                        {/* <td><strong><span className={getColorClass(totals.downline_pl)}>{formatNumber(totals.downline_pl)}</span></strong></td>
                                                <td><strong>{formatNumber(totals.agent_commission || totals.agent_comm)}</strong></td>
                                                <td><strong><span className={getColorClass(totals.upline_pl)}>{formatNumber(totals.upline_pl)}</span></strong></td> */}
                      </tr>
                    )}
                  </>
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* ✅ PAGINATION */}
            {renderPagination()}
          </>
        )}
      </div>
    </div>
  );

  const renderPlayerTable = () => (
    <div className="account-table">
      <div className="responsive">
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">UID</th>
                  <th scope="col">Player P/L</th>
                  {/* <th scope="col">DownLine P/L</th>
                                    <th scope="col">Agent Comm. P/L</th>
                                    <th scope="col">Upline P/L</th> */}
                </tr>
              </thead>
              <tbody>
                {reportData && reportData.length > 0 ? (
                  <>
                    {reportData.map((item) => (
                      <tr key={item.uid || item.id}>
                        <td className="text-start">
                          <a href="#" className="text-primary-span">
                            <span>CL</span>
                          </a>
                          {item.name || ""}
                        </td>
                        <td>
                          <span className={getColorClass(item.player_pl)}>
                            {formatNumber(item.player_pl)}
                          </span>
                        </td>
                        {/* <td><span className={getColorClass(item.downline_pl)}>{formatNumber(item.downline_pl)}</span></td>
                                                <td><span>{formatNumber(item.agent_commission || item.agent_comm)}</span></td>
                                                <td><span className={getColorClass(item.upline_pl)}>{formatNumber(item.upline_pl)}</span></td> */}
                      </tr>
                    ))}
                    {totals && (
                      <tr className="total-table-balance-none">
                        <td>
                          <strong>Total</strong>
                        </td>
                        <td>
                          <strong>
                            <span className={getColorClass(totals.player_pl)}>
                              {formatNumber(totals.player_pl)}
                            </span>
                          </strong>
                        </td>
                        {/* <td><strong><span className={getColorClass(totals.downline_pl)}>{formatNumber(totals.downline_pl)}</span></strong></td>
                                                <td><strong>{formatNumber(totals.agent_commission || totals.agent_comm)}</strong></td>
                                                <td><strong><span className={getColorClass(totals.upline_pl)}>{formatNumber(totals.upline_pl)}</span></strong></td> */}
                      </tr>
                    )}
                  </>
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* ✅ PAGINATION */}
            {renderPagination()}
          </>
        )}
      </div>
    </div>
  );

  const renderPagination = () => {
    if (pagination.total_pages < 0) return null;

    const pages = [
      pagination.current_page - 1,
      pagination.current_page,
      pagination.current_page + 1,
    ].filter((p) => p > 0 && p <= pagination.total_pages);

    return (
      <div className="bottom-pagination d-flex justify-content-center align-items-center">
        <ul className="pagination mb-0 gap-0">
          <li
            className={`previous ${pagination.current_page === 1 ? "disabled" : ""}`}
          >
            <Link onClick={() => handlePageChange(pagination.current_page - 1)}>
              <FaChevronLeft />
            </Link>
          </li>

          {pages.map((page) => (
            <li
              key={page}
              className={`p-0 ${pagination.current_page === page ? "active" : ""}`}
            >
              <Link
                className="pagintion-li"
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Link>
            </li>
          ))}

          <li
            className={`next ${
              pagination.current_page === pagination.total_pages
                ? "disabled"
                : ""
            }`}
          >
            <Link onClick={() => handlePageChange(pagination.current_page + 1)}>
              <FaChevronRight />
            </Link>
          </li>
        </ul>
      </div>
    );
  };

  return (
    <main className="allcommon">
      <section className="py-4 main-inner-outer">
        <div className="container-fluid">
          <div className="db-sec">
            <h2 className="common-heading">Profit Loss International</h2>
          </div>
          <div className="inner-wrapper">
            <div className="common-tab">
              <ul className="nav nav-tabs" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "Casino"}
                    className={`nav-link ${activeTab === "Casino" ? "active" : ""}`}
                    onClick={() => handleTabChange("Casino")}
                  >
                    Casino
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "CasinoGamePnL"}
                    className={`nav-link ${activeTab === "CasinoGamePnL" ? "active" : ""}`}
                    onClick={() => handleTabChange("CasinoGamePnL")}
                  >
                    CasinoGamePnL
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "PlayerPnL"}
                    className={`nav-link ${activeTab === "PlayerPnL" ? "active" : ""}`}
                    onClick={() => handleTabChange("PlayerPnL")}
                  >
                    PlayerPnL
                  </button>
                </li>
              </ul>

              <div className="tab-content">
                <div
                  role="tabpanel"
                  className={`fade tab-pane ${activeTab === "Casino" ? "active show" : ""}`}
                >
                  <div className="common-container">
                    {renderFilterForm()}
                    {renderCasinoTable()}
                  </div>
                </div>

                <div
                  role="tabpanel"
                  className={`fade tab-pane ${activeTab === "CasinoGamePnL" ? "active show" : ""}`}
                >
                  <div className="common-container">
                    {renderFilterForm()}
                    {renderCasinoGameTable()}
                  </div>
                </div>

                <div
                  role="tabpanel"
                  className={`fade tab-pane ${activeTab === "PlayerPnL" ? "active show" : ""}`}
                >
                  <div className="common-container">
                    {renderFilterForm()}
                    {renderPlayerTable()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Profitlossaura;
