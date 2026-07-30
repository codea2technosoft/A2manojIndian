import React from "react";
export default function Downlinesportsplsportswise() {
  return (
    <div className="allcommon">
    <section className="main-inner-outer py-4">
  <div className="container-fluid">
    <div className="db-sec">
      <h2 className="common-heading">Show Bet</h2>
    </div>
    <div className="inner-wrapper">
      <div className="common-container">
        <div className="account-table batting-table">
          <div className="responsive">
            <table className="matchbetdetails-table table">
              <thead>
                <tr>
                  <th scope="col">Sports</th>
                  <th scope="col"> Match Name</th>
                  <th scope="col">Client</th>
                  <th scope="col">Type </th>
                  <th scope="col">Selection</th>
                  <th scope="col">Odds</th>
                  <th scope="col">Stake</th>
                  <th scope="col">Place Time</th>
                  <th scope="col">IP</th>
                  <th scope="col">PnL</th>
                  <th scope="col">Result</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="back-bg-row">
                  <td>4</td>
                  <td> West Indies v Pakistan</td>
                  <td> nabi001</td>
                  <td>Yes</td>
                  <td> 30 Over WI || 79</td>
                  <td> 75</td>
                  <td> 100</td>
                  <td> 7/25/2026, 11:42:46 PM</td>
                  <td> 157.45.203.152</td>
                  <td>
                    {" "}
                    <span className="text-success">90</span>
                  </td>
                  <td> Yes</td>
                  <td> completed</td>
                </tr>
                <tr className="back-bg-row">
                  <td>4</td>
                  <td> West Indies v Pakistan</td>
                  <td> nabi001</td>
                  <td>Yes</td>
                  <td> 30 Over WI || 79</td>
                  <td> 82</td>
                  <td> 100</td>
                  <td> 7/25/2026, 11:45:22 PM</td>
                  <td> 157.45.203.152</td>
                  <td>
                    {" "}
                    <span className="text-danger">-(100)</span>
                  </td>
                  <td> Yes</td>
                  <td> completed</td>
                </tr>
                <tr className="back-bg-row">
                  <td>4</td>
                  <td> West Indies v Pakistan</td>
                  <td> nabi001</td>
                  <td>Yes</td>
                  <td> 30 Over WI || 79</td>
                  <td> 80</td>
                  <td> 100</td>
                  <td> 7/25/2026, 11:52:21 PM</td>
                  <td> 157.45.203.152</td>
                  <td>
                    {" "}
                    <span className="text-danger">-(100)</span>
                  </td>
                  <td> Yes</td>
                  <td> completed</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

    </div>
  );
}