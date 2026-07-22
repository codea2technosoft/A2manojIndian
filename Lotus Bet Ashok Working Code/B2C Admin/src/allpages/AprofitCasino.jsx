import React from 'react'

function AprofitCasino() {
  return (
    <div className='allcommon'>
      <section className="main-inner-outer py-4">
  <div className="container-fluid">
    <div className="row">
      <div className="db-sec">
        <h2 className="common-heading">Profit/Loss Report by Market</h2>
      </div>
      <div className="mb-2 col-md-3">
        <form className="bet_status bg-transparent border-0 p-0">
          <div className="bet-sec">
            <label className="form-label">Data Source:</label>
            <select
              aria-label="Default select example"
              className="small_select ms-2 form-select"
            >
              <option>DB</option>
            </select>
          </div>
        </form>
      </div>
      <div className="col-md-12">
        <div className="inner-wrapper">
          <form className="bet_status">
            <div className="row">
              <div className="col-xl-12 col-md-12">
                <div className="row">
                  <div className="mb-lg-0 mb-3 col-lg-2 col-sm-6">
                    <div className="bet-sec">
                      <label className="form-label">Sports:</label>
                      <select
                        aria-label="Default select example"
                        className="small_select ms-2 form-select"
                      >
                        <option value="">All</option>
                        <option value="internationalCasino">
                          International Casino
                        </option>
                        <option value="indiaCasino">India Casino</option>
                        <option value="cricket">Cricket</option>
                        <option value="soccer">Soccer</option>
                        <option value="tennis">Tennie</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-lg-0 mb-3 col-lg-3 col-sm-6">
                    <div className="bet-sec">
                      <label className="me-2 form-label">Time Zone:</label>
                      <select
                        aria-label="Default select example"
                        className="small_select ms-2 form-select"
                      >
                        <option>IST(Bangalore/Bombay)</option>
                      </select>
                    </div>
                  </div>
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
                </div>
              </div>
            </div>
            <div className="history-btn mt-3">
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
        </div>
      </div>
      <div className="mt-2 col-md-12">
        <section className="account-table w-100">
          <div className="responsive transaction-history table-color">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">UID</th>
                  <th scope="col">Stake</th>
                  <th scope="col">Downline P/L</th>
                  <th scope="col">Player P/L</th>
                  <th scope="col">Comm.</th>
                  <th scope="col">Upline/Total P/L</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>2026-07-03</td>
                  <td>0</td>
                  <td>
                    <span className="text-success">(192,191.67)</span>
                  </td>
                  <td>
                    <span className="text-danger">(-192,191.67)</span>
                  </td>
                  <td>0</td>
                  <td>
                    <span className="text-success">(192,191.67)</span>
                  </td>
                </tr>
                <tr>
                  <td>2026-07-04</td>
                  <td>0</td>
                  <td>
                    <span className="text-success">(188,925.40)</span>
                  </td>
                  <td>
                    <span className="text-danger">(-188,925.40)</span>
                  </td>
                  <td>0</td>
                  <td>
                    <span className="text-success">(188,925.40)</span>
                  </td>
                </tr>
                <tr className="total-table-balance-none">
                  <td>Total</td>
                  <td>0</td>
                  <td>
                    <strong className="text-danger">
                      <span className="text-success">381,117.07</span>
                    </strong>
                  </td>
                  <td>
                    <strong className="text-success">
                      <span className="text-danger">(-381,117.07)</span>
                    </strong>
                  </td>
                  <td>
                    <strong className="text-success">0.00</strong>
                  </td>
                  <td>
                    <strong className="text-danger">
                      <span className="text-success">381,117.07</span>
                    </strong>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="bottom-pagination" />
          </div>
        </section>
      </div>
    </div>
  </div>
</section>

    </div>
  )
}

export default AprofitCasino
