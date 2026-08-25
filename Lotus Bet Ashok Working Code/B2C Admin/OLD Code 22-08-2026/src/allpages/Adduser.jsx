import React from 'react'

function Adduser() {
    return (
        <div className='allcommon'>
            <form className="super-admin-form">
                <div className="row">
                    <div className="mb-2 mb-md-3 col-sm-12">
                        <div className="row">
                            <div className="col-md-4">
                                <label className="form-label">Email</label>
                            </div>
                            <div className="col-md-8">
                                <input
                                    placeholder="Enter Email"
                                    name="email"
                                    type="email"
                                    className="form-control"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mb-2 mb-md-3 col-sm-12">
                        <div className="row">
                            <div className="col-md-4">
                                <label className="form-label">Username</label>
                            </div>
                            <div className="col-md-8">
                                <input
                                    placeholder="Enter username"
                                    name="username"
                                    type="text"
                                    className="form-control"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mb-2 mb-md-3 col-sm-12">
                        <div className="row">
                            <div className="col-md-4">
                                <label className="form-label">First Name</label>
                            </div>
                            <div className="col-md-8">
                                <input
                                    placeholder="Enter firstName"
                                    name="firstName"
                                    type="text"
                                    className="form-control"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mb-2 mb-md-3 col-sm-12">
                        <div className="row">
                            <div className="col-md-4">
                                <label className="form-label">Last Name</label>
                            </div>
                            <div className="col-md-8">
                                <input
                                    placeholder="Enter lastName"
                                    name="lastName"
                                    type="text"
                                    className="form-control"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mb-2 mb-md-3 col-sm-12">
                        <div className="row">
                            <div className="col-md-4">
                                <label className="form-label">Password</label>
                            </div>
                            <div className="col-md-8">
                                <input
                                    placeholder="Enter Password"
                                    name="password"
                                    type="password"
                                    className="form-control"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mb-2 mb-md-3 col-sm-12">
                        <div className="row">
                            <div className="col-md-4">
                                <label className="form-label">Confirm Password</label>
                            </div>
                            <div className="col-md-8">
                                <input
                                    placeholder="Confirm Password"
                                    name="confirmPassword"
                                    type="password"
                                    className="form-control"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mb-2 mb-md-3 col-sm-12">
                        <div className="row">
                            <div className="col-md-4">
                                <label className="form-label">Phone</label>
                            </div>
                            <div className="col-md-8">
                                <input
                                    placeholder="Enter Phone Number"
                                    name="phone"
                                    type="text"
                                    className="form-control"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mb-2 mb-md-3 col-sm-12">
                        <div className="row">
                            <div className="col-md-4">
                                <label className="form-label">Exposure Limit</label>
                            </div>
                            <div className="col-md-8">
                                <input
                                    placeholder="Enter Exposure Limit"
                                    name="exposureLimit"
                                    type="number"
                                    className="form-control"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-3 text-center">
                    <button type="submit" className="theme_dark_btn px-5 btn btn-primary">
                        Create
                    </button>
                </div>
            </form>

        </div>
    )
}

export default Adduser
