import React, { useMemo, useState } from "react";
import { FaFilter } from "react-icons/fa"; // install react-icons if not installed
import { FaCalendarAlt, FaSortDown } from "react-icons/fa";

// --- Helpers ---
function toDate(d) {
    return typeof d === "string" ? new Date(d + "T00:00:00") : d;
}

function currency(n) {
    return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function isValid(s) {
    const d = new Date(s);
    return !Number.isNaN(d.getTime());
}

// --- Demo Data ---
const DEMO_TXNS = [
    { id: 1, date: "2025-08-01", type: "credit", amount: 1500, remark: "Deposit" },
    { id: 2, date: "2025-08-02", type: "debit", amount: 200, remark: "Bet Loss" },
    { id: 3, date: "2025-08-03", type: "credit", amount: 300, remark: "Referral Bonus" },
    { id: 4, date: "2025-08-04", type: "debit", amount: 120, remark: "Withdrawal Fee" },
    { id: 5, date: "2025-08-05", type: "debit", amount: 500, remark: "Withdrawal" },
    { id: 6, date: "2025-08-07", type: "credit", amount: 800, remark: "Deposit" },
    { id: 7, date: "2025-08-08", type: "debit", amount: 350, remark: "Bet Loss" },
    { id: 8, date: "2025-08-09", type: "credit", amount: 250, remark: "Cashback" },
    { id: 9, date: "2025-08-11", type: "debit", amount: 150, remark: "Service Charge" },
    { id: 10, date: "2025-08-12", type: "credit", amount: 1200, remark: "Deposit" },
    { id: 11, date: "2025-08-13", type: "debit", amount: 400, remark: "Bet Loss" },
    { id: 12, date: "2025-08-14", type: "credit", amount: 220, remark: "Promo Bonus" },
    { id: 13, date: "2025-08-16", type: "credit", amount: 700, remark: "Deposit" },
    { id: 14, date: "2025-08-17", type: "debit", amount: 100, remark: "Small Withdrawal" },
    { id: 15, date: "2025-08-19", type: "credit", amount: 350, remark: "Cashback" },
    { id: 16, date: "2025-08-20", type: "debit", amount: 600, remark: "Bet Loss" },
    { id: 17, date: "2025-08-22", type: "credit", amount: 900, remark: "Deposit" },
    { id: 18, date: "2025-08-24", type: "debit", amount: 300, remark: "Withdrawal" },
    { id: 19, date: "2025-08-26", type: "credit", amount: 150, remark: "Promo Bonus" },
    { id: 20, date: "2025-08-28", type: "debit", amount: 200, remark: "Service Charge" },
];

// --- Component ---
export default function AccountStatement() {
    const todayStr = new Date().toISOString().slice(0, 10);
    const defaultFrom = "2025-08-01";
    const defaultTo = todayStr;

    const [fromDate, setFromDate] = useState(defaultFrom);
    const [toDateState, setToDate] = useState(defaultTo);
    const [pageSize, setPageSize] = useState(10);
    const [applied, setApplied] = useState({ from: defaultFrom, to: defaultTo, size: 10 });

    const applyFilters = () => {
        setApplied({ from: fromDate, to: toDateState, size: pageSize });
    };

    const resetFilters = () => {
        setFromDate(defaultFrom);
        setToDate(defaultTo);
        setPageSize(10);
        setApplied({ from: defaultFrom, to: defaultTo, size: 10 });
    };

    const { openingBalance, closingBalance, rows } = useMemo(() => {
        const from = isValid(applied.from) ? toDate(applied.from) : toDate(defaultFrom);
        const to = isValid(applied.to) ? toDate(applied.to) : toDate(defaultTo);

        // Opening balance
        const opening = DEMO_TXNS.reduce((acc, t) => {
            const td = toDate(t.date);
            if (td < from) return acc + (t.type === "credit" ? t.amount : -t.amount);
            return acc;
        }, 0);

        // Filter range
        const within = DEMO_TXNS.filter((t) => {
            const td = toDate(t.date);
            return td >= from && td <= to;
        }).sort((a, b) => a.date.localeCompare(b.date));

        let running = opening;
        const withBalance = within.map((t, idx) => {
            running += t.type === "credit" ? t.amount : -t.amount;
            return { sn: idx + 1, ...t, balance: running };
        });

        return {
            openingBalance: opening,
            closingBalance: running,
            rows: withBalance.slice(0, applied.size),
        };
    }, [applied]);
    const [showMobile, setShowMobile] = useState(false);
    return (
        <section className="account_statement">
           <div className="container-fluid">
             <div className="card">

                <div className="card-header bg-gradient-color">
                    {/* Desktop Filters */}
                    <div className="d-none d-md-flex align-items-end gap-2 justify-content-between">
                        <div className="form-group position-relative">
                            <label>From:</label>
                            <div className="input-icon">
                                <input
                                    type="date"
                                    className="form-control"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                />
                                <FaCalendarAlt className="input-icon-icon" />
                            </div>
                        </div>

                        <div className="form-group position-relative">
                            <label>To:</label>
                            <div className="input-icon">
                                <input
                                    type="date"
                                    className="form-control"
                                    value={toDateState}
                                    onChange={(e) => setToDate(e.target.value)}
                                />
                                <FaCalendarAlt className="input-icon-icon" />
                            </div>
                        </div>

                        <div className="form-group position-relative">
                            <label>Show:</label>
                            <div className="input-icon">
                                <select
                                    className="form-control"
                                    value={pageSize}
                                    onChange={(e) => setPageSize(Number(e.target.value))}
                                >
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                </select>
                                <FaSortDown className="input-icon-icon" />
                            </div>
                        </div>

                        <div className="d-flex gap-2">
                            <button className="gobutton fillterbutton" onClick={applyFilters}>
                                Go
                            </button>
                            <button className="resetbutton fillterbutton" onClick={resetFilters}>
                                Reset
                            </button>
                        </div>
                    </div>

                    {/* Mobile Filter Toggle Button */}
                    <div className="d-flex align-items-center d-md-none justify-content-between">
                        <div className="title">
                            <h3 className="text-white mb-0">Settled Bet</h3>
                        </div>
                        <button
                            className="gobutton fillterbutton text-white"
                            onClick={() => setShowMobile(!showMobile)}
                        >
                            <FaFilter /> Filters
                        </button>
                    </div>

                    {/* Mobile Filters Panel */}
                    {showMobile && (
                        <div className="d-md-none mt-2 d-flex flex-wrap gap-2 p-3 align-items-end border rounded bg-dark">
                            <div className="form-group width_50 mb-2 position-relative">
                                <label>From:</label>
                                <div className="input-icon">
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={fromDate}
                                        onChange={(e) => setFromDate(e.target.value)}
                                    />
                                    <FaCalendarAlt className="input-icon-icon" />
                                </div>
                            </div>

                            <div className="form-group width_50 mb-2 position-relative">
                                <label>To:</label>
                                <div className="input-icon">
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={toDateState}
                                        onChange={(e) => setToDate(e.target.value)}
                                    />
                                    <FaCalendarAlt className="input-icon-icon" />
                                </div>
                            </div>

                            <div className="form-group width_50 mb-2 position-relative">
                                <label>Show:</label>
                                <div className="input-icon">
                                    <select
                                        className="form-control"
                                        value={pageSize}
                                        onChange={(e) => setPageSize(Number(e.target.value))}
                                    >
                                        <option value="10">10</option>
                                        <option value="25">25</option>
                                        <option value="50">50</option>
                                        <option value="100">100</option>
                                    </select>
                                    <FaSortDown className="input-icon-icon" />
                                </div>
                            </div>
  <div className="form-group width_50 mb-2 position-relative">
                            <div className="d-flex gap-2">
                                <button className="gobutton fillterbutton w-100" onClick={applyFilters}>
                                    Go
                                </button>
                                <button className="resetbutton fillterbutton w-100" onClick={resetFilters}>
                                    Reset
                                </button>
                            </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table border="1" cellPadding="8" className="table mb-0 table-striped" width="100%">
                            <thead className="thead-dark">
                                <tr>
                                    <th>S.NO</th>
                                    <th>Date</th>
                                    <th>Credit</th>
                                    <th>Debit</th>
                                    <th>Balance</th>
                                    <th>Remark</th>
                                </tr>
                            </thead>
                            <tbody className="">
                                {rows.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: "center" }}>
                                            No transactions in the selected range.
                                        </td>
                                    </tr>
                                ) : (
                                    rows.map((r) => (
                                        <tr key={r.id}>
                                            <td>{r.sn}</td>
                                            <td>{r.date}</td>
                                            <td>{r.type === "credit" ? `+ ${currency(r.amount)}` : "—"}</td>
                                            <td>{r.type === "debit" ? `- ${currency(r.amount)}` : "—"}</td>
                                            <td>{currency(r.balance)}</td>
                                            <td>{r.remark}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
           </div>


        </section>
    );
}
