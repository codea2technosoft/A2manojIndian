import React from "react";
export default function Profitlosssportswise() {
    return(
        <div className="allcommon">
        <section className="main-inner-outer py-4">
  <div className="container-fluid">
    <div className="row">
      <div className="db-sec">
        <h2 className="common-heading">Profit/Loss</h2>
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
                          max="2026-07-27"
                          type="date"
                          className="small_form_control form-control"
                          defaultValue="2026-07-26"
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
                          min="2026-07-26"
                          max="2026-07-27"
                          type="date"
                          className="small_form_control form-control"
                          defaultValue="2026-07-27"
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
                    className="me-0 theme_light_btn theme_dark_btn btn btn-primary"
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
      <div className="col-md-12">
        <div className="inner-wrapper">
          <button className="btn-result">Cricket</button>
          <button className="btn-result">Soccer</button>
          <button className="btn-result">Tennis</button>
          <button className="btn-result">Greyhound</button>
          <button className="btn-result">Horse</button>
          <input
            placeholder="Search"
            type="text"
            className="form-control"
            style={{ maxWidth: "17%" }}
          />
        </div>
      </div>
      <div className="mt-2 col-lg-12 col-md-12 col-sm-12">
        <div className="inner-wrapper">
          <section className="account-table donwline-match-pl w-100">
            <div className="responsive transaction-history w-100">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col"> S.No.</th>
                    <th scope="col">Sport Name</th>
                    <th scope="col">Match Name</th>
                    <th scope="col">Match Date.</th>
                    <th scope="col">Pnl+</th>
                    <th scope="col">Pnl-</th>
                    <th scope="col">Commission</th>
                    <th scope="col">Final P&amp;L</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td className="text-start">Total</td>
                    <td>&nbsp;</td>
                    <td>
                      <span className="text-danger back-trans">
                        -138,905.94
                      </span>
                    </td>
                    <td>
                      <span className="text-success back-trans">
                        125,758.15
                      </span>
                    </td>
                    <td>0.00</td>
                    <td>
                      <span className="text-danger back-trans">-13,147.79</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-start">1</td>
                    <td>Cricket</td>
                    <td>
                      <a href="/downlinesportspl-sports-wise"> West Indies v Pakistan</a>
                    </td>
                    <td>7/27/2026, 7:30:00 PM</td>
                    <td>0.00</td>
                    <td>
                      <span className="text-success">8,710.00</span>
                    </td>
                    <td>0.00</td>
                    <td>
                      {" "}
                      <span className="text-success">8,710.00</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-start">2</td>
                    <td>Cricket</td>
                    <td>
                      <a href="/downlinesportspl-sports-wise"> Hong Kong W v Tanzania W</a>
                    </td>
                    <td>7/27/2026, 1:00:00 PM</td>
                    <td>0.00</td>
                    <td>
                      <span className="text-success">520.00</span>
                    </td>
                    <td>0.00</td>
                    <td>
                      {" "}
                      <span className="text-success">520.00</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-start">3</td>
                    <td>Cricket</td>
                    <td>
                      <a href="/downlinesportspl-sports-wise">
                        {" "}
                        Guyana Amazon Warriors v Lahore Qalandars
                      </a>
                    </td>
                    <td>7/27/2026, 4:30:00 AM</td>
                    <td>0.00</td>
                    <td>
                      <span className="text-success">3,295.00</span>
                    </td>
                    <td>0.00</td>
                    <td>
                      {" "}
                      <span className="text-success">3,295.00</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-start">4</td>
                    <td>Cricket</td>
                    <td>
                      <a href="/downlinesportspl-sports-wise">
                        {" "}
                        Trent Rockets v London Spirit
                      </a>
                    </td>
                    <td>7/26/2026, 10:30:00 PM</td>
                    <td>
                      <span className="text-danger">-27,287.04</span>
                    </td>
                    <td>0.00</td>
                    <td>0.00</td>
                    <td>
                      {" "}
                      <span className="text-danger">-27,287.04</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-start">5</td>
                    <td>Cricket</td>
                    <td>
                      <a href="/downlinesportspl-sports-wise">
                        {" "}
                        San Francisco Unicorns v Perth Scorchers
                      </a>
                    </td>
                    <td>7/26/2026, 7:30:00 PM</td>
                    <td>0.00</td>
                    <td>
                      <span className="text-success">759.00</span>
                    </td>
                    <td>0.00</td>
                    <td>
                      {" "}
                      <span className="text-success">759.00</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-start">6</td>
                    <td>Cricket</td>
                    <td>
                      <a href="/downlinesportspl-sports-wise">
                        {" "}
                        Dambulla Sixers v Galle Marvels
                      </a>
                    </td>
                    <td>7/26/2026, 7:30:00 PM</td>
                    <td>
                      <span className="text-danger">-25,831.40</span>
                    </td>
                    <td>0.00</td>
                    <td>0.00</td>
                    <td>
                      {" "}
                      <span className="text-danger">-25,831.40</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-start">7</td>
                    <td>Cricket</td>
                    <td>
                      <a href="/downlinesportspl-sports-wise">
                        {" "}
                        Manchester Super Giants v Birmingham Phoenix
                      </a>
                    </td>
                    <td>7/26/2026, 7:00:00 PM</td>
                    <td>
                      <span className="text-danger">-30,105.00</span>
                    </td>
                    <td>0.00</td>
                    <td>0.00</td>
                    <td>
                      {" "}
                      <span className="text-danger">-30,105.00</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-start">8</td>
                    <td>Cricket</td>
                    <td>
                      <a href="/downlinesportspl-sports-wise">
                        {" "}
                        Trent Rockets W v London Spirit W
                      </a>
                    </td>
                    <td>7/26/2026, 7:00:00 PM</td>
                    <td>0.00</td>
                    <td>
                      <span className="text-success">12,276.15</span>
                    </td>
                    <td>0.00</td>
                    <td>
                      {" "}
                      <span className="text-success">12,276.15</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-start">9</td>
                    <td>Cricket</td>
                    <td>
                      <a href="/downlinesportspl-sports-wise"> Zimbabwe v India</a>
                    </td>
                    <td>7/26/2026, 4:30:00 PM</td>
                    <td>0.00</td>
                    <td>
                      <span className="text-success">57,863.00</span>
                    </td>
                    <td>0.00</td>
                    <td>
                      {" "}
                      <span className="text-success">57,863.00</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-start">10</td>
                    <td>Cricket</td>
                    <td>
                      <a href="/downlinesportspl-sports-wise"> Sussex v Yorkshire</a>
                    </td>
                    <td>7/26/2026, 3:30:00 PM</td>
                    <td>0.00</td>
                    <td>
                      <span className="text-success">152.00</span>
                    </td>
                    <td>0.00</td>
                    <td>
                      {" "}
                      <span className="text-success">152.00</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-start">11</td>
                    <td>Cricket</td>
                    <td>
                      <a href="/downlinesportspl-sports-wise"> Gloucestershire v Kent</a>
                    </td>
                    <td>7/26/2026, 3:30:00 PM</td>
                    <td>
                      <span className="text-danger">-258.00</span>
                    </td>
                    <td>0.00</td>
                    <td>0.00</td>
                    <td>
                      {" "}
                      <span className="text-danger">-258.00</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-start">12</td>
                    <td>Cricket</td>
                    <td>
                      <a href="/downlinesportspl-sports-wise">
                        {" "}
                        Leicestershire v Lancashire
                      </a>
                    </td>
                    <td>7/26/2026, 3:30:00 PM</td>
                    <td>0.00</td>
                    <td>
                      <span className="text-success">515.00</span>
                    </td>
                    <td>0.00</td>
                    <td>
                      {" "}
                      <span className="text-success">515.00</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-start">13</td>
                    <td>Cricket</td>
                    <td>
                      <a href="/downlinesportspl-sports-wise">
                        {" "}
                        Worcestershire v Hampshire
                      </a>
                    </td>
                    <td>7/26/2026, 3:30:00 PM</td>
                    <td>0.00</td>
                    <td>
                      <span className="text-success">1,300.00</span>
                    </td>
                    <td>0.00</td>
                    <td>
                      {" "}
                      <span className="text-success">1,300.00</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-start">14</td>
                    <td>Cricket</td>
                    <td>
                      <a href="/downlinesportspl-sports-wise"> Middlesex v Glamorgan</a>
                    </td>
                    <td>7/26/2026, 3:30:00 PM</td>
                    <td>0.00</td>
                    <td>
                      <span className="text-success">1,000.00</span>
                    </td>
                    <td>0.00</td>
                    <td>
                      {" "}
                      <span className="text-success">1,000.00</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-start">15</td>
                    <td>Cricket</td>
                    <td>
                      <a href="/downlinesportspl-sports-wise"> Kent W v Middlesex W</a>
                    </td>
                    <td>7/26/2026, 3:00:00 PM</td>
                    <td>
                      <span className="text-danger">-500.00</span>
                    </td>
                    <td>0.00</td>
                    <td>0.00</td>
                    <td>
                      {" "}
                      <span className="text-danger">-500.00</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-start">16</td>
                    <td>Cricket</td>
                    <td>
                      <a href="/downlinesportspl-sports-wise">
                        {" "}
                        Kandy Royals v Jaffna Kings
                      </a>
                    </td>
                    <td>7/26/2026, 3:00:00 PM</td>
                    <td>0.00</td>
                    <td>
                      <span className="text-success">39,268.00</span>
                    </td>
                    <td>0.00</td>
                    <td>
                      {" "}
                      <span className="text-success">39,268.00</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-start">17</td>
                    <td>Cricket</td>
                    <td>
                      <a href="/downlinesportspl-sports-wise"> Romania v Austria</a>
                    </td>
                    <td>7/26/2026, 12:30:00 PM</td>
                    <td>0.00</td>
                    <td>
                      <span className="text-success">100.00</span>
                    </td>
                    <td>0.00</td>
                    <td>
                      {" "}
                      <span className="text-success">100.00</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-start">18</td>
                    <td>Cricket</td>
                    <td>
                      <a href="/downlinesportspl-sports-wise">
                        {" "}
                        Guyana Amazon Warriors v Desert Vipers
                      </a>
                    </td>
                    <td>7/26/2026, 4:30:00 AM</td>
                    <td>
                      <span className="text-danger">-8,934.00</span>
                    </td>
                    <td>0.00</td>
                    <td>0.00</td>
                    <td>
                      {" "}
                      <span className="text-danger">-8,934.00</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-start">19</td>
                    <td>Cricket</td>
                    <td>
                      <a href="/downlinesportspl-sports-wise"> Welsh Fire v MI London</a>
                    </td>
                    <td>7/25/2026, 10:30:00 PM</td>
                    <td>
                      <span className="text-danger">-45,990.50</span>
                    </td>
                    <td>0.00</td>
                    <td>0.00</td>
                    <td>
                      {" "}
                      <span className="text-danger">-45,990.50</span>
                    </td>
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
  </div>
</section>

</div>
    );
}