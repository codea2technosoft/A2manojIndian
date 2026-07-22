import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from './Layout';
import {
    getBetHistoryUserPlReport,  // ✅ API import
} from "../../Server/api";

const BettingHistory = () => {
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState('Exchange');
    const [betData, setBetData] = useState({});
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalBets, setTotalBets] = useState(0);
    const itemsPerPage = 5;

    // Get agent_id from URL
    const agentId = searchParams.get('admin_id') || localStorage.getItem("admin_id");

    // Define tabs
    const tabs = ['Exchange', 'FancyBet', 'BookMaker', 'casino', 'Toss', 'Tie', 'lottery'];

    // ✅ Get tab specific params
    const getTabParams = (tabKey) => {
        const paramsMap = {
            'Exchange': { sport_id: '', bet_type: '' },
            'FancyBet': { sport_id: '4', bet_type: 'fancy' },
            'BookMaker': { sport_id: '4', bet_type: 'bookmaker' },
            'casino': { sport_id: '', bet_type: 'casino' },
            'Toss': { sport_id: '', bet_type: 'toss' },
            'Tie': { sport_id: '', bet_type: 'tie' },
            'lottery': { sport_id: '', bet_type: 'lottery' },
        };
        return paramsMap[tabKey] || { sport_id: '', bet_type: 'all' };
    };

    // ✅ Fetch bets data
    const fetchBets = async (tabKey, page = 1) => {
        if (!agentId) {
            console.error("No agent_id found");
            return;
        }

        const { sport_id, bet_type } = getTabParams(tabKey);

        setLoading(true);
        try {
            const params = {
                agent_id: agentId,
                admin_id: '',
                user_id: '',
                sport_id: sport_id,
                bet_type: bet_type,
                bet_on: '',
                from_date: '',
                to_date: '',
                keyword: '',
                page: page,
                limit: itemsPerPage,
            };

            console.log(`📡 Fetching bets for ${tabKey} with params:`, params);

            const response = await getBetHistoryUserPlReport(params);
            console.log("✅ API Response:", response);

            // ✅ Handle response
            let bets = [];
            let total = 0;
            let totalPagesCount = 1;

            if (response?.success) {
                bets = response.data || [];
                total = response.pagination?.total || 0;
                totalPagesCount = response.pagination?.totalPages || 1;
            } else if (response?.data?.success) {
                const result = response.data;
                bets = result.data || [];
                total = result.pagination?.total || 0;
                totalPagesCount = result.pagination?.totalPages || 1;
            } else if (response?.data) {
                const result = response.data;
                bets = result.data || result.bets || result.results || [];
                total = result.pagination?.total || result.total || bets.length;
                totalPagesCount = result.pagination?.totalPages || Math.ceil(total / itemsPerPage) || 1;
            } else if (Array.isArray(response)) {
                bets = response;
                total = bets.length;
                totalPagesCount = Math.ceil(total / itemsPerPage);
            } else {
                bets = [];
            }

            // ✅ Map data based on tab
            const mappedData = bets.map((item) => {
                const baseData = {
                    pl_id: item.pl_id || item.user?.username || '-',
                    bet_id: item.bet_id || '-',
                    bet_placed: item.bet_placed || item.created_at ?
                        new Date(item.bet_placed || item.created_at).toLocaleString() :
                        'N/A',
                    ip: item.ip_address || '-',
                    market: item.market || item.game_name || '-',
                    selection: item.selection || item.team || '-',
                    type: item.type || item.bet_on || '-',
                    odds: item.odds_req || item.odd || 0,
                    stake: item.stake || 0,
                    profit_loss: item.profit_loss || 0,
                };

                // Tab specific fields
                if (tabKey === 'casino') {
                    return {
                        ...baseData,
                        game_name: item.game_name || item.market || '-',
                        result: item.result || item.status || '-',
                    };
                } else if (tabKey === 'Toss') {
                    return {
                        ...baseData,
                        match: item.match || item.team || '-',
                        toss_result: item.toss_result || item.selection || '-',
                    };
                } else if (tabKey === 'lottery') {
                    return {
                        ...baseData,
                        lottery_name: item.lottery_name || item.game_name || '-',
                        status: item.status || item.bet_status || 'Pending',
                    };
                } else if (tabKey === 'FancyBet' || tabKey === 'BookMaker') {
                    return {
                        bet_id: item.bet_id || item._id || '-',
                        pl_id: item.pl_id || item.user?.username || '-',
                        market: item.market || item.game_name || '-',
                        bet_placed: item.bet_placed || item.created_at ?
                            new Date(item.bet_placed || item.created_at).toLocaleString() :
                            '-',
                        stake: item.stake || 0,
                        profit_loss: item.profit_loss || 0,
                    };
                }

                return baseData;
            });

            // ✅ Update state for current tab
            setBetData(prev => ({
                ...prev,
                [tabKey]: {
                    headers: getHeadersForTab(tabKey),
                    data: mappedData
                }
            }));

            setTotalPages(totalPagesCount || 1);
            setTotalBets(total || mappedData.length);

        } catch (error) {
            console.error("❌ Fetch Error:", error);
            setBetData(prev => ({
                ...prev,
                [tabKey]: {
                    headers: getHeadersForTab(tabKey),
                    data: []
                }
            }));
            setTotalPages(1);
            setTotalBets(0);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Get headers based on tab
    const getHeadersForTab = (tabKey) => {
        const headerMap = {
            'Exchange': '',
            'FancyBet': '',
            'BookMaker': '',
            'casino': ['Game ID', 'PL ID', 'Market', 'Bet Placed', 'Stake', 'Profit / Loss'],
            'Toss': '',
            'Tie': '',
            'lottery': '',
        };
        return headerMap[tabKey] ||  ['PL ID', 'Bet ID', 'Bet placed', 'IP Address', 'Market', 'Selection', 'Type', 'Odds req.', 'Stake', 'Profit/Loss'];
    };

    // ✅ Fetch on tab change or page change
    useEffect(() => {
        if (agentId) {
            fetchBets(activeTab, currentPage);
        }
    }, [activeTab, currentPage, agentId]);

    // ✅ Render table
    const renderTable = (tabKey) => {
        const tabInfo = betData[tabKey];

        // If no data yet, show loading or empty state
        if (!tabInfo) {
            return (
                <div className="common-container">
                    <div className="account-table batting-table profit_loss_table w-100">
                        <div className="responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        {getHeadersForTab(tabKey).map((header, index) => (
                                            <th key={index} scope="col">{header}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td colSpan="10">
                                            <span>Loading...</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            );
        }

        const headers = tabInfo.headers;
        const data = tabInfo.data;

        // Pagination logic
        const totalPagesCount = Math.ceil(data.length / itemsPerPage) || 1;

        return (
            <div className="common-container">
                <div className="account-table batting-table profit_loss_table w-100">
                    <div className="responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    {headers.map((header, index) => (
                                        <th key={index} scope="col">{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="10" className="text-center">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : data.length > 0 ? (
                                    data.map((item, index) => (
                                        <tr key={index}>
                                            {Object.values(item).map((value, idx) => (
                                                <td key={idx}>{value}</td>
                                            ))}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="10">
                                            <span>You have no bets in this time period.</span>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        {data.length > 0 && (
                            <div className="bottom-pagination">
                                <ul role="navigation" aria-label="Pagination">
                                    <li className={`previous ${currentPage === 1 ? 'disabled' : ''}`}>
                                        <a
                                            className=""
                                            tabIndex={currentPage === 1 ? "-1" : "0"}
                                            role="button"
                                            aria-disabled={currentPage === 1}
                                            aria-label="Previous page"
                                            rel="prev"
                                            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                                        >
                                            &lt;
                                        </a>
                                    </li>
                                    <li className="page-info">
                                        <span>Page {currentPage} of {totalPages}</span>
                                    </li>
                                    <li className={`next ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}`}>
                                        <a
                                            className=""
                                            tabIndex={currentPage === totalPages || totalPages === 0 ? "-1" : "0"}
                                            role="button"
                                            aria-disabled={currentPage === totalPages || totalPages === 0}
                                            aria-label="Next page"
                                            rel="next"
                                            onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                                        >
                                            &gt;
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Layout activeItem="betting-history">
            <div className="right_side">
                <div className="inner-wrapper">
                    <h2 className="common-heading">Betting History</h2>
                    <div className="common-tab">
                        <ul className="nav nav-tabs" role="tablist">
                            {tabs.map((tab) => (
                                <li className="nav-item" role="presentation" key={tab}>
                                    <button
                                        type="button"
                                        role="tab"
                                        aria-selected={activeTab === tab}
                                        className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                                        onClick={() => {
                                            setActiveTab(tab);
                                            setCurrentPage(1);
                                        }}
                                    >
                                        {tab === 'casino' ? 'Casino' : tab}
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <div className="tab-content">
                            {tabs.map((tab) => (
                                <div
                                    key={tab}
                                    role="tabpanel"
                                    className={`fade tab-pane ${activeTab === tab ? 'active show' : ''}`}
                                >
                                    {activeTab === tab && renderTable(tab)}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default BettingHistory;