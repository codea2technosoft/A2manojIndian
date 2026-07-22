import React from 'react'

function Sms() {
    return (
        <div className='allcommon'>
            <section className="main-inner-outer py-4">
                <div className="container-fluid">
                    <div className="row">
                        <div className="db-sec">
                            <h2 className="common-heading">SMS</h2>
                        </div>
                        <div className="col-md-12">
                            <div className="inner-wrapper">
                                <form className="bet_status">
                                    <div className="row">
                                        <div className="col-xl-12 col-md-12">
                                            <div className="row">
                                                <div className="mb-lg-0 mb-3 flex-grow-0 pe-3  col-lg-3 col-sm-6">
                                                    <div className="position-relative">
                                                        <input
                                                            placeholder="Keyword"
                                                            type="text"
                                                            className="form-control"
                                                            defaultValue=""
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mb-lg-0 mb-3 flex-grow-0 pe-3  col-lg-3 col-sm-6">
                                                    <div className="bet-sec bet-period">
                                                        <label className="px-2 form-label">From</label>
                                                        <div className="form-group">
                                                            <input
                                                                max="2026-07-04"
                                                                type="date"
                                                                className="small_form_control form-control"
                                                                defaultValue="2026-07-03"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mb-lg-0 mb-3 flex-grow-0 ps-3 col-lg-3 col-sm-6">
                                                    <div className="bet-sec bet-period">
                                                        <label className="px-2 form-label">To</label>
                                                        <div className="form-group">
                                                            <input
                                                                min="2026-07-03"
                                                                max="2026-07-04"
                                                                type="date"
                                                                className="small_form_control form-control"
                                                                defaultValue="2026-07-04"
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
                                                    className="me-0 theme_dark_btn btn btn-primary"
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
                        <div className="mt-2 col-lg-12 col-md-12 col-sm-12">
                            <section className="account-table aprofit-downline-sms">
                                <div className="responsive transaction-history">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th scope="col">Sr no.</th>
                                                <th scope="col">Sender</th>
                                                <th scope="col">Message</th>
                                                <th scope="col">Message Time</th>
                                                <th scope="col">Transaction ID</th>
                                                <th scope="col">App User</th>
                                                <th scope="col">Device Name</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td colSpan={12}>
                                                    <span>You have no bets in this time period.</span>
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

export default Sms
