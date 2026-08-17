import React, { useState } from 'react';
import Select from 'react-select';

function Profitgaploss() {
  const [activeTab, setActiveTab] = useState('Casino');
  const [periodFrom, setPeriodFrom] = useState({
    date: '2026-07-03',
    time: '10:00'
  });
  const [periodTo, setPeriodTo] = useState({
    date: '2026-07-04',
    time: '09:59'
  });
  const [selectedLast, setSelectedLast] = useState(25);
  const [selectedUser, setSelectedUser] = useState(null);

  // Sample user options for select
  const userOptions = [
    { value: 'user1', label: 'User 1' },
    { value: 'user2', label: 'User 2' },
    { value: 'user3', label: 'User 3' },
    { value: 'user4', label: 'User 4' },
    { value: 'user5', label: 'User 5' },
  ];

  // Custom styles for react-select to match your design
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: '38px',
      borderRadius: '4px',
      border: '1px solid #ced4da',
      boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(13,110,253,0.25)' : null,
      '&:hover': {
        borderColor: '#86b7fe'
      }
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#0d6efd' : state.isFocused ? '#e9ecef' : null,
      color: state.isSelected ? 'white' : '#212529',
      cursor: 'pointer'
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999
    })
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
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

  const handleJustForToday = () => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    setPeriodFrom({
      date: todayStr,
      time: '00:00'
    });
    setPeriodTo({
      date: todayStr,
      time: '23:59'
    });
  };

  const handleFromYesterday = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    setPeriodFrom({
      date: yesterdayStr,
      time: '00:00'
    });
    setPeriodTo({
      date: todayStr,
      time: '23:59'
    });
  };

  const handleGetPL = () => {
    // Implement your P/L logic here
    console.log('Getting P/L with:', {
      periodFrom,
      periodTo,
      selectedLast,
      selectedUser,
      activeTab
    });
  };

  return (
    <main className='allcommon'>
      <section className="py-4 main-inner-outer">
        <div className="container-fluid">
          <div className="db-sec">
            <h2 className="common-heading">Profit Loss Gap</h2>
          </div>
          <div className="inner-wrapper">
            <div className="common-tab">
              <ul className="nav nav-tabs pb-3" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === 'Casino'}
                    className={`nav-link ${activeTab === 'Casino' ? 'active' : ''}`}
                    onClick={() => handleTabChange('Casino')}
                  >
                    Casino
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === 'CasinoGamePnL'}
                    className={`nav-link ${activeTab === 'CasinoGamePnL' ? 'active' : ''}`}
                    onClick={() => handleTabChange('CasinoGamePnL')}
                  >
                    CasinoGamePnL
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === 'PlayerPnL'}
                    className={`nav-link ${activeTab === 'PlayerPnL' ? 'active' : ''}`}
                    onClick={() => handleTabChange('PlayerPnL')}
                  >
                    PlayerPnL
                  </button>
                </li>
              </ul>
              
              <div className="tab-content">
                {/* Casino Tab */}
                <div
                  role="tabpanel"
                  className={`fade tab-pane ${activeTab === 'Casino' ? 'active show' : ''}`}
                >
                  <div className="common-container">
                    <form className="bet_status bet-list-live" onSubmit={(e) => e.preventDefault()}>
                      <div className="bet_outer">
                        <div className="mb-lg-0 mb-3 col-lg-3 col-sm-3">
                          <div className="bet-sec bet-period">
                            <label className="me-2 form-label" style={{ fontWeight: 600 }}>
                              Period From
                            </label>
                            <div className="form-group">
                              <input
                                max="2026-07-04"
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
                                min="2026-07-03"
                                max="2026-07-04"
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
                            onChange={(e) => setSelectedLast(e.target.value)}
                          >
                            <option value={25}>25 Txn</option>
                            <option value={50}>50 Txn</option>
                            <option value={100}>100 Txn</option>
                            <option value={200}>200 Txn</option>
                            <option value="">All</option>
                          </select>
                        </div>
                        
                        <div className="mb-lg-0 mb-3 col-lg-3 col-sm-3">
                          <div className="d-flex align-items-center">
                            <label className="form-label" style={{ fontWeight: 600, marginRight: 5 }}>
                              User List
                            </label>
                            <div style={{ minWidth: '200px' }}>
                              <Select
                                value={selectedUser}
                                onChange={setSelectedUser}
                                options={userOptions}
                                styles={customStyles}
                                placeholder="Select User"
                                isClearable
                                isSearchable
                                className="basic-single"
                                classNamePrefix="select"
                              />
                            </div>
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
                            >
                              Get P/L
                            </button>
                          </li>
                        </ul>
                      </div>
                    </form>
                    
                    <div className="account-table">
                      <div className="responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th scope="col">UID</th>
                              <th scope="col">Player P/L</th>
                              <th scope="col">DownLine P/L</th>
                              <th scope="col">Agent Comm. P/L</th>
                              <th scope="col">Upline P/L</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td colSpan={5}>
                                <span>You have no bets in this time period.</span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* CasinoGamePnL Tab */}
                <div
                  role="tabpanel"
                  className={`fade tab-pane ${activeTab === 'CasinoGamePnL' ? 'active show' : ''}`}
                >
                   <div className="common-container">
                    <form className="bet_status bet-list-live" onSubmit={(e) => e.preventDefault()}>
                      <div className="bet_outer">
                        <div className="mb-lg-0 mb-3 col-lg-3 col-sm-3">
                          <div className="bet-sec bet-period">
                            <label className="me-2 form-label" style={{ fontWeight: 600 }}>
                              Period From
                            </label>
                            <div className="form-group">
                              <input
                                max="2026-07-04"
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
                                min="2026-07-03"
                                max="2026-07-04"
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
                            onChange={(e) => setSelectedLast(e.target.value)}
                          >
                            <option value={25}>25 Txn</option>
                            <option value={50}>50 Txn</option>
                            <option value={100}>100 Txn</option>
                            <option value={200}>200 Txn</option>
                            <option value="">All</option>
                          </select>
                        </div>
                        
                        <div className="mb-lg-0 mb-3 col-lg-3 col-sm-3">
                          <div className="d-flex align-items-center">
                            <label className="form-label" style={{ fontWeight: 600, marginRight: 5 }}>
                              User List
                            </label>
                            <div style={{ minWidth: '200px' }}>
                              <Select
                                value={selectedUser}
                                onChange={setSelectedUser}
                                options={userOptions}
                                styles={customStyles}
                                placeholder="Select User"
                                isClearable
                                isSearchable
                                className="basic-single"
                                classNamePrefix="select"
                              />
                            </div>
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
                            >
                              Get P/L
                            </button>
                          </li>
                        </ul>
                      </div>
                    </form>
                    
                    <div className="account-table">
                      <div className="responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th scope="col">UID</th>
                              <th scope="col">Player P/L</th>
                              <th scope="col">DownLine P/L</th>
                              <th scope="col">Agent Comm. P/L</th>
                              <th scope="col">Upline P/L</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td colSpan={5}>
                                <span>You have no bets in this time period.</span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* PlayerPnL Tab */}
                <div
                  role="tabpanel"
                  className={`fade tab-pane ${activeTab === 'PlayerPnL' ? 'active show' : ''}`}
                >
                  <div className="common-container">
                    <form className="bet_status bet-list-live" onSubmit={(e) => e.preventDefault()}>
                      <div className="bet_outer">
                        <div className="mb-lg-0 mb-3 col-lg-3 col-sm-3">
                          <div className="bet-sec bet-period">
                            <label className="me-2 form-label" style={{ fontWeight: 600 }}>
                              Period From
                            </label>
                            <div className="form-group">
                              <input
                                max="2026-07-04"
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
                                min="2026-07-03"
                                max="2026-07-04"
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
                            onChange={(e) => setSelectedLast(e.target.value)}
                          >
                            <option value={25}>25 Txn</option>
                            <option value={50}>50 Txn</option>
                            <option value={100}>100 Txn</option>
                            <option value={200}>200 Txn</option>
                            <option value="">All</option>
                          </select>
                        </div>
                        
                        <div className="mb-lg-0 mb-3 col-lg-3 col-sm-3">
                          <div className="d-flex align-items-center">
                            <label className="form-label" style={{ fontWeight: 600, marginRight: 5 }}>
                              User List
                            </label>
                            <div style={{ minWidth: '200px' }}>
                              <Select
                                value={selectedUser}
                                onChange={setSelectedUser}
                                options={userOptions}
                                styles={customStyles}
                                placeholder="Select User"
                                isClearable
                                isSearchable
                                className="basic-single"
                                classNamePrefix="select"
                              />
                            </div>
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
                            >
                              Get P/L
                            </button>
                          </li>
                        </ul>
                      </div>
                    </form>
                    
                    <div className="account-table">
                      <div className="responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th scope="col">UID</th>
                              <th scope="col">Player P/L</th>
                              <th scope="col">DownLine P/L</th>
                              <th scope="col">Agent Comm. P/L</th>
                              <th scope="col">Upline P/L</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td colSpan={5}>
                                <span>You have no bets in this time period.</span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
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

export default Profitgaploss;