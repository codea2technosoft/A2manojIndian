import React, { useState } from "react";

export default function Offer() {
    const [statusFilter, setStatusFilter] = useState("active");
    const [offerModel, setofferModel] = useState(false);
    const handleOpenModal = () => setofferModel(true);
    const handleCloseModal = () => setofferModel(false);

    const [viewmodal, setViewmodal] = useState(false);
    const handleviewshow = (item) => {
        setViewmodal(item);
    };
    const handleviewshowclose = () => setViewmodal(false);

    const offers = [
        {
            id: 1,
            title: "ON EVERY DEPOSIT 5%",
            category: "Deposit",
            type: "Percentage",
            offerOn: "OnEveryDeposit",
            startDate: "11/23/2025, 5:30:00 AM",
            endDate: "12/31/2025, 5:30:00 AM",
            status: "active",
        },
        {
            id: 2,
            title: "ON FIRST DEPOSIT 10%",
            category: "Deposit",
            type: "Percentage",
            offerOn: "OnFirstDeposit",
            startDate: "11/23/2025, 5:30:00 AM",
            endDate: "5/30/2026, 5:30:00 AM",
            status: "inactive",
        },
        {
            id: 3,
            title: "On Every Deposit 5 %",
            category: "Deposit",
            type: "Percentage",
            offerOn: "OnEveryDeposit",
            startDate: "5/29/2026, 5:30:00 AM",
            endDate: "5/29/2026, 5:30:00 AM",
            status: "active",
        },
    ];

    // 🔥 FILTER LOGIC
    const filteredOffers = offers.filter((item) => {
        if (statusFilter === "active") return item.status === "active";
        if (statusFilter === "inactive") return item.status === "inactive";
        return true;
    });

    return (
        <main className="allcommon">
            <section className="main-inner-outer py-4">
                {/* HEADER */}
                <div className="db-sec d-flex justify-content-between align-items-center w-100 mb-2">

                    <h2
                        className="common-heading"
                        style={{ display: "flex", alignItems: "center" }}
                    >
                        Offer

                        {/* FILTER DROPDOWN */}
                        <select
                            className="form-select"
                            style={{ marginLeft: "10px", height: "auto" }}
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="active">Active</option>
                            <option value="inactive">In Active</option>
                            <option value="all">All</option>
                        </select>
                    </h2>

                    <button type="button" onClick={handleOpenModal} className="theme_light_btn btn btn-primary">
                        + Add Offer
                    </button>
                </div>
                {/* TABLE */}
                <div className="inner-wrapper">
                    <div className="common-container">
                        <div className="account-table batting-table">
                            <div className="responsive">

                                <table className="w-100 table">
                                    <thead>
                                        <tr>
                                            <th>Sr no.</th>
                                            <th>Title</th>
                                            <th>Category</th>
                                            <th>Offer Type</th>
                                            <th>Offer On</th>
                                            <th>Offer Start Date</th>
                                            <th>Offer End Date</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {filteredOffers.length > 0 ? (
                                            filteredOffers.map((item, index) => (
                                                <tr key={item.id}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.title}</td>
                                                    <td>{item.category}</td>
                                                    <td>{item.type}</td>
                                                    <td>{item.offerOn}</td>
                                                    <td>{item.startDate}</td>
                                                    <td>{item.endDate}</td>

                                                    <td>
                                                        <button className="theme_light_btn btn btn-primary" onClick={() => handleviewshow(item)}>
                                                            View
                                                        </button>

                                                        <button className="theme_light_btn btn btn-primary">
                                                            {item.status === "active" ? "Active" : "Inactive"}
                                                        </button>

                                                        <button className="theme_light_btn btn btn-primary">
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="8" style={{ textAlign: "center" }}>
                                                    No Offers Found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>

                                </table>

                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {offerModel && (
                <div className="allcommon">
                    <div
                        className="modal show d-block"
                        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                        onClick={handleCloseModal}
                    >
                        <div
                            className="modal-dialog modal-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-content p-0">
                                <div className="border-0 pb-0 modal-header">
                                    <h5 className="modal-title-status modal-title h4">Add Offer</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={handleCloseModal}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <div>
                                        <form className="">
                                            <div className="row">

                                                <div className="mb-2 col-lg-4 col-md-4 col-sm-12">
                                                    <div className="row">
                                                        <div>
                                                            <span style={{ fontSize: 13, fontWeight: 500 }}>Category</span>
                                                            <select
                                                                name="category"
                                                                className="mt-1 form-select"
                                                                style={{ height: 36 }}
                                                            >

                                                                <option value="">Select Category</option>
                                                                <option value="Deposit">Deposit</option>
                                                                <option value="Welcome Offer">Welcome Offer</option>
                                                                <option value="Slots">Slots</option>
                                                                <option value="Casino">Casino</option>
                                                                <option value="Sports">Sports</option>
                                                                <option value="Fishing">Fishing</option>
                                                                <option value="Card Game">Card Game</option>
                                                                <option value="ESports">ESports</option>
                                                                <option value="Lottery">Lottery</option>
                                                                <option value="P2P">P2P</option>
                                                                <option value="Table">Table</option>
                                                                <option value="Arcade">Arcade</option>
                                                                <option value="Cock Fighting">Cock Fighting</option>
                                                                <option value="Rain">Rain</option>
                                                                <option value="Crash">Crash</option>
                                                                <option value="Tips">Tips</option>
                                                                <option value="Others">Others</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mb-2 col-lg-4 col-md-4 col-sm-12">
                                                    <div className="row">
                                                        <div>
                                                            <span style={{ fontSize: 13, fontWeight: 500 }}>
                                                                Offer Start DateTime *
                                                            </span>
                                                            <input
                                                                max="2026-07-04"
                                                                name="offerStartDateTime"
                                                                type="date"
                                                                className="mt-1 form-control"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mb-2 col-lg-4 col-md-4 col-sm-12">
                                                    <div className="row">
                                                        <div>
                                                            <span style={{ fontSize: 13, fontWeight: 500 }}>
                                                                Offer End DateTime *
                                                            </span>
                                                            <input
                                                                min="Sat Jul 04 2026 12:04:29 GMT+0530 (India Standard Time)"
                                                                disabled=""
                                                                name="offerEndDateTime"
                                                                type="date"
                                                                className="mt-1 form-control"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mb-2 col-lg-4 col-md-4 col-sm-12">
                                                    <div className="row">
                                                        <div>
                                                            <span style={{ fontSize: 13, fontWeight: 500 }}>
                                                                Display Order *
                                                            </span>
                                                            <input
                                                                placeholder="Display Order"
                                                                name="displayOrder"
                                                                type="number"
                                                                className="mt-1 form-control"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mb-2 col-lg-4 col-md-4 col-sm-12">
                                                    <div className="row">
                                                        <div>
                                                            <span style={{ fontSize: 13, fontWeight: 500 }}>Title *</span>
                                                            <input
                                                                placeholder="Title"
                                                                name="title"
                                                                type="text"
                                                                className="mt-1 form-control"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mb-2 col-lg-4 col-md-4 col-sm-12">
                                                    <div className="row">
                                                        <div>
                                                            <span style={{ fontSize: 13, fontWeight: 500 }}>Bonus Code *</span>
                                                            <input
                                                                placeholder="Bonus Code"
                                                                name="bonusCode"
                                                                type="text"
                                                                className="mt-1 form-control"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mb-2 col-lg-4 col-md-4 col-sm-12">
                                                    <div className="row">
                                                        <div>
                                                            <span style={{ fontSize: 13, fontWeight: 500 }}>
                                                                Bonus Expire in Days *
                                                            </span>
                                                            <input
                                                                placeholder="Bonus Expire in Days"
                                                                name="bonusExpireinDays"
                                                                type="number"
                                                                className="mt-1 form-control"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mb-2 col-lg-4 col-md-4 col-sm-12">
                                                    <div className="row">
                                                        <div>
                                                            <span style={{ fontSize: 13, fontWeight: 500 }}>
                                                                Required Turnover *
                                                            </span>
                                                            <input
                                                                placeholder="Required Turnover"
                                                                name="requiredTurnover"
                                                                type="number"
                                                                className="mt-1 form-control"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mb-2 col-lg-4 col-md-4 col-sm-12">
                                                    <div className="row">
                                                        <div>
                                                            <span style={{ fontSize: 13, fontWeight: 500 }}>Offer On *</span>
                                                            <select
                                                                name="offerOn"
                                                                className="mt-1 form-select"
                                                                style={{ height: 36 }}
                                                            >

                                                                <option value="">Select Deposite Type</option>
                                                                <option value="OnFirstDeposit">OnFirstDeposit</option>
                                                                <option value="OnDeposit">OnDeposit</option>
                                                                <option value="OnRegister">OnRegister</option>
                                                                <option value="OnSecondDeposit">OnSecondDeposit</option>
                                                                <option value="OnThirdDeposit">OnThirdDeposit</option>
                                                                <option value="OnEveryDeposit">OnEveryDeposit</option>
                                                                <option value="SpecialOffer">SpecialOffer</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mb-2 col-lg-4 col-md-4 col-sm-12">
                                                    <div className="row">
                                                        <div>
                                                            <span style={{ fontSize: 13, fontWeight: 500 }}>Max User *</span>
                                                            <input
                                                                placeholder="Max User"
                                                                name="maxUser"
                                                                type="number"
                                                                className="mt-1 form-control"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mb-2 col-lg-4 col-md-4 col-sm-12">
                                                    <div className="row">
                                                        <div>
                                                            <span style={{ fontSize: 13, fontWeight: 500 }}>
                                                                Offer Budget *
                                                            </span>
                                                            <input
                                                                placeholder="Offer Budget"
                                                                name="offerBudget"
                                                                type="number"
                                                                className="mt-1 form-control"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mb-2 col-lg-4 col-md-4 col-sm-12">
                                                    <div className="row">
                                                        <div>
                                                            <span style={{ fontSize: 13, fontWeight: 500 }}>Offer Type *</span>
                                                            <select
                                                                name="offerType"
                                                                className="mt-1 form-select"
                                                                style={{ height: 36 }}
                                                            >

                                                                <option value="">Select Offer Type</option>
                                                                <option value="Fixed">Fixed</option>
                                                                <option value="Percentage">Percentage</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mb-2 col-lg-4 col-md-4 col-sm-12">
                                                    <div className="row">
                                                        <div>
                                                            <span style={{ fontSize: 13, fontWeight: 500 }}>
                                                                Minimum Deposite *
                                                            </span>
                                                            <input
                                                                placeholder="Minimum Deposite"
                                                                name="minimumDeposite"
                                                                type="number"
                                                                className="mt-1 form-control"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mb-2 col-lg-4 col-md-4 col-sm-12">
                                                    <div className="row">
                                                        <div>
                                                            <span style={{ fontSize: 13, fontWeight: 500 }}>
                                                                Maximum Deposite *
                                                            </span>
                                                            <input
                                                                placeholder="Maximum Deposite"
                                                                name="maximumDeposite"
                                                                type="number"
                                                                className="mt-1 form-control"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="mb-2 col-sm-12">
                                                    <div className="row">
                                                        <div>
                                                            <span style={{ fontSize: 13, fontWeight: 500 }}>Description</span>
                                                            <textarea
                                                                rows={3}
                                                                placeholder="Description"
                                                                name="description"
                                                                className="mt-1 form-control"
                                                                style={{ height: 80 }}
                                                                defaultValue={""}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mb-2 col-lg-6 col-md-6 col-sm-12">
                                                    <div className="row">
                                                        <div>
                                                            <input
                                                                type="file"
                                                                className="fileInput"
                                                                accept="image/webp, image/png, image/jiffy, image/jpeg, image/jpg"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="d-flex justify-content-end align-items-center mt-1">
                                                <button
                                                    type="submit"
                                                    className="green-btn btn btn-primary"
                                                    style={{ color: "black" }}
                                                >
                                                    Submit
                                                </button>
                                                <button
                                                    type="button"
                                                    className="theme_light_btn btn btn-primary btn btn-primary"
                                                    style={{ marginLeft: 10 }}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    </div>

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            )}
            {viewmodal && (
                <div className="allcommon">
                    <div
                        className="modal show d-block"
                        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                        onClick={handleviewshowclose}
                    >
                        <div
                            className="modal-dialog modal-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-content p-0">
                                <div className="border-0 pb-0 modal-header">
                                    <h5 className="modal-title-status modal-title h4">Add Offer</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={handleviewshowclose}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <div>
                                        <form className="">
                                            <div className="row">

                                                <div className="mb-2 col-lg-4 col-md-4 col-sm-12">
                                                    <div className="row">
                                                        <div>
                                                            <span style={{ fontSize: 13, fontWeight: 500 }}>Category</span>
                                                            <select
                                                                disabled=""
                                                                name="category"
                                                                className="mt-1 form-select"
                                                                style={{ height: 36 }}
                                                            >

                                                                <option value="">Select Category</option>
                                                                <option value="Deposit">Deposit</option>
                                                                <option value="Welcome Offer">Welcome Offer</option>
                                                                <option value="Slots">Slots</option>
                                                                <option value="Casino">Casino</option>
                                                                <option value="Sports">Sports</option>
                                                                <option value="Fishing">Fishing</option>
                                                                <option value="Card Game">Card Game</option>
                                                                <option value="ESports">ESports</option>
                                                                <option value="Lottery">Lottery</option>
                                                                <option value="P2P">P2P</option>
                                                                <option value="Table">Table</option>
                                                                <option value="Arcade">Arcade</option>
                                                                <option value="Cock Fighting">Cock Fighting</option>
                                                                <option value="Rain">Rain</option>
                                                                <option value="Crash">Crash</option>
                                                                <option value="Tips">Tips</option>
                                                                <option value="Others">Others</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mb-2 col-lg-4 col-md-4 col-sm-12">
                                                    <div className="row">
                                                        <div>
                                                            <span style={{ fontSize: 13, fontWeight: 500 }}>
                                                                Offer Start DateTime *
                                                            </span>
                                                            <input
                                                                disabled=""
                                                                max="2026-07-04"
                                                                name="offerStartDateTime"
                                                                type="date"
                                                                className="mt-1 form-control"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mb-2 col-lg-4 col-md-4 col-sm-12">
                                                    <div className="row">
                                                        <div>
                                                            <span style={{ fontSize: 13, fontWeight: 500 }}>
                                                                Offer End DateTime *
                                                            </span>
                                                            <input
                                                                min="2025-11-23"
                                                                name="offerEndDateTime"
                                                                type="date"
                                                                className="mt-1 form-control"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mb-2 col-lg-4 col-md-4 col-sm-12">
                                                    <div className="row">
                                                        <div>
                                                            <span style={{ fontSize: 13, fontWeight: 500 }}>
                                                                Display Order *
                                                            </span>
                                                            <input
                                                                disabled=""
                                                                placeholder="Display Order"
                                                                name="displayOrder"
                                                                type="number"
                                                                className="mt-1 form-control"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mb-2 col-lg-4 col-md-4 col-sm-12">
                                                    <div className="row">
                                                        <div>
                                                            <span style={{ fontSize: 13, fontWeight: 500 }}>Title *</span>
                                                            <input
                                                                disabled=""
                                                                placeholder="Title"
                                                                name="title"
                                                                type="text"
                                                                className="mt-1 form-control"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mb-2 col-lg-4 col-md-4 col-sm-12">
                                                    <div className="row">
                                                        <div>
                                                            <span style={{ fontSize: 13, fontWeight: 500 }}>Bonus Code *</span>
                                                            <input
                                                                disabled=""
                                                                placeholder="Bonus Code"
                                                                name="bonusCode"
                                                                type="text"
                                                                className="mt-1 form-control"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mb-2 col-lg-4 col-md-4 col-sm-12">
                                                    <div className="row">
                                                        <div>
                                                            <span style={{ fontSize: 13, fontWeight: 500 }}>
                                                                Bonus Expire in Days *
                                                            </span>
                                                            <input
                                                                disabled=""
                                                                placeholder="Bonus Expire in Days"
                                                                name="bonusExpireinDays"
                                                                type="number"
                                                                className="mt-1 form-control"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mb-2 col-lg-4 col-md-4 col-sm-12">
                                                    <div className="row">
                                                        <div>
                                                            <span style={{ fontSize: 13, fontWeight: 500 }}>
                                                                Required Turnover *
                                                            </span>
                                                            <input
                                                                disabled=""
                                                                placeholder="Required Turnover"
                                                                name="requiredTurnover"
                                                                type="number"
                                                                className="mt-1 form-control"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mb-2 col-lg-4 col-md-4 col-sm-12">
                                                    <div className="row">
                                                        <div>
                                                            <span style={{ fontSize: 13, fontWeight: 500 }}>Offer On *</span>
                                                            <select
                                                                disabled=""
                                                                name="offerOn"
                                                                className="mt-1 form-select"
                                                                style={{ height: 36 }}
                                                            >

                                                                <option value="">Select Deposite Type</option>
                                                                <option value="OnFirstDeposit">OnFirstDeposit</option>
                                                                <option value="OnDeposit">OnDeposit</option>
                                                                <option value="OnRegister">OnRegister</option>
                                                                <option value="OnSecondDeposit">OnSecondDeposit</option>
                                                                <option value="OnThirdDeposit">OnThirdDeposit</option>
                                                                <option value="OnEveryDeposit">OnEveryDeposit</option>
                                                                <option value="SpecialOffer">SpecialOffer</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mb-2 col-lg-4 col-md-4 col-sm-12">
                                                    <div className="row">
                                                        <div>
                                                            <span style={{ fontSize: 13, fontWeight: 500 }}>Max User *</span>
                                                            <input
                                                                disabled=""
                                                                placeholder="Max User"
                                                                name="maxUser"
                                                                type="number"
                                                                className="mt-1 form-control"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mb-2 col-lg-4 col-md-4 col-sm-12">
                                                    <div className="row">
                                                        <div>
                                                            <span style={{ fontSize: 13, fontWeight: 500 }}>
                                                                Offer Budget *
                                                            </span>
                                                            <input
                                                                disabled=""
                                                                placeholder="Offer Budget"
                                                                name="offerBudget"
                                                                type="number"
                                                                className="mt-1 form-control"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mb-2 col-lg-4 col-md-4 col-sm-12">
                                                    <div className="row">
                                                        <div>
                                                            <span style={{ fontSize: 13, fontWeight: 500 }}>Offer Type *</span>
                                                            <select
                                                                disabled=""
                                                                name="offerType"
                                                                className="mt-1 form-select"
                                                                style={{ height: 36 }}
                                                            >

                                                                <option value="">Select Offer Type</option>
                                                                <option value="Fixed">Fixed</option>
                                                                <option value="Percentage">Percentage</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mb-2 col-lg-4 col-md-4 col-sm-12">
                                                    <div className="row">
                                                        <div>
                                                            <span style={{ fontSize: 13, fontWeight: 500 }}>
                                                                Percentage Value *
                                                            </span>
                                                            <input
                                                                disabled=""
                                                                placeholder="Percentage Value"
                                                                name="percentageValue"
                                                                type="number"
                                                                className="mt-1 form-control"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mb-2 col-lg-4 col-md-4 col-sm-12">
                                                    <div className="row">
                                                        <div>
                                                            <span style={{ fontSize: 13, fontWeight: 500 }}>
                                                                Minimum Deposite *
                                                            </span>
                                                            <input
                                                                disabled=""
                                                                placeholder="Minimum Deposite"
                                                                name="minimumDeposite"
                                                                type="number"
                                                                className="mt-1 form-control"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mb-2 col-lg-4 col-md-4 col-sm-12">
                                                    <div className="row">
                                                        <div>
                                                            <span style={{ fontSize: 13, fontWeight: 500 }}>
                                                                Maximum Deposite *
                                                            </span>
                                                            <input
                                                                disabled=""
                                                                placeholder="Maximum Deposite"
                                                                name="maximumDeposite"
                                                                type="number"
                                                                className="mt-1 form-control"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mb-2 col-lg-4 col-md-4 col-sm-12">
                                                    <div className="row">
                                                        <div>
                                                            <span style={{ fontSize: 13, fontWeight: 500 }}>
                                                                Max Bounus Value UpTo *
                                                            </span>
                                                            <input
                                                                disabled=""
                                                                placeholder="Max Bounus Value UpTo"
                                                                name="maxBounusValueUpTo"
                                                                type="number"
                                                                className="mt-1 form-control"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="mb-2 col-sm-12">
                                                    <div className="row">
                                                        <div>
                                                            <span style={{ fontSize: 13, fontWeight: 500 }}>Description</span>
                                                            <textarea
                                                                disabled=""
                                                                rows={3}
                                                                placeholder="Description"
                                                                name="description"
                                                                className="mt-1 form-control"
                                                                style={{ height: 80 }}
                                                                defaultValue={""}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mb-2 col-lg-6 col-md-6 col-sm-12">
                                                    <div className="row">
                                                        <div>
                                                            <input
                                                                type="file"
                                                                className="fileInput"
                                                                accept="image/webp, image/png, image/jiffy, image/jpeg, image/jpg"
                                                            />
                                                        </div>
                                                        <div className="mt-2 col-sm-12">
                                                            <img src="https://trueexch.com:5022/banner-uploads/txnrep-442WhatsAppImage 2025-06-28 at 3.36.04 PM.jpeg" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="d-flex justify-content-end align-items-center mt-1">
                                                <button
                                                    type="button"
                                                    className="theme_light_btn btn btn-primary btn btn-primary"
                                                    style={{ marginLeft: 10 }}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    </div>


                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}