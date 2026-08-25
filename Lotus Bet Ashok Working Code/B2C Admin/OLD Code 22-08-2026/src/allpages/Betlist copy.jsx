import React from 'react'

import {
  getAllBetList,
} from "../Server/api";


function Betlist() {
  return (
    <div className='allcommon'>
      <section className="find-member-sec py-3">
  <div className="container-fluid">
    <h4 className="page-title">Bet List </h4>
    <div className="inner-wrapper">
      <div className="common-container">
        <form className="bet_status p-0 bet-list-live d-flex flex-column w-100 align-items-start">
          <div className="bet_outer betlist-n w-100">
            <div className="bet-sec">
              <label className="form-label">Select Sport:</label>
              <select
                aria-label="Default select example"
                className="small_select form-select"
              >
                <option value={4}>Cricket</option>
                <option value={2}>Tennis</option>
                <option value={1}>Soccer</option>
                <option value={3}>Casino</option>
                <option value={4339}>Greyhound</option>
                <option value={7}>Horse</option>
              </select>
            </div>
            <div className="bet-sec">
              <label className="form-label">Select Market Type:</label>
              <select
                aria-label="Default select example"
                className="small_select form-select"
              >
                <option value="betfair">Bet Fair</option>
                <option value="bookmaker">Bookmaker</option>
                <option value="fancy">Fancy</option>
                <option value="toss">Toss</option>
                <option value="lottery">Lottery</option>
              </select>
            </div>
            <div className="bet-sec">
              <label className="form-label">Bet Status:</label>
              <select
                aria-label="Default select example"
                className="small_select form-select"
              >
                {" "}
                <option value="unmatched">Unmatched</option>
                <option value="matched">Matched</option>
                <option value="completed">Settled</option>
                <option value="suspend">Cancelled</option>
                <option value="voided">Voided</option>
              </select>
            </div>
            <div className="bet-sec bet-period">
              <label className="form-label">From</label>
              <input
                max="2026-07-03"
                type="date"
                className="form-control"
                defaultValue="2026-07-02"
              />
            </div>
            <div className="bet-sec bet-period">
              <label className="form-label">To</label>
              <input
                min="2026-07-02"
                max="2026-07-03"
                type="date"
                className="form-control"
                defaultValue="2026-07-03"
              />
            </div>
          </div>{" "}
          <div className="history-btn ">
            <ul className="list-unstyled mb-0">
              <li>
                <button
                  type="button"
                  className="theme_dark_btn btn btn-primary"
                >
                  Search
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="theme_light_btn btn btn-primary"
                >
                  Reset
                </button>
              </li>
            </ul>
          </div>
        </form>
        <div className="responsive">
          <table className="all-bets-dialog-tabel table">
            <thead>
              <tr>
                <th scope="col">PL ID</th>
                <th scope="col"> Bet ID</th>
                <th scope="col">Bet placed</th>
                <th scope="col">IP Address </th>
                <th scope="col">Market</th>
                <th scope="col">Selection</th>
                <th scope="col">Type</th>
                <th scope="col">Odds req.</th>
                <th scope="col">Stake </th>
                <th scope="col">Liability</th>
                <th scope="col"> Profit/Loss</th>
              </tr>
            </thead>
            <tbody>
              <tr bgcolor="#FAA9BA">
                <td>charv123</td>
                <td> mr4x3naf</td>
                <td> 7/3/2026, 6:06:35 PM</td>
                <td> 157.45.219.63</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Gulbarga Mystics v Mysore Warriors
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>Mysore Warriors</td>
                <td> lay </td>
                <td> 1.05 </td>
                <td> 1000 </td>
                <td> 50 </td>
                <td className="text-end">
                  <span
                    className="text-danger"
                    style={{ background: "transparent" }}
                  >
                    -(50)
                  </span>
                </td>
              </tr>
              <tr bgcolor="#FAA9BA">
                <td>charv123</td>
                <td> mr4x3fdn</td>
                <td> 7/3/2026, 6:06:25 PM</td>
                <td> 157.45.219.63</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Gulbarga Mystics v Mysore Warriors
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>Mysore Warriors</td>
                <td> lay </td>
                <td> 1.05 </td>
                <td> 1000 </td>
                <td> 50 </td>
                <td className="text-end">
                  <span
                    className="text-danger"
                    style={{ background: "transparent" }}
                  >
                    -(50)
                  </span>
                </td>
              </tr>
              <tr bgcolor="#FAA9BA">
                <td>charv123</td>
                <td> mr4x34p5</td>
                <td> 7/3/2026, 6:06:11 PM</td>
                <td> 157.45.219.63</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Gulbarga Mystics v Mysore Warriors
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>Mysore Warriors</td>
                <td> lay </td>
                <td> 1.06 </td>
                <td> 1000 </td>
                <td> 60 </td>
                <td className="text-end">
                  <span
                    className="text-danger"
                    style={{ background: "transparent" }}
                  >
                    -(60)
                  </span>
                </td>
              </tr>
              <tr bgcolor="#FAA9BA">
                <td>charv123</td>
                <td> mr4x2q9k</td>
                <td> 7/3/2026, 6:05:52 PM</td>
                <td> 157.45.219.63</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Gulbarga Mystics v Mysore Warriors
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>Mysore Warriors</td>
                <td> lay </td>
                <td> 1.08 </td>
                <td> 1000 </td>
                <td> 80 </td>
                <td className="text-end">
                  <span
                    className="text-danger"
                    style={{ background: "transparent" }}
                  >
                    -(80)
                  </span>
                </td>
              </tr>
              <tr bgcolor="#72BBEF">
                <td>shivu777</td>
                <td> mr4wu080</td>
                <td> 7/3/2026, 5:59:05 PM</td>
                <td> 223.186.57.165</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Gulbarga Mystics v Mysore Warriors
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>Gulbarga Mystics</td>
                <td> back </td>
                <td> 9.2 </td>
                <td> 2000 </td>
                <td> 2000 </td>
                <td className="text-end">
                  <span
                    className="text-danger"
                    style={{ background: "transparent" }}
                  >
                    -(2000)
                  </span>
                </td>
              </tr>
              <tr bgcolor="#FAA9BA">
                <td>zabi</td>
                <td> mr4wplih</td>
                <td> 7/3/2026, 5:55:39 PM</td>
                <td> 152.57.68.144</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Gulbarga Mystics v Mysore Warriors
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>Mysore Warriors</td>
                <td> lay </td>
                <td> 1.25 </td>
                <td> 5000 </td>
                <td> 1250 </td>
                <td className="text-end">
                  <span
                    className="text-danger"
                    style={{ background: "transparent" }}
                  >
                    -(1250)
                  </span>
                </td>
              </tr>
              <tr bgcolor="#72BBEF">
                <td>veeranji</td>
                <td> mr4w5clj</td>
                <td> 7/3/2026, 5:39:55 PM</td>
                <td> 152.57.120.216</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Gulbarga Mystics v Mysore Warriors
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>Gulbarga Mystics</td>
                <td> back </td>
                <td> 3 </td>
                <td> 100 </td>
                <td> 100 </td>
                <td className="text-end">
                  <span
                    className="text-danger"
                    style={{ background: "transparent" }}
                  >
                    -(100)
                  </span>
                </td>
              </tr>
              <tr bgcolor="#72BBEF">
                <td>veeranji</td>
                <td> mr4w56wk</td>
                <td> 7/3/2026, 5:39:47 PM</td>
                <td> 152.57.120.216</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Gulbarga Mystics v Mysore Warriors
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>Gulbarga Mystics</td>
                <td> back </td>
                <td> 2.84 </td>
                <td> 100 </td>
                <td> 100 </td>
                <td className="text-end">
                  <span
                    className="text-danger"
                    style={{ background: "transparent" }}
                  >
                    -(100)
                  </span>
                </td>
              </tr>
              <tr bgcolor="#72BBEF">
                <td>veeranji</td>
                <td> mr4w52kq</td>
                <td> 7/3/2026, 5:39:42 PM</td>
                <td> 152.57.120.216</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Gulbarga Mystics v Mysore Warriors
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>Gulbarga Mystics</td>
                <td> back </td>
                <td> 2.84 </td>
                <td> 100 </td>
                <td> 100 </td>
                <td className="text-end">
                  <span
                    className="text-danger"
                    style={{ background: "transparent" }}
                  >
                    -(100)
                  </span>
                </td>
              </tr>
              <tr bgcolor="#72BBEF">
                <td>veeranji</td>
                <td> mr4w2uh9</td>
                <td> 7/3/2026, 5:37:58 PM</td>
                <td> 152.57.120.216</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Gulbarga Mystics v Mysore Warriors
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>Mysore Warriors</td>
                <td> back </td>
                <td> 2.78 </td>
                <td> 500 </td>
                <td> 500 </td>
                <td className="text-end">
                  <span
                    className="text-success"
                    style={{ background: "transparent" }}
                  >
                    890
                  </span>
                </td>
              </tr>
              <tr bgcolor="#72BBEF">
                <td>madhu11</td>
                <td> mr4vt0g9</td>
                <td> 7/3/2026, 5:30:19 PM</td>
                <td> 152.57.133.200</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Gulbarga Mystics v Mysore Warriors
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>Mysore Warriors</td>
                <td> back </td>
                <td> 2.1 </td>
                <td> 1000 </td>
                <td> 1000 </td>
                <td className="text-end">
                  <span
                    className="text-success"
                    style={{ background: "transparent" }}
                  >
                    1100
                  </span>
                </td>
              </tr>
              <tr bgcolor="#FAA9BA">
                <td>charv123</td>
                <td> mr4vswf9</td>
                <td> 7/3/2026, 5:30:14 PM</td>
                <td> 152.57.0.109</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Gulbarga Mystics v Mysore Warriors
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>Gulbarga Mystics</td>
                <td> lay </td>
                <td> 1.91 </td>
                <td> 100 </td>
                <td> 91 </td>
                <td className="text-end">
                  <span
                    className="text-success"
                    style={{ background: "transparent" }}
                  >
                    100
                  </span>
                </td>
              </tr>
              <tr bgcolor="#FAA9BA">
                <td>charv123</td>
                <td> mr4vsqkt</td>
                <td> 7/3/2026, 5:30:06 PM</td>
                <td> 152.57.0.109</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Gulbarga Mystics v Mysore Warriors
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>Gulbarga Mystics</td>
                <td> lay </td>
                <td> 1.9 </td>
                <td> 200 </td>
                <td> 180 </td>
                <td className="text-end">
                  <span
                    className="text-success"
                    style={{ background: "transparent" }}
                  >
                    200
                  </span>
                </td>
              </tr>
              <tr bgcolor="#72BBEF">
                <td>veeranji</td>
                <td> mr4vrn1l</td>
                <td> 7/3/2026, 5:29:15 PM</td>
                <td> 152.57.120.216</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Gulbarga Mystics v Mysore Warriors
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>Mysore Warriors</td>
                <td> back </td>
                <td> 2.08 </td>
                <td> 500 </td>
                <td> 500 </td>
                <td className="text-end">
                  <span
                    className="text-success"
                    style={{ background: "transparent" }}
                  >
                    540
                  </span>
                </td>
              </tr>
              <tr bgcolor="#FAA9BA">
                <td>veeranji</td>
                <td> mr4vnoas</td>
                <td> 7/3/2026, 5:26:10 PM</td>
                <td> 152.57.120.216</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Gulbarga Mystics v Mysore Warriors
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>Mysore Warriors</td>
                <td> lay </td>
                <td> 1.4 </td>
                <td> 200 </td>
                <td> 80 </td>
                <td className="text-end">
                  <span
                    className="text-danger"
                    style={{ background: "transparent" }}
                  >
                    -(80)
                  </span>
                </td>
              </tr>
              <tr bgcolor="#72BBEF">
                <td>veeranji</td>
                <td> mr4vmbf5</td>
                <td> 7/3/2026, 5:25:07 PM</td>
                <td> 152.57.120.216</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Gulbarga Mystics v Mysore Warriors
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>Gulbarga Mystics</td>
                <td> back </td>
                <td> 3.85 </td>
                <td> 300 </td>
                <td> 300 </td>
                <td className="text-end">
                  <span
                    className="text-danger"
                    style={{ background: "transparent" }}
                  >
                    -(300)
                  </span>
                </td>
              </tr>
              <tr bgcolor="#72BBEF">
                <td>pranavi</td>
                <td> mr4v2zu5</td>
                <td> 7/3/2026, 5:10:05 PM</td>
                <td> 117.215.230.22</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Anurag Nalgonda Knights v Medak Falcons
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>Anurag Nalgonda Knights</td>
                <td> back </td>
                <td> 1.01 </td>
                <td> 10000 </td>
                <td> 10000 </td>
                <td className="text-end">
                  <span
                    className="text-success"
                    style={{ background: "transparent" }}
                  >
                    100
                  </span>
                </td>
              </tr>
              <tr bgcolor="#FAA9BA">
                <td>pranavi</td>
                <td> mr4ubzms</td>
                <td> 7/3/2026, 4:49:05 PM</td>
                <td> 152.57.54.158</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Anurag Nalgonda Knights v Medak Falcons
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>Anurag Nalgonda Knights</td>
                <td> lay </td>
                <td> 1.05 </td>
                <td> 10000 </td>
                <td> 500 </td>
                <td className="text-end">
                  <span
                    className="text-danger"
                    style={{ background: "transparent" }}
                  >
                    -(500)
                  </span>
                </td>
              </tr>
              <tr bgcolor="#FAA9BA">
                <td>zabi</td>
                <td> mr4u1b2y</td>
                <td> 7/3/2026, 4:40:47 PM</td>
                <td> 152.57.65.79</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Gulbarga Mystics v Mysore Warriors
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>Gulbarga Mystics</td>
                <td> lay </td>
                <td> 1.35 </td>
                <td> 5000 </td>
                <td> 1750 </td>
                <td className="text-end">
                  <span
                    className="text-success"
                    style={{ background: "transparent" }}
                  >
                    5000
                  </span>
                </td>
              </tr>
              <tr bgcolor="#FAA9BA">
                <td>charv123</td>
                <td> mr4tzehs</td>
                <td> 7/3/2026, 4:39:18 PM</td>
                <td> 152.57.0.109</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Gulbarga Mystics v Mysore Warriors
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>Gulbarga Mystics</td>
                <td> lay </td>
                <td> 1.6 </td>
                <td> 2000 </td>
                <td> 1200 </td>
                <td className="text-end">
                  <span
                    className="text-success"
                    style={{ background: "transparent" }}
                  >
                    2000
                  </span>
                </td>
              </tr>
              <tr bgcolor="#72BBEF">
                <td>zabi</td>
                <td> mr4t2i4f</td>
                <td> 7/3/2026, 4:13:43 PM</td>
                <td> 152.57.64.31</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Gulbarga Mystics v Mysore Warriors
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>Gulbarga Mystics</td>
                <td> back </td>
                <td> 1.83 </td>
                <td> 10000 </td>
                <td> 10000 </td>
                <td className="text-end">
                  <span
                    className="text-danger"
                    style={{ background: "transparent" }}
                  >
                    -(10000)
                  </span>
                </td>
              </tr>
              <tr bgcolor="#72BBEF">
                <td>revanna</td>
                <td> mr4rbw8h</td>
                <td> 7/3/2026, 3:25:02 PM</td>
                <td> 157.35.9.237</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    India U19 W v Sri Lanka U19 W
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>India U19 W</td>
                <td> back </td>
                <td> 1.1 </td>
                <td> 100 </td>
                <td> 100 </td>
                <td className="text-end">
                  <span
                    className="text-success"
                    style={{ background: "transparent" }}
                  >
                    10
                  </span>
                </td>
              </tr>
              <tr bgcolor="#72BBEF">
                <td>zabi</td>
                <td> mr4qmlti</td>
                <td> 7/3/2026, 3:05:22 PM</td>
                <td> 152.57.70.194</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    India U19 W v Sri Lanka U19 W
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>India U19 W</td>
                <td> back </td>
                <td> 1.46 </td>
                <td> 500 </td>
                <td> 500 </td>
                <td className="text-end">
                  <span
                    className="text-success"
                    style={{ background: "transparent" }}
                  >
                    230
                  </span>
                </td>
              </tr>
              <tr bgcolor="#FAA9BA">
                <td>zabi</td>
                <td> mr4qgbqh</td>
                <td> 7/3/2026, 3:00:29 PM</td>
                <td> 152.57.70.194</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Gulbarga Mystics v Mysore Warriors
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>Gulbarga Mystics</td>
                <td> lay </td>
                <td> 1.68 </td>
                <td> 10000 </td>
                <td> 6800 </td>
                <td className="text-end">
                  <span
                    className="text-success"
                    style={{ background: "transparent" }}
                  >
                    10000
                  </span>
                </td>
              </tr>
              <tr bgcolor="#72BBEF">
                <td>zabi</td>
                <td> mr4pftek</td>
                <td> 7/3/2026, 2:32:06 PM</td>
                <td> 152.57.66.125</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    India U19 W v Sri Lanka U19 W
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>India U19 W</td>
                <td> back </td>
                <td> 1.66 </td>
                <td> 5000 </td>
                <td> 5000 </td>
                <td className="text-end">
                  <span
                    className="text-success"
                    style={{ background: "transparent" }}
                  >
                    3300
                  </span>
                </td>
              </tr>
              <tr bgcolor="#FAA9BA">
                <td>zabi</td>
                <td> mr4p2q6v</td>
                <td> 7/3/2026, 2:21:55 PM</td>
                <td> 152.57.67.252</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    India U19 W v Sri Lanka U19 W
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>India U19 W</td>
                <td> lay </td>
                <td> 1.3 </td>
                <td> 5000 </td>
                <td> 1500 </td>
                <td className="text-end">
                  <span
                    className="text-danger"
                    style={{ background: "transparent" }}
                  >
                    -(1500)
                  </span>
                </td>
              </tr>
              <tr bgcolor="#FAA9BA">
                <td>naveens</td>
                <td> mr4oz0k2</td>
                <td> 7/3/2026, 2:19:02 PM</td>
                <td> 223.186.204.3</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    India U19 W v Sri Lanka U19 W
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>India U19 W</td>
                <td> lay </td>
                <td> 1.47 </td>
                <td> 300 </td>
                <td> 141 </td>
                <td className="text-end">
                  <span
                    className="text-danger"
                    style={{ background: "transparent" }}
                  >
                    -(141)
                  </span>
                </td>
              </tr>
              <tr bgcolor="#72BBEF">
                <td>naveens</td>
                <td> mr4om98x</td>
                <td> 7/3/2026, 2:09:07 PM</td>
                <td> 223.186.204.3</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    India U19 W v Sri Lanka U19 W
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>India U19 W</td>
                <td> back </td>
                <td> 1.33 </td>
                <td> 490 </td>
                <td> 490 </td>
                <td className="text-end">
                  <span
                    className="text-success"
                    style={{ background: "transparent" }}
                  >
                    161.7
                  </span>
                </td>
              </tr>
              <tr bgcolor="#72BBEF">
                <td>revanna</td>
                <td> mr4nuz7g</td>
                <td> 7/3/2026, 1:47:54 PM</td>
                <td> 157.35.15.135</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    India U19 W v Sri Lanka U19 W
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>Sri Lanka U19 W</td>
                <td> back </td>
                <td> 3.25 </td>
                <td> 100 </td>
                <td> 100 </td>
                <td className="text-end">
                  <span
                    className="text-danger"
                    style={{ background: "transparent" }}
                  >
                    -(100)
                  </span>
                </td>
              </tr>
              <tr bgcolor="#FAA9BA">
                <td>naveens</td>
                <td> mr4mlczm</td>
                <td> 7/3/2026, 1:12:26 PM</td>
                <td> 223.186.204.3</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    India U19 W v Sri Lanka U19 W
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>India U19 W</td>
                <td> lay </td>
                <td> 1.4 </td>
                <td> 490 </td>
                <td> 196 </td>
                <td className="text-end">
                  <span
                    className="text-danger"
                    style={{ background: "transparent" }}
                  >
                    -(196)
                  </span>
                </td>
              </tr>
              <tr bgcolor="#FAA9BA">
                <td>govindraaj</td>
                <td> mr4j5sov</td>
                <td> 7/3/2026, 11:36:21 AM</td>
                <td> 106.192.242.250</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Band-E-Amir Dragons v Mis-E-Ainak Knights
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>Mis-E-Ainak Knights</td>
                <td> lay </td>
                <td> 1.06 </td>
                <td> 4000 </td>
                <td> 240 </td>
                <td className="text-end">
                  <span
                    className="text-danger"
                    style={{ background: "transparent" }}
                  >
                    -(240)
                  </span>
                </td>
              </tr>
              <tr bgcolor="#72BBEF">
                <td>veeranji</td>
                <td> mr4isz61</td>
                <td> 7/3/2026, 11:26:22 AM</td>
                <td> 152.57.112.179</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Band-E-Amir Dragons v Mis-E-Ainak Knights
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>Mis-E-Ainak Knights</td>
                <td> back </td>
                <td> 1.09 </td>
                <td> 100 </td>
                <td> 100 </td>
                <td className="text-end">
                  <span
                    className="text-success"
                    style={{ background: "transparent" }}
                  >
                    9
                  </span>
                </td>
              </tr>
              <tr bgcolor="#72BBEF">
                <td>veeranji</td>
                <td> mr4isq15</td>
                <td> 7/3/2026, 11:26:11 AM</td>
                <td> 152.57.112.179</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Band-E-Amir Dragons v Mis-E-Ainak Knights
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>Mis-E-Ainak Knights</td>
                <td> back </td>
                <td> 1.09 </td>
                <td> 2500 </td>
                <td> 2500 </td>
                <td className="text-end">
                  <span
                    className="text-success"
                    style={{ background: "transparent" }}
                  >
                    225
                  </span>
                </td>
              </tr>
              <tr bgcolor="#FAA9BA">
                <td>shaik</td>
                <td> mr4ih6gj</td>
                <td> 7/3/2026, 11:17:12 AM</td>
                <td> 223.231.182.92</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Band-E-Amir Dragons v Mis-E-Ainak Knights
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>Mis-E-Ainak Knights</td>
                <td> lay </td>
                <td> 1.21 </td>
                <td> 20000 </td>
                <td> 4200 </td>
                <td className="text-end">
                  <span
                    className="text-danger"
                    style={{ background: "transparent" }}
                  >
                    -(4200)
                  </span>
                </td>
              </tr>
              <tr bgcolor="#FAA9BA">
                <td>shaik</td>
                <td> mr4ih055</td>
                <td> 7/3/2026, 11:17:04 AM</td>
                <td> 223.231.182.92</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Band-E-Amir Dragons v Mis-E-Ainak Knights
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>Mis-E-Ainak Knights</td>
                <td> lay </td>
                <td> 1.21 </td>
                <td> 5500 </td>
                <td> 1155 </td>
                <td className="text-end">
                  <span
                    className="text-danger"
                    style={{ background: "transparent" }}
                  >
                    -(1155)
                  </span>
                </td>
              </tr>
              <tr bgcolor="#72BBEF">
                <td>shaik</td>
                <td> mr4ifp3s</td>
                <td> 7/3/2026, 11:16:03 AM</td>
                <td> 223.231.182.92</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Band-E-Amir Dragons v Mis-E-Ainak Knights
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>Mis-E-Ainak Knights</td>
                <td> back </td>
                <td> 1.32 </td>
                <td> 20000 </td>
                <td> 20000 </td>
                <td className="text-end">
                  <span
                    className="text-success"
                    style={{ background: "transparent" }}
                  >
                    6400
                  </span>
                </td>
              </tr>
              <tr bgcolor="#FAA9BA">
                <td>shaik</td>
                <td> mr4ib1m9</td>
                <td> 7/3/2026, 11:12:26 AM</td>
                <td> 223.231.182.92</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Band-E-Amir Dragons v Mis-E-Ainak Knights
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>Mis-E-Ainak Knights</td>
                <td> lay </td>
                <td> 1.24 </td>
                <td> 4500 </td>
                <td> 1080 </td>
                <td className="text-end">
                  <span
                    className="text-danger"
                    style={{ background: "transparent" }}
                  >
                    -(1080)
                  </span>
                </td>
              </tr>
              <tr bgcolor="#72BBEF">
                <td>veeranji</td>
                <td> mr4ia8iy</td>
                <td> 7/3/2026, 11:11:48 AM</td>
                <td> 152.57.116.34</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Band-E-Amir Dragons v Mis-E-Ainak Knights
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>Band-E-Amir Dragons</td>
                <td> back </td>
                <td> 5.3 </td>
                <td> 600 </td>
                <td> 600 </td>
                <td className="text-end">
                  <span
                    className="text-danger"
                    style={{ background: "transparent" }}
                  >
                    -(600)
                  </span>
                </td>
              </tr>
              <tr bgcolor="#FAA9BA">
                <td>khalilauto</td>
                <td> mr4i3q7n</td>
                <td> 7/3/2026, 11:06:44 AM</td>
                <td> 157.45.225.215</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Band-E-Amir Dragons v Mis-E-Ainak Knights
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>Mis-E-Ainak Knights</td>
                <td> lay </td>
                <td> 1.24 </td>
                <td> 2000 </td>
                <td> 480 </td>
                <td className="text-end">
                  <span
                    className="text-danger"
                    style={{ background: "transparent" }}
                  >
                    -(480)
                  </span>
                </td>
              </tr>
              <tr bgcolor="#72BBEF">
                <td>shaik</td>
                <td> mr4i12th</td>
                <td> 7/3/2026, 11:04:41 AM</td>
                <td> 223.231.182.92</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Band-E-Amir Dragons v Mis-E-Ainak Knights
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>Mis-E-Ainak Knights</td>
                <td> back </td>
                <td> 1.22 </td>
                <td> 4900 </td>
                <td> 4900 </td>
                <td className="text-end">
                  <span
                    className="text-success"
                    style={{ background: "transparent" }}
                  >
                    1078
                  </span>
                </td>
              </tr>
              <tr bgcolor="#FAA9BA">
                <td>shaik</td>
                <td> mr4htnkh</td>
                <td> 7/3/2026, 10:58:54 AM</td>
                <td> 223.231.182.92</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Band-E-Amir Dragons v Mis-E-Ainak Knights
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>Mis-E-Ainak Knights</td>
                <td> lay </td>
                <td> 1.19 </td>
                <td> 200 </td>
                <td> 38 </td>
                <td className="text-end">
                  <span
                    className="text-danger"
                    style={{ background: "transparent" }}
                  >
                    -(38)
                  </span>
                </td>
              </tr>
              <tr bgcolor="#FAA9BA">
                <td>shaik</td>
                <td> mr4htigx</td>
                <td> 7/3/2026, 10:58:48 AM</td>
                <td> 223.231.182.92</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Band-E-Amir Dragons v Mis-E-Ainak Knights
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>Mis-E-Ainak Knights</td>
                <td> lay </td>
                <td> 1.19 </td>
                <td> 500 </td>
                <td> 95 </td>
                <td className="text-end">
                  <span
                    className="text-danger"
                    style={{ background: "transparent" }}
                  >
                    -(95)
                  </span>
                </td>
              </tr>
              <tr bgcolor="#FAA9BA">
                <td>shaik</td>
                <td> mr4htdfw</td>
                <td> 7/3/2026, 10:58:41 AM</td>
                <td> 223.231.182.92</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Band-E-Amir Dragons v Mis-E-Ainak Knights
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>Mis-E-Ainak Knights</td>
                <td> lay </td>
                <td> 1.19 </td>
                <td> 1000 </td>
                <td> 190 </td>
                <td className="text-end">
                  <span
                    className="text-danger"
                    style={{ background: "transparent" }}
                  >
                    -(190)
                  </span>
                </td>
              </tr>
              <tr bgcolor="#FAA9BA">
                <td>shaik</td>
                <td> mr4ht6sk</td>
                <td> 7/3/2026, 10:58:33 AM</td>
                <td> 223.231.182.92</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Band-E-Amir Dragons v Mis-E-Ainak Knights
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>Mis-E-Ainak Knights</td>
                <td> lay </td>
                <td> 1.19 </td>
                <td> 20000 </td>
                <td> 3800 </td>
                <td className="text-end">
                  <span
                    className="text-danger"
                    style={{ background: "transparent" }}
                  >
                    -(3800)
                  </span>
                </td>
              </tr>
              <tr bgcolor="#72BBEF">
                <td>madhu11</td>
                <td> mr4hmr8i</td>
                <td> 7/3/2026, 10:53:33 AM</td>
                <td> 152.57.136.172</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Band-E-Amir Dragons v Mis-E-Ainak Knights
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>Band-E-Amir Dragons</td>
                <td> back </td>
                <td> 6 </td>
                <td> 1000 </td>
                <td> 1000 </td>
                <td className="text-end">
                  <span
                    className="text-danger"
                    style={{ background: "transparent" }}
                  >
                    -(1000)
                  </span>
                </td>
              </tr>
              <tr bgcolor="#FAA9BA">
                <td>bittu1992</td>
                <td> mr4hlyok</td>
                <td> 7/3/2026, 10:52:56 AM</td>
                <td> 49.34.170.218</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Band-E-Amir Dragons v Mis-E-Ainak Knights
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>Mis-E-Ainak Knights</td>
                <td> lay </td>
                <td> 1.2 </td>
                <td> 1000 </td>
                <td> 200 </td>
                <td className="text-end">
                  <span
                    className="text-danger"
                    style={{ background: "transparent" }}
                  >
                    -(200)
                  </span>
                </td>
              </tr>
              <tr bgcolor="#72BBEF">
                <td>raghukagi</td>
                <td> mr4h2uh0</td>
                <td> 7/3/2026, 10:38:04 AM</td>
                <td> 117.221.27.144</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Seattle Orcas v MI New York
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>MI New York</td>
                <td> back </td>
                <td> 1.18 </td>
                <td> 2000 </td>
                <td> 2000 </td>
                <td className="text-end">
                  <span
                    className="text-success"
                    style={{ background: "transparent" }}
                  >
                    360
                  </span>
                </td>
              </tr>
              <tr bgcolor="#FAA9BA">
                <td>zabi</td>
                <td> mr4h2sw1</td>
                <td> 7/3/2026, 10:38:02 AM</td>
                <td> 152.57.66.3</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Band-E-Amir Dragons v Mis-E-Ainak Knights
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>Mis-E-Ainak Knights</td>
                <td> lay </td>
                <td> 1.38 </td>
                <td> 10000 </td>
                <td> 3800 </td>
                <td className="text-end">
                  <span
                    className="text-danger"
                    style={{ background: "transparent" }}
                  >
                    -(3800)
                  </span>
                </td>
              </tr>
              <tr bgcolor="#72BBEF">
                <td>shaik</td>
                <td> mr4h1khf</td>
                <td> 7/3/2026, 10:37:04 AM</td>
                <td> 223.231.182.92</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Seattle Orcas v MI New York
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>MI New York</td>
                <td> back </td>
                <td> 1.3 </td>
                <td> 600 </td>
                <td> 600 </td>
                <td className="text-end">
                  <span
                    className="text-success"
                    style={{ background: "transparent" }}
                  >
                    180
                  </span>
                </td>
              </tr>
              <tr bgcolor="#72BBEF">
                <td>shaik</td>
                <td> mr4h0f5t</td>
                <td> 7/3/2026, 10:36:11 AM</td>
                <td> 223.231.182.92</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Seattle Orcas v MI New York
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>MI New York</td>
                <td> back </td>
                <td> 1.3 </td>
                <td> 600 </td>
                <td> 600 </td>
                <td className="text-end">
                  <span
                    className="text-success"
                    style={{ background: "transparent" }}
                  >
                    180
                  </span>
                </td>
              </tr>
              <tr bgcolor="#72BBEF">
                <td>shaik</td>
                <td> mr4h05jh</td>
                <td> 7/3/2026, 10:35:58 AM</td>
                <td> 223.231.182.92</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Seattle Orcas v MI New York
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>MI New York</td>
                <td> back </td>
                <td> 1.33 </td>
                <td> 5000 </td>
                <td> 5000 </td>
                <td className="text-end">
                  <span
                    className="text-success"
                    style={{ background: "transparent" }}
                  >
                    1650
                  </span>
                </td>
              </tr>
              <tr bgcolor="#72BBEF">
                <td>shaik</td>
                <td> mr4gzw3s</td>
                <td> 7/3/2026, 10:35:46 AM</td>
                <td> 223.231.182.92</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Seattle Orcas v MI New York
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>MI New York</td>
                <td> back </td>
                <td> 1.4 </td>
                <td> 5000 </td>
                <td> 5000 </td>
                <td className="text-end">
                  <span
                    className="text-success"
                    style={{ background: "transparent" }}
                  >
                    2000
                  </span>
                </td>
              </tr>
              <tr bgcolor="#72BBEF">
                <td>pranavi</td>
                <td> mr4gz05h</td>
                <td> 7/3/2026, 10:35:04 AM</td>
                <td> 152.57.61.182</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Seattle Orcas v MI New York
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>Seattle Orcas</td>
                <td> back </td>
                <td> 1.46 </td>
                <td> 500 </td>
                <td> 500 </td>
                <td className="text-end">
                  <span
                    className="text-danger"
                    style={{ background: "transparent" }}
                  >
                    -(500)
                  </span>
                </td>
              </tr>
              <tr bgcolor="#72BBEF">
                <td>dini55</td>
                <td> mr4gyr0h</td>
                <td> 7/3/2026, 10:34:53 AM</td>
                <td> 106.192.225.51</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Seattle Orcas v MI New York
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>MI New York</td>
                <td> back </td>
                <td> 3.15 </td>
                <td> 700 </td>
                <td> 700 </td>
                <td className="text-end">
                  <span
                    className="text-success"
                    style={{ background: "transparent" }}
                  >
                    1505
                  </span>
                </td>
              </tr>
              <tr bgcolor="#72BBEF">
                <td>raghukagi</td>
                <td> mr4gyr71</td>
                <td> 7/3/2026, 10:34:53 AM</td>
                <td> 117.221.27.144</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Seattle Orcas v MI New York
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>MI New York</td>
                <td> back </td>
                <td> 3.15 </td>
                <td> 4000 </td>
                <td> 4000 </td>
                <td className="text-end">
                  <span
                    className="text-success"
                    style={{ background: "transparent" }}
                  >
                    8600
                  </span>
                </td>
              </tr>
              <tr bgcolor="#72BBEF">
                <td>govindraaj</td>
                <td> mr4gyq8o</td>
                <td> 7/3/2026, 10:34:52 AM</td>
                <td> 106.192.254.250</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Seattle Orcas v MI New York
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>MI New York</td>
                <td> back </td>
                <td> 3.15 </td>
                <td> 1000 </td>
                <td> 1000 </td>
                <td className="text-end">
                  <span
                    className="text-success"
                    style={{ background: "transparent" }}
                  >
                    2150
                  </span>
                </td>
              </tr>
              <tr bgcolor="#72BBEF">
                <td>veeranji</td>
                <td> mr4gypcx</td>
                <td> 7/3/2026, 10:34:50 AM</td>
                <td> 152.57.42.186</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Seattle Orcas v MI New York
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>MI New York</td>
                <td> back </td>
                <td> 3.1 </td>
                <td> 500 </td>
                <td> 500 </td>
                <td className="text-end">
                  <span
                    className="text-success"
                    style={{ background: "transparent" }}
                  >
                    1050
                  </span>
                </td>
              </tr>
              <tr bgcolor="#72BBEF">
                <td>raghukagi</td>
                <td> mr4gxva2</td>
                <td> 7/3/2026, 10:34:11 AM</td>
                <td> 117.221.27.144</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Seattle Orcas v MI New York
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>MI New York</td>
                <td> back </td>
                <td> 1.62 </td>
                <td> 5000 </td>
                <td> 5000 </td>
                <td className="text-end">
                  <span
                    className="text-success"
                    style={{ background: "transparent" }}
                  >
                    3100
                  </span>
                </td>
              </tr>
              <tr bgcolor="#72BBEF">
                <td>hanu</td>
                <td> mr4gxri0</td>
                <td> 7/3/2026, 10:34:07 AM</td>
                <td> 223.231.181.165</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Seattle Orcas v MI New York
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>Seattle Orcas</td>
                <td> back </td>
                <td> 2.74 </td>
                <td> 3000 </td>
                <td> 3000 </td>
                <td className="text-end">
                  <span
                    className="text-danger"
                    style={{ background: "transparent" }}
                  >
                    -(3000)
                  </span>
                </td>
              </tr>
              <tr bgcolor="#72BBEF">
                <td>govindraaj</td>
                <td> mr4gx00j</td>
                <td> 7/3/2026, 10:33:31 AM</td>
                <td> 106.192.254.250</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Seattle Orcas v MI New York
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>MI New York</td>
                <td> back </td>
                <td> 1.5 </td>
                <td> 2000 </td>
                <td> 2000 </td>
                <td className="text-end">
                  <span
                    className="text-success"
                    style={{ background: "transparent" }}
                  >
                    1000
                  </span>
                </td>
              </tr>
              <tr bgcolor="#72BBEF">
                <td>veeranji</td>
                <td> mr4gx0ev</td>
                <td> 7/3/2026, 10:33:31 AM</td>
                <td> 152.57.42.186</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Seattle Orcas v MI New York
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>MI New York</td>
                <td> back </td>
                <td> 1.5 </td>
                <td> 2000 </td>
                <td> 2000 </td>
                <td className="text-end">
                  <span
                    className="text-success"
                    style={{ background: "transparent" }}
                  >
                    1000
                  </span>
                </td>
              </tr>
              <tr bgcolor="#FAA9BA">
                <td>srinivas45</td>
                <td> mr4gu7bh</td>
                <td> 7/3/2026, 10:31:20 AM</td>
                <td> 152.57.59.62</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Seattle Orcas v MI New York
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>Seattle Orcas</td>
                <td> lay </td>
                <td> 8.2 </td>
                <td> 200 </td>
                <td> 1440 </td>
                <td className="text-end">
                  <span
                    className="text-success"
                    style={{ background: "transparent" }}
                  >
                    200
                  </span>
                </td>
              </tr>
              <tr bgcolor="#72BBEF">
                <td>nabi001</td>
                <td> mr4grh4f</td>
                <td> 7/3/2026, 10:29:13 AM</td>
                <td> 106.206.104.105</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Seattle Orcas v MI New York
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>MI New York</td>
                <td> back </td>
                <td> 1.11 </td>
                <td> 200 </td>
                <td> 200 </td>
                <td className="text-end">
                  <span
                    className="text-success"
                    style={{ background: "transparent" }}
                  >
                    22
                  </span>
                </td>
              </tr>
              <tr bgcolor="#FAA9BA">
                <td>shaik</td>
                <td> mr4gpy3v</td>
                <td> 7/3/2026, 10:28:02 AM</td>
                <td> 223.231.182.92</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Seattle Orcas v MI New York
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>MI New York</td>
                <td> lay </td>
                <td> 1.08 </td>
                <td> 500 </td>
                <td> 40 </td>
                <td className="text-end">
                  <span
                    className="text-danger"
                    style={{ background: "transparent" }}
                  >
                    -(40)
                  </span>
                </td>
              </tr>
              <tr bgcolor="#FAA9BA">
                <td>shaik</td>
                <td> mr4gpowe</td>
                <td> 7/3/2026, 10:27:50 AM</td>
                <td> 223.231.182.92</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Seattle Orcas v MI New York
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>MI New York</td>
                <td> lay </td>
                <td> 1.09 </td>
                <td> 4000 </td>
                <td> 360 </td>
                <td className="text-end">
                  <span
                    className="text-danger"
                    style={{ background: "transparent" }}
                  >
                    -(360)
                  </span>
                </td>
              </tr>
              <tr bgcolor="#FAA9BA">
                <td>shaik</td>
                <td> mr4gpepu</td>
                <td> 7/3/2026, 10:27:37 AM</td>
                <td> 223.231.182.92</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Seattle Orcas v MI New York
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>MI New York</td>
                <td> lay </td>
                <td> 1.07 </td>
                <td> 10000 </td>
                <td> 700 </td>
                <td className="text-end">
                  <span
                    className="text-danger"
                    style={{ background: "transparent" }}
                  >
                    -(700)
                  </span>
                </td>
              </tr>
              <tr bgcolor="#FAA9BA">
                <td>govindraaj</td>
                <td> mr4gpfah</td>
                <td> 7/3/2026, 10:27:37 AM</td>
                <td> 106.192.254.250</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Seattle Orcas v MI New York
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>MI New York</td>
                <td> lay </td>
                <td> 1.07 </td>
                <td> 2000 </td>
                <td> 140 </td>
                <td className="text-end">
                  <span
                    className="text-danger"
                    style={{ background: "transparent" }}
                  >
                    -(140)
                  </span>
                </td>
              </tr>
              <tr bgcolor="#FAA9BA">
                <td>shaik</td>
                <td> mr4gnrt7</td>
                <td> 7/3/2026, 10:26:20 AM</td>
                <td> 223.231.182.92</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Band-E-Amir Dragons v Mis-E-Ainak Knights
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>Mis-E-Ainak Knights</td>
                <td> lay </td>
                <td> 1.34 </td>
                <td> 1200 </td>
                <td> 408 </td>
                <td className="text-end">
                  <span
                    className="text-danger"
                    style={{ background: "transparent" }}
                  >
                    -(408)
                  </span>
                </td>
              </tr>
              <tr bgcolor="#FAA9BA">
                <td>shaik</td>
                <td> mr4gkw8i</td>
                <td> 7/3/2026, 10:24:06 AM</td>
                <td> 223.231.182.92</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Band-E-Amir Dragons v Mis-E-Ainak Knights
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>Mis-E-Ainak Knights</td>
                <td> lay </td>
                <td> 1.47 </td>
                <td> 2000 </td>
                <td> 940 </td>
                <td className="text-end">
                  <span
                    className="text-danger"
                    style={{ background: "transparent" }}
                  >
                    -(940)
                  </span>
                </td>
              </tr>
              <tr bgcolor="#FAA9BA">
                <td>shaik</td>
                <td> mr4gkncs</td>
                <td> 7/3/2026, 10:23:55 AM</td>
                <td> 223.231.182.92</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Band-E-Amir Dragons v Mis-E-Ainak Knights
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>Mis-E-Ainak Knights</td>
                <td> lay </td>
                <td> 1.5 </td>
                <td> 5000 </td>
                <td> 2500 </td>
                <td className="text-end">
                  <span
                    className="text-danger"
                    style={{ background: "transparent" }}
                  >
                    -(2500)
                  </span>
                </td>
              </tr>
              <tr bgcolor="#FAA9BA">
                <td>shaik</td>
                <td> mr4gkb6v</td>
                <td> 7/3/2026, 10:23:39 AM</td>
                <td> 223.231.182.92</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Band-E-Amir Dragons v Mis-E-Ainak Knights
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>Mis-E-Ainak Knights</td>
                <td> lay </td>
                <td> 1.46 </td>
                <td> 15000 </td>
                <td> 6900 </td>
                <td className="text-end">
                  <span
                    className="text-danger"
                    style={{ background: "transparent" }}
                  >
                    -(6900)
                  </span>
                </td>
              </tr>
              <tr bgcolor="#FAA9BA">
                <td>govindraaj</td>
                <td> mr4gj6t1</td>
                <td> 7/3/2026, 10:22:47 AM</td>
                <td> 106.192.254.250</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Seattle Orcas v MI New York
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>MI New York</td>
                <td> lay </td>
                <td> 1.14 </td>
                <td> 1000 </td>
                <td> 140 </td>
                <td className="text-end">
                  <span
                    className="text-danger"
                    style={{ background: "transparent" }}
                  >
                    -(140)
                  </span>
                </td>
              </tr>
              <tr bgcolor="#72BBEF">
                <td>veeranji</td>
                <td> mr4git4d</td>
                <td> 7/3/2026, 10:22:29 AM</td>
                <td> 152.57.42.186</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Seattle Orcas v MI New York
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>Seattle Orcas</td>
                <td> back </td>
                <td> 8 </td>
                <td> 100 </td>
                <td> 100 </td>
                <td className="text-end">
                  <span
                    className="text-danger"
                    style={{ background: "transparent" }}
                  >
                    -(100)
                  </span>
                </td>
              </tr>
              <tr bgcolor="#FAA9BA">
                <td>govindraaj</td>
                <td> mr4gii1z</td>
                <td> 7/3/2026, 10:22:14 AM</td>
                <td> 106.192.254.250</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Seattle Orcas v MI New York
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>MI New York</td>
                <td> lay </td>
                <td> 1.14 </td>
                <td> 3000 </td>
                <td> 420 </td>
                <td className="text-end">
                  <span
                    className="text-danger"
                    style={{ background: "transparent" }}
                  >
                    -(420)
                  </span>
                </td>
              </tr>
              <tr bgcolor="#72BBEF">
                <td>shaik</td>
                <td> mr4gg0lk</td>
                <td> 7/3/2026, 10:20:19 AM</td>
                <td> 223.231.182.92</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Seattle Orcas v MI New York
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>MI New York</td>
                <td> back </td>
                <td> 1.18 </td>
                <td> 100 </td>
                <td> 100 </td>
                <td className="text-end">
                  <span
                    className="text-success"
                    style={{ background: "transparent" }}
                  >
                    18
                  </span>
                </td>
              </tr>
              <tr bgcolor="#72BBEF">
                <td>vip777</td>
                <td> mr4gfwpq</td>
                <td> 7/3/2026, 10:20:13 AM</td>
                <td> 106.221.196.164</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Seattle Orcas v MI New York
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>Seattle Orcas</td>
                <td> back </td>
                <td> 6.2 </td>
                <td> 1000 </td>
                <td> 1000 </td>
                <td className="text-end">
                  <span
                    className="text-danger"
                    style={{ background: "transparent" }}
                  >
                    -(1000)
                  </span>
                </td>
              </tr>
              <tr bgcolor="#72BBEF">
                <td>shaik</td>
                <td> mr4gftav</td>
                <td> 7/3/2026, 10:20:09 AM</td>
                <td> 223.231.182.92</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Seattle Orcas v MI New York
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>MI New York</td>
                <td> back </td>
                <td> 1.19 </td>
                <td> 1800 </td>
                <td> 1800 </td>
                <td className="text-end">
                  <span
                    className="text-success"
                    style={{ background: "transparent" }}
                  >
                    342
                  </span>
                </td>
              </tr>
              <tr bgcolor="#72BBEF">
                <td>shaik</td>
                <td> mr4gf0ah</td>
                <td> 7/3/2026, 10:19:31 AM</td>
                <td> 223.231.182.92</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Seattle Orcas v MI New York
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>MI New York</td>
                <td> back </td>
                <td> 1.21 </td>
                <td> 2000 </td>
                <td> 2000 </td>
                <td className="text-end">
                  <span
                    className="text-success"
                    style={{ background: "transparent" }}
                  >
                    420
                  </span>
                </td>
              </tr>
              <tr bgcolor="#72BBEF">
                <td>veeranji</td>
                <td> mr4geo6e</td>
                <td> 7/3/2026, 10:19:16 AM</td>
                <td> 152.57.42.186</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Seattle Orcas v MI New York
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>Seattle Orcas</td>
                <td> back </td>
                <td> 5.7 </td>
                <td> 500 </td>
                <td> 500 </td>
                <td className="text-end">
                  <span
                    className="text-danger"
                    style={{ background: "transparent" }}
                  >
                    -(500)
                  </span>
                </td>
              </tr>
              <tr bgcolor="#72BBEF">
                <td>shaik</td>
                <td> mr4gelio</td>
                <td> 7/3/2026, 10:19:12 AM</td>
                <td> 223.231.182.92</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Seattle Orcas v MI New York
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>MI New York</td>
                <td> back </td>
                <td> 1.2 </td>
                <td> 5000 </td>
                <td> 5000 </td>
                <td className="text-end">
                  <span
                    className="text-success"
                    style={{ background: "transparent" }}
                  >
                    1000
                  </span>
                </td>
              </tr>
              <tr bgcolor="#72BBEF">
                <td>madhu11</td>
                <td> mr4gb3fd</td>
                <td> 7/3/2026, 10:16:29 AM</td>
                <td> 152.57.136.172</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Seattle Orcas v MI New York
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>Seattle Orcas</td>
                <td> back </td>
                <td> 4.7 </td>
                <td> 1000 </td>
                <td> 1000 </td>
                <td className="text-end">
                  <span
                    className="text-danger"
                    style={{ background: "transparent" }}
                  >
                    -(1000)
                  </span>
                </td>
              </tr>
              <tr bgcolor="#72BBEF">
                <td>anilbh</td>
                <td> mr4ga5y4</td>
                <td> 7/3/2026, 10:15:46 AM</td>
                <td> 157.50.184.88</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Seattle Orcas v MI New York
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>Seattle Orcas</td>
                <td> back </td>
                <td> 5.2 </td>
                <td> 800 </td>
                <td> 800 </td>
                <td className="text-end">
                  <span
                    className="text-danger"
                    style={{ background: "transparent" }}
                  >
                    -(800)
                  </span>
                </td>
              </tr>
              <tr bgcolor="#72BBEF">
                <td>shaik</td>
                <td> mr4g9wip</td>
                <td> 7/3/2026, 10:15:33 AM</td>
                <td> 223.231.182.92</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Seattle Orcas v MI New York
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>MI New York</td>
                <td> back </td>
                <td> 1.25 </td>
                <td> 2160 </td>
                <td> 2160 </td>
                <td className="text-end">
                  <span
                    className="text-success"
                    style={{ background: "transparent" }}
                  >
                    540
                  </span>
                </td>
              </tr>
              <tr bgcolor="#72BBEF">
                <td>shaik</td>
                <td> mr4g99xl</td>
                <td> 7/3/2026, 10:15:04 AM</td>
                <td> 223.231.182.92</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Seattle Orcas v MI New York
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>MI New York</td>
                <td> back </td>
                <td> 1.3 </td>
                <td> 15000 </td>
                <td> 15000 </td>
                <td className="text-end">
                  <span
                    className="text-success"
                    style={{ background: "transparent" }}
                  >
                    4500
                  </span>
                </td>
              </tr>
              <tr bgcolor="#72BBEF">
                <td>veeranji</td>
                <td> mr4g8y6f</td>
                <td> 7/3/2026, 10:14:49 AM</td>
                <td> 152.57.42.186</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Seattle Orcas v MI New York
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>MI New York</td>
                <td> back </td>
                <td> 1.32 </td>
                <td> 10000 </td>
                <td> 10000 </td>
                <td className="text-end">
                  <span
                    className="text-success"
                    style={{ background: "transparent" }}
                  >
                    3200
                  </span>
                </td>
              </tr>
              <tr bgcolor="#72BBEF">
                <td>dini55</td>
                <td> mr4g757j</td>
                <td> 7/3/2026, 10:13:25 AM</td>
                <td> 106.192.225.51</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Seattle Orcas v MI New York
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>Seattle Orcas</td>
                <td> back </td>
                <td> 6.4 </td>
                <td> 500 </td>
                <td> 500 </td>
                <td className="text-end">
                  <span
                    className="text-danger"
                    style={{ background: "transparent" }}
                  >
                    -(500)
                  </span>
                </td>
              </tr>
              <tr bgcolor="#72BBEF">
                <td>veeranji</td>
                <td> mr4g6hyi</td>
                <td> 7/3/2026, 10:12:54 AM</td>
                <td> 152.57.42.186</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Seattle Orcas v MI New York
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>Seattle Orcas</td>
                <td> back </td>
                <td> 6.4 </td>
                <td> 500 </td>
                <td> 500 </td>
                <td className="text-end">
                  <span
                    className="text-danger"
                    style={{ background: "transparent" }}
                  >
                    -(500)
                  </span>
                </td>
              </tr>
              <tr bgcolor="#FAA9BA">
                <td>shaik</td>
                <td> mr4g6e79</td>
                <td> 7/3/2026, 10:12:50 AM</td>
                <td> 223.231.182.92</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Seattle Orcas v MI New York
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>MI New York</td>
                <td> lay </td>
                <td> 1.2 </td>
                <td> 2500 </td>
                <td> 500 </td>
                <td className="text-end">
                  <span
                    className="text-danger"
                    style={{ background: "transparent" }}
                  >
                    -(500)
                  </span>
                </td>
              </tr>
              <tr bgcolor="#FAA9BA">
                <td>shaik</td>
                <td> mr4g61wm</td>
                <td> 7/3/2026, 10:12:34 AM</td>
                <td> 223.231.182.92</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Seattle Orcas v MI New York
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>MI New York</td>
                <td> lay </td>
                <td> 1.2 </td>
                <td> 10000 </td>
                <td> 2000 </td>
                <td className="text-end">
                  <span
                    className="text-danger"
                    style={{ background: "transparent" }}
                  >
                    -(2000)
                  </span>
                </td>
              </tr>
              <tr bgcolor="#FAA9BA">
                <td>shaik</td>
                <td> mr4g5veh</td>
                <td> 7/3/2026, 10:12:25 AM</td>
                <td> 223.231.182.92</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Seattle Orcas v MI New York
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>MI New York</td>
                <td> lay </td>
                <td> 1.2 </td>
                <td> 10000 </td>
                <td> 2000 </td>
                <td className="text-end">
                  <span
                    className="text-danger"
                    style={{ background: "transparent" }}
                  >
                    -(2000)
                  </span>
                </td>
              </tr>
              <tr bgcolor="#72BBEF">
                <td>pranavi</td>
                <td> mr4g57ku</td>
                <td> 7/3/2026, 10:11:54 AM</td>
                <td> 152.57.55.244</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Seattle Orcas v MI New York
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>MI New York</td>
                <td> back </td>
                <td> 1.22 </td>
                <td> 500 </td>
                <td> 500 </td>
                <td className="text-end">
                  <span
                    className="text-success"
                    style={{ background: "transparent" }}
                  >
                    110
                  </span>
                </td>
              </tr>
              <tr bgcolor="#FAA9BA">
                <td>shaik</td>
                <td> mr4g1dgk</td>
                <td> 7/3/2026, 10:08:55 AM</td>
                <td> 223.231.182.92</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Seattle Orcas v MI New York
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>MI New York</td>
                <td> lay </td>
                <td> 1.27 </td>
                <td> 5000 </td>
                <td> 1350 </td>
                <td className="text-end">
                  <span
                    className="text-danger"
                    style={{ background: "transparent" }}
                  >
                    -(1350)
                  </span>
                </td>
              </tr>
              <tr bgcolor="#72BBEF">
                <td>veeranji</td>
                <td> mr4g0pse</td>
                <td> 7/3/2026, 10:08:25 AM</td>
                <td> 152.57.42.186</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Seattle Orcas v MI New York
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>Seattle Orcas</td>
                <td> back </td>
                <td> 4.8 </td>
                <td> 1000 </td>
                <td> 1000 </td>
                <td className="text-end">
                  <span
                    className="text-danger"
                    style={{ background: "transparent" }}
                  >
                    -(1000)
                  </span>
                </td>
              </tr>
              <tr bgcolor="#72BBEF">
                <td>pradeepa</td>
                <td> mr4ftny5</td>
                <td> 7/3/2026, 10:02:56 AM</td>
                <td> 106.202.96.153</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Seattle Orcas v MI New York
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>Seattle Orcas</td>
                <td> back </td>
                <td> 2.46 </td>
                <td> 500 </td>
                <td> 500 </td>
                <td className="text-end">
                  <span
                    className="text-danger"
                    style={{ background: "transparent" }}
                  >
                    -(500)
                  </span>
                </td>
              </tr>
              <tr bgcolor="#72BBEF">
                <td>veeranji</td>
                <td> mr4frjk9</td>
                <td> 7/3/2026, 10:01:17 AM</td>
                <td> 152.57.42.186</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Seattle Orcas v MI New York
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>MI New York</td>
                <td> back </td>
                <td> 1.68 </td>
                <td> 1000 </td>
                <td> 1000 </td>
                <td className="text-end">
                  <span
                    className="text-success"
                    style={{ background: "transparent" }}
                  >
                    680
                  </span>
                </td>
              </tr>
              <tr bgcolor="#FAA9BA">
                <td>raju1234</td>
                <td> mr4fpkt6</td>
                <td> 7/3/2026, 9:59:45 AM</td>
                <td> 223.186.242.119</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Seattle Orcas v MI New York
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>MI New York</td>
                <td> lay </td>
                <td> 1.38 </td>
                <td> 10000 </td>
                <td> 3800 </td>
                <td className="text-end">
                  <span
                    className="text-danger"
                    style={{ background: "transparent" }}
                  >
                    -(3800)
                  </span>
                </td>
              </tr>
              <tr bgcolor="#72BBEF">
                <td>veeranji</td>
                <td> mr4fpeue</td>
                <td> 7/3/2026, 9:59:37 AM</td>
                <td> 152.57.42.186</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Seattle Orcas v MI New York
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>Seattle Orcas</td>
                <td> back </td>
                <td> 3.7 </td>
                <td> 1000 </td>
                <td> 1000 </td>
                <td className="text-end">
                  <span
                    className="text-danger"
                    style={{ background: "transparent" }}
                  >
                    -(1000)
                  </span>
                </td>
              </tr>
              <tr bgcolor="#72BBEF">
                <td>veeranji</td>
                <td> mr4fp5po</td>
                <td> 7/3/2026, 9:59:25 AM</td>
                <td> 152.57.42.186</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Seattle Orcas v MI New York
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>Seattle Orcas</td>
                <td> back </td>
                <td> 3.6 </td>
                <td> 1000 </td>
                <td> 1000 </td>
                <td className="text-end">
                  <span
                    className="text-danger"
                    style={{ background: "transparent" }}
                  >
                    -(1000)
                  </span>
                </td>
              </tr>
              <tr bgcolor="#72BBEF">
                <td>raghukagi</td>
                <td> mr4flvsc</td>
                <td> 7/3/2026, 9:56:53 AM</td>
                <td> 117.221.27.144</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Seattle Orcas v MI New York
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>Seattle Orcas</td>
                <td> back </td>
                <td> 3.45 </td>
                <td> 6080 </td>
                <td> 6080 </td>
                <td className="text-end">
                  <span
                    className="text-danger"
                    style={{ background: "transparent" }}
                  >
                    -(6080)
                  </span>
                </td>
              </tr>
              <tr bgcolor="#72BBEF">
                <td>madhu11</td>
                <td> mr4fki3q</td>
                <td> 7/3/2026, 9:55:48 AM</td>
                <td> 152.57.135.153</td>
                <td className="text-start">
                  Cricket
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  <strong style={{ background: "transparent" }}>
                    Seattle Orcas v MI New York
                  </strong>
                  <span
                    className="angle_unicode"
                    style={{ background: "transparent" }}
                  >
                    ▸
                  </span>
                  Match Odds{" "}
                </td>
                <td>Seattle Orcas</td>
                <td> back </td>
                <td> 3.3 </td>
                <td> 1000 </td>
                <td> 1000 </td>
                <td className="text-end">
                  <span
                    className="text-danger"
                    style={{ background: "transparent" }}
                  >
                    -(1000)
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
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
            <li className="p-1">
              <a
                rel="canonical"
                role="button"
                className="pagintion-li"
                tabIndex={-1}
                aria-label="Page 1 is your current page"
                aria-current="page"
              >
                1
              </a>
            </li>
            <li>
              <a rel="next" role="button" tabIndex={0} aria-label="Page 2">
                2
              </a>
            </li>
            <li>
              <a role="button" tabIndex={0} aria-label="Page 3">
                3
              </a>
            </li>
            <li>
              <a role="button" tabIndex={0} aria-label="Page 4">
                4
              </a>
            </li>
            <li>
              <a role="button" tabIndex={0} aria-label="Page 5">
                5
              </a>
            </li>
            <li>
              <a role="button" tabIndex={0} aria-label="Page 6">
                6
              </a>
            </li>
            <li>
              <a role="button" tabIndex={0} aria-label="Page 7">
                7
              </a>
            </li>
            <li>
              <a role="button" tabIndex={0} aria-label="Page 8">
                8
              </a>
            </li>
            <li>
              <a role="button" tabIndex={0} aria-label="Page 9">
                9
              </a>
            </li>
            <li>
              <a role="button" tabIndex={0} aria-label="Page 10">
                10
              </a>
            </li>
            <li className="break">
              <a role="button" tabIndex={0} aria-label="Jump forward">
                ...
              </a>
            </li>
            <li>
              <a role="button" tabIndex={0} aria-label="Page 56">
                56
              </a>
            </li>
            <li>
              <a role="button" tabIndex={0} aria-label="Page 57">
                57
              </a>
            </li>
            <li>
              <a role="button" tabIndex={0} aria-label="Page 58">
                58
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
              >
                {" "}
                &gt;
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</section>

    </div>
  )
}

export default Betlist
