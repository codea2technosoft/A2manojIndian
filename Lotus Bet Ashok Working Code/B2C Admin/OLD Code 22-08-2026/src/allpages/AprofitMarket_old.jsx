import React, { useState } from 'react';
import { Link } from 'react-router';


import {
    getProfitLossByMarket,
    showBetsLossByMarket
} from "../Server/api";


function AprofitMarket() {
    const [activeTab, setActiveTab] = useState('Cricket');
    const [expandedRows, setExpandedRows] = useState({});

    // Tab buttons configuration
    const tabs = ['Cricket', 'Soccer', 'Tenis', 'Indian Casino', 'International Casino'];

    // Fake table data for different tabs
    const tableData = {
        Cricket: [
            {
                id: 35779542,
                matchName: 'Anurag Nalgonda Knights v Medak Falcons',
                date: '7/3/2026, 5:10:05 PM',
                downlinePL: '400.00',
                playerPL: '-400.00',
                comm: '0.00',
                uplinePL: '400.00',
                isPositive: true
            },
            {
                id: 35781652,
                matchName: 'Gulbarga Mystics v Mysore Warriors',
                date: '7/3/2026, 6:29:14 PM',
                downlinePL: '-5,660.00',
                playerPL: '5,660.00',
                comm: '0.00',
                uplinePL: '-5,660.00',
                isPositive: false
            },
            {
                id: 35772071,
                matchName: 'Seattle Orcas v MI New York',
                date: '7/3/2026, 6:46:16 AM',
                downlinePL: '102,922.80',
                playerPL: '-102,922.80',
                comm: '0.00',
                uplinePL: '102,922.80',
                isPositive: true
            },
            {
                id: 35769217,
                matchName: 'Worcestershire v Kent',
                date: '7/3/2026, 9:42:27 PM',
                downlinePL: '13,192.00',
                playerPL: '-13,192.00',
                comm: '0.00',
                uplinePL: '13,192.00',
                isPositive: true
            },
            {
                id: 35774934,
                matchName: 'India U19 W v Sri Lanka U19 W',
                date: '7/3/2026, 2:19:02 PM',
                downlinePL: '-1,764.70',
                playerPL: '1,764.70',
                comm: '0.00',
                uplinePL: '-1,764.70',
                isPositive: false
            },
            {
                id: 35782525,
                matchName: 'Boost Defenders v Speen Ghar Tigers',
                date: '7/4/2026, 10:17:45 AM',
                downlinePL: '79,379.00',
                playerPL: '-79,379.00',
                comm: '0.00',
                uplinePL: '79,379.00',
                isPositive: true
            },
            {
                id: 35770762,
                matchName: 'England W v South Africa W',
                date: '7/3/2026, 12:01:24 AM',
                downlinePL: '61,724.00',
                playerPL: '-61,724.00',
                comm: '0.00',
                uplinePL: '61,724.00',
                isPositive: true
            },
            {
                id: 35772102,
                matchName: 'West Indies v Sri Lanka',
                date: '7/3/2026, 7:40:40 PM',
                downlinePL: '-13,272.90',
                playerPL: '13,272.90',
                comm: '0.00',
                uplinePL: '-13,272.90',
                isPositive: false
            }
        ],
        Soccer: [
            {
                id: 35780001,
                matchName: 'Manchester United v Liverpool',
                date: '7/4/2026, 8:00:00 PM',
                downlinePL: '25,000.00',
                playerPL: '-25,000.00',
                comm: '500.00',
                uplinePL: '25,500.00',
                isPositive: true
            },
            {
                id: 35780002,
                matchName: 'Barcelona v Real Madrid',
                date: '7/4/2026, 9:00:00 PM',
                downlinePL: '-15,000.00',
                playerPL: '15,000.00',
                comm: '0.00',
                uplinePL: '-15,000.00',
                isPositive: false
            },
            {
                id: 35780003,
                matchName: 'Bayern Munich v Dortmund',
                date: '7/3/2026, 7:30:00 PM',
                downlinePL: '10,500.00',
                playerPL: '-10,500.00',
                comm: '200.00',
                uplinePL: '10,700.00',
                isPositive: true
            }
        ],
        Tenis: [
            {
                id: 35781001,
                matchName: 'Nadal v Djokovic',
                date: '7/4/2026, 6:00:00 PM',
                downlinePL: '30,000.00',
                playerPL: '-30,000.00',
                comm: '1,000.00',
                uplinePL: '31,000.00',
                isPositive: true
            },
            {
                id: 35781002,
                matchName: 'Williams v Osaka',
                date: '7/3/2026, 4:00:00 PM',
                downlinePL: '-8,500.00',
                playerPL: '8,500.00',
                comm: '0.00',
                uplinePL: '-8,500.00',
                isPositive: false
            }
        ],
        'Indian Casino': [
            {
                id: 35782001,
                matchName: 'Andar Bahar - Table 1',
                date: '7/4/2026, 10:00:00 PM',
                downlinePL: '50,000.00',
                playerPL: '-50,000.00',
                comm: '2,500.00',
                uplinePL: '52,500.00',
                isPositive: true
            },
            {
                id: 35782002,
                matchName: 'Teen Patti - Table 2',
                date: '7/3/2026, 8:00:00 PM',
                downlinePL: '-20,000.00',
                playerPL: '20,000.00',
                comm: '0.00',
                uplinePL: '-20,000.00',
                isPositive: false
            }
        ],
        'International Casino': [
            {
                id: 35783001,
                matchName: 'Roulette - VIP Room',
                date: '7/4/2026, 11:00:00 PM',
                downlinePL: '75,000.00',
                playerPL: '-75,000.00',
                comm: '3,000.00',
                uplinePL: '78,000.00',
                isPositive: true
            },
            {
                id: 35783002,
                matchName: 'Blackjack - Table 5',
                date: '7/3/2026, 9:00:00 PM',
                downlinePL: '-12,000.00',
                playerPL: '12,000.00',
                comm: '0.00',
                uplinePL: '-12,000.00',
                isPositive: false
            }
        ]
    };

    // Toggle row expansion
    const toggleRow = (id) => {
        setExpandedRows(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    // Get current data based on active tab
    const currentData = tableData[activeTab] || [];

    // Calculate totals
    const calculateTotals = () => {
        let totalDownlinePL = 0;
        let totalPlayerPL = 0;
        let totalComm = 0;
        let totalUplinePL = 0;

        currentData.forEach(item => {
            totalDownlinePL += parseFloat(item.downlinePL.replace(/,/g, '')) || 0;
            totalPlayerPL += parseFloat(item.playerPL.replace(/,/g, '')) || 0;
            totalComm += parseFloat(item.comm.replace(/,/g, '')) || 0;
            totalUplinePL += parseFloat(item.uplinePL.replace(/,/g, '')) || 0;
        });

        return {
            downlinePL: totalDownlinePL.toFixed(2),
            playerPL: totalPlayerPL.toFixed(2),
            comm: totalComm.toFixed(2),
            uplinePL: totalUplinePL.toFixed(2)
        };
    };

    const totals = calculateTotals();

    // Handle date/time changes
    const handleJustForToday = () => {
        const today = new Date().toISOString().split('T')[0];
        console.log('Set to today:', today);
    };

    const handleFromYesterday = () => {
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        console.log('Set to yesterday:', yesterday);
    };

    return (
        <div className='allcommon'>
            <section className="main-inner-outer py-4">
                <div className="container-fluid">
                    <div className="row">
                        <div className="db-sec">
                            <h2 className="common-heading">Profit/Loss Report by Market</h2>
                        </div>
                        <div className="col-md-12">
                            <div className="inner-wrapper">
                                <form className="bet_status" onSubmit={(e) => e.preventDefault()}>
                                    <div className="row">
                                        <div className="col-xl-12 col-md-12">
                                            <div className="row">
                                                <div className="mb-lg-0 mb-2 flex-grow-0 pe-2 col-lg-3 col-sm-6">
                                                    <div className="bet-sec bet-period">
                                                        <label className="px-2 form-label">From</label>
                                                        <div className="form-group">
                                                            <input
                                                                max="2026-07-04"
                                                                type="date"
                                                                className="small_form_control form-control"
                                                                defaultValue="2026-07-03"
                                                            />{" "}
                                                            <input
                                                                placeholder="00:00"
                                                                type="time"
                                                                className="small_form_control form-control"
                                                                defaultValue="10:00"
                                                                style={{ width: 80 }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mb-lg-0 mb-2 flex-grow-0 ps-2 col-lg-3 col-sm-6">
                                                    <div className="bet-sec bet-period">
                                                        <label className="px-2 form-label">To</label>
                                                        <div className="form-group">
                                                            <input
                                                                min="2026-07-03"
                                                                max="2026-07-04"
                                                                type="date"
                                                                className="small_form_control form-control"
                                                                defaultValue="2026-07-04"
                                                            />{" "}
                                                            <input
                                                                placeholder="00:00"
                                                                type="time"
                                                                className="small_form_control form-control"
                                                                defaultValue="09:59"
                                                                style={{ width: 80 }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="history-btn mt-2">
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
                                                    className="theme_dark_btn btn btn-primary"
                                                    onClick={() => console.log('Search clicked')}
                                                >
                                                    Search
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    type="button"
                                                    className="me-0 theme_light_btn btn btn-primary"
                                                    onClick={() => {
                                                        console.log('Reset clicked');
                                                        // Reset all filters
                                                    }}
                                                >
                                                    Reset
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="d-flex flex-wrap live-match-bat justify-sm-content-end">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab}
                                        type="button"
                                        className={`mb-2 mx-1 btn btn-primary ${activeTab === tab ? 'green-btn' : 'theme_light_btn'
                                            }`}
                                        onClick={() => {
                                            setActiveTab(tab);
                                            setExpandedRows({}); // Reset expanded rows when changing tabs
                                        }}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="mt-2 col-lg-12 col-md-12 col-sm-12">
                            <section className="account-table aprofit-downline aprofit-market w-100">
                                <div className="responsive transaction-history table-color">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th scope="col">UID</th>
                                                <th scope="col">Downline P/L</th>
                                                <th scope="col">Player P/L</th>
                                                <th scope="col">Comm.</th>
                                                <th scope="col" colSpan={2}>
                                                    Upline P/L
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentData.map((item) => (
                                                <React.Fragment key={item.id}>
                                                    <tr>
                                                        <td>
                                                            <i
                                                                className={`fas fa-${expandedRows[item.id] ? 'minus' : 'plus'
                                                                    }-square pe-2`}
                                                                style={{ cursor: 'pointer' }}
                                                                onClick={() => toggleRow(item.id)}
                                                            />
                                                            {/* <Link to={`/AprofitDownline/${item.id}`}>
                                                                {item.matchName} ▸ {item.id} ▸ {item.date}
                                                            </Link> */}
                                                            <Link to={`/comming-soon`}>
                                                                {item.matchName} ▸ {item.id} ▸ {item.date}
                                                            </Link>
                                                        </td>
                                                        <td>
                                                            <span className={item.isPositive ? 'text-success' : 'text-danger'}>
                                                                {item.isPositive ? item.downlinePL : `(${item.downlinePL})`}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span className={!item.isPositive ? 'text-success' : 'text-danger'}>
                                                                {!item.isPositive ? item.playerPL : `(${item.playerPL})`}
                                                            </span>
                                                        </td>
                                                        <td>{item.comm}</td>
                                                        <td>
                                                            <span className={item.isPositive ? 'text-success' : 'text-danger'}>
                                                                {item.isPositive ? item.uplinePL : `(${item.uplinePL})`}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                    {expandedRows[item.id] && (
                                                        <td colSpan="7" className="abc">
                                                            <table width="100%" className="sub-table">
                                                                <tbody>
                                                                    <tr>
                                                                        <td>Fancy</td>
                                                                        <td>0</td>
                                                                        <td>
                                                                            <span className="text-success">25,126.00</span>
                                                                        </td>
                                                                        <td>
                                                                            <span className="text-danger">(-25,126.00)</span>
                                                                        </td>
                                                                        <td>0.00</td>
                                                                        <td>
                                                                            <span className="text-success">25,126.00</span>
                                                                        </td>
                                                                        <td style={{ minWidth: "120px" }}>
                                                                            <Link
                                                                                style={{ padding: "5px", textDecoration: "none" }}
                                                                                className="me-0 theme_light_btn theme_dark_btn"
                                                                                to={"/match-market-bets"}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                            >
                                                                                Show Bets
                                                                            </Link>
                                                                        </td>
                                                                    </tr>

                                                                    <tr>
                                                                        <td>Toss</td>
                                                                        <td>0</td>
                                                                        <td>
                                                                            <span className="text-danger">(-4,720.00)</span>
                                                                        </td>
                                                                        <td>
                                                                            <span className="text-success">4,720.00</span>
                                                                        </td>
                                                                        <td>0.00</td>
                                                                        <td>
                                                                            <span className="text-danger">(-4,720.00)</span>
                                                                        </td>
                                                                        <td style={{ minWidth: "120px" }}>
                                                                            <Link
                                                                                style={{ padding: "5px", textDecoration: "none" }}
                                                                                className="me-0 theme_light_btn theme_dark_btn"
                                                                                to={"/match-market-bets"}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                            >
                                                                                Show Bets
                                                                            </Link>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                            <tr style={{ fontWeight: 'bold', backgroundColor: '#e9ecef' }}>
                                                <th scope="col">Total</th>
                                                <th>
                                                    <span className={parseFloat(totals.downlinePL) >= 0 ? 'text-success' : 'text-danger'}>
                                                        {parseFloat(totals.downlinePL) >= 0
                                                            ? totals.downlinePL
                                                            : `(${totals.downlinePL})`}
                                                    </span>
                                                </th>
                                                <th>
                                                    <span className={parseFloat(totals.playerPL) >= 0 ? 'text-success' : 'text-danger'}>
                                                        {parseFloat(totals.playerPL) >= 0
                                                            ? totals.playerPL
                                                            : `(${totals.playerPL})`}
                                                    </span>
                                                </th>
                                                <th>{totals.comm}</th>
                                                <th>
                                                    <span className={parseFloat(totals.uplinePL) >= 0 ? 'text-success' : 'text-danger'}>
                                                        {parseFloat(totals.uplinePL) >= 0
                                                            ? totals.uplinePL
                                                            : `(${totals.uplinePL})`}
                                                    </span>
                                                </th>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div className="bottom-pagination">
                                        <ul role="navigation" aria-label="Pagination">
                                            <li className="previous disabled">
                                                <a
                                                    className=" "
                                                    tabIndex={-1}
                                                    role="button"
                                                    aria-disabled="true"
                                                    aria-label="Previous page"
                                                    rel="prev"
                                                >
                                                    &lt;{" "}
                                                </a>
                                            </li>
                                            <li className="next">
                                                <a
                                                    className=""
                                                    tabIndex={0}
                                                    role="button"
                                                    aria-disabled="false"
                                                    aria-label="Next page"
                                                    rel="next"
                                                    onClick={() => console.log('Next page clicked')}
                                                >
                                                    {" "}
                                                    &gt;
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default AprofitMarket;