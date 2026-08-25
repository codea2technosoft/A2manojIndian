import React, { useState } from 'react';

function Sportanalysis() {
    const [selectedMarket, setSelectedMarket] = useState('all');
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [profitupdate, setProfitupdate] = useState(false);
    const [downlinematch, setDownlinematch] = useState(false);

    // Sample data
    const bets = [
        {
            plId: 'shivu777',
            betId: 'mr4vhku0',
            placed: '7/3/2026, 5:21:26 PM',
            ip: '223.186.57.165',
            market: 'Cricket',
            selection: 'England U19 v South Africa U19',
            subMarket: '28 over run SA U19',
            oddsReq: 100,
            stake: 3000,
            liability: 3000,
            profit: 3000,
            type: 'Yes',
            isWin: true,
        },
        {
            plId: 'dundappa',
            betId: 'mr4vcg2a',
            placed: '7/3/2026, 5:17:26 PM',
            ip: '157.50.182.25',
            market: 'Cricket',
            selection: 'England U19 v South Africa U19',
            subMarket: '27 over run SA U19',
            oddsReq: 100,
            stake: 10000,
            liability: 10000,
            profit: 10000,
            type: 'Yes',
            isWin: true,
        },
        {
            plId: 'shivu777',
            betId: 'mr4v8585',
            placed: '7/3/2026, 5:14:06 PM',
            ip: '223.186.57.165',
            market: 'Cricket',
            selection: 'England U19 v South Africa U19',
            subMarket: '26 over run SA U19',
            oddsReq: 100,
            stake: 2500,
            liability: 2500,
            profit: 2500,
            type: 'Yes',
            isWin: true,
        },
        {
            plId: 'dundappa',
            betId: 'mr4v66zy',
            placed: '7/3/2026, 5:12:34 PM',
            ip: '157.50.183.148',
            market: 'Cricket',
            selection: 'England U19 v South Africa U19',
            subMarket: '25 over run SA U19',
            oddsReq: 100,
            stake: 20000,
            liability: 20000,
            profit: -20000,
            type: 'No',
            isWin: false,
        },
        {
            plId: 'shivu777',
            betId: 'mr4uqfur',
            placed: '7/3/2026, 5:00:19 PM',
            ip: '223.186.57.165',
            market: 'Cricket',
            selection: 'England U19 v South Africa U19',
            subMarket: '25 over run SA U19',
            oddsReq: 100,
            stake: 4000,
            liability: 4000,
            profit: 4000,
            type: 'Yes',
            isWin: true,
        },
        {
            plId: 'shivu777',
            betId: 'mr4ubu2l',
            placed: '7/3/2026, 4:48:58 PM',
            ip: '223.186.57.165',
            market: 'Cricket',
            selection: 'England U19 v South Africa U19',
            subMarket: '20 over run SA U19',
            oddsReq: 100,
            stake: 5000,
            liability: 5000,
            profit: 5000,
            type: 'Yes',
            isWin: true,
        },
        {
            plId: 'dundappa',
            betId: 'mr4u3jq3',
            placed: '7/3/2026, 4:42:31 PM',
            ip: '157.50.178.219',
            market: 'Cricket',
            selection: 'England U19 v South Africa U19',
            subMarket: '20 over run SA U19',
            oddsReq: 100,
            stake: 10000,
            liability: 10000,
            profit: 10000,
            type: 'Yes',
            isWin: true,
        },
        {
            plId: 'nabi001',
            betId: 'mr4u34m0',
            placed: '7/3/2026, 4:42:12 PM',
            ip: '106.206.104.105',
            market: 'Cricket',
            selection: 'England U19 v South Africa U19',
            subMarket: '20 over run SA U19',
            oddsReq: 100,
            stake: 100,
            liability: 100,
            profit: 100,
            type: 'Yes',
            isWin: true,
        },
        {
            plId: 'dundappa',
            betId: 'mr4tvupl',
            placed: '7/3/2026, 4:36:32 PM',
            ip: '157.50.178.219',
            market: 'Cricket',
            selection: 'England U19 v South Africa U19',
            subMarket: '16 over run SA U19',
            oddsReq: 100,
            stake: 10000,
            liability: 10000,
            profit: 10000,
            type: 'Yes',
            isWin: true,
        },
        {
            plId: 'shivu777',
            betId: 'mr4tl835',
            placed: '7/3/2026, 4:28:17 PM',
            ip: '223.186.57.165',
            market: 'Cricket',
            selection: 'England U19 v South Africa U19',
            subMarket: '15 over run SA U19',
            oddsReq: 90,
            stake: 4000,
            liability: 4000,
            profit: 3600,
            type: 'Yes',
            isWin: true,
        },
        {
            plId: 'shivu777',
            betId: 'mr4tfct1',
            placed: '7/3/2026, 4:23:43 PM',
            ip: '223.186.57.165',
            market: 'Cricket',
            selection: 'England U19 v South Africa U19',
            subMarket: '12 over run SA U19',
            oddsReq: 100,
            stake: 3000,
            liability: 3000,
            profit: 3000,
            type: 'Yes',
            isWin: true,
        },
        {
            plId: 'hanu',
            betId: 'mr4teilu',
            placed: '7/3/2026, 4:23:04 PM',
            ip: '106.217.43.113',
            market: 'Cricket',
            selection: 'England U19 v South Africa U19',
            subMarket: '50 over run SA U19',
            oddsReq: 100,
            stake: 6000,
            liability: 6000,
            profit: 6000,
            type: 'Yes',
            isWin: true,
        },
        {
            plId: 'shivu777',
            betId: 'mr4ssc2k',
            placed: '7/3/2026, 4:05:49 PM',
            ip: '223.186.57.165',
            market: 'Cricket',
            selection: 'England U19 v South Africa U19',
            subMarket: '10 over run SA U19',
            oddsReq: 100,
            stake: 3000,
            liability: 3000,
            profit: 3000,
            type: 'Yes',
            isWin: true,
        },
        {
            plId: 'shivu777',
            betId: 'mr4sgw4z',
            placed: '7/3/2026, 3:56:55 PM',
            ip: '223.186.57.165',
            market: 'Cricket',
            selection: 'England U19 v South Africa U19',
            subMarket: '7 over run SA U19',
            oddsReq: 100,
            stake: 2500,
            liability: 2500,
            profit: 2500,
            type: 'Yes',
            isWin: true,
        },
        {
            plId: 'ajay111',
            betId: 'mr4s8rjz',
            placed: '7/3/2026, 3:50:36 PM',
            ip: '157.50.64.137',
            market: 'Cricket',
            selection: 'England U19 v South Africa U19',
            subMarket: '10 over run SA U19',
            oddsReq: 100,
            stake: 1000,
            liability: 1000,
            profit: -1000,
            type: 'No',
            isWin: false,
        },
        {
            plId: 'nabi001',
            betId: 'mr4rzzp5',
            placed: '7/3/2026, 3:43:46 PM',
            ip: '106.206.104.105',
            market: 'Cricket',
            selection: 'England U19 v South Africa U19',
            subMarket: '10 over run SA U19',
            oddsReq: 100,
            stake: 100,
            liability: 100,
            profit: 100,
            type: 'Yes',
            isWin: true,
        },
        {
            plId: 'shivu777',
            betId: 'mr4rsgjf',
            placed: '7/3/2026, 3:37:55 PM',
            ip: '223.186.57.165',
            market: 'Cricket',
            selection: 'England U19 v South Africa U19',
            subMarket: '3 over run SA U19',
            oddsReq: 100,
            stake: 2500,
            liability: 2500,
            profit: 2500,
            type: 'Yes',
            isWin: true,
        },
    ];

    const filteredBets = selectedMarket === 'all'
        ? bets
        : bets.filter(bet => bet.market.toLowerCase() === selectedMarket.toLowerCase());

    return (
        <>
            <div className="allcommon">
                <main id="sportanalysis">
                    <div className="wrapper">
                        <div className="container-fluid container-padding-0">
                            <div className="row">
                                <div className="col-12 col-sm-12 col-md-12 col-lg-12 sport-anaylsis">
                                    <div className="main-box mainbox-mobile">
                                        <div className="row analysis-running-market mt-1">
                                            <div className="col-12 col-sm-12 col-md-12 col-lg-8 col-xl-7 sport-anaylsis-inner">
                                                <div className="in-play-left pb-0 mb-0 p-0">
                                                    <div className="main-in-play">
                                                        <div className="top grd-background toppadding">
                                                            <h4 className="w-100">
                                                                <span>
                                                                    England U19 v South Africa U19 - Unofficial
                                                                    International Matches
                                                                </span>
                                                                <span className="float-right">7/3/2026, 3:30:00 PM</span>
                                                            </h4>
                                                        </div>
                                                        <div className="livetv mt-1" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <iframe
                                                        className="responsive-iframe w-100"
                                                        id="scoreId"
                                                        style={{
                                                            overflow: "hidden",
                                                            height: 180,
                                                            backgroundColor: "rgb(0, 0, 0)"
                                                        }}
                                                        src="https://fasthit.uk/wick-nlivescorecard/?eventId=35775150&marketId=1.259688060&type=4"
                                                    />
                                                </div>
                                                <div className="main-analysis mb-2">
                                                    <div className="top">
                                                        <div className="toptitle d-inline">Match Odds</div>
                                                        <div>
                                                            <span className="bk-btn" onClick={() => setDownlinematch(true)}>BOOK</span>
                                                        </div>
                                                        <div className="min-max d-inline ">
                                                            <span>
                                                                <span className="desktop-minmax">
                                                                    Min: 100 | Max: 100100
                                                                </span>
                                                                <span
                                                                    className="f-right"
                                                                    style={{ paddingLeft: 5, cursor: "pointer" }}
                                                                >
                                                                    <i className="fa fa-minus" aria-hidden="true" />
                                                                </span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="table-responsive analysis-running-market bookmakerbs">
                                                        <table className="w-100 bets">
                                                            <tbody
                                                                style={{ borderLeft: "white", borderRight: "white" }}
                                                            >
                                                                <tr className="bet-all-new">
                                                                    <td className="w-55 mob-minmax">
                                                                        <span
                                                                            className="desktop-minmax text-gray"
                                                                            style={{ paddingLeft: 3 }}
                                                                        >
                                                                            Min: 100 | Max: 100100
                                                                        </span>
                                                                    </td>
                                                                    <td className="w-45 text-center">
                                                                        <div>
                                                                            <div className="w-50 float-left">
                                                                                <a
                                                                                    id="btnBack"
                                                                                    className="bid  btn-back mobile-hide bg-trans lh22"
                                                                                    side="Back"
                                                                                />
                                                                                <a
                                                                                    id="btnBack"
                                                                                    className="bid  btn-back mobile-hide bg-trans lh22"
                                                                                    side="Back"
                                                                                />
                                                                                <a
                                                                                    id="backAll"
                                                                                    className="bid  back-all lh22 bid1"
                                                                                >
                                                                                    <span className="f11">Back</span>
                                                                                </a>
                                                                            </div>
                                                                            <div className="w-50 float-left">
                                                                                <a id="layAll" className="ask  lay-all lh22 ask1">
                                                                                    <span className="f11">Lay</span>
                                                                                </a>
                                                                                <a
                                                                                    id="btnBack"
                                                                                    className="ask btn-lay mobile-hide bg-trans lh22"
                                                                                    side="lay"
                                                                                />
                                                                                <a
                                                                                    id="btnLay"
                                                                                    className="ask  btn-lay mobile-hide bg-trans lh22"
                                                                                    side="lay"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="w-55">
                                                                        <div className="d-flex flex-column align-items-start">
                                                                            <span className="in-play-title">England U19</span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="w-45 text-center">
                                                                        <div className="">
                                                                            <div className="widt50fleft">
                                                                                <div className="bid back-light-bg1 mobile-hide">
                                                                                    <span className="bid-price">1.54</span>
                                                                                    <span className="bid-price-small">421.52</span>
                                                                                </div>
                                                                                <div className="bid back-light-bg mobile-hide">
                                                                                    <span className="bid-price">1.55</span>
                                                                                    <span className="bid-price-small">10.79</span>
                                                                                </div>
                                                                                <div
                                                                                    title="1.56-198.31"
                                                                                    id="back_odds_middle_737329"
                                                                                    className="bid spark-back"
                                                                                >
                                                                                    <span className="bid-price">1.56</span>
                                                                                    <span className="bid-price-small">198.31</span>
                                                                                </div>
                                                                            </div>
                                                                            <div className="widt50fleft">
                                                                                <div
                                                                                    title="1.57-5.98"
                                                                                    id="lay_odds_middle_737329"
                                                                                    className="ask marg1 "
                                                                                >
                                                                                    <span className="bid-price">1.57</span>
                                                                                    <span className="bid-price-small">5.98</span>
                                                                                </div>
                                                                                <div
                                                                                    title="1.78-32.89"
                                                                                    id="lay_odds_right_737329"
                                                                                    className="ask lay-light-bg mobile-hide spark-lay"
                                                                                >
                                                                                    <span className="bid-price">1.78</span>
                                                                                    <span className="bid-price-small">32.89</span>
                                                                                </div>
                                                                                <div
                                                                                    title="1.8-3.73"
                                                                                    id="lay_odds_right_2737329"
                                                                                    className="ask lay-light-bg1 mobile-hide spark-lay"
                                                                                >
                                                                                    <span className="bid-price">1.8</span>
                                                                                    <span className="bid-price-small">3.73</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="w-55">
                                                                        <div className="d-flex flex-column align-items-start">
                                                                            <span className="in-play-title">
                                                                                South Africa U19
                                                                            </span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="w-45 text-center">
                                                                        <div className="">
                                                                            <div className="widt50fleft">
                                                                                <div className="bid back-light-bg1 mobile-hide">
                                                                                    <span className="bid-price">2.24</span>
                                                                                    <span className="bid-price-small">3</span>
                                                                                </div>
                                                                                <div className="bid back-light-bg mobile-hide">
                                                                                    <span className="bid-price">2.28</span>
                                                                                    <span className="bid-price-small">25.68</span>
                                                                                </div>
                                                                                <div
                                                                                    title="2.74-3.43"
                                                                                    id="back_odds_middle_2858004"
                                                                                    className="bid spark-back"
                                                                                >
                                                                                    <span className="bid-price">2.74</span>
                                                                                    <span className="bid-price-small">3.43</span>
                                                                                </div>
                                                                            </div>
                                                                            <div className="widt50fleft">
                                                                                <div
                                                                                    title="2.8-110.49"
                                                                                    id="lay_odds_middle_2858004"
                                                                                    className="ask marg1 "
                                                                                >
                                                                                    <span className="bid-price">2.8</span>
                                                                                    <span className="bid-price-small">110.49</span>
                                                                                </div>
                                                                                <div
                                                                                    title="2.82-5.93"
                                                                                    id="lay_odds_right_2858004"
                                                                                    className="ask lay-light-bg mobile-hide spark-lay"
                                                                                >
                                                                                    <span className="bid-price">2.82</span>
                                                                                    <span className="bid-price-small">5.93</span>
                                                                                </div>
                                                                                <div
                                                                                    title="2.86-226.98"
                                                                                    id="lay_odds_right_22858004"
                                                                                    className="ask lay-light-bg1 mobile-hide spark-lay"
                                                                                >
                                                                                    <span className="bid-price">2.86</span>
                                                                                    <span className="bid-price-small">226.98</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr style={{ borderBottom: "white" }}>
                                                                    <td colSpan={2}>
                                                                        <span className="fancymassage float-right bmmassage">
                                                                            <i className="fa fa-envelope mr-1" /> Virtual
                                                                            Cricket Bet Started In Our Exchange...
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                                <div className="main-analysis mb-2">
                                                    <div className="top">
                                                        <div className="toptitle d-inline">Bookmaker</div>
                                                        <div>
                                                            <span className="bk-btn">BOOK</span>
                                                        </div>
                                                        <div className="min-max d-inline ">
                                                            <span>
                                                                <span className="desktop-minmax">
                                                                    Min: 100 | Max: 510000
                                                                </span>
                                                                <span
                                                                    className="f-right"
                                                                    style={{ paddingLeft: 5, cursor: "pointer" }}
                                                                >
                                                                    <i className="fa fa-minus" aria-hidden="true" />
                                                                </span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="table-responsive analysis-running-market bookmakerbs">
                                                        <table className="w-100 bets">
                                                            <tbody
                                                                style={{ borderLeft: "white", borderRight: "white" }}
                                                            >
                                                                <tr className="bet-all-new">
                                                                    <td className="w-55 mob-minmax">
                                                                        <span
                                                                            className="desktop-minmax text-gray"
                                                                            style={{ paddingLeft: 3 }}
                                                                        >
                                                                            Min: 100 | Max: 510000
                                                                        </span>
                                                                    </td>
                                                                    <td className="w-45 text-center">
                                                                        <div>
                                                                            <div className="w-50 float-left">
                                                                                <a
                                                                                    id="btnBack"
                                                                                    className="bid  btn-back mobile-hide bg-trans lh22"
                                                                                    side="Back"
                                                                                />
                                                                                <a
                                                                                    id="btnBack"
                                                                                    className="bid  btn-back mobile-hide bg-trans lh22"
                                                                                    side="Back"
                                                                                />
                                                                                <a
                                                                                    id="backAll"
                                                                                    className="bid  back-all lh22 bid1"
                                                                                >
                                                                                    <span className="f11">Back</span>
                                                                                </a>
                                                                            </div>
                                                                            <div className="w-50 float-left">
                                                                                <a id="layAll" className="ask  lay-all lh22 ask1">
                                                                                    <span className="f11">Lay</span>
                                                                                </a>
                                                                                <a
                                                                                    id="btnBack"
                                                                                    className="ask btn-lay mobile-hide bg-trans lh22"
                                                                                    side="lay"
                                                                                />
                                                                                <a
                                                                                    id="btnLay"
                                                                                    className="ask  btn-lay mobile-hide bg-trans lh22"
                                                                                    side="lay"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="w-55">
                                                                        <div className="d-flex flex-column align-items-start">
                                                                            <span className="in-play-title">England U19</span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="w-45 text-center">
                                                                        <div className="">
                                                                            <div className="widt50fleft">
                                                                                <div className="bid back-light-bg1 mobile-hide">
                                                                                    <span className="bid-price">-</span>
                                                                                </div>
                                                                                <div className="bid back-light-bg mobile-hide">
                                                                                    <span className="bid-price">-</span>
                                                                                </div>
                                                                                <div
                                                                                    title="59-200000"
                                                                                    id="back_odds_middle_737329"
                                                                                    className="bid spark-back"
                                                                                >
                                                                                    <span className="bid-price">59</span>
                                                                                </div>
                                                                            </div>
                                                                            <div className="widt50fleft">
                                                                                <div
                                                                                    title="63-200000"
                                                                                    id="lay_odds_middle_737329"
                                                                                    className="ask marg1 spark-lay"
                                                                                >
                                                                                    <span className="bid-price">63</span>
                                                                                </div>
                                                                                <div
                                                                                    title="-"
                                                                                    id="lay_odds_right_737329"
                                                                                    className="ask lay-light-bg mobile-hide spark-lay"
                                                                                >
                                                                                    <span className="bid-price">-</span>
                                                                                </div>
                                                                                <div
                                                                                    title="-"
                                                                                    id="lay_odds_right_2737329"
                                                                                    className="ask lay-light-bg1 mobile-hide spark-lay"
                                                                                >
                                                                                    <span className="bid-price">-</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="w-55">
                                                                        <div className="d-flex flex-column align-items-start">
                                                                            <span className="in-play-title">
                                                                                South Africa U19
                                                                            </span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="w-45 text-center">
                                                                        <div className="">
                                                                            <div className="widt50fleft">
                                                                                <div className="bid back-light-bg1 mobile-hide">
                                                                                    <span className="bid-price">-</span>
                                                                                </div>
                                                                                <div className="bid back-light-bg mobile-hide">
                                                                                    <span className="bid-price">-</span>
                                                                                </div>
                                                                                <div
                                                                                    title={-50000}
                                                                                    id="back_odds_middle_2858004"
                                                                                    className="bid spark-back"
                                                                                >
                                                                                    <span className="bid-price">-</span>
                                                                                </div>
                                                                            </div>
                                                                            <div className="widt50fleft">
                                                                                <div
                                                                                    title={-50000}
                                                                                    id="lay_odds_middle_2858004"
                                                                                    className="ask marg1 spark-lay"
                                                                                >
                                                                                    <span className="bid-price">-</span>
                                                                                </div>
                                                                                <div
                                                                                    title="-"
                                                                                    id="lay_odds_right_2858004"
                                                                                    className="ask lay-light-bg mobile-hide spark-lay"
                                                                                >
                                                                                    <span className="bid-price">-</span>
                                                                                </div>
                                                                                <div
                                                                                    title="-"
                                                                                    id="lay_odds_right_22858004"
                                                                                    className="ask lay-light-bg1 mobile-hide spark-lay"
                                                                                >
                                                                                    <span className="bid-price">-</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr style={{ borderBottom: "white" }}>
                                                                    <td colSpan={2}>
                                                                        <span className="fancymassage float-right bmmassage">
                                                                            <i className="fa fa-envelope mr-1" /> Virtual
                                                                            Cricket Bet Started In Our Exchange...
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                                <div className="row mt-3">
                                                    <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                                                        <div className="main-analysis mb-2">
                                                            <div className="fancybtn-new">
                                                                <a className="active">Fancy</a>
                                                            </div>
                                                            <div className="w-100 d-block fancybg">
                                                                <ul className="fancy-filter">
                                                                    <li>
                                                                        <a className="active">All</a>
                                                                    </li>
                                                                </ul>
                                                                <span
                                                                    className="fancyplus-icon"
                                                                    style={{ paddingLeft: 5, cursor: "pointer" }}
                                                                >
                                                                    <i className="fa fa-minus" aria-hidden="true" />
                                                                </span>
                                                            </div>
                                                            <div className="table-responsive  game-wrap">
                                                                <table className="w-100 analysis-running-market bookmakerfancy fancytable">
                                                                    <tbody>
                                                                        <tr className="bet-all-new">
                                                                            <td className="fancyw-65 pb-0">&nbsp;</td>
                                                                            <td className="fancyw-20 pb-0 text-center">
                                                                                <div>
                                                                                    <div className="fantitle d-inline">
                                                                                        <a
                                                                                            id="btnBack"
                                                                                            className="btn-back bg-trans"
                                                                                            side="Back"
                                                                                        >
                                                                                            <span className="ask-price">No</span>
                                                                                        </a>
                                                                                    </div>
                                                                                    <div className="fantitle d-inline">
                                                                                        <a
                                                                                            id="btnLay"
                                                                                            className="btn-lay bg-trans"
                                                                                            side="Lay"
                                                                                        >
                                                                                            <span className="ask-price">Yes</span>
                                                                                        </a>
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                            <td className="fancyw-15 pb-0 p-relative mobile-hide">
                                                                                &nbsp;
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className="fancyw-50 px-1">
                                                                                <div className="runningf in-play-title ">
                                                                                    <div className="d-block">
                                                                                        <span className="marketnamemobile">
                                                                                            50 over run SA U19
                                                                                        </span>
                                                                                    </div>
                                                                                    <div className="d-flex mt-1">
                                                                                        <div
                                                                                            className="text-danger d-flex align-items-center"
                                                                                            style={{ fontWeight: 600, fontSize: 11 }}
                                                                                        >
                                                                                            <svg
                                                                                                stroke="currentColor"
                                                                                                fill="currentColor"
                                                                                                strokeWidth={0}
                                                                                                viewBox="0 0 448 512"
                                                                                                className="text-danger"
                                                                                                height="1em"
                                                                                                width="1em"
                                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                                style={{ marginRight: 3 }}
                                                                                            >
                                                                                                <path d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z" />
                                                                                            </svg>
                                                                                            6000.00
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <button
                                                                                    type="button"
                                                                                    className="btn-book-new btn btn-primary"
                                                                                >
                                                                                    Book
                                                                                </button>
                                                                            </td>
                                                                            <td className="w-16">
                                                                                <div className="" datascustomattribute="">
                                                                                    <div className=" ask d-inline">
                                                                                        <span className="ask-price">264</span>
                                                                                        <span className="ask-price-small">100</span>
                                                                                    </div>
                                                                                    <div className="bid d-inline">
                                                                                        <span className="bid-price">266</span>
                                                                                        <span className="bid-price-small">100</span>
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                            <td className="w-16 w-16-1 mobile-hide">
                                                                                <div className="min-max-price">
                                                                                    <span className="d-block">
                                                                                        Min: <span>100</span>
                                                                                    </span>
                                                                                    <span className="d-block ">
                                                                                        Max: <span>201000</span>
                                                                                    </span>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className="fancyw-50 px-1">
                                                                                <div className="runningf in-play-title ">
                                                                                    <div className="d-block">
                                                                                        <span className="marketnamemobile">
                                                                                            Fall of 7th wkt SA U19
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                            <td className="w-16">
                                                                                <div
                                                                                    className="ballrunning-fancy"
                                                                                    datascustomattribute="Suspended"
                                                                                >
                                                                                    <div className=" ask d-inline">
                                                                                        <span className="ask-price">0</span>
                                                                                        <span className="ask-price-small">0</span>
                                                                                    </div>
                                                                                    <div className="bid d-inline">
                                                                                        <span className="bid-price">0</span>
                                                                                        <span className="bid-price-small">0</span>
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                            <td className="w-16 w-16-1 mobile-hide">
                                                                                <div className="min-max-price">
                                                                                    <span className="d-block">
                                                                                        Min: <span>100</span>
                                                                                    </span>
                                                                                    <span className="d-block ">
                                                                                        Max: <span>201000</span>
                                                                                    </span>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className="fancyw-50 px-1">
                                                                                <div className="runningf in-play-title ">
                                                                                    <div className="d-block">
                                                                                        <span className="marketnamemobile">
                                                                                            7th wkt pship BoundariesSA U19
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                            <td className="w-16">
                                                                                <div
                                                                                    className="ballrunning-fancy"
                                                                                    datascustomattribute="Ball Running"
                                                                                >
                                                                                    <div className=" ask d-inline">
                                                                                        <span className="ask-price">0</span>
                                                                                        <span className="ask-price-small">0</span>
                                                                                    </div>
                                                                                    <div className="bid d-inline">
                                                                                        <span className="bid-price">0</span>
                                                                                        <span className="bid-price-small">0</span>
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                            <td className="w-16 w-16-1 mobile-hide">
                                                                                <div className="min-max-price">
                                                                                    <span className="d-block">
                                                                                        Min: <span>100</span>
                                                                                    </span>
                                                                                    <span className="d-block ">
                                                                                        Max: <span>201000</span>
                                                                                    </span>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className="fancyw-50 px-1">
                                                                                <div className="runningf in-play-title ">
                                                                                    <div className="d-block">
                                                                                        <span className="marketnamemobile">
                                                                                            V Pretorius run
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                            <td className="w-16">
                                                                                <div className="" datascustomattribute="">
                                                                                    <div className=" ask d-inline">
                                                                                        <span className="ask-price">51</span>
                                                                                        <span className="ask-price-small">110</span>
                                                                                    </div>
                                                                                    <div className="bid d-inline">
                                                                                        <span className="bid-price">51</span>
                                                                                        <span className="bid-price-small">90</span>
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                            <td className="w-16 w-16-1 mobile-hide">
                                                                                <div className="min-max-price">
                                                                                    <span className="d-block">
                                                                                        Min: <span>100</span>
                                                                                    </span>
                                                                                    <span className="d-block ">
                                                                                        Max: <span>201000</span>
                                                                                    </span>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className="fancyw-50 px-1">
                                                                                <div className="runningf in-play-title ">
                                                                                    <div className="d-block">
                                                                                        <span className="marketnamemobile">
                                                                                            V Pretorius boundaries
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                            <td className="w-16">
                                                                                <div
                                                                                    className="ballrunning-fancy"
                                                                                    datascustomattribute="Suspended"
                                                                                >
                                                                                    <div className=" ask d-inline">
                                                                                        <span className="ask-price">0</span>
                                                                                        <span className="ask-price-small">0</span>
                                                                                    </div>
                                                                                    <div className="bid d-inline">
                                                                                        <span className="bid-price">0</span>
                                                                                        <span className="bid-price-small">0</span>
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                            <td className="w-16 w-16-1 mobile-hide">
                                                                                <div className="min-max-price">
                                                                                    <span className="d-block">
                                                                                        Min: <span>100</span>
                                                                                    </span>
                                                                                    <span className="d-block ">
                                                                                        Max: <span>201000</span>
                                                                                    </span>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className="fancyw-50 px-1">
                                                                                <div className="runningf in-play-title ">
                                                                                    <div className="d-block">
                                                                                        <span className="marketnamemobile">
                                                                                            B Mbatha run
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                            <td className="w-16">
                                                                                <div
                                                                                    className="ballrunning-fancy"
                                                                                    datascustomattribute="Suspended"
                                                                                >
                                                                                    <div className=" ask d-inline">
                                                                                        <span className="ask-price">0</span>
                                                                                        <span className="ask-price-small">0</span>
                                                                                    </div>
                                                                                    <div className="bid d-inline">
                                                                                        <span className="bid-price">0</span>
                                                                                        <span className="bid-price-small">0</span>
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                            <td className="w-16 w-16-1 mobile-hide">
                                                                                <div className="min-max-price">
                                                                                    <span className="d-block">
                                                                                        Min: <span>100</span>
                                                                                    </span>
                                                                                    <span className="d-block ">
                                                                                        Max: <span>201000</span>
                                                                                    </span>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className="fancyw-50 px-1">
                                                                                <div className="runningf in-play-title ">
                                                                                    <div className="d-block">
                                                                                        <span className="marketnamemobile">
                                                                                            B Mbatha boundaries
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                            <td className="w-16">
                                                                                <div
                                                                                    className="ballrunning-fancy"
                                                                                    datascustomattribute="Ball Running"
                                                                                >
                                                                                    <div className=" ask d-inline">
                                                                                        <span className="ask-price">0</span>
                                                                                        <span className="ask-price-small">0</span>
                                                                                    </div>
                                                                                    <div className="bid d-inline">
                                                                                        <span className="bid-price">0</span>
                                                                                        <span className="bid-price-small">0</span>
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                            <td className="w-16 w-16-1 mobile-hide">
                                                                                <div className="min-max-price">
                                                                                    <span className="d-block">
                                                                                        Min: <span>100</span>
                                                                                    </span>
                                                                                    <span className="d-block ">
                                                                                        Max: <span>201000</span>
                                                                                    </span>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className="fancyw-50 px-1">
                                                                                <div className="runningf in-play-title ">
                                                                                    <div className="d-block">
                                                                                        <span className="marketnamemobile">
                                                                                            28 over run SA U19
                                                                                        </span>
                                                                                    </div>
                                                                                    <div className="d-flex mt-1">
                                                                                        <div
                                                                                            className="text-danger d-flex align-items-center"
                                                                                            style={{ fontWeight: 600, fontSize: 11 }}
                                                                                        >
                                                                                            <svg
                                                                                                stroke="currentColor"
                                                                                                fill="currentColor"
                                                                                                strokeWidth={0}
                                                                                                viewBox="0 0 448 512"
                                                                                                className="text-danger"
                                                                                                height="1em"
                                                                                                width="1em"
                                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                                style={{ marginRight: 3 }}
                                                                                            >
                                                                                                <path d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z" />
                                                                                            </svg>
                                                                                            3000.00
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <button
                                                                                    type="button"
                                                                                    className="btn-book-new btn btn-primary"
                                                                                >
                                                                                    Book
                                                                                </button>
                                                                            </td>
                                                                            <td className="w-16">
                                                                                <div
                                                                                    className="ballrunning-fancy"
                                                                                    datascustomattribute="Ball Running"
                                                                                >
                                                                                    <div className=" ask d-inline">
                                                                                        <span className="ask-price">0</span>
                                                                                        <span className="ask-price-small">0</span>
                                                                                    </div>
                                                                                    <div className="bid d-inline">
                                                                                        <span className="bid-price">0</span>
                                                                                        <span className="bid-price-small">0</span>
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                            <td className="w-16 w-16-1 mobile-hide">
                                                                                <div className="min-max-price">
                                                                                    <span className="d-block">
                                                                                        Min: <span>100</span>
                                                                                    </span>
                                                                                    <span className="d-block ">
                                                                                        Max: <span>201000</span>
                                                                                    </span>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className="fancyw-50 px-1">
                                                                                <div className="runningf in-play-title ">
                                                                                    <div className="d-block">
                                                                                        <span className="marketnamemobile">
                                                                                            29 over run SA U19
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                            <td className="w-16">
                                                                                <div
                                                                                    className="ballrunning-fancy"
                                                                                    datascustomattribute="Suspended"
                                                                                >
                                                                                    <div className=" ask d-inline">
                                                                                        <span className="ask-price">0</span>
                                                                                        <span className="ask-price-small">0</span>
                                                                                    </div>
                                                                                    <div className="bid d-inline">
                                                                                        <span className="bid-price">0</span>
                                                                                        <span className="bid-price-small">0</span>
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                            <td className="w-16 w-16-1 mobile-hide">
                                                                                <div className="min-max-price">
                                                                                    <span className="d-block">
                                                                                        Min: <span>100</span>
                                                                                    </span>
                                                                                    <span className="d-block ">
                                                                                        Max: <span>201000</span>
                                                                                    </span>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className="fancyw-50 px-1">
                                                                                <div className="runningf in-play-title ">
                                                                                    <div className="d-block">
                                                                                        <span className="marketnamemobile">
                                                                                            30 over run SA U19
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                            <td className="w-16">
                                                                                <div
                                                                                    className="ballrunning-fancy"
                                                                                    datascustomattribute="Suspended"
                                                                                >
                                                                                    <div className=" ask d-inline">
                                                                                        <span className="ask-price">0</span>
                                                                                        <span className="ask-price-small">0</span>
                                                                                    </div>
                                                                                    <div className="bid d-inline">
                                                                                        <span className="bid-price">0</span>
                                                                                        <span className="bid-price-small">0</span>
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                            <td className="w-16 w-16-1 mobile-hide">
                                                                                <div className="min-max-price">
                                                                                    <span className="d-block">
                                                                                        Min: <span>100</span>
                                                                                    </span>
                                                                                    <span className="d-block ">
                                                                                        Max: <span>201000</span>
                                                                                    </span>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className="fancyw-50 px-1">
                                                                                <div className="runningf in-play-title ">
                                                                                    <div className="d-block">
                                                                                        <span className="marketnamemobile">
                                                                                            30 over run bhav SA U19
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                            <td className="w-16">
                                                                                <div
                                                                                    className="ballrunning-fancy"
                                                                                    datascustomattribute="Suspended"
                                                                                >
                                                                                    <div className=" ask d-inline">
                                                                                        <span className="ask-price">0</span>
                                                                                        <span className="ask-price-small">0</span>
                                                                                    </div>
                                                                                    <div className="bid d-inline">
                                                                                        <span className="bid-price">0</span>
                                                                                        <span className="bid-price-small">0</span>
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                            <td className="w-16 w-16-1 mobile-hide">
                                                                                <div className="min-max-price">
                                                                                    <span className="d-block">
                                                                                        Min: <span>100</span>
                                                                                    </span>
                                                                                    <span className="d-block ">
                                                                                        Max: <span>201000</span>
                                                                                    </span>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                className="col-12 col-sm-12 col-md-12 col-lg-4 col-xl-5 sport-anaylsis-inner"
                                                id="main-analysis-st"
                                            >
                                                <div className="main-analysis mb-2 ">
                                                    <div className="">
                                                        <div className="top">
                                                            <div className="w-100">
                                                                <div className="ifc">
                                                                    <span className="count">
                                                                        Odds <span className="pl-1 badge two">0</span>
                                                                    </span>
                                                                    <span className="count pl-1 pr-1">
                                                                        BM <span className="pl-1 badge two"> 0</span>
                                                                    </span>
                                                                    <span className="count pl-1">
                                                                        Fancy <span className="pl-1 badge two"> 17</span>
                                                                    </span>
                                                                </div>
                                                                <a
                                                                    className="matched-btn float-right text-white"
                                                                    data-toggle="modal"
                                                                    data-target="#mystatement"
                                                                    onClick={() => setIsPopupOpen(true)}
                                                                >
                                                                    All Bets
                                                                    <i className="fa fa-list ml-1" aria-hidden="true" />
                                                                </a>
                                                                <a onClick={() => setProfitupdate(true)} className="matched-btn float-right text-white mr-1">
                                                                    P&amp;L
                                                                    <i
                                                                        className="fa fa-line-chart ml-1"
                                                                        aria-hidden="true"
                                                                    />
                                                                </a>
                                                            </div>
                                                        </div>
                                                        <div className="table-responsive  max-hight">
                                                            <table className="w-100 table-sm font-12 text-black whitespace">
                                                                <thead className="">
                                                                    <tr className="bg-dark text-white bg-dark1">
                                                                        <td>UserName</td>
                                                                        <td>Market</td>
                                                                        <td>Runner</td>
                                                                        <td>Rate</td>
                                                                        <td>Amount</td>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <tr bgcolor="#72BBEF">
                                                                        <td>shivu777</td>
                                                                        <td>28 over run SA U19</td>
                                                                        <td>100 / 153</td>
                                                                        <td className="fbold">100</td>
                                                                        <td className="fbold">3000</td>
                                                                    </tr>
                                                                    <tr bgcolor="#72BBEF">
                                                                        <td>dundappa</td>
                                                                        <td>27 over run SA U19</td>
                                                                        <td>100 / 146</td>
                                                                        <td className="fbold">100</td>
                                                                        <td className="fbold">10000</td>
                                                                    </tr>
                                                                    <tr bgcolor="#72BBEF">
                                                                        <td>shivu777</td>
                                                                        <td>26 over run SA U19</td>
                                                                        <td>100 / 136</td>
                                                                        <td className="fbold">100</td>
                                                                        <td className="fbold">2500</td>
                                                                    </tr>
                                                                    <tr bgcolor="#FAA9BA">
                                                                        <td>dundappa</td>
                                                                        <td>25 over run SA U19</td>
                                                                        <td>100 / 129</td>
                                                                        <td className="fbold">100</td>
                                                                        <td className="fbold">20000</td>
                                                                    </tr>
                                                                    <tr bgcolor="#72BBEF">
                                                                        <td>shivu777</td>
                                                                        <td>25 over run SA U19</td>
                                                                        <td>100 / 137</td>
                                                                        <td className="fbold">100</td>
                                                                        <td className="fbold">4000</td>
                                                                    </tr>
                                                                    <tr bgcolor="#72BBEF">
                                                                        <td>shivu777</td>
                                                                        <td>20 over run SA U19</td>
                                                                        <td>100 / 117</td>
                                                                        <td className="fbold">100</td>
                                                                        <td className="fbold">5000</td>
                                                                    </tr>
                                                                    <tr bgcolor="#72BBEF">
                                                                        <td>dundappa</td>
                                                                        <td>20 over run SA U19</td>
                                                                        <td>100 / 121</td>
                                                                        <td className="fbold">100</td>
                                                                        <td className="fbold">10000</td>
                                                                    </tr>
                                                                    <tr bgcolor="#72BBEF">
                                                                        <td>nabi001</td>
                                                                        <td>20 over run SA U19</td>
                                                                        <td>100 / 121</td>
                                                                        <td className="fbold">100</td>
                                                                        <td className="fbold">100</td>
                                                                    </tr>
                                                                    <tr bgcolor="#72BBEF">
                                                                        <td>dundappa</td>
                                                                        <td>16 over run SA U19</td>
                                                                        <td>100 / 98</td>
                                                                        <td className="fbold">100</td>
                                                                        <td className="fbold">10000</td>
                                                                    </tr>
                                                                    <tr bgcolor="#72BBEF">
                                                                        <td>shivu777</td>
                                                                        <td>15 over run SA U19</td>
                                                                        <td>90 / 88</td>
                                                                        <td className="fbold">90</td>
                                                                        <td className="fbold">4000</td>
                                                                    </tr>
                                                                    <tr bgcolor="#72BBEF">
                                                                        <td>shivu777</td>
                                                                        <td>12 over run SA U19</td>
                                                                        <td>100 / 77</td>
                                                                        <td className="fbold">100</td>
                                                                        <td className="fbold">3000</td>
                                                                    </tr>
                                                                    <tr bgcolor="#72BBEF">
                                                                        <td>hanu</td>
                                                                        <td>50 over run SA U19</td>
                                                                        <td>100 / 250</td>
                                                                        <td className="fbold">100</td>
                                                                        <td className="fbold">6000</td>
                                                                    </tr>
                                                                    <tr bgcolor="#72BBEF">
                                                                        <td>shivu777</td>
                                                                        <td>10 over run SA U19</td>
                                                                        <td>100 / 52</td>
                                                                        <td className="fbold">100</td>
                                                                        <td className="fbold">3000</td>
                                                                    </tr>
                                                                    <tr bgcolor="#72BBEF">
                                                                        <td>shivu777</td>
                                                                        <td>7 over run SA U19</td>
                                                                        <td>100 / 36</td>
                                                                        <td className="fbold">100</td>
                                                                        <td className="fbold">2500</td>
                                                                    </tr>
                                                                    <tr bgcolor="#FAA9BA">
                                                                        <td>ajay111</td>
                                                                        <td>10 over run SA U19</td>
                                                                        <td>100 / 47</td>
                                                                        <td className="fbold">100</td>
                                                                        <td className="fbold">1000</td>
                                                                    </tr>
                                                                    <tr bgcolor="#72BBEF">
                                                                        <td>nabi001</td>
                                                                        <td>10 over run SA U19</td>
                                                                        <td>100 / 49</td>
                                                                        <td className="fbold">100</td>
                                                                        <td className="fbold">100</td>
                                                                    </tr>
                                                                    <tr bgcolor="#72BBEF">
                                                                        <td>shivu777</td>
                                                                        <td>3 over run SA U19</td>
                                                                        <td>100 / 13</td>
                                                                        <td className="fbold">100</td>
                                                                        <td className="fbold">2500</td>
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
                        </div>
                    </div>

                </main>

            </div>
            {downlinematch && (
                <div className="popup-overlay downlinepopup" onClick={() => setDownlinematch(false)}>
                    <div className="popup" onClick={(e) => e.stopPropagation()}>
                     
                        <div className="popup-body">
                        <div className="d-flex mb-2 justify-content-between align-items-center w-100">
                             <h4 className='common-heading'>England U19 v South Africa U19 ( Match Odds )</h4>
                            <button className="green-btn" onClick={() => setDownlinematch(false)}>×</button>
                        </div>
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">Downline</th>
                                            <th scope="col"> England U19</th>
                                            <th scope="col">South Africa U19</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="text-start">
                                                <a href="#" className="text-primary">
                                                    <span>CL</span>
                                                </a>
                                                madhu11
                                            </td>
                                            <td>
                                                <span className="text-danger">-1000.00</span>
                                            </td>
                                            <td>
                                                <span className="text-success">2900.00</span>
                                            </td>
                                        </tr>
                                        <tr style={{ fontWeight: 600 }}>
                                            <td className="text-start">Total</td>
                                            <td>
                                                <span className="text-danger">-1000.00</span>
                                            </td>
                                            <td>
                                                <span className="text-success">2900.00</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                        </div>


                    </div>
                </div>
            )}
            {profitupdate && (
                <div className="popup-overlay" onClick={() => setProfitupdate(false)}>
                    <div className="popup" onClick={(e) => e.stopPropagation()}>
                        {/* Header */}
                        <div className="popup-header">
                            <h4>View More Bet</h4>
                            <button className="close-btn" onClick={() => setProfitupdate(false)}>×</button>
                        </div>

                        {/* Body */}
                        <div className="popup-body">
                            <div className="mb-2 d-flex justify-content-between align-items-center">
                                <h6>
                                    35775150 - England U19 v South Africa U19{" "}
                                    <svg
                                        stroke="currentColor"
                                        fill="none"
                                        strokeWidth={2}
                                        viewBox="0 0 24 24"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        color="green"
                                        cursor="pointer"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                        style={{ color: "green", marginLeft: 5 }}
                                    >
                                        <polyline points="23 4 23 10 17 10" />
                                        <polyline points="1 20 1 14 7 14" />
                                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                                    </svg>
                                </h6>{" "}
                                <h6>35775150 - Unofficial International Matches</h6>
                            </div>

                            {/* Filter */}
                            <div className="filter-wrap">
                                <label className='form-label'>Select Market Type</label>
                                <select
                                    value={selectedMarket}
                                    onChange={(e) => setSelectedMarket(e.target.value)}
                                >
                                    <option value="all">Select Market Type</option>
                                    <option value="betfair">BetFair</option>
                                    <option value="bookmaker">Bookmaker</option>
                                    <option value="fancy">Fancy</option>
                                    <option value="sportbook">SportBook</option>
                                    <option value="wifibook">Wifi Bookmaker</option>
                                </select>
                            </div>

                            {/* Table */}
                            <div className="table-wrap">
                                <table className='table'>
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
                                        {filteredBets.map((bet) => (
                                            <tr key={bet.betId} className={bet.isWin ? 'win-row' : 'loss-row'}>
                                                <td>{bet.plId}</td>
                                                <td>{bet.betId}</td>
                                                <td>{bet.placed}</td>
                                                <td>{bet.ip}</td>
                                                <td>
                                                    {bet.market}
                                                    <span className="arrow">▸</span>
                                                    <strong>{bet.selection}</strong>
                                                    <span className="arrow">▸</span>
                                                    {bet.subMarket}
                                                </td>
                                                <td>{bet.type === 'Yes' ? `${bet.oddsReq}/100` : `${bet.oddsReq}/100`}</td>
                                                <td>{bet.type}</td>
                                                <td>{bet.oddsReq}</td>
                                                <td>{bet.stake}</td>
                                                <td>{bet.liability}</td>
                                                <td className={bet.isWin ? 'profit text-success' : 'loss text-danger'}>
                                                    {bet.isWin ? bet.profit : `-(${Math.abs(bet.profit)})`}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>


                    </div>
                </div>
            )}
            {isPopupOpen && (
                <div className="popup-overlay" onClick={() => setIsPopupOpen(false)}>
                    <div className="popup" onClick={(e) => e.stopPropagation()}>
                        {/* Header */}
                        <div className="popup-header">
                            <h4>Settled Markets P&L</h4>
                            <button className="close-btn" onClick={() => setIsPopupOpen(false)}>×</button>
                        </div>

                        {/* Body */}
                        <div className="popup-body">

                            {/* Filter */}
                            <div className="filter-wrap">
                                <label className='form-label'>Select Market Type</label>
                                <select
                                    value={selectedMarket}
                                    onChange={(e) => setSelectedMarket(e.target.value)}
                                >
                                    <option value="all">Select Market Type</option>
                                    <option value="betfair">BetFair</option>
                                    <option value="bookmaker">Bookmaker</option>
                                    <option value="fancy">Fancy</option>
                                    <option value="sportbook">SportBook</option>
                                    <option value="wifibook">Wifi Bookmaker</option>
                                </select>
                            </div>

                            {/* Table */}
                            <div className="table-wrap">
                                <table className='table'>
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
                                        {filteredBets.map((bet) => (
                                            <tr key={bet.betId} className={bet.isWin ? 'win-row' : 'loss-row'}>
                                                <td>{bet.plId}</td>
                                                <td>{bet.betId}</td>
                                                <td>{bet.placed}</td>
                                                <td>{bet.ip}</td>
                                                <td>
                                                    {bet.market}
                                                    <span className="arrow">▸</span>
                                                    <strong>{bet.selection}</strong>
                                                    <span className="arrow">▸</span>
                                                    {bet.subMarket}
                                                </td>
                                                <td>{bet.type === 'Yes' ? `${bet.oddsReq}/100` : `${bet.oddsReq}/100`}</td>
                                                <td>{bet.type}</td>
                                                <td>{bet.oddsReq}</td>
                                                <td>{bet.stake}</td>
                                                <td>{bet.liability}</td>
                                                <td className={bet.isWin ? 'profit text-success' : 'loss text-danger'}>
                                                    {bet.isWin ? bet.profit : `-(${Math.abs(bet.profit)})`}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="popup-footer">
                            <span>Showing 1 - {filteredBets.length} of {filteredBets.length} entries</span>
                            <div className="pagination">
                                <button disabled>&lt;</button>
                                <button className="active">1</button>
                                <button disabled>&gt;</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </>
    )
}

export default Sportanalysis
