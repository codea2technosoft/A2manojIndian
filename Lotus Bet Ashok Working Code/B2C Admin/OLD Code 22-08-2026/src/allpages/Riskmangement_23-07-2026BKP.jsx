import React, { useState, useEffect } from 'react'
import Heading from '../Layout/Heading'
import { IoChevronUpOutline } from "react-icons/io5";
import { getRiskManagementAll } from "../Server/api";
import { Modal } from 'react-bootstrap';

function Riskmangement() {
    const [activeIndex, setActiveIndex] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [bookmarkettable, setBookmarkettable] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [apiData, setApiData] = useState({ match_odds: [], book_maker: [], fancy_bet: [] });
    const [sectionTitles, setSectionTitles] = useState({
        matchOdds: 'Match Odds',
        bookMaker: 'Book Maker',
        fancyBet: 'Fancy Bet'
    });

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);
    const handleOpenModalbookmaker = () => setBookmarkettable(true);
    const handleCloseModalbookmaker = () => setBookmarkettable(false);
    const [showBetsModal, setShowBetsModal] = useState(false);

    const handleOpenBetsModal = () => setShowBetsModal(true);
    const handleCloseBetsModal = () => setShowBetsModal(false);

    useEffect(() => {
        fetchRiskManagementData();
    }, []);

    const fetchRiskManagementData = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = {
                admin_id: '',
                agent_id: '',
                event_id: '',
                type: '',
                sport_id: '',
                from_date: new Date().toISOString().split('T')[0],
                to_date: new Date().toISOString().split('T')[0]
            };

            const response = await getRiskManagementAll(params);
            
            if (response?.data?.data) {
                setApiData(response.data.data);
                
                const titles = {};
                if (response.data.data.match_odds && response.data.data.match_odds.length > 0) {
                    titles.matchOdds = 'Match Odds';
                }
                if (response.data.data.book_maker && response.data.data.book_maker.length > 0) {
                    titles.bookMaker = 'Book Maker';
                }
                if (response.data.data.fancy_bet && response.data.data.fancy_bet.length > 0) {
                    titles.fancyBet = 'Fancy Bet';
                }
                
                setSectionTitles(prev => ({
                    ...prev,
                    ...titles
                }));
            } else {
                setApiData({ match_odds: [], book_maker: [], fancy_bet: [] });
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch risk management data');
            console.error('Error fetching risk management data:', err);
        } finally {
            setLoading(false);
        }
    };

    const tableshowhide = (index) => {
        setActiveIndex((prev) => (prev === index ? null : index));
    };

    // ONLY ONE transformApiData function - remove the duplicate
    const transformApiData = (type) => {
        if (!apiData || typeof apiData !== 'object') {
            return [];
        }
        
        let dataArray = [];
        if (type === 'match_odds' && Array.isArray(apiData.match_odds)) {
            dataArray = apiData.match_odds;
        } else if (type === 'bookmaker' && Array.isArray(apiData.book_maker)) {
            dataArray = apiData.book_maker;
        } else if (type === 'fancy_bet' && Array.isArray(apiData.fancy_bet)) {
            dataArray = apiData.fancy_bet;
        }
        
        return dataArray.map((item, index) => {
            const teams = item.book_pl?.formatted || [];

            const selections = teams.map(team => ({
                name: team.team_name || 'Unknown',
                back3: { odds: "0.00", amount: "--" },
                back2: { odds: "0.00", amount: "--" },
                back1: { odds: "--", amount: "--" },
                lay1: { odds: "0.00", amount: "--" },
                lay2: { odds: "0.00", amount: "--" }
            }));

            return {
                id: index + 1,
                sport: "cricket",
                eventName: item.event_name || 'Unknown Event',
                marketType: item.display_type || type,
                selections: selections.length > 0 ? selections : [
                    { name: "No Data", back3: { odds: "--", amount: "--" }, back2: { odds: "--", amount: "--" }, back1: { odds: "--", amount: "--" }, lay1: { odds: "--", amount: "--" }, lay2: { odds: "--", amount: "--" } }
                ],
                downlinePL: item.view_details ? "View" : "View",
                min: item.book_pl?.total ? `${Math.min(0, item.book_pl.total)}` : "0",
                max: item.book_pl?.total ? `${Math.max(0, item.book_pl.total)}` : "0",
                bookPL1: teams.length > 0 ? { team: teams[0]?.team_name || '', value: teams[0]?.amount || 0 } : null,
                bookPL2: teams.length > 1 ? { team: teams[1]?.team_name || '', value: teams[1]?.amount || 0 } : null,
                totalBets: item.totalBets || 0,
                totalBack: item.totalBack || 0,
                totalLay: item.totalLay || 0
            };
        });
    };

    const matchOddsData = transformApiData('match_odds');
    const Bookmaker = transformApiData('bookmaker');
    const fancyBetData = transformApiData('fancy_bet');

    // Your tableData and rest of the code remains the same...
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

    // Rest of your component continues...
    if (loading) {
        return (
            <main className='riskmangement'>
                <section className="main-inner-outer py-4" style={{ fontSize: 14 }}>
                    <div className="container-fluid">
                        <Heading title="Risk Management" />
                        <div className="inner-wrapper">
                            <div className="common-container">
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <p className="mt-2">Loading risk management data...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        );
    }

    if (error) {
        return (
            <main className='riskmangement'>
                <section className="main-inner-outer py-4" style={{ fontSize: 14 }}>
                    <div className="container-fluid">
                        <Heading title="Risk Management" />
                        <div className="inner-wrapper">
                            <div className="common-container">
                                <div className="alert alert-danger" role="alert">
                                    <strong>Error:</strong> {error}
                                    <button
                                        className="btn btn-primary ms-3"
                                        onClick={fetchRiskManagementData}
                                    >
                                        Retry
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        );
    }

    return (
        <main className='riskmangement'>
            {/* Your JSX remains the same */}
            <section className=" main-inner-outer py-4" style={{ fontSize: 14 }}>
                <div className="container-fluid">
                    <Heading title="Risk Management" />
                    <div className="inner-wrapper">
                        <div className="common-container">
                            {/* Match Odds Section */}
                            <div className="risk-management-table">
                                <div className="risk-management-table-header">
                                    <h2 className="common-heading">{sectionTitles.matchOdds}</h2>
                                    <button type="button" className="btn-close"></button>
                                </div>
                                <div className="account-table match-odd-table">
                                    <div className="table-responsive">
                                        <table className="table">
                                            {/* Your table content */}
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
                                            {matchOddsData.map((item, index) => (
                                                <tbody key={item.id} className="match-tbody">
                                                    {/* Your row content */}
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
                                                        <td className="border-0 bg-yellow">
                                                            <p className="text-danger">({item.min})</p>
                                                        </td>
                                                        <td className="border-0 bg-yellow" />
                                                        <td className="border-0 bg-yellow">
                                                            <p className="text-success">{item.max}</p>
                                                        </td>
                                                        <td className="border-right-0 text-center">
                                                            <a className="green-btn" href="#" type='button' onClick={handleOpenModal}>
                                                                {item.downlinePL}
                                                            </a>
                                                        </td>
                                                    </tr>
                                                    {activeIndex === index && (
                                                        <tr>
                                                            <td colSpan="4" className="px-0 gray-inner_table">
                                                                <table className="selection-table w-100">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td width="30%" className="text-start border-0">
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
                                                                            <td className="refer-book border-0" colSpan={2}
                                                                                width="5%"
                                                                                id="layPercent">
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
                                                            <td
                                                                className="text-center border-0">
                                                                <a className="green-btn" onClick={handleOpenBetsModal} style={{ whiteSpace: "nowrap" }} href="#">View Bets</a>
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
                                    <h2 className="common-heading">{sectionTitles.bookMaker}</h2>
                                    <button type="button" className="btn-close"></button>
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
                                                    {activeIndex === `fancy-${index}` && (
                                                        <tr>
                                                            <td colSpan="4" className="px-0 gray-inner_table">
                                                                <table className="selection-table w-100">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td className="back-3 p-0" style={{ cursor: "not-allowed" }}>
                                                                                <div className="light-blue rounded-0">
                                                                                    <strong>--</strong>
                                                                                    <span className="d-block">--</span>
                                                                                </div>
                                                                            </td>
                                                                            <td className="back-2 p-0" style={{ cursor: "not-allowed" }}>
                                                                                <div className="light-blue rounded-0">
                                                                                    <strong>--</strong>
                                                                                    <span className="d-block">--</span>
                                                                                </div>
                                                                            </td>
                                                                            <td className="back-1s p-0" style={{ cursor: "not-allowed" }}>
                                                                                <div className="light-blue rounded-0">
                                                                                    <strong>--</strong>
                                                                                    <span className="d-block">--</span>
                                                                                </div>
                                                                            </td>
                                                                            <td className="lay-1 p-0" style={{ cursor: "not-allowed" }}>
                                                                                <div className="lay-all rounded-0">
                                                                                    <strong>--</strong>
                                                                                    <span className="d-block">--</span>
                                                                                </div>
                                                                            </td>
                                                                            <td className="lay-2 p-0" style={{ cursor: "not-allowed" }}>
                                                                                <div className="dark-pink rounded-0">
                                                                                    <strong>--</strong>
                                                                                    <span className="d-block">--</span>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                            <td width="80" className="border-l text-center">
                                                                <a className="green-btn" onClick={handleOpenBetsModal} href="#">View Bets</a>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            ))}
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Fancy Bet Section */}
                            <div className="risk-management-table">
                                <div className="risk-management-table-header">
                                    <h2 className="common-heading">{sectionTitles.fancyBet}</h2>
                                    <button type="button" className="btn-close"></button>
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
                                                    {activeIndex === `fancy-${index}` && (
                                                        <tr>
                                                            <td colSpan="4" className="px-0 gray-inner_table">
                                                                <table className="selection-table w-100">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td className="back-3 p-0" style={{ cursor: "not-allowed" }}>
                                                                                <div className="light-blue rounded-0">
                                                                                    <strong>--</strong>
                                                                                    <span className="d-block">--</span>
                                                                                </div>
                                                                            </td>
                                                                            <td className="back-2 p-0" style={{ cursor: "not-allowed" }}>
                                                                                <div className="light-blue rounded-0">
                                                                                    <strong>--</strong>
                                                                                    <span className="d-block">--</span>
                                                                                </div>
                                                                            </td>
                                                                            <td className="back-1s p-0" style={{ cursor: "not-allowed" }}>
                                                                                <div className="light-blue rounded-0">
                                                                                    <strong>--</strong>
                                                                                    <span className="d-block">--</span>
                                                                                </div>
                                                                            </td>
                                                                            <td className="lay-1 p-0" style={{ cursor: "not-allowed" }}>
                                                                                <div className="lay-all rounded-0">
                                                                                    <strong>--</strong>
                                                                                    <span className="d-block">--</span>
                                                                                </div>
                                                                            </td>
                                                                            <td className="lay-2 p-0" style={{ cursor: "not-allowed" }}>
                                                                                <div className="dark-pink rounded-0">
                                                                                    <strong>--</strong>
                                                                                    <span className="d-block">--</span>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                            <td width="80" className="border-l">
                                                                <a className="green-btn" onClick={handleOpenBetsModal} href="#">View Bets</a>
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

            {/* Modals remain the same */}
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
                                <div className="modal-header d-flex justify-content-between align-items-center">
                                    <h5 className="common-heading">ICC Womens T20 World Cup ( Match Odds ) Winner</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={handleCloseModal}
                                    ></button>
                                </div>
                                <div className="modal-body p-0">
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
                                <div className="modal-header d-flex justify-content-between align-items-center">
                                    <h5 className="common-heading">West Indies v Sri Lanka ( Match Odds )</h5>
                                    <button
                                        type="button"
                                        className="green-btn btn btn-primary"
                                        onClick={handleCloseModalbookmaker}
                                    > X</button>
                                </div>
                                <div className="modal-body p-0">
                                    <div className="table-responsive account-table risk-pop">
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
                                                        <a href="#">
                                                            <span className="text-primary">AG</span>
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
                                                        <a href="#">
                                                            <span className="text-primary">AG</span>
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
                                                        <a href="#">
                                                            <span className="text-primary">AG</span>
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
                                                        <a href="#">
                                                            <span className="text-primary">AG</span>
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
                                                        <a href="#">
                                                            <span className="text-primary">AG</span>
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
                                                        <a href="#">
                                                            <span className="text-primary">AG</span>
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
                                                        <a href="#">
                                                            <span className="text-primary">AG</span>
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
                                                        <a href="#">
                                                            <span className="text-primary">AG</span>
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
                                                        <a href="#">
                                                            <span className="text-primary">AG</span>
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
                                                        <a href="#">
                                                            <span className="text-primary">AG</span>
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

            <Modal
                show={showBetsModal}
                onHide={handleCloseBetsModal}
                size="xl"
                centered
            >
                <Modal.Body>
                    <section className="account-table">
                        <div className="container-fluid">
                            <div className="db-sec d-flex justify-content-between align-items-center mb-2">
                                <h2 className="common-heading">
                                    Yorkshire v Hampshire (Book Maker)
                                </h2>
                                <button
                                    type="button"
                                    className="green-btn btn btn-primary"
                                    onClick={handleCloseBetsModal}
                                >
                                    X
                                </button>
                            </div>
                            <div className="responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>PL ID</th>
                                            <th>Bet ID</th>
                                            <th>Bet placed</th>
                                            <th>IP Address</th>
                                            <th>Market</th>
                                            <th>Selection</th>
                                            <th>Type</th>
                                            <th>Odds req.</th>
                                            <th>Stake</th>
                                            <th>Liability</th>
                                            <th>Profit/Loss</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>rani098</td>
                                            <td>mrui9m76</td>
                                            <td>7/21/2026, 3:53:20 PM</td>
                                            <td>106.221.207.104</td>
                                            <td className="text-start">
                                                <div style={{ padding: "1px" }}>
                                                    <span>Cricket</span>
                                                    <span className="angle_unicode">▸</span>
                                                    <strong>Yorkshire v Hampshire</strong>
                                                    <span className="angle_unicode">▸</span>
                                                    <span>Match Odds Book Maker</span>
                                                </div>
                                            </td>
                                            <td>Yorkshire</td>
                                            <td>lay</td>
                                            <td>0.83</td>
                                            <td>5000</td>
                                            <td>4150</td>
                                            <td>
                                                <span className="text-danger">
                                                    -(4150)
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>
                </Modal.Body>
            </Modal>
        </main>
    );
}

export default Riskmangement