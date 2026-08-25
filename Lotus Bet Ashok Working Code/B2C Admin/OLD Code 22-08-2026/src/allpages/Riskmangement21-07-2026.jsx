import React, { useState } from 'react'
import Heading from '../Layout/Heading'
import { IoChevronUpOutline } from "react-icons/io5";
import {
  getRiskManagementAll,
} from "../Server/api";

function Riskmangement() {
    const [activeIndex, setActiveIndex] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const [bookmarkettable, setBookmarkettable] = useState(false);
    const handleOpenModalbookmaker = () => setBookmarkettable(true);
    const handleCloseModalbookmaker = () => setBookmarkettable(false);

    const tableshowhide = (index) => {
        setActiveIndex((prev) => (prev === index ? null : index));
    };
    // Data structure for the table
    const tableData = {
        headers: [
            'Downline',
            'Australia W',
            'West Indies W',
            'India W',
            'Sri Lanka W',
            'Thailand W',
            'Nepal W',
            'England W',
            'Netherlands W',
            'USA W',
            'South Africa W',
            'Ireland W',
            'Zimbabwe W',
            'Pakistan W',
            'Namibia W',
            'New Zealand W',
            'Bangladesh W',
            'Papua New Guinea W',
            'Scotland W',
        ],
        rows: [
            {
                label: 'AG',
                values: [
                    '100',
                    '100',
                    '100',
                    '100',
                    '100',
                    '100',
                    '100',
                    '100',
                    '100',
                    '900.00',
                    '100',
                    '100',
                    '100',
                    '100',
                    '100',
                    '100',
                    '100',
                    '100',
                ],
            },
        ],
    };
    const totalValues = tableData.rows[0].values;

    // Sample data structure - you can replace this with your actual data
    const matchOddsData = [
        {
            id: 1,
            sport: "cricket",
            eventName: "ICC Womens T20 World Cup",
            marketType: "Winner",
            selections: [
                { name: "Australia W", back3: { odds: "1.43", amount: "1020.01" }, back2: { odds: "1.44", amount: "1906.28" }, back1: { odds: "1.45", amount: "830.77" }, lay1: { odds: "1.47", amount: "12.96" }, lay2: { odds: "1.48", amount: "17.14" } },
                { name: "India W", back3: { odds: "0.00", amount: "--" }, back2: { odds: "0.00", amount: "--" }, back1: { odds: "--", amount: "--" }, lay1: { odds: "0.00", amount: "--" }, lay2: { odds: "0.00", amount: "--" } },
                { name: "England W", back3: { odds: "3.05", amount: "83.6" }, back2: { odds: "3.10", amount: "81.61" }, back1: { odds: "3.15", amount: "92.71" }, lay1: { odds: "3.25", amount: "34.24" }, lay2: { odds: "3.30", amount: "152" } },
                { name: "New Zealand W", back3: { odds: "0.00", amount: "--" }, back2: { odds: "0.00", amount: "--" }, back1: { odds: "--", amount: "--" }, lay1: { odds: "0.00", amount: "--" }, lay2: { odds: "0.00", amount: "--" } }
            ],
            downlinePL: "View"
        },
        {
            id: 2,
            sport: "cricket",
            eventName: "Gulbarga Mystics v Mysore Warriors",
            marketType: "Match Odds",
            selections: [
                { name: "Australia W", back3: { odds: "1.43", amount: "1020.01" }, back2: { odds: "1.44", amount: "1906.28" }, back1: { odds: "1.45", amount: "830.77" }, lay1: { odds: "1.47", amount: "12.96" }, lay2: { odds: "1.48", amount: "17.14" } },
                { name: "India W", back3: { odds: "0.00", amount: "--" }, back2: { odds: "0.00", amount: "--" }, back1: { odds: "--", amount: "--" }, lay1: { odds: "0.00", amount: "--" }, lay2: { odds: "0.00", amount: "--" } },
                { name: "England W", back3: { odds: "3.05", amount: "83.6" }, back2: { odds: "3.10", amount: "81.61" }, back1: { odds: "3.15", amount: "92.71" }, lay1: { odds: "3.25", amount: "34.24" }, lay2: { odds: "3.30", amount: "152" } },
                { name: "New Zealand W", back3: { odds: "0.00", amount: "--" }, back2: { odds: "0.00", amount: "--" }, back1: { odds: "--", amount: "--" }, lay1: { odds: "0.00", amount: "--" }, lay2: { odds: "0.00", amount: "--" } }
            ],
            bookPL1: { team: "Gulbarga Mystics", value: "- 1500.00" },
            bookPL2: { team: "Mysore Warriors", value: "- 0.00" },
            downlinePL: "View"
        }
    ];

    const Bookmaker = [
        {
            id: 1,
            sport: "Cricket",
            eventName: "England U19 v South Africa U19",
            marketType: "50 over run SA U19",
            min: "-6000",
            max: "6000",
            downlinePL: "view"
        },
        {
            id: 2,
            sport: "Cricket",
            eventName: "England U19 v South Africa U19",
            marketType: "12 over run SA U19",
            min: "-3000",
            max: "3000",
            downlinePL: "view"
        }
    ];
    const fancyBetData = [
        {
            id: 1,
            sport: "Cricket",
            eventName: "England U19 v South Africa U19",
            marketType: "50 over run SA U19",
            min: "-6000",
            max: "6000",
            downlinePL: "Book"
        },
        {
            id: 2,
            sport: "Cricket",
            eventName: "England U19 v South Africa U19",
            marketType: "12 over run SA U19",
            min: "-3000",
            max: "3000",
            downlinePL: "Book"
        }
    ];

    return (
        <main className='riskmangement'>
            <section className=" main-inner-outer py-4" style={{ fontSize: 14 }}>
                <div className="container-fluid">
                    <Heading title="Risk Management" />
                    <div className="inner-wrapper">
                        <div className="common-container">
                            {/* Match Odds Section */}
                            <div className="risk-management-table">
                                <div className="risk-management-table-header">
                                    <h2 className="common-heading">Match Odds</h2>
                                    <div>
                                        <svg
                                            stroke="currentColor"
                                            fill="currentColor"
                                            strokeWidth={0}
                                            viewBox="0 0 24 24"
                                            height={20}
                                            width={20}
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path fill="none" d="M0 0h24v24H0z" />
                                            <path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="account-table match-odd-table">
                                    <div className="table-responsive">
                                        <table className="table">
                                            <tbody>
                                                <tr>
                                                    <td width="25%" rowSpan={2}>
                                                        <strong>Event/Market Name</strong>
                                                    </td>
                                                    <td width="6%" rowSpan={2} className="text-center">
                                                        <strong>Downline P/L</strong>
                                                    </td>
                                                </tr>
                                            </tbody>
                                            {matchOddsData.map((item, index) => (
                                                <tbody key={item.id} className="match-tbody">
                                                    <tr>
                                                        <td className="bg-yellow border-0">
                                                            <a>
                                                                <button
                                                                    onClick={() => tableshowhide(index)}
                                                                    type="button"
                                                                    className="angle-up down-up btn btn-primary"
                                                                >
                                                                    <IoChevronUpOutline />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-primary"
                                                                    style={{
                                                                        padding: "3px 5px",
                                                                        fontSize: 12,
                                                                        marginRight: 5,
                                                                        background: "rgb(255, 184, 12)",
                                                                        fontWeight: 600,
                                                                        borderWidth: "medium",
                                                                        borderStyle: "none",
                                                                        borderColor: "currentcolor",
                                                                        borderImage: "none"
                                                                    }}
                                                                >
                                                                    View Details
                                                                </button>
                                                                <span style={{ paddingRight: 5 }}>{item.sport}</span>
                                                                <strong> </strong>
                                                            </a>
                                                            <strong>
                                                                <a className='text-dark' href={`/sportanalysis`}>
                                                                    {item.eventName}
                                                                </a>
                                                            </strong>
                                                            <span className="ms-3">{item.marketType}</span>
                                                        </td>
                                                        <td className="border-right-0 text-center">
                                                            <a className="green-btn" href="#" type='button' onClick={handleOpenModal}>
                                                                {item.downlinePL}
                                                            </a>
                                                        </td>
                                                    </tr>
                                                    {activeIndex === index && (
                                                        <tr>
                                                            <td colspan="1" className="px-0 gray-inner_table">
                                                                <table className="selection-table">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td width="40%" className="text-start border-0">
                                                                                {item.selections.length} selections Selections
                                                                            </td>
                                                                            <td className="refer-bet border-0" colSpan={2} width="30%">
                                                                                100.8%
                                                                            </td>
                                                                            <td className="border-0 p-0" width="15%">
                                                                                <div className="back-blue back-all-size">
                                                                                    <span>Back all</span>
                                                                                </div>
                                                                            </td>
                                                                            <td className="border-0 p-0" width="15%">
                                                                                <div className="lay-all back-all-size">
                                                                                    <span>Lay all</span>
                                                                                </div>
                                                                            </td>
                                                                            <td className="refer-book border-0" colSpan={2} id="layPercent">
                                                                                99.5%
                                                                            </td>
                                                                        </tr>
                                                                        {item.selections.map((selection, selIndex) => (
                                                                            <tr key={selIndex}>
                                                                                <td className="border-start-0">
                                                                                    <a>
                                                                                        <i className="far fa-chart-bar pe-2" />
                                                                                        <strong> {selection.name}</strong>
                                                                                    </a>
                                                                                </td>
                                                                                <td className="back-3 p-0" style={{ cursor: "not-allowed" }}>
                                                                                    <div className="light-blue rounded-0">
                                                                                        <strong>{selection.back3.odds}</strong>
                                                                                        <span className="d-block">{selection.back3.amount}</span>
                                                                                    </div>
                                                                                </td>
                                                                                <td className="back-2 p-0" style={{ cursor: "not-allowed" }}>
                                                                                    <div className="light-blue rounded-0">
                                                                                        <strong>{selection.back2.odds}</strong>
                                                                                        <span className="d-block">{selection.back2.amount}</span>
                                                                                    </div>
                                                                                </td>
                                                                                <td className="back-1s p-0" style={{ cursor: "not-allowed" }}>
                                                                                    <div className="light-blue rounded-0">
                                                                                        <strong>{selection.back1.odds}</strong>
                                                                                        <span className="d-block">{selection.back1.amount}</span>
                                                                                    </div>
                                                                                </td>
                                                                                <td className="lay-1 p-0" style={{ cursor: "not-allowed" }}>
                                                                                    <div className="lay-all rounded-0">
                                                                                        <strong>{selection.lay1.odds}</strong>
                                                                                        <span className="d-block">{selection.lay1.amount}</span>
                                                                                    </div>
                                                                                </td>
                                                                                <td className="lay-2 p-0" style={{ cursor: "not-allowed" }}>
                                                                                    <div className="dark-pink rounded-0">
                                                                                        <strong>{selection.lay2.odds}</strong>
                                                                                        <span className="d-block">{selection.lay2.amount}</span>
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            ))}
                                        </table>
                                    </div>
                                </div>
                            </div>


                            {/* Bookmaker Section */}
                            <div className="risk-management-table">
                                <div className="risk-management-table-header">
                                    <h2 className="common-heading">Book Maker</h2>
                                    <div>
                                        <svg
                                            stroke="currentColor"
                                            fill="currentColor"
                                            strokeWidth={0}
                                            viewBox="0 0 24 24"
                                            height={20}
                                            width={20}
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path fill="none" d="M0 0h24v24H0z" />
                                            <path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="account-table match-odd-table">
                                    <div className="responsive">
                                        <table className="table">
                                            <tbody>
                                                <tr>
                                                    <td width="25%" rowSpan={2}>
                                                        <strong>Event/Market Name</strong>
                                                    </td>
                                                    <td
                                                        width="21%"
                                                        className="text-center border-l bg-light-yellow"
                                                        colSpan={3}
                                                    >
                                                        <strong>Book P/L</strong>
                                                    </td>
                                                    <td width="6%" rowSpan={2} className="text-center">
                                                        <strong> Downline P/L</strong>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td width="7%" className="bg-light-yellow border-0">
                                                        <strong> Min</strong>
                                                    </td>
                                                    <td width="7%" className="bg-light-yellow border-0" />
                                                    <td width="7%" className="bg-light-yellow border-0">
                                                        <strong>Max</strong>
                                                    </td>
                                                </tr>
                                            </tbody>
                                            {Bookmaker.map((item, index) => (
                                                <tbody key={item.id} className="match-tbody">
                                                    <tr>
                                                        <td className="bg-yellow border-0">
                                                            <a>
                                                                <button
                                                                    onClick={() => tableshowhide(`fancy-${index}`)}
                                                                    type="button"
                                                                    className="angle-up down-up btn btn-primary"
                                                                >
                                                                    <IoChevronUpOutline />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-primary"
                                                                    style={{
                                                                        padding: "3px 5px",
                                                                        fontSize: 12,
                                                                        marginRight: 5,
                                                                        background: "rgb(255, 184, 12)",
                                                                        fontWeight: 600,
                                                                        borderWidth: "medium",
                                                                        borderStyle: "none",
                                                                        borderColor: "currentcolor",
                                                                        borderImage: "none"
                                                                    }}
                                                                >
                                                                    View Details
                                                                </button>
                                                                <span style={{ paddingRight: 5 }}>{item.sport}</span>
                                                                <strong />
                                                            </a>
                                                            <strong>
                                                                <a className='text-dark' href={`/sportanalysis`}>
                                                                    {item.eventName}
                                                                </a>
                                                            </strong>
                                                            <span className="ms-3">{item.marketType}</span>
                                                        </td>
                                                        <td className="border-0 bg-yellow">
                                                            <p className="text-danger">({item.min})</p>
                                                        </td>
                                                        <td className="border-0 bg-yellow" />
                                                        <td className="border-0 bg-yellow">
                                                            <p className="text-success">{item.max}</p>
                                                        </td>
                                                        <td className="border-right-0 text-center">
                                                            <a onClick={handleOpenModalbookmaker} type='button' className="green-btn" href="#">
                                                                {item.downlinePL}
                                                            </a>
                                                        </td>
                                                    </tr>
                                                    {/* Additional row - shows/hides based on activeIndex */}
                                                    {activeIndex === `fancy-${index}` && (
                                                        <tr>
                                                            <td></td>
                                                            <td className="back-3 p-0" style={{ cursor: "not-allowed" }}>
                                                                <div className="light-blue rounded-0">
                                                                    <strong>--</strong>
                                                                    <span className="d-block">--</span>
                                                                </div>
                                                            </td>
                                                            <td></td>
                                                            <td className="lay-2 p-0" style={{ cursor: "not-allowed" }}>
                                                                <div className="dark-pink rounded-0">
                                                                    <strong>--</strong>
                                                                    <span className="d-block">--</span>
                                                                </div>
                                                            </td>
                                                            <td width="80" className="border-l">
                                                                <a className="green-btn" href="#s">View Bets</a>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            ))}
                                        </table>
                                    </div>
                                </div>
                            </div>
                            {/* Bookmaker Section */}
                            {/* Fancy Bet Section */}
                            <div className="risk-management-table">
                                <div className="risk-management-table-header">
                                    <h2 className="common-heading">Fancy Bet</h2>
                                    <div>
                                        <svg
                                            stroke="currentColor"
                                            fill="currentColor"
                                            strokeWidth={0}
                                            viewBox="0 0 24 24"
                                            height={20}
                                            width={20}
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path fill="none" d="M0 0h24v24H0z" />
                                            <path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="account-table match-odd-table">
                                    <div className="responsive">
                                        <table className="table">
                                            <tbody>
                                                <tr>
                                                    <td width="25%" rowSpan={2}>
                                                        <strong>Event/Market Name</strong>
                                                    </td>
                                                    <td
                                                        width="21%"
                                                        className="text-center border-l bg-light-yellow"
                                                        colSpan={3}
                                                    >
                                                        <strong>Book P/L</strong>
                                                    </td>
                                                    <td width="6%" rowSpan={2} className="text-center">
                                                        <strong> Downline P/L</strong>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td width="7%" className="bg-light-yellow border-0">
                                                        <strong> Min</strong>
                                                    </td>
                                                    <td width="7%" className="bg-light-yellow border-0" />
                                                    <td width="7%" className="bg-light-yellow border-0">
                                                        <strong>Max</strong>
                                                    </td>
                                                </tr>
                                            </tbody>
                                            {fancyBetData.map((item, index) => (
                                                <tbody key={item.id} className="match-tbody">
                                                    <tr>
                                                        <td className="bg-yellow border-0">
                                                            <a>
                                                                <button
                                                                    onClick={() => tableshowhide(`fancy-${index}`)}
                                                                    type="button"
                                                                    className="angle-up down-up btn btn-primary"
                                                                >
                                                                    <IoChevronUpOutline />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-primary"
                                                                    style={{
                                                                        padding: "3px 5px",
                                                                        fontSize: 12,
                                                                        marginRight: 5,
                                                                        background: "rgb(255, 184, 12)",
                                                                        fontWeight: 600,
                                                                        borderWidth: "medium",
                                                                        borderStyle: "none",
                                                                        borderColor: "currentcolor",
                                                                        borderImage: "none"
                                                                    }}
                                                                >
                                                                    View Details
                                                                </button>
                                                                <span style={{ paddingRight: 5 }}>{item.sport}</span>
                                                                <strong />
                                                            </a>
                                                            <strong>
                                                                <a className='text-dark' href={`/sportanalysis`}>
                                                                    {item.eventName}
                                                                </a>
                                                            </strong>
                                                            <span className="ms-3">{item.marketType}</span>
                                                        </td>
                                                        <td className="border-0 bg-yellow">
                                                            <p className="text-danger">({item.min})</p>
                                                        </td>
                                                        <td className="border-0 bg-yellow" />
                                                        <td className="border-0 bg-yellow">
                                                            <p className="text-success">{item.max}</p>
                                                        </td>
                                                        <td className="border-right-0 text-center">
                                                            <a onClick={handleOpenModal} type='button' className="green-btn" href="#">
                                                                {item.downlinePL}
                                                            </a>
                                                        </td>
                                                    </tr>
                                                    {/* Additional row - shows/hides based on activeIndex */}
                                                    {activeIndex === `fancy-${index}` && (
                                                        <tr>
                                                            <td></td>
                                                            <td className="back-3 p-0" style={{ cursor: "not-allowed" }}>
                                                                <div className="light-blue rounded-0">
                                                                    <strong>--</strong>
                                                                    <span className="d-block">--</span>
                                                                </div>
                                                            </td>
                                                            <td></td>
                                                            <td className="lay-2 p-0" style={{ cursor: "not-allowed" }}>
                                                                <div className="dark-pink rounded-0">
                                                                    <strong>--</strong>
                                                                    <span className="d-block">--</span>
                                                                </div>
                                                            </td>
                                                            <td width="80" className="border-l">
                                                                <a className="green-btn" href="#s">View Bets</a>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            ))}
                                        </table>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
            {showModal && (
                <div className="allcommon">
                    <div
                        className="modal show d-block"
                        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                        onClick={handleCloseModal}
                    >
                        <div
                            className="modal-dialog modal-xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="common-heading">ICC Womens T20 World Cup ( Match Odds ) Winner</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={handleCloseModal}
                                    ></button>
                                </div>
                                <div className="modal-body p-0  ">
                                    <div className="table-responsive account-table risk-pop">
                                        <table className="table table-bordered">
                                            <thead>
                                                <tr>
                                                    {tableData.headers.map((header, index) => (
                                                        <th key={index} scope="col">
                                                            {header}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className="text-start">
                                                        <a href="#">
                                                            <span className="text-primary">AG</span> agvip
                                                        </a>
                                                    </td>
                                                    {tableData.rows[0].values.map((value, idx) => (
                                                        <td key={idx}>
                                                            <span className={value === '900.00' ? 'text-danger' : 'text-success'}>
                                                                {value}
                                                            </span>
                                                        </td>
                                                    ))}
                                                </tr>
                                                <tr style={{ fontWeight: 600 }}>
                                                    <td className="text-start">Total</td>
                                                    {totalValues.map((value, idx) => (
                                                        <td key={idx}>
                                                            <span className={value === '900.00' ? 'text-danger' : 'text-success'}>
                                                                {value}
                                                            </span>
                                                        </td>
                                                    ))}
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            )}
            {bookmarkettable && (
                <div className="allcommon">
                    <div
                        className="modal show d-block"
                        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                        onClick={handleCloseModalbookmaker}
                    >
                        <div
                            className="modal-dialog modal-xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="common-heading">West Indies v Sri Lanka ( Match Odds )</h5>
                                    <button
                                        type="button"
                                        className="green-btn btn btn-primary"
                                        onClick={handleCloseModalbookmaker}
                                    ></button>
                                </div>
                                <div className="modal-body p-0  ">
                                 <div className="table-responsive account-table risk-pop" >
  <table className="table">
    <thead>
      <tr>
        <th scope="col">Downline</th>
        <th scope="col"> Boost Defenders</th>
        <th scope="col">Band-E-Amir Dragons</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td className="text-start">
          <a href="/RiskManagement" />
          <a href="#" className="text-primary">
            <span>AG</span>
          </a>
          agvip
        </td>
        <td>
          <span className="text-danger">-3762.2</span>
        </td>
        <td>
          <span className="text-danger">-2480</span>
        </td>
      </tr>
      <tr>
        <td className="text-start">
          <a href="/RiskManagement" />
          <a href="#" className="text-primary">
            <span>AG</span>
          </a>
          guru001
        </td>
        <td>
          <span className="text-danger">-9310</span>
        </td>
        <td>
          <span className="text-danger">-5450</span>
        </td>
      </tr>
      <tr>
        <td className="text-start">
          <a href="/RiskManagement" />
          <a href="#" className="text-primary">
            <span>AG</span>
          </a>
          manjanna009b
        </td>
        <td>
          <span className="text-danger">-1150</span>
        </td>
        <td>
          <span className="text-success">500</span>
        </td>
      </tr>
      <tr>
        <td className="text-start">
          <a href="/RiskManagement" />
          <a href="#" className="text-primary">
            <span>AG</span>
          </a>
          ambu010
        </td>
        <td>
          <span className="text-danger">-20700</span>
        </td>
        <td>
          <span className="text-success">16001</span>
        </td>
      </tr>
      <tr>
        <td className="text-start">
          <a href="/RiskManagement" />
          <a href="#" className="text-primary">
            <span>AG</span>
          </a>
          shivu hlk
        </td>
        <td>
          <span className="text-danger">-3440</span>
        </td>
        <td>
          <span className="text-danger">-2160</span>
        </td>
      </tr>
      <tr>
        <td className="text-start">
          <a href="/RiskManagement" />
          <a href="#" className="text-primary">
            <span>AG</span>
          </a>
          rahmath ajjampura
        </td>
        <td>
          <span className="text-success">1180</span>
        </td>
        <td>
          <span className="text-danger">-2200</span>
        </td>
      </tr>
      <tr>
        <td className="text-start">
          <a href="/RiskManagement" />
          <a href="#" className="text-primary">
            <span>AG</span>
          </a>
          amith gowda
        </td>
        <td>
          <span className="text-success">1860</span>
        </td>
        <td>
          <span className="text-danger">-3000</span>
        </td>
      </tr>
      <tr>
        <td className="text-start">
          <a href="/RiskManagement" />
          <a href="#" className="text-primary">
            <span>AG</span>
          </a>
          rakesh bng
        </td>
        <td>
          <span className="text-danger">0</span>
        </td>
        <td>
          <span className="text-danger">-3763.2</span>
        </td>
      </tr>
      <tr>
        <td className="text-start">
          <a href="/RiskManagement" />
          <a href="#" className="text-primary">
            <span>AG</span>
          </a>
          madhu77
        </td>
        <td>
          <span className="text-danger">-4000</span>
        </td>
        <td>
          <span className="text-danger">-4380</span>
        </td>
      </tr>
      <tr>
        <td className="text-start">
          <a href="/RiskManagement" />
          <a href="#" className="text-primary">
            <span>AG</span>
          </a>
          dadu hsd
        </td>
        <td>
          <span className="text-danger">-2330</span>
        </td>
        <td>
          <span className="text-danger">-2190</span>
        </td>
      </tr>
      <tr style={{ fontWeight: 600 }}>
        <td className="text-start">Total</td>
        <td>
          <span className="text-danger">-41652.2</span>
        </td>
        <td>
          <span className="text-danger">-9122.2</span>
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
            )}
        </main>
    )
}

export default Riskmangement