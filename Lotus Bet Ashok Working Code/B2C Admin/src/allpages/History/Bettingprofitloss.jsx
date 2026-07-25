import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from './Layout';
import {
    getBettingProfitLoss,
    getBettingProfitLossDetail
} from "../../Server/api";

function Bettingprofitloss() {
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState('Exchange');
    const [betStatus, setBetStatus] = useState('unmatched');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [noBetsMessage, setNoBetsMessage] = useState('You have no bets in this time period.');
    const [loading, setLoading] = useState(false);
    const [profitLossData, setProfitLossData] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [selectedMarket, setSelectedMarket] = useState(null);
    const [detailData, setDetailData] = useState(null);
    const [showDetail, setShowDetail] = useState(false);
    const [detailLoading, setDetailLoading] = useState(false);
    const [expandedRow, setExpandedRow] = useState(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    // Get agent_id from URL
    const agentId = searchParams.get('admin_id') || localStorage.getItem("admin_id");
    const role = searchParams.get('role'); // ✅ ROLE EXTRACT KIYA

    // Tab configuration
    const tabs = [
        'Exchange',
        'FancyBet',
        'BookMaker',
        'casino',
        'Toss',
        'Tie',
        'Indian Casino',
        'lottery'
    ];

    // Tab headers
    const tabHeaders = {
        Exchange: ['Market', 'Settled Date', 'Profit / Loss', ''],
        FancyBet: ['Market', 'Settled Date', 'Profit / Loss', ''],
        BookMaker: ['Market', 'Settled Date', 'Profit / Loss', ''],
        casino: ['Market', 'Profit / Loss', ''],
        Toss: ['Market', 'Settled Date', 'Profit / Loss', ''],
        Tie: ['Market', 'Settled Date', 'Profit / Loss', ''],
        'Indian Casino': ['Market', 'Profit / Loss', ''],
        lottery: ['PL ID', 'Bet ID', 'Bet placed', 'Match', 'Lottery Type', 'Bhav', 'P/L', '']
    };

    const betStatusOptions = [
        { value: 'unmatched', label: 'Unmatched' },
        { value: 'matched', label: 'Matched' },
        { value: 'completed', label: 'Settled' },
        { value: 'suspend', label: 'Cancelled' },
        { value: 'voided', label: 'Voided' }
    ];

    // ✅ Get tab specific params
    const getTabParams = (tabKey) => {
        const paramsMap = {
            'Exchange': { sport_id: '', bet_type: '' },
            'FancyBet': { sport_id: '4', bet_type: 'fancy' },
            'BookMaker': { sport_id: '4', bet_type: 'bookmaker' },
            'casino': { sport_id: '', bet_type: 'casino' },
            'Toss': { sport_id: '', bet_type: 'toss' },
            'Tie': { sport_id: '', bet_type: 'tie' },
            'Indian Casino': { sport_id: '', bet_type: 'casino' },
            'lottery': { sport_id: '', bet_type: 'lottery' },
        };
        return paramsMap[tabKey] || { sport_id: '', bet_type: 'all' };
    };

    // ✅ Fetch Profit Loss data
    const fetchProfitLoss = async (page = 1) => {
        if (!agentId) {
            console.error("No agent_id found");
            return;
        }

        const { sport_id, bet_type } = getTabParams(activeTab);

        setLoading(true);
        setShowDetail(false);
        setSelectedMarket(null);
        setExpandedRow(null);
        try {
            // ✅ BASE PARAMS
            const params = {
                user_id: '',
                sport_id: sport_id,
                bet_type: bet_type,
                bet_on: '',
                from_date: startDate || null,
                to_date: endDate || null,
                market_name: '',
                keyword: '',
                page: page,
                limit: 50,
            };

            // ✅ CONDITION: Role ke hisaab se parameter bhejo
            if (role === '2') {
                params.agent_id = agentId;  // role=2 → agent_id
                console.log("✅ Role=2: Sending agent_id");
            } else if (role === '3') {
                params.admin_id = agentId;  // role=3 → admin_id
                console.log("✅ Role=3: Sending admin_id");
            } else {
                params.agent_id = agentId;  // default
                console.log("✅ Default: Sending agent_id");
            }

            console.log(`📡 Fetching Profit/Loss for ${activeTab} with params:`, params);

            const response = await getBettingProfitLoss(params);
            console.log("✅ API Response:", response);

            // ✅ Handle response - status_code se check karo
            let data = [];
            let total = 0;
            let totalPagesCount = 1;

            if (response?.status_code === 1) {
                data = response.data || [];
                total = response.pagination?.total || 0;
                totalPagesCount = response.pagination?.totalPages || 1;
            } else if (response?.success) {
                data = response.data || [];
                total = response.pagination?.total || 0;
                totalPagesCount = response.pagination?.totalPages || 1;
            } else if (response?.data?.success) {
                const result = response.data;
                data = result.data || [];
                total = result.pagination?.total || 0;
                totalPagesCount = result.pagination?.totalPages || 1;
            } else if (response?.data) {
                const result = response.data;
                data = result.data || result.results || [];
                total = result.pagination?.total || result.total || data.length;
                totalPagesCount = result.pagination?.totalPages || Math.ceil(total / 50) || 1;
            } else if (Array.isArray(response)) {
                data = response;
                total = data.length;
                totalPagesCount = Math.ceil(total / 50);
            } else {
                data = [];
            }

            console.log("📊 Mapped Data:", data);

            // ✅ Map data based on tab
            const mappedData = data.map((item) => {
                const baseData = {
                    market: item.market_name || item.market || item.game_name || 'N/A',
                    settled_date: item.settledDate || item.settled_date || item.created_at ?
                        new Date(item.settledDate || item.settled_date || item.created_at).toLocaleString() :
                        'N/A',
                    profit_loss: item.totalAmount || item.profit_loss || item.pl || 0,
                    event_id: item._id?.event_id || item.event_id || item._id || '',
                    market_name: item.market_name || item.market || '',
                    bets: item.bets || [],
                    summary: item.summary || null,
                };

                if (activeTab === 'lottery') {
                    return {
                        pl_id: item.pl_id || item.user_id || 'N/A',
                        bet_id: item.bet_id || item._id || 'N/A',
                        bet_placed: item.bet_placed || item.created_at ?
                            new Date(item.bet_placed || item.created_at).toLocaleString() :
                            'N/A',
                        match: item.match || item.match_name || 'N/A',
                        lottery_type: item.lottery_type || item.game_name || 'N/A',
                        bhav: item.bhav || item.odds || 0,
                        pl: item.profit_loss || item.pl || 0,
                        bets: item.bets || [],
                        summary: item.summary || null,
                    };
                }

                if (activeTab === 'casino' || activeTab === 'Indian Casino') {
                    return {
                        market: item.market_name || item.game_name || 'N/A',
                        profit_loss: item.totalAmount || item.profit_loss || item.pl || 0,
                        bets: item.bets || [],
                        summary: item.summary || null,
                    };
                }

                return baseData;
            });

            setProfitLossData(prev => ({
                ...prev,
                [activeTab]: mappedData
            }));

            setTotalPages(totalPagesCount || 1);
            setTotalItems(total || mappedData.length);
            setNoBetsMessage('You have no bets in this time period.');

        } catch (error) {
            console.error("❌ Fetch Error:", error);
            setProfitLossData(prev => ({
                ...prev,
                [activeTab]: []
            }));
            setTotalPages(1);
            setTotalItems(0);
            setNoBetsMessage('Error loading data. Please try again.');
        } finally {
            setLoading(false);
            setIsInitialLoad(false);
        }
    };

    // ✅ Fetch Detail Data
    const fetchDetail = async (marketName, eventId) => {
        if (!agentId || !marketName) return;

        setDetailLoading(true);
        setShowDetail(true);
        try {
            // ✅ BASE PARAMS
            const params = {
                market_name: marketName,
                event_id: eventId || '',
                user_id: '',
                page: 1,
                limit: 100,
            };

            // ✅ CONDITION: Role ke hisaab se parameter bhejo
            if (role === '2') {
                params.agent_id = agentId;  // role=2 → agent_id
                console.log("✅ Detail: Role=2 Sending agent_id");
            } else if (role === '3') {
                params.admin_id = agentId;  // role=3 → admin_id
                console.log("✅ Detail: Role=3 Sending admin_id");
            } else {
                params.agent_id = agentId;  // default
                console.log("✅ Detail: Default Sending agent_id");
            }

            console.log("📡 Fetching Detail with params:", params);

            const response = await getBettingProfitLossDetail(params);
            console.log("✅ Detail Response:", response);

            let details = [];
            let summary = null;

            if (response?.status_code === 1) {
                details = response.data?.bets || response.data || [];
                summary = response.data?.summary || response.summary || null;
            } else if (response?.success) {
                details = response.data?.bets || response.data || [];
                summary = response.data?.summary || response.summary || null;
            } else if (response?.data?.success) {
                const result = response.data;
                details = result.data?.bets || result.data || [];
                summary = result.data?.summary || result.summary || null;
            } else if (response?.data) {
                const result = response.data;
                details = result.bets || result.data || result.results || [];
                summary = result.summary || null;
            } else if (Array.isArray(response)) {
                details = response;
            } else {
                details = [];
            }

            const mappedDetails = details.map((item) => ({
                user_name: item.user_name || item.pl_id || item.user?.username || 'N/A',
                bet_id: item.bet_id || item._id || 'N/A',
                selection: item.selection || item.team || 'N/A',
                odds: item.bet_on || 0,
                stake: item.stake || 0,
                type:  item.bet_on || '-',
                placed: item.bet_placed || item.created_at ?
                    new Date(item.bet_placed || item.created_at).toLocaleString() :
                    'N/A',
                profit_loss: item.profit_loss || item.pl || 0,
            }));

            setDetailData({
                bets: mappedDetails,
                summary: summary || {
                    totalStakes: mappedDetails.reduce((sum, bet) => sum + Number(bet.stake), 0),
                    backSubtotal: mappedDetails.filter(b => b.type === 'back').reduce((sum, bet) => sum + Number(bet.profit_loss), 0),
                    laySubtotal: mappedDetails.filter(b => b.type === 'lay').reduce((sum, bet) => sum + Number(bet.profit_loss), 0),
                    marketSubtotal: mappedDetails.reduce((sum, bet) => sum + Number(bet.profit_loss), 0),
                    commission: 0,
                    netMarketTotal: mappedDetails.reduce((sum, bet) => sum + Number(bet.profit_loss), 0),
                }
            });

        } catch (error) {
            console.error("❌ Detail Fetch Error:", error);
            setDetailData(null);
        } finally {
            setDetailLoading(false);
        }
    };

    // ✅ Handle Plus button click
    const handlePlusClick = (item, index) => {
        if (expandedRow === index) {
            setExpandedRow(null);
            setShowDetail(false);
            setDetailData(null);
            return;
        }

        setExpandedRow(index);
        setSelectedMarket(item);

        if (item.bets && item.bets.length > 0) {
            const mappedDetails = item.bets.map((bet) => ({
                user_name: bet.user_name || bet.pl_id || 'N/A',
                bet_id: bet.bet_id || bet._id || 'N/A',
                selection: bet.selection || bet.team || 'N/A',
                odds: bet.bet_on  || 0,
                stake: bet.stake || 0,
                type: bet.bet_type|| '-',
                placed: bet.placed || bet.bet_placed || bet.created_at ?
                    new Date(bet.placed || bet.bet_placed || bet.created_at).toLocaleString() :
                    'N/A',
                profit_loss: bet.profit_loss || bet.pl || 0,
            }));

            setDetailData({
                bets: mappedDetails,
                summary: item.summary || {
                    totalStakes: mappedDetails.reduce((sum, bet) => sum + Number(bet.stake), 0),
                    backSubtotal: mappedDetails.filter(b => b.type === 'back').reduce((sum, bet) => sum + Number(bet.profit_loss), 0),
                    laySubtotal: mappedDetails.filter(b => b.type === 'lay').reduce((sum, bet) => sum + Number(bet.profit_loss), 0),
                    marketSubtotal: mappedDetails.reduce((sum, bet) => sum + Number(bet.profit_loss), 0),
                    commission: 0,
                    netMarketTotal: mappedDetails.reduce((sum, bet) => sum + Number(bet.profit_loss), 0),
                }
            });
            setShowDetail(true);
        } else {
            const marketName = activeTab === 'lottery' ? item.match : item.market;
            fetchDetail(marketName, item.event_id || '');
        }
    };

    // ✅ Handle tab change
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setCurrentPage(1);
        setShowDetail(false);
        setSelectedMarket(null);
        setDetailData(null);
        setExpandedRow(null);
        setProfitLossData(prev => ({
            ...prev,
            [tab]: []
        }));
    };

    // ✅ Handle Get History
    const handleGetHistory = () => {
        setCurrentPage(1);
        setShowDetail(false);
        setSelectedMarket(null);
        setDetailData(null);
        setExpandedRow(null);
        fetchProfitLoss(1);
    };

    // ✅ Handle Reset
    const handleReset = () => {
        setBetStatus('unmatched');
        setStartDate(null);
        setEndDate(null);
        setCurrentPage(1);
        setShowDetail(false);
        setSelectedMarket(null);
        setDetailData(null);
        setExpandedRow(null);
        setNoBetsMessage('You have no bets in this time period.');
        setProfitLossData(prev => ({
            ...prev,
            [activeTab]: []
        }));
    };

    // ✅ useEffect for initial load
    useEffect(() => {
        if (agentId && isInitialLoad) {
            console.log("🚀 Initial load - fetching data for", activeTab);
            fetchProfitLoss(1);
        }
    }, [agentId]);

    // ✅ useEffect for tab change - auto fetch on tab change
    useEffect(() => {
        if (agentId && !isInitialLoad) {
            console.log("🔄 Tab changed to", activeTab, "- fetching data");
            fetchProfitLoss(1);
        }
    }, [activeTab]);

    // ✅ useEffect for page change
    useEffect(() => {
        if (agentId && !isInitialLoad && currentPage > 1) {
            console.log("📄 Page changed to", currentPage);
            fetchProfitLoss(currentPage);
        }
    }, [currentPage]);

    // ✅ Render Detail View
    const renderDetailView = () => {
        if (!showDetail || !detailData || !detailData.bets) return null;

        const { bets, summary } = detailData;

        return (
            <div className="detail-view ">
                {detailLoading ? (
                    <div className="text-center py-3">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="table-responsive expand_wrap">
                            <>
                                <table className="table-commission table table-bordered table-sm">
                                    <thead>
                                        <tr>
                                            <th>User Name</th>
                                            <th>Bet ID</th>
                                            <th>Selection</th>
                                            <th>Odds</th>
                                            <th>Stake</th>
                                            <th>Type</th>
                                            <th>Placed</th>
                                            <th>Profit/Loss</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {bets.length > 0 ? (
                                            bets.map((item, index) => {
                                                const profit = Number(item.profit_loss);

                                                return (
                                                    <tr key={index}>
                                                        <td>{item.user_name}</td>
                                                        <td>{item.bet_id}</td>
                                                        <td>{item.selection}</td>
                                                        <td>{item.odds}</td>
                                                        <td>{item.stake}</td>
                                                        <td>{item.type}</td>
                                                        <td>{item.placed}</td>
                                                        <td
                                                            className={
                                                                profit >= 0 ? "text-success" : "text-danger"
                                                            }
                                                        >
                                                            {profit >= 0
                                                                ? profit
                                                                : `(${Math.abs(profit)})`}
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="8" className="text-center">
                                                    No details available
                                                </td>
                                            </tr>
                                        )}

                                        {summary && (
                                            <tr >
                                                <td colSpan="8" className="sum-pl">
                                                    <dl className="d-flex flex-wrap justify-content-between m-0">

                                                        <dt className="me-2">Total Stakes</dt>
                                                        <dd className="mb-0">{summary.totalStakes || 0}</dd>

                                                        <dt className="me-2">Back Subtotal</dt>
                                                        <dd className="mb-0">
                                                            {summary.backSubtotal >= 0 ? (
                                                                summary.backSubtotal
                                                            ) : (
                                                                <span className="text-danger">
                                                                    ({Math.abs(summary.backSubtotal)})
                                                                </span>
                                                            )}
                                                        </dd>

                                                        <dt className="me-2">Lay Subtotal</dt>
                                                        <dd className="mb-0">
                                                            {summary.laySubtotal >= 0 ? (
                                                                summary.laySubtotal
                                                            ) : (
                                                                <span className="text-danger">
                                                                    ({Math.abs(summary.laySubtotal)})
                                                                </span>
                                                            )}
                                                        </dd>

                                                        <dt className="me-2">Market Subtotal</dt>
                                                        <dd className="mb-0">
                                                            {summary.marketSubtotal >= 0 ? (
                                                                summary.marketSubtotal
                                                            ) : (
                                                                <span className="text-danger">
                                                                    ({Math.abs(summary.marketSubtotal)})
                                                                </span>
                                                            )}
                                                        </dd>

                                                        {/* <dt className="me-2">Commission</dt>
                                                        <dd className="mb-0">
                                                            {summary.commission || 0}
                                                        </dd> */}

                                                        <dt className="fw-bold me-2">Net Market Total</dt>
                                                        <dd
                                                            className={`fw-bold mb-0 ${summary.netMarketTotal >= 0
                                                                    ? "text-success"
                                                                    : "text-danger"
                                                                }`}
                                                        >
                                                            {summary.netMarketTotal >= 0
                                                                ? summary.netMarketTotal
                                                                : `(${Math.abs(summary.netMarketTotal)})`}
                                                        </dd>

                                                    </dl>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </>
                        </div>
                    </>
                )}
            </div>
        );
    };

    // ✅ Render Table
    const renderTable = () => {
        const currentData = profitLossData[activeTab] || [];
        const headers = tabHeaders[activeTab] || ['Market', 'Profit / Loss', ''];
        const isEmpty = currentData.length === 0;

        const getDisplayFields = (tab) => {
            const fieldMap = {
                'Exchange': ['market', 'settled_date', 'profit_loss'],
                'FancyBet': ['market', 'settled_date', 'profit_loss'],
                'BookMaker': ['market', 'settled_date', 'profit_loss'],
                'casino': ['market', 'profit_loss'],
                'Toss': ['market', 'settled_date', 'profit_loss'],
                'Tie': ['market', 'settled_date', 'profit_loss'],
                'Indian Casino': ['market', 'profit_loss'],
                'lottery': ['pl_id', 'bet_id', 'bet_placed', 'match', 'lottery_type', 'bhav', 'pl'],
            };
            return fieldMap[tab] || ['market', 'profit_loss'];
        };

        const displayFields = getDisplayFields(activeTab);

        return (
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
                            ) : isEmpty ? (
                                <tr>
                                    <td colSpan="10">
                                        <span>{noBetsMessage}</span>
                                    </td>
                                </tr>
                            ) : (
                                currentData.map((item, index) => {
                                    const profit = Number(item.profit_loss);
                                    const rowStyle = {
                                        backgroundColor: profit >= 0 ? "#72BBEF" : "#FAA9BA",
                                    };
                                    const isExpanded = expandedRow === index;

                                    return (
                                        <React.Fragment key={index}>
                                            <tr style={rowStyle}>
                                                {displayFields.map((field, idx) => (
                                                    <td key={idx}>
                                                        {field === 'profit_loss' || field === 'pl' ?
                                                            (Number(item[field]) >= 0 ? Number(item[field]) : `(${Math.abs(Number(item[field]))})`)
                                                            :
                                                            (item[field] || 'N/A')
                                                        }
                                                    </td>
                                                ))}
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-dark"
                                                        onClick={() => handlePlusClick(item, index)}
                                                    >
                                                        {isExpanded ? '−' : '+'}
                                                    </button>
                                                </td>
                                            </tr>
                                            {isExpanded && showDetail && (
                                                <tr>
                                                    <td colSpan={headers.length}>
                                                        {renderDetailView()}
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                    {!isEmpty && !loading && (
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
        );
    };

    // ✅ Render Filters
    const renderFilters = () => {
        return (
            <form className="bet_status">
                <div className="row">
                    <div className="col-md-12">
                        <div className="row">
                            <div className="mb-sm-0 mb-3 col-lg-4 col-sm-6 col-12">
                                <div className="bet-sec">
                                    <label className="mt-2 me-2 form-label">Bet Status:</label>
                                    <select
                                        className="small_select form-select"
                                        value={betStatus}
                                        onChange={(e) => setBetStatus(e.target.value)}
                                    >
                                        {betStatusOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="mb-sm-0 mb-3 col-lg-4 col-sm-6 col-12">
                                <div className="bet-sec bet-period">
                                    <label className="form-label">From Date</label>
                                    <div className="form-group">
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={startDate || ''}
                                            onChange={(e) => setStartDate(e.target.value || null)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mb-sm-0 mb-3 col-lg-4 col-sm-6 col-12">
                                <div className="bet-sec bet-period">
                                    <label className="form-label">To Date</label>
                                    <div className="form-group">
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={endDate || ''}
                                            onChange={(e) => setEndDate(e.target.value || null)}
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
                            <span
                                className="btn theme_dark_btn cursor-pointer"
                                style={{ cursor: 'pointer' }}
                                onClick={handleGetHistory}
                            >
                                Get History
                            </span>
                        </li>
                        <li>
                            <span
                                className="btn theme_dark_btn cursor-pointer"
                                style={{ cursor: 'pointer' }}
                                onClick={handleReset}
                            >
                                Reset
                            </span>
                        </li>
                    </ul>
                </div>
            </form>
        );
    };

    return (
        <>
            <Layout activeItem="betting-profit-loss">
                <div className="right_side">
                    <div className="inner-wrapper">
                        <h2 className="common-heading">Betting Profit Loss</h2>
                        <div className="common-tab">
                            <ul className="nav nav-tabs" id="controlled-tab-example" role="tablist">
                                {tabs.map((tab) => (
                                    <li className="nav-item" role="presentation" key={tab}>
                                        <button
                                            type="button"
                                            id={`controlled-tab-example-tab-${tab}`}
                                            role="tab"
                                            data-rr-ui-event-key={tab}
                                            aria-controls={`controlled-tab-example-tabpane-${tab}`}
                                            aria-selected={activeTab === tab}
                                            className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                                            onClick={() => handleTabChange(tab)}
                                        >
                                            {tab}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <div className="tab-content">
                                {tabs.map((tab) => (
                                    <div
                                        key={tab}
                                        role="tabpanel"
                                        id={`controlled-tab-example-tabpane-${tab}`}
                                        aria-labelledby={`controlled-tab-example-tab-${tab}`}
                                        className={`fade tab-pane ${activeTab === tab ? 'active show' : ''}`}
                                    >
                                        {activeTab === tab && (
                                            <div className="common-container">
                                                {renderFilters()}
                                                {renderTable()}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    )
}

export default Bettingprofitloss;