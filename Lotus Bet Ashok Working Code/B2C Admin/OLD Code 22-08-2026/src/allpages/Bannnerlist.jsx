import React, { useState, useEffect } from 'react';

function Bannnerlist() {

    const [viewmodal, setViewmodal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file));
        }
    };
    const bannerhandleopen = () => {
        setViewmodal(true);
    };
    const bannerhandleclose = () => setViewmodal(false);
    return (
        <main className='allcommon'>
            <section className="main-inner-outer py-4">
                <div className="container-fluid">
                    <div className="db-sec d-flex justify-content-between align-items-center w-100 mb-2">
                        <h2 className="common-heading">Banner</h2>
                        <button type="button" onClick={bannerhandleopen} className=" btn btn-primary">
                            + Add Banner
                        </button>
                    </div>
                    <div className="inner-wrapper">
                        <div className="common-container">
                            <div className="account-table batting-table">
                                <div className="responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th scope="col">Sr no.</th>
                                                <th scope="col">Banner Image</th>
                                                <th scope="col">Device Type</th>
                                                <th scope="col">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td colSpan={12}>
                                                    <span>No Record Found.</span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {viewmodal && (
                <div className="allcommon">
                    <div
                        className="modal show d-block"
                        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                        onClick={bannerhandleclose}
                    >
                        <div
                            className="modal-dialog modal-"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-content">
                                <div className="border-0 pb-0 modal-header">
                                    <h5 className="modal-title-status modal-title h4">Add Offer</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={bannerhandleclose}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="mb-3 col-sm-12">
                                            <div style={{ display: "flex", alignItems: "center", fontSize: 13 }}>
                                                <span style={{ marginRight: 10 }}>IsForWeb</span>
                                                <input type="checkbox" />
                                            </div>
                                        </div>
                                        <div className="mb-2 mb-md-3 col-sm-12">
                                            <input
                                                type="file"
                                                className="fileInput"
                                                accept="image/webp, image/png, image/jpeg, image/jpg"
                                                onChange={handleImageChange}
                                            />
                                        </div>
                                        {selectedImage && (
                                            <div className="mb-3 col-sm-12">
                                                <img
                                                    src={selectedImage}
                                                    alt="preview"
                                                    style={{ width: "100%", maxHeight: "200px", objectFit: "contain" }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <button type="submit" className="theme_dark_btn px-5 btn btn-primary">
                                        Add
                                    </button>

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}

export default Bannnerlist
