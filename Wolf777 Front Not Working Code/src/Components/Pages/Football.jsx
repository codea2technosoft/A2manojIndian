import React, { useState } from 'react'
import { IoMdInformationCircleOutline } from "react-icons/io";

function Football() {
  const [stake, setStake] = useState(0);
  const [placebet, setPlacebet] = useState(false);
  const [selectedOdds, setSelectedOdds] = useState(null);
  const [betType, setBetType] = useState(''); // 'back' or 'lay'
  const [selectedRow, setSelectedRow] = useState(null); // Track which row was clicked
  const [isSuspended, setIsSuspended] = useState(true);
  const [fancybet, setFancybet] = useState('fancybetall');
  const [selectedTab, setSelectedTab] = useState("ALL");

  // Define market data structure
  const [markets, setMarkets] = useState([
    {
      id: 'row1',
      name: 'Ball By Ball',
      status: 'In-Play',
      odds: [
        { type: '1', back: 2.18, lay: 2.20 },
        { type: 'X', back: 7.92, lay: 8.00 },
        { type: '2', back: 2.62, lay: 2.64 }
      ]
    },
    {
      id: 'row2',
      name: 'Match Odds',
      status: 'In-Play',
      odds: [
        { type: '1', back: 1.85, lay: 1.87 },
        { type: 'X', back: 3.75, lay: 3.80 },
        { type: '2', back: 4.20, lay: 4.25 }
      ]
    }
  ]);

  // Fancy markets data
  const [Marketsall] = useState([
    { id: 1, title: "Highest Run Scorer In Hundred", noOdds: 345, yesOdds: 365, minMax: "100 - 10000" },
    { id: 2, title: "Highest Wicket Taker Of Hundred", noOdds: 14, yesOdds: 16, minMax: "100 - 10000" },
    { id: 3, title: "Total 4's In Hundred", noOdds: 853, yesOdds: 863, minMax: "100 - 10000" },
    { id: 4, title: "Total 6's In Hundred", noOdds: 375, yesOdds: 380, minMax: "100 - 10000" },
    { id: 5, title: "Total Boundaries In Hundred", noOdds: 1225, yesOdds: 1235, minMax: "100 - 10000" },
    { id: 6, title: "Total 30's In Hundred", noOdds: 72, yesOdds: 74, minMax: "100 - 10000" },
    { id: 7, title: "Total 50's In Hundred", noOdds: 38, yesOdds: 40, minMax: "100 - 10000" },
    { id: 8, title: "Total Wickets In Hundred", noOdds: 401, yesOdds: 408, minMax: "100 - 10000" },
    { id: 9, title: "Total Wides In Hundred", noOdds: 322, yesOdds: 328, minMax: "100 - 10000" },
    { id: 10, title: "Total Extras In Hundred", noOdds: 540, yesOdds: 550, minMax: "100 - 10000" },
  ]);

  // Quick stake amounts
  const quickStakes = [10, 20, 50, 100, 200, 500, 1000, 1500, 2000];
  const fancyQuickStakes = [10, 20, 50, 100, 200, 500, 1000, 1500, 2000];

  const tabs = ['ALL', 'Fancy', 'Line Markets', 'Ball by Ball', 'Meter Markets', 'Khado Markets'];
  const tabsinner = ["ALL", "Fancy", "Line Markets", "Ball by Ball", "Meter Markets", "Khado Markets"];

  // Handle odds click
  const handleOddsClick = (oddsValue, type, market, oddType, rowId) => {
    setSelectedOdds({
      value: oddsValue,
      eventName: market.name,
      type: type,
      marketName: market.name,
      oddType: oddType,
      rowId: rowId
    });
    setBetType(type);
    setPlacebet(true);
    setSelectedRow(rowId);
  }

  // Handle fancy odds click
  const handleFancyOddsClick = (oddsValue, type, market, oppositeOdds) => {
    setSelectedOdds({
      value: oddsValue,
      type: type,
      oppositeOdds: oppositeOdds,
      market: market,
      eventName: market.title,
      marketName: market.title,
      oddType: type === 'back' ? 'No' : 'Yes',
      rowId: market.id
    });
    setBetType(type);
    setPlacebet(true);
    setSelectedRow(market.id);
  }

  // Close bet slip
  const closeBetSlip = () => {
    setPlacebet(false);
    setSelectedOdds(null);
    setBetType('');
    setStake(0);
    setSelectedRow(null);
  }

  // Increase stake
  const increaseStake = () => {
    setStake(prev => prev + 10);
  };

  // Decrease stake
  const decreaseStake = () => {
    setStake(prev => (prev > 0 ? prev - 10 : 0));
  };

  // Handle quick stake
  const handleQuickStake = (amount) => {
    setStake(amount);
  }

  // Format numbers with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const fancybetshow = (tabsvalue) => {
    setFancybet(tabsvalue);
  }

  const handleTabClick = (tabName) => {
    setSelectedTab(tabName);
  };
  const [open, setOpen] = useState(false);

  return (
    <section className='cricket_design'>
      <div className='winner_bet'>
        <div className="card-matchodds outer-divs">
          <strong className="match-odds outer-div1">
            Winner sdfsd
            <span onClick={() => setOpen(true)} className="marketinfo ml-2" data-bs-toggle="modal" data-bs-target="#exampleModal1">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15">
                <path fill="currentColor" fillRule="evenodd" d="M6.76 5.246V3.732h1.48v1.514H6.76zm.74 8.276a5.86 5.86 0 0 0 3.029-.83 5.839 5.839 0 0 0 2.163-2.163 5.86 5.86 0 0 0 .83-3.029 5.86 5.86 0 0 0-.83-3.029 5.839 5.839 0 0 0-2.163-2.163 5.86 5.86 0 0 0-3.029-.83 5.86 5.86 0 0 0-3.029.83A5.839 5.839 0 0 0 2.308 4.47a5.86 5.86 0 0 0-.83 3.029 5.86 5.86 0 0 0 .83 3.029 5.839 5.839 0 0 0 2.163 2.163 5.86 5.86 0 0 0 3.029.83zM7.5 0c1.37 0 2.638.343 3.804 1.028a7.108 7.108 0 0 1 2.668 2.668A7.376 7.376 0 0 1 15 7.5c0 1.37-.343 2.638-1.028 3.804a7.108 7.108 0 0 1-2.668 2.668A7.376 7.376 0 0 1 7.5 15a7.376 7.376 0 0 1-3.804-1.028 7.243 7.243 0 0 1-2.668-2.686A7.343 7.343 0 0 1 0 7.5c0-1.358.343-2.62 1.028-3.786a7.381 7.381 0 0 1 2.686-2.686A7.343 7.343 0 0 1 7.5 0zm-.74 11.268V6.761h1.48v4.507H6.76z"></path>
              </svg>
            </span>
          </strong>

          <div className="cashout-container outer-div2">
          </div>

          <span className="matched-count pull-right outer-div4">
            Matched <strong>€ 89.3K</strong>
          </span>
        </div>
        <table className='table text-start mb-0' >
          <thead>
            <tr>
              <th colSpan={3}></th>
              <th>
                <div className="back backlay">Back</div>
              </th>
              <th>
                <div className="lay backlay">Lay</div>
              </th>
              <th colSpan={2}> <dl id="minMaxBox" className="fancy-info matchoddsminmax">
                <dt>Min/Max</dt>
                <dd id="minMaxInfo">1-0</dd>
              </dl>
              </th>
            </tr>

          </thead>
          <tbody className='position-relative'>
            {markets.map((market) => (
              <React.Fragment key={market.id}>
                {/* Market Row */}
                <tr className='game_status_new'>
                  <td className="td-event-name">
                    <div className='eventname_design'>
                      <a className="match-name">
                        <span>{market.name}</span>
                      </a>
                      <span className="in_play">{market.status}</span>
                    </div>
                  </td>

                  {market.odds.map((odd, index) => (
                    <td
                      key={index}
                      className={index === 0 ? "count" : index === 1 ? "count custom-width-center" : "count custom-width-end"}
                    >
                      <span
                        className={`back bettinggrid ${'back-' + index}`}
                        onClick={() => handleOddsClick(odd.back, 'back', market, odd.type, market.id)}
                      >
                        <span className='backvalue'>{odd.back}</span>
                        <small>{odd.back}</small>
                      </span>
                    </td>
                  ))}
                  {market.odds.map((odd, index) => (
                    <td
                      key={index}
                      className={index === 0 ? "count" : index === 1 ? "count custom-width-center" : "count custom-width-end"}
                    >
                      <span
                        className={`lay bettinggrid ${'lay-' + index} `}
                        onClick={() => handleOddsClick(odd.lay, 'lay', market, odd.type, market.id)}
                      >
                        <span className='backvalue'>{odd.lay}</span>
                        <small>{odd.back}</small>
                      </span>
                    </td>
                  ))}

                  <div
                    className={`suspend-bookmaker-external ${isSuspended ? "suspended" : "active"
                      }`}
                  >
                    <span className="stats-text">
                      {isSuspended ? "Suspended" : "Active"}
                    </span>
                  </div>
                </tr>
                {/* Bet Slip for this row */}
                {placebet && selectedOdds && selectedRow === market.id && (
                  <tr>
                    <td colSpan="7" className="custom-td blue-bet-slip-back">
                      <div className="fancy-quick-tr placebet">
                        <div className="slip-back">
                          <div className="container">
                            {/* Selected odds info */}
                            <div className="row">
                              <div className="col-12">
                                <p className="mb-1">{selectedOdds.eventName} - {selectedOdds.oddType}</p>
                                <p className="mb-1">{selectedOdds.type.toUpperCase()} @ {selectedOdds.value}</p>
                              </div>
                            </div>

                            {/* Cancel + Input Row */}
                            <div className="row ps-2 pe-2 pb-0 padddingZero">
                              <div className="col p-1 pb-0 hideMobile">
                                <button className="btn btn-block btn-cancel" onClick={closeBetSlip}>Cancel</button>
                              </div>

                              <div className="col text-right d-flex align-items-center p-1 stacksCol">
                                <button className="stakeactionminus btn betButtonMinus" onClick={decreaseStake}>
                                  <span className="betButtonPlus_span">-</span>
                                </button>
                                <input
                                  type="number"
                                  placeholder="0"
                                  className="stakeinput input-Betslip text-center"
                                  value={stake}
                                  onChange={(e) => setStake(Number(e.target.value))}
                                />
                                <button className="stakeactionplus btn betButtonPlus float-end" onClick={increaseStake}>
                                  <span className="betButtonPlus_span">+</span>
                                </button>
                              </div>

                              <div className="col p-1 pb-0 hideMobile">
                                <button className="btn btn-send" disabled={stake === 0}>
                                  Place Bet
                                </button>
                              </div>
                            </div>

                            {/* Quick Amount Buttons */}
                            <div className="row p-2 stackbutton pt-0 pb-0 slip-back-br">
                              {quickStakes.map((amount) => (
                                <div key={amount} className="col-3 col-xs-3 col-sm-3 col-md-3 col-lg-auto col-xl-auto p-1">
                                  <button
                                    className="btn btn-block fancy-quick-btn"
                                    onClick={() => handleQuickStake(amount)}
                                  >
                                    {amount}
                                  </button>
                                </div>
                              ))}
                            </div>

                            {/* Mobile Cancel + Place Bet */}
                            <div className="row mt-0 p-2 pb-0 pt-0 stackbutton padddingZero hideDesktop">
                              <div className="col-6 p-1 pb-0">
                                <button className="btn btn-block btn-cancel" onClick={closeBetSlip}>Cancel</button>
                              </div>
                              <div className="col-6 p-1 pb-0">
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
          </tbody>
        </table>
      </div>
      
      <div className='bookmaker mt-2'>
        <div className="card-matchodds outer-divs">
          <strong className="match-odds outer-div1">
            Bookmaker
            <span onClick={() => setOpen(true)} className="marketinfo ml-2" data-bs-toggle="modal" data-bs-target="#exampleModal1">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15">
                <path fill="currentColor" fillRule="evenodd" d="M6.76 5.246V3.732h1.48v1.514H6.76zm.74 8.276a5.86 5.86 0 0 0 3.029-.83 5.839 5.839 0 0 0 2.163-2.163 5.86 5.86 0 0 0 .83-3.029 5.86 5.86 0 0 0-.83-3.029 5.839 5.839 0 0 0-2.163-2.163 5.86 5.86 0 0 0-3.029-.83 5.86 5.86 0 0 0-3.029.83A5.839 5.839 0 0 0 2.308 4.47a5.86 5.86 0 0 0-.83 3.029 5.86 5.86 0 0 0 .83 3.029 5.839 5.839 0 0 0 2.163 2.163 5.86 5.86 0 0 0 3.029.83zM7.5 0c1.37 0 2.638.343 3.804 1.028a7.108 7.108 0 0 1 2.668 2.668A7.376 7.376 0 0 1 15 7.5c0 1.37-.343 2.638-1.028 3.804a7.108 7.108 0 0 1-2.668 2.668A7.376 7.376 0 0 1 7.5 15a7.376 7.376 0 0 1-3.804-1.028 7.243 7.243 0 0 1-2.668-2.686A7.343 7.343 0 0 1 0 7.5c0-1.358.343-2.62 1.028-3.786a7.381 7.381 0 0 1 2.686-2.686A7.343 7.343 0 0 1 7.5 0zm-.74 11.268V6.761h1.48v4.507H6.76z"></path>
              </svg>
            </span>
          </strong>

          <div className="cashout-container outer-div2">
          </div>

          <span className="matched-count pull-right outer-div4">
            Matched <strong>€ 89.3K</strong>
          </span>
        </div>
        <table className='table text-start mb-0' >
          <thead>
            <tr>
              <th></th>
              <th colSpan={2}>
                <div className="back  gradientcolorback">Back</div>
              </th>
              <th colSpan={2} className='position-relative'>
                <div className="lay gradientcolorlay">Lay</div>
                <dl id="minMaxBox" className="fancy-info matchoddsminmax bookmakerminmax">
                  <dt>Min/Max</dt>
                  <dd id="minMaxInfo">1-0</dd>
                </dl>
              </th>

            </tr>

          </thead>
          <tbody className='position-relative'>
            {markets.map((market) => (
              <React.Fragment key={market.id}>
                {/* Market Row */}
                <tr className='game_status_new'>
                  <td className="team-name team-width bookmakerNameRunner">
                    <div className='eventname_design'>
                      <a className="match-name">
                        <span>{market.name}</span>
                      </a>
                    </div>
                  </td>
                  <td>
                    <dl className="back-gradient">
                      <dd className="count">
                        <a className="back text-center text-decoration-none">
                          <span className="match-inn-txt-top d-block">300</span>
                          <span className="amount">1.5M</span>
                        </a>
                      </dd>
                      <dd className="count">
                        <a className="back text-center text-decoration-none">
                          <span className="match-inn-txt-top d-block">300</span>
                          <span className="amount">1M</span>
                        </a>
                      </dd>
                      <dd className="count">
                        <a className="back text-center text-decoration-none">
                          <span className="match-inn-txt-top d-block">300</span>
                          <span className="amount">500K</span>
                        </a>
                      </dd>
                    </dl>
                  </td>
                  <td colSpan={3}>
                    <dl className="lay-gradient">
                      <dd className="count">
                        <a className="back text-center text-decoration-none">
                          <span className="match-inn-txt-top d-block">300</span>
                          <span className="amount">1.5M</span>
                        </a>
                      </dd>
                      <dd className="count">
                        <a className="back text-center text-decoration-none">
                          <span className="match-inn-txt-top d-block">300</span>
                          <span className="amount">1M</span>
                        </a>
                      </dd>
                      <dd className="count">
                        <a className="back text-center text-decoration-none">
                          <span className="match-inn-txt-top d-block">300</span>
                          <span className="amount">500K</span>
                        </a>
                      </dd>
                    </dl>
                  </td>

                  <div
                    className={`suspend-bookmaker-external ${isSuspended ? "suspended" : "active"
                      }`}
                  >
                    <span className="stats-text">
                      {isSuspended ? "Suspended" : "Active"}
                    </span>
                  </div>
                </tr>
                {/* Bet Slip for this row */}
                {placebet && selectedOdds && selectedRow === market.id && (
                  <tr>
                    <td colSpan="7" className="custom-td blue-bet-slip-back">
                      <div className="fancy-quick-tr placebet">
                        <div className="slip-back">
                          <div className="container">
                            {/* Selected odds info */}
                            <div className="row">
                              <div className="col-12">
                                <p className="mb-1">{selectedOdds.eventName} - {selectedOdds.oddType}</p>
                                <p className="mb-1">{selectedOdds.type.toUpperCase()} @ {selectedOdds.value}</p>
                              </div>
                            </div>

                            {/* Cancel + Input Row */}
                            <div className="row ps-2 pe-2 pb-0 padddingZero">
                              <div className="col p-1 pb-0 hideMobile">
                                <button className="btn btn-block btn-cancel" onClick={closeBetSlip}>Cancel</button>
                              </div>

                              <div className="col text-right d-flex align-items-center p-1 stacksCol">
                                <button className="stakeactionminus btn betButtonMinus" onClick={decreaseStake}>
                                  <span className="betButtonPlus_span">-</span>
                                </button>
                                <input
                                  type="number"
                                  placeholder="0"
                                  className="stakeinput input-Betslip text-center"
                                  value={stake}
                                  onChange={(e) => setStake(Number(e.target.value))}
                                />
                                <button className="stakeactionplus btn betButtonPlus float-end" onClick={increaseStake}>
                                  <span className="betButtonPlus_span">+</span>
                                </button>
                              </div>

                              <div className="col p-1 pb-0 hideMobile">
                                <button className="btn btn-send" disabled={stake === 0}>
                                  Place Bet
                                </button>
                              </div>
                            </div>

                            {/* Quick Amount Buttons */}
                            <div className="row p-2 stackbutton pt-0 pb-0 slip-back-br">
                              {quickStakes.map((amount) => (
                                <div key={amount} className="col-3 col-xs-3 col-sm-3 col-md-3 col-lg-auto col-xl-auto p-1">
                                  <button
                                    className="btn btn-block fancy-quick-btn"
                                    onClick={() => handleQuickStake(amount)}
                                  >
                                    {amount}
                                  </button>
                                </div>
                              ))}
                            </div>

                            {/* Mobile Cancel + Place Bet */}
                            <div className="row mt-0 p-2 pb-0 pt-0 stackbutton padddingZero hideDesktop">
                              <div className="col-6 p-1 pb-0">
                                <button className="btn btn-block btn-cancel" onClick={closeBetSlip}>Cancel</button>
                              </div>
                              <div className="col-6 p-1 pb-0">
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
          </tbody>
        </table>
      </div>

      <div className="fancybetsportsbook mt-2">
        <div className="tabsfancy">
          <button className={`buttontabefancy fancybetbutton ${fancybet === "fancybetall" ? 'active' : ''}`} onClick={() => fancybetshow("fancybetall")} >Fancybet <span   onClick={() => setOpen(true)}><IoMdInformationCircleOutline /></span></button>
          <button className={`buttontabefancy sportsbookbutton ${fancybet === "sportsbookall" ? 'active' : ''}`} onClick={() => fancybetshow("sportsbookall")}>Sportsbook <span   onClick={() => setOpen(true)}><IoMdInformationCircleOutline /></span></button>
        </div>
        <div className="tabsfancycontent">
          {fancybet === 'fancybetall' && (
            <div className="fancybetcontent">
              <div className="headinggame">
                <ul className="special_bets-tab">
                  {tabsinner.map((tab) => (
                    <li
                      key={tab}
                      className={selectedTab === tab ? "select" : ""}
                      onClick={() => handleTabClick(tab)}
                    >
                      <a>{tab}</a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                {/* Tabs Content */}
                <div className="tab-content-fancy">
                  {selectedTab === "ALL" && (
                    <table className="table text-start mb-0">
                      <thead>
                        <tr>
                          <th colSpan={2}></th>
                          <th>
                            <div className="lay backlay lay_game">No</div>
                          </th>
                          <th>
                            <div className=" back backlay lay_game">Yes</div>
                          </th>
                          <th>Min/Max</th>
                        </tr>
                      </thead>

                      <tbody className="position-relative">
                        {Marketsall.map((market) => (
                          <React.Fragment key={market.id}>
                            {/* Market Row */}
                            <tr className="game_status_new">
                              <td className="td-event-name">
                                <div className="eventname_design">
                                  <a className="match-name">
                                    <span>{market.title}</span>
                                  </a>
                                </div>
                              </td>
                              <td className="gamename_book">
                                <a className="match-name">
                                  Book
                                </a>
                              </td>
                              {/* Lay (Yes Odds) */}
                              <td className="count">
                                <span
                                  className="lay bettinggrid lay-0"
                                  onClick={() =>
                                    handleFancyOddsClick(market.yesOdds, "lay", market, market.noOdds)
                                  }
                                >
                                  <span className="backvalue">{market.yesOdds}</span>
                                  <small>{market.yesOdds}</small>
                                </span>
                              </td>
                              {/* Back (No Odds) */}
                              <td className="count">
                                <span
                                  className="back bettinggrid back-2"
                                  onClick={() =>
                                    handleFancyOddsClick(market.noOdds, "back", market, market.yesOdds)
                                  }
                                >
                                  <span className="backvalue">{market.noOdds}</span>
                                  <small>{market.noOdds}</small>
                                </span>
                              </td>
                              <td className="verticalmiddle">
                                <div className='minmaxmarket'>
                                  {market.minMax}
                                </div>
                              </td>
                            </tr>
                            {/* Bet Slip Row */}
                            {placebet && selectedOdds && selectedRow === market.id && (
                              <tr>
                                <td colSpan="5" className="custom-td blue-bet-slip-back">
                                  <div className="fancy-quick-tr placebet">
                                    <div className="slip-back">
                                      <div className="container">
                                        {/* Selected odds info */}
                                        <div className="row">
                                          <div className="col-12">
                                            <p className="mb-1">{selectedOdds.eventName}</p>
                                            <p className="mb-1">{selectedOdds.type.toUpperCase()} @ {selectedOdds.value}</p>
                                          </div>
                                        </div>

                                        <div className="row ps-2 pe-2 pb-0 padddingZero">
                                          <div className="col p-1 pb-0 hideMobile">
                                            <button className="btn btn-block btn-cancel" onClick={closeBetSlip}>
                                              Cancel
                                            </button>
                                          </div>
                                          
                                          <div className="col text-right d-flex align-items-center p-1 stacksCol">
                                            <button className="stakeactionminus btn betButtonMinus" onClick={decreaseStake}>
                                              <span className="betButtonPlus_span">-</span>
                                            </button>
                                            <input
                                              type="text"
                                              placeholder="0"
                                              className="stakeinput input-Betslip text-center"
                                              value={`${selectedOdds.value}/${selectedOdds.oppositeOdds}`}
                                              readOnly
                                            />
                                            <button className="stakeactionplus btn betButtonPlus float-end" onClick={increaseStake}>
                                              <span className="betButtonPlus_span">+</span>
                                            </button>
                                          </div>

                                          <div className="col text-right d-flex align-items-center p-1 stacksCol">
                                            <button className="stakeactionminus btn betButtonMinus" onClick={decreaseStake}>
                                              <span className="betButtonPlus_span">-</span>
                                            </button>
                                            <input
                                              type="number"
                                              placeholder="0"
                                              className="stakeinput input-Betslip text-center"
                                              value={stake}
                                              onChange={(e) => setStake(Number(e.target.value))}
                                            />
                                            <button className="stakeactionplus btn betButtonPlus float-end" onClick={increaseStake}>
                                              <span className="betButtonPlus_span">+</span>
                                            </button>
                                          </div>

                                          <div className="col p-1 pb-0 hideMobile">
                                            <button className="btn btn-send" disabled={stake === 0}>
                                              Place Bet
                                            </button>
                                          </div>
                                        </div>

                                        {/* Quick Amount Buttons */}
                                        <div className="row p-2 stackbutton pt-0 pb-0 slip-back-br">
                                          {fancyQuickStakes.map((amount) => (
                                            <div key={amount} className="col p-1">
                                              <button
                                                className="btn btn-block fancy-quick-btn"
                                                onClick={() => handleQuickStake(amount)}
                                              >
                                                {amount}
                                              </button>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  )}
                  {selectedTab === "Fancy" && <div>Fancy bets content...</div>}
                  {selectedTab === "Line Markets" && <div>Line Markets content...</div>}
                  {selectedTab === "Ball by Ball" && <div>Ball by Ball content...</div>}
                  {selectedTab === "Meter Markets" && <div>Meter Markets content...</div>}
                  {selectedTab === "Khado Markets" && <div>Khado Markets content...</div>}
                </div>
              </div>
            </div>
          )}
          {fancybet === 'sportsbookall' && (
            <div className="sportsbookcontent">sdfsdff</div>
          )}
        </div>
      </div>


{open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()} // prevent close when clicking inside
          >
            <button className="modal-close" onClick={() => setOpen(false)}>
              ✕
            </button>

            <div className="info_betting text-start">
              <p>
                1.&nbsp;Cricket General :- ➢ If a ball is not bowled during a
                competition, series or match then all bets will be void except
                for those on any market that has been unconditionally determined
                (e.g. in the 'Completed Match' market).
              </p>
              <p>
                2.&nbsp;Cricket General :- If a match is shortened by weather,
                all bets will be settled according to the official result
                (including for limited overs matches, the result determined by
                the Duckworth Lewis method).
              </p>
              <p>
                3.&nbsp;Cricket General :- In the event of a match being decided
                by a bowl-off or toss of the coin, all bets will be void except
                for those on markets that have been unconditionally determined.
              </p>
              <p>
                4.&nbsp;Cricket Test matches :- If a match starts but is later
                abandoned for any reason other than weather (which may include
                but is not limited to: dangerous or unplayable wicket or
                outfield; pitch vandalism; strike or boycott; crowd
                protests/violence; stadium damage; acts of terrorism; and acts
                of God), Betfair reserves the right to void all bets, except for
                those on markets that have been unconditionally determined.
              </p>
              <p>
                5. In case anyone is found using 2 different IDs and logging in
                from same IP his winning in both accounts will be cancelled.
              </p>
              <p>
                6.&nbsp;Cricket Test matches :- If the match is not scheduled to
                be completed within five days after the original scheduled
                completion date, then all bets on markets for this event will be
                void, except for bets on any markets that have been
                unconditionally determined.
              </p>
              <p>
                7.&nbsp;Cricket Limited Over matches :- If a match is declared,
                bets will be void on all markets for the event except for those
                markets which have been unconditionally determined or where the
                minimum number of overs have been bowled as laid out in the
                market specific information.
              </p>
              <p>
                8.&nbsp;Cricket Limited Over matches :- In the event of a new
                toss taking place on a scheduled reserve day for a limited overs
                match all bets that were placed after 30 minutes before the
                original scheduled start of play on the first day will be made
                void. This rule relates to all markets except those that have
                been unconditionally determined (e.g. in the win the toss and
                toss combination markets).
              </p>
              <p>
                9.&nbsp;Multiple Bets :- Multiple Bets With Same Time And Same
                User Will Be Voided Immediately.
              </p>
            </div>
          </div>
        </div>
      )}

    </section>
  )
}

export default Football