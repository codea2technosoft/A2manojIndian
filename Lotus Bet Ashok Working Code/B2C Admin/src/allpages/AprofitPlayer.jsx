import React from 'react'

function AprofitPlayer() {
  return (
    <div className='allcommon'>
      <section className="main-inner-outer py-4">
  <div className="container-fluid">
    <div className="row">
      <div className="db-sec">
        <h2 className="common-heading">Profit/Loss Report by Player</h2>
      </div>
      <div className="col-md-12">
        <div className="inner-wrapper">
          <form className="bet_status">
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
                  <div className="mb-lg-0 mb-3 col-lg-2 col-sm-3">
                    <div className="bet-sec">
                      <label className="form-label">Last</label>
                      <select
                        aria-label="Default select example"
                        className="small_select form-select"
                      >
                        <option value={100}>100 Txn</option>
                        <option value={200}>200 Txn</option>
                        <option value={500}>500 Txn</option>
                        <option value={1000}>1000 Txn</option>
                        <option value={5000}>5000 Txn</option>
                        <option value={10000}>10000 Txn</option>
                        <option value="">All</option>
                      </select>
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
                  >
                    Just For Today
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="me-0 theme_light_btn btn btn-primary"
                  >
                    From Yesterday
                  </button>
                </li>
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
                    className="me-0 theme_light_btn btn btn-primary"
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
          <button
            type="button"
            className="mb-2 mx-1 theme_light_btn btn btn-primary"
          >
            All
          </button>
          <button
            type="button"
            className="mb-2 mx-1  green-btn btn btn-primary"
          >
            Cricket
          </button>
          <button
            type="button"
            className="mb-2 mx-1 theme_light_btn btn btn-primary"
          >
            Soccer
          </button>
          <button
            type="button"
            className="mb-2 mx-1 theme_light_btn btn btn-primary"
          >
            Tenis
          </button>
          <button
            type="button"
            className="mb-2 mx-1 theme_light_btn btn btn-primary"
          >
            International Casion
          </button>
          <button
            type="button"
            className="mb-2 mx-1 theme_light_btn btn btn-primary"
          >
            Indian Casino
          </button>
        </div>
      </div>
      <div className="mt-2 col-lg-12 col-md-12 col-sm-12">
        <section className="account-table  w-100">
          <div className="responsive transaction-history table-color">
            <table className="table">
              <thead>
                <tr>
                  <th>Sr No.</th>
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
                <tr>
                  <td>1</td>
                  <td>
                    <a href="/AprofitPlayer">thippe01</a>
                  </td>
                  <td>
                    {" "}
                    <span className="text-danger">(-1,350.00)</span>
                  </td>
                  <td>
                    <span className="text-success">1,350.00</span>
                  </td>
                  <td>0.00</td>
                  <td>
                    <span className="text-danger">(-1,350.00)</span>
                  </td>
                </tr>
                <tr className="" style={{ display: "none" }} />
                <tr>
                  <td>2</td>
                  <td>
                    <a href="/AprofitPlayer">thippa143</a>
                  </td>
                  <td>
                    {" "}
                    <span className="text-danger">(-28,660.00)</span>
                  </td>
                  <td>
                    <span className="text-success">28,660.00</span>
                  </td>
                  <td>0.00</td>
                  <td>
                    <span className="text-danger">(-28,660.00)</span>
                  </td>
                </tr>
                <tr className="" style={{ display: "none" }} />
                <tr>
                  <td>3</td>
                  <td>
                    <a href="/AprofitPlayer">amithgowda</a>
                  </td>
                  <td>
                    {" "}
                    <span className="text-danger">(-3,714.00)</span>
                  </td>
                  <td>
                    <span className="text-success">3,714.00</span>
                  </td>
                  <td>0.00</td>
                  <td>
                    <span className="text-danger">(-3,714.00)</span>
                  </td>
                </tr>
                <tr className="" style={{ display: "none" }} />
                <tr>
                  <td>4</td>
                  <td>
                    <a href="/AprofitPlayer">rajesh4977</a>
                  </td>
                  <td>
                    {" "}
                    <span className="text-danger">(-3,300.00)</span>
                  </td>
                  <td>
                    <span className="text-success">3,300.00</span>
                  </td>
                  <td>0.00</td>
                  <td>
                    <span className="text-danger">(-3,300.00)</span>
                  </td>
                </tr>
                <tr className="" style={{ display: "none" }} />
                <tr>
                  <td>5</td>
                  <td>
                    <a href="/AprofitPlayer">ant1122</a>
                  </td>
                  <td>
                    {" "}
                    <span className="text-success">1,000.00</span>
                  </td>
                  <td>
                    <span className="text-danger">(-1,000.00)</span>
                  </td>
                  <td>0.00</td>
                  <td>
                    <span className="text-success">1,000.00</span>
                  </td>
                </tr>
                <tr className="" style={{ display: "none" }} />
                <tr>
                  <td>6</td>
                  <td>
                    <a href="/AprofitPlayer">manchi</a>
                  </td>
                  <td>
                    {" "}
                    <span className="text-danger">(-1,724.00)</span>
                  </td>
                  <td>
                    <span className="text-success">1,724.00</span>
                  </td>
                  <td>0.00</td>
                  <td>
                    <span className="text-danger">(-1,724.00)</span>
                  </td>
                </tr>
                <tr className="" style={{ display: "none" }} />
                <tr>
                  <td>7</td>
                  <td>
                    <a href="/AprofitPlayer">balaji111</a>
                  </td>
                  <td>
                    {" "}
                    <span className="text-success">1,000.00</span>
                  </td>
                  <td>
                    <span className="text-danger">(-1,000.00)</span>
                  </td>
                  <td>0.00</td>
                  <td>
                    <span className="text-success">1,000.00</span>
                  </td>
                </tr>
                <tr className="" style={{ display: "none" }} />
                <tr>
                  <td>8</td>
                  <td>
                    <a href="/AprofitPlayer">shivu-6</a>
                  </td>
                  <td>
                    {" "}
                    <span className="text-success">2,000.00</span>
                  </td>
                  <td>
                    <span className="text-danger">(-2,000.00)</span>
                  </td>
                  <td>0.00</td>
                  <td>
                    <span className="text-success">2,000.00</span>
                  </td>
                </tr>
                <tr className="" style={{ display: "none" }} />
                <tr>
                  <td>9</td>
                  <td>
                    <a href="/AprofitPlayer">yathish02</a>
                  </td>
                  <td>
                    {" "}
                    <span className="text-danger">(-18,000.90)</span>
                  </td>
                  <td>
                    <span className="text-success">18,000.90</span>
                  </td>
                  <td>0.00</td>
                  <td>
                    <span className="text-danger">(-18,000.90)</span>
                  </td>
                </tr>
                <tr className="" style={{ display: "none" }} />
                <tr>
                  <td>10</td>
                  <td>
                    <a href="/AprofitPlayer">raghukagi</a>
                  </td>
                  <td>
                    {" "}
                    <span className="text-danger">(-4,060.00)</span>
                  </td>
                  <td>
                    <span className="text-success">4,060.00</span>
                  </td>
                  <td>0.00</td>
                  <td>
                    <span className="text-danger">(-4,060.00)</span>
                  </td>
                </tr>
                <tr className="" style={{ display: "none" }} />
                <tr>
                  <td>11</td>
                  <td>
                    <a href="/AprofitPlayer">pranavi</a>
                  </td>
                  <td>
                    {" "}
                    <span className="text-danger">(-212.00)</span>
                  </td>
                  <td>
                    <span className="text-success">212.00</span>
                  </td>
                  <td>0.00</td>
                  <td>
                    <span className="text-danger">(-212.00)</span>
                  </td>
                </tr>
                <tr className="" style={{ display: "none" }} />
                <tr>
                  <td>12</td>
                  <td>
                    <a href="/AprofitPlayer">govindraaj</a>
                  </td>
                  <td>
                    {" "}
                    <span className="text-danger">(-4,710.00)</span>
                  </td>
                  <td>
                    <span className="text-success">4,710.00</span>
                  </td>
                  <td>0.00</td>
                  <td>
                    <span className="text-danger">(-4,710.00)</span>
                  </td>
                </tr>
                <tr className="" style={{ display: "none" }} />
                <tr>
                  <td>13</td>
                  <td>
                    <a href="/AprofitPlayer">madhu11</a>
                  </td>
                  <td>
                    {" "}
                    <span className="text-success">6,750.00</span>
                  </td>
                  <td>
                    <span className="text-danger">(-6,750.00)</span>
                  </td>
                  <td>0.00</td>
                  <td>
                    <span className="text-success">6,750.00</span>
                  </td>
                </tr>
                <tr className="" style={{ display: "none" }} />
                <tr>
                  <td>14</td>
                  <td>
                    <a href="/AprofitPlayer">pradeepa</a>
                  </td>
                  <td>
                    {" "}
                    <span className="text-danger">(-2,951.00)</span>
                  </td>
                  <td>
                    <span className="text-success">2,951.00</span>
                  </td>
                  <td>0.00</td>
                  <td>
                    <span className="text-danger">(-2,951.00)</span>
                  </td>
                </tr>
                <tr className="" style={{ display: "none" }} />
                <tr>
                  <td>15</td>
                  <td>
                    <a href="/AprofitPlayer">srinivas45</a>
                  </td>
                  <td>
                    {" "}
                    <span className="text-success">300.00</span>
                  </td>
                  <td>
                    <span className="text-danger">(-300.00)</span>
                  </td>
                  <td>0.00</td>
                  <td>
                    <span className="text-success">300.00</span>
                  </td>
                </tr>
                <tr className="" style={{ display: "none" }} />
                <tr>
                  <td>16</td>
                  <td>
                    <a href="/AprofitPlayer">zari</a>
                  </td>
                  <td>
                    {" "}
                    <span className="text-success">420.00</span>
                  </td>
                  <td>
                    <span className="text-danger">(-420.00)</span>
                  </td>
                  <td>0.00</td>
                  <td>
                    <span className="text-success">420.00</span>
                  </td>
                </tr>
                <tr className="" style={{ display: "none" }} />
                <tr>
                  <td>17</td>
                  <td>
                    <a href="/AprofitPlayer">khalilauto</a>
                  </td>
                  <td>
                    {" "}
                    <span className="text-danger">(-9,367.00)</span>
                  </td>
                  <td>
                    <span className="text-success">9,367.00</span>
                  </td>
                  <td>0.00</td>
                  <td>
                    <span className="text-danger">(-9,367.00)</span>
                  </td>
                </tr>
                <tr className="" style={{ display: "none" }} />
                <tr>
                  <td>18</td>
                  <td>
                    <a href="/AprofitPlayer">hanu</a>
                  </td>
                  <td>
                    {" "}
                    <span className="text-danger">(-250.50)</span>
                  </td>
                  <td>
                    <span className="text-success">250.50</span>
                  </td>
                  <td>0.00</td>
                  <td>
                    <span className="text-danger">(-250.50)</span>
                  </td>
                </tr>
                <tr className="" style={{ display: "none" }} />
                <tr>
                  <td>19</td>
                  <td>
                    <a href="/AprofitPlayer">prathap</a>
                  </td>
                  <td>
                    {" "}
                    <span className="text-danger">(-4,014.80)</span>
                  </td>
                  <td>
                    <span className="text-success">4,014.80</span>
                  </td>
                  <td>0.00</td>
                  <td>
                    <span className="text-danger">(-4,014.80)</span>
                  </td>
                </tr>
                <tr className="" style={{ display: "none" }} />
                <tr>
                  <td>20</td>
                  <td>
                    <a href="/AprofitPlayer">nabi001</a>
                  </td>
                  <td>
                    {" "}
                    <span className="text-danger">(-664.60)</span>
                  </td>
                  <td>
                    <span className="text-success">664.60</span>
                  </td>
                  <td>0.00</td>
                  <td>
                    <span className="text-danger">(-664.60)</span>
                  </td>
                </tr>
                <tr className="" style={{ display: "none" }} />
                <tr>
                  <td>21</td>
                  <td>
                    <a href="/AprofitPlayer">ajay111</a>
                  </td>
                  <td>
                    {" "}
                    <span className="text-success">2,000.00</span>
                  </td>
                  <td>
                    <span className="text-danger">(-2,000.00)</span>
                  </td>
                  <td>0.00</td>
                  <td>
                    <span className="text-success">2,000.00</span>
                  </td>
                </tr>
                <tr className="" style={{ display: "none" }} />
                <tr>
                  <td>22</td>
                  <td>
                    <a href="/AprofitPlayer">naveens</a>
                  </td>
                  <td>
                    {" "}
                    <span className="text-success">1,094.30</span>
                  </td>
                  <td>
                    <span className="text-danger">(-1,094.30)</span>
                  </td>
                  <td>0.00</td>
                  <td>
                    <span className="text-success">1,094.30</span>
                  </td>
                </tr>
                <tr className="" style={{ display: "none" }} />
                <tr>
                  <td>23</td>
                  <td>
                    <a href="/AprofitPlayer">januu123</a>
                  </td>
                  <td>
                    {" "}
                    <span className="text-danger">(-600.00)</span>
                  </td>
                  <td>
                    <span className="text-success">600.00</span>
                  </td>
                  <td>0.00</td>
                  <td>
                    <span className="text-danger">(-600.00)</span>
                  </td>
                </tr>
                <tr className="" style={{ display: "none" }} />
                <tr>
                  <td>24</td>
                  <td>
                    <a href="/AprofitPlayer">anilbh</a>
                  </td>
                  <td>
                    {" "}
                    <span className="text-danger">(-21,200.00)</span>
                  </td>
                  <td>
                    <span className="text-success">21,200.00</span>
                  </td>
                  <td>0.00</td>
                  <td>
                    <span className="text-danger">(-21,200.00)</span>
                  </td>
                </tr>
                <tr className="" style={{ display: "none" }} />
                <tr>
                  <td>25</td>
                  <td>
                    <a href="/AprofitPlayer">raju1234</a>
                  </td>
                  <td>
                    {" "}
                    <span className="text-danger">(-21,200.00)</span>
                  </td>
                  <td>
                    <span className="text-success">21,200.00</span>
                  </td>
                  <td>0.00</td>
                  <td>
                    <span className="text-danger">(-21,200.00)</span>
                  </td>
                </tr>
                <tr className="" style={{ display: "none" }} />
                <tr>
                  <td>26</td>
                  <td>
                    <a href="/AprofitPlayer">chiru12</a>
                  </td>
                  <td>
                    {" "}
                    <span className="text-success">100.00</span>
                  </td>
                  <td>
                    <span className="text-danger">(-100.00)</span>
                  </td>
                  <td>0.00</td>
                  <td>
                    <span className="text-success">100.00</span>
                  </td>
                </tr>
                <tr className="" style={{ display: "none" }} />
                <tr>
                  <td>27</td>
                  <td>
                    <a href="/AprofitPlayer">vip777</a>
                  </td>
                  <td>
                    {" "}
                    <span className="text-danger">(-12,773.00)</span>
                  </td>
                  <td>
                    <span className="text-success">12,773.00</span>
                  </td>
                  <td>0.00</td>
                  <td>
                    <span className="text-danger">(-12,773.00)</span>
                  </td>
                </tr>
                <tr className="" style={{ display: "none" }} />
                <tr>
                  <td>28</td>
                  <td>
                    <a href="/AprofitPlayer">malli01</a>
                  </td>
                  <td>
                    {" "}
                    <span className="text-danger">(-2,592.00)</span>
                  </td>
                  <td>
                    <span className="text-success">2,592.00</span>
                  </td>
                  <td>0.00</td>
                  <td>
                    <span className="text-danger">(-2,592.00)</span>
                  </td>
                </tr>
                <tr className="" style={{ display: "none" }} />
                <tr>
                  <td>29</td>
                  <td>
                    <a href="/AprofitPlayer">diri123</a>
                  </td>
                  <td>
                    {" "}
                    <span className="text-success">14,000.00</span>
                  </td>
                  <td>
                    <span className="text-danger">(-14,000.00)</span>
                  </td>
                  <td>0.00</td>
                  <td>
                    <span className="text-success">14,000.00</span>
                  </td>
                </tr>
                <tr className="" style={{ display: "none" }} />
                <tr>
                  <td>30</td>
                  <td>
                    <a href="/AprofitPlayer">ranga01</a>
                  </td>
                  <td>
                    {" "}
                    <span className="text-success">3,000.00</span>
                  </td>
                  <td>
                    <span className="text-danger">(-3,000.00)</span>
                  </td>
                  <td>0.00</td>
                  <td>
                    <span className="text-success">3,000.00</span>
                  </td>
                </tr>
                <tr className="" style={{ display: "none" }} />
                <tr>
                  <td>31</td>
                  <td>
                    <a href="/AprofitPlayer">revanna</a>
                  </td>
                  <td>
                    {" "}
                    <span className="text-success">441.00</span>
                  </td>
                  <td>
                    <span className="text-danger">(-441.00)</span>
                  </td>
                  <td>0.00</td>
                  <td>
                    <span className="text-success">441.00</span>
                  </td>
                </tr>
                <tr className="" style={{ display: "none" }} />
                <tr>
                  <td>32</td>
                  <td>
                    <a href="/AprofitPlayer">sagar01</a>
                  </td>
                  <td>
                    {" "}
                    <span className="text-danger">(-4,000.00)</span>
                  </td>
                  <td>
                    <span className="text-success">4,000.00</span>
                  </td>
                  <td>0.00</td>
                  <td>
                    <span className="text-danger">(-4,000.00)</span>
                  </td>
                </tr>
                <tr className="" style={{ display: "none" }} />
                <tr>
                  <td>33</td>
                  <td>
                    <a href="/AprofitPlayer">zabi</a>
                  </td>
                  <td>
                    {" "}
                    <span className="text-danger">(-6,430.00)</span>
                  </td>
                  <td>
                    <span className="text-success">6,430.00</span>
                  </td>
                  <td>0.00</td>
                  <td>
                    <span className="text-danger">(-6,430.00)</span>
                  </td>
                </tr>
                <tr className="" style={{ display: "none" }} />
                <tr>
                  <td>34</td>
                  <td>
                    <a href="/AprofitPlayer">dini55</a>
                  </td>
                  <td>
                    {" "}
                    <span className="text-success">1,002.00</span>
                  </td>
                  <td>
                    <span className="text-danger">(-1,002.00)</span>
                  </td>
                  <td>0.00</td>
                  <td>
                    <span className="text-success">1,002.00</span>
                  </td>
                </tr>
                <tr className="" style={{ display: "none" }} />
                <tr>
                  <td>35</td>
                  <td>
                    <a href="/AprofitPlayer">rani098</a>
                  </td>
                  <td>
                    {" "}
                    <span className="text-success">19,748.00</span>
                  </td>
                  <td>
                    <span className="text-danger">(-19,748.00)</span>
                  </td>
                  <td>0.00</td>
                  <td>
                    <span className="text-success">19,748.00</span>
                  </td>
                </tr>
                <tr className="" style={{ display: "none" }} />
                <tr>
                  <td>36</td>
                  <td>
                    <a href="/AprofitPlayer">charv123</a>
                  </td>
                  <td>
                    {" "}
                    <span className="text-danger">(-8,310.00)</span>
                  </td>
                  <td>
                    <span className="text-success">8,310.00</span>
                  </td>
                  <td>0.00</td>
                  <td>
                    <span className="text-danger">(-8,310.00)</span>
                  </td>
                </tr>
                <tr className="" style={{ display: "none" }} />
                <tr>
                  <td>37</td>
                  <td>
                    <a href="/AprofitPlayer">sunilsis</a>
                  </td>
                  <td>
                    {" "}
                    <span className="text-danger">(-16,380.00)</span>
                  </td>
                  <td>
                    <span className="text-success">16,380.00</span>
                  </td>
                  <td>0.00</td>
                  <td>
                    <span className="text-danger">(-16,380.00)</span>
                  </td>
                </tr>
                <tr className="" style={{ display: "none" }} />
                <tr>
                  <td>38</td>
                  <td>
                    <a href="/AprofitPlayer">dadu3737</a>
                  </td>
                  <td>
                    {" "}
                    <span className="text-success">1,000.00</span>
                  </td>
                  <td>
                    <span className="text-danger">(-1,000.00)</span>
                  </td>
                  <td>0.00</td>
                  <td>
                    <span className="text-success">1,000.00</span>
                  </td>
                </tr>
                <tr className="" style={{ display: "none" }} />
                <tr>
                  <td>39</td>
                  <td>
                    <a href="/AprofitPlayer">dundappa</a>
                  </td>
                  <td>
                    {" "}
                    <span className="text-success">245,000.00</span>
                  </td>
                  <td>
                    <span className="text-danger">(-245,000.00)</span>
                  </td>
                  <td>0.00</td>
                  <td>
                    <span className="text-success">245,000.00</span>
                  </td>
                </tr>
                <tr className="" style={{ display: "none" }} />
                <tr>
                  <td>40</td>
                  <td>
                    <a href="/AprofitPlayer">shachin</a>
                  </td>
                  <td>
                    {" "}
                    <span className="text-success">33,000.00</span>
                  </td>
                  <td>
                    <span className="text-danger">(-33,000.00)</span>
                  </td>
                  <td>0.00</td>
                  <td>
                    <span className="text-success">33,000.00</span>
                  </td>
                </tr>
                <tr className="" style={{ display: "none" }} />
                <tr>
                  <td>41</td>
                  <td>
                    <a href="/AprofitPlayer">bittu1992</a>
                  </td>
                  <td>
                    {" "}
                    <span className="text-danger">(-2,562.00)</span>
                  </td>
                  <td>
                    <span className="text-success">2,562.00</span>
                  </td>
                  <td>0.00</td>
                  <td>
                    <span className="text-danger">(-2,562.00)</span>
                  </td>
                </tr>
                <tr className="" style={{ display: "none" }} />
                <tr>
                  <td>42</td>
                  <td>
                    <a href="/AprofitPlayer">vinay1234</a>
                  </td>
                  <td>
                    {" "}
                    <span className="text-success">1,310.00</span>
                  </td>
                  <td>
                    <span className="text-danger">(-1,310.00)</span>
                  </td>
                  <td>0.00</td>
                  <td>
                    <span className="text-success">1,310.00</span>
                  </td>
                </tr>
                <tr className="" style={{ display: "none" }} />
                <tr>
                  <td>43</td>
                  <td>
                    <a href="/AprofitPlayer">shivu777</a>
                  </td>
                  <td>
                    {" "}
                    <span className="text-success">9,346.50</span>
                  </td>
                  <td>
                    <span className="text-danger">(-9,346.50)</span>
                  </td>
                  <td>0.00</td>
                  <td>
                    <span className="text-success">9,346.50</span>
                  </td>
                </tr>
                <tr className="" style={{ display: "none" }} />
                <tr>
                  <td>44</td>
                  <td>
                    <a href="/AprofitPlayer">veeranji</a>
                  </td>
                  <td>
                    {" "}
                    <span className="text-success">26.00</span>
                  </td>
                  <td>
                    <span className="text-danger">(-26.00)</span>
                  </td>
                  <td>0.00</td>
                  <td>
                    <span className="text-success">26.00</span>
                  </td>
                </tr>
                <tr className="" style={{ display: "none" }} />
                <tr>
                  <td>45</td>
                  <td>
                    <a href="/AprofitPlayer">shaik</a>
                  </td>
                  <td>
                    {" "}
                    <span className="text-danger">(-19,141.70)</span>
                  </td>
                  <td>
                    <span className="text-success">19,141.70</span>
                  </td>
                  <td>0.00</td>
                  <td>
                    <span className="text-danger">(-19,141.70)</span>
                  </td>
                </tr>
                <tr className="" style={{ display: "none" }} />
                <tr>
                  <th scope="col">Total</th>
                  <th scope="col" />
                  <th>
                    {" "}
                    <span className="text-success">144,370.30</span>
                  </th>
                  <th>
                    <span className="text-danger">(-144,370.30)</span>
                  </th>
                  <th>0.00</th>
                  <th>
                    <span className="text-success">144,370.30</span>
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
  )
}

export default AprofitPlayer
