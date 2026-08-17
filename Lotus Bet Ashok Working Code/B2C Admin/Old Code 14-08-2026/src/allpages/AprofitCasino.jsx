

import React, { useState, useEffect } from 'react';
import { BetListsDatewise } from "../../src/Server/api";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router';

function AprofitCasino() {
  // State management
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState([]);

  const [totals, setTotals] = useState({
    stake: 0,
    downline_pl: 0,
    player_pl: 0,
    commission: 0,
    upline_pl: 0,
    record_count: 0
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 100,
    total_records: 0,
    total_pages: 1
  });

  // ✅ FIX 3: Form state with default values
  const [formData, setFormData] = useState({
    sport_id: '',
    timeZone: '',
    from_date: '',
    fromTime: '',
    to_date: '',
    toTime: '',
    dataSource: ''
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handlePageChange = (newPage) => {
    setPagination((prev) => ({
      ...prev,
      current_page: newPage,
    }));

    fetchReportData(newPage);
  };

  // Fetch data from API
  const fetchReportData = async () => {
    setLoading(true);
    setError(null);

    try {
      const payload = {
        sport_id: formData.sport_id,
        timeZone: formData.timeZone,
        from_date: formData.from_date,
        fromTime: formData.fromTime,
        to_date: formData.to_date,
        toTime: formData.toTime,
        dataSource: formData.dataSource
      };

      console.log('📤 Sending payload:', payload);

      const response = await BetListsDatewise(payload);

      console.log('📥 Full API Response:', response);

      if (!response) {
        console.error('❌ No response received');
        throw new Error('No response received from server');
      }

      if (response.status === undefined) {
        console.error('❌ Response missing status field:', response);
        throw new Error('Invalid response format');
      }

      if (response.status == 200 || response.status == 1) {
        console.log('✅ Success! Setting data...');

        setReportData(response.data?.data || response.data || []);

        const totalData = response.data?.total || response.total || {};
        if (totalData) {
          setTotals({
            stake: totalData.stake || 0,
            downline_pl: totalData.downline_pl || 0,
            player_pl: totalData.player_pl || 0,
            commission: totalData.commission || 0,
            upline_pl: totalData.upline_pl || 0,
            record_count: totalData.record_count || 0
          });
        }

        // ✅ Pagination set from server
        const paginationData = response.data?.pagination || response.pagination || {};
        if (paginationData && Object.keys(paginationData).length > 0) {
          setPagination({
            current_page: paginationData.current_page || 1,
            per_page: paginationData.per_page || 50,
            total_records: paginationData.total_records || 0,
            total_pages: paginationData.total_pages || 1
          });
        }
      } else {
        console.error('❌ API returned error status:', response.status);
        setError(response.message || 'Failed to fetch data');
        setReportData([]);
        resetTotals();
      }
    } catch (err) {
      console.error('❌❌❌ CATCH BLOCK ERROR:', err);
      setError(err.message || 'Failed to fetch data. Please try again.');
      setReportData([]);
      resetTotals();
    } finally {
      setLoading(false);
    }
  };

  const resetTotals = () => {
    setTotals({
      stake: 0,
      downline_pl: 0,
      player_pl: 0,
      commission: 0,
      upline_pl: 0,
      record_count: 0
    });
  };

  const handleReset = () => {
    setFormData({
      sport_id: '',
      timeZone: 'IST',
      from_date: '2026-07-03',
      fromTime: '10:00',
      to_date: '2026-07-04',
      toTime: '09:59',
      dataSource: 'DB'
    });
    setReportData([]);
    resetTotals();
    setError(null);
    setPagination({
      current_page: 1,
      per_page: 100,
      total_records: 0,
      total_pages: 1
    });
    window.location.reload(); // ✅ YEH LINE ADD KARO
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  const formatNumber = (num) => {
    if (num === undefined || num === null) return '0.00';
    return Number(num).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <div className='allcommon'>
      <section className="main-inner-outer py-4">
        <div className="">
          <div className="row">
            <div className="db-sec">
              <h2 className="common-heading">Profit/Loss Report by Market</h2>
            </div>
            <div className="mb-2 col-md-3">
              <form className="bet_status bg-transparent border-0 p-0">
                <div className="bet-sec">
                  <label className="form-label">Data Source:</label>
                  <select
                    name="dataSource"
                    className="small_select ms-2 form-select"
                    value={formData.dataSource}
                    onChange={handleInputChange}
                  >
                    <option value="DB">DB</option>
                    <option value="API">API</option>
                  </select>
                </div>
              </form>
            </div>
            <div className="col-md-12">
              <div className="inner-wrapper">
                <form className="bet_status" onSubmit={(e) => e.preventDefault()}>
                  <div className="row">
                    <div className="col-xl-12 col-md-12">
                      <div className="row">
                        <div className="mb-lg-0 mb-3 col-lg-2 col-sm-6">
                          <div className="bet-sec">
                            <label className="form-label">Sports:</label>
                            <select
                              name="sport_id"
                              className="small_select ms-2 form-select"
                              value={formData.sport_id}
                              onChange={handleInputChange}
                            >
                              <option value="">All</option>
                              <option value="4">Cricket</option>
                              <option value="1">Soccer</option>
                              <option value="2">Tennis</option>
                              <option value="10">International Casino</option>
                              <option value="8">GreyHund</option>
                              <option value="7">Horse Racing</option>
                              {/* <option value="12">India Casino</option> */}
                            </select>
                          </div>
                        </div>
                        <div className="mb-lg-0 mb-3 col-lg-3 col-sm-6">
                          <div className="bet-sec">
                            <label className="me-2 form-label">Time Zone:</label>
                            <select
                              name="timeZone"
                              className="small_select ms-2 form-select"
                              value={formData.timeZone}
                              onChange={handleInputChange}
                            >
                              <option value="IST">IST (Bangalore/Bombay)</option>
                              <option value="UTC">UTC</option>
                              <option value="EST">EST</option>
                              <option value="PST">PST</option>
                            </select>
                          </div>
                        </div>
                        <div className="mb-lg-0 mb-2 flex-grow-0 pe-2 col-lg-3 col-sm-6">
                          <div className="bet-sec bet-period">
                            <label className="px-2 form-label">From</label>
                            <div className="form-group">
                              {/* ✅ FIX 1: fromDate → from_date */}
                              <input
                                name="from_date"
                                type="date"
                                className="small_form_control form-control"
                                value={formData.from_date}
                                onChange={handleInputChange}
                              />
                              <input
                                name="fromTime"
                                placeholder="00:00"
                                type="time"
                                className="small_form_control form-control"
                                value={formData.fromTime}
                                onChange={handleInputChange}
                                style={{ width: 80 }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="mb-lg-0 mb-2 flex-grow-0 ps-2 col-lg-3 col-sm-6">
                          <div className="bet-sec bet-period">
                            <label className="px-2 form-label">To</label>
                            <div className="form-group">
                              {/* ✅ FIX 2: toDate → to_date */}
                              <input
                                name="to_date"
                                type="date"
                                className="small_form_control form-control"
                                value={formData.to_date}
                                onChange={handleInputChange}
                              />
                              <input
                                name="toTime"
                                placeholder="00:00"
                                type="time"
                                className="small_form_control form-control"
                                value={formData.toTime}
                                onChange={handleInputChange}
                                style={{ width: 80 }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="history-btn mt-3">
                    <ul className="list-unstyled mb-0">
                      <li>
                        <button
                          type="button"
                          className="theme_dark_btn btn btn-primary"
                          onClick={fetchReportData}
                          disabled={loading}
                        >
                          {loading ? 'Loading...' : 'Search'}
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          className="theme_light_btn btn btn-primary"
                          onClick={handleReset}
                        >
                          Reset
                        </button>
                      </li>
                    </ul>
                  </div>
                </form>
              </div>
            </div>
            <div className="mt-2 col-md-12">
              <section className="account-table w-100">
                <div className="responsive transaction-history table-color">
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">UID</th>
                        <th scope="col">Stake</th>
                        <th scope="col">Downline P/L</th>
                        <th scope="col">Player P/L</th>
                        <th scope="col">Comm.</th>
                        <th scope="col">Upline/Total P/L</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="6" className="text-center">Loading...</td>
                        </tr>
                      ) : reportData && reportData.length > 0 ? (
                        reportData.map((item, index) => (
                          <tr key={index}>
                            <td>{item.uid || 'N/A'}</td>
                            <td>{formatNumber(item.stake)}</td>
                            <td>
                              <span className={item.downline_pl < 0 ? 'text-danger' : 'text-success'}>
                                {item.downline_pl !== undefined ? formatNumber(item.downline_pl) : '0.00'}
                              </span>
                            </td>
                            <td>
                              <span className={item.player_pl < 0 ? 'text-danger' : 'text-success'}>
                                {item.player_pl !== undefined ? formatNumber(item.player_pl) : '0.00'}
                              </span>
                            </td>
                            <td>{formatNumber(item.commission)}</td>
                            <td>
                              <span className={item.upline_pl < 0 ? 'text-danger' : 'text-success'}>
                                {item.upline_pl !== undefined ? formatNumber(item.upline_pl) : '0.00'}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center">No data available</td>
                        </tr>
                      )}
                      <tr className="total-table-balance-none">
                        <td>Total</td>
                        <td><strong>{formatNumber(totals.stake)}</strong></td>
                        <td>
                          <strong>
                            <span className={totals.downline_pl < 0 ? 'text-danger' : 'text-success'}>
                              {formatNumber(totals.downline_pl)}
                            </span>
                          </strong>
                        </td>
                        <td>
                          <strong>
                            <span className={totals.player_pl < 0 ? 'text-danger' : 'text-success'}>
                              {formatNumber(totals.player_pl)}
                            </span>
                          </strong>
                        </td>
                        <td>
                          <strong>{formatNumber(totals.commission)}</strong>
                        </td>
                        <td>
                          <strong>
                            <span className={totals.upline_pl < 0 ? 'text-danger' : 'text-success'}>
                              {formatNumber(totals.upline_pl)}
                            </span>
                          </strong>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {pagination.total_records > 1 && (
                    <div className="bottom-pagination d-flex justify-content-center align-items-center">
                      <ul className="pagination mb-0 gap-0">
                        <li className={`previous ${pagination.current_page === 1 ? "disabled" : ""}`}>
                          <Link className="" onClick={() => handlePageChange(pagination.current_page - 1)}>
                            <FaChevronLeft />
                          </Link>
                        </li>
                        {[
                          pagination.current_page - 1,
                          pagination.current_page,
                          pagination.current_page + 1,
                        ]
                          .filter((p) => p > 0 && p <= pagination.total_pages)
                          .map((p) => (
                            <li key={p} className={`p-0 ${pagination.current_page === p ? "active" : ""}`}>
                              <Link className="pagintion-li" onClick={() => handlePageChange(p)}>
                                {p}
                              </Link>
                            </li>
                          ))}
                        <li className={`next ${pagination.current_page === pagination.total_pages ? "disabled" : ""}`}>
                          <Link className="" onClick={() => handlePageChange(pagination.current_page + 1)}>
                            <FaChevronRight />
                          </Link>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AprofitCasino;