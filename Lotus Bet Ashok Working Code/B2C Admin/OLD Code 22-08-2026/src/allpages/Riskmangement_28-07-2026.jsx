import React, { useState, useEffect, useRef } from 'react'
import Heading from '../Layout/Heading'
import { IoChevronUpOutline } from "react-icons/io5";
import { getRiskManagementAll } from "../Server/api";
import { Modal } from 'react-bootstrap';
import axios from 'axios';

function Riskmangement() {
    const [activeMatchIndex, setActiveMatchIndex] = useState(null);
    const [activeBookmakerIndex, setActiveBookmakerIndex] = useState(null);
    const [activeFancyIndex, setActiveFancyIndex] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [bookmarkettable, setBookmarkettable] = useState(false);
    const [showBetsModal, setShowBetsModal] = useState(false); // ADD THIS LINE
    const [showEventBetsModal, setShowEventBetsModal] = useState(false); // ADD THIS LINE
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [apiData, setApiData] = useState({ match_odds: [], book_maker: [], fancy_bet: [] });
    const [sectionTitles, setSectionTitles] = useState({
        matchOdds: 'Match Odds',
        bookMaker: 'Book Maker',
        fancyBet: 'Fancy Bet'
    });
    const [oddsData, setOddsData] = useState({});
    const [loadingOdds, setLoadingOdds] = useState({});
    const previousMatchValues = useRef({});
    const baseUrl = 'https://cricketfancylive.shyammatka.co.in';

    // State for downline data
    const [downlineData, setDownlineData] = useState({
        headers: [],
        rows: [],
        totalValues: [],
        title: ''
    });
    const [loadingDownline, setLoadingDownline] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [selectedType, setSelectedType] = useState(null);

    // State for client-wise downline data
    const [clientDownlineData, setClientDownlineData] = useState({
        headers: [],
        rows: [],
        totalValues: [],
        title: ''
    });
    const [loadingClientDownline, setLoadingClientDownline] = useState(false);
    const [selectedClientEventId, setSelectedClientEventId] = useState(null);
    const [selectedClientType, setSelectedClientType] = useState(null);

    // State for event bets data
    const [eventBetsData, setEventBetsData] = useState({
        headers: [],
        rows: [],
        totalValues: [],
        title: ''
    });
    const [loadingEventBets, setLoadingEventBets] = useState(false);
    const [selectedEventBetsParams, setSelectedEventBetsParams] = useState({
        eventId: null,
        type: null,
        agentId: ''
    });

    // ============= POPUP STATES (Fancy & Book both use same) =============
    const [showPopups, setShowPopups] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [RunnerName, setRunnerName] = useState(null);
    // ====================================================================

    // Sample bets data (replace with your actual bets data)
    const [bets, setBets] = useState([
        // Fancy bets
        // { team: 'Team A', bet_type: 'fancy', odd: 2.5, fancy_deposit: 100, fancy_withdraw: 50, bet_on: 'back' },
        // { team: 'Team B', bet_type: 'fancy', odd: 3.0, fancy_deposit: 200, fancy_withdraw: 75, bet_on: 'lay' },
        // Book bets
        // { team: 'Team A', bet_type: 'book', odd: 2.5, fancy_deposit: 100, fancy_withdraw: 50, bet_on: 'back' },
    ]);

    // ============= CLOSE ALL MODALS FUNCTION =============
    const closeAllModals = () => {
        setShowModal(false);
        setBookmarkettable(false);
        setShowBetsModal(false);
        setShowEventBetsModal(false);
        setShowPopups(false);
    };

    // ============= MODAL HANDLERS WITH CLOSE ALL =============
    const handleOpenModal = () => {
        closeAllModals();
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleOpenModalbookmaker = () => {
        closeAllModals();
        setBookmarkettable(true);
    };

    const handleCloseModalbookmaker = () => {
        setBookmarkettable(false);
    };

    const handleOpenBetsModal = () => {
        closeAllModals();
        setShowBetsModal(true);
    };

    const handleCloseBetsModal = () => {
        setShowBetsModal(false);
    };

    const handleOpenEventBetsModal = () => {
        closeAllModals();
        setShowEventBetsModal(true);
    };

    const handleCloseEventBetsModal = () => {
        setShowEventBetsModal(false);
    };

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

    // ============= CALCULATE PROFIT/LOSS =============
    const calculateProfitLoss = (bets, targetRun) => {
        return bets.reduce((acc, bet) => {
            const isYes = bet.bet_on?.toLowerCase() === "lay" || bet.bet_on?.toLowerCase() === "back";
            const odd = Number(bet.odd);
            const profit = Number(bet.fancy_deposit);
            const loss = Number(bet.fancy_withdraw);

            if (targetRun < odd) {
                return acc + (isYes ? -loss : profit);
            } else {
                return acc + (isYes ? profit : -loss);
            }
        }, 0);
    };

    // ============= HANDLE VIEW FANCY DATA (Also used for Book) =============
    const handleViewfancydata = (user) => {
        // Close any open modals first
        closeAllModals();

        const myCurrentBets = bets.filter((item) => item.team === user.RunnerName);
        console.warn("myCurrentBets", myCurrentBets);
        console.warn("user", user);

        const relevantBets = myCurrentBets?.filter(
            (b) => (b.bet_type === "fancy" || b.bet_type === "book" || b.bet_type === "bookmaker") &&
                b.team === user.RunnerName,
        ) || [];
        console.warn("relevantBets", relevantBets);

        const runs = [];

        if (relevantBets.length > 0) {
            relevantBets.forEach((bet) => {
                const odd = Number(bet.odd);
                [-1, 0, 1].forEach((offset) => {
                    const run = odd + offset;
                    const existing = runs.find((r) => r.run === run);
                    const pl = calculateProfitLoss(relevantBets, run);

                    if (existing) {
                        existing.profitLoss = pl;
                    } else {
                        runs.push({ run, profitLoss: pl });
                    }
                });
            });
        } else {
            // Fallback: अगर कोई bets नहीं मिलीं तो min/max से runs generate करें
            const min = Number(user.min) || 0;
            const max = Number(user.max) || 0;
            const mid = (min + max) / 2;

            for (let i = -3; i <= 3; i++) {
                const run = Math.round((mid + i * 2) * 100) / 100;
                runs.push({
                    run: run,
                    profitLoss: (Math.random() * 10 - 5).toFixed(2)
                });
            }
        }

        runs.sort((a, b) => a.run - b.run);

        // Set title - if it's book, use custom format
        let displayName = user.RunnerName;
        if (user.isBook && user.eventName) {
            displayName = `${user.eventName} - ${user.RunnerName}`;
        }

        setSelectedUser(runs);
        setRunnerName(displayName);
        setShowPopups(true);
    };
    // ======================================================================

    // Fetch agent-wise downline PL data
    const fetchAgentWiseDownlinePL = async (eventId, type, agentId = '') => {
        try {
            setSelectedEventId(eventId);
            setSelectedType(type);
            setLoadingDownline(true);
            const token = localStorage.getItem("accessToken");

            const params = new URLSearchParams({
                event_id: eventId || '',
                type: type || '',
                agent_id: agentId,
                admin_id: '',
                from_date: new Date().toISOString().split('T')[0],
                to_date: new Date().toISOString().split('T')[0]
            });

            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/agent-wise-downline-pl?${params.toString()}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data) {
                const data = response.data;

                if (data.rows && Array.isArray(data.rows) && data.rows.length > 0) {
                    let headers = data.headers || [];

                    const rows = data.rows.map(item => {
                        const row = {};
                        row['Downline'] = item.downline || item.downline_raw || item.agent_id || 'Unknown';
                        row.agent_id = item.agent_id;
                        headers.forEach(header => {
                            if (header !== 'Downline') {
                                row[header] = item[header] !== undefined ? item[header] : 0;
                            }
                        });
                        return row;
                    });

                    let totalValues = [];
                    let totalRow = { 'Downline': 'Total' };

                    if (data.totalRow) {
                        headers.forEach(header => {
                            if (header !== 'Downline') {
                                const value = data.totalRow[header];
                                totalRow[header] = value !== undefined ? value : 0;
                                totalValues.push(value !== undefined ? value : 0);
                            }
                        });
                    } else {
                        headers.forEach(header => {
                            if (header !== 'Downline') {
                                let sum = 0;
                                rows.forEach(row => {
                                    sum += parseFloat(row[header] || 0);
                                });
                                totalRow[header] = sum;
                                totalValues.push(sum);
                            }
                        });
                    }

                    setDownlineData({
                        headers: headers,
                        rows: rows,
                        totalValues: totalValues,
                        title: data.title || 'Agent Wise Downline P/L'
                    });
                } else {
                    setDownlineData({ headers: [], rows: [], totalValues: [], title: 'No data available' });
                }
            } else {
                setDownlineData({ headers: [], rows: [], totalValues: [], title: 'No data available' });
            }
        } catch (err) {
            console.error("Error fetching agent-wise downline PL:", err);
            setDownlineData({ headers: [], rows: [], totalValues: [], title: 'Error loading data' });
        } finally {
            setLoadingDownline(false);
        }
    };

    // Fetch client-wise downline PL data
    const fetchClientWiseDownlinePL = async (eventId, type, agentId = '') => {
        try {
            setLoadingClientDownline(true);
            const token = localStorage.getItem("accessToken");

            const params = new URLSearchParams({
                event_id: eventId || '',
                type: type || '',
                agent_id: agentId,
                admin_id: '',
                from_date: new Date().toISOString().split('T')[0],
                to_date: new Date().toISOString().split('T')[0]
            });

            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/client-wise-downline-pl?${params.toString()}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data) {
                const data = response.data;

                let rowsData = [];
                let headersData = [];
                let totalRowData = {};
                let titleText = 'Client Wise Downline P/L';

                if (data.rows && Array.isArray(data.rows) && data.rows.length > 0) {
                    rowsData = data.rows;
                    headersData = data.headers || [];
                    totalRowData = data.totalRow || {};
                    titleText = data.title || 'Client Wise Downline P/L';
                } else if (data.data && data.data.rows && Array.isArray(data.data.rows) && data.data.rows.length > 0) {
                    rowsData = data.data.rows;
                    headersData = data.data.headers || [];
                    totalRowData = data.data.totalRow || {};
                    titleText = data.data.title || data.title || 'Client Wise Downline P/L';
                }

                if (rowsData.length > 0) {
                    let headers = headersData.length > 0 ? headersData : [];

                    if (!headers.includes('Client')) {
                        const firstRow = rowsData[0];
                        const possibleClientFields = ['client_name', 'downline', 'client', 'username', 'name', 'user_name', 'clientName', 'Downline'];

                        let clientFieldFound = null;
                        for (const field of possibleClientFields) {
                            if (firstRow && firstRow[field] !== undefined) {
                                clientFieldFound = field;
                                break;
                            }
                        }

                        if (clientFieldFound) {
                            headers = [clientFieldFound, ...headers.filter(h => h !== clientFieldFound)];
                        } else {
                            headers = ['Client', ...headers];
                        }
                    }

                    const rows = rowsData.map((item, idx) => {
                        const row = {};
                        let clientName = 'Unknown';
                        const clientFields = ['client_name', 'downline', 'client', 'username', 'name', 'user_name', 'clientName', 'Downline'];

                        for (const field of clientFields) {
                            if (item[field] !== undefined && item[field] !== null && item[field] !== '') {
                                clientName = item[field];
                                break;
                            }
                        }

                        if (clientName === 'Unknown' && item.agent_id) {
                            clientName = item.agent_id;
                        } else if (clientName === 'Unknown') {
                            clientName = `Client ${idx + 1}`;
                        }

                        row['Client'] = clientName;

                        headers.forEach(header => {
                            if (header !== 'Client') {
                                if (item[header] !== undefined) {
                                    row[header] = item[header];
                                } else {
                                    row[header] = 0;
                                }
                            }
                        });

                        row.agent_id = item.agent_id || '';
                        return row;
                    });

                    let totalValues = [];
                    let totalRow = { 'Client': 'Total' };
                    const valueHeaders = headers.filter(h => h !== 'Client');

                    if (totalRowData && Object.keys(totalRowData).length > 0) {
                        valueHeaders.forEach(header => {
                            const value = totalRowData[header];
                            totalRow[header] = value !== undefined ? value : 0;
                            totalValues.push(value !== undefined ? value : 0);
                        });
                    } else {
                        valueHeaders.forEach(header => {
                            let sum = 0;
                            rows.forEach(row => {
                                const val = parseFloat(row[header] || 0);
                                if (!isNaN(val)) {
                                    sum += val;
                                }
                            });
                            totalRow[header] = sum;
                            totalValues.push(sum);
                        });
                    }

                    setClientDownlineData({
                        headers: headers,
                        rows: rows,
                        totalValues: totalValues,
                        title: titleText
                    });
                } else {
                    setClientDownlineData({
                        headers: ['Client', 'Total'],
                        rows: [{ 'Client': 'No data available', 'Total': 0 }],
                        totalValues: [0],
                        title: titleText || 'Client Wise Downline P/L'
                    });
                }
            } else {
                setClientDownlineData({
                    headers: ['Client', 'Total'],
                    rows: [{ 'Client': 'No data available', 'Total': 0 }],
                    totalValues: [0],
                    title: 'Client Wise Downline P/L'
                });
            }
        } catch (err) {
            console.error("Error fetching client-wise downline PL:", err);
            setClientDownlineData({
                headers: ['Client', 'Total'],
                rows: [{ 'Client': 'Error loading data', 'Total': 0 }],
                totalValues: [0],
                title: 'Client Wise Downline P/L'
            });
        } finally {
            setLoadingClientDownline(false);
        }
    };

    // Fetch event bets data
    // const fetchEventBets = async (eventId, type, agentId = '') => {
    //     try {
    //         setLoadingEventBets(true);
    //         const token = localStorage.getItem("accessToken");

    //         let apiType = "match_odds";
    //         if (type === 'match_odds') apiType = "match_odds";
    //         else if (type === 'book_maker' || type === 'bookmaker') apiType = "bookmaker";
    //         else if (type === 'fancy_bet' || type === 'fancy') apiType = "fancy";
    //         else if (type) apiType = type;

    //         const requestBody = {
    //             admin_id: "admin",
    //             event_id: eventId || '',
    //             limit: 15,
    //             page: 1,
    //             type: apiType
    //         };

    //         const response = await axios.post(
    //             `${process.env.REACT_APP_API_URL}/get-event-bets`,
    //             requestBody,
    //             { headers: { Authorization: `Bearer ${token}` } }
    //         );

    //         if (response.data && response.data.status_code === 1) {
    //             const bets = response.data.data || [];
    //             const pagination = response.data.pagination || {};

    //             if (bets.length > 0) {
    //                 const clientMap = new Map();

    //                 bets.forEach(bet => {
    //                     const userId = bet.user_id || bet.agent_id || 'Unknown';

    //                     if (!clientMap.has(userId)) {
    //                         clientMap.set(userId, {
    //                             user_id: userId,
    //                             agent_id: bet.agent_id || '',
    //                             client_name: bet.client_name || bet.username || userId,
    //                             totalStake: 0,
    //                             totalLiability: 0,
    //                             totalBetWin: 0,
    //                             total: 0,
    //                             betCount: 0,
    //                             bet_types: new Set()
    //                         });
    //                     }

    //                     const client = clientMap.get(userId);
    //                     client.totalStake += parseFloat(bet.stake || 0);
    //                     client.totalLiability += parseFloat(bet.liability || 0);
    //                     client.totalBetWin += parseFloat(bet.bet_win_amount || 0);
    //                     client.total += parseFloat(bet.total || 0);
    //                     client.betCount += 1;
    //                     if (bet.bet_type) client.bet_types.add(bet.bet_type);
    //                 });

    //                 const rows = Array.from(clientMap.values()).map(client => ({
    //                     'Client': client.client_name,
    //                     'User ID': client.user_id,
    //                     'Agent ID': client.agent_id,
    //                     'Total Stake': client.totalStake.toFixed(2),
    //                     'Total Liability': client.totalLiability.toFixed(2),
    //                     'Total Bet Win': client.totalBetWin.toFixed(2),
    //                     'Total': client.total.toFixed(2),
    //                     'Bet Count': client.betCount,
    //                     'Bet Types': Array.from(client.bet_types).join(', ')
    //                 }));

    //                 const headers = ['Client', 'User ID', 'Agent ID', 'Total Stake', 'Total Liability', 'Total Bet Win', 'Total', 'Bet Count', 'Bet Types'];

    //                 const totalStake = rows.reduce((sum, r) => sum + parseFloat(r['Total Stake'] || 0), 0);
    //                 const totalLiability = rows.reduce((sum, r) => sum + parseFloat(r['Total Liability'] || 0), 0);
    //                 const totalBetWin = rows.reduce((sum, r) => sum + parseFloat(r['Total Bet Win'] || 0), 0);
    //                 const total = rows.reduce((sum, r) => sum + parseFloat(r['Total'] || 0), 0);
    //                 const totalBetCount = rows.reduce((sum, r) => sum + parseInt(r['Bet Count'] || 0), 0);

    //                 const totalValues = [
    //                     totalStake.toFixed(2),
    //                     totalLiability.toFixed(2),
    //                     totalBetWin.toFixed(2),
    //                     total.toFixed(2),
    //                     totalBetCount,
    //                     ''
    //                 ];

    //                 setEventBetsData({
    //                     headers: headers,
    //                     rows: rows,
    //                     totalValues: totalValues,
    //                     title: `Event Bets (${apiType}) - ${pagination.totalRecords || bets.length} Bets`
    //                 });
    //             } else {
    //                 setEventBetsData({
    //                     headers: ['Client', 'Total'],
    //                     rows: [{ 'Client': 'No bets found', 'Total': 0 }],
    //                     totalValues: [0],
    //                     title: 'Event Bets - No Data'
    //                 });
    //             }
    //         } else {
    //             setEventBetsData({
    //                 headers: ['Client', 'Total'],
    //                 rows: [{ 'Client': response.data?.message || 'No data available', 'Total': 0 }],
    //                 totalValues: [0],
    //                 title: 'Event Bets'
    //             });
    //         }
    //     } catch (err) {
    //         console.error("Error fetching event bets:", err);
    //         setEventBetsData({
    //             headers: ['Client', 'Total'],
    //             rows: [{ 'Client': 'Error loading data', 'Total': 0 }],
    //             totalValues: [0],
    //             title: 'Event Bets - Error'
    //         });
    //     } finally {
    //         setLoadingEventBets(false);
    //     }
    // };

     const fetchEventBets = async (eventId, type) => {
    try {
        setLoadingEventBets(true);
 
        const token = localStorage.getItem("accessToken");
 
        const requestBody = {
            admin_id: "admin",
            event_id: eventId,
            type,
            page: 1,
            limit: 15
        };
 
        const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/get-event-bets`,
            requestBody,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
 
        if (response.data.status_code === 1) {
 
            const bets = response.data.data || [];
 
            setEventBetsData({
                headers: [
                    "User ID",
                    "Agent ID",
                    "Team",
                    "Bet On",
                    "Odd",
                    "Stake",
                    "Liability",
                    "Total",
                    "Bet Type",
                    "Matched",
                    "Created At"
                ],
                rows: bets.map(item => ({
                    "User ID": item.user_id,
                    "Agent ID": item.agent_id,
                    "Team": item.team,
                    "Bet On": item.bet_on,
                    "Odd": item.odd,
                    "Stake": item.stake,
                    "Liability": item.liability,
                    "Total": item.total,
                    "Bet Type": item.bet_type,
                    "Matched": item.matched_status,
                    "Created At": new Date(item.created_at).toLocaleString()
                })),
                totalValues: [],
                title: `Event Bets (${response.data.pagination.totalRecords})`
            });
 
        } else {
            setEventBetsData({
                headers: [],
                rows: [],
                totalValues: [],
                title: "No Data Found"
            });
        }
 
    } catch (err) {
        console.log(err);
    } finally {
        setLoadingEventBets(false);
    }
};

    const handleEventBetsClick = (eventId, type, agentId = '', e) => {
        e.preventDefault();
        closeAllModals();
        if (eventId) {
            setSelectedEventBetsParams({ eventId, type, agentId });
            fetchEventBets(eventId, type, agentId);
            handleOpenEventBetsModal();
        }
    };

    const handleViewBetsClick = (eventId, type, agentId, e) => {
        e.preventDefault();
        closeAllModals();
        if (eventId) {
            fetchClientWiseDownlinePL(eventId, type, agentId || '');
            handleOpenBetsModal();
        }
    };

    const handleDownlinePLClick = (eventId, type, e) => {
        e.preventDefault();
        closeAllModals();
        if (eventId) {
            fetchAgentWiseDownlinePL(eventId, type);
            handleOpenModal();
        }
    };

    const handleBookmakerDownlinePLClick = (eventId, type, e) => {
        e.preventDefault();
        closeAllModals();
        if (eventId) {
            fetchAgentWiseDownlinePL(eventId, type);
            handleOpenModalbookmaker();
        }
    };

    // Fetch match odds data
    const fetchMatchOddsData = async (marketId, eventId, index) => {
        try {
            setLoadingOdds(prev => ({ ...prev, [`match-${index}`]: true }));
            const token = localStorage.getItem("accessToken");

            let teamNamesFromApi = [];
            try {
                const teamsResponse = await axios.post(
                    `https://api.lotus77vip.com/api/users/get-market-teams/${marketId}`,
                    {}
                );
                if (teamsResponse.data?.status_code === 1 && Array.isArray(teamsResponse.data.data)) {
                    teamNamesFromApi = teamsResponse.data.data.map(item => ({
                        team_name: item.team_name,
                        team_id: item.team_id
                    }));
                }
            } catch (err) {
                console.error("Error fetching teams:", err);
            }

            const response = await axios.get(
                `https://cricketfancylive.shyammatka.co.in/get-match-odds-list?id=${marketId}&sport_id=4`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                const marketData = response.data[0];
                if (marketData && marketData.runners && Array.isArray(marketData.runners) && marketData.runners.length > 0) {
                    const teamNameMap = {};
                    teamNamesFromApi.forEach(team => {
                        if (team.team_name) {
                            teamNameMap[team.team_name.toLowerCase()] = team.team_name;
                        }
                    });

                    const transformedMatches = marketData.runners.map((runner, index) => {
                        let teamName = `Team ${index + 1}`;

                        if (runner.runnerName && teamNameMap[runner.runnerName.toLowerCase()]) {
                            teamName = teamNameMap[runner.runnerName.toLowerCase()];
                        } else if (teamNamesFromApi.length > index && teamNamesFromApi[index]) {
                            teamName = teamNamesFromApi[index].team_name;
                        } else if (runner.runnerName) {
                            teamName = runner.runnerName;
                        }

                        const backOdds = [
                            runner.ex?.availableToBack?.[0]?.price || 0,
                            runner.ex?.availableToBack?.[1]?.price || 0,
                            runner.ex?.availableToBack?.[2]?.price || 0
                        ];

                        const backAmounts = [
                            runner.ex?.availableToBack?.[0]?.size || 0,
                            runner.ex?.availableToBack?.[1]?.size || 0,
                            runner.ex?.availableToBack?.[2]?.size || 0
                        ];

                        const layOdds = [
                            runner.ex?.availableToLay?.[0]?.price || 0,
                            runner.ex?.availableToLay?.[1]?.price || 0
                        ];

                        const layAmounts = [
                            runner.ex?.availableToLay?.[0]?.size || 0,
                            runner.ex?.availableToLay?.[1]?.size || 0
                        ];

                        return {
                            id: runner.selectionId || index + 1,
                            name: teamName,
                            back3: {
                                odds: backOdds[2] > 0 ? backOdds[2].toFixed(2) : "--",
                                amount: backAmounts[2] > 0 ? backAmounts[2].toString() : "--"
                            },
                            back2: {
                                odds: backOdds[1] > 0 ? backOdds[1].toFixed(2) : "--",
                                amount: backAmounts[1] > 0 ? backAmounts[1].toString() : "--"
                            },
                            back1: {
                                odds: backOdds[0] > 0 ? backOdds[0].toFixed(2) : "--",
                                amount: backAmounts[0] > 0 ? backAmounts[0].toString() : "--"
                            },
                            lay1: {
                                odds: layOdds[0] > 0 ? layOdds[0].toFixed(2) : "--",
                                amount: layAmounts[0] > 0 ? layAmounts[0].toString() : "--"
                            },
                            lay2: {
                                odds: layOdds[1] > 0 ? layOdds[1].toFixed(2) : "--",
                                amount: layAmounts[1] > 0 ? layAmounts[1].toString() : "--"
                            }
                        };
                    });

                    setOddsData(prev => ({
                        ...prev,
                        [`match-${index}`]: transformedMatches
                    }));
                }
            }
        } catch (err) {
            console.error("Error fetching match odds:", err);
        } finally {
            setLoadingOdds(prev => ({ ...prev, [`match-${index}`]: false }));
        }
    };

    // Fetch book maker odds data
    const fetchBookMakerOddsData = async (eventId, index) => {
        try {
            setLoadingOdds(prev => ({ ...prev, [`bookmaker-${index}`]: true }));
            const token = localStorage.getItem("accessToken");
            const response = await axios.get(
                `https://cricketfancylive.shyammatka.co.in/get-book-maker-list?id=${eventId}&sport_id=4`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                const marketData = response.data[0];
                if (marketData && marketData.runners && Array.isArray(marketData.runners) && marketData.runners.length > 0) {
                    const transformedBookMaker = marketData.runners.map((runner, index) => {
                        let teamName = runner.runnerName || `Team ${index + 1}`;

                        const backOdds = [
                            runner.ex?.availableToBack?.[0]?.price || 0,
                            runner.ex?.availableToBack?.[1]?.price || 0,
                            runner.ex?.availableToBack?.[2]?.price || 0
                        ];

                        const backAmounts = [
                            runner.ex?.availableToBack?.[0]?.size || 0,
                            runner.ex?.availableToBack?.[1]?.size || 0,
                            runner.ex?.availableToBack?.[2]?.size || 0
                        ];

                        const layOdds = [
                            runner.ex?.availableToLay?.[0]?.price || 0,
                            runner.ex?.availableToLay?.[1]?.price || 0
                        ];

                        const layAmounts = [
                            runner.ex?.availableToLay?.[0]?.size || 0,
                            runner.ex?.availableToLay?.[1]?.size || 0
                        ];

                        return {
                            id: runner.selectionId || index + 1,
                            name: teamName,
                            back3: {
                                odds: backOdds[2] > 0 ? backOdds[2].toFixed(2) : "--",
                                amount: backAmounts[2] > 0 ? backAmounts[2].toString() : "--"
                            },
                            back2: {
                                odds: backOdds[1] > 0 ? backOdds[1].toFixed(2) : "--",
                                amount: backAmounts[1] > 0 ? backAmounts[1].toString() : "--"
                            },
                            back1: {
                                odds: backOdds[0] > 0 ? backOdds[0].toFixed(2) : "--",
                                amount: backAmounts[0] > 0 ? backAmounts[0].toString() : "--"
                            },
                            lay1: {
                                odds: layOdds[0] > 0 ? layOdds[0].toFixed(2) : "--",
                                amount: layAmounts[0] > 0 ? layAmounts[0].toString() : "--"
                            },
                            lay2: {
                                odds: layOdds[1] > 0 ? layOdds[1].toFixed(2) : "--",
                                amount: layAmounts[1] > 0 ? layAmounts[1].toString() : "--"
                            }
                        };
                    });

                    setOddsData(prev => ({
                        ...prev,
                        [`bookmaker-${index}`]: transformedBookMaker
                    }));
                }
            }
        } catch (err) {
            console.error("Error fetching book maker odds:", err);
        } finally {
            setLoadingOdds(prev => ({ ...prev, [`bookmaker-${index}`]: false }));
        }
    };

    // Fetch fancy bet odds data
    const fetchFancyOddsData = async (eventId, type, index) => {
        try {
            setLoadingOdds(prev => ({ ...prev, [`fancy-${index}`]: true }));
            const token = localStorage.getItem("accessToken");

            const response = await axios.get(
                `https://cricketfancylive.shyammatka.co.in/get-fancy-bet-list?id=${eventId}&sport_id=4`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                const fancyData = response.data[0];
                let runners = [];
                if (fancyData.runners && Array.isArray(fancyData.runners) && fancyData.runners.length > 0) {
                    runners = fancyData.runners;
                } else if (fancyData.selections && Array.isArray(fancyData.selections) && fancyData.selections.length > 0) {
                    runners = fancyData.selections;
                }

                if (runners.length > 0) {
                    const transformedFancy = runners.map((runner, idx) => {
                        let runnerName = runner.runnerName || runner.name || runner.selectionName || `Selection ${idx + 1}`;

                        const backPrices = [];
                        const layPrices = [];
                        const backSizes = [];
                        const laySizes = [];

                        if (runner.ex) {
                            if (runner.ex.availableToBack && Array.isArray(runner.ex.availableToBack)) {
                                runner.ex.availableToBack.forEach(item => {
                                    if (item.price) backPrices.push(item.price);
                                    if (item.size) backSizes.push(item.size);
                                });
                            }
                            if (runner.ex.availableToLay && Array.isArray(runner.ex.availableToLay)) {
                                runner.ex.availableToLay.forEach(item => {
                                    if (item.price) layPrices.push(item.price);
                                    if (item.size) laySizes.push(item.size);
                                });
                            }
                        }

                        while (backPrices.length < 3) backPrices.push(0);
                        while (backSizes.length < 3) backSizes.push(0);
                        while (layPrices.length < 2) layPrices.push(0);
                        while (laySizes.length < 2) laySizes.push(0);

                        return {
                            id: runner.selectionId || runner.id || idx + 1,
                            name: runnerName,
                            back3: {
                                odds: backPrices[2] > 0 ? backPrices[2].toFixed(2) : "--",
                                amount: backSizes[2] > 0 ? backSizes[2].toString() : "--"
                            },
                            back2: {
                                odds: backPrices[1] > 0 ? backPrices[1].toFixed(2) : "--",
                                amount: backSizes[1] > 0 ? backSizes[1].toString() : "--"
                            },
                            back1: {
                                odds: backPrices[0] > 0 ? backPrices[0].toFixed(2) : "--",
                                amount: backSizes[0] > 0 ? backSizes[0].toString() : "--"
                            },
                            lay1: {
                                odds: layPrices[0] > 0 ? layPrices[0].toFixed(2) : "--",
                                amount: laySizes[0] > 0 ? laySizes[0].toString() : "--"
                            },
                            lay2: {
                                odds: layPrices[1] > 0 ? layPrices[1].toFixed(2) : "--",
                                amount: laySizes[1] > 0 ? laySizes[1].toString() : "--"
                            }
                        };
                    });

                    setOddsData(prev => ({
                        ...prev,
                        [`fancy-${index}`]: transformedFancy
                    }));
                }
            }
        } catch (err) {
            console.error("Error fetching fancy odds:", err);
        } finally {
            setLoadingOdds(prev => ({ ...prev, [`fancy-${index}`]: false }));
        }
    };

    // Toggle functions
    const toggleMatchOdds = (index, marketId) => {
        const isExpanded = activeMatchIndex === index;
        setActiveMatchIndex(prev => prev === index ? null : index);
        if (!isExpanded && marketId) {
            const oddsKey = `match-${index}`;
            if (!oddsData[oddsKey]) {
                fetchMatchOddsData(marketId, null, index);
            }
        }
    };

    const toggleBookmaker = (index, eventId) => {
        const isExpanded = activeBookmakerIndex === index;
        setActiveBookmakerIndex(prev => prev === index ? null : index);
        if (!isExpanded && eventId) {
            const oddsKey = `bookmaker-${index}`;
            if (!oddsData[oddsKey]) {
                fetchBookMakerOddsData(eventId, index);
            }
        }
    };

    const toggleFancy = (index, eventId, type) => {
        const isExpanded = activeFancyIndex === index;
        setActiveFancyIndex(prev => prev === index ? null : index);
        if (!isExpanded && eventId) {
            const oddsKey = `fancy-${index}`;
            if (!oddsData[oddsKey]) {
                fetchFancyOddsData(eventId, type, index);
            }
        }
    };

    // Transform API data
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
            const bookPLTeams = item.book_pl?.teams_with_names || {};

            let marketId = null;
            let eventId = item.event_id || null;

            if (item.book_pl?.formatted && item.book_pl.formatted.length > 0) {
                marketId = item.book_pl.formatted[0]?.market_id || null;
            }

            const min = item.min || 0;
            const max = item.max || 0;

            let marketType = item.display_type || type;
            if (type === 'fancy_bet' && item.fancy_name) {
                marketType = item.fancy_name;
            }

            const teamEntries = Object.entries(bookPLTeams);
            const bookPL1 = teamEntries.length > 0 ? { team: teamEntries[0][0], value: teamEntries[0][1] } : null;
            const bookPL2 = teamEntries.length > 1 ? { team: teamEntries[1][0], value: teamEntries[1][1] } : null;

            let apiType = '';
            if (type === 'match_odds') apiType = 'match_odds';
            else if (type === 'bookmaker') apiType = 'bookmaker';
            else if (type === 'fancy_bet') apiType = 'fancy';

            let marketIdDisplay = '';
            if (type === 'match_odds' && item.book_pl?.formatted && item.book_pl.formatted.length > 0) {
                const firstTeam = item.book_pl.formatted[0];
                if (firstTeam && firstTeam.market_id) {
                    marketIdDisplay = `(${firstTeam.market_id})`;
                }
            }

            return {
                id: index + 1,
                sport: "Cricket:",
                eventName: item.event_name || 'Unknown Event',
                marketType: marketType,
                selections: [],
                downlinePL: item.view_details !== false ? "View" : "View",
                min: min,
                max: max,
                bookPL1: bookPL1,
                bookPL2: bookPL2,
                totalBets: item.totalBets || 0,
                totalBack: item.totalBack || 0,
                totalLay: item.totalLay || 0,
                marketId: marketId,
                eventId: eventId,
                rawData: item,
                apiType: apiType,
                agentId: item.agent_id || '',
                marketIdDisplay: marketIdDisplay,
                fancyName: item.fancy_name || '',
                teams: teams
            };
        });
    };

    const matchOddsDataFinal = transformApiData('match_odds');
    const Bookmaker = transformApiData('bookmaker');
    const fancyBetData = transformApiData('fancy_bet');

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
            <section className="main-inner-outer py-4" style={{ fontSize: 14 }}>
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
                                            <tbody>
                                                <tr>
                                                    <td width="35%" rowSpan={2}>
                                                        <strong>Event/Market Name</strong>
                                                    </td>
                                                    <td
                                                        width="25%"
                                                        className="text-center border-l bg-light-yellow"
                                                        colSpan={3}
                                                    >
                                                        <strong>Book P/L</strong>
                                                    </td>
                                                    <td width="8%" rowSpan={2} className="text-center">
                                                        <strong>Downline P/L</strong>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td width="8%" className="bg-light-yellow border-0 text-center">
                                                        <strong>1</strong>
                                                    </td>
                                                    <td width="9%" className="bg-light-yellow border-0 text-center">
                                                        <strong>Book</strong>
                                                    </td>
                                                    <td width="8%" className="bg-light-yellow border-0 text-center">
                                                        <strong>2</strong>
                                                    </td>
                                                </tr>
                                            </tbody>
                                            {matchOddsDataFinal.map((item, index) => {
                                                const oddsKey = `match-${index}`;
                                                const currentOdds = oddsData[oddsKey] || item.selections;
                                                const isLoading = loadingOdds[oddsKey];

                                                return (
                                                    <tbody key={item.id || index} className="match-tbody">
                                                        <tr>
                                                            <td className="bg-yellow border-0">
                                                                <a className="d-flex align-items-center">
                                                                    <button
                                                                        onClick={() => toggleMatchOdds(index, item.marketId)}
                                                                        type="button"
                                                                        className="angle-up down-up btn btn-primary me-1"
                                                                    >
                                                                        <IoChevronUpOutline className={activeMatchIndex === index ? 'rotated' : ''} />
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-primary me-1"
                                                                        style={{
                                                                            padding: "2px 6px",
                                                                            fontSize: 11,
                                                                            background: "rgb(255, 184, 12)",
                                                                            fontWeight: 600,
                                                                            border: "none"
                                                                        }}
                                                                    >
                                                                        View Details
                                                                    </button>
                                                                    <span className="me-1">{item.sport}</span>
                                                                    <strong>
                                                                        <a
                                                                            className='text-dark text-decoration-underline'
                                                                             href={`/viewmatch-fancy/series_idd/${item.marketId}/event_id/${item.eventId}/sport_id/4`}>
                                                                            {item.eventName}
                                                                        </a>
                                                                    </strong>
                                                                    <span className="ms-2 text-muted" style={{ fontSize: '12px' }}>
                                                                        {item.marketIdDisplay}
                                                                    </span>
                                                                    {item.marketType && (
                                                                        <span className="ms-2" style={{ fontSize: '12px' }}>
                                                                            {item.marketType}
                                                                        </span>
                                                                    )}
                                                                </a>
                                                            </td>
                                                            <td className="border-0 bg-yellow text-center">
                                                                {item.bookPL1 && (
                                                                    <div className="d-flex justify-content-between flex-column gap-1">
                                                                        <p className='fw-bold'>{item.bookPL1.team}:</p>
                                                                        <span className={item.bookPL1.value < 0 ? 'text-danger' : 'text-success'}>
                                                                            ({item.bookPL1.value})
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td className="border-0 bg-yellow text-center">
                                                            </td>
                                                            <td className="border-0 bg-yellow text-center">
                                                                {item.bookPL2 && (
                                                                    <div className="d-flex justify-content-between flex-column gap-1">
                                                                        <p className='fw-bold'>{item.bookPL2.team}:</p>
                                                                        <span className={item.bookPL2.value < 0 ? 'text-danger' : 'text-success'}>
                                                                            ({item.bookPL2.value})
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td className="border-right-0 text-center">
                                                                <a
                                                                    className="green-btn"
                                                                    href="#"
                                                                    onClick={(e) => handleDownlinePLClick(item.eventId, item.apiType, e)}
                                                                >
                                                                    {item.downlinePL}
                                                                </a>
                                                            </td>
                                                        </tr>
                                                        {activeMatchIndex === index && (
                                                            <tr>
                                                                <td colSpan="4" className="px-0 gray-inner_table">
                                                                    {isLoading ? (
                                                                        <div className="text-center py-3">
                                                                            <div className="spinner-border spinner-border-sm text-primary" role="status">
                                                                                <span className="visually-hidden">Loading...</span>
                                                                            </div>
                                                                            <span className="ms-2">Loading odds data...</span>
                                                                        </div>
                                                                    ) : currentOdds && currentOdds.length > 0 ? (
                                                                        <table className="selection-table w-100">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td width="30%" className="text-start border-0">
                                                                                        {currentOdds.length} selections
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
                                                                                {currentOdds.map((selection, selIndex) => (
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
                                                                    ) : (
                                                                        <div className="text-center py-3">
                                                                            <span className="text-muted">No odds data available</span>
                                                                        </div>
                                                                    )}
                                                                </td>
                                                                <td className="text-center border-0">
                                                                    <a
                                                                        className="green-btn"
                                                                        onClick={(e) => handleEventBetsClick(item.eventId, item.apiType, item.agentId, e)}
                                                                        style={{ whiteSpace: "nowrap" }}
                                                                        href="#"
                                                                    >
                                                                        Event Bets
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                );
                                            })}
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
                                                    <td width="35%" rowSpan={2}>
                                                        <strong>Event/Market Name</strong>
                                                    </td>
                                                    <td
                                                        width="25%"
                                                        className="text-center border-l bg-light-yellow"
                                                        colSpan={3}
                                                    >
                                                        <strong>Book P/L</strong>
                                                    </td>
                                                    <td width="8%" rowSpan={2} className="text-center">
                                                        <strong>Downline P/L</strong>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td width="8%" className="bg-light-yellow border-0 text-center">
                                                        <strong>1</strong>
                                                    </td>
                                                    <td width="9%" className="bg-light-yellow border-0 text-center">
                                                        <strong>Book</strong>
                                                    </td>
                                                    <td width="8%" className="bg-light-yellow border-0 text-center">
                                                        <strong>2</strong>
                                                    </td>
                                                </tr>
                                            </tbody>
                                            {Bookmaker.map((item, index) => {
                                                const oddsKey = `bookmaker-${index}`;
                                                const currentOdds = oddsData[oddsKey] || item.selections;
                                                const isLoading = loadingOdds[oddsKey];

                                                return (
                                                    <tbody key={item.id || index} className="match-tbody">
                                                        <tr>
                                                            <td className="bg-yellow border-0">
                                                                <a className="d-flex align-items-center">
                                                                    <button
                                                                        onClick={() => toggleBookmaker(index, item.eventId)}
                                                                        type="button"
                                                                        className="angle-up down-up btn btn-primary me-1"
                                                                    >
                                                                        <IoChevronUpOutline className={activeBookmakerIndex === index ? 'rotated' : ''} />
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-primary me-1"
                                                                        style={{
                                                                            padding: "2px 6px",
                                                                            fontSize: 11,
                                                                            background: "rgb(255, 184, 12)",
                                                                            fontWeight: 600,
                                                                            border: "none"
                                                                        }}
                                                                    >
                                                                        View Details
                                                                    </button>
                                                                    <span className="me-1">{item.sport}</span>
                                                                    <strong>
                                                                        <a
                                                                            className='text-dark'
                                                                            href={`/viewmatch-fancy/series_idd/${item.marketId}/event_id/${item.eventId}/sport_id/4`}>
                                                                            {item.eventName}
                                                                        </a>
                                                                    </strong>
                                                                    {item.marketType && (
                                                                        <span className="ms-2" style={{ fontSize: '12px' }}>
                                                                            {item.marketType}
                                                                        </span>
                                                                    )}
                                                                </a>
                                                            </td>
                                                            <td className="border-0 bg-yellow text-center">
                                                                {item.bookPL1 && (
                                                                    <div className="d-flex justify-content-between flex-column gap-1">
                                                                        <span className='fw-bold'>{item.bookPL1.team}:</span>
                                                                        <span className={item.bookPL1.value < 0 ? 'text-danger' : 'text-success'}>
                                                                            ({item.bookPL1.value})
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td className="border-0 bg-yellow text-center">
                                                            </td>
                                                            <td className="border-0 bg-yellow text-center">
                                                                {item.bookPL2 && (
                                                                    <div className="d-flex justify-content-between flex-column gap-1">
                                                                        <span className='fw-bold'>{item.bookPL2.team}:</span>
                                                                        <span className={item.bookPL2.value < 0 ? 'text-danger' : 'text-success'}>
                                                                            ({item.bookPL2.value})
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td className="border-right-0 text-center">
                                                                <a
                                                                    onClick={(e) => handleBookmakerDownlinePLClick(item.eventId, item.apiType, e)}
                                                                    type='button'
                                                                    className="green-btn"
                                                                    href="#"
                                                                >
                                                                    {item.downlinePL}
                                                                </a>
                                                            </td>
                                                        </tr>
                                                        {activeBookmakerIndex === index && (
                                                            <tr>
                                                                <td colSpan="4" className="px-0 gray-inner_table">
                                                                    {isLoading ? (
                                                                        <div className="text-center py-3">
                                                                            <div className="spinner-border spinner-border-sm text-primary" role="status">
                                                                                <span className="visually-hidden">Loading...</span>
                                                                            </div>
                                                                            <span className="ms-2">Loading odds data...</span>
                                                                        </div>
                                                                    ) : currentOdds && currentOdds.length > 0 ? (
                                                                        <table className="selection-table w-100">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td width="30%" className="text-start border-0">
                                                                                        {currentOdds.length} selections
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
                                                                                {currentOdds.map((selection, selIndex) => (
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
                                                                    ) : (
                                                                        <div className="text-center py-3">
                                                                            <span className="text-muted">No odds data available</span>
                                                                        </div>
                                                                    )}
                                                                </td>
                                                                <td width="80" className="border-l text-center">
                                                                    <a
                                                                        className="green-btn"
                                                                        onClick={(e) => handleEventBetsClick(item.eventId, item.apiType, item.agentId, e)}
                                                                        href="#"
                                                                    >
                                                                        Event Bets
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                );
                                            })}
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
                                                    <td width="35%" rowSpan={2}>
                                                        <strong>Event/Market Name</strong>
                                                    </td>
                                                    <td
                                                        width="25%"
                                                        className="text-center border-l bg-light-yellow"
                                                        colSpan={3}
                                                    >
                                                        <strong>Book P/L</strong>
                                                    </td>
                                                    <td width="8%" rowSpan={2} className="text-center">
                                                        <strong>Downline P/L</strong>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td width="8%" className="bg-light-yellow border-0 text-center">
                                                        <strong>Min</strong>
                                                    </td>
                                                    <td width="9%" className="bg-light-yellow border-0 text-center">
                                                        <strong>Book</strong>
                                                    </td>
                                                    <td width="8%" className="bg-light-yellow border-0 text-center">
                                                        <strong>Max</strong>
                                                    </td>
                                                </tr>
                                            </tbody>
                                            {fancyBetData.map((item, index) => {
                                                const oddsKey = `fancy-${index}`;
                                                const currentOdds = oddsData[oddsKey] || [];
                                                const isLoading = loadingOdds[oddsKey] || false;

                                                return (
                                                    <tbody key={item.id || index} className="match-tbody">
                                                        <tr>
                                                            <td className="bg-yellow border-0">
                                                                <a className="d-flex align-items-center flex-wrap">
                                                                    <button
                                                                        onClick={() => toggleFancy(index, item.eventId, item.apiType)}
                                                                        type="button"
                                                                        className="angle-up down-up btn btn-primary me-1"
                                                                    >
                                                                        <IoChevronUpOutline className={activeFancyIndex === index ? 'rotated' : ''} />
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-primary me-1"
                                                                        style={{
                                                                            padding: "2px 6px",
                                                                            fontSize: 11,
                                                                            background: "rgb(255, 184, 12)",
                                                                            fontWeight: 600,
                                                                            border: "none"
                                                                        }}
                                                                    >
                                                                        View Details
                                                                    </button>
                                                                    <span className="me-1">{item.sport}</span>
                                                                    <strong>
                                                                        <a
                                                                            className='text-dark'
                                                                             href={`/viewmatch-fancy/series_idd/${item.marketId}/event_id/${item.eventId}/sport_id/4`}>
                                                                            {item.eventName}
                                                                        </a>
                                                                    </strong>
                                                                    <span className="ms-2" style={{ fontSize: '12px', color: '#666' }}>
                                                                        {item.marketType}
                                                                    </span>
                                                                </a>
                                                            </td>
                                                            <td className="border-0 bg-yellow text-center">
                                                                <p className="text-danger mb-0">({item.min})</p>
                                                            </td>
                                                            <td className="border-0 bg-yellow text-center">
                                                                <div>
                                                                    {item.bookPL1 && (
                                                                        <div className="d-flex justify-content-between">
                                                                            <span>{item.bookPL1.team}:</span>
                                                                            <span className={item.bookPL1.value < 0 ? 'text-danger' : 'text-success'}>
                                                                                {item.bookPL1.value}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                    {item.bookPL2 && (
                                                                        <div className="d-flex justify-content-between">
                                                                            <span>{item.bookPL2.team}:</span>
                                                                            <span className={item.bookPL2.value < 0 ? 'text-danger' : 'text-success'}>
                                                                                {item.bookPL2.value}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                    {!item.bookPL1 && !item.bookPL2 && (
                                                                        <span>0</span>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="border-0 bg-yellow text-center">
                                                                <p className="text-success mb-0">{item.max}</p>
                                                            </td>
                                                            <td className="border-right-0 text-center">
                                                                <a
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        closeAllModals();

                                                                        // Get team name
                                                                        let teamName = '';
                                                                        if (item.bookPL1) teamName = item.bookPL1.team;
                                                                        else if (item.bookPL2) teamName = item.bookPL2.team;
                                                                        else teamName = 'Book';

                                                                        // Create display title
                                                                        const displayTitle = `${item.eventName || 'Book'} - ${teamName}`;

                                                                        // Create user data object
                                                                        const bookUserData = {
                                                                            RunnerName: teamName,
                                                                            min: item.min,
                                                                            max: item.max,
                                                                            eventId: item.eventId,
                                                                            apiType: item.apiType,
                                                                            isBook: true,
                                                                            eventName: item.eventName
                                                                        };

                                                                        // Call the fancy handler
                                                                        handleViewfancydata(bookUserData);
                                                                    }}
                                                                    type='button'
                                                                    className="green-btn"
                                                                    href="#"
                                                                >
                                                                    book
                                                                </a>
                                                            </td>
                                                        </tr>
                                                        {activeFancyIndex === index && (
                                                            <tr>
                                                                <td colSpan="4" className="px-0 gray-inner_table">
                                                                    {isLoading ? (
                                                                        <div className="text-center py-3">
                                                                            <div className="spinner-border spinner-border-sm text-primary" role="status">
                                                                                <span className="visually-hidden">Loading...</span>
                                                                            </div>
                                                                            <span className="ms-2">Loading fancy odds data...</span>
                                                                        </div>
                                                                    ) : currentOdds && currentOdds.length > 0 ? (
                                                                        <table className="selection-table w-100">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td width="30%" className="text-start border-0">
                                                                                        <strong>{currentOdds.length} selections</strong>
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
                                                                                    <td className="refer-book border-0" colSpan={2} width="5%" id="layPercent">
                                                                                        99.5%
                                                                                    </td>
                                                                                </tr>
                                                                                {currentOdds.map((selection, selIndex) => (
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
                                                                    ) : (
                                                                        <div className="text-center py-3">
                                                                            <span className="text-muted">No fancy odds data available</span>
                                                                        </div>
                                                                    )}
                                                                </td>
                                                                <td width="80" className="border-l text-center">
                                                                    <a
                                                                        className="green-btn"
                                                                        onClick={(e) => handleEventBetsClick(item.eventId, item.apiType, item.agentId, e)}
                                                                        href="#"
                                                                    >
                                                                        Event Bets
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                );
                                            })}
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Agent-wise Downline PL Modal - Match Odds */}
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
                                    <h5 className="common-heading">
                                        {downlineData.title || 'Agent Wise Downline P/L'}
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={handleCloseModal}
                                    ></button>
                                </div>
                                <div className="modal-body p-0">
                                    {loadingDownline ? (
                                        <div className="text-center py-4">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        </div>
                                    ) : downlineData.headers && downlineData.headers.length > 0 && downlineData.rows && downlineData.rows.length > 0 ? (
                                        <div className="table-responsive account-table risk-pop">
                                            <table className="table table-bordered">
                                                <thead>
                                                    <tr>
                                                        {downlineData.headers.map((header, index) => (
                                                            <th key={index} scope="col">
                                                                {header}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {downlineData.rows.map((row, rowIndex) => {
                                                        return (
                                                            <tr key={rowIndex}>
                                                                {downlineData.headers.map((header, colIndex) => (
                                                                    <td key={colIndex}>
                                                                        {colIndex === 0 ? (
                                                                            <a className='text-decoration-underline'
                                                                                href="#"
                                                                                onClick={(e) => {
                                                                                    e.preventDefault();
                                                                                    handleViewBetsClick(
                                                                                        selectedEventId,
                                                                                        selectedType,
                                                                                        row.agent_id || row[header],
                                                                                        e
                                                                                    );
                                                                                }}
                                                                            >
                                                                                {row[header] || "N/A"}
                                                                            </a>
                                                                        ) : (
                                                                            <span className={parseFloat(row[header] || 0) < 0 ? 'text-danger' : 'text-success'}>
                                                                                {row[header] !== undefined ? row[header] : 0}
                                                                            </span>
                                                                        )}
                                                                    </td>
                                                                ))}
                                                            </tr>
                                                        );
                                                    })}
                                                    {downlineData.totalValues && downlineData.totalValues.length > 0 && (
                                                        <tr style={{ fontWeight: 600 }}>
                                                            <td className="text-start">Total</td>
                                                            {downlineData.totalValues.map((value, idx) => (
                                                                <td key={idx}>
                                                                    <span className={parseFloat(value || 0) < 0 ? 'text-danger' : 'text-success'}>
                                                                        {value}
                                                                    </span>
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="text-center py-4">
                                            <p>No data available</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Agent-wise Downline PL Modal - Bookmaker */}
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
                                    <h5 className="common-heading">
                                        {downlineData.title || 'Agent Wise Downline P/L'}
                                    </h5>
                                    <button
                                        type="button"
                                        className="green-btn btn btn-primary"
                                        onClick={handleCloseModalbookmaker}
                                    > X</button>
                                </div>
                                <div className="modal-body p-0">
                                    {loadingDownline ? (
                                        <div className="text-center py-4">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        </div>
                                    ) : downlineData.headers && downlineData.headers.length > 0 && downlineData.rows && downlineData.rows.length > 0 ? (
                                        <div className="table-responsive account-table risk-pop">
                                            <table className="table table-bordered">
                                                <thead>
                                                    <tr>
                                                        {downlineData.headers.map((header, index) => (
                                                            <th key={index} scope="col">
                                                                {header}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {downlineData.rows.map((row, rowIndex) => {
                                                        return (
                                                            <tr key={rowIndex}>
                                                                {downlineData.headers.map((header, colIndex) => (
                                                                    <td key={colIndex}>
                                                                        {colIndex === 0 ? (
                                                                            <a
                                                                                href="#"
                                                                                onClick={(e) => {
                                                                                    e.preventDefault();
                                                                                    handleViewBetsClick(
                                                                                        selectedEventId,
                                                                                        selectedType,
                                                                                        row.agent_id || row[header],
                                                                                        e
                                                                                    );
                                                                                }}
                                                                            >
                                                                                {row[header] || "N/A"}
                                                                            </a>
                                                                        ) : (
                                                                            <span className={parseFloat(row[header] || 0) < 0 ? 'text-danger' : 'text-success'}>
                                                                                {row[header] !== undefined ? row[header] : 0}
                                                                            </span>
                                                                        )}
                                                                    </td>
                                                                ))}
                                                            </tr>
                                                        );
                                                    })}
                                                    {downlineData.totalValues && downlineData.totalValues.length > 0 && (
                                                        <tr style={{ fontWeight: 600 }}>
                                                            <td className="text-start">Total</td>
                                                            {downlineData.totalValues.map((value, idx) => (
                                                                <td key={idx}>
                                                                    <span className={parseFloat(value || 0) < 0 ? 'text-danger' : 'text-success'}>
                                                                        {value}
                                                                    </span>
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="text-center py-4">
                                            <p>No data available</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Client-wise Downline PL Modal (View Bets) */}
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
                                    {clientDownlineData.title || 'Client Wise Downline P/L'}
                                </h2>
                                <button
                                    type="button"
                                    className="green-btn btn btn-primary"
                                    onClick={handleCloseBetsModal}
                                >
                                    X
                                </button>
                            </div>
                            {loadingClientDownline ? (
                                <div className="text-center py-4">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : clientDownlineData.rows && clientDownlineData.rows.length > 0 ? (
                                <div className="responsive">
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                {clientDownlineData.headers && clientDownlineData.headers.map((header, index) => (
                                                    <th key={index} scope="col" className='text-capitalize'>
                                                        {header === 'Client' ? 'Client Name' : header}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {clientDownlineData.rows.map((row, rowIndex) => (
                                                <tr key={rowIndex}>
                                                    {clientDownlineData.headers && clientDownlineData.headers.map((header, colIndex) => (
                                                        <td key={colIndex} >
                                                            {header === 'Client' ? (
                                                                <strong>
                                                                    {row[header] || 'N/A'}
                                                                </strong>
                                                            ) : (
                                                                <span className={parseFloat(row[header] || 0) < 0 ? 'text-danger' : 'text-success'}>
                                                                    {row[header] !== undefined ? row[header] : 0}
                                                                </span>
                                                            )}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                            {clientDownlineData.totalValues && clientDownlineData.totalValues.length > 0 && (
                                                <tr style={{ fontWeight: 600 }}>
                                                    {/* <td className="text-start"><strong>Total</strong></td> */}
                                                    {clientDownlineData.totalValues.map((value, idx) => (
                                                        <td key={idx}>
                                                            <span className={parseFloat(value || 0) < 0 ? 'text-danger' : 'text-success'}>
                                                                {value}
                                                            </span>
                                                        </td>
                                                    ))}
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <p>No data available</p>
                                </div>
                            )}
                        </div>
                    </section>
                </Modal.Body>
            </Modal>

            {/* Event Bets Modal */}
            <Modal
                show={showEventBetsModal}
                onHide={handleCloseEventBetsModal}
                size="xl"
                centered
            >
                <Modal.Body>
                    <section className="account-table">
                        <div className="container-fluid">
                            <div className="db-sec d-flex justify-content-between align-items-center mb-2">
                                <h2 className="common-heading">
                                    {eventBetsData.title || 'Event Bets'}
                                </h2>
                                <button
                                    type="button"
                                    className="green-btn btn btn-primary"
                                    onClick={handleCloseEventBetsModal}
                                >
                                    X
                                </button>
                            </div>
                            {loadingEventBets ? (
                                <div className="text-center py-4">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : eventBetsData.rows && eventBetsData.rows.length > 0 ? (
                                <div className="responsive">
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                {eventBetsData.headers && eventBetsData.headers.map((header, index) => (
                                                    <th key={index} scope="col" className='text-capitalize'>
                                                        {header}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {eventBetsData.rows.map((row, rowIndex) => (
                                                <tr key={rowIndex}>
                                                    {eventBetsData.headers && eventBetsData.headers.map((header, colIndex) => (
                                                        <td key={colIndex}>
                                                            {header === 'Client' ? (
                                                                <strong>{row[header] || 'N/A'}</strong>
                                                            ) : header === 'Total Stake' || header === 'Total Liability' || header === 'Total Bet Win' || header === 'Total' ? (
                                                                <span className={parseFloat(row[header] || 0) < 0 ? 'text-danger' : 'text-success'}>
                                                                    {row[header] !== undefined ? row[header] : 0}
                                                                </span>
                                                            ) : (
                                                                <span>{row[header] !== undefined ? row[header] : 0}</span>
                                                            )}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                            {eventBetsData.totalValues && eventBetsData.totalValues.length > 0 && (
                                                <tr style={{ fontWeight: 600, backgroundColor: '#f8f9fa' }}>
                                                    {/* <td className="text-start"><strong>Total</strong></td> */}
                                                    {eventBetsData.totalValues.map((value, idx) => (
                                                        <td key={idx}>
                                                            <span className={parseFloat(value || 0) < 0 ? 'text-danger' : 'text-success'}>
                                                                {value}
                                                            </span>
                                                        </td>
                                                    ))}
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <p>No bets available for this event</p>
                                </div>
                            )}
                        </div>
                    </section>
                </Modal.Body>
            </Modal>

            {/* ============= POPUP (Fancy & Book both use same) ============= */}
            {showPopups && (
                <div className="popup-overlay">
                    <div className="popup-modal">
                        <div className="db-sec d-flex justify-content-between align-items-center mb-2 p-3 pb-0">
                            <h2 className='common-heading mb-0'>{RunnerName}</h2>
                            <button
                                className="green-btn btn btn-primary"
                                onClick={() => setShowPopups(false)}
                            >
                                Close
                            </button>
                        </div>

                        <div className="popup-body">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Run</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedUser?.map((item, index) => (
                                        <tr
                                            key={index}
                                            style={{
                                                backgroundColor: parseFloat(item.profitLoss) < 0 ? "#ffc3d0" : "#98d4ff",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            <td>{item.run}</td>
                                            <td>{item.profitLoss}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="popup-footer">
                            <button
                                className="close-popup-btn"
                                onClick={() => setShowPopups(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* =========================================================== */}
        </main>
    );
}

export default Riskmangement;