import React, { useState, useEffect } from "react";
import axios from "axios";

function BookmakerSection() {
    const [bookmakerList, setBookmakerList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [placebet, setPlacebet] = useState(false);
    const [selectedOdds, setSelectedOdds] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [stake, setStake] = useState(0);
    const [isSuspended, setIsSuspended] = useState(false);

    const quickStakes = [100, 200, 500, 1000, 2000, 5000];

    const getBookmakerList = async () => {
        const event_id = localStorage.getItem("event_id") || 34876538;
        try {
            setLoading(true);
            const response = await axios.get(
                `https://apileo.leobook.in/get-book-maker-list?id=34876538`
            );

            // FIX: parse if data is string
            let data = response.data;
            if (typeof data === "string") {
                try {
                    data = JSON.parse(data);
                } catch (err) {
                    console.error("Error parsing bookmaker JSON:", err);
                    data = [];
                }
            }

            if (Array.isArray(data)) {
                setBookmakerList(data);
            } else {
                console.warn("Bookmaker response is not an array:", data);
                setBookmakerList([]);
            }
        } catch (error) {
            console.error("Error fetching bookmaker list:", error);
            setBookmakerList([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getBookmakerList();
    }, []);

    const handleQuickStake = (amount) => setStake(amount);
    const increaseStake = () => setStake(stake + 100);
    const decreaseStake = () => setStake(stake > 0 ? stake - 100 : 0);
    const closeBetSlip = () => {
        setPlacebet(false);
        setSelectedOdds(null);
        setSelectedRow(null);
    };

    const handleSelectOdds = (market, type, value) => {
        setSelectedOdds({ eventName: market.nat, oddType: market.gtype, type, value });
        setPlacebet(true);
        setSelectedRow(market.sid);
    };

    if (loading) return <p>Loading bookmakers...</p>;

    return (
        <>
            {bookmakerList.map((market) => (
                <React.Fragment key={market.sid} >
                    <tr className="game_status_new" >
                        <td className="team-name team-width bookmakerNameRunner" >
                            <div className="eventname_design" >
                                <a className="match-name" >
                                    <span>{market.nat} </span>
                                </a>
                            </div>
                        </td>

                        {/* Back Side */}
                        < td >
                            <dl className="back-gradient" >
                                <dd className="count" >
                                    <a
                                        className="back text-center text-decoration-none"
                                        onClick={() => handleSelectOdds(market, "back", market.b1)}
                                    >
                                        <span className="match-inn-txt-top d-block" > {market.b1} </span>
                                        < span className="amount" > {market.bs1} </span>
                                    </a>
                                </dd>
                                < dd className="count" >
                                    <a className="back text-center text-decoration-none" >
                                        <span className="match-inn-txt-top d-block" > {market.b2} </span>
                                        < span className="amount" > {market.bs2} </span>
                                    </a>
                                </dd>
                                < dd className="count" >
                                    <a className="back text-center text-decoration-none" >
                                        <span className="match-inn-txt-top d-block" > {market.b3} </span>
                                        < span className="amount" > {market.bs3} </span>
                                    </a>
                                </dd>
                            </dl>
                        </td>

                        {/* Lay Side */}
                        <td colSpan={3}>
                            <dl className="lay-gradient" >
                                <dd className="count" >
                                    <a
                                        className="lay text-center text-decoration-none"
                                        onClick={() => handleSelectOdds(market, "lay", market.l1)
                                        }
                                    >
                                        <span className="match-inn-txt-top d-block" > {market.l1} </span>
                                        < span className="amount" > {market.ls1} </span>
                                    </a>
                                </dd>
                                < dd className="count" >
                                    <a className="lay text-center text-decoration-none" >
                                        <span className="match-inn-txt-top d-block" > {market.l2} </span>
                                        < span className="amount" > {market.ls2} </span>
                                    </a>
                                </dd>
                                < dd className="count" >
                                    <a className="lay text-center text-decoration-none" >
                                        <span className="match-inn-txt-top d-block" > {market.l3} </span>
                                        < span className="amount" > {market.ls3} </span>
                                    </a>
                                </dd>
                            </dl>
                        </td>

                        {/* Status */}
                        <div
                            className={
                                `suspend-bookmaker-external ${market.s === "ACTIVE" ? "active" : "suspended"
                                }`
                            }
                        >
                            <span className="stats-text" >
                                {market.s === "ACTIVE" ? "Active" : "Suspended"}
                            </span>
                        </div>
                    </tr>

                    {/* Bet Slip */}
                    {
                        placebet && selectedOdds && selectedRow === market.sid && (
                            <tr>
                                <td colSpan="7" className="custom-td blue-bet-slip-back" >
                                    <div className="fancy-quick-tr placebet" >
                                        <div className="slip-back" >
                                            <div className="container" >
                                                <div className="row" >
                                                    <div className="col-12" >
                                                        <p className="mb-1" >
                                                            {selectedOdds.eventName} - {selectedOdds.oddType}
                                                        </p>
                                                        < p className="mb-1" >
                                                            {selectedOdds.type.toUpperCase()} @{selectedOdds.value}
                                                        </p>
                                                    </div>
                                                </div>

                                                < div className="row ps-2 pe-2 pb-0 padddingZero" >
                                                    <div className="col p-1 pb-0 hideMobile" >
                                                        <button className="btn btn-block btn-cancel" onClick={closeBetSlip} >
                                                            Cancel
                                                        </button>
                                                    </div>

                                                    < div className="col text-right d-flex align-items-center p-1 stacksCol" >
                                                        <button className="stakeactionminus btn betButtonMinus" onClick={decreaseStake} >
                                                            <span className="betButtonPlus_span" > -</span>
                                                        </button>
                                                        < input
                                                            type="number"
                                                            placeholder="0"
                                                            className="stakeinput input-Betslip text-center"
                                                            value={stake}
                                                            onChange={(e) => setStake(Number(e.target.value))
                                                            }
                                                        />
                                                        < button className="stakeactionplus btn betButtonPlus float-end" onClick={increaseStake} >
                                                            <span className="betButtonPlus_span" > +</span>
                                                        </button>
                                                    </div>

                                                    < div className="col p-1 pb-0 hideMobile" >
                                                        <button className="btn btn-send" disabled={stake === 0}>
                                                            Place Bet
                                                        </button>
                                                    </div>
                                                </div>

                                                < div className="row p-2 stackbutton pt-0 pb-0 slip-back-br" >
                                                    {
                                                        quickStakes.map((amount) => (
                                                            <div
                                                                key={amount}
                                                                className="col-3 col-xs-3 col-sm-3 col-md-3 col-lg-auto col-xl-auto p-1"
                                                            >
                                                                <button
                                                                    className="btn btn-block fancy-quick-btn"
                                                                    onClick={() => handleQuickStake(amount)}
                                                                >
                                                                    {amount}
                                                                </button>
                                                            </div>
                                                        ))}
                                                </div>

                                                < div className="row mt-0 p-2 pb-0 pt-0 stackbutton padddingZero hideDesktop" >
                                                    <div className="col-6 p-1 pb-0" >
                                                        <button className="btn btn-block btn-cancel" onClick={closeBetSlip} >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                    < div className="col-6 p-1 pb-0" >
                                                        <button className="btn btn-send" disabled={stake === 0}>
                                                            Place Bet
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )}
                </React.Fragment>
            ))}
        </>
    );
}

export default BookmakerSection;
