import React, { useState } from 'react';
import Select from 'react-select';

function Profitlossaura() {
    const [activeTab, setActiveTab] = useState('PlayerPnL');
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
    const [expandedRows, setExpandedRows] = useState({});

    // Sample data for Casino tab
    const casinoData = [
        {
            id: 'summary0_1',
            prefix: 'AG',
            name: 'agvip',
            playerPL: '(7,305.00)',
            downLinePL: '(7,305.00)',
            agentComm: '(0.00)',
            uplinePL: '(7,305.00)',
            playerClass: 'text-danger',
            downLineClass: 'text-success',
            uplineClass: 'text-danger',
            children: [
                {
                    id: 'child1_1',
                    prefix: 'CL',
                    name: 'charv123',
                    playerPL: '(1,062.00)',
                    downLinePL: '(1,062.00)',
                    agentComm: '(0.00)',
                    uplinePL: '(1,062.00)',
                    playerClass: 'text-danger',
                    downLineClass: 'text-success',
                    uplineClass: 'text-danger'
                },
                {
                    id: 'child1_2',
                    prefix: 'CL',
                    name: 'ngr39',
                    playerPL: '(22,552.00)',
                    downLinePL: '(22,552.00)',
                    agentComm: '(0.00)',
                    uplinePL: '(22,552.00)',
                    playerClass: 'text-danger',
                    downLineClass: 'text-success',
                    uplineClass: 'text-danger'
                },
                {
                    id: 'child1_3',
                    prefix: 'CL',
                    name: 'punithkb',
                    playerPL: '(-517.00)',
                    downLinePL: '(-517.00)',
                    agentComm: '(0.00)',
                    uplinePL: '(-517.00)',
                    playerClass: 'text-success',
                    downLineClass: 'text-danger',
                    uplineClass: 'text-success'
                }
            ]
        },
        {
            id: 'summary0_2',
            prefix: 'AG',
            name: 'pradeep005',
            playerPL: '(500.00)',
            downLinePL: '(500.00)',
            agentComm: '(0.00)',
            uplinePL: '(500.00)',
            playerClass: 'text-success',
            downLineClass: 'text-danger',
            uplineClass: 'text-success'
        },
        {
            id: 'summary0_3',
            prefix: 'AG',
            name: 'rakesh hsd',
            playerPL: '(200.00)',
            downLinePL: '(200.00)',
            agentComm: '(0.00)',
            uplinePL: '(200.00)',
            playerClass: 'text-success',
            downLineClass: 'text-danger',
            uplineClass: 'text-success'
        },
        {
            id: 'summary0_4',
            prefix: 'AG',
            name: 'manjanna009b',
            playerPL: '(1,043.00)',
            downLinePL: '(1,043.00)',
            agentComm: '(0.00)',
            uplinePL: '(1,043.00)',
            playerClass: 'text-success',
            downLineClass: 'text-danger',
            uplineClass: 'text-success'
        },
        {
            id: 'summary0_5',
            prefix: 'AG',
            name: 'ambu010',
            playerPL: '(3,050.00)',
            downLinePL: '(3,050.00)',
            agentComm: '(0.00)',
            uplinePL: '(3,050.00)',
            playerClass: 'text-success',
            downLineClass: 'text-danger',
            uplineClass: 'text-success'
        },
        {
            id: 'summary0_6',
            prefix: 'AG',
            name: 'nawabjan ajjampura',
            playerPL: '(2,997.00)',
            downLinePL: '(2,997.00)',
            agentComm: '(0.00)',
            uplinePL: '(2,997.00)',
            playerClass: 'text-success',
            downLineClass: 'text-danger',
            uplineClass: 'text-success'
        }
    ];

    // Sample data for CasinoGamePnL tab
    const casinoGameData = [
        {
            id: 'game1',
            sportName: 'DRAGOONSOFT',
            playerPL: '(200.00)',
            downLinePL: '(200.00)',
            agentComm: '(0.00)',
            uplinePL: '(200.00)',
            playerClass: 'text-success',
            downLineClass: 'text-danger',
            uplineClass: 'text-success'
        },
        {
            id: 'game2',
            sportName: 'JDB',
            playerPL: '(1,043.00)',
            downLinePL: '(1,043.00)',
            agentComm: '(0.00)',
            uplinePL: '(1,043.00)',
            playerClass: 'text-success',
            downLineClass: 'text-danger',
            uplineClass: 'text-success'
        },
        {
            id: 'game3',
            sportName: 'EVOLUTION',
            playerPL: '(4,950.00)',
            downLinePL: '(4,950.00)',
            agentComm: '(0.00)',
            uplinePL: '(4,950.00)',
            playerClass: 'text-danger',
            downLineClass: 'text-success',
            uplineClass: 'text-danger'
        },
        {
            id: 'game4',
            sportName: 'SPRIBE',
            playerPL: '(177.00)',
            downLinePL: '(177.00)',
            agentComm: '(0.00)',
            uplinePL: '(177.00)',
            playerClass: 'text-success',
            downLineClass: 'text-danger',
            uplineClass: 'text-success'
        },
        {
            id: 'game5',
            sportName: 'JILI',
            playerPL: '(4,015.00)',
            downLinePL: '(4,015.00)',
            agentComm: '(0.00)',
            uplinePL: '(4,015.00)',
            playerClass: 'text-success',
            downLineClass: 'text-danger',
            uplineClass: 'text-success'
        }
    ];

    // Sample data for PlayerPnL tab
    const playerData = [
        { uid: 'ngr39', prefix: 'CL', playerPL: '(7,505.00)', downLinePL: '(7,505.00)', agentComm: '(0.00)', uplinePL: '(7,505.00)', playerClass: 'text-danger', downLineClass: 'text-success', uplineClass: 'text-danger' },
        { uid: 'rohan01', prefix: 'CL', playerPL: '(200.00)', downLinePL: '(200.00)', agentComm: '(0.00)', uplinePL: '(200.00)', playerClass: 'text-success', downLineClass: 'text-danger', uplineClass: 'text-success' },
        { uid: 'ajay2222', prefix: 'CL', playerPL: '(500.00)', downLinePL: '(500.00)', agentComm: '(0.00)', uplinePL: '(500.00)', playerClass: 'text-success', downLineClass: 'text-danger', uplineClass: 'text-success' },
        { uid: 'narasimha', prefix: 'CL', playerPL: '(200.00)', downLinePL: '(200.00)', agentComm: '(0.00)', uplinePL: '(200.00)', playerClass: 'text-success', downLineClass: 'text-danger', uplineClass: 'text-success' },
        { uid: 'tej95', prefix: 'CL', playerPL: '(1,043.00)', downLinePL: '(1,043.00)', agentComm: '(0.00)', uplinePL: '(1,043.00)', playerClass: 'text-success', downLineClass: 'text-danger', uplineClass: 'text-success' },
        { uid: 'bns', prefix: 'CL', playerPL: '(3,050.00)', downLinePL: '(3,050.00)', agentComm: '(0.00)', uplinePL: '(3,050.00)', playerClass: 'text-success', downLineClass: 'text-danger', uplineClass: 'text-success' },
        { uid: 'varsha01', prefix: 'CL', playerPL: '(2,997.00)', downLinePL: '(2,997.00)', agentComm: '(0.00)', uplinePL: '(2,997.00)', playerClass: 'text-success', downLineClass: 'text-danger', uplineClass: 'text-success' }
    ];

    // User options for react-select
    const userOptions = [
        { value: 'user1', label: 'User 1' },
        { value: 'user2', label: 'User 2' },
        { value: 'user3', label: 'User 3' },
        { value: 'user4', label: 'User 4' },
        { value: 'user5', label: 'User 5' },
        { value: 'ngr39', label: 'ngr39' },
        { value: 'rohan01', label: 'rohan01' },
        { value: 'ajay2222', label: 'ajay2222' },
        { value: 'narasimha', label: 'narasimha' },
        { value: 'tej95', label: 'tej95' },
        { value: 'bns', label: 'bns' },
        { value: 'varsha01', label: 'varsha01' }
    ];

    // Custom styles for react-select
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

    const handleLastChange = (e) => {
        setSelectedLast(parseInt(e.target.value) || '');
    };

    const handleUserChange = (selectedOption) => {
        setSelectedUser(selectedOption);
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
        console.log('Getting P/L with:', {
            periodFrom,
            periodTo,
            selectedLast,
            selectedUser,
            activeTab
        });
    };

    const toggleExpand = (id) => {
        setExpandedRows(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    // Render filter form (reused across tabs)
    const renderFilterForm = () => (
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
                        onChange={handleLastChange}
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
    );

    // Render Casino table with expandable rows
    const renderCasinoTable = () => (
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
                        {casinoData.map((item) => (
                            <React.Fragment key={item.id}>
                                <tr id={item.id} style={{ display: 'table-row' }}>
                                    <td className="text-start">
                                        {item.children && (
                                            <i
                                                id={`icon_${item.id}`}
                                                className={`fas fa-${expandedRows[item.id] ? 'minus' : 'plus'}-square pe-2`}
                                                onClick={() => toggleExpand(item.id)}
                                                style={{ cursor: 'pointer' }}
                                            />
                                        )}
                                        <a href="#" className="text-primary">
                                            <span>{item.prefix}</span>
                                        </a>
                                        {item.name}
                                    </td>
                                    <td><span className={item.playerClass}>{item.playerPL}</span></td>
                                    <td><span className={item.downLineClass}>{item.downLinePL}</span></td>
                                    <td><span>{item.agentComm}</span></td>
                                    <td><span className={item.uplineClass}>{item.uplinePL}</span></td>
                                </tr>
                                {item.children && expandedRows[item.id] && (
                                    <tr className="expand">
                                        <td colSpan={9} className="expand_wrap" style={{ background: 'lightgrey' }}>
                                            <table style={{ width: '100%', background: 'lightgrey' }}>
                                                <tbody style={{ background: 'lightgrey' }}>
                                                    {item.children.map((child) => (
                                                        <tr key={child.id}>
                                                            <td className="text-start">
                                                                <a href="#" className="text-primary">
                                                                    <span>{child.prefix}</span>
                                                                </a>
                                                                {child.name}
                                                            </td>
                                                            <td><span className={child.playerClass}>{child.playerPL}</span></td>
                                                            <td><span className={child.downLineClass}>{child.downLinePL}</span></td>
                                                            <td><span>{child.agentComm}</span></td>
                                                            <td><span className={child.uplineClass}>{child.uplinePL}</span></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    // Render CasinoGame table
    const renderCasinoGameTable = () => (
        <div className="account-table">
            <div className="responsive">
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">SportName</th>
                            <th scope="col">Player P/L</th>
                            <th scope="col">DownLine P/L</th>
                            <th scope="col">Agent Comm. P/L</th>
                            <th scope="col">Upline P/L</th>
                        </tr>
                    </thead>
                    <tbody>
                        {casinoGameData.map((item) => (
                            <tr key={item.id} style={{ display: 'table-row' }}>
                                <td className="text-start">
                                    <i id={`icon_${item.id}`} className="fas fa-plus-square pe-2" />
                                    {item.sportName}
                                </td>
                                <td><span className={item.playerClass}>{item.playerPL}</span></td>
                                <td><span className={item.downLineClass}>{item.downLinePL}</span></td>
                                <td><span>{item.agentComm}</span></td>
                                <td><span className={item.uplineClass}>{item.uplinePL}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    // Render Player table
    const renderPlayerTable = () => (
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
                        {playerData.map((item, index) => (
                            <tr key={index} style={{ display: 'table-row' }}>
                                <td className="text-start">
                                    <a href="#" className="text-primary-span">
                                        <span>{item.prefix}</span>
                                    </a>
                                    {item.uid}
                                </td>
                                <td><span className={item.playerClass}>{item.playerPL}</span></td>
                                <td><span className={item.downLineClass}>{item.downLinePL}</span></td>
                                <td><span>{item.agentComm}</span></td>
                                <td><span className={item.uplineClass}>{item.uplinePL}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <main className='allcommon'>
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
                                        {renderFilterForm()}
                                        {renderCasinoTable()}
                                    </div>
                                </div>

                                {/* CasinoGamePnL Tab */}
                                <div
                                    role="tabpanel"
                                    className={`fade tab-pane ${activeTab === 'CasinoGamePnL' ? 'active show' : ''}`}
                                >
                                    <div className="common-container">
                                        {renderFilterForm()}
                                        {renderCasinoGameTable()}
                                    </div>
                                </div>

                                {/* PlayerPnL Tab */}
                                <div
                                    role="tabpanel"
                                    className={`fade tab-pane ${activeTab === 'PlayerPnL' ? 'active show' : ''}`}
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